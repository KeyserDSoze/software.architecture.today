## Testing Strategy

Una Testing Strategy non è l’elenco dei framework usati dal repository e non è il test plan della prossima release.

È il contratto con cui il team decide:

> **quale confidence vuole costruire, rispetto a quali rischi, usando quali boundary di evidence e con quali costi accettabili.**

Microsoft Well-Architected distingue test strategy e test plan proprio in questi termini: la strategy definisce direzione, scope, metodi, environment, ruoli, rischi e criteri a livello workload; il test plan traduce quella direzione in attività concrete per una release o un incremento.

Fonti:

- [Microsoft Learn — Architecture strategies for testing](https://learn.microsoft.com/en-us/azure/well-architected/operational-excellence/testing)
- [Microsoft Learn — Build confidence in Azure workloads with effective testing practices](https://learn.microsoft.com/en-us/azure/well-architected/design-guides/testing)

## Perché serve un artefatto

Senza una strategy la suite cresce per sedimentazione:

```text
bug → nuovo regression test
incident → nuovo script
security review → nuovo scanner
framework → nuova suite
team → nuovo E2E
```

Ogni aggiunta può essere ragionevole e lasciare, qualche anno dopo, un sistema di prova in cui nessuno sa quali test proteggano i rischi importanti, quali siano gate, quali duplicati, quali flaky, quali environment indispensabili e quali quality attribute restino senza evidence.

La strategy mantiene intenzionale questa crescita.

## Template operativo

Nel libro usiamo:

```markdown
# Testing Strategy

## Product / system

## Quality goals

## Critical journeys

## Risk inventory

## Risk-to-Evidence Map

## Test / evaluation layers

## Contract and data testing

## Security testing

## Reliability / recovery testing

## Performance / capacity testing

## Infrastructure testing

## Synthetic / production verification

## Test environments

## Test data

## Pipeline stages and gates

## Flakiness policy

## Coverage / mutation policy

## AI-generated-test policy

## Ownership

## Evidence status

## Test debt

## Review triggers
```

Non tutte le sezioni devono diventare documenti lunghi. Devono rendere leggibile perché crediamo alle claim che chiamiamo `Verified`.

## Risk inventory: usare gli artefatti come sorgente del test backlog

Per Order Operations la strategy non nasce da un brainstorming separato. Legge:

```text
Functional Analysis
→ business rule

API / Event Contract
→ compatibility

Data Ownership Map
→ persistence / authority

Failure Mode Map
→ distributed failure / recovery

Threat Model / Security Control Matrix
→ security claim

Reliability Contract
→ SLO / RTO / RPO

Observability Contract
→ detection / diagnostic evidence
```

Questa relazione trasforma gli artefatti architetturali in un sistema di traceability. Se il Threat Model cambia, la Testing Strategy deve poter vedere quale evidence non è più sufficiente.

## Risk-to-Evidence Map

L’artefatto centrale è una tabella compatta:

| ID | Risk/property | Fast evidence | Higher-fidelity evidence | Gate |
|---|---|---|---|---|
| TST-001 | same escalation intent idempotent | application | PostgreSQL/API | PR |
| TST-002 | no cross-tenant escalation | negative application | authenticated staging | PR/release |
| TST-003 | escalation + outbox atomic | orchestration | PostgreSQL transaction | PR |
| TST-004 | event v1 compatible | serialization | consumer/provider contract | PR |
| TST-005 | duplicate delivery harmless | consumer component | consumer persistence | release |
| TST-006 | restore meets RTO/RPO | runbook review | actual drill | readiness |

La colonna `Gate` impedisce un altro dogma: non tutta la evidence deve bloccare ogni commit.

## La pipeline come evidence pipeline

La suite ha più velocità perché i rischi hanno boundary e costi diversi.

### Local / commit fast loop

Obiettivo: secondi o pochi minuti.

```text
typecheck/build
application/component tests
deterministic schema/contract checks
static security baseline
```

Questa evidence deve essere abbastanza economica da non essere aggirata.

### Pull request gate

Aggiunge ciò che serve a verificare boundary frequenti ma ancora relativamente economici:

```text
PostgreSQL integration
migration chain
API integration
consumer/provider contract
selected negative security cases
IaC build/lint/static policy
```

### Staging / deployment gate

Qui attraversiamo boundary cloud che non possiamo simulare localmente:

```text
private connectivity
Entra authentication
RBAC negative verification
Service Bus adapter
managed PostgreSQL connectivity
smoke / synthetic critical journey
```

### Scheduled / readiness evidence

Le prove costose non spariscono soltanto perché non girano a ogni PR:

```text
performance / capacity
selected mutation
failure injection
PostgreSQL failover / PITR
alert drill
broader security verification
```

### Production continuous verification

In produzione la confidence continua a essere aggiornata da:

```text
SLI/SLO
private synthetic journey
canary/health
drift detection
alert behavior
```

Questa non sostituisce i layer precedenti. Misura claim che soltanto l’ambiente operativo reale può continuare a falsificare.

> **La pipeline non è una sequenza di command. È una sequenza di claim sempre più costose da mettere in pericolo.**

## Feedback latency è un quality attribute del quality system

Una pipeline che richiede un’ora per ogni modifica minima verrà bypassata, parallelizzata male o trattata come rumore. La suite deve quindi progettare anche il proprio tempo di feedback.

Microsoft raccomanda di concentrare i test frequenti sui critical workflow e spostare evidence costosa nel gate appropriato invece di rendere l’initial build insostenibile.

Fonte:

- [Microsoft Learn — Architecture strategies for testing](https://learn.microsoft.com/en-us/azure/well-architected/operational-excellence/testing)

Questo non è un compromesso contro la qualità. È ciò che permette alla qualità di restare nel normale execution path del team.

## Flakiness policy

Per ESI:

```text
flaky detected
→ issue + owner
→ quarantine soltanto se serve a sbloccare lavoro non correlato
→ failure resta visibile nel quality reporting
→ fix/remove entro una finestra esplicita
```

Non:

```text
retry until green
→ forget
```

Segnali utili sono rerun discrepancy, fail senza product change, environment-sensitive failure e quarantine age.

Meta mostra come la flakiness stessa possa essere misurata e monitorata su larga scala.

Fonte:

- [Engineering at Meta — Probabilistic flakiness](https://engineering.fb.com/2020/12/10/developer-tools/probabilistic-flakiness/)

Un flaky test non è “solo un problema della CI”. È un sensore difettoso nella evidence pipeline.

## Coverage e mutation policy

ESI usa:

```text
coverage = diagnostic signal
coverage != proof of correctness
```

La coverage aiuta a trovare zone mai esercitate; non diventa un KPI che incentiva test inutili.

Mutation testing resta selettivo sulle aree in cui un assertion gap avrebbe impatto alto: tenant authorization, escalation idempotency, conflict detection, outbox behavior, redaction e future operation economiche.

Microsoft suggerisce analogamente di concentrarsi sui surviving mutant significativi e sulle aree ad alto rischio, senza inseguire un punteggio assoluto.

Fonte:

- [Microsoft Learn — Mutation testing](https://learn.microsoft.com/en-us/dotnet/core/testing/mutation-testing)

## AI-generated-test policy

Gli agenti possono:

```text
derivare test candidate da requirement/invariant
proporre negative case
generare fixture sintetiche
proporre fault/mutation
minimizzare reproduction
analizzare coverage gap
classificare test ridondanti
```

Ogni test merged richiede però review della sua evidence:

```text
risk/source
fault detected
assertion strength
layer fit
determinism
data safety
redundancy
maintenance cost
```

Non accettiamo come evidence sufficiente:

```text
AI says comprehensive
```

né:

```text
all generated tests pass
```

Il `PASS` ha significato soltanto rispetto alla claim che il test rappresenta.

## Test data ed environment policy

Il default è:

```text
synthetic data
explicit tenant ownership
no production secret
no uncontrolled production PII dump
deterministic fixture when possible
```

Per test paralleli servono identifier unici, isolamento e lifecycle chiaro.

L’environment viene scelto per fidelity della property:

```text
business rule
→ process-local

PostgreSQL semantics
→ real PostgreSQL

Azure private RBAC
→ Azure non-production

regional recovery
→ environment capace del recovery exercise
```

Non chiediamo full production parity per ogni test e non fingiamo equivalenza quando il boundary reale manca.

## Ownership: la qualità non appartiene al QA team

Può esistere specializzazione, ma il risk model deve essere condiviso.

Order Operations possiede application/integration/data/migration e health della suite. Payments & Risk possiede consumer semantics e downstream idempotency. Platform possiede foundation e capability per environment/deployment verification. Security contribuisce alla verification dei threat e dei privileged boundary. Reliability/on-call possiede drill e incident-derived regression. Product/domain stakeholder contribuisce alla correctness dei critical journey e alle acceptance claim che richiedono giudizio.

La Testing Strategy impedisce che una property cross-team rimanga “owned by everyone”, cioè da nessuno.

## Evidence status

Anche la suite usa il modello del capstone:

```text
Designed
→ test requirement / strategy esiste

Codified
→ executable/manual asset esiste

Verified
→ asset eseguito e expected evidence osservata

Monitored
→ test/signal health osservato continuamente o operativamente
```

Un test appena committed è `Codified`. Non è `Verified` finché non è stato eseguito sul boundary che dichiara di rappresentare.

## Review trigger

La strategy va riaperta quando cambiano critical journey, threat, SLO/RTO/RPO, topology, database/broker, team boundary, exposure, incident class, CI cost/time, suite flakiness o autonomia degli agenti nel development workflow.

Nel capstone vivo questa stessa strategy continuerà infatti a crescere nei Capitoli 17–24 con legacy/refactoring e runtime AI evaluation. La sezione corrente descrive la **baseline del Capitolo 16**.

> **Una buona Testing Strategy non prova tutto. Rende esplicito perché crediamo alle cose che decidiamo di chiamare vere.**