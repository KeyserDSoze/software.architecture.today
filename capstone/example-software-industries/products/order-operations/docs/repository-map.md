# Order Operations — Repository Map

> **Scenario fittizio ESI.** This map is navigation context for humans and agents. It does not replace the canonical documents it points to.

## Purpose

Order Operations helps ESI operators identify, understand and manage orders requiring operational attention.

The product owns operational case handling and the intention to request a Payment Escalation. It does not own Orders, Payments or Shipping business truth.

## Top-level map

```text
order-operations/
├── AGENTS.md
├── README.md
├── package.json
├── tsconfig.json
├── database/
├── docs/
├── infra/
├── src/
└── tests/
```

## `src/`

### `src/application/`

Responsibility:

- application use-case orchestration;
- business/application flow over explicit ports.

Current example:

```text
request-payment-escalation.ts
```

Architectural intent:

- must not depend directly on infrastructure mechanisms;
- Azure SDKs do not belong here;
- external side effects must respect ownership/contract boundaries.

Relevant evidence:

```text
tests/payment-escalation.test.mjs
tests/architecture-fitness.test.mjs
```

### `src/contracts/`

Responsibility:

- integration contract types independent from application and infrastructure implementation.

Current example:

```text
operational-case-payment-escalated-v1.ts
```

Canonical context:

```text
docs/events/
docs/api-contract.md
```

### `src/integration/`

Responsibility:

- infrastructure-facing integration mechanisms;
- outbox publication and broker-facing ports/adapters.

Current example:

```text
outbox-publisher.ts
```

Canonical context:

```text
docs/failure-mode-map.md
docs/reliability-contract.md
docs/observability-contract.md
```

### `src/observability/`

Responsibility:

- application-level telemetry contract and observation decorators;
- keep core semantics independent from a telemetry vendor SDK.

Canonical context:

```text
docs/observability-contract.md
```

### `src/priority/`

Responsibility:

- target priority semantics;
- explicit compatibility boundary with Operations Desk Classic;
- legacy/candidate/shadow decision routing.

Current files:

```text
priority-policy.ts
confirmed-priority-policy.ts
legacy-priority-adapter.ts
branching-priority-policy.ts
```

Canonical context:

```text
docs/priority-functional-analysis.md
docs/legacy-understanding-map.md
docs/refactoring-safety-plan.md
```

Important:

```text
legacy behavior Observed
≠
target requirement Confirmed
```

ED-001 intentionally removes the historical `Enterprise + age >= 30m → URGENT` rule from the target semantics.

## `database/`

Responsibility:

- PostgreSQL persistence owned by Order Operations;
- migration history.

Current migrations:

```text
001_create_operational_case.sql
002_add_payment_escalation_and_outbox.sql
```

Canonical context:

```text
docs/data-ownership.md
docs/nfr.md
docs/failure-mode-map.md
```

Do not introduce authoritative copies of Payments/Orders/Shipping facts without an explicit ownership decision.

## `infra/`

Responsibility:

- current Azure workload infrastructure expressed in Bicep.

Canonical context:

```text
docs/cloud-deployment.md
docs/threat-model.md
docs/security-control-matrix.md
docs/reliability-contract.md
docs/cost-model.md
docs/architecture-fitness-checklist.md
```

Current architectural direction includes private ingress/data-plane controls, managed identity, Service Bus Premium and zone resilience decisions.

`infra/main.bicep` is **Codified**, but production/deployment evidence remains incomplete until the real Azure verification gates are executed.

## `tests/`

Current verification surface:

```text
payment-escalation.test.mjs
outbox-publisher.test.mjs
priority-policy.test.mjs
architecture-fitness.test.mjs
cost-fitness.test.mjs
agent-context-fitness.test.mjs
```

Additional legacy characterization lives outside the product directory:

```text
../../legacy/operations-desk-classic/tests/
```

Testing strategy:

```text
docs/testing-strategy.md
```

Do not infer that a local green suite proves PostgreSQL, Azure, runtime observability, recovery or production behavior unless that boundary was actually exercised.

## `docs/` — canonical context routes

### Product semantics

```text
functional-analysis.md
priority-functional-analysis.md
requirements.md
```

Use when changing product behavior, business rules, actors, flows or acceptance semantics.

### Architecture and boundaries

```text
architecture-context.md
architecture-fitness-checklist.md
api-contract.md
data-ownership.md
```

Use when changing component responsibility, contract, ownership or dependency direction.

### Failure / quality / operations

```text
nfr.md
failure-mode-map.md
threat-model.md
security-control-matrix.md
reliability-contract.md
observability-contract.md
testing-strategy.md
cost-model.md
```

Use when changing a quality attribute, failure behavior, cloud mechanism, telemetry, test evidence or architectural premium.

### Legacy / migration

```text
legacy-understanding-map.md
refactoring-safety-plan.md
```

Use when touching Operations Desk Classic coexistence, PriorityPolicy migration, shadow comparison or retirement.

### Cloud

```text
cloud-deployment.md
adr/
```

Use when changing topology or revisiting an architecturally significant decision.

## Change-to-context routing

| Change | Read/review at minimum |
|---|---|
| New business rule | Functional Analysis, Requirements, tests |
| Priority rule | Priority Functional Analysis, Legacy Understanding Map, Refactoring Safety Plan |
| Payment Escalation semantics | API Contract, Event Contract, Data Ownership, Failure Mode Map |
| New persisted fact | Data Ownership Map, schema/migration, NFR |
| Cloud resource/topology | Cloud Deployment, Threat Model, Reliability Contract, Cost Model |
| New security boundary | Threat Model, Security Control Matrix, relevant ADR |
| New retry/failure behavior | Failure Mode Map, Reliability Contract, Testing Strategy |
| New telemetry | Observability Contract, Cost Model |
| Architecture rule | Architecture Fitness Checklist + executable test where mechanical |
| Legacy retirement | Legacy Understanding Map, Refactoring Safety Plan, characterization evidence |

## Golden commands

Canonical local verification commands are defined by `package.json`:

```bash
npm run typecheck
npm test
```

Treat the commands as repository API: if they change, update `AGENTS.md`, this map and the relevant verification documentation in the same change.

## Evidence vocabulary

For capabilities/artifacts:

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

Do not collapse these dimensions.

## Ownership / decision boundaries

- Commerce & Operations owns Order Operations product behavior.
- Payments & Risk owns economic/payment effects.
- Platform Engineering owns enterprise platform/landing-zone guardrails.
- Security owns enterprise security policy; product teams still own workload security implementation.
- Finance/FinOps participates when architectural premiums materially affect cost/value.

## Stop conditions

The operational stop conditions are canonical in `../AGENTS.md`.

This map intentionally does not duplicate the full list.

## Maintenance rule

Update this map when:

- a top-level directory responsibility changes;
- a canonical document is added/renamed/retired;
- golden commands change;
- a new capability creates a new navigation path;
- a former temporary migration boundary becomes permanent or is removed.

> **The map describes where knowledge and responsibility live. It must not become a second copy of that knowledge.**