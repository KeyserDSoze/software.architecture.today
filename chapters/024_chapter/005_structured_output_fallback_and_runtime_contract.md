# 24.5 — Structured output, fallback e runtime contract

Una feature AI runtime non può avere come unica interfaccia:

```text
string → string
```

Non perché il testo libero sia sempre sbagliato.

Ma perché un sistema software deve poter distinguere ciò che è presentabile, ciò che è verificabile e ciò che deve essere rifiutato.

## Il contratto di output

Per Case Explanation Assistant definiamo un risultato strutturato:

```text
CaseExplanationResult

status
summary
confirmedFacts[]
hypotheses[]
missingEvidence[]
sourceReferences[]
```

`status` può assumere, per il primo slice:

```text
Supported
PartiallySupported
InsufficientEvidence
Unavailable
```

Questi stati non misurano “quanto il modello è intelligente”.

Descrivono la relazione fra output e evidence disponibile.

## Validazione a più livelli

Un output può fallire in modi differenti.

### 1. Syntax / schema failure

```text
campo mancante
wrong type
invalid enum
malformed JSON
```

Questa classe può essere gestita con output strutturato, schema validation e bounded retry.

### 2. Referential failure

```text
sourceReference cita una source che non esiste
```

Deterministically reject.

### 3. Authorization failure

```text
sourceReference punta a evidence non autorizzata per l'utente
```

Deterministically reject e trattare come security signal.

### 4. Grounding failure

```text
claim presente
ma nessuna source lo sostiene
```

Richiede eval e, per alcune classi di claim, controlli automatici più forti.

### 5. Semantic authority failure

```text
output propone come fact un'inferenza
oppure decide un PaymentStatus
```

Il product boundary deve impedirlo.

## Bounded retry

Se il provider restituisce un output non valido possiamo fare retry.

Ma, come nei sistemi distribuiti, retry non significa:

```text
while (!valid) callModelAgain();
```

Serve un budget.

Per esempio:

```text
initial call
+ 1 schema-repair attempt
→ fallback
```

Un retry aggiunge:

- latency;
- cost;
- load;
- nuova variabilità.

Dobbiamo quindi distinguere:

```text
recoverable format failure
≠
missing business evidence
```

Se manca il contesto necessario, chiedere al modello altre cinque volte non crea evidence.

## Fallback come parte dell'architettura

Una feature generativa viene spesso progettata soltanto sul happy path:

```text
prompt
→ answer
```

Ma il fallback deve essere definito prima.

Per ESI:

```text
model/provider timeout
→ assistant unavailable
→ operator continua con current operational view
```

```text
insufficient evidence
→ mostra missing evidence
→ nessuna spiegazione inventata
```

```text
invalid output after bounded retry
→ no generated explanation
→ telemetry + fallback UI
```

```text
security policy failure
→ block
→ audit/security signal
```

Il core product journey quindi non dipende dal fatto che l'LLM risponda sempre.

> **Una feature AI opzionale deve poter fallire senza trascinare con sé il prodotto che dovrebbe assistere.**

## Graceful degradation

Questo collega direttamente il Capitolo 24 al Reliability Contract.

Possiamo descrivere lo stato:

```text
Order Operations core journey = Healthy
Case Explanation Assistant = Degraded
```

L'operatore perde una accelerazione cognitiva.

Non perde l'accesso ai fatti autorevoli.

Questo è un esempio di failure isolation applicato a una capability AI.

## Latency budget

Un modello può avere latency molto diversa da una query tradizionale.

Dobbiamo decidere se la feature è:

```text
blocking
streaming
async
precomputed
on-demand
```

Per il primo slice ESI scegliamo **on-demand**.

L'operatore apre un caso e richiede esplicitamente la spiegazione.

Non blocchiamo il caricamento dell'Operational Case in attesa del modello.

Quindi:

```text
core operational view
→ deterministic / existing path

explanation
→ secondary async UI action
```

Questa scelta riduce il coupling di availability e latency.

## Cost budget

Il Cost Model deve evolvere.

Una invocation AI può avere cost driver come:

```text
input tokens
output tokens
model class
retrieval calls
tool calls
retry
cache
embedding/index cost
human verification
```

Ma il business metric utile non è:

```text
cost per 1M tokens
```

È più vicino a:

```text
cost per accepted Case Explanation
cost per case handling minute saved
cost per explanation with no critical eval finding
```

Non abbiamo ancora production data ESI.

Quindi queste metriche restano `Designed`.

## Prompt e model configuration sono versioned runtime artifacts

La feature dipende da più di un model name.

La configuration reale include almeno:

```text
model/provider
model version/deployment
system instruction version
context builder version
output schema version
tool set
sampling/reasoning configuration
safety policy
```

Una evaluation deve poter dire **quale configurazione** è stata testata.

NIST AI RMF Generative AI Profile insiste sull'idea di gestire il rischio lungo il lifecycle del sistema e rispetto al contesto d'uso, non come proprietà isolata del modello.  
Fonte: [NIST AI 600-1](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence).

OpenAI ha inoltre sottolineato nelle proprie raccomandazioni sulle evaluation che harness, tool, budget, scorer e configurazione del sistema influenzano il risultato dell'assessment, non soltanto il modello.  
Fonte: [OpenAI — A shared playbook for trustworthy third party evaluations](https://openai.com/index/trustworthy-third-party-evaluations-foundations/).

## Model upgrade non è una dependency bump normale

Se cambiamo:

```text
model-v1
→ model-v2
```

non basta chiedere:

> compila?

Serve almeno:

```text
regression eval
security eval
latency/cost comparison
schema compliance
behavioral review
```

La ragione è semplice:

> **Un model upgrade può cambiare comportamento senza cambiare una singola riga del nostro domain code.**

Questa è una nuova forma di dependency risk.

## AI Feature Contract

Per rendere tutto questo persistente introduciamo un nuovo artefatto:

```text
AI Feature Contract
```

Campi principali:

```text
Purpose
Users
Outcome
Non-goals
Model authority boundary
Context sources
Retrieval strategy
Tool/permission boundary
Input classification
Output schema
Grounding rules
Fallback
Latency/reliability target
Security controls
Evaluation plan
Observability
Cost model
Owners
Review triggers
```

Non è una checklist obbligatoria per ogni chiamata a un modello.

È un artefatto utile quando una capability AI entra nel comportamento del prodotto.

## La regola

> **Non progettare soltanto come ottenere una risposta dal modello. Progetta che cosa farà il sistema quando la risposta è incompleta, invalida, lenta, costosa o semplicemente sbagliata.**