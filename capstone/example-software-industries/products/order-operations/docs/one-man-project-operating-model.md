# Order Operations — One-Man Project Operating Model

> **Scenario fittizio ESI.** Baseline introdotta nel Capitolo 25. Questo documento governa il pilot One-Man Project per il Case Explanation Assistant.

## Purpose

Consentire a un singolo accountable lead di governare più execution grazie ad agenti e automazione **senza** rendere Order Operations dipendente dalla memoria, dalla presenza continua o dall'autorità unilaterale di quella persona.

## Current scope

```text
Pilot capability
Case Explanation Assistant

Product
Order Operations

Business unit
Commerce & Operations

Current phase
pre-provider selection / evaluation preparation
```

Il pilot non cambia l'ownership di Orders, Payments, Shipping, Priority o remediation.

## Principle

> **One accountable lead ≠ one source of truth ≠ one authority ≠ one person required for continuity.**

## Accountable Project Lead

Role:

```text
technical control-plane lead for the pilot
```

May decide within current documented boundaries:

```text
work-item decomposition
agent role selection
bounded implementation details
local reversible design
provider adapter shape outside semantic core
local verification sequencing
WIP scheduling
```

May propose but not unilaterally approve:

```text
new business semantics
payment/economic side effects
security exception
public ingress
new authoritative data owner
regulated retention change
production destructive migration
production AI write-tool permission
```

## Secondary Maintainer

A secondary maintainer is required for the pilot.

Expected capability:

1. enter through `AGENTS.md`;
2. navigate with `docs/repository-map.md`;
3. explain the AI Feature Contract;
4. execute golden verification commands;
5. find active/ready work items;
6. distinguish `Designed`, `Codified`, `Verified`, `Monitored`;
7. locate escalation and specialist gates;
8. assume temporary control-plane ownership if the lead is unavailable.

Current named individual:

```text
Not modeled in the book.
```

The role exists; no fictional employee identity is required.

## WIP policy

Initial ESI pilot policy:

```text
Max active execution tasks       2
Max active cross-boundary tasks  1
Max unresolved semantic gates    1
```

These are simulated operating limits, not external benchmarks.

Review if:

```text
review backlog grows
agent repair loops recur
lead attention becomes bottleneck
parallel work repeatedly collides
```

## Task classes

```text
T0 Mechanical
T1 Local behavioral
T2 Cross-boundary
T3 Decision-changing
```

Current examples:

```text
OO-001 real PostgreSQL atomicity evidence
→ T2 Cross-boundary

OO-002 Case Explanation model/provider evaluation
→ T2 Cross-boundary

new refund semantics
→ T3 Decision-changing
```

Two T2 work items may both be Ready; the WIP policy does not require them to be Active simultaneously.

## Agent portfolio

| Role | Purpose | Permission direction | Typical task class |
|---|---|---|---|
| Explorer | repository/provider/source discovery | read-only | T0–T2 discovery |
| Implementer / Eval Implementer | bounded code/test/eval work | scoped workspace, no production data | T0–T2 |
| Independent Verifier | inspect primary evidence, rerun allowed gates | read/test/eval | T1–T2 |
| Documentation Synchronizer | synchronize canonical docs after approved change | scoped docs | T0–T1 |
| Adversarial/Security Reviewer | challenge failure/security assumptions | review only unless separately delegated | T1–T2 |

A role does not imply a distinct model instance when separation of duties is unnecessary.

## Decision rights and specialist triggers

| Trigger | Lead authority | Required gate |
|---|---|---|
| local reversible implementation | decide | none beyond normal verification |
| model/provider candidate within existing AI Feature Contract | prepare/recommend | Product usefulness review; Security if provider/data boundary changes |
| new business semantics | propose only | Product / Operations |
| new payment/economic action | no unilateral authority | Payments & Risk |
| new public ingress | propose only | Security + Platform |
| new sensitive data/provider retention behavior | propose only | Security + Legal/Compliance when applicable |
| new shared AI gateway/platform capability | propose | Platform + Security + FinOps as relevant |
| destructive production migration | no unilateral authority | explicit human/owner approval |

## Verification model

### Self-verifiable within bounded execution

```text
typecheck
fast deterministic tests
mechanical fitness gates
bounded eval harness execution
```

### Independent verification required when declared

```text
Agent Verification Bundle claim review
critical AI eval failure review
architecture/security-sensitive work item
```

### Real-environment evidence required

```text
PostgreSQL semantics
Azure identity/network behavior
production/runtime model latency and cost
production observability/recovery
```

### Human/domain acceptance required

```text
business usefulness
new semantic rule
specialist-gated decision
one-way door
```

## Continuity plan

Canonical entry points:

```text
AGENTS.md
docs/repository-map.md
README.md
```

Current execution context:

```text
work-items/
```

Current AI context:

```text
docs/ai-feature-contract.md
evals/case-explanation-v1.jsonl
src/ai/case-explanation.ts
```

Current agent governance:

```text
docs/agent-delegation-contract.md
docs/agent-verification-bundle.md
docs/ai-autonomy-matrix.md
```

Golden commands:

```bash
npm run typecheck
npm test
```

## Continuity / vacation drill

Planned scenario:

```text
Accountable Project Lead unavailable
→ Secondary Maintainer receives repository + approved enterprise systems
→ reconstruct current state
→ execute golden commands
→ explain open work / risk / non-authorities
→ perform one bounded safe verification or change
```

Required evidence:

```text
what was understood without asking the lead
what was ambiguous/stale
what command/gate was executed
what decision boundary was identified
knowledge debt discovered
```

Current state:

```text
Designed
not yet executed
```

A file existing is not continuity evidence.

## Current work portfolio

```text
OO-001
PostgreSQL escalation + outbox atomicity
Ready / execution Pending

OO-002
Case Explanation model/provider evaluation
Ready after work-item creation / execution Pending
```

Current policy:

```text
Do not activate both T2 tasks merely because agents are available.
```

## Operating cadence

### Daily / active-work review

```text
review evidence before launching more work
resolve stop/escalation events
keep active T2 count within policy
```

### Weekly / milestone review

```text
review backlog and WIP
review agent retry/rework
review knowledge debt
review specialist-gate frequency
review current fit of One-Man Project model
```

### Before production-readiness progression

```text
continuity drill
operational ownership review
production support/on-call decision
open evidence-gap review
```

## Metrics — no invented values

### Outcome

```text
verified outcome throughput
lead time to accepted evidence
operator/business outcome when runtime exists
```

### Quality

```text
rework
unexpected verification failure
escaped defect / rollback when runtime exists
```

### Control plane

```text
review backlog
unresolved decision age
active WIP
stop/escalation count and reason
```

### Agent economics

```text
cost per verified outcome
repair/retry count
human review effort
```

### Continuity

```text
continuity drill result
open tribal-knowledge item
secondary maintainer ability to run golden commands
```

Current quantitative state:

```text
Designed / Pending real workflow data
```

## Shared enterprise leverage

The pilot depends on capabilities that are not produced by the single lead:

```text
ESI identity platform
Azure landing zone / networking
CI/CD direction
managed cloud services
security governance
enterprise observability
Finance/FinOps
Product / domain expertise
Payments & Risk authority
```

Do not attribute this platform leverage to the individual.

## Exit triggers

Reevaluate the One-Man Project operating model when:

1. review backlog grows persistently;
2. 24/7 support/on-call load exceeds sustainable coverage;
3. specialist gates become continuous rather than exceptional;
4. external/public consumers materially increase contract surface;
5. AI runtime becomes write-capable or business-critical;
6. one-way-door frequency increases;
7. secondary maintainer cannot stay sufficiently familiar;
8. lead absence blocks normal operation or safe change;
9. agent rework/repair cost erodes leverage;
10. operational workload crowds out product/architecture thinking.

Possible response:

```text
add maintainer
create stable team
split responsibility
extract shared platform capability
reduce scope
```

Changing the operating model is not failure.

## Evidence state

```text
Operating Model document         Codified
WIP / decision-right policy      Codified
Secondary Maintainer role        Designed
Continuity drill                 Pending
Real workflow throughput         Pending
Real agent cost per outcome      Pending
Production support fit           Pending
```

> **Il pilot è pronto a essere governato secondo questo modello. Non è ancora evidence che il modello funzioni bene in produzione.**
