# Order Operations — Infrastructure as Code

Questa directory entra nel capstone con il **Capitolo 12 — Cloud Architecture** e diventa deployabile in modo incrementale con il **Capitolo 13 — Security by Design**.

## Decisione corrente

ESI usa Microsoft Azure come cloud enterprise principale per Order Operations e supporta **Bicep** come percorso Infrastructure as Code per il workload.

La deployment topology e il security boundary sono documentati in:

```text
docs/cloud-deployment.md
docs/threat-model.md
docs/security-control-matrix.md
docs/adr/0002-azure-paas-single-region.md
docs/adr/0003-private-ingress-and-identity-first-security.md
```

## `main.bicep` esiste ora

Il Capitolo 12 aveva scelto intenzionalmente di non generarlo prima del threat model.

Il Capitolo 13 ha finalmente chiuso abbastanza decisioni per codificare una prima baseline:

- App Service Linux con managed identity;
- HTTPS only;
- minimum TLS baseline;
- App Service Authentication con Microsoft Entra ID;
- FTP/SCM basic publishing credentials disabilitate;
- private App Service ingress;
- VNet integration outbound;
- Key Vault con RBAC e public network disabilitato;
- Service Bus Premium con local auth disabilitata e public network disabilitato;
- Payment Escalation Queue;
- private endpoint per App Service, Key Vault e Service Bus;
- send-only Service Bus role per la runtime identity;
- Key Vault Secrets User role per la runtime identity;
- Log Analytics + Application Insights.

Il template dipende deliberatamente da due capability fornite dalla **ESI application landing zone**:

```text
appIntegrationSubnetId
privateEndpointSubnetId
```

Il workload non crea una VNet enterprise parallela soltanto per poter essere self-contained.

> **Prima decidiamo il boundary. Poi lo codifichiamo.**

## Compromesso Service Bus Premium

Azure Service Bus Private Link è supportato sul tier Premium.

Di conseguenza la decisione di private data-plane connectivity introduce un costo cloud concreto rispetto al tier Standard.

Questo costo è intenzionale e registrato nel compromesso del Capitolo 13.

Non viene trattato come una conseguenza invisibile della parola “secure”.

Trigger di revisione:

- costo sproporzionato rispetto al rischio;
- nuova platform capability;
- diverso network model;
- diverso messaging workload;
- cambiamento della classificazione del dato/integrazione.

Riferimento:

- [Microsoft Learn — Service Bus Private Link](https://learn.microsoft.com/azure/service-bus-messaging/private-link-service)

## Cosa non è ancora nel template

`main.bicep` non rappresenta ancora l'ambiente produttivo completo.

Mancano intenzionalmente elementi che richiedono ulteriori decisioni o moduli:

- Azure Database for PostgreSQL Flexible Server e relativa private networking configuration;
- private DNS zone group, perché nello scenario ESI il DNS privato è una capability della landing zone;
- CI/CD federated identity completa;
- diagnostic settings completi per ogni resource;
- alert quantitativi;
- deployment slots/blue-green strategy;
- backup/restore configuration completa;
- cost budget e policy;
- Security/Platform policy assignments.

Il template deve crescere insieme al libro, non fingere production readiness in anticipo.

## Parametri richiesti

Il deployment richiede nomi globalmente unici e subnet già provisionate dalla landing zone.

Esempio concettuale:

```bash
az deployment group create \
  --resource-group <workload-rg> \
  --template-file main.bicep \
  --parameters \
      environmentName=prod \
      appName=<globally-unique-app-name> \
      appServicePlanName=<plan-name> \
      keyVaultName=<globally-unique-kv-name> \
      serviceBusNamespaceName=<globally-unique-sb-name> \
      logAnalyticsName=<law-name> \
      applicationInsightsName=<appi-name> \
      appIntegrationSubnetId=<resource-id> \
      privateEndpointSubnetId=<resource-id> \
      entraClientId=<entra-app-client-id>
```

L'esempio non contiene credenziali.

## Regole dei template

1. infrastruttura significativa versionata;
2. parameterizzazione per environment;
3. nessun production secret nel template o nel repository;
4. identity e permission esplicite;
5. tagging/cost allocation coerenti con la landing zone;
6. network exposure intenzionale;
7. backup/recovery configuration coerente con NFR;
8. output limitati alle informazioni utili;
9. destructive changes reviewati esplicitamente;
10. dipendenze dalla platform landing zone documentate;
11. runtime identity separata dalla deployment identity;
12. local/basic authentication disabilitata quando non necessaria.

## Validation

Prima di considerare production-ready l'IaC dovremo avere:

- Bicep build/lint in CI;
- Azure Policy validation;
- deployment in environment non-production;
- private DNS/connectivity test;
- authentication test;
- RBAC negative test;
- security review;
- drift review;
- cost review;
- recovery/rebuild exercise.

La presenza di `main.bicep` significa **codified baseline**, non production readiness.

## Fonti

- [Microsoft Learn — What is Bicep?](https://learn.microsoft.com/azure/azure-resource-manager/bicep/overview)
- [Microsoft Learn — Azure landing zones](https://learn.microsoft.com/azure/cloud-adoption-framework/ready/landing-zone/)
- [Microsoft Learn — App Service architecture best practices](https://learn.microsoft.com/azure/well-architected/service-guides/app-service-web-apps)
- [Microsoft Learn — Service Bus Private Link](https://learn.microsoft.com/azure/service-bus-messaging/private-link-service)
- [Microsoft Learn — Key Vault RBAC](https://learn.microsoft.com/azure/key-vault/general/rbac-guide)

Il capstone conserva intenzionalmente il confine fra **architecture intent**, **codified control** e **verified production behavior**.