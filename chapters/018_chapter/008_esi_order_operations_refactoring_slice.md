# 18.8 — ESI: il primo refactoring slice di Order Operations

Ora il piano diventa codice.

Ma soltanto fino al punto che possiamo verificare senza inventare evidence production.

Questo limite è parte dell'architettura del capstone: **non promuoviamo una claim perché sappiamo come implementarla; la promuoviamo quando abbiamo eseguito il tipo di verifica che quella claim richiede.**

## Stato iniziale

Operations Desk Classic possiede:

```text
calculatePriority(row, now)
```

protetto dalla characterization suite `LB-01…LB-06`.

Order Operations non possiede ancora una propria priority policy.

Dopo il workshop del paragrafo precedente sappiamo però quali behavior il target deve preservare e quale differenza deve introdurre intenzionalmente.

È abbastanza per il primo slice.

## Scope: separare la decisione senza muovere lo stato

Introduciamo:

```text
PriorityPolicy
LegacyPriorityAdapter
ConfirmedPriorityPolicy
BranchingPriorityPolicy
```

Non facciamo:

```text
legacy deletion
database/schema migration
public API change
priority persistence ownership change
production rollout
```

Questa scelta mantiene il primo incremento interamente prima della one-way door.

Se qualcosa non funziona, possiamo ancora rimuovere il nuovo path senza dover ricostruire dati o consumer.

## Il target model parla il linguaggio di Order Operations

Il boundary usa concetti come:

```text
CasePriorityInput
Priority
PriorityDecision
```

Non espone `status_code`, `problem_code` o gli altri nomi della rappresentazione legacy.

Questa distinzione non è cosmetica.

Se il nuovo dominio usa direttamente il modello storico, il legacy è stato copiato invece di essere isolato.

## ConfirmedPriorityPolicy traduce la decisione funzionale in codice

La target policy implementa la precedence confermata:

```text
Closed
→ NotActionable

manualHold
→ ManualReview

Payment + failedAttempts >= 3
→ Urgent

otherwise
→ Standard
```

Non contiene:

```text
Enterprise + age >= 30m
```

perché quella regola è stata esplicitamente ritirata tramite ED-001.

Questo è un punto importante: `ConfirmedPriorityPolicy` non è una riscrittura più elegante del legacy calculator.

È un'implementazione della **semantica confermata**.

## LegacyPriorityAdapter mantiene la compatibilità fuori dal target model

L'adapter converte input target verso la forma richiesta dal legacy:

```text
status          → status_code
manualHold      → manual_hold
problemCategory → problem_code
failedAttempts  → failed_attempts
customerTier    → customer_tier
createdAt       → created_at
```

e converte output legacy verso il vocabolario target:

```text
NONE          → NotActionable
MANUAL_REVIEW → ManualReview
URGENT        → Urgent
STANDARD      → Standard
```

La traduzione resta confinata nel boundary.

Il resto di Order Operations non deve conoscere quelle stringhe.

## Perché il legacy calculator è una dependency esplicita

Il codice TypeScript di Order Operations non importa direttamente come proprio dominio il file CommonJS di Operations Desk Classic.

L'adapter dipende invece da un contratto:

```text
LegacyPriorityCalculator
```

Questo permette alla composition di decidere come raggiungere il legacy durante le diverse fasi.

Nel test locale possiamo iniettare la vera `calculatePriority` del capstone legacy.

In una eventuale integrazione futura il boundary potrebbe diventare un wrapper o un altro adapter.

La semantica target non cambia.

## BranchingPriorityPolicy rende il rollout una decisione separata

Il routing possiede tre modalità:

### `legacy`

```text
return legacy(input)
```

### `shadow`

```text
legacyResult = legacy(input)
candidateResult = candidate(input)
compare(legacyResult, candidateResult)
return legacyResult
```

Il candidate produce evidence ma non authority.

### `candidate`

```text
return candidate(input)
```

Il fatto che questa modalità esista nel codice significa soltanto che il boundary è testabile.

**Non significa che il candidate sia autorizzato in produzione.**

Il passaggio da `shadow` a `candidate` richiede il gate runtime definito dal Safety Plan.

## Comparison: la differenza deve avere un nome

Il comparison restituisce:

```text
Match
ExpectedDifference
UnexpectedDifference
```

ED-001 riconosce soltanto il caso approvato:

```text
legacy = Urgent
candidate = Standard
Enterprise + age >= 30m
AND no higher target rule applies
```

Non esiste una scorciatoia come:

```text
legacy != candidate
→ ExpectedDifference
```

perché renderebbe impossibile scoprire regressioni.

Una nuova differenza resta inattesa finché una decisione di dominio non la riclassifica deliberatamente.

## Le due suite raccontano due verità diverse

Manteniamo la characterization legacy e aggiungiamo target/refactoring test.

La prima dice:

```text
legacy characterization
→ what Operations Desk Classic currently does
```

La seconda dice:

```text
target tests
→ what ESI decided Order Operations must do
```

Quindi è corretto che LB-04 continui a essere verde nella suite legacy e che la target suite verifichi **l'assenza** della stessa enterprise timer rule.

Non sono test in contraddizione.

Proteggono due livelli diversi di conoscenza.

## Evidence locale del slice

I test nuovi coprono almeno:

- precedence della target policy;
- repeated Payment failure;
- assenza della Enterprise timer rule;
- mapping del `LegacyPriorityAdapter`;
- shadow mode che restituisce ancora il legacy result;
- ED-001 classificata `ExpectedDifference`;
- una differenza non autorizzata classificata `UnexpectedDifference`;
- candidate mode che restituisce la target policy.

Il Safety Plan vive in:

```text
docs/refactoring-safety-plan.md
```

ed è parte dell'evidence, non un documento separato dal codice.

## Stato corretto dopo l'esecuzione locale

Se build e test del capitolo passano, possiamo dichiarare:

```text
PriorityPolicy seam
= Codified + Verified locally

ConfirmedPriorityPolicy
= Codified + Verified locally against simulated confirmed requirements

LegacyPriorityAdapter
= Codified + Verified locally against legacy calculator

Shadow comparison
= Codified + Verified locally

Production shadow rollout
= Designed / Not executed

Candidate production cutover
= Designed / Not authorized

Legacy retirement
= Not started
```

Questo linguaggio impedisce di trasformare otto test locali in una claim di production readiness.

## Perché ci fermiamo a P4

Non abbiamo ancora:

- comparison telemetry production;
- observation window reale;
- consumer inventory chiuso;
- evidence definitiva sul nightly export;
- staging/production rollout;
- behavior fallback drill.

Potremmo descrivere come li implementeremmo.

Non possiamo dichiarare di averli eseguiti.

> **Un progetto didattico credibile non finge evidence che il proprio ambiente non può produrre.**

## Il contratto che riceverebbe un agente

Un agente incaricato di questo slice non riceverebbe soltanto “refactor priority routing”.

Riceverebbe:

```text
Preserve
LB-01, LB-02, LB-03, LB-06 semantics

Intentional difference
ED-001 only

Do not change
database, public API, legacy implementation, data ownership

Verification
legacy characterization + target policy + adapter + shadow tests

Stop
any unexplained mismatch
```

A quel punto possiamo delegare molta execution senza delegare la decisione semantica.

## Che cosa ha realmente fatto ESI

Il risultato del capitolo non è “legacy migrated”.

È più preciso:

```text
meaning confirmed
→ seam codified
→ compatibility isolated
→ candidate codified
→ intentional difference encoded
→ local comparison verified
→ production authority still withheld
```

Questa è la progressione che vogliamo.

> **Il candidate diventa più credibile non quando assomiglia al legacy, ma quando sappiamo dimostrare quali comportamenti preserva, quali cambia intenzionalmente e quali differenze restano ancora inspiegate.**