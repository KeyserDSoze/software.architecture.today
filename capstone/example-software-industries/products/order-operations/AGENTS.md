# Order Operations — Agent Operating Guide

This file is the tool-neutral operating entry point for coding agents working inside this product directory.

Keep it short. Detailed product and architecture knowledge lives in canonical documents under `docs/`.

## Product purpose

Order Operations is a simulated ESI product for operators handling orders that require operational attention.

It does **not** replace Orders, Payments or Shipping as authoritative sources.

Payments & Risk owns economic effects. Order Operations may request a Payment Escalation but does not own `PaymentStatus`, refund semantics or payment execution.

## Start here

Read `docs/repository-map.md` before a non-trivial change.

Then read the canonical documents relevant to the task.

Common routes:

- business behavior → `docs/functional-analysis.md`, `docs/requirements.md`
- priority behavior / legacy coexistence → `docs/priority-functional-analysis.md`, `docs/legacy-understanding-map.md`, `docs/refactoring-safety-plan.md`
- Payment Escalation → `docs/api-contract.md`, `docs/events/`, `docs/data-ownership.md`, `docs/failure-mode-map.md`
- cloud / security / reliability → `docs/cloud-deployment.md`, `docs/threat-model.md`, `docs/security-control-matrix.md`, `docs/reliability-contract.md`, `docs/cost-model.md`
- architecture policy → `docs/architecture-fitness-checklist.md`
- testing/evidence → `docs/testing-strategy.md`
- execution/discovery task contract → `work-items/TEMPLATE.md` and the specific work item under `work-items/`

Do not copy inferred behavior into canonical documentation as if it were confirmed. For legacy knowledge preserve the distinction `Found → Inferred → Observed → Confirmed`.

## Repository boundaries

- `src/application/` — application use-case orchestration. It must not depend directly on infrastructure mechanisms.
- `src/contracts/` — integration contract types. Keep implementation-independent.
- `src/integration/` — broker/outbox and infrastructure-facing mechanisms.
- `src/observability/` — application telemetry boundary; vendor adapter remains outside core semantics.
- `src/priority/` — confirmed priority policy and explicit legacy compatibility seam.
- `database/` — persistence owned by Order Operations only.
- `infra/` — Azure workload infrastructure. Security, reliability and cost decisions apply.
- `tests/` — behavioral, architecture, cost, issue-readiness and repository-context verification.
- `work-items/` — bounded discovery/execution contracts for current or future work; not a second copy of canonical architecture documentation.

Architecture rules are executable in `tests/architecture-fitness.test.mjs`.

Do not weaken an architecture fitness rule merely to make a task pass. If a rule appears obsolete, reopen the architectural decision and update its evidence/trigger instead.

## Golden verification commands

For normal application changes run:

```bash
npm run typecheck
npm test
```

Report failures and distinguish code/test failures from missing environment or external-service failures.

Do not claim PostgreSQL, Azure, production observability, recovery or runtime behavior as `Verified` unless the corresponding real gate was executed.

Evidence vocabulary:

```text
Designed → Codified → Verified → Monitored
```

## Change synchronization

If changing business semantics, update the relevant Functional Analysis / Requirements and tests.

If changing API/event semantics, review compatibility, ownership and the relevant contract documents.

If changing data ownership or persistence, update Data Ownership Map and migration evidence.

If changing cloud topology, review Threat Model, Reliability Contract, Cost Model and architecture fitness impact.

If changing a legacy/refactoring behavior, preserve characterization evidence and the expected-difference registry. Do not change legacy characterization tests just to make the target implementation pass.

If working from a `work-items/` execution task, preserve its outcome, scope, out-of-scope, acceptance criteria and stop conditions. New work discovered outside scope should be recorded as follow-up unless it is required to satisfy the declared acceptance properties.

## Stop conditions

Stop execution and request an explicit decision if the task requires any of the following and the decision is not already documented:

- a new economic side effect owned by Payments & Risk;
- a new authoritative data owner or duplicate authority;
- public Internet ingress;
- destructive or irreversible production data migration;
- weakening tenant isolation, authentication, authorization or least privilege;
- a breaking external contract change;
- changing confirmed functional semantics without Product/Operations decision context;
- removing legacy/fallback before its completion and rollback conditions are satisfied;
- changing an architecture/security/reliability rule only because the current implementation fails it.

A work item may define additional, narrower stop conditions. Those conditions remain part of the task contract.

## Security

Never add secrets, production credentials, private tokens or real customer data to source, fixtures, documentation, work items or this file.

Instructions explain how to work; they do not grant production permissions.

## Task discipline

Prefer the smallest semantic change that satisfies the task.

Do not absorb unrelated cleanup into the current task. Record follow-up work instead.

Treat file paths in a task as hints unless the task explicitly constrains them. Preserve the semantic scope and out-of-scope constraints.

Do not change an existing verification oracle merely to make a task green unless the work item explicitly authorizes a policy/test-baseline change and the corresponding decision has been reviewed.

For a new execution/discovery task, prefer `work-items/TEMPLATE.md` rather than an unstructured ad-hoc prompt when the work has material semantic, architectural, security or migration risk.

## Definition of done

For a normal code change:

1. the scoped behavior is implemented;
2. canonical docs are updated when semantics or decisions changed;
3. relevant tests were added/updated for the intended behavior;
4. `npm run typecheck` passes;
5. `npm test` passes, or failures/gaps are explicitly reported;
6. architecture/security boundaries were not silently weakened;
7. the final report distinguishes what was verified from what remains designed/pending;
8. if a work item was used, closure evidence records outcome, checks executed, limitations, `Not verified` and follow-up work.

> **Do not invent missing business semantics. Do not hide missing evidence.**