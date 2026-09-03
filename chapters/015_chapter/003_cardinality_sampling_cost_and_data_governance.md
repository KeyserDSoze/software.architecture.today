# Cardinality, sampling, costo e data governance

L'observability ha una proprietà pericolosa: è molto facile aggiungere signal e molto più difficile rimuoverli.

Un nuovo log sembra innocuo.

Una nuova label sembra innocua.

Una nuova retention policy sembra prudente.

Un nuovo trace attribute sembra utile.

Presi singolarmente, quasi tutti lo sono.

Insieme possono produrre:

- ingestion molto costosa;
- query lente;
- cardinality ingestibile;
- dashboard fragili;
- alert rumorosi;
- esposizione di dati sensibili;
- costi di storage sproporzionati;
- impossibilità pratica di capire che cosa sia davvero importante.

## La cardinalità non è un dettaglio di monitoring

Consideriamo una metric:

```text
payment_escalation_requests_total
```

Con attributi:

```text
environment
result
```

La cardinalità resta limitata.

Ora aggiungiamo:

```text
tenantId
caseId
orderId
operatorId
messageId
```

Ogni combinazione può generare una serie temporale distinta.

Non abbiamo semplicemente “più dettaglio”.

Abbiamo cambiato l'economia e la scalabilità del sistema di telemetry.

## Low-cardinality vs high-cardinality

Non esiste una soglia universale che separi magicamente le due categorie.

Ma possiamo ragionare così.

Dimensioni tipicamente bounded:

```text
environment
region
result class
HTTP method
route template
failure class
service name
version
```

Dimensioni tipicamente unbounded o quasi:

```text
userId
orderId
caseId
traceId
messageId
free-text error
URL completa
```

Le seconde possono essere utilissime durante un'investigazione.

Ma non significa che debbano diventare label di ogni metric.

Possiamo conservarle dove il costo e il modello di query sono più appropriati, per esempio in trace/log strutturati, con retention e access control differenti.

## Route template, non URL concreta

Una metric HTTP dovrebbe preferire:

```text
/api/operational-cases/{caseId}/payment-escalations
```

alla URL concreta:

```text
/api/operational-cases/4f82.../payment-escalations
```

Altrimenti trasformiamo ogni business identifier in cardinalità infrastrutturale.

Questo è un esempio di decisione piccola con conseguenze architetturali.

## Il cardinality budget

Per ESI introduciamo un concetto operativo semplice:

> **cardinality budget**.

Non è una feature di Azure o OpenTelemetry.

È una regola del capstone.

Ogni custom metric deve dichiarare:

```text
metric name
purpose
attributes
expected value set
owner
SLI/alert/dashboard consumer
```

Se un attribute può crescere con il numero di utenti, ordini, case o messaggi, non entra automaticamente in una metric dimension.

Richiede una motivazione esplicita.

## Sampling

I trace possono avere volume significativo.

Conservare ogni singolo trace non è sempre necessario o economicamente sensato.

Il sampling permette di ridurre il volume osservato.

Ma introduce un nuovo trade-off:

```text
costo inferiore
vs
probabilità di perdere dettaglio utile
```

### Head sampling

La decisione viene presa presto, tipicamente all'inizio del trace.

Vantaggi:

- semplice;
- prevedibile;
- riduce subito il volume.

Limite:

non sappiamo ancora se il trace diventerà interessante.

Potremmo scartare proprio una richiesta che finirà in errore dopo diversi boundary.

### Tail sampling

La decisione può considerare il trace dopo averne osservato outcome e caratteristiche.

Questo permette policy come:

```text
keep all errors
keep high-latency traces
sample normal successful traffic
```

Ma richiede più infrastruttura e buffering.

Non lo introdurremo automaticamente nel capstone.

## Sampling non deve alterare gli SLI

Uno SLO come:

```text
99.9% successful core journey
```

non dovrebbe dipendere da un sample arbitrario dei trace se esiste una fonte più adatta e completa, come metric counter/histogram o eventi contabilizzati in modo affidabile.

I trace aiutano a spiegare il comportamento.

Le metric appropriate possono essere la fonte primaria della misura.

> **Non usare il segnale più ricco per forza. Usa il segnale con la semantica più adatta alla decisione.**

## Error sampling

Una policy ragionevole può preservare una percentuale maggiore di:

```text
error trace
high-latency trace
rare failure class
security-significant trace, quando appropriato
```

rispetto alle richieste normali.

Ma anche qui dobbiamo evitare una nuova illusione.

Se conserviamo soltanto errori, perdiamo il contesto di cosa significhi comportamento normale.

Una investigazione ha spesso bisogno di confronto.

## Logs: sampling e deduplication

Un dependency failure può produrre lo stesso errore migliaia di volte.

Registrare ogni replica della stessa eccezione con stack trace completo può:

- aumentare il costo;
- nascondere altri signal;
- saturare pipeline di log;
- peggiorare il sistema durante un incidente.

Le strategie possibili includono:

- aggregation;
- rate limiting;
- deduplication;
- sampling;
- summary counter.

La scelta dipende dal tipo di evento.

Un audit event sensibile non può essere campionato con la stessa leggerezza di un diagnostic log ripetitivo.

## Telemetry class

Per Order Operations distinguiamo almeno:

### Operational metrics

Per SLI, saturation e alerting.

Retention orientata a trend e incident comparison.

### Diagnostic traces

Per ricostruire execution path e dependency behavior.

Sampling consentito secondo policy.

### Application diagnostic logs

Per eventi tecnici strutturati.

Retention limitata e data minimization forte.

### Security/audit events

Per operazioni sensibili e ricostruzione accountability.

Access control, integrity e retention possono essere diversi dal logging ordinario.

### Business operational events

Per capire il journey:

```text
PaymentEscalation Requested
Delivered
Delayed
DeadLettered
```

La semantica deve rimanere coerente col dominio.

## Retention non è “più è meglio”

Una retention lunga aumenta:

- storage;
- privacy exposure;
- costo di query;
- obblighi di governance;
- superficie di accesso.

Una retention troppo corta può invece impedire:

- incident comparison;
- trend analysis;
- capacity planning;
- audit requirement;
- analisi di failure intermittenti.

Quindi la domanda non è:

> quanti giorni possiamo conservare?

ma:

> **per quale decisione ci serve questo segnale e per quanto tempo deve restare interrogabile?**

## Telemetry e dati sensibili

Il Capitolo 13 aveva già stabilito un quality floor:

```text
no token
no Authorization header
no secret
payload minimization
```

Aggiungiamo:

- non registrare request/response body per default;
- non usare free-text business content come metric dimension;
- classificare gli identifier prima di propagarli;
- applicare redaction prima dell'export quando possibile;
- considerare telemetry store come sistema che contiene dati reali e quindi soggetto a identity, retention e incident response.

Un log centralizzato può diventare uno dei database più sensibili dell'azienda proprio perché aggrega dettagli da molti sistemi.

## Cost observability

Il costo deve essere reso osservabile a sua volta.

Per ESI vogliamo almeno distinguere:

```text
log ingestion volume
trace ingestion volume
custom metric count
retention cost
query cost, dove applicabile
high-cardinality custom telemetry
```

Questo non significa ottimizzare ogni byte.

Significa evitare di scoprire a fine mese che la telemetry del workload costa più della capability che sta osservando.

## Platform vs workload

Platform Engineering può fornire:

- collector/export path;
- standard semantic conventions;
- central workspace policy;
- default retention;
- security baseline;
- cost allocation;
- shared dashboards/tooling.

Ma il workload team deve possedere:

- business signal;
- custom metric;
- journey correlation;
- SLI query;
- failure-specific telemetry;
- alert meaning.

Platform può standardizzare il meccanismo.

Non può conoscere automaticamente la semantica di `PaymentEscalation`.

## Il compromesso ESI

Operations vorrebbe conservare tutto per investigare qualsiasi cosa.

Finance/FinOps vuole contenere ingestion e retention.

Security vuole minimizzare i dati.

Il workload team vuole debugging efficace.

La decisione è:

```text
bounded metrics dimensions
+ structured logs
+ sampled traces
+ full preservation of required audit/business evidence
+ explicit retention classes
+ telemetry cost review
```

Non scegliamo “massima telemetry”.

Scegliamo **massima capacità di risposta per unità di complessità e costo ragionevoli**.

## Fonti

- [OpenTelemetry — Signals](https://opentelemetry.io/docs/concepts/signals/)
- [OpenTelemetry — Metrics specification](https://opentelemetry.io/docs/specs/otel/metrics/)
- [OpenTelemetry — Traces](https://opentelemetry.io/docs/concepts/signals/traces/)
- [OpenTelemetry — Logs](https://opentelemetry.io/docs/specs/otel/logs/)
- [Google SRE Workbook — Monitoring](https://sre.google/workbook/monitoring/)

> **Telemetry senza budget tende a crescere fino a diventare essa stessa un problema operativo.**