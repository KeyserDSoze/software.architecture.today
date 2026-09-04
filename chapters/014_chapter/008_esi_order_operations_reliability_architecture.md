## ESI — Reliability Architecture di Order Operations

A questo punto possiamo trasformare il capitolo in una decisione completa sul capstone. Non partiamo dalle feature Azure: partiamo dai tre critical flow che il prodotto deve proteggere.

## CF-01 — Investigation

```text
Operations Operator
→ Entra authentication
→ Order Operations
→ local OperationalCase state
→ live authoritative dependencies
→ operational view
```

Il business intent è permettere all’operatore di capire rapidamente che cosa richiede attenzione e quale dominio possiede il dato autorevole.

Il flow può degradare quando una dependency live non è disponibile, ma soltanto a condizioni precise: il prodotto non deve presentare dati stale come current truth, deve distinguere ciò che è locale da ciò che non è verificabile e deve bloccare azioni che richiedono facts autorevoli mancanti.

## CF-02 — Payment Escalation acceptance

```text
Operator
→ POST escalation
→ authorization
→ PostgreSQL transaction
   ├── PaymentEscalation
   └── OutboxMessage
→ 202 Accepted
```

Qui il quality floor è la determinazione dell’outcome locale:

```text
committed escalation
↔
committed publication intent
```

Nessun partial commit, nessuna “forse accettata” nel normale failure applicativo.

## CF-03 — Payment Escalation delivery

```text
Outbox
→ Publisher
→ Service Bus
→ Payments & Risk
```

La delivery può essere asincrona, ma non invisibilmente infinita. Stable identity, bounded retry, downstream idempotency, DLQ ownership, business-delay visibility e reconciliation restano parte del contratto.

Questi tre flow rendono leggibile la reliability perché separano ciò che deve restare disponibile da ciò che può degradare senza perdere significato.

## Target iniziali ESI

I numeri seguenti sono **requisiti simulati del capstone**, non benchmark o raccomandazioni universali.

Per il core operator journey:

```text
SLO = 99.9% good events
window = rolling 28 days
```

Per la publication della Payment Escalation:

```text
99% delle escalation accepted
→ published to broker within 5 minutes
```

Il processing business downstream di Payments & Risk non viene inglobato arbitrariamente nello SLO di Order Operations. Ogni dominio mantiene i target delle capability che possiede.

Per i failure intra-region:

```text
RTO core journey <= 15 min
RPO = 0 per committed local OperationalCase / PaymentEscalation state
```

Per un region-wide disaster:

```text
RTO <= 8 h
RPO <= 1 h
```

L’asimmetria è intenzionale: ESI vuole assorbire rapidamente i failure più ordinari di instance/zone, ma non finanzia ancora una topologia active-active regionale per un prodotto interno con un recovery target di ore.

## Health model

Order Operations è `Healthy` quando il core investigation flow è dentro SLO, l’escalation acceptance rimane deterministicamente durable e backlog/age della delivery restano nel normale envelope operativo.

È `Degraded` quando una parte della promessa si riduce ma il prodotto sa ancora operare in modo sicuro. Esempi sono una authoritative read dependency unavailable con case locale ancora consultabile, oppure Service Bus/Payments consumer degradati mentre l’acceptance locale continua.

È `Unhealthy` quando il core journey non è utilizzabile, PostgreSQL resta indisponibile oltre il recovery window o una escalation valida non può più avere un outcome durable deterministico.

Il punto è che questi stati derivano dai critical flow, non da una media dei resource health signal.

## Topologia production decisa nel Capitolo 14

### App Service

```text
Premium v3
capacity >= 2
zoneRedundant = true
```

La scelta compra instance redundancy e resilience zonale. Non compra regional resilience né protegge da bad deployment.

### PostgreSQL

```text
Azure Database for PostgreSQL Flexible Server
zone-redundant HA
backup / PITR
private access
```

La HA protegge node/zone failure; PITR resta necessario per logical corruption e destructive data error.

### Service Bus

```text
Premium
private endpoint
regional zone resilience
```

Non introduciamo ancora cross-region replication perché i target regionali correnti non richiedono immediate continuity.

### Region

```text
single region
```

La decisione verrà riaperta se contractual commitment, criticality, geografia, RTO/RPO o recovery evidence renderanno insufficiente questa scelta.

## La reliability matrix di ESI

| Failure | Stato prodotto atteso | Comportamento automatico | Recovery/azione umana |
|---|---|---|---|
| App instance failure | Healthy o breve Degraded | routing su istanza superstite | verificare SLO burn/headroom |
| App zone failure | Healthy/Degraded entro target | zone-redundant capacity | verificare capacity residua |
| PostgreSQL primary failure | breve Degraded | managed failover | validare reconnect, RTO e stato |
| PostgreSQL logical corruption | Unhealthy | nessun failover utile | PITR/restore + validation + cutover |
| Service Bus transient outage | delivery Degraded | outbox retry bounded | reconciliation se prolungato |
| Payments consumer down | delivery Degraded | broker/backlog buffering | recovery Payments / DLQ handling |
| Entra incident | user flow Degraded/Unhealthy | dipende da token/session state | identity incident coordination; no bypass |
| Private DNS failure | Degraded/Unhealthy | nessuna garanzia automatica | config rollback / Platform response |
| Bad application deploy | potenzialmente Unhealthy | dipende dalla strategy | rollback known-good artifact |
| Region outage | Unhealthy | nessuna active secondary region | regional recovery runbook |

La tabella non sostituisce la Failure Mode Map. Ne sintetizza la parte più importante per la decisione del capitolo: quale behavior ci aspettiamo quando il failure attraversa il prodotto.

## Ownership di recovery

Il workload team possiede application rollback, outbox recovery, reconciliation, critical-flow validation, SLO evidence, restore validation e aggiornamento dei runbook.

Platform Engineering possiede le capability condivise della landing zone: network/DNS foundation, policy, privileged cloud recovery path e monitoring platform.

Payments & Risk possiede consumer recovery, downstream idempotency e stato del payment workflow. Security governa privileged identity, break-glass e incident boundary.

Finance non esegue il recovery, ma deve poter vedere il costo che le reliability decision aggiungono al workload e il target business che giustifica quella spesa.

Questa ownership è parte dell’architettura. Durante un incidente, “pensavo lo facesse Platform” è un failure mode organizzativo.

## Reliability Contract e Failure Mode Map diventano artefatti vivi

Il capitolo introduce stabilmente:

```text
docs/reliability-contract.md
```

che raccoglie critical flow, SLI/SLO, health state, degraded mode, RTO/RPO, recovery source, ownership, drill ed evidence level.

La `Failure Mode Map`, nata nel Capitolo 11 sul flusso asincrono, viene estesa ora a instance/zone failure, PostgreSQL failover, logical corruption, identity incident, private DNS, bad deployment e region failure.

Questo mostra una proprietà importante del capstone:

> **Il failure model cresce insieme alla topologia e alle capability del prodotto.**

## Designed, Codified, Verified, Monitored

Il Capitolo 14 non deve trasformare automaticamente ogni decisione in una claim di affidabilità verificata.

Nel repository distinguiamo:

```text
Designed
→ target/control documentato

Codified
→ rappresentato in code/IaC/config

Verified
→ test o failure drill ha prodotto evidence

Monitored
→ drift/SLO/failure è osservabile nel runtime
```

La capacity minima e la zone redundancy di App Service vengono codificate nell’IaC. PostgreSQL HA rimane una decisione progettata finché il modulo relativo non viene completato. Restore drill, synthetic journey, burn-rate alert e regional recovery restano evidence da produrre.

Questa distinzione è essenziale per non confondere `abbiamo scritto la configurazione` con `sappiamo che il sistema regge il failure`.

## Costo e trade-off

ESI paga più compute e più database capacity per ridurre il failure domain intra-region. In cambio non compra ancora multi-region active-active, global routing o immediate broker continuity cross-region.

La scelta può essere riassunta così:

**Esigenza:** mantenere il core operator journey utilizzabile durante failure comuni e rendere recuperabili failure più ampi.

**Tensione:** availability e recovery più forti contro costo, operational complexity e test burden.

**Decisione:** resilience intra-region + recovery evidence prima di multi-region.

**Costo accettato:** region outage con recovery manuale nell’ordine delle ore.

**Quality floor:** committed local state preservato nei failure HA coperti, recovery source nota, security boundary mai bypassato per availability, restore e reconciliation con owner.

**Guardrail:** Reliability Contract, Failure Mode Map, error budget, IaC, restore drill, game day e review trigger.

## Casi reali come controllo di plausibilità

I casi GitHub e Cloudflare del capitolo mostrano categorie ricorrenti: shared failure point, capacity saturation, configuration propagation, hidden dependency e recovery complexity.

ESI non copia le loro architetture. Usa quei casi per controllare che le categorie di failure considerate non siano soltanto invenzioni narrative.

Lo stesso vale per l’AI: possiamo chiedere a un agente quale failure domain stiamo aggiungendo, quale retry amplification è possibile, quale degraded mode manca o quale recovery source stiamo assumendo. Il risultato rimane una hypothesis list da verificare.

> **La reliability migliore non è quella con più ridondanza. È quella che mantiene il contratto giusto contro i failure che abbiamo deciso di governare, e sa mostrare l’evidence che lo dimostra.**