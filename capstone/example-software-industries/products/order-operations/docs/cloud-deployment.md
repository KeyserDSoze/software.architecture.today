# Order Operations — Cloud Deployment Map

> **Scenario fittizio ESI.** Stato corrente dopo i Capitoli 12–14. Le proprietà dei servizi Azure sono basate su documentazione ufficiale; requisiti, target e compromessi ESI restano simulati.

## Workload

**Order Operations** — Commerce & Operations.

## Business outcome

Ridurre il tempo necessario agli operatori per individuare, comprendere e gestire ordini che richiedono attenzione operativa, incluso l'invio di Payment Escalation durabili verso Payments & Risk.

## Cloud operating model

ESI usa Microsoft Azure per questo workload.

Order Operations vive in una **Azure application landing zone** fornita da Platform Engineering.

Platform fornisce guardrail e capability condivise; il workload team mantiene ownership end-to-end del prodotto.

## Artefatti collegati

```text
docs/threat-model.md
docs/security-control-matrix.md
docs/reliability-contract.md
docs/failure-mode-map.md
docs/adr/0002-azure-paas-single-region.md
docs/adr/0003-private-ingress-and-identity-first-security.md
infra/main.bicep
```

## Environments

```text
dev
staging
production
```

Architecture intent condiviso; SKU/capacity/redundancy possono differire soltanto in modo esplicito.

## Region strategy

### Produzione

```text
single Azure region
```

Non esiste ancora active-active multi-region.

### Reliability target

Intra-region:

```text
RTO core journey <= 15 min
RPO = 0 per committed local business state
```

Region-wide disaster:

```text
RTO <= 8 h
RPO <= 1 h
```

I target sono simulati ESI e spiegano perché compriamo resilience zonale ma non continuità active-active regionale.

## Compute

### HTTP API + related WebJob

**Azure App Service** con continuous WebJob per Outbox Publisher.

### Production reliability baseline

```text
Premium v3
capacity >= 2
zone redundancy enabled
```

La baseline è codificata in `infra/main.bicep`.

Motivazione:

- tollerare instance/zone failure meglio della precedente singola istanza;
- mantenere single-region;
- non introdurre Kubernetes o compute separato senza trigger.

### Trade-off

Più capacity fissa aumenta il costo.

La proprietà comprata è coerente con il failure target intra-region.

### Trigger di revisione compute

- API e publisher con scale profile divergenti;
- background workload interferisce con API;
- privilege isolation più forte;
- più worker indipendenti;
- container portability reale;
- SLO/capacity non soddisfatti.

## Human ingress

Produzione:

```text
ESI workforce
→ enterprise private access path
→ App Service private endpoint
→ Entra authentication
→ application authorization
```

- App Service public network disabled;
- private endpoint inbound;
- authentication obbligatoria;
- authorization server-side;
- network location non considerata trusted.

## Outbound / private dependencies

App Service usa VNet integration.

Landing zone fornisce:

```text
app integration subnet
private endpoint subnet
private DNS capability
shared routing/governance
```

Private DNS è un failure domain esplicito e deve entrare nei synthetic reliability check.

## PostgreSQL

**Azure Database for PostgreSQL Flexible Server**.

### Production direction

```text
zone-redundant HA
backup / point-in-time restore
private data-plane connectivity
single region
```

Lo schema `operations` contiene i dati posseduti da Order Operations.

### Evidence status

```text
Architecture decision: Designed
PostgreSQL HA/private IaC module: Pending
Failover test: Pending
PITR restore drill: Pending
```

La HA non sostituisce backup/restore per logical corruption.

### Non scelto

- Redis;
- search store dedicato;
- cross-region active-active database;
- read projection asincrona senza trigger.

## Messaging

Payment Escalation:

```text
Order Operations
→ transactional outbox
→ publisher
→ Azure Service Bus Queue
→ Payments & Risk
```

### Production baseline

```text
Service Bus Premium
private endpoint
local/SAS auth disabled
managed identity
send-only producer RBAC
zone redundancy enabled
```

La zone redundancy è codificata in `infra/main.bicep`.

### Cross-region

Non abilitiamo ancora Geo-Replication.

La durable outbox resta source di republish e i regional RTO/RPO correnti non richiedono immediate broker continuity.

Trigger:

- RTO regionale più severo;
- RPO messaggi più severo;
- contractual commitment;
- regional active-active strategy.

## Identity and secrets

### Human identity

Microsoft Entra ID.

### Runtime identity

System-assigned managed identity.

### Deployment identity

Separata dal runtime; CI/CD federation completa ancora da definire.

### Secrets

Azure Key Vault per secret inevitabili:

- RBAC;
- soft delete;
- purge protection;
- private endpoint;
- public access disabled.

## Reliability health model

Riferimento:

```text
docs/reliability-contract.md
```

Critical flow:

```text
CF-01 Investigation
CF-02 Payment Escalation acceptance
CF-03 Payment Escalation delivery
```

Health states:

```text
Healthy
Degraded
Unhealthy
```

La resource health Azure non è sufficiente per derivare la product health.

## Graceful degradation

### Live authoritative dependency unavailable

Order Operations può mantenere local-case visibility solo se:

- provenance/freshness sono esplicite;
- il dato non verificabile non è presentato come current truth;
- azioni che richiedono il fact mancante sono bloccate.

### Messaging/downstream unavailable

```text
CF-02 acceptance = può restare Healthy
CF-03 delivery = Degraded
```

La queue/outbox assorbono il delay entro un envelope governato; backlog e oldest age devono essere osservabili.

## Observability foundation

- Azure Monitor;
- Application Insights;
- Log Analytics;
- landing-zone logging.

Candidate signal da formalizzare nel Capitolo 15:

```text
core journey good-event ratio
core journey latency
synthetic journey success
App instance health/saturation
PostgreSQL connection pressure/failover
outbox pending/oldest age
Service Bus queue depth/age
DLQ depth
payment escalation delivery latency
auth/authz failures
private dependency connectivity
```

## IaC status

### Codified

`infra/main.bicep` contiene oggi:

- App Service Premium-compatible plan with capacity >= 2;
- App Service zone redundancy;
- managed identity;
- HTTPS/TLS baseline;
- Entra auth configuration;
- private App Service ingress;
- VNet integration;
- private Key Vault;
- Service Bus Premium + zone redundancy + private endpoint;
- send-only runtime RBAC;
- Log Analytics/Application Insights.

### Pending

- PostgreSQL resource/private networking/HA;
- private DNS zone group wiring specifico della landing zone;
- deployment identity completa;
- diagnostic settings completi;
- autoscale/headroom policy;
- health check path;
- recovery environment parameters;
- deployment slot/canary strategy.

`Codified` non significa `Verified`.

Bicep build/lint, non-production deployment e failure drill sono ancora evidence da produrre.

## Reliability drills

Required:

1. Payments consumer outage.
2. App instance loss.
3. PostgreSQL failover.
4. PostgreSQL PITR/restore.
5. Private DNS failure.
6. Bad deployment rollback.

## Cost drivers

- App Service Premium v3 + minimum instance capacity;
- PostgreSQL HA standby/backup;
- Service Bus Premium richiesto anche dalla private endpoint decision;
- log/telemetry ingestion;
- private networking;
- recovery environment quando introdotto.

Il costo è parte del workload e viene confrontato con SLO/RTO/RPO e threat model.

## Ownership

### Platform Engineering

- landing zone;
- private DNS/network foundation;
- policy;
- privileged cloud recovery path;
- shared monitoring.

### Order Operations

- application/runtime;
- SLO/health model;
- App Service/WebJob config;
- database schema/sizing;
- queue semantics;
- application rollback;
- outbox recovery;
- reconciliation;
- restore validation;
- cost e on-call.

### Payments & Risk

- consumer recovery;
- downstream idempotency;
- payment workflow state.

### Security

- threat/control baseline;
- privileged identity/break-glass governance.

## Open decisions

1. Azure region concreta.
2. PostgreSQL HA/private Bicep module.
3. backup retention.
4. App Service autoscale/headroom.
5. health endpoint/readiness design.
6. exact SLI/latency thresholds.
7. burn-rate alert policy.
8. regional recovery runbook/environment.
9. deployment strategy.
10. log retention/cost budget.
11. federated CI/CD identity.
12. quantitative rate/abuse limits.

## Review triggers

Rivalutare questa mappa quando cambia:

- SLO;
- RTO/RPO;
- data residency;
- scale profile;
- worker topology;
- consumer topology;
- security constraint;
- platform standard;
- region strategy;
- cost curve;
- recovery drill result;
- operational ownership.

## Fonti

- [Microsoft Learn — Azure landing zones](https://learn.microsoft.com/azure/cloud-adoption-framework/ready/landing-zone/)
- [Microsoft Learn — Reliability in App Service](https://learn.microsoft.com/azure/reliability/reliability-app-service)
- [Microsoft Learn — Configure App Service zone redundancy](https://learn.microsoft.com/azure/app-service/configure-zone-redundancy)
- [Microsoft Learn — PostgreSQL High Availability](https://learn.microsoft.com/azure/postgresql/high-availability/concepts-high-availability)
- [Microsoft Learn — PostgreSQL business continuity](https://learn.microsoft.com/azure/postgresql/backup-restore/concepts-business-continuity)
- [Microsoft Learn — Reliability in Service Bus](https://learn.microsoft.com/azure/reliability/reliability-service-bus)
- [Microsoft Learn — Service Bus Private Link](https://learn.microsoft.com/azure/service-bus-messaging/private-link-service)
- [Google SRE — Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)

Le fonti descrivono capability e metodo. La topologia e i target ESI restano decisioni simulate.