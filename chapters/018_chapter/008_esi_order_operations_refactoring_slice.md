# 18.8 — ESI: il primo refactoring slice di Order Operations

Ora trasformiamo il piano in codice.

Ma soltanto fino al punto che possiamo verificare senza fingere evidence production.

## Stato iniziale

Abbiamo:

```text
Operations Desk Classic
└── calculatePriority(row, now)
```

con characterization test `LB-01…LB-06`.

Order Operations non possiede ancora una priority policy.

## Obiettivo del slice

Introdurre nel nuovo prodotto:

```text
PriorityPolicy
LegacyPriorityAdapter
ConfirmedPriorityPolicy
BranchingPriorityPolicy
```

senza:

- cancellare il legacy;
- modificare il database;
- cambiare API pubbliche;
- cambiare ownership persistente;
- dichiarare il candidate production-ready.

## Il nuovo boundary

Il nuovo modello usa concetti espliciti:

```text
CasePriorityInput
Priority
PriorityDecision
```

L'input contiene soltanto ciò che la policy deve conoscere.

Non contiene `status_code` o `problem_code` come naming del dominio target.

Questi dettagli appartengono all'adapter legacy.

## ConfirmedPriorityPolicy

La policy target implementa la precedence confermata:

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

Non contiene più:

```text
Enterprise + age >= 30m
```

perché ESI l'ha classificata come behavior da rimuovere esplicitamente.

Questo significa che il candidate non è una riscrittura sintattica del legacy.

È una **traduzione del significato confermato**.

## LegacyPriorityAdapter

L'adapter deve fare due lavori.

### Tradurre input target → legacy row

```text
status          → status_code
manualHold      → manual_hold
problemCategory → problem_code
failedAttempts  → failed_attempts
customerTier    → customer_tier
createdAt       → created_at
```

### Tradurre output legacy → target

```text
NONE          → NotActionable
MANUAL_REVIEW → ManualReview
URGENT        → Urgent
STANDARD      → Standard
```

Il target model non importa quindi il vocabolario legacy.

## Perché iniettiamo il legacy calculator

Il TypeScript di Order Operations non importa direttamente il file CommonJS di Operations Desk Classic.

Espone invece una dependency:

```text
LegacyPriorityCalculator
```

Questo consente alla composition futura di scegliere come raggiungere il legacy:

- chiamata in-process durante una fase iniziale;
- adapter HTTP;
- wrapper di compatibility;
- altro boundary.

Nel test locale possiamo iniettare direttamente `calculatePriority` del capstone legacy.

È un esempio concreto di Anti-Corruption Layer.

## BranchingPriorityPolicy

Il routing supporta tre modalità concettuali:

```text
legacy
shadow
candidate
```

### legacy

```text
return legacy(input)
```

### shadow

```text
legacyResult = legacy(input)
candidateResult = candidate(input)
compare(...)
return legacyResult
```

Il candidate non decide ancora il comportamento esterno.

### candidate

```text
return candidate(input)
```

Questa modalità è codificata per rendere il boundary testabile, ma **non equivale a un rollout production già autorizzato**.

## Comparison result

Il comparison distingue:

```text
Match
ExpectedDifference
UnexpectedDifference
```

ED-001 riconosce esclusivamente la differenza approvata:

```text
legacy Urgent
candidate Standard
customer tier Enterprise
age >= 30 minutes
nessun'altra rule target applicabile
```

Non usiamo una regola generica:

```text
legacy != candidate
→ expected
```

perché annullerebbe il valore del comparison.

## Test nuovi

Aggiungiamo test per:

1. precedence target;
2. repeated Payment failure;
3. assenza della vecchia enterprise timer rule;
4. mapping del LegacyPriorityAdapter;
5. shadow restituisce ancora il risultato legacy;
6. ED-001 viene classificata expected;
7. una differenza non autorizzata viene classificata unexpected;
8. candidate mode restituisce la nuova policy.

Il vecchio characterization test continua a esistere.

Quindi avremo due suite con significati diversi:

```text
legacy characterization
→ what the old system does

target tests
→ what ESI decided the new system must do
```

Questa distinzione è fondamentale.

## Refactoring Safety Plan persistente

Nel capstone entra:

```text
docs/refactoring-safety-plan.md
```

che contiene:

- scope;
- behavior classification;
- ED-001;
- phase;
- evidence;
- stop condition;
- fallback;
- point of no return;
- cleanup definition.

## Lo stato dopo il capitolo

Se build e test passano, potremo dire:

```text
PriorityPolicy seam
= Codified + Verified locally

ConfirmedPriorityPolicy
= Codified + Verified locally against simulated confirmed requirements

LegacyPriorityAdapter
= Codified + Verified locally against legacy calculator

Shadow comparison
= Codified + Verified locally

production shadow rollout
= Designed / Not executed

candidate production cutover
= Designed / Not authorized

legacy retirement
= Not started
```

Questo è il livello di precisione che vogliamo.

## Perché non facciamo subito il cutover

Perché non abbiamo:

- telemetry production del comparison;
- consumer inventory reale;
- staging/production environment eseguito;
- evidence sul nightly export;
- rollback drill.

Potremmo inventarli per far sembrare il capstone più completo.

Non lo faremo.

> **Un progetto didattico credibile non deve fingere evidence che il proprio ambiente non può produrre.**

## L'AI nel slice

Un agente potrebbe generare gran parte di questo codice molto rapidamente.

Ma riceverebbe un contratto come:

```text
Preserve:
LB-01, LB-02, LB-03, LB-06 semantics

Intentional difference:
ED-001 removes enterprise 30m escalation

Do not change:
database, API, legacy implementation

Verification:
old characterization + target policy + adapter + shadow tests

Stop:
any unexplained mismatch
```

Questo rappresenta bene il modello che useremo più avanti:

> **prima sincronizzare il pensiero. Poi parallelizzare l'esecuzione.**
