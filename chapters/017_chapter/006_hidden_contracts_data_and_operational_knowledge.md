# 17.6 — I contratti nascosti: dati, job e conoscenza operativa

Il codice legacy è spesso soltanto la parte più visibile del sistema.

I contratti più pericolosi possono vivere altrove.

Una modernization fallisce quando cambia un comportamento che nessuno aveva riconosciuto come contratto.

## Un contratto non deve avere una specifica per essere reale

Nel legacy possiamo trovare promesse come:

```text
questa colonna non deve mai essere NULL
questo job deve finire prima delle 02:15
questo CSV deve mantenere l'ordine delle colonne
stringa vuota significa "non modificare"
questo report legge direttamente una view
questo flag viene cambiato manualmente durante un incidente
questo valore è duplicato perché il downstream non può leggere la fonte autorevole
```

Nessuna di queste regole richiede OpenAPI o AsyncAPI per avere conseguenze reali.

Se un consumer, un operatore o un processo dipende dal comportamento, abbiamo una compatibility surface che la modernization deve almeno comprendere.

## Nel brownfield il database può essere l'API principale

Immaginiamo:

```text
Legacy App A
→ writes customer_case.status

Batch B
→ reads it at 01:00

Report C
→ joins the table directly

Ops Tool D
→ changes it during escalation
```

Estrarre `App A` non significa aver migrato la capability.

Il vero boundary comprende writer, reader, transaction assumption, query dirette, schema ownership e procedure manuali.

Prima di cambiare ownership dobbiamo quindi sapere:

```text
chi scrive?
chi legge?
chi cambia schema?
chi dipende da timing/index/trigger?
chi considera quel dato autorevole?
```

## Schema archaeology: i dettagli strani possono essere semantica

Colonne `_old`, `_legacy`, `_v2`, booleani usati come state machine, timestamp nullable, codici stringa e tabelle di staging mai eliminate sembrano facilmente “sporcizia”.

A volte lo sono.

A volte rappresentano anni di compatibilità.

Lo stesso vale per i valori sentinella:

```text
-1
0
9999
UNKNOWN
N/A
""
NULL
1970-01-01
```

Il problema non è estetico.

È distinguere significati che il nuovo modello potrebbe accidentalmente collassare.

Per esempio:

```text
NULL
→ mai processato

""
→ processato ma senza risultato
```

Normalizzarli entrambi a `undefined` può cambiare il workflow.

Prima della pulizia serve requirement recovery.

## Il tempo può essere il workflow engine

Molti sistemi legacy coordinano processi tramite scheduler:

```text
00:30 import
01:00 enrich
01:30 classify
02:00 export
03:00 reconcile
```

Il dependency graph non è nel source code.

È nel calendario.

Per ciascun job dobbiamo capire:

```text
input completeness
ordering
rerun safety
idempotency
retry
cutoff business
partial result behavior
manual recovery
```

Sostituire un job con una queue non elimina automaticamente queste semantiche.

Può soltanto cambiare il meccanismo con cui devono essere garantite.

## File, naming convention e mailbox sono API

CSV, XML, fixed-width file, directory e filename convention possono essere contratti inter-system.

Un consumer può dipendere da:

- encoding;
- delimiter;
- column order;
- timezone;
- decimal separator;
- checksum;
- ack file;
- duplicate handling;
- naming pattern.

Il consumer potrebbe non essere nel repository e potrebbe non avere un owner evidente.

Per questo la discovery dei consumer deve combinare repository search, access/query log, broker inventory, permission, network evidence e interviste.

Nessuna tecnica singola offre una garanzia completa.

## Le persone possono essere parte del recovery path

Un sistema può “funzionare” perché Operations compensa manualmente le sue lacune.

Per esempio:

```text
error 47
→ operator runs saved query
→ checks table X
→ changes flag Y
→ reruns job
```

Dal punto di vista del codice questo comportamento non esiste.

Dal punto di vista operativo è un runbook reale.

Se la modernization elimina il workaround prima di eliminare il failure che lo rende necessario, ha ridotto la recoverability.

Per questo cerchiamo anche:

```text
wiki
incident timeline
ticket
saved query
personal/team script
spreadsheet
manual approval
on-call notes
dashboard used during incidents
```

Queste fonti non sono automaticamente requisiti da preservare.

Sono evidence di come il sistema viene realmente mantenuto in vita.

## Data migration significa trasferire authority

Quando cambia il data model, il problema non è soltanto copiare record.

Dobbiamo governare:

```text
historical migration
new writes
backfill
validation
coexistence
cutover
rollback
reconciliation
old writer retirement
```

Il failure mode più pericoloso è avere due sistemi che possono entrambi dichiararsi authoritative per lo stesso business fact.

### Dual-write ambiguity

```text
legacy write succeeds
new write fails
```

Quale stato è vero?

### Backfill race

```text
backfill reads old value
new transaction updates source
backfill writes stale transformed value
```

### Cutover ambiguity

```text
new path is live
legacy batch writes again overnight
```

Questi non sono “edge case di migrazione”.

Sono problemi di ownership.

La data migration deve quindi possedere un **ownership transition plan**.

## La compatibility window deve avere una fine

Durante coexistence possiamo dover tradurre temporaneamente:

```text
new enum
Paid | Failed | Pending

legacy expectation
1 | 2 | 9
```

Il mapping può essere giusto.

Ma deve avere:

```text
consumer
owner
test
monitoring
removal condition
```

Altrimenti l'adapter temporaneo diventa il nuovo contratto permanente senza una decisione esplicita.

Lo stesso vale per un Anti-Corruption Layer che replica dati: deve dichiarare source autorevole, freshness, retention, reconciliation, privacy, delete propagation e schema evolution.

Tradurre DTO senza una data policy può creare un nuovo shadow database.

## Quando la regola non ha provenance facciamo requirement recovery

Una business rule può provenire da:

- contratto cliente;
- tariffario;
- SLA;
- normativa;
- policy Finance;
- processo Operations;
- decisione Security;
- workaround storico.

Se il codice applica una regola ma nessuno sa più perché, non stiamo semplicemente facendo reverse engineering.

Stiamo facendo **requirement recovery**.

Le domande diventano:

```text
Perché esiste?
Chi la richiede?
Per quali utenti/tenant/prodotti?
Da quando?
È ancora valida?
Quale evidence la conferma?
```

## ESI: la priority rule che non vogliamo promuovere troppo presto

In Operations Desk Classic troviamo una regola che alza la priority di alcuni case Enterprise dopo un threshold temporale.

Il codice esiste.

La characterization suite osserva il comportamento.

Questo non basta per inserirlo nella Functional Analysis di Order Operations.

Prima dobbiamo capire se siamo davanti a:

```text
contract requirement
current operating policy
compatibility behavior
historical workaround
bug
```

Promuovere immediatamente il behavior a requisito rischierebbe di fossilizzare accidental complexity.

Ignorarlo perché “sembra strano” rischierebbe invece di eliminare un comportamento ancora necessario.

Questo è il punto in cui `Found / Inferred / Observed / Confirmed` smette di essere una tassonomia editoriale e diventa una regola di decisione.

> **Nel legacy, ciò che esiste merita investigation. Non merita automaticamente di sopravvivere, ma non può essere cancellato con leggerezza finché non ne comprendiamo le conseguenze.**