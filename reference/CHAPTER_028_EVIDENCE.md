# Chapter 28 — Evidence Audit

Chapter:

> **L'architect del 2030**

## Editorial status

```text
Draft               yes
Source-first pass   yes
ESI compromise pass yes
Capstone evolution  yes — company-level capability artifact
```

## Scenario boundary

ESI's Architect Capability Map is a **fictional/company-method artifact** created for the book.

It is not:

```text
an industry standard
a certification framework
a vendor competency matrix
a validated predictor of job performance
```

The L1–L4 capability levels and the ESI baseline are book/scenario constructs.

---

# Main external sources

## Microsoft Learn — Solution Architect responsibilities

Sources:

- https://learn.microsoft.com/en-us/azure/well-architected/architect-role/fundamentals
- https://learn.microsoft.com/en-us/azure/well-architected/architect-role/architecture-design-specification
- https://learn.microsoft.com/en-us/azure/well-architected/architect-role/ongoing-support

Supported claims:

- architecture work starts from business outcomes and constraints;
- the architect gathers stakeholder input and balances technical, operational and business considerations;
- architecture design must address functional and nonfunctional requirements;
- architecture design is collaborative across developers, testers, operations and product stakeholders;
- the architect's role continues through implementation, change review and post-go-live evolution;
- architects can participate in requirements gathering, scoping and acceptance-criteria refinement;
- high-risk assumptions should be validated rather than treated as purely theoretical designs.

Use in chapter:

- support for lifecycle-oriented architecture responsibility;
- support for the chapter's functional-analysis literacy argument;
- support for hands-on/POC evidence on high-risk assumptions.

Not inferred:

```text
Microsoft's cloud solution-architect role
=
universal definition of every software architect
```

The book uses the source as contemporary enterprise guidance, not as the only valid job description.

---

## DORA — State of AI-assisted Software Development 2025

Sources:

- https://dora.dev/research/2025/dora-report/
- https://dora.dev/insights/balancing-ai-tensions/

Supported framing:

- AI's effect depends strongly on the underlying organizational/software-delivery system;
- AI is described as an amplifier of existing organizational strengths and weaknesses;
- faster generation does not eliminate verification/auditing work;
- AI adoption can create tensions between throughput and delivery stability.

Use in chapter:

- support for treating architect/engineering-system design as more important, not less, when execution becomes cheaper;
- support for separating generation speed from decision/verification capacity.

Not inferred:

```text
AI adoption always increases instability
```

or:

```text
DORA findings prove one specific ESI agent-governance model
```

The chapter avoids turning correlational/aggregate findings into deterministic workload claims.

---

## Microsoft Research — The SPACE of AI

Source:

- https://www.microsoft.com/en-us/research/publication/the-space-of-ai-real-world-lessons-on-ais-impact-on-developers/

Supported claims:

- mixed-method study across more than 500 developers;
- AI is broadly perceived as useful, especially for routine work;
- reported impact varies with task complexity, individual usage patterns and team/organizational adoption/support;
- productivity should not be reduced to raw activity alone.

Use in chapter:

- caution against assuming AI access automatically creates expertise or uniformly increases productivity;
- support for deliberate learning/team-support framing.

Not inferred:

```text
AI necessarily causes deskilling
```

The book treats deskilling as a risk/failure mode that must be managed, not as a quantified conclusion of the Microsoft study.

---

## OpenAI — How OpenAI uses Codex

Source:

- https://openai.com/business/guides-and-resources/how-openai-uses-codex/

Supported claims:

- coding agents are used for code understanding, refactoring, feature work and incident-related engineering tasks;
- structured context and well-scoped tasks improve usefulness;
- AI-assisted execution spans more than code completion.

Use in chapter:

- real-company example for the broader execution surface architects must govern;
- support for repository/task context as engineering-system design.

Not inferred:

```text
OpenAI's workflow is the required workflow for ESI
```

---

## OpenAI — Running Codex safely at OpenAI

Source:

- https://openai.com/index/running-codex-safely/

Supported claims:

- agent execution can involve repository access, command execution and development tools;
- organizations need controls over access, approvals, system interaction and telemetry;
- bounded execution and agent-native telemetry are meaningful governance concerns.

Use in chapter:

- support for permission architecture and agent-governance concerns.

Not inferred:

```text
one OpenAI security configuration
=
universal agent-security architecture
```

---

# ESI-specific constructs

The following are scenario/book constructs:

```text
Architect Capability Map
L1 Understand
L2 Apply
L3 Govern
L4 Grow the system
ESI baseline capability levels
specialist-trigger table
Deliberate Manual Mode
ESI Learning Loop
```

They are designed to make the book's method operational.

They are not presented as empirically validated career frameworks.

---

# Important distinctions

```text
architecture responsibility
≠ formal architect title
```

```text
functional-analysis specialist exists
≠ everyone else may ignore product semantics
```

```text
technical depth
≠ maximum coding throughput
```

```text
AI-generated architecture artifact
≠ architecture decision Verified
```

```text
second agent review
≠ independent evidence automatically
```

```text
course/certification completed
≠ capability Govern/Grow demonstrated
```

```text
AI productivity gain
≠ one person replaces a team
```

---

# Chapter 28 quantitative policy

The chapter does not introduce fictional benchmark numbers for architect productivity, AI productivity, team-size reduction or capability effectiveness.

The ESI capability baseline uses qualitative levels only.

Any quantitative result cited from an external study must remain attributed to that study and context.

---

# Compromise audit

Need:

```text
architects capable of governing more AI-amplified execution
```

Tension:

```text
breadth
vs technical depth
vs specialist/architecture bottlenecks
```

Decision:

```text
broad functional/systems literacy
+ credible technical depth
+ explicit specialist triggers
+ evidence-based growth
+ executable guardrails where possible
```

Cost accepted:

```text
continuous learning
cross-functional exposure
mentoring/documentation effort
less comfort inside a single specialization
```

Quality floor:

```text
functional understanding
technical credibility
evidence proportional to claim
specialist/domain authority preserved
AI output does not replace professional accountability
```

---

# Release-candidate checks for this chapter

Before release candidate:

1. re-check Microsoft architect-role pages for material revisions;
2. re-check the DORA 2025 report/related insights for wording and dates;
3. re-check Microsoft Research SPACE-of-AI publication status if a peer-reviewed version becomes available;
4. re-check current OpenAI Codex workflow/security pages if contemporary tool capabilities are described;
5. preserve the distinction between external evidence and ESI's invented capability framework;
6. ensure no chapter wording implies that `2030` is a factual prediction deadline.
