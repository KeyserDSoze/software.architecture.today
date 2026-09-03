## HTTP: usare la semantica che esiste già

HTTP non è soltanto un trasporto per JSON.

Metodi, status code, header, caching e conditional request portano semantica condivisa da client, proxy, gateway, browser e librerie.

Ignorarla significa spesso reinventare un protocollo dentro HTTP.

### Safe e idempotent non sono sinonimi

RFC 9110 definisce un metodo **idempotente** quando l'effetto intenzionale sul server di più richieste identiche è lo stesso dell'effetto di una singola richiesta.

Tra i metodi standard, `PUT`, `DELETE` e i metodi safe sono idempotenti.

Fonte primaria:

- [RFC 9110 — HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html)

Questa proprietà è importante soprattutto quando una risposta si perde.

Il client può trovarsi in questa situazione:

```text
request inviata
→ server applica l'operazione
→ connessione cade
→ client non sa se l'operazione è avvenuta
```

Se l'operazione è idempotente, il retry può essere molto più sicuro.

### GET non deve nascondere comandi

Questo endpoint è problematico:

```http
GET /orders/42?do=refund
```

`GET` viene trattato dall'ecosistema HTTP come metodo safe.

Crawler, prefetch, cache e tooling possono invocarlo senza aspettarsi side effect.

RFC 9110 richiama esplicitamente il rischio di inserire azioni unsafe dentro URI raggiungibili con metodi safe.

Il contratto deve rispettare la semantica del protocollo oppure dichiarare consapevolmente perché la deviazione è necessaria.

### PUT e POST non sono intercambiabili

Una semplificazione utile:

- `PUT` tende a rappresentare creazione/sostituzione di una risorsa a un URI noto al client;
- `POST` tende a consegnare una rappresentazione a una risorsa perché questa la processi secondo la propria semantica.

Non dobbiamo trasformare questa distinzione in religione.

Dobbiamo però capire quale proprietà ci serve.

Se il client può scegliere un identifier stabile e ripetere la stessa richiesta senza creare duplicati, `PUT` può essere un fit naturale.

Se l'operazione rappresenta un comando non naturalmente idempotente, possiamo aver bisogno di un meccanismo applicativo.

### Idempotency key

Operazioni come:

```text
CreatePayment
CreateRefund
SubmitOrder
```

possono produrre danni seri se un retry crea una seconda operazione business.

Una strategia comune è associare alla richiesta una chiave idempotente e conservare abbastanza stato da riconoscere richieste duplicate.

Il punto architetturale non è l'header specifico.

È l'invariante:

> **lo stesso intento business non deve diventare due effetti business soltanto perché la rete è incerta.**

Azure Architecture Center raccomanda di identificare se un'operazione sia naturalmente idempotente e, quando non lo è, gestire esplicitamente i duplicati.

Fonte:

- [Microsoft Learn — Web API implementation](https://learn.microsoft.com/azure/architecture/best-practices/api-implementation)

### Idempotenza non significa stessa risposta

Due `DELETE` possono produrre:

```text
prima richiesta  → 204
seconda richiesta → 404
```

ed essere comunque idempotenti, perché lo stato finale desiderato è lo stesso: la risorsa non esiste.

Confondere idempotenza con “stesso response body” porta a contratti sbagliati.

### Retry è una decisione end-to-end

Sapere che un metodo è idempotente non autorizza retry illimitati.

Dobbiamo considerare:

- timeout;
- budget totale di latency;
- backoff;
- jitter;
- load sulla dipendenza;
- rate limiting;
- failure correlation.

Un retry localmente ragionevole può diventare parte di una retry storm.

Questo tema tornerà nel capitolo sui sistemi distribuiti.

### Il contratto non deve esporre il database

Consideriamo:

```http
PATCH /orders/42

{
  "payment_state_code": 7
}
```

Che cosa significa `7`?

Il consumer sta modificando un ordine o un dettaglio dello storage?

Chi garantisce che quella transizione sia valida?

Una API orientata al dominio potrebbe invece esporre un'operazione con significato esplicito oppure una rappresentazione di stato comprensibile.

Microsoft raccomanda di evitare il mirroring dello schema interno e di modellare il dominio nel contratto.

Fonte:

- [Microsoft Learn — API design](https://learn.microsoft.com/azure/architecture/microservices/design/api-design)

### La domanda prima del verbo

Prima di discutere `POST` vs `PUT`, chiediamo:

> “Quale intento del consumer stiamo modellando?”

Se non sappiamo rispondere, la scelta del metodo HTTP è prematura.

L'API non diventa semantica perché usiamo il verbo corretto.

Il verbo corretto diventa utile quando la semantica è già chiara.