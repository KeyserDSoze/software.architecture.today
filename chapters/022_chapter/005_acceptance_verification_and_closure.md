# 22.5 — Acceptance, verification e chiusura

Una issue non è finita quando esiste un diff.

È finita quando abbiamo evidence sufficiente per sostenere l'outcome che avevamo dichiarato.

## Acceptance e verification sono due livelli diversi

Prendiamo una issue:

> Verificare che PaymentEscalation e OutboxMessage abbiano commit atomico su PostgreSQL reale.

Acceptance criterion:

```text
Se una write fallisce,
nessuna delle due entity deve risultare committed.
```

Verification:

```text
integration test contro PostgreSQL reale
con failure injection sulla seconda write
```

Se scriviamo soltanto:

```text
npm test deve passare
```

abbiamo confuso il meccanismo con la proprietà.

Il comando può cambiare.

La proprietà resta.

## Evidence proportional to claim

Il modello che usiamo in tutto il libro vale anche qui:

```text
claim
→ evidence layer capace di sostenerlo
```

Un unit test può sostenere:

```text
retry count is bounded
```

Non può sostenere:

```text
Azure Service Bus private endpoint is reachable only through the intended network path
```

Una issue deve quindi evitare closure claim più grandi della verification eseguita.

## Definition of Done: utile, ma non universale

Una Definition of Done di team può contenere:

- test verdi;
- review;
- documentazione aggiornata;
- security scan;
- deployability.

È utile come baseline.

Ma una issue ad alto rischio può richiedere evidence aggiuntiva.

```text
baseline DoD
+
task-specific acceptance evidence
```

Non vogliamo che una checklist standard renda invisibile ciò che rende speciale il rischio corrente.

## Closure report

Per task delegati, soprattutto agentici, conviene rendere la chiusura strutturata.

Un formato semplice:

```text
Outcome achieved
Files changed
Verification executed
Evidence result
Known limitations
Not verified
Follow-up
```

La riga **Not verified** è molto importante.

Esempio:

```text
Verified
atomicity on local PostgreSQL container

Not verified
Azure Database for PostgreSQL networking
production latency
CI runner compatibility
```

Questo impedisce alla parola `PASS` di espandersi semanticamente oltre ciò che abbiamo provato.

## Evidence bundle

Una issue può produrre più evidence:

```text
code diff
unit test
integration test
architecture fitness
security negative test
benchmark
screenshot
query result
migration log
runbook update
```

Non serve sempre tutto.

Serve ciò che sostiene il claim.

Questa logica anticipa l'**Agent Verification Bundle** che formalizzeremo nel capitolo successivo.

## Chiusura con gap residui

Una issue può essere chiusa anche se il sistema complessivo non è completo.

Per esempio:

```text
Task
create reproducible PostgreSQL integration harness

Done
harness starts, migrates schema, runs probe, cleans up

Still pending
atomicity scenarios
CI execution
```

Non dobbiamo tenere aperto un task perché il progetto intero non è finito.

Dobbiamo evitare di chiuderlo fingendo che abbia dimostrato ciò che non aveva in scope.

## Follow-up non è scope creep

Durante il lavoro possiamo scoprire:

- una migration fragile;
- una doc obsoleta;
- una query lenta;
- una security gap adiacente.

La risposta non deve essere necessariamente inserirli nel diff corrente.

Può essere:

```text
record evidence
→ open follow-up
→ link dependency
```

Così preserviamo sia la scoperta sia l'atomicità del task.

> **Una buona closure non racconta soltanto ciò che abbiamo fatto. Delimita esattamente ciò che ora sappiamo.**
