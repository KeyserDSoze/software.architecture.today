# Capitolo 15 — Observability

> **Scenario ESI.** Order Operations possiede ormai reliability target, failure mode, security boundary e una prima topologia cloud. Il problema di questo capitolo non è aggiungere grafici. È rendere il sistema capace di produrre evidence sufficiente a capire che cosa sta succedendo, perché e quando serve intervenire.

Nel Capitolo 14 abbiamo deciso che cosa dovrebbe significare essere `Healthy`, `Degraded` o `Unhealthy`. Abbiamo scritto SLI, SLO, RTO, RPO, recovery source e failure drill.

Ma un reliability contract che non possiamo misurare resta una dichiarazione.

Possiamo scrivere:

```text
Payment Escalation publication
99% entro 5 minuti
```

ma finché non sappiamo ricostruire quando l’escalation è stata accettata, quando è entrata nell’outbox, quando è stata pubblicata, quale item è rimasto pending e quale failure path lo sta trattenendo, non possediamo davvero quello SLO.

Possediamo una frase.

## L’observability parte dalle domande

La prima tentazione è partire dagli strumenti:

```text
metrics
logs
traces
dashboard
alerts
```

È lo stesso errore che abbiamo evitato con il cloud: scegliere il catalogo prima del problema.

Per Order Operations le domande operative vengono prima:

```text
gli operatori riescono a usare il critical journey?
quale capability sta degradando?
l’escalation è stata accettata localmente?
l’outbox sta accumulando debito?
il broker è irraggiungibile o il publisher non sta lavorando?
la stessa EscalationId è stata redelivered?
il problema riguarda tutti o una versione/env/failure class?
il burn dell’error budget sta accelerando?
un deployment coincide con il cambio di comportamento?
```

La telemetry ha valore soltanto se rende più facile rispondere a domande come queste.

> **Una dashboard piena non è observability. È soltanto una dashboard piena.**

## Monitoring e observability

Useremo una distinzione pratica.

Il **monitoring** osserva condizioni che abbiamo già deciso di misurare: request rate, error rate, latency, saturation, queue age, SLO burn.

L’**observability** deve permetterci anche di investigare una domanda che non avevamo preconfigurato esattamente prima dell’incidente, usando gli output che il sistema produce e il contesto che abbiamo preservato.

OpenTelemetry descrive l’observability come capacità di comprendere lo stato interno di un sistema attraverso i suoi output e collega questa capacità all’instrumentation di signal come traces, metrics e logs.

Riferimenti:

- [OpenTelemetry — Observability primer](https://opentelemetry.io/docs/concepts/observability-primer/)
- [OpenTelemetry — Signals](https://opentelemetry.io/docs/concepts/signals/)

La distinzione non implica un impianto di telemetry gigantesco. Anzi, possiamo produrre miliardi di eventi e non saper ancora rispondere alla domanda più importante: **quale customer o operator journey sta fallendo adesso?**

## Sintomo e causa devono restare separati

Google SRE propone una distinzione molto utile tra monitoring del **symptom** e monitoring della **cause**.

Il sintomo può essere:

```text
operator journey latency alta
```

Le cause possibili possono essere PostgreSQL saturo, private DNS, connection pool exhaustion, una dependency lenta o un bad deployment. Allo stesso modo, una dependency può mostrare errori senza avere ancora un impatto materiale sul journey.

Google raccomanda di mantenere visibili entrambi i livelli e riassume quattro signal particolarmente utili per i sistemi user-facing:

```text
latency
traffic
errors
saturation
```

Fonte:

- [Google SRE — Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)

Nel linguaggio di questo libro:

> **Il monitoring deve dirci che qualcosa richiede attenzione. L’observability deve ridurre il tempo necessario per capire quale decisione prendere.**

## Metrics, logs e traces sono prospettive sulla stessa storia

Una metric può dirci che la publication latency sta peggiorando. Un trace può mostrare dove una singola esecuzione ha trascorso il proprio tempo. Un structured event può dirci quale `messageId`, `escalationId`, attempt e failure class erano coinvolti.

La potenza non nasce dal possedere tre stack differenti. Nasce dal riuscire a correlare signal diversi attorno allo stesso comportamento.

Per questo avremo bisogno di distinguere identity diverse:

```text
traceId
→ execution identity

messageId
→ technical delivery identity

escalationId
→ business intent identity

correlationId
→ cross-boundary operational flow quando serve
```

Confonderle rende l’investigazione più difficile proprio quando il sistema diventa asincrono e i trace non coincidono più con l’intero business journey.

## La visibilità ha un costo e una superficie di rischio

Telemetry significa CPU, rete, ingestion, storage, retention, indexing, query, sampling, cardinality e attenzione umana. Significa anche raccogliere dati che possono diventare sensibili quando vengono centralizzati.

Questo crea una tensione reale nel capstone.

Operations vuole investigazioni rapide. Security non vuole token, secret e payload sensibili nei log. Finance vuole controllare ingestion e retention. Platform vuole convenzioni comuni. Il workload team ha bisogno di business signal che Platform non può dedurre da sola.

La domanda del capitolo sarà quindi:

> **Qual è la quantità minima di telemetry abbastanza ricca da misurare gli SLO, investigare i failure mode importanti e ricostruire le operazioni sensibili senza rendere costo, cardinalità e data exposure incontrollabili?**

Per ESI la direzione iniziale è:

```text
OpenTelemetry-compatible instrumentation
+ Azure Monitor / Application Insights / Log Analytics
+ bounded metrics per SLI/alert
+ structured telemetry
+ end-to-end correlation
+ business signals per Payment Escalation
+ governed sampling
+ cardinality budget
+ retention per classe
+ actionable alerting
```

Non vogliamo telemetry per ogni variabile, ID unbounded come metric dimension, dump completi dei payload, alert per ogni deviazione o dashboard per ogni Azure resource.

## “Monitored” deve significare qualcosa

Dal Capitolo 13 usiamo quattro livelli:

```text
Designed
→ Codified
→ Verified
→ Monitored
```

Questo capitolo rende concreto l’ultimo.

Una proprietà non è `Monitored` perché qualcuno ha disegnato un grafico. È monitored quando esiste un segnale con significato, owner, modalità di misura, retention, relazione con un failure/control e un response path.

Se la metric cambia nome e rompe la query dello SLO, abbiamo una breaking change operativa. Se l’alert non ha owner, la telemetry sta descrivendo un problema che nessuno possiede. Se il logging contiene un token, abbiamo creato un security incident in nome della visibilità.

L’observability, quindi, non è una disciplina post-produzione. È una compatibility surface del sistema.

## Cosa cambia con l’AI

Un agente può generare instrumentation, query, dashboard e alert molto rapidamente. Può anche riassumere migliaia di eventi durante un incidente.

Ma la velocità introduce due rischi opposti: **Instrumentation Explosion** e causalità inventata.

Se chiediamo genericamente “rendi osservabile questo servizio”, possiamo ottenere una grande quantità di signal tecnicamente corretti ma semanticamente inutili o economicamente ingestibili. Se chiediamo a un agente di trovare la root cause, può trasformare una correlazione plausibile in una storia troppo pulita.

Il contract deve venire prima dell’automazione.

> **L’observability è architettura quando trasforma il comportamento del sistema in evidence abbastanza buona da governarlo.**

Alla fine del capitolo Order Operations non dovrà “produrre molte informazioni”. Dovrà sapere quali informazioni servono per misurare il proprio Reliability Contract, investigare Failure Mode Map e Threat Model, sostenere l’on-call e, nei capitoli successivi, aiutare anche agenti e persone a distinguere observation, hypothesis e proof.