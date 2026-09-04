## Availability, recovery e graceful degradation

Dire che un sistema deve essere “sempre disponibile” è quasi sempre inutile.

Prima di tutto perché nessun sistema reale è disponibile in modo assoluto.

Poi perché la disponibilità ha un costo.

Replica, ridondanza, failover, multi-region, capacity reserve, backup, test di recovery, runbook e on-call non compaiono gratuitamente.

Se non sappiamo quanto costa l'indisponibilità, non sappiamo nemmeno quanto abbia senso pagare per evitarla.

### Non tutte le funzioni hanno lo stesso valore

Un prodotto può contenere journey con criticità molto diverse.

Per Order Operations, per esempio, la consultazione di un ordine da parte dell'operatore, la creazione dell'ordine e il pagamento convivono con attività come aggiornamento dell'indirizzo, export mensile e report statistici. Non è detto che tutti richiedano lo stesso livello di disponibilità.

Un report può attendere.

Un pagamento forse no.

Progettare tutto secondo il requisito più severo produce spesso costi inutili.

Una qualità importante dell'architettura è quindi la capacità di **localizzare il requisito di qualità**.

### Availability target

Quando ha senso definire un obiettivo esplicito, dobbiamo chiarire quale servizio o journey stiamo misurando e in quale finestra, che cosa conti come indisponibilità e come trattiamo eventuali finestre di manutenzione. Dobbiamo includere le dipendenze esterne e il comportamento degradato che consideriamo ancora accettabile. Senza questa semantica, una percentuale di availability è solo un numero elegante.

### RTO

Il **Recovery Time Objective** descrive quanto tempo possiamo accettare che trascorra prima del ripristino dopo un evento grave.

Non significa necessariamente che il sistema debba tornare perfettamente normale entro quella finestra.

Può significare che il servizio minimo critico deve tornare disponibile.

Per esempio:

```text
RTO del journey di consultazione ordine: 60 minuti
```

Questa informazione orienta il livello di automazione del restore, la strategia di failover e replica, l'eventuale infrastruttura standby, i runbook e la frequenza con cui dobbiamo esercitare il recovery.

### RPO

Il **Recovery Point Objective** riguarda invece quanta perdita di dati possiamo tollerare dopo un disaster.

Per esempio:

```text
RPO = 5 minuti
```

significa che, nel caso peggiore previsto dal piano, possiamo accettare di perdere fino a cinque minuti di dati rispetto all'ultimo punto recuperabile.

Un RPO prossimo a zero può richiedere meccanismi molto diversi da un RPO di ventiquattro ore.

E quindi costi molto diversi.

### RTO e RPO non sono slogan da disaster recovery

Questi valori sono utili soltanto se influenzano decisioni concrete.

Se dichiariamo:

```text
RTO = 15 minuti
RPO = 0
```

ma il restore viene provato una volta ogni tre anni e richiede interventi manuali non documentati, abbiamo scritto desideri.

La proprietà deve essere verificabile.

Questo introduce un principio importante:

> **Un recovery plan che non viene provato è un'ipotesi.**

### Graceful degradation

Availability non è sempre binaria.

A volte il sistema può continuare a offrire valore riducendo temporaneamente alcune capability.

Possiamo mostrare l'ultimo stato noto quando un sistema secondario è indisponibile, disabilitare raccomandazioni non critiche o accettare una richiesta per processarla più tardi. Possiamo usare una cache read-only, impedire modifiche rischiose mantenendo la consultazione o ridurre funzionalità avanzate preservando il critical user journey. Questa strategia si chiama spesso **graceful degradation**.

È una decisione di prodotto tanto quanto tecnica.

Non possiamo inventarla durante l'incidente.

Dobbiamo sapere quali comportamenti degradati siano semanticamente accettabili.

### La cache non rende automaticamente disponibile

Un pattern ricorrente consiste nell'aggiungere una cache per migliorare performance e availability.

Può funzionare.

Ma dobbiamo chiederci quanto possa essere vecchio il dato e che cosa accada dopo una scrittura, come avvenga l'invalidazione e se la cache possa mescolare dati fra tenant. Dobbiamo anche sapere che cosa succeda quando torna online e se il sistema regga un cache miss massivo.

La cache risolve alcuni problemi introducendone altri.

È il normale funzionamento dei trade-off.

### Ridondanza e failure correlati

Due istanze non sono necessariamente due failure domain indipendenti.

Potrebbero condividere database o regione, identity provider e configurazione, certificate authority, deployment pipeline o DNS. Potrebbero perfino condividere lo stesso bug applicativo. Aggiungere copie dello stesso componente può aumentare availability rispetto ad alcuni failure mode e non cambiare nulla rispetto ad altri.

Per questo la domanda corretta non è:

> “Abbiamo ridondanza?”

ma:

> **“Da quali failure mode la ridondanza ci protegge davvero?”**

### La recovery è parte del design

Backup, restore, rollback e failover vengono spesso trattati come attività operative successive all'architettura.

In realtà cambiano il design.

Un sistema che non può essere ripristinato nei tempi richiesti non soddisfa il proprio requisito, anche se funziona perfettamente durante il normale esercizio.

> **La qualità di un sistema non si misura soltanto quando tutto funziona. Si misura anche da come fallisce e da come torna operativo.**
