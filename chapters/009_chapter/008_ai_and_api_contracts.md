## AI e API contract

Le API sono uno dei punti in cui l'AI può produrre molto valore e molto debito con la stessa velocità.

Un agente può generare in pochi minuti controller e DTO, OpenAPI e client SDK, test, mock server, documentazione e gateway policy. Proprio questa abbondanza rende facile confondere la completezza dell'impalcatura con la maturità del contratto.

Questa capacità rende ancora più importante separare **generazione del contratto** da **decisione sul contratto**.

### Il rischio della CRUD gravity

Se chiediamo a un agente:

> “Esponi il modulo Orders via REST.”

è plausibile ottenere qualcosa come:

```text
GET    /orders
GET    /orders/{id}
POST   /orders
PUT    /orders/{id}
DELETE /orders/{id}
```

La struttura è familiare.

Potrebbe anche essere tecnicamente corretta.

Ma non sappiamo se il dominio supporti davvero CRUD generico.

Un ordine potrebbe:

- non essere eliminabile;
- avere transizioni controllate;
- richiedere audit;
- dipendere da payment e shipment;
- avere comandi con invarianti specifici.

L'AI tende a completare pattern riconoscibili.

Il nostro lavoro è verificare se il pattern coincide con la semantica del prodotto.

### Dallo schema al dominio, non il contrario

Un agente può leggere il database e generare API automaticamente.

È utile per esplorazione o scaffolding.

È pericoloso come design authority.

Microsoft Azure Architecture Center raccomanda di non modellare l'API come mirror dello schema interno.

Fonte:

- [Microsoft Learn — API design](https://learn.microsoft.com/azure/architecture/microservices/design/api-design)

Quindi una pipeline del tipo:

```text
database schema
→ AI
→ public API
```

ha bisogno di un gate semantico molto forte.

Meglio:

```text
functional model
+ consumer needs
+ domain boundaries
→ contract intent
→ AI-assisted schema/prototype
→ review
```

### AI come contract reviewer

Un uso molto più interessante è chiedere all'AI di criticare un contratto già motivato.

Per esempio:

> “Assumi che questa API debba essere supportata per cinque anni. Cerca breaking change nascoste, coupling all'implementazione, campi ambigui e operazioni non idempotenti.”

Oppure:

> “Elenca tutte le assunzioni che un client dovrebbe fare per usare correttamente questa API ma che non sono documentate.”

Oppure:

> “Prova a costruire tre consumer diversi e segnala dove il contratto li costringe a conoscere dettagli interni.”

Questo sfrutta l'AI per aumentare la varietà della review.

### Schema diff automatico

Quando abbiamo OpenAPI, Protocol Buffers o GraphQL schema, possiamo usare tooling automatico e agenti per confrontare versioni.

Un workflow possibile:

```text
contract v1
→ change
→ schema diff
→ breaking-change detector
→ agent semantic review
→ contract tests
→ human approval
```

Lo schema diff può trovare cambiamenti sintattici.

L'agent review può cercare incompatibilità semantiche che il diff non vede.

L'umano decide se il rischio è accettabile.

### Generated clients aumentano il blast radius

La code generation riduce il costo di adozione di un contratto.

Questo è utile.

Ma può anche aumentare rapidamente il numero di consumer.

Se dieci team generano client da un'API, una decisione sbagliata nel contratto può diffondersi molto più velocemente.

Ancora una volta:

> **quando execution e adoption diventano economiche, la qualità della decisione iniziale pesa di più.**

### Test generati

Un agente può generare centinaia di test da OpenAPI.

I controlli generati verificano bene schema, status code, required field, example e serialization.

Non verificano automaticamente business invariant e authorization semantics, idempotency reale o correctness sotto retry. Freshness, compatibility semantica e failure behavior fra dipendenze richiedono evidence diverse dalla sola conformità allo schema.

La quantità di contract test non sostituisce la qualità del contratto.

### Tool use e API per agenti

Quando un'API viene esposta come tool a un agente AI, alcuni errori diventano ancora più importanti.

Un tool con nome ambiguo:

```text
updateOrder
```

può nascondere una quantità enorme di autorità.

Meglio capability più esplicite e con permission boundary chiare.

Per esempio:

```text
getOperationalOrderView
requestPaymentRetry
requestSupervisorEscalation
```

se e soltanto se queste capability esistono davvero nel modello funzionale.

Un agent tool contract dovrebbe rendere espliciti side effect e authorization, idempotency e confirmation requirement, blast radius e stop condition. Un tool non diventa sicuro perché l'endpoint sottostante è ben documentato.

Questo tema tornerà nei capitoli AI-native.

### Il gate umano utile

Non serve approvare manualmente ogni campo di ogni DTO.

Serve concentrare il gate sulle decisioni costose da cambiare: semantic meaning e public surface, authorization boundary e breaking change, side effect e operazioni irreversibili, fino ai contract che attraversano team diversi.

L'obiettivo non è rallentare la generazione.

È evitare che la velocità di generazione trasformi una convenzione accidentale in una promessa di lungo periodo.