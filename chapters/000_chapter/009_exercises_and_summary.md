## Idee chiave, esercizi e autovalutazione

Il Capitolo 0 non vuole insegnare una tecnologia. Vuole stabilire il modo in cui useremo tutte le tecnologie che verranno dopo. Prima di parlare di requisiti, modularità, distributed systems, cloud, security o agentic architecture, dobbiamo chiarire chi prende le decisioni e come costruiamo fiducia nel lavoro prodotto.

### Idee chiave

Il primo punto da portarsi dietro è che **il software non è diventato facile: è diventato più facile produrre software**. Quando l'execution diventa abbondante, il valore si sposta verso judgment, contesto, verifica e responsabilità. Essere il pilota significa precisamente questo: l'AI può eseguire una quantità crescente di lavoro senza diventare proprietaria dell'intento né della decisione finale.

Lo stesso vale per il ruolo di manager di agenti. Non è un dispatcher che assegna task, ma qualcuno capace di scomporre un problema preservandone semantica, vincoli e dipendenze. Il parallelismo diventa utile soltanto dopo aver sincronizzato il pensiero: shared context, contratti e architecture boundaries servono a ridurre l'entropia che nasce quando più esecutori lavorano contemporaneamente sullo stesso sistema.

Delegare l'execution, inoltre, non significa delegare l'accountability. Se davanti a un errore la nostra unica spiegazione è “lo ha scritto l'AI”, abbiamo probabilmente rinunciato anche a una parte della comprensione che avremmo dovuto mantenere. Per evitare di trasformare la supervisione in re-execution manuale dobbiamo progettare verificabilità: test, invarianti, contracts, diff, scan, observability e review indipendente servono proprio a costruire confidenza senza rifare ogni passaggio.

L'autonomia segue la stessa logica. Più capacità concediamo a un agente, più devono diventare forti guardrail, permission boundary e meccanismi di verifica. Una stop condition non è un fallimento del workflow, ma il punto in cui il sistema riconosce che le premesse della delega non sono più vere. Il livello di autonomia va quindi proporzionato a blast radius, reversibilità, criticità, osservabilità e testabilità, non scelto come misura astratta di maturità.

Infine, l'AI può aumentare la produttività prima della competenza. Questo rende il deskilling un rischio reale. L'obiettivo non è usarla per produrre output dall'aspetto più senior, ma per sviluppare la capacità di riconoscere problemi, conseguenze e trade-off con maggiore profondità. Un repository AI-ready contribuisce a questo stesso obiettivo quando rende il contesto importante esplicito e impedisce agli agenti di dover reinventare decisioni architetturali per inferenza.

### Artefatti operativi introdotti

Questo capitolo introduce due artefatti che useremo più avanti. L'**Agent Delegation Contract** serve a definire obiettivo, scope, vincoli, acceptance criteria, permissions e stop condition prima di una delega significativa. L'**Agent Verification Bundle** accompagna invece il risultato con l'evidenza necessaria per giudicarlo: test, assunzioni, rischi, unresolved questions e recovery strategy.

Non devono essere usati per ogni task. Sono strumenti da attivare quando il rischio li rende utili.

---

## Esercizi

Da questo punto in avanti le liste sono intenzionali: gli esercizi sono attività da eseguire e verificare passo per passo, quindi la struttura aiuta il lettore invece di sostituire la narrazione.

### Esercizio 1 — Dalla richiesta alla delega

Ricevi questa richiesta:

> “Aggiungi caching alla nostra API degli ordini perché il database è lento.”

Non implementare nulla.

Produci un **Agent Delegation Contract** che renda il task delegabile.

Devi chiarire almeno:

- outcome desiderato;
- dati che possono essere messi in cache;
- requisiti di coerenza;
- tenant isolation;
- invalidazione;
- failure behavior;
- acceptance criteria;
- stop condition.

Poi chiedi a un'AI di criticare il tuo contract. Non chiederle di riscriverlo subito: chiedile prima di elencare le decisioni che stai implicitamente lasciando all'esecutore.

### Esercizio 2 — Review di una modifica che “funziona”

Prendi una pull request reale o simulata che passa tutti i test. Analizzala senza concentrarti inizialmente sullo stile del codice.

Costruisci una tabella con quattro colonne:

| Modifica | Nuova assunzione | Possibile failure mode | Evidenza disponibile |
| --- | --- | --- | --- |

Individua almeno cinque assunzioni. Per ciascuna chiediti se i test verdi dimostrano davvero ciò che credi.

### Esercizio 3 — Definire invarianti

Scegli una feature del tuo progetto e scrivi almeno cinque proprietà che devono rimanere vere indipendentemente dall'implementazione.

Puoi cercarle, per esempio, in queste categorie:

- sicurezza;
- consistenza;
- autorizzazione;
- idempotenza;
- compatibilità;
- limiti economici;
- correttezza del dominio.

Per ogni invariante proponi un modo concreto per verificarla.

### Esercizio 4 — Autonomy matrix

Scegli cinque tipi di task:

- aggiornamento documentazione;
- refactoring locale;
- nuovo endpoint;
- migration database;
- modifica al sistema di autorizzazione.

Per ognuno assegna un livello di autonomia da 0 a 5 e giustifica la scelta usando almeno blast radius, reversibilità, osservabilità, testabilità e criticità. Poi cambia un vincolo, per esempio immaginando che il sistema sia interno e completamente sandboxato, e verifica se il livello di autonomia cambia.

### Esercizio 5 — Stop condition design

Prendi un task che normalmente affideresti a un coding agent. Scrivi almeno otto stop condition e dividile in tre categorie:

```text
technical stop
security/compliance stop
product/domain stop
```

Controlla poi se alcune di queste condizioni possono essere automatizzate.

### Esercizio 6 — Verification without re-execution

Chiedi a un'AI di implementare una funzione non banale. Non rileggere subito tutto il codice riga per riga: prima progetta un **Agent Verification Bundle** e decidi quali evidenze ti servano per aumentare la confidenza. Solo dopo esamina l'implementazione.

Alla fine confronta:

- cosa hai scoperto attraverso la verifica;
- cosa hai scoperto attraverso la lettura del codice;
- cosa sarebbe rimasto invisibile usando soltanto uno dei due metodi.

### Esercizio 7 — Adversarial review

Produci o scegli una piccola decisione architetturale. Per esempio:

> “Useremo eventi asincroni per propagare gli aggiornamenti degli ordini.”

Chiedi a un agente di difendere la decisione e a un secondo agente, senza mostrare la prima risposta, di tentare di demolirla.

Confronta:

- assunzioni;
- failure mode;
- costi;
- condizioni in cui la soluzione è appropriata;
- condizioni in cui non lo è.

Scrivi poi tu la decisione finale. L'obiettivo non è scegliere quale agente “ha ragione”, ma usare opinioni divergenti per migliorare il tuo judgment.

### Esercizio 8 — Deskilling check

Scegli un task che hai svolto recentemente con AI. Senza riaprire la conversazione originale, prova a rispondere:

1. Qual era il problema?
2. Quali alternative erano plausibili?
3. Perché è stata scelta la soluzione finale?
4. Quali failure mode conosci?
5. Quale parte non sapresti implementare o spiegare senza aiuto?

Il punto 5 non è una colpa: è una mappa di apprendimento. Scegli una di quelle lacune e usa l'AI come tutor finché riesci a spiegarla con parole tue.

### Esercizio 9 — Prima sincronizzare, poi parallelizzare

Immagina di dover implementare la cancellazione di un ordine con:

- frontend;
- API;
- database;
- pagamento;
- spedizione;
- notifiche.

Hai sei agenti disponibili. Non assegnare ancora i task: scrivi prima il contesto che tutti devono condividere.

Identifica poi:

- decisioni che devono essere prese prima del parallelismo;
- attività realmente indipendenti;
- attività che sembrano indipendenti ma condividono un contratto;
- checkpoint di integrazione.

Solo alla fine assegna il lavoro.

### Esercizio 10 — Il test del pilota

Prendi un componente di cui sei responsabile e immagina che domani produca un incidente serio. Scrivi, senza usare AI, una risposta a queste domande:

- perché esiste questa soluzione?
- quali alternative erano disponibili?
- quali rischi avevamo accettato?
- quali controlli dovevano intercettare il problema?
- come ci accorgeremmo del failure?
- come torneremmo in uno stato sicuro?

Se non riesci a rispondere, hai trovato un'area in cui la responsabilità formale è maggiore della comprensione reale. Quello è lavoro architetturale.

---

## Domande di autovalutazione

1. Qual è la differenza tra delegare execution e delegare responsibility?
2. Perché più agenti in parallelo possono aumentare l'incoerenza anche quando ogni agente lavora bene?
3. Che cosa rende una stop condition diversa da un semplice errore?
4. In che modo un'invariante permette di verificare senza conoscere ogni dettaglio dell'implementazione?
5. Perché un numero elevato di test generati non equivale necessariamente a maggiore confidenza?
6. Quali fattori useresti per decidere il livello di autonomia di un coding agent?
7. Che cosa significa fare escalation di qualità?
8. Qual è la differenza tra breadth e depth nell'apprendimento AI-native?
9. Come può l'AI aumentare contemporaneamente produttività e rischio di deskilling?
10. Quali informazioni dovrebbe contenere il repository perché un agente non debba reinventare decisioni importanti?

---

## Cosa cambia con l'AI

Molti principi di questo capitolo esistevano già prima dei modelli generativi. Delegare bene, verificare, documentare, controllare i permessi e progettare per il fallimento non sono idee nate nel 2026. Ciò che cambia è la scala.

Un singolo professionista può oggi dirigere una quantità di execution molto maggiore e produrre più codice, test, documentazione, refactoring, analisi e alternative nello stesso tempo. La capacità di produzione cresce più velocemente della capacità umana di leggere tutto. Per questo acquistano ancora più peso il context engineering, i contracts e le invariants, la verifica automatica e gli architecture boundary. Permission boundary, stop condition e review indipendente permettono di aumentare execution senza perdere l'accountability che resta alla fine del processo.

L'AI non elimina la necessità di ingegneria. Rende più costoso confondere produzione con ingegneria.

---

## Corollario

> **L'AI può scrivere il codice. Il timone resta a noi.**

Il prossimo passo è capire che cosa dobbiamo fare prima di chiedere a qualcuno — umano o artificiale — di costruire. Perché il modo più veloce di realizzare la soluzione sbagliata è avere un esecutore straordinariamente efficiente.
