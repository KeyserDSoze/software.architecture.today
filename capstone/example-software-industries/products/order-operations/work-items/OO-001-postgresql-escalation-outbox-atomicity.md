# OO-001 — Verify PostgreSQL atomicity for Payment Escalation + Outbox

## Type

`Execution`

## Problem

Order Operations currently has fast application/orchestration tests showing that the use case intends to persist `PaymentEscalation` and `OutboxMessage` together.

That evidence does **not** prove the real PostgreSQL transaction boundary.

`docs/testing-strategy.md` already records this gap as:

```text
TST-005
PaymentEscalation + Outbox atomic
Fast evidence: orchestration
Higher-fidelity evidence: PostgreSQL transaction
Gate: PR
```

A fake repository is not evidence of PostgreSQL commit/rollback semantics.

## Outcome

Create a reproducible integration test layer that exercises the current migration chain on a **real PostgreSQL engine** and proves the local atomicity property for Payment Escalation + Outbox.

The desired property is:

```text
successful transaction
→ PaymentEscalation committed
→ corresponding OutboxMessage committed

transaction failure before commit
→ neither committed

failure on second write before commit
→ neither committed
```

## Current evidence

```text
application orchestration intent
= Codified + previously Verified locally

PostgreSQL transaction semantics
= Designed / Pending

migration chain 001 → 002 on real PostgreSQL
= Designed / Pending
```

## Scope

Allowed change surface:

```text
tests/integration/**
test-only database adapters/helpers
package.json scripts needed to run the integration layer
reproducible local/CI test-environment configuration
supporting documentation required by the new test layer
```

A test-only dependency may be introduced when it materially improves reproducibility and is justified in the closure report.

## Out of scope

Do **not** absorb any of the following into this work item:

- change Payment Escalation business semantics;
- change Payments & Risk ownership;
- change the event v1 contract;
- add new production persistence fields;
- redesign PostgreSQL topology;
- change RTO/RPO;
- change Azure networking;
- rewrite migration `001` or `002` merely to make the test pass;
- introduce production cloud resources only to run this test.

## Canonical context

Read before implementation:

- `AGENTS.md`
- `docs/repository-map.md`
- `docs/testing-strategy.md`
- `docs/data-ownership.md`
- `docs/failure-mode-map.md`
- `database/README.md`
- `database/migrations/001_create_operational_case.sql`
- `database/migrations/002_add_payment_escalation_and_outbox.sql`

Relevant architecture context:

- Order Operations owns the escalation intent and local outbox entry.
- Payments & Risk owns economic payment effects.
- Existing migrations are current historical baseline, not fixtures to rewrite for convenience.

## Acceptance criteria

### AC-01 — Migration chain executes on real PostgreSQL

Starting from an empty database, migrations `001` and `002` can be applied in order and produce a schema usable by the integration tests.

### AC-02 — Successful atomic commit

When the persistence transaction succeeds, exactly one test `PaymentEscalation` and its corresponding `OutboxMessage` are committed together.

### AC-03 — Rollback on second-write failure

When the outbox write is forced to fail before transaction commit, neither the `PaymentEscalation` nor the `OutboxMessage` is committed.

### AC-04 — Deterministic isolation and cleanup

The integration suite can be rerun without depending on state left by a previous run.

### AC-05 — Fast feedback remains independent

The normal fast local layer must remain runnable without requiring the PostgreSQL integration environment to be already running.

### AC-06 — Evidence scope remains explicit

Passing this work item may promote PostgreSQL atomicity/migration-chain evidence for the exercised scenarios, but must **not** be described as proof of Azure Database for PostgreSQL networking, HA, performance, PITR, failover, or production readiness.

## Verification

Minimum evidence mapping:

```text
AC-01
→ integration setup runs migrations 001 + 002 against real PostgreSQL

AC-02
→ query persisted rows after successful transaction

AC-03
→ inject second-write failure and query both tables after rollback

AC-04
→ run integration suite repeatedly from isolated/clean state

AC-05
→ existing fast test command remains independent from integration environment

AC-06
→ closure report includes explicit Not verified section
```

Preferred command shape after implementation:

```text
npm run test:integration
```

The exact command name is a local implementation choice, not the acceptance property.

## Constraints

- real PostgreSQL engine required for the higher-fidelity evidence;
- no production credentials or customer data;
- no dependency on production Azure resources;
- environment must be reproducible for a developer or CI runner;
- existing migrations remain immutable baseline for this task;
- do not weaken architecture/context/cost fitness rules to make the task pass;
- keep test-only infrastructure out of the production domain model;
- record any new dependency and its purpose.

## Stop conditions

Stop execution and request a decision if any of these becomes true:

1. migration `001` or `002` requires a semantic change for the test to proceed;
2. the real schema contradicts `docs/data-ownership.md`;
3. the test requires introducing a new authoritative business field;
4. the rollback scenario cannot be exercised without changing production behavior;
5. the only viable environment requires a shared production-like credential or production Azure resource;
6. a discovered incompatibility requires a new ADR or product decision;
7. passing the test requires changing an existing verification rule rather than fixing the implementation/harness.

A valid stopped outcome is:

```text
Stopped
Evidence collected
Decision required
Suggested follow-up
```

## Dependencies

```text
Blocked by:
- none; current semantic/ownership decisions are sufficient

Blocks:
- stronger TST-005 evidence
- future CI integration gate for PostgreSQL transaction semantics

Related:
- TST-015 migration chain verification
- database/README.md
- Failure Mode Map atomicity assumptions

Decision required from:
- none at start
```

## Closure evidence

On completion record:

```text
Outcome achieved
Environment mechanism chosen and why
Files changed
Dependencies added
Commands/checks executed
Migration 001 → 002 result
Atomic success result
Rollback result
Fast-suite independence result
Known limitations
Not verified
Follow-up issues
```

## AI execution notes

This work item is suitable for delegated execution **only while the stop conditions remain false**.

An agent may choose the smallest reversible test-environment mechanism that satisfies the acceptance properties.

It may not:

- invent new business semantics;
- rewrite historical migrations to obtain green evidence;
- expand the task into cloud deployment;
- silently turn a discovered schema problem into a test fixture workaround.

> **The task is to prove the transaction property, not to make a PostgreSQL-looking test turn green.**
