## Sintesi: observability come evidence utilizzabile

Il Capitolo 15 ha trasformato l’observability da insieme di strumenti a **contratto operativo**.

Il punto di partenza non è la telemetry che possiamo raccogliere, ma le domande a cui dobbiamo rispondere. Da quelle domande scegliamo il signal primario, preserviamo correlation sufficiente, definiamo cardinality e retention, colleghiamo SLI e failure mode alla loro measurement source e decidiamo quando una deviazione merita davvero attenzione umana.

La sequenza può essere riassunta così:

```text
domanda operativa
→ signal con semantica
→ correlation
→ misura / investigation
→ decisione
→ evidence
```

Metrics, logs e traces non sono tre checkbox. Le metric comprimono il comportamento e rendono misurabili trend, SLI e saturation; gli structured event conservano contesto interrogabile; i trace mostrano il percorso di una execution. Il valore cresce quando sappiamo collegarli senza confondere execution identity, technical message identity e business identity.

Cardinality, sampling, retention e costo fanno parte dello stesso design. Un `caseId` può essere prezioso in una investigazione e distruttivo come dimensione di ogni time series. Un trace può essere campionato senza cambiare l’SLI; un audit event sensibile non deve ereditare automaticamente la stessa sampling policy. Conservare tutto non è osservabilità: può diventare costo, rumore e data exposure.

L’alerting porta il ragionamento fino alla persona. Un page spende attenzione umana e quindi deve essere urgente, azionabile, posseduto e collegato a un response path. I signal diagnostici possono essere ricchissimi senza generare un alert automatico.

Per ESI la baseline del Capitolo 15 è OpenTelemetry-compatible instrumentation sopra Azure Monitor/Application Insights/Log Analytics, metriche bounded, structured business/diagnostic event, trace sampling governato, correlation esplicita e synthetic monitoring soltanto attraverso il private access path.

## Artefatto operativo — Observability Contract

Il nuovo artefatto rende leggibili almeno:

```text
critical journeys
SLI / SLO measurement sources
signal registry
correlation
cardinality rules
sampling
retention classes
alerts
investigation views
synthetic checks
ownership
verification
cost guardrails
```

Per Order Operations vive in:

```text
docs/observability-contract.md
```

Il file del capstone è un artefatto cumulativo e continuerà a evolvere nei capitoli successivi. La baseline descritta qui è quella del Capitolo 15.

## Esercizio 1 — Dal requisito alla misura

Parti da:

> “Il sistema deve essere veloce.”

Trasformalo in:

1. capability;
2. good event;
3. bad event;
4. latency threshold;
5. measurement source;
6. aggregation;
7. SLO;
8. alert policy.

Poi elenca le assunzioni che hai introdotto. L’obiettivo è rendere evidente quanta architettura sia nascosta dentro un aggettivo.

## Esercizio 2 — Metric, log o trace?

Per ciascuna domanda scegli il **signal primario** e poi eventuale supporting evidence:

- quante richieste stanno fallendo?
- quale dependency ha rallentato una richiesta specifica?
- perché un `messageId` è stato pubblicato quattro volte?
- il backlog cresce più rapidamente del drain rate?
- quale operatore ha creato una escalation sensibile?
- quale release coincide con un cambiamento del p95?

Non rispondere “tutti e tre” senza distinguere i ruoli.

## Esercizio 3 — Cardinality attack

Prendi:

```text
http_requests_total
```

Un agente propone:

```text
method
route
status
userId
orderId
traceId
errorMessage
```

Classifica ogni dimensione come bounded utile, bounded ma discutibile, unbounded, sensitive, da spostare su log/trace o da rimuovere.

Disegna poi una versione governata della metric.

## Esercizio 4 — Sampling failure

Hai trace sampling al 5% e un incidente raro nello 0.1% delle richieste.

Spiega:

1. perché il sampling può ostacolare l’indagine;
2. quali metric complete devono comunque esistere;
3. quando abbia senso preservare maggiormente error/high-latency trace;
4. quando valuteresti tail sampling;
5. quale complessità e costo aggiunge.

## Esercizio 5 — Alert review

Analizza:

```text
CPU > 70% per 5 minuti
queue depth > 100
un HTTP 500
p95 > 1s
Payment Escalation publication SLO fast burn
```

Per ogni signal indica business impact, urgency, actionability, owner e se appartenga a page, ticket o dashboard. Se esiste un signal migliore più vicino all’outcome, proponilo.

## Esercizio 6 — Synthetic monitoring e private ingress

Un team propone:

> “Abilitiamo un endpoint pubblico `/health` così il monitoring può testarlo da Internet.”

Il workload è internal/private.

Valuta beneficio, modifica del threat model, alternative, synthetic identity, synthetic data, network path e ciò che il test dovrebbe realmente verificare.

L’obiettivo è non migliorare observability rompendo il security boundary.

## Esercizio 7 — Failure Mode Map coverage

Prendi una Failure Mode Map reale. Per ogni failure aggiungi:

```text
detection signal
diagnostic signal
alert sì/no
owner
runbook / response path
recovery evidence
```

Identifica almeno un failure che oggi sarebbe invisibile o diagnosticabile soltanto per intuizione.

## Esercizio 8 — Threat Model coverage

Scegli tre threat e chiedi per ciascuno:

```text
Come sappiamo che il controllo ha fallito?
Come distinguiamo uso legittimo da abuso?
Quale evidence serve?
Quale dato non deve comparire nella telemetry?
Chi indaga?
```

Collega poi i signal al Security Control Matrix.

## Esercizio 9 — AI incident investigator

Fornisci a un agente:

```text
SLO burn
recent deployments
representative traces
structured error events
Failure Mode Map
Observability Contract
```

Chiedigli di produrre un Investigation Bundle con observations, hypotheses, supporting/contradicting evidence, confidence, next discriminating check, unknowns e stop condition.

Valuta se separa correttamente evidence e inferenza oppure costruisce una root cause troppo presto.

## Esercizio 10 — Telemetry cost review

Immagina che il costo di observability raddoppi in tre mesi.

Non ridurre immediatamente tutto con una retention più corta. Cerca invece:

- nuovi log;
- dimensioni ad alta cardinalità;
- trace sampling cambiato;
- signal duplicati;
- debug logging dimenticato;
- metric senza consumer;
- dashboard/query obsolete;
- retention incoerenti con le classi di evidence.

Proponi una riduzione del costo senza rendere invisibile uno SLO o un failure critico.

## Esercizio 11 — Order Operations signal design

Progetta il signal set minimo per:

```http
POST /api/operational-cases/{caseId}/payment-escalations
```

Deve supportare:

- SLI local acceptance;
- authorization investigation;
- idempotency;
- outbox correlation;
- publish failure;
- audit;
- data minimization.

Spiega dove useresti metric, trace, structured event e audit event.

## Esercizio 12 — Broken correlation

Simula:

```text
HTTP traceId A
→ escalationId E
→ outbox messageId M
→ publish traceId B
→ consumer traceId C
```

Definisci quale informazione deve attraversare ogni boundary per poter ricostruire la causal chain anche se A, B e C appartengono a trace differenti.

Spiega anche quale identity **non** useresti come business key.

## Autovalutazione

Dovresti saper spiegare senza consultare il capitolo perché monitoring e observability non coincidano perfettamente; la differenza tra symptom e cause signal; i quattro golden signals di Google SRE; quando una metric sia preferibile a un trace; perché `traceId` non sostituisca `EscalationId`; perché cardinality abbia un costo; perché una URL concreta sia una cattiva metric dimension; che cosa perdi con head sampling; perché audit e diagnostic traces abbiano policy diverse; che cosa renda un alert azionabile; perché il private ingress cambi il synthetic monitoring; che ruolo abbia l’Observability Contract; perché telemetry schema e query siano una compatibility surface; come un investigation agent debba distinguere observation e hypothesis; e quando un signal possa essere rimosso.

## Cosa cambia con l’AI

L’AI abbassa enormemente il costo di generare instrumentation, query, dashboard, alert, runbook e incident summary.

Questo rende più facile produrre **più observability artifacts di quanti il team riesca a comprendere e governare**.

La domanda quindi non è soltanto:

```text
Può l’AI generare questa telemetry?
```

ma:

```text
Quale decisione abilita?
Quale failure rende visibile?
Quale costo introduce?
Quale dato espone?
Chi la possiede?
Come la verifichiamo?
```

Per l’investigation, l’AI può comprimere evidence e proporre il prossimo test. Non deve trasformare plausibilità in causalità dimostrata.

## Il compromesso ESI del capitolo

**Esigenza:** misurare SLO, diagnosticare failure e sostenere l’on-call.

**Tensione:** visibilità profonda contro costo, cardinality, data minimization e alert fatigue.

**Decisione:** OpenTelemetry-compatible instrumentation con Azure Monitor/Application Insights; metriche bounded per SLI e alert; structured events; governed trace sampling; business/audit evidence separata; synthetic journey soltanto sul private path.

**Costo accettato:** non conserviamo ogni dettaglio di ogni execution e alcune investigazioni richiedono correlation fra più signal.

**Quality floor:** SLI misurabili, failure critici investigabili, correlation, security redaction, auditability, actionable alerting e cost visibility.

**Guardrail:** Observability Contract, cardinality budget, retention classes, sampling policy, alert-quality review, owner/response path e verification test.

## Ponte al Capitolo 16 — Testing Architecture

Adesso sappiamo:

```text
che cosa il sistema deve fare
come può fallire
come deve recuperare
come possiamo osservarlo
```

Il passo successivo è chiedere:

> **Quale evidence dobbiamo produrre prima di lasciare che una modifica raggiunga la produzione?**

Il Capitolo 16 entrerà in testing strategy, contract e integration test, end-to-end test, property-based testing, failure/security testing e nel nuovo rischio dell’era AI:

```text
molti test generati
≠
molta confidenza
```

## Corollario

> **Se un sistema produce dati ma durante un incidente non sappiamo quale domanda fare, non abbiamo observability. Abbiamo soltanto telemetry.**