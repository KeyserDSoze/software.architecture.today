# Campaign Launchpad

> **Prodotto simulato/composito di Example Software Industries S.p.A. (ESI).**

Business unit:

```text
Marketing Technology
```

Campaign Launchpad è il secondo prodotto ESI reso persistente nel capstone, introdotto nel Capitolo 27 per mostrare un caso end-to-end piccolo e adatto a un **One-Man Project operating model**.

## Product goal

Ridurre la dipendenza da Engineering per la pubblicazione di landing page di campagne standard, mantenendo:

```text
approved templates
approval before publish
traceable publication version
rollback
internal authoring authorization
public read separation
```

## Non-goal iniziali

```text
CMS general purpose
customer account
payments
CRM personalization
arbitrary author JavaScript
plugin ecosystem
real-time collaboration
multi-brand rule engine
```

## Current architecture direction

```text
Entra-authenticated authoring
→ managed authoring/API boundary
→ campaign/version state
→ approval
→ publish pipeline
→ versioned public static artifact
→ public visitor
```

Technology direction:

```text
managed/static-first
before
custom always-on platform
```

Azure Static Web Apps è una possibile implementazione coerente per parte del workload, ma non è trattata come requisito di dominio.

## Current evidence state

```text
Problem / Outcome                 Codified
Functional scope                 Codified
Architecture direction           Designed
Production readiness boundary    Designed
Real implementation              Not started
Cloud deployment                 Not started
Runtime evidence                 Not started
```

Questo prodotto esiste per mostrare che un workload piccolo deve avere **disciplina proporzionata**, non una copia ridotta dell'architettura di Order Operations.

> **Semplice non significa improvvisato. Significa che la complessità presente ha un lavoro.**
