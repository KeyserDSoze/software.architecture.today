# ESI — Production Readiness Review di Order Operations

> **Scenario fittizio/composito.** La review usa lo stato reale del capstone. Gli stati `Verified` vengono usati soltanto quando esiste evidence corrispondente.

Dopo venticinque capitoli Order Operations è abbastanza maturo da creare pressione per un launch. È anche abbastanza disciplinato da impedirci di confondere quella pressione con readiness.

Product propone un bounded internal pilot: workforce ESI, private access, single region e core Operational Case read journey. Payment Escalation viene valutato come boundary separato. Priority candidate, Case Explanation Assistant, public ingress e remediation action restano esclusi.

Questa scelta restringe la promessa prima ancora di giudicarla.

## La matrice racconta una storia semplice

| Area | Claim | Current state | Launch impact |
|---|---|---|---|
| Functional | core semantics documented and testable | Partial | staged critical journey still required |
| Architecture | structural boundaries explicit | Partial | runtime boundary evidence incomplete |
| Cloud | intended Azure topology deploys correctly | Pending | core blocker |
| Security | auth/network/RBAC boundaries hold | Pending | core blocker |
| Reliability | recovery meets launch expectations | Pending | core blocker |
| Observability | critical failure becomes actionable signal | Pending | core blocker |
| Deployment | rollout can stop/recover safely | Pending | core blocker |
| Capacity | pilot demand has known headroom | Unknown/Pending | core blocker |
| Ownership | support/escalation route exists | Partial | continuity/support evidence pending |
| Cost | major premiums and allocation direction known | Partial | potentially conditional for pilot |
| Payment data | escalation/outbox atomic on PostgreSQL | Pending | escalation-only blocker |
| AI | model quality/security/runtime behavior evaluated | Pending | AI-only; feature disabled |
| Priority | authoritative cutover supported by runtime evidence | Pending | not authorized |

La conclusione non richiede un readiness score:

> **Order Operations non è production-ready secondo l’evidence registrata nel capstone.**

Questa non è una sconfitta. È il primo momento in cui il sistema di evidence produce una decisione scomoda invece di una narrativa ottimista.

## Perché anche il core read-only resta NO-GO

Potremmo pensare che il core sia “solo read-only” e quindi abbastanza innocuo da lanciare.

Ma il launch boundary promette comunque authenticated private access, correct authorization/tenant isolation, real deployment path, runtime dependency connectivity, observable critical journey, support ownership e recovery/fallback praticabili.

Nel capstone queste property sono in parte `Designed` o `Codified`, non ancora tutte `Verified`.

La review quindi non trasforma l’intenzione in runtime evidence.

I blocker core restano:

```text
PRB-001 cloud deployment evidence
PRB-002 security runtime evidence
PRB-003 recovery evidence
PRB-004 observability / alert evidence
PRB-005 support / continuity evidence
PRB-006 capacity evidence
```

Un futuro `CONDITIONAL GO` per `LB-CORE` richiede almeno la closure di questi gap e condizioni esplicite come bounded cohort, private access, support window e capability più rischiose disabled.

## Payment Escalation non eredita la readiness del core

`LB-ESCALATION` introduce un’altra promessa: `PaymentEscalation + OutboxMessage` devono essere atomici sul datastore reale e il publisher/messaging boundary deve poter essere governato.

Il local orchestration test esiste. Ma `TST-005` e `OO-001` dichiarano ancora Pending la PostgreSQL transaction evidence.

Quindi:

```text
PRB-ESC-001
OO-001 PostgreSQL atomicity
→ Open / execution Pending
```

Questo blocca Payment Escalation, non deve necessariamente bloccare il core read journey quando il boundary può realmente tenere la capability disabled.

La separazione rende la decisione più precisa, non più permissiva.

## AI resta fuori dal launch

Il Case Explanation Assistant ha un AI Feature Contract, un semantic port provider-neutral, deterministic source validation ed eval seed.

Non ha ancora real model comparison, groundedness result, prompt-injection result, provider/privacy review, latency, cost, operator usefulness o runtime monitoring.

`OO-002` esiste proprio per chiudere parte di questo gap.

Quindi:

```text
LB-AI
= NOT READY / DISABLED
```

Escludere l’AI non è un workaround. È un vantaggio del boundary disegnato nel Capitolo 24: il core non dipende da una capability probabilistica opzionale la cui evidence non è ancora sufficiente.

## Priority cutover resta non autorizzato

ConfirmedPriorityPolicy, LegacyPriorityAdapter, BranchingPriorityPolicy ed Expected Difference mostrano che la migration è progredita. Ma mancano ancora runtime shadow telemetry, consumer/retirement evidence e un cutover/fallback gate soddisfatto.

Quindi `LB-PRIORITY-CANDIDATE` resta `NOT AUTHORIZED`.

Il compatibility path corrente continua a essere il percorso sostenuto.

## Non confondiamo architettura mancante con evidence mancante

La PRR non sta dicendo che il progetto non possiede architecture intent. Al contrario, possiede abbastanza design da sapere **quale evidence manca**.

Per cloud servono build/lint, non-production deploy, private connectivity, smoke e rollback/fallback exercise. Per security servono negative test runtime su role, tenant, RBAC e public access. Per reliability serve un restore/recovery drill misurato. Per observability serve un alert chain esercitato. Per continuity serve un Secondary Maintainer drill. Per capacity serve almeno una pilot estimate con representative evidence.

Questi gap non vengono risolti aggiungendo una nuova diagramma. Richiedono execution nel boundary appropriato.

## Il single-region risk è un esempio di Accepted Risk candidato, non di blocker automatico

Per un bounded internal pilot ESI potrebbe accettare di non avere active-active multi-region.

Ma questa decisione diventa discutibile soltanto **dopo** che esiste evidence sulla recovery di base. Senza restore evidence non stiamo accettando un known regional downtime risk: stiamo ignorando un unknown recovery capability.

Quindi `AR-CAND-001` resta candidato, non accepted risk in questa PRR.

## La decisione

Alla fine del Capitolo 26 la review persistente rimane:

```text
PRR-OO-001
Decision = NO-GO — evidence closure required
```

Non perché Order Operations sia “fatto male”. Perché la disciplina del libro ci impedisce di promuovere:

```text
Designed / Codified
```

in:

```text
Verified for production
```

senza attraversare i boundary reali che possono smentire le nostre assunzioni.

## Che cosa abbiamo guadagnato

Una checklist generica avrebbe potuto dire `security = yes`, `backup = yes`, `monitoring = yes`.

La PRR può invece dire quale security property, quale recovery evidence, quale SLI, quale launch boundary, quale owner e quale claim è ancora Pending.

È questa precisione che rende utile il `NO-GO`.

> **La review non ci dice che Order Operations è quasi pronto. Ci dice esattamente quali prove devono esistere prima che una promessa di produzione diventi difendibile.**
