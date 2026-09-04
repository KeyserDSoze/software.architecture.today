# Evidence audit — Capitoli 9–24

Data review: **2026-09-04**.

Questo documento chiude il pass consolidato di evidence sui Capitoli 9–24. Non è parte della reading order: governa la relazione tra i claim del manoscritto e le fonti già citate nei capitoli.

Il criterio applicato è lo stesso usato per i Capitoli 0–8 e per gli audit dedicati 25–30:

```text
claim
→ fonte adeguata al tipo di claim
→ limite della fonte
→ formulazione proporzionata
```

Regole trasversali:

- standard/RFC per semantics normative;
- documentazione ufficiale per capability e comportamento documentato;
- engineering blog/postmortem per esperienza dell'organizzazione che racconta il caso;
- paper/research per risultati empirici;
- guidance vendor come guidance contestuale, non come legge universale;
- ESI/Order Operations resta scenario fittizio/composito;
- un caso reale non diventa automaticamente benchmark o causalità generale.

Le URL complete restano vicine ai claim nel manoscritto e vengono consolidate dal build nell'**Indice delle fonti**. Questo audit registra soprattutto **che cosa le fonti autorizzano a sostenere e che cosa no**.

---

## Capitolo 9 — API e contratti

Fonti principali:

- RFC 9110 — HTTP Semantics;
- RFC 9457 — Problem Details for HTTP APIs;
- RFC 6455 — WebSocket Protocol;
- documentazione ufficiale gRPC, GraphQL e AsyncAPI;
- Microsoft Learn — API design, RESTful Web API design e Web API implementation.

Supportano:

- differenza tra semantics HTTP e convenzioni applicative;
- proprietà di metodi, status code e representation;
- Problem Details come formato standardizzato per error detail HTTP;
- capability e modelli di interazione di gRPC, GraphQL, WebSocket e AsyncAPI;
- necessità di progettare compatibility, idempotency, pagination, error model e limiti come parte del contratto.

Non supportano:

```text
REST è sempre la scelta migliore
GraphQL/gRPC/WebSocket sono superiori in assoluto
un OpenAPI/schema completo equivale a semantica completa
```

Le URL `*.example` usate negli esempi di payload sono placeholder didattici e **non fonti**.

---

## Capitolo 10 — I dati sono architettura

Fonti principali:

- PostgreSQL 18 — MVCC, indexes, partitioning, high availability/replication;
- Microsoft Learn — data-store selection e data models;
- Redis Docs — cache-aside;
- Stripe Engineering — online migrations;
- GitHub Engineering — `gh-ost` / online schema migration.

Supportano:

- semantics e capability PostgreSQL citate nel testo;
- differenza tra workload/data model e scelta del datastore;
- cache-aside come pattern con conseguenze di invalidation/staleness;
- migrazioni online come problema operativo reale e non mera DDL;
- esempi reali di migrazione schema a scala elevata.

Non supportano:

```text
PostgreSQL è il database corretto per ogni workload
cache-aside è sempre preferibile
la tecnica Stripe/GitHub va copiata tale e quale in ESI
```

I requisiti e le decisioni di Order Operations restano simulati.

---

## Capitolo 11 — Sistemi distribuiti

Fonti principali:

- Microsoft Learn — Retry, Idempotent Consumer, Pub/Sub, Competing Consumers, Choreography, Sequential Convoy, Transactional Outbox, Saga, Compensating Transaction;
- AWS Builders' Library / Well-Architected — safe retries, timeout, retry limiting, backoff/jitter;
- Uber Engineering — dead-letter/reprocessing, exactly-once processing e push platform.

Supportano:

- partial failure, timeout e retry come proprietà da progettare esplicitamente;
- idempotency come requisito per retry/duplicate delivery in contesti appropriati;
- differenze tra code, pub/sub e stream;
- outbox, saga e compensazione come pattern con trade-off;
- casi reali in cui ordering, duplicate, reprocessing e delivery semantics sono problemi concreti.

Non supportano:

```text
exactly-once è una proprietà universale end-to-end
ogni distributed workflow richiede Saga
ogni write + event richiede outbox
l'architettura Uber è il target di ESI
```

---

## Capitolo 12 — Cloud Architecture

Fonti principali:

- Microsoft Learn — Azure Architecture Center, landing zone, container-service selection, Service Bus, PostgreSQL Flexible Server, managed identity, Bicep, App Service/WebJobs e mission-critical guidance;
- AWS Well-Architected e Builders' Library;
- AWS case study dacadoo su VM/Kubernetes/serverless.

Supportano:

- workload fit prima della scelta del servizio;
- landing zone, identity, networking, deployment topology e IaC come concerns architetturali;
- differenze di controllo/operability fra modelli di compute;
- capability documentate dei servizi citati;
- un caso reale in cui una migrazione di runtime ha prodotto risultati economici/operativi nel contesto dell'organizzazione descritta.

Non supportano:

```text
cloud-native significa Kubernetes
managed service è sempre più economico
serverless è universalmente superiore
il risultato percentuale del case study dacadoo è trasferibile a ESI
```

---

## Capitolo 13 — Security by Design

Fonti principali:

- NIST SP 800-218 — Secure Software Development Framework;
- OWASP ASVS;
- Microsoft Learn — threat modeling/STRIDE, security principles, identity/access, App Service e Key Vault guidance;
- Cloudflare postmortem/case report sull'incidente Okta.

Supportano:

- secure development come processo lungo il lifecycle;
- verification requirements OWASP come riferimento strutturato;
- STRIDE/threat modeling come strumenti per esplorare minacce e trust boundary;
- least privilege, identity, secret/data protection e secure design come concerns espliciti;
- un caso reale che mostra il valore di defense in depth e contenimento nel contesto raccontato da Cloudflare.

Non supportano:

```text
un Threat Model rende sicuro il sistema
STRIDE copre ogni classe di minaccia
ASVS è una certificazione del prodotto ESI
il caso Cloudflare prova una strategia universale
```

**Versioning note:** il manoscritto usa la versione **finale** pubblicata di NIST SP 800-218 (v1.1). Eventuali draft successivi non vengono trattati come standard finali senza revisione esplicita.

---

## Capitolo 14 — Reliability e resilienza

Fonti principali:

- Google SRE Book / Workbook — SLO, error budget, monitoring e production practices;
- Microsoft Azure Well-Architected Reliability — maturity, health modeling, degradation, monitoring e service-specific reliability guidance;
- AWS Well-Architected — retry limiting;
- GitHub Availability Reports;
- Cloudflare outage postmortem.

Supportano:

- SLI/SLO/error budget come strumenti per rendere la reliability decisionabile;
- health model, graceful degradation, fault isolation e recovery come proprietà distinte;
- valore di postmortem e incident evidence;
- casi reali di cascading failure e service degradation.

Non supportano:

```text
un singolo SLO globale descrive tutta la reliability
error budget è una licenza a consumare indisponibilità
i target SLO/RTO/RPO ESI sono benchmark di settore
un postmortem dimostra causalità oltre il caso raccontato
```

I report GitHub 2026 vengono trattati come case evidence dell'organizzazione, non come benchmark.

---

## Capitolo 15 — Observability

Fonti principali:

- OpenTelemetry — primer, signals, specification, metrics/logs/traces, semantic conventions;
- Google SRE — monitoring distributed systems e workbook monitoring;
- Microsoft Learn — Application Insights e Azure Monitor OpenTelemetry.

Supportano:

- distinzione fra metrics, logs e traces;
- telemetry correlation e semantic conventions come strumenti di interoperabilità;
- monitoring e alerting orientati a segnali utili;
- capability documentate di Application Insights/Azure Monitor.

Non supportano:

```text
OpenTelemetry risolve automaticamente l'observability
più telemetry significa più comprensione
avere dashboard significa avere un Observability Contract verificato
```

L'**Observability Contract** è un artefatto del libro/ESI, non uno standard OpenTelemetry.

---

## Capitolo 16 — Testing Architecture

Fonti principali:

- Microsoft Learn — workload testing, .NET testing, ASP.NET testing, code coverage e mutation testing;
- Google Testing Blog — test sizes e limiti dell'eccesso di end-to-end testing;
- Pact — contract testing e differenza da functional testing;
- OWASP ASVS;
- Meta Engineering — LLM-assisted bug finding/mutation-testing case studies e flakiness.

Supportano:

- scelta del test layer in funzione della property/risk;
- code coverage come misura strutturale, non prova sufficiente di qualità;
- contract test e functional test come domande diverse;
- flakiness come problema reale di affidabilità della suite;
- mutation/fault injection come strumenti per verificare la forza dei test;
- casi reali in cui LLM sono stati usati per supportare attività di testing.

Non supportano:

```text
la test pyramid è una legge universale
100% coverage = confidence
100% mutation score è l'obiettivo corretto
un test generato dall'AI è indipendente dall'implementazione che ha letto
i risultati Meta si trasferiscono automaticamente a ESI
```

---

## Capitolo 17 — Legacy e comprensione

Fonti principali:

- Microsoft Learn/Azure Architecture — Strangler Fig e modernization guidance;
- AWS Prescriptive Guidance — Strangler Fig;
- GitHub Engineering — Rails migration e altri casi di modernization/incremental change;
- Martin Fowler — Strangler Fig e articoli/fragments sul legacy.

Supportano:

- migrazione incrementale/coexistence come strategia reale;
- seams e characterization come strumenti per ridurre rischio;
- differenza fra comprensione del comportamento corrente e redesign;
- casi reali di migrazione progressiva.

Non supportano:

```text
Strangler Fig è sempre la strategia corretta
il comportamento legacy osservato è automaticamente requisito target
un articolo di Fowler è una specifica normativa
la migrazione GitHub è una recipe universale
```

La scala **Found → Inferred → Observed → Confirmed** è un costrutto del libro.

---

## Capitolo 18 — Refactoring nell'era dell'AI

Fonti principali:

- Microsoft Learn — safe deployments, Anti-Corruption Layer, Strangler Fig e Copilot app modernization;
- AWS — Branch by Abstraction;
- GitHub Engineering — feature flags, migration, persistent-data/schema transformations e server-side hooks;
- OpenRewrite — documentation ufficiale.

Supportano:

- small batch, feature flag, coexistence e rollback come meccanismi di change safety;
- branch by abstraction/anti-corruption layer come pattern di migrazione;
- repository-wide transformations/codemod come capability reale;
- casi reali di migrazione progressiva e conversione dati.

Non supportano:

```text
feature flag rende sicuro qualunque cambiamento
codemod/OpenRewrite implica correttezza semantica
AI modernization elimina la necessità di characterization/evidence
```

Il **Refactoring Safety Plan** è un artefatto del libro.

---

## Capitolo 19 — Architecture Evolution

Fonti principali:

- Thoughtworks — *Building Evolutionary Architectures* e fitness-function guidance;
- AWS Architecture Blog — cloud fitness functions;
- ArchUnit;
- Microsoft Azure Well-Architected — workload review, automation e architect ongoing support;
- GitHub Engineering — SERVICEOWNERS, on-call culture e engineering principles.

Supportano:

- fitness function come meccanismo per proteggere proprietà durante l'evoluzione;
- architecture test/automation come capability concreta;
- ownership e feedback loop come elementi di governance;
- review periodica come pratica utile per decisioni che possono scadere.

Non supportano:

```text
ogni qualità architetturale è automatizzabile
una fitness function verde dimostra production readiness
Thoughtworks/AWS definiscono uno standard normativo universale
```

L'**Architecture Fitness Checklist** ESI è un costrutto del libro.

---

## Capitolo 20 — Costi e decisioni

Fonti principali:

- Microsoft Azure Well-Architected Cost Optimization — principles, cost model, rates e allocation;
- FinOps Framework — unit economics, allocation, architecting/workload placement;
- Uber Engineering — CPU scaling, data-platform efficiency, artifact storage e altri case study di cost optimization.

Supportano:

- costo come dimensione architetturale e non mera fattura cloud;
- cost model, allocation e unit economics come capability di governance;
- workload placement e rate optimization come decisioni contestuali;
- casi reali di ottimizzazione infrastrutturale.

Non supportano:

```text
cost per resource = TCO
cost per token = cost per useful outcome
una percentuale Uber è trasferibile a ESI
FinOps prescrive una singola architettura
```

I numeri ESI restano simulati.

---

## Capitolo 21 — AI-ready repository

Fonti principali:

- GitHub Docs — repository/custom instructions, Copilot coding-agent practices e responsible use;
- OpenAI — Introducing Codex, Codex agent loop, How OpenAI uses Codex;
- `agents.md` come formato/documentazione di instruction file.

Supportano:

- coding agent che usa repository context, istruzioni persistenti e tool;
- valore di setup riproducibile, verification path e repository instructions;
- permission/context boundaries come parte del workflow agentico;
- AGENTS.md come meccanismo reale di istruzioni repository-locali.

Non supportano:

```text
AGENTS.md rende automaticamente il repository AI-ready
un agente che può eseguire un comando è autorizzato a farlo
il workflow interno OpenAI/GitHub è obbligatorio per ESI
```

La **Repository Map** è un artefatto del libro.

---

## Capitolo 22 — Issue-driven development

Fonti principali:

- GitHub Docs — coding agent task practices, agent overview, rationale/approvals, issue templates e issue creation/update;
- GitHub Blog — coding-agent issue workflows;
- OpenAI — How OpenAI uses Codex.

Supportano:

- issue/task come unità reale di delega per coding agent;
- importanza di scope, acceptance, context e review;
- workflow reali in cui agenti lavorano su issue e pull request;
- approval/rationale come meccanismi disponibili in specifici prodotti/workflow.

Non supportano:

```text
ogni issue è automaticamente un buon execution contract
issue closed = outcome verificato
un agent-generated PR elimina la necessità di review
```

L'**Execution Work Item** è una formalizzazione del libro, non uno standard GitHub.

---

## Capitolo 23 — Manager di agenti

Fonti principali:

- OpenAI Agents SDK — agents, handoffs, human-in-the-loop e tracing;
- OpenAI — *A practical guide to building agents*;
- Microsoft Agent Framework — orchestration e human-in-the-loop;
- GitHub Docs — responsible use, code review e review degli output Copilot.

Supportano:

- agent orchestration, handoff, tool use, tracing e human approval come capability reali;
- multi-agent workflow come pattern disponibile, non obbligatorio;
- necessità di review, permission e human-in-the-loop in contesti appropriati.

Non supportano:

```text
più agenti = più qualità
secondo agente = evidence indipendente automaticamente
handoff tecnico = trasferimento di accountability
capability = permission = authority
```

**Agent Delegation Contract**, **Agent Verification Bundle** e **AI Autonomy Matrix** sono artefatti di governo del libro/ESI.

---

## Capitolo 24 — AI dentro l'architettura

Fonti principali:

- Microsoft Learn — AI technology overview, RAG prompt engineering/evaluation, responsible AI e built-in evaluators;
- NIST AI 600-1 — Generative AI Profile;
- OWASP — LLM Prompt Injection Prevention Cheat Sheet;
- OpenAI — Structured Outputs, prompt-injection guidance e trustworthy third-party evaluations;
- Uber Engineering — Genie, Enhanced Agentic-RAG e Michelangelo evolution case studies.

Supportano:

- model boundary, grounding, tool use, structured output, fallback ed evaluation come concerns distinti;
- prompt injection come threat concreta nei sistemi LLM/tool-using;
- evaluation come processo che deve collegarsi a dataset, metriche e failure mode;
- casi reali di AI support/copilot e di evoluzione di retrieval/agentic-RAG.

Non supportano:

```text
grounding = RAG = vector database
structured output = semantic correctness
RAG è necessario per ogni AI feature
un eval dataset implica model quality verificata
un case study Uber prova la stessa architettura per ESI
```

L'**AI Feature Contract** è un artefatto del libro.

---

# Conclusione del pass 9–24

Il pass considera i Capitoli **9–24 reviewati** rispetto a:

- adeguatezza del tipo di fonte;
- distinzione standard/documentazione/case study/guidance;
- separazione ESI ↔ casi reali;
- limitazione dei claim quantitativi al contesto originale;
- distinzione capability ↔ recommendation ↔ authority;
- distinzione documento/configurazione ↔ evidence verificata;
- presenza di una fonte primaria o autorevole per i claim tecnici principali.

Questo stato **non** significa che ogni URL resterà raggiungibile per sempre. La reachability viene controllata separatamente dalla CI e le fonti time-sensitive devono essere ricontrollate vicino alla pubblicazione.

Regola finale:

> **Il libro può usare una fonte per rendere verificabile un'affermazione; non può usare la reputazione della fonte per evitare di dichiarare i limiti dell'affermazione.**