# 22.8 — ESI: una issue execution-ready per Order Operations

Per applicare il metodo non inventiamo una feature nuova.

Prendiamo un rischio già dichiarato nella Testing Strategy:

```text
TST-005
PaymentEscalation + Outbox atomici

Fast evidence
orchestration test

Higher-fidelity evidence
PostgreSQL transaction

Current state
Pending
```

Questo è un ottimo candidato per una execution issue.

La semantica business è già definita.

L'ownership è già definita.

La transaction boundary è già una decisione architetturale.

Ci manca evidence sul database reale.

## Problem

I test applicativi verificano che il use case chieda alla Unit of Work di creare `PaymentEscalation` e `OutboxMessage` insieme.

Non dimostrano però che l'implementazione PostgreSQL preservi realmente questa proprietà in presenza di failure.

La Testing Strategy lo dichiara esplicitamente:

> un fake repository non è evidence delle semantiche PostgreSQL.

## Outcome

Produrre una integration test suite riproducibile che dimostri su PostgreSQL reale:

```text
success
→ PaymentEscalation committed
→ OutboxMessage committed

failure before commit
→ neither committed

failure during second write
→ neither committed
```

L'outcome non è:

```text
aggiungere Testcontainers
```

Quella è una possibile implementazione dell'ambiente di test.

## Current state

Evidence disponibile:

```text
local orchestration tests
= Verified

PostgreSQL transaction semantics
= Designed / Pending
```

Schema disponibile:

```text
database/migrations/001_create_operational_case.sql
database/migrations/002_add_payment_escalation_and_outbox.sql
```

La migration chain non è ancora stata verificata contro un PostgreSQL reale nel capstone.

## Scope

La issue autorizza modifiche a:

```text
tests/integration/**
package.json
supporting test-environment files
new test-only adapters/helpers
```

Può introdurre una dependency test-only se necessaria e giustificata.

## Out of scope

Non autorizza:

```text
changing PaymentEscalation semantics
changing event v1
changing ownership
rewriting migration 001/002 to make tests pass
adding production persistence fields
changing cloud topology
changing RTO/RPO
```

Questo campo è decisivo.

Se la migration corrente contiene un problema reale, il test deve **scoprirlo**.

Non deve modificare il passato per diventare verde.

## Canonical context

L'executor deve leggere almeno:

```text
AGENTS.md
docs/repository-map.md
docs/testing-strategy.md
docs/data-ownership.md
docs/failure-mode-map.md
database/README.md
database/migrations/001_create_operational_case.sql
database/migrations/002_add_payment_escalation_and_outbox.sql
```

Non copiamo questi documenti nella issue.

Li trattiamo come source of truth del repository.

## Acceptance criteria

### AC-01 — migration chain

Su database vuoto:

```text
001
→ 002
→ schema usable by integration tests
```

### AC-02 — successful atomic commit

Quando la transaction riesce:

```text
1 PaymentEscalation
+ 1 corresponding OutboxMessage
```

sono committed.

### AC-03 — rollback on outbox write failure

Quando la seconda write fallisce prima del commit:

```text
0 committed PaymentEscalation
0 committed OutboxMessage
```

### AC-04 — deterministic cleanup

La suite deve poter essere rieseguita senza dipendere dallo stato lasciato dal run precedente.

### AC-05 — existing fast layer preserved

Il nuovo harness non deve richiedere PostgreSQL per eseguire i normali fast test locali.

Questo protegge feedback speed.

## Verification

La issue richiede evidence separata:

```text
fast suite
→ existing npm test behavior remains available

integration suite
→ real PostgreSQL engine
→ migration 001 + 002
→ atomicity scenarios
```

Il comando concreto può essere introdotto durante implementation, per esempio:

```text
npm run test:integration
```

ma il nome dello script non è la proprietà.

## Constraints

- test environment riproducibile;
- nessun credential reale committato;
- nessuna dipendenza da production Azure resources;
- existing migrations trattate come baseline;
- no weakening di architecture fitness per far passare il test;
- quality evidence dichiarata proporzionalmente al boundary verificato.

## Stop conditions

L'executor deve fermarsi se:

1. il test richiede una modifica semantica a migration 001 o 002;
2. lo schema reale contraddice `Data Ownership Map`;
3. serve introdurre un nuovo authoritative field;
4. il failure scenario non è riproducibile senza cambiare production behavior;
5. la soluzione richiede un servizio cloud reale non già autorizzato dal task;
6. emerge una incompatibilità che richiede un nuovo ADR.

In quel caso l'output corretto è:

```text
Stopped
Evidence
Decision required
Candidate follow-up
```

non un workaround silenzioso.

## Closure evidence

Quando la issue sarà eseguita dovrà chiudersi con:

```text
Environment mechanism
Files changed
Commands executed
Migration result
Atomic success result
Rollback result
Fast-suite impact
Known limitations
Not verified
```

## Il compromesso ESI

Platform preferirebbe standardizzare subito un unico harness containerizzato per tutti i team.

Commerce & Operations vuole semplicemente produrre evidence su PostgreSQL senza introdurre una piattaforma test sproporzionata.

Security non vuole credential condivise o collegamenti a environment permanenti.

Finance non vuole mantenere un database staging sempre acceso soltanto per questo test.

La decisione è:

> **richiedere un PostgreSQL reale e riproducibile, ma lasciare all'execution task la scelta del meccanismo più piccolo che soddisfa quella proprietà.**

Accettiamo quindi una piccola dependency/test-environment complexity.

Non accettiamo:

- fake database come prova di transaction semantics;
- production database come test environment;
- modifica delle migration per rendere il test verde.

Il quality floor protegge:

```text
atomicity
migration fidelity
reproducibility
fast-feedback separation
credential isolation
```

## Perché questa issue è pronta

Possiamo rispondere sì alle domande di readiness:

```text
problem known?             yes
outcome observable?        yes
semantic owner known?      yes
scope bounded?             yes
canonical context exists?  yes
verification possible?     yes
stop conditions known?     yes
```

Non sappiamo ancora quale harness useremo.

Ed è corretto.

Quella è una decisione locale reversibile che l'executor può prendere.

> **Una issue execution-ready non elimina ogni scelta. Elimina le scelte che l'executor non è autorizzato a inventare.**
