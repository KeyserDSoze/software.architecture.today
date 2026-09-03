## Architettura come sistema di decisioni

A questo punto possiamo tornare alla definizione iniziale e renderla più concreta.

Un'architettura sana non è soltanto un insieme di decisioni corrette.

È anche un **sistema che rende possibile prendere, comunicare, verificare e rivedere decisioni nel tempo**.

Questo sistema può essere leggero.

Non richiede un Architecture Review Board per ogni modifica.

Richiede però alcune capacità.

### 1. Rendere visibile ciò che conta

Le decisioni importanti devono emergere dal rumore.

Se ogni dettaglio è documentato allo stesso livello, le decisioni architetturali spariscono.

Se nulla è documentato, rimangono soltanto nel codice e nella memoria delle persone.

Serve una selezione.

Una domanda utile è:

> “Se una persona entra nel progetto tra un anno, quali scelte deve capire per non danneggiare accidentalmente il sistema?”

Quelle sono ottime candidate per ADR, architecture docs o guardrail espliciti.

### 2. Collegare decisioni e requisiti

Una scelta senza il requisito che la giustifica tende a diventare dogma.

Per esempio:

> “Tutti i servizi devono essere asincroni.”

Perché?

Se la risposta originale era isolare un workload specifico, generalizzare la decisione a tutto il sistema è un errore.

Ogni decisione dovrebbe conservare il legame con:

- problema;
- ASR;
- vincoli;
- trade-off.

Così possiamo capire se il ragionamento è ancora valido.

### 3. Distinguere policy da decisione locale

Alcune scelte devono essere consistenti a livello di organizzazione.

Per esempio:

- identity provider;
- gestione secrets;
- baseline di observability;
- criteri minimi di security;
- formati standard di audit.

Altre possono essere locali al team.

Se centralizziamo tutto, rallentiamo.

Se decentralizziamo tutto, frammentiamo.

L'architettura deve quindi chiarire **dove l'autonomia è desiderata e dove serve coerenza**.

### 4. Creare guardrail, non soltanto documenti

Una decisione importante può essere protetta da controlli automatici.

Per esempio:

- architecture test;
- lint rule;
- policy as code;
- contract test;
- schema validation;
- CI check;
- dependency rule.

Se decidiamo che un modulo non può dipendere direttamente da un altro dominio, possiamo documentarlo.

Ma possiamo anche verificarlo automaticamente.

Questo trasforma parte dell'architettura da intenzione a **vincolo eseguibile**.

Ne parleremo più avanti nei capitoli su testing ed evolutionary architecture.

### 5. Osservare il sistema reale

Le decisioni devono incontrare la produzione.

Possiamo decidere che una cache ridurrà il carico.

Poi scoprire che il hit rate è basso.

Possiamo decidere che una queue assorbirà picchi.

Poi scoprire che aumenta troppo la latency end-to-end.

Possiamo decidere che un servizio isolerà i failure.

Poi scoprire che tutti i servizi dipendono dallo stesso database.

L'architettura deve quindi ricevere feedback da:

- metriche;
- incidenti;
- costi;
- deployment;
- support tickets;
- tempi di sviluppo;
- failure reali.

> **Un'architettura che non riceve feedback dal sistema reale diventa rapidamente una teoria sul sistema.**

### 6. Sapere quando rivalutare

I trigger di revisione completano il ciclo.

```text
requisito
→ decisione
→ implementazione
→ osservazione
→ trigger
→ rivalutazione
```

Questo è molto diverso da una governance statica.

La decisione non viene scolpita nella pietra.

Viene resa abbastanza esplicita da poter essere messa in discussione quando cambiano le condizioni.

### Architecture after implementation

Un bad pattern frequente è costruire prima e disegnare dopo.

Il diagramma finale descrive ciò che è emerso.

Può essere utile per documentare un legacy system.

Ma non va confuso con il processo architetturale.

Se le decisioni importanti sono avvenute implicitamente durante l'implementazione, il diagramma successivo non le rende intenzionali retroattivamente.

> **Descrivere una struttura dopo che è emersa non equivale ad averne governato la formazione.**

### Architecture by committee

L'errore opposto è pensare che più persone approvano una scelta, più essa sia architetturalmente valida.

Un processo con cinque meeting e dodici firme può produrre una decisione mediocre.

La governance deve migliorare:

- qualità del contesto;
- confronto delle alternative;
- comprensione del rischio;
- ownership.

Se aggiunge soltanto attesa, non sta facendo architettura.

### Architecture by title

Non serve avere il titolo di Software Architect per prendere decisioni architetturali.

Un developer che modifica un contratto pubblico, introduce una nuova dipendenza trasversale o cambia ownership del dato sta prendendo una decisione architetturale, indipendentemente dal job title.

Allo stesso modo, un architect che produce soltanto diagrammi senza comprendere implementazione, operazioni e business può incidere molto poco sull'architettura reale.

Il libro parlerà quindi di **competenza architetturale**, non soltanto di ruolo.

### Decision latency

Esiste anche un costo nel non decidere.

Se una scelta importante rimane ambigua mentre più agenti o team continuano a implementare, ciascuno riempirà il vuoto con un'interpretazione locale.

La decision latency può trasformarsi in semantic divergence.

Per questo non dobbiamo solo evitare decisioni premature.

Dobbiamo anche riconoscere quando il momento di decidere è arrivato.

### Il sistema decisionale nell'era degli agenti

Con più agenti autonomi, il bisogno cresce.

Un agente può leggere:

- ADR;
- architecture boundaries;
- policy;
- contract;
- test;
- stop condition.

Questi elementi diventano una forma di **governance leggibile dalle macchine**.

L'obiettivo non è costruire una prigione di regole.

È evitare che ogni task ricominci da zero la discussione sulle decisioni già prese.

Quando il contesto cambia, aggiorniamo la decisione.

Finché non cambia, il sistema deve poterla applicare con coerenza.

> **L'architettura migliore non è quella che prende tutte le decisioni centralmente. È quella che rende chiaro quali decisioni devono essere condivise, quali possono essere locali e come capire quando una scelta va rivista.**