## Pilota, non copilota

Il nome *copilot* ha avuto una fortuna enorme nel software. È una metafora efficace perché descrive uno strumento che siede accanto a noi, suggerisce una rotta, completa un'azione, aiuta a leggere una situazione e riduce una parte del carico operativo. Il problema nasce quando, senza accorgercene, invertiamo i ruoli: l'agente propone l'architettura e noi la accettiamo, sceglie una libreria e noi la installiamo, modifica il modello dati e noi facciamo merge, decide come gestire gli errori e noi scopriamo quella decisione leggendo il diff.

A quel punto il copilota non ci sta più aiutando a guidare. Sta guidando, mentre noi osserviamo. Per questo useremo una metafora più scomoda:

> **Sii il pilota, non il copilota.**

Non significa fare tutto personalmente. Un pilota non costruisce il motore durante il volo, non controlla a mano ogni sensore e non ricalcola continuamente ogni parametro senza strumenti. Utilizza automazione, procedure, sistemi di supporto e competenze distribuite, ma mantiene una cosa essenziale: **la consapevolezza della missione e la capacità di intervenire quando il sistema devia da ciò che dovrebbe accadere**.

### Guidare non significa digitare

Nel software abbiamo spesso confuso il controllo con l'esecuzione manuale. La domanda “Se non l'ho scritto io, come faccio a fidarmi?” è comprensibile, ma non può essere il modello operativo di sistemi in cui una singola persona governa quantità di lavoro molto superiori a quelle che può rieseguire personalmente. Il controllo non può dipendere dal rifare tutto: deve dipendere dalla capacità di definire e osservare proprietà del sistema.

Se un agente implementa un endpoint, il nostro compito non è necessariamente riscriverlo riga per riga. È sapere quale contratto debba rispettare, quali autorizzazioni siano richieste, quali invarianti non possa violare, quali errori debba produrre, quali test debbano passare e quali modifiche siano fuori scope. Allo stesso modo, se prepara una migration, non dobbiamo riscriverla per dimostrare di essere ancora developer: dobbiamo sapere se è compatibile con il deployment, se può bloccare tabelle critiche, se vecchio e nuovo codice possono convivere, se esiste una reale strategia di rollback e quale segnale ci dirà che la migrazione sta fallendo.

Essere al timone significa sapere **che cosa deve rimanere vero** mentre l'esecuzione viene delegata.

### Intento prima dell'istruzione

Un agente può ricevere un comando perfettamente chiaro e produrre comunque qualcosa di professionalmente sbagliato. Supponiamo di scrivere:

> “Sposta il caricamento delle immagini su un servizio separato e aggiungi una coda per elaborarle in background.”

Il task è comprensibile, ma manca la domanda più importante: **perché stiamo facendo questa modifica?** Il problema reale potrebbe essere la latenza percepita dall'utente, il consumo di memoria del processo web, la necessità di ritentare elaborazioni che falliscono o una crescita del traffico. Oppure potremmo non avere nessuno di questi problemi e stare semplicemente traducendo in architettura un'idea letta altrove: “le immagini vanno elaborate asincronamente”.

La stessa istruzione può quindi essere sensata in un contesto e inutile in un altro. Il pilota mantiene l'intento visibile. Prima di delegare dovrebbe poter completare la frase **“Stiamo facendo questa modifica perché…”** e, dopo la modifica, dovrebbe saper dire **“Sapremo che ha funzionato quando…”**. Tra queste due frasi vive una parte enorme dell'architettura.

### Il contesto non è un allegato

Quando lavoriamo con persone che conoscono da anni un prodotto, moltissimo contesto viene dato per scontato. Sappiamo che un certo database non può essere modificato liberamente perché alimenta un processo esterno, che un'API apparentemente interna viene usata da un vecchio client o che il job delle 02:00 è lento ma non può essere spostato perché coincide con una finestra contabile. Sappiamo anche che una feature flag è rimasta lì per un motivo storico che non compare nel codice.

Un agente non conosce automaticamente nulla di tutto questo. Può inferire, e spesso inferisce bene, ma un'inferenza plausibile non è la stessa cosa di un vincolo noto. Per questo uno dei temi ricorrenti del libro sarà il **context engineering**, non nel senso riduttivo di “scrivere prompt migliori”, ma nel senso di costruire ambienti di lavoro in cui il contesto importante sia leggibile e utilizzabile.

Un agente dovrebbe poter ricostruire l'overview del sistema, i confini architetturali e le decisioni già prese. Dovrebbe trovare contratti, convenzioni, comandi di build e test, capire ownership, requisiti non funzionali, threat model e vincoli di deployment e sapere che cosa significa done e quando deve fermarsi. Un repository ben documentato non è quindi soltanto più accogliente per il nuovo collega: è anche più governabile da strumenti artificiali.

Da qui una tesi che useremo spesso:

> **Documentation is part of the architecture.**

Naturalmente non tutta la documentazione ha lo stesso valore. Un file dimenticato da tre anni può essere peggiore dell'assenza di documentazione, perché trasforma informazione obsoleta in falsa autorità. La documentazione diventa architetturale quando riduce ambiguità su decisioni, confini, contratti e criteri di verifica.

### Un buon pilota sa anche dire “non lo so”

L'automazione crea una pressione sottile: se possiamo ottenere una risposta in pochi secondi, sembra quasi inefficiente fermarsi e ammettere che manca un'informazione. Eppure molti errori architetturali iniziano proprio da questa fretta. Possiamo non conoscere il volume atteso e scegliere comunque una strategia di scaling; non conoscere l'RPO e disegnare lo stesso un disaster recovery; non sapere chi possieda un dato e costruire integrazioni che lo replicano. Possiamo aggiungere retry “per resilienza” senza conoscere il failure mode più importante o mettere un'operazione dietro una coda senza sapere se sia idempotente.

Un engineer al timone distingue ciò che sappiamo da ciò che stiamo assumendo. Sa che alcune domande richiedono misure, altre possono essere rimandate e altre ancora devono bloccare l'esecuzione finché non vengono chiarite. Questa distinzione è ancora più importante quando lavoriamo con modelli capaci di riempire molto bene i vuoti con risposte plausibili. Il rischio non è soltanto l'allucinazione evidente: è la **fluidità con cui un'assunzione non dichiarata può diventare una decisione implementata**.

### Dal prompt alla delega professionale

Un prompt può essere una richiesta informale; una delega professionale richiede qualcosa in più. Non sempre serve un documento lungo e, per molti task, bastano poche righe. Ma quando il rischio cresce è utile rendere espliciti l'obiettivo, il contesto rilevante, il comportamento atteso, i vincoli, gli acceptance criteria, ciò che non deve cambiare, i test attesi e le condizioni che devono fermare il lavoro.

Possiamo rappresentare questa struttura in forma compatta perché qui la forma è riutilizzabile:

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

Nel prompt chiediamo un output. Nella delega definiamo **un perimetro di responsabilità verificabile**. È questa differenza che ci permette di aumentare l'autonomia senza trasformarla in abbandono.

### L'autonomia non è una virtù in sé

Nel dibattito sugli agenti c'è una tentazione ricorrente: considerare migliore il sistema che richiede meno intervento umano. Non è necessariamente vero. Un agente che apre autonomamente una pull request su una libreria interna ben testata può essere un ottimo uso dell'autonomia; lo stesso livello di libertà applicato a una migration distruttiva, a una modifica delle autorizzazioni o a un sistema che gestisce denaro può essere irresponsabile.

La domanda utile non è “Quanto possiamo rendere autonomo questo agente?”, ma:

> **“Quale livello di autonomia è proporzionato al rischio, alla verificabilità e al costo dell'errore?”**

Nel resto del libro costruiremo una matrice di autonomia più precisa. Per ora basta riconoscere un principio:

> **Più aumenta il blast radius, più deve aumentare la qualità dei guardrail.**

### Se non sappiamo spiegare, non stiamo guidando

Possiamo riassumere il ruolo del pilota con un test operativo. Davanti a una modifica importante dovremmo riuscire a ricostruire il filo della decisione: quale problema volevamo risolvere, quale alternativa abbiamo scelto e perché, quali vincoli e failure mode hanno pesato, come abbiamo verificato l'implementazione e quali condizioni ci farebbero fermare o tornare indietro.

Non serve ricordare ogni riga; serve mantenere il modello mentale del sistema. Da qui nasce anche uno dei corollari più semplici del libro:

> **Se, davanti a un errore, la nostra giustificazione è “lo ha scritto l'AI”, abbiamo probabilmente delegato troppo.**

Il problema non è la frase in sé, ma ciò che rivela: non sappiamo più ricostruire il nesso tra intenzione, decisione, esecuzione e verifica. Il copilota può fare moltissimo e può anche farci notare che stiamo sbagliando rotta. Il timone, però, non è una periferica da delegare.
