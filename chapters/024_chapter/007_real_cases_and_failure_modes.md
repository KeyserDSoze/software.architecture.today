# 24.7 — Casi reali: quando il problema smette di essere “far rispondere il modello”

Le demo generative rendono molto visibile il momento in cui il modello produce una risposta convincente. I sistemi reali rendono visibile tutto ciò che deve succedere **prima e dopo** quella risposta perché la capability possa essere usata con continuità.

I casi più utili non ci dicono che “l'AI funziona”. Ci mostrano dove retrieval, evaluation, permission, cost e operations diventano problemi architetturali.

Useremo tre lezioni. Nessuna diventa automaticamente una decisione ESI.

## Uber Genie: grounding simile, retrieval diverso

Uber ha descritto **Genie**, un copilot interno pensato per alleggerire il carico degli on-call engineer rispondendo a domande attraverso knowledge source aziendali. Nel primo design il team ha confrontato alternative come fine-tuning e RAG e ha scelto una pipeline di retrieval perché il problema richiedeva di recuperare informazioni aggiornabili da un insieme ampio di documenti interni.

Fonte:

- [Uber Engineering — Genie: Uber’s Gen AI On-Call Copilot](https://www.uber.com/gb/en/blog/genie-ubers-gen-ai-on-call-copilot/)

La lezione non è “Uber usa RAG, quindi anche ESI deve usare RAG”.

È quasi l'opposto.

Uber aveva un retrieval problem su molte source documentali. Case Explanation Assistant v1 conosce già quali sistemi interrogare per il singolo caso. Entrambi hanno bisogno di grounding, ma le forze sono diverse.

```text
Uber Genie
broad internal knowledge
→ retrieval problem
→ RAG architecture

ESI v1
known structured sources per case
→ deterministic lookup problem
→ direct context assembly
```

La stessa parola, *grounding*, non obbliga alla stessa topologia.

> **Un caso reale utile ci mostra la classe di problema. Non ci autorizza a copiare il meccanismo senza confrontare le forze.**

## L'evoluzione di Genie: il pattern non sostituisce la misura

Uber ha poi raccontato l'evoluzione del sistema nei domini engineering security e privacy. Gli SME avevano costruito un golden set di oltre cento query e il sistema iniziale non raggiungeva la qualità necessaria per un rollout più ampio. L'articolo descrive incompletezza, inaccuratezza e retrieval insufficiente, quindi l'introduzione di evaluation automatizzata e di un'architettura agentic-RAG più evoluta.

Uber riporta, nel proprio scenario misurato, una crescita relativa del 27% delle risposte accettabili e una riduzione relativa del 60% dei consigli errati.

Fonte:

- [Uber Engineering — Enhanced Agentic-RAG](https://www.uber.com/au/en/blog/enhanced-agentic-rag/)

Questi numeri appartengono a Uber. Non sono target per Order Operations.

La lezione è che il nome dell'architettura non garantiva la qualità. Il team ha dovuto costruire evidence sul workload e migliorare retrieval/generation rispetto a quella baseline.

È interessante anche il costo della misura. Uber descrive il ruolo degli SME e l'uso di LLM-as-a-Judge per accelerare gli esperimenti, mantenendo una baseline costruita da esperti.

La direzione è coerente con il nostro modello:

```text
human/domain baseline
→ automated evaluation
→ faster iteration
→ periodic human calibration
```

non:

```text
model output
→ another model says PASS
→ production
```

> **Quando la feature diventa seria, evaluation non è un'attività finale. Diventa parte dell'architettura che permette di cambiare il sistema senza perdere la baseline.**

## OpenAI e il modello source/sink: sicurezza oltre il prompt

OpenAI ha descritto la prompt injection anche come problema vicino alla social engineering, distinguendo contenuti che possono influenzare il modello dalle capability attraverso cui una compromissione può produrre conseguenze.

Fonte:

- [OpenAI — Designing AI agents to resist prompt injection](https://openai.com/index/designing-agents-to-resist-prompt-injection/)

Questa lettura è particolarmente utile per il Case Explanation Assistant.

```text
customer / case text
→ possible untrusted source

refund / email / arbitrary browsing / secret access
→ dangerous sink
```

ESI v1 non prova a risolvere la prompt injection soltanto migliorando il prompt. Rimuove i sink che non servono alla feature.

Il modello può ancora produrre una explanation sbagliata. Ma una nota malevola non può direttamente diventare refund, email o external navigation perché quelle capability non sono nel toolset.

Questa è una differenza di blast radius ottenuta **senza migliorare di un solo punto la capacità del modello di riconoscere un attacco**.

## Uber Gen AI Gateway: quando policy condivisa diventa una forza reale

Uber ha documentato anche una Gen AI Gateway usata come access layer comune verso modelli esterni e interni, con capability che includono logging/auditing, cost attribution, guardrail, PII redaction e accesso uniforme a più model route. L'articolo collega la piattaforma anche a evaluation, prompt versioning e production monitoring.

Fonte:

- [Uber Engineering — From Predictive to Generative: Michelangelo](https://www.uber.com/ci/en/blog/from-predictive-to-generative-ai/)

La lezione, ancora una volta, non è “costruisci subito un AI gateway”.

Per un solo assistant ESI rischierebbe di fare premature platforming. Ma se più workload inizieranno a duplicare provider policy, audit, cost attribution, model routing, redaction ed eval integration, il costo della duplicazione potrà diventare una forza abbastanza grande da giustificare una platform responsibility.

Il trigger viene dalla scala reale, non dalla moda del momento.

## I failure mode si raggruppano attorno a quattro boundary

Molti failure AI sembrano indipendenti finché non guardiamo quale boundary hanno violato.

### 1. Authority boundary

Il modello può trasformare un'interpretazione in business truth, nascondere l'incertezza o comportarsi come se avesse il diritto di decidere refund, Priority o PaymentStatus.

Hallucinated authority e missing-evidence optimism appartengono alla stessa famiglia: il prodotto ha lasciato che il linguaggio del modello superasse l'evidence disponibile.

La mitigazione non è soltanto “prompt migliore”. È output taxonomy, deterministic authority, source provenance, missing-evidence behavior ed eval che classificano queste violazioni come Major o Critical.

### 2. Context boundary

Stale grounding, cross-tenant contamination, poisoned document e unsupported source attribution nascono dalla pipeline che decide **quale evidence entra nel modello e con quale significato**.

Qui servono authorization before retrieval, freshness metadata, minimization, source/reference integrity, distinction between instruction and data e negative security case.

Il modello non può compensare una context pipeline che gli ha già consegnato la source sbagliata.

### 3. Capability boundary

Prompt injection e tool escalation diventano più pericolosi quando una feature nata per leggere riceve progressivamente write tool, browsing e secret access senza riaprire Threat Model e AI Feature Contract.

La mitigation principale è rendere l'espansione del toolset un **review trigger**, non un dettaglio dell'adapter.

```text
new sink
→ new blast radius
→ new authorization / security / eval decision
```

### 4. Evidence and lifecycle boundary

Eval overfitting, judge capture, model upgrade regression, cost runaway e AI dependency cascade compaiono quando la baseline non segue l'evoluzione del sistema.

Un prompt può essere ottimizzato sul golden set e peggiorare sui casi reali. Un grader può diventare il target implicito dell'ottimizzazione. Un model upgrade può migliorare un benchmark generale e peggiorare proprio il cross-tenant or authority case che ci interessa. Context e retry possono crescere finché il cost per useful outcome peggiora.

Qui servono holdout, runtime sampling, human calibration, regression eval, configuration identity, bounded retry, cost/latency evidence e fallback che mantenga il core journey indipendente dal provider quando la feature è opzionale.

> **Molti failure “del modello” sono in realtà failure del boundary che abbiamo costruito attorno al modello.**

## Perché questa distinzione conta per l'architect

Se chiamiamo ogni problema “hallucination”, la soluzione tende a diventare cambiare prompt o modello.

Se sappiamo invece che un failure è di authority, context, capability o lifecycle, possiamo intervenire sul punto giusto del sistema.

Una cross-tenant disclosure non si risolve con un modello più grande: richiede authorization e context isolation. Un provider outage non si risolve con più grounding: richiede reliability e fallback. Un cost runaway non si risolve con un security filter: richiede context/retry budget e unit economics. Un model upgrade regression non si risolve cambiando TypeScript interface: richiede workload eval.

Questa è Software Architecture applicata a una dependency probabilistica.

## La regola sui casi reali

Uber e OpenAI non prestano a ESI la loro architettura.

Ci prestano conseguenze che hanno dovuto rendere governabili: retrieval quality, evaluation cost, prompt-injection blast radius, policy condivisa, model lifecycle e operational evidence.

Il nostro compito è riconoscere quando le stesse forze compaiono in Order Operations e scegliere il meccanismo più piccolo che compra la proprietà necessaria.

> **Il caso reale utile non dice quale tecnologia scegliere. Mostra quale conseguenza smette di essere teorica quando l'AI entra davvero nel prodotto.**