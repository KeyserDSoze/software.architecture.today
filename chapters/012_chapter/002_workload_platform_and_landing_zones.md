## Workload, platform e landing zone

Prima dei servizi cloud viene una domanda organizzativa: **chi possiede che cosa?** In un’azienda enterprise non basta sapere come deployare l’applicazione; dobbiamo distinguere ciò che conviene standardizzare a livello aziendale da ciò che deve rimanere sotto il controllo del team che possiede il workload.

Questa separazione decide cognitive load, velocità, accountability e perfino la qualità degli incident response.

## Il workload è più grande del repository

Microsoft Well-Architected descrive un workload come l’insieme di risorse, codice, dati e infrastruttura che collaborano per raggiungere un business outcome. È una definizione utile perché costringe a guardare oltre il deployable.

Per Order Operations il workload comprende il runtime web/API, il background publisher, PostgreSQL, messaging, identity, secrets, network connectivity, observability, configuration, deployment automation e recovery. Alcune parti sono codice del team, altre sono infrastruttura gestita, altre ancora capability fornite da Platform Engineering. Per l’utente finale, però, formano un unico sistema.

## Platform e workload team: autonomia attraverso un contratto

Microsoft Cloud Adoption Framework distingue platform team, che costruiscono capability condivise e riducono cognitive load, da application workload team, che possiedono end-to-end il lifecycle del workload.

Fonte:

- [Microsoft Learn — DevOps teams topologies](https://learn.microsoft.com/azure/cloud-adoption-framework/ready/considerations/devops-teams-topologies)

Questa distinzione evita due estremi ugualmente fragili: un team centrale che approva ogni modifica oppure decine di workload team che reinventano identity, networking, logging, policy e cost allocation.

Un modello più sano è **guardrail + autonomia**. Platform può possedere identity foundation, policy baseline, connectivity condivisa, DNS, subscription provisioning, moduli IaC approvati, security control comuni e cost allocation. Il workload team continua invece a decidere architecture, runtime sizing, data model, messaging topology specifica, NFR, deployment lifecycle, runbook, capacity planning, costo e incident response applicativa.

Il confine concreto varia fra organizzazioni. Ciò che non può variare è la necessità di renderlo esplicito.

## Landing zone: foundation, non architettura del prodotto

Azure Cloud Adoption Framework usa il concetto di **landing zone** per separare foundation aziendale e workload. La platform landing zone mette a disposizione governance, security e capability condivise; la application landing zone offre al team uno spazio governato in cui distribuire e gestire il proprio sistema.

Fonte:

- [Microsoft Learn — What is an Azure landing zone?](https://learn.microsoft.com/azure/cloud-adoption-framework/ready/landing-zone/)

Il concetto è trasferibile anche se cambia la terminologia del provider: organizzare account/subscription/project, policy, networking e identity come foundation comune è un problema enterprise generale.

La piattaforma crea valore quando standardizza ciò che è davvero condiviso. Diventa un problema quando usa la propria disponibilità per decidere l’architettura di ogni workload.

## Standardizzare una capacità non significa imporla a tutti

Se Platform Engineering supporta una piattaforma Kubernetes, un database PostgreSQL gestito, messaging e logging centralizzati, non segue che ogni workload debba usare Kubernetes. Uno standard sano dice: “se ti serve questa capability, questa è la strada supportata”. Uno standard fragile dice: “poiché l’abbiamo costruita, tutti devono usarla”.

Nel primo caso la piattaforma riduce cognitive load. Nel secondo produce **architecture by platform availability**.

Lo stesso vale per qualunque managed service: il catalogo aziendale restringe lo spazio delle soluzioni ammesse, ma il workload deve continuare a giustificare ciò che consuma.

## Guardrail prima dei gate

Un gate manuale può essere appropriato per decisioni ad alto impatto, ma non dovrebbe essere il meccanismo ordinario di governance. Se creare un database richiede ticket sequenziali verso Platform, Security e Networking, l’azienda sta centralizzando anche il lead time.

Un guardrail codificato permette invece al workload team di usare un modulo IaC approvato, mentre policy e baseline applicano automaticamente identity, logging, tagging e configurazioni vietate. Il team continua a possedere sizing e lifecycle della risorsa.

La governance non scompare. Diventa ripetibile e verificabile.

## Shared responsibility dentro la shared responsibility

Il cloud provider divide responsabilità fra provider e customer. Nelle grandi organizzazioni esiste spesso un secondo strato:

```text
cloud provider
↕
platform team
↕
workload team
```

Se questo contratto resta implicito, incidenti e vulnerability producono il classico “pensavo lo facesse Platform” oppure “pensavo lo facesse Azure”. La Cloud Deployment Map deve quindi mostrare non soltanto componenti e connessioni, ma anche ownership operativa.

## ESI: Azure entra come constraint, non come verità universale

Nel nostro scenario ESI usa Microsoft Azure come cloud enterprise principale per Order Operations. Non è una dichiarazione di superiorità del provider: è un vincolo organizzativo simulato. Platform Engineering possiede già una landing zone Azure, l’identity aziendale è integrata con Microsoft Entra ID, logging e policy sono disponibili e il team possiede competenze operative sufficienti. Introdurre un secondo cloud non comprerebbe oggi alcuna proprietà necessaria.

Questa scelta restringe lo spazio tecnologico, ma non sostituisce il reasoning.

La decisione organizzativa del capitolo è quindi:

> **Order Operations vive in una application landing zone governata da Platform, mentre il workload team mantiene ownership delle decisioni applicative, dei NFR, del costo e del lifecycle del prodotto.**

Accettiamo che alcuni servizi e configurazioni siano vincolati dagli standard enterprise e che alcune eccezioni richiedano review. Non accettiamo invece che Platform diventi owner accidentale della semantica del prodotto o che il workload team usi la landing zone come alibi per delegare ciò che deve operare.

Questo è il contratto organizzativo con cui valuteremo le successive decisioni cloud.