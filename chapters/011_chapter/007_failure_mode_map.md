## Failure Mode Map

Quando un sistema diventa distribuito, il diagramma del happy path smette rapidamente di essere sufficiente. Le frecce raccontano come il lavoro dovrebbe progredire; l’architettura deve raccontare anche che cosa succede quando una di quelle frecce diventa lenta, ambigua o non produce il risultato atteso.

Per questo introduciamo un nuovo artefatto operativo:

> **Failure Mode Map**

Non è un catalogo di tutte le exception possibili. Serve a rendere espliciti i failure mode che cambiano una promessa funzionale, una decisione architetturale o una responsabilità di recovery.

## Partire dal journey, non dall’exception

Prendiamo il nuovo flusso ESI:

```text
Operator
→ local transaction
→ outbox
→ publisher
→ broker
→ Payments consumer
→ Payments local commit
```

La domanda utile non è “quali errori può sollevare PostgreSQL?” ma “in quali punti il journey può fermarsi o diventare ambiguo?”.

Possiamo avere validation failure prima del commit, conflitto transazionale, commit riuscito seguito da broker outage, publish riuscito con ack perso, redelivery, schema incompatibile, Payments DB indisponibile, consumer crash dopo il proprio commit, retry esauriti o una delivery che supera il business timeout.

Questa sequenza è molto più utile di una tassonomia generica di exception perché collega il guasto a stato persistito, conoscenza dell’outcome e recovery.

## Il template

Per i flussi importanti usiamo una struttura proporzionata al rischio:

```markdown
# Failure Mode Map

## Critical flow

## Dependencies

| Step | Failure | Known outcome? | Persisted state | Retry owner | Idempotency | User impact | Recovery | Owner |
|---|---|---|---|---|---|---|---|---|

## Time budgets

## Retry policy

## Ordering requirements

## Backpressure policy

## Dead-letter policy

## Reconciliation

## Compensation / irreversible steps

## Manual intervention

## Observability

## Open questions
```

Non ogni funzione merita una mappa completa. Un flusso economico o un’integrazione che può lasciare stati divergenti sì.

## Esempio ESI

| Step | Failure | Known outcome? | Stato persistito | Retry owner | Impatto | Recovery |
|---|---|---|---|---|---|---|
| local transaction | serialization/conflict | known failure | nessun nuovo stato | application | operatore attende/riprova | retry bounded con stesso intent |
| outbox publisher | broker unavailable | known local success | escalation + outbox pending | publisher | delivery ritardata | backoff + retry |
| publish acknowledgement | ack perso | unknown publish outcome | outbox ancora pending | publisher | possibile duplicate tecnico | stessa messageId + consumer idempotente |
| Payments consumer | DB unavailable | known consumer failure | broker conserva/redeliver | broker/consumer | delivery lag | retry bounded / DLQ |
| consumer validation | schema unsupported | known failure | nessun effetto downstream | no blind retry | integration failure | quarantine/DLQ + alert |
| consumer commit + ack loss | known business success, ack unknown | downstream già aggiornato | broker redelivera | broker/consumer | duplicate tecnico | dedup su escalationId |
| retries exhausted | persistent failure | known non-progress | DLQ | human/controlled | delivery failed/delayed | investigate + redrive |

La tabella non “risolve” il sistema. Costringe il team a vedere quali decisioni esistono davvero.

## Known failure, known success, unknown outcome

Una delle colonne più importanti è `Known outcome?`. È il modo più rapido per distinguere failure semplici da failure distribuiti difficili.

Una validation error prima del side effect è un known failure. Un commit confermato è un known success. Un timeout dopo l’invio può essere un unknown outcome: non sappiamo se il side effect remoto sia già avvenuto.

Gli unknown outcome sono i punti in cui identity, idempotency e reconciliation diventano particolarmente importanti. Il nome dell’exception, da solo, spesso non basta.

## Il tempo deve stare nella mappa

Recovery e failure non possono essere descritti senza budget temporali. Dobbiamo distinguere il tempo del request path, il tempo atteso di publication e il **business delay budget** entro cui il processo può restare incompleto senza cambiare comportamento.

Un messaggio può avere ancora retry tecnici disponibili ma aver già superato la soglia oltre la quale l’operatore deve essere informato. Per questo `maxRetries=5` non è una business policy.

I numeri concreti vanno misurati e concordati; la struttura deve comunque rendere visibili warning threshold, delivery target e soglia di manual intervention.

## Retry ownership evita amplificatori invisibili

La mappa deve dichiarare chi ritenta: SDK, application service, broker, consumer framework, workflow engine o persona. Se non lo scriviamo, tre piccoli retry in livelli diversi possono moltiplicarsi in decine di tentativi end-to-end.

La stessa logica vale per backpressure: vogliamo sapere dove si trova il freno, quali concurrency limit esistano, quali segnali rappresentino backlog e quando il producer debba essere rallentato.

## DLQ e reconciliation non sono appendici

Una dead-letter policy deve dichiarare entry condition, owner, alert, retention, security, redrive e business consequence. `on failure → DLQ` non basta.

La reconciliation completa poi ciò che il message path non può sempre dimostrare. Per Order Operations possiamo cercare escalation accettate localmente che, oltre una soglia, non risultano osservate downstream. Questo controllo può scoprire failure che la telemetria locale non vede o outcome rimasti ambigui.

## Recovery non significa sempre compensation

La Failure Mode Map dovrebbe distinguere ciò che è retryable, forward-recoverable, compensable, irreversibile o destinato a manual review. Una generica colonna `rollback yes/no` comprime troppo il problema.

Molti failure si risolvono meglio proseguendo e riconciliando. Alcuni richiedono una nuova business operation di compensation. Altri ancora, soprattutto dopo pivot economici, richiedono un essere umano.

## Observability contract

Una recovery strategy è operativa soltanto se possiamo osservare quando dovrebbe attivarsi. Per il flusso ESI ci interesseranno segnali come outbox pending e oldest age, publish failures, consumer lag, duplicate processing, DLQ depth/age, reconciliation mismatch e business delivery latency.

I nomi definitivi verranno stabiliti nel capitolo sull’observability. Il principio è già valido:

> **se sappiamo come recuperare soltanto sulla carta ma non sappiamo riconoscere quando serve farlo, il recovery non è ancora parte del sistema.**

## Failure Mode Map e AI

Un agente AI può essere un ottimo failure-mode explorer: può analizzare call graph, retry policy, transaction boundary, outbox publisher, ack, DLQ, timeout e idempotency store e generare sequenze avversariali come `commit succeeds → publish succeeds → mark published fails → restart`.

Il repository, però, non contiene automaticamente il business delay accettabile, i side effect irreversibili, le regole di human approval o l’owner del redrive. Queste informazioni arrivano dall’analisi funzionale e dal contesto organizzativo.

Da questo capitolo, ogni flusso distribuito significativo dovrebbe avere una Failure Mode Map abbastanza ricca da rispondere a una domanda:

> **se questa freccia non funziona come nel diagramma, sappiamo ancora che cosa succede al sistema?**