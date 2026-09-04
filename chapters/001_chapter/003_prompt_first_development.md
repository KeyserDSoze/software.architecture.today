## Prompt-first development

Quando uno strumento è molto potente, tende a deformare il processo attorno a sé.

Se possiamo ottenere codice da una frase, la tentazione naturale è cominciare dalla frase.

Non dal problema.

Non dal comportamento desiderato.

Non dai vincoli.

Dal prompt.

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

All'inizio sembra velocissimo.

Ogni iterazione produce qualcosa di visibile.

Il sistema cresce.

Le schermate compaiono.

gli endpoint rispondono.

I test diventano verdi.

Ma dopo un certo numero di cicli può emergere una sensazione difficile da descrivere:

> il progetto funziona, ma nessuno sa più esattamente perché sia fatto così.

Questo libro chiamerà questo anti-pattern **prompt-first development**.

### Il prompt non è il problema

Non c'è nulla di sbagliato nel prompt come interfaccia.

Possiamo usarlo per descrivere un task eccellente.

Possiamo usarlo per esplorare alternative.

Possiamo usarlo per verificare una decisione.

Il problema nasce quando il prompt diventa il luogo in cui **inventiamo contemporaneamente problema, requisito, design e implementazione**.

Consideriamo:

> “Fammi una app per gestire ordini con login, pagamenti e notifiche.”

Un agente competente può produrre rapidamente una soluzione impressionante.

Ma quali decisioni sono state prese dentro quella frase?

Praticamente nessuna.

Non sappiamo:

- chi sono gli utenti;
- quali ruoli esistono;
- chi può vedere quali ordini;
- quando un ordine diventa immutabile;
- se il pagamento è sincrono;
- come gestiamo un callback duplicato;
- che cosa significa “notifica”;
- quale dato è autorevole;
- quali requisiti di disponibilità esistono;
- che cosa succede durante un guasto del provider di pagamento;
- quali vincoli normativi o di sicurezza contano;
- quanto traffico dobbiamo sostenere;
- se il sistema è un prototipo o una piattaforma destinata a durare anni.

L'agente deve riempire i vuoti.

E lo farà.

Il problema è che i vuoti riempiti automaticamente tendono a sembrare decisioni intenzionali dopo che sono diventati codice.

### Architecture by autocomplete

Il prompt-first development porta facilmente a un secondo anti-pattern:

## AI architecture by autocomplete

La prima generazione introduce una struttura.

La seconda generazione la osserva e la tratta come contesto.

La terza estende ciò che esiste.

La quarta consolida una convenzione nata per caso.

Dopo venti iterazioni, il repository contiene un'architettura.

Ma nessuno l'ha scelta davvero.

È emersa per sedimentazione.

Questo succede anche senza AI.

La differenza è la velocità.

Un pattern accidentale può propagarsi in decine di file prima che qualcuno si chieda se fosse quello giusto.

Per esempio, la prima feature potrebbe introdurre direttamente l'accesso al database dentro un controller.

La feature successiva copia la stessa struttura.

L'agente vede la convenzione e la replica coerentemente.

Dopo qualche giorno, il progetto ha trenta controller che contengono logica di business e accesso dati.

A quel punto il problema non è che l'AI abbia scritto codice “cattivo”.

Ha fatto qualcosa di molto più prevedibile:

> ha amplificato il precedente che il repository gli ha mostrato.

### Il repository insegna

Un agente che lavora su un codebase non riceve soltanto istruzioni esplicite.

Riceve anche istruzioni implicite dal codice esistente.

Se vede error handling incoerente, nomi vaghi, accesso ai secret sparso, test fragili, dipendenze introdotte senza criterio e moduli che attraversano liberamente i boundary, può inferire che quelle pratiche siano accettabili.

Se trova invece contratti chiari, confini espliciti e test significativi, insieme a convenzioni stabili, documentazione aggiornata e decisioni architetturali spiegate, parte da un contesto operativo molto migliore.

Da questo punto di vista, ogni merge modifica non soltanto il software.

Modifica anche il materiale da cui i prossimi agenti impareranno implicitamente.

> **Il codice di oggi è contesto per la generazione di domani.**

Questa è una ragione ulteriore per curare la qualità strutturale del repository.

### Il ciclo della correzione locale

Il prompt-first development tende a ottimizzare localmente.

Qualcosa non funziona.

Chiediamo di sistemarlo.

La correzione rompe un test.

Chiediamo di sistemare il test.

Ora emerge una duplicazione.

Chiediamo un refactoring.

Il refactoring cambia un contratto.

Chiediamo di aggiornare i consumer.

Ogni step può essere ragionevole isolatamente.

Ma il processo non contiene necessariamente un momento in cui qualcuno si chiede:

> stiamo ancora costruendo la cosa giusta nel modo giusto?

È come correggere continuamente la traiettoria guardando soltanto il metro di strada davanti alla macchina.

Il feedback locale è rapido.

La direzione globale può degradare.

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

Non ogni feature richiede un documento per ogni freccia.

Una modifica di tre righe può attraversare mentalmente l'intera sequenza in pochi minuti.

Una migrazione critica può richiedere giorni di preparazione.

La struttura serve a ricordare un principio, non a imporre un rituale.

> **Il livello di formalità deve crescere con il costo dell'errore e con il costo di inversione della decisione.**

### Prompt dopo il pensiero

Un buon prompt tecnico spesso è il risultato di lavoro già fatto.

Per esempio:

> “Implementa la cancellazione di un ordine rispettando la state machine descritta in `features/order-cancellation.md`. Il comando deve essere idempotente rispetto a `cancellationRequestId`. Non modificare il contratto pubblico. Usa il repository esistente per la persistenza. Aggiungi test per richiesta duplicata, ordine già spedito e failure del provider di rimborso. Se la soluzione richiede cambiare lo schema degli eventi pubblici, fermati e proponi un ADR.”

Qui il prompt non sostituisce l'architettura.

La trasporta nell'execution.

Questa è la differenza tra **prompting come scorciatoia del pensiero** e **prompting come interfaccia verso lavoro già sufficientemente pensato**.

### Il test del foglio bianco

Un esercizio utile prima di delegare una feature importante è semplice.

Togliamo l'AI.

Non chiediamoci se sapremmo scrivere tutto il codice a memoria.

Chiediamoci invece se sappiamo descrivere il comportamento atteso e ciò che non deve accadere, se abbiamo un'idea dei componenti coinvolti e delle invarianti che non possono essere violate. Dovremmo anche sapere come verificheremo il risultato e quali decisioni, se emergono durante l'execution, devono essere escalate.

Se la risposta è no, il prossimo prompt potrebbe produrre output.

Ma non abbiamo ancora costruito una delega professionale.

Abbiamo soltanto trasformato l'incertezza in codice più velocemente.

Il principio che useremo nel resto del libro è semplice:

> **Prima capire, poi costruire.**

Non significa capire tutto.

Significa capire abbastanza da sapere che cosa stiamo chiedendo al sistema di moltiplicare.
