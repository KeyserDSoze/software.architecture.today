## Acceptance criteria: decidere prima come riconosceremo il risultato

Una feature è difficile da delegare quando non sappiamo come valutarla. Vale tra colleghi e vale ancora di più quando l’execution viene affidata a un agente.

Gli acceptance criteria trasformano una richiesta generica in condizioni osservabili. Non devono descrivere tutta l’implementazione: devono chiarire che cosa deve essere vero perché possiamo considerare il comportamento accettabile.

### Done non significa compilato

Un agente può produrre codice che compila, passa i test esistenti, rispetta lo stile del repository e sembra coerente con il task. Eppure la feature può non essere “done”.

Prendiamo la richiesta “Aggiungi la possibilità di prendere in carico un ordine problematico”. Salvare un `assignedUserId` nel database non basta a definire il comportamento. Dobbiamo sapere che cosa accada se due operatori tentano l’assegnazione contemporaneamente, se l’assegnazione sia auditabile, se il caso possa essere rilasciato o riassegnato, quanto rapidamente il nuovo stato debba diventare visibile e che cosa succeda quando la stessa richiesta viene ripetuta.

Il codice può esistere anche quando la semantica non è ancora definita.

### Acceptance criteria come esempi

Gli scenari sono utili quando rendono evidente il confine tra corretto e non corretto. Per esempio:

```text
Dato un ordine non assegnato
quando un operatore autorizzato lo prende in carico
allora l'ordine mostra quell'operatore come assegnatario.
```

La semantica cambia quando introduciamo concorrenza:

```text
Dato un ordine già assegnato a un altro operatore
quando un secondo operatore tenta di prenderlo in carico
allora il sistema non sovrascrive silenziosamente l'assegnazione
ed espone lo stato corrente.
```

Non dobbiamo trasformare ogni requisito in centinaia di scenari Gherkin. La forma è meno importante del principio: **rendere osservabile il confine tra corretto e non corretto**.

### Acceptance criteria e invarianti

Alcune condizioni sono più profonde di uno scenario e meritano di essere trattate come invarianti. In Order Operations, per esempio, un ordine appartiene a un solo tenant, un operatore non può leggere ordini di tenant non autorizzati, la presa in carico non deve modificare lo stato commerciale e ogni cambio di assegnatario deve essere ricostruibile dall’audit trail. Anche la concorrenza deve rispettare una proprietà chiara: una richiesta ripetuta o simultanea non può creare due assegnazioni valide incompatibili.

Queste condizioni attraversano UI, API, database e test. Un agente può cambiare l’implementazione mantenendo gli invarianti, ed è esattamente il tipo di libertà che vogliamo.

### Il test prima del codice, senza dogma

Non serve trasformare il capitolo in una difesa universale del Test-Driven Development. Esiste però una domanda estremamente utile da porre prima dell’execution:

> **Che evidence ci convincerebbe che questa feature funziona?**

La risposta può essere un test automatico, una proprietà invariabile, un benchmark, un test manuale guidato, un contract test, una query di verifica, una metrica osservata o una security review. Spesso serve una combinazione di queste forme.

Il punto è evitare di definire la verifica soltanto dopo aver visto la soluzione. Se lo facciamo, rischiamo di scegliere controlli che confermano ciò che abbiamo già costruito invece di mettere alla prova ciò che conta.

### Definition of Done

Gli acceptance criteria descrivono il comportamento. La Definition of Done può includere anche condizioni di delivery e qualità del cambiamento. In un progetto concreto potrebbe richiedere, oltre agli acceptance criteria, test automatici verdi, assenza di nuovi warning, rollback o migration strategy, telemetry necessaria, documentazione aggiornata e nessuna modifica fuori scope. Se cambia un permission boundary, potrebbe richiedere anche una security review.

Non tutte le feature hanno bisogno dello stesso insieme di controlli. La Definition of Done deve essere proporzionata al rischio e alle convenzioni del progetto.

### Acceptance criteria e stop condition

Gli acceptance criteria dicono quando possiamo parlare di successo; le stop condition dicono quando non siamo più autorizzati a continuare. Sono due lati dello stesso contratto.

Un task può dichiarare che il comportamento A deve essere osservabile, il caso B deve essere gestito e l’invariante C deve restare vero. Nello stesso tempo può imporre uno stop se serve cambiare il modello di autorizzazione, emerge una migration distruttiva, il requisito confligge con un contratto esistente o non siamo in grado di verificare l’invariante con gli strumenti disponibili.

L’agente non riceve soltanto una destinazione. Riceve anche i guardrail del percorso.

### Criteri troppo prescrittivi

Gli acceptance criteria possono diventare un altro modo per microgestire l’implementazione. Una frase come “creare una classe `OrderAssignmentManager`, una tabella `OrderAssignments` e un endpoint `POST /api/v2/orders/{id}/assign`” potrebbe descrivere un design ragionevole, ma non descrive il criterio con cui giudicheremo il risultato.

Dobbiamo tenere separati **ciò che deve essere vero** e **come scegliamo di renderlo vero**. Questa distinzione diventerà centrale quando parleremo di ADR.

### Criteri che proteggono dal demo-driven confidence

Nel capitolo precedente abbiamo visto quanto una demo convincente possa creare una fiducia sproporzionata. Gli acceptance criteria sono uno degli antidoti. La demo può mostrarci che un operatore prende in carico un ordine; i criteri ci ricordano di controllare anche concorrenza, autorizzazione, audit, idempotenza, comportamento in errore e osservabilità, se questi aspetti appartengono al rischio della feature.

Non perché ogni feature debba essere perfetta, ma perché il significato di “funziona” deve essere deciso prima che l’interfaccia funzionante ci seduca.

### Una regola pratica

Prima di delegare un task significativo, completiamo la frase:

> **Considereremo il task completato quando...**

Se la risposta termina con “il codice è stato scritto”, non abbiamo ancora definito il risultato. Se termina con condizioni osservabili, abbiamo iniziato a costruire un vero contratto di execution.
