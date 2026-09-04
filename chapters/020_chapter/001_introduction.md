# Capitolo 20 — Costi e decisioni

Un sistema può essere tecnicamente elegante, affidabile, sicuro e perfettamente inutile perché costa troppo rispetto al valore che produce.

Può succedere anche il contrario.

Un sistema può costare pochissimo e risultare comunque una pessima architettura perché per risparmiare abbiamo eliminato proprio le proprietà che permettevano al prodotto di funzionare.

Quindi la domanda non è:

> **Quanto costa questa architettura?**

La domanda utile è:

> **Quale proprietà stiamo comprando con questo costo, e il valore di quella proprietà giustifica ciò che stiamo pagando?**

Questa distinzione è fondamentale.

Nel Capitolo 13 ESI ha scelto Service Bus Premium per poter progettare Private Link sul data plane.

Nel Capitolo 14 ha scelto più istanze e zone redundancy per comprare resilienza intra-region.

Nel Capitolo 15 ha scelto telemetry, retention e tracing governati per comprare capacità investigativa.

Nel Capitolo 17 e 18 ha accettato la coesistenza temporanea fra Operations Desk Classic e Order Operations per comprare una migrazione più sicura.

Tutti questi elementi hanno un costo.

E quel costo non è un incidente.

È una conseguenza dell'architettura.

## Cost optimization non significa lowest cost

Microsoft Azure Well-Architected Framework formula il punto in modo esplicito: un workload cost-optimized non è necessariamente un workload a basso costo. L'obiettivo è massimizzare il ritorno dell'investimento rispettando i requisiti funzionali e non funzionali, e le decisioni di costo devono essere bilanciate con reliability, security, scalability e operability.

Fonte:

- [Microsoft Learn — Cost Optimization design principles](https://learn.microsoft.com/en-us/azure/well-architected/cost-optimization/principles)

Questo cambia il modo in cui leggiamo molte discussioni architetturali.

La ridondanza non è automaticamente spreco.

La ridondanza senza requisito può esserlo.

Un managed service non è automaticamente costoso.

Può costare più della materia prima infrastrutturale e meno della capacità organizzativa necessaria per gestire la stessa capability internamente.

Un monolite non è automaticamente economico.

Può ridurre infrastruttura e aumentare enormemente coordination cost.

Un sistema distribuito non è automaticamente scalabile in senso economico.

Può scalare il traffico e contemporaneamente scalare il numero di deployable, pipeline, dashboard, certificati, failure mode e competenze necessarie.

> **Il costo architetturale è il prezzo complessivo delle proprietà che scegliamo di possedere.**

## La fattura cloud è solo una parte

Quando si parla di costo software, è facile guardare soltanto alla fattura del provider.

Ma il Total Cost of Ownership di un sistema include almeno:

```text
compute
storage
network / egress
managed services
licenses
support
observability
security tooling
backup / recovery
non-production environments
engineering time
operations / on-call
migration
training
platform work
incident cost
legacy coexistence
cognitive load
```

Microsoft raccomanda infatti che il cost model consideri costi diretti e indiretti come infrastruttura, supporto, implementazione, training e change management, e che venga mantenuto nel tempo invece di essere un foglio prodotto una volta sola.

Fonte:

- [Microsoft Learn — Architecture strategies for creating a cost model](https://learn.microsoft.com/en-us/azure/well-architected/cost-optimization/cost-model)

Questo significa che una technology choice apparentemente economica può diventare costosa se richiede:

- un team specializzato aggiuntivo;
- più ore di on-call;
- più incidenti;
- più coordinamento;
- più ambienti;
- più tempo per ogni change;
- una migrazione complessa in futuro.

## Costo visibile e costo differito

Alcune decisioni mostrano immediatamente il proprio prezzo.

```text
Service Bus Premium
→ costo mensile visibile
```

Altre lo differiscono.

```text
nessun ownership boundary
→ costo futuro di modifica

nessun test di recovery
→ costo futuro durante il disaster

shared database senza semantica di ownership
→ costo futuro di separazione

agent AI senza guardrail
→ costo futuro di verifica e incident response
```

Questo rende i costi indiretti particolarmente pericolosi.

La fattura cloud arriva ogni mese.

La fattura della complessità arriva spesso quando abbiamo meno possibilità di negoziarla.

> **Il costo più facile da ignorare è quello che non viene ancora fatturato.**

## Fixed, variable e step cost

Non tutti i costi crescono allo stesso modo.

### Fixed cost

Costo che sosteniamo anche con poco traffico.

Esempi:

- baseline minima di un cluster;
- licenza piattaforma;
- team necessario per operare una tecnologia;
- environment permanente.

### Variable cost

Cresce con l'uso.

Esempi:

- request;
- token;
- GB trasferiti;
- messaggi;
- storage consumato;
- execution time.

### Step cost

Resta relativamente stabile fino a quando un threshold ci obbliga ad aggiungere un nuovo gradino di capacità o complessità.

Esempi:

```text
1 database
→ sufficiente

volume cresce
→ read replica

volume cresce ancora
→ partitioning / sharding / nuovo team operativo
```

Questa forma è importante perché molte architetture sembrano economiche fino al punto in cui attraversano un confine.

## Il costo deve avere un owner

Se nessuno è responsabile di capire il costo di un workload, la spesa diventa facilmente un effetto collaterale.

La FinOps Foundation usa il principio della ownership della technology usage e tratta allocation, architecting, workload placement e unit economics come capability che richiedono collaborazione fra Engineering, Product, Finance e FinOps.

Fonti:

- [FinOps Framework](https://www.finops.org/framework/)
- [FinOps — Architecting & Workload Placement](https://www.finops.org/framework/capabilities/architecting-workload-placement/)

Non significa che Finance debba approvare ogni query.

Significa che gli engineer devono poter rispondere a domande come:

- quali sono i principali cost driver?
- che cosa compra il tier Premium?
- quanto costa mantenere due sistemi durante la migrazione?
- quale metrica di business cresce insieme al costo?
- quale spesa aumenta senza aumentare il valore?
- quale costo stiamo pagando per optionality che forse non useremo mai?

## Il compromesso ESI

Order Operations ha accumulato proprietà costose ma motivate:

```text
private networking
zone redundancy
managed PostgreSQL
Service Bus Premium
observability
legacy coexistence
```

Finance chiede di ridurre il run rate.

Security risponde che Private Link non è decorativo.

Reliability ricorda che due istanze e zone redundancy proteggono target espliciti.

Operations non vuole perdere telemetry necessaria per diagnosticare i failure.

Commerce & Operations non vuole che il progetto si trasformi in una piattaforma costosissima per una console interna.

Quindi il compromesso non sarà:

> **tagliamo il 20%.**

Sarà:

> **costruiamo un modello che renda visibile quale proprietà compra ogni costo, quali costi crescono con il business e quali stanno crescendo senza produrre valore.**

Il quality floor resta invariato:

```text
tenant isolation
correctness
security boundary
required reliability
recovery
minimum operability
```

Se una ottimizzazione rompe una di queste proprietà, non è automaticamente un successo perché la fattura scende.

## Una regola per il resto del libro

Nei capitoli successivi entreranno repository AI-ready, agenti, inference, model routing e sistemi AI dentro il prodotto.

Anche lì useremo lo stesso principio.

Un modello più economico che richiede tre retry, più verifica umana e produce più failure può essere più costoso per outcome.

Un modello più caro per token può essere economicamente migliore se riduce il costo complessivo del task.

Per questo non ottimizzeremo soltanto:

```text
cost per resource
```

ma, quando possibile:

```text
cost per useful outcome
```

La FinOps Foundation include infatti sia resource-efficiency unit metric — per esempio costo per GB, seat o token — sia business unit metric come costo per transazione, tenant o servizio erogato.

Fonte:

- [FinOps Framework — Unit Economics](https://www.finops.org/framework/capabilities/unit-economics/)

> **Spendere meno non è un outcome architetturale. Ottenere il valore necessario con un costo sostenibile lo è.**