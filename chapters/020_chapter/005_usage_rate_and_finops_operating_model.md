# 20.5 — Usage, rate e FinOps operating model

Quando il costo diventa visibile, la tentazione è reagire con una campagna.

```text
cost-cutting quarter
rightsizing week
stop everything
```

Può produrre risultati rapidi.

Raramente costruisce una disciplina duratura.

Microsoft Well-Architected distingue esplicitamente fra **usage optimization** e **rate optimization** e raccomanda una disciplina continua di cost management invece di interventi tattici isolati.

Fonti:

- [Microsoft Learn — Cost Optimization design principles](https://learn.microsoft.com/en-us/azure/well-architected/cost-optimization/principles)
- [Microsoft Learn — Architecture strategies for getting the best rates](https://learn.microsoft.com/en-us/azure/well-architected/cost-optimization/get-best-rates)

## Usage optimization

Ridurre ciò che consumiamo senza togliere outcome necessario.

Esempi:

```text
right-size compute
stop unused environment
reduce unnecessary retention
remove orphan resource
improve cache hit rate
reduce chatty integration
compress data
use autoscaling
```

Qui stiamo modificando quantità e comportamento.

## Rate optimization

Pagare meno per la stessa unità di consumo.

Esempi:

```text
reservation / commitment
enterprise discount
license optimization
cheaper region when requirements allow
pricing model selection
```

Qui, idealmente, non cambiamo la proprietà del workload.

Ma anche una rate decision può ridurre optionality.

Un commitment economico ha infatti una conseguenza:

```text
lower rate
↔
less flexibility
```

Quindi anche il contratto commerciale può diventare un vincolo architetturale.

## Waste vs headroom

Una delle discussioni FinOps più delicate è distinguere spreco da capacità intenzionale.

```text
CPU 40%
```

non significa automaticamente:

```text
60% waste
```

Potrebbe esserci headroom necessario per:

- failover;
- burst;
- deployment;
- recovery;
- latency target.

Dall'altra parte, chiamare tutto “headroom per reliability” può diventare una giustificazione per non misurare nulla.

Quindi la capacità deve essere collegata a:

```text
peak
failure scenario
SLO
recovery target
scaling latency
```

> **Capacity senza scenario è sovrapprovisioning indistinguibile da prudenza.**

## Environment economics

Non tutti gli environment devono avere la stessa topologia.

Microsoft Well-Architected suggerisce esplicitamente di trattare differentemente gli ambienti SDLC e, quando possibile, creare pre-production environment on-demand invece di mantenerli sempre attivi.

Fonte:

- [Microsoft Learn — Cost Optimization design principles](https://learn.microsoft.com/en-us/azure/well-architected/cost-optimization/principles)

Per ESI questo significa che:

```text
production
→ zone resilience requirement

integration environment
→ enough fidelity for PostgreSQL/API contract

security staging
→ enough fidelity for identity/network verification

local
→ no need to reproduce Azure
```

Questa è un'applicazione economica della Testing Strategy del Capitolo 16.

Il test environment più costoso deve dimostrare qualcosa che quello economico non può dimostrare.

## Budget non è architecture limit

Un budget non dovrebbe essere interpretato come:

> **spendi esattamente questo.**

È un constraint e un feedback mechanism.

Il processo utile è:

```text
forecast
→ budget
→ actual
→ variance
→ explanation
→ decision
```

La variazione può essere positiva o negativa.

Un aumento di costo può essere corretto se corrisponde a:

- più business volume;
- nuovo requisito security;
- nuova geography;
- reliability target più forte.

Un calo può essere negativo se deriva da perdita di traffico o rimozione di una capability necessaria.

## Anomaly vs trend

Dobbiamo distinguere:

### Anomaly

Cambio inatteso e rapido.

```text
telemetry ingestion +400% in un giorno
```

### Trend

Crescita progressiva.

```text
storage +8% mese su mese
```

L'anomaly richiede spesso investigation.

Il trend richiede forecasting e decisione architetturale.

## Finance non è il gatekeeper tecnico

FinOps funziona male se il modello è:

```text
Engineering builds
→ Finance complains later
```

Ma funziona male anche così:

```text
Finance approves individual resources
→ Engineering optimizes for bureaucracy
```

La FinOps Foundation tratta Architecting & Workload Placement come collaborazione fra Product, Engineering e FinOps, con business case, cost/value comparison e review cadence.

Fonte:

- [FinOps — Architecting & Workload Placement](https://www.finops.org/framework/capabilities/architecting-workload-placement/)

Un operating model sano può essere:

```text
Product
→ value / demand / priority

Engineering
→ cost driver / architecture / technical options

FinOps
→ cost data / forecast / rate / allocation / economics

Security / Reliability / Platform
→ non-negotiable and shared constraints
```

Nessuno dei quattro può decidere bene da solo.

## Cost guardrail

Come per Architecture Evolution, alcune regole possono essere automatizzate.

Esempi:

```text
required allocation metadata
budget alert
unapproved premium SKU detection
orphan resource detection
telemetry retention maximum by class
nonprod TTL
```

Ma un guardrail non deve sostituire il judgment.

Per esempio:

```text
premium SKU forbidden
```

sarebbe una pessima regola se il threat model richiede una feature disponibile soltanto in quel tier.

Meglio:

```text
premium SKU
→ reason / owner / cost model / review trigger
```

## Showback before punishment

In una organizzazione che sta iniziando, la visibility può avere più valore del chargeback aggressivo.

Se un team scopre:

```text
telemetry = 35% del workload cost
```

può già cambiare comportamento senza che Finance trasferisca formalmente la fattura.

La metrica deve creare decisione prima di creare paura.

## FinOps come feedback loop architetturale

Il ciclo diventa:

```text
architecture decision
→ consumption
→ cost data
→ unit economics
→ compare with value
→ optimize / retain / redesign
```

È una fitness function economica.

Non necessariamente un test booleano.

Può essere un trend.

```text
cost per OperationalCase handled
```

se cresce continuamente più del valore o della complessità del case, abbiamo un segnale.

## Regola

> **FinOps non è il reparto che taglia il cloud. È il feedback loop che permette a Product, Engineering e Finance di capire se la tecnologia sta ancora comprando valore a un prezzo sostenibile.**