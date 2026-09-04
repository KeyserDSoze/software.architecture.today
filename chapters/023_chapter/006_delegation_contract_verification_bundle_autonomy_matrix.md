# 23.6 — I tre artefatti di governo degli agenti

A questo punto abbiamo tre problemi diversi che non dovrebbero essere compressi dentro un unico prompt.

Il primo riguarda il mandato: che cosa può fare l'executor? Il secondo riguarda la prova: quale evidence deve esistere prima di accettare il risultato? Il terzo riguarda la progressione: fino a quale punto può arrivare quella capability senza un nuovo gate?

Per questo ESI separa:

```text
Agent Delegation Contract
Agent Verification Bundle
AI Autonomy Matrix
```

La separazione non aggiunge burocrazia per principio. Evita che scope, permission, verification e approval vengano mescolati nello stesso testo fino a diventare indistinguibili.

## Agent Delegation Contract — il mandato operativo

Il Delegation Contract non è una seconda issue e non è una copia del repository context.

La source of truth sul lavoro resta il work item. Il contract aggiunge ciò che serve per **delegare quell'execution a una specifica role/capability dentro un permission boundary**.

Per OO-001 la forma minima è:

```text
Delegation ID
Work item
Role
Goal
Allowed scope
Forbidden scope
Canonical context
Allowed capabilities
Permission boundary
Required verification
Stop conditions
Escalation owner
Retry / repair budget
Output contract
```

Il goal deve restare outcome-oriented. Non “usa PostgreSQL e scrivi test”, ma “produci higher-fidelity evidence per TST-005 senza cambiare Payment Escalation semantics”.

Allowed e forbidden scope devono raccontare il **decision boundary**, non soltanto directory. L'Implementer può creare il test harness e scegliere un environment locale riproducibile; non può introdurre un nuovo authoritative fact o riscrivere migration `001/002` per convenienza.

Il permission boundary traduce poi il mandato in capability reali: read repository, edit scoped worktree, start isolated PostgreSQL, run approved checks. Merge, production credential e policy approval restano fuori.

La stop condition chiude il contratto nel punto più importante: quando l'execution richiede una nuova decisione, `STOPPED` è un output valido.

> **Il Delegation Contract non promette che il task verrà completato. Definisce fin dove l'executor può provare a completarlo senza cambiare il mandato.**

## Agent Verification Bundle — la catena claim-to-evidence

Il Verification Bundle accompagna il risultato e deve permettere una review efficace senza rieseguire tutto.

La struttura utile è:

```text
Work Item
Delegation ID
Implementation revision
Claims
Evidence per claim
Primary evidence references
Checks executed
Independent findings
Known limitations
Not verified
Stop conditions encountered
Recommendation
```

Il bundle non è una narrazione lunga e non è un paste di migliaia di righe di log.

Per ogni claim vuole rendere leggibile una catena:

```text
claim
→ mechanism
→ result
→ primary evidence
→ verifier finding
→ limitation
```

Per C-03, per esempio, non basta “atomicity test passed”. Vogliamo sapere che il motore era PostgreSQL reale, dove è stato iniettato il failure, quali query sono state eseguite dopo rollback e quale boundary resta fuori dalla prova.

Il bundle comprime. Non sostituisce la source primaria.

> **La provenance dell'evidence vale più dell'eloquenza del summary.**

## AI Autonomy Matrix — quanto può avanzare una capability

La matrice non assegna un voto all'agente.

Classifica capability in contesto e rende esplicito il rapporto fra livello attuale, gate richiesto e trigger di revisione.

Una forma semplice è:

| Capability | Livello corrente | Gate | Trigger di revisione |
|---|---:|---|---|
| read/search repository | A3 | repository access boundary | data sensitivity cambia |
| edit scoped worktree | A2 | work item + Delegation Contract | blast radius cresce |
| run isolated PostgreSQL for OO-001 | A2 | ADC-OO-001-v1 | shared/privileged environment richiesto |
| add test-only dependency | A2 | closure evidence + review | dependency diventa sensitive/networked |
| modify architecture oracle | A0/A1 proposal | explicit architecture decision | policy review |
| change data ownership | A0 | domain/data authority | separate decision |
| merge default branch | human/repository gate | repo policy | future evidence/policy change |
| production destructive action | A0 | dedicated runbook + approval + recovery evidence | future operational workflow |

La matrice vive vicino al Threat Model e al Cost Model perché l'autonomia modifica permission surface, failure mode, review cost e operational exposure.

> **Autonomy is versioned architecture.**

Quando cambiano tool, dati, environment, reversibilità o evidence strength, la decisione deve poter essere riaperta.

## Come si incastrano i tre artifact

Il flusso complessivo è:

```text
Work Item
   ↓
Agent Delegation Contract
   ↓
Execution
   ↓
Agent Verification Bundle
   ↓
AI Autonomy Matrix / approval policy
   ↓
next step or STOP
```

Il work item dice quale outcome vogliamo. Il Delegation Contract dice quale executor può provarci e con quali limiti. Il Verification Bundle dice che cosa è stato dimostrato. L'Autonomy Matrix dice se quella evidence è sufficiente per procedere automaticamente oppure se serve un nuovo gate.

Le responsabilità restano separate anche se, per un task piccolo, alcuni step vengono eseguiti dallo stesso sistema.

## Non duplicare il repository dentro il contract

OO-001 contiene già problem, acceptance, canonical context e stop condition. `AGENTS.md` contiene già il routing repository-wide. I documenti di architecture contengono già le decisioni.

Il Delegation Contract deve quindi referenziare, non copiare.

Una buona versione può dire:

```text
Work item
OO-001

Additional delegation constraints
role = Implementer
autonomy = A2
isolated PostgreSQL only
max 2 bounded repair loops
cannot change verification oracle
```

Questo riduce instruction drift e rende più chiaro quale documento aggiornare quando cambia il task rispetto a quando cambia la governance.

## Non duplicare l'evidence nel bundle

Lo stesso principio vale per la verification.

Il bundle deve contenere summary, result, finding e link/reference alla primary evidence. Non deve incorporare cinquanta mila righe di log “per completezza”.

È la stessa disciplina dell'observability: **più dati non equivalgono automaticamente a migliore capacità investigativa**.

Il reviewer deve sapere dove andare se vuole approfondire un claim e quale limitation è già nota.

## Un executor non può auto-espandere il proprio mandato

Questa è una delle proprietà più importanti del modello.

L'Implementer può scoprire che il contract è insufficiente. Può proporre una modifica. Non dovrebbe però poter aumentare unilateralmente scope, permission o autonomy soltanto perché il task corrente non si chiude.

Se OO-001 sembra richiedere di riscrivere migration `002`, il comportamento corretto è:

```text
STOP
→ evidence
→ decision required
```

Non:

```text
edit Delegation Contract
→ migration rewrite now allowed
→ continue
```

Lo stesso vale per l'Autonomy Matrix. Il workflow non può concedersi il potere che gli manca per terminare il proprio task.

> **Chi esegue può proporre un cambio di policy. Non deve essere l'unica authority che approva il cambio necessario ad auto-sbloccarsi.**

## Markdown e runtime enforcement hanno ruoli diversi

Un document contract aiuta persone e agenti a capire il mandato. Non impedisce materialmente una tool call.

Quando il rischio lo richiede, il contract deve essere riflesso da controlli reali: worktree isolation, branch protection, allowlist, credential scope, network policy, CI gate e human approval hook.

OpenAI Agents SDK e Microsoft Agent Framework documentano approval flow per tool call sensibili; GitHub descrive permission limitate per il proprio coding agent.

Fonti:

- [OpenAI Agents SDK — Human in the loop](https://openai.github.io/openai-agents-python/human_in_the_loop/)
- [Microsoft Learn — Human-in-the-loop](https://learn.microsoft.com/en-us/agent-framework/workflows/human-in-the-loop)
- [GitHub Docs — Application card: GitHub Copilot Agents](https://docs.github.com/en/copilot/responsible-use/agents)

Il principio è:

> **documentare la regola rende il boundary comprensibile; applicarla nel runtime impedisce che un'incomprensione diventi automaticamente una capability.**

## La prima baseline ESI

Per Order Operations la prima versione è deliberatamente conservativa:

```text
Delegation Contract
→ ADC-OO-001-v1
→ Implementer A2

Verification Bundle
→ C-01…C-05
→ Pending execution

Autonomy Matrix
→ bounded local/test execution
→ human/repository merge gate
→ no A4 production capability
```

Non aumenteremo questi livelli perché compare un modello nuovo. Li riapriremo quando task reali produrranno evidence su accepted rate, repair loop, false green, review effort, policy violation e cost per verified change.

> **La maturità agentica non è quante decisioni togliamo agli esseri umani. È quante decisioni possiamo delegare senza perdere il controllo sul mandato, sull'evidence e sull'autorità che le rende accettabili.**
