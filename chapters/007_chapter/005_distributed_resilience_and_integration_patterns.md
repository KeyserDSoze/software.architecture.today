## Pattern di integrazione, distribuzione e resilienza

Quando usciamo dal singolo processo, i pattern smettono molto rapidamente di essere soltanto organizzazione del codice. Iniziano a cambiare failure mode, consistency, latency, operabilità e recovery. Per questo il loro costo decisionale è più alto.

Una queue, un retry o un circuit breaker non sono “ingredienti cloud”. Una outbox, una saga o CQRS non sono livelli di maturità. Sono risposte a pressioni precise, e ognuna sposta la complessità in un punto diverso del sistema.

La disciplina **fit before fashion** qui diventa ancora più importante.

## La prima forza: il tempo

Molti pattern distribuiti nascono da una domanda semplice: producer e consumer devono essere disponibili nello stesso momento?

Se la risposta è no, una **queue** può disaccoppiarli nel tempo. Il producer deposita lavoro e può proseguire; il consumer lo elabora quando ha capacità. Questo può assorbire burst, ridurre la pressione su una dipendenza lenta e permettere una gestione esplicita del backlog.

Ma il guadagno ha un prezzo. Appena il lavoro entra in coda dobbiamo ragionare su duplicate delivery, ordering, retry, poison message, dead-letter handling e osservabilità del backlog. Dobbiamo anche accettare che il risultato non sia più necessariamente disponibile nel request path.

Per questo inserire una queue in un journey che richiede risposta immediata non crea automaticamente resilienza. Potrebbe soltanto trasformare un problema sincrono in un workflow asincrono che nessuno aveva richiesto.

Microsoft descrive la Queue-Based Load Leveling come un pattern per usare una coda come buffer fra task e servizio, in modo da assorbire picchi e proteggere la capacità del consumer. Il punto è il problema di load leveling, non la presenza della coda in sé: [Microsoft Learn — Cloud Design Patterns](https://learn.microsoft.com/azure/architecture/patterns/).

## La seconda forza: il fallimento remoto

Una chiamata di rete può essere lenta, fallire temporaneamente o non dirci con certezza che cosa sia successo dall'altra parte.

Il primo strumento è spesso il **timeout**. Ogni dipendenza deve avere un limite temporale coerente con il latency budget del journey complessivo. Se l'intera operazione deve chiudersi in due secondi, una singola chiamata non può attendere cinque secondi senza rendere il requisito impossibile per costruzione.

Dopo il timeout arriva spesso la tentazione del **retry**.

Il retry ha senso per failure plausibilmente transitori quando ripetere l'operazione è sicuro, il numero di tentativi è limitato e l'attesa tra i tentativi lascia davvero alla dipendenza la possibilità di recuperare. Senza queste condizioni, il retry può amplificare il guasto: un servizio già saturo riceve più traffico proprio perché sta rispondendo male.

Il rischio cresce quando più layer applicano retry indipendentemente. Tre tentativi nel gateway, tre nel servizio e tre nell'SDK possono moltiplicare una singola richiesta in una quantità di chiamate che nessun layer locale vede completamente.

La documentazione Microsoft sul Retry pattern insiste proprio sulla necessità di applicare retry dove il contesto dell'operazione è compreso e avverte che layer di retry annidati possono introdurre ritardi e carico eccessivi: [Microsoft Learn — Retry pattern](https://learn.microsoft.com/azure/architecture/patterns/retry).

Quando il failure non è più transitorio, continuare a riprovare smette di essere utile. È qui che può entrare un **circuit breaker**: dopo una sequenza significativa di fallimenti, il sistema smette temporaneamente di chiamare la dipendenza e usa un comportamento di fallback o fallisce rapidamente.

Il breaker compra protezione contro cascading failure e attese inutili, ma introduce stato, soglie, recovery semantics e nuove metriche. Se nessuno sa quando è `open`, perché lo è diventato o che cosa accade in `half-open`, abbiamo spostato il failure mode invece di governarlo.

Lo stesso principio vale per il **bulkhead**: isolare pool, concurrency o risorse può impedire che una parte degradata consumi tutta la capacità condivisa. Ma troppo isolamento riduce elasticità e aumenta configurazione. La domanda deve sempre essere quale failure domain vogliamo contenere.

Questa relazione tra failure inevitabili, retry, circuit breaker e bulkhead è coerente con i design principle di Azure per il self-healing e l'isolamento dei failure: [Microsoft Learn — Design for self-healing](https://learn.microsoft.com/azure/architecture/guide/design-principles/self-healing).

## La terza forza: una seconda rappresentazione del dato

Una **cache** viene spesso introdotta come soluzione di performance. In realtà, dal momento in cui contiene un valore derivato dalla source of truth, diventa una seconda rappresentazione del dato e quindi ci obbliga a definire una politica di coerenza.

Il classico cache-aside:

```text
read cache
→ miss
→ read source of truth
→ populate cache
```

sembra semplice finché non chiediamo quanto possa essere stale il dato, chi invalidi dopo una scrittura, come reagiamo a update concorrenti e che cosa accada durante un cache miss massivo. Dobbiamo anche decidere se una cache indisponibile renda indisponibile il journey oppure soltanto più lento.

La cache non è performance gratis. Compra latency e load reduction pagando freshness, invalidation e un nuovo failure surface.

## La quarta forza: coordinare stato e messaggi

Un problema più profondo emerge quando vogliamo modificare stato locale e pubblicare un messaggio affidabile senza una transazione distribuita tra database e broker.

La **transactional outbox** cambia il problema. Nella stessa transazione locale salviamo sia lo stato del dominio sia l'intenzione di pubblicare:

```text
transaction database
├── update stato dominio
└── insert outbox record

publisher
→ legge outbox
→ pubblica evento
→ marca record come processato
```

In questo modo non rischiamo che il commit locale riesca mentre l'intenzione di pubblicare venga persa prima ancora di essere registrata.

Ma non otteniamo esattamente-once per magia. La pubblicazione può essere ripetuta, quindi i consumer devono tollerare duplicati. Servono inoltre polling o CDC, retention, monitoring e recovery della pipeline.

La outbox è quindi potente quando il problema è **coordinare commit locale e pubblicazione affidabile**. È puro costo quando quella tensione non esiste.

## La quinta forza: transazioni che attraversano ownership differenti

Quando un workflow attraversa servizi autonomi, una transazione globale può essere impossibile, troppo costosa o indesiderabile. La **saga** accetta questa realtà e modella una sequenza di transazioni locali con progressione e compensazione.

Questo significa rendere espliciti stati intermedi, retry, failure permanenti e ownership del workflow. Significa anche capire che una compensazione non è rollback temporale.

Se abbiamo già inviato una email, non possiamo “dis-inviarla”. Possiamo soltanto eseguire un'azione successiva che renda il business coerente con ciò che è accaduto.

Microsoft descrive Saga come un pattern per gestire la consistenza dei dati in scenari di transazioni distribuite tra microservizi. Anche qui la descrizione è utile perché lega il pattern al problema di consistency, non al desiderio di avere un'orchestrazione sofisticata: [Microsoft Learn — Cloud Design Patterns](https://learn.microsoft.com/azure/architecture/patterns/).

## Separare lettura e scrittura senza saltare subito alla distribuzione

**CQRS** viene spesso riconosciuto dalla sua implementazione più vistosa: command service, query service, database separati, eventi e proiezioni. Ma il principio è più piccolo.

Se il modello necessario per cambiare lo stato e quello necessario per leggerlo hanno responsabilità differenti, possiamo separarli anche dentro lo stesso processo e persino sopra lo stesso datastore. La distribuzione è una scelta successiva.

Un read model dedicato diventa interessante quando requisiti di query, latency, availability o scala divergono abbastanza da giustificare nuova sincronizzazione e consistency eventuale.

Separare semanticamente command e query può costare poco. Duplicare storage e pipeline costa molto di più. Non dobbiamo confondere i due livelli.

## Event sourcing cambia la fonte della verità

**Event sourcing** ha un peso ancora diverso perché non introduce soltanto un meccanismo di integrazione. Cambia il modello di persistenza: gli eventi diventano la fonte primaria da cui ricostruiamo lo stato.

Questo può offrire storia, audit e ricostruzione molto potenti. Ma ci obbliga a governare evoluzione degli eventi, replay, snapshot, debugging temporale, idempotenza, privacy e cancellazione. Il passato diventa parte attiva del modello operativo del sistema.

Non è una persistence “più avanzata”. È una scelta con un costo di inversione elevato e va trattata come tale.

## Il criterio comune

Queue, retry, circuit breaker, bulkhead, cache, outbox, saga, CQRS ed event sourcing fanno cose molto diverse, ma possono essere giudicati con la stessa grammatica.

Quale failure, coordinamento o quality attribute rende insufficiente la struttura attuale? Quale complessità spostiamo introducendo il pattern? Quale nuova osservabilità diventa necessaria? E soprattutto: quale soluzione più semplice abbiamo escluso?

> **Un pattern distribuito non elimina complessità. Decide dove metterla e quale failure mode preferiamo governare.**