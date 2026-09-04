# Capitolo 21 — AI-ready repository

Un repository può essere perfettamente comprensibile a chi ci lavora da tre anni e quasi indecifrabile per chi entra oggi.

La ragione è semplice: una parte della conoscenza necessaria a modificare il sistema non vive davvero nel repository. Vive nelle persone, nelle abitudini e nelle frasi che iniziano con “ricordati che…”.

Il team sa che una migration richiede un ordine preciso, che un certo package contiene semantica di Payments anche se il nome sembra generico, che un warning è tollerabile in locale ma non in produzione, che un test lento non può essere saltato quando cambia un contratto, che una classe apparentemente ridondante esiste per tenere il legacy dietro un boundary intenzionale.

Per un nuovo engineer questo diventa onboarding costoso. Per un coding agent può diventare qualcosa di più pericoloso: **execution molto veloce costruita sopra un modello incompleto del sistema**.

> **Un repository AI-ready non deve dire tutto all'agente. Deve rendere economico trovare ciò che è autorevole, difficile inventare ciò che manca e semplice verificare ciò che è stato cambiato.**

## Il repository come ambiente operativo

Siamo abituati a pensare al repository come a source code, configuration e test. Nel lavoro agentico questa definizione è troppo stretta.

Chi esegue un task deve anche capire dove vivono le decisioni, quali boundary sono intenzionali, chi possiede la semantica, quali comandi preparano e verificano il progetto, quali failure indicano un problema del codice e quali invece un problema dell'ambiente, quali azioni possono essere eseguite e quali trasformano il task in una nuova decisione.

Questo era già vero per gli umani. L'AI rende il problema più visibile perché aumenta il numero e la velocità degli esecutori che entrano nel codice senza possedere tutta la memoria storica del team.

La domanda quindi non è “come scriviamo prompt migliori?”. È:

> **quanto del modello necessario a lavorare responsabilmente sul sistema è persistente, scopribile e verificabile?**

## Context engineering non significa prompt sempre più grandi

Nel Capitolo 1 abbiamo introdotto il context engineering come disciplina più ampia del prompt engineering. Qui la differenza diventa concreta.

Un prompt come:

```text
Implementa l'endpoint di escalation.
```

contiene troppo poco. Possiamo reagire aggiungendo ogni volta TypeScript conventions, ownership di Payments, outbox pattern, architecture rule, test command, security boundary e migration constraint. Ma a quel punto ogni task ricopia una versione privata del repository.

È un modello fragile perché il contesto stabile viene riscritto continuamente, può divergere fra task e costa ogni volta rediscovery, review e token.

Una separazione più sana è:

```text
persistent repository context
+ task-specific delta
+ current evidence
= execution context
```

Il repository contiene ciò che resta vero fra i task. La issue descrive ciò che deve cambiare adesso. Test, diff, log e runtime evidence descrivono lo stato corrente e il risultato dell'esecuzione.

Quando questi tre livelli vengono confusi, le istruzioni crescono, diventano contraddittorie e iniziano a comportarsi come una seconda architettura non governata.

## Non esiste il file magico

GitHub documenta le custom instructions come un modo per rendere persistenti informazioni su struttura, convenzioni, build, test e validation. OpenAI descrive `AGENTS.md` con un ruolo analogo per agenti che devono orientarsi e lavorare nel repository. Entrambe le direzioni diventano utili soltanto se sotto le istruzioni esistono setup riproducibile, test affidabili e documentazione scopribile.

Fonti:

- [GitHub Docs — Customize Copilot for your project](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-copilot-overview)
- [GitHub Docs — Best practices for using GitHub Copilot to work on tasks](https://docs.github.com/en/copilot/tutorials/cloud-agent/get-the-best-results)
- [OpenAI — Introducing Codex](https://openai.com/index/introducing-codex/)

Per questo `AGENTS.md` può essere un ottimo **entry point operativo**, ma non può compensare un repository che non sa costruirsi, testarsi o spiegare i propri confini.

Una instruction come “scrivi codice pulito, usa best practice, aggiungi test” contiene quasi zero informazione specifica. Un entry point che indica il purpose del prodotto, i documenti canonical, i golden command, i boundary non negoziabili e le stop condition riduce invece ambiguità reale.

## Il contesto ha tre lavori diversi

Nel Capitolo 21 separeremo tre forme di contesto, non per creare tre nuovi documenti ma per capire che cosa deve fare ciascuna informazione.

Il **navigation context** risponde a “dove devo guardare?”. Una repository map, un indice dei documenti canonical e una mappa delle responsabilità appartengono qui.

Il **decision context** risponde a “perché questa forma del sistema è intenzionale?”. ADR, Data Ownership Map, Threat Model, Architecture Fitness Checklist e Refactoring Safety Plan sono esempi già costruiti nei capitoli precedenti.

L'**execution context** risponde a “come lavoro e come dimostro il risultato?”. Bootstrap, build, test, verification tier, oracle protetti e stop condition appartengono a questo livello.

Un repository pieno di comandi ma senza decision context può produrre modifiche verdi e semanticamente sbagliate. Un repository pieno di documenti ma senza verification path è istruttivo e poco delegabile.

AI-readiness nasce dalla relazione fra i due.

## AI-ready non significa AI-only

Una repository map chiara aiuta anche un nuovo developer, un reviewer, chi interviene durante un incident, Security, l'architect che valuta un boundary e il maintainer che torna su una decisione sei mesi dopo.

Questo è un test importante per evitare il cargo cult: se una convenzione esiste soltanto per un particolare modello o tool e rende peggiore il lavoro umano, il suo fit è sospetto.

Molte proprietà di un repository AI-ready sono semplicemente proprietà di un repository ben governato rese più importanti dall'aumento della execution automation: source of truth chiara, ownership, setup ripetibile, task bounded ed evidence leggibile.

## Il problema ESI

Order Operations è il caso ideale perché ha già accumulato molta conoscenza: Functional Analysis, Requirements, contract, ownership, failure, security, reliability, observability, testing, legacy understanding, refactoring safety, architecture fitness, Cost Model, codice, migration e IaC.

Il lettore del libro li conosce perché li ha visti nascere. Un agente che entra oggi nel repository no.

Quindi ESI non deve produrre altra conoscenza. Deve costruire **un percorso attraverso la conoscenza che esiste già**.

Commerce & Operations vuole ridurre il costo di onboarding dei coding agent. Platform vuole una convenzione riusabile. Security non vuole che una instruction venga confusa con permission o authorization. Engineering non vuole mantenere la stessa architettura in cinque file diversi per cinque tool. Finance, dopo il Capitolo 20, vede anche il costo economico della rediscovery ripetitiva.

La tensione è evidente: troppo poco persistent context aumenta inferenza e rediscovery; troppo contesto always-on aumenta staleness, duplicazione, conflitto e context cost.

## Il compromesso del Capitolo 21

ESI sceglierà una struttura piccola:

```text
short operational AGENTS.md
→ repository map
→ canonical documents
→ executable verification
→ explicit stop conditions
```

`AGENTS.md` farà routing, non enciclopedia. La repository map descriverà responsabilità, non ogni file. Le regole meccaniche già comprese resteranno nei fitness test. Le decisioni semantiche continueranno a vivere nei loro documenti canonical.

Il quality floor resta coerente con tutto il libro: una instruction non diventa evidence, non autorizza una one-way door, non contiene secret, non può promuovere un'inferenza a requisito confermato e non deve duplicare una source of truth importante.

Alla fine del capitolo Order Operations avrà un entry point operativo, una Repository Map, golden command realmente esistenti e un piccolo context-fitness gate che verifica soltanto le proprietà meccaniche verificabili.

Non avrà ancora una politica completa di autonomia degli agenti. Quello arriverà dopo.

## La domanda del capitolo

Non è:

> Quale file di prompt dobbiamo aggiungere?

È:

> **Come trasformiamo un repository pieno di conoscenza in un ambiente nel quale un nuovo esecutore può trovare il contesto giusto, capire il proprio boundary e produrre evidence senza dipendere dalla memoria privata del team?**

Questa è l'AI-readiness che ci interessa.