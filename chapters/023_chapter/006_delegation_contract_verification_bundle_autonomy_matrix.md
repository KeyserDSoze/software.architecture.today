# I tre artefatti di governo degli agenti

A questo punto abbiamo tre domande diverse.

La prima:

> che cosa è autorizzato a fare l'executor?

La seconda:

> quale evidence deve esistere prima di accettare il risultato?

La terza:

> fino a quale passo può procedere senza chiedere un nuovo gate?

Se proviamo a rispondere a tutte con un unico prompt, otteniamo quasi sempre un documento confuso.

Per questo separiamo:

```text
Agent Delegation Contract
Agent Verification Bundle
AI Autonomy Matrix
```

## Agent Delegation Contract

Il Delegation Contract governa una specifica classe di execution.

Non è un prompt completo.

Non contiene tutta la documentazione del progetto.

Definisce il **mandato operativo**.

Template:

```text
Delegation ID
Work item / task class
Role
Goal
Allowed scope
Forbidden scope
Canonical context
Allowed tools/capabilities
Permission boundary
Required verification
Stop conditions
Escalation owner
Time/retry budget
Output contract
```

### Goal

Deve essere outcome-oriented.

Non:

```text
Use PostgreSQL and write tests.
```

Meglio:

```text
Produce higher-fidelity evidence for TST-005
without changing Payment Escalation semantics.
```

### Allowed scope

Deve dire dove l'agente può lavorare.

```text
tests/integration/**
test-only adapters
package scripts for integration layer
```

### Forbidden scope

È altrettanto importante.

```text
no Payments semantics
no new authoritative field
no migration rewrite for convenience
no production cloud resource
```

### Permission boundary

Descrive capability reali, non soltanto desideri.

```text
may read repo
may edit scoped branch/workspace
may start isolated local PostgreSQL
may run local checks
may not merge
may not access production credentials
```

### Stop conditions

Sono il bordo fra execution e nuova decisione.

Un buon Delegation Contract rende possibile un output valido:

```text
STOPPED
reason
collected evidence
decision required
```

## Agent Verification Bundle

Il Verification Bundle è il pacchetto che accompagna il risultato.

Template:

```text
Work Item
Delegation ID
Implementation revision
Claims
Evidence per claim
Raw evidence references
Checks executed
Independent review
Findings / contradictions
Known limitations
Not verified
Stop conditions encountered
Recommendation
```

Il bundle non dovrebbe contenere frasi vaghe come:

```text
Everything looks good.
```

Deve rendere possibile un audit leggero.

Esempio:

```text
C-03
Second-write failure rolls back both facts.

Mechanism
real PostgreSQL integration test

Result
PASS

Primary evidence
integration test output
post-failure SELECT on payment_escalation/outbox_message

Verifier
independent verifier role

Not verified
HA / Azure networking / performance
```

## AI Autonomy Matrix

La matrice non classifica genericamente il modello.

Classifica **capability in contesto**.

Esempio:

| Capability | Current level | Evidence required to increase | Human gate |
|---|---|---|---|
| repository read/search | A3 | stable access controls | no |
| edit scoped worktree | A2 | local gates + bounded scope | merge only |
| add test-only dependency | A2 | dependency review | if sensitive/high impact |
| create PR | A2/A3 | repo policy + evidence bundle | merge gate |
| modify architecture fitness rule | A0/A1 | explicit architecture decision | yes |
| change data ownership | A0 | domain/data decision | yes |
| production DB mutation | A0 | dedicated runbook, approval, recovery evidence | yes |

La matrice deve vivere insieme al threat model, non accanto come documento decorativo.

## Relazione fra i tre artefatti

Il flusso è:

```text
Work Item
   ↓
Agent Delegation Contract
   ↓
Execution
   ↓
Agent Verification Bundle
   ↓
Autonomy / approval gate from AI Autonomy Matrix
   ↓
next step
```

Il Delegation Contract dice cosa puoi fare.

Il Verification Bundle dice cosa hai dimostrato.

L'Autonomy Matrix dice se quella evidence è sufficiente per procedere automaticamente.

## Non duplicare la issue

Il Delegation Contract non deve ricopiare 200 righe della issue.

Meglio:

```text
Work item: OO-001

Additional delegation constraints:
- role: implementer
- autonomy: A2
- isolated PostgreSQL only
- max retry budget: 2 execution-repair loops
- cannot change verification oracle
```

La issue rimane source of task truth.

Il contract aggiunge il perimetro di delega.

## Non duplicare il test output

Anche il Verification Bundle deve evitare copia indiscriminata.

Deve puntare a evidence primaria.

```text
summary
+ references
+ limitations
```

Non:

```text
paste di 50.000 righe di log
```

Questa è la stessa disciplina di observability.

Più dati non significa più capacità di verifica.

## Review trigger dell'Autonomy Matrix

La matrice va riaperta quando cambia almeno uno fra:

- tool disponibile;
- permission scope;
- environment;
- tipo di dato accessibile;
- reversibility;
- observed failure rate;
- verification strength;
- business impact;
- model/agent workflow significativamente diverso.

Quindi:

> **Autonomy is versioned architecture.**

Non è una preferenza permanente del team.

## Chi può cambiare questi artefatti?

Questo è un punto delicato.

L'agente può proporre una modifica al proprio Delegation Contract.

Non dovrebbe automaticamente approvarla.

Può rilevare:

```text
OO-001 requires a new test dependency.
Current contract allows test-only dependencies.
Proceed.
```

Oppure:

```text
OO-001 appears to require rewriting migration 002.
Stop condition triggered.
```

Non dovrebbe fare:

```text
I changed the stop condition so that migration rewrite is now allowed.
```

Lo stesso vale per l'AI Autonomy Matrix.

> **Un executor non dovrebbe poter aumentare unilateralmente la propria autonomia per completare il task corrente.**

## Contratto e runtime enforcement

Un file Markdown non è un permission boundary.

Il contract deve essere riflesso, quando possibile, da:

- sandbox/worktree isolation;
- branch protections;
- repository rules;
- tool allowlist;
- credential scope;
- human approval hook;
- CI gates;
- network policy.

Microsoft e OpenAI documentano approval flow per tool call sensibili; GitHub documenta ambienti e permission limitate per cloud coding agent.

Fonti:

- [OpenAI Agents SDK — Human in the loop](https://openai.github.io/openai-agents-python/human_in_the_loop/)
- [Microsoft Learn — Human-in-the-loop](https://learn.microsoft.com/en-us/agent-framework/workflows/human-in-the-loop)
- [GitHub Docs — Application card: GitHub Copilot Agents](https://docs.github.com/en/copilot/responsible-use/agents)

Il principio è:

> **documentare una regola aiuta l'agente a capirla; applicarla nel runtime impedisce che una incomprensione diventi automaticamente una capability.**

## ESI: prima versione

Per Order Operations definiamo:

```text
Delegation Contract
→ OO-001 implementation class

Verification Bundle
→ required claims C-01…C-05

Autonomy Matrix
→ A2 for scoped test execution
→ human gate for merge/new decisions
```

Questa prima versione è volutamente conservativa.

La aumenteremo soltanto quando avremo evidence.

Non perché un nuovo modello promette più autonomia.

Ma perché il sistema saprà governarla meglio.

> **La maturità agentica non è quante decisioni togliamo agli esseri umani. È quante decisioni possiamo delegare senza perdere controllo sul perché e sul come vengono prese.**
