## AI e pensiero sistemico

L'AI rende molto più economico esplorare un sistema sconosciuto. Un agente può cercare dipendenze nel repository, ricostruire call graph, trovare consumer di un'API, confrontare configurazioni, individuare eventi e schemi condivisi, riassumere ADR e proporre una prima Architecture Context Map.

Tutto questo è utile. Proprio per questo è facile cadere in un errore nuovo: confondere **una mappa generata** con **un sistema compreso**.

## Il repository è evidenza, non l'intero sistema

Il codice contiene una parte importante della realtà, ma non necessariamente tutta. Un agente che esplora il repository potrebbe non vedere una feature flag gestita altrove, un job schedulato da un'altra piattaforma, un'integrazione legacy posseduta da un altro team o una procedura manuale usata dal supporto durante gli incidenti. Potrebbe ignorare un limite contrattuale del provider, una dashboard operativa, una configurazione applicata fuori dal repository o semplicemente il traffico reale che determina quali percorsi sono davvero critici.

Questo significa che una ricostruzione automatica dell'architettura deve essere trattata come **ipotesi supportata da evidenza**, non come verità finale.

Il principio è importante anche quando il diagramma sembra convincente. Il fatto che una dipendenza non compaia nel codice analizzato non prova che non esista. Dimostra soltanto che non l'abbiamo ancora osservata in quella fonte.

## Discovery: struttura statica, comportamento runtime e contesto umano

Un workflow utile su un sistema sconosciuto parte dalla struttura statica, ma non si ferma lì. Prima possiamo chiedere all'agente di formulare ipotesi su dipendenze, ownership e critical journey; poi quelle ipotesi vanno confrontate con documentazione e persone che conoscono il dominio e, quando possibile, con evidenza runtime.

In forma compatta:

```text
repository scan
→ dependency hypotheses
→ ownership and journey hypotheses
→ documentation / human validation
→ runtime evidence
→ Architecture Context Map
```

Log, metriche e trace possono raccontare una storia diversa da quella suggerita dal codice. Possono mostrare chiamate inattese, retry, fan-out reale, latenze dominanti, feature apparentemente marginali che assorbono traffico o componenti considerati obsoleti che in produzione sono ancora attivi.

Per questo la comprensione architetturale più affidabile combina:

```text
static structure
+ runtime behavior
+ human context
```

Nessuna delle tre fonti, da sola, è sempre sufficiente.

## Chiedere all'AI anche che cosa non può sapere

Una delle domande meno utili è “descrivi questa architettura” senza altri vincoli. Spinge facilmente l'agente a produrre una narrazione completa anche quando l'evidenza è incompleta.

Domande migliori chiedono invece di rendere visibili i limiti dell'analisi: quali parti del comportamento non possono essere dedotte dal repository? Quali assunzioni stiamo facendo sulla source of truth? Quali dipendenze potrebbero vivere fuori dal codice? Quali failure mode suggeriscono che manchi un componente, una procedura o un ownership boundary?

Questo cambia il ruolo dell'agente. Non gli chiediamo di sembrare sicuro; gli chiediamo di aiutarci a separare ciò che ha trovato da ciò che sta inferendo.

## Dal local optimum al reasoning di sistema

Nel Capitolo 1 abbiamo chiamato **architecture by autocomplete** la tendenza a trasformare rapidamente una richiesta locale in una soluzione plausibile. Il pensiero sistemico è uno degli antidoti più efficaci.

“Come aggiungo caching qui?” è una domanda locale. Se però il contesto include critical journey, freshness requirement, source of truth, consumer, failure domain e security constraint, la decisione cambia forma. Il caching potrebbe essere corretto, oppure inutile, oppure incompatibile con la semantica del dato. Potremmo scoprire che ci serve una proiezione o che quel dato non dovrebbe essere replicato affatto.

Il valore del contesto non è ottenere una risposta più sofisticata. È impedire che la risposta venga ottimizzata per il perimetro sbagliato.

## Multi-agent: parallelizzare prospettive, non incoerenza

Più agenti possono accelerare la discovery se ricevono una domanda condivisa. Possiamo assegnare a uno la dependency map, a un altro i trust boundary, a un terzo data ownership e a un quarto failure mode. Un quinto può svolgere una review avversariale.

La parallelizzazione funziona però soltanto se tutti stanno osservando lo stesso system of interest e lo stesso critical journey. Altrimenti otteniamo mappe apparentemente ricche ma incompatibili tra loro.

Ritorna il principio del Capitolo 0:

> **Prima sincronizzare il pensiero. Poi parallelizzare l'esecuzione.**

Qui il system of interest e il journey diventano il contesto condiviso che impedisce ai diversi agenti di ottimizzare sistemi diversi senza accorgersene.

## Lo skeptical reviewer cerca ciò che manca

Dopo aver prodotto una prima Context Map, un secondo agente può essere più utile se non gli chiediamo di ridisegnarla. Gli chiediamo invece di cercare dipendenze mancanti, ownership ambigue, failure correlati, trust boundary dimenticati e assunzioni non validate.

Questa indipendenza di prospettiva è uno dei modi migliori di usare l'abbondanza di agenti. Non compriamo cinque versioni della stessa risposta; compriamo cinque possibilità di trovare un errore diverso.

## Generated diagram illusion

Un anti-pattern merita un nome: **generated diagram illusion**.

Il diagramma è pulito, le frecce hanno nomi plausibili, Mermaid compila e i componenti sono allineati. Quella qualità visiva crea facilmente una sensazione di comprensione che l'evidenza non giustifica.

Potrebbero mancare ownership, temporality, freshness, fallback, failure correlation, trust boundary o processi manuali. Il diagramma può essere sintatticamente corretto e semanticamente sbagliato.

> **La qualità grafica è un segnale molto debole della qualità del modello architetturale.**

Per questo una Context Map deve dichiarare anche ciò che non sa e ciò che deve ancora essere verificato.

## Context engineering come controllo architetturale

Nei sistemi AI-native, context engineering non riguarda soltanto il modo in cui formuliamo un prompt. Riguarda quali parti del sistema rendiamo disponibili alla decisione automatizzata.

Se un coding agent vede soltanto il file da modificare, gli stiamo implicitamente dicendo che il resto del sistema non conta. Se invece riceve Problem & Outcome Brief, Architecture Context Map, ADR, contract, NFR e stop condition, gli stiamo dando una rappresentazione molto più fedele del problema e dei suoi confini.

La documentazione, in questo senso, diventa parte del control plane architetturale. Non perché il documento sia sempre corretto, ma perché rende verificabili le assunzioni che altrimenti verrebbero ricostruite ogni volta per inferenza.

## La responsabilità resta epistemica

Anche con strumenti molto forti dobbiamo sapere distinguere ciò che sappiamo da ciò che crediamo. Un architect non vale perché possiede una mappa perfetta; vale anche perché riconosce dove quella mappa è incompleta, quali assunzioni sono fragili, quando serve runtime evidence e quando bisogna parlare con un altro team.

Lo stesso vale per l'output di un agente. Un'analisi elegante non elimina il bisogno di chiedersi da quali fonti deriva e quali parti non potevano essere verificate.

Il pensiero sistemico non elimina l'incertezza. La rende visibile abbastanza presto da poterla governare.

> **L'AI può aiutarci a vedere più parti del sistema. Il judgment serve ancora per capire quali parti mancano e quali evidenze ci autorizzano a fidarci.**
