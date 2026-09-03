## Principi prima dei rituali

Prima dei pattern vengono i principi.

Un principio non ci dice quale classe creare. Ci aiuta a valutare la direzione del design.

Per questo concetti come cohesion, coupling, information hiding e dependency inversion hanno più valore di qualsiasi catalogo di pattern.

Lo stesso vale per SOLID.

SOLID può essere molto utile come linguaggio di review.

Può anche diventare una liturgia capace di produrre codice più astratto del problema.

### Single Responsibility Principle

La formulazione più utile non è:

> “Una classe deve fare una sola cosa.”

Questa frase è troppo vaga.

Più interessante è ragionare sulle **ragioni di cambiamento**.

Se un componente cambia per motivi indipendenti — pricing, persistence, authorization, rendering — probabilmente contiene responsabilità troppo diverse.

Ma questo non significa che ogni responsabilità debba vivere in una classe separata.

La granularità dipende dal costo del cambiamento e dal contesto.

Un'applicazione piccola può mantenere responsabilità correlate nello stesso modulo senza violare alcun principio sostanziale.

### Open/Closed Principle

Essere “aperti all'estensione e chiusi alla modifica” non significa progettare ogni componente come un framework estensibile.

Se non esiste alcuna evidenza che una dimensione varierà, costruire extension point preventivi crea complexity debt.

La domanda utile è:

> “Quale variazione abbiamo ragione di aspettarci e quanto costa assorbirla?”

Se in Acme Orders abbiamo un solo provider di pagamento e nessun piano realistico per sostituirlo, un'astrazione sofisticata di plugin potrebbe essere prematura.

Se invece il business sa già che opererà in paesi con provider differenti, quella stessa astrazione può avere un ottimo fit.

### Liskov Substitution Principle

LSP diventa rilevante quando un'astrazione promette sostituibilità.

Il problema non è soltanto il tipo.

È il comportamento.

Se due implementazioni condividono un'interfaccia ma hanno semantiche incompatibili su timeout, errori, idempotenza o side effect, non sono veramente sostituibili dal punto di vista del sistema.

Questo è particolarmente importante con adapter verso servizi esterni.

La firma può essere identica mentre il comportamento operativo è completamente diverso.

### Interface Segregation Principle

Interfacce piccole possono ridurre coupling.

Ma spezzare indiscriminatamente ogni contratto produce decine di micro-interface che rendono difficile capire quale comportamento appartenga a chi.

Il criterio non è “più piccola è meglio”.

È:

> **il consumer deve dipendere soltanto dal contratto di cui ha davvero bisogno.**

### Dependency Inversion Principle

Abbiamo già visto che dependency inversion riguarda la direzione della conoscenza.

Il dominio non dovrebbe essere costretto a conoscere dettagli di infrastruttura che cambiano per ragioni indipendenti.

Ma anche qui l'interfaccia non è un feticcio.

Se creiamo un `IClock`, `IIdGenerator`, `ILogger`, `IRepository`, `IHttpClient`, `IConfigurationProvider` e altre venti astrazioni solo perché “SOLID”, possiamo finire con un sistema in cui leggere una funzione richiede navigare una foresta di indirezioni.

### SOLID come diagnostica

Un modo maturo di usare SOLID è come strumento diagnostico.

Durante una review possiamo chiedere:

- questo componente cambia per troppe ragioni indipendenti?
- stiamo rendendo costosa una variazione che sappiamo essere frequente?
- una implementazione rompe le aspettative del contratto?
- un consumer conosce più del necessario?
- una policy di business dipende da un dettaglio volatile?

Queste domande sono utili.

La checklist “una interface per ogni classe” non lo è.

### Il principio della semplicità sufficiente

In un sistema reale due obiettivi competono spesso:

```text
flessibilità futura
vs
semplicità presente
```

Non esiste una risposta universale.

Dobbiamo scegliere quanta struttura comprare oggi.

Il design migliore non è quello che supporta il maggior numero di estensioni immaginabili.

È quello che rende semplici i cambiamenti probabili senza rendere difficile il presente.

> **Un principio è una bussola. Quando diventa una procedura meccanica, smette di aiutarci a pensare.**
