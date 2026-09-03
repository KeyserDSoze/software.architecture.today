## Managed services: comprare capacità senza comprare tutto il lavoro

Uno dei vantaggi più forti del cloud è poter delegare una parte del lifecycle operativo a un provider.

Database gestito.

Message broker gestito.

Identity gestita.

Secret store gestito.

Object storage gestito.

Load balancer gestito.

Questa delega viene spesso descritta come semplice comodità.

In realtà è una decisione di **ownership operativa**.

## Managed non significa senza responsabilità

Se usiamo PostgreSQL gestito, il provider può occuparsi di una parte di:

- provisioning;
- host patching;
- storage durability;
- backup primitives;
- failover capability;
- maintenance infrastructure.

Ma il workload team resta responsabile di:

- schema;
- query;
- index;
- data ownership;
- capacity;
- recovery objective;
- retention;
- access control;
- connection management;
- application behavior durante failover;
- test di restore;
- cost.

Questa distinzione è importante.

> **Managed service significa delegare un meccanismo, non delegare l'outcome.**

Lo stesso vale per messaging.

Azure Service Bus può offrire queue e topic durabili.

Non decide però:

- message semantics;
- idempotency;
- retry policy;
- poison-message handling;
- ownership;
- ordering requirement;
- reconciliation.

Il provider gestisce il broker.

Noi gestiamo il significato del sistema.

Fonte:

- [Microsoft Learn — Azure Service Bus queues, topics and subscriptions](https://learn.microsoft.com/azure/service-bus-messaging/service-bus-queues-topics-subscriptions)

## Managed services e cognitive load

Un team ha una quantità finita di attenzione.

Se decide di gestire direttamente:

```text
PostgreSQL cluster
Kubernetes cluster
message broker cluster
secret infrastructure
monitoring backend
certificate lifecycle
```

deve sviluppare competenza operativa su tutti questi sistemi.

Questa competenza può essere giustificata.

Ma non è gratuita.

Un servizio gestito compra tempo cognitivo.

Questa è una forma di economia architetturale spesso ignorata.

Il costo mensile del servizio può essere superiore al costo teorico delle VM.

Ma il confronto corretto deve includere:

- engineering time;
- on-call;
- patching;
- upgrade;
- incidenti;
- security maintenance;
- automation;
- recovery test;
- capacity planning.

Il TCO non coincide con la fattura della risorsa.

## Il rischio opposto: managed-service sprawl

L'accesso facile ai servizi gestiti crea un altro problema.

Ogni esigenza può diventare un nuovo prodotto cloud.

```text
serve cache        → nuovo servizio
serve search       → nuovo servizio
serve queue        → nuovo servizio
serve scheduler    → nuovo servizio
serve config       → nuovo servizio
serve workflow     → nuovo servizio
```

Dopo due anni possiamo avere un sistema che usa quindici servizi gestiti, ciascuno ragionevole isolatamente e difficile da governare nel complesso.

Il cloud abbassa la friction di provisioning.

L'architettura deve reintrodurre friction decisionale dove serve.

Domanda:

> **Quale proprietà concreta compra questo servizio che non possiamo ottenere in modo sufficientemente buono con ciò che abbiamo già?**

Se non sappiamo rispondere, non abbiamo ancora una decisione.

## Lock-in: una parola troppo generica

“Vendor lock-in” viene spesso usato come argomento finale.

Ma esistono lock-in diversi.

### API lock-in

Il codice dipende direttamente da API specifiche del provider.

### Data lock-in

I dati vivono in un formato o servizio difficile da migrare.

### Operational lock-in

Runbook, dashboard, deployment, alerting e skill dipendono fortemente dal provider.

### Economic lock-in

La struttura dei costi rende la migrazione molto costosa.

### Architectural lock-in

Il sistema assume proprietà di un servizio che non hanno un equivalente semplice altrove.

### Organizational lock-in

L'azienda ha costruito team, processi e governance attorno a un ecosistema.

Questi lock-in non hanno tutti lo stesso peso.

Un'app Node.js ospitata su App Service è diversa da un dominio costruito interamente attorno a primitive proprietarie difficili da sostituire.

## Portabilità ha un costo

Possiamo cercare di evitare qualunque dipendenza cloud.

Per esempio:

```text
non usare managed identity
non usare secret store provider
non usare managed messaging
non usare PaaS
non usare autoscaling provider
```

Così aumentiamo la portabilità teorica.

Ma potremmo perdere:

- security capability;
- automation;
- operability;
- velocità;
- reliability;
- riduzione del cognitive load.

Portabilità massima non è un requisito universale.

È una proprietà che deve avere un valore business.

## Exit strategy proporzionata

Non serve costruire oggi un multi-cloud attivo soltanto perché “un giorno potremmo migrare”.

Possiamo invece mantenere alcune vie di uscita a costo ragionevole.

Per esempio:

- usare PostgreSQL standard invece di modellare il dominio su una feature proprietaria non necessaria;
- tenere il message publisher dietro un port applicativo;
- evitare che Azure Service Bus type entrino nel domain model;
- conservare event contract indipendenti dal broker;
- definire infrastruttura come codice;
- esportare dati con formati documentati;
- conoscere dipendenze cloud realmente one-way-door.

Questa è optionality utile.

Non multi-cloud theater.

## Il test di lock-in

Per una tecnologia cloud importante chiediamo:

1. quanto codice applicativo ne conosce l'API?
2. quanto dato è intrappolato nel servizio?
3. quanto tempo servirebbe per sostituirlo?
4. quale valore stiamo ricevendo in cambio?
5. la probabilità di migrazione giustifica il costo di astrazione?
6. l'astrazione nasconde davvero il provider o crea soltanto wrapper inutili?

La domanda corretta non è:

> “C'è lock-in?”

Quasi sempre la risposta è sì.

La domanda è:

> **“Il lock-in che stiamo pagando è proporzionato al valore che stiamo comprando?”**

## ESI: managed by default, non managed blindly

Platform Engineering propone una regola semplice:

> preferire capability gestite quando soddisfano i requisiti e riducono ownership operativa senza introdurre un rischio sproporzionato.

Non significa:

> ogni servizio deve essere PaaS.

Significa che self-hosting richiede una motivazione.

Per Order Operations questo orienta già alcune decisioni:

- PostgreSQL gestito è candidato forte;
- messaging gestito è candidato forte;
- managed identity è preferibile a secret statici per service-to-service auth;
- non costruiamo un nostro secret store;
- non gestiamo un broker Kafka soltanto per una singola escalation queue.

Il principio è:

> **Non possedere infrastruttura che non differenzia il prodotto, a meno che il controllo acquistato abbia un valore reale.**