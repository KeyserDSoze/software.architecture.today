# ESI — Rendere Order Operations AI-ready

Order Operations è un buon candidato per questo capitolo proprio perché non nasce come repository vuoto.

Ha già accumulato molte decisioni.

Il problema non è aggiungere conoscenza.

È renderla navigabile.

## Il task ESI

Platform propone una standardizzazione:

> ogni repository che usa coding agent deve avere un entry point operativo comune.

Commerce & Operations è d'accordo con il principio, ma non vuole duplicare tutti i documenti del prodotto dentro un file vendor-specific.

Security aggiunge:

- nessun secret nelle instruction;
- nessuna authorization implicita a deployment production;
- stop condition per boundary sensibili.

Finance aggiunge un'osservazione dal Capitolo 20:

> rediscovery ripetitiva del repository consuma tempo umano, agent execution e token senza produrre valore di prodotto.

Il compromesso è quindi:

```text
persistent context sufficiente
+
low duplication
+
clear verification
+
strict stop conditions
```

## Decisione

ESI introduce nella root del prodotto:

```text
AGENTS.md
```

come **entry point tool-neutral**.

Non sarà una enciclopedia.

Contiene:

- purpose del prodotto;
- repository map sintetica;
- link ai documenti canonical;
- golden verification commands;
- architecture constraints;
- change synchronization rules;
- stop conditions;
- definition of done.

Aggiungiamo inoltre:

```text
docs/repository-map.md
```

per descrivere responsabilità, documenti e verification surface senza sovraccaricare `AGENTS.md`.

## Perché non `.github/copilot-instructions.md` come source of truth

GitHub supporta repository instructions e `AGENTS.md` in diverse superfici Copilot.

ESI potrebbe usare entrambe.

Ma il problema corrente non richiede due copie.

Quindi:

```text
canonical agent entry point
= AGENTS.md
```

Se in futuro una superficie GitHub richiederà comportamento aggiuntivo specifico, potremo introdurre un file tool-specific che **referenzia** il contesto canonical invece di duplicarlo.

Questa è un'applicazione diretta di fit before fashion.

## Repository map corrente

La nuova map descrive:

```text
src/application/
  application use cases

src/contracts/
  integration contract types

src/integration/
  infrastructure-facing mechanisms

src/observability/
  application telemetry boundary

src/priority/
  target priority semantics + legacy compatibility seam

database/
  Order Operations-owned persistence

infra/
  Azure workload infrastructure

tests/
  local behavior + architecture + cost/context fitness

docs/
  canonical product/architecture evidence
```

La mappa indica anche quali documenti leggere per classi di change.

## Canonical decision routing

Per esempio:

```text
Business behavior
→ functional-analysis.md
→ requirements.md

Priority
→ priority-functional-analysis.md
→ legacy-understanding-map.md
→ refactoring-safety-plan.md

Payment Escalation
→ api-contract.md
→ events/*
→ data-ownership.md
→ failure-mode-map.md

Cloud / Security / Reliability
→ cloud-deployment.md
→ threat-model.md
→ security-control-matrix.md
→ reliability-contract.md
→ cost-model.md

Architecture policy
→ architecture-fitness-checklist.md
```

Questo riduce la probabilità che un agent tocchi `src/priority/` leggendo soltanto il codice corrente.

## Golden commands

Lo stato corrente offre:

```text
npm run typecheck
npm test
```

`npm test` include oggi il wildcard dei test del prodotto e la characterization legacy collegata dal package script.

Il documento non promette gate che non esistono.

Quindi non scriviamo:

```text
run Azure integration tests
```

perché non sono ancora implementati.

Li manteniamo come gap nella Testing Strategy e negli altri artifact.

## Architecture constraints

`AGENTS.md` non copia tutte le fitness function.

Dice invece:

```text
Architecture policy is executable in tests/architecture-fitness.test.mjs.
Do not weaken a fitness rule merely to make a task pass.
If a rule appears obsolete, reopen the decision.
```

E rende visibili alcuni boundary ad alto valore:

```text
Payments & Risk owns economic effects.
Order Operations does not own PaymentStatus.
Core semantic layers do not import Azure SDKs.
Legacy implementation stays behind explicit compatibility boundaries.
```

## Stop conditions ESI

Il file operativo dichiara:

```text
STOP if the task requires:
- new economic side effects;
- new authoritative data ownership;
- public Internet ingress;
- destructive/irreversible data migration;
- weakening tenant isolation;
- changing confirmed functional semantics without explicit product decision;
- changing architecture policy only because implementation currently fails it.
```

Questa lista non copre ogni possibile rischio.

Copre i boundary più importanti già emersi nel libro.

## Definition of done

Per un normale change applicativo:

```text
1. implement only the scoped behavior;
2. update canonical docs when semantics/decision change;
3. run typecheck;
4. run tests;
5. report what was not verified;
6. do not claim runtime/cloud evidence without executing it.
```

Questa ultima frase è deliberata.

Order Operations ha già una lunga storia di distinzione fra:

```text
Designed
Codified
Verified
Monitored
```

L'agente deve continuare a rispettarla.

## Context fitness

Aggiungiamo anche un piccolo test:

```text
tests/agent-context-fitness.test.mjs
```

Non prova che `AGENTS.md` sia “buono”.

Verifica soltanto proprietà meccaniche utili:

- l'entry point esiste;
- la repository map esiste;
- i documenti canonical principali referenziati dalla map esistono;
- i golden command dichiarati esistono nel `package.json`.

Questo evita almeno il failure mode più banale:

```text
instructions point to files/commands that no longer exist
```

Non proviamo invece automaticamente la correttezza semantica delle istruzioni.

Quella resta una review di contesto.

## Stato dopo il capitolo

Avremo:

```text
Agent entry point                Codified
Repository Map                   Codified
Golden commands                  Existing / executable
Context fitness                  Codified + locally verifiable
Tool-specific instruction copy   Not added
Production permissions model     Not yet codified for agents
Agent Delegation Contract        Future chapter
AI Autonomy Matrix               Future chapter
```

È importante non anticipare i capitoli successivi.

Questo capitolo rende il repository **navigabile e verificabile** per un agente.

Non decide ancora quanta autonomia l'agente riceverà.

## Il risultato

Prima:

```text
agent
→ broad search
→ infer architecture
→ guess verification
→ implement
```

Dopo:

```text
agent
→ AGENTS.md
→ repository map
→ relevant canonical docs
→ scoped change
→ golden verification
→ explicit evidence gaps
```

Non eliminiamo l'esplorazione.

La rendiamo più intenzionale.

## Compromesso ESI

**Esigenza:** aumentare agent execution senza ripagare ogni volta il costo di onboarding del repository.

**Tensione:** persistent context vs duplication, staleness e context cost.

**Decisione:** `AGENTS.md` corto + repository map + canonical docs + executable constraints.

**Costo accettato:** nuova superficie documentale da mantenere e un context fitness gate addizionale.

**Quality floor:** nessuna instruction sostituisce requirement, security control o evidence; nessun secret; stop condition sui boundary critici.

**Guardrail:** canonical source routing, architecture fitness, context fitness, evidence vocabulary e future owner review.

**Trigger:** instruction drift, nuovi sottoprogetti, multi-agent workflow, nuovi tool con esigenze specifiche, crescita del file oltre una dimensione utile.

> **ESI non costruisce un repository che sa rispondere a tutto. Costruisce un repository che sa indicare dove cercare, cosa non inventare e come verificare il lavoro.**