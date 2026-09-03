# Order Operations — API Contract v1

> Contratto corrente del capstone simulato/composito di Example Software Industries S.p.A.

## Purpose

Esporre alla Operations UI capability necessarie a:

1. individuare ordini problematici;
2. aprire il dettaglio operativo;
3. distinguere stato ordine, pagamento e spedizione;
4. capire quale fonte possiede il dato autorevole;
5. richiedere una escalation verso Payments & Risk senza eseguire direttamente side effect economici.

Il contratto non espone accesso generico al database.

## Consumers

### Corrente

- Order Operations Web UI

### Non correnti

- partner esterni;
- mobile app;
- merchant self-service;
- agent autonomi che eseguono remediation.

Se uno di questi consumer diventerà reale, il contratto dovrà essere rivalutato.

## Interaction style

HTTP request/response con rappresentazioni JSON per l'interazione UI.

La nuova Payment Escalation viene accettata nel request path locale e consegnata in modo asincrono a Payments & Risk tramite transactional outbox e messaging capability.

## Base path

```text
/api
```

Nessuna major version esplicita nella prima iterazione.

La compatibility policy privilegia modifiche backward-compatible. Una versione verrà introdotta quando una breaking change reale la renderà necessaria.

## Authentication

Tutte le operazioni richiedono identità autenticata.

Il meccanismo concreto verrà definito nel capitolo Security/Identity.

## Authorization

Il consumer deve operare nel contesto di un utente Operations autorizzato.

La risposta non deve includere dati fuori dal perimetro autorizzato dell'utente.

La Payment Escalation richiede inoltre un ruolo/capability Operations autorizzato a escalare casi di pagamento; il modello definitivo di RBAC/ABAC verrà definito nel capitolo Security.

---

## Operation 1 — List problematic orders

```http
GET /api/problematic-orders
```

### Intent

Restituire una collection di ordini che richiedono attenzione operativa secondo le business rule correnti.

### Query parameters iniziali

```text
cursor      optional
limit       optional
category    optional
```

`category` è un filtro funzionale, non un accesso arbitrario a qualsiasi colonna.

### Response — 200

```json
{
  "items": [
    {
      "orderId": "ORD-42",
      "orderStatus": "Processing",
      "paymentStatus": "Failed",
      "shipmentStatus": "NotReady",
      "problemCategory": "Payment",
      "lastRelevantUpdateAt": "2026-09-03T08:15:00Z"
    }
  ],
  "nextCursor": "opaque-cursor-or-null"
}
```

### Semantica

- `problemCategory` è una classificazione operativa derivata;
- `orderStatus`, `paymentStatus` e `shipmentStatus` restano semanticamente distinti;
- il cursor è opaco per il consumer;
- l'assenza di `nextCursor` indica che non esistono altre pagine nel contesto corrente.

### Side effects

Nessuno intenzionale.

### Idempotency

`GET` è safe/idempotent secondo la semantica HTTP.

Fonte:

- [RFC 9110 — HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html)

---

## Operation 2 — Get operational order view

```http
GET /api/orders/{orderId}/operational-view
```

### Intent

Restituire le informazioni necessarie a investigare un ordine senza esporre dettagli inutili dell'implementazione interna.

### Response — 200

```json
{
  "orderId": "ORD-42",
  "order": {
    "status": "Processing"
  },
  "payment": {
    "status": "Failed",
    "lastUpdatedAt": "2026-09-03T08:14:30Z"
  },
  "shipment": {
    "status": "NotReady",
    "lastUpdatedAt": "2026-09-03T08:14:10Z"
  },
  "problem": {
    "category": "Payment",
    "summary": "Payment requires operator attention"
  }
}
```

### Regola

La rappresentazione API modella significato funzionale. Non deve esporre direttamente table name, numeric state code o dettagli ORM.

Riferimento metodologico:

- [Microsoft Learn — API design](https://learn.microsoft.com/azure/architecture/microservices/design/api-design)

---

## Operation 3 — Request payment escalation

```http
POST /api/operational-cases/{caseId}/payment-escalations
Idempotency-Key: <escalation-id>
```

### Intent

Registrare una richiesta di attenzione verso Payments & Risk per un `OperationalCase` classificato come problema di pagamento.

Questa operazione **non** esegue refund, capture, retry provider o modifica dello stato economico.

### Idempotency

L'header `Idempotency-Key` rappresenta la stessa intenzione business della Payment Escalation.

Nel modello corrente coincide concettualmente con `escalationId`.

Un retry della stessa intenzione deve riusare la stessa key.

Un nuovo intento futuro deve usare una nuova key soltanto se la business rule consente una nuova escalation.

Riferimento metodologico:

- [Amazon Builders' Library — Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/)

### Preconditions iniziali

- `caseId` esiste ed è visibile all'operatore;
- `problemCategory = Payment`;
- l'operatore è autorizzato a escalare;
- non esiste già una Payment Escalation attiva incompatibile con il nuovo intento;
- la richiesta non modifica dati posseduti da Payments & Risk.

### Request body

```json
{
  "reasonCode": "PaymentInvestigationRequired"
}
```

La v1 non accetta note libere nel message payload downstream.

Se in futuro verranno introdotte note operative, retention, security e visibility dovranno essere definite separatamente.

### Response — 202 Accepted

```json
{
  "escalationId": "433856b8-79ac-4c16-b28d-7037679eca89",
  "caseId": "a5d9cbcb-58b2-46f6-b7af-45078c16dcb8",
  "status": "Requested",
  "deliveryState": "Pending",
  "requestedAt": "2026-09-03T13:00:00Z"
}
```

### Perché `202`

La richiesta è stata accettata localmente e persistita con la propria intenzione di pubblicazione.

`202` **non** significa che Payments & Risk abbia già elaborato l'escalation.

La delivery è asincrona.

### Local transaction

La stessa transazione PostgreSQL deve persistere:

```text
PaymentEscalation
+
OutboxMessage
```

Se la transazione fallisce, nessuna delle due deve risultare committed.

### Downstream event

Contratto persistente:

```text
docs/events/operational-case-payment-escalated-v1.md
```

Event type:

```text
OperationalCasePaymentEscalated
```

Delivery semantics:

```text
at-least-once
```

Il consumer Payments & Risk deve usare `escalationId` per idempotency/deduplication.

### Delivery state

La risposta separa:

```text
status = Requested
```

da:

```text
deliveryState = Pending | Delivered | Delayed | DeadLettered
```

Il primo è stato funzionale locale.

Il secondo descrive la consegna dell'integrazione.

### Retry del client

Se il client perde la risposta o va in timeout, può ripetere la richiesta **con la stessa `Idempotency-Key`**.

Il server non deve creare una seconda escalation per lo stesso intento.

### Error cases candidati

```text
400 invalid reason/input
401 unauthenticated
403 unauthorized / tenant not visible
404 operational case not found or not visible
409 incompatible existing escalation / business state conflict
422 case not eligible for payment escalation
429 rate limited — quando la policy reale verrà definita
503 local persistence unavailable
```

Il broker/downstream indisponibile **dopo** che l'intenzione è stata durabilmente registrata non deve trasformare retroattivamente l'operazione locale in un `503`.

La delivery rimane `Pending/Delayed` e segue la Failure Mode Map.

---

## Error model

Le API HTTP useranno, quando serve dettaglio applicativo, `application/problem+json` coerente con RFC 9457.

Fonte:

- [RFC 9457 — Problem Details for HTTP APIs](https://www.rfc-editor.org/rfc/rfc9457.html)

Classi iniziali:

```text
401 unauthenticated
403 unauthorized
404 resource not found / not visible
400 invalid request
409 state/idempotency conflict
422 semantically ineligible operation
429 rate limited — quando un rate policy reale verrà definita
503 required local dependency unavailable
```

Esempio:

```json
{
  "type": "https://esi.example/problems/case-not-visible",
  "title": "Operational case is not visible",
  "status": 403,
  "detail": "The current operator cannot access this operational case."
}
```

Il dominio `.example` è usato come placeholder documentale, non rappresenta un endpoint reale.

Il problem detail non deve contenere stack trace o dettagli sensibili dell'infrastruttura.

## Freshness

Le read API usano ancora dati operativi live secondo ADR 0001.

La Payment Escalation introduce eventual consistency **solo per la delivery verso Payments & Risk**.

Non esiste ancora un read model asincrono di Order/Payment/Shipment status.

## Timeout expectations

I timeout concreti verranno definiti quando esisteranno runtime e workload misurabili.

Regole già definite:

- nessuna chiamata remota attende indefinitamente;
- il broker/downstream non appartiene al critical request path del command di escalation dopo il commit locale;
- retry e business delivery budget sono separati.

## Pagination

La collection usa cursor pagination come direzione iniziale.

Il cursor è un dettaglio opaco del contratto e non deve essere interpretato dal consumer.

## Rate limits

Non ancora quantificati.

Un limite reale verrà introdotto con:

- scope;
- unità di consumo;
- risposta al superamento;
- eventuale retry guidance.

## Compatibility rules

Considerare breaking, salvo prova contraria:

- rimozione o rename di field;
- cambio di tipo;
- modifica del significato di enum/status;
- introduzione di required input;
- modifica osservabile di authorization;
- cambiamento sostanziale di freshness/consistency;
- modifica del comportamento di pagination;
- modifica della semantica di idempotency;
- trasformazione di `202 accepted locally` in promessa di processing downstream sincrono.

Preferire additive change quando semanticamente compatibili.

## Compromesso corrente

**Esigenza:** registrare rapidamente una escalation e consegnarla affidabilmente a Payments & Risk.

**Tensione:** latency/availability del request path vs consistency immediata con il downstream.

**Decisione:** local transaction + transactional outbox + delivery asincrona at-least-once.

**Costo accettato:** eventual consistency, stato `Pending/Delayed`, publisher, retry, DLQ e reconciliation.

**Quality floor:** nessuna perdita silenziosa dopo local commit; nessun side effect downstream duplicato per lo stesso `escalationId`; ownership economica resta a Payments & Risk.

**Guardrail:** Idempotency-Key, outbox, event contract, Failure Mode Map, DLQ ownership e reconciliation.

## Open decisions

- sorting della lista ordini problematici;
- default `limit` e massimo;
- correlation/trace header convention definitiva;
- modello definitivo di identity e authorization;
- eventuale ETag/conditional request;
- acknowledgement applicativo da Payments & Risk;
- lifecycle completo di Payment Escalation (`Accepted`, `Rejected`, `Closed`?);
- business delivery target;
- broker/cloud product;
- retention outbox e DLQ;
- eventuali altri command API di remediation.

## Decisione importante

Il Capitolo 11 introduce **Payment Escalation**, non remediation economica.

Restano fuori:

- refund;
- retry payment;
- force payment transition;
- shipment remediation.

Queste azioni richiedono ancora analisi funzionale specifica su:

- ownership;
- precondizioni;
- permission;
- side effect;
- idempotency economica;
- audit;
- compensation;
- irreversible steps;
- human approval.

Il contratto continua a non inventare semantica che il prodotto non ha ancora deciso.