# Order Operations — Threat Model

> **Scenario fittizio ESI.** Threat model corrente dopo il Capitolo 13. Le minacce sono didattiche ma costruite sulle capability reali del capstone e confrontate con guidance Microsoft, NIST e OWASP.

## Scope

```text
ESI workforce
→ Order Operations ingress
→ App Service / WebJob
→ PostgreSQL
→ Key Vault
→ Service Bus Queue
→ Payments & Risk
→ deployment/control plane
```

## Business capabilities protette

- visualizzare OperationalCase autorizzati;
- investigare ordini problematici;
- creare Payment Escalation;
- pubblicare in modo affidabile Payment Escalation verso Payments & Risk;
- amministrare e distribuire il workload senza trasferire privilegi al runtime.

## Assets

| ID | Asset | Sensitivity / impact |
|---|---|---|
| A-01 | OperationalCase data | confidential |
| A-02 | Tenant isolation | critical integrity/confidentiality boundary |
| A-03 | Payment Escalation capability | high business impact |
| A-04 | Operator/Supervisor identity | high |
| A-05 | Runtime managed identity | high |
| A-06 | Deployment identity | critical control-plane capability |
| A-07 | External provider secrets | high |
| A-08 | Outbox / event contract | high integrity |
| A-09 | Audit trail | high integrity |
| A-10 | Infrastructure configuration | critical |

## Actors

### Legitimate

- Operations Operator;
- Operations Supervisor;
- Order Operations runtime;
- deployment automation;
- Platform Engineering;
- Security;
- Payments & Risk consumer.

### Adversarial / compromised

- anonymous attacker;
- compromised operator session;
- compromised developer workstation;
- compromised runtime identity;
- compromised CI/CD identity;
- malicious dependency/build step;
- compromised downstream/provider.

## Trust boundaries

### TB-01 — Workforce → application ingress

Identity and network boundary.

### TB-02 — Application ingress → application authorization

Authentication does not imply tenant/capability authorization.

### TB-03 — Runtime → PostgreSQL

Data and privilege boundary.

### TB-04 — Runtime → Key Vault

Secret boundary.

### TB-05 — Outbox publisher → Service Bus

Messaging identity and integrity boundary.

### TB-06 — Service Bus → Payments & Risk

Cross-domain ownership boundary.

### TB-07 — CI/CD → Azure control plane

Privileged deployment boundary.

### TB-08 — App Service → external egress

Data exfiltration / dependency boundary.

## Security assumptions

| ID | Assumption |
|---|---|
| AS-01 | ESI Entra tenant and workforce access platform are centrally governed. |
| AS-02 | Payments & Risk applies idempotency on `EscalationId`. |
| AS-03 | Platform Engineering owns landing-zone DNS/network foundations. |
| AS-04 | Production deployment identity can use federation/workload identity instead of long-lived static credentials. |
| AS-05 | Production private endpoints are reachable through the approved ESI access path. |

If an assumption changes, this threat model must be reviewed.

## Threat register

| ID | Scenario | STRIDE | Assets | Impact | Likelihood | Disposition | Main controls | Owner |
|---|---|---|---|---|---|---|---|---|
| T-01 | Stolen operator session calls Order Operations | Spoofing | A-01,A-03,A-04 | High | Plausible | Mitigate | Entra controls, private ingress, application authorization, audit, session policy | Security + workload |
| T-02 | Authenticated operator reads another tenant's case by changing `caseId` | Information Disclosure / Elevation | A-01,A-02 | Critical | Plausible | Mitigate | server-side tenant authorization, negative tests, audit | workload |
| T-03 | Unauthorized actor creates Payment Escalation | Elevation / Tampering | A-03,A-08 | High | Plausible | Mitigate | role/capability auth, case ownership validation, idempotency, audit | workload |
| T-04 | Runtime identity is compromised and used to modify infrastructure | Elevation | A-05,A-10 | Critical | Unlikely/Plausible | Avoid/Mitigate | runtime identity has no control-plane permission; separate deployment identity | workload + Platform |
| T-05 | Deployment identity is compromised | Elevation / Tampering | A-06,A-10 | Critical | Plausible | Mitigate | federation, scoped role, branch/environment protection, audit | Platform + workload |
| T-06 | Secret committed or emitted in logs | Information Disclosure | A-07 | High | Plausible | Mitigate | secret scanning, Key Vault, telemetry allowlist, rotation/revocation | workload |
| T-07 | PostgreSQL/Service Bus/Key Vault exposed publicly by misconfiguration | Information Disclosure / Elevation | A-01,A-03,A-07 | Critical | Plausible | Mitigate | private connectivity, IaC, policy, public access disabled in production | Platform + workload |
| T-08 | Malicious/tampered build reaches production | Tampering | A-06,A-10 | Critical | Plausible | Mitigate | protected pipeline, artifact provenance, scanning, deployment identity separation | workload + Platform |
| T-09 | Logs contain sensitive case/payment data | Information Disclosure | A-01,A-07,A-09 | High | Plausible | Mitigate | explicit telemetry schema, redaction, retention/access policy | workload |
| T-10 | Outbox publisher receives broker admin privilege and is abused | Elevation | A-05,A-08 | High | Plausible | Mitigate | send-only privilege, separate admin roles, RBAC review | workload + Platform |
| T-11 | Escalation endpoint is spammed, exhausting DB/queue/operations | Denial of Service | A-03,A-08 | High | Plausible | Mitigate | authentication, rate/abuse controls when measured, idempotency, backlog monitoring | workload |
| T-12 | Privileged administrator abuses standing access | Elevation / Repudiation | A-01,A-06,A-10 | Critical | Plausible | Mitigate | JIT/JEA direction, audit, role separation, break-glass procedure | Security + Platform |
| T-13 | User-controlled outbound destination enables SSRF/exfiltration | Information Disclosure | A-01,A-05 | High | Unlikely currently | Avoid | no arbitrary URL fetch capability; explicit egress inventory | workload |
| T-14 | Payment event is tampered/replayed causing duplicate business processing | Tampering / Repudiation | A-03,A-08 | High | Plausible | Mitigate | stable message id, downstream idempotency, audit/reconciliation | workload + Payments |

## Abuse cases

### AC-01 — Cross-tenant read

```text
Given operator O authorized for tenant A
When O requests caseId belonging to tenant B
Then the API denies the request
And does not disclose whether the case exists beyond the allowed policy
And emits an auditable authorization event
```

### AC-02 — Unauthorized Payment Escalation

```text
Given an authenticated identity without escalation capability
When it calls the Payment Escalation endpoint
Then no PaymentEscalation or OutboxMessage is committed
And the attempt is observable
```

### AC-03 — Compromised runtime identity

```text
Given the App Service runtime identity is compromised
Then it must not be able to assign RBAC, change network exposure or deploy code
And its Key Vault/Service Bus permissions remain limited to workload needs
```

### AC-04 — Duplicate event delivery

```text
Given the same EscalationId is delivered more than once
Then Payments & Risk must not execute the same business effect more than once
```

## Accepted / deferred risks

### R-01 — No WAF in current production design

Reason:

- ingress is internal/private;
- no Internet-facing consumer exists in current scope.

Trigger:

- public/partner/mobile ingress that changes attack surface.

### R-02 — API and WebJob currently share runtime privilege envelope

Reason:

- same App Service lifecycle;
- operational simplicity.

Residual risk:

- compromise of the web runtime can inherit messaging privileges needed by publisher.

Trigger:

- worker extraction, privilege divergence, increased messaging impact.

### R-03 — Quantitative rate limits not yet fixed

Reason:

- workload not yet measured.

Guardrail:

- idempotency, monitoring, authenticated internal ingress.

Trigger:

- executable load profile or abuse evidence.

## Detection requirements

Signals to preserve:

```text
failed authentication/authorization
cross-tenant denial attempts
Payment Escalation accepted/rejected
privileged role/RBAC changes
Key Vault access failures/anomalies
Service Bus send failures
DLQ growth
public network configuration drift
production deployment events
secret scan findings
```

## Response requirements

We must be able to:

- revoke an operator/session through identity controls;
- revoke workload/deployment identity access;
- rotate unavoidable secrets;
- disable or quarantine the write capability;
- stop the outbox publisher;
- restore a known-good deployment;
- reconcile outbox/payment escalation state after an incident.

## Review triggers

Review this threat model when:

- a public ingress is introduced;
- mobile/partner consumers appear;
- a new sensitive data class is stored;
- a new external provider is added;
- API/WebJob are separated;
- multi-region is introduced;
- deployment pipeline changes materially;
- new privileged role is introduced;
- an actual security incident occurs.

## References

- [Microsoft Learn — Threat Modeling Tool](https://learn.microsoft.com/azure/security/develop/threat-modeling-tool)
- [Microsoft Learn — Security design principles](https://learn.microsoft.com/azure/well-architected/security/principles)
- [Microsoft Learn — Design secure applications](https://learn.microsoft.com/azure/security/develop/secure-design)
- [NIST SP 800-218 — SSDF](https://csrc.nist.gov/pubs/sp/800/218/final)
- [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/)

The sources support the methodology and control properties. The ESI threat scenarios and risk ratings are simulated.