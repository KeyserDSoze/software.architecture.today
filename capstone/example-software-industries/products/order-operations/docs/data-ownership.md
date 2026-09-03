# Order Operations — Data Ownership Map

> **Scenario fittizio ESI.** Questo documento descrive lo stato corrente del capstone dopo il Capitolo 11.

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
| PaymentEscalation request | Order Operations | sì per l'intenzione locale | read/write/publish |
| PaymentEscalation downstream workflow | Payments & Risk | sì | non posseduto |
| Integration delivery state | Order Operations | sì per il proprio publish flow | read/write/operate |
| OutboxMessage | Order Operations integration mechanism | sì localmente, ma tecnico | write/publish/cleanup |
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
- reconciliation semantics economiche;
- stato del workflow interno che nasce da una Payment Escalation.

Order Operations può mostrare uno stato normalizzato destinato all'investigazione, ma non ridefinisce la semantica economica.

### Payment Escalation: confine condiviso

La richiesta di escalation nasce in Order Operations.

Quindi Order Operations è autorevole su:

```text
questa escalation è stata richiesta
chi l'ha richiesta
quando
per quale OperationalCase
con quale reasonCode
```

Payments & Risk è autorevole su:

```text
come l'escalation viene trattata
se viene accettata/rifiutata secondo le proprie regole
quale workflow economico o investigativo viene aperto
quali decisioni/payment side effect ne derivano
```

Non esiste quindi un singolo campo generico `escalation_status` condiviso da entrambi i domini senza semantica esplicita.

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
- `PaymentEscalation` come richiesta locale di attenzione;
- `EscalationId`;
- `EscalationReasonCode`;
- delivery state del proprio integration flow;
- metadata di investigazione che verranno esplicitamente introdotti.

### Derived concepts

- `ProblematicOrderView`;
- `problemCategory` quando derivata da fatti di più domini;
- `caseAge`;
- `lastRelevantUpdate`;
- combined operational summary.

### Technical integration state

Order Operations possiede anche dati tecnici necessari a garantire la propria publication reliability:

```text
OutboxMessage
PublishAttemptCount
NextAttemptAt
PublishedAt
LastPublishError
```

Questi dati non sono business truth da esporre automaticamente ad altri domini.

Servono a operare il flusso di integrazione.

## Datastore corrente

La topologia corrente usa ancora una singola istanza PostgreSQL con ownership logica distinta.

```text
PostgreSQL
├── orders      → Orders
├── payments    → Payments & Risk
├── shipping    → Shipping
└── operations  → Order Operations
    ├── operational_case
    ├── payment_escalation
    └── outbox_message
```

Il database condiviso non autorizza accessi cross-owner arbitrari.

I boundary applicativi restano la via preferita per consumare semantica di altri domini.

## Consistency / freshness corrente

### OperatorAssignment

- authoritative in Order Operations;
- conflitti concorrenti non devono sovrascriversi silenziosamente;
- read-your-writes richiesto nel journey corrente.

### PaymentEscalation

- la richiesta locale è authoritative in Order Operations;
- `PaymentEscalation + OutboxMessage` devono essere committed nella stessa transaction;
- la delivery verso Payments & Risk è asincrona;
- `Requested` non significa `ProcessedByPayments`;
- `deliveryState` descrive l'integrazione, non lo stato economico.

### Order / Payment / Shipment status

- authoritative nei domini sorgente;
- per la prima implementazione il percorso resta live secondo ADR 0001;
- un eventuale futuro dato persistito localmente sarà marcato `derived` e avrà una freshness policy esplicita.

## Event contract corrente

Order Operations pubblica:

```text
OperationalCasePaymentEscalated v1
```

Contratto:

```text
docs/events/operational-case-payment-escalated-v1.md
```

Principi:

- payload minimizzato;
- stable `messageId`;
- stable `escalationId`;
- at-least-once delivery;
- consumer idempotente;
- nessuna copia del PaymentStatus necessaria nel messaggio;
- correlation esplicita.

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

L'introduzione della prima outbox **non** è un trigger automatico per creare questa projection.

Un flusso asincrono locale non trasforma l'intero sistema in event-driven.

## Rebuild contract per dati derived

Quando verrà introdotta una projection, dovrà avere:

- source esplicite;
- regole di derivazione versionate o almeno identificabili;
- `source_updated_at` / freshness evidence appropriata;
- meccanismo di reconciliation;
- procedura di rebuild;
- metriche di lag/mismatch;
- comportamento definito durante degrado o rebuild.

## Outbox retention

La outbox non è event store né audit log universale.

Policy da definire:

```text
Pending / failed
→ retention finché risolto o escalato

Published
→ retention operativa limitata, poi cleanup/archivio secondo requisito

Business audit
→ conservato secondo policy del dominio, non affidato soltanto alla outbox
```

La durata concreta verrà definita con requisiti di audit, volume e operability.

## Quality floor

Non sono negoziabili:

- una sola autorità semantica per ogni business fact;
- tenant isolation;
- correctness economica di Payments;
- ownership commerciale di Orders;
- ownership fulfillment di Shipping;
- atomicità/concorrenza corretta per assignment;
- tracciabilità delle azioni con side effect;
- durable publication intent per escalation accettate;
- idempotency downstream per la stessa `escalationId`;
- capacità di distinguere business state, integration state, authoritative data e derived data.

## Evidenze metodologiche

- [Microsoft Learn — Prepare to choose a data store](https://learn.microsoft.com/azure/architecture/guide/technology-choices/data-stores-getting-started)
- [Microsoft Learn — Transactional Outbox](https://learn.microsoft.com/azure/architecture/databases/guide/transactional-outbox-cosmos)
- [Microsoft Learn — Idempotent Consumer pattern](https://learn.microsoft.com/azure/architecture/patterns/idempotent-consumer)
- [PostgreSQL 18 — Concurrency Control](https://www.postgresql.org/docs/18/mvcc-intro.html)

Le fonti sostengono le proprietà e il metodo. Le decisioni specifiche di ESI restano simulate.