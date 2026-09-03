# Esercizi, autovalutazione e sintesi

Il Capitolo 15 ha trasformato l'observability da insieme di strumenti a **contratto operativo**.

L'obiettivo non è raccogliere tutto.

È poter rispondere alle domande importanti quando il sistema è sano, degradato o in incidente.

## Idee chiave

1. monitoring e observability sono collegati ma non equivalenti;
2. una dashboard non è una architettura di observability;
3. metrics, logs e traces rispondono a domande differenti;
4. la correlazione moltiplica il valore dei singoli signal;
5. business identity e trace identity non sono la stessa cosa;
6. `HTTP 200` non dimostra che il journey sia sano;
7. SLI e SLO devono avere una fonte di misura esplicita;
8. black-box e white-box monitoring servono entrambi;
9. il degraded mode deve essere osservabile;
10. cardinality è una decisione di cost/scalability;
11. sampling è un trade-off, non una ottimizzazione gratuita;
12. audit evidence e trace diagnostici non hanno la stessa retention/sampling policy;
13. ogni alert spende attenzione umana;
14. un alert senza azione e owner è incompleto;
15. il private security boundary modifica il modo in cui progettiamo synthetic monitoring;
16. telemetry schema e query possono avere breaking change operative;
17. l'AI può accelerare l'indagine ma non deve inventare causalità;
18. l'Observability Contract collega SLO, failure, threat, signal, owner e verification.

## Artefatto operativo — Observability Contract

Il nuovo artefatto del capitolo deve rendere visibili almeno:

```text
critical journeys
SLI measurement sources
metrics
traces
structured logs
business events
audit/security signals
correlation
cardinality rules
sampling
retention
alerts
synthetic checks
ownership
verification
cost guardrails
```

Per Order Operations vive in:

```text
docs/observability-contract.md
```

## Esercizio 1 — Dal requisito alla misura

Scegli una frase come:

```text
Il sistema deve essere veloce.
```

Trasformala in:

1. capability;
2. good event;
3. bad event;
4. latency threshold;
5. measurement source;
6. aggregation;
7. SLO;
8. alert policy.

Poi indica quali assunzioni hai introdotto.

## Esercizio 2 — Metric, log o trace?

Per ciascuna domanda scegli il signal primario e spiega perché:

- quante richieste stanno fallendo?
- quale dependency ha rallentato una richiesta specifica?
- perché un `messageId` è stato pubblicato quattro volte?
- il backlog cresce più rapidamente del drain rate?
- quale operatore ha creato una escalation sensibile?
- quale release ha cambiato il p95?

Non rispondere “tutti e tre” senza distinguere primary signal e supporting evidence.

## Esercizio 3 — Cardinality attack

Prendi questa metric:

```text
http_requests_total
```

Un agente propone le label:

```text
method
route
status
userId
orderId
traceId
errorMessage
```

Classifica ogni label come:

- bounded utile;
- bounded ma discutibile;
- unbounded;
- sensitive;
- da spostare su log/trace;
- da rimuovere.

Disegna poi una versione governata della metric.

## Esercizio 4 — Sampling failure

Hai sampling trace al 5%.

Un incidente raro avviene nello 0.1% delle richieste.

Rispondi:

1. perché il sampling può ostacolare l'indagine?
2. quali metric complete devono comunque esistere?
3. ha senso preservare tutti gli error trace?
4. quando valuteresti tail sampling?
5. quali costi introduce?

## Esercizio 5 — Alert review

Analizza questi alert:

```text
CPU > 70% per 5 minuti
queue depth > 100
un HTTP 500
p95 > 1s
Payment Escalation publication SLO fast burn
```

Per ognuno indica:

- user/business impact;
- urgency;
- actionability;
- owner;
- page/ticket/dashboard;
- signal migliore alternativo.

## Esercizio 6 — Synthetic monitoring e private ingress

Un team propone:

> abilitiamo un endpoint pubblico `/health` così Application Insights può testarlo da Internet.

Il workload è internal/private.

Valuta:

- beneficio;
- threat-model change;
- alternative;
- synthetic identity;
- synthetic data;
- network path;
- cosa dovrebbe verificare realmente il test.

## Esercizio 7 — Failure Mode Map coverage

Prendi una Failure Mode Map reale.

Per ogni failure aggiungi:

```text
detection signal
diagnostic signal
alert sì/no
owner
runbook
recovery evidence
```

Identifica almeno un failure attualmente invisibile.

## Esercizio 8 — Threat Model coverage

Prendi tre threat.

Per ciascuno chiedi:

```text
Come sappiamo che il controllo ha fallito?
Come distinguiamo uso legittimo da abuso?
Quale signal non deve contenere dati sensibili?
Chi indaga?
```

L'obiettivo è collegare Threat Model e Observability Contract.

## Esercizio 9 — AI incident investigator

Fornisci a un agente:

```text
SLO burn
recent deployments
five representative traces
structured error events
Failure Mode Map
```

Chiedigli di produrre:

```text
observations
hypotheses
supporting evidence
contradicting evidence
next discriminating query
confidence
```

Valuta se separa correttamente evidence e inferenza.

## Esercizio 10 — Telemetry cost review

Immagina che il costo di observability raddoppi in tre mesi.

Non ridurre semplicemente la retention.

Analizza:

- nuovi log;
- cardinality;
- trace sampling;
- duplicate signal;
- debug logging dimenticato;
- metric non più usate;
- retention per classe;
- query/dashboard obsolete.

Proponi una riduzione del costo senza rendere invisibile un SLO o un failure critico.

## Esercizio 11 — Order Operations signal design

Progetta il signal set minimo per:

```text
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

Spiega dove usi metric, trace, structured log e audit event.

## Esercizio 12 — Broken correlation

Simula:

```text
HTTP traceId A
→ escalationId E
→ outbox messageId M
→ publish traceId B
→ consumer traceId C
```

Definisci quale informazione deve essere preservata per poter ricostruire la causal chain anche se A, B e C sono trace differenti.

## Autovalutazione

Dovresti saper rispondere senza consultare il capitolo:

1. Perché monitoring e observability non sono sinonimi perfetti?
2. Qual è la differenza fra symptom e cause monitoring?
3. Quali sono i quattro golden signals di Google SRE?
4. Quando useresti una metric invece di un trace?
5. Perché `traceId` non deve sostituire `EscalationId`?
6. Che cos'è la cardinality e perché può essere costosa?
7. Perché una URL concreta è una cattiva metric dimension?
8. Che cosa perdi con head sampling?
9. Perché un audit event non può seguire necessariamente la stessa sampling policy di un trace?
10. Che cosa rende un alert azionabile?
11. Perché un endpoint privato modifica il synthetic monitoring design?
12. Qual è il ruolo dell'Observability Contract?
13. In che senso un dashboard schema può essere una compatibility surface?
14. Come deve usare l'AI evidence e hypothesis durante un incidente?
15. Quando un signal può essere rimosso?

## Cosa cambia con l'AI

L'AI riduce drasticamente il costo di:

- generare instrumentation;
- scrivere query;
- creare dashboard;
- riassumere log;
- correlare signal;
- proporre ipotesi;
- generare runbook.

Questo aumenta un nuovo rischio:

> **produrre più observability artifacts di quanti il team riesca a comprendere e governare.**

Quindi il problema si sposta ancora una volta dall'execution al judgment.

Non chiediamo soltanto:

```text
Può l'AI generare questa telemetry?
```

Chiediamo:

```text
Quale decisione abilita?
Quale costo introduce?
Quale dato espone?
Quale failure copre?
Chi la possiede?
Come la verifichiamo?
```

## Compromesso ESI del capitolo

**Esigenza:** misurare SLO, diagnosticare failure e supportare on-call.

**Tensione:** visibilità profonda vs cost, cardinality, data minimization e alert fatigue.

**Decisione:** OpenTelemetry-compatible instrumentation con Azure Monitor/Application Insights, metriche bounded per SLI e alert, structured logs, trace sampling governato, business/audit evidence separata e synthetic journey soltanto attraverso il private path.

**Costo accettato:** non conserviamo ogni dettaglio di ogni execution e alcune indagini richiederanno correlazione fra più signal.

**Quality floor:** SLI misurabili, failure critici investigabili, correlation, security redaction, auditability e actionable alerting.

**Guardrail:** Observability Contract, cardinality budget, retention classes, sampling policy, alert quality review, owner/runbook e verification test.

## Ponte al Capitolo 16 — Testing Architecture

Adesso sappiamo:

```text
che cosa il sistema deve fare
come può fallire
come deve recuperare
come possiamo osservarlo
```

Il passo successivo è inevitabile:

> **quale evidence dobbiamo produrre prima di lasciare che una modifica raggiunga la produzione?**

Il Capitolo 16 affronterà testing strategy, test pyramid senza dogma, contract test, integration test, end-to-end test, property-based testing, test dei failure mode, security test e soprattutto il rischio nuovo dell'era AI:

```text
molti test generati
≠
molta confidenza
```

## Corollario

> **Se un sistema produce dati ma durante un incidente non sappiamo quale domanda fare, non abbiamo observability. Abbiamo soltanto telemetry.**