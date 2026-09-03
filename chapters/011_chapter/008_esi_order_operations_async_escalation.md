## ESI — Order Operations introduce la prima integrazione asincrona

Applichiamo il capitolo al capstone.

Non partiamo dalla queue.

Partiamo dal cambiamento funzionale.

## Nuova esigenza

Operations e Payments & Risk concordano una nuova capability:

> un operatore autorizzato può **escalare a Payments & Risk** un `OperationalCase` classificato come `Payment` quando l'investigazione richiede l'intervento del dominio economico.

Questa azione non esegue:

- refund;
- capture;
- retry del payment provider;
- modifica del payment status;
- chargeback;
- altra operazione economica.

L'escalation trasferisce una richiesta di attenzione.

Payments & Risk decide il proprio workflow interno.

Questa distinzione protegge il confine definito nei capitoli precedenti.

## Semantica funzionale

Introduciamo un nuovo concetto:

### Payment Escalation

Rappresenta l'intenzione esplicita di un operatore di richiedere a Payments & Risk la presa in carico di un problema operativo collegato a un caso.

Possiede:

```text
EscalationId
OperationalCaseId
TenantId / tenant reference
Category
RequestedBy
RequestedAt
ReasonCode
DeliveryState
```

Non possiede:

```text
PaymentStatus
RefundStatus
PaymentProviderState
EconomicDecision
```

Questi restano di Payments & Risk.

## Precondizioni iniziali

Per questa iterazione:

1. il caso deve esistere;
2. l'operatore deve essere autorizzato sul tenant;
3. il caso deve avere `ProblemClassification = Payment`;
4. deve esistere al massimo una escalation attiva per lo stesso caso e stesso intento;
5. un retry tecnico della stessa richiesta deve conservare lo stesso `EscalationId`;
6. l'escalation non modifica il payment status.

La regola 4 verrà raffinata se in futuro il business permetterà escalation successive dopo una chiusura o una rejection.

## Stati distinti

Separiamo il business state dell'escalation dal delivery state.

Esempio:

```text
PaymentEscalation
  status = Requested

IntegrationDelivery
  state = Pending
```

Poi:

```text
PaymentEscalation
  status = Requested

IntegrationDelivery
  state = Delivered
```

Oppure:

```text
PaymentEscalation
  status = Requested

IntegrationDelivery
  state = Delayed
```

Questo evita che un problema tecnico del broker cambi retroattivamente il fatto che l'operatore abbia richiesto l'escalation.

## Perché non facciamo una chiamata sincrona

Commerce & Operations vorrebbe un'interazione rapida.

Payments & Risk vuole delivery affidabile.

La disponibilità runtime di Payments non deve diventare requisito per registrare l'intenzione locale.

Quindi non scegliamo:

```text
POST Order Operations
  → commit locale
  → HTTP Payments
  → response all'operator
```

perché il request path diventerebbe dipendente da:

- availability Payments;
- network latency;
- timeout policy;
- retry ambiguity.

Scegliamo:

```text
Operator
  ↓
Order Operations API
  ↓
PostgreSQL transaction
  ├── PaymentEscalation
  └── OutboxMessage
  ↓ commit
response: escalation accepted

background
Outbox Publisher
  ↓
Enterprise messaging capability
  ↓
Payments & Risk consumer
```

Il prodotto può così distinguere:

```text
accepted locally
≠
delivered downstream
```

## Non scegliamo ancora il broker

Platform Engineering offre una capability di messaging aziendale.

Nel manoscritto non fissiamo ancora un prodotto concreto.

Potrebbe essere implementata con un managed queue/topic service nel cloud che sceglieremo nel Capitolo 12.

Questa scelta è intenzionale.

Il contract che ci serve oggi è:

```text
durable publication
at-least-once delivery
dead-letter capability
consumer concurrency controls
message identity
observability
```

Non:

```text
Kafka
Service Bus
SQS/SNS
Pub/Sub
RabbitMQ
```

Il prodotto concreto verrà scelto quando avremo cloud context e operational constraints sufficienti.

## Transaction boundary

Nella stessa transazione PostgreSQL salviamo:

```text
payment escalation
+
outbox message
```

Non salviamo direttamente lo stato Payments.

Schema concettuale:

```text
operations.payment_escalation
- escalation_id
- case_id
- tenant_id
- reason_code
- requested_by
- requested_at
- delivery_state
- delivered_at nullable

operations.outbox_message
- message_id
- message_type
- aggregate_type
- aggregate_id
- payload_json
- occurred_at
- published_at nullable
- attempt_count
- last_error nullable
```

`delivery_state` è utile al prodotto.

`outbox_message` è un meccanismo di integration reliability.

Non confondiamo i due.

## Event contract

Prima versione:

```json
{
  "messageId": "msg_01J...",
  "type": "OperationalCasePaymentEscalated",
  "schemaVersion": 1,
  "occurredAt": "2026-09-03T13:00:00Z",
  "caseId": "case_123",
  "escalationId": "esc_456",
  "tenantRef": "tenant_789",
  "reasonCode": "PaymentInvestigationRequired",
  "correlationId": "corr_abc"
}
```

### Perché non includiamo tutto l'ordine

Payments & Risk non ha bisogno di:

- address;
- customer email;
- shipment details;
- note libere dell'operatore;
- ORM representation;
- stack trace;
- payment provider credentials.

Il consumer può usare gli identifier e i contract autorizzati per recuperare ciò che gli serve.

Questo riduce:

- data exposure;
- schema coupling;
- payload size;
- accidental ownership.

## Producer semantics

Order Operations promette:

```text
se l'escalation viene accettata localmente
allora esiste durablemente anche l'intenzione di pubblicare
```

Non promette:

```text
Payments l'ha già ricevuta quando la UI vede 200/202
```

Il contratto HTTP dovrà riflettere questa distinzione quando aggiungeremo il command endpoint.

Una risposta plausibile potrebbe essere:

```http
POST /api/operational-cases/{caseId}/payment-escalations
Idempotency-Key: esc_456
```

con:

```json
{
  "escalationId": "esc_456",
  "status": "Requested",
  "deliveryState": "Pending"
}
```

Non implementiamo ancora l'endpoint completo nel capitolo API perché questa semantica nasce adesso.

Aggiorniamo però il capstone contract.

## Consumer semantics

Payments & Risk deve trattare `escalationId` come identity dell'intenzione.

Pseudo-logic:

```ts
if (await processedEscalations.exists(message.escalationId)) {
  return Ack.success();
}

await db.transaction(async (tx) => {
  await tx.paymentEscalationInbox.insertIfAbsent({
    escalationId: message.escalationId,
    caseId: message.caseId,
  });

  await tx.workflow.createFromEscalation(...);
});
```

Il dettaglio reale dipenderà dall'implementazione Payments & Risk, che non è il capstone principale.

Ci interessa la promessa:

> **la redelivery dello stesso `escalationId` non crea un secondo workflow business.**

## Retry policy

Non fissiamo numeri come standard universali.

Per lo scenario ESI definiamo una policy iniziale da validare:

```text
publisher
- retry bounded
- exponential backoff + jitter
- same messageId

consumer
- retry transient failure
- deterministic validation failure → no blind retry
- retries exhausted → DLQ

business delivery target
- definito separatamente dal numero di retry
```

Il target di delivery verrà misurato dopo l'implementazione.

Non inventiamo un SLA numerico senza baseline o commitment business.

## Ordering

Non chiediamo ordering globale.

Per questa singola escalation:

```text
message identity + idempotency
```

è sufficiente.

Se in futuro pubblicheremo più eventi sullo stesso `OperationalCase`, introdurremo:

```text
caseId partition/order key
caseVersion
```

soltanto se il consumer richiede davvero di applicarli in sequenza.

## Failure Mode Map — prima versione

### Flow

```text
Operator
→ Order Operations transaction
→ Outbox
→ Publisher
→ Broker
→ Payments Consumer
→ Payments local state
```

### Failure principali

| Failure | Stato Order Operations | Impatto | Recovery |
|---|---|---|---|
| validation fallisce | nessuna escalation | operatore riceve rejection | correggere input/condizione |
| DB transaction fallisce | nessuna escalation/outbox | action non accettata | retry sicuro con stesso intent |
| broker unavailable | escalation + outbox pending | delivery ritardata | publisher retry |
| ack publish perso | outbox forse pending, broker può avere msg | possibile duplicate | same messageId + idempotent consumer |
| Payments DB unavailable | msg redeliverable | delivery lag | retry bounded |
| consumer crash dopo commit | Payments può avere già workflow | redelivery | dedup escalationId |
| schema non supportato | message non processato | integration failure | DLQ + alert |
| retry esauriti | DLQ | escalation non consegnata | operator/owner visibility + controlled redrive |

## Reconciliation

Introduciamo anche un controllo fuori banda:

```text
Order Operations escalation Requested
AND delivery not confirmed beyond threshold
→ reconciliation candidate
```

Quando avremo un acknowledgement applicativo da Payments, potremo confrontare:

```text
escalationId requested
vs
escalationId observed downstream
```

Il protocollo concreto sarà definito insieme al consumer.

## Quality floor

Non negoziamo:

- tenant isolation;
- stable escalation identity;
- nessuna perdita tra local commit e publication intent;
- nessun side effect downstream duplicato per la stessa intenzione;
- payload minimizzato;
- correlation end-to-end;
- DLQ con owner;
- possibilità di sapere che la delivery è in ritardo;
- nessuna modifica economica diretta da parte di Order Operations.

## Costo accettato

Accettiamo:

- eventual consistency;
- nuova tabella outbox;
- publisher worker;
- stato di delivery;
- monitoraggio backlog;
- gestione DLQ;
- reconciliation.

È più complesso di una chiamata HTTP.

Ma questa volta la complessità ha un lavoro preciso.

> **Stiamo pagando asincronia per comprare indipendenza temporale e delivery affidabile, non per rendere il diagramma più moderno.**

## Trigger di revisione

Rivalutare la soluzione se:

- il volume rende inefficiente il polling publisher;
- più producer richiedono una piattaforma event-driven condivisa più ricca;
- servono replay e retention di lungo periodo;
- ordering per entity diventa significativo;
- il broker scelto non soddisfa i recovery requirement;
- il workflow Payments diventa multi-step e richiede stato/compensation espliciti;
- il delivery lag supera ripetutamente il business target;
- la DLQ richiede interventi frequenti;
- la reconciliation trova mismatch non occasionali.

## Il passo importante

Order Operations non è diventato “event-driven”.

Ha introdotto **un flusso asincrono dove il contesto lo richiede**.

Questa è una distinzione che vale la pena conservare per tutto il libro.