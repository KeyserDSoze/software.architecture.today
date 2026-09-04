# Order Operations — Observability Contract

> **Scenario fittizio ESI.** Stato corrente dopo il Capitolo 24. Le capability OpenTelemetry/Azure citate sono reali; SLO, signal set e cost decision ESI sono simulati.

## Purpose

Rendere misurabili reliability, security e runtime AI behavior senza produrre telemetry incontrollata per costo, cardinalità o data exposure.

> **La telemetry deve aiutare a distinguere comportamento, failure e incertezza; non deve diventare una seconda copia incontrollata dei dati del prodotto.**

## Architecture direction

```text
Order Operations runtime
→ OpenTelemetry-compatible instrumentation
→ Azure Monitor / Application Insights / Log Analytics
→ SLI queries + alerts + investigation views
```

Per Case Explanation Assistant il model/provider adapter è ancora `Pending`, quindi i signal AI sono **Designed**, non runtime-Verified.

## Critical journeys

### OJ-01 — Core operator read

```text
operator
→ private ingress
→ authentication/authorization
→ Order Operations
→ authoritative dependencies
→ operational view
```

Target simulato già definito:

```text
99.9% good events / rolling 28 days
```

### OJ-02 — Payment Escalation local acceptance

```text
operator
→ authorization
→ PostgreSQL transaction
  ├── PaymentEscalation
  └── OutboxMessage
→ 202 Accepted
```

### OJ-03 — Payment Escalation publication

```text
outbox
→ publisher
→ Service Bus
```

Target simulato:

```text
99% <= 5 minutes
```

### OJ-04 — Case Explanation Assistant

```text
operator
→ authorized case context
→ CaseExplanationPort
→ model/provider adapter
→ output/source validation
→ explanation
```

Important relationship:

```text
OJ-04 unavailable
≠
OJ-01 unavailable
```

Case Explanation v1 is secondary/advisory and must not pull the core operational view into the same availability boundary.

No production SLO is invented yet for OJ-04. Establish baseline first.

## Signal registry

| Signal | Type | Purpose | Bounded dimensions | Status |
|---|---|---|---|---|
| core journey requests/duration | counter/histogram | SLI-01 | env, version, result | Designed |
| escalation requested/local duration | counter/histogram | SLI-02 | env, result | Designed |
| outbox pending/oldest age | gauge | delivery risk | env | Designed |
| publish failure/publication duration | event/histogram | SLI-03 | env, failureClass/result | Designed |
| DLQ depth | gauge | recovery | env | Designed |
| authorization denial | event/counter | security | env, reasonClass | Designed |
| `case_explanation.request` | counter | AI demand | env, modelRoute | Designed |
| `case_explanation.completed` | counter | AI outcome | env, resultStatus, modelRoute | Designed |
| `case_explanation.unavailable` | counter/event | provider/fallback health | env, failureClass, modelRoute | Designed |
| `case_explanation.insufficient_evidence` | counter | grounding/context quality | env, modelRoute | Designed |
| `case_explanation.invalid_output` | counter/event | schema/validation failure | env, failureClass, modelRoute | Designed |
| `case_explanation.security_rejected` | counter/event | security control | env, reasonClass | Designed |

Final metric names may follow current OpenTelemetry semantic conventions where appropriate. This document owns the workload semantics, not vendor-specific names.

## AI configuration identity

Any AI trace/eval/runtime evidence should identify enough configuration to make the observation meaningful:

```text
modelRoute
model/deployment version
prompt/system-instruction version
contextBuilderVersion
outputSchemaVersion
toolSetVersion when tools exist
```

Do not assume `model name` alone identifies the tested behavior.

## Cardinality budget

Allowed metric dimensions remain bounded:

```text
environment
serviceVersion
route template
result class
failure class
modelRoute
promptVersion
contextBuilderVersion
```

Not allowed as metric dimensions by default:

```text
operatorId
orderId
caseId
escalationId
messageId
traceId
raw URL
raw prompt
raw model output
free-text error
source document text
```

High-cardinality identifiers can live in appropriately governed traces/logs when necessary for investigation.

## Correlation contract

```text
traceId/spanId
→ execution identity

correlationId
→ cross-boundary operational flow

messageId
→ technical message delivery identity

escalationId
→ Payment Escalation business identity

caseId
→ Operational Case business identity in governed trace/log context, not metric dimension
```

For Case Explanation future traces:

```text
request span
→ authorization/context assembly
→ provider/model invocation
→ validation
→ result/fallback
```

Raw context should not be attached indiscriminately to spans.

## Structured events

Existing events include Payment Escalation acceptance/publication failures.

AI candidate events:

### case_explanation_completed

```text
traceId
resultStatus
modelRoute
promptVersion
contextBuilderVersion
sourceCount
```

### case_explanation_security_rejected

```text
traceId
reasonClass
modelRoute when invocation occurred
```

### case_explanation_invalid_output

```text
traceId
failureClass
repairAttemptCount
modelRoute
```

Do not include raw source text or secrets.

## AI quality signals

Runtime telemetry cannot replace offline evaluation, but it can expose drift.

Candidate operational measures:

```text
Unavailable rate
InsufficientEvidence rate
invalid-output rate
bounded repair rate
latency distribution
cost per request / accepted explanation when billing exists
source coverage
user correction/dismiss signal when product UX exists
sampled human quality review
security rejection rate
```

Interpret carefully:

```text
low InsufficientEvidence rate
```

is not automatically good if the model has simply become more willing to invent answers.

Pair behavior metrics with quality/eval evidence.

## Sampling

### SLI metrics

Must not depend on trace sampling.

### Audit/security events

Must not be arbitrarily sampled using the same policy as diagnostic traces.

### AI prompts/context/output

Do **not** default to full capture.

Any sampled content logging requires:

```text
purpose
data classification
redaction/minimization
access control
retention
security/privacy review
```

Prefer metadata and explicit evaluation datasets over silently storing all production prompts.

## Retention classes

Keep distinct:

1. SLI/operational metrics;
2. diagnostic traces;
3. structured application logs;
4. security/audit events;
5. business operational evidence;
6. AI evaluation datasets/results;
7. sampled AI quality-review records, if approved.

Longer retention is not automatically better.

## Alerts

Page only when a human action is urgent and useful.

Current candidates:

```text
core journey fast error-budget burn
Payment Escalation severe publication burn
security-significant condition
```

Case Explanation v1 is advisory; a pure provider outage should normally degrade the feature rather than page as a core workload outage.

Potential ticket/operational alerts:

```text
AI unavailable rate sustained
invalid-output spike
security rejection anomaly
cost/latency trend
model/configuration change with regression signal
```

## Synthetic / evaluation relationship

Production synthetic monitoring remains private because production ingress is private.

AI behavioral quality is primarily protected by:

```text
versioned offline eval
+ staging/provider integration
+ sampled production evidence
```

not by a single synthetic sentence repeated forever.

## Failure Mode / Threat traceability

Examples:

| Failure / threat | Detection / evidence |
|---|---|
| PostgreSQL unavailable | dependency failure + core SLI |
| Service Bus unavailable | publish failure + outbox age + SLI-03 |
| bad deployment | SLI/error correlated with deployment marker |
| telemetry pipeline failure | heartbeat/platform signal; absence ≠ health |
| AI provider timeout | `case_explanation.unavailable` + latency/failure class |
| invalid AI output | `case_explanation.invalid_output` + validation result |
| missing context | `InsufficientEvidence` + source availability/context-builder evidence |
| prompt-injection/security rejection | bounded security event + eval/test evidence |
| model/config drift | configuration identity + regression eval/runtime quality comparison |

## Verification

Before declaring traditional observability `Verified`, still require known-signal emission, correlation checks, redaction checks, alert/query exercise and telemetry pipeline failure handling.

Before declaring AI observability `Verified`, require at least:

```text
real provider/model adapter exists
known explanation request emits expected trace/events
fallback produces expected status/signal
invalid output produces validation signal
raw sensitive context is absent from default telemetry
configuration identity is queryable
```

No such runtime AI verification exists yet.

## Cost guardrails

Review:

```text
ingestion volume
sampling
custom metrics/cardinality
retention
unused signals
AI prompt/output capture volume
AI provider latency/cost telemetry
cost allocation to workload
```

Cost belongs with usefulness/quality, not alone.

## AI-assisted investigation

Development/operations agents may use read-only telemetry to propose hypotheses, but must separate:

```text
observation
hypothesis
supporting evidence
contradiction
next check
```

This is distinct from **Case Explanation Assistant**, which is a runtime product feature governed by `docs/ai-feature-contract.md`.

## Current evidence state

```text
Observability Contract                     Codified
bounded telemetry port/decorator           Codified + previously typechecked
OpenTelemetry/Application Insights adapter Pending
runtime SLI queries/alerts                  Designed / Pending
private synthetic journey                  Designed / Pending
AI signal semantics                        Designed + documented
AI provider/model telemetry                Pending
production AI quality evidence             Pending
```

## Sources

- [OpenTelemetry — Documentation](https://opentelemetry.io/docs/)
- [Google SRE — Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)
- [Microsoft Learn — Application Insights overview](https://learn.microsoft.com/azure/azure-monitor/app/app-insights-overview)
- [Microsoft Learn — Azure Monitor OpenTelemetry](https://learn.microsoft.com/azure/azure-monitor/app/opentelemetry-overview)
- [Microsoft Foundry — Built-in evaluators](https://learn.microsoft.com/en-us/azure/foundry/concepts/built-in-evaluators)
- [NIST AI 600-1 — Generative AI Profile](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence)

> **Per una feature AI, osservare soltanto errori HTTP significa osservare il trasporto. Dobbiamo anche riuscire a vedere quando il comportamento smette di meritare fiducia.**