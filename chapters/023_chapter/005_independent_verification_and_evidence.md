# Verifica indipendente ed evidence

Quando un agente produce molto codice, la tentazione è aumentare la quantità di review.

Non basta.

Serve aumentare la qualità della **evidence**.

La domanda corretta non è:

> quante persone o agenti hanno guardato il diff?

È:

> **quale proprietà importante è stata verificata, con quale meccanismo e da una fonte sufficientemente indipendente dall'implementazione?**

## Review e verification non sono sinonimi

Una review può trovare:

- naming problematico;
- edge case dimenticati;
- coupling;
- bug logici;
- security smell;
- test deboli.

Ma una review testuale non può dimostrare da sola:

- che una transaction PostgreSQL rollbacki realmente;
- che una private route Azure sia raggiungibile soltanto dal path previsto;
- che una restore soddisfi RTO/RPO;
- che un consumer reale tolleri una modifica di contract.

Quindi il verifier deve sapere quando l'unica evidence adeguata è attraversare il boundary reale.

Ritorna una regola del Capitolo 16:

> **Use the real technology when testing the boundary itself.**

## Indipendenza: da cosa?

L'indipendenza non è binaria.

Possiamo separare:

### 1. Agent identity

Un altro agente esegue la review.

Debole se usa esattamente lo stesso contesto e criterio.

### 2. Prompt / instruction

Il verifier riceve una missione diversa:

```text
find evidence that the claimed property is not proven
```

invece di:

```text
check that implementation looks good
```

### 3. Evidence source

L'implementer dice:

```text
transaction is atomic
```

Il verifier usa:

```text
real database result
```

Questa è indipendenza molto più importante.

### 4. Permission

Il verifier non può modificare il codice che sta verificando.

Questo riduce il rischio di green-by-editing-the-oracle.

### 5. Authority

Il verifier può raccomandare `PASS`, ma il merge/high-impact approval resta umano o in una policy separata.

## Verification bundle

Per non trasformare la review in una chat dispersiva introduciamo un artefatto:

> **Agent Verification Bundle**

Struttura minima:

```text
Work Item
Claim
Evidence mechanism
Evidence result
Artifacts inspected
Commands/checks executed
Independent review
Contradictions / findings
Known limitations
Not verified
Stop conditions encountered
Recommendation
```

Non è un report narrativo lungo.

È una **catena di custodia dell'evidence**.

## Claim-first verification

Il bundle parte dai claim.

Esempio OO-001:

```text
Claim C-01
Migration chain 001 → 002 runs on PostgreSQL.

Claim C-02
Escalation + Outbox commit atomically on success.

Claim C-03
Second-write failure rolls back both.

Claim C-04
Fast suite remains independent from PostgreSQL environment.
```

Per ogni claim:

```text
claim
→ evidence
→ result
→ limitations
```

Questo è migliore di:

```text
All tests passed.
```

Perché costringe a dichiarare **che cosa quei test dimostrano**.

## Il verifier non deve fidarsi del summary

Un failure mode agentico molto realistico è:

```text
Implementer executes 27 checks
→ summarizes "all good"
→ Verifier reads only summary
→ approves
```

Abbiamo creato una review apparentemente indipendente che dipende interamente dalla narrazione dell'implementer.

Quando il claim è significativo, il verifier dovrebbe poter accedere almeno a una delle fonti primarie:

- raw test output;
- diff;
- generated artifact;
- schema result;
- trace;
- scan output;
- query result;
- policy decision.

> **La provenance dell'evidence vale più dell'eloquenza del summary.**

## Tracing del workflow agentico

L'OpenAI Agents SDK include tracing di agent run, generation, function tool call, handoff e guardrail. Questo tipo di tracing è utile non soltanto per debugging, ma per ricostruire quali passaggi hanno prodotto un risultato.

Fonte:

- [OpenAI Agents SDK — Tracing](https://openai.github.io/openai-agents-python/tracing/)

Non significa salvare indiscriminatamente ogni prompt e dato sensibile.

Anche il tracing ha:

- data minimization;
- retention;
- access control;
- cost;
- privacy.

Il Capitolo 15 vale anche per gli agenti.

## LLM-as-judge

Un modello può essere usato come evaluator.

Può essere utile per:

- confrontare output con rubriche;
- classificare violation;
- trovare missing case;
- fare adversarial review.

Ma non trasformiamo:

```text
LLM says PASS
```

in una prova universale.

L'evaluator può condividere bias, incomprensioni o errori del producer.

Per proprietà deterministiche preferiamo evidence deterministica.

Per proprietà qualitative usiamo rubriche, esempi, più source di evidence e human sampling quando il rischio lo richiede.

## GitHub: AI review non sostituisce human review

GitHub documenta esplicitamente che Copilot code review può sbagliare e raccomanda di validarne attentamente il feedback e di affiancarlo a review umana.

Fonte:

- [GitHub Docs — About GitHub Copilot code review](https://docs.github.com/en/copilot/concepts/agents/code-review)

La stessa documentazione sul cloud coding agent richiede di revieware e testare il contenuto generato prima del merge.

Fonte:

- [GitHub Docs — Application card: GitHub Copilot Agents](https://docs.github.com/en/copilot/responsible-use/agents)

Il messaggio per il libro non è "AI review is bad".

È:

> **una review è una source di signal. Il gate deve essere proporzionato al rischio del claim.**

## Verification without re-execution

Il manager umano non può:

- leggere ogni file;
- rieseguire ogni test;
- ricostruire ogni decisione;
- rifare il lavoro dell'agente.

Altrimenti l'automazione non scala.

Quindi il Verification Bundle deve comprimere l'evidence senza perdere provenance.

Una buona compressione è:

```text
Claim
C-03 rollback both facts

Evidence
integration test ID PG-ATOMIC-02
PostgreSQL 18 test container
migration 001 → 002
forced outbox insert failure

Result
PASS

Primary evidence
raw test log + query output

Limitation
single-node test engine; no HA/failover claim
```

Il reviewer può poi campionare l'evidence primaria invece di rifare tutto.

## Contradiction first

Un verifier forte cerca anche contradiction.

Esempio:

```text
Claim
Fast test layer remains independent.

Contradiction search
Does npm test now require Docker?
Does package import integration adapter globally?
Does setup fail without PostgreSQL?
```

Questo riduce confirmation bias.

## Evidence debt

Se un workflow continua a produrre claim che nessun gate riesce a verificare, abbiamo **evidence debt**.

Esempi:

```text
"secure"
"production ready"
"backward compatible"
"reliable"
```

senza mechanism associato.

Il manager di agenti deve trattare questo come rischio di sistema, non come difetto di wording.

## ESI: Verification Bundle per OO-001

Prima di eseguire OO-001 definiamo già la forma del bundle atteso.

```text
Work item
OO-001

Required claims
C-01 migration chain
C-02 success atomicity
C-03 failure rollback
C-04 fast-layer independence
C-05 evidence scope explicit

Independent verifier
separate review role

Forbidden shortcut
rewriting migration semantics merely to pass

Human gate
if stop condition triggers
```

La cosa importante è che il verifier non debba inventare a posteriori cosa controllare.

I criteri principali erano già nella issue.

> **La verification migliore comincia prima dell'implementazione, quando decidiamo quale evidence ci servirà per credere al risultato.**
