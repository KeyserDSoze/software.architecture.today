# Permessi, human-in-the-loop e livelli di autonomia

Un agente non è autonomo perché può fare molte cose.

È autonomo perché può scegliere e completare una porzione di lavoro **entro confini già autorizzati** senza chiedere un nuovo intervento a ogni passo.

Questa distinzione è fondamentale.

```text
capability
≠
authorization
≠
autonomy
```

Un tool può tecnicamente consentire `delete`.

Il workflow può non autorizzarlo.

Un agente può essere autorizzato a modificare una branch di test.

Questo non significa che possa promuovere da solo quel change in produzione.

## Permission boundary

Il permission model dovrebbe partire dalle azioni, non dal ruolo narrativo.

Esempio:

| Capability | Implementer | Verifier | Human Owner |
|---|---:|---:|---:|
| read repo | sì | sì | sì |
| modify scoped files | sì | no | sì |
| run local tests | sì | sì | sì |
| modify verification oracle | solo se in scope | no | approva decisione |
| create PR/branch | sì, se workflow lo consente | no | sì |
| merge default branch | no | no | sì / repo policy |
| access production secrets | no | no | specific workflow only |
| destructive production operation | no | no | explicit approval |

Questa matrice non è universale.

Il punto è che i permessi devono riflettere:

```text
scope
risk
reversibility
data sensitivity
blast radius
verification strength
```

GitHub descrive per il proprio cloud coding agent un ambiente effimero, scope di repository/branch limitato e restrizioni sui secret; inoltre ribadisce che l'output dell'agente deve essere revisionato e testato prima del merge.

Fonte:

- [GitHub Docs — Application card: GitHub Copilot Agents](https://docs.github.com/en/copilot/responsible-use/agents)

Non stiamo dicendo che ogni piattaforma debba implementare esattamente questi controlli.

Stiamo osservando un principio utile:

> **l'autonomia cresce meglio dentro un permission boundary esplicito che dentro un prompt più severo.**

## Human-in-the-loop non significa approvare tutto

Un workflow con approval umana a ogni tool call non è realmente autonomo.

È un'interfaccia più complicata per fare click.

Al contrario, un workflow senza approval su azioni irreversibili o ad alto impatto può trasformare una interpretazione errata in un incidente.

La domanda è:

> **dove il costo di una approval è inferiore al costo atteso di una decisione sbagliata?**

OpenAI Agents SDK e Microsoft Agent Framework espongono meccanismi di human-in-the-loop che possono sospendere una run quando un tool richiede approvazione.

Fonti:

- [OpenAI Agents SDK — Human in the loop](https://openai.github.io/openai-agents-python/human_in_the_loop/)
- [Microsoft Learn — Human-in-the-loop](https://learn.microsoft.com/en-us/agent-framework/workflows/human-in-the-loop)

La tecnologia però non decide quali tool debbano avere approval.

Quello deriva dal threat model e dal business impact.

## Gate per rischio

Possiamo classificare le azioni in modo pragmatico.

### Low impact / reversible

Esempi:

```text
read files
run local typecheck
add deterministic unit test
edit code inside scoped branch
produce analysis artifact
```

Possono spesso essere autonomi.

### Medium impact

Esempi:

```text
add dependency
modify migration candidate
change API implementation
change IaC in non-production branch
modify architecture test with documented intent
```

Richiedono più verification e talvolta review dedicata.

### High impact / one-way / sensitive

Esempi:

```text
merge breaking contract
production database mutation
change tenant isolation policy
open public ingress
approve architecture exception
change Payments economic semantics
rotate or disclose credentials
production deploy with irreversible migration
```

Qui il default dovrebbe essere human gate finché non esiste una evidence molto forte che giustifichi altra autonomia.

La guida pratica OpenAI suggerisce proprio di pianificare intervento umano per high-risk actions e quando un agente supera threshold di failure/retry.

Fonte:

- [OpenAI — A practical guide to building agents](https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf)

## Un modello di autonomia

Per ESI introduciamo cinque livelli.

### A0 — Assist

```text
agent proposes
human executes
```

Esempio:

- suggerire un ADR;
- proporre query;
- elencare failure mode.

### A1 — Execute in sandbox

```text
agent may modify isolated workspace
human decides whether result moves forward
```

Esempio:

- implementazione locale;
- test;
- refactoring candidate.

### A2 — Execute + verify within bounded environment

```text
agent modifies
agent runs allowed deterministic gates
independent approval still required for merge/high-impact step
```

Esempio:

- OO-001 integration harness in ephemeral/local test environment.

### A3 — Progress through reversible delivery stages

```text
agent may create PR
respond to review
run approved non-production checks
advance while gates remain green
```

Human gate rimane su merge o su specifiche decisioni ad alto impatto.

### A4 — Bounded autonomous operation

```text
agent may execute predefined production/repository actions
within explicit policy
with runtime monitoring
rollback/stop condition
human escalation
```

Questo livello richiede evidence operativa molto più forte.

Non lo adottiamo oggi per Order Operations.

## L'autonomia è per capability, non per agente

Dire:

```text
Agent X = level 3
```

è spesso troppo grossolano.

Meglio:

```text
read repository       A4-like automatic
edit scoped branch    A2/A3
add dependency        A2 + review
merge main            human gate
production DB write   A0/A1 only unless separately authorized
```

Quindi la **AI Autonomy Matrix** deve essere capability-based.

## Autonomia dinamica

Il livello può cambiare con l'evidence.

Per esempio:

```text
new workflow
→ A1

50 low-risk runs with stable evidence
→ candidate A2

new tool with external side effect
→ back to A1/A0 for that capability
```

Autonomy non è una promozione permanente del modello.

È una proprietà del sistema socio-tecnico:

```text
agent
+ task
+ tool
+ environment
+ policy
+ verification
+ observed reliability
```

Se cambia uno di questi elementi, la matrice può dover cambiare.

## Fail closed vs fail open

Un approval system deve decidere anche cosa accade se l'approvatore non è disponibile.

Per una operazione high-risk:

```text
no approval
→ no execution
```

Per una analisi non mutativa:

```text
no approver
→ analysis can continue
```

Questo è lo stesso tipo di decisione che abbiamo incontrato in security e reliability.

## Approval fatigue

Troppi gate umani producono un failure mode noto:

```text
approval
approval
approval
→ reviewer stops reading
→ click through
```

Il risultato è peggiore di un buon gate automatico.

Quindi:

> **un approval manuale deve proteggere una decisione, non certificare ritualisticamente che un processo è passato di lì.**

Riduciamo approval con:

- scope più piccolo;
- policy automatizzate;
- deterministic gates;
- permission granulari;
- rollback sicuro;
- evidence bundle leggibile.

## ESI: autonomia iniziale

Per OO-001:

```text
read canonical context
→ autonomous

edit test harness / test-only adapters
→ autonomous within branch/workspace

run local PostgreSQL integration environment
→ autonomous if isolated and credential-free

add a test-only dependency
→ allowed but must be reported/justified

rewrite existing migrations
→ STOP

use shared production Azure resources
→ STOP

change data ownership
→ STOP

merge
→ human/repository gate
```

Questa è circa una autonomia A2 sul task.

Non perché l'agente non possa tecnicamente fare di più.

Ma perché **l'evidence disponibile non giustifica ancora un blast radius maggiore**.

> **L'autonomia non si concede in base a quanto sembra intelligente il modello. Si concede in base a quanto è governabile il failure.**
