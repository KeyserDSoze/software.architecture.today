# 17.6 — I contratti nascosti: dati, job, workaround e conoscenza operativa

Il codice legacy è spesso soltanto la parte visibile del sistema.

I contratti più pericolosi possono vivere altrove.

## Un contratto può non sembrare un contratto

Abbiamo già visto API ed event contract.

Nel legacy esistono spesso contratti come:

```text
questa colonna non deve mai essere null
questo job deve finire prima delle 02:15
questo CSV deve mantenere l'ordine delle colonne
questo consumer interpreta stringa vuota come "non modificare"
questo report legge direttamente una view
questo campo viene aggiornato manualmente durante incidenti
questo valore viene copiato perché il downstream non può leggere la fonte autorevole
```

Nessuno di questi richiede un file OpenAPI per essere reale.

## Shared database come integration surface

Nel brownfield il database può essere l'API principale fra sistemi.

Esempio:

```text
Legacy App A
  writes customer_case.status

Batch B
  reads status at 01:00

Report C
  joins customer_case directly

Manual Ops Tool D
  updates status during escalation
```

Estrarre `App A` non significa aver migrato la capability.

Dobbiamo capire:

- chi scrive;
- chi legge;
- quali transaction assumption esistono;
- quali consumer fanno query dirette;
- quali indici sono implicitamente parte del workload;
- chi cambia schema;
- quale sistema è realmente authoritative.

## Schema archaeology

Il database conserva spesso anni di compatibilità.

Segnali interessanti:

- colonne con suffix `_old`, `_legacy`, `_v2`;
- flag booleani che sostituiscono state machine;
- stringhe con codici non documentati;
- timestamp nullable con semantica di stato;
- JSON libero dentro schema relazionale;
- duplicate key apparentemente equivalenti;
- trigger con logica business;
- stored procedure con branching;
- tabelle di staging mai eliminate.

Non dobbiamo giudicarli immediatamente.

Dobbiamo capire quali sono ancora parte del comportamento.

## Il valore sentinella

Il legacy ama i valori sentinella.

```text
-1
0
9999
"UNKNOWN"
"N/A"
""
NULL
1970-01-01
```

Il problema non è estetico.

È semantico.

Un nuovo sistema che normalizza ingenuamente questi valori può cambiare il comportamento.

Per esempio:

```text
NULL = mai processato
""   = processato ma nessun risultato
```

Se li trasformiamo entrambi in `undefined`, abbiamo perso una distinzione.

## Scheduled job come workflow engine

Molti sistemi legacy implementano workflow attraverso il tempo.

```text
00:30 import
01:00 enrich
01:30 classify
02:00 export
03:00 reconcile
```

Il dependency graph non è nel codice.

È nel calendario.

Modernizzare uno di questi job richiede capire:

- input completeness;
- retry;
- rerun safety;
- idempotency;
- ordering;
- cutoff business;
- partial-file behavior;
- manual recovery.

Una nuova queue non elimina automaticamente queste semantiche.

## File contract

CSV, XML e fixed-width file sono ancora API.

Un file può avere:

- filename convention;
- directory convention;
- encoding;
- delimiter;
- column ordering;
- header presence;
- timezone;
- decimal separator;
- checksum;
- ack file;
- retry convention;
- duplicate handling.

Cambiare uno di questi dettagli può rompere un consumer che non abbiamo nel repository.

## Il contratto umano

Alcuni sistemi funzionano perché le persone compensano le loro lacune.

Esempio:

```text
sistema genera errore 47
→ operatore apre query SQL salvata
→ controlla tabella X
→ modifica flag Y
→ rilancia job
```

Dal punto di vista del codice questo recovery path non esiste.

Dal punto di vista dell'azienda è parte dell'operabilità corrente.

Modernizzare senza intervistare Operations può eliminare il workaround prima di avere eliminato il failure che lo rende necessario.

## Runbook archaeology

Cerchiamo quindi anche:

- wiki;
- ticket;
- incident timeline;
- Slack/Teams knowledge formalizzata successivamente;
- script personali poi adottati dal team;
- query salvate;
- spreadsheet operativi;
- manual approval;
- on-call note;
- dashboard usate durante incidenti.

Non tutto deve essere preservato.

Ma deve essere compreso prima di essere rimosso.

## Shadow consumer

Uno dei failure mode più comuni della modernization è scoprire un consumer solo dopo il cutover.

Possibili tecniche di discovery:

- DB query log;
- access log;
- API gateway log;
- broker subscription inventory;
- network flow;
- repository search cross-org;
- schema access permission;
- owner interview;
- temporary instrumentation.

Nessuna tecnica singola è completa.

## Data migration è una fase operativa

Una modernization che cambia data model deve gestire almeno:

```text
historical migration
new writes
backfill
validation
cutover
rollback
reconciliation
old writer retirement
```

Il rischio più pericoloso è avere contemporaneamente due sistemi che possono dichiararsi owner dello stesso business fact.

### Dual write ambiguity

```text
legacy write succeeds
new write fails
```

chi ha ragione?

### Backfill race

```text
backfill reads old value
new transaction updates value
backfill writes stale transformed value
```

### Cutover ambiguity

```text
new system live
legacy batch still writes overnight
```

La data migration deve quindi avere un ownership transition plan.

## Compatibility window

Durante la coexistence può essere necessario mantenere una finestra di compatibilità.

Esempio:

```text
new enum
Paid | Failed | Pending

legacy consumer expects
1 | 2 | 9
```

Possiamo mantenere mapping temporaneo.

Ma deve avere:

- owner;
- consumer;
- removal condition;
- test;
- monitoring.

Altrimenti l'adapter temporaneo diventa permanente.

## L'Anti-Corruption Layer deve avere una data policy

Un ACL può tradurre API e DTO.

Ma se copia dati deve anche dichiarare:

- authoritative source;
- freshness;
- retention;
- reconciliation;
- privacy;
- schema evolution;
- delete propagation.

La traduzione semantica senza data governance produce un nuovo shadow database.

## Business rule fuori dal codice

Una regola può essere definita da:

- contratto cliente;
- tariffario;
- SLA;
- normativa;
- processo Finance;
- policy Security;
- manuale operativo.

Se il codice implementa una regola ma nessuno sa da dove provenga, il lavoro non è soltanto reverse engineering.

È **requirement recovery**.

Domande:

```text
Perché esiste?
Chi la richiede?
Da quando?
Per quali tenant/prodotti?
È ancora valida?
Quale evidence la conferma?
```

## ESI: il comportamento che nessuno vuole promettere troppo presto

In Operations Desk Classic troveremo una regola di priority routing che sembra differenziare alcuni casi enterprise.

Il codice la applica.

La characterization suite la osserva.

Ma Order Operations non la inserirà subito nella propria Functional Analysis come requisito.

Prima dobbiamo sapere se è:

```text
contract requirement
current operating policy
compatibility behavior
historical workaround
bug
```

Questa distinzione protegge il nuovo sistema da due errori opposti:

1. perdere un comportamento business necessario;
2. fossilizzare un accidente storico.

> **Nel legacy, ciò che esiste merita indagine. Non automaticamente rispetto.**