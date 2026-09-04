# 4. Campaign Launchpad — dal perimetro al launch

Un caso end-to-end deve arrivare fino alla decisione operativa.

Quindi immaginiamo di portare Campaign Launchpad attraverso lo stesso metodo usato per Order Operations, ma senza trascinarci dietro la stessa architettura.

## Problem & Outcome Brief

```text
Problem
Marketing dipende da Engineering anche per campaign landing page standard.

Outcome
Un operatore Marketing autorizzato può creare, far approvare, pubblicare e ritirare una landing page basata su template approvati.

Non-goal
Costruire un CMS general purpose.
```

La presenza del non-goal è architettura.

Se il prodotto dovesse supportare arbitrary extension, plugin, custom scripting, real-time personalization e workflow configurabili, cambierebbero threat model, testability, runtime e ownership.

## Functional Scope Map

Capability:

```text
Template Catalog
Campaign Draft
Preview
Approval
Publication
Rollback
```

Boundary esterni:

```text
ESI Identity
Brand Design System
Public Web
```

Dati posseduti:

```text
Campaign
DraftVersion
ApprovalDecision
PublicationVersion
```

Dati non posseduti:

```text
employee identity
enterprise brand source assets
CRM customer profile
analytics warehouse truth
```

## NFR Card

Una prima card potrebbe essere:

```text
Security
internal authoring authenticated
public read surface separated
no arbitrary author script execution

Reliability
published page should remain readable during authoring API issues where platform allows
rollback to previous approved version

Performance
public static content should be cache-friendly

Operability
publish outcome traceable
failed deployment observable

Cost
prefer managed/consumption-oriented components while traffic/workflow remains small
```

Non assegniamo numeri inventati dove il business non li ha ancora definiti.

Il metodo non richiede di fabbricare precisione.

## Architecture Decision

Decisione:

> **separare authoring state e public publication artifact.**

Questo ci dà una proprietà utile:

```text
authoring unavailable
≠
public campaign necessarily unavailable
```

La pubblicazione può produrre un artefatto versionato e immutabile per il public path.

Il dettaglio tecnologico resta sostituibile.

Su Azure, Static Web Apps è una possibile implementazione coerente per una parte del problema; Microsoft documenta hosting statico, workflow integrato con repository e API serverless/managed:

- https://learn.microsoft.com/en-us/azure/static-web-apps/overview

## Security Decision

L'errore più facile sarebbe dire:

> È soltanto Marketing.

Ma public publishing può comunque creare:

```text
brand damage
malicious content
credential abuse
content injection
supply-chain compromise
```

Quindi il quality floor richiede:

```text
internal authenticated authoring
approval before publish
no raw secret in content
no arbitrary executable content by default
immutable publication history
```

Non richiede necessariamente lo stesso private network topology di Order Operations.

Questa è **proportional security**, non weaker security.

## Testing Strategy

Fast layer:

```text
state transition tests
approval rule tests
template validation
publication version tests
```

Higher fidelity:

```text
identity/auth test
non-production publish
public smoke
rollback exercise
```

L'E2E più importante non è:

```text
browser opens homepage
```

ma:

```text
Draft
→ Approval
→ Publish
→ Public version visible
→ Rollback
→ Previous approved version restored
```

## Production Readiness

Un launch boundary iniziale potrebbe essere:

```text
approved Marketing cohort
approved template set
public read-only landing pages
no personalization
no customer account
no dynamic CRM data
```

Readiness evidence:

```text
functional workflow verified
unauthorized author negative test
publish/rollback tested
real deploy smoke
basic alert ownership
content owner identified
```

Il prodotto potrebbe ricevere un `CONDITIONAL GO` anche senza alcune capability future.

Per esempio:

```text
personalization = disabled
custom scripts = not supported
multi-brand workflow = deferred
```

Disabilitare una capability non necessaria può essere una mitigation migliore che costruirne frettolosamente la governance.

## Il costo del One-Man Project

Un solo accountable lead riduce coordination overhead.

Ma ESI accetta anche un costo:

```text
secondary maintainer
repository context
standard platform
small WIP
specialist gate for security/public surface
```

Il lead non diventa owner del Brand, dell'Identity Platform o della security policy.

Questo mantiene il modello agile senza creare una piccola monarchia tecnica.

## Trigger che invalidano l'architettura

Il design va riaperto se Campaign Launchpad evolve verso:

```text
customer PII
personalized content
regulated campaign consent
real-time CRM integration
high-volume dynamic API
arbitrary extension/plugin
multiple independent product teams
24/7 contractual availability
```

Notare il pattern.

Non diciamo:

> Static Web Apps non scala.

Diciamo:

> **Se cambia il problema, rivalutiamo il fit.**

## La lezione del primo caso

Campaign Launchpad non è interessante perché usa poca tecnologia.

È interessante perché sappiamo spiegare **perché quella poca tecnologia è sufficiente oggi**.

> **La migliore dimostrazione di maturità architetturale può essere la tecnologia che abbiamo saputo non aggiungere.**