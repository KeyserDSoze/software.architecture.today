## Partial failure: il problema che il codice locale non ci prepara a vedere

In un singolo processo possiamo comunque avere errori complessi.

Ma abbiamo un vantaggio enorme: condividiamo una nozione relativamente coerente di tempo, memoria, chiamata e risultato.

Quando attraversiamo una rete, quel vantaggio si riduce.

La frase:

> “la chiamata è fallita”

è spesso troppo vaga per essere utile.

Dobbiamo chiedere:

```text
è fallita prima di raggiungere il server?
è arrivata ma il server non l'ha eseguita?
è stata eseguita ma la risposta si è persa?
il server sta ancora lavorando?
il client ha smesso di aspettare?
il downstream è sovraccarico?
la rete è partizionata o soltanto lenta?
```

Queste possibilità producono decisioni differenti.

## Timeout: smettere di aspettare non annulla il lavoro remoto

Un timeout è prima di tutto una decisione del caller:

> non siamo più disposti ad aspettare oltre.

Non significa necessariamente:

> il downstream non ha eseguito nulla.

Questo punto è essenziale.

Immaginiamo:

```text
Order Operations
  → POST /payment-escalations
```

Il caller imposta timeout a 2 secondi.

Timeline:

```text
0 ms     richiesta inviata
800 ms   Payments registra l'escalation
900 ms   Payments prepara la risposta
2000 ms  Order Operations scade il timeout
2100 ms  risposta persa / connessione chiusa
```

Dal punto di vista del client abbiamo un timeout.

Dal punto di vista del business abbiamo già un side effect riuscito.

Se il client ripete ingenuamente la richiesta, può produrre un duplicato.

Questo è il motivo per cui timeout e idempotency devono essere progettati insieme.

AWS Well-Architected raccomanda timeout espliciti sulle chiamate remote e avverte che valori troppo alti trattengono risorse inutilmente, mentre valori troppo bassi possono aumentare retry, traffico e latency fino a contribuire a outage più ampi.

Fonte:

- [AWS Well-Architected — Set client timeouts](https://docs.aws.amazon.com/wellarchitected/latest/framework/rel_mitigate_interaction_failure_client_timeouts.html)

## Retry: una nuova richiesta, non una macchina del tempo

Un retry non corregge la richiesta precedente.

Produce una nuova osservazione del sistema e, spesso, una nuova richiesta.

Quindi prima di fare retry dobbiamo sapere almeno:

1. l'errore è probabilmente transitorio?
2. l'operazione è idempotente o deduplicabile?
3. il nuovo tentativo rientra ancora nel latency budget?
4. chi è il livello giusto per fare retry?
5. quante altre richieste stanno facendo la stessa cosa?
6. quando dobbiamo smettere?

Microsoft Azure Architecture Center raccomanda di applicare retry soltanto quando il contesto dell'operazione è compreso e di considerare esplicitamente idempotency, tipo di errore e consistenza della transazione.

Fonte:

- [Microsoft Learn — Retry pattern](https://learn.microsoft.com/azure/architecture/patterns/retry)

## Retry annidati: il moltiplicatore invisibile

Supponiamo questa catena:

```text
A → B → C → D
```

Ogni livello esegue fino a tre tentativi.

Nel caso peggiore, una singola richiesta A può produrre molti più tentativi verso D di quanto il team immagini guardando soltanto una policy locale.

Non serve nemmeno raggiungere il massimo teorico perché la situazione diventi pericolosa.

Durante una degradazione, migliaia di richieste concorrenti che applicano ognuna piccoli retry possono trasformare una dipendenza lenta in una dipendenza sommersa.

È il classico feedback loop:

```text
failure
→ retry
→ più carico
→ latency maggiore
→ più timeout
→ più retry
```

Microsoft propone anche il concetto di **retry budget**: oltre al limite per singola richiesta, si limita il volume aggregato di retry che un processo o servizio può generare in un intervallo.

Fonte:

- [Microsoft Learn — Transient fault handling](https://learn.microsoft.com/azure/architecture/best-practices/transient-faults)

## Backoff e jitter

Se una dipendenza torna disponibile dopo un problema e tutti i client riprovano nello stesso istante, la recovery stessa può diventare un nuovo picco di carico.

Per questo un retry robusto non è:

```text
fallisce
→ aspetta 100 ms
→ riprova
→ aspetta 100 ms
→ riprova
```

Una strategia comune usa **exponential backoff**:

```text
100 ms
200 ms
400 ms
800 ms
...
```

ma anche il backoff può sincronizzare client partiti nello stesso momento.

Il **jitter** aggiunge casualità controllata all'attesa per distribuire i tentativi nel tempo.

AWS documenta backoff e jitter come strumenti centrali per evitare contention e retry sincronizzati; gli SDK AWS moderni li includono nelle proprie strategie standard/adaptive.

Fonti:

- [AWS Architecture Blog — Exponential Backoff And Jitter](https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/)
- [AWS Well-Architected — Control and limit retry calls](https://docs.aws.amazon.com/wellarchitected/latest/framework/rel_mitigate_interaction_failure_limit_retries.html)

## Retryable non significa sempre utile

Un errore può essere tecnicamente temporaneo e comunque non meritare retry immediato.

Esempio:

```text
503 downstream overloaded
```

Se il downstream è già al limite, altri tentativi possono peggiorare la situazione.

Al contrario:

```text
connection reset su una GET idempotente
```

può essere un buon candidato per un nuovo tentativo, se il budget lo consente.

Per questo la policy dovrebbe classificare almeno:

```text
validation/business error
→ non retryable

transient transport error
→ retry candidate

rate limited / overloaded
→ backoff, rispetto Retry-After se presente

persistent dependency failure
→ stop / circuit breaker / degraded mode

unknown side-effect outcome
→ retry solo con idempotency semantics
```

## Idempotency: stessa intenzione, non stesso payload

Una definizione utile di idempotency per sistemi distribuiti è:

> ripetere la stessa intenzione non deve produrre side effect aggiuntivi indesiderati.

La parte importante è **stessa intenzione**.

Un hash del payload non sempre basta.

Due richieste identiche possono rappresentare due intenti differenti.

Due payload leggermente diversi possono rappresentare lo stesso intento ritentato dopo un timeout.

AWS Builders' Library descrive l'uso di un client request ID esplicito per riconoscere una richiesta ritentata e distinguere meglio equivalenza semantica e nuovi intenti.

Fonte:

- [Amazon Builders' Library — Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/)

Per Order Operations potremmo avere:

```text
escalationId = esc_01J...
```

che rimane stabile per tutti i tentativi di consegna della stessa escalation.

Payments & Risk può quindi registrare:

```text
processed escalationId
```

e rifiutare o rendere innocua una seconda elaborazione.

## Idempotent consumer

Nei sistemi di messaging at-least-once, il consumer deve aspettarsi redelivery.

Un caso classico è:

```text
consumer riceve messaggio
↓
scrive nel database
↓
crash prima dell'ack
↓
broker non vede ack
↓
redelivery
```

Se la seconda elaborazione crea un nuovo record, invia una seconda email o addebita una seconda volta, il problema non è il broker.

È il contratto del consumer.

Microsoft descrive esplicitamente questo scenario nell'Idempotent Consumer pattern.

Fonte:

- [Microsoft Learn — Idempotent Consumer pattern](https://learn.microsoft.com/azure/architecture/patterns/idempotent-consumer)

## Exactly-once: attenzione al confine della promessa

La frase:

> “il broker supporta exactly-once”

non è ancora sufficiente per dichiarare:

> “il nostro business process è exactly-once”.

La garanzia può valere soltanto dentro il perimetro controllato dal broker o dal framework.

Un consumer può comunque:

1. ricevere una sola volta logicamente un record;
2. chiamare un payment provider;
3. ottenere successo;
4. perdere il proprio commit locale.

L'effetto esterno è già avvenuto.

Per questo è più sano ragionare in termini di:

```text
at-least-once delivery
+ stable operation identity
+ idempotent processing
+ deduplication
+ reconciliation
```

Quando queste proprietà producono un effetto business osservabile una sola volta, possiamo parlare di **effective exactly-once** nel perimetro che abbiamo realmente progettato.

Non di magia distribuita.

## Il caso Amazon EC2

La Builders' Library usa come esempio il provisioning di una EC2 instance: l'operazione coinvolge diversi servizi interni e può fallire in punti intermedi. Un client token esplicito permette di ripetere una richiesta senza creare involontariamente più risorse per la stessa intenzione.

Il valore didattico è importante per ESI.

Non importa che Order Operations non crei VM.

La struttura del problema è identica:

```text
side effect costoso
+ risposta incerta
+ retry desiderabile
= serve identità stabile dell'intenzione
```

## Una regola operativa

Prima di aggiungere `retry()` a una chiamata, rispondi a queste domande:

```text
che cosa significa successo?
che cosa significa timeout?
la prima richiesta potrebbe avere già prodotto effetto?
come riconosciamo la stessa intenzione?
chi deduplica?
quanto carico aggiunge il retry?
quando smettiamo?
come osserviamo i retry?
```

Se non conosciamo le risposte, il retry non è resilienza.

È **amplificazione di incertezza**.