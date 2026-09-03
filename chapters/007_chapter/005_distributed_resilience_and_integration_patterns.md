## Pattern di integrazione, distribuzione e resilienza

Quando usciamo dal singolo processo, il costo dei pattern cresce rapidamente.

Non perché diventino “enterprise”, ma perché iniziano a modificare failure mode, consistenza, operabilità e modello mentale del sistema.

Qui la disciplina **fit before fashion** diventa ancora più importante.

### Queue: disaccoppiare nel tempo

Una queue è utile quando producer e consumer non devono necessariamente essere disponibili nello stesso momento.

Può:

- assorbire burst;
- introdurre buffering;
- consentire retry;
- separare capacità di produzione e consumo;
- isolare temporaneamente una dipendenza lenta.

Ma introduce anche:

- duplicate delivery;
- ordering non banale;
- poison message;
- backlog;
- retry policy;
- dead-letter handling;
- observability della coda;
- nuove domande sulla consistenza.

Se il requisito è soltanto “chiamare un servizio e ottenere una risposta immediata”, una queue potrebbe trasformare un problema semplice in un workflow distribuito.

### Retry: semplice da scrivere, difficile da governare

Il retry è uno dei pattern più intuitivi e più pericolosi.

Funziona bene per failure transitori quando:

- l'operazione è sicura da ripetere;
- esiste un backoff ragionevole;
- il numero di tentativi è limitato;
- il sistema a valle ha possibilità reale di recuperare.

Se queste condizioni non valgono, il retry può amplificare l'incidente.

Un servizio lento riceve più richieste proprio quando è meno capace di gestirle.

Nasce il retry storm.

Quindi retry senza idempotenza, timeout e budget non è resilienza.

Può essere moltiplicazione del danno.

### Timeout: una decisione architetturale piccola ma fondamentale

Ogni chiamata remota dovrebbe avere un limite temporale coerente con il journey complessivo.

Un timeout non è “qualche secondo”.

Dipende dal budget di latency end-to-end.

Se il journey deve terminare in 2 secondi, una singola dipendenza non può avere un timeout di 5 secondi.

Il pattern è semplice.

La parte difficile è allocare il budget.

### Circuit breaker

Un circuit breaker evita di continuare a chiamare una dipendenza che sta fallendo in modo consistente.

Può ridurre latency inutile e proteggere risorse.

Ma deve avere:

- soglie comprensibili;
- metriche;
- comportamento di fallback;
- semantica di recovery;
- test sullo stato half-open.

Se nessuno osserva quando il breaker apre, abbiamo soltanto spostato il failure mode.

### Bulkhead

Il bulkhead prova a impedire che il sovraccarico di una funzione consumi tutte le risorse condivise.

Può significare pool separati, concurrency limit o isolamento di workload.

È utile quando failure o saturation di una parte non devono compromettere tutto il sistema.

Ma troppo isolamento può ridurre utilizzo efficiente delle risorse e aumentare configurazione operativa.

### Cache-aside

Il pattern cache-aside è frequente:

```text
read cache
→ miss
→ read source of truth
→ populate cache
```

Sembra semplice finché non chiediamo:

- quanto può essere stale il dato?
- come invalidiamo?
- cosa succede con update concorrenti?
- cosa succede se la cache è indisponibile?
- possiamo servire dati vecchi?
- il cache stampede è possibile?

La cache non è “performance gratis”.

È una seconda rappresentazione del dato con una politica di coerenza.

### Outbox

Il transactional outbox risponde a una tensione importante: vogliamo modificare lo stato locale e pubblicare un messaggio senza avere una transazione distribuita tra database e broker.

La struttura tipica è:

```text
transaction database
├── update stato dominio
└── insert outbox record

publisher
→ legge outbox
→ pubblica evento
→ marca record come processato
```

Compra atomicità locale tra stato e intenzione di pubblicazione.

Paga con:

- duplicati possibili;
- polling o CDC;
- retention della outbox;
- monitoring;
- idempotenza consumer.

È un ottimo pattern quando il problema esiste davvero.

È inutile se non dobbiamo coordinare stato locale e pubblicazione affidabile.

### Saga

Una saga coordina una sequenza di transazioni locali quando non possiamo o non vogliamo avere una transazione globale.

Non “rende transazionale” un sistema distribuito.

Gestisce invece progressione e compensazione.

Questo significa che dobbiamo modellare:

- passi completati;
- retry;
- operazioni compensative;
- failure permanenti;
- stato intermedio;
- osservabilità del workflow.

La compensazione non è rollback.

Se un cliente riceve una email, non possiamo “dis-inviarla”.

Possiamo soltanto eseguire un'azione successiva coerente.

### CQRS

CQRS separa il modello di command dal modello di query.

Può avere senso quando letture e scritture hanno bisogni molto diversi.

Non richiede necessariamente due database, due servizi o eventi.

Può essere una separazione logica nello stesso processo.

Questo è importante perché spesso il pattern viene confuso con la sua implementazione più distribuita.

### Event sourcing

Event sourcing registra gli eventi come fonte primaria dello stato.

Può offrire storia, audit e capacità di ricostruzione molto potenti.

Ma porta con sé problemi seri:

- evoluzione degli eventi;
- privacy e cancellazione;
- rebuild;
- snapshot;
- debugging temporale;
- idempotenza;
- comprensione del dominio nel tempo.

Non è una forma “più avanzata” di persistence.

È una scelta di modello con conseguenze profonde.

### Il criterio comune

Queue, retry, circuit breaker, outbox, saga, CQRS ed event sourcing non devono essere memorizzati come ingredienti di una modern architecture.

Devono essere collegati alle forze che li rendono necessari.

> **Un pattern distribuito non elimina complessità. Decide dove metterla e quale failure mode preferiamo governare.**
