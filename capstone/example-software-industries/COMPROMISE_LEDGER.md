# ESI — Compromise Ledger

Questo documento traccia i compromessi narrativi e architetturali usati in *Software Architecture Today*.

> **Un trade-off accetta un costo consapevole per ottenere un beneficio prioritario. Una scorciatoia nasconde un costo e spera che non presenti il conto.**

Regola editoriale:

> **Compromesso sì. Qualità inconsapevolmente degradata no.**

Ogni capitolo deve rendere leggibili, quando pertinenti:

```text
Esigenza
Tensione
Decisione
Costo accettato
Quality floor
Guardrail / Evidence
Trigger
```

## 0 — Al timone

**Esigenza:** aumentare execution con agenti.  
**Tensione:** velocità vs comprensione/accountability.  
**Decisione:** delegare execution mantenendo human judgment, verification e stop condition.  
**Quality floor:** responsabilità, security e verificabilità non vengono delegate per default.

## 1 — Il software è cambiato. Il problema no.

**Esigenza:** ridurre lead time.  
**Tensione:** generation speed vs problem quality.  
**Decisione:** accelerare execution solo dopo sufficiente contesto.  
**Quality floor:** outcome, vincoli e acceptance evidence comprensibili.

## 2 — Prima del codice

**Esigenza:** consegnare senza analisi infinita.  
**Tensione:** completezza vs learning speed.  
**Decisione:** analisi sufficiente per la prossima decisione, open question esplicite.  
**Quality floor:** business rule critiche non inventate dall'implementation.

## 3 — Pensare per sistemi

**Esigenza:** vista unificata per Operations.  
**Tensione:** UI semplice vs ownership/dipendenze reali.  
**Decisione:** aggregare senza trasferire autorità sui fact.  
**Quality floor:** meaning, freshness e ownership distinguibili.

## 4 — Software Architecture

**Esigenza:** dati abbastanza aggiornati senza complessità prematura.  
**Tensione:** semplicità vs read model indipendente.  
**Decisione:** lookup live prima di projection asincrona.  
**Quality floor:** correctness, ownership e review trigger espliciti.

## 5 — Dalle feature ai confini

**Esigenza:** evolvere Orders/Payments/Shipping senza blocco unico.  
**Tensione:** velocità locale vs responsabilità chiare.  
**Decisione:** logical boundary nello stesso deployable.  
**Quality floor:** business rule non duplicate senza owner.

## 6 — Qualità prima della tecnologia

**Esigenza:** quality sufficienti senza piattaforma sproporzionata.  
**Tensione:** massimizzare quality vs cost/complexity.  
**Decisione:** niente Redis/active-active senza requirement.  
**Quality floor:** correctness, access control, operability.  
**Principio:** fit before fashion.

## 7 — Pattern senza religione

**Esigenza:** gestire variation/failure.  
**Tensione:** robustezza vs accidental complexity.  
**Decisione:** pattern solo quando risolvono forze presenti.  
**Quality floor:** verificabilità/evolvibilità senza speculative generality.

## 8 — Il monolite non è il nemico

**Esigenza:** boundary chiari e delivery speed.  
**Tensione:** independent deploy/isolation vs distributed cost.  
**Decisione:** modular monolith.  
**Quality floor:** modularità, ownership, testability e extraction trigger.

## 9 — API e contratti

**Esigenza:** contratto stabile per Operations.  
**Tensione:** nuove action rapide vs semantics/auth/audit/idempotency.  
**Decisione:** read-oriented first; remediation economica rinviata.  
**Quality floor:** side effect non inventati senza semantica.

## 10 — I dati sono architettura

**Esigenza:** vista unica senza trasferire data authority.  
**Tensione:** simplicity/performance vs ownership/sync cost.  
**Decisione:** PostgreSQL principale; persistere solo dati posseduti; niente projection/cache/search senza trigger.  
**Quality floor:** una autorità semantica, tenant isolation, migration governate.

## 11 — Sistemi distribuiti

**Esigenza:** Payment Escalation indipendente dalla availability di Payments & Risk.  
**Tensione:** request-path availability vs immediate consistency.  
**Decisione:** escalation + outbox atomici, publisher async, at-least-once, consumer idempotente.  
**Quality floor:** no loss after commit, no duplicate business effect.

## 12 — Cloud Architecture

**Esigenza:** cloud enterprise senza piattaforma sproporzionata.  
**Tensione:** Platform standard vs autonomy/security/cost.  
**Decisione:** Azure PaaS, PostgreSQL, Service Bus, Managed Identity, Key Vault, Monitor, Bicep, single region.  
**Quality floor:** durable state, identity, recovery, observability, IaC.

## 13 — Security by Design

**Esigenza:** ridurre attack surface e blast radius.  
**Tensione:** private/least privilege vs simplicity/cost.  
**Decisione:** private ingress/data-plane direction, Entra, identity separation e Bicep baseline.  
**Costo accettato:** networking più complesso e Service Bus Premium.  
**Quality floor:** authenticated access, tenant isolation, no broad runtime privilege.

## 14 — Reliability e resilienza

**Esigenza:** sopravvivere ai failure comuni e recuperare da failure ampi.  
**Tensione:** stronger recovery vs cloud/operational cost.  
**Decisione:** SLO/error budget, zone resilience, single-region DR target; no active-active.  
**Quality floor:** committed state protetto nei failure coperti; restore richiede evidence.

## 15 — Observability

**Esigenza:** misurare SLO e diagnosticare failure.  
**Tensione:** detail vs telemetry cost/cardinality/privacy/alert fatigue.  
**Decisione:** bounded metrics, governed sampling, correlation e Observability Contract.  
**Quality floor:** SLI misurabili, no secret, actionable alert.

## 16 — Testing Architecture

**Esigenza:** modificare velocemente senza perdere confidence.  
**Tensione:** confidence vs feedback speed/environment cost.  
**Decisione:** multi-speed Testing Strategy; `node:test` finché basta.  
**Quality floor:** ogni property verificata al layer capace di dimostrarla.

## 17 — Legacy e comprensione

**Esigenza:** ridurre Operations Desk Classic senza perdere semantica nascosta.  
**Tensione:** retirement speed vs regression risk vs accidental complexity.  
**Decisione:** inventory → characterization → owner/consumer discovery → behavior classification → seam.  
**Quality floor:** no silent semantic regression; `Observed ≠ Confirmed`.

## 18 — Refactoring nell'era dell'AI

**Esigenza:** trasferire Priority routing dal legacy.  
**Tensione:** retirement rapido vs continuity e blast radius.  
**Decisione:** confermare semantics, registrare `ED-001`, introdurre policy/adapter/shadow; nessun cutover prematuro.  
**Quality floor:** intentional difference pre-autorizzata; rollback prima di one-way door.

## 19 — Architecture Evolution

**Esigenza:** evolvere senza perdere boundary e quality attribute.  
**Tensione:** autonomia vs drift; governance vs delivery speed.  
**Decisione:** fitness checklist, executable fitness, ADR trigger ed exception policy.  
**Quality floor:** no silent drift; exception con owner/expiry.

## 20 — Costi e decisioni

**Esigenza:** costo sostenibile senza quality degradation.  
**Tensione:** Finance vs Security/Reliability/Operations premium.  
**Decisione:** Cost Model, architectural premium, unit economics candidate, allocation metadata.  
**Quality floor:** cost cut non riduce implicitamente proprietà necessarie.

## 21 — AI-ready repository

**Esigenza:** ridurre rediscovery per contributor e coding agent.  
**Tensione:** persistent context vs context pollution/instruction drift.  
**Decisione:** `AGENTS.md`, Repository Map, canonical routing e context fitness.  
**Quality floor:** instruction ≠ source of truth; instruction ≠ permission.

## 22 — Issue-driven development

**Esigenza:** rendere task delegabili senza decisioni implicite.  
**Tensione:** parallelism vs preparation cost/burocrazia.  
**Decisione:** Execution Work Item con outcome, scope, acceptance, verification e stop condition.  
**Quality floor:** acceptance property distinta dal command; no green-by-editing-the-oracle.

## 23 — Manager di agenti

**Esigenza:** aumentare execution delegata senza permission escalation/self-certification.  
**Tensione:** throughput vs least privilege, independent verification e human authority.  
**Decisione:** Human Decision Owner → Implementer → evidence → Verifier → human/repository gate.  
**Costo accettato:** più review e artifact.  
**Quality floor:** executor non aumenta autonomamente scope/permission; critical finding non si vota.

## 24 — AI dentro l'architettura

**Esigenza:** ridurre costo cognitivo della ricostruzione di un caso.  
**Tensione:** usefulness vs authority, prompt-injection/data blast radius, coupling e cost.  
**Decisione:** Case Explanation Assistant read-only, deterministic context, provider-neutral port, source-backed output, no write tools, no RAG obbligatorio.  
**Costo accettato:** meno automazione e possibile `InsufficientEvidence`.  
**Quality floor:** model interpretation ≠ authoritative fact; authorization prima del retrieval; core disponibile senza AI.

## 25 — One-Man Project

**Esigenza:** aumentare il perimetro governabile da un singolo accountable lead.  
**Tensione:** leverage vs knowledge concentration, continuity e review capacity.  
**Decisione:** accountable lead + bounded agent portfolio + WIP + secondary maintainer + specialist trigger + verification.  
**Costo accettato:** parte del parallelismo resta inutilizzata; continuity work esplicito.  
**Quality floor:** one accountable lead ≠ one source of truth.

## 26 — Production Readiness

**Esigenza:** iniziare uso operativo senza preparazione infinita.  
**Tensione:** data di launch vs evidence Security/Reliability/Operations.  
**Decisione:** launch boundary separati, blocker/risk/unknown espliciti, `PRR-OO-001 = NO-GO` finché i blocker core restano aperti.  
**Costo accettato:** launch ritardato/ristretto e capability disabilitate.  
**Quality floor:** tenant isolation, data integrity, recovery, operability, provenance e domain authority non vengono ridotti per la data.

## 27 — Casi end-to-end

**Esigenza:** applicare lo stesso metodo a workload differenti.  
**Tensione:** enterprise coherence vs workload-specific fit.  
**Decisione:** shared guardrail dove la varietà non crea valore; architecture specifica quando cambiano dominio/failure/evidence/operating model.  
**Costo accettato:** più di un operating model e alcune eccezioni motivate.  
**Quality floor:** functional authority, identity/security ownership, operability, evidence e cost attribution restano espliciti.

## 28 — L'architect del 2030

**Esigenza:** aumentare la capacità di governare sistemi e execution AI senza trasformare Architecture in un collo di bottiglia o in un ruolo disconnesso dalla realtà tecnica.  
**Tensione:** breadth vs technical depth vs specialist dependency; più agent execution vs decision/verification capacity.  
**Decisione:** ESI adotta una **Architect Capability Map** con broad functional/systems literacy, credible technical depth, specialist trigger, evidence-based growth ed executable guardrail dove possibile.  
**Costo accettato:** continuous learning, cross-functional exposure, mentoring/documentation e meno comfort dentro una sola specializzazione.  
**Quality floor:** functional understanding, technical credibility, evidence proportional to claim, specialist/domain authority e professional accountability non vengono delegate all'AI.  
**Guardrail:** `ARCHITECT_CAPABILITY_MAP.md`, Functional Literacy Baseline, L1–L4 capability-specific, Specialist Trigger, ESI Learning Loop, deliberate manual mode.  
**Evidence:** Microsoft Well-Architected architect-role guidance, DORA 2025, Microsoft Research SPACE of AI, OpenAI Codex workflow/security; audit in `reference/CHAPTER_028_EVIDENCE.md`.

## Regola di continuità

Lo scenario ESI dà il contesto; fonti, test, eval, review e runtime evidence impediscono di trasformare il compromesso in opinione non verificata.

> **Il fit viene prima della moda anche quando la tecnologia in questione è il modo in cui organizziamo il lavoro.**
