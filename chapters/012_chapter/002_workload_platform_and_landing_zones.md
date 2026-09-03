## Workload, platform e landing zone

Prima di parlare di servizi cloud dobbiamo chiarire chi possiede che cosa.

In una organizzazione enterprise la domanda non è soltanto:

> “Come deployiamo questa applicazione?”

È anche:

> “Quale parte dell'ambiente deve essere standardizzata a livello aziendale e quale parte deve rimanere sotto il controllo del team che possiede il workload?”

Questa è una decisione architetturale e organizzativa.

## Il workload come unità di responsabilità

Microsoft Well-Architected descrive un workload come un insieme di risorse, codice, dati e infrastruttura che collaborano per raggiungere un business outcome.

Questa definizione è utile perché evita di ridurre l'architettura cloud alla singola applicazione o alla singola subscription.

Per Order Operations il workload include almeno:

```text
web/API runtime
background processing
PostgreSQL
messaging
identity
secrets
network connectivity
monitoring
configuration
deployment automation
recovery procedure
```

Una parte è codice scritto dal team.

Una parte è infrastruttura.

Una parte è capability fornite dalla piattaforma aziendale.

Ma per l'utente sono un unico sistema.

## Platform team e workload team

Microsoft Cloud Adoption Framework distingue esplicitamente:

- **platform teams**, che costruiscono capability condivise e riducono cognitive load;
- **application workload teams**, che possiedono end-to-end il lifecycle del workload.

Fonte:

- [Microsoft Learn — DevOps teams topologies](https://learn.microsoft.com/azure/cloud-adoption-framework/ready/considerations/devops-teams-topologies)

Questa distinzione risolve un falso dilemma.

Non dobbiamo scegliere fra:

```text
tutto centralizzato
```

e:

```text
ogni team fa qualunque cosa nel cloud
```

Possiamo costruire un modello di **guardrail + autonomia**.

### Platform Engineering può possedere

- identity foundation;
- policy baseline;
- logging platform;
- network connectivity condivisa;
- DNS;
- subscription provisioning;
- approved IaC modules;
- security controls comuni;
- cost allocation baseline;
- platform observability;
- standard di tagging e naming quando utili.

### Il workload team può possedere

- architecture del proprio workload;
- application runtime;
- scaling policy;
- data model;
- messaging topology specifica;
- SLO/NFR del prodotto;
- deployment lifecycle;
- runbook;
- capacity planning;
- cost del workload;
- incident response applicativa.

Questi confini non sono universali.

Dipendono dall'organizzazione.

Ma devono essere espliciti.

## Landing zone: foundation, non architettura dell'applicazione

Azure Cloud Adoption Framework usa il concetto di **landing zone** per separare foundation aziendale e workload.

Una platform landing zone stabilisce governance, security e risorse condivise.

Una application landing zone è l'ambiente in cui il workload team distribuisce e gestisce il proprio sistema all'interno di quei guardrail.

Fonte:

- [Microsoft Learn — What is an Azure landing zone?](https://learn.microsoft.com/azure/cloud-adoption-framework/ready/landing-zone/)

Questa distinzione ci interessa anche se useremo un altro cloud.

AWS Organizations/Control Tower, Google Cloud resource hierarchy e altri strumenti implementano concetti analoghi con terminologie differenti.

La lezione è più generale:

> **La piattaforma deve standardizzare ciò che produce valore condiviso, non appropriarsi delle decisioni locali del workload.**

## Centralizzare ha un costo

Un team centrale può aumentare:

- coerenza;
- security posture;
- compliance;
- riuso;
- controllo costi;
- velocità di onboarding.

Ma può anche diventare:

- bottleneck;
- approval queue;
- proprietario accidentale di sistemi che non comprende;
- produttore di standard troppo generici;
- fonte di eccezioni manuali.

Microsoft stessa raccomanda di centralizzare capability condivise quando producono un chiaro beneficio di governance, operation o economia, non per principio astratto.

Fonte:

- [Microsoft Learn — Azure landing zone](https://learn.microsoft.com/azure/cloud-adoption-framework/ready/landing-zone/)

Quindi anche qui applichiamo fit before fashion.

## Standard non significa servizio obbligatorio

Supponiamo che Platform Engineering offra:

```text
AKS platform
managed PostgreSQL
managed messaging
central logging
managed identity
Key Vault
```

Questo non significa che ogni workload debba usare AKS.

Uno standard sano può dire:

```text
se ti serve Kubernetes,
questa è la piattaforma supportata
```

non:

```text
poiché abbiamo una piattaforma Kubernetes,
ogni applicazione deve diventare Kubernetes
```

La differenza è enorme.

Nel primo caso la piattaforma riduce cognitive load.

Nel secondo crea architecture by platform availability.

## Guardrail vs gate

Un guardrail permette al team di agire autonomamente entro limiti espliciti.

Un gate richiede un permesso umano prima di ogni azione.

Esempio.

### Gate

```text
Per creare un database:
1. apri ticket
2. attendi Security
3. attendi Platform
4. attendi Networking
5. qualcuno crea manualmente la risorsa
```

### Guardrail

```text
Il workload team usa un modulo IaC approvato.
La policy impedisce configurazioni vietate.
Identity, logging e tagging baseline vengono applicati automaticamente.
Il team possiede sizing e lifecycle del database.
```

Il secondo modello scala molto meglio.

Non perché elimina governance.

Perché la codifica.

## Shared responsibility anche dentro l'azienda

Il cloud provider usa un modello di shared responsibility tra provider e customer.

In una grande azienda esiste spesso un secondo livello:

```text
cloud provider
↕
platform team
↕
workload team
```

Se non chiarifichiamo questa catena, incidenti e vulnerability producono frasi come:

- “pensavo lo facesse Platform”;
- “pensavo fosse responsabilità del team applicativo”;
- “pensavo lo facesse Azure”.

Una buona Cloud Deployment Map deve quindi mostrare anche ownership operativa.

## ESI: il nuovo operating model

Per il libro stabiliremo ora una nuova informazione simulata.

ESI usa **Microsoft Azure come cloud enterprise principale** per Order Operations.

Non perché Azure sia “il cloud migliore”.

È un vincolo organizzativo plausibile del nostro scenario:

- Platform Engineering ha già una landing zone Azure;
- identity aziendale è integrata con Microsoft Entra ID;
- central logging e policy sono già disponibili;
- il team possiede competenze operative sufficienti su Azure;
- introdurre un secondo cloud per questo workload non compra una proprietà necessaria.

Questa scelta entra nel contesto come constraint.

Non diventa una raccomandazione universale del libro.

Il capitolo continuerà a usare concetti trasferibili fra provider.

## Il compromesso ESI

Platform vuole coerenza.

Commerce & Operations vuole autonomia.

Security vuole enforcement.

Finance vuole evitare duplicazioni di piattaforma.

La decisione sarà:

> **Order Operations usa una application landing zone governata da Platform, ma il workload team mantiene ownership delle decisioni applicative, dei NFR, del costo e del lifecycle del workload.**

Costo accettato:

- alcune technology choice sono vincolate dagli standard enterprise;
- non ogni servizio possibile è disponibile senza review;
- il team deve aderire a policy comuni.

Quality floor:

- la piattaforma non può diventare alibi per delegare ownership;
- i team centrali non decidono la semantica del prodotto;
- il workload team deve poter osservare e operare ciò che possiede.

Questo è il modello organizzativo con cui valuteremo le prossime decisioni cloud.