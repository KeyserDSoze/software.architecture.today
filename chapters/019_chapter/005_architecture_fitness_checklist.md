# 19.5 — Architecture Fitness Checklist: il portfolio delle proprietà protette

Una singola fitness function può dirci che un boundary è stato violato.

Un workload complesso ha però bisogno anche di una vista che colleghi le proprietà più importanti al modo in cui vengono governate nel tempo.

Per questo introduciamo:

> **Architecture Fitness Checklist**

Il nome `checklist` non indica un catalogo di best practice universali.

È un portfolio vivo di proprietà che **questo workload** ha deciso di proteggere.

La relazione che vogliamo rendere visibile è:

```text
architectural intent
→ risk
→ evidence mechanism
→ current state
→ failure action
→ owner
→ review trigger
```

## Una riga deve raccontare una decisione

Per ogni fitness significativa bastano campi come:

```text
Fitness ID
Property
Why / risk
Mechanism
Evidence source
Failure action
Owner
Current status
Review trigger
```

Esempio:

```text
AF-001
Property
Target code must not depend directly on Operations Desk Classic implementation.

Why
Prevent legacy semantic/coupling leakage.

Mechanism
Static architecture test.

Failure action
Fail local/PR gate.

Owner
Commerce & Operations.

Review trigger
Legacy retirement or coexistence redesign.
```

Questo è molto più governabile di:

> Keep legacy isolated.

Il principio resta leggibile, ma ora sappiamo anche come viene protetto e quando può smettere di avere senso.

## La checklist attraversa più dimensioni

Order Operations non possiede soltanto una struttura di package.

Le proprietà architetturali importanti arrivano da tutto il libro.

### Functional / domain

```text
new business behavior passes through functional analysis
legacy behavior does not become requirement without confirmation
Payments retains economic semantic ownership
```

### Structure

```text
application does not depend on integration
contracts remain independent
priority stays isolated from legacy/vendor mechanisms
```

### Data

```text
each business fact has an owner
derived copy declares source/freshness/reconciliation
migration does not create ambiguous authority
```

### Security

```text
private ingress remains intentional
runtime and deployment identity stay separated
least privilege remains verifiable
no production secret enters repo
```

### Reliability

```text
SLO / RTO / RPO have evidence
retry remains bounded
recovery drill is not replaced by configuration claims
```

### Observability

```text
metric dimensions remain bounded
critical journey keeps correlation
critical alert has owner/action
telemetry cost remains visible
```

### Testing

```text
critical risk maps to an adequate evidence layer
flaky test remains a defect
local evidence is not promoted to external-boundary verification
```

### Evolution

```text
significant ADR has review trigger
exception has expiry
migration has cleanup stage
temporary flag has removal condition
```

Non tutte queste proprietà devono avere un test automatico.

Devono però avere un modo comprensibile di produrre o richiedere evidence.

## Lo stato non è soltanto verde o rosso

Per la checklist riutilizziamo il linguaggio del capstone:

```text
Designed
→ Codified
→ Verified
→ Monitored
```

Aggiungiamo quando utile:

```text
At Risk
Exception Active
Review Required
```

Questo evita un errore frequente: confondere la presenza di un meccanismo con l'evidence della proprietà nel sistema reale.

Esempio:

```text
private ingress

Bicep declaration exists
→ Codified

non-production connectivity check passes
→ Verified in that environment

production drift signal exists
→ Monitored
```

Un architecture test locale non può promuovere una property cloud a `Verified` in Azure.

## Fitness atomiche e olistiche

Thoughtworks distingue fitness function locali da proprietà che richiedono una vista più olistica del sistema.

Fonte:

- [Thoughtworks — Building Evolutionary Architectures sample chapter](https://www.thoughtworks.com/content/dam/thoughtworks/documents/books/bk_building_evolutionary_architectures_en.pdf)

La distinzione è utile perché evita di usare il meccanismo sbagliato.

```text
module dependency
→ static test

regional recovery
→ drill

SLO
→ runtime telemetry

cost trend
→ cost evidence + review

context drift
→ ADR trigger + human decision
```

Il meccanismo deve essere capace di osservare la proprietà che pretende di governare.

## La checklist deve restare piccola abbastanza da essere usata

Ogni nuova fitness function introduce costo:

- execution;
- maintenance;
- false positive;
- cognitive load;
- exception management;
- documentazione.

Quindi prima di aggiungerla chiediamo:

> **Quale rischio significativo diventerebbe più difficile da rilevare senza questa regola?**

Se non abbiamo una risposta forte, la fitness probabilmente non merita ancora di entrare nel portfolio.

## Il portfolio deve essere riesaminato

Periodicamente il team dovrebbe chiedere:

```text
Which rule caught useful drift?
Which rule is noisy?
Which protects an assumption that expired?
Which risk is still protected only by memory?
Which fitness can be removed?
Which property needs a better evidence mechanism?
```

Questo è importante perché anche il sistema di governance può diventare legacy.

Una regola inutile non è neutrale: consuma attenzione e riduce la fiducia nelle altre.

## ADR e fitness hanno ruoli diversi

```text
ADR
→ why this decision has fit
→ assumptions / trade-offs / review trigger

Fitness function
→ repeated evidence on a protected property
```

Se una fitness fallisce perché l'implementazione ha driftato, correggiamo il sistema.

Se fallisce perché un assumption dell'ADR non vale più, riapriamo la decisione.

La checklist deve aiutare a distinguere queste due azioni.

> **Il valore della Architecture Fitness Checklist non è mostrare una parete di verde. È rendere visibile quale decisione stiamo ancora proteggendo, con quale evidence e con quale diritto di cambiarla quando il contesto evolve.**