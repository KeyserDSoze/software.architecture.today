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

Il gate usa il normale runner `node:test`; nessun framework aggiuntivo è stato introdotto perché il portfolio corrente non lo giustifica ancora.

Verification dedicata eseguita durante il Capitolo 19 sul current import graph ricostruito dai source correnti:

```text
node --test tests/architecture-fitness.test.mjs
→ 5 tests
→ 5 pass
→ 0 fail
```

Questa evidence verifica **soltanto** AF-001…AF-005. Non promuove a Verified proprietà cloud, runtime, data, recovery o production observability.

## Costi e decisioni — Capitolo 20

Entra:

```text
docs/cost-model.md
```

Il Cost Model non contiene prezzi Azure inventati. Rende espliciti:

```text
cost surface
architectural premiums
fixed / variable / step / transition cost
cost drivers
allocation direction
unit economics
optimization order
review triggers
```

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

L'IaC possedeva già metadata utili all'allocazione:

```text
workload = order-operations
owner = commerce-operations
environment = <environmentName>
```

Il Capitolo 20 aggiunge:

```text
tests/cost-fitness.test.mjs
```

che protegge i metadata minimi e impedisce di hardcodare un `cost-center` fittizio del libro.

Test logic esercitata localmente sulla stanza di metadata corrente dell'IaC:

```text
CF-001 allocation metadata
CF-002 no fabricated cost-center
→ 2 pass
→ 0 fail
```

Questa evidence non dimostra billing, forecast o unit economics reali. Dimostra soltanto il guardrail statico sui metadata verificati.

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
Production billing / unit economics              Pending
Production priority shadow telemetry             Designed / Pending
Candidate production cutover                     Not authorized
PostgreSQL integration                           Designed / Pending
Azure security/network verification              Designed / Pending
Recovery drills                                  Pending
Production observability evidence                Pending
```

## Struttura corrente

```text
order-operations/
├── README.md
├── package.json
├── tsconfig.json
├── database/
│   ├── README.md
│   └── migrations/
│       ├── 001_create_operational_case.sql
│       └── 002_add_payment_escalation_and_outbox.sql
├── docs/
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
│       ├── priority-policy.ts
│       ├── confirmed-priority-policy.ts
│       ├── legacy-priority-adapter.ts
│       └── branching-priority-policy.ts
└── tests/
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

Una fitness function può essere modificata quando cambia l'architectural intent, ma la modifica della policy non viene trattata come un modo automatico per far passare una implementation violation.

## Obiettivo finale

Alla fine del libro il lettore deve poter confrontare la prima iterazione con il sistema finale e capire non soltanto **che cosa** è cambiato, ma **quale nuova informazione, trade-off o evidence ha reso necessario ogni cambiamento**.
