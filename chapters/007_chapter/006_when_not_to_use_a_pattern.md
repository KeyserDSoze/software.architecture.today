## Quando non usare un pattern

Una delle competenze più difficili nel design è saper lasciare una soluzione semplice quando la semplicità è sufficiente.

Il problema è che la semplicità raramente sembra prestigiosa. Un endpoint che legge una fonte autorevole, applica una regola chiara e restituisce una risposta può apparire meno “architetturale” di un flusso con command bus, event bus, mediator, outbox e read model.

Ma l'architettura non è una gara di densità concettuale.

Se una struttura più semplice soddisfa bene i requisiti, la semplicità non è assenza di design. È una decisione di design.

## La complessità deve pagare l'affitto

Ogni pattern significativo introduce una forma di **complexity debt**.

Non significa che il pattern sia sbagliato. Molta complessità è necessaria. Significa però che il costo continua a esistere dopo il merge.

Lo paghiamo nell'onboarding e nel debugging, nei test e nell'observability, nel deployment e nell'incident response. Lo paghiamo nella documentazione e negli upgrade, nelle competenze che il team deve mantenere e nel tempo necessario a spiegare a un nuovo engineer o a un nuovo agente perché quella struttura esista.

La relazione che cerchiamo è quindi semplice:

```text
beneficio permanente del pattern
>
costo permanente della complessità introdotta
```

Il problema è che il beneficio viene spesso raccontato in termini futuri e vaghi, mentre il costo inizia oggi.

“Un giorno potremmo avere più provider.”

“Un giorno potremmo supportare più database.”

“Un giorno potremmo scalare a milioni di utenti.”

Sono futuri possibili. Quasi tutto è possibile. La domanda è se quella possibilità sia abbastanza probabile o abbastanza costosa da giustificare una struttura concreta adesso.

Questo è il territorio della **speculative generality**.

## Preservare una possibilità non significa implementarla

Abbiamo già incontrato questa distinzione parlando di reversibilità.

Possiamo mantenere il dominio separato dall'SDK di un provider senza costruire un plugin system universale. Possiamo evitare query cross-domain senza introdurre immediatamente messaging asincrono. Possiamo scegliere contratti stabili senza costruire un framework di versioning per scenari che non esistono.

Un boundary pulito può comprare option value con un costo molto più basso di un'architettura progettata per tutte le alternative immaginabili.

Questa è una delle ragioni per cui **fit before fashion** e **pattern threshold** sono la stessa disciplina vista da due angolazioni diverse.

## Il test della rimozione

Per capire se un pattern ha davvero un lavoro possiamo invertire la domanda:

> **Se togliessimo questa struttura, quale requisito, rischio o costo diventerebbe materialmente peggiore?**

Se rimuoviamo il circuit breaker, quale failure propagation torna possibile? Se eliminiamo la queue, quale coupling temporale diventa inaccettabile? Se togliamo l'adapter, quale dettaglio esterno entra nel dominio? Se torniamo da un read model dedicato a una query diretta, quale requisito di latency o isolation smette di essere soddisfatto?

La risposta non deve per forza essere “il sistema smette di funzionare”. Un pattern può valere perché riduce un rischio, rende il recovery più affidabile o contiene un cambiamento frequente.

Ma la risposta deve essere concreta.

Se tutto ciò che rimane è “questa è la best practice”, il pattern probabilmente non è governato da un bisogno reale.

## Overengineering e underengineering sono errori speculari

Gli agenti rendono l'overengineering più economico da produrre.

Un prompt come:

> “Refactor this according to Clean Architecture and best practices.”

può generare in pochi minuti:

```text
domain/
application/
infrastructure/
adapters/
ports/
commands/
queries/
handlers/
repositories/
factories/
```

La struttura può essere ordinata e ben testata. Può anche essere sproporzionata rispetto al problema. Il costo iniziale di scriverla è sceso; il costo cognitivo di possederla no.

Ma la reazione opposta sarebbe altrettanto pericolosa.

Rifiutare ogni pattern in nome della semplicità può diventare **underengineering**. Un sistema che ignora failure già osservati, idempotenza necessaria, ownership ambigua o coupling che blocca continuamente il delivery non è pragmatico. Sta semplicemente rinviando un problema certo.

La semplicità utile non è la soluzione con meno file. È la soluzione meno complessa che soddisfa in modo credibile il contesto attuale.

## La soglia di adozione

Un pattern dovrebbe entrare quando esiste una pressione abbastanza concreta da pagarlo.

La pressione può apparire come duplicazione semantica ricorrente o come una variazione reale che sta rendendo costose le modifiche. Può emergere da failure ripetuti, da coupling che obbliga a coordinare troppi team o da un quality attribute che la struttura attuale non riesce più a raggiungere. Crescita misurata della scala, compliance, audit o un nuovo security boundary possono alzare la stessa pressione.

La parola importante è **osservabile**.

Un pattern non deve aspettare che il sistema sia già in crisi, ma deve poter essere collegato a un rischio o a una traiettoria credibile, non alla paura generica del futuro.

La stessa soglia può funzionare al contrario. Se il contesto cambia e il beneficio che giustificava il pattern scompare, la struttura può essere semplificata.

I pattern non sono promesse eterne.

## La prova della spiegazione semplice

Un ottimo test di governance è riuscire a spiegare il pattern in poche frasi senza usare il suo nome come giustificazione.

Per esempio:

> “Dobbiamo rendere affidabile la pubblicazione di `OrderConfirmed` insieme al commit dell'ordine senza usare una transazione distribuita. Registriamo quindi l'intenzione di pubblicazione nella stessa transazione locale. Accettiamo duplicate delivery e richiediamo consumer idempotenti.”

Solo dopo possiamo aggiungere:

> “Questo è il transactional outbox pattern.”

L'ordine conta.

Prima problema e trade-off. Poi il nome.

> **La complessità deve avere un lavoro. Se non sappiamo quale lavoro svolge, è soltanto complessità.**