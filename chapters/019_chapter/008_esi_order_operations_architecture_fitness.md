# 19.8 — ESI: Architecture Fitness per Order Operations

Ora applichiamo tutto a Order Operations.

L'obiettivo non è costruire una piattaforma di governance.

L'obiettivo è proteggere poche proprietà ad alto valore usando il minimo meccanismo sufficiente.

## Le proprietà che vogliamo proteggere

### AF-001 — Legacy isolation

```text
Property:
Order Operations target source must not import Operations Desk Classic implementation directly.

Why:
Legacy semantics must remain behind an adapter during coexistence.
```

### AF-002 — Application dependency direction

```text
Property:
src/application cannot depend on src/integration.

Why:
Application behavior should depend on ports/contracts, not infrastructure mechanisms.
```

### AF-003 — Contract independence

```text
Property:
src/contracts must not depend on application, integration, observability or priority implementation.

Why:
Contracts are boundary artifacts and should remain stable enough to be consumed independently.
```

### AF-004 — Priority isolation

```text
Property:
src/priority cannot depend on integration or observability implementation.

Why:
Priority policy is domain/application behavior and must remain independently testable.
```

### AF-005 — Vendor SDK boundary

```text
Property:
application/contracts/priority do not import Azure-specific SDK packages.

Why:
Cloud choice must not leak into core semantics without a reason.
```

Non sono verità universali.

Sono proprietà coerenti con le decisioni accumulate fin qui.

## Come le verifichiamo

Non introduciamo un framework nuovo.

Il progetto è piccolo e TypeScript.

Un test Node può leggere i file `.ts`, estrarre gli import e verificare alcune regole.

Se in futuro il repository cresce, possiamo rivalutare strumenti più sofisticati.

Questo applica ancora una volta:

> **fit before fashion.**

La capability richiesta oggi è piccola.

Non serve adottare uno strumento enterprise per dimostrare maturità.

## Il test architetturale

Nel capstone entra:

```text
tests/architecture-fitness.test.mjs
```

Il test:

1. attraversa `src/`;
2. legge gli import relativi e package import;
3. verifica le regole AF-001…AF-005;
4. produce messaggi con l'ID della fitness function;
5. fallisce il normale test gate se rileva drift.

Quindi il feedback loop diventa:

```text
agent/developer change
→ npm test
→ architecture fitness
→ violation with rule ID
→ fix or explicit architecture discussion
```

## Non introduciamo un bypass automatico

La prima versione non supporta:

```text
// ignore-architecture
```

Se una regola deve essere violata intenzionalmente, il team deve prima aggiornare:

```text
Architecture Fitness Checklist
+ ADR / architecture decision if needed
+ exception record if temporary
```

Poi il test può evolvere.

Questo impedisce che la waiver diventi il path più economico.

## Architecture Fitness Checklist ESI

Il nuovo artefatto:

```text
docs/architecture-fitness-checklist.md
```

non contiene soltanto AF-001…AF-005.

Collega anche property già progettate in capitoli precedenti:

```text
functional semantics
ownership
security
reliability
observability
testing
cost
evolution
```

Alcune sono `Codified`.

Alcune `Verified`.

Alcune restano `Designed`.

Questo rende visibile una cosa importante:

> il fatto che una proprietà sia architetturalmente importante non significa che oggi abbiamo già un meccanismo automatico per verificarla.

## Esempio di stato

```text
AF-001 Legacy isolation
Mechanism: architecture test
State: Codified + Verified locally

AF-SEC-01 Private production ingress
Mechanism: Bicep + future connectivity/drift test
State: Codified, not Verified in Azure

AF-REL-01 Regional recovery
Mechanism: restore/failover drill
State: Designed, not Verified

AF-OBS-01 Bounded metric dimensions
Mechanism: TypeScript contract + tests
State: Codified + locally exercised
```

Questa vista impedisce alla governance di appiattire tutto in una checkbox verde.

## Il compromesso ESI

Platform proponeva inizialmente una baseline più ampia:

```text
central architecture scanner
mandatory enterprise scorecard
repository ingestion
custom policy service
```

Commerce & Operations chiede di partire più piccolo.

Decisione:

```text
local executable architecture tests
+ versioned fitness checklist
+ existing CI/test runner
+ manual review for non-automatable trade-offs
```

Costo accettato:

- meno reporting centralizzato;
- alcune property ancora manuali;
- possibile futura migrazione verso tooling comune.

Benefit:

- feedback immediato;
- nessun nuovo control plane;
- regole leggibili vicino al codice;
- basso costo di manutenzione iniziale.

Quality floor:

- Security e Platform possono imporre requirement enterprise realmente non negoziabili;
- una regola locale non può disabilitare requirement normativi o security baseline;
- le eccezioni significative restano tracciate.

## Un caso concreto di drift

Immaginiamo che un agente aggiunga:

```ts
// src/application/foo.ts
import { ServiceBusClient } from "@azure/service-bus";
```

La feature potrebbe funzionare.

I test funzionali potrebbero passare.

AF-005 deve fallire.

Il messaggio non dovrebbe dire soltanto:

```text
forbidden import
```

ma:

```text
AF-005 Vendor SDK boundary violated.
Move Azure-specific behavior behind an integration adapter
or reopen the architectural decision with evidence.
```

Questo rende il test un pezzo di context engineering.

## Un caso che il test non deve decidere

Supponiamo invece che Order Operations debba esporre una nuova public API per partner.

Il test non deve rispondere:

```text
public ingress forbidden forever
```

Deve scattare un review trigger:

```text
Threat Model
Cloud Deployment Map
Security Control Matrix
NFR
ADR
cost
```

Qui il cambiamento è architetturale perché cambia il contesto.

> **Il buon guardrail blocca il drift. Non blocca l'evoluzione intenzionale.**
