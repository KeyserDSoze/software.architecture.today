## Acceptance criteria: decidere prima come riconosceremo il risultato

Una feature è difficile da delegare quando non sappiamo come valutarla.

Questo vale per un collega.

Vale ancora di più per un agente.

Gli acceptance criteria trasformano una richiesta generica in un insieme di condizioni osservabili.

Non devono descrivere tutta l'implementazione.

Devono dire che cosa deve essere vero perché possiamo considerare il comportamento accettabile.

### Done non significa compilato

Un agente può produrre codice che:

- compila;
- passa i test esistenti;
- rispetta lo stile del repository;
- sembra coerente con il task.

Eppure la feature può non essere “done”.

Per esempio:

> “Aggiungi la possibilità di prendere in carico un ordine problematico.”

Un'implementazione può salvare un `assignedUserId` nel database.

Ma restano domande:

- due operatori possono prendere in carico lo stesso ordine contemporaneamente?
- cosa vede il secondo?
- l'assegnazione è auditabile?
- un operatore può liberare il caso?
- un amministratore può riassegnarlo?
- l'utente deve vedere immediatamente il nuovo stato?
- cosa succede se la richiesta viene ripetuta?

Il codice può esistere senza che il comportamento sia definito.

### Acceptance criteria come esempi

Una forma utile è descrivere scenari.

```text
Dato un ordine non assegnato
quando un operatore autorizzato lo prende in carico
allora l'ordine mostra quell'operatore come assegnatario.
```

Poi aggiungiamo i casi che cambiano la semantica:

```text
Dato un ordine già assegnato a un altro operatore
quando un secondo operatore tenta di prenderlo in carico
allora il sistema non sovrascrive silenziosamente l'assegnazione
ed espone lo stato corrente.
```

Non dobbiamo trasformare ogni requisito in centinaia di scenari Gherkin.

La forma è meno importante del principio:

> **rendere osservabile il confine tra corretto e non corretto.**

### Acceptance criteria e invarianti

Alcune condizioni sono più profonde di uno scenario.

Sono invarianti.

Per Order Operations potremmo avere:

```text
- un ordine appartiene a un solo tenant;
- un operatore non può leggere ordini di tenant non autorizzati;
- la presa in carico non modifica lo stato commerciale dell'ordine;
- una richiesta ripetuta non deve produrre due assegnazioni concorrenti valide;
- ogni cambio di assegnatario deve essere ricostruibile dall'audit trail.
```

Queste condizioni sono preziose perché attraversano UI, API, database e test.

Un agente può cambiare l'implementazione mantenendo gli invarianti.

Questo è esattamente il tipo di libertà che vogliamo.

### Il test prima del codice, senza dogma

Non serve trasformare questo capitolo in una difesa universale del Test-Driven Development.

Ma esiste una domanda estremamente utile da porre prima dell'execution:

> **Che evidenza ci convincerebbe che questa feature funziona?**

La risposta può essere:

- un test automatico;
- una proprietà invariabile;
- un benchmark;
- un test manuale guidato;
- un contract test;
- una query di verifica;
- una metrica osservata;
- una review di sicurezza;
- una combinazione di questi elementi.

Il punto è evitare di definire la verifica soltanto dopo aver visto la soluzione.

Quando lo facciamo, rischiamo di scegliere test che confermano ciò che abbiamo già costruito.

### Definition of Done

Gli acceptance criteria descrivono il comportamento.

La Definition of Done può includere anche condizioni di delivery.

Per esempio:

```text
Definition of Done
- acceptance criteria soddisfatti;
- test automatici aggiunti e verdi;
- nessun nuovo warning di static analysis;
- migrazione reversibile o rollback documentato;
- metriche/log necessari presenti;
- documentazione del comportamento aggiornata;
- nessuna modifica fuori scope;
- security review richiesta se cambia un permission boundary.
```

Non tutte le feature richiedono tutti questi punti.

La Definition of Done deve essere proporzionata al rischio e alle convenzioni del progetto.

### Acceptance criteria e stop condition

Gli acceptance criteria dicono quando possiamo dire “successo”.

Le stop condition dicono quando dobbiamo dire “fermati”.

Sono complementari.

Un task AI-ready potrebbe contenere:

```text
Acceptance
- il comportamento A è osservabile;
- il caso B è gestito;
- l'invariante C rimane vero.

Stop
- serve cambiare il modello di autorizzazione;
- emerge una migration distruttiva;
- il requisito entra in conflitto con un contratto esistente;
- non è possibile verificare l'invariante C con gli strumenti disponibili.
```

L'agente non riceve soltanto una destinazione.

Riceve anche i guardrail del percorso.

### Criteri troppo prescrittivi

Gli acceptance criteria possono diventare un altro modo per microgestire l'implementazione.

Per esempio:

> “Deve essere creata una classe `OrderAssignmentManager` con metodo `AssignAsync`, una tabella `OrderAssignments` e un endpoint `POST /api/v2/orders/{id}/assign`.”

Forse queste sono decisioni corrette.

Ma non sono acceptance criteria.

Sono design.

Se prescriviamo il design prima di averlo valutato, perdiamo la possibilità di confrontare alternative.

Meglio separare:

```text
Cosa deve essere vero
```

da:

```text
Come scegliamo di renderlo vero
```

Questa separazione diventerà centrale quando parleremo di ADR.

### Criteri che proteggono dal demo-driven confidence

Nel capitolo precedente abbiamo visto che una demo convincente può creare una fiducia sproporzionata.

Gli acceptance criteria sono uno degli antidoti.

Una demo può mostrare:

> “Guarda, l'operatore prende in carico l'ordine.”

Gli acceptance criteria ci ricordano di verificare anche:

- concorrenza;
- autorizzazione;
- audit;
- idempotenza;
- errore;
- osservabilità.

Non perché ogni feature debba essere perfetta.

Perché il significato di “funziona” deve essere deciso prima che l'interfaccia funzionante ci seduca.

### Una regola pratica

Prima di delegare un task significativo, proviamo a completare:

> **Considereremo il task completato quando...**

Se la frase termina con:

> “...il codice è stato scritto”

non abbiamo ancora definito il risultato.

Se termina con condizioni osservabili, abbiamo iniziato a costruire un contratto di execution.