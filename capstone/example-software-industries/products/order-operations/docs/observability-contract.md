# Order Operations — Observability Contract

> **Scenario fittizio ESI.** Questo documento definisce il contratto di observability corrente dopo il Capitolo 15. Le capability OpenTelemetry/Azure citate sono reali; SLO, signal set, retention e cost decision ESI sono simulati.

## Purpose

Rendere misurabili i Reliability Requirements e investigabili i failure/threat significativi senza produrre telemetry incontrollata per costo, cardinalità o data exposure.

## Architecture direction

```text
Order Operations application/runtime
→ OpenTelemetry-compatible instrumentation
→ Azure Monitor / Application Insights / Log Analytics
→ SLI queries + alerts + investigation views
```

OpenTelemetry è il modello/toolkit di instrumentation.

Azure Monitor/Application Insights è il backend operativo scelto nello scenario ESI.

## Critical journeys

### OJ-01 — Core operator read journey

```text
operator
→ private ingress
→ Entra authentication
→ application authorization
→ Order Operations
→ authoritative dependencies
→ operational view
```

Domanda:

> l'operatore riesce a ottenere una vista utilizzabile dell'ordine entro la latency target?

### OJ-02 — Payment Escalation local acceptance

```text
operator
→ POST payment escalation
→ authorization
→ PostgreSQL transaction
  ├── PaymentEscalation
  └── OutboxMessage
→ 202 Accepted
```

Domanda:

> l'intenzione viene registrata durablemente senza dipendere dalla disponibilità runtime di Payments & Risk?

### OJ-03 — Payment Escalation publication

```text
outbox
→ publisher
→ Service Bus
```

Domanda:

> le escalation accettate localmente vengono pubblicate entro il business delivery target?

## SLI / SLO measurement

### SLI-01 — Core operator journey good-event ratio

Target simulato ESI:

```text
99.9% / rolling 28 days
```

Good event direction:

```text
authorized request
AND functional outcome valid
AND latency within threshold
AND no semantic degradation beyond allowed state
```

Measurement source:

- application request metric/event;
- route template bounded;
- result classification;
- deployment version.

### SLI-02 — Payment Escalation local acceptance

Measurement:

```text
accepted_or_idempotent_replay
/
valid_authorized_requests
```

Supporting latency histogram:

```text
payment_escalation_local_accept_duration
```

### SLI-03 — Payment Escalation publication

Target simulato ESI:

```text
99% <= 5 minutes
```

Primary measurement:

```text
publishedAt - requestedAt
```

Business identity:

```text
EscalationId
```

Retry count is diagnostic context, not the SLI.

## Signal registry

| Signal | Type | Purpose | Bounded dimensions | Primary consumer | Owner | Status |
|---|---|---|---|---|---|---|
| core journey requests | counter | traffic + SLI | env, version, result | SLO | workload | Designed |
| core journey duration | histogram | latency SLI | env, version, result | SLO | workload | Designed |
| escalation requested | counter | business traffic | env, result | SLI/dashboard | workload | Designed |
| escalation local accept duration | histogram | local acceptance | env, result | SLI | workload | Designed |
| idempotent replay | counter | retry behavior | env | investigation | workload | Designed |
| outbox pending | gauge | backlog | env | dashboard/alert | workload | Designed |
| outbox oldest age | gauge | delivery risk | env | SLI/alert | workload | Designed |
| outbox publish failure | counter/event | diagnosis | env, failureClass | investigation | workload | Designed |
| escalation publication duration | histogram | SLI-03 | env, result | SLO | workload | Designed |
| DLQ depth | gauge | recovery | env | alert | Payments + workload | Designed |
| authorization denial | counter/event | security visibility | env, reasonClass | Security/investigation | workload | Designed |

Final metric names may follow current OpenTelemetry semantic conventions where appropriate. This table owns semantics, not vendor-specific naming.

## Cardinality budget

Custom metric dimensions MUST be bounded by design.

Allowed direction:

```text
environment
service/version
route template
result class
failure class
```

Not allowed as metric dimensions by default:

```text
userId
operatorId
orderId
caseId
escalationId
messageId
traceId
raw URL
free-text error
```

Exceptions require explicit owner, purpose and cost/privacy review.

## Correlation contract

### Execution identity

```text
traceId
spanId
```

Used for execution traces.

### Flow identity

```text
correlationId
```

Used when an operational flow crosses asynchronous boundaries.

### Technical delivery identity

```text
messageId
```

Stable for retry/republish of the same outbox message.

### Business identity

```text
escalationId
```

Stable for the same Payment Escalation intent.

Rule:

> trace identity MUST NOT replace business identity.

A retry may create a different execution trace while preserving the same `escalationId` and `messageId` semantics.

## Structured application events

### payment_escalation_requested

Candidate fields:

```text
traceId
correlationId
caseId
escalationId
result
actorClass
```

### payment_escalation_publish_failed

```text
traceId
correlationId
messageId
escalationId when available
attempt
failureClass
```

### Forbidden telemetry content

MUST NOT include by default:

```text
access tokens
Authorization header
static credentials
raw secrets
payment credentials
unbounded request/response body
```

Sensitive identifiers require classification and minimum necessary use.

## Trace model

### HTTP/application trace

```text
HTTP request
→ authorization
→ use case
→ PostgreSQL transaction
```

### Publisher trace

```text
outbox poll
→ load message
→ Service Bus publish
→ mark local publication state
```

Asynchronous causal linkage MUST preserve stable business/technical identifiers even when execution trace changes.

## Sampling

### Metrics used for SLI

MUST NOT depend on trace sampling.

### Audit/security evidence

MUST NOT be arbitrarily sampled using the same policy as diagnostic traces.

### Diagnostic traces

Sampling is permitted.

Initial percentage is intentionally **not fixed** until volume/cost evidence exists.

Future tail sampling trigger:

- significant trace volume;
- need to preserve errors/high-latency traces selectively;
- cost curve justifies collector/buffering complexity;
- Platform provides a shared capability.

## Retention classes

Final numbers remain open.

Classes:

1. SLI/operational metrics;
2. diagnostic traces;
3. structured application logs;
4. security/audit events;
5. business operational evidence.

Retention decisions require input from workload, Platform, Security, Legal/Compliance and Finance/FinOps.

Longer retention is not automatically better.

## Alerts

### Page candidates

- core journey fast error-budget burn;
- Payment Escalation publication severe SLO burn;
- intra-region availability incident beyond target;
- security-significant condition requiring immediate containment.

### Ticket candidates

- telemetry cost trend beyond budget;
- capacity headroom trend;
- repeated non-urgent dependency degradation;
- obsolete/unused observability signal cleanup.

### Dashboard-only candidates

- normal CPU variation;
- individual retry without business impact;
- single sampled trace anomaly.

Every page alert MUST declare:

```text
impact
urgency
owner
first action
runbook/context
resolution signal
```

## Dashboards / investigation views

### Workload health

- SLI/SLO;
- error-budget burn;
- latency/traffic/errors/saturation;
- degraded state;
- recent deployment markers;
- dependency status.

### Payment Escalation

- request rate;
- local acceptance latency/failure;
- outbox pending + oldest age;
- publication latency;
- publish failure class;
- DLQ depth;
- reconciliation mismatch.

Dashboards are views over governed signal/query definitions, not the source of truth for observability semantics.

## Synthetic monitoring

Production ingress is private.

Decision:

```text
No Internet-based public probe that requires reopening the production boundary.
```

Designed future path:

```text
private synthetic runner
→ ESI approved private path
→ dedicated test/workload identity
→ synthetic tenant/data
→ read-only core journey where possible
```

Status:

```text
Designed
not yet Codified
not yet Verified
```

## Failure Mode Map traceability

Minimum coverage examples:

| Failure | Detection/investigation signal |
|---|---|
| App Service instance/zone failure | core SLI, platform health, instance telemetry |
| PostgreSQL unavailable | dependency failure + core SLI |
| Service Bus unavailable | publish failure + outbox oldest age + SLI-03 |
| Payments consumer unavailable | queue/DLQ/downstream evidence + SLI-03 when available |
| private DNS failure | dependency failures correlated across private services |
| bad deployment | SLI/error changes correlated with deployment version/time |
| Key Vault failure | dependency/auth failure without secret content |
| telemetry pipeline failure | telemetry heartbeat/platform signal; absence must not be interpreted as health |

## Threat Model / Security Control traceability

Examples:

```text
cross-tenant denial
→ bounded authorization reason event

privileged configuration change
→ platform audit signal

secret leakage prevention
→ telemetry field policy + negative verification
```

Telemetry storage and query access are themselves security-sensitive.

## Verification

Required evidence before declaring observability `Verified`:

- known request emits expected metric/trace/event;
- forbidden token/secret fields absent;
- correlation survives asynchronous boundary in test;
- forced publish failure increases expected signal;
- SLI query returns expected result on fixture/test data;
- alert query is exercised against known condition;
- deployment marker is queryable;
- telemetry pipeline failure is distinguishable from healthy-zero traffic.

## Cost guardrails

Review at least:

```text
ingestion volume by signal class
trace sampling rate
custom metrics/cardinality
retention
unused dashboards/alerts
verbose/debug logging
cost allocation to workload
```

## AI-assisted investigation

Agents MAY use read-only access to telemetry and repository context to:

- summarize incident window;
- propose hypotheses;
- generate queries;
- correlate deployment and telemetry;
- build timeline.

Agent output MUST separate:

```text
observation
hypothesis
supporting evidence
contradiction
next check
```

Write/remediation permissions are a separate autonomy decision.

## Compromesso Capitolo 15

**Esigenza:** misurare SLO e diagnosticare incidenti.

**Tensione:** visibility vs cost, cardinality, privacy e alert fatigue.

**Decisione:** bounded metrics + structured logs/events + governed trace sampling + separate audit/business evidence + private synthetic direction.

**Costo accettato:** non conservare ogni execution detail indefinitamente.

**Quality floor:** measurable SLI, critical failure visibility, correlation, security minimization, actionable alerts and cost visibility.

**Guardrail:** this contract, cardinality budget, retention classes, sampling policy, alert review and verification tests.

## Sources

- [OpenTelemetry — Documentation](https://opentelemetry.io/docs/)
- [OpenTelemetry — Signals](https://opentelemetry.io/docs/concepts/signals/)
- [OpenTelemetry — What is OpenTelemetry?](https://opentelemetry.io/docs/what-is-opentelemetry/)
- [Google SRE — Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)
- [Google SRE Workbook — Monitoring](https://sre.google/workbook/monitoring/)
- [Microsoft Learn — Application Insights overview](https://learn.microsoft.com/azure/azure-monitor/app/app-insights-overview)
- [Microsoft Learn — Azure Monitor OpenTelemetry](https://learn.microsoft.com/azure/azure-monitor/app/opentelemetry-overview)

> **The contract is intentionally smaller than the telemetry platform. It describes what the workload must be able to know.**