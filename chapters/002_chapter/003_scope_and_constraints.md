## Scope e vincoli: decidere anche cosa non costruire

Un progetto diventa più comprensibile quando non descrive soltanto ciò che contiene.

Descrive anche ciò che **non** contiene.

Lo scope non è un elenco di feature.

È un confine decisionale.

Serve a impedire che ogni nuova idea, dipendenza o opportunità venga assorbita automaticamente nel lavoro in corso.

Con agenti capaci di produrre rapidamente codice, questo confine diventa ancora più importante.

Quando il costo marginale di “provare ad aggiungere anche questo” sembra basso, lo scope tende ad allargarsi senza una vera decisione.

### Scope creep a costo quasi zero

Immaginiamo un task iniziale:

> “Permetti al cliente di scaricare la ricevuta di un ordine.”

Durante l'implementazione emergono possibilità:

- inviarla anche via email;
- personalizzare il template;
- supportare più lingue;
- aggiungere un QR code;
- archiviare i PDF;
- creare una pagina amministrativa;
- permettere la rigenerazione;
- aggiungere firme digitali;
- esportare tutte le ricevute del mese.

Un agente può implementare alcune di queste estensioni in poco tempo.

Ma il costo di sviluppo non è l'unico costo.

Ogni capacità aggiunta può introdurre:

- superficie di test;
- dati da gestire;
- casi limite;
- autorizzazioni;
- dipendenze;
- storage;
- compatibilità futura;
- documentazione;
- supporto operativo;
- responsabilità legali o fiscali.

Il fatto che il codice sia economico non rende economica la capacità nel suo ciclo di vita.

> **Una feature costa anche dopo che è stata scritta.**

### In scope / out of scope

Per molte iniziative basta una distinzione molto semplice.

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

L'out of scope non significa “mai”.

Significa:

> **non fa parte della decisione che stiamo prendendo adesso.**

Questa frase protegge il progetto da due errori opposti.

Il primo è l'espansione continua.

Il secondo è costruire un'architettura enormemente generalizzata per supportare ipotesi future non ancora richieste.

### YAGNI non significa non pensare al futuro

“You Aren't Gonna Need It” è spesso interpretato male.

Non significa ignorare l'evoluzione.

Significa evitare di pagare oggi il costo completo di capacità future puramente speculative.

Possiamo progettare un confine che lasci spazio al cambiamento senza implementare già tutte le varianti.

Per esempio, possiamo evitare di codificare il template della ricevuta in dieci punti diversi anche se oggi ne esiste uno solo.

Questo migliora l'evolvibilità.

Non significa costruire subito un motore di templating multi-tenant con plugin, marketplace e versioning.

La differenza è tra:

- **preservare una possibilità**;
- **implementare anticipatamente una possibilità**.

### I vincoli non sono fastidi

Un constraint viene spesso percepito come qualcosa che limita l'architettura ideale.

Budget.

Deadline.

Tecnologia esistente.

Regolamentazione.

Skill del team.

Contratti con fornitori.

Sistemi legacy.

Deployment target.

Residency dei dati.

Compatibilità.

In realtà un'architettura senza vincoli è quasi priva di significato.

La qualità di una decisione esiste sempre rispetto a un contesto.

Dire:

> “PostgreSQL è la scelta migliore.”

non è una decisione architetturale utile.

Dire:

> “Per questo workload transazionale, con un team che già opera PostgreSQL, requisiti di consistenza forte e scala prevista entro questi limiti, preferiamo PostgreSQL rispetto alle alternative considerate.”

è già una decisione contestualizzata.

I vincoli non sono rumore intorno alla soluzione.

Sono parte del problema.

### Hard constraint e soft constraint

Non tutti i vincoli hanno la stessa natura.

Possiamo distinguere almeno:

**Hard constraint** — non può essere violato nel perimetro corrente.

Esempi:

- una normativa;
- una API esterna che non supporta un certo comportamento;
- un deployment obbligatorio in una determinata regione;
- compatibilità con una versione minima;
- un limite contrattuale.

**Soft constraint** — può essere negoziato, ma ha un costo.

Esempi:

- preferire una tecnologia già nota al team;
- evitare una nuova piattaforma operativa;
- target di delivery;
- budget desiderato;
- standard interno modificabile.

Questa distinzione evita che una preferenza diventi accidentalmente una legge.

“Usiamo sempre .NET” può essere una convenzione utile.

Non è una legge della fisica.

“Il dato non può lasciare l'Unione Europea” può invece essere un vincolo non negoziabile per uno specifico sistema.

### Vincoli dichiarati e vincoli scoperti

Alcuni constraint sono noti all'inizio.

Altri emergono durante il lavoro.

Questo è normale.

La foundation non è un documento congelato.

È un modello del contesto che deve essere aggiornato quando impariamo qualcosa.

Il punto di controllo è:

> **Il nuovo vincolo invalida una decisione presa in precedenza?**

Se sì, non dobbiamo soltanto adattare il codice.

Dobbiamo rivalutare la decisione.

Un agente che scopre un hard constraint nuovo dovrebbe spesso fermarsi e segnalarlo invece di “far funzionare comunque” la soluzione.

### Acme Orders: restringere prima di espandere

Torniamo ad Acme Orders.

Immaginiamo che il team voglia “migliorare la gestione degli ordini problematici”.

La frase potrebbe esplodere rapidamente in:

- dashboard;
- workflow;
- alert;
- automazioni;
- chatbot;
- nuova coda operativa;
- nuove API;
- analytics;
- notifiche al cliente.

Prima di progettare, restringiamo.

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

Vincoli iniziali:

```text
- riutilizzare l'autenticazione esistente;
- nessuna nuova piattaforma infrastrutturale nella prima iterazione;
- nessuna esposizione di dettagli tecnici sensibili al browser;
- la feature deve poter essere disabilitata senza migration distruttive;
- il sistema ordini rimane source of truth dello stato dell'ordine.
```

Ora abbiamo meno possibilità.

Ed è una cosa positiva.

L'architettura può iniziare a diventare una decisione invece che un'esplorazione infinita.

### Il limite come strumento creativo

La parola “vincolo” ha una connotazione negativa.

Ma i vincoli spesso migliorano il design.

Se non possiamo introdurre nuova infrastruttura, siamo costretti a capire che cosa può fare bene quella esistente.

Se dobbiamo mantenere compatibilità, siamo costretti a progettare evoluzione e versioning.

Se abbiamo un budget stretto, dobbiamo distinguere ciò che produce valore da ciò che è soltanto sofisticato.

Se dobbiamo consegnare una prima versione in due settimane, dobbiamo identificare il percorso critico.

Un buon architect non cerca un mondo senza vincoli.

Cerca la soluzione più adatta **dentro** i vincoli reali, e sa riconoscere quando un vincolo deve essere contestato perché rende impossibile l'outcome.

### Domanda di controllo

Prima di iniziare una feature significativa, dovremmo riuscire a rispondere a due domande:

> **Che cosa stiamo deliberatamente non costruendo?**

E:

> **Quali vincoli, se cambiassero, potrebbero cambiare la nostra soluzione?**

Queste due risposte valgono spesso più di una lunga lista di requisiti.