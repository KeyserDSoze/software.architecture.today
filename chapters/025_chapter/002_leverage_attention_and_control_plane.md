# Leverage, attention e control plane

Il vantaggio più evidente dell’AI nello sviluppo software è la capacità di delegare execution. Se però continuiamo a leggere la produttività come semplice volume di output, rischiamo di aumentare proprio la parte del sistema che era già diventata meno scarsa.

La ricerca SPACE sulla developer productivity nasce anche da questa critica: activity non coincide con productivity. Il framework considera insieme Satisfaction and well-being, Performance, Activity, Communication and collaboration, Efficiency and flow.

Fonte:

- [Microsoft Research / ACM Queue — The SPACE of Developer Productivity](https://www.microsoft.com/en-us/research/publication/the-space-of-developer-productivity-theres-more-to-it-than-you-think/)

Per un One-Man Project la distinzione è decisiva. Una persona con molti agenti può aumentare commit, candidate change e task completati mentre peggiorano review latency, cognitive load, recoverability e qualità delle decisioni.

> **Il leverage non è quanto output possiamo generare. È quanta execution possiamo trasformare in outcome verificati senza perdere comprensione e controllo.**

## Il limite si sposta dal data plane al control plane

Durante il libro abbiamo costruito progressivamente ciò che rende l’execution delegabile: functional semantics, canonical context, work item, environment riproducibile, test veloci, higher-fidelity evidence, fitness function e boundary di permission.

Questa foundation permette agli agenti di lavorare bene proprio perché molte decisioni non devono essere reinventate durante l’execution.

Nel data plane possiamo quindi avere più attività contemporanee: un agente prepara una modifica locale, un altro esegue una discovery, un verifier controlla evidence, un documentation synchronizer aggiorna gli artifact dopo una decisione già presa.

Il control plane deve però assorbire le conseguenze di tutto questo lavoro. Quale task ha realmente soddisfatto l’outcome? Quale finding apre una decisione nuova? Quale limitation impedisce di considerare il risultato Verified? Quale change attraversa un domain o security boundary?

Immaginiamo cinque agenti che terminano quasi nello stesso momento. L’execution è completata, ma il lead riceve cinque nuovi pacchetti cognitivi da comprendere. Se la capacità di generazione cresce più rapidamente della capacità di review e decisione, il sistema entra nello stato:

```text
execution throughput
>
decision + verification throughput
```

Aggiungere un sesto agente non risolve il problema. Aumenta la queue.

> **Gli agenti possono trasformare lavoro in backlog più velocemente di quanto una persona riesca a trasformare quel backlog in decisioni.**

## L’attention budget non si misura in numero di file

Ogni task delegato consuma una quota di attenzione futura: bisogna ricaricare context, leggere evidence, capire contradiction, decidere eventuali follow-up, accettare rischio e chiudere il lavoro.

La quantità di attenzione non è proporzionale alla dimensione del diff. Un rename locale può toccare molti file ed essere quasi meccanico. Un cambiamento a una retry policy può modificare una singola funzione e richiedere comprensione di failure semantics, API contract, consumer behavior, observability e cost.

Per questo nel One-Man Project ci interessa il **decision surface** del task, non soltanto il change surface.

ESI usa una classificazione semplice per rendere visibile questa differenza:

```text
T0  Mechanical
T1  Local behavioral
T2  Cross-boundary
T3  Decision-changing
```

Non è uno standard generale. È un linguaggio operativo. Un T0 può essere delegato con poco controllo aggiuntivo; un T2 attraversa API, database, messaging, security o cloud boundary e consuma più review; un T3 apre business semantics, ownership, external compatibility o una one-way door e richiede un decision owner esplicito.

Il valore della classificazione è ricordare che due task di uguale dimensione possono avere costi di governance radicalmente diversi.

## WIP: limitare la generazione per proteggere la decisione

Con gli agenti il work in progress può esplodere perché il costo di **iniziare** un task diventa molto basso. Ma il costo di terminarlo bene rimane legato alla capacità del control plane.

ESI sceglie quindi per il pilot un limite iniziale:

```text
Max active execution tasks       2
Max active cross-boundary tasks  1
Max unresolved semantic gates    1
```

Questi numeri non sono benchmark né best practice universali. Sono un’ipotesi operativa da sottoporre a evidence.

La regola importante è un’altra:

> **Il parallelismo deve essere limitato dalla capacità di verificare e decidere, non dalla capacità tecnica di avviare agenti.**

Se il review backlog cresce, non “risolviamo” aggiungendo execution. Smettiamo di lanciare nuovo lavoro, riduciamo WIP o miglioriamo task preparation e verification.

Questo è uno dei cambiamenti più controintuitivi dell’AI-native engineering: una queue di task pronti è una capacità utile anche quando scegliamo deliberatamente di non saturarla.

## Il rischio della giornata trasformata in agent polling

Esiste una forma di produttività apparente molto facile da ottenere:

```text
launch
→ check
→ reply
→ repair
→ launch
→ check
→ reply
```

Il lead sembra sempre occupato e il sistema produce continuamente output. Nel frattempo può scomparire il tempo necessario per parlare con utenti, studiare un failure difficile, comprendere un dominio o ragionare su una nuova architettura.

Questo sarebbe un deskilling diverso da quello discusso per il coding: non perdere la capacità di scrivere codice, ma perdere la capacità di **pensare abbastanza a lungo su un problema importante**.

La promessa del leverage dovrebbe essere il contrario. Delegare execution libera capacità cognitiva per le decisioni che non vogliamo delegare. Se ogni minuto liberato viene immediatamente riempito con altro lavoro generato, il sistema ottimizza activity e consuma il proprio control plane.

Per questo batching, review window, async queue e protected deep work non sono dettagli di personal productivity. Sono parti dell’operating model.

## Misurare outcome, non saturazione

Una metrica come `PR per engineer` può essere un activity signal. Non può dirci se il One-Man Project sta funzionando.

Dobbiamo leggere insieme almeno outcome verificato, lead time, rework, escaped defect, review backlog, unresolved decision age, operator/customer outcome, cost per verified outcome e continuity risk.

Se aumentano task completati ma cresce anche il rework, il sistema ha guadagnato velocità di proposta e perso velocità di accettazione. Se l’execution è abbondante ma le decisioni restano aperte per giorni, il collo di bottiglia è visibile. Se il lead diventa l’unica persona capace di interpretare ogni bundle, il leverage è stato comprato con fragilità.

La research SPACE ci aiuta proprio a evitare la scorciatoia “più activity = più productivity”.

> **Il progetto scala quando una persona riesce a governare più outcome verificati, non quando riesce ad avviare più lavoro.**
