# 23.8 — ESI: il primo operating model agentico di Order Operations

ESI non introduce uno swarm generico e non parte da una piattaforma multi-agent.

Parte da OO-001, il work item costruito nel capitolo precedente:

```text
Verify PostgreSQL atomicity
for Payment Escalation + Outbox
```

È un candidato utile perché ha un outcome osservabile, scope già bounded, canonical context, acceptance property e stop condition. Non cambia business semantics, non sposta ownership e non richiede production access.

In altre parole: **il task è abbastanza decidibile da poter delegare execution senza delegare una nuova decisione di prodotto**.

## L'obiettivo non è produrre più codice

Commerce & Operations vuole aumentare throughput, ma formula l'obiettivo in modo più preciso:

> **ridurre human time speso sulla bounded execution preservando qualità della decisione e qualità della verification.**

Questa frase cambia il design.

Se l'obiettivo fosse semplicemente “far lavorare più agenti”, potremmo creare planner, implementer, test agent, security agent e reviewer fin dal primo task. Ma OO-001 non giustifica tutto quel coordination cost.

Engineering ha bisogno di un executor capace di costruire un integration harness e riparare difetti locali. Platform non vuole una mini-piattaforma sproporzionata. Security non vuole production credential o permission escalation ad hoc. Architecture non vuole che una migration o una fitness rule vengano cambiate per ottenere verde. Finance non vuole che il workflow multi-agent costi più dell'evidence che compra.

La soluzione deve quindi comprare separazione **soltanto dove serve**.

## La topologia scelta

ESI adotta:

```text
Human Decision Owner
        ↓
Implementer Agent
        ↓
deterministic PostgreSQL evidence
        ↓
Independent Verifier role
        ↓
Human / repository merge gate
```

Non esiste un Planner Agent separato: OO-001 è già execution-ready. L'Implementer produce un piano breve prima del primo write, ma planning e implementation restano nello stesso mandate.

Specialist review scatta soltanto su trigger. Security/Platform entra se il test environment richiede permission, network o risorse condivise oltre il contract. Architecture entra se migration semantics o verification policy devono cambiare. Product/Domain entra se emerge una nuova business decision.

Questo è il primo esempio concreto di **role separation by risk**.

## Agent Delegation Contract — `ADC-OO-001-v1`

ESI introduce:

```text
docs/agent-delegation-contract.md
```

Il contract non ricopia OO-001. La referenzia e aggiunge il mandato operativo.

La baseline è:

```text
Delegation ID
ADC-OO-001-v1

Work item
OO-001

Role
Implementer

Autonomy
A2 — Execute + verify in bounded environment

Goal
Produce real PostgreSQL evidence for TST-005
without changing Payment Escalation semantics.
```

L'Implementer può leggere il repository, modificare lo scope test/integration, avviare un PostgreSQL isolato, applicare la migration chain corrente, eseguire i gate e aggiungere una dependency test-only giustificata.

Non può fare merge, usare production credential, usare production Azure resource, modificare Payments ownership, introdurre un nuovo authoritative fact, riscrivere migration `001/002` per ottenere verde, indebolire fitness rule o aumentare il proprio livello di autonomia.

Il contract aggiunge inoltre un repair budget:

```text
initial complete attempt
+ at most 2 bounded repair loops
```

Quando il budget termina o una stop condition scatta, il risultato valido è `Stopped`, non execution infinita.

## Verification Bundle — progettato prima del diff

ESI introduce anche:

```text
docs/agent-verification-bundle.md
```

Il documento non dichiara che OO-001 sia verificata. Definisce la forma del pacchetto che dovrà esistere **se e quando** l'execution verrà completata.

I claim sono:

| Claim | Proprietà |
|---|---|
| C-01 | migration `001 → 002` eseguita su PostgreSQL reale |
| C-02 | success committa escalation + outbox insieme |
| C-03 | failure sulla seconda write rollbacka entrambe |
| C-04 | fast suite resta indipendente dal PostgreSQL integration environment |
| C-05 | la closure mantiene esplicito il boundary dell'evidence |

Per ogni claim il bundle richiede mechanism, result, primary evidence reference, verifier finding e limitation.

Lo stato corrente resta:

```text
Primary evidence             Pending
Independent verifier result  Pending
Human acceptance             Pending
```

Questa distinzione è deliberata. **Un template di verification non è verification.**

## AI Autonomy Matrix — capability, non modello

Il terzo artifact è:

```text
docs/ai-autonomy-matrix.md
```

La matrice non dice “questo agente è A2”. Distingue capability.

Per la baseline del Capitolo 23, repository read/search può essere molto autonomo; plan ed edit scoped worktree sono A2; local deterministic test può procedere automaticamente dentro il repository boundary; PostgreSQL isolato per OO-001 resta A2; changing functional semantics, data ownership e architecture oracle restano A0 o proposal-only; merge e high-impact action rimangono human/repository gate.

Order Operations non concede A4 production capability.

La matrice rende anche esplicito che l'autonomia può diminuire quando cambiano tool, dati, reversibilità o observed failure behavior.

> **La matrice descrive il rischio che ESI sa governare oggi, non il potenziale teorico del modello.**

## Human gate: accettare evidence senza rifare l'execution

Il human owner non deve diventare un secondo executor.

Quando OO-001 verrà eseguita, riceverà work item, diff, Verification Bundle, primary evidence reference, finding e limitation. Potrà quindi decidere se accettare scoped evidence, richiedere change o fermare il flusso per una nuova decisione.

Il merge resta human/repository gate in questa fase.

È un costo consapevole. ESI preferisce più latenza di acceptance a una self-certification che non ha ancora evidence sufficiente per essere automatizzata.

## Il fitness test rende meccanico il minimo governabile

ESI aggiunge:

```text
tests/agent-governance-fitness.test.mjs
```

La baseline contiene cinque check:

| ID | Proprietà protetta |
|---|---|
| AGOV-001 | Delegation Contract, Verification Bundle, Autonomy Matrix e OO-001 esistono |
| AGOV-002 | `ADC-OO-001-v1` resta bounded a OO-001/A2 e non concede merge/production/autonomy escalation |
| AGOV-003 | il bundle conserva C-01…C-05, primary evidence, independent verification, limitation e `Not verified` |
| AGOV-004 | high-impact decision restano dietro human gate / A0 / forbidden boundary |
| AGOV-005 | gli artifact non possono dichiarare OO-001 già eseguita o agent reliability già osservata |

AGOV-005 è particolarmente importante. Protegge il libro e il capstone dallo stesso anti-pattern che combattiamo da molti capitoli: **confondere un design con evidence che non esiste**.

Il test non dimostra che la governance sia semanticamente perfetta. Impedisce almeno che alcune proprietà meccaniche fondamentali driftino in silenzio.

## Stato ESI dopo il Capitolo 23

A questo punto il progetto può dichiarare:

```text
Agent Delegation Contract       Codified
Verification Bundle structure   Codified
AI Autonomy Matrix              Codified
Agent governance fitness        Codified + locally verifiable
OO-001 delegation               Designed / Codified at A2
OO-001 PostgreSQL execution     Not yet executed
OO-001 primary evidence         Pending
Independent verifier result     Pending
Observed production reliability No dataset yet
A4 production capability        Not authorized
```

Questa è la maturity corretta.

ESI ha costruito **il sistema che potrà governare una execution delegata**. Non ha ancora prodotto l'evidence che quella execution funzioni.

## Quando aumenteremo autonomia

ESI non promuoverà una capability perché arriva un modello più nuovo.

Guarderà evidence di workflow: accepted scoped task rate, repair loop, stop-condition quality, verifier finding dopo implementer `PASS`, policy violation, human review effort e cost per verified change.

Se quei segnali migliorano in modo stabile e il permission enforcement è reale, una capability potrà candidarsi ad A3. Se cresce blast radius, entrano dati sensibili o compaiono recurring false green, l'autonomia può diminuire.

L'autonomia non è una ricompensa all'agente. È una decisione di rischio dell'organizzazione.

## Il compromesso ESI

ESI accetta un secondo passaggio di verification, più metadata per task delegati e un human merge gate. In cambio compra permission contenute, provenance migliore, meno self-certification e un percorso misurabile per aumentare autonomia in futuro.

Il quality floor resta business semantics, Payments ownership, migration provenance, data ownership, oracle integrity, assenza di production credential e limitation esplicite.

> **Il primo operating model agentico di ESI non massimizza quanta execution può essere automatizzata. Massimizza quanta execution può essere delegata senza perdere la capacità di spiegare chi l'ha autorizzata, quale evidence la sostiene e chi può accettarla.**
