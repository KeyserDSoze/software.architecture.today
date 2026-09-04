# Software Architecture Today — v1.0.0-rc3

Questa release candidate è una **preview editoriale** pensata per valutare il nuovo ritmo del libro prima di estendere la revisione all'intero manoscritto.

## Obiettivo della RC3

Rispetto a RC2, i **Capitoli 0–9** hanno ricevuto un pass editoriale *prose-first* mirato a ridurre l'effetto “lista della spesa” senza perdere la natura operativa del libro.

La revisione non elimina liste, tabelle o blocchi strutturati per principio. Mantiene invece la struttura quando serve davvero a consultare o riusare il contenuto — esercizi, checklist, matrici, procedure, template, contratti, esempi di policy e artefatti — e converte in prosa le micro-liste che stavano sostituendo il ragionamento.

L'obiettivo è ottenere un libro tecnico che continui a funzionare come riferimento, ma che nel corpo dei capitoli si legga maggiormente come un libro: problema, conseguenza, trade-off, decisione ed evidenza devono emergere come un filo argomentativo, non come una successione di keyword.

## Copertura della revisione

In questa candidate il nuovo trattamento editoriale è stato applicato a:

- Capitolo 0 — Al timone;
- Capitolo 1;
- Capitolo 2;
- Capitolo 3;
- Capitolo 4;
- Capitolo 5;
- Capitolo 6;
- Capitolo 7;
- Capitolo 8;
- Capitolo 9.

I **Capitoli 10–30 non hanno ancora ricevuto lo stesso pass prose-first** e restano sostanzialmente allo stato editoriale della RC2. Questa asimmetria è intenzionale: RC3 serve precisamente a raccogliere feedback sul nuovo stile prima di applicarlo al resto del libro.

## Cosa osservare durante la lettura

Il feedback più utile riguarda soprattutto:

- se la lettura è più fluida e meno simile a documentazione o slide espanse;
- se abbiamo mantenuto abbastanza liste nei punti in cui aiutano davvero la scansione;
- se i paragrafi risultano più autorevoli e descrittivi senza diventare prolissi;
- se il rapporto tra prosa, callout, code block, tabelle e checklist è equilibrato;
- se la densità visiva del PDF è migliorata;
- se qualche sezione è stata compressa troppo e avrebbe bisogno di tornare più strutturata.

## Principio editoriale applicato

La regola usata per i primi dieci capitoli è:

> **Ogni lista deve guadagnarsi il diritto di essere una lista.**

La prosa viene preferita per spiegare cause, conseguenze, semantica, trade-off e reasoning. Le liste restano quando gli elementi sono realmente paralleli, devono essere verificati uno per uno o costituiscono un artefatto riutilizzabile.

## QA

Il contenuto dei Capitoli 0–9 è già passato attraverso la pipeline completa dopo le riscritture: normalizzazione editoriale e delle fonti, lint strutturale/fattuale, lint editoriale, controllo delle reference, build DOCX/PDF/EPUB e artifact inspection.

La RC3 viene ricostruita nuovamente dal commit che aggiorna questo manifest, in modo che gli asset pubblicati siano prodotti e verificati dalla stessa CI della release.

## Apparati finali

RC3 conserva gli apparati introdotti in RC2: glossario finale esteso, indice degli artefatti, guida alle fonti/reference, indice dei casi reali e indice automatico delle fonti.

## Stato del capstone

La revisione stilistica non cambia la verità operativa di Example Software Industries / Order Operations. La Production Readiness Review resta `NO-GO — evidence closure required` finché le evidenze richieste non vengono chiuse.

## Relazione con RC2

`v1.0.0-rc3` non sostituisce ancora RC2 come “testo editoriale definitivo” dell'intero libro: è la candidate consigliata per **valutare il nuovo stile nei Capitoli 0–9** e fornire feedback prima della revisione 10–30.

RC1 e RC2 restano immutate come snapshot precedenti.
