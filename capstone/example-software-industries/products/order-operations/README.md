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

Verification dedicata eseguita durante il Capitolo 19 sul current import graph ricostruito dai source correnti:

```text
node --test tests/architecture-fitness.test.mjs
→ 5 tests
→ 5 pass
→ 0 fail
```

Questa evidence verifica **soltanto** AF-001…AF-005.

## Costi e decisioni — Capitolo 20

Entra:

```text
docs/cost-model.md
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

Il Capitolo 20 aggiunge anche:

```text
tests/cost-fitness.test.mjs
```

Test logic esercitata localmente sulla stanza di metadata corrente dell'IaC:

```text
CF-001 allocation metadata
CF-002 no fabricated cost-center
→ 2 pass
→ 0 fail
```

Questa evidence non dimostra billing, forecast o unit economics reali.

## AI-ready repository — Capitolo 21

Order Operations diventa esplicitamente navigabile per contributor umani e coding agent senza duplicare tutta l'architettura in un prompt.

Entrano:

```text
AGENTS.md
docs/repository-map.md
tests/agent-context-fitness.test.mjs
```

La scelta è intenzionalmente tool-neutral:

```text
short AGENTS.md
+ canonical Repository Map
+ existing decision documents
+ executable verification
+ explicit stop conditions
```

Non sono stati aggiunti file vendor-specific duplicati come seconda source of truth.

`AGENTS.md` contiene:

- product purpose;
- context routing;
- repository boundary principali;
- golden verification commands;
- change synchronization rules;
- security constraints;
- stop conditions;
- definition of done.

`docs/repository-map.md` descrive responsabilità delle directory e indica quali documenti canonical leggere per classi di change.

Il context fitness protegge proprietà meccaniche:

```text
CTX-001 AGENTS.md + Repository Map exist
CTX-002 canonical documents referenced by context exist
CTX-003 golden commands exist in package scripts
CTX-004 AGENTS.md preserves routing + evidence discipline
```

La struttura reale dei documenti canonical è stata verificata nel repository. La logica del nuovo test è stata esercitata localmente su una ricostruzione della current operating context:

```text
CTX-001…CTX-004
→ 4 pass
→ 0 fail
```

Questa evidence **non** dimostra che il testo delle istruzioni sia semanticamente perfetto o non possa diventare stale. Dimostra soltanto i guardrail meccanici dichiarati.

## Evidence già accumulata

### Capitolo 18 — local application/refactoring gate

```text
tsc -p tsconfig.json
→ PASS

Order Operations tests
→ 19 pass
→ 0 fail

Operations Desk Classic characterization
→ 6 pass
→ 0 fail
```

### Capitolo 19 — architecture structural gate

```text
AF-001…AF-005
→ 5 pass
→ 0 fail
```

### Capitolo 20 — cost metadata gate

```text
CF-001…CF-002
→ 2 pass
→ 0 fail
```

### Capitolo 21 — repository context gate

```text
CTX-001…CTX-004
→ 4 pass
→ 0 fail
```

I test aggiunti nei capitoli successivi sono inclusi dal wildcard `tests/*.test.mjs`, ma non dichiariamo una nuova esecuzione end-to-end dell'intera suite dopo ogni commit finché non viene realmente eseguita come tale.

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
Cost fitness metadata guard                     Codified + locally exercised 2/2
AGENTS.md                                       Codified
Repository Map                                  Codified
Context fitness CTX-001…CTX-004                 Codified + locally exercised 4/4
Production billing / unit economics              Pending
Production priority shadow telemetry             Designed / Pending
Candidate production cutover                     Not authorized
PostgreSQL integration                           Designed / Pending
Azure security/network verification              Designed / Pending
Recovery drills                                  Pending
Production observability evidence                Pending
Agent production permissions/autonomy model      Future chapters
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
│       ├── 001_create_operational_case.sql
│       └── 002_add_payment_escalation_and_outbox.sql
├── docs/
│   ├── repository-map.md
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
│   ├── README.md
│   └── main.bicep
├── src/
│   ├── application/
│   ├── contracts/
│   ├── integration/
│   ├── observability/
│   └── priority/
└── tests/
    ├── agent-context-fitness.test.mjs
    ├── architecture-fitness.test.mjs
    ├── cost-fitness.test.mjs
    ├── payment-escalation.test.mjs
    ├── outbox-publisher.test.mjs
    └── priority-policy.test.mjs
```

Legacy system separato:

```text
example-software-industries/
├── legacy/operations-desk-classic/
└── products/order-operations/
```

## Documenti da mantenere sincronizzati

Quando il prodotto cambia verifichiamo almeno:

- `AGENTS.md` e Repository Map quando cambia il navigation/execution context;
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

> **Il buon guardrail blocca il drift. Non blocca l'evoluzione intenzionale.**

> **Un costo importante deve poter essere collegato alla proprietà che compra, al suo owner e a un trigger di revisione.**

> **Il repository contiene ciò che resta vero fra i task. La issue contiene ciò che deve diventare vero nel task corrente.**

Una instruction non sostituisce un requirement, un security control o una execution evidence.

## Obiettivo finale

Alla fine del libro il lettore deve poter confrontare la prima iterazione con il sistema finale e capire non soltanto **che cosa** è cambiato, ma **quale nuova informazione, trade-off o evidence ha reso necessario ogni cambiamento**.