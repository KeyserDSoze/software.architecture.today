## Order Operations: pattern scelti, pattern rinviati

Order Operations è arrivato a un punto interessante: il sistema è abbastanza concreto da farci valutare pattern reali, ma non abbastanza complesso da giustificare automaticamente tutte le strutture che potremmo introdurre.

Il contesto è ancora quello costruito nei capitoli precedenti. La console compone stato ordine, pagamento e spedizione; il volume è moderato; il team è piccolo; il lookup è ancora live; Orders, Payments e Shipping hanno ownership distinte ma possono convivere nello stesso deployable e nella stessa istanza PostgreSQL.

Quindi non chiediamo quali pattern “mancano”. Chiediamo quali pressioni esistano già.

## Il confine esterno ha già un problema reale

Payments e Shipping dipendono da provider di cui non controlliamo contratto, nomenclatura, errori o tempi di risposta. Questa forza è presente oggi, non in un futuro ipotetico.

Qui un **Adapter** ha un lavoro chiaro: proteggere il linguaggio interno dal modello del provider.

Per Shipping potremmo esporre una capability come:

```ts
export interface ShipmentTrackingPort {
  getStatus(shipmentId: string): Promise<ShipmentStatus>;
}
```

mentre l'adapter conosce il client concreto:

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

Il valore non sta nell'interfaccia in sé. Sta nel fatto che `shipment_state`, `eta_epoch`, error code e altre convenzioni del carrier rimangono locali al confine. Il dominio continua a parlare il proprio linguaggio.

Questa pressione giustifica il pattern già nella prima iterazione.

## La rete richiede disciplina prima di richiedere sofisticazione

Le chiamate verso provider esterni possono essere lente o fallire. Anche questa forza è reale.

La prima risposta non è un'intera suite di resilience pattern. È definire **timeout** coerenti con il latency budget del journey e distinguere failure permanenti da failure plausibilmente transitori.

Dove l'operazione è sicura da ripetere, un **retry limitato** con backoff può avere fit. Ma la policy deve appartenere a un punto preciso del sistema. Se il nostro adapter effettua tre retry mentre l'SDK del provider ne fa già altri tre, una decisione locale apparentemente prudente può moltiplicare il carico durante un incidente.

Per questo il retry entra soltanto insieme a idempotency reasoning, error classification e un budget esplicito.

Questi meccanismi sono piccoli rispetto a una queue o a una saga, ma non sono dettagli irrilevanti. Sono parte del contratto operativo della dipendenza.

## Il circuit breaker non supera ancora la soglia

A questo punto sarebbe facile aggiungere un **circuit breaker**. La libreria esiste, il pattern è noto e un agente potrebbe implementarlo rapidamente.

Ma oggi non abbiamo evidenza che failure persistenti dei provider stiano causando cascading failure, saturazione delle risorse o incidenti in cui continuare a chiamare peggiora materialmente la situazione.

Il breaker introdurrebbe comunque soglie, stato, fallback, metriche, alerting, test e recovery semantics. Sono costi reali.

Per la prima fase preferiamo quindi timeout, retry selettivo e graceful degradation.

La decisione non è definitiva. Il breaker verrà rivalutato se aumenteranno failure persistenti, se la dipendenza inizierà a saturare risorse condivise o se un incidente dimostrerà che il sistema continua inutilmente a esercitare pressione su un provider degradato.

Questo è un esempio concreto di pattern threshold.

## L'asincronia entra soltanto dove il tempo può davvero essere disaccoppiato

Il journey principale è sincrono: l'operatore apre la console e vuole vedere informazioni. Mettere una **queue** tra UI e lettura non risolve un problema attuale; aggiunge soltanto un passaggio asincrono a una richiesta che ha bisogno di una risposta.

La stessa queue potrebbe invece avere molto più senso per una futura notifica. Se un cambiamento di stato deve produrre un'email o un'informazione operativa che non deve bloccare la transazione principale, producer e consumer non hanno più bisogno di essere disponibili nello stesso momento. La forza cambia, e con lei cambia il fit del pattern.

Questo ci impedisce di parlare di “queue sì” o “queue no” in assoluto. La risposta dipende dal rapporto temporale richiesto dal journey.

## Outbox: candidato solo quando compare il problema commit-publish

Oggi Order Operations non possiede ancora una transazione che debba produrre in modo affidabile un evento esterno.

Se in futuro una action persistita dovrà causare una notifica o un'integrazione, emergerà una domanda precisa:

> come evitiamo che il commit riesca ma l'intenzione di pubblicare venga persa?

A quel punto la **transactional outbox** diventa un candidato serio. Prima di quel momento non risolve nulla che il sistema abbia bisogno di risolvere.

Il trigger è molto più utile di una decisione preventiva.

## CQRS: separare gli intenti senza inventare infrastruttura

Nel codice possiamo già distinguere query e command quando hanno semantiche differenti. Questa separazione logica può migliorare chiarezza senza richiedere due database, due servizi o una pipeline di eventi.

Un **read model dedicato** verrà preso in considerazione soltanto se il profilo di lettura divergerà materialmente da quello operativo: latency non raggiungibile, carico che interferisce con le scritture, availability indipendente o più consumer che richiedono la stessa proiezione.

Fino ad allora, “CQRS” non è una giustificazione per distribuire il sistema.

## Event sourcing e saga non hanno ancora un problema da risolvere

Il fatto che Orders abbia stati e storico non rende **event sourcing** appropriato. Introdurlo cambierebbe fonte della verità, persistenza, debugging e recovery senza che esista oggi un requisito che paghi quel costo.

Quindi la decisione è no.

Non “non ancora perché il team non è abbastanza maturo”. No perché il fit attuale è scarso.

La stessa disciplina vale per **saga**. Orders, Payments e Shipping compaiono nello stesso scenario, ma non abbiamo ancora un workflow distribuito multi-step che richieda transazioni locali e compensazioni. Usare la parola saga prima che esista quella pressione sarebbe architettura anticipata.

Se il business introdurrà una action che attraversa sistemi autonomi, stati intermedi e failure compensabili, allora modelleremo quel problema.

## Il compromesso ESI

Platform Engineering preferisce poche primitive operative ben comprese. I team prodotto vogliono muoversi rapidamente. Security e Operations vogliono failure mode controllabili e diagnosi affidabile.

Il compromesso non consiste nel scegliere fra “semplice” e “robusto”. Consiste nel proteggere i failure mode che esistono già senza costruire infrastruttura per quelli che immaginiamo soltanto.

Per questa fase adottiamo Adapter, timeout e retry selettivo. Manteniamo CQRS come separazione logica dove chiarisce gli intenti. Rinviamo circuit breaker, queue nel request path, outbox, read model dedicato, saga ed event sourcing finché una pressione concreta non supera la soglia di adozione.

Il quality floor rimane: niente provider model nel dominio, niente chiamate remote senza timeout deliberati, niente retry senza ragionare su idempotenza e niente semantica di failure lasciata implicita.

## La decisione in una mappa

| Pattern | Decisione attuale | Pressione / trigger |
| --- | --- | --- |
| Adapter | sì | provider esterni con semantica non controllata |
| Timeout | sì | latency budget e failure remoto |
| Retry | sì, selettivo | failure transitori e operazioni ripetibili |
| Circuit breaker | non ancora | rivalutare con failure persistenti o saturazione |
| Queue nel request/response | no | il journey richiede risposta sincrona |
| Queue per notifiche | candidato futuro | disaccoppiamento temporale reale |
| Outbox | trigger futuro | commit locale + pubblicazione affidabile |
| CQRS logico | sì dove utile | intenti di lettura e scrittura distinti |
| Read model dedicato | non ancora | latency, isolation o consumer multipli |
| Event sourcing | no | nessun requisito ne paga il costo sistemico |
| Saga | no | nessun workflow compensativo distribuito |

La tabella non mostra quanta tecnologia conosce il team. Mostra che ogni pattern è collegato a una forza e, quando serve, a un trigger di revisione.

> **Maturità architetturale non significa avere molti pattern. Significa sapere perché quelli presenti meritano di esserci e perché gli altri, per ora, no.**