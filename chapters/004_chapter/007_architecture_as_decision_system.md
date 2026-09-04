## Architettura come sistema di decisioni

A questo punto possiamo rendere più concreta la definizione iniziale. Un'architettura sana non è soltanto un insieme di scelte ragionevoli. È anche un **sistema che permette di prendere, comunicare, verificare e rivedere decisioni nel tempo**.

Questo sistema può essere molto leggero. Non richiede un Architecture Review Board per ogni modifica. Richiede però che le decisioni importanti emergano dal rumore e che rimanga visibile il legame tra ciò che abbiamo scelto e il contesto che lo rendeva sensato.

## Rendere visibile ciò che conta

Se ogni dettaglio viene documentato allo stesso livello, le decisioni architetturali spariscono dentro la documentazione. Se non documentiamo nulla, rimangono soltanto nel codice e nella memoria delle persone.

Serve selezione.

Una domanda utile è:

> **Se una persona entrasse nel progetto tra un anno, quali scelte dovrebbe capire per non danneggiare accidentalmente il sistema?**

Quelle scelte sono buone candidate per ADR, architecture docs o guardrail espliciti. Non perché siano “più tecniche”, ma perché perderne il reasoning aumenta il rischio di evoluzione accidentale.

## Collegare decisioni e requisiti

Una scelta separata dal requisito che l'ha prodotta tende a trasformarsi in dogma. “Tutti i servizi devono essere asincroni” può sembrare una policy architetturale forte; se però la decisione originale serviva soltanto a isolare un particolare workload, generalizzarla al resto del sistema è un errore.

Per questo una decisione importante dovrebbe conservare il legame con problema, ASR, vincoli e trade-off. Soltanto così possiamo capire se il reasoning sia ancora valido quando il contesto cambia.

Il requisito non serve a giustificare la decisione per sempre. Serve a renderla **falsificabile**.

## Autonomia locale e coerenza condivisa

Non tutte le scelte devono essere prese allo stesso livello. Alcune acquistano valore proprio perché sono coerenti nell'organizzazione: identity provider, gestione dei secret, baseline minime di observability, criteri di security o formati di audit possono beneficiare di una policy condivisa.

Altre decisioni possono e dovrebbero rimanere locali al team. Centralizzare tutto rallenta; decentralizzare tutto produce frammentazione.

L'architettura deve quindi chiarire **dove l'autonomia è desiderata e dove la coerenza è parte del valore**. Questo confine decisionale è spesso più importante della singola tecnologia scelta.

## Dai documenti ai guardrail eseguibili

Una decisione importante può essere protetta anche da controlli automatici. Architecture test, lint rule, policy as code, contract test, schema validation, CI check e dependency rule possono trasformare una parte dell'intenzione architetturale in un vincolo verificabile.

Se decidiamo che un modulo non deve dipendere direttamente da un altro dominio, possiamo scriverlo in un ADR. Se il repository lo permette, possiamo anche far fallire la build quando quella dipendenza compare.

Il documento spiega **perché** esiste il confine. Il guardrail aiuta a evitare che venga violato inconsapevolmente.

Più avanti torneremo su questo punto parlando di testing, evolutionary architecture e fitness functions.

## L'architettura deve incontrare la produzione

Una decisione rimane un'ipotesi finché non incontra il sistema reale. Possiamo introdurre una cache convinti che ridurrà il carico e scoprire che il hit rate è trascurabile. Possiamo inserire una queue per assorbire picchi e osservare una latency end-to-end incompatibile con il journey. Possiamo separare un servizio per isolare i failure e scoprire che tutti i servizi dipendono comunque dallo stesso database.

Per questo l'architettura deve ricevere feedback da metriche, incidenti, costi, deployment, support ticket, tempi di sviluppo e failure realmente osservati.

> **Un'architettura che non riceve feedback dal sistema reale diventa rapidamente una teoria sul sistema.**

I trigger di revisione chiudono il ciclo:

```text
requisito
→ decisione
→ implementazione
→ osservazione
→ trigger
→ rivalutazione
```

La governance diventa così dinamica. Non scolpiamo una scelta nella pietra; la rendiamo abbastanza esplicita da poterla mettere in discussione quando cambiano le condizioni.

## Disegnare dopo non rende retroattivamente intenzionale una scelta

Un anti-pattern frequente consiste nel costruire prima e disegnare dopo. Il diagramma finale può essere utilissimo per comprendere un legacy system, ma non va confuso con il processo architetturale.

Se le decisioni significative sono avvenute implicitamente durante l'implementazione, una documentazione successiva non le rende intenzionali retroattivamente.

> **Descrivere una struttura dopo che è emersa non equivale ad averne governato la formazione.**

L'errore opposto è architecture by committee: supporre che una decisione diventi migliore soltanto perché passa attraverso più meeting e più firme. Una governance utile deve migliorare contesto, confronto delle alternative, comprensione del rischio e ownership. Se aggiunge soltanto attesa, sta aumentando decision latency senza aumentare decision quality.

## Architecture by title

Le decisioni architetturali non appartengono esclusivamente a chi ha “Architect” nel job title. Un developer che modifica un contratto pubblico, introduce una dipendenza trasversale o cambia l'ownership di un dato sta prendendo una decisione con peso architetturale.

Allo stesso modo, un architect che produce diagrammi senza comprendere implementazione, operazioni e dominio può incidere pochissimo sulla forma reale del sistema.

Per questo il libro parla di **competenza architetturale**, non soltanto di ruolo.

## Anche non decidere ha un costo

Abbiamo insistito molto sul rischio delle decisioni premature. Esiste però anche il problema opposto: lasciare ambigua una scelta significativa mentre team e agenti continuano a implementare.

Quando il vuoto persiste, ciascuno lo riempie con una decisione locale. La **decision latency** può trasformarsi in semantic divergence, contratti incompatibili e rework.

Governare l'architettura significa quindi anche riconoscere quando l'incertezza è ancora utile e quando, invece, è arrivato il momento di scegliere.

## Il sistema decisionale nell'era degli agenti

Con più agenti autonomi, ADR, boundary, policy, contract, test e stop condition diventano una forma di **governance leggibile dalle macchine**. Non servono a costruire una prigione di regole; servono a evitare che ogni task ricominci da zero la discussione sulle decisioni già prese.

Finché il contesto rimane valido, il sistema deve poter applicare quelle decisioni con coerenza. Quando il contesto cambia, dobbiamo essere capaci di riconoscerlo e aggiornare la scelta.

> **L'architettura migliore non centralizza tutte le decisioni. Rende chiaro quali devono essere condivise, quali possono restare locali e quali evidenze ci obbligano a riaprirle.**
