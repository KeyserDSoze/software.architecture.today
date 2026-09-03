# Order Operations — Infrastructure as Code

Questa directory entra nel capstone con il **Capitolo 12 — Cloud Architecture**.

## Decisione corrente

ESI usa Microsoft Azure come cloud enterprise principale per Order Operations e supporta **Bicep** come percorso Infrastructure as Code per il workload.

La deployment topology decisa è documentata in:

```text
docs/cloud-deployment.md
docs/adr/0002-azure-paas-single-region.md
```

## Perché non esiste ancora `main.bicep`

La scelta è intenzionale.

Il Capitolo 12 ha definito:

- Azure application landing zone;
- Azure App Service;
- continuous WebJob;
- Azure Database for PostgreSQL Flexible Server;
- Azure Service Bus Queue;
- Managed Identity;
- Azure Key Vault;
- Azure Monitor / Application Insights;
- single-region;
- Bicep come IaC direction.

Ma il **Capitolo 13 — Security by Design** deve ancora chiudere decisioni che cambiano materialmente il template deployabile:

- public vs private ingress;
- VNet integration;
- private endpoints;
- firewall/network ACL;
- workload identity scope;
- Key Vault access model;
- PostgreSQL network access;
- Service Bus network access;
- privileged deployment path;
- egress constraints.

Generare oggi un template completo significherebbe lasciare che l'IaC inventi la security architecture.

Il libro rifiuta questo workflow.

> **Prima decidiamo il boundary. Poi lo codifichiamo.**

## Regole per i template futuri

Quando verranno introdotti i file Bicep, dovranno rispettare almeno:

1. infrastruttura significativa versionata;
2. parameterizzazione per environment;
3. nessun production secret nel template o nel repository;
4. identity e permission esplicite;
5. tagging/cost allocation coerenti con la landing zone;
6. network exposure intenzionale;
7. backup/recovery configuration coerente con NFR;
8. output limitati alle informazioni utili al deployment;
9. destructive changes reviewati esplicitamente;
10. documentazione delle dipendenze dalla platform landing zone.

## Environment direction

```text
infra/
├── README.md
├── main.bicep               # dal Capitolo 13+
├── modules/                 # soltanto quando il riuso lo giustifica
└── environments/
    ├── dev.bicepparam
    ├── staging.bicepparam
    └── prod.bicepparam
```

Questa struttura è una direzione, non un obbligo a creare file vuoti.

I file compariranno quando contengono decisioni implementabili.

## Validation futura

Prima di considerare production-ready l'IaC dovremo avere:

- Bicep build/lint;
- policy validation;
- security review;
- deployment in environment non production;
- drift review;
- cost review;
- recovery/rebuild exercise.

## Fonti

- [Microsoft Learn — What is Bicep?](https://learn.microsoft.com/azure/azure-resource-manager/bicep/overview)
- [Microsoft Learn — Azure landing zones](https://learn.microsoft.com/azure/cloud-adoption-framework/ready/landing-zone/)

La decisione di **non** generare ancora un template deployabile è parte dell'architettura del capstone, non lavoro mancante nascosto.