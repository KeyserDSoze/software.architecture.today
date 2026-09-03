# Order Operations — Non-Functional Requirements

> Snapshot corrente del capstone simulato/composito di Example Software Industries S.p.A.

## Priorità attuali

1. correctness del dato operativo e delle intenzioni persistite;
2. access control;
3. operability e recovery;
4. latency adeguata al lavoro umano interattivo;
5. delivery affidabile delle integrazioni significative;
6. availability ragionevole per uno strumento interno;
7. semplicità operativa e costo contenuto.

## Quality floor corrente

Per la fase attuale consideriamo non negoziabili:

- correttezza semantica degli stati mostrati;
- controllo degli accessi;
- tracciabilità verso le fonti autorevoli;
- capacità di diagnosticare failure significativi;
- assenza di automazioni economiche senza semantica e autorizzazioni definite;
- nessuna perdita silenziosa di una Payment Escalation dopo local commit;
- nessun side effect downstream duplicato per la stessa `EscalationId`;
- payload di integrazione minimizzati;
- retry bounded;
- dead-letter path con ownership;
- capacità di distinguere business state e integration delivery state.

Le soglie quantitative verranno definite quando esisteranno workload e ambiente misurabili.

## Performance

La UI deve essere abbastanza reattiva da supportare investigazione operativa interattiva.

La richiesta di Payment Escalation non deve attendere l'elaborazione completa di Payments & Risk dopo che la transazione locale è stata accettata.

Non introduciamo numeri fittizi come se fossero misurazioni reali. Le soglie quantitative verranno definite quando il capstone avrà un workload e un ambiente misurabile.

## Availability

Il sistema deve supportare il lavoro operativo durante le finestre previste, ma non esiste ancora un requisito che giustifichi active-active multi-region.

La disponibilità runtime di Payments & Risk non deve essere una precondizione per registrare localmente una Payment Escalation quando Order Operations e il proprio datastore sono disponibili.

## Recovery

RTO e RPO del prodotto devono essere esplicitati prima della produzione reale.

Per il nuovo flusso asincrono sono già significativi:

- recovery del polling publisher dopo restart;
- redelivery tollerata;
- dead-letter recovery;
- controlled redrive;
- reconciliation delle escalation non consegnate;
- preservazione di `messageId`/`escalationId` durante recovery.

## Consistency

Per l'investigazione operativa preferiamo informazioni sufficientemente aggiornate da non indurre azioni errate.

La freshness richiesta deve essere definita per capability; “real time” non è accettato come requisito senza una soglia e un motivo.

### Payment Escalation consistency

Accettiamo eventual consistency tra:

```text
PaymentEscalation Requested in Order Operations
```

e:

```text
escalation observed/processed by Payments & Risk
```

Il sistema deve però convergere secondo una business delivery policy osservabile.

Il numero di retry tecnici non sostituisce il business delay budget.

## Idempotency

La stessa intenzione di Payment Escalation deve mantenere una `EscalationId` stabile.

La stessa outbox entry mantiene un `messageId` stabile durante republish/retry.

Payments & Risk deve rendere innocua la redelivery della stessa escalation.

Riferimenti:

- [Microsoft Learn — Idempotent Consumer pattern](https://learn.microsoft.com/azure/architecture/patterns/idempotent-consumer)
- [Amazon Builders' Library — Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/)

## Retry / backoff

Policy obbligatorie:

```text
bounded attempts
error classification
exponential backoff
jitter
stable operation identity
no blind retry for deterministic validation/business failures
```

Le soglie concrete verranno definite dopo scelta di runtime/broker e workload measurement.

Riferimenti:

- [Microsoft Learn — Retry pattern](https://learn.microsoft.com/azure/architecture/patterns/retry)
- [AWS — Exponential Backoff And Jitter](https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/)

## Backpressure / backlog

Il sistema asincrono deve poter rendere visibili almeno:

```text
outbox pending count
outbox oldest age
publish throughput
consumer lag / queue age
DLQ depth
business delivery latency
```

La messaging capability non viene trattata come buffer infinito.

Capacity e scaling policy verranno definite insieme al deployment cloud.

## Ordering

La v1 non richiede ordering globale.

Se emergono eventi multipli sullo stesso `OperationalCase` con dipendenze semantiche, la requirement verrà definita in termini di ordering minimo necessario, per esempio `caseId` + versione.

## Security

- accesso autenticato;
- autorizzazione per ruolo/capability;
- niente dati cross-tenant;
- audit delle azioni che modificano stato operativo;
- allineamento con policy ESI condivise;
- least privilege su publish/consume;
- nessun secret nei payload;
- payload minimizzato;
- log e DLQ soggetti a data classification e retention;
- replay/redrive controllato.

## Operability

Il team deve poter diagnosticare:

- errori applicativi;
- dipendenze lente o indisponibili;
- query lente;
- fallimenti di integrazione;
- divergenze tra stato mostrato e dati autorevoli;
- outbox bloccata;
- publish retry;
- backlog/lag;
- duplicate delivery;
- DLQ;
- reconciliation mismatch.

La Failure Mode Map è parte del contract operativo del flusso distribuito.

## Maintainability

I confini tra Orders, Payments e Shipping devono restare leggibili e verificabili nel codice.

La messaging infrastructure non deve trasformare event schema e broker-specific detail in business model.

Il primo publisher resta broker-agnostico tramite port esplicito; il Capitolo 12 sceglierà l'adapter infrastrutturale.

## Cost

La complessità infrastrutturale deve essere giustificata da requisiti misurabili.

Decisioni attuali:

- niente Redis soltanto per “essere pronti a scalare”;
- niente active-active multi-region senza requisito;
- niente microservizi per sola moda architetturale;
- niente Kafka/event-streaming platform soltanto perché abbiamo introdotto un evento;
- polling publisher iniziale invece di CDC finché volume e latency non ne giustificano il costo.

## Compromesso corrente — Capitolo 11

**Esigenza:** l'operatore deve poter registrare una Payment Escalation rapidamente e Payments & Risk deve riceverla in modo affidabile.

**Tensione:** availability/latency del request path vs consistenza immediata con il downstream e semplicità sincrona.

**Decisione:** local transaction + transactional outbox + delivery asincrona at-least-once + consumer idempotente.

**Costo accettato:** eventual consistency, outbox, publisher, retry, DLQ, stato di delivery, reconciliation e nuovi segnali operativi.

**Quality floor:** nessuna perdita silenziosa dopo local commit; nessun duplicate business effect per la stessa escalation; access control e ownership economica non vengono bypassati.

**Guardrail:** stable IDs, bounded retry/backoff/jitter, event contract, Failure Mode Map, DLQ ownership, reconciliation e business delivery monitoring.

## Technology fit rule

> Non scegliere la tecnologia più impressionante. Scegli la risposta che ha il fit migliore con il problema reale.

Le scelte verranno rivalutate quando cambieranno requisiti, volume, team, rischio o vincoli.

## Fonti metodologiche

- [Azure Application Architecture Fundamentals](https://learn.microsoft.com/azure/architecture/guide/)
- [Azure Architecture Design Principles](https://learn.microsoft.com/azure/architecture/guide/design-principles/)
- [Microsoft Learn — Transactional Outbox](https://learn.microsoft.com/azure/architecture/databases/guide/transactional-outbox-cosmos)
- [Microsoft Learn — Idempotent Consumer](https://learn.microsoft.com/azure/architecture/patterns/idempotent-consumer)
- [AWS Well-Architected — Control and limit retries](https://docs.aws.amazon.com/wellarchitected/latest/framework/rel_mitigate_interaction_failure_limit_retries.html)
- [AWS Well-Architected — Evaluate trade-offs](https://docs.aws.amazon.com/wellarchitected/latest/performance-efficiency-pillar/perf_architecture_evaluate_trade_offs.html)

Queste fonti sostengono proprietà e metodo; i requisiti specifici di Order Operations restano simulati.