# 28.8 — ESI Architect Capability Map

Dopo ventotto capitoli possiamo finalmente rendere operativa una domanda che altrimenti resterebbe troppo vaga:

> **Che cosa deve saper fare un architect nell'era dell'AI?**

La risposta ESI non è una lista di tecnologie e non è una certification matrix. È una **Capability Map** costruita su capacità osservabili e sull'evidence che può dimostrarle.

Il modello non chiede se una persona conosce Azure, Kubernetes o Kafka. Chiede se sa trasformare un problema ambiguo in decisioni verificabili, riconoscere boundary, leggere codice e runtime, negoziare trade-off, governare execution delegata e capire quando serve una profondità specialistica che non possiede.

## Undici capability, un solo sistema professionale

La mappa conserva undici aree perché servono come strumento di staffing, crescita e specialist trigger. Non sono undici identità separate dell'architect: si sostengono a vicenda.

| Capability | Che cosa deve rendere possibile | Failure mode tipico |
|---|---|---|
| Product & Functional Analysis | capire outcome, journey, stati, invariant, ownership e open question | architecture costruita dai titoli dei ticket |
| System Boundaries & Domain Design | creare responsibility boundary significativi e controllare coupling | box senza responsabilità |
| Technical & Code Literacy | ispezionare codice e runtime abbastanza da falsificare assunzioni | architecture staccata dall'implementation |
| Data & Distributed Systems | ragionare su transaction, consistency, messaging, idempotency e migration | rete trattata come local call |
| Security, Reliability & Operability | progettare threat, failure, recovery, support e observable health | happy-path architecture |
| Economics & Cost | collegare cost driver, property acquistata e valore/rischio | cheapest resource = best architecture |
| Evolution, Legacy & Reversibility | governare conoscenza incerta, coexistence, rollback e drift | rewrite-or-freeze thinking |
| AI Runtime Architecture | governare authority, context, tools, eval, drift e fallback | model capability confusa con business authority |
| Agentic Engineering Governance | progettare context, scope, permission, verification e stop condition | faster execution = faster uncontrolled change |
| Enterprise Systems & Communication | tradurre property in conseguenze e negoziare trade-off aziendali | local optimum, global cost |
| Evidence, Learning & Teaching | scegliere evidence proporzionata, imparare source-first e trasferire conoscenza | confident artifact senza reliable knowledge |

La tabella è intenzionalmente sintetica. L'artefatto persistente `ARCHITECT_CAPABILITY_MAP.md` conserva maggiore dettaglio e tipiche evidence per ciascuna area.

## I livelli misurano che cosa sappiamo far accadere

ESI evita una scala generica `Junior → Senior → Architect` dentro la mappa. Una persona può avere profondità diversa nelle singole capability.

I livelli sono:

```text
L1 — Understand
→ sa spiegare e riconoscere il problema

L2 — Apply
→ sa usare la capacità su un problema bounded e verificarne l'outcome

L3 — Govern
→ sa gestire decisioni cross-boundary, trade-off, evidence e review trigger

L4 — Grow the system
→ sa insegnare, creare guardrail/paved road e ridurre la dipendenza dall'esperto
```

Questa scala distingue sapere, fare, governare e rendere altri più autonomi. È una distinzione più utile di un singolo punteggio di expertise.

## Non serve L4 ovunque

Un architect L4 in tutte le undici aree sarebbe un obiettivo poco realistico e, soprattutto, inutile. La capacità professionale include anche sapere quando una decisione supera la propria profondità.

La baseline pilot ESI resta:

```text
Product & Functional Analysis        >= L2
System Boundaries & Domain Design    >= L3
Technical & Code Literacy            >= L2
Security/Reliability/Operability     >= L2
Economics & Cost                     >= L2
Evidence/Learning/Teaching           >= L3
```

con una o due aree di profondità materialmente più forte in funzione del ruolo e del portfolio.

Questa baseline non assegna authority nei domini specialistici. Una decisione su economic/payment semantics continua a richiedere Payments & Risk; regulated data può richiedere Security e Legal/Compliance; public exposure richiede Security e Platform; recovery avanzato o multi-region può richiedere specialisti Data/Platform/SRE; un AI write tool ad alto impatto richiede AI, Security e domain authority.

> **Sapere quando escalare è parte della competenza, non evidence di incompetenza.**

## Evidence della capability

ESI non vuole valutare la mappa soltanto con colloqui, autovalutazioni o certificazioni. La capability deve emergere da lavoro osservabile.

Un ADR con trade-off leggibile, una functional analysis facilitata, un POC che chiude un'assunzione, un incident review, una failure-mode map, una architecture fitness function, un cost model, una migration, una Production Readiness Review o un agent-governance design possono essere evidence.

Nessun artefatto da solo prova automaticamente una capability. Conta quale problema è stato affrontato, quale ruolo ha avuto la persona e se il risultato ha cambiato davvero la qualità delle decisioni del sistema.

## La mappa non è una classifica

Tradurre le undici capability in `Architect score = 83/100` distruggerebbe buona parte del loro valore. La mappa serve a fare domande diverse: quale capability manca nel team, dove dipendiamo da un solo esperto, quale decisione futura richiede più depth, dove un architect è diventato un approval bottleneck e quale conoscenza dovrebbe trasformarsi in guardrail eseguibile.

L'obiettivo non è produrre persone che collezionano caselle. È rendere il sistema umano meno fragile.

## Il modello di team ESI

ESI non vuole un esercito di architect centralizzati. Il workload team possiede molte decisioni locali; architect, principal e tech lead integrano sistemi e trade-off; gli specialisti entrano sui boundary ad alto rischio; Platform rende ripetibili i problemi non differenzianti; fitness e policy automatizzano ciò che l'organizzazione ha già capito.

In questo modello il successo dell'architect non si misura dal numero di decisioni che passano dalla sua scrivania. Si misura anche da quante decisioni diventano sicure senza la sua presenza continua.

## Artefatto persistente

La mappa vive a livello company:

```text
capstone/example-software-industries/ARCHITECT_CAPABILITY_MAP.md
```

È company-level perché attraversa Order Operations, Campaign Launchpad e i futuri prodotti ESI senza dipendere da uno stack specifico.

La sua frase guida resta:

> **L'architect non scala sapendo tutto. Scala costruendo abbastanza comprensione, evidence e guardrail perché il sistema possa prendere buone decisioni anche senza la sua presenza continua.**
