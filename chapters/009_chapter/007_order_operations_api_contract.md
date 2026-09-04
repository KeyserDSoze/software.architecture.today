## Order Operations — il primo contratto API

Nei capitoli precedenti abbiamo volutamente evitato di esporre una public surface prima di capire il problema.

Ora abbiamo abbastanza contesto per fare una scelta concreta.

Order Operations ha bisogno di un contratto fra la UI operativa e le capability backend. Ma il fatto che il framework possa generare controller in pochi minuti non significa che ogni azione immaginabile sia già pronta per diventare una promessa.

Il contratto deve seguire l'analisi funzionale.

## Partiamo dal journey, non dagli endpoint

Il journey corrente è:

```text
operatore
→ apre la console
→ vede ordini problematici
→ apre un ordine
→ comprende la causa
→ decide Action / Wait / Escalation
```

A questo punto della narrazione, ciò che abbiamo definito abbastanza bene riguarda soprattutto la **lettura**.

Sappiamo come distinguere `OrderStatus`, `PaymentStatus` e `ShipmentStatus`. Sappiamo che Order Operations può produrre una classificazione operativa derivata senza diventare source of truth dei domini sottostanti. Sappiamo anche che authorization e tenant isolation sono quality floor.

Non abbiamo ancora definito abbastanza bene refund, payment retry, shipment retry, force transition o altre remediation con side effect.

Un generatore potrebbe comunque produrre:

```http
POST /orders/{id}/refund
POST /orders/{id}/retry-payment
```

Il codice potrebbe compilare.

Il contratto sarebbe prematuro.

Non sappiamo ancora quali stati permettano l'azione, quale team ne possieda la semantica, come funzioni l'idempotenza economica, quale audit serva e quale comportamento sia corretto quando il provider risponde in modo incerto.

Pubblicare l'endpoint adesso significherebbe **execution davanti all'analisi funzionale**.

## Una richiesta apparentemente locale attraversa ESI

Product e Operations vogliono ridurre il lavoro manuale.

Payments & Risk ricorda che refund e retry possono produrre conseguenze economiche e non possono essere definiti unilateralmente dal team della console. Security deve stabilire chi abbia autorità per eseguire una action. Legal e Compliance possono imporre audit o retention. Platform Engineering vuole evitare che ogni prodotto inventi error model, retry e correlation convention incompatibili.

“Aggiungiamo due endpoint” si rivela quindi per ciò che è: una decisione cross-domain che deve aspettare semantica condivisa.

La capacità di dire **non ancora** è parte del contract design.

## Interaction style: semplice perché il journey è semplice

Per la prima baseline scegliamo HTTP request/response con JSON.

Non perché REST sia il default universale.

Il consumer è una web UI, il journey è interattivo e read-oriented e non richiede push continuo né temporal decoupling per ottenere la vista. GraphQL, gRPC, WebSocket o messaging non comprano oggi una proprietà abbastanza importante da giustificarne il costo.

Fit before fashion continua quindi a valere anche al boundary API.

## Capability 1 — individuare gli ordini problematici

La prima operation è:

```http
GET /api/problematic-orders
```

Una response possibile è:

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

Il contratto non espone `payment_state_code`, `shipment_tbl_status` o flag di persistenza. Espone concetti che il consumer deve comprendere.

È coerente con la raccomandazione di Azure Architecture Center di modellare l'API sul dominio e non sullo schema interno: [Microsoft Learn — API design](https://learn.microsoft.com/azure/architecture/microservices/design/api-design).

La scelta di mantenere tre stati distinti è altrettanto intenzionale. Un singolo:

```json
{"status":"Problem"}
```

sarebbe più semplice da renderizzare, ma distruggerebbe informazione necessaria all'investigazione. Il frontend non deve ricostruire il dominio, ma il backend non deve nemmeno appiattirlo fino a renderlo inutile.

## Capability 2 — leggere una vista operativa, non “l'Order universale”

La seconda operation è:

```http
GET /api/orders/{orderId}/operational-view
```

`operational-view` non è un dettaglio cosmetico.

Dichiara che la rappresentazione appartiene a un consumer e a un journey precisi. Non stiamo creando un `OrderDto` globale destinato a diventare il modello comune di tutta ESI.

Questa scelta protegge gli altri contesti dal coupling a una rappresentazione costruita per Operations e permette alla vista di evolvere senza fingere che ogni campo descriva il concetto universale di ordine.

## La collection ha già un contratto di navigazione

Per la lista scegliamo inizialmente cursor pagination:

```http
GET /api/problematic-orders?cursor=...&limit=50
```

Il cursor rimane opaco al consumer.

La scelta nasce dal fatto che la collection può cambiare mentre l'operatore la attraversa e vogliamo mantenere libertà sulla strategia di query e sull'ordering interno.

Non è una dichiarazione che cursor sia sempre superiore all'offset. Se evidence futura mostrasse che la complessità non compra stabilità utile, potremmo rivalutarlo.

## Gli errori devono distinguere azioni diverse

Per errori HTTP che richiedono dettaglio applicativo useremo Problem Details, coerentemente con RFC 9457: [RFC 9457 — Problem Details for HTTP APIs](https://www.rfc-editor.org/rfc/rfc9457.html).

Per esempio:

```json
{
  "type": "urn:esi:problem:order-not-visible",
  "title": "Order is not visible",
  "status": 403,
  "detail": "The current operator cannot access this order."
}
```

La parte importante non è il formato.

È impedire che condizioni diverse collassino in un unico “errore”: non autenticato, non autorizzato, ordine non trovato, input invalido e dipendenza indisponibile richiedono comportamenti differenti da parte del consumer.

## Il failure behavior rimane aperto dove la semantica è ancora aperta

Supponiamo che Payments sia indisponibile mentre l'operatore apre la vista.

Possiamo fallire tutta la response, restituire dati parziali marcati come tali oppure mostrare l'ultimo dato noto con freshness esplicita.

Non scegliamo qui per comodità implementativa.

La decisione dipende dal rischio di indurre l'operatore ad agire su informazioni incomplete. Finché Product, Operations e i domini coinvolti non definiscono quale comportamento degradato sia accettabile, il contratto mantiene la decisione esplicitamente aperta.

Questo è un segno di completezza del reasoning, non una lacuna da nascondere.

Un contratto maturo sa dire anche:

> **questa promessa non è ancora stata definita.**

## Il compromesso del capitolo

L'esigenza è dare alla UI un boundary stabile e ridurre progressivamente il lavoro manuale.

La tensione è fra velocità di esposizione di nuove action e costo di promettere una semantica non ancora governata su authorization, audit, idempotenza, failure e ownership economica.

La decisione è quindi pubblicare nella baseline del Capitolo 9 le capability read-oriented e rinviare le remediation con side effect finché l'analisi funzionale cross-domain non le renda contract-ready.

Accettiamo di automatizzare meno di quanto il framework renderebbe tecnicamente possibile.

Non accettiamo invece di esporre operazioni economiche o customer-facing senza precondizioni, authorization, idempotency reasoning, ownership, audit quando necessario e failure semantics definite.

Il guardrail è l'API Contract versionato, insieme a review cross-domain, contract test e stop condition per gli agenti che implementano endpoint.

## Baseline del capitolo e capstone vivo

Il capstone è cumulativo: i capitoli successivi fanno evolvere lo stesso prodotto.

Il file vivo è:

```text
capstone/example-software-industries/products/order-operations/docs/api-contract.md
```

Nel repository corrente quel documento può contenere capability introdotte **dopo** questo capitolo — per esempio la Payment Escalation che verrà modellata nel Capitolo 11.

Questa sezione descrive invece la **baseline contract-ready raggiunta al Capitolo 9**: lista e vista operativa, con le remediation economiche ancora fuori scope.

La distinzione è importante. Non vogliamo congelare il capstone a ogni capitolo; vogliamo vedere la stessa promessa evolvere quando nuove analisi, pattern e failure semantics rendono sicuro aggiungere capability.

Il manoscritto conserva il reasoning nel momento in cui la decisione viene presa.

Il file del capstone conserva lo stato cumulativo più recente.

> **Un endpoint è facile da aggiungere. La disciplina è pubblicarlo soltanto quando sappiamo quale promessa siamo pronti a mantenere.**