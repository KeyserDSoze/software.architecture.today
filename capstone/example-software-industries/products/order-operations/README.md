# Order Operations

> **Prodotto simulato/composito di Example Software Industries S.p.A. (ESI).**

Order Operations è il capstone principale di *Software Architecture Today* e appartiene alla business unit **Commerce & Operations**.

I capitoli spiegano **perché** il progetto cambia. Questa directory conserva **lo stato corrente** delle decisioni, del codice e dell'evidence accumulata.

## Product goal

Ridurre il tempo necessario agli operatori per individuare, comprendere e gestire ordini che richiedono attenzione operativa.

Order Operations non sostituisce Orders, Payments o Shipping come authoritative source.

## Regola di evoluzione

> **Il progetto deve evolvere perché cambia il contesto, non perché il libro deve mostrare una tecnologia.**

## Evoluzione capitolo per capitolo

| Capitolo | Evoluzione principale |
|---|---|
| 1 | prima console interna per ordini problematici |
| 2 | problem framing, analisi funzionale condivisa e acceptance criteria |
| 3 | system context e dipendenze |
| 4 | ADR e lookup live prima del read model |
| 5 | responsibility/ownership boundary |
| 6 | quality attributes e fit before fashion |
| 7 | pattern soltanto quando una forza li giustifica |
| 8 | modular monolith invece di microservices prematuri |
| 9 | primi API Contract read-oriented |
| 10 | Data Ownership Map e prima migration PostgreSQL |
| 11 | Payment Escalation, transactional outbox e Failure Mode Map |
| 12 | Azure application landing zone e Cloud Deployment Map |
| 13 | Threat Model, Security Control Matrix e prima baseline Bicep |
| 14 | Reliability Contract, SLO/RTO/RPO e zone resilience direction |
| 15 | Observability Contract e telemetry port vendor-neutral |
| 16 | Testing Strategy e prima suite eseguibile |
| 17 | Operations Desk Classic, characterization e Legacy Understanding Map |
| 18 | PriorityPolicy seam, shadow comparison e Refactoring Safety Plan |
| 19 | Architecture Fitness Checklist e architecture fitness |
| 20 | Cost Model, unit economics e cost fitness |
| 21 | `AGENTS.md`, Repository Map e context fitness |
| 22 | issue-driven development, work-item template e OO-001 |
| 23 | Agent Delegation Contract, Verification Bundle e AI Autonomy Matrix |
| 24 | Case Explanation Assistant, AI Feature Contract, eval seed e AI boundary fitness |
| 25 | One-Man Project Operating Model, secondary maintainer, WIP policy, OO-002 e continuity direction |

---

# Stato funzionale corrente

## Payment Escalation

```text
OperationalCase
→ Payment Escalation
→ local transaction
   ├── PaymentEscalation
   └── OutboxMessage
→ async delivery
→ Payments & Risk
```

Order Operations possiede l'intenzione di escalation; Payments & Risk mantiene ownership della semantica economica.

## Priority migration

Target semantics confermate nello scenario ESI:

```text
Closed                  → NotActionable
manualHold              → ManualReview
Payment failures >= 3   → Urgent
otherwise               → Standard
```

Il vecchio behavior:

```text
Enterprise + age >= 30m → URGENT
```

è stato rimosso tramite decisione funzionale esplicita e registrato come:

```text
ED-001 — ExpectedDifference
```

Coexistence direction:

```text
PriorityPolicy seam
├── LegacyPriorityAdapter
└── ConfirmedPriorityPolicy

BranchingPriorityPolicy
modes: legacy | shadow | candidate
```

Il production candidate cutover non è ancora autorizzato.

## Case Explanation Assistant — Capitolo 24

Prima capability AI **dentro** il runtime del prodotto.

Obiettivo:

```text
operator
→ authorized case context
→ AI explanation
→ confirmed facts + hypotheses + missing evidence + sources
```

V1 boundary:

```text
read-only
+ deterministic context assembly
+ provider-neutral CaseExplanationPort
+ structured source-backed result
+ no write tools
+ no vector/RAG dependency required yet
+ explicit fallback
```

Authoritative boundary:

```text
model interpretation
≠
authoritative business fact
```

Il modello non può decidere:

```text
PaymentStatus
Priority
refund/remediation
business authorization
tenant access
```

Nuovi artifact:

```text
docs/ai-feature-contract.md
src/ai/case-explanation.ts
evals/case-explanation-v1.jsonl
tests/ai-boundary-fitness.test.mjs
```

Current provider/model decision:

```text
Pending eval comparison
```

Nessun adapter OpenAI/Azure/Anthropic o altro è stato ancora inserito nel semantic core.

## One-Man Project pilot — Capitolo 25

Il Case Explanation Assistant diventa il primo pilot ESI del **One-Man Project operating model**.

Il modello significa:

```text
one accountable project lead
+ bounded agent portfolio
+ secondary maintainer
+ specialist/domain gates
+ WIP limits
+ independent verification where required
+ explicit exit triggers
```

Non significa:

```text
one source of truth
one reviewer
one sovereign authority
one person required for every incident/change
```

Nuovo artifact:

```text
docs/one-man-project-operating-model.md
```

Initial WIP policy simulata ESI:

```text
Max active execution tasks       2
Max active cross-boundary tasks  1
Max unresolved semantic gates    1
```

Continuity direction:

```text
Secondary Maintainer
+ repository-first handoff
+ planned continuity/vacation drill
```

Current continuity evidence:

```text
Designed
not yet executed
```

Il file esistente non viene trattato come prova di continuity.

---

# Agentic engineering state

## Repository context

```text
AGENTS.md
docs/repository-map.md
```

Il repository distingue:

```text
persistent canonical context
≠
current work-item context
```

## Current work items

```text
OO-001
Verify PostgreSQL atomicity for Payment Escalation + Outbox

OO-002
Evaluate Case Explanation model/provider candidates against the same eval suite
```

Stato:

```text
OO-001 execution contract = Codified
OO-001 PostgreSQL execution = Pending

OO-002 execution contract = Codified
OO-002 model/provider evaluation = Pending
```

Entrambi sono classificati `T2 Cross-boundary` nel current One-Man Project Operating Model.

Ready non significa che debbano essere entrambi Active contemporaneamente.

## Delegation baseline

```text
Delegation ID
ADC-OO-001-v1

Implementer autonomy
A2 — bounded execution

Independent verification
required

Merge
human/repository gate
```

Artifact:

```text
docs/agent-delegation-contract.md
docs/agent-verification-bundle.md
docs/ai-autonomy-matrix.md
```

Nessuna A4 production capability è autorizzata.

OO-002 richiederà una task-specific delegation decision se verrà eseguita tramite il modello agentico del Capitolo 23.

---

# Evidence già accumulata

Le evidence restano legate al gate realmente eseguito.

```text
Chapter 18
Order Operations application/refactoring       19/19 PASS at that revision
Operations Desk Classic characterization        6/6 PASS

Chapter 19
Architecture fitness AF-001…AF-005             5/5 PASS

Chapter 20
Cost fitness CF-001…CF-002                     2/2 PASS

Chapter 21
Context fitness CTX-001…CTX-004                4/4 PASS

Chapter 22
Issue readiness ISSUE-001…ISSUE-004            4/4 PASS

Chapter 23
Agent governance AGOV-001…AGOV-005             5/5 locally exercised

Chapter 24
AI boundary compile + AI-001…AI-005             5/5 locally exercised

Chapter 25
One-Man Project fitness test                    Codified; local execution not completed in authoring runtime due GitHub DNS failure
```

Chapter 24 local verification:

```text
tsc
→ PASS for the provider-neutral AI contract

node --test tests/ai-boundary-fitness.test.mjs
→ 5 tests
→ 5 pass
→ 0 fail
```

Chapter 25 authoring-runtime verification attempt:

```text
git clone https://github.com/KeyserDSoze/software.architecture.today.git
→ failed: Could not resolve host github.com
```

Quindi:

```text
one-man-project-fitness.test.mjs
= Codified
= not yet locally Verified in Chapter 25 authoring runtime
```

Non inventiamo il PASS.

---

# Evidence model

Per artefatti e capability:

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

Current snapshot:

```text
TypeScript application/refactoring source        Codified + previously typechecked
Legacy priority characterization                 Verified 6/6
Architecture fitness AF-001…AF-005              Verified locally 5/5
Cost fitness CF-001…CF-002                      locally exercised 2/2
Context fitness CTX-001…CTX-004                 locally exercised 4/4
Issue readiness ISSUE-001…ISSUE-004             locally Verified 4/4
Agent governance AGOV-001…AGOV-005              locally exercised 5/5
AI Feature Contract                             Codified
CaseExplanationPort + deterministic validator   Codified + locally compiled
AI eval seed                                    Codified
AI boundary fitness AI-001…AI-005               locally exercised 5/5
One-Man Project Operating Model                 Codified
OO-002 execution contract                       Codified / execution Pending
One-Man Project fitness                         Codified / local execution Pending
Continuity/vacation drill                       Designed / Pending
Runtime model/provider adapter                  Pending
AI eval execution                               Pending
PostgreSQL integration via OO-001               Pending
Production priority shadow telemetry            Pending
Candidate priority cutover                      Not authorized
Azure security/network verification             Pending
Recovery drills                                 Pending
Production observability evidence               Pending
A3/A4 production agent autonomy                 Not authorized
```

---

# Struttura corrente

```text
order-operations/
├── AGENTS.md
├── README.md
├── package.json
├── tsconfig.json
├── database/
│   ├── README.md
│   └── migrations/
├── docs/
│   ├── repository-map.md
│   ├── functional-analysis.md
│   ├── requirements.md
│   ├── architecture-context.md
│   ├── architecture-fitness-checklist.md
│   ├── api-contract.md
│   ├── data-ownership.md
│   ├── failure-mode-map.md
│   ├── cloud-deployment.md
│   ├── threat-model.md
│   ├── security-control-matrix.md
│   ├── reliability-contract.md
│   ├── observability-contract.md
│   ├── testing-strategy.md
│   ├── cost-model.md
│   ├── legacy-understanding-map.md
│   ├── refactoring-safety-plan.md
│   ├── agent-delegation-contract.md
│   ├── agent-verification-bundle.md
│   ├── ai-autonomy-matrix.md
│   ├── ai-feature-contract.md
│   ├── one-man-project-operating-model.md
│   ├── events/
│   └── adr/
├── evals/
│   └── case-explanation-v1.jsonl
├── infra/
├── src/
│   ├── application/
│   ├── contracts/
│   ├── integration/
│   ├── observability/
│   ├── priority/
│   └── ai/
├── tests/
│   ├── agent-context-fitness.test.mjs
│   ├── agent-governance-fitness.test.mjs
│   ├── ai-boundary-fitness.test.mjs
│   ├── architecture-fitness.test.mjs
│   ├── cost-fitness.test.mjs
│   ├── issue-readiness-fitness.test.mjs
│   ├── one-man-project-fitness.test.mjs
│   ├── payment-escalation.test.mjs
│   ├── outbox-publisher.test.mjs
│   └── priority-policy.test.mjs
└── work-items/
    ├── TEMPLATE.md
    ├── OO-001-postgresql-escalation-outbox-atomicity.md
    └── OO-002-case-explanation-model-evaluation.md
```

Legacy system separato:

```text
example-software-industries/
├── legacy/operations-desk-classic/
└── products/order-operations/
```

---

# Documenti da mantenere sincronizzati

Quando il prodotto cambia verifichiamo almeno:

- `AGENTS.md` e Repository Map quando cambia navigation/execution context;
- Functional Analysis e Requirements quando cambia semantica;
- API/event contract e Data Ownership Map quando cambiano contract/authority;
- Threat Model, Security Control Matrix e Reliability Contract quando cambia il blast radius;
- Observability Contract e Cost Model quando cambia il comportamento operativo;
- Testing Strategy e eval dataset quando cambia la superficie di rischio;
- AI Feature Contract quando cambiano model authority, context, retrieval, tool, output o fallback;
- One-Man Project Operating Model quando cambiano WIP, decision rights, specialist trigger, secondary maintainer, continuity o exit criteria;
- Agent Delegation Contract / Verification Bundle / Autonomy Matrix quando cambia la governance degli executor;
- work item corrente quando cambia scope/outcome/evidence del task;
- Architecture Fitness Checklist quando una proprietà merita protezione continua.

---

# Regole correnti di evoluzione

> **Il repository contiene ciò che resta vero fra i task. La issue contiene ciò che deve diventare vero nel task corrente.**

> **Il Delegation Contract dice che cosa puoi fare. Il Verification Bundle dice che cosa hai dimostrato. L'Autonomy Matrix dice fino a dove puoi procedere.**

> **Il modello può proporre un'interpretazione. Il sistema decide ancora che cosa è vero e che cosa è autorizzato.**

> **Grounding è un requisito. RAG è una possibile soluzione.**

> **One accountable lead non significa one source of truth.**

> **Il One-Man Project deve massimizzare leverage senza diventare un single point of failure umano.**

## Obiettivo finale

Alla fine del libro il lettore deve poter confrontare la prima iterazione con il sistema finale e capire non soltanto **che cosa** è cambiato, ma **quale nuova informazione, trade-off o evidence ha reso necessario ogni cambiamento**.