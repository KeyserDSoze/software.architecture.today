# Order Operations — Analisi funzionale

> Documento vivo del capstone simulato/composito di **Example Software Industries S.p.A. (ESI)**.

Questo documento descrive **che cosa fa il prodotto**, il linguaggio condiviso e le decisioni funzionali correnti. Non descrive la soluzione tecnica completa.

## Contesto aziendale

Order Operations appartiene alla business unit **Commerce & Operations**.

Interagisce con capability possedute da altri domini ESI. In particolare Payments & Risk mantiene ownership sulle decisioni economiche e sui vincoli relativi ai pagamenti.

> **Una business unit può possedere un prodotto senza possedere unilateralmente tutte le decisioni che attraversano altri domini.**

## Product goal

Ridurre il tempo necessario agli operatori per individuare, comprendere e gestire ordini che richiedono attenzione operativa.

## Attori

### Operations Operator

Monitora ordini problematici, comprende lo stato, lavora sugli `OperationalCase` e può richiedere una Payment Escalation quando autorizzato.

### Operations Supervisor

Ha visibilità più ampia sul workload e interviene su casi/escalation che superano le normali policy operative.

### Customer

Non usa direttamente la console ma subisce le conseguenze delle decisioni operative sull'ordine.

### Payments & Risk

Riceve Payment Escalation ma mantiene ownership su decisioni, workflow e side effect economici.

### External Payment Provider / Shipping Provider

Dipendenze esterne coinvolte nei rispettivi lifecycle.

### Platform Engineering

Fornisce identity integration, observability, runtime e messaging capability senza possedere la semantica funzionale di Order Operations.

## Capability correnti

### Visualizzare ordini che richiedono attenzione

L'operatore può ottenere ordini classificati come problematici secondo condizioni funzionali note.

### Comprendere lo stato di un ordine

La vista distingue almeno:

- stato ordine;
- problema pagamento;
- problema spedizione;
- ultimo aggiornamento rilevante;
- provenance/fonte autorevole quando necessario.

### Gestire un Operational Case

Order Operations persiste un `OperationalCase` locale distinto dal lifecycle commerciale dell'ordine.

Il case può essere assegnato a un operatore senza modificare lo stato commerciale.

### Determinare la priorità operativa

Dal Capitolo 18 Order Operations possiede una semantica target esplicita per la **priorità operativa** del case.

La priority aiuta a ordinare il lavoro. Non cambia `OrderStatus`, `PaymentStatus` o `ShipmentStatus` e non sostituisce authorization o business ownership.

Target vocabulary:

```text
NotActionable
ManualReview
Urgent
Standard
```

Dettaglio:

```text
docs/priority-functional-analysis.md
```

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
→ identifica/apre OperationalCase
→ il sistema determina la priorità operativa
→ operatore consulta dettaglio e provenance
→ decide se intervenire, attendere o escalare
```

### Payment Escalation journey

```text
operatore apre OperationalCase Payment
→ verifica necessità di intervento Payments & Risk
→ richiede Payment Escalation
→ Order Operations valida permission e precondizioni
→ registra escalation + outbox localmente
→ UI mostra Requested / delivery Pending
→ delivery asincrona
→ Delivered oppure Delayed/DeadLettered
```

```text
escalation accettata localmente
≠
escalation elaborata da Payments & Risk
```

## Business rule correnti

### Regole generali

1. Un ordine non diventa problematico soltanto perché è vecchio: serve una condizione funzionale esplicita.
2. Stato ordine, pagamento, spedizione, OperationalCase, PaymentEscalation e IntegrationDelivery restano concettualmente distinti.
3. Order Operations non diventa authoritative source per facts posseduti da Orders, Payments o Shipping.
4. Un dato derivato deve poter essere ricondotto alla fonte autorevole.
5. Operazioni con conseguenze sul cliente richiedono semantica esplicita prima di essere automatizzate.
6. Operazioni economiche rispettano i vincoli definiti con Payments & Risk.

### Priority — regole confermate nello scenario ESI

7. Un `OperationalCase` `Closed` è `NotActionable`.
8. `manualHold = true` produce `ManualReview` e ha precedenza sulle regole automatiche di urgenza.
9. Un case `Payment` con `failedAttempts >= 3` è `Urgent` nella policy corrente simulata ESI.
10. Un case aperto senza condizioni più prioritarie è `Standard`.
11. Il solo `customerTier = Enterprise` **non** aumenta più la priorità nel target.
12. La vecchia regola legacy `Enterprise + age >= 30m → URGENT` è stata rimossa tramite decisione funzionale esplicita `ED-001`.
13. La precedence target è:

```text
Closed
> ManualReview
> RepeatedPaymentFailure
> Standard
```

### Payment Escalation

14. Una Payment Escalation può essere richiesta soltanto per un `OperationalCase` accessibile all'operatore e classificato `Payment`.
15. Retry tecnico della stessa intenzione conserva `EscalationId`.
16. Redelivery della stessa escalation non deve creare due workflow business in Payments & Risk.
17. Il failure di delivery non annulla automaticamente il fatto che l'operatore abbia richiesto l'escalation.
18. Delivery state e business state restano distinti.
19. Delivery oltre il delay accettabile deve diventare visibile e seguire recovery policy.
20. Payment Escalation non è una scorciatoia per refund o altri side effect economici non analizzati.

## Stati e transizioni

Manteniamo state machine distinte:

```text
Order
Payment
Shipment
OperationalCase
PaymentEscalation
IntegrationDelivery
```

### Order — esempio simulato

```text
Created
Confirmed
Processing
Completed
Cancelled
```

### Payment — esempio simulato

```text
Pending
Authorized
Captured
Failed
RefundPending
Refunded
```

### Shipment — esempio simulato

```text
NotReady
Ready
Dispatched
Delivered
Failed
```

### PaymentEscalation v1

```text
Requested
```

`Accepted`, `Rejected` e `Closed` non vengono inventati finché Commerce & Operations e Payments & Risk non ne definiscono semantica e ownership.

### IntegrationDelivery v1

```text
Pending
Delivered
Delayed
DeadLettered
```

### Operational priority

La priority è per ora una **decisione derivata**, non uno stato persistito dichiarato authoritative.

La decisione su eventuale persistence/storico è ancora aperta.

## Payment Escalation — precondizioni v1

1. `OperationalCase` esistente;
2. tenant visibility valida;
3. `ProblemClassification = Payment`;
4. operatore autorizzato;
5. assenza di escalation attiva incompatibile;
6. `reasonCode` supportato;
7. `EscalationId` stabile per retry della stessa intenzione.

Reason code v1:

```text
PaymentInvestigationRequired
```

## Priority — decisione legacy/target

Operations Desk Classic continua a essere caratterizzato come:

```text
CLOSED → NONE
manual_hold → MANUAL_REVIEW
PAY + failed_attempts>=3 → URGENT
ENTERPRISE + age>=30m → URGENT
otherwise → STANDARD
```

Il target Order Operations mantiene soltanto la semantica confermata:

```text
Closed → NotActionable
manualHold → ManualReview
Payment + failedAttempts>=3 → Urgent
otherwise → Standard
```

La differenza Enterprise è intenzionale e registrata come `ED-001`.

> **Characterization evidence e target requirement non sono la stessa cosa.**

## Eccezioni funzionali note

- pagamento riuscito ma spedizione non avviabile;
- provider pagamento temporaneamente indisponibile;
- spedizione fallita dopo precedente stato regolare;
- ordine cancellato con operazione esterna ancora in corso;
- dati esterni temporaneamente stale;
- combinazione di stati formalmente valida ma semanticamente sospetta;
- Payment Escalation committed ma delivery in ritardo;
- redelivery tecnica;
- dead-letter path;
- Payments & Risk indisponibile;
- schema event non supportato;
- reconciliation mismatch;
- manual hold su case altrimenti urgent;
- legacy/candidate priority mismatch durante shadow migration.

## Functional questions aperte

1. Che cosa rende esattamente un ordine “problematico” in tutti i domini?
2. La classificazione problematica deve essere live o può essere stale entro soglia?
3. Quali azioni correttive oltre alla escalation verranno introdotte?
4. Quali azioni richiedono permission diverse?
5. Qual è il lifecycle completo dell'OperationalCase?
6. Quale audit completo serve per le azioni operative?
7. La priority target deve essere derivata on demand o persistita?
8. Serve uno storico/audit delle decisioni di priority?
9. Chi può applicare/rimuovere un manual hold nel target?
10. Il nightly export legacy usa ancora `priority_code`?
11. Qual è la semantica del rimborso e chi la possiede?
12. Quali informazioni possono essere mostrate senza interrogare live sistemi esterni?
13. Payments & Risk deve inviare acknowledgement applicativo dell'escalation?
14. Quali stati downstream devono essere visibili a Order Operations?
15. Qual è il business delivery target per Payment Escalation?
16. Quale retention serve per escalation e delivery evidence?

Le domande aperte non vengono risolte per comodità dall'implementazione o dall'AI.

## Glossario

### Operational Case

Entità locale che rappresenta lavoro operativo distinto dall'ordine commerciale.

### Operational Priority

Decisione che aiuta a ordinare il lavoro sugli Operational Case. Non equivale a severity tecnica, stato ordine o authorization.

### Manual Review

Priorità/decisione operativa che indica che il routing automatico non deve prevalere su un hold umano esplicito.

### Payment Escalation

Richiesta esplicita di attenzione inviata a Payments & Risk per un Operational Case Payment. Non equivale a refund.

### EscalationId

Identità stabile della stessa intenzione di escalation.

### Delivery State

Stato della consegna dell'integrazione, distinto dallo stato economico downstream.

### Authoritative source

Componente/dominio responsabile della verità primaria di un fact.

## Artefatti funzionali collegati

```text
docs/priority-functional-analysis.md
docs/legacy-understanding-map.md
docs/refactoring-safety-plan.md
docs/api-contract.md
docs/data-ownership.md
```

## Regola di evoluzione

Quando una feature cambia attori, capability, business rule, stati, permission, journey, glossario, eccezioni o stakeholder, questo documento deve evolvere **prima o insieme al codice**.

## Fonti metodologiche

- [Microsoft Learn — Use Domain Analysis to Model Microservices](https://learn.microsoft.com/azure/architecture/microservices/model/domain-analysis)
- [Microsoft Learn — Manage requirements for Agile teams](https://learn.microsoft.com/azure/devops/cross-service/manage-requirements)
- [Martin Fowler — Ubiquitous Language](https://martinfowler.com/bliki/UbiquitousLanguage.html)
- [Microsoft Learn — Idempotent Consumer](https://learn.microsoft.com/azure/architecture/patterns/idempotent-consumer)
- [AWS Prescriptive Guidance — Branch by abstraction](https://docs.aws.amazon.com/prescriptive-guidance/latest/modernization-decomposing-monoliths/branch-by-abstraction.html)

Le fonti sostengono metodo e proprietà tecniche. Le regole specifiche di ESI restano simulate e sono esplicitamente marcate come tali.
