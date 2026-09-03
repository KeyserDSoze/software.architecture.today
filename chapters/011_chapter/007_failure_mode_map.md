## Failure Mode Map

Quando un sistema diventa distribuito, il diagramma del happy path perde rapidamente valore se non rappresentiamo anche i modi in cui il flusso può smettere di progredire.

Per questo introduciamo un nuovo artefatto operativo:

> **Failure Mode Map**

Non è un catalogo di tutti gli errori possibili.

È una mappa dei failure mode che cambiano una decisione di architettura, una promessa funzionale o una responsabilità operativa.

## Che cosa deve rendere visibile

Per ogni critical flow la mappa dovrebbe aiutarci a rispondere a:

```text
che cosa può fallire?
come lo osserviamo?
che cosa vede il caller?
quale stato rimane persistito?
possiamo fare retry?
chi è responsabile del retry?
la retry è idempotente?
quanto possiamo aspettare?
serve compensazione?
quando finisce in DLQ?
come si recupera?
chi è owner del recovery?
quale blast radius può produrre?
```

## Template minimale

```markdown
# Failure Mode Map

## Critical flow

## Dependencies

## Failure modes

| Step | Failure | Observed by | Persisted state | Retry? | Idempotency | User impact | Recovery | Owner |
|---|---|---|---|---|---|---|---|---|

## Time budgets

## Retry policy

## Ordering requirements

## Backpressure policy

## Dead-letter policy

## Reconciliation

## Compensation / irreversible steps

## Manual intervention

## Observability

## Open questions
```

Non serve riempire ogni cella per ogni funzione.

Serve farlo per i punti in cui una risposta sbagliata genera rischio significativo.

## Partire dal journey, non dal componente

Prendiamo il nuovo flusso ESI:

```text
Operator escalates case
→ local commit
→ outbox
→ publisher
→ broker
→ Payments consumer
→ Payments local commit
```

La domanda non è:

> “quali failure mode ha PostgreSQL?”

ma:

> “in quali punti il journey può interrompersi o diventare ambiguo?”

Per esempio:

```text
1. local validation fails
2. local transaction conflicts
3. local commit succeeds
4. publisher cannot reach broker
5. broker accepts but publisher loses ack
6. consumer receives duplicate
7. consumer rejects schema
8. Payments database unavailable
9. consumer commits but loses broker ack
10. message exhausts retries
11. delivery exceeds business timeout
12. reconciliation detects mismatch
```

Questa sequenza è molto più utile di una lista generica di errori HTTP.

## Esempio di mappa

| Step | Failure | Stato persistito | Retry | Impatto | Recovery |
|---|---|---|---|---|---|
| local transaction | serialization conflict | nessun nuovo stato | sì, bounded | operatore attende/riprova | retry applicativo sicuro |
| outbox publisher | broker unavailable | case escalato + outbox pending | sì | delivery ritardata | retry con backoff |
| publish acknowledgement | ack perso | outbox ancora pending, broker forse ha msg | sì | possibile duplicato tecnico | same messageId + idempotent consumer |
| consumer | Payments DB unavailable | broker conserva/redeliver | sì | delivery lag | bounded retry / DLQ |
| consumer validation | schema unsupported | msg non processato | no automatico | integration failure | DLQ + alert |
| consumer commit + ack loss | Payments ha effetto, broker redeliver | downstream già aggiornato | sì | duplicato tecnico | dedup escalationId |
| retries exhausted | persistent failure | DLQ | no automatico | business delivery failed/delayed | manual or controlled redrive |

Questa tabella non risolve il sistema.

Rende impossibile fingere di non vedere le decisioni.

## Failure mode ≠ exception type

Un'eccezione tecnica può rappresentare failure mode differenti.

Esempio:

```text
TimeoutException
```

può significare:

- downstream non raggiunto;
- downstream sovraccarico;
- risposta persa dopo side effect;
- proxy timeout;
- DNS degradation;
- thread starvation locale.

La Failure Mode Map non dovrebbe fermarsi al nome dell'exception.

Deve descrivere ciò che conta per il comportamento.

## Stato conosciuto vs stato ignoto

Una colonna particolarmente utile è:

```text
Known outcome?
```

Possiamo distinguere:

### Known failure

```text
validation error
→ sappiamo che side effect non è avvenuto
```

### Known success

```text
consumer commit confermato
→ sappiamo che side effect è persistito
```

### Unknown outcome

```text
timeout dopo invio
→ non sappiamo se side effect è avvenuto
```

Gli unknown outcome sono i punti in cui idempotency e reconciliation diventano più importanti.

## Time budget

Il failure design deve includere il tempo.

Per esempio:

```text
operator request budget       2 s
outbox publish expected       30 s
business delivery target      5 min
warning threshold             2 min
manual escalation threshold   10 min
DLQ retention                 policy-defined
```

Questi numeri sono esempi didattici.

La struttura invece è importante.

Senza time budget non sappiamo quando:

- un retry è ancora utile;
- una queue è troppo indietro;
- un degrado diventa incidente;
- passare a manual intervention;
- informare l'utente.

## Failure budget e retry budget

Possiamo pensare a due budget differenti.

### Retry budget tecnico

Quanto tentiamo prima di smettere di colpire la dipendenza?

### Business delay budget

Quanto può rimanere incompleto il processo prima che il ritardo cambi il comportamento richiesto?

Un messaggio potrebbe avere ancora retry tecnici disponibili ma avere già superato il business timeout.

Esempio:

```text
retry può continuare
ma
operator deve essere avvisato
```

Questo è un design più ricco del semplice `maxRetries=5`.

## Backpressure nella mappa

Per ogni consumer importante annotiamo:

```text
concurrency limit
prefetch / batch size
queue depth signal
oldest-message-age signal
scaling rule
producer throttling
```

Non per micro-ottimizzare prima di misurare.

Per sapere **dove si trova il freno**.

Se nessun componente può rallentare il sistema, probabilmente il failure mode è una saturazione incontrollata.

## Retry ownership

Una delle colonne più importanti è:

```text
Retry owner
```

Può essere:

- client SDK;
- application service;
- broker;
- consumer framework;
- workflow engine;
- operator umano.

Se non lo scriviamo, rischiamo retry sovrapposti.

Esempio:

```text
SDK 3 retry
× API layer 3 retry
× message consumer 5 delivery attempts
```

Il team vede “3 retry”.

Il sistema vede un amplificatore.

## Dead-letter policy

Una DLQ deve comparire nella Failure Mode Map con:

```text
entry condition
owner
alert
retention
payload/security policy
redrive procedure
business consequence
```

Una riga:

```text
on failure → DLQ
```

non è una policy.

## Reconciliation

La Failure Mode Map deve descrivere anche i controlli fuori dal request/message path.

Per Order Operations:

```text
accepted escalations
MINUS
confirmed downstream escalations
=
reconciliation candidates
```

Questa verifica può trovare failure che telemetry locale non ha rilevato.

Reconciliation è particolarmente importante quando:

- esistono side effect esterni;
- le acknowledgement possono perdersi;
- ci sono retry;
- il processo dura a lungo;
- più sistemi mantengono stati correlati.

## Compensation

Non ogni riga deve avere una compensazione.

Anzi, forzare una compensation dove basta retry crea complessità inutile.

La mappa dovrebbe classificare:

```text
retryable
forward recoverable
compensable
irreversible
manual review
```

Questo produce una visione molto più utile della generica colonna:

```text
rollback: yes/no
```

## Observability contract

La Failure Mode Map prepara il Capitolo 15 sull'observability.

Per ora annotiamo almeno i segnali necessari:

```text
outbox_pending_total
outbox_oldest_age
publish_attempt_total
publish_failure_total
consumer_lag
consumer_duplicate_total
dlq_depth
dlq_oldest_age
reconciliation_mismatch_total
business_delivery_latency
```

I nomi concreti cambieranno.

Il principio no:

> **se una recovery strategy esiste soltanto nella documentazione ma non possiamo osservare quando deve attivarsi, non è ancora una strategia operativa.**

## Failure Mode Map e AI

Un agente AI può essere molto utile nel costruire una prima mappa.

Possiamo chiedergli di analizzare:

- call graph;
- retry policy;
- queue configuration;
- catch block;
- transaction boundary;
- outbox publisher;
- consumer ack;
- DLQ;
- timeout;
- circuit breaker;
- idempotency store.

E può proporre failure sequence come:

```text
commit succeeds
publish succeeds
mark published fails
process restarts
```

Questa è un'ottima forma di adversarial review.

Ma il repository non sa automaticamente:

- quanto ritardo il business tollera;
- quali side effect sono irreversibili;
- quando serve human approval;
- quali dati non possono finire nel broker;
- chi è responsabile del redrive.

Queste informazioni arrivano dal contesto.

## Operational artifact

Da questo capitolo, ogni flusso distribuito significativo dovrebbe avere almeno una Failure Mode Map proporzionata al rischio.

Non serve un documento enorme.

Serve poter rispondere a una domanda:

> **se questa freccia non funziona come nel diagramma, sappiamo ancora che cosa succede al sistema?**