# Campaign Launchpad — Problem & Outcome

> **Scenario fittizio ESI.**

## Problem

Marketing Technology deve pubblicare landing page di campagne standard ma dipende troppo spesso da Engineering anche per variazioni che non richiedono nuova logica applicativa.

Questo crea:

```text
coordination delay
engineering queue
manual publishing variance
unclear rollback ownership
```

## Outcome

Un operatore Marketing autorizzato può:

1. creare una campagna da un template approvato;
2. modificare contenuti consentiti;
3. visualizzare una preview;
4. ottenere approvazione;
5. pubblicare la versione approvata;
6. ritirare o ripristinare una versione precedentemente approvata.

## Actors

```text
Marketing Author
Marketing Approver
Public Visitor
Marketing Technology owner
Platform / Security support
```

## In scope

```text
approved template catalog
campaign draft
preview
approval
publication version
rollback / unpublish
public static delivery
basic operational audit
```

## Out of scope

```text
payments
customer account
CRM personalization
customer PII
arbitrary executable code supplied by authors
plugin framework
real-time collaborative editing
```

## Quality floor

```text
unauthorized authoring forbidden
unapproved publication forbidden
publication version traceable
rollback path available
public read path separated from internal authoring
reproducible deploy/publish mechanism
```

## Key compromise

```text
Need
Marketing autonomy and delivery speed

Tension
custom flexibility
vs
small operational/security surface

Decision
bounded templates + managed/static-first architecture

Accepted cost
less extension freedom

Quality floor
approval, authorization, traceability and rollback cannot be weakened

Trigger
personalization, sensitive data, plugin/custom script, contractual availability or wider team topology changes
```
