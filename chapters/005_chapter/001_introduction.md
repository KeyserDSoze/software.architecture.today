# Capitolo 5 — Dalle feature ai confini

Una feature arriva quasi sempre come una frase breve: “permetti al cliente di annullare un ordine”, “aggiungiamo la cronologia delle modifiche”, “serve una dashboard per gli operatori”. Da una richiesta così può nascere una modifica di poche righe oppure una trasformazione che attraversa mezzo sistema.

La differenza non dipende soltanto dalla quantità di codice. Dipende da **dove passa la responsabilità**.

Quando il software cresce, implementare il comportamento non basta più. Dobbiamo decidere quali regole appartengano davvero insieme, quali conoscenze debbano rimanere locali, chi sia autorevole per un significato e quali dipendenze siamo disposti a far attraversare un confine. Dobbiamo anche capire quali cambiamenti vogliamo poter fare senza coordinare mezzo repository.

Queste sono domande di design. Diventano architetturali quando un confine sbagliato rende costoso cambiare il sistema.

## Il repository non si divide da solo

Ogni codebase presenta già una struttura: cartelle, namespace, package, progetti, servizi, API e database. È facile scambiare questa organizzazione per modularità.

Un'applicazione può essere ordinata così:

```text
controllers/
services/
repositories/
models/
utils/
```

ed essere comunque difficile da modificare. Se ogni feature attraversa tutte le cartelle, se una regola è ricostruita in più layer e se per cambiare un comportamento dobbiamo conoscere metà repository, abbiamo classificato il codice per tipo tecnico senza necessariamente contenere il cambiamento.

Il codice può essere ordinato e il sistema rimanere concettualmente mescolato.

## Il confine è una dichiarazione di responsabilità

Un confine utile prova a rispondere a una domanda più impegnativa:

> **Quale parte del sistema ha il diritto e il dovere di conoscere questa cosa?**

Chi decide se un ordine può essere annullato? Il controller, la UI, il database, il modulo Orders, Payments o un workflow esterno?

Se la risposta cambia a seconda di dove ci serve la regola, non abbiamo distribuito soltanto codice: abbiamo distribuito **significato**. E il significato duplicato tende prima o poi a divergere.

Per questo un boundary non serve principalmente a separare file. Serve a rendere locale una decisione.

## La feature non coincide automaticamente con il modulo

Il backlog può suggerire nomi molto convincenti:

```text
OrderCancellationService
OrderHistoryService
OrderExportService
OrderSearchService
```

Ma le feature non sono automaticamente confini. Più feature possono condividere lo stesso modello e le stesse invarianti, quindi separararle aumenterebbe contratti e coordinamento senza comprare vera indipendenza. Al contrario, una singola feature può attraversare responsabilità che devono rimanere distinte.

L'architettura non deve quindi seguire meccanicamente la forma delle issue.

> **Le issue descrivono lavoro. I confini descrivono responsabilità.**

## Cambiare insieme è un segnale

Un modo pratico per scoprire i confini consiste nell'osservare il cambiamento. Se due parti vengono modificate frequentemente per la stessa ragione di business, potrebbe esistere una responsabilità comune. Se due componenti vivono nello stesso package ma cambiano per cause indipendenti, il confine corrente potrebbe essere soltanto convenzionale.

Non è una legge. File che cambiano insieme possono farlo per accidente, e parti dello stesso dominio possono evolvere a ritmi diversi. Ma il **change coupling** è una traccia importante perché ci mostra la struttura che il sistema impone al lavoro reale, non soltanto quella disegnata nelle cartelle.

La modularità utile contiene il cambiamento: permette a una decisione locale di rimanere locale abbastanza a lungo da poter essere compresa e verificata.

## Confini leggibili anche dagli agenti

Con gli agenti questa proprietà acquista un valore ulteriore. Un coding agent incaricato di modificare la gestione degli ordini dovrebbe poter capire quali file appartengano a quella responsabilità, quali invarianti debba preservare, quali API possa usare e quali dipendenze non sia autorizzato a introdurre.

Se un task apparentemente locale richiede di esplorare tutto il repository per evitare effetti collaterali, la delega rimane fragile. Quando invece boundary, ownership e contratti sono leggibili, possiamo ridurre il perimetro di contesto senza nascondere le dipendenze importanti.

La modularità diventa quindi anche **context containment**: per le persone e per gli agenti.

## La domanda del capitolo

Nel capitolo precedente abbiamo definito l'architettura come un sistema di decisioni significative. Ora dobbiamo vedere come quelle decisioni diventano struttura del software.

La domanda centrale sarà:

> **Dove deve vivere una responsabilità perché il sistema resti comprensibile, modificabile e verificabile?**

Useremo modularità, cohesion, coupling, information hiding, dependency direction e domain modeling non come definizioni da memorizzare, ma come lenti diverse con cui giudicare lo stesso confine.

L'obiettivo non è produrre più moduli. È produrre **meno ragioni per cui una modifica locale debba diventare una modifica globale**.
