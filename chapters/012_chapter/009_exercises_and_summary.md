## Sintesi: il cloud sposta responsabilità, non elimina l’architettura

Il cloud rende l’infrastruttura più facile da materializzare e, proprio per questo, aumenta l’importanza del giudizio che precede il provisioning. Il tema del capitolo non è stato il catalogo dei servizi, ma **quale lavoro operativo vogliamo possedere e quale possiamo delegare mantenendo il controllo che il workload richiede**.

Cloud-native e cloud-appropriate non sono sinonimi. VM, PaaS, container platform, Kubernetes e serverless non formano una scala evolutiva: comprano quantità differenti di controllo, configurabilità e responsabilità. Un managed service delega meccanismi al provider ma non l’outcome del prodotto. La landing zone distribuisce governance attraverso guardrail senza trasformare Platform Engineering nel proprietario delle decisioni applicative.

Lo stesso principio governa reliability e security. High availability, backup e disaster recovery proteggono failure differenti; multi-region ha senso soltanto quando RTO/RPO ne pagano il costo. Autoscaling compra capacità e può perfino peggiorare un downstream più piccolo. Network e identity sono boundary complementari; workload identity può eliminare molti secret statici, mentre least privilege limita il blast radius. Infrastructure as Code rende la topologia ripetibile e reviewable, ma un template valido può comunque codificare una cattiva architettura.

La Cloud Deployment Map raccoglie queste decisioni e le collega a ownership, failure domain, recovery e cost driver. Il suo valore non è inventariare ogni resource ID, ma spiegare perché una risorsa esiste e chi deve operarla.

## Artefatto operativo — Cloud Deployment Map

```text
Workload
Business outcome
Environments
Region / failure boundaries
Compute
State and data
Messaging / integration
Identity and secrets
Networking
Observability
Deployment / IaC
Ownership
Recovery
Cost drivers
Open decisions
Review triggers
```

La baseline del Capitolo 12 per Order Operations è una Azure application landing zone con App Service, continuous WebJob, PostgreSQL Flexible Server, Service Bus Queue, managed identity, Key Vault, observability foundation, Bicep e una sola region. Non è una recommendation universale: è il fit corrente del workload simulato ESI.

## Esercizio 1 — Cloud-native o cloud-appropriate?

Prendi un sistema reale che conosci e individua le tecnologie che vengono definite “cloud-native”. Per ciascuna chiedi quale requisito risolva, quale proprietà compri, quale operational cost introduca, se il team possieda le skill necessarie e soprattutto quale requisito fallirebbe se la rimuovessimo.

Se l’ultima risposta è vaga, hai trovato un candidato per una review di fit.

## Esercizio 2 — Platform boundary

Disegna due colonne:

```text
Platform Team
Workload Team
```

Distribuisci identity foundation, networking, runtime sizing, database schema, backup configuration, logging platform, alert applicativi, moduli IaC, deployment, incident response, cost ownership e security baseline. Per ogni responsabilità condivisa rendi espliciti owner, consumer ed escalation path.

## Esercizio 3 — Compute Fit Test

Confronta per un workload reale:

```text
VM
PaaS
Managed Containers
Kubernetes
Serverless
```

Valuta control, operational effort, scaling, isolation, portability, skill, cost model e deployment complexity. Non scegliere il modello con più capability: scegli quello in cui il controllo acquistato svolge davvero un lavoro.

## Esercizio 4 — Managed vs self-hosted

Scegli PostgreSQL, Kafka, Redis, search, secret management oppure observability e confronta managed e self-hosted includendo non soltanto la cloud bill, ma engineering time, on-call, upgrade, security patching, backup, recovery, capacity e incident complexity.

Confronta poi il risultato con il semplice costo delle VM. Quanto cambia la decisione quando il cognitive load entra davvero nel TCO?

## Esercizio 5 — Lock-in Map

Per una tecnologia cloud classifica il lock-in in termini di API, dati, operations, economia, architettura e organizzazione. Per ogni categoria indica valore ricevuto, costo di uscita e probabilità realistica che quell’uscita serva davvero.

Progetta guardrail proporzionati: non cercare portabilità assoluta se il business non la paga.

## Esercizio 6 — Backup non è HA

Prendi un’architettura con database replicato e descrivi separatamente che cosa succede con node failure, zone failure, region failure, `DELETE` accidentale, logical corruption e credential compromise. Per ogni scenario indica quale meccanismo — replica, backup, restore, failover o altro — protegge davvero il workload.

## Esercizio 7 — RTO/RPO prima di multi-region

Un executive dice:

> “Voglio multi-region perché non possiamo andare giù.”

Non discutere subito di servizi cloud. Formula le domande necessarie per trasformare quella frase in business impact, RTO, RPO, degraded mode, manual workaround, data loss tolerance, geographic constraint, cost ceiling e recovery ownership.

Solo dopo proponi una topologia.

## Esercizio 8 — Identity topology

Disegna le identity di un workload:

```text
end user
operator
application runtime
background worker
CI/CD pipeline
migration tool
external integration
break-glass admin
```

Per ciascuna indica authentication, authorization scope, credential lifecycle, audit e failure impact. Cerca permission condivise che aumentano inutilmente il blast radius.

## Esercizio 9 — IaC drift

Confronta due ambienti costruiti manualmente. Cerca differenze in config, networking, identity, secret, SKU, backup, logging e scaling. Trasforma almeno una differenza non intenzionale in parameter, module o policy IaC esplicita.

L’obiettivo non è rendere gli ambienti identici nel costo, ma rendere esplicito ciò che deve differire.

## Esercizio 10 — Adversarial Cloud Review con AI

Fornisci a un agente Cloud Deployment Map, NFR, Failure Mode Map, IaC e cost constraint. Chiedigli di cercare single point of failure, permission eccessive, overprovisioning, service sprawl, hidden failure domain, recovery non verificabile, lock-in non compensato, risorse senza owner e configuration non versionata.

Classifica ogni finding come `proven`, `plausible`, `false positive` oppure `needs runtime evidence`. L’AI amplia lo spazio della review; non conosce automaticamente l’ambiente reale.

## Esercizio 11 — ESI: sostituisci App Service

Per Order Operations prova tre alternative alla baseline:

```text
A. Azure Container Apps
B. AKS
C. Azure Functions per il publisher + runtime separato per API
```

Per ogni variante specifica quale requisito migliorerebbe, quale nuova ownership introdurrebbe, come cambierebbero scaling, cost e failure handling e quale trigger renderebbe la variante preferibile.

Se non riesci a indicare una proprietà migliorata, non hai ancora una ragione per migrare.

## Esercizio 12 — Cloud Deployment Map del tuo sistema

Costruisci una mappa reale e annota per ogni componente owner, failure domain, identity, stato `stateful/stateless`, recovery strategy e cost driver. Chiedi poi a una persona che non ha progettato il sistema di spiegare che cosa succede se cade una region, dove vivono i dati autorevoli, chi può deployare, chi risponde a un incidente e come viene ricostruito l’ambiente.

Le risposte mancanti sono architecture work.

## Autovalutazione

Prima di chiudere il capitolo dovresti saper spiegare senza slogan la differenza fra cloud-native e cloud-appropriate; che cosa comprano VM, PaaS, Kubernetes e serverless; perché un managed service non elimini ownership dell’outcome; quando un guardrail sia migliore di un gate; quali forme di lock-in esistano; perché replication e backup non siano equivalenti; come RTO/RPO cambino una decisione multi-region; perché autoscaling possa peggiorare un downstream; perché identity sia un boundary architetturale; e che cosa debba rendere visibile una Cloud Deployment Map.

Dovresti inoltre saper spiegare perché Order Operations non usa AKS oggi e quali segnali renderebbero obsoleta la scelta App Service + WebJob.

## Cosa cambia con l’AI

L’AI rende economicissimo produrre Terraform, Bicep, Helm, manifest Kubernetes, network policy e pipeline. La friction tecnica che prima limitava naturalmente la proliferazione dell’infrastruttura può quasi scomparire.

Per questo cresce il rischio di **infrastructure by autocomplete**. Un agente può generare venti risorse Azure; la domanda architetturale rimane perché ne servano venti, chi le operi, quali failure introducano e quanto costino quando il workload cresce.

I guardrail diventano quindi architecture constraint, cost review, policy-as-code, IaC validation, threat modeling, failure-mode review, ownership map e stop condition.

## Il compromesso ESI

Order Operations deve entrare in produzione dentro una piattaforma enterprise governata senza acquistare più cloud complexity di quanto il workload sappia giustificare. La baseline sceglie:

```text
Azure application landing zone
+ App Service
+ continuous WebJob
+ Azure Database for PostgreSQL Flexible Server
+ Service Bus Queue
+ managed identity
+ Key Vault
+ Azure Monitor / Application Insights foundation
+ Bicep
+ single region
```

Accettiamo Azure operational coupling, scaling non completamente indipendente del publisher, assenza di multi-region immediato e minore configurabilità rispetto a Kubernetes. In cambio riduciamo infrastructure ownership e manteniamo la topology vicina al modular monolith già deciso.

Il quality floor comprende durable state, idempotency, access control, secret governance, backup/recovery, observability, IaC e ownership chiara. Riapriremo la decisione quando cambieranno scale profile, isolation, runtime topology, RTO/RPO, consumer model, cost curve o platform standard.

## Ponte al Capitolo 13 — Security by Design

Il Capitolo 12 lascia volutamente aperte le decisioni che richiedono un threat model più ricco: private network boundary, ingress/WAF, authorization applicativa, privileged access, data classification, protection della CI/CD supply chain, log sensitivity e rotation policy.

Ora abbiamo finalmente una deployment topology concreta su cui fare security reasoning. Il Capitolo 13 non dovrà quindi parlare di security in astratto: potrà minacciare e proteggere un sistema reale.

## Corollario

> **Cloud Architecture non significa usare il cloud al massimo. Significa usare il cloud quanto basta per soddisfare il workload meglio di quanto sapremmo fare possedendo tutta l’infrastruttura da soli.**