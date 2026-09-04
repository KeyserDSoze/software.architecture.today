## Feedback loop accelerati e blast radius

Uno dei vantaggi più evidenti dell’AI è la velocità del ciclo:

```text
idea
→ modifica
→ esecuzione
→ feedback
→ nuova modifica
```

Un ciclo più breve è quasi sempre desiderabile perché riduce il costo dell’apprendimento, permette di scoprire prima errori locali e rende più economici piccoli esperimenti. C’è però una condizione implicita: **il feedback deve osservare ciò che conta davvero**.

Se il ciclo è velocissimo ma misura soltanto una parte del sistema, possiamo accelerare nella direzione sbagliata.

### Feedback locale, danno globale

Immaginiamo un agente incaricato di migliorare le performance di un endpoint. Misura la latenza locale, introduce una cache, osserva che il tempo di risposta scende e vede i test passare. Dal punto di vista del task, il lavoro sembra concluso.

Eppure la cache potrebbe aver introdotto dati stantii o invalidazione incompleta, crescita incontrollata della memoria, leakage tra tenant, inconsistenza con un flusso di update o nuove dipendenze operative. Il feedback locale dice “più veloce”; il sistema globale potrebbe dire “più fragile”.

La velocità del ciclo non corregge automaticamente la ristrettezza dell’osservazione.

### Il blast radius cambia con gli agenti

Il **blast radius** è il perimetro delle conseguenze che un errore o una modifica può produrre. Nel lavoro assistito da agenti può crescere perché una singola iterazione attraversa molti file e più layer contemporaneamente, propagando la stessa assunzione in modo estremamente coerente.

Questa coerenza è ambivalente. Se l’assunzione è corretta, è un vantaggio. Se è sbagliata, il repository può essere trasformato rapidamente attorno a un errore uniforme. Un essere umano stanco può dimenticare tre call site; un agente può aggiornare tutti e cinquanta. Se la trasformazione era sbagliata, abbiamo ottenuto una regressione perfettamente consistente.

### Repository-wide changes

Le modifiche su larga scala sono uno dei casi in cui l’AI può essere straordinariamente utile. Rinominare API, aggiornare pattern di logging, migrare una libreria, introdurre tipi più forti o trasformare centinaia di test erano attività che potevano richiedere molto lavoro meccanico.

Ma la capacità di modificare migliaia di righe non rende automaticamente sicuro farlo in una volta sola.

> **La capacità di cambiare tutto non elimina il valore di poter tornare indietro.**

Per interventi ad alto blast radius diventano quindi più importanti characterization test, checkpoint piccoli, diff leggibili e codemod verificabili. Feature flag, rollout progressivo, canary e metriche di confronto aiutano a contenere il rischio nel tempo; rollback chiaro, boundary test e review indipendente servono a mantenere governabile il cambiamento prima e durante la distribuzione.

### Il paradosso del diff

Un diff piccolo può essere semanticamente enorme, mentre un diff grande può essere semanticamente banale. Cambiare una costante di autorizzazione può richiedere una sola riga e aprire dati a utenti non autorizzati; rinominare meccanicamente un simbolo in cinquecento file può essere relativamente sicuro se la trasformazione è completamente verificabile.

Per questo il numero di righe è un proxy ingenuo del rischio. Dobbiamo invece osservare i boundary attraversati, la persistenza coinvolta, la compatibilità pubblica, i security boundary, la reversibilità, le dipendenze esterne e la possibilità di accorgerci del problema dopo il deploy.

Il blast radius è semantico prima che quantitativo.

### Agenti paralleli, feedback intrecciati

Con più agenti compare un problema ulteriore. Supponiamo che uno modifichi l’autenticazione, un altro il caching e un terzo le API degli ordini. Ognuno lavora sul proprio branch e tutti i test locali sono verdi. Dopo il merge, però, una interazione emergente può rompere il sistema.

Non è necessario che un agente abbia sbagliato localmente. La failure può nascere dalla composizione.

> **La correttezza delle parti non implica la correttezza del sistema composto.**

Più parallelizziamo, più aumenta il valore di feedback che osservano l’integrazione e non soltanto le singole modifiche.

### Feedback gerarchico

Un workflow robusto usa feedback a più livelli:

```text
modifica locale
→ unit / static checks
→ contract checks
→ integration checks
→ system behavior
→ production signals
```

Ogni livello risponde a una domanda diversa. I test locali osservano proprietà del componente; i contract test controllano i confini; gli integration test osservano la composizione; i segnali di produzione mostrano come il sistema si comporta nel mondo reale. Nessuno di questi livelli è sufficiente da solo.

### Feedback loop sbagliati diventano molto efficienti

Un sistema di sviluppo tende a ottimizzare rapidamente ciò che misura. Se premiamo soltanto issue chiuse, numero di pull request, tempo medio di implementazione o quantità di test generati, gli agenti possono saturare facilmente queste metriche senza migliorare il risultato che volevamo davvero ottenere.

Serve quindi chiudere il circuito su segnali più vicini al valore e all’affidabilità: defect escape rate, rollback, incidenti, regressioni di performance, tempo di review, violazioni architetturali, drift dei costi o feedback degli utenti possono essere più informativi del puro throughput. Non esiste una metrica universale, ma esiste una regola generale:

> **Un loop veloce è utile soltanto se chiude il circuito su segnali che rappresentano il risultato che ci interessa.**

### Accelerare il ritorno della realtà

Il miglior feedback non è quello che ci conferma che il codice compila. È quello che avvicina il prima possibile il sistema alla realtà che dovrà sostenere. A seconda del rischio, significa introdurre presto dati realistici, failure credibili, carico rappresentativo, contratti reali, utenti reali o vincoli operativi che un prototipo non può inventare a piacere.

L’AI può velocizzare enormemente la costruzione del ciclo. L’architect deve decidere dove quel ciclo deve guardare.
