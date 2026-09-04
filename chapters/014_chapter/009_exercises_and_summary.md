## Sintesi: reliability come contratto verificabile

Il capitolo ha trasformato una parola vaga — “affidabile” — in una sequenza di decisioni verificabili.

Il punto di partenza è il critical journey. Da lì scegliamo SLI e SLO, definiamo quale error budget siamo disposti a consumare, costruiamo un health model, decidiamo come il prodotto può degradare, individuiamo i propagation path, associamo RTO/RPO ai failure domain e infine proviamo recovery e containment con drill che producono evidence.

La relazione può essere riassunta così:

```text
critical journey
→ measurable contract
→ expected failure behavior
→ containment/recovery
→ verification evidence
```

Availability, reliability e resilienza non sono sinonimi. Una risorsa può essere online mentre il prodotto restituisce dati sbagliati o inutilizzabili. Una queue può assorbire un burst ma trasformarlo in backlog. Una replica può tollerare un node failure e replicare perfettamente una corruption logica. Un backup può esistere e non essere ripristinabile dentro l’RTO.

Per questo il numero di meccanismi non è la misura della reliability. Ci interessa sapere **quale failure copre ogni meccanismo, quale parte del contratto protegge e quale evidence dimostra che funziona**.

Per Order Operations la conseguenza è concreta: il workload resta single-region, ma compra resilience intra-region tramite App Service zone-redundant con capacity minima multipla, PostgreSQL zone-redundant HA e Service Bus regionalmente resiliente; mantiene backup/PITR e rende espliciti degraded mode, recovery source, ownership e drill. Active-active multi-region rimane fuori perché gli RTO/RPO simulati correnti non ne giustificano ancora costo e complessità.

## Artefatto operativo — Reliability Contract

Il nuovo artefatto collega ciò che i precedenti documenti tenevano separato:

```markdown
# Reliability Contract

## Critical flows

## SLI / SLO

## Error budget direction

## Health states

## Degraded modes

## Failure domains

## RTO / RPO

## Recovery sources

## Drill / verification

## Ownership

## Evidence status

## Review triggers
```

Non sostituisce NFR, Failure Mode Map, Cloud Deployment Map, Observability Contract o runbook. Li collega attorno a una domanda comune:

> **Che cosa deve restare vero del prodotto quando qualcosa va storto?**

## Esercizio 1 — Da “affidabile” a SLO

Prendi questo requisito:

> “Il sistema ordini deve essere molto affidabile.”

Trasformalo in almeno due SLI/SLO distinti. Per ciascuno specifica consumer, critical journey, good event, valid event, measurement window, target e ragione business.

Poi chiediti:

> Quale tecnologia avresti scelto diversamente se il target fosse 99%, 99.9% o 99.99%?

## Esercizio 2 — Component green, product red

Disegna un sistema con almeno cinque componenti e costruisci uno scenario in cui ogni health check infrastrutturale sia verde ma il critical user journey fallisca.

Identifica il signal che manca e spiega dove dovrebbe essere misurato.

## Esercizio 3 — Graceful degradation

Per un’applicazione che usa catalogo, prezzi, recommendation, checkout e payment provider, classifica quali capability possano degradare e quali debbano fermarsi.

Per ogni fallback indica:

```text
freshness
provenance
actions allowed
actions blocked
user communication
```

L’obiettivo non è mantenere sempre una risposta, ma mantenere una risposta ancora utilizzabile in sicurezza.

## Esercizio 4 — Retry storm

Scenario:

```text
500 client
× 3 retry immediati
× dependency al 20% della capacità normale
```

Spiega qualitativamente perché il retry può peggiorare il recovery e progetta retry budget, backoff, jitter, concurrency limit e stop condition.

## Esercizio 5 — Bulkhead

Prendi un’applicazione con:

```text
interactive API
report generation
background synchronization
```

Mostra come uno dei workload possa saturare gli altri. Proponi un capacity boundary che protegga il critical path e descrivi la nuova complessità introdotta.

## Esercizio 6 — HA non è backup

Per ognuno di questi failure scegli il meccanismo principale e motivane il fit:

```text
process crash
zone failure
database node failure
logical DELETE accidentale
bad deployment
region loss
credential compromise
```

Puoi usare più meccanismi fra restart, replica/failover, zone redundancy, rollback, PITR, cross-region recovery e identity revocation.

## Esercizio 7 — RTO/RPO

Definisci RTO/RPO distinti per:

1. checkout pubblico;
2. tool interno di reporting;
3. payroll;
4. telemetry analytics;
5. payment reconciliation.

Scrivi prima il business impact e soltanto dopo i target. Non cercare valori “standard”.

## Esercizio 8 — Restore drill

Scrivi un restore drill PostgreSQL che includa failure scenario, restore point, permission, recovery target, validation query, application validation, reconciliation, misura dell’RTO/RPO reale e cleanup.

Il drill deve produrre evidence, non soltanto una checklist eseguita.

## Esercizio 9 — Failure Mode Map di un deployment

Una nuova versione viene rilasciata. Considera failure di startup, schema compatibility, config, secret, identity, network, latency e functional correctness.

Per ciascuno indica:

```text
detection
blast radius
rollback
owner
```

## Esercizio 10 — Postmortem avversariale

Leggi:

- [GitHub Availability Report — May 2026](https://github.blog/news-insights/company-news/github-availability-report-may-2026/)

Senza inventare fatti non presenti nella fonte, separa:

```text
trigger
propagation
customer impact
mitigation
follow-up control
```

Poi identifica quali decisioni del libro avrebbero aiutato a formulare domande utili prima dell’incidente.

## Esercizio 11 — Cloudflare e failure domain

Leggi:

- [Cloudflare — Outage on July 17, 2020](https://blog.cloudflare.com/cloudflare-outage-on-july-17-2020/)

Ricostruisci failure origin, traffic concentration, blast radius, ciò che rimase healthy, mitigation e structural follow-up.

Non trasformare il caso in una regola universale su BGP: estrai il principio di containment.

## Esercizio 12 — Difendere la single-region decision ESI

Difendi davanti a un architecture review board la scelta:

```text
zone redundancy + HA + restore drills
ma
no active-active multi-region
```

Devi rispondere a Product, Security, Platform, Operations e Finance.

Poi cambia il requisito regionale da:

```text
RTO <= 8 h
```

in:

```text
RTO <= 15 min
```

Spiega quali decisioni cloud, data, messaging, deployment e recovery devono essere riaperte.

## Esercizio 13 — Reliability review con AI

Fornisci a un agente architecture diagram, Reliability Contract e Failure Mode Map. Chiedigli di enumerare failure mode e classificare per ognuno expected health, propagation path e recovery source.

Poi classifica ogni output dell’agente:

```text
verified from architecture
inferred
unknown
requires runtime evidence
```

Conta quante assunzioni sono state implicitamente trasformate in fatti.

## Esercizio 14 — Il test della rimozione

Scegli tre meccanismi presenti in una architettura:

```text
replica
cache
queue
circuit breaker
multi-region
```

Per ciascuno chiedi:

> Se lo rimuovo, quale SLO o failure mode peggiora materialmente?

Se non sai rispondere, hai trovato un possibile caso di reliability theater.

## Esercizio 15 — Reliability Contract

Produci un Reliability Contract per un sistema che conosci. Mantienilo inizialmente compatto: deve rendere leggibili critical flow, target, degraded mode, RTO/RPO, recovery source, ownership ed evidence.

Se servono trenta pagine solo per capire che cosa significa `Healthy`, il modello probabilmente deve ancora essere semplificato.

## Autovalutazione

Dovresti riuscire a spiegare senza consultare il capitolo la differenza tra availability e reliability; tra SLI e SLO; perché il 100% sia spesso un cattivo target; che cosa rappresenti un error budget; perché CPU e RAM non definiscano la health del prodotto; che cosa significhi `Degraded`; quando una cache possa diventare un fallback pericoloso; come nasca un retry storm; che cosa protegga un bulkhead; perché due replica possano fallire insieme; la differenza tra HA e PITR; che cosa misurino RTO e RPO; perché un backup non testato sia insufficiente; che evidence debba produrre un game day; perché un postmortem debba studiare il propagation path; che failure copra App Service zone redundancy; perché PostgreSQL HA non protegga da logical corruption; che ruolo abbia l’outbox durante un broker outage; perché private DNS sia un failure domain; e quali trigger debbano riaprire la scelta multi-region.

## Cosa cambia con l’AI

L’AI rende economico produrre retry policy, health endpoint, circuit breaker, Bicep multi-region, dashboard, synthetic check, chaos script, runbook e postmortem draft.

Il rischio è confondere:

```text
quantità di reliability code
```

con:

```text
reliability del sistema
```

Un sistema con dieci fallback generati può essere meno affidabile di uno con due failure path compresi e provati.

La verification AI-assisted dovrebbe quindi chiedere evidence invece di riscrivere manualmente tutto:

```text
quale SLO protegge?
quale failure simula il test?
qual è l’expected degraded behavior?
come viene limitato il blast radius?
qual è il rollback?
quale metrica dimostra il recovery?
```

## Il compromesso ESI

Order Operations vuole restare utilizzabile durante failure comuni e recuperabile durante failure più ampi. ESI accetta un costo maggiore su compute e database per comprare resilience intra-region, ma non introduce ancora multi-region active-active.

Il quality floor resta: committed local state preservato nei failure coperti dalla HA, degradation osservabile, recovery source nota, restore e reconciliation con owner, security boundary mai disabilitato per mantenere availability.

Gli artefatti di guardrail sono Reliability Contract, Failure Mode Map, IaC, error-budget direction, restore drill, game day ed evidence bundle.

## Ponte al Capitolo 15 — Observability

Ora sappiamo che cosa dovrebbe significare `Healthy`, `Degraded` e `Unhealthy`. Abbiamo SLO, failure domain, recovery target e drill.

Ci manca ancora il linguaggio operativo per sapere, durante un incidente, **che cosa sta realmente succedendo**.

Il Capitolo 15 entrerà in metrics, logs, traces, correlation, SLI measurement, burn-rate alert, synthetic journey, cardinality, sampling e business telemetry. Non partiremo da “installiamo Application Insights”. Partiremo da una domanda più importante:

> **Quale domanda dobbiamo riuscire a rispondere durante un incidente senza aprire il codice sorgente e indovinare?**

## Corollario

> **Non progettare un sistema che non fallisce. Progetta un sistema che sa come fallire senza perdere il proprio significato, e sa mostrare l’evidence di come torna indietro.**