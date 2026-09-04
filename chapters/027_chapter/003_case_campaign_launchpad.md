# 3. Caso 1 — Campaign Launchpad

Example Software Industries non produce un solo tipo di software.

Dentro **Marketing Technology**, ESI ha un problema molto diverso da Order Operations.

Il team Marketing lancia campagne frequenti e ha bisogno di landing page pubbliche coerenti con il brand.

Il processo corrente richiede troppo coordinamento manuale con Engineering anche per modifiche semplici.

Nasce quindi un nuovo prodotto fittizio:

> **Campaign Launchpad**

## Il problema

Marketing vuole poter:

1. scegliere un template approvato;
2. inserire contenuti e asset;
3. ottenere una preview;
4. richiedere/registrare approvazione;
5. pubblicare;
6. ritirare o ripristinare una versione precedente.

Il problema non è costruire un CMS general purpose.

Non è neppure costruire una nuova marketing platform enterprise.

L'outcome è più ristretto:

> **ridurre la dipendenza da Engineering per il publishing di campagne standard senza perdere controllo su brand, accesso, versione pubblicata e rollback.**

## Analisi funzionale minima

Attori:

```text
Marketing Author
Marketing Approver
Public Visitor
Platform / Security support
```

Journey principale:

```text
Author
→ create campaign from approved template
→ edit content
→ preview
→ submit for approval

Approver
→ approve/reject

Author
→ publish approved version

Public Visitor
→ read published landing page
```

Business rule essenziali:

```text
only approved templates can be used
only approved content version can be published
publish creates immutable publication version
rollback selects a previously approved publication
public visitor cannot access authoring surface
```

Out of scope iniziale:

```text
payments
customer account
personalized recommendation
CRM orchestration
complex workflow designer
arbitrary JavaScript supplied by authors
multi-brand rule engine
real-time collaboration
```

Questa lista vale quanto le feature.

Evita che un piccolo prodotto diventi accidentalmente una nuova piattaforma marketing.

## Quality floor

Il workload non ha la stessa criticità economica di Payments.

Ma ha comunque proprietà non negoziabili:

```text
unauthorized authoring = forbidden
unapproved content publication = forbidden
published version traceable
rollback available
public content separated from internal authoring
basic observability
reproducible deployment
```

Non imponiamo invece in partenza:

```text
active-active multi-region
microservices
Kubernetes
stream processing
complex event choreography
```

Non perché siano tecnologie sbagliate.

Perché non risolvono ancora un requisito.

## Il compromesso ESI

Marketing vuole autonomia.

Platform vuole evitare una nuova snowflake application difficile da operare.

Security vuole una separazione chiara fra authoring interno e content delivery pubblico.

Finance vuole che il costo operativo resti coerente con un prodotto piccolo.

Engineering vuole evitare che il One-Man Project diventi un CMS enterprise posseduto da una sola persona.

La decisione è quindi:

```text
small bounded product
+ managed platform
+ templates instead of arbitrary extension
+ explicit publishing state machine
+ public static delivery where possible
+ internal authenticated authoring
```

## Una possibile architettura appropriata

Per lo scenario ESI possiamo immaginare:

```text
Marketing Author / Approver
        ↓
Entra-authenticated authoring UI
        ↓
small serverless / managed API
        ↓
campaign metadata + approved content
        ↓
publish pipeline
        ↓
versioned public static artifacts
        ↓
Public Visitor
```

Il dettaglio tecnologico può essere realizzato in più modi.

Una soluzione Azure plausibile potrebbe usare **Azure Static Web Apps** per il web frontend/static delivery e API serverless/managed dove necessario.

Microsoft documenta Static Web Apps come servizio integrato con repository e pipeline, con hosting statico, integrazione GitHub/Azure DevOps, authentication/authorization e API serverless:

- https://learn.microsoft.com/en-us/azure/static-web-apps/overview

Questa documentazione dimostra capability del prodotto Azure.

Non dimostra che Campaign Launchpad debba necessariamente usarlo.

La decisione ESI resta:

```text
managed static/public delivery
before
custom application hosting platform
```

## Perché non copiamo Order Operations

Order Operations ha:

```text
PostgreSQL
outbox
Service Bus
private ingress
Payment domain boundary
recovery requirements
operational SLO
legacy coexistence
AI runtime
```

Campaign Launchpad non riceve automaticamente tutto questo patrimonio.

Il fatto che ESI abbia già Service Bus non significa che ogni prodotto debba pubblicare eventi.

Il fatto che Platform supporti App Service non significa che un sito prevalentemente statico debba avere un application runtime sempre attivo.

Il fatto che il libro abbia insegnato microservices non significa che dobbiamo usarli.

> **Riutilizzare una capacità enterprise è utile. Riutilizzare un'architettura enterprise senza riutilizzarne il problema è cargo cult.**

## One-Man Project fit

Campaign Launchpad è un candidato migliore del core Payments per un One-Man Project.

Perché?

```text
bounded domain
small team of stakeholders
clear workflow
managed services
no economic side effects
no 24/7 mission-critical promise initially
limited integrations
reversible deployment model
```

Ma la persona non lavora davvero da sola.

Dipende da:

```text
ESI identity
platform landing zone
security baseline
CI/CD
managed cloud services
brand/design system
Product/Marketing decisions
```

Questo è il punto del Capitolo 25:

> **il leverage individuale è spesso il risultato di leverage organizzativo già costruito.**

## Failure model

I failure mode più importanti non sono quelli di Order Operations.

Sono per esempio:

```text
wrong version published
unapproved version published
public site unavailable
asset broken
publish partially completed
authorization failure
bad content cannot be rolled back
```

Notare ciò che manca:

```text
partial payment transaction
message duplicate economic effect
regional settlement inconsistency
```

Il failure model segue il prodotto.

## Evidence prima del launch

Una readiness appropriata potrebbe richiedere:

```text
publishing state tests
unauthorized authoring negative test
preview/publish/rollback journey
real non-production deployment
public artifact smoke
basic alerting
owner/support route
```

Non serve dimostrare un disaster recovery da sistema bancario se il business non ha quella promessa.

Serve però dimostrare **le proprietà che abbiamo promesso davvero**.

## Il risultato

Campaign Launchpad mostra la prima grande lezione del capitolo:

> **La semplicità è una decisione architetturale quando è sostenuta da un perimetro funzionale e da un quality floor chiari.**

Un prodotto piccolo non deve essere costruito con meno disciplina.

Deve essere costruito con **meno complessità non necessaria**.