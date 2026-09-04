# 28.5 — Systems thinking: il sistema include anche l'organizzazione

Un software system non finisce al confine del deployable.

Include:

```text
persone
team
processi
budget
support model
compliance
supplier
clienti
piattaforme interne
vincoli contrattuali
```

Per questo l'architect del 2030 non può essere soltanto un esperto di componenti software.

Deve capire abbastanza l'organizzazione da riconoscere quando una decisione tecnicamente elegante produce un sistema aziendale peggiore.

> **Un'architettura può essere localmente ottima e globalmente sbagliata.**

---

## Il costo della soluzione vive anche fuori dal cloud bill

Nel Capitolo 20 abbiamo modellato il costo come:

```text
infrastructure
+ operation
+ complexity
+ migration
+ verification
+ support
+ skill
+ coordination
```

Questa prospettiva è essenziale per l'architect.

Prendiamo una proposta:

```text
estraiamo Payment in un servizio separato
```

Il costo non è soltanto:

```text
compute + DB + network
```

Comprende:

```text
new deployment pipeline
contract evolution
observability
on-call surface
incident coordination
data migration
permission boundary
new failure mode
team ownership
```

La decisione può restare corretta.

Ma deve essere valutata sul costo vero.

---

## Organization-aware architecture

Nel Capitolo 8 abbiamo visto che team boundary e service boundary sono collegati ma non equivalenti.

L'architect deve saper leggere domande organizzative come:

```text
Chi possiede questa capability?
Chi la cambia più spesso?
Chi viene svegliato se fallisce?
Chi può approvare un rischio?
Quale team conosce il dominio?
Quale dipendenza richiede coordinamento continuo?
```

A volte la risposta corretta è cambiare il software.

A volte è cambiare ownership.

A volte è creare una platform capability.

A volte è non distribuire affatto.

La tecnologia non risolve automaticamente una struttura organizzativa incoerente.

---

## L'architect come traduttore fra economie differenti

Ogni stakeholder ottimizza qualcosa di diverso.

```text
Product
→ opportunity cost

Finance
→ spend / predictability

Security
→ expected loss / blast radius

Platform
→ reuse / supportability

Operations
→ recoverability / toil

Engineering
→ change cost / cognitive load
```

Queste metriche non hanno una unità comune immediata.

Il lavoro architetturale consiste spesso nel rendere leggibile il trade-off.

Per esempio:

```text
Service Bus Premium
```

non viene discusso come:

> “Costa troppo.”

ma come:

```text
Cost premium
→ buys private-link capability in current design
→ reduces public reachability
→ adds operational/platform constraints
→ review if threat model or workload changes
```

Questo permette a Security e Finance di discutere la stessa decisione senza ridurla a preferenze.

---

## Standardizzazione vs autonomia

In una azienda come ESI, Platform Engineering vuole evitare che ogni prodotto reinventi:

```text
identity
secrets
CI/CD
logging
cost allocation
security scanning
landing zone
```

È ragionevole.

Ma se la standardizzazione diventa:

```text
same compute
same database
same messaging
same topology
same AI stack
```

per qualunque workload, smette di essere leverage e diventa imposizione.

L'architect deve distinguere:

```text
undifferentiated capability
→ standardize / paved road

workload-specific decision
→ preserve contextual choice
```

Questa distinzione richiede sia comprensione tecnica sia comprensione del business.

---

## Il ruolo nelle tensioni fra stakeholder

Una parte del lavoro non può essere automatizzata in modo semplice perché non consiste nel trovare una soluzione tecnica.

Consiste nel negoziare cosa l'organizzazione accetta di pagare.

Esempio:

```text
Sales
→ cliente importante chiede launch in 4 settimane

Security
→ private connectivity non verificata

Engineering
→ implementation quasi completa

Operations
→ restore drill non eseguito
```

L'architect non dovrebbe semplicemente dire:

```text
NO
```

oppure:

```text
GO
```

Dovrebbe trasformare il conflitto in alternative:

```text
A. full launch tra 4 settimane
   risk: X, Y, Z

B. bounded internal/private pilot
   excludes feature A/B
   closes blocker X/Y first

C. delay
   preserves full target boundary
```

Poi la decision authority appropriata può scegliere con cognizione di causa.

> **L'architect non elimina il conflitto. Lo rende decisionabile.**

---

## Comunicazione come capacità tecnica

Dire:

> “La consistenza è eventuale.”

può essere tecnicamente vero e completamente inutile per Product.

Meglio:

> “Dopo una Payment Escalation, la console può mostrare per alcuni minuti che Payments non ha ancora preso in carico la richiesta. L'intenzione non viene persa; lo stato downstream è ritardato.”

Dire:

> “Abbiamo RTO 8 ore.”

può essere astratto.

Meglio:

> “In un outage regionale accettiamo che il prodotto interno possa restare indisponibile per una parte della giornata lavorativa; non stiamo pagando oggi una seconda regione sempre pronta.”

L'architect deve saper tradurre:

```text
technical property
↔
business consequence
```

Questa è una competenza tecnica perché una traduzione sbagliata produce decisioni sbagliate.

---

## Scrivere per ridurre coordinamento

Una buona documentazione architetturale non serve a dimostrare che abbiamo lavorato.

Serve a permettere ad altri di:

- capire una decisione senza meeting;
- sapere chi coinvolgere;
- riconoscere un trigger;
- evitare di ripetere una discussione chiusa;
- capire quali assunzioni sono ancora aperte.

Questo è particolarmente importante con gli agenti.

Ogni decisione che vive soltanto in una conversazione privata diventa context che deve essere ricostruito manualmente.

La documentazione buona riduce coordination cost per persone e agenti.

---

## Architecture non come gate centrale

Se ogni decisione passa dall'architect, l'architect diventa un collo di bottiglia.

Il modello migliore è:

```text
principi / guardrail
→ rendono molte decisioni locali

fitness function
→ verificano policy meccaniche

ADR / review
→ per decisioni significative

specialist gate
→ per authority/risk specifici
```

In questo modello l'architect aumenta l'autonomia del sistema invece di accumulare approvazioni.

> **L'architect più scalabile non prende più decisioni degli altri. Rende più decisioni sicure senza di lui.**

---

## Microsoft: business, operations e stakeholder

La guidance Microsoft Well-Architected descrive il ruolo dell'architect come bilanciamento di considerazioni tecniche, operative e di business e include stakeholder input, budget, timeline, compliance, operations e supportability.

Fonte:

- Microsoft Learn — *Solution Architect's Responsibilities and Guiding Principles*: https://learn.microsoft.com/en-us/azure/well-architected/architect-role/fundamentals

Ancora una volta non usiamo la fonte per imporre una job description.

La usiamo come riscontro che il lavoro architetturale contemporaneo viene trattato anche fuori da questo libro come attività cross-functional e lifecycle-oriented.

---

## ESI: l'architect come integratore di decisioni

Nella capability map ESI, la capacità `Enterprise & Organizational Systems` richiede di saper:

```text
identificare stakeholder e decision authority
tradurre property tecniche in consequence business
modellare cost driver
riconoscere coordination/cognitive cost
proporre launch boundary alternativi
separare standardizzazione da uniformità
costruire guardrail invece di approvazioni seriali
```

La frase guida è:

> **Il sistema che stiamo progettando comprende anche l'organizzazione che dovrà finanziarlo, cambiarlo, proteggerlo e operarlo.**
