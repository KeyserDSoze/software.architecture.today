## Segnali: metrics, logs, traces e correlazione

Metrics, logs e traces vengono spesso introdotti come tre caselle obbligatorie:

```text
metrics? sì
logs? sì
traces? sì
```

Questa checklist non ci dice se il sistema sia davvero investigabile.

La domanda utile è un’altra:

> **Quale domanda operativa risolve ciascun segnale e come colleghiamo i segnali quando una singola vista non basta?**

OpenTelemetry tratta traces, metrics, logs e baggage come signal differenti dello stesso sistema.

Riferimento:

- [OpenTelemetry — Signals](https://opentelemetry.io/docs/concepts/signals/)

## Metrics: comprimere il comportamento per vedere trend e soglie

Una metric comprime molti eventi in una misura interrogabile nel tempo. È ciò che ci serve quando vogliamo capire rate, distribuzioni, saturation, backlog o SLI.

Per Order Operations candidati naturali sono:

```text
HTTP request rate/error rate
request latency histogram
outbox pending
outbox oldest age
publish failure rate
Payment Escalation publication latency
DLQ depth
PostgreSQL connection pressure
```

La compressione è il vantaggio e il limite. Sapere che il p95 della latency è passato da 400 ms a 1.8 s ci dice che qualcosa è cambiato, ma non quale richiesta, dependency o deployment sia responsabile.

Counter, gauge e histogram rispondono quindi a forme diverse di domanda. I counter descrivono eventi accumulati, i gauge fotografano uno stato corrente, gli histogram preservano la distribuzione di misure come latency o size.

La distinzione conta perché una media può nascondere completamente la tail latency. Il Capitolo 6 aveva introdotto percentile e budget; qui diventano instrumentation design.

## Logs: contesto interrogabile, non frasi di conforto

Un log utile dovrebbe essere prima di tutto un evento strutturato.

Meglio:

```json
{
  "event": "payment_escalation_publish_failed",
  "messageId": "...",
  "escalationId": "...",
  "attempt": 3,
  "failureClass": "TransientBrokerUnavailable",
  "correlationId": "..."
}
```

che:

```text
Something went wrong publishing payment event!!!
```

La struttura permette query, aggregazione, machine processing e incident reconstruction. Ma non autorizza a registrare tutto.

Il quality floor del Capitolo 13 resta valido:

```text
no access token
no Authorization header
no secret
payload minimization
field allowlist
```

Centralizzare i log aumenta il valore investigativo e, nello stesso momento, il possibile blast radius di un leakage.

## Traces: vedere il percorso di una esecuzione

OpenTelemetry descrive un trace come insieme di span collegati attraverso context propagation. Il trace ci aiuta a vedere la relazione temporale tra step che una metric ha compresso.

Per una Payment Escalation possiamo avere:

```text
POST /payment-escalations
  ├── authorization
  ├── application use case
  └── PostgreSQL transaction
      ├── insert PaymentEscalation
      └── insert OutboxMessage
```

Più tardi, in un’altra execution:

```text
Outbox Publisher
  ├── load pending message
  ├── Service Bus publish
  └── mark published
```

E ancora downstream:

```text
Payments consumer
  ├── deduplicate EscalationId
  ├── persist workflow intent
  └── acknowledge
```

Questi tre pezzi possono appartenere a trace diversi. È normale: il business journey asincrono non coincide con una singola call stack.

Per questo il trace non sostituisce la business identity e non dovrebbe essere la sola fonte di uno SLI. Un trace può essere campionato; una misura affidabile dell’outcome può richiedere counter, histogram o eventi contabili completi.

## Correlation: il valore cresce quando le identity non vengono confuse

La stessa operazione può produrre metric, trace, structured event, audit event e business state. Se non preserviamo abbastanza contesto attraverso i boundary, durante un incidente dobbiamo ricostruire a mano relazioni che il sistema già conosceva.

Per Order Operations distinguiamo:

```text
traceId / spanId
→ execution identity

correlationId
→ operational flow più ampio quando serve

messageId
→ technical delivery identity

escalationId
→ business intent identity

caseId
→ Operational Case identity
```

La regola non è mettere tutti questi valori ovunque. È preservare ciò che serve a ricostruire il viaggio senza trasformare ogni identifier in una dimensione metrica costosa o in un dato esposto inutilmente.

Un nuovo retry può produrre un nuovo trace. Non deve produrre una nuova `EscalationId`, perché il business intent è lo stesso.

Questa distinzione è uno dei motivi per cui correlation e idempotency si incontrano.

## HTTP e messaging hanno propagation semantics differenti

Nel percorso HTTP possiamo propagare trace context usando standard interoperabili come W3C Trace Context attraverso le implementazioni OpenTelemetry.

Nel messaging, invece, producer e consumer possono essere separati da minuti, retry e redelivery. L’envelope deve quindi preservare almeno le identity tecniche e business necessarie:

```text
messageId
correlationId
business identity stabile
schema/version
causationId quando realmente utile
```

Non vogliamo usare `traceId` come business key soltanto perché è disponibile.

## Baggage: propagation non significa permesso di propagare tutto

OpenTelemetry supporta il baggage per trasportare context information tra processi. È una capability potente e quindi una superficie da governare.

Prima di inserirvi tenant, user identifier o dati di dominio dobbiamo considerarne privacy, security, size, trust boundary e cardinality effect.

Il fatto che un dato possa essere propagato tecnicamente non significa che debba esserlo.

## I golden signals diventano domande sul prodotto

Google SRE usa quattro golden signals:

```text
latency
traffic
errors
saturation
```

Fonte:

- [Google SRE — Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)

Per ESI li traduciamo sui journey.

**Latency** significa operator journey latency, local escalation acceptance latency, PostgreSQL dependency latency e publication latency.

**Traffic** significa operator request rate, escalation request rate e publish rate.

**Errors** significa HTTP failure, authorization denial, DB failure, publish failure, DLQ e reconciliation mismatch, mantenendo però classi bounded.

**Saturation** significa App Service headroom, PostgreSQL connection pressure, outbox age, queue backlog e relazione fra arrival e drain rate.

Questi signal descrivono bene il comportamento tecnico, ma non bastano ancora a raccontare il prodotto.

## Business telemetry: il ponte fra tecnica e journey

Un sistema può avere CPU al 30%, HTTP `200` e latency di 150 ms mentre il business flow non sta ottenendo il proprio outcome.

Perciò vogliamo anche operational business event come:

```text
PaymentEscalation Requested
PaymentEscalation Published
PaymentEscalation Delayed
PaymentEscalation DeadLettered
```

Questi eventi non sono automaticamente KPI finanziari. Sono signal che collegano il comportamento tecnico a ciò che l’operatore ha chiesto al sistema.

La distinction è importante: il numero di retry è un meccanismo; `PublishedWithinTarget` è l’outcome che il Reliability Contract vuole misurare.

## Il test prima di aggiungere un segnale

Prima di creare una nuova metric, log event o trace attribute chiediamo:

```text
Quale domanda risponde?
Quale decisione abilita?
Quale failure mode rende investigabile?
Chi lo userà?
Quanto costa?
Quanto è sensibile?
Per quanto tempo serve?
```

Se non sappiamo rispondere, stiamo probabilmente generando telemetry per abitudine.

Fonti:

- [OpenTelemetry — Signals](https://opentelemetry.io/docs/concepts/signals/)
- [OpenTelemetry — Specification overview](https://opentelemetry.io/docs/specs/otel/overview/)
- [OpenTelemetry — Metrics](https://opentelemetry.io/docs/specs/otel/metrics/)
- [OpenTelemetry — Logs](https://opentelemetry.io/docs/specs/otel/logs/)
- [Google SRE — Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)

> **Metrics comprimono. Logs contestualizzano. Traces mostrano il percorso. L’observability nasce quando sappiamo quale storia devono raccontare insieme.**