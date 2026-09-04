# 28.9 — Esercizi, autovalutazione e sintesi

Questo capitolo non propone una nuova tecnologia. Propone un cambio di baricentro professionale.

L'architect nell'era dell'AI perde valore soltanto se il suo contributo era limitato alla produzione di diagrammi, ADR, checklist o codice. Quando questi output diventano più economici, cresce invece il valore di chi sa capire il problema, costruire comprensione condivisa, riconoscere decisioni significative, restare vicino alla realtà tecnica, negoziare trade-off, chiedere evidence adeguata e rendere l'execution delegabile senza perdere accountability.

> **L'architect del 2030 non è il proprietario dei diagrammi. È uno dei governor del sistema di decisioni che rende possibile costruire, cambiare e operare software.**

## Una sintesi in cinque movimenti

Il primo movimento è funzionale: l'architettura non può nascere da ticket che nessuno collega a journey, stati, invariant e ownership. L'analisi funzionale può avere specialisti; la comprensione funzionale deve essere condivisa da chi prende decisioni significative.

Il secondo è tecnico: l'architect non deve implementare tutto, ma deve poter scendere abbastanza in profondità da riconoscere quando codice, runtime o infrastructure contraddicono il modello mentale. Breadth senza technical credibility produce astrazione vuota; depth senza systems thinking produce local optimization.

Il terzo è decisionale: quando generare alternative costa poco, judgment e reversibility diventano più importanti. La governance deve essere proporzionale al blast radius e l'evidence proporzionata al claim.

Il quarto è organizzativo: il sistema comprende team, budget, support, platform, security, decision authority e costi di coordinamento. L'architect scala attraverso guardrail e paved road, non accumulando approvazioni.

Il quinto riguarda l'AI stessa: agent governance, permission, verification e learning diventano architecture. L'AI deve aumentare leverage senza trasformare la professional accountability in un output delegato.

## Esercizi

Gli esercizi di questo capitolo servono a verificare capacità, non memoria.

### Esercizio 1 — Functional literacy

Prendi una feature recente e, senza guardare subito il codice, ricostruisci:

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

Confronta poi il risultato con Product, Analyst e sistema reale. Registra le differenze fra il tuo modello e la realtà.

### Esercizio 2 — Dal diagramma al sistema

Scegli un boundary importante e trova nel repository entry point, dependency, persistence, test e telemetry. Poi cerca evidence runtime quando esiste.

Domanda: il boundary vive davvero nel sistema oppure soltanto nel diagramma?

### Esercizio 3 — Claim-to-evidence

Scegli cinque claim come `secure`, `recoverable`, `highly available`, `fast` o `AI grounded`. Per ognuno separa evidence attuale, evidence realmente necessaria e gap.

L'obiettivo è scoprire quanti aggettivi sono ancora hypothesis.

### Esercizio 4 — Trade-off aziendale

Prendi una decisione tecnologica recente e ricostruisci chi guadagna, chi paga, quale property viene acquistata, quale rischio diminuisce, quale aumenta e quale trigger farà riaprire la scelta.

Se sai descrivere soltanto il componente scelto, non hai ancora ricostruito la decisione.

### Esercizio 5 — Guardrail vs approval

Rivedi le ultime review architetturali del team e separa i casi che richiedevano human judgment da quelli che avrebbero potuto essere una policy meccanicamente verificabile, una paved road o una fitness function.

La domanda non è "come automatizziamo tutte le review?". È "quale conoscenza stabile stiamo facendo pagare ancora come coordinamento umano?".

### Esercizio 6 — Agent delegation

Per un task adatto a un coding agent definisci outcome, scope, out-of-scope, permission, verification e stop condition. Poi identifica il peggior errore plausibile che l'agente può fare restando dentro quei limiti.

Se il blast radius è ancora troppo grande, il task non è ancora abbastanza bounded.

### Esercizio 7 — Deliberate manual mode

Scegli una competenza core che deleghi spesso all'AI: SQL analysis, threat modeling, IaC review, distributed failure reasoning o altro. Esegui il primo passaggio senza AI e usa l'AI soltanto come reviewer/adversary.

Registra quale parte del modello riuscivi ancora a ricostruire autonomamente.

### Esercizio 8 — Capability Map personale

Usa le undici capability ESI e assegna un livello `L1 Understand`, `L2 Apply`, `L3 Govern` o `L4 Grow the system`. Per ogni livello aggiungi evidence concreta.

Poi individua non soltanto le aree deboli, ma anche quelle in cui il team dipende troppo da una sola persona.

### Esercizio 9 — Specialist trigger

Per le aree dove non hai depth sufficiente, definisci il confine fra decisione autonoma e specialist review: quale evento fa scattare l'escalation, chi possiede l'authority e quale evidence preparare prima di coinvolgerlo.

Questo trasforma "non sono esperto" in una policy operativa.

### Esercizio 10 — Make yourself less necessary

Prendi una decisione o un processo per cui il team dipende troppo da te. Chiediti se serve documentazione, teaching, un test, una fitness function, ownership metadata o un runbook.

L'obiettivo è ridurre la dipendenza senza ridurre la qualità.

## Autovalutazione

Dovresti riuscire a spiegare con esempi concreti perché l'AI aumenta il valore del judgment; perché un architect deve comprendere la functional analysis; quale technical depth è sufficiente per falsificare un modello mentale; perché architecture è una responsabilità prima di un titolo; come si traduce una technical property in business consequence; quando un guardrail è migliore di un approval gate; perché un secondo agente non è necessariamente un verifier indipendente; che cosa significa outsourced intuition; quando una paved road diventa uniformità ideologica; e perché rendere l'architect meno necessario può essere evidence di successo.

Se le risposte restano astratte, torna agli artifact del capstone. Il percorso è stato costruito proprio per collegare concetto, decisione ed evidence.

## Artefatto operativo — Architect Capability Map

L'artefatto company-level è:

```text
capstone/example-software-industries/ARCHITECT_CAPABILITY_MAP.md
```

Serve a learning, staffing, specialist trigger, continuity e portfolio risk. Non deve diventare una classifica personale.

La direzione ESI resta:

```text
broad functional/systems literacy
+ credible technical depth
+ explicit specialist triggers
+ executable guardrails
+ continuous evidence-based learning
```

Il costo accettato è tempo di studio, exposure cross-funzionale, mentoring e documentazione. Il quality floor è functional understanding, technical credibility, human decision authority, primary evidence e nessuna `architecture-by-autocomplete`.

## Corollario

L'architect del 2030 non è la persona che conosce più tecnologie. È quella capace di stare abbastanza vicina al business da capire che cosa conta, abbastanza vicina alla tecnologia da capire che cosa è vero e abbastanza lontana dall'implementazione locale da vedere le conseguenze sul sistema intero.

> **Quando l'execution diventa abbondante, l'architecture diventa sempre meno il mestiere di produrre risposte e sempre più il mestiere di governare le domande, le decisioni e l'evidence.**

Il prossimo capitolo porta questa tesi alla sua conseguenza finale.

Se l'AI può produrre una parte crescente dell'execution, la domanda non è chi scrive più righe di codice.

È:

> **Chi tiene il timone?**
