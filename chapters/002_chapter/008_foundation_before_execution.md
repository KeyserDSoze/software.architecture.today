## Foundation Before Execution senza trasformarlo in waterfall

A questo punto possiamo precisare il principio centrale del capitolo:

> **Prima capire, poi costruire.**

Preso alla lettera potrebbe sembrare impossibile, perché non possiamo capire tutto prima di costruire. Spesso costruiamo proprio per imparare: un prototipo rivela limiti che nessun documento avrebbe mostrato, una spike verifica un’assunzione, un test con utenti può smentire il problem framing e una prima implementazione può mostrare che un requisito era troppo costoso o formulato male.

Il principio quindi non significa “prima conoscenza completa, poi implementation completa”. Significa arrivare a **abbastanza comprensione per il rischio che stiamo per assumere**, eseguire in modo controllato, raccogliere nuova evidence e aggiornare la decisione.

### Build to learn vs build to ship

Una distinzione utile è tra due forme di execution.

**Build to learn** significa costruire qualcosa per ridurre incertezza: un prototipo, una spike, un benchmark, una proof of concept, una simulazione, un test di integrazione o un esperimento con utenti. Il suo criterio di successo è l’apprendimento.

**Build to ship** significa invece costruire qualcosa destinato a diventare parte del prodotto o della piattaforma. In questo caso il criterio di successo include anche qualità, operabilità, sicurezza, evolvibilità e ownership.

Confondere le due cose è pericoloso. Un prototipo che dimostra fattibilità non è automaticamente una base produttiva e una spike può essere deliberatamente brutta. Il problema nasce quando il codice usa-e-getta diventa produzione perché “ormai funziona”.

### Il livello di foundation dipende dal blast radius

Più alto è il costo dell’errore o dell’inversione, più foundation serve prima dell’execution. Per un cambiamento piccolo, reversibile e ben coperto può bastare una issue chiara. Una nuova feature persistente, un contratto API o un’integrazione esterna richiedono spesso un Problem & Outcome Brief e acceptance criteria espliciti. Un cambiamento che tocca schema dati difficile da invertire, security boundary, pagamenti, isolamento multi-tenant o infrastruttura condivisa richiede invece più decisioni esplicite e artefatti specializzati.

Non perché il progetto sia “enterprise”, ma perché l’errore costa di più.

### One-way door e two-way door

Una **two-way door** è una scelta relativamente semplice da invertire; una **one-way door** è costosa o rischiosa da annullare. Possiamo sperimentare rapidamente sul testo di un bottone, mentre decidere come partizionare dati destinati a crescere enormemente merita un livello di analisi diverso.

L’AI riduce il costo di implementare entrambe le decisioni. Non riduce necessariamente il costo di invertirle. È uno dei motivi per cui la capacità di produrre software non elimina l’architettura: la rende più selettiva, costringendoci a capire **quali decisioni meritano davvero tempo**.

### La foundation come checkpoint, non come fase chiusa

Il modello che ci interessa non è `requirements complete → architecture complete → development complete → test complete`. Un flusso realistico alterna problem framing, decisione, execution, evidence e aggiornamento del contesto.

Il brief può cambiare, i requisiti possono essere raffinati, lo scope restringersi, un’assunzione cadere e un NFR diventare significativo soltanto dopo una misurazione. Quello che non vogliamo è un processo in cui il codice diventi l’unico luogo in cui queste scoperte vengono registrate.

### Quando fermare il framing

Esiste anche l’overanalysis. Possiamo continuare a fare domande indefinitamente, quindi serve un controllo di readiness che non diventi un rito.

Prima di una execution significativa dovremmo sapere quale problema vogliamo migliorare, per chi e con quale outcome; lo scope e i vincoli che possono cambiare la soluzione devono essere abbastanza visibili; i comportamenti essenziali e i failure ad alto impatto devono essere comprensibili. Dobbiamo inoltre sapere quale evidence useremo per valutare il risultato, quali assunzioni sono rischiose, quali decisioni restano aperte e quando il team o l’agente deve fermarsi ed escalare.

Non serve avere una risposta perfetta a tutto. Serve sapere dove l’incertezza rimane e se siamo disposti ad assumerla.

### Foundation e velocità

La foundation viene spesso percepita come un costo aggiuntivo. In realtà può aumentare la velocità complessiva perché sposta in anticipo il rework evitabile.

Senza foundation, il lavoro tende a produrre una catena di implementazione, scoperta di ambiguità, nuova interpretazione, refactoring, scoperta di un vincolo e ulteriore cambio di design. Con una foundation sufficiente alcune di queste collisioni vengono anticipate: rendiamo visibile l’ambiguità, decidiamo, deleghiamo e poi verifichiamo.

Non eliminiamo il cambiamento. Riduciamo il **rework evitabile**.

### Il vero obiettivo: decision velocity

Il tempo di sviluppo non è l’unico tempo che conta. Esiste anche il tempo necessario a prendere decisioni affidabili.

Un team può scrivere codice velocemente e restare lento perché le decisioni vengono continuamente riaperte, nessuno sa quale documento sia autorevole, i requisiti cambiano senza essere resi espliciti, le assunzioni emergono soltanto in review e ogni agente deve ricostruire il contesto. In quel sistema, la pull request finisce per essere il luogo in cui discutiamo contemporaneamente prodotto, architettura e implementazione.

Una buona foundation aumenta la **decision velocity**. Le persone sanno che cosa è già deciso, che cosa è aperto e che cosa richiede escalation. Gli agenti possono lavorare con più autonomia perché il campo di gioco è più definito.

### Il test dell’utilità

Ogni artefatto introdotto in questo libro deve superare una domanda:

> **Questo documento modifica o migliora una decisione?**

Se la risposta è no, probabilmente è documentation theater. Il Problem & Outcome Brief è utile quando ci impedisce di costruire la cosa sbagliata, limita scope accidentale, distingue constraint da preferenze, rende visibili assunzioni, produce acceptance criteria o permette di delegare senza trasferire decisioni implicite. Se non fa almeno una di queste cose, possiamo farne a meno.

### Cosa viene dopo

Ora abbiamo una foundation, ma non abbiamo ancora un sistema. Nel prossimo capitolo cambieremo prospettiva: smetteremo di guardare la feature come una collezione di requisiti locali e inizieremo a osservare attori, confini, dipendenze, failure propagation, feedback loop e ownership.

Passeremo, in altre parole, da **capire il problema** a **pensare per sistemi**.

La foundation non ci dà la soluzione. Ci dà qualcosa di più utile in questa fase:

> **un problema che vale la pena progettare.**
