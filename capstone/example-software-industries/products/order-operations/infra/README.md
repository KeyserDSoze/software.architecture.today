# Order Operations — Infrastructure as Code

Questa directory entra nel capstone con il **Capitolo 12 — Cloud Architecture**, diventa deployabile in modo incrementale con il **Capitolo 13 — Security by Design** e incorpora la prima reliability baseline con il **Capitolo 14 — Reliability e resilienza**.

## Decisione corrente

ESI usa Microsoft Azure come cloud enterprise principale per Order Operations e supporta **Bicep** come percorso Infrastructure as Code per il workload.

Gli artefatti di governo collegati sono:

```text
docs/cloud-deployment.md
docs/threat-model.md
docs/security-control-matrix.md
docs/reliability-contract.md
docs/failure-mode-map.md
docs/adr/0002-azure-paas-single-region.md
docs/adr/0003-private-ingress-and-identity-first-security.md
```

## `main.bicep` esiste ora

Il Capitolo 12 aveva scelto intenzionalmente di non generarlo prima del threat model.

Il Capitolo 13 ha chiuso abbastanza decisioni security-sensitive per codificare una prima baseline.

Il Capitolo 14 aggiunge una prima baseline di reliability coerente con i target simulati ESI.

### Security baseline codificata

- App Service Linux con managed identity;
- HTTPS only e minimum TLS baseline;
- App Service Authentication con Microsoft Entra ID;
- FTP/SCM basic publishing credentials disabilitate;
- private App Service ingress;
- VNet integration outbound;
- Key Vault con RBAC e public network disabilitato;
- Service Bus Premium con local auth e public network disabilitati;
- private endpoint per App Service, Key Vault e Service Bus;
- send-only Service Bus role per la runtime identity;
- Key Vault Secrets User role per la runtime identity;
- Log Analytics + Application Insights.

### Reliability baseline codificata

- App Service plan con direzione Premium v3;
- `appServicePlanCapacity >= 2`;
- App Service `zoneRedundant = true`;
- Service Bus `zoneRedundant = true`;
- Service Bus TLS baseline esplicita.

Questi controlli comprano resilienza rispetto a failure di instance/availability zone nella topologia single-region corrente.

Non comprano automaticamente regional continuity.

> **Una proprietà codificata deve poter dire quale failure sta pagando.**

## Dipendenze dalla landing zone

Il template dipende deliberatamente da capability fornite dalla **ESI application landing zone**:

```text
appIntegrationSubnetId
privateEndpointSubnetId
private DNS capability
```

Il workload non crea una VNet enterprise parallela soltanto per essere self-contained.

> **Prima decidiamo il boundary. Poi lo codifichiamo.**

## Compromesso Security ↔ FinOps

Azure Service Bus Private Link è supportato sul tier Premium.

La private data-plane decision introduce quindi un costo cloud concreto rispetto al tier Standard.

Il costo resta visibile nel compromise ledger e deve essere confrontato con il threat model.

Riferimento:

- [Microsoft Learn — Service Bus Private Link](https://learn.microsoft.com/azure/service-bus-messaging/private-link-service)

## Compromesso Reliability ↔ FinOps

Il Capitolo 14 introduce ulteriore costo production:

```text
App Service Premium v3 direction
+ almeno due istanze
+ zone redundancy
+ PostgreSQL zone-redundant HA direction
```

La ragione è il reliability contract corrente:

```text
Core operator journey SLO = 99.9% / rolling 28 days
Intra-region RTO <= 15 min
Intra-region RPO = 0 per committed local business state
```

I numeri sono requisiti simulati ESI, non benchmark.

Se SLO/RTO/RPO cambiano, questa spesa deve poter essere rivalutata.

## Cosa non è ancora nel template

`main.bicep` non rappresenta ancora l'ambiente produttivo completo.

Mancano intenzionalmente:

- Azure Database for PostgreSQL Flexible Server;
- PostgreSQL zone-redundant HA configuration;
- PostgreSQL private networking/authentication;
- private DNS zone group specifici della landing zone;
- CI/CD federated deployment identity completa;
- diagnostic settings completi;
- SLI/SLO query e alert quantitativi;
- App Service Health Check path;
- autoscale/headroom policy;
- deployment slot/canary/blue-green strategy;
- backup/restore configuration completa;
- regional recovery environment;
- cost budget e policy;
- Security/Platform policy assignments.

Il template cresce insieme alle decisioni del libro, senza fingere production readiness in anticipo.

## Evidence state

Usiamo esplicitamente:

```text
Designed
→ Codified
→ Verified
→ Monitored
```

### Oggi

```text
App Service >=2 + zone redundancy: Codified
Service Bus zone redundancy: Codified
PostgreSQL zone-redundant HA: Designed
PostgreSQL PITR drill: Designed
Bicep build/lint: Pending
non-production deployment: Pending
failure drill: Pending
runtime monitoring evidence: Pending
```

Quindi non descriviamo ancora la reliability baseline come `Verified`.

## Parametri principali

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
      appServicePlanSku=P1v3 \
      appServicePlanCapacity=2 \
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
7. redundancy collegata a failure/SLO espliciti;
8. backup/recovery configuration coerente con RTO/RPO;
9. output limitati alle informazioni utili;
10. destructive changes reviewati esplicitamente;
11. dipendenze dalla landing zone documentate;
12. runtime identity separata dalla deployment identity;
13. local/basic authentication disabilitata quando non necessaria;
14. nessun controllo promosso a `Verified` soltanto perché esiste nel template.

## Validation

Prima di considerare production-ready l'IaC dovremo avere:

- Bicep build/lint in CI;
- Azure Policy validation;
- deployment in environment non-production;
- private DNS/connectivity test;
- authentication test;
- RBAC negative test;
- security review;
- zone/failure test;
- PostgreSQL failover test quando il modulo verrà introdotto;
- PostgreSQL PITR/restore drill;
- drift review;
- cost review;
- recovery/rebuild exercise.

La presenza di `main.bicep` significa **codified baseline**, non production readiness.

## Fonti

- [Microsoft Learn — What is Bicep?](https://learn.microsoft.com/azure/azure-resource-manager/bicep/overview)
- [Microsoft Learn — Azure landing zones](https://learn.microsoft.com/azure/cloud-adoption-framework/ready/landing-zone/)
- [Microsoft Learn — Reliability in Azure App Service](https://learn.microsoft.com/azure/reliability/reliability-app-service)
- [Microsoft Learn — Configure App Service zone redundancy](https://learn.microsoft.com/azure/app-service/configure-zone-redundancy)
- [Microsoft Learn — PostgreSQL High Availability](https://learn.microsoft.com/azure/postgresql/high-availability/concepts-high-availability)
- [Microsoft Learn — Reliability in Azure Service Bus](https://learn.microsoft.com/azure/reliability/reliability-service-bus)
- [Microsoft Learn — Service Bus Private Link](https://learn.microsoft.com/azure/service-bus-messaging/private-link-service)
- [Microsoft Learn — Key Vault RBAC](https://learn.microsoft.com/azure/key-vault/general/rbac-guide)

Il capstone conserva intenzionalmente il confine fra **architecture intent**, **codified control**, **verified behavior** e **monitored production reality**.