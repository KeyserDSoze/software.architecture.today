# Failure testing, game day e postmortem

Una architecture diagram può dimostrare l'intenzione.

Non dimostra che il sistema recupera.

Un runbook può descrivere un restore.

Non dimostra che il restore funziona.

Una standby può esistere.

Non dimostra che il failover mantiene il critical journey entro l'RTO.

Per questo la reliability ha bisogno di **failure evidence**.

## Testare il failure, non soltanto il codice

Nel normale testing chiediamo:

```text
quando tutto ciò che serve è disponibile,
il comportamento è corretto?
```

Il failure testing aggiunge:

```text
quando qualcosa di necessario rallenta, scompare,
riparte, restituisce duplicati o cambia stato,
che cosa fa il sistema?
```

Esempi:

- PostgreSQL temporaneamente unavailable;
- query lente;
- connection pool saturata;
- Service Bus indisponibile;
- outbox backlog crescente;
- Payments consumer fermo;
- DNS resolution failure;
- secret store unavailable;
- instance kill;
- zone-like capacity reduction;
- bad deployment;
- malformed configuration;
- restore da point-in-time backup.

## Game day

Un **game day** è un esercizio pianificato in cui il team simula failure o incident scenario per verificare tecnologia e processo.

Non serve partire dalla production.

Microsoft raccomanda di iniziare con esercizi in non-production, synthetic transaction e failure simulation prima di pratiche di chaos engineering più mature.

Fonte:

- [Microsoft Learn — Reliability Maturity Model](https://learn.microsoft.com/azure/well-architected/reliability/maturity-model)

## Chaos engineering

Chaos engineering non significa:

```text
rompiamo cose a caso
```

È sperimentazione controllata su ipotesi di resilienza.

La struttura è più vicina a:

```text
steady state hypothesis
→ controlled fault
→ observe
→ compare with expected behavior
→ improve
```

Prima di portare esperimenti aggressivi in produzione servono:

- blast-radius control;
- stop conditions;
- observability;
- rollback/recovery;
- owner;
- business awareness.

È molto vicino al modello di autonomia degli agenti discusso nei primi capitoli:

> **più alto è il blast radius, più forti devono essere guardrail e stop condition.**

## Failure injection senza tool speciali

Non serve una piattaforma chaos per imparare.

Possiamo cominciare con esercizi semplici:

```text
stop consumer
block dependency
inject latency
expire token
return 503
reduce connection limit
stop publisher
restore database copy
revoke permission
```

L'importante è avere una domanda.

Esempio:

> Se Payments consumer resta offline 30 minuti, Order Operations continua ad accettare escalation senza violare il core operator SLO e rende il backlog visibile?

Il test deve produrre evidence.

## Reliability drill ESI — 1

### Scenario

```text
Payments & Risk consumer unavailable per 30 min
```

### Expected

```text
Investigation flow = Healthy
Escalation acceptance = Healthy
Delivery flow = Degraded
```

### Evidence candidate

- POST escalation continua a produrre `202` dopo local commit;
- outbox viene pubblicata al broker quando possibile;
- queue age cresce;
- nessuna escalation viene persa;
- nessun duplicate business effect al recovery;
- health model passa a `Degraded` per delivery;
- alert appropriato viene generato quando il business delay threshold è a rischio.

## Reliability drill ESI — 2

### Scenario

```text
App Service instance killed
```

### Expected

Con production capacity >= 2 e zone redundancy:

- il critical journey resta disponibile entro SLO;
- il publisher riprende lavoro pending;
- nessuna outbox entry viene persa;
- eventuali request in-flight seguono semantica nota;
- capacity residua non entra in overload.

Questo test verifica sia redundancy sia headroom.

## Reliability drill ESI — 3

### Scenario

```text
PostgreSQL primary failure / planned failover
```

### Expected

- failover gestito dalla HA configuration;
- transient error bounded;
- client reconnect controllato;
- nessun retry storm;
- committed state preservato;
- RTO intra-region rispettato.

## Reliability drill ESI — 4

### Scenario

```text
logical data error
```

### Expected

Non usiamo il failover.

Eseguiamo:

```text
PITR to recovery server
→ validate
→ measure restore duration
→ establish recovery/cutover procedure
```

Questo verifica che il team conosca la differenza fra HA e backup recovery.

## Reliability drill ESI — 5

### Scenario

```text
private DNS misconfiguration
```

### Expected

- synthetic critical journey fallisce;
- health model rileva failure anche se resource health è verde;
- incident response identifica DNS/network path;
- last-known-good / rollback della config è disponibile secondo capability Platform;
- nessun workaround disabilita arbitrariamente security boundary.

## Stop condition

Un failure test deve sapere quando fermarsi.

Esempi:

```text
unexpected tenant isolation risk
unexpected data corruption
blast radius exceeds environment
recovery mechanism not available
critical telemetry lost
operator unable to regain control
```

La regola è la stessa degli agenti:

> **L'automazione può eseguire l'esperimento. La governance decide quanto può peggiorare prima di fermarsi.**

## Postmortem

Quando avviene un incidente, il postmortem deve produrre conoscenza riusabile.

Non dovrebbe ridursi a:

```text
X ha sbagliato configurazione
```

La domanda più utile è:

```text
perché un singolo errore aveva questo blast radius?
```

Un buon postmortem cerca:

- trigger;
- contributing factor;
- detection gap;
- propagation path;
- mitigation;
- recovery;
- decisione che mancava;
- control che non esisteva o non funzionava;
- action item verificabili.

## Caso reale — Cloudflare, giugno 2022

Cloudflare documentò nel giugno 2022 un outage che coinvolse 19 data center a seguito di una network configuration change realizzata durante un progetto che aveva proprio l'obiettivo di aumentare la resilienza.

Alcune aree continuarono a operare, altre subirono outage fino al ripristino delle configurazioni.

Fonte primaria:

- [Cloudflare — Outage on June 21, 2022](https://blog.cloudflare.com/cloudflare-outage-on-june-21-2022/)

È un esempio utile perché ricorda che:

> **Un cambiamento fatto per aumentare resilienza può essere esso stesso una fonte di failure.**

Reliability engineering deve quindi governare anche change safety.

## Caso reale — Cloudflare control plane, 2023

In un altro postmortem Cloudflare descrisse un outage del control plane e analytics causato da un catastrophic data-center provider failure. Parte della rete e dei security service continuò a funzionare, mentre alcuni control-plane service no, anche a causa di dipendenze non ovvie.

Fonte primaria:

- [Cloudflare — Control Plane and Analytics Outage Postmortem](https://blog.cloudflare.com/post-mortem-on-cloudflare-control-plane-and-analytics-outage/)

La lezione architetturale è forte:

```text
ridondanza dichiarata
+ hidden dependency
=
resilienza inferiore a quella immaginata
```

Per questo i game day devono attraversare i dependency graph reali.

## Caso reale — GitHub 2026

GitHub nei propri availability report del 2026 descrive una strategia esplicita di riduzione dei shared failure point e maggiore isolation dei domini, mentre affronta crescita importante di traffico e workload legati anche a sviluppo agentico.

Nel report di maggio GitHub riassume il principio con:

```text
availability
then capacity
then features
```

Fonte:

- [GitHub Availability Report — May 2026](https://github.blog/news-insights/company-news/github-availability-report-may-2026/)

Non adotteremo questa frase come legge universale.

Ma è un caso contemporaneo utile per mostrare che reliability, capacity e feature velocity competono realmente per le stesse risorse di engineering.

## Postmortem ≠ colpevole

Se il sistema consente:

```text
una migration routine
→ saturazione globale
```

la domanda non può fermarsi a chi ha avviato la migration.

Serve capire perché mancavano, per esempio:

- throttling;
- circuit breaker;
- capacity headroom;
- pre-flight check;
- safe window;
- detection anticipata.

La reliability migliora quando il sistema impara, non quando trova qualcuno da punire.

## Action item

Un action item debole:

```text
stare più attenti
```

Un action item migliore:

```text
pause automatic migration when connection utilization > threshold
```

oppure:

```text
add synthetic escalation journey from operator boundary
```

oppure:

```text
execute PostgreSQL restore drill quarterly
```

Deve essere verificabile.

## AI nel postmortem

L'AI può aiutare molto:

- correlare timeline;
- riassumere log;
- trovare change correlati;
- confrontare incidenti precedenti;
- proporre failure tree;
- verificare se action item simili esistono già;
- generare draft del postmortem.

Ma può anche produrre una root cause troppo pulita.

Gli incidenti reali sono spesso sistemi di cause concorrenti.

Quindi:

```text
AI summary
≠
causal proof
```

Il reviewer deve cercare:

- omissioni;
- uncertainty;
- hidden dependency;
- timeline incongruenti;
- action item che curano il sintomo invece del propagation path.

## Reliability evidence bundle

Per ogni failure importante potremo accumulare:

```text
scenario
expected behavior
run result
metrics/traces
recovery duration
RPO observed
manual steps
unexpected behavior
action items
```

Questo diventerà una parte importante della Production Readiness più avanti.

## Corollario

> **La resilienza che non abbiamo mai provato è ancora un'ipotesi.**