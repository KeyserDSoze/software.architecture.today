## Il buco tra commit e publish

Arriviamo al problema che rende necessaria la prima vera infrastruttura asincrona di Order Operations.

Vogliamo fare due cose:

1. salvare localmente che un caso è stato escalato;
2. notificare in modo affidabile Payments & Risk.

La prima implementazione potrebbe essere:

```ts
await db.transaction(async (tx) => {
  await tx.operationalCases.markEscalated(caseId);
});

await broker.publish({
  type: "OperationalCaseEscalated",
  caseId,
});
```

Sembra ragionevole.

Ma esiste una finestra:

```text
commit DB riesce
↓
process crasha
↓
publish non avviene
```

Il database dice:

```text
Escalated
```

Payments & Risk non riceve nulla.

Abbiamo creato una divergenza persistente.

## Invertire l'ordine non risolve

Potremmo pubblicare prima:

```ts
await broker.publish(event);
await db.operationalCases.markEscalated(caseId);
```

Ora il failure mode diventa:

```text
publish riesce
↓
commit DB fallisce
```

Payments & Risk riceve un evento che descrive un fatto che, nel sistema autorevole, non è avvenuto.

Abbiamo soltanto spostato il buco.

## Una distributed transaction?

In teoria potremmo cercare una transazione distribuita che coinvolga database e broker.

In pratica dobbiamo chiederci:

- entrambi i sistemi la supportano davvero?
- quale coupling operativo introduce?
- come si comporta durante network partition?
- quale latency e availability paga il request path?
- il problema giustifica questo coordinamento?

Per il nostro scenario ESI, no.

Vogliamo che la transazione locale rimanga il confine atomico.

## Transactional Outbox

Il pattern transactional outbox cambia l'unità di lavoro.

Nella stessa transazione locale scriviamo:

```text
business state
+
intention to publish
```

Per esempio:

```sql
BEGIN;

UPDATE operations.operational_case
SET status = 'Escalated',
    updated_at = now()
WHERE case_id = :case_id;

INSERT INTO operations.outbox_message (
    message_id,
    message_type,
    aggregate_id,
    payload,
    occurred_at
)
VALUES (
    :message_id,
    'OperationalCaseEscalated',
    :case_id,
    :payload,
    now()
);

COMMIT;
```

Ora abbiamo due esiti possibili:

```text
commit
→ stato + intenzione di pubblicazione esistono entrambi

rollback
→ non esiste nessuno dei due
```

Microsoft documenta il Transactional Outbox pattern proprio per evitare la perdita di eventi quando business object e publish non possono essere coordinati atomicamente attraverso datastore e broker. La guidance propone di salvare business state e outbox entry nella stessa transazione e lasciare a un processo separato il compito di pubblicare.

Fonte:

- [Microsoft Learn — Transactional Outbox pattern](https://learn.microsoft.com/azure/architecture/databases/guide/transactional-outbox-cosmos)

## Il publisher

Dopo il commit, un worker legge le entry non pubblicate:

```text
outbox
  ↓
publisher
  ↓
broker
```

Pseudo-TypeScript:

```ts
for (const message of await outbox.nextBatch(100)) {
  try {
    await broker.publish(message);
    await outbox.markPublished(message.messageId);
  } catch (error) {
    await outbox.recordFailure(message.messageId, error);
  }
}
```

Sembra semplice.

Ma compare un nuovo failure window.

## Publish succeeds, mark fails

Timeline:

```text
publisher legge msg_42
↓
broker accetta msg_42
↓
process crasha prima di markPublished
↓
publisher riparte
↓
legge ancora msg_42
↓
pubblica di nuovo
```

L'outbox evita la perdita.

Non elimina i duplicati.

Questo è un ottimo esempio di trade-off:

```text
preferiamo at-least-once publication
+
consumer idempotente

invece di

rischiare perdita silenziosa
```

## L'identità del messaggio

Ogni outbox record deve avere un'identità stabile.

Per esempio:

```text
messageId    = msg_01J...
escalationId = esc_01J...
caseId       = case_123
```

Il publisher non genera un nuovo `messageId` a ogni retry.

Sta tentando di consegnare **lo stesso messaggio**.

Questo permette a broker e consumer, quando appropriato, di deduplicare o riconoscere la redelivery.

## Event identity vs aggregate identity

Non confondiamo:

```text
caseId
```

con:

```text
messageId
```

Lo stesso case può produrre più eventi:

```text
OperationalCaseCreated
OperationalCaseAssigned
OperationalCaseEscalated
OperationalCaseClosed
```

Ogni evento ha identità propria.

La relazione con il case serve per correlation e ordering locale.

## Polling publisher o CDC?

Esistono più modi per estrarre l'outbox.

### Polling publisher

Un worker interroga la tabella periodicamente.

Vantaggi:

- semplice da capire;
- facile da testare;
- nessuna infrastruttura CDC aggiuntiva;
- buono per volumi moderati.

Costi:

- polling;
- tuning batch/interval;
- contention se implementato male;
- latency minima legata alla frequenza.

### Change Data Capture

Un meccanismo CDC osserva il transaction log e trasforma le nuove entry in messaggi.

Vantaggi:

- latency potenzialmente bassa;
- meno polling applicativo;
- throughput elevato.

Costi:

- infrastruttura aggiuntiva;
- operational knowledge;
- checkpoint e recovery;
- schema/log coupling;
- più componenti da osservare.

Per Order Operations scegliamo inizialmente **polling publisher**.

Non perché CDC sia sbagliato.

Perché il volume del flusso di escalation non giustifica ancora la sua complessità.

Fit before fashion continua a valere.

## La tabella outbox non è un event store

Altro errore frequente:

```text
abbiamo una outbox
→ abbiamo uno storico degli eventi
→ possiamo usarla come audit/event sourcing
```

No.

L'outbox ha uno scopo operativo preciso:

> garantire che l'intenzione di pubblicazione sopravviva insieme alla transazione locale.

Può avere retention breve dopo pubblicazione.

Può essere archiviata.

Può non contenere tutta la semantica necessaria per ricostruire il dominio.

Non trasformiamo un pattern di integration reliability in un modello dati universale.

## Cleanup e retention

Una outbox cresce continuamente.

Quindi dobbiamo decidere:

- quanto tenere record published;
- come eliminare o archiviare batch;
- come non bloccare il publisher durante cleanup;
- quali indici servono;
- quale informazione conservare per audit;
- come correlare un messaggio già eliminato dall'outbox con telemetry e downstream state.

Una policy plausibile potrebbe essere:

```text
pending / failed
→ conservare finché risolto

published
→ retention operativa limitata

business audit
→ conservato altrove secondo policy del dominio
```

La durata concreta verrà definita quando avremo requisiti di audit e volume reali nel capstone.

## Payload piccolo e stabile

È tentante salvare nella outbox l'intero oggetto serializzato:

```json
{"order": { ... 200 campi ... }}
```

Questo aumenta:

- coupling;
- PII exposure;
- incompatibilità;
- dimensione dei messaggi;
- difficoltà di evolution.

Per `OperationalCaseEscalated` vogliamo soltanto ciò che serve al contratto.

Esempio:

```json
{
  "messageId": "msg_01J...",
  "schemaVersion": 1,
  "type": "OperationalCaseEscalated",
  "occurredAt": "2026-09-03T13:00:00Z",
  "caseId": "case_123",
  "escalationId": "esc_456",
  "tenantRef": "tenant_789",
  "category": "Payment",
  "correlationId": "corr_abc"
}
```

Non includiamo il dettaglio del payment.

Payments & Risk possiede quella semantica.

## Security dell'outbox

L'outbox è una nuova copia di dati.

Quindi deve rientrare nel threat model.

Dobbiamo considerare:

- chi può leggere il payload;
- encryption at rest;
- logging dei payload;
- data classification;
- retention;
- accesso del publisher;
- rischio di replay malevolo;
- validation del consumer.

Non basta che sia “una tabella tecnica”.

La semantica passa da lì.

## Outbox e atomicity

La frase corretta è:

> **l'outbox rende atomici il business state locale e l'intenzione di pubblicare.**

Non:

> “rende atomico tutto il processo distribuito”.

Dopo il commit abbiamo ancora:

```text
pending
published
redelivered
processed
rejected
DLQ
```

Sono stati distribuiti da governare.

## Il nuovo compromesso ESI

Order Operations accetta:

- delivery asincrona;
- possibile duplicazione tecnica;
- un piccolo lag tra escalation locale e ricezione downstream;
- una tabella e un worker aggiuntivi.

In cambio ottiene:

- request path non dipendente dalla disponibilità di Payments;
- nessuna perdita silenziosa fra commit e publish;
- retry indipendente dalla sessione utente;
- observability del backlog;
- un punto chiaro di recovery.

Il quality floor resta:

```text
commit locale riuscito
→ intenzione di pubblicazione durable

redelivery
→ nessun side effect business duplicato
```

Questa è una proprietà architetturale molto più importante del nome del broker che useremo.