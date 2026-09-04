## Lo schema cambia mentre il sistema vive

Un database di produzione non è un file che possiamo riscrivere liberamente. Contiene dati esistenti, consumer attivi, job, replica, backup, integrazioni e versioni applicative che possono convivere durante un rollout. Una modifica di schema è quindi una migrazione di un sistema vivo, non soltanto DDL.

## Il vero problema è la compatibilità durante la transizione

Rinominare `payment_state` in `payment_status` sembra banale finché guardiamo un solo commit. In produzione potremmo avere contemporaneamente una versione applicativa che legge il vecchio nome, una nuova che legge il nuovo, un background job che scrive ancora il primo e un report che interroga direttamente la colonna precedente.

La migration diventa pericolosa quando assumiamo che tutti cambino nello stesso istante. Per questo molte trasformazioni possono essere rese più sicure separandole in fasi:

```text
EXPAND
introduci la nuova forma senza rompere la precedente

MIGRATE
sposta dati e consumer gradualmente

CONTRACT
rimuovi la forma vecchia quando non serve più
```

Non ogni cambiamento richiede questa sequenza esatta. Il principio è più generale: **le versioni che devono convivere durante il rollout devono essere compatibili abbastanza a lungo da consentire una transizione controllata**.

## Caso reale — Stripe: online migrations at scale

Stripe ha documentato una migrazione di centinaia di milioni di oggetti `Subscription` mantenendo il servizio operativo. La strategia prevedeva una fase in cui vecchio e nuovo modello coesistevano, spostamento graduale dei read path, spostamento dei write path e rimozione della struttura precedente soltanto dopo verifica sufficiente. Stripe ha anche confrontato i due read path per rilevare inconsistenze e ha eseguito il backfill in modo controllato.

Fonte primaria:

- [Stripe Engineering — Online migrations at scale](https://stripe.com/blog/online-migrations)

La lezione non è “usare sempre dual write”. È che una migration rischiosa può essere trasformata in una sequenza di stati osservabili e verificabili, ritardando le one-way door finché non abbiamo abbastanza confidence.

## Dual write: migrazione graduale, non atomicità gratuita

Scrivere contemporaneamente su `old_store` e `new_store` non elimina il rischio. Se una write riesce e l’altra fallisce, nasce una divergenza che deve essere rilevata e corretta. Servono quindi reconciliation, retry, metriche di mismatch, backfill, criteri di cutover e un piano per il rollback.

Il valore del dual write, quando è appropriato, è consentire una transizione graduale. Non trasformare due sistemi indipendenti in una transazione magica.

## Caso reale — GitHub e gh-ost

GitHub ha sviluppato e open-sourced `gh-ost` per eseguire online schema migration su MySQL in modo controllabile e osservabile, riducendo l’impatto di operazioni che altrimenti avrebbero potuto bloccare tabelle in produzione.

Fonte primaria:

- [GitHub Blog — gh-ost: GitHub's online schema migration tool for MySQL](https://github.blog/news-insights/company-news/gh-ost-github-s-online-migration-tool-for-mysql/)

Order Operations non userà necessariamente MySQL né `gh-ost`. Il caso è utile perché mostra un principio trasferibile: **il meccanismo di migration deve essere progettato rispetto al comportamento operativo del datastore e al workload reale**.

## Il backfill è spesso la parte più rischiosa

Aggiungere una colonna può richiedere pochi secondi. Popolare milioni di righe può richiedere ore o giorni e competere con il traffico utente. Batch size, rate limiting, lock contention, replica lag, IO, retry, resumability e idempotenza diventano quindi parte della strategia.

Un agente AI può generare uno script di backfill in pochi secondi. Questo rende ancora più importante distinguere uno **script generato** da una **migration strategy**. Il primo è codice; la seconda è un piano operativo che tiene conto di workload, failure behavior e stop condition.

## Rollback del codice e rollback del dato non coincidono

Se la nuova versione ha già scritto dati che la vecchia non sa interpretare, fare rollback del deploy può non bastare. Prima di una migration significativa dobbiamo sapere se la vecchia versione possa leggere i nuovi dati, se la nuova sappia ancora leggere i vecchi e se una trasformazione abbia perso informazione.

Un cambio distruttivo può trasformare una release normale in una one-way door senza che il diff lo renda evidente.

## Retention: anche cancellare è una decisione architetturale

I dati non devono soltanto nascere e cambiare. Devono essere conservati, archiviati, anonimizzati, cancellati o sottoposti a legal hold secondo esigenze che spesso appartengono a stakeholder differenti.

“Conserviamo tutto per sicurezza” aumenta superficie di esposizione, costo di storage e backup, tempi di restore e difficoltà di deletion. Cancellare troppo presto può invece violare audit, esigenze di business o obblighi contrattuali. La retention è quindi un requisito da decidere con Legal, Security, Product e Data, non un default lasciato al database.

Lo stesso vale per audit e temporal data. History table, audit trail, event log, CDC e temporal table non sono sinonimi. Un audit trail per accountability non diventa automaticamente un event store; un event stream di integrazione non è automaticamente un ledger finanziario. Ancora una volta, la semantica viene prima dello strumento.

## ESI: prepariamo una migration senza inventare la scala

Order Operations introdurrà una tabella propria per `OperationalCase`, perché quel concetto appartiene davvero al suo dominio operativo. Non copieremo ancora automaticamente tutti i dettagli di Orders, Payments e Shipping.

Se in futuro una projection locale diventerà necessaria, la migrazione seguirà una progressione osservabile: introdurre lo storage, avviare la propagation, fare backfill, confrontare live view e projection, spostare gradualmente i read, mantenere un fallback durante il periodo di verifica e rimuovere il vecchio path soltanto dopo evidence sufficiente.

Questa sequenza prende ispirazione dai principi mostrati nei casi reali senza fingere che ESI abbia la scala di Stripe o GitHub.

## AI e migration

L’AI è molto utile per trovare consumer di una colonna, proporre migration candidate, generare backfill, confrontare schema prima/dopo e costruire query di validation. Può anche cercare accessi cross-boundary o modificare centinaia di access path con grande velocità.

Non conosce però automaticamente i dati reali, il lock behavior, la deployment topology, il replica lag, la durata del backfill, i consumer esterni o i vincoli di rollback. Per questo una migration production-safe deve conservare un gate umano sulle decisioni di rischio.

> **L’AI può accelerare una migration. Non può decidere da sola quale finestra di rischio l’azienda sia disposta ad accettare.**

La migration è architettura perché modifica il modo in cui il sistema continua a vivere mentre cambia.