# 22.6 — Agenti, scope e stop condition

La issue diventa davvero importante quando l'executor può muoversi velocemente e senza possedere tutto il contesto informale del team.

Un agente competente è molto efficace dentro un boundary chiaro. Lo stesso agente, davanti a un boundary ambiguo, può trasformare un'incertezza piccola in un patch molto ampio e perfettamente coerente con una decisione che nessuno aveva autorizzato.

Per questo lo scope non deve essere letto come una lista rigida di file. È una **superficie di decisione concessa**.

## Libertà locale, non sovranità

Un work item execution-ready dovrebbe permettere all'executor di scegliere le soluzioni locali reversibili senza dover chiedere approvazione a ogni riga.

Nel caso di OO-001, per esempio, l'executor può decidere il meccanismo più piccolo e riproducibile per eseguire PostgreSQL reale, aggiungere una dependency test-only se giustificata e introdurre gli helper necessari al test harness.

Non può però reinterpretare `PaymentEscalation`, cambiare ownership, riscrivere una migration storica o indebolire la tenant isolation soltanto perché una di queste scorciatoie renderebbe più facile il test.

Quindi il boundary utile non è:

```text
may edit these four files
```

È:

```text
may choose implementation details inside this property boundary
must stop when the task requires a new semantic / architecture / authority decision
```

> **Autonomia locale significa libertà sul come, non libertà di cambiare silenziosamente il perché e il che cosa.**

## La stop condition trasforma un imprevisto in un output corretto

Durante execution può emergere evidence che il work item non prevedeva.

Supponiamo che il PostgreSQL harness applichi la migration `002` e scopra che lo schema reale contraddice il Data Ownership Map. Oppure che per riprodurre il failure scenario sia necessario modificare production behavior. Oppure ancora che una architecture fitness rule impedisca la soluzione proposta.

Un executor senza stop condition ha tre opzioni implicite: ignorare il problema, aggirarlo o allargare il task.

Un executor con stop condition ha una quarta opzione, molto più sana:

```text
Stopped
Evidence collected
Decision required
Candidate follow-up
```

Il task non è “fallito” perché non ha prodotto codice. Ha scoperto che la premessa di execution non era più valida.

Questo è un risultato importante: rende visibile il punto esatto in cui il lavoro ha smesso di essere implementation ed è diventato decisione.

## Task amplification: distinguere ciò che è necessario da ciò che è soltanto vicino

Gli agenti hanno un vantaggio e un rischio comune: vedono opportunità adiacenti mentre lavorano.

Un commento incoerente, una dependency outdated, una doc obsoleta o una piccola refactor opportunity possono apparire nello stesso percorso. Assorbirli tutti nel diff sembra efficiente, ma sposta progressivamente il task lontano dall'acceptance originale.

La classificazione più utile è:

```text
required for acceptance
→ include

useful but independent
→ record follow-up

changes semantics / authority / architecture
→ stop and escalate
```

Questo criterio lascia libertà locale senza trasformare “non uscire mai dalla file list” in una regola cieca.

Un test harness può legittimamente richiedere un nuovo package script. Non è legittimato per questo a ridisegnare il database.

## L'oracle non è un ostacolo da spostare

Uno dei failure mode più pericolosi appare quando l'executor controlla contemporaneamente implementation e criterio di giudizio.

```text
architecture rule fails
→ edit architecture rule
→ green
```

oppure:

```text
acceptance fixture disagrees with implementation
→ rewrite fixture
→ green
```

Il problema non è che test, fixture o policy siano immutabili. Possono diventare sbagliati. Ma cambiare l'oracle è **un'altra decisione** rispetto a soddisfarlo.

Per OO-001 le migration `001` e `002` sono baseline storica del task. Se il test dimostra che una di esse ha un problema, il risultato corretto è evidenziare il problema e riaprire la decisione, non modificare la baseline finché il test passa.

> **Un executor può proporre di cambiare la regola che lo giudica. Non dovrebbe poterla cambiare silenziosamente per approvare il proprio lavoro.**

Questa separazione prepara il modello di agent governance del Capitolo 23.

## Instruction e permission sono ancora due cose diverse

Una issue può dire “non fare deploy in production”. `AGENTS.md` può ripeterlo. Entrambe sono informazioni utili, ma non costituiscono da sole un permission boundary.

Il sistema di esecuzione deve applicare credential, environment protection e authorization coerenti con il rischio del task. GitHub distingue a sua volta rationale/approval del workflow dalle permission effettive applicate alla superficie di esecuzione.[^github-approvals]

La conseguenza architetturale è semplice:

```text
work-item boundary
→ tells the executor what is authorized

permission boundary
→ limits what the executor can actually do
```

Servono entrambi quando il blast radius lo richiede.

## Lo scope può cambiare, ma deve cambiare visibilmente

Una issue non è una tavola di pietra.

Nuova evidence può rendere sensato ampliare o ridurre lo scope. Il processo sano è però esplicito:

```text
new evidence
→ pause
→ update issue / linked decision
→ review changed boundary
→ resume
```

Questo preserva provenance. Chi legge la issue mesi dopo può capire che cosa era autorizzato all'inizio, che cosa abbiamo scoperto e perché il task è cambiato.

Il processo fragile è il contrario:

```text
new evidence
→ silent reinterpretation
→ larger patch
→ reviewer reconstructs the decision after the fact
```

Più l'execution è veloce, più questa differenza conta.

> **L'agente autonomo utile non è quello che non si ferma mai. È quello che distingue un ostacolo esecutivo da una nuova decisione e rende visibile il passaggio fra i due.**

---

[^github-approvals]: GitHub Docs, *About rationale, confidence, and approvals for issues*, https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-automation-rationale-and-approvals
