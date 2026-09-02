## Delegare l'execution, non la responsabilità

La delega è uno dei moltiplicatori più potenti introdotti dall'AI.

È anche uno dei punti in cui possiamo perdere più facilmente il controllo senza accorgercene.

Il problema nasce quando confondiamo due cose diverse:

- delegare un'attività;
- delegare il giudizio che rende quell'attività accettabile.

La prima è spesso desiderabile.

La seconda richiede molta più cautela.

### Il test della responsabilità

Usiamo un criterio semplice.

Se, davanti a un errore importante, la nostra spiegazione è:

> “Lo ha scritto l'AI.”

abbiamo probabilmente delegato troppo.

Quella frase può descrivere chi ha materialmente prodotto il codice.

Non spiega però:

- perché quel codice è stato richiesto;
- quale comportamento doveva implementare;
- quali vincoli doveva rispettare;
- quali rischi erano noti;
- quali controlli erano previsti;
- perché abbiamo ritenuto il risultato accettabile.

L'accountability comincia quando siamo in grado di rispondere a queste domande.

Non richiede di ricordare ogni riga generata.

Richiede di sapere perché il sistema esiste nella forma in cui lo stiamo consegnando.

### Execution e decisione non sono la stessa cosa

Consideriamo una migration.

Possiamo delegare a un agente:

- la scrittura dello script;
- la preparazione dei test;
- la generazione della rollback procedure;
- il controllo delle dipendenze;
- la produzione di una prima stima del blast radius.

Ma alcune decisioni restano nostre:

- possiamo permetterci un lock sulla tabella?
- il deployment può richiedere downtime?
- la backward compatibility è necessaria?
- abbiamo una finestra di rollback reale?
- quale quantità di perdita dati sarebbe accettabile?
- il rischio giustifica una strategia più lenta ma reversibile?

Un agente può aiutarci a ragionare su queste domande.

Può perfino produrre alternative migliori delle nostre prime idee.

Ma se la decisione ha conseguenze importanti, il punto non è sapere chi ha proposto la soluzione.

Il punto è sapere **chi l'ha accettata e sulla base di quali criteri**.

### La firma invisibile

Ogni volta che approviamo una modifica stiamo apponendo una firma invisibile.

Non significa:

> “Garantisco che questo codice sia perfetto.”

Una garanzia del genere non è realistica nemmeno per codice scritto interamente a mano.

Significa qualcosa di più utile:

> “Per il rischio che questa modifica introduce, ritengo adeguati il livello di comprensione, i controlli e l'evidenza disponibili.”

Questa è una definizione professionale di approvazione.

E rende evidente perché non tutti i cambiamenti richiedono lo stesso livello di review.

Una correzione di una stringa di testo e una migration distruttiva non meritano lo stesso processo.

Un endpoint interno senza dati sensibili e una modifica al modello di autorizzazione non meritano la stessa autonomia.

La responsabilità deve essere proporzionata al rischio.

### Il pericolo dell'approvazione cosmetica

L'AI può produrre diff molto grandi e molto convincenti.

Questo crea un nuovo anti-pattern: la **review cosmetica**.

Succede quando guardiamo:

- nomi dei file;
- formattazione;
- test verdi;
- commenti plausibili;
- struttura apparentemente ordinata;

e concludiamo che la modifica sia corretta.

Ma un diff può essere elegante e sbagliato.

Può essere corretto localmente e pericoloso globalmente.

Può rispettare i test esistenti e violare un requisito che nessuno ha trasformato in test.

Può introdurre una nuova dipendenza, un comportamento di retry, un problema di concorrenza o una modifica di ownership che non emerge a colpo d'occhio.

L'obiettivo della review non è controllare che il codice sembri professionale.

È raccogliere abbastanza evidenza per sostenere una decisione.

### Non tutto deve essere capito allo stesso livello

Qui serve evitare l'estremo opposto.

Se delegare non significa abdicare alla responsabilità, non significa nemmeno dover ricostruire mentalmente ogni istruzione eseguita dalla macchina.

Un architect che usa un database non conosce l'implementazione di ogni pagina del suo storage engine.

Un developer che usa TLS non ricalcola ogni operazione crittografica.

L'ingegneria funziona attraverso livelli di astrazione e contratti.

Con l'AI dobbiamo fare la stessa cosa.

La domanda non è:

> “Ho compreso ogni dettaglio?”

La domanda è:

> **“Ho compreso i dettagli che possono cambiare la decisione o aumentare materialmente il rischio?”**

Per una funzione pura di trasformazione dati questo livello può essere relativamente basso.

Per un componente che gestisce soldi, identità, autorizzazioni o cancellazioni irreversibili deve essere molto più alto.

### Responsibility boundary

Possiamo pensare ogni delega come un contratto con un confine di responsabilità.

Dentro il confine l'agente può prendere decisioni locali.

Fuori dal confine deve fermarsi, proporre alternative o chiedere escalation.

Per esempio:

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

Questa distinzione rende l'autonomia utile invece che vaga.

L'agente non deve indovinare quali decisioni siano importanti.

Glielo diciamo prima.

### La responsabilità non è un collo di bottiglia da eliminare

Quando un team comincia a usare agenti, può emergere una frustrazione legittima.

L'AI produce più velocemente di quanto gli esseri umani riescano a revisionare.

La tentazione è concludere che il problema sia la review umana.

A volte lo è.

Ma la soluzione non può essere semplicemente rimuoverla.

Dobbiamo piuttosto spostare il controllo dove è più efficace:

- specifiche migliori prima dell'execution;
- test e contratti automatici;
- policy di repository;
- architecture fitness functions;
- static analysis;
- security scanning;
- canary deployment;
- osservabilità;
- reviewer indipendenti;
- escalation solo sui cambiamenti ad alto rischio.

L'obiettivo è evitare che ogni aumento di capacità di execution richieda un aumento lineare del controllo manuale.

### Dall'autore al responsabile del sistema di produzione

Per anni abbiamo associato fortemente la responsabilità tecnica all'autorialità.

Hai scritto il codice, quindi ne sei responsabile.

Con gli agenti questa equivalenza si indebolisce.

Potremo essere responsabili di molto codice che non abbiamo materialmente scritto.

Non è una novità assoluta: succede già con librerie, framework, generatori, compiler e codice prodotto da altri membri del team.

La differenza è la scala.

L'AI rende possibile aumentare enormemente la quantità di software prodotta sotto la supervisione di una singola persona.

Per questo dobbiamo spostare il concetto di ownership.

Non più soltanto:

> “Questo codice è mio perché l'ho scritto.”

Ma:

> **“Questo cambiamento è mio perché ho definito il problema, accettato i trade-off, scelto i controlli e deciso che era pronto.”**

È una responsabilità meno romantica dell'autore solitario.

Ed è molto più vicina al lavoro reale di un software architect.