## Cache: una copia con una data di scadenza

La cache viene spesso presentata come una ottimizzazione semplice:

> “Metti Redis davanti al database.”

In realtà una cache modifica il modello dei dati.

Introduce almeno una nuova domanda:

> **quanto tempo siamo disposti a mostrare una copia che potrebbe non essere aggiornata?**

Redis documenta esplicitamente il pattern cache-aside come una strategia in cui l'applicazione legge prima dalla cache, ricade sul primary in caso di miss e invalida la cache sulle write. La documentazione collega direttamente TTL e tolleranza alla staleness.

Fonte:

- [Redis Docs — Cache-aside](https://redis.io/docs/latest/develop/use-cases/cache-aside/)

Quindi la cache non elimina il problema della consistency.

Lo rende un compromesso esplicito.

## Cache-aside

La forma tipica è:

```text
read
 ↓
cache hit? ── sì → return
 ↓ no
primary store
 ↓
cache fill
 ↓
return
```

Sulla write:

```text
update primary
↓
invalidate cache
```

È un pattern relativamente semplice.

Ma anche qui esistono failure mode:

- l'invalidation fallisce;
- una richiesta concorrente riempie la cache con il valore vecchio;
- molte entry scadono insieme;
- una key calda genera stampede;
- il cache layer è indisponibile;
- un bug nella key mescola tenant diversi;
- TTL troppo lungo mostra dati stale;
- TTL troppo corto elimina gran parte del beneficio.

La cache è un sistema.

Non una annotazione.

## La freshness deve appartenere al requisito

Supponiamo che Operations chieda:

> “La lista deve essere veloce.”

Non basta per introdurre caching.

Dobbiamo sapere:

- qual è la latency attuale?
- qual è il target?
- quale parte della query costa?
- quante letture sono ripetitive?
- quale staleness è accettabile?
- cosa succede dopo una presa in carico?

Per esempio potremmo accettare:

```text
problem summary → fino a 30 secondi di staleness
assignment state → read-your-writes immediato
```

Sono due proprietà diverse dentro la stessa pagina.

Questo potrebbe portarci a non cacheare tutto nello stesso modo.

## Cache non autorevole

Una regola forte per il libro sarà:

> **la cache non deve diventare la source of truth soltanto perché è più veloce da leggere.**

Se perdiamo Redis e non sappiamo ricostruire il dato, non avevamo una cache.

Avevamo un datastore primario non dichiarato.

Questo non significa che un in-memory store non possa mai essere autorevole.

Significa che la responsabilità deve essere intenzionale.

Se lo usiamo come cache, dobbiamo poter tollerare:

- eviction;
- expiration;
- rebuild;
- cold start.

## Cache stampede e feedback loop

Una cache può proteggere il primary in condizioni normali e amplificare un incidente in condizioni anomale.

Immaginiamo:

```text
hot key expires
→ 500 request vedono miss
→ 500 query arrivano al database
→ database rallenta
→ request restano aperte più a lungo
→ aumenta la concurrency
→ database rallenta ancora
```

Questo è un feedback loop.

Redis documenta esplicitamente il rischio di cache stampede e tecniche di mitigazione.

Il punto architetturale è che un componente introdotto per performance può modificare il failure domain.

## Derived data: molto più della cache

La cache è soltanto una forma di dato derivato.

Altre forme sono:

- materialized view;
- search index;
- read model;
- reporting aggregate;
- data warehouse;
- data lake transformation;
- feature vector;
- embedding;
- recommendation feature;
- fraud score.

Per ogni dato derivato dobbiamo poter rispondere:

```text
source
Da quali dati autorevoli deriva?

semantics
Quale trasformazione applica?

freshness
Quanto può essere indietro?

rebuild
Possiamo ricostruirlo?

versioning
Con quale versione delle regole è stato prodotto?

failure
Come sappiamo che è stale o incompleto?
```

Queste domande diventeranno ancora più importanti nei capitoli Data & AI.

## La duplicazione può ridurre coupling runtime

Duplicare dati viene spesso trattato come un male assoluto.

Non lo è.

Supponiamo che Order Operations debba chiamare live:

```text
Orders
Payments
Shipping
```

per ogni riga della lista.

Potremmo avere un journey molto fresco ma fortemente accoppiato alla latency e availability di tre componenti.

Una proiezione locale potrebbe invece contenere:

```text
order_id
order_status
payment_status
shipment_status
problem_category
source_updated_at
projection_updated_at
```

Ora la query operativa è semplice.

Il costo si sposta su:

- propagation;
- staleness;
- rebuild;
- reconciliation;
- pipeline observability.

È un trade-off reale.

> **Il decoupling runtime spesso si paga con data synchronization.**

## Quando una copia diventa pericolosa

Una copia è pericolosa quando nessuno sa più che è una copia.

Segnali tipici:

- consumer che la modificano direttamente;
- business rule duplicate nella projection;
- campi senza source dichiarata;
- assenza di timestamp di aggiornamento;
- impossibilità di ricostruire la derivazione;
- mismatch trattati con “last write wins” senza semantica;
- il team usa la copia per correggere l'originale manualmente.

A quel punto abbiamo creato due sistemi concorrenti.

## ESI: non introduciamo Redis nel Capitolo 10

Il Capitolo 6 aveva già rinviato Redis per mancanza di evidenza.

Questa decisione resta valida.

Il fatto che ora stiamo parlando di data architecture non crea un nuovo requisito.

Order Operations userà inizialmente query e index ragionevoli sul datastore relazionale.

Se misure reali mostreranno:

- lookup ripetitivi molto costosi;
- primary sotto pressione;
- latency incompatibile con il target;

allora la cache tornerà tra le alternative.

Ma entrerà insieme a:

- staleness budget;
- invalidation policy;
- tenant-safe key design;
- fallback behavior;
- metriche di hit/miss;
- stampede protection quando necessaria.

Non insieme alla frase:

> “Redis è veloce.”

## Prepariamo invece il concetto di projection

La decisione più interessante per Order Operations non è oggi la cache.

È capire se in futuro la vista operativa meriterà una projection locale.

Non la implementiamo ancora.

La Data Ownership Map però distinguerà già:

```text
Authoritative data
Derived operational data
Local-owned operational data
```

Questo ci permetterà di introdurre una projection in futuro senza ridefinire l'ownership nel mezzo di un incidente di performance.

> **Duplicare il dato può essere una ottimizzazione. Duplicare l'autorità è quasi sempre un problema.**