## Idee chiave

1. **Il dato non è soltanto storage.** Ha ownership, semantica, lifecycle, access pattern, failure mode e costi.
2. **Storage ownership e semantic ownership non coincidono necessariamente.** Una copia locale non trasferisce automaticamente autorità.
3. **Una source of truth è una autorità semantica, non necessariamente l'unico posto fisico in cui il dato appare.**
4. **Duplicare rappresentazioni può essere utile. Duplicare autorità crea ambiguità.**
5. **Il modello dati deve partire dagli access pattern e dagli invarianti**, non dalla tecnologia che vogliamo usare.
6. Relational, document, key-value, graph e store specializzati sono modelli con fit differenti, non livelli di modernità.
7. **Polyglot persistence paga una tassa operativa.** Ha senso quando access pattern o lifecycle divergono abbastanza da giustificarla.
8. **Una transazione protegge fatti che devono diventare veri insieme.** Il database non può inventare l'invariante di business.
9. **Consistency deve essere definita per una decisione o un journey.** “Strong consistency” senza contesto è un requisito incompleto.
10. Index, partitioning, replica e sharding risolvono problemi differenti e introducono costi differenti.
11. **Una cache è una copia con una politica di staleness e invalidation.** Non è un acceleratore gratuito.
12. I dati derivati devono avere source, freshness, rebuild strategy e regola di derivazione comprensibili.
13. **Schema evolution è architettura.** In produzione le versioni devono spesso convivere durante una migration.
14. Migrazioni grandi diventano più governabili quando vengono spezzate in fasi osservabili, verificabili e reversibili dove possibile.
15. Retention, archival e deletion sono decisioni di prodotto, security, compliance e operability, non semplici default del database.
16. L'AI può accelerare query, migration e backfill, ma non conosce automaticamente workload, lock behavior, consumer nascosti e rischio accettabile.

## Artefatto operativo — Data Ownership Map

Il nuovo artefatto del capitolo è la **Data Ownership Map**.

Per ogni dato significativo dovrebbe permettere di rispondere almeno a:

```text
Data / concept
Che cosa rappresenta?

Semantic owner
Chi ne decide significato e transizioni?

Authoritative store
Dove vive la versione autorevole corrente?

Derived copies
Quali projection, cache, replica o warehouse lo contengono?

Consumers
Chi dipende dal dato?

Consistency / freshness
Quale ritardo è accettabile per ciascun consumer?

Security
Chi può leggere o modificare?

Retention
Quanto a lungo viene conservato?

Recovery
Come viene ripristinato o ricostruito?

Migration
Quali compatibility rule proteggono l'evoluzione?
```

La mappa non deve diventare un catalogo di colonne.

Serve per i dati che possono cambiare una decisione architetturale o produrre rischio se interpretati male.

## Cosa cambia con l'AI

L'AI rende particolarmente economiche alcune attività data-heavy:

- generare schema;
- scrivere migration;
- suggerire index;
- convertire ORM model;
- creare seed e fixture;
- produrre query;
- progettare cache layer;
- generare backfill;
- modificare centinaia di access path.

Il rischio è che la velocità di trasformazione superi la nostra comprensione del dato.

Un agente può rinominare perfettamente una colonna in tutto il repository e comunque rompere:

- un consumer esterno non presente nel repository;
- un report manuale;
- una replica;
- un data export;
- una retention policy;
- un job schedulato;
- una business rule implicita;
- una migration in corso.

Quindi il controllo deve spostarsi verso:

```text
ownership
contracts
invariants
compatibility
validation queries
observability
reconciliation
rollback / stop conditions
```

> **Quando modificare i dati diventa più facile, sapere che cosa quei dati significano diventa più importante.**

## Esercizio 1 — Chi possiede davvero il dato?

Un sistema contiene una tabella `customer` usata da:

- CRM;
- billing;
- support;
- marketing;
- identity.

Ogni sistema modifica almeno un campo.

Costruisci una Data Ownership Map.

Per ogni campo o concetto significativo identifica:

- semantic owner;
- authoritative source;
- copie derivate;
- consumer;
- conflitti possibili.

Poi rispondi:

> la tabella condivisa rappresenta davvero un unico dominio o sta nascondendo cinque ownership differenti?

## Esercizio 2 — Scegli il modello, non il prodotto

Per ciascun workload scegli un modello candidato e motiva i trade-off:

1. order management con transazioni e vincoli;
2. catalogo prodotti con schede molto variabili;
3. rate limiting distribuito;
4. social graph con traversal multi-hop;
5. ricerca full-text su milioni di documenti;
6. telemetria temporale ad alto volume.

Non nominare un vendor nella prima risposta.

Parti da access pattern, consistency, relazioni, lifecycle e scale.

Solo dopo proponi tecnologie concrete.

## Esercizio 3 — L'indice plausibile

Hai questa query:

```sql
SELECT id, order_id, problem_category, detected_at
FROM operations.operational_case
WHERE tenant_id = :tenant
  AND problem_category = :category
ORDER BY detected_at ASC
LIMIT 50;
```

Proponi due index candidate.

Per ciascuna spiega:

- quale query favorisce;
- quale overhead introduce;
- che cosa misureresti con `EXPLAIN`/runtime metrics;
- quando rimuoveresti l'indice.

L'obiettivo non è indovinare l'indice perfetto.

È trattarlo come una ipotesi verificabile.

## Esercizio 4 — Consistency per journey

Definisci consistency/freshness per:

- assignment di un caso;
- dashboard del management;
- stato pagamento mostrato a Operations;
- report mensile;
- fraud signal usato per bloccare una transazione.

Evita parole generiche.

Scrivi comportamenti osservabili.

## Esercizio 5 — Replica

Il team propone una read replica per Order Operations.

Scrivi un mini ADR che consideri:

- obiettivo;
- replica lag;
- read-after-write;
- failover;
- monitoring;
- fallback;
- costo.

Concludi se introdurla ora o no.

## Esercizio 6 — Cache senza magia

Progetta una cache-aside per un'API di product catalog.

Definisci:

- cache key;
- TTL;
- invalidation;
- comportamento su miss;
- comportamento se Redis è down;
- stampede protection;
- metriche;
- rischio di tenant/data leakage.

Poi rispondi:

> quale requisito misurato giustifica davvero la cache?

## Esercizio 7 — Projection di Order Operations

Supponi che il lookup live inizi a sovraccaricare i domain store.

Progetta una `ProblematicOrderProjection`.

Devi indicare:

- campi copiati;
- source per ogni campo;
- freshness target;
- propagation mechanism candidato;
- reconciliation;
- rebuild;
- failure behavior;
- cutover dal live lookup.

Non trasferire ownership a Order Operations per errore.

## Esercizio 8 — Online migration

Una tabella contiene 200 milioni di record e vuoi spostare `shipping_address` in una nuova struttura.

Progetta una migration in fasi ispirandoti ai principi discussi nel caso Stripe:

- expand;
- dual write se appropriato;
- backfill;
- compare/read validation;
- cutover;
- contract.

Per ogni fase definisci stop condition e rollback possible.

Fonte da leggere:

- [Stripe Engineering — Online migrations at scale](https://stripe.com/blog/online-migrations)

## Esercizio 9 — Retention conflict

Tre stakeholder chiedono:

```text
Support: teniamo tutto, ci serve per investigare.
Security: minimizziamo i dati conservati.
Legal: alcuni audit record vanno conservati più a lungo.
```

Costruisci una retention decision separando:

- operational data;
- audit;
- PII;
- analytics;
- backup.

Mostra il compromesso e il quality floor.

## Esercizio 10 — AI migration reviewer

Chiedi a un agente AI di preparare una migration su un repository reale o didattico.

Poi usa un secondo agente come reviewer con il compito di cercare:

- consumer nascosti;
- destructive change;
- lock risk;
- backfill non resumable;
- rollback impossibile;
- dati persi;
- incompatibilità tra versioni;
- mancata observability.

Il deliverable non è la migration.

È la lista delle assunzioni che richiedono verifica umana o evidenza.

## Autovalutazione

Dopo il capitolo dovresti saper rispondere a queste domande senza ricorrere a slogan:

1. Qual è la differenza tra semantic ownership e storage ownership?
2. Una source of truth deve essere fisicamente unica?
3. Quando duplicare un dato è ragionevole?
4. Che cosa rende una copia derivata governabile?
5. Come scegli un modello dati partendo dal workload?
6. Perché “ACID” non basta a risolvere una race condition di business?
7. Qual è la differenza tra index, partitioning, replica e sharding?
8. Che cosa deve essere deciso prima di introdurre una cache?
9. Perché una migration di schema può essere una one-way door?
10. Quali proprietà hanno reso interessante il caso Stripe senza renderlo una ricetta universale?
11. Come proteggeresti un backfill generato da AI?
12. Qual è il compromesso corrente sui dati di Order Operations?

Se alcune risposte sono vaghe, torna alle sezioni corrispondenti.

## Il compromesso ESI in una riga

Order Operations vuole una vista unica e semplice; ESI accetta per ora maggiore coupling runtime verso i dati autorevoli pur di **non introdurre prematuramente una seconda pipeline di verità**, mantenendo ownership, tenant isolation e correctness come quality floor.

## Corollario

Nel Capitolo 9 abbiamo detto che un'API è una promessa.

Ora possiamo completare il pensiero:

> **Ogni promessa sui dati ha bisogno di sapere chi è autorizzato a dire che è vera.**

Nel prossimo capitolo entreremo nei sistemi distribuiti.

Quando dati, messaggi e operazioni attraversano processi e nodi differenti, failure parziali, retry, ordering ed eventual consistency smettono di essere concetti teorici.

Diventano il modo normale in cui il sistema può rompersi.

E avremo già una base fondamentale:

> **prima di distribuire il dato, dobbiamo sapere chi ne possiede il significato.**