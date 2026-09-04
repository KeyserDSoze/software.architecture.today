# 24.9 — Esercizi, autovalutazione e sintesi

Il Capitolo 24 ha fatto entrare una dependency probabilistica nel prodotto senza concederle automaticamente il ruolo di source of truth, authorization engine o workflow owner.

La disciplina può essere ricondotta a quattro boundary.

**Authority:** quali fact restano posseduti dai sistemi autorevoli e quale output è soltanto interpretazione.

**Context:** quali source possono entrare nel modello, dopo quale authorization, con quale freshness e provenance.

**Capability:** quali tool e sink sono realmente necessari al use case e quale blast radius introducono.

**Evidence:** quali deterministic gate, behavioral eval e runtime signal ci autorizzano a dire che la configuration è abbastanza buona e continua a esserlo nel tempo.

La catena completa è:

```text
product outcome
→ authority boundary
→ authorized context
→ model boundary
→ structured result
→ deterministic validation
→ fallback
→ evaluation
→ runtime evidence
→ review trigger
```

Il model/provider viene scelto dentro questa catena, non al suo posto.

> **La domanda non è quanto potere può tecnicamente usare il modello. È quanto potere serve davvero all'outcome e quale evidence rende governabile concederlo.**

## Le distinzioni che devono restare

**Fact, Derived Fact, Model Interpretation e Authorized Action** non sono gradazioni dello stesso dato. Hanno authority differente.

**Grounding e RAG** non sono sinonimi. Grounding è la relazione desiderata fra output e source controllate; RAG è una possibile strategia di retrieval quando il corpus lo richiede.

**Schema-valid e semantically correct** non sono la stessa cosa. Structured output protegge la forma; source integrity, authority rule ed eval proteggono altre proprietà.

**Read-only e risk-free** non coincidono. Anche una explanation può causare disclosure, misinformation o operator over-trust, ma l'assenza di write tool riduce fortemente alcuni sink.

**Model upgrade e dependency bump** non sono equivalenti. Il behavioral contract può cambiare senza che il TypeScript interface cambi.

**Eval dataset Codified e model quality Verified** sono stati differenti. Il capstone possiede già `EVAL-001…EVAL-008`; non possiede ancora un model result da promuovere a baseline.

Queste distinzioni impediscono a parole come `AI-ready`, `grounded`, `secure` e `verified` di diventare etichette senza evidence.

## Artefatto operativo — AI Feature Contract

Il nuovo artifact del capitolo è l'**AI Feature Contract**.

Non deve diventare un formulario da compilare per qualunque chiamata API. Serve quando una capability AI entra stabilmente nel comportamento del prodotto e dobbiamo mantenere insieme decisioni che altrimenti finirebbero disperse fra prompt, provider configuration, security document e codice.

Il contract collega almeno:

```text
Purpose / Users / Outcome / Non-goals
Model authority boundary
Authoritative systems
Deterministic logic outside model
Context sources / Authorization / Freshness
Retrieval strategy
Untrusted-content classification
Tool / Permission boundary
Input / Output contract
Grounding rules
Fallback / Reliability behavior
Security controls
Evaluation / Critical failures
Observability / Configuration identity
Cost drivers / Unit economics
Owners / Review triggers
```

La struttura è utile perché rende visibile un principio: **il comportamento che non vogliamo lasciare alla discrezione del modello deve vivere nel sistema che lo circonda**.

## Esercizio 1 — Trova il model boundary

Considera una feature in cui un assistant riceve una richiesta cliente e aiuta l'operatore a valutare un rimborso.

Separa:

```text
Fact
Derived Fact
Model Interpretation
Authorized Action
```

Individua almeno tre informazioni che devono essere determinate fuori dal modello. Poi chiediti se il modello debba anche poter eseguire il refund.

Non fermarti a sì/no: descrivi quali nuovi authority, permission, idempotency, audit, recovery ed eval boundary servirebbero per cambiare la risposta.

## Esercizio 2 — Grounding senza default RAG

Scegli una prima retrieval strategy per:

1. spiegare un singolo ordine usando quattro API note;
2. rispondere su 50.000 runbook interni;
3. recuperare la policy fiscale vigente per un paese;
4. trovare casi storici semanticamente simili;
5. mostrare il `PaymentStatus` autorevole corrente.

Puoi usare direct lookup, relational query, keyword search, vector search, hybrid retrieval o nessun retrieval aggiuntivo.

Per ogni caso nomina prima la forza: corpus size, addressability, freshness, authorization e tipo di relevance. Solo dopo scegli il meccanismo.

## Esercizio 3 — Source e sink

Per una capability AI disegna:

```text
untrusted / semi-trusted source
→ model
→ possible sink
```

Identifica data source controllabili da terzi, dati sensibili, tool, side effect irreversibili, confirmation gate e kill/recovery path.

Poi rimuovi almeno un sink non necessario e valuta quanto blast radius hai eliminato **senza cambiare il modello**.

## Esercizio 4 — Structured output che può comunque mentire

Parti dalla richiesta:

```text
Spiega questo caso all'operatore.
```

Definisci un output contract con confirmed fact, hypothesis, missing evidence, source reference e status.

Costruisci poi tre result perfettamente schema-valid ma semanticamente sbagliati: per esempio una source reale che non sostiene la claim, un hypothesis promosso a fact o un refund rappresentato come autorizzato.

Per ciascuno indica quale layer dovrebbe rilevarlo: deterministic validation, authority policy o behavioral eval.

## Esercizio 5 — Fallback come product behavior

Definisci il comportamento della feature quando il provider va in timeout, una context source è indisponibile, l'output resta malformato dopo il repair budget, manca evidence necessaria o scatta una security rejection.

Per ogni failure indica che cosa succede al **core journey** e che cosa succede alla **AI capability**.

Se un assistant opzionale rende indisponibile l'intero prodotto, giustifica esplicitamente perché quel coupling sia necessario.

## Esercizio 6 — Eval set risk-driven

Costruisci dieci eval case partendo da:

```text
failure mode
→ input/context condition
→ required behavior
→ forbidden behavior
→ severity
```

Includi nominal, missing source, conflicting source, prompt injection, unauthorized request, authority violation e ambiguity.

Non scrivere una sola golden answer quando esistono molte risposte corrette. Proteggi invece le proprietà che contano.

## Esercizio 7 — Model upgrade come behavioral change

Un nuovo modello costa meno ed è mediamente più veloce.

Definisci quale evidence deve produrre prima di sostituire la configuration corrente: workload regression eval, critical security/authority cases, structured-output behavior, latency, cost e rollback/canary strategy quando pertinente.

Non usare benchmark generici del provider come prova di equivalenza sul tuo workload.

## Esercizio 8 — Cost per useful outcome

Parti da una metrica provider-centric come:

```text
cost per 1M tokens
```

Trasformala in una metrica più vicina al valore, per esempio:

```text
cost per accepted explanation
```

Poi aggiungi una quality pair che impedisca di migliorare il costo semplicemente producendo explanation peggiori o dichiarando `Supported` troppo spesso.

## Esercizio 9 — Quando entra davvero RAG

Product chiede di aggiungere migliaia di runbook e incident note al Case Explanation Assistant.

Prepara una mini ADR che parta da corpus, ACL, freshness, relevance requirement, poisoning/injection risk, evaluation e cost. Soltanto dopo confronta keyword, vector e hybrid retrieval.

La decisione non deve essere “aggiungiamo un vector DB”. Deve spiegare quale proprietà il nuovo retrieval compra rispetto al deterministic context assembly attuale.

## Esercizio 10 — Il primo write tool

Product chiede di permettere all'assistant di creare una Payment Escalation dopo la explanation.

Riapri almeno:

```text
AI Feature Contract
Threat Model
AI Autonomy Matrix
API / authorization boundary
Testing Strategy
Observability Contract
Failure Mode Map
Cost Model
```

Definisci chi autorizza la write, idempotency, audit, confirmation, prompt-injection blast radius, failure/recovery e security eval.

L'esercizio è riuscito se emerge chiaramente che **aggiungere un tool non è soltanto aggiungere una function declaration al provider SDK**.

## Autovalutazione

Dopo il capitolo dovresti riuscire a guardare una feature AI e individuare subito dove vive l'autorità, quale context entra realmente nel modello, perché un retrieval è necessario, quali sink aumentano il blast radius, quale parte dell'output può essere validata deterministicamente e quale richiede eval.

Dovresti anche saper progettare un fallback che preservi il core journey, descrivere una model upgrade come behavioral change, distinguere offline eval da runtime monitoring e rifiutare una claim di `Verified` quando esiste soltanto un dataset non ancora eseguito.

Se la discussione architetturale comincia e finisce con il nome del modello, il boundary è ancora troppo implicito.

## Che cosa cambia con l'AI

Nel software tradizionale siamo abituati a pensare che una parte importante del comportamento derivi dal codice e dalla configurazione che possediamo direttamente.

Con una capability generativa il behavior dipende anche da:

```text
model
+ prompt/instruction
+ context
+ retrieval
+ tool set
+ safety layer
+ provider behavior
```

Questo non rende il sistema ingovernabile. Sposta però più configuration dentro il behavior contract e aumenta il valore di versioning, eval e observability.

L'architect non deve necessariamente diventare ML researcher. Deve però saper chiedere quale truth sia autorevole, come viene assemblato il context, quale permission possieda il modello, come fallisca, quale evidence sostenga il rollout e come il sistema torni indietro quando la baseline peggiora.

Sono domande di Software Architecture.

## Stato ESI dopo il Capitolo 24

Order Operations possiede ora:

```text
AI Feature Contract                 Codified
CaseExplanation semantic contract   Codified
Deterministic result validation     Codified
Eval seed EVAL-001…008              Codified
AI boundary fitness AI-001…005      Codified + locally verifiable
Provider/model implementation       Pending
Eval execution                      Pending
Production AI runtime               Not deployed
Write tools                         Not authorized
```

Questo stato è intenzionalmente incompleto.

Abbiamo progettato il model boundary prima di scegliere il provider e abbiamo costruito l'oracle prima di dichiarare la qualità. Il passo successivo, quando verrà eseguito, dovrà produrre evidence reale invece di riempire i campi Pending con confidence language.

## Ponte al Capitolo 25

Nel prossimo capitolo allargheremo di nuovo il campo.

Repository context, work item, agent governance e runtime AI rendono molto più abbondante la capacità di execution di una singola persona. Questo apre una domanda organizzativa:

> **quanto sistema può realisticamente governare una persona sola quando gli agenti amplificano ricerca, implementation e review, e quale failure compare quando coordination e accountability restano concentrate in un solo punto?**

È il tema del **One-Man Project**.

## Corollario

> **Non mettere l'AI dentro il prodotto chiedendoti soltanto che cosa può fare. Decidi quale truth può vedere, quale interpretazione può formulare, quale azione può raggiungere e quale evidence deve produrre prima di meritare più potere.**