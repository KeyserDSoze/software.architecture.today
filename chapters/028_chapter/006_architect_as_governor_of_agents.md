# 28.6 — L'architect come governor di agenti

Nei capitoli 21–25 abbiamo costruito un operating model per repository, issue e agenti.

Qui facciamo un passo ulteriore.

Se una parte crescente dell'execution viene prodotta da agenti, l'architect non deve diventare il “prompt writer senior”.

Deve progettare il **sistema dentro cui gli agenti possono essere utili senza diventare un nuovo source of uncontrolled change**.

Questo include:

```text
context
scope
permission
verification
stop condition
handoff
retry budget
human gate
```

> **Il lavoro dell'architect non è ottenere la risposta migliore dall'agente. È costruire un ambiente in cui una risposta sbagliata abbia blast radius limitato e venga scoperta abbastanza presto.**

---

## Context engineering come architecture

Un agente che entra in un repository deve capire:

```text
che prodotto è?
quali decisioni sono già state prese?
quali file sono canonical?
quali boundary non deve violare?
come verifica?
quando deve fermarsi?
```

Questa non è soltanto prompt engineering.

È design del repository.

Nel nostro capstone abbiamo trasformato questa idea in:

```text
AGENTS.md
Repository Map
Functional Analysis
ADR
fitness function
work item
Testing Strategy
```

Il contesto persistente riduce il bisogno di ripetere ogni volta l'intero sistema nel prompt.

Ma il contesto deve restare:

```text
piccolo abbastanza da essere utile
canonical abbastanza da essere affidabile
discoverable abbastanza da essere aggiornabile
```

Se la documentazione è stale, l'AI amplifica anche quella.

---

## Scope prima di execution

Un executor molto capace tende a trovare lavoro adiacente.

Può scoprire:

- refactoring;
- test mancanti;
- dipendenze obsolete;
- inconsistenze;
- TODO;
- architecture smell.

È utile.

Ma non tutto ciò che viene scoperto appartiene al task corrente.

L'architect deve rendere esplicito:

```text
in scope
out of scope
follow-up
stop condition
```

Altrimenti una modifica locale può diventare un repository-wide cleanup che nessuno aveva autorizzato.

> **Discovery può essere autonoma. Assorbire nuovo scope non dovrebbe esserlo per default.**

---

## Permission architecture

L'AI rende più importante una distinzione che nel software tradizionale era già vera:

```text
capability
≠
permission
```

Un agente può tecnicamente:

```text
eseguire shell
scrivere file
chiamare API
creare risorse cloud
modificare DB
```

Ma non significa che debba poterlo fare in qualunque workflow.

L'architect deve collaborare con Security/Platform per definire:

```text
workspace isolation
network access
secret boundary
production access
approval gate
credential lifetime
artifact provenance
```

OpenAI ha descritto nel 2026 il proprio approccio all'uso sicuro di coding agent con managed configuration, constrained execution, network policy, human approval per azioni più rischiose e telemetry agent-native.

Fonte:

- OpenAI — *Running Codex safely at OpenAI*: https://openai.com/index/running-codex-safely/

La lezione non è copiare una specifica configurazione.

È riconoscere che **agent autonomy è anche architecture di permission e observability**.

---

## Il verifier non può essere soltanto un secondo storyteller

Una delle illusioni più facili è:

```text
Agent A implementa
Agent B review
→ independent verification
```

Non necessariamente.

Se entrambi:

- ricevono lo stesso contesto errato;
- usano lo stesso modello;
- leggono lo stesso test debole;
- condividono lo stesso criterio;

possono confermare la stessa misconception.

L'architect deve progettare verification attraverso **evidence diversity**.

Per esempio:

```text
executor summary
+
deterministic tests
+
real PostgreSQL integration
+
architecture fitness
+
security negative test
+
independent reviewer
```

Il reviewer umano non deve rieseguire tutto.

Deve poter verificare claim ed evidence.

Questo è il principio di **verification without re-execution**.

---

## Guardrail eseguibili

Una buona architecture policy può essere spiegata in documentazione.

Una migliore, quando possibile, può anche fallire automaticamente.

Esempi dal capstone:

```text
application !→ integration
core semantics !→ Azure SDK
legacy implementation not imported directly
cost metadata required
repository context present
PRR remains NO-GO while blockers open
```

Questo cambia il rapporto fra architect e agent.

Invece di ripetere:

> “Ricordati di non dipendere dall'infrastruttura.”

possiamo far produrre al sistema:

```text
AF-002 FAILED
application layer imports integration
```

> **Le fitness function sono architecture guidance che sa rispondere.**

---

## L'architect non deve diventare l'orchestrator di tutto

Un rischio del manager-of-agents è creare una persona che:

```text
scrive tutti i task
assegna tutti gli agenti
reviewa tutto
accetta tutto
```

È un nuovo collo di bottiglia.

L'obiettivo dovrebbe essere costruire un operating model in cui:

```text
repository context
+ issue readiness
+ local ownership
+ automated evidence
```

permettono a molti task di procedere senza intervento continuo dell'architect.

L'architect interviene dove cambia:

```text
architecture policy
business meaning
risk acceptance
one-way door
cross-team boundary
```

Questo è molto diverso dal supervisionare ogni diff.

---

## AI amplifica l'organizzazione esistente

DORA, nel report 2025, descrive l'AI come amplificatore delle strength e weakness del sistema organizzativo.

Fonte:

- DORA — *State of AI-assisted Software Development 2025*: https://dora.dev/research/2025/dora-report/

Per l'architect questo significa che:

```text
bad repo structure
→ faster confusion

weak ownership
→ faster semantic drift

slow review system
→ bigger verification backlog

good tests + clear boundaries
→ more safe execution
```

Il problema non è quindi:

> “Quale agente scegliamo?”

ma:

> **“Quale sistema di engineering stiamo amplificando?”**

---

## OpenAI: agenti per capire, refactorizzare e investigare

OpenAI descrive Codex usato internamente per code understanding, refactoring, feature development e incident investigation, e insiste su task strutturati, contesto e iteration.

Fonte:

- OpenAI — *How OpenAI uses Codex*: https://openai.com/business/guides-and-resources/how-openai-uses-codex/

È una conferma interessante del fatto che gli agenti non sono confinati alla pura generazione di codice.

Possono amplificare parti diverse del ciclo di engineering.

Ma proprio per questo l'architect deve ragionare su boundary più ampi di un IDE plugin.

---

## ESI: Architect as Agent-System Designer

La capability map ESI include una area specifica:

```text
Agentic Engineering Governance
```

Un architect deve saper:

```text
definire context persistente
riconoscere task delegabile
separare scope da discovery
progettare permission boundary
scegliere evidence adeguata
separare executor e authority
costruire stop condition
usare automated fitness
monitorare cost per verified outcome
```

Non gli chiediamo di conoscere ogni agent framework.

Gli chiediamo di riconoscere la struttura del problema anche quando cambiano tool e vendor.

La regola è:

> **Il futuro dell'architect non è scrivere prompt migliori. È progettare sistemi in cui persone e agenti possono prendere velocità senza perdere responsabilità.**
