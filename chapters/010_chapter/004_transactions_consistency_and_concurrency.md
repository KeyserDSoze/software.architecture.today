## Transazioni: quali fatti devono diventare veri insieme

Una transazione non è soltanto una feature del database.

È una dichiarazione sul dominio:

> **questi cambiamenti devono essere osservati come una unità coerente oppure non devono diventare visibili affatto.**

Quando il boundary transazionale coincide bene con il boundary di una responsabilità, il sistema è più facile da ragionare.

Quando invece una singola operazione attraversa molti owner e molti datastore, la domanda diventa più difficile.

## Atomicità non significa “metti tutto nella stessa transazione”

Supponiamo che un operatore prenda in carico un caso.

Vogliamo garantire che:

```text
case.assigned_to = operatorA
```

non venga contemporaneamente sovrascritto in silenzio da `operatorB`.

Questa è una esigenza di concorrenza e atomicità locale.

Potremmo risolverla con:

- optimistic concurrency;
- compare-and-set;
- row lock;
- vincolo e update condizionale;
- serializable transaction, se giustificata.

La scelta concreta dipende dal datastore e dal carico.

Ma la business rule viene prima:

> **una presa in carico concorrente deve produrre un risultato deterministico e osservabile.**

## Isolation: il database non elimina la concorrenza

PostgreSQL usa MVCC per fornire viste consistenti dei dati e ridurre il conflitto tra reader e writer. Offre diversi livelli di isolamento e strumenti espliciti di locking quando necessario.

Fonte primaria:

- [PostgreSQL 18 — Concurrency Control / MVCC](https://www.postgresql.org/docs/18/mvcc-intro.html)

Questo non significa che possiamo ignorare le race condition applicative.

Due transazioni possono essere individualmente valide e produrre insieme un risultato di business sbagliato se non abbiamo modellato correttamente l'invariante.

Per esempio:

```text
saldo disponibile: 100

T1 legge 100
T2 legge 100
T1 autorizza 80
T2 autorizza 80
```

Il problema non si risolve dicendo genericamente “il database è ACID”.

Dobbiamo sapere:

- quale dato protegge l'invariante;
- quale livello di isolamento serve;
- se possiamo usare una condizione atomica;
- quale contesa accettiamo;
- che cosa deve succedere al conflitto.

## Consistency è una parola sovraccarica

“Consistente” può significare cose molto diverse.

Per un database relazionale può riferirsi alla preservazione di vincoli durante una transazione.

In un sistema replicato può riguardare quando una write diventa visibile alle copie.

Nel prodotto può significare che un utente non vede uno stato impossibile.

Quindi eviteremo frasi come:

> “Ci serve strong consistency.”

senza specificare **per quale decisione**.

Meglio:

```text
Dopo che l'operatore prende in carico un caso,
una seconda assegnazione concorrente non deve sostituirla silenziosamente.
```

oppure:

```text
Dopo la conferma di un refund,
la stessa intenzione economica non deve produrre un secondo refund.
```

Sono requisiti verificabili.

## Read-your-writes e staleness

Non tutti i dati hanno bisogno della stessa visibilità temporale.

Dopo un assignment, l'operatore probabilmente si aspetta di vedere immediatamente il nuovo assegnatario.

Un dashboard aggregato per il management potrebbe tollerare alcuni minuti di ritardo.

Una vista analitica giornaliera può tollerare ore.

Quindi possiamo avere, nello stesso prodotto:

```text
assignment state     → read-your-writes richiesto
payment summary      → staleness limitata e dichiarata
management analytics → eventual consistency più ampia
```

La consistency non dovrebbe essere scelta una volta per l'intero sistema.

Va collegata al journey e al costo dell'errore.

## Replica: availability e read scale comprano synchronization problems

PostgreSQL documenta chiaramente il trade-off tra replica sincrona e asincrona: una soluzione sincrona può ridurre il rischio di perdita al failover ma aggiunge latenza e dipendenza dalla replica; una soluzione asincrona riduce il costo sul write path ma può servire dati più vecchi e perdere le transazioni non ancora propagate in alcuni scenari di failover.

Fonte primaria:

- [PostgreSQL 18 — High Availability, Load Balancing, and Replication](https://www.postgresql.org/docs/18/high-availability.html)

Questo ci dà una regola importante:

> **una replica non è una copia gratuita. È una nuova relazione temporale da governare.**

Se Order Operations legge da una read replica, dobbiamo decidere:

- quanta replica lag è accettabile?
- dopo una modifica dobbiamo forzare una lettura dal primary?
- che cosa mostriamo quando il lag supera la soglia?
- il consumer sa distinguere `last known` da `current`?

Senza queste decisioni, “aggiungiamo una replica per scalare” è soltanto mezza architettura.

## Transazione locale, workflow distribuito

Più avanti nel libro affronteremo saga, outbox ed eventual consistency nei sistemi distribuiti.

Qui basta fissare un principio.

Se una business operation richiede:

```text
Orders DB commit
+
Payment provider call
+
Shipping update
```

non possiamo fingere che una normale transazione SQL renda tutto atomico.

La rete, il provider e gli owner esterni introducono failure indipendenti.

Dovremo modellare:

- idempotenza;
- retry;
- stato intermedio;
- compensazione quando appropriata;
- reconciliation;
- observability.

La prima domanda è sempre:

> **quale fatto deve essere atomico davvero e quale coordinamento può essere esplicito?**

## Concorrenza come parte dell'analisi funzionale

Questo tema ci riporta a una tesi importante del Capitolo 2.

La business analysis non può descrivere soltanto happy path sequenziali.

Per operazioni significative deve chiedere:

- che succede se due utenti fanno la stessa cosa?
- che succede se la richiesta viene ripetuta?
- quale stato vince?
- il conflitto è errore, merge o seconda operazione valida?
- quale evidenza deve vedere l'utente?

Un analyst, developer o architect che non sa leggere questi scenari rischia di lasciare al database o al framework una decisione di business.

## ESI: assignment come primo invariant concorrente

Per Order Operations definiamo un invariant semplice:

```text
Un caso non assegnato può essere preso in carico da un operatore autorizzato.
Se due operatori tentano contemporaneamente,
una sola operazione deve vincere.
L'altra deve ricevere un conflitto osservabile.
```

Una possibile implementazione futura potrebbe essere un update condizionale:

```sql
UPDATE operational_case
SET assigned_to = :operator_id,
    assigned_at = now()
WHERE id = :case_id
  AND assigned_to IS NULL;
```

Il punto non è il frammento SQL.

Il punto è che **l'invariante è stato deciso prima dell'implementazione**.

Il database ci aiuta a proteggerlo.

Non lo inventa per noi.