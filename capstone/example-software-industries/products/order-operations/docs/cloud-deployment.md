# Order Operations — Cloud Deployment Map

> **Scenario fittizio ESI.** Questo documento descrive la deployment topology decisa nel Capitolo 12. Le proprietà dei servizi Azure sono basate su documentazione ufficiale; i requisiti ESI restano simulati.

## Workload

**Order Operations** — Commerce & Operations.

## Business outcome

Ridurre il tempo necessario agli operatori per individuare, comprendere e gestire ordini che richiedono attenzione operativa, incluso l'invio di Payment Escalation durabili verso Payments & Risk.

## Cloud constraint

ESI usa Microsoft Azure come cloud enterprise principale per questo workload.

Order Operations viene deployed dentro una **Azure application landing zone** fornita da Platform Engineering.

La landing zone fornisce guardrail e capability condivise. Non trasferisce l'ownership del workload a Platform.

## Environments

Direzione corrente:

```text
dev
staging
production
```

Gli ambienti condividono lo stesso architecture intent e deployment mechanism.

SKU, capacity, retention e redundancy possono differire in modo esplicito per environment.

## Region / failure boundaries

### Produzione

Prima iterazione **single-region**.

Non è prevista active-active multi-region.

La regione concreta non viene fissata in questo documento finché non vengono definiti:

- data residency;
- proximity requirements;
- service availability;
- cost;
- organizzazione ESI reale dello scenario.

### Failure boundaries da governare

- App Service instance/process failure;
- database node failure;
- availability-zone failure dove applicabile;
- Service Bus availability;
- regional outage;
- identity dependency;
- secret store dependency;
- deployment failure.

Multi-region rimane un trigger-driven decision, non un default.

## Compute

### HTTP API

**Azure App Service**.

Motivazione:

- workload web/API relativamente tradizionale;
- nessun requisito di controllo OS;
- nessun requisito Kubernetes;
- stesso team e lifecycle del modular monolith;
- riduzione dell'operational overhead.

### Background processing

**Continuous WebJob** associato all'App Service per l'Outbox Publisher.

Motivazione:

- background task strettamente correlato al workload;
- nessun scaling indipendente richiesto oggi;
- polling continuo dell'outbox;
- deployment e operation inizialmente condivisi con l'applicazione.

### Trigger di revisione compute

Rivalutare App Service/WebJob se:

- API e publisher richiedono scale profile diversi;
- il background workload interferisce con l'API;
- crescono worker indipendenti;
- container portability acquista valore reale;
- serve isolation più forte;
- il workload richiede orchestration avanzata.

Candidate future: Azure Container Apps, Azure Functions, AKS — soltanto se i trigger lo giustificano.

## State and data

### Operational state

**Azure Database for PostgreSQL Flexible Server**.

Contiene lo schema `operations` posseduto da Order Operations e gli artefatti introdotti dalle migration versionate.

Authoritative ownership rimane conforme a `data-ownership.md`.

### Current production decision

- managed PostgreSQL;
- backup obbligatorio;
- single-region;
- HA tier/configuration definitiva da legare a RTO/RPO e availability target quantitativi.

### Non scelto

- Redis;
- search store dedicato;
- read projection asincrona;
- cross-region active-active database.

## Messaging / integration

### Payment Escalation channel

**Azure Service Bus Queue**.

Pattern corrente:

```text
Order Operations
→ outbox publisher
→ Service Bus Queue
→ Payments & Risk consumer
```

La queue è point-to-point perché oggi esiste un consumer business principale.

Il contract rimane provider-agnostic:

```text
OperationalCasePaymentEscalatedV1
```

La libreria Azure non deve contaminare il domain model o l'event contract.

### Delivery model

- durable local intent via transactional outbox;
- broker delivery può produrre redelivery;
- consumer deve essere idempotente;
- DLQ richiede owner, alert, retention e redrive policy;
- business state e integration delivery state restano distinti.

## Identity and secrets

### Human identity

Microsoft Entra ID per operatori e amministratori ESI.

Authorization applicativa resta responsabilità di Order Operations.

### Workload identity

Managed identity per accesso alle capability Azure quando supportato.

### Deployment identity

Separata dalla runtime identity.

### Secrets

**Azure Key Vault** per secret inevitabili, in particolare provider esterni che non supportano federation/workload identity.

Nessun production secret viene committed nel repository.

## Networking

Decisione **parzialmente aperta** fino al Capitolo 13 — Security by Design.

Baseline già richiesta:

- TLS;
- identity-based access;
- least privilege;
- network exposure minimizzata rispetto ai journey reali;
- egress significativi inventariati.

Decisioni non ancora fissate:

- private endpoint per PostgreSQL/Service Bus/Key Vault;
- ingress architecture definitiva;
- WAF;
- egress filtering;
- VNet integration details;
- privileged access path.

Il documento non inventa queste decisioni prima del threat model.

## Observability

Foundation ESI:

- Azure Monitor;
- Application Insights / application telemetry integration;
- central logging capability della landing zone.

Signal minimi del workload:

```text
HTTP request health
application errors
dependency latency
PostgreSQL health
outbox backlog
oldest unpublished message age
publish failure rate
Payment Escalation delivery latency
Service Bus DLQ depth
runtime health
```

Threshold e SLO quantitativi saranno definiti nei capitoli Reliability/Observability.

## Deployment / IaC

### IaC direction

**Bicep** è il percorso Azure supportato da Platform Engineering nello scenario ESI.

Il repository introduce `infra/` nel Capitolo 12.

I template deployabili vengono aggiunti in modo incrementale.

La security-sensitive topology non viene codificata prima del threat model del Capitolo 13.

Questa è una decisione intenzionale:

> l'IaC non deve inventare security architecture per riempire il repository.

## Ownership

### Platform Engineering

- platform landing zone;
- policy baseline;
- identity foundation;
- shared network capability;
- logging/monitoring foundation;
- approved Bicep path;
- subscription/resource governance.

### Order Operations workload team

- application runtime;
- App Service/WebJob configuration;
- PostgreSQL schema e sizing;
- queue semantics e entity lifecycle;
- workload identity scope;
- application deployment;
- runtime config;
- NFR;
- cost;
- failure handling;
- application on-call.

### Payments & Risk

- queue consumer semantics;
- economic workflow;
- downstream idempotency;
- payment-domain decisions.

## Recovery

Current minimum:

- managed database backup;
- versioned migrations;
- repeatable infrastructure intent;
- event/outbox reconciliation;
- Failure Mode Map;
- restore procedure da rendere eseguibile prima della production readiness.

RTO/RPO quantitativi sono ancora open decision.

## Cost drivers

- App Service plan / runtime capacity;
- PostgreSQL compute/storage/backup/HA option;
- Service Bus tier e throughput;
- Application Insights / log ingestion e retention;
- Key Vault transactions;
- networking/private connectivity se introdotta;
- eventuale redundancy aggiuntiva.

Il costo è parte del workload, non responsabilità esclusiva di Finance.

## Open decisions

1. Azure region concreta.
2. PostgreSQL production HA mode.
3. RTO/RPO numerici.
4. App Service scaling baseline.
5. security network topology.
6. private endpoints.
7. ingress/WAF decision.
8. backup retention.
9. Service Bus tier/capacity.
10. log retention e cost budget.
11. deployment strategy (rolling/slot/blue-green) definitiva.
12. runtime configuration strategy.

## Review triggers

Rivalutare la Cloud Deployment Map quando cambia almeno uno fra:

- RTO/RPO;
- data residency;
- scale profile;
- number of background workers;
- consumer topology;
- security/compliance constraint;
- platform standard;
- region strategy;
- cost curve;
- containerization requirement;
- operational ownership.

## Fonti

- [Microsoft Learn — Azure Application Architecture Fundamentals](https://learn.microsoft.com/azure/architecture/guide/)
- [Microsoft Learn — Azure landing zones](https://learn.microsoft.com/azure/cloud-adoption-framework/ready/landing-zone/)
- [Microsoft Learn — App Service WebJobs](https://learn.microsoft.com/azure/app-service/overview-webjobs)
- [Microsoft Learn — Azure Database for PostgreSQL](https://learn.microsoft.com/azure/postgresql/overview)
- [Microsoft Learn — Service Bus queues, topics and subscriptions](https://learn.microsoft.com/azure/service-bus-messaging/service-bus-queues-topics-subscriptions)
- [Microsoft Learn — Managed identity best practices](https://learn.microsoft.com/entra/identity/managed-identities-azure-resources/managed-identity-best-practice-recommendations)
- [Microsoft Learn — Bicep overview](https://learn.microsoft.com/azure/azure-resource-manager/bicep/overview)

Le fonti descrivono capability e guidance. La topologia ESI è una decisione simulata.