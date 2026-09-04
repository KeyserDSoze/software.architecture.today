## Quando l'execution diventa abbondante

Per capire che cosa cambia nel software engineering dobbiamo separare due cose che per anni sono state molto vicine: la capacità di prendere una decisione e il costo di trasformarla in artefatti eseguibili.

In passato anche una decisione mediocre incontrava almeno una forma di attrito: implementarla richiedeva tempo. Quell’attrito non era sempre positivo e non c’è nulla di nostalgico nel lavoro ripetitivo, manuale o meccanico. Aveva però un effetto collaterale: limitava naturalmente il numero di direzioni che potevamo perseguire contemporaneamente.

Oggi un agente può aggiungere un endpoint e i relativi test, creare una migration, modificare uno schema, introdurre telemetry, aggiornare la documentazione, preparare una Dockerfile, proporre infrastruttura, rifattorizzare decine di file e arrivare fino all’apertura di una pull request. Di conseguenza, il limite non è più sempre “quanto riusciamo a produrre?”. Diventa sempre più spesso un’altra domanda:

> **Quanto riusciamo a capire, dirigere, confrontare e verificare?**

### Abbondanza non significa gratuità

Dire che l’execution è diventata più economica non significa dire che sia gratuita. Ogni output introduce qualcosa che qualcuno dovrà comprendere e possedere nel tempo.

Un nuovo componente aumenta il costo cognitivo del sistema; una dipendenza dovrà essere aggiornata; una nuova API crea un impegno di compatibilità; una coda aggiunge operabilità e failure mode; un retry introduce semantica che deve essere capita; un test ha un costo di manutenzione; un documento può diventare una fonte di drift; un’astrazione può diventare il luogo in cui depositiamo complessità senza accorgercene.

Possiamo quindi trovarci in una situazione nuova: il costo di **creare** artefatti scende mentre il costo di **possederli** resta alto. Per questo la distinzione tra output e valore diventa ancora più importante.

### Output per unità di tempo non basta più

Una definizione ingenua di produttività potrebbe essere espressa così:

```text
produttività = quantità di output / tempo
```

In un mondo di execution abbondante questa metrica premia quasi automaticamente l’automazione: più righe di codice, più pull request, più test, più documentazione, più issue chiuse. Ma una misura più utile deve includere anche ciò che il sistema eredita dopo la consegna:

```text
produttività = valore affidabile prodotto / costo totale introdotto
```

Questa seconda prospettiva ci obbliga a osservare ciò che le metriche di throughput tendono a nascondere. Quante modifiche abbiamo dovuto annullare? Quanti bug sono sfuggiti? Quanta complessità è rimasta? Quanto tempo serve a un’altra persona per capire il risultato? Quanto costa operarlo e quanto sarà difficile cambiarlo?

L’AI ci costringe quindi a maturare non soltanto gli strumenti con cui produciamo software, ma anche le metriche con cui giudichiamo il lavoro.

### Il costo di generare alternative

C’è un lato estremamente positivo dell’abbondanza: possiamo comprare più esplorazione. Prima, chiedere tre implementazioni complete della stessa idea poteva essere troppo costoso. Oggi possiamo chiedere di proporre più alternative con trade-off diversi prima ancora di implementare, confrontare una soluzione semplice con una ottimizzata per operabilità o scalabilità, oppure chiedere una critica forte della soluzione corrente e costruire l’alternativa migliore possibile.

Questo cambia il valore della comparazione. L’AI non dovrebbe servire soltanto a produrre più velocemente la prima idea; può rendere più economico **non innamorarsi della prima idea**.

### Usare l’abbondanza per comprare qualità

La capacità extra può essere spesa per aumentare confidenza anziché volume. Possiamo usarla per generare test avversariali, esplorare edge case, confrontare design, costruire piccoli prototipi scartabili, provare migration rehearsal o simulare failure. Può aiutarci a preparare rollback e runbook, eseguire static analysis, creare reviewer indipendenti o spiegare codice esistente da prospettive diverse.

Questo è uno dei passaggi più importanti dell’AI-native software engineering: l’execution abbondante non è soltanto una fabbrica di output. Può diventare una leva di qualità, purché decidiamo deliberatamente di spenderla in quel modo.

### Quando l’abbondanza produce complessità

La stessa capacità può essere usata male. Proprio perché generare è economico, si abbassa la soglia psicologica per aggiungere un microservizio, un nuovo livello di astrazione, una libreria che evita poche righe o una cache di cui non abbiamo ancora definito l’invalidazione. Diventa facile introdurre un event bus dove bastava una chiamata locale, un sistema multi-agent dove bastava un task sequenziale, centinaia di test che replicano l’implementazione o documentazione destinata a diventare obsoleta prima ancora di essere utile.

A quel punto iniziamo a confondere due frasi molto diverse:

> “Possiamo costruirlo.”

con

> “Dovremmo costruirlo.”

La seconda richiede giudizio.

### Il software che non scriviamo

Una delle competenze più sottovalutate dell’architect è evitare software non necessario. Una feature eliminata dal perimetro non avrà bug; una dipendenza non introdotta non dovrà essere aggiornata; un servizio che non esiste non può andare in timeout; una configurazione che non abbiamo creato non può divergere tra ambienti.

Questo non significa idolatrare la riduzione del codice. A volte più componenti sono la scelta giusta, un sistema distribuito è necessario o una nuova astrazione riduce davvero il costo del cambiamento. Il punto è un altro: la facilità con cui possiamo generare qualcosa non è evidenza del fatto che quella cosa appartenga al sistema.

> **Nell’era dell’execution abbondante, la sottrazione diventa una capacità architetturale ancora più preziosa.**

### Il nuovo budget scarso

Se codice, test e documentazione diventano relativamente più abbondanti, una risorsa resta invece irrimediabilmente scarsa: l’attenzione umana.

Ogni decisione importante compete per tempo di review, capacità di comprensione, memoria del team, concentrazione e responsabilità operativa. Un repository può crescere più velocemente della capacità delle persone di mantenerne un modello mentale coerente. Un backlog può produrre più pull request di quante il team riesca a revisionare seriamente. Un agente può aprire dieci cambiamenti mentre l’essere umano riesce a comprenderne davvero due.

Il throughput del sistema di sviluppo non è quindi determinato soltanto dal throughput degli agenti. È determinato dal punto più lento della catena che conserva affidabilità e responsabilità. Se acceleriamo soltanto la generazione, rischiamo di creare una nuova coda:

```text
execution veloce
→ review congestionata
→ comprensione superficiale
→ merge frettoloso
→ debito nascosto
```

L’obiettivo non è massimizzare il numero di task contemporanei. È massimizzare il flusso di cambiamenti che il sistema socio-tecnico riesce a **comprendere e assorbire in sicurezza**.
