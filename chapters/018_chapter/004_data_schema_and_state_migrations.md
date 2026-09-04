# 18.4 — Refactoring del codice e migrazione dello stato

Molti refactoring sembrano reversibili finché ignoriamo i dati.

Cambiare una funzione può essere semplice da annullare.

Cambiare il significato di uno stato persistito può non esserlo.

Per questo separiamo quattro lavori che spesso vengono compressi nella parola “migrazione”:

```text
code migration
schema migration
state migration
ownership migration
```

Il quarto è il più importante e il più facile da dimenticare.

## Lo schema può convivere; l'authority deve essere chiara

Una strategia frequente durante la coexistence è:

```text
expand
→ aggiungere strutture compatibili

migrate
→ backfillare, sincronizzare e verificare

contract
→ rimuovere il vecchio schema/path
```

Questo disaccoppia il deploy del codice dal momento irreversibile in cui vecchi consumer non possono più funzionare.

Il costo è una finestra in cui più rappresentazioni dello stesso concetto devono convivere.

La domanda decisiva durante quella finestra è:

> **Quale rappresentazione è autorevole in ogni fase?**

## Dual write non crea automaticamente una transizione sicura

Scrivere contemporaneamente vecchio e nuovo store può essere utile.

```text
business write
├── legacy state
└── target state
```

Ma introduce subito casi come:

```text
legacy succeeds
new fails
```

oppure:

```text
new succeeds
legacy times out with unknown outcome
```

Senza una policy per authority, retry, ordering e reconciliation, il dual write non riduce il rischio.

Crea due copie divergenti dello stesso fact.

> **Dual write senza reconciliation è duplicazione del rischio, non riduzione del rischio.**

## Read switch e write switch sono due decisioni diverse

Una migration può procedere con fasi come:

```text
1. target schema exists
2. target receives backfill / mirrored state
3. compare semantic projections
4. target begins receiving authoritative writes
5. switch reads
6. observe
7. stop old writes
8. wait recovery window
9. remove compatibility
10. drop old state
```

L'ordine concreto dipende dal sistema.

Il valore è rendere esplicito che “il nuovo database è popolato” e “il nuovo database è authoritative” non sono la stessa milestone.

## Caso reale — GitHub sposta persistent state fuori da Redis

GitHub ha documentato una migrazione da Redis a MySQL in cui il team introdusse nuove write, misurò capacity e replication behavior, copiò i dati, cambiò successivamente il read path tramite feature flag e soltanto alla fine rimosse i call site legacy.

Fonte:

- [GitHub Engineering — Moving persistent data out of Redis](https://github.blog/engineering/infrastructure/moving-persistent-data-out-of-redis/)

Il dettaglio tecnologico non è la lezione principale.

Ci interessa la sequenza:

```text
write
→ verify
→ switch reads
→ observe
→ remove
```

La rimozione arriva dopo l'evidence, non insieme al primo deploy del nuovo store.

## Caso reale — migrazione della cifratura delle colonne

GitHub ha anche descritto la conversione incrementale di colonne verso `ActiveRecord::Encryption`, mantenendo temporaneamente compatibility behavior e controllando il nuovo path con feature flag.

Fonte:

- [GitHub Engineering — How GitHub converts previously encrypted and unencrypted columns to ActiveRecord encrypted columns](https://github.blog/engineering/infrastructure/how-github-converts-previously-encrypted-and-unencrypted-columns-to-activerecord-encrypted-columns/)

Il caso mostra bene un principio generale:

> **durante una migration, la capacità temporanea di leggere più rappresentazioni può essere una feature di recovery, non soltanto debito tecnico.**

Ma quella compatibility window deve avere una scadenza.

## La compatibility window è una recovery capability temporanea

Possiamo descrivere fasi come:

```text
Phase A
old code + old representation

Phase B
old and new code understand expanded representation

Phase C
new representation authoritative
old code still fallback-compatible

Phase D
fallback window intentionally closed
old representation removed
```

La compatibilità non deve durare per sempre.

Ma rimuoverla troppo presto può distruggere proprio il rollback che il rollout plan promette.

## I dati introducono one-way door reali

Alcune operazioni riducono drasticamente la reversibilità:

- drop di una colonna non più ricostruibile;
- merge di identità che non possono essere separate;
- perdita di provenance;
- reinterpretazione distruttiva di valori storici;
- rimozione di compatibility prima della fine del rollback window;
- cambio di owner senza reconciliation.

Prima di attraversarle chiediamo:

```text
qual è l'ultima copia autorevole recuperabile?
quale evidence autorizza il passo?
chi approva la perdita di reversibilità?
qual è l'ultimo checkpoint two-way?
```

Una migration dati è quindi anche una sequenza di **porte che si chiudono**.

## La comparison dello stato deve essere semantica

Contare le righe può essere utile.

Non basta.

Per confrontare due rappresentazioni vogliamo invariant e projection come:

```text
business key coverage
missing / duplicate keys
semantic state equivalence
aggregate totals
freshness
reconciliation delta
history/provenance preservation
```

Due store possono avere esattamente lo stesso row count e rappresentare due verità business differenti.

La verification deve quindi derivare dal Data Ownership Map e dai business invariant, non soltanto dal database engine.

## ESI: nel primo slice non tocchiamo la persistence della priority

Questa è una decisione deliberata del Capitolo 18.

Prima separiamo:

```text
priority decision
```

da:

```text
priority persistence ownership
```

Il primo slice crea e verifica la nuova policy senza modificare schema, writer o API.

Questo mantiene il blast radius molto più piccolo.

Solo dopo runtime evidence e consumer discovery potremo decidere se Order Operations debba:

- derivare la priority on demand;
- persisterla;
- conservare history/audit;
- diventare authoritative writer;
- mantenere una compatibility window per `priority_code`.

> **Prima separiamo la decisione. Poi, se il prodotto lo richiede, spostiamo lo stato.**

## L'AI può generare migration code, non decidere ownership

Un agente può produrre schema diff, migration, backfill, reconciliation query e test in modo molto efficiente.

Non dovrebbe autonomamente decidere:

```text
source of truth
acceptable data loss
retention
cutover authority
point of no return
compensation semantics
```

Queste non sono scelte di sintassi SQL.

Sono decisioni di continuità operativa e significato del dato.

## Regola

> **Quando un refactoring tocca stato persistente, il rollback deve essere progettato sul significato e sull'authority del dato, non soltanto sull'artifact che lo legge.**