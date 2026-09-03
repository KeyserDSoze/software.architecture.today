# Observability Contract

Finora abbiamo costruito diversi artefatti operativi:

```text
Failure Mode Map
Threat Model
Security Control Matrix
Reliability Contract
```

Ora introduciamo l'artefatto che collega questi documenti ai signal che il sistema deve produrre.

Lo chiamiamo:

> **Observability Contract**

Non è uno standard universale.

È l'artefatto operativo usato da questo libro per dichiarare:

- che cosa dobbiamo poter osservare;
- perché;
- attraverso quale signal;
- chi lo possiede;
- come viene verificato;
- quale retention/costo accettiamo;
- quale response path esiste.

## Perché un contratto

L'instrumentation tende a disperdersi nel codice.

Una metric qui.

Un log lì.

Una dashboard costruita durante un incidente.

Un alert creato mesi dopo.

Senza una vista d'insieme diventa difficile rispondere a domande semplici:

- quali signal misurano davvero gli SLO?
- quale telemetry protegge un security control?
- quali metric non usa nessuno?
- chi possiede un alert?
- quali identifier possiamo registrare?
- quali retention sono intenzionali?
- cosa deve essere verificato prima della produzione?

## Template

Una versione leggera può essere:

```markdown
# Observability Contract

## Critical journeys

## SLI / SLO measurements

## Metrics

## Traces

## Structured logs

## Business events

## Audit / security signals

## Correlation

## Cardinality rules

## Sampling

## Retention

## Alerts

## Dashboards / investigation views

## Synthetic checks

## Ownership

## Verification

## Cost guardrails

## Open decisions
```

Non tutte le sezioni devono essere enormi.

Devono essere sufficienti a governare il workload.

## Signal registry

Per i signal significativi possiamo usare una tabella:

| Signal | Type | Purpose | Dimensions/context | Consumer | Owner | Retention | Status |
|---|---|---|---|---|---|---|---|
| core journey good events | metric | SLI | env/version/result | SLO | workload | TBD | Designed |
| outbox oldest age | gauge | backlog risk | env | alert/debug | workload | TBD | Designed |
| Payment Escalation delivery | histogram | business delivery SLI | result | SLO | workload | TBD | Designed |
| publish failure | structured event | diagnosis | failure class/message correlation | investigation | workload | TBD | Designed |

Questa tabella non deve diventare un catalogo di ogni log line.

Registra ciò che ha significato architetturale o operativo.

## Link con Reliability Contract

Ogni SLI deve indicare il proprio measurement source.

Per esempio:

```text
Reliability Contract:
Payment Escalation publication SLO
99% <= 5m
```

nel contract observability diventa:

```text
source event = Requested
terminal event = Published
business key = escalationId
measure = publishedAt - requestedAt
aggregation = successful within target / valid requested
```

A questo punto lo SLO è molto più vicino a essere verificabile.

## Link con Failure Mode Map

Ogni failure significativo dovrebbe avere almeno un modo di essere rilevato o investigato.

Esempio:

```text
Failure Mode:
Service Bus unavailable
```

Observability:

```text
publish failures
outbox oldest age
outbox pending count
Service Bus dependency telemetry
Payment Escalation publication SLI
```

Non significa un alert per ogni signal.

Significa che il failure non è invisibile.

## Link con Threat Model

Esempio:

```text
Threat:
cross-tenant access attempt
```

Signal possibili:

```text
authorization decision outcome
actor security context class
resource tenant mismatch category
request correlation
```

con data minimization e senza registrare token.

Il threat model dice che cosa temiamo.

L'Observability Contract dice quale evidence ci aspettiamo.

## Link con Security Control Matrix

Un controllo può avanzare:

```text
Designed
→ Codified
→ Verified
→ Monitored
```

La transizione a `Monitored` richiede una risposta concreta.

Esempio:

```text
SC-13 Service Bus send-only runtime privilege
```

`Codified`:

```text
RBAC in Bicep
```

`Verified`:

```text
negative admin permission test
```

`Monitored`:

```text
privileged role/configuration changes osservabili tramite platform audit path
```

Non ogni controllo richiede un custom application metric.

Alcuni signal appartengono a Platform/Security.

## Correlation contract

Dobbiamo dichiarare quali identifier attraversano quali boundary.

Order Operations:

```text
HTTP request
  traceId
  correlationId

OperationalCase
  caseId

PaymentEscalation
  escalationId

OutboxMessage
  messageId
  correlationId
  escalationId

Payments consumer
  messageId
  escalationId
  correlationId
```

Regola:

- `traceId` serve all'execution trace;
- `correlationId` collega un flusso operativo più ampio quando necessario;
- `messageId` identifica la delivery tecnica;
- `escalationId` identifica l'intenzione business;
- nessuno di questi identifier deve diventare automaticamente una metric label.

## Telemetry schema versioning

Anche la telemetry è un contratto.

Se rinominiamo:

```text
payment_escalation_delivery_seconds
```

senza aggiornare:

- SLI query;
- alert;
- dashboard;
- runbook;
- test;

abbiamo introdotto una breaking change operativa.

Questo è un tipo di compatibility spesso ignorato.

## Dashboard come view, non source of truth

Una dashboard dovrebbe poter essere ricostruita dal contract e dalle query sottostanti.

Non deve diventare l'unico posto dove esiste la conoscenza.

Per ESI preferiamo dashboard orientate a domande:

### Service health

```text
core journey SLI
error-budget burn
latency/errors/traffic/saturation
current degraded state
recent deployments
```

### Payment Escalation delivery

```text
requested rate
local acceptance failures
outbox pending/oldest age
publish latency
DLQ
business delivery SLI
```

### Investigation

```text
failure class
trace search
recent deployment/configuration changes
dependency latency
```

Non una dashboard per ogni Azure resource soltanto perché esiste.

## Verification del contract

Prima di chiamare un signal `Verified` dobbiamo poter produrre evidence.

Esempi:

```text
inject known application failure
→ metric/error event appare

create synthetic trace
→ correlation attraversa boundary

force publish failure in test environment
→ outbox age cresce
→ alert condition/query è verificabile

redeliver same message
→ duplicate telemetry è distinguibile dal duplicate business effect
```

## Observability tests

L'observability può essere testata.

Possiamo verificare:

- metric emitted;
- required structured fields;
- forbidden sensitive fields absent;
- trace parent/context propagation;
- stable business correlation;
- alert query on fixture telemetry;
- dashboard query correctness;
- SLI computation against known dataset.

Questi test non sostituiscono l'osservazione in produzione.

Ma riducono il rischio che l'incidente sia il primo momento in cui scopriamo che la telemetry non funziona.

## Il contract non deve diventare burocratico

Se l'Observability Contract contiene 500 metriche e nessuna domanda, abbiamo ricreato il problema in Markdown.

Manteniamo dentro il contract ciò che governa:

- outcome;
- failure;
- security;
- recovery;
- cost;
- investigation.

Il dettaglio implementativo può vivere nel codice o nella piattaforma.

## Fonti

- [OpenTelemetry — Observability primer](https://opentelemetry.io/docs/concepts/observability-primer/)
- [OpenTelemetry — Specification overview](https://opentelemetry.io/docs/specs/otel/overview/)
- [Google SRE Workbook — Monitoring](https://sre.google/workbook/monitoring/)

> **L'Observability Contract non descrive tutto ciò che possiamo misurare. Descrive ciò che dobbiamo riuscire a sapere.**