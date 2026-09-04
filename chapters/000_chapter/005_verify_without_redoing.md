## Verificare senza rifare

Se l'AI produce lavoro più velocemente di quanto noi possiamo rifarlo a mano, la supervisione non può consistere nel ripetere ogni attività dall'inizio.

Sarebbe un modo costoso di fingere di aver delegato.

Il problema diventa quindi:

> **come possiamo verificare un risultato senza rieseguire integralmente il lavoro che lo ha prodotto?**

Questa domanda è centrale per tutto il libro.

Non riguarda soltanto gli agenti.

È uno dei fondamenti dell'ingegneria.

Non verifichiamo un ponte ricostruendone un secondo accanto.

Non verifichiamo un database riscrivendo il database.

Costruiamo proprietà osservabili, contratti, misure e prove che ci permettano di aumentare la confidenza.

### Verifica non significa certezza

Prima distinzione importante: verificare non significa dimostrare che qualcosa non potrà mai fallire.

Nella maggior parte dei sistemi reali non abbiamo questa possibilità.

Verificare significa raccogliere evidenza proporzionata al rischio.

Per una modifica possiamo combinare controlli molto diversi: type checking e lint, unit e integration test, contract e property-based test, mutation test, static analysis, security e performance scan. Possiamo poi aggiungere diff e architecture review, canary deployment e, quando il cambiamento arriva in produzione, metriche e tracing.

Nessuno di questi strumenti è infallibile.

La loro combinazione può però rendere una conclusione sufficientemente affidabile per procedere.

### Verificare il comportamento, non la prosa

Un agente può spiegare molto bene ciò che ha fatto.

Questa capacità è utile.

Ma una spiegazione non è una prova.

Se chiediamo:

> “Hai mantenuto la backward compatibility?”

potremmo ricevere una risposta dettagliata e plausibile.

È meglio poter osservare contract test sulle versioni precedenti, uno schema diff e fixture realistiche, confrontare la risposta dell'API prima e dopo la modifica e verificare il comportamento con client che rappresentino davvero la compatibilità promessa.

Il principio è semplice:

> **Quando una proprietà importante può essere verificata dal sistema, preferisci evidenza eseguibile a rassicurazione testuale.**

L'AI può produrre entrambe.

Noi dobbiamo sapere quale delle due pesa di più.

### Invarianti

Una delle forme più potenti di verifica è definire ciò che deve rimanere vero indipendentemente dall'implementazione.

Un'invariante può essere:

```text
un ordine rimborsato non può essere rimborsato una seconda volta
```

oppure:

```text
un utente non può leggere dati appartenenti a un tenant diverso
```

oppure:

```text
la somma degli importi allocati non può superare il totale disponibile
```

Quando rendiamo queste proprietà esplicite, possiamo costruire test e controlli che sopravvivono a molti refactoring.

Questo è particolarmente utile con gli agenti.

L'implementazione può cambiare molto rapidamente.

Le invarianti ci permettono di mantenere stabile ciò che conta.

### Contracts

Un contratto riduce la superficie che dobbiamo comprendere in dettaglio.

Se un componente promette:

```text
input valido → output conforme allo schema
input duplicato → nessun effetto aggiuntivo
fallimento esterno → errore classificato e osservabile
```

possiamo verificare quel contratto senza conoscere ogni scelta interna.

Questo non elimina la necessità di capire l'implementazione quando il rischio lo richiede.

Ma ci permette di lavorare per livelli.

È esattamente ciò di cui abbiamo bisogno quando la quantità di codice cresce più velocemente della capacità umana di leggerlo riga per riga.

### Il diff come unità di ragionamento

Un agente può conoscere l'intero repository.

Un reviewer umano, spesso, no.

Per questo il diff resta uno strumento fondamentale.

Ma dobbiamo imparare a leggerlo con domande diverse.

Non basta chiedersi se il codice sia pulito, i nomi siano buoni e i test passino. Una review deve anche cercare ciò che il diff rende vero nel sistema: quali nuove assunzioni introduce, se cambia un boundary o aumenta il coupling, se modifica il modello di errore, introduce I/O dove prima non c'era, cambia una transazione o amplia i permessi. Deve inoltre far emergere contratti impliciti modificati e failure mode il cui blast radius è appena cresciuto.

Una review architetturale non guarda soltanto cosa è stato scritto.

Guarda **che cosa è diventato vero nel sistema dopo quel diff**.

### Independent review

Quando il rischio cresce, è utile separare chi produce da chi critica.

Questo vale per gli esseri umani e per gli agenti.

Possiamo chiedere a un reviewer indipendente di non spiegare la soluzione, ma di cercare attivamente ciò che manca: comportamenti non coperti e assunzioni non dichiarate, failure mode ed edge case, problemi di sicurezza o regressioni di performance, modifiche fuori scope e dipendenze introdotte accidentalmente.

Un prompt utile non è:

> “Controlla se va tutto bene.”

È più simile a:

> “Assumi che questo cambiamento contenga almeno un errore importante. Cerca il candidato più plausibile e dimostra perché potrebbe produrre un problema reale.”

La review adversarial non garantisce di trovare un difetto.

Riduce però il rischio che produzione e validazione condividano esattamente lo stesso bias.

### Verification bundle

Per i cambiamenti non banali, possiamo chiedere all'agente di consegnare non soltanto il codice ma un piccolo **bundle di verifica**.

Per esempio:

```text
change
├── diff
├── tests
├── assumptions.md
├── risk-notes.md
├── commands-run.md
└── rollback.md
```

Non deve diventare documentazione cerimoniale.

Il punto è che il risultato di un task non è soltanto l'artefatto prodotto.

È anche l'evidenza che ci permette di giudicarlo.

Nel resto del libro chiameremo questa idea, quando utile, **Agent Verification Bundle**.

### Test verdi non significa sistema corretto

Questo principio merita di essere anticipato subito.

Un sistema può avere tutti i test verdi ed essere sbagliato.

Per almeno quattro motivi:

1. i test possono verificare il comportamento sbagliato;
2. i requisiti importanti possono non essere rappresentati nei test;
3. i test possono essere troppo legati all'implementazione;
4. il problema può emergere soltanto dall'interazione con il mondo reale.

Con l'AI il rischio aumenta perché generare test è economico.

Possiamo ottenere in pochi minuti centinaia di test che aumentano la coverage e quasi per nulla la confidenza.

La domanda non è:

> “Quanti test abbiamo?”

È:

> **“Quale rischio importante diventa meno probabile grazie a questi test?”**

### Verifica multilivello

Per un cambiamento serio, la verifica può essere pensata come una scala.

```text
Livello 1 — sintassi e tipi
Livello 2 — comportamento locale
Livello 3 — integrazione
Livello 4 — contratti
Livello 5 — proprietà architetturali
Livello 6 — sicurezza e performance
Livello 7 — comportamento in ambiente reale
```

Non ogni task deve attraversare ogni livello.

La qualità del processo sta anche nel sapere quanto controllo serve.

Un rename interno non richiede un canary deployment.

Una modifica al sistema di autorizzazione non dovrebbe fermarsi al lint.

### La verifica deve scalare con l'autonomia

Più autonomia concediamo a un agente, più il sistema di verifica deve diventare forte.

Se un agente suggerisce una funzione che noi copiamo manualmente, il rischio è limitato dalla nostra interazione diretta.

Se un agente può modificare decine di file, eseguire migration, aprire pull request, distribuire in un ambiente e modificare configurazioni, non possiamo mantenere lo stesso modello di controllo usato per un semplice suggerimento.

L'autonomia non elimina la verifica.

La sposta da un gesto manuale continuo a un **sistema di guardrail, evidenze e checkpoint**.

### Non rifare. Rendere verificabile.

Questa è la trasformazione importante.

Quando un'attività è difficile da supervisionare, la prima risposta non dovrebbe essere necessariamente:

> “Allora devo farla io.”

Dovrebbe essere:

> **“Come posso rendere osservabili le proprietà che mi interessano?”**

Test, contratti, invarianti, metriche, diff, scan, reviewer indipendenti e deployment progressivi sono modi diversi di rispondere alla stessa domanda.

La capacità di delegare cresce con la capacità di costruire verificabilità.

E questa, molto più della velocità di generazione, sarà una delle competenze decisive dell'ingegneria AI-native.