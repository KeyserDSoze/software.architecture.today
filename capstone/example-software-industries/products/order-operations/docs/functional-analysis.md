# Order Operations — Analisi funzionale

> Documento vivo del capstone simulato/composito di **Example Software Industries S.p.A. (ESI)**.

Questo documento descrive **che cosa fa il prodotto** e il linguaggio funzionale condiviso.

Non descrive ancora la soluzione tecnica completa.

## Contesto aziendale

Order Operations appartiene alla business unit **Commerce & Operations**.

Interagisce con capability che possono appartenere ad altre aree di ESI o a provider esterni. In particolare Payments & Risk può imporre vincoli su semantica economica, audit e integrazioni che la sola Operations non può decidere autonomamente.

> Una business unit può possedere un prodotto senza possedere unilateralmente tutte le decisioni che attraversano altri domini.

## Product goal

Ridurre il tempo necessario agli operatori per individuare, comprendere e gestire ordini che richiedono attenzione operativa.

## Attori

### Operations Operator

Monitora ordini problematici, ne comprende lo stato e decide l'azione operativa appropriata.

Può richiedere una Payment Escalation quando il caso soddisfa le regole funzionali e l'operatore possiede l'autorizzazione necessaria.

### Operations Supervisor

Ha visibilità più ampia sul workload operativo e può intervenire su casi che richiedono escalation o su failure di delivery che superano il business timeout.

### Customer

Non usa direttamente la console operativa, ma subisce le conseguenze delle decisioni prese sul proprio ordine.

### Payments & Risk

Dominio interno ESI responsabile delle regole e dei vincoli relativi alle capability di pagamento e rischio quando queste sono condivise a livello aziendale.

Riceve Payment Escalation da Order Operations ma mantiene ownership su decisioni, workflow e side effect economici.

### External Payment Provider

Partecipa ai flussi di pagamento e rimborso. È esterno al system of interest.

### Shipping Provider

Partecipa ai flussi di spedizione. È esterno al system of interest.

### Platform Engineering

Fornisce capability condivise come identity integration, observability, runtime platform e messaging capability. Non possiede la semantica funzionale di Order Operations.

## Capability correnti

### Visualizzare ordini che richiedono attenzione

L'operatore può ottenere un insieme di ordini classificati come problematici secondo regole note.

### Comprendere lo stato di un ordine

L'operatore può vedere informazioni sufficienti a distinguere almeno:

- problema di pagamento;
- problema di spedizione;
- stato dell'ordine;
- ultimo aggiornamento rilevante.

### Aprire il dettaglio operativo

L'operatore può accedere alle informazioni necessarie per capire perché l'ordine è nella lista e quale sistema possiede l'informazione autorevole.

### Gestire un Operational Case

Order Operations persiste un `OperationalCase` locale per rappresentare il lavoro operativo distinto dal lifecycle commerciale dell'ordine.

Il caso può essere assegnato a un operatore senza modificare lo stato commerciale dell'ordine.

### Richiedere una Payment Escalation

Un operatore autorizzato può richiedere a Payments & Risk la presa in carico di un problema collegato a un `OperationalCase` classificato come `Payment`.

La Payment Escalation:

- registra un'intenzione locale esplicita;
- non esegue refund;
- non cambia `PaymentStatus`;
- non chiama direttamente un payment provider;
- non autorizza Order Operations a decidere la semantica economica;
- viene consegnata a Payments & Risk in modo asincrono.

## Critical user journey corrente

```text
operatore apre la console
→ richiede gli ordini problematici
→ il sistema identifica gli ordini rilevanti
→ mostra stato e causa principale
→ operatore apre un Operational Case
→ consulta il dettaglio
→ decide se intervenire, attendere o escalare
```

### Payment Escalation journey

```text
operatore apre un Operational Case di categoria Payment
→ verifica che serva intervento Payments & Risk
→ richiede Payment Escalation
→ Order Operations valida permission e precondizioni
→ registra escalation localmente
→ UI mostra escalation Requested / delivery Pending
→ consegna asincrona a Payments & Risk
→ delivery diventa Delivered oppure Delayed/DeadLettered
```

Il journey separa intenzionalmente:

```text
escalation accettata localmente
≠
escalation elaborata da Payments & Risk
```

## Business rule correnti

1. Un ordine non deve essere classificato come problematico soltanto perché è vecchio: serve una condizione funzionale esplicita.
2. Lo stato dell'ordine deve essere distinto dallo stato del pagamento e dallo stato della spedizione.
3. La console operativa non diventa automaticamente authoritative source per dati posseduti da Orders, Payments o Shipping.
4. Un dato derivato deve poter essere ricondotto al proprio dato autorevole.
5. Le operazioni con conseguenze sul cliente devono avere una semantica esplicita prima di essere automatizzate.
6. Le operazioni con conseguenze economiche devono rispettare i vincoli definiti insieme a Payments & Risk, non soltanto quelli del team Commerce & Operations.
7. Una Payment Escalation può essere richiesta soltanto per un `OperationalCase` accessibile all'operatore e classificato come `Payment`.
8. Un retry tecnico della stessa Payment Escalation deve conservare la stessa identità dell'intenzione (`EscalationId`).
9. La redelivery della stessa escalation non deve creare due workflow business in Payments & Risk.
10. Il failure della consegna asincrona non annulla automaticamente il fatto che l'operatore abbia richiesto l'escalation.
11. Il delivery state deve essere distinguibile dal business state dell'escalation.
12. Una escalation che non viene consegnata entro il business delay accettabile deve diventare visibile a Operations/Supervisor e seguire una recovery policy.
13. Order Operations non può usare la Payment Escalation come scorciatoia per introdurre refund o altri side effect economici non ancora analizzati.

## Stati e transizioni

Il modello complessivo degli stati non è ancora completo.

Manteniamo state machine concettualmente distinte:

```text
Order
Payment
Shipment
OperationalCase
PaymentEscalation
IntegrationDelivery
```

Queste state machine non devono essere fuse in un singolo campo `status` soltanto per comodità della UI.

### Order — stato minimo

Esempio iniziale, ancora soggetto a revisione:

```text
Created
Confirmed
Processing
Completed
Cancelled
```

### Payment — stato minimo

```text
Pending
Authorized
Captured
Failed
RefundPending
Refunded
```

### Shipment — stato minimo

```text
NotReady
Ready
Dispatched
Delivered
Failed
```

Questi valori sono parte del modello simulato e non rappresentano uno standard industriale.

### PaymentEscalation — stato v1

```text
Requested
```

La v1 rappresenta soltanto il fatto che Order Operations ha richiesto l'escalation.

Eventuali stati come:

```text
Accepted
Rejected
Closed
```

non vengono inventati finché Commerce & Operations e Payments & Risk non ne definiscono semantica e ownership.

### IntegrationDelivery — stato v1

```text
Pending
Delivered
Delayed
DeadLettered
```

Questi stati descrivono la consegna dell'integrazione, non il workflow economico downstream.

## Payment Escalation — precondizioni v1

1. `OperationalCase` esistente;
2. tenant visibility valida;
3. `ProblemClassification = Payment`;
4. operatore autorizzato alla escalation;
5. assenza di escalation attiva incompatibile secondo il modello corrente;
6. `reasonCode` supportato;
7. `EscalationId` stabile per retry della stessa intenzione.

## Payment Escalation — reason code v1

```text
PaymentInvestigationRequired
```

Il reason code descrive una richiesta di investigazione.

Non implica una decisione economica.

## Eccezioni funzionali già note

- pagamento riuscito ma spedizione non avviabile;
- provider pagamento temporaneamente indisponibile;
- spedizione marcata fallita dopo che l'ordine era stato considerato regolare;
- ordine cancellato mentre esiste un'operazione esterna ancora in corso;
- dati esterni temporaneamente non aggiornati;
- stato formalmente valido ma combinazione di stati semanticamente sospetta;
- Payment Escalation registrata localmente ma delivery downstream in ritardo;
- redelivery tecnica della stessa escalation;
- escalation finita in dead-letter path;
- Payments & Risk temporaneamente indisponibile;
- schema event non supportato dal consumer;
- divergenza rilevata dalla reconciliation.

## Functional questions aperte

1. Che cosa rende esattamente un ordine “problematico”?
2. La classificazione deve essere in tempo reale o può essere leggermente stale?
3. Quali azioni correttive oltre alla escalation verranno introdotte?
4. Quali azioni richiedono permessi diversi?
5. Qual è il lifecycle completo dell'OperationalCase?
6. Quale audit completo serve per le azioni operative?
7. Esiste una nozione di priorità o severity?
8. Qual è la semantica del rimborso e chi la possiede?
9. Quali casi richiedono escalation a un supervisor?
10. Quali informazioni possono essere mostrate senza interrogare live sistemi esterni?
11. Quali decisioni devono essere approvate o condivise con Payments & Risk, Security o Legal/Compliance?
12. Payments & Risk deve inviare acknowledgement applicativo esplicito dell'escalation?
13. Quali stati downstream (`Accepted`, `Rejected`, `Closed`) devono essere visibili a Order Operations?
14. Qual è il business delivery target per una Payment Escalation?
15. Quando una delivery ritardata richiede intervento umano?
16. Quale retention serve per escalation e relative evidenze di delivery?

Le domande aperte non devono essere risolte per comodità dall'implementazione.

## Glossario corrente

### Order

Entità commerciale che rappresenta l'acquisto del cliente.

### Problematic Order

Ordine che soddisfa almeno una condizione funzionale che richiede attenzione operativa.

Non equivale a “ordine con qualsiasi errore tecnico”.

### Operational Case

Entità locale di Order Operations che rappresenta un problema gestibile dagli operatori.

È distinto dall'ordine e dal lifecycle commerciale.

### Payment Escalation

Richiesta esplicita di attenzione inviata da Order Operations a Payments & Risk per un Operational Case di categoria Payment.

Non equivale a refund o altra operazione economica.

### EscalationId

Identità stabile della stessa intenzione di escalation.

Viene mantenuta nei retry e usata per idempotency/deduplication downstream.

### Delivery State

Stato tecnico-funzionale che descrive se l'integrazione di una escalation è ancora pending, è stata consegnata, è in ritardo o è finita nel dead-letter path.

Non descrive lo stato del pagamento.

### Payment

Stato e processo economico relativo all'ordine. È concettualmente distinto dall'ordine.

### Shipment

Stato e processo di fulfillment/spedizione relativo all'ordine.

### Authoritative source

Componente o dominio responsabile della verità primaria per un dato.

## Mappa funzionale sintetica

```text
Customer
  ↓
Order lifecycle
  ├── Payment lifecycle
  └── Shipment lifecycle

Operations
  ↓
Problem detection
  ↓
OperationalCase
  ↓
Investigation
  ├── Wait / local handling
  └── Payment Escalation
         ↓ asynchronous delivery
       Payments & Risk
```

## Regola di evoluzione

Quando aggiungiamo una feature a Order Operations, prima di modificare il codice dobbiamo verificare se cambia almeno uno di questi elementi:

- attore;
- capability;
- business rule;
- stato;
- transizione;
- permission;
- journey;
- glossario;
- eccezione;
- stakeholder aziendale;
- domanda funzionale aperta.

Se cambia, questo documento deve evolvere insieme al progetto.

## Fonti metodologiche

L'approccio è coerente con la domain analysis descritta da Microsoft Azure Architecture Center, che raccomanda di costruire una comprensione condivisa delle business function e delle loro connessioni prima di scegliere le tecnologie:

- [Microsoft Learn — Use Domain Analysis to Model Microservices](https://learn.microsoft.com/azure/architecture/microservices/model/domain-analysis)

Per il concetto di linguaggio condiviso:

- [Microsoft Learn — Use Domain Analysis to Model Microservices](https://learn.microsoft.com/azure/architecture/microservices/model/domain-analysis)
- [Martin Fowler — Ubiquitous Language](https://martinfowler.com/bliki/UbiquitousLanguage.html)

Per la natura continua e collaborativa della gestione dei requisiti:

- [Microsoft Learn — Manage requirements for Agile teams in Azure DevOps](https://learn.microsoft.com/azure/devops/cross-service/manage-requirements)

Per le proprietà di delivery e idempotency che condizionano la semantica osservabile della Payment Escalation:

- [Microsoft Learn — Idempotent Consumer pattern](https://learn.microsoft.com/azure/architecture/patterns/idempotent-consumer)
- [Amazon Builders' Library — Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/)

Le fonti sostengono il metodo e le proprietà tecniche. La semantica di ESI resta simulata e viene definita esplicitamente nel capstone.