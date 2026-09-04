# 18.4 — Refactoring del codice e migrazione dello stato

Molti refactoring sembrano reversibili finché ignoriamo i dati.

Cambiare una funzione è spesso semplice da annullare.

Cambiare il significato di uno stato persistito può non esserlo.

Per questo dobbiamo distinguere:

```text
code migration
schema migration
state migration
ownership migration
```

Sono lavori diversi.

## Expand, migrate, contract

Quando vecchio e nuovo codice devono convivere, una strategia frequente è:

```text
expand
→ rendere il nuovo modello compatibile con il vecchio

migrate
→ spostare/backfillare/verificare lo stato

contract
→ rimuovere strutture e compatibility path vecchi
```

Il vantaggio è che deploy del codice e trasformazione dei dati non devono accadere nello stesso istante.

Il costo è una fase temporanea in cui il sistema deve comprendere più forme dello stesso dato.

## Dual write: utile, ma non magico

Durante una migrazione potremmo voler scrivere su vecchio e nuovo store.

```text
write
├── legacy
└── target
```

Questo può ridurre il rischio di cutover.

Ma introduce domande:

- quale write è autorevole?
- cosa succede se una riesce e l'altra fallisce?
- come riconciliamo divergence?
- quale store viene letto?
- chi può correggere manualmente?
- quale ordine di switch usiamo?

> **Dual write senza reconciliation è duplicazione del rischio, non riduzione del rischio.**

## Read switch e write switch sono decisioni separate

Un percorso più controllabile può essere:

```text
1. target schema exists
2. target receives mirrored/backfilled state
3. compare old/new data
4. write target while old path remains available
5. switch reads
6. observe
7. stop old writes
8. remove compatibility
9. drop old state only after recovery window
```

L'ordine dipende dal sistema.

Il punto è renderlo esplicito.

## Caso reale: GitHub sposta dati persistenti fuori da Redis

GitHub ha documentato una migrazione di dati persistenti da Redis a MySQL in cui il team:

- valutò il rischio per tipologia di dato;
- introdusse scritture verso MySQL mantenendo quelle su Redis;
- misurò capacity, contention e replication delay;
- copiò i dati;
- cambiò successivamente il read path tramite feature flag;
- rimosse infine i call site verso Redis.

Fonte:

- [GitHub Engineering — Moving persistent data out of Redis](https://github.blog/engineering/infrastructure/moving-persistent-data-out-of-redis/)

Non dobbiamo copiare il dettaglio tecnologico.

Ci interessa la sequenza:

> **scrivere, verificare, cambiare lettura, osservare, rimuovere.**

## Caso reale: migrare la cifratura delle colonne

GitHub ha anche descritto la migrazione incrementale di colonne verso `ActiveRecord::Encryption` usando compatibility behavior, transition di dati e feature flag per controllare il nuovo percorso.

Fonte:

- [GitHub Engineering — How GitHub converts previously encrypted and unencrypted columns to ActiveRecord encrypted columns](https://github.blog/engineering/infrastructure/how-github-converts-previously-encrypted-and-unencrypted-columns-to-activerecord-encrypted-columns/)

Questo caso è particolarmente utile perché mostra che una migrazione può richiedere per un periodo la capacità di leggere più rappresentazioni dello stesso dato.

## Compatibility window

Una migration seria deve dichiarare una finestra di compatibilità.

Esempio:

```text
Phase A
old code reads old schema
new code not active

Phase B
old + new code can read expanded schema

Phase C
new code authoritative
old code still fallback-compatible

Phase D
fallback window expires
old schema removed
```

La compatibilità non deve durare per sempre.

Ma non deve neppure essere rimossa prima che la recovery strategy sia reale.

## One-way door sui dati

Alcune operazioni sono fortemente irreversibili:

- drop di una colonna senza backup;
- reinterpretazione distruttiva di un valore;
- merge di identità non separabili;
- rimozione di provenance;
- cifratura/decrittazione senza recovery key appropriata;
- cambio di ownership senza sync/reconciliation.

Prima di attraversare queste porte chiediamo:

```text
what evidence is enough?
what is the recovery source?
who approves the step?
what is the last reversible checkpoint?
```

## Data migration e shadowing

Per le funzioni pure confrontiamo output.

Per lo stato possiamo confrontare:

```text
row count
business invariant
checksum/aggregate
semantic projection
missing keys
duplicate keys
freshness
reconciliation delta
```

La comparison deve essere semantica.

Due database possono avere lo stesso numero di righe e rappresentare due verità differenti.

## Il caso Operations Desk Classic

Nel Capitolo 18 **non migreremo ancora la priority persistita**.

Il reason è deliberato.

Prima vogliamo rendere la **decision policy** indipendente dal legacy.

Quindi il primo slice sarà:

```text
priority calculation
```

non:

```text
priority persistence ownership
```

Questo mantiene piccolo il blast radius.

Solo quando la nuova policy sarà verificata potremo decidere se:

- Order Operations deve persistere priority;
- la priority deve essere derivata on demand;
- serve uno stato storico/audit;
- il legacy continua temporaneamente a essere writer;
- esiste un consumer che richiede ancora `priority_code`.

> **Prima separiamo la decisione. Poi, se serve, spostiamo lo stato.**

## AI e migration dati

Un agente può accelerare:

- generation di migration;
- backfill script;
- schema diff;
- compatibility adapter;
- reconciliation query;
- test di migration;
- documentazione del cutover.

Ma non dovrebbe autonomamente decidere:

- source of truth;
- perdita dati accettabile;
- point of no return;
- retention;
- compensazione;
- cutover finale.

Perché questi non sono problemi di sintassi SQL.

Sono decisioni di business continuity e ownership.

## Regola

> **Quando un refactoring tocca stato persistente, il rollback deve essere progettato sul dato, non soltanto sul deploy.**
