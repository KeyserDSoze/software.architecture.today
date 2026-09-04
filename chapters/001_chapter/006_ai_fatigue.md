## AI fatigue

L’AI promette di ridurre il lavoro cognitivo, e può farlo davvero. Esiste però anche il fenomeno opposto: un modo di lavorare in cui passiamo la giornata a leggere output, correggere output, rilanciare prompt, confrontare varianti, ricostruire il contesto e decidere se accettare cambiamenti che non abbiamo scritto personalmente.

Il risultato è una forma particolare di stanchezza. Non deriva dalla digitazione, ma dalla supervisione continua. La chiameremo **AI fatigue**.

### Il loop che consuma attenzione

Il pattern tipico è semplice:

```text
prompt
→ output
→ lettura
→ correzione
→ nuovo prompt
→ nuovo output
→ altra lettura
→ altra correzione
```

Ogni iterazione sembra piccola, ma richiede continui context switch. Dobbiamo ricordare che cosa avevamo chiesto, quali vincoli erano già stati chiariti, quale parte dell’output precedente fosse corretta, quale nuova assunzione sia comparsa e quali conseguenze non siano ancora state verificate. Quando il lavoro viene frammentato in decine di micro-interazioni, l’essere umano rischia di diventare il collo di bottiglia del coordinamento.

### Più conversazione non significa più controllo

Un errore intuitivo è pensare che supervisionare bene significhi intervenire continuamente. In realtà, molte interazioni sono il sintomo di una delega mal definita e di un contesto che deve essere ricostruito a ogni passaggio.

Immaginiamo un task di autenticazione. Possiamo procedere per correzioni successive — “fai login”, “usa JWT”, “non così, abbiamo già Entra ID”, “deve supportare anche service-to-service”, “non mettere i role nel client” — oppure partire da un contesto che dichiara identity provider, protocollo per gli utenti interattivi, strategia service-to-service, regole di autorizzazione e security boundary.

Il secondo workflow contiene meno conversazione e, paradossalmente, più controllo. Questo perché il controllo non deriva dal numero di messaggi, ma dalla qualità dei vincoli, delle fonti e dei checkpoint.

### Il costo del contesto ricostruito

Un agente può non vedere parte del contesto, una nuova sessione può non conoscere decisioni precedenti e un task assegnato a un agente diverso può ricevere una versione incompleta della storia. Se le informazioni importanti vivono soltanto nella conversazione, l’essere umano deve ricostruirle continuamente.

È faticoso ed è fragile. Da qui nasce una delle tesi che svilupperemo più avanti:

> **Il repository deve diventare memoria operativa del progetto.**

Decisioni, boundary, contratti e convenzioni importanti non dovrebbero vivere soltanto nella testa del team o nella cronologia di una chat. Devono avere una rappresentazione sufficientemente stabile da poter essere ritrovate, verificate e aggiornate.

### Deleghe più grandi, ma non più vaghe

Per ridurre AI fatigue può essere utile delegare blocchi di lavoro più grandi, ma “più grande” non significa “meno specificato”. Un task ampio funziona meglio quando rende chiari obiettivo, contesto, vincoli, acceptance criteria, artefatti da leggere, test attesi, out of scope e stop condition.

In questo modo l’agente può attraversare più execution senza chiedere conferma a ogni passo, mentre l’umano interviene sui checkpoint che cambiano davvero il rischio o la decisione. È il passaggio dal micro-management conversazionale a una **delega con contratto e review per checkpoint**.

### La fatica della review infinita

C’è un’altra fonte di AI fatigue: il volume delle modifiche. Se un agente può produrre in trenta minuti ciò che prima richiedeva due giorni, la review non diventa automaticamente più veloce. Una pull request enorme resta enorme, e può essere persino più difficile da comprendere perché il reviewer non possiede il contesto incrementale di chi avrebbe costruito la modifica passo dopo passo.

Per questo servono task verticali ma contenuti, commit con un intento leggibile e diff meccanici separati da quelli semantici. Un buon summary deve indicare le decisioni e i file ad alto rischio, mentre test evidence e reviewer indipendenti possono preparare il terreno prima dell’intervento umano. Anche il numero di cambiamenti aperti in parallelo deve restare proporzionato alla capacità reale del team di assorbirli.

La capacità degli agenti di produrre lavoro deve essere bilanciata dalla capacità del sistema umano di comprenderlo.

### Non diventare una macchina per approvare

Il fallimento peggiore non è essere stanchi. È sviluppare una routine di approvazione superficiale. Quando riceviamo troppo output, possiamo iniziare a leggere soltanto il summary, il numero di test verdi, il titolo della pull request e qualche file principale, per poi fare merge non perché abbiamo costruito confidence, ma perché abbiamo esaurito l’attenzione.

A quel punto l’essere umano è formalmente nel loop ma sostanzialmente fuori dal processo decisionale. È un human-in-the-loop teatrale.

La presenza di una persona non garantisce supervisione reale. Servono tempo sufficiente, evidence leggibile, punti di attenzione già identificati e la possibilità concreta di fermare il cambiamento quando ciò che osserviamo non giustifica il passo successivo.

### Ridurre fatica con la struttura

Molte tecniche che sembrano “processo” sono in realtà strumenti per preservare attenzione. Un ADR evita di ridiscutere continuamente la stessa scelta; un API contract riduce la necessità di inferire ogni volta il comportamento; un `AGENTS.md` evita di ripetere convenzioni operative; una Definition of Done rende meno ambiguo il completamento del task. Stop condition, test automatici e architecture test spostano inoltre controlli ripetitivi dalla memoria del reviewer a meccanismi più affidabili.

La documentazione e l’automazione migliori non aggiungono semplicemente lavoro: **comprano attenzione umana dove il giudizio serve davvero**.

### Il ritmo conta

Un workflow sostenibile alterna momenti diversi: pensare, delegare, lasciare che l’execution proceda, revisionare e integrare. Se tutto diventa una conversazione continua con il modello, perdiamo la possibilità di costruire e mantenere un modello mentale stabile del sistema.

Per questo una disciplina utile nell’AI-native development può sembrare paradossale:

> **Non usare l’AI in ogni secondo in cui potresti usarla.**

Usarla bene significa anche creare spazi in cui l’essere umano ricostruisce il problema, collega le parti e prende decisioni senza essere trascinato dal prossimo output. L’obiettivo non è massimizzare il numero di interazioni con l’AI, ma ottenere il risultato con il minor numero di interazioni necessario per continuare a comprenderlo e governarlo.
