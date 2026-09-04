## Idee chiave

Un'API è una promessa, non un controller.

La promessa comprende ciò che il consumer può osservare: significato di request e response, authorization, side effect, errori, idempotency, freshness, limiti e regole di evoluzione. L'implementazione interna dovrebbe restare fuori dal contratto finché non produce una conseguenza che il consumer deve davvero conoscere.

Per questo il protocollo viene dopo l'interazione. REST, gRPC, GraphQL, WebSocket, webhook e messaging non sono alternative su una scala di modernità. Rispondono a forze differenti: immediatezza della risposta, shape dei dati, direzione del push, temporal coupling, governance dei client e semantica di delivery.

Quando scegliamo HTTP conviene usare la semantica che il protocollo possiede già. Safe method, idempotenza, status code e header fanno parte di un ecosistema condiviso. L'idempotenza non significa ottenere la stessa response, ma proteggere l'effetto intenzionale da duplicazioni indesiderate. Per operazioni business non naturalmente idempotenti dobbiamo definire esplicitamente l'unità di intento e il comportamento dei retry.

Gli errori, la pagination, il filtering, i rate limit e i timeout fanno parte della capability perché determinano che cosa il consumer possa fare quando il sistema reale devia dall'happy path.

La compatibility aggiunge la dimensione temporale. Un contratto evolvibile riduce il bisogno di coordinare tutti i consumer nello stesso momento. Breaking change e incompatibilità possono essere semantiche anche quando lo schema resta formalmente valido. Versioning e deprecation sono strumenti per gestire questa convivenza, non sostituti di una strategia di compatibilità.

OpenAPI, Protocol Buffers, JSON Schema e GraphQL schema rendono una parte della promessa machine-readable e quindi verificabile. Non contengono automaticamente ownership, domain invariant, freshness o failure behavior. Per questo il nostro **API Contract** affianca schema e significato senza duplicare la spec.

Con l'AI il costo di generare e adottare una public surface è molto più basso. Questo amplifica sia i contratti buoni sia quelli sbagliati. Il gate deve quindi spostarsi sulle decisioni semantiche con alto blast radius, mentre scaffolding, schema diff e molta parte dei contract test possono essere automatizzati.

Order Operations applica questa disciplina in modo esplicito: al Capitolo 9 la baseline contract-ready è read-oriented. Le remediation economiche non vengono pubblicate soltanto perché tecnicamente facili da implementare. Verranno aggiunte quando analisi funzionale, ownership, authorization, idempotency e failure semantics saranno abbastanza definite.

## Artefatto operativo — API Contract

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

Il file cumulativo vivo di Order Operations è:

```text
capstone/example-software-industries/products/order-operations/docs/api-contract.md
```

Il capstone continua a evolvere nei capitoli successivi. Per questo il documento corrente del repository può contenere capability che, a questo punto della narrazione, non sono ancora state introdotte. Il Capitolo 9 descrive la baseline e il reasoning che precedono quelle evoluzioni; il file vivo conserva lo stato cumulativo più recente del prodotto.

## Cosa cambia con l'AI

L'AI rende economico produrre insieme:

```text
API implementation
+ machine-readable spec
+ client SDK
+ mock
+ test
+ documentation
```

Questo è un acceleratore quando la promessa è già chiara.

Diventa un acceleratore di coupling quando il contratto nasce direttamente dal database, da un framework CRUD o da un prompt troppo generico.

Il workflow che vogliamo favorire è:

```text
functional understanding
→ consumer need
→ contract intent
→ design alternatives
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

1. un backend interno deve chiedere a un pricing service il prezzo di 50 prodotti;
2. una dashboard deve ricevere aggiornamenti di mercato più volte al secondo;
3. un provider pagamento deve notificare l'esito di un pagamento dopo alcuni minuti;
4. una mobile app vuole scegliere campi diversi per schermate molto variabili;
5. un ordine completato deve essere consumato indipendentemente da analytics, email e loyalty.

Non basta scrivere “REST”, “gRPC” o “Kafka”.

Spiega quali forze rendono il candidato adatto e quale complessità sposta altrove.

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
- comportamento se la stessa key viene riutilizzata con payload differente.

Poi indica quale componente possiede la deduplication e che cosa accade se anche il provider esterno implementa una propria idempotency key.

## 4. Problem Details

Prendi questi errori:

- ordine inesistente;
- operatore non autorizzato;
- pagamento in stato incompatibile;
- provider temporaneamente indisponibile;
- input invalido.

Progetta un error model HTTP coerente usando status code e, quando utile, Problem Details.

Per ogni errore indica che cosa può fare il consumer dopo averlo ricevuto e quali dettagli interni non devono attraversare il boundary.

## 5. Breaking change detector umano

Classifica come `compatible`, `breaking`, `depends`:

- aggiunta di un campo opzionale in response;
- nuovo valore di enum;
- rename di un campo;
- riduzione della page size massima;
- nuovo requisito di authorization;
- cambio da dati live a proiezione con 30 secondi di lag;
- nuovo campo required in request;
- modifica dell'ordering di default.

Spiega sempre la prospettiva del consumer e indica quali casi uno schema diff automatico potrebbe non riconoscere.

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

Confronta il costo di governance e il bisogno di compatibilità temporale.

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
- semplicità;
- significato dell'ordering mentre il dataset cambia.

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

Poi aggiungi almeno un rischio che l'agente non ha trovato e identifica quale evidence servirebbe per decidere sui punti `Da verificare`.

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
- stato mostrato durante l'attesa;
- ownership della decisione economica.

Solo dopo disegna il contratto API.

Se un punto rimane non deciso, indica se impedisce di considerare la capability contract-ready.

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

Indica quali proprietà non possono essere verificate da un semplice test generato dallo schema e quale altra evidence serva.

## 11. Il contratto che l'AI ha diffuso troppo velocemente

Un agente ha generato un endpoint interno, OpenAPI e client SDK. In due settimane sei team hanno iniziato a usarlo.

Scopriamo poi che un campo chiamato `status` espone direttamente una classificazione interna che dobbiamo cambiare.

Progetta un piano che distingua:

```text
compatibility immediata
telemetria sui consumer
nuova semantica
migration path
deprecation
rimozione
```

Poi rispondi:

> quale gate prima della pubblicazione avrebbe ridotto il blast radius senza rallentare inutilmente lo scaffolding?

---

## Domande di autovalutazione

1. So spiegare un'API in termini di capability e consumer prima di parlare di endpoint?
2. So distinguere REST da RPC in termini di modello di interazione, non di preferenza personale?
3. Riesco a spiegare quando GraphQL, WebSocket o messaging spostano complessità invece di eliminarla?
4. So distinguere safe e idempotent?
5. So progettare un'operazione business in modo sicuro rispetto ai retry?
6. So definire l'unità di intento di una idempotency key?
7. So creare un error model che guidi il comportamento del consumer?
8. So riconoscere un'API che espone lo schema interno?
9. Riesco a identificare breaking change semantiche oltre a quelle sintattiche?
10. So scegliere una strategia di versioning proporzionata al numero e al controllo dei consumer?
11. Riesco a progettare pagination e filtering come parte del contratto?
12. So distinguere ciò che uno schema machine-readable verifica da ciò che richiede una regola di dominio?
13. So descrivere freshness e failure behavior come parte della promessa?
14. Saprei impedire a un coding agent di pubblicare un'API semanticamente prematura anche se il codice è corretto?
15. So decidere quali parti della compatibility review delegare al tooling e quali richiedono judgment?

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

Una promessa che può essere mantenuta, compresa ed evoluta da chi dipende da noi richiede più giudizio.

> **Progetta il contratto per il consumer. Nascondi l'implementazione che il consumer non deve conoscere. E non pubblicare una promessa prima di sapere che cosa significa.**