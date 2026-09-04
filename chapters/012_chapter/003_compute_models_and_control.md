## Compute: scegliere quanto controllo possedere

Quando decidiamo dove far girare un’applicazione non stiamo scegliendo soltanto un runtime. Stiamo decidendo **quanta parte dello stack vogliamo controllare direttamente e quanta responsabilità operativa siamo disposti a mantenere**.

VM, PaaS, container platform, Kubernetes e serverless vengono spesso raccontati come una scala di maturità. Non lo sono. Ognuno compra un insieme differente di capability e lascia al team una quantità differente di lavoro.

La domanda utile non è “qual è il modello più moderno?”, ma “quale controllo ci serve davvero?”. Se abbiamo bisogno di modificare OS, daemon, networking di basso livello o software di sistema, la risposta sarà diversa da quella di un’API web standard. Se il workload è bursty e breve, scale-to-zero può avere valore. Se molti componenti richiedono scheduling e policy comuni, l’orchestrazione può diventare una capability reale. Se il team non sa operare il livello di controllo scelto, quel controllo diventa debito.

## VM: controllo che va pagato nel tempo

Una virtual machine ci lascia governare OS, filesystem, runtime, agent, networking e process lifecycle. Questo può essere necessario per appliance, software con dipendenze specifiche, migrazioni temporanee o workload che non trovano un fit accettabile nelle piattaforme gestite.

Lo stesso controllo porta patching, hardening, image lifecycle, configuration management, capacity e maggiore superficie operativa. Una VM non è legacy per definizione. Diventa una scelta debole quando il workload paga tutto quel lavoro senza usare davvero la libertà che riceve.

## PaaS: ridurre il lavoro che non differenzia il prodotto

Un application PaaS delega al provider una parte maggiore dell’hosting: lifecycle degli host, patching infrastrutturale, integrazione con health e scaling, deployment primitives e gestione del runtime. Il team conserva application behavior, configuration, NFR e operability del workload, ma non deve possedere ogni strato sottostante.

Il prezzo è minore libertà: runtime supportati, networking, lifecycle e configuration model seguono le regole della piattaforma. Per una web/API application relativamente tradizionale questo può essere un ottimo trade-off.

> **Se un PaaS soddisfa il workload, sostituirlo con un orchestratore più potente non è automaticamente un upgrade.**

## Container non significa Kubernetes

Containerizzare un’applicazione può rendere più ripetibile il packaging e più esplicito il runtime boundary. Può migliorare portability dell’artefatto e coerenza fra ambienti. Nulla di questo implica automaticamente la necessità di un cluster Kubernetes.

Microsoft Azure Architecture Center confronta App Service, Container Apps e AKS proprio lungo l’asse **ease of use vs configurability**: AKS offre più controllo e quindi anche più responsabilità operativa, mentre piattaforme PaaS riducono cognitive load quando il team vuole concentrarsi maggiormente sulla feature delivery.

Fonte:

- [Microsoft Learn — Choose an Azure container service](https://learn.microsoft.com/azure/architecture/guide/choose-azure-container-service)

Una managed container platform può essere un punto intermedio utile quando vogliamo container packaging e scaling gestito senza possedere direttamente un control plane Kubernetes.

## Kubernetes: potente quando l’orchestrazione è parte del requisito

Kubernetes compra scheduling, service discovery, deployment primitive, autoscaling, extensibility, policy integration e un ecosistema molto ricco. È una piattaforma eccellente quando molti workload containerizzati, requisiti avanzati di configurabilità o un operating model di platform engineering rendono queste proprietà economicamente utili.

Il fatto che AKS, EKS o GKE gestiscano parti del control plane non elimina resource request/limit, readiness/liveness, disruption, network policy, ingress, image lifecycle, upgrade compatibility, observability e cost allocation. Il workload continua a vivere sopra un sistema distribuito che deve essere compreso.

Per un’API Node.js e un worker strettamente collegato, il valore di tutto questo controllo può essere inferiore al suo costo.

## Serverless: delegare di più quando l’execution model coincide con il lavoro

Serverless ha un fit forte per workload event-driven, bursty, brevi o fortemente indipendenti, soprattutto quando scale-to-zero e provisioning rapido comprano valore. In cambio accettiamo un execution model più specifico, limiti e timeout della piattaforma, cold-start behavior variabile, observability distribuita e maggiore coupling alle primitive provider.

Il rischio è frammentare un sistema coerente in molte function soltanto perché l’infrastruttura rende facile crearle. Serverless non è “più moderno” di PaaS o container; è un modello operativo con forze proprie.

## Un caso reale: dacadoo e la topologia che cambia con il workload

AWS Architecture Blog ha documentato il percorso di dacadoo da una VM a Kubernetes e successivamente a una soluzione serverless e geo-ridondante. Nel caso AWS riporta anche una forte riduzione di costo ed effort infrastrutturale.

Fonte:

- [AWS Architecture Blog — From virtual machine to Kubernetes to serverless: How dacadoo saved 78% on cloud costs and automated operations](https://aws.amazon.com/blogs/architecture/from-virtual-machine-to-kubernetes-to-serverless-how-dacadoo-saved-78-on-cloud-costs-and-automated-operations/)

Il valore del caso non è trasformare quella sequenza in una roadmap universale. È osservare che la topologia è cambiata insieme a scala, distribuzione geografica, automazione e cost structure. La tecnologia ha seguito il workload.

## Il Compute Fit Test

Quando la decisione merita una comparazione strutturata possiamo usare una matrice, perché qui il confronto è davvero utile:

| Forza | VM | PaaS | Managed Containers | Kubernetes | Serverless |
|---|---|---|---|---|---|
| controllo OS | alto | basso | basso/medio | medio/alto | minimo |
| operational effort | alto | basso | basso/medio | alto | basso/medio |
| portability artefatto | media | medio-bassa | alta | alta | medio-bassa |
| scaling indipendente | possibile | buono | buono | eccellente | eccellente |
| event-driven | manuale | possibile | buono | buono | eccellente |
| configurabilità | alta | bassa/media | media | molto alta | bassa/media |
| cognitive load | medio/alto | basso | medio | alto | medio |

La tabella non assegna un vincitore. Rende visibile quale controllo stiamo comprando e quale lavoro ne deriva.

## ESI: eliminare prima di scegliere

Order Operations ha oggi un’API, un outbox publisher, PostgreSQL, un channel di messaging, un unico workload team e un lifecycle applicativo ancora molto coeso. Non ha decine di servizi, runtime eterogenei, scheduling custom, service mesh, cluster portability come requisito o un team Kubernetes dedicato.

Questo ci permette di restringere lo spazio senza dogma. Le VM comprerebbero ownership infrastrutturale non necessaria. AKS comprerebbe orchestration e configurabilità che il workload oggi non utilizza. Serverless potrebbe essere utile per componenti futuri, ma frammentare ora il modular monolith non compra una proprietà richiesta. Un PaaS applicativo rimane quindi il candidato più forte.

> **La tecnologia che non scegliamo è parte della decisione tanto quanto quella che scegliamo.**

La sezione ESI tradurrà questo reasoning in una topologia concreta.