# 24.3 — Grounding, context engineering e RAG senza riflessi automatici

Una capability generativa enterprise raramente può lavorare bene usando soltanto la conoscenza incorporata nel modello.

Il modello non conosce automaticamente:

- lo stato corrente di Order Operations;
- il tenant corretto;
- l'ultima Payment Escalation;
- la policy Priority confermata da ESI;
- un runbook appena aggiornato;
- una decisione architetturale presa ieri.

Serve contesto.

Ma **dare più contesto** non equivale a dare **il contesto giusto**.

## Grounding

Con grounding intendiamo, in questo capitolo, il processo con cui forniamo al modello evidence rilevante del nostro sistema affinché la risposta possa essere ricondotta a fonti controllate.

Schema concettuale:

```text
user question
→ authorized context acquisition
→ context normalization
→ model
→ grounded answer
→ source references
```

La qualità della risposta dipende quindi da almeno due sistemi:

```text
context pipeline
+
generation pipeline
```

Un modello eccellente con contesto sbagliato produce una risposta elegantemente sbagliata.

## RAG è una strategia di retrieval, non la definizione di grounding

Retrieval-Augmented Generation è utile quando abbiamo bisogno di selezionare informazioni rilevanti da un insieme più ampio di contenuti.

Microsoft Azure Architecture Center descrive RAG come un pattern nel quale un retrieval system fornisce grounding data al modello e sottolinea che il retrieval non è limitato a un particolare vector database.  
Fonte: [Microsoft Learn — AI technology overview](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/ai-overview).

Questo è importante perché evita una equivalenza troppo comune:

```text
RAG = embeddings + vector database
```

Non necessariamente.

Il retrieval può dipendere da:

- keyword/search index;
- relational query;
- graph traversal;
- document store;
- APIs;
- vector similarity;
- hybrid retrieval;
- tool call deterministica.

La domanda resta quella di sempre:

> **Quale retrieval ha il fit migliore con la conoscenza che dobbiamo recuperare?**

## Perché ESI non introduce ancora un vector database

Case Explanation Assistant deve spiegare **un Operational Case specifico**.

Le fonti principali sono già note e strutturate:

```text
Order Operations
Orders
Payments
Shipping
```

Possiamo costruire deterministicamente:

```text
CaseExplanationContext
```

attraverso contract già autorizzati.

Non abbiamo ancora un problema del tipo:

> trova cinque documenti rilevanti fra due milioni di pagine enterprise.

Quindi introdurre oggi:

```text
embedding pipeline
vector index
chunking
re-indexing
retrieval tuning
vector ACL propagation
```

sarebbe un costo senza una forza sufficiente.

> **Non aggiungere retrieval probabilistico quando conosci già deterministicamente quali fonti ti servono.**

## Quando RAG potrebbe entrare

Un trigger reale potrebbe essere l'introduzione di:

- runbook operativi estesi;
- knowledge base di incidenti;
- procedure Customer Support;
- documentazione prodotto ampia;
- policy interne versionate;
- storico di casi risolti consultabile con controlli appropriati.

A quel punto dovremo decidere:

```text
corpus
chunking
metadata
ACL
freshness
retrieval metric
re-ranking
citation/provenance
re-indexing
retention
```

Non basta aggiungere un vector store.

## Context engineering

Microsoft definisce context engineering in termini più ampi di RAG: progettare selezione, scope e struttura di documenti, conversation history, tool output, system instructions ed enterprise data che arrivano al modello.  
Fonte: [Microsoft Learn — AI technology overview](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/ai-overview).

Nel nostro sistema significa decidere:

### Cosa entra

Solo dati necessari alla domanda e autorizzati per l'operatore corrente.

### Cosa resta fuori

Dati di altri tenant, dettagli irrilevanti, secret, interi record che non servono all'interpretazione.

### Come viene marcato

```text
source
ownership
observedAt
freshness
classification
```

### Come si gestiscono conflitti

Il modello non deve arbitrare silenziosamente due fonti che dicono cose incompatibili.

L'output può dichiarare:

```text
conflictingEvidence
```

## Freshness è parte della semantica

Una source reference senza tempo può essere pericolosa.

Supponiamo che il modello riceva:

```text
Payment attempt failed
```

ma dieci secondi dopo avvenga un retry riuscito.

L'assistant può ancora generare una spiegazione grammaticalmente corretta ma operativamente stale.

Dobbiamo quindi distinguere almeno:

```text
source event time
retrieval time
answer generation time
```

E definire quale freshness è accettabile per il journey.

Questo collega direttamente AI architecture a consistency e observability.

## Authorization before retrieval

Non vogliamo:

```text
retrieve everything
→ ask model not to reveal forbidden data
```

Vogliamo:

```text
authorize
→ retrieve only allowed context
→ minimize
→ model
```

La sicurezza non può dipendere dalla promessa del modello di ignorare dati che non avrebbe dovuto ricevere.

> **Il modo più affidabile per impedire al modello di rivelare un dato è non consegnargli quel dato quando non serve.**

## Prompt injection indiretta

Quando il contesto include testo esterno, i dati possono contenere istruzioni malevole.

Microsoft evidenzia che i RAG prompt possono essere vulnerabili a indirect prompt injection e raccomanda di trattare il retrieved context come dati, separandolo dalle istruzioni e applicando controlli sui contenuti.  
Fonte: [Microsoft Learn — RAG prompt engineering](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/rag/rag-prompt-engineering).

OWASP include fra i rischi prompt injection diretta, indiretta, RAG poisoning, data exfiltration e agent-specific attacks, raccomandando least privilege, separazione fra instruction e data, validation e monitoring.  
Fonte: [OWASP — LLM Prompt Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html).

Quindi un eventuale futuro runbook recuperato non deve essere trattato come system instruction.

```text
SYSTEM INSTRUCTION
≠
RETRIEVED DOCUMENT
```

## Citation non significa automaticamente groundedness

Un modello può citare una fonte reale ma attribuirle una conclusione che la fonte non sostiene.

Per questo le eval devono controllare almeno:

```text
source exists
source is authorized
source supports claim
important claim has source
missing evidence is disclosed
```

La semplice presenza di `[1] [2] [3]` non basta.

## Il context pipeline di ESI

Prima versione:

```text
Operator
→ authorization
→ OperationalCase lookup
→ Orders support view
→ Payments support view
→ Shipping support view
→ deterministic normalization
→ CaseExplanationContext
→ model
```

Nessun corpus globale.

Nessuna semantic search per moda.

Nessuna copia di authority dentro una knowledge base AI.

Il capitolo non dice che RAG sia cattivo.

Dice qualcosa di più utile:

> **Grounding è un requisito. RAG è una possibile soluzione. Retrieval è una decisione architetturale come tutte le altre.**