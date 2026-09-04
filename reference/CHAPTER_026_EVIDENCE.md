# Chapter 26 — Evidence Audit

Chapter:

> **Production Readiness**

## Editorial status

```text
Draft                    yes
Source-first pass        yes
ESI compromise pass      yes
Capstone evolution       yes
Production Readiness Review persisted
```

## Main external sources

### AWS — Operational Readiness Reviews

Sources:

- https://docs.aws.amazon.com/wellarchitected/latest/operational-readiness-reviews/wa-operational-readiness-reviews.html
- https://docs.aws.amazon.com/wellarchitected/latest/framework/ops-07.html
- https://docs.aws.amazon.com/wellarchitected/latest/framework/ops_ready_to_support_const_orr.html

Supported framing:

- readiness should cover workload, processes, procedures and personnel;
- consistent review before launch/change;
- runbooks/playbooks and support plans matter;
- ORR questions can evolve from incident learning;
- ORR is not only a one-time pre-launch ritual.

Not inferred:

```text
AWS ORR checklist = universal checklist for ESI
AWS terminology = mandatory industry standard
```

### Google SRE — Launch planning

Sources:

- https://sre.google/sre-book/launch-checklist/
- https://sre.google/resources/practices-and-processes/production-launch-planning/

Supported framing:

- launch planning includes architecture, capacity, failure/failover, dependency behavior and operations;
- launch-planning depth should be adapted to launch size/context.

Historical checklist details are not treated as current universal technology recommendations.

### Microsoft Azure Well-Architected — safe deployment

Source:

- https://learn.microsoft.com/en-us/azure/well-architected/operational-excellence/checklist

Supported framing:

- safe deployment practices should use quality gates and incremental/progressive exposure where appropriate;
- operational excellence includes human intervention where useful and automation where appropriate.

### Google Cloud Deploy — canary

Source:

- https://docs.cloud.google.com/deploy/docs/deployment-strategies/canary

Supported framing:

- canary rollout can progressively expose a release;
- analysis/metrics can be used to decide whether rollout advances.

No ESI rollout percentage is derived from this source.

### GitHub — deployment and availability cases

Sources:

- https://github.blog/enterprise-software/devops/improving-how-we-deploy-github/
- https://github.blog/engineering/infrastructure/ship-code-faster-safer-feature-flags/
- https://github.blog/news-insights/company-news/github-availability-report-june-2026/
- https://github.blog/news-insights/company-news/github-availability-report-march-2026/
- https://github.blog/engineering/infrastructure/how-github-uses-ebpf-to-improve-deployment-safety/

Supported use:

- GitHub described multi-stage canary deployment evolution;
- feature flags can reduce exposure and enable rapid behavior disablement in described workflows;
- June 2026 report describes pausing a traffic ramp and introducing a per-turnup stability gate;
- March 2026 report describes rollback after a cache-related deployment issue and subsequent kill-switch/monitoring changes;
- GitHub has described circular-dependency concerns in its own deployment/recovery tooling and mitigations.

These are organization-specific cases. The chapter extracts questions/principles, not architecture prescriptions.

## ESI-specific concepts

The following are book/capstone constructs, not external standards:

```text
LB-CORE
LB-ESCALATION
LB-PRIORITY-CANDIDATE
LB-AI

PRB-001…PRB-006
PRB-ESC-001
PRB-AI-001

PRR-OO-001
OO-003
```

## ESI compromise

```text
Need
start real operational use and stop accumulating preparation indefinitely

Tension
Product/Sales want a launch date
vs
Security/Reliability/Operations require evidence
vs
Engineering wants progress without checklist bureaucracy

Decision
separate launch boundaries
+ classify blocker/accepted-risk/follow-up/unknown
+ keep core, escalation, priority and AI readiness independent
+ current PRR remains NO-GO until launch-critical evidence closes

Accepted cost
launch is delayed or narrowed; some capability remains disabled; more environment/drill work required

Quality floor
tenant isolation, data integrity, required recovery, operability, evidence provenance and domain authority are not downgraded by schedule pressure

Guardrail
Production Readiness Review + blocker register + claim→evidence→limitation + OO-003 + production-readiness fitness
```

## Capstone artifacts

```text
docs/production-readiness-review.md
work-items/OO-003-verify-azure-nonprod-deployment.md
tests/production-readiness-fitness.test.mjs
```

## Current capstone readiness state

```text
PRR-OO-001
Decision = NO-GO — evidence closure required
```

Key current blockers include:

```text
cloud deployment evidence
security runtime evidence
recovery evidence
observability/alert evidence
support/continuity evidence
capacity evidence
```

Capability-specific gaps:

```text
OO-001 PostgreSQL atomicity
→ blocks Payment Escalation

OO-002 real model/provider evaluation
→ blocks Case Explanation Assistant
```

Priority target cutover remains `NOT AUTHORIZED`.

## Verification caveat

`tests/production-readiness-fitness.test.mjs` is committed and therefore `Codified`.

Do not describe `PRR-001…PRR-005` as locally `Verified` unless the actual test runner is executed successfully on the current checkout/CI.

The test is designed to protect mechanical properties such as:

- PRR remains `NO-GO` while core blockers are open;
- capability-specific readiness is not falsely inherited;
- claim-to-evidence boundaries remain explicit;
- OO-003 cannot mark the PRR ready merely by weakening evidence requirements.

It does not prove production readiness.

## Release pass reminders

Before release candidate:

1. recheck current source URLs and factual wording;
2. preserve organization-specific percentages/context in GitHub cases;
3. do not present ORR/PRR naming as a universal standard;
4. keep ESI `NO-GO` aligned with actual capstone evidence;
5. if blockers are later executed, update PRR and evidence audit based on primary evidence;
6. distinguish a production-readiness fitness test from real environment readiness evidence.
