# Ruoli e confini di delega

Il modo più semplice per progettare male un sistema multi-agent è partire dai nomi degli agenti.

`Backend Agent`.

`Testing Agent`.

`Security Agent`.

`Architecture Agent`.

Il rischio è costruire un organigramma prima di avere capito quali responsabilità meritino davvero di essere separate.

Il punto di partenza dovrebbe essere invece:

```text
decisione
execution
verification
approval
```

Sono quattro responsabilità diverse.

A volte possono convivere.

A volte devono essere separate.

## Planner

Il Planner traduce un execution contract in una sequenza di passi.

Non decide automaticamente nuovi requirement.

Non ha il diritto implicito di ampliare lo scope.

Il suo output utile non è:

```text
I will implement the feature.
```

Ma qualcosa come:

```text
Step 1
Create reproducible PostgreSQL test environment.
Evidence: database accepts migration chain 001 → 002.

Step 2
Exercise successful escalation + outbox commit.
Evidence: both facts committed.

Step 3
Inject second-write failure.
Evidence: both facts absent after rollback.

Stop if
existing migration semantics must change.
```

Un piano è buono quando rende leggibile **quale evidence abilita il passo successivo**.

## Implementer

L'Implementer modifica gli artifact autorizzati.

Il suo perimetro deriva dalla issue e dal Delegation Contract.

Possibili capability:

```text
read repository
edit allowed files
run local build/tests
create test fixtures
produce diff
```

Possibili non-capability:

```text
merge main
modify production data
change enterprise policy
approve own exception
access production secret
```

Questa distinzione è fondamentale:

> **Tool availability non è authorization.**

Se il runtime tecnicamente permette una azione, non significa che il workflow debba autorizzarla.

GitHub documenta un modello simile per il proprio cloud coding agent: ambiente effimero, scope di repository limitato, branch dedicato e controlli specifici attorno all'esecuzione di workflow e secret. La documentazione insiste inoltre sul fatto che l'output dell'agente debba essere revisionato e testato prima del merge.

Fonte:

- [GitHub Docs — Application card: GitHub Copilot Agents](https://docs.github.com/en/copilot/responsible-use/agents)

Il dettaglio implementativo cambierà.

Il principio no:

> **concedi all'executor il minimo potere che gli permette di produrre l'evidence richiesta.**

## Verifier

Il Verifier non deve necessariamente riscrivere il lavoro dell'Implementer.

Deve controllare le proprietà che autorizzano il passo successivo.

Per OO-001, per esempio:

```text
Implementer claim
"atomicity verified"

Verifier asks
- real PostgreSQL or fake?
- migrations 001 and 002 really applied?
- second-write failure injected before commit?
- both tables queried after rollback?
- normal fast suite still independent?
- any production semantics changed?
```

Il verifier può usare:

- test eseguibili;
- diff;
- static analysis;
- contract check;
- query/result;
- trace;
- security scanner;
- separate model review;
- human review.

La cosa importante è che **non confonda review con re-execution manuale completa**.

Ritorna il principio:

> **Verification without re-execution.**

## Reviewer specialistico

A volte il verifier generale non basta.

Per esempio un change può meritare:

```text
Security Reviewer
Data Reviewer
Architecture Reviewer
Domain Reviewer
```

Ma il reviewer specialistico non deve diventare obbligatorio per ogni task.

Deve essere attivato da trigger.

Esempio:

```text
new public ingress
→ Security Reviewer

new authoritative persisted fact
→ Data/Domain Reviewer

new cross-domain economic effect
→ Payments & Risk Reviewer

architecture exception
→ Architecture Reviewer
```

Questo limita il costo della governance.

## Human Decision Owner

Il ruolo più importante rimane umano.

Non perché una persona debba approvare ogni riga.

Ma perché alcune decisioni cambiano il significato, il rischio o la responsabilità del sistema.

Il Human Decision Owner interviene quando il task incontra:

- una decisione funzionale non definita;
- una one-way door;
- una security boundary significativa;
- un nuovo owner dei dati;
- una deroga architetturale;
- una azione irreversibile o ad alto impatto;
- un conflitto fra obiettivi aziendali che il work item non autorizza a risolvere.

La guida pratica OpenAI alla costruzione di agenti raccomanda esplicitamente di pianificare human intervention per azioni ad alto rischio e quando vengono superate soglie di fallimento/retry.

Fonte:

- [OpenAI — A practical guide to building agents](https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf)

Microsoft Agent Framework e OpenAI Agents SDK espongono meccanismi human-in-the-loop che possono sospendere il workflow in attesa di approval prima di tool call sensibili.

Fonti:

- [Microsoft Learn — Human-in-the-loop](https://learn.microsoft.com/en-us/agent-framework/workflows/human-in-the-loop)
- [OpenAI Agents SDK — Human in the loop](https://openai.github.io/openai-agents-python/human_in_the_loop/)

Il framework non decide però **quali azioni meritino approval**.

Quello è design del sistema.

## Separation of duties

Una regola utile è:

> **se un risultato autorizza un passo ad alto impatto, chiediti se chi ha prodotto il risultato dovrebbe anche essere l'unico soggetto che lo verifica.**

Non significa sempre agenti diversi.

Possiamo avere:

```text
same agent
+ deterministic external gate
```

per un task piccolo.

Oppure:

```text
Implementer Agent
→ test/fitness gate
→ Human Reviewer
```

Oppure:

```text
Implementer
→ independent Verifier Agent
→ human approval
```

per un change più critico.

La vera indipendenza non deriva dal fatto che abbiamo cambiato nome al modello.

Deriva dalla separazione di almeno uno fra:

- context;
- instruction;
- permission;
- evidence source;
- evaluation criterion;
- final authority.

Due agenti identici con lo stesso prompt che leggono lo stesso diff possono produrre due opinioni, ma non automaticamente due evidenze indipendenti.

## Il problema dell'auto-certificazione

Un workflow pericoloso è:

```text
agent implements
→ agent edits tests
→ agent runs tests
→ agent summarizes tests
→ agent declares production ready
```

Anche se tutto è in buona fede, il sistema ha pochissima separazione.

Per questo useremo più avanti un **Agent Verification Bundle**.

Il bundle non dice:

```text
reviewer says LGTM
```

Dice:

```text
claim
→ evidence source
→ command/check
→ result
→ limitations
→ independent review when required
```

## ESI: ruolo minimo per OO-001

Per la prima delega seria ESI non crea sette agenti.

Sceglie:

```text
Human Decision Owner
→ Commerce & Operations tech lead

Implementer
→ execution sul work item OO-001

Verifier
→ review indipendente del transaction evidence

Specialist trigger
→ Security/Platform solo se il test harness richiede permission/network condivisi
```

Il Planner può essere una fase dell'Implementer perché il task è già ben definito.

Questa è una decisione di fit.

Il task non giustifica ancora un orchestratore gerarchico complesso.

## Quality floor

La separazione dei ruoli deve proteggere almeno:

```text
scope ownership
permission ownership
verification ownership
approval ownership
```

La frase chiave è:

> **Delegare il lavoro non significa delegare automaticamente il diritto di definire scope, criteri di successo e soglia di accettazione.**
