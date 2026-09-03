## AI e technology selection

L'AI è molto brava a proporre tecnologie.

A volte fin troppo.

Davanti a una richiesta generica come:

> “Progetta un sistema altamente scalabile e resiliente.”

un modello può produrre in pochi secondi:

- Kubernetes;
- microservizi;
- Redis;
- Kafka;
- CDN;
- database distribuito;
- service mesh;
- multi-region;
- autoscaling;
- observability stack completo.

La risposta può essere tecnicamente plausibile.

Il problema è che potrebbe non avere alcun rapporto con il contesto reale.

### L'AI completa il vuoto

Quando mancano requisiti, il modello deve comunque produrre qualcosa.

Quindi riempie il vuoto con:

- pattern comuni;
- convenzioni frequenti;
- architetture viste nel training;
- assunzioni plausibili;
- scelte statisticamente compatibili con il prompt.

Questo è utile per generare idee.

È pericoloso quando interpretiamo quelle idee come decisioni.

Più il prompt contiene parole come:

```text
enterprise
scalable
modern
cloud-native
highly available
AI-native
```

senza definizioni concrete, più lasciamo all'agente il compito di inventare ciò che significano.

E ogni significato inventato può generare una tecnologia diversa.

### Prima dare all'AI il problema di qualità

Un uso migliore consiste nel fornire:

- critical journey;
- target;
- vincoli;
- team;
- budget;
- crescita;
- failure tolerance;
- priorità.

Poi chiedere:

> “Proponi almeno tre soluzioni significativamente diverse che soddisfino questi requisiti. Per ciascuna descrivi trade-off, failure mode, costo operativo, competenze richieste e trigger che la renderebbero inadatta.”

Adesso l'AI non sta scegliendo per noi.

Sta ampliando lo spazio delle alternative.

### Chiedere l'alternativa più semplice

Un prompt molto utile è:

> **“Qual è la soluzione più semplice che potrebbe soddisfare tutti i requisiti dichiarati?”**

Questa domanda combatte un bias naturale dei sistemi generativi: la capacità di produrre molta architettura a costo quasi zero.

Generare un diagramma con quindici componenti è facile.

Operarne quindici per cinque anni non lo è.

Possiamo poi chiedere:

> “Quale requisito richiederebbe di passare alla soluzione più complessa?”

Otteniamo così una scala evolutiva invece di un'architettura finale immaginaria.

### Chiedere di attaccare la tecnologia preferita

Se il team vuole usare una tecnologia specifica, possiamo usare l'AI in modo avversariale.

Per esempio:

> “Assumi che introdurre Kafka sia una cattiva idea. Costruisci il caso tecnico più forte contro questa scelta usando i requisiti dichiarati.”

Poi invertiamo:

> “Ora costruisci il caso più forte a favore.”

Questo non produce la decisione.

Riduce il rischio che il nostro entusiasmo iniziale domini l'analisi.

### Technology fashion detector

Possiamo chiedere a un agente di individuare segnali di fashion-driven architecture in una proposta.

Domande:

- quali componenti non sono legati a un requisito esplicito?
- quali sembrano introdotti soltanto come best practice generica?
- quali potrebbero essere sostituiti da una soluzione più semplice?
- quali richiedono competenze che il team non possiede?
- quali ottimizzano una scala non dichiarata?
- quali creano lock-in senza valore esplicito?
- quali spostano complexity cost senza beneficio verificabile?

Questa review è particolarmente utile sui design generati automaticamente.

### L'AI conosce prodotti. Non conosce automaticamente il nostro costo totale.

Un modello può conoscere feature, pattern e API di molti prodotti.

Ma il fit reale dipende anche da informazioni che spesso non sono nel prompt:

- contratti commerciali;
- competenze interne;
- accordi enterprise;
- procedure di procurement;
- vincoli compliance;
- tooling esistente;
- on-call;
- incident history;
- costi di migrazione;
- persone disponibili.

Quindi una comparazione tecnologica generata dall'AI può essere molto competente tecnicamente e comunque sbagliare la decisione economica o organizzativa.

### La freschezza è un requisito della ricerca

Le tecnologie cambiano.

Cambiano:

- feature;
- pricing;
- limiti;
- supporto;
- versioni;
- status di deprecazione;
- licenze;
- availability geografica.

Quando questi dettagli influenzano una scelta reale, non dobbiamo affidarci alla memoria del modello.

Dobbiamo verificare documentazione e fonti aggiornate.

Questo libro farà lo stesso quando entrerà nei prodotti specifici.

Il principio generale invece rimane stabile:

> **prima il requisito, poi la ricerca delle opzioni, poi il confronto.**

### L'AI può accelerare il benchmark, non definirne il significato

Possiamo usare agenti per:

- creare benchmark;
- generare load test;
- preparare proof of concept;
- raccogliere metriche;
- confrontare configurazioni;
- analizzare risultati.

Ma dobbiamo aver definito prima ciò che stiamo misurando.

Un benchmark che misura la cosa sbagliata produce precisione senza utilità.

Per esempio, confrontare due database su una query sintetica non ci dice necessariamente quale sia migliore per il nostro workload reale.

La qualità dell'esperimento dipende dal modello del problema.

### Agents make overengineering cheaper

Con gli agenti è diventato più economico implementare infrastrutture sofisticate.

Questo può creare una nuova tentazione:

> “Tanto lo fa l'AI.”

Ma l'AI può abbassare il costo iniziale di creazione senza eliminare:

- runtime cost;
- incident cost;
- cognitive load;
- debugging;
- upgrade;
- security surface;
- operational ownership.

Costruire è soltanto una parte del costo.

Possedere il sistema è il resto.

> **L'AI rende più economico aggiungere tecnologia. Non rende automaticamente più economico convivere con essa.**

### Il ruolo umano nella scelta

L'agente può produrre alternative.

Può cercare documentazione.

Può simulare trade-off.

Può preparare benchmark.

Può criticare una proposta.

Può persino suggerire quale soluzione sembri avere fit migliore.

La decisione finale resta una responsabilità architetturale perché richiede di decidere quali conseguenze siamo disposti ad accettare.

> **Non chiedere all'AI quale tecnologia è migliore. Dalle il contesto e chiedile di aiutarti a capire quale compromesso stai comprando.**
