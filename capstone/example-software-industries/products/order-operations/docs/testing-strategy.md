# Order Operations — Testing Strategy

> **Scenario fittizio ESI.** Stato corrente dopo il Capitolo 24. La strategy governa quali proprietà vogliamo verificare, a quale layer e con quale evidence.

## Purpose

Costruire confidence senza trasformare test ed eval in una collezione di controlli ridondanti, flaky o incapaci di attraversare il boundary che pretendono di verificare.

> **Il numero di test non misura la confidenza. Ogni controllo deve poter dire quale errore importante dovrebbe riuscire a rilevare.**

Dal Capitolo 17 in avanti la strategy copre anche legacy/refactoring; dal Capitolo 24 copre inoltre **runtime AI evaluation**.

## Quality goals

1. business correctness;
2. tenant isolation e authorization;
3. atomicità degli intenti locali;
4. API/event compatibility;
5. duplicate-delivery safety;
6. reliability/recovery evidence;
7. telemetry verification;
8. fast feedback;
9. costo sostenibile della test/eval estate;
10. legacy behavior visibility;
11. refactoring differences classificabili;
12. runtime AI authority boundary;
13. grounded/source-backed AI output;
14. prompt-injection and cross-tenant safety;
15. model/configuration regression visibility.

## Risk sources

```text
docs/functional-analysis.md
docs/priority-functional-analysis.md
docs/requirements.md
docs/api-contract.md
docs/events/
docs/data-ownership.md
docs/failure-mode-map.md
docs/threat-model.md
docs/security-control-matrix.md
docs/reliability-contract.md
docs/observability-contract.md
docs/legacy-understanding-map.md
docs/refactoring-safety-plan.md
docs/ai-feature-contract.md
evals/case-explanation-v1.jsonl
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
| TST-019 | legacy adapter traduce male naming/codici | adapter vs legacy calculator | integration/coexistence | PR |
| TST-020 | ED-001 trattata erroneamente come regression | shadow unit test | runtime comparison | PR/migration |
| TST-021 | mismatch non approvato viene nascosto come expected | negative comparison test | rollout stop condition | PR/migration |
| TST-022 | AI semantic contract importa provider SDK | AI boundary fitness | implementation review | PR |
| TST-023 | AI confirmed fact usa source inesistente | deterministic source-reference validation | provider eval | PR/release |
| TST-024 | missing evidence viene nascosta | deterministic status guard + eval seed | model eval | release |
| TST-025 | prompt injection influenza output/tool boundary | no-write-tool architecture + adversarial eval seed | real model security eval/red team | release |
| TST-026 | cross-tenant data entra nel context | context authorization design | authenticated integration + model context inspection | release |
| TST-027 | model crea authority su Payment/Priority/refund | AI Feature Contract + eval seed | real model eval + human rubric | release |
| TST-028 | model/config change degrada critical behavior | versioned eval dataset | regression eval / canary | every model change |
| TST-029 | model/provider failure rompe core Operational Case view | fallback contract | integration/failure test | release |
| TST-030 | AI cost/latency cresce senza quality value | budget definitions | runtime metrics + cost/unit | operational review |

## Test / evaluation layers

### Layer A — Fast deterministic

```text
TypeScript typecheck/build
application/component tests
outbox publisher tests
priority/refactoring tests
architecture/cost/context/agent governance fitness
AI semantic boundary and source-reference validation
legacy characterization
```

### Layer B — Integration

```text
real PostgreSQL
migration chain
API host
contract verification
real serialization adapter
AI context-builder authorization/minimization
provider adapter schema/error handling
```

### Layer C — Offline AI eval

```text
versioned eval dataset
real model/configuration under test
groundedness / claim support
fact-hypothesis separation
missing-evidence honesty
prompt-injection cases
authority-boundary cases
human review calibration
latency/cost benchmark
```

A model eval must identify the tested configuration:

```text
provider/model route
model/deployment version
system instruction version
context builder version
output schema version
tool set
safety configuration
```

### Layer D — Staging / cloud

```text
Entra auth
wrong-role/cross-tenant
private connectivity
Service Bus adapter
managed PostgreSQL
runtime RBAC negative test
AI provider/network/privacy configuration
AI failure/fallback smoke
```

### Layer E — Scheduled / readiness

```text
performance/capacity
selected mutation testing
failure injection
PostgreSQL failover/PITR
alert drill
security verification
AI regression/security eval
migration/shadow review
```

### Layer F — Production continuous verification

```text
SLI/SLO
private synthetic journey
alerting/drift detection
controlled legacy coexistence telemetry
AI unavailable/invalid-output/fallback rate
AI sampled quality review
AI cost/latency
model/configuration drift
```

## Executable suite — current deterministic surface

Current product test directory includes:

```text
payment-escalation.test.mjs
outbox-publisher.test.mjs
priority-policy.test.mjs
architecture-fitness.test.mjs
cost-fitness.test.mjs
agent-context-fitness.test.mjs
issue-readiness-fitness.test.mjs
agent-governance-fitness.test.mjs
ai-boundary-fitness.test.mjs
```

Legacy characterization remains separate under Operations Desk Classic.

## Runtime AI evaluation

Versioned seed:

```text
evals/case-explanation-v1.jsonl
```

Initial classes:

```text
nominal
missing-evidence
conflicting-evidence
prompt-injection
cross-tenant
authority-boundary
ambiguity
```

Each eval case should evolve toward explicit:

```text
required behaviors
forbidden behaviors
required sources / missing evidence
severity
human reference or rationale when needed
```

### Evaluation principles

```text
schema-valid
≠
semantically correct
```

```text
citation present
≠
claim supported
```

```text
average score high
≠
critical safety gate passed
```

Critical failures such as cross-tenant disclosure or unauthorized economic authority block acceptance independently of average quality score.

### LLM-as-a-Judge

Allowed as a measurement tool where useful, but must be calibrated against human/reference evidence and must not be the only authority for critical claims.

Grader/harness/version are part of the evaluation configuration.

## Verification evidence — historical local gates

### Chapter 18

```text
tsc -p tsconfig.json
→ PASS

Order Operations
→ 19/19 PASS

Operations Desk Classic characterization
→ 6/6 PASS
```

This evidence belongs to that revision/layer and is not a perpetual statement about every later commit.

### Chapter 24 — new AI boundary gate

A local reconstruction of the new provider-neutral AI slice was compiled and the dedicated fitness gate executed:

```text
tsc
→ PASS

node --test tests/ai-boundary-fitness.test.mjs
→ 5 tests
→ 5 pass
→ 0 fail
```

This verifies:

```text
AI Feature Contract/model boundary/eval seed exist
provider-neutral semantic source
read-only/no-RAG v1 constraints are present
known source-reference validation works
missing-evidence deterministic guard works
eval seed includes required risk classes
```

It does **not** verify:

```text
real model groundedness
real prompt-injection resistance
provider privacy/network configuration
operator usefulness
latency
cost
production behavior
```

## Contract / data / migration testing

API/event contract testing remains `Designed/Pending` until the actual HTTP host and Payments & Risk consumer are implemented.

Real PostgreSQL remains required for TST-005/TST-015. `OO-001` is the current execution work item for the PaymentEscalation + Outbox atomicity gap.

A fake repository is not evidence of PostgreSQL semantics.

## Refactoring / shadow policy

Characterization protects observed legacy behavior; target tests protect confirmed ESI behavior.

Comparison classes:

```text
Match
ExpectedDifference
UnexpectedDifference
```

`ExpectedDifference` requires pre-authorization; a mismatch cannot become “expected” merely to keep rollout moving.

## Security testing

Minimum traditional controls remain:

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

AI-specific additions:

```text
authorization before AI context
untrusted text treated as data
prompt-injection eval
cross-tenant context negative cases
no write/action tool in Case Explanation v1
source-reference validation
safe output rendering
model/provider privacy configuration review
```

References:

- [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/)
- [OWASP — LLM Prompt Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html)

## Reliability / recovery testing

Required drills remain:

1. Payments consumer outage;
2. App instance loss;
3. PostgreSQL failover;
4. PostgreSQL PITR/restore;
5. private DNS failure;
6. bad deployment rollback.

AI adds:

7. model/provider timeout/outage;
8. invalid structured output after bounded repair;
9. context source partial outage;
10. disable AI feature while preserving core case view;
11. model/config rollback.

## Test environment policy

Use the cheapest environment that can demonstrate the property:

```text
business rule                  → process-local
legacy behavior                → characterization
PostgreSQL semantics           → real PostgreSQL
AI deterministic boundary      → local deterministic test
AI model behavior              → real tested model/config
Azure identity/network         → Azure non-production
recovery                       → environment capable of the drill
```

## Flakiness / evaluation instability

`retry-until-green` is not success.

For stochastic evals, store configuration and run enough samples for the claim being made. Do not hide variance by selecting the nicest run.

## Coverage / mutation policy

```text
coverage = diagnostic signal
coverage != proof of correctness
```

Mutation remains selective on high-risk deterministic logic.

For AI, dataset coverage is similarly diagnostic:

```text
more eval prompts
≠
more assurance
```

Risk-class coverage and critical failure detection matter more than prompt count.

## AI-generated-test/eval policy

Agents may propose tests/evals from requirements, invariants, threat and failures.

Every merged test/eval needs review of:

```text
risk/source
fault or failure detected
assertion/rubric strength
layer fit
determinism/variance
data safety
redundancy
maintenance cost
```

`AI says comprehensive` is not evidence.

## Evidence status

```text
Testing Strategy                         Codified/documented
Historical fast local suite              previously Verified at recorded revisions
Legacy characterization                  Verified 6/6
PostgreSQL integration                    Designed / Pending via OO-001
Azure security integration               Designed / Pending
Performance/recovery                     Pending
AI Feature Contract                       Codified
AI provider-neutral semantic boundary     Codified + locally compiled
AI boundary fitness                       locally exercised 5/5
AI eval dataset seed                      Codified
Real model/provider adapter               Pending
Real model eval                           Pending
Production AI monitoring                  Pending
```

## Test / eval debt register

Open:

- PostgreSQL integration/migration environment;
- API host;
- Payments consumer contract;
- OpenTelemetry/Azure adapter verification;
- Bicep build/deploy gate;
- recovery drills;
- production synthetic runner;
- runtime priority shadow telemetry;
- consumer evidence for Operations Desk Classic retirement;
- Case Explanation context builder;
- model/provider adapter;
- structured-output provider integration;
- human-calibrated AI eval baseline;
- prompt-injection red-team run;
- production AI latency/cost/quality telemetry.

## Sources

- [Microsoft Learn — Architecture strategies for testing](https://learn.microsoft.com/en-us/azure/well-architected/operational-excellence/testing)
- [Microsoft Learn — RAG LLM evaluation phase](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/rag/rag-llm-evaluation-phase)
- [Microsoft Foundry — Built-in evaluators](https://learn.microsoft.com/en-us/azure/foundry/concepts/built-in-evaluators)
- [OpenAI — A shared playbook for trustworthy third party evaluations](https://openai.com/index/trustworthy-third-party-evaluations-foundations/)
- [Uber Engineering — Enhanced Agentic-RAG](https://www.uber.com/au/en/blog/enhanced-agentic-rag/)
- [Google Testing Blog — Just Say No to More End-to-End Tests](https://testing.googleblog.com/2015/04/just-say-no-to-more-end-to-end-tests.html)

> **Il controllo giusto è quello che attraversa il boundary capace di falsificare la claim. Per l'AI, questo significa testare non soltanto il codice, ma la configurazione completa che produce il comportamento.**