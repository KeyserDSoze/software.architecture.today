## ESI — Order Operations introduce la prima integrazione asincrona

Applichiamo ora il capitolo al capstone. Non partiamo dalla queue, dal broker o dall’outbox. Partiamo dal cambiamento funzionale.

Operations e Payments & Risk concordano una nuova capability: un operatore autorizzato può **escalare a Payments & Risk** un `OperationalCase` classificato come `Payment` quando l’investigazione richiede l’intervento del dominio economico.

L’escalation non esegue refund, capture, retry del provider, modifica del payment status o chargeback. Trasferisce una richiesta di attenzione. Payments & Risk rimane owner delle decisioni economiche e del proprio workflow interno.

Questa distinzione è il confine che rende sensato tutto il design successivo.

## Payment Escalation: un nuovo concetto di dominio

Introduciamo `PaymentEscalation` come intenzione esplicita dell’operatore. Possiede `EscalationId`, `OperationalCaseId`, tenant reference, `RequestedBy`, `RequestedAt`, `ReasonCode` e lo stato necessario a rappresentarne il lifecycle locale e la delivery.

Non possiede `PaymentStatus`, `RefundStatus`, provider state o decisioni economiche. Questi restano di Payments & Risk.

Le precondizioni iniziali sono semplici ma importanti: il caso deve esistere, essere visibile all’operatore e avere categoria `Payment`; l’utente deve essere autorizzato; non deve esistere un’intenzione incompatibile già attiva; un retry tecnico della stessa richiesta deve conservare la stessa identity. La business rule potrà evolvere in futuro, ma non viene inventata dal protocollo.

## Business state e integration state restano separati

Quando l’operatore invia l’escalation, il sistema può conoscere con certezza il fatto locale prima della consegna downstream. Per questo modelliamo separatamente:

```text
PaymentEscalation.status = Requested
IntegrationDelivery.state = Pending
```

Poi la delivery potrà diventare `Delivered`, `Delayed` o, nei failure terminali, `DeadLettered`. Un broker outage non annulla retroattivamente il fatto che Order Operations abbia accettato l’intenzione.

Questa distinzione permette alla UI di dire la verità: “escalation accepted” non significa ancora “Payments ha iniziato a lavorarla”.

## Perché il request path non chiama Payments

Una chiamata sincrona sarebbe più semplice da disegnare, ma legherebbe l’azione dell’operatore a availability, latency, timeout e retry ambiguity di Payments. Il requirement invece ci dice che l’intenzione locale deve poter essere registrata anche quando il downstream è degradato, purché la consegna affidabile continui in background.

Scegliamo quindi:

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

Il nuovo costo — outbox, publisher, retry, backlog, DLQ e reconciliation — compra una proprietà precisa: **indipendenza temporale tra l’azione dell’operatore e la disponibilità runtime del downstream**.

## Il broker resta una decisione successiva

Platform Engineering offre una capability aziendale di messaging, ma in questo capitolo non fissiamo ancora un prodotto. Il contract richiesto è più importante del vendor: durable publication, at-least-once delivery, dead-letter capability, consumer concurrency controls, message identity e observability.

Kafka, Azure Service Bus, SQS/SNS, Pub/Sub o RabbitMQ rappresentano implementazioni possibili con trade-off differenti. Il cloud context del Capitolo 12 ci darà più informazioni per scegliere.

Fit before fashion vale anche qui.

## Transaction boundary e schema locale

La stessa transazione PostgreSQL salva `PaymentEscalation` e `OutboxMessage`. Non salva direttamente alcuno stato economico di Payments.

Concettualmente:

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

`PaymentEscalation` appartiene al prodotto. `OutboxMessage` appartiene al meccanismo di reliability. È importante non confondere business state e integration mechanism anche quando vivono nella stessa transazione.

## Event contract: minimizzare il significato condiviso

La prima versione del messaggio contiene soltanto ciò che Payments & Risk deve conoscere per ricevere l’intenzione in modo affidabile:

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

Non includiamo address, customer email, shipment detail, note libere, ORM representation, stack trace o provider credential. Il consumer può recuperare altro contesto tramite contract autorizzati se davvero necessario.

La minimizzazione riduce data exposure, coupling e blast radius dell’evoluzione dello schema.

## La promessa del producer

Order Operations promette una cosa molto precisa:

```text
escalation accettata localmente
→ publication intent durevole nella stessa transazione
```

Non promette che Payments l’abbia già ricevuta quando l’API risponde. Per questo il command HTTP può restituire uno stato simile a:

```http
POST /api/operational-cases/{caseId}/payment-escalations
Idempotency-Key: <escalation-id>
```

```json
{
  "escalationId": "esc_456",
  "status": "Requested",
  "deliveryState": "Pending"
}
```

Questa semantica aggiorna il contratto API del capstone: il Capitolo 9 aveva volutamente fermato i command con side effect finché l’analisi funzionale non fosse abbastanza chiara. Ora abbiamo quella chiarezza per **escalare**, non per fare remediation economica.

## La promessa del consumer

Payments & Risk deve trattare `escalationId` come identity dell’intenzione. Una redelivery della stessa identity non deve creare un secondo workflow business.

L’implementazione concreta può usare inbox/deduplication storage o un’altra strategia compatibile con il proprio boundary. Il requisito architetturale è indipendente dal dettaglio:

> **la stessa escalation consegnata più volte produce un solo effetto business osservabile.**

## Retry, ordering e business timeout

Publisher e consumer useranno retry bounded per failure transitori, con backoff e jitter dove appropriato. Deterministic validation failure non verrà martellata ciecamente; dopo l’esaurimento della recovery automatica il messaggio entrerà nel percorso dead-letter.

Non fissiamo numeri universali prima di avere baseline e commitment. Separiamo inoltre il retry budget tecnico dal business delivery target: un messaggio può avere ancora retry disponibili ma aver già superato la soglia oltre la quale Operations deve vedere `Delayed`.

Non chiediamo ordering globale. Per questo primo messaggio identity e idempotency sono sufficienti. Se in futuro più eventi dello stesso case avranno dipendenze d’ordine, introdurremo key/version soltanto sulla granularità necessaria.

## Failure Mode Map del nuovo flusso

Il flow è:

```text
Operator
→ Order Operations transaction
→ Outbox
→ Publisher
→ Broker
→ Payments Consumer
→ Payments local state
```

I failure che guidano il design sono quelli già discussi: validation o transaction failure prima del commit; broker unavailable con outbox pending; ack publish perso con possibile redelivery; Payments DB unavailable; consumer crash dopo il commit; schema incompatibile; retry esauriti e DLQ.

Il punto più importante è che ciascuno lascia uno stato diverso e richiede un recovery diverso. Una Failure Mode Map dedicata nel capstone conserva questo reasoning operativo.

## Reconciliation e quality floor

Order Operations deve poter trovare escalation `Requested` che non risultano consegnate oltre la soglia prevista. Quando esisterà un acknowledgement applicativo downstream, potremo confrontare identity accettate localmente e identity osservate da Payments.

Non negoziamo tenant isolation, stable escalation identity, atomicità fra escalation e publication intent, consumer idempotente, payload minimizzato, correlation end-to-end, DLQ con owner e visibilità sul delivery lag. E soprattutto Order Operations non acquisisce alcuna autorità economica soltanto perché ha introdotto un flusso verso Payments.

Accettiamo invece eventual consistency, outbox, publisher, delivery state, backlog monitoring e reconciliation. È più complesso di una chiamata HTTP, ma la complessità svolge un lavoro preciso.

> **Stiamo pagando asincronia per comprare indipendenza temporale e delivery affidabile, non per rendere il diagramma più moderno.**

## Il capstone evolve davvero

Da questo capitolo lo snapshot vivo di Order Operations contiene il nuovo contratto API, la Data Ownership Map aggiornata, l’event contract, il modello outbox e la Failure Mode Map. I capitoli successivi potranno quindi ragionare su un progetto che ha già un vero flusso distribuito, non su un esempio ripetuto da zero.

Order Operations non è diventato “event-driven”. Ha introdotto **un flusso asincrono nel punto in cui il contesto lo giustifica**. Questa distinzione resta importante.