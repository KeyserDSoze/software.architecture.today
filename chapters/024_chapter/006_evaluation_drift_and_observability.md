# 24.6 — Eval, model drift e observability: testare un comportamento probabilistico

Una feature AI runtime introduce un problema che i test tradizionali non risolvono da soli.

La stessa input può produrre output differenti.

E una configurazione che oggi passa può cambiare comportamento quando cambiano:

- modello;
- system prompt;
- context builder;
- retrieval;
- tool set;
- safety layer;
- provider;
- dati reali;
- distribuzione delle richieste utenti.

Quindi abbiamo bisogno di **evaluation**, non soltanto di test di integrazione.

## Test deterministici ed eval rispondono a domande diverse

Un test classico può verificare:

```text
schema parser rejects invalid enum
una source reference inesistente viene rifiutata
un tenant non autorizzato non entra nel context builder
provider timeout attiva fallback
```

Una eval può invece verificare:

```text
la spiegazione è grounded?
usa evidence sufficiente?
separa fact da hypothesis?
rileva missing evidence?
evita claim economici non autorizzati?
resta utile per l'operatore?
```

Non sono sostituti.

```text
deterministic test
+
behavioral eval
+
runtime monitoring
```

sono layer complementari.

## Un eval set nasce dal rischio

Come nel Capitolo 16, non vogliamo una collezione casuale di prompt.

Per Case Explanation Assistant costruiamo categorie:

### Nominal

```text
all expected sources present
clear timeline
no conflict
```

### Missing evidence

```text
Payments unavailable
Shipping absent
partial source
```

### Conflicting evidence

```text
two sources disagree
stale snapshot vs newer event
```

### Security/adversarial

```text
prompt injection inside customer-controlled note
request for another tenant
request to reveal system instruction
attempt to induce forbidden action
```

### Authority boundary

```text
ask model to declare PaymentStatus
ask model to approve refund
ask model to override Priority
```

### Ambiguity

```text
facts support more than one plausible explanation
```

## Metriche: non una sola accuracy

Microsoft Foundry documenta evaluator distinti per retrieval e per response quality, inclusi groundedness, relevance e response completeness; Azure Architecture Center sottolinea che la scelta delle metriche dipende dal workload e che le risposte sono non deterministiche.  
Fonte: [Microsoft Learn — Built-in evaluators](https://learn.microsoft.com/en-us/azure/foundry/concepts/built-in-evaluators), [Microsoft Learn — RAG LLM evaluation phase](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/rag/rag-llm-evaluation-phase).

Per ESI possiamo definire un evaluation profile iniziale:

```text
Groundedness
Critical claim support
Fact / hypothesis separation
Missing-evidence honesty
Source-reference validity
Forbidden-authority violation
Prompt-injection resistance
Usefulness
Latency
Cost
```

Non tutte le metriche hanno lo stesso peso.

Un summary molto utile ma con una falsa conclusione economica è un failure critico.

## Severity before average

Supponiamo:

```text
99 casi perfetti
1 caso cross-tenant
```

Una media del 99% non rende il sistema accettabile.

Come nel Capitolo 23, il gate deve essere risk-weighted.

Possiamo classificare:

```text
Critical
→ cross-tenant disclosure
→ unauthorized economic claim/action
→ prompt injection reaches dangerous sink

Major
→ unsupported critical fact
→ missing evidence hidden

Minor
→ stylistic incompleteness
→ suboptimal wording
```

Una critical failure può bloccare la release anche se lo score aggregato è alto.

## LLM-as-a-judge: utile, non magico

Un modello può essere usato come evaluator.

È utile per proprietà difficili da esprimere con exact match.

Ma introduce un altro sistema probabilistico.

Dobbiamo quindi chiedere:

- il grader è calibrato su human labels?
- conosce il ground truth necessario?
- è sensibile al formato?
- può essere ingannato dall'output che valuta?
- quale percentuale viene controllata da persone?

OpenAI ha evidenziato che score di evaluation possono essere distorti da shortcut, contaminazione, harness e scorer, raccomandando di rendere visibili questi hazard e di ispezionare campioni.  
Fonte: [OpenAI — A shared playbook for trustworthy third party evaluations](https://openai.com/index/trustworthy-third-party-evaluations-foundations/).

Quindi:

> **Un grader è uno strumento di misura. Anche lo strumento di misura deve essere validato.**

## Golden answers vs property-based eval

Non sempre vogliamo una sola risposta esatta.

Per alcune domande possiamo avere:

```text
required facts
forbidden claims
required source refs
allowed hypotheses
```

invece di una golden sentence completa.

Questo riduce il rischio di valutare lo stile invece della sostanza.

## Offline eval e online evidence

Prima della release:

```text
curated eval set
regression eval
security/adversarial eval
cost/latency benchmark
human review sample
```

Dopo la release:

```text
fallback rate
InsufficientEvidence rate
invalid-output rate
latency
cost
source coverage
user correction / dismiss rate
security signal
sampled human quality review
```

Non vogliamo però loggare indiscriminatamente prompt e context contenenti dati sensibili.

Il Capitolo 15 resta valido: telemetry deve avere privacy, retention e cardinality budget.

## Drift

### Model drift

Il provider cambia il comportamento del modello o noi adottiamo una nuova versione.

### Prompt drift

Le istruzioni cambiano e una modifica apparentemente piccola altera un comportamento critico.

### Context drift

Nuove source o nuovi campi entrano nella context pipeline.

### Product drift

Cambiano le business rule ma l'assistant continua a essere valutato con vecchie aspettative.

### User drift

Gli operatori iniziano a usare la feature per domande non previste.

Queste forme di drift richiedono trigger diversi.

## Evaluation debt

Un sistema può accumulare una nuova forma di debito:

```text
feature grows
→ eval set stays small
→ behavior surface exceeds evidence surface
```

Possiamo chiamarla **evaluation debt**.

Segnali:

- nuovi use case senza nuovi eval case;
- nuove source senza injection test;
- tool nuovi senza permission eval;
- model upgrade senza regression baseline;
- prompt change senza comparison;
- incidenti che non diventano eval case.

> **Ogni failure importante che comprendiamo dovrebbe rendere il prossimo failure simile più facile da rilevare.**

## ESI evaluation gate

Il primo Case Explanation Assistant non va in produzione finché non abbiamo almeno:

```text
versioned eval set
critical boundary cases
prompt-injection cases
missing/conflicting evidence cases
structured-output checks
human review rubric
latency/cost baseline
explicit release threshold
```

Non definiamo ancora numeri fittizi di pass-rate.

Li stabiliremo quando costruiremo il dataset e avremo una prima baseline reale.

Questo mantiene l'evidence onesta.

## La regola

> **Non testare soltanto il modello. Testa la configurazione completa che produce il comportamento: context, prompt, model, tool, guardrail, scorer e fallback.**