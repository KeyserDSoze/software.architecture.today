## Caso simulato/composito — Order Operations: il primo giorno è facilissimo

> **Tipo di caso: simulato/composito.** Order Operations è un prodotto didattico di **Example Software Industries S.p.A. (ESI)**. Azienda, numeri, persone e circostanze sono inventati. I casi reali del libro vengono dichiarati separatamente e supportati da fonti.

Nel front matter abbiamo conosciuto ESI, una grande software product company con più business unit e interessi che non coincidono sempre. Ora entriamo nel primo prodotto che accompagnerà il libro capitolo dopo capitolo.

**Order Operations** nasce nella business unit **Commerce & Operations**. Non parte come piattaforma globale e non ha bisogno, il primo giorno, di microservizi, Kubernetes, event streaming, multi-region o trenta diagrammi. Parte da un problema molto più piccolo e concreto: gli operatori impiegano troppo tempo per capire quali ordini richiedano attenzione e perché.

### Giorno 1

Un product manager e un operations lead descrivono una prima capability. Vogliono una vista che mostri gli ordini problematici, distingua almeno i problemi di ordine, pagamento e spedizione e permetta di aprire un dettaglio operativo. Soprattutto, l’operatore deve poter capire quale sistema possiede il dato autorevole che sta osservando.

Una singola persona apre un repository vuoto e affida a un agente la prima implementazione: una web app interna con autenticazione, lista e dettaglio degli ordini problematici, un database relazionale, le integrazioni minime necessarie, deployment cloud e test automatici.

Dopo poche ore il risultato è convincente. La UI è pulita, gli ordini compaiono, il login funziona, esistono una pipeline e una suite di test. Se il nostro obiettivo fosse soltanto dimostrare che l’idea è tecnicamente realizzabile, potremmo essere soddisfatti.

Ma Order Operations non è ancora un’architettura interessante. È già una collezione di decisioni, alcune esplicite e molte implicite.

### Le decisioni che abbiamo già preso senza accorgercene

Anche una console interna molto piccola contiene scelte di dominio e di sistema. Nel momento in cui diciamo che un ordine è “problematico” dobbiamo stabilire che cosa significhi davvero quella parola e chi abbia l’autorità per attribuirla. Dobbiamo distinguere lo stato dell’ordine da quello del pagamento e della spedizione, decidere quali dati leggere live e quali possano essere stale, separare un errore tecnico da un problema business e capire quali dati personali servano davvero all’operatore.

Anche timeout, retry e indisponibilità delle dipendenze smettono rapidamente di essere dettagli implementativi. Se un’azione può essere ritentata, dobbiamo sapere se il retry sia sicuro. Se domani introdurremo remediation, dovremo decidere chi possa autorizzarla e quale sistema rimanga autorevole per il risultato.

L’agente può aver scelto risposte plausibili a molte di queste domande. Questo non le rende risposte corrette per ESI.

### La prima richiesta reale

Il giorno successivo Operations aggiunge una frase apparentemente innocua: “Dalla lista dobbiamo poter capire subito se il problema è nel pagamento”.

L’implementazione corrente ha un unico campo:

```text
status = Problematic
```

Per la demo era sufficiente; nel prodotto reale comincia a non esserlo. Un ordine può essere valido mentre il pagamento è fallito. Un pagamento può essere acquisito mentre la spedizione è bloccata. Una spedizione può essere in ritardo senza rendere semanticamente invalido l’ordine.

Il singolo `status` ha compresso significati differenti in una rappresentazione comoda. Il codice non ha ancora un bug evidente, ma il modello ha iniziato a nascondere informazioni che il dominio considera diverse.

### Entra Payments & Risk

A questo punto compare il primo contrasto aziendale. Commerce & Operations vuole una vista semplice, perché l’obiettivo è far lavorare gli operatori velocemente. Payments & Risk porta però un vincolo altrettanto legittimo: una classificazione operativa non deve trasformarsi accidentalmente in una nuova verità sul pagamento.

La tensione non si risolve facendo vincere un team. Una UI che costringe l’operatore a ricostruire tutto manualmente è poco utile; una UI che inventa una semantica economica propria è pericolosa. Serve un confine che permetta di aggregare senza appropriarsi della verità degli altri domini:

```text
Order status      → significato posseduto da Orders
Payment status    → significato posseduto da Payments
Shipment status   → significato posseduto da Shipping
Problem category  → classificazione operativa derivata
```

Questa distinzione sembra piccola, ma cambia il modo in cui il prodotto potrà evolvere.

### La tentazione della correzione prompt-first

Il workflow più immediato sarebbe chiedere all’agente di aggiungere `paymentStatus` e `shipmentStatus`. Schema, UI e test cambierebbero rapidamente e la demo tornerebbe a funzionare. Poco dopo potrebbe arrivare la richiesta di aggiungere un pulsante Retry quando il pagamento fallisce; poi scopriremmo che alcuni provider non garantiscono che quel retry sia innocuo, che certe operazioni richiedono approvazione, che Finance vuole un audit completo e che il provider a volte risponde tardi.

Nessuna singola richiesta è assurda. Il problema è lasciare che il sistema cresca come una successione di patch locali: ogni nuovo requisito produce una correzione, ogni eccezione genera un’altra correzione e la struttura del sistema viene compresa soltanto dopo che è stata implementata.

### Il primo compromesso ESI

ESI non ha bisogno di conoscere oggi tutti i workflow futuri, ma ha bisogno di evitare che la velocità iniziale trasformi assunzioni economiche o di autorizzazione in codice permanente. La scelta è quindi deliberatamente modesta: la prima versione di Order Operations resterà **read-oriented**. Permetterà di vedere e investigare ordini problematici, ma non automatizzerà ancora retry, refund o altre remediation con side effect.

Il costo di questa scelta è reale. Alcune azioni resteranno manuali e il prodotto iniziale risolverà meno problemi di quanti potrebbe tecnicamente automatizzare. In cambio, ESI protegge un quality floor preciso: non inventerà semantica economica, authorization o idempotenza pur di rispettare la deadline. Prima di introdurre azioni con conseguenze sul cliente o sul denaro serviranno analisi funzionale, contratto esplicito, ownership e verification adeguata.

Questo è un compromesso, non una rinuncia alla qualità.

> **Compromesso sì. Qualità inconsapevolmente degradata no.**

### Fermarsi prima che sia necessario rifare tutto

A questo punto possiamo continuare a generare oppure fermarci e trasformare ciò che abbiamo imparato in contesto esplicito. L’agente è abbastanza veloce da sistemare molti nuovi casi ancora per un po’, ma proseguire senza consolidare il modello ci renderebbe sempre più dipendenti da decisioni nate per inerzia.

Quello che ora sappiamo è già sufficiente per cambiare il prossimo passo. Order Operations è una capability interna che aiuta Operations a individuare e investigare ordini problematici. Può aggregare informazioni provenienti da Orders, Payments e Shipping, ma non possiede automaticamente la verità di quei domini. Deve distinguere i loro stati e può derivare classificazioni operative senza trasformarle in una nuova source of truth. Soprattutto, non introdurrà azioni economiche finché semantica e ownership non saranno definite.

Non è ancora un design completo. È però un modello migliore del problema, e il prossimo task può essere costruito attorno a questo modello invece di continuare a sedimentare eccezioni.

### Il valore del prototipo

Questa storia non è una critica al prototipo. Il prototipo ha fatto esattamente il suo lavoro: ha reso visibile il prodotto, permesso di ottenere feedback, fatto emergere requisiti e stakeholder che prima non erano al tavolo e trasformato domande astratte in problemi concreti.

Il problema nascerebbe se trattassimo tutte le decisioni del prototipo come parte obbligatoria della fondazione. Una parte del lavoro architetturale consiste proprio nel distinguere **la conoscenza acquisita dall’impalcatura temporanea usata per acquisirla**.

### Il primo debito di Order Operations

Chiamiamo il singolo campo `status` il primo debito architetturale del capstone. Non perché un campo chiamato `status` sia tecnicamente sbagliato, ma perché in questo caso contiene un’assunzione che il nuovo contesto ha reso falsa:

```text
order status
== payment status
== shipment status
== operational problem
```

L’implementazione ha compresso quattro concetti in uno. Finché il prodotto era una demo, la semplificazione funzionava. Quando il contesto è cambiato, il costo della compressione è emerso.

Questa dinamica tornerà continuamente nel libro. Non giudicheremo un’architettura chiedendo se sia moderna. Ci chiederemo quali assunzioni contenga, per quale contesto fossero ragionevoli e quali nuovi requisiti le stiano rendendo costose.

### Cosa facciamo adesso

Non risolveremo Order Operations in questo capitolo: sarebbe contrario alla tesi del libro, perché non conosciamo ancora abbastanza il problema.

Nel Capitolo 2 torneremo quindi indietro rispetto al codice e costruiremo una foundation minima. Chiariremo problema, utenti, outcome, scope e vincoli; trasformeremo le ambiguità in requisiti e acceptance criteria e inizieremo una vera analisi funzionale condivisa. Solo allora lasceremo che l’architettura emerga dalle informazioni che possediamo, invece che dall’architettura che vorremmo mostrare.

Per ora Order Operations ci serve a fissare un principio:

> **Una demo può iniziare il processo di comprensione. Non deve necessariamente concludere il processo di progettazione.**
