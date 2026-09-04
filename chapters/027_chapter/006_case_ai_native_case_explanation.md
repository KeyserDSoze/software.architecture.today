# Caso 3 — Case Explanation Assistant

Il terzo caso introduce un tipo di incertezza diverso.

Campaign Launchpad è un piccolo greenfield. La Priority migration è un brownfield che deve ricostruire significato storico. Il **Case Explanation Assistant** inserisce invece una dependency probabilistica nel runtime di Order Operations.

La domanda non è soltanto se il modello riesce a produrre una risposta utile. È:

> **Che cosa significa “funziona” quando lo stesso input può produrre output diversi e una risposta può sembrare credibile anche quando supera l’evidence disponibile?**

## L’outcome richiede prima di tutto un authority boundary

Gli operatori spendono troppo tempo a ricostruire un caso attraversando dati e segnali di più domini.

L’outcome è ridurre quel costo cognitivo senza creare una nuova source of truth.

Da qui deriva la prima decisione:

```text
model interpretation
≠
business truth
```

Orders continua a possedere Order facts, Payments & Risk la truth economica, Shipping i propri fatti e Order Operations il case context. Il modello può sintetizzare e formulare hypothesis; non acquisisce authority sul dominio perché scrive l’ultima frase mostrata all’operatore.

Questa decisione limita già una grande parte del blast radius.

## Il grounding nasce dalle source note, non dalla moda RAG

Per il singolo Operational Case le source principali sono già strutturate e conosciute. ESI può quindi costruire deterministicamente il context dopo authorization:

```text
authorized request
→ Operational Case + Orders + Payments + Shipping facts
→ normalized context
→ model
```

Non c’è ancora un problema di ricerca su un vasto corpus. Per questo il primo slice non introduce vector database o semantic retrieval.

Paghiamo un limite — niente broad enterprise knowledge — in cambio di minore retrieval uncertainty, poisoning surface, infrastructure e cost.

> **Grounding è il requisito. RAG è una possibile soluzione quando il problema di retrieval la giustifica.**

## Il contract separa ciò che sappiamo da ciò che ipotizziamo

Il model boundary non restituisce soltanto una stringa libera. `CaseExplanationResult` separa `confirmedFacts`, `hypotheses`, `missingEvidence` e `sourceReferences`, con stati come `Supported`, `PartiallySupported`, `InsufficientEvidence` e `Unavailable`.

`InsufficientEvidence` non è un errore di UX da nascondere. È il comportamento corretto quando il sistema non possiede abbastanza source autorizzate per sostenere una spiegazione.

Il codice può inoltre verificare deterministicamente alcune property: una source reference deve esistere nel context, confirmed fact e hypothesis devono indicare provenance, e uno stato parziale deve rendere visibile ciò che manca.

Questi controlli non dimostrano groundedness semantica. Dimostrano esattamente ciò che possono dimostrare e niente di più.

## Prompt injection cambia importanza quando cambiano i sink

Un customer note o un testo recuperato può contenere istruzioni malevole. Separare instruction e data è necessario, ma ESI non affida tutta la sicurezza al prompt.

La mitigation più forte del primo slice è togliere potere al modello:

```text
no refund()
no retryPayment()
no sendEmail()
no secret access
no arbitrary URL fetch
```

OWASP raccomanda defense-in-depth, least privilege, separazione fra instruction e data, output validation e human control per azioni sensibili.

Fonte:

- [OWASP — LLM Prompt Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html)

Quindi una manipulation riuscita può ancora produrre una spiegazione sbagliata, ma non può trasformarsi direttamente in un economic side effect.

## Il provider viene dopo il workload contract

ESI possiede già `evals/case-explanation-v1.jsonl` con nominal, missing/conflicting evidence, prompt injection, cross-tenant, authority-boundary e ambiguity case.

La scelta del provider/model rimane Pending. `OO-002` richiede di confrontare candidati contro lo stesso oracle, invece di modificare dataset o scorer per favorire il candidato preferito.

La quality surface non è una sola accuracy. Include groundedness, source attribution, missing-evidence honesty, authority compliance, operator usefulness, prompt-injection behavior, latency, fallback e cost.

Il provider è quindi una two-way door da testare sul workload reale, non un’identity decision del prodotto.

## Il launch boundary protegge il core dalla maturity dell’AI

La Production Readiness Review mantiene:

```text
LB-AI
= NOT READY / DISABLED FOR CORE LAUNCH
```

Questo è possibile perché l’assistant non è authority e non vive nel critical path del core Operational Case view.

Un eventuale `LB-CORE` potrà progredire lasciando l’AI disabilitata, mentre `OO-002` e i runtime gate costruiscono evidence sulla capability probabilistica.

> **Una feature disabilitabile è una forma di risk isolation quando il prodotto deterministico resta utile senza di lei.**

## Uber mostra perché l’evaluation è un sistema, non una demo

Uber ha documentato Genie, un copilot interno per supportare engineer attraverso knowledge source aziendali, e una successiva evoluzione in cui un golden set curato da subject matter expert veniva usato per valutare miglioramenti prima di ampliare il rollout.

Fonti:

- [Uber Engineering — Genie: Uber’s Gen AI On-Call Copilot](https://www.uber.com/gb/en/blog/genie-ubers-gen-ai-on-call-copilot/)
- [Uber Engineering — Enhanced Agentic-RAG](https://www.uber.com/us/en/blog/enhanced-agentic-rag/)

I miglioramenti numerici riportati da Uber appartengono al loro workload e non diventano target ESI. La property trasferibile è che un sistema AI può richiedere una pipeline di evaluation, human-labeled baseline e iterazione prima che la qualità sia sufficiente per un rollout più ampio.

## Il trade-off ESI

ESI compra un blast radius più piccolo scegliendo un assistant read-only, bounded deterministic context, provider-neutral port, structured source-backed output, explicit fallback e versioned eval.

Paga meno automation, nessuna autonomous remediation, nessun broad-corpus search e più risposte `InsufficientEvidence`.

Il quality floor rimane: nessun business-authority transfer, nessun cross-tenant leakage, nessun unsupported claim nascosto e core usable senza model provider.

> **Con l’AI la domanda architetturale più importante non è quanto sia intelligente il modello. È quale parte del sistema resta corretta quando il modello è lento, sbaglia, viene manipolato o cambia comportamento.**

Se non sappiamo rispondere, l’AI è collegata al prodotto; non è ancora davvero integrata nell’architettura.