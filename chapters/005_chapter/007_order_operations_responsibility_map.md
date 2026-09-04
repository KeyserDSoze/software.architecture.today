## Order Operations — dai file alle responsabilità

> **Caso simulato/composito.** Order Operations è il capstone didattico di Example Software Industries S.p.A. Nomi, numeri e circostanze sono costruiti per mostrare problemi realistici.

Nel capitolo precedente abbiamo deciso di mantenere, per ora, un lookup live. Quella decisione ci dice come vogliamo comporre la vista nella prima fase, ma non ci dice ancora **dove debbano vivere le regole**.

Immaginiamo che il prototipo sia organizzato per layer tecnici:

```text
src/
  controllers/
    orders.ts
  services/
    orders.ts
    operations.ts
  repositories/
    orders.ts
    payments.ts
    shipping.ts
  models/
    order.ts
    payment.ts
    shipment.ts
  utils/
    dates.ts
    status.ts
```

La struttura è ordinata, ma quando cambiamo la classificazione di un ordine problematico scopriamo di dover toccare controller, più service, tre repository, utility e probabilmente anche il frontend. Il layout tecnico non ci sta aiutando a vedere chi possiede il significato.

## Aggregare non significa possedere

Order Operations attraversa più domini proprio perché serve a dare agli operatori una vista investigativa. Questa posizione lo rende pericolosamente vicino a diventare il posto in cui ogni semantica viene ricostruita.

La Responsibility Map deve impedire questa deriva.

**Orders** possiede lifecycle commerciale, validità delle transizioni e `OrderStatus`. Nasconde schema e mapping di persistenza e può esporre capability semantiche sul lifecycle.

**Payments** possiede il lifecycle economico, il significato di `PaymentStatus` e, quando verranno introdotte, le operazioni come refund e retry con le relative regole di idempotenza. Nasconde provider SDK, mapping degli stati e policy di integrazione.

**Shipping** possiede fulfillment e `ShipmentStatus`, insieme alla relazione con carrier e provider logistici. Order Operations può leggere una capability di stato, non adottare automaticamente il modello interno di Shipping.

**Order Operations** possiede invece la composizione della vista investigativa e la semantica della classificazione operativa derivata. Può essere autorevole su `ProblemCategory` se quel concetto viene introdotto esplicitamente come proprio. Non diventa però autorevole su `OrderStatus`, `PaymentStatus` o `ShipmentStatus` soltanto perché li mostra insieme.

Questa distinzione è il cuore del design.

## La mappa operativa

Una versione compatta può essere:

```text
Component: Orders
Owns: Order, OrderStatus, lifecycle rules
Exposes: order lookup, lifecycle capabilities
Hides: persistence schema and mappings

Component: Payments
Owns: Payment, PaymentStatus, economic operation semantics
Exposes: payment state and explicit economic capabilities
Hides: provider SDK, provider status, retry details

Component: Shipping
Owns: Shipment, ShipmentStatus, fulfillment semantics
Exposes: shipment state
Hides: carrier APIs and provider mappings

Component: Order Operations
Owns: operational view composition, ProblemCategory
Exposes: problematicOrders, operationalOrderView
Hides: source composition and adapters
Must not own: OrderStatus, PaymentStatus, ShipmentStatus
```

Identity rimane una capability trasversale: deve fornire identità e claim affidabili e permettere l'applicazione delle policy di accesso. Order Operations non può trattare identificatori arbitrari provenienti dal client come se definissero il perimetro autorizzato.

## Il boundary organizzativo non coincide sempre con quello del codice

Payments introduce anche un'altra distinzione. Nel software possiamo avere un modulo che possiede il lifecycle tecnico del pagamento, mentre a livello ESI la business unit Payments & Risk possiede policy condivise su refund, rischio, audit economico, provider strategy e antifrode.

Questo significa che una decisione può essere localizzata nel codice e richiedere comunque un ownership boundary organizzativo più ampio.

Quando Product chiederà “aggiungiamo Retry Payment”, Order Operations potrà orchestrare l'intenzione dell'operatore, ma non dovrebbe inventare quando il retry sia consentito, quale idempotency key usare o quali rischi economici siano accettabili. Il bisogno nasce nella console; una parte della decisione appartiene altrove.

## Database condiviso, significato non condiviso

Nella prima fase possiamo usare una singola istanza PostgreSQL o un datastore condiviso. Non introduciamo database separati soltanto per rendere il diagramma più elegante.

Possiamo però stabilire ownership logica:

```text
orders.*   → Orders
payments.* → Payments
shipping.* → Shipping
```

con una regola deliberata: un modulo non legge direttamente le tabelle possedute da un altro modulo senza un contratto esplicito.

Questa scelta costa un po’ più di una join libera ovunque, ma preserva la possibilità di cambiare schema, semantica e persistenza senza trasformare ogni consumer in un co-proprietario.

Il compromesso ESI è quindi chiaro: **infrastruttura semplice e confini logici forti**. Accettiamo che parte dell'isolamento sia applicativo invece che fisico; non accettiamo che ownership e semantica diventino condivise per comodità.

## La UI non è un secondo dominio

La vista può mostrare una categoria sintetica come `Payment problem`, `Shipping problem` o `Order problem`. Sarebbe fragile ricostruire questa logica nel frontend a partire dagli stati grezzi.

Order Operations può invece esporre una rappresentazione semantica:

```json
{
  "orderId": "ORD-42",
  "orderStatus": "Processing",
  "paymentStatus": "Failed",
  "shipmentStatus": "NotReady",
  "problemCategory": "Payment"
}
```

La UI decide come presentarla. Order Operations possiede la classificazione operativa. I domini sottostanti continuano a possedere i propri stati.

Questa separazione evita che una decisione di presentazione diventi una seconda implementazione del dominio.

## Una struttura possibile, non un template universale

Il repository potrebbe evolvere verso qualcosa come:

```text
src/
  order-operations/
    application/
    domain/
    adapters/
    tests/
  orders/
    domain/
    application/
    adapters/
    tests/
  payments/
    domain/
    application/
    adapters/
    tests/
  shipping/
    domain/
    application/
    adapters/
    tests/
  platform/
    observability/
    database/
```

La forma concreta non è la parte importante. Il layout deve rendere leggibili responsabilità e dependency direction e, quando possibile, permettere di verificare automaticamente gli accessi proibiti.

## Che cosa abbiamo guadagnato

Non abbiamo necessariamente ridotto il numero di righe. Abbiamo reso più chiaro chi è autorevole, quali contratti attraversano i confini, quali dettagli devono restare locali e quali decisioni richiedono stakeholder diversi.

Per persone, test e agenti il perimetro diventa più comprensibile.

Questa è modularità utile: non il numero di cartelle, ma la capacità di dire con precisione:

> **questa decisione appartiene qui, e il resto del sistema non deve conoscerne i dettagli.**
