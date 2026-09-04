## Delegare l'execution, non la responsabilità

La delega è uno dei moltiplicatori più potenti introdotti dall'AI ed è anche uno dei punti in cui possiamo perdere più facilmente il controllo senza accorgercene. Il problema nasce quando confondiamo il delegare un'attività con il delegare anche il giudizio che rende quell'attività accettabile. La prima forma di delega è spesso desiderabile; la seconda richiede molta più cautela.

### Il test della responsabilità

Usiamo un criterio semplice. Se, davanti a un errore importante, la nostra spiegazione è:

> “Lo ha scritto l'AI.”

abbiamo probabilmente delegato troppo. Quella frase può descrivere chi ha materialmente prodotto il codice, ma non spiega perché quel codice sia stato richiesto, quale comportamento dovesse implementare e quali vincoli dovesse rispettare. Non dice quali rischi conoscevamo, quali controlli avevamo previsto né perché, alla fine, abbiamo ritenuto il risultato accettabile.

L'accountability comincia quando siamo in grado di ricostruire queste risposte. Non richiede di ricordare ogni riga generata; richiede di sapere perché il sistema esiste nella forma in cui lo stiamo consegnando.

### Execution e decisione non sono la stessa cosa

Consideriamo una migration. Possiamo delegare a un agente la scrittura dello script, la preparazione dei test, una prima rollback procedure, il controllo delle dipendenze e persino una stima iniziale del blast radius. Restano però decisioni che non si esauriscono nell'esecuzione: possiamo permetterci un lock sulla tabella o del downtime? La backward compatibility è necessaria? Esiste davvero una finestra di rollback? Quanta perdita di dati sarebbe accettabile? Il rischio giustifica una strategia più lenta ma più reversibile?

Un agente può aiutarci a ragionare su queste domande e può perfino produrre alternative migliori delle nostre prime idee. Ma se la decisione ha conseguenze importanti, il punto non è sapere chi ha proposto la soluzione: è sapere **chi l'ha accettata e sulla base di quali criteri**.

### La firma invisibile

Ogni volta che approviamo una modifica stiamo apponendo una firma invisibile. Non significa “Garantisco che questo codice sia perfetto”, perché una garanzia del genere non è realistica nemmeno per codice scritto interamente a mano. Significa qualcosa di più utile:

> “Per il rischio che questa modifica introduce, ritengo adeguati il livello di comprensione, i controlli e l'evidenza disponibili.”

Questa è una definizione professionale di approvazione e rende evidente perché non tutti i cambiamenti richiedano lo stesso livello di review. Una correzione di una stringa di testo e una migration distruttiva non meritano lo stesso processo; allo stesso modo, un endpoint interno senza dati sensibili e una modifica al modello di autorizzazione non meritano la stessa autonomia. La responsabilità deve essere proporzionata al rischio.

### Il pericolo dell'approvazione cosmetica

L'AI può produrre diff molto grandi e molto convincenti. Questo crea un nuovo anti-pattern: la **review cosmetica**. Succede quando ci fermiamo ai nomi dei file, alla formattazione, ai test verdi, ai commenti plausibili e a una struttura apparentemente ordinata, e da questi segnali concludiamo che la modifica sia corretta.

Un diff può però essere elegante e sbagliato, oppure corretto localmente e pericoloso globalmente. Può rispettare i test esistenti e violare un requisito che nessuno ha trasformato in test; può introdurre una nuova dipendenza, un comportamento di retry, un problema di concorrenza o una modifica di ownership che non emerge a colpo d'occhio. L'obiettivo della review non è controllare che il codice sembri professionale: è raccogliere abbastanza evidenza per sostenere una decisione.

### Non tutto deve essere capito allo stesso livello

Qui serve evitare l'estremo opposto. Se delegare non significa abdicare alla responsabilità, non significa nemmeno dover ricostruire mentalmente ogni istruzione eseguita dalla macchina. Un architect che usa un database non conosce l'implementazione di ogni pagina del suo storage engine e un developer che usa TLS non ricalcola ogni operazione crittografica. L'ingegneria funziona attraverso livelli di astrazione e contratti, e con l'AI dobbiamo fare la stessa cosa.

La domanda non è “Ho compreso ogni dettaglio?”, ma:

> **“Ho compreso i dettagli che possono cambiare la decisione o aumentare materialmente il rischio?”**

Per una funzione pura di trasformazione dati questo livello può essere relativamente basso. Per un componente che gestisce soldi, identità, autorizzazioni o cancellazioni irreversibili deve essere molto più alto.

### Responsibility boundary

Possiamo pensare ogni delega come un contratto con un confine di responsabilità. Dentro il confine l'agente può prendere decisioni locali; fuori dal confine deve fermarsi, proporre alternative o chiedere escalation. Qui una lista è utile perché rappresenta una policy che il lettore potrebbe riusare direttamente:

```text
Puoi:
- modificare l'implementazione interna del servizio;
- aggiungere test;
- rifattorizzare funzioni private;
- riusare dipendenze già approvate.

Non puoi senza escalation:
- cambiare il contratto pubblico;
- modificare lo schema dati;
- aggiungere una nuova dipendenza runtime;
- cambiare autenticazione o autorizzazione;
- introdurre infrastruttura condivisa;
- rimuovere controlli esistenti.
```

Questa distinzione rende l'autonomia utile invece che vaga. L'agente non deve indovinare quali decisioni siano importanti: glielo diciamo prima.

### La responsabilità non è un collo di bottiglia da eliminare

Quando un team comincia a usare agenti, può emergere una frustrazione legittima: l'AI produce più velocemente di quanto gli esseri umani riescano a revisionare. La tentazione è concludere che il problema sia la review umana. A volte lo è, ma la soluzione non può essere semplicemente rimuoverla.

Dobbiamo piuttosto spostare il controllo dove è più efficace. Una parte del lavoro avviene prima dell'execution, con specifiche migliori; una parte diventa automatica attraverso test, contratti, policy di repository, fitness function, static analysis e security scanning. Un'altra parte vive nel runtime, con canary e osservabilità, mentre review indipendente ed escalation umana possono concentrarsi sui cambiamenti con rischio realmente alto. L'obiettivo è evitare che ogni aumento di capacità di execution richieda un aumento lineare del controllo manuale.

### Dall'autore al responsabile del sistema di produzione

Per anni abbiamo associato fortemente la responsabilità tecnica all'autorialità: hai scritto il codice, quindi ne sei responsabile. Con gli agenti questa equivalenza si indebolisce. Potremo essere responsabili di molto codice che non abbiamo materialmente scritto, cosa che in parte accade già con librerie, framework, generatori, compiler e codice prodotto da altri membri del team. La differenza è la scala.

L'AI rende possibile aumentare enormemente la quantità di software prodotta sotto la supervisione di una singola persona. Per questo dobbiamo spostare il concetto di ownership. Non più soltanto “Questo codice è mio perché l'ho scritto”, ma:

> **“Questo cambiamento è mio perché ho definito il problema, accettato i trade-off, scelto i controlli e deciso che era pronto.”**

È una responsabilità meno romantica dell'autore solitario, ed è molto più vicina al lavoro reale di un software architect.
