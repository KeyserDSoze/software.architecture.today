# ESI — Compromise Ledger

Questo documento traccia i compromessi narrativi e architetturali usati in *Software Architecture Today*.

> **Un trade-off accetta un costo consapevole per ottenere un beneficio prioritario. Una scorciatoia nasconde un costo e spera che non presenti il conto.**

Regola editoriale:

> **Compromesso sì. Qualità inconsapevolmente degradata no.**

Ogni compromesso deve rendere leggibili almeno:

```text
Esigenza
Tensione
Decisione
Costo accettato
Quality floor
Guardrail / Evidence
Trigger
```

## Capitolo 0 — Al timone

**Esigenza:** aumentare execution con agenti AI.  
**Tensione:** velocità vs comprensione/accountability.  
**Decisione:** delegare execution mantenendo human judgment, verification e stop condition.  
**Quality floor:** responsabilità, security e verificabilità restano governate da persone e policy.

## Capitolo 1 — Il software è cambiato. Il problema no.

**Esigenza:** ridurre lead time.  
**Tensione:** generation speed vs problem quality.  
**Decisione:** accelerare execution solo dopo sufficiente contesto.  
**Quality floor:** outcome, vincoli e acceptance evidence comprensibili.

## Capitolo 2 — Prima del codice

**Esigenza:** consegnare Order Operations senza analisi infinita.  
**Tensione:** completezza vs learning speed.  
**Decisione:** analisi sufficiente per la prossima decisione, open question esplicite.  
**Quality floor:** business rule critiche non inventate dall'implementazione.

## Capitolo 3 — Pensare per sistemi

**Esigenza:** vista unificata per Operations.  
**Tensione:** UI semplice vs ownership/dipendenze reali.  
**Decisione:** aggregare senza trasferire autorità sui fact.  
**Quality floor:** meaning, freshness e ownership distinguibili.

## Capitolo 4 — Software Architecture

**Esigenza:** dati sufficientemente aggiornati.  
**Tensione:** semplicità vs read model indipendente.  
**Decisione:** lookup live prima di projection asincrona.  
**Quality floor:** correctness e ownership preservate; ADR con trigger.

## Capitolo 5 — Dalle feature ai confini

**Esigenza:** evolvere Orders/Payments/Shipping senza blocco unico.  
**Tensione:** velocità locale vs responsabilità chiare.  
**Decisione:** logical boundary e information hiding nello stesso deployable.  
**Quality floor:** business rule non duplicate senza owner.

## Capitolo 6 — Qualità prima della tecnologia

**Esigenza:** reattività/affidabilità sufficienti.  
**Tensione:** massimizzare quality vs cost/complexity.  
**Decisione:** niente Redis o active-active senza requirement.  
**Quality floor:** correctness, access control, operability.  
**Principio:** fit before fashion.

## Capitolo 7 — Pattern senza religione

**Esigenza:** gestire variation/failure.  
**Tensione:** robustezza vs accidental complexity.  
**Decisione:** pattern solo quando risolvono forze presenti.  
**Quality floor:** verificabilità/evolvibilità senza speculative generality.

## Capitolo 8 — Il monolite non è il nemico

**Esigenza:** boundary chiari e delivery speed.  
**Tensione:** independent deploy/isolation vs distributed cost.  
**Decisione:** modular monolith.  
**Quality floor:** modularità, ownership, testability; extraction trigger espliciti.

## Capitolo 9 — API e contratti

**Esigenza:** contratto stabile per Operations UI.  
**Tensione:** nuove action rapide vs semantics/auth/audit/idempotency.  
**Decisione:** inizialmente read-oriented; remediation economica rinviata.  
**Quality floor:** side effect non inventati senza semantica.

## Capitolo 10 — I dati sono architettura

**Esigenza:** vista unica senza trasferire data authority.  
**Tensione:** simplicity/performance vs ownership/sync cost.  
**Decisione:** PostgreSQL principale; persistere solo dati posseduti; niente projection/cache/search senza trigger.  
**Quality floor:** una autorità semantica, tenant isolation, migration governate.  
**Evidence:** Microsoft Learn, PostgreSQL, Redis, Stripe, GitHub.

## Capitolo 11 — Sistemi distribuiti

**Esigenza:** Payment Escalation indipendente dalla availability di Payments & Risk.  
**Tensione:** request-path availability vs immediate consistency.  
**Decisione:** PaymentEscalation + Outbox atomici, publisher async, at-least-once, consumer idempotente.  
**Quality floor:** no loss after commit, no duplicate business effect.  
**Evidence:** Microsoft, AWS, Uber.

## Capitolo 12 — Cloud Architecture

**Esigenza:** cloud enterprise senza piattaforma sproporzionata.  
**Tensione:** Platform standard vs autonomy/security/cost.  
**Decisione:** Azure landing zone, App Service/WebJob, PostgreSQL, Service Bus, Managed Identity, Key Vault, Monitor, Bicep, single region.  
**Quality floor:** durable state, identity, recovery, observability, IaC.  
**Evidence:** Microsoft/AWS/dacadoo.

## Capitolo 13 — Security by Design

**Esigenza:** ridurre attack surface e blast radius.  
**Tensione:** private/least privilege vs simplicity/cost.  
**Decisione:** private ingress/data-plane direction, Entra, identity separation e Bicep baseline.  
**Costo accettato:** networking più complesso e Service Bus Premium.  
**Quality floor:** authenticated access, tenant isolation, no broad runtime privilege.  
**Evidence:** Microsoft, NIST SSDF, OWASP ASVS, Cloudflare.

## Capitolo 14 — Reliability e resilienza

**Esigenza:** sopravvivere ai failure comuni e recuperare da failure ampi.  
**Tensione:** stronger recovery vs cloud/operational cost.  
**Decisione:** SLO/error budget, zone resilience, single-region DR target; no active-active.  
**Quality floor:** committed state protetto nei failure coperti; restore richiede evidence.  
**Evidence:** Google SRE, Microsoft, GitHub, Cloudflare.

## Capitolo 15 — Observability

**Esigenza:** misurare SLO e diagnosticare failure.  
**Tensione:** detail vs telemetry cost/cardinality/privacy/alert fatigue.  
**Decisione:** bounded metrics, governed sampling, correlation e Observability Contract.  
**Quality floor:** SLI misurabili, no secret, actionable alert.  
**Evidence:** OpenTelemetry, Google SRE, Microsoft.

## Capitolo 16 — Testing Architecture

**Esigenza:** modificare velocemente senza perdere confidence.  
**Tensione:** confidence vs feedback speed/environment cost.  
**Decisione:** multi-speed Testing Strategy; `node:test` finché basta.  
**Quality floor:** ogni property verificata al layer capace di dimostrarla.  
**Evidence:** Microsoft, Google, Meta, OWASP, Pact.

## Capitolo 17 — Legacy e comprensione

**Esigenza:** ridurre Operations Desk Classic senza perdere semantica nascosta.  
**Tensione:** retirement speed vs regression risk vs accidental complexity.  
**Decisione:** inventory → characterization → owner/consumer discovery → behavior classification → seam design.  
**Quality floor:** no silent semantic regression; `Observed ≠ Confirmed`.  
**Evidence:** Microsoft/AWS/GitHub; legacy characterization 6/6 PASS.

## Capitolo 18 — Refactoring nell'era dell'AI

**Esigenza:** trasferire Priority routing dal legacy.  
**Tensione:** retirement rapido vs continuity e small blast radius.  
**Decisione:** confermare target semantics, registrare `ED-001`, introdurre PriorityPolicy/adapter/shadow; nessun production cutover.  
**Quality floor:** expected difference pre-autorizzata; ogni altra divergenza resta unexpected; rollback prima di one-way door.  
**Evidence:** AWS/Microsoft/GitHub/OpenRewrite; 19/19 target + 6/6 legacy PASS alla revisione del capitolo.

## Capitolo 19 — Architecture Evolution

**Esigenza:** evolvere senza perdere boundary e quality attribute.  
**Tensione:** autonomia vs architecture drift; governance vs delivery speed.  
**Decisione:** Architecture Fitness Checklist, executable fitness, ADR trigger ed exception policy.  
**Quality floor:** no silent drift; exception con owner/expiry.  
**Evidence:** Thoughtworks/AWS/Microsoft/GitHub; AF-001…AF-005 5/5 PASS.

## Capitolo 20 — Costi e decisioni

**Esigenza:** costi sostenibili senza quality degradation.  
**Tensione:** Finance vs Security/Reliability/Operations premium.  
**Decisione:** Cost Model, architectural premium, unit economics candidate e allocation metadata.  
**Quality floor:** cost cut non riduce implicitamente proprietà necessarie.  
**Evidence:** Microsoft/FinOps/Uber; CF-001…CF-002 2/2 PASS.

## Capitolo 21 — AI-ready repository

**Esigenza:** ridurre rediscovery per contributor e coding agent.  
**Tensione:** persistent context vs context pollution/instruction drift.  
**Decisione:** `AGENTS.md` breve, Repository Map, canonical context routing e context fitness.  
**Quality floor:** instruction ≠ source of truth; instruction ≠ permission.  
**Evidence:** GitHub/OpenAI; CTX-001…CTX-004 4/4 PASS.

## Capitolo 22 — Issue-driven development

**Esigenza:** rendere backlog/task delegabili senza decisioni implicite.  
**Tensione:** parallelism vs preparation cost/burocrazia.  
**Decisione:** Execution Work Item con Problem, Outcome, Scope, Out-of-scope, Acceptance, Verification e Stop Conditions.  
**Quality floor:** acceptance property distinta dal command; no green-by-editing-the-oracle.  
**Evidence:** GitHub/OpenAI; ISSUE-001…ISSUE-004 4/4 PASS.

## Capitolo 23 — Manager di agenti

**Esigenza:** aumentare execution delegata senza permission escalation o self-certification.  
**Tensione:** throughput vs least privilege, verification independence e human authority.  
**Decisione:** `Human Decision Owner → Implementer → deterministic evidence → Verifier → human/repository gate`; A2 per OO-001, nessuna A4 production capability.  
**Costo accettato:** più review e artifact, meno autonomia immediata.  
**Quality floor:** executor non aumenta autonomamente scope/permission; critical finding non si vota a maggioranza.  
**Evidence:** OpenAI/Microsoft/GitHub; AGOV-001…AGOV-005 5/5 localmente esercitato; OO-001 execution ancora Pending.

## Capitolo 24 — AI dentro l'architettura

**Esigenza:** ridurre il costo cognitivo con cui Operations ricostruisce un caso problematico.  
**Tensione:** Product vuole spiegazioni utili; Payments & Risk vuole preservare semantic authority; Security vuole minimizzare prompt-injection/data/tool blast radius; Platform vuole evitare provider coupling diffuso; Finance vuole costo per useful outcome misurabile.

**Decisione:** ESI introduce **Case Explanation Assistant** come prima capability AI runtime: read-only, deterministic context assembly, `CaseExplanationPort` provider-neutral, output strutturato con fact/hypothesis/missing evidence/source reference, nessun write tool e nessun vector/RAG layer finché il workload non lo richiede.

**Costo accettato:** meno automazione, nessuna remediation autonoma, possibilità di `InsufficientEvidence`, nessun accesso a corpus enterprise ampio nel primo slice.

**Quality floor:** model interpretation ≠ authoritative fact; authorization prima del retrieval; tenant isolation; source provenance; core Operational Case view disponibile anche se il model provider fallisce; nessuna business action implicita.

**Guardrail:** `docs/ai-feature-contract.md`, `src/ai/case-explanation.ts`, `evals/case-explanation-v1.jsonl`, `tests/ai-boundary-fitness.test.mjs`, bounded retry/fallback, eval prima del rollout, Threat/Observability/Cost review quando il boundary cresce.

**Evidence:** Microsoft Azure Architecture Center/Foundry su RAG, context engineering ed evaluation; OWASP su prompt injection; NIST AI RMF GenAI Profile; OpenAI su source/sink prompt-injection defenses; Uber Genie/Enhanced Agentic-RAG/Gen AI Gateway come casi reali. Gate locale del nuovo boundary: TypeScript compile PASS + AI-001…AI-005 `5/5 PASS`. Nessun model/provider è stato ancora eseguito, quindi groundedness, injection resistance reale, latency e cost restano Pending.

**Trigger:** write/action tool, corpus documentale ampio, cross-case analysis, nuove source sensibili, AI nel critical path, model/provider change, eval regression, cost/latency materialmente peggiori.

## Capitolo 25 e successivi

Il ledger continua insieme al manoscritto.

Lo scenario ESI dà il contesto; fonti, test, eval e runtime evidence impediscono di trasformare il compromesso in opinione non verificata.