## Il distributed monolith

Il distributed monolith è uno dei fallimenti più costosi della migrazione a microservizi.

Perché combina molti costi della distribuzione con pochi dei suoi vantaggi.

Può avere:

- molti repository;
- molti deployable;
- molte pipeline;
- molte chiamate di rete;
- molti dashboard;

ma continuare a richiedere coordinamento quasi totale.

### Come nasce

Spesso nasce da una separazione fisica applicata prima di aver costruito confini logici forti.

Per esempio:

```text
Orders Service
Payments Service
Shipping Service
```

sembrano indipendenti.

Poi scopriamo che:

- condividono lo stesso schema dati;
- usano DTO interni comuni pubblicati come package;
- una modifica richiede deploy coordinati;
- le chiamate sono sincrone e profonde;
- una transazione di business attraversa più servizi senza strategie esplicite di failure;
- gli stessi team devono approvare ogni modifica;
- i test end-to-end sono l'unico modo per capire se il sistema funziona.

Abbiamo distribuito la topologia senza distribuire realmente l'autonomia.

### Shared database come segnale

Un database condiviso non rende automaticamente il sistema un distributed monolith.

Ma è un segnale importante quando più servizi leggono e modificano direttamente le stesse tabelle.

In quel caso il contratto reale non è l'API.

È lo schema del database.

E spesso è un contratto molto più difficile da evolvere.

Possiamo avere una fase intermedia in cui più deployable condividono la stessa istanza database ma mantengono ownership separata per schema o tabella.

È diverso da:

> “tutti possono toccare tutto.”

Ancora una volta, il tema è l'ownership.

### Shared library come accoppiamento nascosto

Anche una libreria condivisa può trasformarsi nel bus invisibile del distributed monolith.

Supponiamo di pubblicare un package comune che contiene DTO, domain object, validation, persistence model e perfino business rule. Sembra un modo semplice per evitare duplicazione, ma può trasformare un confine di servizio in una dipendenza di release condivisa.

Ogni servizio lo importa.

Una modifica al package richiede aggiornamenti sincronizzati.

Abbiamo spostato coupling dalla rete al package manager.

Una shared library è utile quando condivide capacità realmente generiche.

È pericolosa quando condivide **significato di dominio che dovrebbe avere un owner**.

### Chatty architecture

Un altro segnale è l'eccesso di chiamate sincrone.

Per completare una richiesta:

```text
A → B → C → D → E
```

Ogni hop aggiunge latency e probabilità di failure, un timeout da configurare, tracing da ricostruire e una nuova capacity dependency. Una catena lunga rende il sistema più fragile anche quando ogni singolo servizio è localmente semplice.

Se il comportamento richiede coordinamento così stretto, potremmo aver separato componenti che in realtà cambiano e operano come un'unità.

Non sempre.

Ma dobbiamo almeno porci la domanda.

### Coordinated deploy

Un test semplice è osservare i rilasci.

Se per una feature dobbiamo quasi sempre fare:

```text
release A
release B
release C
```

nello stesso ordine e nella stessa finestra, i servizi potrebbero non essere davvero independently deployable.

A volte è inevitabile durante una migrazione.

Il problema è quando diventa lo stato permanente.

### Distributed monolith e AI

Gli agenti rendono particolarmente facile creare distributed monolith.

Un agente può generare tre servizi, creare Dockerfile e manifest, configurare API, produrre client SDK e aggiungere tracing in pochissimo tempo;

in pochissimo tempo.

La struttura appare sofisticata.

Ma l'AI non ha automaticamente dimostrato che i boundary siano autonomi.

Quindi dobbiamo verificare proprietà sistemiche: se i servizi possano essere deployati indipendentemente, evolvere il modello interno senza coordinamento e possedere davvero i propri dati; se possano degradare indipendentemente e, soprattutto, se una modifica locale resti davvero locale.

Se la risposta è quasi sempre no, il numero di container non ci aiuta.

### La regola

> **Microservizi senza autonomia sono distribuzione senza rendimento.**

Prima di contare i servizi, contiamo le dipendenze che richiedono coordinamento.