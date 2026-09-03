# Order Operations — Security Control Matrix

> **Scenario fittizio ESI.** Matrice corrente dopo il Capitolo 13. Collega threat, controllo, implementazione, verifica e ownership.

## Regola

> **Una minaccia senza owner è una preoccupazione. Un controllo senza verifica è una speranza.**

## Control matrix

| ID | Control | Threats | Layer | Implementation direction | Verification / evidence | Owner | Status |
|---|---|---|---|---|---|---|---|
| SC-01 | Entra workforce authentication | T-01,T-03 | Identity | App Service `authsettingsV2` + Entra application registration | unauthenticated request denied; token validation config review | Security + workload | **Codified — verification pending** |
| SC-02 | Server-side tenant authorization | T-02,T-03 | Application | resolve case/tenant from authoritative context, not client trust | cross-tenant negative integration tests | workload | Designed / test pending |
| SC-03 | Explicit escalation capability | T-03 | Application | role/capability policy for Payment Escalation | wrong-role negative test | workload | Designed / test pending |
| SC-04 | Private App Service ingress in production | T-01,T-07 | Network | private endpoint + public network disabled | Bicep build/deploy + public connectivity denial test | Platform + workload | **Codified — verification pending** |
| SC-05 | Private data-plane direction | T-07 | Network | private connectivity for PostgreSQL, Service Bus, Key Vault | IaC/policy + public-access denial tests | Platform + workload | **Partially codified** — Key Vault/Service Bus yes; PostgreSQL pending |
| SC-06 | Runtime managed identity | T-04,T-06,T-10 | Identity | system-assigned App Service managed identity | identity/RBAC inspection | workload + Platform | **Codified — verification pending** |
| SC-07 | Runtime/control-plane separation | T-04 | Identity | workload IaC grants data-plane roles only; broad control-plane privilege prohibited | effective Azure RBAC inspection / negative permission check | Platform | Codified intent — effective RBAC verification pending |
| SC-08 | Separate deployment identity | T-05,T-08 | Supply chain | federated/scoped CI identity | pipeline identity review + deployment audit | Platform + workload | Planned |
| SC-09 | Key Vault for unavoidable secrets | T-06 | Secrets | RBAC Key Vault + managed identity + private endpoint | no secret in repo; RBAC/private-access evidence | workload + Platform | **Codified baseline — verification pending** |
| SC-10 | Secret scanning | T-06,T-08 | SDLC | repository/CI scan | CI evidence; seeded test secret pattern | workload | Planned |
| SC-11 | Telemetry allowlist/redaction | T-06,T-09 | Application/Observability | explicit structured logging fields | log sample review + automated tests where possible | workload | Designed |
| SC-12 | Audit for sensitive operations | T-03,T-12,T-14 | Application/Observability | Payment Escalation actor/case/escalation/outcome evidence | audit event integration test | workload | Designed |
| SC-13 | Service Bus send-only runtime privilege | T-10 | Messaging/Identity | Azure Service Bus Data Sender scoped to Payment Escalation queue | effective RBAC inspection + denied admin action | Platform + workload | **Codified — verification pending** |
| SC-14 | Downstream idempotency by EscalationId | T-14 | Business integration | Payments & Risk deduplicates same business request | duplicate-delivery contract test | Payments & Risk | External dependency |
| SC-15 | Protected production deployment | T-05,T-08 | Supply chain | protected environment/branch, scoped pipeline | deployment provenance/audit | workload + Platform | Planned |
| SC-16 | Dependency/security scanning | T-08 | SDLC | SCA/SAST baseline appropriate to repo | CI report; accepted-risk record | workload | Planned |
| SC-17 | HTTPS only / modern TLS baseline | network threats | Transport | App Service `httpsOnly`, minimum TLS, FTPS disabled | Bicep build/deploy + endpoint/config test | Platform + workload | **Codified — verification pending** |
| SC-18 | Public access drift detection | T-07 | Governance | Azure Policy / config query | policy compliance evidence | Platform | Platform responsibility / pending evidence |
| SC-19 | Known egress inventory | T-13 | Architecture | explicit downstream list; no arbitrary URL fetch | architecture/code review | workload | Designed |
| SC-20 | Privileged access monitoring | T-05,T-12 | Identity/Operations | audit RBAC, Key Vault, deployment changes | central audit query/runbook | Security + Platform | Required / not yet verified |
| SC-21 | Break-glass controlled path | T-12 | Operations | rare protected emergency identity/procedure | periodic review/exercise | Security + Platform | Platform responsibility |
| SC-22 | Idempotent escalation API | T-03,T-11,T-14 | Application | stable `Idempotency-Key` / `EscalationId` | duplicate request test | workload | Designed; application use case exists, HTTP verification pending |
| SC-23 | Outbox durability/reconciliation | T-14 | Data/Integration | local transaction + outbox + reconciliation | failure injection / reconciliation evidence | workload | Codified in schema/use-case design; runtime verification pending |
| SC-24 | Abuse/capacity monitoring | T-11 | Operations | request rate, queue lag, DB pressure, escalation counts | dashboard/alert evidence | workload | To quantify |

## Stato dei controlli

Usiamo intenzionalmente quattro livelli distinti:

```text
Designed
→ documented architecture intent

Codified
→ IaC/code/policy exists

Verified
→ test/query/deployment evidence demonstrates behavior

Monitored
→ drift/failure can be observed continuously or operationally
```

Il Capitolo 13 ha fatto avanzare diversi controlli da **Designed** a **Codified**.

Non li promuove automaticamente a **Verified**.

In particolare `infra/main.bicep` deve ancora superare:

- Bicep build/lint;
- policy validation;
- deployment non-production;
- private connectivity test;
- Entra authentication test;
- effective RBAC/negative privilege tests.

## Prevent / detect / respond / recover

### Prevent

- SC-01, SC-02, SC-03;
- SC-04, SC-05;
- SC-06, SC-07, SC-08;
- SC-09, SC-13;
- SC-15, SC-17, SC-19, SC-22.

### Detect

- SC-10, SC-11, SC-12;
- SC-16, SC-18, SC-20, SC-24.

### Respond

Operational procedures must support:

- identity revocation;
- secret rotation;
- endpoint restriction;
- pipeline suspension;
- publisher stop/quarantine;
- RBAC rollback.

### Recover

- known-good deployment;
- outbox reconciliation;
- database restore;
- audit reconstruction;
- permission re-establishment.

## Security baseline vs workload-specific controls

### Platform baseline

Candidate controls owned mostly by Platform/Security:

- landing zone;
- private DNS/network capability;
- policy;
- privileged identity governance;
- central audit/logging;
- federated deployment identity pattern.

### Workload controls

Owned by Order Operations:

- tenant authorization;
- Payment Escalation permission;
- data minimization;
- telemetry schema;
- idempotency;
- event contract;
- threat model updates;
- application tests.

## Compromesso Security ↔ FinOps

SC-05 richiede private data-plane connectivity per Service Bus nella produzione corrente.

Azure Service Bus Private Link richiede il tier Premium.

Quindi il controllo ha un costo economico esplicito.

Questo non modifica lo stato di verifica del controllo, ma modifica il costo che ESI deve accettare e monitorare.

Trigger di revisione:

- costo Premium sproporzionato;
- threat model differente;
- nuova platform capability;
- messaging topology diversa.

Fonte:

- [Microsoft Learn — Service Bus Private Link](https://learn.microsoft.com/azure/service-bus-messaging/private-link-service)

## Accepted control gaps

### No WAF in current internal/private ingress scope

This is not a missing checkbox.

Reason:

- no Internet-facing ingress in current architecture.

Trigger:

- public/partner/mobile entry point.

### PostgreSQL private connectivity not yet codified

The architecture requires it, but the current Bicep baseline does not yet create PostgreSQL/private endpoint/auth configuration.

Status:

- Designed;
- implementation pending;
- must not be described as verified.

### Quantitative abuse limits not yet fixed

Reason:

- no measured workload yet.

Existing guardrails:

- private authenticated ingress;
- idempotency;
- queue/backlog monitoring direction.

Trigger:

- load testing / production-like measurements.

## Reference sources

- [Microsoft Learn — Security design principles](https://learn.microsoft.com/azure/well-architected/security/principles)
- [Microsoft Learn — App Service architecture best practices](https://learn.microsoft.com/azure/well-architected/service-guides/app-service-web-apps)
- [Microsoft Learn — Establish a security baseline](https://learn.microsoft.com/azure/well-architected/security/establish-baseline)
- [Microsoft Learn — Service Bus Private Link](https://learn.microsoft.com/azure/service-bus-messaging/private-link-service)
- [NIST SP 800-218 — SSDF](https://csrc.nist.gov/pubs/sp/800/218/final)
- [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/)

The matrix is a living artifact and must be updated when threat, topology, identity, evidence or business capability changes.