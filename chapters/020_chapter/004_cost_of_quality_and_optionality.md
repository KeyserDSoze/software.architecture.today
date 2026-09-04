# 20.4 — Il costo delle qualità che vogliamo

Le quality attribute non sono gratuite.

Questa frase sembra banale finché non dobbiamo scegliere quali pagare davvero.

Nel Capitolo 6 abbiamo detto che gli aggettivi non sono requisiti.

Lo stesso vale per il costo.

Dire:

```text
highly available
secure
observable
scalable
portable
```

senza specificare quanto ci serve ognuna di queste proprietà tende a produrre architetture che comprano più capacità di quanta il business sappia usare.

## Reliability ha un prezzo

Più redundancy significa normalmente più risorse, più replica, più test e più meccanismi di recovery.

Microsoft Well-Architected osserva esplicitamente che massimizzare reliability introduce costi finanziari e di engineering e raccomanda di evitare over-engineering oltre i business requirement.

Fonte:

- [Microsoft Learn — Design principles of a mission-critical workload](https://learn.microsoft.com/en-us/azure/well-architected/mission-critical/mission-critical-design-principles)

Esempio:

```text
single instance
→ costo basso
→ failure locale evidente

2+ instances + zone redundancy
→ costo maggiore
→ maggiore capacità di assorbire failure coperti

multi-region active-active
→ costo ancora maggiore
→ capability ulteriore
```

La sequenza non rappresenta livelli di maturità.

Rappresenta proprietà differenti.

Per Order Operations abbiamo già scelto di pagare zone resilience senza pagare active-active multi-region.

Non perché multi-region sia troppo sofisticato.

Perché il regional RTO simulato corrente non lo richiede.

## Security ha un prezzo

Security può produrre costi diretti:

```text
Premium tier
private connectivity
security tooling
scanning
SIEM ingestion
HSM / key management
```

ma anche indiretti:

```text
identity design
permission review
incident response
security testing
compliance evidence
```

Questo non significa che siano optional in senso banale.

Significa che anche il controllo deve avere fit con il threat model.

Il Capitolo 13 ci ha dato un esempio concreto:

```text
Private Link per Service Bus
→ Premium tier
```

Il prezzo maggiore è intenzionale perché compra una proprietà che ESI ha collegato al proprio security boundary.

Una ottimizzazione che passa a una soluzione più economica eliminando quella proprietà deve quindi riaprire il threat model.

Non basta il confronto delle SKU.

## Observability ha un prezzo

Telemetry ha una caratteristica particolare:

è facilissimo raccoglierla prima di sapere se la useremo.

```text
log everything
trace everything
retain forever
```

produce rapidamente:

- ingestion cost;
- storage cost;
- query cost;
- cardinality pressure;
- security/privacy exposure;
- cognitive noise.

Per questo nel Capitolo 15 abbiamo introdotto:

```text
cardinality budget
sampling policy
retention policy
```

Il costo non è un problema separato dall'observability.

È una delle forze che la progettano.

> **La telemetry utile deve essere abbastanza ricca da spiegare il sistema e abbastanza governata da non diventare un secondo workload più costoso del primo.**

## Isolation ha un prezzo

Separare può comprare:

- failure isolation;
- security isolation;
- independent scaling;
- independent deployment;
- ownership.

Ma può anche introdurre:

```text
more runtime
more network
more certificates
more pipelines
more observability
more on-call surfaces
```

Questo è uno dei motivi per cui abbiamo mantenuto Order Operations come modular monolith.

Microservices non sarebbero soltanto una scelta di codice.

Sarebbero un aumento permanente del cost surface.

## Performance ha un prezzo

Possiamo comprare performance con:

```text
more compute
more memory
cache
replica
index
precomputation
CDN
specialized datastore
```

Ma possiamo anche comprarla con un algoritmo migliore o una query migliore.

La prima categoria tende ad aumentare spend.

La seconda tende ad aumentare engineering effort iniziale e spesso riduce run cost.

Quindi una discussione seria sul costo deve includere anche:

> **quanto engineering effort vale spendere per evitare recurring infrastructure cost?**

Non esiste una risposta universale.

Dipende dalla durata prevista del workload e dalla curva di consumo.

## Optionality ha un prezzo

Una delle forme più invisibili di costo è pagare per futuri possibili.

```text
multi-cloud abstraction
because maybe one day

Kafka
because maybe one day we need replay

Kubernetes
because maybe one day we need portability

multi-region
because maybe one day SLA changes
```

L'optionality può avere valore reale.

Ma ha un premio.

Quel premio può essere:

- abstraction complexity;
- lowest-common-denominator design;
- duplicated skill;
- additional test matrix;
- extra infrastructure;
- slower delivery.

Quindi una domanda architetturale utile è:

> **Quanto siamo disposti a pagare oggi per una reversibilità che potremmo usare domani?**

Questo collega direttamente cost e one-way/two-way door.

Per una two-way door è spesso razionale comprare meno optionality upfront.

Per una one-way door il premium può essere giustificato.

## Complexity cost

La complessità è difficile da mettere in fattura, ma produce costi ripetuti.

```text
più componenti
→ più comprensione

più boundary
→ più contratti

più topology
→ più failure mode

più astrazioni
→ più decisioni durante ogni change
```

Questo è il motivo per cui una tecnologia gratuita può essere costosissima.

La licenza è zero.

Il costo cognitivo no.

## Value premium

Non tutti i cost premium sono waste.

Possiamo chiamare **value premium** la quota di costo aggiuntiva che paghiamo intenzionalmente per una proprietà importante.

Esempio ESI:

```text
Service Bus Premium
premium reason = private data plane

App Service >= 2 instances
premium reason = zonal resilience direction

telemetry retention
premium reason = investigation / SLI evidence
```

Il premium diventa sospetto quando non sappiamo più dire quale proprietà compra.

Questa è una buona fitness question:

> **Per ogni costo architetturale significativo, sappiamo nominare la proprietà che stiamo comprando?**

## Cost cut vs architecture change

Alcune ottimizzazioni non cambiano l'architettura:

```text
rate discount
reservation
rightsizing entro headroom già verificato
storage tier coerente con access pattern
```

Altre sì:

```text
rimuovere redundancy
ridurre retention sotto investigation need
rendere pubblico un data plane privato
consolidare tenant isolati
eliminare un backup path
```

La seconda categoria deve riaprire il relativo decision record o quality artifact.

> **Se per risparmiare cambiamo una proprietà del sistema, stiamo facendo architettura. Anche se la richiesta è arrivata da Finance.**

## Regola

> **Non chiedere se una qualità costa troppo. Chiedi se il costo della qualità è proporzionato al rischio o al valore che quella qualità protegge.**