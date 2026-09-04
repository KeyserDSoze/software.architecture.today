## Dal requisito al problema

Una delle frasi più pericolose in un progetto software è:

> “Il requisito è chiaro.”

A volte lo è davvero.

Molto spesso significa soltanto che la richiesta è scritta in modo comprensibile.

Queste due cose non coincidono.

Consideriamo:

> “Dobbiamo aggiungere una dashboard per gli ordini.”

È una richiesta chiara dal punto di vista linguistico.

Ma non sappiamo ancora chi la userà, quale decisione dovrebbe migliorare e con quale frequenza. Non abbiamo definito quali metriche servano davvero, quale freshness sia necessaria, se esista già uno strumento che risolve parte del problema né quale comportamento dovrebbe cambiare grazie alla dashboard.

Se partiamo direttamente dalla soluzione, la dashboard diventa il problema.

Questo fenomeno è comune:

```text
richiesta di soluzione
→ interpretata come requisito
→ trasformata in feature
→ implementata
→ misurata in termini di completamento
```

Manca un passaggio:

```text
richiesta
→ problema
→ outcome
→ alternative
→ soluzione
```

### Una feature non è un outcome

“Costruire una dashboard” è un output.

“Ridurre il tempo necessario al team operations per individuare ordini bloccati” è un outcome.

“Implementare un chatbot” è un output.

“Ridurre il numero di richieste di assistenza ripetitive senza peggiorare la risoluzione dei casi complessi” è un outcome.

“Portare il sistema su Kubernetes” è un output.

“Permettere deployment indipendenti con requisiti di isolamento e disponibilità che l'attuale piattaforma non riesce a garantire” descrive almeno una motivazione verificabile.

La distinzione conta perché gli output hanno una proprietà seducente: sono facili da completare.

Possiamo chiudere la issue.

Possiamo fare una demo.

Possiamo contare le feature.

Gli outcome sono più scomodi.

Ci obbligano a chiederci se ciò che abbiamo costruito abbia cambiato qualcosa che valeva la pena cambiare.

### Il software come intervento

Possiamo pensare a una feature come a un intervento su un sistema esistente.

Prima esiste uno stato:

```text
utente
→ comportamento attuale
→ frizione / rischio / costo / opportunità
```

Introduciamo software perché vogliamo modificare quel sistema:

```text
utente
→ nuovo comportamento o nuova capacità
→ outcome desiderato
```

Questa prospettiva evita di trattare la feature come un oggetto isolato.

La domanda non è soltanto:

> “Che cosa deve fare?”

Ma anche:

> “Che cosa dovrebbe diventare diverso quando esiste?”

### Problem statement

Un problem statement utile non deve essere elegante.

Deve essere specifico abbastanza da orientare le decisioni.

Una forma semplice può essere:

```text
[Utente o attore]
ha difficoltà a [comportamento / compito]
perché [causa o vincolo osservato].
Questo produce [conseguenza].
Vogliamo migliorare [outcome],
senza compromettere [vincolo importante].
```

Esempio per Order Operations:

```text
Il team operations ha difficoltà a identificare rapidamente gli ordini
che richiedono intervento manuale perché lo stato operativo è distribuito
tra più schermate e alcuni errori emergono soltanto dalle segnalazioni dei clienti.

Questo aumenta il tempo di gestione e rende reattivo il supporto.

Vogliamo ridurre il tempo necessario a individuare gli ordini bloccati,
senza introdurre un nuovo sistema di workflow separato dalla piattaforma ordini.
```

Notiamo che non abbiamo ancora deciso di costruire una dashboard.

Potrebbe essere la soluzione giusta.

Potrebbe non esserlo.

### Outcome prima della metrica perfetta

Non ogni progetto parte con una baseline impeccabile.

Non dobbiamo fingere il contrario.

A volte sappiamo che un processo è lento ma non abbiamo ancora una misura affidabile.

A volte sappiamo che gli utenti abbandonano un flusso, ma dobbiamo ancora strumentarlo correttamente.

A volte il primo outcome della fase iniziale è proprio rendere misurabile il sistema.

Questo non giustifica outcome vaghi per sempre.

Significa distinguere ciò che sappiamo da ciò che stiamo stimando e da ciò che dobbiamo ancora misurare.

Un buon brief può dire:

```text
Outcome desiderato:
ridurre il tempo medio di identificazione degli ordini bloccati.

Baseline:
non ancora affidabile; da misurare per due settimane.

Primo target operativo:
il 90% degli ordini con errore noto deve essere identificabile senza consultare log tecnici.
```

È molto più utile di inventare una precisione che non possediamo.

### Proxy e metriche locali

Una metrica può migliorare mentre il problema peggiora.

Supponiamo di misurare il successo di una nuova automazione con:

> percentuale di ticket chiusi automaticamente.

Un agente potrebbe ottimizzare perfettamente quella metrica chiudendo richieste che avrebbero dovuto essere escalate.

Il numero migliora.

L'outcome reale peggiora.

Ogni volta che scegliamo una metrica dobbiamo quindi chiederci:

> “In quale modo questa metrica potrebbe migliorare senza che migliori ciò che ci interessa davvero?”

Questa domanda sarà importante anche più avanti, quando parleremo di SLO, costi, performance ed evaluation dei sistemi AI.

### Il problema non appartiene soltanto al product manager

Un errore organizzativo frequente è trattare il problem framing come qualcosa che avviene “prima della tecnologia” e appartiene ad altri ruoli.

Product definisce il problema.

Engineering implementa.

La separazione sembra efficiente.

Ma molte domande che cambiano il problema emergono soltanto quando qualcuno comprende le conseguenze tecniche.

Per esempio:

- il dato richiesto non esiste con la granularità immaginata;
- la risposta in tempo reale costa enormemente più di una risposta aggiornata ogni minuto;
- l'integrazione esterna non offre le garanzie assunte;
- una richiesta apparentemente semplice introduce un nuovo dato sensibile;
- una feature richiede una disponibilità molto maggiore del resto del sistema;
- un comportamento desiderato confligge con una regola di consistenza già esistente.

L'architect e il developer devono quindi partecipare alla definizione del problema.

Non per trasformare ogni conversazione in una discussione tecnica.

Per evitare che decisioni di prodotto e decisioni tecniche vengano prese in universi separati.

Questo è un primo esempio del principio che useremo più avanti:

> **Giocare fuori ruolo.**

### Domanda di controllo

Prima di accettare una feature come punto di partenza, proviamo a completare questa frase:

> **Se questa feature funzionasse perfettamente, quale problema sarebbe meno grave di prima?**

Se non sappiamo rispondere, non significa necessariamente che dobbiamo fermare tutto.

Significa che stiamo per iniziare execution con una parte importante del contesto ancora implicita.