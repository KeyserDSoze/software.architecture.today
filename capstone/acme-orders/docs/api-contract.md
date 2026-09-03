# Acme Orders — API Contract v0

> Contratto iniziale del capstone simulato/composito.

## Purpose

Esporre alla Operations UI capability di lettura necessarie a:

1. individuare ordini problematici;
2. aprire il dettaglio operativo;
3. distinguere stato ordine, pagamento e spedizione;
4. capire quale fonte possiede il dato autorevole.

Il contratto non espone accesso generico al database.

## Consumers

### Corrente

- Acme Orders Operations Web UI

### Non correnti

- partner esterni;
- mobile app;
- merchant self-service;
- agent autonomi che eseguono remediation.

Se uno di questi consumer diventerà reale, il contratto dovrà essere rivalutato.

## Interaction style

HTTP request/response con rappresentazioni JSON.

Motivo:

- journey interattivo;
- read-oriented;
- nessun requisito attuale di streaming bidirezionale;
- nessun requisito attuale di temporal decoupling per queste letture.

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

Quando il capstone introdurrà tenancy o merchant isolation, questa regola diventerà esplicita nel modello di authorization.

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

`category` è un filtro funzionale candidato, non un accesso arbitrario a qualsiasi colonna.

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

## Error model

Le API HTTP useranno, quando serve dettaglio applicativo, `application/problem+json` coerente con RFC 9457.

Fonte:

- [RFC 9457 — Problem Details for HTTP APIs](https://www.rfc-editor.org/rfc/rfc9457.html)

Classi iniziali:

```text
401 unauthenticated
403 unauthorized
404 order not found / not visible
400 invalid request
429 rate limited — quando un rate policy reale verrà definita
503 required dependency unavailable — se non è possibile produrre una vista affidabile
```

Esempio:

```json
{
  "type": "https://acme.example/problems/order-not-visible",
  "title": "Order is not visible",
  "status": 403,
  "detail": "The current operator cannot access this order."
}
```

Il problem detail non deve contenere stack trace o dettagli sensibili dell'infrastruttura.

## Freshness

La prima implementazione usa dati operativi live secondo ADR 0001.

Non esiste ancora un read model asincrono.

Questo contratto non promette una freshness numerica finché non viene definita e misurata una requirement reale.

## Timeout expectations

Da definire quando esisteranno ambiente e workload misurabili.

L'API non deve attendere indefinitamente una dipendenza.

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
- modifica del comportamento di pagination.

Preferire additive change quando semanticamente compatibili.

## Open decisions

- definizione definitiva delle problem category;
- sorting della lista;
- default `limit` e massimo;
- correlation/trace header convention;
- modello definitivo di identity e authorization;
- eventuale ETag/conditional request;
- eventuali command API per remediation;
- event/webhook contract futuri.

## Decisione importante

In questa versione **non esponiamo ancora comandi di refund, retry payment o shipment remediation**.

La ragione non è tecnica.

L'analisi funzionale non ha ancora definito abbastanza bene:

- attori autorizzati;
- precondizioni;
- stati validi;
- side effect;
- idempotency unit;
- audit;
- escalation.

Il contratto non deve inventare semantica che il prodotto non ha ancora deciso.