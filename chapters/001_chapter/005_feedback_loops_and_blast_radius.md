## Feedback loop accelerati e blast radius

Uno dei vantaggi più evidenti dell'AI è la velocità del ciclo:

```text
idea
→ modifica
→ esecuzione
→ feedback
→ nuova modifica
```

Un ciclo più breve è quasi sempre desiderabile.

Riduce il costo dell'apprendimento.

Permette di scoprire prima errori locali.

Rende più economici piccoli esperimenti.

Ma c'è una condizione implicita:

> **il feedback deve osservare ciò che conta davvero.**

Se il ciclo è velocissimo ma misura soltanto una parte del sistema, possiamo accelerare nella direzione sbagliata.

### Feedback locale, danno globale

Immaginiamo un agente incaricato di migliorare le performance di un endpoint.

Misura la latenza locale.

Introduce una cache.

La latenza scende.

Il test passa.

La task sembra conclusa.

Ma la cache potrebbe aver introdotto dati stantii o invalidazione incompleta, crescita incontrollata della memoria, leakage tra tenant, inconsistenza con un flusso di update e nuove dipendenze operative.

Il feedback locale dice:

> “più veloce”.

Il sistema globale potrebbe dire:

> “più fragile”.

La velocità del ciclo non corregge automaticamente la ristrettezza dell'osservazione.

### Il blast radius cambia con gli agenti

Il **blast radius** è il perimetro delle conseguenze che un errore o una modifica può produrre.

Nel lavoro assistito da agenti cambia almeno in tre modi.

Primo: un agente può modificare molti più file in una singola iterazione.

Secondo: può attraversare più layer contemporaneamente.

Terzo: può propagare una stessa assunzione in maniera molto coerente e molto estesa.

Questa coerenza è ambivalente.

Se l'assunzione è corretta, è un vantaggio.

Se è sbagliata, il repository può essere trasformato rapidamente attorno a un errore uniforme.

Un essere umano stanco può dimenticare di aggiornare tre call site.

Un agente può aggiornare tutti e cinquanta.

Se la trasformazione era sbagliata, abbiamo ottenuto una regressione perfettamente consistente.

### Repository-wide changes

Le modifiche su larga scala sono uno dei casi in cui l'AI può essere straordinariamente utile.

Rinominare API.

Aggiornare pattern di logging.

Migrare una libreria.

Modificare una convenzione.

Introdurre tipi più forti.

Aggiornare centinaia di test.

Sono attività che prima potevano richiedere molto lavoro meccanico.

Ma la capacità di modificare migliaia di righe non rende sicuro farlo in una volta sola.

> **La capacità di cambiare tutto non elimina il valore di poter tornare indietro.**

Per modifiche ad alto blast radius diventano quindi più importanti:

- characterization tests;
- piccoli checkpoint;
- diff leggibili;
- codemod verificabili;
- feature flag;
- rollout progressivo;
- canary;
- metriche di confronto;
- rollback chiaro;
- boundary test;
- revisione indipendente.

### Il paradosso del diff

Un diff piccolo può essere semanticamente enorme.

Un diff grande può essere semanticamente banale.

Cambiare una costante di autorizzazione può essere una riga e aprire dati a utenti non autorizzati.

Rinominare meccanicamente un simbolo in cinquecento file può essere un cambiamento a basso rischio se la trasformazione è completamente verificabile.

Per questo non dovremmo usare il numero di righe come proxy ingenuo del rischio.

Per stimarlo dovremmo guardare quanti boundary vengono attraversati e quale persistenza è coinvolta, se cambiano compatibilità pubblica o security boundary e quanto la modifica sia reversibile. Dati storici, dipendenze esterne, capacità di rollback e osservabilità dopo il deploy completano il quadro. Il blast radius è semantico prima che quantitativo.

### Agenti paralleli, feedback intrecciati

Con più agenti compare un problema ulteriore.

Supponiamo che tre agenti lavorino in parallelo:

```text
A → modifica autenticazione
B → modifica caching
C → modifica API orders
```

Ognuno esegue test sul proprio branch.

Tutto è verde.

Dopo il merge, una interazione emergente rompe il sistema.

Non necessariamente perché un agente abbia sbagliato localmente.

La failure può nascere dalla composizione.

Questo ci ricorda un principio classico dell'engineering:

> **la correttezza delle parti non implica la correttezza del sistema composto.**

Più parallelizziamo, più abbiamo bisogno di feedback a livello di integrazione.

### Feedback gerarchico

Un workflow robusto può usare feedback a più livelli:

```text
modifica locale
→ unit / static checks
→ contract checks
→ integration checks
→ system behavior
→ production signals
```

Ogni livello risponde a una domanda diversa.

I test locali dicono se il componente rispetta certe proprietà.

I contract test osservano i confini.

Gli integration test osservano la composizione.

Le metriche in produzione osservano il comportamento nel mondo reale.

Nessun livello è sufficiente da solo.

### Feedback loop sbagliati diventano molto efficienti

Un sistema di sviluppo può ottimizzare rapidamente ciò che misura.

Se premiamo soltanto issue chiuse, numero di pull request, tempo medio di implementazione e test generati, potremmo ottenere esattamente più di queste cose senza migliorare il sistema che volevamo misurare.

Non necessariamente più valore.

Gli agenti rendono questo problema più evidente perché possono saturare facilmente metriche di throughput superficiali.

Serve quindi chiedere:

> qual è il feedback che impedisce al sistema di sviluppo di ottimizzare la quantità a scapito della qualità?

Può essere:

- defect escape rate;
- rollback rate;
- lead time fino a una modifica realmente assorbita;
- incidenti;
- tempo di review;
- regressioni di performance;
- violazioni architetturali;
- drift dei costi;
- feedback utente.

Non esiste una metrica universale.

Esiste però una regola generale:

> **un loop veloce è utile soltanto se chiude il circuito su segnali che rappresentano il risultato che ci interessa.**

### Accelerare il ritorno della realtà

Il miglior feedback non è quello che ci conferma che il codice compila.

È quello che avvicina il prima possibile il sistema alla realtà che dovrà sostenere.

Per questo, a seconda del rischio, conviene introdurre presto porzioni di realtà: dati e failure realistici, carico rappresentativo, contratti e utenti reali, vincoli operativi che il prototipo non può inventare a piacere.

L'AI può velocizzare enormemente la costruzione del ciclo.

L'architect deve decidere dove quel ciclo deve guardare.
