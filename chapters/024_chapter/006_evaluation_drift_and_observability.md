# 24.6 — Evaluation, drift e observability: governare un comportamento che può cambiare

Una feature AI runtime introduce una proprietà nuova rispetto a molta logica tradizionale: lo stesso input può produrre output differenti e una configuration che oggi sembra valida può cambiare comportamento senza che il nostro domain code venga modificato.

Può cambiare il modello. Può cambiare il system instruction. Può cambiare il context builder, il retrieval, il safety layer o la distribuzione delle domande degli utenti. Persino un provider upgrade apparentemente trasparente può modificare refusal, style, latency o capacità di seguire le source.

Per questo una suite di test classica è necessaria ma non sufficiente.

La domanda diventa:

> **quale evidence ci permette di affermare che l'intero sistema AI continua a comportarsi abbastanza bene sul workload reale?**

## Test deterministici ed eval proteggono boundary diversi

Alcune proprietà restano perfettamente deterministiche.

Possiamo verificare che un tenant non autorizzato non entri nel context builder, che una source reference sconosciuta venga rifiutata, che un enum invalido non superi il parser e che il fallback scatti su provider timeout.

Altre proprietà riguardano il comportamento probabilistico: la explanation è supportata dalle source? Separa davvero fact e hypothesis? Ammette missing evidence? Evita di prendere authority su refund o Priority? È utile senza diventare eccessivamente assertiva?

Questi due layer non si sostituiscono:

```text
deterministic test
→ invariant che il codice può decidere

behavioral eval
→ qualità / rischio del comportamento generato

runtime monitoring
→ come quel comportamento vive nel traffico reale
```

La confidence cresce quando i tre raccontano una storia coerente.

> **Non usare un eval per ciò che puoi provare deterministicamente. Non usare un unit test per fingere di aver misurato una proprietà comportamentale.**

## L'eval set deve nascere dai failure mode

Un dataset utile non è una collezione di prompt “interessanti”.

È una rappresentazione versionata dei rischi che vogliamo saper rilevare.

Per Case Explanation Assistant ESI parte da sette famiglie: nominal case, missing evidence, conflicting evidence, prompt injection, cross-tenant request, authority-boundary violation e ambiguity.

Il seed concreto contiene `EVAL-001…EVAL-008` e ogni caso dichiara ciò che il sistema deve fare, ciò che non deve fare e la severità se sbaglia.

Questa struttura è importante perché un output generativo può essere accettabile in molti modi differenti. Non vogliamo confrontarlo necessariamente con una frase golden parola per parola. Per molte eval è più utile dichiarare:

```text
required facts
required uncertainty behavior
required source usage
forbidden claims
severity if violated
```

In questo modo misuriamo la semantica che ci interessa, non lo stile preferito da chi ha scritto il dataset.

## Severity viene prima della media

Immaginiamo cento eval case. Novantanove sono eccellenti e uno rivela dati cross-tenant.

Un aggregate score del 99% non rende il sistema accettabile.

Come nel Capitolo 23, i finding non hanno lo stesso peso. Una critical failure su tenant isolation o unauthorized economic authority può bloccare la release anche se il resto del dataset migliora.

La baseline ESI distingue quindi almeno:

```text
Critical
→ cross-tenant disclosure
→ unauthorized economic/business action
→ prompt injection reaching a dangerous sink
→ generated authoritative business truth outside ownership

Major
→ unsupported critical fact
→ hidden missing evidence
→ invalid source attribution
```

Stile, completezza non critica e preferenze linguistiche possono essere misurate senza pesare come un boundary security.

> **Una media riassume il dataset. Non sostituisce la severità del failure più importante.**

## LLM-as-a-judge accelera la misura, ma diventa parte del sistema di misura

Alcune proprietà non si prestano a exact match. Un modello evaluator può applicare rubriche, confrontare claim e source, classificare useful/unsupported behavior e accelerare esperimenti.

Ma introduce un secondo componente probabilistico.

Dobbiamo quindi sapere su quali human label è calibrato, quali shortcut può sfruttare, quanto è sensibile al formato e quale campione viene ancora controllato da persone.

OpenAI ha evidenziato come harness, scorer, contamination e shortcut possano distorcere evaluation e raccomanda di rendere visibili questi hazard e ispezionare campioni.

Fonte:

- [OpenAI — A shared playbook for trustworthy third party evaluations](https://openai.com/index/trustworthy-third-party-evaluations-foundations/)

Il principio è:

> **un grader è uno strumento di misura. Anche lo strumento di misura deve essere validato.**

Un AI judge può essere un ottimo accelerator della review. Non deve diventare un “PASS” autorevole soltanto perché produce un numero.

## La configuration, non il model name, è l'oggetto dell'evaluation

Quando diciamo “abbiamo valutato il modello”, spesso stiamo semplificando troppo.

Il comportamento osservato dipende da:

```text
model/provider route
system instruction
context builder
retrieval / source selection
output schema
tool set
safety configuration
sampling / reasoning settings
evaluator / rubric
```

Per questo ogni eval result deve avere configuration identity sufficiente a essere confrontato nel tempo.

Se cambia il context builder, è cambiata la feature. Se cambiano source e freshness policy, è cambiata la feature. Se aggiungiamo un tool, non abbiamo semplicemente “migliorato l'assistant”: abbiamo aumentato authority surface e devono cambiare threat/eval case.

> **Testiamo il comportamento prodotto dalla configuration completa, non il modello in isolamento.**

## Drift è il modo in cui il contratto perde fit nel tempo

Possiamo distinguere più forme di drift, ma hanno tutte la stessa conseguenza: la baseline che sosteneva una decisione non rappresenta più bene il sistema corrente.

Un **model drift/upgrade** cambia la generazione. Un **prompt drift** modifica instruction e priorità. Un **context drift** aggiunge source, campi o retrieval. Un **product drift** cambia le business rule mentre il dataset conserva aspettative vecchie. Un **user drift** porta gli operatori a usare la feature per domande che il contract non aveva previsto.

Queste forme non richiedono la stessa mitigazione, ma devono produrre review trigger differenti.

La domanda operativa è:

> **quale cambiamento rende il nostro eval set meno rappresentativo del rischio che stiamo accettando?**

## Evaluation debt: quando la behavior surface cresce più dell'evidence surface

Una feature può crescere senza che il dataset cresca con lei.

Nuove source entrano nel context senza injection case. Un nuovo tool viene aggiunto senza authority eval. Un incident non diventa regression case. Un model upgrade avviene senza workload baseline. In quel momento la behavior surface è più grande della evidence surface.

Questa è **evaluation debt**.

Non significa che dobbiamo trasformare ogni production example in un test. Significa che ogni failure importante compreso dovrebbe aumentare la probabilità di intercettare il prossimo failure simile prima del rollout.

```text
new failure understood
→ new/updated risk model
→ eval or deterministic gate
→ future detection cheaper
```

È lo stesso principio con cui un incidente maturo migliora runbook e observability.

## Offline eval e runtime evidence si completano

Prima di un rollout vogliamo dataset versionato, regression evaluation, security/adversarial case, latency/cost baseline e una quota di human review sufficiente a calibrare la quality rubric.

Dopo il rollout il sistema deve produrre signal sul comportamento reale: fallback rate, `InsufficientEvidence`, invalid output, latency, cost, source coverage, correction/dismiss signal, security rejection e sampled quality review.

Microsoft Foundry documenta evaluator separati per retrieval e response quality, inclusi groundedness e response completeness; Azure Architecture Center collega la scelta delle metriche al workload e alla natura non deterministica delle risposte.

Fonti:

- [Microsoft Learn — Built-in evaluators](https://learn.microsoft.com/en-us/azure/foundry/concepts/built-in-evaluators)
- [Microsoft Learn — RAG LLM evaluation phase](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/rag/rag-llm-evaluation-phase)

La telemetria, però, non deve violare la privacy per misurare la qualità. Raw prompt, source text, case ID e operator ID non diventano automaticamente metric dimension. Il Capitolo 15 continua a governare minimization, retention, cardinality e investigation access.

## Non inventare una release threshold prima della baseline

Il dataset ESI esiste già come seed. Non esiste ancora un provider adapter eseguito contro quel dataset.

Quindi sarebbe falsa precisione scrivere:

```text
Groundedness >= 95%
```

senza sapere come la stiamo misurando, quale distribuzione otteniamo e quali trade-off emergono.

Prima serve una baseline reale su candidate configuration. Poi possiamo decidere threshold che separino acceptable, major e critical behavior.

La release policy può essere già chiara senza inventare numeri:

```text
critical boundary violation
→ block

major unsupported behavior
→ resolve or explicitly govern

aggregate quality
→ threshold after baseline
```

Questo mantiene l'evidence vocabulary del libro.

## Lo stato ESI

A fine Capitolo 24 possiamo affermare che il risk-driven eval dataset è **Codified** e che le classi di rischio principali sono rappresentate.

Non possiamo ancora affermare:

```text
model quality Verified
prompt-injection resistance Verified
latency baseline Verified
cost baseline Verified
```

perché nessun model/provider route è stato eseguito contro il dataset.

Il prossimo passo, quando verrà aperto come work item, sarà confrontare configuration reali sullo stesso oracle senza cambiare il dataset per far vincere il candidato preferito.

> **Evaluation non serve a dimostrare che il modello è bravo. Serve a rendere esplicito quale comportamento il prodotto considera abbastanza buono, quale failure considera inaccettabile e quando quella decisione deve essere riesaminata.**