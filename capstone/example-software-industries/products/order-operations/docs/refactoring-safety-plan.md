# Order Operations — Refactoring Safety Plan

> **Scenario fittizio ESI.** Piano corrente dopo il Capitolo 18 per migrare la priority routing da Operations Desk Classic a Order Operations.

## Goal

Spostare la decisione di priorità operativa nel modello di Order Operations preservando i behavior confermati e rimuovendo intenzionalmente la vecchia regola Enterprise `>=30 min`.

## Scope

```text
PriorityPolicy seam
LegacyPriorityAdapter
ConfirmedPriorityPolicy
BranchingPriorityPolicy
shadow comparison
expected difference ED-001
local verification
```

## Out of scope

```text
priority persistence ownership
shared legacy DB retirement
nightly export replacement
new public API
manual-hold command
production feature-flag provider
production shadow rollout
legacy deletion
```

## Behavior classification

| Legacy | Target | Classification |
|---|---|---|
| `CLOSED → NONE` | `Closed → NotActionable` | Required |
| `manual_hold → MANUAL_REVIEW` | `manualHold → ManualReview` | Required |
| `PAY + failed_attempts>=3 → URGENT` | `Payment + failedAttempts>=3 → Urgent` | Required |
| `ENTERPRISE + age>=30m → URGENT` | no enterprise-only escalation | Removed by explicit ESI decision / ED-001 |
| enterprise before threshold → STANDARD | default policy | not independent requirement |
| ordinary open → STANDARD | `Standard` | Required default |

Source of functional decision:

```text
docs/priority-functional-analysis.md
```

## Invariants

1. Closed cases remain non-actionable.
2. Manual hold retains precedence over automated urgency.
3. Repeated payment failure remains urgent at the current simulated threshold `>=3`.
4. Default open case remains standard.
5. During shadow mode the legacy path remains authoritative.
6. Candidate shadow execution produces no external side effect.
7. Legacy naming does not leak into the target policy contract.
8. No database/schema/API change is introduced by this slice.
9. Any semantic mismatch other than ED-001 is unexplained until reviewed.

## Expected Difference Registry

### ED-001 — Remove historical Enterprise timer

```text
Legacy:
customer_tier = ENTERPRISE
AND age >= 30m
→ URGENT

Target:
customer tier alone does not raise priority
→ STANDARD unless another confirmed rule applies
```

Owner in simulated ESI scenario:

```text
Product + Operations
```

Status:

```text
Approved before shadow rollout
```

Cleanup condition:

```text
remove registry entry when legacy policy is retired and comparison path is deleted
```

## Preconditions

Before local implementation:

- Legacy Understanding Map exists.
- Legacy characterization suite passes.
- PF-01..PF-04 are confirmed in the simulated functional analysis.
- ED-001 is explicit.
- Database and API are out of scope.

Before production shadow:

- comparison telemetry adapter exists;
- operator/tenant data minimization reviewed;
- performance overhead budget defined;
- consumer inventory reviewed;
- rollout owner and stop authority named.

## Migration phases

### P0 — Characterize

Status:

```text
Verified locally
```

Evidence:

```text
6/6 legacy characterization tests pass
```

### P1 — Introduce target seam

```text
PriorityPolicy
CasePriorityInput
PriorityDecision
```

Target state:

```text
Codified + locally verified
```

### P2 — Legacy adapter

Translate target input to legacy shape and legacy output back to target vocabulary.

Target state:

```text
Codified + locally verified
```

### P3 — Candidate implementation inactive

`ConfirmedPriorityPolicy` implements PF-01..PF-04.

Target state:

```text
Codified + locally verified
```

### P4 — Shadow comparison

```text
legacy authoritative
candidate observed
comparison classified
```

Target state in Chapter 18:

```text
Codified + locally verified
production execution pending
```

### P5 — Controlled candidate routing

Future.

Requires runtime comparison evidence and rollout approval.

### P6 — Candidate default

Future.

### P7 — Legacy cleanup

Future.

Requires consumer inventory and coexistence exit evidence.

### P8 — Migration architecture cleanup

Future.

Remove:

- routing switch if no longer needed;
- legacy adapter;
- shadow comparison;
- ED-001 registry;
- migration-only telemetry/tests.

## Evidence per phase

| Phase | Evidence |
|---|---|
| P0 | legacy characterization 6/6 |
| P1 | TypeScript build + seam tests |
| P2 | adapter vs real legacy calculator local test |
| P3 | target policy tests from `priority-functional-analysis.md` |
| P4 | shadow classification tests locally; runtime distribution pending |
| P5 | cohort SLI + unexpected mismatch = 0 + rollback drill |
| P6 | stability window + support/ops signal |
| P7 | no active legacy consumer + rollback window closed intentionally |

## Stop conditions

Future shadow/candidate rollout must stop on:

```text
UnexpectedDifference > agreed zero-tolerance threshold for confirmed rules
candidate exception unexplained
manual-hold precedence regression
closed case becomes actionable
payment repeated-failure loses urgency
cross-tenant/security change
comparison path creates side effects
latency overhead beyond agreed budget
new legacy consumer discovered
```

## Fallback / rollback

### Local code

Git revert / previous commit.

### Future behavior fallback

```text
candidate or shadow
→ legacy mode
```

without redeploy, if the production switch mechanism supports it.

### Data rollback

Not applicable in the current slice because this plan deliberately performs **no data migration**.

If priority persistence is introduced later, this section must be redesigned before execution.

## Point of no return

There is **no one-way door in the Chapter 18 slice**.

Potential future one-way doors:

- deleting legacy priority state needed by an undiscovered consumer;
- removing the last legacy compatibility path;
- changing persisted priority representation without reverse compatibility;
- deleting the nightly export before its consumer is migrated.

These require separate approval/evidence.

## Owners — simulated ESI

```text
Change owner: Order Operations team
Domain confirmation: Product + Operations
Payment rule confirmation: Payments & Risk
Legacy consumer discovery: Commerce & Operations / Platform
Rollback decision: Order Operations on-call/change owner
```

## AI execution boundary

An agent may:

- generate seam/adapter/candidate/shadow implementation;
- update deterministic call sites;
- generate tests from confirmed rules;
- compare documentation and code;
- report unexpected diff.

An agent may not autonomously:

- reclassify a legacy behavior;
- approve ED-001;
- start production candidate routing;
- change data ownership;
- remove rollback path;
- delete legacy state/consumer.

## Verification bundle expected from an agent

```text
files changed
behavior preserved
intentional behavior changed
build result
test result
legacy characterization result
unexpected mismatch result
open risk
cleanup remaining
```

## Current status

```text
Plan: Designed + documented
P0 characterization: Verified locally
P1-P4: implementation/verification performed in Chapter 18
P5+ production rollout: Not executed
Legacy retirement: Not started
```

> **Il piano non promette che la migrazione è sicura. Definisce quale evidence dobbiamo accumulare prima di aumentare il blast radius.**
