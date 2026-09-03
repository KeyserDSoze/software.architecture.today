## Quando non usare un pattern

Una delle competenze più importanti nel design è saper lasciare una soluzione semplice quando la semplicità è sufficiente.

Il problema è che la semplicità raramente sembra prestigiosa.

Un endpoint che legge una tabella, applica una regola chiara e restituisce una risposta può sembrare meno “architetturale” di un sistema con command bus, event bus, mediator, outbox e read model.

Ma l'architettura non è una gara di densità concettuale.

### Complexity debt

Ogni pattern significativo introduce un debito di complessità.

Non è necessariamente debito tecnico negativo.

Può essere complessità necessaria.

Ma deve essere pagata.

Il costo compare in:

- onboarding;
- debugging;
- test;
- observability;
- deployment;
- incident response;
- documentazione;
- evoluzione;
- capacità richiesta al team.

Possiamo pensare a una regola semplice:

```text
beneficio del pattern
>
costo permanente della complessità introdotta
```

Se non sappiamo dimostrarlo, la scelta va trattata con sospetto.

### Speculative generality

Uno degli anti-pattern più frequenti è progettare per variazioni immaginate.

“Un giorno potremmo avere più provider.”

“Un giorno potremmo supportare più database.”

“Un giorno potremmo dover scalare a milioni di utenti.”

Questi futuri sono possibili.

Quasi tutto è possibile.

La domanda è se siano abbastanza probabili e costosi da giustificare complessità oggi.

Nel Capitolo 2 abbiamo distinto tra preservare una possibilità futura e implementarla in anticipo.

Qui vale la stessa regola.

Possiamo mantenere un confine pulito senza costruire un plugin system.

Possiamo evitare coupling accidentale a un provider senza creare dieci livelli di abstraction.

Possiamo definire un contratto chiaro senza introdurre subito messaging asincrono.

### Il test della rimozione

Un esercizio potente è chiedere:

> “Se togliessimo questo pattern, quale requisito o rischio diventerebbe materialmente peggiore?”

Se la risposta è vaga, il pattern potrebbe non avere una funzione reale.

Per esempio:

- togliamo il circuit breaker: quale failure propagation ricompare?
- togliamo la queue: quale coupling temporale diventa inaccettabile?
- togliamo il repository abstraction: quale dettaglio volatile entra nel dominio?
- togliamo CQRS: quale differenza tra read e write model non riusciamo più a gestire?

Se il sistema continua a soddisfare bene i requisiti, la struttura forse era decorativa.

### Overengineering assistito dall'AI

Con gli agenti possiamo creare overengineering a una velocità prima difficile da sostenere.

Chiediamo:

> “Refactor this according to Clean Architecture and best practices.”

L'agente può produrre:

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

Il risultato può essere ordinato.

Può anche essere completamente sproporzionato rispetto al problema.

Il fatto che il codice sia stato generato rapidamente non annulla il costo cognitivo della struttura.

### Underengineering

Evitare religione non significa scegliere sempre la soluzione più semplice possibile.

Esiste anche l'errore opposto.

Un sistema che ignora problemi già evidenti di retry, idempotenza, ownership o failure isolation non è pragmatico.

È fragile.

La semplicità utile è quella che soddisfa bene il contesto attuale.

Non quella che rinvia problemi certi.

### Pattern threshold

Possiamo immaginare una soglia di adozione.

Un pattern entra quando almeno una combinazione di questi segnali diventa concreta:

- duplicazione semantica frequente;
- variazione reale e costosa;
- failure ricorrente;
- coupling che blocca delivery;
- requisito di qualità non raggiungibile con la struttura attuale;
- rischio operativo significativo;
- crescita di scala misurata;
- compliance o audit che richiedono nuove proprietà.

Il pattern risponde a una pressione osservabile.

Non alla paura generica del futuro.

### La prova della spiegazione semplice

Se non riusciamo a spiegare in due o tre frasi perché un pattern esiste nel sistema, probabilmente non lo governiamo davvero.

Una buona spiegazione è:

> “Usiamo una outbox perché dobbiamo rendere affidabile la pubblicazione di `OrderConfirmed` insieme al commit dell'ordine, senza una transazione distribuita. Accettiamo duplicate delivery e richiediamo consumer idempotenti.”

Una spiegazione debole è:

> “È la best practice per sistemi event-driven.”

La prima contiene problema e trade-off.

La seconda contiene appartenenza a una scuola.

> **La complessità deve avere un lavoro. Se non sappiamo quale lavoro svolge, è soltanto complessità.**
