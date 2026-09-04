## Order Operations — dal prototipo a una foundation esplicita

Applichiamo ora il metodo al caso simulato/composito che accompagnerà il libro.

Nel capitolo precedente Order Operations cresceva per aggiunte successive: una richiesta produceva una feature, una demo aumentava la fiducia e un problema locale produceva una nuova patch. Adesso fermiamo temporaneamente l’execution e scriviamo il primo **Problem & Outcome Brief**.

Non per ripartire da zero, ma per capire quali decisioni stiamo per affidare al sistema.

### Contesto ESI

Order Operations appartiene alla business unit **Commerce & Operations** di Example Software Industries S.p.A. ESI possiede già sistemi e capability per il lifecycle degli ordini, i pagamenti e il fulfillment, oltre a identity aziendale, logging e observability condivisi. Order Operations non nasce per sostituirli.

Nasce perché alcuni ordini rimangono in condizioni che richiedono intervento umano e il team Operations li scopre combinando segnalazioni dei clienti, ricerche manuali, log tecnici, messaggi interni e conoscenza informale del sistema. La risposta spontanea è “costruiamo una dashboard degli ordini problematici”. Prima del codice, riscriviamo la richiesta.

---

## Problem & Outcome Brief — Order Operations v1

Questa parte resta deliberatamente strutturata: è l’artefatto che Product, Engineering e agenti devono poter consultare e aggiornare.

### Problem

Il team Operations non dispone di una vista affidabile e condivisa degli ordini che richiedono attenzione operativa. Gli errori vengono individuati attraverso strumenti diversi e spesso soltanto dopo una segnalazione esterna. Questo aumenta il tempo di identificazione, crea lavoro duplicato e rende difficile capire quali casi siano già in gestione.

### Desired outcome

Gli operatori devono poter individuare e comprendere gli ordini con problemi operativi noti senza consultare direttamente log tecnici o attendere una segnalazione del cliente.

Prima di estendere il rollout misureremo il tempo tra ingresso in una condizione problematica nota e prima investigazione, la percentuale di casi identificati internamente prima della segnalazione cliente e il numero di casi investigati contemporaneamente da più operatori senza coordinamento. Non fissiamo ancora target numerici che una baseline insufficiente non ci permetterebbe di giustificare.

### Users / actors

- **Operations operator** — visualizza i casi, apre il dettaglio e decide se intervenire, attendere o escalare.
- **Operations lead** — ha la stessa visibilità e osserva distribuzione e anzianità dei casi.
- **Customer** — non utilizza la capability nella prima iterazione, ma subisce indirettamente le conseguenze della velocità e correttezza di risoluzione.
- **Orders domain** — rimane source of truth dello stato commerciale dell’ordine.
- **Payments & Risk** — è stakeholder quando la capability tocca semantica di pagamento, retry, refund, audit o rischio economico.
- **Platform Engineering** — fornisce capability comuni ma non possiede il significato funzionale di Order Operations.

### In scope

- identificare ordini che soddisfano un insieme iniziale di condizioni problematiche note;
- mostrare identificativo, stato ordine, stato pagamento, stato spedizione, causa operativa e ultimo aggiornamento rilevante;
- filtrare e ordinare la coda operativa;
- aprire il dettaglio dell’ordine;
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

Nel perimetro corrente trattiamo come hard constraint l’accesso riservato agli attori autorizzati, la permanenza di Orders come source of truth dello stato commerciale, la separazione semantica tra Order, Payment e Shipment e il divieto di esporre dettagli tecnici sensibili al browser. Una classificazione operativa derivata non deve trasformarsi accidentalmente in una nuova source of truth e qualsiasi futura operazione economica dovrà rispettare ownership e policy di Payments & Risk.

Come constraint più negoziabili preferiamo invece infrastruttura e database già operabili dal team, evitiamo nuovi componenti condivisi senza un beneficio dimostrabile, limitiamo il primo rollout a un gruppo di operatori e manteniamo il cambiamento reversibile tramite feature flag o meccanismo equivalente.

### Functional behaviors

1. Un operatore autorizzato può vedere la coda degli ordini classificati come bisognosi di attenzione.
2. Ogni elemento espone la ragione operativa in forma comprensibile.
3. Stato ordine, pagamento e spedizione rimangono distinguibili.
4. L’operatore può aprire il dettaglio e distinguere dato autorevole e dato derivato.
5. Un problema tecnico interno non diventa automaticamente una categoria business mostrata all’operatore.
6. Order Operations non modifica lo stato commerciale dell’ordine nella prima iterazione.
7. Una dipendenza indisponibile produce uno stato comprensibile e osservabile, non dati silenziosamente inventati.

### Significant non-functional requirements

**Security.** L’accesso deve rispettare le policy di identity e authorization applicabili agli operatori interni.

**Freshness.** La coda non deve essere real-time al secondo per principio. Un breve ritardo può essere accettabile; il target verrà deciso dopo baseline e confronto delle alternative.

**Operability.** Dobbiamo distinguere l’assenza reale di casi dal fallimento del meccanismo che alimenta o interroga la vista.

**Reversibility.** Il rollout deve poter essere interrotto senza compromettere il flusso ordini principale.

### Assumptions

- le condizioni problematiche iniziali possono essere derivate da dati già presenti;
- il volume della coda è gestibile senza introdurre immediatamente una piattaforma di streaming dedicata;
- gli operatori utilizzano già l’identità aziendale necessaria;
- il dettaglio ordine contiene abbastanza informazioni per la prima diagnosi;
- la classificazione operativa è distinta dallo stato commerciale dell’ordine.

### Acceptance evidence

Ci aspettiamo test di authorization sulla coda e sul dettaglio, test sulle principali combinazioni di stato Order/Payment/Shipment e evidence che Order Operations non modifichi lo stato commerciale. Servono inoltre telemetry sulle dipendenze, tracciabilità verso i dati autorevoli, una sessione con un piccolo gruppo Operations per validare la comprensibilità delle categorie e una baseline iniziale sui tempi di individuazione e investigazione.

### Open decisions

Restano intenzionalmente aperti il modo in cui costruire la coda — query diretta, read model o altra strategia —, il meccanismo di aggiornamento dell’interfaccia, la retention di eventuali audit futuri, il target di freshness e la normalizzazione delle cause tecniche in categorie operative. Sono aperte anche la semantica delle future azioni correttive e l’ownership tra Commerce & Operations e Payments & Risk per retry e refund.

### Stop / escalation conditions

L’execution deve fermarsi se costruire la coda richiede di cambiare semanticamente gli stati ordine esistenti, ampliare i permessi degli operatori o esporre dati sensibili non previsti. Deve inoltre escalare se il volume reale rende impraticabile l’approccio senza nuova infrastruttura, se emerge una migration distruttiva, se due sistemi risultano autorevoli per lo stesso significato o se una futura action API richiede decisioni economiche o di rischio non ancora condivise con Payments & Risk.

---

### Il compromesso del capitolo

Il compromesso di questa fase è tra completezza dell’analisi e velocità di apprendimento. Product e Operations vogliono ridurre presto il tempo perso sui casi problematici, ma non abbiamo bisogno di definire oggi tutte le remediation, gli SLA e i workflow futuri.

Decidiamo quindi di costruire **abbastanza foundation per rendere sicura la prossima iterazione**, lasciando aperte le decisioni che non servono ancora. Il quality floor è però esplicito: ownership, authorization, source of truth e separazione degli stati non possono essere inventati durante l’implementazione. Open decision e stop condition proteggono proprio questo confine.

Non stiamo dicendo “non sappiamo, quindi improvvisiamo”. Stiamo dicendo: **non serve decidere tutto ora, ma sappiamo quali decisioni non siamo autorizzati a inventare**.

### Che cosa abbiamo ottenuto?

Non abbiamo ancora scelto l’architettura, ed è intenzionale. Potremmo implementare la capability con query sul database esistente, con un read model dedicato, usando eventi, polling, notifiche push o altre varianti. Alcune saranno migliori di altre, ma ora possediamo criteri con cui giudicarle.

Prima avevamo una soluzione nominale — “dashboard degli ordini problematici”. Ora abbiamo un problema, un outcome, un confine e una serie di invarianti. La soluzione può finalmente essere discussa.

### Il brief scopre domande architetturali

Il Problem & Outcome Brief non contiene l’architettura, ma fa emergere domande architetturali migliori. Dobbiamo capire chi sia autorevole per determinare che un ordine richieda attenzione, se la classificazione sia derivata o persistita, se la coda possa leggere direttamente il modello transazionale, quale freshness serva davvero, quanto conti isolare il failure domain della capability e quali decisioni attraversino più business unit ESI.

Sono domande più utili di “meglio Kafka o Service Bus?” perché vengono prima della tecnologia.

### Non ottimizziamo ancora

Potremmo già progettare una soluzione sofisticata, ma non lo faremo. Nei prossimi capitoli Order Operations crescerà insieme alla nostra capacità di ragionare. Vogliamo mostrare come una soluzione diventi ragionevole o irragionevole quando cambia il contesto, non esibire l’architettura “giusta” fin dall’inizio.

Per ora abbiamo ottenuto ciò che ci serviva:

> **un problema abbastanza chiaro da poter iniziare a prendere decisioni senza chiedere al codice di inventarlo per noi.**
