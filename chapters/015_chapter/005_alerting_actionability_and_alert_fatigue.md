## Alerting: interrompere una persona è una decisione architetturale

Una metrica può essere interessante senza richiedere intervento. Una dashboard può diventare rossa e continuare a essere soltanto contesto.

Un alert fa qualcosa di più costoso:

> **chiede a una persona di interrompere ciò che sta facendo perché il sistema richiede una decisione adesso.**

Questo cambia completamente il criterio di qualità.

Un alert non è completo perché possiede una threshold. Deve avere almeno condition, impatto, urgenza, owner, azione possibile e un modo per capire quando la condizione è rientrata.

Se non sappiamo che cosa la persona possa fare dopo il page, abbiamo probabilmente creato rumore.

## Dashboard, ticket e page hanno costi diversi

Per ESI distinguiamo tre livelli operativi.

Una **dashboard/investigation view** serve a comprendere il sistema. CPU, trace sample, retry classification e query latency possono essere informazioni preziose senza dover interrompere nessuno.

Un **ticket/work item** rappresenta qualcosa che richiede azione ma non immediatamente: storage trend, telemetry cost, dependency obsoleta, capacity headroom che si sta riducendo.

Un **page** è riservato a condizioni urgenti e azionabili: fast burn del core journey, severe burn della Payment Escalation publication, incidenti security significativi o availability failure oltre il tolerance envelope.

La distinzione evita di trasformare ogni deviazione in emergenza.

## Partire dal sintomo, poi allegare la diagnosi

Google SRE insiste sul fatto che un pager dovrebbe rappresentare una condizione urgente, azionabile e il più possibile vicina a un impatto user-visible reale o imminente.

Fonte:

- [Google SRE — Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)

Un alert come:

```text
App Service CPU > 80%
```

può anticipare saturation, ma non ci dice automaticamente che il prodotto stia fallendo.

Un fast burn del core operator journey ci dice invece che il reliability contract è in pericolo. CPU, connection pressure e dependency latency diventano allora diagnostic context.

Questo produce una gerarchia utile:

```text
symptom / SLO impact
→ page quando urgente

diagnostic signal
→ spiega perché
```

Invece di page separati per ogni componente, preferiamo interrompere le persone quando l’outcome richiede attenzione e fornire subito il contesto per cercare la causa.

## Il business threshold è spesso migliore della soglia inventata

Consideriamo l’outbox.

```text
outbox pending > 100
```

può essere completamente normale se il publisher drena migliaia di messaggi al secondo.

Molto più utile è osservare la relazione fra pending, oldest age, arrival rate e drain rate. E, ancora meglio, il signal più vicino al contratto:

```text
Payment Escalation publication SLI burn
```

Quando esiste un limite reale — certificate expiration, storage headroom, DLQ item che rappresenta un deterministic contract failure — una soglia statica può essere perfetta.

Quando il comportamento è variabile, una anomaly detection può aiutare. Ma “AI-powered anomaly detection” non rende un alert automaticamente azionabile. Se l’on-call non capisce perché viene interrotto né quale azione intraprendere, abbiamo spostato la complessità dal sistema alla persona.

## Alert fatigue è reliability debt

Un sistema che pagina troppo spesso educa gli operatori a ignorarlo.

Si creano filtri informali, threshold alzati senza analisi, mute temporanei che diventano permanenti. Gli incidenti reali finiscono nello stesso rumore delle anomalie innocue.

Google SRE discute esplicitamente il problema del pager burnout e dell’over-alerting nel monitoraggio di sistemi di produzione.

Fonte:

- [Google SRE — Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)

Il costo non è soltanto umano. È architetturale: un alert ignorato abitualmente è un controllo che abbiamo smesso di possedere.

## Ownership: la telemetry non può fermarsi al confine organizzativo

Per Order Operations il workload team possiede il core journey SLO burn, application failure, local escalation acceptance e outbox publication lag.

Platform Engineering possiede primariamente failure della landing-zone network, private DNS condiviso e platform capability comuni.

Payments & Risk possiede consumer e business processing downstream.

Ma alcuni signal attraversano i confini. Se Order Operations ha `PaymentEscalation Requested` e Payments non mostra evidence downstream oltre il threshold, serve un escalation path organizzativo esplicito.

Un alert con owner “shared” ma senza first responder è un problema rimandato.

La regola deve dire chi riceve il primo signal, quale evidence raccoglie e quando coinvolge l’altro dominio.

## Il runbook riduce il tempo verso la prima azione informata

Un page dovrebbe portare con sé abbastanza contesto da evitare che i primi minuti siano spesi a ritrovare il sistema:

```text
what is failing
current business/user impact
affected SLI
recent deployment/config change
first diagnostic views/queries
known degraded mode
safe mitigation
owner/escalation path
stop condition
```

Non serve un’enciclopedia. Serve ridurre il tempo fra:

```text
alert received
```

e:

```text
first informed action
```

## Automation dopo l’alert: stessa disciplina del self-healing

Alcune risposte possono essere automatizzate. Ma il Capitolo 14 ci ha già dato il warning:

> self-healing senza failure model può diventare self-harm.

Una remediation automatica deve quindi avere condition sufficientemente affidabile, scope limitato, idempotenza, blast-radius control, evidence e stop/rollback path.

L’alerting non deve diventare il trigger di script che reagiscono aggressivamente a un signal ambiguo.

## Security signal: un denial normale non è un incidente

Un singolo `403` può essere il risultato corretto di application authorization. Un pattern anomalo di cross-tenant denial, privileged role change o token failure può invece essere security evidence significativa.

La differenza nasce dal Threat Model e dalla Security Control Matrix, non dal codice HTTP in sé.

Per questo l’Observability Contract deve collegare alert e signal anche ai control owner dei capitoli precedenti.

## Ogni alert deve poter essere rimosso

Periodicamente dobbiamo chiedere:

```text
ha rilevato incidenti reali?
produce falsi positivi?
viene ignorato?
l’azione è chiara?
il threshold è ancora coerente col workload?
l’owner è ancora quello corretto?
il runbook funziona?
esiste un signal migliore più vicino all’outcome?
possiamo eliminarlo?
```

Google SRE raccomanda di mantenere il monitoring semplice e di considerare candidati alla rimozione i signal che non aiutano realmente le decisioni operative.

Fonte:

- [Google SRE — Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)

## Il compromesso ESI

Operations vuole sensibilità. L’on-call vuole precisione. Product vuole ridurre incident impact. Platform vuole evitare che ogni workload duplichi page sulla stessa dependency.

La scelta corrente è:

```text
SLO/user-impact first paging
+ saturation/recovery alerts solo quando azionabili
+ diagnostic metrics senza page automatico
+ owner esplicito
+ runbook linkage
+ alert quality review periodica
```

> **Ogni alert spende attenzione umana. Se non sappiamo quale decisione quella persona deve prendere, l’alert non è ancora progettato.**