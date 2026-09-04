# Source & Factual Audit

Questo file governa due revisioni distinte:

1. **Evidence pass** — claim fattuali, standard, proprietà tecnologiche, casi reali e raccomandazioni vengono confrontati con fonti appropriate.
2. **ESI compromise pass** — ogni capitolo rende leggibili esigenza, tensione, decisione, costo accettato, quality floor, guardrail/evidence e trigger.

Scenario fittizio ufficiale:

> **Example Software Industries S.p.A. — ESI**

Capstone principale:

> **Order Operations** — Commerce & Operations.

Brownfield simulato:

> **Operations Desk Classic**.

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
| 26 — Production Readiness | sì | sì — draft | sì — draft | AWS ORR, Google SRE, Microsoft, GitHub; dedicated audit |
| 27+ | non ancora | source-first | required | research + ESI compromise + capstone update before closure |

Dedicated audits:

```text
reference/CHAPTER_025_EVIDENCE.md
reference/CHAPTER_026_EVIDENCE.md
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

A PRR document or readiness fitness test can be `Codified` while the workload correctly remains `NO-GO`.

---

# Capstone evidence snapshot

## Historical deterministic evidence

Recorded at the corresponding chapter revisions:

```text
Chapter 18
TypeScript/refactoring suite                  19/19 PASS
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
One-Man Project fitness                       Codified; local execution not completed in authoring runtime

Chapter 26
Production-readiness fitness                  Codified; real environment evidence still Pending
```

Historical local evidence is scoped to the revision and property exercised. It is not a perpetual statement that every later commit re-ran every previous gate.

---

# Current production-readiness state

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

Capability-specific blockers:

```text
OO-001
→ PostgreSQL PaymentEscalation + Outbox atomicity

OO-002
→ real Case Explanation model/provider evaluation

OO-003
→ Azure non-production deployment evidence
```

Current launch-boundary states:

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

No chapter may describe Order Operations as production-ready until the required primary evidence exists and the PRR is explicitly updated.

---

# Current major pending evidence

```text
real PostgreSQL integration/migration behavior
Bicep build/lint on approved toolchain
Azure non-production deployment
private connectivity
Entra/auth/RBAC negative tests
PostgreSQL restore/failover drill
alert/SLI/synthetic runtime evidence
capacity evidence
secondary-maintainer continuity drill
production support/on-call model
real AI model/provider eval
AI latency/cost/usefulness/runtime monitoring
priority runtime shadow/retirement evidence
```

`infra/main.bicep` being `Codified` is not Azure deployment evidence.

`evals/case-explanation-v1.jsonl` being `Codified` is not model-quality evidence.

`docs/one-man-project-operating-model.md` being `Codified` is not continuity evidence.

`docs/production-readiness-review.md` being `Codified` is not production readiness.

---

# Source policy for Chapters 25–26

## Chapter 25 — One-Man Project

Primary/authoritative sources include:

- Microsoft Research field experiments on AI coding-assistant task completion;
- Microsoft/ACM SPACE developer-productivity framing;
- OpenAI description of internal Codex workflows;
- GitHub SERVICEOWNERS engineering case.

Important restriction:

```text
higher individual task throughput
≠
one engineer replaces a team
```

ESI WIP limits, task classes, Secondary Maintainer and One-Man Project Operating Model are scenario/book constructs, not external standards.

Detailed claim audit:

- `reference/CHAPTER_025_EVIDENCE.md`.

## Chapter 26 — Production Readiness

Primary/authoritative sources include:

- AWS Well-Architected operational readiness / Operational Readiness Reviews;
- Google SRE launch checklist / production launch planning;
- Microsoft Azure Well-Architected safe deployment guidance;
- Google Cloud Deploy canary documentation;
- GitHub Engineering / Availability reports for deployment, canary, kill-switch/stability-gate and recovery-path examples.

Important restrictions:

```text
AWS ORR terminology
≠ universal mandatory standard

GitHub rollout percentages
≠ ESI rollout recommendation

checklist exists
≠ workload ready
```

Detailed claim audit:

- `reference/CHAPTER_026_EVIDENCE.md`.

---

# Important distinctions

## Fiction / evidence

```text
ESI decision
≠
real-world proof
```

## Legacy

```text
Observed legacy behavior
≠
Confirmed target requirement
```

## Cost

```text
resource/model price
≠
Total Cost of Ownership
```

```text
cost per token
≠
cost per useful outcome
```

## Agentic engineering

```text
instruction
≠ permission

issue ready
≠ outcome Verified

agent can perform action
≠ agent authorized to decide it

reviewer consensus
≠ critical finding resolved
```

## Runtime AI

```text
model output
≠ authoritative business fact

grounding
≠ vector database

RAG
≠ mandatory AI architecture

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

dashboard exists
≠ observability ready

runbook exists
≠ procedure exercised

risk discussed
≠ risk accepted by correct authority

one blocker closed
≠ production ready
```

---

# Numeri simulati ESI

Existing SLO/RTO/RPO remain simulated requirements, not benchmarks:

```text
Core journey SLO: 99.9% / rolling 28 days
Escalation publication: 99% <= 5 min
Intra-region RTO: <= 15 min
Intra-region RPO: 0 committed local state
Region disaster RTO: <= 8 h
Region disaster RPO: <= 1 h
```

One-Man Project WIP numbers are also ESI pilot decisions, not benchmarks.

The book must not invent:

```text
model accuracy/groundedness score
prompt-injection pass rate
provider/model latency or cost
production workload billing
capacity headroom result
restore time result
continuity drill result
production launch status
```

without actual execution evidence.

---

# Editorial workflow

```text
outline
→ ESI tension / compromise framing
→ source discovery
→ draft
→ capstone update
→ executable verification where possible
→ claim audit
→ compromise audit
→ adversarial review
→ editorial pass
```

For production-readiness chapters/work:

```text
launch boundary
→ claim
→ required evidence
→ primary evidence
→ limitation
→ blocker/risk classification
→ correct acceptance authority
→ launch decision
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
- real quantitative case-study results must remain attributed to their organizations and contexts.
