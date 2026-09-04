# Il repository come contesto persistente

Quando un agente entra in un repository, la prima attività reale non è scrivere codice.

È costruire un modello del sistema.

Anche quando non lo vediamo, deve capire almeno:

- che cosa è il prodotto;
- quale parte del prodotto è in scope;
- dove vive il codice rilevante;
- quali boundary sono intenzionali;
- quali documenti sono autorevoli;
- quali comandi sono affidabili;
- quali errori sono normali;
- quali failure devono fermare il lavoro.

Se il repository non fornisce queste informazioni in modo economico, l'agente deve inferirle.

Più inferenza serve, più aumenta la probabilità che l'esecuzione sia veloce ma semanticamente fuori traiettoria.

## Dal repository come archivio al repository come sistema operativo del lavoro

Per molti team il repository è ancora trattato come:

```text
source code
+ configuration
+ test
```

Per un workflow agentico dobbiamo vederlo in modo più ampio:

```text
source
+ constraints
+ decisions
+ verification
+ ownership
+ operating instructions
```

Questo non significa mettere ogni informazione aziendale nel Git repository.

Significa che il repository dovrebbe contenere o referenziare in modo stabile il contesto necessario per modificare responsabilmente il software.

## Knowledge locality

Un principio utile è la **knowledge locality**.

La regola che riguarda tutto il repository può stare vicino alla root.

La regola che riguarda soltanto `src/priority/` dovrebbe stare vicino a quella capability o essere referenziata chiaramente dal documento operativo.

La regola che riguarda un deployment specifico dovrebbe vivere con l'IaC o con la relativa documentazione, non in una pagina generica che nessuno associa più alla modifica.

Più una informazione è distante dal luogo in cui produce una conseguenza, più aumenta il rischio che venga dimenticata.

Questo vale per umani e agenti.

## Canonical context vs duplicated context

Un errore frequente nell'onboarding AI è duplicare lo stesso contenuto in molti formati:

```text
README.md
AGENTS.md
copilot-instructions.md
CLAUDE.md
GEMINI.md
wiki
prompt template
```

Dopo poche settimane compaiono divergenze.

Una copia dice:

```text
PaymentStatus è letto live.
```

Un'altra dice:

```text
PaymentStatus è una projection locale.
```

A questo punto il problema non è più la mancanza di contesto.

È il conflitto fra contesti.

La strategia più sostenibile è distinguere:

```text
canonical knowledge
vs
agent/tool routing instructions
```

Per esempio:

```text
Data ownership       → docs/data-ownership.md
API semantics        → docs/api-contract.md
Reliability target   → docs/reliability-contract.md
Architecture rules   → docs/architecture-fitness-checklist.md
Agent entry point    → AGENTS.md
```

`AGENTS.md` non deve riscrivere tutti quei documenti.

Deve dire quando leggerli.

## `AGENTS.md` come indice operativo

Il formato `AGENTS.md` è pensato come un luogo prevedibile per fornire istruzioni ai coding agent. Il sito ufficiale del formato lo descrive come un README per agenti e prevede anche file annidati per sottoprogetti o aree con istruzioni specifiche. GitHub supporta `AGENTS.md` in varie superfici Copilot, mentre OpenAI Codex lo usa come sorgente di istruzioni persistenti con scope legato alla directory.

Fonti:

- [AGENTS.md — open format](https://agents.md/)
- [GitHub Docs — Support for different types of custom instructions](https://docs.github.com/en/copilot/reference/custom-instructions-support)
- [OpenAI — Unrolling the Codex agent loop](https://openai.com/index/unrolling-the-codex-agent-loop/)

Questo suggerisce una struttura utile:

```text
AGENTS.md
├── repository purpose
├── repository map
├── canonical docs
├── build/test commands
├── architectural constraints
├── stop conditions
└── definition of done
```

Non:

```text
AGENTS.md
└── entire architecture handbook copied again
```

## Repository map

Un agente può cercare semanticamente il codice.

Questo non elimina il valore di una repository map.

Una map esplicita riduce due rischi:

1. esplorazione ripetitiva;
2. scelta del file “più simile” invece del boundary corretto.

Una map efficace non elenca ogni file.

Descrive responsabilità.

Esempio:

```text
src/application/
  use case orchestration; no Azure SDK; no infrastructure dependency

src/contracts/
  external/integration contract types; implementation-independent

src/integration/
  broker/outbox/infrastructure mechanisms

src/priority/
  target priority policy + legacy compatibility seam

infra/
  Azure workload infrastructure; security/reliability decisions apply

database/
  Order Operations-owned persistence only
```

Questa informazione è molto più utile di:

```text
there are 14 TypeScript files
```

## Decision index

Un'altra cosa utile è un piccolo indice delle decisioni.

Non necessariamente un documento nuovo.

Può essere una sezione del repository map:

```text
If changing...

Payment Escalation
→ api-contract.md
→ data-ownership.md
→ event contract
→ failure-mode-map.md

Priority behavior
→ priority-functional-analysis.md
→ legacy-understanding-map.md
→ refactoring-safety-plan.md

Cloud topology
→ cloud-deployment.md
→ threat-model.md
→ reliability-contract.md
→ cost-model.md
```

L'obiettivo è evitare che l'agente debba scoprire la documentazione rilevante soltanto dopo aver prodotto il diff.

## Il problema della discoverability

Documentazione corretta ma non scopribile ha valore limitato.

Se il repository contiene venti documenti con nomi generici:

```text
design.md
notes.md
architecture2.md
old-plan.md
migration-final.md
migration-final-v2.md
```

un agente non ha un criterio affidabile per scegliere.

La discoverability migliora con:

- naming stabile;
- directory coerenti;
- documenti canonical dichiarati;
- indici brevi;
- ownership;
- link tra requirement, decisione ed evidence.

La stessa cosa vale per gli umani.

## Stale context

Il rischio più pericoloso non è un documento mancante.

È un documento autorevole ma sbagliato.

Per questo il repository deve rendere chiaro anche **quando aggiornare il contesto**.

Esempio:

```text
If you change a business rule:
- update functional analysis
- update tests
- check requirements

If you change a cross-boundary contract:
- update API/event contract
- check compatibility
- update consumer evidence

If you change infrastructure topology:
- update threat/reliability/cost models
- rerun relevant gates
```

Questa regola trasforma la documentazione da archivio passivo a parte del change workflow.

## Contesto dichiarativo e contesto eseguibile

Una repository map può dire:

```text
application must not depend on integration
```

Un architecture test può verificarlo.

I due livelli hanno funzioni diverse.

La documentazione spiega **perché**.

Il test impedisce che il principio venga violato accidentalmente.

Quindi il repository AI-ready dovrebbe spostare verso l'esecuzione le regole che possono essere verificate meccanicamente.

Non dobbiamo chiedere all'agente di ricordare:

```text
non importare @azure/* nel core
```

se abbiamo già una fitness function che può fallire in modo deterministico.

> **Il contesto migliore non è quello che l'agente deve ricordare. È quello che il sistema può verificare.**

## Context budget

Anche il contesto ha un costo.

Più istruzioni vengono caricate sempre, più aumentano:

- token;
- rumore;
- probabilità di conflitto;
- difficoltà nel capire quale regola sia rilevante;
- manutenzione.

Dobbiamo quindi applicare anche qui *fit before fashion*.

Contesto globale solo per regole globali.

Contesto locale per regole locali.

Documenti dettagliati caricati quando il task li tocca.

In forma sintetica:

```text
small global context
+ discoverable local context
+ executable constraints
```

è spesso migliore di:

```text
one enormous universal prompt
```

## Una repository map è una forma di architecture

Se una repository map è ben fatta, racconta:

- quali responsabilità esistono;
- quali confini vogliamo preservare;
- quali knowledge source sono autorevoli;
- quali dependency direction sono intenzionali.

Non sostituisce l'architettura.

Ma rende l'architettura navigabile.

> **L'AI non ha bisogno che il repository sia autoesplicativo. Ha bisogno che sia meno costoso distinguere ciò che sappiamo da ciò che deve ancora inferire.**