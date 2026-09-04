## Order Operations — il primo contratto API

Nei capitoli precedenti abbiamo volutamente evitato di anticipare troppo la soluzione.

Ora abbiamo abbastanza contesto per prendere una decisione concreta.

Order Operations ha bisogno di un'interfaccia tra la UI operativa e le capability backend.

### Partiamo dal journey

Il journey corrente è:

```text
operatore
→ apre la console
→ vede ordini problematici
→ apre un ordine
→ comprende la causa
→ decide Action / Wait / Escalation
```

Le capability già definite sono soprattutto di lettura.

Non abbiamo ancora definito abbastanza bene la semantica di:

- refund;
- retry payment;
- retry shipment;
- force transition;
- assignment persistente;
- escalation persistente.

Questo dettaglio è importante.

Un framework potrebbe permetterci di generare immediatamente:

```http
POST /orders/{id}/refund
POST /orders/{id}/retry-payment
```

Ma sarebbe **execution davanti all'analisi funzionale**.

Non sappiamo ancora abbastanza per promettere quei contratti.

### Entra il contrasto aziendale

Product e Operations vorrebbero ridurre il numero di passaggi manuali.

Payments & Risk ricorda che refund e retry possono avere conseguenze economiche e che la semantica non può essere decisa soltanto dal team della console.

Security vuole sapere chi può eseguire le azioni.

Legal/Compliance potrebbe richiedere audit o retention specifici.

Platform Engineering vuole evitare che ogni team inventi un modello di errori e retry incompatibile con il resto dell'azienda.

La richiesta “aggiungiamo due endpoint” è diventata una decisione che attraversa più parti di ESI.

### Interaction style

Per la prima versione scegliamo HTTP request/response con JSON.

Non perché REST sia il default universale.

Perché il journey attuale è:

- interattivo;
- read-oriented;
- browser-based;
- senza requisito di streaming continuo;
- senza requisito di temporal decoupling per le letture.

Non introduciamo quindi GraphQL, gRPC, WebSocket o messaging soltanto per dimostrare che li conosciamo.

Fit before fashion continua a valere anche per i protocolli.

### Lista ordini problematici

Prima operazione:

```http
GET /api/problematic-orders
```

Possibile risposta:

```json
{
  "items": [
    {
      "orderId": "ORD-42",
      "orderStatus": "Processing",
      "paymentStatus": "Failed",
      "shipmentStatus": "NotReady",
      "problemCategory": "Payment",
      "lastRelevantUpdateAt": "2026-09-03T08:15:00Z"
    }
  ],
  "nextCursor": null
}
```

Notiamo alcune scelte.

Non esponiamo:

```text
payment_state_code
shipment_tbl_status
is_problematic_bit
```

Esporremmo dettagli dell'implementazione.

Microsoft Azure Architecture Center raccomanda che un'API modelli il dominio e non il database interno.

Fonte:

- [Microsoft Learn — API design](https://learn.microsoft.com/azure/architecture/microservices/design/api-design)

### Tre stati, non uno

La risposta mantiene separati:

```text
orderStatus
paymentStatus
shipmentStatus
```

Questo deriva direttamente dall'analisi funzionale.

Se avessimo creato un singolo:

```json
{"status":"Problem"}
```

la UI sarebbe più semplice nel brevissimo periodo, ma avremmo perso informazione di dominio necessaria all'investigazione.

L'API Contract non nasce dal controller.

Nasce dalla Functional Scope Map e dalla responsibility map.

### Detail view

Seconda operazione:

```http
GET /api/orders/{orderId}/operational-view
```

La parola `operational-view` è deliberata.

Non stiamo dichiarando che questa rappresentazione sia l'`Order` universale di tutta ESI.

È una vista costruita per un consumer preciso e un journey preciso.

Questo evita di creare un mega-schema `OrderDto` destinato a diventare contratto implicito di tutto il sistema.

### Pagination

La lista userà una forma cursor-based.

```http
GET /api/problematic-orders?cursor=...&limit=50
```

Non perché il cursor sia sempre superiore all'offset.

Perché una collection di ordini problematici può cambiare mentre l'operatore la attraversa e vogliamo preservare libertà di implementazione sul dataset.

Il cursor resta opaco al consumer.

Se le misurazioni future mostrassero che questa scelta complica inutilmente il sistema, potremmo rivalutarla.

### Error contract

Per errori HTTP che richiedono dettaglio applicativo useremo Problem Details.

Esempio:

```json
{
  "type": "https://esi.example/problems/order-not-visible",
  "title": "Order is not visible",
  "status": 403,
  "detail": "The current operator cannot access this order."
}
```

Il dominio `.example` è un placeholder documentale riservato all'esempio, non un endpoint reale.

Fonte primaria:

- [RFC 9457 — Problem Details for HTTP APIs](https://www.rfc-editor.org/rfc/rfc9457.html)

La parte interessante non è il formato JSON.

È distinguere semanticamente:

```text
non autenticato
≠ non autorizzato
≠ ordine inesistente
≠ dipendenza indisponibile
≠ input invalido
```

### Un 200 con dati sbagliati è peggio di un 503

Supponiamo che Payments sia indisponibile.

Abbiamo almeno tre opzioni:

1. fallire tutta la vista;
2. mostrare dati parziali marcati come tali;
3. mostrare l'ultimo dato noto.

Non possiamo scegliere soltanto nel catch block.

È una decisione funzionale e di quality attribute.

Per alcune investigazioni, dati parziali potrebbero essere utili.

Per altre potrebbero indurre un operatore ad agire in modo errato.

La prima versione del contratto mantiene questa decisione aperta finché non definiamo meglio il failure behavior.

Questo è un esempio di documentazione utile: **non nasconde una decisione mancante dietro una risposta inventata**.

### Il compromesso del capitolo

**Esigenza**

Dare alla UI un contratto stabile e iniziare a ridurre il lavoro manuale.

**Tensione**

Velocità di esposizione di nuove action API contro semantica, authorization, audit, idempotenza e ownership economica.

**Decisione**

Pubblicare inizialmente soltanto capability read-oriented e rinviare i command con side effect finché i domini coinvolti non hanno definito il comportamento.

**Costo accettato**

Il prodotto automatizza meno di quanto sarebbe tecnicamente possibile.

**Quality floor**

Nessuna operazione economica o customer-facing viene esposta senza:

- precondizioni;
- authorization;
- idempotency reasoning;
- audit quando richiesto;
- ownership;
- failure semantics.

**Guardrail**

API Contract versionato, review cross-domain, contract test e stop condition per gli agenti che implementano endpoint.

Questo è un compromesso di time-to-market.

Non è una rinuncia alla qualità.

### Perché non aggiungiamo subito i comandi

Il lettore potrebbe aspettarsi che, una volta aperto un ordine, l'operatore possa fare qualcosa.

Probabilmente accadrà.

Ma non sappiamo ancora:

- quali azioni;
- con quali permission;
- su quali stati;
- con quale audit;
- con quale idempotenza;
- con quale relazione verso sistemi esterni;
- quali decisioni appartengono a Commerce & Operations e quali a Payments & Risk.

Quindi il contratto corrente dichiara esplicitamente:

> **non ancora.**

La capacità di non pubblicare un endpoint prematuro è parte dell'API design.

### Il capstone è stato aggiornato

Lo snapshot vivo del contratto è in:

```text
capstone/example-software-industries/products/order-operations/docs/api-contract.md
```

Da questo momento, quando il libro farà evolvere Order Operations, dovremo modificare anche quel contratto quando cambiano semantica, consumer o compatibility.

Il manoscritto spiega la decisione.

Il capstone conserva il risultato corrente.