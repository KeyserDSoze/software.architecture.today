# 18.7 — ESI: classificare prima di migrare

La Legacy Understanding Map del Capitolo 17 ci ha lasciato sei behavior `Observed`.

Ora dobbiamo compiere un passaggio che nessun refactoring automatico può decidere da solo:

> **quali di quei behavior meritano di diventare semantica target?**

ESI svolge quindi un workshop simulato con Operations, Product, Payments & Risk, Sales e Order Operations.

Lo scopo non è disegnare una classe TypeScript.

È separare ciò che il legacy **fa** da ciò che il nuovo prodotto **deve fare**.

> **La classificazione seguente appartiene allo scenario fittizio ESI.**

## LB-01 — Closed case

Legacy osservato:

```text
status_code = CLOSED
→ NONE
```

Operations conferma che un case chiuso non deve rientrare nella coda operativa.

Classificazione:

```text
Required
```

Semantica target:

```text
Closed
→ NotActionable
```

Preserviamo il significato, non la stringa legacy `NONE`.

## LB-02 — Manual hold

Legacy osservato:

```text
manual_hold = 1
→ MANUAL_REVIEW
```

Operations conferma che il flag rappresenta una sospensione del routing automatico che richiede attenzione umana.

Classificazione:

```text
Required behavior
Compatibility naming only
```

Nel target diventa:

```text
ManualReview
```

Durante la coexistence l'adapter continuerà a conoscere `MANUAL_REVIEW` dove il legacy contract lo richiede.

## LB-03 — Repeated payment failure

Legacy osservato:

```text
problem_code = PAY
failed_attempts >= 3
→ URGENT
```

Payments & Risk conferma, nello scenario ESI, che ripetuti failure di pagamento rappresentano una condizione operativa ad alta priorità.

Classificazione:

```text
Required
```

Semantica target:

```text
Payment
+ failedAttempts >= 3
→ Urgent
```

La soglia `3` resta una policy simulata corrente, ma deve diventare leggibile e testabile invece di rimanere un magic number disperso.

## LB-04 — Enterprise timer

Legacy osservato:

```text
customer_tier = ENTERPRISE
AND age >= 30m
→ URGENT
```

Questo era l'unknown più importante del Capitolo 17.

Nel workshop simulato Sales ricostruisce l'origine della regola e Product/Operations decidono che non rappresenta più un impegno o una policy che il target debba mantenere.

Classificazione:

```text
Removed by explicit ESI product decision
```

Questa non è una regressione da correggere.

È una **differenza intenzionale**.

Il candidate deve quindi poter produrre:

```text
legacy = Urgent
candidate = Standard
```

quando nessun'altra regola confermata si applica.

La differenza viene registrata **prima** dello shadow rollout come:

```text
ExpectedDifference
ID = ED-001
```

Zero mismatch, in questo caso, sarebbe il risultato sbagliato: significherebbe che abbiamo accidentalmente conservato proprio il comportamento che ESI ha deciso di rimuovere.

## LB-05 — Enterprise prima del threshold

Legacy osservato:

```text
Enterprise before 30m
→ STANDARD
```

Una volta eliminata la specializzazione LB-04, questo non è un requirement autonomo.

Classificazione:

```text
Compatibility observation
not an independent target rule
```

Il target ricade semplicemente nella default policy, salvo altre condizioni più forti.

## LB-06 — Ordinary open case

Legacy osservato:

```text
ordinary open case
→ STANDARD
```

Product e Operations confermano che un case aperto senza condizioni speciali rimane nella priorità standard.

Classificazione:

```text
Required default
```

Semantica target:

```text
otherwise
→ Standard
```

## La precedence smette di essere un accidente del codice

Nel legacy la precedence era incorporata nell'ordine degli `if`.

Dopo il workshop ESI la rende esplicita:

```text
Closed
> ManualReview
> RepeatedPaymentFailure
> Standard
```

La vecchia Enterprise timer rule esce dal modello.

Questa è una trasformazione importante: ciò che prima era una proprietà accidentale dell'implementazione diventa una decisione leggibile del dominio.

## Il target possiede un proprio vocabolario

Operations Desk Classic usa:

```text
NONE
MANUAL_REVIEW
URGENT
STANDARD
```

Order Operations usa:

```text
NotActionable
ManualReview
Urgent
Standard
```

Il `LegacyPriorityAdapter` possiede il mapping.

Questo impedisce alla compatibility surface di diventare il linguaggio permanente del nuovo dominio.

## ED-001 viene autorizzata prima della comparison

Il registry contiene:

```text
ID
ED-001

Legacy
Enterprise + age >= 30m → Urgent

Target
customer tier alone does not raise priority
→ Standard unless another confirmed rule applies

Owner
Product + Operations

Reason
historical enterprise timer retired in ESI scenario

Cleanup
remove when legacy priority path and comparison are retired
```

La comparison runtime potrà quindi distinguere:

```text
Match
ExpectedDifference ED-001
UnexpectedDifference
```

Se un mismatch non corrisponde esattamente a ED-001, resta inatteso finché qualcuno non prende una nuova decisione.

## Ciò che resta deliberatamente fuori scope

Avere finalmente semantica target confermata non significa dover risolvere l'intero legacy nello stesso slice.

Restano fuori:

### Priority persistence

Non decidiamo ancora se Order Operations debba persistere la priority o derivarla on demand.

### Nightly export

Il consumer legacy ipotizzato non viene ancora sostituito.

### Manual override command

Abbiamo confermato il significato di `manual hold`, non progettato la capability target per modificarlo.

### Shared database retirement

Resta fuori dal Capitolo 18.

Questa disciplina evita che un workshop di semantica diventi il pretesto per una migration dati e contract non ancora necessaria.

## Il piano di migrazione

Con le decisioni confermate, la sequenza diventa:

```text
P0 — characterization complete
P1 — PriorityPolicy seam
P2 — LegacyPriorityAdapter
P3 — ConfirmedPriorityPolicy inactive
P4 — shadow comparison
P5 — controlled candidate routing
P6 — candidate default
P7 — legacy caller cleanup
P8 — legacy path retirement
P9 — migration architecture cleanup
```

Nel Capitolo 18 arriviamo localmente fino a **P4**.

Non simuleremo P5–P9 come se possedessimo runtime production, consumer inventory e rollout evidence che il capstone non ha eseguito.

## Gate futuro da shadow ad authority

Prima che il candidate diventi authoritative richiederemo almeno:

```text
all Required behaviors verified
ED-001 is the only known intentional mismatch
no unexplained mismatch class
candidate shadow creates no external side effect
legacy behavior fallback available
consumer inventory reviewed
```

Il gate non promette perfezione.

Impedisce però che una differenza sconosciuta venga trasformata in produzione soltanto perché il candidate è tecnicamente pronto.

## La lezione della classificazione

La characterization suite ci ha detto:

```text
what the old system does
```

Il workshop ESI ci dice:

```text
what the target system is allowed to mean
```

Sono due forme di evidence differenti.

Una modernization sicura ha bisogno di entrambe.

> **Il characterization test protegge la conoscenza del passato. La decisione di dominio stabilisce quale parte di quel passato merita di diventare futuro.**