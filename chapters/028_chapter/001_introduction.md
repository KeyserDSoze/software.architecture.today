# Capitolo 28 — L'architect del 2030

Per molti anni abbiamo descritto l'architect attraverso gli artefatti che produceva.

Diagrammi.

Specifiche.

Review.

Decision record.

Standard.

Reference architecture.

Quel lavoro non scompare.

Ma nell'era dell'AI cambia il rapporto fra artefatto e responsabilità.

Un agente può generare una prima bozza di diagramma in pochi secondi. Può leggere una codebase, proporre una decomposizione, scrivere un ADR, confrontare alternative, produrre una checklist di security, analizzare una migration, preparare test e persino implementare una parte consistente della soluzione.

Se definiamo il valore dell'architect come capacità di produrre questi artefatti, il ruolo sembra improvvisamente minacciato.

Se invece lo definiamo come capacità di **capire il problema, tenere insieme il sistema, prendere decisioni sotto vincoli reali e governare le conseguenze**, il ruolo diventa ancora più importante.

> **Quando produrre alternative costa meno, scegliere bene fra le alternative vale di più.**

Questo capitolo parla quindi dell'architect del 2030 non come previsione di una job description futura, ma come evoluzione di responsabilità che è già visibile oggi.

La data nel titolo è deliberatamente simbolica.

Non stiamo dicendo che nel 2030 esisterà un unico tipo di architect.

Stiamo chiedendo:

> **Quali capacità diventano più preziose quando il costo dell'execution scende e aumenta il numero di decisioni che possiamo materializzare?**

---

## Da produttore di artefatti a governor di sistemi

La trasformazione può essere sintetizzata così:

```text
prima
architect
→ produce e approva molti artefatti

sempre di più
architect
→ progetta il sistema di decisioni
→ rende espliciti i boundary
→ costruisce context ed evidence
→ delega execution
→ verifica trade-off e conseguenze
→ governa l'evoluzione
```

Non significa che l'architect smetta di scrivere codice.

Non significa nemmeno che debba scriverne continuamente.

Significa che la scrittura di codice non è più il confine che separa il lavoro tecnico da quello architetturale.

Nel libro abbiamo già visto un architect dover ragionare di:

```text
analisi funzionale
API
ownership dei dati
transazioni
failure distribuiti
cloud
identity
security
recovery
observability
testing
legacy
refactoring
cost
agent governance
runtime AI
production readiness
```

Nessuna di queste aree può essere governata soltanto con diagrammi.

E nessuna richiede che una singola persona sia il massimo esperto di tutto.

La capacità chiave è sapere **quale profondità serve per decidere**, quando chiedere evidence e quando coinvolgere chi possiede una competenza o una decision authority più specifica.

---

## Il ruolo non finisce con il design

Una visione ancora diffusa è:

```text
requirements
→ architect produce design
→ implementation team costruisce
→ architect passa al progetto successivo
```

È un modello sempre meno utile.

Microsoft Azure Well-Architected descrive esplicitamente il solution architect come una figura coinvolta lungo l'intero lifecycle del workload: raccoglie input dagli stakeholder, comprende il business context, bilancia considerazioni tecniche, operative ed economiche, collabora durante l'implementazione e continua a partecipare a review ed evoluzione dopo il go-live.

Fonte:

- Microsoft Learn — *Solution Architect's Responsibilities and Guiding Principles*: https://learn.microsoft.com/en-us/azure/well-architected/architect-role/fundamentals
- Microsoft Learn — *Support the workload in a consultative role*: https://learn.microsoft.com/en-us/azure/well-architected/architect-role/ongoing-support

Questa prospettiva è coerente con tutto ciò che abbiamo costruito fin qui.

L'architecture decision prende significato soltanto quando possiamo confrontarla con:

```text
implementation reale
runtime behavior
incidenti
costo reale
feedback degli utenti
nuovi requirement
nuove constraint
```

Per questo:

> **L'architettura non termina quando il diagramma è approvato. Inizia a essere verificabile quando il sistema comincia a vivere.**

---

## L'AI aumenta il bisogno di architecture, non necessariamente di architect title

C'è una distinzione importante.

Il libro non sostiene che ogni team debba avere una persona con il titolo formale `Software Architect`.

In una piccola organizzazione la responsabilità architetturale può essere svolta da un senior engineer, un tech lead o persino dalla stessa persona che possiede il prodotto tecnico.

In un'impresa più grande può esistere una combinazione di:

```text
solution architect
software architect
platform architect
data architect
security architect
principal engineer
staff engineer
tech lead
```

Il punto non è il titolo.

Il punto è che alcune responsabilità non scompaiono:

- qualcuno deve capire il problema oltre il ticket;
- qualcuno deve riconoscere quali decisioni hanno blast radius ampio;
- qualcuno deve tenere insieme funzionale e non funzionale;
- qualcuno deve rendere esplicito chi possiede cosa;
- qualcuno deve chiedere evidence adeguata al claim;
- qualcuno deve negoziare trade-off fra stakeholder;
- qualcuno deve sapere quando una decisione è scaduta;
- qualcuno deve impedire che execution veloce diventi drift veloce.

In un buon team queste responsabilità possono essere distribuite.

In un team cattivo possono essere formalmente assegnate a un architect ma non realmente esercitate.

> **Architecture è una responsabilità prima di essere un ruolo.**

---

## L'AI è un amplificatore del sistema che trova

DORA, nel report 2025 sul software development assistito da AI, descrive l'AI soprattutto come un **amplificatore**: tende a magnificare le capacità di organizzazioni già solide e anche le debolezze di organizzazioni disfunzionali.

Fonte:

- DORA — *State of AI-assisted Software Development 2025*: https://dora.dev/research/2025/dora-report/

Questa osservazione è particolarmente rilevante per l'architect.

Un'organizzazione con:

```text
requirement ambigui
ownership debole
test poco affidabili
repository confusi
architecture drift
permission boundary vaghi
```

non ottiene automaticamente ordine aggiungendo agenti.

Può ottenere più velocemente:

```text
più codice ambiguo
più variazioni architetturali
più test che verificano poco
più infrastruttura
più decisioni implicite
```

Viceversa, un sistema con:

```text
functional clarity
boundary leggibili
decision record
golden command
fitness function
work item execution-ready
stop condition
evidence model
```

può trasformare l'AI in leverage reale.

Quindi l'architect del 2030 non deve soltanto sapere **usare** l'AI.

Deve sapere progettare il sistema organizzativo e tecnico dentro cui l'AI lavora.

---

## Il compromesso ESI del capitolo

ESI sta discutendo come evolvere la propria funzione Architecture.

Una proposta estrema è:

```text
architect più generalisti
+ agenti per tutto il lavoro tecnico
```

Un'altra è:

```text
architect molto specialistici
+ ogni decisione passa da loro
```

La prima rischia una perdita di profondità tecnica.

La seconda rischia di trasformare Architecture in collo di bottiglia.

ESI sceglie una terza strada:

```text
broad systems/business literacy
+ almeno una profondità tecnica credibile
+ capacità di leggere codice e runtime evidence
+ specialist gate quando il rischio lo richiede
+ agent execution senza self-certification
```

Costo accettato:

```text
più tempo dedicato a studio continuo
più collaborazione cross-funzionale
meno comfort nel restare dentro una sola specializzazione
```

Quality floor:

```text
architecture non disconnessa dall'implementation
functional semantics non delegate ad altri per default
technical judgment non sostituito da output AI
specialist authority rispettata
```

La formula che useremo nel capitolo è:

> **Ampiezza per capire il sistema. Profondità sufficiente per non essere ingannati dalle astrazioni.**

---

## Dove andiamo

Nelle prossime sezioni vedremo l'architect come:

```text
interprete del business e dell'analisi funzionale
engineer tecnicamente credibile
designer di decisioni e trade-off
systems thinker
negoziatore fra stakeholder
governor di agenti
curatore dell'evidence
studente permanente
```

E chiuderemo il capitolo con una **Architect Capability Map ESI**.

Non sarà una matrice di certificazioni.

Sarà una risposta operativa alla domanda:

> **Che cosa deve saper fare una persona affinché l'AI aumenti il suo leverage senza ridurre la qualità del suo judgment?**
