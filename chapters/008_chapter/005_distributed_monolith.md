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

Supponiamo di pubblicare un package comune con:

- DTO;
- domain object;
- validation;
- persistence model;
- business rule.

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

Ogni hop aggiunge:

- latency;
- probabilità di failure;
- timeout da configurare;
- tracing da ricostruire;
- capacity dependency.

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

Un agente può:

- generare tre servizi;
- creare Dockerfile;
- produrre manifest;
- configurare API;
- generare client SDK;
- aggiungere tracing;

in pochissimo tempo.

La struttura appare sofisticata.

Ma l'AI non ha automaticamente dimostrato che i boundary siano autonomi.

Quindi dobbiamo verificare proprietà sistemiche:

- possono essere deployati indipendentemente?
- possono evolvere il modello interno senza coordinamento?
- possiedono davvero i dati?
- possono degradare indipendentemente?
- una modifica locale resta locale?

Se la risposta è quasi sempre no, il numero di container non ci aiuta.

### La regola

> **Microservizi senza autonomia sono distribuzione senza rendimento.**

Prima di contare i servizi, contiamo le dipendenze che richiedono coordinamento.