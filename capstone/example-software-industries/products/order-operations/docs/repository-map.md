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
├── evals/
├── infra/
├── src/
├── tests/
└── work-items/
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

### `src/ai/`

Responsibility:

- product-level runtime AI contracts;
- provider-neutral model boundary;
- deterministic validation that belongs outside the model.

Current file:

```text
case-explanation.ts
```

Current capability:

```text
Case Explanation Assistant
```

Canonical context:

```text
docs/ai-feature-contract.md
evals/case-explanation-v1.jsonl
docs/threat-model.md
docs/observability-contract.md
docs/cost-model.md
```

Architectural intent:

```text
model interpretation
≠
authoritative business fact
```

Provider SDKs and model-specific types do not belong in this semantic contract.

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

## `evals/`

Responsibility:

- versioned runtime AI evaluation scenarios;
- risk-driven inputs/required behavior/forbidden behavior;
- regression context for future model/provider comparison.

Current file:

```text
case-explanation-v1.jsonl
```

Current seed classes:

```text
nominal
missing-evidence
conflicting-evidence
prompt-injection
cross-tenant
authority-boundary
ambiguity
```

Important:

```text
eval dataset exists
≠
model quality Verified
```

No provider/model adapter has yet been run against the dataset.

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

No runtime AI model/provider resource has been added to IaC yet.

## `tests/`

Current verification surface:

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
```

Additional legacy characterization lives outside the product directory:

```text
../../legacy/operations-desk-classic/tests/
```

Testing strategy:

```text
docs/testing-strategy.md
```

Do not infer that a local green suite proves PostgreSQL, Azure, runtime observability, recovery or production AI behavior unless that boundary was actually exercised.

`agent-governance-fitness.test.mjs` checks selected mechanical properties of Delegation/Verification/Autonomy artifacts. It does not prove that an agent run or OO-001 completed successfully.

`ai-boundary-fitness.test.mjs` checks selected deterministic AI-boundary properties. It does not prove groundedness, prompt-injection resistance of a real model, latency, cost or production quality.

`one-man-project-fitness.test.mjs` checks selected mechanical operating-model properties such as WIP, non-authorities, continuity state and OO-002 eval-oracle discipline. It does not prove the One-Man Project model is operationally successful or that continuity has been demonstrated.

## `work-items/`

Responsibility:

- bounded discovery/execution task contracts;
- current task-specific outcome, scope, acceptance, verification and stop conditions;
- closure evidence after execution.

Current files:

```text
TEMPLATE.md
OO-001-postgresql-escalation-outbox-atomicity.md
OO-002-case-explanation-model-evaluation.md
```

`OO-001` exists because `TST-005` in the Testing Strategy still lacks higher-fidelity PostgreSQL evidence.

`OO-002` exists because the Case Explanation Assistant has no model/provider decision or real model evaluation evidence yet.

Both are T2 cross-boundary work items in the current One-Man Project Operating Model. Ready does not imply both should be Active at the same time.

Important distinction:

```text
repository canonical context
→ docs/

task-specific execution context
→ work-items/
```

A work item should route to canonical documents rather than duplicating their full content.

Mechanical readiness is checked by:

```text
tests/issue-readiness-fitness.test.mjs
```

The test checks structure and references; human/reviewer judgment still decides whether outcome, acceptance and stop conditions are semantically sufficient.

## Agent governance context

Current governance artifacts:

```text
docs/agent-delegation-contract.md
docs/agent-verification-bundle.md
docs/ai-autonomy-matrix.md
```

Responsibilities:

### `agent-delegation-contract.md`

Defines the mandate for delegated execution:

```text
role
allowed/forbidden scope
capabilities
permission boundary
retry budget
stop conditions
escalation
required verification
```

Current binding:

```text
ADC-OO-001-v1
→ OO-001
→ Implementer
→ A2 bounded execution
```

OO-002 has an execution contract but requires a task-specific delegation contract before actual agent execution if delegated under the Chapter 23 governance model.

### `agent-verification-bundle.md`

Defines claim-to-evidence structure and independent verification expectations.

Current OO-001 claims:

```text
C-01 migration chain
C-02 successful atomic commit
C-03 rollback on second-write failure
C-04 fast-suite independence
C-05 evidence boundary
```

Status remains `Pending execution` until primary evidence exists.

### `ai-autonomy-matrix.md`

Defines capability-specific A0…A4 levels and human gates for development/execution agents.

Runtime AI authority is separately constrained by `docs/ai-feature-contract.md`.

An executor may propose an autonomy change but cannot grant itself the permission required to finish the current task.

## One-Man Project operating context

Canonical artifact:

```text
docs/one-man-project-operating-model.md
```

Purpose:

- govern the Case Explanation Assistant pilot with one accountable project lead;
- keep specialist/domain authority explicit;
- cap WIP by review/decision capacity rather than agent availability;
- require a secondary maintainer and continuity plan;
- define exit triggers when the operating model stops having fit.

Current WIP baseline:

```text
Max active execution tasks       2
Max active cross-boundary tasks  1
Max unresolved semantic gates    1
```

Current continuity drill:

```text
Designed / not yet executed
```

Do not interpret the existence of the operating-model document as continuity evidence.

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
ai-feature-contract.md
```

Use when changing component responsibility, contract, ownership, dependency direction or runtime AI authority/context/tool boundary.

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
one-man-project-operating-model.md
```

Use when changing a quality attribute, failure behavior, cloud mechanism, telemetry, test/eval evidence, architectural premium, WIP/continuity policy or operating-model fit.

### Agent execution / governance

```text
agent-delegation-contract.md
agent-verification-bundle.md
ai-autonomy-matrix.md
```

Use when delegated-development scope, permission, verification independence or autonomy changes.

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
| PostgreSQL transaction evidence | Testing Strategy, Data Ownership, migrations, relevant work item, active Delegation Contract |
| Runtime AI authority/output | AI Feature Contract, Functional Analysis/ownership, evals, Testing Strategy |
| Runtime AI context/retrieval | AI Feature Contract, Data Ownership, Threat Model, evals |
| Runtime AI write/tool capability | AI Feature Contract, Threat Model, AI Autonomy Matrix, API/authorization, Failure Mode Map, Testing Strategy |
| Model/provider change | AI Feature Contract, evals, Observability Contract, Cost Model, OO-002 |
| One-Man Project WIP/continuity/decision rights | One-Man Project Operating Model, AGENTS.md, relevant work items, AI/agent governance |
| Cloud resource/topology | Cloud Deployment, Threat Model, Reliability Contract, Cost Model |
| New security boundary | Threat Model, Security Control Matrix, relevant ADR |
| New retry/failure behavior | Failure Mode Map, Reliability Contract, Testing Strategy |
| New telemetry | Observability Contract, Cost Model |
| Architecture rule | Architecture Fitness Checklist + executable test where mechanical |
| Legacy retirement | Legacy Understanding Map, Refactoring Safety Plan, characterization evidence |
| New discovery/execution task | `work-items/TEMPLATE.md` + canonical context links |
| Agent permission/autonomy | Delegation Contract, AI Autonomy Matrix, Threat Model/Security context |
| Agent evidence/acceptance model | Agent Verification Bundle, Testing Strategy, Architecture Fitness Checklist |

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

An AI Feature Contract being `Codified` does not imply model quality is `Verified`.

A One-Man Project Operating Model being `Codified` does not imply continuity, sustainable throughput or organizational fit are `Verified`.

## Ownership / decision boundaries

- Commerce & Operations owns Order Operations product behavior.
- Payments & Risk owns economic/payment effects.
- Platform Engineering owns enterprise platform/landing-zone guardrails.
- Security owns enterprise security policy; product teams still own workload security implementation.
- Finance/FinOps participates when architectural premiums materially affect cost/value.
- Human/domain owners retain authority for the high-impact gates listed in the AI Autonomy Matrix.
- Case Explanation Assistant is advisory and does not become a new source of business authority.
- The One-Man Project Accountable Project Lead integrates execution but does not become sovereign authority over these domains.

## Stop conditions

The operational stop conditions are canonical in `../AGENTS.md`.

A work item or Delegation Contract may add narrower stop conditions specific to the task.

This map intentionally does not duplicate the full list.

## Maintenance rule

Update this map when:

- a top-level directory responsibility changes;
- a canonical document is added/renamed/retired;
- golden commands change;
- a new capability creates a new navigation path;
- a former temporary migration boundary becomes permanent or is removed;
- the work-item model or task-routing rules change materially;
- the agent governance model changes materially;
- runtime AI context, provider/tool boundary or eval surface changes materially;
- One-Man Project WIP, continuity, specialist triggers, secondary-maintainer expectations or exit criteria change materially.

> **The map describes where knowledge and responsibility live. It must not become a second copy of that knowledge.**