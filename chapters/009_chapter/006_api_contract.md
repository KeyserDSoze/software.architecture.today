## L'artefatto: API Contract

Una specifica OpenAPI può descrivere molto bene endpoint, schema, parameter e response.

Non necessariamente descrive tutta la promessa.

Per questo nel libro useremo un artefatto più ampio:

> **API Contract**

L'obiettivo non è duplicare una spec machine-readable. È conservare ciò che un consumer deve sapere per usare correttamente una capability senza conoscere l'implementazione interna e ciò che il team deve ricordare per evolverla senza rompere quella relazione.

## Struttura base

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

Non ogni contratto richiede ogni voce.

Una capability interna allo stesso processo può avere una superficie minima. Un'API pubblica o un evento persistente consumato da team indipendenti può richiedere molto più dettaglio.

La profondità segue blast radius e costo del cambiamento.

## Purpose e consumer vengono prima delle operation

Prima degli endpoint scriviamo perché il contratto esiste.

Per Order Operations potrebbe essere:

```text
Consentire agli operatori di individuare e investigare ordini
che richiedono attenzione operativa.
```

Questa frase è un guardrail. Evita che la public surface diventi progressivamente un accesso generico a tutti i dati disponibili soltanto perché il backend li può leggere.

Subito dopo rendiamo visibili i consumer.

```text
Current:
- Order Operations Web UI

Possible future:
- Operations CLI

Not in scope:
- external partners
```

Il numero e l'autonomia dei consumer cambiano il costo di compatibility, versioning e deprecation. Un contratto senza consumer identificati è difficile da governare perché non sappiamo chi stiamo promettendo di non sorprendere.

## Interaction style deve conservare la ragione della scelta

Scrivere soltanto:

```text
REST
```

perde il reasoning.

Meglio:

```text
HTTP request/response con JSON
perché il journey è interattivo e read-oriented;
non richiede push continuo né temporal decoupling.
```

Se il requisito cambia, sappiamo quale assunzione rivalutare.

Il contratto non rende eterna la tecnologia. Conserva il fit che l'ha resa ragionevole.

## Ogni operation deve esplicitare l'intento

Per una operation significativa vogliamo almeno:

```text
Intent
Method / channel
Input
Output
Authorization
Side effects
Idempotency
Errors
Timing expectation
```

La voce più importante è spesso `Intent`.

Un endpoint può avere schema perfetto e rimanere ambiguo se non sappiamo quale risultato business stia promettendo. `POST /orders/42/action` dice molto meno di `requestPaymentEscalation` se la seconda capability è ciò che il dominio ha realmente deciso.

Authorization e side effect devono stare vicini all'intento perché determinano quanta autorità il consumer riceve. Idempotency ed error semantics completano la promessa su cosa accada quando la rete o il client non si comportano idealmente.

## Freshness e consistency non devono restare implicite

Un payload può essere corretto dal punto di vista dello schema e sbagliato per il consumer perché troppo vecchio.

Per questo il contratto può dire:

```text
Source: live operational data
Freshness: dipende dalle source systems;
nessun read model asincrono in questa fase
```

oppure, quando esiste evidence sufficiente:

```text
Projection lag target: <= 5s p99
```

Il numero ha valore soltanto se nasce da un requisito e può essere osservato.

Quando serviamo last-known data o una vista parziale, anche quello deve diventare parte della semantica. Non possiamo lasciare al consumer il compito di indovinare se il valore sia live.

## Error model: ciò che cambia il comportamento del consumer

Non serve catalogare ogni eccezione interna.

Serve rendere esplicite le classi di failure che richiedono reazioni differenti:

```text
Unauthenticated
Unauthorized
Not found
Validation failure
Conflict
Dependency unavailable
Rate limited
```

Per HTTP, Problem Details può offrire un formato interoperabile quando serve dettaglio applicativo: [RFC 9457 — Problem Details for HTTP APIs](https://www.rfc-editor.org/rfc/rfc9457.html).

La regola rimane quella del capitolo: il consumer deve sapere che cosa può fare dopo, senza ricevere dettagli infrastrutturali che non gli appartengono.

## Idempotency: definire l'unità di intento

Scrivere semplicemente:

```text
Idempotent: yes
```

può essere troppo poco.

Per un'operazione economica potremmo voler specificare:

```text
Idempotency unit:
merchant + order + request key

Duplicate behavior:
return existing outcome;
do not create a second business effect

Retention:
TBD from the business retry window
```

In questo modo una proprietà che altrimenti rischierebbe di finire dispersa fra middleware, database e SDK diventa parte esplicita del contratto.

## Collection behavior e limiti

Per una collection documentiamo ciò che il consumer deve assumere su pagination, ordering, filtering e limiti. Se il cursor è opaco, lo dichiariamo. Se il massimo `limit` è un contratto, lo rendiamo visibile. Se alcuni filtri possono essere combinati e altri no, non lasciamo che il comportamento emerga casualmente dalla query implementation.

Lo stesso vale per rate limit e timeout. Non dobbiamo inventare numeri prima di avere il contesto, ma dobbiamo sapere quali decisioni sono ancora aperte e quali proprietà dovranno essere quantificate prima della production readiness.

## Compatibility e lifecycle

Il contratto dovrebbe dichiarare quali modifiche consideriamo compatibili, come introduciamo una breaking change e quale policy governa versioning e deprecation.

Non serve decidere oggi la durata di supporto di una `v2` che non esiste.

Serve evitare che la prima breaking change costringa il team a inventare l'intero lifecycle sotto pressione.

La compatibility policy può essere semplice:

```text
Preferire additive change semanticamente compatibili.
Considerare breaking le modifiche che cambiano
assunzioni osservabili dei consumer.
Versionare quando la compatibilità non è preservabile.
```

Il livello di formalità crescerà con il numero e l'indipendenza dei consumer.

## Observability attraversa il contratto

Quando una request fallisce attraverso più componenti, provider e consumer devono riuscire a parlare dello stesso evento.

Il contratto può quindi definire request/correlation identifier, trace context e metriche rilevanti per error class o versione. Azure Architecture Center include trace context e distributed tracing fra le considerazioni di API design: [Microsoft Learn — RESTful web API design](https://learn.microsoft.com/azure/architecture/best-practices/api-design).

Observability non è soltanto implementazione interna quando il consumer ha bisogno di un identifier per supporto, audit o diagnosi.

## Rendere verificabile ciò che possiamo

Una parte del contratto deve diventare executable.

Schema e required field possono essere validati automaticamente. Possiamo testare status code, authorization, error format e invarianti di pagination. Tooling dedicato può rilevare alcune breaking change e i contract test possono verificare che provider e consumer condividano ancora la stessa forma.

Idempotency reale, domain invariant, freshness e failure behavior richiedono spesso test e evidence più ricchi della sola conformità allo schema.

Lo approfondiremo nel capitolo sul testing.

## Non duplicare la spec

Se OpenAPI descrive request e response, l'API Contract deve linkarla, non copiarla riga per riga.

L'artefatto aggiunge ciò che la spec esprime meno bene:

```text
semantica
ownership
consumer assumptions
trade-off
freshness
failure behavior
compatibility policy
open decisions
```

La documentazione utile riduce ambiguità.

La documentazione duplicata crea drift.

## Definition of contract-ready

Prima di implementare o delegare a un agente un contratto importante dovremmo poter rispondere a queste domande:

1. Quale capability espone e per quale consumer?
2. Quale interaction style ha fit con il journey?
3. Quali side effect e authorization boundary introduce?
4. Quale semantica di retry e idempotency promette?
5. Come segnala i failure che cambiano il comportamento del consumer?
6. Quali dati sono autorevoli e quale freshness è osservabile?
7. Come funzionano collection, limiti e timeout rilevanti?
8. Come può evolvere senza coordinamento simultaneo dei consumer?
9. Quale parte del contratto è verificabile automaticamente e quale richiede review semantica?

Se molte risposte sono:

> “lo decidiamo nel controller”

non siamo ancora contract-ready.

> **L'API Contract non serve a documentare un endpoint dopo che esiste. Serve a rendere esplicita la promessa prima che l'implementazione la renda costosa da cambiare.**