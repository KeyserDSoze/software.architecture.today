# 24.3 — Grounding e context engineering: prima l'evidence, poi il retrieval

Una capability generativa enterprise raramente può rispondere bene affidandosi soltanto alla conoscenza incorporata nel modello.

Il modello non conosce automaticamente lo stato corrente di Order Operations, il tenant dell'operatore, l'ultima Payment Escalation, un retry appena riuscito o una policy aggiornata ieri.

Ha bisogno di **evidence del sistema corrente**.

Ma il problema non è massimizzare il context window. È costruire il contesto minimo che rappresenti bene la domanda, rispetti authorization e conservi provenance e freshness.

> **Più contesto non significa più verità. Significa più materiale che il sistema deve autorizzare, selezionare, interpretare, pagare e valutare.**

## Grounding è una relazione fra risposta e source controllate

Nel capitolo usiamo *grounding* per descrivere la disciplina con cui la generazione viene collegata a evidence del nostro sistema.

La pipeline concettuale è:

```text
user question
→ authorization
→ source acquisition
→ normalization / minimization
→ model
→ generated claims
→ source-reference validation
```

La qualità finale dipende quindi almeno da due sistemi: la pipeline che costruisce il context e la pipeline che genera l'output.

Un modello eccellente con source stale o sbagliate può produrre una spiegazione elegantemente errata. Un modello più modesto con context preciso e boundary chiaro può essere molto più utile sul workload specifico.

Questo cambia il luogo in cui cerchiamo il failure. Non chiediamo soltanto “il modello ha allucinato?”. Chiediamo anche se abbiamo recuperato la source corretta, se era abbastanza fresca, se l'utente poteva vederla e se la claim finale era realmente supportata.

## RAG risolve una classe di retrieval problem

Retrieval-Augmented Generation è una strategia utile quando dobbiamo selezionare evidence rilevante dentro un corpus più ampio.

Microsoft Azure Architecture Center descrive RAG come un pattern in cui un retrieval system fornisce grounding data al modello e non lo lega a una specifica tecnologia di vector search.

Fonte:

- [Microsoft Learn — AI technology overview](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/ai-overview)

Questa distinzione evita l'equazione:

```text
RAG
= embeddings
+ vector database
```

Il retrieval potrebbe essere una query relazionale, un'API, keyword search, graph traversal, vector similarity o una combinazione ibrida. La tecnologia dipende dalla forma della conoscenza e dalla domanda che dobbiamo risolvere.

> **Grounding è il requisito. Retrieval è il meccanismo. RAG è una famiglia di soluzioni, non il punto di partenza.**

## Per il primo use case ESI conosce già le source

Case Explanation Assistant deve spiegare un singolo `OperationalCase`.

Le source primarie sono già note:

```text
Order Operations
Orders
Payments
Shipping
```

Il sistema possiede contract e authorization path per raggiungerle. Possiamo quindi costruire deterministicamente un `CaseExplanationContext` senza chiedere a un retriever probabilistico di decidere quali documenti siano rilevanti.

Introdurre oggi embedding model, vector index, chunking, re-indexing, retrieval tuning e ACL propagation aggiungerebbe ownership e failure mode che il problema non ha ancora giustificato.

La scelta ESI v1 è perciò:

```text
known case
→ known authorized sources
→ deterministic context assembly
```

Non perché vector search sia una cattiva tecnologia. Perché non compra una proprietà che ci manca in questo slice.

> **Non introdurre retrieval probabilistico quando sai già deterministicamente quali source devi interrogare.**

## Quando la forza cambierà, potrà cambiare anche il retrieval

Il trigger arriverà se il prodotto dovrà usare un corpus che non possiamo indirizzare direttamente: migliaia di runbook, knowledge article, incident history, procedure support o cross-case knowledge.

A quel punto il problema diventerà selezionare informazione rilevante da una superficie ampia e dovremo progettare corpus, metadata, ACL, freshness, chunking, ranking, citation, re-indexing e retention.

La decisione non sarà “aggiungiamo un vector database”. Sarà:

> **quale retrieval conserva meglio relevance, authorization, freshness e provenance per questo corpus e questo journey?**

Questa è ancora *fit before fashion*.

## Context engineering comprende più del retrieval

Microsoft usa *context engineering* in un senso più ampio: oltre ai documenti recuperati comprende instruction, conversation history, tool output ed enterprise data forniti al modello.

Fonte:

- [Microsoft Learn — AI technology overview](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/ai-overview)

Per ESI questo significa progettare il `CaseExplanationContext` come un vero input contract.

Ogni source materiale deve conservare almeno identity/provenance e `observedAt`. Il context builder deve minimizzare i campi, distinguere derived fact da testo libero e mantenere riconoscibili eventuali conflitti invece di appiattirli in una sola narrativa.

Se due source autorizzate non concordano, il modello non riceve implicitamente il ruolo di arbitro. L'output deve poter mantenere visibile la contradiction o dichiarare evidence insufficiente.

La preparazione del contesto è quindi già parte della semantica del prodotto.

## Freshness non è metadata decorativo

Supponiamo che il context builder osservi un payment attempt fallito. Dieci secondi dopo un retry riesce. La spiegazione generata può essere perfettamente grounded rispetto alla fotografia precedente e contemporaneamente essere operativamente stale.

Per questo distinguiamo:

```text
source observed time
context acquisition time
answer generation time
```

La domanda non è soltanto “la fonte esiste?”. È “quanto a lungo questa evidence resta adeguata alla claim che mostriamo all'operatore?”.

Se la feature diventerà più importante nel journey, dovremo definire un freshness contract esplicito. Per ora la metadata è già necessaria perché il sistema possa rendere visibile la temporalità invece di presentare ogni fact come eternamente corrente.

## Authorization viene prima della retrieval surface

Un anti-pattern pericoloso è:

```text
retrieve broad corpus
→ send everything to model
→ instruct model not to reveal forbidden data
```

Il modello non è il nostro authorization server.

La direzione ESI è:

```text
operator identity
→ tenant/resource authorization
→ retrieve only allowed sources
→ minimize
→ model
```

Il modo più robusto per impedire al modello di rivelare un dato che l'utente non può vedere è **non consegnarglielo**.

Questa decisione riduce anche cost e prompt-injection surface.

## Retrieved text resta data, non instruction

Quando entreranno note utente, runbook o documenti esterni, il context potrà contenere frasi imperative controllate da terzi.

Microsoft evidenzia il rischio di indirect prompt injection nelle pipeline RAG; OWASP raccomanda least privilege, separazione fra instruction e data, validation e monitoring.

Fonti:

- [Microsoft Learn — RAG prompt engineering](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/rag/rag-prompt-engineering)
- [OWASP — LLM Prompt Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html)

Una frase dentro un runbook recuperato non diventa system policy perché il retriever l'ha trovata.

```text
trusted instruction
≠
retrieved document
≠
user-controlled text
```

Il context builder deve preservare questa distinzione e i tool/permission devono essere progettati assumendo che il modello possa comunque essere manipolato.

## Una citation non dimostra da sola groundedness

È possibile citare una source reale e attribuirle una conclusione che non sostiene.

Quindi la validation deterministica può controllare che il reference esista e appartenga al context autorizzato, ma le eval devono verificare anche la relazione fra claim e source.

La chain che ci interessa è:

```text
source exists
+ source authorized
+ source sufficiently fresh
+ source supports claim
+ material claim exposes provenance
```

Solo la prima parte è facilmente deterministica nel nostro primo implementation slice.

## La baseline ESI

Il primo context path resta volutamente stretto:

```text
Operator
→ authorization
→ OperationalCase
→ Orders support view
→ Payments support view
→ Shipping support view
→ deterministic derived facts
→ normalized CaseExplanationContext
→ model boundary
```

Nessun corpus globale, nessuna semantic search aggiunta per inerzia e nessuna copia di authoritative business truth in una knowledge base AI separata.

Questo non chiude la porta a RAG. Mantiene la decisione reversibile finché il workload non dimostra di averne bisogno.

> **La qualità del grounding comincia prima del modello: da quali source scegliamo, da chi può vederle, da quanto sono fresche e da quanto chiaramente conserviamo la loro provenance.**