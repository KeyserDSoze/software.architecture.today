# Capitolo 12 — Cloud Architecture

Il cloud non è un'architettura.

È un ambiente operativo che cambia il modo in cui acquistiamo capacità, distribuiamo responsabilità, automatizziamo infrastruttura, gestiamo failure e paghiamo il sistema.

Questa distinzione sembra banale finché non incontriamo una frase come:

> “Portiamolo in cloud.”

Da sola non ci dice quasi nulla.

Potrebbe significare:

- spostare una VM;
- adottare un PaaS;
- containerizzare il workload;
- introdurre Kubernetes;
- usare serverless;
- usare un database gestito;
- centralizzare identity e secrets;
- automatizzare provisioning e deployment;
- progettare per availability zone e region;
- trasformare il modello operativo dell'azienda.

Sono cambiamenti molto diversi.

Il rischio è scambiare una destinazione infrastrutturale per una decisione architetturale completa.

## Cloud-native non significa automaticamente cloud-appropriate

Un sistema può usare molte capability tipicamente associate al cloud e avere comunque un fit scarso con il problema.

Può avere:

```text
containers
Kubernetes
service mesh
serverless functions
event streaming
multi-region
managed databases
```

ed essere comunque:

- troppo costoso;
- troppo complesso da operare;
- difficile da comprendere;
- sproporzionato rispetto al rischio;
- dipendente da skill che il team non possiede;
- incapace di soddisfare il vero requisito business.

Allo stesso modo, un'applicazione relativamente tradizionale ospitata su un PaaS gestito può essere una scelta cloud eccellente se soddisfa bene il workload con poco overhead.

Per questo useremo due espressioni distinte.

### Cloud-native

Descrive architetture e pratiche che sfruttano intenzionalmente caratteristiche del cloud come elasticity, managed services, automation e distributed execution.

### Cloud-appropriate

Descrive una soluzione che usa il cloud nella misura e nel modo che hanno fit con:

- requisiti;
- workload;
- rischio;
- costi;
- organizzazione;
- skill;
- capacità operativa.

Il secondo concetto è più importante del primo.

> **Il cloud non premia chi usa più servizi. Premia chi compra con precisione le proprietà che gli servono.**

## Dal server al workload

In un datacenter tradizionale una conversazione infrastrutturale può iniziare da:

```text
quante VM?
quanta CPU?
quanta RAM?
quanti dischi?
```

Nel cloud queste domande non spariscono, ma diventano subordinate a una domanda più ampia:

> **quale workload stiamo cercando di operare e quali proprietà deve avere?**

Microsoft Azure Architecture Center parte esplicitamente da business requirements e quality attribute come reliability, security, cost, operational excellence e performance efficiency prima di restringere stile architetturale e technology choice.

Fonti:

- [Microsoft Learn — Azure Application Architecture Fundamentals](https://learn.microsoft.com/azure/architecture/guide/)
- [Microsoft Learn — Design principles for Azure applications](https://learn.microsoft.com/azure/architecture/guide/design-principles/)

AWS Well-Architected usa un'impostazione analoga e rende esplicito che i workload richiedono trade-off tra operational excellence, security, reliability, performance efficiency, cost optimization e sustainability.

Fonte:

- [AWS Well-Architected Framework](https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html)

Questi framework non ci danno la risposta specifica per ESI.

Ci ricordano però che la scelta cloud non può essere isolata dal resto dell'architettura.

## Il cloud espone più velocemente le decisioni sbagliate

Nel cloud molte risorse possono essere create in minuti.

Questa è una grande capacità.

Ma riduce anche il costo iniziale di introdurre complessità.

Possiamo creare facilmente:

- un altro database;
- una nuova queue;
- un cluster;
- una funzione;
- un private endpoint;
- una replica;
- un ambiente;
- una subscription;
- una nuova regione.

Il provisioning rapido non ci dice però se sapremo:

- aggiornare quella risorsa;
- monitorarla;
- proteggerla;
- recuperarne i dati;
- ruotarne le credenziali;
- comprenderne il costo;
- integrarla nei deployment;
- gestirne quote e limiti;
- rimuoverla senza rompere il sistema.

Qui torna un principio già visto con l'AI:

> **Rendere facile la creazione non rende economica la proprietà.**

Cloud e AI condividono una dinamica importante.

Entrambi riducono il costo di execution.

Entrambi aumentano quindi il valore di governance, context e verification.

## Una nuova tensione dentro ESI

Order Operations è cresciuto.

Ora possiede:

- analisi funzionale;
- API contract;
- PostgreSQL schema;
- transactional outbox;
- event contract;
- Failure Mode Map;
- primo nucleo TypeScript.

Il sistema non è ancora deployed.

Arriva quindi Platform Engineering.

ESI ha ormai abbastanza prodotti da non poter lasciare a ogni team completa libertà sul cloud estate.

Platform propone una foundation comune:

- identity aziendale;
- subscription e resource organization;
- policy baseline;
- networking condiviso;
- logging e monitoring standard;
- secret management;
- Infrastructure as Code;
- servizi cloud approvati quando hanno fit.

Commerce & Operations vuole però evitare che la piattaforma trasformi ogni delivery in una richiesta al team centrale.

Security vuole baseline non aggirabili.

Finance vuole evitare architetture premium costruite “nel dubbio”.

Il team Order Operations vuole autonomia sufficiente per rilasciare e operare il prodotto.

Abbiamo quindi il compromesso del capitolo.

### Esigenza

Portare Order Operations su una piattaforma cloud governata e production-capable.

### Tensione

```text
standardizzazione Platform
vs
autonomia workload team
vs
security baseline
vs
semplicità operativa
vs
costo
vs
future optionality
```

### Quality floor

Non negoziamo:

- identity e access control;
- tenant isolation;
- protezione dei secrets;
- data durability coerente con i requisiti;
- logging/monitoring necessari a operare;
- provisioning ripetibile;
- possibilità di recovery;
- ownership chiara tra Platform e workload team.

Il resto è una decisione di fit.

## Il percorso del capitolo

Non inizieremo da Azure, AWS o Google Cloud.

Partiremo da:

1. workload e operating model;
2. responsabilità fra platform e application team;
3. compute model;
4. managed services;
5. availability boundary;
6. networking, identity e secrets;
7. Infrastructure as Code e ambienti;
8. Cloud Deployment Map di ESI.

Solo nella sezione ESI sceglieremo servizi concreti.

E anche allora la domanda non sarà:

> “Quali servizi Azure possiamo usare?”

Sarà:

> **“Qual è la quantità minima di cloud complexity che ci permette di soddisfare bene il workload e il suo quality floor?”**

Questo è il criterio con cui giudicheremo tutto il capitolo.