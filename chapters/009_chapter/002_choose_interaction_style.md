## Scegliere lo stile di interazione

“Usiamo REST” è spesso una decisione presa prima di aver descritto l'interazione.

Lo stesso vale per GraphQL, gRPC, WebSocket o event-driven.

Come per ogni tecnologia del libro, partiamo dal fit.

> **Il protocollo viene dopo il comportamento che dobbiamo ottenere.**

### Request/response sincrono

Quando un consumer ha bisogno di chiedere qualcosa e ricevere una risposta immediata, HTTP request/response è spesso una scelta naturale.

Ma anche qui esistono stili diversi.

### REST

REST tende a modellare **risorse** e usa le semantiche standard di HTTP.

Azure Architecture Center sottolinea che un'interfaccia REST può sfruttare verbi, status code e proprietà come idempotenza e statelessness per creare interfacce evolvibili e loosely coupled.

Fonti:

- [Microsoft Learn — API design](https://learn.microsoft.com/azure/architecture/microservices/design/api-design)
- [Microsoft Learn — RESTful web API design](https://learn.microsoft.com/azure/architecture/best-practices/api-design)

Un esempio:

```http
GET /orders/ORD-42
```

è naturale quando `Order` è una risorsa del dominio esposta al consumer.

REST diventa meno naturale quando cerchiamo di forzare ogni operazione in una rappresentazione artificiale di risorsa.

### RPC e gRPC

RPC mette al centro operazioni e metodi.

```text
GetProblematicOrders()
EscalateOrder()
```

gRPC definisce servizi con metodi, parametri e tipi di ritorno; di default usa Protocol Buffers come Interface Definition Language e formato dei messaggi.

Fonte:

- [gRPC — Introduction](https://grpc.io/docs/what-is-grpc/introduction/)

Può essere un fit forte quando:

- client e server sono sotto governance tecnica coordinata;
- vogliamo contratti fortemente tipizzati;
- generazione client/server è utile;
- streaming o comunicazione service-to-service sono centrali;
- l'overhead di un protocollo binario e toolchain dedicata è giustificato.

Ma l'analogia con una chiamata locale può nascondere la realtà distribuita.

Una chiamata remota continua ad avere:

- latency;
- timeout;
- partial failure;
- retry;
- compatibility;
- authorization.

La sintassi da metodo non annulla la rete.

### GraphQL

GraphQL espone uno schema tipizzato e permette al client di specificare la forma dei dati che vuole ricevere.

Fonte:

- [GraphQL.org](https://graphql.org/)

Può essere utile quando diversi client hanno esigenze di lettura molto differenti e la possibilità di comporre query riduce proliferazione di endpoint o over-fetching.

Ma sposta complessità altrove:

- authorization a livello di campo o resolver;
- query cost analysis;
- caching;
- observability;
- N+1;
- governance dello schema.

Non è “REST più moderno”.

È un contratto con proprietà diverse.

### WebSocket

WebSocket permette comunicazione bidirezionale persistente tra client e server dopo un handshake iniziale.

Fonte:

- [RFC 6455 — The WebSocket Protocol](https://www.rfc-editor.org/rfc/rfc6455.html)

Può essere appropriato quando il server deve inviare aggiornamenti frequenti e a bassa latenza al client.

Non dobbiamo usarlo soltanto perché il requisito contiene la parola “real time”.

Prima chiediamo:

- quanto deve essere fresco il dato?
- chi produce gli aggiornamenti?
- quanti client restano connessi?
- che cosa succede dopo una disconnessione?
- come recuperiamo gli eventi persi?
- polling o server-sent update sarebbero sufficienti?

### Webhook

Un webhook inverte la direzione classica: invece di interrogare continuamente un provider, registriamo un endpoint che il provider chiamerà quando avviene qualcosa.

Questo riduce polling, ma introduce nuovi problemi:

- autenticità del sender;
- retry;
- duplicati;
- ordering;
- timeout;
- replay;
- endpoint pubblicamente raggiungibile.

Un webhook non è soltanto “una POST che arriva da fuori”.

È un'integrazione asincrona con semantica di delivery.

### Messaging ed event-driven API

Quando producer e consumer non devono essere temporalmente accoppiati, messaging può essere più appropriato del request/response.

AsyncAPI descrive il documento API come un contratto di comunicazione tra sender e receiver in un sistema event-driven, specificando channel, message e operation.

Fonte:

- [AsyncAPI — Introduction](https://www.asyncapi.com/docs/concepts/asyncapi-document)

La separazione temporale può migliorare resilienza e indipendenza, ma introduce:

- eventual consistency;
- delivery semantics;
- duplicate processing;
- ordering;
- replay;
- dead letter;
- observability distribuita.

Ancora una volta, il decoupling non elimina complessità.

La sposta.

### Un decision table minimale

| Esigenza | Candidato iniziale | Domanda critica |
|---|---|---|
| CRUD/domain resource | HTTP/REST | la risorsa è davvero il modello giusto? |
| operation-oriented service-to-service | RPC/gRPC | la governance dei client è coordinata? |
| client con shape dati molto variabile | GraphQL | possiamo governare query, auth e costi? |
| push bidirezionale frequente | WebSocket | serve davvero connessione persistente? |
| callback tra sistemi | Webhook | come gestiamo duplicati e autenticità? |
| temporal decoupling | messaging/async API | possiamo operare eventual consistency e delivery failure? |

Questa tabella non sceglie per noi.

Serve a impedire che il nome della tecnologia arrivi prima della domanda.