## AI fatigue

L'AI promette di ridurre lavoro cognitivo.

Può farlo davvero.

Ma esiste anche il fenomeno opposto: un modo di lavorare in cui passiamo la giornata a leggere output, correggere output, rilanciare prompt, confrontare varianti, spiegare di nuovo il contesto e decidere se accettare cambiamenti che non abbiamo scritto.

Il risultato può essere una forma particolare di stanchezza.

Non stanchezza da digitazione.

Stanchezza da supervisione continua.

La chiameremo **AI fatigue**.

### Il loop che consuma attenzione

Il pattern tipico è:

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

Ogni iterazione sembra piccola.

Ma richiede continui context switch.

Dobbiamo ricordare:

- che cosa avevamo chiesto;
- quali vincoli erano già stati chiariti;
- quale parte dell'output precedente era corretta;
- quale nuova assunzione è stata introdotta;
- quali file sono cambiati;
- quali conseguenze non sono ancora state verificate.

Se il lavoro è frammentato in decine di micro-interazioni, l'essere umano può diventare il collo di bottiglia del coordinamento.

### Più conversazione non significa più controllo

Un errore intuitivo è pensare che supervisionare bene significhi intervenire continuamente.

In realtà, una delega mal definita può produrre molte interazioni proprio perché manca una base condivisa.

Confrontiamo due workflow.

Il primo:

```text
“Fai login.”
→ output
“Usa JWT.”
→ output
“Non così, abbiamo già Entra ID.”
→ output
“Deve supportare anche service-to-service.”
→ output
“Non mettere i role nel client.”
→ output
```

Il secondo parte da un contesto migliore:

```text
identity provider: Microsoft Entra ID
interactive users: OIDC Authorization Code + PKCE
service-to-service: managed identity / workload identity quando disponibile
roles: valutati server-side
client: nessuna autorizzazione affidata alla sola UI
security boundaries: docs/security/identity.md
```

Poi arriva il task.

Il secondo workflow può contenere meno conversazione e più controllo.

Questo perché il controllo non deriva dal numero di messaggi.

Deriva dalla qualità dei vincoli e dei checkpoint.

### Il costo del contesto ricostruito

Un agente può perdere o non vedere parte del contesto.

Una nuova sessione può non conoscere decisioni prese in precedenza.

Un task assegnato a un agente diverso può ricevere una versione incompleta della storia.

Se il contesto vive soltanto nella conversazione, l'essere umano deve ricostruirlo continuamente.

Questo è faticoso e fragile.

Da qui nasce una delle tesi che svilupperemo più avanti:

> **il repository deve diventare memoria operativa del progetto.**

Decisioni, boundary, contratti e convenzioni importanti non dovrebbero esistere soltanto nella testa del team o nella cronologia di una chat.

Devono avere una rappresentazione sufficientemente stabile.

### Deleghe più grandi, ma non più vaghe

Per ridurre AI fatigue può essere utile delegare blocchi di lavoro più grandi.

Ma “più grande” non significa “meno specificato”.

Un task più ampio può funzionare bene quando include:

- objective;
- contesto;
- vincoli;
- acceptance criteria;
- artefatti da leggere;
- test attesi;
- out of scope;
- stop condition.

In questo modo l'agente può attraversare più execution senza chiedere conferma a ogni passo.

L'umano interviene su checkpoint significativi.

È il passaggio da:

```text
micro-management conversazionale
```

verso:

```text
delega con contratto + review per checkpoint
```

### La fatica della review infinita

C'è un'altra fonte di AI fatigue: il volume delle modifiche.

Se un agente può produrre in trenta minuti ciò che prima richiedeva due giorni, la review può diventare ingestibile.

Una pull request enorme non diventa più leggibile soltanto perché è stata generata velocemente.

Anzi, può essere più difficile da revisionare perché il reviewer non possiede il contesto incrementale della persona che avrebbe scritto il codice passo dopo passo.

Per questo servono strategie come:

- task verticali ma contenuti;
- commit con intento chiaro;
- diff separati per cambiamenti meccanici e semantici;
- summary delle decisioni;
- indicazione esplicita dei file ad alto rischio;
- test evidence;
- reviewer indipendente prima della review umana;
- limite al numero di cambiamenti paralleli che richiedono attenzione.

La capacità degli agenti di produrre lavoro deve essere bilanciata dalla capacità del sistema umano di assorbirlo.

### Non diventare una macchina per approvare

Il fallimento peggiore non è essere stanchi.

È sviluppare una routine di approvazione superficiale.

Quando riceviamo troppo output, possiamo iniziare a leggere soltanto:

- il summary;
- il numero di test verdi;
- il titolo della PR;
- qualche file principale.

Poi premiamo merge.

A quel punto l'essere umano è formalmente nel loop ma sostanzialmente fuori dal processo decisionale.

Questo è un human-in-the-loop teatrale.

La presenza di una persona non garantisce supervisione reale.

Serve che la persona abbia:

- tempo sufficiente;
- evidenza leggibile;
- punti di attenzione identificati;
- possibilità concreta di fermare il cambiamento.

### Ridurre fatica con la struttura

Molte tecniche che sembrano “processo” sono in realtà strumenti per preservare attenzione.

Per esempio:

- un ADR evita di ridiscutere continuamente la stessa scelta;
- un API contract evita di inferire ogni volta il comportamento;
- un AGENTS.md evita di ripetere convenzioni operative;
- una Definition of Done riduce ambiguità sulla conclusione del task;
- una stop condition evita escalation tardive;
- un test automatico evita verifiche manuali ripetitive;
- un architecture test evita che il reviewer debba controllare sempre lo stesso boundary a occhio.

La documentazione e l'automazione migliori non aggiungono semplicemente lavoro.

**Comprano attenzione umana dove il giudizio serve davvero.**

### Il ritmo conta

Un workflow sostenibile alterna modalità diverse.

Ci sono momenti per pensare.

Momenti per delegare.

Momenti per lasciare che l'execution proceda.

Momenti per revisionare.

Momenti per integrare.

Se tutto diventa una conversazione continua con il modello, perdiamo la possibilità di costruire un modello mentale stabile del sistema.

Per questo una delle discipline più utili nell'AI-native development può sembrare paradossale:

> **non usare l'AI in ogni secondo in cui potresti usarla.**

Usarla bene significa anche creare spazi in cui l'essere umano ricostruisce il problema, confronta le parti e prende decisioni senza essere trascinato dal prossimo output.

L'obiettivo non è avere il maggior numero possibile di interazioni con l'AI.

È avere il minor numero di interazioni necessario per ottenere un risultato che comprendiamo e possiamo governare.
