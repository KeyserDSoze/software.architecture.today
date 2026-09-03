## Availability zone, region e recovery: ridondanza non significa resilienza

Il cloud rende facile disegnare rettangoli duplicati.

```text
Region A
├── Zone 1
└── Zone 2

Region B
└── standby
```

Ma la presenza di più zone o più regioni non dimostra che il workload sia resiliente.

Dobbiamo distinguere almeno quattro cose:

- high availability;
- fault isolation;
- backup;
- disaster recovery.

Sono correlate.

Non sono la stessa proprietà.

## High availability

High availability riguarda la capacità di continuare a fornire servizio durante alcuni failure previsti.

Può includere:

- più instance;
- replica sincrona;
- automatic failover;
- health probe;
- zone redundancy;
- load balancing.

Ma ogni meccanismo protegge da un failure domain specifico.

Una replica nella stessa zona può proteggere dal failure di un nodo.

Non necessariamente da una zone outage.

Una replica cross-zone protegge da più failure ma introduce costi e possibili impatti di latency.

## Backup

Backup risponde a una domanda diversa:

> **possiamo ricostruire i dati dopo perdita, corruzione o errore?**

Un replica set non sostituisce un backup.

Se una cancellazione errata viene replicata perfettamente, abbiamo più copie dello stesso errore.

Se un bug corrompe logicamente il dato, una replica sincrona può propagare la corruzione.

Il backup deve quindi essere pensato rispetto a:

- retention;
- restore point;
- immutabilità dove necessaria;
- geo-redundancy;
- recovery procedure;
- restore test.

> **Un backup non testato è una speranza compressa in storage.**

## Disaster recovery

Disaster recovery risponde a failure più ampi:

- perdita di una region;
- indisponibilità estesa;
- compromissione grave;
- disaster fisico;
- necessità di ristabilire il workload altrove.

Qui entrano RTO e RPO.

### RTO

Quanto tempo possiamo restare senza il servizio?

### RPO

Quanto dato possiamo perdere rispetto all'ultimo stato confermato?

Questi numeri devono venire dal business impact.

Non dal menu del cloud provider.

## Multi-region non è una checkbox

Una architettura multi-region può richiedere:

- data replication;
- conflict strategy;
- global routing;
- secret/config synchronization;
- deployment coordination;
- regional failover procedure;
- testing;
- observability;
- incident ownership;
- cost duplicato o comunque maggiore.

Se il workload ha RTO di alcune ore, una recovery strategy basata su backup + IaC potrebbe avere più fit di una architettura active-active.

Se il workload è business-critical con RTO di secondi, il discorso cambia.

Questa è la ragione per cui nel Capitolo 6 avevamo rifiutato `active-active multi-region` come requisito generico.

Ora vediamo il motivo operativo.

## Azure Database for PostgreSQL come esempio concreto

Azure Database for PostgreSQL Flexible Server offre configurazioni high availability con standby fisicamente separato, incluse configurazioni zone-redundant.

Microsoft documenta che la configurazione zone-redundant usa replica sincrona e automatic failover, mentre le opzioni cross-region come geo-redundant backup e read replica servono a scenari di disaster recovery differenti.

Fonti:

- [Microsoft Learn — Azure Database for PostgreSQL Flexible Server](https://learn.microsoft.com/azure/postgresql/overview)
- [Microsoft Learn — High availability in Azure Database for PostgreSQL](https://learn.microsoft.com/azure/postgresql/high-availability/concepts-high-availability)
- [Microsoft Learn — Backup and restore](https://learn.microsoft.com/azure/postgresql/backup-restore/concepts-backup-restore)

La cosa interessante non è imparare le opzioni Azure a memoria.

È vedere che anche un singolo prodotto separa:

```text
node failure
zone failure
backup durability
region disaster
```

perché sono failure domain diversi.

## Autoscaling non è reliability

Il cloud rende disponibile autoscaling.

Ma autoscaling risolve principalmente un problema di capacity.

Non corregge automaticamente:

- query inefficienti;
- downstream più piccoli;
- connection pool saturi;
- lock contention;
- hot partition;
- retry storm;
- quota esterne;
- database non scalabile alla stessa velocità.

Amazon Builders' Library descrive esplicitamente overload, load shedding e la necessità di impedire che un componente più grande travolga uno più piccolo.

Fonte:

- [Amazon Builders' Library — Using load shedding to avoid overload](https://aws.amazon.com/builders-library/using-load-shedding-to-avoid-overload/)

Quindi:

> **scalare il caller più velocemente può rendere meno affidabile il sistema complessivo.**

Questa è una manifestazione cloud del feedback loop visto nei capitoli precedenti.

## Capacity ha un ceiling

Nel cloud sentiamo spesso:

> “scala automaticamente.”

Ogni servizio ha comunque:

- quota;
- limit;
- throughput boundary;
- max connection;
- regional capacity;
- provisioning delay;
- economic ceiling.

Il cloud non elimina la capacity planning.

La trasforma.

Invece di chiedere soltanto “quanti server compriamo?”, chiediamo:

- quali componenti possono scale-out?
- quali sono vertical bottleneck?
- quale quota deve essere alzata prima del picco?
- quale dependency è più piccola del caller?
- qual è il cost curve quando il carico cresce?

## ESI: una sola region, per ora

Per Order Operations introduciamo una decisione importante.

La prima production topology sarà **single-region**.

Non active-active multi-region.

Perché?

Non abbiamo ancora un business requirement che giustifichi:

- data replication cross-region;
- global routing;
- duplicate runtime;
- runbook di failover complesso;
- costo aggiuntivo permanente.

Questo non significa ignorare disaster recovery.

Significa separare:

```text
high availability locale
```

da:

```text
regional disaster recovery
```

## Quality floor

La scelta single-region non autorizza:

- nessun backup;
- nessun restore test;
- single-instance fragile senza health/restart capability;
- secret non recuperabili;
- infrastruttura non riproducibile;
- dipendenze non documentate.

Il quality floor richiede almeno:

- backup gestito del database;
- IaC sufficiente a ricostruire l'ambiente;
- failure mode documentati;
- restore procedure verificabile;
- monitoring;
- dipendenze cloud inventariate.

Quando avremo RTO/RPO quantitativi, potremo decidere se servono:

- zone redundancy più forte;
- geo-redundant backup;
- warm standby;
- active-passive;
- active-active.

Prima dei numeri, “multi-region” è soltanto una forma geometrica costosa.

> **La resilienza non è quante copie disegniamo. È quali failure possiamo attraversare entro il tempo e la perdita che il business accetta.**