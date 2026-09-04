# 20.8 — ESI: Order Operations costruisce il proprio Cost Model

A questo punto ESI ha abbastanza architettura da avere anche abbastanza costi da governare.

Finance vede crescere la cost surface e chiede dove sia possibile ridurla. Engineering potrebbe rispondere con una lista di SKU, ma perderebbe il punto. Prima di decidere che cosa tagliare, il team deve mostrare **che cosa compra ogni componente importante della spesa e quale requisito lo giustifica**.

Il Capitolo 20 non inventa prezzi Azure. Non abbiamo billing production e i prezzi dipendono da region, contratto, tier e momento. Costruiamo quindi un modello qualitativo e parametrico che potrà essere popolato con evidence reale quando esisterà.

## La cost surface corrente

La baseline di Order Operations può essere letta come una mappa fra meccanismo e proprietà acquistata.

| Area | Meccanismo corrente / direzione | Proprietà comprata | Forma prevalente del costo |
|---|---|---|---|
| Runtime | App Service, capacity >= 2, zone direction | application runtime + headroom + intra-region resilience | base + step |
| Database | managed PostgreSQL, HA/backup/PITR direction | durable business state + recovery | base + storage/usage |
| Messaging | Service Bus Premium | durable async delivery + private data plane + resilience | premium base + usage |
| Security | private connectivity, identity, Key Vault | reduced public reachability + workload identity + secret governance | base/shared |
| Observability | metrics, logs, traces, retention | SLI measurement + investigation + correlation | usage + retention |
| Non-production | local/integration/staging | evidence con fidelity proporzionata | time + fidelity |
| Legacy overlap | Operations Desk Classic + Order Operations + shadow structures | reversibility + semantic evidence | transition |

La tabella non ci dice se una voce è cara. Ci dice quale conversazione dobbiamo riaprire se vogliamo cambiarla.

## Service Bus Premium: dal prezzo alla proprietà

Immaginiamo che Finance individui Service Bus Premium come una voce importante e proponga un tier più economico.

La risposta debole sarebbe:

> “No, Security vuole Premium.”

La risposta governabile è diversa:

```text
Property currently purchased
private data-plane direction

Current mechanism
Service Bus Premium + private endpoint direction

Alternative
cheaper mechanism with different network exposure/capability

Decision impact
Threat Model + Security Control Matrix + Cloud Deployment Map
must be reopened
```

A questo punto Finance può chiedere se il premium è ancora proporzionato al rischio, Security può spiegare quale threat sta mitigando ed Engineering può valutare alternative. Nessuno tratta più il costo come se fosse separato dall'architettura.

## Il modello parametrico

La prima versione del Cost Model usa variabili, non prezzi simulati:

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

Per ricordare che la cloud bill non esaurisce il TCO aggiungiamo una seconda vista:

```text
FullyLoadedCost =
    MonthlyCost
  + EngineeringRunCost
  + OnCallCost
  + PlatformSharedCost
  + MigrationEngineeringCost
```

Non tutte queste variabili saranno immediatamente monetizzabili. Il vantaggio è che smettono di essere invisibili.

## Cost driver: che cosa muove la curva

Per ogni area registriamo il driver principale e una forza secondaria che può cambiare il comportamento economico.

| Area | Driver principale | Driver secondario |
|---|---|---|
| App runtime | traffic / concurrency | reliability headroom |
| PostgreSQL | data + query load | HA / retention |
| Service Bus | tier + message volume | isolation / availability |
| Observability | telemetry volume | retention / cardinality |
| Backup | retained data | recovery policy |
| Non-production | environment hours | fidelity |
| Legacy overlap | coexistence duration | shadow + engineering effort |

Questa tabella è più utile di un catalogo di prezzi perché rende evidente dove una decisione futura cambierà la curva.

Se observability cresce, per esempio, dobbiamo capire se il driver è più traffico utile, retention troppo lunga, una dimensione ad alta cardinalità o un nuovo requisito diagnostico. Ridurre ingestion senza questa distinzione potrebbe eliminare evidence necessaria invece di waste.

## Le prime unit metric

ESI sceglie tre unità che possano collegare cost e outcome senza fingere dati che non possiede.

### UM-01 — Cost per `OperationalCase` handled

```text
allocated Order Operations cost
/
OperationalCase handled
```

Serve a capire se la crescita della spesa segue il lavoro operativo. Deve essere letta insieme alla qualità del journey, non isolatamente.

### UM-02 — Cost per `Payment Escalation` delivered

```text
allocated messaging + publisher + relevant telemetry
/
delivered Payment Escalation
```

La metrica viaggia con il publication SLI. Risparmiare sulla capability e peggiorare la delivery non è automaticamente un miglioramento.

### UM-03 — Observability cost per 1.000 critical journeys

```text
allocated observability cost
/
critical journey count
* 1000
```

Serve a intercettare telemetry che cresce più rapidamente del bisogno operativo.

Lo stato di tutte e tre è:

```text
Designed
not measured from production billing
```

Questa distinzione è importante quanto la formula.

## Allocation: non inventiamo Finance metadata

L'IaC può già proteggere metadata utili come workload, environment e owner. La direzione economica aggiunge `businessUnit` e `product`.

```text
workload = order-operations
owner = commerce-operations
environment = <dev|staging|prod>
businessUnit = commerce-operations
product = order-operations
```

`cost-center` resta deliberatamente non valorizzato nel manoscritto. Appartiene a un mapping Finance reale o esplicitamente simulato, non a una stringa inventata per rendere l'esempio più completo.

## Non-production: la prima ottimizzazione a basso rischio

Il test environment più costoso deve dimostrare qualcosa che quello più economico non può dimostrare.

Per ESI la direzione è quindi:

```text
business rules
→ local

PostgreSQL semantics
→ integration with real PostgreSQL

Azure identity/network properties
→ targeted Azure staging

production quality baseline
→ production only
```

Non è necessario che ogni ambiente mantenga due istanze, zone resilience e la stessa retention di production se l'evidence che deve produrre non richiede quelle caratteristiche.

Questa è una riduzione di waste che non cambia automaticamente il quality floor.

## Observability: ridurre il rumore, non la spiegabilità

ESI non decide “meno tracing” in astratto. Mantiene bounded metric dimensions, sampling policy e retention per signal class e introduce un review trigger qualitativo:

```text
observability cost grows materially faster
than critical journey volume / diagnostic need
```

Quando il trigger scatta, la domanda è quale segnale o retention non compra più evidence utile. Non partiamo eliminando proprio la telemetria che serve a dimostrare SLI o investigare failure.

## Legacy overlap: il tempo diventa un cost driver

Operations Desk Classic crea una voce particolare: `MigrationOverlap`.

Qui il driver principale non è il traffico. È la **durata della coesistenza**.

Il Refactoring Safety Plan ci ha già dato la removal condition tecnica. Il Cost Model aggiunge la review economica: ogni periodo ulteriore di dual run deve continuare a comprare reversibilità o evidence che non possiamo ancora ottenere in altro modo.

Se il legacy resta perché nessuno sa chi può spegnerlo, non stiamo più comprando safety. Stiamo pagando indecisione.

## Ordine di ottimizzazione ESI

Il team decide di partire dalle leve che possono ridurre waste senza cambiare direttamente le proprietà già approvate:

```text
visibility / allocation
→ unused and non-production runtime
→ unnecessary telemetry volume / retention
→ rightsizing with verified headroom
→ rate optimization when demand is predictable
→ legacy coexistence duration
→ only then reconsider architectural premiums
```

L'ordine non è una legge universale. Esprime una preferenza: **prima togliere spesa priva di valore evidente, poi discutere se ridurre qualità che oggi ha un requisito e un owner.**

## Quality-changing cost cut = decision reopening

Il Cost Model definisce una regola semplice. Se una proposta cambia tenant isolation, authentication/authorization, backup, SLO, recovery evidence, minimum diagnostic capability o migration rollback, deve riaprire l'artefatto che governa quella proprietà.

Finance può avviare la domanda. Non può trasformarla in una modifica neutrale soltanto perché l'obiettivo è il risparmio.

## Compromesso ESI del capitolo

**Esigenza:** Finance vuole rendere il run rate prevedibile e sostenibile.

**Tensione:** cost efficiency contro security, reliability, operability, migration safety e focus del team.

**Decisione:** introdurre Cost Model, driver map, unit metric, allocation direction e review trigger prima di autorizzare quality cut.

**Costo accettato:** Order Operations non è il workload più economico possibile. Continua a pagare premium intenzionali per proprietà già giustificate.

**Quality floor:** correctness, security, reliability richiesta, recoverability e operability minima restano invarianti finché i relativi requirement non vengono riaperti.

**Guardrail:** ogni major cost deve poter essere collegato a property purchased, owner, driver, unit metric ed evidence necessaria per modificarlo.

> **ESI non ottimizza il costo togliendo qualità alla cieca. Ottimizza il rapporto fra ciò che paga e ciò che il sistema deve garantire.**