# ESI — Compromise Ledger

Questo documento traccia i compromessi narrativi e architetturali usati nei capitoli di *Software Architecture Today*.

Non è una lista di scorciatoie autorizzate.

È un registro delle decisioni in cui più esigenze legittime entrano in tensione.

## Regola fondamentale

> **Un trade-off accetta un costo consapevole per ottenere un beneficio prioritario. Una scorciatoia nasconde un costo e spera che non presenti il conto.**

Nel libro useremo compromessi.

Non useremo il compromesso come giustificazione per:

- ignorare security senza accettazione esplicita del rischio;
- perdere dati senza un requisito che lo consenta;
- eliminare verification per rispettare una deadline;
- introdurre coupling inconsapevole;
- saltare observability quando serve per operare il sistema;
- nascondere technical debt;
- dichiarare production-ready ciò che è soltanto una demo;
- violare un requisito normativo o contrattuale;
- delegare accountability a un agente AI.

## Quality floor

Ogni compromesso distingue:

```text
Qualità ottimizzate
Qualità sacrificate consapevolmente
Qualità non negoziabili
Guardrail
Evidence
Trigger di revisione
```

## Template del compromesso

```text
Esigenza
Tensione
Decisione
Costo accettato
Quality floor
Guardrail
Evidence
Trigger
```

## Capitolo 0 — Al timone

**Esigenza:** aumentare la capacità di execution con agenti AI.

**Tensione:** velocità vs comprensione e accountability.

**Decisione:** delegare execution mantenendo human judgment, verification e stop condition.

**Costo accettato:** checkpoint e review riducono la massima autonomia possibile.

**Quality floor:** responsabilità, sicurezza e verificabilità non vengono delegate.

**Guardrail:** Agent Delegation Contract, Verification Bundle, escalation e permission boundary.

## Capitolo 1 — Il software è cambiato. Il problema no.

**Esigenza:** ridurre il lead time di sviluppo.

**Tensione:** velocità di generazione vs qualità del problema definito.

**Decisione:** usare l'AI per accelerare l'execution soltanto dopo avere abbastanza contesto.

**Costo accettato:** più lavoro iniziale di foundation.

**Quality floor:** outcome, vincoli e acceptance evidence restano comprensibili.

**Guardrail:** context engineering e verifica delle assunzioni.

## Capitolo 2 — Prima del codice

**Esigenza:** consegnare una prima capability di Order Operations senza analizzare indefinitamente.

**Tensione:** completezza dell'analisi vs velocità di apprendimento.

**Decisione:** definire abbastanza problem framing e analisi funzionale per la prossima decisione, lasciando esplicite le domande aperte.

**Costo accettato:** alcune decisioni vengono rimandate.

**Quality floor:** business rule critiche e semantica delle operazioni pericolose non vengono inventate dall'implementazione.

**Guardrail:** Problem & Outcome Brief, Functional Scope Map e stop condition.

## Capitolo 3 — Pensare per sistemi

**Esigenza:** dare agli operatori una vista unificata.

**Tensione:** semplicità locale della UI vs ownership e dipendenze del sistema complessivo.

**Decisione:** aggregare la vista senza fingere che Order Operations possieda ogni dato mostrato.

**Costo accettato:** il journey dipende da più fonti autorevoli.

**Quality floor:** significato, freshness e ownership devono restare distinguibili.

**Guardrail:** Architecture Context Map e failure-domain analysis.

## Capitolo 4 — Che cos'è davvero Software Architecture

**Esigenza:** fornire dati sufficientemente aggiornati alla console.

**Tensione:** semplicità operativa vs indipendenza e scalabilità di un read model dedicato.

**Decisione:** lookup live prima di introdurre un read model asincrono.

**Costo accettato:** maggiore dipendenza runtime dai dati operativi.

**Quality floor:** correctness e ownership non vengono bypassate con query arbitrarie.

**Guardrail:** ADR con conseguenze e trigger di revisione.

## Capitolo 5 — Dalle feature ai confini

**Esigenza:** evolvere Orders, Payments e Shipping senza un blocco unico.

**Tensione:** velocità locale vs chiarezza delle responsabilità.

**Decisione:** confini logici e information hiding anche nello stesso deployable/database envelope.

**Costo accettato:** adapter e contratti interni aggiungono struttura.

**Quality floor:** le business rule non vengono duplicate senza ownership.

**Guardrail:** Component Responsibility Map e dependency direction.

## Capitolo 6 — Qualità prima della tecnologia

**Esigenza:** rendere il prodotto sufficientemente reattivo e affidabile.

**Tensione:** massimizzare availability/performance vs costo e complessità operativa.

**Decisione:** niente Redis e niente active-active multi-region senza requisito che ne paghi il costo.

**Costo accettato:** rinunciamo a ottimizzazioni e ridondanze possibili.

**Quality floor:** correctness, access control e operability restano prioritarie.

**Guardrail:** Non-Functional Requirements Card e trigger misurabili.

## Capitolo 7 — Pattern senza religione

**Esigenza:** gestire variazioni e failure senza codice fragile.

**Tensione:** robustezza/riuso vs accidental complexity.

**Decisione:** adottare soltanto pattern che risolvono forze già presenti.

**Costo accettato:** rinunciamo a generalizzazioni speculative.

**Quality floor:** il sistema resta verificabile ed evolvibile.

**Guardrail:** Pattern Justification Test e test della rimozione.

## Capitolo 8 — Il monolite non è il nemico

**Esigenza:** avere boundary chiari e velocità di delivery.

**Tensione:** deployability/failure isolation indipendente vs costo della distribuzione.

**Decisione:** Order Operations resta per ora un modular monolith.

**Costo accettato:** deploy e failure domain non sono indipendenti per ogni modulo.

**Quality floor:** modularità, ownership e testabilità non vengono sacrificate.

**Guardrail:** trigger espliciti per futura estrazione e architecture constraints.

## Capitolo 9 — API e contratti

**Esigenza:** dare alla Operations UI un contratto stabile.

**Tensione:** velocità di esposizione di nuove azioni vs semantica, authorization, audit e idempotenza.

**Decisione:** esporre inizialmente capability read-oriented; rinviare refund/remediation command.

**Costo accettato:** il prodotto non automatizza ancora alcune azioni operative.

**Quality floor:** nessun comando con side effect economico viene inventato senza semantica definita.

**Guardrail:** API Contract, compatibility rules e Problem Details.

## Capitolo 10 — I dati sono architettura

**Esigenza:** offrire a Operations una vista unica senza trasferire accidentalmente l'autorità sui business fact.

**Tensione:** semplicità/performance della vista vs ownership di Orders/Payments/Shipping vs costo di sincronizzazione.

**Decisione:** PostgreSQL resta datastore operativo; Order Operations persiste soltanto dati che possiede davvero. Nessuna projection asincrona, Redis o search store senza trigger reale.

**Costo accettato:** maggiore coupling runtime verso le fonti autorevoli.

**Quality floor:** una sola autorità semantica per business fact, tenant isolation, correctness economica e migration governate.

**Guardrail:** Data Ownership Map, schema ownership, index legati ad access pattern e reconciliation per future copie.

**Evidence:** Microsoft Learn, PostgreSQL, Redis, Stripe Engineering e GitHub.

**Trigger:** workload operativo impatta il transazionale, latency non raggiunta, availability indipendente, nuovi consumer/search pattern o volume/retention cambiano.

## Capitolo 11 — Sistemi distribuiti

**Esigenza:** richiedere Payment Escalation senza dipendere dalla disponibilità runtime di Payments & Risk.

**Tensione:** latency/availability del request path vs consistenza immediata vs semplicità sincrona.

**Decisione:** `PaymentEscalation + OutboxMessage` nella stessa transaction; publisher asincrono broker-agnostico; delivery at-least-once; consumer idempotente sulla stessa `EscalationId`.

**Costo accettato:** eventual consistency, delivery state, retry/backoff/jitter, DLQ, backlog e reconciliation.

**Quality floor:** nessuna perdita silenziosa dopo commit; nessun duplicate business effect; tenant isolation e Payments ownership economica.

**Guardrail:** stable IDs, transactional outbox, bounded retry, Failure Mode Map, controlled redrive e reconciliation.

**Evidence:** Microsoft Learn, AWS Builders' Library/Well-Architected e Uber Engineering.

**Trigger:** polling insufficiente, delivery lag, DLQ frequente, ordering/stream/replay o workflow multi-step più complessi.

## Capitolo 12 — Cloud Architecture

**Esigenza:** portare Order Operations su cloud enterprise senza costruire una piattaforma più complessa del problema.

**Tensione:** standardizzazione Platform vs autonomia workload vs security vs cost vs optionality.

**Decisione:** Azure application landing zone; App Service + continuous WebJob, PostgreSQL managed, Service Bus Queue, Managed Identity, Key Vault, Monitor/Application Insights, Bicep e single region.

**Costo accettato:** Azure coupling, scaling non indipendente del publisher e nessun regional failover immediato.

**Quality floor:** durable state, identity/least privilege, backup/recovery, observability, IaC e ownership chiara.

**Guardrail:** Cloud Deployment Map, ADR, landing-zone policy, cost/recovery/IaC review.

**Evidence:** Microsoft Learn, AWS Well-Architected/Builders' Library e dacadoo case study.

**Trigger:** scale profile diversi, isolamento più forte, RTO/RPO più severi, cost curve o Platform standard cambiano.

## Capitolo 13 — Security by Design

**Esigenza:** ridurre attack surface, privilege e blast radius.

**Tensione:** private connectivity/least privilege vs semplicità, dipendenza Platform e costo.

**Decisione:** private production ingress, Entra + server-side authorization, managed identity, runtime/deployment separation, private data-plane direction e baseline security in Bicep. Nessun WAF senza Internet-facing journey.

**Costo accettato:** networking/DNS più complessi e Service Bus Premium per Private Link.

**Quality floor:** authenticated access, tenant isolation, explicit authorization, least privilege, no production secret nel repo, audit e revocation path.

**Guardrail:** Threat Model, Security Control Matrix, ADR-0003, Bicep, negative tests, RBAC review e log minimization.

**Evidence:** Microsoft Learn, NIST SSDF, OWASP ASVS e Cloudflare.

**Trigger:** public/mobile/partner ingress, incident, new sensitive data, multi-region o nuovi compliance requirement.

## Capitolo 14 — Reliability e resilienza

**Esigenza:** restare utilizzabile nei failure comuni e recuperabile nei failure più ampi senza comprare ridondanza indiscriminata.

**Tensione:** stronger availability/recovery vs cloud cost, operational complexity e delivery speed.

**Decisione:** SLO/health/error-budget + Reliability Contract; App Service >=2 zone-redundant, PostgreSQL zone-redundant HA direction, Service Bus zone redundancy, single-region recovery. Active-active multi-region resta fuori.

**Costo accettato:** capacity headroom e costo HA; region-wide disaster con recovery più lento.

**Quality floor:** committed local state protetto nei failure coperti, degraded mode truthful, security boundary preservato, restore non dichiarato senza prova.

**Guardrail:** Reliability Contract, Failure Mode Map, RTO/RPO, drills, IaC e review trigger.

**Evidence:** Google SRE, Microsoft Azure reliability docs, GitHub e Cloudflare.

**Trigger:** SLO/error-budget miss, RTO/RPO più severi, failed drill, nuova geography o cost curve.

## Capitolo 15 — Observability

**Esigenza:** misurare SLO e diagnosticare failure con sufficiente velocità.

**Tensione:** dettaglio investigativo vs ingestion/storage cost, cardinalità, minimization, sampling e alert fatigue.

**Decisione:** Observability Contract; instrumentation OpenTelemetry-compatible; Azure Monitor/Application Insights backend; metriche bounded, structured events, trace sampling governato, audit/business evidence separata, private synthetic journey.

**Costo accettato:** non conserviamo ogni dettaglio di ogni execution indefinitamente.

**Quality floor:** SLI misurabili, failure critici investigabili, correlation, niente secret/token nei normali signal, alert con owner/action e costo visibile.

**Guardrail:** cardinality budget, retention/sampling policy, alert review, bounded telemetry port, synthetic identity/data.

**Evidence:** OpenTelemetry, Google SRE e Microsoft Learn.

**Trigger:** telemetry fuori budget, investigation insufficienti, cardinality growth, alert fatigue, più runtime o nuovi retention requirement.

## Capitolo 16 — Testing Architecture

**Esigenza:** aumentare la velocità di modifica senza perdere confidenza su business invariant, security, integrazioni e recovery.

**Tensione:** confidence vs feedback speed vs environment cost vs maintenance burden. Payments & Risk vuole contract evidence forte; Security vuole negative test; Platform vuole pipeline ripetibili; Finance non vuole una seconda produzione sempre accesa.

**Decisione:** Testing Strategy a più velocità: fast local/application test, PR integration/contract, staging cloud verification, scheduled/readiness test e production synthetic/SLI. La prima suite usa `node:test` senza introdurre un framework addizionale non ancora necessario.

**Costo accettato:** non ogni commit attraversa PostgreSQL/Azure/recovery reali; alcune evidence arrivano in gate più lenti e costosi.

**Quality floor:** idempotency, tenant isolation, authorization, escalation+outbox atomicity, contract compatibility, duplicate-delivery safety, migration safety e recovery evidence non possono essere dichiarati coperti da un layer che non li attraversa.

**Guardrail:** `docs/testing-strategy.md`, Risk-to-Evidence Map, pipeline gate, flaky-test policy, coverage come signal non KPI assoluto, mutation selettiva, incident-derived regression e human review dei test AI-generated.

**Evidence:** Microsoft Azure Well-Architected testing guidance; Google Testing Blog su small/E2E e flakiness; Meta Engineering su flaky-test measurement e mutation-guided LLM testing; OWASP ASVS; Pact. Nel capstone il fast local layer è stato realmente eseguito: TypeScript build PASS, `node:test` 11/11 PASS.

**Trigger:** critical journey/threat/SLO/topology cambia, suite diventa lenta o flaky, integration gap produce incidenti, AI autonomy cresce, contract/versioning o regulatory requirement cambiano.

## Capitolo 17 e successivi

Da qui in avanti il compromise ledger viene aggiornato insieme al manoscritto.

Ogni nuovo compromesso deve mostrare come proteggiamo la qualità.

> **Compromesso sì. Qualità inconsapevolmente degradata no.**

## Collegamento con le evidenze

Un compromesso ESI è simulato, ma non deve essere arbitrario.

Quando dipende da caratteristiche reali di tecnologie, protocolli o pratiche operative, la decisione viene confrontata con:

- standard e RFC;
- documentazione ufficiale;
- paper;
- engineering blog e postmortem;
- casi reali documentati;
- misure prodotte dal capstone quando è eseguibile.

Lo scenario ci dà il contesto.

Le evidenze ci impediscono di trasformare la narrativa in opinione tecnica non verificata.