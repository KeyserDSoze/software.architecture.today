# One-Man Project Operating Model

Il One-Man Project ha bisogno di un artefatto operativo perché il rischio principale è proprio lasciare troppe cose implicite nella testa del lead.

Introduciamo quindi:

> **One-Man Project Operating Model**

Non è un organigramma.

È il contratto con cui l'organizzazione decide **quanto lavoro una singola persona può governare, con quali agenti, quali gate e quali garanzie di continuità**.

## 1. Missione

```text
Product / capability
Business outcome
Scope
Criticality
Operating hours
Current phase
```

Esempio:

```text
Capability
Case Explanation Assistant

Outcome
reduce operator investigation effort
without granting AI decision authority
```

## 2. Accountable lead

```text
Accountable lead
Role
Decision scope
Explicit non-authorities
```

La parte `Explicit non-authorities` è importante.

Per esempio:

```text
may decide
implementation details
local reversible design
agent task decomposition
local test strategy

may not decide alone
payment semantics
security policy exception
public ingress
regulated retention
irreversible customer-data migration
```

> **Accountability non deve essere confusa con sovereign authority.**

## 3. Secondary maintainer

```text
Secondary maintainer
Expected familiarity
Continuity responsibilities
Last continuity exercise
```

Non deve approvare ogni commit.

Deve poter assumere temporaneamente il control plane.

## 4. Agent portfolio

Elencare gli agent role realmente utili.

```text
Role
Purpose
Allowed task class
Permission boundary
Verification expectation
```

Esempio:

| Role | Purpose | Max task class |
|---|---|---|
| Explorer | repository/research discovery | T2 read-only |
| Implementer | bounded code/test change | T2 within delegation |
| Verifier | independent evidence review | read/test |
| Documentation synchronizer | update routed docs | T1 |
| Security reviewer | adversarial review | review only |

Non serve riempire ogni riga con un agente distinto.

Le responsabilità possono essere svolte in momenti diversi dallo stesso tool quando la separation of duties non è richiesta.

## 5. WIP policy

Dichiarare il parallelismo massimo che il lead pensa di poter governare.

```text
Max concurrent execution tasks
Max cross-boundary task
Max unresolved semantic decision
```

Esempio ESI iniziale:

```text
execution tasks     <= 3
cross-boundary      <= 1
semantic decision   <= 1
```

Questi numeri non sono benchmark.

Sono una policy iniziale da rivalutare con evidence.

## 6. Decision rights

Mappa:

```text
Decision class
Lead authority
Specialist/domain gate
Human approval required?
```

Esempio:

| Decision | Lead | Gate |
|---|---:|---|
| local refactor | yes | no |
| model adapter candidate | yes within eval | review if data/security changes |
| new business rule | propose | Product/Operations |
| payment effect | no | Payments & Risk |
| public ingress | propose | Security + Platform |
| production destructive migration | no unilateral | owner + explicit approval |

## 7. Verification model

Il modello deve chiarire:

```text
what executor can verify itself
what needs independent verification
what needs real environment evidence
what needs human acceptance
```

Questo collega direttamente:

- Testing Strategy;
- Agent Verification Bundle;
- AI Autonomy Matrix;
- Production Readiness Review.

## 8. Specialist triggers

Lista breve e precisa.

```text
Trigger
Required function
Expected output
```

L'obiettivo è evitare due failure mode:

```text
no specialist ever
```

oppure:

```text
every specialist on every task
```

## 9. Continuity plan

```text
Canonical entry point
Golden commands
Current work location
Incident/runbook route
Secondary maintainer
Continuity exercise
Known tribal knowledge
```

Ogni voce `Known tribal knowledge` è debt.

## 10. Operating cadence

Il lead non deve trasformare il progetto in una giornata infinita di agent polling.

Una cadence possibile:

### Daily

```text
review current work
resolve blocked decision
review evidence bundles
limit new task launch
```

### Weekly

```text
review WIP
review open risk/debt
review agent cost/rework
synchronize Product/Operations context
```

### Milestone

```text
architecture trigger review
security/reliability review when relevant
continuity drill
operational readiness
```

La cadence deve adattarsi al progetto.

## 11. Metrics

Non usare soltanto activity.

### Outcome

```text
business outcome movement
verified work completed
lead time
```

### Quality

```text
rework
escaped defect
unexpected rollback
verification failure
```

### Control plane

```text
review backlog
stopped task count and reason
unresolved decision age
WIP
```

### Agent economics

```text
cost per verified outcome
repair/retry count
human review effort
```

### Continuity

```text
secondary maintainer can run golden commands
open tribal-knowledge item
continuity drill result
```

## 12. Exit criteria

Questa è forse la sezione più importante.

Il One-Man Project non deve essere permanente per principio.

Dobbiamo sapere quando **smette di avere fit**.

Trigger possibili:

```text
review backlog persistently grows
24/7 incident burden exceeds lead capacity
more business domains become co-authorities
repeated specialist gate becomes permanent workflow
public/external consumer surface grows materially
one-way-door frequency increases
secondary maintainer cannot keep up
lead becomes unavailable bottleneck
agent rework erodes leverage
production/support load crowds out product thinking
```

A quel punto la risposta può essere:

```text
add maintainer
split responsibility
create team
extract platform capability
reduce scope
```

Non è un fallimento del One-Man Project.

È il risultato corretto di un review trigger.

> **Un operating model maturo deve sapere non soltanto come iniziare, ma anche quando non è più il modello giusto.**

## Il quality floor

Qualunque sia il livello di leverage, il One-Man Project di ESI non può compromettere silenziosamente:

```text
functional understanding
security boundary
data ownership
external contract
required reliability
verification independence where required
recovery
continuity
accountability
```

Se il progetto riesce a essere “one-man” soltanto eliminando uno di questi elementi, il modello non ha fit.

> **Il One-Man Project non è un modo per fare con una persona il lavoro di dieci persone. È un modo per fare con una persona il lavoro che una persona può realmente governare quando l'execution non è più il limite principale.**
