# Chapter 25 — Evidence Audit

Chapter:

> **One-Man Project**

## Editorial status

```text
Draft                    yes
Source-first pass        yes
ESI compromise pass      yes
Capstone evolution       yes
Automated local gate     not executed in authoring runtime (GitHub DNS unavailable)
```

## Main claims and sources

### AI can increase individual software execution throughput

Source:

- [Microsoft Research — The Effects of Generative AI on High-Skilled Work: Evidence from Three Field Experiments with Software Developers](https://www.microsoft.com/en-us/research/publication/the-effects-of-generative-ai-on-high-skilled-work-evidence-from-three-field-experiments-with-software-developers/)

Supported claim:

- three randomized field experiments across 4,867 developers were aggregated;
- the paper reports a 26.08% increase in completed tasks for developers with access to the AI coding assistant.

Not inferred:

```text
26.08% more completed tasks
≠ 26.08% more business value
≠ 26.08% fewer engineers needed
≠ evidence that one engineer can replace a team
```

### Coding agents can be used as execution multipliers across several engineering task classes

Source:

- [OpenAI — How OpenAI uses Codex](https://openai.com/business/guides-and-resources/how-openai-uses-codex/)

Supported use cases include:

- code understanding;
- refactoring/migrations;
- testing;
- incident/debugging support;
- exploration;
- asynchronous task delegation / task queue.

The source also emphasizes well-scoped tasks, repository/environment context and review.

This source is OpenAI describing its own product/internal workflows; the chapter does not treat it as universal productivity proof.

### Developer productivity is multidimensional

Source:

- [Microsoft Research / ACM Queue — The SPACE of Developer Productivity](https://www.microsoft.com/en-us/research/publication/the-space-of-developer-productivity-theres-more-to-it-than-you-think/)

Supported framing:

```text
Satisfaction and well-being
Performance
Activity
Communication and collaboration
Efficiency and flow
```

Use in chapter:

- reject PR/task/line volume as a complete definition of One-Man Project success.

### Sustained AI tool use does not automatically erase trust/scrutiny concerns

Source:

- [Microsoft Research — Dear Diary: A Randomized Controlled Trial of Generative AI Coding Tools in the Workplace](https://www.microsoft.com/en-us/research/publication/dear-diary-a-randomized-controlled-trial-of-generative-ai-coding-tools-in-the-workplace/)

Supported framing:

- participants perceived AI coding tools as increasingly useful/enjoyable;
- reported trustworthiness perception of AI-generated code did not increase correspondingly;
- authors discuss balancing productivity gains with scrutiny/critical evaluation.

Use in chapter:

> lower friction is not treated as evidence that verification risk has disappeared.

### AI support appetite varies by task and responsible-AI concern

Source:

- [Microsoft Research — AI Where It Matters](https://www.microsoft.com/en-us/research/publication/ai-where-it-matters-where-why-and-how-developers-want-ai-support-in-daily-work/)

Supported framing:

- developer openness/use of AI varies by task;
- reliability/security are important for system-facing work;
- human/relationship-centric activities show different automation preferences/limits.

Use in chapter:

- specialist gate and role-elasticity discussion;
- no universal `AI yes/no` matrix claimed.

### Explicit maintainership metadata can improve shared understanding and operational routing

Source:

- [GitHub Engineering — How we organize and get things done with SERVICEOWNERS](https://github.blog/engineering/architecture-optimization/how-we-organize-and-get-things-done-with-serviceowners/)

Supported framing:

- GitHub maps running code/services to maintainers;
- describes shared lexicon and incident/on-call routing benefits;
- CI enforces ownership metadata for new files in the described environment.

Use in chapter:

- knowledge/maintainership should be externalized rather than living only in one lead's memory.

Not claimed:

- `SERVICEOWNERS` is required for ESI;
- GitHub uses or endorses the One-Man Project concept.

## Scenario-only concepts

The following are **ESI/book operating concepts**, not external standards:

```text
One-Man Project / one-person operating model
Attention budget
T0/T1/T2/T3 task classes
Initial WIP limits
Continuity / vacation drill
One-Man Project Operating Model
Secondary Maintainer requirement for the pilot
OO-002 work item
```

They are presented as explicit decisions/hypotheses and must not be attributed to Microsoft, GitHub or OpenAI.

## ESI compromise

```text
Need
increase individual leverage for a bounded internal AI capability

Tension
execution/coordination efficiency
vs
knowledge concentration, specialist authority, continuity and verification capacity

Decision
one accountable lead
+ bounded agent portfolio
+ WIP limit
+ secondary maintainer
+ specialist triggers
+ independent verification

Accepted cost
human/domain gates remain; some possible parallelism intentionally unused; continuity/documentation work required

Quality floor
functional authority, security, data ownership, verification provenance and continuity cannot silently degrade

Trigger
review backlog, support burden, specialist-gate frequency, public/external surface, write-capable AI, one-way-door density or continuity risk invalidate current fit
```

## Capstone artifacts

```text
docs/one-man-project-operating-model.md
work-items/OO-002-case-explanation-model-evaluation.md
tests/one-man-project-fitness.test.mjs
```

## Verification state

Authoring runtime attempted:

```text
git clone https://github.com/KeyserDSoze/software.architecture.today.git
```

Result:

```text
Could not resolve host: github.com
```

Therefore:

```text
One-Man Project fitness test
= Codified
= not executed locally in this chapter authoring runtime
```

Direct GitHub branch inspection remains available for structural verification.

Do not describe OMP-001…OMP-005 as `Verified` until the actual test command is executed successfully.

## Release pass reminders

Before release candidate:

- recheck current Microsoft/OpenAI/GitHub URLs and factual wording;
- keep 26.08% tied to the cited study population/design;
- do not turn One-Man Project into a universal staffing recommendation;
- do not present ESI WIP numbers as industry benchmarks;
- execute the One-Man Project fitness test in a reproducible checkout/CI;
- execute an actual continuity drill before describing continuity as Verified;
- keep `OO-002` model/provider evaluation Pending until real candidate evaluation exists.
