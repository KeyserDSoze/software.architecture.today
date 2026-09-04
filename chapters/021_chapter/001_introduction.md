# Capitolo 21 — AI-ready repository

Un repository può essere perfettamente comprensibile a chi ci lavora da tre anni e quasi inutilizzabile per chi entra oggi.

Succede perché una parte della conoscenza non vive davvero nel repository.

Vive nelle persone.

Nel modo in cui sanno che:

- prima di lanciare i test bisogna generare un file locale;
- quella cartella non va modificata direttamente;
- quel package sembra shared ma contiene semantica di Payments;
- quella migration richiede un ordine preciso;
- quel warning è normale in sviluppo ma bloccante in produzione;
- quel test lento non va saltato quando cambia il contratto;
- quella configurazione cloud è intenzionale anche se sembra più costosa;
- quella classe esiste per isolare il legacy e non va “semplificata” importando direttamente il vecchio codice.

Per un nuovo engineer questo produce onboarding lento.

Per un agente produce qualcosa di ancora più pericoloso:

> una implementazione plausibile costruita sopra un modello incompleto del sistema.

## Il repository come ambiente operativo

Un repository AI-ready non è un repository che contiene molti file Markdown dedicati all'AI.

È un repository nel quale una persona o un agente può rispondere rapidamente a domande come:

1. che cosa fa questo sistema?
2. quali sono i suoi confini?
3. quali directory contengono la semantica importante?
4. quali comandi preparano l'ambiente?
5. quali test dimostrano che una modifica è accettabile?
6. quali decisioni non devo cambiare implicitamente?
7. quali file o componenti richiedono un owner specifico?
8. quali azioni sono proibite senza approvazione?
9. quando devo fermarmi e chiedere evidence o decisione?
10. come distinguo una failure della mia modifica da una failure dell'ambiente?

Se per rispondere dobbiamo affidarsi alla memoria del senior più vicino, il repository non è ancora una buona unità di lavoro autonoma.

Questo era già un problema prima dei coding agent.

L'AI lo rende più visibile perché aumenta la frequenza con cui qualcuno — umano o artificiale — entra nel codice senza possedere tutto il contesto storico.

## Context engineering non è prompt engineering

Nel Capitolo 1 abbiamo introdotto il context engineering.

Qui lo rendiamo concreto.

Un prompt come:

```text
Implementa l'endpoint di escalation.
```

contiene pochissimo contesto.

Possiamo compensare con un prompt enorme:

```text
Il sistema usa TypeScript strict.
Payments possiede la semantica economica.
Order Operations possiede soltanto l'intenzione di escalation.
Usa transactional outbox.
Non aggiungere Azure SDK nel domain.
Esegui questi test.
Non modificare la migration precedente.
...
```

Ma se dobbiamo ripetere tutto a ogni task abbiamo costruito un workflow fragile.

Il contesto stabile dovrebbe vivere vicino al sistema che descrive.

Il task dovrebbe aggiungere soprattutto ciò che cambia.

Possiamo pensarlo così:

```text
persistent repository context
+ task-specific context
+ current evidence
= execution context
```

Il primo termine appartiene al repository.

Il secondo appartiene alla issue o al task.

Il terzo arriva da test, runtime, diff, log, metriche e altri strumenti di verifica.

Confondere questi livelli porta a prompt sempre più grandi, contraddittori e difficili da mantenere.

## Non esiste il file magico

GitHub documenta le repository custom instructions come un modo per dare a Copilot contesto persistente su struttura del progetto, convenzioni, build, test e validazione. OpenAI descrive `AGENTS.md` con una funzione simile: indicare come navigare il repository, quali comandi eseguire e quali pratiche rispettare. Entrambe le guidance insistono però su una condizione più ampia: l'agente lavora meglio quando l'ambiente è configurabile, i test sono affidabili e la documentazione è chiara.

Fonti:

- [GitHub Docs — Customize Copilot for your project](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-copilot-overview)
- [GitHub Docs — Best practices for using GitHub Copilot to work on tasks](https://docs.github.com/en/copilot/tutorials/cloud-agent/get-the-best-results)
- [OpenAI — Introducing Codex](https://openai.com/index/introducing-codex/)

Quindi:

> **`AGENTS.md` può essere un ottimo indice operativo. Non può compensare un repository che non sa costruirsi, testarsi o spiegare i propri confini.**

Un file di istruzioni che dice:

```text
scrivi codice pulito
segui le best practice
aggiungi test
```

aggiunge quasi zero informazione.

Un file che dice:

```text
npm test

src/application non può importare src/integration.
Payments & Risk possiede gli effetti economici.
Non aggiungere una seconda source of truth per PaymentStatus.
Ogni modifica di priority deve aggiornare la Functional Analysis.
Se il task richiede cambiare queste regole, fermati: serve decisione architetturale.
```

contiene invece contesto operativo specifico.

## AI-ready non significa AI-only

Se miglioriamo il repository soltanto per un agente, probabilmente stiamo ottimizzando la cosa sbagliata.

Una repository map chiara aiuta anche:

- il nuovo developer;
- chi fa incident response;
- il reviewer;
- chi deve capire una PR sei mesi dopo;
- il team Security;
- l'architect che valuta un nuovo boundary;
- il maintainer che deve aggiornare una dipendenza;
- chi sta cercando di capire se una decisione è ancora valida.

Molte caratteristiche di un repository AI-ready sono semplicemente caratteristiche di un repository ben governato rese più importanti dall'aumento della execution automation.

## Tre categorie di contesto

Per questo capitolo distingueremo tre categorie.

### 1. Navigation context

Dice dove guardare.

Esempi:

```text
repository map
component ownership
document index
entry point
important paths
```

### 2. Decision context

Dice perché alcune forme del sistema sono intenzionali.

Esempi:

```text
ADR
Data Ownership Map
Architecture Fitness Checklist
Threat Model
Refactoring Safety Plan
```

### 3. Execution context

Dice come lavorare e come dimostrare il risultato.

Esempi:

```text
bootstrap
build
test
lint
migration verification
architecture gate
stop conditions
```

Un repository che contiene soltanto execution context può generare modifiche tecnicamente verdi ma semanticamente sbagliate.

Un repository che contiene soltanto decision context può essere molto istruttivo ma difficilissimo da eseguire.

Servono entrambi.

## Il problema ESI

Order Operations ha ormai accumulato:

- Functional Analysis;
- Requirements;
- ADR;
- API ed event contract;
- Data Ownership Map;
- Failure Mode Map;
- Threat Model;
- Reliability Contract;
- Observability Contract;
- Testing Strategy;
- Legacy Understanding Map;
- Refactoring Safety Plan;
- Architecture Fitness Checklist;
- Cost Model;
- codice TypeScript;
- migration;
- IaC;
- test.

Per un lettore del libro tutto questo è comprensibile perché ha seguito i capitoli.

Un agente che entra oggi nel repository non ha seguito i capitoli.

Questo produce il nuovo problema ESI:

> **Come facciamo a rendere il contesto accumulato navigabile senza copiare tutto dentro un prompt o dentro un unico file di istruzioni gigantesco?**

Commerce & Operations vuole aumentare l'uso di coding agent.

Platform vuole una convention riusabile.

Security non vuole che istruzioni generiche autorizzino deployment, secret access o modifica di boundary sensibili.

Gli engineer non vogliono mantenere cinque copie delle stesse regole per cinque tool differenti.

Finance, dopo il Capitolo 20, aggiunge un'altra domanda:

> quanto costa far esplorare ripetutamente a ogni agente lo stesso repository perché il contesto non è organizzato?

## Il compromesso del capitolo

La tensione è:

```text
più persistent context
↕
meno rediscovery
ma
più instruction/documentation maintenance
```

Troppo poco contesto produce esplorazione ripetitiva e decisioni incoerenti.

Troppo contesto produce:

- instruction conflict;
- stale documentation;
- context pollution;
- token cost;
- regole obsolete replicate ovunque;
- falsa fiducia nel fatto che “l'agente lo sappia”.

La scelta ESI sarà:

```text
short operational AGENTS.md
+ explicit repository map
+ canonical decision documents
+ executable verification commands
+ architecture/security stop conditions
+ no duplicated domain encyclopedia
```

Il quality floor resta:

- il repository deve continuare a funzionare bene per gli umani;
- le istruzioni non possono superare i controlli di security;
- una instruction non trasforma una decisione in evidence;
- una instruction non autorizza one-way door;
- una regola importante deve avere una source of truth chiara;
- ciò che può essere verificato automaticamente non deve dipendere soltanto dalla memoria dell'agente.

## Una formula da ricordare

> **Un repository AI-ready non dice all'agente tutto ciò che deve sapere. Gli permette di trovare rapidamente ciò che deve sapere e di dimostrare che non lo ha capito male.**

Nel resto del capitolo costruiremo precisamente questo.