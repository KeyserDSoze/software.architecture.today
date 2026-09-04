# ESI — Compromise Ledger

Questo documento traccia i compromessi narrativi e architetturali usati in *Software Architecture Today*.

> **Un trade-off accetta un costo consapevole per ottenere un beneficio prioritario. Una scorciatoia nasconde un costo e spera che non presenti il conto.**

Regola editoriale:

> **Compromesso sì. Qualità inconsapevolmente degradata no.**

Ogni compromesso deve rendere leggibili:

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

**Esigenza:** aumentare execution con agenti AI.  
**Tensione:** velocità vs comprensione/accountability.  
**Decisione:** delegare execution mantenendo human judgment, verification e stop condition.  
**Costo:** checkpoint e review riducono autonomia massima.  
**Quality floor:** responsabilità, security e verificabilità restano umane.  
**Guardrail:** Agent Delegation Contract, Verification Bundle, permission boundary.

## Capitolo 1 — Il software è cambiato. Il problema no.

**Esigenza:** ridurre lead time.  
**Tensione:** generation speed vs problem quality.  
**Decisione:** accelerare execution solo dopo sufficiente contesto.  
**Costo:** più foundation iniziale.  
**Quality floor:** outcome, vincoli e acceptance evidence comprensibili.  
**Guardrail:** context engineering e assumption verification.

## Capitolo 2 — Prima del codice

**Esigenza:** consegnare Order Operations senza analisi infinita.  
**Tensione:** completezza vs learning speed.  
**Decisione:** analisi sufficiente per la prossima decisione, open question esplicite.  
**Costo:** alcune decisioni rimandate.  
**Quality floor:** business rule critiche non inventate dall'implementazione.  
**Guardrail:** Problem & Outcome Brief, Functional Scope Map.

## Capitolo 3 — Pensare per sistemi

**Esigenza:** vista unificata per Operations.  
**Tensione:** UI semplice vs ownership/dipendenze reali.  
**Decisione:** aggregare senza trasferire autorità sui facts.  
**Costo:** journey dipende da più fonti.  
**Quality floor:** meaning, freshness e ownership distinguibili.  
**Guardrail:** Architecture Context Map e failure-domain analysis.

## Capitolo 4 — Software Architecture

**Esigenza:** dati sufficientemente aggiornati.  
**Tensione:** semplicità vs read model indipendente.  
**Decisione:** lookup live prima di projection asincrona.  
**Costo:** maggiore runtime dependency.  
**Quality floor:** correctness/ownership preservate.  
**Guardrail:** ADR con trigger.

## Capitolo 5 — Dalle feature ai confini

**Esigenza:** evolvere Orders/Payments/Shipping senza blocco unico.  
**Tensione:** velocità locale vs responsabilità chiare.  
**Decisione:** logical boundary e information hiding nello stesso deployable.  
**Costo:** adapter/contratti interni.  
**Quality floor:** business rule non duplicate senza owner.  
**Guardrail:** Component Responsibility Map.

## Capitolo 6 — Qualità prima della tecnologia

**Esigenza:** reattività/affidabilità sufficienti.  
**Tensione:** massimizzare quality vs cost/complexity.  
**Decisione:** niente Redis o active-active senza requirement.  
**Costo:** rinuncia a ottimizzazioni possibili.  
**Quality floor:** correctness, access control, operability.  
**Guardrail:** NFR Card e trigger misurabili.

## Capitolo 7 — Pattern senza religione

**Esigenza:** gestire variation/failure.  
**Tensione:** robustezza vs accidental complexity.  
**Decisione:** pattern solo quando risolvono forze presenti.  
**Costo:** niente speculative generality.  
**Quality floor:** verificabilità/evolvibilità.  
**Guardrail:** Pattern Justification Test.

## Capitolo 8 — Il monolite non è il nemico

**Esigenza:** boundary chiari e delivery speed.  
**Tensione:** independent deploy/isolation vs distributed cost.  
**Decisione:** modular monolith.  
**Costo:** deploy/failure domain non indipendenti per modulo.  
**Quality floor:** modularità, ownership, testability.  
**Guardrail:** extraction trigger e architecture constraints.

## Capitolo 9 — API e contratti

**Esigenza:** contratto stabile per Operations UI.  
**Tensione:** nuove action rapide vs semantics/auth/audit/idempotency.  
**Decisione:** inizialmente read-oriented; remediation economica rinviata.  
**Costo:** meno automazione operativa.  
**Quality floor:** side effect non inventati senza semantica.  
**Guardrail:** API Contract e compatibility rules.

## Capitolo 10 — I dati sono architettura

**Esigenza:** vista unica senza trasferire data authority.  
**Tensione:** simplicity/performance vs ownership/sync cost.  
**Decisione:** PostgreSQL principale; persistere solo dati posseduti; niente projection/cache/search senza trigger.  
**Costo:** maggiore coupling runtime.  
**Quality floor:** un'autorità semantica, tenant isolation, migration governate.  
**Guardrail:** Data Ownership Map e reconciliation.  
**Evidence:** Microsoft Learn, PostgreSQL, Redis, Stripe, GitHub.

## Capitolo 11 — Sistemi distribuiti

**Esigenza:** Payment Escalation indipendente dalla availability di Payments & Risk.  
**Tensione:** request-path availability vs immediate consistency.  
**Decisione:** PaymentEscalation + Outbox atomici, publisher async, at-least-once, consumer idempotente.  
**Costo:** eventual consistency, retry, DLQ, reconciliation.  
**Quality floor:** no loss after commit, no duplicate business effect.  
**Guardrail:** stable IDs, Failure Mode Map.  
**Evidence:** Microsoft, AWS, Uber.

## Capitolo 12 — Cloud Architecture

**Esigenza:** cloud enterprise senza piattaforma sproporzionata.  
**Tensione:** Platform standard vs autonomy/security/cost.  
**Decisione:** Azure landing zone, App Service/WebJob, PostgreSQL, Service Bus, Managed Identity, Key Vault, Monitor, Bicep, single region.  
**Costo:** Azure coupling e no instant regional failover.  
**Quality floor:** durable state, identity, recovery, observability, IaC.  
**Evidence:** Microsoft/AWS/dacadoo.

## Capitolo 13 — Security by Design

**Esigenza:** ridurre attack surface e blast radius.  
**Tensione:** private/least privilege vs simplicity/cost.  
**Decisione:** private ingress/data-plane direction, Entra, server-side auth, identity separation, Bicep baseline.  
**Costo:** networking più complesso, Service Bus Premium.  
**Quality floor:** authenticated access, tenant isolation, no broad runtime privilege.  
**Guardrail:** Threat Model, Security Control Matrix, negative tests.  
**Evidence:** Microsoft, NIST SSDF, OWASP ASVS, Cloudflare.

## Capitolo 14 — Reliability e resilienza

**Esigenza:** sopravvivere ai failure comuni e recuperare da failure ampi.  
**Tensione:** stronger recovery vs cloud/operational cost.  
**Decisione:** SLO/error budget, zone resilience, single-region DR target; no active-active.  
**Costo:** capacity/HA cost, regional recovery più lento.  
**Quality floor:** committed state protetto nei failure coperti; restore richiede evidence.  
**Guardrail:** Reliability Contract, drills, RTO/RPO.  
**Evidence:** Google SRE, Microsoft, GitHub, Cloudflare.

## Capitolo 15 — Observability

**Esigenza:** misurare SLO e diagnosticare failure.  
**Tensione:** detail vs telemetry cost/cardinality/privacy/alert fatigue.  
**Decisione:** Observability Contract, OTel-compatible instrumentation, bounded metrics, governed sampling, private synthetic direction.  
**Costo:** non conservare ogni dettaglio.  
**Quality floor:** SLI misurabili, correlation, no secret, actionable alert.  
**Guardrail:** cardinality budget e retention/sampling policy.  
**Evidence:** OpenTelemetry, Google SRE, Microsoft.

## Capitolo 16 — Testing Architecture

**Esigenza:** modificare velocemente senza perdere confidence.  
**Tensione:** confidence vs feedback speed/environment cost.  
**Decisione:** multi-speed Testing Strategy; `node:test` finché basta.  
**Costo:** non ogni commit attraversa boundary reali.  
**Quality floor:** ogni property verificata al layer capace di dimostrarla.  
**Guardrail:** Risk-to-Evidence Map, flaky policy, selective mutation, AI-test review.  
**Evidence:** Microsoft, Google, Meta, OWASP, Pact; local suite 11/11 PASS al tempo del capitolo.

## Capitolo 17 — Legacy e comprensione

**Esigenza:** ridurre Operations Desk Classic senza perdere semantica nascosta.  
**Tensione:** retirement speed vs regression risk vs rischio di copiare accidental complexity.  
**Decisione:** inventory → characterization → owner/consumer discovery → behavior classification → seam design.  
**Costo:** legacy e knowledge effort restano più a lungo.  
**Quality floor:** no silent semantic regression; Observed ≠ Confirmed.  
**Guardrail:** Legacy Understanding Map e characterization suite.  
**Evidence:** Microsoft/AWS/GitHub; legacy characterization 6/6 PASS.

## Capitolo 18 — Refactoring nell'era dell'AI

**Esigenza:** trasferire la priority routing da Operations Desk Classic a Order Operations e ridurre progressivamente il legacy footprint.

**Tensione:** Finance/Platform vogliono retirement rapido; Operations vuole continuity; Product vuole eliminare una regola storica obsoleta; Engineering vuole small blast radius; l'AI rende possibile produrre un enorme diff quasi immediatamente.

**Decisione:** ESI conferma esplicitamente la semantica target, registra `ED-001` per rimuovere la vecchia `Enterprise + 30m → URGENT`, introduce `PriorityPolicy`, `LegacyPriorityAdapter`, `ConfirmedPriorityPolicy` e `BranchingPriorityPolicy` con modalità `legacy | shadow | candidate`. Nel Capitolo 18 ci fermiamo allo shadow boundary locale: nessun production cutover inventato.

**Costo accettato:** due implementazioni temporanee, adapter, routing mode, comparison logic, expected-difference registry e cleanup futuro.

**Quality floor:** `Closed`, `ManualReview`, repeated Payment failure e default behavior preservati; ED-001 approvata prima del rollout; ogni altra differenza resta `UnexpectedDifference`; nessun cambio DB/API nel primo slice; rollback/fallback richiesto prima di one-way door.

**Guardrail:** `docs/priority-functional-analysis.md`, `docs/refactoring-safety-plan.md`, Legacy Understanding Map aggiornata, characterization, target tests, shadow comparison, stop conditions e cleanup definition.

**Evidence:** AWS Branch by Abstraction; Microsoft Strangler Fig/safe deployments/Copilot modernization; GitHub feature-flag, Redis data migration e rate-limiter migration; OpenRewrite per automated refactoring. Evidence capstone corrente: TypeScript build PASS; Order Operations `19/19` PASS; Operations Desk Classic `6/6` PASS.

**Trigger:** runtime shadow telemetry disponibile; consumer inventory completato; unexpected mismatch assente nella finestra concordata; performance overhead accettabile; rollout/fallback owner definiti. Solo allora candidate routing può aumentare. Data migration/legacy retirement richiedono un nuovo gate e point-of-no-return review.

## Capitolo 19 — Architecture Evolution

**Esigenza:** permettere a Order Operations di evolvere rapidamente senza perdere nel tempo boundary, quality attribute e decisioni già conquistate.

**Tensione:** autonomia dei team e degli agenti vs architecture drift; governance vs delivery speed; policy stabile vs context drift.

**Decisione:** ESI introduce un portfolio di fitness function con `Architecture Fitness Checklist`, architecture test eseguibili, review trigger ed exception policy con owner/expiry. Le regole meccaniche vengono automatizzate; il cambio di architectural intent resta una decisione esplicita.

**Costo accettato:** alcune regole, test e review devono essere mantenuti insieme al codice; la governance non è zero-cost.

**Quality floor:** nessun drift silenzioso su legacy isolation, dependency direction, contract boundary e vendor leakage nel core; una exception non può diventare permanente per inerzia.

**Guardrail:** `docs/architecture-fitness-checklist.md`, `tests/architecture-fitness.test.mjs`, ADR review trigger, exception expiry e portfolio review.

**Evidence:** Thoughtworks evolutionary architecture/fitness functions, AWS cloud fitness functions, Microsoft Well-Architected continuous review e GitHub SERVICEOWNERS. Gate locale AF-001…AF-005: `5/5 PASS`.

**Trigger:** new boundary, new vendor SDK, new exception, context/SLO/security change, recurring false-positive o fitness rule che non protegge più una proprietà utile.

## Capitolo 20 — Costi e decisioni

**Esigenza:** rendere sostenibile e prevedibile la crescita economica di Order Operations senza trasformare cost optimization in quality degradation.

**Tensione:** Finance vuole contenere run rate; Security difende private boundary; Reliability difende headroom/zone resilience; Operations difende diagnostic evidence; Engineering vuole limitare complexity e migration overlap.

**Decisione:** ESI introduce `docs/cost-model.md`, cost driver map, architectural premium, unit economics candidate, allocation direction e cost review trigger. Prima si riduce waste; soltanto dopo si riaprono quality premium che cambiano il comportamento del sistema.

**Costo accettato:** Order Operations non è la topologia più economica possibile; continua a pagare premium intenzionali per security, reliability, observability e migrazione reversibile.

**Quality floor:** correctness, tenant isolation, required authentication/authorization, required reliability/recovery e minimum operability non vengono ridotti implicitamente da un target di spesa.

**Guardrail:** `Cost Model`, property-purchased per major cost, unit metric + quality metric, allocation metadata, `tests/cost-fitness.test.mjs`, artifact reopening quando un cost cut cambia security/SLO/recovery/observability.

**Evidence:** Microsoft Azure Well-Architected Cost Optimization e Cost Model; FinOps Framework Unit Economics, Allocation e Architecting & Workload Placement; casi Uber su CPU right-sizing, Big Data supply/demand, partial replication e artifact storage. Cost metadata guard locale CF-001…CF-002 esercitato: `2/2 PASS`; production billing/unit economics restano Pending.

**Trigger:** billing reale disponibile, cost/unit trend diverge dal business volume, Premium/new paid capability, telemetry growth, legacy coexistence oltre milestone, SLO/security requirement change, introduzione di workload AI materialmente costoso.

## Capitolo 21 — AI-ready repository

**Esigenza:** permettere a persone e coding agent di entrare in Order Operations senza ricostruire ogni volta struttura, boundary, comandi e criteri di evidence.

**Tensione:** più persistent context vs context pollution, documentazione duplicata e instruction drift.

**Decisione:** ESI introduce un `AGENTS.md` breve e tool-neutral come routing layer, `docs/repository-map.md` come navigation context e `tests/agent-context-fitness.test.mjs` per verificare proprietà meccaniche del context layer. I dettagli restano nei documenti canonical esistenti.

**Costo accettato:** `AGENTS.md` e Repository Map diventano artefatti da mantenere sincronizzati con la struttura; aggiungiamo un nuovo failure mode possibile, instruction staleness.

**Quality floor:** nessuna instruction diventa seconda source of truth per requisiti/architecture; verification commands devono esistere; `Designed→Codified→Verified→Monitored` resta esplicito; instruction ≠ permission.

**Guardrail:** canonical context routing, golden commands, stop conditions, context fitness, no secret in instructions, human review per semantic correctness.

**Evidence:** GitHub Docs su repository/custom instructions e `AGENTS.md`; OpenAI su `AGENTS.md`, environment setup e task context. Gate CTX-001…CTX-004 esercitato localmente: `4/4 PASS`.

**Trigger:** top-level structure cambia, canonical doc viene rinominato/ritirato, golden command cambia, instruction cresce/duplica content, agent permission model entra in produzione.

## Capitolo 22 — Issue-driven development

**Esigenza:** trasformare backlog e richieste di lavoro in unità delegabili a persone e agenti senza lasciare che l'executor inventi decisioni di prodotto o architettura mancanti.

**Tensione:** maggiore execution parallelism vs costo di preparare issue realmente execution-ready; abbastanza struttura vs burocrazia; autonomia locale vs task amplification.

**Decisione:** ESI distingue repository context da task context e introduce `work-items/TEMPLATE.md`, il primo execution work item `OO-001-postgresql-escalation-outbox-atomicity.md` e `tests/issue-readiness-fitness.test.mjs`. Il template richiede Problem, Outcome, Current evidence, Scope, Out of scope, Canonical context, Acceptance criteria, Verification, Constraints, Stop conditions e Closure evidence.

**Costo accettato:** i task a rischio materiale richiedono più lavoro di preparation e review prima dell'execution; il work-item contract deve essere aggiornato quando nuova evidence modifica scope o decision boundary.

**Quality floor:** acceptance property distinta dal test command; out-of-scope esplicito; stop conditions; no green-by-editing-the-oracle; claim di closure proporzionato alla verification realmente eseguita.

**Guardrail:** Issue Template, work-item readiness review, canonical document links, stop/escalation behavior, closure `Not verified`, issue-readiness fitness.

**Evidence:** GitHub Docs/Blog su well-scoped coding-agent issues, acceptance criteria, Issue Forms, atomic task e WRAP; OpenAI su task ben circoscritti e prompt strutturati come GitHub Issue. Gate ISSUE-001…ISSUE-004 eseguito localmente: `4/4 PASS`.

**Trigger:** work item richiede una nuova semantica/owner/one-way door, scope cresce oltre il boundary dichiarato, verification oracle dovrebbe cambiare, task diventa multi-outcome, oppure emerge una dependency che richiede discovery separata.

## Capitolo 23 e successivi

Il ledger continua insieme al manoscritto.

Lo scenario ESI dà il contesto; fonti, test e runtime evidence impediscono di trasformare il compromesso in opinione non verificata.
