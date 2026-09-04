## HTTP: usare la semantica che esiste già

HTTP non è soltanto un tubo dentro cui trasportare JSON.

Metodi, status code, header, caching e conditional request portano una semantica condivisa da browser, proxy, gateway, librerie e client. Quando la ignoriamo, spesso finiamo per inventare un secondo protocollo dentro il primo.

La domanda non è quindi come rendere un'API “RESTful abbastanza”.

È capire quali proprietà HTTP corrispondano davvero all'intento del consumer e quali conseguenze abbiano su retry, side effect e intermediari.

## Safe e idempotent descrivono proprietà diverse

RFC 9110 definisce un metodo **safe** quando il client non richiede un cambiamento di stato sul server come parte della semantica della richiesta. Definisce invece **idempotente** un metodo quando più richieste identiche hanno lo stesso effetto intenzionale di una singola richiesta. Fra i metodi standard, `PUT`, `DELETE` e i metodi safe sono idempotenti: [RFC 9110 — HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html).

Queste proprietà diventano concrete quando la rete è incerta.

Immaginiamo:

```text
client invia richiesta
→ server applica l'operazione
→ la connessione cade prima della response
→ il client non sa che cosa sia successo
```

Il problema non è più soltanto quale status code restituire.

Il client deve decidere se possa ripetere l'intento senza produrre un secondo effetto business.

L'idempotenza riduce questa ambiguità.

## Un GET non deve nascondere un comando

Consideriamo:

```http
GET /orders/42?do=refund
```

Il server potrebbe implementarlo correttamente nel proprio codice. Il problema è il contratto con l'ecosistema HTTP.

Crawler, prefetch, cache e altri intermediari trattano `GET` come un metodo safe. Non si aspettano che leggere un URI produca un rimborso.

RFC 9110 richiama esplicitamente il rischio di inserire azioni unsafe in target raggiungibili tramite metodi safe.

Usare la semantica del protocollo significa quindi proteggere il sistema anche da consumer che non conoscono la nostra convenzione privata.

## PUT e POST sono scelte sul significato, non preferenze stilistiche

Una semplificazione utile è pensare a `PUT` come all'intento di creare o sostituire lo stato di una risorsa a un URI noto al client, mentre `POST` consegna una rappresentazione a una risorsa perché venga processata secondo la semantica del server.

Non è una formula che risolve ogni API.

Ci aiuta però a fare emergere la proprietà che ci interessa.

Se il client conosce l'identifier della risorsa e ripetere la stessa richiesta deve portare allo stesso stato desiderato, `PUT` può essere naturale.

Se invece stiamo esprimendo un comando che crea un nuovo effetto business, `POST` può avere più fit, ma dobbiamo progettare esplicitamente che cosa accada quando il client non sa se la prima richiesta sia riuscita.

La scelta del verbo arriva dopo l'intento.

## L'idempotenza business non dipende soltanto dal metodo

Operazioni come:

```text
CreatePayment
CreateRefund
SubmitOrder
```

possono essere non idempotenti dal punto di vista del business anche se viaggiano su un protocollo che permette retry.

Se una response si perde, non vogliamo che il secondo tentativo diventi un secondo addebito o un secondo rimborso.

Una strategia comune consiste nell'associare alla richiesta una **idempotency key** e conservare abbastanza stato da riconoscere il medesimo intento.

La parte importante non è il nome dell'header.

È l'invariante:

> **lo stesso intento business non deve trasformarsi in due effetti business soltanto perché il client non ha ricevuto la prima risposta.**

Azure Architecture Center raccomanda di identificare se un'operazione sia naturalmente idempotente e, quando non lo è, di gestire esplicitamente la possibilità di richieste duplicate: [Microsoft Learn — Web API implementation](https://learn.microsoft.com/azure/architecture/best-practices/api-implementation).

Questo significa anche definire che cosa rappresenti “lo stesso intento”. Una key riutilizzata con payload incompatibile non dovrebbe essere trattata ciecamente come un retry valido. La retention della key deve coprire una finestra di retry coerente con il business, non un numero scelto a caso dalla libreria.

## Idempotenza non significa risposta identica

Due richieste:

```text
DELETE /orders/42
```

potrebbero produrre:

```text
prima richiesta  → 204
seconda richiesta → 404
```

ed essere comunque idempotenti nel senso HTTP, perché lo stato finale desiderato rimane lo stesso: la risorsa non esiste.

Confondere idempotenza con “stesso body e stesso status code” sposta l'attenzione dalla proprietà che conta — l'effetto — alla forma della response.

## Retry è una policy end-to-end

L'idempotenza rende alcuni retry più sicuri.

Non rende i retry gratuiti.

Dobbiamo leggerli insieme al timeout, al budget di latency del journey, al backoff e al jitter, ai rate limit e alla capacità del sistema a valle. Dobbiamo inoltre sapere chi possieda il retry.

Se gateway, client applicativo e SDK riprovano tutti indipendentemente, un singolo intento può moltiplicarsi proprio quando il servizio downstream è più fragile.

Questo è il legame fra API contract e resilience pattern del Capitolo 7: il contratto deve dire abbastanza da permettere al consumer di capire **se**, **quando** e **come** un'operazione possa essere ritentata.

## La semantica del dominio viene prima del payload

Un endpoint come:

```http
PATCH /orders/42

{
  "payment_state_code": 7
}
```

non diventa un buon contratto perché usa un metodo HTTP plausibile.

Che cosa significa `7`? Chi possiede quella transizione? Il consumer sta esprimendo un intento di dominio o sta modificando un dettaglio dello storage?

Microsoft raccomanda di evitare API che riflettono direttamente lo schema interno e di modellare invece il dominio nel contratto: [Microsoft Learn — API design](https://learn.microsoft.com/azure/architecture/microservices/design/api-design).

Questo riporta tutto alla domanda iniziale:

> **Quale intento del consumer stiamo modellando, e quale effetto promettiamo se la richiesta viene ripetuta?**

Se non sappiamo rispondere, discutere `POST`, `PUT` o `PATCH` è prematuro.

> **HTTP ci offre semantica condivisa. Il nostro compito è usarla per rendere più chiaro il contratto, non per nascondere una semantica di dominio ancora indefinita.**