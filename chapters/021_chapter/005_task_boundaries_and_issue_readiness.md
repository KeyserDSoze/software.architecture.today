# 21.5 — Task boundary e issue readiness

Un repository può essere molto ben documentato e ricevere comunque task impossibili da delegare responsabilmente.

“**Migliora il sistema di priority**” è un buon esempio. Potrebbe significare cambiare una business rule, ridurre latency, rimuovere legacy, aggiungere persistenza, modificare UX o autorizzare il candidate rollout. Un agente può scegliere una di queste interpretazioni e implementarla in pochi minuti.

La velocità non rende la richiesta più chiara. Rende l'ambiguità più produttiva.

> **Repository-ready e task-ready sono due proprietà diverse.**

Il repository rende persistente ciò che è normalmente vero. Il task descrive il delta: ciò che deve diventare vero adesso.

## Il task è un contratto temporaneo

Se il repository contiene purpose, boundary, decision context e verification path, la issue non deve ricopiare tutta l'architettura. Deve aggiungere il cambiamento che quel contesto non può conoscere in anticipo.

Possiamo rappresentare la relazione così:

```text
repository context
= stable operating model

task context
= requested delta
```

Una buona issue rende leggibili problema, outcome atteso, scope semantico, ciò che resta fuori scope, acceptance criteria, route verso il contesto rilevante, verification ed eventuali decisioni ancora aperte.

Non serve trasformare ogni ticket in un template burocratico di otto sezioni. Serve che quelle informazioni siano recuperabili senza obbligare l'esecutore a inventarle.

GitHub raccomanda per i coding agent task chiari e ben scoped, con problema, acceptance criteria e indicazioni utili sui componenti coinvolti. OpenAI, descrivendo il proprio uso di Codex, suggerisce analogamente task strutturati come issue, con riferimenti a file, componenti o diff quando aiutano l'esecuzione.

Fonti:

- [GitHub Docs — Responsible use of Copilot agents](https://docs.github.com/en/copilot/responsible-use/agents)
- [OpenAI — How OpenAI uses Codex](https://openai.com/business/guides-and-resources/how-openai-uses-codex/)

La convergenza non è interessante perché arriva da due vendor. È interessante perché ribadisce un principio di software engineering: **l'execution è più affidabile quando il lavoro ha un confine verificabile**.

## Scope semantico prima della file list

Dire all'agente di modificare `src/priority/confirmed-priority-policy.ts` limita il luogo, non il significato.

Una definizione migliore direbbe che vogliamo aggiungere una nuova regola confermata, quale precedence deve avere, quali behavior esistenti devono restare invariati e quali file sono probabilmente coinvolti.

Per esempio:

```text
Goal
Add confirmed priority rule X before the default rule.

Preserve
Closed
ManualReview
RepeatedPaymentFailure
ED-001

Likely surfaces
src/priority/*
target tests
priority functional analysis
```

I path aiutano a navigare. Il vero scope è la **semantic surface** che il task è autorizzato a cambiare.

Questa distinzione rende anche la review più forte: possiamo controllare se il diff soddisfa il delta richiesto invece di chiederci soltanto se ha modificato i file “giusti”.

## Out of scope protegge dal task amplification

Gli agenti capaci vedono facilmente opportunità laterali. Durante un change locale possono notare una dependency da aggiornare, un naming incoerente, una migration da ripulire o un pezzo di infrastruttura migliorabile.

Questa capacità è utile. Diventa un failure mode quando ogni opportunità viene assorbita automaticamente nel task corrente.

Chiamiamo questo fenomeno **task amplification**:

```text
small scoped task
→ adjacent improvement discovered
→ scope expands
→ more files / contracts / infra
→ original acceptance becomes a small part of the diff
```

Il diff può essere tecnicamente buono e operativamente peggiore: più difficile da spiegare, verificare, rollbackare e attribuire a una singola decisione.

Per questo l'out of scope è particolarmente prezioso con esecutori veloci. Un task di priority può dire esplicitamente: niente schema, niente public API, niente legacy deletion, niente topology change.

L'agente può ancora scoprire lavoro adiacente. Deve registrarlo come follow-up invece di trasformarlo in permission implicita.

> **Scoprire lavoro fuori scope non autorizza ad assorbirlo.**

## Acceptance criteria: descrivere proprietà osservabili

“Priority should work better” non è un acceptance criterion. Non ci dice quale cambiamento autorizziamo né quale comportamento dobbiamo preservare.

Una forma osservabile è molto più forte:

```text
Given Open + Payment + failedAttempts >= 3
→ priority remains Urgent

Given Enterprise tier without another urgency condition
→ priority remains Standard
```

Queste frasi descrivono il risultato. La sezione Verification collega poi quel risultato agli oracle esistenti:

```text
npm run typecheck
npm test
```

oppure a gate più specifici quando il task tocca un boundary che il test locale non può verificare.

Acceptance e verification restano concetti diversi: la prima dice **che cosa deve essere vero**, la seconda **come cerchiamo evidence che lo sia**.

## Gli unknown devono restare unknown

Una issue matura non finge di conoscere ogni dettaglio.

Supponiamo di non aver ancora deciso se una nuova priority debba essere persistita. Il task può dichiararlo apertamente:

```text
Open decision
Persistence ownership is unresolved.

Task boundary
Do not add persistence.
Stop if the requested behavior cannot be implemented without it.
```

Questa frase vale molto più di una soluzione tecnica improvvisata. Impedisce a un agente di riempire un vuoto di dominio con un database change plausibile.

È una continuazione naturale del vocabolario `Found → Inferred → Observed → Confirmed`: ciò che non è deciso non deve diventare vero soltanto perché l'esecuzione ha bisogno di una risposta.

## One-way door richiede authority esplicita

Alcuni task possono attraversare una soglia oltre la quale rollback e recovery cambiano natura: destructive migration, breaking contract, public ingress, data-ownership transfer, cutover senza fallback, rimozione definitiva del legacy.

Una frase vaga in una issue non dovrebbe poter autorizzare queste decisioni per implicazione.

Il task deve invece collegarsi al decision record, alla stop condition e all'owner autorizzato. Se manca uno di questi elementi, il problema non è “come implementiamo?”. È “chi può decidere che questo rischio è accettabile?”.

Questo tema diventerà più esplicito nei capitoli sull'autonomia. Nel Capitolo 21 ci basta fissare il confine: **task specificity non crea authority**.

## Verification budget: spendere evidence dove serve

Il Capitolo 20 ci ha ricordato che anche la verifica ha un costo. Un task locale non deve necessariamente avviare un environment cloud completo; una modifica a identity o networking non può però accontentarsi di test puramente locali.

Per questo una issue può dichiarare il proprio verification budget:

```text
local only
```

oppure:

```text
local + PostgreSQL integration
```

oppure:

```text
requires Azure non-production evidence
```

Il budget non è un tetto finanziario arbitrario. È il modo per collegare la claim al livello di fidelity necessario a verificarla.

Se il gate richiesto non esiste, il task può ancora produrre codice. Ma il risultato deve restare `Codified` invece di essere promosso a `Verified` per convenienza.

## Handoff e parallelismo hanno bisogno dello stesso boundary

Un task ben definito può attraversare più esecutori senza cambiare significato.

Un discovery agent può identificare file, behavior osservato, open question e verification candidate. Un implementation agent può lavorare sul delta. Un reviewer può confrontare diff, acceptance ed architecture fitness.

Se il task non ha un boundary, ogni passaggio ricostruisce una versione diversa del problema e il parallelismo moltiplica l'ambiguità invece della capacità.

Questo è uno dei motivi per cui nel Capitolo 22 useremo la issue come unità di orchestrazione.

## La regola che prepara il capitolo successivo

Il repository dovrebbe essere abbastanza ricco da rendere la issue **più corta**, non più lunga.

La issue può dire:

```text
Relevant context
Repository Map → Priority capability
Follow AGENTS.md stop conditions
```

senza ricopiare duecento righe di architettura.

Il repository contiene ciò che resta vero fra i task. La issue contiene ciò che deve cambiare in questo task.

> **Quando questa separazione funziona, possiamo aumentare l'autonomia dell'execution senza aumentare nella stessa misura l'ambiguità del lavoro.**