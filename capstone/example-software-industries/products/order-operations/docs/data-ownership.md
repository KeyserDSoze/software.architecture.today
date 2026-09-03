# Order Operations — Data Ownership Map

> **Scenario fittizio ESI.** Questo documento descrive lo stato corrente del capstone dopo il Capitolo 10.

## Regola

> **Prima definiamo chi possiede la verità. Poi decidiamo quante copie ci servono per servirla bene.**

Una copia fisica di un dato non trasferisce automaticamente ownership semantica.

## Ownership summary

| Concept | Semantic owner | Authoritative | Order Operations usage |
|---|---|---:|---|
| Order lifecycle | Orders | sì | read |
| Commercial order status | Orders | sì | read |
| Order tenant ownership | Orders | sì | authorization context/read |
| Payment lifecycle | Payments & Risk | sì | read |
| Payment status | Payments & Risk | sì | read |
| Refund / economic idempotency | Payments & Risk | sì | non ancora command consumer |
| Shipment / fulfillment lifecycle | Shipping | sì | read |
| Shipment status | Shipping | sì | read |
| OperationalCase | Order Operations | sì | read/write |
| ProblemClassification | Order Operations | sì | read/write/derive |
| OperatorAssignment | Order Operations | sì | read/write |
| ProblematicOrderView | Order Operations | no — derived | read |

## Orders

### Authoritative concepts

- `Order`;
- `OrderId`;
- commercial lifecycle;
- commercial status;
- tenant ownership;
- order timestamps e business transitions.

Order Operations non può correggere direttamente questi valori nel proprio storage.

Se esiste una divergenza, Orders resta l'autorità.

## Payments & Risk

### Authoritative concepts

- payment lifecycle;
- payment status;
- refund;
- payment provider reference;
- economic idempotency;
- reconciliation semantics.

Order Operations può mostrare uno stato normalizzato destinato all'investigazione, ma non ridefinisce la semantica economica.

## Shipping

### Authoritative concepts

- fulfillment lifecycle;
- shipment state;
- tracking relation;
- carrier integration state.

Order Operations usa il dato per diagnosticare il journey, non per diventare owner del fulfillment.

## Order Operations

### Authoritative concepts locali

- `OperationalCase`;
- `ProblemClassification`;
- `OperatorAssignment`;
- metadata di investigazione che verranno esplicitamente introdotti;
- eventuale escalation metadata quando l'analisi funzionale lo definirà.

### Derived concepts

- `ProblematicOrderView`;
- `problemCategory` quando derivata da fatti di più domini;
- `caseAge`;
- `lastRelevantUpdate`;
- combined operational summary.

## Datastore corrente

La topologia corrente usa ancora una singola istanza PostgreSQL con ownership logica distinta.

```text
PostgreSQL
├── orders      → Orders
├── payments    → Payments & Risk
├── shipping    → Shipping
└── operations  → Order Operations
```

Il database condiviso non autorizza accessi cross-owner arbitrari.

I boundary applicativi restano la via preferita per consumare semantica di altri domini.

## Consistency / freshness corrente

### OperatorAssignment

- authoritative in Order Operations;
- conflitti concorrenti non devono sovrascriversi silenziosamente;
- read-your-writes richiesto nel journey corrente.

### Order / Payment / Shipment status

- authoritative nei domini sorgente;
- per la prima implementazione il percorso resta live secondo ADR 0001;
- un eventuale futuro dato persistito localmente sarà marcato `derived` e avrà una freshness policy esplicita.

## Projection futura — non ancora implementata

Candidate concept:

```text
ProblematicOrderProjection
- order_id
- tenant_id
- order_status
- payment_status
- shipment_status
- problem_category
- source_updated_at
- projection_updated_at
```

Questa projection verrà introdotta soltanto se trigger reali ne giustificheranno il costo.

### Trigger

- query operative impattano il workload transazionale;
- target latency non raggiunti con query/index ragionevoli;
- availability richiesta diversa dai domain store;
- più consumer richiedono la stessa vista;
- freshness tollerata rende vantaggiosa propagation asincrona;
- volume o retention cambiano sostanzialmente.

## Rebuild contract per dati derived

Quando verrà introdotta una projection, dovrà avere:

- source esplicite;
- regole di derivazione versionate o almeno identificabili;
- `source_updated_at` / freshness evidence appropriata;
- meccanismo di reconciliation;
- procedura di rebuild;
- metriche di lag/mismatch;
- comportamento definito durante degrado o rebuild.

## Quality floor

Non sono negoziabili:

- una sola autorità semantica per ogni business fact;
- tenant isolation;
- correctness economica di Payments;
- ownership commerciale di Orders;
- ownership fulfillment di Shipping;
- atomicità/concorrenza corretta per assignment;
- tracciabilità delle future azioni con side effect;
- capacità di distinguere authoritative e derived data.

## Evidenze metodologiche

- [Microsoft Learn — Prepare to choose a data store](https://learn.microsoft.com/azure/architecture/guide/technology-choices/data-stores-getting-started)
- [Microsoft Learn — Understand data models](https://learn.microsoft.com/azure/architecture/data-guide/technology-choices/understand-data-store-models)
- [PostgreSQL 18 — Concurrency Control](https://www.postgresql.org/docs/18/mvcc-intro.html)

Le fonti sostengono le proprietà e il metodo. Le decisioni specifiche di ESI restano simulate.