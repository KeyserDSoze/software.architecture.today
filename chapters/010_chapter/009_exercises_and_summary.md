## Sintesi: i dati sono decisioni, non soltanto storage

Questo capitolo ha costruito una tesi unica da prospettive diverse: un dato porta con sé ownership, semantica, access pattern, consistency, lifecycle, failure mode e costo. Il datastore è una conseguenza di queste proprietà, non il punto da cui partire.

La distinzione più importante è quella tra **storage ownership** e **semantic ownership**. Una copia locale, una replica o una projection possono essere utili senza diventare autorevoli. Una source of truth non deve essere fisicamente unica: deve esserci una autorità chiara quando due rappresentazioni non concordano.

Da qui discendono molte altre scelte. Il modello dati deve seguire workload e invarianti; relational, document, key-value, graph e store specializzati hanno fit differenti e non rappresentano livelli di modernità. Polyglot persistence può essere una capacità, ma ogni nuovo store introduce una tassa operativa che deve essere pagata da un access pattern reale.

Le transazioni proteggono fatti che devono diventare veri insieme, ma il database non può inventare l’invariante di business. Allo stesso modo, “strong consistency” è troppo generico finché non diciamo per quale decisione o journey serva. Index, partitioning, replica e sharding risolvono problemi diversi; una cache introduce staleness e invalidation; un dato derivato richiede source, freshness, rebuild e reconciliation.

Infine, lo schema cambia mentre il sistema vive. Le migration devono quindi essere pensate come transizioni fra stati compatibili, con verification, stop condition e rollback quando possibile. Retention, archival e deletion completano il lifecycle: conservare o cancellare è una decisione di prodotto, security, compliance e operability.

L’AI rende economiche molte attività data-heavy — schema, query, index candidate, migration, backfill, refactoring repository-wide — ma non conosce automaticamente consumer esterni, lock behavior, workload reale, replica lag o rischio accettabile. Più il cambiamento diventa facile da produrre, più devono diventare espliciti ownership, invariants, compatibility e evidence.

## Artefatto operativo — Data Ownership Map

L’artefatto del capitolo è la **Data Ownership Map**. Non deve diventare un catalogo di colonne: serve per i dati il cui significato, ownership o lifecycle può cambiare una decisione architetturale.

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
Quali compatibility rule proteggono l’evoluzione?
```

Per Order Operations, il punto raggiunto nel Capitolo 10 è semplice: Orders, Payments & Risk e Shipping mantengono l’autorità sui rispettivi fatti di dominio; Order Operations possiede il caso operativo e le proprie classificazioni/assegnazioni; una futura projection potrà duplicare rappresentazioni senza duplicare autorità.

## Esercizio 1 — Chi possiede davvero il dato?

Un sistema contiene una tabella `customer` usata da CRM, billing, support, marketing e identity. Ogni sistema modifica almeno un campo.

Costruisci una Data Ownership Map. Per ogni concetto significativo identifica semantic owner, authoritative source, copie derivate, consumer e conflitti possibili. Poi chiediti se la tabella condivisa rappresenti davvero un unico dominio o stia nascondendo ownership differenti.

## Esercizio 2 — Scegli il modello, non il prodotto

Per ciascun workload scegli prima un **modello** candidato e motivane i trade-off:

1. order management con transazioni e vincoli;
2. catalogo prodotti con schede molto variabili;
3. rate limiting distribuito;
4. social graph con traversal multi-hop;
5. ricerca full-text su milioni di documenti;
6. telemetria temporale ad alto volume.

Non nominare un vendor nella prima risposta. Parti da access pattern, consistency, relazioni, lifecycle e scale; solo dopo proponi tecnologie concrete.

## Esercizio 3 — L’indice plausibile

Hai questa query:

```sql
SELECT id, order_id, problem_category, detected_at
FROM operations.operational_case
WHERE tenant_id = :tenant
  AND problem_category = :category
ORDER BY detected_at ASC
LIMIT 50;
```

Proponi due index candidate. Per ciascuna spiega quale query favorisce, quale overhead introduce, che cosa misureresti con `EXPLAIN` e runtime metrics e quando la rimuoveresti. L’obiettivo non è indovinare l’indice perfetto, ma trattarlo come una ipotesi verificabile.

## Esercizio 4 — Consistency per journey

Definisci comportamento osservabile e freshness per assignment di un caso, dashboard di management, stato pagamento mostrato a Operations, report mensile e fraud signal usato per bloccare una transazione. Evita formule come “strong consistency” se non specifichi che cosa debba vedere il consumer e quando.

## Esercizio 5 — Replica

Il team propone una read replica per Order Operations. Scrivi un mini ADR che consideri obiettivo, replica lag, read-after-write, failover, monitoring, fallback e costo. Concludi se introdurla ora oppure no.

## Esercizio 6 — Cache senza magia

Progetta una cache-aside per un’API di product catalog. Definisci cache key, TTL, invalidation, miss behavior, comportamento con cache down, stampede protection, metriche e rischio di tenant/data leakage. Poi rispondi alla domanda decisiva: **quale requisito misurato giustifica davvero la cache?**

## Esercizio 7 — Projection di Order Operations

Supponi che il lookup live inizi a sovraccaricare i domain store. Progetta una `ProblematicOrderProjection` indicando campi copiati, source per ogni campo, freshness target, propagation mechanism candidato, reconciliation, rebuild, failure behavior e cutover dal live lookup. Non trasferire ownership a Order Operations per errore.

## Esercizio 8 — Online migration

Una tabella contiene 200 milioni di record e vuoi spostare `shipping_address` in una nuova struttura. Progetta una migration in fasi ispirandoti ai principi discussi nel caso Stripe: expand, eventuale dual write, backfill, compare/read validation, cutover e contract. Per ogni fase definisci stop condition e rollback possibile.

Fonte da leggere:

- [Stripe Engineering — Online migrations at scale](https://stripe.com/blog/online-migrations)

## Esercizio 9 — Retention conflict

Tre stakeholder chiedono cose diverse:

```text
Support: teniamo tutto, ci serve per investigare.
Security: minimizziamo i dati conservati.
Legal: alcuni audit record vanno conservati più a lungo.
```

Costruisci una retention decision separando operational data, audit, PII, analytics e backup. Rendi espliciti compromesso e quality floor.

## Esercizio 10 — AI migration reviewer

Chiedi a un agente AI di preparare una migration su un repository reale o didattico. Usa poi un secondo agente come reviewer con il compito di cercare consumer nascosti, destructive change, lock risk, backfill non resumable, rollback impossibile, perdita di dati, incompatibilità fra versioni e mancata observability.

Il deliverable non è la migration. È la lista delle assunzioni che richiedono verifica umana o evidence.

## Autovalutazione

Prima di chiudere il capitolo dovresti saper spiegare, senza slogan, la differenza tra semantic ownership e storage ownership; perché una source of truth non debba essere fisicamente unica; quando duplicare un dato sia ragionevole; come scegliere un modello partendo dal workload; perché ACID non basti a definire una race condition di business; che cosa distingua index, partitioning, replica e sharding; quali decisioni precedano una cache; perché una migration possa diventare una one-way door; e quali proprietà dei casi Stripe e GitHub siano trasferibili senza copiarne meccanicamente la soluzione.

Dovresti anche saper spiegare il compromesso corrente di Order Operations: ESI accetta per ora maggiore coupling runtime verso i dati autorevoli pur di **non introdurre prematuramente una seconda pipeline di verità**, mantenendo ownership, tenant isolation e correctness come quality floor.

## Corollario

Nel Capitolo 9 abbiamo detto che un’API è una promessa. Ora possiamo completare il pensiero:

> **Ogni promessa sui dati ha bisogno di sapere chi è autorizzato a dire che è vera.**

Nel prossimo capitolo entreremo nei sistemi distribuiti. Quando dati, messaggi e operazioni attraversano processi differenti, failure parziali, retry, ordering ed eventual consistency smettono di essere teoria. Diventano il modo normale in cui il sistema può rompersi.

E ci portiamo dietro una base fondamentale:

> **prima di distribuire il dato, dobbiamo sapere chi ne possiede il significato.**