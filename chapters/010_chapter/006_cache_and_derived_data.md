## Cache: una copia con una data di scadenza

La cache viene spesso introdotta con una frase semplice: “mettiamo Redis davanti al database”. Ma una cache non è un acceleratore neutrale. Introduce una seconda rappresentazione del dato e, con essa, una nuova domanda architetturale: **quanto tempo siamo disposti a mostrare una copia che potrebbe non essere aggiornata?**

Redis documenta il pattern cache-aside come una strategia in cui l’applicazione legge prima dalla cache, ricade sul primary in caso di miss e aggiorna o invalida la cache quando cambia il dato. La stessa documentazione collega TTL e policy di caching alla tolleranza verso la staleness.

Fonte:

- [Redis Docs — Cache-aside](https://redis.io/docs/latest/develop/use-cases/cache-aside/)

Quindi la cache non elimina il problema della consistency. Lo rende un compromesso esplicito.

## Cache-aside e failure behavior

La forma di base è intuitiva:

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

Ma il comportamento reale include anche invalidation fallita, entry vecchie riscritte da richieste concorrenti, expiration simultanee, hot key, cache indisponibile e key design che può perfino mescolare tenant differenti se il boundary non è espresso correttamente.

Il punto è che la cache diventa parte del sistema. Se esiste, deve avere failure behavior, metriche e ownership. Non è una annotazione di performance.

## La freshness appartiene al requisito

“La lista deve essere veloce” non è un requisito sufficiente per introdurre caching. Prima dobbiamo sapere qual è la latency attuale, qual è il target, quale parte della query costa, quanto traffico ripetitivo esiste e soprattutto quale staleness sia accettabile.

La stessa pagina può contenere dati con esigenze diverse. Il summary di un problema potrebbe tollerare qualche secondo di ritardo, mentre l’assignment effettuato dall’operatore può richiedere read-your-writes immediato. Cacheare tutto con la stessa policy perché “sta nella stessa response” sarebbe una scelta di implementazione che appiattisce semantiche differenti.

## La cache non è autorevole soltanto perché è veloce

Se Redis scompare e il sistema non sa ricostruire il dato, probabilmente non stavamo usando una cache: stavamo usando un datastore primario non dichiarato.

Questo non significa che un in-memory store non possa mai essere autorevole. Significa che la responsabilità deve essere intenzionale. Quando lo chiamiamo cache, eviction, expiration, rebuild e cold start devono essere comportamenti compatibili con il sistema.

## Cache stampede: una ottimizzazione può cambiare il failure domain

Una hot key che scade può trasformare centinaia di cache miss simultanei in centinaia di query verso il primary. Se il database rallenta, le request rimangono aperte più a lungo, cresce la concurrency e il sistema può entrare in un feedback loop.

Redis documenta questo rischio e le relative strategie di mitigazione. La lezione architetturale è più ampia: un componente introdotto per migliorare la performance può modificare il modo in cui un incidente si propaga.

## Derived data: copie costruite per un lavoro specifico

La cache è soltanto una delle forme di dato derivato. Materialized view, search index, read model, reporting aggregate, warehouse, feature vector, embedding e fraud score condividono una proprietà: non sono necessariamente la fonte autorevole del significato che rappresentano.

Per questo ogni dato derivato importante deve poter rispondere a poche domande essenziali:

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

Queste domande diventano ancora più importanti quando il dato derivato alimenta modelli AI o decisioni automatizzate, perché la distanza tra source e consumer può crescere rapidamente.

## Duplicare dati può ridurre coupling runtime

Order Operations potrebbe leggere live da Orders, Payments e Shipping per costruire ogni vista. Questa soluzione preserva freshness ma lega il journey alla latency e alla availability di tre capability.

Una projection locale potrebbe invece mantenere `order_status`, `payment_status`, `shipment_status`, `problem_category` e timestamp di source/projection. La query diventerebbe semplice e il runtime coupling diminuirebbe, ma il costo si sposterebbe su propagation, staleness, reconciliation, rebuild e pipeline observability.

È un trade-off, non un miglioramento gratuito:

> **il decoupling runtime spesso si paga con data synchronization.**

## Quando una copia diventa pericolosa

Il rischio cresce quando una copia smette di essere riconosciuta come tale. Consumer che la modificano direttamente, business rule duplicate, campi senza source, assenza di freshness evidence o mismatch risolti con un generico “last write wins” sono segnali che due rappresentazioni stanno diventando due sistemi concorrenti.

La Data Ownership Map serve anche a prevenire questa deriva.

## ESI: Redis resta fuori, la projection resta un’opzione

Il Capitolo 6 aveva già rinviato Redis per mancanza di evidenza e il Capitolo 10 non crea magicamente un nuovo requisito. Order Operations continuerà quindi, per ora, a usare query e index ragionevoli sul datastore relazionale.

Se misure reali mostreranno lookup ripetitivi costosi, pressione sul primary o latency incompatibile con il target, la cache tornerà tra le alternative. Entrerà però insieme a uno staleness budget, una invalidation policy, key design tenant-safe, fallback behavior e metriche utili; non insieme alla frase “Redis è veloce”.

La possibilità più interessante rimane una futura projection operativa. Non la implementiamo ancora, ma la Data Ownership Map distingue già authoritative data, derived operational data e dati posseduti localmente. Questo ci consente di aggiungere una projection in futuro senza ridiscutere nel mezzo di un incidente chi possieda la verità.

> **Duplicare la rappresentazione può essere utile. Duplicare l’autorità è quasi sempre un problema.**