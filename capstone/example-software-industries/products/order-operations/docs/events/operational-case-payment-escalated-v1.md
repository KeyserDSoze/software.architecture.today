# Event Contract — OperationalCasePaymentEscalated v1

> **Scenario fittizio ESI.** Primo event contract persistente di Order Operations.

## Purpose

Comunicare che un operatore autorizzato ha richiesto a **Payments & Risk** di prendere in carico un problema operativo di pagamento collegato a un `OperationalCase`.

L'evento non ordina un refund e non modifica lo stato economico.

## Producer

`Order Operations`

## Intended consumer iniziale

`Payments & Risk`

Altri consumer futuri non sono implicitamente autorizzati a usare il messaggio per nuovi side effect business senza una decisione esplicita.

## Delivery semantics

```text
at-least-once
```

La redelivery è prevista.

Il consumer deve trattare `escalationId` come identità stabile dell'intenzione business e deve rendere innocua la rielaborazione della stessa escalation.

## Message identity

```text
messageId
```

Identifica questa specifica pubblicazione/event record.

Il publisher mantiene lo stesso `messageId` durante i retry della stessa outbox entry.

## Business operation identity

```text
escalationId
```

Identifica la richiesta di escalation.

Una redelivery con lo stesso `escalationId` non deve creare un secondo workflow Payments.

## Schema v1

```json
{
  "messageId": "9b02e1ee-3128-4de2-92bf-e2ac3e9e6f79",
  "type": "OperationalCasePaymentEscalated",
  "schemaVersion": 1,
  "occurredAt": "2026-09-03T13:00:00Z",
  "caseId": "a5d9cbcb-58b2-46f6-b7af-45078c16dcb8",
  "escalationId": "433856b8-79ac-4c16-b28d-7037679eca89",
  "tenantRef": "tenant_789",
  "reasonCode": "PaymentInvestigationRequired",
  "correlationId": "corr_abc"
}
```

Gli ID sono esempi fittizi.

## Field semantics

### messageId

Identità tecnica stabile del messaggio.

### type

Deve essere:

```text
OperationalCasePaymentEscalated
```

### schemaVersion

Versione del contratto del messaggio.

La v1 usa il valore `1`.

### occurredAt

Timestamp UTC in cui l'escalation è stata accettata nella transazione locale di Order Operations.

Non rappresenta il momento in cui Payments ha ricevuto o processato il messaggio.

### caseId

Identificativo dell'`OperationalCase` posseduto da Order Operations.

### escalationId

Identità business della richiesta di escalation.

È la chiave primaria per idempotency/deduplication downstream.

### tenantRef

Riferimento scoped al tenant necessario a preservare il contesto di authorization e routing.

Non è un invito a includere dati customer aggiuntivi nel messaggio.

### reasonCode

Codice funzionale controllato.

Versione iniziale:

```text
PaymentInvestigationRequired
```

L'estensione della lista richiede aggiornamento dell'analisi funzionale.

### correlationId

Permette di correlare request HTTP, local transaction, outbox publish e processing downstream.

Non sostituisce `messageId` o `escalationId`.

## Payload minimization

La v1 non include:

- `PaymentStatus`;
- provider payload;
- customer email;
- address;
- shipment details;
- note libere dell'operatore;
- stack trace;
- token o credential;
- intero Order DTO.

Payments & Risk rimane autorevole per la semantica economica.

## Ordering

La v1 non richiede ordering globale.

Se in futuro lo stesso `OperationalCase` pubblicherà più eventi che richiedono ordine relativo, verranno valutati:

```text
caseId come partition/order key
caseVersion monotona
stale-event rejection
```

Non introduciamo oggi una garanzia che nessun consumer richiede.

## Compatibility

Per la v1 preferire modifiche additive.

Considerare breaking, salvo prova contraria:

- rename/rimozione field;
- modifica del significato di `reasonCode`;
- modifica dell'identità business di `escalationId`;
- cambiamento delle expectation di idempotency;
- cambiamento delle regole di tenant scoping;
- riuso dello stesso event type per rappresentare un fatto diverso.

## Failure behavior

### Redelivery

Attesa e supportata.

### Unsupported schema

Il consumer non deve fare retry cieco indefinito.

Il messaggio deve seguire la failure policy/DLQ del canale e generare un segnale operativo.

### Downstream unavailable

Retry bounded con backoff secondo la policy del consumer/broker.

### Business rejection

Una rejection funzionale non deve essere trattata come transient infrastructure failure.

Deve produrre uno stato o un evento funzionale esplicito quando la semantica verrà definita.

## Security

- payload minimizzato;
- accesso al canale secondo least privilege;
- producer autorizzato alla pubblicazione;
- consumer autorizzato alla lettura;
- nessun segreto nel payload;
- logging del payload soggetto a data classification;
- replay/redrive controllato.

## Evidence

- [Microsoft Learn — Idempotent Consumer pattern](https://learn.microsoft.com/azure/architecture/patterns/idempotent-consumer)
- [Microsoft Learn — Choreography pattern](https://learn.microsoft.com/azure/architecture/patterns/choreography)
- [Amazon Builders' Library — Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/)

Queste fonti sostengono delivery/idempotency/evolution principles. Il contratto ESI è simulato.