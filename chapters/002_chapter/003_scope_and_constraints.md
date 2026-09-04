## Scope e vincoli: decidere anche cosa non costruire

Un progetto diventa più comprensibile quando non descrive soltanto ciò che contiene, ma anche ciò che **non** contiene. Lo scope non è un elenco di feature: è un confine decisionale che impedisce a ogni nuova idea, dipendenza o opportunità di essere assorbita automaticamente nel lavoro in corso.

Con agenti capaci di produrre rapidamente codice, questo confine diventa ancora più importante. Quando il costo marginale di “provare ad aggiungere anche questo” sembra basso, lo scope tende ad allargarsi senza una vera decisione.

### Scope creep a costo quasi zero

Immaginiamo un task semplice: permettere al cliente di scaricare la ricevuta di un ordine. Durante l’implementazione emergono rapidamente altre possibilità: inviarla anche via email, personalizzare il template, supportare più lingue, aggiungere un QR code, conservare i PDF, introdurre una pagina amministrativa, permettere rigenerazione, firma digitale o export massivo.

Un agente può implementare molte di queste estensioni in poco tempo, ma il costo di sviluppo non è l’unico costo. Ogni capacità aggiunta allarga la superficie di test e di autorizzazione, introduce dati, casi limite, dipendenze, storage, compatibilità futura, documentazione e supporto operativo. In alcuni domini porta con sé perfino responsabilità legali o fiscali.

Il fatto che il codice sia economico non rende economica la capacità nel suo ciclo di vita.

> **Una feature costa anche dopo che è stata scritta.**

### In scope / out of scope

Per molte iniziative basta una distinzione molto semplice, che qui ha senso mantenere strutturata perché è un artefatto operativo:

```text
In scope
- generare una ricevuta per un ordine completato;
- renderla scaricabile al proprietario dell'ordine;
- utilizzare i dati già presenti nel sistema.

Out of scope
- invio email automatico;
- personalizzazione del layout da parte dei merchant;
- archivio documentale separato;
- firma digitale;
- export massivo.
```

Out of scope non significa “mai”. Significa **non fa parte della decisione che stiamo prendendo adesso**. Questa distinzione protegge sia dallo scope creep sia dall’errore opposto: costruire un’architettura enormemente generalizzata per supportare possibilità future che nessuno ha ancora richiesto.

### YAGNI non significa non pensare al futuro

“You Aren’t Gonna Need It” viene spesso interpretato come un invito a ignorare l’evoluzione. È un fraintendimento. Il principio utile è evitare di pagare oggi il costo completo di capacità future puramente speculative.

Possiamo preservare una possibilità senza implementarla in anticipo. Evitare di codificare il template di una ricevuta in dieci punti diversi migliora l’evolvibilità anche se oggi esiste un solo formato. Non significa però costruire subito un motore di templating multi-tenant con plugin, marketplace e versioning.

La differenza è tra **preservare una possibilità** e **implementare anticipatamente una possibilità**.

### I vincoli non sono fastidi

Budget, deadline, tecnologie esistenti, regolamentazione, skill del team, contratti con fornitori, legacy, deployment target, data residency e compatibilità vengono spesso vissuti come ostacoli rispetto a una soluzione ideale. In realtà un’architettura senza vincoli è quasi priva di significato, perché la qualità di una decisione esiste sempre rispetto a un contesto.

Dire “PostgreSQL è la scelta migliore” non è una decisione architetturale utile. Dire che, per un determinato workload transazionale, con un team che già opera PostgreSQL, requisiti di consistenza forte e una scala prevista entro certi limiti, lo preferiamo alle alternative considerate è una decisione contestualizzata.

I vincoli non sono rumore intorno alla soluzione. Sono parte del problema.

### Hard constraint e soft constraint

Non tutti i vincoli hanno la stessa natura. Un **hard constraint** non può essere violato nel perimetro corrente: una normativa, un limite contrattuale, una regione obbligatoria o una compatibilità minima possono rientrare in questa categoria. Un **soft constraint** può invece essere negoziato, ma la negoziazione ha un costo: preferire una tecnologia già nota al team, evitare una nuova piattaforma operativa o puntare a una certa data di delivery sono esempi tipici.

La distinzione evita che una preferenza diventi accidentalmente una legge. “Usiamo sempre.NET” può essere una convenzione organizzativa utile; “il dato non può lasciare l’Unione Europea” può invece essere un vincolo non negoziabile per uno specifico sistema.

### Vincoli dichiarati e vincoli scoperti

Alcuni constraint sono noti all’inizio, altri emergono durante il lavoro. È normale: la foundation non è un documento congelato, ma un modello del contesto che deve essere aggiornato quando impariamo qualcosa.

La domanda importante è se il nuovo vincolo invalidi una decisione precedente. Se la risposta è sì, non basta adattare il codice: bisogna rivalutare la decisione. Un agente che scopre un nuovo hard constraint dovrebbe spesso fermarsi e segnalarlo invece di “far funzionare comunque” la soluzione.

### Order Operations: restringere prima di espandere

Torniamo a Order Operations. La frase “migliorare la gestione degli ordini problematici” potrebbe espandersi rapidamente in dashboard, workflow, alert, automazioni, chatbot, nuove API, analytics e comunicazioni al cliente. Prima di progettare restringiamo il perimetro.

```text
In scope della prima iterazione
- rendere visibili agli operatori gli ordini in stati di errore già riconosciuti;
- mostrare la causa tecnica in forma comprensibile;
- permettere di aprire il dettaglio dell'ordine;
- registrare quando l'operatore prende in carico il caso.

Out of scope
- risoluzione automatica degli errori;
- nuovo motore di workflow;
- comunicazione automatica al cliente;
- previsione degli ordini che potrebbero fallire;
- modifica dei processi di pagamento o fulfillment.
```

Anche i vincoli iniziali meritano una forma leggibile e riutilizzabile: riutilizzare l’autenticazione esistente, non introdurre una nuova piattaforma infrastrutturale nella prima iterazione, non esporre dettagli tecnici sensibili al browser, mantenere la feature disattivabile senza migration distruttive e conservare il sistema ordini come source of truth dello stato commerciale.

Ora abbiamo meno possibilità. Ed è una cosa positiva: l’architettura può iniziare a diventare una decisione invece che un’esplorazione infinita.

### Il limite come strumento creativo

I vincoli spesso migliorano il design. Se non possiamo introdurre nuova infrastruttura siamo costretti a capire meglio quella esistente; se dobbiamo mantenere compatibilità dobbiamo progettare evoluzione e versioning; se il budget è stretto dobbiamo distinguere valore e sofisticazione; se abbiamo due settimane dobbiamo riconoscere il percorso critico.

Un buon architect non cerca un mondo senza vincoli. Cerca la soluzione più adatta **dentro** i vincoli reali e sa riconoscere quando un vincolo deve essere contestato perché rende impossibile l’outcome.

### Domanda di controllo

Prima di iniziare una feature significativa dovremmo saper rispondere a due domande: **che cosa stiamo deliberatamente non costruendo?** E **quali vincoli, se cambiassero, potrebbero cambiare la nostra soluzione?**

Queste due risposte valgono spesso più di una lunga lista di desideri.
