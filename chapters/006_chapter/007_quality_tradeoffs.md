## Le qualità competono tra loro

Uno degli errori più pericolosi nella progettazione consiste nel trattare le quality attribute come se potessero essere massimizzate tutte contemporaneamente.

Più availability.

Più consistency.

Più performance.

Più security.

Più flexibility.

Più portability.

Meno costo.

Meno complessità.

Sarebbe bello.

La realtà è che molte proprietà competono.

L'architettura è anche il lavoro di decidere **quale compromesso sia accettabile**.

### Performance vs consistency

Una cache può migliorare latency e ridurre carico.

Ma introduce il problema della freshness.

Una replica geografica può avvicinare i dati agli utenti.

Ma rende più complesso il coordinamento delle scritture.

Un read model asincrono può rendere le letture estremamente efficienti.

Ma introduce eventual consistency.

Non esiste una risposta universale.

La domanda è:

> “Quanto valore otteniamo dalla performance aggiuntiva e quanto ci costa la consistency più debole?”

### Availability vs correctness

In alcuni sistemi è meglio rifiutare temporaneamente una richiesta piuttosto che accettarla in uno stato incerto.

Pensiamo a una transazione finanziaria non idempotente.

Se una dipendenza fondamentale non risponde, “restare disponibili” a ogni costo può generare errori peggiori del downtime.

In altri contesti invece una risposta stale è perfettamente accettabile e molto migliore di nessuna risposta.

Availability non è sempre la priorità dominante.

### Security vs usability

Controlli più severi possono aumentare frizione.

Sessioni brevi, MFA frequente, autorizzazioni granulari e verifiche aggiuntive migliorano alcuni aspetti della sicurezza ma possono peggiorare l'esperienza.

Questo non significa che dobbiamo scegliere tra “sicuro” e “usabile”.

Significa che dobbiamo progettare consapevolmente il punto di equilibrio rispetto al rischio.

### Portability vs platform fit

Astrarre ogni servizio cloud dietro un layer personalizzato può ridurre parte del lock-in.

Può anche impedirci di sfruttare capacità specifiche della piattaforma e aumentare enormemente il codice che possediamo.

All'opposto, legarsi profondamente a un provider può aumentare produttività e qualità operativa ma rendere più costosa una migrazione futura.

La domanda non è:

> “Come eliminiamo ogni lock-in?”

Il lock-in assolutamente nullo è spesso un'illusione.

La domanda è:

> **“Quale lock-in stiamo accettando, quale valore riceviamo in cambio e quanto sarebbe costoso uscirne?”**

### Flexibility vs simplicity

Una soluzione estremamente configurabile può adattarsi a molti scenari futuri.

Ma può essere più difficile da capire, testare e operare oggi.

Una soluzione specifica può essere molto più semplice ma meno riutilizzabile.

Ancora una volta, il futuro possibile non basta a giustificare la complessità presente.

### Availability vs cost

Passare da una buona disponibilità a una disponibilità eccezionale può richiedere un incremento di costo sproporzionato.

La relazione non è lineare.

Ogni nuovo livello può richiedere maggiore ridondanza e failover più rapido, automazione più sofisticata e test più frequenti. Può spingerci verso multi-region, più capacità idle e un on-call più maturo. Per questo una percentuale di availability non dovrebbe mai essere scelta perché “suona enterprise”.

Deve essere collegata al costo dell'indisponibilità.

### Operability vs technology diversity

Usare il miglior strumento specializzato per ogni singolo problema può sembrare ottimale localmente.

Il risultato globale potrebbe essere:

```text
7 database
4 runtime
3 broker
5 sistemi di deployment
8 SDK di observability
```

Ogni scelta locale è giustificabile.

Il sistema complessivo potrebbe essere ingestibile.

Esiste quindi un valore architetturale nella **standardizzazione sufficiente**.

Non perché un unico strumento sia il migliore per tutto.

Ma perché la varietà ha un costo cumulativo.

### Il costo marginale della qualità

Una domanda utile è:

> “Quanto costa ottenere il prossimo incremento di qualità?”

Passare da p95 di 500 ms a 300 ms potrebbe richiedere una query migliore.

Passare da 300 ms a 100 ms potrebbe richiedere caching.

Passare da 100 ms a 20 ms potrebbe richiedere redesign profondo.

Ogni passo produce un beneficio diverso e un costo diverso.

Non ottimizziamo perché possiamo.

Ottimizziamo quando il beneficio supera il costo.

### Quality budget

Possiamo pensare alle quality attribute come a budget da distribuire.

Un critical journey può avere un latency budget:

```text
browser: 80 ms
API gateway: 30 ms
application: 70 ms
database: 90 ms
network margin: 30 ms
----------------------
totale p95: 300 ms
```

Oppure un error budget.

Oppure un cost budget.

Questi modelli aiutano a trasformare la qualità da desiderio globale a responsabilità distribuibile.

### Priorità prima del conflitto

Le priorità dovrebbero essere decise prima che emergano le controversie tecnologiche.

Se sappiamo che per una funzione:

```text
correctness > availability > latency > cost
```

possiamo valutare una failure in modo coerente.

Se non lo sappiamo, ogni team ottimizzerà la proprietà che conosce meglio.

Il team platform potrebbe ottimizzare operability.

Il backend throughput.

Il security team controllo.

Il prodotto UX.

Tutti potrebbero avere ragione localmente.

L'architettura serve anche a costruire una priorità globale.

> **Un trade-off non è un difetto della soluzione. È il prezzo esplicito della proprietà che abbiamo scelto di privilegiare.**
