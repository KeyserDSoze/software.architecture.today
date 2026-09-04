## ESI — Order Operations Observability Architecture

Il Capitolo 15 non cambia la topologia cloud di Order Operations. Cambia la nostra capacità di capire come quella topologia si comporta.

Il workload resta interno, con ingress privato, modular monolith su Azure App Service, continuous WebJob nello stesso runtime envelope, PostgreSQL come stato locale, Azure Service Bus per Payment Escalation e Azure Monitor/Application Insights/Log Analytics come foundation già scelta.

La decisione nuova è collegare questa foundation a un **signal model intenzionale**:

```text
application/runtime instrumentation
→ OpenTelemetry-compatible signal model
→ Azure Monitor / Application Insights
→ Log Analytics / Azure Monitor metrics
→ SLI queries, investigation views e alerts
```

OpenTelemetry viene usato come modello e toolkit vendor-neutral per generation, collection ed export della telemetry. Non è il backend di storage o visualization. La documentazione OpenTelemetry distingue esplicitamente questi ruoli.

Fonte:

- [OpenTelemetry — What is OpenTelemetry?](https://opentelemetry.io/docs/what-is-opentelemetry/)

Azure Monitor/Application Insights rimane il backend operativo corrente perché è già parte della cloud foundation ESI. Se in futuro il backend cambiasse, il significato dei signal del workload non dovrebbe dipendere completamente da quel cambio.

## Partire dalle domande dei tre critical journey

### OJ-01 — Core operator read

```text
operator
→ private ingress
→ authentication / authorization
→ Order Operations
→ authoritative dependencies
→ operational view
```

Le domande sono: l’operatore riesce a usare il journey? Quanto tempo impiega? Una dependency sta degradando il risultato? Il comportamento è cambiato con una nuova release?

Ci servono quindi request outcome, latency distribution, dependency telemetry, deployment version e degraded-state classification.

### OJ-02 — Payment Escalation local acceptance

```text
operator
→ API
→ authorization
→ PostgreSQL transaction
   ├── PaymentEscalation
   └── OutboxMessage
→ 202 Accepted
```

Qui vogliamo misurare local acceptance, failure prima/durante il commit, idempotent replay e authorization outcome senza trasformare actor o `caseId` in metric dimensions.

### OJ-03 — Payment Escalation publication

```text
outbox
→ publisher
→ Service Bus
```

Qui la domanda centrale è se una escalation accettata venga pubblicata entro il target simulato di cinque minuti. Outbox pending, oldest age, publish rate e bounded failure class servono a spiegare l’SLI, non a sostituirlo.

### Downstream evidence

Il Capitolo 15 non inventa acknowledgement che Payments & Risk non ha ancora fornito. Quando il downstream avrà una evidence esplicita associabile a `escalationId`, il contract potrà misurare un tratto business end-to-end più ampio.

Questo limite è intenzionale: **non possiamo osservare con certezza ciò che il sistema non espone ancora come evidence**.

## Signal registry iniziale

Il naming tecnico finale potrà seguire le semantic convention correnti durante l’implementazione. Il significato del workload è già definito:

| Signal | Type | Purpose | Dimensions bounded |
|---|---|---|---|
| core journey requests | counter | traffic / SLI denominator | env, version, result |
| core journey duration | histogram | latency SLI | env, version, result |
| escalation requested | counter | business traffic | env, result |
| escalation local accept duration | histogram | local acceptance | env, result |
| outbox pending | gauge | backlog | env |
| outbox oldest age | gauge | business-delay risk | env |
| outbox publish failures | counter/event | diagnosis | env, failureClass |
| escalation publication duration | histogram | publication SLI | env, result |
| DLQ depth | gauge | recovery signal | env |

Non usiamo come metric dimensions:

```text
orderId
caseId
escalationId
messageId
operatorId
traceId
```

Queste identity possono vivere in trace, structured event o audit context dove sono necessarie all’investigazione e governate con retention/access appropriati.

## Structured events e correlation

Per `payment_escalation_requested` vogliamo context sufficiente a ricostruire l’azione senza serializzare il payload completo:

```text
traceId
correlationId
caseId quando consentito dalla policy
escalationId
result
actorClass
```

Per un publish failure:

```text
traceId / correlationId
messageId
escalationId
attempt
failureClass
```

L’errore raw non viene centralizzato alla cieca: deve essere sanitizzato se può contenere secret, credential o dati business non necessari.

La correlation conserva semantiche distinte:

```text
escalationId
→ business intent

messageId
→ technical delivery

traceId
→ execution

correlationId
→ cross-boundary operational flow
```

Un retry può creare un nuovo trace. Non cambia l’identità dell’intento.

## Sampling: non campionare il contratto

La prima iterazione non introduce un’infrastruttura dedicata di tail sampling.

La direzione è:

```text
SLI metrics/event accounting
→ non dipendono dal trace sampling

audit/business evidence richiesta
→ preservata secondo contract

diagnostic traces
→ sampled secondo environment, volume e costo

error/high-value traces
→ candidate a maggiore preservation
```

La percentuale concreta non viene inventata prima di avere traffico e cost evidence. Tail sampling diventerà un candidato se il volume rende utile preservare selettivamente error/high-latency trace e Platform offre o giustifica la capability.

## Cardinality e retention come guardrail, non tuning tardivo

Le custom metric seguono il cardinality budget:

1. route template e non URL concreta;
2. failure/result class bounded;
3. environment/version bounded;
4. business identifier unbounded vietato per default;
5. free-text mai metric dimension;
6. ogni eccezione ha owner e cost review.

La retention viene invece separata per operational metrics, diagnostic traces, application logs, security/audit evidence e business operational event. I numeri finali richiedono il confronto fra workload, Platform, Security, eventuale Legal/Compliance e Finance.

Non inventiamo una retention lunga “per sicurezza”. Conservare è una decisione di costo e data governance.

## Investigation view orientate a domande

La prima view, **Workload Health**, deve rispondere a:

```text
Il critical journey funziona?
Stiamo bruciando error budget?
Quale degraded mode è attivo?
Il cambio coincide con una release/configurazione?
```

Quindi combina SLI/SLO, burn, latency/errors/traffic/saturation, deployment marker e dependency context.

La seconda view, **Payment Escalation**, deve permettere di vedere requested rate, local acceptance, outbox pending/oldest age, publication latency, failure class, DLQ e reconciliation signal.

Non costruiamo una dashboard per ogni Azure resource. Le resource view possono supportare la diagnosi; non definiscono da sole la health del prodotto.

## Alert direction

Candidate per page:

```text
core journey fast error-budget burn
severe Payment Escalation publication burn
security-significant condition
intra-region outage oltre tolerance
```

Candidate per ticket:

```text
telemetry cost trend
capacity headroom in riduzione
ripetuta low-severity dependency degradation
```

Signal come una normale oscillazione CPU, un singolo retry o un sampled trace insolito restano investigation context finché non esiste una ragione per spendere attenzione umana.

## Synthetic journey: osservare dal boundary corretto

Production ingress è privato. Quindi la decisione è esplicita:

```text
NO public availability probe che aggira il private boundary
```

La direzione futura è:

```text
ESI private synthetic runner
→ approved private network path
→ Entra test/workload identity
→ dedicated synthetic tenant/data
→ core read journey
```

Questa capability al Capitolo 15 è `Designed`, non ancora `Codified` o `Verified`.

Non allarghiamo l’attack surface per rendere comodo il monitoring.

## Stato al momento del Capitolo 15

```text
Observability Contract      Designed
metric implementation       Pending
OpenTelemetry wiring        Pending
Application Insights        Codified foundation
structured business events  Designed
private synthetic journey   Designed
alerts                      Designed
runtime evidence            Not yet available
```

Questa baseline è importante perché impedisce una claim sbagliata: la presenza di Application Insights non rende il workload già osservabile secondo il contract.

Il file vivo `docs/observability-contract.md` nel capstone continua poi ad evolvere nei capitoli successivi. Nel progetto corrente contiene anche signal e quality boundary del Case Explanation Assistant introdotti molto più avanti. Il manoscritto qui conserva invece ciò che ESI sa e decide **al Capitolo 15**.

## Compromesso ESI

**Esigenza:** misurare SLO, diagnosticare failure e sostenere on-call.

**Tensione:** dettaglio investigativo contro ingestion cost, cardinality, privacy e operator noise.

**Decisione:** piccolo signal set correlabile; metriche bounded per SLI/alert; structured events; trace sampling governato; audit/business evidence separata; synthetic monitoring solo sul private path.

**Costo accettato:** non conserviamo per sempre ogni execution detail; alcune indagini richiedono la correlazione di più signal.

**Quality floor:** SLI misurabili, failure significativi investigabili, data minimization, auditability, correlation end-to-end e cost visibility.

**Guardrail:** Observability Contract, cardinality budget, retention classes, sampling policy, alert review e verification test.

Fonti:

- [OpenTelemetry — Documentation](https://opentelemetry.io/docs/)
- [OpenTelemetry — Signals](https://opentelemetry.io/docs/concepts/signals/)
- [Google SRE — Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)
- [Google SRE Workbook — Monitoring](https://sre.google/workbook/monitoring/)
- [Microsoft Learn — Application Insights overview](https://learn.microsoft.com/azure/azure-monitor/app/app-insights-overview)
- [Microsoft Learn — Azure Monitor OpenTelemetry](https://learn.microsoft.com/azure/azure-monitor/app/opentelemetry-overview)

> **Non vogliamo poter vedere tutto. Vogliamo poter ricostruire ciò che conta senza perdere il controllo del costo, del dato e del significato.**