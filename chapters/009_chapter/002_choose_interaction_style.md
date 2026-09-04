## Scegliere lo stile di interazione

“Usiamo REST” è spesso una decisione presa prima di aver descritto l'interazione.

Lo stesso vale per gRPC, GraphQL, WebSocket, webhook o messaging.

È la stessa inversione che abbiamo visto con tecnologie e pattern: partiamo dal nome della soluzione e poi cerchiamo un requisito che la giustifichi.

Qui useremo ancora **fit before fashion**.

> **Il protocollo viene dopo la relazione che producer e consumer devono avere.**

Le domande utili sono più fondamentali: il consumer ha bisogno di una risposta immediata? Deve scegliere dinamicamente la shape dei dati? Il server deve poter inviare aggiornamenti senza una nuova richiesta? Producer e consumer devono essere disponibili nello stesso momento? Il contratto è fra sistemi governati insieme oppure attraversa ownership indipendenti?

Queste forze restringono lo spazio delle opzioni molto meglio della preferenza personale per un protocollo.

## Quando il consumer deve ricevere una risposta adesso

Per un'interazione sincrona browser/backend o service-to-service, HTTP request/response è spesso un ottimo punto di partenza.

Dentro HTTP possiamo però modellare l'interazione in modi differenti.

**REST** mette al centro risorse e semantiche standard del protocollo. Un'operazione come:

```http
GET /orders/ORD-42
```

ha un fit naturale quando `Order` è una risorsa che il consumer deve leggere e quando vogliamo sfruttare metodi, status code, caching e altre semantiche HTTP invece di inventarne di parallele.

Azure Architecture Center evidenzia proprio il valore di interfacce REST che usano le semantiche HTTP per costruire contratti loosely coupled ed evolvibili: [Microsoft Learn — API design](https://learn.microsoft.com/azure/architecture/microservices/design/api-design) e [Microsoft Learn — RESTful web API design](https://learn.microsoft.com/azure/architecture/best-practices/api-design).

REST diventa meno naturale quando forziamo operazioni fortemente action-oriented dentro pseudo-risorse soltanto per rispettare una forma canonica. Il contratto deve servire il dominio, non una liturgia di URI.

**RPC**, e in particolare gRPC, parte invece da servizi e metodi:

```text
GetProblematicOrders()
EscalateOrder()
```

gRPC definisce servizi tipizzati e usa normalmente Protocol Buffers come IDL e formato dei messaggi: [gRPC — Introduction](https://grpc.io/docs/what-is-grpc/introduction/).

Può avere molto fit quando client e server sono sotto governance coordinata, code generation e typing forte riducono davvero attrito, oppure quando streaming e comunicazione service-to-service sono proprietà importanti.

La forma da chiamata di metodo non deve però farci dimenticare la rete. Timeout, partial failure, authorization, retry e compatibility continuano a esistere. Un `GetPrice()` remoto non ha le stesse proprietà di una function call in-memory, anche se l'IDE le rende visivamente simili.

## Quando il client ha esigenze di lettura molto diverse

**GraphQL** sposta una parte della decisione sulla shape della risposta verso il client. Lo schema rimane tipizzato, ma il consumer può scegliere quali campi comporre in una query: [GraphQL.org](https://graphql.org/).

Questa proprietà può essere preziosa quando web, mobile e altri client hanno viste molto differenti e la proliferazione di endpoint o l'over-fetching stanno diventando un costo reale.

Il prezzo è che la flessibilità del client diventa complessità del provider. Authorization a livello di campo o resolver, query cost, caching, N+1, governance dello schema e observability richiedono disciplina esplicita.

GraphQL non è “REST con più libertà”.

Compra una forma di flessibilità lato consumer e sposta il costo verso il server e la governance del contratto.

## Quando il server deve iniziare la conversazione

Se il consumer deve ricevere aggiornamenti frequenti senza effettuare una nuova richiesta ogni volta, possiamo avere bisogno di un canale più persistente.

**WebSocket** crea una comunicazione bidirezionale persistente dopo l'handshake iniziale: [RFC 6455 — The WebSocket Protocol](https://www.rfc-editor.org/rfc/rfc6455.html).

Ha senso quando il valore dipende davvero da push frequente e bassa latency. Ma la parola “real time” da sola non basta. Dobbiamo sapere quanto fresco debba essere il dato, quante connessioni dobbiamo mantenere, che cosa accada dopo una disconnessione e come il client recuperi informazioni perse.

Se polling ragionevole o un meccanismo unidirezionale più semplice soddisfano il requisito, una connessione bidirezionale persistente può essere costo non necessario.

Un **webhook** risolve una forza diversa. Non mantiene una connessione: permette a un sistema esterno di chiamare il nostro endpoint quando avviene un fatto. Riduce polling e disaccoppia il momento in cui noi chiediamo dall'istante in cui il provider produce il risultato.

In cambio introduce autenticità del sender, retry, duplicati, ordering, replay e una nuova superficie esposta in ingresso.

Una webhook `POST` è quindi soltanto la forma HTTP visibile. Il contratto reale comprende delivery semantics.

## Quando producer e consumer non devono essere contemporaneamente disponibili

Se il valore dell'interazione non richiede una risposta immediata e vogliamo disaccoppiare producer e consumer nel tempo, messaging può essere più appropriato del request/response.

Qui il contratto non descrive più soltanto una request e una response. Deve definire channel, message, operation e semantica di delivery. AsyncAPI formalizza proprio questa idea di contratto per sistemi event-driven: [AsyncAPI — Introduction](https://www.asyncapi.com/docs/concepts/asyncapi-document).

La separazione temporale può aumentare resilienza e autonomia. Ma introduce eventual consistency, duplicate processing, ordering, replay, dead letter e observability distribuita.

Ancora una volta il decoupling non elimina complessità.

Decide quale coupling vogliamo rimuovere e quale nuova responsabilità siamo disposti a governare.

## Una decision table, non un verdetto

| Forza principale | Candidato iniziale | Domanda che può smentirlo |
|---|---|---|
| risorsa/domain interaction sincrona | HTTP/REST | stiamo forzando un comando dentro una falsa risorsa? |
| operation-oriented service-to-service | RPC/gRPC | la governance dei client è abbastanza coordinata? |
| shape di lettura molto variabile fra client | GraphQL | possiamo governare query, auth e costo lato server? |
| push bidirezionale frequente | WebSocket | serve davvero una connessione persistente? |
| callback da un sistema esterno | webhook | come gestiamo autenticità, retry e duplicati? |
| temporal decoupling | messaging/async API | possiamo operare eventual consistency e delivery failure? |

La tabella non sceglie per noi.

Serve a mantenere l'ordine del reasoning:

```text
interaction need
→ forces
→ candidate styles
→ consequences
→ contract
```

non:

```text
tecnologia preferita
→ API che le assomiglia
```

> **Uno stile di interazione è corretto quando rende naturale il comportamento che il consumer e il provider devono davvero avere.**