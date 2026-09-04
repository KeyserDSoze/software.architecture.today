# 17.2 — Ricostruire il sistema che esiste davvero

La modernization sicura comincia con una rappresentazione abbastanza affidabile dello stato corrente.

Non una presentazione elegante.

Non un diagramma che sembra plausibile.

Una mappa che permetta di distinguere ciò che esiste, ciò che deduciamo e ciò che dobbiamo ancora verificare.

## Inventory prima del target

Il primo passo è un inventory.

Non chiediamo ancora:

> Come dovrebbe essere il sistema?

Chiediamo:

> **Che cosa esiste, chi lo usa, da che cosa dipende e quale evidence sostiene ciascuna risposta?**

Microsoft mette l'inventory alla base dell'assessment di modernization e tratta code, configuration, dependency e infrastructure come input della decisione, non come dettagli da scoprire dopo avere già scelto il target.

Riferimenti:

- [Microsoft Learn — Assess your application modernization needs](https://learn.microsoft.com/en-us/azure/app-modernization-guidance/assess/)
- [Microsoft Learn — GitHub Copilot modernization](https://learn.microsoft.com/en-us/azure/developer/github-copilot-app-modernization/overview)

Un inventory minimo può includere:

```text
entry points
runtime / deployable
modules / packages
persistent stores
scheduled jobs
message endpoints
external APIs
identity
configuration sources
feature flags
manual procedures
owners
known consumers
```

L'elenco da solo non basta.

Ogni elemento deve avere provenance e un grado di confidence.

## Seguire un journey, non una directory

Esplorare `controllers/`, `services/`, `repositories/` e `utils/` può aiutare a orientarsi.

Ma la struttura delle cartelle non è il comportamento del prodotto.

Per comprendere una capability conviene partire da un journey concreto.

Per esempio:

```text
operator opens case
→ application loads facts
→ priority is calculated
→ case is assigned
→ notification is emitted
→ nightly export includes the result
```

Seguire il journey ci costringe a vedere insieme codice, dati, side effect, temporal coupling e consumer.

Per ogni tratto vogliamo identificare almeno:

```text
Entry point
che cosa avvia il comportamento?

Decision point
dove viene applicata la regola?

State change
quale stato persistente cambia?

Side effect
che cosa accade fuori dal commit principale?

Consumer
chi dipende dal risultato?

Recovery
che cosa succede se il flow si interrompe?
```

Questa struttura produce una mappa più utile di una call graph isolata.

## Le dependency che il compilatore non vede

Nel legacy una dependency non coincide con un import.

Può vivere in:

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
manual approval
```

Un import è facile da cercare.

Una regola come:

```text
job B assumes job A completed before 02:15
```

può essere molto più pericolosa e non apparire in nessun reference graph del linguaggio.

La code archaeology deve quindi cercare **coupling semantico e operativo**, non soltanto coupling simbolico.

## Il database come documento storico

Nei sistemi legacy il database spesso conserva tracce di decisioni che il codice non racconta più.

Cerchiamo:

- writer e reader reali;
- trigger e stored procedure;
- view usate da sistemi esterni;
- colonne nullable con significato speciale;
- default storici;
- timestamp usati come state machine implicita;
- enum o codici non documentati;
- indici che rivelano workload importanti;
- colonne che nessuno scrive più ma qualcuno potrebbe leggere ancora.

Una colonna apparentemente inutile può essere un contratto.

Prima di rimuoverla dobbiamo sapere chi la considera ancora parte del sistema.

## Static evidence e runtime evidence rispondono a domande diverse

La static analysis ci dice che cosa **può** accadere secondo gli artefatti che vediamo.

La runtime evidence ci aiuta a capire che cosa **accade realmente**.

Fonti utili includono:

```text
trace
structured log
access log
metrics
query history
message telemetry
job execution history
audit log
deployment history
incident timeline
feature-flag exposure
production config diff
```

L'observability del Capitolo 15 cambia qui funzione.

Non serve soltanto durante un incidente.

Diventa uno strumento di archaeology.

Una funzione trovata nel repository è `Found`.

Una trace che mostra quella funzione nel critical journey può promuovere la claim a `Observed`.

Serve ancora una decisione di dominio prima di chiamarla `Confirmed`.

## Git history racconta decisioni, non verità correnti

La storia del repository può aiutarci a capire:

- perché esiste un branch;
- quale incidente ha introdotto un workaround;
- quali file cambiano spesso insieme;
- chi conosceva una certa area;
- se una funzione nasceva come passaggio temporaneo;
- quale issue descriveva la semantica originaria.

`git log`, `git blame`, PR, issue e co-change analysis sono fonti preziose.

Ma anche qui serve disciplina.

`git blame` dice chi ha modificato una riga in passato.

Non dice chi possiede oggi il comportamento.

## Ownership è parte della comprensione

Per una capability legacy dobbiamo distinguere almeno:

```text
code owner
business owner
data owner
runtime owner
incident owner
consumer owner
```

Possono essere team differenti.

GitHub ha descritto pubblicamente l'introduzione di `SERVICEOWNERS` sopra la sola file ownership proprio perché code ownership e service ownership non coincidono necessariamente.

Fonte:

- [GitHub Engineering — How we organize and get things done with SERVICEOWNERS](https://github.blog/engineering/architecture-optimization/how-we-organize-and-get-things-done-with-serviceowners/)

Un sistema senza owner non è soltanto difficile da mantenere.

È difficile da **confermare**: manca qualcuno che possa assumersi la responsabilità del significato.

## L'Evidence Ledger

Per evitare che una spiegazione plausibile diventi documentazione autorevole, ogni claim importante entra in un ledger.

| Claim | Evidence | State | Owner | Missing evidence |
|---|---|---|---|---|
| `PriorityRouter` appare nel flow operator | call site | Found | unknown | runtime trace |
| `Urgent` alimenta nightly export | SQL + batch query | Inferred | Ops Data | execution evidence |
| Enterprise segue una regola diversa | characterization test | Observed | Operations | domain confirmation |
| la regola è ancora richiesta | contract + Product decision | Confirmed | Product | — |

La tabella non serve a creare burocrazia.

Serve a impedire una trasformazione pericolosa:

```text
possible
→ probable
→ documented
→ treated as true
```

senza che nessuna nuova evidence sia stata raccolta.

## La profondità della discovery segue il rischio

Non ogni modifica merita la stessa quantità di archaeology.

La profondità dipende da:

```text
blast radius
reversibility
business criticality
data sensitivity
transaction semantics
number of consumers
current confidence
rollback capability
```

Cambiare una label interna può richiedere poco.

Cambiare un calcolo che influenza pagamento, autorizzazione o reporting può richiedere inventory, characterization, runtime evidence e owner confirmation.

La regola è la stessa del testing risk-driven:

> **spendiamo comprensione dove il costo di una convinzione sbagliata è alto.**

## Ricostruire una Architecture Context Map al contrario

Nel greenfield abbiamo costruito la context map prima dell'implementazione.

Nel brownfield il percorso è inverso:

```text
repository / runtime / data evidence
→ infer boundaries
→ find owners and consumers
→ validate relationships
→ rebuild context map
```

La mappa risultante non descrive ciò che vorremmo avere.

Descrive ciò che abbiamo abbastanza evidence per sostenere oggi.

## AI come acceleratore dell'inventory

Un agente può fare molto bene il primo pass:

```text
list entry points
list DB access
list outbound calls
list queue/topic names
list scheduler definitions
list feature flags
list high fan-in modules
list duplicated rules
```

Ma un output utile deve conservare provenance.

Meglio:

```text
Queue B
Found in: publisher source + config key
State: Found
Consumer: unknown
Runtime traffic: missing
```

che:

> Il sistema usa Queue B per il workflow X.

La seconda frase è più elegante.

La prima è più governabile.

> **Nel legacy, una mappa senza provenance può ridurre il tempo necessario per prendere la decisione sbagliata.**