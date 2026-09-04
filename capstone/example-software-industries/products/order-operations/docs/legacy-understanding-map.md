# Order Operations — Legacy Understanding Map

> **Scenario fittizio ESI.** Stato corrente dopo il Capitolo 18. Questo documento governa la comprensione della capability `legacy case priority routing` di **Operations Desk Classic** durante la transizione verso Order Operations.

## Purpose

Ridurre l'incertezza necessaria per migrare la priority routing senza perdere behavior richiesti e senza fossilizzare accidental complexity.

Principio:

> **Comportamento osservato non significa requisito confermato. La conferma richiede una decisione sul significato.**

## System / capability

```text
System: Operations Desk Classic
Capability: legacy case priority routing
Current modernization state: characterized + target semantics confirmed + local shadow slice codified
```

Legacy location:

```text
capstone/example-software-industries/legacy/operations-desk-classic/
```

Target functional decision:

```text
docs/priority-functional-analysis.md
```

Safety plan:

```text
docs/refactoring-safety-plan.md
```

## Evidence vocabulary

```text
Found
→ Inferred
→ Observed
→ Confirmed
```

`Confirmed` in questo scenario significa confermato dalla decisione funzionale simulata ESI, non evidence di un'azienda reale.

## Legacy behavior observed

Characterization suite:

```text
legacy/operations-desk-classic/tests/priority-routing.characterization.test.mjs
```

| ID | Scenario | Legacy output | Legacy evidence | Target classification |
|---|---|---|---|---|
| LB-01 | `status_code=CLOSED` | `NONE` | Observed + locally verified | Required |
| LB-02 | `manual_hold=1` | `MANUAL_REVIEW` | Observed + locally verified | Required behavior |
| LB-03 | `problem_code=PAY` + `failed_attempts>=3` | `URGENT` | Observed + locally verified | Required |
| LB-04 | Enterprise + age >=30 min | `URGENT` | Observed + locally verified | Removed by explicit ESI product decision / ED-001 |
| LB-05 | Enterprise before threshold | `STANDARD` | Observed + locally verified | not an independent requirement |
| LB-06 | ordinary open case | `STANDARD` | Observed + locally verified | Required default |

Verification evidence from Chapter 18:

```text
legacy characterization
→ 6 tests
→ 6 pass
→ 0 fail
```

## Confirmed target semantics

Target vocabulary:

```text
NotActionable
ManualReview
Urgent
Standard
```

Target precedence:

```text
Closed
> ManualReview
> RepeatedPaymentFailure
> Standard
```

The old Enterprise 30-minute rule is intentionally absent.

## Expected Difference ED-001

Approved in the simulated ESI scenario before rollout:

```text
Legacy:
Enterprise + age >= 30m
→ URGENT

Target:
customer tier alone does not raise priority
→ Standard unless another confirmed rule applies
```

Comparison classification:

```text
ExpectedDifference
ID = ED-001
```

This registry entry must be removed when the legacy path and shadow comparison are retired.

## Legacy precedence observed

Historical implementation order:

```text
CLOSED
> manual hold
> repeated payment failure
> enterprise age threshold
> standard
```

Target precedence differs intentionally because the enterprise threshold has been retired.

## State / data ownership

The teaching scenario still assumes Operations Desk Classic may historically have used shared operations state such as:

```text
case_id
priority_code
priority_updated_at
manual_hold
```

This is still **scenario/discovery context**, not a fully implemented legacy database in the capstone.

Open questions:

- who is current writer of `priority_code` in the legacy estate?
- does the nightly export still consume it?
- should Order Operations derive priority on demand or persist it?
- if persisted, who becomes authoritative and when?
- is `manual_hold` business state or compatibility state to migrate separately?

## Consumers

| Consumer | Current state | Evidence needed before retirement |
|---|---|---|
| legacy operator UI | Inferred | runtime/caller evidence |
| nightly export | Inferred | job definition + owner |
| downstream reporting | Inferred | source/query evidence |
| Order Operations | target consumer through new seam | local code/test evidence exists |

No inferred legacy consumer is treated as retired until evidence says so.

## Scheduled / temporal coupling

The narrative includes a possible nightly export consuming legacy priority.

State:

```text
Inferred / unresolved
```

This remains a blocker for full legacy retirement, but not for the Chapter 18 pure decision-policy slice.

## Operational procedures

Still incomplete.

Discovery questions:

- does an operator manually override priority?
- how is a wrong classification corrected?
- is there an operational SQL/runbook path?
- who owns export failure?
- is there a cut-off linked to priority?

## Security / identity

The complete legacy security model remains unknown.

Quality floor for coexistence:

- tenant isolation preserved;
- authenticated privileged action;
- audit for future priority/manual override;
- no new static secret introduced by the target;
- legacy permissions are not copied automatically into Order Operations.

## Candidate seam — now implemented locally

```text
PriorityPolicy
├── LegacyPriorityAdapter
└── ConfirmedPriorityPolicy
```

Routing/comparison:

```text
BranchingPriorityPolicy
mode = legacy | shadow | candidate
```

State:

```text
Codified + locally verified
```

Production rollout remains unexecuted.

## Anti-Corruption Layer

The target does not expose legacy field names or codes in its `PriorityPolicy` contract.

`LegacyPriorityAdapter` owns mapping between:

```text
status_code / problem_code / manual_hold
```

and:

```text
status / problemCategory / manualHold
```

as well as mapping:

```text
NONE / MANUAL_REVIEW / URGENT / STANDARD
```

to target priority vocabulary.

## Migration risks

1. **Semantic fossilization** — reintroducing LB-04 because shadow mismatch is misread as regression.
2. **Silent regression** — breaking LB-01/LB-02/LB-03/LB-06.
3. **Hidden consumer breakage** — retiring `priority_code` before inventory is complete.
4. **Dual ownership** — future persistence written by both systems without policy.
5. **Precedence drift** — manual hold/closed behavior changes during refactoring.
6. **Time semantics** — legacy timer behavior interpreted incorrectly during ED-001 classification.
7. **Tenant/security drift** — compatibility path broadens access.
8. **Rollback gap** — future state migration makes legacy fallback unreadable.
9. **Temporary architecture permanence** — adapter/flag/comparison never removed.

## Current blockers before production candidate routing

1. comparison telemetry adapter;
2. runtime observation window definition;
3. rollout owner / stop authority;
4. consumer inventory review;
5. performance budget for shadow execution;
6. staging path if target integration becomes external;
7. confirmation that no side effect is introduced by candidate evaluation.

## Current blockers before legacy retirement

1. nightly/export/report consumer evidence;
2. decision on priority persistence ownership;
3. manual hold migration semantics;
4. compatibility window;
5. rollback / recovery plan for any data state change;
6. proof old path has no active caller.

## ESI compromise — Capitolo 18

**Esigenza:** transfer priority decision into Order Operations and reduce the legacy footprint.

**Tensione:** retirement speed vs semantic safety vs temporary coexistence cost vs deliberate simplification of old rules.

**Decisione:** confirm behaviors first, introduce `PriorityPolicy`, keep legacy behind an adapter, run candidate in shadow before authoritative cutover, register ED-001 before rollout.

**Costo accettato:** duplicate implementation and temporary routing/comparison structure.

**Quality floor:** required behavior preserved, intended difference explicit, no database/API change in first slice, fallback available before one-way doors.

**Guardrail:** characterization suite, priority functional analysis, Refactoring Safety Plan, target tests, expected-difference registry and stop conditions.

## Sources

- [AWS Prescriptive Guidance — Branch by abstraction](https://docs.aws.amazon.com/prescriptive-guidance/latest/modernization-decomposing-monoliths/branch-by-abstraction.html)
- [Microsoft Learn — Anti-Corruption Layer](https://learn.microsoft.com/azure/architecture/patterns/anti-corruption-layer)
- [Microsoft Learn — Strangler Fig](https://learn.microsoft.com/azure/architecture/patterns/strangler-fig)
- [Microsoft Learn — Safe deployment practices](https://learn.microsoft.com/azure/well-architected/operational-excellence/safe-deployments)

> **Ora sappiamo sia che cosa faceva il legacy, sia quali parti di quel comportamento ESI ha deciso che meritano di sopravvivere. Sono due forme di conoscenza diverse e devono restare distinguibili.**
