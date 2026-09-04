# 28.2 — L'analisi funzionale non appartiene solo all'analista

Una delle separazioni organizzative più pericolose è questa:

```text
Business Analyst
→ capisce il dominio
→ scrive requisiti

Developer
→ implementa

Architect
→ disegna componenti
```

Sembra una divisione efficiente del lavoro.

Spesso produce invece tre versioni parziali dello stesso sistema.

L'analista conosce ciò che il business ha chiesto.

Il developer conosce ciò che il codice fa.

L'architect conosce ciò che i diagrammi dicono che dovrebbe succedere.

Quando queste tre conoscenze non si sovrappongono abbastanza, il sistema diventa fragile proprio nei punti dove cambia il significato.

L'architect del 2030 deve quindi saper **leggere, discutere e produrre analisi funzionale**.

Non per sostituire il business analyst.

Per essere in grado di fare architecture su qualcosa che comprende realmente.

> **Non possiamo progettare bene il comportamento di un sistema che conosciamo soltanto attraverso nomi di servizi e ticket.**

---

## La functional analysis è parte della comprensione tecnica

Prendiamo una richiesta apparentemente semplice:

> “Aggiungiamo un pulsante per annullare un ordine.”

Un architect che resta al livello tecnologico può cominciare subito a chiedersi:

```text
REST o event?
nuovo endpoint?
nuova queue?
idempotency?
```

Ma prima esistono domande funzionali:

```text
Chi può annullare?
In quali stati?
Che cosa significa annullare?
È una richiesta o un effetto immediato?
Che cosa succede se il pagamento è già catturato?
Che cosa succede se la spedizione è partita?
Esiste una finestra temporale?
Chi possiede la decisione economica?
Serve una compensazione?
Il cliente può vedere l'operazione?
Esistono obblighi di audit?
```

Queste domande cambiano completamente:

- ownership;
- API semantics;
- transaction boundary;
- security;
- consistency;
- eventuali saga;
- audit;
- rollback;
- UX;
- support procedure.

Quindi l'analisi funzionale non è una fase “prima dell'architettura”.

È una delle sorgenti dell'architettura.

---

## Tutti devono avere almeno una visione d'insieme

In un sistema non banale non è realistico che ogni persona conosca ogni dettaglio.

Ma è ragionevole aspettarsi che chi prende decisioni significative conosca almeno:

```text
attori principali
critical user journey
stati business importanti
ownership dei dati
side effect economici o irreversibili
boundary organizzativi
principali eccezioni
quality attribute che cambiano il comportamento
```

Questo vale per:

- architect;
- developer;
- tester;
- product engineer;
- SRE/operations quando opera il prodotto;
- security engineer quando un controllo cambia il journey;
- agent manager quando delega execution.

Il livello di dettaglio può cambiare.

La visione d'insieme no.

> **Un team può distribuire il lavoro. Non può distribuire la comprensione fino al punto in cui nessuno vede più il sistema intero.**

---

## L'architect deve saper leggere una specifica funzionale

Microsoft Well-Architected collega esplicitamente architecture design e functional specification: la specifica tecnica deve basarsi su scope e obiettivi della specifica funzionale, e il processo di progettazione è collaborativo fra stakeholder, developer, tester, operations e product owner.

Fonte:

- Microsoft Learn — *Develop an architecture design specification*: https://learn.microsoft.com/en-us/azure/well-architected/architect-role/architecture-design-specification

Il punto non è adottare il formato Microsoft.

Il punto è riconoscere che un architect deve saper valutare una specifica funzionale per capire almeno:

```text
cosa è esplicito
cosa è ambiguo
cosa manca
cosa contraddice altre parti
cosa crea una one-way door
cosa genera un NFR implicito
cosa richiede una decision authority diversa
```

Leggere una functional analysis non significa verificarne grammatica e completezza formale.

Significa interrogare il significato.

---

## E deve anche saperla fare

A volte il business analyst non c'è.

A volte c'è ma il problema nasce in una conversazione tecnica.

A volte un incidente rivela una regola funzionale mai scritta.

A volte una migration costringe a decidere quale comportamento legacy debba sopravvivere.

A volte una feature AI introduce una domanda nuova:

> “Questa risposta è un fatto, un suggerimento o una decisione?”

In tutti questi casi l'architect non può limitarsi a scrivere:

```text
TBD by Product
```

per ogni domanda.

Deve essere in grado di costruire almeno una prima analisi:

```text
Problem
Actors
Outcome
Journey
States
Rules
Exceptions
Ownership
Open questions
Acceptance semantics
Non-goals
```

Poi può portarla alla persona che possiede la decisione.

Questo è molto diverso dal decidere unilateralmente.

> **Saper fare analisi funzionale significa saper rendere una decisione discutibile. Non significa arrogarsi il diritto di prenderla.**

---

## Functional Analysis come strumento di collaborazione

Una buona analisi funzionale non deve essere un documento consegnato da un ruolo a un altro.

Può essere un oggetto di lavoro condiviso.

Per esempio, per una nuova capability ESI:

```text
Product
→ chiarisce outcome e priorità

Domain expert
→ chiarisce regole ed eccezioni

Architect
→ evidenzia ownership, irreversibilità, quality implication

Developer
→ evidenzia feasibility e hidden behavior del sistema attuale

Tester
→ trasforma regole in falsifiable acceptance

Security
→ evidenzia abuse case e authorization

Operations
→ evidenzia support/recovery implication
```

Questa non è “analysis by committee”.

È costruzione di una comprensione condivisa prima che il codice renda costose le differenze di interpretazione.

---

## L'AI rende questa competenza ancora più importante

Un agente è molto bravo a riempire vuoti con una interpretazione plausibile.

Questo è utile quando il vuoto riguarda:

```text
boilerplate
mapping meccanico
scaffolding
```

È pericoloso quando riguarda:

```text
business rule
ownership
authorization
economic effect
exception
contract
```

Consideriamo una issue:

```text
Implement cancel order.
```

Un agente può costruire velocemente una soluzione ragionevole.

Ma “ragionevole” non significa “corretta per il business”.

Se il team non sa riconoscere le domande mancanti, l'AI aumenta la probabilità che l'ambiguità diventi codice funzionante.

> **L'AI riduce il costo di implementare una interpretazione. Per questo aumenta il valore di sapere se quella interpretazione è autorizzata.**

---

## Un test per l'architect

Davanti a una capability importante, l'architect dovrebbe riuscire a rispondere senza aprire subito il diagramma:

1. Quale problema risolve?
2. Chi la usa?
3. Qual è il journey principale?
4. Quali stati business attraversa?
5. Quali invariant non possono essere violati?
6. Chi possiede i fatti coinvolti?
7. Quali side effect sono irreversibili o economicamente rilevanti?
8. Quali failure sono visibili all'utente?
9. Quali decisioni sono ancora aperte?
10. Quale evidence ci direbbe che la feature fa ciò che promette?

Se non sa rispondere, non è necessariamente un problema.

Il problema è non sapere che queste risposte mancano.

---

## ESI: Functional Literacy Baseline

Nella capability map ESI, ogni architect deve dimostrare almeno la capacità di:

```text
leggere una functional analysis
costruire una prima bozza quando manca
modellare journey e stati
identificare invariant
separare requirement da implementation suggestion
identificare ownership e decision authority
trasformare ambiguità in open question esplicite
collegare acceptance criterion a evidence
```

Non richiediamo che ogni architect sia il miglior analyst dell'azienda.

Richiediamo che nessun architect possa usare:

> “Io mi occupo solo della parte tecnica.”

come giustificazione per non conoscere il prodotto che sta progettando.

La regola è:

> **L'analisi funzionale può avere specialisti. La comprensione funzionale non può avere un solo proprietario.**
