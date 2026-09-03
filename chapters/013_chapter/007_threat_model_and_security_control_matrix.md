## Threat Model e Security Control Matrix

In questo libro useremo due artefatti distinti ma collegati:

```text
Threat Model
→ che cosa può andare storto e perché

Security Control Matrix
→ quale controllo riduce quale rischio e come lo verifichiamo
```

Il primo evita di progettare controlli senza minaccia.

Il secondo evita di elencare minacce senza responsabilità operativa.

## Threat Model — template operativo

```markdown
# Threat Model

## Scope

## Business capabilities

## Assets

## Actors

## Trust boundaries

## Data flows

## Threats

| ID | Scenario | STRIDE | Asset | Impact | Likelihood | Mitigation | Residual risk | Owner |
|---|---|---|---|---|---|---|---|---|

## Abuse cases

## Security assumptions

## Accepted risks

## Open questions

## Review triggers
```

Non serve che ogni threat model usi STRIDE.

Nel libro lo usiamo perché offre un vocabolario pratico e Microsoft lo integra nel proprio Threat Modeling Tool.

Fonte:

- [Microsoft Learn — Threat Modeling Tool](https://learn.microsoft.com/azure/security/develop/threat-modeling-tool)

## Scope

Lo scope deve dire che cosa stiamo proteggendo.

Per Order Operations non modelliamo “Azure”.

Modelliamo:

```text
workforce access
→ Order Operations
→ operational PostgreSQL
→ Payment Escalation outbox
→ Service Bus
→ Payments & Risk
→ Key Vault / identity / deployment path
```

Uno scope enorme produce minacce vaghe.

Uno scope troppo piccolo nasconde boundary importanti.

## Asset

Esempio:

```text
A-01 OperationalCase data
A-02 PaymentEscalation capability
A-03 Tenant isolation
A-04 Operator identity
A-05 Runtime identity
A-06 Deployment capability
A-07 External provider secret
A-08 Audit trail
```

Assegnare ID agli asset aiuta la traceability.

## Threat

Esempio:

```text
T-04
Scenario:
Authenticated operator reads a case belonging to another tenant by changing caseId.

STRIDE:
Information Disclosure / Elevation of Privilege

Asset:
A-01, A-03

Impact:
Critical

Mitigation:
server-side tenant authorization + negative tests + audit
```

Notiamo che la mitigazione contiene più layer.

## Residual risk

Dopo la mitigazione resta sempre un rischio.

Esempio:

```text
application authorization bug remains possible
```

Quindi aggiungiamo:

```text
unit/integration negative tests
+ centralized access telemetry
+ periodic review
```

La security non diventa binaria solo perché abbiamo aggiunto un controllo.

## Security Control Matrix

Template:

```markdown
# Security Control Matrix

| Control | Threats | Layer | Implementation | Verification | Owner | Status |
|---|---|---|---|---|---|---|
| SC-01 Entra authentication | T-01 | identity | App Service auth | unauthorized request test | workload team | planned |
| SC-02 Tenant authorization | T-04 | application | server-side policy | cross-tenant negative tests | workload team | implemented |
| SC-03 Managed identity | T-07 | identity | system-assigned MI | RBAC inspection | platform/workload | planned |
```

## Perché una matrix

Senza matrix possiamo avere:

```text
Threat Model:
"runtime credential theft"

Architecture diagram:
"Key Vault"
```

ma nessun collegamento esplicito.

La matrix ci costringe a dire:

- quale threat affronta Key Vault;
- quale threat non affronta;
- chi lo configura;
- come sappiamo che funziona.

## Prevent, detect, respond, recover

I controlli non sono tutti preventivi.

Possiamo classificare:

### Prevent

- authorization;
- private network;
- least privilege;
- input validation.

### Detect

- audit;
- anomaly detection;
- failed authorization metrics;
- secret scanning.

### Respond

- revoke identity;
- disable endpoint;
- quarantine deployment;
- rotate secret.

### Recover

- restore known-good deployment;
- reconstruct audit;
- reconcile outbox;
- re-establish identity.

Un threat model che contiene soltanto prevenzione assume implicitamente che la prevenzione non fallisca mai.

Questo è contrario al principio `assume breach`.

## Security assumptions

Le assunzioni sono pericolose quando restano invisibili.

Esempio:

```text
ASSUMPTION-01
ESI workforce devices are enrolled in the enterprise access platform.
```

Se questa assunzione è falsa, cambia il threat model.

Altri esempi:

```text
Payments & Risk validates EscalationId idempotently.
Platform private DNS is available.
Entra tenant is centrally governed.
Production deployment uses federated identity.
```

## Accepted risk

A volte decidiamo di non mitigare subito.

Deve essere scritto.

Esempio:

```text
Risk:
No dedicated WAF on private internal ingress.

Reason:
No Internet-facing path in current scope.

Trigger:
public/partner access introduced.
```

Questa è risk acceptance.

Non dimenticanza.

## Evidence

La Security Control Matrix deve puntare a evidence verificabili:

```text
Bicep policy
RBAC assignment
integration test
SAST result
secret scan
configuration query
audit sample
penetration test
runbook exercise
```

“È configurato” è una claim.

L'evidence è ciò che la rende verificabile.

## OWASP ASVS come fonte di verification requirement

ASVS può aiutare a trasformare categorie di sicurezza in verifiche concrete per autenticazione, access control, validation, cryptography e altre aree applicative.

Fonte:

- [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/)

Non useremo ogni requirement ASVS nel capstone.

Selezioneremo quelli pertinenti allo scope e li collegheremo ai controlli.

## Control ownership

Ogni controllo deve avere un owner.

Esempio:

```text
Entra tenant policy
→ Security / Platform

App authorization
→ Order Operations

Service Bus RBAC
→ workload + Platform baseline

Payment consumer idempotency
→ Payments & Risk
```

Il rischio attraversa team diversi.

La responsabilità deve restare leggibile.

## Drift

Un controllo valido oggi può sparire domani per drift.

Per questo preferiamo:

```text
control described
→ control codified
→ control tested
→ control monitored
```

quando è economicamente sensato.

Questa è una delle ragioni per cui il Capitolo 13 farà finalmente entrare una baseline Bicep reale.

## AI-assisted control review

Un agente può confrontare:

```text
Threat Model
vs
Security Control Matrix
vs
Bicep
vs
application code
```

cercando:

- threat senza controllo;
- controllo senza threat;
- privilege mismatch;
- public exposure inattesa;
- missing test;
- documentation drift.

Questo è un uso dell'AI molto più utile che chiedere:

> “Rendi sicura questa architettura.”

## La frase da ricordare

> **Una minaccia senza owner è una preoccupazione. Un controllo senza verifica è una speranza.**