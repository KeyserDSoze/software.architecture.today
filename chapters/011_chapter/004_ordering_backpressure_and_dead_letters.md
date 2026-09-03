## Un sistema asincrono deve saper rallentare

Una queue può assorbire un picco.

Questo non significa che abbia eliminato il picco.

Lo ha **trasformato in backlog**.

Questa distinzione è fondamentale.

Supponiamo:

```text
producer rate = 500 msg/s
consumer capacity = 200 msg/s
```

La queue rimane disponibile.

Il producer continua a pubblicare.

La dashboard sembra verde.

Ma ogni secondo accumuliamo:

```text
300 messaggi di debito operativo
```

Dopo dieci minuti il problema non è più soltanto throughput.

È freshness.

Dopo un'ora può diventare recovery.

Una queue permette di **spostare nel tempo** il lavoro.

Non crea capacità dal nulla.

## Backpressure

Backpressure significa che il sistema possiede un modo per impedire a una parte veloce di saturare una parte più lenta.

Può essere implementata in modi diversi:

- limitare il producer;
- limitare concurrency dei consumer;
- applicare rate limiting;
- rifiutare lavoro oltre una soglia;
- degradare feature non essenziali;
- usare admission control;
- rallentare polling;
- scalare consumer se il workload lo giustifica;
- prioritizzare classi di lavoro.

La scelta dipende dal tipo di flusso.

Un sistema di audit potrebbe preferire accumulare backlog per un periodo.

Un sistema di notifiche real-time potrebbe preferire scartare messaggi ormai inutili dopo una TTL.

Un payment command non può essere semplicemente scartato perché “la coda è piena”.

## Backlog come metrica di prodotto

Una delle metriche più utili in un sistema asincrono non è soltanto:

```text
queue depth
```

ma:

```text
age of oldest message
```

Perché due backlog di 100.000 messaggi possono significare cose molto diverse.

Caso A:

```text
consumer throughput elevato
oldest message = 3 secondi
```

Caso B:

```text
consumer bloccato
oldest message = 45 minuti
```

La profondità dice quanto lavoro c'è.

L'età dice quanto siamo indietro rispetto alla promessa funzionale.

Per Order Operations, se Payments & Risk accetta un'escalation entro 5 minuti, la metrica significativa è più vicina a:

```text
escalation delivery lag
```

che al numero assoluto di record nella queue.

## Fail fast e queue limit

Una queue infinita è una forma di failure differito.

Se un downstream rimane indisponibile per ore e continuiamo ad accettare lavoro senza limite, possiamo creare:

- storage growth;
- recovery time enorme;
- messaggi ormai semanticamente vecchi;
- burst ingestibile quando il consumer torna;
- costi elevati;
- incidenti secondari.

AWS Well-Architected collega esplicitamente resilienza, timeout, retry limitati e queue bounded: il sistema deve evitare che i meccanismi di recovery amplifichino il guasto.

Fonti:

- [AWS Well-Architected — Control and limit retry calls](https://docs.aws.amazon.com/wellarchitected/latest/framework/rel_mitigate_interaction_failure_limit_retries.html)
- [AWS Well-Architected — Set client timeouts](https://docs.aws.amazon.com/wellarchitected/latest/framework/rel_mitigate_interaction_failure_client_timeouts.html)

## Retry path separato dal fast path

Un errore ricorrente nei consumer è:

```text
consume
→ fallisce
→ sleep
→ retry
→ sleep
→ retry
```

Se il consumer blocca la partition o la queue principale mentre aspetta un downstream degradato, un singolo messaggio problematico può trattenere messaggi sani.

Una strategia possibile separa:

```text
normal path
retry path
terminal failure path
```

Per esempio:

```text
main queue
   ↓ failure transient
retry queue / scheduled retry
   ↓ retries exhausted
DLQ
```

Questo non è sempre necessario.

Ma rende esplicito che il lavoro che non progredisce normalmente ha bisogno di un percorso diverso.

## Il caso reale Uber: reprocessing senza bloccare il real-time

Uber Insurance Engineering ha documentato un sistema di retry e dead-lettering costruito su Kafka per il programma Driver Injury Protection.

Il problema era concreto: un downstream lento o indisponibile non doveva bloccare il processing real-time degli altri eventi.

Il team ha introdotto topic di reprocessing e dead-letter queue separati, consentendo retry non bloccanti e osservabili.

Fonte:

- [Uber Engineering — Building Reliable Reprocessing and Dead Letter Queues with Apache Kafka](https://www.uber.com/blog/reliable-reprocessing/)

La lezione non è:

> “dobbiamo copiare la topology di Uber”.

La lezione è:

> **un messaggio che fallisce deve avere una strategia di progressione distinta dal traffico sano.**

## Dead-letter queue: il parcheggio non è recovery

Una DLQ è utile perché impedisce a messaggi problematici di bloccare indefinitamente il flusso principale.

Ma spesso viene trattata come una discarica:

```text
retries exhausted
→ DLQ
→ fine
```

Non è abbastanza.

Una DLQ production-ready deve avere almeno:

```text
owner
alerting
retention
reason code
original message identity
correlation id
last failure
retry count
first seen / last attempted
redrive policy
manual procedure
security policy
```

E soprattutto una risposta alla domanda:

> che cosa succede al business mentre il messaggio è lì?

Per un'email promozionale possiamo forse accettare una perdita finale.

Per un'escalation payment dobbiamo sapere:

- l'operatore vede che la consegna non è completata?
- Payments & Risk ha un canale alternativo?
- esiste un alert?
- possiamo redrive in sicurezza?
- la redelivery è idempotente?
- dopo quanto tempo serve intervento umano?

## Poison message

Un messaggio può fallire sempre perché:

- schema invalido;
- dato incompatibile;
- bug deterministico;
- consumer non riconosce la versione;
- riferimento a entity inesistente;
- permission errata;
- payload troppo grande;
- business invariant violata.

Riprovare cento volte non lo rende più corretto.

Questo è il **poison message** problem.

La policy deve distinguere:

```text
transient failure
→ retry

persistent infrastructure failure
→ retry bounded + circuit / pause

deterministic message failure
→ DLQ / quarantine rapidamente

business rejection
→ stato funzionale, non errore tecnico da ritentare
```

## Ordering e head-of-line blocking

Ordering può peggiorare proprio il failure handling.

Se tutti gli eventi di un `caseId` devono essere processati in ordine e il primo è poison, i successivi non possono semplicemente superarlo senza cambiare la semantica.

Dobbiamo scegliere:

- bloccare quella key;
- parcheggiare la key intera;
- correggere/redrive il messaggio;
- permettere processing fuori ordine con version check;
- dichiarare una semantica diversa.

Il punto è che:

> **ordering non è soltanto una property del broker. È una decisione sul comportamento durante failure e concorrenza.**

## TTL e messaggi scaduti

Alcuni messaggi perdono valore nel tempo.

Uber, descrivendo la propria Real-Time Push Platform, documenta messaggi con TTL esplicita e retry fino alla scadenza, perché una notifica real-time consegnata troppo tardi può non avere più utilità.

Fonte:

- [Uber Engineering — Uber's Real-Time Push Platform](https://www.uber.com/blog/real-time-push-platform/)

Questo ci ricorda che durability non deve essere applicata ciecamente.

Per alcuni workload la domanda non è:

> “riusciremo a consegnarlo prima o poi?”

ma:

> “dopo quanto tempo questa informazione smette di essere utile o sicura?”

Per un'escalation payment, invece, il messaggio non dovrebbe scadere silenziosamente.

La policy potrebbe trasformare il superamento della soglia in:

```text
manual escalation required
```

## Poison pill organizzativa

Esiste anche una DLQ umana.

Succede quando il sistema segnala errori ma nessuno è chiaramente responsabile.

```text
alert arriva
→ team A pensa sia team B
→ team B pensa sia Platform
→ Platform vede che il broker funziona
→ messaggio resta fermo
```

La tecnologia è disponibile.

La capability di recovery no.

Per questo ownership operativa è parte dell'architettura distribuita.

## Una Failure Policy minima

Per ogni flusso asincrono dovremmo poter scrivere qualcosa come:

```markdown
### Failure policy

Transient errors:
- max 5 attempts
- exponential backoff + jitter

Non-retryable:
- schema validation
- authorization failure
- unsupported message version

Dead-letter:
- after retry budget exhausted
- alert owner: Payments Integration

Redrive:
- manual or automated only after cause resolved
- same messageId/escalationId preserved

Ordering:
- per caseId only

Backpressure:
- consumer concurrency capped
- oldest-message-age alert

Business timeout:
- if not delivered within 5 min, case becomes DeliveryDelayed
- operator visibility required
```

I numeri qui sono esempi di struttura, non target universali.

## Regola

Una queue diventa architettura quando sappiamo rispondere non soltanto a:

> “come entra il messaggio?”

ma anche a:

> **“come rallenta, come fallisce, dove finisce, chi lo recupera e quando smette di essere utile?”**