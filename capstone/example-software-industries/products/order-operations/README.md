# Order Operations

> **Prodotto simulato/composito di Example Software Industries S.p.A.**

Order Operations è il capstone principale di *Software Architecture Today*.

Appartiene alla business unit **Commerce & Operations** di ESI.

Non è soltanto un esempio narrativo: cresce capitolo dopo capitolo e conserva qui lo stato corrente delle decisioni accumulate.

I capitoli spiegano **perché** il progetto cambia. Questa directory mostra **che cosa è diventato** dopo quelle decisioni.

## Product goal corrente

Ridurre il tempo necessario agli operatori per individuare, comprendere e gestire ordini che richiedono attenzione operativa.

Il prodotto non nasce con l'obiettivo di sostituire Orders, Payments o Shipping come authoritative source.

## Regola di evoluzione

Ogni capitolo può cambiare Order Operations soltanto quando introduce:

- una nuova informazione;
- un nuovo requisito;
- una capability;
- un vincolo;
- un failure mode;
- un cambiamento organizzativo;
- un trade-off che modifica il fit della soluzione corrente.

> **Il progetto deve evolvere perché cambia il contesto, non perché il libro deve mostrare una tecnologia.**

## Evoluzione fin qui

### Capitolo 1 — Prima iterazione

Nasce una console interna per rendere visibili ordini problematici.

### Capitolo 2 — Foundation e analisi funzionale

Vengono esplicitati problema, outcome, attori, scope, business rule, acceptance criteria e domande aperte.

L'analisi funzionale diventa conoscenza condivisa del team.

### Capitolo 3 — System thinking

La console viene osservata dentro il sistema più ampio: Orders, Payments, Shipping, identity e provider esterni.

### Capitolo 4 — Decisioni

Si preferisce inizialmente un lookup live ai dati operativi invece di introdurre subito un read model asincrono.

### Capitolo 5 — Confini

Orders, Payments e Shipping acquistano responsabilità e ownership logiche distinte.

### Capitolo 6 — Quality attributes

Vengono esplicitate priorità di correctness, security, operability, latency, availability e cost.

Non vengono introdotti Redis o active-active multi-region senza un requisito che ne giustifichi il costo.

### Capitolo 7 — Pattern

I pattern vengono adottati soltanto quando risolvono forze già presenti.

### Capitolo 8 — Topologia

Order Operations resta per ora un **modular monolith**.

La separazione logica non richiede ancora separazione di deployment.

### Capitolo 9 — API e contratti

La Operations UI riceve il primo contratto HTTP esplicito:

```text
GET /api/problematic-orders
GET /api/orders/{orderId}/operational-view
```

Non vengono ancora introdotti command endpoint di refund o remediation perché la semantica funzionale non è abbastanza definita.

### Capitolo 10 — Data architecture

Viene introdotta la prima **Data Ownership Map**.

Orders, Payments & Risk e Shipping restano authoritative owner dei rispettivi business fact.

Order Operations diventa authoritative soltanto per concetti operativi propri:

- `OperationalCase`;
- problem classification;
- operator assignment.

Il progetto mantiene PostgreSQL come datastore operativo corrente e aggiunge la prima migration SQL reale:

```text
database/migrations/001_create_operational_case.sql
```

Non vengono ancora introdotti Redis, search store o projection asincrona: le future copie dovranno avere source, freshness, reconciliation e rebuild espliciti.

### Capitolo 11 — Sistemi distribuiti

Una nuova esigenza ESI introduce la prima integrazione asincrona reale del capstone.

Un operatore può richiedere una **Payment Escalation** verso Payments & Risk senza eseguire direttamente refund o altre operazioni economiche.

Il flow usa:

```text
local PostgreSQL transaction
+ PaymentEscalation
+ Transactional Outbox
+ broker-agnostic publisher
+ at-least-once delivery contract
+ downstream idempotency
+ Failure Mode Map
```

L'API contract evolve con:

```text
POST /api/operational-cases/{caseId}/payment-escalations
Idempotency-Key: <escalation-id>
```

La risposta distingue:

```text
business state    = Requested
integration state = Pending / Delivered / Delayed / DeadLettered
```

Viene aggiunta la migration:

```text
database/migrations/002_add_payment_escalation_and_outbox.sql
```

E `src/` entra per la prima volta nel progetto con TypeScript strict e porte broker-agnostiche.

### Capitolo 12 — Cloud Architecture

ESI introduce il proprio cloud operating model: Platform Engineering fornisce una **Azure application landing zone**, mentre il team Order Operations mantiene ownership end-to-end del workload.

La prima deployment topology è:

```text
Azure App Service
+ continuous WebJob per Outbox Publisher
+ Azure Database for PostgreSQL Flexible Server
+ Azure Service Bus Queue
+ Managed Identity
+ Azure Key Vault
+ Azure Monitor / Application Insights
+ Bicep come IaC direction
+ single Azure region
```

Non vengono scelti AKS, Container Apps o multi-region perché nessun requisito corrente ne paga ancora il costo operativo.

Entrano:

```text
docs/cloud-deployment.md
docs/adr/0002-azure-paas-single-region.md
infra/README.md
```

`infra/` compare senza un `main.bicep` deployabile: il Capitolo 13 deve prima definire threat model, ingress/egress, private endpoint e permission boundary. L'IaC non viene lasciato inventare la security architecture.

### Capitolo 13 — Security by Design

Il threat model chiude le decisioni security-sensitive lasciate intenzionalmente aperte nel Capitolo 12.

Entrano due nuovi artefatti vivi:

```text
docs/threat-model.md
docs/security-control-matrix.md
```

E viene accettato:

```text
docs/adr/0003-private-ingress-and-identity-first-security.md
```

La production security direction è:

```text
ESI workforce
→ private App Service ingress
→ Entra authentication
→ server-side application authorization

App Service / WebJob
→ managed identity
→ least-privilege access

runtime identity
≠ deployment identity

PostgreSQL / Service Bus / Key Vault
→ private data-plane direction
```

Non viene introdotto un WAF perché non esiste ancora un Internet-facing journey.

Per la prima volta il capstone contiene un template IaC concreto:

```text
infra/main.bicep
```

La baseline codifica App Service, Entra authentication direction, managed identity, private endpoint, Key Vault RBAC/private access, Service Bus Queue/private access, send-only broker privilege e observability foundation.

Il template dipende da subnet/private DNS capability della landing zone: il workload non reinventa la rete enterprise.

#### Compromesso Security ↔ FinOps

La scelta di Private Link per Service Bus richiede **Service Bus Premium**.

Quindi il security boundary introduce un costo cloud reale.

Il costo viene accettato e reso visibile, con trigger di revisione insieme a Finance/FinOps.

Questo è deliberato:

> un controllo di sicurezza deve avere un threat, un costo, un owner e una verifica.

Il Bicep è **codified baseline**, non production readiness. Build/lint, policy validation e deployment non-production restano gate di verifica espliciti.

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
    └── integration/
        └── outbox-publisher.ts
```

`tests/` comparirà quando il percorso del libro introdurrà la testing strategy in modo sistematico.

Non creiamo directory vuote per simulare avanzamento.

## Verification status

### TypeScript

Il nucleo TypeScript non dipende da framework o SDK cloud.

Comandi:

```bash
npm install
npm run typecheck
npm run build
```

Il typecheck strict del codice introdotto nel Capitolo 11 è stato verificato durante la scrittura del capitolo.

### Bicep

`infra/main.bicep` è stato costruito sulla base delle resource schema/documentazioni Azure correnti e delle decisioni del Threat Model.

Non è ancora corretto dichiararlo **verified**.

Gate ancora richiesti:

```text
bicep build/lint
Azure Policy validation
deployment non-production
private connectivity test
Entra authentication test
RBAC negative test
security review
cost review
```

La distinzione usata dal capstone è:

```text
Designed
→ Codified
→ Verified
→ Monitored
```

## Cosa deve rimanere sincronizzato

Quando Order Operations cambia dobbiamo verificare l'impatto su:

- problem e outcome;
- analisi funzionale;
- glossario;
- requirements;
- ownership;
- ADR;
- API contract;
- event contract;
- Data Ownership Map;
- schema e migration;
- NFR;
- Failure Mode Map;
- Cloud Deployment Map;
- Threat Model;
- Security Control Matrix;
- infrastructure as code;
- observability;
- testing strategy;
- deployment;
- runbook.

Il codice è una rappresentazione importante del prodotto, ma non è l'unica.

## Contesto aziendale

Order Operations non decide da solo il proprio futuro.

Potrà ricevere pressioni o requisiti da:

- Payments & Risk;
- Mobile Products;
- Data & AI;
- Platform Engineering;
- Security;
- Finance / FinOps;
- Legal / Compliance;
- Sales e clienti enterprise.

Questo è intenzionale.

Nel corso del libro vogliamo vedere come una soluzione cambia quando il problema tecnico incontra il resto dell'azienda.

## Obiettivo finale

Alla fine del libro Order Operations dovrà essere un progetto navigabile e funzionante con:

- codice applicativo;
- test;
- documentazione;
- decision log;
- contratti;
- data model;
- infrastructure as code;
- security controls;
- observability;
- deployment e rollback;
- production readiness;
- eventuale integrazione AI soltanto quando giustificata dal contesto.

Il lettore deve poter confrontare le prime decisioni con il sistema finale e capire non soltanto **che cosa** è cambiato, ma **perché**.