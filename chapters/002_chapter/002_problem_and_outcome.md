## Dal requisito al problema

Una delle frasi più pericolose in un progetto software è: “Il requisito è chiaro”. A volte lo è davvero; molto spesso significa soltanto che la richiesta è scritta in modo comprensibile. Le due cose non coincidono.

Consideriamo la frase “Dobbiamo aggiungere una dashboard per gli ordini”. Dal punto di vista linguistico è chiara. Dal punto di vista del prodotto, invece, non sappiamo ancora chi userà quella dashboard, quale decisione dovrebbe migliorare, con quale frequenza verrà consultata, quali informazioni servano davvero, quale freshness sia necessaria o se esista già uno strumento che risolve parte del problema.

Se partiamo direttamente dalla soluzione, la dashboard smette di essere una possibile risposta e diventa il problema stesso. Il passaggio che manca è quello che trasforma una richiesta di soluzione in un problema, poi in un outcome e soltanto dopo in alternative e soluzione.

### Una feature non è un outcome

“Costruire una dashboard” è un output. “Ridurre il tempo necessario al team Operations per individuare ordini bloccati” è un outcome. “Implementare un chatbot” è un output; “ridurre le richieste di assistenza ripetitive senza peggiorare la risoluzione dei casi complessi” descrive invece un cambiamento che possiamo osservare.

Lo stesso vale per decisioni apparentemente tecniche. “Portare il sistema su Kubernetes” è un output. “Permettere deployment indipendenti con requisiti di isolamento e disponibilità che l’attuale piattaforma non riesce a garantire” descrive almeno una motivazione verificabile.

La distinzione conta perché gli output sono seducenti: possiamo chiudere una issue, fare una demo e contare le feature. Gli outcome sono più scomodi, perché ci obbligano a chiederci se ciò che abbiamo costruito abbia cambiato qualcosa che valeva la pena cambiare.

### Il software come intervento

Una feature può essere vista come un intervento su un sistema già esistente. Prima c’è un utente con un comportamento, una frizione, un costo, un rischio o un’opportunità. Introduciamo software perché vogliamo modificare quel sistema e ottenere un nuovo comportamento o una nuova capacità.

Questa prospettiva cambia la domanda. Non ci chiediamo soltanto che cosa debba fare la feature, ma **che cosa dovrebbe diventare diverso quando quella feature esiste**.

### Problem statement

Un problem statement utile non deve essere elegante. Deve essere abbastanza specifico da orientare le decisioni. Una forma semplice può collegare l’attore, il compito che oggi risulta difficile, la causa osservata, la conseguenza e l’outcome desiderato, facendo emergere anche il vincolo che non vogliamo compromettere.

Per Order Operations, per esempio, potremmo dire che il team Operations fatica a identificare rapidamente gli ordini che richiedono intervento manuale perché lo stato operativo è distribuito tra più strumenti e alcuni errori emergono soltanto dalle segnalazioni dei clienti. Questo aumenta il tempo di gestione e rende il supporto reattivo. Vogliamo ridurre il tempo necessario a individuare gli ordini bloccati senza introdurre un nuovo sistema di workflow separato dalla piattaforma ordini.

Notiamo che non abbiamo ancora deciso di costruire una dashboard. Potrebbe essere la soluzione giusta; potrebbe non esserlo.

### Outcome prima della metrica perfetta

Non ogni progetto parte con una baseline impeccabile e non dobbiamo fingere il contrario. A volte sappiamo che un processo è lento senza avere ancora una misura affidabile; altre volte sappiamo che gli utenti abbandonano un flusso ma dobbiamo prima strumentarlo correttamente. In alcuni casi il primo outcome della fase iniziale è proprio rendere misurabile il sistema.

La cosa importante è distinguere ciò che sappiamo da ciò che stiamo stimando. Per Order Operations possiamo dichiarare che vogliamo ridurre il tempo medio di identificazione degli ordini bloccati, ammettere che la baseline non è ancora affidabile e decidere di misurarla per due settimane. Possiamo anche fissare un primo criterio operativo, per esempio che il 90% degli ordini con errore noto sia identificabile senza consultare log tecnici, se quel target è sostenuto dal bisogno e non inventato per sembrare precisi.

È molto più utile di una precisione fittizia.

### Proxy e metriche locali

Una metrica può migliorare mentre il problema peggiora. Se misuriamo una nuova automazione soltanto attraverso la percentuale di ticket chiusi automaticamente, il sistema potrebbe aumentare quel numero chiudendo richieste che avrebbero dovuto essere escalate.

Per questo ogni metrica dovrebbe essere accompagnata da una domanda scomoda:

> **In quale modo questa metrica potrebbe migliorare senza che migliori ciò che ci interessa davvero?**

La stessa disciplina tornerà quando parleremo di SLO, costi, performance ed evaluation dei sistemi AI.

### Il problema non appartiene soltanto al product manager

Un errore organizzativo frequente è trattare il problem framing come qualcosa che avviene “prima della tecnologia” e appartiene quindi ad altri ruoli: Product definisce il problema, Engineering implementa.

La separazione sembra efficiente, ma molte domande che cambiano il problema emergono soltanto quando qualcuno comprende le conseguenze tecniche. Il dato richiesto potrebbe non esistere con la granularità immaginata; una risposta real-time potrebbe costare enormemente più di una risposta aggiornata ogni minuto; l’integrazione esterna potrebbe non offrire le garanzie che il prodotto presume; una feature apparentemente semplice potrebbe introdurre un nuovo dato sensibile o richiedere una disponibilità radicalmente diversa dal resto del sistema.

Architect e developer devono quindi partecipare alla definizione del problema, non per trasformare ogni conversazione in una discussione tecnica, ma per evitare che decisioni di prodotto e decisioni tecniche vengano prese in universi separati. È un primo esempio del principio che useremo più avanti: **giocare fuori ruolo**.

### Domanda di controllo

Prima di accettare una feature come punto di partenza, proviamo a completare questa frase:

> **Se questa feature funzionasse perfettamente, quale problema sarebbe meno grave di prima?**

Se non sappiamo rispondere, non significa necessariamente che dobbiamo fermare tutto. Significa però che stiamo per iniziare execution con una parte importante del contesto ancora implicita.
