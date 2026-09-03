# Order Operations

> **Prodotto simulato/composito di Example Software Industries S.p.A.**

Order Operations è il capstone principale di *Software Architecture Today*.

Appartiene alla business unit **Commerce & Operations** di ESI.

Non è soltanto un esempio narrativo: cresce capitolo dopo capitolo e conserva qui lo stato corrente delle decisioni accumulate.

I capitoli spiegano **perché** il progetto cambia. Questa directory mostra **che cosa è diventato** dopo quelle decisioni.

## Product goal corrente

Ridurre il tempo necessario agli operatori per individuare, comprendere e gestire ordini che richiedono attenzione operativa.

Order Operations non sostituisce Orders, Payments o Shipping come authoritative source.

## Regola di evoluzione

Ogni capitolo può cambiare Order Operations soltanto quando introduce nuova informazione, requisito, capability, vincolo, failure mode, cambiamento organizzativo o trade-off che modifica il fit della soluzione corrente.

> **Il progetto deve evolvere perché cambia il contesto, non perché il libro deve mostrare una tecnologia.**

## Evoluzione fin qui

### Capitolo 1 — Prima iterazione

Nasce una console interna per rendere visibili ordini problematici.

### Capitolo 2 — Foundation e analisi funzionale

Problema, outcome, attori, scope, business rule, acceptance criteria e domande aperte diventano espliciti. L'analisi funzionale diventa conoscenza condivisa del team.

### Capitolo 3 — System thinking

Il prodotto viene osservato dentro Orders, Payments, Shipping, identity e provider esterni.

### Capitolo 4 — Decisioni

Si preferisce inizialmente un lookup live invece di introdurre subito un read model asincrono.

### Capitolo 5 — Confini

Orders, Payments e Shipping acquistano responsibility/ownership boundary distinti anche nello stesso deployable.

### Capitolo 6 — Quality attributes

Correctness, security, operability, latency, availability e cost diventano input della technology selection. Niente Redis o active-active multi-region senza requisito che ne paghi il costo.

### Capitolo 7 — Pattern

I pattern entrano soltanto quando risolvono forze già presenti.

### Capitolo 8 — Topologia

Order Operations resta un **modular monolith**. Separazione logica non significa automaticamente separazione di deployment.

### Capitolo 9 — API e contratti

Entrano i primi contratti HTTP:

```text
GET /api/problematic-orders
GET /api/orders/{orderId}/operational-view
```

Refund e remediation command restano fuori finché semantica e ownership non sono definite.

### Capitolo 10 — Data architecture

Entra la **Data Ownership Map**. Order Operations diventa authoritative per `OperationalCase`, problem classification e operator assignment.

Prima migration reale:

```text
database/migrations/001_create_operational_case.sql
```

### Capitolo 11 — Sistemi distribuiti

Nasce la **Payment Escalation** verso Payments & Risk.

Il flow usa:

```text
PaymentEscalation
+ Transactional Outbox
+ broker-agnostic publisher
+ at-least-once delivery contract
+ downstream idempotency
+ Failure Mode Map
```

API:

```text
POST /api/operational-cases/{caseId}/payment-escalations
Idempotency-Key: <escalation-id>
```

Seconda migration:

```text
database/migrations/002_add_payment_escalation_and_outbox.sql
```

`src/` entra con TypeScript strict e porte broker-agnostiche.

### Capitolo 12 — Cloud Architecture

ESI adotta una **Azure application landing zone**.

Prima cloud topology:

```text
Azure App Service
+ continuous WebJob
+ Azure Database for PostgreSQL Flexible Server
+ Azure Service Bus Queue
+ Managed Identity
+ Azure Key Vault
+ Azure Monitor / Application Insights
+ Bicep
+ single Azure region
```

AKS, Container Apps e multi-region restano fuori perché nessun requisito corrente ne paga ancora il costo.

### Capitolo 13 — Security by Design

Entrano:

```text
docs/threat-model.md
docs/security-control-matrix.md
docs/adr/0003-private-ingress-and-identity-first-security.md
infra/main.bicep
```

Production security direction:

```text
ESI workforce
→ private App Service ingress
→ Entra authentication
→ server-side application authorization

runtime managed identity
≠ deployment identity

PostgreSQL / Service Bus / Key Vault
→ private data-plane direction
```

Nessun WAF finché non esiste Internet-facing ingress. Private Link su Service Bus richiede Premium: il security boundary produce un costo FinOps esplicito.

### Capitolo 14 — Reliability e resilienza

Entra:

```text
docs/reliability-contract.md
```

Target simulati ESI:

```text
Core operator journey SLO = 99.9% / rolling 28 days
Payment Escalation publication = 99% entro 5 minuti
Intra-region RTO <= 15 minuti
Intra-region RPO = 0 per committed local business state
Region disaster RTO <= 8 ore
Region disaster RPO <= 1 ora
```

La reliability topology corrente usa App Service Premium v3 con almeno due istanze e zone redundancy, PostgreSQL zone-redundant HA direction, Service Bus Premium zone-redundant e single-region recovery.

### Capitolo 15 — Observability

Entra:

```text
docs/observability-contract.md
```

La direzione è:

```text
OpenTelemetry-compatible instrumentation
→ Azure Monitor / Application Insights / Log Analytics
→ SLI queries, alerts e investigation views
```

Il codice cresce con:

```text
src/observability/telemetry.ts
src/observability/observed-request-payment-escalation.ts
```

La porta/decorator è stata typechecked con TypeScript strict. L'adapter OpenTelemetry/Application Insights resta `Designed`, non ancora codificato o verificato a runtime.

### Capitolo 16 — Testing Architecture

La qualità diventa una **evidence strategy** derivata da risk, requirement, contract, threat e failure mode.

Entra:

```text
docs/testing-strategy.md
```

Per la prima volta compare anche una suite eseguibile:

```text
tests/payment-escalation.test.mjs
tests/outbox-publisher.test.mjs
```

La prima tranche protegge:

- Payment category eligibility;
- tenant mismatch;
- idempotent replay;
- idempotency-key conflict;
- escalation + outbox orchestration;
- bounded retry;
- exhausted delivery path;
- stable `messageId` durante retry;
- telemetry acceptance/rejection classification;
- bounded metric context vs high-cardinality correlation identifiers.

Il progetto usa per ora il runner integrato `node:test` sul JavaScript compilato da TypeScript invece di introdurre un framework aggiuntivo senza un requisito.

Verification eseguita durante la scrittura del capitolo:

```text
tsc -p tsconfig.json
→ PASS

node --test tests/*.test.mjs
→ 11 tests
→ 11 pass
→ 0 fail
```

Questa evidence è limitata al fast local layer.

Restano pending:

```text
PostgreSQL integration/migration tests
API host integration
Payments & Risk consumer contract
Azure identity/network/RBAC tests
performance/capacity evidence
recovery drills
production synthetic journey
```

Questo è intenzionale: test locali verdi non vengono usati per dichiarare verified ciò che richiede un boundary reale.

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
│   └── observability/
│       ├── telemetry.ts
│       └── observed-request-payment-escalation.ts
└── tests/
    ├── payment-escalation.test.mjs
    └── outbox-publisher.test.mjs
```

Non creiamo directory vuote per simulare avanzamento.

## Evidence status

Usiamo quattro livelli:

```text
Designed
→ Codified
→ Verified
→ Monitored
```

### Application / tests

```text
TypeScript source: Codified + typechecked
fast Node test suite: Codified + Verified locally, 11/11
PostgreSQL integration: Designed / Pending
API integration: Designed / Pending
Payments contract: Designed / Pending cross-team
```

### Bicep

`infra/main.bicep` è una baseline codificata.

Gate ancora richiesti:

```text
bicep build/lint
Azure Policy validation
deployment non-production
private connectivity test
Entra authentication test
RBAC negative test
zone/recovery test
cost review
```

### Reliability

SLO, RTO/RPO, health model e recovery drill sono `Designed`. Zone redundancy App Service/Service Bus è `Codified`; PostgreSQL HA è ancora parzialmente `Designed`. Nessun recovery drill è ancora `Verified`.

### Observability

```text
Observability Contract: Designed
bounded telemetry port: Codified + typechecked
Payment Escalation observable decorator: Codified + typechecked + locally exercised by tests
OpenTelemetry/Application Insights adapter: Pending
SLI queries: Designed
alerts: Designed
private synthetic journey: Designed
runtime telemetry evidence: Not yet available
```

Non chiamiamo `Monitored` una proprietà finché non esiste evidence runtime effettivamente interrogabile.

## Documenti che devono restare sincronizzati

Quando Order Operations cambia verifichiamo impatto su:

- problem/outcome;
- analisi funzionale e glossario;
- requirements;
- ownership;
- ADR;
- API/event contract;
- Data Ownership Map;
- schema/migration;
- NFR;
- Failure Mode Map;
- Cloud Deployment Map;
- Threat Model;
- Security Control Matrix;
- Reliability Contract;
- Observability Contract;
- Testing Strategy;
- infrastructure as code;
- deployment/rollback;
- runbook.

Il codice è una rappresentazione importante del prodotto, ma non è l'unica.

## Contesto aziendale

Order Operations può ricevere pressioni o requisiti da Payments & Risk, Mobile Products, Data & AI, Platform Engineering, Security, Finance/FinOps, Legal/Compliance, Sales e clienti enterprise.

Questo è intenzionale: vogliamo vedere come una soluzione cambia quando il problema tecnico incontra il resto dell'azienda.

## Obiettivo finale

Alla fine del libro Order Operations dovrà essere navigabile e funzionante con:

- codice applicativo;
- test;
- documentazione;
- decision log;
- contratti;
- data model;
- infrastructure as code;
- security controls;
- reliability/observability evidence;
- deployment e rollback;
- production readiness;
- eventuale integrazione AI soltanto quando giustificata.

Il lettore deve poter confrontare le prime decisioni con il sistema finale e capire non soltanto **che cosa** è cambiato, ma **perché**.