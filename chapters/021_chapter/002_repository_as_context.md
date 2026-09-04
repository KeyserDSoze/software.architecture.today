# 21.2 — Il repository come contesto persistente

Quando un agente entra in un repository, la prima attività reale non è scrivere codice.

È costruire un modello del sistema abbastanza buono da non confondere ciò che **esiste** con ciò che **è intenzionale**.

Deve capire che cosa fa il prodotto, quali directory contengono la semantica rilevante, quali documenti sono autorevoli, quali boundary non vanno attraversati implicitamente, quali comandi producono evidence affidabile e quali failure obbligano a fermarsi.

Se il repository non rende queste informazioni economiche da trovare, l'agente deve inferirle. E più inferenza usiamo per ricostruire decisioni stabili, più aumenta la probabilità di una modifica localmente plausibile e globalmente fuori traiettoria.

## Dal repository-archivio al repository come sistema operativo del lavoro

Per molti team il repository coincide ancora con:

```text
source code
+ configuration
+ tests
```

Per una execution sempre più delegata serve una visione più ampia:

```text
source
+ decisions
+ constraints
+ ownership
+ verification
+ operating instructions
```

Non significa trasferire tutta la conoscenza aziendale in Git. Significa che ciò che serve per modificare responsabilmente quel software deve essere contenuto, o almeno raggiungibile, attraverso un percorso stabile.

Una business policy può vivere in un sistema Product esterno, una permission enterprise in una platform policy, una runtime metric in observability. Il repository non deve copiarle tutte. Deve sapere **dove sta la fonte autorevole e quando il task deve consultarla**.

## Knowledge locality: avvicinare la regola alla conseguenza

Una regola globale merita un punto di ingresso globale. Una regola che riguarda soltanto `src/priority/` non dovrebbe occupare sempre il context window di chi modifica `infra/`. Una procedura legata a una migration dovrebbe vivere vicino alla migration o essere raggiungibile dal relativo route di contesto.

Questo principio possiamo chiamarlo **knowledge locality**: più un'informazione è distante dal luogo in cui produce conseguenze, più cresce il rischio che venga dimenticata, duplicata o reinterpretata.

La locality non è soltanto geografica. È anche semantica. Il documento che spiega perché Payments possiede gli effetti economici deve essere associato a ogni change che prova a introdurre un nuovo `PaymentStatus` locale, anche se i due file stanno in directory diverse.

## Canonical knowledge e routing non sono la stessa cosa

Uno dei modi più rapidi per rovinare il context layer è copiare la stessa informazione in troppi posti.

Immaginiamo che `README.md`, `AGENTS.md`, una instruction Copilot, una wiki e un prompt template descrivano tutti la stessa ownership rule. All'inizio sembrano coerenti. Poi una sola copia viene aggiornata e iniziano a esistere cinque versioni del sistema.

A quel punto il problema non è più la scarsità di contesto. È **context conflict**.

La distinzione che vogliamo mantenere è:

```text
canonical knowledge
→ explains the decision

routing instruction
→ says when and where to read it
```

Per Order Operations questo significa, per esempio:

```text
Data ownership
→ docs/data-ownership.md

Priority semantics
→ docs/priority-functional-analysis.md

Reliability target
→ docs/reliability-contract.md

Architecture rules
→ docs/architecture-fitness-checklist.md

Operational entry point
→ AGENTS.md
```

`AGENTS.md` non deve riscrivere quei documenti. Deve insegnare a raggiungerli.

## `AGENTS.md` come entry point, non come seconda architettura

Il formato `AGENTS.md` nasce come luogo prevedibile per istruzioni rivolte ai coding agent. GitHub supporta varie forme di repository custom instruction, mentre il formato `AGENTS.md` prevede anche scope locali attraverso file annidati; OpenAI Codex usa a sua volta istruzioni persistenti legate al repository e alla directory.

Fonti:

- [AGENTS.md — open format](https://agents.md/)
- [GitHub Docs — Support for different types of custom instructions](https://docs.github.com/en/copilot/reference/custom-instructions-support)
- [OpenAI — Unrolling the Codex agent loop](https://openai.com/index/unrolling-the-codex-agent-loop/)

Queste capability sono utili perché offrono un punto di ingresso stabile. Ma il design resta nostro.

Per ESI l'entry point deve rispondere rapidamente a poche domande: che prodotto è questo, dove si trova la Repository Map, quali documenti leggere per classi di change, quali comandi eseguire, quali boundary non modificare implicitamente e quando fermarsi.

Se comincia a contenere schema completo, incident history, API encyclopedia e tutte le decisioni di ogni capitolo, ha smesso di fare routing.

## La Repository Map descrive responsabilità, non file

Un agente può cercare semanticamente. Questo non rende inutile una mappa.

La ricerca risponde bene a “dove compare questa stringa?”. Una Repository Map dovrebbe rispondere a “quale parte del sistema **possiede questa responsabilità**?”.

Per Order Operations la baseline del Capitolo 21 può essere letta così:

| Area | Responsabilità | Vincolo importante |
|---|---|---|
| `src/application/` | orchestrazione dei use case | non dipende direttamente dai meccanismi infrastrutturali |
| `src/contracts/` | contract indipendenti dall'implementazione | non deve importare semantica da layer applicativi/infrastrutturali |
| `src/integration/` | broker, outbox e integrazione | contiene i meccanismi, non la business authority |
| `src/observability/` | telemetry boundary | non diventa dominio |
| `src/priority/` | target priority semantics + compatibility seam | legacy resta dietro boundary esplicito |
| `database/` | persistence posseduta da Order Operations | niente seconda authority per fatti di altri domini |
| `infra/` | workload infrastructure | security/reliability/cost decision si applicano qui |

Questa tabella è molto più utile di un inventario di quattordici file. Riduce il rischio che l'agente scelga il file “più simile” invece del boundary corretto.

## Un decision route riduce il costo di discovery

La mappa diventa ancora più utile quando non descrive soltanto directory, ma collega il tipo di change al contesto che deve essere aperto **prima** del diff.

Per esempio:

```text
Priority behavior
→ priority-functional-analysis.md
→ legacy-understanding-map.md
→ refactoring-safety-plan.md

Payment Escalation
→ api-contract.md
→ events/
→ data-ownership.md
→ failure-mode-map.md

Cloud topology
→ cloud-deployment.md
→ threat-model.md
→ reliability-contract.md
→ cost-model.md
```

Il valore è temporale. L'agente trova il decision context prima di produrre una soluzione che poi scopriamo incompatibile con il sistema.

## Discoverability: corretto ma introvabile è quasi inutile

Documentazione buona con naming ambiguo, directory incoerenti e file come `design-final-v2.md` ha un valore operativo molto più basso di quanto sembri.

La discoverability migliora quando i documenti canonical hanno nomi stabili, ownership chiara e link espliciti fra requirement, decisione ed evidence. Non serve una tassonomia perfetta. Serve che un nuovo contributor possa distinguere rapidamente ciò che è corrente da ciò che è storico, target o sperimentale.

Questo punto è particolarmente importante nel capstone, dove una `Legacy Understanding Map` e una `Functional Analysis` contengono entrambe regole di priority ma con status epistemico diverso. Il nome e il routing devono impedirci di trattarle come due copie equivalenti.

## Stale context: il rischio peggiore

Un documento assente costringe l'agente a cercare. Un documento autorevole ma obsoleto può invece convincerlo di sapere.

Per questo il context layer deve essere sincronizzato con il change workflow. Se cambia una business rule, Functional Analysis, Requirements e test devono restare coerenti. Se cambia un cross-boundary contract, vanno rivalutati compatibility, ownership e consumer evidence. Se cambia topology, devono riaprirsi Threat Model, Reliability e Cost Model.

La documentazione smette così di essere un archivio che aggiorniamo “quando c'è tempo”. Diventa una parte della Definition of Done quando il change modifica il significato che il documento governa.

## Context dichiarativo e context eseguibile

La Repository Map può dire che `src/application` non deve importare `src/integration`. Il test AF-002 può verificarlo.

I due livelli non si duplicano: il documento spiega **perché** il confine esiste e come orientarsi; il test rende difficile violarlo accidentalmente.

Questa è una delle idee più importanti del capitolo.

> **Il miglior contesto stabile non è sempre quello che chiediamo all'agente di ricordare. Quando una proprietà è meccanicamente verificabile, il repository dovrebbe poter rispondere da solo.**

L'architecture test diventa quindi anche una forma di context engineering: comunica il boundary attraverso feedback deterministico.

## Context budget

Anche il contesto ha un costo. Più testo carichiamo sempre, più aumentano token, rumore, conflitto e manutenzione.

La strategia ESI sarà quindi:

```text
small global routing context
+ discoverable canonical knowledge
+ local context when the task needs it
+ executable constraints where possible
```

Non un universal prompt che tenta di raccontare tutto il sistema in anticipo.

Questo è ancora `fit before fashion`: il context layer deve essere proporzionato alla decisione.

## Una Repository Map è architecture navigabile

Una buona mappa non sostituisce il modello architetturale. Rende visibile dove vivono responsabilità, knowledge source e dependency direction.

Nel prossimo paragrafo aggiungeremo l'altra metà dell'AI-readiness: non basta sapere dove andare. Il repository deve anche offrire un percorso corto e ripetibile da modifica a evidence.

> **Ridurre l'inferenza non significa eliminare l'esplorazione. Significa evitare di far riscoprire continuamente ciò che il team ha già deciso e può rendere persistente.**