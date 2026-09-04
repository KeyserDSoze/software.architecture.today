## Availability, region e recovery: disegnare copie non basta

Il cloud rende molto facile disegnare rettangoli duplicati: due instance, due zone, una seconda region. La geometria del diagramma, però, non dimostra che il workload sia resiliente.

High availability, fault isolation, backup e disaster recovery proteggono da failure differenti. Trattarli come sinonimi produce topologie costose che possono continuare a fallire proprio nei casi che volevamo coprire.

## High availability: attraversare alcuni failure senza interrompere il servizio

High availability riguarda la capacità di continuare a servire il workload durante failure previsti. Possiamo usare più instance, health probe, automatic failover, replica sincrona, load balancing o zone redundancy, ma ogni meccanismo protegge da un failure domain specifico.

Una seconda instance nello stesso fault domain può proteggere dal crash di un processo senza proteggere da una zone outage. Una replica cross-zone amplia l’isolamento ma può aumentare costo e, a seconda della tecnologia, influire sul write path.

La domanda non è quindi “abbiamo redundancy?”, ma **quale failure possiamo assorbire senza uscire dal service objective?**

## Backup: sopravvivere anche agli errori che vengono replicati bene

Una replica non sostituisce un backup. Se cancelliamo il dato sbagliato, una replica può propagare perfettamente la cancellazione. Lo stesso vale per logical corruption introdotta dall’applicazione.

Il backup risponde a un’altra domanda: **possiamo ricostruire lo stato dopo perdita, corruzione o errore?** Per essere una strategia reale deve avere retention, restore point, protection adeguata, una procedura di recovery e soprattutto restore test.

> **Un backup non testato è una speranza compressa in storage.**

## Disaster recovery: progettare rispetto all’impatto, non al menu del provider

Disaster recovery entra quando il failure boundary si allarga: perdita di una region, indisponibilità prolungata, compromissione grave o necessità di ricostruire il workload altrove.

Qui RTO e RPO danno forma al problema. L’RTO descrive quanto tempo il business può restare senza la capability; l’RPO quanta perdita di stato può accettare rispetto all’ultimo punto confermato. Questi valori devono derivare dal business impact e poi guidare la topologia.

Se il workload può essere ripristinato in alcune ore con backup, IaC e runbook, un active-active multi-region può essere sproporzionato. Se il business tollera secondi, la discussione cambia radicalmente.

## Multi-region è un sistema distribuito in più

Una seconda region introduce data replication, routing globale, synchronization di config e secrets, deployment coordination, failover procedure, testing, observability, incident ownership e un costo più alto. Non è una checkbox di reliability.

Questa è la ragione per cui il requisito “active-active multi-region” era stato rifiutato nei capitoli precedenti quando non esistevano RTO/RPO che lo giustificassero. Senza un failure objective, stiamo scegliendo una forma prima del problema.

## PostgreSQL gestito mostra bene la differenza fra failure domain

Azure Database for PostgreSQL Flexible Server offre opzioni di high availability, inclusa una configurazione zone-redundant, e distingue questi meccanismi dalle capability di backup e dagli scenari cross-region.

Fonti:

- [Microsoft Learn — Azure Database for PostgreSQL Flexible Server](https://learn.microsoft.com/azure/postgresql/overview)
- [Microsoft Learn — High availability in Azure Database for PostgreSQL](https://learn.microsoft.com/azure/postgresql/high-availability/concepts-high-availability)
- [Microsoft Learn — Backup and restore](https://learn.microsoft.com/azure/postgresql/backup-restore/concepts-backup-restore)

Il valore dell’esempio non è imparare le opzioni Azure a memoria. È vedere che node failure, zone failure, logical data loss e regional disaster richiedono strumenti differenti anche dentro lo stesso prodotto.

## Autoscaling risolve capacity, non correctness

Il cloud rende facile aggiungere instance, ma autoscaling non corregge query inefficienti, connection pool saturi, lock contention, hot partition, retry storm o downstream incapaci di crescere allo stesso ritmo.

Amazon Builders’ Library descrive overload e load shedding proprio per evitare che un componente capace di ricevere più traffico travolga una dipendenza più piccola.

Fonte:

- [Amazon Builders' Library — Using load shedding to avoid overload](https://aws.amazon.com/builders-library/using-load-shedding-to-avoid-overload/)

Aumentare rapidamente la capacità del caller può quindi ridurre l’affidabilità end-to-end. L’autoscaling deve conoscere il collo di bottiglia reale e i limiti delle dipendenze.

Ogni servizio ha inoltre quote, throughput boundary, max connection, provisioning delay, regional capacity ed economic ceiling. Il cloud non elimina capacity planning; sposta la domanda da “quanti server compriamo?” a “dove si trova il limite e quanto velocemente possiamo raggiungerlo?”.

## ESI: single-region è una decisione, non una rinuncia al recovery

Per la prima production topology di Order Operations scegliamo **single-region**. Oggi non esiste ancora un requisito quantitativo che paghi data replication cross-region, duplicate runtime, global routing e un failover runbook più complesso.

Questo non significa ignorare reliability. Significa separare high availability intra-region da disaster recovery regionale.

Il quality floor richiede backup gestito, IaC sufficiente a ricostruire l’ambiente, failure mode documentati, monitoring e una restore procedure verificabile. La modalità HA production di PostgreSQL e le eventuali opzioni zonali verranno collegate ai target quantitativi man mano che il Reliability Contract del capstone evolve.

La Cloud Deployment Map viva, nei capitoli successivi, aggiungerà target e scelte più specifiche; il Capitolo 12 fissa qui la baseline decisionale: **single-region non significa single-point-of-failure, e multi-region non viene comprato prima che il business ne definisca il valore**.

> **La resilienza non è quante copie disegniamo. È quali failure possiamo attraversare entro il tempo e la perdita che il business accetta.**