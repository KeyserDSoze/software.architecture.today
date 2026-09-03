## Order Operations — dai file alle responsabilità

> **Caso simulato/composito.** Order Operations è il capstone didattico di Example Software Industries S.p.A. Nomi, numeri e circostanze sono costruiti per mostrare problemi realistici.

Nel capitolo precedente abbiamo deciso di mantenere, per ora, un lookup live sui dati operativi.

Quella decisione rispondeva a una domanda architetturale precisa.

Ma non ci dice ancora come strutturare il software.

Supponiamo che il prototipo iniziale abbia questa forma:

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

Funziona.

Ma per modificare la classificazione di un ordine problematico scopriamo che dobbiamo toccare:

```text
controllers/orders.ts
services/orders.ts
services/operations.ts
repositories/orders.ts
repositories/payments.ts
repositories/shipping.ts
utils/status.ts
```

e probabilmente anche il frontend.

La struttura tecnica non ci sta aiutando a capire la responsabilità.

### Prima domanda: chi possiede che cosa?

La vista operativa attraversa più domini.

Ma aggregare non significa possedere.

Per questa fase proponiamo una Responsibility Map.

### Orders

```text
Responsabilità:
- lifecycle commerciale dell'ordine
- validità delle transizioni
- stato dell'ordine
- identificazione dell'ordine

È autorevole su:
- Order
- OrderStatus

Espone:
- getOrder(orderId)
- capability semantiche del lifecycle

Nasconde:
- schema orders
- mapping tra record e modello
- dettagli di persistenza
```

### Payments

```text
Responsabilità:
- lifecycle del pagamento
- significato degli stati economici
- integrazione con payment provider
- idempotenza delle future operazioni economiche

È autorevole su:
- Payment
- PaymentStatus
- Refund quando verrà introdotto

Espone:
- getPaymentState(orderId)
- future capability economiche con contratto esplicito

Nasconde:
- provider SDK
- provider-specific status
- retry policy verso il provider
```

### Shipping

```text
Responsabilità:
- fulfillment e spedizione
- relazione con carrier/provider
- significato degli stati di spedizione

È autorevole su:
- Shipment
- ShipmentStatus

Espone:
- getShipmentState(orderId)

Nasconde:
- carrier API
- tracking mapping
- provider-specific status
```

### Order Operations

```text
Responsabilità:
- esperienza operativa degli operatori
- composizione della vista investigativa
- classificazione operativa derivata
- presentazione delle informazioni necessarie a Action / Wait / Escalation

È autorevole su:
- semantica specifica della vista operativa
- eventuali concetti operativi propri introdotti esplicitamente

Non è autorevole su:
- OrderStatus
- PaymentStatus
- ShipmentStatus

Espone:
- problematicOrders
- operationalOrderView

Nasconde:
- composizione delle fonti
- dettagli di query e adapter
```

### Identity / Access

Per ora non lo trasformiamo necessariamente in un modulo applicativo separato.

Ma rendiamo esplicita la responsabilità:

```text
Responsabilità:
- stabilire l'identità autenticata
- fornire claim affidabili
- applicare le policy di accesso appropriate
```

Order Operations non deve fidarsi di identificatori arbitrari inviati dal client quando questi determinano il perimetro di autorizzazione.

### Payments & Risk come stakeholder aziendale

Qui appare una distinzione importante tra **component boundary** e **organizational boundary**.

Il modulo Payments del prodotto può possedere il lifecycle tecnico/applicativo del pagamento.

Ma ESI può avere una business unit Payments & Risk che possiede policy condivise come:

- regole di refund;
- limiti di rischio;
- audit economico;
- provider strategy;
- controlli antifrode.

Non tutto ciò che è “nel modulo Payments” può essere deciso localmente dal team Order Operations.

Questo è uno dei motivi per cui conoscere il dominio dell'applicazione non basta: serve anche capire il sistema organizzativo in cui il software vive.

### Il database condiviso

Supponiamo che Order Operations usi, per ora, un'unica istanza PostgreSQL o datastore condiviso con boundary logici.

Non introduciamo tre database soltanto per rendere il diagramma più pulito.

Possiamo però stabilire ownership logica:

```text
orders.*   → Orders
payments.* → Payments
shipping.* → Shipping
```

E una regola:

> un modulo non legge direttamente le tabelle possedute da un altro modulo senza un contratto deliberato.

Questo costo iniziale può sembrare maggiore rispetto a una join diretta ovunque.

Ma protegge il modello interno e rende più espliciti i contratti.

### Il compromesso del capitolo

**Esigenza**

Il team vuole muoversi velocemente in un solo deployable e, per ora, anche con infrastruttura dati semplice.

**Tensione**

Velocità locale e semplicità contro isolamento forte dei domini.

**Decisione**

Costruiamo confini logici e ownership forti senza imporre subito separazione fisica.

**Costo accettato**

Alcune forme di isolamento rimangono convenzionali o applicative invece che infrastrutturali.

**Quality floor**

La semantica e l'ownership non possono diventare condivise per comodità. Orders non deve decidere PaymentStatus; Order Operations non deve diventare source of truth perché legge tutto.

**Guardrail**

- responsibility map;
- dependency direction;
- contratti interni;
- test architetturali futuri;
- review delle query cross-domain.

Questa è una scelta pragmatica.

La scorciatoia sarebbe un database condiviso in cui ogni componente legge e scrive tutto.

Il compromesso è condividere infrastruttura **senza condividere indiscriminatamente il significato**.

### La UI non deve diventare un secondo dominio

Per una buona esperienza utente potremmo voler mostrare una categoria sintetica:

```text
Payment problem
Shipping problem
Order problem
```

Una soluzione fragile sarebbe duplicare nel frontend tutte le regole che derivano la categoria.

Meglio che Order Operations esponga una rappresentazione semantica:

```json
{
  "orderId": "ORD-42",
  "orderStatus": "Processing",
  "paymentStatus": "Failed",
  "shipmentStatus": "NotReady",
  "problemCategory": "Payment"
}
```

La UI decide come rappresentare il problema.

Il backend possiede la semantica della classificazione operativa.

I domini sottostanti continuano a possedere i propri stati.

### Una futura action rende visibile il confine

Supponiamo che domani Product chieda:

> “Aggiungiamo Retry Payment.”

Il bottone è semplice.

Il confine no.

Order Operations potrebbe orchestrare la richiesta, ma non dovrebbe inventare:

- quando un retry è consentito;
- se può duplicare un addebito;
- quale idempotency key usare;
- quali provider supportano il comportamento;
- quale audit è necessario.

Queste responsabilità appartengono al dominio Payments e alle policy ESI di Payments & Risk.

Il boundary ci permette di dire:

> il bisogno nasce qui, ma una parte della decisione appartiene altrove.

### Struttura possibile del repository

Una prima evoluzione potrebbe essere:

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

Questa è soltanto una possibilità.

Non è un template universale.

La parte importante è che il layout renda visibili le responsabilità e la direzione delle dipendenze.

### Che cosa abbiamo guadagnato

Non abbiamo scritto meno codice per forza.

Abbiamo ottenuto qualcosa di diverso:

- fonti autorevoli distinte;
- contratti espliciti fra i domini;
- dettagli infrastrutturali più locali;
- una UI che non reinventa regole;
- ownership del dato più chiara;
- un perimetro più comprensibile per test e agenti;
- visibilità su quali decisioni richiedono altri stakeholder ESI.

Questa è modularità utile.

Non il numero di cartelle.

La capacità di dire:

> **questa decisione appartiene qui, e il resto del sistema non deve conoscerne i dettagli.**