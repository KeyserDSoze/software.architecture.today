# Segnali: metrics, logs, traces e correlazione

Una delle scorciatoie più comuni nell'observability è trattare metrics, logs e traces come tre caselle da spuntare.

```text
metrics? sì
logs? sì
traces? sì
```

Questa checklist dice poco.

La domanda più utile è:

> **quale domanda operativa riesce a risolvere ciascun segnale e come colleghiamo i segnali fra loro?**

OpenTelemetry definisce oggi come signal principali:

- traces;
- metrics;
- logs;
- baggage.

Riferimento:

- [OpenTelemetry — Signals](https://opentelemetry.io/docs/concepts/signals/)

## Metrics: compressione del comportamento

Una metric comprime molti eventi in una misura interrogabile nel tempo.

Esempi:

```text
HTTP request rate
HTTP error rate
request latency histogram
outbox pending count
oldest outbox age
Service Bus DLQ depth
Payment Escalation delivery latency
PostgreSQL connection usage
```

Le metric sono ottime per:

- trend;
- aggregazione;
- SLI;
- alerting;
- capacity;
- saturation;
- confronto prima/dopo un cambiamento.

Ma la compressione perde dettaglio.

Sapere che il p95 della latency è passato da 400 ms a 1.8 s non ci dice automaticamente quale richiesta, tenant, dependency o deployment abbia causato il problema.

## Counter, gauge, histogram

Il nome preciso degli strumenti dipende dal framework, ma concettualmente dobbiamo distinguere almeno:

### Counter

Valore monotonicamente crescente per eventi accumulati.

```text
payment_escalations_requested_total
outbox_publish_failures_total
http_requests_total
```

### Gauge

Fotografia di uno stato corrente.

```text
outbox_pending
queue_depth
active_connections
```

### Histogram

Distribuzione di misure, tipicamente latency o size.

```text
http_request_duration
payment_escalation_delivery_duration
payload_size
```

L'histogram è particolarmente importante perché una media può nascondere completamente la tail latency.

Il Capitolo 6 aveva già introdotto il problema dei percentile.

Qui diventa telemetry design.

## Logs: eventi con contesto

Un log utile non dovrebbe essere una frase pensata soltanto per essere letta a occhio.

Meglio:

```json
{
  "event": "payment_escalation_publish_failed",
  "messageId": "...",
  "escalationId": "...",
  "caseId": "...",
  "attempt": 3,
  "failureClass": "TransientBrokerUnavailable",
  "correlationId": "..."
}
```

che:

```text
Something went wrong publishing payment event!!!
```

La struttura permette:

- query;
- aggregazione;
- correlation;
- machine processing;
- alert derivati;
- incident reconstruction.

Ma struttura non significa raccogliere tutto.

Nel Capitolo 13 abbiamo già stabilito:

```text
no access token
no Authorization header
no secret
payload minimization
field allowlist
```

Queste regole valgono ancora di più quando il logging diventa centralizzato.

## Trace: il percorso, non il film completo

Un distributed trace rappresenta il percorso di una richiesta o operazione attraverso più componenti.

OpenTelemetry descrive un trace come insieme di span collegati tramite context propagation.

Per una Payment Escalation possiamo voler osservare:

```text
POST /payment-escalations
  └── validate authorization
  └── begin DB transaction
      └── insert payment_escalation
      └── insert outbox_message
  └── commit
```

Poi, in un trace o causal chain separata ma correlabile:

```text
outbox publisher
  └── read pending outbox
  └── publish Service Bus
  └── mark delivered
```

E downstream:

```text
Payments consumer
  └── deduplicate EscalationId
  └── persist workflow intent
  └── acknowledge
```

Il trace ci aiuta a vedere la relazione temporale e causale fra step.

Non sostituisce però metric e business state.

Se conservassimo soltanto trace campionati, non avremmo necessariamente una base affidabile per calcolare uno SLO.

## Span attributes

Gli attribute devono rendere una operazione investigabile.

Esempi ragionevoli:

```text
service.name = order-operations
operation.name = payment_escalation.request
messaging.system = servicebus
messaging.destination.name = payment-escalations
error.type = ...
deployment.environment = prod
```

Ma non ogni campo del dominio deve diventare un attribute.

Prima di aggiungere:

```text
customerId
orderId
caseId
email
freeTextReason
```

come dimensione indicizzata dobbiamo chiederci:

- è davvero necessario?
- produce cardinalità incontrollata?
- contiene PII?
- aumenta il costo?
- ci serve su metric, trace, log o soltanto audit?

## Correlation: il vero moltiplicatore

La stessa operazione può generare:

```text
metric
trace
structured log
audit event
business state
```

Se non condividono un contesto sufficiente, costringiamo l'operatore a ricostruire manualmente le relazioni.

I candidati di Order Operations sono:

```text
traceId
spanId
correlationId
messageId
escalationId
caseId
```

Non tutti devono stare ovunque.

La regola è più sottile:

> **ogni boundary deve preservare abbastanza identità da permettere di ricostruire il viaggio senza trasformare ogni identificatore in una dimensione costosa o sensibile.**

## W3C Trace Context e messaging

Per HTTP possiamo propagare trace context attraverso standard interoperabili.

Per messaging dobbiamo essere ancora più intenzionali: il processo che produce il messaggio e quello che lo consuma non condividono la stessa call stack e possono essere separati da minuti, retry o redelivery.

L'event envelope dovrebbe quindi preservare almeno:

```text
messageId
correlationId
causationId, quando utile
schema/version
business identity stabile
```

senza confondere:

```text
trace identity
```

con:

```text
business identity
```

`traceId` può cambiare fra tentativi o fasi di processamento.

`EscalationId` deve continuare a rappresentare la stessa intenzione business.

## Baggage non è un cestino

OpenTelemetry supporta il baggage per propagare context information fra segnali e servizi.

Questo non significa che sia un posto sicuro dove mettere dati arbitrari.

Context propagation ha implicazioni di:

- privacy;
- security;
- size;
- cardinality;
- trust.

Il baggage deve essere trattato come una superficie di design.

## Golden signals

Google SRE propone quattro segnali particolarmente utili per sistemi user-facing:

```text
latency
traffic
errors
saturation
```

Fonte:

- [Google SRE — Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)

Per Order Operations diventano, per esempio:

### Latency

```text
operator journey latency
API latency
PostgreSQL dependency latency
Payment Escalation local-accept latency
publication latency
```

### Traffic

```text
operator requests
problematic-order searches
Payment Escalation requests
outbox publish rate
```

### Errors

```text
HTTP failures
authorization denials
DB failures
publish failures
DLQ events
reconciliation mismatch
```

### Saturation

```text
App Service CPU/memory
PostgreSQL connections/storage/IO
outbox backlog
queue depth
worker throughput vs arrival rate
```

## Business telemetry

I golden signals non bastano per comprendere il prodotto.

Un sistema può avere:

```text
HTTP 200
CPU 30%
latency 150 ms
```

e tuttavia fallire il proprio outcome.

Per Order Operations ci interessano anche signal come:

```text
problematic_orders_opened
operational_cases_created
payment_escalations_requested
payment_escalations_delivered
payment_escalations_delayed
payment_escalations_dead_lettered
```

Questi non sono necessariamente KPI di business definitivo.

Sono **operational business signals**: collegano comportamento tecnico e journey.

## Una regola utile

Prima di aggiungere un nuovo segnale chiediamo:

```text
Quale domanda risponde?
Quale decisione abilita?
Quale failure mode rende visibile?
Chi lo userà?
Quanto costa conservarlo?
Quanto è sensibile?
Per quanto tempo ci serve?
```

Se non sappiamo rispondere, probabilmente stiamo generando telemetry per abitudine.

## Fonti

- [OpenTelemetry — Signals](https://opentelemetry.io/docs/concepts/signals/)
- [OpenTelemetry — Specification overview](https://opentelemetry.io/docs/specs/otel/overview/)
- [OpenTelemetry — Metrics](https://opentelemetry.io/docs/specs/otel/metrics/)
- [OpenTelemetry — Logs](https://opentelemetry.io/docs/specs/otel/logs/)
- [Google SRE — Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)

> **Metrics comprimono. Logs contestualizzano. Traces collegano. L'observability nasce quando questi segnali raccontano la stessa storia.**