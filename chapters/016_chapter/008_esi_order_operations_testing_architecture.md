# 16.8 — ESI: Testing Architecture di Order Operations

A questo punto Order Operations possiede abbastanza architettura da rendere il testing una decisione di sistema, non una fase finale del delivery.

Abbiamo Functional Analysis, requirements, API ed event contract, Data Ownership Map, Failure Mode Map, Threat Model, Security Control Matrix, Reliability Contract e Observability Contract.

Ognuno di questi artefatti contiene claim che possono essere sbagliate.

La Testing Architecture del Capitolo 16 nasce per una sola ragione:

> **decidere quale boundary deve essere attraversato per avere una possibilità reale di falsificare ciascuna claim importante.**

Non partiamo quindi dal framework e nemmeno dalla piramide.

Partiamo dalle cose che ESI non può permettersi di credere soltanto sulla parola.

## La domanda che unifica la strategy

Commerce & Operations vuole mantenere una delivery veloce.

Payments & Risk vuole contract e duplicate-delivery safety verificabili.

Security vuole evidence negativa su tenant isolation e privilege.

Platform non vuole ricreare Azure per ogni test locale.

Reliability vuole failure e recovery provati.

Finance non vuole una seconda produzione sempre accesa soltanto per la suite.

Il trade-off non è quindi:

```text
pochi test
vs
molti test
```

È:

```text
confidence
vs
feedback latency
vs
environment fidelity
vs
cost
vs
maintenance burden
```

La decisione ESI è una **evidence pipeline a più velocità**.

Il principio resta semplice:

> **ogni rischio compra il livello di realismo necessario, non il massimo realismo disponibile.**

## Claim 1 — Una Payment Escalation deve rappresentare una sola intenzione business

Questa claim contiene più proprietà.

Una escalation può essere creata soltanto da un `OperationalCase` di categoria `Payment`.

La stessa `escalationId`, associata allo stesso case e allo stesso tenant, deve essere trattata come replay idempotente.

La stessa identità riutilizzata per un case o tenant differente deve invece diventare conflict o rejection.

Il layer più economico capace di verificare queste regole è l'application layer.

Qui vogliamo scenari deterministici come:

```text
Payment
→ accepted

Shipping / Order
→ rejected

same escalationId + same intent
→ replay
→ no second business intent

same escalationId + different case or tenant
→ rejected
→ no new outbox
→ no foreign data exposed
```

Questo produce evidence forte sulla semantica applicativa.

Non dimostra però ancora che PostgreSQL e HTTP preservino la stessa proprietà.

Per questo la chain continua con:

```text
application tests
→ PostgreSQL integration
→ HTTP integration
```

Il database serve quando la claim dipende da constraint, transaction e concurrency reali.

L'HTTP host serve quando vogliamo verificare davvero `Idempotency-Key`, serialization, authentication e authorization boundary.

La stessa proprietà non viene duplicata ovunque. Ogni layer verifica la parte che soltanto quel boundary può falsificare.

## Claim 2 — PaymentEscalation e OutboxMessage devono essere atomici

Il contratto è:

```text
PaymentEscalation commit
⇔
OutboxMessage commit
```

Un application test può dimostrare che il use case richiede entrambe le write nello stesso `UnitOfWork`.

Non può dimostrare la semantica della transaction PostgreSQL.

La evidence forte richiede quindi un'integrazione reale con PostgreSQL e un fault introdotto nella finestra che ci interessa.

Il test deve riuscire a distinguere:

```text
both committed
```

da:

```text
neither committed
```

e deve impedire:

```text
PaymentEscalation committed
OutboxMessage missing
```

Questo è un esempio perfetto della regola del capitolo:

> **il fake verifica la nostra orchestration; la tecnologia reale verifica il boundary che il fake non può garantire.**

## Claim 3 — Il contratto cross-team deve restare compatibile

`OperationalCasePaymentEscalatedV1` non appartiene soltanto a Order Operations.

Esiste perché Payments & Risk deve comprenderlo.

La evidence si separa in tre domande.

La serializzazione produce il wire shape dichiarato?

Il provider continua a soddisfare l'aspettativa del consumer?

Il consumer, quando riceve quel messaggio, produce davvero un solo effetto business?

Sono tre livelli diversi:

```text
serialization/schema
→ consumer-provider contract
→ downstream functional/idempotency evidence
```

Un contract test verde non dimostra che Payments & Risk non creerà due workflow.

Allo stesso modo un E2E completo non è il modo più economico per scoprire che un campo obbligatorio è scomparso.

La proprietà cross-team più importante è:

```text
same EscalationId delivered twice
→ one downstream business workflow
```

Order Operations non può dichiararla `Verified` da solo.

L'owner principale di quella evidence è Payments & Risk.

Questo rende visibile una regola organizzativa importante:

> **la responsabilità di un test segue il boundary che possiede la semantica, non il team che desidera il risultato.**

## Claim 4 — Un retry non deve trasformare un'incertezza tecnica in un doppio effetto business

Il path di pubblicazione contiene una finestra inevitabilmente ambigua:

```text
broker accepts message
→ local acknowledgement / markPublished is lost
```

Il publisher può dover ripubblicare.

La Testing Strategy deve quindi provare almeno che:

```text
same messageId is preserved
retry is bounded
failure is classified
exhausted path is explicit
```

Il numero esatto di tentativi è una configurazione.

La proprietà è più importante:

```text
transient
→ retry allowed

permanent semantic rejection
→ no blind retry

unknown outcome
→ retry with stable identity
```

Una seconda proprietà riguarda la reconciliation:

```text
Requested
+ not Delivered
+ age > threshold
→ reconciliation candidate
```

Qui il clock controllato è parte della testability. Non aspettiamo il tempo reale e non usiamo `sleep()` per dimostrare una regola temporale.

## Claim 5 — Tenant isolation e least privilege devono fallire in modo sicuro

La security evidence non può fermarsi a un `403`.

Per una richiesta cross-tenant il risultato atteso è:

```text
denied
AND no PaymentEscalation persisted
AND no OutboxMessage persisted
AND no foreign data disclosed
```

La chain di evidence cresce con il boundary:

```text
application authorization test
→ authenticated HTTP negative test
→ staging identity test
```

La runtime identity introduce poi una claim che non può essere provata localmente:

```text
App Service managed identity
can use only required data-plane capabilities
but cannot administer RBAC or infrastructure
```

Questo richiede Azure.

Non è un difetto della suite locale. È semplicemente una property il cui boundary reale vive altrove.

## Claim 6 — Le migration devono preservare stato e constraint reali

La migration chain deve poter partire da un database vuoto:

```text
empty DB
→ apply migration 001
→ apply migration 002
→ schema valid
```

Ma il caso più interessante è evolutivo:

```text
previous supported schema
+ representative persisted state
→ next migration
→ old data preserved
→ new constraints valid
```

Un repository finto non può fornire evidence su locking, transaction, constraint o comportamento reale delle migration PostgreSQL.

Per questo questa parte appartiene al PR integration layer.

## Claim 7 — Il sistema deve sapere fallire e tornare indietro

Il Reliability Contract ha già trasformato availability, RTO e RPO in claim misurabili.

Ora la Testing Strategy assegna loro un gate.

Per un outage del consumer Payments, l'atteso è:

```text
local escalation acceptance continues
broker/outbox path retains intent
backlog becomes visible
business delay becomes visible
recovery drains backlog
no duplicate business effect
```

Per PostgreSQL failover vogliamo:

```text
fault executed
→ actual downtime measured
→ reconnect observed
→ committed state checked
→ observed RTO/RPO compared with contract
```

Per PITR:

```text
restore executed
→ restored data validated
→ application validation
→ actual recovery time
→ actual data-loss window
```

Questi non sono test da ogni pull request.

Sono readiness evidence.

La loro frequenza può essere più bassa; la loro importanza non lo è.

## Claim 8 — Se il sistema fallisce, dobbiamo accorgercene

Il Capitolo 15 ha reso l'observability un contratto.

Ora dobbiamo testare anche quel contratto.

Per esempio, quando il publisher fallisce ripetutamente vogliamo verificare che:

```text
failure signal emitted
correlation preserved
outbox age becomes visible
alert condition can be reached
correct owner is addressable
runbook exists
```

Separatamente, la telemetry non deve esporre:

```text
access token
Authorization header
secret
```

La prima evidence può essere locale sul telemetry policy/adapter; una verifica più forte avverrà interrogando la telemetry realmente emessa in staging.

Un sistema che gestisce correttamente il failure ma non permette di rilevarlo non ha ancora chiuso il rischio operativo.

## La evidence pipeline ESI

Dalle claim precedenti emerge una pipeline naturale.

### Local / commit

Scopo: feedback deterministico in pochi secondi o minuti.

```text
typecheck
business/application tests
outbox/retry tests
deterministic schema/contract checks
static security baseline
```

### Pull request

Scopo: attraversare i boundary che richiedono tecnologia reale ma non l'intera cloud topology.

```text
local fast layer
PostgreSQL integration
migration tests
HTTP/API integration
consumer-provider contract
selected negative security tests
Bicep build/lint
```

### Staging / deployment

Scopo: verificare ciò che esiste soltanto nel deployment reale.

```text
private connectivity
Entra authentication
runtime RBAC negative tests
Service Bus adapter
managed PostgreSQL connectivity
private synthetic smoke
```

### Scheduled / readiness

Scopo: produrre evidence costosa ma necessaria prima di chiamare il workload production-ready.

```text
selected mutation testing
performance/capacity
consumer outage
PostgreSQL failover
PITR restore
alert drill
broader security verification
```

### Production continuous verification

Scopo: capire se le proprietà continuano a valere nel sistema in esecuzione.

```text
SLI / SLO
private synthetic journey
alerting
runtime drift / operational evidence
```

La pipeline non è una gerarchia di prestigio.

È una gerarchia di costo e fedeltà.

## Il primo incremento eseguibile

Il Capitolo 16 fa comparire finalmente una suite in `tests/`.

La prima suite non finge di provare tutto.

Codifica soltanto le property per cui il capstone possiede già un boundary eseguibile senza infrastruttura esterna, fra cui:

- Payment category eligibility;
- idempotent replay;
- conflicting idempotency intent;
- tenant mismatch;
- escalation + outbox orchestration;
- outbox retry/exhaustion;
- telemetry classification.

Usiamo il test runner integrato di Node sul JavaScript compilato.

Non introduciamo Vitest, Jest o un altro framework soltanto perché sono popolari.

Se la suite richiederà capability che il runner corrente non offre, quella sarà una nuova decisione con un nuovo trade-off.

È ancora `fit before fashion`.

## Coverage e mutation: strumenti, non obiettivi

ESI rende visibile la code coverage per trovare zone mai esercitate.

Non la usa come prova di confidence.

Per le aree più rischiose useremo mutation testing in modo selettivo.

La prima candidata è `requestPaymentEscalation`.

Fault plausibili includono:

```text
remove category check
remove tenant check
change conflict condition
accept different case for same escalationId
skip outbox append
```

La domanda non è quale mutation score otteniamo.

È:

> **la suite che oggi chiamiamo forte riesce davvero a vedere questi errori?**

## AI-generated test policy

Gli agenti possono proporre test, fixture, fault e mutation candidate.

Ma il prompt di default non sarà:

```text
write more tests
```

Sarà più vicino a:

```text
Given this requirement, risk and implementation,
identify realistic faults that violate the property.
Propose the smallest deterministic tests that would fail for those faults.
Do not optimize for coverage percentage.
```

Il test generato entra nella suite soltanto quando possiamo rispondere a quattro domande:

```text
quale risk protegge?
quale fault deve rilevare?
perché questo layer è sufficiente?
quale nuova evidence aggiunge?
```

Il fatto che passi non basta.

## La salute della suite è parte del prodotto

ESI adotta una regola esplicita:

> **un test flaky è un defect del quality system.**

Un test instabile deve avere owner, issue ed evidence. Può essere quarantinato temporaneamente quando blocca lavoro non correlato, ma la quarantine deve restare visibile e avere una scadenza.

`rerun until green` non è una policy di qualità.

Trasforma una evidence ambigua in un verde amministrativo.

## Stato al termine del Capitolo 16

La baseline narrativa del capitolo è:

```text
Testing Strategy                  Designed
Risk-to-Evidence Map              Designed
first deterministic test suite    Codified
local execution                   Verified only when actually run
PostgreSQL integration            Designed / Pending
consumer contract                 Designed / Pending cross-team
Azure identity/network tests      Designed / Pending
performance/recovery drills       Designed / Pending
production synthetic journey      Designed / Pending
```

Il file vivo `docs/testing-strategy.md` continuerà a evolvere nei capitoli successivi. Nello stato attuale del repository include già legacy/refactoring e runtime AI evaluation introdotti molto più avanti.

Il manoscritto qui conserva invece il livello di conoscenza raggiunto da ESI **al Capitolo 16**.

Non gonfiamo la maturity perché alcuni test locali esistono.

## Il compromesso ESI

**Esigenza:** aumentare la velocità di modifica senza perdere confidence sui boundary critici.

**Tensione:** confidence contro feedback latency, fidelity, costo e maintenance burden.

**Decisione:** evidence pipeline a più velocità; application test per le regole locali, PostgreSQL/API/contract test per i boundary reali, staging per identity/network/cloud behavior, readiness drill per recovery e performance, production verification per SLI e synthetic journey.

**Costo accettato:** nessun singolo gate dimostra tutto e alcune evidence arrivano più lentamente.

**Quality floor:** idempotency, tenant isolation, authorization, atomicità escalation/outbox, contract compatibility, duplicate-delivery safety, migration safety e recovery evidence non possono sparire perché sono costose da verificare.

**Guardrail:** Testing Strategy, Risk-to-Evidence Map, pipeline gate, flakiness policy, incident-derived regression, mutation selettiva e human review dei test AI-generated.

> **Il test layer più costoso non vale di più perché costa di più. Vale soltanto quando riesce a falsificare una claim che i layer più economici non possono mettere davvero alla prova.**