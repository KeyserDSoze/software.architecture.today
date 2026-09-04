## Queue, pub/sub e stream: la relazione viene prima del broker

Quando diciamo “mettiamo un broker” stiamo comprimendo decisioni molto diverse in una parola sola. Prima della tecnologia dobbiamo capire che relazione vogliamo creare tra producer e consumer.

Una **queue** è naturale quando qualcuno produce lavoro che uno dei worker disponibili deve eseguire. Compra temporal decoupling, buffering e load leveling; permette di controllare concurrency e assorbire burst senza trattenere il caller. Microsoft descrive il Competing Consumers pattern proprio come più consumer che ricevono lavoro dalla stessa coda per aumentare throughput e availability, a condizione che il lavoro sia separabile e che concorrenza e ordering siano governati.

Fonte:

- [Microsoft Learn — Competing Consumers pattern](https://learn.microsoft.com/azure/architecture/patterns/competing-consumers)

Per Order Operations la forma sarebbe: “questa escalation deve essere presa in carico da Payments & Risk, ma l’operatore non deve aspettare che il downstream completi il lavoro”.

Il **publish/subscribe** esprime invece un’altra relazione. Il producer rende noto un fatto e più subscriber possono reagire indipendentemente. `OperationalCaseEscalated` potrebbe interessare Payments, audit, reporting o altri consumer futuri senza costringere Order Operations a conoscerli tutti. Microsoft Publisher-Subscriber pattern evidenzia proprio questo disaccoppiamento.

Fonte:

- [Microsoft Learn — Publisher-Subscriber pattern](https://learn.microsoft.com/azure/architecture/patterns/publisher-subscriber)

Il vantaggio, però, porta con sé più contratti, failure indipendenti, tracing più difficile e maggiore rischio di effetti emergenti. Il producer conosce meno consumer, ma il sistema nel suo insieme deve governarne di più.

Uno **stream** sposta ancora il modello: il valore non è soltanto consegnare lavoro, ma conservare una sequenza di record con retention, offset/checkpoint e possibilità di replay. Può essere ideale quando la storia e la rilettura fanno parte del requisito. Può essere sproporzionato quando abbiamo soltanto bisogno di consegnare pochi task asincroni.

Per questo ESI non sceglie automaticamente Kafka perché “ci sono eventi”. La domanda è se servano davvero le proprietà operative e semantiche di un log durabile e replayable.

## Command ed event: intenzione e fatto non sono la stessa cosa

Un command come `ProcessPaymentEscalation` o `SendCustomerNotification` esprime una richiesta verso una capability responsabile. Un event come `OperationalCaseEscalated` o `PaymentFailed` descrive invece qualcosa che è già accaduto.

La distinzione non è puramente grammaticale. Un command ha idealmente un destinatario, può essere rifiutato e porta idempotency legata all’operazione. Un event dovrebbe essere abbastanza stabile da permettere a consumer indipendenti di reagire senza trasformare il nome del messaggio in un ordine mascherato.

La domanda pratica è: **stiamo chiedendo a qualcuno di fare qualcosa o stiamo rendendo noto un fatto?**

## Il messaggio è un contratto distribuito

Una volta pubblicato, uno schema può diventare più difficile da cambiare di una classe interna. Un consumer può costruire assunzioni sul significato di `status`, sull’ordering o sulla relazione causale tra eventi e trasformare un campo apparentemente innocuo in una dipendenza di lungo periodo.

Per questo un message contract importante dovrebbe rendere espliciti almeno tipo e versione, `messageId`, tempo di occorrenza, producer, correlation/causation identity, entity identity, significato business, compatibility policy, classificazione dei dati e ordering key quando davvero rilevante.

La struttura serve perché il messaggio attraversa ownership e tempo.

## Delivery semantics: scegliere quale rischio accettiamo

Con **at-most-once** riduciamo la redelivery ma possiamo perdere lavoro in alcuni failure mode. Può essere un trade-off accettabile per telemetria best-effort o segnali effimeri; non lo è automaticamente per escalation, movimenti economici o altre operazioni che non possono scomparire senza lasciare traccia.

Con **at-least-once** scegliamo invece di preferire un possibile duplicato a una perdita silenziosa. È il modello che adottiamo per il primo flusso ESI. Non promettiamo che un messaggio venga fisicamente consegnato una sola volta; promettiamo che la stessa `escalationId` non produca effetti business duplicati.

La complessità si distribuisce quindi così:

```text
broker   → delivery affidabile
consumer → idempotency / deduplication
sistema  → reconciliation / observability
```

**Exactly-once** diventa utile soltanto se diciamo esattamente dove valga. Producer-broker, pipeline transazionale, offset consumer e side effect esterno sono boundary diversi. Uber, descrivendo una pipeline real-time con Kafka, Flink e Pinot, usa exactly-once nel perimetro controllato dalla pipeline e continua comunque a fare affidamento su identity e deduplication nei downstream.

Fonte:

- [Uber Engineering — Real-Time Exactly-Once Ad Event Processing with Apache Flink, Kafka, and Pinot](https://www.uber.com/blog/real-time-exactly-once-ad-event-processing/)

La lezione è che **le delivery guarantee non sostituiscono l’identità del lavoro**.

## Fan-out: autonomia che può diventare causalità invisibile

Pub/sub consente di aggiungere subscriber senza modificare il producer. È potente, ma può generare catene in cui un evento ne produce un altro, poi un altro ancora, fino a creare un business process distribuito che nessuno possiede più end-to-end.

Microsoft Choreography pattern richiama proprio rischi di catene circolari, schema evolution, idempotency e controllo della concorrenza.

Fonte:

- [Microsoft Learn — Choreography pattern](https://learn.microsoft.com/azure/architecture/patterns/choreography)

Il problema non è “avere molti eventi”. È perdere la capacità di spiegare causalità, responsabilità e recovery.

## Ordering: chiedere il minimo che protegge la correttezza

“Gli eventi devono arrivare in ordine” è quasi sempre un requisito troppo ampio. Ordine globale, per tenant, per `orderId` e per `caseId` hanno costi molto diversi.

Spesso ciò che serve davvero è evitare che, per la stessa aggregate key, una versione vecchia venga applicata dopo una nuova. In quel caso partition key, sequence/version e stale-event rejection possono proteggere la semantica senza serializzare l’intero workload.

Microsoft Sequential Convoy pattern mostra il trade-off fra ordine e parallelismo: preservare ordine globale limita throughput; raggruppare per chiave permette di pagare il costo soltanto dove serve.

Fonte:

- [Microsoft Learn — Sequential Convoy pattern](https://learn.microsoft.com/azure/architecture/patterns/sequential-convoy)

## Il fit per Order Operations

Per il primo flusso scegliamo un contratto minimale. `OperationalCasePaymentEscalated` porta identity stabile, `caseId`, `escalationId`, timestamp, riferimento tenant scoped, reason code, source e schema version. Non include note libere, dettagli payment sensibili, stack trace, token, payload provider o l’intero `Order` DTO.

La minimizzazione protegge security e coupling. Payments può recuperare altro contesto attraverso contract autorizzati se davvero necessario.

Non chiediamo ordering globale. Se in futuro più eventi dello stesso `OperationalCase` dovranno essere applicati in sequenza, aggiungeremo una key e una versione soltanto quando il consumer ne avrà bisogno.

La regola resta semplice:

```text
queue   → qualcuno deve eseguire questo lavoro
pub/sub → questo fatto è avvenuto; più consumer possono reagire
stream  → questa sequenza deve essere processata e spesso riletta
```

Prima scegliamo la relazione. Poi il prodotto.