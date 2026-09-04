# Order Operations — AI Autonomy Matrix

> **Scenario fittizio ESI.** Baseline dopo il Capitolo 23. La matrice classifica capability in contesto; non assegna un livello globale permanente a un modello o a un agente.

## Principle

> **L'autonomia non si concede in base a quanto sembra intelligente il modello. Si concede in base a quanto è governabile il failure.**

## Levels

### A0 — Assist

```text
agent proposes
human decides/executes
```

### A1 — Execute in isolated workspace

```text
agent may create/modify candidate artifacts in a sandbox/worktree
human decides whether the candidate progresses
```

### A2 — Bounded execution + bounded verification

```text
agent may modify scoped artifacts
run approved local/test gates
repair inside bounded scope
cannot cross decision/high-impact gates autonomously
```

### A3 — Reversible workflow progression

```text
agent may progress through predefined reversible repository/non-production stages
while policy and evidence gates remain satisfied
human/high-impact gates remain explicit
```

### A4 — Bounded autonomous operation

```text
agent may execute predefined high-trust operational actions
inside runtime policy, monitoring, rollback and escalation boundaries
```

Order Operations currently grants **no A4 production capability**.

## Current capability matrix

| Capability | Level | Why | Required gate | Trigger to reconsider |
|---|---:|---|---|---|
| Read/search Order Operations repository | A3 | low-impact, required for context | repository access boundary | repository/data sensitivity changes |
| Read canonical docs/work items | A3 | navigation/context | repo boundary | sensitive data introduced |
| Produce execution plan inside an execution-ready work item | A2 | bounded interpretation allowed | scope/stop-condition check | repeated task amplification |
| Edit scoped source/test files on isolated branch/worktree | A2 | reversible execution | work item + Delegation Contract | permission or blast radius grows |
| Run `npm run typecheck` / fast local tests | A3 | deterministic local evidence | no secret/prod dependency | command begins touching external state |
| Run isolated test PostgreSQL for OO-001 | A2 | higher-fidelity evidence, still bounded | ADC-OO-001-v1 | shared/privileged environment required |
| Add justified test-only dependency | A2 | reversible but introduces supply/maintenance cost | closure evidence + dependency review | sensitive/networked dependency |
| Create/update task branch or PR | A2/A3 | reversible change surface | repository policy | workflow/permission model changes |
| Respond to non-semantic review comments | A2 | bounded repair | repair budget | review asks for scope/semantics change |
| Modify functional semantics | A0 | changes product meaning | Product/Operations decision | new delegation policy with explicit domain gate |
| Change Payments economic semantics | A0 | Payments & Risk ownership | Payments & Risk human/domain decision | none by default |
| Introduce new authoritative data owner | A0 | architectural/domain authority | explicit data/architecture decision | none by default |
| Rewrite historical migration semantics to make a test pass | Forbidden in current workflow | destroys evidence/provenance | new migration decision | only via separate work item/ADR |
| Modify architecture/security verification oracle to pass current task | A0/A1 proposal only | risk of green-by-editing-the-oracle | explicit policy decision | independent architecture review |
| Approve own architecture exception | Forbidden | separation of duties | human architecture owner | never implicit |
| Open public Internet ingress | A0 | security/topology change | Threat Model + architecture/security decision | explicit product need |
| Access production secrets/customer data | Forbidden for coding workflow | sensitive/high impact | dedicated future operational workflow | separate threat/permission design |
| Merge default branch | Human/repository gate | final change authority | required review/policy | future policy change with strong evidence |
| Execute destructive production DB mutation | A0 | one-way/high-impact | dedicated runbook + approval + recovery evidence | only dedicated future workflow |
| Autonomous production deploy | A0 | current evidence insufficient | production readiness + deployment policy | future Chapter 26 readiness evidence |

## OO-001 baseline

```text
Work item
OO-001

Delegation
ADC-OO-001-v1

Implementer autonomy
A2

Independent verification
required before evidence acceptance

Merge
human/repository gate
```

## Autonomy increase rule

Do not increase autonomy because:

```text
new model release
higher benchmark score
agent claims confidence
more verbose reasoning
```

Consider increase when observed evidence supports it.

Candidate measures:

```text
accepted scoped task rate
repair loops per task
stop-condition precision
unexpected scope expansion
verification findings after implementer PASS
permission/policy violations
human review minutes per accepted task
cost per verified change
rollback/repair frequency
```

## Autonomy reduction triggers

Reduce the relevant capability when:

1. toolset or permission scope changes materially;
2. sensitive/regulated/customer data enters the workflow;
3. task becomes less reversible;
4. recurring verifier findings show false-green behavior;
5. repair loops grow materially;
6. agent attempts unauthorized oracle/policy modification;
7. a stop condition is bypassed instead of escalated;
8. new external side effects appear;
9. human reviewers can no longer explain/validate the evidence bundle efficiently;
10. cost grows without proportional verified throughput.

## Human approval triggers

Human/domain approval remains mandatory for current baseline when a change requires:

```text
new or changed business semantics
new economic side effect
new authoritative data ownership
breaking external contract
public ingress / major security boundary
architecture exception
one-way migration
production credential/resource access
production destructive action
merge/default-branch acceptance
```

## Approval fatigue rule

Do not add human approval for actions that can be safely protected by:

- narrow permissions;
- deterministic policy;
- reversible isolated environment;
- bounded test gate;
- automatic rollback/stop.

Human approval should protect a meaningful decision.

## Relationship to Threat Model

Agent capability changes must be reviewed against:

```text
docs/threat-model.md
docs/security-control-matrix.md
```

Particularly:

- credential exposure;
- data exfiltration;
- privilege escalation;
- malicious/untrusted instructions;
- unsafe tool execution;
- supply-chain changes;
- unauthorized production reachability.

## Relationship to Cost Model

Agent autonomy has cost drivers:

```text
model/inference cost
tool execution cost
sandbox/runtime cost
review cost
repair loops
verification cost
failure/rework cost
```

Review against:

```text
docs/cost-model.md
```

Future preferred unit metrics include:

```text
cost per accepted delegated task
cost per verified change
human review minutes per accepted delegated task
```

No production values are currently available.

## Relationship to Agent Verification Bundle

Higher autonomy requires stronger evidence.

Current simplified rule:

```text
A1
→ candidate artifact + human inspection

A2
→ scoped execution + deterministic evidence + independent review when claim warrants it

A3
→ stable policy/gates + reversible progression + evidence bundle + monitored workflow quality

A4
→ runtime policy + observability + rollback + production readiness + escalation evidence
```

## Governance

An executor may report that the current autonomy level is insufficient.

It may propose:

```text
capability requested
reason
risk
alternative
required evidence
```

It may not unilaterally update this matrix to obtain the permission required by its current task.

## Current state

```text
Autonomy Matrix               Codified
OO-001 A2 delegation          Designed + documented
A2 runtime enforcement        Partially platform-dependent / Pending full enforcement
A3 production workflow        Not authorized
A4 production operation       Not authorized
Observed agent reliability    No production dataset yet
```

> **Autonomy is versioned architecture: when tools, risk, environment or evidence change, the decision must be reviewable again.**
