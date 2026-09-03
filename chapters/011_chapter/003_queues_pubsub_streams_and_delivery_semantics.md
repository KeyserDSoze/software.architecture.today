## Queue, pub/sub e stream: non sono sinonimi

Quando diciamo “mettiamo un broker”, stiamo comprimendo decisioni molto diverse in una parola sola.

Prima della tecnologia dobbiamo capire **che relazione vogliamo creare tra producer e consumer**.

## Queue: lavoro da eseguire

Una queue è utile quando un producer delega lavoro che può essere eseguito in un secondo momento.

Il modello concettuale è:

```text
producer
  ↓
queue
  ↓
uno dei worker disponibili
```

Tipici obiettivi:

- temporal decoupling;
- buffering;
- load leveling;
- retry;
- concorrenza controllata;
- assorbire burst senza bloccare il caller.

Microsoft descrive il Competing Consumers pattern proprio in questi termini: più consumer ricevono lavoro dalla stessa coda per aumentare throughput e availability, a condizione che i task siano separabili e che il sistema gestisca correttamente affidabilità, concorrenza e ordering quando necessario.

Fonte:

- [Microsoft Learn — Competing Consumers pattern](https://learn.microsoft.com/azure/architecture/patterns/competing-consumers)

Per Order Operations, una queue avrebbe fit se dicessimo:

> “questa escalation deve essere elaborata da Payments & Risk, ma l'operatore non deve aspettare che l'elaborazione finisca”.

Il lavoro è destinato a un capability consumer preciso.

## Publish/subscribe: annunciare un fatto

Pub/sub risponde a un problema diverso.

Il producer non assegna necessariamente lavoro a un consumer specifico.

Pubblica un fatto:

```text
OperationalCaseEscalated
```

E più subscriber possono reagire indipendentemente:

```text
Payments & Risk
Notification service
Audit analytics
Future reporting consumer
```

Il producer non dovrebbe dover conoscere ogni subscriber.

Microsoft Publisher-Subscriber pattern evidenzia proprio questo vantaggio: producer e consumer possono evolvere con minore accoppiamento diretto, e i consumer possono selezionare gli eventi di interesse.

Fonte:

- [Microsoft Learn — Publisher-Subscriber pattern](https://learn.microsoft.com/azure/architecture/patterns/publisher-subscriber)

Ma questo disaccoppiamento non è gratuito.

Più consumer significano:

- più contratti da mantenere;
- più failure indipendenti;
- più difficoltà di tracing end-to-end;
- più possibilità di side effect emergenti;
- più attenzione a schema evolution e compatibility.

## Stream: un log ordinato da leggere

Uno stream non è semplicemente “una queue più potente”.

Tipicamente il modello enfatizza:

- sequenza di record;
- retention;
- consumer offset/checkpoint;
- replay;
- più consumer group;
- elaborazione continua.

Questo può essere ottimo quando il valore sta anche nella storia degli eventi e nella capacità di rileggere il log.

Può essere eccessivo quando abbiamo soltanto bisogno di consegnare una piccola quantità di task asincroni.

Per questo nel nostro scenario ESI non scegliamo automaticamente Kafka.

La domanda non è:

> “abbiamo eventi?”

ma:

> “abbiamo bisogno delle proprietà operative e semantiche di uno stream durabile e replayable?”

## Command ed event non sono la stessa cosa

Questa distinzione evita molti sistemi event-driven confusi.

### Command

Esprime un'intenzione diretta:

```text
ProcessPaymentEscalation
SendCustomerNotification
RebuildOperationalProjection
```

Ha idealmente un destinatario responsabile.

Può essere rifiutato.

Può avere una semantica di idempotency legata all'operazione.

### Event

Descrive qualcosa che è già accaduto:

```text
OperationalCaseEscalated
PaymentFailed
ShipmentDelayed
```

Non dovrebbe chiedere a un consumer specifico di comportarsi in un modo nascosto nel nome.

Un evento sano comunica un fatto abbastanza stabile da permettere a consumer indipendenti di reagire.

Il confine non è sempre perfetto.

Ma la domanda è utile:

> **stiamo ordinando a qualcuno di fare qualcosa o stiamo rendendo noto un fatto già avvenuto?**

## Il messaggio è un contratto

Una volta pubblicato, un message schema può diventare più difficile da cambiare di una classe interna.

Supponiamo:

```json
{
  "caseId": "case_123",
  "type": "payment",
  "status": "escalated"
}
```

Poi un consumer interpreta `type=payment` come:

> “avvia automaticamente un workflow di chargeback”.

Un altro lo usa soltanto per reporting.

Un terzo assume che `status` sia monotono.

Abbiamo creato semantica distribuita.

Per questo un event contract dovrebbe definire almeno:

```text
message type
schema version
message id
occurredAt
producer
correlation / causation
entity identity
business meaning
compatibility policy
PII classification
ordering key se rilevante
```

## At-most-once

Con una semantica at-most-once, il sistema evita redelivery ma può perdere messaggi in certi failure mode.

Può essere accettabile per dati come:

- telemetria non critica;
- aggiornamenti effimeri;
- segnali che verranno presto sostituiti da valori nuovi.

Non è accettabile automaticamente per:

- escalation operativa;
- movimento economico;
- richiesta di fulfillment;
- evento necessario a ricostruire uno stato.

Il punto non è che at-most-once sia “inferiore”.

È che compra una proprietà pagando un'altra.

## At-least-once

At-least-once privilegia la consegna:

```text
meglio un possibile duplicato
che una perdita silenziosa
```

Il prezzo è che il consumer deve tollerare redelivery.

È il modello che adottiamo per il primo flusso asincrono ESI.

Non promettiamo che il broker consegnerà fisicamente una sola volta.

Promettiamo che **la stessa escalation non produrrà effetti business duplicati**.

Questo cambia il luogo della complessità:

```text
broker
→ delivery affidabile

consumer
→ idempotency e deduplication

sistema
→ reconciliation e observability
```

## Exactly-once

Exactly-once è una proprietà utile quando viene definita con precisione.

Diventa marketing architetturale quando resta vaga.

Dobbiamo sempre chiedere:

```text
exactly once dove?
tra producer e broker?
dentro una pipeline transazionale?
nel consumer offset?
nel database del consumer?
nel payment provider esterno?
per quale intervallo di deduplication?
```

Uber, descrivendo il proprio sistema di processing pubblicitario con Kafka, Flink e Pinot, spiega di usare exactly-once nelle parti di pipeline controllate da Flink/Kafka e di aggiungere comunque identificatori univoci per idempotency e deduplication nei sistemi downstream.

Fonte:

- [Uber Engineering — Real-Time Exactly-Once Ad Event Processing with Apache Flink, Kafka, and Pinot](https://www.uber.com/blog/real-time-exactly-once-ad-event-processing/)

È un ottimo esempio del principio:

> **le garanzie di delivery non sostituiscono l'identità del lavoro.**

## Fan-out: autonomia e rischio

Pub/sub può permettere a nuovi team di consumare un evento senza modificare il producer.

Questo aumenta autonomia.

Ma può anche creare una rete di reazioni che nessuno comprende più end-to-end.

Esempio:

```text
OperationalCaseEscalated
  ↓
Payments apre workflow
  ↓
PaymentWorkflowStarted
  ↓
Notification invia alert
  ↓
AlertSent
  ↓
Analytics aggiorna metriche
  ↓
...
```

Se ogni evento genera altri eventi senza una mappa delle responsabilità, emergono:

- event storm;
- loop;
- difficoltà di causalità;
- policy duplicate;
- business process distribuito senza proprietario.

Microsoft Choreography pattern avverte esplicitamente di questo rischio e raccomanda guardrail come filtering, concurrency limit, throttling, schema governance e regole per evitare catene circolari.

Fonte:

- [Microsoft Learn — Choreography pattern](https://learn.microsoft.com/azure/architecture/patterns/choreography)

## Ordering: chiedere l'ordine minimo necessario

La frase:

> “i messaggi devono arrivare in ordine”

è un requisito troppo ampio.

Ordine rispetto a che cosa?

Tutti i messaggi globalmente?

Tutti gli eventi di un tenant?

Tutti gli eventi dello stesso ordine?

Tutti gli eventi dello stesso `OperationalCase`?

Ordering globale costa scalabilità e concorrenza.

Spesso il requisito reale è:

```text
per la stessa aggregate key
non applicare una versione più vecchia dopo una più nuova
```

Possiamo allora usare:

```text
partition key = caseId
sequence / version
consumer reject stale version
```

Microsoft Sequential Convoy pattern mostra proprio il trade-off fra ordering e parallelismo: un singolo consumer preserva ordine globale ma limita throughput; più consumer richiedono grouping o meccanismi per mantenere ordine solo dove serve.

Fonte:

- [Microsoft Learn — Sequential Convoy pattern](https://learn.microsoft.com/azure/architecture/patterns/sequential-convoy)

## Il fit per Order Operations

Per il nostro primo flusso scegliamo una semantica semplice:

```text
OperationalCaseEscalated
- event id stabile
- caseId
- escalationId
- occurredAt
- tenantId pseudonimizzato / scoped identifier
- reason category
- source = order-operations
- schemaVersion
```

Il messaggio non contiene:

- descrizioni libere dell'operatore;
- dettagli payment sensibili;
- stack trace;
- token;
- payload di provider esterni;
- intero Order DTO.

Questo protegge security e coupling.

Per ordering, non chiediamo ordine globale.

Se in futuro arrivano più eventi dello stesso `OperationalCase`, useremo `caseId` come ordering/partition key e una versione monotona quando il consumer ne ha bisogno.

## Regola

Scegli il modello di messaging partendo dalla relazione desiderata:

```text
queue
→ qualcuno deve eseguire questo lavoro

pub/sub
→ questo fatto è avvenuto; chi è interessato può reagire

stream
→ questa sequenza di record deve poter essere processata e spesso riletta
```

Poi scegli la tecnologia.

Non il contrario.