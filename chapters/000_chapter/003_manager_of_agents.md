## Manager di agenti

Dire che un software engineer diventerà un “manager di agenti” può suonare come uno slogan e persino come una resa: meno tecnica, più coordinamento. In questo libro useremo l'espressione in un senso molto diverso. Un manager di agenti non è qualcuno che smette di capire il software e si limita ad assegnare task; è qualcuno che deve capire abbastanza bene il sistema da poter **scomporre il lavoro senza perdere il significato delle parti**. È una capacità profondamente tecnica.

### Il cantiere

Immaginiamo un cantiere. Un architetto non posa personalmente ogni mattone, non installa ogni cavo, non salda ogni tubo e non versa da solo ogni metro cubo di cemento. Questo non riduce il suo ruolo a mandare messaggi alle persone che lavorano: deve sapere che cosa si sta costruendo, capire i carichi, i vincoli, le dipendenze tra lavorazioni, i materiali, le tolleranze, le sequenze che non possono essere invertite e i punti in cui un errore diventerebbe costoso o irreversibile.

Lo stesso vale quando decide di parallelizzare il lavoro. Se due squadre procedono su parti che condividono un vincolo non esplicitato, la velocità non aiuta: produce conflitto più rapidamente. Con gli agenti accade la stessa cosa. Possiamo chiedere in parallelo a un agente di modificare un'API, a un altro di preparare il database e a un terzo di aggiornare i test, ma se prima non abbiamo sincronizzato la semantica dell'operazione, l'ownership del dato, lo schema del contratto, il modello degli errori, la compatibilità e gli acceptance criteria, non abbiamo davvero parallelizzato un progetto. Abbiamo creato tre versioni indipendenti della stessa idea.

Da qui un principio centrale:

> **Prima sincronizzare il pensiero. Poi parallelizzare l'esecuzione.**

### La scomposizione è una scelta architetturale

In un sistema agentico il modo in cui dividiamo un problema influenza direttamente ciò che verrà prodotto. Consideriamo una feature apparentemente semplice: permettere a un cliente di annullare un ordine. Potremmo dividerla per tecnologia, assegnando a un agente l'endpoint REST, a un altro la query database, a un terzo il pulsante frontend e a un quarto i test:

```text
Agente A → endpoint REST
Agente B → query database
Agente C → pulsante frontend
Agente D → test
```

Questa scomposizione è ordinata, ma potrebbe essere quella sbagliata. La vera complessità forse non è nei layer tecnici, bensì nella semantica dell'annullamento. Dobbiamo capire se un ordine possa essere annullato dopo il pagamento, che cosa accada alla spedizione, se il rimborso sia sincrono o asincrono e come evitare rimborsi duplicati. Dobbiamo decidere se l'annullamento sia un semplice cambio di stato o un evento con semantica propria, identificare i sistemi esterni da notificare e stabilire chi possa annullare un ordine e fino a quale momento.

Se queste decisioni non sono state prese, quattro agenti possono produrre quattro componenti localmente corretti che insieme implementano un comportamento incoerente. La delega efficace comincia quindi dalla capacità di identificare **confini di significato**, non soltanto cartelle o layer tecnici.

### Shared context

Più agenti lavorano in parallelo, più aumenta il valore del contesto condiviso. Non tutto deve stare in un singolo prompt; spesso è preferibile che non ci stia. Il repository stesso può diventare parte del sistema di coordinamento e contenere una struttura simile a questa:

```text
README.md
AGENTS.md
architecture/
  overview.md
  boundaries.md
  deployment.md
  security.md
  data.md
adr/
contracts/
features/
tests/
```

La funzione di questi artefatti non è impressionare qualcuno con la quantità di documentazione. È ridurre la probabilità che ogni agente debba reinventare il contesto da zero. Un buon documento condiviso rende esplicite informazioni che altrimenti verrebbero ricostruite per inferenza: quale servizio sia autorevole per un dato, come venga gestita l'autenticazione, quali dipendenze siano consentite, quali directory non debbano essere modificate, quali test siano obbligatori e quale comando produca una build valida. Può inoltre chiarire le convenzioni comuni e indicare quali cambiamenti richiedano un ADR.

La documentazione, in questo senso, riduce l'entropia dell'esecuzione parallela.

### Specialist agents

Uno dei vantaggi più interessanti dei sistemi agentici è la possibilità di usare ruoli differenti sullo stesso problema, non soltanto più agenti che scrivono codice. Possiamo far produrre una soluzione a un Author Agent e poi sottoporla a un Test Agent, a un Security Reviewer, a un Architecture Reviewer e a un reviewer esplicitamente scettico, prima della decisione umana:

```text
Author Agent
    ↓
Test Agent
    ↓
Security Reviewer
    ↓
Architecture Reviewer
    ↓
Skeptical Reviewer
    ↓
Human decision
```

Alcuni di questi ruoli possono anche lavorare in parallelo. Il valore non sta nel numero di agenti coinvolti, ma nella diversità di prospettiva. Chi ha prodotto una soluzione è spesso anche molto bravo a giustificarla; una review indipendente serve proprio a rompere questa continuità di bias.

A un secondo agente possiamo chiedere di assumere che la soluzione sia sbagliata e cercare il modo più credibile in cui potrebbe fallire, oppure di individuare le assunzioni non supportate dai requisiti o le modifiche nel diff con un blast radius superiore a quello dichiarato dal task. L'obiettivo non è creare una burocrazia artificiale di agenti che parlano tra loro, ma usare l'abbondanza di execution per comprare **prospettive indipendenti**, non soltanto più output.

### Orchestrare non significa concatenare prompt

Un sistema multi-agent può degenerare rapidamente in una pipeline apparentemente sofisticata:

```text
output A → prompt B → output B → prompt C → output C
```

Questa non è necessariamente orchestrazione; può essere soltanto propagazione dell'errore. Se il primo agente introduce un'assunzione sbagliata e gli altri la trattano come contesto autorevole, abbiamo costruito una catena capace di rendere la prima ipotesi sempre più convincente.

L'orchestrazione professionale richiede invece punti di controllo. Un flusso può passare dall'intento al piano, sottoporre il piano a review, procedere con l'execution e poi attraversare test, review indipendente e integrazione:

```text
intento
→ piano
→ review del piano
→ execution
→ test
→ review indipendente
→ integrazione
```

In alcuni passaggi possiamo permettere autonomia elevata; in altri vogliamo un gate. Il punto è scegliere i checkpoint in funzione del rischio, non del fascino della pipeline.

### Acceptance criteria prima dell'agente

Un task è molto più semplice da delegare quando sappiamo descrivere come valuteremo il risultato. Questo vale anche tra esseri umani, ma con gli agenti diventa essenziale. Confrontiamo due richieste. La prima è “Aggiungi caching all'endpoint degli ordini”. La seconda è più precisa:

> “Riduci il carico sul database per `GET /orders/{id}` introducendo caching soltanto per letture di ordini non modificati. Mantieni la coerenza dopo update e cancellazione. Non modificare il contratto HTTP. Aggiungi test che dimostrino invalidazione e assenza di dati cross-tenant. Se per implementarlo serve introdurre una nuova infrastruttura condivisa, fermati e proponi alternative.”

La seconda non è migliore perché è più lunga. È migliore perché rende visibili l'obiettivo e il perimetro, esplicita le invarianti e il rischio di sicurezza, dichiara il criterio di verifica e stabilisce una stop condition. La qualità della delega aumenta quando diminuisce il numero di decisioni importanti che l'esecutore deve inventare da solo.

### Stop condition

Un manager inesperto definisce soltanto che cosa deve essere fatto. Un manager migliore definisce anche quando non bisogna continuare. Con agenti molto veloci questo principio diventa fondamentale, perché un task che ha superato il confine della delega può continuare a generare output coerente ma non più autorizzato.

Un agente dovrebbe quindi fermarsi quando scopre che il lavoro richiede una migration distruttiva non prevista o una modifica a un security boundary; quando i test critici esistenti falliscono; quando il requisito è ambiguo su un comportamento irreversibile o il cambiamento esce dal perimetro concordato. Dovrebbe inoltre escalare se servono secret o permessi non previsti, se una dipendenza esterna impedisce una verifica credibile, se il costo operativo cambia materialmente o se due fonti di contesto nel repository si contraddicono.

La stop condition trasforma l'autonomia da “vai finché puoi” a “vai finché le condizioni che rendono sicura la delega restano vere”. È una differenza enorme.

### Parallelismo e conflitto

Quando l'execution era costosa, tendevamo naturalmente a limitare il numero di attività aperte in parallelo. Con gli agenti la tentazione è opposta: se possiamo lanciare dieci task contemporaneamente, perché non farlo? A volte è esattamente la scelta giusta, ma il parallelismo porta con sé forme di conflitto diverse.

Il **conflitto meccanico** è il più evidente: due agenti modificano gli stessi file. Il **conflitto semantico** emerge quando implementano assunzioni diverse sullo stesso comportamento. Il **conflitto architetturale** è più sottile e più pericoloso: due o più agenti introducono decisioni locali che, combinate, spostano il sistema in una direzione che nessuno aveva scelto esplicitamente.

Possiamo risolvere un merge conflict con relativa facilità. È molto più difficile accorgerci che tre feature sviluppate indipendentemente hanno introdotto tre strategie diverse di retry o una nuova forma di coupling distribuita. Per questo il shared context non basta: servono anche confini e review trasversali.

### Il manager deve saper fare il lavoro?

Arriviamo a una domanda inevitabile: se un engineer gestisce agenti che scrivono codice, deve ancora saper programmare? Sì, ma non per competere con l'agente sulla velocità di digitazione.

Serve profondità tecnica per riconoscere un'astrazione sbagliata o una race condition plausibile, una query che scala male o un contratto fragile, un errore nella gestione dello stato o un uso non idiomatico della piattaforma. Serve per accorgersi quando un test verifica l'implementazione invece del comportamento e quando codice perfettamente leggibile nasconde una vulnerabilità.

Un manager di agenti che non sa leggere e giudicare il lavoro prodotto è soltanto un dispatcher, e un dispatcher non può assumersi responsabilità tecnica reale. La trasformazione che ci interessa è diversa:

> **da esecutore esclusivo a progettista del sistema di execution.**

Questo può rendere una singola persona enormemente più produttiva, ma soltanto se la sua capacità di giudizio cresce insieme alla capacità di delega.
