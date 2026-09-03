## Index, partitioning e replica non sono sinonimi di “scalare”

Quando un database inizia a rallentare, la conversazione spesso degenera rapidamente:

> “Mettiamo un indice.”

> “Partizioniamo.”

> “Aggiungiamo una replica.”

> “Shardiamo.”

Sono interventi molto diversi.

Ognuno modifica un problema specifico e introduce nuovi costi.

La parola “scalabilità” non basta a scegliere.

## Index: accelerare alcuni accessi pagando su write e storage

PostgreSQL descrive gli index come un modo per trovare righe più rapidamente, ricordando però che aggiungono overhead al sistema e devono essere usati con criterio.

Fonte primaria:

- [PostgreSQL 18 — Indexes](https://www.postgresql.org/docs/18/indexes-intro.html)

Un indice ha senso se sostiene un access pattern reale.

Per la coda operativa potremmo avere query come:

```sql
WHERE tenant_id = ?
  AND problem_category = ?
ORDER BY detected_at ASC
LIMIT ?
```

Questo suggerisce di studiare un indice coerente con:

- filtro per tenant;
- filtro per categoria;
- ordinamento per anzianità.

Ma non dobbiamo trasformare ogni colonna filtrabile in un indice.

Ogni indice:

- occupa spazio;
- deve essere mantenuto sulle write;
- può aumentare write amplification;
- deve essere capito dal query planner;
- deve essere monitorato per utilizzo reale.

La domanda corretta non è:

> “Quali colonne indicizziamo?”

ma:

> **quali query importanti dobbiamo rendere efficienti e quale costo di write siamo disposti a pagare?**

## EXPLAIN prima dell'intuizione

Con l'aumentare dell'assistenza AI sarà ancora più facile generare una lista convincente di index.

Questo non significa che siano utili.

Per le query importanti dobbiamo osservare il piano reale e misurare.

Il principio vale oltre PostgreSQL:

> **un indice è una ipotesi di performance che deve essere verificata sul workload.**

Non una best practice da applicare per associazione di parole.

## Partitioning: dividere una grande struttura secondo una chiave utile

PostgreSQL definisce il partitioning come la divisione di una tabella logicamente unica in pezzi fisici più piccoli e documenta benefici possibili quando query e gestione dei dati possono sfruttare bene la partition key.

Fonte primaria:

- [PostgreSQL 18 — Table Partitioning](https://www.postgresql.org/docs/18/ddl-partitioning.html)

Il punto fondamentale è che il partition key diventa una decisione architetturale.

Possibili chiavi:

```text
tenant_id
time
region
business unit
hash(entity_id)
```

Ognuna favorisce alcuni access pattern e ne rende altri più costosi.

Se partizioniamo per tenant:

- l'isolamento e molte query tenant-local possono beneficiarne;
- query globali diventano cross-partition;
- tenant molto grandi possono creare skew.

Se partizioniamo per mese:

- retention e archiviazione possono diventare semplici;
- query temporali limitate possono migliorare;
- lookup casuali per orderId devono comunque trovare la partizione corretta o usare un indice adeguato.

Non esiste “la” partition key.

Esiste quella coerente con il workload e il lifecycle.

## Partitioning non è sharding

È utile distinguere i termini.

Possiamo partizionare una tabella all'interno dello stesso database.

Possiamo anche distribuire dati tra nodi o database differenti: quello introduce un livello ulteriore di routing, failure e operability.

La similitudine è che in entrambi i casi dividiamo un insieme.

La differenza è che la distribuzione fisica tra sistemi indipendenti introduce problemi come:

- cross-node transaction;
- routing;
- rebalance;
- hotspot;
- failover;
- schema rollout coordinato;
- observability distribuita.

Quindi non sharderemo Order Operations perché abbiamo imparato la parola.

## Replica: read scale e availability

Una read replica può servire due obiettivi frequenti:

- aumentare capacità di lettura;
- separare alcuni workload dal primary.

Può anche essere parte di una strategia di high availability.

Ma, come visto nella sezione precedente, replica sincrona e asincrona hanno trade-off diversi su latency, availability e rischio di staleness/perdita al failover.

Fonte primaria:

- [PostgreSQL 18 — High Availability, Load Balancing, and Replication](https://www.postgresql.org/docs/18/high-availability.html)

Per Order Operations potremmo in futuro decidere di leggere da replica per proteggere il workload transazionale.

Prima però dovremmo definire:

```text
maximum acceptable lag
read-after-write behavior
failover behavior
monitoring del lag
fallback al primary
```

Senza questo contratto, la replica cambia la semantica senza dirlo.

## Il caso degli analytics

Supponiamo che Data & AI chieda:

> “Possiamo lanciare query pesanti sul database operativo per costruire i report?”

Tecnicamente forse sì.

Architetturalmente dobbiamo chiedere che cosa succede al critical user journey mentre parte una scansione ampia.

Potremmo scegliere:

- replica dedicata;
- export periodico;
- warehouse;
- snapshot;
- materializzazione separata.

Il pattern corretto dipende da freshness, volume, costo e isolamento richiesto.

Questo mostra un principio:

> **lo stesso dato può avere workload incompatibili anche se appartiene allo stesso dominio.**

Separare workload non significa necessariamente separare ownership.

## Hot partition e skew

Ogni strategia di distribuzione deve considerare la forma reale del traffico.

Se il 60% delle richieste riguarda un singolo tenant enterprise, una partizione per tenant può creare un hotspot.

Se quasi tutti gli ordini vengono creati nel periodo corrente, una partizione temporale concentra naturalmente le write.

Se usiamo hash uniforme possiamo distribuire meglio il carico ma rendere più difficili alcune operazioni locality-based.

Il sistema non scala perché “ha partizioni”.

Scala se le partizioni riflettono una distribuzione utile del workload.

## Non ottimizziamo dati che non abbiamo

Order Operations oggi non ha ancora misure che giustifichino:

- table partitioning;
- sharding;
- read replica dedicata;
- search cluster.

Quindi non li introduciamo.

In compenso prepariamo le misure che potrebbero far scattare la revisione:

```text
query latency per critical query
rows scanned / rows returned
index usage
write latency
connection saturation
DB CPU / IO
replica lag, se introdotta
volume per tenant
retention growth
```

Il compromesso è importante.

Non paghiamo oggi la complessità di una scala ipotetica.

Ma non rinunciamo alla capacità di vedere quando il contesto cambia.

> **Scalabilità senza misure è spesso soltanto immaginazione infrastrutturale.**