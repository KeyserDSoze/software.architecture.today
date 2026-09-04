## Observability Contract

Finora il capstone ha accumulato diversi artefatti che descrivono il sistema da prospettive complementari:

```text
Failure Mode Map
Threat Model
Security Control Matrix
Reliability Contract
```

Manca ancora il documento che dica **quale evidence il sistema deve produrre per rendere osservabili quelle decisioni**.

Lo chiamiamo **Observability Contract**.

Non è uno standard universale. È l’artefatto operativo usato da questo libro per dichiarare che cosa dobbiamo poter sapere, attraverso quali signal, con quale ownership, quale retention, quale costo e quale verification path.

## Perché serve un contratto e non soltanto instrumentation

L’instrumentation tende a crescere localmente.

Una metric viene aggiunta per una dashboard. Un log nasce durante un incidente. Un alert viene copiato da un altro servizio. Un trace attribute appare perché era disponibile nel context.

Ogni scelta può essere ragionevole isolatamente e produrre, nel tempo, un sistema difficile da governare.

Senza una vista d’insieme diventa complicato rispondere a domande semplici:

```text
quali signal misurano davvero gli SLO?
quale failure mode è ancora invisibile?
quale evidence monitora un security control?
quali metric non hanno consumer?
quali identifier possiamo registrare?
chi possiede un alert?
quale retention è intenzionale?
che cosa deve essere provato prima della produzione?
```

Il contract serve a conservare il significato, non a elencare ogni log line.

## Template operativo

Una forma leggera può essere:

```markdown
# Observability Contract

## Critical journeys

## SLI / SLO measurements

## Signal registry

## Correlation

## Cardinality rules

## Sampling

## Retention classes

## Alerts

## Investigation views

## Synthetic checks

## Ownership

## Verification

## Cost guardrails

## Open decisions
```

Il dettaglio tecnico può vivere nel codice e nella platform configuration. Qui rimane ciò che governa outcome, failure, security, recovery, investigation e costo.

## Signal registry: registrare ciò che ha significato architetturale

Per i signal importanti possiamo mantenere una tabella compatta:

| Signal | Type | Purpose | Dimensions/context | Consumer | Owner | Status |
|---|---|---|---|---|---|---|
| core journey good events | metric | SLI-01 | env/version/result | SLO | workload | Designed |
| outbox oldest age | gauge | backlog risk | env | alert/investigation | workload | Designed |
| escalation publication duration | histogram/event | SLI-03 | env/result | SLO | workload | Designed |
| publish failure | structured event | diagnosis | failure class + correlation | investigation | workload | Designed |

Non serve censire ogni telemetry field. Vogliamo registrare i signal che hanno una responsabilità operativa o una relazione con un contratto del sistema.

## Reliability Contract → measurement source

Il collegamento più importante è con gli SLO.

Se il Reliability Contract dice:

```text
Payment Escalation publication
99% <= 5 min
```

l’Observability Contract deve trasformarlo in una misura:

```text
source event = Requested
terminal event = Published
business key = escalationId
measure = publishedAt - requestedAt
aggregation = within-target / valid requested
```

A questo punto lo SLO smette di essere un numero isolato. Possiamo indicare l’evento che lo fa entrare nel denominatore, l’evento che dimostra il successo e la business identity che li collega.

## Failure Mode Map → detection e investigation

Un failure significativo non richiede necessariamente un page, ma non dovrebbe essere invisibile.

Per esempio:

```text
Failure Mode:
Service Bus unavailable
```

può essere investigato attraverso:

```text
publish failure events
outbox oldest age
outbox pending
Service Bus dependency telemetry
Payment Escalation publication SLI
```

Il contract rende esplicito che questi signal raccontano lo stesso failure da prospettive diverse.

## Threat Model e Security Control Matrix → security evidence

Se il threat model include cross-tenant access attempt, possiamo voler preservare outcome di authorization, reason class bounded, request correlation e informazioni sufficienti a investigare il mismatch senza registrare token o payload sensibili.

Il Threat Model dice che cosa temiamo. Il Security Control Matrix dice quale controllo riduce il rischio. L’Observability Contract aggiunge:

> **Come ci accorgiamo che il controllo sta fallendo o che il suo comportamento sta cambiando?**

Questo è anche il punto in cui un controllo può avanzare verso `Monitored`.

Per esempio, un RBAC send-only sul Service Bus può essere `Codified` in Bicep e `Verified` con un negative permission test. Il monitoraggio di role/configuration change può appartenere invece al platform audit path, non a una custom application metric.

Non tutto deve essere instrumentato dall’applicazione.

## Correlation contract: preservare le identity giuste attraverso i boundary

Per Order Operations la relazione è:

```text
HTTP request
  traceId
  correlationId quando serve

OperationalCase
  caseId

PaymentEscalation
  escalationId

OutboxMessage
  messageId
  escalationId
  correlationId

Payments consumer
  messageId
  escalationId
  correlationId
```

La semantica resta distinta:

- `traceId` descrive una execution;
- `messageId` descrive una delivery tecnica;
- `escalationId` descrive la stessa intenzione business anche attraverso retry e redelivery;
- `correlationId` collega un flow operativo più ampio quando necessario.

Nessuno di questi identificatori entra automaticamente nelle metric dimensions.

## Anche la telemetry ha versioning e compatibility

Se rinominiamo una metric o cambiamo il significato di un `result` senza aggiornare SLI query, alert, dashboard e runbook, abbiamo introdotto una breaking change operativa.

La telemetry è quindi una compatibility surface.

Una dashboard non dovrebbe essere l’unico posto in cui esiste questa conoscenza. Deve poter essere ricostruita dal contract, dalle query versionate e dalla semantic definition dei signal.

Per ESI preferiamo view orientate a domande.

Una **Workload Health view** deve aiutare a capire core journey SLI, burn, latency/errors/traffic/saturation, degraded state e recent deployment.

Una **Payment Escalation view** deve mostrare requested rate, local acceptance, outbox pending/oldest age, publication latency, failure class, DLQ e reconciliation.

Una **investigation view** deve facilitare failure-class breakdown, trace search, deployment/config correlation e dependency behavior.

Non costruiamo una dashboard per ogni Azure resource soltanto perché il resource provider offre grafici.

## L’observability può essere testata

Un signal non diventa `Verified` perché il codice contiene una chiamata `record()`.

Possiamo produrre evidence con test come:

```text
inject known application failure
→ expected metric/event appare

force publish failure
→ outbox age cresce
→ query/alert condition cambia come previsto

propagate synthetic context
→ correlation attraversa il boundary

emit known structured event
→ required field presente
→ forbidden sensitive field assente

compute SLI on known fixture dataset
→ expected ratio/burn ottenuto
```

Questi test non sostituiscono la produzione. Evitano però di scoprire durante il primo incidente che correlation, redaction o SLI query non funzionano.

## Il contract deve restare piccolo abbastanza da governare

Se l’Observability Contract contiene cinquecento metriche senza spiegare quale decisione abilitino, abbiamo ricreato il problema in Markdown.

Manteniamo nel contract ciò che rende il workload governabile. Il dettaglio implementativo resta vicino al codice o alla piattaforma.

Nel repository vivo `docs/observability-contract.md` continuerà a evolvere nei capitoli successivi. Quando arriverà il Case Explanation Assistant, per esempio, vi entreranno nuovi signal AI e nuovi boundary di qualità. Questa sezione descrive la **baseline del Capitolo 15**, non pretende che l’artefatto cumulativo si fermi qui.

Fonti:

- [OpenTelemetry — Observability primer](https://opentelemetry.io/docs/concepts/observability-primer/)
- [OpenTelemetry — Specification overview](https://opentelemetry.io/docs/specs/otel/overview/)
- [Google SRE Workbook — Monitoring](https://sre.google/workbook/monitoring/)

> **L’Observability Contract non descrive tutto ciò che possiamo misurare. Descrive ciò che dobbiamo riuscire a sapere.**