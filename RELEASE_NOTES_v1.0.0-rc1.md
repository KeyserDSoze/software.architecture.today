# Software Architecture Today — v1.0.0-rc1

Questa è la prima release candidate completa di **Software Architecture Today**, il libro open source sulla Software Architecture nell'era dell'AI.

La release candidate porta il manoscritto all'arco editoriale completo **Capitolo 0 → Capitolo 30**, con il capstone **Example Software Industries / Order Operations**, gli apparati finali, gli audit delle fonti e i gate di build/editorial review attivi in CI.

## Contenuto della release candidate

- **31 capitoli**, dal Capitolo 0 al Capitolo 30.
- **Order Operations** come capstone persistente e coerente lungo il libro.
- Analisi funzionale trattata come competenza condivisa, non delegata a un unico ruolo.
- Quality attributes e **fit before fashion** come criterio di scelta prima della tecnologia.
- API, data architecture, distributed systems, cloud, security, reliability, observability e testing.
- Legacy modernization, refactoring AI-assisted, architecture evolution e cost engineering.
- Repository AI-ready, issue-driven development, governance degli agenti e AI dentro l'architettura.
- One-Man Project, Production Readiness, casi end-to-end e ruolo dell'architect verso il 2030.
- Capitolo 29 di sintesi e Capitolo 30 con **I Dieci comandamenti della Software Architecture nell'era dell'AI**.

## Apparati finali

La release include:

- glossario finale;
- indice degli artefatti;
- guida alle fonti e alle reference;
- indice generato dei casi reali;
- indice generato delle fonti esterne.

Gli audit interni coprono l'intero arco **0–30**, inclusa la mappa consolidata dei capitoli 9–24 che chiude il precedente gap centrale.

## Review editoriale e factual

Prima della promozione a release candidate sono stati eseguiti e resi riproducibili:

- structural/factual lint;
- editorial/mechanical lint sul corpus pubblicabile e sulla governance;
- source normalization guardrail;
- external reference reachability audit;
- targeted semantic review su assoluti, wording di source guidance e continuità del capstone;
- artifact inspection indipendente dopo la build.

La review ha trovato e corretto problemi reali, fra cui articoli/elisioni incoerenti (`endpoint`, `API`, `AI`), punteggiatura, parole duplicate, residui del vecchio capstone **Acme Orders**, una duplicazione apparente del Capitolo 17, wording obsoleto sul finale 29/30 e URL di esempio che rischiavano di contaminare l'indice delle fonti.

Il dettaglio è registrato in `EDITORIAL_AUDIT.md` e `SOURCE_FACTUAL_AUDIT.md`.

## Reference

Il controllo completo precedente alla preparazione dell'RC ha verificato **248 URL esterni distinti su 38 domini**:

- 240 raggiungibili normalmente;
- 8 risposte access-controlled/transient da pagine OpenAI al checker automatico;
- 0 hard `404/410`;
- 0 URL malformati.

Le risposte `403` non vengono considerate automaticamente né link morti né verifiche positive: restano classificate come elementi da verifica manuale/access-controlled.

## Build distributiva

La pipeline produce e ispeziona:

- Markdown;
- DOCX;
- PDF;
- EPUB.

Un build verde registrato durante la review ha prodotto, fra gli altri controlli:

- DOCX con **35/35 table header ripetuti**;
- PDF con **1.577 pagine e 325 bookmark**;
- EPUB con **262 documenti XHTML** rilevati dall'inspector;
- Chapter 30 e frase finale canonica presenti;
- artifact inspection `PASS`.

Il workflow di release ricostruisce comunque gli asset sul commit che contiene questo manifest, quindi i file allegati a `v1.0.0-rc1` devono provenire dallo stesso SHA che supera i gate finali.

## Una scelta intenzionale: nessun lieto fine inventato per ESI

La Production Readiness Review di Order Operations resta:

```text
PRR-OO-001
NO-GO — evidence closure required
```

Questo è intenzionale. La release candidate del **libro** non trasforma automaticamente il prodotto simulato in production-ready.

Il progetto conserva la distinzione:

```text
Designed ≠ Codified ≠ Verified ≠ Monitored
```

come parte della tesi del libro: evidence prima della confidence.

## Che cosa significa RC1

`v1.0.0-rc1` indica che struttura, contenuti, reference, apparati e formati distributivi sono considerati completi per una lettura da release candidate.

È ancora il momento giusto per segnalare:

- refusi sfuggiti ai gate;
- frasi ambigue o troppo assolute;
- fonti che sostengono meno del claim associato;
- problemi di impaginazione nei formati finali;
- incoerenze tra manoscritto e capstone.

La promozione da RC a release stabile deve avvenire solo dopo aver trattato gli eventuali blocker emersi dalla lettura della candidate.

> **L'AI può scrivere il codice. Il timone resta a noi.**