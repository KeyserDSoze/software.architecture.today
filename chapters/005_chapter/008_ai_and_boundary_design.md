## AI e boundary design

L'AI può proporre strutture di progetto con una velocità impressionante. Chiediamo di “organizzare il repository secondo clean architecture” o di “dividere il monolite in moduli” e in pochi secondi otteniamo cartelle, interfacce, adapter, use case, dependency injection e test.

Il risultato può sembrare molto professionale. La domanda importante, però, è un'altra:

> **I confini riflettono davvero il problema o soltanto un pattern riconoscibile dal modello?**

## Pattern-shaped architecture

Gli agenti hanno visto moltissimi esempi di strutture come:

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

Quando il contesto è povero, è naturale che riempiano i vuoti con configurazioni statisticamente comuni. Il risultato è una **architecture by prior**: il sistema assume la forma degli esempi conosciuti più che delle forze reali del dominio.

La struttura può essere pulita e il boundary sbagliato.

## Prima diagnosi, poi decomposizione

Prima di chiedere un refactoring repository-wide è spesso più utile separare comprensione e proposta.

Possiamo chiedere all'agente di identificare le responsabilità presenti, i dati usati, le regole duplicate, i punti di change coupling e le dipendenze che attraversano aree diverse, senza ancora proporre una nuova struttura.

Solo dopo trasformiamo quell'analisi in boundary hypothesis.

```text
comprensione
→ ipotesi di confine
→ verifica
→ proposta
→ refactoring
```

Questa sequenza riduce il rischio che il pattern scelto decida retroattivamente quale problema stiamo vedendo.

## Boundary hypothesis con evidenza e incertezza

Un agente può cercare import graph, chiamate tra package, tabelle condivise, termini di dominio, history dei file, test end-to-end, CODEOWNERS, API interne, eventi e configurazioni. Il punto è non trasformare automaticamente questi segnali in verità.

Una buona ipotesi dovrebbe mostrare anche l'evidenza:

```text
Ipotesi: Orders e Shipping sono responsabilità distinte.

Evidenza:
- usano vocabolari differenti;
- cambiano prevalentemente per ragioni differenti;
- Shipping integra provider esterni specifici;
- Orders usa soltanto un sottoinsieme del significato fulfillment;
- la cancellation policy appartiene a Orders.

Incertezza:
- alcune query leggono oggi entrambe le tabelle;
- l'ownership organizzativa non è completamente documentata.
```

Questa forma è molto più utile di “crea due microservizi”, perché rende contestabile il reasoning prima di renderlo costoso nel codice.

## Refactoring ampio non significa refactoring sicuro

Una volta deciso il boundary, l'AI rende economico spostare centinaia di file, aggiornare import e generare adapter. È una capacità enorme, ma non rende la trasformazione semanticamente sicura.

Una riorganizzazione può rompere transaction boundary, cambiare dependency injection, alterare serializzazione, lasciare accessi cross-domain nascosti o introdurre adapter che riproducono una regola in più punti.

Per questo le trasformazioni ampie devono essere accompagnate da proprietà verificabili, per esempio:

```text
orders/domain non importa adapters
orders non importa shipping/adapters
nessun modulo accede alle tabelle possedute da un altro modulo
UI non implementa cancellation policy
```

Più il boundary può essere espresso come test, lint rule o dependency constraint, più possiamo delegare in sicurezza il lavoro meccanico.

## Da architettura documentata a constraint eseguibile

Una regola come “il domain layer non dipende dal framework HTTP o dal database” è utile in `architecture.md`, ma rimane facile da violare accidentalmente.

Quando possiamo tradurla in un architecture test, il repository inizia a difendere il proprio design:

```text
documented architecture
→ executable architectural constraint
```

Non tutto può essere automatizzato. Cohesion, significato e ownership richiedono judgment. Molte dependency direction, invece, possono diventare verifiche meccaniche.

Questo è il punto ideale di collaborazione tra decisione umana ed execution automatizzata.

## Boilerplate economico, complessità ancora costosa

Gli agenti abbassano molto il costo di creare interface, factory, adapter, DTO, facade, mediator e handler. Possiamo quindi costruire architetture che un team avrebbe evitato semplicemente perché il boilerplate era troppo costoso da scrivere.

Quel freno economico scompare. Il costo cognitivo no.

Ogni astrazione aggiunge un nome, una relazione, un punto di navigazione e una nuova possibilità di divergenza.

> **Boilerplate economico non significa complessità gratuita.**

Per questo un prompt avversariale utile è chiedere di ridurre la proposta al minimo che preserva ownership, invarianti e reversibilità. Per ogni interfaccia possiamo chiedere quale decisione stia realmente nascondendo; se non esiste una risposta convincente, forse l'astrazione non serve.

## Review in entrambe le direzioni

Quando un agente propone una decomposizione, una singola review può ancora condividere lo stesso bias. È utile attaccare il boundary da due direzioni opposte.

Prima chiediamo di dimostrare che abbiamo **separato troppo**, cercando invarianti, transaction boundary, change coupling e latency sensibile che suggeriscano di tenere le parti insieme. Poi chiediamo di dimostrare che abbiamo **separato troppo poco**, cercando ownership, vocabolari, failure domain e ragioni di cambiamento indipendenti.

La tensione tra le due analisi è più utile del consenso superficiale.

## Context containment come segnale di qualità

Un buon boundary riduce la quantità di contesto necessaria per fare una modifica corretta. Se ogni task richiede l'intero repository, abbiamo probabilmente troppa conoscenza globale implicita. Se un modulo sembra completamente autonomo ma le modifiche producono continuamente effetti esterni inattesi, forse abbiamo nascosto dipendenze che dovevano restare visibili.

La domanda pratica è:

> **Per implementare correttamente questa feature, quanta parte del sistema deve conoscere un engineer o un agente?**

Il confine buono contiene il contesto senza mentire sulle relazioni che contano.

L'AI rende molto più economici exploration, decomposizione e refactoring. Proprio per questo aumenta il valore della parte che rimane difficile: scegliere il boundary corretto, riconoscere il coupling reale e verificare che la nuova struttura preservi il significato.

> **L'AI può spostare diecimila file. Non può rendere corretto un confine che abbiamo capito male.**
