# Capitolo 11 — Sistemi distribuiti

Una rete in mezzo cambia il problema.

Non perché la rete sia misteriosa.

Perché introduce una forma di incertezza che dentro un singolo processo tendiamo a dimenticare.

Una funzione locale ci restituisce un valore oppure solleva un errore.

Una chiamata remota può invece lasciarci in una situazione più scomoda:

```text
abbiamo inviato la richiesta
↓
non abbiamo ricevuto la risposta
↓
non sappiamo se l'altra parte
- non l'ha mai ricevuta
- la sta ancora eseguendo
- l'ha eseguita con successo
- ha eseguito il side effect ma ha perso la risposta
- ha eseguito soltanto una parte del lavoro
```

Questa differenza è il cuore dei sistemi distribuiti.

## Non basta aggiungere una queue

Dopo i capitoli precedenti potremmo essere tentati da una progressione troppo semplice:

```text
il sistema cresce
→ aggiungiamo servizi
→ aggiungiamo una queue
→ siamo resilienti
```

Non funziona così.

Una queue cambia il failure model.

Un retry cambia il carico.

Una replica cambia il significato di freshness.

Un consumer concorrente cambia l'ordering.

Una compensazione cambia il workflow di business.

Una nuova dipendenza cambia il blast radius.

La distribuzione non elimina complessità.

La **sposta**.

> **Quando separiamo il tempo e il luogo dell'esecuzione, dobbiamo rendere esplicito anche il significato del fallimento.**

## La nuova esigenza di ESI

Order Operations è ancora un modular monolith.

Abbiamo un database PostgreSQL condiviso come infrastruttura ma ownership logica distinta.

La Operations UI usa API read-oriented.

Non abbiamo ancora introdotto command per refund o remediation economiche.

Questo rimane vero.

Arriva però una nuova esigenza.

Quando un operatore classifica un caso come **payment escalation** e lo prende in carico, Payments & Risk vuole ricevere una notifica affidabile per alimentare il proprio workflow interno.

La richiesta iniziale sembra semplice:

> “Quando salvi l'escalation, chiama l'API Payments.”

La soluzione sincrona sarebbe:

```text
Operator
  ↓
Order Operations
  ↓ local transaction
OperationalCase = Escalated
  ↓ HTTP
Payments & Risk
```

Funziona in demo.

Poi facciamo le domande architetturali.

Che cosa succede se Payments è lento?

L'operatore deve aspettare?

Che cosa succede se il commit locale riesce e la chiamata HTTP fallisce?

Il caso risulta escalato ma Payments non lo sa.

Che cosa succede se Payments esegue la richiesta ma la risposta va persa?

Retryamo?

Possiamo creare due escalation?

Chi riconcilia?

Che cosa vede l'operatore durante un outage di Payments?

La feature locale è diventata un problema distribuito.

## Il compromesso del capitolo

Le parti di ESI hanno esigenze tutte legittime.

### Commerce & Operations

Vuole che la presa in carico e l'escalation della console restino rapide anche se sistemi downstream sono degradati.

### Payments & Risk

Vuole che nessuna escalation accettata da Order Operations venga persa e che un retry non produca due pratiche economiche o operative.

### Platform Engineering

Vuole usare un pattern di messaging governabile e osservabile invece di introdurre collegamenti point-to-point diversi per ogni team.

### Security

Vuole che il messaggio contenga soltanto i dati necessari e che la nuova integrazione non allarghi accidentalmente il perimetro di accesso.

### Finance / FinOps

Non vuole una piattaforma di streaming sovradimensionata per un flusso che, oggi, può essere gestito con una coda o topic durabile standard.

La tensione è quindi:

```text
indipendenza temporale
+ affidabilità di consegna
+ esperienza utente

vs

nuovi stati intermedi
+ duplicati
+ ordering
+ retry
+ DLQ
+ osservabilità
+ costo operativo
```

Non possiamo massimizzare tutto.

## Decisione corrente

Per questa iterazione scegliamo:

```text
transazione locale
+ transactional outbox
+ publisher asincrono
+ broker durabile
+ at-least-once delivery
+ consumer idempotente
+ retry bounded con backoff
+ dead-letter path
+ correlation id
```

Non scegliamo:

```text
exactly-once end-to-end come promessa generica
Kafka perché "si usa nei sistemi seri"
workflow engine general-purpose
saga per una singola notifica
choreography per ogni business rule
retry infinito
ordering globale
```

Questa distinzione è importante.

Stiamo introducendo distribuzione perché abbiamo una forza reale: **il downstream non deve stare nel critical request path e l'intenzione di notificare non deve andare persa dopo il commit locale**.

## Il quality floor

Il compromesso accetta eventual consistency tra Order Operations e Payments & Risk.

Non accetta invece:

- perdita silenziosa di un'escalation dopo il commit;
- doppio side effect per la stessa escalation;
- retry senza limite;
- messaggi senza identità e correlazione;
- payload con dati non necessari;
- DLQ senza ownership operativa;
- impossibilità di distinguere `pending`, `delivered`, `failed`, `dead-lettered`;
- broker outage che impedisce all'operatore di salvare il lavoro locale quando la policy consente elaborazione differita.

> **Eventual consistency non significa eventual correctness. La correttezza resta un requisito; cambia il percorso con cui la raggiungiamo.**

## La realtà delle delivery guarantee

Microsoft Azure Architecture Center documenta che sistemi di messaging con delivery at-least-once possono consegnare più volte lo stesso messaggio e raccomanda consumer idempotenti per evitare side effect duplicati. La stessa guidance ricorda che anche quando un broker offre una forma di exactly-once per ciò che controlla direttamente, non può automaticamente garantire exactly-once sugli effetti esterni prodotti dal consumer.

Fonte:

- [Microsoft Learn — Idempotent Consumer pattern](https://learn.microsoft.com/azure/architecture/patterns/idempotent-consumer)
- [Microsoft Learn — Asynchronous messaging options](https://learn.microsoft.com/azure/architecture/guide/technology-choices/messaging)

AWS Builders' Library affronta lo stesso problema dal lato delle API: se una richiesta può essere ripetuta dopo timeout o failure, un client request identifier esplicito permette al servizio di riconoscere intenti già accettati e rendere i retry più sicuri.

Fonte:

- [Amazon Builders' Library — Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/)

## Il caso reale Uber

Uber ha documentato un sistema di reprocessing e dead-letter queue costruito sopra Kafka per il programma Driver Injury Protection.

Il punto interessante per noi non è Kafka.

È il failure model.

Il team descrive retry inevitabili, dipendenze che possono degradare e la necessità di evitare che il reprocessing di messaggi problematici blocchi il traffico real-time. La soluzione separava il percorso normale dai retry e dai messaggi che richiedevano gestione specifica.

Fonte:

- [Uber Engineering — Building Reliable Reprocessing and Dead Letter Queues with Apache Kafka](https://www.uber.com/blog/reliable-reprocessing/)

Il caso non dimostra che Order Operations debba usare Kafka.

Dimostra qualcosa di più utile:

> **quando introduci asincronia, devi progettare anche il percorso dei messaggi che non progrediscono normalmente.**

## Che cosa impareremo

In questo capitolo lavoreremo su:

- partial failure;
- timeout;
- retry, backoff, jitter e retry budget;
- idempotency;
- queue, pub/sub e streaming;
- at-most-once, at-least-once ed effective exactly-once;
- ordering;
- backpressure;
- dead-letter queue;
- transactional outbox;
- eventual consistency;
- orchestration e choreography;
- saga e compensating transaction;
- failure mode espliciti.

L'artefatto principale sarà la **Failure Mode Map**.

E Order Operations farà un passo avanti reale: introdurremo il primo percorso asincrono persistente del capstone.

La regola del capitolo è semplice da dire e difficile da rispettare:

> **Distribuire il lavoro significa distribuire anche l'incertezza. L'architettura deve decidere dove quell'incertezza può vivere e come viene risolta.**