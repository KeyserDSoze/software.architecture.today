## Network boundary: ingress, egress e private access

Nel Capitolo 12 abbiamo lasciato volutamente aperta la security topology.

Ora possiamo decidere.

Ma prima serve una regola:

> **Private non significa trusted. Public non significa automaticamente insecure.**

Un endpoint pubblico protetto da identity forte, authorization, rate limiting e monitoring può essere più sicuro di un endpoint privato raggiungibile da una rete piatta dove qualunque workload può muoversi lateralmente.

La rete è un controllo.

Non è il controllo.

## Ingress

Order Operations è uno strumento interno ESI.

Il journey corrente non richiede accesso Internet anonimo né consumer esterni.

Questo ci permette di ridurre l'esposizione.

La direzione scelta è:

```text
ESI workforce
→ enterprise access path / trusted corporate connectivity
→ private App Service ingress
→ Order Operations
```

L'applicazione continua comunque a richiedere Entra authentication e authorization applicativa.

Il private ingress non sostituisce l'identità.

Riduce soltanto la superficie raggiungibile.

## App Service private endpoint

Microsoft raccomanda i private endpoint come opzione per limitare l'esposizione diretta dell'App Service alla rete pubblica e consentire accesso controllato attraverso la rete privata.

Fonte:

- [Microsoft Learn — App Service architecture best practices](https://learn.microsoft.com/azure/well-architected/service-guides/app-service-web-apps)

Per ESI scegliamo quindi:

```text
public network access disabled
+ private endpoint inbound
+ Entra authentication
+ application authorization
```

Questo è defense in depth.

## Egress

L'egress viene spesso dimenticato.

Un workload compromesso non vuole soltanto ricevere traffico.

Può voler:

- esfiltrare dati;
- chiamare un command-and-control endpoint;
- interrogare metadata service;
- raggiungere servizi interni;
- abusare di credenziali verso provider esterni.

Quindi dobbiamo inventariare gli egress necessari.

Per Order Operations:

```text
PostgreSQL
Service Bus
Key Vault
Azure Monitor / telemetry
Entra / identity endpoints
Payments & Risk API/event endpoints quando applicabile
approved external provider endpoints
```

Qualunque nuovo egress deve essere una decisione visibile.

## VNet integration

Per App Service, inbound private endpoint e outbound VNet integration risolvono due problemi diversi.

La topologia concettuale è:

```text
              private inbound
ESI user ───────────────────────→ App Service
                                      │
                                      │ outbound VNet integration
                                      ▼
                               workload network
                               │      │      │
                               ▼      ▼      ▼
                           Postgres ServiceBus KeyVault
```

Il fatto che entrambi usino “networking” non li rende lo stesso controllo.

## Data plane pubblico o privato?

Per PostgreSQL, Service Bus e Key Vault scegliamo una direzione coerente:

- private connectivity quando supportata dal tier scelto;
- public network access disabilitato per produzione quando la private path è attiva;
- DNS e routing gestiti dalla platform foundation;
- identity/RBAC ancora obbligatori.

Il quality floor è:

> Il possesso di un indirizzo di rete raggiungibile non deve essere sufficiente per usare la capability.

## Costi del private networking

Private endpoint, DNS privato e VNet integration non sono gratis in termini operativi.

Introducono:

- DNS troubleshooting;
- subnet planning;
- dependency dalla landing zone;
- costi di rete;
- failure mode di name resolution;
- complessità locale per developer;
- maggior numero di risorse IaC.

Questo è il costo accettato nel compromesso ESI perché il workload è interno e tratta capability operative sensibili.

Se avessimo un sito pubblico consumer-facing, il compromesso potrebbe essere diverso.

## WAF

Un WAF non viene introdotto automaticamente.

Per il percorso corrente, l'ingress è privato e autenticato.

Non abbiamo un Internet-facing application gateway come requisito.

Quindi nel Capitolo 13 non aggiungiamo WAF soltanto per poter dire che esiste.

Trigger di revisione:

- public ingress;
- partner access;
- Internet exposure;
- compliance requirement;
- threat model che richiede application-layer filtering a monte.

Fit before fashion vale anche per i controlli di sicurezza.

## Egress filtering: non inventiamo un firewall senza bisogno

ESI Platform potrà fornire centralized egress controls nella landing zone.

Order Operations deve dichiarare gli egress richiesti.

Non dobbiamo però aggiungere un firewall dedicato al workload senza sapere:

- threat addressed;
- throughput;
- ownership;
- failure behavior;
- operational cost.

Il requisito architetturale è:

```text
known egress
+ observable egress
+ least-required destinations
```

La tecnologia concreta può appartenere alla platform capability.

## SSRF e outbound trust

Un'applicazione che accetta URL o target arbitrari dal client può trasformare il proprio egress legittimo in un proxy per l'attaccante.

Quindi:

```text
user-provided URL
→ fetch()
```

è una decisione di security architecture, non soltanto codice.

Order Operations non accetta destination arbitrarie per integrazioni.

Gli endpoint downstream sono configurati e controllati.

## Management plane

Esiste poi un'altra rete concettuale: il control plane.

Chi può:

- aprire console Azure;
- cambiare app settings;
- sostituire un package;
- modificare RBAC;
- abilitare public access;
- cambiare network config?

Queste azioni non attraversano necessariamente il data path dell'applicazione, ma possono comprometterla completamente.

Quindi security topology deve includere anche il management plane.

## Break-glass e accesso operativo

Un incident responder potrebbe aver bisogno di accesso privilegiato.

La soluzione non deve essere:

```text
lasciamo SSH/FTP/basic auth attivo per sicurezza
```

Microsoft App Service guidance raccomanda di disabilitare basic authentication e protocolli non necessari e preferire identity moderne.

Fonte:

- [Microsoft Learn — App Service architecture best practices](https://learn.microsoft.com/azure/well-architected/service-guides/app-service-web-apps)

L'accesso operativo deve essere progettato, temporaneo e auditabile.

## Compromesso ESI

**Esigenza:** ridurre superficie d'attacco e lateral movement.

**Tensione:** private connectivity vs semplicità di deployment, debugging e cost.

**Decisione:** produzione con private ingress e private data-plane connectivity per i servizi sensibili, mantenendo identity e authorization come boundary principali.

**Costo accettato:** maggiore complessità di networking, DNS e ambiente developer.

**Quality floor:** nessun public data plane sensibile per comodità, nessuna rete considerata trusted per default, accesso amministrativo separato.

**Guardrail:** IaC, platform landing zone, DNS gestito, explicit egress inventory, policy e test di connectivity.

## La frase da ricordare

> **La rete può ridurre chi arriva alla porta. L'identità decide ancora chi può entrare e che cosa può fare.**