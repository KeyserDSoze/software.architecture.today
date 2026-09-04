## AI e API contract

Le API sono uno dei punti in cui l'AI può produrre valore e debito con la stessa velocità.

Un agente può generare controller, DTO, OpenAPI, client SDK, mock server, test e documentazione in pochi minuti. Può anche aggiornare decine di consumer quasi istantaneamente.

Questa abbondanza cambia l'economia della public surface.

Prima un contratto mediocre incontrava almeno il freno del lavoro necessario per implementarlo e adottarlo. Oggi generazione e adozione possono essere entrambe economiche.

Se il contratto è buono, è un vantaggio enorme.

Se il contratto è cattivo, il coupling si diffonde molto più velocemente.

> **Quando execution e adoption diventano economiche, il costo di una decisione semantica sbagliata pesa di più.**

## CRUD gravity

Se chiediamo:

> “Esponi il modulo Orders via REST.”

un agente ha moltissimi esempi plausibili a cui assomigliare:

```text
GET    /orders
GET    /orders/{id}
POST   /orders
PUT    /orders/{id}
DELETE /orders/{id}
```

La struttura è familiare e può perfino passare tutti i test generati.

Ma un ordine non è necessariamente una risorsa CRUD generica. Potrebbe non essere eliminabile. Le transizioni possono avere invarianti, authorization e audit. Alcune action possono coinvolgere Payments o Shipping e richiedere idempotenza specifica.

Il problema non è che l'AI “non capisca REST”.

È che completa molto bene forme riconoscibili quando il prompt non contiene abbastanza semantica.

La stessa CRUD gravity che rende veloce lo scaffolding può trasformare il database mentale del framework nella public API del prodotto.

## Dal modello funzionale allo schema, non dal database al contratto

Un agente può leggere tabelle e generare API automaticamente.

Questo è utile per esplorazione, admin tooling o prototipi controllati.

È pericoloso quando il risultato viene trattato come design authority.

Microsoft Azure Architecture Center raccomanda esplicitamente di evitare API che riflettono direttamente l'implementazione o lo schema interno: [Microsoft Learn — API design](https://learn.microsoft.com/azure/architecture/microservices/design/api-design).

Una pipeline come:

```text
database schema
→ AI
→ public API
```

salta ownership, domain meaning e consumer need.

Un workflow più sano è:

```text
functional model
+ consumer need
+ domain boundary
+ quality constraints
→ contract intent
→ AI-assisted alternatives
→ schema/prototype
→ semantic review
→ implementation
```

L'AI entra presto.

Non entra prima del significato.

## L'AI è un ottimo reviewer di assunzioni nascoste

Una volta che il contratto ha una motivazione, possiamo usare un agente in modo molto più interessante che come generatore di CRUD.

Per esempio:

> “Assumi che questa API debba essere supportata per cinque anni e che alcuni consumer non siano sotto il nostro controllo. Cerca breaking change future probabili, coupling all'implementazione, campi ambigui, failure non documentati e operazioni la cui idempotenza non è chiara.”

Oppure:

> “Elenca tutte le assunzioni che un client deve fare per usare correttamente questa API ma che non compaiono nel contratto.”

Oppure ancora:

> “Simula tre consumer con esigenze diverse e mostra dove la public surface li costringe a conoscere dettagli che appartengono al provider.”

Il valore dell'AI sta qui nella varietà delle prospettive. Può produrre rapidamente consumer fittizi, edge case e scenari che il team autore del contratto tende naturalmente a sottovalutare.

## Schema diff e review semantica fanno lavori diversi

Quando abbiamo OpenAPI, Protocol Buffers o GraphQL schema, possiamo automatizzare una parte della compatibility review:

```text
contract v1
→ change
→ schema diff
→ breaking-change detector
→ agent semantic review
→ contract tests
→ human approval dove serve
```

Lo schema diff è molto bravo a trovare rimozioni, rename, cambi di tipo e required property.

Non vede automaticamente che un nuovo enum value rompe una state machine del consumer, che l'ordering è cambiato o che la response ora può essere stale per trenta secondi.

L'agent review può cercare queste incompatibilità semantiche.

L'umano mantiene il gate sulle decisioni con alto blast radius.

Le tre forme di controllo sono complementari.

## Client generati amplificano la promessa

La code generation rende facile adottare un'API.

Dieci team possono generare il proprio client quasi senza costo. Un agent tool può essere creato sopra l'endpoint. Un workflow può iniziare a dipendere dal nuovo campo subito dopo il merge.

Questo è esattamente ciò che vogliamo quando il contratto è stabile e intenzionale.

Ma significa anche che un errore nella public surface può diventare dipendenza organizzativa molto prima che il team provider si renda conto del proprio blast radius.

La generazione non riduce il bisogno di compatibility discipline.

Lo aumenta.

## Test generati: molta copertura della forma, non della promessa completa

Da una spec machine-readable un agente può generare moltissimi test su serialization, required field, status code, example e schema.

Sono controlli utili.

Non dimostrano automaticamente che un refund sia idempotente sotto retry reale, che authorization corrisponda alle policy del dominio o che una vista parziale non induca un operatore in errore. Non verificano da soli freshness, backward compatibility semantica o behavior durante failure di dipendenze.

La quantità di test generati può dare un senso di completezza che il contratto non ha ancora guadagnato.

Dobbiamo quindi distinguere:

```text
schema conformance
≠
contract correctness
```

## API come tool per agenti

Quando una capability viene esposta direttamente a un agente AI, la precisione del contratto diventa ancora più importante.

Un tool chiamato:

```text
updateOrder
```

può nascondere un'autorità enorme. Non sappiamo se cambi indirizzo, stato, pagamento, note o più cose insieme.

Capability più strette possono rendere più chiari permission boundary e side effect:

```text
getOperationalOrderView
requestPaymentEscalation
requestSupervisorEscalation
```

ma soltanto se queste capability esistono davvero nel modello funzionale.

Un tool contract deve rendere leggibili authorization, side effect, idempotency, confirmation requirement, blast radius e stop condition. Un endpoint ben documentato non diventa automaticamente un tool sicuro se l'agente riceve più autorità di quella necessaria.

Questo tema tornerà nei capitoli AI-native.

## Il gate umano deve stare dove il cambiamento è costoso

Non serve che una persona approvi manualmente ogni property generata in un DTO.

Il gate umano ha più valore sulle decisioni che diventano costose da invertire: semantic meaning, public surface, authorization boundary, side effect, operazioni irreversibili, breaking change e contratti che attraversano team o organizzazioni differenti.

Il resto può essere fortemente automatizzato.

Questa è la stessa proporzionalità usata per gli ADR.

Più il contratto è reversibile e locale, più possiamo delegare. Più la promessa si diffonde, più serve judgment prima della diffusione.

> **L'AI può produrre un'API completa in pochi minuti. Il nostro lavoro è impedire che una convenzione generata in pochi minuti diventi una promessa di cinque anni senza il reasoning necessario.**