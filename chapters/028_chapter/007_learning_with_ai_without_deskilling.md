# 28.7 — Studiare con l'AI senza delegare la comprensione

Un architect che smette di studiare diventa rapidamente il custode di decisioni prese in un mondo che non esiste più. L'AI accelera enormemente l'esplorazione di documentazione, codebase, tecnologie e pattern, ma introduce anche un rischio cognitivo: confondere la velocità con cui riceviamo una spiegazione con la profondità con cui l'abbiamo compresa.

> **L'AI può comprimere il tempo necessario per esplorare. Non può decidere al posto nostro quanta comprensione è sufficiente.**

## Recognition non è recall

Una risposta ben scritta può sembrare immediatamente chiara. È diverso dal saper ricostruire il modello quando la risposta non è davanti a noi.

Per un architect questa differenza conta durante incidenti, review e decisioni ad alto rischio. Non serve ricordare ogni dettaglio di un provider, ma bisogna saper riconoscere quali invarianti contano, quale failure model stiamo usando, quale trade-off stiamo pagando e quale domanda manca.

Se la comprensione esiste soltanto quando un assistente la ricostruisce per noi, abbiamo introdotto una dependency cognitiva.

## L'intuizione tecnica nasce dall'esposizione al failure

Pattern come retry senza idempotenza, shared database senza ownership, migration irreversibile, alert senza owner o AI tool con permission sproporzionata diventano riconoscibili perché abbiamo visto sistemi, errori, incidenti e conseguenze.

Se deleghiamo all'AI anche il primo passaggio di ragionamento in ogni problema, riduciamo le occasioni in cui questa pattern recognition si forma.

> **L'AI può estendere la nostra intuizione. Se la sostituisce troppo presto, può impedirci di costruirla.**

## Un learning loop più utile di una risposta veloce

ESI usa un ciclo semplice per le aree che vuole imparare davvero:

```text
Predict
→ formulare una previsione prima della risposta

Ask
→ usare l'AI per spiegare, criticare o ampliare

Verify
→ controllare primary source, codice o esperimento

Reconstruct
→ rispiegare il modello senza la risposta davanti

Apply
→ usarlo su un problema concreto

Adversarial check
→ cercare il counterexample che rompe il modello
```

La struttura conta perché mantiene attivo il lavoro cognitivo utile. L'AI diventa tutor e avversario, non una macchina che sostituisce il primo tentativo.

Un ottimo prompt didattico, per esempio, non chiede "spiegami transaction isolation". Può chiedere scenari concorrenti, obbligare a prevedere l'esito e soltanto dopo criticare il ragionamento.

## Source-first quando la precisione cambia una decisione

L'AI è eccellente per orientarsi, ma per concetti che cambiano una decisione importante dobbiamo continuare a raggiungere la fonte primaria.

HTTP semantics richiede RFC; PostgreSQL isolation richiede la documentazione PostgreSQL; una property Azure richiede Microsoft Learn; security control e model/provider capability richiedono standard, documentazione ufficiale ed eval del workload.

Questo non significa leggere ogni manuale per intero. Significa mantenere la distinzione fra **strumento che ci porta verso la fonte** e **fonte che autorizza il claim**.

> **L'AI può comprimere la strada verso la fonte. Non deve diventare la fonte quando la precisione della fonte conta.**

È la stessa disciplina usata nel libro per separare scenario ESI, inference ed evidence esterna.

## Studiare forze durevoli, non cataloghi

Memorizzare ogni servizio cloud è un investimento con una data di scadenza breve. Modelli come consistency, isolation, queueing, concurrency, failure, backpressure, ownership, identity, least privilege, capacity, cost e reversibility durano più a lungo.

Le specifiche volatili possono essere recuperate rapidamente. Il modello mentale serve per capire quali specifiche cercare e per riconoscere quando un prodotto non ha fit.

> **Non studiare per ricordare ogni prodotto. Studia per riconoscere le forze che rendono un prodotto adatto o inadatto.**

## L'AI non aumenta expertise in modo automatico

Microsoft Research, nello studio *The SPACE of AI*, riporta risultati raccolti su oltre 500 developer e descrive un impatto dell'AI che varia con complessità del task, modalità di utilizzo e supporto organizzativo.

Fonte:

- [Microsoft Research — The SPACE of AI: Real-World Lessons on AI's Impact on Developers](https://www.microsoft.com/en-us/research/publication/the-space-of-ai-real-world-lessons-on-ais-impact-on-developers/)

DORA ha inoltre discusso la tensione fra accelerazione della produzione e necessità di auditing e verification nell'SDLC assistito da AI.

Fonte:

- [DORA — Balancing AI tensions: Moving from AI adoption to effective SDLC use](https://dora.dev/insights/balancing-ai-tensions/)

La cautela per l'architect è semplice: produrre più velocemente non equivale a verificare meglio o imparare di più.

## Deliberate manual mode

Per alcune competenze core ESI mantiene periodicamente un primo passaggio manuale: leggere un execution plan SQL, modellare una failure sequence, leggere una IAM policy, spiegare un trace, scrivere un piccolo concurrency test o formulare un ADR senza chiedere subito all'AI.

Poi l'AI può diventare reviewer o red team.

Non c'è una superiorità morale del lavoro manuale. È un drill di continuità della competenza.

> **Una skill che esiste soltanto quando l'assistente è disponibile è una dependency. Va trattata come tale.**

## Insegnare rende la comprensione trasferibile

Una competenza che vive in una sola persona è anche un rischio organizzativo. Spiegare una decisione a un developer, a Product e a Security obbliga a tradurre lo stesso modello in conseguenze differenti e mostra rapidamente se la comprensione è ancora superficiale.

Per questo il learning loop ESI non termina con `Apply`:

```text
Explore
→ Verify
→ Apply
→ Operate / Observe
→ Teach
→ Re-evaluate
```

Un corso o una certificazione possono contribuire a `Explore`; non dimostrano automaticamente `Apply`, `Govern` o capacità di far crescere il sistema.

L'evidence di crescita può essere un POC, un ADR, un incident analysis, una migration, una fitness function, un postmortem, una review o un mentoring artifact.

La regola finale è:

> **L'architect del 2030 deve usare l'AI per aumentare la velocità con cui impara, non per ridurre la quantità di comprensione che ritiene necessaria.**
