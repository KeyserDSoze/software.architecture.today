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

Gli strumenti vengono spesso chiamati *Copilot*. La metafora che useremo in questo libro è volutamente diversa:

> **Sii il pilota, non il copilota.**

L'AI può proporre, generare, cercare, implementare, testare, confrontare, analizzare, documentare e criticare.

La direzione, il contesto, il giudizio, la supervisione e la responsabilità devono restare umani.

Un buon indicatore operativo è questo:

> **Se, davanti a un errore, la nostra giustificazione è “lo ha scritto l'AI”, abbiamo probabilmente delegato troppo.**

## L'analisi funzionale è una competenza condivisa

Il libro rifiuta anche il silo secondo cui soltanto l'analista debba conoscere davvero il comportamento del prodotto.

Business analyst, product manager e domain expert restano specializzazioni preziose. Ma developer, tech lead e architect che prendono decisioni sul sistema devono avere almeno una visione d'insieme delle funzionalità e devono saper:

- leggere un'analisi funzionale;
- ricostruire attori, flow, business rule, stati ed eccezioni;
- individuare ambiguità;
- parlare con domain expert usando un linguaggio condiviso;
- produrre una prima analisi funzionale quando serve;
- distinguere semantica del prodotto da soluzione tecnica.

> **L'analisi può avere uno specialista. La comprensione del prodotto non può avere un unico proprietario.**

Il Capitolo 2 introduce anche il **Functional Scope Map** come artefatto vivo accanto al Problem & Outcome Brief.

## Acme Orders: un capstone che diventa un progetto vero

**Acme Orders** è il capstone simulato/composito del libro.

Non compare soltanto come esempio nei paragrafi. Ha una directory persistente:

```text
capstone/acme-orders/
```

I capitoli raccontano perché cambiano requisiti e decisioni; la directory del capstone conserva lo stato corrente del progetto.

Man mano che il libro prosegue, Acme Orders accumulerà:

- analisi funzionale;
- requisiti;
- architecture context;
- ADR;
- NFR;
- API contract;
- data ownership;
- failure model;
- threat model;
- testing strategy;
- observability;
- infrastruttura;
- codice applicativo reale;
- deployment, rollback e production readiness.

La regola è:

> **Il progetto deve evolvere perché cambia il contesto, non perché il libro deve mostrare una tecnologia.**

Alla fine il lettore dovrà poter aprire il capstone e vedere non soltanto il sistema finale, ma la storia delle decisioni che lo hanno portato lì.

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

La documentazione dei vendor è una fonte importante, non un oracolo universale. Le raccomandazioni vengono sempre lette dentro requisiti e trade-off del contesto.

Le regole editoriali sono in:

- `reference/SOURCE_POLICY.md`;
- `reference/RESEARCH_WORKFLOW.md`;
- `SOURCE_FACTUAL_AUDIT.md`.

Dal Capitolo 9 in avanti il flusso è esplicitamente **source-first** sui claim che richiedono evidenza. I capitoli 0–8 verranno sottoposti anche a un evidence pass retroattivo prima della release candidata.

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

## Struttura editoriale

La source of truth rimane il repository.

```text
software.architecture.today/
├── README.md
├── BOOK_MANIFESTO.md
├── BOOK_ARCHITECTURE.md
├── SOURCE_FACTUAL_AUDIT.md
├── book.yml
├── chapters/
├── capstone/
│   └── acme-orders/
├── reference/
├── scripts/
└── build/
```

I **Dieci comandamenti della Software Architecture nell'era dell'AI** saranno deliberatamente tenuti per la parte conclusiva del libro. Non devono diventare la struttura portante dei capitoli: arriveranno soltanto alla fine, dopo che i principi saranno stati dimostrati, discussi e messi alla prova. Saranno una sintesi seria nella sostanza e volutamente goliardica nella forma: l'ultima cosa da lasciare al lettore prima di chiudere il libro.

## Stato

La prima parte del manoscritto è già in costruzione nel repository.

Sono presenti i capitoli da **0 a 8**, dal modello mentale iniziale fino alla scelta tra monolite, modular monolith e microservizi.

Il prossimo capitolo è:

**Capitolo 9 — API e contratti**

Da questo punto il workflow di scrittura integra sistematicamente ricerca su fonti autorevoli, aggiornamento del capstone e factual/source audit.