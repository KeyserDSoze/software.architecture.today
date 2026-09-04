## Esercizi e sintesi

Il cloud non elimina l'architettura.

La rende più facile da materializzare e, proprio per questo, più importante da governare.

In questo capitolo abbiamo trattato il cloud non come catalogo di servizi ma come **modello operativo che sposta responsabilità, failure boundary, costi e cognitive load**.

## Idee chiave

1. Il cloud non è un'architettura: è un ambiente operativo con proprietà specifiche.
2. **Cloud-native** e **cloud-appropriate** non sono sinonimi.
3. Un workload comprende codice, dati, infrastruttura, identity, operations e recovery.
4. Platform team e workload team devono avere ownership esplicita.
5. Landing zone e guardrail servono a distribuire governance senza trasformare Platform in un gate permanente.
6. VM, PaaS, container, Kubernetes e serverless non rappresentano livelli di maturità.
7. Ogni compute model compra una quantità diversa di controllo e operational responsibility.
8. Un managed service delega meccanismi al provider, non l'outcome del workload.
9. Vendor lock-in è una famiglia di costi: API, dati, operation, economia, architettura e organizzazione.
10. Portabilità è una quality attribute e deve avere un valore business.
11. High availability, backup e disaster recovery proteggono da failure differenti.
12. Autoscaling gestisce capacity; non corregge automaticamente bottleneck e overload downstream.
13. Identity è un boundary architetturale del workload.
14. Il secret migliore è spesso quello che possiamo eliminare usando workload identity.
15. Infrastructure as Code rende la configurazione significativa versionabile e riproducibile.
16. Environment parity significa intent e deployment mechanism coerenti, non costi identici.
17. Un Cloud Deployment Map deve mostrare runtime, state, messaging, identity, failure boundary, ownership, recovery e cost drivers.
18. La tecnologia cloud che non scegliamo è parte della decisione.
19. Multi-region senza RTO/RPO è spesso geometry-driven architecture.
20. Più servizi cloud non significano automaticamente più valore cloud.

## Artefatto operativo — Cloud Deployment Map

A questo punto il nostro set di artefatti comprende anche:

```text
Cloud Deployment Map
```

Una versione minima risponde a:

```text
Workload
Business outcome
Environments
Region / failure boundaries
Compute
State and data
Messaging
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

Il valore dell'artefatto non è mostrare ogni resource ID.

È rendere visibili decisioni e responsabilità.

## Esercizio 1 — Cloud-native o cloud-appropriate?

Prendi un sistema reale che conosci.

Elenca le tecnologie che vengono definite “cloud-native”.

Per ognuna rispondi:

1. quale requisito risolve?
2. quale proprietà compra?
3. quale operational cost introduce?
4. il team possiede le skill necessarie?
5. se la rimuovessimo, quale requirement fallirebbe?

Se all'ultima domanda non sai rispondere, hai trovato un candidato per una review di fit.

## Esercizio 2 — Platform boundary

Disegna due colonne:

```text
Platform Team
Workload Team
```

Distribuisci almeno:

- identity foundation;
- networking;
- runtime sizing;
- database schema;
- backup configuration;
- logging platform;
- alert applicativi;
- IaC module;
- deployment;
- incident response;
- cost ownership;
- security baseline.

Per ogni voce ambiguamente condivisa, scrivi:

```text
owner
consumer
escalation path
```

## Esercizio 3 — Compute Fit Test

Confronta per un tuo workload:

```text
VM
PaaS
Container Apps / equivalent
Kubernetes
Serverless
```

Valuta almeno:

- control;
- operational effort;
- scaling;
- isolation;
- portability;
- skill;
- cost model;
- deployment complexity.

Non scegliere la tecnologia con più capability.

Scegli quella con il miglior fit.

## Esercizio 4 — Managed vs self-hosted

Scegli un componente:

- PostgreSQL;
- Kafka;
- Redis;
- Elasticsearch/OpenSearch;
- secrets;
- observability.

Confronta managed e self-hosted includendo:

```text
cloud bill
engineering time
on-call
upgrade
security patching
backup
recovery
capacity
incident complexity
```

Il risultato è diverso dal confronto “VM cost vs service cost”?

## Esercizio 5 — Lock-in Map

Per una tecnologia cloud usata dal tuo team classifica il lock-in:

```text
API
Data
Operational
Economic
Architectural
Organizational
```

Poi indica:

- valore ricevuto;
- costo di uscita;
- probabilità realistica di uscita;
- eventuali guardrail proporzionati.

## Esercizio 6 — Backup non è HA

Prendi un'architettura con database replicato.

Descrivi separatamente cosa succede con:

1. node failure;
2. zone failure;
3. region failure;
4. `DELETE` accidentale;
5. corruption logica introdotta dall'applicazione;
6. credential compromise.

Quale meccanismo di replica/backup/recovery protegge ogni caso?

## Esercizio 7 — RTO/RPO prima di multi-region

Un executive chiede:

> “Voglio multi-region perché non possiamo andare giù.”

Non discutere subito di tecnologia.

Scrivi le dieci domande che faresti per trasformare la frase in requisiti utilizzabili.

## Esercizio 8 — Identity topology

Disegna tutte le identità di un workload:

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

Per ciascuna indica:

- authentication;
- authorization scope;
- credential lifecycle;
- audit;
- failure impact.

## Esercizio 9 — IaC drift

Confronta due ambienti creati manualmente.

Trova differenze in:

- config;
- network;
- identity;
- secret;
- SKU;
- backup;
- logging;
- scaling.

Trasforma almeno una differenza in parameter o policy IaC esplicita.

## Esercizio 10 — Adversarial Cloud Review con AI

Fornisci a un agente:

- Cloud Deployment Map;
- NFR;
- Failure Mode Map;
- IaC;
- cost constraints.

Chiedigli di cercare:

- single point of failure;
- permission eccessive;
- overprovisioning;
- service sprawl;
- failure domain nascosti;
- recovery non verificabile;
- lock-in non compensato;
- risorse senza owner;
- config non versionata.

Poi classifica ogni finding:

```text
proven
plausible
false positive
needs runtime evidence
```

L'AI può allargare la review.

Non sostituisce la conoscenza dell'ambiente reale.

## Esercizio 11 — ESI: sostituisci App Service

Per Order Operations prova a sostituire App Service + WebJob con:

### Variante A

Azure Container Apps.

### Variante B

AKS.

### Variante C

Azure Functions per publisher + altra runtime API.

Per ogni variante scrivi:

- requisito migliorato;
- nuova complessità;
- ownership introdotta;
- impatto su scaling;
- impatto su cost;
- impatto su failure handling;
- trigger che renderebbe la variante preferibile.

Se non trovi un requisito migliorato, non hai una ragione per migrare.

## Esercizio 12 — Cloud Deployment Map del tuo sistema

Costruisci una mappa reale.

Aggiungi accanto a ogni componente:

```text
owner
failure domain
identity
stateful/stateless
recovery strategy
cost driver
```

Poi chiedi a una persona che non ha progettato il sistema di descrivere:

- cosa succede se cade una region;
- dove sono i dati autorevoli;
- chi può deployare;
- chi risponde a un incidente;
- come viene ricostruito l'ambiente.

Le risposte mancanti sono architecture work.

## Autovalutazione

Dovremmo saper rispondere senza consultare il capitolo:

1. Perché cloud-native e cloud-appropriate sono concetti diversi?
2. Che cosa include un workload oltre al codice?
3. Qual è la differenza fra platform team e workload team?
4. Quando un guardrail è preferibile a un gate?
5. Che cosa compra Kubernetes che un PaaS semplice non compra?
6. Perché managed service non significa “problema operativo risolto”?
7. Quali forme di lock-in distinguiamo?
8. Perché replication e backup non sono equivalenti?
9. Qual è la relazione fra RTO/RPO e multi-region?
10. Perché autoscaling può peggiorare un downstream?
11. Perché identity è un boundary architetturale?
12. Che cosa deve contenere una Cloud Deployment Map?
13. Perché l'IaC richiede comunque review e verification?
14. Perché Order Operations non usa AKS oggi?
15. Quali trigger potrebbero rendere sbagliata la scelta App Service + WebJob?

Se alcune risposte sono vaghe, non è un problema di memoria.

Probabilmente il modello mentale deve ancora stabilizzarsi.

## Cosa cambia con l'AI

L'AI rende molto economico generare infrastruttura.

Può produrre in minuti:

```text
Terraform
Bicep
Helm
Kubernetes manifest
network policy
pipeline
cloud diagram
```

Quindi cresce il rischio di **infrastructure by autocomplete**.

Prima generare una piattaforma complessa richiedeva effort sufficiente da imporre una certa friction.

Ora quella friction può sparire.

Questo aumenta il valore di:

- architecture constraints;
- cost review;
- policy-as-code;
- IaC validation;
- threat modeling;
- failure-mode review;
- ownership map;
- stop condition.

Un agente può scrivere venti risorse Azure.

La domanda resta:

> perché ne servono venti?

## Il compromesso ESI del capitolo

### Esigenza

Portare Order Operations in produzione su una piattaforma enterprise governata.

### Tensione

Standardizzazione, autonomia, security, semplicità, cost e future optionality.

### Decisione

```text
Azure application landing zone
+ App Service
+ continuous WebJob
+ Azure Database for PostgreSQL
+ Service Bus Queue
+ managed identity
+ Key Vault
+ Azure Monitor / Application Insights
+ Bicep
+ single region
```

### Costo accettato

- Azure operational coupling;
- niente scaling indipendente del publisher;
- niente multi-region immediato;
- minore configurabilità rispetto a una piattaforma Kubernetes.

### Quality floor

- durable state;
- idempotency;
- access control;
- secret governance;
- backup/recovery;
- observability;
- IaC;
- ownership chiara.

### Trigger

Rivalutiamo quando cambiano:

- scaling profile;
- isolation requirement;
- runtime topology;
- RTO/RPO;
- consumer topology;
- cost curve;
- organizational standards.

## Ponte al Capitolo 13 — Security by Design

Abbiamo volutamente lasciato aperte alcune domande:

- quali network boundary devono essere private?
- quale authorization model applicativo serve?
- come trattiamo privileged access?
- quali dati sono sensibili?
- quali threat attraversano il payment escalation flow?
- come proteggiamo CI/CD e supply chain?
- quali log possono contenere dati sensibili?
- quale secrets rotation è richiesta?

Adesso abbiamo una deployment topology concreta.

Possiamo finalmente fare threat modeling su qualcosa di reale.

Questo ci porta al Capitolo 13.

## Corollario

> **Cloud Architecture non significa usare il cloud al massimo. Significa usare il cloud quanto basta per soddisfare il workload meglio di quanto sapremmo fare possedendo tutta l'infrastruttura da soli.**