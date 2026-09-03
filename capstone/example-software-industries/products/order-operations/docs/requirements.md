# Order Operations — Requirements Snapshot

> Stato corrente dei requisiti del capstone simulato/composito di Example Software Industries S.p.A.

Questo documento non sostituisce l'analisi funzionale. Riassume i requisiti che, fino a questo punto del libro, influenzano concretamente design e architettura.

## Problema

Gli operatori impiegano troppo tempo a individuare ordini che richiedono attenzione e a capire quale parte del processo sta causando il problema.

Quando il problema richiede l'intervento di Payments & Risk, la richiesta di escalation deve essere registrabile rapidamente e consegnata in modo affidabile senza rendere la disponibilità runtime del downstream parte del critical request path.

## Outcome iniziale

Ridurre il tempo necessario per:

1. individuare un ordine problematico;
2. comprenderne la causa principale;
3. decidere se intervenire, attendere o escalare;
4. rendere visibile quando una escalation payment è stata richiesta ma non ancora consegnata al dominio responsabile.

## Contesto ESI

Order Operations appartiene a Commerce & Operations ma dipende da capability e vincoli che attraversano altri domini aziendali.

In particolare:

- Payments & Risk possiede o governa semantiche economiche rilevanti;
- Platform Engineering fornisce capability condivise, inclusa la messaging capability, senza possedere il dominio;
- Security e Legal/Compliance possono introdurre quality floor non negoziabili;
- Finance/FinOps può influenzare il costo accettabile della soluzione.

## In scope

- vista degli ordini problematici;
- dettaglio operativo dell'ordine;
- `OperationalCase` locale;
- distinzione tra stato ordine, pagamento e spedizione;
- visibilità della causa principale nota;
- accesso controllato per operatori interni;
- integrazione con i dati autorevoli necessari al journey;
- richiesta di Payment Escalation per casi eligibili;
- delivery asincrona della escalation a Payments & Risk;
- visibilità dello stato di delivery;
- retry/DLQ/reconciliation come parte della reliability del flusso.

## Out of scope corrente

- portale self-service per merchant;
- automazione completa delle remediation;
- refund/capture/retry provider da Order Operations;
- workflow regolamentato di case management completo;
- audit immutabile multi-anno;
- active-active multi-region;
- event sourcing;
- microservizi per ogni capability;
- AI decisionale sul trattamento degli ordini;
- saga/orchestrator general-purpose per una singola escalation;
- read model asincrono di Order/Payment/Shipment status.

L'out of scope non è una promessa eterna. È lo stato attuale del contesto.

## Functional requirements

### FR-001 — Lista ordini problematici

Un operatore autorizzato può visualizzare gli ordini che soddisfano almeno una regola funzionale di problematicità.

### FR-002 — Identificazione della causa

Per ogni ordine il sistema mostra informazioni sufficienti a distinguere almeno problemi legati a:

- ordine;
- pagamento;
- spedizione.

### FR-003 — Dettaglio operativo

L'operatore può aprire il dettaglio di un ordine e consultare le informazioni necessarie all'investigazione.

### FR-004 — Source authority

Il sistema deve distinguere i dati autorevoli dai dati derivati o aggregati.

### FR-005 — Access control

Le funzionalità operative sono disponibili soltanto ad attori autorizzati.

### FR-006 — Stato leggibile

Gli stati funzionali devono essere espressi con termini comprensibili nel dominio, evitando di esporre direttamente dettagli tecnici quando non rappresentano il significato business.

### FR-007 — Payment Escalation

Un operatore autorizzato può richiedere una Payment Escalation per un `OperationalCase` classificato `Payment`.

La richiesta non modifica il payment status e non esegue side effect economici.

### FR-008 — Idempotent escalation intent

Un retry tecnico della stessa intenzione di escalation deve conservare lo stesso `EscalationId`/Idempotency-Key e non deve creare una seconda escalation business.

### FR-009 — Asynchronous delivery state

Dopo che una escalation è stata accettata localmente, Order Operations deve poter distinguere almeno:

```text
Pending
Delivered
Delayed
DeadLettered
```

senza confondere questi stati con il workflow economico di Payments & Risk.

### FR-010 — Durable publication intent

Se una Payment Escalation viene committed localmente, l'intenzione di pubblicare il relativo evento deve essere persisted nella stessa transazione locale.

### FR-011 — Downstream duplicate tolerance

Payments & Risk deve poter riconoscere redelivery della stessa `EscalationId` senza creare un secondo workflow business.

Il dettaglio dell'inbox/dedup storage downstream appartiene al dominio Payments & Risk.

### FR-012 — Delivery failure visibility

Una escalation che supera il business delivery threshold o entra nel dead-letter path deve diventare visibile secondo la recovery policy e non restare un failure silenzioso.

## Acceptance evidence corrente

- test sui criteri di classificazione degli ordini problematici;
- test sui principali state combination;
- test di autorizzazione;
- test di integrazione con le fonti dati necessarie;
- verifica che un ordine mostrato possa essere ricondotto ai dati autorevoli;
- scenario end-to-end del critical user journey;
- test che `PaymentEscalation + OutboxMessage` siano atomici nella stessa transaction;
- test di retry API con stessa Idempotency-Key;
- test di redelivery dello stesso event senza duplicate business effect downstream;
- test di publish acknowledgement incerto / republish;
- test della transizione `Pending → Delivered`;
- test del failure path `Delayed/DeadLettered`;
- evidenza di reconciliation per escalation non consegnate.

## Assunzioni correnti

- il prodotto è inizialmente uno strumento interno;
- il volume è compatibile con una soluzione semplice senza infrastruttura di caching dedicata;
- le read capability principali restano live e non richiedono ancora un read model separato;
- il team può operare un modular monolith con database relazionale;
- non esiste ancora un requisito organizzativo che richieda deploy indipendenti per Orders, Payments e Shipping;
- Platform Engineering può fornire una capability di messaging durabile, ma il prodotto cloud concreto verrà scelto nel Capitolo 12;
- il volume iniziale delle escalation è compatibile con un polling publisher della outbox;
- Payments & Risk può implementare idempotency sul proprio consumer.

## Decisioni aperte

- definizione definitiva di “problematic order”;
- semantica delle future azioni correttive;
- lifecycle completo di `OperationalCase`;
- audit completo delle azioni;
- priorità/severity;
- eventuale aggiornamento push vs refresh/polling;
- comportamento in presenza di fonti esterne indisponibili;
- eventuali trigger per introdurre un read model;
- confine di responsabilità fra Commerce & Operations e Payments & Risk per refund e retry;
- acknowledgement applicativo di Payments & Risk;
- lifecycle completo di Payment Escalation;
- business delivery target;
- retry count/backoff concreti;
- DLQ retention/redrive policy;
- outbox retention/cleanup;
- broker/cloud product;
- requisiti futuri introdotti da Security, Compliance o clienti enterprise.

## Traceability

Questo snapshot deriva dal percorso narrativo dei capitoli:

- Capitolo 2 — problem framing, functional analysis e acceptance criteria;
- Capitolo 3 — system context e critical user journey;
- Capitolo 4 — ADR sul lookup live;
- Capitolo 5 — ownership e responsibility boundary;
- Capitolo 6 — NFR;
- Capitolo 7 — pattern selection;
- Capitolo 8 — modular monolith e topology decision;
- Capitolo 9 — API contract;
- Capitolo 10 — data ownership e schema iniziale;
- Capitolo 11 — partial failure, idempotency, transactional outbox, async delivery e Failure Mode Map.

Quando un capitolo cambia un requisito, questo documento deve essere aggiornato insieme al codice e agli altri artefatti.