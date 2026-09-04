## Cardinality, sampling, costo e data governance

L’observability ha una proprietà pericolosa: aggiungere un signal costa poco, mentre rimuoverlo mesi dopo è difficile. Nel tempo una nuova label, un nuovo trace attribute, un nuovo log e una retention più lunga possono accumularsi fino a produrre una seconda piattaforma complessa quanto il workload che stavano cercando di osservare.

Il problema non è soltanto economico. Telemetry incontrollata può creare query lente, dashboard fragili, alert rumorosi, esposizione di dati sensibili e soprattutto una enorme quantità di informazioni senza una gerarchia di significato.

Per questo costo, cardinalità e data governance non sono attività FinOps da aggiungere dopo. Sono parte dell’observability design.

## Cardinality: quando “più dettaglio” cambia la scala del sistema

Consideriamo una metric semplice:

```text
payment_escalation_requests_total
```

Con dimensioni bounded come:

```text
environment
result
```

il numero di serie resta controllabile.

Se aggiungiamo:

```text
tenantId
caseId
orderId
operatorId
messageId
```

non abbiamo semplicemente una metric più dettagliata. Ogni combinazione può generare una nuova time series e cambiare drasticamente storage, ingestion e query cost.

La distinzione pratica è tra attributi con un insieme di valori relativamente limitato — environment, route template, result class, failure class, service version — e attributi che crescono con utenti, ordini, case, trace o messaggi.

Questi ultimi possono essere preziosi durante una investigazione. Semplicemente non sono il posto giusto in ogni metric dimension.

Un esempio piccolo ma fondamentale è l’HTTP route:

```text
/api/operational-cases/{caseId}/payment-escalations
```

è una dimensione bounded.

La URL concreta con un `caseId` diverso per ogni richiesta trasforma invece business identity in cardinalità infrastrutturale.

## Il cardinality budget di ESI

Nel capstone introduciamo una regola operativa, non una feature di Azure o OpenTelemetry: ogni custom metric significativa deve dichiarare purpose, dimensions, expected value set, owner e consumer.

Se una dimensione cresce con il numero di utenti, case, ordini, escalation o messaggi, la risposta di default è **no** finché non esiste una motivazione esplicita.

Questo produce un semplice cardinality budget:

```text
bounded dimension by default
unbounded identity → trace/log/audit context quando serve
free text → mai metric dimension
```

Il budget non serve a vietare informazione. Serve a scegliere il signal con l’economia adatta.

## Sampling: spendere meno accettando di non vedere ogni execution

I trace possono produrre volumi importanti. Conservare ogni singola esecuzione non è sempre utile né economicamente sostenibile.

Il sampling riduce il volume, ma compra quel risparmio accettando la possibilità di perdere un dettaglio che in futuro potrebbe servirci.

Con **head sampling** la decisione viene presa presto, prima di conoscere l’outcome completo. È semplice e prevedibile, ma può scartare proprio la richiesta che diventerà interessante più avanti.

Con **tail sampling** la decisione può usare l’esito del trace e quindi preservare, per esempio, errori o high-latency execution. Questo aumenta però infrastruttura, buffering e operational complexity.

Per la prima versione ESI non introduciamo un sistema dedicato di tail sampling senza volume e cost evidence che lo giustifichino.

Il punto più importante è un altro:

> **Il sampling dei trace non deve cambiare la semantica degli SLI.**

Se il core journey SLO richiede una misura completa, la source primaria deve essere un signal appropriato — metric counter/histogram o event accounting — e non un sample arbitrario dei trace.

I trace spiegano. Lo SLI misura.

## Non tutti gli errori meritano la stessa retention

Una policy può scegliere di preservare una quota più alta di error trace, rare failure class o high-latency execution rispetto al traffico normale. È una buona direzione finché non dimentichiamo che anche il comportamento sano serve come confronto.

Lo stesso vale per i log. Una dependency indisponibile può produrre migliaia di stack trace identici. Registrare ogni copia può aumentare il costo, saturare la pipeline e nascondere signal più importanti proprio durante l’incidente.

Possiamo aggregare, rate-limitare, deduplicare o campionare diagnostic event ripetitivi.

Non possiamo applicare la stessa leggerezza a un audit event di una operazione sensibile. Il tipo di evidence cambia la policy.

## Separare le classi di telemetry prima di scegliere la retention

Per Order Operations distinguiamo almeno cinque classi:

**Operational metrics** per SLI, saturation, alerting e trend.

**Diagnostic traces** per execution path e dependency behavior, con sampling governato.

**Application diagnostic logs** per eventi tecnici strutturati e minimizzati.

**Security/audit events** per accountability e operazioni sensibili, con policy di accesso e retention proprie.

**Business operational events** per stato e progression dei journey, come Payment Escalation `Requested`, `Published`, `Delayed` o `DeadLettered`.

Questa classificazione evita una retention unica applicata per comodità a dati con significati e rischi differenti.

Più retention non è automaticamente meglio. Una retention lunga aumenta costo, privacy exposure, superficie di accesso e governance. Una retention troppo breve rende impossibili trend analysis, incident comparison, capacity planning o audit.

La domanda corretta è:

> **Per quale decisione ci serve questo signal e per quanto tempo deve rimanere interrogabile?**

## Il telemetry store è un vero data store

Il Capitolo 13 aveva già fissato un quality floor:

```text
no token
no Authorization header
no secret
payload minimization
```

Qui lo estendiamo: request e response body non vengono registrati per default; free-text business content non diventa metric dimension; gli identifier vengono classificati prima della propagation; redaction e minimization avvengono prima dell’export quando possibile.

Un workspace centralizzato può diventare uno dei database più sensibili dell’azienda proprio perché mette in relazione informazioni che nei sistemi originali erano separate.

Observability e Security by Design si incontrano quindi sul data lifecycle della telemetry.

## Rendere osservabile anche il costo dell’observability

Se il costo di telemetry cresce, dobbiamo riuscire a sapere perché.

Per ESI vogliamo almeno distinguere:

```text
log ingestion volume
trace ingestion volume
custom metric count/cardinality
retention/storage cost
query cost dove applicabile
```

Non per ottimizzare ogni byte, ma per evitare una situazione paradossale in cui il sistema di osservazione costa più della capability che protegge senza produrre un aumento proporzionato della capacità investigativa.

La cost review deve quindi chiedere quali signal siano ancora usati da SLI, alert, dashboard, runbook o investigation. Un debug log dimenticato può essere un costo reale. Una metric senza consumer è un candidato alla rimozione.

## Platform standardizza il meccanismo, il workload possiede il significato

Platform Engineering può fornire collector/export path, semantic convention comuni, workspace policy, default retention, security baseline e cost allocation.

Non può sapere da sola che `PaymentEscalation PublishedWithinTarget` è il signal che collega business intent e reliability contract.

Il workload team deve possedere custom metric, business event, SLI query, failure-specific telemetry e alert meaning.

Questa divisione è coerente con la landing zone dei Capitoli precedenti: centralizziamo ciò che riduce cognitive load condiviso, non la semantica del prodotto.

## Il compromesso ESI

Operations vorrebbe conservare tutto. Finance vuole contenere ingestion e retention. Security vuole minimizzare dati. Il workload team vuole poter diagnosticare rapidamente failure rari.

La decisione corrente è:

```text
bounded metric dimensions
+ structured diagnostic events
+ governed trace sampling
+ preserved audit/business evidence quando richiesto
+ explicit retention classes
+ telemetry cost review
```

Non scegliamo la massima quantità di telemetry.

Scegliamo la massima capacità di risposta compatibile con costo, privacy e complessità sostenibili.

Fonti:

- [OpenTelemetry — Signals](https://opentelemetry.io/docs/concepts/signals/)
- [OpenTelemetry — Metrics specification](https://opentelemetry.io/docs/specs/otel/metrics/)
- [OpenTelemetry — Traces](https://opentelemetry.io/docs/concepts/signals/traces/)
- [OpenTelemetry — Logs](https://opentelemetry.io/docs/specs/otel/logs/)
- [Google SRE Workbook — Monitoring](https://sre.google/workbook/monitoring/)

> **Telemetry senza budget tende a crescere fino a diventare essa stessa un problema operativo.**