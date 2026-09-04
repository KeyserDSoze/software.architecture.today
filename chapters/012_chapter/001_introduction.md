# Capitolo 12 — Cloud Architecture

Il cloud non è un’architettura. È un ambiente operativo che cambia il modo in cui acquistiamo capacità, automatizziamo infrastruttura, distribuiamo responsabilità, attraversiamo failure boundary e paghiamo il sistema.

La distinzione diventa importante appena compare una frase come “portiamolo in cloud”. Potrebbe significare spostare una VM, adottare un PaaS, containerizzare il workload, introdurre Kubernetes, usare serverless, scegliere un database gestito, centralizzare identity e secrets oppure ripensare l’intero operating model dell’azienda. Queste trasformazioni non sono varianti equivalenti della stessa decisione.

Il rischio è scambiare una destinazione infrastrutturale per una strategia architetturale.

## La domanda non è quanto cloud usiamo

Un sistema può essere pieno di container, Kubernetes, service mesh, serverless function, event streaming e replica multi-region e avere comunque un fit scarso con il problema. Può risultare troppo costoso, troppo difficile da operare, sproporzionato rispetto al rischio o dipendente da skill che il team non possiede.

Al contrario, una web application relativamente tradizionale su un PaaS gestito può essere una soluzione cloud eccellente se compra esattamente le proprietà necessarie con poco overhead.

Per questo distinguiamo **cloud-native**, cioè architetture e pratiche che sfruttano intenzionalmente elasticity, managed service, automation e distributed execution, da **cloud-appropriate**, cioè una soluzione che usa queste capacità nella misura in cui hanno fit con requisiti, workload, rischio, costi, organizzazione e capacità operativa.

Il secondo concetto ci interessa di più.

> **Il cloud non premia chi usa più servizi. Premia chi compra con precisione le proprietà che gli servono.**

## Dal server al workload

In un datacenter la conversazione infrastrutturale può iniziare da CPU, RAM, dischi e numero di VM. Nel cloud queste domande restano, ma sono subordinate a una domanda più utile: **quale workload stiamo cercando di operare e quali proprietà deve garantire?**

Microsoft Azure Architecture Center parte esplicitamente da business requirement e quality attribute come reliability, security, cost, operational excellence e performance efficiency prima di restringere stile architetturale e technology choice.

Fonti:

- [Microsoft Learn — Azure Application Architecture Fundamentals](https://learn.microsoft.com/azure/architecture/guide/)
- [Microsoft Learn — Design principles for Azure applications](https://learn.microsoft.com/azure/architecture/guide/design-principles/)

AWS Well-Architected usa un’impostazione analoga e rende espliciti i trade-off fra operational excellence, security, reliability, performance efficiency, cost optimization e sustainability.

Fonte:

- [AWS Well-Architected Framework](https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html)

Questi framework non decidono la topologia di ESI. Ci ricordano però che una scelta cloud non può essere separata dal sistema che deve sostenere.

## Creare è facile; possedere resta costoso

Nel cloud possiamo creare un database, una queue, una replica, un cluster, una funzione o perfino una nuova region in tempi molto brevi. È una capacità straordinaria, ma abbassa anche la friction iniziale della complessità.

Il provisioning rapido non ci dice se sapremo aggiornare quella risorsa, monitorarla, proteggerla, recuperarne i dati, gestirne quote e costi, ruotare credenziali, integrarla nella delivery oppure rimuoverla senza rompere il sistema.

Qui cloud e AI mostrano una dinamica simile: entrambi riducono il costo di execution e aumentano quindi il valore di governance, context e verification.

> **Rendere facile la creazione non rende economica la proprietà.**

## ESI arriva al punto in cui l’infrastruttura diventa concreta

Order Operations ora possiede analisi funzionale, API contract, PostgreSQL, transactional outbox, event contract, Failure Mode Map e un primo nucleo TypeScript. Il sistema non è ancora deployed, quindi Platform Engineering entra finalmente nella storia con una foundation cloud comune.

ESI ha abbastanza workload da non poter lasciare a ogni team un cloud estate completamente diverso. Platform vuole offrire identity aziendale, organization delle risorse, policy baseline, networking condiviso, logging, secret management, Infrastructure as Code e servizi approvati. Commerce & Operations vuole però evitare che la piattaforma diventi una coda di ticket. Security vuole enforcement non aggirabile. Finance vuole evitare topologie premium costruite “nel dubbio”. Il workload team vuole continuare a possedere delivery e operability del prodotto.

La tensione non è quindi “cloud sì o cloud no”. È **standardizzazione contro autonomia, sicurezza contro friction, semplicità contro optionality, costo contro capacità futura**.

Il quality floor resta chiaro: identity e access control, tenant isolation, secret protection, durability coerente con i requisiti, logging e monitoring sufficienti, provisioning ripetibile, recovery e ownership esplicita fra Platform e workload team.

## Il percorso del capitolo

Seguiamo una progressione coerente con il resto del libro:

```text
workload e operating model
→ platform boundary
→ quantità di compute control
→ managed ownership
→ failure boundary e recovery
→ network / identity / secrets
→ Infrastructure as Code
→ Cloud Deployment Map
→ scelta ESI
```

Non partiamo da Azure, AWS o Google Cloud. I servizi concreti arrivano soltanto quando abbiamo abbastanza contesto per valutarli.

La domanda che governa l’intero capitolo sarà:

> **Qual è la quantità minima di cloud complexity che ci permette di soddisfare bene il workload e il suo quality floor?**

È il criterio con cui giudicheremo ciò che adottiamo e, altrettanto importante, ciò che decidiamo di non adottare.