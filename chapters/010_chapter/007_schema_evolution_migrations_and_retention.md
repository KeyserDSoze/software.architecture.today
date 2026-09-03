## Lo schema cambia mentre il sistema vive

Un database di produzione non è un file che possiamo riscrivere liberamente.

Contiene:

- dati esistenti;
- consumer attivi;
- query concorrenti;
- job;
- replica;
- backup;
- integrazioni;
- versioni applicative che possono convivere durante un rollout.

Quindi una modifica di schema non è soltanto DDL.

È una migrazione di un sistema vivo.

## Il problema della compatibilità temporale

Supponiamo di voler rinominare:

```text
payment_state
```

in:

```text
payment_status
```

Nel repository la modifica sembra banale.

In produzione potremmo avere contemporaneamente:

```text
app version N   → legge payment_state
app version N+1 → legge payment_status
background job  → scrive payment_state
report          → query diretta payment_state
```

Se eliminiamo la colonna troppo presto, una parte del sistema fallisce.

Il problema non è il rename.

È la **compatibilità durante la transizione**.

## Expand, migrate, contract

Un approccio frequente è separare il cambiamento in fasi.

```text
EXPAND
aggiungi la nuova forma senza rompere la vecchia

MIGRATE
sposta dati e consumer gradualmente

CONTRACT
rimuovi la forma precedente quando nessuno la usa più
```

La sequenza riduce il blast radius perché evita di richiedere che tutti i componenti cambino nello stesso istante.

Non ogni migration richiede esattamente questi passi.

Il principio generale è:

> **rendere compatibili le versioni che devono convivere durante il rollout.**

## Caso reale — Stripe: online migrations at scale

Stripe ha documentato una migrazione di centinaia di milioni di oggetti Subscription eseguita mantenendo il servizio operativo.

La strategia descritta seguiva quattro fasi principali:

1. scrivere sia nel vecchio sia nel nuovo modello;
2. spostare gradualmente i read path sul nuovo store;
3. spostare i write path;
4. rimuovere il vecchio modello quando non era più necessario.

Stripe ha anche usato confronti tra i due read path per rilevare inconsistenze durante la transizione, e ha eseguito il backfill in modo controllato invece di tentare una sostituzione istantanea.

Fonte primaria:

- [Stripe Engineering — Online migrations at scale](https://stripe.com/blog/online-migrations)

La lezione non è “fate sempre dual write”.

La lezione è più generale:

> **una migration rischiosa può essere trasformata in una sequenza di stati osservabili e reversibili.**

Ogni fase aumenta confidence prima di eliminare la precedente via d'uscita.

## Dual write non è magia

Il dual write introduce a sua volta problemi.

Se scriviamo:

```text
old_store
new_store
```

che cosa succede se la prima write riesce e la seconda fallisce?

Dobbiamo avere:

- reconciliation;
- retry;
- metriche di mismatch;
- backfill;
- criteri di cutover;
- piano per il rollback.

Il valore del pattern non è ottenere atomicità gratuita.

È permettere una migrazione graduale sapendo che la divergenza deve essere governata.

## Caso reale — GitHub e gh-ost

GitHub ha sviluppato e open-sourced `gh-ost` per eseguire online schema migration su MySQL con un approccio controllabile, osservabile e con basso impatto rispetto a cambiamenti che altrimenti avrebbero potuto bloccare tabelle in produzione.

Fonte primaria:

- [GitHub Blog — gh-ost: GitHub's online schema migration tool for MySQL](https://github.blog/news-insights/company-news/gh-ost-github-s-online-migration-tool-for-mysql/)

Il caso è interessante non perché Order Operations userà MySQL o `gh-ost`.

È interessante perché mostra una proprietà generale:

> **il meccanismo di migration deve essere progettato rispetto al comportamento operativo del datastore e del workload reale.**

La migration è parte dell'operability.

## Backfill

Aggiungere una colonna è spesso la parte facile.

Popolare milioni di righe può essere la parte pericolosa.

Un backfill deve considerare:

- batch size;
- rate limiting;
- lock contention;
- replica lag;
- IO;
- retry;
- resume dopo failure;
- idempotenza;
- priorità rispetto al traffico utente.

Un agente AI può generare uno script di backfill in pochi secondi.

Questo rende ancora più importante non confondere:

```text
script generato
```

con:

```text
migration strategy
```

La seconda richiede conoscenza del workload e del failure behavior.

## Schema migration e rollback

Il rollback di codice non implica automaticamente rollback del database.

Se la nuova versione ha già scritto dati in una forma che la versione precedente non comprende, tornare indietro con il deploy può non essere sufficiente.

Per questo una migration deve chiedere:

```text
La vecchia versione può leggere i nuovi dati?
La nuova versione può leggere i vecchi dati?
Il rollback richiede reverse migration?
Abbiamo modificato semanticamente il dato?
Abbiamo perso informazione?
```

Un cambio distruttivo può trasformare una normale release in una one-way door.

## Retention è architettura

I dati non devono soltanto nascere e cambiare.

Devono anche essere:

- conservati;
- archiviati;
- anonimizzati;
- cancellati;
- eventualmente legal-held.

La retention influenza:

- costo;
- performance;
- partizionamento;
- backup;
- compliance;
- recovery;
- analytics.

“Conserviamo tutto per sicurezza” non è una strategia neutrale.

Più dati conserviamo, più aumentano:

- superficie di esposizione;
- costo di storage e backup;
- tempi di restore;
- difficoltà di deletion;
- data governance.

Allo stesso modo, cancellare troppo presto può violare audit, business need o obblighi contrattuali.

La retention è quindi un requisito da decidere con Legal, Security, Product e Data, non una default del database.

## Temporal data e audit

Quando dobbiamo sapere non soltanto il valore corrente ma **come siamo arrivati lì**, possiamo aver bisogno di:

- audit trail;
- history table;
- immutable event log per specifiche esigenze;
- temporal table;
- change data capture;
- domain event persistiti.

Questi strumenti non sono equivalenti.

Un audit trail per accountability non deve essere automaticamente usato come event store del dominio.

Un event stream per integrazione non è automaticamente un ledger contabile.

Ancora una volta, la semantica viene prima della tecnologia.

## ESI: la prima migration che prepariamo

Order Operations introdurrà una propria tabella per l'ownership operativa dei casi.

Una possibile prima forma:

```text
operational_case
- order_id
- problem_category
- assigned_to
- detected_at
- updated_at
```

Non copieremo ancora tutti i dettagli di Orders, Payments e Shipping.

Se in futuro una projection locale diventerà necessaria, la migration verrà progettata in fasi:

```text
1. introdurre projection storage
2. iniziare propagation
3. backfill
4. confrontare live view e projection
5. spostare gradualmente i read
6. mantenere fallback durante il periodo di verifica
7. rimuovere il vecchio path solo dopo evidenza sufficiente
```

Questa sequenza prende ispirazione dal principio dimostrato nei casi reali, senza fingere che la scala di ESI sia quella di Stripe o GitHub.

## AI e migration

L'AI è particolarmente utile per:

- trovare consumer di una colonna;
- generare candidate migration;
- costruire script di backfill;
- confrontare schema prima/dopo;
- creare query di validation;
- analizzare diff di ORM/model;
- cercare accessi diretti fuori boundary.

Ma il rischio è alto perché può produrre una trasformazione repository-wide molto convincente senza conoscere:

- dati reali;
- lock behavior;
- deployment topology;
- replica lag;
- durata del backfill;
- consumer esterni;
- rollback constraints.

Quindi applicheremo una regola:

> **L'AI può accelerare la migration. Non può decidere da sola quale finestra di rischio l'azienda è disposta ad accettare.**

Una migration production-safe è una decisione architetturale, non una refactor automatica.