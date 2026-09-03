# ADR 0003 — Private ingress and identity-first security

- **Status:** Accepted
- **Decision date:** 2026-09-03
- **Context:** Capitolo 13 — Security by Design

## Context

Order Operations is an internal ESI workload deployed on Azure.

The current cloud topology includes:

- Azure App Service;
- continuous WebJob;
- Azure Database for PostgreSQL Flexible Server;
- Azure Service Bus Queue;
- Azure Key Vault;
- managed identity direction;
- Azure Monitor/Application Insights;
- single-region deployment.

The Chapter 13 threat model identifies material risks around:

- stolen operator sessions;
- cross-tenant access;
- unauthorized Payment Escalations;
- runtime/deployment identity compromise;
- public exposure of data-plane services;
- secret leakage;
- privileged administrator access;
- malicious/tampered deployments.

Order Operations currently has no Internet-facing customer or partner journey.

## Decision

For production:

1. **App Service ingress is private** and public network access is disabled once the approved ESI private access path is in place.
2. **Microsoft Entra authentication remains mandatory.** Network location is not treated as authentication.
3. **Application authorization remains server-side** and must validate tenant/resource/capability relationships.
4. **Runtime workload identity uses managed identity** for Azure service access where supported.
5. **Runtime identity and deployment identity are separate.** Runtime gets no control-plane administration permission.
6. **PostgreSQL, Service Bus and Key Vault follow private data-plane connectivity** in production where supported by the selected service tier and ESI landing-zone capability.
7. **Unavoidable secrets live in Key Vault** and are scoped to the workload identity; production secrets are never committed to the repository.
8. **No dedicated WAF is introduced yet** because there is no public/Internet-facing ingress in the current scope.
9. **Egress is explicit**: the application may communicate only with known business/platform dependencies; arbitrary user-controlled outbound targets are not a product capability.
10. Security-sensitive configuration is progressively codified in Bicep and governed by platform policy.

## Why this decision

The selected topology reduces public reachability and limits privilege while preserving a managed PaaS operating model.

The main principle is:

> private networking reduces reachability; identity and authorization still determine trust.

## Alternatives considered

### Public App Service + Entra authentication only

**Advantages**

- simpler networking and developer access;
- fewer private DNS/subnet dependencies;
- lower operational complexity.

**Why not selected now**

The workload is internal and handles operational/payment-adjacent capabilities. ESI accepts additional networking complexity to reduce the reachable attack surface in production.

This alternative remains valid if platform/network constraints materially change.

### Public ingress behind WAF/Application Gateway

**Advantages**

- application-layer protection at an Internet-facing boundary;
- appropriate for public/partner traffic in many architectures.

**Why not selected now**

There is currently no public journey. Adding a WAF would introduce cost and operational surface without a threat path that requires it.

### AKS with network policies/service mesh

Rejected for the same reason as Chapter 12: it buys orchestration/control that the workload does not currently need and does not inherently solve application authorization or identity risk.

## Consequences

### Positive

- smaller public attack surface;
- clearer workforce/application trust boundary;
- lower blast radius for runtime identity compromise;
- separation between control-plane deployment privileges and runtime privileges;
- fewer long-lived application credentials;
- network topology becomes reviewable and codifiable.

### Negative / accepted cost

- private DNS and network troubleshooting are more complex;
- local development cannot perfectly mirror production networking;
- workload depends more strongly on Platform landing-zone capabilities;
- private endpoint/service tier costs may increase;
- incident response must include private connectivity troubleshooting.

## Quality floor

The decision may not be relaxed below:

- authenticated production access;
- server-side authorization;
- tenant isolation;
- runtime identity without broad control-plane privilege;
- no static production secret in source control;
- auditable sensitive operations;
- revocation path;
- security configuration reviewable as code/policy where practical.

## Guardrails

- `docs/threat-model.md`;
- `docs/security-control-matrix.md`;
- Bicep baseline;
- platform policy;
- secret scanning;
- negative authorization tests;
- RBAC review;
- logging/redaction policy.

## Revisit triggers

Revisit when:

- public/mobile/partner access is introduced;
- a WAF or edge layer becomes justified;
- API and WebJob split into separate runtimes;
- new data classification/compliance constraints appear;
- multi-region is introduced;
- Service Bus/PostgreSQL tier changes alter private networking capability;
- a security incident shows the current boundary is insufficient;
- Platform landing-zone architecture changes materially.

## Evidence / references

- [Microsoft Learn — Security design principles](https://learn.microsoft.com/azure/well-architected/security/principles)
- [Microsoft Learn — Design secure applications](https://learn.microsoft.com/azure/security/develop/secure-design)
- [Microsoft Learn — App Service architecture best practices](https://learn.microsoft.com/azure/well-architected/service-guides/app-service-web-apps)
- [Microsoft Learn — App Service security](https://learn.microsoft.com/azure/app-service/overview-security)

This ADR records a simulated ESI decision. The service/security properties are grounded in official guidance.