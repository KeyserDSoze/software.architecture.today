## Le qualità competono tra loro

Uno degli errori più pericolosi consiste nel parlare di quality attribute come se potessero essere massimizzate tutte insieme: più availability, più consistency, più performance, più security, più flexibility e meno costo, con meno complessità.

La realtà è che molte proprietà competono. L'architettura serve anche a decidere **quale compromesso sia accettabile e quale qualità abbia diritto di vincere quando due obiettivi entrano in conflitto**.

## Performance e consistency

Una cache può ridurre latency e carico, ma introduce freshness e invalidation. Una replica geografica può avvicinare i dati agli utenti e complicare le scritture. Un read model asincrono può rendere le letture molto efficienti introducendo eventual consistency.

La domanda non è quale pattern sia migliore in assoluto. È quanto valore otteniamo dalla performance aggiuntiva e quanto costa la semantica più debole o più complessa che dobbiamo introdurre per ottenerla.

## Availability e correctness

In alcuni sistemi è preferibile rifiutare temporaneamente una richiesta anziché accettarla in uno stato incerto. Una transazione economica non idempotente è un esempio evidente: “restare disponibili” a ogni costo può produrre un danno maggiore del downtime.

In altri journey, mostrare uno stato noto con freshness esplicita è perfettamente accettabile e molto meglio di nessuna risposta.

Availability non domina sempre. La priorità dipende dal costo semantico dell'errore.

## Security e usability

Controlli più severi introducono spesso frizione. Sessioni più brevi, MFA, autorizzazioni granulari e verifiche aggiuntive possono ridurre alcuni rischi e peggiorare l'esperienza.

Questo non significa scegliere tra “sicuro” e “usabile”. Significa progettare il punto di equilibrio in base agli asset, alle minacce e al rischio residuo che siamo disposti ad accettare.

## Portability e platform fit

Astrarre ogni servizio cloud può ridurre una parte del lock-in e, nello stesso tempo, impedirci di usare bene la piattaforma o costringerci a possedere molto più codice. Legarsi a capability specifiche può aumentare produttività e operability, rendendo più costosa una futura migrazione.

Il lock-in zero è quasi sempre un'illusione. La domanda utile è:

> **Quale lock-in stiamo comprando, quale valore riceviamo in cambio e quanto costerebbe uscirne?**

## Flexibility e simplicity

Una soluzione altamente configurabile preserva molti scenari futuri, ma aumenta cognitive load, test e superficie operativa oggi. Una soluzione specifica può essere più semplice e meno riusabile.

Ancora una volta, il futuro possibile non basta a giustificare il costo presente. La flessibilità deve pagare un'incertezza reale, non un'immaginazione illimitata.

## Availability e cost

Gli incrementi di disponibilità non hanno costo lineare. Avvicinarsi a target molto severi può richiedere ridondanza aggiuntiva, failover più rapido, multi-region, capacità idle, automazione e un on-call molto più maturo.

Per questo una percentuale non dovrebbe essere scelta perché “suona enterprise”. Deve essere collegata al costo dell'indisponibilità del journey che stiamo proteggendo.

## Operability e technology diversity

Ottimizzare localmente ogni problema con lo strumento specializzato migliore può produrre un sistema globale ingestibile:

```text
7 database
4 runtime
3 broker
5 sistemi di deployment
8 SDK di observability
```

Ogni scelta può essere difendibile isolatamente. La varietà cumulativa ha però un costo di formazione, diagnosi, upgrade, sicurezza e incident response.

Esiste quindi un valore nella **standardizzazione sufficiente**. Non perché un unico strumento sia il migliore per tutto, ma perché la diversità tecnologica deve anch'essa pagare l'affitto.

## Il costo marginale della qualità

Una domanda molto utile è:

> **Quanto costa ottenere il prossimo incremento di qualità, e chi ne riceve il valore?**

Passare da p95 di 500 ms a 300 ms potrebbe richiedere una query migliore. Da 300 ms a 100 ms potrebbe richiedere caching. Da 100 ms a 20 ms potrebbe imporre un redesign. Ogni passo compra un beneficio diverso a un costo diverso.

Non ottimizziamo perché possiamo. Ottimizziamo quando la proprietà aggiuntiva cambia materialmente l'outcome o il rischio.

## Quality budget

Per alcune qualità possiamo distribuire un budget lungo il journey. Un latency budget, per esempio:

```text
browser: 80 ms
API gateway: 30 ms
application: 70 ms
database: 90 ms
network margin: 30 ms
----------------------
totale p95: 300 ms
```

Lo stesso principio può valere per error budget o cost budget. La qualità smette di essere un desiderio globale e diventa una responsabilità distribuita tra parti del sistema.

## Priorità prima della controversia tecnologica

Se sappiamo che, per una capability:

```text
correctness > availability > latency > cost
```

possiamo ragionare in modo coerente quando una dipendenza degrada. Se non abbiamo dichiarato nessuna priorità, ogni gruppo tenderà a ottimizzare la proprietà che vede meglio: Platform l'operability, backend il throughput, Security il controllo, Product la UX e Finance il costo.

Tutti possono avere ragione localmente e produrre insieme una decisione incoerente.

> **Un trade-off non è un difetto della soluzione. È il prezzo esplicito della proprietà che abbiamo scelto di privilegiare.**
