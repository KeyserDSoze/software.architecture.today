# ESI — Reliability Architecture di Order Operations

A questo punto possiamo trasformare i principi del capitolo in una decisione completa.

Non partiamo dalle feature Azure.

Partiamo dal critical flow.

## Critical flow 1 — Investigation

```text
Operations Operator
→ Entra authentication
→ Order Operations
→ local OperationalCase state
→ live authoritative dependencies
→ operational view
```

### Business intent

L'operatore deve poter capire rapidamente che cosa richiede attenzione e quale dominio possiede il dato autorevole.

### Failure tolerance

Il flow può degradare quando una dependency live non è disponibile, purché:

- non mostri dati stale come se fossero correnti;
- distingua ciò che è locale da ciò che non è verificabile;
- blocchi azioni che richiedono informazioni autorevoli mancanti.

## Critical flow 2 — Payment Escalation acceptance

```text
Operator
→ POST escalation
→ authorization
→ PostgreSQL transaction
   ├── PaymentEscalation
   └── OutboxMessage
→ 202 Accepted
```

### Business intent

Una richiesta valida deve avere outcome locale deterministico.

### Quality floor

```text
committed escalation
↔
committed publication intent
```

Nessun partial commit.

## Critical flow 3 — Payment Escalation delivery

```text
Outbox
→ Publisher
→ Service Bus
→ Payments & Risk
```

### Business intent

La delivery può essere asincrona, ma non invisibilmente infinita.

### Quality floor

- stable message identity;
- bounded retry;
- idempotent consumer;
- DLQ ownership;
- business delay visibility;
- reconciliation.

## SLO iniziali

Come definito nella sezione precedente, ESI introduce come **target simulati iniziali**:

### Core operator journey

```text
SLO = 99.9% good events
window = rolling 28 days
```

Il good-event model verrà raffinato nel Capitolo 15 con telemetry e synthetic journey.

### Payment Escalation delivery

```text
99% delle escalation accepted
→ published to broker within 5 minutes
```

Il downstream business processing di Payments avrà propri target, non viene inglobato arbitrariamente nello SLO di Order Operations.

## RTO/RPO

### Intra-region

```text
RTO core journey <= 15 min
RPO = 0 per committed local OperationalCase / PaymentEscalation state
```

### Region-wide disaster

```text
RTO <= 8 h
RPO <= 1 h
```

Questi target sono requisiti simulati ESI.

Non sono benchmark consigliati.

## Health model

### Healthy

```text
Investigation meets SLO
AND escalation acceptance meets SLO
AND delivery backlog inside normal envelope
```

### Degraded

Esempi:

```text
una authoritative read dependency unavailable
ma local case investigation ancora utilizzabile
```

oppure:

```text
Service Bus / Payments consumer degraded
ma escalation acceptance locale funzionante
```

### Unhealthy

Esempi:

```text
operator cannot authenticate/use core journey
```

oppure:

```text
PostgreSQL unavailable oltre tolerated failover window
```

oppure:

```text
accepted escalation cannot be durably represented
```

## Decisione infrastrutturale — production

### App Service

```text
Premium v3
capacity >= 2
zoneRedundant = true
```

### PostgreSQL

```text
Azure Database for PostgreSQL Flexible Server
zone-redundant HA
backup / PITR
private access
```

### Service Bus

```text
Premium
private endpoint
zone redundancy provided by service in supported region
```

### Region

```text
single region
```

Nessun active-active cross-region nella prima fase.

## Perché non multi-region

**Esigenza:** ridurre outage da instance/zone failure e avere recovery documentato.

**Tensione:** higher availability vs cost, operational complexity, replication semantics e test burden.

**Decisione:** spendere prima su resilience intra-region e recovery evidence.

**Costo accettato:** un region outage può richiedere recovery manuale e alcune ore.

**Quality floor:** RTO/RPO regionale espliciti, backup, IaC, recovery source, owner e restore drill.

**Guardrail:** Reliability Contract, Failure Mode Map, Cloud Deployment Map, restore exercise, SLO review ed error budget.

**Trigger:** RTO/RPO regionali più severi, contractual commitment, geographic expansion, regulatory requirement o recovery exercise che dimostri che la strategia corrente non è sufficiente.

## Compromesso App Service

Zone redundancy richiede almeno due istanze e un piano compatibile.

Paghiamo quindi più capacity anche durante periodi tranquilli.

In cambio compriamo:

```text
failure domain più piccolo
+ instance redundancy
+ zone resilience
```

Non compriamo automaticamente:

```text
region resilience
```

## Compromesso PostgreSQL

Zone-redundant HA aumenta il costo database.

È giustificato perché il database possiede lo stato locale necessario a:

- operator workflow;
- escalation acceptance;
- transactional outbox.

La standby non sostituisce backup/PITR.

## Failure matrix aggiornata

| Failure | Product state | Automatic behavior | Manual/recovery behavior |
|---|---|---|---|
| App instance failure | healthy/degraded breve | routing su altra istanza | investigate if SLO burn |
| App zone failure | expected resilient | zone-redundant instances | capacity observation |
| PostgreSQL primary failure | degraded breve | managed failover | verify RTO/state |
| PostgreSQL logical corruption | unhealthy | no automatic magic | PITR/restore procedure |
| Service Bus transient outage | delivery degraded | outbox retry | reconcile if prolonged |
| Payments consumer down | delivery degraded | broker buffers | Payments recovery / DLQ |
| Entra outage | user flow degraded/unhealthy | valid-token behavior depends on session | identity incident coordination |
| Private DNS failure | likely unhealthy/degraded | none guaranteed | config rollback/Platform response |
| bad application deploy | potentially unhealthy | depends deployment strategy | rollback known-good artifact |
| region outage | unhealthy | no cross-region active service | regional recovery runbook |

## Recovery ownership

### Workload team

- application rollback;
- outbox recovery;
- reconciliation;
- critical-flow validation;
- SLO evidence;
- restore validation;
- runbook upkeep.

### Platform Engineering

- landing-zone network recovery;
- platform DNS capability;
- privileged cloud recovery path;
- Azure policy/baseline;
- shared monitoring foundation.

### Payments & Risk

- consumer recovery;
- downstream dedup;
- payment workflow state;
- DLQ business resolution where applicable.

### Security

- security incident boundary;
- privileged identity recovery;
- break-glass governance.

### Finance / FinOps

Non esegue recovery, ma deve conoscere il costo delle reliability decision che proteggono business target.

## Reliability Contract

Il capstone introduce un nuovo artefatto persistente:

```text
docs/reliability-contract.md
```

Contiene:

```text
critical flows
SLI/SLO
error budget direction
health states
degraded modes
RTO/RPO
failure ownership
recovery source
drill backlog
review triggers
```

## Update del Failure Mode Map

La Failure Mode Map non sarà più limitata al messaging flow.

Aggiungeremo anche:

- App instance/zone failure;
- PostgreSQL failover;
- logical corruption;
- identity failure;
- private DNS failure;
- bad deployment;
- region failure.

Questo mostra un punto importante:

> **Un failure model cresce insieme alla topologia.**

## IaC

Il Capitolo 13 ha introdotto il primo `main.bicep`.

Il Capitolo 14 gli aggiunge almeno la parte di reliability che possiamo codificare in modo coerente con le decisioni prese:

```text
App Service capacity >= 2
zoneRedundant = true
```

La configurazione PostgreSQL HA dovrà essere codificata insieme al modulo PostgreSQL quando il resource design verrà completato e verificato.

Non dichiareremo `Verified` finché il template non sarà realmente buildato/deployato e sottoposto a failure test.

## Real case connection

I casi GitHub e Cloudflare citati nel capitolo mostrano più volte gli stessi temi:

```text
shared failure point
capacity saturation
configuration propagation
hidden dependency
recovery complexity
```

ESI non copia le loro architetture.

Usa i casi per verificare che le categorie di failure considerate non siano invenzioni narrative.

## AI come reliability reviewer

Prima di chiudere una change significativa possiamo chiedere a uno o più agenti:

```text
quale failure domain stiamo aggiungendo?
quale retry amplification è possibile?
quale dependency è ora critical?
quale degraded mode manca?
quale recovery source stiamo assumendo?
quale SLO può peggiorare?
quale restore non abbiamo mai provato?
```

Il risultato deve essere una hypothesis list, non una certificazione.

## Decisione finale del capitolo

ESI non compra la massima reliability disponibile.

Compra un livello di resilienza coerente con:

- criticality attuale;
- target di business;
- costo accettabile;
- capacità operativa del team;
- failure mode già conosciuti.

E lascia trigger per evolvere.

> **La reliability migliore non è quella con più ridondanza. È quella che mantiene il contratto giusto contro i failure che abbiamo deciso di governare.**