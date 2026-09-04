# Ownership, on-call, runbook e support model

Un sistema senza owner non è production-ready.

Può essere deployato.

Può anche funzionare per mesi.

Ma quando qualcosa cambia o fallisce, qualcuno deve sapere:

```text
chi osserva
chi decide
chi interviene
chi comunica
chi accetta il rischio
```

Production Readiness riguarda quindi anche **l'organizzazione attorno al workload**.

---

## “Il team” non è un owner

Frasi come:

> se succede qualcosa ci pensa il team.

sono troppo vaghe.

Serve distinguere almeno:

```text
Product owner
Technical/workload owner
Operational owner
Security escalation owner
Dependency owner
Business escalation owner
```

In alcuni team più ruoli possono essere coperti dalle stesse persone.

Non importa.

Importa che la responsabilità sia esplicita.

---

# Ownership del prodotto e ownership della dipendenza

Order Operations dipende da:

```text
Orders
Payments & Risk
Shipping
Entra
PostgreSQL
Service Bus
Azure platform/network
```

Il workload team non possiede tutti questi sistemi.

Ma possiede il modo in cui **dipende** da essi.

Quindi la readiness deve conoscere:

```text
Dependency
Owner/contact
Expected behavior
Failure mode
Escalation path
Fallback/degradation
SLO/contract when applicable
```

> **Non controlliamo la dipendenza. Controlliamo il modo in cui dipendiamo da essa.**

---

# On-call non significa solo numero di telefono

Un support model deve rispondere:

```text
When are we supported?
Who receives alerts?
Which alerts page?
Which alerts create tickets?
What is the escalation path?
Which access is needed?
How is access obtained?
What happens outside support hours?
Who communicates business impact?
```

Un internal pilot può anche avere:

```text
business-hours support
```

se il business accetta quella promessa.

Ma non può dichiararsi implicitamente 24x7 soltanto perché il cloud gira 24x7.

---

# Runbook e playbook

AWS distingue nella propria operational-excellence guidance runbook per procedure note/routine e playbook per investigation/response a problemi.

- [AWS Well-Architected — Operational readiness](https://docs.aws.amazon.com/wellarchitected/latest/operational-excellence-pillar/operational-readiness.html)

Una distinzione pragmatica:

## Runbook

Procedura relativamente deterministica.

Esempi:

```text
restart/scale publisher
perform approved rollback
rotate an external provider secret
execute PostgreSQL restore procedure
redrive an approved DLQ batch
```

## Playbook

Guida all'investigazione quando la causa non è ancora nota.

Esempio:

```text
Payment Escalation SLO burning
→ inspect outbox oldest age
→ inspect Service Bus
→ inspect downstream consumer
→ correlate deployment
→ classify backlog/failure
```

Un runbook non dovrebbe essere:

> chiedi a Marco.

Quella non è una procedura.

È una dipendenza umana nascosta.

---

# Un runbook deve essere esercitabile

Come per il resto del libro:

```text
runbook exists
≠
procedure Verified
```

Un buon readiness gate chiede:

```text
Has someone other than the author used it?
Did the command still work?
Were required permissions available?
Were decision points clear?
Did the procedure produce the expected outcome?
```

Qui torna il **Continuity / Vacation Drill** del Capitolo 25.

Un secondary maintainer che riesce a trovare e utilizzare runbook reali è evidence molto più forte di una cartella `docs/runbooks/` piena.

---

# Access readiness

Un incidente non è il momento giusto per scoprire che:

```text
on-call cannot query production logs
rollback role requires approval from unavailable owner
break-glass account is expired
private endpoint is unreachable from support path
```

La readiness deve verificare:

- least-privilege support access;
- JIT/JEA o meccanismo equivalente quando previsto;
- break-glass governance;
- audit;
- revocation;
- access path durante incidenti.

Security e operability devono incontrarsi qui.

Troppa permission permanente aumenta rischio.

Zero permission praticabile durante un incidente rende il sistema non operabile.

---

# Alert ownership

Un alert senza owner è telemetry con senso di colpa.

Ogni page alert deve avere almeno:

```text
impact
urgency
owner
first action
context/runbook
resolution signal
```

Lo abbiamo già definito nell'Observability Contract.

Production Readiness deve verificare che la catena esista davvero:

```text
condition
→ signal
→ alert
→ person/team
→ action
```

Non basta:

```text
Application Insights configured
```

---

# Operational load è un requisito organizzativo

Un sistema può essere tecnicamente corretto e organizzativamente insostenibile.

Domande:

```text
How many alerts do we expect?
How much routine maintenance exists?
How often do specialist gates occur?
How many manual recovery steps exist?
How much support load can current ownership absorb?
```

Questo è particolarmente importante per il **One-Man Project**.

La capacità di generare più software non crea automaticamente più ore di on-call.

Se l'operational load supera il control plane umano, il modello organizzativo deve cambiare.

---

# Operational Readiness Review come meccanismo vivo

AWS descrive le ORR come un processo che dovrebbe incorporare le lesson learned dagli incidenti e trasformarle in domande/controlli riutilizzabili.

- [AWS — Operational Readiness Reviews](https://docs.aws.amazon.com/wellarchitected/latest/operational-readiness-reviews/wa-operational-readiness-reviews.html)

Questo suggerisce un ciclo:

```text
incident
→ learning
→ new readiness question / fitness / runbook
→ next workload/change safer
```

La review quindi non è solo una porta prima della produzione.

È anche un modo per fare in modo che l'organizzazione **non paghi due volte lo stesso incidente evitabile**.

---

# Order Operations support model

Per il pilot ESI possiamo definire una prima direzione:

```text
Workload owner
Commerce & Operations / Order Operations

Accountable technical lead
One-Man Project pilot lead

Secondary maintainer
required before production ownership

Business owner
Product / Operations

Payments escalation
Payments & Risk

Platform/network escalation
Platform Engineering

Security incident escalation
Security
```

Ma lo stato corrente deve essere onesto:

```text
operating model documented
secondary-maintainer role designed
continuity drill pending
production on-call schedule pending
alert drill pending
production access verification pending
```

Quindi l'ownership è **designed**, ma parte della operability evidence è ancora incompleta.

---

# Ownership transfer

Una cosa deve essere chiara prima del launch:

> chi possiede il sistema il giorno dopo il progetto?

Molti workload vengono costruiti da un project team temporaneo e poi “passati alle operations”.

Questo handoff è pericoloso se chi riceve il sistema non ha partecipato a:

```text
failure model
SLO
runbook
alerting
security model
recovery drill
```

Meglio pensare:

> **you build it, you understand how it runs — anche quando l'operational model distribuisce il supporto fra più ruoli.**

Non significa che ogni developer debba essere sempre on-call.

Significa che build e run non possono essere due mondi cognitivamente scollegati.

---

# La domanda più semplice

Una Production Readiness Review dovrebbe poter chiedere a una persona diversa dall'autore principale:

> Il sistema sta degradando. Da dove inizi?

Se la risposta è:

> devo aspettare che torni chi l'ha costruito.

abbiamo trovato un blocker organizzativo molto più importante di molti warning statici.

> **Un sistema è più vicino alla produzione quando il sapere necessario per operarlo appartiene al sistema e all'organizzazione, non soltanto alla memoria del suo autore.**
