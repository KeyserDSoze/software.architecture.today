# ESI: Order Operations e il primo operating model agentico

ESI non introduce un agent swarm generico.

Parte da un task reale.

```text
OO-001
Verify PostgreSQL atomicity
for Payment Escalation + Outbox
```

Il task è interessante perché è abbastanza tecnico da essere delegabile, ma abbastanza importante da richiedere evidence vera.

Non modifica business semantics.

Non cambia ownership.

Non richiede produzione.

Quindi è un buon candidato per autonomia bounded.

## Esigenza

Commerce & Operations vuole aumentare il throughput dell'engineering team.

L'obiettivo non è:

```text
make agents write more code
```

È:

```text
reduce human time spent on bounded execution
while preserving decision and verification quality
```

OO-001 contiene già:

- problem;
- outcome;
- scope;
- out of scope;
- canonical context;
- acceptance criteria;
- verification;
- stop conditions.

Quindi possiamo delegare senza chiedere all'agente di inventare il task.

## Tensione

Gli stakeholder vedono il problema in modo diverso.

### Engineering

Vuole che l'agente possa:

- costruire l'integration harness;
- scegliere un test environment riproducibile;
- eseguire migration e test;
- correggere problemi locali;
- produrre un diff pronto per review.

### Platform

Non vuole introdurre una nuova mini-piattaforma solo per un test.

### Security

Non vuole:

- production credentials;
- shared privileged database;
- uncontrolled network access;
- permission escalation ad hoc.

### Architecture

Non vuole che un test fallito porti a:

- cambiare migration history;
- indebolire data ownership;
- modificare fitness rule.

### Finance / FinOps

Non vuole un workflow multi-agent più costoso del valore del task.

## Decisione

ESI adotta un workflow semplice:

```text
Human Decision Owner
        ↓
Implementer Agent
        ↓
Deterministic gates
        ↓
Verifier Agent / independent review role
        ↓
Human merge decision
```

Specialist escalation soltanto su trigger.

```text
Security/Platform reviewer
→ if environment requires shared permission/network/resource

Architecture reviewer
→ if existing architecture rule or migration semantics must change

Product/Domain decision
→ if business semantics become ambiguous
```

Non abbiamo un Planner Agent separato.

OO-001 è già sufficientemente definita.

L'Implementer deve comunque produrre un execution plan breve prima del primo write, ma non serve un nuovo boundary organizzativo.

## Agent Delegation Contract — OO-001

ESI introduce il primo contract persistente.

Sintesi:

```text
Delegation ID
ADC-OO-001-v1

Work Item
OO-001

Role
Implementer

Autonomy
A2 — Execute + verify in bounded environment

Goal
Produce real PostgreSQL evidence for TST-005.

Allowed
read repo
edit test/integration scope
start isolated local PostgreSQL
run typecheck/tests/integration checks
add justified test-only dependency

Forbidden
merge main
production credential/resource
rewrite migration semantics merely to pass
change business/data ownership
weaken verification oracle

Retry budget
2 repair loops after first complete attempt

Stop
any OO-001 stop condition
plus permission/environment escalation
```

Il contract non ricopia l'intera issue.

La referenzia.

## AI Autonomy Matrix — prima versione

Per Order Operations:

| Capability | Level | Current rule |
|---|---:|---|
| read/search repository | A3 | automatic within repository context |
| plan scoped execution | A2 | no semantic scope expansion |
| edit scoped branch/worktree | A2 | task boundary required |
| run local deterministic tests | A3 | no production access |
| start isolated test dependency | A2 | reproducible + no prod secret |
| add test-only dependency | A2 | justify in closure evidence |
| create/update PR branch | A2/A3 | depends on execution platform |
| modify existing migration semantics | A0 | explicit decision required |
| modify architecture/security oracle | A0/A1 | separate policy decision |
| change data ownership | A0 | human/domain decision |
| merge default branch | human gate | repository policy |
| production mutation | A0 | dedicated future workflow only |

Questa matrice non misura l'intelligenza dell'agente.

Misura il rischio che ESI sa governare oggi.

## Verification Bundle — predefinito prima dell'execution

OO-001 potrà essere considerata completata solo se il bundle contiene:

```text
C-01
migration 001 → 002 succeeds on real PostgreSQL

C-02
success commits escalation + outbox

C-03
second-write failure commits neither

C-04
fast suite remains independent

C-05
evidence limitations explicit
```

Per ogni claim:

```text
mechanism
result
primary evidence reference
verifier finding
limitation
```

Il verifier deve controllare almeno:

1. engine reale PostgreSQL;
2. migration non riscritte per convenienza;
3. failure injection prima del commit;
4. query post-failure su entrambe le tabelle;
5. test harness riproducibile;
6. nessun claim improprio su Azure/HA/production.

## Human gate

Il human owner non riesegue tutto.

Riceve:

```text
work item
+ diff
+ verification bundle
+ unresolved findings
+ limitations
```

E decide:

```text
accept
request change
stop for decision
```

Il merge non è delegato in questa fase.

Questo è un costo consapevole.

## Costo accettato

ESI accetta:

- un secondo passaggio di verifica;
- più metadata/evidence per task delegati;
- un human merge gate;
- qualche latenza aggiuntiva rispetto a `agent → main`;
- costo di mantenere contract e autonomy matrix.

Non massimizziamo autonomia.

Massimizziamo **autonomia compatibile con evidence attuale**.

## Quality floor

Non sono negoziabili:

```text
business semantics
Payments ownership
migration provenance
data ownership
verification oracle integrity
no production credentials
explicit evidence limitations
```

Se un agente arriva a uno di questi boundary, il risultato corretto può essere `Stopped`.

## Guardrail

ESI aggiunge tre documenti al capstone:

```text
docs/agent-delegation-contract.md
docs/agent-verification-bundle.md
docs/ai-autonomy-matrix.md
```

E un fitness test per verificare almeno meccanicamente che:

- i documenti esistano;
- il contract referenzi OO-001;
- l'autonomy matrix mantenga human gate su decisioni critiche;
- il verification bundle preservi claim/evidence/limitations;
- nessun artefatto dichiari OO-001 già verificata.

La semantica dei documenti resta materia di review.

## Trigger per aumentare autonomia

ESI non aumenta A2 perché “il modello nuovo è migliore”.

Valuta invece:

```text
accepted task rate
repair loops
stop-condition quality
false green / missed finding
human review effort
policy violations
cost per verified change
```

Un possibile aumento verso A3 richiede:

- più task bounded completati correttamente;
- evidence bundle consistente;
- permission isolation reale;
- rollback/review flow affidabile;
- nessuna necessità di ampliare scope ad hoc.

## Trigger per ridurre autonomia

Autonomy scende se:

- cambia il toolset;
- compare accesso a dati sensibili;
- aumenta il blast radius;
- si introducono one-way door;
- il verifier trova recurring false positive;
- cresce il numero di repair loop;
- un agent modifica oracle/policy fuori autorizzazione.

Quindi:

> **L'autonomia non è una ricompensa all'agente. È una decisione di rischio dell'organizzazione.**

## Il compromesso ESI del capitolo

```text
Esigenza
più execution delegata

Tensione
throughput vs accountability / permission / verification cost

Decisione
A2 bounded execution + independent verification + human merge gate

Costo accettato
più governance e latenza di review

Quality floor
no semantic drift, no unauthorized permission, no self-certification

Guardrail
Delegation Contract + Verification Bundle + Autonomy Matrix

Evidence
platform guidance + executable repository gates + future task metrics

Trigger
observed task reliability / cost / failure / blast radius change
```

Questa è la prima vera trasformazione del developer in manager di agenti dentro il capstone.

Non perché smette di programmare.

Ma perché una parte crescente del suo lavoro diventa:

```text
definire il mandato
progettare i confini
selezionare l'evidence
leggere le eccezioni
prendere le decisioni che restano
```

> **Il manager di agenti non gestisce prompt. Gestisce responsabilità, permessi, evidence e rischio.**
