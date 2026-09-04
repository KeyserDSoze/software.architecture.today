# Order Operations — Agent Delegation Contract

> **Scenario fittizio ESI.** Prima baseline dopo il Capitolo 23. Questo documento governa il mandato operativo di agenti che eseguono work item su Order Operations. Non concede production permissions e non sostituisce il work item.

## Principle

> **Delegare execution non significa delegare automaticamente scope, permission, verification threshold o final authority.**

## Contract identity

```text
Delegation ID: ADC-OO-001-v1
Work item: work-items/OO-001-postgresql-escalation-outbox-atomicity.md
Role: Implementer
Autonomy level: A2 — Execute + verify in bounded environment
Human decision owner: Commerce & Operations engineering owner
```

## Goal

Produrre evidence PostgreSQL più fedele per:

```text
TST-005
PaymentEscalation + Outbox atomicity
```

senza modificare la semantica di Payment Escalation, data ownership o gli altri architectural boundary correnti.

## Canonical task source

La source of truth del task resta:

```text
work-items/OO-001-postgresql-escalation-outbox-atomicity.md
```

Questo contract aggiunge permission/autonomy constraints. Non ricopia l'intera issue.

## Required repository context

Prima dell'execution:

```text
AGENTS.md
docs/repository-map.md
docs/testing-strategy.md
docs/data-ownership.md
docs/failure-mode-map.md
docs/architecture-fitness-checklist.md
work-items/OO-001-postgresql-escalation-outbox-atomicity.md
```

## Allowed scope

L'Implementer può lavorare dentro il change surface autorizzato da OO-001:

```text
tests/integration/**
test-only persistence/database adapters or helpers
package.json scripts required by the integration layer
reproducible local/CI test environment configuration
supporting documentation for the integration test layer
```

Può scegliere il meccanismo locale più piccolo che soddisfa l'outcome, per esempio container/test environment equivalente, purché restino veri permission e reproducibility constraints.

## Allowed capabilities

```text
read/search repository
edit files inside scoped branch/worktree
run npm/typecheck/test commands
start an isolated test PostgreSQL engine
apply current migration chain in test environment
run deterministic integration checks
add a justified test-only dependency
produce diff and closure report
```

## Forbidden capabilities / actions

Questo contract **non** autorizza:

```text
merge default branch
access production credentials or customer data
use production Azure resources
modify Payment Escalation business semantics
modify Payments & Risk ownership
introduce a new authoritative business fact
rewrite migration 001 or 002 merely to make tests pass
weaken architecture/security/context/cost fitness rules to make the task pass
change confirmed functional semantics
approve an architecture exception
increase its own autonomy level
```

## Permission model

### Repository

```text
read repository          allowed
edit scoped branch       allowed
create/update task PR    platform-dependent, allowed only inside repo policy
merge main               human/repository gate
```

### Environment

```text
isolated local/test PostgreSQL   allowed
shared production-like DB        forbidden by this contract
production Azure                 forbidden
production secret                forbidden
```

### Policy

```text
propose policy change            allowed as a stopped finding
approve policy change            forbidden
modify autonomy matrix to proceed forbidden
```

## Execution discipline

Before first write the executor should produce a short plan that maps steps to OO-001 acceptance evidence.

The plan must not introduce new scope.

Recommended shape:

```text
Step
Expected evidence
Files/environment involved
Stop condition checked
```

## Retry / repair budget

Baseline:

```text
initial complete attempt
+ at most 2 bounded repair loops
```

A repair loop is justified when new evidence identifies an execution defect inside the existing scope.

Do not use the repair budget to reinterpret a stop condition or repeatedly attempt the same failing action without new information.

After the budget is exhausted:

```text
Stopped
→ report evidence
→ classify blocker
→ request human/owner decision
```

## Stop conditions

All OO-001 stop conditions apply.

Additionally stop when:

1. execution requires broader repository or cloud permission than defined here;
2. a shared privileged environment becomes necessary;
3. the only path to green requires changing an existing verification oracle outside the issue scope;
4. the task requires a new architecture/security/data/product decision;
5. evidence contradicts the canonical Data Ownership Map or migration assumptions;
6. a retry/repair budget is exhausted without satisfying the acceptance property;
7. the executor would need to increase its own autonomy to proceed.

## Valid stopped output

A stopped execution is valid when it returns:

```text
Status: Stopped
Work item
Delegation ID
Reason
Evidence collected
Files changed, if any
Decision required
Suggested follow-up
Not verified
```

## Required verification

The implementation is not complete merely because it builds.

It must produce the evidence expected by:

```text
docs/agent-verification-bundle.md
```

and by OO-001 acceptance criteria.

## Independent verification

The Implementer must not be the only authority promoting the result to accepted evidence.

Baseline:

```text
Implementer output
→ deterministic integration evidence
→ independent Verifier role
→ human/repository merge gate
```

The Verifier should inspect primary evidence, not only the Implementer's summary.

## Security boundary

- no secrets in prompts, docs, fixtures or source;
- no production customer data;
- no implicit production permission from `AGENTS.md` or this contract;
- test environment must be isolated/reproducible;
- network/tool permission escalation is a stop condition unless separately authorized.

## Change policy

This contract may be revised when the task or risk model changes.

The active executor may **propose** a revision but may not approve a revision that increases its own scope, permission or autonomy for the current execution.

Any such revision requires the relevant owner and must update:

```text
docs/ai-autonomy-matrix.md
Threat/Security context when relevant
work item if scope changes
```

## Current evidence state

```text
Delegation Contract             Codified
OO-001 issue readiness          Codified + locally exercised 4/4
OO-001 PostgreSQL execution     Not yet executed
OO-001 PostgreSQL atomicity     Designed / Pending
Independent Verification Bundle template Codified
Production permission           Not granted
```

> **The contract creates a mandate. It does not create evidence that the mandate was successfully executed.**
