## Il buco tra commit e publish

La prima vera esigenza asincrona di Order Operations nasce da un problema molto concreto: dobbiamo registrare localmente una Payment Escalation e notificare in modo affidabile Payments & Risk.

La soluzione più ovvia è fare prima il commit e poi pubblicare:

```ts
await db.transaction(async (tx) => {
  await tx.paymentEscalations.create(escalation);
});

await broker.publish(event);
```

Funziona finché il processo non crasha tra i due passi. In quel caso il database dice che l’escalation esiste, ma il downstream non riceve nulla. Abbiamo creato una divergenza persistente.

Invertire l’ordine non risolve. Se pubblichiamo prima e il commit fallisce, Payments riceve un evento che descrive un fatto che il sistema autorevole non ha mai accettato. Il problema non è la sequenza scelta: è che stiamo cercando di coordinare due sistemi indipendenti con due operazioni separate.

## Transactional outbox: rendere durevole l’intenzione

Per il nostro scenario non vogliamo una distributed transaction fra database e broker. Vogliamo che la transazione locale resti l’unico confine atomico.

Il transactional outbox cambia quindi ciò che salviamo nella transazione: non soltanto business state, ma anche **l’intenzione di pubblicare**.

```text
PaymentEscalation
+
OutboxMessage
```

Se il commit riesce, entrambi esistono. Se fallisce, non esiste nessuno dei due.

Microsoft documenta il Transactional Outbox pattern proprio per i casi in cui business state e publish non possono essere coordinati atomicamente tra datastore e broker: la transazione locale persiste anche l’outbox entry, mentre un processo separato si occupa della consegna.

Fonte:

- [Microsoft Learn — Transactional Outbox pattern](https://learn.microsoft.com/azure/architecture/databases/guide/transactional-outbox-cosmos)

Il punto non è che la outbox “renda tutto atomico”. Rende atomici **stato locale e publication intent**.

## Il publisher sposta il failure window, non lo cancella

Dopo il commit, un worker legge le entry pending e le pubblica. Compare allora una nuova finestra:

```text
publisher legge msg_42
↓
broker accetta msg_42
↓
process crasha prima di markPublished
↓
publisher riparte
↓
msg_42 viene pubblicato di nuovo
```

La outbox ha eliminato la perdita silenziosa tra commit e publish, ma ha accettato possibili duplicati tecnici. È un trade-off intenzionale: preferiamo at-least-once publication e consumer idempotente alla possibilità che un’escalation scompaia.

Per questo `messageId` e `escalationId` devono rimanere stabili durante i retry. Il publisher sta tentando di consegnare **lo stesso messaggio**, non generandone uno nuovo a ogni tentativo.

## Message identity e aggregate identity non coincidono

`caseId` identifica il caso operativo; `escalationId` identifica l’intenzione business di escalation; `messageId` identifica una specifica comunicazione. Confonderli rende più difficile deduplication, correlation e ordering.

Lo stesso case può produrre molti fatti nel tempo. Ogni messaggio deve avere una identity propria, mentre la relazione con il case serve a ricostruire causalità e, quando necessario, ordering locale.

## Polling o CDC: scegliere la complessità proporzionata

La outbox deve essere estratta. Un polling publisher è facile da capire e testare, funziona bene a volumi moderati e non richiede infrastruttura aggiuntiva. Paga però polling, tuning di batch/interval e una latency minima legata alla frequenza.

Il Change Data Capture può ridurre polling applicativo e sostenere throughput elevati, ma introduce checkpoint, recovery, coupling al transaction log e una nuova capability operativa.

Per Order Operations scegliamo inizialmente **polling publisher**. Non perché CDC sia inferiore, ma perché il volume corrente non ne giustifica la complessità. Fit before fashion continua a valere anche dentro un pattern già scelto.

## Una outbox non è un event store

Il fatto che la tabella contenga messaggi nel tempo non la trasforma automaticamente in audit log o event sourcing. Il suo scopo è molto più specifico: preservare l’intenzione di pubblicare insieme al business commit.

Può avere retention limitata dopo la consegna, non contenere abbastanza semantica per ricostruire il dominio e subire cleanup aggressivo. Se abbiamo requisiti di audit o storia di business, devono essere modellati come tali e non affidati accidentalmente a una tabella tecnica.

## Cleanup e retention fanno parte del pattern

Una outbox cresce continuamente. Dobbiamo quindi sapere quanto conservare i record pubblicati, come pulirli senza bloccare il publisher, quali index servano e quali informazioni debbano sopravvivere altrove per audit o troubleshooting.

Una policy sensata distingue almeno pending/failed da published: i primi devono rimanere finché il problema non è risolto o escalato; i secondi possono avere una retention operativa limitata. Il business audit segue invece una policy propria.

## Payload piccolo, stabile e classificato

Salvare l’intero oggetto dominio serializzato nella outbox è facile e spesso costoso nel tempo. Aumenta PII exposure, coupling, dimensione del messaggio e blast radius di ogni schema change.

Per `OperationalCasePaymentEscalated` ci servono soltanto le informazioni necessarie al contract: identity, versione, timestamp, `caseId`, `escalationId`, riferimento tenant scoped, reason code e correlation. Non serve copiare customer data, payment provider payload o l’intero Order DTO.

La outbox è comunque una nuova copia di dati e deve quindi rientrare nel threat model: access control, encryption, retention, logging del payload e rischio di replay non spariscono perché la tabella è “tecnica”.

## Il nuovo compromesso ESI

Order Operations accetta delivery asincrona, duplicazione tecnica possibile, piccolo lag, una tabella aggiuntiva e un publisher worker. In cambio il request path non dipende dalla disponibilità runtime di Payments, l’intenzione di pubblicare sopravvive al commit e retry/recovery diventano indipendenti dalla sessione dell’operatore.

Il quality floor può essere espresso così:

```text
commit locale riuscito
→ publication intent durevole

redelivery dello stesso intento
→ nessun side effect business duplicato
```

Questa proprietà conta molto più del nome del broker che implementeremo.