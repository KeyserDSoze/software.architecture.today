# Order Operations — End-to-End Decision Trace: Priority Migration

> **Scenario fittizio ESI.** Vista sintetica del caso brownfield. I documenti canonical restano Functional Analysis, Legacy Understanding Map, Refactoring Safety Plan e Testing Strategy.

## Problem

Operations Desk Classic contiene la decisione di Priority in una forma legacy e con comportamento non completamente documentato.

## Outcome

Order Operations assume la Priority policy confermata mantenendo evidence sul comportamento legacy, rollback e controllo esplicito delle differenze intenzionali.

## Functional scope

```text
Closed                  → NotActionable
manualHold              → ManualReview
Payment failures >= 3   → Urgent
otherwise               → Standard
```

Retired legacy rule:

```text
Enterprise + age >= 30m → URGENT
```

Registry:

```text
ED-001 — ExpectedDifference
```

## Owners

```text
Commerce & Operations
→ product capability

Product / Operations
→ target semantics

Operations Desk Classic
→ observed legacy behavior, not target authority
```

## Quality floor

```text
no silent semantic regression
Observed ≠ Confirmed
expected difference pre-authorized
fallback exists before cutover
legacy retirement requires evidence
```

## Key trade-off

```text
faster legacy retirement
vs
coexistence + verification safety
```

## Architecture decision

```text
PriorityPolicy seam
+ LegacyPriorityAdapter
+ ConfirmedPriorityPolicy
+ legacy/shadow/candidate routing
```

## Rejected alternative

```text
big-bang rewrite + immediate cutover
```

Reason:

```text
insufficient semantic/consumer/runtime evidence
```

## Failure modes

```text
legacy behavior incorrectly promoted to target rule
unexpected mismatch
hidden consumer
candidate cutover too early
fallback removed too early
```

## Verification

Historical evidence at recorded revisions:

```text
legacy characterization 6/6 PASS
target/refactoring tests 19/19 PASS
architecture fitness    5/5 PASS
```

Still required:

```text
runtime shadow evidence
consumer/retirement evidence
fallback/cutover exercise
```

## Production decision

```text
LB-PRIORITY-CANDIDATE
= NOT AUTHORIZED
```

## Review triggers

```text
unexpected shadow difference
new consumer discovery
confirmed target semantics change
legacy retirement proposal
fallback no longer viable
```

## Real-world evidence anchor

GitHub Rails incremental upgrade / dual boot:

- https://github.blog/engineering/infrastructure/upgrading-github-from-rails-3-2-to-5-2/

The source supports coexistence/progressive-verification lessons. It does not prove ESI's Priority implementation.
