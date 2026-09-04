# OO-002 — Evaluate Case Explanation model/provider candidates against the same eval suite

## Type

`Execution`

## Problem

The Case Explanation Assistant has a provider-neutral semantic boundary, an AI Feature Contract and a seed eval suite, but no model/provider has been selected or evaluated.

Current state:

```text
AI semantic boundary
= Codified + locally exercised

real model groundedness
= Pending

prompt-injection resistance
= Pending

latency
= Pending

cost
= Pending

provider/data boundary
= Pending decision evidence
```

Selecting a provider from familiarity, popularity or a single demo would violate `fit before fashion` and would not produce comparable evidence.

## Outcome

Produce a comparable, reviewable evaluation bundle for at least two viable model/provider candidates using the same versioned Case Explanation eval suite and the same business/security boundary.

The work item is complete when ESI can make a model/provider decision based on evidence rather than demo confidence.

This task does **not** require selecting a provider if the evidence is insufficient.

## Current evidence

Canonical current evidence:

- `docs/ai-feature-contract.md` — feature semantics, authority and fallback boundary;
- `evals/case-explanation-v1.jsonl` — initial scenario set;
- `src/ai/case-explanation.ts` — provider-neutral contract and deterministic validation;
- `tests/ai-boundary-fitness.test.mjs` — mechanical boundary checks;
- `docs/threat-model.md` — AI-specific threat direction;
- `docs/testing-strategy.md` — AI evaluation layer.

Known current verification:

```text
TypeScript compile
→ PASS during Chapter 24

AI boundary fitness
→ 5/5 PASS during Chapter 24
```

No real model/provider behavior has yet been Verified.

## Scope

May:

- identify at least two viable model/provider candidates;
- use primary provider documentation for capability/security/operational constraints;
- implement replaceable adapters outside the semantic core if required for evaluation;
- build a repeatable local/non-production eval harness;
- execute `evals/case-explanation-v1.jsonl` against each candidate;
- capture raw outputs and structured evaluator results;
- measure request latency in the evaluation environment;
- record token/request/provider cost evidence available for the evaluated run;
- record model/provider/configuration version;
- add deterministic evaluation helpers/tests;
- extend the eval set **only** when a new failure case is discovered and the reason/provenance is documented consistently for all candidates;
- prepare an evidence-backed recommendation or an explicit `No decision — evidence insufficient` result.

## Out of scope

Must not:

- modify confirmed business semantics;
- grant the model write/remediation tools;
- add production customer data to eval fixtures;
- add arbitrary web browsing or external retrieval to make one candidate look better;
- introduce a vector database/RAG pipeline unless the AI Feature Contract is explicitly reopened;
- weaken tenant/security boundaries;
- change the eval oracle only because a candidate fails it;
- select a model from brand preference or benchmark unrelated to this workload;
- deploy the selected candidate to production;
- mark runtime quality `Monitored`;
- fabricate provider pricing, latency or quality metrics.

## Canonical context

- `AGENTS.md`
- `docs/repository-map.md`
- `docs/one-man-project-operating-model.md`
- `docs/ai-feature-contract.md`
- `docs/threat-model.md`
- `docs/testing-strategy.md`
- `docs/observability-contract.md`
- `docs/cost-model.md`
- `docs/architecture-fitness-checklist.md`
- `evals/case-explanation-v1.jsonl`
- `src/ai/case-explanation.ts`

## Acceptance criteria

- **AC-01 — Same workload:** every candidate is evaluated against the same versioned core eval set and equivalent context boundary.
- **AC-02 — Grounding evidence:** confirmed facts/hypotheses never reference unknown source IDs after deterministic validation; unsupported claims are surfaced as failures.
- **AC-03 — Missing evidence:** cases requiring insufficient-evidence behavior are not forced into confident answers merely to increase completion rate.
- **AC-04 — Security cases:** prompt-injection, cross-tenant and authority-violation scenarios are executed and reported separately from nominal quality.
- **AC-05 — Reproducibility:** candidate, provider, model/config version, prompt/adapter version and eval-set version are recorded with the result.
- **AC-06 — Operational comparison:** latency and available cost/usage evidence are collected in a comparable form without presenting non-production measurements as production SLO/cost.
- **AC-07 — Evidence integrity:** raw model output/evaluation evidence remains inspectable; summary claims are traceable to primary evidence.
- **AC-08 — No oracle laundering:** failed cases remain failed unless the underlying requirement/eval case is changed through an explicit reviewed decision applied consistently across candidates.
- **AC-09 — Recommendation is conditional:** any recommendation states known limitations, unverified production properties and review triggers.

## Verification

```text
AC-01
→ eval harness records common eval-set version + source-context policy per candidate

AC-02
→ deterministic CaseExplanation validation + evaluator review on groundedness/source support

AC-03
→ EVAL missing/ambiguous scenarios + explicit result classification

AC-04
→ EVAL-004 / EVAL-005 / EVAL-006 / EVAL-007 and any approved additional adversarial cases

AC-05
→ versioned evaluation result metadata

AC-06
→ captured request timing + provider usage/cost evidence from the evaluated run where available

AC-07
→ raw-output/evidence artifact retained in non-production evaluation bundle

AC-08
→ diff/review of eval-set changes; no candidate-specific silent oracle change

AC-09
→ Agent Verification Bundle or equivalent human-reviewed decision evidence
```

## Constraints

- Follow `docs/one-man-project-operating-model.md` WIP policy.
- Treat this work item as **T2 Cross-boundary**.
- Do not activate another T2 task concurrently merely because execution capacity is available if the accountable lead cannot review both safely.
- Use simulated/sanitized evaluation data only.
- Authorization remains outside the model.
- The model remains advisory/read-only.
- Provider SDKs must not leak into domain/application semantics; adapter boundary remains replaceable.
- Provider choice is an architecture/cost/security decision, not a package preference.
- Production credentials and customer data are forbidden.

## Stop conditions

Stop and escalate if:

1. a candidate requires sending data outside the approved provider/security boundary;
2. evaluation requires production customer data;
3. a provider requires a tool/write capability not present in the AI Feature Contract;
4. a meaningful candidate comparison requires reopening the retrieval strategy or introducing RAG/vector infrastructure;
5. the eval set is found to encode an ambiguous or unconfirmed business semantic;
6. Security/Legal review is required by provider retention/data-processing behavior;
7. a candidate can only pass by weakening a critical injection/authority/tenant case;
8. the task becomes a production deployment task;
9. the accountable lead would need to increase agent permission/autonomy beyond the active governance boundary to finish the task.

## Dependencies

```text
Blocked by:
- access to approved non-production model/provider candidates when execution begins

Blocks:
- Case Explanation provider/model ADR
- production adapter decision
- runtime quality/cost baseline

Related:
- Chapter 24 AI Feature Contract
- Chapter 25 One-Man Project Operating Model
- AI boundary fitness

Decision required from:
- Accountable Project Lead for technical recommendation
- Product/Operations for usefulness/UX acceptance
- Security when provider/data boundary changes or requires review
- Platform when a shared provider gateway/network capability is required
- Finance/FinOps when cost trade-off becomes material
```

## Closure evidence

Record on completion:

```text
Outcome achieved
Candidate/provider/model versions
Eval-set version
Adapters/harness changed
Commands / checks executed
Per-candidate evaluation result
Critical security case result
Latency evidence
Cost/usage evidence
Primary raw evidence location
Independent verifier findings
Known limitations
Not verified
Recommendation or No-decision result
Follow-up / review trigger
```

## AI execution notes

If delegated:

- follow `AGENTS.md` and `docs/one-man-project-operating-model.md`;
- use the same workload/eval oracle for every candidate;
- do not silently optimize the prompt or context differently for only the preferred candidate without recording the variant;
- do not convert provider marketing claims into evaluation evidence;
- do not treat an LLM-as-judge score as the only evidence for critical security/authority cases;
- report ambiguity and stop when a stop condition is reached.

Current state:

```text
OO-002 execution contract
= Codified

OO-002 execution
= Not started / Pending

Model/provider decision
= Pending
```
