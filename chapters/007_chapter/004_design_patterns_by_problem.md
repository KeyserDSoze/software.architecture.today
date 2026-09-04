## Design pattern: partire dalla variazione, non dal nome

I pattern classici di design restano utili perché molti problemi locali non sono cambiati.

Cambiano linguaggi, framework e strumenti, ma continuiamo ad avere bisogno di variare comportamento e comporre responsabilità, isolare dipendenze e notificare cambiamenti, tradurre contratti e controllare l'accesso alle risorse. È questa continuità dei problemi, non la longevità dei nomi, a rendere alcuni pattern ancora utili.

Il modo più utile di studiarli è partire da queste esigenze.

### Quando varia il comportamento

Se una parte del comportamento cambia indipendentemente dal resto, possiamo volerla rendere esplicita.

La **Strategy** è utile quando esistono davvero più politiche intercambiabili.

Per esempio, Order Operations potrebbe in futuro avere regole di calcolo della data di consegna diverse per mercato o corriere.

Se oggi esiste una sola regola semplice, introdurre subito una gerarchia di strategy potrebbe non comprare nulla.

Quando una seconda o terza variante reale compare, il pattern può diventare naturale.

Il punto non è anticipare ogni possibile variazione.

È riconoscere quando una variazione ha già iniziato a esercitare pressione sul design.

### Quando varia la costruzione

Factory, Builder e Abstract Factory rispondono a forme diverse dello stesso problema: la costruzione di un oggetto o di una famiglia di oggetti è abbastanza complessa da meritare una responsabilità separata.

Se creare un oggetto significa semplicemente:

```ts
const order = new Order(id, customerId);
```

una factory dedicata potrebbe essere rumore.

Se la costruzione richiede invarianti, selezione di subtype, configurazioni multiple o sequenze non banali, centralizzarla può ridurre errori.

Il pattern emerge dalla complessità della costruzione, non dal desiderio di evitare `new`.

### Quando dobbiamo tradurre un mondo in un altro

Adapter è uno dei pattern più utili nei sistemi reali.

Non perché “disaccoppia” genericamente, ma perché protegge un confine semantico.

Supponiamo che un provider esterno restituisca:

```json
{
  "shipment_state": "IN_TRANSIT",
  "eta_epoch": 1788451200
}
```

Il nostro dominio potrebbe voler lavorare con:

```ts
interface ShipmentStatus {
  status: "preparing" | "shipped" | "delivered";
  estimatedDelivery?: Date;
}
```

L'Adapter non è soltanto conversione di formato.

È il punto in cui decidiamo come il linguaggio esterno entra nel nostro sistema.

Qui possiamo normalizzare errori, semantica, timeout e capability.

### Quando vogliamo aggiungere comportamento senza modificare il nucleo

Decorator e middleware possono essere utili per responsabilità trasversali come logging, caching, tracing o authorization.

Ma anche qui bisogna osservare il costo.

Una pipeline di dodici middleware può rendere impossibile capire dove venga modificata una request.

Composizione non significa invisibilità.

Dovremmo poter ricostruire l'ordine e le responsabilità della pipeline.

### Quando molti oggetti devono reagire a un cambiamento

Observer è un'idea semplice che appare in moltissime forme: callback, event emitter, reactive stream, domain event.

Il vantaggio è ridurre coupling diretto tra chi produce un cambiamento e chi reagisce.

Il costo è che il flusso diventa meno lineare.

Quando leggiamo:

```text
OrderConfirmed
```

potrebbero reagire inventory, email, analytics e shipping.

La sorgente non necessariamente conosce tutti i consumer.

Questo è utile, ma aumenta la necessità di discoverability e observability.

### Quando centralizziamo accesso a un oggetto o servizio

Proxy può introdurre lazy loading, remote access, caching, authorization o instrumentation.

Ma un proxy trasparente può nascondere differenze operative importanti.

Una chiamata locale e una chiamata remota non hanno le stesse failure mode.

Se il proxy rende invisibile la rete, può rendere invisibili anche latency, timeout e partial failure.

### Pattern come linguaggio, non come struttura obbligatoria

Due team possono risolvere lo stesso problema con implementazioni diverse senza che uno dei due sia “meno corretto”.

In TypeScript una Strategy può essere una semplice funzione:

```ts
export type PricingPolicy = (order: Order) => Money;
```

Non serve necessariamente una gerarchia di classi.

Il pattern descrive la relazione tra responsabilità.

Il linguaggio decide come esprimerla nel modo più idiomatico.

> **Conoscere il pattern significa riconoscere la forza che lo rende utile, non riprodurne la forma scolastica.**
