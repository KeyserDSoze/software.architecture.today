## Acme Orders: pattern scelti, pattern rinviati

Acme Orders è abbastanza cresciuto da permetterci di fare una cosa utile: valutare pattern concreti senza trasformare il sistema in un catalogo.

Ricordiamo il contesto attuale.

Il sistema espone uno storico ordini con stato, pagamento e spedizione. Il volume è moderato. Il team è piccolo. Abbiamo scelto per ora lookup live sui dati operativi. Orders, Payments e Shipping hanno responsabilità distinte ma possono vivere nello stesso deployable e nella stessa istanza PostgreSQL.

Questo contesto ci permette di chiedere quali pattern hanno davvero un lavoro da svolgere.

### Adapter per provider esterni: sì

Payments e Shipping dipendono da sistemi esterni con contratti che non controlliamo.

Qui un Adapter ha un buon fit.

Non perché “Clean Architecture lo richiede”, ma perché vogliamo evitare che il linguaggio del provider diventi il linguaggio del dominio.

Per Shipping potremmo avere:

```ts
export interface ShipmentTrackingPort {
  getStatus(shipmentId: string): Promise<ShipmentStatus>;
}
```

con un adapter specifico:

```ts
export class CarrierXTrackingAdapter implements ShipmentTrackingPort {
  async getStatus(shipmentId: string): Promise<ShipmentStatus> {
    const response = await this.client.fetchShipment(shipmentId);

    return {
      status: mapCarrierStatus(response.shipment_state),
      estimatedDelivery: response.eta_epoch
        ? new Date(response.eta_epoch * 1000)
        : undefined,
    };
  }
}
```

Il valore del pattern è chiaro:

- translation boundary;
- normalizzazione errori;
- isolamento del contratto esterno;
- possibilità di sostituire o affiancare un provider senza contaminare il dominio.

### Retry: sì, ma soltanto in casi specifici

Una lettura del tracking può fallire per un errore transitorio.

Un retry limitato con backoff può avere senso.

Ma non vogliamo una policy globale “retry everything”.

Per ogni operazione dobbiamo sapere:

- è idempotente?
- quale latency budget abbiamo?
- quali errori sono transitori?
- chi è già responsabile del retry?

Se un SDK del provider fa già retry e il nostro client ne aggiunge altri tre, possiamo moltiplicare involontariamente le richieste.

Quindi il pattern entra insieme a una policy esplicita.

### Timeout: sì

Le dipendenze esterne devono avere timeout coerenti con il journey.

Questo non richiede un'architettura sofisticata.

Richiede disciplina.

Se la pagina ordine deve rispondere entro un budget ragionevole, non possiamo aspettare indefinitamente un provider di shipping.

### Circuit breaker: non ancora

Potremmo implementarlo.

La libreria esiste.

L'AI potrebbe aggiungerlo in pochi minuti.

Ma oggi non abbiamo evidenza che i failure persistenti del provider stiano producendo cascading failure o saturazione significativa.

Inoltre l'introduzione del breaker richiederebbe:

- metriche;
- soglie;
- fallback;
- alerting;
- test;
- ownership operativa.

Per ora preferiamo timeout, retry limitato e graceful degradation.

Trigger di revisione:

- aumento significativo dei failure persistenti;
- saturazione delle risorse a causa della dipendenza;
- incidenti in cui le chiamate ripetute peggiorano la situazione.

### Queue per la pagina storico ordini: no

Il customer journey è sincrono: il cliente apre la pagina e vuole vedere lo stato.

Inserire una queue tra UI e lettura non risolve alcun problema attuale.

Aggiungerebbe soltanto asincronia dove non serve.

### Queue per notifiche: plausibile

Se in futuro Acme Orders invierà email o push notification dopo cambiamenti di stato, una queue può avere un buon fit.

La notifica non deve necessariamente bloccare la transazione dell'ordine.

In quel caso il disaccoppiamento temporale ha valore.

Il pattern dipende quindi dal journey.

La stessa tecnologia può essere sbagliata in un punto e ottima in un altro.

### Outbox: non ancora, ma con un trigger chiaro

Oggi Acme Orders non ha ancora un requisito forte di pubblicazione affidabile di eventi dopo una transazione.

Se introducessimo notifiche, analytics o integrazioni che devono reagire a `OrderConfirmed`, la domanda diventerebbe concreta:

> come garantiamo che il commit dell'ordine e l'intenzione di pubblicare l'evento non divergano?

A quel punto transactional outbox diventerebbe un candidato serio.

Non prima.

### CQRS: separazione logica, non infrastruttura dedicata

Nel codice possiamo già distinguere command e query perché hanno responsabilità diverse.

Questo non significa introdurre due database.

Per esempio:

```text
commands/
  cancel_order.ts
  confirm_order.ts
queries/
  get_order_history.ts
```

Questa separazione può migliorare chiarezza con un costo minimo.

Un read model dedicato verrà valutato soltanto se i requisiti di lettura divergeranno materialmente da quelli di scrittura.

### Event sourcing: no

Potremmo sostenere che lo storico ordini “sembra perfetto” per event sourcing.

Ma il requisito attuale è mostrare eventi significativi al cliente, non ricostruire l'intero stato del dominio da un event log immutabile.

Event sourcing introdurrebbe una trasformazione profonda del modello di persistenza senza un beneficio sufficiente.

Quindi no.

Non “non ancora perché non siamo abbastanza maturi”.

No perché oggi non ha fit.

### Saga: no

Acme Orders ha payment e shipping, quindi è facile lasciarsi sedurre dalla parola saga.

Ma non abbiamo ancora un workflow distribuito multi-step con compensazioni che lo richieda.

Se in futuro un processo di checkout coinvolgerà prenotazione inventory, autorizzazione pagamento e creazione spedizione con failure indipendenti, allora modelleremo quel problema.

Oggi sarebbe architettura anticipata.

### La tabella delle decisioni

| Pattern | Decisione attuale | Perché |
| --- | --- | --- |
| Adapter | sì | protegge il dominio da provider esterni |
| Timeout | sì | limita failure e rispetta latency budget |
| Retry | sì, selettivo | gestisce failure transitori |
| Circuit breaker | non ancora | costo operativo non giustificato |
| Queue per request/response | no | il journey è sincrono |
| Queue per notification | candidato futuro | utile disaccoppiamento temporale |
| Outbox | trigger futuro | serve con pubblicazione affidabile post-commit |
| CQRS logico | sì | separa intenti con basso costo |
| Read model CQRS dedicato | non ancora | scala attuale non lo richiede |
| Event sourcing | no | nessun requisito ne paga il costo |
| Saga | no | workflow compensativo non ancora presente |

Questa tabella è più importante del numero di pattern adottati.

Rende evidente che il team conosce le opzioni e sa anche non usarle.

> **Maturità architetturale non significa avere molti pattern. Significa sapere perché quelli presenti meritano di esserci.**
