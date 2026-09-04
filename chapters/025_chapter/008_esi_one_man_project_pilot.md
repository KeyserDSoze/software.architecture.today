# ESI — Il pilot One-Man Project

ESI sceglie il **Case Explanation Assistant** come primo esperimento del One-Man Project Operating Model.

La scelta è intenzionale. Non parte da Payments ledger, production identity o disaster recovery. Parte da una capability interna, read-only, advisory, con source provenance, fallback e nessun write tool.

Questo non rende il pilot banale. Lo rende **governabile abbastanza da poter studiare il leverage senza confonderlo con un blast radius eccessivo**.

## Il mandato del lead

Un singolo **Accountable Project Lead** governa il control plane tecnico del pilot. Mantiene direzione, prepara work item, orchestra agenti, integra evidence, controlla WIP e mantiene sincronizzato il repository context.

La sua authority termina però dove iniziano decisioni che appartengono ad altri owner. Non può ridefinire payment truth, approvare security exception, cambiare tenant isolation, introdurre una customer-facing AI action o concedere production write permission al modello.

Questa separazione rende possibile concentrare execution senza concentrare tutta l’autorità.

## Il Secondary Maintainer è parte del design

Il pilot richiede anche un **Secondary Maintainer**. Non è un secondo implementer permanente e non duplica il lead su ogni task.

Deve però poter entrare da `AGENTS.md`, usare la Repository Map, capire l’AI Feature Contract, eseguire i golden command, ricostruire work item e distinguere evidence `Designed`, `Codified`, `Verified` e `Monitored`.

Il ruolo esiste già nell’Operating Model; la prova della continuità no. Il continuity drill resta Pending finché non viene realmente eseguito.

## Il work portfolio

Nel repository esiste già `OO-001`, dedicato alla PostgreSQL atomicity di Payment Escalation + Outbox. Il Capitolo 24 ha inoltre lasciato intenzionalmente aperta la scelta del model/provider per il Case Explanation Assistant.

Per questo ESI introduce `OO-002`:

```text
Evaluate Case Explanation model/provider candidates
against the same eval suite
```

Il task non deve trovare “il modello migliore in assoluto”. Deve produrre evidence comparabile rispetto all’AI Feature Contract: groundedness, source attribution, missing-evidence behavior, prompt-injection e authority-boundary case, latency, cost e provider constraint.

La decisione finale resta una decisione di fit.

## Non saturiamo la task queue

Il pilot parte con una policy semplice:

```text
Max active execution tasks       2
Max active cross-boundary tasks  1
Max unresolved semantic gates    1
```

`OO-001` e `OO-002` possono quindi essere entrambi Ready senza essere necessariamente Active nello stesso momento.

Questo è un comportamento importante da rendere esplicito: l’esistenza di agent capacity non crea un obbligo a usarla.

> **Una queue di lavoro pronto è una riserva di capacità, non un target di saturazione.**

## L’agent portfolio serve la verification chain

Per `OO-002` ESI può usare un Explorer read-only per ricostruire capability e constraint dei provider, un Eval Implementer per costruire adapter candidati fuori dal semantic core e un Adversarial Verifier per rieseguire i case critici e cercare authority violation.

Il Documentation Synchronizer entra solo dopo una decisione approvata, per aggiornare AI Feature Contract, Cost Model o Testing Strategy senza inventare rationale.

La topologia segue il lavoro, non il desiderio di avere molti agenti.

Il flow del pilot è quindi:

```text
Human Lead
→ OO-002 execution contract
→ candidate research
→ bounded eval execution
→ primary evidence
→ adversarial verification
→ human integration
→ specialist gates if triggered
→ decision / ADR / contract update
```

La scelta finale del provider non viene delegata al grader. Il modello influenza qualità, security posture, cost, latency, provider dependency e operational model: proprietà che devono essere integrate insieme.

## I gate restano trigger-based

Product/Operations deve valutare se le explanation sono realmente utili e se uncertainty/fallback sono comprensibili.

Security entra quando cambia provider data boundary, logging/retention, tool set o sensitive context. Platform entra se compare una shared gateway capability, una nuova network path o production identity. FinOps entra quando esistono cost curve reali da confrontare.

Non sono gate rituali su ogni experiment. Proteggono boundary specifici quando vengono attraversati.

## Continuity drill

Prima di considerare maturo il pilot, il Secondary Maintainer deve affrontare un drill con il lead indisponibile.

Usando soltanto repository e strumenti autorizzati deve riuscire a spiegare purpose e current state, individuare decisioni Pending, eseguire i golden command, trovare eval suite e AI Feature Contract, riconoscere cosa il modello non può decidere e individuare almeno un work item safe da portare avanti.

Se non riesce, non concludiamo automaticamente che “il backup non è abbastanza bravo”. Cerchiamo quale context era mancante, stale o tribale.

## Come misureremo il pilot

Il pilot non viene valutato da numero di agent task, righe generate o PR.

Le metriche interessanti sono verified outcome throughput, review backlog, rework, repair/retry, lead attention cost, specialist-gate quality, continuity drill result, business usefulness e cost per verified outcome.

Nel capstone questi valori sono ancora `Designed/Pending`. Non li inventiamo.

## Stato reale del pilot

A fine Capitolo 25 ESI può affermare:

```text
One-Man Project Operating Model  Codified
WIP / decision rights            Codified
Secondary Maintainer role        Designed
OO-002 work definition           Codified/Ready when repository says so
Continuity drill                 Pending
Provider/model evaluation        Pending execution
Real leverage metrics            Pending
Production support fit           Pending
```

Questa è una posizione molto più utile di una demo “one developer built everything”. Il progetto ha abbastanza struttura per iniziare l’esperimento; non abbastanza evidence per dichiararlo riuscito.

## Il compromesso

ESI accetta di lasciare parte del parallelismo inutilizzato, mantenere specialist gate e investire in continuity. In cambio ottiene un pilot in cui una persona può governare molta più execution senza diventare proprietaria di tutte le decisioni o unico punto di recovery.

Il modello verrà riaperto se support/on-call cresce, review backlog diventa persistente, specialist gate diventano quotidiani, aumentano external consumer o one-way door, oppure l’AI runtime diventa write-capable o business-critical.

In quel momento creare un team stabile può essere la decisione migliore.

> **La vittoria del One-Man Project non è restare one-man. È usare il leverage finché conserva fit e riconoscere abbastanza presto quando il sistema ha bisogno di un control plane più ampio.**
