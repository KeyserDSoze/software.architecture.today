# 19.2 — Fitness function: trasformare l'intento in feedback

Una fitness function non è un framework e non è necessariamente un test.

È un meccanismo che ci permette di capire se una caratteristica architetturale importante continua a restare nel range che abbiamo deciso di accettare.

La sequenza è:

```text
decision
→ property
→ evidence mechanism
→ consequence when evidence changes
```

`Il sistema deve essere manutenibile` è un obiettivo.

`src/application non può dipendere da src/integration` è una proprietà che può diventare verificabile.

`Il restore deve rispettare l'RTO dichiarato` può diventarlo.

`Le metric dimensions non devono crescere con caseId` può diventarlo.

`Ogni componente operativo critico deve avere owner` può diventarlo.

Thoughtworks usa il concetto di fitness function proprio per guidare il cambiamento attraverso feedback sulle caratteristiche architetturali. ArchUnit mostra una forma concreta nel codice: regole su layer, dependency e cicli eseguite nella normale suite.

Riferimenti:

- [Thoughtworks — Fitness function-driven development](https://www.thoughtworks.com/en-gb/insights/articles/fitness-function-driven-development)
- [ArchUnit — Unit test your Java architecture](https://www.archunit.org/)

## Il meccanismo segue la proprietà

Non tutto ciò che conta vive nella struttura del source code.

Possiamo avere fitness differenti.

### Strutturali

```text
no forbidden dependency
no legacy implementation leakage
no cycle across selected modules
```

Il gate CI è spesso un buon fit.

### Operative

```text
core journey meets SLO
restore drill meets RTO
alert reaches the right owner
```

Qui servono runtime o ambienti realistici.

### Economiche

```text
cost per useful outcome
idle capacity
telemetry ingestion trend
```

Possono produrre review o investigation invece di fallire ogni build.

### Organizzative

```text
service has maintainer
exception has owner and expiry
critical decision has review trigger
```

GitHub ha reso parte dell'ownership versionata e verificabile tramite `SERVICEOWNERS`, arrivando anche a impedire nuovi file privi di service owner.

Fonte:

- [GitHub Engineering — How we organize and get things done with SERVICEOWNERS](https://github.blog/engineering/architecture-optimization/how-we-organize-and-get-things-done-with-serviceowners/)

Il punto non è uniformare tutto sotto un unico tool.

È scegliere il meccanismo capace di produrre evidence sulla proprietà reale.

## Ogni fitness function deve dire che cosa succede quando cambia

Una misura che nessuno usa non governa nulla.

Una regola che blocca tutto produce invece governance theater e bypass.

Per questo dobbiamo esplicitare anche la **failure action**.

```text
forbidden import
→ fail PR

cost trend worsens
→ review

SLO burn
→ operational response

ADR trigger hit
→ reopen decision
```

La conseguenza deve essere proporzionata alla natura della property.

Non trasformiamo ogni segnale in un page e ogni deviation in un build failure.

## Proteggere il perché, non la tecnologia corrente

Una fitness function può fossilizzare l'architettura se codifica un prodotto invece di una proprietà.

Debole:

```text
must always use App Service
```

Più robusto:

```text
runtime must preserve:
private ingress requirement
managed workload identity
availability target
repeatable deployment
```

Se domani un altro runtime soddisfa meglio questi requisiti, la tecnologia può cambiare senza dover “violare l'architettura”.

> **Il buon guardrail rende difficile perdere una proprietà importante. Non rende difficile cambiare una tecnologia quando il fit cambia.**

## Metric gaming vale anche per l'architettura

Se trasformiamo una metrica in obiettivo assoluto, il team inizierà a ottimizzarla.

```text
max 10 files per module
→ moduli artificiali

zero dependency
→ duplicazione

100% architecture-test coverage
→ regole senza valore
```

La fitness function deve quindi avere una relazione leggibile con un rischio.

Prima di introdurla chiediamo:

```text
Quale decisione protegge?
Quale failure o drift rende visibile?
Perché questo meccanismo è il fit giusto?
Chi agirà quando fallisce?
Quando la regola deve essere riesaminata?
```

Se non sappiamo rispondere, stiamo automatizzando una preferenza.

## Le prime fitness ESI

Order Operations parte con cinque proprietà strutturali ad alto valore:

```text
AF-001
src/ non importa direttamente Operations Desk Classic

AF-002
src/application non dipende da src/integration

AF-003
src/contracts resta indipendente da application/integration/observability/priority

AF-004
src/priority non dipende da integration/observability

AF-005
application/contracts/priority non importano SDK @azure/*
```

Queste regole derivano da decisioni già prese nei capitoli precedenti:

- il legacy resta dietro un adapter;
- l'application layer usa port e contract;
- i contract devono restare boundary leggibili;
- la priority policy deve rimanere testabile senza infrastruttura;
- il vendor cloud non deve diventare semantica core senza una decisione esplicita.

Non sono principi universali su come ogni software debba essere organizzato.

Sono **decisioni ESI rese eseguibili**.

## La fitness function stessa può scadere

Se il sistema cambia, anche il guardrail deve poter cambiare.

Per ogni regola vogliamo almeno:

```text
ID
protected property
risk
mechanism
failure action
owner
review trigger
```

AF-001, per esempio, dovrà essere riesaminata quando il legacy verrà realmente ritirato o il coexistence boundary cambierà.

Una fitness function senza review trigger può diventare legacy tanto quanto il codice che protegge.

> **Automatizzare una decisione significa renderla ripetibile, non renderla eterna.**