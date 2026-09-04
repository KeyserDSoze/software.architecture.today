# Capitolo 2 — Prima del codice

Nel capitolo precedente abbiamo visto che l’AI rende l’execution più economica e più veloce. È una buona notizia, ma porta con sé una conseguenza scomoda: **possiamo iniziare a costruire molto prima di avere capito abbastanza bene che cosa stiamo costruendo**.

Per anni molti progetti software sono stati rallentati da limiti di execution. Servivano tempo, persone, ambienti, boilerplate, configurazioni, prototipi e integrazioni. Oggi una parte di quel costo può essere compressa drasticamente: un’idea può diventare una demo in ore e, nello stesso pomeriggio, possiamo ottenere endpoint, UI, migration, test, pipeline e perfino una prima infrastruttura.

La velocità con cui possiamo produrre una soluzione, però, non ci dice nulla sulla qualità del problema che abbiamo formulato. Un requisito sbagliato implementato perfettamente resta sbagliato. Una feature inutile generata in cinque minuti è soltanto una feature inutile arrivata prima. E un’architettura costruita su assunzioni non esplicitate non diventa migliore perché è stata prodotta rapidamente.

Questo capitolo riguarda quindi ciò che viene **prima** dell’architettura tecnica. Prima dei diagrammi, del framework, del database e del cloud provider dobbiamo capire quale problema stiamo cercando di risolvere e per chi, quale outcome ci interessa, quale parte del problema appartiene davvero al nostro scope e quali vincoli non possiamo ignorare. Dobbiamo rendere comprensibili i comportamenti essenziali, trasformare le qualità importanti in condizioni osservabili e decidere che cosa significhi, concretamente, poter dire che abbiamo finito.

Questa fase non è un rito preliminare. È **compressione dell’ambiguità**.

### Il falso dilemma: progettare tutto o partire subito

Quando si parla di lavoro “prima del codice” emerge spesso una reazione comprensibile: nessuno vuole passare tre mesi a scrivere documenti prima di scoprire se un’idea funzioni.

Questo libro non difende una progettazione totale e anticipata. Non propone di congelare requisiti che ancora non conosciamo né di prevedere ogni edge case prima della prima riga di codice. Il dilemma tra specificare tutto prima e iniziare a scrivere subito è falso.

La domanda utile è un’altra:

> **Qual è il minimo livello di comprensione che rende ragionevole iniziare questa execution?**

Per un prototipo usa-e-getta può essere pochissimo. Per una migration irreversibile può essere molto. Una modifica a un sistema di pagamento richiede più chiarezza di un cambiamento puramente estetico, e una feature interna per dieci utenti può tollerare assunzioni che non accetteremmo in un sistema sanitario o finanziario.

La quantità di foundation deve essere proporzionata al rischio.

### Foundation Before Execution

Useremo spesso l’espressione **Foundation Before Execution**. Non significa “documentazione prima del lavoro”; significa ridurre abbastanza l’incertezza sulle decisioni importanti prima di moltiplicare la capacità di esecuzione.

Una foundation minima rende visibili almeno il problema, gli utenti, l’outcome, lo scope e i vincoli. A seconda del rischio, può aggiungere comportamenti funzionali principali, NFR significativi, assunzioni, acceptance criteria e out of scope.

La parola importante è **significativi**. Non dobbiamo specificare ciò che non serve ancora; dobbiamo rendere esplicito ciò che, se lasciato implicito, potrebbe portare persone o agenti a costruire sistemi diversi credendo di lavorare allo stesso prodotto.

### Una cattiva foundation viene amplificata

Con un singolo developer, un requisito ambiguo può produrre una interpretazione sbagliata. Con cinque agenti in parallelo può produrne cinque.

Prendiamo una richiesta apparentemente semplice: “Aggiungi la possibilità di annullare un ordine”. Prima di implementarla dobbiamo sapere chi possa annullarlo e fino a quando, che cosa accada se il pagamento sia già stato eseguito o la spedizione sia iniziata, che cosa significhi l’annullamento per il magazzino e se sia necessario un rimborso. Dobbiamo capire se quel rimborso possa fallire, se l’operazione debba essere idempotente, se altri sistemi debbano ricevere un evento e che cosa accada quando il cliente riprova.

Non serve rispondere in anticipo a ogni possibile dettaglio. Serve almeno rispondere alle domande che cambiano il comportamento del sistema. Altrimenti l’agente dovrà farlo al posto nostro e sceglierà qualcosa di plausibile.

Il problema è proprio questo: una decisione plausibile non è necessariamente la nostra decisione.

### Il costo invisibile delle assunzioni

Le assunzioni implicite sono pericolose perché spesso non compaiono nel diff. Vediamo il codice, una nuova tabella o un endpoint, ma non vediamo subito la frase non scritta che ha prodotto quella soluzione: “ho assunto che un ordine possa essere annullato fino alla spedizione”, “ho assunto che il rimborso sia sincrono”, “ho assunto che soltanto il proprietario dell’ordine possa eseguire l’operazione”.

L’architettura nasce spesso da queste frasi invisibili. Prima del codice dobbiamo imparare a portarle alla luce.

### Dal prompt al brief

Nel capitolo precedente abbiamo criticato il *prompt-first development*. La risposta non è scrivere prompt infinitamente più lunghi, ma costruire pochi artefatti stabili che rendano il contesto leggibile e verificabile.

Il primo sarà il **Problem & Outcome Brief**. Non è una specifica completa: è una pagina, a volte meno, che permette a un essere umano o a un agente di capire quale situazione vogliamo cambiare, per chi e quale outcome ci dirà che abbiamo creato valore. Deve rendere chiaro ciò che stiamo facendo adesso e ciò che stiamo lasciando fuori, i vincoli noti e le assunzioni che richiedono ancora verifica.

Il suo scopo non è descrivere la soluzione. È impedire che la soluzione preceda il problema.

### Il caso Order Operations

Nel capitolo precedente abbiamo introdotto **Order Operations**, il caso simulato/composito che accompagnerà il libro. Abbiamo visto un piccolo prodotto crescere attraverso richieste apparentemente semplici. Da qui in poi smettiamo di aggiungere feature per inerzia e torniamo all’inizio, non per buttare il prototipo, ma per capire che cosa stiamo realmente cercando di costruire.

È un passaggio importante perché molti progetti reali non iniziano da una pagina bianca. Iniziano da qualcosa che esiste già e funziona abbastanza da generare nuove domande. “Prima del codice” non significa quindi sempre cronologicamente prima della prima riga.

Può significare:

> **prima della prossima decisione costosa.**

Ed è lì che iniziamo.
