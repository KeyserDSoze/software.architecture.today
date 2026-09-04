# Capitolo 5 — Dalle feature ai confini

Una feature arriva quasi sempre come una frase breve.

> “Permetti al cliente di annullare un ordine.”

Oppure:

> “Aggiungiamo la cronologia delle modifiche.”

Oppure ancora:

> “Serve una dashboard per gli operatori.”

Da una frase così può nascere una modifica di venti righe oppure una trasformazione dell'intero sistema.

La differenza non dipende soltanto dalla quantità di codice.

Dipende da **dove passa la responsabilità**.

Quando il software cresce, il problema non è più soltanto implementare comportamenti. Diventa decidere quali parti appartengano davvero insieme e quali conoscenze debbano restare locali, quali dipendenze siano accettabili e quali dettagli vadano nascosti. Dobbiamo anche stabilire chi sia autorevole per una regola, quali cambiamenti debbano poter avvenire indipendentemente e dove un confine riduca complessità invece di crearne altra.

Queste sono domande di design.

E molte di esse diventano architetturali quando il costo di sbagliare il confine cresce.

## Il sistema non si divide da solo

Un repository presenta già una struttura.

Cartelle.

Namespace.

Package.

Progetti.

Servizi.

Database.

API.

Ma questa struttura non è necessariamente la struttura del problema.

Potremmo trovare un'applicazione divisa in:

```text
controllers/
services/
repositories/
models/
utils/
```

ed essere tentati di considerarla ben modulare.

In realtà potremmo avere creato soltanto una classificazione per tipo tecnico.

Ogni feature potrebbe attraversare tutte le cartelle.

Ogni regola potrebbe dipendere da dettagli presenti ovunque.

Ogni modifica importante potrebbe richiedere di conoscere metà repository.

Il codice è ordinato.

Il sistema non necessariamente lo è.

### Confini di responsabilità

Un confine utile prova a rispondere a una domanda più difficile:

> **Quale parte del sistema ha il diritto e il dovere di conoscere questa cosa?**

Chi decide se un ordine può essere annullato?

Il controller HTTP?

Il database?

Il modulo ordini?

Il servizio pagamenti?

La UI?

Un workflow esterno?

Se la risposta è “dipende da dove ci serve”, non abbiamo realmente definito una responsabilità.

Abbiamo distribuito una regola.

E una regola distribuita tende a divergere.

### La feature non è sempre il modulo

Un errore comune consiste nel trasformare automaticamente ogni feature in un componente autonomo.

```text
OrderCancellationService
OrderHistoryService
OrderExportService
OrderSearchService
```

Può sembrare ordinato.

Ma non sempre i nomi delle feature indicano confini reali.

A volte più feature condividono lo stesso modello, le stesse invarianti e la stessa ownership.

Separarle crea più contratti, più coordinamento e più possibilità di inconsistenza.

Altre volte una singola feature attraversa invece responsabilità realmente differenti.

L'architettura non deve seguire meccanicamente il backlog.

> **Le issue descrivono lavoro. I confini descrivono responsabilità.**

### Cambiare insieme è un segnale

Una domanda molto utile è:

> quali parti cambiano frequentemente insieme per lo stesso motivo?

Se due classi cambiano sempre quando cambia la stessa regola di business, forse appartengono allo stesso confine.

Se due componenti vivono nello stesso package ma cambiano per motivi completamente differenti, forse il confine attuale è artificiale.

Questo non è un criterio assoluto.

Ma è un segnale.

La modularità riguarda anche la capacità di contenere il cambiamento.

Un buon modulo permette a una decisione locale di rimanere locale.

### Confini e AI

Con gli agenti questa proprietà diventa ancora più importante.

Un agente a cui chiediamo di modificare la gestione degli ordini dovrebbe poter capire quali file appartengano a quella responsabilità e quali invarianti debba preservare, quali API possa usare, quali dipendenze non debba introdurre e quali test rappresentino il contratto del modulo.

Se una modifica apparentemente locale richiede di esplorare tutto il repository, la capacità di delegare diminuisce.

Se invece i confini sono leggibili, possiamo dare all'agente un perimetro più preciso.

La modularità diventa quindi anche **context containment**.

Non solo per gli esseri umani.

Anche per gli agenti.

### La domanda del capitolo

Nel capitolo precedente abbiamo definito l'architettura come sistema di decisioni significative.

Ora dobbiamo capire come quelle decisioni diventano struttura del software.

La domanda centrale sarà:

> **Dove deve vivere una responsabilità perché il sistema resti comprensibile, modificabile e verificabile?**

Per rispondere useremo concetti classici come modularità, cohesion e coupling, information hiding, dependency inversion, composition e domain modeling. Ma non come definizioni da memorizzare.

Li useremo come strumenti per giudicare un confine.

Il nostro obiettivo non è produrre più moduli.

È produrre **meno ragioni per cui una modifica locale deve diventare una modifica globale**.
