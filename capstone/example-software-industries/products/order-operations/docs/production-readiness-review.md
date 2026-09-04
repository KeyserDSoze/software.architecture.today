# Order Operations — Production Readiness Review

> **Scenario fittizio ESI.** Prima Production Readiness Review persistente, introdotta nel Capitolo 26. Questa review riflette lo stato di evidence del capstone e non deve essere usata per promuovere claim oltre ciò che è stato realmente verificato.

## Review ID

```text
PRR-OO-001
```

## Review principle

> **Readiness non è ottenere un sì. È rendere costoso dire sì senza sapere perché.**

## Current decision

```text
NO-GO — evidence closure required
```

Order Operations is **not currently declared production-ready**.

The reason is not missing architecture intent. The reason is that several launch-critical properties remain `Designed` or `Codified` without the required higher-fidelity evidence.

---

# Launch boundaries

## LB-CORE — Core operational read journey

Proposed boundary:

```text
ESI workforce only
bounded Operations cohort
private access path
single Azure region
core Operational Case read/investigation journey
```

Excluded:

```text
public/mobile/partner ingress
AI assistant
Priority candidate cutover
refund/remediation
```

Current state:

```text
NO-GO
```

Main blockers:

```text
PRB-001 cloud deployment evidence
PRB-002 security runtime evidence
PRB-003 recovery evidence
PRB-004 observability/alert evidence
PRB-005 support/continuity evidence
PRB-006 capacity evidence
```

## LB-ESCALATION — Payment Escalation

Includes:

```text
POST Payment Escalation
PaymentEscalation persistence
OutboxMessage persistence
publisher
Service Bus
Payments & Risk consumer boundary
```

Current state:

```text
BLOCKED
```

Additional blocker:

```text
PRB-ESC-001
OO-001 PostgreSQL atomicity evidence
```

## LB-PRIORITY-CANDIDATE — Priority target authoritative cutover

Current state:

```text
NOT AUTHORIZED
```

Reason:

```text
runtime shadow evidence pending
consumer/retirement evidence pending
fallback/cutover gate not yet satisfied
```

The existing compatibility/legacy path remains the current supported direction.

## LB-AI — Case Explanation Assistant

Current state:

```text
NOT READY / DISABLED FOR CORE LAUNCH
```

Blocker:

```text
PRB-AI-001
OO-002 real model/provider evaluation
```

Additional required evidence:

```text
real groundedness/source-attribution results
prompt-injection/authority-boundary evaluation
provider data/privacy/security review
latency distribution
cost per explanation / candidate economics
operator usefulness evidence
runtime AI observability/fallback exercise
```

---

# Readiness status vocabulary

```text
READY
→ evidence sufficient for current launch boundary

CONDITIONAL
→ progression possible only under explicit conditions

BLOCKED
→ required evidence/capability missing

NOT AUTHORIZED
→ decision gate has not permitted this boundary

NOT APPLICABLE
→ outside current launch boundary
```

Risk status:

```text
Accepted Risk
Follow-up
Unknown
```

`Unknown` MUST NOT be silently converted to `Follow-up`.

---

# Evidence model

For each readiness claim preserve:

```text
Claim
Required evidence
Current evidence
Limitations
Owner
State
Invalidating trigger
```

General evidence vocabulary remains:

```text
Designed
→ Codified
→ Verified
→ Monitored
```

## Evidence strength rule

Use the cheapest evidence that can genuinely demonstrate the property.

Examples:

```text
business rule
→ deterministic test may be sufficient

PostgreSQL transaction semantics
→ real PostgreSQL

Azure private connectivity/RBAC
→ real Azure non-production environment

restore RTO/RPO
→ actual recovery drill

AI groundedness
→ real model execution against versioned eval set

continuity
→ actual secondary-maintainer drill
```

---

# Readiness matrix

| ID | Area | Claim | Required evidence | Current state | Launch impact | Owner |
|---|---|---|---|---|---|---|
| RDY-001 | Functional | core journey matches confirmed semantics | staged/synthetic critical journey + existing deterministic tests | Partial | Core blocker until staged evidence | Product + workload |
| RDY-002 | Architecture | intended structural boundaries remain enforced | architecture fitness + runtime boundary evidence where applicable | Partial | Core | workload |
| RDY-003 | Data | PaymentEscalation + Outbox atomic on PostgreSQL | real PostgreSQL integration | Pending | Escalation blocker | workload |
| RDY-004 | Cloud | Azure baseline deploys as intended | Bicep build/lint + nonprod deploy + smoke | Pending | Core blocker | workload + Platform |
| RDY-005 | Security | intended auth/network/RBAC boundaries hold | runtime negative tests | Pending | Core blocker | Security + workload + Platform |
| RDY-006 | Reliability | workload can recover within current launch expectations | restore/failover drill | Pending | Core blocker | workload + Operations/Platform |
| RDY-007 | Observability | critical failure creates actionable evidence | staged signal/SLI/alert exercise | Pending | Core blocker | workload |
| RDY-008 | Deployment | rollout can stop/recover safely | deployment + rollback/fallback exercise | Pending | Core blocker | workload + Platform |
| RDY-009 | Capacity | pilot demand fits with known headroom | pilot estimate + representative runtime/load evidence | Unknown/Pending | Core blocker | workload |
| RDY-010 | Ownership | incidents have owner/support route | support model + incident access + escalation path | Partial | Core | workload + Commerce & Operations |
| RDY-011 | Continuity | system remains operable when lead unavailable | secondary-maintainer continuity drill | Pending | One-Man production ownership blocker | Engineering |
| RDY-012 | Cost | workload cost is attributable and major premiums known | allocation metadata + real billing after deploy | Partial | May be Conditional for bounded pilot | workload + FinOps |
| RDY-013 | AI | Case Explanation meets quality/security/runtime criteria | real OO-002 candidate eval + runtime gates | Pending | AI-only blocker | Product + Security + workload |
| RDY-014 | Priority | target cutover is supported by runtime coexistence evidence | shadow telemetry + retirement/fallback evidence | Pending | Priority-only; not authorized | Product + workload |

---

# Production blocker register

## PRB-001 — Cloud deployment evidence

Affected boundary:

```text
LB-CORE
LB-ESCALATION
```

Required closure:

```text
bicep build/lint
policy/static validation appropriate to ESI
non-production deployment
private connectivity
application smoke
rollback/fallback exercise
```

Owner:

```text
Order Operations + Platform Engineering
```

Status:

```text
Open
```

## PRB-002 — Security runtime evidence

Required closure:

```text
unauthenticated denied
wrong-role denied
cross-tenant denied
runtime cannot administer infrastructure
public access negative test
incident/support access path verified
```

Owner:

```text
Order Operations + Security + Platform
```

Status:

```text
Open
```

## PRB-003 — Reliability / recovery evidence

Required closure:

```text
PostgreSQL backup/restore exercise
representative failover/recovery path
actual recovery timing
RTO/RPO comparison
unexpected behavior recorded
```

Owner:

```text
Order Operations + Platform/Operations
```

Status:

```text
Open
```

## PRB-004 — Observability / alert evidence

Required closure:

```text
critical journey emits expected signals
known dependency/publish failure emits expected signal
SLI query exercised
alert reaches owner
runbook/context reachable
resolution signal verified
```

Owner:

```text
Order Operations
```

Status:

```text
Open
```

## PRB-005 — Support / continuity evidence

Required closure:

```text
secondary maintainer assigned in real org context
continuity/vacation drill
support window agreed
incident access verified
escalation path exercised/reviewed
```

Owner:

```text
Commerce & Operations Engineering
```

Status:

```text
Open
```

## PRB-006 — Capacity evidence

Required closure:

```text
pilot demand estimate
representative load/smoke evidence
known bottleneck
headroom assumption
backpressure/degradation expectation
```

Owner:

```text
Order Operations
```

Status:

```text
Open
```

## PRB-ESC-001 — PostgreSQL transaction evidence

Work item:

```text
OO-001
```

Required closure:

```text
migration chain
successful escalation + outbox commit
failure on second write rolls back both
relevant uniqueness/concurrency behavior
```

Status:

```text
Open / execution Pending
```

## PRB-AI-001 — Runtime model evaluation

Work item:

```text
OO-002
```

Required closure:

```text
same eval oracle across candidates
critical safety case pass
quality comparison
latency/cost comparison
provider/security constraints
Product usefulness review
```

Status:

```text
Open / execution Pending
```

---

# Current accepted-risk candidates

No new risk is considered formally accepted merely by appearing in this section.

## AR-CAND-001 — Single-region launch

Potential bounded-pilot decision:

```text
No active-active multi-region
```

This may be acceptable for an internal bounded pilot **only after representative restore/recovery evidence exists** and the business owner accepts the region-wide downtime envelope.

Current status:

```text
Candidate only — not accepted in this PRR
```

---

# Disabled / deferred capability

```text
Case Explanation Assistant
→ disabled

Priority target authoritative cutover
→ not authorized

public/mobile/partner ingress
→ out of scope

refund/remediation write actions
→ out of scope
```

A disabled capability does not need full production evidence for the core launch, but the mechanism ensuring it remains disabled MUST be reliable when implemented.

---

# Deployment readiness

Current intended topology:

```text
Azure application landing zone
App Service + background publisher
PostgreSQL
Service Bus Premium
Managed Identity
Key Vault
Azure Monitor / Application Insights
private ingress/data-plane direction
single region
```

Current evidence:

```text
IaC intent = Codified
real deployment verification = Pending
```

Required before launch:

```text
artifact/version identification
non-production deployment
progression/stop criteria
rollback/fallback
migration compatibility
incident deployment access
```

---

# Operational readiness

Current documented ownership:

```text
Business/Product
→ Commerce & Operations

Workload
→ Order Operations

Payments/economic effects
→ Payments & Risk

Platform/network
→ Platform Engineering

Security policy/escalation
→ Security
```

One-Man Project pilot:

```text
Accountable Project Lead
→ defined role

Secondary Maintainer
→ required role

Continuity drill
→ Pending
```

Production support window:

```text
Pending business/operations decision
```

Production on-call schedule:

```text
Pending
```

---

# Required runbook / playbook surface before launch

Minimum candidate set:

```text
RB-001 deploy/rollback Order Operations
RB-002 inspect degraded core journey
RB-003 restore PostgreSQL
RB-004 inspect/redrive Payment Escalation backlog when enabled
RB-005 revoke/contain compromised workload or operator access
RB-006 recover after bad deployment/configuration
```

Current state:

```text
Detailed executable runbook set not yet Codified
```

This is part of PRB-005 / PRB-003 / PRB-004 closure rather than a separate green checkbox.

---

# Evidence package requirements

Each closed blocker should record:

```text
Evidence ID
Claim / blocker
Commit/version
Environment
Command/query/drill
Timestamp
Result
Limitations
Artifact/link
Owner
```

Do not use screenshots without claim/provenance as the only evidence source.

---

# Path to CONDITIONAL GO — LB-CORE only

A future review may consider:

```text
CONDITIONAL GO
```

for `LB-CORE` after closing at minimum:

```text
PRB-001
PRB-002
PRB-003
PRB-004
PRB-005
PRB-006
```

Potential conditions:

```text
bounded internal cohort
private workforce access only
explicit support window
Payment Escalation disabled unless PRB-ESC-001 closes
AI Assistant disabled
Priority candidate disabled
single-region risk explicitly accepted after recovery evidence
```

---

# Review triggers

Reopen this PRR when:

1. any blocker closes;
2. launch boundary changes;
3. public/mobile/partner ingress is proposed;
4. Payment Escalation is enabled;
5. Case Explanation Assistant is enabled or model/provider changes;
6. Priority candidate cutover is proposed;
7. security/data ownership changes;
8. SLO/RTO/RPO changes;
9. production support ownership changes;
10. a production incident reveals a missing readiness question;
11. a significant deployment/recovery mechanism changes.

---

# Final statement

```text
PRR-OO-001
Decision = NO-GO
Reason   = launch-critical evidence gaps remain open
```

> **La review non dice che il sistema è “quasi pronto”. Dice quali proprietà non siamo ancora autorizzati a chiamare production-ready.**
