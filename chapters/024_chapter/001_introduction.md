# Capitolo 24 — AI dentro l'architettura

Finora abbiamo usato l'AI per comprendere repository, preparare task, generare modifiche, verificare evidence e orchestrare execution.

Adesso cambiamo lato del confine.

L'AI entra **dentro il prodotto**.

Questa differenza è più grande di quanto sembri.

Quando un agente di sviluppo sbaglia una proposta, possiamo rifiutare il diff.

Quando una capability AI runtime sbaglia davanti a un utente, quella risposta è già diventata comportamento del sistema.

Per questo una feature generativa non è semplicemente:

```text
application
→ model API
→ text
```

È almeno:

```text
user intent
→ authorization
→ context construction
→ model boundary
→ output validation
→ product policy
→ evidence / telemetry
→ fallback
```

E, se il modello può usare tool o produrre side effect:

```text
+ tool permission
+ action validation
+ confirmation / human gate
+ idempotency
+ audit
+ recovery
```

La domanda architetturale quindi non è:

> Quale modello usiamo?

È:

> **Quale responsabilità stiamo affidando a un componente probabilistico, con quali fonti, quali limiti e quale fallback quando la sua risposta non è abbastanza affidabile?**

## Il modello non diventa automaticamente una source of truth

Order Operations possiede già business rule, API contract, Data Ownership Map, Threat Model, Reliability Contract e Testing Strategy.

Aggiungere un modello non annulla nessuno di questi confini.

Se Payments & Risk possiede la semantica economica, un LLM non acquisisce improvvisamente il diritto di dichiarare:

```text
paymentStatus = Refunded
```

solo perché riesce a scrivere una frase convincente.

Allo stesso modo, una spiegazione generata non sostituisce:

- lo stato autorevole del caso;
- le policy di Priority;
- l'authorization server-side;
- gli audit event;
- le decisioni di remediation.

La prima regola del capitolo è quindi:

> **Il modello può proporre un'interpretazione. Il sistema deve ancora decidere che cosa è vero e che cosa è autorizzato.**

## Il nuovo scenario ESI

Gli operatori di Commerce & Operations oggi possono vedere un Operational Case e attraversare manualmente informazioni provenienti da Order Operations, Orders, Payments e Shipping.

Il problema non è che manchino completamente i dati.

Il problema è il costo cognitivo di ricostruire rapidamente:

- che cosa è successo;
- quali fatti sono confermati;
- quali segnali sono ancora incompleti;
- quali dipendenze stanno fallendo;
- quale procedura operativa è pertinente.

Product propone quindi una feature:

> **Case Explanation Assistant**

Obiettivo:

```text
operatore apre un caso
→ assistant sintetizza i fatti autorizzati
→ cita le evidence usate
→ segnala ciò che non può determinare
```

Non obiettivo:

```text
refund autonomo
retry autonomo
change Priority autonomo
PaymentStatus inference autorevole
customer communication autonoma
```

Per il primo slice l'AI è **read-only e advisory**.

Questa scelta non deriva da paura della tecnologia.

Deriva dal rapporto fra valore e blast radius.

## Il compromesso ESI

### Esigenza

Operations vuole ridurre il tempo speso per ricostruire manualmente casi complessi.

### Tensione

Product vuole un assistant utile e naturale.

Payments & Risk vuole impedire che una spiegazione diventi implicitamente una decisione economica.

Security vuole evitare che input e contenuti recuperati allarghino accesso o tool permission.

Platform vuole un integration boundary governabile invece di SDK/model coupling diffuso.

Finance vuole capire costo per spiegazione utile, non soltanto costo per token.

### Decisione

Prima capability AI runtime:

```text
Case Explanation Assistant
read-only
bounded structured context
source references required
structured output
no write tools
no production side effect
explicit insufficient-evidence fallback
```

### Costo accettato

L'assistant sarà meno autonomo e, in alcuni casi, risponderà:

```text
InsufficientEvidence
```

invece di produrre comunque una spiegazione fluida.

### Quality floor

Non compromettiamo:

- data ownership;
- authorization;
- tenant isolation;
- separation between fact and hypothesis;
- human authority sui side effect;
- source provenance;
- fallback leggibile;
- auditabilità della feature.

## AI Architecture è ancora Software Architecture

Gli stessi principi del resto del libro restano validi.

### Fit before fashion

Non usiamo RAG perché “le app AI usano RAG”.

Non usiamo un agent loop perché “gli agenti sono il futuro”.

Non usiamo il modello più grande perché è il più impressionante.

### Quality before technology

Prima definiamo:

```text
accuracy / groundedness expectation
latency budget
availability behavior
privacy boundary
cost boundary
fallback
human escalation
```

Poi scegliamo model/provider/retrieval architecture.

### Failure before confidence

Dobbiamo progettare anche:

```text
hallucination
missing context
stale context
prompt injection
malicious document
model timeout
provider outage
schema-invalid output
overconfident explanation
model/version drift
cost explosion
```

### Evidence before declaration

Una demo dove il modello risponde bene a cinque casi non equivale a production readiness.

Servono eval, security test, runtime signal e revisioni nel tempo.

Microsoft Azure Architecture Center tratta RAG e context engineering come discipline che governano quali dati, tool output e istruzioni arrivano al modello; sottolinea inoltre che l'output end-to-end deve essere valutato rispetto a groundedness, relevance, completeness e correctness.  
Fonte: [Microsoft Learn — AI technology overview](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/ai-overview), [Microsoft Learn — RAG prompt engineering](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/rag/rag-prompt-engineering).

NIST AI RMF Generative AI Profile tratta i sistemi generativi come sistemi da governare lungo l'intero lifecycle, con rischio e trustworthiness legati al contesto d'uso, non al solo modello.  
Fonte: [NIST AI 600-1 — Generative AI Profile](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence).

## La promessa del capitolo

Alla fine non avremo soltanto “chiamato un LLM”.

Avremo costruito un modello di decisione per:

- determinare dove il modello può influenzare il prodotto;
- separare facts, retrieved context e generated interpretation;
- progettare grounding e context boundary;
- progettare tool e permission;
- validare output strutturati;
- valutare qualità e sicurezza;
- gestire drift, fallback, latency e cost;
- inserire AI-specific failure mode negli artifact già esistenti.

E Order Operations avrà un nuovo artefatto:

> **AI Feature Contract**

perché, quando una capability probabilistica entra nel runtime, anche la sua libertà deve diventare architettura.