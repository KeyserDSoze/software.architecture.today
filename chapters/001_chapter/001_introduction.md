# Capitolo 1 — Il software è cambiato. Il problema no.

Una delle sensazioni più strane del software engineering contemporaneo è questa: possiamo costruire molto più velocemente e, allo stesso tempo, sentirci meno sicuri di ciò che stiamo costruendo.

Un'idea diventa una demo in poche ore.

Una specifica diventa una pull request.

Una descrizione in linguaggio naturale diventa un'API, una migration, una suite di test, un workflow CI/CD e perfino una prima bozza di infrastruttura.

Il salto è reale.

Negarlo sarebbe ingenuo.

Ma da qui nasce facilmente una conclusione sbagliata:

> se produrre software è diventato più semplice, allora anche costruire buoni sistemi è diventato più semplice.

Non è la stessa cosa.

Il software non è soltanto codice.

È comportamento nel tempo.

È stato condiviso.

È dipendenze.

È dati che devono rimanere coerenti.

È utenti che fanno cose impreviste.

È traffico che cresce.

È una dipendenza esterna che rallenta.

È un certificato che scade.

È una migration eseguita nel momento sbagliato.

È una policy di autorizzazione incompleta.

È una decisione presa sei mesi prima che oggi limita una modifica apparentemente semplice.

È un incidente alle tre di notte in un sistema che sulla macchina dello sviluppatore funzionava perfettamente.

L'AI comprime molti costi di produzione.

Non cancella questa complessità.

In alcuni casi la rende più visibile.

In altri la nasconde meglio.

## Il problema non era digitare

Per molto tempo abbiamo confuso una parte del mestiere con il mestiere intero.

Scrivere codice richiedeva tempo.

Configurare un ambiente richiedeva tempo.

Cercare una libreria richiedeva tempo.

Leggere un repository sconosciuto richiedeva tempo.

Preparare test, documentazione e script di deployment richiedeva tempo.

Era naturale associare la produttività alla quantità di execution che una persona riusciva a svolgere direttamente.

Ma il problema più difficile non è mai stato soltanto digitare l'implementazione.

Le domande costose arrivano prima e dopo:

- abbiamo capito il problema giusto?
- il requisito è davvero questo?
- quali vincoli non sono stati esplicitati?
- quali decisioni stiamo rendendo costose da cambiare?
- quale failure mode stiamo introducendo?
- stiamo ottimizzando per un carico reale o immaginario?
- chi possiede questo dato?
- che cosa succede alla compatibilità quando cambiamo il contratto?
- chi opererà questo componente in produzione?
- come sapremo che il sistema sta degradando?
- quanto costa mantenere la scelta dopo la demo?

L'AI può aiutarci anche su queste domande.

Può proporre alternative, criticare una soluzione, cercare failure mode, confrontare pattern, leggere documentazione e costruire modelli mentali.

Ma non elimina il bisogno di formularle.

Anzi, quando l'execution accelera, arrivare tardi a una domanda importante diventa più costoso.

## Quando il collo di bottiglia si sposta

Immaginiamo due team.

Il primo impiega cinque giorni a implementare una feature.

Il secondo, usando agenti, la implementa in cinque ore.

A prima vista il secondo team è enormemente più produttivo.

Ma supponiamo che entrambi abbiano interpretato male il requisito.

Il primo scopre l'errore dopo cinque giorni di lavoro.

Il secondo potrebbe aver costruito nello stesso tempo:

- backend;
- frontend;
- migration;
- test;
- dashboard;
- deployment;
- documentazione;
- integrazione con un servizio esterno.

La velocità ha ridotto il costo dell'esecuzione di una singola attività.

Ha aumentato il perimetro raggiunto prima della scoperta dell'errore.

Questo spostamento è uno dei temi centrali del libro.

> **Quando il costo dell'execution scende, il costo di una direzione sbagliata può salire.**

Il nuovo collo di bottiglia diventa più spesso:

- chiarezza dell'intento;
- qualità del contesto;
- qualità delle decisioni;
- capacità di verifica;
- capacità di integrare output diversi;
- capacità di fermarsi.

## Il paradosso della velocità

La velocità è utile quando la direzione è sufficientemente buona.

È pericolosa quando la usiamo per evitare di scegliere una direzione.

Da qui nasce un paradosso:

> **più velocemente possiamo costruire, più valore acquista sapere quando non costruire ancora.**

Non è un invito alla paralisi da analisi.

Non significa trasformare ogni feature in tre settimane di workshop.

Significa distinguere tra il tempo che riduce rischio e il tempo che produce soltanto attesa.

Una domanda chiarita in dieci minuti può evitare ore di lavoro inutile.

Un contratto scritto prima di avviare tre agenti può evitare tre implementazioni incompatibili.

Un acceptance criterion esplicito può evitare una lunga conversazione successiva su che cosa significhi “finito”.

Un piccolo ADR può impedire che una decisione locale venga scambiata per un nuovo standard architetturale.

Il punto non è rallentare.

È **spostare deliberatamente il tempo dove ha più leva**.

## Ciò che è cambiato davvero

L'AI cambia almeno quattro proprietà dell'execution software.

La prima è il **costo marginale** di molte attività.

Generare una variante in più, un test in più, una proposta in più o una prima bozza di documentazione spesso costa molto meno di prima.

La seconda è la **larghezza del perimetro** che una singola persona può attraversare.

È più facile muoversi tra frontend, backend, infrastruttura, test, documentazione e analisi di repository.

La terza è il **parallelismo**.

Più attività possono essere eseguite contemporaneamente da agenti diversi.

La quarta è la **velocità del feedback locale**.

Possiamo generare, eseguire, correggere e rigenerare in cicli molto più brevi.

Queste quattro proprietà sono potenti.

Ma nessuna garantisce automaticamente:

- correttezza;
- coerenza;
- sicurezza;
- operabilità;
- utilità;
- semplicità;
- sostenibilità.

Sono moltiplicatori.

Moltiplicano anche il metodo che trovano.

## Ciò che non è cambiato

Un sistema continua a dover risolvere un problema reale.

Continua ad avere utenti.

Continua ad avere vincoli.

Continua a dover convivere con dati, reti, failure, costi, dipendenze e organizzazioni.

Continua a dover essere modificato da qualcuno che non era presente quando è nato.

Continua ad avere conseguenze quando qualcosa va storto.

E soprattutto continua a richiedere decisioni.

Per questo la frase “l'AI scriverà il software” è interessante ma incompleta.

La domanda utile è:

> **chi decide quale software vale la pena costruire, quali proprietà deve avere e quali compromessi siamo disposti ad accettare?**

Il Capitolo 0 ha stabilito chi tiene il timone.

Questo capitolo affronta il problema immediatamente successivo:

> **che cosa succede quando il motore diventa molto più potente?**

La risposta non è usarlo sempre al massimo.

È imparare a controllare velocità, direzione e distanza di arresto.
