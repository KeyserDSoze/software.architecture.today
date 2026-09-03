# ADR-0002 — Azure PaaS single-region per Order Operations

Status: accepted

## Contesto

Order Operations deve passare da capstone locale/documentale a workload deployabile dentro l'ambiente enterprise ESI.

ESI mette a disposizione una Azure application landing zone gestita da Platform Engineering.

Il workload corrente è un modular monolith TypeScript con:

- HTTP API;
- outbox publisher;
- PostgreSQL;
- Payment Escalation via messaging;
- un singolo workload team;
- nessun requisito multi-region quantitativo ancora definito.

## Problema

Dobbiamo scegliere una prima deployment topology cloud che:

- riduca l'operational overhead;
- rispetti la governance ESI;
- preservi ownership del workload;
- supporti database e messaging durabili;
- non introduca orchestrazione o distribuzione non giustificate.

## Alternative considerate

### VM

Rifiutata perché compra controllo OS non richiesto e aumenta patching/lifecycle ownership.

### AKS

Rifiutato per ora perché il workload non richiede orchestration avanzata, cluster extensibility o molti componenti indipendenti.

### Azure Container Apps

Candidato futuro credibile, ma la containerizzazione e lo scaling indipendente non comprano oggi una proprietà necessaria.

### Azure Functions

Possibile per alcuni background workload futuri, ma non vogliamo frammentare il modular monolith senza un trigger reale.

### Azure App Service + WebJob

Buon fit con una web/API application e un background publisher strettamente correlato che non richiede scaling indipendente.

## Decisione

Adottare inizialmente:

```text
Azure application landing zone
Azure App Service — HTTP/API runtime
Continuous WebJob — Outbox Publisher
Azure Database for PostgreSQL Flexible Server
Azure Service Bus Queue — Payment Escalation channel
Managed Identity
Azure Key Vault
Azure Monitor / Application Insights foundation
Bicep come IaC direction
Single Azure region
```

## Motivazione

La topologia soddisfa il workload corrente con meno operational complexity rispetto a VM o AKS e sfrutta capability gestite coerenti con gli standard enterprise ESI.

La scelta mantiene il deployment boundary vicino al modular monolith già deciso.

## Conseguenze positive

- minore infrastructure ownership;
- integrazione con landing zone e identity enterprise;
- database e messaging gestiti;
- nessun cluster Kubernetes da operare;
- API e background task possono essere managed insieme;
- percorso IaC standardizzato;
- deployment topology comprensibile per il team corrente.

## Conseguenze negative

- coupling operativo ad Azure;
- WebJob e API non hanno scaling completamente indipendente;
- minore configurabilità rispetto ad AKS;
- single-region non protegge automaticamente da regional outage;
- alcune decisioni security/network restano da chiudere nel threat model.

## Quality floor

- durable Payment Escalation intent;
- idempotency;
- backup e recovery planning;
- no production secret nel repository;
- workload identity e least privilege;
- observability del delivery path;
- infrastructure intent versionato;
- ownership distinta fra Platform, Order Operations e Payments & Risk.

## Guardrail

- `docs/cloud-deployment.md`;
- `docs/failure-mode-map.md`;
- `docs/data-ownership.md`;
- IaC sotto `infra/`;
- cost review;
- architecture trigger;
- security review prima della production topology definitiva.

## Open decision deliberate

Non decidiamo ancora:

- region concreta;
- private endpoint topology;
- WAF/ingress definitivo;
- PostgreSQL production HA mode;
- RTO/RPO numerici;
- Service Bus tier;
- deployment slot/blue-green strategy.

Queste informazioni richiedono threat model, NFR quantitativi o workload evidence ulteriori.

## Trigger di revisione

Rivalutare la decisione se:

- API e publisher hanno scaling profile materialmente diversi;
- il WebJob interferisce con performance o availability dell'API;
- aumenta il numero di background component;
- container portability diventa requisito;
- security/isolation richiede un runtime differente;
- RTO/RPO richiedono topology multi-zone o multi-region diversa;
- il consumer model richiede pub/sub invece di queue;
- il cost curve rende App Service/PaaS meno adatto;
- Platform Engineering modifica il supported platform contract.

## Fonti

- [Microsoft Learn — Azure landing zones](https://learn.microsoft.com/azure/cloud-adoption-framework/ready/landing-zone/)
- [Microsoft Learn — App Service WebJobs](https://learn.microsoft.com/azure/app-service/overview-webjobs)
- [Microsoft Learn — Choose an Azure container service](https://learn.microsoft.com/azure/architecture/guide/choose-azure-container-service)
- [Microsoft Learn — Azure Database for PostgreSQL](https://learn.microsoft.com/azure/postgresql/overview)
- [Microsoft Learn — Service Bus queues, topics and subscriptions](https://learn.microsoft.com/azure/service-bus-messaging/service-bus-queues-topics-subscriptions)

Le fonti descrivono le capability e i trade-off generali. La decisione ESI resta simulata.