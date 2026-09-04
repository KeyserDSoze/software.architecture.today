## Manager di agenti

Dire che un software engineer diventerà un “manager di agenti” può suonare come uno slogan.

Può persino sembrare una resa: meno tecnica, più coordinamento.

In questo libro useremo l'espressione in un senso molto diverso.

Un manager di agenti non è qualcuno che smette di capire il software e si limita ad assegnare task.

È qualcuno che deve capire abbastanza bene il sistema da poter **scomporre il lavoro senza perdere il significato delle parti**.

È una capacità profondamente tecnica.

### Il cantiere

Immaginiamo un cantiere.

Un architetto non posa personalmente ogni mattone. Non installa ogni cavo, non salda ogni tubo e non versa da solo ogni metro cubo di cemento.

Questo non significa che il suo ruolo consista nel mandare messaggi alle persone che lavorano.

Deve sapere che cosa si sta costruendo. Deve capire i carichi, i vincoli, le dipendenze tra lavorazioni, i materiali, le tolleranze, le sequenze che non possono essere invertite e i punti in cui un errore diventerebbe costoso o irreversibile.

Se decide di parallelizzare il lavoro, deve sapere quali attività possono davvero procedere indipendentemente.

Se due squadre lavorano su parti che condividono un vincolo non esplicitato, la velocità non aiuta.

Produce conflitto più rapidamente.

Lo stesso vale per gli agenti.

Possiamo chiedere in parallelo a un agente di modificare un'API, a un altro di preparare il database e a un terzo di aggiornare i test.

Ma se non abbiamo sincronizzato prima:

- semantica dell'operazione;
- ownership del dato;
- schema del contratto;
- gestione degli errori;
- compatibilità;
- acceptance criteria;

non abbiamo parallelizzato un progetto.

Abbiamo semplicemente creato tre versioni indipendenti della stessa idea.

Da qui un principio centrale:

> **Prima sincronizzare il pensiero. Poi parallelizzare l'esecuzione.**

### La scomposizione è una scelta architetturale

In un sistema agentico il modo in cui dividiamo un problema influenza direttamente ciò che verrà prodotto.

Consideriamo una feature apparentemente semplice: permettere a un cliente di annullare un ordine.

Potremmo dividerla così:

```text
Agente A → endpoint REST
Agente B → query database
Agente C → pulsante frontend
Agente D → test
```

È una scomposizione per tecnologia.

Ma potrebbe essere la scomposizione sbagliata.

La vera complessità forse è nella semantica:

- un ordine può essere annullato dopo il pagamento?
- che cosa succede alla spedizione?
- il rimborso è sincrono o asincrono?
- come evitiamo due rimborsi?
- l'annullamento è un cambio di stato o un evento separato?
- quali sistemi esterni devono essere notificati?
- chi può annullare?
- fino a quale momento?

Se queste decisioni non sono state prese, quattro agenti possono produrre quattro componenti localmente corretti che insieme implementano un comportamento incoerente.

La delega efficace comincia quindi dalla capacità di identificare **confini di significato**, non soltanto cartelle o layer tecnici.

### Shared context

Più agenti lavorano in parallelo, più aumenta il valore del contesto condiviso.

Non tutto deve stare in un singolo prompt. Anzi, spesso è preferibile che non ci stia.

Il repository stesso può diventare parte del sistema di coordinamento.

Un progetto AI-ready potrebbe contenere, per esempio:

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

La funzione di questi artefatti non è impressionare qualcuno con la quantità di documentazione.

È ridurre la probabilità che ogni agente debba reinventare il contesto da zero.

Un buon documento condiviso risponde a domande che altrimenti verrebbero risolte per inferenza.

Qual è il servizio autorevole per questo dato?

Quale libreria di logging usiamo?

Possiamo introdurre nuove dipendenze?

Quali directory non devono essere modificate?

Come viene gestita l'autenticazione?

Quali test sono obbligatori?

Quale comando produce una build valida?

Quali cambiamenti richiedono un ADR?

La documentazione riduce l'entropia dell'esecuzione parallela.

### Specialist agents

Uno dei vantaggi più interessanti dei sistemi agentici è la possibilità di usare ruoli differenti sullo stesso problema.

Non soltanto più agenti che scrivono codice.

Possiamo immaginare un flusso in cui:

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

Oppure eseguirne alcuni in parallelo.

La diversità di ruolo è importante perché un solo agente tende a essere prigioniero del contesto che ha appena costruito.

Chi ha prodotto una soluzione è spesso anche molto bravo a giustificarla.

Per questo la review indipendente ha valore.

Possiamo chiedere a un secondo agente:

> “Assumi che questa soluzione sia sbagliata. Cerca il modo più credibile in cui potrebbe fallire.”

Oppure:

> “Individua tutte le assunzioni che non sono supportate dai requisiti.”

Oppure:

> “Quali modifiche nel diff hanno un blast radius maggiore di quanto dichiara il task?”

L'obiettivo non è creare una burocrazia artificiale di agenti che parlano tra loro.

È usare l'abbondanza di execution per comprare **prospettive indipendenti**, non soltanto più output.

### Orchestrare non significa concatenare prompt

Un sistema multi-agent può degenerare rapidamente in una pipeline apparentemente sofisticata:

```text
output A → prompt B → output B → prompt C → output C
```

Questa non è necessariamente orchestrazione.

Può essere soltanto propagazione dell'errore.

Se il primo agente introduce un'assunzione sbagliata e gli altri la trattano come contesto autorevole, abbiamo costruito una catena capace di rendere la prima ipotesi sempre più convincente.

L'orchestrazione professionale richiede punti di controllo.

Per esempio:

```text
intento
→ piano
→ review del piano
→ execution
→ test
→ review indipendente
→ integrazione
```

In alcuni passaggi possiamo permettere autonomia elevata.

In altri vogliamo un gate.

Il punto è scegliere i checkpoint in funzione del rischio.

### Acceptance criteria prima dell'agente

Un task è molto più semplice da delegare quando sappiamo descrivere come valuteremo il risultato.

Questo vale anche tra esseri umani, ma con gli agenti diventa essenziale.

Confrontiamo due richieste.

La prima:

> “Aggiungi caching all'endpoint degli ordini.”

La seconda:

> “Riduci il carico sul database per `GET /orders/{id}` introducendo caching soltanto per letture di ordini non modificati. Mantieni la coerenza dopo update e cancellazione. Non modificare il contratto HTTP. Aggiungi test che dimostrino invalidazione e assenza di dati cross-tenant. Se per implementarlo serve introdurre una nuova infrastruttura condivisa, fermati e proponi alternative.”

La seconda non è migliore perché è più lunga.

È migliore perché rende visibili:

- obiettivo;
- perimetro;
- invarianti;
- rischio di sicurezza;
- criterio di verifica;
- stop condition.

La qualità della delega aumenta quando diminuisce il numero di decisioni importanti che l'esecutore deve inventare da solo.

### Stop condition

Un manager inesperto definisce soltanto che cosa deve essere fatto.

Un manager migliore definisce anche quando non bisogna continuare.

Con agenti molto veloci questo principio diventa fondamentale.

Un agente dovrebbe fermarsi, per esempio, quando scopre che:

- serve una migration distruttiva non prevista;
- il task richiede modifiche a un security boundary;
- i test critici esistenti falliscono;
- il requisito è ambiguo su un comportamento irreversibile;
- il cambiamento esce dal perimetro concordato;
- è necessario un secret o un permesso non previsto;
- una dipendenza esterna rende impossibile verificare il risultato;
- il costo operativo stimato cambia materialmente;
- due fonti di contesto nel repository si contraddicono.

La stop condition trasforma l'autonomia da “vai finché puoi” a “vai finché le condizioni che rendono sicura la delega restano vere”.

È una differenza enorme.

### Parallelismo e conflitto

Quando l'execution era costosa, tendevamo naturalmente a limitare il numero di attività aperte in parallelo.

Con gli agenti la tentazione è opposta.

Perché non lanciare dieci task contemporaneamente?

A volte è esattamente la scelta giusta.

Ma il parallelismo ha almeno tre forme di conflitto.

**Conflitto meccanico.** Due agenti modificano gli stessi file.

**Conflitto semantico.** Due agenti implementano assunzioni diverse sullo stesso comportamento.

**Conflitto architetturale.** Due agenti introducono decisioni locali che, combinate, spostano il sistema in una direzione che nessuno aveva scelto esplicitamente.

Il primo è il più facile da rilevare.

Il terzo è il più pericoloso.

Possiamo risolvere un merge conflict.

È molto più difficile accorgerci che tre feature sviluppate indipendentemente hanno tutte introdotto una nuova forma di coupling o tre strategie diverse di retry.

Per questo il shared context non basta.

Servono anche confini e review trasversali.

### Il manager deve saper fare il lavoro?

Arriviamo a una domanda inevitabile.

Se un engineer gestisce agenti che scrivono codice, deve ancora saper programmare?

Sì.

Ma dobbiamo essere precisi sul perché.

Non per competere con l'agente sulla velocità di digitazione.

Serve profondità tecnica per riconoscere:

- un'astrazione sbagliata;
- una race condition plausibile;
- una query che scala male;
- un contratto fragile;
- un errore di gestione dello stato;
- un uso non idiomatico di una piattaforma;
- un test che verifica l'implementazione invece del comportamento;
- una vulnerabilità nascosta dietro codice perfettamente leggibile.

Un manager di agenti che non sa leggere e giudicare il lavoro prodotto è soltanto un dispatcher.

E un dispatcher non può assumersi responsabilità tecnica reale.

La trasformazione che ci interessa è diversa:

> **da esecutore esclusivo a progettista del sistema di execution.**

Questo può rendere una singola persona enormemente più produttiva.

Ma soltanto se la sua capacità di giudizio cresce insieme alla capacità di delega.
