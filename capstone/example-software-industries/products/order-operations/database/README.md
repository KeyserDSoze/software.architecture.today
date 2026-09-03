# Order Operations — Database

Questa directory contiene le migration e gli artefatti dati del capstone ESI.

## Stato corrente

Il datastore operativo corrente è PostgreSQL.

La scelta è contestuale, non definitiva.

Per ora PostgreSQL ha un buon fit con:

- dati strutturati;
- relazioni;
- assignment concorrente;
- audit futuro;
- query operative note;
- semplicità operativa per il team simulato.

## Regole

1. una migration deve essere reviewable e ripetibile;
2. una migration distruttiva richiede strategia esplicita di compatibility/rollback;
3. backfill significativi non vengono nascosti dentro una migration sincrona senza analisi operativa;
4. gli index devono corrispondere ad access pattern noti e successivamente essere verificati con misure;
5. lo schema `operations` contiene soltanto dati posseduti da Order Operations;
6. non copiamo dati authoritative di Orders, Payments o Shipping senza una decisione esplicita su propagation, freshness, reconciliation e rebuild;
7. tenant isolation e authorization non vengono considerate risolte soltanto dalla presenza di `tenant_id` nello schema.

## Migration corrente

```text
migrations/001_create_operational_case.sql
```

Introduce il primo dato realmente posseduto da Order Operations.

Non introduce ancora la futura `ProblematicOrderProjection`.

## Fonti

- [PostgreSQL 18 Documentation](https://www.postgresql.org/docs/18/)
- [Stripe Engineering — Online migrations at scale](https://stripe.com/blog/online-migrations)
- [GitHub Blog — gh-ost](https://github.blog/news-insights/company-news/gh-ost-github-s-online-migration-tool-for-mysql/)

I casi Stripe e GitHub sono riferimenti metodologici per migration incrementali/online. Il capstone ESI non simula la loro scala.