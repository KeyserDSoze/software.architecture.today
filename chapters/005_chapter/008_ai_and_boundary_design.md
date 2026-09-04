## AI e boundary design

L'AI può essere estremamente efficace nel proporre strutture di progetto.

Chiediamo:

> “Organizza questo repository secondo clean architecture.”

oppure:

> “Dividi questo monolite in moduli.”

E in pochi secondi possiamo ottenere nuove cartelle, interfacce e adapter, use case e dependency injection, test e diagrammi. Il risultato può apparire molto professionale.

Ma c'è una domanda più importante:

> **i confini riflettono davvero il problema o soltanto un pattern riconoscibile dal modello?**

### Pattern-shaped architecture

Un agente ha visto moltissimi esempi di strutture come:

```text
domain/
application/
infrastructure/
interfaces/
```

oppure:

```text
controllers/
services/
repositories/
```

oppure microservizi organizzati per business capability.

Può quindi produrre rapidamente una struttura plausibile.

Ma una struttura plausibile non è necessariamente una struttura adatta.

Se il contesto è povero, l'agente tende a riempire i vuoti con convenzioni statisticamente comuni.

Questa è una forma di **architecture by prior**.

Il sistema assume la forma degli esempi conosciuti invece che delle forze reali del problema.

### Chiedere prima il reasoning surface

Prima di chiedere una ristrutturazione, è spesso più utile chiedere all'agente di produrre una diagnosi.

Per esempio:

> “Identifica le principali responsabilità presenti nel repository. Per ciascuna, indica file coinvolti, dati posseduti, dipendenze, regole duplicate e punti di change coupling. Non proporre ancora una nuova struttura.”

Questa richiesta separa:

```text
comprensione
→ proposta
```

invece di fondere tutto in un singolo refactoring.

È coerente con il metodo del libro.

### Boundary discovery con evidenza

Un agente può cercare segnali come:

- import graph;
- chiamate tra package;
- tabelle usate da più aree;
- termini di dominio ricorrenti;
- history dei file;
- test che attraversano più componenti;
- ownership CODEOWNERS;
- API interne;
- eventi;
- feature flag;
- configurazioni.

Ma ogni boundary hypothesis dovrebbe essere accompagnata da evidenza.

Per esempio:

```text
Ipotesi: Orders e Shipping sono responsabilità distinte.

Evidenza:
- hanno vocabolari differenti;
- cambiano prevalentemente per ragioni differenti;
- Shipping integra provider esterni specifici;
- Orders usa solo un sottoinsieme dello stato fulfillment;
- le regole di cancellazione appartengono a Orders.

Incertezza:
- alcune query leggono oggi entrambe le tabelle;
- ownership del team non è documentata.
```

Questa forma è molto più utile di:

> “Crea due microservizi.”

### Refactoring repository-wide

Una volta deciso il confine, l'AI rende economico spostare molti file.

Questo è potente.

Ed è pericoloso.

Una riorganizzazione può cambiare import e dependency injection, rompere test o modificare transazioni, alterare serializzazione, introdurre adapter incompleti e lasciare accessi cross-boundary nascosti. Per questo il refactoring dei confini deve essere verificato con proprietà strutturali.

Per esempio:

```text
orders/domain non importa adapters
orders non importa shipping/adapters
nessun modulo accede alle tabelle possedute da un altro modulo
UI non implementa cancellation policy
```

Più queste regole sono automatizzabili, più possiamo delegare in sicurezza trasformazioni ampie.

### Gli architecture test come confine eseguibile

Immaginiamo una regola concettuale:

> il domain layer non deve dipendere da framework HTTP o database.

Se rimane soltanto in `architecture.md`, un agente può violarla accidentalmente.

Se possiamo esprimerla come test o lint rule, il repository diventa capace di difendere il confine.

Questa è una trasformazione importante:

```text
documented architecture
→ executable architectural constraint
```

Non tutte le regole possono essere automatizzate.

La cohesion semantica, per esempio, richiede giudizio.

Ma molte dipendenze proibite sì.

### Il rischio dell'abstraction explosion

Gli agenti sono molto bravi a generare boilerplate.

Questo abbassa il costo apparente di creare interface e factory, adapter e mapper, DTO, facade, mediator e handler. Di conseguenza possiamo finire con architetture che un team umano avrebbe evitato semplicemente perché troppo costose da scrivere.

L'AI rimuove quel freno economico.

Non rimuove il costo cognitivo.

Ogni astrazione aggiunge un nome e una relazione, un passaggio di navigazione, una regola da capire e una nuova possibilità di divergenza.

> **Boilerplate economico non significa complessità gratuita.**

### Chiedere la versione più semplice

Un buon adversarial prompt può essere:

> “Questa proposta contiene troppi confini o astrazioni? Riducila fino al minimo che preserva ownership, invarianti e reversibilità.”

Oppure:

> “Per ogni interface proposta, spiega quale decisione nasconde. Se non riesci a identificarne una, suggerisci di rimuoverla.”

Questo trasforma l'AI da generatore di pattern a critico dell'overengineering.

### Boundary review indipendente

Quando un agente propone un nuovo confine, possiamo chiedere a un secondo agente:

> “Assumi che questa decomposizione sia sbagliata. Cerca change coupling, transazioni, invarianti o user journey che suggeriscano che questi componenti dovrebbero restare insieme.”

E poi:

> “Assumi invece che il componente sia troppo grande. Cerca responsabilità con ragioni di cambiamento realmente indipendenti.”

Le due review spingono in direzioni opposte.

La decisione resta umana.

### Context containment come metrica qualitativa

Un buon confine riduce la quantità di contesto necessaria per una modifica.

Possiamo quindi usare una domanda pratica:

> **Per implementare correttamente questa feature, quanta parte del sistema deve conoscere un engineer o un agente?**

Se ogni task richiede l'intero repository, abbiamo probabilmente molta conoscenza globale implicita.

Se basta un piccolo modulo ma le modifiche falliscono continuamente perché non considerano effetti esterni, abbiamo forse isolato troppo.

Il confine buono contiene contesto senza nascondere dipendenze essenziali.

### Cosa cambia con l'AI

L'AI non cambia i principi fondamentali di modularità.

Cambia però il costo relativo di alcune azioni: esplorare grandi repository, proporre decomposizioni, generare adapter, applicare refactoring meccanici e produrre molte varianti costa meno. Proprio per questo aumenta il valore di ciò che resta costoso: scegliere il confine giusto, capire il significato, riconoscere il coupling reale, evitare astrazioni inutili e verificare che la trasformazione preservi il comportamento.

> **L'AI può spostare diecimila file. Non può rendere corretto un confine che abbiamo capito male.**
