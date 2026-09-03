# Order Operations

> **Prodotto simulato/composito di Example Software Industries S.p.A.**

Order Operations è il capstone principale di *Software Architecture Today*.

Appartiene alla business unit **Commerce & Operations** di ESI.

Non è soltanto un esempio narrativo: cresce capitolo dopo capitolo e conserva qui lo stato corrente delle decisioni accumulate.

I capitoli spiegano **perché** il progetto cambia. Questa directory mostra **che cosa è diventato** dopo quelle decisioni.

## Product goal corrente

Ridurre il tempo necessario agli operatori per individuare, comprendere e gestire ordini che richiedono attenzione operativa.

Il prodotto non nasce con l'obiettivo di sostituire Orders, Payments o Shipping come authoritative source.

## Regola di evoluzione

Ogni capitolo può cambiare Order Operations soltanto quando introduce:

- una nuova informazione;
- un nuovo requisito;
- una capability;
- un vincolo;
- un failure mode;
- un cambiamento organizzativo;
- un trade-off che modifica il fit della soluzione corrente.

> **Il progetto deve evolvere perché cambia il contesto, non perché il libro deve mostrare una tecnologia.**

## Evoluzione fin qui

### Capitolo 1 — Prima iterazione

Nasce una console interna per rendere visibili ordini problematici.

### Capitolo 2 — Foundation e analisi funzionale

Vengono esplicitati problema, outcome, attori, scope, business rule, acceptance criteria e domande aperte.

L'analisi funzionale diventa conoscenza condivisa del team.

### Capitolo 3 — System thinking

La console viene osservata dentro il sistema più ampio: Orders, Payments, Shipping, identity e provider esterni.

### Capitolo 4 — Decisioni

Si preferisce inizialmente un lookup live ai dati operativi invece di introdurre subito un read model asincrono.

### Capitolo 5 — Confini

Orders, Payments e Shipping acquistano responsabilità e ownership logiche distinte.

### Capitolo 6 — Quality attributes

Vengono esplicitate priorità di correctness, security, operability, latency, availability e cost.

Non vengono introdotti Redis o active-active multi-region senza un requisito che ne giustifichi il costo.

### Capitolo 7 — Pattern

I pattern vengono adottati soltanto quando risolvono forze già presenti.

### Capitolo 8 — Topologia

Order Operations resta per ora un **modular monolith**.

La separazione logica non richiede ancora separazione di deployment.

### Capitolo 9 — API e contratti

La Operations UI riceve il primo contratto HTTP esplicito:

```text
GET /api/problematic-orders
GET /api/orders/{orderId}/operational-view
```

Non vengono ancora introdotti command endpoint di refund o remediation perché la semantica funzionale non è abbastanza definita.

### Capitolo 10 — Data architecture

Viene introdotta la prima **Data Ownership Map**.

Orders, Payments & Risk e Shipping restano authoritative owner dei rispettivi business fact.

Order Operations diventa authoritative soltanto per concetti operativi propri:

- `OperationalCase`;
- problem classification;
- operator assignment.

Il progetto mantiene PostgreSQL come datastore operativo corrente e aggiunge la prima migration SQL reale:

```text
database/migrations/001_create_operational_case.sql
```

Non vengono ancora introdotti Redis, search store o projection asincrona: le future copie dovranno avere source, freshness, reconciliation e rebuild espliciti.

## Struttura corrente

```text
order-operations/
├── README.md
├── database/
│   ├── README.md
│   └── migrations/
│       └── 001_create_operational_case.sql
└── docs/
    ├── functional-analysis.md
    ├── requirements.md
    ├── architecture-context.md
    ├── nfr.md
    ├── api-contract.md
    ├── data-ownership.md
    └── adr/
        └── 0001-live-read-before-read-model.md
```

`src/`, `tests/` e `infra/` compariranno quando il percorso del libro avrà costruito foundation sufficiente per implementation e deployment significativi.

Non creiamo directory vuote per simulare avanzamento.

La directory `database/` compare ora perché il Capitolo 10 ha prodotto la prima decisione dati sufficientemente concreta da meritare un artefatto eseguibile.

## Cosa deve rimanere sincronizzato

Quando Order Operations cambia dobbiamo verificare l'impatto su:

- problem e outcome;
- analisi funzionale;
- glossario;
- requirements;
- ownership;
- ADR;
- API contract;
- Data Ownership Map;
- schema e migration;
- NFR;
- failure model;
- threat model;
- observability;
- testing strategy;
- deployment;
- runbook.

Il codice sarà una rappresentazione importante del prodotto, ma non sarà l'unica.

## Contesto aziendale

Order Operations non decide da solo il proprio futuro.

Potrà ricevere pressioni o requisiti da:

- Payments & Risk;
- Mobile Products;
- Data & AI;
- Platform Engineering;
- Security;
- Finance / FinOps;
- Legal / Compliance;
- Sales e clienti enterprise.

Questo è intenzionale.

Nel corso del libro vogliamo vedere come una soluzione cambia quando il problema tecnico incontra il resto dell'azienda.

## Obiettivo finale

Alla fine del libro Order Operations dovrà essere un progetto navigabile e funzionante con:

- codice applicativo;
- test;
- documentazione;
- decision log;
- contratti;
- data model;
- infrastructure as code;
- security controls;
- observability;
- deployment e rollback;
- production readiness;
- eventuale integrazione AI soltanto quando giustificata dal contesto.

Il lettore deve poter confrontare le prime decisioni con il sistema finale e capire non soltanto **che cosa** è cambiato, ma **perché**.