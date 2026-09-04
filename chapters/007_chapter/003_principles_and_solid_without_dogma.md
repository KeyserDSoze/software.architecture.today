## Principi prima dei rituali

Prima dei pattern vengono i principi, perché un principio non prescrive la forma del codice: ci aiuta a capire se il design sta andando nella direzione giusta.

È per questo che cohesion, coupling, information hiding e dependency direction sono più importanti di qualunque catalogo. Lo stesso vale per SOLID. Le cinque iniziali sono utili se diventano un linguaggio con cui diagnosticare pressioni reali; diventano pericolose quando le usiamo come una macchina che produce interfacce, classi e layer indipendentemente dal problema.

Il punto non è quindi “applicare SOLID”. È osservare che cosa rende costoso cambiare il software e capire quale principio ci aiuta a descrivere quella tensione.

## Le ragioni di cambiamento vengono prima delle classi

La versione scolastica del **Single Responsibility Principle** viene spesso riassunta con “una classe deve fare una sola cosa”. Ma quasi ogni comportamento può essere scomposto in cose più piccole, quindi la frase non ci dice dove fermarci.

La domanda più utile è: **per quali ragioni indipendenti cambia questo componente?**

Se pricing, authorization, persistenza e rendering evolvono per decisioni diverse e obbligano sempre a modificare lo stesso oggetto, stiamo comprimendo responsabilità che non condividono davvero la stessa vita. Se invece più comportamenti cambiano insieme perché proteggono la stessa invariante del dominio, separarli soltanto per ottenere classi più piccole può peggiorare la comprensione.

SRP non ci chiede quindi di minimizzare la dimensione. Ci chiede di rendere leggibili le ragioni di cambiamento.

## Estendere soltanto dove esiste una variazione credibile

L'**Open/Closed Principle** viene spesso interpretato come un invito a progettare ogni parte del sistema per l'estensione futura. È un modo molto efficiente per comprare complexity debt prima di sapere se la variazione arriverà mai.

La domanda interessante è diversa:

> **Quale dimensione del comportamento abbiamo evidenza che varierà, e quanto ci costerebbe assorbire quella variazione senza un punto di estensione?**

Se Order Operations usa un solo provider e non esiste alcun segnale concreto che questo cambierà, un plugin system sofisticato è probabilmente prematuro. Se il business ha già deciso di operare in mercati che richiedono provider differenti, la stessa astrazione può diventare una protezione utile.

L'obiettivo non è essere chiusi alla modifica in senso assoluto. È impedire che una variazione nota e ricorrente costringa ogni volta a riscrivere parti che non dovrebbero esserne coinvolte.

## Un contratto promette comportamento, non soltanto tipi

Qui entra il **Liskov Substitution Principle**. Due implementazioni non diventano sostituibili soltanto perché il compilatore accetta la stessa interfaccia.

Immaginiamo due adapter che implementano lo stesso `PaymentGateway`. Il primo considera un timeout un risultato incerto e richiede una verifica successiva; il secondo garantisce che il timeout significhi nessun addebito. Dal punto di vista del type system possono essere identici. Dal punto di vista del caso d'uso hanno semantiche radicalmente diverse.

La sostituibilità riguarda quindi errori e timeout, idempotenza e side effect, ordering e consistency, oltre ai valori di ritorno. Un contratto utile deve rendere abbastanza esplicite queste aspettative da permettere al consumer di non dipendere accidentalmente dall'implementazione concreta.

Questo collega direttamente LSP al coupling semantico visto nel Capitolo 5.

## Il consumer non deve conoscere più di ciò che usa

L'**Interface Segregation Principle** non dice che le interfacce debbano essere microscopiche. Dice che un consumer non dovrebbe essere obbligato a conoscere capacità che non gli appartengono.

Un'interfaccia enorme che espone authorization, refund, settlement, reconciliation e provider administration a un componente che deve soltanto leggere lo stato di un pagamento crea coupling inutile. Ma spezzarla meccanicamente in venti micro-interface può rendere altrettanto difficile capire il modello.

Il criterio rimane semantico: il contratto deve rappresentare la capability di cui quel consumer ha bisogno, con una granularità che conservi significato.

## La direzione della conoscenza

Il **Dependency Inversion Principle** completa il quadro. Una policy importante non dovrebbe essere trascinata da dettagli che cambiano per altre ragioni.

Se una regola del dominio dipende direttamente dal client SDK di un provider, dal framework HTTP o dal database, la conoscenza sta puntando dal significato verso il dettaglio. Un contratto può invertire quella direzione e fare in modo che sia l'adapter infrastrutturale a conformarsi alla capability richiesta dal dominio.

Ma l'interfaccia non è il principio.

Creare `IClock`, `IIdGenerator`, `ILogger`, `IRepository`, `IHttpClient`, `IConfigurationProvider` e una controparte astratta per ogni classe concreta non dimostra dependency inversion. Può semplicemente aumentare il numero di salti mentali necessari per seguire il comportamento.

L'astrazione ha valore quando rende locale una decisione che vogliamo poter cambiare, testare o governare indipendentemente.

## SOLID come diagnostica

Una review basata su SOLID dovrebbe quindi produrre domande, non punteggi. Possiamo chiederci se un componente cambi per ragioni davvero indipendenti, se stiamo pagando oggi per una variazione soltanto immaginata, se due implementazioni rispettino lo stesso comportamento e se un consumer conosca più del necessario. Possiamo soprattutto verificare se una policy importante dipenda da un dettaglio volatile soltanto perché era il percorso più breve da implementare.

Queste domande possono portarci a introdurre un pattern.

Possono anche portarci a rimuoverne uno.

## La semplicità sufficiente

Quasi sempre esiste una tensione tra flessibilità futura e semplicità presente. Nessun principio elimina quel trade-off.

Un design troppo rigido rende costosi cambiamenti che sappiamo già arriveranno. Un design eccessivamente estensibile trasforma il presente in un framework per futuri possibili.

La scelta matura è comprare la struttura necessaria per rendere economici i cambiamenti plausibili e lasciare aperte, senza implementarle in anticipo, le possibilità ancora incerte.

Questo è coerente con reversibilità, fit before fashion e Pattern Justification.

> **Un principio è una bussola. Quando diventa una procedura meccanica, smette di aiutarci a pensare.**