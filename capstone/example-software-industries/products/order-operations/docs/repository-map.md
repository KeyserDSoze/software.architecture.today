# Order Operations — Repository Map

> **Scenario fittizio ESI.** Navigation context for humans and agents. It routes to canonical knowledge; it does not duplicate it.

## Top-level

```text
order-operations/
├── AGENTS.md
├── README.md
├── package.json
├── tsconfig.json
├── database/
├── docs/
├── evals/
├── infra/
├── src/
├── tests/
└── work-items/
```

## Canonical routes

### Product semantics

```text
docs/functional-analysis.md
docs/priority-functional-analysis.md
docs/requirements.md
```

### Architecture / contracts / ownership

```text
docs/architecture-context.md
docs/architecture-fitness-checklist.md
docs/api-contract.md
docs/data-ownership.md
docs/events/
```

### Quality / failure / operations

```text
docs/nfr.md
docs/failure-mode-map.md
docs/threat-model.md
docs/security-control-matrix.md
docs/reliability-contract.md
docs/observability-contract.md
docs/testing-strategy.md
docs/cost-model.md
```

### Legacy / migration

```text
docs/legacy-understanding-map.md
docs/refactoring-safety-plan.md
```

### Runtime AI

```text
docs/ai-feature-contract.md
evals/case-explanation-v1.jsonl
src/ai/case-explanation.ts
```

### Agent / operating governance

```text
docs/agent-delegation-contract.md
docs/agent-verification-bundle.md
docs/ai-autonomy-matrix.md
docs/one-man-project-operating-model.md
```

### Production readiness

```text
docs/production-readiness-review.md
```

Current decision:

```text
PRR-OO-001
NO-GO — evidence closure required
```

The PRR is the canonical summary of launch boundaries, blockers, accepted-risk candidates and required evidence. It does not replace the deeper artifacts listed above.

## Source directories

### `src/application/`

Use-case orchestration. Must not depend directly on infrastructure mechanisms.

### `src/contracts/`

Implementation-independent integration contracts.

### `src/integration/`

Infrastructure-facing messaging/outbox mechanisms.

### `src/observability/`

Application telemetry boundary.

### `src/priority/`

Confirmed target priority semantics + explicit legacy compatibility/shadow seam.

### `src/ai/`

Runtime AI semantic contract and deterministic validation. Provider SDKs/model-specific implementation types stay outside this semantic boundary.

## Persistence

```text
database/migrations/
```

Current ownership rule:

> Order Operations persists facts it owns; it must not create a second authority for Orders/Payments/Shipping facts without an explicit decision.

Current unresolved high-fidelity evidence:

```text
OO-001
→ PaymentEscalation + Outbox PostgreSQL atomicity
```

## Infrastructure

```text
infra/main.bicep
infra/README.md
```

Current state:

```text
IaC intent = Codified
real Azure deployment evidence = Pending
```

Current PRR closure work:

```text
OO-003
→ verify Azure non-production deployment path
```

## AI evaluations

```text
evals/case-explanation-v1.jsonl
```

Dataset existence does not imply model quality is Verified.

Current eval work:

```text
OO-002
→ compare real model/provider candidates against the same eval oracle
```

## Tests

Current verification surface includes:

```text
payment-escalation.test.mjs
outbox-publisher.test.mjs
priority-policy.test.mjs
architecture-fitness.test.mjs
cost-fitness.test.mjs
agent-context-fitness.test.mjs
issue-readiness-fitness.test.mjs
agent-governance-fitness.test.mjs
ai-boundary-fitness.test.mjs
one-man-project-fitness.test.mjs
production-readiness-fitness.test.mjs
```

Additional legacy characterization lives under:

```text
../../legacy/operations-desk-classic/tests/
```

Important:

```text
green local test
≠ real PostgreSQL evidence
≠ Azure deployment evidence
≠ recovery drill
≠ production observability
≠ real model evaluation
≠ production readiness
```

## Work items

```text
work-items/TEMPLATE.md
work-items/OO-001-postgresql-escalation-outbox-atomicity.md
work-items/OO-002-case-explanation-model-evaluation.md
work-items/OO-003-verify-azure-nonprod-deployment.md
```

Meaning:

```text
OO-001
→ close PostgreSQL transaction evidence gap

OO-002
→ close AI model/provider evaluation gap

OO-003
→ close PRB-001 cloud deployment evidence gap
```

All are bounded execution contracts. None may silently change business semantics, authority, security policy or the PRR evidence oracle merely to obtain a green result.

## Change-to-context routing

| Change | Read/review at minimum |
|---|---|
| business rule | Functional Analysis, Requirements, tests |
| Payment Escalation | API/Event Contract, Data Ownership, Failure Mode Map |
| persistence | Data Ownership, migrations, Testing Strategy |
| cloud resource/topology | Cloud Deployment, Threat Model, Reliability, Cost, PRR |
| security boundary | Threat Model, Security Control Matrix, PRR |
| reliability/recovery | Reliability Contract, Failure Mode Map, PRR |
| observability/alert | Observability Contract, Testing Strategy, PRR |
| runtime AI | AI Feature Contract, evals, Threat/Testing/Observability/Cost, PRR |
| model/provider | AI Feature Contract, evals, OO-002, PRR |
| One-Man Project WIP/continuity | Operating Model, AGENTS, PRR when production ownership affected |
| launch boundary / blocker / risk acceptance | Production Readiness Review + primary evidence |
| new work | `work-items/TEMPLATE.md` + canonical context links |

## Golden commands

```bash
npm run typecheck
npm test
```

If these commands change, update `AGENTS.md` and this map in the same change.

## Evidence vocabulary

```text
Designed
→ Codified
→ Verified
→ Monitored
```

Legacy knowledge:

```text
Found
→ Inferred
→ Observed
→ Confirmed
```

Do not collapse the two dimensions.

## Ownership boundaries

- Commerce & Operations owns Order Operations product behavior.
- Payments & Risk owns economic/payment effects.
- Platform Engineering owns enterprise landing-zone/platform guardrails.
- Security owns enterprise security policy; the workload team owns workload implementation.
- Finance/FinOps participates when architecture premiums materially affect cost/value.
- Case Explanation Assistant is advisory, not a source of business authority.
- One-Man Project Accountable Lead integrates execution but is not sovereign authority across domains.
- Production risk must be accepted by the owner/authority appropriate to the risk.

## Current launch boundaries

```text
LB-CORE
→ NO-GO

LB-ESCALATION
→ BLOCKED

LB-PRIORITY-CANDIDATE
→ NOT AUTHORIZED

LB-AI
→ NOT READY / disabled
```

Do not convert these states based on schedule pressure. Update them only from new evidence, a changed launch boundary or explicit risk acceptance by the correct authority.

> **The map describes where knowledge and responsibility live. It must not become a second copy of that knowledge.**
