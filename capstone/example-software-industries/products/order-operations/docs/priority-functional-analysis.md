# Order Operations — Priority Functional Analysis

> **Scenario fittizio ESI.** Questo documento registra la decisione funzionale maturata nel Capitolo 18 dopo la characterization di Operations Desk Classic. Non è evidence di un'azienda reale.

## Purpose

Definire la semantica target della priorità operativa prima di migrare la capability dal legacy a Order Operations.

Principio:

> **Un comportamento osservato nel legacy diventa requisito soltanto dopo una decisione esplicita sul suo significato.**

## Stakeholder coinvolti nello scenario

- Commerce & Operations / Operations;
- Product;
- Payments & Risk;
- Sales;
- Order Operations team.

## Capability

Order Operations deve poter determinare una **priorità operativa** per un `OperationalCase` senza importare automaticamente il vocabolario e le regole accidentali di Operations Desk Classic.

La priorità aiuta a ordinare il lavoro operativo.

Non modifica:

- `OrderStatus`;
- `PaymentStatus`;
- `ShipmentStatus`;
- Payment Escalation state;
- authorization;
- ownership economica di Payments & Risk.

## Target vocabulary

```text
NotActionable
ManualReview
Urgent
Standard
```

Questi termini appartengono al modello target.

I codici legacy:

```text
NONE
MANUAL_REVIEW
URGENT
STANDARD
```

restano confinati nell'adapter di compatibilità.

## Behavior classification

### PF-01 — Closed

```text
OperationalCase.status = Closed
→ NotActionable
```

Classification:

```text
Required
```

Rationale simulato:

un case chiuso non deve rientrare nella coda di lavoro prioritizzata.

### PF-02 — Manual hold

```text
manualHold = true
→ ManualReview
```

Classification:

```text
Required behavior
legacy naming compatibility only
```

Rationale simulato:

un hold manuale interrompe il routing automatico e richiede attenzione umana.

### PF-03 — Repeated payment failure

```text
problemCategory = Payment
failedAttempts >= 3
→ Urgent
```

Classification:

```text
Required
```

Rationale simulato:

Payments & Risk e Operations considerano la ripetizione del failure un segnale sufficiente per aumentare la priorità operativa.

La soglia `3` è una policy corrente ESI simulata, non un benchmark industriale.

### PF-04 — Default

```text
otherwise
→ Standard
```

Classification:

```text
Required default
```

## Precedence target

```text
Closed
> ManualReview
> RepeatedPaymentFailure
> Standard
```

La precedence è ora una decisione funzionale esplicita e non un effetto accidentale dell'ordine degli `if` legacy.

## Regola legacy rimossa intenzionalmente

Operations Desk Classic contiene:

```text
customer_tier = ENTERPRISE
AND age >= 30 minutes
→ URGENT
```

Nello scenario ESI del Capitolo 18, Product, Sales e Operations classificano questa regola come una policy storica non più richiesta.

Target:

```text
customer tier alone does not change priority
```

Classification:

```text
Removed by explicit product decision
```

Expected difference:

```text
ED-001
legacy = URGENT
candidate = STANDARD
```

quando nessun'altra regola target più prioritaria è applicabile.

## Non requisiti

La nuova priority capability **non** implica automaticamente:

- persistence della priority;
- nuovo campo `priority` su `OperationalCase`;
- API pubblica per modificare priority;
- manual override command;
- sostituzione del nightly export legacy;
- nuovo SLA enterprise;
- cambio di tenant/security policy.

Queste decisioni restano separate.

## Mapping con i behavior legacy

| Legacy ID | Behavior osservato | Decisione target |
|---|---|---|
| LB-01 | `CLOSED → NONE` | Required → `NotActionable` |
| LB-02 | `manual_hold → MANUAL_REVIEW` | Required → `ManualReview` |
| LB-03 | `PAY + failed_attempts>=3 → URGENT` | Required → `Urgent` |
| LB-04 | `ENTERPRISE + age>=30m → URGENT` | Removed explicitly → ED-001 |
| LB-05 | Enterprise prima soglia → `STANDARD` | non requisito indipendente |
| LB-06 | ordinary open → `STANDARD` | Required default → `Standard` |

## Acceptance evidence

Prima del candidate cutover servono almeno:

```text
PF-01..PF-04 target tests green
legacy characterization still green
LegacyPriorityAdapter mapping verified
shadow comparison active
ED-001 recognized as expected
unexpected semantic mismatch = 0 for agreed observation window
```

L'ultimo punto richiede runtime evidence futura e non è ancora verificato nel Capitolo 18.

## Open questions

1. La priority deve essere derivata on demand o persistita?
2. Serve storico delle decisioni di priority?
3. Chi può applicare/rimuovere un manual hold nel target?
4. Il nightly export legacy usa ancora `priority_code`?
5. Quale consumer deve migrare prima di rimuovere il mapping legacy?
6. La soglia di repeated payment failure deve diventare configurabile e, se sì, chi la possiede?

## Related artifacts

```text
docs/legacy-understanding-map.md
docs/refactoring-safety-plan.md
docs/testing-strategy.md
legacy/operations-desk-classic/tests/priority-routing.characterization.test.mjs
```

> **Abbiamo preservato il significato che ESI ha confermato, non il codice che per caso lo rappresentava.**
