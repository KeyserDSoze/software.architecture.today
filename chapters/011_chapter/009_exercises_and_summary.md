## Sintesi: distribuire significa progettare l’incertezza

Il filo del capitolo è uno solo: attraversare una rete rende incompleta la nostra conoscenza dell’outcome. Un timeout non dimostra che il downstream non abbia prodotto effetti; un retry non annulla il tentativo precedente; una queue non crea capacità ma trasforma burst in backlog; una delivery guarantee vale soltanto nel perimetro in cui può essere realmente sostenuta.

Per questo retry, idempotency, backoff, jitter, ordering, backpressure, DLQ, outbox e reconciliation non sono ingredienti da aggiungere a una “modern architecture”. Sono risposte a forme specifiche di incertezza. La loro utilità dipende dal failure mode che rendono governabile.

At-least-once delivery, per esempio, accetta redelivery pur di evitare perdita silenziosa. Il sistema deve quindi avere identity stabile e consumer idempotenti. Exactly-once richiede sempre di specificare il boundary della promessa. Transactional outbox chiude il buco tra business commit e publication intent, ma non elimina il possibile duplicate publish. Eventual consistency richiede stati intermedi e una business time policy; compensation è una nuova business operation, non un rollback distribuito; saga e orchestration entrano soltanto quando un workflow multi-step, con recovery significativo, le rende necessarie.

La Failure Mode Map raccoglie queste decisioni partendo dal journey. Il suo scopo è farci vedere che cosa rimane persistito, se l’outcome è known o unknown, chi possiede il retry, quanto tempo possiamo aspettare, quando il lavoro deve uscire dal fast path e chi interviene se la recovery automatica non converge.

## Operational artifact — Failure Mode Map

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

La mappa deve essere proporzionata al rischio. Telemetria best-effort e flussi economici non meritano lo stesso livello di dettaglio.

## Esercizio 1 — Il timeout ambiguo

Hai:

```text
POST /refund
client timeout = 2s
```

Il client riceve timeout. Scrivi almeno quattro possibili stati reali del downstream e, per ciascuno, indica se un retry sia sicuro, quale informazione manchi, quale idempotency contract introdurresti e come riconcilieresti l’esito.

Obiettivo: capire perché `TimeoutException` non descrive abbastanza il failure mode.

## Esercizio 2 — Retry storm

Sistema:

```text
Web API
→ Service A
→ Service B
→ Database
```

Ogni livello esegue fino a tre tentativi e il database entra in degradazione. Disegna il feedback loop e proponi retry ownership, retry budget, timeout budget, backoff, jitter, stop condition ed eventuale degraded mode. Spiega in quale livello metteresti il retry e perché.

## Esercizio 3 — Queue o pub/sub?

Classifica questi casi:

1. generare una fattura PDF;
2. notificare che un ordine è stato confermato a più sistemi interessati;
3. eseguire una scansione antivirus su un file;
4. mantenere un log replayable di clickstream;
5. inviare un command di fulfillment a un solo dominio responsabile;
6. aggiornare più projection indipendenti dopo un evento di dominio.

Per ogni caso scegli queue, pub/sub, stream oppure nessuna messaggistica asincrona e spiega quali proprietà ti servono davvero.

## Esercizio 4 — At-least-once

Consumer:

```text
Message: InvoiceRequested
→ generate invoice
→ send email
→ ack
```

Il processo crasha dopo l’invio email ma prima dell’ack. Progetta una soluzione che distingua identity del messaggio, della fattura e dell’invio, oltre a deduplication e recovery. Spiega quali side effect devono essere idempotenti e quali possono essere riconciliati.

## Esercizio 5 — Ordering minimo

Ricevi:

```text
OrderCreated
OrderConfirmed
OrderCancelled
```

per milioni di ordini. Il requisito iniziale dice “gli eventi devono essere in ordine”. Riscrivilo in una forma più precisa e confronta ordering globale, per tenant, per `orderId`, version number e stale-event rejection. L’obiettivo è proteggere correctness senza serializzare inutilmente tutto il workload.

## Esercizio 6 — Backpressure

Producer:

```text
1.000 msg/s
```

Consumer capacity:

```text
300 msg/s
```

Il burst dura 20 minuti. Non limitarti a calcolare il backlog: definisci anche metrica di lag, alert threshold, producer throttling, consumer scaling, priority, TTL quando applicabile e comportamento quando il backlog non può essere recuperato nel business window.

## Esercizio 7 — DLQ production-ready

Ti viene mostrata questa configurazione:

```text
maxDeliveryCount = 10
on failure → DLQ
```

Completa la recovery strategy con owner, alert, retention, failure reason, security, redrive, idempotency, business impact, runbook ed escalation. Spiega che cosa vede il business mentre il messaggio è in DLQ.

## Esercizio 8 — Dual write

Hai:

```ts
await repository.save(entity);
await broker.publish(event);
```

Costruisci una Failure Mode Map per DB fail, publish fail, process crash, publish success con lost ack e retry. Ridisegna poi il flusso con transactional outbox e spiega quali failure mode vengono eliminati e quali rimangono.

## Esercizio 9 — Saga o no?

Per ciascun workflow decidi se una saga sia giustificata:

1. invio email dopo registrazione;
2. prenotazione viaggio con volo, hotel e pagamento;
3. refresh di una cache;
4. refund con provider esterno, aggiornamento stato ordine e notifica;
5. generazione asincrona di thumbnail.

Per i casi che la richiedono individua local transactions, compensable steps, pivot, side effect irreversibili e condizioni di human review.

## Esercizio 10 — Choreography vs orchestration

Scenario:

```text
OrderConfirmed
→ reserve inventory
→ authorize payment
→ prepare shipment
→ send confirmation
```

Disegna una soluzione choreography e una orchestration. Confronta ownership del workflow, visibilità dello stato, coupling, schema evolution, observability, recovery, compensation e team autonomy. Non cercare un vincitore universale: scegli in base a un contesto esplicito.

## Esercizio 11 — Failure Mode Map di un sistema reale

Scegli un’integrazione reale che conosci, anche piccola:

```text
app → payment provider
service → SMTP
worker → object storage
API → identity provider
```

Disegna la mappa ed evidenzia almeno un punto in cui oggi il team non distingue chiaramente `known failure`, `known success` e `unknown outcome`. Proponi un miglioramento.

## Esercizio 12 — Analisi del caso Uber DLQ

Leggi:

- [Uber Engineering — Building Reliable Reprocessing and Dead Letter Queues with Apache Kafka](https://www.uber.com/blog/reliable-reprocessing/)

Ricostruisci quale problema operativo Uber stesse risolvendo, perché il retry inline potesse danneggiare il traffico real-time, quale ruolo avesse la separazione dei retry stream e quali parti della soluzione siano specifiche di Kafka o invece generalizzabili.

L’obiettivo non è copiare la topologia, ma estrarre il modello decisionale.

## Esercizio 13 — Amazon e idempotency

Leggi:

- [Amazon Builders' Library — Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/)

Confronta `payload hash` e `client request id`. Descrivi un caso in cui due payload identici rappresentino intenti differenti e un caso in cui due tentativi dello stesso intento non siano byte-identical.

## Esercizio 14 — Order Operations

Progetta il command:

```http
POST /api/operational-cases/{caseId}/payment-escalations
```

Definisci authentication, authorization, idempotency key, business validation, response semantics, local transaction, outbox entry, event contract, delivery state, retry, DLQ, reconciliation e observability. Non aggiungere refund o altri side effect economici: il confine funzionale del capitolo è l’escalation.

## Esercizio 15 — Adversarial review con AI

Fornisci a un agente producer code, outbox schema, publisher, consumer, retry config, DLQ config e API contract. Chiedigli di trovare tutte le finestre in cui crash o timeout possono produrre perdita, duplicazione, ordering violation, retry amplification o stato ambiguo e di proporre un test riproducibile per ogni scenario.

Verifica poi manualmente ogni osservazione. L’obiettivo è usare l’AI come failure-mode explorer, non come certificatore della reliability.

## Autovalutazione

Dovresti saper spiegare senza consultare il testo perché un timeout non dimostri failure remoto; quando un retry peggiori un outage; la differenza tra backoff e jitter; che cosa renda idempotente un consumer; perché exactly-once debba essere delimitato; quando una queue abbia fit migliore del pub/sub; perché queue depth da sola non basti; che cosa renda una DLQ operabile; quale buco chiuda l’outbox e quale duplicate window rimanga; perché eventual consistency richieda una business time policy; perché compensation non sia rollback; quando saga sia overengineering; come differiscano orchestration e choreography; e perché reconciliation continui a servire anche in presenza di retry affidabili.

## Cosa cambia con l’AI

L’AI abbassa enormemente il costo di generare producer, consumer, retry, broker configuration, Terraform, schema, workflow e perfino saga. Questo è utile, ma rende ancora più facile introdurre distribuzione prima di averne capito il failure model.

Un agente può creare in pochi minuti:

```text
queue
+ DLQ
+ retries
+ worker
+ dashboard
```

ma non risponde automaticamente alle domande che contano: quale side effect sia idempotente, chi possieda il redrive, quando il ritardo diventi incidente, quale stato veda l’utente, quale payload sia sicuro, chi riconcili e che cosa sia irreversibile.

> **Il costo di costruire un sistema distribuito scende più velocemente del costo di capirne tutti i failure mode.**

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

Commerce & Operations deve registrare rapidamente una Payment Escalation e Payments & Risk deve riceverla in modo affidabile. Per evitare che availability e latency del downstream diventino parte del request path, scegliamo transazione locale, transactional outbox, delivery asincrona at-least-once e consumer idempotente.

Accettiamo eventual consistency, outbox, publisher, retry, DLQ, reconciliation e observability aggiuntiva. Non accettiamo perdita silenziosa dopo il local commit, side effect duplicato per la stessa `escalationId`, violazioni di tenant isolation o trasferimento accidentale dell’ownership economica a Order Operations.

I guardrail sono identity stabili, retry bounded con backoff/jitter, idempotent consumer, DLQ con owner, business delivery monitoring, reconciliation e Failure Mode Map. Riapriremo la decisione se throughput e lag renderanno insufficiente il polling, se la DLQ diventerà frequente, se nasceranno requisiti di replay/stream processing o ordering più forte, oppure se i workflow economici diventeranno davvero multi-step.

## Bridge al Capitolo 12

Abbiamo introdotto una capability distribuita senza scegliere ancora il prodotto cloud. È intenzionale: ora disponiamo di requisiti concreti su runtime, messaging, network, identity, secrets, storage, autoscaling e availability.

Nel **Capitolo 12 — Cloud Architecture** faremo quindi la domanda nel verso corretto:

> quali capability cloud hanno il fit migliore con il sistema che abbiamo già compreso?

Non: quali servizi cloud possiamo infilare nel diagramma?

## Corollario

> **Nel codice locale un errore interrompe una chiamata. In un sistema distribuito può interrompere la nostra conoscenza di ciò che è successo. Progettare quella incertezza è Software Architecture.**