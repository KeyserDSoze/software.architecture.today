## Prompt-first development

Quando uno strumento è molto potente, tende a deformare il processo attorno a sé. Se possiamo ottenere codice da una frase, la tentazione naturale è cominciare proprio dalla frase: non dal problema, non dal comportamento desiderato, non dai vincoli, ma dal prompt.

Il pattern appare innocuo:

```text
idea vaga
→ prompt
→ codice
→ provo
→ qualcosa non torna
→ nuovo prompt
→ altro codice
→ correzione
→ refactoring
→ altra correzione
```

All’inizio sembra velocissimo. Ogni iterazione produce qualcosa di visibile, il sistema cresce, le schermate compaiono, gli endpoint rispondono e i test diventano verdi. Dopo un certo numero di cicli, però, può emergere una sensazione difficile da descrivere: il progetto funziona, ma nessuno sa più esattamente perché sia fatto così.

Questo libro chiamerà questo anti-pattern **prompt-first development**.

### Il prompt non è il problema

Non c’è nulla di sbagliato nel prompt come interfaccia. Possiamo usarlo per descrivere un task eccellente, esplorare alternative o verificare una decisione. Il problema nasce quando il prompt diventa il luogo in cui **inventiamo contemporaneamente problema, requisito, design e implementazione**.

Consideriamo una richiesta come: “Fammi una app per gestire ordini con login, pagamenti e notifiche”. Un agente competente può produrre rapidamente qualcosa di impressionante. Ma quella frase non ci dice chi siano gli utenti, quali ruoli esistano, chi possa vedere quali ordini, quando un ordine diventi immutabile o se il pagamento sia sincrono. Non chiarisce che cosa debba accadere con callback duplicati, quali dati siano autorevoli, quali requisiti di disponibilità o sicurezza contino, quanto traffico attendiamo o se stiamo costruendo un prototipo destinato a sparire oppure una piattaforma che dovrà vivere per anni.

L’agente deve riempire i vuoti, e lo farà. Il problema è che i vuoti riempiti automaticamente tendono a sembrare decisioni intenzionali dopo che sono diventati codice.

### Architecture by autocomplete

Il prompt-first development porta facilmente a un secondo anti-pattern: la **AI architecture by autocomplete**.

La prima generazione introduce una struttura; la seconda osserva quella struttura e la tratta come contesto; la terza la estende; la quarta consolida una convenzione nata per caso. Dopo venti iterazioni, il repository contiene un’architettura, ma nessuno l’ha scelta davvero. È emersa per sedimentazione.

Questo succede anche senza AI. La differenza è la velocità con cui un precedente accidentale può propagarsi. Se la prima feature mette accesso al database e logica di business direttamente dentro un controller, la successiva può copiare la stessa forma. L’agente vede la convenzione e la replica coerentemente; pochi giorni dopo, decine di controller possono condividere la stessa scelta. A quel punto il problema non è che l’AI abbia scritto codice “cattivo”. Ha fatto qualcosa di più prevedibile: **ha amplificato il precedente che il repository le ha mostrato**.

### Il repository insegna

Un agente che lavora su un codebase non riceve soltanto istruzioni esplicite. Il codice esistente gli fornisce anche istruzioni implicite. Error handling incoerente, nomi vaghi, accesso ai secret sparso, test fragili, dipendenze introdotte senza criterio e boundary attraversati liberamente possono diventare segnali di ciò che il repository considera normale. Al contrario, contratti chiari, confini espliciti, test significativi, convenzioni stabili e decisioni architetturali spiegate offrono un contesto operativo migliore.

Da questo punto di vista, ogni merge modifica non soltanto il software, ma anche il materiale da cui i prossimi agenti impareranno implicitamente.

> **Il codice di oggi è contesto per la generazione di domani.**

### Il ciclo della correzione locale

Il prompt-first development tende a ottimizzare localmente. Qualcosa non funziona e chiediamo di sistemarlo; la correzione rompe un test e chiediamo di sistemare il test; emerge una duplicazione e chiediamo un refactoring; il refactoring cambia un contratto e chiediamo di aggiornare i consumer. Ogni passaggio può essere ragionevole preso da solo.

Il problema è che il processo non contiene necessariamente un momento in cui qualcuno si chiede se stiamo ancora costruendo la cosa giusta nel modo giusto. È come correggere continuamente la traiettoria guardando soltanto il metro di strada davanti alla macchina: il feedback locale è rapido, mentre la direzione globale può degradare lentamente.

### Una sequenza diversa

Il pattern che useremo nel libro è:

```text
problema
→ contesto
→ outcome
→ vincoli
→ alternative
→ decisioni
→ contratti
→ task
→ execution
→ verifica
```

Non ogni feature richiede un documento per ogni freccia. Una modifica di tre righe può attraversare mentalmente l’intera sequenza in pochi minuti; una migration critica può richiedere giorni di preparazione. La struttura serve a ricordare un principio, non a imporre un rituale.

> **Il livello di formalità deve crescere con il costo dell’errore e con il costo di inversione della decisione.**

### Prompt dopo il pensiero

Un buon prompt tecnico è spesso il risultato di lavoro già fatto. Se chiediamo, per esempio, di implementare la cancellazione di un ordine rispettando una state machine già descritta, mantenendo idempotenza, senza cambiare il contratto pubblico, aggiungendo test specifici e fermandosi se emerge la necessità di modificare eventi pubblici, il prompt non sta inventando l’architettura. La sta trasportando nell’execution.

Questa è la differenza tra **prompting come scorciatoia del pensiero** e **prompting come interfaccia verso lavoro già sufficientemente pensato**.

### Il test del foglio bianco

Prima di delegare una feature importante possiamo fare un esercizio semplice: togliere per un momento l’AI. Non dobbiamo chiederci se sapremmo scrivere tutto il codice a memoria, ma se sappiamo descrivere il comportamento atteso e ciò che non deve accadere, quali componenti sono coinvolti, quali invarianti non possono essere violate, come verificheremo il risultato e quali decisioni dovranno essere escalate se emergono durante l’execution.

Se non sappiamo rispondere, il prossimo prompt potrà comunque produrre output. Ma non abbiamo ancora costruito una delega professionale; abbiamo soltanto trasformato l’incertezza in codice più velocemente.

Il principio che useremo nel resto del libro è semplice:

> **Prima capire, poi costruire.**

Non significa capire tutto. Significa capire abbastanza da sapere che cosa stiamo chiedendo al sistema di moltiplicare.
