# 18.6 — Refactoring Safety Plan

Un refactoring significativo dovrebbe poter essere spiegato **prima** di essere eseguito.

Non serve anticipare ogni dettaglio del codice.

Serve rendere esplicito il perimetro entro cui il cambiamento è autorizzato a muoversi.

Per questo introduciamo il **Refactoring Safety Plan**.

La sua domanda centrale è:

> **Che cosa deve restare vero mentre cambiamo il sistema, quale differenza vogliamo introdurre e quale evidence ci autorizza a passare alla fase successiva?**

## Il piano è una safety envelope, non una checklist

Un buon piano collega:

```text
intent
→ scope
→ invariants
→ phases
→ evidence
→ stop conditions
→ fallback / rollback
→ point of no return
→ cleanup
```

Se una di queste parti manca, possiamo ancora modificare codice.

Abbiamo però meno capacità di governare ciò che succede quando il cambiamento non si comporta come previsto.

## Goal: descrivere l'outcome, non il gesto tecnico

Debole:

```text
refactor priority code
```

Più utile:

```text
move priority decision capability from Operations Desk Classic
into Order Operations,
preserve confirmed behaviors,
remove one explicitly retired legacy rule,
without changing persistence/API ownership in this slice
```

Il goal dice quale responsabilità stiamo trasferendo e quali limiti rendono il primo step deliberatamente più piccolo.

## Scope e out of scope

Per la slice ESI lo scope include:

```text
PriorityPolicy seam
LegacyPriorityAdapter
ConfirmedPriorityPolicy
BranchingPriorityPolicy
shadow comparison
ED-001
tests / docs
```

Restano fuori:

```text
priority persistence ownership
shared legacy DB retirement
nightly export replacement
new public API
manual-hold command
production rollout
legacy deletion
```

L'`out of scope` è importante quanto lo scope.

Impedisce a un refactoring tecnicamente comodo di assorbire nuove decisioni mentre l'agente o il team è già in execution mode.

## Behavior classification prima delle invarianti

Il Safety Plan non può dire “preserva il comportamento” quando sappiamo che una parte del behavior legacy deve cambiare.

Ogni comportamento significativo deve quindi essere classificato:

```text
Required
Compatibility
Accidental
Removed by explicit decision
Unknown
```

`Unknown` non significa “mantienilo per sempre”.

Significa “non eliminarlo silenziosamente dentro questo change”.

Da questa classificazione derivano le invarianti.

Per ESI, per esempio:

```text
Closed stays NotActionable
ManualReview keeps precedence
RepeatedPaymentFailure stays Urgent
Default open case stays Standard
shadow candidate has no external side effect
ED-001 is the only intentional semantic difference
```

## Preconditions: non entrare in execution troppo presto

Prima del primo cambiamento significativo vogliamo almeno:

- characterization suite verde;
- target semantics confermate;
- differenze intenzionali registrate;
- rollback/fallback model definito;
- side effect del candidate compresi;
- nessuna one-way door accidentale nel primo slice.

Prima di un futuro production shadow serviranno inoltre comparison telemetry, performance budget, consumer inventory e un owner con autorità di stop.

Le precondition fanno una cosa importante: separano **“possiamo scriverlo”** da **“siamo pronti a eseguirlo”**.

## Le fasi devono guadagnarsi quella successiva

Per ESI la progressione è:

```text
P0 — characterize
P1 — introduce seam
P2 — route legacy through adapter
P3 — add candidate inactive
P4 — shadow comparison
P5 — controlled candidate routing
P6 — candidate default
P7 — legacy cleanup
P8 — migration architecture cleanup
```

Non tutte le fasi vengono eseguite nel capitolo.

Il Capitolo 18 arriva localmente a P4.

P5 e oltre richiedono runtime evidence che il repository da solo non può produrre.

Questa distinzione protegge il capstone dalla tentazione di dichiarare `Verified` ciò che è soltanto `Designed`.

## Evidence per fase

Ogni step deve avere una domanda falsificabile.

```text
P0
Does legacy characterization reproduce the observed baseline?

P1
Can callers use the seam without behavior change?

P2
Does the adapter reproduce the real legacy calculator semantics?

P3
Does target policy implement confirmed requirements and ED-001?

P4
Can comparison distinguish Match / Expected / Unexpected without changing authority?

P5
Does the candidate remain correct under a controlled runtime cohort?
```

L'evidence cresce con il blast radius.

Non serve un production game day per P1.

Non basta un unit test per P5.

## Stop condition: qualcuno deve poter dire no

Un rollout governato non possiede soltanto metriche.

Possiede condizioni che impediscono di aumentare il blast radius.

Per la priority routing possono includere:

```text
UnexpectedDifference on confirmed rules
manual-hold precedence regression
closed case becomes actionable
payment repeated-failure loses urgency
new authorization/security behavior
candidate exception unexplained
shadow path causes side effect
latency overhead beyond budget
late legacy consumer discovered
```

Una stop condition senza **stop authority** è soltanto documentazione.

Il piano deve dire chi può fermare il rollout anche quando Finance, Product o Engineering desiderano continuare.

## Fallback e rollback devono essere specifici

Il piano deve distinguere:

```text
behavior fallback
artifact rollback
configuration rollback
data rollback
contract rollback
```

Se un tipo non è applicabile o non è possibile, va scritto.

Nel primo slice ESI non esiste data migration, quindi il data rollback non è necessario.

Se in futuro la priority diventerà persisted state, questa sezione dovrà essere ridisegnata **prima** dell'esecuzione.

## Point of no return

Il Safety Plan deve rendere visibile la prima one-way door.

Nel Capitolo 18 non ne attraversiamo nessuna.

Potrebbero comparire più avanti con:

- eliminazione di state legacy ancora consumato;
- rimozione dell'ultimo compatibility path;
- cambio irreversibile del persisted representation;
- dismissione di un job prima della migrazione dei consumer.

Il point of no return non è una proibizione.

È il punto in cui serve un livello superiore di evidence perché il fallback semplice non esiste più.

## Ownership

Per una trasformazione significativa distinguiamo almeno:

```text
change owner
domain owner
operational owner
data owner when relevant
rollback / stop decision owner
```

Un agente può produrre codice e perfino un eccellente report.

Non può essere il proprietario del rischio aziendale.

## Temporary architecture cleanup

La migration architecture deve dichiarare ciò che dovrà scomparire:

```text
feature/routing flag
legacy adapter
shadow comparison path
Expected Difference Registry
compatibility parser
migration-only telemetry
obsolete tests
```

Questo fa parte della Definition of Done.

Un rollout al 100% con flag, adapter e dual path ancora permanenti non è una migrazione finita.

> **La parte finale di una migrazione è eliminare la migrazione dal sistema.**

## Il piano non è un approval theater

Il Safety Plan non serve a creare una riunione in più.

Serve a rendere possibile:

- delegation agli agenti;
- execution parallela entro boundary chiari;
- review mirata;
- rollout progressivo;
- decisioni rapide durante un problema.

Il dettaglio cresce con blast radius, irreversibilità, data sensitivity, numero di consumer e uncertainty.

Un rename locale non richiede lo stesso livello del trasferimento di authority su un ledger.

## L'AI può scrivere il draft, non confermare il significato

Dato Legacy Understanding Map, requirements, Threat Model, Failure Mode Map e Testing Strategy, un agente può proporre scope, invarianti, fasi, test, rollback question e stop condition.

Ma non può ricavare dal repository risposte autorevoli a domande come:

```text
Questo behavior è obsoleto?
Il business accetta la compatibility break?
Chi autorizza il cutover?
Quale perdita dati è accettabile?
```

Il flusso ESI è quindi:

```text
AI drafts
→ technical review
→ domain/risk confirmation
→ execution
```

Per change con impatto diverso possono entrare Security, Platform, Finance o altri owner.

## Dal Safety Plan al work item

Più avanti useremo issue-driven development.

Il Safety Plan è già un esempio del tipo di contesto che rende un work item realmente eseguibile da una persona o da un agente:

```text
Goal
Scope / forbidden scope
Safety Plan
Acceptance evidence
Stop condition
Cleanup definition
```

Questo è molto diverso da:

```text
refactor this module
```

## Definition of Done

Il refactoring non finisce quando il candidate riceve il 100% del traffico.

Finisce quando:

- behavior richiesti sono verificati;
- differenze intenzionali restano deliberate;
- old path non ha più consumer;
- rollback window viene chiusa intenzionalmente;
- migration flag/adapter/comparison sono rimossi;
- test e telemetry temporanei vengono puliti;
- documentazione descrive lo stato finale.

> **Un Safety Plan non promette che il change sia sicuro. Definisce quale evidence deve esistere prima che siamo autorizzati ad aumentare il rischio.**