# Book Architecture — Software Architecture Today

> Questo documento è intenzionalmente **living**. Definisce il percorso didattico e le regole strutturali del libro, ma non congela il numero definitivo di sezioni o la forma finale di ogni capitolo.

## Obiettivo della struttura

Il libro deve evitare due errori opposti.

Il primo è diventare un'enciclopedia di argomenti tecnici: API, database, cloud, sicurezza, microservizi, agenti e così via, tutti corretti ma scollegati.

Il secondo è diventare un manifesto sull'AI con poca sostanza di software engineering.

La progressione deve rimanere riconoscibile:

```text
responsabilità
→ problema
→ sistema
→ decisioni
→ design
→ contratti
→ dati
→ distribuzione
→ operabilità
→ evoluzione
→ agenti
→ produzione
→ professione
```

L'AI attraversa il libro. Non viene confinata agli ultimi capitoli.

## Il mondo enterprise del libro: ESI

Il libro usa una grande azienda interamente fittizia:

> **Example Software Industries S.p.A. — ESI**

ESI è una software product company con più business unit:

```text
Engineering Software
Commerce & Operations
Payments & Risk
Marketing Technology
Mobile Products
Data & AI
Platform Engineering & Cloud
Corporate Systems
```

Il front matter introduce l'azienda prima dei capitoli tecnici:

- `front_matter/001_example_software_industries.md`;
- `front_matter/002_tradeoffs_not_shortcuts.md`.

ESI serve a mostrare che Software Architecture non è soltanto scelta di strutture software.

Una decisione vive dentro esigenze aziendali differenti:

- Product vuole valore e time-to-market;
- Engineering vuole comprensibilità ed evolvibilità;
- Security vuole ridurre rischio e blast radius;
- Operations vuole sistemi diagnosticabili e recuperabili;
- Platform vuole standardizzazione e leverage;
- Finance/FinOps vuole costi sostenibili;
- Legal/Compliance introduce obblighi non negoziabili;
- Sales e Customer Success portano commitment e clienti strategici;
- Leadership decide quale rischio aziendale sia accettabile.

Il lavoro architetturale rende questi trade-off visibili.

> **L'architettura non elimina il compromesso. Impedisce che il compromesso rimanga nascosto.**

## Un compromesso ESI per capitolo

Ogni capitolo deve contenere almeno un compromesso significativo legato al tema del capitolo.

Non deve essere una scenetta artificiale ripetuta meccanicamente.

Il ragionamento deve però rendere leggibili, quando pertinenti:

```text
Esigenza
→ perché dobbiamo decidere

Tensione
→ quali obiettivi legittimi sono in conflitto

Decisione
→ che cosa scegliamo adesso

Costo accettato
→ che cosa non massimizziamo

Quality floor
→ che cosa non possiamo compromettere

Guardrail
→ come limitiamo il rischio

Evidence
→ su cosa basiamo la scelta

Trigger
→ quando rivaluteremo la decisione
```

Regola fondamentale:

> **Un trade-off accetta un costo consapevole per ottenere un beneficio prioritario. Una scorciatoia nasconde un costo e spera che non presenti il conto.**

Il libro può accettare:

- meno availability per ridurre complessità;
- meno autonomia per ridurre costo operativo;
- più latency per ottenere consistency più forte;
- meno generalità per aumentare semplicità;
- meno automazione per proteggere accountability.

Non può usare il compromesso come scusa per:

- ignorare requisiti normativi;
- perdere dati senza accettazione esplicita del rischio;
- eliminare verification necessaria;
- violare tenant isolation;
- nascondere technical debt;
- dichiarare production-ready una demo;
- delegare accountability all'AI.

Formula ricorrente:

> **Compromesso sì. Qualità inconsapevolmente degradata no.**

Il registro dei compromessi vive in:

- `capstone/example-software-industries/COMPROMISE_LEDGER.md`.

## Il capstone principale: Order Operations

Il progetto principale del libro è **Order Operations**, prodotto simulato della business unit Commerce & Operations di ESI.

Il capstone non compare soltanto nel manoscritto.

Ha una directory persistente:

```text
capstone/example-software-industries/products/order-operations/
```

I capitoli spiegano **perché** le decisioni cambiano.

Il capstone conserva **lo stato corrente** del progetto.

Il principio di evoluzione è:

> **Il progetto deve evolvere perché cambia il contesto, non perché il libro deve mostrare una tecnologia.**

Progressione possibile:

```text
problem framing
→ analisi funzionale
→ system context
→ decisioni
→ boundaries
→ NFR
→ pattern
→ topology
→ API
→ data ownership
→ distributed behavior
→ cloud deployment
→ security
→ reliability
→ observability
→ testing
→ refactoring
→ cost
→ AI integration
→ production readiness
```

Non conosciamo in anticipo l'architettura finale.

Questa è una caratteristica del capstone, non una mancanza.

## Analisi funzionale come competenza condivisa

Business analyst, product manager e domain expert rimangono specializzazioni importanti.

Ma il libro non accetta il silo secondo cui soltanto l'analista debba conoscere realmente il comportamento del prodotto.

Developer, tech lead e architect devono essere in grado almeno di:

- leggere un'analisi funzionale;
- comprendere attori, journey, business rule, stati e transizioni;
- individuare ambiguità;
- contribuire alla definizione dei requisiti;
- produrre una prima analisi funzionale quando serve;
- distinguere semantica del prodotto da soluzione tecnica.

> **L'analisi può avere uno specialista. La comprensione del prodotto non può avere un unico proprietario.**

## Evidenze e casi reali

ESI è finzione didattica.

Non sostituisce le evidenze.

Il libro alterna:

### Scenario ESI

Serve a mostrare evoluzione, decisioni e compromessi end-to-end.

### Casi reali documentati

Servono a confrontare il metodo con sistemi, incidenti e decisioni realmente descritti da organizzazioni affidabili.

Fonti preferite:

- standard e RFC;
- documentazione ufficiale;
- Microsoft Learn e Azure Architecture Center;
- AWS Well-Architected e Builders' Library;
- Google Cloud Architecture Framework e Google SRE;
- NIST;
- OWASP;
- CNCF;
- OpenTelemetry;
- paper originali;
- postmortem ed engineering blog dell'organizzazione coinvolta;
- autori tecnici riconosciuti quando appropriato.

Le regole complete vivono in:

- `reference/SOURCE_POLICY.md`;
- `reference/RESEARCH_WORKFLOW.md`;
- `SOURCE_FACTUAL_AUDIT.md`.

Dal Capitolo 9 il workflow è esplicitamente source-first per i claim che richiedono evidenza.

I capitoli precedenti ricevono un evidence pass retroattivo prima della release candidata.

---

# Parte I — Al timone

Questa parte stabilisce il modello mentale.

## Capitolo 0 — Al timone

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

Compromesso ESI:

> più autonomia degli agenti vs comprensione, blast radius e accountability.

## Capitolo 1 — Il software è cambiato. Il problema no.

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

Order Operations viene introdotto come primo prodotto ESI seguito nel libro.

Compromesso ESI:

> velocità di delivery vs comprensione sufficiente del problema.

## Capitolo 2 — Prima del codice

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
- Foundation Before Execution;
- analisi funzionale come competenza condivisa.

Artefatti principali:

- **Problem & Outcome Brief**;
- **Functional Scope Map**.

Compromesso ESI:

> completezza dell'analisi vs velocità di apprendimento.

## Capitolo 3 — Pensare per sistemi

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

Compromesso ESI:

> freshness e completezza della vista vs availability, latency e semplicità operativa.

---

# Parte II — Decisioni e design

## Capitolo 4 — Che cos'è davvero Software Architecture

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

Compromesso ESI:

> lookup live vs read model asincrono.

## Capitolo 5 — Dalle feature ai confini

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

Compromesso ESI:

> infrastruttura condivisa vs ownership e confini logici forti.

## Capitolo 6 — Qualità prima della tecnologia

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
- cost;
- fit before fashion.

Tesi:

> **Gli aggettivi non sono requisiti.**

Artefatto principale: **Non-Functional Requirements Card**.

Compromesso ESI:

> performance/availability vs costo e complessità operativa, con quality floor esplicito.

## Capitolo 7 — Pattern senza religione

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

Compromesso ESI:

> robustezza e flessibilità vs complexity debt.

---

# Parte III — Contratti, dati e distribuzione

## Capitolo 8 — Il monolite non è il nemico

Temi:

- monolith;
- modular monolith;
- microservices;
- team boundaries;
- deployability;
- failure isolation;
- operational cost;
- microservices by default.

Compromesso ESI:

> autonomia e isolation vs costo della distribuzione.

## Capitolo 9 — API e contratti

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

Compromesso ESI:

> automatizzare presto le action API vs definire prima semantica, authorization, audit e idempotenza.

## Capitolo 10 — I dati sono architettura

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

Il compromesso ESI dovrà emergere dal contesto reale del capitolo, non essere deciso a priori.

## Capitolo 11 — Sistemi distribuiti

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

---

# Parte IV — Cloud, security e operabilità

## Capitolo 12 — Cloud Architecture

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

## Capitolo 13 — Security by Design

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

## Capitolo 14 — Reliability e resilienza

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

## Capitolo 15 — Observability

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

## Capitolo 16 — Testing Architecture

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

---

# Parte V — Cambiare sistemi esistenti

## Capitolo 17 — Legacy e comprensione

Temi:

- repository sconosciuti;
- tribal knowledge;
- dipendenze obsolete;
- database condivisi;
- coupling;
- AI-assisted exploration;
- architecture map;
- characterization test.

## Capitolo 18 — Refactoring nell'era dell'AI

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

## Capitolo 19 — Architecture Evolution

Temi:

- evolutionary architecture;
- fitness functions;
- architecture tests;
- technical debt;
- compatibility;
- incremental migration;
- observability as feedback.

Artefatto principale: **Architecture Fitness Checklist**.

## Capitolo 20 — Costi e decisioni

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

---

# Parte VI — AI-native software engineering

## Capitolo 21 — AI-ready repository

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

## Capitolo 22 — Issue-driven development

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

## Capitolo 23 — Manager di agenti

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

## Capitolo 24 — AI dentro l'architettura

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

## Capitolo 25 — One-Man Project

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

---

# Parte VII — Portare il sistema nel mondo reale

## Capitolo 26 — Production Readiness

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

## Capitolo 27 — Casi end-to-end

Almeno tre percorsi completi:

1. prodotto piccolo / one-man project;
2. sistema enterprise brownfield;
3. sistema AI-native.

I casi devono mostrare evoluzione nel tempo e cambiamenti di decisione quando cambiano requisiti e vincoli.

Order Operations fornisce il filo enterprise principale, ma non deve essere l'unico caso del libro.

---

# Parte VIII — Il mestiere che cambia

## Capitolo 28 — L'architect del 2030

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

## Capitolo 29 — Il timone resta a noi

Il Capitolo 29 è la chiusura argomentativa del libro.

Riprende il percorso senza introdurre nuove tecnologie e chiude il cerchio aperto nel Capitolo 0:

```text
execution
→ decisione
→ verifica
→ responsabilità
```

Qui si chiudono in prosa outcome, analisi funzionale, decision system, evidence, AI authority, compromessi aziendali e responsabilità professionale.

Il Capitolo 29 non contiene il decalogo: deve poter terminare come capitolo autonomo, con il proprio arco narrativo completo.

## Capitolo 30 — I Dieci comandamenti della Software Architecture nell'era dell'AI

Il Capitolo 30 è un capitolo autonomo e volutamente breve.

Non introduce nuove tecnologie, nuovi claim o nuovi framework.

Comprende soltanto il decalogo finale, scritto dopo che il lettore ha già incontrato la sostanza dietro ogni principio.

Non comparirà prima come struttura didattica esplicita.

Il tono può essere più leggero, ironico e goliardico del resto del libro, senza trasformare i comandamenti in battute vuote.

**Il Capitolo 30 deve essere letteralmente l'ultima cosa del manoscritto principale.**

Nulla — afterword, appendice, esercizio, nota editoriale o altro contenuto narrativo — viene dopo i Dieci comandamenti nel manoscritto principale.

---

# Regola di revisione della struttura

Un capitolo rimane nella struttura soltanto se risponde ad almeno una di queste funzioni:

- introduce un modello mentale necessario;
- insegna una decisione ricorrente;
- spiega un failure mode significativo;
- costruisce una competenza necessaria per i capitoli successivi;
- introduce un artefatto operativo utile;
- permette un caso o esercizio che migliora la capacità di giudizio;
- fa evolvere in modo significativo lo scenario ESI o un caso reale documentato.

Inoltre ogni capitolo deve essere revisionato con queste domande:

1. Qual è il compromesso principale?
2. Qual è il quality floor?
3. Quali guardrail lo proteggono?
4. Quali claim richiedono evidenza?
5. Order Operations o un altro caso rende il concetto più concreto?
6. Abbiamo distinto chiaramente scenario simulato e caso reale?
7. L'AI cambia davvero qualcosa in questa decisione o la stiamo aggiungendo artificialmente?

Se due capitoli svolgono la stessa funzione, vanno uniti.

Se un capitolo è soltanto un catalogo di tool, va ripensato.

Se un compromesso è soltanto una scusa per abbassare la qualità, va riscritto.