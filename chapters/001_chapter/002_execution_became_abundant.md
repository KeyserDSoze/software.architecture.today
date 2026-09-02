## Quando l'execution diventa abbondante

Per capire che cosa cambia nel software engineering dobbiamo separare due cose che per anni sono state molto vicine:

- la capacità di prendere una decisione;
- il costo di trasformarla in artefatti eseguibili.

In passato una decisione mediocre incontrava almeno una forma di attrito: implementarla richiedeva tempo.

Questo attrito non era sempre positivo. Molto lavoro ripetitivo, manuale o meccanico non merita nostalgia.

Ma quell'attrito aveva un effetto collaterale: limitava naturalmente il numero di direzioni che potevamo perseguire contemporaneamente.

Oggi possiamo chiedere a un agente di:

- aggiungere una endpoint;
- generare test;
- creare una migration;
- modificare uno schema;
- aggiungere telemetry;
- aggiornare documentazione;
- preparare una Dockerfile;
- proporre infrastruttura;
- rifattorizzare decine di file;
- aprire una pull request.

Il limite non è più sempre “quanto riusciamo a produrre?”.

Diventa sempre più spesso:

> **quanto riusciamo a capire, dirigere, confrontare e verificare?**

### Abbondanza non significa gratuità

Dire che l'execution è diventata più economica non significa dire che sia gratuita.

Ogni output introduce qualcosa che qualcuno deve comprendere.

Un nuovo componente ha un costo cognitivo.

Una nuova dipendenza ha un costo di aggiornamento.

Una nuova API ha un costo di compatibilità.

Una nuova coda ha un costo operativo.

Un nuovo retry ha un failure mode.

Un nuovo test ha un costo di manutenzione.

Un nuovo documento può diventare una fonte di drift.

Una nuova astrazione può diventare il posto in cui il team deposita complessità senza accorgersene.

Possiamo quindi avere un sistema in cui il costo di **creare** artefatti scende mentre il costo di **possedere** quegli artefatti resta alto.

Questo rende ancora più importante distinguere tra output e valore.

### Output per unità di tempo non basta più

Immaginiamo due metriche.

La prima:

```text
produttività = quantità di output / tempo
```

La seconda:

```text
produttività = valore affidabile prodotto / costo totale introdotto
```

La prima metrica premia quasi automaticamente l'automazione.

Più righe di codice, più pull request, più test, più documentazione, più issue chiuse.

La seconda obbliga a fare domande meno comode.

Quante modifiche abbiamo dovuto annullare?

Quanti bug sono stati introdotti?

Quanta complessità è rimasta nel sistema?

Quante decisioni sono state prese implicitamente?

Quanto tempo serve a un'altra persona per capire il risultato?

Quanto costa operarlo?

Quanto sarà difficile cambiarlo?

L'AI rende necessario maturare anche le metriche con cui giudichiamo il lavoro.

### Il costo di generare alternative

C'è un lato estremamente positivo dell'abbondanza.

Possiamo comprare più esplorazione.

Prima, chiedere tre implementazioni complete della stessa idea poteva essere troppo costoso.

Oggi possiamo chiedere:

> “Proponi tre alternative con trade-off diversi. Non implementare ancora.”

Oppure:

> “Mostrami una soluzione semplice, una ottimizzata per operabilità e una ottimizzata per scalabilità.”

Oppure ancora:

> “Critica la soluzione corrente e costruisci l'alternativa più forte possibile.”

Questo cambia il valore della comparazione.

L'AI non dovrebbe servire soltanto a produrre più velocemente la prima idea.

Può servire a rendere più economico **non innamorarsi della prima idea**.

È una differenza sostanziale.

### Execution abundance come leva di qualità

L'abbondanza può essere utilizzata bene.

Possiamo spendere la capacità extra per:

- generare test avversariali;
- confrontare design;
- esplorare edge case;
- produrre piccoli prototipi scartabili;
- costruire migration rehearsal;
- simulare failure;
- eseguire static analysis;
- creare reviewer indipendenti;
- spiegare codice esistente da più prospettive;
- ridurre la documentazione mancante;
- preparare rollback e runbook.

In altre parole, possiamo usare execution per aumentare **confidenza**, non soltanto volume.

Questa è una delle opportunità più importanti dell'AI-native software engineering.

### Execution abundance come leva di complessità

La stessa capacità può essere utilizzata male.

Possiamo aggiungere:

- un microservizio perché è facile generarne uno;
- un livello di astrazione perché il codice risultante sembra elegante;
- una libreria perché evita venti righe;
- una cache senza avere definito invalidazione;
- un event bus per una comunicazione che poteva essere una chiamata locale;
- un sistema multi-agent dove bastava un task sequenziale;
- centinaia di test che replicano l'implementazione;
- documentazione che descrive uno stato già superato.

L'abbondanza abbassa la soglia psicologica per aggiungere cose.

È facile confondere:

> “possiamo costruirlo”

con:

> “dovremmo costruirlo”.

Il secondo richiede giudizio.

### Il software che non scriviamo

Una delle competenze più sottovalutate dell'architect è evitare software non necessario.

Una feature eliminata dal perimetro non ha bug.

Una dipendenza non introdotta non deve essere aggiornata.

Un servizio non creato non può andare in timeout.

Una configurazione non esistente non può divergere tra ambienti.

Questo non significa idolatrare la riduzione del codice.

A volte più componenti sono la scelta giusta.

A volte un sistema distribuito è necessario.

A volte una nuova astrazione riduce davvero il costo del cambiamento.

Il punto è che la possibilità di generare facilmente una cosa non è evidenza del fatto che quella cosa appartenga al sistema.

> **Nell'era dell'execution abbondante, la sottrazione diventa una capacità architetturale ancora più preziosa.**

### Il nuovo budget scarso

Se codice, test e documentazione diventano relativamente più abbondanti, quale risorsa resta scarsa?

L'attenzione umana.

Ogni decisione importante compete per:

- tempo di review;
- capacità di comprensione;
- memoria del team;
- concentrazione;
- responsabilità operativa.

Un repository può crescere più velocemente della capacità delle persone di mantenere un modello mentale coerente.

Un backlog può produrre più pull request di quante il team riesca a revisionare seriamente.

Un agente può aprire dieci cambiamenti mentre l'essere umano riesce a comprenderne bene due.

Il throughput del sistema di sviluppo non è quindi determinato soltanto dal throughput degli agenti.

È determinato dal punto più lento della catena che mantiene affidabilità e responsabilità.

Spesso quel punto è la capacità umana di giudicare.

Per questo accelerare soltanto la generazione può produrre una coda nuova:

```text
execution veloce
→ review congestionata
→ comprensione superficiale
→ merge frettoloso
→ debito nascosto
```

L'obiettivo non è massimizzare il numero di task contemporanei.

È massimizzare il flusso di cambiamenti che il sistema socio-tecnico riesce a **comprendere e assorbire in sicurezza**.
