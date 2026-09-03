## Idee chiave

1. La rete introduce **outcome incerti**, non soltanto errori più lenti.
2. Un timeout significa che il caller smette di aspettare; non dimostra che il downstream non abbia prodotto side effect.
3. Un retry è una nuova esecuzione potenziale e deve essere progettato insieme a idempotency, budget e stop condition.
4. Retry annidati possono trasformare un piccolo failure rate in un overload più ampio.
5. Backoff e jitter riducono la sincronizzazione dei retry; non sostituiscono la classificazione degli errori.
6. Queue, pub/sub e stream descrivono relazioni differenti fra producer e consumer.
7. Command ed event hanno semantica differente: il primo esprime un'intenzione, il secondo descrive un fatto.
8. At-least-once delivery richiede consumer che tollerino redelivery quando il duplicato produce effetti indesiderati.
9. Exactly-once deve sempre specificare il confine della garanzia.
10. Ordering globale è costoso e spesso non è il requisito reale; cercare l'ordine minimo necessario.
11. Una queue assorbe burst trasformandoli in backlog. Non crea capacità.
12. Backpressure decide dove il sistema rallenta prima di saturare.
13. Una DLQ senza owner, alert, retention e redrive policy è soltanto un parcheggio di errori.
14. Transactional outbox rende atomici stato locale e intenzione di pubblicare, non l'intero processo distribuito.
15. Eventual consistency deve specificare stati intermedi, convergenza, timeout e recovery.
16. Compensation è una nuova business operation, non un database rollback distribuito.
17. Saga serve quando esiste davvero un workflow distribuito multi-step con recovery/compensation significative.
18. Orchestration rende esplicita la progressione; choreography distribuisce le reazioni. Entrambe pagano costi differenti.
19. Reconciliation è una parte importante della reliability quando acknowledgement e side effect attraversano sistemi diversi.
20. La Failure Mode Map descrive che cosa succede quando le frecce del diagramma non funzionano come previsto.

## Operational artifact — Failure Mode Map

Template sintetico:

```markdown
# Failure Mode Map

## Critical flow

## Dependencies

| Step | Failure | Known outcome? | Persisted state | Retry owner | Idempotency | User impact | Recovery | Owner |
|---|---|---|---|---|---|---|---|---|

## Time budgets

## Retry policy

## Ordering

## Backpressure

## Dead-letter policy

## Reconciliation

## Compensation / irreversible steps

## Manual intervention

## Observability

## Open questions
```

La mappa deve essere proporzionata al rischio.

Un flusso che invia telemetry best-effort non richiede lo stesso livello di dettaglio di un flusso economico.

## Esercizio 1 — Il timeout ambiguo

Hai:

```text
POST /refund
client timeout = 2s
```

Il client riceve timeout.

Scrivi almeno quattro possibili stati reali del downstream.

Per ciascuno specifica:

- se un retry è sicuro;
- quale informazione manca;
- quale idempotency contract introdurresti;
- come riconcilieresti l'esito.

Obiettivo:

capire perché `TimeoutException` non descrive abbastanza il failure mode.

## Esercizio 2 — Retry storm

Sistema:

```text
Web API
→ Service A
→ Service B
→ Database
```

Ogni livello esegue fino a tre tentativi.

Il database entra in degradazione.

Disegna il feedback loop e proponi:

- retry ownership;
- retry budget;
- timeout budget;
- backoff;
- jitter;
- stop condition;
- eventuale degraded mode.

Domanda:

> in quale livello metteresti il retry e perché?

## Esercizio 3 — Queue o pub/sub?

Classifica questi casi:

1. generare una fattura PDF;
2. notificare che un ordine è stato confermato a più sistemi interessati;
3. eseguire una scansione antivirus su un file;
4. mantenere un log replayable di clickstream;
5. inviare una command di fulfillment a un solo dominio responsabile;
6. aggiornare più projection indipendenti dopo un evento di dominio.

Per ogni caso scegli:

- queue;
- pub/sub;
- stream;
- nessuna messaggistica asincrona.

Poi spiega quali proprietà ti servono davvero.

## Esercizio 4 — At-least-once

Consumer:

```text
Message: InvoiceRequested
→ generate invoice
→ send email
→ ack
```

Il processo crasha dopo l'invio email ma prima dell'ack.

Progetta una soluzione che distingua:

- identity del messaggio;
- identity della fattura;
- identity dell'invio;
- deduplication;
- recovery.

Domanda:

> quali side effect devono essere idempotenti e quali possono essere riconciliati?

## Esercizio 5 — Ordering minimo

Ricevi eventi:

```text
OrderCreated
OrderConfirmed
OrderCancelled
```

per milioni di ordini.

Il requisito iniziale dice:

> “gli eventi devono essere in ordine”.

Riscrivilo in una forma più precisa.

Valuta:

- ordering globale;
- ordering per tenant;
- ordering per orderId;
- version number;
- stale-event rejection.

Obiettivo:

preservare correctness senza serializzare inutilmente tutto il workload.

## Esercizio 6 — Backpressure

Producer:

```text
1.000 msg/s
```

Consumer capacity:

```text
300 msg/s
```

Il burst dura 20 minuti.

Non serve calcolare soltanto il backlog.

Progetta anche:

- metrica di lag;
- alert threshold;
- producer throttling;
- consumer scaling;
- priority;
- TTL quando applicabile;
- comportamento quando il backlog non può essere recuperato nel business window.

## Esercizio 7 — DLQ production-ready

Ti viene mostrata questa configurazione:

```text
maxDeliveryCount = 10
on failure → DLQ
```

Scrivi tutto ciò che manca per poterla considerare una recovery strategy.

Almeno:

- owner;
- alert;
- retention;
- failure reason;
- security;
- redrive;
- idempotency;
- business impact;
- runbook;
- escalation.

## Esercizio 8 — Dual write

Hai questo codice:

```ts
await repository.save(entity);
await broker.publish(event);
```

Costruisci una Failure Mode Map per:

- DB fail;
- publish fail;
- process crash;
- publish success + lost ack;
- retry.

Poi ridisegna il flusso con transactional outbox.

Spiega quali failure mode vengono eliminati e quali rimangono.

## Esercizio 9 — Saga o no?

Per ciascun workflow decidi se una saga è giustificata:

1. invio email dopo registrazione;
2. prenotazione viaggio con volo + hotel + pagamento;
3. refresh di una cache;
4. refund con provider esterno, aggiornamento stato ordine e notifica;
5. generazione asincrona di thumbnail.

Per quelli che richiedono saga, individua:

- local transactions;
- compensable steps;
- pivot;
- irreversible side effect;
- human review condition.

## Esercizio 10 — Choreography vs orchestration

Scenario:

```text
OrderConfirmed
→ reserve inventory
→ authorize payment
→ prepare shipment
→ send confirmation
```

Disegna due soluzioni:

- choreography;
- orchestration.

Confronta:

- ownership del workflow;
- visibilità dello stato;
- coupling;
- schema evolution;
- observability;
- recovery;
- compensation;
- team autonomy.

Non dichiarare un vincitore universale.

Scegli in base a un contesto esplicito.

## Esercizio 11 — Failure Mode Map di un sistema reale

Scegli un'integrazione reale che conosci.

Non serve un grande sistema distribuito.

Può essere:

```text
app → payment provider
service → SMTP
worker → object storage
API → identity provider
```

Disegna la mappa.

Evidenzia almeno un punto in cui oggi il team non sa distinguere:

```text
known failure
known success
unknown outcome
```

Proponi un miglioramento.

## Esercizio 12 — Analisi del caso Uber DLQ

Leggi:

- [Uber Engineering — Building Reliable Reprocessing and Dead Letter Queues with Apache Kafka](https://www.uber.com/blog/reliable-reprocessing/)

Rispondi:

1. quale problema operativo stava risolvendo Uber?
2. perché il retry inline poteva danneggiare il traffico real-time?
3. quale ruolo aveva la separazione dei retry stream?
4. quali trade-off introduceva?
5. quali parti del design sono specifiche di Kafka e quali sono generalizzabili?

Obiettivo:

non copiare la soluzione; estrarre il modello decisionale.

## Esercizio 13 — Amazon e idempotency

Leggi:

- [Amazon Builders' Library — Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/)

Confronta:

```text
payload hash
vs
client request id
```

Descrivi un caso in cui due payload uguali rappresentano due intenti differenti e un caso in cui due tentativi dello stesso intento possono non essere byte-identical.

## Esercizio 14 — Order Operations

Partendo dalla sezione ESI, progetta il command:

```http
POST /api/operational-cases/{caseId}/payment-escalations
```

Definisci:

- authentication;
- authorization;
- idempotency key;
- business validation;
- response semantics;
- local transaction;
- outbox entry;
- event contract;
- delivery state;
- retry;
- DLQ;
- reconciliation;
- observability.

Non aggiungere refund o altri side effect economici.

## Esercizio 15 — Adversarial review con AI

Fornisci a un agente:

- producer code;
- outbox schema;
- publisher;
- consumer;
- retry config;
- DLQ config;
- API contract.

Chiedi:

> “Trova tutte le finestre in cui un crash o timeout può produrre perdita, duplicazione, ordering violation, retry amplification o stato ambiguo. Per ogni scenario indica evidence nel codice/config e proponi un test riproducibile.”

Poi verifica manualmente ogni scenario.

Obiettivo:

usare l'AI come failure-mode explorer, non come certificatore della reliability.

## Autovalutazione

Dovresti saper rispondere senza consultare il capitolo:

1. Perché un timeout non dimostra che l'operazione remota sia fallita?
2. Quando un retry può peggiorare un outage?
3. Che differenza c'è fra backoff e jitter?
4. Che cosa rende un consumer idempotente?
5. Perché exactly-once deve essere delimitato?
6. Quando useresti una queue invece di pub/sub?
7. Qual è la differenza semantica fra command ed event?
8. Perché queue depth da sola non descrive bene il backlog?
9. Che cosa rende una DLQ operabile?
10. Che failure window risolve transactional outbox?
11. Quale failure window rimane dopo l'outbox?
12. Perché eventual consistency richiede una business time policy?
13. Perché compensation non è rollback?
14. Quando una saga è overengineering?
15. Che differenza c'è fra orchestration e choreography?
16. Che cosa deve contenere una Failure Mode Map?
17. Perché reconciliation rimane utile anche con retry affidabili?

## Cosa cambia con l'AI

L'AI rende molto più economico:

- generare producer e consumer;
- aggiungere retry;
- configurare broker;
- generare Terraform per queue/topic;
- creare schema;
- costruire workflow;
- implementare saga;
- produrre diagrammi event-driven.

Questo aumenta il rischio di introdurre distribuzione prima di avere capito il failure model.

Un agente può creare in pochi minuti:

```text
queue
+ DLQ
+ retries
+ worker
+ dashboard
```

ma le domande difficili rimangono:

```text
il messaggio può duplicarsi?
quale side effect è idempotente?
chi è owner del redrive?
quando il ritardo diventa incidente?
quale stato vede l'utente?
quale payload è sicuro?
chi riconcilia?
che cosa è irreversibile?
```

Quindi nell'era dell'AI:

> **il costo di costruire un sistema distribuito scende più velocemente del costo di capirne tutti i failure mode.**

Questo rende la disciplina ancora più importante.

## Fonti principali del capitolo

### Microsoft

- [Retry pattern](https://learn.microsoft.com/azure/architecture/patterns/retry)
- [Transient fault handling](https://learn.microsoft.com/azure/architecture/best-practices/transient-faults)
- [Idempotent Consumer pattern](https://learn.microsoft.com/azure/architecture/patterns/idempotent-consumer)
- [Competing Consumers pattern](https://learn.microsoft.com/azure/architecture/patterns/competing-consumers)
- [Publisher-Subscriber pattern](https://learn.microsoft.com/azure/architecture/patterns/publisher-subscriber)
- [Choreography pattern](https://learn.microsoft.com/azure/architecture/patterns/choreography)
- [Saga pattern](https://learn.microsoft.com/azure/architecture/patterns/saga)
- [Compensating Transaction pattern](https://learn.microsoft.com/azure/architecture/patterns/compensating-transaction)
- [Transactional Outbox](https://learn.microsoft.com/azure/architecture/databases/guide/transactional-outbox-cosmos)

### AWS

- [Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/)
- [Exponential Backoff And Jitter](https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/)
- [Control and limit retry calls](https://docs.aws.amazon.com/wellarchitected/latest/framework/rel_mitigate_interaction_failure_limit_retries.html)
- [Set client timeouts](https://docs.aws.amazon.com/wellarchitected/latest/framework/rel_mitigate_interaction_failure_client_timeouts.html)

### Casi reali Uber

- [Building Reliable Reprocessing and Dead Letter Queues with Apache Kafka](https://www.uber.com/blog/reliable-reprocessing/)
- [Real-Time Exactly-Once Ad Event Processing](https://www.uber.com/blog/real-time-exactly-once-ad-event-processing/)
- [Uber's Real-Time Push Platform](https://www.uber.com/blog/real-time-push-platform/)

## Il compromesso ESI

### Esigenza

Commerce & Operations deve registrare rapidamente una payment escalation e Payments & Risk deve riceverla in modo affidabile.

### Tensione

Availability e latency del request path contro consistency immediata e semplicità sincrona.

### Decisione

Transazione locale + transactional outbox + delivery asincrona at-least-once + consumer idempotente.

### Costo accettato

Eventual consistency, outbox, publisher, retry, DLQ, reconciliation e osservabilità aggiuntiva.

### Quality floor

- nessuna perdita silenziosa dopo local commit;
- nessun side effect duplicato per la stessa escalation;
- tenant isolation;
- payload minimizzato;
- correlation;
- failure visibile;
- Payments & Risk mantiene ownership economica.

### Guardrail

- stable `escalationId` e `messageId`;
- bounded retry + backoff/jitter;
- idempotent consumer;
- DLQ owner;
- business delivery monitoring;
- reconciliation;
- Failure Mode Map.

### Trigger di revisione

- throughput/lag incompatibili col polling publisher;
- DLQ frequente;
- nuove esigenze di replay/stream processing;
- ordering più forte;
- workflow economici multi-step;
- business requirement di recovery più severi.

## Bridge al Capitolo 12

Abbiamo introdotto la prima capability distribuita senza scegliere ancora il prodotto cloud.

È intenzionale.

Ora abbiamo requisiti abbastanza concreti per valutare il deployment:

```text
runtime
messaging
network
identity
secrets
storage
autoscaling
availability
infrastructure as code
```

Nel **Capitolo 12 — Cloud Architecture** faremo la domanda nel verso corretto:

> quali capability cloud hanno il fit migliore con il sistema che abbiamo già compreso?

Non:

> quali servizi cloud possiamo infilare nel diagramma?

## Corollario

> **Nel codice locale un errore interrompe una chiamata. In un sistema distribuito può interrompere la nostra conoscenza di ciò che è successo. Progettare quella incertezza è Software Architecture.**