## Fault isolation, capacity e cascading failure

Un sistema affidabile non è quello in cui nulla si rompe. È quello in cui un failure incontra abbastanza boundary da avere difficoltà a diventare **tutti i failure contemporaneamente**.

La propagazione è spesso più pericolosa del trigger iniziale. Una dependency rallenta, le request restano aperte più a lungo, la concurrency cresce, le connection pool si saturano, aumentano i timeout, partono retry e il traffico effettivo cresce proprio mentre la capacità utile scende.

```text
dependency latency ↑
→ request duration ↑
→ concurrency ↑
→ saturation
→ timeout ↑
→ retry ↑
→ effective traffic ↑
→ dependency pressure ↑
```

Questo feedback loop è il cuore del cascading failure.

AWS Well-Architected e Microsoft Well-Architected insistono entrambi su retry limitati, fault isolation e self-preservation proprio perché i meccanismi di recovery possono diventare amplificatori quando non sono bounded.

Fonti:

- [AWS Well-Architected — Control and limit retry calls](https://docs.aws.amazon.com/wellarchitected/latest/framework/rel_mitigate_interaction_failure_limit_retries.html)
- [Microsoft Learn — Reliability design patterns](https://learn.microsoft.com/azure/well-architected/reliability/design-patterns)

## La capacity è reliability quando smette di bastare

Capacity planning viene spesso relegato alla performance. Ma quando il sistema raggiunge il proprio limite, latency e throughput diventano availability problem.

Per progettare un workload dobbiamo conoscere almeno la forma del carico:

```text
steady-state load
peak load
headroom
saturation point
recovery load
```

L’ultimo elemento è facile da dimenticare. Dopo un outage possiamo avere backlog da drenare, cache fredde, client che ritentano, job rimasti indietro, connessioni che si ristabiliscono tutte insieme e operatori che ripetono manualmente le azioni.

Un sistema perfettamente dimensionato per lo steady state può quindi collassare proprio mentre sta recuperando.

Questo vale in modo evidente per la Service Bus Queue introdotta nel Capitolo 11. La queue assorbe temporaneamente uno squilibrio tra producer e consumer, ma non genera capacità downstream.

Se per abbastanza tempo:

```text
arrival rate > processing rate
```

allora inevitabilmente:

```text
queue depth ↑
oldest-message age ↑
business delivery latency ↑
```

Il Reliability Contract deve quindi dire quando il backlog è ancora dentro un envelope accettabile e quando il flow passa a `Degraded` o `Unhealthy`.

> **Una queue sposta il debito nel tempo. Non lo cancella.**

## Retry significa spendere capacità

Ogni retry è nuovo lavoro. Per questo il retry budget del Capitolo 11 ora diventa anche una decisione di capacity.

Non basta sapere che una richiesta “può essere ritentata”. Dobbiamo sapere chi ritenta, quante volte, per quali errori, con quale backoff e jitter, entro quale budget temporale e soprattutto che cosa succede quando il budget termina.

La domanda aggiuntiva della reliability è:

> **Quanta capacità siamo disposti a spendere per recuperare un’operazione prima di proteggere il resto del sistema?**

Questa domanda rende leggibili anche circuit breaker, bulkhead e load shedding.

Un **circuit breaker** può avere fit quando una dipendenza fallisce abbastanza a lungo da rendere dannoso continuare a insistere. Il suo valore non è “riparare il downstream”, ma far fallire velocemente, evitare consumo inutile e permettere un degraded path quando esiste.

Microsoft include questo pattern nei design mission-critical proprio per limitare pressione e propagation quando il retry non è più utile.

Fonte:

- [Microsoft Learn — Mission-critical application design](https://learn.microsoft.com/azure/well-architected/mission-critical/mission-critical-application-design)

Ma aggiungerlo ovunque sarebbe un altro tipo di reliability theater. Un breaker introduce stato, soglie, recovery delay e nuove condizioni da osservare. Per le dipendenze live di Order Operations diventerà una scelta soltanto se le misure mostrano che failure persistenti stanno davvero consumando il critical path.

## Bulkhead: separare prima che una parte consumi tutto

Il Bulkhead pattern nasce dalla stessa logica. Se workload diversi condividono completamente CPU, connection pool, thread, queue o concurrency, la saturazione di uno può togliere capacità agli altri.

Order Operations ha oggi App Service e continuous WebJob nello stesso lifecycle. È una scelta consapevole del Capitolo 12: semplice e proporzionata al workload corrente.

Ma abbiamo anche già definito il trigger di revisione. Se un backlog di outbox in fase di recovery producesse:

```text
publisher recovery load
→ CPU/connection pressure
→ operator API latency ↑
→ SLO core journey violato
```

avremmo evidence per separare capacity, concurrency o addirittura runtime.

Quella estrazione sarebbe guidata dal failure model, non dalla moda dei microservizi.

## Ridondanza utile significa failure domain indipendenti

Un **fault domain** è l’insieme di parti che possono fallire insieme per una stessa causa. Può essere una VM, una availability zone, un database cluster, una regione, una identity dependency, una pipeline, una configurazione distribuita o persino una singola credenziale condivisa.

La ridondanza ha valore soltanto se le copie non condividono il failure che vogliamo tollerare.

Due istanze applicative proteggono da un instance failure, ma non da un bad deployment propagato a entrambe. Due database node possono proteggere da un guasto fisico, ma non da una corruption logica replicata correttamente. Due regioni configurate dallo stesso automation bug possono condividere un common-mode failure.

> **Due copie dello stesso errore non sono alta disponibilità.**

Per App Service, Microsoft documenta che i piani compatibili possono essere configurati con zone redundancy e almeno due istanze, distribuendo capacità attraverso availability zone nelle regioni supportate.

Fonte:

- [Microsoft Learn — Configure App Service plans for zone redundancy](https://learn.microsoft.com/azure/app-service/configure-zone-redundancy)

Per ESI questa capability ha fit perché il prodotto rimane single-region ma vuole ridurre il failure domain dai singoli host e dalla singola zone senza pagare subito la complessità multi-region.

## Headroom: la ridondanza nominale non basta

Avere `N` istanze non protegge davvero dalla perdita di una istanza se le `N-1` rimanenti non possono sostenere il traffico.

La domanda di capacity deve quindi includere anche lo scenario degradato:

```text
N istanze healthy
→ load per instance

N-1 istanze
→ load per remaining instance
```

Headroom non significa sovradimensionare alla cieca. Significa scegliere quale failure scenario deve essere assorbito senza superare il saturation point.

Questo vale anche per il recovery. Se dopo trenta minuti di consumer outage la queue contiene un backlog importante, il sistema deve drenarlo senza togliere capacità al traffico interattivo o creare un nuovo retry storm.

Quando la capacità disponibile non basta per tutto, può essere più affidabile rifiutare o rinviare lavoro meno importante invece di accettarlo e degradare lentamente ogni flow. È il principio del **load shedding**.

Per Order Operations non abbiamo ancora export o report pesanti. Non implementiamo quindi un meccanismo che non serve. Ma se arriveranno, dovranno avere una priorità esplicita rispetto al core operator journey.

## I casi reali mostrano che la capacity è spesso il propagation path

Nel maggio 2026 GitHub ha documentato un incidente in cui una online schema migration su una tabella molto utilizzata, combinata con l’aumento del traffico, contribuì a saturare la capacità di connessione del database e a generare contention e cascading timeout. Tra i follow-up dichiarati comparivano scheduling più attento delle migration, throttling dinamico, circuit breaker e monitoring anticipato della saturation.

Fonte primaria:

- [GitHub Availability Report — May 2026](https://github.blog/news-insights/company-news/github-availability-report-may-2026/)

Il valore didattico non è “usare gli stessi threshold di GitHub”. È riconoscere che una migration è anch’essa un workload che compete per capacity condivisa.

Cloudflare ha documentato nel 2020 un altro tipo di propagation path: una configurazione di backbone fece convergere traffico verso Atlanta fino a sovraccaricare quel punto e causare outage in più location. Tra le mitigazioni descritte comparivano limiti e cambiamenti di routing destinati a evitare una nuova concentrazione analoga.

Fonte primaria:

- [Cloudflare — Outage on July 17, 2020](https://blog.cloudflare.com/cloudflare-outage-on-july-17-2020/)

Anche qui il principio generale non è una regola BGP. È più semplice:

> **Quando una configurazione può concentrare il carico, serve un limite che impedisca alla concentrazione di diventare sistemica.**

## Cosa cambia con l’AI

L’AI rende economico generare client, worker, automation e retry policy. Lo stesso vantaggio rende economico anche duplicare una policy ingenua.

Dieci worker generati rapidamente, ognuno con cinque retry immediati, possono trasformare un piccolo transient failure in un burst artificiale. La risposta non è rallentare la generazione, ma avere guardrail condivisi su retry, concurrency, backoff, capacity budget e load testing.

> **Quando l’execution costa poco, anche l’amplificazione di un errore costa poco da produrre.**

La fault isolation non impedisce al primo componente di fallire. Decide quanti altri componenti quel failure ha il diritto di portarsi dietro.