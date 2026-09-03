# Order Operations — Testing Strategy

> **Scenario fittizio ESI.** Stato corrente dopo il Capitolo 17. Questa strategy governa quali proprietà vogliamo verificare, a quale layer e con quale evidence. I riferimenti a Microsoft, Google, Meta, OWASP e Pact descrivono guidance o casi reali; risk, target e compromessi Order Operations restano simulati.

## Purpose

Costruire confidence su Order Operations senza trasformare la suite in una collezione di test ridondanti, flaky o troppo costosi da eseguire.

> **Il numero di test non misura la confidenza. Ogni test deve poter dire quale errore importante dovrebbe riuscire a rilevare.**

Dal Capitolo 17 la strategy copre anche la **characterization evidence** necessaria quando Order Operations deve convivere con un sistema legacy.

## Quality goals

1. business correctness;
2. tenant isolation e authorization;
3. atomicità degli intenti locali;
4. API/event contract compatibility;
5. duplicate-delivery safety;
6. reliability/recovery evidence;
7. operability e telemetry verification;
8. fast feedback per il team;
9. costo sostenibile della test estate;
10. legacy behavior visibility prima del refactoring.

## Critical journeys

```text
CF-01 Investigation
operator → authenticated/private access → operational view

CF-02 Payment Escalation acceptance
operator → authorization → local transaction
         → PaymentEscalation + OutboxMessage → 202 Accepted

CF-03 Payment Escalation delivery
outbox → publisher → Service Bus → Payments & Risk
```

## Risk sources

La strategy deriva da:

```text
docs/functional-analysis.md
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
```

## Risk-to-Evidence Map

| ID | Property / risk | Impact | Fast evidence | Higher-fidelity evidence | Gate |
|---|---|---:|---|---|---|
| TST-001 | solo case `Payment` può essere escalato | high | application test | HTTP integration | PR |
| TST-002 | stessa `EscalationId` + stesso intent è idempotent replay | high | application test | PostgreSQL/API integration | PR |
| TST-003 | stessa `EscalationId` non può rappresentare intent diverso | critical | application negative test | DB/API integration | PR |
| TST-004 | tenant A non può operare su case tenant B | critical | application negative test | authenticated staging integration | PR/release |
| TST-005 | `PaymentEscalation + OutboxMessage` sono atomici | critical | orchestration test | PostgreSQL transaction test | PR |
| TST-006 | event v1 resta wire-compatible | high | serialization/schema | consumer/provider contract | PR |
| TST-007 | duplicate delivery non produce duplicate business effect | critical | consumer component | Payments persistence integration | release |
| TST-008 | publisher retry è bounded e preserva `messageId` | high | deterministic unit/component | broker integration | PR |
| TST-009 | exhausted delivery entra nel recovery path | high | deterministic publisher test | broker/DLQ integration | PR/release |
| TST-010 | runtime identity è least privilege | critical | IaC/RBAC inspection | Azure negative permission test | staging |
| TST-011 | private ingress/data plane realmente funzionano | high | IaC/static | Azure connectivity test | staging |
| TST-012 | restore/failover rispettano RTO/RPO | critical | procedure review | real drill | readiness |
| TST-013 | telemetry non espone secret/token | high | adapter/policy unit | staging telemetry query | PR/staging |
| TST-014 | alert criticali raggiungono owner/runbook | high | alert definition review | alert drill | readiness |
| TST-015 | migration chain preserva schema/data | high | SQL static review | real PostgreSQL migration test | PR |
| TST-016 | legacy priority behavior cambia accidentalmente durante modernization | high | characterization suite | shadow/coexistence comparison | PR/migration |
| TST-017 | behavior legacy osservato viene promosso a requisito senza domain confirmation | high | Legacy Understanding Map review | Product/Operations confirmation | migration decision |

## Test layers

### Layer A — Fast deterministic

- TypeScript typecheck;
- application/component test;
- outbox publisher test;
- telemetry classification test;
- schema/serialization check;
- legacy characterization test;
- static security checks quando introdotti.

### Layer B — Integration

- PostgreSQL real integration;
- migration chain;
- API host integration;
- contract verification;
- real serialization adapter;
- future legacy/new adapter integration.

### Layer C — Staging / cloud

- Entra authentication;
- tenant/wrong-role negative test;
- private connectivity;
- Service Bus adapter;
- PostgreSQL managed connectivity;
- runtime RBAC negative test;
- deployment smoke/synthetic journey.

### Layer D — Scheduled / readiness

- performance/capacity;
- selected mutation testing;
- failure injection;
- PostgreSQL failover;
- PITR/restore;
- alert drill;
- broader security verification;
- migration/shadow comparison when legacy coexistence begins.

### Layer E — Production continuous verification

- SLI/SLO measurement;
- private synthetic journey;
- canary/health evidence;
- alerting;
- drift detection;
- controlled coexistence telemetry when introduced.

## Current executable suite — Order Operations

```text
tests/payment-escalation.test.mjs
tests/outbox-publisher.test.mjs
```

Copre:

- Payment category eligibility;
- tenant mismatch;
- idempotent replay;
- conflicting idempotency intent;
- escalation/outbox orchestration;
- bounded retry;
- exhausted delivery path;
- stable message identity;
- telemetry acceptance/rejection classification.

Test runner:

```text
TypeScript tsc build
→ Node built-in node:test
```

Decisione intenzionale:

> nessun framework aggiuntivo finché la suite non richiede capability che giustifichino un'altra dependency.

### Verification evidence — Capitolo 16

```text
tsc -p tsconfig.json
→ PASS

node --test tests/*.test.mjs
→ 11 tests
→ 11 pass
→ 0 fail
→ 0 skipped
```

Questa evidence verifica il **fast local layer** soltanto.

Non dimostra PostgreSQL, Azure, Service Bus reale, contract downstream o recovery.

## Legacy characterization suite — Capitolo 17

Operations Desk Classic vive come sistema separato:

```text
../../legacy/operations-desk-classic/
```

Suite:

```text
../../legacy/operations-desk-classic/tests/priority-routing.characterization.test.mjs
```

Behavior:

```text
LB-01 CLOSED → NONE
LB-02 manual hold → MANUAL_REVIEW
LB-03 Payment + failed_attempts >= 3 → URGENT
LB-04 Enterprise + age >= 30 min → URGENT
LB-05 Enterprise before threshold → STANDARD
LB-06 ordinary case → STANDARD
```

Verification eseguita durante il Capitolo 17:

```text
node --test priority-routing.characterization.test.mjs
→ 6 tests
→ 6 pass
→ 0 fail
→ 0 skipped
```

Questa evidence significa:

```text
behavior under characterized input
= Observed + locally Verified
```

Non significa:

```text
business requirement
= Confirmed
```

La semantica resta governata da:

```text
docs/legacy-understanding-map.md
```

Il comando `npm test` del capstone è stato aggiornato per includere sia la suite Order Operations sia la characterization legacy. Il nuovo pattern combinato è **Codified**; i due gruppi di test hanno evidence di esecuzione locale separata (11/11 e 6/6).

## Contract testing

### API

Direction:

- provider conformance rispetto all'API Contract;
- consumer expectation quando la Operations UI diventerà implementazione reale.

### Event

`OperationalCasePaymentEscalatedV1` deve avere:

- serialization test;
- compatibility policy;
- consumer/provider verification con Payments & Risk.

Pact è una capability candidata, non una scelta già presa.

Riferimento:

- [Pact — Introduction](https://docs.pact.io/)

## Data / migration testing

Pending:

```text
real PostgreSQL test environment
```

Scenari obbligatori:

1. empty DB → migration 001 → 002;
2. schema/data after 001 → migration 002;
3. escalation + outbox same transaction;
4. uniqueness/concurrency behavior;
5. rollback on second write failure;
6. representative query/index behavior quando esiste un performance target.

Un fake repository non viene considerato evidence delle semantics PostgreSQL.

## Security testing

Derivato da Threat Model e Security Control Matrix.

Minimum:

```text
unauthenticated denied
wrong-role denied
cross-tenant denied
no persistence after denied operation
runtime cannot administer infrastructure
Service Bus publisher send-only
no production secret in repository
telemetry redaction
public access disabled in production baseline
```

Riferimento:

- [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/)

## Reliability / recovery testing

Required drills:

1. Payments consumer outage;
2. App instance loss;
3. PostgreSQL failover;
4. PostgreSQL PITR/restore;
5. private DNS failure;
6. bad deployment rollback.

Ogni drill deve produrre:

```text
actual RTO
actual RPO
unexpected behavior
manual steps
recovery evidence
follow-up actions
```

## Performance / capacity testing

Non esiste ancora workload measurement reale.

Quindi:

- niente target RPS presentati come reali;
- eventuali load model iniziali devono essere marcati come ipotesi ESI;
- acceptance criteria devono collegarsi a SLI/SLO e saturation/headroom.

Scenari futuri:

- core read journey;
- PostgreSQL connection pressure;
- outbox throughput;
- backlog drain after consumer recovery;
- retry amplification.

## Infrastructure testing

Per `infra/main.bicep` distinguiamo:

```text
build/lint
policy/static validation
deployment validation
private connectivity
RBAC negative tests
application cross-layer smoke
zone/recovery exercise
```

La compilazione del template non equivale a workload verification.

## Synthetic / production verification

Stato:

```text
Designed
```

Direzione:

```text
private runner
+ dedicated low-privilege identity
+ synthetic tenant/data
+ no public health endpoint introduced for convenience
```

## Test environment policy

Usiamo il minimo environment capace di dimostrare la property.

```text
business rule                → process-local
legacy observed behavior     → characterization at legacy boundary
PostgreSQL semantics         → PostgreSQL reale
Azure identity/network       → Azure non-production
region/recovery              → environment capace del drill
```

## Test data

Default:

- synthetic;
- tenant esplicito;
- deterministic fixture;
- unique identifier per run quando serve;
- nessun production secret;
- nessun production PII dump non governato.

## Pipeline direction

### Local

```bash
npm run typecheck
npm test
```

### Pull request — target futuro

```text
typecheck
fast tests
legacy characterization
PostgreSQL integration
migration test
API integration
contract
security static checks
Bicep build/lint
```

### Staging

```text
deploy
private connectivity
Entra auth
RBAC negative
broker/database integration
synthetic smoke
```

### Scheduled/readiness

```text
mutation selected risk
load/capacity
failure injection
restore
alert drill
security verification
migration/shadow comparison when applicable
```

## Flakiness policy

Un flaky test è un defect del quality system.

```text
detected
→ issue + owner
→ quarantine only if necessary
→ still visible
→ fix or remove
```

Non usiamo `retry-until-green` come definizione di successo.

## Coverage policy

```text
coverage = diagnostic signal
coverage != proof of correctness
```

Coverage può evidenziare area mai esercitata.

Non richiediamo una percentuale uniforme come KPI di quality.

## Mutation policy

Applicazione selettiva futura su:

- tenant check;
- Payment category eligibility;
- idempotency/conflict;
- outbox append/atomicity adapter;
- logging/redaction;
- eventuali future action economiche;
- future priority policy **dopo** averne confermato la semantica.

Non usiamo mutation per trasformare automaticamente behavior legacy non confermato in requisito.

Riferimenti:

- [Microsoft Learn — Mutation testing](https://learn.microsoft.com/en-us/dotnet/core/testing/mutation-testing)
- [Engineering at Meta — LLMs Are the Key to Mutation Testing and Better Compliance](https://engineering.fb.com/2025/09/30/security/llms-are-the-key-to-mutation-testing-and-better-compliance/)

## AI-generated-test policy

Gli agenti possono:

- derivare test candidate da requirements;
- proporre negative cases;
- generare synthetic fixture;
- proporre realistic fault/mutant;
- cercare coverage gap;
- generare characterization candidate;
- minimizzare failure reproduction;
- fare adversarial review della suite.

Ogni test merged richiede review umana su:

```text
risk/source
fault or behavior detected
assertion strength
layer fit
determinism
data safety
redundancy
maintenance cost
requirement state: Confirmed vs Characterized
```

Non accettiamo come evidence:

```text
"AI says comprehensive"
```

## Ownership

### Order Operations team

- fast/application tests;
- DB/API integration;
- migration;
- application security;
- suite health;
- modernization adapter tests quando introdotti.

### Operations / legacy owner

- characterization semantics review;
- legacy operational behavior confirmation;
- hidden consumer discovery.

### Payments & Risk

- event consumer contract;
- duplicate-delivery business safety;
- payment semantic behavior.

### Platform Engineering

- non-production Azure test capability;
- IaC/deployment verification foundation;
- landing-zone test path.

### Security

- threat-derived verification baseline;
- privileged-boundary review;
- security tooling guidance.

### Reliability / on-call

- drills;
- incident-derived regression;
- alert/runbook verification.

## Evidence status

```text
Testing Strategy                    = Designed + documented
Order Operations fast test suite    = Codified + Verified locally (11/11)
Legacy characterization suite       = Codified + Verified locally (6/6)
Combined npm test command            = Codified
TypeScript build                    = Verified locally in Chapter 16
PostgreSQL integration suite        = Designed / Pending
Payments contract suite             = Designed / Pending cross-team
Azure security integration          = Designed / Pending
Performance evidence                = Pending
Recovery drills                     = Designed / Pending
Production synthetic journey        = Designed / Pending
Legacy business semantics           = Observed, not yet Confirmed
```

## Test debt register — current

Open:

- PostgreSQL integration environment missing;
- API host not yet implemented;
- consumer contract not yet implemented;
- Azure adapter verification pending;
- Bicep build/deploy verification pending;
- recovery drill pending;
- production synthetic runner pending;
- legacy owner/domain confirmation pending;
- legacy hidden consumer inventory pending;
- shadow/coexistence test not yet designed in executable form.

Questi gap restano visibili e non vengono coperti dai test locali verdi.

## Review triggers

Rivedere la strategy quando cambia:

- critical journey;
- API/event version;
- data ownership;
- threat model;
- RTO/RPO/SLO;
- cloud topology;
- public/private ingress;
- team ownership;
- incident class;
- suite runtime/flakiness;
- AI autonomy nel repository;
- legacy behavior classification;
- modernization seam/cutover plan.

## Sources

- [Microsoft Learn — Architecture strategies for testing](https://learn.microsoft.com/en-us/azure/well-architected/operational-excellence/testing)
- [Microsoft Learn — Build confidence in Azure workloads with effective testing practices](https://learn.microsoft.com/en-us/azure/well-architected/design-guides/testing)
- [Microsoft Learn — IntelliTest characterization tests](https://learn.microsoft.com/en-us/visualstudio/test/intellitest-manual/)
- [Google Testing Blog — Just Say No to More End-to-End Tests](https://testing.googleblog.com/2015/04/just-say-no-to-more-end-to-end-tests.html)
- [Engineering at Meta — Probabilistic flakiness](https://engineering.fb.com/2020/12/10/developer-tools/probabilistic-flakiness/)
- [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/)
- [Pact Docs](https://docs.pact.io/)

> **Una suite non è completa quando ha tanti test. È completa abbastanza quando i rischi che decidiamo di accettare sono diversi dai rischi che abbiamo semplicemente dimenticato di verificare.**