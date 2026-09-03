# Capitolo 15 — Observability

> **Scenario ESI.** Order Operations ha ora requisiti di reliability, failure mode, security boundary e una prima topologia cloud. Il problema di questo capitolo non è aggiungere grafici. È rendere il sistema capace di produrre evidence sufficiente a capire che cosa sta succedendo, perché sta succedendo e quando serve intervenire.

Nel Capitolo 14 abbiamo deciso che cosa significa essere affidabili.

Abbiamo definito critical flow, SLI, SLO, degraded mode, RTO, RPO, recovery path e failure domain.

Ma una reliability requirement senza un sistema capace di misurarla resta una dichiarazione.

Possiamo scrivere:

```text
Payment Escalation publication
99% entro 5 minuti
```

ma se non sappiamo misurare:

```text
quando la escalation è stata accettata
quando è entrata nell'outbox
quando è stata pubblicata
quando il broker l'ha resa disponibile
quando Payments & Risk l'ha osservata
quale escalation è rimasta bloccata
perché è rimasta bloccata
```

non possediamo davvero quello SLO.

Possediamo soltanto una frase.

## Monitoring non è observability

Useremo i due termini con una distinzione pratica.

Il **monitoring** osserva condizioni che abbiamo già deciso di misurare:

```text
request rate
error rate
latency
CPU
queue depth
```

L'**observability** deve permetterci anche di investigare domande che non avevamo previsto nel dettaglio prima dell'incidente.

OpenTelemetry descrive l'observability come la capacità di comprendere lo stato interno di un sistema attraverso i suoi output e collega questa capacità all'instrumentation di traces, metrics e logs.

Riferimenti:

- [OpenTelemetry — Observability primer](https://opentelemetry.io/docs/concepts/observability-primer/)
- [OpenTelemetry — Signals](https://opentelemetry.io/docs/concepts/signals/)

Questo non significa che ogni problema richieda un sistema di telemetry gigantesco.

Anzi.

Uno degli errori più comuni è credere che più telemetry produciamo, più il sistema diventi osservabile.

Non è necessariamente vero.

Possiamo produrre miliardi di log e non riuscire comunque a rispondere a una domanda semplice:

> quale customer journey sta fallendo in questo momento?

## Il sistema deve rispondere a domande

L'observability parte dalle domande.

Per Order Operations vogliamo riuscire a rispondere almeno a queste:

1. gli operatori riescono a usare il critical journey?
2. la latency sta degradando per tutti o soltanto per una capability?
3. la Payment Escalation è stata accettata localmente?
4. l'outbox sta accumulando backlog?
5. Service Bus è raggiungibile?
6. Payments & Risk sta consumando?
7. la stessa `EscalationId` è stata redelivered?
8. stiamo degradando per un problema applicativo, database, identity, network o downstream?
9. il problema riguarda un tenant, una regione, una versione o tutti?
10. una nuova release coincide con il cambio di comportamento?
11. stiamo violando uno SLO?
12. l'errore budget sta bruciando abbastanza velocemente da richiedere azione?

La telemetry deve essere progettata per rendere investigabili queste domande.

Non per riempire una dashboard.

## Sintomo e causa

Google SRE propone una distinzione estremamente utile:

```text
symptom
vs
cause
```

Il sintomo può essere:

```text
operator journey latency alta
```

La causa può essere:

```text
PostgreSQL saturo
private DNS failure
connection pool exhausted
Orders dependency lenta
bad deployment
```

Oppure il contrario: una dependency può mostrare errori senza produrre ancora un impatto significativo sul journey utente.

Google raccomanda di osservare entrambe le dimensioni, con forte attenzione ai segnali user-visible e ai quattro golden signals:

```text
latency
traffic
errors
saturation
```

Fonte:

- [Google SRE — Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)

Nel nostro linguaggio:

> **il monitoring deve dirci che qualcosa richiede attenzione; l'observability deve aiutarci a capire che cosa sta succedendo abbastanza velocemente da prendere una decisione.**

## Logs, metrics e traces non sono tre checklist

OpenTelemetry tratta traces, metrics, logs e baggage come segnali differenti che possono descrivere lo stesso sistema da prospettive diverse.

Una metric può dirci:

```text
payment_escalation_delivery_seconds p95 è aumentato
```

Un trace può mostrarci:

```text
API
→ PostgreSQL commit
→ outbox poll
→ Service Bus publish
```

Un log strutturato può dirci:

```text
messageId
escalationId
failureClass
attemptCount
```

La potenza non deriva dall'avere tutti e tre.

Deriva dal poterli correlare.

## Il costo della visibilità

La telemetry non è gratuita.

Ha almeno questi costi:

- CPU e memoria per instrumentation;
- rete;
- ingestion;
- storage;
- retention;
- query;
- indexing;
- sampling complexity;
- cardinality;
- costo cognitivo umano;
- rischio di raccogliere dati che non dovremmo conservare.

Per ESI questo crea una tensione reale.

Operations vuole investigazioni rapide.

Security vuole evitare token, secret e dati sensibili nei log.

Finance/FinOps vuole controllare ingestion e retention.

Platform vuole standard comuni.

Il workload team vuole poter aggiungere signal specifici del dominio.

Nessuno di questi obiettivi è sbagliato.

## Il compromesso ESI del capitolo

La domanda non sarà:

> quanta telemetry possiamo raccogliere?

Sarà:

> **qual è la quantità minima di telemetry sufficientemente ricca da permetterci di misurare gli SLO, diagnosticare i failure mode significativi e ricostruire le operazioni sensibili senza rendere costi, cardinalità e data exposure incontrollabili?**

La decisione corrente sarà:

```text
OpenTelemetry-compatible application instrumentation
+ Azure Monitor / Application Insights / Log Analytics
+ structured application telemetry
+ correlation end-to-end
+ SLI espliciti
+ business telemetry per Payment Escalation
+ sampling governato
+ cardinality budget
+ retention per classe di segnale
+ actionable alerting
```

Non introdurremo:

- telemetry per ogni variabile;
- label ad alta cardinalità senza motivo;
- dump indiscriminati dei payload;
- alert per ogni metrica;
- dashboard per ogni componente;
- synthetic probe pubblico contro un endpoint che abbiamo deliberatamente reso privato.

## Una nuova regola del capstone

Dal Capitolo 13 usiamo:

```text
Designed
→ Codified
→ Verified
→ Monitored
```

Questo capitolo rende finalmente concreto il quarto livello.

Un controllo o una proprietà non è **Monitored** perché esiste un grafico.

È monitored quando esiste un segnale con:

- significato;
- owner;
- query o misura;
- soglia o interpretazione quando necessaria;
- retention;
- collegamento a un failure mode o decisione;
- response path.

## Il punto del capitolo

Alla fine non vogliamo un sistema che produce molte informazioni.

Vogliamo un sistema che produce **evidence utile**.

Una dashboard piena non dimostra che conosciamo il sistema.

Un log enorme non dimostra che sappiamo investigarlo.

Un trace distribuito non dimostra che sappiamo decidere.

> **L'observability è architettura quando trasforma il comportamento del sistema in informazione utilizzabile per governarlo.**