# Task boundary e issue readiness

Un repository può essere perfettamente documentato e comunque ricevere task impossibili da delegare bene.

Esempio:

```text
Migliora il sistema di priority.
```

Che cosa significa?

- modificare la business rule?
- ottimizzare performance?
- rimuovere legacy?
- cambiare UX?
- aggiungere persistenza?
- fare rollout della candidate policy?

Un agente può scegliere una interpretazione plausibile e implementarla molto velocemente.

Questo non rende il task ben specificato.

Rende l'ambiguità più produttiva.

## Repository-ready e task-ready sono due proprietà diverse

Un repository AI-ready fornisce contesto stabile.

Un task AI-ready fornisce il delta.

Possiamo rappresentarlo così:

```text
Repository context
  what is normally true

Task context
  what must change now
```

Se il task ripete tutto il repository, il contesto persistente non sta funzionando.

Se il task contiene soltanto un titolo generico, manca il delta.

## Il task come contratto temporaneo

Una issue efficace dovrebbe contenere almeno:

```text
Problem
Desired outcome
Scope
Out of scope
Acceptance criteria
Relevant context
Verification
Stop conditions / open decisions
```

Non sempre servono otto sezioni formali.

Serve però che l'informazione esista.

GitHub raccomanda per il proprio coding agent task chiari e ben scoped, con descrizione del problema, acceptance criteria e indicazioni sui file rilevanti. OpenAI, descrivendo come usa Codex, suggerisce di strutturare i prompt come issue GitHub includendo percorsi, componenti, diff o riferimenti utili quando pertinenti.

Fonti:

- [GitHub Docs — Responsible use of Copilot agents](https://docs.github.com/en/copilot/responsible-use/agents)
- [OpenAI — How OpenAI uses Codex](https://openai.com/business/guides-and-resources/how-openai-uses-codex/)

Queste pratiche non sono interessanti perché appartengono a due vendor.

Sono interessanti perché convergono su un principio di software engineering già noto:

> **l'execution è più affidabile quando il lavoro ha un confine verificabile.**

## Scope non è una lista di file

Possiamo dare all'agente:

```text
Modify:
src/priority/confirmed-priority-policy.ts
```

ma questo non spiega il boundary funzionale.

Meglio:

```text
Goal:
Add a new confirmed priority rule for X.

Allowed semantic change:
X -> Urgent before default rule.

Preserve:
Closed
ManualHold
RepeatedPaymentFailure
ED-001

Likely files:
src/priority/*
tests/priority-policy.test.mjs
docs/priority-functional-analysis.md
```

I file sono hint.

Il vero scope è semantico.

## Out of scope

L'out of scope è particolarmente utile con agenti molto capaci.

Un engineer umano può intuire che non deve “sistemare anche” un'area laterale.

Un agente può vedere cinque opportunità e trasformare un task locale in repository-wide cleanup.

Esempio:

```text
Out of scope:
- no database schema change
- no public API change
- no legacy deletion
- no cloud topology change
- no package/framework migration
```

Questo riduce il blast radius senza impedire all'agente di scegliere la soluzione locale migliore.

## Acceptance criteria osservabili

Un acceptance criterion deve essere verificabile.

Debole:

```text
Priority should work better.
```

Migliore:

```text
Given an Open Payment case with 3 failed attempts,
priority remains Urgent.

Given Enterprise tier without another urgency condition,
priority remains Standard.
```

Ancora migliore quando esiste anche il layer di evidence:

```text
Verification:
npm run typecheck
node --test tests/priority-policy.test.mjs
node --test tests/architecture-fitness.test.mjs
```

## Unknown non nascosti

Una issue non deve fingere di sapere ciò che non sappiamo.

Esempio:

```text
Open decision:
We do not yet know whether the new priority must be persisted.
Do not add persistence in this task.
Stop if implementation requires it.
```

Questa è una delle forme più utili di context engineering.

L'agente non deve riempire il vuoto con una scelta tecnica.

## One-way door

Un task che attraversa una one-way door richiede un livello di authorization differente.

Esempi:

- distruzione di dati;
- cambio incompatibile di contract pubblico;
- cutover senza fallback;
- apertura Internet;
- cambio ownership del dato;
- rimozione definitiva del legacy prima del completion gate.

Una issue non dovrebbe poter autorizzare implicitamente una one-way door attraverso una frase vaga.

Serve un decision record o un gate esplicito.

## Issue-driven development

Nel prossimo capitolo entreremo molto più a fondo nell'**Issue-driven development**.

Qui ci interessa soltanto il rapporto con il repository.

Un buon repository permette alla issue di essere corta.

Per esempio:

```text
Relevant context:
See repository map -> Priority capability.
Follow existing AGENTS.md stop conditions.
```

Questo è meglio di copiare 200 righe di architettura dentro ogni ticket.

## Handoff fra agenti

Il task boundary aiuta anche quando il lavoro passa fra più agenti.

Un discovery agent può produrre:

```text
Relevant files
Observed behavior
Open questions
Risk
Recommended verification
```

Un implementation agent può lavorare sul delta.

Un reviewer agent può verificare acceptance criteria e architecture fitness.

Se il task non ha boundary, ogni agente ricostruisce una versione diversa del problema.

## Task amplification

Un failure mode nuovo è la **task amplification**.

```text
small issue
→ agent notices adjacent cleanup
→ expands diff
→ updates tests
→ updates docs
→ changes dependency
→ changes infra
→ original acceptance criteria become minor part of change
```

Il diff può essere ottimo tecnicamente.

Ma review e rollback diventano più difficili.

La regola deve essere:

> **Un agente può scoprire lavoro fuori scope. Non deve automaticamente assorbirlo nel task corrente.**

Può registrarlo come follow-up.

## Un task deve dichiarare il suo verification budget

Non tutte le modifiche meritano un environment cloud completo.

Una issue dovrebbe permettere di capire quali gate sono necessari.

```text
Verification budget:
local only
```

oppure:

```text
Verification budget:
local + PostgreSQL integration
```

oppure:

```text
requires staging / real Azure identity
```

Questo collega Testing Architecture, cost model e agent execution.

Il costo della verifica diventa parte del task.

## La regola

> **Il repository contiene ciò che resta vero fra i task. La issue contiene ciò che deve diventare vero in questo task.**

Quando questa separazione funziona, possiamo aumentare l'autonomia senza aumentare nella stessa misura l'ambiguità.