# Acme Orders — Analisi funzionale

> Documento vivo del capstone simulato/composito.

Questo documento descrive **che cosa fa il prodotto** e il linguaggio funzionale condiviso.

Non descrive ancora la soluzione tecnica completa.

## Product goal

Ridurre il tempo necessario agli operatori per individuare, comprendere e gestire ordini che richiedono attenzione operativa.

## Attori

### Operations Operator

Monitora ordini problematici, ne comprende lo stato e decide l'azione operativa appropriata.

### Operations Supervisor

Ha visibilità più ampia sul workload operativo e può intervenire su casi che richiedono escalation.

### Customer

Non usa direttamente la console operativa, ma subisce le conseguenze delle decisioni prese sul proprio ordine.

### External Payment Provider

Partecipa ai flussi di pagamento e rimborso. È esterno al system of interest.

### Shipping Provider

Partecipa ai flussi di spedizione. È esterno al system of interest.

## Capability iniziali

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

## Critical user journey iniziale

```text
operatore apre la console
→ richiede gli ordini problematici
→ il sistema identifica gli ordini rilevanti
→ mostra stato e causa principale
→ operatore apre un ordine
→ consulta il dettaglio
→ decide se intervenire, attendere o escalare
```

## Business rule iniziali

1. Un ordine non deve essere classificato come problematico soltanto perché è vecchio: serve una condizione funzionale esplicita.
2. Lo stato dell'ordine deve essere distinto dallo stato del pagamento e dallo stato della spedizione.
3. La console operativa non diventa automaticamente authoritative source per dati posseduti da Orders, Payments o Shipping.
4. Un dato derivato deve poter essere ricondotto al proprio dato autorevole.
5. Le operazioni con conseguenze sul cliente devono avere una semantica esplicita prima di essere automatizzate.

## Stati e transizioni

Il modello degli stati non è ancora completo.

Per questa iterazione distinguiamo almeno tre state machine concettualmente separate:

```text
Order
Payment
Shipment
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

## Eccezioni funzionali già note

- pagamento riuscito ma spedizione non avviabile;
- provider pagamento temporaneamente indisponibile;
- spedizione marcata fallita dopo che l'ordine era stato considerato regolare;
- ordine cancellato mentre esiste un'operazione esterna ancora in corso;
- dati esterni temporaneamente non aggiornati;
- stato formalmente valido ma combinazione di stati semanticamente sospetta.

## Functional questions aperte

1. Che cosa rende esattamente un ordine “problematico”?
2. La classificazione deve essere in tempo reale o può essere leggermente stale?
3. L'operatore può soltanto osservare o può anche eseguire azioni correttive?
4. Quali azioni richiedono permessi diversi?
5. Serve assegnare un caso a un operatore?
6. Serve audit delle azioni operative?
7. Esiste una nozione di priorità o severity?
8. Qual è la semantica del rimborso?
9. Quali casi richiedono escalation a un supervisor?
10. Quali informazioni possono essere mostrate senza interrogare live sistemi esterni?

Le domande aperte non devono essere risolte per comodità dall'implementazione.

## Glossario iniziale

### Order

Entità commerciale che rappresenta l'acquisto del cliente.

### Problematic Order

Ordine che soddisfa almeno una condizione funzionale che richiede attenzione operativa.

Non equivale a “ordine con qualsiasi errore tecnico”.

### Operational Case

Concetto candidato per rappresentare un problema gestibile dagli operatori.

Non è ancora deciso se debba diventare un'entità persistente distinta dall'ordine.

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
Operational visibility
  ↓
Investigation
  ↓
Action / Wait / Escalation
```

## Regola di evoluzione

Quando aggiungiamo una feature ad Acme Orders, prima di modificare il codice dobbiamo verificare se cambia almeno uno di questi elementi:

- attore;
- capability;
- business rule;
- stato;
- transizione;
- permission;
- journey;
- glossario;
- eccezione;
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

Questo documento non copia una metodologia specifica: usa queste fonti come evidenza del principio di shared domain understanding.