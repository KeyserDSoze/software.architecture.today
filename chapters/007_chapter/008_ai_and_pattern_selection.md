## AI e pattern selection

L'AI è particolarmente brava a riconoscere pattern.

Questo è un vantaggio e un rischio.

Dato un repository, un agente può individuare rapidamente strutture che assomigliano a Strategy, Adapter, Repository, Mediator, CQRS o event-driven architecture.

Può anche suggerire pattern mancanti.

Ma somiglianza strutturale e necessità architetturale non sono la stessa cosa.

### Il rischio del pattern autocomplete

Un agente vede:

- due implementazioni simili;
- una dipendenza esterna;
- alcuni handler;
- eventi di dominio;

ed è tentato di completare la figura.

Può proporre:

- interface comune;
- abstract factory;
- mediator;
- event bus;
- outbox;
- CQRS completo.

Il risultato può sembrare coerente proprio perché l'AI conosce bene le forme ricorrenti.

Ma la domanda decisiva rimane umana:

> **quale pressione reale del sistema rende necessaria questa struttura?**

### Chiedere alternative, non una soluzione

Un uso migliore dell'AI è chiedere di produrre uno spazio di opzioni.

Per esempio:

> “La chiamata al provider di shipping sta aumentando la latency della pagina ordine. Proponi almeno quattro strategie, dalla più semplice alla più strutturata. Per ciascuna indica requisito che soddisfa, nuova complessità, failure mode, osservabilità necessaria e trigger che la renderebbe giustificata.”

L'output potrebbe confrontare:

```text
1. timeout più aggressivo + fallback
2. caching breve
3. background refresh
4. read model asincrono
```

A quel punto il pattern è una delle alternative, non il punto di partenza.

### Adversarial pattern review

Possiamo assegnare a un agente un ruolo esplicitamente scettico:

> “Assumi che questo pattern sia overengineering. Dimostra il caso più forte per rimuoverlo.”

Oppure:

> “Quale soluzione più semplice soddisferebbe gli stessi requisiti?”

Oppure:

> “Quali costi operativi di questo pattern non sono rappresentati nel diff?”

Queste domande compensano la naturale tendenza dei modelli a completare strutture note.

### Pattern detection in legacy systems

Su un repository esistente l'AI può essere molto utile per scoprire pattern impliciti.

Possiamo chiedere:

- dove esistono adapter non dichiarati?
- quali componenti implementano di fatto una strategy?
- esiste un event bus informale?
- quali retry sono distribuiti nel codice?
- dove viene implementata idempotenza?
- quali workflow assomigliano a una saga senza essere modellati esplicitamente?

Questo tipo di analisi può trasformare conoscenza tribale in contesto esplicito.

Ma il risultato va verificato sul comportamento reale.

L'agente può riconoscere una struttura sintattica e darle un nome sbagliato.

### Il pattern non giustifica il pattern

Un errore frequente nei prompt è chiedere:

> “Refactor using design patterns and best practices.”

La richiesta contiene già il bias.

Invita il modello a introdurre strutture riconoscibili indipendentemente dal bisogno.

È meglio chiedere:

> “Individua le parti del design che rendono costosi i cambiamenti osservati negli ultimi task. Proponi il refactoring minimo che riduce quel costo. Se un pattern noto aiuta, nominalo e spiega perché.”

L'ordine è completamente diverso.

Prima il dolore.

Poi la struttura.

### AI-generated abstractions

Le astrazioni generate dall'AI hanno una caratteristica pericolosa: costano pochissimo a chi le crea.

Per questo possono sembrare quasi gratuite.

Ma il team successivo dovrà:

- capire perché esistono;
- sapere dove aggiungere comportamento;
- diagnosticare i failure attraverso più layer;
- mantenere test e contratti;
- spiegare la struttura a nuovi agenti.

Quindi una abstraction generata in trenta secondi può creare anni di costo cognitivo.

### Il Pattern Justification Test

Per pattern non banali possiamo chiedere all'agente di produrre questo blocco prima di modificare il codice:

```text
Pattern candidate:

Observed problem:

Evidence:

Forces:

Simpler alternatives considered:

Complexity introduced:

Operational consequences:

Verification plan:

Removal / review trigger:
```

Se l'evidence manca, l'agente non dovrebbe procedere automaticamente.

Questo è un ottimo esempio di stop condition applicata al design.

### Pattern e shared context

Quando un pattern significativo è adottato, dovrebbe entrare nel contesto del repository.

Non serve documentare ogni `Strategy` locale.

Ma una scelta come outbox, saga o CQRS distribuito dovrebbe essere visibile in:

- ADR;
- architecture docs;
- diagrammi rilevanti;
- runbook;
- test di architettura, quando utili;
- istruzioni per gli agenti.

Altrimenti un nuovo agente potrebbe implementare una seconda strategia incompatibile.

### La regola

L'AI può aiutarci a ricordare più pattern di quanti ne potremmo tenere a mente.

Può confrontarli rapidamente.

Può generare prototipi.

Può cercare violazioni.

Ma non deve trasformare il nostro repository in una collezione di strutture canoniche.

> **Usiamo l'AI per ampliare lo spazio delle alternative, non per automatizzare il dogma.**
