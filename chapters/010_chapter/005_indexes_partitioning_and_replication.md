## Index, partitioning e replica non sono sinonimi di “scalare”

Quando un database rallenta, la conversazione tende a comprimersi in poche parole: “mettiamo un indice”, “partizioniamo”, “aggiungiamo una replica”, “shardiamo”. Sembrano tutte varianti della stessa idea, ma modificano problemi diversi e introducono costi diversi.

La parola *scalabilità* non basta quindi a scegliere. Dobbiamo capire quale parte del workload stia soffrendo, quale proprietà vogliamo comprare e che cosa siamo disposti a pagare.

## Un indice è una scommessa su un access pattern

PostgreSQL descrive gli index come strutture che possono rendere più rapido il ritrovamento delle righe, ricordando però che aggiungono overhead e devono essere usati con criterio.

Fonte primaria:

- [PostgreSQL 18 — Indexes](https://www.postgresql.org/docs/18/indexes-intro.html)

Per la coda operativa potremmo avere una query simile a:

```sql
WHERE tenant_id = ?
  AND problem_category = ?
ORDER BY detected_at ASC
LIMIT ?
```

Questo rende plausibile un indice che rifletta tenant, categoria e ordinamento. Ma “plausibile” è la parola giusta: ogni indice occupa spazio, aumenta il lavoro sulle write e può diventare inutile se il workload reale cambia.

Per questo un indice va trattato come **ipotesi di performance**. La domanda non è quali colonne indicizzare in astratto, ma quali query importanti rendere efficienti e quale write amplification accettare. `EXPLAIN`, piani reali e metriche runtime vengono prima della fiducia nell’intuizione, anche quando l’intuizione è prodotta da un agente AI molto convincente.

## Partitioning: dividere secondo una chiave che abbia senso per il lifecycle

PostgreSQL definisce il table partitioning come la divisione di una tabella logicamente unica in parti fisiche più piccole e documenta benefici possibili quando query e gestione del dato sfruttano bene la partition key.

Fonte primaria:

- [PostgreSQL 18 — Table Partitioning](https://www.postgresql.org/docs/18/ddl-partitioning.html)

La scelta della chiave è architetturale perché determina locality, pruning, gestione della retention e distribuzione del carico. Partizionare per tenant può favorire query tenant-local e isolamento, ma creare skew quando pochi tenant dominano il traffico. Partizionare per tempo può semplificare retention e scansioni temporali, ma non aiuta automaticamente i lookup casuali.

Non esiste quindi “la” partition key corretta. Esiste quella che coincide con access pattern, crescita e lifecycle del workload.

## Partitioning e sharding sono decisioni di peso diverso

Partizionare una tabella dentro lo stesso database non equivale a distribuire dati tra nodi o datastore indipendenti. Nel secondo caso arrivano routing, failover, rebalance, hotspot, transazioni cross-node, rollout di schema coordinati e observability distribuita.

La somiglianza superficiale è che in entrambi i casi dividiamo un insieme. La differenza è che lo sharding introduce una nuova topologia operativa.

Order Operations non verrà shardato perché abbiamo imparato il termine. La distribuzione entra soltanto quando un problema misurato la rende una soluzione proporzionata.

## Replica: read scale, availability e staleness

Una read replica può aumentare capacità di lettura, isolare alcuni workload dal primary o contribuire alla high availability. Ma cambia la semantica temporale del dato. Come abbiamo visto, replica sincrona e asincrona hanno trade-off differenti su latency, availability e rischio di staleness o perdita al failover.

Fonte primaria:

- [PostgreSQL 18 — High Availability, Load Balancing, and Replication](https://www.postgresql.org/docs/18/high-availability.html)

Se Order Operations leggesse da replica, non basterebbe configurarla. Dovremmo dichiarare maximum acceptable lag, comportamento read-after-write, fallback al primary e monitoraggio del lag. Senza queste decisioni la replica cambia il contratto dei dati senza dirlo.

## Separare workload può essere più importante che separare ownership

Immaginiamo che Data & AI voglia eseguire scansioni molto pesanti sul database operativo. Anche se i dati appartengono allo stesso dominio, il workload analitico può essere incompatibile con il critical user journey.

La risposta potrebbe essere una replica dedicata, un export periodico, un warehouse, uno snapshot o una materializzazione separata. Il punto non è copiare i dati per moda, ma evitare che workload diversi competano per le stesse risorse quando quella competizione produce un rischio reale.

Separare workload non trasferisce semantic ownership. È un’altra applicazione della distinzione tra autorità e rappresentazione.

## Hot partition e skew ricordano che il traffico ha una forma

Qualunque strategia di distribuzione presuppone qualcosa sulla forma del traffico. Se un singolo tenant genera gran parte delle richieste, il tenant può diventare una hot partition. Se quasi tutte le write riguardano il mese corrente, una partizione temporale concentra naturalmente il carico proprio dove avevamo sperato di distribuirlo.

La struttura non scala perché esistono partizioni; scala se quelle partizioni riflettono una distribuzione utile del workload reale.

## ESI: per ora misuriamo prima di distribuire

Order Operations non ha ancora evidenze che giustifichino table partitioning, sharding, una read replica dedicata o un search cluster. Introdurli ora significherebbe comprare failure mode e operability per una scala immaginata.

Questo non significa aspettare passivamente. Prepariamo invece le misure che possono far scattare una revisione: latency delle critical query, rapporto fra righe lette e restituite, utilizzo degli index, write latency, saturazione delle connessioni, CPU/IO del database, crescita per tenant e retention growth. Se arriverà una replica, misureremo anche il lag.

Il compromesso è semplice: **non paghiamo oggi la complessità di una scala ipotetica, ma costruiamo la capacità di vedere quando il contesto cambia**.

Scalabilità senza misure è spesso soltanto immaginazione infrastrutturale.