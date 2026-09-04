## Failure testing, game day e postmortem

Una architecture diagram dimostra intenzione. Un runbook descrive una procedura. Una standby dimostra che una risorsa è stata provisionata. Nessuna di queste cose, da sola, dimostra che il sistema recuperi davvero entro il contratto dichiarato.

Per questo la reliability ha bisogno di **failure evidence**.

Il normale testing chiede se il comportamento è corretto quando le dipendenze necessarie sono disponibili. Il failure testing aggiunge una domanda diversa: che cosa fa il sistema quando una di quelle condizioni rallenta, scompare, restituisce duplicati, cambia stato o torna disponibile dopo una interruzione?

Il punto non è “rompere cose”. È verificare un’ipotesi architetturale.

## Dal failure model all’esperimento

Un buon esperimento parte da una frase verificabile.

Per esempio:

> Se Payments & Risk resta indisponibile per trenta minuti, Order Operations continua ad accettare Payment Escalation localmente, rende visibile il ritardo e non perde né duplica il business intent quando il consumer recupera.

Questa frase contiene già:

```text
failure
expected product state
degraded mode
recovery property
evidence da osservare
```

Da qui possiamo costruire il test senza bisogno di una piattaforma chaos sofisticata.

Possiamo fermare un consumer, bloccare una dependency, iniettare latency, ridurre un connection limit, revocare una permission, fermare il publisher, restituire `503` o provare un restore su una copia del database.

Il valore nasce dalla domanda, non dal tool.

Microsoft Reliability Maturity Model raccomanda di partire da esercizi controllati, synthetic transaction e failure simulation, spesso in non-production, prima di aumentare progressivamente il livello di chaos engineering.

Fonte:

- [Microsoft Learn — Reliability Maturity Model](https://learn.microsoft.com/azure/well-architected/reliability/maturity-model)

## Game day: verificare anche persone e permission

Un **game day** è un esercizio pianificato in cui tecnologia, runbook, ownership e comunicazione vengono messi sotto una forma controllata di stress.

Questo è importante perché molti failure non sono bloccati da un limite tecnico, ma da assunzioni operative:

```text
pensavamo che quella permission esistesse
pensavamo che Platform possedesse il DNS rollback
pensavamo che il restore point fosse evidente
pensavamo che il consumer deduplicasse
pensavamo che l’alert arrivasse al team giusto
```

Un game day trasforma questi “pensavamo” in evidence.

Il chaos engineering maturo segue la stessa logica: steady-state hypothesis, fault controllato, osservazione, confronto con l’expected behavior e miglioramento. Il blast radius deve essere limitato e il team deve possedere stop condition e recovery path prima di iniziare.

Questa struttura assomiglia molto al modello di autonomia che abbiamo applicato agli agenti AI: **più alto è il possibile blast radius, più forti devono essere guardrail e stop condition**.

## I primi reliability drill di ESI

### RD-01 — Payments consumer unavailable

Scenario:

```text
Payments & Risk consumer unavailable per 30 min
```

Expected:

```text
CF-01 Investigation = Healthy
CF-02 Escalation acceptance = Healthy
CF-03 Escalation delivery = Degraded
```

L’evidence deve mostrare che le escalation continuano ad avere un outcome locale durable, il backlog cresce in modo osservabile, nessuna escalation viene persa e la recovery non produce duplicate business effect. Se il business delay threshold entra a rischio, il sistema deve renderlo visibile.

### RD-02 — App instance loss

Scenario:

```text
una App Service instance viene persa
```

Con production capacity almeno due e zone redundancy, ci aspettiamo che il critical journey resti dentro il proprio envelope, che il publisher riprenda eventuale lavoro pending e che la capacity residua non entri in overload.

Questo drill non verifica soltanto che “l’altra istanza esista”. Verifica **headroom reale**.

### RD-03 — PostgreSQL failover

Scenario:

```text
primary failure / planned failover
```

Expected:

- transient impact bounded;
- reconnect controllato;
- nessun retry storm;
- committed state preservato;
- core journey recuperato dentro l’RTO intra-region.

La differenza fra un managed failover configurato e una reliability capability verificata è proprio questo test.

### RD-04 — Logical data recovery

Scenario:

```text
logical corruption / destructive data mistake
```

Qui non vogliamo un failover. Vogliamo:

```text
PITR to recovery target
→ validation
→ measured restore duration
→ cutover/reconciliation procedure
```

Questo drill dimostra che il team conosce la differenza fra HA e recovery da logical error.

### RD-05 — Private DNS failure

Scenario:

```text
private DNS configuration rende irraggiungibile una dependency
```

Expected:

- synthetic critical journey rileva il failure anche se la resource health resta verde;
- il team identifica il network/DNS path;
- esiste un rollback o last-known-good path della configurazione secondo la capability Platform;
- nessuno “risolve” l’incidente aprendo arbitrariamente il data plane pubblico e rompendo il security boundary.

Questo è un test importante perché verifica insieme reliability e Security by Design.

## Stop condition: sapere quando l’esperimento sta insegnando troppo

Ogni failure test deve sapere quando fermarsi.

Stop condition possibili:

```text
unexpected tenant-isolation risk
unexpected data corruption
blast radius oltre lo scope concordato
recovery mechanism non disponibile
critical telemetry persa
operator/control owner non riesce a riprendere il sistema
```

Lo scopo non è portare il sistema al collasso. È produrre evidence sul boundary che stiamo studiando.

> **L’automazione può iniettare il fault. La governance decide quanto il fault può espandersi prima di fermarsi.**

## Postmortem: il trigger non è ancora la causa utile

Dopo un incidente è facile fermarsi alla frase:

```text
una persona ha sbagliato configurazione
```

Questa frase può essere vera e quasi inutile.

La domanda architetturale è:

> **Perché quell’errore aveva il diritto di produrre quel blast radius?**

Un postmortem utile ricostruisce trigger, contributing factor, propagation path, detection gap, mitigation, recovery e soprattutto action item che riducono la probabilità o l’ampiezza di una nuova propagazione.

Cloudflare ha documentato nel giugno 2022 un outage che coinvolse più data center dopo una network configuration change introdotta durante un progetto destinato ad aumentare la resilienza. Parte della rete continuò a operare, mentre altre aree subirono outage fino al ripristino delle configurazioni.

Fonte primaria:

- [Cloudflare — Outage on June 21, 2022](https://blog.cloudflare.com/cloudflare-outage-on-june-21-2022/)

La lezione è particolarmente utile: un cambiamento progettato per aumentare reliability può diventare esso stesso un failure source. Change safety fa quindi parte della reliability architecture.

Cloudflare ha documentato anche un outage del control plane e analytics nel 2023 causato da un grave failure del provider di un data center; alcune capability continuarono a funzionare mentre altre no, anche a causa di dipendenze non ovvie.

Fonte primaria:

- [Cloudflare — Control Plane and Analytics Outage Postmortem](https://blog.cloudflare.com/post-mortem-on-cloudflare-control-plane-and-analytics-outage/)

Il valore generale è evidente:

```text
ridondanza dichiarata
+ hidden dependency
→ resilienza inferiore a quella immaginata
```

Per questo i game day devono attraversare il dependency graph reale e non soltanto i componenti che compaiono nel diagramma principale.

## Action item verificabili, non buone intenzioni

“Stare più attenti” non è un reliability control.

Un action item migliore può essere:

```text
pause migration when connection pressure supera una soglia
```

oppure:

```text
add synthetic Payment Escalation journey dal boundary operatore
```

oppure:

```text
execute PostgreSQL restore drill con cadenza definita
```

Deve esistere un modo per sapere se l’azione è stata implementata e se riduce davvero il failure mode.

Nel maggio 2026 GitHub, descrivendo incidenti e investimenti su availability e capacity, ha reso esplicita l’importanza di ridurre shared failure point e di dare priorità alla stabilità prima di aggiungere ulteriore carico funzionale quando la piattaforma è sotto pressione.

Fonte:

- [GitHub Availability Report — May 2026](https://github.blog/news-insights/company-news/github-availability-report-may-2026/)

Non trasformiamo una frase di un’altra azienda in una legge. Usiamo il caso per ricordare che availability, capacity e feature velocity competono realmente per lo stesso engineering budget.

## Cosa cambia con l’AI

L’AI può correlare timeline, riassumere log, trovare change correlati, confrontare incidenti precedenti, costruire failure tree e preparare un draft di postmortem.

Può anche produrre una causalità troppo pulita. Gli incidenti reali sono spesso reti di condizioni concorrenti, e una sintesi convincente non equivale a causal proof.

Il reviewer deve quindi cercare uncertainty, omissioni, hidden dependency, timeline incongruenti e action item che curano il sintomo invece del propagation path.

Per ogni drill o incidente Order Operations dovrà accumulare un piccolo **Reliability Evidence Bundle**:

```text
scenario
expected behavior
actual result
metrics/traces
recovery duration
RPO observed
manual steps
unexpected behavior
action items
```

Questa evidence tornerà più avanti nella Production Readiness Review.

> **La resilienza che non abbiamo mai provato è ancora un’ipotesi.**