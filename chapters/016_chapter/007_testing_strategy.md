# 16.7 — Testing Strategy

Una Testing Strategy non è un elenco di framework.

Non è nemmeno un test plan dettagliato per la prossima release.

È il contratto di lungo periodo con cui il team decide:

> **quale confidence vuole costruire, rispetto a quali rischi, usando quali layer di evidence e con quali costi accettabili.**

Microsoft Well-Architected distingue esplicitamente test strategy e test plan: la prima definisce direzione, scope, metodi, ruoli, environment, rischi e criteri a livello workload; il secondo traduce quella direzione in attività specifiche per una release.

Fonti:

- [Microsoft Learn — Architecture strategies for testing](https://learn.microsoft.com/en-us/azure/well-architected/operational-excellence/testing)
- [Microsoft Learn — Build confidence in Azure workloads with effective testing practices](https://learn.microsoft.com/en-us/azure/well-architected/design-guides/testing)

## Perché serve un artefatto

Senza una strategy, una suite tende a crescere per accumulo:

```text
bug
→ nuovo test

framework nuovo
→ nuova suite

incident
→ nuovo script

security request
→ nuovo scanner

team nuovo
→ nuovo E2E
```

Dopo qualche anno nessuno sa più:

- quali test proteggono quali rischi;
- quali sono obbligatori per merge;
- quali sono release gate;
- quali sono flaky;
- quali environment servono;
- quali test duplicano gli stessi scenari;
- quali quality attribute non hanno evidence.

La Testing Strategy serve a mantenere intenzionale questa crescita.

## Template

Nel libro useremo questo artefatto:

```markdown
# Testing Strategy

## Product / system

## Quality goals

## Critical journeys

## Risk inventory

## Test layers

## Risk-to-evidence map

## Contract testing

## Data and migration testing

## Security testing

## Reliability and recovery testing

## Performance and capacity testing

## Infrastructure testing

## Synthetic / production verification

## Test environments

## Test data

## Pipeline stages and gates

## Flakiness policy

## Coverage and mutation policy

## AI-generated-test policy

## Ownership

## Evidence status

## Test debt

## Review triggers
```

Non tutte le sezioni devono essere lunghe.

Devono essere sufficienti per rendere le decisioni visibili.

## Quality goals

La strategy parte dai quality attribute del prodotto.

Per Order Operations:

```text
business correctness
security / tenant isolation
reliable escalation delivery
recoverability
contract compatibility
operability
fast feedback for engineers
```

Una suite con 95% coverage ma nessun cross-tenant negative test fallirebbe la strategy.

Una suite con molte UI automation ma nessun restore drill fallirebbe la strategy.

## Critical journey

Ogni critical journey deve avere una evidence chain.

Esempio:

```text
CF-02 Payment Escalation acceptance
```

può essere protetto da:

```text
application tests
→ business eligibility / idempotency / conflict

PostgreSQL integration
→ transaction / constraint

HTTP integration
→ authorization / serialization / status

synthetic journey
→ deployed path remains usable
```

La chain non significa testare ogni combinazione quattro volte.

Significa scegliere quale risk appartiene a quale layer.

## Risk inventory

La strategy deve collegarsi agli artefatti già esistenti.

Per Order Operations:

```text
Functional Analysis
→ business rule

API / Event Contract
→ compatibility risk

Data Ownership Map
→ persistence/authority risk

Failure Mode Map
→ distributed/recovery risk

Threat Model
→ security risk

Reliability Contract
→ SLO/RTO/RPO risk

Observability Contract
→ detection/diagnostic risk
```

Questi documenti diventano sorgenti del test backlog.

## Risk-to-Evidence Map

L'artefatto centrale della strategy è una tabella simile:

| ID | Risk/property | Impact | Best cheap evidence | Higher-fidelity evidence | Gate |
|---|---|---|---|---|---|
| TST-01 | same escalation idempotent | high | application | PostgreSQL/API | PR |
| TST-02 | no cross-tenant escalation | critical | application negative | authenticated integration | PR/release |
| TST-03 | escalation+outbox atomic | critical | component contract | PostgreSQL transaction | PR |
| TST-04 | v1 event compatible | high | serialization/schema | consumer contract | PR |
| TST-05 | duplicate delivery harmless | critical | consumer component | consumer persistence | release |
| TST-06 | restore meets RTO/RPO | critical | procedure review | actual drill | readiness |

La colonna `Gate` è importante.

Non tutta la evidence deve bloccare ogni commit.

## Pipeline layers

Una pipeline sostenibile può avere più velocità.

### Commit / local fast loop

Target:

```text
seconds / few minutes
```

Include:

- typecheck;
- unit/application test;
- deterministic contract/schema checks;
- static security baseline.

### Pull request gate

Include:

- fast loop;
- database integration;
- migration test;
- API integration;
- contract test;
- selected security negative test;
- IaC build/lint.

### Deployment / staging gate

Include:

- deployment validation;
- private connectivity;
- identity/RBAC negative test;
- smoke/synthetic critical journey;
- selected performance/reliability validation.

### Scheduled / readiness suite

Include:

- full regression;
- expensive performance;
- mutation on critical area;
- chaos/failure test;
- restore drill;
- security verification più ampia.

### Production continuous verification

Include:

- SLI;
- synthetic journey;
- canary/health;
- alert verification periodica;
- drift detection.

La pipeline è quindi una **evidence pipeline**, non semplicemente una sequenza di command.

## Fast feedback come quality attribute della suite

Una suite che richiede un'ora per ogni typo verrà aggirata.

Quindi la testing architecture deve ottimizzare anche:

```text
feedback latency
```

Microsoft raccomanda di non inserire ogni possibile test nell'initial build pipeline proprio perché una suite troppo pesante può rallentare il ciclo e incoraggiare bypass; suggerisce di concentrare i test frequenti sui critical workflow e spostare suite costose nei gate appropriati.

Fonte:

- [Microsoft Learn — Architecture strategies for testing](https://learn.microsoft.com/en-us/azure/well-architected/operational-excellence/testing)

## Flakiness budget

Una strategy deve dire cosa succede a un flaky test.

Policy ESI:

```text
flaky detected
→ issue + owner
→ quarantine only if needed to unblock unrelated work
→ still visible in quality reporting
→ fix/remove within explicit window
```

Non:

```text
retry automatically until pass
→ forget
```

Possibili signal:

- rerun discrepancy;
- pass/fail without product change;
- environment-sensitive failure;
- historical flake rate;
- quarantine age.

Meta ha mostrato in produzione che anche l'affidabilità dei test può essere trattata come qualcosa da misurare e monitorare.

Fonte:

- [Engineering at Meta — Probabilistic flakiness](https://engineering.fb.com/2020/12/10/developer-tools/probabilistic-flakiness/)

## Coverage policy

La strategy deve evitare due estremi.

### Nessuna coverage visibility

Possiamo lasciare intere aree non esercitate senza saperlo.

### Coverage come KPI assoluto

Possiamo incentivare test senza valore.

Policy consigliata nel nostro capstone:

```text
coverage = diagnostic signal
not proof of correctness
```

Per aree critiche possiamo impostare guardrail più severi, ma accompagnati da risk/fault evidence.

## Mutation policy

Mutation testing viene applicato in modo selettivo.

Candidate area Order Operations:

- tenant authorization;
- Payment Escalation idempotency;
- conflict detection;
- outbox atomicity adapter logic;
- log redaction;
- future economic action.

Non inseguiamo il 100% di mutation score.

Microsoft formula una guidance simile: concentrare l'analisi sui surviving mutant significativi e sulle aree ad alto rischio, senza trasformare il punteggio in obiettivo assoluto.

Fonte:

- [Microsoft Learn — Mutation testing](https://learn.microsoft.com/en-us/dotnet/core/testing/mutation-testing)

## AI-generated-test policy

La Testing Strategy deve dire esplicitamente come usiamo gli agenti.

Per ESI:

### Consentito

- generate test candidate da requirement;
- derive negative case;
- generate fixture sintetiche;
- propose mutation/fault;
- review coverage gap;
- explain failing test;
- minimize reproduction;
- classify redundant test.

### Richiede review umana

Ogni test merged.

La review verifica:

```text
requirement/risk source
fault detected
assertion strength
layer fit
determinism
security of test data
maintenance cost
```

### Non accettato come evidence sufficiente

```text
"AI says tests are comprehensive"
```

oppure:

```text
"all generated tests pass"
```

Il pass/fail è evidence soltanto rispetto alla property che il test rappresenta.

## Test data policy

Definiamo:

```text
synthetic by default
explicit tenant ownership
no production secret
no uncontrolled production PII dump
deterministic fixture where possible
cleanup ownership
```

Per integration/E2E environment:

- fixture seed versionata;
- unique identifier per run;
- isolamento fra test paralleli;
- lifecycle chiaro.

## Test environment policy

La strategy non richiede full production parity per ogni test.

Richiede fidelity rispetto alla property.

Esempio:

```text
business rule
→ process-local

PostgreSQL semantics
→ real PostgreSQL

Azure private RBAC
→ Azure non-production

region recovery
→ environment capable of regional recovery exercise
```

Questo contiene il costo senza fingere equivalenza dove non esiste.

## Ownership

Testing non appartiene al QA team.

Come per l'analisi funzionale, può esistere specializzazione.

Ma la conoscenza della qualità deve essere condivisa.

Per Order Operations:

### Workload team

- unit/component/integration;
- API;
- data/migration;
- application security;
- test suite health.

### Payments & Risk

- consumer contract;
- downstream idempotency;
- payment semantic behavior.

### Platform

- landing-zone/IaC verification capability;
- ephemeral/test environment foundation;
- deployment evidence.

### Security

- security verification baseline;
- threat-derived test review;
- privileged boundary tests.

### Reliability/on-call

- drills;
- alert/recovery validation;
- incident-derived regression.

### Product/domain stakeholder

- acceptance criteria;
- critical journey correctness;
- exploratory/acceptance evidence quando serve giudizio umano.

## Test plan vs strategy

Il prossimo incremento “aggiungere acknowledgement di Payments” potrà avere un test plan specifico.

La Testing Strategy invece rimane e ci dice:

- che tipo di risk map usare;
- quali gate esistono;
- quali quality floor non sono negoziabili;
- come gestiamo flaky test;
- come usiamo AI;
- come scegliamo environment.

## Evidence status

La Testing Strategy stessa usa il modello del capstone:

```text
Designed
→ test requirement/strategy exists

Codified
→ automated/manual executable asset exists

Verified
→ test has run and demonstrated expected evidence

Monitored
→ test/signal health is continuously observed
```

Un test file appena committed è `Codified`.

Non è `Verified` finché non lo eseguiamo.

## Review trigger

Rivedere la strategy quando cambia almeno uno fra:

- critical journey;
- threat model;
- RTO/RPO/SLO;
- topology;
- database/broker;
- team boundary;
- public/private exposure;
- regulatory requirement;
- incident class;
- CI time/cost;
- suite flakiness;
- AI autonomy nel development workflow.

## Corollario

> **Una buona Testing Strategy non prova tutto. Rende esplicito perché crediamo alle cose che decidiamo di chiamare vere.**