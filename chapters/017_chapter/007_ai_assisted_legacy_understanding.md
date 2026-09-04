# 17.7 — AI-assisted legacy understanding

Il legacy è uno dei contesti in cui gli agenti AI possono produrre più leva.

È anche uno dei contesti in cui possono produrre più falsa confidence.

La ragione è semplice: una codebase grande contiene enormi quantità di informazione meccanicamente esplorabile, ma soltanto una parte di quella informazione descrive davvero il comportamento operativo e il significato di business.

## L'AI riduce il costo della discovery

Un agente può accelerare attività come:

- inventory di package e runtime;
- ricerca di entry point;
- dependency graph;
- accessi database;
- query SQL duplicate;
- configuration key;
- feature flag;
- producer/consumer di eventi;
- outbound dependency;
- scheduled job;
- high fan-in module;
- candidate business rule;
- test gap;
- documentation draft.

Microsoft sta portando esplicitamente gli agenti in questo spazio con GitHub Copilot modernization, che analizza code, configuration e dependency, produce assessment e migration plan e automatizza parte della trasformazione mantenendo review e validation umana nel ciclo.

Fonte:

- [Microsoft Learn — GitHub Copilot modernization](https://learn.microsoft.com/en-us/azure/developer/github-copilot-app-modernization/overview)

Questo rende molto più economico costruire una prima mappa.

Non trasforma però il repository in una specifica completa del sistema.

## Repository intelligence non è system intelligence

Un agente con accesso al repository può conoscere molto bene:

```text
source
build
static configuration
tests
documentation
```

Può non vedere:

```text
production configuration
runtime traffic
manual procedures
consumer outside repository
incident history
tribal knowledge
customer commitment
organizational dependency
```

Per questo distinguiamo:

```text
Repository intelligence
→ ciò che possiamo trovare o inferire dai materiali disponibili

System intelligence
→ ciò che sappiamo del comportamento operativo complessivo
```

La prima è una parte della seconda.

Un agente può essere eccellente nel primo livello e ancora non possedere evidence sufficiente per una decisione di modernization.

## La provenance deve viaggiare con la claim

Nel legacy non vogliamo output soltanto fluidi.

Vogliamo output verificabili.

Un formato utile è:

```text
Claim

Evidence
file / symbol / query / config / trace

State
Found / Inferred / Observed / Confirmed

Alternative explanation
che cosa potrebbe spiegare diversamente l'evidence?

Missing evidence
che cosa serve per aumentare confidence?
```

Per esempio:

```text
Claim
PriorityRouting decide l'urgenza dei case Payment.

Evidence
priority-routing.cjs + caller route-case.cjs

State
Inferred

Alternative
production config potrebbe bypassare il path.

Missing
runtime trace + Operations confirmation.
```

Questo output è meno elegante di una pagina architetturale completa.

È molto più utile perché conserva il confine della conoscenza.

## Parallelizzare la ricerca, non la convinzione

Una codebase complessa può essere esplorata da agenti con prospettive differenti.

Uno può cercare runtime e dependency, uno dati e schema, uno business behavior, uno test ed evidence.

Un reviewer separato può poi chiedere:

```text
quali claim sono soltanto Inferred?
quali dependency potrebbero essere fuori repo?
quali behavior sembrano accidentali?
quali mappe non hanno runtime evidence?
```

La parallelizzazione è utile quando la domanda comune è già chiara.

La regola del Capitolo 0 resta valida:

> **prima sincronizzare il pensiero, poi parallelizzare l'esecuzione.**

Altrimenti otteniamo quattro mappe incompatibili e una falsa sensazione di completezza.

## Documentation laundering

Uno dei failure mode più pericolosi dell'AI-assisted archaeology nasce quando una inferenza perde progressivamente la propria origine.

Il ciclo può essere:

```text
agent reads ambiguous code
→ writes plausible explanation
→ explanation enters architecture.md
→ next agent treats architecture.md as authoritative
→ assumption becomes "known fact"
```

Chiamiamo questo fenomeno **documentation laundering**.

Non serve che qualcuno menta.

Basta che il grado di evidence venga perso durante il passaggio da output a documento.

Per evitarlo, la documentazione discovery deve distinguere almeno:

```text
Found
Inferred
Observed
Confirmed
Open question
```

Una pagina può essere molto autorevole nella forma e ancora contenere ipotesi.

La provenance è ciò che impedisce alla forma di sostituire l'evidence.

## AI-generated characterization test: utile, ma non automaticamente forte

Un agente può generare rapidamente characterization test a partire dal comportamento corrente.

Può trovare branch, boundary value, special case, input minimizzati e candidate fixture.

Il rischio è lo stesso del Capitolo 16: leggere l'implementazione e trasformarla in assertion tautologiche.

Per ogni test generato chiediamo quindi:

```text
quale behavior osservabile protegge?
quale modifica sbagliata dovrebbe rilevare?
il behavior è Confirmed o soltanto Observed?
```

La terza domanda è specifica del legacy.

Un test può essere forte come regression detector e ancora proteggere un comportamento che decideremo deliberatamente di eliminare.

## Candidate boundary non significa boundary giusto

Gli agenti sono ottimi nell'individuare segnali strutturali:

- duplicated switch;
- modulo ad alto fan-in;
- repository che tocca molte tabelle;
- utility usata ovunque;
- cluster di file che cambiano insieme;
- regola replicata.

Questi segnali possono suggerire un seam.

Non lo dimostrano.

Un modulo molto accoppiato può essere una responsabilità da separare oppure il punto reale in cui convergono concetti inseparabili.

La decisione richiede ancora dominio, ownership e consequence analysis.

## Human-in-the-loop significa governare le decisioni irreversibili

Non serve che una persona legga manualmente ogni import trovato dall'agente.

La review umana deve concentrarsi soprattutto su:

```text
claim semantics
business importance
risk
security/data ownership
schema migration
cutover
rollback
acceptance evidence
```

In altre parole, l'AI può comprimere il lavoro meccanico.

L'umano deve governare le trasformazioni in cui una interpretazione sbagliata può diventare un one-way door.

## Stop condition per l'agente

La discovery autonoma deve fermarsi o richiedere escalation quando incontra:

```text
credential
production write path
destructive migration
unclear data ownership
externally consumed schema
security boundary ambiguity
economic behavior
contradicting evidence
critical area without test/evidence
```

La regola non è “continua finché trovi qualcosa”.

È “continua finché il costo di un'assunzione sbagliata resta nel blast radius autorizzato”.

## Minimum sufficient understanding

Il contrario della big-bang discovery non è l'ignoranza.

È la **minimum sufficient understanding** per il prossimo change sicuro.

```text
decision scope
→ required understanding
→ evidence collection
→ safe change
→ new runtime/test evidence
→ next decision
```

Non dobbiamo completare l'enciclopedia del sistema prima di ogni modifica.

Dobbiamo però conoscere abbastanza da sapere che cosa potrebbe rompersi, come lo rileveremmo e come torneremmo indietro.

L'AI rende questo ciclo più rapido.

Non ne cambia la logica.

## Un caso interessante nel 2026

Martin Fowler ha commentato nel 2026 un caso di ristrutturazione di una codebase Laravel/React in cui i primi passi furono characterization test, static analysis e quality gate; soltanto dopo l'autore aumentò l'autonomia dell'agente AI. Fowler collega esplicitamente la maggiore fiducia nell'automazione alla presenza di harness e test più forti.

Fonte:

- [Martin Fowler — Fragments, May 27 2026](https://martinfowler.com/fragments/2026-05-27.html)

È coerente con una tesi ricorrente del libro:

> **l'autonomia utile cresce quando cresce la verificabilità del sistema.**

## Il risultato che vogliamo dall'AI-assisted archaeology

Il successo non è un documento di cinquanta pagine.

Può essere qualcosa di molto più piccolo:

```text
5 behavior Confirmed
3 behavior Observed but not Confirmed
2 hidden consumers found
1 ownership conflict
1 seam candidate
4 characterization tests
2 blockers before migration
```

Questo riduce direttamente l'incertezza del prossimo passo.

Ed è questo il vero prodotto della discovery.

> **L'AI può leggere il legacy più velocemente di noi. La responsabilità resta decidere quali delle sue conclusioni meritano di diventare conoscenza del sistema.**