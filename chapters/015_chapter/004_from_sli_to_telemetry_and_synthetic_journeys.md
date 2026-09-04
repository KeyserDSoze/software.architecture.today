## Dagli SLI alla telemetry: misurare il journey, non il server

Nel Capitolo 14 abbiamo definito SLI e SLO. Ora dobbiamo scegliere **da quali eventi reali** derivino.

Questo passaggio è più importante della dashboard che verrà dopo. Uno SLI non dovrebbe esistere perché “abbiamo già una metrica”. Dovrebbe nascere da una catena leggibile:

```text
business expectation
→ critical journey
→ good/bad event definition
→ measurement source
→ query
→ SLI
→ SLO
```

Se invertiamo questa sequenza, rischiamo di misurare perfettamente ciò che era facile instrumentare invece di ciò che il prodotto aveva promesso.

## Il good event deve conservare il significato del journey

Per Order Operations abbiamo un target simulato:

```text
Core operator journey
99.9% good events / rolling 28 days
```

La parte difficile è stabilire che cosa renda un evento `good`.

Nel primo modello vogliamo almeno che l’operatore sia autenticato e autorizzato, che la capability produca un outcome funzionalmente valido, che la risposta resti entro il latency threshold e che il prodotto non presenti come corrente un dato che sa essere stale oltre il limite accettato.

Quindi:

```text
HTTP 200
```

non è sufficiente.

Se la response è semanticamente inutilizzabile, il journey non è sano anche quando il server ha risposto con successo.

## Misurare capability diverse con signal diversi

Order Operations non ha un unico SLI universale.

Per il **core read journey** la domanda è se l’operatore riesca a trovare e aprire un caso con informazioni utilizzabili. Candidate source sono good-event count, journey latency e degraded-state classification.

Per la **Payment Escalation local acceptance** la domanda è se l’intenzione venga registrata durablemente senza rendere Payments & Risk parte del request path. Qui ci interessano acceptance outcome, local commit failure, latency e idempotent replay.

Per la **Payment Escalation publication** il target è:

```text
99% entro 5 minuti
```

La misura deve quindi essere vicina a:

```text
publishedAt - requestedAt
```

non al numero di retry.

Il retry è un meccanismo. Lo SLI misura l’outcome.

Questa distinzione impedisce di confondere “il sistema sta lavorando molto per recuperare” con “il sistema sta rispettando il proprio contratto”.

## Event accounting e metrics possono convivere

Per alcuni SLI è naturale ragionare per eventi:

```text
payment_escalations_published_within_target
/
payment_escalations_requested
```

Per altri può essere più naturale usare counter e histogram, per esempio sulla durata delle request con route template bounded.

La semantic convention concreta può evolvere con OpenTelemetry; il libro privilegia quindi il significato del signal rispetto a un nome che potrebbe cambiare.

Riferimenti:

- [OpenTelemetry — Metrics](https://opentelemetry.io/docs/specs/otel/metrics/)
- [OpenTelemetry — Semantic conventions](https://opentelemetry.io/docs/specs/semconv/)

## Black-box e white-box raccontano sintomo e diagnosi

Google SRE distingue tra **black-box monitoring**, che osserva il comportamento dall’esterno, e **white-box monitoring**, che guarda agli internals del sistema.

Fonte:

- [Google SRE — Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)

Il black-box risponde soprattutto a:

```text
Il journey funziona?
```

Il white-box aiuta a spiegare perché, osservando connection pool, outbox age, CPU, retry, dependency latency e saturation.

Servono entrambi perché un prodotto può fallire prima che la request raggiunga il processo applicativo, e una dependency può degradare senza avere ancora un impatto user-visible.

## Synthetic journey: osservare lo stesso boundary che usano gli utenti

Un synthetic check esegue periodicamente un comportamento noto e ci permette di vedere il workload dall’esterno del processo.

Per Order Operations la security architecture modifica però la soluzione: production ingress è privato.

Aprire un endpoint pubblico soltanto per semplificare il monitoring sarebbe un cambiamento del threat model, non una innocua scelta operativa.

La direzione coerente è invece:

```text
private synthetic runner / approved enterprise probe
→ approved private network path
→ App Service private endpoint
→ Entra test/workload identity
→ dedicated synthetic data
→ read journey
```

Il synthetic runner deve possedere least privilege e dati riconoscibili. Non vogliamo usare una identity umana personale né contaminare il dominio reale con attività di test che poi compaiono nei KPI business.

Questa è un’interazione importante fra quality attribute: Security by Design decide **da dove** possiamo osservare il workload.

## Non ogni business flow deve essere testato continuamente in produzione

La Payment Escalation produce side effect cross-domain. Eseguire ogni minuto una escalation reale verso Payments & Risk potrebbe creare rumore operativo e dati fittizi nel dominio economico.

Possiamo quindi separare:

```text
synthetic read journey
```

che verifica ingress, identity e query path,

da:

```text
controlled integration canary / end-to-end test
```

eseguito con una frequenza e dati concordati, eventualmente in staging o in produzione con un protocollo esplicito.

L’observability non deve creare falsi incidenti business per poter dire che il sistema è osservato.

## Deployment e SLI devono essere correlabili

Una delle domande più utili durante un incidente è:

> Il comportamento è cambiato insieme a una release?

Per questo deployment version, timestamp ed environment sono context bounded che vale la pena preservare.

Se il burn dell’error budget accelera dopo `v42`, l’informazione non dimostra causalità, ma restringe molto lo spazio di investigazione.

## Error-budget burn: misurare la velocità della perdita

Uno SLO su una finestra lunga non deve aspettare fine mese per dirci che siamo nei guai.

Il burn rate esprime quanto velocemente stiamo consumando il budget rispetto al ritmo sostenibile. Non fissiamo qui una formula universale di paging; la policy deve essere costruita sul comportamento reale del workload.

Ci interessa la struttura:

- finestre brevi aiutano a vedere incidenti intensi;
- finestre più lunghe riducono rumore;
- il signal deve derivare dallo stesso SLI che definisce il contratto;
- la regola deve essere provata su failure reali o simulati.

Un alert sul burn è molto più vicino all’outcome di un generico `CPU > 80%`.

## Rendere misurabile anche il degraded mode

Il Capitolo 14 ha scritto che cosa resta valido quando una dependency fallisce. Il Capitolo 15 deve dire come riconosciamo l’ingresso e l’uscita da quella modalità.

Per ogni degraded mode chiediamo:

```text
Come sappiamo di esserci entrati?
Quale SLI cambia?
Quale dato non è più authoritative?
Quale capability resta permessa?
Quale write deve essere bloccata?
Come lo comunichiamo all’operatore?
Come sappiamo di essere usciti?
```

Se Payments & Risk è indisponibile ma l’escalation acceptance locale funziona e l’outbox resta dentro il business-delay envelope, il prodotto può essere `Degraded` invece che totalmente `Unhealthy`.

Quando il backlog supera la soglia che rende l’outcome inaccettabile, la classification deve cambiare.

L’observability rende questa transizione visibile e quindi operabile.

Fonti:

- [Google SRE — Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)
- [Google SRE Workbook — Monitoring](https://sre.google/workbook/monitoring/)
- [OpenTelemetry — Metrics](https://opentelemetry.io/docs/specs/otel/metrics/)
- [OpenTelemetry — Semantic conventions](https://opentelemetry.io/docs/specs/semconv/)

> **Uno SLO diventa operativo soltanto quando sappiamo indicare l’evento che lo misura, il comportamento che lo fa fallire e il punto da cui possiamo osservarlo.**