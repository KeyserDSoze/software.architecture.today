# Capitolo 19 — Architecture Evolution

Un sistema software non conserva la propria architettura perché qualcuno ha approvato un diagramma.

La conserva soltanto se il modo in cui cambia continua a rispettare le proprietà che contano.

È una differenza sostanziale.

Un'architettura può essere sensata il giorno in cui viene progettata e degradarsi lentamente senza che nessuno prenda mai una singola decisione catastrofica.

Succede una pull request alla volta.

Un import diretto "temporaneo".

Una tabella letta dal modulo sbagliato perché era più veloce.

Un retry aggiunto senza budget.

Una nuova dipendenza cloud introdotta per una singola feature.

Un controllo di authorization duplicato in un punto diverso.

Una queue che diventa una seconda source of truth.

Un feature flag che nessuno rimuove.

Una eccezione alle regole di layering che diventa il precedente per la prossima eccezione.

Nessuno di questi cambiamenti, isolatamente, sembra sempre abbastanza grave da convocare una architecture review.

Ma l'architettura reale è l'accumulo di quelle decisioni.

> **L'architecture drift raramente arriva con una grande decisione sbagliata. Più spesso arriva come una lunga serie di piccole decisioni ragionevoli prese senza una direzione comune.**

## Architettura nel tempo

Finora abbiamo parlato di architettura soprattutto come sistema di decisioni.

Abbiamo definito requisiti, confini, contratti, ownership, reliability, security, observability e testing.

Poi abbiamo introdotto un sistema legacy e una migration incrementale.

Adesso dobbiamo aggiungere una dimensione che mancava esplicitamente:

```text
architecture
+
time
```

Una decisione può essere corretta oggi e sbagliata tra due anni.

Una tecnologia può avere fit oggi e perderlo quando cambiano:

- volume;
- numero di team;
- requirement normativi;
- cost curve;
- cloud capability;
- business model;
- threat model;
- organizational ownership;
- expected lifetime del prodotto.

Questo non rende inutile la decisione iniziale.

Rende necessario sapere **quando rimetterla in discussione**.

## Evolutionary Architecture

Thoughtworks definisce una evolutionary architecture come un'architettura che supporta **guided, incremental change across multiple dimensions**.

Il termine importante non è soltanto `change`.

È `guided`.

Un sistema che cambia continuamente senza meccanismi che proteggano le caratteristiche importanti non è evolutivo.

È semplicemente instabile.

Le fitness function nascono per questo: trasformare alcune intenzioni architetturali in feedback ripetibili.

Non necessariamente tutti automatici.

Una fitness function può essere:

- un architecture test;
- una policy CI;
- una misura runtime;
- un SLO;
- una regola di dependency;
- una verifica security;
- un limite di costo;
- una review periodica;
- un recovery drill.

Il punto è che la proprietà importante non resta soltanto nella memoria dell'architect.

Riferimenti:

- [Thoughtworks — Building Evolutionary Architectures, 2nd Edition](https://www.thoughtworks.com/insights/books/building-evolutionaryarchitectures-second-edition)
- [Thoughtworks — Fitness function-driven development](https://www.thoughtworks.com/en-gb/insights/articles/fitness-function-driven-development)
- [AWS Architecture Blog — Using Cloud Fitness Functions to Drive Evolutionary Architecture](https://aws.amazon.com/blogs/architecture/using-cloud-fitness-functions-to-drive-evolutionary-architecture/)

## Non dobbiamo congelare l'architettura

Una possibile reazione all'architecture drift è aumentare la governance manuale.

Più review.

Più approvazioni.

Più architecture board.

Più template.

Più firme.

Questo può ridurre alcune deviazioni.

Può anche trasformare l'architettura in una coda organizzativa.

Il nostro obiettivo non è impedire il cambiamento.

È rendere economico cambiare **senza perdere accidentalmente ciò che avevamo deciso di proteggere**.

Microsoft Azure Well-Architected Framework tratta esplicitamente il workload come qualcosa che deve adattarsi quando cambia il proprio scopo e raccomanda un ciclo continuo di assessment e miglioramento, non una review una tantum.

Riferimenti:

- [Microsoft Learn — Azure Well-Architected Framework workloads](https://learn.microsoft.com/en-us/azure/well-architected/workloads)
- [Microsoft Learn — Complete an Azure Well-Architected Review assessment](https://learn.microsoft.com/en-us/azure/well-architected/design-guides/implementing-recommendations)

> **Governance utile non significa chiedere più permessi. Significa rendere più visibile quando stiamo uscendo dai limiti che abbiamo scelto.**

## Il problema ESI

Order Operations sta diventando un prodotto reale.

Ha ormai:

- analisi funzionale;
- requirement;
- API ed event contract;
- data ownership;
- cloud topology;
- threat model;
- reliability contract;
- observability contract;
- testing strategy;
- legacy understanding;
- refactoring safety plan;
- codice TypeScript;
- migration SQL;
- IaC;
- test eseguibili.

Questa ricchezza crea un nuovo rischio.

Più proprietà vogliamo proteggere, più facile diventa affidarsi alla memoria e alla review umana.

Platform Engineering chiede quindi a Commerce & Operations di adottare alcune regole verificabili:

```text
no direct dependency on legacy implementation
bounded module dependencies
no vendor SDK in application/domain code
no hidden cross-module data ownership
mandatory owner/evidence for critical architecture exceptions
```

Il team prodotto è d'accordo sul principio.

Ma pone un limite:

> non vuole trasformare ogni PR in una sessione di architecture governance.

Security vuole controlli automatici.

Platform vuole standardizzazione.

Product vuole mantenere lead time basso.

Finance non vuole un'altra piattaforma di governance costosa.

Gli architect vogliono evitare che una metrica diventi un KPI cieco.

Questo sarà il compromesso del capitolo.

## Il compromesso del Capitolo 19

**Esigenza:** permettere a Order Operations di evolvere rapidamente senza perdere boundary, ownership, security, reliability e reversibilità già progettati.

**Tensione:** architectural integrity vs autonomia del team vs feedback speed vs costo della governance.

**Decisione:** poche fitness function ad alto valore, il più vicino possibile al cambiamento che possono validare; architecture review umana soltanto dove serve judgment.

**Costo accettato:** alcune scelte verranno rifiutate automaticamente e alcune eccezioni richiederanno lavoro esplicito di giustificazione.

**Quality floor:** nessuna regola automatica può sostituire functional analysis, threat modeling, trade-off reasoning o human accountability.

**Guardrail:** Architecture Fitness Checklist, architecture tests, ADR review trigger, exception expiry, ownership e runtime evidence.

## Dove vogliamo arrivare

Alla fine del capitolo Order Operations avrà:

```text
Architecture Fitness Checklist
+ executable architecture tests
+ architecture exception policy
+ ADR review triggers
+ technical-debt risk framing
```

E soprattutto avremo introdotto un principio che continuerà fino ai capitoli sugli agenti:

> **L'AI può produrre cambiamenti più velocemente di quanto una persona possa ispezionare ogni dettaglio. Per questo l'intento architetturale deve diventare sempre più verificabile dal sistema di engineering, non soltanto ricordato dagli esseri umani.**
