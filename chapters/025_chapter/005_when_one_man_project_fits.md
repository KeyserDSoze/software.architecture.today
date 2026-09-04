# Quando un One-Man Project ha fit

Il One-Man Project non è un maturity level e non è un obiettivo organizzativo universale.

La domanda resta la stessa che abbiamo usato per microservizi, cloud, RAG e multi-agent workflow:

> **Ha fit con il problema reale?**

Per rispondere non basta guardare le linee di codice o la dimensione del repository. Un servizio di poche migliaia di righe che muove denaro può richiedere più governance di una codebase molto più grande ma interna, reversibile e ben isolata.

Conta soprattutto la forma del sistema che dobbiamo governare.

## Decision density

Il primo criterio è quanta parte del lavoro consiste in execution già autorizzata e quanta parte apre continuamente nuove decisioni.

Un progetto con target architecture nota, verification forte e molte modifiche meccaniche può produrre un volume elevato di execution mantenendo relativamente piccolo il control plane. È un contesto in cui gli agenti comprano molto leverage.

Un progetto con poco codice ma nuove pricing semantics, nuove authorization rule, regulated workflow e ownership ancora in discussione ha invece una **decision density** molto maggiore. Il problema principale non è produrre artifact. È mantenere allineate più authority e accettare trade-off ad alto impatto.

Per questo una forma utile di ragionamento è:

```text
execution volume
rispetto a
decision density
```

Non è una formula matematica da ottimizzare. Serve a ricordare che gli agenti aumentano soprattutto il primo termine.

> **Più il lavoro è execution-heavy dentro decisioni già chiare, più il One-Man Project può comprare leverage reale.**

## One-way-door density

La seconda dimensione è la reversibilità.

Un progetto dominato da feature flag, adapter sostituibili, read model, internal UI e refactoring bounded permette di provare, osservare e tornare indietro. Il lead può delegare molto perché il costo di una scelta imperfetta resta contenuto.

La situazione cambia quando il lavoro contiene spesso customer-data deletion, ledger migration, public contract removal, identity rewrite o altre decisioni difficili da invertire.

Non significa che una singola persona non possa fare l’execution tecnica. Significa che il sistema richiede più authority, evidence e review prima di oltrepassare la porta.

> **Il One-Man Project scala meglio quando le one-way door sono relativamente rare, visibili e protette da gate espliciti.**

## Operational burden

Una capability può essere semplice da costruire e difficile da operare.

Se il prodotto richiede 24/7 severe-incident response, molti consumer esterni, data residency complessa o una rotazione on-call ampia, il problema non è più soltanto development throughput. Una sola persona può diventare rapidamente il limite della recovery capacity.

Al contrario, un tool interno, una migration utility o una capability read-only con graceful degradation possono avere un operating surface molto più compatibile con un accountable lead singolo.

Il Case Explanation Assistant ESI appartiene intenzionalmente a questa seconda classe nel primo slice: è advisory, non è nel critical path e non possiede write tool. È un pilot migliore di un payment ledger o di una production identity platform proprio perché il blast radius è ridotto.

## Platform leverage: il progetto “solo” non è davvero solo

C’è poi un paradosso importante. Un One-Man Project enterprise funziona spesso perché l’organizzazione ha già costruito una grande quantità di capacità condivisa.

Identity platform, landing zone, CI/CD, artifact registry, observability, security scanning, managed database, messaging, incident management e cost allocation riducono enormemente la quantità di lavoro che il lead deve reinventare.

Quando diciamo “una persona governa questo prodotto”, dobbiamo quindi evitare di attribuire all’individuo leverage che in realtà proviene dall’ecosistema.

> **L’autonomia locale è spesso costruita sopra collaborazione resa invisibile dalla piattaforma.**

Questo è il motivo per cui Platform Engineering può aumentare molto la fattibilità del One-Man Project senza togliere autonomia al lead.

## Il numero di authority conta più del numero di file

Un altro segnale di fit è quante funzioni diverse possiedono decisioni legittime nel sistema.

Un bounded engineering tool con un solo product owner e security boundary già noto può avere un control plane piccolo. Un servizio che coinvolge Payments, Legal, Fraud, Customer Support, più jurisdiction e molti consumer pubblici richiede una responsibility network più ampia anche se il codice resta contenuto.

L’AI può ridurre il numero di mani necessarie per l’execution. Non riduce necessariamente il numero di interessi che devono partecipare alle decisioni.

Questa è anche la ragione per cui:

```text
One-Man Project
≠
One-Man Company
```

Il modello riguarda il software execution/control loop, non l’intera organizzazione.

## Il fit può cambiare nel tempo

Lo stesso progetto può essere inadatto oggi e più governabile domani.

Un repository con tribal knowledge, deploy manuali, credenziali condivise, consumer sconosciuti e test deboli concentra troppo contesto nella persona. Dopo foundation work — canonical docs, reproducible build, contract test, managed identity, observability, runbook e work item — la stessa execution può diventare più delegabile.

Può accadere anche il contrario. Un pilot inizialmente adatto può crescere: più utenti, più incidenti, nuovi tool di scrittura, external contract e specialist gate quotidiani. A quel punto il One-Man Project smette di avere fit anche se l’implementazione continua a funzionare.

Per questo il modello deve avere **exit trigger**.

## La Fit Review di ESI

Prima di mantenere il pilot in questo operating model, ESI vuole poter rispondere in modo credibile a poche domande sostanziali: qual è il business outcome? Quanto è grande il blast radius? Quante authority esterne sono coinvolte? Dove sono le one-way door? Quali capability enterprise assorbono già complessità? Quanto è riproducibile la verification? Chi prende il controllo in assenza del lead? Quale evidence ci direbbe che review backlog, support load o decision surface hanno superato la capacità del modello?

Queste domande non producono un punteggio universale. Rendono visibili le forze.

Se per mantenere “one-man” dobbiamo indebolire security, verification, continuity o domain ownership, il modello non ha fit.

> **Non usare il One-Man Project per dimostrare quanto poco personale serve. Usalo soltanto quando concentra il control plane senza rendere più fragile il sistema che deve governare.**
