# Esercizi e sintesi

Production Readiness è il punto in cui formule come “robusto”, “sicuro” o “quasi pronto” smettono di essere sufficienti.

Per una promessa di launch dobbiamo riuscire a indicare:

```text
property
launch boundary
evidence
limitation
owner
residual risk
```

Se una di queste parti è opaca, la review ha ancora lavoro da fare.

## Esercizio 1 — Trasforma “siamo pronti” in claim

Parti da:

> Il database è production-ready.

Scomponi la frase in claim verificabili: migration repeatable, transaction invariant, backup, restore, security/connectivity boundary. Per ciascuno indica required evidence, current evidence, limitation e owner.

L’obiettivo è mostrare quanto poco significhi una readiness label unica.

## Esercizio 2 — Due launch boundary

Definisci per lo stesso sistema un internal pilot e un external 24x7 launch.

Confronta user cohort, traffic, support, DR, capacity, security exposure, rollout e compliance. Poi identifica quali quality floor non cambiano nonostante la scala diversa.

## Esercizio 3 — Blocker, Accepted Risk o Follow-up?

Classifica questi gap rispetto a un launch boundary esplicito:

```text
restore never tested
no multi-region
alert drill pending
optional dashboard missing
cross-tenant negative test missing
AI assistant not evaluated but disabled
```

Per ogni caso aggiungi impact, mitigation e acceptance authority. Se non hai abbastanza information per classificare il rischio, usa `Unknown` invece di forzare una risposta.

## Esercizio 4 — Che cosa significa davvero rollback?

Prendi una modifica reale e descrivi code rollback, configuration rollback, feature/traffic rollback, data recovery, forward repair e business compensation.

Quali sono realmente disponibili? In quale momento una via di ritorno scompare?

## Esercizio 5 — Evidence audit

Prendi cinque righe verdi di una checklist esistente e chiedi quale primary evidence le sostiene. Se trovi soltanto screenshot, document presence o memoria di qualcuno, descrivi il claim che quella evidence può realmente sostenere e quello che invece sta implicitamente promettendo troppo.

## Esercizio 6 — Runbook exercise

Fai eseguire un runbook da una persona che non lo ha scritto. Registra permission mancanti, command stale, decision point ambigui e hidden knowledge.

Non correggere silenziosamente il documento durante l’esercizio: il gap è parte dell’evidence.

## Esercizio 7 — Alert chain

Scegli un failure critico e costruisci:

```text
failure
→ signal
→ alert
→ owner
→ first action
→ resolution signal
```

Ogni passaggio assente è un candidate readiness blocker o accepted-risk question.

## Esercizio 8 — Separare il launch AI

Hai un prodotto deterministico maturo a cui hai aggiunto un AI assistant ancora privo di eval sufficiente.

Confronta due decisioni: ritardare tutto oppure lanciare il core con AI disabled. Spiega quali dependency e product constraint renderebbero corretta l’una o l’altra scelta.

## Esercizio 9 — Go/No-Go senza maggioranza

Simula:

```text
Product        GO
Engineering    GO
Security       NO-GO
Operations     CONDITIONAL
Finance        GO
```

Definisci il finding di Security, quello di Operations e chi possiede l’authority pertinente. Prova poi a ridurre il launch boundary senza indebolire il quality floor.

## Esercizio 10 — Costruisci una PRR

Usa un sistema reale o simulato e crea una review che renda espliciti launch boundary, decision, readiness claims, blocker, accepted risk, disabled capability, deployment/recovery, operational ownership, security, reliability, observability, capacity, cost, AI readiness se applicabile, continuity e next review trigger.

Non assegnare una percentuale unica. La review deve poter spiegare **perché** un singolo blocker pesa più di molti item verdi.

## Artefatto operativo

La **Production Readiness Review** non deve duplicare tutti gli artifact precedenti. È la vista che collega le loro property alla launch decision.

Una forma minima contiene:

```text
Launch boundary
Decision
Readiness claims + evidence + limitation
Blockers
Accepted risks + authority
Disabled/deferred capabilities
Deployment / rollback
Operational ownership
Security / reliability / observability
Capacity / cost
AI readiness when applicable
Continuity
Not verified
Next review trigger
```

Il template è un vocabolario di launch risk, non una checklist universale.

## Stato ESI a fine capitolo

Order Operations conserva launch boundary separati:

```text
LB-CORE
→ NO-GO until core evidence closes

LB-ESCALATION
→ BLOCKED by OO-001 and related runtime evidence

LB-PRIORITY-CANDIDATE
→ NOT AUTHORIZED

LB-AI
→ NOT READY / DISABLED
```

La decisione canonica resta:

```text
PRR-OO-001
NO-GO — evidence closure required
```

Questa conclusione è coerente con tutto ciò che il libro ha costruito. Non avrebbe senso distinguere `Designed`, `Codified`, `Verified` e `Monitored` per venticinque capitoli e poi fonderli insieme quando compare una data di launch.

## Che cosa cambia con l’AI

L’AI può aiutare a costruire evidence matrix, ispezionare configuration, preparare runbook, sintetizzare gap e generare failure hypothesis.

Ma introduce anche un nuovo rischio di evidence laundering: “l’agente dice che tutti i check passano” non spiega quali check, contro quale environment e con quale authority.

Quando l’AI entra nel prodotto, il modello diventa inoltre un launch boundary con eval, provider, security, fallback, latency, cost e monitoring propri.

Un agente può accelerare la raccolta della prova. Non può trasformare absence of evidence in green status.

> **Production-ready non significa che non accadrà nulla di brutto. Significa che sappiamo quale promessa stiamo facendo, quale evidence la sostiene, quali failure abbiamo preparato e chi è responsabile quando la realtà si discosta dal piano.**

E soprattutto:

> **Readiness non è ottenere un sì. È rendere costoso dire sì senza sapere perché.**

Nel Capitolo 27 attraverseremo casi end-to-end. Non introdurremo una nuova disciplina: vedremo come problem, analysis, architecture, implementation, evidence e production decision si concatenano quando nessuna decisione vive da sola.
