# Ownership, on-call, runbook e support model

Un sistema senza owner può essere deployato e può persino funzionare per mesi. Il problema emerge quando qualcosa cambia o fallisce.

In quel momento dobbiamo sapere chi osserva, chi decide, chi interviene, chi comunica e chi può accettare il rischio residuo.

Production Readiness riguarda quindi anche **l’organizzazione attorno al workload**.

## “Il team” non è abbastanza preciso

Dire “se succede qualcosa ci pensa il team” non descrive un support model.

Product owner, workload owner, operational owner, security escalation owner e dependency owner possono anche coincidere in una piccola organizzazione. Ma la responsabilità deve essere esplicita abbastanza da permettere a chi riceve un alert di sapere quale authority possiede e quando deve escalare.

Order Operations dipende da Orders, Payments & Risk, Shipping, Entra, PostgreSQL, Service Bus e platform/network capability. Il workload team non possiede tutti questi sistemi. Possiede però **il modo in cui dipende da essi**.

Per ogni critical dependency deve quindi conoscere expected behavior, failure mode, fallback/degradation, owner e escalation path.

> **Non controlliamo ogni dipendenza. Controlliamo il modo in cui il nostro sistema reagisce quando la dipendenza non fa ciò che speravamo.**

## Support window è parte della promessa

Un internal pilot può avere business-hours support se questa è la promessa esplicita accettata dal business. Non diventa automaticamente 24x7 perché il cloud rimane acceso durante la notte.

Il support model deve chiarire chi riceve page e ticket, che cosa accade fuori orario, quale escalation esiste, quali access sono necessari e chi comunica il business impact.

Questa dimensione è particolarmente importante nel One-Man Project: aumentare execution capacity non produce automaticamente più ore di on-call.

Se support load, maintenance o incident volume superano il control plane umano, deve cambiare l’operating model.

## Runbook e playbook devono trasformare knowledge in action

AWS distingue runbook, adatti a procedure note e relativamente deterministiche, e playbook, usati per guidare investigation e response quando la causa non è ancora chiara.

Fonte:

- [AWS Well-Architected — Operational readiness](https://docs.aws.amazon.com/wellarchitected/latest/operational-excellence-pillar/operational-readiness.html)

Per Order Operations un runbook può descrivere un rollback approvato o un PostgreSQL restore. Un playbook può guidare l’investigazione quando Payment Escalation SLO brucia e dobbiamo capire se il problema vive nell’outbox, nel broker o nel consumer.

Il valore non è il file. È la capacità di portare una persona da un segnale a una prima azione corretta.

Un runbook che dice “chiedi a Marco” è una dependency umana nascosta, non una procedura.

## Un runbook è readiness evidence soltanto quando viene esercitato

Come per tutte le altre proprietà:

```text
runbook exists
≠
procedure Verified
```

Una persona diversa dall’autore deve poterlo usare, con permission realmente disponibili, command ancora validi e decision point comprensibili.

Questo collega direttamente Production Readiness al Continuity Test del Capitolo 25. Il Secondary Maintainer non è un dettaglio organizzativo: è uno dei modi con cui verifichiamo che recovery knowledge appartenga al sistema e non a una sola memoria.

## Access readiness: least privilege deve restare operabile

Un incidente è il momento peggiore per scoprire che l’on-call non può leggere i log, che il rollback role richiede un approvatore irreperibile o che il break-glass path non funziona più.

La readiness deve verificare il percorso di accesso durante il failure, mantenendo least privilege, audit e revocation.

Security e operability si incontrano qui: troppa permission permanente aumenta il rischio; zero permission praticabile durante un incidente rende il sistema non recuperabile.

## L’alert chain deve arrivare fino all’azione

Un alert senza owner è telemetry senza operational meaning.

Per una condizione importante vogliamo una catena completa:

```text
failure
→ signal
→ alert
→ owner
→ first action
→ resolution signal
```

Application Insights configurato non dimostra questa catena. Serve almeno uno staged alert exercise o un drill equivalente.

## La review deve imparare dagli incidenti

AWS descrive le Operational Readiness Review come un processo che incorpora lesson learned e le trasforma in review question e meccanismi riutilizzabili.

Fonte:

- [AWS — Operational Readiness Reviews](https://docs.aws.amazon.com/wellarchitected/latest/operational-readiness-reviews/wa-operational-readiness-reviews.html)

Il ciclo utile è:

```text
incident
→ learning
→ readiness question / fitness / runbook
→ future change safer
```

La readiness quindi non è soltanto una porta pre-produzione. È una memoria organizzativa dei failure che non vogliamo pagare due volte.

## Baseline ESI

Order Operations ha già una ownership direction leggibile: Commerce & Operations possiede il workload, Product/Operations il business outcome, Payments & Risk gli economic effect, Platform network/platform boundary e Security la policy/escalation pertinente.

Il One-Man Project Operating Model definisce Accountable Project Lead e richiede un Secondary Maintainer.

Ma la evidence resta incompleta:

```text
operating model        Codified
secondary role         Designed
continuity drill       Pending
production support     Pending
alert drill            Pending
incident access        Pending
```

Per questo la PRR non può convertire “owner documentato” in “operability Verified”.

La domanda finale è molto semplice: una persona diversa dall’autore principale vede che il sistema sta degradando. Sa da dove iniziare, ha accesso, trova il runbook e conosce l’escalation?

Se deve aspettare che torni chi ha costruito il sistema, abbiamo trovato un blocker organizzativo reale.

> **Un sistema è più vicino alla produzione quando il sapere necessario per operarlo appartiene al prodotto e all’organizzazione, non soltanto alla memoria del suo autore.**
