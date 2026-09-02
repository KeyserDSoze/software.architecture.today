## Autonomia e stop condition

Parlare di “human in the loop” come se esistessero soltanto due stati — umano presente oppure umano assente — è troppo grossolano.

L'autonomia è una scala.

E la domanda utile non è:

> “Possiamo lasciare fare all'AI?”

Ma:

> **“Quali decisioni può prendere autonomamente, entro quali confini e con quali condizioni di arresto?”**

### Cinque livelli di autonomia

Useremo spesso un modello semplice.

#### Livello 0 — Suggerimento

L'AI propone.

L'essere umano esegue o decide ogni modifica.

È il modello classico dell'assistente.

#### Livello 1 — Modifica sotto supervisione

L'agente può modificare file o produrre artefatti, ma ogni cambiamento viene esaminato prima di essere accettato.

È un buon livello per repository nuovi, task delicati o persone che stanno ancora costruendo fiducia nel workflow.

#### Livello 2 — Task limitato con controlli automatici

L'agente riceve un perimetro preciso e può completare il task autonomamente finché:

- resta nello scope;
- i controlli obbligatori passano;
- non incontra una stop condition.

L'umano valuta il risultato finale.

#### Livello 3 — Pull request autonoma

L'agente può esplorare, modificare, testare e aprire una pull request.

La review umana si concentra su decisioni, rischio, evidenza e integrazione.

#### Livello 4 — Integrazione entro policy

L'agente può integrare cambiamenti quando una serie di policy è soddisfatta.

Per esempio:

```text
scope consentito
+ test verdi
+ security scan verde
+ nessun contratto pubblico modificato
+ nessuna migration
+ diff sotto una soglia
+ reviewer automatici senza finding critici
= integrazione consentita
```

L'umano non approva ogni singolo cambiamento, ma governa il sistema di policy.

#### Livello 5 — Autonomia operativa elevata

L'agente può intervenire su sistemi a basso rischio o fortemente sandboxati con controllo umano principalmente per eccezione.

Questo livello richiede guardrail molto maturi.

E non è automaticamente un obiettivo.

### Più autonomia non significa più maturità

È facile raccontare i livelli precedenti come una progressione inevitabile verso il livello 5.

Sarebbe un errore.

La soluzione più matura non è quella con più autonomia.

È quella in cui autonomia, rischio e verificabilità sono allineati.

Un team potrebbe usare livello 4 per aggiornamenti di documentazione e livello 1 per autorizzazioni o migration finanziarie.

Non c'è contraddizione.

C'è proporzionalità.

### Il rischio come funzione di più fattori

Il rischio non dipende soltanto dalla quantità di codice modificato.

Una variazione di cinque righe può essere più pericolosa di un refactoring di cinquemila.

Possiamo ragionare almeno su:

- **blast radius** — quanta parte del sistema può essere influenzata;
- **reversibilità** — quanto costa tornare indietro;
- **osservabilità** — quanto rapidamente ci accorgiamo di un problema;
- **criticità del dominio** — soldi, identità, salute, privacy, compliance;
- **novità** — quanto conosciamo quella tecnologia o quel componente;
- **ambiguità** — quanto sono incompleti i requisiti;
- **testabilità** — quanto possiamo verificare automaticamente;
- **privilegi** — quali risorse l'agente può modificare;
- **tempo di propagazione** — quanto velocemente un errore produce conseguenze.

La stessa capacità tecnica può essere sicura in un contesto e irresponsabile in un altro.

### Stop condition: sapere quando fermarsi

Una stop condition non è un errore del workflow.

È una caratteristica del workflow.

Un agente affidabile non è quello che trova sempre un modo per continuare.

È quello che sa riconoscere quando le premesse della delega non sono più valide.

Esempi:

```text
STOP se il task richiede di cambiare una API pubblica.
STOP se compare una migration distruttiva.
STOP se i test critici falliscono prima della modifica.
STOP se due documenti architetturali si contraddicono.
STOP se servono privilegi non previsti.
STOP se il cambiamento modifica autenticazione o autorizzazione.
STOP se non è possibile costruire una verifica credibile.
STOP se il diff esce dal perimetro concordato.
```

Queste regole possono essere scritte in un'issue, in `AGENTS.md`, in policy automatiche o nel sistema di orchestrazione.

### Escalation non significa fallimento

Nel lavoro umano, chiedere chiarimenti viene talvolta percepito come rallentamento.

Con agenti molto veloci rischiamo di amplificare questa cultura.

Ma una buona escalation è spesso segno di qualità.

Se il sistema scopre una decisione che non dovrebbe prendere autonomamente, deve portarcela in una forma utile.

Per esempio:

```text
Blocco: il requisito richiede di cancellare definitivamente i dati utente,
ma la policy di retention prevede conservazione per 30 giorni.

Alternative:
A. soft delete + purge differita;
B. modifica della retention policy;
C. eccezione esplicita per questa tipologia di dato.

Impatto: privacy, audit, storage, restore.
```

Questa è un'escalation di qualità.

Non dice soltanto “non so cosa fare”.

Rende visibile la decisione.

### Permission boundaries

L'autonomia dipende anche dagli strumenti a cui un agente ha accesso.

Un agente che può leggere il repository ha un profilo di rischio.

Uno che può modificare file ne ha un altro.

Uno che può eseguire comandi, leggere secret, modificare cloud resources o fare deploy in produzione ne ha uno radicalmente diverso.

Per questo i permessi devono seguire il principio del least privilege.

Non concediamo accesso perché potrebbe essere utile.

Concediamo accesso perché è necessario per il task.

E possibilmente per il tempo necessario.

### Sandbox e blast radius

Un buon modo per aumentare autonomia senza aumentare allo stesso modo il rischio è ridurre il blast radius.

Possiamo usare:

- branch dedicate;
- ambienti temporanei;
- database di test;
- credenziali a privilegi ridotti;
- namespace isolati;
- feature flag;
- canary;
- limiti di spesa;
- rate limit;
- dry run.

Questo è un principio architetturale generale:

> **Quando non puoi eliminare l'errore, limita ciò che l'errore può danneggiare.**

### Autonomia e reversibilità

Le decisioni facilmente reversibili possono tollerare più autonomia.

Quelle difficili da invertire richiedono più attenzione.

Se un agente sceglie un nome interno mediocre, possiamo cambiarlo.

Se cambia la semantica di un evento consumato da venti sistemi, il costo di inversione può essere enorme.

Se introduce una dipendenza temporanea, possiamo rimuoverla.

Se esegue una cancellazione irreversibile su dati di produzione, non esiste un vero rollback.

La reversibilità è quindi uno dei criteri principali per decidere quanto controllo umano mantenere.

### Policy prima della velocità

Un'organizzazione AI-native non è quella che permette agli agenti di fare tutto.

È quella che riesce a descrivere con chiarezza:

- cosa possono fare;
- cosa non possono fare;
- quando possono procedere;
- quando devono fermarsi;
- quali evidenze devono produrre;
- quali decisioni richiedono un essere umano.

Questo trasforma la governance da approvazione manuale continua a **architettura dell'autonomia**.

Ed è un tema che tornerà quando parleremo di repository AI-ready, agent orchestration e sistemi software che incorporano agenti al proprio interno.