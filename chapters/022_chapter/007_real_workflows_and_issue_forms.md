# 22.7 — Workflow reali: quando la issue diventa parte del sistema di engineering

Issue-driven development non nasce con l'AI. I team usano backlog, ticket e work item da decenni.

Quello che cambia con i coding agent è la distanza fra **come definiamo il lavoro** e **chi lo esegue**.

Quando la issue può essere assegnata direttamente a un agente che pianifica, modifica il repository, esegue test e apre una pull request, la qualità del testo iniziale non resta più confinata al project management. Entra nel path tecnico che produce il diff.

Questo rende molto visibile una relazione che esisteva già:

```text
work definition quality
→ execution quality
→ verification cost
→ review quality
```

## GitHub: la issue come input diretto dell'executor

GitHub documenta esplicitamente workflow in cui un coding agent riceve una issue, lavora in background e restituisce una pull request da rivedere.[^github-agent]

Nella guidance ufficiale ricorrono elementi molto vicini al modello che abbiamo costruito: problema chiaro, acceptance criteria completi, scope ragionevole e riferimenti utili al repository.[^github-best-practice]

La parte interessante non è che GitHub “raccomandi buone issue”. È la conseguenza operativa: **la issue può diventare un vero input di execution**.

Se contiene un'ambiguità, non resta necessariamente ferma in backlog in attesa di una domanda. Un executor capace può interpretarla e produrre rapidamente un'implementazione coerente con quella interpretazione.

La qualità del task boundary diventa quindi una proprietà del workflow di sviluppo.

## WRAP: il backlog visto dal punto di vista dell'execution

GitHub ha raccontato anche la propria esperienza interna con il coding agent attraverso l'acronimo **WRAP**: *Write effective issues, Refine your instructions, Atomic tasks, Pair with the coding agent*.[^github-wrap]

Non lo adottiamo come framework universale e non ci interessa trasformare il capitolo in una collezione di acronimi.

Ci interessa la convergenza su due idee che abbiamo già motivato indipendentemente:

```text
issue quality
+
atomic task boundary
```

Se l'execution può essere delegata e parallelizzata, il backlog non contiene più soltanto priorità. Contiene **unità potenziali di execution context**.

Una issue non pronta non è soltanto “scritta male”. Può essere una unità di lavoro che non dovrebbe ancora entrare nel sistema di delegazione.

## OpenAI: task strutturati e context pointer

OpenAI, descrivendo l'uso interno di Codex, suggerisce task ben circoscritti e prompt strutturati in modo simile a issue o pull request, includendo quando utile path, componenti, diff e riferimenti alla documentazione.[^openai-codex]

Anche qui non interessa il formato come convenzione di vendor.

Il pattern è più generale:

```text
intent chiaro
+ context pointer concreti
+ boundary di cambiamento
→ meno inferenza prima dell'execution
```

Questo si collega direttamente al Capitolo 21. Se il repository possiede già `AGENTS.md`, Repository Map e documenti canonical, la issue non deve diventare un prompt enorme. Deve aggiungere il delta e indirizzare verso il contesto persistente.

## Issue Form: struttura utile soltanto quando riduce ambiguità

GitHub Issue Forms permette di trasformare alcuni campi in una struttura YAML con input obbligatori e guidati.[^github-forms]

Può essere molto utile quando una classe di lavoro ha sempre bisogno delle stesse domande: per esempio `Problem`, `Outcome`, `Acceptance`, `Relevant context` e `Risk/stop condition` per un execution task ad alto impatto.

Ma la struttura ha un costo.

Se obblighiamo ogni typo a compilare trenta campi, non otteniamo più informazione. Otteniamo `N/A`, testo copiato e una falsa sensazione di rigore.

> **Il form è utile quando comprime l'ambiguità più di quanto aumenti il ceremony.**

Questo suggerisce una regola semplice: non serve un unico template universale.

Un bug, una discovery, un execution task e una decision request hanno domande diverse. Un bug ha bisogno di current behavior, expected behavior e reproduction. Una discovery ha bisogno di uncertainty, evidence source ed exit criteria. Un execution task ha bisogno soprattutto di outcome, scope, acceptance, verification e stop condition.

La struttura deve seguire la classe di rischio, non la voglia di standardizzare tutto.

## L'AI può aiutare a preparare la issue senza diventare la source of truth

GitHub supporta anche l'uso di Copilot per generare o aggiornare issue e raccomanda di rivedere il draft prima della creazione.[^github-create-issue]

È una divisione del lavoro sensata.

Un agente può trasformare note sparse in una bozza, estrarre candidate acceptance criteria, cercare documenti correlati, proporre sub-issue o segnalare campi mancanti. Può perfino fare red-team del work item cercando decisioni che l'executor sarebbe costretto a inventare.

Non dovrebbe però promuovere automaticamente un desiderio ambiguo a requisito approvato.

Se da una conversazione emergono due interpretazioni possibili di una business rule, la generazione della issue non deve scegliere quella più plausibile e nascondere l'incertezza. Deve renderla visibile.

Questa è la stessa disciplina usata per la documentazione del repository:

> **l'AI può comprimere il lavoro di strutturazione; non deve riciclare un'inferenza come authority.**

## La issue come living record, non come testo congelato

Un'altra proprietà utile dei workflow reali è la provenance.

Supponiamo che OO-001 inizi con migration `001` e `002` considerate baseline. Durante execution il test dimostra che `002` contiene un problema semantico e la stop condition scatta.

Una issue viva può registrare:

```text
Stopped
→ evidence attached
→ decision requested
→ scope updated after decision
→ execution resumed
```

La cronologia rende ricostruibile il cambiamento del boundary.

Questo è molto più forte di una chat in cui la decisione viene presa informalmente e il diff finale non spiega perché il task abbia cambiato direzione.

La issue non deve restare immutabile. Deve restare **tracciabile**.

## Il tool non è il metodo

Usiamo GitHub perché è il repository reale del progetto e perché offre esempi contemporanei di agent workflow. Ma nessuna delle proprietà del capitolo dipende da GitHub Issues.

Lo stesso modello può vivere in Jira, Azure Boards, Linear o un sistema interno:

```text
intent
+ scope
+ canonical context
+ acceptance
+ verification
+ stop conditions
+ closure evidence
```

Quello che conta è che il work item riesca a fare da handoff fra decisione ed execution senza dipendere dalla memoria di una conversazione.

> **Quando la issue diventa un input eseguibile, scriverla bene non è più burocrazia attorno al codice. È parte del design del sistema che produce il codice.**

---

[^github-agent]: GitHub Blog, *Assigning and completing issues with coding agent in GitHub Copilot*, https://github.blog/ai-and-ml/github-copilot/assigning-and-completing-issues-with-coding-agent-in-github-copilot/
[^github-best-practice]: GitHub Docs, *Best practices for using GitHub Copilot to work on tasks*, https://docs.github.com/en/copilot/using-github-copilot/using-copilot-coding-agent-to-work-on-tasks/best-practices-for-using-copilot-to-work-on-tasks
[^github-wrap]: GitHub Blog, *WRAP up your backlog with GitHub Copilot coding agent*, https://github.blog/ai-and-ml/github-copilot/wrap-up-your-backlog-with-github-copilot-coding-agent/
[^openai-codex]: OpenAI, *How OpenAI uses Codex*, https://openai.com/business/guides-and-resources/how-openai-uses-codex/
[^github-forms]: GitHub Docs, *Configuring issue templates for your repository*, https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/configuring-issue-templates-for-your-repository
[^github-create-issue]: GitHub Docs, *Using GitHub Copilot to create or update issues*, https://docs.github.com/en/copilot/how-tos/copilot-on-github/copilot-for-github-tasks/use-copilot-to-create-or-update-issues
