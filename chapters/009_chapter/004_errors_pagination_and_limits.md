## Errori, collezioni e limiti fanno parte del contratto

Molte API vengono progettate con grande attenzione sul `200 OK` e improvvisate appena il percorso felice finisce.

È un errore di prospettiva.

Per un consumer, una capability non è definita soltanto da ciò che accade quando tutto funziona. È definita anche da ciò che può fare quando la risposta è incompleta, la richiesta è invalida, una dipendenza non risponde o il provider gli chiede di rallentare.

La domanda che un buon contratto deve permettere di rispondere è:

> **“Che cosa posso fare adesso, usando soltanto le informazioni promesse dall'API?”**

## L'errore deve guidare il consumer senza esporre l'interno

Uno status code HTTP comunica già una classe di risultato. `404`, `403`, `409` e `503` non sono semplici numeri: permettono a client e intermediari di riconoscere famiglie di comportamento.

Spesso, però, il consumer ha bisogno di più contesto. Deve sapere quale regola sia stata violata, se possa correggere la richiesta, se il problema sia temporaneo o se serva un'azione diversa.

RFC 9457 definisce **Problem Details for HTTP APIs**, un formato machine-readable pensato per descrivere errori applicativi senza costringere ogni API a inventare il proprio envelope: [RFC 9457 — Problem Details for HTTP APIs](https://www.rfc-editor.org/rfc/rfc9457.html).

Per esempio:

```json
{
  "type": "urn:esi:problem:order-not-visible",
  "title": "Order is not visible to the current operator",
  "status": 403,
  "detail": "The operator is not authorized for this merchant.",
  "instance": "/problems/01J..."
}
```

Il valore non sta nell'avere cinque campi standard.

Sta nel fatto che il consumer riceve una semantica stabile senza dover conoscere l'eccezione interna che l'ha prodotta.

Una response come:

```json
{
  "error": "DatabaseException"
}
```

rivela un dettaglio del provider e non dice quasi nulla su ciò che il client dovrebbe fare.

Un errore come:

```json
{
  "code": "PAYMENT_STATE_DOES_NOT_ALLOW_REFUND"
}
```

può invece esprimere una condizione di dominio utile, purché il contratto ne definisca il significato.

RFC 9457 mette anche in guardia dall'usare i problem detail come dump di debugging. Stack trace, query, dettagli di configurazione e informazioni sensibili non diventano sicuri soltanto perché sono dentro un formato standard.

## Una collection promette un modo di attraversare dati che cambiano

Consideriamo:

```http
GET /problematic-orders
```

Con trenta risultati la semantica sembra ovvia.

Con tre milioni di elementi, aggiornati continuamente, non lo è più.

Pagination, ordering, filtering e limiti non sono semplici ottimizzazioni di performance. Decidono che cosa significhi “scorrere la collection” mentre il dataset cambia.

Azure Architecture Center include esplicitamente pagination e filtering fra le decisioni di design necessarie per evitare payload eccessivi e offrire collezioni utilizzabili: [Microsoft Learn — RESTful web API design](https://learn.microsoft.com/azure/architecture/best-practices/api-design).

### Offset e cursor comprano proprietà differenti

L'offset è facile da comprendere:

```http
GET /problematic-orders?offset=100&limit=50
```

Ma se nuovi elementi entrano in testa alla lista fra due richieste, il consumer può vedere duplicati o saltare risultati. A seconda del datastore, offset elevati possono inoltre diventare costosi.

Un cursor opaco:

```http
GET /problematic-orders?cursor=eyJ...
```

può rendere più stabile la navigazione, ma crea a sua volta un contratto. Dobbiamo sapere se il cursor scada, quale ordering rappresenti, se possa essere riutilizzato e che cosa accada quando i criteri della collection cambiano.

Non esiste “pagination” come checkbox.

Esiste una promessa su come il consumer prosegue la lettura.

## Il filtering definisce quanta parte del modello rendiamo interrogabile

Offrire:

```http
?field=anything&operator=anything&value=anything
```

sembra molto flessibile.

Può anche trasformare un'API di dominio in un query engine generico sopra il modello interno.

Ogni nuovo campo interrogabile allarga la superficie di authorization, crea nuovi workload da sostenere e può congelare nomi e strutture che volevamo mantenere locali.

I filtri dovrebbero quindi partire dagli use case del consumer.

`category=Payment` può essere una capability intenzionale della console operativa.

`where=payments.internal_state_code=7` è probabilmente un leak di implementazione.

La flessibilità ha valore quando corrisponde a bisogni reali, non quando rende il provider incapace di cambiare il proprio modello.

## Rate limit e timeout definiscono il ritmo della relazione

Ogni API ha capacità finita, anche quando non la documenta.

Un rate limit utile deve chiarire a quale identità o quota si applichi, che cosa accada quando venga superato e se il consumer possa riprovare dopo una certa finestra.

Restituire `429` senza una policy coerente può essere insufficiente. Se il client reagisce con retry aggressivi, il meccanismo di protezione può diventare un amplificatore del sovraccarico.

Lo stesso vale per i timeout.

Un'API che “prima o poi risponde” non offre un contratto operativo utile. Il consumer deve sapere quale attesa sia ragionevole e il provider deve distribuire il latency budget sulle dipendenze a valle. Se un'operazione richiede troppo tempo per una normale request, può diventare necessario trasformarla in un workflow asincrono con stato interrogabile.

Azure Architecture Center descrive proprio l'async request-reply come una soluzione per operazioni che non possono concludersi ragionevolmente nella request iniziale: [Microsoft Learn — RESTful web API design](https://learn.microsoft.com/azure/architecture/best-practices/api-design).

## Il failure behavior è semantica di prodotto

Supponiamo che una vista operativa dipenda da Orders, Payments e Shipping e che Payments sia temporaneamente indisponibile.

Possiamo fallire l'intera response, restituire una vista parziale marcata come tale oppure mostrare un ultimo dato noto con freshness esplicita.

Nessuna delle tre risposte è universalmente corretta.

La scelta dipende da ciò che l'operatore farà dopo. Se un dato stale può causare un'azione economica sbagliata, essere “più disponibili” può essere peggio che dichiarare l'indisponibilità.

Questa decisione non dovrebbe emergere da un `catch` implementato in fretta.

È parte del contratto fra prodotto e consumer.

## Il test del consumer

Per ogni errore, limite o comportamento di navigazione possiamo usare una prova molto semplice:

> **Un consumer che conosce soltanto il contratto sa interpretare ciò che è successo e scegliere un'azione compatibile?**

Se deve leggere il codice server, conoscere una tabella interna o chiamare il team proprietario per capire se possa ritentare, il contratto sta lasciando semantica importante fuori dal boundary.

> **L'happy path descrive che cosa sa fare l'API. Il failure path descrive quanto possiamo fidarci della promessa quando il sistema reale smette di essere ideale.**