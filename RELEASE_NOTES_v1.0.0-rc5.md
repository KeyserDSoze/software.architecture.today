# Software Architecture Today — v1.0.0-rc5

Questa release candidate rappresenta la **prima revisione editoriale prose-first completa dell'intero libro**, dal front matter al Capitolo 30.

## Perché RC5

RC4 era una preview intenzionalmente limitata al Capitolo 0, usata per stabilizzare il criterio editoriale. Quel criterio è stato poi applicato capitolo per capitolo al resto del manoscritto.

La regola adottata è semplice:

> **Il libro racconta e argomenta. Liste, tabelle, diagrammi e blocchi strutturati intervengono soltanto quando aiutano davvero a capire, confrontare, verificare o riutilizzare qualcosa.**

Una seconda regola è emersa durante la revisione:

> **Anche una successione di paragrafi da una sola frase può essere una lista della spesa senza bullet.**

Per questo il lavoro non si è limitato a rimuovere elenchi. Sono stati rivisti ritmo, continuità, densità dei paragrafi, passaggi causali e sequenze di domande o micro-affermazioni.

## Scope editoriale

La revisione copre:

- front matter;
- Capitoli 0–30;
- casi ESI e Campaign Launchpad;
- sezioni di sintesi ed esercizi;
- artefatti narrativi collegati al capstone quando necessario per mantenere coerenza temporale e semantica.

Le liste sono rimaste intenzionalmente quando svolgono una funzione reale, per esempio:

- checklist operative;
- contratti e template riutilizzabili;
- scale di autonomia;
- mappe decisionali;
- matrici comparative;
- esercizi;
- artefatti di readiness e verification;
- i Dieci comandamenti del Capitolo 30.

## Cosa cambia nella lettura

La nuova versione riduce in modo sostanziale il ritmo da documentazione o slide espanse. I concetti vengono sviluppati più spesso come sequenze causali:

```text
problema
→ decisione
→ conseguenza
→ trade-off
→ evidence
→ review trigger
```

Questo vale in particolare per pattern, sistemi distribuiti, cloud, security, reliability, observability, testing, legacy, refactoring, cost architecture, repository AI-ready, issue-driven development, agent governance e runtime AI.

## Capstone ESI

Il capstone continua a evolvere lungo il libro, ma la revisione preserva una distinzione importante fra:

- baseline narrativa del capitolo;
- snapshot cumulativo vivo degli artefatti nel repository.

Non sono stati retrodatati artifact evoluti e non sono stati inventati outcome production mancanti.

La Production Readiness Review canonica resta:

```text
PRR-OO-001
NO-GO — evidence closure required
```

Order Operations non viene promosso artificialmente a production-ready per ottenere un finale narrativo più comodo.

## Capitoli finali

Il Capitolo 28 è stato ricomposto attorno a una tesi unica su comprensione funzionale, profondità tecnica, judgment, systems thinking, agent governance e crescita delle capability.

Il Capitolo 29 — **Il timone resta a noi** — resta la chiusura narrativa del libro.

Il Capitolo 30 mantiene intenzionalmente la forma di lista: i Dieci comandamenti sono il condensato finale dei principi sviluppati nel manoscritto.

L'ultima frase visibile del libro resta esattamente:

> **L'AI può scrivere il codice. Il timone resta a noi.**

## QA

La candidate viene pubblicata soltanto dopo il passaggio completo della pipeline:

- editorial normalization;
- source normalization;
- lint strutturale e fattuale;
- full-manuscript editorial lint;
- external reference reachability;
- build Markdown/DOCX/PDF;
- build EPUB;
- artifact inspection;
- upload degli artifact validati.

## Cosa valutare in RC5

Questa è la candidate da leggere dall'inizio alla fine per valutare la nuova voce editoriale complessiva. Il feedback più utile riguarda fluidità, densità delle pagine, equilibrio fra prosa e strutture operative, sezioni ancora troppo frammentate o troppo dense e coerenza del tono fra i capitoli.

RC1–RC4 restano snapshot storici immutati del percorso editoriale.