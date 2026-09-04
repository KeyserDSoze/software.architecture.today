# 19.6 — AI e architecture drift: il repository insegna ciò che rende visibile

L'AI aumenta la velocità con cui un repository può cambiare.

Questo rende più economico anche il drift.

Il problema non è semplicemente che un agente “non conosce l'architettura”.

È più concreto:

> **l'agente vede soprattutto il contesto che gli abbiamo reso disponibile e ottimizza soprattutto il risultato che gli abbiamo chiesto.**

Se il task dice:

```text
Add feature X.
```

ma il sistema non rende visibili decisioni come:

```text
no direct legacy import
no vendor SDK in core semantics
Payments owns economic behavior
application does not depend on integration
```

una soluzione può essere funzionalmente corretta e architetturalmente regressiva.

## Il drift può diventare training data del repository

C'è un failure mode ancora più sottile.

Il progetto possiede già tre eccezioni storiche.

Un agente esplora la codebase e le vede ripetute.

Può inferire che rappresentino il pattern normale.

Poi aggiunge una quarta implementazione coerente con ciò che ha osservato.

```text
exception
→ repeated pattern
→ perceived convention
→ new generated usage
→ stronger drift
```

A quel punto il repository inizia a insegnare agli agenti futuri il proprio drift.

Questo riprende il problema del legacy:

```text
code that exists
≠
intended architecture
```

La differenza deve essere espressa da qualcosa di più forte della frequenza del pattern nel source code.

## Un repository AI-ready deve contenere anche il proprio intent

Non significa creare un file gigantesco con tutte le regole.

Significa distribuire il contesto nelle forme che già usiamo:

```text
Functional Analysis
ADR
contracts
ownership maps
architecture docs
fitness functions
tests
CI gates
issue acceptance criteria
```

La documentazione spiega il perché.

Il verifier dà feedback sull'implementazione.

L'issue delimita il change corrente.

Questa combinazione riduce la probabilità che l'agente impari l'architettura soltanto dai precedenti accidentali del codice.

## La fitness function è anche context engineering

Per un agente un architecture test non è soltanto un gate finale.

È feedback durante l'execution.

```text
agent changes source
→ AF-002 fails
→ "src/application cannot import src/integration"
→ agent changes approach
```

La fitness function diventa contemporaneamente:

- documentazione eseguibile;
- constraint;
- verifier;
- feedback per la strategia dell'agente.

Questo è più scalabile di ricordare la regola in ogni prompt manuale.

## Agent Architecture Review

Un agente può anche essere usato come reviewer architetturale.

Può confrontare un diff con ADR e checklist, trovare nuove dependency, segnalare accessi cross-boundary, cercare vendor leakage, identificare data copy o feature flag prive di cleanup condition.

L'output utile però non è:

```text
Architecture looks good.
```

È qualcosa come:

```text
Changed architectural surface
Relevant decisions
Fitness functions affected
Potential drift
Evidence
Exception required?
Review trigger hit?
Unknowns
```

Il reviewer non sostituisce la decisione.

Riduce lo spazio di ricerca del reviewer umano.

## Non generare governance dalla forma corrente del repository

Il rischio opposto è chiedere:

```text
Create architecture tests for this codebase.
```

Un agente può generare decine di naming rule, dependency limit, threshold e convention.

Il risultato sembra sofisticato.

Può avere soltanto automatizzato la fotografia corrente, compresi accidenti e legacy.

> **Una regola generata senza una proprietà da proteggere è rigidità generata.**

Ogni fitness candidate dovrebbe quindi dichiarare:

```text
Which risk?
Which decision?
Which property?
Why automate?
What happens on failure?
When does this rule expire or change?
```

Il source code può suggerire la regola.

Non è sufficiente ad autorizzarla.

## L'agente non deve poter approvare il proprio bypass

Il permission model deve separare:

```text
change implementation
change architecture policy
approve architecture exception
```

Se lo stesso agente può violare una regola, modificarla, aggiungere la waiver e poi dichiarare la verifica conclusa, abbiamo costruito self-approval automatizzato.

Il principio è lo stesso degli agenti che vedremo più avanti:

> **capability, authority e verification non devono collassare nello stesso ruolo quando il blast radius è significativo.**

## Non tutto diventa una fitness automatica

Un test non può decidere se:

- un nuovo bounded context abbia senso;
- eventual consistency sia accettabile per il business;
- un vendor lock-in valga il beneficio;
- un premium cloud tier sia giustificato;
- un behavior legacy debba essere ritirato;
- un nuovo SLA richieda multi-region.

Queste sono decisioni di significato e trade-off.

Automatizziamo la protezione delle decisioni già comprese.

Manteniamo umano il judgment quando cambia il significato del sistema.

## Verification Bundle per change agentici ampi

Quando un agente produce un change significativo, ESI vuole poter vedere almeno:

```text
functional evidence
architecture fitness result
security/contract impact
changed architectural surface
ADR triggers hit
exceptions introduced
cost/topology impact when relevant
one-way doors requiring approval
```

Il punto non è aggiungere documenti a ogni PR.

È evitare che la velocità del diff superi la capacità del sistema di dire che cosa quel diff ha cambiato davvero.

## La trasformazione fondamentale

Prima potevamo usare l'architect come parser umano di una parte importante dei change.

Con execution agentica crescente, quel modello scala peggio.

Dobbiamo quindi trasformare una parte dell'architecture governance da:

```text
remember and inspect
```

in:

```text
encode intent
→ execute change
→ receive evidence
→ use judgment on the meaningful remainder
```

> **L'AI non elimina il bisogno di architettura. Aumenta il valore di un'architettura che sa rispondere automaticamente quando un change sta oltrepassando un boundary già deciso.**