# Prima dei comandamenti

Siamo arrivati alla fine del percorso, non alla fine della Software Architecture.

Cambieranno modelli, framework, provider, interfacce, database, agenti e piattaforme. Cambierà probabilmente anche il confine fra ciò che chiamiamo sviluppo e ciò che chiamiamo operazione.

Un libro che provasse a chiudere con una previsione dettagliata invecchierebbe molto rapidamente.

Possiamo chiudere con qualcosa di più durevole: **un modo di ragionare**.

## ESI non è diventata una demo perfetta

Example Software Industries era un espediente didattico. È diventata un modo per ricordare che il software vive dentro un'azienda dove Product, Engineering, Architecture, Security, Operations, Platform, Finance, domain owner e Leadership portano esigenze differenti e legittime.

Order Operations è cresciuto perché il problema ha generato nuove forze. Non abbiamo aggiunto cloud, outbox, threat model, legacy coexistence, agent governance o AI runtime perché un libro di architettura dovesse mostrarli. Li abbiamo introdotti quando una decisione del sistema li rendeva necessari.

Questo è forse il capstone più importante del libro: **l'ordine delle decisioni**.

Ogni capability più complessa avrebbe potuto essere aggiunta prima. Abbiamo aspettato che il problema guadagnasse il diritto di richiederla.

## Il NO-GO resta il finale corretto di Order Operations

La Production Readiness Review corrente è ancora:

```text
PRR-OO-001
NO-GO — evidence closure required
```

Non abbiamo chiuso artificialmente i blocker per ottenere un finale soddisfacente. Alcune property sono Designed o Codified, altre Verified; alcuni boundary launch-critical richiedono ancora evidence reale.

> **La maturity non consiste nell'arrivare sempre a GO. Consiste anche nel sapere perché un NO-GO è la decisione corretta.**

Il libro non ha bisogno che Order Operations vada in produzione per dimostrare il metodo. Ha bisogno che il lettore sappia distinguere ciò che è stato progettato da ciò che è stato dimostrato.

Campaign Launchpad ci ha protetto dall'errore opposto. Dopo molti capitoli su un sistema enterprise, potevamo confondere la disciplina con la complessità. Il piccolo prodotto Marketing mostra che problem clarity, security boundary, rollback e readiness possono esistere senza microservices, queue, Kubernetes, RAG o multi-agent runtime.

> **La disciplina non obbliga alla complessità. È ciò che ci permette di evitarla senza diventare superficiali.**

## Le domande che devono sopravvivere

Quando inizierà il prossimo progetto, la tecnologia può aspettare qualche minuto. Prima vale la pena chiedere quale outcome vogliamo ottenere, chi lo desidera e quale comportamento deve davvero cambiare.

Poi arrivano le domande funzionali: attori, stati, invariant, ownership, side effect e decision authority. Solo dopo possiamo valutare quali scelte architetturali comprano le property necessarie, quale costo introducono e quali failure creano.

Quando il sistema diventa reale, dobbiamo sapere come osservarlo, come recuperarlo, chi lo opera e quale evidence sostiene la promessa. Quando evolve, dobbiamo sapere quali decisioni sono reversibili, quali assumption possono scadere e quali trigger riaprono un ADR.

Con l'AI si aggiungono domande specifiche, ma non un principio nuovo: che cosa può fare l'agente, che cosa è autorizzato a fare, quale contesto riceve, quale authority non deve possedere, come verifichiamo l'output e quando deve fermarsi.

Queste domande non producono automaticamente un'architettura.

Producono qualcosa di più prezioso: **un processo decisionale che può essere criticato**.

## Costruisci il tuo Architecture Operating Model

L'ultimo esercizio utile non è disegnare un altro diagramma. È scrivere una pagina su come vuoi prendere decisioni quando l'execution accelera.

Descrivi come separi outcome e solution request; cosa devi capire prima di delegare; come riconosci una decisione significativa; quale evidence consideri sufficiente; come registri un unknown; chi coinvolgi quando il rischio supera la tua profondità; come riapri una decisione quando cambia il contesto; quale promessa sei disposto a difendere quando il sistema entra in produzione.

Non deve diventare un processo universale. Deve essere un operating model consapevole e modificabile.

Anche la governance è soggetta a `fit before fashion`.

## La disciplina deve essere proporzionata al rischio

Dopo un libro intero su artifact, evidence e gate esiste un ultimo pericolo: costruire un metodo così pesante da trasformare Architecture nel problema che dovrebbe risolvere.

Campaign Launchpad non richiede la governance di Payments. Un typo non richiede un Execution Work Item di tre pagine. Un refactoring locale non richiede un Architecture Board. Un agente che rinomina una funzione non richiede lo stesso autonomy gate di un agente con accesso a customer data.

> **La disciplina serve ad accelerare le decisioni che possono essere semplici e a rallentare soltanto quelle che meritano di essere difficili.**

Se il processo costa più del rischio che protegge, anche il processo deve essere riesaminato.

## Non serve prevedere quali task resteranno umani

È tentante chiudere con una lista di attività che l'AI non saprà mai fare. Sarebbe una previsione fragile. Capability che oggi sembrano difficili verranno probabilmente automatizzate meglio.

Il punto non è proteggere un insieme statico di task. È mantenere un sistema di accountability capace di evolvere con le capability.

Anche se un agente saprà analizzare un dominio, proporre una topology, scrivere il codice, creare i test, distribuire e monitorare il sistema, l'organizzazione dovrà ancora governare outcome, risk acceptance, authority, evidence e responsabilità sulle conseguenze.

Forse l'AI supporterà sempre meglio anche queste decisioni. Supportare una decisione e possederne la responsabilità restano però concetti diversi.

## Il timone

All'inizio abbiamo detto:

> **Sii il pilota, non il copilota.**

Il pilota non è chi tocca ogni comando. È chi mantiene abbastanza comprensione per sapere dove sta andando, perché, con quali limiti, quale evidence, quando fermarsi e quando cambiare rotta.

Questo è il professionista che il libro prova a costruire: non qualcuno che compete con l'AI sulla quantità di output, ma qualcuno che sa trasformare maggiore execution in maggiore capacità senza trasformarla in maggiore irresponsabilità.

Resta un ultimo lavoro.

Dobbiamo comprimere tutto ciò che abbiamo attraversato in dieci principi abbastanza brevi da essere ricordati e abbastanza seri da reggere il peso dei capitoli che li precedono.

Non li abbiamo scritti all'inizio perché allora sarebbero stati slogan.

Adesso hanno un significato.

E quando li scriveremo, non verrà più niente dopo.
