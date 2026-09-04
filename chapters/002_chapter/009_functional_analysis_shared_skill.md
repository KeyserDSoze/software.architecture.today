## L'analisi funzionale non appartiene a una persona

In molti progetti l’espressione **analisi funzionale** evoca un passaggio di consegne: qualcuno raccoglie requisiti, produce un documento, lo consegna al team tecnico e da quel momento developer e architect possono concentrarsi sull’implementazione.

È un modello organizzativo possibile. Non è un buon modello mentale.

Un software engineer non deve necessariamente svolgere il mestiere del business analyst e un architect non deve sostituire product manager, domain expert o UX researcher. Le specializzazioni continuano ad avere valore. Ma nessuno che prenda decisioni significative sul sistema può permettersi di non capire **che cosa il prodotto fa, per chi lo fa e quali regole di business sta implementando**.

> **L’analisi può avere uno specialista. La comprensione del prodotto non può avere un unico proprietario.**

### Prima del design viene la comprensione funzionale

Microsoft, nella guida Azure Architecture Center dedicata alla domain analysis, formula un principio molto vicino a quello che ci serve: prima di scrivere codice è necessaria una conoscenza generale del sistema; il mapping delle funzioni aziendali dovrebbe coinvolgere domain expert, software architect e altri stakeholder; l’obiettivo è costruire una comprensione condivisa del dominio prima di scegliere le tecnologie.

Fonte primaria:

- [Microsoft Learn — Use Domain Analysis to Model Microservices](https://learn.microsoft.com/azure/architecture/microservices/model/domain-analysis)

La pagina parla di microservizi, ma il principio è più generale del deployment model. Se non comprendiamo le funzioni e le loro connessioni, non abbiamo ancora abbastanza contesto per decidere bene boundary, ownership, transazioni, API, modello dati, failure behavior, authorization, consistenza, audit o priorità dei requisiti non funzionali.

L’architettura arriva dopo queste domande, non prima.

### Saper leggere un’analisi funzionale

Ogni professionista che contribuisce al prodotto dovrebbe saper leggere un’analisi funzionale e ricostruire attori, obiettivi, flussi, precondizioni, postcondizioni, regole di business, stati, transizioni, eccezioni, autorizzazioni, dati necessari e integrazioni. Deve anche saper riconoscere edge case, dipendenze tra funzionalità, assunzioni e punti ancora ambigui.

Leggere non significa accettare passivamente. Una buona lettura produce domande.

Se un requisito dice “L’operatore può rimborsare un ordine”, un engineer dovrebbe voler sapere quale operatore, quali ordini, fino a quando e se il rimborso possa essere parziale. Dovrebbe chiedersi che cosa accada quando il pagamento è in contestazione, se il rimborso sia immediato o dipenda da un provider esterno, che stato veda l’utente durante l’attesa, se una richiesta ripetuta possa generare due rimborsi e quale audit sia necessario.

Queste non sono domande “di implementazione”. Sono domande sul comportamento del prodotto.

### Saper fare analisi funzionale

Il passo successivo è ancora più importante. Un developer, un tech lead o un architect dovrebbe essere capace anche di **produrre una prima analisi funzionale** quando serve, senza pretendere di sostituire un analyst esperto.

La competenza minima consiste nel saper ricostruire un flusso, esplicitare regole e stati, distinguere comportamento da soluzione tecnica e far emergere ambiguità. Significa saper formulare scenari alternativi, discutere con domain expert e stakeholder usando il loro linguaggio e trasformare la comprensione ottenuta in requisiti e acceptance criteria verificabili.

Questa capacità diventa ancora più importante nell’era dell’AI. Un coding agent può trasformare una specifica mediocre in molto codice mediocre estremamente rapidamente. Se il team possiede invece una buona comprensione funzionale, l’AI può accelerare esplorazione, implementazione e verifica senza inventare la semantica del prodotto.

### Ubiquitous language

Domain-Driven Design usa il concetto di **ubiquitous language**: un vocabolario condiviso costruito insieme da developer e domain expert e usato coerentemente in conversazioni, documentazione e codice. Microsoft Learn descrive esplicitamente questo linguaggio come uno strumento condiviso tra sviluppatori ed esperti di dominio per rappresentare correttamente la conoscenza del business.

Fonti:

- [Microsoft Learn — Use Domain Analysis to Model Microservices](https://learn.microsoft.com/azure/architecture/microservices/model/domain-analysis)
- [Martin Fowler — Ubiquitous Language](https://martinfowler.com/bliki/UbiquitousLanguage.html)

Il concetto ci offre un test semplice. Se business, analyst, developer e codice usano parole diverse per descrivere la stessa cosa, abbiamo un problema di comprensione prima ancora che di architettura. Se `OrderStatus` contiene quindici valori che nessuno sa spiegare senza aprire il codice, abbiamo probabilmente perso parte del modello funzionale.

### Visione d’insieme non significa conoscere ogni dettaglio

Dire che tutti devono conoscere il prodotto non significa che ogni persona debba memorizzare ogni regola di ogni modulo. Serve però una visione d’insieme condivisa: perché esiste il prodotto, chi lo usa, quali journey sono critici, quali capability offre, quali dati sono autorevoli, quali regole non possono essere violate, quali sistemi esterni partecipano e dove si trovano i confini principali.

Poi ciascuno approfondirà l’area su cui lavora. Il problema nasce quando una persona possiede soltanto il proprio ticket e non sa spiegare dove quel ticket si inserisca nel sistema. In quel caso possiamo ottenere local correctness e global nonsense.

### Requisiti come conoscenza viva

Microsoft Learn descrive la gestione dei requisiti come un processo continuo che comprende documentare, analizzare, prioritizzare, tracciare e collaborare con gli stakeholder.

Fonte:

- [Microsoft Learn — Manage requirements for Agile teams in Azure DevOps](https://learn.microsoft.com/azure/devops/cross-service/manage-requirements)

Questo è importante perché l’analisi funzionale non deve diventare il documento statico scritto all’inizio del progetto. Il prodotto cambia, la nostra comprensione cambia, emergono eccezioni, le parole acquistano significati più precisi e le assunzioni vengono smentite. L’analisi deve quindi avere un feedback loop con il software reale.

### Shared understanding

Anche lo Scrum Guide insiste sulla trasparenza degli artefatti e sulla necessità che il team costruisca una base condivisa per prendere decisioni e adattarsi. Il Product Backlog è emergente e viene raffinato aumentando comprensione e precisione; Sprint Planning è lavoro collaborativo dell’intero Scrum Team.

Fonte:

- [The Scrum Guide](https://scrumguides.org/scrum-guide.html)

Non useremo Scrum come prescrizione metodologica. Ci interessa il principio sottostante:

> **Chi deve costruire, verificare e far evolvere un prodotto deve avere abbastanza comprensione condivisa da poter ragionare sul suo comportamento.**

### Functional Scope Map

Accanto al Problem & Outcome Brief useremo un secondo artefatto quando il dominio richiede più dettaglio: la **Functional Scope Map**.

```text
Product goal
Actors
Capabilities
Critical user journeys
Business rules
States and transitions
External systems
Cross-functional dependencies
Known exceptions
Open functional questions
Glossary
```

La forma è intenzionalmente flessibile: può essere testo, tabella, diagramma o una combinazione. Non è un UML obbligatorio. La sua funzione è rendere navigabile il comportamento del prodotto.

### Un nuovo test per il team

Prima di autorizzare una modifica importante possiamo chiedere: le persone che stanno progettando, implementando e verificando questa modifica sanno spiegare il flusso funzionale completo in cui essa vive?

Se la risposta è no, non significa fermare il progetto per settimane e produrre altra documentazione. Significa che manca contesto. Quel contesto va costruito prima di delegare decisioni importanti al codice o agli agenti.

### Order Operations

Da questo punto Order Operations non sarà soltanto un esempio narrativo. Il capstone avrà una propria analisi funzionale viva nel repository. Ogni volta che un capitolo introdurrà una nuova capability o cambierà un vincolo, dovremo chiederci se cambia anche la Functional Scope Map, il glossario, uno stato, una business rule, un journey, una permission o un acceptance criterion.

In questo modo il progetto crescerà come cresce un progetto vero: non soltanto aggiungendo codice, ma accumulando e correggendo conoscenza.

> **Il codice implementa il prodotto. L’analisi funzionale ci ricorda quale prodotto stiamo implementando.**
