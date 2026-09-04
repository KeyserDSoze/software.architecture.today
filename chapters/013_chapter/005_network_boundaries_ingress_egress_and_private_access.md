## Network boundary: ridurre reachability senza confonderla con trust

Nel Capitolo 12 avevamo lasciato aperta la security topology. Ora il threat model ci permette di decidere con una regola semplice: **private non significa trusted e public non significa automaticamente insecure**.

Un endpoint pubblico protetto da identity forte, authorization e monitoring può avere un profilo di rischio migliore di una rete privata e piatta in cui qualunque workload può muoversi lateralmente. La rete è quindi un controllo di reachability. Non sostituisce identity, authorization e least privilege.

## Ingress: ridurre una superficie che il prodotto non usa

Order Operations è un’applicazione interna. Il journey corrente non richiede accesso Internet anonimo, customer traffic o partner integration. Possiamo quindi eliminare una superficie di attacco che non compra alcuna capability del prodotto.

La direzione production è:

```text
ESI workforce
→ enterprise private access path
→ App Service private ingress
→ Entra authentication
→ application authorization
```

Microsoft App Service guidance include private endpoint e restrizione della public exposure tra le opzioni per ridurre la superficie raggiungibile.

Fonte:

- [Microsoft Learn — App Service architecture best practices](https://learn.microsoft.com/azure/well-architected/service-guides/app-service-web-apps)

Il private endpoint non autentica l’utente e non determina a quale tenant possa accedere. Semplicemente rende più piccolo il gruppo di attori che può arrivare al servizio. Entra stabilisce identity; Order Operations continua a decidere authorization.

## Inbound e outbound sono boundary differenti

Per App Service, private endpoint inbound e VNet integration outbound risolvono problemi diversi. L’ingress controlla come il traffico raggiunge l’applicazione; l’egress governa il percorso verso PostgreSQL, Service Bus, Key Vault, telemetry e altre dipendenze.

```text
ESI user ── private ingress ──→ App Service
                                  │
                                  └─ outbound integration ─→ dependencies
```

Confondere i due percorsi porta a diagrammi in cui “è tutto nella VNet” ma nessuno sa quali connessioni siano davvero ammesse.

## Egress: un workload compromesso può usare anche le uscite legittime

Un attaccante dentro il runtime può tentare data exfiltration, command-and-control, accesso a servizi interni o abuso delle credenziali verso provider esterni. Per questo il workload deve conoscere i propri egress necessari: identity endpoint, database, messaging, secret store, observability e qualunque provider approvato.

Order Operations non offre una capability generica `fetch(userProvidedUrl)`. Gli endpoint downstream sono configurati e governati. Questo elimina una classe di SSRF/exfiltration path invece di affidarla soltanto a un firewall.

La direzione architetturale è **known egress + observable egress + least-required destinations**. La tecnologia di enforcement può appartenere alla landing zone e non deve per forza diventare un firewall dedicato al workload.

## Private data plane: defense in depth con un costo operativo

Per PostgreSQL, Service Bus e Key Vault scegliamo private connectivity in produzione quando supportata dalla configurazione selezionata, disabilitando la public data-plane exposure quando il private path è pronto. Identity e RBAC restano comunque necessari.

Questa scelta introduce private DNS, subnet planning, maggiore dipendenza dalla landing zone, troubleshooting più complesso e costi aggiuntivi. Sono costi reali, non dettagli da nascondere dietro la parola “secure”.

ESI li accetta perché il workload è interno e tratta capability operative payment-adjacent. Un prodotto consumer-facing avrebbe un trade-off differente.

## WAF: nessun controllo senza threat path

Il threat model corrente non contiene un Internet-facing application boundary. Per questo non aggiungiamo un WAF soltanto per rendere il diagramma più rassicurante.

La decisione viene registrata come rischio accettato con trigger precisi: public ingress, partner access, mobile/public API, requirement di compliance o un threat model che dimostri la necessità di application-layer filtering a monte.

Fit before fashion vale anche per la security.

## Il management plane è un altro ingresso nel sistema

Un attaccante non deve necessariamente attraversare l’API. Chi può cambiare app setting, RBAC, network exposure, deployment package o configuration cloud può compromettere il workload dal control plane.

Per questo la topology deve comprendere anche deployment identity, operator privilege e break-glass path. Lasciare basic auth, FTP o canali amministrativi permanenti “per emergenza” crea una porta laterale che sfugge al threat model principale.

Microsoft App Service guidance raccomanda di disabilitare protocolli e authentication legacy non necessari e privilegiare identity moderne.

Fonte:

- [Microsoft Learn — App Service architecture best practices](https://learn.microsoft.com/azure/well-architected/service-guides/app-service-web-apps)

## Il compromesso ESI

ESI sceglie private ingress e private data-plane direction per ridurre reachability e lateral movement, accettando maggiore complessità di DNS, networking e troubleshooting. Non considera però la rete una trust zone implicita: authentication, authorization, tenant isolation e scoped identity continuano a essere obbligatori.

Il quality floor è quindi più preciso di “tutto private”: nessun public data plane sensibile per mera comodità, nessun network location considerato trusted di per sé, accesso amministrativo separato e egress significativi espliciti.

> **La rete può ridurre chi arriva alla porta. L’identità decide ancora chi può entrare e che cosa può fare.**