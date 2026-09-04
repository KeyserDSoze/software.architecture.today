## Idee chiave

Questo capitolo non sostiene che il software engineering sia diventato più difficile perché esiste l’AI. Sostiene qualcosa di più preciso: l’AI modifica il rapporto tra **pensiero ed execution**.

Quando produrre artefatti costa meno, scompare una parte dell’attrito che per anni ha rallentato il lavoro. È un vantaggio enorme. Scompare però anche una parte del tempo che, volontariamente o meno, ci costringeva a incontrare certe domande prima che il sistema crescesse troppo. Per questo produrre software e costruire buoni sistemi diventano attività ancora più chiaramente distinguibili.

L’execution abbondante sposta il collo di bottiglia verso chiarezza, judgment, integrazione e verifica. Ogni artefatto che diventa economico da creare può restare costoso da possedere: codice, servizi, dipendenze, test e documentazione continuano a richiedere comprensione, manutenzione e responsabilità. La capacità extra può però essere spesa bene, per comprare alternative, prototipi scartabili, review indipendenti, test avversariali e altre forme di evidence che aumentano la confidenza anziché soltanto il volume.

Abbiamo anche visto perché il **prompt-first development** è pericoloso quando trasforma l’incertezza direttamente in implementazione. Il problema non è usare prompt: è lasciare che il prompt inventi contemporaneamente problema, design e soluzione. In questo processo il repository diventa esso stesso un insegnante, perché gli agenti propagano con grande efficienza tanto le convenzioni sane quanto i precedenti accidentali.

Una demo, allo stesso modo, produce evidence parziale. Mostra che almeno un percorso ha funzionato, non che il sistema sia production-ready. E un feedback loop veloce è utile soltanto se osserva ciò che conta davvero: il blast radius di una modifica è semantico, non dipende dal numero di righe, e una ottimizzazione locale può peggiorare il sistema globale.

Infine, l’abbondanza di output porta con sé un nuovo costo umano. **AI fatigue** emerge quando il sistema di lavoro costringe le persone a supervisionare una sequenza infinita di micro-interazioni. Context engineering, repository engineering e fonti di verità affidabili servono anche a questo: ridurre il lavoro di ricostruzione del contesto e conservare attenzione per le decisioni in cui il giudizio umano è realmente necessario.

Il principio che unisce tutto il capitolo resta semplice:

> **Prima capire, poi costruire.**

Non significa aspettare di sapere tutto. Significa capire abbastanza da sapere che cosa stiamo chiedendo all’execution di moltiplicare.

---

## Esercizi

Qui la struttura a lista è intenzionale: gli esercizi devono poter essere eseguiti, verificati e ripresi come strumenti di lavoro.

### Esercizio 1 — Togliere output

Prendi una feature recente su cui hai lavorato o inventane una realistica.

Elenca tutti gli artefatti che un’AI potrebbe produrre rapidamente:

- codice;
- test;
- documentazione;
- infrastruttura;
- dashboard;
- migration;
- script;
- configurazioni.

Ora elimina dalla lista tutto ciò che non è necessario per ottenere l’outcome desiderato.

Per ogni elemento rimasto rispondi:

1. quale problema risolve?
2. quale costo di ownership introduce?
3. chi dovrà mantenerlo?
4. come potremmo evitarlo?

L’obiettivo non è minimizzare il software a ogni costo. È allenarsi a distinguere capacità di generazione e necessità.

### Esercizio 2 — Diagnosi di prompt-first development

Considera questa sequenza:

```text
“Crea un sistema di prenotazioni.”
→ implementazione
“Aggiungi pagamenti.”
→ implementazione
“Aggiungi cancellazione.”
→ implementazione
“Gli amministratori devono poter fare override.”
→ implementazione
“Serve supporto multi-tenant.”
→ implementazione
```

Identifica almeno dieci decisioni importanti che sono state lasciate implicitamente all’execution.

Poi riscrivi il lavoro fino al primo task implementabile usando la sequenza:

```text
problema
→ contesto
→ outcome
→ vincoli
→ decisioni
→ task
```

Non scrivere codice.

### Esercizio 3 — Demo sotto processo

Hai davanti una demo di un’applicazione che autentica utenti, accetta pagamenti, salva ordini, invia email, ha test automatici e viene deployata tramite pipeline. La demo funziona perfettamente.

Costruisci una tabella con tre colonne:

```text
Cosa la demo dimostra
Cosa non dimostra
Come potremmo verificarlo
```

Inserisci almeno quindici righe.

### Esercizio 4 — Blast radius

Ordina questi cambiamenti per rischio, senza usare il numero di righe come criterio principale:

- rinominare un metodo privato in 300 file tramite codemod;
- cambiare il default di una policy di autorizzazione;
- aggiungere un indice database;
- cambiare formato di un evento pubblico;
- aggiornare una libreria di logging;
- modificare il calcolo di una tariffa;
- cambiare timeout di una chiamata esterna;
- introdurre una cache condivisa.

Per ogni scelta esplicita boundary coinvolti, reversibilità, persistenza, compatibilità, security impact e osservabilità richiesta.

Non esiste un ordine universale corretto. Devi difendere il tuo.

### Esercizio 5 — Progettare feedback

Un agente deve ridurre la latenza di un endpoint critico.

Definisci un feedback loop che non si limiti alla latenza locale. Deve includere almeno performance, correttezza, consistenza, failure, costo, sicurezza e segnali dopo il deploy.

Poi identifica quali controlli devono essere eseguiti prima del merge e quali possono essere osservati soltanto durante rollout o produzione.

### Esercizio 6 — Ridurre AI fatigue

Prendi un workflow in cui interagisci frequentemente con un assistente o un coding agent.

Conta, anche approssimativamente:

- quante volte devi ripetere il contesto;
- quante correzioni derivano da requisiti non esplicitati;
- quante review riguardano sempre la stessa regola;
- quante informazioni vivono soltanto nella chat.

Progetta una versione alternativa del workflow usando almeno tre tra documento stabile, contract, ADR, `AGENTS.md`, test automatico, architecture test, issue template e stop condition.

L’obiettivo è ridurre interazioni senza ridurre controllo.

### Esercizio 7 — Context engineering

Devi delegare a un agente la modifica di un flusso di autenticazione.

Costruisci due pacchetti di contesto. Nel **Pacchetto A** inserisci tutto ciò che potresti dare all’agente; nel **Pacchetto B** conserva soltanto il contesto minimo sufficiente per il task.

Spiega che cosa hai escluso dal secondo e perché. Poi definisci una gerarchia delle fonti in caso di contraddizione, per esempio:

```text
security policy
> ADR attivo
> contract
> codice esistente
> vecchio README
```

La tua gerarchia può essere diversa, ma deve essere esplicita.

### Esercizio 8 — Adversarial review

Chiedi a un agente AI di progettare una feature non banale. Non implementarla.

Poi assegna a un secondo agente questo ruolo:

> “Assumi che il design proposto sia pericolosamente incompleto. Trova assunzioni implicite, failure mode, costi nascosti, problemi di sicurezza e decisioni difficili da invertire.”

Confronta i due output e annota che cosa il primo agente non aveva considerato, quali critiche del reviewer siano senza evidence, quali cambino davvero la decisione e quali siano soltanto possibilità teoriche.

### Esercizio 9 — Order Operations

Riprendi il caso Order Operations.

Il requisito iniziale è:

> “Inserire e consultare ordini.”

Senza progettare ancora la soluzione finale, prepara:

- dieci domande per il product owner;
- cinque assunzioni accettabili temporaneamente per un prototipo;
- cinque assunzioni da non lasciare implicite neppure nel prototipo;
- tre segnali che ti farebbero fermare e riprogettare.

### Esercizio 10 — Il test del foglio bianco

Scegli un task che vorresti delegare a un agente.

Prima di aprire lo strumento, scrivi senza AI:

1. comportamento atteso;
2. comportamenti vietati;
3. invarianti;
4. boundary coinvolti;
5. criteri di verifica;
6. stop condition.

Solo dopo chiedi all’AI di implementare o progettare il task. Alla fine confronta ciò che avevi previsto, ciò che l’agente ha aggiunto, ciò che ha interpretato diversamente e ciò che avresti probabilmente accettato senza il foglio iniziale.

---

## Domande di autovalutazione

1. So spiegare la differenza tra abbondanza dell’execution e riduzione della complessità del sistema?
2. So riconoscere quando sto usando il prompt come interfaccia e quando invece lo sto usando per evitare di chiarire il problema?
3. Davanti a una demo funzionante, so descrivere quali claim posso fare e quali no?
4. So valutare il blast radius di una modifica senza guardare soltanto la dimensione del diff?
5. So distinguere feedback locale e feedback di sistema?
6. So riconoscere un workflow che genera AI fatigue?
7. So indicare quali informazioni dovrebbero vivere nel repository invece che nella cronologia di una chat?
8. So definire quale fonte è autorevole quando codice, documentazione e issue si contraddicono?
9. So usare l’AI per generare alternative e critica, non soltanto implementazione?
10. So fermare l’execution quando mi accorgo che stiamo trasformando assunzioni non comprese in struttura permanente?

Se alcune risposte sono “no”, non serve memorizzare un’altra lista di best practice. È più utile osservare il prossimo task reale e identificare dove il processo perde contesto o produce falsa confidenza.

---

## Cosa cambia con l’AI

Partire dal codice troppo presto, innamorarsi di una demo, copiare pattern senza comprenderli, accumulare complessità, produrre documentazione obsoleta o misurare output invece di valore erano problemi possibili anche prima dei modelli generativi. L’AI non li inventa: li rende più veloci.

Allo stesso tempo, rende più economiche molte contromisure. Possiamo esplorare alternative, generare test, costruire prototipi scartabili, cercare failure mode, documentare, eseguire review indipendenti, analizzare repository e automatizzare controlli con un costo marginale molto più basso.

La tecnologia amplifica entrambe le direzioni. Per questo la domanda professionale non è “quanto velocemente può lavorare l’AI?”, ma:

> **Quale processo stiamo rendendo più veloce?**

---

## Verso il Capitolo 2

Abbiamo identificato il rischio: l’execution può partire prima che il problema sia abbastanza chiaro. Il passo successivo non è aggiungere più architettura, ma tornare indietro rispetto ai componenti, ai pattern, al cloud e perfino al codice.

Nel prossimo capitolo costruiremo la foundation minima che rende utile l’execution. Chiariremo problema, utenti, outcome, scope, vincoli, requisiti e acceptance criteria non per produrre documentazione, ma per evitare che la velocità trasformi ambiguità in sistema.

## Corollario

> **La velocità non corregge la direzione. La rende più importante.**
