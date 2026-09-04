# ESI — Production Readiness Review di Order Operations

> **Scenario fittizio/composito.** Questa review usa lo stato reale del capstone al termine del Capitolo 25. I requisiti e le decisioni ESI sono simulati; gli stati `Verified` vengono usati soltanto quando nel percorso del libro è stata registrata evidence corrispondente.

Siamo arrivati al momento in cui dobbiamo prendere una decisione.

Non una decisione architetturale astratta.

Una decisione di launch.

---

# 1. Launch proposal

Product propone un pilot interno di Order Operations.

## Proposed cohort

```text
ESI workforce only
bounded Operations users
private access path
single production region
```

## Proposed capability

### Included candidate

```text
core Operational Case read journey
```

### Requested, but separately gated

```text
Payment Escalation
```

### Explicitly excluded

```text
Priority candidate authoritative cutover
Case Explanation Assistant
public/mobile/partner ingress
refund/remediation action
```

Questa separazione è intenzionale.

Il launch non deve portarsi dietro capability non pronte soltanto perché vivono nello stesso repository.

---

# 2. Readiness decision model

Useremo:

```text
READY
→ sufficient evidence for current launch boundary

CONDITIONAL
→ may proceed only with explicit conditions

BLOCKED
→ required evidence/capability missing

NOT APPLICABLE
→ outside current launch boundary
```

E separatamente:

```text
Accepted Risk
Follow-up
Unknown
```

---

# 3. Readiness matrix — current state

| Area | Claim | Current evidence | State | Launch impact |
|---|---|---|---|---|
| Functional | Core product semantics are documented | Functional Analysis + Requirements | CONDITIONAL | requires staged critical-journey verification |
| Architecture | boundaries and ownership are explicit | Context/Data/Architecture artifacts + fitness evidence | CONDITIONAL | structural evidence exists; runtime boundary evidence incomplete |
| Payment data | Escalation + Outbox atomicity on PostgreSQL | local orchestration tests only; OO-001 pending | BLOCKED | blocker for Payment Escalation launch boundary |
| Cloud deployment | IaC expresses intended Azure baseline | `infra/main.bicep` Codified | BLOCKED | no full build/deploy/private-connectivity evidence recorded |
| Security | Threat Model and controls documented | static/IaC direction + local negative logic only | BLOCKED | critical runtime/network/RBAC verification pending |
| Reliability | SLO/RTO/RPO defined | Reliability Contract; zonal intent Codified partly | BLOCKED | restore/failover evidence pending |
| Observability | signal/SLI contract defined | Observability Contract + local telemetry boundary | BLOCKED | staging/runtime signal + alert exercise pending |
| Deployment | safe-deployment principles documented | architecture/docs only | BLOCKED | rollout/rollback evidence not yet recorded |
| Capacity | capacity direction exists | >=2 App Service instances direction | UNKNOWN | no representative runtime/load evidence yet |
| Ownership | workload/domain ownership documented | Repository Map, operating model | CONDITIONAL | secondary maintainer/production support drill pending |
| Continuity | another maintainer can operate safely | continuity drill Designed | BLOCKED for One-Man production ownership | no drill executed |
| Cost | major premiums/unit metrics modeled | Cost Model + allocation tags | CONDITIONAL | real billing/unit metrics pending; may not block bounded pilot |
| AI | Case Explanation boundary/eval seed exists | contract + AI boundary fitness | NOT APPLICABLE | feature excluded from launch; OO-002 pending |
| Priority migration | target policy coded/tested | local target/shadow tests | NOT APPLICABLE | authoritative cutover excluded |

La matrice ci dice già qualcosa di importante.

> **Order Operations non è production-ready oggi secondo l'evidence registrata nel capstone.**

Questa non è una sconfitta.

È una conclusione utile.

---

# 4. Perché il core non riceve ancora un GO

Potremmo essere tentati di dire:

> il core è read-only, quindi lanciamolo.

Ma anche il core richiede almeno:

```text
authenticated private access
correct tenant/resource authorization
real deployment path
runtime dependency connectivity
observable critical journey
support ownership
rollback/fallback
```

Nel capstone questi elementi sono in parte:

```text
Designed
```

o:

```text
Codified
```

ma non ancora tutti:

```text
Verified
```

Quindi il PRR non inventa il `GO`.

---

# 5. Payment Escalation è un launch boundary separato

Qui il blocker è molto netto.

Abbiamo:

```text
PaymentEscalation
+ OutboxMessage
```

progettati per essere atomici.

Il local application test verifica l'orchestrazione.

Ma il Testing Strategy dice esplicitamente:

```text
TST-005
real PostgreSQL transaction evidence
= Pending
```

E `OO-001` esiste proprio per chiudere quel gap.

Quindi:

```text
LB-ESCALATION
= BLOCKED
```

finché non abbiamo almeno:

```text
real migration chain
successful atomic commit
rollback when second write fails
relevant concurrency/uniqueness evidence
```

Non rinominiamo la mancanza `accepted risk` solo perché il codice sembra corretto.

---

# 6. AI Assistant resta fuori dal launch

Il Case Explanation Assistant ha:

```text
AI Feature Contract
provider-neutral port
source validator
eval seed
AI boundary fitness
```

Ma non ha ancora:

```text
real model comparison
real groundedness results
prompt-injection results
provider/privacy review
latency
cost
operator usefulness
runtime monitoring
```

`OO-002` è stato creato per questo.

Decisione:

```text
LB-AI
= NOT READY
= excluded from core production launch
```

Questa esclusione riduce il launch risk senza richiedere che il core aspetti indefinitamente una capability opzionale.

---

# 7. Priority cutover resta non autorizzato

Abbiamo fatto progressi importanti:

```text
ConfirmedPriorityPolicy
LegacyPriorityAdapter
BranchingPriorityPolicy
ExpectedDifference ED-001
local tests
```

Ma il Refactoring Safety Plan richiede ancora:

```text
runtime shadow telemetry
consumer inventory
rollout evidence
fallback owner
```

Quindi:

```text
LB-PRIORITY-CANDIDATE
= NOT AUTHORIZED
```

Non è un blocker per il core pilot se continuiamo a utilizzare il percorso legacy/compatibility approvato.

---

# 8. Production blocker register

## PRB-001 — Cloud deployment evidence

Required:

```text
Bicep build/lint
non-production deployment
private ingress/connectivity test
smoke test
rollback/fallback exercise
```

Owner:

```text
Order Operations + Platform
```

## PRB-002 — Security runtime evidence

Required:

```text
wrong-role negative test
cross-tenant negative test
runtime RBAC negative test
public access negative test
production-support access path
```

Owner:

```text
Order Operations + Security + Platform
```

## PRB-003 — Reliability / recovery evidence

Required:

```text
PostgreSQL backup/restore exercise
failover path appropriate to launch boundary
actual timing vs RTO/RPO
```

Owner:

```text
Order Operations + Platform/Operations
```

## PRB-004 — Observability / alert evidence

Required:

```text
critical journey emits expected signals
known failure emits expected signal
SLI query exercised
page/ticket path exercised
owner/runbook linkage verified
```

Owner:

```text
Order Operations
```

## PRB-005 — Continuity / support readiness

Required:

```text
secondary maintainer nominated in real organization
continuity drill
support window decision
incident access verification
```

Owner:

```text
Commerce & Operations Engineering
```

## PRB-006 — Capacity evidence

Required:

```text
pilot traffic estimate
representative smoke/load evidence
known bottleneck/headroom
```

Owner:

```text
Order Operations
```

---

# 9. Capability-specific blocker register

## PRB-ESC-001

```text
OO-001 PostgreSQL atomicity
```

Blocks:

```text
Payment Escalation launch
```

Does not necessarily block:

```text
read-only core pilot
```

## PRB-AI-001

```text
OO-002 real model/provider evaluation
```

Blocks:

```text
Case Explanation Assistant production enablement
```

Does not block:

```text
core launch without AI
```

---

# 10. Potential accepted risk — regional recovery

ESI ha già deciso un regional disaster target più rilassato rispetto all'intra-region recovery.

Per un bounded internal pilot potremmo accettare:

```text
no active-active multi-region
```

Ma solo se:

```text
backup/restore evidence exists
single-region risk is explicit
business owner accepts downtime envelope
launch boundary stays internal/bounded
```

Quindi:

```text
No multi-region
```

non è il blocker.

Il blocker è:

```text
recovery capability not yet demonstrated
```

Questa distinzione è importante.

---

# 11. Production Readiness decision

Current decision at the end of Chapter 26 authoring:

```text
Order Operations
Production Readiness Review

Decision
NO-GO — evidence closure required
```

Non perché il progetto sia “fatto male”.

Ma perché la sua stessa disciplina ci impedisce di confondere:

```text
Designed / Codified
```

con:

```text
Verified for production
```

---

# 12. Path to Conditional GO

Il prossimo gate potrebbe consentire:

```text
CONDITIONAL GO
for LB-CORE only
```

quando chiudiamo almeno:

```text
PRB-001 cloud deployment evidence
PRB-002 security runtime evidence
PRB-003 representative recovery evidence
PRB-004 observability/alert evidence
PRB-005 support/continuity evidence
PRB-006 capacity evidence
```

con:

```text
Payment Escalation disabled unless OO-001 closes
Case Explanation Assistant disabled
Priority candidate disabled
bounded internal cohort
explicit support window
```

Questo sarebbe un vero conditional launch boundary.

Non un modo elegante per saltare i blocker.

---

# 13. Cosa abbiamo guadagnato

Senza i capitoli precedenti avremmo probabilmente una checklist generica:

```text
security? yes
backup? yes
monitoring? yes
```

Ora possiamo dire:

```text
which security property?
which restore evidence?
which SLI?
which launch boundary?
which owner?
which claim remains pending?
```

Questa è la differenza fra checklist e sistema di decisione.

> **La Production Readiness Review non ci ha detto che Order Operations è quasi pronto. Ci ha detto esattamente quali prove mancano perché una promessa di produzione diventi difendibile.**
