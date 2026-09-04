## ESI — Order Operations: dalla cloud topology alla security architecture

Il punto di partenza è la Cloud Deployment Map del Capitolo 12. Order Operations ha App Service + WebJob, PostgreSQL Flexible Server, Service Bus Queue, managed identity, Key Vault, observability foundation, Bicep e una strategia single-region. Quella topologia era deliberatamente incompleta sul piano della security: ora abbiamo un threat model abbastanza concreto da trasformarla in una security architecture.

## Le richieste Security diventano proprietà del design

Security identifica tre esigenze che cambiano la topologia. Primo: il workload è interno e non ha un journey Internet-facing, quindi non deve essere pubblicamente raggiungibile in produzione senza motivo. Secondo: una compromissione della runtime identity non deve aprire il control plane Azure. Terzo: PostgreSQL, messaging e secret store non devono restare pubblicamente raggiungibili soltanto per semplificare il networking.

Commerce & Operations chiede però che il team continui a deployare senza ticket manuali continui, che dev/staging restino usabili e che troubleshooting e observability non vengano sacrificati. Platform Engineering deve quindi trasformare il security boundary in capability ripetibili della landing zone, non in un gate umano per ogni change.

## I threat che guidano questa iterazione

La baseline del Capitolo 13 considera sessione operatore rubata, accesso cross-tenant, Payment Escalation non autorizzata, compromise della runtime o deployment identity, leakage di secret, public exposure accidentale dei data-plane service, deployment manipolato, dati sensibili nei log, privilege eccessivi su Service Bus, denial of service e abuso amministrativo.

Non pretendiamo che siano tutte le minacce possibili. Sono quelle che cambiano **questa** decisione. Il Threat Model vivo del capstone continuerà a crescere nei capitoli successivi e, molto più avanti, includerà anche i boundary AI. Il manoscritto qui conserva la baseline disponibile nel Capitolo 13.

## Human ingress: meno reachability, stessa authorization

In produzione scegliamo:

```text
ESI workforce
→ enterprise private access path
→ App Service private endpoint
→ Entra authentication
→ application authorization
```

Disabilitare il public network access riduce l’attack surface raggiungibile. Non autorizza nessuno. Un operatore autenticato continua a dover superare server-side tenant authorization e capability check.

La prima write capability del prodotto, `POST /api/operational-cases/{caseId}/payment-escalations`, è un ottimo esempio. Il server combina identity autenticata, role/capability, case visibility, tenant relationship e precondizioni funzionali. Il `tenantId` non diventa affidabile perché arriva dal browser.

## Runtime identity: soltanto data-plane capability necessarie

App Service e WebJob usano managed identity. Il privilege envelope corrente consente accesso ai dati del workload, ai secret inevitabili, all’invio sulla queue Payment Escalation e alla telemetry necessaria. Non include RBAC assignment, network modification, infrastructure creation o policy administration.

Questa è la concretezza di `assume breach`: se la runtime identity viene rubata, vogliamo che l’attaccante trovi un secondo confine prima del control plane.

La deployment identity resta separata e viene orientata verso federation/scoped permission. Il dettaglio della CI/CD arriverà più avanti, ma il boundary esiste già nel threat model.

## Key Vault, PostgreSQL e Service Bus: reachability e permission insieme

Key Vault conserva soltanto secret inevitabili, scoped alla workload identity, con lifecycle di rotation/revocation e audit. Developer ordinari non devono leggere production secret per default.

PostgreSQL e Service Bus seguono una private data-plane direction in produzione. Il database continua comunque a richiedere authentication, ownership e tenant isolation; il publisher Service Bus riceve soltanto send permission sulla capability necessaria, distinta dal consumer privilege di Payments & Risk e dall’amministrazione del broker.

```text
producer privilege
≠ consumer privilege
≠ broker administration privilege
```

La private network riduce reachability. L’identity limita ciò che può essere fatto dopo aver raggiunto il servizio.

## Egress e logging: il sistema non deve diventare un canale di esfiltrazione

Order Operations dichiara gli egress necessari verso Entra, PostgreSQL, Service Bus, Key Vault, telemetry e provider esplicitamente approvati. Non offre una fetch capability verso destination arbitrarie fornite dall’utente.

Il logging separa telemetry e audit. Per Payment Escalation conserviamo identity e outcome necessari alla tracciabilità, ma non credential o payment secret. Il threat `sensitive data in logs` rimane esplicito perché l’assenza di un secret store leakage non impedisce all’applicazione di scrivere un valore sensibile in telemetry.

## WAF: rischio accettato, non controllo dimenticato

Non introduciamo un WAF nella prima produzione perché non esiste un Internet-facing ingress. La decisione ha un review trigger: public, partner o mobile ingress; compliance requirement; oppure un threat model che dimostri un nuovo application-layer attack path.

Questo è un esempio utile di security fit: non massimizziamo la quantità di controlli, rendiamo visibile perché un controllo non è necessario oggi.

## IaC: il security boundary entra nel repository

Con il threat model abbastanza stabile possiamo codificare parte della baseline in `infra/main.bicep`: HTTPS/TLS direction, managed identity, secret store, messaging, observability e i componenti security-sensitive che appartengono al workload. Le parti di private networking rimangono integrate con i moduli e le capability della landing zone, perché il workload non deve fingere di possedere private DNS, subnet e routing enterprise che appartengono a Platform.

Un template deployabile non è ancora evidence di comportamento. La Security Control Matrix conserva quindi la distinzione fra `Designed`, `Codified`, `Verified` e `Monitored`.

## Il compromesso ESI

ESI accetta maggiore complessità di private DNS, networking e troubleshooting per ridurre reachability e blast radius prima della produzione. In cambio non accetta anonymous production access, authorization implicita, runtime identity con broad control-plane privilege, production secret nel repository o security control privi di test/evidence.

I guardrail sono Threat Model, Security Control Matrix, Bicep, platform policy, negative authorization test, secret scanning, RBAC review e logging/redaction policy. Riapriamo la decisione quando arriva nuovo public ingress, una nuova data classification, un runtime separato per il publisher, multi-region, nuovi provider, privilege growth o un incidente reale.

L’ADR che conserva questa baseline è:

```text
capstone/example-software-industries/products/order-operations/docs/adr/0003-private-ingress-and-identity-first-security.md
```

La Security Control Matrix del capstone rimane fortemente legata a questo capitolo:

```text
capstone/example-software-industries/products/order-operations/docs/security-control-matrix.md
```

Il Threat Model vivo, invece, è cumulativo e nei capitoli successivi continua ad aggiungere actor, asset e boundary. Il Capitolo 13 non deve quindi essere retroattivamente riscritto come se conoscesse già i rischi futuri.

Il caso Cloudflare/Okta ci offre una verifica concettuale: progettare `assume breach` significa aspettarsi che il primo controllo possa fallire e chiedere al secondo boundary di contenere ancora il danno.

> **Order Operations non diventa “secure”. Diventa un sistema in cui rischio, privilegio, controllo ed evidence sono abbastanza espliciti da poter essere migliorati e verificati.**