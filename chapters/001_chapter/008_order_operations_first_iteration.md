## Caso simulato/composito — Order Operations: il primo giorno è facilissimo

> **Tipo di caso: simulato/composito.** Order Operations è un prodotto didattico di **Example Software Industries S.p.A. (ESI)**. Azienda, numeri, persone e circostanze sono inventati. I casi reali del libro vengono dichiarati separatamente e supportati da fonti.

Nel front matter abbiamo conosciuto ESI: una grande software product company con più business unit e interessi che non coincidono sempre.

Ora entriamo nel primo prodotto che accompagnerà il libro capitolo dopo capitolo.

**Order Operations** nasce nella business unit **Commerce & Operations**.

Non parte come piattaforma globale.

Non avrà microservizi, Kubernetes, event streaming, multi-region e trenta diagrammi.

Parte da un problema piccolo e molto concreto.

> “Gli operatori perdono troppo tempo per capire quali ordini richiedono attenzione e perché.”

### Giorno 1

Un product manager e un operations lead descrivono una prima capability:

- mostrare gli ordini problematici;
- distinguere problemi di ordine, pagamento e spedizione;
- aprire un dettaglio operativo;
- permettere all'operatore di capire quale sistema possiede il dato autorevole.

Una singola persona apre un repository vuoto e chiede a un agente di creare:

- web app interna;
- autenticazione;
- lista ordini problematici;
- pagina dettaglio;
- database relazionale;
- integrazioni minime;
- deployment cloud;
- test.

Dopo poche ore esiste qualcosa di convincente.

La UI è pulita.

Gli ordini vengono mostrati.

Il login funziona.

C'è una pipeline.

Ci sono test.

La demo è ottima.

Se il nostro obiettivo fosse soltanto dimostrare che l'idea è tecnicamente realizzabile, potremmo essere soddisfatti.

Ma Order Operations non è ancora un'architettura interessante.

È una collezione di decisioni, alcune esplicite e molte implicite.

### Le decisioni che abbiamo già preso senza accorgercene

Anche una console interna molto piccola contiene scelte.

Per esempio:

- che cosa rende un ordine “problematico”;
- chi può vederlo;
- che cosa significa `order status`;
- se payment e shipment hanno stati separati;
- quale dato viene letto live;
- quale dato può essere stale;
- chi è autorevole per una classificazione operativa;
- come distinguiamo errore tecnico e problema business;
- quali dati personali servono davvero all'operatore;
- come gestiamo timeout e dipendenze indisponibili;
- se un retry è sicuro;
- chi può decidere una futura remediation.

L'agente può aver scelto risposte plausibili.

Questo non le rende risposte corrette per ESI.

### La prima richiesta reale

Il giorno successivo Operations aggiunge una frase apparentemente innocua:

> “Dalla lista dobbiamo poter capire subito se il problema è nel pagamento.”

L'implementazione corrente ha un unico campo:

```text
status = Problematic
```

Per la demo era sufficiente.

Nel prodotto reale no.

Un ordine può essere valido mentre il pagamento è fallito.

Un pagamento può essere acquisito mentre la spedizione è bloccata.

Una spedizione può essere in ritardo senza rendere l'ordine semanticamente invalido.

Il singolo `status` ha compresso significati differenti in una rappresentazione comoda.

### Entra Payments & Risk

A questo punto compare il primo contrasto aziendale.

Commerce & Operations vuole una vista semplice:

> “Dobbiamo far lavorare gli operatori velocemente.”

Payments & Risk risponde:

> “Non trasformate una classificazione operativa in una nuova verità sul pagamento.”

Entrambe le esigenze sono legittime.

Una UI che costringe l'operatore a ricostruire manualmente tutto è poco utile.

Una UI che inventa una semantica economica propria è pericolosa.

Il problema architetturale non è far vincere un team.

È trovare un confine.

Per esempio:

```text
Order status      → significato posseduto da Orders
Payment status    → significato posseduto da Payments
Shipment status   → significato posseduto da Shipping
Problem category  → classificazione operativa derivata
```

La vista può aggregare.

Non deve appropriarsi accidentalmente della verità degli altri domini.

### Correzione prompt-first

Il workflow più immediato sarebbe chiedere:

> “Aggiungi paymentStatus e shipmentStatus.”

L'agente modificherebbe schema, UI e test.

La demo tornerebbe a funzionare.

Poi arriverebbe un'altra richiesta:

> “Se il pagamento è fallito vogliamo un pulsante Retry.”

Potremmo farlo generare.

Poi:

> “Per alcuni provider il retry può duplicare l'operazione.”

Aggiungiamo una guardia.

Poi:

> “Alcuni retry devono essere approvati.”

Aggiungiamo un ruolo.

Poi:

> “Finance vuole auditare tutto.”

Aggiungiamo audit.

Poi:

> “Il payment provider ogni tanto risponde tardi.”

Aggiungiamo timeout e retry.

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

### Il primo compromesso ESI

Qui introduciamo una regola che tornerà in ogni capitolo.

**Esigenza**

Operations vuole una prima capability utile rapidamente.

**Tensione**

Velocità di delivery contro comprensione completa di tutti i workflow futuri.

**Decisione**

Costruiamo inizialmente una capability **read-oriented**: vedere e investigare ordini problematici.

Non automatizziamo ancora retry, refund o remediation con side effect.

**Costo accettato**

Alcune azioni restano manuali e il prodotto iniziale risolve meno problemi di quanti potrebbe tecnicamente automatizzare.

**Quality floor**

Non inventiamo semantica economica, authorization o idempotenza per rispettare la deadline.

**Guardrail**

Le azioni con conseguenze sul cliente o sul denaro richiederanno analisi funzionale, contratto esplicito, ownership e verification prima di essere introdotte.

Questo è un compromesso.

Non è una rinuncia alla qualità.

> **Compromesso sì. Qualità inconsapevolmente degradata no.**

### Fermarsi prima che sia necessario rifare tutto

A questo punto abbiamo due possibilità.

La prima è continuare a generare.

L'agente è veloce.

Possiamo chiedergli di sistemare ogni nuovo caso.

Probabilmente continuerà a produrre un sistema funzionante ancora per un po’'.

La seconda è fermarci e trasformare ciò che abbiamo imparato in contesto esplicito.

Per esempio:

```text
Order Operations
- è una capability interna di ESI
- aiuta Operations a individuare e investigare ordini problematici
- non possiede automaticamente la verità di Orders, Payments o Shipping
- deve distinguere gli stati dei diversi domini
- può derivare classificazioni operative senza trasformarle in source of truth
- non introduce azioni economiche finché semantica e ownership non sono definite
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
- far emergere stakeholder che prima non erano nel tavolo;
- rendere concrete domande astratte;
- capire quali concetti meritano di diventare espliciti.

Il problema sarebbe trattare il prototipo come prova che tutte le sue decisioni debbano sopravvivere.

Una parte del lavoro architetturale consiste proprio nel riconoscere:

> **quali scelte del prototipo sono conoscenza acquisita e quali sono soltanto impalcatura temporanea.**

### Il primo debito di Order Operations

Chiamiamo il singolo campo `status` il primo debito architetturale del capstone.

Non perché un campo `status` sia tecnicamente sbagliato.

È sbagliata l'assunzione che contiene:

```text
order status
== payment status
== shipment status
== operational problem
```

L'implementazione ha compresso quattro concetti in uno.

Finché il prodotto era una demo, la semplificazione funzionava.

Quando il contesto cambia, emerge il costo.

Questa dinamica tornerà continuamente nel libro.

Non giudicheremo un'architettura chiedendo:

> “È moderna?”

Chiederemo:

> “Quali assunzioni contiene, per quale contesto erano ragionevoli e quali nuovi requisiti le stanno rendendo costose?”

### Cosa facciamo adesso

Non risolveremo Order Operations in questo capitolo.

Sarebbe contrario alla tesi del libro.

Non conosciamo ancora abbastanza il problema.

Nel Capitolo 2 torneremo indietro rispetto al codice e costruiremo una foundation minima:

- problema;
- utenti;
- outcome;
- scope;
- vincoli;
- requisiti;
- acceptance criteria;
- prima analisi funzionale condivisa.

Poi lasceremo che l'architettura emerga dalle informazioni che abbiamo, non dall'architettura che vorremmo mostrare.

Per ora Order Operations ci serve a fissare un principio:

> **una demo può iniziare il processo di comprensione. Non deve necessariamente concludere il processo di progettazione.**