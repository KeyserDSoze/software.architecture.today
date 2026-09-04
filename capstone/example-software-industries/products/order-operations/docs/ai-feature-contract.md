# Order Operations — AI Feature Contract

> **Scenario fittizio ESI.** Baseline introdotta nel Capitolo 24 per la prima capability AI runtime del prodotto.

## Feature

```text
Case Explanation Assistant
```

## Purpose

Aiutare un operatore autorizzato a ricostruire rapidamente un Operational Case distinguendo:

```text
confirmed facts
hypotheses
missing evidence
source references
```

## Outcome

Ridurre il costo cognitivo della comprensione del caso senza trasferire al modello authority su Orders, Payments, Shipping, Priority o remediation.

## Non-goals — v1

Il modello non può:

```text
modify PaymentStatus
approve or execute refund
retry payment
modify Priority
modify OperationalCase
send customer communication
write to enterprise systems
navigate arbitrary external content
```

## Model authority boundary

```text
Authoritative fact
→ authoritative system / deterministic application logic

Model output
→ advisory interpretation only
```

The model may summarize and hypothesize.

It may not create authoritative business truth.

## Authoritative systems

```text
Operational Case business state
→ Order Operations

Order state
→ Orders

Payment/economic state
→ Payments & Risk

Shipment state
→ Shipping

Priority
→ ConfirmedPriorityPolicy / Product-approved functional semantics
```

## Deterministic logic outside model

Keep outside the model when available:

```text
tenant authorization
case age
priority calculation
current owner
retry count
source freshness calculation
source-reference existence
schema validation
```

## Context sources — v1

```text
authorized OperationalCase view
authorized Orders support view
authorized Payments support view
authorized Shipping support view
deterministic derived facts
```

## Retrieval strategy — v1

```text
deterministic context assembly
```

No vector database, embedding pipeline or semantic retrieval is required by the current use case.

### Review trigger

Reconsider retrieval strategy if the feature must consume a large corpus of runbooks, knowledge articles, incident histories or cross-case content that cannot be addressed deterministically.

## Authorization boundary

Authorization happens **before** context acquisition.

```text
operator identity
→ tenant/resource authorization
→ retrieve only allowed sources
→ minimize context
→ model
```

The model is not an authorization engine.

## Freshness

Each material source should carry enough metadata to distinguish:

```text
source observed time
context acquisition time
answer generation time
```

The assistant must not silently present stale evidence as current truth.

## Untrusted content classification

Free-text fields from users, customers, documents or external systems are treated as **data**, never as instruction.

```text
trusted policy/instruction
≠
retrieved or user-controlled text
```

## Tool set — v1

```text
No write tools.
No arbitrary browsing.
No secret-access tool.
```

Context acquisition is performed by deterministic application services before the model call.

## Input contract

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

Material facts carry source/provenance metadata.

## Output contract

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

## Grounding rules

1. Material confirmed facts must have supporting source references.
2. Hypotheses must not be represented as confirmed facts.
3. Missing evidence must remain visible.
4. A source reference must exist in the authorized input context.
5. No output may create a new authoritative Payment/Order/Shipping fact.
6. No output may approve or execute a business action.

## Structured output

A provider adapter should use a schema-constrained output mechanism when supported.

Schema-valid does not imply semantically grounded.

Application validation remains required.

## Fallback

### Provider unavailable / timeout

```text
assistant status = Unavailable
core Operational Case view remains available
```

### Insufficient source evidence

```text
status = InsufficientEvidence or PartiallySupported
missingEvidence is explicit
```

### Invalid model output

```text
one bounded repair attempt maximum by default
→ then fallback
```

### Security rejection

```text
block result
record security signal
no unsafe fallback that broadens access
```

## Reliability relationship

Case Explanation Assistant is not part of the current critical path for loading the Operational Case view.

```text
AI feature unavailable
≠
Order Operations core unavailable
```

No production SLO is invented yet. Establish a baseline from real execution before setting a target.

## Security controls

```text
authorization before retrieval
tenant isolation
context minimization
instruction/data separation
no write tool in v1
no production secret in context
output validation
safe UI rendering
prompt-injection eval cases
security telemetry
```

Relevant artifacts:

```text
docs/threat-model.md
docs/security-control-matrix.md
docs/ai-autonomy-matrix.md
```

## Evaluation plan

Versioned dataset:

```text
evals/case-explanation-v1.jsonl
```

Initial risk classes:

```text
nominal
missing evidence
conflicting evidence
prompt injection
cross-tenant request
authority boundary violation
ambiguity
```

Candidate metrics:

```text
groundedness
critical-claim support
fact/hypothesis separation
missing-evidence honesty
source-reference validity
forbidden-authority violation
prompt-injection resistance
operator usefulness
latency
cost
```

No model quality score is currently claimed because no provider adapter has been executed against this dataset.

## Critical failure classes

```text
Critical
- cross-tenant disclosure
- unauthorized economic/business action
- generated authoritative business fact that contradicts source ownership
- prompt injection reaching a dangerous sink

Major
- unsupported critical fact
- missing evidence hidden
- invalid source attribution
```

Release thresholds are **Pending** until a first baseline exists.

## Observability

Candidate events:

```text
case_explanation.request
case_explanation.completed
case_explanation.unavailable
case_explanation.insufficient_evidence
case_explanation.invalid_output
case_explanation.security_rejected
```

Bounded dimensions:

```text
modelRoute
resultStatus
failureClass
promptVersion
contextBuilderVersion
```

Do not use `caseId`, `operatorId`, raw prompt or raw source content as metric dimensions.

## Configuration identity

Evaluation/runtime evidence must identify at least:

```text
provider/model route
model/deployment version
system instruction version
context builder version
output schema version
tool set
safety configuration
```

## Cost model

Candidate cost drivers:

```text
input/output tokens
model route
context size
retry
provider invocation
future retrieval/tool calls
human quality review
```

Candidate unit metrics:

```text
cost per accepted Case Explanation
cost per explanation without critical eval finding
operator handling time saved per explanation
```

No production values are available.

## Owners

```text
Product behavior / user outcome
→ Commerce & Operations

Payment semantic authority
→ Payments & Risk

Workload security
→ Commerce & Operations + Security

AI platform/provider policy
→ Platform Engineering / future AI platform ownership

Cost review
→ Commerce & Operations + FinOps
```

## Current state

```text
AI Feature Contract                    Codified
CaseExplanation domain contract        Codified
Deterministic result validation        Codified
Deterministic context builder          Designed / Pending implementation
Provider/model adapter                 Pending
Model/provider decision                Pending eval comparison
Eval dataset                           Codified (EVAL-001..EVAL-008 seed)
Eval execution                         Pending
Production runtime                     Not deployed
Write tools                            Not authorized
RAG/vector retrieval                   Not selected / not required in v1
```

## Review triggers

Reopen this contract when:

1. a write/action tool is proposed;
2. a broad document corpus enters the context path;
3. a new sensitive data source is added;
4. cross-case analysis is introduced;
5. the assistant becomes part of a critical journey;
6. provider/model changes materially;
7. eval or runtime evidence exposes a new failure class;
8. cost/latency becomes material;
9. output starts influencing automated downstream decisions;
10. regulation/policy changes the acceptable AI risk boundary.

> **Il modello può aiutare a comprendere il caso. Non diventa per questo il proprietario del caso, dei dati o delle decisioni.**