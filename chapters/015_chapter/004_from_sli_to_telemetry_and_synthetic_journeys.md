# Dagli SLI alla telemetry: misurare il journey, non il server

Nel Capitolo 14 abbiamo definito SLI e SLO.

Ora dobbiamo decidere **da quali eventi reali** derivano.

Questo passaggio è più importante della dashboard che verrà dopo.

Uno SLI non dovrebbe nascere perché una metrica esiste già.

Dovrebbe nascere così:

```text
business expectation
→ critical journey
→ good/bad event definition
→ measurement source
→ query
→ SLI
→ SLO
```

## Partire dal good event

Per Order Operations abbiamo definito, nello scenario ESI:

```text
Core operator journey
99.9% good events / rolling 28 days
```

Ma che cos'è un `good event`?

Una definizione possibile deve includere almeno:

- l'operatore è autenticato e autorizzato;
- la richiesta termina con outcome funzionalmente valido;
- la risposta non supera la latency threshold definita;
- il risultato non è semanticamente stale oltre il limite accettato quando la freshness conta.

Questo rende immediatamente evidente una cosa:

```text
HTTP 200
```

non è sufficiente.

## SLI per capability

Order Operations non ha un unico SLI.

### Core read journey

Domanda:

> gli operatori riescono a trovare e aprire un ordine problematico con informazioni utilizzabili?

Candidate measurements:

```text
successful operator journey events
journey latency histogram
semantic/dependency degradation flags
```

### Payment Escalation local acceptance

Domanda:

> il sistema riesce a registrare durablemente l'intenzione senza aspettare Payments & Risk?

Candidate measurements:

```text
accepted escalation requests
failed local commits
local-accept latency
idempotent duplicate requests
```

### Payment Escalation publication

Requirement simulato:

```text
99% entro 5 minuti
```

Measurement:

```text
publishedAt - requestedAt
```

non:

```text
numero di retry
```

I retry sono un meccanismo.

Lo SLI misura l'outcome.

## Event-based measurement

Per alcuni SLI conviene ragionare in termini di eventi:

```text
good events / valid events
```

Per esempio:

```text
payment_escalations_published_within_target
/
payment_escalations_requested
```

Questa formulazione collega direttamente il business flow alla misura.

## Metric-based measurement

Altri SLI possono derivare da histogram o counter.

Esempio concettuale:

```text
http.server.request.duration
```

con route template bounded e risultato.

La semantic convention concreta può evolvere con OpenTelemetry, quindi il libro privilegia il concetto rispetto a nomi che potrebbero cambiare.

Riferimenti:

- [OpenTelemetry — Metrics](https://opentelemetry.io/docs/specs/otel/metrics/)
- [OpenTelemetry — Semantic conventions](https://opentelemetry.io/docs/specs/semconv/)

## Black-box e white-box

Google SRE distingue fra:

### Black-box monitoring

Osserviamo il sistema dall'esterno.

Domanda:

```text
Il journey funziona?
```

### White-box monitoring

Osserviamo internals:

```text
connection pool
outbox depth
CPU
query latency
retry count
```

Fonte:

- [Google SRE — Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)

Servono entrambi.

Il black-box mostra il sintomo.

Il white-box ci aiuta a cercare la causa.

## Synthetic journey

Un synthetic check esegue periodicamente un comportamento noto per verificare se una capability è raggiungibile e funzionale.

Per una API pubblica può essere relativamente semplice.

Order Operations però ha una decisione di sicurezza precisa:

```text
production ingress = private
```

Quindi un probe pubblico esterno non è automaticamente il test corretto.

## Security architecture modifica observability architecture

Questo è un buon esempio di interazione fra quality attribute.

Potremmo dire:

> abilitiamo un endpoint pubblico solo per il monitoring.

Sarebbe una soluzione tecnicamente possibile ma architetturalmente incoerente con il threat model attuale.

Preferiamo:

```text
private synthetic runner / approved enterprise probe
→ private network path
→ App Service private endpoint
→ authenticated test identity
→ read-only synthetic journey
```

La probe identity deve avere privilegi minimi e dati synthetic dedicati.

Non useremo una identity umana personale per un test automatico.

## Synthetic data

Il test deve evitare di contaminare il dominio reale.

Possibili strategie:

- tenant synthetic dedicato;
- account/case synthetic riconoscibili;
- capability read-only quando possibile;
- cleanup verificabile se il test crea stato;
- esclusione esplicita da KPI business quando necessario.

Un synthetic test che crea falsi incidenti business è un failure mode dell'observability stessa.

## Non tutto deve essere synthetic

La Payment Escalation ha side effect cross-domain.

Eseguire continuamente una escalation reale verso Payments & Risk potrebbe essere inappropriato.

Possiamo quindi separare:

```text
synthetic read journey
```

che verifica ingress/auth/query path,

da:

```text
integration canary / controlled end-to-end test
```

eseguito con frequenza e dati dedicati, eventualmente in staging o production con un protocollo concordato.

## SLO e deployment

Una release dovrebbe essere correlabile al comportamento degli SLI.

Per questo vogliamo registrare almeno:

```text
deployment version
deployment timestamp
environment
```

come dimensioni bounded e interrogabili.

Una domanda operativa importante diventa:

> il burn dell'error budget è iniziato dopo una nuova versione?

## Error budget burn

Uno SLO su finestra lunga non deve aspettare fine mese per dirci che siamo nei guai.

Vogliamo osservare la velocità con cui stiamo consumando il budget.

Concettualmente:

```text
burn rate > 1
```

significa che stiamo consumando budget più velocemente del ritmo sostenibile per la finestra considerata.

Non fisseremo qui una formula di paging universale.

Il punto architetturale è:

- il segnale deve derivare dall'SLI reale;
- finestre brevi rilevano incidenti rapidi;
- finestre più lunghe riducono rumore;
- la policy deve essere testata sugli incidenti reali/simulati del workload.

## Health model e SLI

`Healthy / Degraded / Unhealthy` non deve essere deciso da un singolo dependency check.

Esempio:

```text
Payments & Risk unavailable
```

ma:

```text
Payment Escalation local acceptance funziona
outbox cresce
business delivery target non ancora violato
```

può inizialmente significare:

```text
Degraded
```

non necessariamente `Unhealthy` per l'intero prodotto.

Quando invece il backlog supera il business threshold e gli operatori non possono più rispettare l'outcome, la classificazione cambia.

## Observability come verifica del degraded mode

Il Capitolo 14 ha scritto cosa resta valido durante il degraded mode.

Il Capitolo 15 deve renderlo misurabile.

Per ogni degraded mode chiediamo:

```text
Come sappiamo di esserci entrati?
Come lo mostriamo all'operatore?
Quale SLI cambia?
Quale dato può essere stale?
Quale write viene bloccata?
Come sappiamo di essere usciti?
```

## Fonti

- [Google SRE — Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)
- [Google SRE Workbook — Monitoring](https://sre.google/workbook/monitoring/)
- [OpenTelemetry — Metrics](https://opentelemetry.io/docs/specs/otel/metrics/)
- [OpenTelemetry — Semantic conventions](https://opentelemetry.io/docs/specs/semconv/)

> **Uno SLO diventa operativo soltanto quando sappiamo indicare l'evento che lo misura e il comportamento che lo fa fallire.**