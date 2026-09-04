# Capitolo 11 — Sistemi distribuiti

Una rete in mezzo cambia il problema perché introduce una forma di incertezza che il codice locale tende a nascondere. Una funzione nello stesso processo, per quanto possa fallire, condivide con il caller memoria, runtime e una nozione relativamente coerente di risultato. Una chiamata remota no.

Quando inviamo una richiesta e non riceviamo risposta, non sappiamo automaticamente se il server non l’abbia mai ricevuta, se la stia ancora eseguendo, se abbia completato il lavoro ma perso la risposta oppure se abbia prodotto soltanto una parte dei side effect attesi. Questa ambiguità è il cuore del capitolo.

```text
richiesta inviata
↓
nessuna risposta osservata
↓
outcome remoto ancora incerto
```

La distribuzione non aggiunge soltanto latency. Aggiunge **stati che il caller non può conoscere direttamente**.

## La resilienza non nasce aggiungendo una queue

È facile raccontare una progressione troppo semplice: il sistema cresce, separiamo servizi, introduciamo una queue e diventiamo resilienti. In realtà ogni meccanismo sposta il problema. Una queue trasforma burst in backlog; un retry aumenta il carico; una replica introduce staleness; consumer concorrenti rendono l’ordering meno ovvio; una compensazione aggiunge nuove business operation; una nuova dipendenza amplia il blast radius.

La distribuzione non elimina complessità. La ricolloca.

> **Quando separiamo il tempo e il luogo dell’esecuzione, dobbiamo rendere esplicito anche il significato del fallimento.**

## La nuova esigenza di ESI

Order Operations è ancora un modular monolith. Le API sono prevalentemente read-oriented, PostgreSQL è l’infrastruttura dati principale e non abbiamo ancora autorizzato il prodotto a eseguire refund o altre remediation economiche.

Arriva però un requisito concreto: quando un operatore classifica un `OperationalCase` come problema di pagamento e richiede l’intervento di Payments & Risk, quella escalation deve essere registrata rapidamente e deve arrivare in modo affidabile al dominio economico.

La prima proposta è quasi inevitabile: “salviamo l’escalation e poi chiamiamo l’API Payments”. In demo funziona. In produzione apre immediatamente domande più interessanti del codice HTTP.

Se Payments è lento, l’operatore deve aspettare? Se il commit locale riesce ma la chiamata fallisce, il caso risulta escalato mentre Payments non ne sa nulla. Se Payments esegue la richiesta ma la risposta va persa, il retry può creare una seconda escalation. Se il downstream resta indisponibile per mezz’ora, chi riconcilia e che cosa vede l’utente?

La feature locale è diventata un problema distribuito.

## Il compromesso del capitolo

Commerce & Operations vuole un’interazione rapida anche durante degradi downstream. Payments & Risk vuole che nessuna escalation accettata vada persa e che una redelivery non produca due workflow business. Platform Engineering vuole una primitive di messaging governabile invece di integrazioni point-to-point tutte diverse. Security vuole payload minimizzati e boundary di accesso chiari. Finance/FinOps non vuole una piattaforma di streaming sovradimensionata per un flusso che oggi non ne richiede le proprietà.

La tensione è quindi reale: indipendenza temporale, affidabilità e UX migliorano soltanto accettando nuovi stati intermedi, possibili duplicati, retry, backlog, DLQ, observability e costo operativo.

Per questa iterazione scegliamo:

```text
transazione locale
+ transactional outbox
+ publisher asincrono
+ broker durabile
+ at-least-once delivery
+ consumer idempotente
+ retry bounded con backoff/jitter
+ dead-letter path
+ correlation identity
```

Non scegliamo invece exactly-once end-to-end come promessa generica, Kafka per prestigio, una saga per una singola notifica, retry infinito, ordering globale o un workflow engine general-purpose senza un workflow che lo richieda.

La complessità entra perché svolge un lavoro preciso: **Payments non deve stare nel critical request path e l’intenzione di notificare non deve andare persa dopo il commit locale**.

## Eventual consistency senza ambiguità sulla correctness

Accettiamo che, per un intervallo, Order Operations sappia che l’escalation è stata richiesta mentre Payments & Risk non l’ha ancora ricevuta. Non accettiamo però perdita silenziosa, duplicazione di side effect per la stessa intenzione, retry senza limite, messaggi senza identity, payload inutilmente sensibili o DLQ senza ownership.

Dobbiamo inoltre poter distinguere almeno `pending`, `delivered`, `delayed` e `dead-lettered` quando questi stati cambiano il comportamento operativo.

> **Eventual consistency non significa eventual correctness. La correttezza resta un requisito; cambia il percorso con cui la raggiungiamo.**

## Le delivery guarantee hanno un confine

Microsoft Azure Architecture Center documenta che i sistemi at-least-once possono consegnare più volte lo stesso messaggio e che il consumer deve essere progettato per tollerare la redelivery. La stessa guidance ricorda che una garanzia exactly-once interna a un broker o framework non rende automaticamente exactly-once gli effetti esterni prodotti dal consumer.

Fonti:

- [Microsoft Learn — Idempotent Consumer pattern](https://learn.microsoft.com/azure/architecture/patterns/idempotent-consumer)
- [Microsoft Learn — Asynchronous messaging options](https://learn.microsoft.com/azure/architecture/guide/technology-choices/messaging)

AWS Builders’ Library affronta lo stesso problema dal lato delle API: quando una richiesta viene ritentata dopo un timeout, un client request identifier esplicito aiuta il servizio a riconoscere la stessa intenzione e a rendere il retry più sicuro.

Fonte:

- [Amazon Builders' Library — Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/)

## Il caso reale Uber: il failure path è parte del prodotto

Uber ha documentato un sistema di reprocessing e dead-letter queue costruito sopra Kafka per un workload assicurativo. Il punto interessante non è Kafka, ma il fatto che retry inevitabili e dipendenze degradate non dovessero bloccare il traffico sano. Il team separò quindi il percorso normale da retry e messaggi che richiedevano recovery specifico.

Fonte:

- [Uber Engineering — Building Reliable Reprocessing and Dead Letter Queues with Apache Kafka](https://www.uber.com/blog/reliable-reprocessing/)

La lezione trasferibile è semplice: **quando introduci asincronia, devi progettare anche il percorso del lavoro che non progredisce normalmente**.

## Il percorso del capitolo

Seguiremo l’incertezza dall’inizio alla fine: partial failure e timeout, retry e idempotency, queue/pub-sub/stream, delivery semantics, ordering, backpressure, DLQ, transactional outbox, eventual consistency, saga e reconciliation. L’artefatto che raccoglierà queste decisioni sarà la **Failure Mode Map**.

Order Operations farà anche un passo concreto: introdurrà il primo percorso asincrono persistente del capstone.

La regola del capitolo è facile da ricordare e difficile da rispettare:

> **Distribuire il lavoro significa distribuire anche l’incertezza. L’architettura deve decidere dove quell’incertezza può vivere e come viene risolta.**