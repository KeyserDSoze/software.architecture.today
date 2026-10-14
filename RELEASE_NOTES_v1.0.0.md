# Software Architecture Today — v1.0.0

**Prima edizione stabile** del libro open source *Software Architecture Today — Progettare software, cloud e sistemi agentici nell'era dell'AI*.

Questa release segna la conclusione del percorso di revisione e validazione delle release candidate RC1–RC6: il libro è pubblicato come **v1.0.0**, non come prerelease.

## Cosa contiene la prima edizione

Il manoscritto è completo dal **Capitolo 0 al Capitolo 30** (31 capitoli), compresi front matter, glossario, apparati finali, indice degli artefatti e guida alle fonti.

Il filo conduttore è che l'AI riduce il costo di alcune attività di execution, ma non sostituisce il ragionamento architetturale, la comprensione funzionale, la valutazione dei trade-off e la responsabilità sulle decisioni.

Il libro comprende:
- una revisione narrativa *prose-first* dell'intero manoscritto;
- discussioni di progettazione, qualità, sicurezza, reliability, cloud, testing, observability, costi, governance degli agenti e sistemi AI;
- un percorso progressivo attraverso l'azienda **fittizia** Example Software Industries (ESI) e il capstone Order Operations, con analisi funzionale, ADR, contratti, test e artefatti operativi;
- fonti e riferimenti verificabili, con distinzione esplicita fra esempi simulati e casi reali.

**Nota sul capstone:** la Production Readiness Review di Order Operations rimane `NO-GO — evidence closure required`. La pubblicazione stabile del *libro* non dichiara pronto per la produzione l'applicativo simulato.

## Dalla RC6 alla versione stabile

Il manoscritto non introduce nuovi capitoli o riscritture rispetto alla RC6. Questa versione promuove la candidate validata a **prima edizione stabile** e rende la pubblicazione ufficiale nella sezione Releases.

Il repository comprende inoltre i materiali di presentazione `slides/SLIDE_PLAN.md` e `slides/SPEAKER_NOTES.md`; sono disponibili nel sorgente GitHub, non come asset allegati alla release.

## Formati da scaricare

Gli allegati prodotti dalla pipeline sono:
- `software-architecture-today.pdf` — lettura e stampa;
- `software-architecture-today.epub` — e-reader;
- `software-architecture-today.docx` — revisione e consultazione in Word.

## Verifiche di pubblicazione

La release viene prodotta esclusivamente dopo l'esito positivo dei controlli automatici: normalizzazione editoriale e delle fonti, lint strutturale e fattuale, editorial lint completo, raggiungibilità delle fonti esterne, build di Markdown/DOCX/PDF ed EPUB, ispezione degli artefatti e caricamento dei formati verificati.

Le release candidate precedenti restano disponibili per la tracciabilità del percorso editoriale.

> **L'AI può scrivere il codice. Il timone resta a noi.**
