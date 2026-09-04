# 24.2 — Il model boundary: interpretazione senza authority implicita

Quando introduciamo un modello generativo dentro un prodotto, la prima decisione non riguarda SDK, deployment o prompt.

Riguarda **dove finisce l'interpretazione del modello e dove ricomincia l'autorità del sistema**.

Se questo confine resta ambiguo, tutto ciò che viene dopo diventa fragile. Un output molto fluido può essere trattato come fatto, un confidence score può diventare autorizzazione implicita e una prediction può finire per sostituire una business rule che avevamo già reso deterministica.

Il model boundary deve quindi rispondere a tre domande:

> quali informazioni può ricevere il modello, quali conclusioni può proporre e quali decisioni restano fuori dal suo potere?

## Quattro nature diverse dell'informazione

Per non mischiare semantiche differenti usiamo una classificazione semplice:

| Categoria | Significato | Esempio ESI |
|---|---|---|
| Fact | dato autorevole proveniente dal sistema che lo possiede | `PaymentEscalation.requestedAt` |
| Derived Fact | risultato deterministico calcolato da fact autorevoli | elapsed time del caso |
| Model Interpretation | lettura probabilistica che mette in relazione evidence | “il caso potrebbe essere in attesa di un retry” |
| Authorized Action | side effect consentito da policy e authority | eseguire realmente un retry payment |

Il modello può essere molto utile nella terza riga. Questo non gli consegna automaticamente la quarta.

La distinzione serve anche all'interfaccia. Se mostriamo un'ipotesi con lo stesso trattamento visivo e semantico di un fact, abbiamo già indebolito il boundary prima ancora di parlare di tool.

> **La capacità di descrivere una decisione non equivale al diritto di prenderla.**

## Il linguaggio naturale può amplificare una conclusione oltre le source

Supponiamo che il contesto contenga:

```text
lastPaymentAttempt = Failed
retryState = Pending
```

Una frase generata come:

> “Il pagamento è definitivamente fallito.”

sembra innocua, ma introduce una semantica più forte di quella supportata dalle source. La fluidità ha cancellato una condizione ancora aperta.

Per questo Case Explanation Assistant non restituisce un unico `summary` indistinto come fonte di verità. Il contratto separa:

```text
confirmedFacts[]
hypotheses[]
missingEvidence[]
sourceReferences[]
```

Il `summary` può rendere la risposta leggibile, ma non è il luogo in cui creare authority. Ogni fact materiale deve poter essere ricondotto a source conosciute; ogni ipotesi deve restare riconoscibile come interpretazione; ciò che manca deve rimanere visibile.

Questa struttura non elimina gli errori del modello. Rende però più facile per il prodotto **rifiutare o rappresentare correttamente classi diverse di output**.

## Deterministic logic resta fuori dal modello quando possiamo possederla bene

Molte domande che sembrano adatte a un LLM non hanno alcun bisogno di probabilità.

Case age, retry count, current owner, tenant authorization e Priority già confermata possono essere ottenuti in modo deterministico. Chiedere al modello di ricalcolarli aggiungerebbe variabilità, token, latency e una nuova surface di evaluation senza comprare valore.

Quindi il context builder fornisce al modello il risultato della logica deterministica, non la possibilità di reinterpretarla.

```text
ConfirmedPriorityPolicy
→ computes Priority
→ model may explain it
```

non:

```text
facts
→ model decides Priority again
```

Il principio è:

> **usare il modello per l'interpretazione che non sappiamo o non vogliamo rendere deterministica, non per sostituire logica che il sistema sa già governare meglio.**

Questo rende anche le eval più significative: misuriamo il valore specifico della componente probabilistica invece di chiederle di riprodurre funzioni già note.

## Structured output protegge la forma, non il significato

Vincolare una risposta a JSON Schema riduce una classe importante di failure. OpenAI documenta Structured Outputs come meccanismo per far aderire l'output a uno schema definito.

Fonte:

- [OpenAI — Introducing Structured Outputs in the API](https://openai.com/index/introducing-structured-outputs-in-the-api/)

Ma da questo non segue:

```text
schema-valid
→ semantically correct
```

Un modello può produrre un oggetto perfettamente valido con una conclusione non supportata. Può usare un enum consentito per rappresentare una decisione che il prodotto non gli ha mai autorizzato a prendere.

Lo schema ci consente di applicare validation deterministica e di rifiutare output malformati. Groundedness e authority richiedono altri controlli.

> **Structured output è un guardrail di interfaccia. Non è un oracolo semantico.**

## Il confidence score non trasforma probabilità in governance

Aggiungere `confidence = 0.92` può sembrare un modo semplice per rendere l'output governabile.

Ma quel numero è utile soltanto se sappiamo che cosa misura, come è stato calibrato sul nostro workload, come cambia fra model version e quale decisione dovrebbe realmente modificare.

Un confidence score non distingue automaticamente missing context da ambiguità, e non è un authorization mechanism.

Per il primo slice ESI preferisce stati che descrivano una relazione più concreta con l'evidence:

```text
Supported
PartiallySupported
InsufficientEvidence
Unavailable
```

Questi stati non promettono una probabilità di correttezza universale. Dicono come il product contract deve rappresentare disponibilità e sufficienza delle source, lasciando alle eval il compito di misurare il comportamento reale.

## Il model boundary è anche un Anti-Corruption Layer

Il provider è una dependency esterna con API, exception, token accounting, finish reason e feature proprie.

Non vogliamo che queste forme invadano il dominio.

ESI introduce quindi un port:

```text
CaseExplanationPort

input
→ CaseExplanationContext

output
→ CaseExplanationResult
```

Gli adapter futuri potranno usare provider differenti senza costringere `application` e UI a parlare in tipi vendor-specific.

Questo riduce il **code coupling**. Non rende però i modelli comportamentalmente equivalenti.

Context window, structured-output capability, latency, safety behavior, tool semantics e pricing possono cambiare. Anche a parità di interfaccia TypeScript, due modelli possono produrre risultati molto diversi sullo stesso eval set.

> **Un'interfaccia rende sostituibile il codice. Solo l'evidence può rendere abbastanza sostituibile il comportamento.**

Per questo un model upgrade sarà trattato più avanti come una modifica comportamentale da rivalutare, non come una dependency bump ordinaria.

## Il boundary ESI

Per Case Explanation Assistant il modello può ricevere soltanto context già autorizzato e minimizzato proveniente dalle view del caso e dai derived fact deterministici. Non riceve per default dati di tenant non correlati, secret, accesso database arbitrario o l'intero corpus aziendale.

Può restituire summary, fact supportati, hypothesis, missing evidence e source reference.

Non può creare un nuovo `PaymentStatus`, cambiare Priority, approvare refund, prendere decisioni di authorization o promettere al cliente un'azione che il sistema non ha autorizzato.

Questa divisione è la prima vera security e product decision della feature.

La domanda da conservare per ogni capability AI runtime è:

> **quale parte dell'output siamo disposti a trattare come interpretazione, quale parte possiamo verificare deterministicamente e quale parte non permetteremo al modello di decidere?**

Il model boundary è la risposta persistente a quella domanda.