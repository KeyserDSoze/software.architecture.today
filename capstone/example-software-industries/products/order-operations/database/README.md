# Order Operations — Database

Questa directory contiene le migration e gli artefatti dati del capstone ESI.

## Stato corrente

Il datastore operativo corrente è PostgreSQL.

La scelta è contestuale, non definitiva.

Per ora PostgreSQL ha un buon fit con:

- dati strutturati;
- relazioni;
- assignment concorrente;
- business transaction locale;
- transactional outbox;
- audit futuro;
- query operative note;
- semplicità operativa per il team simulato.

## Regole

1. una migration deve essere reviewable e ripetibile;
2. una migration distruttiva richiede strategia esplicita di compatibility/rollback;
3. backfill significativi non vengono nascosti dentro una migration sincrona senza analisi operativa;
4. gli index devono corrispondere ad access pattern noti e successivamente essere verificati con misure;
5. lo schema `operations` contiene soltanto dati posseduti da Order Operations o stato tecnico necessario a operare le proprie integrazioni;
6. non copiamo dati authoritative di Orders, Payments o Shipping senza una decisione esplicita su propagation, freshness, reconciliation e rebuild;
7. tenant isolation e authorization non vengono considerate risolte soltanto dalla presenza di `tenant_id` nello schema;
8. la outbox non è un event store né un audit log universale;
9. `PaymentEscalation` e relativo `OutboxMessage` devono essere inseriti nello stesso commit locale;
10. retry/republish devono preservare `messageId` e `escalationId`.

## Migration 001

```text
migrations/001_create_operational_case.sql
```

Introduce il primo dato realmente posseduto da Order Operations:

```text
operations.operational_case
```

Non introduce la futura `ProblematicOrderProjection`.

## Migration 002

```text
migrations/002_add_payment_escalation_and_outbox.sql
```

Introduce:

```text
operations.payment_escalation
operations.outbox_message
```

### PaymentEscalation

Contiene l'intenzione locale posseduta da Order Operations:

- escalation identity;
- case relation;
- tenant scope;
- reason code;
- requester;
- request time;
- business state v1;
- delivery state.

Non contiene `PaymentStatus` o provider state.

### OutboxMessage

Contiene stato tecnico necessario a garantire la durability dell'intenzione di pubblicazione:

- stable message identity;
- message type/version;
- aggregate identity;
- correlation;
- payload;
- occurred time;
- publish time;
- attempt count;
- next attempt;
- bounded last error summary.

L'indice partial corrente supporta il polling publisher sui record non ancora pubblicati.

## Failure model dell'outbox

La outbox risolve:

```text
business commit succeeds
+
process crash before publish
```

perché il publish intent è già durable.

Non risolve automaticamente:

```text
broker accepts message
+
publisher loses acknowledgement
+
markPublished never commits
```

In questo caso il messaggio può essere ripubblicato.

Il sistema usa quindi:

```text
at-least-once publication
+ stable messageId
+ stable escalationId
+ idempotent downstream consumer
```

Vedi:

```text
docs/failure-mode-map.md
docs/events/operational-case-payment-escalated-v1.md
```

## Decisioni non ancora prese

- broker/cloud product;
- polling interval e batch size definitivi;
- concurrency/claim strategy con più publisher;
- cleanup/retention dei record published;
- business delivery target;
- DLQ retention;
- CDC al posto del polling;
- partitioning della outbox;
- archivio di audit di lungo periodo.

Queste scelte verranno introdotte soltanto quando il contesto le rende necessarie.

## Fonti

- [PostgreSQL 18 Documentation](https://www.postgresql.org/docs/18/)
- [Microsoft Learn — Transactional Outbox](https://learn.microsoft.com/azure/architecture/databases/guide/transactional-outbox-cosmos)
- [Microsoft Learn — Idempotent Consumer](https://learn.microsoft.com/azure/architecture/patterns/idempotent-consumer)
- [Stripe Engineering — Online migrations at scale](https://stripe.com/blog/online-migrations)
- [GitHub Blog — gh-ost](https://github.blog/news-insights/company-news/gh-ost-github-s-online-migration-tool-for-mysql/)

I casi Stripe e GitHub sono riferimenti metodologici per migration incrementali/online. Le decisioni ESI restano simulate e proporzionate al proprio scenario.