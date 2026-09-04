# 28.9 — Esercizi, autovalutazione e sintesi

Questo capitolo non propone una nuova tecnologia.

Propone un cambio di identità professionale.

L'architect nell'era dell'AI non perde valore perché diagrammi, codice, ADR o analisi possono essere prodotti più velocemente.

Perde valore soltanto se il suo contributo era limitato alla produzione di quegli artefatti.

Il ruolo che resta — e diventa più importante — è quello di chi sa:

```text
capire il problema
costruire comprensione condivisa
riconoscere decisioni significative
bilanciare trade-off
rimanere ancorato alla realtà tecnica
chiedere evidence
progettare boundary
rendere execution delegabile
mantenere accountability
far evolvere il sistema
```

> **L'architect del 2030 non è il proprietario dei diagrammi. È uno dei governor del sistema di decisioni che rende possibile costruire, cambiare e operare software.**

---

# Idee chiave

## 1. Architecture è una responsabilità prima di essere un titolo

Il titolo formale può cambiare.

Le responsabilità no.

Un team deve comunque gestire:

```text
trade-off
boundary
ownership
risk
evolution
evidence
```

---

## 2. L'analisi funzionale non può essere delegata a un solo ruolo

Specialisti possono guidarla.

Ma architect, developer e altre persone che prendono decisioni significative devono avere una visione d'insieme del prodotto.

> **L'analisi funzionale può avere specialisti. La comprensione funzionale non può avere un solo proprietario.**

---

## 3. Technical depth resta necessaria

Non per implementare tutto.

Per riconoscere quando:

```text
diagramma
≠
codice reale

configurazione
≠
proprietà dimostrata

model output
≠
verità
```

---

## 4. Judgment cresce di valore quando le alternative costano meno

Generare cinque soluzioni è più economico.

Decidere quale merita di esistere continua a richiedere:

```text
context
trade-off
risk
reversibility
evidence
```

---

## 5. Il sistema comprende anche l'organizzazione

Un architecture decision cambia:

```text
costo
team ownership
incident surface
coordination
support
skill requirement
```

non soltanto componenti.

---

## 6. Il ruolo scala con guardrail, non con approvazioni

Un architect che deve approvare tutto non scala.

Un architect che costruisce:

```text
policy
fitness function
paved road
review trigger
```

può aumentare autonomia senza perdere coerenza.

---

## 7. Agent governance è architecture

Quando gli executor diventano agenti dobbiamo progettare:

```text
context
scope
permission
verification
stop condition
```

Non basta imparare a scrivere prompt migliori.

---

## 8. Studiare con l'AI richiede deliberate practice

L'AI può accelerare enormemente l'apprendimento.

Ma dobbiamo continuare a:

```text
prevedere
verificare
ricostruire
applicare
insegnare
```

per evitare outsourced intuition.

---

## 9. Breadth e depth non sono alternative

La direzione è:

```text
ampiezza sufficiente per vedere il sistema
+
profondità sufficiente per non farsi ingannare
+
specialist gate quando serve
```

---

## 10. Il valore finale è aumentare la qualità delle decisioni del sistema

Non rendere tutti dipendenti dall'architect.

> **L'architect più scalabile rende più decisioni sicure anche quando non è presente.**

---

# Esercizi

## Esercizio 1 — Functional literacy

Prendi una feature recente del tuo prodotto.

Senza guardare il codice, scrivi:

```text
Problem
Actors
Outcome
Main journey
States
Invariants
Exceptions
Ownership
Open questions
```

Poi confronta con Product/Analyst e col sistema reale.

### Domanda

Dove la tua comprensione differiva dalla realtà?

---

## Esercizio 2 — Dal diagramma al codice

Scegli un boundary importante in un diagramma architetturale.

Trova nel codice:

- entry point;
- dipendenze;
- persistence;
- test;
- telemetry.

### Domanda

Il boundary esiste davvero o soltanto nel diagramma?

---

## Esercizio 3 — Claim-to-evidence

Scegli cinque claim del tuo sistema:

```text
highly available
secure
fast
recoverable
AI grounded
```

Per ciascuno scrivi:

```text
Claim
Evidence attuale
Evidence realmente necessaria
Gap
```

### Obiettivo

Scoprire quanti aggettivi sono ancora ipotesi.

---

## Esercizio 4 — Trade-off aziendale

Prendi una decisione tecnologica recente.

Ricostruisci:

```text
chi guadagna
chi paga
property acquistata
cost driver
rischio ridotto
rischio aumentato
trigger di review
```

Se non riesci, probabilmente hai documentato la tecnologia e non la decisione.

---

## Esercizio 5 — Guardrail vs approval

Elenca le ultime dieci review architetturali che hai fatto.

Classificale:

```text
human judgment realmente necessario
policy meccanicamente verificabile
paved road mancante
informazione mancante
```

### Domanda

Quante review potrebbero sparire se trasformassimo il problema in feedback automatico?

---

## Esercizio 6 — Agent delegation

Prendi un task adatto a un coding agent.

Definisci:

```text
Outcome
Scope
Out of scope
Permission
Verification
Stop condition
```

Poi chiediti:

> Qual è il peggior errore plausibile che l'agente può fare restando dentro questi limiti?

Se il blast radius è ancora troppo grande, ridisegna il boundary.

---

## Esercizio 7 — Deliberate manual mode

Scegli una competenza core che deleghi spesso all'AI.

Per esempio:

```text
SQL query analysis
threat modeling
IaC review
distributed failure reasoning
```

Completa un piccolo esercizio senza chiedere all'AI il primo passo.

Poi usa l'AI come reviewer.

### Domanda

Quale parte riuscivi ancora a ricostruire autonomamente e quale no?

---

## Esercizio 8 — Capability map personale

Usa le undici capability ESI:

1. Product & Functional Analysis
2. System Boundaries & Domain Design
3. Technical & Code Literacy
4. Data & Distributed Systems
5. Security, Reliability & Operability
6. Economics & Cost
7. Evolution, Legacy & Reversibility
8. AI Runtime Architecture
9. Agentic Engineering Governance
10. Enterprise Systems & Communication
11. Evidence, Learning & Teaching

Per ciascuna assegna:

```text
L1 Understand
L2 Apply
L3 Govern
L4 Grow the system
```

Poi aggiungi **evidence**, non soltanto il livello.

---

## Esercizio 9 — Specialist trigger

Per le aree dove sei meno forte, definisci:

```text
quando posso decidere autonomamente?
quando devo chiedere review?
chi è lo specialista?
quale decision authority possiede?
```

Questo trasforma “non sono esperto” in una policy operativa.

---

## Esercizio 10 — Make yourself less necessary

Prendi una decisione o un processo per cui il team dipende troppo da te.

Chiediti:

```text
serve documentazione?
serve un test?
serve una fitness function?
serve ownership metadata?
serve un runbook?
serve insegnamento?
```

### Obiettivo

Ridurre la dipendenza senza ridurre la qualità.

---

# Autovalutazione

Dovresti riuscire a rispondere con sufficiente precisione a queste domande.

1. Perché l'AI aumenta il valore del judgment?
2. Perché un architect deve saper fare functional analysis?
3. Quale livello di technical depth è utile a un architect?
4. Perché architecture è una responsabilità prima di un titolo?
5. Qual è la differenza fra technical property e business consequence?
6. Perché un architect non dovrebbe approvare ogni decisione?
7. Che cosa significa evidence proportional to claim?
8. Come può l'AI creare decision theatre?
9. Perché capability e permission devono restare separate?
10. Quando un secondo agente non è un verifier indipendente?
11. Che cosa significa outsourced intuition?
12. Come si può usare l'AI come tutor adversarial?
13. Perché la standardizzazione non deve diventare uniformità?
14. Che cosa rappresentano i livelli L1–L4 della Capability Map?
15. Perché “rendere l'architect meno necessario” può essere un segno di successo?

Se molte risposte restano vaghe, torna ai relativi artefatti del capstone.

Il libro è stato costruito proprio per collegare concetto e decisione reale.

---

# Artefatto operativo — Architect Capability Map

L'artefatto company-level di questo capitolo è:

```text
capstone/example-software-industries/ARCHITECT_CAPABILITY_MAP.md
```

Non deve essere usato come classifica personale.

Serve per:

- crescita;
- staffing;
- specialist trigger;
- continuity;
- individuazione di single point of failure di competenza;
- progettazione del learning plan.

---

# Che cosa cambia con l'AI

Prima:

```text
architect bottleneck
→ capacità di analizzare e produrre artifact
```

Sempre di più:

```text
artifact generation
→ economica

alternative generation
→ economica

implementation
→ più economica

quindi

problem clarity
judgment
verification
ownership
learning
→ relativamente più preziosi
```

L'AI permette all'architect di attraversare più domini e di sperimentare più rapidamente.

Ma aumenta anche la probabilità di produrre rapidamente qualcosa che nessuno comprende abbastanza.

Per questo il ruolo evolve da:

```text
artifact producer
```

verso:

```text
designer and governor
of systems that can produce artifacts
```

---

# Il compromesso del capitolo

ESI sceglie di non costruire:

```text
architect generalisti senza depth
```

né:

```text
architect specialisti che diventano gate universali
```

La direzione è:

```text
broad literacy
+ credible technical depth
+ explicit specialist triggers
+ executable guardrails
+ continuous learning
```

Costo accettato:

- tempo di studio;
- rotazione fra problemi;
- maggiore esposizione cross-funzionale;
- necessità di insegnare e documentare.

Quality floor:

```text
functional understanding
technical credibility
human decision authority
primary evidence
no architecture-by-autocomplete
```

---

# Corollario

L'architect del 2030 non è la persona che conosce più tecnologie.

Non è neppure quella che produce più diagrammi o prompt.

È la persona capace di stare abbastanza vicina al business da capire che cosa conta, abbastanza vicina alla tecnologia da capire che cosa è vero e abbastanza lontana dall'implementazione locale da vedere le conseguenze sul sistema intero.

> **Quando l'execution diventa abbondante, l'architecture diventa sempre meno il mestiere di produrre risposte e sempre più il mestiere di governare le domande, le decisioni e l'evidence.**

Il prossimo capitolo chiude il libro.

Non aggiungerà un altro catalogo di tecniche.

Tornerà alla domanda con cui siamo partiti:

> **Se l'AI può scrivere una parte sempre più grande del software, chi tiene il timone?**
