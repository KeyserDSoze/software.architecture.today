## AI e pattern selection

L'AI è molto brava a riconoscere forme ricorrenti.

Questo la rende eccellente nel trovare pattern.

La rende anche particolarmente incline a proporli quando il problema non li ha ancora richiesti.

Un agente vede due implementazioni simili e suggerisce una Strategy. Trova una dipendenza esterna e propone un Adapter. Nota command e query e può spingersi verso Mediator, CQRS, event bus e outbox. Ogni passo può essere plausibile preso da solo.

Il rischio nasce quando la somiglianza strutturale viene scambiata per evidenza che la struttura sia necessaria.

> **Riconoscere la forma di un pattern non significa aver riconosciuto il problema che lo giustifica.**

## Pattern autocomplete

I modelli generativi conoscono moltissimi esempi canonici. Quando il contesto è incompleto, tendono naturalmente a completarlo con ciò che statisticamente assomiglia a una buona architettura.

Questo comportamento è utilissimo per esplorare possibilità.

Diventa pericoloso quando il prompt chiede direttamente:

> “Refactor using design patterns and best practices.”

La richiesta contiene già la conclusione. L'agente viene premiato implicitamente se produce più struttura riconoscibile.

Una richiesta migliore parte dal dolore osservato:

> “Individua quali cambiamenti recenti hanno attraversato più responsabilità, quali failure sono ricorrenti e quali dettagli esterni stanno trapelando. Proponi il refactoring minimo che riduce questi costi. Se un pattern noto aiuta, nominalo e spiega quale forza lo giustifica.”

L'ordine cambia completamente.

Prima evidenza.

Poi problema.

Poi alternative.

Solo alla fine il pattern.

## Usare l'AI per ampliare lo spazio delle alternative

Supponiamo che la chiamata al provider Shipping stia aumentando la latency della pagina ordine.

Chiedere:

> “Quale pattern devo usare?”

restringe troppo presto la discussione.

Possiamo invece chiedere:

> “Proponi strategie significativamente diverse, dalla più semplice alla più strutturata. Per ciascuna indica quale requisito migliora, quale nuova complessità introduce, quali failure mode crea, quale observability richiede e quale evidenza servirebbe per giustificarla.”

L'output potrebbe confrontare timeout più aggressivo e fallback, caching breve, background refresh o un read model asincrono.

A quel punto il pattern è una possibile risposta dentro un design space, non la risposta implicita nel prompt.

Questa è una delle funzioni più utili dell'AI nel design: rendere economico esplorare alternative che un team, per tempo o abitudine, potrebbe non considerare.

## L'agente scettico

L'AI può essere ancora più utile quando le chiediamo di opporsi alla proposta preferita.

Un reviewer può ricevere l'istruzione:

> “Assumi che questo pattern sia overengineering. Costruisci il caso più forte per rimuoverlo senza perdere i requisiti dichiarati.”

Un secondo passaggio può chiedere il contrario:

> “Assumi che rimuoverlo sia rischioso. Quale requisito, failure mode o costo di cambiamento stiamo sottovalutando?”

Le due analisi non producono automaticamente una decisione. Rendono però visibili assunzioni che il designer iniziale potrebbe aver trattato come ovvie.

Questo approccio è particolarmente efficace per pattern sistemici, dove il costo reale non appare nel diff che li introduce.

## Il repository legacy come fonte di evidenza

Su un sistema esistente l'AI può cercare pattern impliciti senza partire dai nomi.

Può scoprire che più adapter stanno traducendo in modo incoerente lo stesso provider, che retry differenti sono sparsi fra SDK e application layer o che un workflow distribuito sta già gestendo stati intermedi e compensazioni senza una ownership esplicita. Può trovare eventi pubblicati senza un contratto chiaro, query che costruiscono di fatto un read model o classi che cambiano sempre insieme nonostante vivano in moduli differenti.

Qui l'AI non sta inventando architettura.

Sta trasformando comportamento esistente e conoscenza tribale in ipotesi verificabili.

Ma anche questa analisi deve conservare un grado di incertezza. Una struttura che assomiglia a una saga potrebbe essere soltanto una sequenza di chiamate. Due file che cambiano insieme possono farlo per una convenzione di release. Il nome del pattern non sostituisce la comprensione del comportamento.

## Le astrazioni generate non sono gratuite

La facilità con cui l'AI genera boilerplate cambia l'economia iniziale del design.

Un Adapter, un Mediator o un command bus possono materializzarsi in pochi secondi. Dieci interfacce costano quasi quanto una. Una migrazione repository-wide può aggiornare centinaia di import automaticamente.

Questo elimina una parte del costo di costruzione.

Non elimina il costo di ownership.

Il team dovrà ancora capire dove entra una nuova feature, diagnosticare failure attraverso i layer, mantenere contratti e test, aggiornare librerie e spiegare la struttura ai nuovi engineer. Anche gli agenti futuri dovranno ricevere abbastanza contesto per non duplicare o aggirare i confini.

Quindi una abstraction generata in trenta secondi può creare anni di costo cognitivo.

> **Boilerplate economico rende ancora più importante essere severi sulla semantica dell'astrazione.**

## Pattern Justification come stop condition

Per i pattern non banali possiamo trasformare il reasoning in una stop condition prima della modifica:

```text
Pattern candidate:

Observed problem:

Evidence:

Forces:

Simpler alternatives considered:

Expected benefit:

Complexity introduced:

Failure modes:

Operational consequences:

Verification plan:

Review / removal trigger:
```

Se `Evidence` e `Observed problem` rimangono vuoti o contengono soltanto “best practice”, “scalability” o “future-proofing”, l'agente non dovrebbe procedere automaticamente.

Questo non blocca l'innovazione. Costringe soltanto a separare uno spike esplorativo da una decisione che entra nel prodotto.

## Quando il pattern entra nello shared context

Non ogni Strategy locale merita documentazione architetturale.

Ma una outbox, una saga, un read model distribuito o event sourcing modificano abbastanza il sistema da dover lasciare una traccia condivisa. ADR, architecture docs, diagrammi, runbook e test strutturali possono conservare il problema, il trade-off e la semantica che il pattern introduce.

Questo è ancora più importante in un repository AI-ready. Un nuovo agente che vede soltanto la struttura corrente può interpretare una decisione deliberata come boilerplate inutile oppure introdurre una seconda soluzione incompatibile.

Lo shared context serve a evitare entrambe le derive.

## Il ruolo dell'AI

L'AI può ricordare più pattern di quanti ne potremmo tenere a mente, confrontarli rapidamente, costruire spike, cercare evidenze nel repository e attaccare una proposta da prospettive differenti.

Il suo valore non sta nel riempire il sistema di strutture canoniche.

Sta nell'aumentare la qualità dell'esplorazione e della critica prima che una struttura diventi costo permanente.

> **Usiamo l'AI per ampliare lo spazio delle alternative e la qualità delle evidenze, non per automatizzare il dogma.**