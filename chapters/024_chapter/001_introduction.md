# Capitolo 24 — AI dentro l'architettura

Finora l'AI ha lavorato **sul software**. Ha aiutato a comprendere repository, preparare work item, produrre cambiamenti, verificare evidence e orchestrare execution.

Adesso cambia lato del confine.

L'AI entra **nel comportamento del prodotto**.

La differenza è sostanziale. Se un coding agent propone un diff sbagliato, possiamo rifiutarlo prima che diventi parte del sistema. Se una capability AI runtime produce una spiegazione sbagliata davanti a un operatore, quella risposta è già comportamento osservabile del prodotto.

Per questo una feature generativa non è semplicemente:

```text
application
→ model API
→ text
```

Fra la domanda dell'utente e ciò che il prodotto mostra esistono authority, authorization, context, validation, failure e evidence.

Una forma più realistica è:

```text
user intent
→ deterministic authorization
→ bounded context
→ model boundary
→ structured result
→ deterministic validation
→ product policy
→ operator
```

attorno alla quale devono esistere fallback, telemetry, evaluation, cost e security.

Se un domani il modello potrà usare tool o produrre side effect, il boundary dovrà allargarsi ancora: tool permission, action validation, idempotency, audit, confirmation e recovery diventeranno parte della stessa feature.

La domanda architetturale non è quindi:

> **Quale modello usiamo?**

È:

> **Quale responsabilità siamo disposti ad affidare a una componente probabilistica, quale evidence può usare, quale autorità non avrà e che cosa farà il prodotto quando la sua risposta non è abbastanza buona?**

## Il modello entra nel sistema, non sopra il sistema

Order Operations possiede già Functional Analysis, business rule, API ed event contract, Data Ownership Map, Threat Model, Reliability Contract, Testing Strategy e Cost Model.

L'arrivo di un LLM non annulla nessuno di questi confini.

Se Payments & Risk possiede la semantica economica, un modello non acquisisce il diritto di dichiarare un nuovo `PaymentStatus` perché sa formulare una frase convincente. Se `ConfirmedPriorityPolicy` possiede una regola deterministica, il modello non diventa una seconda implementation della Priority. Se l'authorization server-side nega l'accesso a un tenant, non chiediamo all'LLM se secondo lui l'operatore “sembra autorizzato”.

La prima separazione del capitolo è quindi fra **interpretazione** e **autorità**.

> **Il modello può aiutare a interpretare evidence. Il sistema continua a decidere che cosa è vero, chi può vederlo e quale azione è autorizzata.**

Questa frase è più importante di qualunque scelta di provider.

## Il problema ESI non è generare testo

Gli operatori di Commerce & Operations possiedono già i dati necessari a gestire molti `OperationalCase`, ma devono spesso attraversare informazioni provenienti da Order Operations, Orders, Payments e Shipping per ricostruire una timeline e capire dove manchi evidence.

Il costo è cognitivo. Il lavoro non consiste soltanto nel leggere un campo, ma nel mettere in relazione fatti distribuiti, distinguere ciò che sappiamo da ciò che ipotizziamo e rendere la situazione comprensibile rapidamente.

Product propone quindi il **Case Explanation Assistant**.

La promessa della prima versione è stretta:

> un operatore autorizzato apre un caso e riceve una spiegazione dei fatti disponibili, delle ipotesi plausibili e dell'evidence che manca, con riferimenti alle source usate.

La feature non decide rimborsi, non esegue retry payment, non modifica Priority, non inventa `PaymentStatus`, non invia comunicazioni al cliente e non scrive in sistemi enterprise.

È **read-only e advisory**.

Questa scelta non nasce da sfiducia generica nell'AI. Nasce dal rapporto fra valore e blast radius. Per ridurre il tempo necessario a comprendere un caso non abbiamo bisogno, nel primo slice, di concedere al modello anche il potere di cambiarlo.

## Una catena di fiducia, non un catalogo di feature AI

Nel resto del capitolo seguiremo una sola catena.

Prima decidiamo quale truth resta deterministica e quale spazio lasciamo all'interpretazione. Poi costruiamo il contesto che il modello può vedere, applicando authorization e minimization prima della chiamata. Definiamo un output che separi fact, hypothesis e missing evidence. Limitiamo i tool in base al blast radius. Progettiamo fallback perché il prodotto continui a funzionare quando il modello non può rispondere. Infine costruiamo evaluation e runtime signal sufficienti a capire se quella configurazione meriti davvero di essere usata.

In forma compatta:

```text
authority
→ context
→ model
→ validation
→ fallback
→ evaluation
→ runtime evidence
```

Provider, RAG, structured-output API e agent loop vengono **dopo** queste domande.

## Fit before fashion vale ancora di più

Le applicazioni AI rendono facile confondere pattern popolari con requirement.

RAG non è obbligatorio perché la feature usa un modello. Un vector database non è il sinonimo di grounding. Un agent loop non è il livello successivo naturale di un assistant. Il modello più grande non è automaticamente quello con il TCO migliore. Più context non significa necessariamente più groundedness.

Per ESI le source del primo use case sono già note e strutturate. Questo è un fatto architetturale molto importante: prima di costruire embedding, chunking, vector index e retrieval tuning possiamo assemblare deterministicamente il contesto del singolo caso attraverso contract già autorizzati.

> **Grounding è il requisito. RAG è una possibile strategia. Il retrieval deve guadagnarsi il proprio posto come qualunque altra tecnologia.**

## Una componente probabilistica ha failure mode propri, ma resta software

La feature può allucinare, nascondere missing evidence, usare context stale, ricevere testo malevolo, produrre output schema-invalid, diventare indisponibile con il provider, cambiare comportamento dopo un model upgrade o costare molto più del previsto.

Questi failure sembrano nuovi, ma la disciplina è la stessa del resto del libro.

Reliability ci chiede cosa succede quando la dependency fallisce. Security ci chiede quale dato e quale capability siano raggiungibili. Testing ci chiede quale evidence falsifichi una claim. Observability ci chiede quali domande operative dobbiamo poter risolvere. Cost Architecture ci chiede quale valore stiamo comprando. Architecture Evolution ci chiede come rileviamo drift e quando riapriamo la decisione.

AI Architecture non sostituisce Software Architecture. **La costringe a includere un nuovo tipo di componente con più variabilità comportamentale.**

Microsoft Azure Architecture Center tratta context engineering e RAG come discipline che governano le informazioni fornite al modello e collega la valutazione end-to-end a proprietà come groundedness, relevance, completeness e correctness. NIST AI RMF Generative AI Profile tratta il rischio dei sistemi generativi lungo il lifecycle e rispetto al contesto d'uso, non come proprietà isolata del modello.

Fonti:

- [Microsoft Learn — AI technology overview](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/ai-overview)
- [Microsoft Learn — RAG prompt engineering](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/rag/rag-prompt-engineering)
- [NIST AI 600-1 — Generative AI Profile](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence)

Queste fonti non decidono il design ESI. Rafforzano però un principio che useremo per tutto il capitolo: il comportamento nasce dal **sistema completo**, non dal solo model name.

## Il compromesso ESI

Operations vuole ridurre il tempo necessario a comprendere casi complessi. Payments & Risk vuole conservare semantic authority sugli effetti economici. Security vuole impedire che context e tool allarghino tenant e permission boundary. Platform vuole evitare provider coupling nel dominio. Finance vuole misurare costo per outcome utile, non soltanto token.

La prima decisione è quindi:

```text
Case Explanation Assistant v1
= read-only
+ deterministic context assembly
+ provider-neutral model boundary
+ source-backed structured result
+ no write tools
+ explicit insufficient-evidence fallback
+ core journey independent from model availability
```

Accettiamo che l'assistant sia meno autonomo e che in alcuni casi dica `InsufficientEvidence` invece di completare una storia plausibile.

Non accettiamo che una risposta fluida nasconda l'assenza di evidence.

## L'artefatto del capitolo

Questa decisione diventa persistente in un **AI Feature Contract**.

Non è una checklist di “best practice AI”. È il contratto che rende espliciti purpose, authority boundary, context, retrieval, tool, output, fallback, evaluation, observability, cost e review trigger della capability.

Il capitolo farà avanzare anche il capstone con un contratto TypeScript provider-neutral, un seed di eval risk-driven e fitness rule capaci di verificare alcune proprietà deterministiche del boundary.

Non sceglieremo ancora il provider e non inventeremo un eval score.

> **Prima definiamo quale comportamento merita di entrare nel prodotto. Poi confronteremo i modelli sulla capacità di produrlo dentro i limiti che il prodotto ha deciso.**
