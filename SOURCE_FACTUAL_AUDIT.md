# Source & Factual Audit

Questo file traccia due revisioni distinte:

1. **Evidence pass** — claim fattuali, proprietà tecnologiche, standard, casi reali e raccomandazioni vengono confrontati con fonti appropriate.
2. **ESI compromise pass** — il capitolo rende leggibile almeno un compromesso con esigenza, tensione, decisione, costo, quality floor, guardrail/evidence e trigger.

Scenario fittizio ufficiale:

> **Example Software Industries S.p.A. — ESI**

Capstone principale:

> **Order Operations** — Commerce & Operations.

Brownfield simulato:

> **Operations Desk Classic**.

I casi reali rimangono sempre separati da ESI.

## Stato corrente

| Capitolo | Draft | Evidence pass | ESI compromise pass | Nota |
|---|---:|---:|---:|---|
| 0 — Al timone | sì | da fare | sì — draft | autonomy vs accountability |
| 1 — Il software è cambiato | sì | da fare | sì — draft | velocity vs understanding |
| 2 — Prima del codice | sì | parziale | sì — draft | analisi funzionale condivisa |
| 3 — Pensare per sistemi | sì | da fare | sì — draft | completezza/freshness vs simplicity |
| 4 — Software Architecture | sì | da fare | sì — draft | live lookup vs async read model |
| 5 — Dalle feature ai confini | sì | da fare | sì — draft | shared infra vs ownership |
| 6 — Qualità prima della tecnologia | sì | parziale | sì — draft | fit before fashion |
| 7 — Pattern senza religione | sì | da fare | sì — draft | robustness vs complexity debt |
| 8 — Il monolite non è il nemico | sì | da fare | sì — draft | isolation vs distribution cost |
| 9 — API e contratti | sì | sì — draft | sì — draft | compatibility/idempotency |
| 10 — I dati sono architettura | sì | sì — draft | sì — draft | Microsoft/PostgreSQL/Redis/Stripe/GitHub |
| 11 — Sistemi distribuiti | sì | sì — draft | sì — draft | Microsoft/AWS/Uber |
| 12 — Cloud Architecture | sì | sì — draft | sì — draft | Microsoft/AWS/dacadoo |
| 13 — Security by Design | sì | sì — draft | sì — draft | Microsoft/NIST/OWASP/Cloudflare |
| 14 — Reliability | sì | sì — draft | sì — draft | Google SRE/Microsoft/GitHub/Cloudflare |
| 15 — Observability | sì | sì — draft | sì — draft | OpenTelemetry/Google/Microsoft |
| 16 — Testing Architecture | sì | sì — draft | sì — draft | Microsoft/Google/Meta/OWASP/Pact |
| 17 — Legacy e comprensione | sì | sì — draft | sì — draft | Microsoft/AWS/GitHub |
| 18 — Refactoring nell'era dell'AI | sì | sì — draft | sì — draft | AWS/Microsoft/GitHub/OpenRewrite |
| 19 — Architecture Evolution | sì | sì — draft | sì — draft | Thoughtworks/AWS/Microsoft/GitHub |
| 20 — Costi e decisioni | sì | sì — draft | sì — draft | Microsoft/FinOps/Uber |
| 21 — AI-ready repository | sì | sì — draft | sì — draft | GitHub/OpenAI |
| 22 — Issue-driven development | sì | sì — draft | sì — draft | GitHub/OpenAI |
| 23 — Manager di agenti | sì | sì — draft | sì — draft | OpenAI/Microsoft/GitHub |
| 24 — AI dentro l'architettura | sì | sì — draft | sì — draft | Microsoft/NIST/OWASP/OpenAI/Uber; runtime AI boundary/eval |
| 25+ | non ancora | source-first | required | research + ESI compromise + capstone update before closure |

## Evidence vocabulary

Per artefatti/capability:

```text
Designed
→ Codified
→ Verified
→ Monitored
```

Per conoscenza legacy:

```text
Found
→ Inferred
→ Observed
→ Confirmed
```

Le due scale sono indipendenti.

Una terza distinzione diventa importante per runtime AI:

```text
deterministic boundary Verified
≠
model behavior Verified
```

Un contract, validator o eval dataset può essere Codified/Verified meccanicamente senza aver ancora dimostrato groundedness o security di un modello reale.

---

# Evidence snapshot del capstone

## Infrastructure

`infra/main.bicep` è una baseline codificata.

Ancora pending:

```text
bicep build/lint
Azure Policy validation
non-production deployment
private connectivity
Entra authentication
RBAC negative test
zone/failover test
PostgreSQL HA IaC completion
PostgreSQL PITR drill
```

Nessun capitolo descrive questi gate come superati.

## Historical deterministic gates

### Capitolo 18

```text
tsc -p tsconfig.json
→ PASS

Order Operations
→ 19/19 PASS

Operations Desk Classic characterization
→ 6/6 PASS
```

Evidence valida per il layer/revisione esercitata; non è una dichiarazione perpetua su ogni commit successivo.

### Capitolo 19

```text
AF-001…AF-005
→ 5/5 PASS
```

Verifica dependency/import structure soltanto.

### Capitolo 20

```text
CF-001…CF-002
→ 2/2 PASS
```

Verifica allocation metadata/no fabricated cost-center; non billing reale.

### Capitolo 21

```text
CTX-001…CTX-004
→ 4/4 PASS
```

Verifica proprietà meccaniche del context layer; non semantic correctness delle instruction.

### Capitolo 22

```text
ISSUE-001…ISSUE-004
→ 4/4 PASS
```

Verifica readiness mechanics del work item; `OO-001` non è ancora eseguita.

### Capitolo 23

```text
AGOV-001…AGOV-005
→ 5/5 locally exercised
```

Verifica proprietà meccaniche di Delegation Contract, Verification Bundle e Autonomy Matrix.

Non dimostra:

```text
real agent execution reliability
real permission enforcement
PostgreSQL atomicity
human review quality
production autonomy
```

## Capitolo 24 — runtime AI

Nuovi artifact:

```text
docs/ai-feature-contract.md
src/ai/case-explanation.ts
evals/case-explanation-v1.jsonl
tests/ai-boundary-fitness.test.mjs
```

Nuovo use case simulato ESI:

```text
Case Explanation Assistant
```

Boundary corrente:

```text
read-only
provider-neutral
bounded deterministic context
source-backed structured output
no write tools
no vector/RAG requirement in v1
explicit fallback
```

Local verification realmente eseguita su una ricostruzione del nuovo slice:

```text
tsc
→ PASS

node --test tests/ai-boundary-fitness.test.mjs
→ 5 tests
→ 5 pass
→ 0 fail
```

La evidence supporta soltanto:

```text
AI Feature Contract/model boundary/eval seed present
provider-neutral semantic source
read-only/no-RAG-v1 mechanical boundary
known source-reference validation
missing-evidence deterministic guard
eval risk-class seed presence
```

Non supporta ancora:

```text
real model groundedness
prompt-injection resistance of a real model
provider privacy/security/network configuration
operator usefulness
latency
cost
production AI quality
model drift behavior
```

Quindi lo stato corretto è:

```text
AI Feature Contract                    Codified
CaseExplanationPort                    Codified + locally compiled
Deterministic output/source validator  Codified + locally exercised
Eval seed                              Codified
Provider/model adapter                 Pending
Provider/model decision                Pending evaluation
Real model eval                        Pending
Runtime AI observability               Designed / Pending
Production deployment                  Not started
Write tools                            Not authorized
RAG/vector retrieval                   Not selected / not required in v1
```

---

# Source pass — Capitoli 21–24

## Capitolo 21

Principali fonti:

- GitHub Docs — repository/custom instructions, `AGENTS.md`, build/test/validation context;
- OpenAI — Codex/`AGENTS.md` e task context.

Uso:

- capability/meccanismi contemporanei → claim vicini alle fonti;
- ESI Repository Map/AGENTS design → metodo del libro, non standard universale.

## Capitolo 22

Principali fonti:

- GitHub Docs/Blog — coding-agent task ben circoscritti, acceptance criteria, Issue Forms, atomic tasks/WRAP;
- OpenAI — task ben circoscritti e prompt strutturati come issue.

Uso:

- evidenza sui workflow agentici contemporanei;
- schema ESI Execution Work Item → metodo editoriale, non unico template corretto.

## Capitolo 23

Principali fonti:

- OpenAI Agents SDK — handoff, guardrail, HITL, tracing;
- Microsoft Agent Framework — sequential/concurrent/handoff/manager orchestration e approval;
- GitHub Docs — constrained coding-agent permissions/review.

Uso:

- primitive e capability reali → claim fattuali;
- A0…A4 ESI → tassonomia simulata del libro, non standard industriale.

## Capitolo 24

Principali fonti:

- Microsoft Azure Architecture Center / Foundry — AI architecture, RAG/context engineering, prompt/context design, evaluation;
- NIST AI 600-1 — Generative AI Profile / lifecycle risk management;
- OWASP — prompt injection guidance;
- OpenAI — Structured Outputs, prompt-injection source/sink framing, evaluation methodology;
- Uber Engineering — Genie, Enhanced Agentic-RAG, Michelangelo/Gen AI Gateway.

Uso:

### Microsoft

Supporta:

```text
RAG/context engineering as architecture concerns
retrieval/evaluation separation
groundedness/relevance/completeness evaluation direction
```

Non viene usata per sostenere che ESI debba adottare uno specifico Azure AI product.

### NIST / OWASP

Supportano lifecycle risk/security framing e prompt-injection/least-privilege controls.

### OpenAI

Supporta structured-output capability, source/sink security framing e cautela sui measurement/evaluation harness.

Non viene usata per sostenere che ESI debba scegliere un modello OpenAI.

### Uber

Casi reali documentati:

```text
Genie
→ internal support copilot / RAG use case

Enhanced Agentic-RAG
→ SME golden set + evaluation + retrieval/agentic improvement

Gen AI Gateway
→ policy/audit/cost/platform capability at larger organizational scale
```

I numeri riportati nel manoscritto come risultati Uber sono attribuiti a Uber e non diventano benchmark ESI.

---

# Important distinctions

## Fiction / evidence

```text
ESI decision
≠
real-world proof
```

ESI mostra come applichiamo una decisione; le fonti sostengono proprietà, pattern, incidenti o casi reali.

## Legacy

```text
Observed legacy behavior
≠
Confirmed target requirement
```

## Cost

```text
resource/model price
≠
Total Cost of Ownership
```

```text
cost per token
≠
cost per useful outcome
```

## Agentic engineering

```text
instruction
≠
permission
```

```text
issue ready
≠
issue outcome Verified
```

```text
agent can perform action
≠
agent is authorized to decide it
```

```text
reviewer consensus
≠
critical finding resolved
```

## Runtime AI

```text
model output
≠
authoritative business fact
```

```text
grounding
≠
vector database
```

```text
RAG
≠
mandatory architecture for every AI feature
```

```text
valid structured output
≠
semantic correctness
```

```text
citation present
≠
claim supported
```

```text
eval dataset exists
≠
model behavior Verified
```

```text
model benchmark improved
≠
workload regression gate passed
```

---

# Numeri simulati ESI

SLO/RTO/RPO già presenti restano requirement simulati, non benchmark:

```text
Core journey SLO: 99.9% / rolling 28 days
Escalation publication: 99% <= 5 min
Intra-region RTO: <= 15 min
Intra-region RPO: 0 committed local state
Region disaster RTO: <= 8 h
Region disaster RPO: <= 1 h
```

Priority:

```text
Payment failedAttempts >= 3 → Urgent
```

anche questa è policy simulata ESI.

Il Capitolo 24 **non inventa**:

```text
model accuracy/groundedness score
prompt-injection pass rate
AI SLO
provider latency
provider cost
monthly AI saving
operator productivity percentage
```

Questi valori restano Pending finché non esiste execution evidence.

I risultati quantitativi citati nei casi reali restano attribuiti all'organizzazione e al contesto della fonte.

---

# Workflow editoriale corrente

```text
outline
→ ESI tension / compromise framing
→ source discovery
→ draft
→ capstone update
→ executable verification where possible
→ claim audit
→ compromise audit
→ adversarial review
→ final editorial pass
```

Per brownfield/refactoring:

```text
claim provenance
→ behavior classification
→ safety plan
→ intentional difference registry
→ stop/rollback review
```

Per cost:

```text
cost driver
→ property purchased
→ unit metric + quality metric
→ owner
→ review trigger
```

Per agentic execution:

```text
persistent context
→ task work item
→ delegation/permission
→ execution
→ primary evidence
→ independent verification
→ human/policy gate where required
```

Per runtime AI:

```text
AI Feature Contract
→ authority boundary
→ authorized context
→ model/provider adapter
→ deterministic validation
→ offline eval
→ security eval
→ staging/runtime evidence
→ monitored drift/cost/quality
```

---

# Release-candidate gates futuri

Prima di una release candidata del libro:

- nessun capitolo deve restare `da fare` nell'evidence pass;
- ESI e casi reali devono restare distinguibili;
- numeri ESI non devono essere presentati come benchmark;
- pricing/capability volatile va riverificato vicino alla release;
- artifact `Codified` non vanno descritti come `Verified` senza execution evidence;
- `Monitored` richiede runtime signal reale;
- temporary migration architecture deve avere cleanup condition;
- legacy `Observed` non deve diventare silenziosamente `Confirmed`;
- work item ready non deve essere descritto come outcome Verified;
- agent governance documentata non deve essere descritta come autonomia production provata;
- AI eval seed non deve essere descritto come model quality Verified;
- ogni model/provider claim corrente va ricontrollato contro documentazione aggiornata;
- i casi reali quantitativi devono restare attribuiti alla fonte e al proprio contesto.
