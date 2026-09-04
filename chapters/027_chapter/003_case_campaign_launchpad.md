# Caso 1 — Campaign Launchpad

Dentro Marketing Technology, ESI incontra un problema molto diverso da Order Operations. Marketing lancia campagne frequenti e ha bisogno di landing page pubbliche coerenti con il brand, ma anche variazioni standard richiedono troppo spesso l’intervento di Engineering.

Nasce così **Campaign Launchpad**.

Il rischio iniziale non è costruire troppo poco. È trasformare una esigenza circoscritta in un CMS general purpose o in una nuova marketing platform prima che il problema lo richieda.

## Il problema definisce anche ciò che non dobbiamo costruire

L’outcome è semplice: un Marketing Author autorizzato deve poter partire da un template approvato, preparare contenuto, ottenere preview, passare da approval e pubblicare una versione tracciabile che possa essere ritirata o sostituita da una versione precedente.

Non stiamo progettando payments, customer account, recommendation, CRM orchestration, arbitrary JavaScript, plugin runtime o real-time collaboration.

Questo non-scope è architettura tanto quanto il workflow principale. Se entrassero personalization, customer PII, scripting arbitrario o workflow configurabili, cambierebbero threat model, data ownership, runtime e support model.

La semplicità del design è quindi sostenuta da una decisione funzionale precisa, non da mancanza di ambizione.

## Il quality floor resta concreto

Campaign Launchpad non muove denaro e non eredita automaticamente il failure cost di Order Operations. Ma ha comunque property che non possono diventare opzionali: authoring non autorizzato deve essere impedito, soltanto una versione approvata può diventare pubblica, la publication deve essere tracciabile e il rollback deve essere praticabile.

Il public visitor non deve attraversare la stessa superficie interna dell’authoring.

Queste property definiscono il quality floor. Active-active multi-region, Kubernetes, event choreography o una topology microservice non ne fanno parte oggi perché non comprano ancora un requisito necessario.

> **Un prodotto piccolo non richiede meno disciplina. Richiede meno complessità che non ha un lavoro da fare.**

## La decisione architetturale nasce dal failure model

Il failure che ci interessa è molto concreto: una versione non approvata viene pubblicata, la publication rimane parziale, il public artifact è rotto oppure non riusciamo a tornare a una versione precedente.

Questo suggerisce una decisione importante: separare l’**authoring state** dall’**artifact pubblico versionato**.

```text
internal authenticated authoring
→ approval
→ publication pipeline
→ immutable/versioned public artifact
→ public visitor
```

La separazione compra una property utile:

```text
authoring/control plane degraded
≠
existing public campaign necessarily unavailable
```

Una soluzione Azure managed/static-first può avere fit. Azure Static Web Apps, per esempio, documenta hosting statico, integrazione repository, authentication/authorization e API serverless/managed.

Fonte:

- [Microsoft Learn — Azure Static Web Apps overview](https://learn.microsoft.com/en-us/azure/static-web-apps/overview)

Questa fonte dimostra capability del servizio, non l’appropriatezza automatica per ESI. La decisione resta a un livello più stabile: **managed/static public delivery prima di un custom runtime platform**, finché il workload rimane quello descritto.

## Perché non copiamo Order Operations

ESI possiede già App Service, Service Bus, PostgreSQL, private-network pattern e observability capability. Riutilizzare guardrail e platform service comuni è utile. Copiare la topology di Order Operations no.

Campaign Launchpad non ha Payment domain boundary, outbox, legacy coexistence o lo stesso recovery target. Aggiungere quei componenti soltanto perché esistono già nell’azienda trasformerebbe il riuso in cargo cult.

> **Riutilizza le capability enterprise. Non riutilizzare un’architettura se non riutilizzi anche il problema che l’ha resa necessaria.**

## Perché il One-Man Project può avere fit

Il prodotto ha bounded domain, pochi stakeholder, workflow chiaro, managed services, deployment reversibile e nessun economic side effect nel primo scope.

Questo rende plausibile un accountable lead singolo con forte platform leverage.

Ma il lead non è davvero solo. Dipende da ESI Identity, CI/CD, security baseline, landing zone, brand/design system e Marketing authority. Il leverage individuale esiste perché l’organizzazione ha già reso molte capability riusabili.

## Evidence e stato reale

Prima di un launch servirebbero almeno workflow/state test, authorization negative test, real non-production publish, public smoke, rollback exercise e ownership/alert route.

Il capstone Campaign Launchpad possiede già Problem, Functional Scope, Architecture Direction e un End-to-End Decision Trace persistente. Non possiede ancora implementation/runtime evidence.

Per questo il suo stato reale resta:

```text
Production decision
NOT READY

Reason
implementation/runtime evidence not yet available
```

La semplicità architetturale non viene premiata con un `GO` automatico. Deve comunque essere verificata nel boundary che promette di sostenere.

> **La maturità del primo caso sta in due decisioni insieme: sapere quale tecnologia non aggiungere e sapere che questo, da solo, non costituisce production evidence.**
