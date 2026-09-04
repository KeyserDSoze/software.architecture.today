# Order Operations

> **Prodotto simulato/composito di Example Software Industries S.p.A. (ESI).**

Order Operations è il capstone principale di *Software Architecture Today*, business unit **Commerce & Operations**.

I capitoli spiegano **perché** cambia. Questa directory conserva **lo stato corrente** di decisioni, codice ed evidence.

## Product goal

Ridurre il tempo necessario agli operatori per individuare, comprendere e gestire ordini che richiedono attenzione operativa senza trasferire a Order Operations l'autorità di Orders, Payments o Shipping.

## Regola di evoluzione

> **Il progetto deve evolvere perché cambia il contesto, non perché il libro deve mostrare una tecnologia.**

---

# Timeline sintetica

```text
1–3   problem / functional analysis / system context
4–7   ADR / boundaries / quality / patterns
8–11  topology / API / data / distributed behavior
12–16 cloud / security / reliability / observability / testing
17–20 legacy / refactoring / architecture evolution / cost
21–23 AI-ready repo / issue-driven / agent governance
24     runtime AI — Case Explanation Assistant
25     One-Man Project operating model
26     Production Readiness Review
```

---

# Capability correnti

## Core Operational Case

```text
private internal operational product
+ confirmed product semantics
+ modular-monolith boundaries
+ API/data ownership contracts
```

## Payment Escalation

```text
OperationalCase
→ Payment Escalation
→ local transaction
   ├── PaymentEscalation
   └── OutboxMessage
→ async delivery
→ Payments & Risk
```

Order Operations possiede l'intenzione di escalation; Payments & Risk mantiene ownership della semantica economica.

Higher-fidelity PostgreSQL atomicity evidence:

```text
OO-001
= Pending
```

## Priority migration

Confirmed target semantics:

```text
Closed                  → NotActionable
manualHold              → ManualReview
Payment failures >= 3   → Urgent
otherwise               → Standard
```

Intentional legacy difference:

```text
ED-001
Enterprise + age >= 30m
legacy → URGENT
target → Standard
```

Current cutover:

```text
NOT AUTHORIZED
```

Runtime shadow/retirement evidence remains pending.

## Case Explanation Assistant

First runtime AI capability.

```text
read-only
+ deterministic authorized context assembly
+ provider-neutral CaseExplanationPort
+ source-backed structured result
+ no write tools
+ explicit fallback
```

The model is advisory, not an authority for:

```text
PaymentStatus
Priority
refund/remediation
tenant authorization
```

Real model/provider evaluation:

```text
OO-002
= Pending
```

---

# Agentic engineering / One-Man Project

Persistent repository context:

```text
AGENTS.md
docs/repository-map.md
```

Current governance:

```text
docs/agent-delegation-contract.md
docs/agent-verification-bundle.md
docs/ai-autonomy-matrix.md
docs/one-man-project-operating-model.md
```

Current pilot WIP policy — simulated ESI decision:

```text
Max active execution tasks       2
Max active cross-boundary tasks  1
Max unresolved semantic gates    1
```

Continuity:

```text
Secondary Maintainer role
= Designed

continuity/vacation drill
= Pending
```

One accountable lead does **not** mean one source of truth or one sovereign authority.

---

# Production Readiness — Chapter 26

Canonical artifact:

```text
docs/production-readiness-review.md
```

Current review:

```text
PRR-OO-001
Decision = NO-GO — evidence closure required
```

## Launch boundaries

```text
LB-CORE
→ NO-GO

LB-ESCALATION
→ BLOCKED

LB-PRIORITY-CANDIDATE
→ NOT AUTHORIZED

LB-AI
→ NOT READY / disabled for core launch
```

## Core blocker register

```text
PRB-001 cloud deployment evidence
PRB-002 security runtime evidence
PRB-003 reliability / recovery evidence
PRB-004 observability / alert evidence
PRB-005 support / continuity evidence
PRB-006 capacity evidence
```

Capability-specific:

```text
PRB-ESC-001
→ OO-001 PostgreSQL atomicity

PRB-AI-001
→ OO-002 real model/provider evaluation
```

The PRR deliberately does **not** call the project “almost ready”. It records exactly which claims remain unsupported by the required evidence.

---

# Current work items

```text
OO-001
Verify PostgreSQL atomicity for Payment Escalation + Outbox

OO-002
Evaluate Case Explanation model/provider candidates against the same eval suite

OO-003
Verify Azure non-production deployment path
```

Current state:

```text
OO-001 execution = Pending
OO-002 execution = Pending
OO-003 execution = Pending
```

`OO-003` is the first direct PRR-closure work item and targets `PRB-001` only. Closing it must not automatically close the other blockers.

---

# Evidence already accumulated

Historical evidence remains tied to the revision/gate where it was actually executed.

```text
Chapter 18
Order Operations application/refactoring     19/19 PASS at that revision
Legacy characterization                       6/6 PASS

Chapter 19
Architecture fitness                          5/5 PASS

Chapter 20
Cost fitness                                  2/2 locally exercised

Chapter 21
Context fitness                               4/4 locally exercised

Chapter 22
Issue readiness                               4/4 PASS

Chapter 23
Agent governance                              5/5 locally exercised

Chapter 24
AI boundary compile + fitness                 5/5 locally exercised

Chapter 25
One-Man Project fitness                       Codified; authoring-runtime execution not completed

Chapter 26
Production Readiness fitness                  Codified; real production-readiness evidence remains external/environment-specific
```

Important:

```text
production-readiness-fitness.test.mjs green
≠ production ready
```

The fitness test protects documentation/mechanical truth such as keeping the PRR `NO-GO` while blockers are open. It cannot prove Azure, PostgreSQL, recovery, alerting, continuity or model behavior.

---

# Current evidence snapshot

```text
Functional/architecture intent               Designed/Codified extensively
TypeScript application/refactoring            Codified + previously typechecked
Legacy characterization                      Verified locally
Architecture fitness                         Verified locally
Cost/context/issue/agent/AI fitness          locally exercised at prior chapter revisions

Production Readiness Review                  Codified
Current PRR decision                         NO-GO
Azure real deployment                        Pending via OO-003
Security runtime/network verification        Pending
PostgreSQL integration                       Pending via OO-001
Recovery drills                              Pending
Alert/synthetic/runtime observability        Pending
Continuity drill                             Pending
Capacity evidence                            Pending
Real AI model/provider evaluation            Pending via OO-002
Priority authoritative cutover               Not authorized
A3/A4 production agent autonomy              Not authorized
```

Evidence vocabulary:

```text
Designed → Codified → Verified → Monitored
```

Legacy knowledge:

```text
Found → Inferred → Observed → Confirmed
```

Do not collapse the dimensions.

---

# Repository structure

```text
order-operations/
├── AGENTS.md
├── README.md
├── database/
├── docs/
│   ├── functional-analysis.md
│   ├── requirements.md
│   ├── architecture-context.md
│   ├── architecture-fitness-checklist.md
│   ├── api-contract.md
│   ├── data-ownership.md
│   ├── failure-mode-map.md
│   ├── cloud-deployment.md
│   ├── threat-model.md
│   ├── security-control-matrix.md
│   ├── reliability-contract.md
│   ├── observability-contract.md
│   ├── testing-strategy.md
│   ├── cost-model.md
│   ├── legacy-understanding-map.md
│   ├── refactoring-safety-plan.md
│   ├── agent-delegation-contract.md
│   ├── agent-verification-bundle.md
│   ├── ai-autonomy-matrix.md
│   ├── ai-feature-contract.md
│   ├── one-man-project-operating-model.md
│   ├── production-readiness-review.md
│   ├── events/
│   └── adr/
├── evals/
├── infra/
├── src/
├── tests/
│   └── ... production-readiness-fitness.test.mjs
└── work-items/
    ├── TEMPLATE.md
    ├── OO-001-postgresql-escalation-outbox-atomicity.md
    ├── OO-002-case-explanation-model-evaluation.md
    └── OO-003-verify-azure-nonprod-deployment.md
```

---

# Documents that must move together

- semantics → Functional Analysis + Requirements + tests;
- contract/authority → API/Event Contract + Data Ownership;
- security/blast radius → Threat Model + Security Control Matrix;
- reliability/recovery → Reliability Contract + Failure Mode Map;
- telemetry → Observability Contract;
- verification → Testing Strategy;
- AI authority/context/tool/model → AI Feature Contract + evals;
- agent permission/autonomy → Delegation/Verification/Autonomy artifacts;
- One-Man Project WIP/continuity → Operating Model;
- launch boundary/blocker/risk acceptance → Production Readiness Review + primary evidence.

---

# Current rules

> **Il repository contiene ciò che resta vero fra i task. La issue contiene ciò che deve diventare vero nel task corrente.**

> **Grounding è un requisito. RAG è una possibile soluzione.**

> **One accountable lead non significa one source of truth.**

> **Closing one blocker does not make the system production-ready.**

> **Readiness non è ottenere un sì. È rendere costoso dire sì senza sapere perché.**

## End goal

Alla fine del libro il lettore deve poter confrontare la prima iterazione con il sistema finale e capire non soltanto **che cosa** è cambiato, ma **quale informazione, trade-off o evidence ha reso necessario ogni cambiamento**.
