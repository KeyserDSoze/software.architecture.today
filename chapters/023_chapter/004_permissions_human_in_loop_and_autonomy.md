# 23.4 — Permessi, human-in-the-loop e livelli di autonomia

Un agente non diventa autonomo perché dispone di molti tool.

Diventa autonomo quando può scegliere e completare una porzione di lavoro **dentro un boundary già autorizzato**, senza trasformare ogni passo in una nuova richiesta di permission.

Questa distinzione è fondamentale:

```text
capability
≠ authorization
≠ autonomy
```

Un tool può supportare `delete`. Il workflow può vietarlo. Un agente può modificare una branch isolata e restare non autorizzato al merge. Può eseguire una migration in un test database e non avere alcun diritto di toccare produzione.

> **L'autonomia non misura quanto può fare il modello. Misura quanto lontano una capability può avanzare senza superare il rischio che il sistema sa governare.**

## Il permission boundary viene prima del prompt

Una instruction può dire “non usare production credential”. È utile, ma non è un permission boundary.

Il sistema di esecuzione deve riflettere il mandato attraverso sandbox, branch protection, tool allowlist, credential scope, environment policy e approval hook quando il rischio lo richiede.

GitHub descrive per il proprio cloud coding agent un ambiente effimero, repository/branch scope e restrizioni sui secret, insieme alla necessità di revieware e testare il risultato prima del merge.

Fonte:

- [GitHub Docs — Application card: GitHub Copilot Agents](https://docs.github.com/en/copilot/responsible-use/agents)

Non prendiamo quel modello come blueprint universale. Ci interessa la proprietà:

> **un limite applicato dal runtime continua a esistere anche quando l'agente interpreta male il testo.**

Per questo il permission model deve seguire scope, reversibilità, sensibilità dei dati, blast radius e forza della verification disponibile.

## Human-in-the-loop: proteggere decisioni, non introdurre click rituali

Un human gate a ogni tool call rende il workflow nominalmente sicuro ma praticamente poco autonomo. Un workflow senza gate su una one-way door può invece trasformare una singola interpretazione errata in un incidente.

La domanda utile è economica e di rischio:

> **dove il costo di chiedere approval è inferiore al costo atteso di una decisione sbagliata?**

OpenAI Agents SDK e Microsoft Agent Framework espongono meccanismi human-in-the-loop che possono sospendere una run prima di tool call sensibili.

Fonti:

- [OpenAI Agents SDK — Human in the loop](https://openai.github.io/openai-agents-python/human_in_the_loop/)
- [Microsoft Learn — Human-in-the-loop](https://learn.microsoft.com/en-us/agent-framework/workflows/human-in-the-loop)

La tecnologia sospende. Il Threat Model, il business impact e la reversibilità decidono **quando** la sospensione è necessaria.

Approval umana ha alto valore per nuove business semantics, security boundary, data ownership, breaking contract, production credential, destructive migration e architecture exception. Ha molto meno valore per una lettura di file o un typecheck locale protetto da permission strette.

## Approval fatigue è un failure mode di governance

Se ogni azione richiede approvazione, il reviewer smette progressivamente di valutare il significato e inizia ad approvare il flusso.

```text
approval
→ approval
→ approval
→ click-through
```

Il risultato è verification theatre.

Per evitarlo spostiamo verso policy automatica ciò che è deterministico e reversibile: narrow permission, branch isolation, architecture fitness, security scanner, bounded test environment e stop automatici. Conserviamo human attention per ciò che richiede judgment o risk acceptance.

> **Un approval manuale dovrebbe proteggere una decisione, non certificare che il workflow è passato davanti a una persona.**

## Una scala di autonomia, non una classifica del modello

ESI introduce cinque livelli come linguaggio comune. Non sono una maturity ladder da scalare obbligatoriamente.

| Livello | Significato operativo | Esempio |
|---|---|---|
| A0 — Assist | l'agente propone; l'umano decide/esegue | candidate ADR, query, failure hypothesis |
| A1 — Isolated execution | l'agente crea artifact candidati in sandbox/worktree | refactoring candidate, local prototype |
| A2 — Bounded execution + verification | modifica scope autorizzato ed esegue gate approvati | OO-001 in PostgreSQL isolato |
| A3 — Reversible workflow progression | avanza in stage repository/non-prod predefiniti finché policy ed evidence restano valide | PR/review/non-prod flow reversibile |
| A4 — Bounded autonomous operation | esegue azioni operative predefinite dentro runtime policy, monitoring, rollback ed escalation | future operational capability, non concessa oggi a ESI |

La differenza fra A2 e A3 non è “il modello è più bravo”. È che il sistema sa governare un tratto più lungo del workflow senza nuova approval.

A4 richiede ancora più evidence: non basta un agente affidabile in sandbox; servono production readiness, runtime observability, rollback, permission enforcement e escalation realmente provati.

Order Operations non concede oggi alcuna capability production A4.

## L'autonomia appartiene alla capability in contesto

Dire `Agent X = A3` è troppo grossolano.

Lo stesso agente può leggere il repository quasi automaticamente, modificare una worktree a livello A2, proporre una architecture change a livello A0 e non avere alcuna permission su production secret.

La forma più utile è quindi capability-based:

```text
read canonical context
→ high autonomy

edit scoped branch
→ bounded autonomy

change data ownership
→ human/domain gate

production destructive action
→ separate dedicated authorization
```

Questo è il motivo per cui l'AI Autonomy Matrix del capitolo non classifica un modello. Classifica **azioni nel loro contesto di rischio**.

## L'autonomia può crescere soltanto con evidence osservata

Un nuovo model release, un benchmark più alto o un output più eloquente non sono ragioni sufficienti per aumentare blast radius.

Il livello può essere riesaminato quando abbiamo evidence su task realmente eseguiti: accepted task rate, repair loop, finding del verifier dopo `PASS`, scope violation, review effort, cost per verified change e qualità delle stop condition.

La direzione può anche invertirsi.

Se aggiungiamo un tool con side effect esterno, introduciamo customer data, aumentiamo irreversibilità o vediamo recurring false green, la capability deve tornare a un livello più basso anche se il modello non è cambiato.

```text
agent
+ task class
+ tool
+ environment
+ permission
+ verification
+ observed behavior
= autonomy decision
```

> **Autonomy is versioned architecture.**

## Fail closed e fail open dipendono dalla decisione

Anche il gate umano ha un failure behavior.

Se nessun approvatore è disponibile, un'analisi read-only può continuare. Una production data mutation non dovrebbe normalmente partire “per non bloccare il workflow”.

Questa è la stessa disciplina incontrata in security e reliability: il comportamento in assenza del controllo fa parte del design.

Per high-impact action la baseline è:

```text
no approval
→ no execution
```

Non perché ogni agent workflow debba essere conservativo, ma perché il costo del failure è diverso.

## ESI: OO-001 parte da A2

OO-001 è il primo caso concreto.

L'Implementer può leggere il contesto canonical, modificare il test harness nel branch/worktree, avviare un PostgreSQL isolato, eseguire i gate e aggiungere una test-only dependency giustificata.

Non può riscrivere migration `001/002`, usare production Azure, cambiare ownership, modificare l'oracle per ottenere verde o fare merge sulla default branch.

Il task è quindi circa A2: **execute + verify dentro un environment bounded**, con independent verification e human/repository merge gate.

Non è un limite imposto perché l'agente “non sembra abbastanza intelligente”. È una conseguenza della evidence disponibile oggi sul workflow.

> **L'autonomia non si concede in base a quanto sembra intelligente il modello. Si concede in base a quanto è governabile il failure.**
