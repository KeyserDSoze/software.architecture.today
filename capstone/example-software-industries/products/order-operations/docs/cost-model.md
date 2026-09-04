# Order Operations — Cost Model

> **Scenario fittizio ESI.** Stato corrente dopo il Capitolo 24. Questo documento non contiene prezzi cloud o AI inventati. Definisce cost surface, driver, unit metric, architectural premium, ownership e review trigger.

## Principle

> **Non ottimizziamo il costo togliendo qualità alla cieca. Ottimizziamo il rapporto fra ciò che paghiamo e ciò che il sistema deve garantire.**

Workload:

```text
Example Software Industries S.p.A.
└── Commerce & Operations
    └── Order Operations
```

Business outcome:

> ridurre il tempo necessario agli operatori per individuare, comprendere e gestire ordini che richiedono attenzione operativa.

Cost owner:

```text
Order Operations team
```

Finance counterpart:

```text
ESI Finance / FinOps — scenario simulato
```

## Evidence state

```text
Cost Model structure                 Codified
Azure billing data                   Pending
Production unit metrics              Pending
Cost allocation metadata in IaC      Partially Codified
Cost anomaly alerts                  Designed / Pending
Rate commitments                     Not decided
Runtime AI provider/model            Not selected
Runtime AI billing/usage             Pending
Runtime AI unit economics            Designed / not measured
```

## Current cost surface

| Area | Mechanism | Property purchased | Cost shape | State |
|---|---|---|---|---|
| application runtime | App Service, >=2 instances, zone direction | runtime + headroom + zonal resilience | base + step | Codified partly |
| database | managed PostgreSQL direction | durable local state + HA/recovery | base + storage + usage | Designed / partially Codified |
| messaging | Service Bus Premium | durable async delivery + private data plane + zonal resilience | premium base + usage | Codified |
| identity/secrets | Managed Identity + Key Vault | workload identity + secret governance | base/shared | Codified partly |
| observability | Application Insights/Log Analytics direction | SLI + investigation | usage + retention | Designed/Codified partly |
| backup/recovery | PostgreSQL backup/PITR direction | recoverability | storage + retention | Designed |
| networking | private endpoint direction | reduced public reachability | base/shared | Codified partly |
| non-production | test/integration/staging | verification | time + fidelity | Partially Designed |
| legacy coexistence | Operations Desk Classic + target | reversibility + semantic evidence | transition | Active |
| agentic engineering | sandbox/tool/model/review loops | delegated execution + verification | variable + people/time | Designed / partly observed |
| runtime AI | future Case Explanation model/provider | cognitive assistance | tokens/invocation/context/retry | Designed / provider Pending |
| AI evaluation | eval execution + human review | behavioral evidence | model runs + people/time | Designed / seed Codified |

## Architectural premiums

### CP-01 — Private messaging

```text
Mechanism
Service Bus Premium + private endpoint direction

Property purchased
private data plane + current security boundary

Review trigger
security boundary, platform alternative, materially different cost/value evidence
```

### CP-02 — Zonal runtime

```text
Mechanism
App Service capacity >= 2 + zone resilience direction

Property purchased
intra-region resilience for current RTO/SLO assumptions

Review trigger
SLO/RTO change, failure-drill evidence, traffic profile change
```

### CP-03 — Observability

```text
Mechanism
metrics + logs + traces + retention

Property purchased
SLI measurement + incident investigation + correlation

Review trigger
telemetry cost grows materially faster than useful workload/evidence
```

### CP-04 — Legacy coexistence

```text
Mechanism
Operations Desk Classic + Order Operations coexist

Property purchased
reversibility + characterization + shadow comparison

Review trigger
cutover evidence and consumer inventory allow retirement
```

### CP-05 — Runtime AI evidence premium

```text
Mechanism
versioned evals + model comparison + security cases + sampled human review

Property purchased
confidence that Case Explanation behavior remains useful, grounded and inside authority/security boundaries

Optimization consequence
reducing evaluation cost must not silently remove critical cross-tenant, authority-boundary or prompt-injection coverage

Review trigger
model/provider change, new context source, new tool, rising eval cost, stable evidence suggesting a cheaper gate can prove the same property
```

## Cost driver map

| ID | Area | Primary driver | Secondary driver | Future evidence |
|---|---|---|---|---|
| CD-01 | App runtime | traffic/concurrency | reliability headroom | Azure metrics + billing |
| CD-02 | PostgreSQL | data/query load | HA + backup retention | DB metrics + billing |
| CD-03 | Service Bus | tier + message volume | private/HA requirements | broker metrics + billing |
| CD-04 | Observability | telemetry volume | sampling/cardinality/retention | monitor usage + billing |
| CD-05 | Backup | retained data | RPO/retention | backup usage + billing |
| CD-06 | Network | private/shared topology | future cross-region | billing |
| CD-07 | Nonprod | environment hours | fidelity | deployment + billing |
| CD-08 | Legacy overlap | coexistence duration | shadow/engineering effort | migration evidence |
| CD-09 | Development agents | model/tool calls | repair loops + verifier/human review | agent workflow telemetry |
| CD-10 | Runtime AI | input/output context + invocation count | model route + retries | provider usage + billing |
| CD-11 | AI eval | case count × samples × model routes | grader + human calibration | eval run records |

## Cost shapes

```text
Fixed / baseline
→ minimum runtime, managed-service tier, shared platform allocation

Variable
→ telemetry, messages, storage, AI tokens/invocations, eval runs

Step
→ capacity tier, new replica/region, new dedicated runtime/platform capability

Transition
→ legacy coexistence, shadow mode, migration/reconciliation
```

## Unit metrics

### UM-01 — Cost per OperationalCase handled

```text
allocated Order Operations cost
/
OperationalCase handled
```

Read with service quality; lower cost with worse handling outcome is not automatically better.

State: `Designed / not measured`.

### UM-02 — Cost per Payment Escalation delivered

```text
allocated messaging + publisher + relevant telemetry
/
delivered Payment Escalation
```

Read together with Payment Escalation publication SLI.

State: `Designed / not measured`.

### UM-03 — Observability cost per 1,000 critical journeys

```text
allocated observability cost
/
critical journey count
* 1000
```

State: `Designed / not measured`.

### UM-04 — Cost per accepted delegated engineering task

Candidate future metric:

```text
agent/model/tool/sandbox cost
+ verification cost
+ human review cost
/
accepted delegated task
```

Pair with:

```text
post-verification finding rate
repair loops
time-to-acceptance
scope/policy violation rate
```

State: `Designed / no production workflow dataset`.

### UM-05 — Cost per accepted Case Explanation

```text
model/provider invocation cost
+ relevant runtime share
+ evaluation/quality allocation when useful
/
Case Explanation accepted/useful by defined product metric
```

Pair with:

```text
critical eval failure rate
groundedness/claim-support evidence
InsufficientEvidence rate
latency
operator correction/dismiss signal
```

Do not optimize this number by encouraging the model to answer when evidence is insufficient.

State: `Designed / model provider not selected / not measured`.

### UM-06 — Cost per explanation without critical eval finding

Candidate engineering/evaluation metric:

```text
model/eval run cost
/
explanation satisfying the current critical gate
```

Useful for model/provider comparison when run on the same versioned dataset.

State: `Designed / eval execution Pending`.

## Allocation direction

Current IaC metadata already protects:

```text
workload = order-operations
owner = commerce-operations
environment = <dev|staging|prod>
```

Direction:

```text
businessUnit = commerce-operations
product = order-operations
```

`cost-center` is deliberately not invented. It belongs to a real or explicitly simulated Finance mapping.

Shared cost policy remains necessary for:

```text
landing zone
networking
identity/security platform
shared observability
future shared AI gateway/model platform
```

## Runtime AI cost policy

The Case Explanation Assistant currently has no selected provider/model and no production bill.

Therefore we do **not** publish:

```text
price per explanation
monthly AI run rate
expected savings percentage
```

as if they were evidence.

When a provider comparison begins, record at least:

```text
provider/model route
model/deployment version
prompt/context version
input/output tokens or equivalent usage
retry count
latency
quality/eval result
```

Cost comparison without quality comparison is incomplete.

> **Il modello più economico è più economico soltanto se continua a comprare la proprietà per cui lo stiamo pagando.**

## Context cost

More context can increase both cost and latency while sometimes decreasing quality through noise.

This reinforces the Chapter 24 choice:

```text
bounded deterministic case context
before
broad enterprise corpus
```

If RAG is introduced later, new cost surfaces include:

```text
embedding/index build
storage
re-indexing
retrieval/query
re-ranking
additional context tokens
ACL/freshness operations
```

A vector database is therefore not a free architectural default.

## Evaluation cost

AI evaluation has a carrying cost:

```text
model runs
multiple samples
judge runs
human SME review
red-team/security review
dataset maintenance
```

But skipping evaluation can transfer that cost into production rework, unsafe behavior or operator mistrust.

Optimization direction:

1. deterministic checks for deterministic properties;
2. targeted behavioral evals for probabilistic properties;
3. heavier human/security review for critical/high-ambiguity cases;
4. reuse versioned datasets where they still represent current product risk;
5. retire obsolete eval cases only through explicit review.

## Non-production economics

> **Use the cheapest environment capable of demonstrating the property.**

```text
business rule                  → local deterministic
PostgreSQL semantics           → real PostgreSQL
Azure identity/network         → Azure non-production
AI boundary/source validation  → local deterministic
AI model behavior              → real model/configuration
AI provider security/network   → appropriate non-production/provider boundary
recovery                       → environment capable of the drill
```

## Optimization order

Prefer:

1. improve attribution and visibility;
2. remove unused resources/workflows;
3. reduce unnecessary non-production runtime;
4. control telemetry/context volume;
5. bound retries and repair loops;
6. route simple AI tasks to cheaper models only after workload eval;
7. right-size infrastructure while preserving failure headroom;
8. reduce legacy coexistence when migration evidence allows;
9. only then reopen architectural premiums protecting security/reliability/evidence.

## Guardrail for architecture-changing cost cuts

A cost reduction reopens the relevant artifact when it changes:

```text
security/tenant boundary
SLO / RTO / RPO
backup/recovery
observability/evaluation evidence
data ownership
migration rollback
agent verification independence
runtime AI model authority/context/tool/fallback
```

Examples:

```text
remove Service Bus Premium
→ reopen Threat Model / Cloud Deployment

reduce App Service below failure headroom
→ reopen Reliability Contract

stop critical AI evals to save tokens
→ reopen AI Feature Contract / Testing Strategy

switch to cheaper model route
→ run the same critical workload eval before claiming equivalence
```

## Review triggers

Review this Cost Model when:

- production billing becomes available;
- unit cost diverges materially from business volume;
- a new paid tier/capability is introduced;
- telemetry volume or retention changes materially;
- legacy coexistence exceeds milestone;
- security/SLO/recovery requirement changes;
- a runtime AI provider/model is selected;
- RAG/vector retrieval is introduced;
- AI write tools increase execution/evaluation cost;
- agent or runtime AI cost grows without proportional verified outcome.

## Sources

- [Microsoft Learn — Cost Optimization design principles](https://learn.microsoft.com/en-us/azure/well-architected/cost-optimization/principles)
- [Microsoft Learn — Develop a cost model](https://learn.microsoft.com/en-us/azure/well-architected/cost-optimization/cost-model)
- [FinOps Framework — Unit Economics](https://www.finops.org/framework/capabilities/unit-economics/)
- [FinOps Framework — Allocation](https://www.finops.org/framework/capabilities/allocation/)
- [OpenAI — A shared playbook for trustworthy third party evaluations](https://openai.com/index/trustworthy-third-party-evaluations-foundations/)
- [Uber Engineering — Enhanced Agentic-RAG](https://www.uber.com/au/en/blog/enhanced-agentic-rag/)

> **Una metrica di costo è utile soltanto se resta accoppiata alla qualità, al rischio e all'outcome che quel costo dovrebbe comprare.**