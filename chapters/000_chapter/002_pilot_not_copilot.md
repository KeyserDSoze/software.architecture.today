## Pilota, non copilota

Il nome *copilot* ha avuto una fortuna enorme nel software.

È una metafora efficace: descrive uno strumento che siede accanto a noi, ci suggerisce una rotta, completa un'azione, ci aiuta a leggere una situazione e riduce una parte del carico operativo.

Il problema nasce quando, senza accorgercene, invertiamo i ruoli.

L'agente propone l'architettura. Noi la accettiamo.

L'agente sceglie una libreria. Noi la installiamo.

L'agente modifica il modello dati. Noi facciamo merge.

L'agente decide come gestire gli errori. Noi scopriamo quella decisione leggendo il diff.

A quel punto il copilota non ci sta più aiutando a guidare.

Sta guidando, mentre noi osserviamo.

Per questo useremo una metafora più scomoda:

> **Sii il pilota, non il copilota.**

Non significa fare tutto personalmente.

Un pilota non costruisce il motore durante il volo, non controlla a mano ogni sensore e non ricalcola continuamente ogni parametro senza strumenti. Utilizza automazione, procedure, sistemi di supporto e competenze distribuite.

Ma mantiene una cosa essenziale: **la consapevolezza della missione e la capacità di intervenire quando il sistema devia da ciò che dovrebbe accadere**.

### Guidare non significa digitare

Nel software abbiamo spesso confuso il controllo con l'esecuzione manuale.

“Se non l'ho scritto io, come faccio a fidarmi?”

È una domanda comprensibile, ma non può essere il modello operativo di sistemi in cui una singola persona governa quantità di lavoro molto superiori a quelle che può rieseguire personalmente.

Il controllo non può dipendere dal rifare tutto.

Deve dipendere dalla capacità di definire e osservare proprietà del sistema.

Se un agente implementa un endpoint, il nostro compito non è necessariamente riscrivere l'endpoint riga per riga. È sapere quale contratto deve rispettare, quali autorizzazioni sono richieste, quali invarianti non può violare, quali errori deve produrre, quali test devono passare e quali modifiche sarebbero fuori scope.

Se un agente prepara una migration, non dobbiamo riscriverla per dimostrare di essere ancora developer. Dobbiamo sapere se è compatibile con il deployment, se blocca tabelle critiche, se può essere applicata e annullata in sicurezza, se vecchio e nuovo codice possono convivere e quale segnale ci dirà che la migrazione sta fallendo.

Essere al timone significa sapere **che cosa deve rimanere vero** mentre l'esecuzione viene delegata.

### Intento prima dell'istruzione

Un agente può ricevere un comando perfettamente chiaro e produrre comunque qualcosa di professionalmente sbagliato.

Supponiamo di scrivere:

> “Sposta il caricamento delle immagini su un servizio separato e aggiungi una coda per elaborarle in background.”

Il task è comprensibile.

Ma manca la domanda più importante:

> “Perché stiamo facendo questa modifica?”

Forse il problema reale è la latenza percepita dall'utente.

Forse è il consumo di memoria del processo web.

Forse alcune elaborazioni falliscono e vogliamo poterle ritentare.

Forse il traffico è cresciuto.

Forse qualcuno ha semplicemente letto che “le immagini vanno elaborate asincronamente”.

La stessa istruzione può essere sensata in uno di questi contesti e inutile negli altri.

Il pilota mantiene l'intento visibile.

Prima di delegare dovrebbe poter completare almeno questa frase:

> **“Stiamo facendo questa modifica perché…”**

E dopo la modifica dovrebbe poter completare quest'altra:

> **“Sapremo che ha funzionato quando…”**

Tra queste due frasi vive una parte enorme dell'architettura.

### Il contesto non è un allegato

Quando lavoriamo con persone che conoscono da anni un prodotto, moltissimo contesto viene dato per scontato.

Sappiamo che un certo database non può essere modificato liberamente perché alimenta un processo esterno. Sappiamo che un'API apparentemente interna viene usata da un vecchio client. Sappiamo che il job delle 02:00 è lento, ma non possiamo spostarlo perché coincide con una finestra contabile. Sappiamo che una feature flag è rimasta lì per un motivo storico che non compare nel codice.

Un agente non conosce automaticamente nulla di tutto questo.

Può inferire.

E spesso inferisce bene.

Ma un'inferenza plausibile non è la stessa cosa di un vincolo noto.

Per questo uno dei temi ricorrenti del libro sarà il **context engineering**.

Non nel senso riduttivo di “scrivere prompt migliori”.

Nel senso di costruire ambienti di lavoro in cui il contesto importante sia leggibile e utilizzabile. Un agente dovrebbe poter ricostruire l'overview del sistema, i confini architetturali e le decisioni già prese; trovare contratti, convenzioni, comandi di build e test; capire ownership, requisiti non funzionali, threat model e vincoli di deployment; sapere infine che cosa significa done e quando deve fermarsi.

Un repository ben documentato non è soltanto più accogliente per il nuovo collega.

È anche più governabile da strumenti artificiali.

Da qui una tesi che useremo spesso:

> **Documentation is part of the architecture.**

Non tutta la documentazione.

Non qualsiasi documento.

Un file dimenticato da tre anni può essere peggiore dell'assenza di documentazione, perché trasforma informazione obsoleta in falsa autorità.

La documentazione diventa architetturale quando riduce ambiguità su decisioni, confini, contratti e criteri di verifica.

### Un buon pilota sa anche dire “non lo so”

L'automazione crea una pressione sottile: se possiamo ottenere una risposta in pochi secondi, sembra quasi inefficiente fermarsi e ammettere che manca un'informazione.

Eppure molti errori architetturali iniziano esattamente lì.

Non sappiamo quale sia il volume atteso, ma scegliamo comunque la strategia di scaling.

Non sappiamo l'RPO, ma disegniamo il disaster recovery.

Non sappiamo chi possieda un dato, ma costruiamo integrazioni che lo replicano.

Non conosciamo il failure mode più importante, ma aggiungiamo retry “per resilienza”.

Non sappiamo se un'operazione è idempotente, ma la mettiamo dietro una coda.

Un engineer al timone distingue ciò che sappiamo da ciò che stiamo assumendo. Sa che alcune domande richiedono misure, altre possono essere rimandate e altre ancora bloccano l'esecuzione finché non vengono chiarite.

Questa distinzione è ancora più importante quando lavoriamo con modelli capaci di riempire molto bene i vuoti con risposte plausibili.

Il rischio non è soltanto l'allucinazione evidente.

È la **fluidità con cui un'assunzione non dichiarata può diventare una decisione implementata**.

### Dal prompt alla delega professionale

Un prompt può essere una richiesta informale.

Una delega professionale richiede qualcosa in più.

Non sempre serve un documento lungo. A volte bastano poche righe. Ma un task delegabile bene tende a contenere alcune proprietà:

```text
Obiettivo
Contesto rilevante
Comportamento atteso
Vincoli
Acceptance criteria
Cose che non devono cambiare
Test attesi
Stop condition
```

La differenza è sottile ma importante.

Nel prompt chiediamo un output.

Nella delega definiamo **un perimetro di responsabilità verificabile**.

Questo ci permette di aumentare l'autonomia senza trasformarla in abbandono.

### L'autonomia non è una virtù in sé

Nel dibattito sugli agenti c'è una tentazione ricorrente: considerare migliore il sistema che richiede meno intervento umano.

Non è necessariamente vero.

Un agente che apre autonomamente una pull request su una libreria interna ben testata può essere un ottimo uso dell'autonomia.

Lo stesso livello di autonomia su una migration distruttiva, una modifica di autorizzazioni o un sistema che gestisce denaro può essere irresponsabile.

La domanda utile non è:

> “Quanto possiamo rendere autonomo questo agente?”

È:

> **“Quale livello di autonomia è proporzionato al rischio, alla verificabilità e al costo dell'errore?”**

Nel resto del libro costruiremo una matrice di autonomia più precisa. Per ora basta riconoscere un principio:

> **Più aumenta il blast radius, più deve aumentare la qualità dei guardrail.**

### Se non sappiamo spiegare, non stiamo guidando

Possiamo riassumere il ruolo del pilota con un test operativo.

Davanti a una modifica importante dovremmo riuscire a ricostruire il filo della decisione: quale problema volevamo risolvere, quale alternativa abbiamo scelto e perché, quali vincoli e failure mode hanno pesato, come abbiamo verificato l'implementazione e quali condizioni ci farebbero fermare o tornare indietro.

Non serve ricordare ogni riga.

Serve mantenere il modello mentale del sistema.

Da qui nasce anche uno dei corollari più semplici del libro:

> **Se, davanti a un errore, la nostra giustificazione è “lo ha scritto l'AI”, abbiamo probabilmente delegato troppo.**

Il problema non è la frase in sé.

È ciò che rivela: non sappiamo più ricostruire il nesso tra intenzione, decisione, esecuzione e verifica.

Il copilota può fare moltissimo.

Può anche farci notare che stiamo sbagliando rotta.

Ma il timone non è una periferica da delegare.
