# Esercizi e sintesi

Il One-Man Project non nasce dalla fantasia che una persona possa sostituire ogni funzione. Nasce dal fatto che l’execution può diventare molto più abbondante della capacità umana di produrla direttamente.

Questo sposta il problema. Il lead non deve più soltanto “fare il lavoro”: deve governare WIP, riconoscere authority boundary, selezionare evidence, proteggere deep work, mantenere la conoscenza esterna alla propria memoria e capire quando l’operating model non ha più fit.

La domanda finale del capitolo è quindi:

> **Quanto leverage possiamo concentrare prima che attention, authority e continuity diventino il vero single point of failure?**

## Esercizio 1 — Hero developer o leverage?

Considera questo scenario:

```text
un senior engineer
+ 6 coding agent
+ 20 PR a settimana
+ nessun secondary maintainer
+ decisioni architetturali in chat private
+ incidenti sempre gestiti dallo stesso engineer
```

Individua quali elementi rappresentano leverage reale e quali aumentano continuity risk. Poi descrivi che cosa dovrebbe diventare repository context e quale segnale useresti per capire se il review backlog sta superando il decision throughput.

## Esercizio 2 — Attention budget

Hai cinque task pronti:

```text
A. rename di un type locale
B. nuovo index PostgreSQL
C. cambio retry policy
D. nuova pagina read-only
E. nuovo endpoint refund
```

Classificali come T0 Mechanical, T1 Local behavioral, T2 Cross-boundary o T3 Decision-changing. Scegli quali eseguiresti in parallelo con un solo accountable lead e giustifica la scelta in termini di decision surface, verification, specialist gate e blast radius.

## Esercizio 3 — Giocare fuori ruolo

Scegli una capability fuori dalla tua specializzazione principale — security, cloud, frontend, data, observability o product analysis — e usa un agente per costruire una prima proposta.

Prima di accettarla, rispondi a quattro domande: quali failure mode riconosci personalmente? Dove vive la source of truth? Quale decisione non sei autorizzato a prendere da solo? Quale evidence ti permetterebbe di capire se la proposta è abbastanza buona?

Lo scopo è distinguere role elasticity da competence laundering.

## Esercizio 4 — Continuity Test

Immagina di essere offline per due settimane. Un collega competente riceve soltanto repository, ticket system e strumenti enterprise autorizzati.

Deve riuscire a ricostruire product purpose, current architecture, owner dei dati, golden command, task aperti, decisioni Pending, deployment/recovery route ed escalation path.

Ogni risposta che richiede “deve chiedere a me” è un candidate knowledge debt. Scegli poi una piccola operazione che il collega dovrebbe riuscire realmente a eseguire: il test deve verificare la trasferibilità della conoscenza, non la presenza dei file.

## Esercizio 5 — Fit Review

Confronta tre sistemi:

```text
A. tool interno read-only usato da 50 engineer
B. servizio payment multi-paese con side effect economici
C. migration utility con target architecture e verification già definiti
```

Per ciascuno valuta decision density, one-way-door density, operational burden, authority esterne, platform support e continuity. Non cercare un sì/no universale: descrivi quale operating model avrebbe fit oggi e quale evento potrebbe invalidarlo.

## Esercizio 6 — WIP agentico

Hai osservato questa settimana:

```text
10 task launched
9 completed
4 accepted without changes
3 required one repair
2 required major rework
review backlog = 7
2 semantic questions unresolved for 4 days
```

Decidi se execution è davvero il collo di bottiglia. Proponi un nuovo WIP limit e specifica quale metrica vuoi osservare la settimana successiva per capire se la modifica ha migliorato flow e decision throughput.

## Esercizio 7 — Specialist gate

Costruisci per il tuo progetto una tabella minima:

| Trigger | Lead authority | Specialist gate | Evidence richiesta |
|---|---|---|---|
| nuova business rule | | | |
| public ingress | | | |
| nuovo payment side effect | | | |
| nuovo model provider | | | |
| destructive migration | | | |

L’obiettivo non è moltiplicare le approvazioni. È rendere visibili le decisioni che non devono dipendere dalla capacità dell’agente di produrre una risposta convincente.

## Esercizio 8 — Outcome scorecard

Un manager propone di misurare il pilot usando soltanto `agent task / week`, `PR / week` e `lines changed`.

Costruisci una scorecard alternativa che includa verified outcome, lead time, rework, review backlog, quality signal, agent cost, human review effort, continuity e business outcome. Distingui outcome, leading indicator, diagnostic signal e guardrail.

## Esercizio 9 — ESI diventa write-capable

Product chiede di permettere al Case Explanation Assistant di eseguire automaticamente un refund.

Spiega quale authority boundary cambia, quale task class cambia, quali artifact devono essere riaperti e quali specialist gate scattano. Poi valuta se il One-Man Project conserva ancora lo stesso fit.

Non basta “aumentare l’autonomia del modello”: il nuovo sink cambia security, economic authority, verification e operational burden.

## Esercizio 10 — Exit trigger

Definisci cinque segnali che ti farebbero passare da `one accountable lead` a uno stable multi-maintainer team. Per ogni segnale specifica evidence, rischio e risposta organizzativa.

Un esempio:

```text
Signal
24/7 incident volume exceeds sustainable lead coverage

Evidence
pager/on-call data

Risk
human SPOF + delayed recovery

Response
shared on-call / maintainer rotation
```

## Artefatto operativo

Il capitolo introduce l’**One-Man Project Operating Model**. La sua struttura minima deve rendere espliciti mission, accountable lead, non-authorities, Secondary Maintainer, agent portfolio, WIP policy, decision rights, verification model, specialist trigger, continuity plan, operating cadence, metrics ed exit criteria.

Non tutti questi campi devono produrre pagine di testo. Devono però impedire che il control plane reale esista soltanto come abitudine personale del lead.

## Che cosa cambia con l’AI

Senza agenti, la quantità di execution producibile da una singola persona imponeva un limite relativamente evidente. Con gli agenti quel limite può spostarsi rapidamente.

Questo rende possibile più scope individuale, parallel execution ed exploration. Rende anche più facili knowledge concentration, review collapse, attention fragmentation, synthetic seniority e organizational fragility.

Il professionista deve quindi imparare non soltanto a fare più cose, ma a **governare il proprio leverage**.

Il quality floor resta semplice: functional understanding, security boundary, data ownership, external contract, verification independence quando necessaria, recovery e continuity non diventano negoziabili perché una persona è diventata più produttiva.

> **La vera promessa del One-Man Project non è che una persona possa fare tutto. È che possa governare molto più lavoro senza produrre tutto personalmente — e che il progetto continui a sapere che cosa fare anche quando quella persona non è disponibile.**

Con questo si chiude la Parte VI — AI-native software engineering.

Il passo successivo cambia prospettiva. Non basta più sapere costruire, delegare e governare il sistema. Dobbiamo decidere se ciò che abbiamo costruito è abbastanza dimostrato per essere affidato al mondo reale.

È il **Capitolo 26 — Production Readiness**.
