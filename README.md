# Software Architecture Today

Un libro open source sulla **Software Architecture nell'era dell'AI**, scritto da **Alessandro Rapiti**.

L'idea di partenza è semplice:

> **Il software non è diventato facile. È diventato più facile produrre software.**

L'intelligenza artificiale abbassa rapidamente il costo di molte attività di execution: scrivere codice, creare test, esplorare repository, generare configurazioni, documentare, fare refactoring, costruire prototipi e preparare infrastruttura.

Questo non elimina il bisogno di software engineering. Sposta il collo di bottiglia.

Quando l'execution diventa più abbondante, aumentano il valore e il rischio delle decisioni che vengono prima e intorno al codice:

- capire il problema;
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

## Struttura editoriale iniziale

La struttura definitiva emergerà durante la scrittura e verrà consolidata dopo i primi capitoli pilota. La source of truth rimane il repository.

```text
software.architecture.today/
├── README.md
├── BOOK_MANIFESTO.md
├── BOOK_ARCHITECTURE.md
├── book.yml
├── front_matter/
├── chapters/
│   ├── 000_chapter/
│   ├── 001_chapter/
│   └── ...
├── reference/
├── scripts/
└── build/
```

I **Dieci comandamenti della Software Architecture nell'era dell'AI** saranno deliberatamente tenuti per la parte conclusiva del libro. Non devono diventare la struttura portante dei capitoli: arriveranno soltanto alla fine, dopo che i principi saranno stati dimostrati, discussi e messi alla prova. Saranno una sintesi seria nella sostanza e volutamente goliardica nella forma: l'ultima cosa da lasciare al lettore prima di chiudere il libro.

## Stato

Il progetto è all'inizio della scrittura.

Il primo capitolo in lavorazione è:

**Capitolo 0 — Al timone**

Il suo compito non è spiegare una tecnologia. Deve stabilire il contratto del libro: che cosa cambia quando l'esecuzione può essere delegata a sistemi artificiali e perché comprensione, verifica e responsabilità diventano ancora più importanti.
