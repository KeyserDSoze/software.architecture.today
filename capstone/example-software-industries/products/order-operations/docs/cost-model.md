# Order Operations — Cost Model

> **Scenario fittizio ESI.** Stato corrente dopo il Capitolo 20. Questo documento non contiene prezzi Azure reali né benchmark. Definisce categorie, driver, unit metrics, ownership economica e review trigger del workload.

## Principle

> **Non ottimizziamo il costo togliendo qualità alla cieca. Ottimizziamo il rapporto fra ciò che paghiamo e ciò che il sistema deve garantire.**

## Scope

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

Budget / finance counterpart:

```text
ESI Finance / FinOps — scenario simulato
```

## Evidence state

```text
Cost Model structure              = Designed + documented
Azure billing data                = Not available in capstone
Unit metrics definitions          = Designed
Unit metrics measured             = Pending production/billing data
Cost allocation metadata in IaC   = Partially Codified
Cost anomaly alerts               = Designed / Pending
Rate commitments                  = Not decided
```

## Current architecture cost surface

| Area | Mechanism | Property purchased | Cost shape | Current status |
|---|---|---|---|---|
| application runtime | App Service Premium-compatible plan, >=2 instances | runtime + headroom + zonal resilience direction | base + step | Codified |
| database | Azure Database for PostgreSQL direction | durable local state + HA/recovery | base + usage + storage | Designed / partially IaC pending |
| messaging | Service Bus Premium | durable async delivery + private data plane + zonal resilience | premium base + usage | Codified |
| secrets / identity | Managed Identity + Key Vault | workload identity + secret governance | base/shared | Codified partly |
| observability | Application Insights + Log Analytics direction | SLI measurement + investigation | usage + retention | Designed/Codified partly |
| backup/recovery | PostgreSQL backup/PITR direction | recoverability | storage + retention | Designed |
| networking | private endpoint direction | reduced public reachability | base/shared | Codified partly |
| non-production | dev/staging/integration environments | verification | time + fidelity | Partially Designed |
| legacy coexistence | Operations Desk Classic + Order Operations | migration reversibility + semantic evidence | transition | Active in capstone narrative |
| engineering / operations | team ownership + verification | changeability + operability | people/time | not monetized |

## Architectural premiums

### CP-01 — Private messaging premium

```text
Mechanism
Service Bus Premium + private endpoint direction

Property purchased
private data-plane reachability + current security boundary

Related artifacts
threat-model.md
security-control-matrix.md
cloud-deployment.md

Optimization consequence
moving to a cheaper tier is an architecture/security decision, not a pure rate optimization

Review trigger
security boundary changes, platform alternative, materially different cost/value evidence
```

### CP-02 — Zonal runtime premium

```text
Mechanism
App Service capacity >= 2 + zone redundancy direction

Property purchased
intra-region resilience for current RTO/SLO assumptions

Related artifact
reliability-contract.md

Optimization consequence
rightsizing cannot silently remove required failure headroom

Review trigger
SLO/RTO changes, failure drill evidence, materially different traffic profile
```

### CP-03 — Observability premium

```text
Mechanism
metrics + logs + traces + retention

Property purchased
SLI measurement + incident investigation + correlation

Related artifact
observability-contract.md

Optimization consequence
sampling/retention can be tuned, but required evidence must remain available

Review trigger
telemetry cost growth faster than critical journey growth without a new diagnostic requirement
```

### CP-04 — Migration overlap premium

```text
Mechanism
Operations Desk Classic remains operational while target policy evolves

Property purchased
reversibility + characterization + shadow comparison

Related artifacts
legacy-understanding-map.md
refactoring-safety-plan.md

Optimization consequence
coexistence must not become permanent by inertia

Review trigger
candidate rollout evidence available, consumer inventory complete, retirement blockers resolved
```

## Cost driver map

| ID | Area | Primary driver | Secondary driver | Evidence source future |
|---|---|---|---|---|
| CD-01 | App runtime | operator traffic / concurrency | reliability headroom | Azure metrics + billing |
| CD-02 | PostgreSQL | data volume + query load | HA / backup retention | DB metrics + billing |
| CD-03 | Service Bus | baseline tier + message volume | private/HA requirements | broker metrics + billing |
| CD-04 | Observability | telemetry volume | sampling, cardinality, retention | Azure Monitor usage + billing |
| CD-05 | Backup | retained data | RPO/retention policy | backup usage + billing |
| CD-06 | Network | private/shared topology + data transfer | future cross-region | network/billing |
| CD-07 | Nonprod | environment hours | environment fidelity | deployment + billing |
| CD-08 | Legacy overlap | coexistence duration | shadow volume + engineering effort | migration plan + finance estimate |
| CD-09 | AI future | tokens/context/tool calls | retries + verification | future agent telemetry |

## Cost shape

### Fixed / baseline

```text
minimum application runtime
managed service tier baseline
shared enterprise platform allocation
```

### Variable

```text
telemetry ingestion
message volume
storage growth
data transfer
future AI token/tool usage
```

### Step

```text
capacity scale step
new replica
new region
new dedicated runtime
new operational team/tooling need
```

### Transition

```text
legacy + target coexistence
shadow mode
migration/reconciliation
```

## Unit metrics

### UM-01 — Cost per OperationalCase handled

Formula direction:

```text
allocated monthly Order Operations cost
/
OperationalCase handled in the same period
```

Purpose:

- connect workload cost with operational demand;
- identify cost growth that is disproportionate to case volume;
- support forecasting.

State:

```text
Designed / not yet measured
```

### UM-02 — Cost per Payment Escalation delivered

Formula direction:

```text
allocated messaging
+ publisher runtime share
+ relevant telemetry share
/
delivered Payment Escalation
```

Read together with:

```text
Payment Escalation publication SLI
```

A lower unit cost with degraded delivery quality is not automatically an improvement.

State:

```text
Designed / not yet measured
```

### UM-03 — Observability cost per 1,000 critical journeys

Formula direction:

```text
allocated observability cost
/
critical journey count
* 1000
```

Purpose:

- detect telemetry growth detached from workload value;
- support sampling/retention decisions;
- preserve minimum diagnostic evidence.

State:

```text
Designed / not yet measured
```

## Allocation direction

Current Bicep already carries:

```text
workload = order-operations
owner = commerce-operations
environment = <dev|staging|prod>
managedBy = bicep
```

Direction after Chapter 20:

```text
businessUnit = commerce-operations
product = order-operations
```

`cost-center` is deliberately not invented in the book. It must be supplied by the simulated ESI Finance mapping or a real organization-specific mapping.

Shared-cost categories that need policy:

```text
landing zone
enterprise networking
identity
central security tooling
shared observability/platform capability
```

Possible handling:

```text
central budget
showback
proportional allocation
usage-based allocation
proxy metric
```

The choice must remain explicit.

## Non-production economics

Principle:

> **Use the cheapest environment that can produce the evidence required by the property under test.**

Direction:

```text
local
→ fast deterministic tests

integration
→ real PostgreSQL when PostgreSQL semantics matter

staging
→ Azure identity/network/RBAC/broker verification

production
→ full quality baseline
```

Not every non-production environment inherits production instance count, HA or telemetry retention by default.

## Optimization order

Prefer initially:

1. improve allocation/visibility;
2. remove unused/orphan resources;
3. reduce unnecessary non-production runtime;
4. tune telemetry sampling/retention within observability requirements;
5. right-size only with failure headroom evidence;
6. evaluate rate optimization when consumption is stable enough;
7. reduce legacy coexistence duration when migration evidence permits;
8. only then reopen architectural premiums that protect quality attributes.

## Guardrail for architecture-changing cost cuts

A proposed cost reduction must reopen the relevant artifact when it changes:

```text
security boundary
SLO / RTO / RPO
backup/recovery
observability evidence
ownership/isolation
migration rollback capability
```

Examples:

```text
Service Bus Premium → cheaper tier
=> reopen Threat Model + Security Control Matrix

2 App Service instances → 1
=> reopen Reliability Contract

trace retention ↓ below incident need
=> reopen Observability Contract
```

## Budget / forecast model

No simulated currency amount is treated as a real benchmark.

Future forecast schema:

```text
Baseline
Expected demand
Growth scenario
Peak/failure scenario
Migration overlap
Quality premiums
Shared allocation
Confidence
Review trigger
```

## AI cost direction

Future AI-native chapters will add resource meters such as:

```text
token
retrieval
model invocation
tool execution
```

But Order Operations should prefer outcome economics when possible:

```text
cost per accepted task
cost per verified change
cost per resolved case
```

Inference price alone does not include retries, human verification, rework or failure impact.

## Review cadence

Review when:

- architecture topology changes;
- a Premium/paid capability is introduced;
- SLO/RTO/RPO changes;
- telemetry policy changes;
- a new environment becomes permanent;
- legacy coexistence passes a planned milestone;
- unit cost trend materially diverges from business demand;
- a new AI workload becomes material.

## Sources

- [Microsoft Learn — Cost Optimization design principles](https://learn.microsoft.com/en-us/azure/well-architected/cost-optimization/principles)
- [Microsoft Learn — Architecture strategies for creating a cost model](https://learn.microsoft.com/en-us/azure/well-architected/cost-optimization/cost-model)
- [Microsoft Learn — Introduction to cost allocation](https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/cost-allocation-introduction)
- [FinOps Framework](https://www.finops.org/framework/)
- [FinOps Framework — Unit Economics](https://www.finops.org/framework/capabilities/unit-economics/)
- [FinOps — Architecting & Workload Placement](https://www.finops.org/framework/capabilities/architecting-workload-placement/)

> **Il Cost Model non dice quanto costa davvero Order Operations oggi: il capstone non possiede billing production. Dice quali dati dobbiamo ottenere per poter prendere una decisione economica senza fingere che il prezzo sia separato dall'architettura.**