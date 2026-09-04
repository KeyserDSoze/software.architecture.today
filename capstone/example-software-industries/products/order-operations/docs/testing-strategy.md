# Order Operations — Testing Strategy

> **Scenario fittizio ESI.** Stato corrente dopo il Capitolo 18. La strategy governa quali proprietà vogliamo verificare, a quale layer e con quale evidence.

## Purpose

Costruire confidence senza trasformare la suite in una collezione di test ridondanti, flaky o incapaci di attraversare il boundary che pretendono di verificare.

> **Il numero di test non misura la confidenza. Ogni test deve poter dire quale errore importante dovrebbe riuscire a rilevare.**

Dal Capitolo 17–18 la strategy copre anche:

- characterization del legacy;
- target behavior derivato da decisione funzionale;
- refactoring safety;
- shadow comparison;
- intentional difference registry.

## Quality goals

1. business correctness;
2. tenant isolation e authorization;
3. atomicità degli intenti locali;
4. API/event compatibility;
5. duplicate-delivery safety;
6. reliability/recovery evidence;
7. telemetry verification;
8. fast feedback;
9. costo sostenibile della test estate;
10. legacy behavior visibility;
11. refactoring differences classificabili prima del cutover.

## Risk sources

```text
docs/functional-analysis.md
docs/priority-functional-analysis.md
docs/requirements.md
docs/api-contract.md
docs/events/operational-case-payment-escalated-v1.md
docs/data-ownership.md
docs/failure-mode-map.md
docs/threat-model.md
docs/security-control-matrix.md
docs/reliability-contract.md
docs/observability-contract.md
docs/legacy-understanding-map.md
docs/refactoring-safety-plan.md
```

## Risk-to-Evidence Map

| ID | Property / risk | Fast evidence | Higher-fidelity evidence | Gate |
|---|---|---|---|---|
| TST-001 | solo case Payment può essere escalato | application test | HTTP integration | PR |
| TST-002 | stessa EscalationId/same intent è replay idempotente | application | PostgreSQL/API | PR |
| TST-003 | stessa EscalationId/different intent è conflict | negative application | DB/API | PR |
| TST-004 | cross-tenant operation denied | negative application | authenticated staging | PR/release |
| TST-005 | PaymentEscalation + Outbox atomici | orchestration | PostgreSQL transaction | PR |
| TST-006 | event v1 wire-compatible | serialization/schema | consumer/provider | PR |
| TST-007 | duplicate delivery non duplica business effect | consumer component | Payments persistence | release |
| TST-008 | publisher retry bounded + stable messageId | deterministic | broker integration | PR |
| TST-009 | exhausted path visibile | publisher test | DLQ integration | PR/release |
| TST-010 | runtime identity least privilege | IaC inspection | Azure negative RBAC | staging |
| TST-011 | private ingress/data plane reali | IaC/static | Azure connectivity | staging |
| TST-012 | restore/failover rispettano RTO/RPO | procedure | drill reale | readiness |
| TST-013 | telemetry non espone secret/token | adapter/policy | staging query | PR/staging |
| TST-014 | alert raggiunge owner/runbook | definition review | alert drill | readiness |
| TST-015 | migration chain preserva schema/data | SQL review | PostgreSQL migration | PR |
| TST-016 | legacy priority behavior cambia accidentalmente | characterization | shadow/coexistence | PR/migration |
| TST-017 | behavior legacy promosso a requirement senza conferma | Legacy Map review | Product/Operations confirmation | decision |
| TST-018 | target priority precedence diverge da PF-01..PF-04 | target policy tests | staged shadow | PR/migration |
| TST-019 | legacy adapter traduce male naming/codici | adapter vs real legacy calculator | integration/coexistence | PR |
| TST-020 | ED-001 trattata erroneamente come regression | shadow unit test | runtime comparison | PR/migration |
| TST-021 | mismatch non approvato viene nascosto come expected | negative comparison test | rollout stop condition | PR/migration |

## Test layers

### Layer A — Fast deterministic

```text
TypeScript typecheck/build
application/component tests
outbox publisher tests
telemetry classification
priority target policy
legacy adapter
shadow comparison
legacy characterization
schema/serialization checks
```

### Layer B — Integration

```text
real PostgreSQL
migration chain
API host
contract verification
real serialization adapter
future legacy/new adapter integration
```

### Layer C — Staging / cloud

```text
Entra auth
wrong-role/cross-tenant
private connectivity
Service Bus adapter
managed PostgreSQL
runtime RBAC negative test
deployment smoke/synthetic journey
future priority shadow telemetry
```

### Layer D — Scheduled / readiness

```text
performance/capacity
selected mutation testing
failure injection
PostgreSQL failover/PITR
alert drill
security verification
migration/shadow comparison review
```

### Layer E — Production continuous verification

```text
SLI/SLO
private synthetic journey
canary/health evidence
alerting
drift detection
controlled coexistence telemetry
```

## Executable suite — Order Operations

```text
tests/payment-escalation.test.mjs
tests/outbox-publisher.test.mjs
tests/priority-policy.test.mjs
```

### Payment Escalation / outbox coverage

- Payment eligibility;
- tenant mismatch;
- idempotent replay/conflict;
- escalation + outbox orchestration;
- bounded retry;
- exhausted path;
- stable message identity;
- telemetry classification.

### Priority refactoring coverage

- Closed precedence;
- ManualReview precedence;
- repeated Payment failure urgency;
- target removal of Enterprise 30-minute timer;
- real legacy calculator through `LegacyPriorityAdapter`;
- shadow retains legacy result;
- ED-001 classified ExpectedDifference;
- unapproved mismatch classified UnexpectedDifference;
- candidate mode returns target semantics without pretending shadow evidence.

## Legacy characterization suite

Separate system:

```text
legacy/operations-desk-classic/tests/priority-routing.characterization.test.mjs
```

It protects **what the legacy currently does**, including the retired Enterprise timer.

It does not define what the target must do.

This distinction is intentional:

```text
characterization
→ Observed legacy behavior

target policy test
→ Confirmed ESI requirement
```

## Verification evidence — Capitolo 18

Repository source was reconstructed locally after the Chapter 18 changes and TypeScript was compiled with the current strict configuration.

Result:

```text
tsc -p tsconfig.json
→ PASS

Order Operations node:test suite
→ 19 tests
→ 19 pass
→ 0 fail

Operations Desk Classic characterization
→ 6 tests
→ 6 pass
→ 0 fail
```

Of the 19 Order Operations tests:

```text
11 = previously existing application/outbox/telemetry tests
8  = new priority/refactoring tests
```

This evidence verifies only the local deterministic layer.

It does **not** prove:

- production shadow comparison;
- PostgreSQL semantics;
- API host/authentication;
- Payments consumer contract;
- Azure networking/RBAC;
- performance;
- recovery;
- legacy consumer retirement.

## Contract testing

API/event contract testing remains `Designed/Pending` until the actual HTTP host and Payments & Risk consumer are implemented.

Pact remains a candidate capability, not an architectural requirement.

Reference:

- [Pact Docs](https://docs.pact.io/)

## Data / migration testing

Pending real PostgreSQL environment.

Required scenarios:

1. empty DB → migration 001 → 002;
2. existing schema/data → migration 002;
3. escalation + outbox transaction atomicity;
4. uniqueness/concurrency;
5. rollback on second write failure;
6. future priority persistence migration only after ownership decision.

A fake repository is not evidence of PostgreSQL semantics.

## Refactoring verification policy

A refactoring slice must state:

```text
what must stay identical
what may intentionally change
what is unknown
what layer proves each claim
```

For priority:

```text
Preserve:
Closed / ManualReview / Payment repeated failure / Standard default

Intentional change:
ED-001 Enterprise timer removed

Unknown / future:
priority persistence
nightly export consumers
manual override workflow
```

## Shadow comparison policy

Comparison class:

```text
Match
ExpectedDifference
UnexpectedDifference
```

Rules:

1. `ExpectedDifference` requires a pre-approved registry entry.
2. A difference cannot be reclassified as expected merely to keep rollout moving.
3. Any new unexpected semantic mismatch blocks candidate rollout until explained.
4. Shadow candidate must not create external side effects.
5. Runtime comparison signal must respect telemetry cardinality/data-minimization rules.

## Security testing

Minimum remains:

```text
unauthenticated denied
wrong-role denied
cross-tenant denied
no persistence after denial
runtime cannot administer infrastructure
Service Bus publisher send-only
no production secret in repository
telemetry redaction
public access disabled in production baseline
```

Reference:

- [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/)

## Reliability / recovery testing

Required drills remain:

1. Payments consumer outage;
2. App instance loss;
3. PostgreSQL failover;
4. PostgreSQL PITR/restore;
5. private DNS failure;
6. bad deployment rollback.

Each drill must produce actual RTO/RPO and unexpected behavior.

## Infrastructure testing

For `infra/main.bicep`:

```text
build/lint
policy/static validation
deployment validation
private connectivity
RBAC negative tests
application smoke
zone/recovery exercise
```

Template compilation is not workload verification.

## Test environment policy

Use the cheapest environment that can demonstrate the property:

```text
business rule            → process-local
legacy behavior          → characterization
adapter translation      → real local legacy calculator
PostgreSQL semantics     → real PostgreSQL
Azure identity/network   → Azure non-production
recovery                 → environment capable of the drill
```

## Flakiness policy

```text
detected
→ issue + owner
→ quarantine only when necessary and still visible
→ fix or remove
```

`retry-until-green` is not success.

## Coverage / mutation policy

```text
coverage = diagnostic signal
coverage != proof of correctness
```

Mutation remains selective on high-risk logic such as tenant check, idempotency and priority precedence.

References:

- [Microsoft Learn — Mutation testing](https://learn.microsoft.com/en-us/dotnet/core/testing/mutation-testing)
- [Engineering at Meta — mutation-guided LLM testing](https://engineering.fb.com/2025/09/30/security/llms-are-the-key-to-mutation-testing-and-better-compliance/)

## AI-generated-test policy

Agents may propose tests from requirements, invariants, threat and failures.

Every merged test needs review of:

```text
risk/source
fault detected
assertion strength
layer fit
determinism
data safety
redundancy
maintenance cost
```

`AI says comprehensive` is not evidence.

## Evidence status

```text
Testing Strategy                 = Designed + documented
TypeScript build                 = Verified locally
Order Operations fast suite      = Codified + Verified locally (19/19)
Legacy characterization          = Codified + Verified locally (6/6)
Priority seam/candidate/adapter   = Codified + Verified locally
Shadow classification logic      = Codified + Verified locally
Production shadow telemetry      = Designed / Pending
PostgreSQL integration           = Designed / Pending
Payments contract                = Designed / Pending
Azure security integration       = Designed / Pending
Performance/recovery             = Pending
Production synthetic journey     = Designed / Pending
```

## Test debt register

Open:

- PostgreSQL integration/migration environment;
- API host;
- Payments consumer contract;
- OpenTelemetry/Azure adapter verification;
- Bicep build/deploy gate;
- recovery drills;
- production synthetic runner;
- runtime priority shadow telemetry;
- consumer evidence for Operations Desk Classic retirement.

## Sources

- [Microsoft Learn — Architecture strategies for testing](https://learn.microsoft.com/en-us/azure/well-architected/operational-excellence/testing)
- [Microsoft Learn — Safe deployment practices](https://learn.microsoft.com/azure/well-architected/operational-excellence/safe-deployments)
- [Google Testing Blog — Just Say No to More End-to-End Tests](https://testing.googleblog.com/2015/04/just-say-no-to-more-end-to-end-tests.html)
- [Engineering at Meta — Probabilistic flakiness](https://engineering.fb.com/2020/12/10/developer-tools/probabilistic-flakiness/)
- [AWS Prescriptive Guidance — Branch by abstraction](https://docs.aws.amazon.com/prescriptive-guidance/latest/modernization-decomposing-monoliths/branch-by-abstraction.html)

> **Il refactoring è verificato abbastanza per il passo successivo soltanto quando la evidence dimostra proprio la property che quel passo metterà a rischio.**
