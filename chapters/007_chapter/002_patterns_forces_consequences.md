## Problema, forze, struttura, conseguenze

Un pattern diventa davvero utile quando lo leggiamo come una relazione tra quattro elementi:

```text
problema
→ forze
→ struttura
→ conseguenze
```

Il nome viene dopo. Questa sequenza è importante perché ci impedisce di copiare una forma senza avere il problema che la rende sensata.

## Il problema è una tensione, non un'etichetta

Un buon problem statement descrive qualcosa che il design attuale fatica a gestire. Potremmo voler sostituire un algoritmo senza modificare i consumer, isolare un contratto esterno, disaccoppiare producer e consumer nel tempo oppure evitare che una dipendenza degradata saturi risorse condivise.

La domanda è sempre concreta: **quale costo, rischio o rigidità stiamo cercando di ridurre?**

Se non riusciamo a dirlo senza nominare il pattern, probabilmente siamo ancora troppo presto.

## Le forze spiegano perché il problema non è banale

Le forze tirano la soluzione in direzioni diverse:

```text
bassa latency
vs
isolamento

semplicità
vs
estendibilità

consistency immediata
vs
disponibilità

indipendenza
vs
visibilità globale

velocità di delivery
vs
reversibilità
```

Il pattern non elimina queste tensioni. Propone un modo ricorrente di pagarle.

Questa distinzione è essenziale: quando adottiamo una queue non “eliminiamo coupling”; riduciamo una forma di coupling temporale e compriamo delivery semantics, ordering, backlog e operability. Quando introduciamo un Adapter non eliminiamo il provider: localizziamo la sua semantica e paghiamo mapping e un layer aggiuntivo.

## La struttura è la parte più facile da copiare

Strategy può diventare un'interfaccia con più implementazioni, Adapter un wrapper, una queue un producer-broker-consumer e un circuit breaker una macchina a stati `closed`, `open`, `half-open`.

Questa parte è facile da generare, disegnare e riconoscere. È anche la meno interessante se non sappiamo che cosa stia comprando.

Un'implementazione formalmente corretta del pattern può essere completamente inutile quando le forze non esistono.

## Le conseguenze rendono credibile la scelta

Prendiamo un Adapter. Può proteggere il modello interno da un'API esterna, concentrare mapping ed error handling e rendere più locale un cambio di provider. Ma può anche duplicare modelli, nascondere capability importanti e degenerare in un pass-through che aggiunge debugging senza comprare indipendenza.

La stessa struttura può quindi essere eccellente o decorativa. È il bilancio tra conseguenze e forze a determinarne il fit.

> **Un pattern senza conseguenze negative dichiarate è spesso una descrizione incompleta del pattern.**

## Pattern come ipotesi progettuale

Possiamo trattare una scelta significativa come un'ipotesi:

> “Crediamo che questo pattern riduca il rischio X pagando i costi Y e Z. Lo manterremo finché le forze che lo giustificano rimangono vere.”

In questo modo il pattern entra nello stesso sistema di decisioni degli ADR. Può avere evidence, review trigger e perfino un criterio di rimozione.

Questa mentalità è particolarmente importante per pattern che modificano il sistema intero. Una Strategy locale può essere sostituita con costo contenuto; event sourcing, saga distribuita, CQRS con read model separato o service mesh cambiano dati, failure, deployment, observability e competenze operative. Chiamarli tutti “pattern” non deve appiattire il loro peso decisionale.

## Pattern Justification

Per una scelta non banale possiamo usare un piccolo artefatto:

```text
Pattern candidate:

Observed problem:

Evidence:

Forces:

Expected benefit:

Complexity introduced:

Simpler alternatives:

Operational consequences:

Review / removal trigger:
```

Se `Observed problem` ed `Evidence` sono vaghi ma il nome del pattern è molto preciso, abbiamo probabilmente iniziato dalla parte sbagliata.

> **Il pattern non è la risposta. È una risposta possibile quando le forze del problema la rendono conveniente.**
