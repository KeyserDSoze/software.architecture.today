## Networking, identity e secrets: progettare chi può fare che cosa

Nel cloud è facile ridurre la sicurezza alla rete privata: chiudiamo le porte, aggiungiamo firewall e consideriamo il perimetro risolto. Ma un workload moderno contiene utenti, runtime, worker, pipeline, operatori, managed service, automazioni e integrazioni esterne. Ognuno ha bisogno di una identità e di un permission boundary.

La rete continua a contare, ma non può più essere l’unico linguaggio del perimetro.

## Network boundary e identity boundary fanno lavori diversi

Una connessione da App Service a PostgreSQL può essere ammessa da una rete privata e restare comunque eccessivamente privilegiata. Dobbiamo ancora sapere quale workload identity si autentichi, quale database role possieda, quali schema possa leggere o modificare e come vengano auditati gli accessi.

La distinzione è semplice:

> **la rete limita chi può raggiungere una capability; l’identità decide che cosa può farci.**

Microsoft Azure Well-Architected Security tratta identity come un perimetro primario che comprende sia persone sia componenti del workload.

Fonte:

- [Microsoft Learn — Architecture strategies for identity and access management](https://learn.microsoft.com/azure/well-architected/security/identity-access)

Questo ci porta a distinguere human identity, workload identity, deployment identity, operator identity e identità delle integrazioni esterne. Una credenziale condivisa per tutti gli attori cancella proprio il confine che ci serve per contenere il blast radius.

## Workload identity: eliminare secret statici quando possiamo

In Azure le Managed Identities consentono alle risorse di ottenere token senza incorporare client secret o password nell’applicazione.

Fonte:

- [Microsoft Learn — Managed identity best practice recommendations](https://learn.microsoft.com/entra/identity/managed-identities-azure-resources/managed-identity-best-practice-recommendations)

Questo non risolve automaticamente l’authorization. Dobbiamo comunque scegliere ruolo e scope minimi, lifecycle, ownership e audit. Il vantaggio è eliminare una classe di credenziali che altrimenti dovrebbe essere distribuita, ruotata e protetta.

Least privilege diventa quindi una proprietà architetturale. Se Order Operations può amministrare l’intero namespace di messaging, leggere ogni secret e scrivere qualsiasi database, il problema non è soltanto una configurazione IAM migliorabile: abbiamo disegnato un blast radius troppo ampio.

## Il secret migliore è quello che il workload non deve custodire

Quando la workload identity può autenticarsi direttamente a una capability, evitiamo rotazione manuale, leak nei log, secret condivisi e configurazioni statiche difficili da governare.

Alcuni secret rimarranno comunque inevitabili: API key di provider esterni, webhook secret, certificate o legacy credential. Questi devono vivere in un secret store dedicato con policy di accesso, rotation, expiry, audit ed emergency revoke.

La configurazione ordinaria non va confusa con i secret. URL, feature flag, queue name e log level possono essere importanti e governati senza avere la stessa sensibilità di una password. Mettere tutto nel secret store rende meno chiaro il lifecycle di entrambe le categorie.

## Private networking è uno strumento di threat reduction

Managed service e runtime possono spesso essere esposti pubblicamente con authentication forte oppure collegati tramite private networking. Un private endpoint può ridurre exposure e soddisfare policy aziendali, ma introduce DNS, routing, deployment ordering e troubleshooting più complessi.

Non possiamo quindi derivare la topologia di rete da una formula come “private è sempre più enterprise”. Serve un threat model che dimostri quale rischio stiamo riducendo e quale nuovo failure mode operativo stiamo introducendo.

Il Capitolo 13 approfondirà questa scelta. Nel Capitolo 12 ci basta non chiuderla prematuramente.

## Anche l’egress appartiene all’architettura

Un workload non riceve soltanto traffico: chiama provider esterni, SaaS, API aziendali, identity endpoint e telemetry service. Queste dipendenze influenzano data exfiltration risk, DNS, NAT capacity, allowlist, costo e soprattutto availability.

La Cloud Deployment Map deve quindi mostrare gli egress significativi, non soltanto l’ingress dell’utente. Una dipendenza esterna invisibile nel diagramma è comunque parte del failure domain reale.

## ESI: baseline di identity e secret management

Per Order Operations fissiamo alcuni guardrail già sufficientemente maturi. Gli operatori e gli amministratori usano Microsoft Entra ID come identity provider aziendale, mentre la semantica di authorization applicativa resta responsabilità del workload. Il runtime usa managed identity quando la capability Azure la supporta; i secret inevitabili di provider esterni vengono conservati in Azure Key Vault o nella capability equivalente della landing zone.

L’accesso al database è scoped secondo la Data Ownership Map e non usa una super-user credential condivisa. Il producer di Payment Escalation riceve permission soltanto per inviare al proprio channel, non diritti amministrativi sull’intero broker. La deployment identity rimane distinta da quella runtime, perché chi può modificare l’infrastruttura non deve coincidere automaticamente con chi esegue l’applicazione.

Sono già obbligatori identity forte, least privilege, TLS, nessun production secret nel repository e separation fra deployment/runtime identity. Restano invece deliberate open decision le private endpoint policy definitive, il modello ingress/WAF, l’egress filtering avanzato, la segmentazione di rete, break-glass e privileged access workflow.

Queste decisioni arriveranno con il threat model del Capitolo 13 e poi evolveranno nello snapshot cumulativo del capstone. Non riempiamo il diagramma cloud con controlli non ancora motivati.

> **Il cloud offre molte primitive di sicurezza. L’architettura decide quali rischi devono governare e quale blast radius deve impedire.**