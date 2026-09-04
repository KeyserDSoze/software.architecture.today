# 24.9 — Esercizi, autovalutazione e sintesi

## Dieci idee da portarsi dietro

1. **Un modello runtime è una dipendenza architetturale, non soltanto una API.**
2. **Il modello può interpretare; il sistema decide ciò che è vero e autorizzato.**
3. **Deterministic logic resta fuori dal modello quando possiamo esprimerla in modo affidabile.**
4. **Grounding è un requisito; RAG è una possibile soluzione.**
5. **Authorization deve avvenire prima del retrieval, non essere affidata alla discrezione del modello.**
6. **Prompt injection diventa più pericolosa quando un modello possiede sink potenti.**
7. **Structured output riduce failure di formato, non garantisce semantic correctness.**
8. **Fallback, eval, latency, cost e drift fanno parte della feature AI tanto quanto il prompt.**
9. **Model upgrade richiede behavioral regression evidence.**
10. **Aumentare tool e autonomia richiede aumentare contemporaneamente permission control, eval e observability.**

## Esercizio 1 — Trova il model boundary

Considera questa feature:

> Un assistant riceve una richiesta cliente e suggerisce all'operatore se concedere un rimborso.

Dividi l'output in:

```text
Fact
Derived Fact
Model Interpretation
Authorized Action
```

Individua almeno tre informazioni che devono essere determinate fuori dal modello.

Poi rispondi:

> Il modello deve poter eseguire il refund?

Non basta dire sì o no.

Definisci quali nuove evidence e control servirebbero per cambiare la risposta.

## Esercizio 2 — RAG o no?

Per ciascun caso scegli una prima retrieval strategy e giustificala:

1. spiegare un singolo ordine usando quattro API note;
2. rispondere su 50.000 runbook interni;
3. recuperare la policy fiscale vigente per un paese;
4. trovare casi storici semanticamente simili;
5. mostrare il current PaymentStatus autorevole.

Alternative possibili:

```text
direct API lookup
SQL/query
keyword search
vector search
hybrid retrieval
no retrieval needed
```

L'obiettivo non è scegliere sempre la stessa tecnologia.

È mostrare il fit.

## Esercizio 3 — Prompt injection threat flow

Disegna:

```text
Source
→ Model
→ Sink
```

per una applicazione AI a tua scelta.

Identifica:

- contenuti controllabili da terzi;
- dati sensibili accessibili;
- tool;
- azioni irreversibili;
- confirmation gate;
- logging;
- kill switch.

Poi prova a rimuovere almeno un sink dal model toolset.

Chiediti:

> quanto rischio abbiamo eliminato senza migliorare di una sola percentuale la capacità del modello di riconoscere prompt injection?

## Esercizio 4 — Structured output

Parti da:

```text
"Spiega questo caso all'operatore."
```

Definisci uno schema che separi:

```text
confirmed facts
hypotheses
missing evidence
sources
status
```

Poi elenca almeno tre output che sarebbero schema-valid ma semanticamente invalidi.

## Esercizio 5 — Fallback

Per una capability AI definisci il comportamento quando:

- provider timeout;
- quota exhausted;
- context source down;
- malformed output;
- prompt injection detection;
- missing evidence;
- model version rollback.

Per ogni failure indica se il journey diventa:

```text
Healthy
Degraded
Unavailable
Blocked for security
```

## Esercizio 6 — Eval set risk-driven

Costruisci dieci eval case senza partire da dieci domande casuali.

Parti invece da:

```text
failure mode
→ input scenario
→ required property
→ forbidden behavior
→ evidence
→ severity
```

Includi almeno:

- nominal;
- missing source;
- conflicting source;
- prompt injection;
- unauthorized request;
- ambiguous case;
- model-authority violation.

## Esercizio 7 — Model upgrade

Immagina che un nuovo modello costi il 40% in meno e sia mediamente più veloce.

Quali gate deve superare prima di sostituire il modello corrente?

Non puoi usare soltanto un benchmark generico del provider.

Definisci:

- workload eval;
- critical security cases;
- latency;
- cost;
- structured-output behavior;
- fallback;
- canary/rollback.

## Esercizio 8 — Cost per useful outcome

Parti da:

```text
$ / 1M token
```

Costruisci una metrica più utile per il business.

Per esempio:

```text
cost per accepted explanation
```

Poi abbinala ad almeno una quality metric, in modo che il sistema non possa “ottimizzare” il costo producendo output peggiori.

## Esercizio 9 — ESI: aggiungiamo i runbook

Product chiede di estendere Case Explanation Assistant con migliaia di runbook e incident note.

Prepara una mini ADR che valuti:

- direct retrieval;
- keyword search;
- vector search;
- hybrid retrieval;
- access control;
- freshness;
- chunking;
- poisoning/injection;
- evaluation;
- cost.

Non scegliere una soluzione finché non hai definito le forze.

## Esercizio 10 — ESI: aggiungiamo il primo write tool

Product chiede:

> Dopo la spiegazione, permettiamo all'assistant di creare una Payment Escalation.

Aggiorna almeno:

```text
AI Feature Contract
Threat Model
AI Autonomy Matrix
API/authorization boundary
Testing Strategy
Observability Contract
Failure Mode Map
```

Definisci:

- chi autorizza;
- se serve conferma;
- idempotenza;
- audit;
- prompt injection blast radius;
- rollback/recovery;
- eval security.

Questo esercizio prepara direttamente i capitoli di production readiness.

---

# Autovalutazione

Dovresti riuscire a rispondere sì a queste domande.

1. So distinguere fact, derived fact, model interpretation e authorized action?
2. So spiegare perché structured output non equivale a semantic correctness?
3. So decidere quando RAG non serve?
4. So distinguere grounding da vector search?
5. So spiegare perché authorization dovrebbe precedere retrieval?
6. So descrivere prompt injection come source/sink problem?
7. So progettare un tool boundary least-privilege?
8. So definire un fallback quando il modello è indisponibile?
9. So costruire un eval set partendo dai failure mode?
10. So distinguere deterministic test, behavioral eval e runtime monitoring?
11. So spiegare perché un model upgrade richiede regression eval?
12. So trattare prompt/context/model/tool configuration come versione del sistema?
13. So definire metriche di cost insieme a metriche di qualità?
14. So spiegare perché un assistant read-only può comunque essere un security risk?
15. So elencare cosa dovrebbe far scattare una review del model/tool boundary?

---

# Artefatto operativo — AI Feature Contract

Il nuovo artifact del capitolo è:

> **AI Feature Contract**

Template:

```text
Feature
Purpose
Users
Outcome
Non-goals

Model authority boundary
Authoritative systems
Deterministic logic outside model

Context sources
Authorization boundary
Retrieval strategy
Freshness
Untrusted-content classification

Tool set
Permission boundary
Human approval triggers

Input contract
Output schema
Grounding/source-reference rules

Fallback
Failure modes
Latency/reliability behavior

Security controls
Prompt-injection model
Data minimization

Evaluation dataset
Metrics
Critical failure classes
Release gate

Observability
Model/prompt/context versions

Cost drivers
Unit economics

Owners
Review triggers
```

Non tutti i campi devono essere enormi.

L'obiettivo è rendere esplicito il comportamento che non vogliamo lasciare alla configurazione del modello.

---

# Che cosa cambia con l'AI

Prima potevamo assumere che una funzione:

```text
input X
→ output Y
```

avesse comportamento principalmente determinato dal nostro codice.

Con una capability generativa abbiamo un nuovo layer:

```text
code
+ model
+ context
+ prompt
+ retrieval
+ tool
+ safety layer
+ provider behavior
```

La superficie di configurazione diventa parte del comportamento.

Questo non rende il software impossibile da governare.

Rende però insufficiente trattare il modello come una black box chiamata da un service class.

## La nuova responsabilità dell'architect

L'architect non deve diventare necessariamente ML researcher.

Deve però saper chiedere:

- dove vive l'autorità?
- quale evidence arriva al modello?
- chi può entrare nel context?
- quali tool possiede?
- quale output viene validato?
- come fallisce?
- che cosa succede quando manca evidence?
- come misuriamo qualità e drift?
- che cosa costa?
- come torniamo indietro?

Sono domande di Software Architecture.

---

# Corollario

> **Non mettere l'AI dentro il sistema chiedendoti soltanto che cosa può fare. Decidi prima che cosa può sapere, che cosa può affermare, che cosa può cambiare e quale evidence deve produrre per meritare più potere.**

Nel prossimo capitolo, **One-Man Project**, allargheremo di nuovo il campo.

Abbiamo ormai un repository AI-ready, work item execution-ready, agent governance e una capability AI runtime progettata.

La domanda diventa:

> **quanto sistema può realisticamente governare una singola persona quando execution, ricerca, review e operazioni possono essere amplificate dagli agenti — e quali nuovi failure mode organizzativi compaiono quando una persona sembra poter fare il lavoro di un intero team?**