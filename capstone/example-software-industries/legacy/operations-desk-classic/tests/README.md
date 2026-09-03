# Operations Desk Classic — Characterization Evidence

Questa directory contiene la characterization suite introdotta nel **Capitolo 17 — Legacy e comprensione**.

## Scope

La suite verifica esclusivamente il comportamento corrente della slice:

```text
legacy case priority routing
```

Non verifica l'intero Operations Desk Classic e non dimostra che le regole osservate siano business-correct.

## Verification run — Capitolo 17

La suite è stata ricostruita dal codice presente nel repository ed eseguita con il test runner built-in di Node.js.

Risultato:

```text
node --test priority-routing.characterization.test.mjs

6 tests
6 pass
0 fail
0 skipped
```

Behavior osservati:

```text
LB-01 CLOSED → NONE
LB-02 manual_hold → MANUAL_REVIEW
LB-03 Payment + failed_attempts >= 3 → URGENT
LB-04 Enterprise + age >= 30 min → URGENT
LB-05 Enterprise before threshold → STANDARD
LB-06 ordinary case → STANDARD
```

Evidence state corretto:

```text
implementation exists = Found
behavior under characterized input = Observed + Verified by local test execution
business requirement = Unknown / not yet Confirmed
```

## Cosa questa evidence non dimostra

Non dimostra:

- che il modulo sia ancora chiamato in produzione;
- che la production configuration sia equivalente;
- che il threshold `30 min` sia ancora richiesto;
- che `manual_hold` debba sopravvivere;
- che non esistano hidden consumer;
- che la priority sia authoritative;
- che Order Operations debba copiare questa semantica.

Questi gap restano nella:

```text
products/order-operations/docs/legacy-understanding-map.md
```

> **Characterization riduce il rischio di cambiare accidentalmente il comportamento. Non trasforma il comportamento in requisito.**
