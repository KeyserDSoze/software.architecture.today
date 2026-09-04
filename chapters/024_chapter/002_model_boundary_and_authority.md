# 24.2 — Il model boundary: dove finisce l'interpretazione e ricomincia il sistema

Quando introduciamo un modello generativo dentro un prodotto, la prima decisione non è quale SDK usare.

È dove tracciare il **model boundary**.

Il boundary deve rispondere a una domanda semplice:

> Quali informazioni può ricevere il modello, quali conclusioni può proporre e quali decisioni restano fuori dal suo potere?

## Quattro livelli diversi

È utile distinguere almeno quattro cose:

```text
Fact
→ dato autorevole del sistema

Derived Fact
→ dato calcolato deterministicamente da fact autorevoli

Model Interpretation
→ interpretazione probabilistica proposta dal modello

Authorized Action
→ side effect consentito da policy e sistema
```

Queste categorie non sono intercambiabili.

Per Order Operations:

```text
PaymentEscalation.requestedAt
= Fact

elapsedMinutes
= Derived Fact

"Il caso sembra bloccato da un retry payment fallito"
= Model Interpretation

retry payment
= Authorized Action solo se un workflow separato lo consente
```

Il modello può essere molto bravo a inferire la terza riga.

Non per questo ottiene la quarta.

## Non trasformare linguaggio naturale in autorità

Un rischio insidioso delle interfacce generative è che il testo convincente sembri più autorevole della fonte che lo ha prodotto.

Un output come:

> “Il pagamento è definitivamente fallito.”

può essere semanticamente molto più forte di ciò che i dati supportano.

Magari la fonte dice soltanto:

```text
lastPaymentAttempt = Failed
retryState = Pending
```

La risposta fluentemente formulata ha quindi creato una conclusione non autorizzata.

Per questo il Case Explanation Assistant separerà nel proprio output:

```text
confirmedFacts
hypotheses
missingEvidence
sourceReferences
```

Non useremo un unico campo `summary` come contenitore indistinto di verità, inferenze e omissioni.

## Deterministic system before probabilistic interpretation

Molte decisioni non hanno bisogno di un LLM.

Se possiamo calcolare deterministicamente:

```text
case age
retry count
priority
current owner
known integration state
```

lo facciamo fuori dal modello.

Non chiediamo:

> “Secondo te da quanto tempo è aperto il caso?”

quando abbiamo `openedAt` e un clock.

Non chiediamo:

> “È Urgent?”

quando `ConfirmedPriorityPolicy` possiede già la regola.

Il modello riceve il risultato, non il diritto di reinterpretare la policy.

Questa regola riduce:

- variabilità inutile;
- token;
- latency;
- surface di errore;
- difficoltà di evaluation.

> **Usa il modello per ciò che richiede interpretazione. Non per sostituire logica che sappiamo già rendere deterministica.**

## Structured output non significa semantic correctness

Output strutturato è utile perché riduce una classe di failure:

```text
expected schema
≠
free-form response
```

OpenAI documenta Structured Outputs come meccanismo per vincolare l'output a uno JSON Schema. Questo migliora la conformità strutturale, ma non rende automaticamente corretti i valori contenuti nei campi.  
Fonte: [OpenAI — Introducing Structured Outputs in the API](https://openai.com/index/introducing-structured-outputs-in-the-api/).

Quindi:

```text
valid JSON
≠
grounded claim
```

E:

```text
valid enum value
≠
authorized business decision
```

Un modello può restituire perfettamente:

```json
{
  "confidence": "high",
  "assessment": "payment permanently failed"
}
```

pur essendo semanticamente sbagliato.

Schema validation è un guardrail, non un oracolo.

## Il confidence score non salva una cattiva architettura

Molte feature AI aggiungono un numero:

```text
confidence = 0.92
```

come se questo rendesse automaticamente la risposta governabile.

Ma dobbiamo chiederci:

- che cosa misura quel numero?
- è calibrato sul nostro workload?
- è stabile fra versioni?
- distingue missing context da ambiguità?
- quale threshold cambia una decisione?

Per il primo slice ESI non useremo un confidence score del modello come authorization mechanism.

Meglio un output semanticamente più esplicito:

```text
Supported
PartiallySupported
InsufficientEvidence
```

basato su presence e provenance delle source richieste, con eval dedicate.

## Il model boundary come Anti-Corruption Layer

Il modello è anche una dipendenza esterna con un proprio vocabolario, API e failure mode.

Come abbiamo fatto con il legacy, possiamo introdurre un boundary che impedisca al resto del dominio di parlare direttamente in termini vendor-specific.

Per esempio:

```text
CaseExplanationPort

input:
CaseExplanationContext

output:
CaseExplanationResult
```

mentre adapter diversi potranno usare:

```text
provider A
provider B
local model
future model gateway
```

Il core non dovrebbe conoscere direttamente:

- deployment name;
- provider-specific finish reason;
- token accounting schema;
- SDK-specific exception;
- tool call representation.

Questi dettagli appartengono all'adapter.

## Model portability: non esageriamo

Nascondere il provider dietro una porta non rende i modelli perfettamente sostituibili.

Prompt behavior, context window, latency, safety behavior, tool semantics, structured-output capability e pricing possono differire.

Quindi la porta riduce **code coupling**.

Non elimina **behavioral coupling**.

La migrazione fra modelli richiede eval.

> **Un'interfaccia rende sostituibile il codice. Solo l'evidence rende sostituibile il comportamento.**

## Il boundary ESI

Per Case Explanation Assistant:

```text
Allowed input
- authorized OperationalCase facts
- authorized Orders/Payments/Shipping support view
- deterministic derived facts
- selected runbook snippets, se introdotti in futuro

Forbidden input by default
- unrelated tenant data
- production secret
- raw credential
- unrestricted database access
- entire enterprise corpus
```

Output:

```text
caseSummary
confirmedFacts[]
hypotheses[]
missingEvidence[]
sourceReferences[]
```

Forbidden output semantics:

```text
new PaymentStatus
new Priority
refund approval
authorization decision
customer commitment
```

## La regola

Quando un LLM entra nel sistema, non chiediamo soltanto:

> Che cosa sa fare?

Chiediamo:

> **Quale parte del suo output siamo disposti a trattare come interpretazione, quale parte possiamo verificare deterministicamente e quale parte non gli permetteremo di decidere?**

Il model boundary è la risposta architetturale a questa domanda.