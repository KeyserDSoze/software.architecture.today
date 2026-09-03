## Acme Orders — dal prototipo a una foundation esplicita

Applichiamo ora il metodo al caso simulato/composito che accompagnerà il libro.

Nel capitolo precedente Acme Orders era ancora un prodotto che cresceva per aggiunte successive.

Una richiesta generava una feature.

Una demo generava fiducia.

Un problema generava una patch.

Adesso fermiamo temporaneamente l'execution e scriviamo il primo **Problem & Outcome Brief**.

Non per ripartire da zero.

Per capire quali decisioni stiamo per affidare al sistema.

### Contesto

Acme Orders è una piattaforma SaaS B2B che permette a merchant di ricevere e gestire ordini.

La prima versione è semplice:

```text
Merchant user
    ↓
Web application
    ↓
Orders API
    ↓
Relational database
```

Alcune integrazioni esterne aggiornano poi pagamento e fulfillment.

Il prodotto funziona abbastanza bene da avere utenti reali nel nostro scenario didattico.

Il problema emerge quando qualcosa non segue l'happy path.

Alcuni ordini rimangono in stati che richiedono intervento umano.

Il team operations li scopre attraverso combinazioni di:

- segnalazioni dei clienti;
- ricerche manuali;
- log tecnici;
- messaggi interni;
- conoscenza informale del sistema.

La risposta spontanea è:

> “Costruiamo una dashboard degli ordini problematici.”

Prima del codice, riscriviamo la richiesta.

---

## Problem & Outcome Brief — Order Operations v1

### Problem

Il team operations non dispone di una vista affidabile e condivisa degli ordini che richiedono intervento manuale.

Gli errori vengono individuati attraverso strumenti diversi e spesso soltanto dopo una segnalazione esterna.

Questo aumenta il tempo di identificazione, crea lavoro duplicato e rende difficile capire quali casi siano già in gestione.

### Desired outcome

Gli operatori devono poter individuare e prendere in carico gli ordini con errori operativi noti senza consultare direttamente log tecnici o attendere una segnalazione del cliente.

Prima dell'estensione del rollout verranno misurati:

- tempo tra ingresso in uno stato problematico noto e prima presa in carico;
- percentuale di casi identificati internamente prima della segnalazione cliente;
- numero di casi presi in carico contemporaneamente da più operatori.

Non fissiamo ancora target numerici che non abbiamo una baseline sufficiente per giustificare.

### Users / actors

**Operations operator**

Visualizza i casi, apre il dettaglio e prende in carico un ordine.

**Operations lead**

Ha la stessa visibilità e può osservare distribuzione e anzianità dei casi.

**Merchant user**

Non utilizza questa capability nella prima iterazione, ma può essere indirettamente influenzato dalla velocità di risoluzione.

**Orders system**

Rimane source of truth dello stato commerciale dell'ordine.

### In scope

- identificare ordini che si trovano in un insieme iniziale di stati problematici già noti;
- mostrare identificativo, merchant, stato, causa operativa e tempo trascorso;
- filtrare e ordinare la coda operativa;
- aprire il dettaglio esistente dell'ordine;
- permettere a un operatore autorizzato di prendere in carico il caso;
- rendere visibile l'assegnatario corrente;
- registrare i cambi di assegnazione.

### Out of scope

- correzione automatica degli errori;
- modifica automatica dello stato commerciale;
- rimborso o operazioni sul pagamento;
- nuovo motore general-purpose di workflow;
- comunicazione automatica al cliente;
- machine learning per prevedere failure future;
- nuova applicazione mobile;
- sostituzione del sistema di logging;
- redesign generale della piattaforma operations.

### Constraints

**Hard / trattati come hard nel perimetro corrente**

- isolamento tenant invariato;
- gli operatori vedono soltanto tenant per cui sono autorizzati;
- il sistema ordini rimane source of truth dello stato dell'ordine;
- nessun dettaglio tecnico sensibile deve essere esposto al browser;
- i cambi di assegnazione devono essere auditabili.

**Soft**

- preferire l'infrastruttura e il database esistenti nella prima iterazione;
- evitare nuovi componenti operativi condivisi salvo beneficio dimostrabile;
- rilasciare inizialmente a un gruppo limitato di operatori;
- mantenere il cambiamento reversibile tramite feature flag o meccanismo equivalente.

### Functional behaviors

1. Un operatore autorizzato può vedere la coda degli ordini classificati come bisognosi di intervento.
2. La coda non include ordini di tenant non autorizzati.
3. Ogni elemento mostra la ragione operativa in una forma comprensibile all'operatore.
4. Un operatore può prendere in carico un ordine non assegnato.
5. Se un altro operatore lo ha già preso in carico, il sistema non sovrascrive silenziosamente l'assegnazione.
6. Il cambio di assegnatario viene registrato.
7. L'assegnazione operativa non modifica lo stato commerciale dell'ordine.

### Significant non-functional requirements

Per questa prima iterazione sono significativi:

**Security**

L'accesso deve rispettare gli stessi confini tenant della piattaforma esistente.

**Freshness**

La coda non deve essere necessariamente real-time al secondo. Un ritardo breve può essere accettabile; il target preciso verrà deciso dopo la baseline e la valutazione delle alternative.

**Operability**

Dobbiamo poter distinguere tra assenza reale di casi e fallimento del meccanismo che alimenta la coda.

**Reversibility**

Il rollout deve poter essere interrotto senza compromettere il flusso ordini principale.

### Assumptions

- gli stati problematici iniziali possono essere derivati da dati già presenti;
- il volume della coda è gestibile senza introdurre immediatamente una piattaforma di streaming dedicata;
- gli operatori utilizzano già l'identità aziendale necessaria;
- il dettaglio ordine esistente contiene abbastanza informazioni per la prima diagnosi;
- la presa in carico è una responsabilità operativa distinta dallo stato commerciale dell'ordine.

### Acceptance evidence

- test di isolamento tenant sulla coda e sul dettaglio;
- test concorrente sulla presa in carico;
- audit trail verificabile dei cambi di assegnazione;
- prova che l'assegnazione non modifica lo stato commerciale;
- telemetria che permetta di vedere errori nell'alimentazione della coda;
- sessione con un piccolo gruppo operations per verificare che la classificazione degli errori sia comprensibile;
- baseline iniziale sui tempi di individuazione e presa in carico.

### Open decisions

- query diretta, read model o altro meccanismo per costruire la coda;
- polling o aggiornamento push dell'interfaccia;
- modello di concorrenza sulla presa in carico;
- retention dell'audit trail;
- target di freshness;
- modalità con cui normalizzare le cause tecniche in categorie operative.

### Stop / escalation conditions

L'execution deve fermarsi e tornare a decisione se:

- costruire la coda richiede modificare semanticamente gli stati ordine esistenti;
- emerge la necessità di ampliare i permessi degli operatori;
- per classificare gli errori è necessario esporre dati sensibili non previsti;
- il volume reale rende impraticabile l'approccio scelto senza nuova infrastruttura;
- la soluzione richiede una migration distruttiva;
- due sistemi risultano entrambi autorevoli per lo stesso stato operativo;
- non è possibile produrre evidenza affidabile dell'isolamento tenant.

---

### Che cosa abbiamo ottenuto?

Non abbiamo ancora scelto l'architettura.

Ed è intenzionale.

Potremmo implementare questa capability con:

- query sul database esistente;
- read model dedicato;
- eventi;
- polling;
- notifiche push;
- una tabella di assegnazione separata;
- un campo sul modello esistente;
- altre varianti.

Alcune saranno migliori di altre.

Ma adesso abbiamo criteri con cui giudicarle.

Questo è il passaggio essenziale.

Prima avevamo una soluzione nominale:

> “dashboard degli ordini problematici”.

Ora abbiamo un problema, un outcome, un confine e una serie di invarianti.

La soluzione può finalmente essere discussa.

### Il brief scopre domande architetturali

Notiamo anche un effetto importante.

Il Problem & Outcome Brief non contiene l'architettura, ma genera domande architetturali.

Per esempio:

- chi è autorevole per determinare che un ordine richiede intervento?
- la classificazione è derivata o persistita?
- come evitiamo race condition sull'assegnazione?
- l'audit è parte del dominio o una capacità trasversale?
- la coda operativa può leggere direttamente il modello transazionale?
- quale freshness serve davvero?
- quanto è importante isolare il failure domain della capability operations?

Queste domande sono migliori di:

> “Meglio Kafka o Service Bus?”

perché vengono prima della tecnologia.

### Non ottimizziamo ancora

Potremmo già progettare una soluzione sofisticata.

Non lo faremo.

Nei prossimi capitoli Acme Orders crescerà insieme alla nostra capacità di ragionare.

Questo è fondamentale per il capstone.

Non vogliamo mostrare l'architettura “giusta” fin dall'inizio.

Vogliamo mostrare come una soluzione diventa ragionevole o irragionevole quando cambia il contesto.

Per ora abbiamo ottenuto ciò che ci serviva:

> **un problema abbastanza chiaro da poter iniziare a prendere decisioni senza chiedere al codice di inventarlo per noi.**