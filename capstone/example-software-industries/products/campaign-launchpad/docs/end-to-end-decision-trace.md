# Campaign Launchpad — End-to-End Decision Trace

> **Scenario fittizio ESI.** Vista sintetica introdotta nel Capitolo 27. Non sostituisce i documenti canonical del prodotto.

## Problem

Marketing dipende da Engineering per pubblicare landing page standard.

## Outcome

Marketing può creare, approvare, pubblicare e ritirare campagne standard attraverso un workflow governato.

## Functional scope

```text
template
draft
preview
approval
publication
rollback/unpublish
```

## Owners

```text
Marketing Technology
→ product/workflow

ESI Identity
→ workforce identity

Brand/Marketing
→ content/brand authority

Platform/Security
→ enterprise guardrails
```

## Quality floor

```text
approved publication only
internal authoring authorization
publication traceability
rollback
public/read separation
```

## Key trade-off

```text
custom flexibility
vs
small operational/security surface
```

## Architecture decision

```text
managed/static-first
+ bounded authoring API
+ versioned public publication artifact
```

## Rejected / deferred alternatives

```text
general-purpose CMS platform
microservices
Kubernetes
custom plugin runtime
real-time personalization
```

Rejected/deferred means `no current fit`, not `technology is bad`.

## Failure modes

```text
unapproved publication
wrong version publication
failed publish
public artifact unavailable
authorization failure
rollback failure
```

## Verification

```text
workflow tests
authorization negative tests
real non-production publish
public smoke
rollback exercise
```

## Production decision

```text
NOT READY
```

Reason:

```text
implementation/runtime evidence not yet available
```

## Open evidence

```text
real implementation
cloud deployment
identity behavior
publish/rollback runtime
alert ownership
support model
```

## Review triggers

```text
customer PII
personalization
custom script/plugin
regulatory consent
24/7 contractual availability
multiple owning teams
```

## Real-world evidence anchors

Azure Static Web Apps capability documentation:

- https://learn.microsoft.com/en-us/azure/static-web-apps/overview

Microsoft Well-Architected safe deployment/testing guidance:

- https://learn.microsoft.com/en-us/azure/well-architected/operational-excellence/principles
- https://learn.microsoft.com/en-us/azure/well-architected/operational-excellence/testing

These sources support technology/operational properties. They do not prove ESI's fictional product architecture.
