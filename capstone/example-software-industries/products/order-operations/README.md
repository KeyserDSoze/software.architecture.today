# Order Operations

> **Prodotto simulato/composito di Example Software Industries S.p.A. (ESI).**

Order Operations è il capstone principale di *Software Architecture Today* e appartiene alla business unit **Commerce & Operations**.

I capitoli spiegano **perché** il progetto cambia. Questa directory conserva **lo stato corrente** delle decisioni, del codice e delle evidenze accumulate.

## Product goal

Ridurre il tempo necessario agli operatori per individuare, comprendere e gestire ordini che richiedono attenzione operativa.

Order Operations non sostituisce Orders, Payments o Shipping come authoritative source.

## Regola di evoluzione

> **Il progetto deve evolvere perché cambia il contesto, non perché il libro deve mostrare una tecnologia.**

Ogni capitolo può cambiare il capstone soltanto quando introduce nuova informazione, requisito, capability, vincolo, failure mode, cambiamento organizzativo o trade-off che modifica il fit della soluzione corrente.

## Evoluzione capitolo per capitolo

### 1 — Prima iterazione

Console interna per rendere visibili ordini problematici.

### 2 — Foundation e analisi funzionale

Problem/outcome, attori, scope, business rule e acceptance criteria diventano espliciti. L'analisi funzionale diventa conoscenza condivisa.

### 3 — System thinking

Order Operations viene inserito nel contesto di Orders, Payments, Shipping, identity e provider esterni.

### 4 — Decisioni

Lookup live prima di un read model asincrono.

### 5 — Confini

Responsibility/ownership boundary distinti anche nello stesso deployable.

### 6 — Quality attributes

Correctness, security, operability, latency, availability e cost guidano le technology choice. Niente Redis o active-active multi-region senza requisito che ne paghi il costo.

### 7 — Pattern

I pattern entrano soltanto quando risolvono forze già presenti.

### 8 — Topologia

Order Operations resta un **modular monolith**.

### 9 — API e contratti

Entrano i primi contratti HTTP read-oriented. Command economici/remediation restano fuori finché semantica e ownership non sono definite.

### 10 — Data architecture

Entra la Data Ownership Map. `OperationalCase`, classificazione e assignment diventano dati locali posseduti dal prodotto.

Migration:

```text
database/migrations/001_create_operational_case.sql
```

### 11 — Sistemi distribuiti

Nasce la Payment Escalation verso Payments & Risk:

```text
PaymentEscalation
+ Transactional Outbox
+ at-least-once delivery
+ downstream idempotency
+ Failure Mode Map
```

Migration:

```text
database/migrations/002_add_payment_escalation_and_outbox.sql
```

### 12 — Cloud Architecture

Prima topologia Azure:

```text
App Service + continuous WebJob
Azure Database for PostgreSQL
Service Bus Queue
Managed Identity
Key Vault
Azure Monitor / Application Insights
Bicep
single region
```

### 13 — Security by Design

Entrano Threat Model, Security Control Matrix e prima baseline `infra/main.bicep`.

Production direction:

```text
private ingress
+ Entra authentication
+ server-side authorization
+ runtime/deployment identity separation
+ private data-plane direction
```

### 14 — Reliability e resilienza

Entra `docs/reliability-contract.md` con target simulati ESI per SLO/RTO/RPO, zone resilience e required recovery drill.

### 15 — Observability

Entra `docs/observability-contract.md` e una porta telemetry vendor-neutral in TypeScript.

```text
OpenTelemetry-compatible instrumentation
→ Azure Monitor / Application Insights
```

### 16 — Testing Architecture

Entra `docs/testing-strategy.md` e la prima suite eseguibile.

Evidence originaria:

```text
TypeScript build PASS
11/11 Order Operations tests PASS
```

### 17 — Legacy e comprensione

ESI introduce un sistema brownfield separato:

```text
capstone/example-software-industries/legacy/operations-desk-classic/
```

La slice `legacy case priority routing` riceve characterization test:

```text
6/6 PASS
```

Entrano:

```text
docs/legacy-understanding-map.md
Found → Inferred → Observed → Confirmed
```

Nel Capitolo 17 i behavior sono osservati ma non ancora promossi automaticamente a requirement.

### 18 — Refactoring nell'era dell'AI

ESI classifica la semantica della priority e introduce il primo **refactoring slice reale**.

Nuovi artefatti:

```text
docs/priority-functional-analysis.md
docs/refactoring-safety-plan.md
```

Target priority semantics:

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

viene rimosso tramite decisione esplicita simulata ESI e registrato come:

```text
ED-001 — ExpectedDifference
```

Nuovo codice:

```text
src/priority/
├── priority-policy.ts
├── confirmed-priority-policy.ts
├── legacy-priority-adapter.ts
└── branching-priority-policy.ts
```

La migration usa:

```text
PriorityPolicy seam
+ Anti-Corruption legacy adapter
+ Branch by Abstraction
+ modes legacy | shadow | candidate
+ Match / ExpectedDifference / UnexpectedDifference
```

Il legacy originale resta intatto.

Verification locale dopo il Capitolo 18:

```text
tsc -p tsconfig.json
→ PASS

Order Operations tests
→ 19 tests
→ 19 pass
→ 0 fail

Operations Desk Classic characterization
→ 6 tests
→ 6 pass
→ 0 fail
```

Dei 19 test Order Operations:

```text
11 = suite precedente
8  = priority/refactoring/shadow tests
```

Questa evidence verifica il layer locale. **Non** dimostra production shadow rollout, PostgreSQL/Azure integration, consumer retirement o candidate cutover.

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
│   │   └── operational-case-payment-escalated-v1.md
│   └── adr/
│       ├── 0001-live-read-before-read-model.md
│       ├── 0002-azure-paas-single-region.md
│       └── 0003-private-ingress-and-identity-first-security.md
├── infra/
│   ├── README.md
│   └── main.bicep
├── src/
│   ├── application/
│   │   └── request-payment-escalation.ts
│   ├── contracts/
│   │   └── operational-case-payment-escalated-v1.ts
│   ├── integration/
│   │   └── outbox-publisher.ts
│   ├── observability/
│   │   ├── telemetry.ts
│   │   └── observed-request-payment-escalation.ts
│   └── priority/
│       ├── priority-policy.ts
│       ├── confirmed-priority-policy.ts
│       ├── legacy-priority-adapter.ts
│       └── branching-priority-policy.ts
└── tests/
    ├── payment-escalation.test.mjs
    ├── outbox-publisher.test.mjs
    └── priority-policy.test.mjs
```

Legacy system separato:

```text
example-software-industries/
├── legacy/
│   └── operations-desk-classic/
│       ├── README.md
│       ├── src/priority-routing.cjs
│       └── tests/priority-routing.characterization.test.mjs
└── products/
    └── order-operations/
```

## Evidence model

Per gli artefatti:

```text
Designed
→ Codified
→ Verified
→ Monitored
```

Per la conoscenza legacy:

```text
Found
→ Inferred
→ Observed
→ Confirmed
```

Stato corrente:

```text
TypeScript application source                 Codified + typechecked
Order Operations local suite                  Verified locally 19/19
Legacy priority characterization              Verified locally 6/6
Priority target policy                        Codified + Verified locally
LegacyPriorityAdapter                         Codified + Verified locally
Shadow comparison logic                       Codified + Verified locally
Production priority shadow telemetry          Designed / Pending
Candidate production cutover                  Not authorized / Not executed
Legacy priority retirement                    Not started
PostgreSQL integration                        Designed / Pending
Azure security/network verification           Designed / Pending
Recovery drills                               Pending
Production observability evidence             Pending
```

## Refactoring rule

Il Capitolo 18 introduce un principio che deve restare valido per le prossime evoluzioni:

> **Ogni passo di una trasformazione deve produrre abbastanza evidence da meritare il passo successivo.**

L'AI può accelerare seam, adapter, test e trasformazioni repository-wide. Non può trasformare automaticamente comportamento osservato in requisito, né autorizzare one-way door o cutover business-critical.

## Documenti da mantenere sincronizzati

Quando Order Operations cambia, verifichiamo almeno:

- functional analysis;
- requirements;
- ownership;
- ADR;
- API/event contracts;
- data model/migrations;
- NFR;
- Failure Mode Map;
- Threat Model;
- Security Control Matrix;
- Reliability Contract;
- Observability Contract;
- Testing Strategy;
- Legacy Understanding Map;
- Refactoring Safety Plan;
- IaC;
- deployment/rollback;
- runbook.

## Obiettivo finale

Alla fine del libro il lettore deve poter confrontare la prima iterazione con il sistema finale e capire non soltanto **che cosa** è cambiato, ma **quale nuova informazione o trade-off ha reso necessario ogni cambiamento**.
