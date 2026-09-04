# Capitolo 25 — One-Man Project

## Il progetto di una persona non è il progetto che dipende da una persona

Immaginiamo un engineer di ESI davanti a Order Operations.

Ha un repository AI-ready.

Ha work item abbastanza precisi da essere delegabili.

Ha agenti che possono esplorare, implementare, testare e fare review entro boundary espliciti.

Ha fitness function, test, documentazione, ADR, threat model, cost model e un sistema di evidence che gli evita di rieseguire manualmente ogni dettaglio.

A questo punto nasce una domanda quasi inevitabile:

> **quanto software può governare una singola persona quando non deve più produrre personalmente ogni artefatto?**

È la domanda del **One-Man Project**.

Il nome è volutamente provocatorio. Nel libro descrive un **one-person operating model**: una singola persona che può assumere la responsabilità operativa di governare una quantità di execution molto maggiore grazie ad agenti, automazione e piattaforme. Non descrive genere, eroismo individuale né un'organizzazione in cui tutti gli altri diventano inutili.

Soprattutto non significa:

```text
one human
=
one source of truth
=
one reviewer
=
one domain expert
=
one production operator
=
one person who can ever understand the system
```

Quello sarebbe un **single point of failure umano**, non leverage.

## Il cambio di scala

Per gran parte della storia del software, la capacità di una persona era fortemente vincolata dalla quantità di execution che riusciva a produrre direttamente:

- scrivere codice;
- costruire test;
- cercare dipendenze;
- aggiornare documentazione;
- preparare migration;
- investigare incidenti;
- eseguire refactoring;
- fare review;
- mantenere pipeline e infrastruttura.

Con coding agent e sistemi AI una parte crescente di questo lavoro può essere delegata.

OpenAI descrive l'uso interno di Codex per code understanding, refactoring, migration, test, investigazione e task asincroni che un engineer può delegare e poi rivedere. La stessa guida insiste però su task ben circoscritti, ambiente riproducibile e review dell'output, non su autonomia illimitata.

Fonte:

- [OpenAI — How OpenAI uses Codex](https://openai.com/business/guides-and-resources/how-openai-uses-codex/)

Una ricerca Microsoft pubblicata nel 2025 ha aggregato tre randomized field experiment su 4.867 developer di Microsoft, Accenture e una Fortune 100, riportando un aumento medio del **26,08% dei task completati** per i developer con accesso all'AI coding assistant. È evidence utile che il leverage individuale può crescere; non dimostra che un engineer possa sostituire un'organizzazione intera.

Fonte:

- [Microsoft Research — The Effects of Generative AI on High-Skilled Work](https://www.microsoft.com/en-us/research/publication/the-effects-of-generative-ai-on-high-skilled-work-evidence-from-three-field-experiments-with-software-developers/)

La distinzione è fondamentale.

> **Più capacità individuale non implica automaticamente più capacità organizzativa.**

Se l'engineer produce tre volte più cambiamenti ma diventa il collo di bottiglia di tutte le decisioni, delle review e della conoscenza, abbiamo soltanto spostato il limite.

## Il nuovo collo di bottiglia

Quando l'execution diventa più abbondante, le risorse scarse diventano altre:

```text
attention
judgment
decision throughput
verification bandwidth
domain understanding
risk acceptance
organizational trust
```

Un agente può produrre cinque pull request in parallelo.

Una persona può comunque non essere in grado di comprenderne seriamente cinque in parallelo.

Un agente può trovare dieci alternative architetturali.

Una persona deve ancora decidere quali trade-off valgono per il business.

Un agente può scrivere una migration.

Qualcuno deve ancora accettare il rischio del point of no return.

Per questo il One-Man Project non è principalmente una tecnica di code generation.

È un problema di **control plane umano**.

## Non un hero developer

C'è una versione tossica di questa idea:

```text
la persona più forte
→ conosce tutto
→ approva tutto
→ aggiusta tutto
→ viene chiamata per ogni incidente
→ nessuno osa cambiare il sistema senza di lei
```

Questa non è eccellenza.

È concentrazione di conoscenza e autorità.

Il One-Man Project che ci interessa deve ottenere l'effetto opposto:

```text
one accountable lead
+
knowledge externalized
+
executable verification
+
domain decision gates
+
explicit ownership
+
reproducible environment
+
continuity when the lead is absent
```

La domanda quindi non è:

> “Posso costruirlo da solo?”

È:

> **“Posso governare questo progetto con una singola persona nel control plane senza rendere il progetto dipendente dalla presenza continua di quella persona?”**

## Il compromesso ESI

ESI vuole usare il Case Explanation Assistant del Capitolo 24 come primo pilot del modello.

Commerce & Operations vorrebbe un lead tecnico capace di portare avanti discovery, implementation, eval, security review e operational preparation usando agenti specializzati.

Finance vede un possibile aumento del leverage.

Platform vede meno handoff operativi.

Ma Product, Security e Payments & Risk pongono una condizione:

> **la riduzione del numero di executor umani non può trasformarsi nella riduzione del numero di prospettive necessarie a prendere decisioni corrette.**

La scelta corrente sarà quindi:

```text
one accountable project lead
+
multiple bounded agents
+
Product/domain decision gates
+
Security/platform gates when triggered
+
independent verification
+
knowledge in repository, not in memory
+
continuity test
```

Costo accettato:

- alcuni checkpoint restano umani;
- non tutto viene parallelizzato;
- documentazione ed evidence devono essere mantenute;
- un secondo maintainer deve poter riprendere il progetto.

Quality floor:

- nessuna decisione economica, security-critical o irreversibile viene resa unilaterale solo perché un singolo engineer possiede molta execution capacity;
- il progetto deve restare comprensibile e recuperabile in assenza del lead;
- verificare continua a essere separato dal produrre.

## Dove vogliamo arrivare

A fine capitolo Order Operations avrà un nuovo artefatto:

> **One-Man Project Operating Model**

che renderà espliciti:

- accountable lead;
- agent portfolio;
- work-in-progress limit;
- decision rights;
- mandatory human/domain gates;
- verification model;
- continuity/absence plan;
- knowledge externalization;
- escalation path;
- success metric.

E soprattutto ci obbligherà a fare una distinzione che vale ben oltre l'AI:

> **Essere in grado di fare quasi tutto non significa essere autorizzati a decidere tutto.**
