# Evidenze reali e failure mode del leverage individuale

Il One-Man Project è una tesi prospettica.

Non esiste oggi una fonte seria che dimostri universalmente:

> “una persona con agenti equivale a un intero team software”.

Non useremo quindi casi marketing per far sembrare già risolta una questione che è ancora in evoluzione.

Possiamo però raccogliere evidenze su pezzi differenti del modello:

1. l'AI può aumentare l'execution individuale;
2. può ampliare la varietà dei task affrontabili;
3. il valore dipende da context, environment e task quality;
4. productivity non è riducibile al volume;
5. collaboration, ownership e continuity restano proprietà organizzative.

## Caso 1 — Field experiment Microsoft, Accenture e Fortune 100

Nel 2025 Microsoft Research ha pubblicato l'analisi aggregata di tre randomized field experiment condotti su 4.867 software developer.

Il risultato aggregato riportato è un incremento medio del **26,08% dei task completati** per i developer con accesso all'AI coding assistant, con differenze di adozione e impatto fra gruppi di esperienza.

Fonte:

- [Microsoft Research — The Effects of Generative AI on High-Skilled Work](https://www.microsoft.com/en-us/research/publication/the-effects-of-generative-ai-on-high-skilled-work-evidence-from-three-field-experiments-with-software-developers/)

### Cosa supporta

L'evidence rende credibile che il throughput individuale possa aumentare in real-world software work.

### Cosa non supporta

Non dimostra:

```text
26% more tasks
→ 26% more business value
→ fewer people always needed
→ one person can own every decision
```

Il salto sarebbe metodologicamente scorretto.

## Caso 2 — OpenAI usa Codex come task multiplier

OpenAI descrive team che usano Codex per:

- comprendere codebase non familiari;
- refactoring e migration multi-file;
- test;
- incident investigation;
- esplorazione di alternative;
- task asincroni lanciati mentre l'engineer rimane sul lavoro principale.

Una pratica descritta è proprio usare la task queue per delegare fix laterali e tornarci in seguito per review.

Fonte:

- [OpenAI — How OpenAI uses Codex](https://openai.com/business/guides-and-resources/how-openai-uses-codex/)

Questo è un esempio diretto di **execution multiplication**.

Ma la stessa guida raccomanda:

```text
well-scoped tasks
structured context
development environment setup
iteration
review
```

Quindi l'esperienza reale non suggerisce:

```text
more autonomy by default
```

Suggerisce:

```text
better execution system
→ more useful delegation
```

## Caso 3 — Trust non cresce automaticamente con l'uso

Un'altra ricerca Microsoft pubblicata nel 2025 ha studiato l'uso reale di strumenti generativi di coding attraverso survey, randomized trial e diary study.

Gli autori riportano che l'uso sostenuto ha aumentato la percezione di utilità e piacevolezza dello strumento, mentre la percezione di **trustworthiness del codice generato è rimasta sostanzialmente invariata**; la ricerca raccomanda di bilanciare productivity gain con scrutiny e critical evaluation.

Fonte:

- [Microsoft Research — Dear Diary: A Randomized Controlled Trial of Generative AI Coding Tools in the Workplace](https://www.microsoft.com/en-us/research/publication/dear-diary-a-randomized-controlled-trial-of-generative-ai-coding-tools-in-the-workplace/)

È un risultato particolarmente utile per il One-Man Project.

Più familiarità con l'agente non deve trasformarsi automaticamente in meno verifica.

> **Friction che diminuisce non è evidence che il rischio sia diminuito nella stessa misura.**

## Caso 4 — Productivity è multidimensionale

Il framework SPACE nasce proprio dalla critica alle misure di developer productivity basate su una singola dimensione.

Considera:

```text
Satisfaction and well-being
Performance
Activity
Communication and collaboration
Efficiency and flow
```

Fonte:

- [Microsoft Research / ACM Queue — The SPACE of Developer Productivity](https://www.microsoft.com/en-us/research/publication/the-space-of-developer-productivity-theres-more-to-it-than-you-think/)

Per il One-Man Project la lezione è semplice:

```text
more commits
more PR
more agent tasks
```

non sono una definizione sufficiente di successo.

## Caso 5 — GitHub SERVICEOWNERS

GitHub ha descritto come `SERVICEOWNERS` renda esplicito il mapping fra componenti/servizi e maintainer, alimentando un service catalog e aiutando anche la risposta agli incidenti.

Fonte:

- [GitHub Engineering — SERVICEOWNERS](https://github.blog/engineering/architecture-optimization/how-we-organize-and-get-things-done-with-serviceowners/)

Questo non è un caso di One-Man Project.

È utile proprio per il motivo opposto: mostra che quando i sistemi crescono, rendere ownership e maintainer **espliciti, versionati e rintracciabili** è una proprietà importante indipendentemente da quante persone producano il codice.

Se il nostro One-Man Project non riesce a produrre una continuity story equivalente, stiamo guadagnando execution perdendo organizzazione.

---

# Failure mode

## 1. Hero-loop amplification

```text
lead understands everything
→ agents ask lead everything
→ lead resolves everything
→ repository learns little
→ next task again depends on lead
```

L'AI aumenta la velocità con cui il sistema diventa dipendente dall'hero developer.

### Mitigazione

- canonical knowledge;
- task/decision routing;
- update docs after decision;
- secondary maintainer;
- continuity drill.

## 2. Review collapse

```text
agent output grows
→ review queue grows
→ lead skims
→ green checks replace understanding
```

Il control plane non scala alla stessa velocità del data plane.

### Mitigazione

- WIP limit;
- risk-based independent verification;
- smaller semantic tasks;
- deterministic evidence;
- stop launching work when review backlog grows.

## 3. Synthetic seniority

Il lead usa AI output specialistico e smette di distinguere fra:

```text
I can generate it
```

e:

```text
I understand the consequences enough to own it
```

### Mitigazione

- specialist trigger;
- explicit non-authorities;
- “explain the failure mode” review;
- training/study, non soltanto delegation.

## 4. Attention fragmentation

Troppi agenti producono:

```text
constant notification
partial result
follow-up
repair loop
context switch
```

La persona diventa orchestratore di microinterruzioni e perde deep work.

### Mitigazione

- batch review;
- WIP;
- async queue;
- priority class;
- protected thinking time.

## 5. One-person production pager

Il progetto viene sviluppato da una persona e si assume implicitamente che quella persona debba essere sempre disponibile anche per operarlo.

Questo non scala.

### Mitigazione

- enterprise on-call/platform support;
- runbook;
- SLO;
- alert ownership;
- secondary maintainer;
- operating-hours decision.

## 6. Invisible organization

La narrativa dice:

> “una persona ha costruito tutto”.

Ma ignora:

- cloud platform;
- authentication;
- security tooling;
- open-source dependencies;
- managed database;
- CI/CD;
- product/domain expert;
- legal/compliance;
- operations.

Questo produce decisioni organizzative sbagliate perché attribuisce all'individuo leverage che in realtà proviene dall'ecosistema.

### Mitigazione

Nel Cost Model e nell'Operating Model rendere esplicite le capability condivise utilizzate.

## 7. Agent-cost inversion

Lanciare molti agenti sembra economico perché ogni singolo task costa poco.

Poi arrivano:

```text
retry
repair
review
rework
conflict
unused output
```

Il costo per token resta basso mentre il costo per **verified outcome** cresce.

### Mitigazione

- unit economics agentiche;
- cost per accepted/verified task;
- retry budget;
- WIP limit.

## 8. The project cannot survive success

Il One-Man Project funziona molto bene.

Il prodotto cresce.

Arrivano più utenti, contratti, incidenti e stakeholder.

Il lead continua a difendere la struttura originale perché “finora ha funzionato”.

### Mitigazione

Exit trigger espliciti.

> **Il successo che invalida il nostro operating model è comunque successo. Cambiare modello in quel momento è evoluzione, non sconfitta.**

## La lezione delle fonti

Le evidenze reali disponibili ci consentono di sostenere con buona confidenza che l'AI può aumentare capacità e velocità su molte attività software.

Non ci consentono ancora di sostenere che la scala organizzativa corretta del software futuro sia “una persona per prodotto”.

Quindi il libro prende una posizione più prudente e, secondo noi, più utile:

> **Tratta l'aumento di leverage individuale come una nuova capability da governare, non come una prova che collaborazione, specializzazione e continuità siano diventate obsolete.**
