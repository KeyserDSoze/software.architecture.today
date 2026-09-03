## Networking, identity e secrets: il perimetro non è più soltanto la rete

Nel cloud è facile pensare che sicurezza significhi costruire una rete privata e chiudere tutto dietro firewall.

La rete conta.

Ma non basta.

Un workload moderno contiene:

- utenti;
- applicazioni;
- worker;
- pipeline;
- managed services;
- operatori;
- automazioni;
- agenti;
- secret store;
- deployment identity.

Ogni attore ha bisogno di una identità e di un permission boundary.

Per questo l'identità diventa una parte centrale della Cloud Architecture.

## Network boundary e identity boundary

Una connessione può essere ammessa dalla rete ma non autorizzata semanticamente.

Esempio:

```text
App Service
→ PostgreSQL private network
```

La rete può impedire accesso pubblico.

Ma dobbiamo ancora decidere:

- quale workload identity si autentica;
- a quale database role appartiene;
- quali schema può leggere/scrivere;
- come vengono ruotate le credenziali;
- come viene auditato l'accesso.

Quindi:

> **la rete limita chi può arrivare alla porta. L'identità decide chi può attraversarla.**

## Identity come perimetro primario

Microsoft Azure Well-Architected Security descrive identity come un perimetro primario che include utenti e componenti del workload, non soltanto il bordo esterno dell'applicazione.

Fonte:

- [Microsoft Learn — Architecture strategies for identity and access management](https://learn.microsoft.com/azure/well-architected/security/identity-access)

Per un workload questo significa distinguere almeno:

```text
human identity
workload identity
operator identity
deployment identity
external service identity
```

Usare una sola credenziale condivisa per tutto distrugge questa distinzione.

## Managed identity

I cloud provider offrono workload identity che evitano di distribuire secret statici alle applicazioni.

In Azure le Managed Identities consentono alle risorse di ottenere token senza dover incorporare direttamente una password o client secret nell'applicazione.

Fonte:

- [Microsoft Learn — Managed identity best practice recommendations](https://learn.microsoft.com/entra/identity/managed-identities-azure-resources/managed-identity-best-practice-recommendations)

Questo non elimina il problema dell'authorization.

Lo rende più governabile.

Dobbiamo ancora assegnare:

- ruolo corretto;
- scope minimo;
- lifecycle;
- ownership;
- audit.

## Least privilege è una proprietà architetturale

Se Order Operations può:

```text
leggere tutto il Key Vault
amministrare Service Bus
modificare networking
scrivere qualsiasi database
```

abbiamo un problema architetturale, non soltanto IAM configuration debt.

Il permission boundary determina blast radius.

Per questo identity topology deve apparire nei diagrammi significativi.

## Secrets: eliminare quando possiamo, governare quando non possiamo

La strategia migliore per un secret è spesso non averlo.

Se una workload identity può autenticarsi direttamente a una capability gestita, evitiamo:

- distribuzione;
- rotazione manuale;
- leak nei log;
- secret in environment non governati;
- credential sharing.

Ma alcuni secret continueranno a esistere:

- API key di provider esterni;
- certificate;
- webhook secret;
- legacy credential;
- token non sostituibili con federation.

In questi casi servono:

- secret store dedicato;
- access policy;
- rotation;
- audit;
- expiry;
- detection di secret leaked;
- processo di emergency revoke.

## Config non è secret

Un antipattern comune è mettere tutto nello stesso secret store.

```text
PAYMENT_PROVIDER_URL
FEATURE_FLAG_X
QUEUE_NAME
LOG_LEVEL
DATABASE_PASSWORD
```

Le prime quattro informazioni non hanno necessariamente la stessa sensibilità dell'ultima.

Separare config e secret migliora:

- comprensibilità;
- rotation;
- permission;
- deployment;
- audit.

La configurazione deve essere governata.

Non deve per forza essere segreta.

## Private endpoint: uno strumento, non una religione

Molti managed services possono essere esposti tramite endpoint pubblici protetti oppure attraverso private networking.

Il private endpoint può ridurre exposure e soddisfare policy di rete.

Ma introduce anche:

- DNS complexity;
- network integration;
- troubleshooting più difficile;
- dipendenza dalla topologia VNet;
- costi;
- deployment ordering.

Quindi anche qui dobbiamo partire dal threat model e dalla policy ESI.

Non da:

> “private è sempre più enterprise.”

Il Capitolo 13 approfondirà Security by Design.

Qui ci basta una regola:

> **una misura di sicurezza deve ridurre un rischio concreto senza creare un failure mode operativo più pericoloso e invisibile.**

## Egress è parte dell'architettura

Si parla molto di ingress.

Ma un workload spesso comunica verso:

- provider esterni;
- SaaS;
- API aziendali;
- update repository;
- identity endpoint;
- telemetry endpoint.

L'egress determina:

- data exfiltration risk;
- dependency availability;
- DNS behavior;
- NAT capacity;
- allowlist;
- cost.

La Cloud Deployment Map deve quindi mostrare anche le dipendenze in uscita significative.

## ESI: baseline di identity e secrets

Per Order Operations fissiamo ora alcuni guardrail di Platform Engineering.

### Human identity

Gli operatori e gli amministratori usano Microsoft Entra ID come identity provider aziendale.

La semantica di authorization applicativa resta però responsabilità del workload.

### Workload identity

Il runtime Order Operations usa managed identity quando la capability Azure la supporta.

### Secrets

I secret inevitabili di provider esterni vengono conservati in Azure Key Vault o capability enterprise equivalente fornita dalla landing zone.

### Database

L'accesso al database deve essere scoped al workload e agli schema che possiede/consuma secondo le decisioni di data ownership.

Non useremo una super-user credential condivisa fra applicazioni.

### Messaging

Order Operations può inviare messaggi soltanto alle entity necessarie al proprio contratto.

Non riceve automaticamente diritti amministrativi sull'intero namespace.

## Non scegliamo ancora una rete “massima”

Non abbiamo ancora abbastanza threat model per decidere ogni private endpoint e firewall rule.

Quindi la decisione corrente distingue:

### Baseline già obbligatoria

- identity forte;
- least privilege;
- secret store;
- TLS;
- access audit dove disponibile;
- nessun secret nel repository;
- separation of deployment/runtime identity.

### Decisioni che rimangono aperte al Capitolo 13

- private endpoint obbligatori per ogni managed service;
- ingress architecture definitiva;
- WAF;
- egress filtering avanzato;
- workload network segmentation;
- break-glass model;
- privileged access workflow.

Questo è importante.

Non dobbiamo anticipare la security architecture soltanto per riempire il diagramma cloud.

> **Il cloud ci offre molte primitive di sicurezza. L'architettura decide quali rischi devono governare.**