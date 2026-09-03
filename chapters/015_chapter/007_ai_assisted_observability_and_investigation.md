# AI-assisted observability: accelerare l'indagine senza inventare la causa

L'observability è uno dei contesti in cui l'AI può essere estremamente utile.

Durante un incidente possiamo avere:

- migliaia di log;
- centinaia di trace;
- decine di dashboard;
- deployment recenti;
- incident history;
- runbook;
- metriche che cambiano contemporaneamente.

Un agente può aiutare a ridurre questo spazio di ricerca.

Ma esiste un rischio evidente:

> trasformare una correlazione plausibile in una causalità inventata.

## Che cosa può fare bene un agente

### Riassumere signal

Input:

```text
SLO burn
recent deployment
failure classes
trace sample
outbox age
Service Bus dependency errors
```

Output utile:

```text
- il problema inizia alle 14:07
- deployment v42 alle 14:04
- gli errori sono concentrati sul publish path
- le read API restano sane
- outbox oldest age cresce monotonicamente
```

Questa è sintesi di evidence.

### Formulare ipotesi

Un agente può proporre:

```text
H1: Service Bus unavailable
H2: private DNS resolution failure
H3: runtime identity/RBAC regression
H4: publisher code regression
```

molto rapidamente.

La qualità nasce quando ogni ipotesi contiene anche:

```text
supporting evidence
contradicting evidence
next discriminating check
```

### Generare query

Può aiutare a costruire:

- log query;
- trace filter;
- metric breakdown;
- deployment correlation;
- comparison query prima/dopo incidente.

### Confrontare runbook e realtà

Può verificare se il runbook suggerisce ancora signal o componenti esistenti.

### Costruire timeline

Correlando timestamp da:

```text
deployment
audit
metric
logs
incident actions
```

può velocizzare la ricostruzione.

## Dove l'AI può sbagliare

### Causalità prematura

```text
Deployment alle 14:04
Errori alle 14:07
→ deployment è la causa
```

È una ipotesi ragionevole.

Non è ancora una prova.

### Log come realtà completa

Se un evento non viene registrato, l'agente può inferire che non sia avvenuto.

Ma absence of evidence può significare:

- instrumentation mancante;
- sampling;
- ingestion failure;
- query incompleta;
- clock skew;
- retention.

### Metric semantics incomprese

Un agente può interpretare:

```text
queue depth = 1000
```

come incidente.

Ma senza arrival rate, drain rate e business threshold il numero è ambiguo.

### Confondere correlation ID e business ID

`traceId`, `messageId` ed `EscalationId` hanno semantiche diverse.

Un sistema AI senza context engineering può considerarli intercambiabili e ricostruire male il workflow.

### Over-query

Un agente molto autonomo può eseguire troppe query costose o interrogare dataset sensibili più del necessario.

Anche investigation autonomy richiede permission boundary.

## Evidence-first investigation

Per gli agenti ESI useremo un formato simile:

```text
Observation
Evidence diretta disponibile.

Hypothesis
Spiegazione possibile.

Confidence
Quanto è sostenuta.

Contradictions
Signal che non quadrano.

Next check
La query o il test che discrimina meglio.

Stop condition
Quando non procedere automaticamente.
```

Questo evita il report:

```text
Root cause: database issue
```

quando l'unica evidenza è una spike di latency.

## AI e root cause analysis

Il termine `root cause` è spesso troppo forte.

Nei sistemi complessi un incidente può derivare da:

```text
trigger
+ latent condition
+ weak guardrail
+ propagation path
+ response delay
```

L'AI può aiutare a costruire questa catena.

Non deve forzare una causa unica solo perché il formato del report la richiede.

## Verification senza rifare tutto

Il Capitolo 0 aveva introdotto una regola:

> verificare senza rieseguire mentalmente tutto il lavoro dell'agente.

Nell'observability questo significa che un agente può produrre un **Investigation Bundle**:

```text
incident window
affected SLI
query links/definitions
trace IDs di esempio
failure classes
recent deployments
hypotheses ranked
contradicting evidence
recommended next check
```

L'umano non deve leggere ogni log.

Deve poter controllare il ragionamento usando evidence riproducibile.

## Agent access model

Un investigation agent non dovrebbe avere automaticamente:

```text
write production
RBAC administration
secret read
arbitrary customer-data export
```

Per molte indagini basta:

```text
read telemetry
read deployment metadata
read runbooks
read architecture docs
```

Le azioni di remediation possono richiedere un livello di autonomia diverso.

Osservare e modificare il sistema sono capability diverse.

## Telemetry context engineering

Un agente diventa più utile se il repository rende espliciti:

```text
Observability Contract
Reliability Contract
Failure Mode Map
Threat Model
runbook
service ownership
metric semantics
alert semantics
```

Altrimenti il modello vede serie temporali e log senza conoscere il significato del sistema.

Questa è ancora una volta context engineering.

## AI-generated instrumentation

Un agente può generare rapidamente:

- span;
- metric;
- structured log;
- dashboard definition;
- alert query.

Il rischio è l'**Instrumentation Explosion**.

Se chiediamo:

> rendi osservabile questo servizio

potremmo ottenere instrumentation tecnicamente valida ma economicamente e semanticamente pessima.

Serve un contract prima della generazione.

## Review automatica della telemetry

Un agente può invece essere molto efficace come reviewer:

```text
Trova metric dimensions unbounded.

Trova log che possono contenere token o PII.

Confronta Failure Mode Map e signal disponibili.

Trova alert senza owner/runbook.

Trova metriche non collegate a SLI, alert o dashboard.

Trova correlation boundary spezzati.
```

Questi task hanno input e criteri molto più verificabili di una generica richiesta di “migliorare l'observability”.

## Regola ESI

L'AI può:

```text
ridurre il tempo per trovare evidence
```

Non può trasformare:

```text
plausibilità
```

in:

```text
causalità dimostrata
```

senza una verifica.

## Fonti di base

- [OpenTelemetry — Observability primer](https://opentelemetry.io/docs/concepts/observability-primer/)
- [Google SRE — Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)
- [Google SRE Workbook — Monitoring](https://sre.google/workbook/monitoring/)

Le modalità di uso degli agenti sono il modello operativo proposto dal libro; non vengono presentate come uno standard esterno.

> **L'AI può trovare più velocemente una storia nei dati. Il nostro compito è verificare che quella storia sia davvero successa.**