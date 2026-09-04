## Transazioni: quali fatti devono diventare veri insieme

Una transazione non è soltanto una feature del database. È una dichiarazione sul dominio: **questi cambiamenti devono essere osservati come una unità coerente oppure non devono diventare visibili affatto**.

Questa prospettiva cambia il modo in cui discutiamo atomicità. La domanda non è “quale isolation level usiamo?” ma “quale invariant stiamo cercando di proteggere?”. Solo dopo scegliamo il meccanismo.

## Atomicità locale, significato di business

Supponiamo che un operatore prenda in carico un caso. Se due operatori tentano quasi nello stesso momento, il sistema non deve sostituire silenziosamente una scelta con l’altra. Una sola presa in carico deve vincere e l’altra deve ricevere un conflitto osservabile.

Potremmo proteggere questa regola con optimistic concurrency, compare-and-set, row lock, update condizionale o, in alcuni casi, con un isolation level più forte. La scelta dipende dal datastore e dalla contesa attesa. L’invariante, però, viene prima:

> **una presa in carico concorrente deve produrre un risultato deterministico e osservabile.**

## Il database non elimina la concorrenza

PostgreSQL usa MVCC per fornire viste consistenti e ridurre il conflitto fra reader e writer, offrendo più livelli di isolamento e meccanismi espliciti di locking.

Fonte primaria:

- [PostgreSQL 18 — Concurrency Control / MVCC](https://www.postgresql.org/docs/18/mvcc-intro.html)

Questa capacità non sostituisce il modello di business. Due transazioni possono essere individualmente valide e produrre insieme un risultato scorretto se l’invariante non è stato espresso.

Il classico esempio è un saldo disponibile letto contemporaneamente da due operazioni che autorizzano entrambe una spesa compatibile con il valore osservato ma incompatibile tra loro. Dire “il database è ACID” non risolve il problema. Dobbiamo sapere quale dato protegga l’invariante, quale concorrenza sia ammessa e che cosa debba accadere in caso di conflitto.

## Consistency: specificare per quale decisione

“Ci serve strong consistency” è spesso un requisito troppo vago. La consistency può riferirsi a vincoli transazionali, visibilità tra repliche, ordine di eventi o semplicemente al fatto che l’utente non debba vedere uno stato impossibile.

È molto più utile scrivere:

```text
Dopo che un operatore prende in carico un caso,
una seconda assegnazione concorrente non deve sostituirla silenziosamente.
```

oppure:

```text
La stessa intenzione economica di refund
non deve produrre due effetti economici a causa di un retry.
```

Queste frasi descrivono comportamento verificabile. “Strong consistency” da sola no.

## La stessa applicazione può avere consistency differenti

Dopo un assignment l’operatore si aspetta normalmente read-your-writes immediato. Un dashboard di management può tollerare qualche minuto di ritardo. Un report mensile può tollerare ore. Un fraud signal usato per bloccare una transazione, invece, può avere requisiti molto più stretti.

La consistency non dovrebbe quindi essere scelta una volta per l’intero sistema. Va legata al journey e al costo di una decisione presa su dati vecchi.

## Replica: più capacità in cambio di una relazione temporale

PostgreSQL documenta il trade-off tra replica sincrona e asincrona: la prima può ridurre il rischio di perdita al failover ma aggiunge latenza e dipendenza dalla replica; la seconda riduce il costo sul write path ma introduce staleness e può perdere transazioni non ancora propagate in alcuni scenari di failover.

Fonte primaria:

- [PostgreSQL 18 — High Availability, Load Balancing, and Replication](https://www.postgresql.org/docs/18/high-availability.html)

Quindi una read replica non è una copia gratuita. È una nuova relazione temporale da governare. Se Order Operations la usasse, dovremmo decidere quanta replica lag sia accettabile, come gestire read-after-write, che cosa mostrare durante un lag e quando ricadere sul primary.

## Transazione locale e workflow distribuito non sono la stessa cosa

Quando una business operation attraversa Orders, un payment provider e Shipping, una normale transazione SQL non può rendere atomiche anche la rete e i sistemi esterni. I failure indipendenti costringono a modellare idempotenza, retry, stato intermedio, compensazione quando appropriata, reconciliation e observability.

La domanda utile resta:

> **quale fatto deve essere atomico davvero e quale coordinamento può essere reso esplicito?**

Questa distinzione evita di allargare una transaction boundary oltre ciò che il sistema può realmente garantire.

## La concorrenza appartiene anche all’analisi funzionale

L’analisi funzionale non può fermarsi all’happy path. Per ogni azione significativa deve chiedere che cosa accada se due utenti agiscono insieme, se la richiesta viene ritentata, se esistono due intenti validi o se uno stato cambia mentre l’operazione è in corso.

Queste non sono domande “da database”. Sono parte del comportamento del prodotto. Se non le decide il team, verranno decise accidentalmente da timing, framework o implementazione.

## ESI: il primo invariant concorrente

Per Order Operations formalizziamo la regola dell’assegnazione così:

```text
Un caso non assegnato può essere preso in carico da un operatore autorizzato.
Se due operatori tentano contemporaneamente, una sola operazione deve vincere.
L’altra deve ricevere un conflitto osservabile.
```

Una possibile implementazione futura potrebbe essere un update condizionale:

```sql
UPDATE operational_case
SET assigned_to = :operator_id,
    assigned_at = now()
WHERE id = :case_id
  AND assigned_to IS NULL;
```

Il frammento SQL non è la decisione architetturale. La decisione è avere espresso l’invariante prima dell’implementazione. Il database ci aiuta a proteggerlo; non lo inventa per noi.