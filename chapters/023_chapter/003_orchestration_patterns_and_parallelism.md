# 23.3 — Orchestrazione e parallelismo

Una volta chiarite le responsabilità, dobbiamo decidere come farle collaborare.

È facile trattare l'orchestrazione come un dettaglio del framework: scegliere `sequential`, `concurrent`, `handoff` o `manager pattern` e poi collegare gli agenti.

In realtà la topologia del workflow decide qualcosa di molto più importante: **dove vive la dependency, quando un output diventa input di un altro e quanto costa correggere un'interpretazione sbagliata**.

Per questo non scegliamo un pattern dal catalogo. Partiamo dalla struttura del problema.

## Quando la dependency è reale, la sequenza è una proprietà

Se un passo dipende semanticamente dal precedente, eseguirli in parallelo non aumenta throughput. Crea versioni concorrenti dello stesso intent.

Una decisione funzionale deve precedere il contract che la rappresenta. Il contract deve essere abbastanza stabile prima che più implementazioni possano usarlo. La verification finale deve osservare l'artifact che esiste davvero, non una candidate shape diversa per ogni branch.

La sequenza utile è quindi:

```text
shared decision
→ stable boundary
→ execution
→ verification
```

Microsoft Agent Framework documenta l'orchestrazione sequenziale come uno dei pattern base dei workflow multi-agent.

Fonte:

- [Microsoft Learn — Workflow orchestrations](https://learn.microsoft.com/en-us/agent-framework/workflows/orchestrations/)

La lezione non è “usa sequential quando vuoi semplicità”. È:

> **quando l'evidence di un passo determina il significato del successivo, l'ordine fa parte della correttezza.**

## Il parallelismo è utile soltanto quando l'indipendenza è reale

Dopo che intent e boundary sono sincronizzati, alcune attività possono diventare realmente indipendenti.

Più reviewer possono analizzare lo stesso diff in parallelo perché il loro input è stabile. Più work item possono avanzare insieme se non condividono una decisione aperta, una migration boundary o lo stesso verification oracle.

Prima di fan-out chiediamo quindi quale sia il **collision domain** del task:

```text
shared files?
shared schema?
shared contract?
shared business decision?
shared environment?
shared migration?
shared verification oracle?
```

Il file-level parallelism è il segnale meno interessante. Due agenti possono lavorare in directory diverse e modificare lo stesso significato di business. Un agent cambia l'enum dell'API, un altro l'enum dell'event: Git vede file diversi, il dominio vede una sola decisione.

> **Prima sincronizzare il pensiero. Poi parallelizzare l'execution.**

Questa è una dependency rule, non una preferenza stilistica.

## Handoff: spostare il controllo significa spostare il contesto necessario

Un handoff è utile quando una responsibility diventa abbastanza specifica da meritare uno specialista.

OpenAI Agents SDK espone gli handoff come primitive per trasferire il controllo fra agenti e consente di filtrare le informazioni che passano al ricevente.

Fonte:

- [OpenAI Agents SDK — Handoffs](https://openai.github.io/openai-agents-python/handoffs/)

Il failure mode è evidente: l'agente A conosce work item, stop condition, expected difference e limitation; il summary passato all'agente B dice soltanto “implementa la migration”.

L'handoff ha trasferito la task description, ma non il **decision boundary**.

Per questo un handoff robusto deve preservare almeno:

```text
work item identity
current scope
canonical context
current evidence
open decisions
stop conditions
relevant changed artifacts
forbidden / protected artifacts
```

Non è necessario copiare l'intera conversazione. È necessario non perdere ciò che rende il lavoro autorizzato e verificabile.

> **La correttezza dell'handoff si misura da ciò che il ricevente non è costretto a reinventare.**

## Manager pattern: centralizzare routing senza centralizzare tutta l'authority

Un orchestratore può mantenere lo stato complessivo e invocare specialisti come tool. OpenAI Agents SDK distingue questo manager pattern dagli handoff in cui il controllo passa realmente a un altro agente.

Fonte:

- [OpenAI Agents SDK — Agents / multi-agent system design patterns](https://openai.github.io/openai-agents-python/agents/)

Il manager pattern è utile quando vogliamo un punto coerente per routing, task state e synthesis, ma non vogliamo caricare ogni specialista con tutto il context.

Diventa pericoloso quando il manager accumula anche tutti i secret, tutti i tool, tutta la knowledge, tutti i criteri di verification e la final authority. In quel momento il manager non coordina più boundary indipendenti: li assorbe.

La conseguenza è un orchestration monolith. Ogni minima decisione deve tornare al centro e ogni misconception del manager si propaga a tutti gli specialisti.

Quindi il manager deve possedere **routing e state**, non necessariamente **ogni decisione**.

## Fan-out / fan-in: la sintesi deve essere risk-aware

La revisione è uno dei luoghi in cui il fan-out può comprare valore reale.

```text
              ┌→ Security review ───┐
Artifact ─────┼→ Test review ───────┼→ synthesis
              └→ Architecture review┘
```

I reviewer possono cercare contradiction differenti sullo stesso artifact. Ma il fan-in non può ridursi a una votazione.

Se quattro agenti dicono `PASS` sul code style e uno trova cross-tenant leakage, la maggioranza non autorizza il merge.

La synthesis deve sapere che i finding non hanno lo stesso peso.

```text
critical security finding
→ block

minor maintainability observation
→ possible follow-up
```

Il risultato è risk-aware, non democratico.

## Adversarial review: cambiare la domanda del verifier

Un verifier diventa spesso più utile quando la sua missione è cercare la contraddizione, non confermare genericamente che il lavoro “sembra buono”.

Per OO-001 la domanda può essere:

> **trova un modo in cui l'evidence presentata non dimostri davvero l'atomicità dichiarata.**

Questo orienta la ricerca verso fake engine, failure injection nel punto sbagliato, cleanup che nasconde partial state, migration riscritta o claim più ampi del test.

L'adversarial review non è un oracolo. Serve comunque evidence primaria. Ma cambia il bias della ricerca e riduce la probabilità che un secondo agente ripeta semplicemente la narrativa del primo.

## Retry: ripetere execution non equivale a recovery

Gli agenti falliscono, i tool falliscono e i task possono essere insufficientemente definiti.

Il pattern più pericoloso è:

```text
failure
→ retry
→ retry
→ retry
```

Come nei sistemi distribuiti, un retry senza nuova informazione può soltanto riprodurre il failure.

Dopo un errore dobbiamo capire la classe del problema: manca context? manca permission? il tool è indisponibile? il work item è ambiguo? la decisione non esiste? il modello non riesce a completare il task dentro il budget?

Recovery differenti richiedono azioni differenti.

La guida pratica OpenAI suggerisce esplicitamente soglie oltre le quali il workflow deve escalare invece di continuare indefinitamente.

Fonte:

- [OpenAI — A practical guide to building agents](https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf)

Per questo anche gli agent workflow hanno bisogno di:

```text
repair budget
+ stop condition
+ escalation path
```

## Tracing: senza provenance il workflow non è governabile

Più agenti e handoff rendono più difficile ricostruire chi abbia prodotto un claim, quale tool sia stato usato, quale approval sia avvenuta e quale output sia stato assunto come evidence.

OpenAI Agents SDK include tracing per run, generation, tool call, guardrail e handoff.

Fonte:

- [OpenAI Agents SDK — Tracing](https://openai.github.io/openai-agents-python/tracing/)

Questo non significa conservare indiscriminatamente prompt, secret e dati sensibili. Observability, minimizzazione, retention e access control valgono anche per il workflow agentico.

Il principio è più semplice:

> **se non possiamo ricostruire come un risultato ha attraversato i boundary del workflow, non possiamo davvero governare l'autonomia che gli abbiamo concesso.**

## ESI: OO-001 non ha bisogno di uno swarm

Per OO-001 ESI sceglie una sequenza minima:

```text
Human Decision Owner
→ Implementer
→ deterministic evidence
→ Verifier
→ human/repository gate
```

Non parallelizziamo la modifica, perché il task ha un unico transaction boundary principale. Se il test harness introduce nuove permission o network capability, Security/Platform review può avvenire in parallelo alla transaction evidence review sul diff ormai stabile.

Questa topologia è meno spettacolare di un agent swarm, ma compra esattamente le proprietà che servono: bounded execution, verification independence e escalation condizionale.

> **La maturità dell'orchestrazione non è quanta execution distribuiamo. È quanto bene sappiamo distinguere dependency reale, indipendenza reale e authority reale.**
