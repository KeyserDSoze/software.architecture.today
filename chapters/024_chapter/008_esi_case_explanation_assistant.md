# 24.8 — ESI: Case Explanation Assistant

È il momento di far entrare davvero l'AI dentro Order Operations.

Non con una demo separata.

Dentro l'architettura esistente.

## Il problema

Un operatore apre un caso problematico.

Oggi deve leggere:

- Operational Case;
- stato ordine;
- ultimi segnali Payments;
- stato Shipping;
- Payment Escalation;
- eventuali failure di integrazione;
- informazioni operative presenti nella console.

L'operatore deve poi ricostruire mentalmente una timeline.

Il lavoro è ripetitivo ma non interamente deterministico: capire quali fatti sono rilevanti e come spiegarli in linguaggio naturale è un buon candidato per una capability generativa.

## Outcome

La prima versione deve aiutare l'operatore a rispondere più velocemente a:

> Che cosa sappiamo, che cosa sembra essere successo e che cosa ci manca ancora per capirlo?

Non deve rispondere a:

> Quale azione economica dobbiamo eseguire?

## Il flow

```text
Operator
   ↓
Order Operations API
   ↓
Authorization / tenant boundary
   ↓
CaseExplanationContextBuilder
   ├── OperationalCase
   ├── Orders support view
   ├── Payments support view
   ├── Shipping support view
   └── deterministic derived facts
   ↓
CaseExplanationPort
   ↓
Model adapter
   ↓
structured output validation
   ↓
source-reference validation
   ↓
CaseExplanationResult
   ↓
Operator UI
```

Il model provider resta dietro `CaseExplanationPort`.

## V1 non usa RAG

La scelta è esplicita:

```text
retrieval strategy
= deterministic context assembly
```

Ragione:

```text
sources known
+ structured
+ bounded per case
+ existing authorization paths
```

Non introduciamo ancora:

```text
embedding model
vector database
chunking pipeline
semantic retrieval
```

Review trigger:

> l'assistant deve usare un corpus ampio di runbook, knowledge article o incidenti storici non deterministically addressable.

## V1 non usa tool di scrittura

```text
Allowed
- read authorized case context
- generate explanation

Forbidden
- retry payment
- refund
- modify Priority
- modify case
- send message
- navigate external web
- access arbitrary enterprise data
```

Questa scelta riduce il valore massimo teorico della feature.

Riduce anche drasticamente il blast radius.

## Il contratto semantico

Input normalizzato:

```text
CaseExplanationContext

caseId
tenantId
observedAt
operationalCase
orderFacts
paymentFacts
shippingFacts
derivedFacts
```

Ogni fact importante conserva almeno:

```text
source
observedAt
reference
```

Output:

```text
CaseExplanationResult

status:
  Supported
  PartiallySupported
  InsufficientEvidence
  Unavailable

summary
confirmedFacts[]
hypotheses[]
missingEvidence[]
sourceReferences[]
```

## Regola fact / hypothesis

Un `confirmedFact` deve poter essere ricondotto a una source autorizzata.

Una `hypothesis` deve essere presentata esplicitamente come interpretazione.

Esempio accettabile:

```text
Confirmed fact
L'ultimo tentativo di pagamento osservato è fallito.
Source: payments-attempt-123
```

```text
Hypothesis
Il caso potrebbe essere in attesa di un retry o di una verifica manuale.
```

Esempio non accettabile:

```text
Il pagamento è definitivamente fallito e va rimborsato.
```

se nessuna source sostiene entrambe le conclusioni.

## Missing evidence è una feature

Se Payments è temporaneamente indisponibile:

```text
status = PartiallySupported
missingEvidence += Payments current support view
```

oppure:

```text
status = InsufficientEvidence
```

se quella source è necessaria per rispondere alla domanda.

Non chiediamo al modello di “fare del suo meglio” usando conoscenza generale.

Nel nostro workload:

> **ammettere che manca evidence è comportamento corretto.**

## Failure isolation

Se il model provider è down:

```text
Case Explanation Assistant
→ Unavailable
```

ma:

```text
Operational Case view
→ remains available
```

La feature AI non entra nel critical path della lettura operativa di base.

## Security model

### Authorization

Il context builder riceve soltanto dati già autorizzati per l'operatore e tenant correnti.

### Data minimization

Non inviamo interi aggregate se bastano i campi necessari alla spiegazione.

### Untrusted text

Note/operator/customer text vengono marcate come dati, non come instruction.

### Secret

Nessun secret nel context.

### Tool

Nessun write tool in v1.

### Rendering

Output Markdown/HTML, se introdotto, deve essere sanitizzato prima della UI.

## Reliability

Il primo AI runtime target non riceve ancora un SLO numerico inventato.

Definiamo però la relazione col prodotto:

```text
AI unavailable
≠
core Order Operations unavailable
```

E misureremo:

```text
latency
provider error
invalid output
fallback
InsufficientEvidence
```

prima di fissare target di produzione.

## Observability

Nuovi signal candidati:

```text
case_explanation.request
case_explanation.completed
case_explanation.unavailable
case_explanation.insufficient_evidence
case_explanation.invalid_output
case_explanation.security_rejected
```

Dimensioni bounded:

```text
modelRoute
resultStatus
failureClass
promptVersion
contextBuilderVersion
```

Non metric dimensions:

```text
caseId
operatorId
raw prompt
raw source text
```

I correlation identifier possono vivere nei trace/log appropriati secondo privacy policy.

## Evaluation

Il dataset iniziale deve includere almeno:

```text
EVAL-001 clear nominal case
EVAL-002 missing Payments evidence
EVAL-003 conflicting timeline
EVAL-004 customer note with prompt injection
EVAL-005 cross-tenant request
EVAL-006 request to decide refund
EVAL-007 request to override Priority
EVAL-008 ambiguous multi-cause case
```

Ogni case dichiara:

```text
required facts
forbidden claims
required missing-evidence behavior
required source references
severity of failure
```

Il dataset entra nel repository, ma finché non esiste un model adapter eseguibile non dichiariamo un eval score.

## Model/provider choice

Non la prendiamo ancora.

Abbiamo abbastanza informazioni per definire il boundary.

Non abbiamo ancora:

- baseline di qualità su più modelli;
- latency comparison;
- provider cost comparison;
- privacy/security decision finale;
- adapter implementation.

Quindi il provider resta una **two-way door** da testare con eval.

È una decisione intenzionale.

> **Prima definiamo che cosa deve fare la feature. Poi confrontiamo i modelli su quella feature.**

## Il compromesso ESI

```text
Product / Operations
→ vuole spiegazioni veloci e naturali

Payments & Risk
→ vuole preservare semantic authority

Security
→ vuole minimizzare data/tool blast radius

Platform
→ vuole evitare provider coupling diffuso

Finance
→ vuole costo misurabile per useful outcome
```

Decisione:

```text
read-only assistant
+ deterministic grounding
+ structured source-backed output
+ no write tool
+ provider behind port
+ explicit fallback
+ eval before rollout
```

Costo accettato:

- meno automazione;
- nessun remediation agent;
- nessun RAG su knowledge base al primo slice;
- possibilità di risposta `InsufficientEvidence`.

Quality floor:

- ownership;
- tenant isolation;
- source provenance;
- no hidden economic decision;
- core journey indipendente dal model provider.

## Review trigger

Riapriamo la decisione se:

1. Product richiede action tool;
2. entra un corpus documentale ampio;
3. l'operatore chiede cross-case analysis;
4. eval dimostrano che deterministic context è insufficiente;
5. latency/cost non sono accettabili;
6. provider/model drift cambia la quality baseline;
7. una nuova source contiene dati più sensibili;
8. l'assistant diventa parte del critical journey.

La feature nasce quindi volutamente stretta.

Non perché l'AI sia poco capace.

Perché l'architettura deve permetterci di aumentare il potere **solo dopo aver aumentato anche evidence e controlli**.