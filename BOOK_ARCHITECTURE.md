# Book Architecture — Software Architecture Today

> Questo documento è intenzionalmente **living**. Definisce il percorso didattico iniziale, non congela il numero definitivo di capitoli. La struttura verrà revisionata dopo i primi capitoli pilota e durante la crescita del capstone.

## Obiettivo della struttura

Il libro deve evitare due errori opposti.

Il primo è diventare un'enciclopedia di argomenti tecnici: API, database, cloud, sicurezza, microservizi, agenti e così via, tutti corretti ma scollegati.

Il secondo è diventare un manifesto sull'AI con poca sostanza di software engineering.

La struttura deve far emergere una progressione:

```text
responsabilità
→ problema
→ sistema
→ decisioni
→ design
→ distribuzione
→ operabilità
→ evoluzione
→ agenti
→ produzione
→ professione
```

L'AI attraversa il libro. Non viene confinata agli ultimi capitoli.

## Parte I — Al timone

Questa parte stabilisce il modello mentale.

### Capitolo 0 — Al timone

Domanda centrale:

> Che cosa significa essere responsabili del software quando una parte crescente dell'execution può essere delegata?

Temi:

- execution abbondante;
- judgment;
- pilota vs copilota;
- manager di agenti;
- delegare execution, non responsabilità;
- verification without re-execution;
- stop conditions;
- deskilling;
- livelli di autonomia.

### Capitolo 1 — Il software è cambiato. Il problema no.

Domanda centrale:

> Che cosa cambia davvero quando il costo di produrre software diminuisce?

Temi:

- costo dell'execution;
- prompt-first development;
- demo-driven confidence;
- AI fatigue;
- context engineering;
- feedback loop accelerati;
- blast radius degli agenti.

### Capitolo 2 — Prima del codice

Domanda centrale:

> Quali decisioni dobbiamo prendere prima che la velocità di execution diventi un rischio?

Temi:

- problem framing;
- utenti e outcome;
- scope;
- requisiti;
- vincoli;
- MVP;
- acceptance criteria;
- Foundation Before Execution.

Artefatto principale: **Problem & Outcome Brief**.

### Capitolo 3 — Pensare per sistemi

Domanda centrale:

> Come passiamo dalla feature locale al comportamento del sistema?

Temi:

- system thinking;
- boundaries;
- dipendenze;
- feedback loop;
- failure domain;
- coupling invisibile;
- critical user journey.

Artefatto principale: **Architecture Context Map**.

## Parte II — Decisioni e design

### Capitolo 4 — Che cos'è davvero Software Architecture

Domanda centrale:

> Quali decisioni meritano attenzione architetturale?

Temi:

- decisioni difficili o costose da cambiare;
- architecturally significant requirements;
- vincoli;
- trade-off;
- one-way door e two-way door;
- ADR;
- diagramma vs decisione.

Artefatto principale: **Architecture Decision Record**.

### Capitolo 5 — Dalle feature ai confini

Temi:

- user journey;
- responsibilities;
- modularità;
- information hiding;
- cohesion;
- coupling;
- composition;
- dependency inversion;
- domain modeling.

Artefatto principale: **Component Responsibility Map**.

### Capitolo 6 — Qualità prima della tecnologia

Temi:

- non-functional requirements;
- latency;
- throughput;
- availability;
- RTO/RPO;
- consistency;
- durability;
- privacy;
- maintainability;
- operability;
- cost.

Tesi:

> Gli aggettivi non sono requisiti.

Artefatto principale: **Non-Functional Requirements Card**.

### Capitolo 7 — Pattern senza religione

Temi:

- GoF;
- enterprise integration pattern;
- resilience pattern;
- distributed pattern;
- cloud pattern;
- data pattern;
- agentic pattern;
- quando un pattern non serve;
- overengineering.

Domanda ricorrente:

> Quale problema risolve, che cosa costa e quando non dovrei usarlo?

## Parte III — Contratti, dati e distribuzione

### Capitolo 8 — Il monolite non è il nemico

Temi:

- monolith;
- modular monolith;
- microservices;
- team boundaries;
- deployability;
- failure isolation;
- operational cost;
- microservices by default.

### Capitolo 9 — API e contratti

Temi:

- HTTP;
- REST;
- RPC e gRPC;
- GraphQL;
- WebSocket;
- webhook;
- async API;
- compatibility;
- versioning;
- idempotency;
- error model;
- rate limiting.

Artefatto principale: **API Contract**.

### Capitolo 10 — I dati sono architettura

Temi:

- ownership;
- relational/document/key-value/graph;
- transazioni;
- consistency;
- replication;
- partitioning;
- indexing;
- caching;
- retention;
- schema evolution;
- migration.

Artefatto principale: **Data Ownership Map**.

### Capitolo 11 — Sistemi distribuiti

Temi:

- partial failure;
- latency;
- CAP e suoi abusi narrativi;
- messaging;
- queues;
- pub/sub;
- streaming;
- outbox;
- saga;
- retries;
- timeout;
- idempotency;
- ordering;
- eventual consistency;
- backpressure;
- orchestration vs choreography.

Artefatto principale: **Failure Mode Map**.

## Parte IV — Cloud, security e operabilità

### Capitolo 12 — Cloud Architecture

Temi:

- compute;
- container;
- Kubernetes;
- PaaS;
- serverless;
- storage;
- networking;
- load balancing;
- DNS;
- identity;
- secrets;
- autoscaling;
- IaC;
- CI/CD;
- multi-region;
- cloud appropriate vs cloud dogmatic.

Artefatto principale: **Cloud Deployment Map**.

### Capitolo 13 — Security by Design

Temi:

- identity;
- authentication;
- authorization;
- least privilege;
- secrets;
- encryption;
- threat modeling;
- supply chain;
- SBOM;
- secure SDLC;
- Zero Trust;
- prompt injection;
- data exfiltration;
- agent tool permissions.

Artefatto principale: **Threat Model**.

### Capitolo 14 — Reliability e resilienza

Temi:

- fault tolerance;
- retries;
- timeout;
- circuit breaker;
- bulkhead;
- graceful degradation;
- DR;
- backup;
- region failure;
- retry storm;
- failure-driven architecture.

### Capitolo 15 — Observability

Temi:

- logs;
- metrics;
- traces;
- correlation;
- OpenTelemetry;
- SLI/SLO;
- error budget;
- dashboard;
- alerting;
- incident response;
- postmortem.

Artefatto principale: **Observability Contract**.

### Capitolo 16 — Testing Architecture

Temi:

- unit;
- integration;
- contract;
- end-to-end;
- property-based;
- mutation;
- load;
- security;
- chaos;
- smoke;
- synthetic monitoring;
- architecture tests;
- generated-test illusion.

Artefatto principale: **Testing Strategy**.

## Parte V — Cambiare sistemi esistenti

### Capitolo 17 — Legacy e comprensione

Temi:

- repository sconosciuti;
- tribal knowledge;
- dipendenze obsolete;
- database condivisi;
- coupling;
- AI-assisted exploration;
- architecture map;
- characterization test.

### Capitolo 18 — Refactoring nell'era dell'AI

Temi:

- incremental refactoring;
- strangler;
- seams;
- branch by abstraction;
- feature flag;
- migration;
- automated transformation;
- repository-wide changes;
- blast radius;
- rollback.

Artefatto principale: **Refactoring Safety Plan**.

### Capitolo 19 — Architecture Evolution

Temi:

- evolutionary architecture;
- fitness functions;
- architecture tests;
- technical debt;
- compatibility;
- incremental migration;
- observability as feedback.

Artefatto principale: **Architecture Fitness Checklist**.

### Capitolo 20 — Costi e decisioni

Temi:

- TCO;
- fixed vs variable cost;
- idle capacity;
- cloud economics;
- egress;
- redundancy;
- observability cost;
- AI inference;
- tokens;
- caching;
- model routing;
- complexity cost;
- FinOps.

## Parte VI — AI-native software engineering

### Capitolo 21 — AI-ready repository

Temi:

- repository come contesto;
- AGENTS.md;
- architecture docs;
- conventions;
- commands;
- boundaries;
- testing rules;
- source of truth;
- documentation drift.

### Capitolo 22 — Issue-driven development

Temi:

- task AI-ready;
- objective;
- context;
- acceptance criteria;
- dependencies;
- NFR;
- edge case;
- tests expected;
- out of scope;
- definition of done.

Artefatto principale: **Agent Delegation Contract**.

### Capitolo 23 — Manager di agenti

Temi:

- specialist agents;
- shared context;
- parallelism;
- orchestrator;
- reviewer agent;
- testing agent;
- security agent;
- merge conflict;
- semantic conflict;
- stop condition;
- permissions;
- trust boundaries.

Artefatti principali:

- **Agent Verification Bundle**;
- **AI Autonomy Matrix**.

### Capitolo 24 — AI dentro l'architettura

Temi:

- LLM application;
- model gateway;
- RAG;
- tool use;
- agent;
- memory;
- evaluation;
- guardrail;
- prompt injection;
- model failure;
- cost e latency;
- fallback;
- human-in-the-loop.

### Capitolo 25 — One-Man Project

Temi:

- full-stack thinking;
- cross-functional thinking;
- giocare fuori ruolo;
- product;
- UX;
- architecture;
- development;
- cloud;
- testing;
- security;
- documentation;
- quando serve uno specialista.

Tesi:

> L'AI può ampliare il perimetro di una singola persona, ma non elimina i limiti della sua comprensione.

## Parte VII — Portare il sistema nel mondo reale

### Capitolo 26 — Production Readiness

Temi:

- security;
- monitoring;
- backup;
- DR;
- runbook;
- deployment;
- rollback;
- capacity;
- ownership;
- on-call;
- operational readiness.

Artefatto principale: **Production Readiness Review**.

### Capitolo 27 — Casi end-to-end

Almeno tre percorsi completi:

1. prodotto piccolo / one-man project;
2. sistema enterprise brownfield;
3. sistema AI-native.

I casi devono mostrare evoluzione nel tempo e cambiamenti di decisione quando cambiano requisiti e vincoli.

Il capstone principale può essere **Acme Orders**, introdotto presto e fatto crescere lungo il libro.

## Parte VIII — Il mestiere che cambia

### Capitolo 28 — L'architect del 2030

Temi:

- depth e breadth;
- leggere più linguaggi;
- deskilling;
- studiare con l'AI;
- giocare fuori ruolo;
- responsabilità;
- agent management;
- judgment;
- apprendimento continuo.

Questo capitolo non deve fare previsioni teatrali. Deve distinguere ciò che è già osservabile da ciò che rimane una possibilità.

### Capitolo finale — Il timone resta a noi

Il capitolo conclusivo riprende il percorso senza introdurre nuove tecnologie.

Deve chiudere il cerchio aperto nel Capitolo 0:

```text
execution
→ decisione
→ verifica
→ responsabilità
```

L'ultima sezione dell'ultimo capitolo sarà:

## I Dieci comandamenti della Software Architecture nell'era dell'AI

Non compariranno prima come struttura didattica esplicita.

Arriveranno quando il lettore conosce già la sostanza dietro ogni principio.

Il tono potrà essere più leggero, ironico e goliardico del resto del libro, senza trasformarli in battute vuote.

**Devono essere letteralmente l'ultima cosa del manoscritto principale.**

## Capstone incrementale

Il capstone non deve comparire soltanto alla fine.

**Acme Orders** parte da un prodotto semplice e viene riutilizzato per mostrare come cambiano le decisioni quando emergono nuovi requisiti.

Progressione possibile:

```text
MVP
→ autenticazione
→ database
→ API
→ deployment cloud
→ caching
→ queue
→ observability
→ scale
→ security
→ DR
→ AI integration
```

Ogni capitolo deve evitare di “anticipare” la soluzione finale.

L'obiettivo è mostrare che:

> **l'architettura è conseguenza del contesto, non una destinazione da raggiungere.**

## Regola di revisione della struttura

Un capitolo rimane nella struttura soltanto se risponde ad almeno una di queste funzioni:

- introduce un modello mentale necessario;
- insegna una decisione ricorrente;
- spiega un failure mode significativo;
- costruisce una competenza necessaria per i capitoli successivi;
- introduce un artefatto operativo utile;
- permette un caso o esercizio che migliora la capacità di giudizio del lettore.

Se due capitoli svolgono la stessa funzione, vanno uniti.

Se un capitolo è soltanto un catalogo di tool, va ripensato.
