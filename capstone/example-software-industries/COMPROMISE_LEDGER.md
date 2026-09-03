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

Ogni compromesso deve distinguere fra:

### Qualità ottimizzate

Le proprietà che vogliamo migliorare in quella decisione.

### Qualità sacrificate consapevolmente

Le proprietà che accettiamo di rendere meno ottimali entro un limite esplicito.

### Qualità non negoziabili

Le proprietà che non possono scendere sotto il livello richiesto dal contesto.

### Guardrail

I controlli che impediscono al compromesso di degradare oltre il limite accettato.

### Trigger di revisione

Le condizioni che ci dicono che il compromesso non ha più un fit sufficiente.

## Template del compromesso di capitolo

Ogni capitolo che usa ESI dovrebbe poter rispondere a queste domande:

```text
Esigenza
Chi sta chiedendo il cambiamento e perché?

Tensione
Quali obiettivi legittimi sono in conflitto?

Decisione
Che cosa scegliamo adesso?

Costo accettato
Che cosa peggiora o rimane meno ottimale?

Quality floor
Che cosa non siamo disposti a compromettere?

Guardrail
Come impediamo al costo accettato di diventare un problema incontrollato?

Evidence
Quali fonti, misure o test sostengono la decisione?

Trigger
Quando dovremo rivalutarla?
```

## Capitolo 0 — Al timone

**Esigenza:** aumentare la capacità di execution con agenti AI.

**Tensione:** velocità vs comprensione e accountability.

**Decisione:** delegare execution mantenendo human judgment, verification e stop condition.

**Costo accettato:** alcune attività richiedono checkpoint e review invece di massima autonomia.

**Quality floor:** responsabilità, sicurezza e verificabilità non vengono delegate.

**Guardrail:** Agent Delegation Contract, Verification Bundle, escalation e permission boundary.

## Capitolo 1 — Il software è cambiato. Il problema no.

**Esigenza:** ridurre il lead time di sviluppo.

**Tensione:** velocità di generazione vs qualità del problema definito.

**Decisione:** usare l'AI per accelerare l'execution soltanto dopo avere abbastanza contesto.

**Costo accettato:** spendere tempo iniziale in foundation invece di generare subito codice.

**Quality floor:** outcome, vincoli e acceptance evidence devono restare comprensibili.

**Guardrail:** context engineering e verifica delle assunzioni.

## Capitolo 2 — Prima del codice

**Esigenza:** consegnare una prima capability di Order Operations in tempi ragionevoli.

**Tensione:** completezza dell'analisi vs velocità di apprendimento.

**Decisione:** definire abbastanza problem framing e analisi funzionale per la prossima decisione, senza progettare tutto il futuro.

**Costo accettato:** alcune domande rimangono esplicitamente aperte.

**Quality floor:** business rule critiche e semantica delle operazioni pericolose non vengono inventate dall'implementazione.

**Guardrail:** Problem & Outcome Brief, Functional Scope Map e stop condition.

## Capitolo 3 — Pensare per sistemi

**Esigenza:** dare agli operatori una vista unificata.

**Tensione:** semplicità locale della UI vs ownership e dipendenze del sistema complessivo.

**Decisione:** aggregare la vista senza fingere che Order Operations possieda ogni dato mostrato.

**Costo accettato:** il journey dipende da più fonti autorevoli.

**Quality floor:** significato e ownership dei dati devono restare distinguibili.

**Guardrail:** Architecture Context Map e failure-domain analysis.

## Capitolo 4 — Che cos'è davvero Software Architecture

**Esigenza:** fornire dati sufficientemente aggiornati alla console.

**Tensione:** semplicità operativa vs indipendenza e scalabilità di un read model dedicato.

**Decisione:** lookup live prima di introdurre un read model asincrono.

**Costo accettato:** maggiore dipendenza runtime dai dati operativi.

**Quality floor:** correctness e ownership non vengono bypassate con query arbitrarie.

**Guardrail:** ADR con conseguenze e trigger di revisione.

## Capitolo 5 — Dalle feature ai confini

**Esigenza:** evolvere Orders, Payments e Shipping senza trasformare il codice in un blocco unico.

**Tensione:** velocità locale vs chiarezza delle responsabilità.

**Decisione:** confini logici e information hiding anche nello stesso deployable.

**Costo accettato:** alcuni adapter e contratti interni aggiungono struttura.

**Quality floor:** le business rule non vengono duplicate in più moduli senza ownership.

**Guardrail:** Component Responsibility Map e dependency direction.

## Capitolo 6 — Qualità prima della tecnologia

**Esigenza:** rendere il prodotto sufficientemente reattivo e affidabile.

**Tensione:** massimizzare availability/performance vs costo e complessità operativa.

**Decisione:** niente Redis e niente active-active multi-region senza requisito che ne paghi il costo.

**Costo accettato:** rinunciamo a ottimizzazioni e ridondanze che potrebbero migliorare alcuni scenari.

**Quality floor:** correctness, access control e operability restano prioritarie.

**Guardrail:** Non-Functional Requirements Card e trigger misurabili.

## Capitolo 7 — Pattern senza religione

**Esigenza:** gestire variazioni e failure senza codice fragile.

**Tensione:** robustezza e riuso vs accidental complexity.

**Decisione:** adottare soltanto pattern che risolvono forze già presenti.

**Costo accettato:** rinunciamo a generalizzazioni che potrebbero servire in futuro.

**Quality floor:** il sistema deve restare verificabile ed evolvibile.

**Guardrail:** Pattern Justification Test e test della rimozione.

## Capitolo 8 — Il monolite non è il nemico

**Esigenza:** avere boundary chiari e velocità di delivery.

**Tensione:** deployability/failure isolation indipendente vs costo della distribuzione.

**Decisione:** Order Operations resta per ora un modular monolith.

**Costo accettato:** deploy e failure domain non sono completamente indipendenti per ogni modulo.

**Quality floor:** modularità, ownership e testabilità non vengono sacrificate.

**Guardrail:** trigger espliciti per futura estrazione e architecture constraints.

## Capitolo 9 — API e contratti

**Esigenza:** dare alla Operations UI un contratto stabile.

**Tensione:** velocità di esposizione di nuove azioni vs semantica, authorization, audit e idempotenza.

**Decisione:** esporre inizialmente capability read-oriented; rinviare refund e remediation command.

**Costo accettato:** il prodotto non automatizza ancora alcune azioni operative.

**Quality floor:** nessun comando con side effect economici o customer-facing viene inventato senza semantica definita.

**Guardrail:** API Contract, compatibility rules e Problem Details.

## Capitolo 10 — I dati sono architettura

**Esigenza:** offrire a Operations una vista unica e interrogabile senza costringere l'operatore a comprendere la topologia dei domini sorgente.

**Tensione:** semplicità e performance della vista vs ownership semantica di Orders/Payments/Shipping vs costo di sincronizzazione e nuovi datastore.

**Decisione:** PostgreSQL resta per ora il datastore operativo principale; Order Operations persiste soltanto dati che possiede davvero (`OperationalCase`, classificazione e assignment) e continua a leggere i fatti autorevoli attraverso boundary espliciti. Nessuna projection asincrona, cache Redis o search store viene introdotta senza trigger reale.

**Costo accettato:** il journey mantiene maggiore coupling runtime verso le fonti autorevoli e non ottiene ancora pieno isolamento del workload di lettura.

**Quality floor:** una sola autorità semantica per business fact, tenant isolation, correctness economica, assignment concorrente deterministico, tracciabilità authoritative/derived e migration governate.

**Guardrail:** Data Ownership Map, schema ownership, index legati ad access pattern misurabili, validation/reconciliation per future copie, source timestamp per future projection e trigger di revisione.

**Evidence:** Microsoft Learn per data-store selection e data models; PostgreSQL per MVCC, index, partitioning e replication; Redis per cache-aside; Stripe Engineering e GitHub per migration online documentate.

**Trigger:** impatto del workload operativo sul transazionale, target latency non raggiunti, nuova availability indipendente, più consumer della stessa vista, nuovi search access pattern, crescita di volume/retention o freshness compatibile con una projection asincrona.

## Capitolo 11 — Sistemi distribuiti

**Esigenza:** un operatore deve poter richiedere rapidamente una Payment Escalation e Payments & Risk deve riceverla in modo affidabile anche quando il downstream è temporaneamente degradato.

**Tensione:** latency/availability del critical request path vs consistenza immediata con Payments & Risk vs semplicità di una chiamata sincrona.

**Decisione:** `PaymentEscalation` e `OutboxMessage` vengono salvati nella stessa transazione PostgreSQL; un publisher asincrono broker-agnostico consegna `OperationalCasePaymentEscalated v1` con semantica at-least-once; Payments & Risk deve rendere idempotente la stessa `EscalationId`.

**Costo accettato:** eventual consistency, stato di delivery separato, outbox, publisher, retry/backoff/jitter, DLQ, backlog monitoring e reconciliation.

**Quality floor:** nessuna perdita silenziosa dopo il local commit; nessun duplicate business effect per la stessa escalation; tenant isolation; payload minimizzato; correlation; Payments & Risk mantiene ownership economica.

**Guardrail:** stable `EscalationId` e `messageId`, transactional outbox, bounded retry, Idempotent Consumer, Failure Mode Map, DLQ ownership, controlled redrive e reconciliation.

**Evidence:** Microsoft Azure Architecture Center per Retry, Idempotent Consumer, Transactional Outbox, Saga/Choreography e Compensating Transaction; AWS Builders' Library/Well-Architected per idempotent APIs, timeout, retry budget, backoff e jitter; Uber Engineering per reprocessing/DLQ ed exactly-once delimitato nei sistemi reali.

**Trigger:** polling publisher insufficiente, delivery lag oltre il business target, DLQ frequente, bisogno di replay/stream semantics, ordering più forte, più producer/consumer, workflow economici multi-step o recovery requirement più severi.

## Capitolo 12 — Cloud Architecture

**Esigenza:** portare Order Operations su una piattaforma cloud enterprise governata senza trasformare il workload in un'infrastruttura più complessa del problema che deve risolvere.

**Tensione:** standardizzazione Platform vs autonomia del workload team vs security baseline vs semplicità operativa vs cost vs future optionality.

**Decisione:** ESI usa una Azure application landing zone; Order Operations adotta App Service + continuous WebJob, Azure Database for PostgreSQL, Service Bus Queue, Managed Identity, Key Vault, Azure Monitor/Application Insights, Bicep come IaC direction e una singola Azure region nella prima iterazione.

**Costo accettato:** maggiore coupling operativo ad Azure, scaling non indipendente del publisher, minore configurabilità rispetto ad AKS e assenza di regional failover immediato.

**Quality floor:** durable state, idempotency, identity/least privilege, secret governance, backup/recovery, observability, infrastructure intent versionato e ownership chiara fra Platform, workload team e Payments & Risk.

**Guardrail:** Cloud Deployment Map, ADR-0002, Failure Mode Map, landing-zone policy, managed identity, cost review, backup/restore exercise e IaC review.

**Evidence:** Microsoft Learn per Azure application architecture, landing zones, team topology, App Service WebJobs, container-service trade-off, PostgreSQL HA/backup, Service Bus, Managed Identity e Bicep; AWS Well-Architected e Builders' Library per trade-off/capacity; dacadoo case study per evoluzione VM→Kubernetes→serverless guidata dal contesto.

**Trigger:** scale profile divergenti fra API e worker, più background workload, container portability reale, isolation/security requirement più forte, RTO/RPO più severi, consumer topology diversa, cost curve non più adatta o nuovi standard Platform.

## Capitolo 13 — Security by Design

**Esigenza:** ridurre attack surface, privilege e blast radius prima che Order Operations venga considerato candidato alla produzione.

**Tensione:** private connectivity, identity separation e least privilege vs semplicità di sviluppo/debugging, dipendenza dalla landing zone e costo cloud.

**Decisione:** production private App Service ingress; Entra authentication + server-side authorization; managed runtime identity; runtime/deployment identity separation; private data-plane direction per PostgreSQL, Service Bus e Key Vault; secret minimization/Key Vault; threat/control traceability; prima security baseline codificata in Bicep. Nessun WAF finché non esiste un Internet-facing journey.

**Costo accettato:** private DNS/network troubleshooting più complesso, maggiore dipendenza dalle subnet/capability Platform, dev/prod parity meno immediata e **Service Bus Premium** necessario per Private Link nella topologia corrente.

**Quality floor:** authenticated production access, tenant isolation, explicit capability authorization, runtime senza broad control-plane privilege, nessun production secret nel repository, audit delle operazioni sensibili, revocation path, security control verificabili.

**Guardrail:** Threat Model, Security Control Matrix, ADR-0003, `infra/main.bicep`, landing-zone policy, secret scanning, negative authorization tests, RBAC review, log redaction/data minimization e secure-SDLC gate proporzionati al rischio.

**Evidence:** Microsoft Learn per Threat Modeling, Zero Trust/security design, identity/least privilege, App Service security/private connectivity, Key Vault RBAC e Service Bus Private Link; NIST SP 800-218 per Secure Software Development Framework; OWASP ASVS per verification requirements; Cloudflare postmortem sull'incidente Okta 2023 come caso reale di containment/assume-breach.

**Trigger:** public/mobile/partner ingress, nuovo sensitive-data class, security incident, API/WebJob privilege divergence, multi-region, nuovi provider esterni, cost curve Service Bus Premium non più giustificata, cambiamenti della landing zone o nuovi compliance requirement.

## Capitolo 14 — Reliability e resilienza

**Esigenza:** mantenere Order Operations utilizzabile durante failure comuni e recuperabile durante failure più ampi, senza comprare più ridondanza di quella che il business sa valorizzare.

**Tensione:** stronger availability/recovery vs cloud cost, operational complexity, recovery testing burden e delivery speed.

**Decisione:** introdurre SLO/health model/error-budget direction e un Reliability Contract; produzione usa App Service Premium v3 con almeno due istanze e zone redundancy, PostgreSQL zone-redundant HA direction con backup/PITR, Service Bus zone redundancy e single-region recovery. Active-active multi-region resta fuori.

**Costo accettato:** maggior costo compute/database; capacity headroom pagata anche in steady state; region-wide disaster non ha failover immediato e accetta recovery manuale entro target più rilassati.

**Quality floor:** committed local business state preservato nei failure HA coperti; degraded mode non presenta dati non verificabili come current truth; recovery source e owner espliciti; security/tenant boundary non vengono disabilitati per availability; backup/restore non dichiarati funzionanti senza test.

**Guardrail:** Reliability Contract, Failure Mode Map estesa, RTO/RPO, error budget, required drills, IaC zone redundancy, PITR, synthetic journey direction e review trigger.

**Evidence:** Google SRE per SLI/SLO/error budget; Microsoft Azure Well-Architected e reliability documentation per health model, graceful degradation, App Service, PostgreSQL e Service Bus; GitHub availability report e Cloudflare postmortem per cascading failure, capacity, DNS/configuration failure e containment reali.

**Trigger:** SLO miss persistenti, error-budget burn, RTO/RPO regionali più severi, contractual SLA, recovery drill fallito, App/worker capacity divergence, nuova geography, cost curve o Platform standard.

## Capitolo 15 e successivi

Da qui in avanti il compromise ledger viene aggiornato insieme al manoscritto.

Ogni nuovo compromesso deve mostrare anche come proteggiamo la qualità.

La formula che useremo è:

> **Compromesso sì. Qualità inconsapevolmente degradata no.**

## Collegamento con le evidenze

Un compromesso ESI è simulato, ma non deve essere arbitrario.

Quando dipende da caratteristiche reali di tecnologie, protocolli o pratiche operative, la decisione deve essere confrontata con:

- standard e RFC;
- documentazione ufficiale;
- paper;
- engineering blog e postmortem;
- casi reali documentati;
- misure prodotte dal capstone quando sarà eseguibile.

Lo scenario ci dà il contesto.

Le evidenze ci impediscono di trasformare la narrativa in opinione tecnica non verificata.