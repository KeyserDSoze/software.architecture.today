# 9. Esercizi, autovalutazione e sintesi

Questo capitolo non introduce un nuovo pattern.

Introduce una prova più difficile:

> **sappiamo usare insieme ciò che abbiamo imparato senza trasformarlo in una checklist meccanica?**

## Idee chiave

1. Un metodo architetturale coerente deve poter produrre architetture molto diverse.
2. Un caso end-to-end deve mostrare la catena causale delle decisioni, non soltanto il diagramma finale.
3. Greenfield, brownfield e AI-native hanno failure model e evidence requirement differenti.
4. La semplicità è una decisione matura quando deriva da scope e quality floor chiari.
5. Modernizzare non significa preservare automaticamente ogni comportamento legacy.
6. Un modello AI può essere utile senza diventare authority.
7. Readiness deve essere valutata per launch boundary, non come percentuale globale.
8. I casi reali servono a studiare forze e conseguenze, non a copiare topologie.
9. L'ottimo locale di un team non coincide sempre con l'ottimo dell'azienda.
10. Enterprise architecture deve distinguere ciò che merita standardizzazione da ciò che deve restare workload-specific.
11. Più economico diventa creare un nuovo sistema, più importante diventa decidere se quel sistema merita di esistere.
12. Il compromesso non deve nascondere una riduzione non intenzionale del quality floor.

---

# Esercizio 1 — Smonta Campaign Launchpad

Prendi il caso Campaign Launchpad.

Assumi che Product aggiunga il requisito:

```text
landing page personalizzata
per ogni customer account
in base a dati CRM quasi real-time
```

Rispondi:

1. quali nuove authoritative source entrano nel sistema?
2. quali dati diventano sensibili?
3. il public static model resta sufficiente?
4. quali failure mode nuovi compaiono?
5. quali parti del Threat Model cambiano?
6. quali NFR diventano ora materialmente più importanti?
7. quale decisione del caso originale deve essere riaperta?
8. quale tecnologia **non** sceglieresti ancora senza ulteriori informazioni?

Obiettivo:

> vedere come un requisito funzionale cambia l'architettura senza partire da una tecnologia.

---

# Esercizio 2 — Non preservare automaticamente il legacy

Dato questo comportamento legacy:

```text
customerTier == GOLD
and age > 10m
→ CRITICAL
```

Costruisci una piccola Legacy Understanding Map con:

```text
Claim
Evidence
State
Possible owner
Alternative explanation
Missing evidence
```

Poi separa:

```text
Observed behavior
Confirmed target requirement
```

Non decidere che il comportamento deve sopravvivere soltanto perché esiste.

---

# Esercizio 3 — Expected difference o regressione?

Immagina che shadow comparison produca:

```text
10,000 Match
73 ExpectedDifference
2 UnexpectedDifference
```

Una persona propone:

> Abbiamo il 99,98% di match, possiamo fare cutover.

Spiega perché la percentuale non basta.

Per ciascun `UnexpectedDifference` definisci:

```text
business impact
affected tenant/user
cause
reproducibility
authoritative expected result
stop/continue decision
```

Obiettivo:

> imparare a pesare i mismatch per rischio, non per maggioranza.

---

# Esercizio 4 — Aggiungi un tool all'AI Assistant

Product propone:

```text
Case Explanation Assistant
→ retryPayment()
```

Non implementare.

Produci invece un decision packet con:

```text
Business outcome
Authority owner
Preconditions
Authorization
Idempotency
Failure modes
Compensation
Audit
Human confirmation
Tool permission
Rate/abuse limit
Testing
Observability
Stop conditions
```

Poi rispondi:

> Il modello deve decidere quando chiamare il tool o deve soltanto proporre l'azione?

Non esiste una risposta universale.

La valutazione deve dipendere dal rischio.

---

# Esercizio 5 — RAG o no?

Per ciascun caso scegli se useresti deterministic context, search classica, RAG o nessuna AI.

### Caso A

```text
spiegare un Order Case
con quattro source strutturate già note
```

### Caso B

```text
cercare procedure
in 50,000 runbook/documenti enterprise
```

### Caso C

```text
calcolare il PaymentStatus authoritative
```

### Caso D

```text
riassumere un incident timeline
costruito da eventi già correlati
```

Giustifica ogni scelta in termini di:

```text
retrieval need
authority
security
cost
latency
evaluation
```

---

# Esercizio 6 — Local optimum vs enterprise optimum

Tre team ESI chiedono:

```text
Team A
new logging stack

Team B
new identity provider

Team C
new queue technology
```

Per ogni richiesta costruisci una tabella:

| Domanda | Risposta |
|---|---|
| Quale problema locale risolve? | |
| Quale proprietà compra? | |
| Esiste già una paved-road capability? | |
| Qual è il costo enterprise della varietà? | |
| Qual è il costo di forzare lo standard? | |
| L'eccezione ha expiry/review trigger? | |

Obiettivo:

> distinguere standardizzazione utile da standardizzazione ideologica.

---

# Esercizio 7 — Tre Production Readiness Review

Crea tre mini-PRR separate:

```text
Campaign Launchpad
Priority candidate cutover
Case Explanation Assistant
```

Per ognuna definisci:

```text
Launch boundary
Blocker
Accepted-risk candidate
Required evidence
Disabled capability
Owner
Decision
```

È vietato usare:

```text
80% ready
90% ready
almost ready
```

Usa soltanto stati che descrivano una decisione reale.

---

# Esercizio 8 — Copiare Netflix, GitHub o Uber

Scegli un engineering blog reale di una grande organizzazione.

Estrai:

```text
Problem
Context
Forces
Decision
Consequences
Evidence
```

Poi scrivi due sezioni separate:

### Cosa posso imparare

### Cosa NON sono autorizzato a copiare senza il loro contesto

Obiettivo:

> allenarsi a usare i casi reali come evidence, non come architecture template.

---

# Esercizio 9 — Disegna una quarta azienda/prodotto ESI

Aggiungi un prodotto in uno dei domini:

```text
Engineering Software
Payments & Risk
Mobile Products
Data & AI
Corporate Systems
```

Scrivi soltanto:

```text
Problem & Outcome
Functional scope
Owners
3 quality attributes
1 key trade-off
3 failure modes
1 production gate
```

Poi confrontalo con i tre casi del capitolo.

Se la tua architettura è identica a una delle precedenti, chiediti se il problema è davvero identico.

---

# Esercizio 10 — Riduci l'architettura

Prendi uno dei tre casi e prova a eliminare:

```text
one service
one datastore
one async mechanism
one cache
one AI layer
one deployment environment
```

Per ogni rimozione chiedi:

> Quale requisito o quale evidence smette di essere soddisfatto?

Se non sai rispondere, quella complessità potrebbe non avere un lavoro.

---

# Autovalutazione

Dovresti riuscire a rispondere senza consultare il testo.

1. Perché lo stesso metodo può produrre architetture diverse?
2. Che differenza c'è fra case study e architecture template?
3. Perché Campaign Launchpad non eredita automaticamente la topology di Order Operations?
4. Che cosa rende un One-Man Project dipendente dall'organizzazione anche se ha un solo accountable lead?
5. Perché un characterization test non dimostra che un behavior legacy debba sopravvivere?
6. Che cos'è una ExpectedDifference?
7. Perché zero mismatch può essere un obiettivo sbagliato?
8. Perché il modello AI non deve diventare owner dei fact che sintetizza?
9. Perché grounding e RAG non sono sinonimi?
10. Perché una eval dataset non è evidence di model quality finché non viene eseguita?
11. Che differenza c'è fra public authoring boundary e runtime AI tool boundary?
12. Perché una feature disabilitata può consentire un launch boundary più piccolo?
13. Che cosa dovrebbe standardizzare una piattaforma enterprise?
14. Quando una eccezione allo standard è giustificata?
15. Perché cost allocation è una architectural concern?
16. Perché una capability comune non deve nascere prima di un problema comune ripetuto?
17. Che cosa cambia quando l'AI rende più economico creare nuovi sistemi?
18. Che ruolo ha l'analisi funzionale nei tre casi?
19. Che cosa significa `fit before fashion` osservando i tre sistemi insieme?
20. Quale evidence useresti per decidere se un sistema può davvero andare in produzione?

---

# Artefatto operativo del capitolo

Il Capitolo 27 non introduce un nuovo artefatto obbligatorio.

Usa invece un **End-to-End Decision Trace** come vista sintetica dei documenti già esistenti.

Template:

```text
Case

Problem
Outcome
Functional scope
Owners
Quality floor
Key trade-off
Architecture decision
Rejected alternative
Failure modes
Verification
Production decision
Open evidence
Review triggers
Real-world evidence anchors
```

Non deve diventare una seconda copia di tutti gli ADR e contract.

Serve a raccontare la causalità.

---

# Cosa cambia con l'AI

L'AI può accelerare quasi ogni fase dei tre casi:

```text
discovery
analysis candidate
design alternatives
implementation
testing
migration tooling
eval generation
documentation
review
```

Ma proprio per questo aumenta il rischio di saltare la catena causale.

Può produrre:

```text
architecture
without problem

tests
without property

migration
without behavior classification

AI integration
without authority boundary

production config
without readiness evidence
```

La risposta non è rallentare artificialmente ogni task.

È rendere il percorso decisionale abbastanza esplicito che la velocità non possa nascondere il significato.

> **L'AI può comprimere il tempo fra decisione ed execution. Non deve comprimere la distinzione fra decisione ed execution.**

---

# Corollario

I tre casi non ci insegnano tre architetture da ricordare.

Ci insegnano qualcosa di più difficile da automatizzare:

> **la stessa disciplina può portare a una soluzione semplice, a una coexistence temporanea o a un runtime AI fortemente limitato — perché la maturità non sta nel pattern scelto, ma nel rapporto fra problema, compromesso ed evidence.**

E soprattutto:

> **Un buon architect non riconosce la soluzione perché l'ha già vista. Riconosce le domande che devono essere risposte prima che la soluzione meriti di esistere.**

Nel prossimo capitolo torneremo sulla persona.

Dopo aver progettato sistemi, organizzazione, agenti e production gate, possiamo finalmente chiederci:

> **Che cosa significa essere software architect quando una parte crescente dell'execution può essere delegata?**

È il **Capitolo 28 — L'architect del 2030**.