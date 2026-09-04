# Esercizi, autovalutazione e sintesi

La reliability diventa architettura quando smette di essere un desiderio e diventa un contratto verificabile.

Questo capitolo ha costruito quel passaggio.

## Idee chiave

1. **Failure è inevitabile; cascading failure non deve esserlo.**
2. Availability, reliability e resilienza non sono sinonimi.
3. Il prodotto può essere unhealthy anche quando ogni componente infrastrutturale appare verde.
4. SLI e SLO devono partire dai critical user journey.
5. Un SLO è una decisione di business e engineering, non un numero decorativo.
6. L'error budget rende esplicito il trade-off fra reliability e change velocity.
7. `Healthy`, `Degraded` e `Unhealthy` devono avere semantica misurabile.
8. Graceful degradation significa continuare a fornire valore senza fingere che dati o capability mancanti siano affidabili.
9. Retry consuma capacity; retry incontrollato può amplificare il failure.
10. Queue e backlog disaccoppiano nel tempo, ma non creano capacità downstream.
11. Bulkhead, circuit breaker, throttling e load shedding proteggono failure domain diversi.
12. Ridondanza utile significa copie che non condividono il failure che vogliamo tollerare.
13. HA, backup/restore e disaster recovery proteggono classi di failure differenti.
14. RTO e RPO devono essere associati a scenari di failure e business impact.
15. Un backup non è una recovery capability finché il restore non viene provato.
16. Reliability testing deve includere failure injection, game day e recovery drill.
17. Un postmortem deve ridurre il propagation path, non soltanto identificare il trigger.
18. La reliability ha un costo visibile che Product, Platform, Operations e Finance devono poter discutere.
19. L'AI può accelerare reliability engineering ma anche produrre reliability theater.
20. La resilienza non verificata resta un'ipotesi.

## Artefatto operativo — Reliability Contract

Il nuovo artefatto del capitolo è il **Reliability Contract**.

Template minimo:

```markdown
# Reliability Contract

## Critical flows

## SLI

## SLO

## Error budget policy

## Health states

## Degraded modes

## Failure domains

## RTO / RPO

## Recovery sources

## Drill / verification

## Ownership

## Review triggers
```

Non sostituisce:

- NFR;
- Failure Mode Map;
- Cloud Deployment Map;
- Observability Contract;
- runbook.

Li collega.

## Esercizio 1 — Da “affidabile” a SLO

Prendi questo requisito:

> “Il sistema ordini deve essere molto affidabile.”

Trasformalo in almeno due SLI/SLO distinti.

Per ciascuno specifica:

- consumer;
- critical journey;
- good event;
- valid event;
- measurement window;
- target;
- perché quel target ha senso per il business.

Poi chiediti:

> Quale tecnologia avresti scelto diversamente se il target fosse 99%, 99.9% o 99.99%?

## Esercizio 2 — Component green, product red

Disegna un sistema con almeno cinque componenti.

Costruisci uno scenario in cui:

```text
ogni health check infrastrutturale = green
```

ma:

```text
critical user journey = failed
```

Identifica il signal che manca.

## Esercizio 3 — Graceful degradation

Per un'applicazione che usa:

- catalogo;
- prezzi;
- recommendation;
- checkout;
- payment provider;

classifica quali capability possono degradare e quali devono fermarsi.

Per ogni fallback indica:

```text
freshness
provenance
actions allowed
actions blocked
user communication
```

## Esercizio 4 — Retry storm

Scenario:

```text
500 client
× 3 retry immediati
× dependency al 20% della capacità normale
```

Spiega qualitativamente perché il retry può peggiorare il recovery.

Progetta:

- retry budget;
- backoff;
- jitter;
- concurrency limit;
- stop condition.

Non serve calcolare numeri perfetti.

Serve mostrare la dinamica.

## Esercizio 5 — Bulkhead

Prendi un'applicazione con:

```text
interactive API
report generation
background synchronization
```

Mostra come un workload può saturare gli altri.

Proponi un boundary di capacità che protegga il critical path.

Poi spiega quale complessità aggiunge.

## Esercizio 6 — HA ≠ backup

Per ognuno di questi failure scegli il meccanismo principale:

```text
process crash
zone failure
database node failure
logical DELETE accidentale
bad deployment
region loss
credential compromise
```

Puoi scegliere fra:

```text
restart
replica/failover
zone redundancy
rollback
PITR
cross-region recovery
identity revocation
```

Una risposta può usare più meccanismi.

L'importante è spiegare perché.

## Esercizio 7 — RTO/RPO

Definisci RTO/RPO distinti per:

1. checkout pubblico;
2. tool interno di reporting;
3. payroll;
4. telemetry analytics;
5. payment reconciliation.

Non cercare valori “standard”.

Scrivi prima il business impact e soltanto dopo i target.

## Esercizio 8 — Restore drill

Scrivi un restore drill per PostgreSQL.

Deve includere:

- failure scenario;
- restore point;
- permission;
- restore target;
- validation query;
- application validation;
- reconciliation;
- misura dell'RTO reale;
- misura dell'RPO reale;
- cleanup.

## Esercizio 9 — Failure Mode Map di un deployment

La nuova versione applicativa viene rilasciata.

Elenca failure possibili:

- startup;
- schema compatibility;
- config;
- secret;
- identity;
- network;
- latency;
- functional correctness.

Per ciascuno indica:

```text
detection
blast radius
rollback
owner
```

## Esercizio 10 — Postmortem avversariale

Prendi il caso GitHub della migration che ha contribuito alla saturation nel maggio 2026.

Fonte:

- [GitHub Availability Report — May 2026](https://github.blog/news-insights/company-news/github-availability-report-may-2026/)

Senza inventare fatti non presenti nella fonte, separa:

```text
trigger
propagation
customer impact
mitigation
follow-up control
```

Poi identifica quali decisioni architetturali del nostro libro avrebbero potuto aiutare a formulare domande prima dell'incidente.

## Esercizio 11 — Cloudflare e failure domain

Leggi:

- [Cloudflare — Outage on July 17, 2020](https://blog.cloudflare.com/cloudflare-outage-on-july-17-2020/)

Ricostruisci:

```text
failure origin
traffic concentration
blast radius
what remained healthy
mitigation
structural follow-up
```

Non trasformare il caso in una regola universale su BGP.

Estrai invece una regola più generale sulla containment.

## Esercizio 12 — ESI: togliamo la multi-region

Difendi davanti a un architecture review board la scelta ESI:

```text
zone redundancy + HA + restore drills
ma
no active-active multi-region
```

Devi convincere:

- Product;
- Security;
- Platform;
- Operations;
- Finance.

Poi cambia il requisito regionale da:

```text
RTO <= 8 h
```

a:

```text
RTO <= 15 min
```

Spiega quali decisioni devi riaprire.

## Esercizio 13 — Reliability con AI

Chiedi a un agente di analizzare un architecture diagram e generare failure mode.

Poi classifica ogni output:

```text
verified from architecture
inferred
unknown
requires runtime evidence
```

Conta quante assunzioni l'agente ha trasformato implicitamente in fatti.

## Esercizio 14 — Il test della rimozione

Scegli tre meccanismi di reliability presenti nella tua architettura:

```text
replica
cache
queue
circuit breaker
multi-region
```

Per ciascuno chiedi:

> Se lo rimuovo, quale SLO o failure mode peggiora materialmente?

Se non sai rispondere, potrebbe essere reliability theater.

## Esercizio 15 — Reliability Contract

Produci un Reliability Contract per un sistema che conosci.

Non superare inizialmente due pagine.

Se servono trenta pagine per capire che cosa significa “healthy”, probabilmente il modello non è ancora abbastanza chiaro.

## Autovalutazione

Dovresti riuscire a rispondere senza consultare il capitolo:

1. Qual è la differenza fra availability e reliability?
2. Che cosa distingue un SLI da un SLO?
3. Perché un SLO del 100% è spesso una cattiva scelta?
4. Che cosa rappresenta un error budget?
5. Perché CPU e RAM non bastano per definire la health del prodotto?
6. Che cosa significa `Degraded`?
7. Quando una cache può essere un fallback pericoloso?
8. Come nasce un retry storm?
9. Che cosa protegge un Bulkhead?
10. Perché due replica possono fallire insieme?
11. Qual è la differenza fra HA e PITR?
12. Che cosa misurano RTO e RPO?
13. Perché un backup non testato è insufficiente?
14. Che cosa deve produrre un game day?
15. Perché un postmortem non deve fermarsi all'errore umano?
16. Quale failure copre la zone redundancy di App Service?
17. Perché la HA PostgreSQL non protegge necessariamente da corruption logica?
18. Che cosa protegge l'outbox durante una indisponibilità del broker?
19. Perché il DNS può diventare un failure domain?
20. Quando dovremmo riaprire una decisione multi-region?

## Cosa cambia con l'AI

L'AI abbassa drasticamente il costo di produrre meccanismi di resilienza.

Possiamo generare velocemente:

- retry policy;
- health endpoint;
- circuit breaker;
- Terraform/Bicep multi-region;
- dashboard;
- synthetic check;
- chaos script;
- runbook;
- postmortem draft.

Il rischio diventa confondere:

```text
quantità di reliability code
```

con:

```text
reliability del sistema
```

Un sistema con dieci fallback generati può essere meno affidabile di uno con due failure path compresi e testati.

### Verification senza rifare tutto

Per verificare lavoro AI-assisted non dobbiamo necessariamente riscrivere manualmente il meccanismo.

Possiamo chiedere evidence:

```text
quale SLO protegge?
quale failure simula il test?
qual è l'expected degraded behavior?
come viene limitato il blast radius?
qual è il rollback?
quale metrica prova il recovery?
```

Il focus passa dalla produzione dell'artefatto alla dimostrazione del suo effetto.

## Il compromesso ESI del capitolo

**Esigenza:** mantenere Order Operations utilizzabile durante failure comuni e recuperabile durante failure più ampi.

**Tensione:** availability/recovery più forti vs costo, operational complexity e delivery speed.

**Decisione:** zone-redundant App Service con almeno due istanze, PostgreSQL zone-redundant HA, backup/PITR, Service Bus zonal resilience, health model, SLO ed esercizi di recovery; il workload resta single-region.

**Costo accettato:** maggior costo compute/database e regional disaster recovery non immediato.

**Quality floor:** committed local state non viene perso nei failure HA coperti; failure e degradation sono osservabili; restore e recovery hanno owner; tenant/security boundary non vengono disabilitati per mantenere availability.

**Guardrail:** Reliability Contract, Failure Mode Map, error budget, restore drill, game day, IaC, health model e review trigger.

**Evidence:** Google SRE per SLI/SLO/error budget; Microsoft Azure Well-Architected e reliability documentation per health model, graceful degradation, App Service, PostgreSQL e Service Bus; GitHub e Cloudflare per failure/cascading/postmortem reali.

**Trigger:** SLO miss persistenti, business criticality maggiore, RTO/RPO regionali più severi, recovery exercise non soddisfacenti, capacity divergence API/worker, nuovi contractual requirement o costo non più giustificato.

## Ponte al Capitolo 15 — Observability

Ora sappiamo che cosa significa `Healthy`, `Degraded` e `Unhealthy`.

Sappiamo quali SLO vogliamo.

Sappiamo quali failure dobbiamo rilevare.

Ma non abbiamo ancora costruito il linguaggio operativo necessario per osservarli.

Il Capitolo 15 entrerà in:

```text
metrics
logs
traces
correlation
structured events
SLI measurement
burn-rate alerts
synthetic journeys
business telemetry
cardinality
sampling
alert fatigue
Observability Contract
```

Non partiremo da:

> “Installiamo Application Insights.”

Partiremo da:

> **Quale domanda dobbiamo riuscire a rispondere durante un incidente senza aprire il codice sorgente e indovinare?**

## Corollario

> **Non progettare un sistema che non fallisce. Progetta un sistema che sa come fallire senza perdere il proprio significato, e sa dimostrare come torna indietro.**