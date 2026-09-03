## Order Operations: pattern scelti, pattern rinviati

Order Operations è abbastanza cresciuto da permetterci di fare una cosa utile: valutare pattern concreti senza trasformare il sistema in un catalogo.

Ricordiamo il contesto attuale.

Il prodotto espone una vista operativa con stato ordine, pagamento e spedizione. Il volume è ancora moderato. Il team è piccolo. Abbiamo scelto per ora lookup live sui dati operativi. Orders, Payments e Shipping hanno responsabilità distinte ma possono vivere nello stesso deployable e nella stessa istanza PostgreSQL.

Questo contesto ci permette di chiedere quali pattern abbiano davvero un lavoro da svolgere.

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

### Circuit breaker: non ancora

Potremmo implementarlo.

La libreria esiste.

L'AI potrebbe aggiungerlo in pochi minuti.

Ma oggi non abbiamo evidenza che failure persistenti dei provider stiano producendo cascading failure o saturazione significativa.

Inoltre il breaker richiederebbe:

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

### Queue per la vista operativa: no

Il journey è sincrono: l'operatore apre la console e vuole vedere informazioni.

Inserire una queue tra UI e lettura non risolve alcun problema attuale.

Aggiungerebbe asincronia dove non serve.

### Queue per notifiche: plausibile

Se in futuro ESI introdurrà notifiche operative o customer-facing dopo cambiamenti di stato, una queue può avere un buon fit.

La notifica non deve necessariamente bloccare una transazione.

In quel caso il disaccoppiamento temporale ha valore.

### Outbox: non ancora, ma con un trigger chiaro

Oggi Order Operations non ha ancora un requisito forte di pubblicazione affidabile di eventi dopo una transazione propria.

Se introducessimo notifiche o integrazioni che devono reagire a un evento persistito, la domanda diventerebbe concreta:

> come garantiamo che il commit e l'intenzione di pubblicare non divergano?

A quel punto transactional outbox diventerebbe un candidato serio.

Non prima.

### CQRS: separazione logica, non infrastruttura dedicata

Nel codice possiamo già distinguere command e query quando hanno responsabilità diverse.

Questo non significa introdurre due database.

Un read model dedicato verrà valutato soltanto se i requisiti di lettura divergeranno materialmente da quelli dei dati operativi.

### Event sourcing: no

Il fatto che il dominio abbia stati e storico non rende event sourcing automaticamente appropriato.

Event sourcing trasformerebbe profondamente il modello di persistenza senza che esista ancora un requisito che ne paghi il costo.

Quindi no.

Non “non ancora perché non siamo abbastanza maturi”.

No perché oggi non ha fit.

### Saga: no

Orders, Payments e Shipping convivono nello stesso scenario, quindi è facile lasciarsi sedurre dalla parola saga.

Ma non abbiamo ancora un workflow distribuito multi-step con compensazioni che la richieda.

Se quel problema emergerà, modelleremo quel problema.

Oggi sarebbe architettura anticipata.

### Il contrasto ESI

Platform Engineering preferisce poche primitive operative ben comprese.

I team prodotto vogliono velocità.

Security e Operations vogliono controlli robusti sui failure mode.

Un pattern può migliorare una di queste proprietà e peggiorarne altre.

Aggiungere pattern “per sicurezza” non è gratis.

### Il compromesso del capitolo

**Esigenza**

Aumentare robustezza e chiarezza senza rallentare l'evoluzione del prodotto.

**Tensione**

Protezione dai failure e flessibilità contro complexity debt.

**Decisione**

Adottiamo Adapter, timeout e retry selettivo; rinviamo circuit breaker, outbox, saga ed event sourcing finché non esiste una forza concreta che li giustifichi.

**Costo accettato**

Non disponiamo ancora di alcuni meccanismi avanzati che potrebbero diventare utili in scenari futuri.

**Quality floor**

Non rinunciamo a timeout, idempotency reasoning, isolation dei provider o error handling soltanto perché evitiamo pattern più complessi.

**Guardrail**

Pattern Justification Test, trigger di revisione, observability quando il pattern richiede stato operativo.

La semplificazione non consiste nel togliere protezioni necessarie.

Consiste nel non introdurre protezioni che ancora non hanno un failure mode reale da governare.

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
| Read model CQRS dedicato | non ancora | requisiti attuali non lo richiedono |
| Event sourcing | no | nessun requisito ne paga il costo |
| Saga | no | workflow compensativo non ancora presente |

Questa tabella è più importante del numero di pattern adottati.

Rende evidente che il team conosce le opzioni e sa anche non usarle.

> **Maturità architetturale non significa avere molti pattern. Significa sapere perché quelli presenti meritano di esserci.**