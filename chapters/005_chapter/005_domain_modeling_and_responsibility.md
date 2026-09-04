## Domain modeling: i confini seguono il significato

Una delle tentazioni più forti nel software design è partire dalla struttura tecnica: frontend, backend, API, database, queue. Sono elementi reali, ma descrivono **come** il sistema è costruito, non ancora **che cosa significa**.

Il domain modeling prova a partire da una domanda diversa:

> **Quali concetti, regole e responsabilità rendono questo sistema quello che è?**

## Il dominio non coincide con lo schema

Osservando Order Operations dal database potremmo trovare tabelle come:

```text
customers
orders
order_items
payments
shipments
refunds
```

È facile trasformare automaticamente ogni tabella in un'entità e ogni foreign key in una relazione del dominio. Ma lo schema relazionale è una rappresentazione di persistenza; non contiene necessariamente il modello mentale corretto del comportamento.

Il concetto di “ordine annullabile”, per esempio, può dipendere da stato logistico e pagamento, finestra temporale, policy commerciale e ruolo dell'utente. Nessuna singola tabella esprime necessariamente quella regola.

Il domain model deve quindi proteggere **significato e invarianti**, non riprodurre fedelmente la forma del database.

## Rendere autorevole il comportamento

Possiamo distinguere entità con identità, value object, eventi e policy, ma il valore non sta nel classificare perfettamente ogni oggetto secondo un vocabolario DDD. Sta nel rendere esplicito dove vive una regola.

Supponiamo di avere un oggetto semplice:

```ts
interface Order {
  id: string;
  status: string;
  paidAt?: Date;
  shippedAt?: Date;
}
```

Se decine di servizi ricostruiscono indipendentemente la cancellabilità con condizioni come:

```ts
if (order.status === "paid" && !order.shippedAt) {
  // ...
}
```

il problema non è dogmaticamente “anemic domain model”. Il problema è che il significato della regola è sparso.

Potremmo rendere autorevole quel comportamento con `order.canBeCancelled(at)` oppure con una `cancellationPolicy.evaluate(order, at)`. La forma concreta dipende dal design; il principio è avere **un luogo che possiede la semantica**.

## Il linguaggio rivela i confini

L'ubiquitous language è utile perché le parole usate dal team fanno emergere collisioni di significato. “Completed” può voler dire pagato per Payments, consegnato per il cliente, preparato per il magazzino o contabilizzato per Analytics.

La soluzione non è necessariamente imporre una definizione universale. A volte il modello migliora quando riconosciamo che lo stesso termine appartiene a contesti diversi e richiede nomi o mapping espliciti.

Il concetto di **bounded context** è prezioso proprio qui: un modello ha validità dentro un confine. Non segue però che ogni bounded context debba diventare un microservizio. Orders, Payments e Shipping possono essere contesti distinti dentro lo stesso monolite modulare.

> **Confine logico prima, topologia fisica dopo.**

## Tradurre invece di esportare il modello interno

Quando due contesti collaborano, vogliamo sapere chi possiede il significato e quale parte venga tradotta al boundary.

Se Shipping espone:

```text
shipment.status = dispatched
```

Orders può scegliere di tradurlo in un proprio concetto:

```text
order.fulfillmentState = in_transit
```

Il mapping può sembrare ridondante, ma impedisce al vocabolario interno di Shipping di diventare automaticamente il modello di Orders. È una forma di **protezione semantica**.

Questo è particolarmente importante quando i due contesti evolvono per ragioni diverse.

## Ownership non segue la posizione del dato

Un dato può comparire in più posti senza avere più proprietari. Un `customerId` può essere presente in Orders, Billing e Shipping senza rendere tutti e tre autorevoli sul cliente. Il prezzo copiato dentro un ordine per preservare lo snapshot storico non rende Orders proprietario del catalogo prezzi.

Ownership riguarda il diritto di definire e modificare il significato autorevole.

Per questo dobbiamo distinguere **duplicate data** da **duplicate meaning**. Duplicare `customerDisplayNameAtPurchase` può essere una scelta utile per conservare lo storico; permettere a due moduli di definire indipendentemente che cosa significhi `OrderStatus` è molto più pericoloso.

I dati possono essere replicati. Il significato autorevole deve rimanere governato.

## AI e modelli troppo puliti

L'AI può estrarre velocemente un primo domain model da API, schema, codice, test, ticket e documentazione. Può proporre entità, invarianti, eventi e bounded context.

Il rischio è che produca un modello più elegante della realtà. I domini veri contengono eccezioni, termini storici, compromessi commerciali, ownership organizzativa e casi che non entrano bene nella decomposizione più pulita.

Un modello generato va quindi trattato come ipotesi. Una review utile non chiede soltanto “è coerente?”, ma:

> **Quale comportamento reale entra male in questo modello? Quale parola sta nascondendo significati diversi?**

Un domain model non deve riprodurre perfettamente la realtà. Deve fornire una struttura abbastanza buona da rendere chiaro dove vivano le regole, chi possa cambiarle e quali invarianti il software debba proteggere.

> **Il valore del modello non è l'eleganza. È la capacità di proteggere il significato del sistema mentre il codice cambia.**
