## Contratti, dati e failure distribuiti

Molti bug costosi non vivono dentro una funzione. Vivono nel punto in cui due modelli di realtà devono restare compatibili mentre cambiano indipendentemente.

```text
consumer ↔ provider
application ↔ database
producer ↔ broker ↔ consumer
schema v1 ↔ schema v2
retry ↔ idempotency
commit ↔ publication
```

Questi boundary meritano una Testing Architecture specifica perché un componente può essere corretto isolatamente e produrre comunque un sistema sbagliato quando incontra l’altro lato.

## Contract testing: falsificare la compatibilità prima dell’ambiente completo

Order Operations e Payments & Risk non dovrebbero dover essere distribuiti insieme in un grande environment soltanto per scoprire che non condividono più la stessa comprensione di un messaggio.

Un contract test restringe la claim:

> **Il consumer e il provider continuano a concordare sull’interazione necessaria?**

Pact formalizza questo obiettivo e distingue i contract test dai functional test del provider.

Fonti:

- [Pact — Introduction](https://docs.pact.io/)
- [Pact — Contract Tests vs Functional Tests](https://docs.pact.io/consumer/contract_tests_not_functional_tests)

Per `OperationalCasePaymentEscalatedV1` possiamo verificare shape, field necessari e expectation usate dal consumer. Ma un contract verde non dimostra che Payments & Risk attribuisca lo stesso significato business a `reasonCode` o che deduplichi correttamente `EscalationId`.

Distinguiamo quindi:

```text
serialization/schema conformance
→ il messaggio ha la forma consentita

consumer/provider compatibility
→ l’interazione richiesta continua a essere supportata

business semantic behavior
→ il consumer produce l’effetto corretto
```

La differenza è essenziale perché un JSON può essere perfettamente valido e semanticamente sbagliato.

## Un contract troppo preciso può creare coupling inutile

La verification deve proteggere ciò che il consumer usa, non congelare accidentalmente tutta l’implementazione del provider.

Se il consumer pretende esattamente diciassette field, ordine irrilevante e valori che non legge, il contract smette di difendere compatibility e inizia a bloccare evoluzioni innocue.

Pact raccomanda consumer expectation sufficientemente precise da esprimere ciò che conta e sufficientemente permissive da non vincolare dettagli non necessari.

Fonte:

- [Pact — Writing Consumer Tests](https://docs.pact.io/consumer)

Lo stesso principio vale per OpenAPI/AsyncAPI e altri contract by specification: lo schema documenta ciò che è ammesso; il test deve conservare la compatibility policy, non trasformare ogni dettaglio corrente in una one-way door.

## Database: quando la tecnologia è la property

Un fake repository è perfetto per verificare business orchestration quando non vogliamo pagare il costo del database. È una pessima fonte di evidence quando la claim riguarda PostgreSQL.

Una `Map` non replica necessariamente:

```text
transaction isolation
unique/foreign-key constraint
collation
timestamp semantics
locking
concurrency
migration behavior
query/index semantics
```

Per Order Operations la property critica:

```text
PaymentEscalation + OutboxMessage
→ both commit OR neither commits
```

può avere un’application test che verifica la richiesta di una stessa unit of work. Ma la claim “PostgreSQL rende atomiche le due write” richiede un vero transaction test.

> **Quando testiamo la nostra logica possiamo controllare il boundary. Quando testiamo il boundary, dobbiamo usare una rappresentazione abbastanza fedele del boundary stesso.**

## Concurrency: il bug che non appare in sequenza

Una regola può sembrare perfetta in esecuzione sequenziale e rompersi appena due request competono.

```text
A: no escalation found
B: no escalation found
A: insert
B: insert
```

Se la protezione reale è una unique constraint o una transaction policy, la suite deve riuscire a dimostrare almeno un caso di concorrenza sulla tecnologia reale.

Il mock sequenziale può provare l’intenzione del use case. Non prova race handling.

## Migration: verificare il passaggio, non soltanto lo schema finale

Una migration è codice di produzione perché modifica lo stato che la nuova versione dell’applicazione deve comprendere.

Il test minimo:

```text
empty DB
→ apply all migrations
→ expected schema
```

è utile ma incompleto per un sistema evolutivo.

Serve anche la transizione:

```text
previous supported schema + representative data
→ next migration
→ existing state preserved
→ new constraint valid
```

Quando il rollout richiede convivenza fra versioni, entrano inoltre compatibility di old app/new schema e strategia roll-forward/rollback.

Il Capitolo 10 ha già mostrato, attraverso i casi Stripe e GitHub citati lì, che schema change è un problema operativo oltre che DDL. La Testing Architecture deve conservare la stessa realtà.

## Distributed failure: successo, fallimento e outcome ignoto

Nel Capitolo 11 abbiamo introdotto uno dei punti più importanti dei sistemi distribuiti:

```text
publish succeeds
acknowledgement is lost
```

Dal punto di vista del caller osserviamo failure o timeout. Dal punto di vista del broker il side effect potrebbe essere già avvenuto.

Una suite che modella soltanto:

```text
publish returns success
publish throws before side effect
```

non sta testando il failure più interessante.

Dobbiamo includere l’**unknown outcome** e verificare le proprietà che lo rendono sicuro:

```text
same messageId preserved
same EscalationId preserved
retry bounded
consumer duplicate tolerance
reconciliation possible
```

Questa è la differenza fra testare una exception e testare il failure model.

## Redelivery: contare le chiamate è la metrica sbagliata

La property downstream non è:

```text
consumer called twice
```

ma:

```text
same EscalationId delivered twice
→ one business workflow
```

Per dimostrarlo il consumer può aver bisogno della propria persistence reale del dedup state. L’at-least-once delivery non viene verificata contando method invocation; viene verificata osservando l’effetto business.

Questa property appartiene principalmente a Payments & Risk. Order Operations può codificare il contract e testare le proprie identity semantics, ma non dichiarare `Verified` un comportamento downstream che non possiede.

## Retry: verificare la policy, non una magia numerica

Un buon retry test distingue:

```text
transient failure
→ retry candidate

permanent validation/semantic rejection
→ no blind retry

unknown outcome
→ retry only with stable identity
```

La policy deve inoltre essere bounded e applicare il backoff previsto. Il numero esatto di tentativi può essere un configuration contract quando serve, ma il test principale protegge classification, stable identity e stop condition.

`should retry exactly 3 times` può essere corretto. Non è automaticamente la property importante.

## Tempo controllato: evitare che il test aspetti la realtà

Retry, TTL, delivery budget e reconciliation threshold dipendono dal tempo. Un `sleep()` nei test piccoli introduce latency e flakiness invece di evidence.

Order Operations possiede già `OutboxPublisherClock`, quindi possiamo verificare:

```text
now = T0
publish failure
→ nextAttemptAt = T0 + policy delay
```

oppure:

```text
Requested + age > business threshold
→ reconciliation candidate
```

senza aspettare realmente minuti.

I test di integrazione/operational potranno poi verificare il behavior temporale del runtime reale dove serve.

## DLQ e reconciliation: provare anche la strada dopo il failure

Una DLQ non è una recovery capability soltanto perché un messaggio può finirci. La suite deve sapere falsificare almeno queste claim:

```text
entry condition corretta
evidence utile preservata
alert/owner raggiungibile
redrive non cambia business identity
redrive idempotente
reconciliation trova la divergence
```

La Failure Mode Map diventa quindi una sorgente diretta di test.

## Versioning: la nuova versione deve essere testata contro la policy, non contro l’ottimismo

Quando arriverà `OperationalCasePaymentEscalatedV2`, non basta chiedere se il nuovo schema sia valido. Dobbiamo sapere quale compatibility policy abbiamo scelto e verificare il comportamento dei consumer ancora su v1.

Additive backward-compatible change, dual publication, versioned channel o migration window sono strategie differenti. Ognuna crea una diversa evidence chain.

## Il test dell’assenza

Alcune delle property più importanti descrivono cose che **non devono accadere**:

```text
wrong tenant
→ no read/write

wrong role
→ no escalation

permanent failure
→ no blind retry

sensitive value
→ no telemetry leakage

same intent replay
→ no duplicate business effect
```

I test AI-generated tendono facilmente verso l’happy path visibile nel codice. La Risk-to-Evidence Map deve rendere espliciti anche questi non-eventi.

Per un cross-tenant denial non basta una `403`: vogliamo anche `no PaymentEscalation`, `no OutboxMessage` e nessuna disclosure non autorizzata.

## Cross-boundary evidence map

| Boundary | Claim | Cheap evidence | Boundary evidence |
|---|---|---|---|
| API | idempotency semantics | application | HTTP + PostgreSQL |
| DB | atomicity | fake UoW orchestration | PostgreSQL transaction |
| event | compatible shape | serialization | consumer/provider contract |
| broker | redelivery possible/safe publish | publisher test | Service Bus integration |
| consumer | no duplicate effect | component | real dedup persistence |
| recovery | reconciliation | controlled clock | operational drill |

Questa mappa evita due estremi: mockare tutto e chiamarlo integrato, oppure mettere tutta la confidence in E2E lenti e fragili.

> **I boundary non vanno testati perché si chiamano “integrazioni”. Vanno testati perché è lì che due modelli di realtà devono continuare a concordare mentre evolvono indipendentemente.**