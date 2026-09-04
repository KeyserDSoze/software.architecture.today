## Partial failure: quando “la chiamata è fallita” non basta più

Dentro un singolo processo possiamo avere errori complessi, ma condividiamo comunque runtime, memoria e una nozione abbastanza coerente di chiamata e risultato. Attraversando una rete perdiamo parte di questa certezza.

Per questo la frase “la chiamata è fallita” è spesso troppo vaga. Prima di decidere che cosa fare dobbiamo capire se la richiesta non sia mai arrivata, se il server la stia ancora eseguendo, se abbia prodotto il side effect ma perso la risposta, se il client abbia semplicemente smesso di aspettare o se il downstream sia sovraccarico.

Queste non sono varianti dello stesso errore. Producono recovery differenti.

## Timeout: smettere di aspettare non annulla il remoto

Un timeout significa prima di tutto che il caller non è più disposto ad aspettare. Non dimostra che il downstream non abbia fatto nulla.

Immaginiamo che Order Operations invii una richiesta a Payments con timeout di due secondi. Payments registra l’escalation dopo 800 ms, prepara la risposta dopo 900 ms, ma la connessione viene chiusa o la risposta si perde prima di arrivare al caller. Order Operations vede un timeout; il business ha già visto un side effect riuscito.

È precisamente qui che un retry ingenuo può creare duplicati. Timeout e idempotency devono quindi essere progettati insieme.

AWS Well-Architected raccomanda timeout espliciti sulle chiamate remote e ricorda che valori troppo alti trattengono risorse inutilmente, mentre valori troppo bassi possono aumentare retry, traffico e latency fino a contribuire a outage più ampi.

Fonte:

- [AWS Well-Architected — Set client timeouts](https://docs.aws.amazon.com/wellarchitected/latest/framework/rel_mitigate_interaction_failure_client_timeouts.html)

## Retry: una nuova esecuzione potenziale

Un retry non corregge la richiesta precedente e non riavvolge il sistema. È un nuovo tentativo in un mondo che potrebbe essere già cambiato.

Prima di introdurlo dobbiamo quindi sapere se l’errore sia probabilmente transitorio, se l’operazione sia idempotente o deduplicabile, se esista ancora budget temporale, quale livello debba possedere il retry e quando sia necessario smettere.

Microsoft Azure Architecture Center raccomanda retry contestuali, legati al tipo di errore, all’idempotency e alla semantica dell’operazione.

Fonte:

- [Microsoft Learn — Retry pattern](https://learn.microsoft.com/azure/architecture/patterns/retry)

## Il problema dei retry annidati

Una catena `A → B → C → D` può sembrare innocua se ogni servizio dichiara “massimo tre retry”. Guardando il sistema end-to-end, però, i tentativi si moltiplicano. Durante una degradazione, migliaia di richieste che eseguono piccoli retry locali possono produrre un feedback loop:

```text
failure
→ retry
→ più carico
→ latency maggiore
→ più timeout
→ altri retry
```

Per questo la ownership del retry deve essere esplicita. Microsoft descrive anche il concetto di **retry budget**, che limita non soltanto i tentativi per richiesta ma il volume aggregato di retry che un servizio può generare.

Fonte:

- [Microsoft Learn — Transient fault handling](https://learn.microsoft.com/azure/architecture/best-practices/transient-faults)

## Backoff e jitter: distribuire il recovery nel tempo

Se tutti i client riprovano nello stesso momento in cui una dipendenza torna disponibile, la recovery può creare un nuovo picco di carico. L’exponential backoff allunga progressivamente l’attesa; il jitter aggiunge casualità controllata per evitare che client sincronizzati ritentino insieme.

AWS documenta backoff e jitter come strumenti centrali per ridurre contention e retry sincronizzati.

Fonti:

- [AWS Architecture Blog — Exponential Backoff And Jitter](https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/)
- [AWS Well-Architected — Control and limit retry calls](https://docs.aws.amazon.com/wellarchitected/latest/framework/rel_mitigate_interaction_failure_limit_retries.html)

Questi meccanismi, però, non trasformano qualsiasi errore in un buon candidato al retry. Un `503` da un downstream saturo può richiedere attesa e riduzione del carico; una validation error non cambierà al secondo tentativo; un timeout dopo un possibile side effect richiede prima di tutto identità dell’intento.

Una policy matura distingue quindi business error, transient transport failure, overload/rate limit, failure persistente e unknown outcome. Non serve codificare una tassonomia infinita: serve sapere quale recovery abbia senso per ogni classe.

## Idempotency: riconoscere la stessa intenzione

Per i sistemi distribuiti è utile pensare all’idempotency così: **ripetere la stessa intenzione non deve produrre side effect aggiuntivi indesiderati**.

La parola “intenzione” è importante. Un hash del payload non sempre basta: due payload uguali possono rappresentare due intenti diversi e lo stesso intento può essere ritentato con differenze non rilevanti a livello byte.

AWS Builders’ Library descrive l’uso di un client request identifier esplicito proprio per distinguere un nuovo intento da un retry della stessa operazione.

Fonte:

- [Amazon Builders' Library — Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/)

Per Order Operations, un `escalationId` stabile può rappresentare l’intenzione business. Tutti i tentativi di consegna della stessa escalation conservano quella identity; Payments & Risk può quindi riconoscere la redelivery e impedire la creazione di un secondo workflow.

## Consumer idempotente: la redelivery è normale, non eccezionale

In un sistema at-least-once il consumer deve aspettarsi che un messaggio arrivi di nuovo. Il caso tipico è semplice: il consumer riceve, scrive nel database e crasha prima dell’ack. Il broker non vede conferma e ridelivera.

Se la seconda elaborazione crea un nuovo record o ripete un side effect non sicuro, il problema non è “il broker che duplica”. È un contratto consumer che non tollera la delivery semantic scelta.

Microsoft descrive esplicitamente questo scenario nell’Idempotent Consumer pattern.

Fonte:

- [Microsoft Learn — Idempotent Consumer pattern](https://learn.microsoft.com/azure/architecture/patterns/idempotent-consumer)

## Exactly-once: specificare sempre il confine

Dire che un broker “supporta exactly-once” non basta per dichiarare exactly-once un business process. La garanzia può fermarsi al broker, all’offset o alla pipeline controllata dal framework; un side effect verso un payment provider o un database esterno rimane fuori da quel confine.

Per questo è spesso più sano descrivere ciò che sappiamo realmente garantire:

```text
at-least-once delivery
+ stable operation identity
+ idempotent processing
+ deduplication
+ reconciliation
```

Quando queste proprietà producono un solo effetto business osservabile, possiamo parlare di **effective exactly-once** nel perimetro che abbiamo davvero progettato, non come formula magica end-to-end.

La Builders’ Library usa il provisioning EC2 come esempio: un client token stabile consente di ritentare un’operazione costosa senza creare involontariamente più risorse per la stessa intenzione. La forma del problema è la stessa di una escalation ESI: side effect significativo, risposta incerta e retry desiderabile richiedono identity stabile.

## La domanda prima di `retry()`

Prima di aggiungere una policy di retry a una chiamata remota dobbiamo riuscire a spiegare che cosa significhi successo, che cosa possa nascondere un timeout, se il primo tentativo possa avere già prodotto effetto, come riconosciamo la stessa intenzione, chi deduplica, quanto carico aggiunge il retry, quando smettiamo e come lo osserviamo.

Se queste risposte mancano, il retry non sta riducendo l’incertezza. La sta amplificando.