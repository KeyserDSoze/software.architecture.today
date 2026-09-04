# 16.6 — AI-generated test, coverage e mutation testing

L'AI cambia il testing nello stesso modo in cui cambia il coding:

> rende molto più economica la produzione dell'artefatto.

Questo è utile.

Ed è pericoloso quando confondiamo quantità di artefatti con qualità della verification.

## Il nuovo rischio: test abundance

Prima dell'AI un team poteva avere pochi test perché scriverli costava tempo.

Oggi può avere migliaia di test perché generarli costa poco.

Il problema non è l'abbondanza in sé.

Il problema è che una suite può apparire impressionante mentre verifica pochissimo.

Esempio:

```text
prompt:
"write comprehensive tests for this class"
```

Un agente può:

- leggere l'implementazione;
- replicarne i branch;
- generare input coerenti;
- assertare esattamente gli output correnti.

Se l'implementazione contiene una assumption sbagliata, i test possono semplicemente **cristallizzarla**.

Il risultato è una suite che protegge il codice da cambiamenti, non necessariamente il prodotto da errori.

## Specification-first test generation

Quando possibile, l'AI dovrebbe generare test partendo da fonti più forti dell'implementazione:

```text
functional analysis
requirements
acceptance criteria
API/event contract
invariant
Failure Mode Map
Threat Model
Reliability Contract
```

Solo dopo dovrebbe confrontare il codice.

Questo riduce il rischio di creare test tautologici.

Per esempio:

```text
Requirement:
same EscalationId must represent same business intent
```

Da qui un agente può proporre:

```text
same id + same case
→ idempotent replay

same id + different case
→ conflict

same id + different tenant
→ conflict / denied
```

Questi scenari esistono indipendentemente dall'implementazione corrente.

## Il test tautologico

Un pattern frequente nei test generati è:

```text
implementation computes X
→ test calls implementation
→ test expects X
```

senza una sorgente esterna che giustifichi `X`.

Un caso estremo:

```ts
const expected = calculate(input);
expect(calculate(input)).toEqual(expected);
```

è ovviamente inutile.

Ma esistono forme più sottili:

- stessa helper usata da production e test per costruire expected value;
- snapshot generato dall'output corrente e approvato senza review;
- mock che replica esattamente il bug del provider;
- assertion su chiamate interne invece che su property business;
- fixture copiata dal codice anziché dal contract.

L'AI può produrre queste forme molto velocemente.

## Coverage: utile, ma non sufficiente

Code coverage risponde a una domanda:

> quale parte del codice è stata eseguita durante i test?

È un'informazione utile.

Non risponde a:

> i test avrebbero fallito se quella logica fosse stata sbagliata?

Meta lo esplicita nel proprio lavoro su mutation-guided LLM test generation: statement/branch coverage può crescere anche senza rilevare fault significativi, perché l'esecuzione di una riga non dimostra la forza dell'assertion.

Fonti:

- [Engineering at Meta — Revolutionizing software testing: Introducing LLM-powered bug catchers](https://engineering.fb.com/2025/02/05/security/revolutionizing-software-testing-llm-powered-bug-catchers-meta-ach/)
- [Engineering at Meta — LLMs Are the Key to Mutation Testing and Better Compliance](https://engineering.fb.com/2025/09/30/security/llms-are-the-key-to-mutation-testing-and-better-compliance/)

Microsoft documenta code coverage come misura della proporzione di codice esercitata dai test; non dobbiamo trasformare questa misura strutturale nella definizione completa della qualità della suite.

Fonte:

- [Microsoft Learn — Code coverage testing](https://learn.microsoft.com/visualstudio/test/using-code-coverage-to-determine-how-much-code-is-being-tested)

## Coverage target senza contesto

Una policy come:

```text
80% coverage mandatory
```

può produrre comportamenti strani:

- test facili su getter;
- test inutili per alzare percentuali;
- esclusioni arbitrarie;
- scarsa attenzione ai path critici già “coperti”.

Un numero può essere utile come guardrail o signal.

Ma non deve diventare la stella polare.

Per Order Operations preferiamo ragionare così:

```text
critical invariant
→ must have strong test evidence

low-risk glue
→ coverage useful but not worth elaborate tests
```

La coverage ci aiuta a trovare zone mai esercitate.

Il risk model ci dice quanto importa.

## Mutation testing

Mutation testing inverte la domanda.

Invece di chiedere:

> il test passa sul codice corretto?

chiede:

> **il test fallisce quando introduciamo intenzionalmente un fault?**

Esempi di mutation:

```text
== → !=
< → <=
true → false
remove authorization check
skip persistence
change error branch
```

Se il test continua a passare, il mutant “sopravvive”.

Questo può indicare:

- assertion debole;
- scenario mancante;
- codice equivalente/non rilevante;
- property non protetta.

Microsoft Learn, nella guida corrente sul mutation testing.NET, raccomanda di usare i surviving mutant per individuare gap e assertion deboli e avverte di non inseguire il 100% di mutation score: il valore maggiore è nelle aree business-critical o ad alto rischio.

Fonte:

- [Microsoft Learn — Mutation testing](https://learn.microsoft.com/en-us/dotnet/core/testing/mutation-testing)

È esattamente la stessa logica `fit before fashion`.

## Mutation testing non è un nuovo dogma

Mutation testing può essere costoso.

Può generare:

- mutant equivalenti;
- fault poco realistici;
- tempi di execution elevati;
- maintenance burden;
- false priority.

Meta descrive proprio questi limiti storici e il proprio tentativo di usare LLM per generare mutant più mirati a fault reali e test che li rilevino.

Fonte:

- [Engineering at Meta — LLMs Are the Key to Mutation Testing and Better Compliance](https://engineering.fb.com/2025/09/30/security/llms-are-the-key-to-mutation-testing-and-better-compliance/)

Quindi per ESI non introduciamo mutation testing su ogni file.

Lo consideriamo per:

```text
idempotency
authorization
privacy/security invariant
critical business rule
financially sensitive future workflow
```

Dove un test apparentemente “coperto” ma incapace di rilevare il fault sarebbe costoso.

## AI + mutation: una combinazione interessante

L'AI può fare qualcosa di più interessante di “genera altri test”.

Può ricevere un rischio:

```text
same id reused for another case must not be accepted
```

poi generare un fault plausibile:

```text
remove the caseId conflict check
```

poi verificare se la suite lo rileva.

Questo workflow cambia la domanda:

```text
write tests for code
```

in:

```text
prove that the suite catches this class of mistake
```

È un uso molto più vicino al ruolo di manager di agenti del Capitolo 0.

## Human-in-the-loop sui test generati

Il test generato deve essere reviewato come production code.

Domande minime:

1. quale requirement/risk protegge?
2. potrebbe passare se il comportamento fosse sbagliato?
3. dipende troppo dall'implementazione?
4. verifica outcome o call sequence?
5. usa fixture con una provenance comprensibile?
6. include negative path rilevanti?
7. è deterministico?
8. introduce test-only abstraction discutibili?
9. è ridondante con test esistenti?
10. quanto costerà mantenerlo?

La review di un test generato non deve concentrarsi soltanto sulla sintassi.

## Test generation da production incident

Un input molto prezioso per l'AI è un failure realmente osservato.

Workflow:

```text
incident evidence
→ reproduce minimal failure
→ extract invariant/failure class
→ generate regression candidate
→ prove candidate fails on buggy behavior
→ prove candidate passes on fix
→ decide best layer
```

Questo evita un anti-pattern classico:

```text
incident
→ patch
→ nessun test perché “era un caso strano”
```

L'incidente diventa knowledge incorporata nella suite.

## Test generation da diff

Un agente può leggere un PR e chiedersi:

- quale invariant cambia?
- quale contract può rompersi?
- quale failure path viene alterato?
- quale assertion manca?

Ma una regola è importante:

> **il diff mostra cosa è cambiato; non mostra tutto ciò che quel cambiamento può significare.**

Per questo il contesto deve includere requirements e architecture artifact.

## AI come adversarial test reviewer

Una seconda istanza può ricevere:

```text
implementation diff
+ generated tests
+ requirement
+ threat/failure map
```

con il compito di non produrre codice ma cercare:

- false confidence;
- branch non significativo;
- missing negative case;
- overmocking;
- assertion tautologica;
- flaky timing;
- scenario che passa anche col bug.

Questo è spesso più utile di chiedere allo stesso agente di auto-validare il proprio lavoro senza ruolo avversariale.

## Flaky test nell'era AI

Se generare test è facile, generare flaky test è facile.

Anti-pattern comuni:

```text
sleep(1000)
random without seed
shared global fixture
network call in unit suite
assumption on execution order
real clock boundary
broad snapshot
```

Meta ha sviluppato una misura probabilistica della flakiness per poter monitorare l'affidabilità dei test stessi su larga scala e sottolinea come flaky signal riduca la fiducia degli engineer nella regression suite.

Fonte:

- [Engineering at Meta — Probabilistic flakiness: How do you test your tests?](https://engineering.fb.com/2020/12/10/developer-tools/probabilistic-flakiness/)

Per ESI un flaky test non viene considerato “rumore accettabile” indefinitamente.

Ha un owner e uno stato:

```text
healthy
quarantined with issue
fixed
removed because obsolete
```

Non:

```text
rerun until green
```

## Rerun-until-green è un anti-pattern

Un rerun può essere utile per diagnosticare flakiness.

Non deve diventare il meccanismo per ottenere una pipeline verde.

Se una pipeline dice:

```text
failed
failed
green
→ merge allowed
```

senza classificare il perché dei primi due failure, sta trasformando in successo una evidence ambigua.

## Generated Test Confidence Checklist

Per test AI-generated usiamo una checklist operativa:

```text
Source
- da quale requirement/risk deriva?

Fault
- quale errore deve rilevare?

Counterfactual
- possiamo descrivere una modifica sbagliata che lo farebbe fallire?

Layer
- è il layer più piccolo adeguato?

Determinism
- tempo, random, state e dependency sono controllati?

Assertion
- verifica una property, non solo una call sequence?

Redundancy
- aggiunge nuova evidence?

Maintenance
- il test resta leggibile senza conoscere il prompt che lo ha generato?
```

Se non sappiamo compilare queste righe, il test non è pronto solo perché passa.

## Il nuovo ruolo dell'engineer

L'AI può generare cento candidati.

L'engineer deve decidere:

- quali rischi meritano protezione;
- quali test comprano nuova confidence;
- quali duplicano noise;
- quali devono essere piccoli;
- quali devono attraversare infrastruttura reale;
- quali assertions rappresentano davvero il dominio.

È la stessa trasformazione che abbiamo visto nel codice.

> **Quando l'execution diventa abbondante, il judgment diventa più prezioso.**

## Corollario

> **L'AI può scrivere test molto più velocemente di noi. Proprio per questo dobbiamo diventare più severi nel chiedere che cosa quei test sarebbero capaci di impedire.**