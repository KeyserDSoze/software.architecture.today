# Security, reliability, data, observability e AI readiness

La Production Readiness Review non deve riscrivere tutti i capitoli precedenti.

Deve però verificare che le proprietà più importanti abbiano **evidence coerente con il launch boundary**.

Il rischio più comune è una review piatta:

```text
Security      check
Reliability   check
Data          check
Monitoring    check
AI            check
```

Ogni parola verde nasconde decine di claim diversi.

Meglio chiedere:

> **quale failure stiamo cercando di evitare, quale evidence abbiamo e quale limite resta?**

---

# Functional readiness

Prima di tutto il prodotto deve fare ciò che promette.

Domande:

```text
Are target actors explicit?
Are critical journeys understood?
Are business rules confirmed?
Are out-of-scope and disabled features visible?
Are error/edge states understood?
Are acceptance properties covered by evidence?
```

Qui torna l'analisi funzionale come competenza condivisa.

Un sistema non è production-ready se soltanto il Product Owner sa cosa significa una risposta corretta e il team non riesce a riconoscere una regressione semantica.

---

# Data readiness

Per i dati dobbiamo evitare domande troppo generiche come:

> il database è pronto?

Meglio:

```text
Who owns each authoritative fact?
Which schema/migrations are required?
Are migrations repeatable/validated?
Are transaction invariants verified on the real datastore?
What is backed up?
What is excluded?
How is restore verified?
What is the retention policy?
What is the recovery point?
```

Per Order Operations il punto più evidente resta:

```text
PaymentEscalation + OutboxMessage atomicity
```

Finché `OO-001` non produce evidence su PostgreSQL reale, quella property non è verificata al boundary corretto.

---

# Security readiness

Security readiness non significa:

```text
Threat Model exists
```

Serve verificare almeno i controlli che il launch boundary considera non negoziabili.

Per ESI:

```text
authentication
server-side authorization
tenant isolation
private ingress/data-plane direction
runtime/deployment identity separation
least privilege
secret handling
audit/security signals
```

Domande importanti:

```text
Have negative tests been executed?
Can the wrong tenant read a case?
Can runtime identity administer infrastructure?
Can public network reach the private service?
Can support staff get safe incident access?
Can credentials be revoked?
```

Il Threat Model ci dice **che cosa temiamo**.

La readiness deve mostrare **quali controlli abbiamo realmente dimostrato**.

---

# Reliability readiness

Il Reliability Contract contiene SLO, health model, RTO/RPO e degraded mode.

Il PRR deve verificare:

```text
capacity evidence
failure containment
backup policy
restore evidence
failover evidence
dependency degradation behavior
retry/backpressure behavior
health signaling
```

Una regola fondamentale:

> **backup configured non significa recovery ready.**

Se il launch boundary promette un recovery target, almeno uno scenario rappresentativo deve essere stato esercitato con tempi reali.

---

# Observability readiness

La domanda non è:

> abbiamo dashboard?

È:

> durante i failure che abbiamo dichiarato importanti, sapremo riconoscere l'impatto e produrre una prima azione utile?

Evidence:

```text
known request emits expected signal
forced failure emits expected signal
SLI query returns expected classification
alert reaches intended owner
runbook/context is reachable
telemetry pipeline failure is distinguishable from zero traffic
```

Il sistema può essere perfettamente funzionante ma operativamente cieco.

In quel caso non è davvero ready per una promessa che richiede supporto rapido.

---

# Capacity readiness

Capacity è una delle domande più vecchie delle launch checklist e resta attuale.

Google SRE include storicamente volume estimate, spike, load test e impatto su altri service nelle proprie launch questions.

- [Google SRE — Launch Coordination Checklist](https://sre.google/sre-book/launch-checklist/)

Non serve sempre un enorme load test.

Serve evidence proporzionata:

```text
expected load
headroom
known bottleneck
scaling mechanism
backpressure behavior
cost consequence
```

Per un pilot interno piccolo può bastare molto meno che per un public API globale.

Ma:

```text
we do not know expected load
```

è comunque un dato di readiness da dichiarare.

---

# Dependency readiness

Ogni critical dependency dovrebbe avere almeno:

```text
owner
failure behavior
timeout/retry behavior
degradation/fallback
observability
support/escalation path
```

Per esempio:

```text
Payments consumer unavailable
→ escalation remains durable locally
→ outbox/backlog visible
→ operator does not receive false “processed” state
```

Questo è molto più utile di:

> Service Bus is highly available.

La readiness riguarda il **nostro comportamento quando la dipendenza non fa ciò che speravamo**.

---

# AI production readiness

Quando un modello entra nel runtime, una nuova serie di claim entra nel PRR.

Non basta:

```text
AI Feature Contract exists
```

Dobbiamo distinguere almeno:

```text
Model authority
Context authorization
Groundedness
Missing-evidence behavior
Prompt-injection behavior
Output validation
Provider data handling
Latency
Cost
Fallback
Operator usefulness
Model/version provenance
```

Per il Case Explanation Assistant abbiamo già fatto una scelta prudente:

```text
read-only
no write tools
provider-neutral semantic contract
versioned eval seed
```

Ma oggi mancano ancora:

```text
real provider/model execution
real eval results
latency distribution
cost per explanation
security/provider review
operator usefulness evidence
runtime monitoring
```

Quindi:

> **il core workload potrebbe avvicinarsi al launch mentre la capability AI resta disabilitata.**

Questa è una decisione architetturale e product-wise sana.

Non serve trascinare una feature probabilistica non pronta dentro un launch altrimenti supportabile.

---

# AI fallback readiness

Per una feature AI dobbiamo sapere anche cosa succede quando:

```text
model unavailable
provider rate-limited
output invalid
missing evidence
injection suspected
latency exceeds budget
eval regression discovered
```

Per la V1 ESI il fallback può essere:

```text
assistant unavailable
→ operator continues with deterministic operational view
```

Questo è un vantaggio importante del fatto che l'AI non è authority.

Se l'intero critical journey dipendesse dal modello, il readiness bar sarebbe molto più alto.

---

# Cost readiness

Non dobbiamo conoscere ogni euro prima del launch.

Ma dobbiamo evitare:

```text
unknown cost shape
+ unbounded scaling
+ no owner
```

Domande:

```text
Can we attribute workload cost?
What are the major premiums?
Which costs scale with traffic?
Are telemetry/model costs bounded?
Is there an anomaly path?
What unit metric will we use after launch?
```

Per AI in particolare:

```text
cost per token
```

è diagnostico.

Più utile sarà:

```text
cost per useful / accepted explanation
```

quando avremo production data.

---

# Continuity readiness

Il Capitolo 25 aggiunge un'altra dimensione:

> se l'accountable lead non è disponibile, il sistema può essere operato e cambiato in sicurezza?

Il PRR deve includere:

```text
secondary maintainer
repository navigation
runbooks
access
open work/risk understanding
golden commands
specialist escalation paths
```

Il continuity drill è particolarmente importante per il pilot One-Man Project.

Un repository perfettamente documentato non basta finché nessuno ha provato davvero a usarlo senza l'autore principale.

---

# Non serve la stessa evidence per ogni launch

La review deve essere risk-based.

Esempio:

```text
Internal read-only pilot
```

può richiedere un livello diverso di capacity/DR evidence rispetto a:

```text
24x7 payment-processing public system
```

Ma il principio resta:

> **la severità del gate può cambiare; la trasparenza sul rischio no.**

---

# Production Readiness come convergenza

Alla fine quasi tutto il libro converge qui:

```text
Problem / Functional Analysis
→ what are we promising?

Architecture / Contracts / Data
→ what must stay true?

Failure / Security / Reliability
→ how can it break?

Observability / Testing
→ how do we know?

Cost
→ what does it cost to keep that promise?

Agent governance / One-Man Project
→ who controls the execution and continuity?

AI Feature Contract
→ what may the model know, claim and do?
```

La Production Readiness Review non è quindi un capitolo aggiunto alla fine.

È il punto in cui il libro dimostra se tutte le decisioni precedenti **formano davvero un sistema governabile**.
