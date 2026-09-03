# Order Operations — Reliability Contract

> **Scenario fittizio ESI.** Questo documento descrive i reliability target introdotti nel Capitolo 14. I numeri sono requisiti simulati del capstone, non benchmark o raccomandazioni universali.

## Purpose

Rendere esplicito che cosa significa per Order Operations essere:

```text
Healthy
Degraded
Unhealthy
```

collegando critical flow, SLI/SLO, failure mode, recovery target, ownership ed evidence.

## Critical flows

### CF-01 — Investigation

```text
Operations Operator
→ authentication / authorization
→ list problematic orders
→ open operational view
→ inspect authoritative/local state
```

Business outcome:

> l'operatore riesce a capire quale caso richiede attenzione e quale dominio possiede il dato autorevole.

### CF-02 — Payment Escalation acceptance

```text
Operator
→ POST escalation
→ authorization
→ PostgreSQL local transaction
   ├── PaymentEscalation
   └── OutboxMessage
→ 202 Accepted
```

Business outcome:

> una escalation valida ha un outcome locale deterministico e durable.

### CF-03 — Payment Escalation delivery

```text
Outbox
→ Publisher
→ Azure Service Bus Queue
→ Payments & Risk consumer
```

Business outcome:

> una escalation accettata viene consegnata al dominio responsabile entro un tempo governato e il ritardo non resta invisibile.

## Service Level Indicators

### SLI-01 — Core journey good-event ratio

Candidate definition:

```text
good core journey events / valid core journey events
```

Un evento è `good` quando:

- authentication/authorization funziona per un operatore valido;
- la capability richiesta produce outcome semanticamente valido;
- non si verifica un errore server non previsto;
- la latency resta entro il threshold del flow;
- il sistema non presenta dati noti come non affidabili senza segnalarlo.

La formula tecnica esatta verrà definita nel Capitolo 15 con l'Observability Contract.

### SLI-02 — Durable escalation acceptance

```text
valid escalation requests with deterministic durable outcome
/
valid escalation requests
```

Outcome valido:

```text
PaymentEscalation + Outbox committed atomically
```

oppure rifiuto esplicito prima del commit.

### SLI-03 — Escalation publication latency

```text
accepted escalations published to broker within target
/
accepted escalations
```

Misurazione candidate:

```text
broker publish timestamp - escalation accepted timestamp
```

## Service Level Objectives

### SLO-01 — Core operator journey

```text
99.9% good events
window: rolling 28 days
```

### SLO-02 — Durable acceptance

Quality floor:

```text
no silent partial commit
```

La misura quantitativa verrà raffinata dopo production-like testing, ma la semantica di atomicità non è negoziabile.

### SLO-03 — Payment Escalation publication

```text
99% delle escalation accepted
published to broker within 5 minutes
```

Il target è simulato ESI e deve essere validato con workload measurement.

## Error budget direction

Per `SLO-01`:

```text
SLO 99.9%
→ error budget 0.1%
```

Policy iniziale:

- burn normale → release velocity normale;
- burn accelerato → reliability review e riduzione del change risk;
- budget esaurito → priorità a reliability work e fix che riducono il failure mode dominante, salvo security/emergency change.

La policy operativa definitiva verrà concordata con Product, workload team e Platform/SRE quando il capstone avrà measurement reale.

## Health model

### Healthy

- CF-01 dentro SLO;
- CF-02 disponibile e deterministicamente durable;
- CF-03 backlog/age dentro envelope normale;
- nessun known reliability control gap che viola quality floor.

### Degraded

Esempi:

- una dependency live di investigation non disponibile, ma il case locale resta leggibile;
- Service Bus o Payments consumer degradato, mentre escalation acceptance locale continua;
- telemetry parziale ma critical flow ancora funzionante;
- performance sotto target ma non oltre soglia Unhealthy.

Il degraded state deve essere visibile e non deve presentare dati stale come current truth senza label.

### Unhealthy

Esempi:

- operatori non possono usare il core journey;
- PostgreSQL local state non è disponibile oltre il tolerated recovery window;
- una escalation valida non può avere outcome durable deterministico;
- accepted escalation delivery è fuori dal business delay envelope senza recovery path funzionante.

## Degraded modes

### DM-01 — Authoritative read dependency unavailable

Consentito:

- mostrare local OperationalCase state;
- indicare che la source autorevole non è disponibile;
- mantenere provenance e freshness esplicite.

Non consentito:

- presentare dato stale come current truth;
- eseguire una azione che richiede uno stato autorevole non verificabile.

### DM-02 — Payments delivery path degraded

Consentito:

- accettare Payment Escalation localmente se PostgreSQL è healthy;
- lasciare delivery state `Pending`/`Delayed`;
- accumulare backlog entro envelope governato.

Obbligatorio:

- backlog/oldest age osservabili;
- alert/reconciliation quando il business threshold è a rischio.

## Reliability topology — production direction

### App Service

```text
Premium v3
capacity >= 2
zone redundancy enabled
```

### PostgreSQL

```text
Azure Database for PostgreSQL Flexible Server
zone-redundant HA
backup / PITR
private access
```

La topologia PostgreSQL è `Designed`; il modulo IaC completo resta da codificare e verificare.

### Service Bus

```text
Premium
private access
regional zone resilience
```

Cross-region replication non è richiesta nella fase corrente.

## RTO / RPO

### Intra-region ordinary failure

```text
RTO core journey <= 15 minutes
RPO = 0 for committed local OperationalCase / PaymentEscalation state
```

### Region-wide disaster

```text
RTO <= 8 hours
RPO <= 1 hour
```

I target sono simulati ESI e sono review trigger per la topologia multi-region.

## Recovery sources

| Capability/state | Recovery source |
|---|---|
| OperationalCase | PostgreSQL authoritative local state / backup |
| PaymentEscalation | PostgreSQL authoritative local state / backup |
| publication intent | `outbox_message` |
| broker delivery | outbox republish + stable `messageId` |
| Payments workflow | Payments & Risk authoritative state |
| application | trusted build artifact |
| infrastructure | repository IaC + landing-zone baseline |
| secret material | Key Vault / external provider recovery process |

## Failure ownership

### Workload team

- application rollback;
- outbox recovery;
- reconciliation;
- SLO evidence;
- critical journey validation;
- restore validation.

### Platform Engineering

- landing-zone network/DNS capability;
- shared Azure governance;
- privileged recovery path;
- platform observability foundation.

### Payments & Risk

- consumer recovery;
- downstream idempotency;
- payment workflow state;
- business resolution of delivery failure.

### Security

- privileged identity/break-glass governance;
- security incident containment.

## Required drills

### RD-01 — Payments consumer unavailable

Expected:

```text
CF-01 Healthy
CF-02 Healthy
CF-03 Degraded
```

### RD-02 — App instance loss

Expected:

- core journey remains within SLO;
- no outbox loss;
- capacity remains acceptable.

### RD-03 — PostgreSQL failover

Expected:

- transient impact bounded;
- committed state preserved;
- recovery inside intra-region RTO.

### RD-04 — PostgreSQL logical recovery

Expected:

- PITR to recovery target;
- data validation;
- measured actual RTO/RPO;
- documented cutover/reconciliation steps.

### RD-05 — Private DNS failure

Expected:

- synthetic critical journey detects impact;
- resource health alone is not considered sufficient;
- Platform/workload runbook identifies network/DNS failure path.

## Reliability evidence levels

```text
Designed
→ target/control documented

Codified
→ represented in code/IaC/config

Verified
→ failure/recovery test produced evidence

Monitored
→ drift/SLO/failure visible in running environment
```

No target or control is promoted automatically because it appears in this document.

## Current evidence status

| Item | Status |
|---|---|
| SLO definitions | Designed |
| Health model | Designed |
| App Service capacity >= 2 / zone redundancy | Codified after Chapter 14 IaC update |
| PostgreSQL zone-redundant HA | Designed — IaC pending |
| PostgreSQL restore drill | Designed — execution pending |
| Service Bus backlog / DLQ signals | Designed — Observability Contract pending |
| synthetic critical journey | Designed — implementation pending |
| regional recovery runbook | Designed — implementation/exercise pending |

## Review triggers

Revisit this contract when changes affect:

- business criticality;
- support window;
- contractual SLA;
- operator geography;
- traffic/capacity;
- dependency graph;
- App/worker scaling profile;
- RTO/RPO;
- error budget burn;
- recovery drill result;
- cloud service tier;
- regional strategy;
- cost curve.

## Sources

- [Google SRE — Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)
- [Google SRE — Embracing Risk](https://sre.google/sre-book/embracing-risk/)
- [Microsoft Learn — Health modeling for workloads](https://learn.microsoft.com/azure/well-architected/design-guides/health-modeling)
- [Microsoft Learn — Reliability in Azure App Service](https://learn.microsoft.com/azure/reliability/reliability-app-service)
- [Microsoft Learn — PostgreSQL High Availability](https://learn.microsoft.com/azure/postgresql/high-availability/concepts-high-availability)
- [Microsoft Learn — Reliability in Azure Service Bus](https://learn.microsoft.com/azure/reliability/reliability-service-bus)

Le fonti sostengono concetti e capability. I target ESI restano decisioni simulate.