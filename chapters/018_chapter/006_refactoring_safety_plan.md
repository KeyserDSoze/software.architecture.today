# 18.6 — Refactoring Safety Plan

Un refactoring significativo dovrebbe poter essere spiegato prima di essere eseguito.

Non in ogni dettaglio di implementazione.

Ma almeno nel suo perimetro di rischio.

Per questo introduciamo il **Refactoring Safety Plan**.

## A cosa serve

Il piano risponde a una domanda semplice:

> **Che cosa deve rimanere vero mentre cambiamo il sistema?**

E a una seconda:

> **Come sapremo abbastanza presto che non lo è più?**

## Template

### 1. Goal

Quale outcome vogliamo ottenere?

Non:

```text
refactor priority code
```

Meglio:

```text
move priority decision capability from Operations Desk Classic
into Order Operations while preserving confirmed behavior
and removing one explicitly obsolete rule.
```

### 2. Scope

Quali componenti possono cambiare?

```text
Order Operations priority boundary
legacy adapter
candidate policy
comparison telemetry
rollout switch
tests/docs
```

### 3. Out of scope

Cosa non tocchiamo ancora?

```text
priority persistence ownership
shared legacy database cleanup
nightly export replacement
public API changes
payment workflow
```

L'out-of-scope è importante quanto lo scope.

### 4. Behavior classification

Ogni behavior legacy rilevante deve essere classificato:

```text
Required
Compatibility
Accidental
Removed by explicit product decision
Unknown
```

Un behavior `Unknown` non dovrebbe essere eliminato silenziosamente.

### 5. Invariants

Esempi:

```text
closed case cannot become actionable priority
manual hold remains visible
payment repeated-failure rule remains urgent
cross-tenant behavior unchanged
candidate path has no external side effect during shadow
```

### 6. Preconditions

Che cosa deve essere vero prima di iniziare?

- characterization suite green;
- owner identificati;
- expected difference approvate;
- telemetry comparison disponibile;
- rollback mode definito;
- nessuna migration dati distruttiva nel primo slice.

### 7. Migration phases

Esempio:

```text
P0 — characterize
P1 — seam
P2 — legacy adapter behind seam
P3 — candidate inactive
P4 — shadow
P5 — selected candidate routing
P6 — candidate default
P7 — remove legacy path
```

### 8. Evidence per fase

Ogni fase deve avere evidence proportionate.

```text
P1
build + existing characterization

P3
candidate unit tests

P4
comparison distribution
unexpected mismatch = 0

P5
business + technical SLI by cohort

P6
stability window
support signal

P7
consumer inventory confirms no legacy caller
```

### 9. Stop conditions

Esempi:

```text
unexpected semantic mismatch
increase in operator manual correction
new authorization failure class
latency over agreed budget
candidate exception not explained
legacy consumer discovered late
reconciliation divergence
```

Una stop condition non è un commento nel runbook.

Deve avere un owner capace di fermare il rollout.

### 10. Fallback / rollback

Dobbiamo specificare:

```text
behavior fallback
artifact rollback
configuration rollback
data rollback
```

se applicabili.

Se un tipo di rollback **non è possibile**, va scritto.

### 11. Point of no return

Quale step trasforma il cambiamento in una one-way door?

Esempi:

- drop dello schema legacy;
- dismissione del job vecchio;
- eliminazione del consumer fallback;
- conversione irreversibile dello stato;
- rimozione dell'ultimo owner operativo legacy.

### 12. Owners

Almeno:

- change owner;
- domain owner;
- operational owner;
- rollback decision owner;
- data owner quando coinvolto.

### 13. Temporary architecture cleanup

Quali cose devono scomparire a fine migrazione?

```text
feature flag
legacy adapter
shadow comparison path
expected-difference registry
compatibility parser
migration-only metrics
```

Se non definiamo questo punto, la struttura temporanea tende a diventare permanente.

## Safety plan ≠ approvazione burocratica

Il piano non serve a creare una riunione in più.

Serve a consentire:

- execution parallela;
- agent delegation;
- review mirata;
- rollout governato;
- decisioni rapide durante un problema.

Un buon piano può stare in poche pagine.

Un piano enorme che nessuno usa non aumenta la safety.

## Risk-weighted detail

Il dettaglio deve crescere con:

```text
blast radius
irreversibility
data sensitivity
consumer count
business impact
uncertainty
```

Un rename locale non richiede lo stesso piano di una migration del ledger finanziario.

## L'AI può scrivere il piano?

Può aiutarci molto.

Dato:

- Legacy Understanding Map;
- Requirements;
- Threat Model;
- Failure Mode Map;
- Testing Strategy;
- repository diff;

un agente può proporre:

- affected boundary;
- invariants candidate;
- risk;
- phase;
- test;
- rollback question;
- stop condition.

Ma alcune decisioni devono essere confermate da chi possiede il rischio.

Per esempio:

```text
Is this behavior obsolete?
Can the business accept this compatibility break?
Who can approve cutover?
What RPO is acceptable?
```

Non sono domande che il repository può risolvere.

## Human approval point

Nel nostro workflow ESI distinguiamo:

```text
AI drafts safety plan
→ technical review
→ domain confirmation
→ execution
```

Per change ad alto impatto possiamo aggiungere Security, Platform o Finance.

Non perché ogni team debba approvare ogni refactoring.

Perché il sistema è il punto di incontro fra più responsabilità aziendali.

## Safety Plan e issue-driven development

Più avanti parleremo di issue-driven development e repository AI-ready.

Il Refactoring Safety Plan è già un buon esempio di contesto che può essere collegato a un work item.

Una issue potrebbe contenere:

```text
Goal
Scope
Safety Plan
Acceptance evidence
Stop condition
Cleanup definition
```

Così un agente non riceve soltanto:

```text
refactor this
```

ma un contratto di execution.

## Definizione di done

Un refactoring non è concluso quando:

```text
candidate = 100%
```

È concluso quando:

- candidate è stabile;
- behavior richiesti sono verificati;
- differenze intenzionali sono confermate;
- old path non serve più;
- flag e adapter temporanei sono rimossi;
- test obsoleti sono puliti;
- documentazione descrive lo stato finale;
- monitoring non dipende da metriche di migrazione ormai inutili.

> **La parte finale di una migrazione è eliminare la migrazione dal sistema.**
