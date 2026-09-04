# ESI — Il pilot One-Man Project

ESI decide di sperimentare il modello sul **Case Explanation Assistant** introdotto nel Capitolo 24.

È una scelta intenzionale.

Non partiamo da:

```text
Payments ledger
production identity platform
regional disaster recovery
```

Partiamo da una capability:

- interna;
- read-only;
- advisory;
- con output verificabile contro source reference;
- senza write tool;
- con fallback deterministico;
- con model/provider ancora sostituibile.

Questa forma rende il rischio più governabile.

## Il mandato

ESI assegna a un singolo **Accountable Project Lead** il control plane tecnico del pilot.

Il ruolo non è legato a una persona nominata nel libro.

Responsabilità:

```text
maintain project direction
prepare work items
orchestrate agents
integrate evidence
keep canonical context synchronized
manage WIP
stop when decision boundary is crossed
prepare Product/Security/Platform gates
```

Non-authority:

```text
cannot redefine payment truth
cannot approve security exception
cannot change tenant isolation alone
cannot introduce customer-facing AI action without Product decision
cannot grant production AI tool permissions
cannot approve irreversible production migration alone
```

## Secondary maintainer

ESI assegna anche un **Secondary Maintainer**.

Non lavora quotidianamente sul pilot.

Deve però poter:

1. entrare nel repository da `AGENTS.md`;
2. usare la Repository Map;
3. capire il current AI Feature Contract;
4. eseguire i golden command;
5. ricostruire lo stato dei work item;
6. distinguere evidence Verified da Pending;
7. conoscere gli escalation path.

Il secondary maintainer è parte del continuity design.

Non è un secondo implementer permanente.

## Current project portfolio

Nel repository esiste già:

```text
OO-001
Verify PostgreSQL atomicity
for Payment Escalation + Outbox
```

Il Capitolo 24 ha inoltre lasciato aperta una decisione:

```text
Case Explanation model/provider
= Pending eval comparison
```

ESI introduce quindi un secondo work item:

```text
OO-002
Evaluate Case Explanation model/provider candidates
against the same eval suite
```

OO-002 non deve scegliere il modello “migliore in assoluto”.

Deve produrre evidence comparabile su:

```text
groundedness
source attribution
missing-evidence behavior
prompt-injection cases
authority violation cases
latency
cost per evaluated request
operational/provider constraints
```

Il modello selezionato deve avere il fit migliore con il **AI Feature Contract**.

## WIP policy del pilot

ESI parte con:

```text
Max active execution task      2
Max active cross-boundary task 1
Max unresolved semantic gate   1
```

Quindi OO-001 e OO-002 possono essere entrambi `Ready`, ma non devono necessariamente essere eseguiti contemporaneamente se entrambi consumano la stessa capacità di review cross-boundary.

Il lead può lasciare un task pronto senza lanciarlo.

> **La task queue è una capacità. Non un obbligo a saturarla.**

## Agent portfolio

### Explorer

Responsabilità:

- leggere documentazione provider;
- ricostruire capability/constraint;
- produrre candidate matrix;
- citare source primarie.

Permission:

```text
read-only
```

### Eval Implementer

Responsabilità:

- costruire adapter candidato fuori dal semantic core;
- eseguire eval sul seed versionato;
- raccogliere raw result/evidence;
- non cambiare il dataset per migliorare il proprio score.

Permission:

```text
bounded code/test/eval environment
no production data
```

### Adversarial Verifier

Responsabilità:

- rieseguire casi critici;
- controllare source reference;
- cercare authority violation;
- controllare limitation del risultato.

Permission:

```text
read + eval/test
no model-selection authority
```

### Documentation Synchronizer

Responsabilità:

- aggiornare AI Feature Contract / Cost Model / Testing Strategy quando la decisione viene presa;
- non inventare rationale mancante.

## Human gate

### Product / Operations

Deve valutare:

```text
is the explanation actually useful?
are uncertainty/fallback understandable?
```

### Security

Gate se cambiano:

```text
provider data boundary
new tool
new external retrieval
sensitive context
logging/retention
```

### Platform

Gate se il pilot richiede:

```text
shared AI gateway
new network path
enterprise provider integration
new production identity
```

Finance/FinOps partecipa quando emergono cost curve reali.

## Work flow

Il pilot usa:

```text
Human Lead
    ↓
OO-002 execution contract
    ↓
Explorer
    ↓
candidate matrix
    ↓
Eval Implementer
    ↓
raw eval evidence
    ↓
Adversarial Verifier
    ↓
Verification Bundle
    ↓
Human Lead integrates
    ↓
Product/Security gates if triggered
    ↓
ADR / AI Feature Contract update
```

La scelta finale non viene delegata al model evaluator.

Perché il modello candidato non è soltanto una funzione tecnica.

Può modificare:

- qualità;
- security posture;
- cost;
- latency;
- provider dependency;
- operational model.

## Continuity Test

Prima di dichiarare il pilot maturo, ESI prevede:

```text
Secondary Maintainer Drill
```

Scenario:

> il lead non è disponibile.

Il secondary maintainer deve, usando soltanto repository ed enterprise system autorizzati:

1. spiegare lo scopo del Case Explanation Assistant;
2. indicare quali decisioni sono ancora Pending;
3. eseguire `npm run typecheck` e i relevant test;
4. trovare eval suite e AI Feature Contract;
5. spiegare che cosa il modello non può decidere;
6. capire quale work item è safe da eseguire;
7. trovare specialist gate e stop conditions.

Se non riesce, la failure non viene attribuita al secondary maintainer per default.

Prima chiediamo:

> **quale conoscenza non abbiamo esternalizzato abbastanza bene?**

## Success criteria

Il pilot non è valutato da:

```text
number of agent tasks
number of generated lines
number of PR
```

Ma da:

```text
verified outcome throughput
review backlog
unexpected rework
agent repair/retry
lead attention cost
specialist gate quality
continuity drill result
business usefulness
cost per verified outcome
```

Molte di queste metriche sono ancora `Designed/Pending` nel capstone.

Non inventiamo valori.

## Il compromesso ESI

### Esigenza

Aumentare il leverage individuale su una capability interna e accelerare exploration/eval senza creare un team dedicato prematuramente.

### Tensione

```text
Finance / Engineering
→ lower coordination cost + faster iteration

Product / Security / Platform
→ no loss of domain authority, control or continuity
```

### Decisione

One-Man Project pilot sul Case Explanation Assistant con:

```text
one accountable lead
+ bounded agent portfolio
+ WIP limit
+ secondary maintainer
+ specialist triggers
+ independent verification
```

### Costo accettato

- review e specialist gate non spariscono;
- knowledge externalization richiede lavoro;
- parte del parallelismo possibile resta volontariamente inutilizzato;
- continuity drill richiede tempo.

### Quality floor

```text
model remains advisory
security/data boundary preserved
functional truth not delegated
verified != generated
project survives lead absence
```

### Trigger di uscita

Il modello viene rivalutato se:

- on-call/support cresce oltre la capacità del lead;
- review backlog diventa persistente;
- più specialist gate diventano quotidiani;
- nuovi consumer esterni aumentano il contract surface;
- AI runtime diventa business-critical/write-capable;
- secondary maintainer non riesce più a mantenere familiarità sufficiente.

In quel momento la scelta più matura può essere creare un team.

> **La vittoria del One-Man Project non è rimanere one-man per sempre. È massimizzare leverage finché quel modello conserva fit, e riconoscere presto quando non lo conserva più.**
