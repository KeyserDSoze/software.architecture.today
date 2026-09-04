# Source & Factual Audit

Questo file governa due revisioni distinte:

1. **Evidence pass** — claim fattuali, standard, proprietà tecnologiche, casi reali e raccomandazioni vengono confrontati con fonti appropriate.
2. **ESI compromise pass** — ogni capitolo rende leggibili esigenza, tensione, decisione, costo accettato, quality floor, guardrail/evidence e trigger.

Scenario fittizio ufficiale:

> **Example Software Industries S.p.A. — ESI**

Capstone principale:

> **Order Operations** — Commerce & Operations.

Altri scenari persistenti:

```text
Operations Desk Classic — brownfield legacy
Campaign Launchpad — Marketing Technology / small One-Man Project
```

I casi reali rimangono separati da ESI.

---

# Stato corrente

| Capitolo | Draft | Evidence pass | ESI compromise pass | Nota |
|---|---:|---:|---:|---|
| 0 — Al timone | sì | da fare | sì — draft | autonomy vs accountability |
| 1 — Il software è cambiato | sì | da fare | sì — draft | velocity vs understanding |
| 2 — Prima del codice | sì | parziale | sì — draft | analisi funzionale condivisa |
| 3 — Pensare per sistemi | sì | da fare | sì — draft | completezza/freshness vs simplicity |
| 4 — Software Architecture | sì | da fare | sì — draft | live lookup vs async read model |
| 5 — Dalle feature ai confini | sì | da fare | sì — draft | shared infra vs ownership |
| 6 — Qualità prima della tecnologia | sì | parziale | sì — draft | fit before fashion |
| 7 — Pattern senza religione | sì | da fare | sì — draft | robustness vs complexity debt |
| 8 — Il monolite non è il nemico | sì | da fare | sì — draft | isolation vs distribution cost |
| 9 — API e contratti | sì | sì — draft | sì — draft | compatibility/idempotency |
| 10 — I dati sono architettura | sì | sì — draft | sì — draft | Microsoft/PostgreSQL/Redis/Stripe/GitHub |
| 11 — Sistemi distribuiti | sì | sì — draft | sì — draft | Microsoft/AWS/Uber |
| 12 — Cloud Architecture | sì | sì — draft | sì — draft | Microsoft/AWS/dacadoo |
| 13 — Security by Design | sì | sì — draft | sì — draft | Microsoft/NIST/OWASP/Cloudflare |
| 14 — Reliability | sì | sì — draft | sì — draft | Google SRE/Microsoft/GitHub/Cloudflare |
| 15 — Observability | sì | sì — draft | sì — draft | OpenTelemetry/Google/Microsoft |
| 16 — Testing Architecture | sì | sì — draft | sì — draft | Microsoft/Google/Meta/OWASP/Pact |
| 17 — Legacy e comprensione | sì | sì — draft | sì — draft | Microsoft/AWS/GitHub |
| 18 — Refactoring nell'era dell'AI | sì | sì — draft | sì — draft | AWS/Microsoft/GitHub/OpenRewrite |
| 19 — Architecture Evolution | sì | sì — draft | sì — draft | Thoughtworks/AWS/Microsoft/GitHub |
| 20 — Costi e decisioni | sì | sì — draft | sì — draft | Microsoft/FinOps/Uber |
| 21 — AI-ready repository | sì | sì — draft | sì — draft | GitHub/OpenAI |
| 22 — Issue-driven development | sì | sì — draft | sì — draft | GitHub/OpenAI |
| 23 — Manager di agenti | sì | sì — draft | sì — draft | OpenAI/Microsoft/GitHub |
| 24 — AI dentro l'architettura | sì | sì — draft | sì — draft | Microsoft/NIST/OWASP/OpenAI/Uber |
| 25 — One-Man Project | sì | sì — draft | sì — draft | Microsoft Research/SPACE/OpenAI/GitHub; dedicated audit |
| 26 — Production Readiness | sì | sì — draft | sì — draft | AWS ORR/Google SRE/Microsoft/GitHub; dedicated audit |
| 27 — Casi end-to-end | sì | sì — draft | sì — draft | Microsoft/GitHub/Uber; dedicated audit |
| 28 — L'architect del 2030 | sì | sì — draft | sì — draft | Microsoft architect role/DORA/Microsoft Research/OpenAI; dedicated audit |
| Capitolo finale — Il timone resta a noi | sì — sezioni 001–008 | sintesi di evidence già auditata | sì — draft | `009` intenzionalmente assente; Dieci comandamenti ancora da scegliere |

Dedicated audits:

```text
reference/CHAPTER_025_EVIDENCE.md
reference/CHAPTER_026_EVIDENCE.md
reference/CHAPTER_027_EVIDENCE.md
reference/CHAPTER_028_EVIDENCE.md
reference/CHAPTER_029_EVIDENCE.md
```

---

# Evidence vocabulary

For artifacts/capabilities:

```text
Designed
→ Codified
→ Verified
→ Monitored
```

For legacy knowledge:

```text
Found
→ Inferred
→ Observed
→ Confirmed
```

For runtime AI:

```text
deterministic boundary Verified
≠
model behavior Verified
```

For production readiness:

```text
fitness/document review green
≠
real environment readiness Verified
```

For professional capability:

```text
course/certification/artifact exists
≠
capability Govern/Grow demonstrated
```

---

# Capstone evidence snapshot

Historical deterministic evidence remains scoped to the revision/property where it was actually executed:

```text
Chapter 18
Order Operations/refactoring suite            19/19 PASS
Legacy characterization                        6/6 PASS

Chapter 19
Architecture fitness                           5/5 PASS

Chapter 20
Cost fitness                                   2/2 locally exercised

Chapter 21
Context fitness                                4/4 locally exercised

Chapter 22
Issue readiness                                4/4 PASS

Chapter 23
Agent governance                               5/5 locally exercised

Chapter 24
AI boundary compile + fitness                  5/5 locally exercised

Chapter 25
One-Man Project fitness                        Codified; local execution not completed in authoring runtime

Chapter 26
Production-readiness fitness                   Codified; real environment evidence still Pending
```

Chapter 27 adds decision-trace/documentary synthesis, not new runtime verification.

Chapter 28 adds company-level capability/governance documentation, not a claim that ESI people were empirically assessed.

The final chapter sections 001–008 synthesize the already established method and introduce no new runtime verification or production claim.

---

# Current production-readiness state — Order Operations

Canonical artifact:

```text
capstone/example-software-industries/products/order-operations/docs/production-readiness-review.md
```

Current decision:

```text
PRR-OO-001
NO-GO — evidence closure required
```

Core blockers:

```text
PRB-001 cloud deployment evidence
PRB-002 security runtime evidence
PRB-003 recovery evidence
PRB-004 observability / alert evidence
PRB-005 support / continuity evidence
PRB-006 capacity evidence
```

Capability-specific pending work:

```text
OO-001 → PostgreSQL atomicity
OO-002 → real Case Explanation model/provider evaluation
OO-003 → Azure non-production deployment evidence
```

No chapter may describe Order Operations as production-ready until required primary evidence exists and the PRR is explicitly updated.

---

# Chapter 27 evidence policy

Main real-world sources:

- Microsoft Learn / Azure Well-Architected for managed/static deployment and risk-proportional validation;
- GitHub Engineering Rails migration for incremental coexistence/rollout evidence;
- Uber Genie / Enhanced Agentic-RAG for AI support-copilot and eval evolution.

Important restrictions:

```text
Static Web Apps capability
≠ every small product should use Static Web Apps

GitHub dual boot
≠ every brownfield migration needs dual boot

Uber Agentic-RAG improvement
≠ every AI workload needs RAG
```

ESI's three end-to-end cases remain fictional/composite.

Detailed audit:

- `reference/CHAPTER_027_EVIDENCE.md`.

---

# Chapter 28 evidence policy

Main sources:

### Microsoft Azure Well-Architected architect-role guidance

Supports:

```text
business/stakeholder input
functional + nonfunctional design
lifecycle involvement
implementation collaboration
acceptance/scoping/change review
validation of high-risk assumptions
```

Restriction:

```text
Microsoft cloud solution architect role
≠ universal software architect job description
```

### DORA 2025 / AI-assisted development

Supports the framing of AI as an amplifier of the surrounding engineering/organizational system and the tension between faster generation and verification/stability.

Restriction:

```text
aggregate DORA finding
≠ deterministic result for ESI
```

### Microsoft Research — SPACE of AI

Supports that perceived benefit varies with task complexity, usage patterns and organizational/team support.

Restriction:

```text
study findings
≠ proof that AI necessarily causes deskilling
```

Deskilling is treated by the book as a risk to manage.

### OpenAI Codex workflow/security sources

Support that coding agents can operate across code understanding/refactoring/engineering workflows and that permission, approval, network/context and telemetry are relevant governance boundaries.

Restriction:

```text
OpenAI internal workflow
≠ required ESI workflow
```

Detailed audit:

- `reference/CHAPTER_028_EVIDENCE.md`.

---

# Final chapter evidence policy

Sections 001–008 are intentionally synthesis-heavy.

They do not introduce new vendor recommendations, benchmark numbers, production claims or new real-company architecture claims.

They summarize concepts already developed and audited across Chapters 0–28, including:

```text
functional understanding
fit before fashion
trade-off + quality floor
Designed → Codified → Verified → Monitored
Observed ≠ Confirmed
verification without re-execution
capability ≠ authority
Production Readiness NO-GO
One-Man Project / Specialist Gate
```

The final chapter preserves the current ESI truth:

```text
Order Operations PRR
= NO-GO — evidence closure required
```

It deliberately does not invent a successful launch for narrative closure.

Detailed audit and final-section gate:

- `reference/CHAPTER_029_EVIDENCE.md`.

The only future main-manuscript section allowed after `chapters/029_chapter/008_before_the_commandments.md` is the final Dieci comandamenti section.

---

# ESI-specific professional artifacts

```text
capstone/example-software-industries/ARCHITECT_CAPABILITY_MAP.md
```

The following are ESI/book constructs, not external standards:

```text
11 capability areas
L1 Understand
L2 Apply
L3 Govern
L4 Grow the system
ESI baseline capability levels
Specialist Trigger
Deliberate Manual Mode
ESI Learning Loop
```

No quantitative productivity or staffing claim is derived from the map.

---

# Important distinctions

## Fiction / evidence

```text
ESI decision
≠ real-world proof
```

## Functional analysis

```text
functional-analysis specialist exists
≠ architect/developer may ignore product semantics
```

## Legacy

```text
Observed legacy behavior
≠ Confirmed target requirement
```

## Cost

```text
resource/model price
≠ Total Cost of Ownership

cost per token
≠ cost per useful outcome
```

## Agentic engineering

```text
instruction
≠ permission

issue ready
≠ outcome Verified

agent can perform action
≠ agent authorized to decide it

second agent review
≠ independent evidence automatically
```

## Runtime AI

```text
model output
≠ authoritative business fact

grounding
≠ vector database

valid structured output
≠ semantic correctness

eval dataset exists
≠ model behavior Verified
```

## Production readiness

```text
backup configured
≠ restore Verified

IaC Codified
≠ deployment Verified

runbook exists
≠ procedure exercised

one blocker closed
≠ production ready
```

## Architect capability

```text
formal architect title
≠ architecture responsibility

technical depth
≠ maximum coding throughput

AI-produced architecture artifact
≠ architecture decision Verified

certification completed
≠ capability Govern/Grow demonstrated
```

---

# Numeri simulati ESI

Existing SLO/RTO/RPO remain simulated requirements, not benchmarks.

One-Man Project WIP numbers are ESI pilot decisions, not benchmarks.

Architect Capability Map levels are qualitative ESI constructs, not validated scoring bands.

The book must not invent:

```text
architect productivity percentage
AI-driven staffing reduction
model accuracy/groundedness score
production workload billing
capacity headroom result
restore time result
continuity drill result
production launch status
```

without appropriate evidence.

---

# Editorial workflow

```text
outline
→ ESI tension / compromise framing
→ source discovery
→ draft
→ capstone/company artifact update
→ executable verification where meaningful
→ claim audit
→ compromise audit
→ adversarial review
→ editorial pass
```

---

# Release-candidate gates

Before a release candidate of the book:

- chapters 0–8 must receive the planned retroactive evidence pass;
- no current-source claim should remain knowingly stale;
- ESI and real cases must stay distinguishable;
- simulated numbers must not be presented as benchmarks;
- `Codified` must not be described as `Verified` without execution evidence;
- `Monitored` requires runtime signal;
- `Observed` legacy behavior must not silently become `Confirmed`;
- agent governance documents must not be described as real production autonomy evidence;
- AI eval seeds must not be described as model-quality results;
- PRR/ORR documents must not be described as production-readiness proof;
- Architect Capability Map must not be described as an industry standard or validated ranking system;
- current OpenAI/Microsoft/DORA capability claims should be rechecked near publication;
- real quantitative case-study results must remain attributed to their organizations and contexts;
- the **Dieci comandamenti** must remain only in the final section of the final chapter, with nothing after them in the main manuscript.
