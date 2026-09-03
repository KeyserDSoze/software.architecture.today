## Compute: VM, PaaS, container, Kubernetes, serverless

Quando diciamo “dobbiamo scegliere dove far girare l'applicazione” in realtà stiamo scegliendo **quanto controllo vogliamo possedere e quanto lavoro operativo siamo disposti a pagare**.

Le categorie principali sono note:

- virtual machine;
- managed web/application platform;
- container platform;
- Kubernetes;
- serverless functions / event-driven compute.

Il problema è che vengono spesso trattate come una scala di maturità.

```text
VM
↓
containers
↓
Kubernetes
↓
serverless
```

Questa scala non esiste.

Sono modelli operativi differenti.

## La domanda utile: che cosa dobbiamo controllare?

Per ogni workload chiediamo:

1. abbiamo bisogno di controllare il sistema operativo?
2. abbiamo requisiti speciali di networking?
3. abbiamo bisogno di daemon/processi particolari?
4. dobbiamo scegliere runtime non supportati da PaaS?
5. serve scaling indipendente di molti componenti?
6. esistono workload bursty o event-driven?
7. quanto è importante scale-to-zero?
8. quale startup latency è accettabile?
9. quale livello di isolamento serve?
10. il team possiede skill e capacità operativa per il livello di controllo scelto?

Queste domande eliminano gran parte delle discussioni ideologiche.

## Virtual machine

Una VM compra controllo.

Possiamo controllare:

- OS;
- agent;
- filesystem;
- network stack;
- runtime;
- software installato;
- process lifecycle.

Ma dobbiamo pagare:

- patching;
- hardening;
- image lifecycle;
- autoscaling più esplicito;
- configuration management;
- capacity management;
- maggiore superficie operativa.

Una VM non è “legacy”.

Può essere la scelta corretta per:

- software con vincoli OS specifici;
- appliance;
- migrazioni lift-and-shift temporanee;
- workload con dipendenze non supportate da piattaforme gestite;
- ambienti che richiedono controllo profondo.

Il problema non è usare VM.

È usarle quando il controllo che comprano non serve.

## PaaS applicativo

Un servizio come Azure App Service, AWS Elastic Beanstalk o Google App Engine riduce il numero di decisioni operative che il team deve possedere direttamente.

Il provider gestisce una parte maggiore di:

- patching infrastrutturale;
- host lifecycle;
- runtime hosting;
- scaling integration;
- health management;
- deployment integration.

Il costo è minore libertà.

Possiamo avere:

- limiti sul runtime;
- networking più vincolato;
- lifecycle gestito dal servizio;
- configuration model specifico;
- minore portabilità diretta.

Questo è spesso un buon compromesso per un workload relativamente tradizionale.

La semplicità non è un difetto.

> **Se un PaaS soddisfa il workload, sostituirlo con un orchestratore più potente non è automaticamente un upgrade.**

## Container

Il container separa artefatto applicativo e host.

Può migliorare:

- ripetibilità dell'ambiente;
- portability del runtime;
- packaging;
- isolamento;
- deployment consistency.

Ma containerizzare non significa che serva Kubernetes.

Questa distinzione è fondamentale.

Microsoft Azure Architecture Center confronta Container Apps, App Service e AKS proprio lungo l'asse **ease of use vs configurability**. La guida nota che AKS offre il massimo controllo ma richiede più effort operativo, mentre piattaforme PaaS sono adatte quando il focus è sulla feature delivery e non sulla gestione dell'infrastruttura.

Fonte:

- [Microsoft Learn — Choose an Azure container service](https://learn.microsoft.com/azure/architecture/guide/choose-azure-container-service)

## Kubernetes

Kubernetes compra una quantità enorme di capability:

- orchestration;
- scheduling;
- service discovery;
- deployment primitives;
- scaling;
- extensibility;
- policy integration;
- workload portability;
- ecosystem.

Ma introduce anche un sistema distribuito che dobbiamo comprendere e governare.

Il fatto che AKS, EKS o GKE siano “managed” non significa che l'applicazione non debba più conoscere:

- resource request/limit;
- pod disruption;
- readiness/liveness;
- autoscaling behavior;
- network policy;
- ingress;
- image lifecycle;
- secret/config injection;
- cluster upgrade compatibility;
- observability;
- cost allocation.

Kubernetes ha un ottimo fit quando abbiamo bisogno delle proprietà che compra.

Per esempio:

- molti workload containerizzati;
- team piattaforma dedicato;
- requisiti di configurabilità avanzata;
- scheduler/orchestration come capability reale;
- policy e runtime condivisi;
- ecosistema che giustifica la complessità.

Ha un fit peggiore quando il requisito è semplicemente:

> “abbiamo una API Node.js e un worker”.

## Serverless

Serverless spinge più in là la delega dell'infrastruttura.

È interessante per:

- workload event-driven;
- burst imprevedibili;
- execution breve;
- scale-to-zero;
- integrazioni;
- automazioni;
- processing indipendente.

Ma ha trade-off:

- execution model specifico;
- timeout/limit;
- cold start a seconda della piattaforma e configurazione;
- observability distribuita;
- cost model che cambia con il volume;
- coupling più forte alle primitive provider;
- maggiore frammentazione se usato per ogni piccola funzione.

Anche qui il pattern non è:

```text
serverless = moderno
```

ma:

```text
serverless = modello operativo con forze specifiche
```

## Real case — dacadoo: VM → Kubernetes → serverless

Un caso documentato interessante è quello di dacadoo pubblicato nell'AWS Architecture Blog.

L'azienda descrive un percorso in tre fasi:

1. una singola VM;
2. più cluster Kubernetes globali;
3. una soluzione serverless e geo-ridondante.

AWS riporta nel caso una riduzione dei costi cloud del 78% e una drastica riduzione dell'effort infrastrutturale, ma il punto che ci interessa non è il numero in sé.

È il percorso.

L'architettura non è nata “serverless perché serverless è migliore”.

È cambiata perché sono cambiati:

- scala;
- distribuzione geografica;
- esigenze operative;
- automazione;
- cost structure.

Fonte:

- [AWS Architecture Blog — From virtual machine to Kubernetes to serverless: How dacadoo saved 78% on cloud costs and automated operations](https://aws.amazon.com/blogs/architecture/from-virtual-machine-to-kubernetes-to-serverless-how-dacadoo-saved-78-on-cloud-costs-and-automated-operations/)

È un ottimo esempio del principio:

> **la topologia cloud è una conseguenza del workload, non una identità del team.**

## Un Compute Fit Test

Prima di scegliere il runtime cloud, possiamo costruire una tabella semplice.

| Forza | VM | PaaS | Managed Containers | Kubernetes | Serverless |
|---|---|---|---|---|---|
| controllo OS | alto | basso | basso/medio | medio/alto | minimo |
| operational effort | alto | basso | basso/medio | alto | basso/medio |
| portability artefatto | media | medio-bassa | alta | alta | medio-bassa |
| scaling indipendente | possibile | buono | buono | eccellente | eccellente |
| event-driven | manuale | possibile | buono | buono | eccellente |
| configurabilità | alta | bassa/media | media | molto alta | bassa/media |
| cognitive load | medio/alto | basso | medio | alto | medio |

Questa tabella non decide.

Ci impedisce soltanto di saltare direttamente al logo.

## ESI: perché non scegliamo AKS

Order Operations ha oggi:

```text
una API
un outbox publisher
PostgreSQL
un canale messaging
un team unico
un lifecycle applicativo condiviso
```

Non ha:

- decine di servizi;
- runtime eterogenei;
- necessità di scheduling custom;
- bisogno di service mesh;
- autoscaling indipendente complesso;
- un requisito di cluster portability;
- un team dedicato a Kubernetes.

Quindi, per ora:

> **AKS non ha fit sufficiente.**

Non perché AKS sia sbagliato.

Perché comprerebbe molto controllo che il workload non sa ancora usare a proprio vantaggio.

La scelta concreta arriverà nella sezione ESI.

Ma abbiamo già ristretto lo spazio:

```text
VM         → troppo ownership infrastrutturale
AKS        → troppo controllo non necessario
serverless → possibile, ma non serve frammentare il modular monolith
PaaS       → candidato forte
```

Questo è il tipo di eliminazione che una buona architettura deve saper fare.

> **La tecnologia che non scegliamo è parte della decisione tanto quanto quella che scegliamo.**