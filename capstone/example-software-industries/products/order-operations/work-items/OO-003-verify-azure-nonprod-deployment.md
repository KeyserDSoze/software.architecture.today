# OO-003 — Verify Azure non-production deployment path

## Type

`Execution`

## Problem

`PRR-OO-001` classifies `PRB-001 — Cloud deployment evidence` as a blocker for `LB-CORE` and `LB-ESCALATION`.

The repository contains `infra/main.bicep` and cloud/security/reliability intent, but the current evidence state does **not** prove that the workload can be built, deployed and reached through the intended non-production Azure topology.

## Outcome

Produce reproducible non-production evidence that the current IaC baseline:

1. builds/lints successfully with the approved toolchain;
2. can be deployed to an approved ESI-like non-production environment;
3. exposes the application only through the intended access path;
4. connects to required private dependencies as designed for the exercised slice;
5. can execute a bounded application smoke check;
6. has an explicit rollback/fallback result for the exercised deployment.

This work item does **not** by itself close every security, reliability or production-readiness blocker.

## Current evidence

```text
infra/main.bicep
= Codified

Cloud Deployment Map
= Designed + documented

Threat Model / Security Control Matrix
= Designed + partially Codified

PRB-001
= Open

Real Azure deployment evidence
= Pending
```

## Scope

May change when required to make the **already-approved architecture intent** deployable and verifiable:

```text
infra/
non-production deployment scripts/configuration
smoke/deployment verification scripts/tests
minimal documentation required for evidence provenance
```

May add a provider/tool adapter or pipeline step needed only for the approved Azure non-production deployment path.

## Out of scope

Do not use this work item to:

```text
change business semantics
introduce public Internet ingress
weaken tenant isolation/authentication/authorization
change authoritative data ownership
change Payment Escalation semantics
change SLO/RTO/RPO
add multi-region
add AI provider/runtime resources
turn the Case Explanation Assistant on
change Priority cutover authority
perform destructive production migration
grant production credentials to an agent
change PRR blocker severity merely to make the review green
```

## Canonical context

Read at minimum:

- `AGENTS.md`
- `docs/repository-map.md`
- `docs/production-readiness-review.md`
- `docs/cloud-deployment.md`
- `docs/threat-model.md`
- `docs/security-control-matrix.md`
- `docs/reliability-contract.md`
- `docs/observability-contract.md`
- `docs/cost-model.md`
- `infra/README.md`
- `infra/main.bicep`

## Acceptance criteria

### AC-01 — IaC build evidence

The current Bicep entry point is compiled/linted with the approved toolchain and the exact result is recorded.

### AC-02 — Non-production deployment evidence

A deployment is attempted in an approved non-production Azure environment using no production customer data or production credentials.

Success requires the intended resources for the exercised slice to reach a deployable state.

### AC-03 — Access-boundary evidence

The exercised application path is reachable through the intended approved access path and a disallowed/public path is not silently introduced.

### AC-04 — Dependency connectivity evidence

The application can reach the dependencies included in the exercised deployment boundary through the intended configuration.

Any dependency intentionally excluded from this work item must be named in `Not verified`.

### AC-05 — Application smoke evidence

A bounded smoke request proves that the deployed application/runtime can start and serve the intended non-production check without claiming full functional/security readiness.

### AC-06 — Rollback/fallback evidence

The work item records which rollback/fallback mechanism was exercised and its result.

A code/config rollback does not imply data rollback.

### AC-07 — Evidence provenance

Closure evidence includes:

```text
commit/version
environment
tool/command
result
timestamp
limitations
artifacts/log references
```

## Verification

```text
AC-01
→ real Bicep build/lint output

AC-02
→ Azure deployment result for approved non-production environment

AC-03
→ positive intended-path check + relevant negative reachability check

AC-04
→ explicit dependency connectivity check for exercised dependencies

AC-05
→ application smoke command/result

AC-06
→ rollback/fallback exercise/result

AC-07
→ closure evidence package review
```

A local static test is not sufficient evidence for AC-02..AC-06.

## Constraints

- Use only synthetic/non-sensitive test data.
- Preserve current private-ingress/security direction.
- Do not use production credentials or customer data.
- Do not modify the PRR to `READY` as part of implementation.
- Closing `PRB-001` does not automatically close `PRB-002…PRB-006`.
- Any architecture change required to make deployment succeed must be surfaced as a decision, not hidden inside deployment troubleshooting.

## Stop conditions

Stop and escalate if execution requires:

1. public Internet exposure not already approved;
2. broadening runtime/control-plane privilege beyond current security intent;
3. changing current data ownership;
4. weakening an existing security/reliability fitness rule;
5. introducing a new paid/shared platform capability with material architecture/cost impact;
6. changing RTO/RPO or SLO;
7. production credentials/customer data;
8. destructive production action;
9. redefining a failed verification as passed by changing the oracle rather than the implementation/architecture decision.

## Dependencies

```text
Blocked by:
approved Azure non-production execution environment and identities

Blocks:
PRB-001 closure
future LB-CORE Conditional Go review

Related:
PRB-002 Security runtime evidence
PRB-004 Observability evidence
PRB-006 Capacity evidence

Decision required from:
Platform/Security if current IaC intent cannot be deployed without changing network/permission boundaries
```

## Closure evidence

Record:

```text
Outcome achieved
Files changed
Environment
Commands / deployment operations
Evidence IDs
Result per acceptance criterion
Known limitations
Not verified
PRB-001 status recommendation
Follow-up work items
```

`PRB-001 status recommendation` is not the same as final PRR approval.

## AI execution notes

If delegated to an agent:

- use bounded non-production permissions only;
- never acquire or request production secrets/customer data;
- report policy/permission blockers instead of broadening permissions unilaterally;
- do not mark PRB-001 closed without primary environment evidence;
- preserve the PRR `NO-GO` state until the appropriate human/review process updates it.

## Current state

```text
OO-003
= Codified work item

Execution
= Pending

PRB-001
= Open
```
