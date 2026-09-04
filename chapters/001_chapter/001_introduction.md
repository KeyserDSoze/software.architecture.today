# Capitolo 1 — Il software è cambiato. Il problema no.

Una delle sensazioni più strane del software engineering contemporaneo è questa: possiamo costruire molto più velocemente e, allo stesso tempo, sentirci meno sicuri di ciò che stiamo costruendo. Un’idea può diventare una demo in poche ore; una specifica può trasformarsi in una pull request; una descrizione in linguaggio naturale può produrre un’API, una migration, una suite di test, un workflow CI/CD e perfino una prima bozza di infrastruttura.

Il salto è reale, e negarlo sarebbe ingenuo. Proprio per questo è facile arrivare a una conclusione sbagliata: se produrre software è diventato più semplice, allora anche costruire buoni sistemi deve essere diventato più semplice.

Non è la stessa cosa.

Il software non è soltanto codice. È comportamento nel tempo, stato condiviso, dipendenze e dati che devono rimanere coerenti mentre il mondo attorno al sistema cambia. È un utente che fa qualcosa che non avevamo previsto, una dipendenza esterna che rallenta, un certificato che scade, una migration eseguita nel momento sbagliato o una policy di autorizzazione incompleta. È una decisione presa sei mesi fa che oggi rende costosa una modifica apparentemente banale. Ed è anche l’incidente delle tre di notte in un sistema che sulla macchina dello sviluppatore funzionava perfettamente.

L’AI comprime molti costi di produzione, ma non cancella questa complessità. A volte la rende più visibile; altre volte la nasconde meglio dietro un risultato che appare completo molto prima di esserlo davvero.

## Il problema non era digitare

Per molto tempo abbiamo confuso una parte del mestiere con il mestiere intero. Scrivere codice, configurare un ambiente, cercare una libreria, orientarsi in un repository sconosciuto, preparare test, documentazione e script di deployment richiedevano tempo. Era quindi naturale associare una parte della produttività alla quantità di execution che una persona riusciva a svolgere direttamente.

Ma le domande più costose non sono mai state soltanto quelle legate alla digitazione dell’implementazione. Prima di costruire dobbiamo capire se stiamo risolvendo il problema giusto, se il requisito è davvero quello che abbiamo compreso e quali vincoli non sono ancora emersi. Durante il design dobbiamo chiederci quali decisioni stiamo rendendo difficili da cambiare, quali failure mode introduciamo, se stiamo progettando per un carico reale o immaginario e chi possiede davvero il dato che stiamo manipolando. Dopo l’implementazione restano ancora la compatibilità dei contratti, l’operabilità, la capacità di rilevare il degrado e il costo di mantenere la scelta quando l’effetto iniziale della demo è ormai svanito.

L’AI può aiutarci anche qui. Può proporre alternative, criticare una soluzione, cercare failure mode, confrontare pattern, leggere documentazione e costruire modelli mentali. Non elimina però il bisogno di formulare le domande. Anzi, quando l’execution accelera, arrivare tardi a una domanda importante può diventare più costoso perché nel frattempo abbiamo avuto il tempo di trasformare un’assunzione in molto più software.

## Quando il collo di bottiglia si sposta

Immaginiamo due team. Il primo impiega cinque giorni a implementare una feature; il secondo, usando agenti, la implementa in cinque ore. A prima vista il secondo team è enormemente più produttivo.

Supponiamo però che entrambi abbiano interpretato male il requisito. Il primo scopre l’errore dopo cinque giorni di lavoro. Il secondo, nello stesso intervallo di tempo, potrebbe aver già costruito backend e frontend, preparato una migration e i test, aggiunto dashboard e deployment, aggiornato la documentazione e integrato persino un servizio esterno.

La velocità ha ridotto il costo dell’esecuzione di una singola attività, ma ha aumentato il perimetro raggiunto prima della scoperta dell’errore. È questo lo spostamento che ci interessa.

> **Quando il costo dell’execution scende, il costo di una direzione sbagliata può salire.**

Il collo di bottiglia diventa allora più spesso la chiarezza dell’intento, la qualità del contesto e delle decisioni, la capacità di integrare e verificare output diversi e, soprattutto, la capacità di fermarsi quando la velocità sta portando il sistema oltre ciò che abbiamo davvero deciso.

## Il paradosso della velocità

La velocità è utile quando la direzione è sufficientemente buona. Diventa pericolosa quando la usiamo per evitare di scegliere una direzione. Da qui nasce un paradosso:

> **Più velocemente possiamo costruire, più valore acquista sapere quando non costruire ancora.**

Non è un invito alla paralisi da analisi, né significa trasformare ogni feature in settimane di workshop. Significa distinguere il tempo che riduce rischio dal tempo che produce soltanto attesa. Una domanda chiarita in dieci minuti può evitare ore di lavoro inutile; un contratto scritto prima di avviare tre agenti può evitare tre implementazioni incompatibili; un acceptance criterion esplicito può risparmiare una lunga discussione su che cosa significhi “finito”; un piccolo ADR può impedire che una decisione locale venga scambiata per un nuovo standard architetturale.

Il punto non è rallentare. È **spostare deliberatamente il tempo dove ha più leva**.

## Ciò che è cambiato davvero

L’AI modifica alcune proprietà fondamentali dell’execution software. Abbassa il costo marginale di molte attività: generare una variante, un test, una proposta o una prima bozza di documentazione spesso costa molto meno di prima. Allarga inoltre il perimetro che una singola persona può attraversare, rendendo più facile muoversi tra frontend, backend, infrastruttura, test, documentazione e analisi del repository.

Cambia anche il parallelismo. Più attività possono essere affidate contemporaneamente ad agenti diversi, mentre i cicli locali di generazione, esecuzione e correzione diventano più brevi. Tutto questo è potente, ma nessuna di queste proprietà garantisce automaticamente che il risultato sia corretto, coerente, sicuro, operabile, utile, semplice o sostenibile nel tempo.

Sono moltiplicatori. E un moltiplicatore amplifica anche il metodo che trova.

## Ciò che non è cambiato

Un sistema continua a dover risolvere un problema reale per utenti reali, dentro vincoli tecnici, economici e organizzativi. Continua a convivere con dati, reti, failure, dipendenze e costi. Continua a essere modificato da persone che non erano presenti quando è nato e continua ad avere conseguenze quando qualcosa va storto.

Soprattutto, continua a richiedere decisioni.

Per questo la frase “l’AI scriverà il software” è interessante ma incompleta. La domanda utile è un’altra:

> **Chi decide quale software vale la pena costruire, quali proprietà deve avere e quali compromessi siamo disposti ad accettare?**

Il Capitolo 0 ha stabilito chi tiene il timone. Questo capitolo affronta il problema immediatamente successivo: che cosa succede quando il motore diventa molto più potente?

La risposta non è usarlo sempre al massimo. È imparare a controllare velocità, direzione e distanza di arresto.
