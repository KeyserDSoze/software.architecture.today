## Dalla qualità desiderata alla qualità misurabile

I requisiti non funzionali vengono spesso trattati come una lista standard da completare.

Performance.

Scalability.

Availability.

Security.

Maintainability.

Cost.

Il problema è che una lista di categorie non ci dice ancora quali proprietà contino davvero per il sistema che stiamo progettando.

Ogni prodotto ha un profilo di qualità diverso.

Per un motore di trading, alcuni millisecondi possono essere decisivi.

Per un backoffice amministrativo, la stessa ottimizzazione potrebbe non cambiare nulla per l'utente.

Per un sistema di pagamento, perdita o duplicazione di una transazione può essere molto più importante della latency media.

Per un sito editoriale, disponibilità e capacità di assorbire picchi possono dominare il design.

Per un tool interno usato da dodici persone, una soluzione estremamente sofisticata di autoscaling potrebbe non restituire mai il proprio costo.

La domanda quindi non è:

> “Quali NFR dobbiamo avere?”

ma:

> **“Quali proprietà di qualità cambiano materialmente il successo o il rischio di questo sistema?”**

### Latency

La latency misura quanto tempo impiega un'operazione a produrre una risposta osservabile.

Ma anche qui dobbiamo essere precisi.

Una media può nascondere una coda pessima.

Per questo spesso ragioniamo in percentile.

Per esempio:

```text
p50 < 100 ms
p95 < 300 ms
p99 < 800 ms
```

Non significa che questi numeri siano buoni in assoluto.

Significa che abbiamo descritto il comportamento atteso in modo discutibile e verificabile.

Dobbiamo inoltre distinguere la latency del singolo componente da quella end-to-end e da quella percepita dall'utente. La stessa misura va letta sotto carico normale e durante degrado o dipendenze lente.

Ottimizzare un servizio a 20 ms non serve se il critical user journey impiega comunque tre secondi per una dipendenza esterna.

### Throughput e capacity

Il throughput descrive quanta attività il sistema riesce a processare in un intervallo di tempo.

La capacity riguarda invece il perimetro entro cui quel throughput può essere sostenuto rispettando gli altri requisiti.

Dire:

> “Il sistema deve supportare 1.000 richieste al secondo.”

è già meglio di “deve scalare”, ma non basta.

Dobbiamo sapere con quale mix di operazioni e per quanto tempo, con quale dataset e quale latency target. Servono anche un margine e un comportamento dichiarato quando la soglia viene superata.

Un sistema che regge 1.000 richieste al secondo ma porta il p99 a trenta secondi non ha necessariamente soddisfatto il requisito.

### Availability

Availability non significa “non deve mai andare giù”.

Significa definire quale indisponibilità possiamo tollerare e per quali journey.

Un singolo numero globale può essere fuorviante.

La pagina pubblica potrebbe richiedere disponibilità molto elevata mentre un report amministrativo può tollerare ore di indisponibilità.

La qualità può essere diversa per percorso.

Questo evita di progettare l'intero sistema per il requisito più severo quando quel requisito riguarda solo una piccola parte del prodotto.

### Reliability e correctness

Availability e reliability non sono sinonimi.

Un sistema può rispondere sempre e rispondere male.

Per alcune funzioni la correttezza è il requisito dominante.

Pensiamo a un pagamento duplicato o a un saldo errato, a un ordine assegnato al tenant sbagliato, alla perdita di un evento di business o alla doppia esecuzione di un workflow non idempotente. In questi casi “HTTP 200” è una misura quasi inutile della qualità reale.

### Consistency

Quando più copie o viste dello stesso fatto esistono nel sistema, dobbiamo capire quanto possono divergere e per quanto tempo.

“Eventually consistent” non è una licenza per mostrare qualsiasi dato in ritardo.

Anche l'eventual consistency deve avere un profilo accettabile.

Per esempio:

> Gli aggiornamenti di stato dell'ordine devono essere visibili nella vista operatore entro 30 secondi nel 99% dei casi.

Adesso possiamo progettare polling, eventi, retry, monitoraggio e recovery rispetto a una proprietà concreta.

### Durability

Durability riguarda la probabilità che un dato considerato acquisito rimanga disponibile nel tempo.

È diversa dalla availability.

Un database potrebbe essere temporaneamente non raggiungibile ma non aver perso alcun dato.

Oppure potrebbe essere online e avere già subito una perdita non rilevata.

Quando il dato è economicamente o legalmente importante, dobbiamo discutere esplicitamente replica, backup e restore, retention, corruzione e cancellazione accidentale, fino al recovery testing che dimostra se le protezioni funzionano davvero.

### Operability

Una proprietà spesso sottovalutata è l'operabilità.

Possiamo costruire un sistema tecnicamente elegante che nessuno sa operare bene.

Dobbiamo sapere come il sistema viene distribuito e come si torna indietro, come capiamo che sta fallendo e chi riceve l'alert. Conta anche quanta manutenzione richiedano le dipendenze, quante competenze specialistiche servano e se un incidente possa essere diagnosticato senza collegarsi manualmente a dieci macchine.

L'operabilità è architettura perché modifica il costo reale di mantenere il sistema vivo.

### Maintainability e changeability

Un sistema deve essere non soltanto eseguibile, ma modificabile.

Qui le metriche diventano meno perfette, ma possiamo comunque rendere i requisiti più concreti.

Per esempio:

- una modifica al provider di pagamento non deve richiedere modifiche nel dominio Orders;
- una nuova regola di autorizzazione deve poter essere testata senza avviare l'intero stack;
- il deploy di un modulo deve poter essere verificato automaticamente;
- una modifica al contratto pubblico deve avere una strategia di compatibilità.

Non tutto ciò che conta ha una metrica perfetta.

Questo non significa che dobbiamo tornare agli aggettivi vaghi.

Possiamo definire invarianti, scenari e criteri osservabili.

### Security e privacy

“Sicuro” non è un requisito.

Dobbiamo capire quali asset proteggiamo e da chi, attraverso quali trust boundary e con quali permessi. Dobbiamo sapere quali dati siano sensibili, quali azioni debbano essere auditabili e quale rischio residuo siamo disposti ad accettare. Lo stesso vale per privacy.

Una frase come:

> “I dati personali devono essere protetti.”

ha valore normativo, ma per guidare il design deve essere scomposta in comportamenti e controlli.

### Cost

Il costo è una quality attribute tanto quanto la latency.

Se una soluzione soddisfa tutti i requisiti tecnici ma costa dieci volte il budget disponibile, non è una soluzione valida.

Il costo comprende:

- infrastruttura;
- licenze;
- traffico;
- storage;
- osservabilità;
- backup;
- personale;
- on-call;
- complessità operativa;
- migrazione;
- lock-in;
- formazione.

La qualità non è massimizzare ogni dimensione.

È trovare un equilibrio coerente con il problema.

> **Un'architettura è credibile quando sa dire non soltanto che cosa ottimizza, ma anche che cosa ha deciso di non ottimizzare.**
