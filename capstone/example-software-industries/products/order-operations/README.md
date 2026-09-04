# Order Operations

> **Prodotto simulato/composito di Example Software Industries S.p.A. (ESI).**

Order Operations è il capstone principale di *Software Architecture Today* e appartiene alla business unit **Commerce & Operations**.

I capitoli spiegano **perché** il progetto cambia. Questa directory conserva **lo stato corrente** delle decisioni, del codice e delle evidenze accumulate.

## Product goal

Ridurre il tempo necessario agli operatori per individuare, comprendere e gestire ordini che richiedono attenzione operativa.

Order Operations non sostituisce Orders, Payments o Shipping come authoritative source.

## Regola di evoluzione

> **Il progetto deve evolvere perché cambia il contesto, non perché il libro deve mostrare una tecnologia.**

## Evoluzione capitolo per capitolo

| Capitolo | Evoluzione principale |
|---|---|
| 1 | prima console interna per ordini problematici |
| 2 | problem framing, analisi funzionale condivisa e acceptance criteria |
| 3 | system context e dipendenze |
| 4 | ADR e lookup live prima del read model |
| 5 | responsibility/ownership boundary |
| 6 | quality attributes e fit before fashion |
| 7 | pattern soltanto quando una forza li giustifica |
| 8 | modular monolith invece di microservices prematuri |
| 9 | primi API Contract read-oriented |
| 10 | Data Ownership Map e prima migration PostgreSQL |
| 11 | Payment Escalation, transactional outbox e Failure Mode Map |
| 12 | Azure application landing zone e Cloud Deployment Map |
| 13 | Threat Model, Security Control Matrix e prima baseline Bicep |
| 14 | Reliability Contract, SLO/RTO/RPO e zone resilience direction |
| 15 | Observability Contract e telemetry port vendor-neutral |
| 16 | Testing Strategy e prima suite eseguibile |
| 17 | Operations Desk Classic, characterization e Legacy Understanding Map |
| 18 | PriorityPolicy seam, Branch by Abstraction, shadow comparison e Refactoring Safety Plan |
| 19 | Architecture Fitness Checklist e architecture fitness test eseguibile |
| 20 | Cost Model, unit economics, allocation direction e cost fitness test |
| 21 | `AGENTS.md`, Repository Map e context fitness per repository AI-ready |
| 22 | Issue-driven development, work-item template, OO-001 e issue-readiness fitness |
| 23 | Agent Delegation Contract, Verification Bundle, AI Autonomy Matrix e agent-governance fitness |

## Stato funzionale corrente

### Payment Escalation

```text
OperationalCase
→ Payment Escalation
→ local transaction
   ├── PaymentEscalation
   └── OutboxMessage
→ async delivery
→ Payments & Risk
```

Order Operations possiede l'intenzione di escalation; Payments & Risk mantiene ownership della semantica economica.

### Priority migration

Target semantics confermate nello scenario ESI:

```text
Closed                  → NotActionable
manualHold              → ManualReview
Payment failures >= 3   → Urgent
otherwise               → Standard
```

Il vecchio behavior:

```text
Enterprise + age >= 30m → URGENT
```

è stato rimosso tramite decisione funzionale esplicita e registrato come:

```text
ED-001 — ExpectedDifference
```

Coexistence direction:

```text
PriorityPolicy seam
├── LegacyPriorityAdapter
└── ConfirmedPriorityPolicy

BranchingPriorityPolicy
modes: legacy | shadow | candidate
```

Il production candidate cutover non è ancora autorizzato.

## Architecture Evolution — Capitolo 19

Entrano:

```text
docs/architecture-fitness-checklist.md
tests/architecture-fitness.test.mjs
```

Prime fitness function strutturali:

```text
AF-001 legacy isolation
AF-002 application dependency direction
AF-003 contract independence
AF-004 priority isolation
AF-005 vendor SDK boundary
```

Verification dedicata eseguita durante il Capitolo 19:

```text
AF-001…AF-005
→ 5 pass
→ 0 fail
```

Questa evidence verifica **soltanto** le dependency/import rule dichiarate.

## Costi e decisioni — Capitolo 20

Entra:

```text
docs/cost-model.md
tests/cost-fitness.test.mjs
```

Il Cost Model non contiene prezzi Azure inventati. Rende espliciti cost surface, architectural premium, cost driver, allocation direction, unit economics e review trigger.

Prime unit metric candidate:

```text
UM-01 cost per OperationalCase handled
UM-02 cost per Payment Escalation delivered
UM-03 observability cost per 1,000 critical journeys
```

Stato:

```text
Designed
not yet measured from production billing
```

Cost metadata guard esercitato localmente:

```text
CF-001…CF-002
→ 2 pass
→ 0 fail
```

## AI-ready repository — Capitolo 21

Entrano:

```text
AGENTS.md
docs/repository-map.md
tests/agent-context-fitness.test.mjs
```

La scelta è tool-neutral:

```text
short AGENTS.md
+ canonical Repository Map
+ existing decision documents
+ executable verification
+ explicit stop conditions
```

Context fitness esercitato localmente:

```text
CTX-001…CTX-004
→ 4 pass
→ 0 fail
```

## Issue-driven development — Capitolo 22

Il repository distingue ora il contesto persistente dal task context.

Entrano:

```text
work-items/TEMPLATE.md
work-items/OO-001-postgresql-escalation-outbox-atomicity.md
tests/issue-readiness-fitness.test.mjs
```

Regola:

```text
repository canonical context
→ ciò che resta vero fra i task

work item
→ ciò che deve diventare vero nel task corrente
```

Il primo work item nasce da un gap già presente nella Testing Strategy:

```text
TST-005
PaymentEscalation + Outbox atomicity
higher-fidelity PostgreSQL evidence pending
```

`OO-001` richiede un real PostgreSQL engine ma non prescrive il meccanismo del test environment.

Issue-readiness gate:

```text
ISSUE-001…ISSUE-004
→ 4 pass
→ 0 fail
```

Stato:

```text
OO-001 execution contract
= Codified

PostgreSQL integration execution
= Pending
```

## Manager di agenti — Capitolo 23

Il repository introduce ora un modello esplicito di delega, verifica e autonomia.

Entrano:

```text
docs/agent-delegation-contract.md
docs/agent-verification-bundle.md
docs/ai-autonomy-matrix.md
tests/agent-governance-fitness.test.mjs
```

Per il primo workflow delegato ESI sceglie deliberatamente una topologia semplice:

```text
Human Decision Owner
        ↓
Implementer Agent
        ↓
Deterministic evidence
        ↓
Independent Verifier role
        ↓
Human/repository merge gate
```

Nessun swarm generico viene introdotto.

### Delegation baseline

```text
Delegation ID
ADC-OO-001-v1

Work item
OO-001

Role
Implementer

Autonomy
A2 — bounded execution + bounded verification
```

L'Implementer può lavorare sul test/integration scope e avviare un PostgreSQL isolato.

Non può:

```text
merge main
use production credentials/resources
change Payments ownership
change functional semantics
rewrite migrations merely to pass
weaken verification oracle
increase its own autonomy
```

### Verification Bundle

Il bundle predefinisce i claim che dovranno essere dimostrati quando OO-001 verrà realmente eseguita:

```text
C-01 migration chain
C-02 success atomicity
C-03 rollback on second-write failure
C-04 fast-suite independence
C-05 evidence boundary
```

Current state:

```text
bundle structure
= Codified

primary evidence
= Pending

independent verifier result
= Pending

human acceptance
= Pending
```

### AI Autonomy Matrix

Autonomy è capability-based.

Boundary principali:

```text
read/search repo                    A3
edit scoped branch/worktree         A2
run isolated PostgreSQL for OO-001  A2
modify business/data ownership      A0
merge default branch                human/repository gate
production destructive DB mutation  A0
production secret/customer data     forbidden in coding workflow
```

Non esiste alcuna A4 production capability corrente.

### Agent governance fitness

Il nuovo gate controlla selezionate proprietà meccaniche:

```text
AGOV-001 governance artifacts exist
AGOV-002 delegation stays bounded to OO-001/A2
AGOV-003 verification bundle preserves claims/evidence/limitations
AGOV-004 high-impact actions remain behind human gates
AGOV-005 governance does not claim OO-001 was executed
```

Logica esercitata localmente su una ricostruzione degli artifact correnti:

```text
AGOV-001…AGOV-005
→ 5 pass
→ 0 fail
```

Questa evidence **non** dimostra:

```text
PostgreSQL atomicity
real agent execution reliability
real permission enforcement
human review quality
production autonomy
```

## Evidence già accumulata

```text
Chapter 18
Order Operations application/refactoring       19/19 previously PASS
Operations Desk Classic characterization        6/6 PASS

Chapter 19
Architecture fitness AF-001…AF-005             5/5 PASS

Chapter 20
Cost fitness CF-001…CF-002                     2/2 PASS

Chapter 21
Context fitness CTX-001…CTX-004                4/4 PASS

Chapter 22
Issue readiness ISSUE-001…ISSUE-004            4/4 PASS

Chapter 23
Agent governance AGOV-001…AGOV-005             5/5 locally exercised
```

Non dichiariamo una nuova esecuzione end-to-end dell'intera suite dopo ogni commit finché non viene realmente eseguita come tale.

## Evidence model

Per artefatti e capability:

```text
Designed
→ Codified
→ Verified
→ Monitored
```

Per conoscenza legacy:

```text
Found
→ Inferred
→ Observed
→ Confirmed
```

Current snapshot:

```text
TypeScript application/refactoring source        Codified + previously typechecked
Order Operations local suite                     previously Verified 19/19
Legacy priority characterization                 Verified 6/6
Architecture fitness AF-001…AF-005              Codified + Verified locally 5/5
Cost Model                                      Designed + documented
Cost fitness CF-001…CF-002                      Codified + locally exercised 2/2
AGENTS.md                                       Codified
Repository Map                                  Codified
Context fitness CTX-001…CTX-004                 Codified + locally exercised 4/4
Work-item template                              Codified
OO-001 execution contract                       Codified / execution Pending
Issue readiness ISSUE-001…ISSUE-004             Codified + locally Verified 4/4
Agent Delegation Contract                       Codified
Agent Verification Bundle                       Codified / primary evidence Pending
AI Autonomy Matrix                              Codified / runtime enforcement partial-pending
Agent governance AGOV-001…AGOV-005              Codified + locally exercised 5/5
PostgreSQL integration                          Designed / Pending via OO-001
Production billing / unit economics              Pending
Production priority shadow telemetry             Designed / Pending
Candidate production cutover                     Not authorized
Azure security/network verification              Designed / Pending
Recovery drills                                  Pending
Production observability evidence                Pending
A3/A4 production agent autonomy                 Not authorized
```

## Struttura corrente

```text
order-operations/
├── AGENTS.md
├── README.md
├── package.json
├── tsconfig.json
├── database/
│   ├── README.md
│   └── migrations/
├── docs/
│   ├── repository-map.md
│   ├── agent-delegation-contract.md
│   ├── agent-verification-bundle.md
│   ├── ai-autonomy-matrix.md
│   ├── functional-analysis.md
│   ├── priority-functional-analysis.md
│   ├── requirements.md
│   ├── architecture-context.md
│   ├── architecture-fitness-checklist.md
│   ├── cost-model.md
│   ├── nfr.md
│   ├── api-contract.md
│   ├── data-ownership.md
│   ├── failure-mode-map.md
│   ├── cloud-deployment.md
│   ├── threat-model.md
│   ├── security-control-matrix.md
│   ├── reliability-contract.md
│   ├── observability-contract.md
│   ├── testing-strategy.md
│   ├── legacy-understanding-map.md
│   ├── refactoring-safety-plan.md
│   ├── events/
│   └── adr/
├── infra/
├── src/
├── tests/
│   ├── agent-context-fitness.test.mjs
│   ├── agent-governance-fitness.test.mjs
│   ├── architecture-fitness.test.mjs
│   ├── cost-fitness.test.mjs
│   ├── issue-readiness-fitness.test.mjs
│   ├── payment-escalation.test.mjs
│   ├── outbox-publisher.test.mjs
│   └── priority-policy.test.mjs
└── work-items/
    ├── TEMPLATE.md
    └── OO-001-postgresql-escalation-outbox-atomicity.md
```

Legacy system separato:

```text
example-software-industries/
├── legacy/operations-desk-classic/
└── products/order-operations/
```

## Documenti da mantenere sincronizzati

Quando il prodotto cambia verifichiamo almeno:

- `AGENTS.md` e Repository Map quando cambia navigation/execution context;
- work item corrente quando cambia scope/outcome/evidence del task;
- Agent Delegation Contract quando cambia mandate/permission/retry/stop boundary;
- Agent Verification Bundle quando cambiano claim/evidence/acceptance expectations;
- AI Autonomy Matrix quando cambiano capability, blast radius o evidence maturity;
- Functional Analysis e Requirements;
- Architecture Context e ADR;
- Architecture Fitness Checklist;
- Cost Model;
- API/event contract;
- Data Ownership Map e migration;
- NFR;
- Failure Mode Map;
- Threat Model e Security Control Matrix;
- Reliability Contract;
- Observability Contract;
- Testing Strategy;
- Legacy Understanding Map;
- Refactoring Safety Plan;
- IaC, deployment/rollback e runbook.

## Regole correnti di evoluzione

> **Il repository contiene ciò che resta vero fra i task. La issue contiene ciò che deve diventare vero nel task corrente.**

> **Una issue execution-ready elimina le scelte che l'executor non è autorizzato a inventare.**

> **Il Delegation Contract dice che cosa puoi fare. Il Verification Bundle dice che cosa hai dimostrato. L'Autonomy Matrix dice fino a dove puoi procedere.**

> **L'autonomia non è una ricompensa all'agente. È una decisione di rischio dell'organizzazione.**

## Obiettivo finale

Alla fine del libro il lettore deve poter confrontare la prima iterazione con il sistema finale e capire non soltanto **che cosa** è cambiato, ma **quale nuova informazione, trade-off o evidence ha reso necessario ogni cambiamento**.