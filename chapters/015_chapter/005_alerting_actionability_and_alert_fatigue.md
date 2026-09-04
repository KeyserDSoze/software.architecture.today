# Alerting: interrompere una persona è una decisione architetturale

Un alert non è una query salvata.

Non è una soglia colorata di rosso.

Non è una metrica importante.

È una decisione molto più costosa:

> **qualcuno deve interrompere ciò che sta facendo perché il sistema richiede un'azione adesso.**

Questa distinzione cambia completamente il modo in cui progettiamo l'alerting.

## Alert!= dashboard

Una dashboard può mostrare:

```text
CPU 82%
outbox pending 143
p95 latency 920 ms
```

senza richiedere automaticamente intervento.

Un alert deve invece avere almeno:

```text
condition
impact
urgency
owner
action
runbook/context
resolution signal
```

Se manca l'azione possibile, spesso stiamo creando rumore.

## Page, ticket, dashboard

Per ESI distinguiamo tre classi operative.

### Page

Serve intervento umano urgente.

Esempi possibili:

```text
core journey SLO fast burn
cross-tenant security incident
Payment Escalation delivery target severamente violato
regional/intra-region availability incident
```

### Ticket / work item

Richiede azione, ma non immediata.

Esempi:

```text
storage trend in crescita
telemetry cost fuori budget
obsolete dependency
repeated near-capacity condition
```

### Dashboard / investigation signal

Serve contesto, non un'interruzione.

Esempi:

```text
CPU breakdown
trace sample
query latency distribution
retry classification
```

Questa tassonomia evita di trasformare ogni deviazione in emergenza.

## Google SRE: urgente, azionabile, user-visible

Google SRE propone domande molto pratiche per evitare pager noise.

Una rule dovrebbe rappresentare una condizione urgente e azionabile, idealmente collegata a un impatto utente reale o imminente.

Fonte:

- [Google SRE — Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)

Questo non significa che possiamo allertare soltanto dopo che il cliente ha già subito il problema.

Una saturation condition può anticipare un incidente.

Ma deve avere una relazione sufficientemente forte con il rischio e una risposta concreta.

## Alert sul sintomo prima della causa

Esempio:

```text
App Service CPU > 80%
```

può essere interessante.

Ma non sempre significa che il prodotto stia fallendo.

Al contrario:

```text
core operator journey error-budget burn elevato
```

ci dice che l'outcome è in pericolo.

Per questo preferiamo:

```text
symptom-based alert
+ diagnostic context
```

invece di:

```text
page per ogni componente che mostra qualcosa di insolito
```

## Multi-signal alert

A volte una combinazione riduce il rumore.

Esempio concettuale:

```text
outbox oldest age sopra target
AND
publisher throughput < arrival rate
```

è più significativo di:

```text
outbox count > 100
```

perché 100 messaggi possono essere completamente normali se vengono drenati rapidamente.

Ancora meglio, se il business target è cinque minuti:

```text
Payment Escalation publication SLI burn
```

rimane il segnale più vicino all'outcome.

## Static threshold vs dynamic behavior

Non esiste una regola universale.

Una soglia statica è ottima quando deriva da un limite reale:

```text
storage free < recovery headroom
certificate expiration < safety window
DLQ message exists per deterministic contract failure
```

Una soglia dinamica può essere utile per anomaly detection su pattern variabili.

Ma “AI anomaly detection” non rende automaticamente l'alert più utile.

Se l'operatore non capisce perché è stato paged o quale azione intraprendere, abbiamo spostato la complessità dal sistema alla persona.

## Alert fatigue

Troppi alert producono un effetto prevedibile:

- vengono ignorati;
- si creano filtri informali;
- si alza la soglia senza analisi;
- l'on-call perde fiducia;
- incidenti reali si nascondono nel rumore.

Il costo non è solo psicologico.

È reliability debt.

Un alert ignorato abitualmente è un controllo che abbiamo smesso di possedere.

## Il caso Bigtable raccontato da Google SRE

Il libro SRE di Google discute esplicitamente casi di over-alerting e il problema del pager burnout.

Non useremo il caso per copiare una configurazione.

Lo usiamo come evidenza di un principio più generale:

> un sistema di monitoring può diventare esso stesso una fonte di failure operativo quando interrompe troppo spesso le persone con signal poco azionabili.

Fonte:

- [Google SRE — Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)

## Ogni alert ha un owner

Per Order Operations:

### Workload team

Owner di alert come:

```text
core journey SLO burn
API failure
outbox publication lag
application authorization anomalies
```

### Platform Engineering

Owner primario di:

```text
landing-zone network failure
shared private DNS failure
platform policy/service degradation
```

### Payments & Risk

Owner primario del consumer downstream e della propria business processing latency.

### Joint signal

Alcuni alert richiedono ownership condivisa.

Per esempio:

```text
Payment Escalation Requested in Order Operations
ma non observed downstream oltre threshold
```

La regola deve chiarire chi riceve il primo alert e come avviene l'escalation organizzativa.

Altrimenti la telemetry descrive un problema che nessuno possiede.

## Runbook linkage

Un page alert dovrebbe contenere o linkare almeno:

```text
what is failing
current impact
first diagnostic queries
recent deployments
relevant dashboard/trace search
known degraded mode
safe mitigation
escalation owner
stop condition
```

Non serve un runbook enciclopedico.

Serve ridurre il tempo fra:

```text
alert received
```

e:

```text
first informed action
```

## Alert e automation

Alcune risposte possono essere automatizzate.

Ma il Capitolo 14 ci ha già insegnato:

> self-healing senza failure model può diventare self-harm.

Quindi un'automazione di remediation deve avere:

- condizione affidabile;
- scope limitato;
- idempotenza;
- blast radius;
- evidence;
- rollback/stop condition.

L'alerting non deve diventare un pretesto per lanciare automazioni incontrollate.

## Security alert vs application alert

Non ogni authorization denial è un incidente.

Un operatore che tenta una capability non consentita può generare un normale `403`.

Un pattern anomalo di cross-tenant denial, token failure o privileged configuration change può invece richiedere investigation.

La differenza è semantica e contestuale.

Per questo Security Control Matrix e Observability Contract devono collegarsi.

## Alert quality review

Per ogni alert chiediamo periodicamente:

1. ha rilevato incidenti reali?
2. produce falsi positivi?
3. viene ignorato?
4. l'azione è chiara?
5. il threshold è ancora coerente col workload?
6. l'owner è ancora corretto?
7. il runbook funziona?
8. esiste un signal migliore più vicino all'outcome?
9. può essere rimosso?

Google SRE suggerisce esplicitamente di mantenere il monitoring il più semplice possibile e considerare candidati alla rimozione signal che non vengono realmente usati.

Fonte:

- [Google SRE — Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)

## Compromesso ESI

Operations potrebbe volere alert molto sensibili per non perdere nulla.

L'on-call vuole signal ad alta precisione.

Product vuole ridurre incident impact.

Platform vuole evitare duplicate alert su ogni workload.

La scelta è:

```text
SLO/user-impact first paging
+ saturation/recovery alerts con action chiara
+ diagnostic metrics senza page automatico
+ owner esplicito
+ runbook linkage
+ periodic alert review
```

## Regola

> **Ogni alert chiede tempo umano. Se non sappiamo quale decisione quella persona deve prendere, l'alert non è ancora progettato.**