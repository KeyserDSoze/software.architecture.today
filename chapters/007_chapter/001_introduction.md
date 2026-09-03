# Capitolo 7 — Pattern senza religione

## Il pattern non viene prima del problema

I pattern sono una delle idee più utili e più abusate del software engineering.

Sono utili perché ci permettono di riconoscere strutture ricorrenti. Ci aiutano a dare un nome a problemi già incontrati, a condividere un vocabolario con il team e a evitare di reinventare ogni volta soluzioni che hanno già mostrato proprietà interessanti.

Sono abusati quando diventano badge di competenza.

Quando il ragionamento comincia così:

> “Qui ci metterei un CQRS.”

oppure:

> “Questo sembra perfetto per event sourcing.”

oppure:

> “Usiamo una saga.”

prima ancora di aver chiarito il problema, abbiamo invertito l'ordine corretto delle cose.

Il pattern è diventato il punto di partenza.

Nel capitolo precedente abbiamo introdotto il principio **fit before fashion**.

Qui lo applichiamo direttamente ai pattern.

Un pattern non è una tecnologia da installare.

Non è una libreria.

Non è nemmeno una ricetta da copiare.

È un modo ricorrente di organizzare una soluzione quando certe forze sono presenti.

La domanda corretta non è:

> “Quale pattern possiamo usare?”

È:

> **“Quale problema stiamo cercando di risolvere, quali forze agiscono e quale struttura ci aiuta a gestirle con il trade-off migliore?”**

Questa differenza sembra sottile.

Non lo è.

### Il Pattern-First Development

Esiste una forma di overengineering molto elegante.

Non produce necessariamente codice brutto.

Produce codice pieno di concetti riconoscibili:

- factory;
- strategy;
- mediator;
- repository;
- unit of work;
- command;
- handler;
- event bus;
- adapter;
- gateway;
- orchestrator.

Ogni pezzo può essere difendibile isolatamente.

Il problema emerge quando nessuno sa più spiegare quale forza concreta giustifichi ciascun livello.

Una feature semplice finisce per attraversare sette astrazioni perché “questa è la nostra architecture”.

Il costo non è soltanto il numero di file.

È il numero di concetti che ogni engineer deve tenere in testa per capire dove vive davvero il comportamento.

Con l'AI questo rischio aumenta.

Un agente può produrre in pochi minuti una struttura estremamente sofisticata e apparentemente professionale.

Può introdurre interfacce, adapter, command bus e test mockati con una facilità che rende il costo iniziale quasi invisibile.

Ma il costo di comprensione rimane.

E quel costo viene pagato da ogni persona e da ogni agente che entrerà successivamente nel repository.

Da qui una regola:

> **L'AI abbassa il costo di creare astrazioni. Non abbassa automaticamente il costo di capirle.**

### Un pattern è una compressione di esperienza

La parte interessante dei pattern non è il diagramma UML.

È l'esperienza condensata dietro quel diagramma.

Un pattern racconta implicitamente che:

- una certa tensione compare spesso;
- alcune soluzioni ingenue tendono a fallire;
- una particolare struttura distribuisce responsabilità in modo utile;
- questa struttura compra alcuni vantaggi pagando costi specifici.

Se perdiamo questa relazione tra problema, forze e conseguenze, resta soltanto la forma.

E la forma senza il problema diventa cargo cult.

Per questo in questo libro non studieremo i pattern come un catalogo da memorizzare.

Li useremo come **linguaggio per ragionare**.

Per ogni pattern importante porremo sempre le stesse domande:

1. quale problema prova a risolvere?
2. quali forze devono essere presenti perché abbia senso?
3. quale complessità introduce?
4. quale coupling rimuove e quale coupling aggiunge?
5. quali failure mode crea?
6. come cambia operabilità e osservabilità?
7. quali alternative più semplici esistono?
8. quando non dovremmo usarlo?

### La parte più importante: quando non usarlo

Conoscere un pattern significa anche riconoscere quando non serve.

Questo è un segnale di maturità tecnica.

Un engineer junior spesso mostra ciò che sa introducendolo.

Un engineer più esperto mostra ciò che sa anche decidendo consapevolmente di non introdurlo.

Perché ogni pattern è un trade-off.

Una queue riduce alcune forme di coupling temporale, ma introduce delivery semantics, retry, poison message, ordering e operabilità.

Un circuit breaker può limitare il danno di una dipendenza degradata, ma introduce stato e soglie che devono essere comprese e osservate.

CQRS può separare modelli di lettura e scrittura quando hanno esigenze molto diverse, ma può introdurre duplicazione, sincronizzazione e consistenza eventuale.

Event sourcing può conservare una storia ricca del dominio, ma cambia profondamente il modello di persistenza, debugging, evoluzione degli eventi e gestione dei dati.

Nessuno di questi costi rende il pattern sbagliato.

Rende necessario giustificarlo.

### Pattern senza religione

Il titolo di questo capitolo non significa che i pattern siano superati.

Significa esattamente il contrario.

Sono troppo utili per ridurli a rituali.

Li tratteremo come strumenti di decisione.

La regola sarà semplice:

> **Non applicare un pattern perché lo riconosci. Applicalo quando riconosci il problema che lo rende utile.**
