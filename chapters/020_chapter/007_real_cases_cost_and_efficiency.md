# 20.7 — Casi reali: efficienza senza perdere il servizio

Un buon caso reale sul costo non dovrebbe raccontare soltanto:

> abbiamo speso meno.

Dovrebbe mostrare:

- quale cost driver è stato individuato;
- quale proprietà non poteva essere sacrificata;
- quale meccanismo è cambiato;
- quale rischio è stato introdotto o ridotto;
- quale evidence ha permesso di procedere.

## Uber — right-sizing di centinaia di migliaia di workload

Uber ha documentato un sistema di vertical CPU scaling usato per right-size workload storage containerizzati.

Nel 2022 riportava oltre 500.000 container gestiti dal framework e una riduzione netta di oltre 120.000 core allocati, con risparmi annuali nell'ordine di milioni di dollari.

Ma il punto architetturale più interessante non è il numero.

Uber descrive un processo che collega allocation, utilization, failure behavior e criticality dei cluster.

L'obiettivo non era:

```text
CPU allocation → minimum possible
```

Era:

```text
CPU allocation
→ enough for workload + reliability behavior
→ no unnecessary reserved capacity
```

Fonte:

- [Uber Engineering — Vertical CPU Scaling: Reduce Cost of Capacity and Increase Reliability](https://www.uber.com/en-NL/blog/vertical-cpu-scaling/)

Il titolo stesso è interessante: **cost e reliability non sono trattati come obiettivi necessariamente opposti**.

Un sizing più coerente può ridurre spreco e, contemporaneamente, rendere più consistente il comportamento della piattaforma.

Questo è un buon antidoto alla formula:

```text
cost optimization = fewer resources
```

A volte significa:

```text
better resource model
```

## Uber Big Data — supply, demand e piattaforma

Uber ha descritto la propria Big Data platform come una delle componenti infrastrutturali più costose e ha costruito un framework basato su tre aree:

```text
platform efficiency
supply
 demand
```

con l'obiettivo di comprendere sia come veniva fornita capacità sia come i workload la consumavano.

Fonte:

- [Uber Engineering — Efficiently Managing the Supply and Demand on Uber's Big Data Platform](https://www.uber.com/us/en/blog/supply-demand-big-data-platform/)

È una distinzione utile per il nostro modello.

Possiamo ottimizzare:

### Supply

```text
quanto provisioning mettiamo a disposizione
```

### Demand

```text
quanto e come i workload chiedono risorse
```

### Platform efficiency

```text
quanto overhead esiste nel trasformare supply in outcome
```

Se lavoriamo soltanto sulla supply, rischiamo di comprimere una domanda inefficiente senza correggerla.

Se lavoriamo soltanto sulla domanda, possiamo lasciare allocazioni strutturalmente sbagliate.

## Uber — partial replication per ridurre storage

In un altro caso Uber ha documentato una modifica alla propria architettura analitica per ridurre la replica completa dei dati.

La soluzione riportata riduceva il consumo complessivo di disco di oltre il 30% mantenendo compute scalability e database availability richiesti dal workload.

Fonte:

- [Uber Engineering — Solving Big Data Challenges with Data Science at Uber](https://www.uber.com/us/en/blog/solving-big-data-challenges-with-data-science-at-uber/)

La lezione non è:

> replicate less.

È:

> **capire quale ridondanza compra davvero una proprietà e quale ridondanza è diventata un costo senza valore proporzionato.**

Nel nostro linguaggio:

```text
replication
→ property purchased?
→ failure / query / locality requirement?
```

Se la risposta cambia, anche la topologia può cambiare.

## Uber — modernizzare artifact storage

Nel 2026 Uber ha raccontato la modernizzazione della propria piattaforma di artifact storage, precedentemente self-managed in due data center con più nodi, replica e procedure operative complesse.

La nuova direzione usa una piattaforma SaaS gestita insieme a un proxy leggero; Uber descrive il risultato come una riduzione dell'operational risk e una maggiore cost efficiency su larga scala.

Fonte:

- [Uber Engineering — Modernizing Artifact Storage at Uber](https://www.uber.com/us/en/blog/modernizing-artifact-storage/)

Il caso è interessante perché mostra una cosa che il semplice confronto di fatture può nascondere.

Una soluzione managed può essere economicamente migliore non soltanto per il prezzo dell'infrastruttura, ma perché cambia:

```text
maintenance
manual rebalance
operational risk
observability
engineering ownership
```

Quindi:

> **Build vs buy è una decisione di TCO e focus organizzativo, non un confronto fra costo unitario di hardware e costo della subscription.**

## Non trasformare i casi in ricette

Uber ha scala, sistemi e vincoli che ESI non possiede necessariamente.

Questi casi non autorizzano Order Operations a costruire un autoscaler personalizzato o migrare ogni capability verso SaaS.

Servono a verificare un principio più generale:

```text
cost optimization
≠ indiscriminate reduction

cost optimization
= understand driver
  + preserve required property
  + change the mechanism
  + measure outcome
```

## Come useremo i casi reali

Nel libro continueremo a separare:

```text
ESI
→ scenario simulato dove prendiamo la decisione

real engineering case
→ evidence che mostra proprietà e trade-off in un sistema reale
```

Non diremo:

> Uber ha fatto X, quindi dobbiamo fare X.

Diremo:

> Uber mostra che una grande organizzazione ha dovuto rendere esplicito il rapporto fra capacità, reliability, operational effort e costo; noi dobbiamo risolvere lo stesso tipo di domanda nel nostro contesto, non copiare la stessa soluzione.

## Corollario

> **Il caso reale utile non ci dice quale tecnologia scegliere. Ci mostra quali conseguenze qualcuno ha dovuto imparare a misurare.**