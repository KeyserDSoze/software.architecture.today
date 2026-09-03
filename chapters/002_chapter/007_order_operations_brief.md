## Order Operations — dal prototipo a una foundation esplicita

Applichiamo ora il metodo al caso simulato/composito che accompagnerà il libro.

Nel capitolo precedente Order Operations era ancora un prodotto che cresceva per aggiunte successive.

Una richiesta generava una feature.

Una demo generava fiducia.

Un problema generava una patch.

Adesso fermiamo temporaneamente l'execution e scriviamo il primo **Problem & Outcome Brief**.

Non per ripartire da zero.

Per capire quali decisioni stiamo per affidare al sistema.

### Contesto ESI

Order Operations appartiene alla business unit **Commerce & Operations** di Example Software Industries S.p.A.

ESI possiede già sistemi e capability che gestiscono:

- lifecycle degli ordini;
- pagamenti;
- fulfillment/spedizione;
- identity aziendale;
- logging e observability condivisi.

Order Operations non nasce per sostituirli.

Nasce perché alcuni ordini rimangono in condizioni che richiedono intervento umano e il team Operations li scopre attraverso combinazioni di:

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

Il team Operations non dispone di una vista affidabile e condivisa degli ordini che richiedono attenzione operativa.

Gli errori vengono individuati attraverso strumenti diversi e spesso soltanto dopo una segnalazione esterna.

Questo aumenta il tempo di identificazione, crea lavoro duplicato e rende difficile capire quali casi siano già in gestione.

### Desired outcome

Gli operatori devono poter individuare e comprendere gli ordini con problemi operativi noti senza consultare direttamente log tecnici o attendere una segnalazione del cliente.

Prima dell'estensione del rollout verranno misurati:

- tempo tra ingresso in una condizione problematica nota e prima investigazione;
- percentuale di casi identificati internamente prima della segnalazione cliente;
- numero di casi investigati contemporaneamente da più operatori senza coordinamento.

Non fissiamo ancora target numerici che non abbiamo una baseline sufficiente per giustificare.

### Users / actors

**Operations operator**

Visualizza i casi, apre il dettaglio e decide se intervenire, attendere o escalare.

**Operations lead**

Ha la stessa visibilità e può osservare distribuzione e anzianità dei casi.

**Customer**

Non utilizza questa capability nella prima iterazione, ma subisce indirettamente le conseguenze della velocità e correttezza di risoluzione.

**Orders domain**

Rimane source of truth dello stato commerciale dell'ordine.

**Payments & Risk**

È stakeholder interno quando la capability tocca semantica di pagamento, retry, refund, audit o rischio economico.

**Platform Engineering**

Fornisce capability comuni ma non possiede il significato funzionale di Order Operations.

### In scope

- identificare ordini che soddisfano un insieme iniziale di condizioni problematiche note;
- mostrare identificativo, stato ordine, stato pagamento, stato spedizione, causa operativa e ultimo aggiornamento rilevante;
- filtrare e ordinare la coda operativa;
- aprire il dettaglio dell'ordine;
- distinguere la fonte autorevole dei dati mostrati;
- rendere il prodotto disponibile a un gruppo limitato di operatori interni.

### Out of scope

- correzione automatica degli errori;
- modifica automatica dello stato commerciale;
- refund o operazioni sul pagamento;
- retry automatico verso payment provider;
- nuovo motore general-purpose di workflow;
- comunicazione automatica al cliente;
- machine learning per prevedere failure future;
- nuova applicazione mobile;
- sostituzione della piattaforma di observability;
- redesign generale dei sistemi Commerce.

### Constraints

**Hard / trattati come hard nel perimetro corrente**

- accesso riservato ad attori autorizzati;
- Orders rimane source of truth dello stato commerciale dell'ordine;
- Payment e Shipment mantengono semantica distinta dall'ordine;
- nessun dettaglio tecnico sensibile deve essere esposto al browser;
- una classificazione operativa derivata non deve trasformarsi accidentalmente in nuovo source of truth;
- operazioni economiche future devono rispettare ownership e policy di Payments & Risk.

**Soft**

- preferire infrastruttura e database già operabili dal team nella prima iterazione;
- evitare nuovi componenti condivisi salvo beneficio dimostrabile;
- rilasciare inizialmente a un gruppo limitato di operatori;
- mantenere il cambiamento reversibile tramite feature flag o meccanismo equivalente.

### Functional behaviors

1. Un operatore autorizzato può vedere la coda degli ordini classificati come bisognosi di attenzione.
2. Ogni elemento mostra la ragione operativa in una forma comprensibile.
3. Stato ordine, pagamento e spedizione rimangono distinguibili.
4. L'operatore può aprire il dettaglio e capire quale dato è autorevole e quale è derivato.
5. Un problema tecnico interno non diventa automaticamente una categoria business mostrata all'operatore.
6. Order Operations non modifica lo stato commerciale dell'ordine nella prima iterazione.
7. Una dipendenza indisponibile deve produrre uno stato comprensibile e osservabile, non dati silenziosamente inventati.

### Significant non-functional requirements

Per questa prima iterazione sono significativi:

**Security**

L'accesso deve rispettare le policy di identity e authorization applicabili agli operatori interni.

**Freshness**

La coda non deve essere necessariamente real-time al secondo. Un ritardo breve può essere accettabile; il target preciso verrà deciso dopo baseline e valutazione delle alternative.

**Operability**

Dobbiamo poter distinguere tra assenza reale di casi e fallimento del meccanismo che alimenta o interroga la vista.

**Reversibility**

Il rollout deve poter essere interrotto senza compromettere il flusso ordini principale.

### Assumptions

- le condizioni problematiche iniziali possono essere derivate da dati già presenti;
- il volume della coda è gestibile senza introdurre immediatamente una piattaforma di streaming dedicata;
- gli operatori utilizzano già l'identità aziendale necessaria;
- il dettaglio ordine contiene abbastanza informazioni per la prima diagnosi;
- la classificazione operativa è distinta dallo stato commerciale dell'ordine.

### Acceptance evidence

- test di authorization sulla coda e sul dettaglio;
- test sulle principali combinazioni di stato Order/Payment/Shipment;
- prova che Order Operations non modifica lo stato commerciale;
- telemetria che permetta di vedere errori nelle dipendenze;
- verifica della tracciabilità verso i dati autorevoli;
- sessione con un piccolo gruppo Operations per verificare che le categorie siano comprensibili;
- baseline iniziale sui tempi di individuazione e investigazione.

### Open decisions

- query diretta, read model o altro meccanismo per costruire la coda;
- polling o aggiornamento push dell'interfaccia;
- retention di eventuali audit futuri;
- target di freshness;
- modalità con cui normalizzare le cause tecniche in categorie operative;
- semantica delle future azioni correttive;
- ownership fra Commerce & Operations e Payments & Risk per retry/refund.

### Stop / escalation conditions

L'execution deve fermarsi e tornare a decisione se:

- costruire la coda richiede modificare semanticamente gli stati ordine esistenti;
- emerge la necessità di ampliare i permessi degli operatori;
- per classificare gli errori è necessario esporre dati sensibili non previsti;
- il volume reale rende impraticabile l'approccio scelto senza nuova infrastruttura;
- la soluzione richiede una migration distruttiva;
- due sistemi risultano entrambi autorevoli per lo stesso significato;
- una futura action API richiede decisioni economiche o di rischio non ancora condivise con Payments & Risk.

---

### Il compromesso del capitolo

**Esigenza**

Product e Operations vogliono iniziare a ridurre il tempo perso sui casi problematici.

**Tensione**

Completezza dell'analisi contro velocità di apprendimento.

**Decisione**

Definiamo abbastanza foundation per rendere sicura la prossima iterazione, ma lasciamo aperte le decisioni che non servono ancora.

**Costo accettato**

Il brief non descrive tutte le remediation, tutti gli SLA e tutti i workflow futuri.

**Quality floor**

Non lasciamo invece aperta la semantica delle proprietà che possono produrre errori gravi: ownership, authorization, source of truth e separazione degli stati.

**Guardrail**

Open decision e stop condition impediscono all'implementazione o a un agente di riempire automaticamente le parti non decise.

La differenza è importante.

Non stiamo dicendo:

> “Non sappiamo, quindi improvvisiamo.”

Stiamo dicendo:

> “Non serve decidere tutto ora, ma sappiamo quali decisioni non siamo autorizzati a inventare.”

### Che cosa abbiamo ottenuto?

Non abbiamo ancora scelto l'architettura.

Ed è intenzionale.

Potremmo implementare questa capability con:

- query sul database esistente;
- read model dedicato;
- eventi;
- polling;
- notifiche push;
- altre varianti.

Alcune saranno migliori di altre.

Ma adesso abbiamo criteri con cui giudicarle.

Prima avevamo una soluzione nominale:

> “dashboard degli ordini problematici”.

Ora abbiamo un problema, un outcome, un confine e una serie di invarianti.

La soluzione può finalmente essere discussa.

### Il brief scopre domande architetturali

Il Problem & Outcome Brief non contiene l'architettura, ma genera domande architetturali.

Per esempio:

- chi è autorevole per determinare che un ordine richiede attenzione?
- la classificazione è derivata o persistita?
- la coda operativa può leggere direttamente il modello transazionale?
- quale freshness serve davvero?
- quanto è importante isolare il failure domain della capability operations?
- quali decisioni attraversano più business unit ESI?

Queste domande sono migliori di:

> “Meglio Kafka o Service Bus?”

perché vengono prima della tecnologia.

### Non ottimizziamo ancora

Potremmo già progettare una soluzione sofisticata.

Non lo faremo.

Nei prossimi capitoli Order Operations crescerà insieme alla nostra capacità di ragionare.

Non vogliamo mostrare l'architettura “giusta” fin dall'inizio.

Vogliamo mostrare come una soluzione diventa ragionevole o irragionevole quando cambia il contesto.

Per ora abbiamo ottenuto ciò che ci serviva:

> **un problema abbastanza chiaro da poter iniziare a prendere decisioni senza chiedere al codice di inventarlo per noi.**