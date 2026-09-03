## Eventual consistency: non è un permesso per essere vaghi

Quando un business process attraversa più componenti indipendenti, possiamo non avere una singola transazione ACID che copra tutto.

Questo non significa che la consistenza scompaia.

Significa che dobbiamo descriverla nel tempo.

Esempio:

```text
Order Operations
  case = Escalated

Payments & Risk
  escalation non ancora ricevuta
```

Per alcuni secondi entrambi gli stati possono essere veri.

La domanda non è:

> “siamo consistent o eventually consistent?”

La domanda è:

```text
quale inconsistenza temporanea è ammessa?
per quanto tempo?
chi può osservarla?
quale azione è vietata durante quella finestra?
come sappiamo che convergerà?
che cosa facciamo se non converge?
```

> **Eventual consistency è un contratto temporale di convergenza, non una scusa per rimandare la correctness.**

## Stato intermedio esplicito

Se una escalation è stata salvata localmente ma non ancora consegnata, nascondere questo fatto dietro un semplice:

```text
Escalated
```

può essere ambiguo.

Possiamo modellare separatamente:

```text
business state
Escalated

integration delivery state
Pending | Delivered | Delayed | DeadLettered
```

Questa separazione evita di confondere:

- significato del dominio;
- stato tecnico dell'integrazione.

L'operatore può così vedere:

> “l'escalation è stata accettata, ma la consegna a Payments è in ritardo.”

Molto meglio di una UI che mostra successo mentre il downstream non ha ricevuto nulla, o di una UI che fallisce l'intera azione soltanto perché il broker è momentaneamente indisponibile.

## Forward recovery prima della compensazione

Nei sistemi distribuiti la prima domanda non dovrebbe sempre essere:

> “come facciamo rollback di tutto?”

Spesso è più utile chiedere:

> “possiamo continuare verso uno stato valido?”

Per un publish fallito:

```text
retry
→ redelivery
→ reconciliation
```

può essere molto più sensato di annullare l'escalation dell'operatore.

Microsoft Compensating Transaction pattern sottolinea che compensation è domain-specific e che spesso bisogna preferire forward progress quando esiste una strada sicura. La guida recente cita anche casi in cui una decisione ad alto impatto o ambigua dovrebbe essere sospesa per human review invece di compensata automaticamente.

Fonte:

- [Microsoft Learn — Compensating Transaction pattern](https://learn.microsoft.com/azure/architecture/patterns/compensating-transaction)

## Compensation non è rollback

Supponiamo un processo futuro:

```text
1. approve refund
2. refund payment provider
3. update customer-visible state
4. send notification
```

Se il refund sul provider è già riuscito, non possiamo fare un semplice database rollback e fingere che non sia successo.

Potremmo dover:

- emettere una nuova operazione economica;
- aggiornare audit;
- notificare un essere umano;
- lasciare il processo in uno stato eccezionale;
- compensare soltanto alcuni passi.

La compensazione è una nuova business operation.

Ha:

- regole proprie;
- authorization;
- failure mode;
- idempotency;
- audit;
- possibili costi.

> **Una compensazione non cancella il passato. Produce un nuovo fatto che rende il sistema nuovamente accettabile.**

## Saga

Una saga gestisce un business process distribuito come sequenza di transazioni locali.

Ogni step:

1. modifica atomically il proprio stato locale;
2. provoca o abilita il passo successivo;
3. possiede, quando necessario, una compensazione.

Microsoft descrive due grandi stili:

- choreography;
- orchestration.

Fonte:

- [Microsoft Learn — Saga distributed transactions pattern](https://learn.microsoft.com/azure/architecture/patterns/saga)

Non useremo la saga come sinonimo di:

> “qualunque cosa abbia una queue”.

Il nostro primo `OperationalCaseEscalated` non è ancora una saga.

Abbiamo:

```text
un fatto locale
→ una consegna affidabile
→ un consumer downstream
```

Non esiste ancora un workflow multi-step con compensazioni che giustifichi quel modello.

## Choreography

In choreography non esiste necessariamente un coordinatore centrale del business process.

I servizi reagiscono agli eventi:

```text
OrderCreated
  ↓
Inventory reserves
  ↓ InventoryReserved
Payments authorizes
  ↓ PaymentAuthorized
Shipping prepares
```

Vantaggi possibili:

- autonomia dei componenti;
- meno coordinatore centrale;
- estensibilità tramite nuovi subscriber;
- buon fit per reaction indipendenti.

Costi:

- il workflow può diventare difficile da vedere;
- business rule distribuite;
- debugging end-to-end più complesso;
- event schema più critici;
- loop ed event storm;
- ownership del processo meno evidente.

Microsoft Choreography pattern evidenzia proprio rischi di schema evolution, ordering, idempotency, atomic publication ed emergent event chains.

Fonte:

- [Microsoft Learn — Choreography pattern](https://learn.microsoft.com/azure/architecture/patterns/choreography)

## Orchestration

In orchestration un componente esplicito conosce la progressione del workflow:

```text
RefundOrchestrator
  → validate
  → request refund
  → update order
  → notify
```

Vantaggi:

- stato del workflow visibile;
- ownership chiara;
- gestione più esplicita di retry, timeout e compensation;
- facile capire “dove siamo”.

Costi:

- orchestrator più complesso;
- rischio di centralizzare troppo dominio;
- coupling ai contract dei partecipanti;
- nuovo componente critico da rendere resiliente.

L'orchestrator non dovrebbe diventare:

> il luogo in cui tutte le business rule dell'azienda finiscono perché è comodo coordinare da lì.

Ogni servizio continua a possedere i propri invarianti.

L'orchestrator possiede la **progressione del processo**, non i dettagli interni di ogni dominio.

## Come scegliere

Non esiste una regola universale.

Una euristica utile:

### Choreography ha fit quando

- reactions sono relativamente indipendenti;
- non esiste un singolo workflow che deve essere spiegato passo per passo;
- aggiungere subscriber senza modificare producer è importante;
- eventual failure di un consumer non richiede una decisione centralizzata complessa.

### Orchestration ha fit quando

- la sequenza è business-significant;
- serve stato esplicito del workflow;
- esistono timeout e compensation multiple;
- alcuni step sono pivot o irreversibili;
- human intervention può entrare nel processo;
- audit end-to-end è importante.

## Pivot e punto di non ritorno

Nei workflow economici alcuni step cambiano il tipo di recovery possibile.

Esempio:

```text
Validate refund eligibility
→ compensabile / nessun side effect

Reserve internal amount
→ compensabile

Send provider refund
→ potrebbe diventare pivot

Notify customer
→ side effect esterno, ma non economico
```

Dopo il pivot, “tornare indietro” può non essere più una strategia valida.

Dobbiamo proseguire verso un nuovo stato coerente oppure escalare.

Questo è il motivo per cui i workflow distribuiti sono prima di tutto **domain modeling del failure**, non diagrammi di frecce.

## Human-in-the-loop non è una sconfitta

Esistono condizioni in cui l'automazione non ha abbastanza contesto per decidere correttamente.

Esempio futuro ESI:

```text
refund provider riuscito
ma order state non aggiornabile
perché ordine è entrato in dispute manuale
```

Un agente o workflow potrebbe proporre alternative.

Ma se la conseguenza economica o contrattuale è significativa, uno stato:

```text
ManualReviewRequired
```

può essere molto più sano di una compensazione automatica aggressiva.

Questo si collega direttamente alla tesi AI del libro.

L'autonomia deve essere proporzionale alla reversibilità e all'impatto.

## Reconciliation

Ogni sistema eventualmente consistente ha bisogno di rispondere a:

> come scopriamo che la convergenza non è avvenuta?

Non possiamo affidarci soltanto ai retry.

Una reconciliation può confrontare:

```text
Order Operations escalations accepted
vs
Payments escalations observed
```

usando ID stabili.

Se trova divergenze:

```text
missing downstream
→ republish / investigate

duplicate downstream
→ idempotency should neutralize; audit anomaly

unknown downstream record
→ investigate ownership or producer bug
```

La reconciliation è particolarmente importante per side effect economici e integrazioni che attraversano più sistemi.

## Eventual consistency e UX

Anche la UI deve capire il modello.

Bad UX:

```text
Success!
```

quando in realtà il sistema sa soltanto:

```text
local commit succeeded
```

Meglio distinguere:

```text
Escalation accepted
Delivery pending
```

oppure:

```text
Escalation delivered to Payments
```

La semantica deve seguire il sistema reale.

Non nasconderlo per sembrare più semplice.

## Il nostro scenario ESI

Per Order Operations decidiamo:

- niente saga per il primo evento;
- niente orchestrator general-purpose;
- outbox per publication reliability;
- Payments consumer idempotente;
- delivery state osservabile;
- reconciliation periodica come guardrail;
- human escalation se un messaggio importante supera il business timeout o finisce in DLQ.

Quando introdurremo un vero command di refund o un workflow multi-domain, rivaluteremo orchestration/saga sulla base del comportamento funzionale.

Non anticipiamo la soluzione.

## Regola

Se un workflow distribuito può fallire a metà, il design deve descrivere almeno:

```text
stati intermedi
retry
idempotency
progress tracking
business timeout
compensation
irreversible step
reconciliation
manual intervention
```

Se il diagramma mostra soltanto il happy path, non abbiamo ancora progettato il workflow.