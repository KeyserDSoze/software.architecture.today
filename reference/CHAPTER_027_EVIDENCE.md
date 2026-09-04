# Chapter 27 — Evidence Audit

Chapter:

> **Casi end-to-end**

## Editorial status

```text
Draft               yes
Source-first pass   yes
ESI compromise pass yes
Capstone evolution  yes
```

## Scenario boundary

All three ESI cases are fictional/composite:

```text
Campaign Launchpad
Operations Desk Classic → Order Operations Priority
Case Explanation Assistant
```

They demonstrate application of the book's method.

They are not real-company evidence.

## Main external sources

### Microsoft Learn — Azure Static Web Apps

Source:

- https://learn.microsoft.com/en-us/azure/static-web-apps/overview

Supported claims:

- Static Web Apps provides hosting for static web content;
- repository changes can drive build/deployment workflow;
- the product supports API/serverless integration and authentication/authorization capabilities.

Use in chapter:

- technology-fit evidence for Campaign Launchpad's managed/static-first option.

Not inferred:

```text
small marketing product
→ must use Azure Static Web Apps
```

### Microsoft Azure Well-Architected — Operational Excellence / Testing

Sources:

- https://learn.microsoft.com/en-us/azure/well-architected/operational-excellence/principles
- https://learn.microsoft.com/en-us/azure/well-architected/operational-excellence/testing

Supported framing:

- safe deployment practices;
- automated/repeatable deployment;
- testing aligned with business objectives/risk;
- incremental/progressive exposure;
- recovery/compensating actions;
- environment fidelity proportional to workload risk.

Use in chapter:

- end-to-end case method and Campaign Launchpad production-readiness direction.

### GitHub Engineering — Rails 3.2 → 5.2

Source:

- https://github.blog/engineering/infrastructure/upgrading-github-from-rails-3-2-to-5-2/

Supported claims:

- GitHub used dual boot across Rails versions;
- CI exercised multiple versions;
- testing and production rollout were incremental;
- production exposure was increased while observing exception/performance behavior;
- the migration was performed without stopping normal feature/bug-fix development.

Use in chapter:

- real brownfield evidence anchor for coexistence + progressive verification.

Not inferred:

```text
all legacy migrations
→ must use dual boot
```

### Uber Engineering — Genie

Source:

- https://www.uber.com/gb/en/blog/genie-ubers-gen-ai-on-call-copilot/

Supported framing:

- Uber built an internal generative-AI copilot for on-call/support Q&A;
- the system uses enterprise knowledge sources for response generation.

Use in chapter:

- real-world AI-assistant anchor.

### Uber Engineering — Enhanced Agentic-RAG

Source:

- https://www.uber.com/us/en/blog/enhanced-agentic-rag/

Supported claims:

- SMEs curated a golden set of 100+ queries for the described engineering security/privacy workload;
- Uber reported that initial response quality was insufficient for broader deployment;
- Uber reports a relative 27% increase in acceptable answers and relative 60% reduction in incorrect advice after the described enhancements.

Use in chapter:

- evaluation-before-rollout evidence.

Important limitation:

```text
Uber percentages
= Uber workload result
≠ ESI target
≠ universal RAG benchmark
```

## ESI case 1 — Campaign Launchpad

Scenario claims only:

```text
Marketing Technology business unit
approved-template workflow
managed/static-first direction
One-Man Project fit hypothesis
conditional bounded-launch direction
```

Current capstone evidence:

```text
problem/scope docs     Codified
architecture direction Designed/Codified as documentation
production readiness   Designed
implementation         Not started
runtime evidence       Not started
```

Do not describe Campaign Launchpad as implemented or deployed.

## ESI case 2 — Priority brownfield

Evidence reused from earlier chapters:

```text
legacy characterization     6/6 PASS at recorded revision
target/refactoring slice    19/19 PASS at recorded revision
architecture fitness       5/5 PASS at recorded revision
```

Current production state remains:

```text
LB-PRIORITY-CANDIDATE
= NOT AUTHORIZED
```

because runtime shadow/cutover/retirement evidence remains pending.

## ESI case 3 — Case Explanation Assistant

Current deterministic boundary evidence from Chapter 24:

```text
provider-neutral AI contract compile PASS
AI boundary fitness 5/5 locally exercised at recorded revision
```

Still pending:

```text
real model/provider evaluation
real groundedness
prompt-injection resistance
latency
cost
operator usefulness
runtime observability
```

Current production state:

```text
LB-AI
= NOT READY / DISABLED FOR CORE LAUNCH
```

## Chapter 27 compromise

```text
Need
show the same architecture method across very different ESI workloads

Tension
enterprise coherence
vs
workload-specific fit

Decision
shared company guardrails where differentiation is low
+ workload-specific technology/topology where forces differ

Accepted cost
some platform standardization
+ some justified exceptions
+ multiple operating models

Quality floor
identity/security ownership, evidence provenance, operability, cost attribution and functional authority remain explicit

Trigger
repeated exceptions, repeated local solutions, platform friction, security divergence, cost fragmentation or unowned products
```

## Release pass reminders

Before release candidate:

- verify all Microsoft/GitHub/Uber URLs still resolve;
- keep Campaign Launchpad clearly fictional;
- do not imply Static Web Apps is the only valid implementation;
- keep GitHub migration details proportional to the source;
- keep Uber quantitative results attributed to Uber;
- keep current ESI readiness states aligned with capstone documents;
- do not present old local test evidence as proof of current production behavior.
