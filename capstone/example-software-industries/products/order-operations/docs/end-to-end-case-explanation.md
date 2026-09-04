# Order Operations — End-to-End Decision Trace: Case Explanation Assistant

> **Scenario fittizio ESI.** Vista sintetica del caso AI-native. Il documento canonical resta `ai-feature-contract.md` insieme a eval, Threat Model, Observability Contract, Cost Model e Production Readiness Review.

## Problem

Gli operatori spendono tempo ricostruendo manualmente perché un ordine richiede attenzione, consultando dati e segnali provenienti da più domini.

## Outcome

Ridurre il costo cognitivo dell'investigazione senza trasferire al modello authority su Payment, Priority, remediation o tenant authorization.

## Functional scope

```text
authorized case context
→ AI explanation
→ confirmed facts
+ hypotheses
+ missing evidence
+ source references
```

## Owners

```text
Orders
→ Order facts

Payments & Risk
→ Payment facts/economic authority

Shipping
→ Shipping facts

Order Operations
→ Operational Case context

Model
→ advisory interpretation only
```

## Quality floor

```text
model interpretation ≠ authoritative fact
cross-tenant isolation
source provenance
explicit missing evidence
core product usable without model
no write/remediation tools in v1
```

## Key trade-off

```text
more automation/usefulness
vs
smaller security and semantic blast radius
```

## Architecture decision

```text
read-only assistant
+ deterministic context assembly
+ provider-neutral CaseExplanationPort
+ structured source-backed result
+ deterministic source validation
+ explicit fallback
+ versioned eval
```

## Deferred alternatives

```text
broad enterprise RAG corpus
vector database
write tools
autonomous remediation
AI gateway/platform layer
```

Reason:

```text
no current requirement/evidence pays their additional complexity and risk
```

## Failure modes

```text
unsupported claim
hallucinated authority
prompt injection
cross-tenant context
provider outage
model latency spike
model drift
unsafe provider data handling
```

## Verification

Historical deterministic boundary evidence:

```text
TypeScript AI contract compile PASS
AI boundary fitness 5/5 locally exercised at recorded revision
```

Still required:

```text
OO-002 real candidate evaluation
groundedness/source-attribution result
prompt-injection/authority evaluation
provider security/privacy review
latency/cost evidence
operator usefulness
runtime telemetry/fallback exercise
```

## Production decision

```text
LB-AI
= NOT READY / DISABLED FOR CORE LAUNCH
```

## Review triggers

```text
model/provider change
new context source
broad document retrieval
write/action tool
AI enters critical path
security/eval regression
material cost/latency change
```

## Real-world evidence anchors

Uber Genie:

- https://www.uber.com/gb/en/blog/genie-ubers-gen-ai-on-call-copilot/

Uber Enhanced Agentic-RAG:

- https://www.uber.com/us/en/blog/enhanced-agentic-rag/

Uber results remain Uber-specific and are not ESI benchmarks.
