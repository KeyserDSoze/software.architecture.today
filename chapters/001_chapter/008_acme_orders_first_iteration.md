## Caso simulato/composito — Acme Orders: il primo giorno è facilissimo

> **Tipo di caso: simulato/composito.** Acme Orders è un prodotto didattico costruito per accompagnare il libro. Azienda, numeri, persone e circostanze non descrivono un caso reale specifico.

Useremo **Acme Orders** come capstone incrementale.

Non partirà come piattaforma globale.

Non avrà microservizi, Kubernetes, event streaming, multi-region e trenta diagrammi.

Partirà da una richiesta piccola.

> “Ci serve un'applicazione per inserire e consultare ordini.”

Tutto qui.

### Giorno 1

Una singola persona apre un repository vuoto e chiede a un agente di creare:

- una web app;
- autenticazione;
- elenco ordini;
- creazione ordine;
- dettaglio ordine;
- database relazionale;
- deployment cloud.

Dopo poche ore esiste qualcosa di convincente.

La UI è pulita.

Possiamo creare un ordine.

Possiamo riaprire la pagina e ritrovarlo.

Il login funziona.

C'è una pipeline.

Ci sono test.

La demo è ottima.

Se il nostro obiettivo fosse soltanto dimostrare che l'idea è tecnicamente realizzabile, potremmo essere già soddisfatti.

Ma Acme Orders non è ancora un'architettura interessante.

È una collezione di decisioni, alcune esplicite e molte implicite.

### Le decisioni che abbiamo già preso senza accorgercene

Anche una applicazione molto piccola contiene scelte.

Per esempio:

- quale dato identifica un ordine;
- quali stati può avere;
- chi può crearlo;
- chi può leggerlo;
- se gli ordini appartengono a una organizzazione;
- se la cancellazione è fisica o logica;
- quale timezone usiamo;
- come rappresentiamo denaro;
- chi assegna il numero ordine;
- se un update sovrascrive il dato precedente;
- quale sistema è autorevole per il cliente;
- come gestiamo errori e retry.

L'agente può aver scelto risposte plausibili.

Questo non le rende risposte corrette per il prodotto.

### La prima richiesta reale

Il giorno successivo arriva una precisazione.

> “Ogni cliente deve vedere soltanto i propri ordini.”

Sembra un requisito quasi ovvio.

Ma il sistema era stato generato senza un concetto esplicito di tenant.

Gli ordini hanno un `userId`, ma nel mondo reale il cliente non coincide con il singolo utente.

Una azienda può avere più persone.

Alcune devono vedere tutti gli ordini dell'organizzazione.

Altre soltanto quelli del proprio reparto.

Un amministratore interno di Acme deve poter assistere il cliente.

La frase “ognuno vede i propri ordini” si è trasformata in un problema di identity, authorization e ownership del dato.

### Correzione prompt-first

Il workflow più immediato è chiedere:

> “Aggiungi organizations e ruoli.”

L'agente modifica schema e codice.

La demo torna a funzionare.

Poi arriva una seconda richiesta:

> “Un ordine approvato non può essere modificato.”

Aggiungiamo uno status.

Poi:

> “Il finance deve poter correggere il riferimento contabile anche dopo l'approvazione.”

Introduciamo una eccezione.

Poi:

> “Quando l'ordine viene approvato dobbiamo inviarlo al gestionale.”

Aggiungiamo una chiamata HTTP sincrona.

Poi:

> “Il gestionale ogni tanto è lento, ma l'utente non deve aspettare.”

Aggiungiamo una coda.

Poi:

> “Non possiamo perdere ordini se la pubblicazione sulla coda fallisce.”

Ora scopriamo il problema della consistenza tra database e messaging.

Nessuna singola richiesta è assurda.

Il problema è il modo in cui la soluzione cresce:

```text
requisito
→ patch locale
→ nuovo requisito
→ patch locale
→ nuova eccezione
→ altra patch
```

La struttura del sistema viene scoperta dopo l'implementazione.

### Fermarsi prima che sia necessario rifare tutto

A questo punto abbiamo due possibilità.

La prima è continuare.

L'agente è veloce.

Possiamo chiedergli di sistemare ogni nuovo caso.

Probabilmente continuerà a produrre un sistema funzionante ancora per un po'.

La seconda è fermarci e trasformare ciò che abbiamo imparato in contesto esplicito.

Per esempio:

```text
Order
- appartiene a una Organization
- ha un lifecycle esplicito
- alcune transizioni sono autorizzate per ruolo
- l'approvazione crea un obbligo di integrazione con ERP
- la mancata disponibilità dell'ERP non deve bloccare l'utente
- l'integrazione deve essere retryable senza duplicare l'ordine
```

Non è ancora un design completo.

Ma ora possediamo un modello migliore del problema.

Il prossimo task può essere progettato attorno a questo modello invece di continuare a sedimentare eccezioni.

### Il valore del prototipo

È importante non leggere questa storia come una critica al primo prototipo.

Il prototipo ha fatto il suo lavoro.

Ci ha permesso di:

- vedere il prodotto;
- ottenere feedback;
- scoprire requisiti;
- rendere concrete domande astratte;
- capire quali concetti meritano di diventare espliciti.

Il problema sarebbe trattare il prototipo come prova che tutte le sue decisioni debbano sopravvivere.

Una parte del lavoro architetturale consiste proprio nel riconoscere:

> **quali scelte del prototipo sono conoscenza acquisita e quali sono soltanto impalcatura temporanea.**

### Il primo debito di Acme Orders

Chiamiamo `userId` il primo debito architetturale di Acme Orders.

Non perché il campo sia tecnicamente sbagliato.

È sbagliata l'assunzione che contiene:

```text
utente == cliente == owner dell'ordine
```

L'implementazione ha compresso tre concetti in uno.

Finché il prodotto era una demo, la semplificazione funzionava.

Quando il contesto cambia, emerge il costo.

Questa dinamica tornerà continuamente nel libro.

Non giudicheremo una architettura chiedendo:

> “È moderna?”

Chiederemo:

> “Quali assunzioni contiene, per quale contesto erano ragionevoli e quali nuovi requisiti le stanno rendendo costose?”

### Cosa facciamo adesso

Non risolveremo Acme Orders in questo capitolo.

Sarebbe contrario alla tesi del libro.

Non conosciamo ancora abbastanza il problema.

Nel Capitolo 2 torneremo indietro rispetto al codice e costruiremo una foundation minima:

- problema;
- utenti;
- outcome;
- scope;
- vincoli;
- requisiti;
- acceptance criteria.

Poi lasceremo che l'architettura emerga dalle informazioni che abbiamo, non dall'architettura che vorremmo mostrare.

Per ora Acme Orders ci serve a fissare un principio:

> **una demo può iniziare il processo di comprensione. Non deve necessariamente concludere il processo di progettazione.**
