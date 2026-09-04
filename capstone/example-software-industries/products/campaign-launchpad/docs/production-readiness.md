# Campaign Launchpad — Production Readiness Direction

> **Scenario fittizio ESI.** Questo prodotto non è ancora implementato; il documento definisce il launch boundary e l'evidence attesa, non dichiara readiness.

## Proposed launch boundary

```text
approved Marketing cohort
approved template set
internal authenticated authoring
public read-only landing pages
no personalization
no customer account
no customer PII
no arbitrary scripts/plugins
```

## Current decision

```text
NOT READY — implementation and runtime evidence do not exist yet
```

## Required evidence before a bounded launch

### Functional

```text
draft → approval → publish journey
change-after-approval requires new approval
rollback to previously approved version
unapproved version cannot publish
```

### Security

```text
unauthenticated/unauthorized authoring denied
public visitor cannot mutate authoring state
no secret/private data embedded in public artifact
```

### Deployment

```text
real non-production deploy
public artifact smoke
failed publish behavior
rollback/unpublish exercise
```

### Operability

```text
publish failure visible
owner identified
support/escalation path documented
publication version traceable
```

## Candidate conditional launch

A future review may consider:

```text
CONDITIONAL GO
```

for the bounded launch only if the required evidence exists and future capabilities remain disabled.

Possible disabled capabilities:

```text
personalization
custom scripts/plugins
CRM dynamic data
customer account
multi-brand workflow
```

## Blocker philosophy

The product does not inherit Order Operations blockers that do not apply to its launch promise.

For example, Payment Escalation atomicity is irrelevant here.

Conversely, a green Order Operations test suite says nothing about Campaign Launchpad publication safety.

> **Readiness belongs to the promise being launched, not to the maturity reputation of the company that owns it.**
