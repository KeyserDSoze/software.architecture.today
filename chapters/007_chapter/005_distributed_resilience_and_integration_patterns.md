## Pattern di integrazione, distribuzione e resilienza

Quando usciamo dal singolo processo, il costo dei pattern cresce rapidamente.

Non perché diventino “enterprise”, ma perché iniziano a modificare failure mode, consistenza, operabilità e modello mentale del sistema.

Qui la disciplina **fit before fashion** diventa ancora più importante.

### Queue: disaccoppiare nel tempo

Una queue è utile quando producer e consumer non devono necessariamente essere disponibili nello stesso momento.

Una coda può assorbire burst e introdurre buffering, consentire retry e separare la capacità di produzione da quella di consumo. Può anche isolare temporaneamente una dipendenza lenta dal request path.

In cambio introduce duplicate delivery e ordering non banale, poison message e backlog, retry policy e dead-letter handling. Aggiunge inoltre un nuovo problema di observability e nuove domande sulla consistenza che prima non esistevano.

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

La cache sembra semplice finché non chiediamo quanto possa essere stale il dato e come avvenga l'invalidazione, che cosa succeda con update concorrenti o quando la cache è indisponibile. Dobbiamo anche decidere se possiamo servire dati vecchi e se il workload espone il sistema a cache stampede.

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

L'outbox paga la propria affidabilità con duplicati possibili, un meccanismo di polling o CDC, retention e monitoring della tabella e la necessità di consumer idempotenti.

È un ottimo pattern quando il problema esiste davvero.

È inutile se non dobbiamo coordinare stato locale e pubblicazione affidabile.

### Saga

Una saga coordina una sequenza di transazioni locali quando non possiamo o non vogliamo avere una transazione globale.

Non “rende transazionale” un sistema distribuito.

Gestisce invece progressione e compensazione.

Una saga ci obbliga a modellare i passi completati e i retry, le operazioni compensative e i failure permanenti. Lo stato intermedio e l'osservabilità del workflow diventano parte dell'architettura, non dettagli da aggiungere dopo.

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

Event sourcing porta con sé problemi seri di evoluzione degli eventi, privacy e cancellazione, rebuild e snapshot. Aumentano anche il peso del debugging temporale e dell'idempotenza e la necessità di comprendere come il dominio cambia nel tempo.

Non è una forma “più avanzata” di persistence.

È una scelta di modello con conseguenze profonde.

### Il criterio comune

Queue, retry, circuit breaker, outbox, saga, CQRS ed event sourcing non devono essere memorizzati come ingredienti di una modern architecture.

Devono essere collegati alle forze che li rendono necessari.

> **Un pattern distribuito non elimina complessità. Decide dove metterla e quale failure mode preferiamo governare.**
