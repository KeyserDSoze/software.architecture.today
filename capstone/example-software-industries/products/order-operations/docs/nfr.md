# Order Operations — Non-Functional Requirements

> Snapshot corrente del capstone simulato/composito di Example Software Industries S.p.A.

## Priorità attuali

1. correctness del dato operativo e delle intenzioni persistite;
2. security e access control;
3. reliability, operability e recovery;
4. observability sufficiente a misurare outcome e failure significativi;
5. latency adeguata al lavoro umano interattivo;
6. delivery affidabile delle integrazioni significative;
7. semplicità operativa e costo contenuto.

## Quality floor corrente

Non negoziabili:

- correttezza semantica degli stati mostrati;
- autenticazione della produzione;
- authorization server-side per capability, risorsa e tenant;
- niente dati cross-tenant;
- tracciabilità verso le fonti autorevoli;
- nessuna perdita silenziosa di una Payment Escalation dopo local commit;
- nessun side effect downstream duplicato per la stessa `EscalationId`;
- committed local state preservato nei failure coperti dalla HA;
- payload minimizzati;
- retry bounded;
- dead-letter path con ownership;
- business state distinto da integration delivery state;
- runtime identity senza ampi privilegi sul control plane;
- deployment identity distinta dal runtime;
- nessun production secret nel repository;
- audit delle operazioni sensibili;
- failure, degraded mode e recovery source espliciti;
- restore/recovery non dichiarati funzionanti senza evidence;
- SLI con measurement source esplicito;
- correlation sufficiente attraverso boundary sincroni e asincroni;
- metric dimensions bounded per default;
- access token, Authorization header e secret esclusi dai normali signal;
- alert urgenti con owner e azione esplicita;
- telemetry cost/cardinality soggetti a governance.

## Reliability targets — Capitolo 14

I target seguenti sono **requisiti simulati ESI**. Non sono benchmark universali e dovranno essere validati con workload e ambienti production-like.

### SLO-01 — Core operator journey

```text
99.9% good events
window: rolling 28 days
```

Il good-event model comprende almeno:

- accesso di un operatore valido;
- outcome semanticamente corretto;
- assenza di errori server inattesi;
- latency entro il threshold del flow;
- nessun dato noto come non affidabile presentato come current truth.

La definizione tecnica è governata dall'Observability Contract.

### SLO-02 — Durable Payment Escalation acceptance

Una richiesta valida deve produrre:

```text
PaymentEscalation + OutboxMessage committed atomically
```

oppure un rifiuto esplicito prima del commit.

Nessun partial commit silenzioso è accettabile.

### SLO-03 — Payment Escalation publication

```text
99% delle escalation accepted
published to broker within 5 minutes
```

Il target verrà raffinato con misure reali.

## Error budget

Per `SLO-01`:

```text
SLO 99.9%
→ error budget 0.1%
```

Direzione di policy:

- burn normale → normale release velocity;
- burn accelerato → reliability review e riduzione del change risk;
- budget esaurito → priorità a stability work, salvo security/emergency change.

Fonti:

- [Google SRE — Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)
- [Google SRE — Embracing Risk](https://sre.google/sre-book/embracing-risk/)

## Health model

Stati minimi:

```text
Healthy
Degraded
Unhealthy
```

La health è definita per critical flow e non come media della resource health.

Riferimento:

```text
docs/reliability-contract.md
```

### Degraded mode

Una dependency live può essere indisponibile senza rendere automaticamente inutile tutto il prodotto.

Il degraded mode deve però:

- dichiarare ciò che non è verificabile;
- preservare provenance/freshness;
- bloccare azioni che richiedono facts autorevoli mancanti;
- mantenere security/tenant boundary;
- produrre signal che permettano di sapere quando si entra e quando si esce dal degraded mode.

## Performance

La UI deve essere reattiva abbastanza da supportare investigazione operativa interattiva.

La Payment Escalation non deve attendere il processing completo di Payments & Risk dopo il local commit.

I threshold di latency verranno fissati con measurement production-like e collegati allo SLO.

## Availability / resilience

Produzione mantiene una topologia **single-region**, ma con resilience intra-region più forte.

Direzione corrente:

```text
App Service Premium v3
capacity >= 2
zone redundancy enabled

PostgreSQL Flexible Server
zone-redundant HA
backup / PITR

Service Bus Premium
zone redundancy enabled
```

Non esiste ancora un requisito che giustifichi active-active multi-region.

La disponibilità runtime di Payments & Risk non deve essere una precondizione per registrare localmente una Payment Escalation quando Order Operations e PostgreSQL sono disponibili.

Private DNS, identity e private network path sono failure domain espliciti.

## Recovery

### Intra-region target

```text
RTO core journey <= 15 min
RPO = 0 per committed OperationalCase / PaymentEscalation state
```

### Region-wide disaster target

```text
RTO <= 8 h
RPO <= 1 h
```

I target sono simulati ESI.

La recovery strategy deve includere:

- application rollback;
- PostgreSQL HA failover;
- PostgreSQL PITR/restore per logical corruption;
- outbox recovery;
- controlled redrive;
- reconciliation;
- known-good IaC/artifact;
- identity/network recovery coordination;
- synthetic critical-journey validation dopo recovery.

> Un backup non viene considerato recovery evidence finché il restore non viene provato.

## Required reliability drills

1. Payments consumer unavailable.
2. App instance loss.
3. PostgreSQL failover.
4. PostgreSQL logical restore/PITR.
5. Private DNS failure.
6. Bad deployment / rollback.

Ogni drill deve raccogliere actual recovery time, RPO osservato, manual step e unexpected behavior.

## Consistency

Per l'investigazione operativa le informazioni devono essere abbastanza aggiornate da non indurre azioni errate.

“Real time” non è accettato come requisito senza soglia e motivo.

### Payment Escalation

Accettiamo eventual consistency fra:

```text
PaymentEscalation Requested in Order Operations
```

e:

```text
escalation observed/processed by Payments & Risk
```

Il sistema deve convergere entro una business delivery policy osservabile.

## Idempotency

- stable `EscalationId` per la stessa intenzione business;
- stable `messageId` per republish/retry della stessa outbox entry;
- downstream duplicate tolerance in Payments & Risk.

Fonti:

- [Microsoft Learn — Idempotent Consumer](https://learn.microsoft.com/azure/architecture/patterns/idempotent-consumer)
- [Amazon Builders' Library — Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/)

## Retry / backoff

Policy obbligatorie:

```text
bounded attempts
error classification
exponential backoff
jitter
stable operation identity
no blind retry for deterministic failures
```

Retry e recovery load sono capacity consumer e devono essere inclusi nella reliability review.

## Backpressure / capacity

Segnali minimi:

```text
outbox pending count
outbox oldest age
publish throughput
queue depth / age
DLQ depth
business delivery latency
App Service saturation/headroom
PostgreSQL connection pressure
```

La queue non è un buffer infinito e non crea capacity downstream.

## Security

### Authentication / authorization

- produzione non anonima;
- Microsoft Entra ID per human identity nello scenario corrente;
- server-side authorization su capability, resource e tenant;
- negative cross-tenant e wrong-role test richiesti.

### Network exposure

- App Service private ingress;
- public network access disabilitato;
- private data-plane direction per PostgreSQL, Service Bus e Key Vault;
- VNet integration outbound;
- network location non considerata trusted per default.

### Identity / privilege

- managed identity quando supportato;
- runtime identity separata dalla deployment identity;
- runtime senza permission generiche di resource administration/RBAC;
- Service Bus producer send-only;
- privileged access separato e auditabile.

### Secrets / logging

- preferire identity/federation a secret statici;
- Key Vault per secret inevitabili;
- nessun production secret nel repository;
- telemetry allowlist/redaction;
- audit sensibile distinto dal normale application log.

### Secure SDLC

Baseline futura/verificabile:

- secret scanning;
- SCA/dependency review;
- SAST appropriato;
- protected production deployment;
- scoped/federated deployment identity;
- Bicep build/lint/policy validation;
- artifact provenance.

## Threat / control traceability

Artefatti:

```text
docs/threat-model.md
docs/security-control-matrix.md
docs/adr/0003-private-ingress-and-identity-first-security.md
```

Livelli di evidence:

```text
Designed
→ Codified
→ Verified
→ Monitored
```

## Observability — Capitolo 15

Artefatto:

```text
docs/observability-contract.md
```

### Signal model

Direzione:

```text
OpenTelemetry-compatible instrumentation
→ Azure Monitor / Application Insights / Log Analytics
```

Metrics, logs, traces e audit/business evidence non sono considerati intercambiabili.

### Correlation

Semantiche distinte:

```text
traceId       = execution identity
correlationId = flow correlation
messageId     = technical delivery identity
escalationId  = business intent identity
```

Un retry può cambiare trace senza cambiare la business identity.

### Cardinality

Metric dimensions devono essere bounded per default.

Non ammessi come metric dimensions senza eccezione esplicita:

```text
operatorId
orderId
caseId
escalationId
messageId
traceId
raw URL
free-text error
```

### Sampling

- SLI metric non devono dipendere dal trace sampling;
- audit evidence non segue automaticamente la stessa sampling policy dei trace diagnostici;
- trace sampling percentuale verrà scelta dopo volume/cost measurement;
- tail sampling resta trigger-driven.

### Alerting

Un page alert deve essere:

```text
urgent
actionable
owned
linked to impact/risk
```

Ogni page deve avere first action e runbook/context.

### Synthetic monitoring

Il workload ha private production ingress.

Non viene aperto un endpoint pubblico soltanto per facilitare un probe esterno.

Direzione:

```text
private synthetic runner
+ dedicated test identity
+ controlled synthetic data
+ approved private network path
```

Stato: `Designed`, non ancora codificato.

### Telemetry cost

Devono essere governati:

- ingestion volume;
- trace sampling;
- custom metric/cardinality;
- retention per classe;
- unused dashboards/alerts;
- debug logging lasciato attivo.

## Operability

Il team deve poter diagnosticare almeno:

- critical journey failure;
- dependency latency/unavailability;
- query lente e connection pressure;
- outbox bloccata;
- publish retry;
- backlog/lag;
- duplicate delivery;
- DLQ;
- reconciliation mismatch;
- authentication/authorization failure;
- public network drift;
- RBAC/deployment change privilegiati;
- failover/recovery event;
- synthetic journey failure;
- SLO/error-budget burn;
- telemetry pipeline failure distinta da zero traffic sano.

Failure Mode Map, Reliability Contract, Threat Model, Security Control Matrix e Observability Contract fanno parte del contract operativo.

## Maintainability

- confini Orders/Payments/Shipping leggibili;
- broker detail non trasformati in business model;
- security/reliability topology leggibile in IaC/documentazione;
- recovery procedure versionata;
- SLO e degraded mode revisionabili senza ricostruire il sistema da dashboard sparse;
- telemetry semantic contract separato dal vendor SDK;
- breaking change a metric/query/alert trattate come change operativo.

## Cost

La complessità infrastrutturale deve essere giustificata da requisito, threat, reliability target o bisogno investigativo.

Decisioni correnti:

- niente Redis soltanto per “essere pronti a scalare”;
- niente active-active multi-region senza RTO/RPO che lo richiedano;
- niente microservizi per moda;
- niente Kafka soltanto perché esiste un evento;
- polling publisher finché volume/latency non ne smentiscono il fit;
- Service Bus Premium accettato per Private Link;
- App Service Premium v3 + almeno due istanze accettato per zone redundancy;
- PostgreSQL zone-redundant HA accettato per proteggere local authoritative state;
- niente WAF finché non esiste public ingress che ne paghi il costo;
- niente full-retention di ogni trace/log senza una decisione di cost/retention.

## Compromesso corrente — Capitolo 15

**Esigenza:** misurare SLO, diagnosticare incidenti e supportare l'on-call.

**Tensione:** visibility profonda vs ingestion/storage cost, cardinality, data minimization e alert fatigue.

**Decisione:** Observability Contract, bounded metrics per SLI/alert, structured events, governed trace sampling, business/audit evidence separate, vendor-neutral telemetry port e private synthetic direction.

**Costo accettato:** non conservare ogni execution detail indefinitamente e richiedere correlation fra signal diversi per alcune investigazioni.

**Quality floor:** SLI misurabili, critical failure visibility, correlation, security redaction, auditability, actionable alerts e telemetry cost visibility.

**Guardrail:** cardinality budget, sampling policy, retention classes, alert quality review, owner/runbook, typed telemetry port e verification tests.

## Technology fit rule

> Non scegliere la tecnologia più impressionante. Scegli la risposta che ha il fit migliore con il problema reale.

Vale anche per observability: più log, più trace, più retention e più alert non equivalgono automaticamente a più conoscenza.

## Fonti metodologiche

- [OpenTelemetry — Documentation](https://opentelemetry.io/docs/)
- [OpenTelemetry — Signals](https://opentelemetry.io/docs/concepts/signals/)
- [Google SRE — Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)
- [Google SRE Workbook — Monitoring](https://sre.google/workbook/monitoring/)
- [Microsoft Learn — Application Insights overview](https://learn.microsoft.com/azure/azure-monitor/app/app-insights-overview)
- [Microsoft Learn — Azure Monitor OpenTelemetry](https://learn.microsoft.com/azure/azure-monitor/app/opentelemetry-overview)
- [Google SRE — Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)
- [Microsoft Learn — Azure Well-Architected Reliability](https://learn.microsoft.com/azure/well-architected/reliability/)
- [Microsoft Learn — Security design principles](https://learn.microsoft.com/azure/well-architected/security/principles)

Le fonti sostengono proprietà e metodo; i requisiti specifici di Order Operations restano simulati.