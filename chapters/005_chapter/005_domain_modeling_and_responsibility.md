## Domain modeling: i confini seguono il significato

Una delle tentazioni più forti nel software design è partire dalla struttura tecnica.

Frontend.

Backend.

Database.

API.

Queue.

Questi elementi esistono davvero.

Ma non spiegano che cosa il sistema significa.

Il domain modeling prova a partire da un'altra domanda:

> **Quali concetti, regole e responsabilità rendono questo sistema quello che è?**

### Il dominio non è il database

Se osserviamo Acme Orders dal database potremmo vedere tabelle come:

```text
customers
orders
order_items
payments
shipments
refunds
```

È facile trasformare automaticamente ogni tabella in un'entità e ogni relazione in una relazione del dominio.

Ma uno schema relazionale è una rappresentazione di persistenza.

Non è necessariamente il modello mentale corretto per il comportamento.

Per esempio, il concetto di “ordine annullabile” potrebbe dipendere da:

- stato logistico;
- stato del pagamento;
- finestra temporale;
- policy commerciale;
- ruolo dell'utente.

Nessuna singola tabella rappresenta necessariamente quella regola.

### Entità, valore e comportamento

Nel domain modeling ci interessa distinguere almeno:

- cose con identità nel tempo;
- valori definiti dalle proprie proprietà;
- comportamenti e invarianti;
- eventi significativi;
- responsabilità che appartengono a un contesto specifico.

Un `OrderId` può essere un value object.

Un `Order` può avere identità.

Una `Money` può incorporare importo e valuta.

Un evento `OrderCancelled` può rappresentare un fatto avvenuto.

Ma il valore non sta nel classificare tutto correttamente secondo un vocabolario.

Sta nel rendere esplicite le regole che il software deve proteggere.

### Modello anemico e logica sparsa

Supponiamo di avere:

```ts
interface Order {
  id: string;
  status: string;
  paidAt?: Date;
  shippedAt?: Date;
}
```

E poi decine di servizi che fanno:

```ts
if (order.status === "paid" && !order.shippedAt) {
  // ...
}
```

Il problema non è necessariamente che l'oggetto sia “anemico” in senso dogmatico.

Il problema è che la regola potrebbe essere duplicata in più punti.

Un modello più esplicito potrebbe fornire:

```ts
order.canBeCancelled(at)
```

oppure una policy dedicata:

```ts
cancellationPolicy.evaluate(order, at)
```

La scelta dipende dal contesto.

Ciò che conta è avere un luogo autorevole per il significato.

### Ubiquitous language come strumento di design

Il linguaggio usato dal team rivela spesso confini e ambiguità.

Che cosa significa “completato”?

Per il cliente potrebbe significare ricevuto.

Per il pagamento potrebbe significare incassato.

Per il magazzino potrebbe significare preparato.

Per il reporting potrebbe significare contabilizzato.

Se usiamo la stessa parola per concetti diversi, il codice finirà facilmente per mescolarli.

A volte la soluzione non è trovare una definizione universale.

È riconoscere che il termine appartiene a contesti differenti.

### Bounded context senza rituale

Il concetto di bounded context è estremamente utile quando ci ricorda che **un modello ha validità dentro un confine**.

Non deve diventare una scusa per creare automaticamente un microservizio per ogni contesto.

Possiamo avere:

```text
Orders context
Payments context
Shipping context
```

all'interno dello stesso monolite modulare.

La separazione concettuale non impone una separazione di deployment.

Ancora una volta:

> **confine logico prima, topologia fisica dopo.**

### Context mapping pragmatico

Quando due contesti interagiscono, vogliamo capire:

- chi possiede il concetto;
- quale informazione viene condivisa;
- chi traduce il modello;
- quali assunzioni diventano contratto;
- quale parte è autorizzata a cambiare il significato.

Supponiamo che Shipping esponga:

```text
shipment.status = dispatched
```

Orders potrebbe decidere di tradurlo internamente in:

```text
order.fulfillmentState = in_transit
```

Questo mapping può sembrare ridondante.

Ma evita che il vocabolario interno di Shipping diventi automaticamente il modello interno di Orders.

È una forma di protezione semantica.

### La responsabilità non segue il dato

Una regola importante:

> **Il luogo in cui un dato è memorizzato non determina automaticamente chi possiede il comportamento associato.**

Un customer ID può comparire in molti moduli.

Questo non significa che ogni modulo possieda il cliente.

Un prezzo può essere copiato dentro un ordine per ragioni storiche e transazionali.

Questo non significa che Orders possieda il catalogo prezzi.

Ownership riguarda il diritto di definire e modificare il significato autorevole.

### Duplicate data vs duplicate meaning

Un sistema ben progettato può duplicare dati senza duplicare ownership.

Per esempio, Orders può memorizzare:

```text
customerDisplayNameAtPurchase
```

per conservare lo snapshot storico.

Il dato è duplicato.

Il significato non necessariamente lo è.

Diverso sarebbe avere due moduli che possono entrambi modificare indipendentemente la stessa definizione di “stato ordine”.

Quello è duplicate meaning.

Ed è molto più pericoloso.

### AI e domain modeling

L'AI è molto utile per estrarre un primo modello da:

- codice esistente;
- nomi delle API;
- schema database;
- ticket;
- documentazione;
- test;
- log.

Può proporre entità, invarianti e bounded context.

Ma tende anche a produrre modelli troppo puliti.

Il dominio reale contiene:

- eccezioni;
- termini ambigui;
- regole storiche;
- compromessi commerciali;
- ownership organizzativa;
- casi che contraddicono il modello elegante.

Per questo un domain model generato deve essere trattato come ipotesi.

Una buona review chiede:

> “Quale comportamento reale non entra bene in questo modello?”

Oppure:

> “Quali termini stanno nascondendo significati diversi?”

### Il criterio finale

Un modello di dominio è utile se rende più facile dire:

- dove vive una regola;
- chi la può cambiare;
- quali invarianti devono restare vere;
- quali concetti non devono trapelare fuori dal loro contesto.

Non deve riprodurre perfettamente la realtà.

Deve fornire **una struttura sufficientemente buona per proteggere il significato del software**.
