## Availability, recovery e graceful degradation

Dire che un sistema deve essere “sempre disponibile” è poco utile per due motivi: nessun sistema reale lo è in senso assoluto e ogni incremento di disponibilità ha un costo. Replica, ridondanza, failover, capacità di riserva, test di recovery, runbook e on-call non compaiono gratuitamente.

Prima di decidere quanto pagare per evitare il downtime dobbiamo sapere **quanto costa il downtime del comportamento che stiamo proteggendo**.

## La disponibilità appartiene ai journey

Dentro lo stesso prodotto convivono funzioni con criticità differenti. Per Order Operations, la consultazione dello stato operativo può avere un valore molto diverso da un export mensile. In un prodotto commerce, pagamento e creazione ordine non hanno necessariamente la stessa tolleranza di un report statistico.

Questo significa che il target di availability va localizzato. Progettare ogni capability secondo il requisito più severo può trasformare una necessità locale in costo globale.

Quando definiamo un target dobbiamo quindi dire quale journey stiamo misurando, in quale finestra, che cosa conta come indisponibilità e se una modalità degradata produce ancora valore sufficiente. Dobbiamo anche chiarire quali dipendenze esterne partecipino al target.

Senza questa semantica, una percentuale è soltanto un numero elegante.

## Recovery: quanto tempo e quanti dati possiamo perdere

Il **Recovery Time Objective**, RTO, descrive entro quanto tempo dobbiamo ripristinare il servizio dopo un evento grave. Non implica necessariamente il ritorno immediato a piena capacità: può definire il tempo entro cui il critical journey minimo deve tornare disponibile.

```text
RTO del journey di consultazione ordine: 60 minuti
```

Una scelta così influenza failover, automazione del restore, infrastruttura standby, runbook e frequenza dei test di recovery.

Il **Recovery Point Objective**, RPO, riguarda invece quanta perdita di dati possiamo tollerare rispetto all'ultimo punto recuperabile. Un RPO di cinque minuti e uno di ventiquattro ore producono strategie molto diverse. Un RPO prossimo a zero aumenta ancora di più il costo e restringe le opzioni.

Il punto non è riempire una tabella di sigle. È collegare il valore del business a una strategia di recovery verificabile.

> **Un recovery plan che non viene provato è un'ipotesi.**

Dichiarare RTO di quindici minuti e RPO zero serve a poco se il restore non è mai stato testato, dipende da passaggi manuali non documentati e soltanto una persona sa completarlo. Il requirement diventa credibile quando esiste evidence che il sistema possa davvero recuperare entro i limiti dichiarati.

## Availability non è sempre binaria

Un sistema può continuare a produrre valore anche quando una capability è degradata. Questa è la logica della **graceful degradation**.

Se una fonte secondaria è indisponibile, potremmo mostrare l'ultimo stato noto con un timestamp. Potremmo disabilitare raccomandazioni non critiche, accettare una richiesta e processarla più tardi oppure mantenere una vista read-only mentre blocchiamo azioni che richiedono dati certamente aggiornati.

Queste scelte non possono essere improvvisate durante l'incidente, perché sono decisioni semantiche prima ancora che tecniche. Dobbiamo sapere quale dato può essere stale, quale azione può attendere e quando una risposta incompleta sarebbe più pericolosa del downtime.

## La cache non crea availability per magia

Una cache può migliorare latency e rendere alcune letture disponibili durante il degrado della fonte. In cambio introduce freshness, invalidation, comportamento dopo una scrittura, rischio di dati cross-tenant e cache-miss storm durante la ripartenza.

La domanda non è se la cache “aumenti availability” come proprietà astratta. È **quale failure rende tollerabile, quale nuovo failure introduce e quale semantica del dato siamo disposti ad accettare**.

Il trade-off è lo stesso che governa tutto il capitolo: la tecnologia ha valore soltanto se compra una proprietà richiesta.

## Ridondanza rispetto a quali failure

Due istanze non rappresentano automaticamente due failure domain indipendenti. Possono condividere database, regione, identity provider, configurazione, DNS, certificate authority, deployment pipeline o lo stesso bug applicativo.

Aggiungere copie può proteggere da un crash di processo e non cambiare nulla rispetto a una configurazione corrotta distribuita ovunque.

Per questo la domanda utile non è:

> “Abbiamo ridondanza?”

ma:

> **Da quali failure mode la ridondanza ci protegge davvero, e quali cause rimangono correlate?**

## La recovery è parte dell'architettura

Backup, restore, rollback e failover vengono spesso trattati come responsabilità operative da aggiungere alla fine. In realtà modificano la validità stessa del design.

Un sistema che funziona perfettamente in condizioni normali ma non può essere ripristinato nel tempo richiesto non soddisfa il proprio profilo di qualità.

> **La qualità di un sistema si misura anche da come degrada, da quanto danno contiene e da come torna operativo.**
