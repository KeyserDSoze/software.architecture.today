# 16.4 — Contratti, dati e failure distribuiti

I bug più costosi non vivono sempre dentro una funzione.

Molti vivono **fra** due cose che prese singolarmente funzionano.

```text
consumer ↔ provider
application ↔ database
producer ↔ broker ↔ consumer
schema v1 ↔ schema v2
retry ↔ idempotency
commit ↔ publication
```

Questi boundary richiedono test specifici.

## Contract testing: il messaggio prima dell'ambiente

Quando due sistemi evolvono con release indipendenti, affidarsi soltanto a un ambiente E2E condiviso crea una forma di coupling operativo.

Per sapere se:

```text
Order Operations
```

può ancora parlare con:

```text
Payments & Risk
```

non dovrebbe essere sempre necessario deployare entrambi nello stesso environment e sperare che tutte le dipendenze collaterali siano sane.

Un contract test restringe il problema:

> **consumer e provider condividono ancora la stessa comprensione dell'interazione?**

Pact formalizza proprio questo obiettivo e distingue i contract test dai functional test del provider.

Fonti:

- [Pact — Introduction](https://docs.pact.io/)
- [Pact — Contract Tests vs Functional Tests](https://docs.pact.io/consumer/contract_tests_not_functional_tests)

## Schema compatibility non è semantic compatibility

Consideriamo:

```json
{
  "schemaVersion": 1,
  "escalationId": "esc-123",
  "reasonCode": "PaymentInvestigationRequired"
}
```

Il messaggio può essere JSON valido.

Può rispettare lo schema.

E può comunque essere semanticamente sbagliato.

Per esempio:

- `escalationId` viene rigenerato a ogni retry;
- `reasonCode` assume un significato diverso nel consumer;
- `tenantRef` non viene usato per il corretto boundary downstream;
- il consumer interpreta redelivery come nuovo intent.

Quindi distinguiamo almeno:

```text
serialization/schema test
contract compatibility test
business semantic test
```

Nessuno sostituisce automaticamente gli altri.

## Contract by specification e contract by example

Un OpenAPI o AsyncAPI document può descrivere il contratto possibile.

Un consumer-driven contract può descrivere interazioni concrete realmente usate.

Pact definisce il proprio approccio come contract-by-example prodotto dai consumer test e verificato sul provider.

Fonte:

- [Pact — Introduction](https://docs.pact.io/)

Non dobbiamo scegliere ideologicamente uno dei due.

Possono rispondere a domande diverse.

Per Order Operations:

```text
API specification
→ public/shared shape e semantics dichiarate

consumer/provider contract
→ expectation effettivamente usata da Payments & Risk
```

## Un contract test non deve congelare tutto

Un pessimo contract test può essere più dannoso di nessun contract test.

Se il consumer pretende:

```text
esattamente questi 17 field
nello stesso ordine
con valori irrilevanti esatti
```

stiamo trasformando dettagli non significativi in coupling.

Pact raccomanda consumer test abbastanza permissivi da consentire al provider di evolvere ciò che non rompe l'aspettativa del consumer.

Fonte:

- [Pact — Writing Consumer Tests](https://docs.pact.io/consumer)

La property da proteggere è la compatibility necessaria, non l'identità byte-for-byte dell'implementazione corrente.

## Database test: non fingere PostgreSQL con una Map

Per testare business logic, un fake repository può essere perfetto.

Per testare PostgreSQL, no.

Una struttura in-memory non replica necessariamente:

- transaction isolation;
- unique constraint;
- foreign key;
- collation;
- timestamp semantics;
- locking;
- query planner;
- index;
- JSON operator;
- migration behavior;
- concurrent transaction.

Quindi una regola importante è:

> **fake the boundary when testing your logic; use the real technology when testing the boundary itself.**

Per Order Operations la transaction:

```text
PaymentEscalation
+ OutboxMessage
```

ha una property critica:

```text
both commit
OR
neither commits
```

La business orchestration può essere testata con una fake transaction.

Ma prima della production readiness serve anche evidence che la vera implementazione PostgreSQL rispetti quella atomicità.

## Migration test

Le migration sono codice di produzione.

Devono essere trattate come tali.

Una strategia minima può verificare:

```text
empty DB
→ apply all migrations
→ schema valid
```

ma non basta sempre.

Per sistemi evolutivi servono anche scenari:

```text
previous supported schema
→ apply next migration
→ existing representative data preserved
```

ed eventualmente:

```text
old app + new schema coexistence
new app + transition schema
rollback/roll-forward policy
```

Il Capitolo 10 ha già mostrato con casi reali Stripe e GitHub che schema migration in produzione è un problema operativo e non soltanto DDL.

Il testing deve rifletterlo.

## Concurrency test

Molti invariant sembrano corretti in esecuzione sequenziale e falliscono sotto concorrenza.

Esempio:

```text
Request A: no active escalation found
Request B: no active escalation found
A inserts
B inserts
```

Un mock repository sequenziale potrebbe non vedere mai il problema.

Una unique constraint o una transaction policy reale può diventare parte del guardrail.

Ma anche il guardrail deve essere testato.

Quindi per invariant concurrency-sensitive vogliamo almeno una prova che faccia realmente competere due operation.

## Distributed testing: unknown outcome

Nel Capitolo 11 abbiamo insistito su un caso fondamentale:

```text
publish succeeds
acknowledgement lost
```

Il producer non sa se il broker abbia accettato il messaggio.

La strategia non può testare soltanto:

```text
publish returns success
publish throws failure
```

Deve includere il terzo caso concettuale:

```text
side effect may have happened
but caller observes failure/timeout
```

È qui che idempotency e stable message identity diventano testabili.

## Il test di redelivery

Per il consumer Payments & Risk una property essenziale è:

```text
same EscalationId delivered twice
→ one business workflow
```

Il test corretto non è:

```text
consumer method called twice
```

È:

```text
duplicate technical delivery
→ no duplicate business effect
```

Questo può richiedere persistence reale del dedup state downstream.

La semantica at-least-once non si valida contando le chiamate.

Si valida osservando gli effetti.

## Retry test

Un retry test utile deve distinguere almeno:

```text
transient failure
→ retry allowed

permanent validation failure
→ retry forbidden

unknown outcome
→ retry with stable identity
```

Se il test dice soltanto:

```text
should retry 3 times
```

sta proteggendo una configurazione.

Non necessariamente la policy.

Meglio testare:

```text
bounded
classified
backoff applied
stable operation identity preserved
```

Il numero esatto può essere testato dove costituisce requirement/configuration contract.

## Time test

Distributed system code spesso dipende dal tempo:

- retry schedule;
- timeout;
- delivery budget;
- TTL;
- lock expiry;
- reconciliation threshold.

Usare `sleep()` nei test piccoli è quasi sempre un segnale che non stiamo controllando il clock.

Order Operations ha già un `OutboxPublisherClock`.

Questo consente di testare:

```text
now = T0
failure
nextAttemptAt = T0 + delay
```

senza aspettare realmente.

I test più realistici potranno poi verificare il comportamento temporale del broker/runtime vero.

## Testare DLQ e reconciliation

Una DLQ non è una feature completa finché non sappiamo verificare:

- quando un messaggio ci finisce;
- quale evidence conserva;
- chi viene avvisato;
- come viene redriveato;
- se il redrive è idempotente;
- se una reconciliation trova divergenze.

Per Order Operations il Failure Mode Map richiede:

```text
PaymentEscalation Requested
AND DeliveryState != Delivered
AND age > business threshold
→ reconciliation candidate
```

Questa rule deve avere test deterministici a clock controllato.

Poi servirà un operational test sul vero path.

## Event versioning test

Quando arriverà `OperationalCasePaymentEscalatedV2`, la domanda non sarà soltanto:

> il nuovo schema è valido?

ma:

> **i consumer che conoscono ancora v1 continuano a funzionare secondo la compatibility policy?**

Possibili strategie:

- backward-compatible additive change;
- dual publication temporanea;
- versioned endpoint/topic;
- consumer migration window.

Qualunque strategia scegliamo deve produrre test compatibili con la policy.

## Il test dell'assenza

Alcune properties sono negative:

```text
non deve pubblicare
non deve scrivere
non deve attraversare tenant
non deve fare retry
non deve loggare secret
```

I test generati automaticamente tendono facilmente a concentrarsi sul happy path visibile.

Una Testing Strategy risk-driven rende esplicite anche le cose che **non devono accadere**.

Per esempio:

```text
wrong tenant
→ no escalation
→ no outbox message
→ no telemetry containing foreign tenant data
```

Questo è più forte di verificare soltanto una `403`.

## Cross-boundary evidence

Per ogni boundary significativo possiamo compilare una mini tabella:

| Boundary | Property | Cheap test | Real-boundary test |
|---|---|---|---|
| API | idempotency semantic | application test | HTTP + DB integration |
| DB | atomicity | fake UoW | PostgreSQL transaction test |
| event | compatible shape | serialization | provider/consumer contract |
| broker | duplicate possible | publisher unit | Service Bus integration |
| consumer | no duplicate effect | consumer component | real dedup persistence |
| recovery | reconciliation rule | clock-controlled | operational drill |

Questo impedisce due errori opposti:

1. mockare tutto e dichiarare integrato il sistema;
2. mettere tutto in E2E e ottenere una suite lenta e fragile.

## Corollario

> **I boundary non vanno testati perché sono “integrazioni”. Vanno testati perché è lì che due modelli di realtà devono continuare a essere compatibili mentre evolvono indipendentemente.**