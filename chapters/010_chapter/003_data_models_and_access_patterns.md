## Scegliere il modello dai pattern di accesso

Una volta chiarita l'ownership, arriva una domanda inevitabile:

> **come dobbiamo memorizzare e interrogare questo dato?**

La risposta non dovrebbe partire dal nome del database.

Dovrebbe partire dal comportamento del workload.

Microsoft Azure Architecture Center suggerisce esplicitamente di valutare access pattern, relazioni, consistency, concorrenza, lifecycle, latency, scale, governance e cost prima di scegliere un data store.

Fonti:

- [Microsoft Learn — Prepare to choose a data store](https://learn.microsoft.com/azure/architecture/guide/technology-choices/data-stores-getting-started)
- [Microsoft Learn — Understand data models](https://learn.microsoft.com/azure/architecture/data-guide/technology-choices/understand-data-store-models)

La domanda quindi non è:

> PostgreSQL o MongoDB?

È:

> **quali access pattern e invarianti dobbiamo servire, e quale modello li sostiene con il miglior fit complessivo?**

## Relazionale: quando le relazioni sono parte del problema

Un database relazionale ha un fit forte quando contano:

- relazioni tra entità;
- vincoli di integrità;
- transazioni multi-row;
- query articolate;
- schema e semantica relativamente strutturati;
- tooling maturo per amministrazione e reporting.

Microsoft cita workload come order management, inventory, billing e operational reporting tra gli esempi naturali per modelli relazionali.

Questo non significa che un ordine “deve” vivere in SQL.

Significa che dobbiamo riconoscere le forze presenti.

Per Order Operations abbiamo:

```text
Order
Payment
Shipment
OperatorAssignment
Tenant
AuditEvent
```

con relazioni e vincoli che non sono dettagli accidentali.

Per esempio:

- un assignment appartiene a un ordine;
- un ordine appartiene a un tenant;
- un operatore deve essere autorizzato per quel perimetro;
- alcuni stati devono rispettare transizioni valide;
- l'audit deve poter essere ricondotto all'azione.

Un modello relazionale rimane quindi un candidato molto forte per la prima fase.

## Document: aggregati naturali e forma flessibile

Un document store può avere fit quando il principale pattern di accesso riguarda aggregati che vengono letti e scritti come unità relativamente autonome.

Esempio astratto:

```json
{
  "orderId": "ORD-42",
  "customer": {...},
  "items": [...],
  "shippingAddress": {...}
}
```

Può essere molto comodo se la forma del documento coincide bene con il boundary dell'aggregato.

Ma la flessibilità dello schema non elimina la semantica.

Se tre servizi interpretano lo stesso campo in tre modi diversi, un documento JSON non ci ha resi più flessibili.

Ci ha resi meno espliciti.

Un document database non è una scusa per evitare schema design.

Lo schema esiste comunque, anche se viene imposto più dall'applicazione che dal motore.

## Key-value: quando la domanda è “dammi il valore per questa chiave”

Un key-value store è particolarmente efficace quando il pattern dominante è semplice:

```text
key → value
```

Esempi:

- session state;
- cache;
- feature state;
- deduplication key;
- rate-limit counter;
- alcuni lookup ad altissima frequenza.

Il vantaggio nasce proprio dalla specializzazione.

Se invece abbiamo bisogno continuamente di:

- join;
- filtri dinamici;
- navigazione tra relazioni;
- aggregazioni complesse;

stiamo chiedendo al modello di risolvere un problema per cui forse non è stato scelto.

## Graph: quando la relazione è il centro

Un graph database può avere fit quando la domanda principale non riguarda soltanto entità, ma percorsi e connessioni.

Per esempio:

```text
account → device → payment method → merchant → fraud signal
```

oppure:

```text
component → depends_on → component → owned_by → team
```

Se il workload richiede traversal complessi e relazioni molto connesse, un modello graph può essere più naturale di una sequenza di join o documenti denormalizzati.

Ma anche qui vale il principio del capitolo precedente:

> conoscere un pattern non ci obbliga ad adottarlo.

Order Operations non ha oggi un problema graph sufficientemente forte da introdurre un graph database.

## Specialized store: search, time-series, vector

Alcuni workload sono abbastanza specifici da meritare un modello specializzato.

Un search index serve quando il problema è:

- full-text search;
- ranking;
- ricerca fuzzy;
- analisi testuale.

Un time-series store può essere adatto a metriche o eventi ordinati temporalmente con query di finestre e aggregazioni.

Un vector store risponde a pattern di similarity search su embedding.

Il rischio è trasformare ogni nuovo access pattern in un nuovo datastore.

Microsoft osserva che sistemi reali possono usare più modelli, ma raccomanda di combinarli quando access pattern o lifecycle divergono davvero.

La parola importante è **davvero**.

## Polyglot persistence: capacità o tassa?

Usare più data store può essere perfettamente ragionevole.

Per esempio:

```text
PostgreSQL
  → transactional source of truth

Search index
  → full-text operational search

Object storage
  → document/archive

Warehouse
  → analytics
```

Ogni store svolge un lavoro diverso.

Ma ogni nuovo datastore introduce anche:

- provisioning;
- access control;
- backup e recovery;
- observability;
- patch/upgrade o gestione managed service;
- data movement;
- schema evolution;
- competenza del team;
- failure mode;
- costi.

Quindi possiamo formulare una regola:

> **Polyglot persistence è utile quando la specializzazione del workload paga la tassa operativa della diversità.**

Non quando vogliamo usare una tecnologia per capitolo.

## Access pattern prima dello schema

Prendiamo la futura lista di ordini problematici.

Le query potrebbero essere:

```text
- ordini problematici per tenant
- ordinati per anzianità
- filtrati per categoria
- aperti da un operatore specifico
- dettaglio per orderId
```

Questi pattern influenzano:

- indice;
- ordinamento;
- partizione;
- eventuale denormalizzazione;
- pagination;
- forma del read model.

Se invece il requisito diventasse:

> “cerca qualsiasi frase nei messaggi del customer support associati agli ordini”

avremmo un access pattern diverso.

Potrebbe emergere un search index.

Non perché il sistema è cresciuto abbastanza da “meritarselo”.

Perché è cambiata la domanda.

## Il test di fit del datastore

Prima di aggiungere un nuovo data store, useremo una scheda minima:

```text
Access pattern
Quali query o write dominano?

Consistency
Quale staleness o atomicità è accettabile?

Relationships
Quali relazioni devono essere navigate o vincolate?

Scale
Quali volumi e growth pattern sono reali o stimati?

Lifecycle
Retention, archival, deletion, rebuild?

Security
Quali dati e quali boundary di accesso?

Operations
Il team sa gestire questa tecnologia?

Cost
Che costo fisso e variabile introduce?

Exit
Come migriamo se il fit cambia?
```

Questa scheda non produce automaticamente la risposta.

Ma rende molto più difficile scegliere un database perché:

> “lo usano tutti.”

## ESI: per ora PostgreSQL resta

Nel contesto corrente di Order Operations non abbiamo ancora un requisito che giustifichi un secondo datastore operativo.

Il modello relazionale continua ad avere un buon fit per:

- dati strutturati;
- relazioni;
- assignment;
- audit;
- access control;
- query operative note.

Non significa che PostgreSQL sarà l'unico store per sempre.

Significa che **oggi non esiste ancora un access pattern che paghi in modo sufficiente la complessità di aggiungerne un altro**.

Quando quel pattern emergerà, rivaluteremo.

Non prima.