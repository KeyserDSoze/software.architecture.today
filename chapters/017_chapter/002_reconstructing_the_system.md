# 17.2 — Ricostruire il sistema che esiste davvero

Prima di modernizzare un sistema legacy dobbiamo costruire una rappresentazione affidabile del suo stato corrente.

Non una presentazione elegante.

Una rappresentazione utile a prendere decisioni.

## Inventory prima di intent

Il primo passo è un inventory.

Non chiediamo ancora:

> “Come dovrebbe essere?”

Chiediamo:

> **“Che cosa esiste, chi lo usa e da che cosa dipende?”**

Microsoft mette l'inventory alla base dell'assessment di modernizzazione e tratta code, configuration, dependency e infrastructure come input della decisione, non come dettagli da scoprire dopo avere già scelto il target.

Riferimenti:

- [Microsoft Learn — Assess your application modernization needs](https://learn.microsoft.com/en-us/azure/app-modernization-guidance/assess/)
- [Microsoft Learn — GitHub Copilot modernization](https://learn.microsoft.com/en-us/azure/developer/github-copilot-app-modernization/overview)

Un inventory minimo dovrebbe includere:

```text
entry points
runtime/deployable
module/package
persistent store
scheduled job
message endpoint
external API
identity
configuration source
feature flag
manual procedure
owner/team
known consumer
```

## Partire da un journey

Un errore frequente della code archaeology è esplorare il sistema per directory.

```text
controllers/
services/
repositories/
models/
utils/
```

può essere utile per orientarsi.

Ma il sistema produce valore attraverso journey.

Per esempio:

```text
operator opens case
→ application loads customer/order/payment facts
→ priority is calculated
→ case is assigned
→ notification is emitted
→ nightly report includes the case
```

Seguire questo percorso ci permette di vedere insieme:

- codice;
- dati;
- integrazione;
- temporal coupling;
- ownership;
- side effect;
- operazioni successive.

Un journey è spesso una lente migliore della struttura del repository.

## Entry point e side effect

Per ogni capability che vogliamo comprendere identifichiamo almeno:

### Entry point

Che cosa avvia il comportamento?

- HTTP request;
- queue message;
- cron;
- DB trigger;
- file drop;
- UI action;
- webhook;
- comando manuale.

### Decision point

Dove vengono applicate le regole?

### State change

Quale stato persistente cambia?

### Side effect

Che cosa accade fuori dalla transazione principale?

### Consumer

Chi dipende dal risultato?

### Recovery path

Che cosa succede se il flow fallisce a metà?

Questa struttura è molto più utile di una semplice call graph.

## Il dependency graph che conta

Una dependency non è soltanto un import.

Nel legacy possiamo avere dependency attraverso:

```text
shared table
stored procedure
filesystem path
environment variable
queue name
DNS alias
certificate subject
cron ordering
shared cache key
CSV schema
email subject convention
human approval
```

Queste dipendenze sono spesso più pericolose proprio perché non appaiono in un IDE come riferimento simbolico.

### Dependency visibile

```ts
import { CustomerRepository } from "./customer-repository";
```

### Dependency implicita

```text
job B assumes job A finished before 02:15
```

La seconda può essere più architetturalmente significativa della prima.

## Il database come documento storico

Nei sistemi legacy il database spesso racconta decisioni che il codice non racconta più.

Cerchiamo:

- table owner reale;
- colonne nullable con significato speciale;
- default storici;
- trigger;
- stored procedure;
- view;
- foreign key mancanti intenzionalmente o accidentalmente;
- colonne che nessuno scrive più;
- tabelle lette da sistemi esterni;
- timestamp usati come segnali di workflow;
- campi che contengono enum non documentati.

Una colonna apparentemente inutile può essere un contratto.

Prima di rimuoverla dobbiamo sapere se qualcuno la legge.

## Runtime evidence

Static analysis ci dice ciò che **può** accadere secondo il codice disponibile.

Runtime evidence ci aiuta a capire ciò che **accade realmente**.

Fonti utili:

- trace;
- structured log;
- access log;
- metriche;
- query history;
- message telemetry;
- job execution history;
- audit log;
- deployment history;
- incidenti;
- feature flag exposure;
- production config diff.

L'observability del Capitolo 15 diventa qui strumento di archaeology.

Non osserviamo soltanto per gestire incidenti.

Osserviamo per ricostruire il sistema.

## Git history come evidence organizzativa

La storia del repository può rispondere a domande che il codice corrente non può rispondere.

Per esempio:

- perché esiste questo branch?
- quale incidente ha introdotto questa condizione?
- quali file cambiano spesso insieme?
- chi ha lavorato su questa area?
- questa funzione è ancora attiva o è residuo di una migrazione?
- questo workaround doveva essere temporaneo?

Strumenti come:

```text
git log
git blame
co-change analysis
PR history
issue history
CODEOWNERS / SERVICEOWNERS
```

possono fornire contesto.

Ma anche qui serve cautela.

`git blame` identifica chi ha introdotto una riga.

Non identifica automaticamente chi la possiede oggi.

## Ownership discovery

Un sistema senza owner è difficile da modernizzare anche quando il codice è comprensibile.

Dobbiamo distinguere:

```text
code owner
business owner
data owner
runtime owner
incident owner
consumer owner
```

Possono essere persone o team differenti.

GitHub ha descritto pubblicamente la necessità di introdurre un livello `SERVICEOWNERS` sopra la sola ownership dei file in una codebase ibrida monolite/servizi, proprio perché code ownership e service ownership non coincidono necessariamente.

Fonte:

- [GitHub Engineering — How we organize and get things done with SERVICEOWNERS](https://github.blog/engineering/architecture-optimization/how-we-organize-and-get-things-done-with-serviceowners/)

## Evidence ledger

Per evitare che le ipotesi diventino fatti, introduciamo un piccolo ledger.

| Claim | Evidence | State | Owner | Missing evidence |
|---|---|---|---|---|
| `PriorityRouter` è usato dal flow operator | call site | Found | unknown | runtime trace |
| output `Urgent` alimenta nightly export | SQL + batch query | Inferred | Ops Data | execution evidence |
| enterprise tenant segue regola diversa | characterization test | Observed | Operations | domain confirmation |
| regola è ancora richiesta dal contratto | contract + Product confirmation | Confirmed | Product | — |

Questo è un artefatto di pensiero importante.

## Non tutto merita la stessa profondità

La quantità di archaeology deve essere proporzionata a:

- blast radius;
- reversibilità;
- criticità business;
- data sensitivity;
- transaction semantics;
- numero di consumer;
- confidence corrente;
- possibilità di rollback.

Cambiare una label interna non richiede settimane di discovery.

Cambiare il calcolo che determina un pagamento sì.

## Architecture Context Map inversa

Nel greenfield abbiamo costruito una Architecture Context Map prima dell'implementazione.

Nel brownfield possiamo fare il contrario:

```text
runtime/repository/data evidence
→ infer boundaries
→ validate owners
→ rebuild context map
```

Questa mappa non descrive l'architettura che desideriamo.

Descrive l'architettura che abbiamo abbastanza evidence per affermare.

## Il ruolo dell'AI

Un agente è particolarmente efficace nel primo pass di inventory.

Può produrre:

```text
list entry points
list DB access
list outbound HTTP calls
list queue/topic names
list feature flags
list scheduler definitions
list high fan-in modules
list duplicated rules
```

Ma l'output deve conservare provenance.

Un buon risultato non è:

> “Il sistema usa tre database e due queue.”

È:

```text
Database A
Found in: config/prod.yml + repository adapter
State: Found
Runtime confirmation: missing

Queue B
Found in: publisher source
State: Found
Consumer: unknown
Runtime traffic: missing
```

> **Nel legacy, una mappa senza provenance può rendere più veloce una decisione sbagliata.**