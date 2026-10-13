# Software Architecture Today — v1.0.0-rc6

Questa release candidate aggiorna lo snapshot distribuito del progetto e aggiunge al repository i materiali per presentare i temi del libro.

## Novità rispetto a RC5

- **Piano per la presentazione:** `slides/SLIDE_PLAN.md` organizza un intervento di circa 40 minuti sulla Software Architecture nell'era dell'AI, con struttura, messaggi chiave e indicazioni visive.
- **Note per il relatore:** `slides/SPEAKER_NOTES.md` sviluppa la traccia parlata e i collegamenti fra le idee: costo dell'execution, astrazioni, comprensibilità, convenzioni e responsabilità umana.
- **Nuova candidate distribuibile:** il processo di release rigenera e verifica i formati del libro (PDF, EPUB e DOCX) dal commit di questa versione.

## Ambito editoriale

**Il manoscritto non è cambiato rispetto a v1.0.0-rc5.** La RC5 resta la revisione integrale *prose-first* dei capitoli 0–30; RC6 ne ripubblica i formati validati e include i nuovi materiali complementari nel repository.

Le slide e le note di intervento sono disponibili nel sorgente GitHub, non fra gli allegati della release.

## Qualità e pubblicazione

La pubblicazione è subordinata alla pipeline Book CI: normalizzazione editoriale e delle fonti, lint strutturale e fattuale, editorial lint integrale, verifica delle fonti esterne, generazione e ispezione dei documenti, infine upload di PDF, EPUB e DOCX.

RC1–RC5 rimangono consultabili come snapshot storici del percorso editoriale.

> **L'AI può scrivere il codice. Il timone resta a noi.**
