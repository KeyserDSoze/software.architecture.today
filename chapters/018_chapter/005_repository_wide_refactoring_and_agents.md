# 18.5 — Refactoring repository-wide e agenti

L'AI cambia radicalmente l'economia delle trasformazioni ampie.

Un repository-wide refactoring che prima richiedeva:

- settimane di lavoro manuale;
- decine di search/replace;
- aggiornamento ripetitivo di call site;
- migrazione di framework;
- fix di compilation error;
- modifica di test e configurazioni;

può oggi essere accelerato da agenti, codemod e transformation engine.

Questo è un vantaggio reale.

Ma dobbiamo distinguere due classi di lavoro.

## Trasformazione meccanica

Una trasformazione è prevalentemente meccanica quando la regola è deterministica e il significato cambia poco.

Esempi:

- rename di API;
- aggiornamento import;
- sostituzione di una signature nota;
- migrazione di syntax;
- conversione di project format;
- sostituzione di una dependency con mapping stabilito;
- applicazione di una recipe strutturale.

Qui possiamo spingere molto sull'automazione.

## Trasformazione semantica

Una trasformazione è semantica quando richiede comprendere:

- intent;
- business rule;
- ownership;
- failure behavior;
- authorization;
- contract;
- trade-off.

Esempi:

```text
sposta questa logica nel dominio corretto
```

oppure:

```text
sostituisci il legacy payment workflow con una soluzione moderna
```

Queste richieste non hanno una soluzione meccanicamente corretta.

> **Più una trasformazione modifica il significato, meno il fatto che il codice compili è evidence sufficiente.**

## Codemod e automated refactoring

Gli strumenti di trasformazione strutturale esistevano molto prima degli LLM.

OpenRewrite, per esempio, è un ecosistema open source per refactoring automatico basato su recipe, usato per framework migration, security fix e trasformazioni ripetibili.

Fonte:

- [OpenRewrite — Introduction](https://docs.openrewrite.org/)

Questi strumenti hanno una proprietà molto interessante:

> la trasformazione può essere espressa come regola versionabile e rieseguita.

Quando abbiamo una trasformazione meccanica ben definita, una recipe deterministica può essere preferibile a chiedere a un LLM di riscrivere ogni file liberamente.

## Fit before fashion vale anche per l'automazione

Non tutto deve essere fatto da un agente.

Possiamo scegliere:

```text
regex/search-replace
AST codemod
OpenRewrite recipe
compiler-assisted migration
agentic transformation
manual semantic refactor
```

in base alla natura del problema.

Se dobbiamo rinominare un simbolo in modo sicuro, il language server potrebbe essere il tool migliore.

Se dobbiamo capire se una condizione rappresenta ancora una business rule, nessun AST può decidere da solo.

## L'agente come orchestratore di trasformazioni

Un agente diventa particolarmente utile quando la migration richiede una sequenza:

```text
assess
→ plan
→ transform
→ build
→ test
→ inspect failures
→ repair
→ rerun
→ summarize evidence
```

La documentazione Microsoft di GitHub Copilot modernization descrive proprio workflow strutturati di assessment, planning ed execution, con artefatti persistenti come assessment, opzioni, piano e task, build/test validation e commit progressivi.

Fonte:

- [Microsoft Learn — GitHub Copilot modernization overview](https://learn.microsoft.com/en-us/dotnet/core/porting/github-copilot-app-modernization/overview)

La cosa interessante non è il prodotto specifico.

È il modello operativo:

> **prima assessment e decisioni, poi piano, poi task verificabili.**

È coerente con la tesi di questo libro.

## Non dare all'agente un obiettivo troppo largo

Prompt:

```text
modernizza questo repository
```

produce un grado enorme di libertà.

Meglio un contract come:

```text
Goal
Introduce PriorityPolicy seam without changing observable priority behavior.

Allowed scope
src/priority + composition only.

Must preserve
LB-01..LB-06 characterization behavior.

Forbidden
schema changes
contract changes
new external dependency
legacy deletion

Verification
build + characterization + new seam tests.

Stop condition
any unclassified behavior change.
```

Questa non è micro-management dell'AI.

È definizione del blast radius.

## Un commit per decisione utile

Quando un agente può produrre centinaia di modifiche, diventa ancora più importante strutturare la history.

Esempio:

```text
commit 1
introduce seam, no behavior change

commit 2
add legacy adapter

commit 3
add candidate implementation inactive

commit 4
add shadow comparison

commit 5
add rollout switch
```

Questo rende possibile:

- review incrementale;
- bisect;
- rollback selettivo;
- confronto fra intent e diff;
- attribuzione delle regressioni.

Un singolo commit “AI modernization” con 287 file cambiati distrugge gran parte di questa evidence.

## Generated refactoring illusion

Possiamo avere:

```text
build green
lint green
unit test green
```

ed essere ancora davanti a un refactoring sbagliato.

Per esempio l'agente potrebbe:

- duplicare una business rule in due moduli;
- cambiare exception semantics;
- eliminare un fallback apparentemente inutile;
- convertire una query mantenendo output ma peggiorando lock behavior;
- cambiare time-zone handling;
- produrre una nuova abstraction che nasconde coupling invece di ridurlo.

Chiamiamo questo rischio:

> **Generated Refactoring Illusion**

Il sistema sembra modernizzato perché il diff è ordinato e i gate superficiali sono verdi.

## AI review con ruoli diversi

Possiamo usare più passaggi agentici con obiettivi diversi.

### Transformation agent

Esegue il cambiamento entro scope.

### Regression adversary

Cerca behavior che potrebbero essere cambiati accidentalmente.

### Boundary reviewer

Cerca coupling, ownership leak e abstraction sbagliate.

### Test reviewer

Chiede quali fault nuovi test rilevano davvero.

### Migration reviewer

Cerca one-way door e rollback gap.

Il valore non deriva dal “numero di agenti”.

Deriva dalla separazione delle prospettive.

## Verifica senza rifare tutto

L'umano non deve rileggere ogni singola riga di una trasformazione meccanica grande come se fosse stata scritta a mano.

Può verificare attraverso:

- transformation specification;
- diff sampling mirato;
- compiler;
- test;
- invariant check;
- contract diff;
- mutation/adversarial test;
- metrics di rollout;
- comparison evidence.

Questa è la stessa idea vista all'inizio del libro:

> **verificare non significa necessariamente rieseguire manualmente il lavoro dell'agente.**

## Caso reale: GitHub automatizza cleanup delle feature flag

GitHub ha descritto uno script che individua l'uso di feature flag tramite ricerca e AST, modifica il codice e può creare branch e pull request per il cleanup.

Fonte:

- [GitHub Engineering — How we ship code faster and safer with feature flags](https://github.blog/engineering/infrastructure/ship-code-faster-safer-feature-flags/)

È un buon esempio di automated transformation applicata a un problema ripetitivo e sufficientemente strutturato.

Il punto non è che ogni cleanup debba usare lo stesso strumento.

Il punto è che **quando una trasformazione è ripetibile, possiamo trasformare conoscenza manuale in automazione verificabile**.

## Una regola per gli agenti di refactoring

Prima di dare write access a un agente chiediamo:

```text
Can we describe the transformation?
Can we describe what must not change?
Can we verify the result?
Can we bound the blast radius?
Can we stop before a one-way door?
```

Se la risposta a queste domande è no, probabilmente non siamo ancora nella fase di execution.

Siamo ancora nella fase di comprensione.
