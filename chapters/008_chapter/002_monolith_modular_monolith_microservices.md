## Monolite, modular monolith e microservizi

Monolite, modular monolith e microservizi vengono spesso raccontati come gradini di una scala evolutiva:

```text
monolite
→ modular monolith
→ microservizi
```

Questa immagine è seducente perché trasforma una decisione complessa in una storia di maturità: si parte semplici, si diventa modulari e infine si arriva alla distribuzione.

Ma le tre forme non sono livelli.

Sono **topologie con trade-off differenti**.

La maturità non dipende da quanto il sistema sia distribuito. Dipende dalla capacità di collegare quella distribuzione a proprietà che il sistema deve realmente ottenere.

## Il monolite compra località

In un monolite il software principale viene costruito e distribuito come un singolo deployable.

Questa caratteristica riduce alcune categorie di complessità. Molte chiamate restano function call locali. Le transazioni possono attraversare più dati nello stesso datastore senza introdurre coordinamento distribuito. Debugging e tracing possono essere più lineari e il modello operativo parte da un numero ridotto di unità da rilasciare e osservare.

Questo non rende il design automaticamente buono.

Se il codice non contiene boundary intenzionali, la località può trasformarsi in accesso indiscriminato. Qualunque modulo importa qualunque altro, tutti leggono le stesse tabelle e ogni feature diffonde conoscenza in punti diversi.

Il problema non è la function call locale.

È che non esiste una regola su chi abbia il diritto di farla.

## Il modular monolith compra confini senza comprare ancora rete

Il **modular monolith** conserva un deployable condiviso ma tratta i confini interni come decisioni architetturali vere.

Possiamo avere:

```text
Application
├── Orders
├── Payments
├── Shipping
└── Identity
```

Ogni modulo possiede comportamento e modello, espone capability intenzionali e nasconde i propri dettagli. Le dipendenze vengono controllate e, dove possibile, architecture test o lint rule impediscono accessi che il design considera illegittimi.

La separazione fisica rimane debole.

La separazione semantica può essere molto forte.

Questa forma è particolarmente interessante quando il dominio ha già responsabilità distinte, ma non esiste ancora un bisogno sufficiente di deploy indipendente, scaling differenziato o failure isolation tramite processi separati. In quel caso possiamo ottenere modularità senza pagare tutta la distribuzione.

Il vantaggio strategico è che un confine credibile può essere estratto in seguito, se il contesto cambia.

## I microservizi comprano autonomia operativa

Con i **microservizi**, alcuni boundary diventano unità di deployment autonome.

La parola chiave non è “piccoli”.

È **autonomi**.

Un servizio può avere una propria cadence di rilascio, scalare indipendentemente, possedere storage e security boundary distinti e permettere a un team di modificare una capability senza ricostruire l'intera applicazione.

Queste proprietà sono preziose quando il problema le richiede.

Ma non sono garantite dalla topologia.

Se due servizi devono essere sempre rilasciati insieme, non abbiamo reale deploy independence. Se condividono lo stesso schema dati e lo modificano entrambi, la data ownership rimane ambigua. Se ogni request attraversa una catena sincrona di servizi obbligatori, il failure isolation può essere minimo. Se ogni cambiamento richiede il consenso di molti team, l'autonomia organizzativa rimane teorica.

Il confine operativo ha valore soltanto se cambia davvero il modo in cui il sistema può essere costruito, rilasciato, scalato o fatto fallire.

## Un continuum, non tre scatole

Nella pratica esistono molte configurazioni intermedie:

```text
singolo deployable + singolo database
singolo deployable + ownership logica per schema
singolo deployable + alcuni worker separati
più deployable + database condiviso con ownership distinta
alcuni servizi estratti + nucleo modulare
più servizi + storage separato
```

Queste forme non devono per forza ricevere un'etichetta perfetta.

È più utile chiederci quali boundary siano logici e quali anche operativi.

Possiamo pensare a due assi.

Il primo riguarda il significato:

```text
responsabilità
ownership
contratti
modello
```

Il secondo riguarda l'esercizio:

```text
deploy
processo
runtime
storage
failure domain
scaling
```

Una decisione matura costruisce prima il primo asse e aggiunge il secondo quando produce valore sufficiente.

> **Non distribuire per ottenere modularità se puoi ottenere modularità senza distribuire. La distribuzione deve comprare qualcosa in più.**

## Evidenze metodologiche

Microsoft Azure Architecture Center tratta gli architecture style come insiemi di vincoli con benefici e sfide specifiche, non come una scala di maturità. La documentazione sui microservizi evidenzia deploy indipendente, fault isolation, scaling e data autonomy, ma anche la maggiore complessità di service discovery, consistenza e operation: [Microsoft Learn — Architecture styles](https://learn.microsoft.com/azure/architecture/guide/architecture-styles/) e [Microsoft Learn — Microservices architecture style](https://learn.microsoft.com/azure/architecture/microservices/).

La stessa documentazione sottolinea che definire correttamente i service boundary non è un processo meccanico e richiede domain analysis, requisiti e architecture characteristics: [Microsoft Learn — Use domain analysis to model microservices](https://learn.microsoft.com/azure/architecture/microservices/model/domain-analysis).

Queste fonti non dimostrano che il modular monolith sia sempre preferibile o che i microservizi debbano arrivare tardi.

Supportano il criterio che useremo nel capitolo: **prima il boundary e le proprietà richieste, poi la topologia che ha il fit migliore**.