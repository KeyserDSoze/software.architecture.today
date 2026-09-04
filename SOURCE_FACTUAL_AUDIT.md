# Source & Factual Audit

Questo file traccia due revisioni distinte:

1. **Evidence pass** — claim fattuali, proprietà tecnologiche, standard, casi reali e raccomandazioni vengono confrontati con fonti appropriate.
2. **ESI compromise pass** — il capitolo rende leggibile almeno un compromesso con esigenza, tensione, decisione, costo, quality floor, guardrail ed eventuali trigger.

Scenario fittizio ufficiale:

> **Example Software Industries S.p.A. — ESI**

Capstone principale:

> **Order Operations** — Commerce & Operations.

Brownfield simulato introdotto dal Capitolo 17:

> **Operations Desk Classic**.

I casi reali rimangono separati da ESI.

## Stato corrente

| Capitolo | Draft | Evidence pass | ESI compromise pass | Nota |
|---|---:|---:|---:|---|
| 0 — Al timone | sì | da fare | sì — draft | agent autonomy vs accountability |
| 1 — Il software è cambiato | sì | da fare | sì — draft | velocity vs understanding |
| 2 — Prima del codice | sì | parziale | sì — draft | functional analysis condivisa |
| 3 — Pensare per sistemi | sì | da fare | sì — draft | completezza/freshness vs simplicity |
| 4 — Software Architecture | sì | da fare | sì — draft | live lookup vs async read model |
| 5 — Dalle feature ai confini | sì | da fare | sì — draft | shared infra vs ownership |
| 6 — Qualità prima della tecnologia | sì | parziale | sì — draft | fit before fashion |
| 7 — Pattern senza religione | sì | da fare | sì — draft | robustness vs complexity debt |
| 8 — Il monolite non è il nemico | sì | da fare | sì — draft | isolation vs distribution cost |
| 9 — API e contratti | sì | sì — draft | sì — draft | source-first, compatibility/idempotency |
| 10 — I dati sono architettura | sì | sì — draft | sì — draft | Microsoft/PostgreSQL/Redis/Stripe/GitHub |
| 11 — Sistemi distribuiti | sì | sì — draft | sì — draft | Microsoft/AWS/Uber; outbox/idempotency/failure |
| 12 — Cloud Architecture | sì | sì — draft | sì — draft | Microsoft/AWS/dacadoo; cloud-appropriate |
| 13 — Security by Design | sì | sì — draft | sì — draft | Microsoft/NIST/OWASP/Cloudflare |
| 14 — Reliability | sì | sì — draft | sì — draft | Google SRE/Microsoft/GitHub/Cloudflare |
| 15 — Observability | sì | sì — draft | sì — draft | OpenTelemetry/Google SRE/Microsoft |
| 16 — Testing Architecture | sì | sì — draft | sì — draft | Microsoft/Google/Meta/OWASP/Pact |
| 17 — Legacy e comprensione | sì | sì — draft | sì — draft | Microsoft/AWS/GitHub; characterization/evidence provenance |
| 18 — Refactoring nell'era dell'AI | sì | sì — draft | sì — draft | AWS/Microsoft/GitHub/OpenRewrite; safe migration and Refactoring Safety Plan |
| 19 — Architecture Evolution | sì | sì — draft | sì — draft | Thoughtworks/AWS/Microsoft/GitHub; fitness functions, architecture drift, exceptions, Architecture Fitness Checklist |
| 20 — Costi e decisioni | sì | sì — draft | sì — draft | Microsoft/FinOps Foundation/Uber; TCO, unit economics, quality premiums, allocation, Cost Model |
| 21 — AI-ready repository | sì | sì — draft | sì — draft | GitHub/OpenAI; AGENTS.md, repository context, verification commands, context fitness |
| 22 — Issue-driven development | sì | sì — draft | sì — draft | GitHub/OpenAI; well-scoped issues, acceptance/verification, Issue Forms, atomic tasks, work-item readiness |
| 23+ | non ancora | source-first | required | research + ESI compromise + capstone update before closure |

## Evidence vocabulary

Per artefatti/capability:

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

Le due scale sono indipendenti.

Esempio:

```text
characterization test = Codified + Verified
legacy behavior = Observed
business requirement = Confirmed only after explicit functional decision
```

## Verification status — infrastructure

`infra/main.bicep` è una baseline codificata.

Ancora pending:

```text
bicep build/lint
Azure Policy validation
non-production deployment
private connectivity
Entra authentication
RBAC negative test
zone/failover test
PostgreSQL HA IaC completion
PostgreSQL PITR drill
```

Nessun capitolo descrive questi gate come già superati.

## Verification status — observability

```text
Observability Contract                       Designed
bounded telemetry port/decorator             Codified + typechecked
OpenTelemetry/Application Insights adapter   Pending
SLI queries/alerts/dashboard                 Designed / Pending
private synthetic journey                    Designed / Pending
runtime telemetry evidence                   Not available
```

## Verification status — testing before refactoring

Capitolo 16:

```text
tsc -p tsconfig.json
→ PASS

Order Operations node:test
→ 11/11 PASS
```

Capitolo 17:

```text
Operations Desk Classic characterization
→ 6/6 PASS
```

Questi gate coprono soltanto il layer locale che attraversano.

## Verification status — Capitolo 18

Nuovi artefatti:

```text
products/order-operations/docs/priority-functional-analysis.md
products/order-operations/docs/refactoring-safety-plan.md
products/order-operations/src/priority/priority-policy.ts
products/order-operations/src/priority/confirmed-priority-policy.ts
products/order-operations/src/priority/legacy-priority-adapter.ts
products/order-operations/src/priority/branching-priority-policy.ts
products/order-operations/tests/priority-policy.test.mjs
```

Functional decision simulata ESI:

```text
Preserve:
Closed → NotActionable
manualHold → ManualReview
Payment failedAttempts >= 3 → Urgent
otherwise → Standard

Intentional removal:
legacy Enterprise + age >=30m → URGENT
→ ED-001 ExpectedDifference
```

La decisione è stata inserita anche nel `functional-analysis.md` principale, quindi non resta una deduzione del codice.

### Local verification performed

```text
tsc -p tsconfig.json
→ PASS

Order Operations node:test suite
→ 19 tests
→ 19 pass
→ 0 fail

Operations Desk Classic characterization
→ 6 tests
→ 6 pass
→ 0 fail
```

Questa evidence supporta PriorityPolicy seam, adapter, target policy e shadow classification soltanto al layer locale.

Non supporta ancora production shadow telemetry, candidate production cutover, PostgreSQL integration, Azure identity/network, performance/capacity o recovery.

## Verification status — Capitolo 19

Nuovi artefatti:

```text
docs/architecture-fitness-checklist.md
tests/architecture-fitness.test.mjs
```

Fitness rule iniziali:

```text
AF-001 legacy isolation
AF-002 application dependency direction
AF-003 contract independence
AF-004 priority isolation
AF-005 Azure SDK boundary in semantic core
```

Gate dedicato eseguito sul current import graph ricostruito dai source correnti:

```text
node --test tests/architecture-fitness.test.mjs
→ 5 tests
→ 5 pass
→ 0 fail
```

Questa evidence verifica solo dependency/import structure.

Non supporta runtime topology, Azure Policy, data ownership runtime, recovery o production observability.

## Verification status — Capitolo 20

Nuovi artefatti:

```text
docs/cost-model.md
tests/cost-fitness.test.mjs
```

Il Cost Model contiene:

```text
cost surface
architectural premiums
cost drivers
fixed / variable / step / transition cost
unit metric definitions
allocation direction
optimization order
review triggers
```

Non contiene prezzi Azure inventati.

Unit metric candidate:

```text
UM-01 cost per OperationalCase handled
UM-02 cost per Payment Escalation delivered
UM-03 observability cost per 1,000 critical journeys
```

Stato corretto:

```text
Cost Model structure        Designed + documented
production billing data     Pending
unit metrics measured       Pending
forecast                    Pending
real cost allocation        Pending provider/billing evidence
```

Il Bicep corrente contiene già metadata:

```text
workload = order-operations
owner = commerce-operations
environment = environmentName
```

Un cost-fitness test è stato aggiunto per proteggerli e per impedire al libro di hardcodare un `cost-center` inventato.

La logica del nuovo test è stata esercitata localmente sulla stanza di metadata corrente ricostruita da `infra/main.bicep`:

```text
CF-001 allocation metadata
CF-002 no fabricated hard-coded cost-center
→ 2 tests
→ 2 pass
→ 0 fail
```

Questa evidence **non** equivale a una nuova esecuzione end-to-end della suite, né verifica Cost Management/Azure billing.

## Verification status — Capitolo 21

Nuovi artefatti:

```text
products/order-operations/AGENTS.md
products/order-operations/docs/repository-map.md
products/order-operations/tests/agent-context-fitness.test.mjs
```

Il context layer è volutamente tool-neutral:

```text
AGENTS.md
→ routing operativo

Repository Map
→ navigation context

canonical docs
→ decision/semantic context

executable tests
→ evidence
```

Gate meccanico esercitato localmente:

```text
CTX-001 agent entry point + Repository Map
CTX-002 canonical document existence
CTX-003 golden package scripts
CTX-004 routing + evidence vocabulary
→ 4 tests
→ 4 pass
→ 0 fail
```

Questa evidence **non** dimostra che una instruction sia semanticamente corretta, sufficiente per ogni task o immune da staleness.

Stato corretto:

```text
AGENTS.md                    Codified
Repository Map               Codified
mechanical context fitness   Codified + locally exercised
production agent permission  Future / Pending
agent autonomy model         Future / Pending
```

## Verification status — Capitolo 22

Nuovi artefatti:

```text
products/order-operations/work-items/TEMPLATE.md
products/order-operations/work-items/OO-001-postgresql-escalation-outbox-atomicity.md
products/order-operations/tests/issue-readiness-fitness.test.mjs
```

Il primo work item deriva da un gap già presente nella Testing Strategy:

```text
TST-005
PaymentEscalation + Outbox atomicity
higher-fidelity PostgreSQL evidence = Pending
```

`OO-001` rende espliciti:

```text
Problem
Outcome
Current evidence
Scope
Out of scope
Canonical context
Acceptance criteria
Verification
Constraints
Stop conditions
Dependencies
Closure evidence
```

Il task richiede un **real PostgreSQL engine**, ma non prescrive il particolare harness. Testcontainers, Docker Compose, devcontainer o altro restano implementation choice da giustificare rispetto a riproducibilità, CI fit e costo.

Issue-readiness gate eseguito localmente sulla versione corrente dei work item:

```text
ISSUE-001 template + OO-001 exist
ISSUE-002 minimum execution contract sections
ISSUE-003 canonical context references
ISSUE-004 verification-oracle/evidence boundary
→ 4 tests
→ 4 pass
→ 0 fail
```

Questa evidence verifica soltanto proprietà **meccaniche** del work-item contract.

Non supporta ancora:

```text
PostgreSQL migration chain execution
PaymentEscalation + Outbox real transaction atomicity
rollback on second-write failure
CI integration harness
Azure Database for PostgreSQL behavior
```

Quindi:

```text
OO-001 execution contract    Codified
issue readiness mechanics    Codified + locally Verified
OO-001 execution             Not started / Pending
TST-005 PostgreSQL evidence  Pending
```

## Source pass — Capitoli 19–22

### Capitolo 19

Principali fonti:

- Thoughtworks — Building Evolutionary Architectures / fitness functions;
- AWS Architecture Blog — cloud fitness functions;
- Microsoft Azure Well-Architected — continuous workload review;
- GitHub Engineering — SERVICEOWNERS.

### Capitolo 20

Principali fonti:

- Microsoft Azure Well-Architected — Cost Optimization design principles, cost model e tradeoff;
- Microsoft Cost Management — allocation;
- FinOps Foundation — Framework, Unit Economics, Allocation, Architecting & Workload Placement;
- Uber Engineering — vertical CPU scaling, Big Data supply/demand, partial replication, artifact storage modernization.

### Capitolo 21

Principali fonti:

- GitHub Docs — repository/custom instructions, `AGENTS.md`, build/test/validation context;
- GitHub Docs — support matrix for custom instructions;
- OpenAI — *How OpenAI uses Codex*;
- OpenAI — Codex / `AGENTS.md` operational behavior.

Uso:

- proprietà degli agent instruction mechanism → claim fattuali vicini alle fonti;
- ESI `AGENTS.md`/Repository Map design → scenario simulato e decisione editoriale, non standard universale.

### Capitolo 22

Principali fonti:

- GitHub Docs — best practice per coding-agent task: problem, acceptance criteria, file hints;
- GitHub Docs — Issue Forms / structured required fields;
- GitHub Docs/Blog — assigning issues to coding agents;
- GitHub Blog — WRAP: effective issues, refined instructions, atomic tasks, pairing;
- OpenAI — *How OpenAI uses Codex*: task ben circoscritti e prompt strutturati come GitHub Issue.

Uso:

- GitHub/OpenAI → evidence che i coding-agent workflow contemporanei traggono beneficio da task strutturati e ben circoscritti;
- ESI work-item schema → metodo del libro, non claim che esista un unico template corretto;
- OO-001 → scenario simulato derivato da un rischio già documentato nel capstone.

## Important distinctions

### Legacy / target

```text
Observed legacy behavior
≠
Confirmed target requirement
```

### Cost

```text
resource price
≠
Total Cost of Ownership
```

```text
cost per token
≠
cost per useful outcome
```

```text
lower monthly spend
≠
better architecture
```

quando il taglio modifica una proprietà necessaria.

### Repository context / task context

```text
repository canonical context
≠
current task specification
```

```text
instruction
≠
permission boundary
```

### Issue readiness / execution evidence

```text
issue is well-structured
≠
issue outcome is already Verified
```

```text
acceptance criterion
≠
verification command
```

```text
agent can perform a change
≠
agent is authorized to make the decision behind the change
```

## Numeri simulati ESI

SLO/RTO/RPO del Capitolo 14 restano business requirement simulati:

```text
Core journey SLO: 99.9% / rolling 28 days
Escalation publication: 99% <= 5 min
Intra-region RTO: <= 15 min
Intra-region RPO: 0 committed local state
Region disaster RTO: <= 8 h
Region disaster RPO: <= 1 h
```

La soglia priority:

```text
Payment failedAttempts >= 3 → Urgent
```

è anch'essa una policy simulata ESI.

Il Capitolo 20 **non aggiunge prezzi, percentuali di saving o benchmark ESI simulati presentati come reali**.

Il Capitolo 22 non presenta `OO-001` come una issue realmente eseguita su PostgreSQL: è un execution contract codificato, mentre l'evidence PostgreSQL resta Pending.

## Workflow editoriale corrente

```text
outline
→ ESI tension / compromise framing
→ source discovery
→ draft
→ capstone update
→ executable verification where possible
→ claim audit
→ compromise audit
→ adversarial review
→ final editorial pass
```

Per brownfield/refactoring aggiungiamo:

```text
claim provenance
→ behavior classification
→ safety plan
→ intentional difference registry
→ stop condition / rollback review
```

Per cost model aggiungiamo:

```text
cost driver
→ property purchased
→ unit metric
→ quality metric
→ owner
→ review trigger
```

Per AI-ready repository / issue-driven execution aggiungiamo:

```text
persistent context
→ task-specific work item
→ scope/out-of-scope
→ acceptance property
→ verification mechanism
→ stop condition
→ closure evidence
```

## Evidence pass rules

Richiedono particolare attenzione e fonte:

- proprietà di tecnologie/protocolli;
- best practice presentate come tali;
- standard;
- limiti di prodotti;
- incidenti/casi aziendali;
- benchmark/numeri reali;
- pricing e caratteristiche commerciali variabili;
- affermazioni storiche;
- raccomandazioni che dipendono da evidence esterna;
- capability e behavior specifici dei coding agent/tool contemporanei.

Non ogni frase editoriale richiede citation, ma non usiamo un vendor workflow come prova universale.

## ESI compromise pass

Un capitolo supera il pass quando rende leggibili:

1. esigenza;
2. tensione;
3. decisione;
4. costo accettato;
5. quality floor;
6. guardrail;
7. evidence;
8. trigger di revisione.

## Release-candidate gates futuri

Prima di una release candidata del libro:

- nessun capitolo deve restare `da fare` nell'evidence pass;
- casi reali e ESI devono restare distinguibili;
- numeri ESI non devono essere presentati come benchmark;
- pricing volatile va verificato vicino alla release se compare nel testo;
- artefatti `Codified` non vanno descritti come `Verified` senza execution evidence;
- `Monitored` richiede runtime signal reale;
- temporary migration architecture deve avere cleanup condition;
- legacy behavior `Observed` non deve trasformarsi silenziosamente in requirement `Confirmed`;
- Cost Model e unit economics non devono essere descritti come misurati finché non esistono billing/usage data reali;
- un work item strutturalmente ready non deve essere descritto come outcome Verified finché la verification del task non è realmente eseguita;
- repository/agent instructions devono essere ricontrollate per staleness e non devono duplicare silenziosamente le source of truth canonical.
