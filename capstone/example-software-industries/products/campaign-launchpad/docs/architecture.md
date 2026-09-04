# Campaign Launchpad — Architecture Direction

> **Scenario fittizio ESI.**

## Decision

Use a **managed/static-first** architecture for the initial Campaign Launchpad scope.

Core separation:

```text
internal authoring state
≠
public published artifact
```

## Intended shape

```text
Marketing Author / Approver
        ↓
ESI identity
        ↓
managed authoring UI + bounded API
        ↓
Campaign / DraftVersion / ApprovalDecision
        ↓
publish pipeline
        ↓
versioned public static artifact
        ↓
Public Visitor
```

## Why

The product currently needs:

```text
small operational surface
public read scale without complex application runtime
versioned publish/rollback
managed identity integration
bounded authoring workflow
```

It does not currently need:

```text
microservices
Kubernetes
message broker
stream platform
vector database
custom plugin runtime
multi-region active-active
```

## Technology fit note

Azure Static Web Apps is one possible implementation for static/full-stack web delivery and repository-integrated deployment:

- https://learn.microsoft.com/en-us/azure/static-web-apps/overview

This document does not make Static Web Apps a permanent architecture rule.

The rule to preserve is the property:

```text
managed/static-first public delivery
+ internal authoring authorization
+ immutable approved publication
+ rollback
```

## Security direction

```text
internal authoring authenticated
public read path has no authoring permission
no arbitrary author-provided executable code by default
publication state changes auditable
```

## Reliability direction

```text
published artifact should not require authoring API availability where implementation supports that separation
rollback/unpublish must be explicit
failed publish must not silently replace last known-good publication
```

## Cost direction

Prefer a managed/consumption-oriented footprint while traffic and workflow remain bounded.

Do not introduce permanent always-on platform complexity without a measured requirement.

## One-Man Project fit

Current operating hypothesis:

```text
one accountable lead
+ Marketing Product owner
+ secondary maintainer
+ ESI Platform/Security paved road
```

This is a hypothesis to validate if/when implementation begins.

## Review triggers

Reopen the architecture if the product adds:

```text
customer PII
real-time personalization
arbitrary extensions/scripts
regulated consent flows
complex CRM orchestration
contractual 24/7 availability
multiple independent owning teams
significant dynamic API traffic
```

> **The architecture is intentionally small because the current problem is intentionally bounded.**
