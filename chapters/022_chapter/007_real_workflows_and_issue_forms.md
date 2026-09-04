# 22.7 — Workflow reali, Issue Form e agenti

Issue-driven development non nasce con l'AI.

Ma i coding agent rendono molto più visibile la qualità — o la debolezza — del work definition.

## GitHub: issue come input del coding agent

GitHub documenta esplicitamente un workflow in cui una issue può essere assegnata a un coding agent, che da quel contesto pianifica il lavoro, apre una pull request, modifica il codice, esegue test e torna per review.[^github-agent]

La best practice ufficiale insiste su tre elementi:

- problema o lavoro richiesto chiaro;
- acceptance criteria completi;
- indicazioni utili sui file da modificare.[^github-best-practice]

È interessante perché rende concreta una tesi del capitolo:

> **quando la issue diventa input diretto dell'executor, la qualità della issue entra nel sistema di engineering.**

Non è più soltanto qualità del project management.

## Il caso WRAP di GitHub

GitHub ha raccontato anche l'esperienza maturata internamente nell'uso del coding agent attraverso l'acronimo **WRAP**:

```text
Write effective issues
Refine your instructions
Atomic tasks
Pair with the coding agent
```

Il punto che ci interessa non è adottare l'acronimo come metodo universale.

È osservare che due elementi ritornano esattamente nel nostro modello:

```text
issue quality
+
atomic task size
```

Quando l'execution è delegabile, il backlog smette di essere soltanto priorità.

Diventa anche **execution context inventory**.[^github-wrap]

## OpenAI: prompt strutturato come issue

OpenAI descrive fra le proprie pratiche interne con Codex l'uso di task ben circoscritti e suggerisce di strutturare il prompt come una GitHub Issue, includendo quando utili file path, nomi dei componenti, diff e snippet di documentazione.[^openai-codex]

Anche qui il valore non è il formato GitHub in sé.

Il pattern è:

```text
work intent
+ concrete context pointers
+ bounded scope
→ better execution context
```

Questo è coerente con ciò che abbiamo costruito nei Capitoli 21 e 22.

## Issue Form: struttura senza trasformare tutto in burocrazia

GitHub Issue Forms permettono di rendere alcuni campi strutturati e obbligatori tramite form YAML.[^github-forms]

Possono essere utili per chiedere sempre, per esempio:

```text
Problem
Outcome
Risk class
Acceptance criteria
Relevant context
```

Ma un form può anche diventare un anti-pattern.

Se contiene trenta campi obbligatori per ogni typo, gli utenti iniziano a scrivere:

```text
N/A
N/A
N/A
```

A quel punto abbiamo ottenuto struttura senza informazione.

> **La struttura deve comprimere l'ambiguità, non moltiplicare il ceremony.**

## Template diversi per classi di lavoro

Una strategia più utile è distinguere almeno:

```text
Bug
Execution task
Discovery task
Architecture decision request
Security finding
```

Non perché ogni categoria richieda un workflow completamente differente.

Ma perché alcune domande cambiano.

Un bug richiede:

- current behavior;
- expected behavior;
- reproduction/evidence.

Una discovery richiede:

- uncertainty;
- evidence sources;
- exit criteria.

Una execution issue richiede:

- outcome;
- scope;
- acceptance;
- verification;
- stop conditions.

## Generazione AI della issue

GitHub oggi permette anche di usare Copilot per generare o aggiornare issue, sfruttando template e form esistenti, ma raccomanda di rivedere e rifinire il draft prima della creazione.[^github-create-issue]

È una buona divisione del lavoro.

L'AI può aiutare a:

- estrarre acceptance criteria da una conversazione;
- trasformare note sparse in campi strutturati;
- proporre sub-issue;
- trovare documenti correlati;
- individuare campi mancanti.

Ma non dovrebbe promuovere automaticamente un desiderio ambiguo a requisito approvato.

## Issue come living record

Una issue utile conserva anche il percorso decisionale del task.

Se durante execution scopriamo:

```text
PostgreSQL integration test requires changing migration 002
```

possiamo registrare:

```text
Stopped: migration semantic change required.
Decision requested.
```

Quando arriva una decisione:

```text
Scope updated on <date>
ADR linked
Execution resumed
```

Questo crea provenance.

La chat può scomparire.

La issue resta collegata al cambiamento.

## Non confondere il tool con il metodo

Il libro userà GitHub perché è il repository reale del progetto e perché offre esempi contemporanei di agent workflow.

Ma il metodo resta portabile:

```text
work item
+ context links
+ acceptance
+ verification
+ scope boundary
+ evidence
```

può essere implementato in molti sistemi.

> **Issue-driven development non significa usare GitHub Issues. Significa rendere il lavoro abbastanza esplicito da poter essere eseguito, verificato e ricostruito senza dipendere dalla memoria di una conversazione.**

---

[^github-agent]: GitHub Blog, *Assigning and completing issues with coding agent in GitHub Copilot*, https://github.blog/ai-and-ml/github-copilot/assigning-and-completing-issues-with-coding-agent-in-github-copilot/
[^github-best-practice]: GitHub Docs, *Best practices for using GitHub Copilot to work on tasks*, https://docs.github.com/en/copilot/using-github-copilot/using-copilot-coding-agent-to-work-on-tasks/best-practices-for-using-copilot-to-work-on-tasks
[^github-wrap]: GitHub Blog, *WRAP up your backlog with GitHub Copilot coding agent*, https://github.blog/ai-and-ml/github-copilot/wrap-up-your-backlog-with-github-copilot-coding-agent/
[^openai-codex]: OpenAI, *How OpenAI uses Codex*, https://openai.com/business/guides-and-resources/how-openai-uses-codex/
[^github-forms]: GitHub Docs, *Configuring issue templates for your repository*, https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/configuring-issue-templates-for-your-repository
[^github-create-issue]: GitHub Docs, *Using GitHub Copilot to create or update issues*, https://docs.github.com/en/copilot/how-tos/copilot-on-github/copilot-for-github-tasks/use-copilot-to-create-or-update-issues
