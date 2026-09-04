# 24.8 — ESI: Case Explanation Assistant entra nell'architettura

A questo punto Order Operations può introdurre la prima capability AI runtime senza trattarla come una demo separata.

Il progetto possiede già boundary di dominio, ownership, security, reliability, testing, observability e cost. Il Case Explanation Assistant deve quindi **entrare dentro quelle decisioni**, non costruire un mondo parallelo in cui il modello possiede una seconda versione della verità.

Il problema di prodotto è concreto. Un operatore che apre un caso deve spesso mettere insieme Operational Case, stato ordine, segnali Payments, Shipping, Payment Escalation ed eventuali failure di integrazione. I dati esistono, ma ricostruire rapidamente la storia costa attenzione.

La feature deve ridurre quel costo cognitivo rispondendo a una domanda precisa:

> **Che cosa sappiamo, che cosa possiamo soltanto ipotizzare e quale evidence ci manca ancora?**

Non deve decidere quale azione economica eseguire.

## La prima scelta è togliere authority che non serve

V1 è read-only e advisory.

Il modello può ricevere context autorizzato e restituire una spiegazione. Non può fare refund, retry payment, modificare Priority o `OperationalCase`, inviare comunicazioni al cliente, navigare il web o accedere arbitrariamente a dati enterprise.

Questa restrizione è parte del product contract, non una limitazione accidentale del primo adapter.

Il valore della feature viene dal comprendere più velocemente il caso. Concederle side effect aumenterebbe il blast radius senza essere necessario per provare quell'outcome.

```text
read authorized facts
→ interpret
→ explain with sources
```

resta quindi separato da:

```text
decide remediation
→ execute business action
```

Se Product proporrà il secondo percorso, dovremo riaprire Threat Model, authority, authorization, Autonomy Matrix, eval e recovery.

## Il context path è deterministico

La prima versione non usa RAG.

Il context builder deve raccogliere soltanto le source note del caso:

```text
OperationalCase
Orders support view
Payments support view
Shipping support view
deterministic derived facts
```

applicando authorization e tenant boundary prima dell'acquisizione.

Il risultato concettuale è `CaseExplanationContext`, che conserva `caseId`, `tenantId`, `observedAt` e una collezione di source con provenance, kind e observation time.

Il design non introduce embedding o vector database perché non esiste ancora un retrieval problem che li giustifichi. Se in futuro entreranno migliaia di runbook o incident history, quella nuova forza riaprirà la strategia.

> **La prima implementation compra grounding senza comprare ancora una piattaforma di retrieval.**

## Il model boundary è già codice

Il capstone contiene:

```text
src/ai/case-explanation.ts
```

con `CaseExplanationContext`, `CaseExplanationResult` e un port provider-neutral:

```text
CaseExplanationPort
  explain(context)
  → CaseExplanationResult
```

Il dominio non importa SDK OpenAI, Azure o altri provider.

Questo è un avanzamento concreto: **il contratto semantico della capability è Codified**.

Non significa che un modello reale sia già integrato.

L'adapter provider resta Pending e nessuna model route è stata scelta. Il port protegge il code boundary; la futura eval dovrà proteggere il behavioral boundary.

## L'output separa fact, hypothesis e missing evidence

`CaseExplanationResult` espone:

```text
status
summary
confirmedFacts[]
hypotheses[]
missingEvidence[]
sourceReferences[]
```

Lo status distingue `Supported`, `PartiallySupported`, `InsufficientEvidence` e `Unavailable`.

Un confirmed fact deve indicare source conosciute. Una hypothesis conserva a sua volta provenance ma resta rappresentata come interpretazione. Se lo status dichiara supporto parziale o evidence insufficiente, il risultato deve rendere esplicito ciò che manca.

Questo contratto rende possibile una UI che non appiattisca tutto in una frase autorevole.

La regola di prodotto è:

> **missing evidence è informazione da mostrare, non un vuoto che il modello deve riempire con conoscenza parametrica.**

## Il primo validator protegge ciò che può essere deterministico

Il capstone contiene anche:

```text
validateCaseExplanationResult(...)
```

che verifica source reference sconosciute, fact o hypothesis senza source e status parziali privi di `missingEvidence`.

Il commento nel codice è importante: questa funzione **non dichiara di provare groundedness**.

Può controllare che un reference esista nel context. Non può determinare da sola che il testo della claim sia realmente supportato dalla source.

Questa distinzione evita verification theatre:

```text
reference integrity
= deterministic guardrail

grounded semantic claim
= behavioral evaluation problem
```

Il validator protegge il boundary che sa misurare e non finge di coprire quello successivo.

## Il seed di evaluation è già versionato

Il repository contiene:

```text
evals/case-explanation-v1.jsonl
```

con otto scenari iniziali:

| ID | Rischio principale |
|---|---|
| EVAL-001 | nominal case con source coerenti |
| EVAL-002 | Payments evidence mancante |
| EVAL-003 | evidence in conflitto |
| EVAL-004 | prompt injection in testo controllato dall'utente |
| EVAL-005 | richiesta cross-tenant |
| EVAL-006 | richiesta di decidere un refund |
| EVAL-007 | richiesta di override della Priority |
| EVAL-008 | ambiguity con più spiegazioni plausibili |

Ogni scenario dichiara required behavior, forbidden behavior e severità del failure.

Questo significa che **l'eval oracle seed è Codified**.

Non significa che model quality sia Verified. Nessun adapter/provider è stato ancora eseguito contro il dataset e non esiste alcuno score da dichiarare.

Questa differenza deve restare visibile nel manoscritto e nel capstone.

## AI boundary fitness: automatizzare il minimo deterministico

ESI aggiunge:

```text
tests/ai-boundary-fitness.test.mjs
```

La baseline contiene cinque check:

| ID | Proprietà protetta |
|---|---|
| AI-001 | AI Feature Contract, source boundary ed eval seed esistono |
| AI-002 | il boundary semantico resta provider-neutral, read-only e senza RAG obbligatorio |
| AI-003 | confirmed fact con source conosciuta supera la validation |
| AI-004 | source inventate e partial result senza missing evidence vengono rifiutati |
| AI-005 | il seed copre nominal, evidence, security, cross-tenant, authority e ambiguity |

Questi test non provano prompt-injection resistance o usefulness del modello. Rendono invece difficile perdere accidentalmente alcune proprietà strutturali che abbiamo già deciso.

È la stessa strategia usata per architecture, context e agent governance: **fitness function dove la proprietà è meccanicamente verificabile; eval e review dove non lo è**.

## Failure isolation: il core continua a esistere senza AI

Case Explanation Assistant non entra nel critical path della vista operativa.

Se il provider è down, lo stato dell'assistant diventa `Unavailable` e l'operatore continua a usare l'Operational Case view. Se manca Payments evidence, il risultato può diventare `PartiallySupported` o `InsufficientEvidence`. Se il model output resta invalido dopo il bounded repair, la UI non mostra una explanation generata.

La relazione è intenzionale:

```text
AI unavailable
≠
Order Operations unavailable
```

Questa decisione compra graceful degradation prima ancora di avere un SLO numerico per il modello.

## Observability e cost vengono progettati prima dei numeri

Il contract definisce candidate event come request, completed, unavailable, insufficient-evidence, invalid-output e security-rejected. Dimension come model route, result status, failure class e versioni di prompt/context possono essere bounded; case ID, operator ID e raw prompt non diventano metric dimensions.

Anche il Cost Model identifica driver candidati come token, context size, model route e retry, ma non pubblica prezzi o saving inventati.

Le future unit metric possono includere `cost per accepted Case Explanation`, sempre accoppiate a quality evidence.

Finché non esiste una runtime configuration eseguita, observability e unit economics restano Designed.

## Il provider resta volutamente una two-way door

ESI non sceglie ancora un modello.

Prima vuole confrontare candidate configuration sullo stesso eval seed e misurare almeno behavior critico, latency e cost. Provider e model route restano quindi Pending.

Questa è una scelta architetturale, non un buco da riempire con il nome del provider più popolare.

```text
product contract
→ Codified

eval risk surface
→ Codified

provider implementation
→ Pending

eval execution
→ Pending
```

> **Prima definiamo quale comportamento il prodotto richiede. Poi lasciamo che siano workload eval ed evidence a restringere la technology choice.**

## Stato ESI dopo il Capitolo 24

A fine capitolo la fotografia corretta è:

```text
AI Feature Contract                 Codified
CaseExplanation semantic contract   Codified
Deterministic result validation     Codified
Eval dataset EVAL-001…008           Codified
AI boundary fitness AI-001…005      Codified + locally verifiable
Deterministic context builder       Designed / Pending implementation
Provider/model adapter              Pending
Provider/model decision             Pending eval comparison
Eval execution                      Pending
Production runtime                  Not deployed
Write tools                         Not authorized
RAG/vector retrieval                Not selected / not required in v1
```

Il progetto è avanzato molto senza aver ancora chiamato un modello reale.

Ed è esattamente il punto del capitolo: **la parte più importante dell'AI Architecture può essere progettata prima di scegliere l'AI provider**.

## Review trigger

Il contract va riaperto se Product chiede action tool, entra un corpus documentale ampio, compare una nuova source sensibile, nasce cross-case analysis, la feature entra nel critical journey, cambia model/provider, le eval scoprono una nuova failure class oppure cost e latency rendono insufficiente la topologia corrente.

Ogni trigger allarga o modifica una delle quattro superfici viste nel capitolo: authority, context, capability o evidence/lifecycle.

> **ESI non concede al modello più potere perché il modello può usarlo. Gli concede soltanto il potere necessario all'outcome corrente e prepara evidence e controlli prima di allargare il boundary.**