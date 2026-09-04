# Software Architecture Today — v1.0.0-rc2

Questa seconda release candidate aggiorna gli **apparati finali per il lettore** senza cambiare la tesi, la struttura 0–30 o lo stato del capstone.

## Che cosa cambia rispetto a RC1

### Glossario finale esteso

Il glossario è stato portato allo stesso livello di servizio al lettore del libro `data.analyst.today`.

Ora `reference/001_glossario.md` è un glossario alfabetico ampio che raccoglie termini, acronimi, pattern, proprietà, failure concept e artefatti operativi usati lungo l'intero arco del libro.

Include, fra gli altri, vocabolario relativo a:

- architecture, boundary, ADR, ASR e quality attribute;
- API, compatibility, idempotency e interaction style;
- data architecture, transaction, replication, partitioning e cache;
- distributed systems, messaging, saga, outbox, retry e backpressure;
- cloud, IaC, PaaS, serverless, Kubernetes e multi-region;
- security, identity, authorization, least privilege, threat modeling e SBOM;
- reliability, RTO/RPO, SLI/SLO, error budget, failover e degraded mode;
- observability, metrics, logs, traces, alerting e synthetic monitoring;
- testing, characterization, contract, mutation e property-based testing;
- legacy, Strangler Fig, Branch by Abstraction, seam, shadow comparison e reconciliation;
- architecture evolution, fitness function, drift, technical debt e review trigger;
- TCO, cost driver, unit economics, rate/usage optimization e cost per useful outcome;
- AI-ready repository, context engineering, issue-driven development e verification oracle;
- agent governance, delegation contract, verification bundle, autonomy matrix e specialist gate;
- AI runtime architecture, grounding, RAG, model boundary, structured output, prompt injection ed eval;
- One-Man Project, WIP, decision throughput, continuity e attention budget;
- Production Readiness, launch boundary, Accepted Risk, blocker, Designed/Codified/Verified/Monitored e PRR.

Il glossario non trasforma invece ogni nome di prodotto o vendor citato nel testo in una voce enciclopedica: definisce i termini necessari a comprendere le decisioni del libro.

### Indice finale delle fonti

Il libro possedeva già lo stesso meccanismo usato in `data.analyst.today`: la build genera automaticamente un **Indice delle fonti** a partire dagli URL realmente presenti nel corpo dei capitoli, con label, dominio e capitolo di provenienza.

Questo è intenzionalmente generato dalla source of truth e non mantenuto come seconda lista manuale, così non può divergere silenziosamente dal manoscritto.

Nel build di questa candidate l'indice raccoglie **234 URL esterni distinti presenti nel corpo dei capitoli**.

Il gate di reachability, che ha scope più ampio del solo indice reader-facing e include anche governance/reference, ha controllato **248 URL esterni distinti su 38 domini**:

- 240 raggiungibili normalmente;
- 8 access-controlled/transient, tutte pagine OpenAI che restituiscono HTTP 403 al checker automatico;
- 0 hard `404/410`;
- 0 URL malformati.

## Build e QA

La modifica agli apparati è stata sottoposta all'intera pipeline, non soltanto a un render locale.

Il build validato ha prodotto:

- **31 capitoli**;
- **271 file Markdown** nel corpo;
- **40 tabelle**;
- **3.175 code block**;
- **29 heading di casi reali**;
- DOCX con **35/35 header di tabella ripetuti**;
- PDF con **1.588 pagine e 325 bookmark**;
- EPUB con **262 documenti XHTML** rilevati dall'inspector;
- artifact inspection: **PASS**.

Editorial lint e reference gate risultano verdi; non sono stati rilevati nuovi errori meccanici ad alta confidenza.

## Posizione degli apparati finali

Glossario, indice degli artefatti, guida alle fonti, indice dei casi reali e indice delle fonti sono assemblati **prima dei Capitoli 29 e 30**.

La scelta preserva la chiusura deliberata del libro:

```text
apparati di consultazione
→ Capitolo 29 — Il timone resta a noi
→ Capitolo 30 — I Dieci comandamenti della Software Architecture nell'era dell'AI
```

La frase finale resta quindi:

> **L'AI può scrivere il codice. Il timone resta a noi.**

## Stato del capstone

RC2 non modifica la verità operativa di Example Software Industries / Order Operations.

La Production Readiness Review resta:

```text
PRR-OO-001
NO-GO — evidence closure required
```

La release candidate del libro non viene usata per inventare readiness del prodotto simulato.

## Relazione con RC1

`v1.0.0-rc2` sostituisce `v1.0.0-rc1` come candidate consigliata per la lettura finale, perché include il nuovo glossario completo negli asset distributivi.

RC1 resta immutata come snapshot storico della candidate precedente.
