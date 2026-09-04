## Idee chiave

1. **un'API è una promessa, non un controller.** Il contratto comprende semantica, errori, side effect, authorization, compatibility e failure behavior.
2. **Il protocollo viene dopo l'interazione.** REST, gRPC, GraphQL, WebSocket, webhook e messaging risolvono problemi differenti e spostano complessità in punti differenti.
3. **L'API deve modellare il dominio, non lo storage.** Un refactoring del database non dovrebbe diventare automaticamente una breaking change.
4. **HTTP possiede già semantica.** Safe method, idempotenza, status code e header sono parte di un ecosistema condiviso; reinventarli senza motivo aumenta ambiguità.
5. **Idempotency riguarda l'effetto intenzionale.** Non richiede che ogni risposta sia identica.
6. **Gli errori sono parte della capability.** Un consumer deve sapere che cosa può fare quando l'happy path non si verifica.
7. **Pagination e filtering sono contratti.** Non semplici ottimizzazioni da aggiungere quando il dataset cresce.
8. **Backward compatibility va letta dal punto di vista del consumer.** Anche modifiche additive possono avere conseguenze semantiche.
9. **Versionare non elimina il costo del cambiamento.** Permette di distribuirlo nel tempo, pagando supporto parallelo e migrazione.
10. **Uno schema non contiene tutta la semantica.** OpenAPI, `.proto` e GraphQL schema sono preziosi, ma non sostituiscono invarianti, ownership, freshness e failure behavior.
11. **L'AI può generare contratti velocemente.** Per questo deve aumentare anche la qualità della review su semantica, compatibility e blast radius.
12. **Non pubblicare un endpoint prematuro è una decisione di design.** Order Operations non espone ancora command di remediation perché l'analisi funzionale non li ha definiti abbastanza bene.

## Artefatto operativo

L'artefatto del capitolo è:

> **API Contract**

```text
API / Capability
Purpose
Consumers
Interaction style
Authentication / authorization
Operations
Request semantics
Response semantics
Error model
Idempotency
Consistency / freshness
Pagination / filtering
Rate limits / quotas
Timeout expectations
Compatibility rules
Versioning / deprecation
Observability / correlation
Security notes
Examples
Open decisions
```

Lo snapshot corrente di Order Operations è in:

```text
capstone/acme-orders/docs/api-contract.md
```

## Cosa cambia con l'AI

L'AI abbassa fortemente il costo di produrre:

```text
API implementation
+ OpenAPI
+ client SDK
+ mock
+ test
+ documentation
```

Questo è un vantaggio enorme quando il contratto è buono.

È un acceleratore di coupling quando il contratto è cattivo.

Per questo il workflow consigliato è:

```text
functional understanding
→ contract intent
→ human/agent design alternatives
→ machine-readable schema
→ compatibility review
→ implementation
→ contract tests
```

non:

```text
database
→ generate API
→ publish
```

---

# Esercizi

## 1. Contract o database remoto?

Ti viene data questa API:

```http
GET /customers?table=customer_v2&where=status_code%3D4
```

Analizza:

- quali dettagli interni espone;
- quale coupling crea;
- quali problemi di authorization introduce;
- quali capability di dominio potrebbero nascondersi dietro questa query;
- come ridisegneresti il contratto senza conoscere ancora l'implementazione finale.

## 2. Scegli lo stile di interazione

Per ciascun caso scegli almeno due candidati e confronta i trade-off:

1. backend interno deve chiedere a un pricing service il prezzo di 50 prodotti;
2. dashboard deve ricevere aggiornamenti di mercato più volte al secondo;
3. provider pagamento deve notificare l'esito di un pagamento dopo alcuni minuti;
4. mobile app vuole scegliere campi diversi per schermate molto variabili;
5. ordine completato deve essere consumato indipendentemente da analytics, email e loyalty.

Non basta scrivere “REST”, “gRPC” o “Kafka”.

Spiega il fit.

## 3. Idempotency failure

Disegna un'API di refund.

Considera questo scenario:

```text
client invia refund
→ provider applica refund
→ response si perde
→ client ritenta
```

Definisci:

- unità di idempotenza;
- identifier;
- duplicate behavior;
- retention minima necessaria;
- response al retry;
- comportamento se stessa key viene riutilizzata con payload differente.

## 4. Problem Details

Prendi questi errori:

- ordine inesistente;
- operatore non autorizzato;
- pagamento in stato incompatibile;
- provider temporaneamente indisponibile;
- input invalido.

Progetta un error model HTTP coerente usando status code e, quando utile, Problem Details.

Per ogni errore indica che cosa può fare il consumer dopo averlo ricevuto.

## 5. Breaking change detector umano

Classifica come `compatible`, `breaking`, `depends`:

- aggiunta di un campo opzionale in response;
- nuovo valore di enum;
- rename di un campo;
- riduzione di page size massima;
- nuovo requisito di authorization;
- cambio da dati live a proiezione con 30 secondi di lag;
- nuovo campo required in request;
- modifica di ordering di default.

Spiega la prospettiva del consumer.

## 6. Versioning strategy

Hai un'API pubblica `v1` con centinaia di consumer.

Devi introdurre una modifica incompatibile.

Disegna:

- strategia di versioning;
- finestra di supporto;
- deprecation communication;
- usage telemetry;
- migration tooling;
- criterio per spegnere la versione precedente.

Poi ripeti l'esercizio assumendo che l'API abbia soltanto tre consumer nello stesso monorepo.

Confronta il costo di governance.

## 7. Pagination sotto modifica concorrente

Una lista ordinata per `createdAt desc` riceve nuovi elementi continuamente.

Confronta:

```text
offset pagination
vs
cursor pagination
```

Analizza:

- duplicati;
- salti;
- stabilità;
- costi;
- UX;
- semplicità.

Non scegliere automaticamente il cursor.

## 8. AI adversarial contract review

Prendi un'API reale o simulata e chiedi a un agente:

> “Assumi che questo contratto debba essere supportato per cinque anni e che esistano consumer fuori dal controllo del team. Cerca coupling all'implementazione, breaking change future probabili, ambiguità semantiche, failure non documentate e problemi di idempotenza.”

Classifica ogni osservazione:

```text
Accolta
Respinta
Da verificare
```

Poi aggiungi almeno un rischio che l'agente non ha trovato.

## 9. Order Operations — aggiungiamo una remediation

Nuovo requisito simulato:

> Un operatore autorizzato può richiedere un nuovo tentativo di pagamento per alcuni ordini falliti.

Prima di creare l'endpoint, aggiorna l'analisi funzionale con:

- stati da cui l'azione è permessa;
- permission;
- limite temporale;
- comportamento se esiste già un retry in corso;
- idempotency unit;
- audit;
- failure del provider;
- stato mostrato durante l'attesa.

Solo dopo disegna il contratto API.

## 10. Contract test strategy

Per l'API dell'esercizio precedente definisci test che verifichino:

- schema;
- authorization;
- idempotency;
- invalid transition;
- error format;
- compatibility;
- provider timeout;
- retry duplicato.

Indica quali proprietà non possono essere verificate da un semplice test generato dallo schema.

---

## Domande di autovalutazione

1. So spiegare un'API in termini di capability e consumer prima di parlare di endpoint?
2. So distinguere REST da RPC in termini di modello di interazione, non di preferenza personale?
3. Riesco a spiegare quando GraphQL, WebSocket o messaging spostano complessità invece di eliminarla?
4. So distinguere safe e idempotent?
5. So progettare un'operazione business in modo sicuro rispetto ai retry?
6. So definire un error model che guidi il comportamento del consumer?
7. So riconoscere un'API che espone lo schema interno?
8. Riesco a identificare breaking change semantiche oltre a quelle sintattiche?
9. So scegliere una strategia di versioning proporzionata al numero e al controllo dei consumer?
10. Riesco a progettare pagination e filtering come parte del contratto?
11. So distinguere ciò che uno schema machine-readable verifica da ciò che richiede una regola di dominio?
12. Saprei impedire a un coding agent di pubblicare un'API semanticamente prematura anche se il codice è corretto?

## Fonti principali del capitolo

- [Microsoft Learn — API design](https://learn.microsoft.com/azure/architecture/microservices/design/api-design)
- [Microsoft Learn — RESTful web API design](https://learn.microsoft.com/azure/architecture/best-practices/api-design)
- [Microsoft Learn — Web API implementation](https://learn.microsoft.com/azure/architecture/best-practices/api-implementation)
- [RFC 9110 — HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html)
- [RFC 9457 — Problem Details for HTTP APIs](https://www.rfc-editor.org/rfc/rfc9457.html)
- [gRPC — Introduction](https://grpc.io/docs/what-is-grpc/introduction/)
- [GraphQL.org](https://graphql.org/)
- [RFC 6455 — WebSocket Protocol](https://www.rfc-editor.org/rfc/rfc6455.html)
- [AsyncAPI — Introduction](https://www.asyncapi.com/docs/concepts/asyncapi-document)

## Corollario

Un endpoint è facile da generare.

Una promessa che può essere mantenuta, evoluta e compresa da chi dipende da noi richiede molto più giudizio.

> **Progetta il contratto per il consumer. Nascondi l'implementazione che il consumer non deve conoscere.**