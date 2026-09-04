## Idee chiave

Questo capitolo non sostiene che il software engineering sia diventato più difficile perché esiste l'AI.

Sostiene qualcosa di più preciso.

L'AI modifica il rapporto tra **pensiero ed execution**.

Quando produrre artefatti costa meno, alcune vecchie forme di attrito scompaiono. È un vantaggio enorme.

Ma scompare anche una parte del tempo che, volontariamente o meno, ci costringeva a incontrare certe domande prima che il sistema crescesse troppo.

Le idee da portare avanti sono queste.

1. **Produrre software e costruire buoni sistemi non sono sinonimi.** Un'applicazione può essere generata rapidamente senza che i suoi requisiti, failure mode o costi siano stati compresi.

2. **L'execution abbondante sposta il collo di bottiglia.** Diventano più preziosi chiarezza, judgment, integrazione e verifica.

3. **Ogni artefatto economico da creare può restare costoso da possedere.** Codice, servizi, dipendenze, test e documentazione introducono costi futuri.

4. **L'AI può essere usata per comprare qualità, non soltanto volume.** Alternative, review indipendenti, test avversariali e prototipi scartabili sono forme di execution ad alto valore.

5. **Prompt-first development significa trasformare l'incertezza direttamente in implementazione.** Il problema non è usare prompt; è chiedere al prompt di inventare contemporaneamente problema, design e soluzione.

6. **Il repository insegna agli agenti.** Convenzioni buone e cattive vengono propagate attraverso il codice esistente.

7. **Una demo produce evidenza parziale.** Dimostra un percorso osservato, non production readiness.

8. **Il blast radius è semantico.** Una modifica piccola può avere conseguenze enormi; una trasformazione meccanica ampia può essere relativamente sicura.

9. **Un feedback loop veloce è utile soltanto se osserva ciò che conta.** Ottimizzare localmente può peggiorare il sistema globale.

10. **AI fatigue è un problema di sistema di lavoro.** Più micro-interazioni non equivalgono a più controllo.

11. **Context engineering supera il singolo prompt.** Repository, contratti, ADR, test, issue, tool e permission boundary fanno parte del contesto operativo.

12. **Più contesto non significa automaticamente contesto migliore.** Serve contesto affidabile, navigabile e proporzionato al task.

13. **Il prototipo è uno strumento di apprendimento.** Non tutte le decisioni nate nel prototipo meritano di diventare fondazione.

14. **Prima capire, poi costruire.** Non significa aspettare di sapere tutto. Significa capire abbastanza da sapere che cosa stiamo chiedendo all'execution di moltiplicare.

---

## Esercizi

### Esercizio 1 — Togliere output

Prendi una feature recente su cui hai lavorato o inventane una realistica.

Elenca tutti gli artefatti che un'AI potrebbe produrre rapidamente:

- codice;
- test;
- documentazione;
- infrastruttura;
- dashboard;
- migration;
- script;
- configurazioni.

Ora elimina dalla lista tutto ciò che non è necessario per ottenere l'outcome desiderato.

Per ogni elemento rimasto rispondi:

1. quale problema risolve?
2. quale costo di ownership introduce?
3. chi dovrà mantenerlo?
4. come potremmo evitarlo?

L'obiettivo non è minimizzare il software a ogni costo.

È allenarsi a distinguere capacità di generazione e necessità.

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

Identifica almeno dieci decisioni importanti che sono state lasciate implicitamente all'execution.

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

Hai davanti una demo di un'applicazione che:

- autentica utenti;
- accetta pagamenti;
- salva ordini;
- invia email;
- ha test automatici;
- viene deployata tramite pipeline.

La demo funziona perfettamente.

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

Per ogni scelta esplicita:

- boundary coinvolti;
- reversibilità;
- persistenza;
- compatibilità;
- security impact;
- osservabilità richiesta.

Non esiste un ordine universale corretto. Devi difendere il tuo.

### Esercizio 5 — Progettare feedback

Un agente deve ridurre la latenza di un endpoint critica.

Definisci un feedback loop che non si limiti alla latenza locale.

Includi almeno:

- performance;
- correttezza;
- consistenza;
- failure;
- costo;
- sicurezza;
- segnali dopo il deploy.

Poi identifica quali controlli devono essere eseguiti prima del merge e quali possono essere osservati soltanto durante rollout o produzione.

### Esercizio 6 — Ridurre AI fatigue

Prendi un workflow in cui interagisci frequentemente con un assistente o un coding agent.

Conta, anche approssimativamente:

- quante volte devi ripetere il contesto;
- quante correzioni derivano da requisiti non esplicitati;
- quante review riguardano sempre la stessa regola;
- quante informazioni vivono soltanto nella chat.

Progetta una versione alternativa del workflow usando almeno tre tra:

- documento stabile;
- contract;
- ADR;
- AGENTS.md;
- test automatico;
- architecture test;
- issue template;
- stop condition.

L'obiettivo è ridurre interazioni senza ridurre controllo.

### Esercizio 7 — Context engineering

Devi delegare a un agente la modifica di un flusso di autenticazione.

Costruisci due pacchetti di contesto.

**Pacchetto A:** tutto ciò che potresti dare all'agente.

**Pacchetto B:** il contesto minimo sufficiente per il task.

Spiega cosa hai escluso dal secondo e perché.

Poi definisci una gerarchia delle fonti in caso di contraddizione, per esempio:

```text
security policy
> ADR attivo
> contract
> codice esistente
> vecchio README
```

La tua gerarchia può essere diversa, ma deve essere esplicita.

### Esercizio 8 — Adversarial review

Chiedi a un agente AI di progettare una feature non banale.

Non implementarla.

Poi assegna a un secondo agente questo ruolo:

> “Assumi che il design proposto sia pericolosamente incompleto. Trova assunzioni implicite, failure mode, costi nascosti, problemi di sicurezza e decisioni difficili da invertire.”

Confronta i due output.

Annota:

- cosa il primo agente non aveva considerato;
- cosa il reviewer ha inventato senza evidenza;
- quali critiche cambiano davvero la decisione;
- quali sono soltanto possibilità teoriche.

### Esercizio 9 — Order Operations

Riprendi il caso Order Operations.

Il requisito iniziale è:

> “Inserire e consultare ordini.”

Senza progettare ancora la soluzione finale, elenca:

- dieci domande che vorresti fare al product owner;
- cinque assunzioni che accetteresti temporaneamente per un prototipo;
- cinque assunzioni che non lasceresti implicite neppure nel prototipo;
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

Solo dopo chiedi all'AI di implementare o progettare il task.

Alla fine confronta:

- ciò che avevi previsto;
- ciò che l'agente ha aggiunto;
- ciò che l'agente ha interpretato diversamente;
- ciò che avresti probabilmente accettato senza il foglio iniziale.

---

## Domande di autovalutazione

1. So spiegare la differenza tra abbondanza dell'execution e riduzione della complessità del sistema?
2. So riconoscere quando sto usando il prompt come interfaccia e quando invece lo sto usando per evitare di chiarire il problema?
3. Davanti a una demo funzionante, so descrivere quali claim posso fare e quali no?
4. So valutare il blast radius di una modifica senza guardare soltanto la dimensione del diff?
5. So distinguere feedback locale e feedback di sistema?
6. So riconoscere un workflow che genera AI fatigue?
7. So indicare quali informazioni dovrebbero vivere nel repository invece che nella cronologia di una chat?
8. So definire quale fonte è autorevole quando codice, documentazione e issue si contraddicono?
9. So usare l'AI per generare alternative e critica, non soltanto implementazione?
10. So fermare l'execution quando mi accorgo che stiamo trasformando assunzioni non comprese in struttura permanente?

Se alcune risposte sono “no”, non è necessario memorizzare una nuova lista di best practice.

È più utile osservare il prossimo task reale e identificare dove il processo perde contesto o produce falsa confidenza.

---

## Cosa cambia con l'AI

Senza AI era già possibile:

- partire dal codice troppo presto;
- innamorarsi di una demo;
- copiare pattern senza comprenderli;
- accumulare complessità;
- produrre documentazione obsoleta;
- misurare output invece di valore.

L'AI non inventa questi problemi.

Li rende più veloci.

E allo stesso tempo rende più economiche molte delle contromisure:

- esplorare alternative;
- generare test;
- costruire prototipi scartabili;
- cercare failure mode;
- documentare;
- eseguire review indipendenti;
- analizzare repository;
- automatizzare controlli.

La tecnologia amplifica entrambe le direzioni.

Per questo la domanda professionale non è:

> “Quanto velocemente può lavorare l'AI?”

È:

> **“Quale processo stiamo rendendo più veloce?”**

---

## Verso il Capitolo 2

Abbiamo identificato il rischio.

L'execution può partire prima che il problema sia abbastanza chiaro.

Il passo successivo non è aggiungere più architettura.

È tornare indietro.

Prima dei componenti.

Prima dei pattern.

Prima del cloud.

Prima persino del codice.

Nel prossimo capitolo costruiremo la foundation minima che permette all'execution di essere utile:

- problema;
- utenti;
- outcome;
- scope;
- vincoli;
- requisiti;
- acceptance criteria.

Non per produrre documentazione.

Per evitare che la velocità trasformi ambiguità in sistema.

## Corollario

> **La velocità non corregge la direzione. La rende più importante.**
