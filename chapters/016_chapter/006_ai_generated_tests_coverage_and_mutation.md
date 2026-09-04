## AI-generated test, coverage e mutation testing

L’AI rende molto più economico produrre test. Questo è un vantaggio enorme finché ricordiamo che **la scarsità importante non è più il codice di test, ma la qualità della claim che stiamo cercando di falsificare**.

Una suite può crescere rapidamente e diventare meno utile nello stesso momento: più lenta, più ridondante, più accoppiata all’implementazione e più convincente nel proteggere assunzioni sbagliate.

## Test abundance: quando la suite impara il bug

Un prompt come:

```text
write comprehensive tests for this class
```

spinge naturalmente l’agente a leggere il codice, enumerare i branch e costruire expected value coerenti con ciò che l’implementazione fa oggi.

Se l’implementazione contiene una business assumption sbagliata, i test possono cristallizzarla.

Il problema non è che l’AI abbia scritto male il test. È che abbiamo scelto una sorgente di verità troppo debole.

Per questo la generation dovrebbe partire, quando possibile, da:

```text
Functional Analysis
requirements
acceptance criteria
invariant
API/event contract
Failure Mode Map
Threat Model
Reliability Contract
```

prima di usare l’implementazione come secondo input.

Per esempio, dal requirement:

```text
same EscalationId = same business intent
```

un agente può derivare indipendentemente dal codice:

```text
same id + same case + same tenant
→ replay idempotente

same id + different case
→ conflict

same id + different tenant
→ denied/conflict without disclosure
```

Questi scenari proteggono il dominio, non la forma corrente del metodo.

## Tautologia: il test che non possiede una sorgente indipendente

La forma ovvia:

```ts
const expected = calculate(input);
expect(calculate(input)).toEqual(expected);
```

è inutile. Le forme reali sono più sottili:

```text
production e test usano la stessa helper per costruire expected value
snapshot creato dall’output corrente e approvato senza review
mock che replica esattamente il comportamento sbagliato del provider
assertion sulla call sequence invece che sull’outcome
fixture copiata dall’implementation anziché dal contract
```

L’AI può produrle molto velocemente perché sono localmente coerenti.

La review deve quindi chiedere:

> **Quale fonte indipendente ci permette di dire che questo expected behavior è corretto?**

## Coverage: sapere che siamo passati da lì non significa sapere che avremmo visto il guasto

Code coverage risponde bene a:

> Quale parte del codice è stata eseguita dalla suite?

Non risponde a:

> Se quella parte fosse stata semanticamente sbagliata, il test sarebbe fallito?

Meta sottolinea proprio questa differenza nel proprio lavoro su mutation-guided LLM test generation: statement/branch coverage può crescere anche quando le assertion non catturano fault significativi.

Fonti:

- [Engineering at Meta — Revolutionizing software testing: Introducing LLM-powered bug catchers](https://engineering.fb.com/2025/02/05/security/revolutionizing-software-testing-llm-powered-bug-catchers-meta-ach/)
- [Engineering at Meta — LLMs Are the Key to Mutation Testing and Better Compliance](https://engineering.fb.com/2025/09/30/security/llms-are-the-key-to-mutation-testing-and-better-compliance/)

Microsoft documenta code coverage come misura della porzione di codice esercitata; il suo significato non deve essere esteso arbitrariamente a “qualità della suite”.

Fonte:

- [Microsoft Learn — Code coverage testing](https://learn.microsoft.com/visualstudio/test/using-code-coverage-to-determine-how-much-code-is-being-tested)

Per ESI quindi:

```text
coverage = diagnostic signal
coverage != proof of correctness
```

Una zona critica mai esercitata è un finding utile. Un `80%` uniforme raggiunto con test senza property non è una release decision credibile.

## Mutation testing: testare il test con un controfattuale

Mutation testing cambia la domanda:

```text
Il test passa sul codice corrente?
```

in:

```text
Il test fallisce se introduciamo intenzionalmente un fault che dovrebbe violare la property?
```

Mutazioni come:

```text
remove authorization check
skip outbox append
invert conflict condition
true → false
< → <=
```

creano un controfattuale. Se la suite continua a passare, il mutant sopravvive e ci costringe a chiedere se manchi una assertion, uno scenario o se la mutation sia semanticamente equivalente/irrilevante.

Microsoft Learn raccomanda di usare i surviving mutant per individuare gap e assertion deboli, evitando di trasformare il `100% mutation score` in un obiettivo universale.

Fonte:

- [Microsoft Learn — Mutation testing](https://learn.microsoft.com/en-us/dotnet/core/testing/mutation-testing)

Anche qui vale fit before fashion. Mutation testing può essere costoso, produrre mutant equivalenti e aumentare execution time. Nel capstone lo consideriamo selettivamente su authorization, tenant isolation, idempotency, conflict detection, outbox behavior e future capability economiche ad alto impatto.

## AI + mutation: chiedere “quale errore riusciresti a fermare?”

La combinazione interessante non è generare un grande numero di mutant. È usare il risk model per proporre fault plausibili.

Requirement:

```text
same EscalationId reused for another case must not be accepted
```

Fault candidate:

```text
remove the caseId conflict check
```

Domanda alla suite:

```text
esiste un test che diventa rosso?
```

Questo workflow è molto più informativo di:

```text
write more tests until coverage increases
```

Perché collega requirement, fault e evidence.

## Counterfactual review per ogni test generato

Un test AI-generated dovrebbe poter rispondere almeno a:

```text
Source
→ quale requirement/risk lo giustifica?

Fault
→ quale errore importante deve rilevare?

Counterfactual
→ quale modifica sbagliata dovrebbe farlo fallire?

Layer
→ è il boundary minimo adeguato?

Determinism
→ clock/random/state/dependency sono controllati?

Assertion
→ verifica una property o soltanto una call sequence?

Redundancy
→ aggiunge nuova evidence?

Maintenance
→ resta leggibile senza conoscere il prompt originale?
```

Se non sappiamo compilare queste righe, `PASS` non è sufficiente.

## Un secondo agente può essere più utile del primo

La stessa istanza che ha scritto implementation e test può condividere la stessa assumption sbagliata.

Un ruolo avversariale separato può ricevere:

```text
requirement
implementation diff
existing/generated tests
Failure Mode Map / Threat Model quando rilevanti
```

con una consegna diversa:

```text
Do not write replacement tests yet.
For each test, identify a realistic bug that should make it fail.
Find tautologies, overmocking, duplicated evidence, missing negative paths and timing flakiness.
```

Questa divisione di ruoli non garantisce la correttezza, ma riduce la probabilità che una singola narrativa domini l’intera verification.

## Incident → regression evidence

Un incidente reale è una sorgente di test particolarmente forte perché contiene un failure che sappiamo essere possibile.

Il workflow ideale è:

```text
incident evidence
→ minimal reproduction
→ extract invariant/failure class
→ choose cheapest adequate layer
→ regression candidate
→ prove it fails on buggy behavior
→ prove it passes on the fix
```

Non ogni incidente deve produrre un test permanente. Ma una regressione costosa che rimane riproducibile dovrebbe lasciare knowledge eseguibile quando il costo di manutenzione è giustificato.

## Il diff non è tutto il contesto

Un agente che genera test dal PR vede cosa è cambiato, non necessariamente il significato del cambiamento.

Può non conoscere requirement implicati, consumer esterni, RTO, tenant boundary o una behavior assumption del legacy.

Quindi il contesto per la generation deve includere gli artefatti architetturali rilevanti, non soltanto il file modificato.

Questo è un altro esempio di context engineering: più execution è automatizzata, più importante diventa fornire all’agente il modello del sistema.

## Flakiness nell’era dell’abbondanza

Generare test è facile; generare `sleep(1000)`, random non seeded, shared mutable fixture, network call in una suite locale o assumption sull’ordine di execution è altrettanto facile.

Meta ha sviluppato una misura probabilistica della flakiness proprio perché il test signal stesso deve essere trattato come qualcosa di affidabile o inaffidabile nel tempo.

Fonte:

- [Engineering at Meta — Probabilistic flakiness: How do you test your tests?](https://engineering.fb.com/2020/12/10/developer-tools/probabilistic-flakiness/)

Per ESI un flaky test è un defect del quality system. Può essere temporaneamente quarantined per non bloccare lavoro non correlato, ma deve avere issue, owner e scadenza. Non viene assolto da un rerun automatico.

```text
failed
failed
green
→ merge
```

senza spiegare i primi due failure trasforma una evidence ambigua in una falsa certezza.

## Cosa cambia nel ruolo dell’engineer

Un agente può produrre cento candidati. Il lavoro di judgment diventa decidere quali proteggono un rischio reale, quali duplicano noise, quali devono attraversare infrastruttura, quali assertion rappresentano davvero il dominio e quali test devono essere cancellati.

> **Quando scrivere test costa poco, la capacità di rifiutare test senza nuova evidence diventa una competenza di architettura della suite.**

L’AI può scrivere test molto più velocemente di noi. Proprio per questo dobbiamo diventare più severi nel chiedere che cosa quei test sarebbero capaci di impedire.