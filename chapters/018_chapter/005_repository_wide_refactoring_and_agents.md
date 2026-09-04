# 18.5 — Refactoring repository-wide e agenti

L'AI cambia radicalmente l'economia delle trasformazioni ampie.

Rename, framework upgrade, call-site migration, configuration update e cleanup che prima richiedevano settimane possono oggi essere eseguiti da agenti, codemod e transformation engine in tempi molto più brevi.

Questo vantaggio diventa utile soltanto quando distinguiamo **che tipo di trasformazione stiamo chiedendo**.

## Prima classificare la trasformazione

Una trasformazione è prevalentemente **meccanica** quando la regola è deterministica e il significato dovrebbe restare stabile.

Esempi:

```text
rename di API/import
signature migration con mapping noto
syntax/project-format conversion
framework recipe ripetibile
```

Qui possiamo spingere molto sull'automazione, perché sappiamo descrivere con precisione cosa deve cambiare e cosa no.

Una trasformazione è invece **semantica** quando richiede decisioni su business rule, ownership, authorization, failure behavior, contract o trade-off.

Richieste come:

```text
sposta questa logica nel dominio corretto
sostituisci il legacy workflow con una soluzione moderna
```

non possiedono una risposta meccanicamente vera.

> **Più una trasformazione modifica il significato, meno compilation e diff ordinato costituiscono evidence sufficiente.**

## Scegliere lo strumento dal problema

Gli automated refactoring esistevano molto prima degli LLM.

OpenRewrite, per esempio, usa recipe versionabili per framework migration, security fix e trasformazioni strutturali ripetibili.

Fonte:

- [OpenRewrite — Introduction](https://docs.openrewrite.org/)

Questo ci ricorda che non tutto deve diventare agentic.

Possiamo scegliere fra:

```text
language tooling
search/replace
AST codemod
recipe engine
compiler-assisted migration
agentic transformation
manual/domain refactor
```

in base a quanto la regola è deterministica e a quanto il significato è contestuale.

`Fit before fashion` vale anche per l'automazione.

## L'agente è più utile quando orchestra un ciclo verificabile

Un agente può fare molto più che riscrivere file.

Può orchestrare:

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

La documentazione Microsoft su GitHub Copilot modernization descrive proprio workflow basati su assessment, planning, execution e validation con artefatti persistenti e progressione verificabile.

Fonte:

- [Microsoft Learn — GitHub Copilot modernization overview](https://learn.microsoft.com/en-us/dotnet/core/porting/github-copilot-app-modernization/overview)

Il principio interessante è più generale del prodotto:

> **prima rendiamo esplicita la trasformazione; poi diamo all'agente un contratto di execution.**

## Un transformation contract riduce il blast radius

Un prompt come:

```text
modernizza questo repository
```

lascia troppe decisioni implicite.

Per la priority routing ESI vogliamo qualcosa di molto più preciso:

```text
Goal
Introduce PriorityPolicy seam without changing confirmed behavior.

Allowed scope
priority boundary, composition, tests, docs.

Must preserve
LB-01, LB-02, LB-03, LB-06 semantics.

Intentional difference
ED-001 only.

Forbidden
schema/API/data-ownership changes
legacy deletion
new external dependency

Verification
build + legacy characterization + target + adapter + shadow tests.

Stop
any unexplained semantic mismatch.
```

Questa non è micro-gestione dell'agente.

È definizione della sua authority.

## Un commit per decisione utile

Quando l'execution è molto economica, la history diventa ancora più importante.

Meglio una sequenza come:

```text
commit 1 — introduce seam
commit 2 — add legacy adapter
commit 3 — add candidate inactive
commit 4 — add shadow comparison
commit 5 — add routing control
```

che un unico commit `AI modernization` con centinaia di file.

Una history intenzionale compra:

- review incrementale;
- bisect;
- rollback selettivo;
- attribuzione delle regressioni;
- relazione leggibile fra intent ed evidence.

Il numero di commit non è il punto.

Il punto è che ogni commit rappresenti una decisione verificabile.

## Generated Refactoring Illusion

Un agente può produrre:

```text
build green
lint green
unit test green
```

ed essere ancora semanticamente sbagliato.

Può avere duplicato una regola, eliminato un fallback importante, modificato exception semantics, peggiorato locking, alterato timezone behavior o introdotto un'abstraction che nasconde coupling invece di ridurlo.

Chiamiamo questo rischio:

> **Generated Refactoring Illusion**

Il refactoring appare convincente perché l'output è ordinato e i gate superficiali sono verdi.

La difesa è tornare alle claim del Safety Plan: behavior, boundary, side effect, compatibility, rollback.

## Separare i ruoli di review

Più agenti non significano automaticamente più qualità.

Può essere utile però separare prospettive:

```text
Transformation agent
→ esegue entro scope

Regression adversary
→ cerca behavior cambiati accidentalmente

Boundary reviewer
→ cerca coupling e ownership leak

Test reviewer
→ verifica quali fault i test riescono davvero a rilevare

Migration reviewer
→ cerca one-way door e rollback gap
```

Il valore nasce dalla diversità delle domande, non dal numero dei modelli.

## Verificare non significa rileggere manualmente ogni riga

Una trasformazione meccanica molto ampia non deve necessariamente essere rieseguita mentalmente dall'umano.

Possiamo verificare tramite:

```text
transformation specification
compiler
contract diff
invariant checks
tests
mutation/adversarial cases
targeted diff sampling
shadow/comparison evidence
```

La review umana si concentra dove il significato può cambiare.

È la stessa tesi del Capitolo 0: **verificare il lavoro dell'agente non significa rifarlo**.

## Caso reale — cleanup automatico delle feature flag

GitHub ha descritto tooling che individua l'uso di feature flag tramite search/AST, modifica il codice e può creare branch e pull request per il cleanup.

Fonte:

- [GitHub Engineering — How we ship code faster and safer with feature flags](https://github.blog/engineering/infrastructure/ship-code-faster-safer-feature-flags/)

È un buon esempio di trasformazione strutturata: quando la conoscenza del cambiamento è ripetibile, possiamo codificarla in automazione verificabile invece di delegarla ogni volta a una riscrittura libera.

## Il Verification Bundle

Un agente di refactoring dovrebbe lasciare un risultato verificabile, non soltanto un diff.

Un bundle minimo può contenere:

```text
files changed
transformation intent
behavior preserved
intentional differences
forbidden changes checked
build/test results
characterization result
unexpected mismatch result
open risks
cleanup remaining
```

Questo permette al reviewer di controllare il cambiamento a livello di decisione.

## La soglia prima del write access

Prima di dare a un agente un mandato ampio chiediamo:

```text
Possiamo descrivere la trasformazione?
Possiamo descrivere ciò che non deve cambiare?
Possiamo verificare il risultato?
Possiamo limitare il blast radius?
Possiamo fermarci prima della one-way door?
```

Se la risposta è no, probabilmente non siamo ancora nella fase di execution.

Siamo ancora nella fase di comprensione.

> **L'agente è pronto a trasformare il repository quando noi siamo pronti a definire il contratto che rende quella trasformazione falsificabile.**