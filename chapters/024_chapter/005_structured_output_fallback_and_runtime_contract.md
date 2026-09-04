# 24.5 — Il runtime contract: output, fallback e failure behavior

Una feature AI entra davvero nell'architettura quando il resto del prodotto smette di dipendere da una chiamata opaca `string → string` e comincia a dipendere da un **contratto con stati, validation e failure behavior comprensibili**.

Il modello può essere probabilistico. L'interazione del sistema con quel modello non deve essere indefinita.

Per Case Explanation Assistant il punto non è ottenere sempre una bella frase. È poter distinguere almeno quattro situazioni: abbiamo evidence sufficiente, ne abbiamo soltanto una parte, non ne abbiamo abbastanza oppure la capability non è disponibile.

Questo diventa il cuore del runtime contract.

## L'output deve rappresentare anche l'incertezza

ESI definisce:

```text
CaseExplanationResult

status
summary
confirmedFacts[]
hypotheses[]
missingEvidence[]
sourceReferences[]
```

con stati:

```text
Supported
PartiallySupported
InsufficientEvidence
Unavailable
```

Questi valori non sono un confidence score mascherato. Descrivono **come il prodotto deve trattare la relazione fra risposta ed evidence**.

`InsufficientEvidence` è quindi un output di business valido della capability, non un errore da nascondere. Se manca una source necessaria, la feature può fare meglio rifiutandosi di completare la storia che provando altre cinque generazioni.

> **Un sistema probabilistico diventa più governabile quando il contratto sa rappresentare anche il fatto che non abbiamo abbastanza ragioni per credere alla risposta.**

## Validation a strati: rifiutare ciò che possiamo rifiutare deterministicamente

Non tutti i failure di output hanno la stessa natura.

Un JSON malformato o un enum non valido è un problema strutturale. Un `sourceReference` che non esiste nel context autorizzato è un problema referenziale che possiamo verificare senza un secondo modello. Una source di un tenant non autorizzato è un security failure. Una claim che usa una source reale ma ne esagera il significato è un grounding failure e richiede evaluation più ricca. Un output che tenta di trasformare un'interpretazione in nuovo `PaymentStatus` viola il model authority boundary.

Questi failure possono essere visti come una pipeline:

```text
model result
→ schema validation
→ reference integrity
→ authorization consistency
→ product authority rules
→ behavioral / grounding evaluation
```

Più a sinistra, maggiore è la possibilità di usare check deterministici economici. Più a destra, maggiore diventa il bisogno di eval e judgment.

Nel capstone `validateCaseExplanationResult` implementa deliberatamente solo una parte della catena: verifica reference integrity e alcune invariant su missing evidence. Il commento nel codice dice esplicitamente che **non pretende di provare groundedness**.

Questa è una buona proprietà del design: il validator dichiara il proprio limite invece di trasformarsi in un oracolo finto.

## Retry è recovery soltanto quando il failure è recuperabile

Un provider può restituire output schema-invalid. In quel caso un singolo repair attempt può essere sensato.

Ma retry non deve significare:

```text
while (!happy) callModelAgain();
```

Se il failure nasce da missing evidence, nessuna quantità di sampling crea una source che non esiste. Se il failure nasce da una policy violation, riprovare senza cambiare il boundary può soltanto riprodurre o nascondere il problema.

Per v1 la direzione è semplice:

```text
initial call
→ optional one bounded format-repair attempt
→ fallback
```

Ogni retry ha latency, token cost e nuova variabilità. Il repair budget deve quindi essere collegato alla classe di failure.

> **Ripetere una generazione può correggere una forma. Non può creare evidence, authorization o authority che mancavano alla prima chiamata.**

## Il fallback decide se la feature AI trascina con sé il prodotto

Il Case Explanation Assistant non appartiene al critical path per caricare l'Operational Case.

Questa è una decisione di reliability importante.

Se il provider è lento o indisponibile, l'operatore continua a vedere i fatti autorevoli del caso. Se l'evidence è insufficiente, il prodotto mostra ciò che manca. Se l'output resta invalido dopo il repair budget, la explanation non viene mostrata come se nulla fosse. Se scatta una security policy, il risultato viene bloccato e il failure produce signal.

La relazione diventa:

```text
Order Operations core
= available

Case Explanation Assistant
= possibly Degraded / Unavailable
```

L'AI compra accelerazione cognitiva. Non diventa una dependency obbligatoria per accedere alla verità del sistema.

> **Una capability assistiva opzionale deve poter fallire senza rendere indisponibile il journey che dovrebbe assistere.**

## La UI fa parte del runtime contract

Fallback non è soltanto backend behavior.

Se l'assistant è unavailable, la UI deve evitare spinner infiniti o messaggi che sembrano bloccare il caso. Se lo status è `PartiallySupported`, missing evidence deve restare visibile. Se una hypothesis viene mostrata come fact con la stessa enfasi, abbiamo violato il model boundary pur avendo un JSON perfettamente valido.

Il contratto deve quindi arrivare fino alla rappresentazione:

```text
status
→ UI state

confirmed fact
→ source-backed presentation

hypothesis
→ explicit uncertainty

missing evidence
→ visible gap
```

La correctness della feature non finisce nell'adapter del provider.

## Latency: l'AI non deve bloccare ciò che non ha bisogno di lei

Una model invocation ha una latency profile molto diversa da una query locale o da un API call tradizionale.

Per questo la prima decisione ESI non è ancora un numero di SLO inventato. È una decisione di coupling: la explanation viene richiesta **on-demand** come azione secondaria.

```text
open Operational Case
→ existing deterministic path

request explanation
→ asynchronous/secondary AI path
```

Questa separazione riduce il costo di provider timeout e model latency sul journey principale. Quando avremo runtime baseline reali potremo decidere target numerici e capire se streaming, precomputation o altre topologie comprino abbastanza valore.

Prima l'architecture relationship, poi il numero.

## Cost: misurare il percorso fino all'outcome

Un'invocation AI può essere fatturata attraverso token o request, ma il Cost Model del prodotto deve guardare il percorso completo.

Context size, model route, retry, eventuale retrieval, tool call e human quality review possono diventare driver.

La metrica più utile non è necessariamente `cost per 1M tokens`. Per il prodotto potrebbe diventare:

```text
cost per accepted Case Explanation
```

letta insieme a quality signal come critical eval finding, groundedness e operator usefulness.

Finché ESI non possiede provider, model route ed execution reali, questi restano **unit metric Designed / not measured**. Non inventiamo una cost baseline per rendere il capitolo più completo.

## La configuration è parte del comportamento versionato

Il comportamento non dipende soltanto dal model name.

Dipende almeno da:

```text
provider / model route
model or deployment version
system instruction version
context builder version
output schema version
tool set
safety configuration
sampling / reasoning configuration when relevant
```

Una eval senza configuration identity è difficile da confrontare nel tempo. Se cambiamo il prompt o il context builder e manteniamo lo stesso model, abbiamo comunque modificato il sistema che produce la risposta.

NIST AI RMF Generative AI Profile insiste sulla gestione del rischio lungo il lifecycle e nel contesto d'uso. OpenAI ha inoltre evidenziato come harness, tool, budget, scorer e configurazione possano influenzare significativamente un assessment.

Fonti:

- [NIST AI 600-1 — Generative AI Profile](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence)
- [OpenAI — A shared playbook for trustworthy third party evaluations](https://openai.com/index/trustworthy-third-party-evaluations-foundations/)

## Model upgrade è una modifica comportamentale

Cambiare da `model-v1` a `model-v2` può richiedere zero modifica al domain code e cambiare comunque response style, source use, refusal behavior, latency, cost e performance sui boundary critici.

Per questo non basta che l'adapter compili.

Un upgrade dovrà attraversare almeno workload regression eval, critical security case, schema behavior e confronto latency/cost proporzionato all'impatto.

> **Il port rende possibile sostituire il provider. L'eval decide se la sostituzione conserva abbastanza comportamento da essere accettabile.**

## AI Feature Contract: rendere persistente il runtime boundary

Tutte queste decisioni convergono nel nuovo artifact del capitolo:

```text
AI Feature Contract
```

Il documento collega purpose, user, non-goal, model authority, context source, retrieval, tool/permission, input/output, grounding, fallback, reliability, security, evaluation, observability, cost, owner e review trigger.

Non è una checklist da applicare in forma pesante a ogni chiamata LLM. Serve quando una capability probabilistica diventa parte stabile del comportamento del prodotto.

Il suo valore è impedire che provider configuration e prompt siano l'unico luogo in cui vive il design.

> **Non progettare soltanto come ottenere una risposta dal modello. Progetta che cosa farà il sistema quando la risposta è incompleta, invalida, lenta, costosa, non autorizzata o semplicemente sbagliata.**