# Order Operations — Non-Functional Requirements

> Snapshot corrente del capstone simulato/composito di Example Software Industries S.p.A.

## Priorità attuali

1. correctness del dato operativo e delle intenzioni persistite;
2. security e access control;
3. reliability, operability e recovery;
4. latency adeguata al lavoro umano interattivo;
5. delivery affidabile delle integrazioni significative;
6. semplicità operativa e costo contenuto.

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
- restore/recovery non dichiarati funzionanti senza evidence.

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

La definizione tecnica esatta entrerà nell'Observability Contract.

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

Fonte metodologica:

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
- mantenere security/tenant boundary.

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
- synthetic journey failure.

Failure Mode Map, Reliability Contract, Threat Model e Security Control Matrix fanno parte del contract operativo.

## Maintainability

- confini Orders/Payments/Shipping leggibili;
- broker detail non trasformati in business model;
- security/reliability topology leggibile in IaC/documentazione;
- recovery procedure versionata;
- SLO e degraded mode revisionabili senza ricostruire il sistema da dashboard sparse.

## Cost

La complessità infrastrutturale deve essere giustificata da requisito, threat o reliability target.

Decisioni correnti:

- niente Redis soltanto per “essere pronti a scalare”;
- niente active-active multi-region senza RTO/RPO che lo richiedano;
- niente microservizi per moda;
- niente Kafka soltanto perché esiste un evento;
- polling publisher finché volume/latency non ne smentiscono il fit;
- Service Bus Premium accettato per Private Link;
- App Service Premium v3 + almeno due istanze accettato per zone redundancy;
- PostgreSQL zone-redundant HA accettato per proteggere local authoritative state;
- niente WAF finché non esiste public ingress che ne paghi il costo.

## Compromesso corrente — Capitolo 14

**Esigenza:** mantenere Order Operations utilizzabile durante failure comuni e recuperabile durante failure più ampi.

**Tensione:** stronger availability/recovery vs cloud cost, operational complexity e delivery speed.

**Decisione:** zone-redundant App Service con almeno due istanze, PostgreSQL zone-redundant HA, backup/PITR, Service Bus zonal resilience, SLO/health model e recovery drill; il workload resta single-region.

**Costo accettato:** maggior costo compute/database e regional recovery non immediato.

**Quality floor:** committed local state protetto nei failure HA coperti; failure/degradation osservabili; restore con owner/evidence; security boundary non disabilitati per availability.

**Guardrail:** Reliability Contract, Failure Mode Map, error budget, restore drill, game day, IaC e review trigger.

## Technology fit rule

> Non scegliere la tecnologia più impressionante. Scegli la risposta che ha il fit migliore con il problema reale.

Vale anche per reliability: `multi-region`, `HA`, `replica`, `queue` e `circuit breaker` devono poter dire quale failure/SLO stanno pagando.

## Fonti metodologiche

- [Google SRE — Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)
- [Google SRE — Embracing Risk](https://sre.google/sre-book/embracing-risk/)
- [Microsoft Learn — Azure Well-Architected Reliability](https://learn.microsoft.com/azure/well-architected/reliability/)
- [Microsoft Learn — Health modeling](https://learn.microsoft.com/azure/well-architected/design-guides/health-modeling)
- [Microsoft Learn — Reliability in App Service](https://learn.microsoft.com/azure/reliability/reliability-app-service)
- [Microsoft Learn — PostgreSQL High Availability](https://learn.microsoft.com/azure/postgresql/high-availability/concepts-high-availability)
- [Microsoft Learn — Reliability in Service Bus](https://learn.microsoft.com/azure/reliability/reliability-service-bus)
- [Microsoft Learn — Security design principles](https://learn.microsoft.com/azure/well-architected/security/principles)
- [NIST SP 800-218 — SSDF](https://csrc.nist.gov/pubs/sp/800/218/final)
- [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/)

Le fonti sostengono proprietà e metodo; i requisiti specifici di Order Operations restano simulati.