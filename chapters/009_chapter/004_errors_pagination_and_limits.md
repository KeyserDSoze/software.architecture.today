## Errori, collezioni e limiti fanno parte del contratto

Molte API vengono progettate con attenzione sul caso `200 OK` e improvvisate appena qualcosa va storto.

È un errore.

Per un consumer, capire **come una capability fallisce** è parte della capability stessa.

### Uno status code non racconta tutto

HTTP offre status code con semantica condivisa.

Un `404` comunica una classe di problema.

Un `403` ne comunica un'altra.

Un client spesso ha bisogno di informazioni applicative più precise: quale regola sia stata violata o quale campo sia invalido, se l'errore sia transitorio e se il consumer possa correggere la richiesta. Un identifier utile per supporto o tracing può essere altrettanto importante dello status code.

RFC 9457 definisce **Problem Details for HTTP APIs**, un formato machine-readable pensato proprio per evitare che ogni API inventi un proprio envelope di errore generico.

Fonte primaria:

- [RFC 9457 — Problem Details for HTTP APIs](https://www.rfc-editor.org/rfc/rfc9457.html)

Un esempio potrebbe essere:

```json
{
  "type": "urn:esi:problem:order-not-visible",
  "title": "Order is not visible to the current operator",
  "status": 403,
  "detail": "The operator is not authorized for this merchant.",
  "instance": "/problems/01J..."
}
```

Non useremo questo formato perché è uno standard e quindi “obbligatorio”.

Lo useremo quando evita di reinventare una convenzione già interoperabile.

### L'errore non deve perdere il dominio

Un errore come:

```json
{
  "error": "DatabaseException"
}
```

espone un dettaglio interno e spesso non aiuta il consumer.

Un errore come:

```json
{
  "code": "PAYMENT_STATE_DOES_NOT_ALLOW_REFUND"
}
```

può invece rappresentare una condizione del dominio.

Questo non significa esporre stack trace o dettagli sensibili.

RFC 9457 richiama esplicitamente il rischio di usare i problem detail come strumento di debug dell'implementazione e di esporre informazioni che aumentano la superficie d'attacco.

Il contratto di errore deve essere utile al consumer e prudente verso l'interno.

### Collection API: il dataset cresce

Questo endpoint funziona benissimo con 30 ordini:

```http
GET /problematic-orders
```

Che cosa succede con 3 milioni?

Una collection API deve decidere pagination, ordering e filtering, i limiti della page size e la stabilità del cursore. Deve soprattutto definire che cosa accada quando i dati cambiano fra due pagine, perché quella semantica è parte dell'esperienza del consumer.

Azure Architecture Center include pagination e filtering tra le considerazioni esplicite di design per API che devono evitare payload inutilmente grandi.

Fonte:

- [Microsoft Learn — RESTful web API design](https://learn.microsoft.com/azure/architecture/best-practices/api-design)

### Offset o cursor?

L'offset è intuitivo:

```http
GET /problematic-orders?offset=100&limit=50
```

Ma in dataset che cambiano rapidamente può produrre salti o duplicati e può diventare costoso a grandi offset, a seconda del datastore.

Un cursor può rendere più stabile la navigazione:

```http
GET /problematic-orders?cursor=eyJ...
```

Ma introduce una semantica da definire:

- il cursor scade?
- è opaco?
- incorpora ordering?
- può essere riutilizzato?
- che cosa succede se il criterio cambia?

Non esiste “pagination” come checkbox.

Esiste un contratto di navigazione.

### Filtering è anche una scelta di capability

Se accettiamo:

```http
?status=anything&field=anything&expression=anything
```

potremmo trasformare un'API di dominio in un query engine generico.

Più flessibilità aumenta la superficie di supporto e la complessità dell'authorization, rende possibili query più costose e può legare maggiormente il consumer al modello interno che volevamo nascondere.

Meglio esporre filtri coerenti con use case reali.

### Rate limiting

Ogni API ha una capacità finita, anche quando non espone esplicitamente un limite.

Un contratto maturo deve chiarire almeno:

- quali limiti esistono;
- a quale identità si applicano;
- che cosa accade quando vengono superati;
- se e quando il client può ritentare.

La parte importante non è soltanto restituire `429`.

È evitare che client, gateway e retry policy trasformino un limite in un'amplificazione dell'incidente.

### Timeout fa parte dell'esperienza del consumer

Un'API che “prima o poi risponde” non ha un contratto utile.

Dobbiamo capire:

- quanto può aspettare il consumer;
- quale timeout applica il server verso downstream;
- quale budget resta per retry;
- quando un'operazione lunga deve diventare asincrona.

Azure Architecture Center descrive anche il pattern request-reply asincrono per operazioni HTTP che non possono completarsi ragionevolmente dentro la request iniziale.

Fonte:

- [Microsoft Learn — RESTful web API design](https://learn.microsoft.com/azure/architecture/best-practices/api-design)

### Il test del consumer

Per ogni response non felice chiediamo:

> **“Un consumer che conosce soltanto il contratto sa che cosa può fare dopo?”**

Se la risposta richiede leggere il codice server o chiamare il team proprietario, il contratto probabilmente è incompleto.