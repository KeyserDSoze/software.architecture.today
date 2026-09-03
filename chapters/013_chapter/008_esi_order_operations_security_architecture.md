## ESI — Order Operations: dalla topologia cloud alla security architecture

Ora applichiamo il capitolo al capstone.

Il punto di partenza è la Cloud Deployment Map del Capitolo 12.

Abbiamo già:

```text
App Service + WebJob
PostgreSQL Flexible Server
Service Bus Queue
Managed Identity
Key Vault
Azure Monitor / Application Insights
Bicep
single region
```

Ma non avevamo ancora definito il security boundary.

## Nuova esigenza ESI

Security completa una review preliminare e porta tre richieste.

1. Order Operations è un workload interno: non deve essere raggiungibile direttamente da Internet in produzione.
2. Il compromise della runtime identity non deve permettere modifiche al control plane.
3. I servizi dati sensibili non devono restare pubblicamente raggiungibili soltanto per semplificare il networking.

Commerce & Operations chiede però che:

- il team continui a fare deploy senza ticket manuali per ogni modifica;
- dev e staging rimangano usabili;
- troubleshooting e observability non diventino impossibili;
- la security baseline sia riproducibile.

Platform Engineering propone quindi un boundary standardizzato nella application landing zone.

## Threat principali

Il Threat Model del capstone identifica inizialmente threat come:

```text
T-01 stolen operator session
T-02 cross-tenant case access
T-03 unauthorized Payment Escalation
T-04 runtime identity compromise
T-05 deployment identity compromise
T-06 secret leakage
T-07 public exposure of data-plane services
T-08 malicious/tampered deployment
T-09 sensitive data in logs
T-10 Service Bus privilege misuse
T-11 denial of service / escalation spam
T-12 privileged admin abuse
```

Non sono gli unici threat possibili.

Sono quelli che guidano la decisione corrente.

## Human ingress

Produzione:

```text
ESI workforce
→ enterprise private access path
→ App Service private endpoint
→ Entra authentication
→ application authorization
```

Public network access dell'App Service viene disabilitato in produzione.

L'utente continua comunque ad autenticarsi.

Il network path riduce reachability.

Entra stabilisce identity.

Order Operations decide authorization.

## Authorization

La prima capability write del prodotto è:

```http
POST /api/operational-cases/{caseId}/payment-escalations
```

Il server deve verificare:

```text
authenticated identity
+ Operations role
+ case visibility
+ tenant authorization
+ valid functional preconditions
→ allowed
```

`tenantId` non viene considerato affidabile soltanto perché arriva nel payload o nel browser state.

## Runtime identity

App Service e WebJob usano una managed identity.

Il privilege envelope corrente include soltanto ciò che serve al workload.

Concettualmente:

```text
Key Vault
→ read specific secret when unavoidable

Service Bus
→ send to Payment Escalation queue

PostgreSQL
→ workload data access through the chosen database auth mechanism

Monitoring
→ emit telemetry
```

La runtime identity non può:

```text
assign RBAC
create/delete infrastructure
change network exposure
modify subscription policy
```

## Deployment identity

La pipeline usa una identity separata.

La direzione è federation/workload identity invece di una password statica lunga vita.

Il deployment principal riceve permission sul deployment scope necessario, ma non viene usato dall'applicazione a runtime.

Questo boundary sarà reso più concreto quando costruiremo la CI/CD pipeline completa.

## Key Vault

Key Vault contiene soltanto secret inevitabili.

Non diventa un deposito di configurazione indiscriminata.

Regole:

- runtime identity accede soltanto ai secret necessari;
- developer normali non leggono production secret per default;
- secret non vengono committed;
- rotation/revocation sono parte del lifecycle;
- accesso al vault viene auditato.

## PostgreSQL

Produzione usa private connectivity.

L'obiettivo non è dichiarare il database “trusted”.

Restano necessari:

- authentication;
- authorization;
- schema ownership;
- tenant isolation;
- backup;
- audit dove pertinente.

La private path riduce soltanto la superficie di rete.

## Service Bus

La queue Payment Escalation usa private connectivity nel production design.

Il publisher ha soltanto capability di send necessaria.

Non deve ricevere automaticamente permission amministrative sulla namespace.

Payments & Risk riceve il proprio accesso consumer separato.

Quindi:

```text
producer privilege
≠ consumer privilege
≠ broker administration privilege
```

## Egress

Order Operations dichiara gli egress approvati:

- Entra;
- PostgreSQL;
- Service Bus;
- Key Vault;
- telemetry;
- eventuali provider/endpoint esplicitamente approvati.

L'applicazione non offre una capability di fetch arbitrario verso URL forniti dall'utente.

## Logging

Il security model separa:

```text
application telemetry
security/audit events
```

Per Payment Escalation registriamo identificatori e outcome necessari alla tracciabilità, non credential o payment secret.

Il Threat Model identifica esplicitamente sensitive-data-in-logs come threat da verificare.

## WAF: non ancora

Non aggiungiamo WAF nella prima produzione perché l'ingress corrente è interno e privato.

Questo rischio viene accettato consapevolmente.

Trigger:

- esposizione Internet;
- partner ingress;
- public API;
- compliance requirement;
- threat landscape differente.

## La baseline Bicep

Con queste decisioni possiamo finalmente iniziare a codificare la security-sensitive infrastructure.

Il capstone introduce:

```text
infra/main.bicep
```

La prima baseline codifica almeno:

- App Service con HTTPS only e managed identity;
- Key Vault con RBAC e soft-delete/purge protection direction;
- Service Bus + queue;
- observability foundation;
- parametri che impediscono di nascondere environment e location nel template.

Le parti di private networking vengono mantenute modulari e documentate perché dipendono anche dalla landing zone ESI e dalle subnet/DNS capability di Platform.

Questo è importante.

Un template “deployabile” non deve fingere che il workload possieda tutta la rete enterprise.

## Compromesso del capitolo

### Esigenza

Ridurre blast radius e superficie d'attacco prima della produzione.

### Tensione

Security isolation e least privilege vs delivery speed, diagnosi e complessità di networking.

### Decisione

Private ingress e private data-plane direction in produzione, identity-first authorization, managed identity, runtime/deployment separation e security baseline in IaC.

### Costo accettato

- private DNS e networking più complessi;
- maggiore dipendenza dalla landing zone;
- troubleshooting più articolato;
- alcuni workflow locali non possono replicare esattamente production.

### Quality floor

- no anonymous production access;
- tenant isolation;
- least privilege;
- no static production credentials in repository;
- runtime identity senza control-plane privilege;
- auditable sensitive operations;
- revocation path;
- security controls testabili.

### Guardrail

- Threat Model;
- Security Control Matrix;
- Bicep;
- platform policy;
- negative authorization tests;
- secret scanning;
- RBAC review;
- log redaction policy.

### Trigger di revisione

- nuovo public ingress;
- mobile/partner access;
- compliance requirement;
- sensitive data class nuova;
- runtime separato per WebJob;
- multi-region;
- nuovi provider esterni;
- privilege growth;
- security incident.

## Caso reale: Cloudflare

Il caso Cloudflare/Okta 2023 è utile come verifica concettuale del principio `assume breach`.

Cloudflare riferì che un token di sessione compromesso permise accesso alla propria istanza Okta con privilegi amministrativi, ma descrisse la propria detection e architettura Zero Trust come elementi che contribuirono a contenere l'incidente prima che raggiungesse customer systems o production network.

Fonte primaria:

- [Cloudflare — How Cloudflare mitigated yet another Okta compromise](https://blog.cloudflare.com/how-cloudflare-mitigated-yet-another-okta-compromise/)

Non copiamo la loro architettura.

Copiamo il ragionamento:

> **Progettiamo assumendo che il primo controllo possa fallire e chiediamo che il secondo boundary limiti ancora il danno.**

## Il capstone dopo il Capitolo 13

Order Operations non è “secure”.

È più precisamente:

```text
security modeled
+ controls traceable
+ privilege boundaries explicit
+ infrastructure direction codified
+ residual risks visible
```

È una condizione molto più utile di una generica etichetta `secure by design`.