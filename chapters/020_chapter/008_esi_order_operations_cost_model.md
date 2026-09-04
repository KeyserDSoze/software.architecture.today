# 20.8 — ESI: Order Operations costruisce il proprio cost model

A questo punto ESI ha abbastanza architettura da avere anche abbastanza costi da governare.

Il rischio è reagire tardi.

Finance vede crescere il run rate e chiede:

> dove possiamo tagliare?

Engineering potrebbe rispondere con una lista di SKU.

Ma sarebbe una risposta insufficiente.

Il team deve prima mostrare **che cosa compra ogni componente importante della spesa**.

## Cost surface corrente

Order Operations possiede oggi almeno queste categorie.

### Runtime

```text
App Service Premium-compatible baseline
+ >= 2 instances
```

Proprietà comprata:

```text
application runtime
+ capacity headroom
+ zonal resilience direction
```

### Database

```text
Azure Database for PostgreSQL direction
+ HA / backup / PITR requirements
```

Proprietà comprata:

```text
durable local business state
+ recovery capability
```

### Messaging

```text
Service Bus Premium
```

Proprietà comprata:

```text
durable async delivery
+ private data-plane direction
+ zonal resilience
```

### Security

```text
private connectivity
identity integration
Key Vault
security verification
```

Proprietà comprata:

```text
reduced public reachability
+ workload identity
+ secret governance
```

### Observability

```text
Application Insights / Log Analytics direction
telemetry ingestion
retention
traces
alerts
```

Proprietà comprata:

```text
SLI measurement
incident investigation
correlation
operational evidence
```

### Migration overlap

```text
Operations Desk Classic
+ Order Operations
+ shadow comparison
```

Proprietà comprata:

```text
reversibility
+ semantic evidence
+ safer retirement
```

## Il primo errore da evitare

Finance potrebbe notare che Service Bus Premium è una voce relativamente importante e chiedere di passare a un tier più economico.

La risposta corretta non è:

> no, Security ha detto Premium.

La risposta corretta è:

```text
Current property
private data-plane direction

Current mechanism
Service Bus Private Link

Cost implication
Premium tier

Alternative
public endpoint + identity/network controls

Decision required
reopen Threat Model + Security Control Matrix
```

Questo rende la discussione architetturale.

Finance può ancora chiedere se il premium vale il rischio ridotto.

Security può spiegare il threat.

Engineering può proporre alternative.

Ma nessuno tratta il costo come se fosse separato dalla proprietà.

## Cost model v0

Order Operations introduce quindi un primo modello qualitativo e parametrico.

Non inventiamo prezzi Azure.

I prezzi cambiano per region, contratto, tier e data.

Il modello contiene variabili.

```text
MonthlyCost =
    RuntimeBase
  + DatabaseBase
  + MessagingBase
  + SecuritySharedAllocation
  + ObservabilityUsage
  + BackupStorage
  + NetworkUsage
  + NonProd
  + MigrationOverlap
```

E un secondo layer:

```text
FullyLoadedCost =
    MonthlyCost
  + EngineeringRunCost
  + OnCallCost
  + PlatformSharedCost
  + MigrationEngineeringCost
```

Non pretendiamo che tutte queste variabili siano immediatamente monetizzate con precisione.

Le rendiamo visibili.

## Cost driver

Per ogni voce definiamo il driver principale.

| Area | Primary driver | Secondary driver |
|---|---|---|
| App runtime | traffic / concurrency | headroom / resilience |
| PostgreSQL | data + query load | HA / retention |
| Service Bus | baseline tier + messaging | isolation / availability |
| Observability | telemetry volume | retention / cardinality |
| Backup | retained data | recovery policy |
| Nonprod | environment hours | fidelity |
| Legacy overlap | coexistence duration | shadow volume |

Il valore della tabella non è predire ogni euro.

È far vedere dove una decisione futura sposterà la curva.

## Unit metrics candidate

ESI sceglie tre metriche iniziali.

### UM-01 — Cost per OperationalCase handled

```text
allocated monthly Order Operations cost
/
OperationalCase handled
```

Serve a capire se la crescita di costo segue il lavoro operativo.

### UM-02 — Cost per Payment Escalation delivered

```text
allocated messaging + publisher + relevant telemetry cost
/
Payment Escalation delivered
```

Non viene usata da sola: deve essere letta insieme allo SLI di delivery.

### UM-03 — Observability cost per 1,000 critical journeys

Serve per capire se telemetry volume cresce più rapidamente dell'utilità operativa.

Stato di tutte:

```text
Designed
not yet measured from production billing
```

## Cost allocation metadata

Il team definisce la direzione per i resource metadata:

```text
workload = order-operations
environment = prod|staging|dev
business-unit = commerce-operations
owner = order-operations
cost-center = <ESI simulated finance mapping>
```

La parte `cost-center` non viene hardcodata nel libro come valore reale.

È un mapping simulato che dovrà essere configurato quando avremo una pipeline di deployment completa.

## Non-production

Qui troviamo una ottimizzazione a basso rischio.

Non tutti gli environment devono mantenere:

```text
2 instances
zone redundancy
full telemetry retention
```

se il test che devono eseguire non richiede quelle proprietà.

Quindi ESI decide:

```text
local
→ fast test only

integration
→ real PostgreSQL where needed

security/network staging
→ Azure fidelity when the property requires it

production
→ full quality baseline
```

Questo collega direttamente cost model e Testing Strategy.

## Observability cost guardrail

Non eliminiamo tracing.

Manteniamo invece:

```text
bounded metric dimensions
sampling policy
retention by signal class
no arbitrary high-cardinality metric dimension
```

Il trigger di review diventa:

```text
observability cost growth
> critical journey growth
without corresponding new diagnostic requirement
```

Non assegniamo una percentuale simulata.

Definiamo il confronto.

## Legacy coexistence budget

Operations Desk Classic crea una voce particolare:

```text
MigrationOverlapCost
```

La regola ESI diventa:

> ogni quarter di coexistence deve avere una reason, una removal condition o una nuova decisione di retain.

Questo evita che:

```text
temporary dual run
```

diventi:

```text
permanent dual ownership
```

## Cosa ESI non taglia

Il primo cost review non autorizza automaticamente a ridurre:

```text
tenant isolation
required authentication / authorization
required backup
required SLO
recovery evidence
minimum diagnostic capability
```

Se vogliamo cambiarli, dobbiamo cambiare i relativi requirement.

Non possiamo fingere che sia semplice optimization.

## Cosa ESI prova a ottimizzare per prima

Ordine iniziale:

1. visibility e allocation;
2. unused/non-production runtime;
3. telemetry volume/retention fuori bisogno;
4. rightsizing con headroom verificato;
5. rate optimization quando il workload diventa prevedibile;
6. legacy coexistence duration;
7. soltanto dopo, redesign di quality premium significativi.

Perché?

Perché i primi punti possono ridurre waste senza cambiare direttamente il quality floor.

Gli ultimi richiedono trade-off architetturali più forti.

## Il compromesso del capitolo

### Esigenza

Finance vuole controllare il run rate e rendere prevedibile la crescita.

### Tensione

```text
cost efficiency
vs
security
reliability
operability
migration safety
team focus
```

### Decisione

ESI introduce:

```text
Cost Model
+ unit metrics
+ allocation metadata direction
+ cost review triggers
```

prima di eliminare capability.

### Costo accettato

Il sistema non è il più economico possibile.

Continua a pagare premium intenzionali per qualità già giustificate.

### Quality floor

```text
correctness
security
required reliability
recoverability
operability
```

### Guardrail

```text
cost driver per major spend
property purchased
owner
unit metric
review trigger
architecture artifact reopening when quality changes
```

## Formula finale

> **ESI non ottimizza il costo togliendo qualità alla cieca. Ottimizza il rapporto fra ciò che paga e ciò che il sistema deve garantire.**