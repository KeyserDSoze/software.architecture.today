# 16.8 — ESI: Testing Architecture di Order Operations

Adesso applichiamo il capitolo al capstone.

Order Operations ha accumulato abbastanza architettura da rendere interessante una vera Testing Strategy.

Non partiamo dal framework.

Partiamo dagli artefatti che il progetto possiede già.

## Le sorgenti della strategy

### Functional Analysis

Ci dice:

- cosa può fare un operatore;
- quali business rule esistono;
- quali operazioni non sono ancora definite;
- quali significati appartengono ai domini sorgente.

### Requirements

Ci dà FR, SR e RR espliciti.

### API Contract

Ci dà request/response, idempotency e compatibility expectation.

### Event Contract

Ci dà `OperationalCasePaymentEscalatedV1`.

### Data Ownership Map

Ci dice quali facts possiamo persistire e modificare.

### Failure Mode Map

Ci dice quali failure distribuiti devono diventare test.

### Threat Model / Security Control Matrix

Ci dà negative path di authorization, identity, reachability e logging.

### Reliability Contract

Ci dà SLO, RTO/RPO e required recovery drill.

### Observability Contract

Ci dice quale evidence dobbiamo poter raccogliere quando i test falliscono e quando il sistema opera.

Questa è una differenza importante rispetto a “apriamo il file e generiamo test”.

> **La suite nasce dal modello del sistema, non dalla forma del codice.**

## Compromesso ESI del Capitolo 16

### Esigenza

Commerce & Operations vuole aumentare velocità di modifica del prodotto senza aumentare il rischio di regressioni su escalation, authorization e integrazioni.

### Tensione

```text
confidence
vs
pipeline speed
vs
test environment cost
vs
maintenance burden
```

Payments & Risk vuole evidence forte sui contract.

Security vuole negative test.

Platform non vuole un environment Azure completo per ogni test locale.

Finance non vuole una seconda produzione sempre accesa soltanto per la suite.

### Decisione

ESI adotta una Testing Strategy a più velocità:

```text
local / PR fast layer
→ business/application tests
→ deterministic contract checks

PR integration layer
→ PostgreSQL
→ API
→ migration
→ provider/consumer contracts

staging/deployment layer
→ real Azure identity/network/broker
→ synthetic smoke

scheduled/readiness layer
→ performance
→ mutation on critical risk
→ recovery/failure drill
→ broader security verification

production
→ continuous SLI + private synthetic journey
```

### Costo accettato

Non ogni commit verifica la topologia cloud completa.

Alcuni risk hanno evidence più lenta e costosa.

### Quality floor

Non rinunciamo a:

- idempotency;
- tenant isolation;
- authorization;
- atomicity escalation/outbox;
- contract compatibility;
- duplicate-delivery safety;
- migration safety;
- recovery drill prima della production readiness.

### Guardrail

- Testing Strategy;
- Risk-to-Evidence Map;
- pipeline gate;
- flaky-test policy;
- incident-derived regression;
- mutation testing selettivo;
- review obbligatoria dei test AI-generated.

## TST-001 — Payment category eligibility

Property:

```text
only OperationalCase.problemCategory = Payment
can create a Payment Escalation
```

Cheap evidence:

```text
application test
```

Scenari:

```text
Payment → accepted
Shipping → rejected
Order → rejected
```

Non serve PostgreSQL per dimostrare la regola pura.

## TST-002 — Same intent is idempotent

Property:

```text
same escalationId + same case + same tenant
→ already-accepted
→ no second business escalation
```

Layer:

1. application test;
2. PostgreSQL integration per persistence/constraint;
3. HTTP integration per Idempotency-Key semantics.

## TST-003 — Idempotency key cannot be stolen

Property:

```text
same escalationId + different case
OR different tenant
→ conflict/rejection
```

Questo è sia business correctness sia security boundary.

Il test deve verificare:

```text
rejected
AND no new outbox
AND no foreign data exposed
```

## TST-004 — Atomic escalation + outbox

Property:

```text
PaymentEscalation commit
⇔
OutboxMessage commit
```

Application test può verificare che il use case richieda entrambe nello stesso `UnitOfWork`.

Ma la evidence forte sarà:

```text
real PostgreSQL transaction integration test
```

con fault injection fra le due write.

## TST-005 — Event contract v1

Property:

```text
OperationalCasePaymentEscalatedV1
remains wire-compatible with Payments & Risk expectation
```

Evidence:

- schema/serialization test;
- consumer/provider contract;
- version compatibility test quando arriverà v2.

Non useremo il full E2E come prima linea di difesa per una incompatibilità di shape.

## TST-006 — Redelivery is harmless

Property downstream:

```text
same EscalationId delivered twice
→ one Payments business workflow
```

Owner principale:

```text
Payments & Risk
```

Order Operations non può dichiarare questa property verificata da solo.

È un ottimo esempio di test ownership cross-team.

## TST-007 — Tenant isolation

Threat/property:

```text
operator from tenant A
cannot read/write case from tenant B
```

Evidence chain:

```text
application authorization test
→ HTTP authenticated integration negative test
→ staging identity test
```

Questo risk è troppo importante per affidarsi soltanto a mock di security context.

## TST-008 — Runtime least privilege

Property:

```text
App Service managed identity
can send required message / read required secret
but cannot modify RBAC or infrastructure
```

Questo non può essere dimostrato in locale.

Gate:

```text
staging deployment verification
```

## TST-009 — Publisher ambiguous acknowledgement

Scenario:

```text
broker accepted message
local markPublished fails
```

Expected:

```text
message can be published again
same messageId preserved
consumer duplicate tolerance protects business effect
```

Il nostro `OutboxPublisher` deve avere un test deterministico per questa finestra.

## TST-010 — Retry classification

Property:

```text
transient publish failure
→ bounded retry

exhausted attempts
→ exhausted path

permanent semantic rejection
→ no blind retry
```

I numeri concreti possono essere configuration test.

La property principale è la policy.

## TST-011 — Reconciliation threshold

Property:

```text
Requested
+ not Delivered
+ age > threshold
→ reconciliation candidate
```

Test con clock controllato.

Nessun `sleep()`.

## TST-012 — Migration chain

Evidence:

```text
empty DB
→ migration 001
→ migration 002
→ schema valid
```

E:

```text
schema after 001 + representative state
→ migration 002
→ old data preserved
→ new constraints valid
```

## TST-013 — Core synthetic journey

Staging/production-like:

```text
private test identity
→ private ingress
→ authenticated read
→ expected synthetic OperationalCase
```

Non introduce public endpoint solo per monitorare.

## TST-014 — Payment consumer outage

Failure test:

```text
Payments consumer unavailable
```

Expected:

```text
local escalation acceptance works
message persists/delivers to broker
backlog visible
business delivery delay visible
recovery drains backlog
```

## TST-015 — PostgreSQL failover

Evidence richiesta prima della production readiness:

```text
failover executed
actual downtime measured
client reconnect behavior observed
committed data checked
RTO/RPO compared with contract
```

## TST-016 — PITR restore

Non è un test CI per ogni PR.

È un readiness/scheduled drill.

Pass criterion:

```text
restore completes
application validates restored state
actual recovery time recorded
actual data loss window recorded
```

## TST-017 — Telemetry redaction

Property:

```text
access token / Authorization / secret
must not appear in normal telemetry
```

Cheap evidence:

- unit test del telemetry adapter/policy;
- representative event snapshot review.

Higher fidelity:

- staging query su emitted telemetry.

## TST-018 — Alert route

Property:

```text
critical synthetic/SLO condition
→ actionable alert
→ correct owner
→ runbook
```

Questo è un operational test, non un unit test.

## Pipeline ESI

### Local / commit

```text
npm run typecheck
npm test
```

Obiettivo:

```text
fast deterministic feedback
```

### Pull request

Future direction:

```text
typecheck
unit/application tests
PostgreSQL integration
migration test
API integration
contract test
security static checks
Bicep build/lint
```

### Staging deployment

```text
private network smoke
Entra auth
RBAC negative
Service Bus adapter
PostgreSQL connectivity
synthetic journey
```

### Scheduled/readiness

```text
mutation critical areas
performance/capacity
consumer outage
failover
PITR
alert drill
security verification
```

## Test suite health

ESI introduce una regola:

```text
un test flaky è un defect della quality system
```

Quindi ogni flaky test deve avere:

- issue;
- owner;
- evidence;
- remediation or removal;
- eventual quarantine con scadenza.

Il retry automatico non lo assolve.

## Coverage

Decisione:

```text
coverage visible
but not release confidence KPI by itself
```

Usiamo coverage per trovare zone mai esercitate.

Non generiamo test artificiali per inseguire una percentuale uniforme.

## Mutation

Prima area candidata:

```text
requestPaymentEscalation
```

Mutant significativi:

- rimuovere category check;
- rimuovere tenant check;
- cambiare conflict condition;
- trattare existing escalation come sempre accepted;
- saltare outbox append.

Se la suite non rileva questi fault, abbiamo trovato un gap reale.

## AI policy ESI

Gli agenti possono generare test candidate.

Ma il prompt di default non sarà:

```text
write more tests
```

Sarà qualcosa come:

```text
Given requirement RR/TST-X and this implementation,
identify realistic faults that would violate the property.
Then propose the smallest deterministic tests that would fail for those faults.
Do not optimize for coverage percentage.
```

Questo orienta l'agente verso risk detection.

## Primo incremento eseguibile

In questo capitolo facciamo comparire finalmente:

```text
tests/
```

La prima suite non proverà tutto.

Proverà property per cui abbiamo già codice eseguibile senza infrastruttura esterna:

- Payment category eligibility;
- idempotent replay;
- conflicting idempotency intent;
- tenant mismatch;
- escalation + outbox orchestration;
- outbox retry/exhaustion;
- telemetry classification.

Useremo il test runner integrato di Node sul JavaScript compilato per evitare di aggiungere un nuovo framework soltanto per mostrare test nel capstone.

Questo è coerente con `fit before fashion`.

Se in futuro la suite richiederà capability migliori, potremo introdurre Vitest/Jest o altro con una decisione esplicita.

## Stato di evidence dopo il capitolo

Dopo l'implementazione prevista:

```text
Testing Strategy
= Designed

first test suite
= Codified

local test execution
= Verified se eseguita con successo

PostgreSQL integration
= Designed / pending

contract testing with Payments
= Designed / pending cross-team

Azure negative tests
= Designed / pending

recovery drills
= Designed / pending
```

Non gonfiamo il grado di maturità perché alcuni test locali passano.

## Frase chiave

> **Il test layer più costoso non è quello che dà più confidenza in assoluto. È quello che deve giustificare il proprio costo dimostrando qualcosa che i layer più economici non possono dimostrare.**