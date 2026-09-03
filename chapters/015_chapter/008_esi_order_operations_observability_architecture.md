# ESI — Order Operations Observability Architecture

Applichiamo ora i principi del capitolo allo stato corrente del capstone.

## Contesto

Order Operations è:

- workload interno ESI;
- production ingress privato;
- modular monolith su Azure App Service;
- background publisher nello stesso runtime envelope;
- PostgreSQL managed come stato locale;
- Azure Service Bus per Payment Escalation;
- Azure Monitor / Application Insights / Log Analytics come foundation già scelta;
- security e reliability contract già espliciti.

Il Capitolo 15 non cambia questa topologia.

Aggiunge il contratto che ci permette di capire come si comporta.

## Decisione ESI

La direzione corrente è:

```text
application / runtime instrumentation
→ OpenTelemetry-compatible signal model
→ Azure Monitor / Application Insights
→ Log Analytics / Azure Monitor metrics
→ workload dashboards, SLI queries e alerts
```

OpenTelemetry viene scelto come modello/toolkit di instrumentation vendor-neutral.

Non lo trattiamo come backend.

La documentazione OpenTelemetry specifica infatti che il progetto facilita generazione, raccolta ed export di telemetry e non è esso stesso il sistema di storage/visualizzazione.

Fonte:

- [OpenTelemetry — What is OpenTelemetry?](https://opentelemetry.io/docs/what-is-opentelemetry/)

Azure Monitor/Application Insights rimane il backend operativo corrente perché già coerente con la cloud foundation ESI.

## I critical journey osservati

### Journey A — Investigazione ordine

```text
operator
→ private ingress
→ authentication
→ authorization
→ Order Operations API
→ authoritative dependencies
→ operational view
```

Signal minimi:

```text
request count
success/error outcome
latency histogram
dependency latency/failure
current deployment version
degraded-state classification
```

### Journey B — Payment Escalation local acceptance

```text
operator
→ API
→ authorization
→ PostgreSQL transaction
  ├── PaymentEscalation
  └── OutboxMessage
→ 202 Accepted
```

Signal:

```text
payment_escalation_requested_total
payment_escalation_local_accept_duration
payment_escalation_local_accept_failures
idempotent_replay_total
authorization_denial_total by bounded failure class
```

### Journey C — Payment Escalation publication

```text
outbox
→ publisher
→ Service Bus
```

Signal:

```text
outbox_pending
outbox_oldest_age
outbox_publish_rate
outbox_publish_failures by bounded class
payment_escalation_publication_duration
```

### Journey D — downstream delivery evidence

Quando Payments & Risk fornirà acknowledgement/inbox evidence:

```text
escalationId
→ downstream observed
```

potremo misurare una business delivery SLI più completa.

Oggi non inventiamo telemetry che il downstream non ci fornisce ancora.

## Candidate metric set

Il naming finale verrà stabilito durante l'implementazione OpenTelemetry, ma il contratto semantico è:

| Metric | Type | Purpose | Dimensions bounded |
|---|---|---|---|
| core journey requests | counter | traffic / SLI denominator | env, version, result |
| core journey duration | histogram | latency SLI | env, version, result |
| escalation requested | counter | business traffic | env, result |
| escalation local accept duration | histogram | local acceptance latency | env, result |
| outbox pending | gauge | backlog | env |
| outbox oldest age | gauge | publication risk | env |
| outbox publish failures | counter | diagnosis | env, failureClass |
| escalation publication duration | histogram | publication SLI | env, result |
| DLQ depth | gauge | failure/recovery | env |

Non includiamo come metric dimensions:

```text
orderId
caseId
escalationId
messageId
operatorId
```

Questi identifier restano disponibili dove servono per correlation/investigation, non per moltiplicare le time series.

## Structured events

### `payment_escalation_requested`

Campi candidati:

```text
traceId
correlationId
caseId
escalationId
result
actorClass
```

Non registriamo:

```text
access token
Authorization header
free-text non necessario
payment credential
```

### `payment_escalation_publish_failed`

```text
traceId/correlationId
messageId
escalationId
attempt
failureClass
```

L'errore raw deve essere sanitizzato prima della centralizzazione se può contenere informazioni sensibili.

## Trace boundaries

### HTTP trace

```text
HTTP request
→ authorization
→ application use case
→ PostgreSQL transaction
```

### Outbox publish trace

```text
outbox poll
→ message load
→ Service Bus publish
→ local mark published
```

### Causal correlation

La Payment Escalation mantiene:

```text
escalationId = business identity
messageId = technical delivery identity
correlationId = flow correlation
```

Un nuovo trace di retry non cambia la business identity.

## Sampling policy — prima iterazione

Non introduciamo tail-sampling infrastructure dedicata nella prima versione.

Direzione:

```text
metrics required for SLI = non sampled by trace policy
structured audit/business evidence = preserved according to contract
traces = sampled according to environment/volume
errors/high-value traces = higher preservation direction
```

La percentuale concreta non viene inventata prima di avere volume e cost measurement.

Trigger per tail sampling:

- trace volume significativo;
- bisogno di preservare selettivamente error/high-latency traces;
- cost curve che giustifica l'infrastruttura;
- central collector capability fornita da Platform.

## Cardinality budget

Regole ESI per custom metric:

1. route template, mai URL con ID;
2. failure class bounded;
3. environment/version bounded;
4. business identifier unbounded vietati come dimension per default;
5. ogni eccezione richiede owner e cost review;
6. free-text mai dimensione metrica.

## Retention direction

Non fissiamo numeri universali.

Distinguiamo almeno:

```text
metrics trend/SLO
traces diagnostic
application logs
security/audit events
business operational evidence
```

Le retention finali devono essere negoziate fra:

- workload;
- Platform;
- Security;
- Legal/Compliance;
- Finance/FinOps.

## Dashboard 1 — Workload health

Domande:

```text
Il critical journey funziona?
Stiamo bruciando error budget?
Quale degraded mode è attivo?
È cambiato qualcosa dopo l'ultima release?
```

Vista:

- SLI/SLO core journey;
- error-budget burn;
- latency/errors/traffic/saturation;
- deployment marker;
- dependency health;
- degraded state.

## Dashboard 2 — Payment Escalation

Domande:

```text
Le escalation vengono accettate?
L'outbox sta crescendo?
Stiamo pubblicando entro target?
Esistono delayed/dead-lettered item?
```

Vista:

- requested rate;
- local acceptance errors/latency;
- pending + oldest outbox age;
- publication latency;
- failure class;
- DLQ depth;
- reconciliation signal.

## Alert direction

### Page candidate

```text
core journey fast error-budget burn
Payment Escalation publication SLO severe burn
critical authorization/security signal
intra-region outage beyond tolerance
```

### Ticket candidate

```text
telemetry cost trend
capacity headroom decreasing
repeated low-severity dependency degradation
```

### Dashboard-only

```text
normal CPU fluctuation
individual retry count without user/business impact
single sampled trace anomaly
```

## Synthetic journey

Il production ingress è privato.

Decisione:

```text
NO public availability probe that bypasses the private boundary
```

Direzione futura:

```text
ESI private synthetic runner
→ approved private network path
→ Entra workload/test identity
→ dedicated synthetic tenant/data
→ core read journey
```

Questa capability è `Designed`, non ancora `Codified`.

Non allarghiamo la attack surface per facilitare il monitoring.

## Compromesso ESI

**Esigenza:** misurare SLO, diagnosticare incidenti e supportare on-call.

**Tensione:** dettaglio investigativo vs ingestion cost, cardinalità, privacy e operator noise.

**Decisione:** signal set piccolo ma correlabile; metriche bounded per SLI/alert; structured logs; trace sampling governato; audit/business evidence separati; niente ID unbounded nelle metric dimensions; synthetic journey solo dal private path.

**Costo accettato:** non conserveremo ogni execution detail per sempre e alcune analisi rare richiederanno correlazione fra signal diversi.

**Quality floor:** SLI misurabili, failure significativi investigabili, security data minimization, audit non campionato arbitrariamente, correlation end-to-end e cost visibility.

**Guardrail:** Observability Contract, cardinality budget, retention class, alert review, sampling policy e verification test.

## Stato di maturità

```text
Observability Contract     Designed
metric implementation      Pending
OpenTelemetry wiring       Pending
Application Insights       Codified foundation
structured business logs   Designed
synthetic private journey  Designed
alerts                     Designed
runtime evidence           Not yet available
```

Non confondiamo la presenza di Application Insights con una observability architecture completata.

## Fonti

- [OpenTelemetry — Documentation](https://opentelemetry.io/docs/)
- [OpenTelemetry — Signals](https://opentelemetry.io/docs/concepts/signals/)
- [Google SRE — Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)
- [Google SRE Workbook — Monitoring](https://sre.google/workbook/monitoring/)
- [Microsoft Learn — Application Insights overview](https://learn.microsoft.com/azure/azure-monitor/app/app-insights-overview)
- [Microsoft Learn — Azure Monitor OpenTelemetry](https://learn.microsoft.com/azure/azure-monitor/app/opentelemetry-overview)

> **Non vogliamo poter vedere tutto. Vogliamo poter ricostruire ciò che conta senza perdere il controllo del costo e del significato.**