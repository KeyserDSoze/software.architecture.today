# Order Operations — Failure Mode Map

> **Scenario fittizio ESI.** Stato corrente dopo il Capitolo 11.

## Critical flow

```text
Operations Operator
→ request Payment Escalation
→ Order Operations local transaction
  ├── PaymentEscalation
  └── OutboxMessage
→ Outbox Publisher
→ Enterprise Messaging Capability
→ Payments & Risk consumer
→ Payments & Risk local state/workflow
```

## Business intent

Registrare rapidamente e in modo auditabile una richiesta di attenzione verso Payments & Risk senza rendere la disponibilità runtime del downstream parte del critical request path dell'operatore.

## Quality floor

Non negoziabili:

- tenant isolation;
- stable `escalationId`;
- local commit e publication intent nella stessa transaction;
- nessuna perdita silenziosa fra commit e outbox;
- redelivery tollerata;
- nessun workflow downstream duplicato per la stessa escalation;
- payload minimizzato;
- correlation end-to-end;
- failure delivery osservabile;
- DLQ con ownership;
- Payments & Risk mantiene ownership economica.

## Failure modes

| Step | Failure | Known outcome? | Persisted state | Retry owner | Idempotency | User/business impact | Recovery | Owner |
|---|---|---|---|---|---|---|---|---|
| API validation | case inesistente / categoria non Payment / permission negata | known failure | nessuna escalation | none | n/a | request rejected | correggere condizione/input | Order Operations |
| local transaction | DB unavailable | known failure | nessun nuovo stato | API/application bounded | same escalation intent | escalation non accettata | retry con stesso intent | Order Operations |
| local transaction | concurrency conflict | known failure | dipende dal commit; nessun partial commit | application | stable escalationId | operator deve rileggere/riprovare | conditional retry | Order Operations |
| post-commit | process crash dopo commit | known local success | escalation + outbox pending | publisher after restart | stable messageId | delivery ritardata | publisher riprende outbox | Order Operations |
| publisher | messaging unavailable | known publish failure | outbox pending | publisher | same messageId | delivery lag | bounded retry + backoff/jitter | Order Operations / Platform |
| publish acknowledgement | ack perso | unknown publish outcome | outbox può risultare pending | publisher | same messageId | possibile duplicate delivery | republish + consumer idempotency | Order Operations |
| broker delivery | redelivery | known duplicate possibility | broker state | broker/consumer | escalationId dedup | nessun duplicate business effect atteso | ack dopo idempotent processing | Payments & Risk |
| consumer | Payments DB unavailable | known downstream failure | no downstream commit | broker/consumer bounded | escalationId | delivery lag | retry; eventual DLQ | Payments & Risk |
| consumer validation | unsupported schema / invalid contract | known failure | no downstream business state | no blind retry | n/a | integration incident | DLQ/quarantine + alert | Payments & Risk + producer owner |
| consumer transaction | commit succeeds, ack lost | unknown to broker, known downstream after reconciliation | downstream workflow exists | broker redelivery | escalationId dedup | duplicate technical delivery | idempotent no-op + ack | Payments & Risk |
| retries exhausted | persistent failure | known delivery failure | source escalation remains Requested | no automatic infinite retry | stable IDs preserved | escalation non consegnata | DLQ + manual/controlled redrive | Payments & Risk / Operations |
| business timeout | oldest pending/delayed oltre soglia | known delay | escalation Requested + delivery incomplete | policy dependent | stable IDs | operator/supervisor deve sapere | escalation operativa + reconciliation | Operations |
| reconciliation | source/downstream mismatch | known divergence | entrambi gli stati confrontabili | controlled | escalationId | hidden integration defect discovered | republish/investigate/manual action | Joint owner |

## State model

### Business state

```text
PaymentEscalation.status
= Requested
```

La v1 modella soltanto la richiesta iniziale.

Future acceptance/rejection/closed states verranno introdotti quando Payments & Risk e Commerce & Operations ne definiranno la semantica.

### Delivery state

```text
Pending
Delivered
Delayed
DeadLettered
```

`delivery_state` non sostituisce lo stato business.

## Retry policy — design intent

I numeri finali verranno configurati e misurati quando verrà scelto il runtime/broker.

Principi obbligatori:

```text
bounded attempts
exponential backoff
jitter
same messageId on republish
no retry for deterministic schema/business rejection
business delay budget separate from retry count
```

Fonti:

- [Microsoft Learn — Retry pattern](https://learn.microsoft.com/azure/architecture/patterns/retry)
- [Microsoft Learn — Transient fault handling](https://learn.microsoft.com/azure/architecture/best-practices/transient-faults)
- [AWS — Exponential Backoff And Jitter](https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/)

## Ordering

Nessun ordering globale richiesto nella v1.

Se emergono più eventi dello stesso case con dipendenze semantiche:

```text
ordering key candidate = caseId
version candidate = caseVersion
```

La garanzia verrà introdotta soltanto con un requisito concreto.

## Backpressure

Segnali minimi da rendere osservabili:

```text
outbox pending count
outbox oldest age
publisher throughput
consumer lag / queue age
DLQ depth
DLQ oldest age
business delivery latency
```

La queue non viene trattata come buffer infinito.

La capacity policy verrà definita nel deployment/cloud chapter e verificata con workload reali del capstone.

## Dead-letter policy

Un messaggio può entrare nel dead-letter path quando:

- retry transient sono esauriti;
- schema/versione non è processabile;
- il messaggio è deterministicamente invalido;
- una policy del consumer richiede quarantine.

La DLQ deve conservare almeno:

```text
messageId
escalationId
correlationId
firstSeen
lastAttempt
attemptCount
failureClass
lastError sanitizzato
```

### Ownership

Primary technical owner:

```text
Payments & Risk integration consumer
```

Joint business visibility:

```text
Commerce & Operations
```

### Redrive

Un redrive deve:

- avvenire solo dopo causa compresa/risolta;
- preservare identità del messaggio/intento;
- essere idempotente;
- produrre audit/telemetry;
- non modificare manualmente payload e semantica senza una nuova decisione.

## Reconciliation

Guardrail iniziale:

```text
PaymentEscalation Requested
AND DeliveryState != Delivered
AND age > business threshold
→ reconciliation candidate
```

Quando Payments & Risk esporrà acknowledgement o inbox evidence, la reconciliation userà `escalationId` come chiave primaria di confronto.

## Compensation

Nessuna compensation business è richiesta per il flusso v1.

Se la delivery fallisce, la strategia preferita è forward recovery:

```text
retry
→ controlled redrive
→ reconciliation
→ manual escalation
```

Non annulliamo automaticamente la richiesta di escalation locale perché il downstream è temporaneamente indisponibile.

## Irreversible steps

Nessun side effect economico è consentito a Order Operations nel flusso v1.

Se un futuro workflow introdurrà refund/capture/provider action, la Failure Mode Map dovrà essere estesa prima dell'implementazione.

## Manual intervention

Richiesta quando:

- messaggio critico resta in DLQ;
- business delivery threshold viene superato;
- reconciliation non può determinare lo stato corretto;
- schema/contract mismatch richiede decisione;
- downstream segnala rejection funzionale non automaticamente risolvibile.

## Observability requirements

Candidate signals:

```text
order_operations_outbox_pending
order_operations_outbox_oldest_age_seconds
order_operations_outbox_publish_attempts_total
order_operations_outbox_publish_failures_total
order_operations_payment_escalation_delivery_seconds
order_operations_payment_escalation_delayed_total
payments_escalation_duplicate_total
payments_escalation_dlq_depth
payments_escalation_reconciliation_mismatch_total
```

I nomi metrici finali saranno definiti nell'Observability Contract del Capitolo 15.

## Open decisions

- cloud/broker product;
- retry count/intervalli concreti;
- business delivery target;
- acknowledgement applicativo da Payments;
- schema registry sì/no;
- retention outbox published;
- retention DLQ;
- consumer inbox/dedup storage;
- escalation acceptance/rejection lifecycle;
- alert routing e on-call ownership;
- automatic vs manual redrive.

## Regola

> **Il flusso non è production-ready finché sappiamo disegnare soltanto come il messaggio passa. Deve essere altrettanto chiaro che cosa succede quando non passa.**