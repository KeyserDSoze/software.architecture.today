# Readiness come evidence, non come impressione

La Production Readiness Review fallisce quando diventa una discussione basata su sensazioni:

> secondo me siamo pronti.

> l'ambiente di test sembra stabile.

> quella parte l'abbiamo già provata qualche settimana fa.

> il provider gestisce il backup.

> l'AI sembra rispondere bene.

Queste frasi possono essere vere.

Ma non sono ancora evidence.

---

## Claim → Evidence → Limitation

Useremo per la readiness lo stesso modello costruito per gli agenti:

```text
Claim
→ Evidence
→ Limitation
```

Esempio:

```text
CLAIM
PaymentEscalation + OutboxMessage sono atomici.

EVIDENCE
integration test eseguito su PostgreSQL reale
con failure forzata della seconda write.

LIMITATION
non dimostra Azure networking,
broker delivery o Payments consumer behavior.
```

Altro esempio:

```text
CLAIM
il workload può recuperare entro RTO.

EVIDENCE
restore/failover drill con timestamp misurati.

LIMITATION
il drill copre lo scenario X,
non dimostra automaticamente region-wide recovery.
```

Questa disciplina impedisce una forma comune di **evidence inflation**:

```text
abbiamo verificato una proprietà locale
→ descriviamo come verificato l'intero sistema
```

---

# Designed non è ready

Prendiamo alcuni esempi dal nostro capstone.

Abbiamo già deciso:

```text
private ingress
zone resilience direction
RTO / RPO
OpenTelemetry-compatible instrumentation
AI read-only authority
secondary maintainer
```

Queste sono decisioni architetturali.

Alcune sono anche codificate.

Ma production readiness richiede una domanda ulteriore:

> **la proprietà che ci interessa è stata osservata nel boundary che può realmente fallire?**

Per esempio:

```text
Bicep says publicNetworkAccess = Disabled
```

è evidence utile.

Ma non è equivalente a:

```text
staging/prod-like deployment
+ private DNS
+ network path
+ negative public access test
→ Verified
```

Oppure:

```text
backup policy configured
```

non equivale a:

```text
restore completed successfully
within required RTO/RPO
```

La readiness deve conoscere questa differenza.

---

# Evidence source hierarchy

Non tutta l'evidence ha la stessa forza per ogni claim.

Una gerarchia utile è:

```text
Documented intent
↓
Static configuration / code inspection
↓
Deterministic local test
↓
Integration test on real dependency
↓
Non-production environment evidence
↓
Failure / recovery drill
↓
Controlled production rollout evidence
↓
Production monitoring over time
```

Non significa che l'ultimo livello sia sempre necessario.

Significa che dobbiamo scegliere il livello capace di dimostrare **la property specifica**.

Per esempio:

```text
priority precedence
→ deterministic test può bastare

PostgreSQL transaction semantics
→ real PostgreSQL

private endpoint reachability
→ real Azure environment

on-call readiness
→ procedure + actual exercise

AI groundedness
→ real model execution over eval set
```

> **Usa l'evidence più economica che riesce davvero a dimostrare la proprietà.**

È la stessa regola che abbiamo usato nel Testing Architecture.

---

# Freshness dell'evidence

Un'altra domanda raramente esplicita:

> **quanto è vecchia la prova?**

Un restore drill eseguito diciotto mesi fa su una topologia diversa non dimostra necessariamente la capacità corrente.

Una security review precedente a:

```text
new public ingress
new identity model
new provider
new data class
```

può essere scaduta.

Quindi ogni evidence importante dovrebbe avere almeno:

```text
what was tested
when
against which version/environment
result
owner
known limitations
invalidating trigger
```

La readiness non è soltanto una fotografia.

È una fotografia con **data di scadenza**.

---

# Evidence debt

Possiamo avere un sistema progettato bene e comunque accumulare **evidence debt**.

Esempio:

```text
Architecture
→ zone redundant

Runbook
→ documented

Backups
→ configured

But
→ nobody has executed a restore drill
```

Il rischio tecnico potrebbe essere basso.

Il rischio epistemico resta alto:

> crediamo di saper recuperare, ma non lo abbiamo ancora dimostrato.

L'evidence debt deve entrare nel backlog esattamente come technical debt e cost debt.

Schema:

```text
Evidence gap
Property affected
Risk if wrong
Owner
Required environment
Closure mechanism
Due / launch gate
```

---

# Blocker non significa “task importante”

Non ogni evidence gap deve bloccare il launch.

La classificazione deve partire dal **launch boundary** e dal rischio.

## Blocker

Un blocker è qualcosa per cui, senza closure o risk acceptance esplicita, non siamo disposti a sostenere la promessa corrente.

Esempi possibili:

```text
unknown tenant-isolation behavior
unknown irreversible data-loss path
no way to authenticate intended users
no owner for incidents
no restore capability when RPO/RTO require it
payment side effect with unverified duplicate behavior
```

## Accepted Risk

Un gap può essere accettato quando:

```text
risk is understood
impact is bounded
mitigation exists
owner exists
acceptance authority is correct
review/expiry exists
```

## Follow-up

Miglioramento che non mette in discussione il launch boundary corrente.

## Unknown

Se non sappiamo classificare il rischio, non dobbiamo trasformarlo automaticamente in follow-up.

> **Unknown è uno stato di readiness, non un modo elegante per dire “probabilmente va bene”.**

---

# Evidence ownership

Chi produce l'evidence non è necessariamente chi accetta il rischio.

Per esempio:

```text
Engineering
→ produce restore drill evidence

Reliability/Operations
→ valuta operability

Business owner
→ accetta eventuale RTO residual risk
```

Oppure:

```text
AI eval implementer
→ esegue eval

Verifier
→ controlla dataset/result/provenance

Product
→ decide usefulness threshold

Security
→ decide critical safety failure
```

Questo evita un anti-pattern simile a quello già visto nei workflow agentici:

> **self-certification**.

---

# Readiness Evidence Matrix

Nel capitolo useremo una matrice semplice:

| Area | Claim | Required evidence | Current state | Launch impact | Owner |
|---|---|---|---|---|---|
| Functional | core journey behaves as specified | tests + staged journey |? | blocker | Product + workload |
| Data | escalation/outbox atomic | real PostgreSQL integration | pending | blocker for escalation | workload |
| Security | private/auth boundaries hold | deployment + negative tests | pending | blocker | Security + workload |
| Reliability | restore meets target | drill | pending | blocker/accepted risk by boundary | Operations |
| Observability | incident-significant signal works | staged signal/alert exercise | pending | blocker for supportability | workload |
| Cost | workload is attributable | billing/tag evidence | partial | follow-up/pilot dependent | FinOps |
| AI | model meets eval thresholds | real candidate eval | pending | blocker for AI feature only | Product + Security |
| Continuity | another maintainer can operate | continuity drill | pending | blocker before One-Man pilot production ownership | Engineering |

La matrice non sostituisce gli artifact canonical.

Li **riassume come launch evidence**.

---

# Evidence package, non screenshot collection

Una cattiva readiness review finisce con cinquanta screenshot in una cartella.

Dopo tre mesi nessuno sa:

- quale claim dimostravano;
- contro quale versione;
- se sono ancora validi;
- se il grafico era prima o dopo il fix.

Meglio un evidence package con provenance:

```text
Evidence ID
Claim ID
Source command/query/drill
Version/commit
Environment
Timestamp
Result
Limitations
Artifact/link
Owner
```

Non serve costruire un sistema enorme al primo giorno.

Ma la relazione:

```text
claim
→ evidence
```

deve sopravvivere alla memoria di chi ha eseguito il test.

---

# Una review può dire “non lo sappiamo”

Questa è forse la disciplina più importante del capitolo.

Se la Production Readiness Review trova:

```text
PostgreSQL atomicity
= Pending
```

non deve trasformarlo in:

```text
probably safe because unit tests pass
```

Se trova:

```text
AI model quality
= Pending
```

non deve trasformarlo in:

```text
looks good in manual demos
```

Il lavoro della review non è proteggere la data di launch.

È proteggere il significato dei nostri claim.

> **Una readiness review credibile non aumenta artificialmente la confidence. Migliora la precisione con cui sappiamo dove la confidence esiste e dove no.**
