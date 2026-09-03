# Order Operations — Cloud Deployment Map

> **Scenario fittizio ESI.** Questo documento descrive la deployment topology corrente dopo i Capitoli 12 e 13. Le proprietà dei servizi Azure sono basate su documentazione ufficiale; requisiti, costi accettati e circostanze ESI restano simulati.

## Workload

**Order Operations** — Commerce & Operations.

## Business outcome

Ridurre il tempo necessario agli operatori per individuare, comprendere e gestire ordini che richiedono attenzione operativa, incluso l'invio di Payment Escalation durabili verso Payments & Risk.

## Cloud constraint

ESI usa Microsoft Azure come cloud enterprise principale per questo workload.

Order Operations viene deployed dentro una **Azure application landing zone** fornita da Platform Engineering.

La landing zone fornisce guardrail e capability condivise. Non trasferisce l'ownership del workload a Platform.

## Security artifacts collegati

La security topology è governata da:

```text
docs/threat-model.md
docs/security-control-matrix.md
docs/adr/0003-private-ingress-and-identity-first-security.md
infra/main.bicep
```

La Cloud Deployment Map descrive dove vive il workload.

Il Threat Model descrive che cosa può essere abusato o compromesso.

La Security Control Matrix collega threat, controllo, owner ed evidence.

## Environments

Direzione corrente:

```text
dev
staging
production
```

Gli ambienti condividono lo stesso architecture intent e deployment mechanism.

SKU, capacity, retention, network exposure e redundancy possono differire soltanto in modo esplicito e documentato.

Produzione applica la baseline security più restrittiva descritta in questo documento.

## Region / failure boundaries

### Produzione

Prima iterazione **single-region**.

Non è prevista active-active multi-region.

La regione concreta non viene fissata finché non vengono definiti:

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
- private DNS / network path failure;
- regional outage;
- identity dependency;
- Key Vault dependency;
- deployment/control-plane failure.

Multi-region rimane una decisione trigger-driven.

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

### Privilege consequence

API e WebJob condividono attualmente lo stesso runtime/identity envelope.

Questo riduce complessità operativa ma aumenta il blast radius rispetto a due runtime con identity distinte.

È un rischio accettato e registrato nel Threat Model.

### Trigger di revisione compute

Rivalutare App Service/WebJob se:

- API e publisher richiedono scale profile diversi;
- il background workload interferisce con l'API;
- i privilegi del publisher diventano troppo ampi per il web runtime;
- crescono worker indipendenti;
- container portability acquista valore reale;
- serve isolation più forte;
- il workload richiede orchestration avanzata.

Candidate future: Azure Container Apps, Azure Functions, AKS — soltanto se i trigger lo giustificano.

## Human ingress

Order Operations è oggi un workload interno ESI.

Produzione usa la direzione:

```text
ESI workforce
→ enterprise private access path
→ App Service private endpoint
→ Microsoft Entra authentication
→ application authorization
```

### Decisione corrente

- App Service public network access disabilitato in produzione;
- private endpoint inbound;
- Microsoft Entra authentication obbligatoria;
- authorization server-side su capability, risorsa e tenant;
- nessuna trust implicita derivata dalla sola provenienza di rete.

Il private ingress riduce reachability.

Non sostituisce identity o authorization.

## Networking outbound

App Service usa **VNet integration** per il percorso outbound verso le capability private del workload.

La landing zone ESI fornisce:

```text
appIntegrationSubnetId
privateEndpointSubnetId
private DNS capability
shared routing / governance
```

Il workload non crea una rete enterprise parallela soltanto per essere self-contained.

### Egress inventory corrente

Egress legittimi:

- Microsoft Entra / identity endpoints;
- PostgreSQL;
- Service Bus;
- Key Vault;
- Azure Monitor / Application Insights;
- Payments & Risk o provider esplicitamente approvati quando il journey lo richiede.

Order Operations non offre una capability di outbound fetch verso URL arbitrari forniti dall'utente.

## State and data

### Operational state

**Azure Database for PostgreSQL Flexible Server**.

Contiene lo schema `operations` posseduto da Order Operations e gli artefatti introdotti dalle migration versionate.

Authoritative ownership rimane conforme a `data-ownership.md`.

### Production security direction

- private data-plane connectivity;
- public network access disabilitato una volta disponibile la private path;
- authentication/authorization del database ancora necessarie;
- tenant isolation e schema ownership non vengono affidate alla rete.

### Stato IaC

Il modulo PostgreSQL e la relativa private connectivity non sono ancora implementati in `infra/main.bicep`.

Questa è una gap esplicita, non un controllo dichiarato come completato.

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

### Production security topology

- Service Bus public network access disabilitato;
- private endpoint;
- local/SAS authentication disabilitata nel baseline IaC;
- managed identity per il publisher;
- runtime identity con **send-only** permission sulla queue;
- consumer permission di Payments & Risk separata;
- broker administration separata da producer e consumer runtime.

### Service Bus Premium: compromesso Security ↔ FinOps

Azure Service Bus Private Link/private endpoint è supportato sul tier **Premium**.

Quindi la scelta di private data-plane connectivity compra una proprietà security pagando un costo cloud superiore rispetto a un tier Standard.

Non trattiamo Premium come "best practice" universale.

Lo accettiamo oggi perché il workload è interno e la security architecture privilegia una superficie di rete ridotta.

Il costo deve essere misurato e rivalutato insieme a Finance/FinOps.

Trigger:

- costo sproporzionato rispetto al rischio;
- nuova capability di platform networking;
- cambiamento del threat model;
- diverso messaging volume/topology;
- public/private boundary differente.

Fonte ufficiale:

- [Microsoft Learn — Integrate Azure Service Bus with Azure Private Link](https://learn.microsoft.com/azure/service-bus-messaging/private-link-service)

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

App Service usa una **system-assigned managed identity** nella baseline Bicep.

Il privilege envelope corrente include soltanto capability necessarie al workload.

### Runtime identity ≠ deployment identity

La runtime identity non riceve privilegi per:

- creare/eliminare risorse;
- assegnare RBAC;
- modificare network exposure;
- distribuire nuove versioni.

La deployment identity è separata e verrà definita in modo completo con la CI/CD pipeline.

La direzione è federation/workload identity anziché credenziale statica lunga vita.

### Secrets

**Azure Key Vault** per secret inevitabili.

Baseline corrente:

- RBAC authorization;
- soft delete;
- purge protection;
- public network access disabilitato;
- private endpoint;
- workload identity con scope limitato;
- nessun production secret committed nel repository.

Il secret migliore resta quello eliminato tramite identity.

## WAF

**Non introdotto nella topologia corrente.**

Reason:

- il workload è interno;
- l'ingress produzione è privato;
- non esiste oggi Internet-facing/partner ingress.

Questo è un rischio accettato esplicitamente, non una dimenticanza.

Trigger di revisione:

- public API;
- mobile/partner access;
- Internet exposure;
- compliance requirement;
- threat model che giustifica application-layer filtering a monte.

## Observability / security signals

Foundation ESI:

- Azure Monitor;
- Application Insights;
- Log Analytics;
- central logging capability della landing zone.

Signal minimi del workload:

```text
HTTP request health
application errors
dependency latency
failed authentication/authorization
cross-tenant authorization denials
Payment Escalation accepted/rejected
PostgreSQL health
outbox backlog
oldest unpublished message age
publish failure rate
Payment Escalation delivery latency
Service Bus DLQ depth
Key Vault access failures
RBAC / privileged configuration changes
production deployments
runtime health
```

Log e audit devono rispettare data minimization e redaction policy.

Threshold e SLO quantitativi saranno definiti nei capitoli Reliability/Observability.

## Deployment / IaC

### IaC direction

**Bicep** è il percorso Azure supportato da Platform Engineering nello scenario ESI.

`infra/main.bicep` esiste ora e codifica una prima baseline security-aware.

### Codificato oggi

- App Service + system-assigned managed identity;
- HTTPS only / TLS baseline;
- Entra authentication configuration;
- FTP/SCM basic publishing credentials disabled;
- App Service public network disabled;
- VNet integration;
- App Service private endpoint;
- Key Vault RBAC / private endpoint / public access disabled;
- Service Bus Premium / queue / private endpoint / local auth disabled;
- send-only Service Bus RBAC per runtime identity;
- Key Vault Secrets User RBAC per runtime identity;
- Log Analytics + Application Insights.

### Non ancora codificato/completato

- PostgreSQL resource/private networking;
- private DNS zone groups della landing zone;
- federated deployment identity completa;
- diagnostic settings completi;
- quantitative alert/SLO;
- backup/recovery configuration completa;
- deployment slots/blue-green;
- policy assignments e cost budget.

La presenza di Bicep significa **codified baseline**, non production readiness.

La build/deployment validation deve essere eseguita in CI e in un environment non-production.

## Ownership

### Platform Engineering

- platform landing zone;
- private DNS/network capability;
- policy baseline;
- identity foundation;
- privileged access baseline;
- logging/monitoring foundation;
- approved Bicep path;
- subscription/resource governance.

### Security

- identity/security baseline;
- threat-model review per cambiamenti ad alto impatto;
- privileged access governance;
- policy e incident-response requirements.

### Order Operations workload team

- application authorization;
- application runtime;
- App Service/WebJob configuration;
- PostgreSQL schema e sizing;
- queue semantics;
- workload identity scope richiesto;
- application deployment;
- runtime config;
- NFR;
- cost;
- failure handling;
- application/security telemetry;
- threat model e control matrix del workload;
- application on-call.

### Payments & Risk

- queue consumer semantics;
- economic workflow;
- downstream idempotency;
- payment-domain decisions.

## Recovery

Current minimum:

- managed database backup direction;
- versioned migrations;
- repeatable infrastructure intent;
- event/outbox reconciliation;
- Failure Mode Map;
- Threat Model;
- identity/secret revocation paths;
- known-good deployment direction;
- restore procedure da rendere eseguibile prima della production readiness.

RTO/RPO quantitativi sono ancora open decision.

## Cost drivers

- App Service plan / runtime capacity;
- PostgreSQL compute/storage/backup/HA option;
- **Service Bus Premium** richiesto dalla private endpoint decision;
- Application Insights / Log Analytics ingestion e retention;
- Key Vault transactions;
- private endpoints/networking;
- eventuale redundancy aggiuntiva.

Il costo è parte del workload e deve essere discusso con Finance/FinOps, non scoperto dopo il deployment.

## Open decisions

1. Azure region concreta.
2. PostgreSQL production HA mode.
3. RTO/RPO numerici.
4. App Service scaling baseline.
5. PostgreSQL Bicep module/private networking/authentication details.
6. private DNS integration verification con la landing zone.
7. backup retention.
8. log retention e cost budget.
9. deployment strategy (rolling/slot/blue-green) definitiva.
10. runtime configuration strategy.
11. federated CI/CD deployment identity e permission scope.
12. cost review del Service Bus Premium security trade-off.
13. quantitative rate/abuse limits.

## Review triggers

Rivalutare la Cloud Deployment Map quando cambia almeno uno fra:

- RTO/RPO;
- data residency;
- scale profile;
- number of background workers;
- consumer topology;
- public/private ingress;
- security/compliance constraint;
- platform standard;
- region strategy;
- cost curve;
- containerization requirement;
- operational ownership;
- security incident.

## Fonti

- [Microsoft Learn — Azure Application Architecture Fundamentals](https://learn.microsoft.com/azure/architecture/guide/)
- [Microsoft Learn — Azure landing zones](https://learn.microsoft.com/azure/cloud-adoption-framework/ready/landing-zone/)
- [Microsoft Learn — App Service WebJobs](https://learn.microsoft.com/azure/app-service/overview-webjobs)
- [Microsoft Learn — App Service security](https://learn.microsoft.com/azure/app-service/overview-security)
- [Microsoft Learn — App Service architecture best practices](https://learn.microsoft.com/azure/well-architected/service-guides/app-service-web-apps)
- [Microsoft Learn — Azure Database for PostgreSQL](https://learn.microsoft.com/azure/postgresql/overview)
- [Microsoft Learn — Service Bus queues, topics and subscriptions](https://learn.microsoft.com/azure/service-bus-messaging/service-bus-queues-topics-subscriptions)
- [Microsoft Learn — Service Bus Private Link](https://learn.microsoft.com/azure/service-bus-messaging/private-link-service)
- [Microsoft Learn — Managed identity best practices](https://learn.microsoft.com/entra/identity/managed-identities-azure-resources/managed-identity-best-practice-recommendations)
- [Microsoft Learn — Key Vault RBAC guide](https://learn.microsoft.com/azure/key-vault/general/rbac-guide)
- [Microsoft Learn — Security design principles](https://learn.microsoft.com/azure/well-architected/security/principles)
- [Microsoft Learn — Bicep overview](https://learn.microsoft.com/azure/azure-resource-manager/bicep/overview)

Le fonti descrivono capability e guidance. La topologia ESI è una decisione simulata e rimane soggetta a verification reale.