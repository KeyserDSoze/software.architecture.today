## Confini: decidere che cosa stiamo osservando

Ogni sistema ha un confine.

Ma quel confine non è sempre ovvio.

Quando diciamo “il sistema ordini”, stiamo parlando soltanto del codice che gestisce gli ordini?

Oppure includiamo il database?

Il payment provider?

Il sistema logistico?

L'identity provider?

Il frontend?

La risposta dipende dalla domanda che stiamo facendo.

Questo è il primo principio importante:

> **Il confine di un sistema è una scelta di osservazione prima ancora che una scelta tecnica.**

## Confini diversi per domande diverse

Se vogliamo capire perché una query è lenta, possiamo osservare un perimetro ristretto:

```text
API → query → database
```

Se vogliamo capire perché un cliente vede uno stato ordine incoerente, dobbiamo probabilmente allargare:

```text
frontend
→ API ordini
→ database
→ payment provider
→ sistema logistico
→ eventi
→ read model
```

Se vogliamo capire l'impatto economico di un outage, il sistema può includere anche:

- customer support;
- processi manuali;
- SLA;
- revenue;
- comunicazione verso i clienti.

Il sistema rilevante cambia con la decisione.

### System of interest

Può essere utile distinguere il **system of interest** dal suo ambiente.

Il system of interest è ciò che stiamo progettando, modificando o analizzando direttamente.

L'ambiente contiene tutto ciò che interagisce con esso ma che non controlliamo nello stesso modo.

Per Acme Orders, in una certa fase, il system of interest potrebbe essere:

```text
Acme Orders application
```

Mentre l'ambiente comprende:

```text
Customer
Payment provider
Email provider
Identity provider
Warehouse system
Support operator
```

Questi elementi non sono “fuori dal problema”.

Sono fuori dal nostro controllo diretto.

Ed è proprio questo che li rende architetturalmente importanti.

## Una dipendenza esterna è una decisione interna

Quando integriamo un servizio esterno stiamo introducendo nel nostro sistema caratteristiche che non controlliamo:

- availability;
- latency;
- rate limit;
- semantic versioning;
- pricing;
- error model;
- authentication;
- retention;
- compliance;
- support policy.

Il fatto che un componente sia esterno non elimina la sua influenza sull'architettura.

Anzi, spesso la aumenta.

Se il payment provider impiega trenta secondi a rispondere durante un degrado, il nostro sistema deve decidere che cosa fare in quei trenta secondi.

Se il provider invia webhook duplicati, dobbiamo gestirli.

Se il servizio non è disponibile, dobbiamo scegliere se bloccare, degradare, mettere in coda o rinviare.

> **Non controlliamo la dipendenza, ma controlliamo il modo in cui dipendiamo da essa.**

## Confini di responsabilità

Un buon confine non dice soltanto dove si trova il codice.

Dice chi è responsabile di una decisione.

Prendiamo lo stato di pagamento di un ordine.

Dove vive la verità?

Nel servizio ordini?

Nel provider di pagamento?

In un ledger interno?

In una proiezione aggiornata tramite webhook?

Ogni risposta produce conseguenze diverse.

Se due componenti ritengono entrambi di essere autorevoli, prima o poi divergeranno.

Se nessuno è autorevole, ogni lettura diventa una negoziazione.

Per questo una domanda semplice ma potente è:

> **Chi possiede questa decisione?**

Non soltanto:

> “Dove salviamo questo dato?”

Ownership e storage non sono necessariamente la stessa cosa.

## Confini tecnici e confini di dominio

Le cartelle di un repository possono essere organizzate per tecnologia:

```text
controllers/
services/
repositories/
models/
```

Questo può essere perfettamente ragionevole.

Ma non dobbiamo confondere questi layer con i confini del dominio.

Un dominio può contenere concetti come:

```text
Orders
Payments
Fulfillment
Returns
Pricing
Customers
```

La domanda architetturale è quale responsabilità appartenga a quale area e quali contratti esistano tra di esse.

Il framework utilizzato non dovrebbe decidere automaticamente questi confini.

Questa è una forma comune di **framework-driven architecture**: la struttura tecnica diventa accidentalmente la struttura concettuale del sistema.

## Confini e cambiamento

Un confine utile riduce il numero di cose che devono cambiare insieme.

Se una modifica alla logica di pricing richiede toccare:

- frontend;
- tre servizi;
- schema condiviso;
- pipeline analytics;
- script di deployment;

potremmo avere un confine debole.

Non sempre.

Alcuni cambiamenti sono naturalmente trasversali.

Ma il pattern merita attenzione.

Una delle domande migliori per valutare un confine è:

> **Quali cambiamenti vogliamo poter fare senza coordinare mezzo sistema?**

Questo sposta la discussione dalle “scatole” alla **changeability**.

## Confini e agenti

I confini hanno un valore particolare nel lavoro con gli agenti.

Un agente a cui assegniamo un task entro un confine chiaro può operare con maggiore autonomia.

Un agente che deve modificare contemporaneamente cinque aree con ownership diverse dovrebbe ricevere più contesto, più review e probabilmente stop condition più strette.

Possiamo usare i confini anche come permission boundary:

```text
Agent A → può modificare orders/*
Agent B → può modificare UI e contract client
Agent C → review-only su security/*
```

Ma attenzione: un confine di filesystem non equivale automaticamente a un confine architetturale.

Se due directory condividono schema, stato o side effect, il coupling continua a esistere.

## Il test del confine

Quando definiamo un confine, possiamo chiederci:

- quale responsabilità contiene?
- quale responsabilità esclude?
- quali dati possiede?
- quali decisioni può prendere autonomamente?
- da chi dipende?
- chi dipende da lui?
- come comunica?
- come fallisce?
- come evolve?
- quale cambiamento dovrebbe poter assorbire senza propagarsi?

Un confine non è buono perché è elegante nel diagramma.

È buono quando rende il sistema più comprensibile e il cambiamento più governabile.

> **Un confine architetturale serve a contenere responsabilità, decisioni e conseguenze. Non soltanto codice.**
