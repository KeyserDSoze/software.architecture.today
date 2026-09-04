# 6. Caso 3 — Case Explanation Assistant

Il terzo caso è diverso da entrambi i precedenti.

Campaign Launchpad è un prodotto piccolo costruito quasi da zero.

La Priority migration è un brownfield dove la difficoltà principale è preservare e riclassificare conoscenza storica.

Il **Case Explanation Assistant** introduce invece una dipendenza non deterministica dentro il runtime del prodotto.

Qui la domanda non è soltanto:

> Funziona?

È anche:

> **Che cosa significa “funziona” quando lo stesso input può produrre output diversi e il modello può sembrare convincente anche quando sbaglia?**

## Il problema funzionale

Gli operatori di Order Operations devono ricostruire un caso leggendo dati e segnali provenienti da più domini.

L'outcome target non è:

```text
add chatbot
```

È:

> **ridurre il costo cognitivo dell'investigazione mantenendo business authority, access control e source provenance fuori dal modello.**

Quindi la capability iniziale è deliberatamente read-only.

## Authority boundary

Prima decisione:

```text
model interpretation
≠
business truth
```

Ownership:

```text
Orders
→ Order facts

Payments & Risk
→ Payment facts / economic effects

Shipping
→ Shipping facts

Order Operations
→ Operational Case context

Case Explanation model
→ advisory interpretation only
```

Il modello non può diventare una nuova source of truth perché produce testo utile.

## Context assembly

La seconda decisione importante riguarda il grounding.

Per il primo slice non abbiamo scelto un vector database.

Non abbiamo scelto RAG.

Il contesto necessario al singolo case è già bounded e strutturato.

Quindi:

```text
authorized request
→ deterministic case context assembly
→ model
```

Source candidate:

```text
OperationalCase
Order facts
Payment facts
Shipping facts
known derived operational facts
```

Questa scelta riduce:

```text
retrieval uncertainty
poisoning surface
cost
infrastructure
observability complexity
```

ma accetta un limite:

```text
no broad enterprise knowledge corpus yet
```

> **Grounding è un requisito. RAG è una possibile soluzione.**

## Output contract

Il modello non restituisce una stringa libera come unica API semantica.

Il contract separa:

```text
confirmedFacts
hypotheses
missingEvidence
sourceReferences
```

Stati:

```text
Supported
PartiallySupported
InsufficientEvidence
Unavailable
```

Perché `InsufficientEvidence` è un risultato utile.

È migliore di una spiegazione elegante inventata.

## Deterministic guardrail

Alcune proprietà non richiedono un altro modello.

Il codice può controllare:

```text
source reference exists
confirmed fact references known source
hypothesis references known source
missing evidence declared when required
output schema valid
```

Questo non dimostra che il contenuto sia vero.

Ma impedisce alcune classi di failure in modo più affidabile e più economico.

> **Usa il modello per l'interpretazione. Usa codice deterministico per i vincoli che sai già esprimere deterministicamente.**

## Prompt injection

Una note o un testo proveniente da un sistema esterno può contenere istruzioni malevole.

Perciò distinguiamo:

```text
instruction
≠
retrieved/user-controlled data
```

Ma non affidiamo la sicurezza soltanto al prompt.

La prima mitigation più forte è architetturale:

```text
no write tools
no refund()
no sendEmail()
no readSecret()
no arbitrary URL fetch
```

Quindi anche se il modello interpreta male una source, il suo potere resta limitato.

OWASP raccomanda defense-in-depth, least privilege, separazione instruction/data, output validation e human control per azioni sensibili:

- https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html

## Eval prima del provider

ESI ha già un seed versionato:

```text
evals/case-explanation-v1.jsonl
```

con scenari:

```text
nominal
missing evidence
conflicting evidence
prompt injection
cross-tenant
authority violation
ambiguity
```

La decisione del provider/model resta:

```text
Pending
```

perché il provider deve essere confrontato **contro il workload**, non scelto da benchmark generico o reputazione.

Il work item:

```text
OO-002
```

richiede di usare lo stesso eval oracle per i candidati.

Niente:

```text
candidate A fails
→ modify eval
→ candidate A passes
```

Questo sarebbe `oracle laundering`.

## Quality model

La feature richiede più dimensioni contemporaneamente.

Quality:

```text
groundedness
source attribution
missing-evidence behavior
authority compliance
operator usefulness
```

Security:

```text
cross-tenant isolation
prompt injection
provider data boundary
no write capability
```

Operational:

```text
latency
availability
fallback
telemetry
model/provider drift
```

Cost:

```text
cost per explanation
cost per useful/accepted explanation
retry/rework cost
```

Un singolo accuracy score non è quindi un production contract sufficiente.

## Production decision

La Production Readiness Review corrente è esplicita:

```text
LB-AI
= NOT READY / DISABLED FOR CORE LAUNCH
```

Questo non significa che il core Order Operations debba restare bloccato per sempre.

È proprio il vantaggio di aver separato il launch boundary.

Possiamo eventualmente lanciare:

```text
LB-CORE
```

con l'AI disabilitata.

Quando `OO-002` e i runtime gate producono evidence sufficiente, riapriamo `LB-AI`.

> **Una feature disabilitabile è spesso una migliore strategia di rischio di una feature non pronta che il launch plan ci obbliga ad accendere.**

## Caso reale Uber

Uber ha documentato **Genie**, un copilot interno per supportare on-call engineer e utenti interni attraverso knowledge source aziendali:

- https://www.uber.com/gb/en/blog/genie-ubers-gen-ai-on-call-copilot/

In seguito Uber ha descritto un lavoro di miglioramento basato su un golden set di oltre cento query curate da SME prima di un rollout più ampio nel dominio engineering security/privacy. Il post riporta miglioramenti relativi del 27% nelle risposte accettabili e una riduzione relativa del 60% dei consigli errati nel contesto misurato da Uber:

- https://www.uber.com/us/en/blog/enhanced-agentic-rag/

Questi numeri restano risultati Uber.

Non diventano target ESI.

La lezione utile è un'altra:

> **un sistema AI può richiedere una vera pipeline di evaluation e miglioramento prima che la sua utilità percepita sia sufficiente per un rollout più ampio.**

## Il compromesso ESI

Product vuole massima utilità.

Operations vuole velocità.

Security vuole limitare context e potere.

Payments & Risk vuole preservare semantic authority.

Platform vuole evitare un nuovo AI platform layer senza scala sufficiente.

Finance vuole capire il costo per outcome.

Decisione:

```text
read-only assistant
+ bounded deterministic context
+ provider-neutral port
+ structured source-backed output
+ versioned eval
+ explicit fallback
+ no RAG requirement yet
+ no write tools
```

Costo accettato:

```text
less automation
more InsufficientEvidence
no autonomous remediation
no broad corpus search
```

Quality floor:

```text
no business-authority transfer
no cross-tenant leakage
no silent unsupported claim
core usable without model
```

## La lezione del terzo caso

Con l'AI, la domanda architetturale più importante non è:

> Quanto è intelligente il modello?

È:

> **Quale parte del sistema resta corretta quando il modello è lento, sbaglia, viene manipolato o cambia comportamento?**

Se non sappiamo rispondere, l'AI non è ancora integrata nell'architettura.

È soltanto collegata al prodotto.