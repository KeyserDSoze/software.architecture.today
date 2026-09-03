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

Ogni capitolo può cambiare Order Operations soltanto quando introduce:

- nuova informazione;
- requisito;
- capability;
- vincolo;
- failure mode;
- cambiamento organizzativo;
- trade-off che modifica il fit della soluzione corrente.

> **Il progetto deve evolvere perché cambia il contesto, non perché il libro deve mostrare una tecnologia.**

## Evoluzione fin qui

### Capitolo 1 — Prima iterazione

Nasce una console interna per rendere visibili ordini problematici.

### Capitolo 2 — Foundation e analisi funzionale

Problema, outcome, attori, scope, business rule, acceptance criteria e domande aperte diventano espliciti.

L'analisi funzionale diventa conoscenza condivisa del team.

### Capitolo 3 — System thinking

Il prodotto viene osservato dentro Orders, Payments, Shipping, identity e provider esterni.

### Capitolo 4 — Decisioni

Si preferisce inizialmente un lookup live invece di introdurre subito un read model asincrono.

### Capitolo 5 — Confini

Orders, Payments e Shipping acquistano responsibility/ownership boundary distinti anche nello stesso deployable.

### Capitolo 6 — Quality attributes

Correctness, security, operability, latency, availability e cost diventano input della technology selection.

Niente Redis o active-active multi-region senza requisito che ne paghi il costo.

### Capitolo 7 — Pattern

I pattern entrano soltanto quando risolvono forze già presenti.

### Capitolo 8 — Topologia

Order Operations resta un **modular monolith**.

Separazione logica non significa automaticamente separazione di deployment.

### Capitolo 9 — API e contratti

Entrano i primi contratti HTTP:

```text
GET /api/problematic-orders
GET /api/orders/{orderId}/operational-view
```

Refund e remediation command restano fuori finché semantica e ownership non sono definite.

### Capitolo 10 — Data architecture

Entra la **Data Ownership Map**.

Order Operations diventa authoritative per:

- `OperationalCase`;
- problem classification;
- operator assignment.

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

Entrano:

```text
docs/cloud-deployment.md
docs/adr/0002-azure-paas-single-region.md
infra/README.md
```

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

Nessun WAF finché non esiste Internet-facing ingress.

Private Link su Service Bus richiede Premium: il security boundary produce quindi un costo FinOps esplicito.

`main.bicep` viene trattato come **Codified**, non come `Verified` finché non supera build/deploy e negative test.

### Capitolo 14 — Reliability e resilienza

La reliability diventa un contratto misurabile e non più soltanto un NFR qualitativo.

Entra:

```text
docs/reliability-contract.md
```

La Failure Mode Map viene estesa dal solo messaging flow all'intero workload cloud.

Target simulati ESI:

```text
Core operator journey SLO
= 99.9% good events / rolling 28 days

Payment Escalation publication
= 99% entro 5 minuti

Intra-region RTO
<= 15 minuti

Intra-region RPO
= 0 per committed local business state

Region disaster RTO
<= 8 ore

Region disaster RPO
<= 1 ora
```

Questi numeri sono requisiti del caso fittizio, non benchmark industriali.

La reliability topology corrente usa App Service Premium v3 con almeno due istanze e zone redundancy, PostgreSQL zone-redundant HA direction, Service Bus Premium zone-redundant e single-region recovery.

`infra/main.bicep` codifica App Service `capacity >= 2`, App Service `zoneRedundant = true` e Service Bus `zoneRedundant = true`.

PostgreSQL HA/private resta `Designed`, non ancora codificato.

### Capitolo 15 — Observability

La reliability riceve finalmente una measurement architecture.

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

Il capitolo introduce un **cardinality budget**, separa metriche, trace, structured log, audit e business evidence e vieta per default business identifier unbounded come dimensioni metriche.

Il production synthetic journey non riapre l'ingress pubblico: dovrà usare un runner privato, una identity dedicata e dati synthetic controllati.

Il codice cresce con una porta vendor-neutral:

```text
src/observability/telemetry.ts
src/observability/observed-request-payment-escalation.ts
```

Il decorator osserva `accepted`, `already-accepted` e rejection class senza introdurre direttamente SDK Application Insights/OpenTelemetry nel use case.

La porta/decorator è stata ricostruita localmente con i source file da cui dipende e typechecked con TypeScript strict senza errori.

L'adapter OpenTelemetry/Application Insights resta `Designed`, non ancora codificato o verificato a runtime.

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
│   ├── events/
│   │   └── operational-case-payment-escalated-v1.md
│   └── adr/
│       ├── 0001-live-read-before-read-model.md
│       ├── 0002-azure-paas-single-region.md
│       └── 0003-private-ingress-and-identity-first-security.md
├── infra/
│   ├── README.md
│   └── main.bicep
└── src/
    ├── application/
    │   └── request-payment-escalation.ts
    ├── contracts/
    │   └── operational-case-payment-escalated-v1.ts
    ├── integration/
    │   └── outbox-publisher.ts
    └── observability/
        ├── telemetry.ts
        └── observed-request-payment-escalation.ts
```

`tests/` comparirà quando il percorso del libro introdurrà la testing strategy in modo sistematico.

Non creiamo directory vuote per simulare avanzamento.

## Evidence status

Usiamo quattro livelli:

```text
Designed
→ Codified
→ Verified
→ Monitored
```

### TypeScript

Il nucleo introdotto nel Capitolo 11 è stato typechecked in modalità strict durante la sua introduzione.

La porta/decorator observability del Capitolo 15 è stata typechecked in modalità strict tramite ricostruzione locale dei source letti dalla repository.

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

SLO, RTO/RPO, health model e recovery drill sono `Designed`.

La zone redundancy App Service/Service Bus è `Codified` in IaC.

Il PostgreSQL zone-redundant HA è `Designed` ma il modulo IaC è ancora pending.

Nessun recovery drill è ancora `Verified`.

### Observability

```text
Observability Contract: Designed
bounded telemetry port: Codified + typechecked
Payment Escalation observable decorator: Codified + typechecked
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
- infrastructure as code;
- testing strategy;
- deployment/rollback;
- runbook.

Il codice è una rappresentazione importante del prodotto, ma non è l'unica.

## Contesto aziendale

Order Operations può ricevere pressioni o requisiti da:

- Payments & Risk;
- Mobile Products;
- Data & AI;
- Platform Engineering;
- Security;
- Finance / FinOps;
- Legal / Compliance;
- Sales e clienti enterprise.

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