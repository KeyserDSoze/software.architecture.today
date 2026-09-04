# 20.2 — Cost model, TCO e cost driver

Una fattura è un risultato.

Un cost model è una spiegazione.

La differenza conta.

La fattura ci dice quanto abbiamo speso.

Il cost model prova a rispondere a domande più utili:

- quali componenti guidano la spesa?
- quali costi sono fissi?
- quali sono proporzionali all'uso?
- quali crescono a scatti?
- quali sono condivisi?
- quali cambiano se cambia il workload?
- quale parte del costo è infrastruttura e quale parte è organizzazione?

Microsoft Azure Well-Architected descrive il cost model come strumento per stimare initial cost, run rate e ongoing cost, includendo scenario analysis e budget. Non serve soltanto per reporting: serve per prevedere l'effetto economico di una decisione architetturale.

Fonte:

- [Microsoft Learn — Architecture strategies for creating a cost model](https://learn.microsoft.com/en-us/azure/well-architected/cost-optimization/cost-model)

## TCO non è la somma delle SKU

Un confronto come:

```text
soluzione A = 2.000 €/mese
soluzione B = 1.500 €/mese
```

non è ancora un confronto architetturale.

Potrebbe mancare:

```text
engineering ownership
support contract
operational toil
on-call
backup
security review
observability
migration effort
licensing
training
incident exposure
exit / switching cost
```

Quindi conviene distinguere almeno quattro famiglie.

### 1. Technology run cost

Quello che possiamo misurare direttamente dai provider:

```text
compute
storage
network
managed service
license
support
telemetry ingestion
backup
```

### 2. Engineering change cost

Quanto costa modificare il sistema:

```text
lead time
test environment
review burden
migration effort
release coordination
specialized knowledge
```

### 3. Operational cost

Quanto costa tenerlo vivo:

```text
on-call
incident response
manual procedure
capacity management
patching
upgrade
recovery drill
security remediation
```

### 4. Risk cost

Non è sempre semplice trasformarlo in denaro, ma ignorarlo non lo rende zero:

```text
downtime
security incident
data loss
contract breach
compliance failure
reputation
missed business opportunity
```

## Cost driver prima dell'ottimizzazione

Prima di ottimizzare dobbiamo sapere che cosa muove il costo.

Un'applicazione potrebbe avere:

```text
traffic → compute

retention → storage

fan-out → message count

cross-region topology → egress + duplicated resources

high-cardinality telemetry → observability spend

large prompts → token usage

legacy coexistence → parallel runtime + parallel operations
```

Se il cost driver non è chiaro, rischiamo di ottimizzare la voce più visibile invece di quella che determina la curva.

Esempio:

```text
20% meno costo compute
```

può essere irrilevante se la vera crescita viene da:

```text
telemetry retention
```

oppure da:

```text
network egress
```

oppure da:

```text
engineering toil
```

## Baseline e scenario

Un cost model utile deve poter confrontare almeno:

```text
Current
Expected growth
Alternative A
Alternative B
Failure / peak scenario
Migration overlap
```

Per esempio:

```text
Order Operations current
single region

Option A
same topology + usage growth

Option B
multi-region active-active

Option C
separate publisher runtime
```

Non servono subito numeri perfetti.

Serve rendere esplicite le variabili.

```text
monthly base cost
+ traffic coefficient
+ storage growth
+ telemetry growth
+ shared platform allocation
+ migration overlap
```

Il valore di questo esercizio è spesso scoprire che alcune variabili che stavamo trattando come costanti non lo sono.

## Cost model e uncertainty

Un cost model non è una previsione certa.

È un modello decisionale.

Quindi deve dichiarare:

```text
assumption
source
range
confidence
review trigger
```

Esempio:

```text
Assumption
operational cases +40% nei prossimi 12 mesi

Source
Product forecast simulato ESI

Confidence
medium

Impact
DB/storage/telemetry

Review trigger
forecast revision > 15%
```

Un numero con due decimali non diventa più affidabile soltanto perché sembra preciso.

> **La precisione del foglio non può superare la qualità delle assunzioni.**

## Build vs buy

Il costo architetturale emerge anche nella decisione build vs buy.

Confrontare:

```text
managed service price
vs
VM price
```

è quasi sempre incompleto.

Dobbiamo confrontare:

```text
managed service
= provider price
+ integration
+ vendor constraints

self-managed
= infrastructure
+ engineering ownership
+ upgrade
+ security
+ monitoring
+ recovery
+ capacity
+ on-call
```

Microsoft Well-Architected raccomanda esplicitamente di includere build-vs-buy, billing model, licensing, training e operational expense nelle considerazioni economiche delle decisioni architetturali.

Fonte:

- [Microsoft Learn — Cost Optimization design principles](https://learn.microsoft.com/en-us/azure/well-architected/cost-optimization/principles)

Questo non significa che managed sia sempre più economico.

Significa che il confronto deve includere ciò che realmente possediamo.

## Cost of transition

Le migrazioni hanno un costo transitorio che spesso sparisce dai confronti.

```text
old runtime
+ new runtime
+ shadow traffic
+ dual write
+ duplicated telemetry
+ migration tooling
+ reconciliation
+ extra on-call
```

La FinOps Foundation, nella capability Architecting & Workload Placement, include esplicitamente transition state e parallel run tra i costi da considerare durante modernization e placement decisions.

Fonte:

- [FinOps — Architecting & Workload Placement](https://www.finops.org/framework/capabilities/architecting-workload-placement/)

Nel nostro capstone questo vale per Operations Desk Classic.

Finché il legacy resta attivo, il costo di Order Operations non sostituisce completamente quello precedente.

Lo somma in parte.

Questo cambia anche il business case della modernizzazione.

> **Una migrazione non costa soltanto dove vogliamo arrivare. Costa anche il tempo in cui dobbiamo vivere in due posti.**

## Cost model minimo

Per un workload, una prima versione può contenere:

```text
Scope
Business outcome
Cost owner
Budget owner
Direct cost categories
Shared cost categories
Engineering / operating cost
Cost driver
Unit metric
Assumptions
Current baseline
Growth scenarios
Major architectural premiums
Optimization hypotheses
Risk of optimization
Review cadence
```

Non deve diventare un documento finanziario da cento pagine.

Deve permettere a Product, Engineering e Finance di discutere la stessa decisione con lo stesso modello.

## Regola

> **Il TCO è il costo di possedere una decisione, non soltanto il prezzo della risorsa che la implementa.**