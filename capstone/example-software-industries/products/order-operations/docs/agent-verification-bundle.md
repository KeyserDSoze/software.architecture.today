# Order Operations — Agent Verification Bundle

> **Scenario fittizio ESI.** Questo documento definisce la forma minima dell'evidence package per work item delegati. Non dichiara OO-001 già verificata.

## Principle

> **La provenance dell'evidence vale più dell'eloquenza del summary.**

## Purpose

Comprimere execution evidence in una forma reviewable senza costringere il reviewer a rieseguire manualmente tutto il task.

Il bundle deve rendere leggibili:

```text
what was claimed
what was executed
what the primary evidence says
who/what independently checked it
what remains unknown
```

## Bundle identity

```text
Work Item: OO-001
Delegation ID: ADC-OO-001-v1
Implementation revision: <commit/branch/worktree revision>
Implementer: <agent/workflow identity>
Verifier: <independent verifier identity>
Human decision owner: Commerce & Operations engineering owner
Status: Pending execution
```

## Required claims for OO-001

### C-01 — Migration chain

```text
Claim
migration 001 → 002 executes successfully on a real PostgreSQL engine

Required evidence
engine identity/version
migration command/result
schema/object verification

Current state
Pending
```

### C-02 — Successful atomic commit

```text
Claim
a successful transaction commits one PaymentEscalation and the corresponding OutboxMessage together

Required evidence
integration scenario
transaction result
post-commit query/result for both persisted facts

Current state
Pending
```

### C-03 — Rollback on second-write failure

```text
Claim
when the outbox write fails before commit, neither PaymentEscalation nor OutboxMessage remains committed

Required evidence
failure injection description
transaction failure result
post-failure query/result for both tables

Current state
Pending
```

### C-04 — Fast-suite independence

```text
Claim
the normal fast local layer remains runnable without the PostgreSQL integration environment

Required evidence
fast command executed without integration dependency
result

Current state
Pending for OO-001 closure
```

### C-05 — Evidence boundary

```text
Claim
OO-001 closure does not overstate what the PostgreSQL test proves

Required evidence
explicit Not verified section
reviewer confirmation

Current state
Pending
```

## Evidence record template

For each claim:

```text
Claim ID
Claim text
Evidence mechanism
Environment / boundary exercised
Command/check executed
Result
Primary evidence reference
Verifier finding
Contradictions / anomalies
Known limitation
Status: PASS | FAIL | INCONCLUSIVE | STOPPED
```

## Primary evidence

Primary evidence should be reviewable whenever the claim matters.

Examples:

```text
raw test output
query output
migration output
diff
schema snapshot
trace/span reference
scanner result
policy decision
```

The Verifier must not rely solely on a natural-language summary produced by the Implementer for critical claims.

## Independent verification rubric

For OO-001 the Verifier checks at minimum:

1. a real PostgreSQL engine was exercised;
2. migrations `001` and `002` were not semantically rewritten merely to make the test pass;
3. success scenario inspects both persisted facts after commit;
4. failure scenario injects the second-write failure before commit;
5. failure scenario inspects both tables after rollback;
6. integration setup is isolated and reproducible enough for the declared gate;
7. the ordinary fast suite has not silently acquired a PostgreSQL runtime dependency;
8. no new authoritative Payment/Order/Shipping business fact was introduced;
9. evidence does not claim Azure networking, PostgreSQL HA, PITR, failover, performance or production readiness;
10. any stop condition encountered is reported rather than worked around silently.

## Contradiction search

Verifier should actively ask:

```text
Could both writes appear together because cleanup hides a partial commit?
Could the failure happen before the first write rather than on the second write?
Could the test be using an in-memory/fake adapter instead of PostgreSQL?
Could npm test now require Docker/PostgreSQL indirectly?
Could a migration change have made the test pass by changing the production baseline?
Could the test prove local transaction semantics but the closure report claim distributed end-to-end guarantees?
```

## Findings

Use severity rather than majority voting.

```text
Critical
→ blocks acceptance

Major
→ blocks unless explicitly resolved/accepted

Minor
→ follow-up may be acceptable

Observation
→ non-blocking context
```

A single critical finding is not cancelled by multiple positive reviewers.

## Known limitations

OO-001, even if fully passing, must retain limitations such as:

```text
local/test PostgreSQL only
not Azure Database for PostgreSQL network evidence
not HA/failover evidence
not performance/capacity evidence
not PITR/restore evidence
not Payments consumer evidence
not production observability evidence
```

## Not verified

Mandatory section.

At minimum before OO-001 execution:

```text
PostgreSQL atomicity on real engine       Pending
Azure managed PostgreSQL topology         Not verified
HA / zone failover                        Not verified
PITR                                      Not verified
production credentials/network            Not exercised
Payments downstream processing             Not part of task
```

Do not delete this section simply because all scoped tests pass.

## Stop conditions encountered

Record:

```text
none
```

or:

```text
Stop condition
Evidence
Decision required
Work safely preserved?
```

## Recommendation

Allowed values:

```text
ACCEPT SCOPED EVIDENCE
REQUEST CHANGES
STOP FOR DECISION
INCONCLUSIVE
```

Recommendation is not merge authority by itself.

## Human review packet

The human decision owner should be able to review:

```text
work item
implementation diff
bundle summary
primary evidence references
blocking findings
known limitations
```

without reproducing the entire execution from scratch.

## AI reviewer policy

An AI Verifier is a valid source of review signal.

It is not automatically a final authority.

For deterministic properties, deterministic evidence remains primary.

For high-impact policy/ownership changes, human/domain authority remains required by the current Autonomy Matrix.

## Current state

```text
Verification Bundle structure             Codified
OO-001 claims C-01…C-05                  Defined
Primary evidence                         Pending execution
Independent verifier result              Pending
Human acceptance                         Pending
```

> **A green bundle is not a story about success. It is a map from claims to evidence, with the unknowns left visible.**
