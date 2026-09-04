# 28.7 — Studiare con l'AI senza delegare la comprensione

Un architect che smette di studiare diventa rapidamente il custode di decisioni prese in un mondo che non esiste più.

Questo era vero prima dell'AI.

Ora il ritmo cambia ancora.

Nuove capability cloud, nuovi database, nuovi modelli AI, nuovi pattern operativi e nuovi tool possono essere esplorati in una frazione del tempo.

L'AI può:

- riassumere documentazione;
- confrontare alternative;
- spiegare codice sconosciuto;
- costruire esercizi;
- generare esempi;
- fare domande;
- simulare una review;
- proporre counterexample.

È un enorme vantaggio.

Ma introduce un rischio:

> **confondere la velocità con cui riceviamo una spiegazione con la profondità con cui abbiamo imparato.**

---

## Recognition non è recall

Leggere una risposta ben scritta può dare una forte sensazione di comprensione.

Ma esiste una differenza fra:

```text
riconoscere una spiegazione corretta
```

e:

```text
saper ricostruire il modello quando serve
```

Per un architect la seconda capacità conta molto.

Durante un incidente o una review non possiamo dipendere dal fatto che l'AI ci ricordi ogni concetto fondamentale.

Dobbiamo almeno saper riconoscere:

```text
quali invarianti contano
quale failure model stiamo usando
quale trade-off stiamo accettando
quale domanda manca
```

---

## Il rischio dell'outsourced intuition

L'esperienza tecnica costruisce pattern recognition.

Dopo aver visto abbastanza sistemi, impariamo a sentire che qualcosa non torna:

```text
retry senza idempotenza
shared DB senza ownership
public endpoint troppo privilegiato
migration irreversibile
alert senza owner
AI tool con permission sproporzionata
```

Questa intuizione non nasce soltanto leggendo definizioni.

Nasce da:

```text
problemi risolti
errori commessi
incidenti osservati
trade-off discussi
sistemi operati
```

Se deleghiamo continuamente all'AI anche il primo passaggio di ragionamento, possiamo ridurre le occasioni in cui questa intuition si forma.

> **L'AI può estendere la nostra intuizione. Se la sostituisce troppo presto, può impedirci di costruirla.**

---

## Un operating model per studiare

ESI propone un modello semplice per aree che vogliamo realmente imparare.

### 1. Predict

Prima di chiedere la risposta, prova a formulare una previsione.

```text
Che cosa credo succeda?
Quale trade-off mi aspetto?
Dove penso sia il failure mode?
```

### 2. Ask

Usa l'AI per spiegare, criticare o ampliare.

### 3. Verify

Controlla primary source, documentazione ufficiale, standard, codice o esperimento.

### 4. Reconstruct

Chiudi la risposta e prova a spiegare il concetto con parole tue.

### 5. Apply

Usalo su un problema concreto.

### 6. Adversarial check

Chiedi:

```text
Quando questa spiegazione smette di essere vera?
Quale counterexample la rompe?
```

Questo workflow rende l'AI un acceleratore dell'apprendimento, non un sostituto della memoria concettuale.

---

## Source-first learning

L'AI è molto utile per trovare una direzione.

Ma per concetti che cambiano decisioni importanti dobbiamo continuare a leggere fonti primarie.

Per esempio:

```text
HTTP semantics
→ RFC

PostgreSQL isolation
→ PostgreSQL docs

Azure private endpoint
→ Microsoft Learn

AI structured output
→ provider docs + eval

security control
→ standard / official guidance
```

Questo non significa leggere interamente ogni manuale.

Significa mantenere una disciplina:

> **L'AI può comprimere la strada verso la fonte. Non deve diventare la fonte quando la precisione della fonte conta.**

È lo stesso principio usato per scrivere questo libro.

---

## AI come tutor adversarial

Uno degli usi migliori dell'AI non è spiegare.

È fare domande.

Per esempio:

```text
Sto studiando transaction isolation.
Fammi cinque scenari concorrenti.
Non darmi subito la risposta.
Fammi prevedere il risultato e poi criticami.
```

Oppure:

```text
Questa è la mia decisione architetturale.
Trova tre assunzioni implicite.
Poi costruisci un caso in cui la decisione fallisce.
```

Oppure:

```text
Spiegami questo trace senza dirmi la root cause.
Fammi formulare ipotesi e chiedimi quale evidence cercherei.
```

Questo uso aumenta il lavoro cognitivo utile invece di rimuoverlo.

---

## Studiare sistemi, non cataloghi

Un architect può sprecare moltissimo tempo cercando di conoscere ogni servizio cloud o ogni framework.

Nell'era AI il catalogo è ancora meno prezioso da memorizzare.

La memoria deve concentrarsi di più su modelli durevoli:

```text
consistency
queueing
concurrency
isolation
failure
backpressure
ownership
identity
least privilege
capacity
cost
feedback loop
reversibility
```

Le specifiche volatili possono essere recuperate.

Il modello mentale serve per capire **quali specifiche cercare**.

> **Non studiare per ricordare ogni prodotto. Studia per riconoscere le forze che rendono un prodotto adatto o inadatto.**

---

## Microsoft Research: AI e produttività non sono uniformi

Microsoft Research, nello studio *The SPACE of AI*, riporta risultati basati su oltre 500 developer: l'AI è percepita come utile soprattutto per task routinari e può migliorare efficiency e satisfaction, ma l'impatto varia con complessità del task, modalità individuali di utilizzo e supporto organizzativo.

Fonte:

- Microsoft Research — *The SPACE of AI: Real-World Lessons on AI's Impact on Developers*: https://www.microsoft.com/en-us/research/publication/the-space-of-ai-real-world-lessons-on-ais-impact-on-developers/

Questa è una buona cautela per il nostro capitolo.

Non esiste una formula:

```text
AI access
→ expertise increase
```

L'outcome dipende da come la persona e l'organizzazione integrano lo strumento.

---

## DORA: velocità e instabilità possono crescere insieme

DORA ha evidenziato nelle proprie analisi sull'AI-assisted development che accelerare la produzione non elimina automaticamente la necessità di auditing e verification; una parte del tempo risparmiato in generazione può spostarsi verso verifica e controllo.

Fonte:

- DORA — *Balancing AI tensions: Moving from AI adoption to effective SDLC use*: https://dora.dev/insights/balancing-ai-tensions/

Per l'architect la lezione è diretta:

> **Se impariamo soltanto a produrre più velocemente e non a verificare meglio, non stiamo aumentando la nostra capacità architetturale.**

---

## Deliberate manual mode

ESI introduce una pratica interna volutamente semplice.

Per alcune competenze core, periodicamente lavoriamo senza delegare il primo passo all'AI.

Esempi:

```text
leggere un execution plan SQL
scrivere un piccolo concurrency test
modellare una failure sequence
leggere un IAM policy
spiegare un trace
scrivere un ADR da zero
```

Non perché manuale sia moralmente migliore.

Ma perché vogliamo sapere se la capacità esiste ancora.

È simile a un disaster recovery drill per la conoscenza.

> **Una skill che esiste soltanto quando l'assistente è disponibile è una dependency. Va trattata come tale.**

---

## Insegnare come prova di comprensione

L'architect ha anche una responsabilità di crescita del sistema umano.

Se una sola persona comprende un boundary critico, abbiamo un rischio.

Un buon esercizio è chiedere all'architect di:

```text
spiegare una decisione a un developer
spiegarla a Product
spiegarla a Security
```

Se deve usare lo stesso vocabolario per tutti, probabilmente non ha ancora tradotto davvero il concetto.

La capacità di insegnare produce anche documentation più utile e riduce tribal knowledge.

---

## ESI Learning Loop

La Architect Capability Map introduce un learning loop:

```text
Explore
→ Verify
→ Apply
→ Operate/Observe
→ Teach
→ Re-evaluate
```

Un corso o una certificazione possono contribuire a `Explore`.

Non dimostrano automaticamente `Apply` o `Operate`.

L'evidence di crescita può essere:

```text
POC
ADR
incident analysis
review
architecture test
migration
mentoring session
postmortem
```

La regola è:

> **L'architect del 2030 deve usare l'AI per aumentare la velocità con cui impara, non per ridurre la quantità di comprensione che ritiene necessaria.**
