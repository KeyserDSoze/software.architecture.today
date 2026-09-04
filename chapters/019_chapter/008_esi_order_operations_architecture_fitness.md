# 19.8 — ESI: Architecture Fitness per Order Operations

Order Operations possiede ormai molte decisioni architetturali.

Il rischio nuovo è credere che tutte debbano diventare regole automatiche.

ESI sceglie invece una baseline più piccola:

> **proteggere automaticamente poche proprietà strutturali ad alto valore e mantenere human review per ciò che richiede ancora judgment.**

## Partire dalle decisioni già prese

Le prime cinque fitness non vengono generate guardando semplicemente la forma corrente del repository.

Derivano da decisioni già esplicite.

### AF-001 — Legacy isolation

```text
Property
Order Operations target source must not import Operations Desk Classic implementation directly.

Why
Legacy semantics remain behind an adapter during coexistence.
```

Questa regola protegge la separazione costruita nei Capitoli 17–18.

### AF-002 — Application dependency direction

```text
Property
src/application cannot depend on src/integration.

Why
Application behavior depends on ports/contracts, not infrastructure mechanisms.
```

### AF-003 — Contract independence

```text
Property
src/contracts must not depend on application, integration, observability or priority implementation.

Why
Contracts remain boundary artifacts consumable without pulling implementation layers.
```

### AF-004 — Priority isolation

```text
Property
src/priority cannot depend on integration or observability implementation.

Why
Priority semantics remain independently testable and free from mechanism leakage.
```

### AF-005 — Vendor SDK boundary

```text
Property
application/contracts/priority do not import @azure/* packages.

Why
Cloud mechanism must not become core semantics without an explicit decision.
```

Queste cinque fitness non descrivono l'unico modo corretto di strutturare TypeScript.

Descrivono ciò che ESI vuole impedire **nel proprio stato corrente**.

## Il meccanismo minimo è sufficiente

Il repository è ancora abbastanza piccolo da non giustificare una nuova piattaforma di governance.

Un test Node può:

```text
walk src/
→ inspect imports
→ apply AF-001…AF-005
→ emit rule ID on violation
→ fail normal test gate
```

Nel capstone entra quindi:

```text
tests/architecture-fitness.test.mjs
```

Se in futuro aumenteranno language, repository e regole, ESI potrà rivalutare tooling dedicato.

Oggi introdurlo soltanto per sembrare enterprise sarebbe un'altra forma di fashion-driven architecture.

## Il feedback deve spiegare la proprietà

Immaginiamo che un agente aggiunga:

```ts
// src/application/foo.ts
import { ServiceBusClient } from "@azure/service-bus";
```

I test funzionali potrebbero essere verdi.

AF-005 deve fallire.

Ma un messaggio utile non dovrebbe fermarsi a:

```text
forbidden import
```

Dovrebbe portare anche l'intento:

```text
AF-005 Vendor SDK boundary violated.
Move Azure-specific behavior behind an integration adapter
or reopen the architectural decision with evidence.
```

Il gate diventa così parte del context engineering per persone e agenti.

## Nessun bypass anonimo

La prima versione non offre un commento universale:

```text
// architecture-ignore
```

Se una regola non ha più fit o serve una violazione temporanea, dobbiamo prima capire quale caso stiamo vivendo.

### Intent changed

Aggiorniamo decisione, checklist e test.

### Temporary exception

Registriamo owner, risk, expiry e removal condition.

### Accidental drift

Correggiamo l'implementazione.

Il bypass non deve essere più economico della comprensione del problema.

## La checklist collega fitness automatiche e proprietà non ancora automatizzate

`docs/architecture-fitness-checklist.md` contiene una vista più ampia rispetto ad AF-001…AF-005.

Al Capitolo 19 collega anche proprietà già emerse su:

```text
functional semantics
data ownership
security
reliability
observability
testing
evolution
```

Alcune sono `Codified`.

Alcune hanno evidence locale.

Alcune restano `Designed` in attesa dell'ambiente che può verificarle.

Esempio di baseline narrativa:

```text
AF-001 Legacy isolation
→ architecture test
→ Codified + locally Verified

AF-SEC-01 Private production ingress
→ Bicep + future connectivity/drift verification
→ Codified, not Azure-Verified

AF-REL-01 Regional recovery
→ failover/restore drill
→ Designed, not Verified

AF-OBS-01 Bounded metric dimensions
→ telemetry contract/tests
→ Codified + locally exercised
```

Questa vista impedisce alla governance di diventare una scorecard in cui ogni riga verde sembra equivalere alla stessa qualità di evidence.

Il file vivo del repository continuerà a crescere nei capitoli successivi con fitness di cost, repository context, issue readiness e agent governance. Qui conserviamo la baseline **del Capitolo 19**.

## Il compromesso con Platform Engineering

Una proposta più ampia potrebbe includere:

```text
central architecture scanner
mandatory enterprise scorecard
repository ingestion
custom policy service
```

Commerce & Operations sceglie invece:

```text
local executable architecture tests
+ versioned fitness checklist
+ existing CI/test runner
+ human review for non-automatable trade-offs
```

Costo accettato:

- meno reporting centralizzato;
- alcune proprietà ancora manuali;
- possibile futura migrazione verso tooling condiviso.

Beneficio:

- feedback immediato;
- nessun nuovo control plane;
- rule ID vicino al codice;
- maintenance iniziale bassa.

Security e Platform mantengono comunque il diritto di imporre requirement enterprise realmente non negoziabili.

Autonomia del workload non significa autonomia da compliance o baseline condivise.

## Il guardrail non deve bloccare l'evoluzione intenzionale

Supponiamo che domani arrivi un requirement reale:

> partner esterni devono accedere alla operational view via Internet.

La risposta non è modificare silenziosamente la regola di private ingress né dichiararla eterna.

Il requirement deve riaprire:

```text
Functional Analysis
API Contract
NFR
Threat Model
Security Control Matrix
Cloud Deployment Map
Observability Contract
Testing Strategy
ADR / topology decisions
cost model
```

Qui abbiamo context drift, non semplice implementation drift.

> **Il buon guardrail blocca il drift. Non impedisce l'evoluzione intenzionale: la costringe a dichiarare quali decisioni sta riaprendo.**

## Stato del Capitolo 19

Sul piano locale ESI può arrivare a:

```text
AF-001…AF-005
= Codified + locally Verified when architecture test passes

Architecture Fitness Checklist
= Codified/documented

Architecture exception policy
= Designed/documented

Runtime/security/recovery fitness
= mixed Designed/Codified; external verification still pending where required
```

Ancora una volta, cinque architecture test verdi non certificano l'architettura del workload.

Dimostrano soltanto che cinque proprietà strutturali selezionate non sono state violate nel repository verificato.

> **Una fitness function vale per la claim che riesce a falsificare, non per la quantità di architettura che il suo nome sembra promettere.**