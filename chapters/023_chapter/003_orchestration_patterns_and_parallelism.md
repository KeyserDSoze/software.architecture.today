# Orchestrazione e parallelismo

Una volta separati i ruoli, possiamo scegliere come farli collaborare.

Il rischio è pensare all'orchestrazione come a un dettaglio di framework.

Non lo è.

La topologia del workflow decide:

- dove vive il contesto;
- chi può vedere cosa;
- quando il lavoro può partire;
- quali risultati diventano input per altri;
- dove si può introdurre un human gate;
- quanto costa correggere una interpretazione sbagliata.

## Sequential

Il pattern più semplice è:

```text
Planner
→ Implementer
→ Verifier
```

Ha un vantaggio evidente:

> ogni passo parte da un output già prodotto.

È adatto quando esiste una vera dipendenza semantica.

Per esempio:

```text
functional decision
→ API contract
→ implementation
→ verification
```

Parallelizzare questi passi prima di avere sincronizzato la decisione significa soltanto creare merge conflict cognitivi.

Microsoft Agent Framework documenta l'orchestrazione sequenziale come uno dei pattern base disponibili nei workflow multi-agent.

Fonte:

- [Microsoft Learn — Workflow orchestrations](https://learn.microsoft.com/en-us/agent-framework/workflows/orchestrations/)

Il pattern sequenziale è semplice ma può diventare lento quando alcune verifiche sono davvero indipendenti.

## Concurrent

Possiamo eseguire in parallelo:

```text
Implementation
├── Security review
├── Architecture review
└── Test review
```

solo quando i tre reviewer possono lavorare sullo stesso artifact stabile senza dipendere l'uno dall'altro.

Oppure possiamo parallelizzare execution differenti:

```text
work item A
work item B
work item C
```

ma soltanto dopo avere verificato che:

- non dipendano dalla stessa decisione ancora aperta;
- non modifichino lo stesso invariant;
- non competano per lo stesso migration boundary;
- non abbiano una ordering dependency nascosta.

La regola del libro diventa:

> **Prima sincronizzare il pensiero. Poi parallelizzare l'esecuzione.**

Non è una metafora.

È una dependency rule.

## Handoff

Un handoff trasferisce il controllo a uno specialista.

Esempio:

```text
Orchestrator
→ discovers security-sensitive infrastructure change
→ handoff to Security Reviewer
```

L'OpenAI Agents SDK espone gli handoff come primitive esplicite per trasferire lavoro fra agenti specializzati e consente di controllare quali informazioni passino al ricevente.

Fonte:

- [OpenAI Agents SDK — Handoffs](https://openai.github.io/openai-agents-python/handoffs/)

Qui appare un problema molto importante:

> **handoff correctness.**

Se il summary passato al secondo agente omette:

- una stop condition;
- una intentional difference;
- una constraint;
- una evidence limitation;

il nuovo agente può lavorare perfettamente sul problema sbagliato.

Quindi un handoff non dovrebbe passare soltanto una descrizione narrativa.

Dovrebbe preservare almeno:

```text
work item ID
current scope
current evidence
open decisions
stop conditions
artifacts changed
artifacts forbidden
```

## Manager pattern

Un manager/orchestrator può mantenere il controllo e invocare specialisti come tool.

Pattern:

```text
Manager
├── Planner
├── Code Specialist
├── Security Specialist
└── Verifier
```

Questo è utile quando vogliamo:

- un unico punto di stato;
- context routing centralizzato;
- specialisti che non devono vedere l'intera conversazione;
- una decisione coordinata sul prossimo passo.

L'OpenAI Agents SDK distingue esplicitamente il manager pattern, dove agenti specialisti vengono usati come tool, dagli handoff in cui il controllo passa a un altro agente.

Fonte:

- [OpenAI Agents SDK — Agents / multi-agent system design patterns](https://openai.github.io/openai-agents-python/agents/)

Ma il manager pattern ha un failure mode ovvio:

```text
manager owns all context
+ all tools
+ all approvals
+ all synthesis
→ orchestration monolith
```

Il manager può diventare il punto attraverso cui deve passare qualunque minima decisione.

Il risultato è un collo di bottiglia che elimina proprio il parallelismo che volevamo comprare.

## Group collaboration

Alcuni framework supportano group chat o forme di collaborazione fra più agenti.

Può essere utile per:

- brainstorming di alternative;
- adversarial architecture review;
- incident hypothesis generation;
- design critique.

È meno adatto quando serve una responsibility chain forte.

Se tre agenti discutono e producono una risposta condivisa, dobbiamo ancora sapere:

```text
chi ha prodotto quale claim?
quale evidence supporta il claim?
chi ha la final authority?
```

La collaborazione non deve dissolvere la provenance.

## Fan-out / fan-in

Pattern utile:

```text
             ┌→ Security Reviewer ─┐
Artifact ────┼→ Test Reviewer ─────┼→ Synthesis
             └→ Architecture Review┘
```

Funziona quando i reviewer sono indipendenti.

Il synthesis step deve però gestire conflitti.

Non basta:

```text
2 agent say PASS
1 agent says FAIL
→ majority wins
```

Un solo failure di tenant isolation può pesare più di dieci review positive sul naming.

Quindi il fan-in deve essere **risk-aware**, non democratico.

## Adversarial review

Possiamo assegnare esplicitamente a un agente il compito di provare che la soluzione è sbagliata.

Esempio:

```text
Implementer claim:
PostgreSQL atomicity verified.

Adversarial Verifier:
Find a scenario where the evidence does not prove atomicity.
```

Questo è spesso più utile di chiedere:

```text
Review this implementation.
```

Perché cambia il criterio di ricerca.

Ma anche qui l'adversarial reviewer non è un oracolo.

Serve evidence.

## Parallelismo e collision domain

Prima di eseguire agenti in parallelo chiediamo:

```text
shared files?
shared schema?
shared contract?
shared decision?
shared environment?
shared migration?
shared verification oracle?
```

Più risposte sono `yes`, meno il parallelismo è indipendente.

Possiamo chiamare questo insieme **collision domain del task**.

Due task possono essere in directory diverse e avere comunque un collision domain semantico comune.

Per esempio:

```text
Agent A changes API enum.
Agent B changes event enum.
```

File diversi.

Stesso significato di business.

Quindi non basta il file-level parallelism.

## Retry degli agenti

Gli agenti possono fallire o produrre output insufficienti.

Il pattern ingenuo è:

```text
retry
retry
retry
```

Abbiamo già visto lo stesso problema nei sistemi distribuiti.

Retry senza cambiare informazione può soltanto ripetere l'errore.

Per un agent workflow, dopo un failure dobbiamo chiedere:

```text
manca contesto?
è ambiguo il task?
manca permission?
il tool è fallito?
la decisione non esiste?
il modello non riesce a completare il task?
```

Le risposte richiedono recovery diversi.

La guida pratica OpenAI suggerisce esplicitamente threshold oltre i quali il workflow deve escalare a intervento umano invece di continuare indefinitamente.

Fonte:

- [OpenAI — A practical guide to building agents](https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf)

Quindi definiamo:

```text
retry budget
+
stop condition
+
escalation path
```

anche per gli agenti.

## Trace del workflow

Più agenti significano più difficoltà a ricostruire:

- quale agent ha preso una decisione;
- quale tool ha chiamato;
- quale handoff è avvenuto;
- quale guardrail è scattato;
- quale output è stato usato come evidence.

L'OpenAI Agents SDK include tracing di run, agent invocation, generation, function call, guardrail e handoff.

Fonte:

- [OpenAI Agents SDK — Tracing](https://openai.github.io/openai-agents-python/tracing/)

Il principio generale è:

> **un workflow multi-agent che non possiamo ricostruire non è realmente governabile.**

## ESI: orchestrazione di OO-001

Per OO-001 scegliamo deliberatamente:

```text
Human Owner
   ↓
Implementer
   ↓
Verifier
```

con specialist escalation condizionale.

Non usiamo parallelismo nella modifica perché il task ha un solo boundary principale: il transaction evidence PostgreSQL.

Possiamo invece eseguire in parallelo, dopo il diff:

```text
transaction evidence review
+
security/environment boundary review
```

se il test harness introduce una capability infrastrutturale significativa.

Questa scelta è meno spettacolare di un swarm.

Ed è probabilmente migliore.

> **La maturità non è aumentare il numero di agenti. È sapere quando la separazione compra più di quanto costa.**
