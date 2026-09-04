# 22.2 — La issue come contratto di execution

Una issue execution-ready non è una specifica completa del sistema.

È un contratto temporaneo abbastanza preciso da consentire a un executor di lavorare senza inventare decisioni che non gli appartengono.

## Il minimo utile

Un modello robusto contiene almeno:

```text
Problem
Outcome
Current state
Scope
Out of scope
Canonical context
Acceptance criteria
Verification
Constraints
Stop conditions
Evidence on closure
```

Ogni campo risponde a una domanda diversa.

### Problem

Perché stiamo facendo il lavoro?

Evita che l'executor ottimizzi la soluzione locale dimenticando la ragione del cambiamento.

### Outcome

Che cosa deve essere vero quando abbiamo finito?

È più utile di un elenco di file da modificare.

### Current state

Quale evidence descrive la situazione di partenza?

Può essere:

- un test rosso;
- una metrica;
- un comportamento osservato;
- un requisito ancora non coperto;
- una migration mancante;
- un incidente documentato.

### Scope

Quale parte del sistema può essere modificata?

### Out of scope

Che cosa non deve essere risolto incidentalmente?

Questo campo è particolarmente importante con gli agenti, perché limita la **task amplification**.

### Canonical context

Quali documenti e contratti sono autorevoli per questo task?

Meglio linkare:

```text
docs/data-ownership.md
docs/testing-strategy.md
AGENTS.md
```

che copiare pagine di contenuto nella issue.

### Acceptance criteria

Quali condizioni osservabili rendono il risultato accettabile?

### Verification

Con quale evidence dimostriamo gli acceptance criteria?

Questa separazione è importante.

```text
Acceptance criterion
→ proprietà desiderata

Verification
→ meccanismo che produce evidence
```

### Constraints

Quali decisioni già prese non possono essere violate per comodità?

### Stop conditions

Quale nuova informazione rende il task non più autonomamente eseguibile?

### Evidence on closure

Che cosa deve essere riportato quando chiudiamo la issue?

Non basta:

```text
Done.
```

Meglio:

```text
Files changed
Verification executed
Result
Known limitations
Evidence not produced
Follow-up created
```

## Acceptance criteria non tautologici

Un criterio debole:

```text
Il codice deve funzionare.
```

Un criterio solo apparentemente migliore:

```text
Il nuovo integration test deve passare.
```

Anche questo può essere tautologico: l'executor può scrivere un test che dimostra esattamente la propria implementazione.

Meglio formulare la proprietà:

```text
Se la persistenza di OutboxMessage fallisce,
nessuna PaymentEscalation deve risultare committed.

Se entrambe le write riescono,
PaymentEscalation e OutboxMessage devono risultare committed insieme.
```

Poi la verification può dire:

```text
real PostgreSQL integration test
```

> **Prima definiamo la proprietà. Poi scegliamo il test che può dimostrarla.**

## La issue non deve prescrivere decisioni ancora aperte

Scrivere:

```text
Implementa con Testcontainers.
```

ha senso solo se l'uso di Testcontainers è già una decisione o un vincolo.

Se il problema è avere un PostgreSQL reale e riproducibile, la issue può dire:

```text
Verification must exercise a real PostgreSQL engine.
The environment mechanism is part of the implementation choice,
provided the repository remains reproducible and CI-compatible.
```

Così l'executor mantiene spazio di soluzione senza poter degradare la proprietà.

## Issue readiness

Prima di delegare un task chiediamo:

1. il problema è chiaro?
2. l'outcome è osservabile?
3. lo scope è abbastanza piccolo?
4. i documenti canonical esistono?
5. gli acceptance criteria descrivono proprietà e non implementazioni arbitrarie?
6. esiste un modo realistico per produrre evidence?
7. sappiamo quando l'executor deve fermarsi?

Se una risposta importante è no, il task potrebbe essere ancora una **discovery issue**, non una execution issue.

> **Una issue è pronta quando l'executor può prendere molte decisioni locali senza dover prendere decisioni di prodotto o architettura al posto nostro.**
