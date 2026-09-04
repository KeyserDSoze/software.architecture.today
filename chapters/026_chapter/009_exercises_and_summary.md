# Esercizi, autovalutazione e sintesi

Production Readiness è il punto in cui il libro smette quasi completamente di tollerare formule vaghe.

Non basta più dire:

> il sistema è robusto.

Dobbiamo riuscire a dire:

```text
quale property
quale launch boundary
quale evidence
quale limitation
quale owner
quale rischio residuo
```

---

# Idee chiave

1. **Production-ready non è una proprietà del codice.**
2. Una readiness review deve valutare workload, processi, procedure e persone.
3. `Designed`, `Codified`, `Verified` e `Monitored` non sono sinonimi.
4. Ogni readiness claim dovrebbe essere collegato a evidence e limitation.
5. La freshness dell'evidence conta.
6. Un launch deve avere un boundary esplicito.
7. Core, write capability, migration e AI feature possono avere readiness differenti.
8. Un blocker non diventa follow-up perché la data si avvicina.
9. Risk acceptance richiede l'autorità corretta.
10. Progressive rollout deve avere progression criteria e stop condition.
11. Rollback può significare codice, config, traffico, feature, dati, forward repair o compensazione.
12. Backup configurato non significa recovery verificato.
13. Dashboard esistente non significa observability ready.
14. Un sistema senza owner/support path non è production-ready.
15. Runbook esistente non significa procedura esercitata.
16. AI Feature Contract esistente non significa model behavior verificato.
17. Continuity è una property operativa, non una frase nel README.
18. Production Readiness non è una percentuale di checkbox verdi.
19. Una review che conclude `NO-GO` può aver svolto perfettamente il proprio lavoro.
20. Il go-live è l'inizio della production evidence, non la fine della governance.

---

# Esercizio 1 — Trasforma un “siamo pronti” in claim

Prendi una frase:

> Il database è production-ready.

Scomponila in almeno cinque claim verificabili.

Esempio:

```text
schema migration is repeatable
transaction invariant is verified
backup exists
restore meets target
connection/security boundary is verified
```

Per ogni claim indica:

```text
required evidence
current evidence
limitation
owner
```

---

# Esercizio 2 — Launch boundary

Definisci due launch boundary per lo stesso sistema.

### A — internal pilot

### B — external 24x7 production

Confronta almeno:

- user cohort;
- traffic;
- support;
- DR;
- capacity;
- security exposure;
- rollout;
- compliance;
- monitoring.

Domanda:

> quali quality floor non cambiano fra A e B?

---

# Esercizio 3 — Blocker o Accepted Risk?

Classifica:

```text
restore never tested
no multi-region
alert drill pending
one optional dashboard missing
cross-tenant negative test missing
AI assistant not evaluated but disabled
```

Non usare soltanto:

```text
blocker / non blocker
```

Aggiungi:

```text
launch boundary
impact
acceptance authority
mitigation
```

---

# Esercizio 4 — Rollback taxonomy

Per una modifica reale del tuo progetto elenca:

```text
code rollback
configuration rollback
feature rollback
traffic rollback
data rollback
forward repair
business compensation
```

Quali sono disponibili?

Quali non servono?

Quali stavi implicitamente chiamando tutti “rollback”?

---

# Esercizio 5 — Readiness evidence audit

Prendi cinque righe verdi di una checklist esistente.

Per ciascuna chiedi:

> qual è l'evidence primaria?

Se trovi soltanto:

```text
screenshot
document exists
someone remembers testing it
```

classifica la strength dell'evidence.

---

# Esercizio 6 — Runbook exercise

Scegli un runbook operativo.

Fallo eseguire da una persona che non lo ha scritto.

Registra:

```text
step unclear
permission missing
command stale
missing decision
hidden knowledge
result
```

Non correggere il runbook durante l'esercizio senza registrare il gap.

---

# Esercizio 7 — Alert chain

Prendi un failure critico e costruisci:

```text
failure
→ signal
→ alert
→ owner
→ first action
→ resolution signal
```

Se un passaggio manca, hai trovato un readiness gap.

---

# Esercizio 8 — AI launch separation

Hai un prodotto stabile a cui hai aggiunto un AI assistant.

L'AI eval non è ancora sufficiente.

Progetta due opzioni:

```text
A. delay entire launch
B. launch deterministic core with AI disabled
```

Quale scegli?

Da quali dependency e product constraint dipende?

---

# Esercizio 9 — Go/No-Go senza votazione

Simula:

```text
Product        GO
Engineering    GO
Security       NO-GO
Operations     CONDITIONAL
Finance        GO
```

Definisci:

- quale finding ha Security;
- quale finding ha Operations;
- chi ha l'autorità di accettare i rischi;
- quale launch boundary alternativo potrebbe sbloccare il go-live.

---

# Esercizio 10 — Crea la Production Readiness Review

Usa un sistema reale o simulato.

La review deve avere almeno:

```text
Launch boundary
Decision
Readiness matrix
Blocker register
Accepted risk register
Disabled/deferred capability
Deployment / rollback
Operational ownership
Security
Data
Reliability / recovery
Observability
Capacity
Cost
AI readiness if applicable
Continuity
Evidence package
Next review triggers
```

---

# Self-assessment

Prova a rispondere senza tornare al testo.

1. Perché production readiness non coincide con code completeness?
2. Qual è la differenza fra readiness claim ed evidence?
3. Perché una evidence può scadere?
4. Che cosa significa launch boundary?
5. Perché non vuoi un readiness score unico tipo `87%`?
6. Quando un gap può diventare Accepted Risk?
7. Chi può accettare un security risk?
8. Che differenza c'è fra rollback del codice e rollback del sistema?
9. Perché feature flag non risolve ogni rollback?
10. Perché backup e recovery non sono sinonimi?
11. Che cosa deve dimostrare un alert drill?
12. Perché il support model fa parte dell'architettura operativa?
13. Che relazione c'è fra runbook e continuity?
14. Perché capacity evidence dipende dal launch boundary?
15. Perché un AI assistant può restare disabilitato mentre il core va in produzione?
16. Quali proprietà AI-specifiche entreresti nella PRR?
17. Qual è il rischio di checklist theatre?
18. Che cos'è evidence laundering?
19. Perché un `NO-GO` può essere un ottimo risultato?
20. Quando riapriresti una Production Readiness Review dopo il launch?

---

# Artefatto operativo — Production Readiness Review

Template minimo:

```text
# Production Readiness Review

## Launch boundary
Users:
Capabilities:
Environment/region:
Traffic/volume:
Support promise:
Explicitly excluded:

## Decision
READY | CONDITIONAL GO | NO-GO

## Readiness claims
Area | Claim | Evidence | Limitation | State | Owner

## Blockers
ID | Condition | Required evidence | Owner | Closure

## Accepted risks
ID | Risk | Impact | Mitigation | Authority | Expiry/trigger

## Deployment
Artifact:
Rollout:
Progression criteria:
Stop condition:
Rollback/fallback:
Data consequence:

## Operations
Owner:
On-call/support window:
Runbooks/playbooks:
Incident access:
Escalation:

## Security
Required controls:
Runtime evidence:
Residual risk:

## Reliability / recovery
SLO:
RTO/RPO:
Backup:
Restore/failover evidence:

## Observability
SLI:
Alerts:
Alert drill:
Synthetic/smoke:

## Capacity
Expected load:
Headroom:
Evidence:

## Cost
Allocation:
Major premiums:
Unit metric:

## AI — if applicable
Authority:
Eval:
Security:
Latency/cost:
Fallback:

## Continuity
Secondary maintainer:
Continuity drill:

## Not verified
...

## Next review trigger
...
```

Il template non è una checklist obbligatoria per ogni sistema.

È un vocabolario di launch risk.

---

# ESI — stato finale del capitolo

La review di Order Operations produce:

```text
Decision
NO-GO — evidence closure required
```

con launch boundary separati:

```text
LB-CORE
→ not yet ready

LB-ESCALATION
→ blocked by PostgreSQL/integration evidence

LB-PRIORITY-CANDIDATE
→ not authorized

LB-AI
→ not ready / disabled
```

Questo è il risultato corretto rispetto allo stato reale del capstone.

Non abbiamo scritto venticinque capitoli sulla differenza fra `Designed` e `Verified` per dimenticarcene quando arriva la pressione del launch.

---

# Che cosa cambia con l'AI

L'AI accelera molte attività di readiness:

```text
generate checklist candidate
inspect configuration
build evidence matrix
summarize gaps
produce runbook draft
review logs
simulate failure hypotheses
prepare launch report
```

Ma introduce anche nuovi rischi:

```text
AI says all checks pass
→ which checks?
→ against which environment?
→ with which authority?
```

Un agente può aiutare a raccogliere evidence.

Non deve trasformare absence of evidence in green status.

E quando l'AI è dentro il prodotto, il modello stesso diventa un nuovo launch boundary con:

```text
eval
provider
security
fallback
latency
cost
monitoring
```

---

# Corollario

> **Production-ready non significa che non succederà niente di brutto. Significa che abbiamo abbastanza evidenza per sapere quale promessa stiamo facendo, quali failure abbiamo preparato e chi è responsabile quando la realtà si discosta dal piano.**

E soprattutto:

> **Readiness non è ottenere un sì. È rendere costoso dire sì senza sapere perché.**

---

# Il prossimo passo

Il Capitolo 27 chiude la parte operativa con **casi end-to-end**.

Non introdurremo una nuova area tecnica.

Faremo qualcosa di diverso:

```text
problem
→ analysis
→ architecture
→ implementation
→ evidence
→ production decision
```

attraversando sistemi con caratteristiche differenti.

Dopo aver studiato le singole decisioni, vedremo finalmente **come si concatenano quando nessuna di esse vive da sola**.
