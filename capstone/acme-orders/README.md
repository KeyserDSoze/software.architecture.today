# Acme Orders

> **Capstone simulato/composito di Software Architecture Today.**

Acme Orders non è soltanto un esempio narrativo.

Da questo punto del libro è un progetto persistente che cresce capitolo dopo capitolo.

I capitoli raccontano **perché** una decisione viene presa. Questa directory conserva **lo stato corrente** del progetto dopo che le decisioni sono state accumulate.

## Regola del capstone

Ogni capitolo può modificare Acme Orders soltanto quando introduce una nuova informazione, un nuovo requisito, una nuova capability o un trade-off che giustifica il cambiamento.

Non anticipiamo l'architettura finale.

> **Il progetto deve evolvere perché cambia il contesto, non perché il libro deve mostrare una tecnologia.**

## Evoluzione fin qui

### Capitolo 1 — Prima iterazione

Acme Orders nasce come strumento interno per rendere visibili ordini problematici e ridurre il tempo necessario agli operatori per individuarli.

### Capitolo 2 — Foundation

Vengono esplicitati problema, outcome, attori, scope, vincoli, functional behavior, acceptance criteria e domande aperte.

Artefatti:

- Problem & Outcome Brief;
- Functional Scope Map / analisi funzionale.

### Capitolo 3 — System thinking

Il progetto viene osservato come parte di un sistema più grande: utenti, Orders, Payments, Shipping, database e dipendenze esterne.

Artefatto:

- Architecture Context Map.

### Capitolo 4 — Decisioni

La strategia iniziale di lettura rimane un lookup live sul database operativo invece di introdurre subito un read model asincrono.

Artefatto:

- ADR iniziale con trigger di revisione.

### Capitolo 5 — Confini

Orders, Payments e Shipping acquistano responsabilità e ownership logiche distinte.

Artefatto:

- Component Responsibility Map.

### Capitolo 6 — Quality attributes

Vengono esplicitati latency, availability, recovery, security, operability, cost e non-goal.

Decisioni deliberate:

- niente Redis senza un requisito che lo giustifichi;
- niente active-active multi-region senza un requisito che ne paghi il costo.

Artefatto:

- Non-Functional Requirements Card.

### Capitolo 7 — Pattern

Vengono adottati soltanto pattern che risolvono forze già presenti. Altri vengono rinviati o rifiutati.

### Capitolo 8 — Topologia

Acme Orders resta, per ora, un **modular monolith**.

La separazione logica è considerata reale anche senza separazione di deployment.

Payments e Shipping hanno trigger espliciti che potrebbero giustificare una futura estrazione.

## Struttura prevista

```text
capstone/acme-orders/
  README.md
  docs/
    functional-analysis.md
    requirements.md
    architecture-context.md
    nfr.md
    adr/
  src/
  tests/
  infra/
```

Le directory `src`, `tests` e `infra` verranno introdotte quando il percorso del libro arriverà al punto in cui esiste abbastanza foundation per costruire codice significativo.

Non creeremo cartelle vuote per fingere avanzamento.

## Cosa deve rimanere sincronizzato

Quando il progetto cambia, dobbiamo chiederci se cambiano anche:

- problem e outcome;
- analisi funzionale;
- glossario;
- requisiti;
- confini e ownership;
- ADR;
- API contract;
- data ownership;
- NFR;
- failure mode;
- threat model;
- observability;
- testing strategy;
- deployment;
- runbook.

Il codice è soltanto una delle rappresentazioni del progetto.

## Obiettivo finale

Alla fine del libro Acme Orders deve essere un progetto reale e navigabile, con:

- applicazione funzionante;
- test;
- documentazione;
- decision log;
- contratti;
- infrastruttura;
- security controls;
- observability;
- deployment e rollback;
- production readiness;
- integrazione AI quando sarà giustificata dal contesto.

Il lettore deve poter confrontare la prima versione con quella finale e vedere **non soltanto che cosa è stato aggiunto, ma perché l'architettura è cambiata**.