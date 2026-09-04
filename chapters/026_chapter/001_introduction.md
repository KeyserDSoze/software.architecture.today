# Capitolo 26 — Production Readiness

## Il momento in cui smettiamo di parlare al condizionale

Per venticinque capitoli abbiamo costruito, smontato, corretto e governato **Order Operations**.

Abbiamo definito il problema.

Abbiamo scritto analisi funzionale e requisiti.

Abbiamo discusso confini, API, dati, sistemi distribuiti, cloud, security, reliability, observability, testing, legacy, refactoring, costi, repository AI-ready, issue-driven development, agent governance e AI runtime.

Abbiamo anche imparato a distinguere:

```text
Designed
→ Codified
→ Verified
→ Monitored
```

Ora arriva la domanda che rende quella distinzione impossibile da ignorare:

> **Siamo disposti ad affidarci davvero a questo sistema?**

Non:

> abbiamo finito lo sviluppo?

Non:

> la demo funziona?

Non:

> i test locali sono verdi?

Ma:

> se domani il workload serve utenti reali, fallisce una dipendenza, viene distribuito un cambiamento sbagliato, un certificato scade, una persona è assente o dobbiamo ripristinare dati, sappiamo che cosa fare e abbiamo evidence sufficiente per assumerci la responsabilità?

Questa è **Production Readiness**.

---

## Production-ready non è una proprietà del codice

Un repository può compilare perfettamente e non essere pronto alla produzione.

Un'applicazione può avere ottima code coverage e non avere:

- backup ripristinabili;
- ownership operativa;
- alert azionabili;
- rollback praticabile;
- capacity evidence;
- runbook;
- security verification;
- support model;
- accesso di emergenza;
- cost visibility;
- una persona che sappia cosa fare alle tre del mattino.

Il problema è che molte di queste mancanze restano invisibili finché il sistema non viene affidato a utenti reali.

La production readiness serve proprio a **portare quelle domande prima del go-live**.

AWS definisce l'operational readiness come la valutazione del workload, dei processi, delle procedure e delle persone necessarie a supportarlo. La relativa guidance include review coerenti, runbook, playbook, decisioni informate sul deployment e piani di supporto.

- [AWS Well-Architected — How do you know that you are ready to support a workload?](https://docs.aws.amazon.com/wellarchitected/latest/framework/ops-07.html)
- [AWS — Operational Readiness Reviews](https://docs.aws.amazon.com/wellarchitected/latest/operational-readiness-reviews/wa-operational-readiness-reviews.html)

Google SRE, nel proprio Launch Coordination Checklist storico, include già architecture, capacity, failure, monitoring, operational procedures e dependency behavior fra le domande da affrontare prima di un lancio.

- [Google SRE — Launch Coordination Checklist](https://sre.google/sre-book/launch-checklist/)

Il punto non è adottare una checklist universale.

Il punto è molto più semplice:

> **prima del go-live dobbiamo verificare che il sistema, l'organizzazione e i processi che lo circondano siano capaci di sostenere ciò che stiamo per promettere.**

---

# Readiness non significa perfezione

Nessun sistema serio arriva in produzione con rischio zero.

Se la Production Readiness Review richiedesse:

```text
0 bug
0 unknown
0 technical debt
0 pending improvement
0 operational risk
```

nessun workload partirebbe mai.

La review deve invece distinguere almeno quattro categorie:

```text
BLOCKER
→ non possiamo lanciare senza questa evidence/capability

ACCEPTED RISK
→ il rischio è conosciuto, bounded, owned e accettato dall'autorità corretta

FOLLOW-UP
→ miglioramento utile ma non necessario per il current launch boundary

UNKNOWN
→ non sappiamo ancora abbastanza per classificare il rischio
```

La categoria più pericolosa non è necessariamente `Accepted Risk`.

È spesso `Unknown` travestito da:

> dovrebbe andare.

---

# Una checklist non può accettare il rischio

Una checklist può mostrare:

```text
backup restore drill = missing
```

Non può decidere da sola se possiamo lanciare comunque.

Quella è una decisione di rischio.

Deve coinvolgere l'owner corretto.

Per esempio:

```text
Security
→ accetta o rifiuta un security residual risk

Product / Business
→ accetta una limitazione funzionale o di availability

Payments & Risk
→ decide sui rischi economici nel proprio dominio

Operations
→ dichiara se il sistema è realmente supportabile

Engineering
→ presenta evidence tecnica e mitigation

Leadership / accountable owner
→ autorizza il rischio residuo appropriato
```

Questo è coerente con il mondo ESI che abbiamo costruito fin dall'inizio.

L'architettura non elimina il compromesso.

Rende leggibile **chi sta accettando quale compromesso**.

---

# Il compromesso ESI del capitolo

Order Operations è ormai abbastanza maturo da creare pressione per un go-live.

Immaginiamo il contesto simulato:

```text
Product
→ vuole iniziare il pilot operativo

Sales / Customer Success
→ vuole una data credibile

Engineering
→ vuole smettere di accumulare preparazione

Security
→ vede ancora verification gap

Reliability / Operations
→ non ha ancora restore/failover evidence

Platform
→ non ha ancora deployment validation completa

Finance
→ non vuole mantenere indefinitamente ambienti e capability non utilizzate
```

La tentazione è:

> abbiamo già fatto tantissimo, lanciamo e chiudiamo gli ultimi dettagli dopo.

Ma il repository ci dice qualcosa di diverso.

Abbiamo ancora gap espliciti:

```text
PostgreSQL transaction evidence
Azure deployment / network / RBAC evidence
restore / failover drill
production observability evidence
private synthetic journey
AI model evaluation
continuity drill
```

Alcuni di questi saranno blocker per il workload core.

Altri possono essere blocker soltanto per la capability AI.

Altri ancora possono essere follow-up.

Questa classificazione è il lavoro del capitolo.

---

# Non tutto deve avere lo stesso launch boundary

Un'altra idea importante:

> **il prodotto e tutte le sue capability non devono necessariamente diventare production-ready nello stesso momento.**

Per ESI potremmo avere:

```text
Order Operations core
→ launch candidate

Payment Escalation
→ launch candidate dopo PostgreSQL/broker evidence

Priority candidate cutover
→ ancora non autorizzato

Case Explanation Assistant
→ pilot separato dopo real model eval
```

Questo riduce un failure mode comune:

```text
one unfinished capability
→ blocca tutto
```

oppure il contrario:

```text
core ready
→ assumiamo che anche ogni nuova capability lo sia
```

Il **launch boundary** deve essere esplicito.

---

# Operational Readiness e Production Readiness

Nel libro useremo due espressioni correlate.

## Operational Readiness

Domanda:

> sappiamo operare e supportare questo workload?

Include soprattutto:

- ownership;
- support model;
- on-call;
- runbook/playbook;
- monitoring/alerting;
- accessi;
- incident response;
- deployment/rollback;
- backup/recovery;
- capacity;
- routine operations.

## Production Readiness

Domanda più ampia:

> abbiamo evidence sufficiente per dichiarare che il **launch boundary corrente** può entrare nel mondo reale con il rischio residuo che siamo disposti ad accettare?

Include Operational Readiness, ma anche:

- functional correctness;
- security;
- data integrity;
- reliability;
- API/event compatibility;
- cost;
- AI evaluation quando applicabile;
- legal/compliance quando applicabile;
- known risk e acceptance authority.

Non serve litigare sui nomi.

Serve non dimenticare nessuna delle due prospettive.

---

# La review non deve nascere alla fine

AWS descrive le Operational Readiness Review come un meccanismo che dovrebbe entrare nel ciclo di sviluppo e incorporare anche lesson learned dagli incidenti, non come una formalità eseguita cinque minuti prima del lancio.

- [AWS — ORR gaining adoption](https://docs.aws.amazon.com/wellarchitected/latest/operational-readiness-reviews/gaining-adoption.html)

Questo coincide con il percorso del libro.

In realtà abbiamo preparato la Production Readiness Review fin dal Capitolo 2.

Ogni artefatto ha accumulato una parte della risposta:

```text
Functional Analysis
→ sappiamo cosa deve fare?

Threat Model
→ sappiamo come può essere abusato?

Reliability Contract
→ sappiamo che cosa significa sano e recuperabile?

Observability Contract
→ sappiamo osservarlo?

Testing Strategy
→ sappiamo che cosa abbiamo verificato?

Cost Model
→ sappiamo quanto ci costa e perché?

AI Feature Contract
→ sappiamo che authority ha il modello?

One-Man Project Operating Model
→ sappiamo chi lo governa e cosa succede se manca?
```

La Production Readiness Review non inventa queste risposte.

Le **raccoglie, confronta e trasforma in una decisione di launch**.

---

# La regola del capitolo

> **Non dichiarare production-ready ciò che sai soltanto descrivere. Dichiaralo quando hai abbastanza evidence per essere disposto a operarlo.**

E questo significa anche accettare una conclusione apparentemente scomoda:

```text
Production Readiness Review
→ NOT READY
```

può essere un ottimo risultato.

Se scopre un blocker prima degli utenti, la review ha funzionato.

> **Readiness non è ottenere un sì. È rendere costoso dire sì senza sapere perché.**
