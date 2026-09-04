## Un sistema asincrono deve saper rallentare

Una queue può assorbire un picco, ma non lo elimina: lo trasforma in backlog. Se il producer genera 500 messaggi al secondo e i consumer ne smaltiscono 200, il sistema accumula 300 messaggi di debito operativo ogni secondo. La queue può restare perfettamente disponibile mentre il prodotto diventa sempre più indietro rispetto alla propria promessa.

È per questo che un sistema asincrono non deve soltanto sapere come accettare lavoro. Deve sapere come rallentare, quanto backlog può tollerare e quando il ritardo cambia significato funzionale.

## Backpressure: decidere dove si trova il freno

Backpressure significa impedire che una parte veloce saturi una parte più lenta. Possiamo rallentare il producer, limitare la concurrency dei consumer, applicare admission control, rifiutare lavoro oltre una soglia, degradare feature non essenziali o scalare i consumer quando il workload lo giustifica.

La scelta dipende dal flusso. Un audit trail può tollerare backlog per un periodo; una notifica real-time può diventare inutile dopo una TTL; un command economico non può essere semplicemente scartato perché “la coda è piena”.

Il design deve quindi collegare capacità tecnica e valore temporale del lavoro.

## Il backlog va letto in unità di business

`queue depth` è utile, ma spesso la metrica più significativa è l’**età del messaggio più vecchio**. Due queue con 100.000 messaggi possono avere implicazioni opposte: una può smaltire il backlog in pochi secondi, l’altra può essere bloccata da quarantacinque minuti.

Per Payment Escalation la domanda importante non è quanti messaggi esistano, ma da quanto tempo una escalation accettata attenda di essere consegnata. La metrica si avvicina quindi a `business delivery lag`, non a una semplice dimensione infrastrutturale.

Questo collegamento tra observability e promessa funzionale tornerà più avanti nel libro.

## Una queue infinita è failure differito

Se un downstream resta indisponibile per ore e continuiamo ad accettare lavoro senza limite, possiamo creare crescita di storage, recovery enormi, messaggi ormai vecchi e un nuovo picco ingestibile quando il consumer torna disponibile.

AWS Well-Architected collega resilienza, timeout e retry limitati proprio alla necessità di evitare che i meccanismi di recovery amplifichino un guasto.

Fonti:

- [AWS Well-Architected — Control and limit retry calls](https://docs.aws.amazon.com/wellarchitected/latest/framework/rel_mitigate_interaction_failure_limit_retries.html)
- [AWS Well-Architected — Set client timeouts](https://docs.aws.amazon.com/wellarchitected/latest/framework/rel_mitigate_interaction_failure_client_timeouts.html)

La capacità di mettere in coda il lavoro non elimina quindi il bisogno di admission control e business timeout.

## Il lavoro che non progredisce deve uscire dal fast path

Un consumer che fallisce, fa `sleep`, ritenta e trattiene la queue principale può trasformare un singolo messaggio problematico in head-of-line blocking per lavoro sano.

Una strategia frequente separa i percorsi:

```text
main path
  ↓ transient failure
retry path / scheduled retry
  ↓ retries exhausted
terminal failure / DLQ
```

Non è obbligatorio costruire tre infrastrutture separate in ogni caso. Il principio è che un messaggio che non riesce a progredire normalmente deve avere una strategia distinta, non occupare indefinitamente il percorso sano.

Uber Insurance Engineering ha documentato un sistema di reprocessing e DLQ sopra Kafka proprio per impedire che downstream degradati bloccassero il traffico real-time.

Fonte:

- [Uber Engineering — Building Reliable Reprocessing and Dead Letter Queues with Apache Kafka](https://www.uber.com/blog/reliable-reprocessing/)

La proprietà trasferibile non è la topologia Kafka. È la separazione tra **normal progress** e **recovery progress**.

## Una DLQ non è recovery se nessuno la governa

`retries exhausted → DLQ` è una regola di routing, non una recovery strategy. Una DLQ operabile deve avere owner, alert, retention, reason code, original identity, correlation, retry history, redrive policy, security rule e soprattutto una risposta alla domanda: **che cosa succede al business mentre il messaggio è fermo lì?**

Per una Payment Escalation dobbiamo sapere se l’operatore vede il ritardo, se esiste un canale alternativo, quando parte un alert, chi può redrive e come impedire che il redrive produca un secondo workflow.

La coda terminale non chiude il problema. Lo rende esplicito.

## Poison message: quando riprovare non può aiutare

Alcuni messaggi falliscono sempre perché lo schema è invalido, la versione non è supportata, una entity non esiste, una business precondition è violata o il payload è strutturalmente incompatibile. Cento retry non cambieranno il risultato.

La failure policy deve quindi distinguere almeno transient failure, infrastructure failure persistente, deterministic message failure e business rejection. Il primo può meritare retry; il secondo può richiedere pause/circuit/degraded mode; il terzo deve essere quarantinato rapidamente; il quarto è un esito funzionale, non un errore tecnico da martellare.

## Ordering e failure si influenzano

Se gli eventi di una stessa key devono essere applicati in ordine e il primo è poison, non possiamo semplicemente far passare i successivi senza una decisione semantica. Possiamo bloccare quella key, parcheggiarla, correggere e redrive, oppure consentire processing fuori ordine con version check.

Questo mostra che ordering non è soltanto una feature del broker. È una decisione sul comportamento durante failure e concorrenza.

## TTL: durability non significa “per sempre”

Alcuni messaggi perdono valore nel tempo. Uber, descrivendo la propria Real-Time Push Platform, documenta messaggi con TTL e retry fino alla scadenza perché una notifica real-time troppo tarda può diventare inutile.

Fonte:

- [Uber Engineering — Uber's Real-Time Push Platform](https://www.uber.com/blog/real-time-push-platform/)

Per una Payment Escalation il ragionamento è differente: non vogliamo una scadenza silenziosa. Il superamento del business timeout può invece trasformare il flusso in `DeliveryDelayed` o `ManualEscalationRequired`.

Durability e utilità temporale sono due dimensioni differenti.

## La DLQ umana

Esiste anche un failure organizzativo: alert correttamente emesso, broker funzionante, messaggio bloccato e nessun team che riconosce la responsabilità del recovery. Il sistema tecnico ha fatto il proprio lavoro; la capability operativa no.

Per questo ownership del redrive, escalation e runbook fanno parte dell’architettura del flusso, non della documentazione accessoria.

## Failure Policy come artefatto operativo

Per i flussi importanti possiamo mantenere una policy sintetica:

```markdown
Transient errors
- retry bounded
- exponential backoff + jitter

Deterministic failures
- no blind retry
- quarantine / DLQ

Dead-letter
- owner e alert espliciti
- redrive solo dopo cause resolution
- stessa message/business identity

Ordering
- solo per la key che lo richiede

Backpressure
- concurrency limit
- oldest-message-age alert

Business timeout
- ritardo oltre soglia → stato/visibilità funzionale
```

I numeri concreti dipenderanno da workload ed evidence. La struttura, invece, serve sempre a rispondere alla domanda che conta:

> **come rallenta il sistema, come fallisce, dove finisce il lavoro, chi lo recupera e quando il ritardo cambia significato?**