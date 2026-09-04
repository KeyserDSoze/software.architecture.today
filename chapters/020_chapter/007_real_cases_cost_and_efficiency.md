# 20.7 — Casi reali: efficienza senza perdere il servizio

Un caso reale sul costo diventa interessante quando smette di raccontare soltanto “abbiamo speso meno” e ci mostra **quale driver è cambiato senza perdere la proprietà che contava**.

È la stessa disciplina usata in tutto il libro. Il numero finale può essere importante, ma l'architettura sta nella relazione fra meccanismo, rischio, quality floor ed evidence.

## Uber: right-sizing non significa minimizzare la CPU

Uber ha documentato un sistema di vertical CPU scaling usato per right-size workload storage containerizzati. Nel 2022 riportava oltre 500.000 container gestiti dal framework e una riduzione netta di oltre 120.000 core allocati, con risparmi annuali nell'ordine di milioni di dollari.

Fonte:

- [Uber Engineering — Vertical CPU Scaling: Reduce Cost of Capacity and Increase Reliability](https://www.uber.com/en-NL/blog/vertical-cpu-scaling/)

Il dato economico è notevole, ma la lezione architetturale è altrove. Il framework collega allocation, utilization, failure behavior e criticality del workload. Non prova a portare ogni container al minimo consumo possibile; prova a trovare una capacità coerente con il lavoro e con la reliability richiesta.

Questo è esattamente il problema discusso nel paragrafo precedente: utilization bassa non equivale automaticamente a waste e headroom non equivale automaticamente a capacità giustificata.

Il modello è:

```text
resource allocation
→ workload demand + failure behavior
→ safe capacity
→ remove avoidable excess
```

Non:

```text
resource allocation
→ minimum possible
```

Il titolo del caso è già un buon segnale: cost efficiency e reliability non vengono trattati come obiettivi necessariamente opposti.

## Uber Big Data: capire supply e demand

Uber ha descritto la propria Big Data platform come una delle superfici infrastrutturali più costose e ha costruito un framework che osserva tre dimensioni: platform efficiency, supply e demand.

Fonte:

- [Uber Engineering — Efficiently Managing the Supply and Demand on Uber's Big Data Platform](https://www.uber.com/us/en/blog/supply-demand-big-data-platform/)

La distinzione ci serve perché una sola leva non basta. Possiamo ridurre supply e comprimere un workload inefficiente senza correggerne il comportamento. Oppure possiamo ottimizzare una query mentre manteniamo una allocation strutturalmente eccessiva.

Il cost model deve quindi essere capace di spiegare sia **quanto mettiamo a disposizione** sia **come il workload consuma quella capacità**, includendo l'overhead della piattaforma che trasforma le due cose in outcome.

Per ESI questo evita, per esempio, di trattare il costo di App Service come un problema puramente di sizing quando una parte della curva potrebbe dipendere dal traffico, dai pattern di retry o dalla capacità richiesta per il failure scenario.

## Uber e la replica: non tutta la ridondanza compra lo stesso valore

In un altro caso Uber ha descritto un cambiamento alla propria architettura analitica per ridurre la replica completa dei dati. L'articolo riporta una riduzione complessiva del consumo di disco superiore al 30% mantenendo le proprietà di compute scalability e database availability richieste dal workload.

Fonte:

- [Uber Engineering — Solving Big Data Challenges with Data Science at Uber](https://www.uber.com/us/en/blog/solving-big-data-challenges-with-data-science-at-uber/)

Il messaggio utile non è “replicate less”. Sarebbe una generalizzazione pericolosa.

Il punto è chiedere, per ogni forma di ridondanza:

```text
what property does this copy buy?
which failure / locality / query requirement needs it?
what evidence says the current mechanism is still necessary?
```

Quando la risposta cambia, anche la topologia può cambiare. Ridurre una replica non è automaticamente ottimizzazione e aumentarla non è automaticamente reliability: entrambe le decisioni hanno senso soltanto rispetto alla proprietà acquistata.

## Uber: managed può cambiare il TCO, non soltanto la fattura

Uber ha inoltre raccontato la modernizzazione della propria piattaforma di artifact storage, precedentemente self-managed in due data center con replica e procedure operative complesse. La nuova direzione utilizza una piattaforma SaaS gestita insieme a un proxy più leggero; Uber descrive il cambiamento anche in termini di minore operational risk e migliore cost efficiency su larga scala.

Fonte:

- [Uber Engineering — Modernizing Artifact Storage at Uber](https://www.uber.com/us/en/blog/modernizing-artifact-storage/)

Questo caso rende concreto il limite del confronto fra SKU. Una soluzione managed può cambiare non soltanto infrastructure price, ma maintenance, rebalance, observability, incident handling e engineering ownership.

La domanda build-vs-buy diventa quindi:

> **Quale capacità vogliamo continuare a possedere internamente, e quel possesso è ancora la migliore allocazione di denaro e attenzione?**

Il provider price è una componente. Il focus organizzativo è un'altra.

## Le tre lezioni comuni

I casi hanno scale e tecnologie molto diverse da Order Operations. Non autorizzano ESI a costruire un autoscaler custom, ridurre replica o spostare ogni servizio verso SaaS.

Mostrano però una convergenza utile.

Prima di una cost optimization serve identificare il driver. Poi bisogna dichiarare la proprietà che non può essere sacrificata. Soltanto a quel punto ha senso cambiare il meccanismo e misurare se il nuovo stato conserva qualità e riduce davvero il TCO.

Possiamo sintetizzare così:

```text
cost signal
→ driver
→ property / quality floor
→ alternative mechanism
→ evidence
→ new baseline
```

Il saving arriva dopo questa catena, non prima.

## Perché separiamo ESI e i casi reali

ESI resta uno scenario simulato in cui possiamo rendere espliciti decisioni, trade-off ed evidence state. I casi Uber dimostrano che organizzazioni reali hanno dovuto affrontare problemi analoghi di capacity, ownership, redundancy e operational cost.

Non diremo quindi “Uber ha fatto X, dunque Order Operations deve fare X”. Diremo qualcosa di più serio: **una organizzazione competente ha dovuto imparare a misurare certe conseguenze; noi dobbiamo risolvere la stessa classe di problema nel nostro contesto.**

> **Il caso reale utile non ci dice quale tecnologia scegliere. Ci mostra quali conseguenze qualcuno ha dovuto rendere misurabili prima di poter ottimizzare con fiducia.**