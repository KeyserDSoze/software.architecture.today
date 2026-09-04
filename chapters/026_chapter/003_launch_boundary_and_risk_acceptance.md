# Launch boundary, blocker e risk acceptance

Una Production Readiness Review senza un launch boundary chiaro produce confusione.

Perché la domanda:

> siamo pronti?

non ha senso finché non sappiamo **pronti per che cosa**.

---

## Il launch boundary

Il launch boundary definisce:

```text
utenti
capability
ambienti
regioni
traffic / volume
integrations
support window
operational promises
```

Esempio ESI:

```text
Internal workforce only
Single production region
Order Operations core read journey
Payment Escalation enabled
Priority candidate disabled
Case Explanation Assistant disabled
Business-hours pilot support
```

È un launch molto diverso da:

```text
all enterprise tenants
global 24x7
public/mobile access
AI assistant enabled
full remediation actions
```

La readiness deve essere valutata rispetto al primo perimetro, non rispetto a un futuro ipotetico.

---

# Progressive exposure è anche progressive commitment

Abbiamo già incontrato feature flag e canary nei capitoli precedenti.

Qui aggiungiamo una prospettiva:

> **ridurre l'esposizione iniziale riduce anche la quantità di promessa che dobbiamo essere pronti a sostenere immediatamente.**

Possiamo limitare:

```text
user cohort
traffic percentage
region
feature set
tenant set
write capability
AI capability
support hours
```

Ma progressive exposure non deve diventare una scusa per lanciare un sistema non operabile.

Un pilot con dieci operatori continua ad avere bisogno di:

- autenticazione corretta;
- tenant isolation se applicabile;
- data integrity;
- owner;
- incident path;
- rollback/fallback;
- capacità di capire se sta fallendo.

La scala può ridurre il rischio.

Non elimina il **quality floor**.

---

# Il Go/No-Go non dovrebbe essere una votazione

Immaginiamo la riunione ESI.

```text
Product       GO
Engineering   GO
Sales         GO
Operations    NO-GO: restore untested
Security      NO-GO: private access not verified
```

La risposta non è:

```text
3 voti contro 2
→ GO
```

Il risk gate non è democratico.

Alcuni rischi richiedono l'autorità specifica del dominio che li possiede.

Esempio:

```text
Security critical blocker
→ Security authority required

Payment correctness blocker
→ Payments & Risk required

Business scope limitation
→ Product / business owner

Production support capability
→ Operations / workload owner
```

Questo è lo stesso principio usato nel Capitolo 23 contro il **consensus theatre**.

---

# Risk acceptance non è una firma decorativa

Una risk acceptance seria dovrebbe dichiarare:

```text
Risk ID
Condition
Impact
Likelihood / uncertainty
Affected launch boundary
Mitigation
Detection
Fallback
Owner
Acceptance authority
Expiry / review trigger
Closure action
```

Esempio:

```text
RISK-PRR-07

Condition
regional automated failover not implemented

Launch boundary
single-region internal pilot

Mitigation
backups + documented redeploy path

Residual impact
regional outage may exceed normal availability target

Acceptance authority
Product/Operations accountable owner

Expiry
before external/24x7 launch
```

Questo può essere un rischio accettabile.

Diverso sarebbe:

```text
no evidence that committed business state can be restored
```

quando il business richiede un RPO/RTO preciso.

---

# Temporary launch constraints

A volte il modo migliore di chiudere un blocker non è implementare subito una capability più complessa.

Può essere **restringere il launch boundary**.

Esempi:

```text
AI eval not complete
→ launch core without AI

24x7 support not staffed
→ bounded pilot support window

regional DR not mature
→ internal pilot with explicit regional-risk acceptance

public ingress not ready
→ private workforce access only
```

Questa è architettura e product strategy insieme.

> **Un launch boundary più piccolo può essere una mitigation migliore di una architettura più grande.**

---

# Non tutto può essere mitigato con un flag

I feature flag sono potenti, ma alcuni cambiamenti hanno effetti fuori dal processo applicativo.

Per esempio:

```text
database migration
schema destructive change
message already emitted
external customer communication
security credential leakage
financial side effect
```

Quindi dobbiamo distinguere:

```text
feature rollback
code rollback
traffic rollback
configuration rollback
data rollback / forward repair
business compensation
```

Una review che dice genericamente:

> rollback disponibile

senza dire **rollback di cosa** non ha ancora risposto alla domanda.

---

# One-way door review

Prima di un one-way door la readiness bar deve salire.

Esempi:

```text
delete legacy data
retire old API
irreversible schema contraction
external contract cutover
production AI granted write authority
region migration without fallback
```

Prima di procedere dobbiamo chiedere:

```text
What evidence makes this step necessary?
What evidence proves the target is ready?
What fallback disappears after the step?
Who accepts that loss of reversibility?
What observation window was used?
```

La review non deve solo controllare il sistema che stiamo per lanciare.

Deve controllare anche **quali vie di fuga stiamo per eliminare**.

---

# Launch condition vs permanent architecture

Una mitigation di lancio non dovrebbe diventare accidentalmente una policy permanente.

Esempio:

```text
pilot limited to business hours
```

potrebbe essere corretto per il primo launch.

Se due anni dopo il prodotto è business-critical 24x7 e nessuno ha rivisto il support model, il temporary constraint è diventato context drift.

Quindi ogni launch constraint deve avere:

```text
owner
trigger
expiry / milestone
```

---

# ESI: separiamo i launch boundary

Per Order Operations possiamo distinguere almeno quattro boundary.

## LB-CORE

```text
core operator read journey
private workforce access
single-region
```

## LB-ESCALATION

```text
Payment Escalation write
PostgreSQL atomicity
Outbox
Service Bus
Payments integration
```

## LB-PRIORITY-CANDIDATE

```text
ConfirmedPriorityPolicy authoritative
legacy fallback retirement path
```

## LB-AI

```text
Case Explanation Assistant
real provider/model
runtime eval/observability/cost
```

Questi boundary possono avere readiness status differenti.

Per esempio:

```text
LB-CORE              Conditionally Ready / evidence gaps
LB-ESCALATION        Not Ready until OO-001 closure
LB-PRIORITY-CANDIDATE Not Authorized
LB-AI                Not Ready until OO-002 eval + security/runtime gates
```

Questa visibilità è molto più utile di:

```text
Order Operations = 83% ready
```

Una percentuale unica nasconde esattamente ciò che dobbiamo capire.

---

# Release date come decisione, non come verità naturale

Una data può essere importante.

Ma una data non cambia la fisica del sistema.

Se un blocker richiede cinque giorni di lavoro e il launch è domani, abbiamo soltanto tre possibilità oneste:

```text
1. close the blocker
2. reduce the launch boundary
3. explicitly accept the risk with the right authority
```

La quarta opzione:

```text
rename blocker → follow-up
```

non è project management.

È **risk laundering**.

---

# Decision record del go-live

La review dovrebbe terminare con una decisione leggibile:

```text
Decision
GO | CONDITIONAL GO | NO-GO

Launch boundary
<explicit>

Blockers
<list>

Accepted risks
<list + authority>

Disabled/deferred capability
<list>

Evidence package
<refs>

Rollback/fallback
<refs>

Support owner
<owner>

Next review trigger
<date/event>
```

`CONDITIONAL GO` deve significare qualcosa di concreto.

Non:

> andiamo, poi sistemiamo.

Ma:

```text
GO only if:
- evidence X closes;
- feature Y remains disabled;
- cohort stays within Z;
- owner W is on support;
```

---

# La regola

> **Non adattare la definizione di ready alla data. Adatta il launch boundary, il rischio accettato o la data alla evidence che possiedi.**
