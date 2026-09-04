## Feedback loop e failure domain

Un sistema non produce soltanto output. Produce conseguenze che, a loro volta, possono modificare il comportamento futuro del sistema. È qui che entra in gioco il concetto di **feedback loop**.

Nel software alcuni loop sono facili da vedere. Immaginiamo un servizio che rallenta sotto carico:

```text
request
→ load increases
→ latency increases
→ clients retry
→ load increases further
```

Il comportamento iniziale produce una conseguenza che alimenta la causa stessa del problema. Il sistema non sta semplicemente “ricevendo più traffico”: sta reagendo al proprio degrado in un modo che può amplificarlo.

Esistono anche loop meno tecnici ma altrettanto architetturali. Un algoritmo di raccomandazione influenza ciò che gli utenti vedono; i click risultanti entrano nei dati futuri; quei dati influenzano nuove raccomandazioni. Oppure un processo di delivery doloroso porta il team a rilasciare meno spesso; i batch diventano più grandi, i rilasci più rischiosi e proprio per questo ancora più dolorosi.

Pensare per sistemi significa riconoscere questi circuiti prima di trattare ogni azione come un evento isolato.

### Quando una tecnica locale cambia il comportamento globale

Il retry è un esempio particolarmente istruttivo. Guardato localmente sembra quasi sempre ragionevole: una chiamata fallisce, quindi la ripetiamo. Se però migliaia di client fanno la stessa cosa durante un degrado, il retry smette di essere soltanto una misura di resilienza e diventa parte del carico che il servizio deve sopportare.

```text
service slows down
→ requests fail
→ clients retry
→ traffic rises
→ service slows down more
```

Il punto non è concludere che i retry siano sbagliati. È capire che il loro comportamento dipende da timeout, backoff, jitter, idempotency, rate limit, capacity e recovery time. Una decisione che sembra corretta dentro il client può risultare distruttiva osservando il journey intero.

Lo stesso vale per l'autoscaling. Un loop del tipo:

```text
load rises
→ metric crosses threshold
→ new instances start
→ capacity rises
→ load per instance falls
```

può essere stabilizzante, ma soltanto se la metrica osservata rappresenta davvero il collo di bottiglia e se il ritardo tra rilevazione e nuova capacità è compatibile con il sistema. Se il database è già saturo, aumentare il numero di istanze applicative può peggiorare la pressione a valle. L'autoscaling non ha fallito come feature; abbiamo modellato male il sistema che stavamo cercando di stabilizzare.

### Il software include anche il modo in cui viene operato

I feedback loop non terminano ai confini del runtime. Un sistema difficile da osservare produce incidenti più lunghi; incidenti lunghi spingono le persone a introdurre procedure manuali difensive; le procedure aumentano la complessità operativa e quella complessità rende il prossimo incidente ancora più difficile da capire.

In altri casi il loop è organizzativo: release rischiose inducono rilasci meno frequenti, che producono cambiamenti più grandi, che rendono le release ancora più rischiose. Architettura e processo non sono due mondi indipendenti. Si influenzano reciprocamente.

Questo è uno dei motivi per cui il confine del sistema dipende dalla domanda. Se stiamo analizzando una query lenta, probabilmente non ci interessa il processo organizzativo. Se vogliamo capire perché ogni cambiamento di produzione è diventato traumatico, escludere quel processo ci farebbe perdere metà del sistema rilevante.

## Failure domain: capire che cosa può fallire insieme

Un **failure domain** è un insieme di elementi che possono essere coinvolti dallo stesso evento di failure. La domanda non è soltanto “che cosa può rompersi?”, ma “quali parti possono rompersi contemporaneamente per la stessa causa?”.

Dieci servizi sulla stessa macchina condividono quel failure domain. Servizi distribuiti su macchine diverse possono comunque condividerne un altro se dipendono dallo stesso database o dallo stesso identity provider. Due region geograficamente separate possono fallire insieme quando ricevono la stessa configurazione errata. Due cluster possono essere indipendenti dal punto di vista hardware e dipendere dalla stessa quota, dallo stesso certificato o dalla stessa pipeline di deployment.

La separazione fisica, quindi, non garantisce indipendenza del failure.

> **Due copie dello stesso errore non sono alta disponibilità.**

### Correlated failure e ridondanza apparente

Molte architetture sembrano robuste finché immaginiamo failure indipendenti. Due istanze ci fanno sentire ridondanti, ma se vengono aggiornate nello stesso momento con la stessa image difettosa, la ridondanza non ci protegge. Un secondo database non aiuta se replica immediatamente una cancellazione logica sbagliata. Una seconda regione non è sufficiente se il controllo plane che la configura è unico e propaga la stessa policy errata ovunque.

Questo sposta il ragionamento dalla quantità di copie all'indipendenza delle cause. La domanda diventa: **quale evento comune potrebbe rendere inutili contemporaneamente le nostre difese?**

Da qui emerge naturalmente il concetto di **blast radius**. Una configurazione globale può esporre tutto il traffico allo stesso errore; un rollout progressivo limita invece il numero di utenti coinvolti mentre raccogliamo evidenza. Una feature flag per tenant restringe ulteriormente il perimetro. Allo stesso modo, un agente con permessi repository-wide può trasformare un task locale in un failure domain molto più ampio di quanto il ticket lasci intendere.

Progettare resilienza significa quindi anche progettare contenimento.

### I failure domain possono essere logici e cognitivi

Non tutti i failure domain sono infrastrutturali. Se più servizi interpretano un campo `status` attraverso la stessa libreria condivisa, un errore semantico in quella libreria può propagarsi ovunque. Se tutti gli agenti utilizzano lo stesso documento architetturale obsoleto come fonte autorevole, quella documentazione diventa un failure domain cognitivo: l'errore viene replicato con efficienza proprio perché il contesto è centralizzato.

Una source of truth è potente perché riduce divergenza. Per la stessa ragione, quando è sbagliata può amplificare l'errore. Centralizzazione della conoscenza e review devono quindi crescere insieme.

## Order Operations: due topologie di failure diverse

Nel nostro caso iniziale, anche senza aver scelto l'architettura definitiva, alcuni failure domain sono già visibili. La UI dipende dal percorso di rete, dall'identità aziendale e dalla capacità Order Operations di ottenere dati affidabili. Se la soluzione interrogasse live Orders, Payments e Shipping, l'indisponibilità o la lentezza di una di queste dipendenze potrebbe entrare direttamente nel journey dell'operatore.

Un read model separato cambierebbe la situazione, ma non eliminerebbe il rischio. Sposterebbe parte del failure domain verso pubblicazione degli eventi, consumer, projection storage, lag e processo di rebuild. La domanda interessante non è quindi se il read model sia “più resiliente” in astratto. È quali failure introduce, quali rimuove dal percorso interattivo e quali rende più facili da rilevare, contenere e recuperare.

Questa è una delle idee più importanti del capitolo: una decisione architetturale modifica anche la **topologia del fallimento**.

### Disegnare anche ciò che succede quando le cose vanno male

Quando analizziamo un componente o un journey significativo, non basta sapere cosa succede quando risponde correttamente. Dobbiamo capire che cosa cambia se non risponde, se risponde lentamente, se restituisce dati vecchi o sbagliati, se riceve due volte lo stesso input o se gli eventi arrivano in un ordine diverso da quello atteso. Poi dobbiamo allargare ancora lo sguardo: quali altre parti condividono la stessa causa di failure, qual è il blast radius, come ce ne accorgiamo e quale percorso di recovery esiste?

Non serve produrre un catalogo infinito di catastrofi. Serve rendere espliciti i failure mode che possono cambiare la decisione.

> **L'architettura non è completa quando sappiamo soltanto come il sistema funziona. Dobbiamo capire anche come può degradare, propagare un errore e recuperare.**
