# Workflow reali e failure mode agentici

Quando una tecnologia è nuova, è facile raccontarla attraverso demo perfette.

Un task entra.

Gli agenti collaborano.

La soluzione esce.

Il mondo reale è meno lineare.

Le piattaforme che stanno portando coding agent e agent framework in produzione stanno rendendo visibili gli stessi problemi che abbiamo discusso finora:

- permission;
- review;
- isolation;
- human approval;
- tracing;
- context;
- cost;
- overreliance.

Non useremo questi prodotti come prova che esista un'unica architettura agentica corretta.

Li useremo come evidence che **governare l'execution è parte del problema**.

## GitHub: agent output dentro un PR workflow

GitHub documenta il proprio cloud coding agent come executor che lavora in un ambiente di sviluppo effimero e produce modifiche tramite branch/pull request, con permission e secret limitati.

La stessa documentazione insiste sul fatto che il contenuto generato debba essere reviewato e testato prima del merge.

Fonte:

- [GitHub Docs — Application card: GitHub Copilot Agents](https://docs.github.com/en/copilot/responsible-use/agents)

La documentazione dedicata alla review dell'output dice inoltre che una pull request prodotta dall'agente merita la stessa review rigorosa di qualsiasi altro contributo.

Fonte:

- [GitHub Docs — Review output from Copilot](https://docs.github.com/en/copilot/how-tos/copilot-on-github/use-copilot-agents/review-copilot-output)

La lezione per ESI non è:

```text
use GitHub Copilot coding agent
```

È:

> **l'agent execution diventa più governabile quando entra in un normale change-control surface con diff, review e policy, invece di avere un canale privilegiato verso main o produzione.**

## GitHub: AI review è signal, non infallibilità

GitHub documenta che Copilot code review può commettere errori e raccomanda di validarne il feedback e integrarlo con review umana.

Fonte:

- [GitHub Docs — About GitHub Copilot code review](https://docs.github.com/en/copilot/concepts/agents/code-review)

Questo sostiene una posizione importante del capitolo:

```text
AI implementer
→ AI reviewer
```

può essere utile.

Ma non crea magicamente una proof chain indipendente.

Il valore aumenta quando la review è accompagnata da:

- deterministic gates;
- evidence primaria;
- repository policy;
- human escalation per claim ad alto impatto.

## OpenAI: handoff, guardrail, tracing e human intervention

OpenAI Agents SDK espone come primitive distinte:

- agenti;
- handoff;
- guardrail;
- human-in-the-loop;
- tracing.

Fonti:

- [OpenAI Agents SDK](https://openai.github.io/openai-agents-python/)
- [OpenAI Agents SDK — Handoffs](https://openai.github.io/openai-agents-python/handoffs/)
- [OpenAI Agents SDK — Human in the loop](https://openai.github.io/openai-agents-python/human_in_the_loop/)
- [OpenAI Agents SDK — Tracing](https://openai.github.io/openai-agents-python/tracing/)

La guida pratica OpenAI alla costruzione di agenti raccomanda di prevedere human intervention per high-risk actions e quando vengono superate soglie di fallimento.

Fonte:

- [OpenAI — A practical guide to building agents](https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf)

La lezione non è che ogni workflow debba usare questi componenti.

È che:

> **routing, permission, guardrail, approval e observability sono responsabilità diverse e meritano di essere progettate separatamente.**

## Microsoft: orchestration pattern differenti

Microsoft Agent Framework documenta orchestration:

```text
Sequential
Concurrent
Handoff
Group Chat
Magentic / manager-driven
```

con supporto per human-in-the-loop e approval di tool all'interno dei workflow.

Fonti:

- [Microsoft Learn — Workflow orchestrations](https://learn.microsoft.com/en-us/agent-framework/workflows/orchestrations/)
- [Microsoft Learn — Human-in-the-loop](https://learn.microsoft.com/en-us/agent-framework/workflows/human-in-the-loop)

Il fatto che esistano più pattern è già un indizio importante:

> non esiste una topologia multi-agent che sia migliore per ogni problema.

Come con monolite, microservizi e cloud compute, la domanda rimane:

```text
quale proprietà compra questa topologia?
```

## Failure mode: shared misconception amplification

Scenario:

```text
Planner misunderstands requirement
→ creates 6 tasks
→ 6 agents execute correctly
→ all outputs are wrong in the same direction
```

Il parallelismo ha moltiplicato un errore di comprensione.

Guardrail:

```text
shared decision synchronization
before fan-out
```

## Failure mode: verifier capture

Scenario:

```text
Implementer creates code + tests + explanation
Verifier reads only implementer explanation
→ PASS
```

Il verifier è formalmente separato ma epistemicamente dipendente.

Guardrail:

```text
access to primary evidence
+ adversarial rubric
+ raw result sampling
```

## Failure mode: handoff erosion

Scenario:

```text
Agent A knows:
- ED-001 expected difference
- migration stop condition
- ownership boundary

handoff summary:
"Implement priority migration"

Agent B receives summary only
→ treats ED-001 as bug
→ changes target behavior back to legacy
```

Guardrail:

```text
handoff carries work item ID
+ canonical context
+ stop conditions
+ current evidence state
```

## Failure mode: delegation escalation

Scenario:

```text
agent cannot complete task
→ asks for more permission
→ permission granted ad hoc
→ still cannot complete
→ asks for more
```

Dopo alcuni passaggi l'agente possiede capability molto più ampie di quelle previste dal threat model.

Guardrail:

```text
permission change
→ new decision
→ explicit owner
→ expiry/review
```

Non:

```text
just this once
```

## Failure mode: autonomous oracle weakening

Scenario:

```text
architecture test fails
→ agent changes architecture test
→ verifier sees green suite
→ merge
```

È il nostro:

> **green-by-editing-the-oracle**

Guardrail:

- verification oracle fuori scope;
- policy change separata;
- human/architecture approval;
- diff-aware review.

## Failure mode: infinite repair loop

Scenario:

```text
build fails
→ agent patches
→ different test fails
→ agent patches
→ architecture fitness fails
→ agent patches
→ behavior drifts
```

Il sistema continua perché non esiste una stop condition.

Guardrail:

```text
retry / repair budget
→ stop
→ report evidence
→ escalate
```

## Failure mode: consensus theatre

Scenario:

```text
5 agents review
4 say PASS
1 finds cross-tenant leakage
→ majority PASS
```

Abbiamo applicato voto democratico a severità non comparabili.

Guardrail:

```text
risk-weighted gate
```

Un finding critico può bloccare anche contro una maggioranza positiva.

## Failure mode: expensive swarm

Scenario:

Un task di due file usa:

```text
planner
implementer
unit-test agent
security agent
architecture agent
review agent
synthesis agent
```

Il workflow funziona.

Ma costa più tempo, token e coordinamento del task stesso.

Guardrail:

> **multi-agent topology must justify its coordination cost.**

La Cost Model del Capitolo 20 vale anche qui.

Possiamo misurare in futuro:

```text
cost per accepted task
cost per verified change
human review minutes per accepted change
agent repair loops per task
```

non soltanto token.

## Failure mode: deskilling through invisible management

Un team può diventare molto produttivo senza riuscire più a spiegare:

- perché una policy esiste;
- quale agent ha introdotto un boundary;
- come una verification viene interpretata;
- quali failure mode il workflow copre.

Il manager umano diventa coordinatore di output che non comprende.

Questo è esattamente ciò che il libro vuole evitare.

> **Gestire agenti non significa smettere di capire software. Significa usare la comprensione per governare una quantità di execution che prima non potevamo permetterci.**

## Il caso reale non elimina il giudizio

GitHub, OpenAI e Microsoft ci mostrano capability e mitigazioni reali.

Non ci dicono quale autonomia debba concedere ESI.

Quella decisione dipende da:

```text
business impact
security boundary
reversibility
verification maturity
team capability
cost
failure history
```

È ancora Software Architecture.
