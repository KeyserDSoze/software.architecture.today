# ESI — Architect Capability Map

> **Scenario fittizio ESI.** Questo artefatto company-level nasce nel Capitolo 28 di *Software Architecture Today*. Non è uno standard industriale, una certification matrix o un sistema di ranking delle persone.

## Purpose

La map serve a rendere discutibile e osservabile una domanda spesso lasciata vaga:

> **Quali capacità servono per governare decisioni architetturali nell'era dell'AI?**

ESI la usa per:

```text
learning plan
staffing
specialist trigger
continuity
mentoring
portfolio risk
```

Non viene usata come punteggio unico.

---

# Guiding principle

> **Ampiezza per capire il sistema. Profondità sufficiente per non essere ingannati dalle astrazioni. Specialist gate quando il rischio supera la propria profondità.**

Architecture è una responsabilità prima di essere un job title.

Questa map può quindi essere usata da:

```text
software architect
solution architect
principal/staff engineer
tech lead
senior engineer con responsabilità architetturale
```

quando il contesto lo richiede.

---

# Capability levels

## L1 — Understand

```text
explains concepts correctly
recognizes important questions
can follow an existing decision
```

## L2 — Apply

```text
uses the capability on a bounded real problem
produces useful evidence/artifacts
can verify the local outcome
```

## L3 — Govern

```text
handles cross-boundary decisions
makes trade-offs explicit
sets evidence/guardrail/review triggers
knows when specialist authority is required
```

## L4 — Grow the system

```text
teaches others
creates reusable guardrails/paved roads
reduces organizational dependency on individual expertise
can evolve the policy itself when context changes
```

Levels are capability-specific.

A person may be L4 in one area and L1/L2 in another.

---

# Capability map

| Capability | What good looks like | Typical evidence | Failure mode |
|---|---|---|---|
| Product & Functional Analysis | understands outcomes, journeys, states, invariants, ownership and open questions | Functional Analysis, acceptance criteria, domain workshop | architecture from ticket titles |
| System Boundaries & Domain Design | creates meaningful responsibility boundaries and controls coupling | Component Responsibility Map, ADR, architecture tests | boxes without responsibility |
| Technical & Code Literacy | can inspect code/runtime deeply enough to falsify architecture assumptions | code review, POC, test, trace, migration review | architecture detached from implementation |
| Data & Distributed Systems | reasons about transaction, consistency, messaging, idempotency and migration | Data Ownership Map, Failure Mode Map, integration evidence | local-call assumptions over networks |
| Security, Reliability & Operability | designs for threat, failure, recovery, support and observable health | Threat Model, Reliability Contract, drill evidence | happy-path architecture |
| Economics & Cost | connects cost driver to property purchased and business value | Cost Model, unit economics, trade-off ADR | cheapest resource assumed best architecture |
| Evolution, Legacy & Reversibility | manages knowledge uncertainty, coexistence, rollback and architecture drift | Legacy Map, Safety Plan, fitness function | rewrite-or-freeze thinking |
| AI Runtime Architecture | defines model authority, context, tools, eval, fallback and model change gates | AI Feature Contract, eval set | model capability mistaken for authority |
| Agentic Engineering Governance | designs context, task scope, permissions, verification and stop conditions | AGENTS, Work Item, Delegation Contract, Verification Bundle | faster uncontrolled change |
| Enterprise Systems & Communication | translates technical properties to business consequence and negotiates enterprise trade-offs | stakeholder decision package, launch-boundary options | local optimization, global cost |
| Evidence, Learning & Teaching | selects evidence proportional to claims, learns source-first, teaches and externalizes knowledge | PRR, postmortem, mentoring artifact, experiment | confident artifact without reliable knowledge |

---

# ESI baseline for architecture responsibility

This is a **pilot expectation**, not an industry benchmark.

```text
Product & Functional Analysis        >= L2
System Boundaries & Domain Design    >= L3
Technical & Code Literacy            >= L2
Security/Reliability/Operability     >= L2
Economics & Cost                     >= L2
Evidence/Learning/Teaching           >= L3
```

At least one or two areas should have materially stronger depth depending on role and portfolio.

The baseline does **not** authorize independent decisions in specialist-owned domains.

---

# Specialist triggers

| Trigger | Required collaboration / authority |
|---|---|
| economic/payment semantics | Payments & Risk / domain owner |
| regulated or contractual data | Security + Legal/Compliance |
| public Internet exposure | Security + Platform |
| advanced recovery/data integrity change | Data/Platform/SRE specialist |
| material multi-region change | Platform/SRE + business owner |
| high-impact AI write/action tool | AI specialist + Security + domain authority |
| architecture exception with enterprise blast radius | Architecture/Platform/Security as appropriate |

> **Knowing when to escalate is part of competence, not evidence of incompetence.**

---

# Functional literacy baseline

Every person exercising material architecture responsibility should be able to:

```text
read a functional specification
produce a first functional-analysis draft when needed
model actors and critical journeys
identify business states/invariants
separate requirement from implementation suggestion
identify ownership and decision authority
turn ambiguity into explicit open questions
connect acceptance semantics to verification
```

The role may collaborate with Business Analysts/Product specialists.

It must not use:

```text
"I only handle the technical side"
```

as a reason to ignore the product semantics being designed.

---

# Technical credibility baseline

Architecture responsibility requires enough technical depth to inspect or verify, directly or through suitable evidence:

```text
critical code flow
tests
schema/migrations
runtime telemetry
cloud/IaC configuration
identity/permission boundary
failure behavior
AI/provider boundary when relevant
```

The goal is not maximum implementation throughput.

The goal is keeping judgment anchored to technical reality.

---

# Agentic-era capability

An architect using AI/agents should be able to distinguish:

```text
capability
≠ permission
≠ autonomy
```

and:

```text
executor output
≠ verification evidence
```

Expected practice:

```text
persistent context
→ bounded work item
→ permission boundary
→ execution
→ primary evidence
→ independent/human gate where required
```

The architect may propose greater autonomy only when failure modes, evidence and rollback/containment make that autonomy governable.

---

# Learning loop

Capability growth follows:

```text
Explore
→ Verify
→ Apply
→ Operate / Observe
→ Teach
→ Re-evaluate
```

Examples of evidence:

```text
POC
ADR
functional-analysis workshop
architecture fitness rule
incident analysis
migration
recovery/security drill
Production Readiness Review
agent-governance design
mentoring / technical teaching
```

Course attendance or certification can support `Explore`.

They do not automatically demonstrate `Apply`, `Govern` or `Grow the system`.

---

# Anti-deskilling practice

For core skills, ESI encourages periodic **deliberate manual mode**:

```text
form a prediction before asking AI
inspect primary source
solve a bounded example manually
use AI as reviewer/adversary
reconstruct the model without the answer visible
```

Purpose:

> verify that AI leverage is extending expertise rather than becoming an invisible dependency for basic judgment.

---

# Team/portfolio usage

The map should answer questions such as:

```text
Which capability is missing in this team?
Where do we depend on one expert?
Which upcoming decision needs specialist depth?
Where is an architect becoming an approval bottleneck?
Which capability should a person develop next?
Which knowledge should become an executable guardrail instead of tribal review?
```

It should **not** answer:

```text
Who is the best architect?
Who has the highest score?
Who deserves a promotion based on a total number?
```

---

# Current ESI compromise

Need:

```text
architects capable of governing more AI-amplified execution
```

Tension:

```text
breadth
vs
technical depth
vs
specialist bottlenecks
```

Decision:

```text
broad functional/systems literacy
+ credible technical depth
+ explicit specialist triggers
+ evidence-based capability growth
+ executable guardrails where possible
```

Cost accepted:

```text
continuous learning
cross-functional exposure
mentoring/documentation effort
```

Quality floor:

```text
functional understanding
technical credibility
evidence proportional to claim
specialist/domain authority preserved
no AI output treated as professional accountability substitute
```

---

# Review triggers

Review this map when:

1. ESI's product portfolio materially changes;
2. AI agents receive materially broader capabilities;
3. repeated incidents reveal missing organizational skills;
4. Architecture becomes a delivery bottleneck;
5. specialist escalation repeatedly happens too late;
6. a capability becomes mostly automated and the human judgment boundary changes;
7. new regulation/security constraints require new baseline literacy.

---

# Final statement

> **L'architect non scala sapendo tutto. Scala costruendo abbastanza comprensione, evidence e guardrail perché il sistema possa prendere buone decisioni anche senza la sua presenza continua.**
