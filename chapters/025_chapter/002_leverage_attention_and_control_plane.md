# Leverage, attention e control plane

Il vantaggio più evidente dell'AI nello sviluppo software è la capacità di delegare execution.

Ma se il nostro modello mentale rimane:

```text
più output
=
più produttività
```

rischiamo di misurare male proprio il cambiamento che stiamo cercando di capire.

La ricerca SPACE sulla developer productivity insiste da anni sul fatto che la produttività non può essere ridotta a una singola metrica di activity. Il framework considera almeno Satisfaction and well-being, Performance, Activity, Communication and collaboration, Efficiency and flow.

Fonte:

- [Microsoft Research / ACM Queue — The SPACE of Developer Productivity](https://www.microsoft.com/en-us/research/publication/the-space-of-developer-productivity-theres-more-to-it-than-you-think/)

Per un One-Man Project questo punto diventa ancora più importante.

Una singola persona con molti agenti può aumentare enormemente l'**activity** e contemporaneamente peggiorare:

- decision quality;
- communication;
- recoverability;
- cognitive load;
- review latency;
- incident response;
- sostenibilità del lavoro.

## Il leverage stack

Nel nostro modello il leverage non nasce dal modello AI da solo.

Nasce da una pila di capability costruite durante tutto il libro:

```text
clear problem / functional semantics
        ↓
canonical repository context
        ↓
execution-ready work items
        ↓
agent delegation boundaries
        ↓
reproducible environment
        ↓
fast deterministic verification
        ↓
higher-fidelity evidence
        ↓
architecture/security/reliability guardrail
        ↓
human decision gates
```

Un agente molto forte dentro un repository ambiguo produce execution veloce dentro un sistema ambiguo.

Un agente meno spettacolare dentro un sistema con confini, test e context chiari può produrre leverage più affidabile.

> **Il leverage non è la quantità di codice che l'agente può generare. È la quantità di execution che possiamo delegare senza perdere il controllo del significato.**

## Il control plane umano

Possiamo usare una metafora già familiare dal cloud.

Nel data plane avviene l'execution:

```text
code generation
search
refactoring
test creation
documentation update
environment setup
analysis
review candidate
```

Nel control plane avvengono decisioni come:

```text
what outcome matters?
what risk is acceptable?
who owns the truth?
which contract may change?
which evidence is sufficient?
when do we stop?
when may we merge?
when may we roll out?
```

Il One-Man Project aumenta soprattutto la capacità del data plane.

Il limite si sposta sul control plane.

Per questo il professionista evolve da artifact producer a **governor of execution**.

## Il throughput della decisione

Immaginiamo cinque agenti.

```text
Agent A → API task
Agent B → migration task
Agent C → observability task
Agent D → security review
Agent E → documentation update
```

Tutti terminano nello stesso momento.

Il lead deve ora:

- capire cinque set di conseguenze;
- risolvere eventuali contraddizioni;
- leggere evidence differenti;
- capire se una decisione è diventata architetturalmente significativa;
- autorizzare o fermare i passi successivi.

Il sistema può quindi avere:

```text
execution throughput > decision throughput
```

Quando accade, aggiungere altri agenti aumenta il backlog cognitivo.

È l'equivalente umano di una queue senza consumer capacity sufficiente.

> **Gli agenti possono trasformare il lavoro in backlog più velocemente di quanto una persona riesca a trasformare il backlog in decisioni.**

## Attention budget

Nel One-Man Project introduciamo quindi un'altra risorsa esplicita:

> **attention budget**

Non è una metrica scientifica universale.

È un modo operativo per ricordare che ogni task delegato genera almeno parte di questo costo:

```text
context load
review
contradiction resolution
follow-up
risk acceptance
cleanup
```

Due task apparentemente piccoli possono consumare più attention di un task grande se attraversano boundary differenti.

Per esempio:

```text
rename local type
```

può richiedere poca attention.

Mentre:

```text
change retry semantics
```

può richiedere lettura di:

- API Contract;
- Failure Mode Map;
- Reliability Contract;
- consumer behavior;
- tests;
- observability;
- cost impact.

Quindi non misuriamo il carico dal numero di file.

Misuriamo il **decision surface**.

## WIP limit anche per gli agenti

Il Kanban ha reso familiare l'idea che work in progress eccessivo riduca flow e aumenti tempi e contesto.

Lo stesso principio diventa ancora più importante con gli agenti.

Il fatto che possiamo lanciare venti task non implica che sia una buona idea.

Una policy One-Man Project può quindi dire:

```text
max 3 concurrent execution tasks
max 1 task crossing a one-way-door candidate
max 1 unresolved semantic decision at a time
```

I numeri dipendono dal progetto e non sono best practice universali.

Il principio è:

> **limita il parallelismo sulla base della capacità di verifica e decisione, non della capacità di generazione.**

## Task class

Per rendere il WIP più intelligente possiamo classificare i task.

### T0 — Mechanical

```text
bounded rename
formatting
known codemod
small doc synchronization
```

Molto delegabile.

### T1 — Local behavioral

```text
bounded feature behavior
local bug
small refactor
```

Richiede acceptance + test.

### T2 — Cross-boundary

```text
API
DB
messaging
security
cloud
```

Richiede più context e review.

### T3 — Decision-changing

```text
business semantics
data ownership
external compatibility
irreversible migration
production autonomy
```

Non è semplicemente execution.

Richiede decision owner esplicito.

Questa classificazione è ESI, non uno standard.

Serve a impedire che l'agente tratti ogni task come se differisse soltanto per numero di token.

## Il rischio del focus apparente

Una persona può sembrare estremamente produttiva perché passa la giornata a:

```text
launch agent
review result
launch agent
review result
launch agent
review result
```

ma perdere progressivamente la capacità di:

- studiare una questione in profondità;
- formulare una nuova architettura;
- parlare con utenti e stakeholder;
- comprendere un dominio;
- imparare nuove tecnologie;
- riflettere sui failure mode.

Questo sarebbe un altro tipo di deskilling.

Non della capacità di scrivere codice.

Della capacità di **pensare abbastanza a lungo su un problema difficile**.

Per questo il One-Man Project deve proteggere anche il deep work.

Possiamo delegare molto lavoro proprio per liberare più tempo per le decisioni che non vogliamo delegare.

Se usiamo tutto il tempo liberato per generare altro lavoro, abbiamo perso metà del beneficio.

## Metriche sane

Una metrica come:

```text
PR per engineer
```

può essere utile come activity signal.

Non deve diventare il nostro outcome.

Per il One-Man Project preferiamo leggere insieme:

```text
verified outcome throughput
lead time
rework rate
escaped defects
review backlog
unresolved decisions
operator/customer outcome
cost per verified outcome
continuity risk
```

L'AI può aumentare il volume.

L'obiettivo è aumentare **capability**, non semplicemente activity.

> **Il progetto non scala quando una persona riesce ad avviare più lavoro. Scala quando riesce a governare più outcome mantenendo comprensione, evidence e reversibilità.**
