# 28.3 — Profondità tecnica senza culto dell'implementazione

C'è un'altra caricatura dell'architect che dobbiamo evitare.

Quella della persona che non apre più un repository da anni ma continua a prendere decisioni dettagliate su:

```text
framework
runtime
threading
ORM
queue
schema
networking
AI SDK
```

basandosi su diagrammi e slide.

L'estremo opposto non è migliore:

```text
architect
= developer più senior
che scrive più codice degli altri
```

L'architect del 2030 deve restare **tecnicamente credibile**, ma la sua profondità non si misura soltanto dal numero di commit.

Si misura dalla capacità di scendere abbastanza in profondità da capire se un'astrazione, una proposta o un output AI reggono davvero.

> **Non devi implementare tutto. Devi saper riconoscere quando l'implementazione invalida il modello mentale con cui stai decidendo.**

---

## Code literacy

Un architect dovrebbe saper leggere codice con sufficiente fluidità da:

- seguire un critical flow;
- trovare dove vive una business rule;
- riconoscere una dipendenza nascosta;
- capire se un boundary documentato esiste davvero;
- leggere un test e capire quale property protegge;
- distinguere orchestration da domain logic;
- leggere una migration;
- capire dove vengono applicati auth e authorization;
- individuare provider coupling;
- verificare se l'AI ha introdotto accidental complexity.

Questo non richiede essere il contributor più veloce del repository.

Richiede non delegare completamente la realtà del sistema a chi produce il codice.

Nel nostro capstone, per esempio, un architect non dovrebbe limitarsi a sapere che esiste un outbox.

Dovrebbe poter leggere abbastanza codice e migration da capire:

```text
PaymentEscalation
+ OutboxMessage
→ stessa transaction boundary?

publisher
→ stable message identity?

retry
→ bounded?

failure after broker publish
→ possible republish understood?
```

Se non può farlo direttamente, deve almeno sapere costruire una verifica che lo dimostri.

---

## Runtime literacy

Il codice non è l'unica realtà tecnica.

L'architect deve saper interrogare anche il runtime.

Per esempio:

```text
SLI
trace
log strutturato
queue depth
connection pool
CPU/memory saturation
DB query plan
retry rate
error-budget burn
cloud bill
```

Non deve essere l'on-call engineer più esperto.

Ma deve sapere quali segnali possono falsificare le assunzioni dell'architettura.

Se abbiamo deciso:

```text
queue
→ assorbe burst
```

l'architect deve sapere chiedere:

```text
quanto cresce il backlog?
quanto tempo impiega a drenare?
quale consumer throughput osserviamo?
quando il burst diventa overload persistente?
```

Se abbiamo deciso:

```text
cache
→ riduce latency
```

dobbiamo anche chiederci:

```text
hit ratio?
staleness?
invalidazioni?
stampede?
costo?
```

La capacità di interrogare queste evidenze impedisce che l'architecture resti una teoria non falsificabile.

---

## Infrastructure literacy

Cloud Architecture ha reso più facile creare risorse.

L'AI rende ancora più facile generare IaC.

Per questo l'architect deve essere in grado almeno di leggere:

```text
Terraform / Bicep / CloudFormation
IAM / RBAC
network boundary
load balancer / ingress
DNS
secret reference
resource sizing
HA configuration
backup/recovery setting
```

Non deve ricordare ogni property di ogni provider.

Anzi, non dovrebbe fidarsi della memoria per dettagli volatili.

Deve invece saper distinguere:

```text
intent
→ ciò che vogliamo ottenere

mechanism
→ come il provider lo esprime oggi

evidence
→ come verifichiamo che il mechanism produca davvero l'intent
```

Questa distinzione diventa essenziale quando un agente genera template plausibili ma non ancora validati.

---

## Data literacy

Molte decisioni architetturali falliscono perché si parla di componenti senza capire i dati.

Un architect deve saper ragionare almeno su:

```text
schema
ownership
invariant
transaction
isolation
index
query/access pattern
replication
partitioning
migration
retention
lineage
```

Non serve essere DBA per riconoscere che:

```text
shared database
```

non significa automaticamente:

```text
shared ownership
```

oppure che:

```text
eventually consistent
```

non è una property abbastanza precisa finché non sappiamo **quale fatto può essere stale, per chi e per quanto**.

---

## AI literacy

Nel 2030 sarà difficile essere tecnicamente credibili ignorando il comportamento dei sistemi AI.

Ma anche qui dobbiamo distinguere capacità utile da catalogo di buzzword.

Un architect dovrebbe capire almeno:

```text
model boundary
context window
retrieval / grounding
structured output
tool permission
prompt injection
model/provider drift
evaluation
latency distribution
cost driver
fallback
```

Non deve addestrare un foundation model.

Deve saper decidere, per esempio, se:

```text
RAG
```

risolve davvero il problema o se stiamo aggiungendo retrieval infrastructure senza un corpus che lo richieda.

Deve sapere che:

```text
valid JSON
≠
correct answer
```

E che:

```text
model benchmark improved
≠
workload eval passed
```

Questa è technical literacy applicata al rischio reale del sistema.

---

## Essere hands-on, ma con intenzione

Scrivere codice resta uno dei modi migliori per mantenere technical depth.

Ma l'obiettivo non è accumulare commit.

L'architect dovrebbe scegliere attività hands-on ad alto learning value.

Per esempio:

```text
spike su componente rischioso
prototype di un boundary
architecture fitness test
migration rehearsal
failure injection
performance experiment
security negative test
AI eval harness
```

Microsoft Well-Architected raccomanda esplicitamente di validare le assunzioni critiche con POC e codice funzionante prima di finalizzare design ad alto rischio.

Fonte:

- Microsoft Learn — *Solution Architect's Responsibilities and Guiding Principles*: https://learn.microsoft.com/en-us/azure/well-architected/architect-role/fundamentals

Questo è diverso da dire:

> “L'architect deve implementare tutte le feature importanti.”

La domanda è:

> **Dove un esperimento tecnico riduce abbastanza incertezza da cambiare la qualità della decisione?**

---

## Il rischio del deskilling tecnico

L'AI può produrre rapidamente:

```text
SQL
regex
Bicep
Kubernetes YAML
API client
unit test
```

Se accettiamo continuamente questi output senza comprenderli, la nostra capacità di giudizio può diminuire proprio mentre aumenta la nostra capacità di produrre.

Questo è particolarmente pericoloso per un architect.

Perché il suo valore dipende dal riconoscere:

- coupling;
- failure mode;
- assumption nascosta;
- security boundary;
- cost implication;
- semantic mismatch.

Quindi alcune attività devono essere deliberatamente svolte per mantenere skill.

Per esempio:

```text
prima spiegare il problema
poi chiedere all'AI una soluzione

prima fare una previsione
poi confrontarla con l'output

prima leggere una parte del codice
poi usare l'AI per accelerare la discovery

prima definire l'invariant
poi generare test
```

Non perché dobbiamo fare tutto più lentamente.

Perché:

> **Se deleghiamo anche la capacità di riconoscere gli errori, perdiamo il diritto di delegare l'esecuzione.**

---

## Profondità a T, ma dinamica

La metafora della T-shaped skill resta utile, ma va aggiornata.

L'architect del 2030 può essere pensato come:

```text
ampiezza
business / functional / systems / cloud / security / operations / economics / AI

+

1–2 aree di profondità forte

+

capacità di scendere temporaneamente più in profondità
quando una decisione lo richiede
```

La profondità non è necessariamente permanente nello stesso stack.

Può cambiare nel tempo.

Un architect può avere una base forte in backend/distributed systems e sviluppare temporaneamente maggiore depth in AI evaluation perché il portfolio lo richiede.

Oppure in security.

Oppure in data platform.

La regola ESI non è:

```text
architect deve sapere tutto
```

È:

```text
architect deve sapere abbastanza
per riconoscere dove non sa abbastanza
```

Questa è una forma di competenza molto più difficile da automatizzare di quanto sembri.

> **La profondità tecnica dell'architect non serve a vincere una gara di implementazione. Serve a mantenere il judgment ancorato alla realtà.**
