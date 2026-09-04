# 18.7 — ESI: classificare prima di migrare

La Legacy Understanding Map del Capitolo 17 conteneva sei behavior osservati.

Fino a questo momento avevano tutti una caratteristica comune:

```text
Observed
```

ma non necessariamente:

```text
Confirmed requirement
```

Ora ESI svolge un workshop simulato con:

- Operations;
- Product;
- Payments & Risk;
- Sales;
- Order Operations team.

Lo scopo non è disegnare la nuova classe TypeScript.

È decidere **quale significato merita di sopravvivere**.

> **La seguente classificazione è parte dello scenario fittizio ESI, non un caso reale.**

## LB-01 — Closed case → NONE

Behavior osservato:

```text
status_code = CLOSED
→ NONE
```

Operations conferma che un case già chiuso non deve essere rimesso nella coda di priorità operativa.

Classificazione:

```text
Required
```

Target semantics:

```text
Closed
→ NotActionable
```

Notiamo già una cosa.

Confermiamo **il significato**, non necessariamente il codice stringa `NONE`.

## LB-02 — Manual hold → MANUAL_REVIEW

Behavior osservato:

```text
manual_hold = 1
→ MANUAL_REVIEW
```

Operations spiega che il flag viene usato quando un caso non deve proseguire nel normale routing automatico e richiede attenzione umana.

Classificazione:

```text
Required behavior
Compatibility naming
```

Il target può usare un termine più chiaro:

```text
ManualReview
```

ma durante la coexistence dobbiamo mantenere mapping verso `MANUAL_REVIEW` dove il legacy contract lo richiede.

## LB-03 — Payment + failed attempts >= 3 → URGENT

Behavior osservato:

```text
problem_code = PAY
failed_attempts >= 3
→ URGENT
```

Payments & Risk conferma, nello scenario, che ripetuti failure di pagamento rappresentano un segnale operativo sufficientemente forte da richiedere priorità alta.

Classificazione:

```text
Required
```

Ma emerge una domanda:

> `3` deve rimanere una costante hard-coded?

La risposta è no.

La soglia è confermata come policy corrente, ma deve diventare una decisione leggibile e testabile, non un magic number disperso.

## LB-04 — Enterprise + age >= 30 minuti → URGENT

Questo è il behavior più interessante.

Nel legacy:

```text
customer_tier = ENTERPRISE
age >= 30m
→ URGENT
```

Durante il workshop simulato, Sales ricostruisce l'origine della regola: era legata a una vecchia gestione operativa dei clienti enterprise e non rappresenta più un impegno contrattuale attuale.

Operations conferma inoltre che la priority corrente viene già influenzata da segnali più specifici.

Classificazione:

```text
Removed by explicit product decision
```

Questa è una **differenza intenzionale**.

La nuova policy dovrà quindi produrre:

```text
legacy = URGENT
candidate = STANDARD
```

per questi casi, e lo shadow comparison dovrà registrarla come:

```text
ExpectedDifference
ID = ED-001
```

Non dobbiamo “aggiustare” il candidate per raggiungere zero mismatch.

Zero mismatch sarebbe sbagliato.

## LB-05 — Enterprise prima dei 30 minuti → STANDARD

Questo behavior è una conseguenza della vecchia regola LB-04.

Una volta rimossa la specializzazione enterprise, il comportamento target diventa semplicemente quello della default policy salvo altre regole applicabili.

Classificazione:

```text
Compatibility observation
not an independent requirement
```

## LB-06 — Ordinary open case → STANDARD

Product e Operations confermano che un case aperto senza condizioni speciali resta nella priorità standard.

Classificazione:

```text
Required default
```

## Precedence confermata

Il legacy conteneva una precedence implicita nell'ordine degli `if`.

Il workshop la rende esplicita per i behavior che restano:

```text
Closed
> ManualReview
> RepeatedPaymentFailure
> Standard
```

La vecchia regola enterprise esce dalla precedence.

Questo è un miglioramento importante.

La precedence non è più una proprietà accidentale dell'ordine del codice.

Diventa una decisione del modello.

## Nuovo vocabolario target

Operations Desk Classic usa:

```text
NONE
MANUAL_REVIEW
URGENT
STANDARD
```

Order Operations può adottare:

```text
NotActionable
ManualReview
Urgent
Standard
```

Il mapping legacy rimane responsabilità dell'adapter.

Questo impedisce al nuovo dominio di ereditare automaticamente naming storico.

## Expected Difference ED-001

Registriamo prima del rollout:

```text
ID: ED-001
Legacy:
  Enterprise + age >= 30m → URGENT
Target:
  no enterprise-only priority escalation
Expected candidate result:
  STANDARD, unless another confirmed rule applies
Owner:
  Product + Operations
Reason:
  legacy enterprise timer explicitly retired in ESI scenario
Removal condition:
  legacy priority path retired
```

La comparison telemetry può quindi distinguere:

```text
match
expected mismatch ED-001
unexpected mismatch
```

## Cosa non abbiamo ancora deciso

Nonostante il workshop, alcuni temi restano fuori dal slice.

### Priority persistence

Non decidiamo ancora se Order Operations deve persistere il risultato della policy.

### Nightly export

Non abbiamo ancora sostituito il consumer legacy ipotizzato.

### Manual override workflow

Abbiamo confermato il significato del manual hold, ma non abbiamo ancora progettato un nuovo command/API per modificarlo.

### Shared database retirement

Fuori scope.

Questo è importante.

Una buona discovery non obbliga a risolvere tutto nel primo refactoring.

## Il piano ESI

La migration slice diventa:

```text
P0  characterization complete
P1  PriorityPolicy seam
P2  LegacyPriorityAdapter
P3  ConfirmedPriorityPolicy inactive
P4  ShadowPriorityPolicy
P5  comparison evidence
P6  candidate routing in controlled cohort
P7  candidate default
P8  legacy caller cleanup
P9  remove migration structure
```

Nel Capitolo 18 implementiamo fino a:

```text
P4
```

più test/evidence locale.

Non simuleremo un rollout production che non possiamo osservare davvero.

## Quality floor del cutover futuro

Per passare da shadow a candidate authoritative richiediamo almeno:

```text
all Required behaviors verified
ED-001 only known semantic mismatch
no unexplained mismatch class
no new side effect in shadow path
rollback to legacy routing available
consumer inventory reviewed
```

## Una lezione importante

Abbiamo appena fatto qualcosa che un refactoring puramente tecnico non avrebbe potuto fare.

Abbiamo deciso che:

```text
one old behavior must be preserved
```

e contemporaneamente che:

```text
another old behavior must disappear
```

Nessun test legacy, da solo, avrebbe potuto dirci quale dei due.

> **Il characterization test protegge la conoscenza. Il domain decision decide che cosa farne.**
