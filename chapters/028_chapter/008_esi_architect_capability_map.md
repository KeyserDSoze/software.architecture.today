# 28.8 — ESI Architect Capability Map

Dopo ventotto capitoli possiamo finalmente rispondere in modo operativo alla domanda:

> **Che cosa deve saper fare un architect nell'era dell'AI?**

Non vogliamo costruire una checklist infinita di tecnologie.

Non vogliamo nemmeno una matrice di certificazioni.

ESI introduce una **Architect Capability Map** basata su capacità osservabili.

Il modello non dice:

```text
conosci Azure?
conosci Kubernetes?
conosci Kafka?
```

Chiede:

```text
sai trasformare un problema ambiguo in decisioni verificabili?
sai riconoscere un boundary?
sai leggere il runtime?
sai negoziare un trade-off?
sai governare execution delegata?
sai sapere quando serve uno specialista?
```

---

## Le undici capability

### 1. Product & Functional Analysis

L'architect sa:

- comprendere outcome e journey;
- leggere e produrre una prima functional analysis;
- modellare stati e invariant;
- separare requirement da implementation suggestion;
- riconoscere decision authority e open question;
- collegare acceptance criterion a evidence.

Failure mode:

```text
architecture built from tickets
without product understanding
```

---

### 2. System Boundaries & Domain Design

L'architect sa:

- identificare responsibility boundary;
- ragionare su cohesion e coupling;
- distinguere logical boundary da deployable boundary;
- modellare ownership;
- riconoscere hidden coupling;
- evitare distributed monolith.

Failure mode:

```text
boxes without responsibility
```

---

### 3. Technical & Code Literacy

L'architect sa:

- leggere critical flow nel codice;
- capire test e migration;
- riconoscere provider coupling;
- costruire POC/spike mirati;
- usare runtime evidence per falsificare assunzioni;
- restare tecnicamente credibile senza dover implementare tutto.

Failure mode:

```text
architecture detached from implementation reality
```

---

### 4. Data & Distributed Systems

L'architect sa ragionare su:

```text
transactions
isolation
consistency
idempotency
ordering
messaging
backpressure
replication
migration
reconciliation
```

Failure mode:

```text
network treated as local call
or copies treated as authority
```

---

### 5. Security, Reliability & Operability

L'architect sa:

- threat model;
- least privilege;
- progettare failure boundary;
- definire SLI/SLO/RTO/RPO;
- distinguere HA, backup e DR;
- progettare telemetry e supportability;
- chiedere drill/evidence appropriati.

Failure mode:

```text
happy-path architecture
```

---

### 6. Economics & Cost

L'architect sa collegare:

```text
cost driver
→ property purchased
→ business value / risk
```

Comprende TCO, migration premium, cognitive cost, observability cost, reliability premium e unit economics.

Failure mode:

```text
cheapest component
→ assumed cheapest architecture
```

---

### 7. Evolution, Legacy & Reversibility

L'architect sa:

- distinguere Observed da Confirmed;
- costruire characterization evidence;
- progettare seam e coexistence;
- riconoscere one-way door;
- costruire rollback/fallback;
- definire fitness function e review trigger.

Failure mode:

```text
rewrite or freeze
```

---

### 8. AI Runtime Architecture

L'architect sa ragionare su:

```text
model authority
context
retrieval
tool permission
prompt injection
structured output
eval
model drift
latency
cost
fallback
```

Failure mode:

```text
model capability mistaken for business authority
```

---

### 9. Agentic Engineering Governance

L'architect sa progettare:

```text
repository context
work item
scope
permission
verification
stop condition
human gate
```

Sa distinguere capability, authorization e autonomy.

Failure mode:

```text
faster execution
→ faster uncontrolled change
```

---

### 10. Enterprise Systems & Communication

L'architect sa:

- identificare stakeholder;
- tradurre property tecnica in conseguenza business;
- negoziare trade-off;
- distinguere platform leverage da uniformità;
- proporre launch boundary alternativi;
- costruire governance proporzionale al rischio.

Failure mode:

```text
locally optimal technology
→ globally expensive organization
```

---

### 11. Evidence, Learning & Teaching

L'architect sa:

- scegliere evidence proporzionale al claim;
- usare primary source;
- separare hypothesis da fact;
- studiare con l'AI senza delegare comprensione;
- insegnare e documentare decisioni;
- trasformare incidenti e runtime signal in nuova conoscenza.

Failure mode:

```text
confident artifact
without reliable knowledge
```

---

## Quattro livelli di capacità

ESI non usa una scala `Junior → Senior → Architect` per questa map.

Ogni capability viene valutata separatamente.

### L1 — Understand

```text
sa spiegare il concetto
sa riconoscere i termini
sa seguire una decisione esistente
```

### L2 — Apply

```text
sa usare la capacità su un problema bounded
sa produrre un artifact utile
sa verificare il proprio lavoro
```

### L3 — Govern

```text
sa prendere / facilitare decisioni cross-boundary
sa gestire trade-off e risk
sa definire guardrail/evidence
```

### L4 — Grow the system

```text
sa insegnare
sa costruire paved road / policy / capability riusabile
sa far crescere altri
sa riconoscere quando la policy stessa va cambiata
```

La scala è deliberatamente diversa da `conosce / esperto`.

Vogliamo distinguere:

```text
sapere
fare
governare
rendere altri più autonomi
```

---

## Non serve L4 ovunque

Un architect non deve essere L4 in tutte le undici aree.

Sarebbe poco realistico e probabilmente controproducente.

Una baseline ESI può essere:

```text
Product & Functional Analysis        >= L2
System Boundaries                    >= L3
Technical & Code Literacy            >= L2
Security/Reliability/Operability     >= L2
Economics                            >= L2
Evidence & Learning                  >= L3
```

con almeno una o due aree di profondità forte.

Le altre possono essere coperte con specialisti.

Il punto è saper riconoscere il trigger.

---

## Specialist trigger

La capability map non elimina specialisti.

Li rende più facili da coinvolgere nel momento corretto.

Trigger tipici:

```text
Payment/economic semantics
→ Payments & Risk / domain specialist

regulated data/compliance
→ Security + Legal/Compliance

advanced database performance/recovery
→ data/platform specialist

public security boundary
→ Security

complex multi-region topology
→ Platform/SRE

high-impact AI action tool
→ AI + Security + domain authority
```

La maturity non consiste nel non chiedere aiuto.

Consiste nel sapere **quando l'aiuto è parte della decisione**.

---

## Evidence della capability

Non vogliamo valutare la map soltanto con colloqui o certificazioni.

Evidence possibili:

```text
ADR con trade-off chiaro
functional analysis facilitata
POC che chiude una assumption
incident review
failure-mode map
architecture fitness function
cost model
migration plan
production readiness review
agent delegation design
mentoring / teaching artifact
```

Un singolo artifact non dimostra automaticamente una capability.

Conta il contesto e il ruolo svolto.

---

## La capability map non è un ranking

Non vogliamo trasformarla in:

```text
Architect score = 83/100
```

Il rischio è ottimizzare la carriera per compilare caselle.

La map serve per conversazioni:

```text
Quale capability ci manca nel team?
Quale decisione richiede più depth?
Dove un architect sta diventando collo di bottiglia?
Dove dipendiamo da un solo esperto?
Quale area vogliamo sviluppare nei prossimi mesi?
```

---

## ESI: modello di team

ESI non vuole un esercito di architect centralizzati.

La direzione è:

```text
workload team
→ possiede molte decisioni locali

architect / principal / tech lead
→ integra sistemi e trade-off

specialist
→ entra sui boundary ad alto rischio

platform
→ rende ripetibili i problemi non differenzianti

fitness / policy
→ automatizza ciò che abbiamo già capito
```

Questo permette all'architect di concentrarsi sulle decisioni che richiedono judgment.

---

## Artefatto persistente

La Architect Capability Map viene salvata anche nel mondo ESI come artifact company-level:

```text
capstone/example-software-industries/ARCHITECT_CAPABILITY_MAP.md
```

È company-level perché queste capacità attraversano tutti i prodotti:

```text
Order Operations
Campaign Launchpad
futuri prodotti Engineering/Mobile/Data/AI
```

Non dipendono da uno specifico stack.

La frase guida dell'artefatto è:

> **L'architect non scala sapendo tutto. Scala costruendo abbastanza comprensione, evidence e guardrail perché il sistema possa prendere buone decisioni anche senza la sua presenza continua.**
