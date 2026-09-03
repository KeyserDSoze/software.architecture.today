# Order Operations — Failure Mode Map

> **Scenario fittizio ESI.** Stato corrente dopo il Capitolo 14.

La mappa nasce nel Capitolo 11 per il flow di Payment Escalation e viene estesa nel Capitolo 14 al workload cloud complessivo.

## Critical flows

### CF-01 — Investigation

```text
Operations Operator
→ authentication / authorization
→ Order Operations
→ local OperationalCase state
→ authoritative read dependencies
→ operational view
```

### CF-02 — Payment Escalation acceptance

```text
Operations Operator
→ request Payment Escalation
→ Order Operations local transaction
  ├── PaymentEscalation
  └── OutboxMessage
→ 202 Accepted
```

### CF-03 — Payment Escalation delivery

```text
Outbox Publisher
→ Azure Service Bus Queue
→ Payments & Risk consumer
→ Payments & Risk local state/workflow
```

## Business intent

- mantenere il core operator journey disponibile entro il reliability target;
- registrare rapidamente e in modo auditabile una Payment Escalation senza rendere Payments & Risk parte del critical acceptance path;
- rendere visibili degradation, backlog e recovery state;
- preservare ownership e semantica anche durante i failure.

## Quality floor

Non negoziabili:

- tenant isolation;
- stable `escalationId`;
- local commit e publication intent nella stessa transaction;
- nessuna perdita silenziosa fra commit e outbox;
- redelivery tollerata;
- nessun workflow downstream duplicato per la stessa escalation;
- committed local business state preservato nei failure coperti dalla HA;
- payload minimizzato;
- correlation end-to-end;
- failure/degradation osservabile;
- DLQ con ownership;
- recovery source nota;
- security boundary non disabilitato come shortcut di availability;
- Payments & Risk mantiene ownership economica.

## Reliability targets

Riferimento principale:

```text
docs/reliability-contract.md
```

Target simulati ESI correnti:

```text
Core operator journey SLO: 99.9% / rolling 28 days
Escalation publication: 99% entro 5 min
Intra-region RTO: <= 15 min
Intra-region RPO: 0 per committed local state
Region disaster RTO: <= 8 h
Region disaster RPO: <= 1 h
```

## Failure modes — application e messaging

| Step | Failure | Known outcome? | Persisted state | Retry owner | Idempotency | User/business impact | Recovery | Owner |
|---|---|---|---|---|---|---|---|---|
| API validation | case inesistente / categoria non Payment / permission negata | known failure | nessuna escalation | none | n/a | request rejected | correggere condizione/input | Order Operations |
| local transaction | DB unavailable | known failure | nessun nuovo stato | API/application bounded | same escalation intent | escalation non accettata | retry con stesso intent | Order Operations |
| local transaction | concurrency conflict | known failure | nessun partial commit | application | stable escalationId | operator deve rileggere/riprovare | conditional retry | Order Operations |
| post-commit | process crash dopo commit | known local success | escalation + outbox pending | publisher after restart | stable messageId | delivery ritardata | publisher riprende outbox | Order Operations |
| publisher | messaging unavailable | known publish failure | outbox pending | publisher | same messageId | delivery lag | bounded retry + backoff/jitter | Order Operations / Platform |
| publish acknowledgement | ack perso | unknown publish outcome | outbox può risultare pending | publisher | same messageId | possibile duplicate delivery | republish + consumer idempotency | Order Operations |
| broker delivery | redelivery | known duplicate possibility | broker state | broker/consumer | escalationId dedup | nessun duplicate business effect atteso | ack dopo idempotent processing | Payments & Risk |
| consumer | Payments DB unavailable | known downstream failure | no downstream commit | broker/consumer bounded | escalationId | delivery lag | retry; eventual DLQ | Payments & Risk |
| consumer validation | unsupported schema / invalid contract | known failure | no downstream business state | no blind retry | n/a | integration incident | DLQ/quarantine + alert | Payments & Risk + producer owner |
| consumer transaction | commit succeeds, ack lost | unknown to broker | downstream workflow exists | broker redelivery | escalationId dedup | duplicate technical delivery | idempotent no-op + ack | Payments & Risk |
| retries exhausted | persistent failure | known delivery failure | source escalation remains Requested | no automatic infinite retry | stable IDs preserved | escalation non consegnata | DLQ + controlled redrive | Payments & Risk / Operations |
| business timeout | pending/delayed oltre soglia | known delay | escalation Requested + delivery incomplete | policy dependent | stable IDs | operator/supervisor deve sapere | escalation operativa + reconciliation | Operations |
| reconciliation | source/downstream mismatch | known divergence | stati confrontabili | controlled | escalationId | hidden integration defect discovered | republish/investigate/manual action | Joint owner |

## Failure modes — workload/cloud

| Failure | Affected flow | Expected health | Automatic behavior | Manual/recovery behavior | Owner |
|---|---|---|---|---|---|
| App Service instance loss | CF-01, CF-02, publisher depending on placement | Healthy or brief Degraded | other instance continues; platform routing | investigate SLO burn/capacity | workload + Platform |
| App Service zone loss | CF-01, CF-02 | Healthy/Degraded within target | zone-redundant plan serves from surviving zone | verify headroom and platform state | workload + Platform |
| App bad deployment | all app flows | potentially Unhealthy | none guaranteed | rollback known-good artifact | workload |
| PostgreSQL primary/node failure | CF-01 local state, CF-02, outbox | Degraded | managed HA failover when configured | verify reconnect/RTO/data | workload + Azure platform |
| PostgreSQL zone failure | CF-01/CF-02/outbox | Degraded | zone-redundant standby failover | verify recovery evidence | workload + Azure platform |
| PostgreSQL logical corruption | all local authoritative state | Unhealthy | HA may replicate corruption | PITR/restore + validation + cutover | workload |
| Service Bus transient outage | CF-03 | Degraded | outbox remains durable; publisher retries bounded | reconcile if prolonged | workload + Platform |
| Service Bus zone issue | CF-03 | expected resilient | Service Bus zone-redundant namespace | verify queue health / backlog | Platform + workload |
| Payments consumer unavailable | CF-03 | Degraded | queue buffers within capacity | Payments recovery / DLQ handling | Payments & Risk |
| Entra identity incident | CF-01/CF-02 user access | Degraded/Unhealthy | valid-session behavior depends on token state | coordinate identity incident; no auth bypass | Security + Platform + workload |
| Private DNS failure | private dependency access | Degraded/Unhealthy | none guaranteed | rollback/config recovery; synthetic validation | Platform + workload |
| Key Vault unavailable | only secret-dependent runtime paths | flow-specific Degraded | cached/runtime behavior depends on implementation | restore dependency; avoid auth bypass | Platform + workload |
| telemetry backend unavailable | observability | functional flow may remain Healthy | application should not fail solely for telemetry sink | preserve local behavior; recover telemetry path | workload + Platform |
| landing-zone network config error | multiple private paths | Degraded/Unhealthy | depends on platform safeguards | last-known-good / rollback / incident response | Platform |
| region outage | all workload services | Unhealthy | no active secondary region today | execute regional recovery plan | joint ESI owners |

## State model

### Business state

```text
PaymentEscalation.status
= Requested
```

Future acceptance/rejection/closed states verranno introdotti quando Payments & Risk e Commerce & Operations ne definiranno la semantica.

### Delivery state

```text
Pending
Delivered
Delayed
DeadLettered
```

`delivery_state` non sostituisce lo stato business.

### Workload health state

```text
Healthy
Degraded
Unhealthy
```

La health del workload non è la media della resource health.

È derivata dai critical flow definiti nel Reliability Contract.

## Graceful degradation

### Authoritative read dependency unavailable

Consentito:

- mostrare stato locale disponibile;
- indicare chiaramente la dependency non disponibile;
- mantenere provenance/freshness esplicite.

Non consentito:

- mostrare dati stale come current truth;
- consentire azioni che richiedono facts autorevoli mancanti.

### Payment delivery unavailable

Consentito:

- accettare localmente l'escalation se PostgreSQL è healthy;
- mantenere `Pending`/`Delayed`;
- drenare backlog dopo recovery.

Obbligatorio:

- oldest age visibile;
- business delay threshold;
- reconciliation;
- bounded retry.

## Retry policy

Principi obbligatori:

```text
bounded attempts
error classification
exponential backoff
jitter
same messageId on republish
no blind retry for deterministic rejection
business delay budget separate from retry count
```

Fonti:

- [Microsoft Learn — Retry pattern](https://learn.microsoft.com/azure/architecture/patterns/retry)
- [AWS — Exponential Backoff And Jitter](https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/)

## Ordering

Nessun ordering globale richiesto nella v1.

Se emergono più eventi sullo stesso case con dipendenze semantiche:

```text
ordering key candidate = caseId
version candidate = caseVersion
```

La garanzia verrà introdotta soltanto con un requisito concreto.

## Backpressure / capacity

Segnali minimi:

```text
outbox pending count
outbox oldest age
publisher throughput
queue depth
queue oldest age
DLQ depth
business delivery latency
App Service saturation/headroom
PostgreSQL connection pressure
```

La queue non viene trattata come capacità infinita.

## Dead-letter policy

La DLQ deve avere:

```text
owner
alert
retention
redrive policy
business visibility
```

Un redrive deve:

- avvenire dopo causa compresa/risolta;
- preservare identità del messaggio/intento;
- essere idempotente;
- produrre audit/telemetry;
- non modificare manualmente la semantica senza una nuova decisione.

## Reconciliation

Guardrail iniziale:

```text
PaymentEscalation Requested
AND DeliveryState != Delivered
AND age > business threshold
→ reconciliation candidate
```

## Recovery sources

| State/capability | Recovery source |
|---|---|
| OperationalCase | PostgreSQL primary/backup/PITR |
| PaymentEscalation | PostgreSQL primary/backup/PITR |
| publication intent | outbox |
| broker delivery | republish from durable outbox |
| Payments workflow | Payments & Risk authoritative state |
| infrastructure | versioned IaC + landing-zone baseline |
| application | trusted build artifact |

## Reliability drills

Required scenarios:

1. Payments consumer unavailable.
2. App instance loss.
3. PostgreSQL failover.
4. PostgreSQL logical restore/PITR.
5. Private DNS failure.
6. Bad application deployment / rollback.

Ogni drill deve produrre:

```text
expected
actual
recovery duration
RPO observed
manual steps
unexpected behavior
action items
```

## Observability requirements

Candidate signals:

```text
core_journey_good_event_ratio
core_journey_latency
order_operations_outbox_pending
order_operations_outbox_oldest_age_seconds
order_operations_outbox_publish_failures_total
order_operations_payment_escalation_delivery_seconds
payments_escalation_dlq_depth
postgres_failover_events
postgres_connection_pressure
app_instance_health
synthetic_investigation_success
synthetic_escalation_acceptance_success
```

I nomi finali entreranno nell'Observability Contract del Capitolo 15.

## Open decisions

- region concreta;
- health endpoint/readiness design;
- App Service autoscale/headroom policy;
- PostgreSQL HA IaC implementation;
- backup retention finale;
- regional recovery environment;
- exact SLI queries;
- burn-rate alert policy;
- consumer acknowledgement evidence;
- outbox/DLQ retention;
- automatic vs manual redrive;
- deployment slot/canary strategy;
- alert routing e on-call ownership.

## Regola

> **Il sistema non è resiliente perché possiede un meccanismo di failover. È resiliente quando conosciamo il failure, il comportamento atteso, il recovery source e abbiamo evidence che il contratto regge.**