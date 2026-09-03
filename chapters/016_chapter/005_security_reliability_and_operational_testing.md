# 16.5 — Testare security, reliability e operabilità

Una suite funzionale perfetta può convivere con un sistema insicuro.

Una suite di unit test perfetta può convivere con un restore impossibile.

Un API contract perfettamente compatibile può convivere con un sistema che collassa sotto backlog.

Per questo la Testing Architecture deve derivare dai quality attribute, non soltanto dalle feature.

## Functional correctness non basta

Order Operations deve fare correttamente almeno tre cose:

```text
investigare ordini
accettare Payment Escalation
consegnare Payment Escalation
```

Ma deve anche farle:

```text
senza attraversare tenant
senza perdere intent committed
senza duplicare side effect
entro target di latency/recovery
con privilege limitati
con evidence sufficiente
```

Queste proprietà non sono accessorie.

Sono parte del comportamento atteso.

## Security test derivati dal Threat Model

Il Threat Model del Capitolo 13 contiene threat concreti.

Quindi la Testing Strategy non deve partire da:

```text
fare penetration test
```

ma da:

```text
threat
→ control
→ verification
```

Esempio:

```text
T-02 cross-tenant access
→ server-side tenant authorization
→ negative test con foreign case identifier
```

Oppure:

```text
runtime identity compromise
→ least privilege
→ negative RBAC test: runtime cannot assign role / modify infra
```

Questo rende la security verificabile per property.

OWASP ASVS nasce proprio come standard di verification requirement per technical security control e può fornire una baseline di assurance oltre ai threat specifici del workload.

Fonte:

- [OWASP — Application Security Verification Standard](https://owasp.org/www-project-application-security-verification-standard/)

## Negative security test

La security vive spesso in ciò che il sistema deve rifiutare.

Per Order Operations:

```text
unauthenticated
→ denied

wrong role
→ denied

wrong tenant
→ denied

malformed identifier
→ controlled rejection

runtime identity requesting admin operation
→ denied
```

Il test deve verificare anche il non-effetto.

Per esempio:

```text
403
AND no PaymentEscalation persisted
AND no OutboxMessage persisted
AND no sensitive audit leakage
```

Una risposta HTTP corretta non basta se il side effect è già avvenuto.

## Security scanner ≠ security test strategy

SAST, SCA, secret scanning e IaC scanning sono utili.

Ma rispondono a domande specifiche.

```text
secret scanner
→ cerca classi di secret

SCA
→ cerca rischio noto nelle dependency

SAST
→ cerca pattern/problematic path nel codice

DAST
→ osserva comportamento runtime da una prospettiva esterna
```

Nessuno di questi dimostra da solo:

```text
tenant isolation works
```

Quindi la pipeline deve combinare strumenti automatici e scenario verification.

## Reliability test derivati dal Failure Mode Map

Nel Capitolo 14 abbiamo scritto:

> La resilienza che non abbiamo mai provato è ancora un'ipotesi.

La Testing Strategy deve rendere questa frase operativa.

Per ogni failure mode chiediamo:

```text
injection / trigger
expected degraded behavior
recovery path
measurement
stop condition
owner
```

Per esempio:

### Payments consumer unavailable

Expected:

```text
Payment Escalation local acceptance continues
outbox/broker delivery backlog grows
operator can see delayed delivery
no duplicate business intent
recovery drains backlog
```

Questo è un test molto diverso da:

```text
mock broker throws exception
```

Entrambi servono.

Il primo dimostra system behavior.

Il secondo aiuta a verificare local error handling.

## Failure injection proporzionata

Non serve iniziare spegnendo una regione.

Possiamo costruire una scala:

```text
Level 1 — deterministic local fault
Level 2 — integration dependency fault
Level 3 — non-production environment fault
Level 4 — controlled production-like game day
Level 5 — production experiment con guardrail forti, se giustificato
```

Il livello deve essere proporzionale alla property e al rischio.

L'obiettivo non è dimostrare coraggio.

È produrre evidence.

## Recovery test

La reliability non finisce al failover.

Per Order Operations dobbiamo verificare almeno:

### Application rollback

```text
bad deploy
→ rollback known-good artifact
→ synthetic journey restored
```

### PostgreSQL failover

```text
primary unavailable
→ HA transition
→ application reconnects
→ committed data preserved
```

### PITR

```text
logical corruption at T
→ restore to acceptable point
→ actual RPO measured
→ application validation
```

### Outbox recovery

```text
publisher stops
→ pending grows
→ publisher recovers
→ backlog drains
→ no silent loss
```

Il pass criterion deve derivare da RTO/RPO e Reliability Contract.

## Backup test

Un backup job `Succeeded` non dimostra il recovery.

Il test significativo è:

```text
backup exists
→ restore executed
→ data validated
→ application can use restored state
→ elapsed time measured
```

È la differenza tra availability del backup service e recoverability del nostro prodotto.

## Performance test come requirement verification

Un load test senza target è un esperimento esplorativo.

Può essere utile.

Ma non è ancora acceptance evidence.

Per diventarlo deve collegarsi a qualcosa come:

```text
expected load model
+ latency SLI
+ error rate
+ saturation/headroom requirement
```

Order Operations non ha ancora un workload reale misurato.

Quindi evitiamo di inventare:

```text
10,000 RPS
```

solo per far sembrare serio un test.

Partiremo da workload ipotetico esplicitamente marcato, poi lo sostituiremo con evidence quando il capstone avrà execution environment.

## Capacity test: non solo throughput

La capacity interessa almeno:

- App Service worker saturation;
- PostgreSQL connections;
- query latency;
- outbox accumulation;
- publisher throughput;
- Service Bus queue depth;
- Payments consumer drain rate;
- telemetry ingestion.

Un sistema può sostenere il traffico normale e fallire nel recovery perché non ha abbastanza headroom per smaltire il backlog.

Quindi dobbiamo testare anche:

```text
failure period
→ backlog accumulates
→ dependency recovers
→ backlog drain
```

non soltanto steady state.

## Observability test

Anche il sistema di osservazione deve essere verificato.

Esempio:

```text
Payment Escalation fails to publish
```

Dobbiamo aspettarci:

```text
failure metric increments
structured event exists
correlation preserved
alert condition eventually becomes true
runbook link resolves
```

Altrimenti abbiamo testato il failure path ma non la nostra capacità di accorgercene.

Il Capitolo 15 ha separato `Designed`, `Codified`, `Verified`, `Monitored` proprio per questo.

## Alert test

Un alert può essere sintatticamente valido e operativamente inutile.

Verifichiamo almeno:

```text
signal condition
→ alert fires
→ correct owner receives it
→ context is sufficient
→ runbook exists
→ recovery closes condition
```

E periodicamente:

```text
alert frequency
false positive rate
acknowledgement behavior
stale ownership
```

Un alert che nessuno guarda è technical debt.

## Synthetic test

Il synthetic journey di Order Operations è interessante perché deve rispettare il security boundary.

Quindi il test stesso ha requisiti:

- private execution path;
- dedicated identity;
- synthetic tenant;
- no customer data;
- permission minima;
- cleanup deterministico;
- distinguibile dal traffico reale;
- non escluso dagli SLI in modo arbitrario se misura lo stesso journey.

Un synthetic test progettato male può diventare:

- source di falsi alert;
- leak di credential;
- rumore nei business metric;
- dipendenza operativa invisibile.

Anche il test ha un threat model leggero.

## Infrastructure as Code test

Per `infra/main.bicep` distinguiamo più livelli.

### Static

```text
bicep build
bicep lint
policy/static rule
```

### Deployment

```text
resource provisioned
configuration accepted
```

### Security behavior

```text
public access denied
runtime RBAC restricted
private connectivity works
```

### Reliability behavior

```text
multiple instances
zone setting applied
failure behavior tested
```

### Application behavior

```text
real app can connect and serve critical journey
```

Microsoft Well-Architected raccomanda esplicitamente di non fermarsi al test isolato dell'IaC: serve anche cross-layer validation che l'applicazione riesca effettivamente a usare l'infrastruttura provisionata.

Fonte:

- [Microsoft Learn — Architecture strategies for testing](https://learn.microsoft.com/en-us/azure/well-architected/operational-excellence/testing)

## Test environment come architettura

Un test environment non deve essere una copia rituale della produzione.

Deve essere sufficientemente fedele alla property che vogliamo verificare.

Per esempio:

### Unit/component

Nessun Azure necessario.

### PostgreSQL integration

Serve PostgreSQL compatibile.

Non serve necessariamente App Service.

### Private networking test

Serve topologia Azure sufficientemente realistica.

### Zone failover test

Serve un environment che supporti davvero quella capability.

Microsoft suggerisce purpose-driven environment e, quando appropriato, environment effimeri per ridurre costo mantenendo il livello di realismo necessario.

Fonte:

- [Microsoft Learn — Build confidence in Azure workloads with effective testing practices](https://learn.microsoft.com/en-us/azure/well-architected/design-guides/testing)

## Test data

Test data è parte della security e della testability.

Preferiamo:

```text
synthetic data
explicit tenant
small deterministic fixtures
privacy-safe samples
```

Evitiamo di default:

```text
production dump copied in staging
```

perché introduce:

- privacy risk;
- secret/sensitive field exposure;
- retention problem;
- non-determinism;
- test coupling a casi reali non documentati.

Quando serve rappresentatività statistica, deve esserci una data strategy esplicita.

## Production verification

“Never test in production” è troppo assoluto.

In produzione verifichiamo continuamente:

- synthetic journey;
- canary;
- health;
- real SLI;
- rollback;
- configuration;
- feature rollout.

Ma questo non giustifica usare customer traffic come sostituto della pre-production evidence.

La domanda è:

> quale test è sicuro in quale ambiente?

Non:

> production sì o no?

## Corollario

> **Un quality attribute che non sappiamo verificare è ancora una dichiarazione di intenti. Testing Architecture significa trasformare security, reliability e operabilità in evidence ripetibile, non in fiducia nominale.**