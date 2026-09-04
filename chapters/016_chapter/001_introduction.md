# Capitolo 16 — Testing Architecture

> **Scenario fittizio ESI.** Order Operations continua a evolvere come capstone. I riferimenti a Microsoft, Google, Meta, OWASP e Pact descrivono pratiche, strumenti o casi documentati; requisiti e compromessi ESI restano simulati.

Nel Capitolo 15 abbiamo deciso quale evidence il sistema debba produrre mentre opera. Adesso dobbiamo affrontare la domanda che viene prima del deployment:

> **Quale evidence ci serve per decidere che una modifica è abbastanza sicura da avanzare?**

La risposta più facile è “più test”. Nell’era dell’AI è anche la più pericolosamente economica.

Un agente può produrre unit test, fixture, mock, test parametrizzati, integration test e casi limite in pochi minuti. Una suite può passare da cento a mille test senza che la confidence cresca nella stessa misura. Potremmo avere soltanto novecento modi nuovi di verificare l’implementazione corrente, incluse le sue assunzioni sbagliate.

Il problema del capitolo non sarà quindi quanta automation riusciamo a generare. Sarà capire **quale errore importante ogni evidence dovrebbe riuscire a falsificare**.

## Dal test alla claim

Un test ha valore quando mette in pericolo una claim che ci interessa mantenere vera.

Per Order Operations alcune claim sono già esplicite:

```text
solo un case Payment può essere escalato
la stessa EscalationId non crea un secondo intent business
PaymentEscalation e OutboxMessage sono atomici
un operatore non attraversa il tenant boundary
il wire contract resta compatibile con Payments & Risk
un duplicate delivery non duplica l’effetto business
un restore rientra nel recovery target dichiarato
```

Il numero di assertion non cambia l’importanza di queste proprietà. Ci interessa sapere se una modifica che le viola abbia buone probabilità di essere fermata **prima** della produzione.

Meta descrive una logica analoga nel proprio lavoro su mutation-guided LLM test generation: la structural coverage può aumentare senza che una suite impari a catturare fault significativi; l’approccio diventa più interessante quando introduciamo fault mirati e chiediamo se i test riescano a rilevarli.

Fonti:

- [Engineering at Meta — Revolutionizing software testing: Introducing LLM-powered bug catchers](https://engineering.fb.com/2025/02/05/security/revolutionizing-software-testing-llm-powered-bug-catchers-meta-ach/)
- [Engineering at Meta — LLMs Are the Key to Mutation Testing and Better Compliance](https://engineering.fb.com/2025/09/30/security/llms-are-the-key-to-mutation-testing-and-better-compliance/)

La lezione non è “usare mutation testing ovunque”. È più generale:

> **Un test è interessante per il fault che sa rilevare, non per la riga che sa eseguire.**

## Testing e architettura si progettano insieme

Il modello lineare:

```text
requirements
→ architecture
→ implementation
→ testing
```

è troppo povero per un sistema che deve evolvere in sicurezza.

Ogni decisione architetturale crea anche un nuovo spazio di verification. Una transaction introduce atomicity e concurrency claim. Una queue introduce redelivery, backlog e recovery. Un authorization boundary introduce negative claim. Una replica introduce failover e common-mode failure. Un retry introduce classification, boundedness e stable identity. Una nuova regione introduce recovery behavior e state coordination.

La relazione reale assomiglia di più a:

```text
requirement / risk
↔ architecture
↔ testability
↔ implementation
↔ evidence
```

Microsoft Azure Well-Architected raccomanda di progettare la testing strategy insieme all’architettura del workload, collegando critical flow, rischio, environment, quality goal e ownership invece di applicare la stessa test shape a ogni sistema.

Fonti:

- [Microsoft Learn — Architecture strategies for testing](https://learn.microsoft.com/en-us/azure/well-architected/operational-excellence/testing)
- [Microsoft Learn — Build confidence in Azure workloads with effective testing practices](https://learn.microsoft.com/en-us/azure/well-architected/design-guides/testing)

Per Order Operations questo significa che Functional Analysis, API/Event Contract, Data Ownership Map, Failure Mode Map, Threat Model, Security Control Matrix, Reliability Contract e Observability Contract diventano **sorgenti della Testing Strategy**. Il test backlog nasce dal modello del sistema, non soltanto dal diff del codice.

## Il rischio decide quanta evidence comprare

Dieci righe modificate possono cambiare un’etichetta o l’associazione fra `Idempotency-Key` ed `EscalationId`. La dimensione del diff è simile; il rischio no.

Nel secondo caso possiamo introdurre duplicate escalation, conflict fra intenti differenti, cross-tenant confusion e side effect downstream duplicati. La profondità della verification deve quindi dipendere da proprietà come:

```text
business impact
likelihood
reversibility
blast radius
detectability
security/reliability consequence
```

Non trasformiamo queste dimensioni in un punteggio pseudo-scientifico. Le usiamo per spiegare perché un cambio meriti application test soltanto, database integration, contract evidence, staging verification o perfino un recovery drill.

## Il layer è il boundary che può falsificare la claim

Una proprietà locale dovrebbe essere verificata nel layer più piccolo che contiene tutte le cause rilevanti. Una proprietà che dipende dalle semantiche PostgreSQL non può essere dimostrata con una `Map`. Un RBAC Azure non può essere dimostrato da un mock del permission service. Un RTO non può essere dimostrato leggendo la documentazione del provider.

La regola del capitolo sarà:

> **Usa l’evidence più economica che attraversa il boundary capace di rendere falsa la claim.**

Questo rende la test pyramid una euristica economica, non una costituzione. Molti test piccoli sono utili perché sono veloci e deterministici; pochi E2E sono utili perché comprano realismo costoso che layer più piccoli non possono comprare.

Google ha documentato a lungo il costo e la maggiore flakiness dei test più ampi, raccomandando di mantenere selettivi gli end-to-end e di spostare più verification possibile verso test piccoli e controllabili.

Fonti:

- [Google Testing Blog — Just Say No to More End-to-End Tests](https://testing.googleblog.com/2015/04/just-say-no-to-more-end-to-end-tests.html)
- [Google Testing Blog — Test Sizes](https://testing.googleblog.com/2017/04/)

Il principio non è “meno E2E”. È: **realismo soltanto dove cambia la claim che possiamo falsificare**.

## Testare proprietà, non call sequence

Un test fragile può verificare:

```text
Repository.save called exactly once
```

quando la property che ci interessa è:

```text
same EscalationId
→ no second business escalation
```

La prima assertion protegge una forma dell’implementazione. La seconda protegge un invariante che dovrebbe sopravvivere a refactoring, cambi di repository adapter e AI-assisted rewrites.

Questo non significa evitare interaction test. Significa usarli quando l’interazione è il contratto. Se la sequence interna non è una proprietà del sistema, fissarla nella suite può trasformare refactoring sicuri in rumore.

## Anche la suite deve essere affidabile

Una suite che passa sempre può essere cieca. Una suite che fallisce spesso può essere flaky. Entrambe possono produrre falsa confidence.

Meta descrive la flakiness come un problema di affidabilità del sistema di test stesso: quando un test cambia esito senza una variazione pertinente del prodotto, gli engineer smettono progressivamente di fidarsi del segnale.

Fonte:

- [Engineering at Meta — Probabilistic flakiness: How do you test your tests?](https://engineering.fb.com/2020/12/10/developer-tools/probabilistic-flakiness/)

Quindi il test code è software operativo. Ha latency, failure mode, ownership, maintenance e debito. `Rerun until green` non è una strategia di qualità; è il modo più veloce per trasformare una evidence ambigua in una luce verde.

## La tensione ESI

Commerce & Operations vuole mantenere delivery velocity. Payments & Risk vuole evidence forte su contract e duplicate-delivery semantics. Security vuole negative test su tenant e privilege. Platform vuole pipeline veloci e environment ripetibili. Reliability vuole failure/recovery drill. Finance non vuole una seconda produzione sempre accesa soltanto per testare.

Non risolveremo questa tensione scegliendo “più test” o “meno test”. Costruiremo una **evidence pipeline a più velocità**:

```text
fast deterministic evidence
→ ogni change

real-boundary integration
→ PR / deployment gate appropriato

high-fidelity operational evidence
→ staging / readiness / scheduled drill

production continuous verification
→ SLI, synthetic journey, drift
```

Il quality floor di Order Operations resta non negoziabile su business invariant critici, tenant isolation, authorization, API/event compatibility, atomicità escalation+outbox, idempotency, duplicate delivery, migration safety, outbox failure path e recovery evidence.

Il modo in cui costruiamo la prova può evolvere. La claim non può sparire soltanto perché il test più fedele è costoso.

## Cosa cambia con l’AI

La scarsità si sposta. Prima il limite poteva essere il tempo per scrivere test. Ora diventano più preziosi requirement chiari, risk identification, strong assertion, realistic fault model, suite architecture e capacità di cancellare test che non aggiungono evidence.

L’AI può essere molto più utile quando le chiediamo:

```text
quale bug realistico violerebbe questa property?
il test attuale lo catturerebbe?
qual è il layer minimo capace di falsificare la claim?
quale negative case manca?
quale test è tautologico o ridondante?
```

che quando le chiediamo semplicemente “scrivi più test”.

> **Non ottimizziamo per far passare la suite. Ottimizziamo per fare in modo che un cambiamento importante ma sbagliato abbia buone probabilità di non passarla.**

Alla fine del capitolo ESI avrà una Testing Strategy, una Risk-to-Evidence Map, pipeline gate, una policy sui flaky test e sui test AI-generated e una prima suite eseguibile. Ma conserveremo esplicitamente ciò che resta `Designed/Pending`, perché qualche test locale verde non promuove automaticamente l’intero workload a `Verified`.