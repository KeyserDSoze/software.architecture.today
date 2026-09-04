# Software Architecture Today

Un libro open source sulla **Software Architecture nell'era dell'AI**, scritto da **Alessandro Rapiti**.

L'idea di partenza è semplice:

> **Il software non è diventato facile. È diventato più facile produrre software.**

L'intelligenza artificiale abbassa rapidamente il costo di molte attività di execution: scrivere codice, creare test, esplorare repository, generare configurazioni, documentare, fare refactoring, costruire prototipi e preparare infrastruttura.

Questo non elimina il bisogno di software engineering. Sposta il collo di bottiglia.

Quando l'execution diventa più abbondante, aumentano il valore e il rischio delle decisioni che vengono prima e intorno al codice:

- capire il problema;
- comprendere il comportamento funzionale del prodotto;
- definire confini e responsabilità;
- esplicitare requisiti e vincoli;
- scegliere tra alternative;
- progettare failure mode e operabilità;
- governare sicurezza, dati e costi;
- verificare ciò che viene prodotto;
- mantenere accountability anche quando l'esecuzione è delegata ad agenti.

La tesi ricorrente del libro è:

> **Nell'era dell'AI il codice costa meno, ma le decisioni sbagliate costano di più.**

## Che cosa non è questo libro

Non è un catalogo di cloud service.

Non è un manuale di design pattern.

Non è un libro sui microservizi.

Non è un corso su TypeScript o C#.

Non è un manuale per imparare a scrivere prompt.

Tecnologie, pattern, linguaggi e strumenti servono per rendere concrete le decisioni. Il centro del libro rimane il ragionamento architetturale: **quale problema stiamo risolvendo, quali vincoli contano, quali alternative abbiamo, che cosa paghiamo e come sappiamo se il sistema funziona davvero**.

## Il professionista al timone

Gli strumenti vengono spesso chiamati *Copilot*. La metafora usata in questo libro è volutamente diversa:

> **Sii il pilota, non il copilota.**

L'AI può proporre, generare, cercare, implementare, testare, confrontare, analizzare, documentare e criticare.

La direzione, il contesto, il giudizio, la supervisione e la responsabilità devono restare umani.

Un buon indicatore operativo è questo:

> **Se, davanti a un errore, la nostra giustificazione è “lo ha scritto l'AI”, abbiamo probabilmente delegato troppo.**

## L'analisi funzionale è una competenza condivisa

Il libro rifiuta il silo secondo cui soltanto l'analista debba conoscere davvero il comportamento del prodotto.

Business analyst, product manager e domain expert restano specializzazioni preziose. Ma developer, tech lead e architect che prendono decisioni sul sistema devono avere almeno una visione d'insieme delle funzionalità e devono saper:

- leggere un'analisi funzionale;
- ricostruire attori, flow, business rule, stati ed eccezioni;
- individuare ambiguità;
- parlare con domain expert usando un linguaggio condiviso;
- produrre una prima analisi funzionale quando serve;
- distinguere semantica del prodotto da soluzione tecnica.

> **L'analisi può avere uno specialista. La comprensione del prodotto non può avere un unico proprietario.**

Il Capitolo 2 introduce il **Functional Scope Map** come artefatto vivo accanto al Problem & Outcome Brief.

## Example Software Industries: il mondo fittizio del libro

Il libro usa una grande azienda enterprise interamente inventata:

> **Example Software Industries S.p.A. — ESI**

ESI è una software product company con più business unit:

- Engineering Software;
- Commerce & Operations;
- Payments & Risk;
- Marketing Technology;
- Mobile Products;
- Data & AI;
- Platform Engineering & Cloud;
- Corporate Systems.

Azienda, persone, clienti, numeri e incidenti ESI sono simulati/compositi e servono a mostrare come le decisioni tecniche cambiano quando entrano in gioco esigenze aziendali differenti.

La presentazione dello scenario è nel front matter:

- `front_matter/001_example_software_industries.md`;
- `front_matter/002_tradeoffs_not_shortcuts.md`.

ESI non sostituisce i casi reali. I casi reali presenti nel libro vengono dichiarati come tali e collegati a fonti verificabili.

## Un compromesso per capitolo

Ogni capitolo rende visibile almeno un compromesso significativo nello scenario ESI, quando pertinente.

Il compromesso rende leggibili:

```text
esigenza
→ tensione
→ scelta
→ costo accettato
→ quality floor
→ guardrail
→ evidence
→ trigger di revisione
```

Il punto non è insegnare a “fare meno qualità”.

> **Un trade-off accetta un costo consapevole per ottenere un beneficio prioritario. Una scorciatoia nasconde un costo e spera che non presenti il conto.**

Per questo distinguiamo fra:

- qualità che vogliamo ottimizzare;
- qualità che accettiamo di rendere meno ottimali;
- qualità non negoziabili;
- guardrail che impediscono al compromesso di degradare oltre il limite accettato.

La regola editoriale è:

> **Compromesso sì. Qualità inconsapevolmente degradata no.**

I compromessi del libro sono tracciati in:

- `capstone/example-software-industries/COMPROMISE_LEDGER.md`.

## Order Operations: il capstone diventato un progetto vero

Il capstone principale del libro è **Order Operations**, un prodotto simulato della business unit Commerce & Operations di ESI.

Non compare soltanto come esempio nei paragrafi. Ha una directory persistente:

```text
capstone/example-software-industries/products/order-operations/
```

I capitoli raccontano perché cambiano requisiti e decisioni; la directory del capstone conserva lo stato corrente del progetto e la storia delle decisioni che lo hanno portato lì.

Order Operations contiene, tra gli altri:

- analisi funzionale e requisiti;
- architecture context e ADR;
- NFR e quality model;
- API contract e data ownership;
- failure model e reliability architecture;
- threat model e security controls;
- testing e observability architecture;
- cloud/deployment artifacts;
- codice applicativo ed executable fitness checks;
- agent governance e AI feature contract;
- production-readiness review.

La regola è:

> **Il progetto evolve perché cambia il contesto, non perché il libro deve mostrare una tecnologia.**

Il capstone non viene chiuso con un successo narrativo inventato: la Production Readiness Review conserva gli blocker reali dello scenario e resta `NO-GO` finché l'evidence richiesta non è disponibile.

## Evidenze e fonti

Le affermazioni tecniche significative devono essere verificabili.

Il libro preferisce:

- standard e RFC;
- documentazione ufficiale;
- Microsoft Learn e Azure Architecture Center;
- AWS Well-Architected Framework e Builders' Library;
- Google Cloud Architecture Framework e Google SRE;
- NIST, OWASP, CNCF e OpenTelemetry;
- paper originali;
- postmortem ed engineering blog dell'organizzazione coinvolta;
- autori tecnici riconosciuti quando appropriato.

La documentazione dei vendor è una fonte importante, non un oracolo universale. Le raccomandazioni vengono lette dentro requisiti e trade-off del contesto.

Le regole e gli audit sono in:

- `reference/SOURCE_POLICY.md`;
- `reference/RESEARCH_WORKFLOW.md`;
- `SOURCE_FACTUAL_AUDIT.md`;
- `reference/CHAPTERS_000_008_EVIDENCE.md`;
- `reference/CHAPTERS_009_024_EVIDENCE.md`;
- audit dedicati dei capitoli 25–30.

La copertura evidence è stata completata su **tutti i capitoli 0–30** prima della preparazione del release candidate.

## Apparati finali

Il manoscritto include anche un livello reader-facing di riferimento:

- `reference/001_glossario.md` — glossario dei termini ricorrenti;
- `reference/002_indice_artefatti.md` — mappa degli artefatti operativi del libro;
- `reference/003_guida_fonti_e_reference.md` — guida alla lettura di standard, documentazione, research, case study ed ESI;
- indice generato dei casi reali;
- indice generato delle fonti esterne.

La review editoriale finale è documentata in `EDITORIAL_AUDIT.md`.

## Un seguito metodologico

`software.architecture.today` nasce come seguito metodologico di [`data.analyst.today`](https://github.com/KeyserDSoze/data.analyst.today).

Ne conserva alcuni principi editoriali:

- Markdown come source of truth;
- capitoli composti da file numerati e revisionabili indipendentemente;
- separazione esplicita tra casi reali documentati e casi simulati/compositi;
- fonti vicine ai claim che sostengono;
- esercizi orientati a decisioni, critica, failure analysis e produzione di artefatti;
- audit editoriale e factual/source audit prima della release;
- build riproducibile dei formati distributivi.

Non ne replica i contenuti. Il dominio, gli esempi e il vocabolario operativo sono specifici della Software Architecture.

## Principi di lavoro

Il libro applica al proprio processo lo stesso metodo che propone ai lettori:

**Prima capire, poi costruire.**

**Prima sincronizzare il pensiero, poi parallelizzare l'esecuzione.**

**Delegare execution, non responsabilità.**

**Documentation is part of the architecture.**

**Un diagramma rappresenta l'architettura. Non è l'architettura.**

**Fit before fashion.**

**Compromesso sì. Qualità inconsapevolmente degradata no.**

## Struttura editoriale

La source of truth rimane il repository.

```text
software.architecture.today/
├── README.md
├── BOOK_MANIFESTO.md
├── BOOK_ARCHITECTURE.md
├── SOURCE_FACTUAL_AUDIT.md
├── EDITORIAL_AUDIT.md
├── book.yml
├── front_matter/
├── chapters/                 # Capitoli 0–30
├── capstone/
│   └── example-software-industries/
│       ├── COMPROMISE_LEDGER.md
│       └── products/
│           └── order-operations/
├── reference/
└── scripts/
```

I **Dieci comandamenti della Software Architecture nell'era dell'AI** costituiscono il Capitolo 30 e chiudono deliberatamente il contenuto principale del libro.

## Stato

Il manoscritto è completo nei **31 capitoli, dal Capitolo 0 al Capitolo 30**.

Prima della release candidate sono stati completati:

- evidence/source audit su tutto l'arco 0–30;
- glossario e apparati finali;
- review editoriale corpus-wide con gate riproducibili;
- controllo di raggiungibilità delle reference esterne;
- build e inspection di Markdown, DOCX, PDF ed EPUB;
- continuità del capstone ESI / Order Operations.

La CI deve restare verde sullo stesso commit che viene promosso a release candidate.

> **L'AI può scrivere il codice. Il timone resta a noi.**