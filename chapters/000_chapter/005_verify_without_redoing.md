## Verificare senza rifare

Se l'AI produce lavoro più velocemente di quanto noi possiamo rifarlo a mano, la supervisione non può consistere nel ripetere ogni attività dall'inizio. Sarebbe un modo costoso di fingere di aver delegato. Il problema diventa quindi:

> **come possiamo verificare un risultato senza rieseguire integralmente il lavoro che lo ha prodotto?**

Questa domanda è centrale per tutto il libro e non riguarda soltanto gli agenti. È uno dei fondamenti dell'ingegneria: non verifichiamo un ponte ricostruendone un secondo accanto e non verifichiamo un database riscrivendo il database. Costruiamo invece proprietà osservabili, contratti, misure e prove che ci permettano di aumentare la confidenza.

### Verifica non significa certezza

Verificare non significa dimostrare che qualcosa non potrà mai fallire. Nella maggior parte dei sistemi reali non abbiamo questa possibilità. Significa raccogliere evidenza proporzionata al rischio.

Per una modifica possiamo combinare controlli diversi: type checking e lint, unit e integration test, contract e property-based test, mutation test, static analysis, security e performance scan. A questi possiamo aggiungere diff e architecture review, canary deployment e, quando il cambiamento arriva in produzione, metriche e tracing. Nessuno di questi strumenti è infallibile, ma la loro combinazione può rendere una conclusione sufficientemente affidabile per procedere.

### Verificare il comportamento, non la prosa

Un agente può spiegare molto bene ciò che ha fatto e questa capacità è utile, ma una spiegazione non è una prova. Se chiediamo “Hai mantenuto la backward compatibility?”, potremmo ricevere una risposta dettagliata e plausibile. È più forte poter osservare contract test sulle versioni precedenti, uno schema diff e fixture realistiche, confrontare la risposta dell'API prima e dopo la modifica e verificare il comportamento con client che rappresentino davvero la compatibilità promessa.

Il principio è semplice:

> **Quando una proprietà importante può essere verificata dal sistema, preferisci evidenza eseguibile a rassicurazione testuale.**

L'AI può produrre entrambe; noi dobbiamo sapere quale delle due pesa di più.

### Invarianti

Una delle forme più potenti di verifica è definire ciò che deve rimanere vero indipendentemente dall'implementazione. Un ordine rimborsato, per esempio, non dovrebbe poter essere rimborsato una seconda volta; un utente non dovrebbe mai leggere dati appartenenti a un tenant diverso; la somma degli importi allocati non dovrebbe superare il totale disponibile. Sono proprietà di dominio e di sicurezza che possono sopravvivere a molti refactoring proprio perché non dipendono dalla forma del codice.

Quando rendiamo queste invarianti esplicite, possiamo costruire test e controlli che proteggono ciò che conta anche se l'implementazione cambia molto rapidamente. Questo è particolarmente utile con gli agenti: il codice può essere riscritto, spostato o semplificato, mentre la proprietà che vogliamo preservare resta stabile.

### Contracts

Un contratto riduce la superficie che dobbiamo comprendere in dettaglio. Un componente può promettere, per esempio, che un input valido produca un output conforme allo schema, che un input duplicato non produca un effetto aggiuntivo e che un fallimento esterno venga trasformato in un errore classificato e osservabile:

```text
input valido → output conforme allo schema
input duplicato → nessun effetto aggiuntivo
fallimento esterno → errore classificato e osservabile
```

Possiamo verificare quel contratto senza conoscere ogni scelta interna. Questo non elimina la necessità di capire l'implementazione quando il rischio lo richiede, ma ci permette di lavorare per livelli. È esattamente ciò di cui abbiamo bisogno quando la quantità di codice cresce più velocemente della capacità umana di leggerlo riga per riga.

### Il diff come unità di ragionamento

Un agente può conoscere l'intero repository; un reviewer umano, spesso, no. Per questo il diff resta uno strumento fondamentale, ma dobbiamo imparare a leggerlo con domande diverse.

Non basta chiedersi se il codice sia pulito, i nomi siano buoni e i test passino. Una review deve anche cercare ciò che il diff rende vero nel sistema: quali nuove assunzioni introduce, se cambia un boundary o aumenta il coupling, se modifica il modello di errore, introduce I/O dove prima non c'era, cambia una transazione o amplia i permessi. Deve far emergere contratti impliciti modificati e failure mode il cui blast radius è appena cresciuto.

Una review architetturale non guarda soltanto ciò che è stato scritto. Guarda **che cosa è diventato vero nel sistema dopo quel diff**.

### Independent review

Quando il rischio cresce, è utile separare chi produce da chi critica. Questo vale per gli esseri umani e per gli agenti. Possiamo chiedere a un reviewer indipendente di non spiegare la soluzione, ma di cercare attivamente ciò che manca: comportamenti non coperti, assunzioni non dichiarate, failure mode, edge case, problemi di sicurezza, regressioni di performance, modifiche fuori scope o dipendenze introdotte accidentalmente.

Un prompt utile non è “Controlla se va tutto bene”, ma qualcosa di più vicino a:

> “Assumi che questo cambiamento contenga almeno un errore importante. Cerca il candidato più plausibile e dimostra perché potrebbe produrre un problema reale.”

La review adversarial non garantisce di trovare un difetto, ma riduce il rischio che produzione e validazione condividano esattamente lo stesso bias.

### Verification bundle

Per i cambiamenti non banali possiamo chiedere all'agente di consegnare non soltanto il codice, ma anche un piccolo **bundle di verifica**. Qui la struttura ad albero è utile perché descrive un artefatto riutilizzabile:

```text
change
├── diff
├── tests
├── assumptions.md
├── risk-notes.md
├── commands-run.md
└── rollback.md
```

Non deve diventare documentazione cerimoniale. Il punto è che il risultato di un task non è soltanto l'artefatto prodotto, ma anche l'evidenza che ci permette di giudicarlo. Nel resto del libro chiameremo questa idea, quando utile, **Agent Verification Bundle**.

### Test verdi non significa sistema corretto

Un sistema può avere tutti i test verdi ed essere comunque sbagliato. Può succedere perché i test verificano il comportamento sbagliato, perché un requisito importante non è mai stato tradotto in un test o perché i test sono così legati all'implementazione da proteggere la forma del codice più del comportamento. E alcuni problemi emergono soltanto quando il software incontra il mondo reale: latenza, concorrenza, dipendenze esterne, dati sporchi o condizioni operative che il test suite non rappresenta.

Con l'AI il rischio aumenta perché generare test è economico. Possiamo ottenere in pochi minuti centinaia di test che aumentano la coverage e quasi per nulla la confidenza. La domanda quindi non è “Quanti test abbiamo?”, ma:

> **“Quale rischio importante diventa meno probabile grazie a questi test?”**

### Verifica multilivello

Per un cambiamento serio, la verifica può essere pensata come una scala. Qui l'ordine è parte del modello, quindi la rappresentazione strutturata resta utile:

```text
Livello 1 — sintassi e tipi
Livello 2 — comportamento locale
Livello 3 — integrazione
Livello 4 — contratti
Livello 5 — proprietà architetturali
Livello 6 — sicurezza e performance
Livello 7 — comportamento in ambiente reale
```

Non ogni task deve attraversare ogni livello. Un rename interno non richiede un canary deployment, mentre una modifica al sistema di autorizzazione non dovrebbe fermarsi al lint. La qualità del processo sta anche nel sapere quanto controllo serve per il rischio che stiamo introducendo.

### La verifica deve scalare con l'autonomia

Più autonomia concediamo a un agente, più il sistema di verifica deve diventare forte. Se un agente suggerisce una funzione che noi copiamo manualmente, il rischio è limitato dalla nostra interazione diretta. Se invece può modificare decine di file, eseguire migration, aprire pull request, distribuire in un ambiente e modificare configurazioni, non possiamo mantenere lo stesso modello di controllo usato per un semplice suggerimento.

L'autonomia non elimina la verifica. La sposta da un gesto manuale continuo a un **sistema di guardrail, evidenze e checkpoint**.

### Non rifare. Rendere verificabile.

Questa è la trasformazione importante. Quando un'attività è difficile da supervisionare, la prima risposta non dovrebbe essere necessariamente “Allora devo farla io”, ma:

> **“Come posso rendere osservabili le proprietà che mi interessano?”**

Test, contratti, invarianti, metriche, diff, scan, reviewer indipendenti e deployment progressivi sono modi diversi di rispondere alla stessa domanda. La capacità di delegare cresce con la capacità di costruire verificabilità, e questa, molto più della velocità di generazione, sarà una delle competenze decisive dell'ingegneria AI-native.
