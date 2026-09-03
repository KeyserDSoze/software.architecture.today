# 17.7 — AI-assisted legacy understanding

Il legacy è uno dei contesti in cui gli agenti AI possono produrre più leva.

Ed è anche uno dei contesti in cui possono produrre più falsa confidenza.

## Perché l'AI è utile nel legacy

Una codebase grande contiene molta informazione meccanicamente esplorabile.

Un agente può accelerare attività come:

- inventory di package e runtime;
- ricerca di entry point;
- dependency graph;
- chiamate database;
- query SQL duplicate;
- configuration key;
- feature flag;
- event producer/consumer;
- outbound HTTP dependency;
- scheduled job;
- test coverage gap;
- candidate business rule;
- high fan-in module;
- co-change analysis;
- dead-code hypothesis;
- documentation draft.

Microsoft sta esplicitamente portando l'uso di agenti in questo spazio: GitHub Copilot modernization analizza code, configuration e dependency, produce assessment e migration plan e automatizza parte delle trasformazioni, mantenendo recommendation reviewable e human validation nel loop.

Fonte:

- [Microsoft Learn — GitHub Copilot modernization](https://learn.microsoft.com/en-us/azure/developer/github-copilot-app-modernization/overview)

L'importante è leggere bene la promessa.

Il tool può accelerare assessment e transformation.

Non può trasformare automaticamente il repository in una specifica completa del business.

## Repository intelligence vs system intelligence

Un agente con accesso al repository può sapere molto su:

```text
source
build
static configuration
test
documentation
```

ma può non vedere:

```text
production configuration
runtime traffic
manual procedure
consumer esterno
private data contract
incident history
tribal knowledge
organizational dependency
customer commitment
```

Quindi distinguiamo:

```text
Repository intelligence
= cosa possiamo dedurre dai materiali disponibili

System intelligence
= cosa sappiamo del comportamento operativo complessivo
```

La prima è un sottoinsieme della seconda.

## L'agente deve citare la provenance

Per legacy discovery non vogliamo risposte soltanto fluenti.

Vogliamo risposte verificabili.

Prompt operativo:

```text
Per ogni claim restituisci:
- claim;
- file/symbol/query/config che lo supporta;
- grado: Found / Inferred;
- alternative explanation;
- evidence mancante per passare a Observed/Confirmed.
```

Esempio:

```text
Claim
PriorityRouting decide l'urgenza dei case Payment.

Evidence
legacy/priority-routing.cjs:42-67
caller: route-case.cjs:18

State
Inferred

Alternative
potrebbe essere bypassato in produzione da feature flag.

Missing evidence
runtime trace + current config + Operations confirmation.
```

Questa forma è meno elegante di una spiegazione narrativa.

È molto più utile.

## Multi-agent discovery

Per una codebase complessa possiamo parallelizzare l'esplorazione per prospettiva.

### Agent A — Runtime/dependency

Cerca:

- entry point;
- network call;
- queue;
- scheduler;
- config.

### Agent B — Data

Cerca:

- table;
- stored procedure;
- query;
- schema coupling;
- migration.

### Agent C — Domain behavior

Cerca:

- branching;
- enum;
- status transition;
- validation;
- special case.

### Agent D — Testing/evidence

Cerca:

- test esistenti;
- uncovered critical path;
- flaky pattern;
- fixture;
- missing characterization.

### Agent E — Skeptical reviewer

Riceve i risultati e chiede:

```text
quali claim sono soltanto inferred?
quali dependency potrebbero essere fuori repo?
quali behavior sembrano accidentali?
quali mappe non hanno runtime evidence?
```

Ma prima di parallelizzare dobbiamo sincronizzare la domanda.

> **Prima sincronizzare il pensiero. Poi parallelizzare l'esecuzione.**

## Il rischio del documentation laundering

Un agente legge codice ambiguo.

Produce una spiegazione.

La spiegazione viene salvata in `architecture.md`.

Il prossimo agente legge `architecture.md` come fonte autorevole.

Dopo tre iterazioni l'ipotesi iniziale è diventata “documentazione ufficiale”.

Questo è un failure mode serio.

Lo chiamiamo:

> **documentation laundering**

Per evitarlo, la documentazione discovery deve distinguere:

```text
Observed fact
Inferred behavior
Open question
Confirmed rule
```

## AI e characterization test

L'AI può generare rapidamente characterization test a partire dal comportamento corrente.

È utile per:

- branch coverage iniziale;
- boundary input;
- legacy special case;
- serialization;
- input minimization;
- snapshot normalization.

Ma abbiamo già visto nel Capitolo 16 il rischio della test illusion.

Un agente che legge implementazione e genera test può semplicemente riscrivere l'implementazione in forma di assertion.

Quindi chiediamo anche:

```text
Quale comportamento osservabile protegge?
Quale modifica sbagliata dovrebbe rilevare?
È un requisito confermato o solo characterization?
```

## AI e refactoring candidate

Un agente può individuare candidati come:

- classe con fan-in enorme;
- duplicated switch;
- utility usata da tutti;
- repository che accede a troppe tabelle;
- package con high co-change;
- business rule replicata.

Questi sono segnali.

Non sono ancora boundary.

Un modulo molto accoppiato può essere:

- il problema da separare;
- oppure il luogo dove convergono davvero responsabilità inseparabili.

Serve ancora domain reasoning.

## Human-in-the-loop non significa approvare ogni riga

Nel legacy l'essere umano deve governare soprattutto:

- claim semantics;
- business importance;
- risk;
- stop condition;
- destructive operation;
- schema/data migration;
- cutover;
- rollback;
- acceptance evidence.

Non deve necessariamente leggere manualmente ogni import trovato dall'agente.

L'obiettivo è spostare la review dal volume di esecuzione alla qualità delle decisioni.

## Stop condition per l'agente

Un agente che esplora il legacy deve fermarsi quando incontra:

- credential;
- production write path;
- destructive migration;
- unclear data ownership;
- security boundary ambiguo;
- externally consumed schema;
- behavior con impatto economico;
- evidence contraddittoria;
- assenza di test su area critica.

Non vogliamo che “continua finché funziona” diventi una strategia di modernization.

## Il principio della minimum sufficient understanding

Non serve conoscere tutto prima di qualsiasi change.

Serve conoscere abbastanza per il **prossimo change sicuro**.

Questo significa:

```text
Decision scope
→ required understanding
→ evidence
→ safe change
→ new evidence
→ next decision
```

L'AI rende questo ciclo più veloce.

Non cambia la logica.

## Un caso interessante nel 2026

Martin Fowler ha commentato nel 2026 un caso di ristrutturazione di una codebase legacy Laravel/React in cui i primi passi furono characterization test, static analysis e quality gate; solo dopo l'autore aumentò l'autonomia dell'agente AI. Fowler collega esplicitamente la capacità di usare agenti con maggiore fiducia alla presenza di test e harness più forti.

Fonte:

- [Martin Fowler — Fragments, May 27 2026](https://martinfowler.com/fragments/2026-05-27.html)

È coerente con una tesi ricorrente del libro:

> **l'autonomia utile cresce quando cresce la verificabilità del sistema.**

## L'output che vogliamo

L'obiettivo dell'AI-assisted archaeology non è produrre una documentazione monumentale.

È ridurre l'incertezza della prossima decisione.

Un buon output può essere soltanto:

```text
5 behavior confirmed
3 behavior observed but not confirmed
2 hidden consumers found
1 data ownership conflict
1 seam candidate
4 characterization tests added
2 questions blocking migration
```

Questo vale molto più di cinquanta pagine di descrizione plausibile.

> **L'AI può leggere il legacy più velocemente di noi. La responsabilità resta decidere quali delle sue conclusioni meritano di diventare conoscenza del sistema.**