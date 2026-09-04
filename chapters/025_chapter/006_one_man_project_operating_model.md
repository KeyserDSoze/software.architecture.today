# One-Man Project Operating Model

Il One-Man Project ha bisogno di un artefatto operativo per una ragione precisa: il suo failure mode naturale è lasciare troppo controllo implicito nella testa del lead.

L’**One-Man Project Operating Model** rende quindi esplicito quanto lavoro una singola persona può governare, quali authority non possiede, quale parallelismo è sostenibile e quale evidence deve esistere perché il progetto non dipenda dalla sua presenza continua.

Non è un organigramma. È un **control-plane contract**.

## Missione e accountable lead

Il modello parte da product/capability, business outcome, scope, criticality e current phase. Senza questo contesto è impossibile capire se il leverage sta servendo un outcome o soltanto aumentando activity.

Per il pilot ESI la capability è il Case Explanation Assistant e l’outcome è ridurre il costo cognitivo dell’investigazione operativa senza trasferire al modello decision authority.

Il documento assegna poi un **Accountable Project Lead**, ma separa due insiemi che spesso vengono confusi:

```text
may decide
→ bounded implementation
→ local reversible design
→ work-item decomposition
→ agent scheduling

may not decide alone
→ payment semantics
→ security exception
→ public ingress
→ regulated retention
→ destructive production migration
```

Questa sezione è fondamentale perché accountability non equivale a sovereign authority.

## Secondary Maintainer e continuity

Il modello richiede un Secondary Maintainer capace di assumere temporaneamente il control plane. Non deve partecipare a ogni commit e non duplica il lavoro del lead; deve però saper entrare dal repository, eseguire i golden command, ricostruire current work, distinguere evidence state e trovare escalation path.

Il continuity plan collega quindi entry point, work item, runbook, golden command e specialist gate. Ogni voce che rimane “solo il lead sa…” è knowledge debt.

Il piano diventa evidence soltanto quando viene esercitato. Per questo l’Operating Model distingue chiaramente:

```text
continuity plan   Designed/Codified
continuity drill  Pending until executed
```

## Agent portfolio e WIP

L’agent portfolio non serve a creare un ruolo per ogni modello. Serve a chiarire quali responsabilità possono essere delegate e con quali permission.

| Role | Purpose | Boundary |
|---|---|---|
| Explorer | discovery e source reconstruction | read-only |
| Implementer / Eval Implementer | bounded code/test/eval | scoped workspace |
| Independent Verifier | primary-evidence review | read/test/eval |
| Documentation Synchronizer | update approved canonical docs | scoped docs |
| Adversarial/Security Reviewer | challenge failure/security assumptions | review-only by default |

Il WIP limit protegge il control plane dal successo del data plane. ESI parte con due active execution task, un solo cross-boundary task e una sola unresolved semantic decision. Non perché questi numeri siano universali, ma perché il sistema ha bisogno di una policy iniziale osservabile.

Se review backlog o repair loop crescono, il problema non è “lanciare più agenti”. È rivalutare WIP, task preparation o verification.

## Decision rights e specialist trigger

Il cuore dell’Operating Model è una mappa delle decision rights.

Una local reversible implementation può essere decisa dal lead. Un model/provider candidate può essere preparato e raccomandato dentro l’AI Feature Contract. Una nuova business semantic richiede Product/Operations. Un economic side effect appartiene a Payments & Risk. Public ingress o sensitive data path richiedono Security e, quando rilevante, Platform o Legal/Compliance.

Il gate scatta per **boundary crossing**, non per appartenenza nominale del task a una disciplina.

Questo evita due estremi: nessuno specialista mai, oppure tutti gli specialisti su ogni modifica.

## Verification model

Il documento separa anche quattro livelli di evidence.

Alcune proprietà sono self-verifiable dentro bounded execution: typecheck, fast test, fitness gate. Altre richiedono independent verification. Alcune esistono soltanto attraversando un environment reale, come PostgreSQL semantics o Azure identity/network behavior. Infine ci sono decisioni che richiedono human/domain acceptance anche quando l’evidence tecnica è forte.

Questa distinzione impedisce al lead di usare la propria centralità come scorciatoia verso self-certification.

## Operating cadence e metriche

Il modello non deve trasformare la giornata in agent polling continuo. Una cadence utile raggruppa review e decisioni, protegge il WIP e crea momenti in cui controllare risk, knowledge debt e specialist-gate frequency.

Le metriche devono misurare l’operating model, non la spettacolarità dell’automazione. Ci interessano verified outcome throughput, lead time, rework, review backlog, unresolved decision age, human review effort, cost per verified outcome e continuity drill result.

Finché questi dati non esistono, restano `Designed/Pending`. Non inventiamo numeri per dimostrare in anticipo che il modello funziona.

## Exit criteria: il modello deve sapersi fermare

La sezione più importante non riguarda come iniziare. Riguarda come riconoscere che il One-Man Project non è più il modello giusto.

Review backlog persistente, 24/7 incident burden, specialist gate diventati quotidiani, crescita dei consumer pubblici, aumento delle one-way door, Secondary Maintainer che non riesce più a restare sufficientemente familiare o operational workload che sottrae sistematicamente tempo a Product e Architecture sono tutti segnali di uscita.

La risposta può essere aggiungere maintainer, creare un team stabile, dividere responsibility, estrarre una capability di piattaforma o ridurre scope.

Questo non è un fallimento del pilot.

> **Un operating model maturo deve sapere non soltanto come sfruttare il leverage, ma anche quando il leverage ha cambiato abbastanza il sistema da richiedere una nuova organizzazione.**

## Baseline ESI

Il repository conserva oggi una baseline molto chiara:

```text
Operating Model document    Codified
WIP / decision-right policy Codified
Secondary Maintainer role   Designed
Continuity drill            Pending
Real workflow throughput    Pending
Real agent unit economics   Pending
Production support fit      Pending
```

Questa è la maturità corretta del Capitolo 25. Il modello è progettato abbastanza da essere usato; non è ancora provato abbastanza da essere celebrato come successo operativo.

> **Il One-Man Project non è un modo per fare con una persona il lavoro di dieci persone. È un modo per governare con una persona il lavoro che una persona può davvero controllare quando l’execution non è più il limite principale.**
