# 21.8 — ESI: rendere Order Operations AI-ready

Order Operations è un buon candidato per questo capitolo proprio perché non è un repository vuoto.

Ha già Functional Analysis, Requirements, contract, ownership map, quality artifact, migration plan, code, IaC e test. Il problema non è aggiungere altra conoscenza. È ridurre il costo necessario a trovare quella giusta prima di un change.

Platform propone quindi una convenzione semplice: i repository che lavorano con coding agent devono offrire un entry point operativo prevedibile. Commerce & Operations accetta il principio ma rifiuta di duplicare il prodotto dentro un file vendor-specific. Security aggiunge due boundary: niente secret nelle instruction e niente permission production implicita. Finance collega infine il problema al Capitolo 20: rediscovery ripetitiva consuma tempo, agent execution e context budget senza produrre outcome.

Il compromesso diventa:

```text
enough persistent context
+ low duplication
+ reproducible verification
+ explicit stop conditions
```

## Prima decisione — `AGENTS.md` fa routing

ESI introduce nella root del prodotto:

```text
AGENTS.md
```

come entry point tool-neutral.

Il file non contiene l'intera architettura. Dichiara il purpose di Order Operations, indirizza alla Repository Map, mostra i golden command, richiama pochi boundary ad alto valore e definisce quando il task deve fermarsi.

Questa scelta è intenzionale. GitHub potrebbe avere proprie superfici di custom instruction e altri agenti potrebbero usare formati differenti. Nel Capitolo 21 non abbiamo però una esigenza che giustifichi più copie della stessa conoscenza.

```text
canonical operating entry point
= AGENTS.md
```

Un adapter tool-specific potrà esistere se servirà davvero, ma dovrà puntare alla source of truth invece di riscriverla.

## Seconda decisione — la Repository Map descrive responsabilità

ESI aggiunge:

```text
docs/repository-map.md
```

La mappa non prova a elencare ogni file. Descrive dove vivono le responsabilità principali e quali knowledge source leggere per classi di change.

La baseline del Capitolo 21 è questa:

| Area | Responsabilità nel repository |
|---|---|
| `src/application/` | use-case orchestration |
| `src/contracts/` | integration contract indipendenti dai meccanismi |
| `src/integration/` | adapter e meccanismi infrastructure-facing |
| `src/observability/` | telemetry boundary |
| `src/priority/` | target priority semantics + legacy compatibility seam |
| `database/` | persistence posseduta da Order Operations |
| `infra/` | Azure workload infrastructure |
| `tests/` | behavior e fitness verificabili localmente |
| `docs/` | canonical product/architecture knowledge |

Il valore non è la directory tree. È la relazione fra path e responsibility.

Chi deve cambiare priority viene indirizzato verso `priority-functional-analysis.md`, `legacy-understanding-map.md` e `refactoring-safety-plan.md`. Chi tocca Payment Escalation viene portato verso API/event contract, Data Ownership e Failure Mode Map. Chi modifica cloud topology deve aprire deployment, threat, reliability e Cost Model.

Così il decision context entra **prima** del diff.

## I golden command sono quelli che esistono davvero

Il repository offre oggi:

```bash
npm run typecheck
npm test
```

Non scriviamo “run Azure integration tests” o “verify recovery” perché quei gate non sono ancora disponibili come evidence eseguita.

`npm test` costruisce il prodotto, esegue i test del package e include la characterization suite legacy configurata nel `package.json`.

Questo ci permette di affermare che esiste un verification path locale. Non ci autorizza a dire che PostgreSQL, Azure, recovery o production behavior siano `Verified`.

La stessa disciplina epistemica che abbiamo applicato al capstone diventa ora una instruction per chiunque esegua task:

```text
Designed
→ Codified
→ Verified
→ Monitored
```

Non saltare livelli per rendere più convincente il report finale.

## Architecture constraint: route verso il gate, non copia della policy

`AGENTS.md` rende visibili alcuni boundary perché sono abbastanza importanti da orientare quasi ogni task: Payments & Risk possiede gli effetti economici, Order Operations non possiede `PaymentStatus`, il core semantic layer non importa Azure SDK e il legacy resta dietro compatibility boundary espliciti.

Ma non copia tutta l'Architecture Fitness Checklist.

Dice invece che le regole strutturali sono eseguibili in:

```text
tests/architecture-fitness.test.mjs
```

con una istruzione cruciale:

> **non indebolire una fitness rule soltanto per far passare il task; se la rule non ha più fit, riapri la decisione.**

Questo evita di mantenere una seconda versione manuale delle stesse constraint.

## Stop condition: ciò che l'entry point non autorizza

Nel Capitolo 21 ESI rende già espliciti alcuni confini oltre i quali un coding task deve trasformarsi in decisione.

Il task si ferma se richiede una nuova economic side effect, una nuova authoritative data ownership, public Internet ingress, destructive/irreversible migration, indebolimento della tenant isolation, modifica della functional semantics confermata o cambiamento dell'architecture policy soltanto perché il diff la viola.

Queste stop condition non coprono ogni rischio futuro. Coprono quelli già emersi nella storia di Order Operations.

È importante non anticipare il Capitolo 23: non stiamo ancora costruendo un permission framework completo per agenti. Stiamo rendendo leggibile il punto in cui il repository **non può autorizzare da solo** la prosecuzione.

## Il context fitness verifica soltanto ciò che può verificare

ESI aggiunge infine:

```text
tests/agent-context-fitness.test.mjs
```

Questo test non prova che `AGENTS.md` sia semanticamente perfetto né che un agente seguirà sempre le istruzioni. Verifica soltanto proprietà meccaniche sufficientemente stabili da meritare automation.

La baseline introdotta nel capitolo è composta da quattro check:

| ID | Proprietà verificata |
|---|---|
| CTX-001 | `AGENTS.md` e `docs/repository-map.md` esistono |
| CTX-002 | i principali documenti canonical referenziati esistono |
| CTX-003 | `typecheck` e `test` esistono davvero nel `package.json` |
| CTX-004 | `AGENTS.md` route verso la map, dichiara i golden command e preserva il vocabulary `Designed → Codified → Verified → Monitored` |

Questa evidence protegge dai failure più banali del context layer: istruzioni che puntano a file rimossi o comandi inesistenti.

Non dimostra invece:

```text
instruction semantic correctness
agent compliance
permission enforcement
cloud verification
production readiness
```

Ed è corretto che non lo faccia.

## Stato dopo il Capitolo 21

A questo punto ESI può affermare:

```text
Agent entry point       Codified
Repository Map          Codified
Golden commands         Existing / executable
Context fitness         Codified + locally exercisable
Tool-specific copy      Not added
Agent permission model  Future
Delegation Contract     Future
Autonomy Matrix         Future
```

L'ultimo blocco è importante: il capitolo rende il repository **navigabile e verificabile** per un nuovo esecutore. Non decide ancora quanta autonomia quell'esecutore riceverà.

## Prima e dopo

Prima del capitolo il percorso tipico era:

```text
agent
→ broad search
→ infer architecture
→ guess verification
→ implement
```

Ora diventa:

```text
agent
→ AGENTS.md
→ Repository Map
→ relevant canonical docs
→ scoped change
→ golden verification
→ explicit evidence gaps
```

Non abbiamo eliminato la ricerca. Abbiamo eliminato una parte della rediscovery inutile e reso più evidente ciò che non deve essere inferito.

## Compromesso ESI

**Esigenza:** aumentare agent execution senza ripagare a ogni task l'intero costo di onboarding del repository.

**Tensione:** persistent context contro duplicazione, staleness e context cost.

**Decisione:** `AGENTS.md` corto + Repository Map + canonical docs + executable constraint e context fitness.

**Costo accettato:** una nuova superficie documentale da mantenere e quattro check meccanici aggiuntivi.

**Quality floor:** nessuna instruction sostituisce requirement, security control o evidence; niente secret; stop condition sui boundary già critici.

**Review trigger:** instruction drift, nuovi sottoprogetti, cambi dei golden command o comparsa di esigenze realmente tool-specific.

> **ESI non costruisce un repository che sa rispondere a tutto. Costruisce un repository che sa indicare dove cercare, che cosa non inventare e quale evidence manca ancora.**