# <ID> — <Outcome-oriented title>

> Work item template for Order Operations. Use the smallest structure that still makes the task execution-ready. Delete guidance comments when instantiating.

## Type

`Execution | Discovery`

## Problem

What is wrong, missing, risky, or unknown in the current state?

## Outcome

What observable state must be true when this work item is complete?

## Current evidence

What do we know now, and what is the evidence state?

```text
Designed | Codified | Verified | Monitored
Found | Inferred | Observed | Confirmed
```

## Scope

What may be changed or investigated?

## Out of scope

What must not be absorbed into this task?

## Canonical context

Link repository sources of truth; do not copy their full content here.

- `AGENTS.md`
- `docs/repository-map.md`

## Acceptance criteria

State properties, not merely commands.

- AC-01 — ...

## Verification

Map acceptance properties to evidence-producing mechanisms.

```text
AC-01
→ <verification mechanism>
```

## Constraints

Existing decisions, boundaries, environment/security constraints, and forbidden shortcuts.

## Stop conditions

Stop and escalate when the task crosses a decision boundary that is not authorized here.

1. ...

## Dependencies

```text
Blocked by:
Blocks:
Related:
Decision required from:
```

## Closure evidence

Record on completion:

```text
Outcome achieved
Files changed
Commands / checks executed
Evidence result
Known limitations
Not verified
Follow-up
```

## AI execution notes

If delegated to an agent:

- follow `AGENTS.md`;
- do not silently expand scope;
- do not weaken an existing verification oracle merely to make the task pass;
- report discovered work outside scope as follow-up;
- stop when a stop condition becomes true.
