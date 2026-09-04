# 23.7 — Workflow reali e failure mode agentici

Le demo multi-agent sono quasi sempre lineari: arriva un task, più agenti collaborano, la soluzione esce.

Le piattaforme che stanno portando coding agent e agent framework dentro workflow reali raccontano invece un problema più interessante. Appena l'execution diventa concreta emergono permission, isolation, review, approval, tracing, context transfer e overreliance.

Non useremo GitHub, OpenAI o Microsoft come prova che esista una sola architettura agentica corretta. Li usiamo come evidence che **governare l'execution è una parte esplicita del problema, non un dettaglio successivo al modello**.

## L'agent execution entra nel normale change-control surface

GitHub descrive il proprio cloud coding agent come executor che lavora in un ambiente effimero, produce cambiamenti su branch/pull request e opera con limitazioni attorno a permission e secret. La documentazione insiste inoltre sul fatto che l'output debba essere reviewato e testato prima del merge.

Fonti:

- [GitHub Docs — Application card: GitHub Copilot Agents](https://docs.github.com/en/copilot/responsible-use/agents)
- [GitHub Docs — Review output from Copilot](https://docs.github.com/en/copilot/how-tos/copilot-on-github/use-copilot-agents/review-copilot-output)

La lezione per ESI non è “usa quel prodotto”. È più generale:

> **l'execution agentica è più governabile quando attraversa gli stessi artifact di change control — diff, branch, review, policy ed evidence — invece di ottenere un canale privilegiato verso main o produzione.**

La stessa cosa vale per la review. GitHub documenta che Copilot code review può sbagliare e raccomanda di validarne il feedback e affiancarlo alla review umana.

Fonte:

- [GitHub Docs — About GitHub Copilot code review](https://docs.github.com/en/copilot/concepts/agents/code-review)

Quindi `AI Implementer → AI Reviewer` può essere molto utile, ma non crea da solo una proof chain indipendente. Il valore cresce quando il reviewer può interrogare evidence primaria e quando policy e final authority restano separate dal producer.

## Handoff, guardrail e tracing non sono decorazioni di framework

OpenAI Agents SDK espone agenti, handoff, guardrail, human-in-the-loop e tracing come primitive distinte. Microsoft Agent Framework documenta più topologie di orchestration e approval human-in-the-loop.

Fonti:

- [OpenAI Agents SDK](https://openai.github.io/openai-agents-python/)
- [OpenAI Agents SDK — Handoffs](https://openai.github.io/openai-agents-python/handoffs/)
- [OpenAI Agents SDK — Human in the loop](https://openai.github.io/openai-agents-python/human_in_the_loop/)
- [OpenAI Agents SDK — Tracing](https://openai.github.io/openai-agents-python/tracing/)
- [OpenAI — A practical guide to building agents](https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf)
- [Microsoft Learn — Workflow orchestrations](https://learn.microsoft.com/en-us/agent-framework/workflows/orchestrations/)
- [Microsoft Learn — Human-in-the-loop](https://learn.microsoft.com/en-us/agent-framework/workflows/human-in-the-loop)

Queste primitive separano responsabilità che nel failure reale hanno cause diverse: routing sbagliato, permission eccessiva, approval mancante, context perso o run non ricostruibile.

La topologia resta una decisione di fit. Il fatto che un framework supporti `Sequential`, `Concurrent`, `Handoff` o manager-driven workflow non significa che dobbiamo usarli tutti.

## Prima famiglia — Moltiplicare una misconception condivisa

Il primo failure mode nasce **prima** del parallelismo.

Un Planner interpreta male una requirement e genera sei task. Sei agenti li eseguono in parallelo in modo impeccabile. I branch mergiano, i test locali passano e il risultato è sbagliato nella stessa direzione.

```text
shared misconception
→ fan-out
→ coherent parallel execution
→ larger wrong result
```

Il problema non è il singolo agent. È che abbiamo parallelizzato prima di sincronizzare la decisione.

Lo stesso fenomeno appare negli handoff. Agent A conosce un'Expected Difference, una stop condition e un ownership boundary; il summary passato ad Agent B dice soltanto “completa la migration”. Il secondo agente tratta l'Expected Difference come bug e “corregge” target behavior verso il legacy.

Entrambi i failure condividono la stessa radice: **il context boundary ha perso una informazione che governava il significato del task**.

Il guardrail non è aggiungere più agenti. È preservare work item, canonical context, evidence state e stop condition prima del fan-out o dell'handoff.

> **Il parallelismo amplifica la qualità dell'intent che riceve, compresi i suoi errori.**

## Seconda famiglia — Falsa indipendenza e verification theatre

Un Verifier può essere formalmente separato e restare completamente dipendente dal producer.

L'Implementer scrive codice, test e summary. Il Verifier legge soltanto il summary e dice `PASS`. Abbiamo creato una seconda opinione senza una seconda source di evidence.

Un'altra variante è il **green-by-editing-the-oracle**: il test o la fitness rule falliscono, l'executor modifica il criterio, la suite diventa verde e il reviewer vede soltanto il risultato finale.

Una terza variante è il consensus theatre:

```text
5 reviewers
4 PASS
1 critical cross-tenant finding
→ majority PASS
```

Qui il problema è trattare signal con severità diversa come voti equivalenti.

Questi failure hanno una radice comune: **confondere quantità di review con qualità della verification**.

La mitigazione combina primary evidence, read-only/independent verification quando serve, oracle governance e risk-weighted gate. Un singolo finding critico può bloccare il passaggio anche contro dieci review positive su aspetti minori.

> **La verifica non diventa indipendente perché aumentano i reviewer. Diventa indipendente quando il giudizio può contraddire il producer sulla base di una evidence che non dipende soltanto da lui.**

## Terza famiglia — Permission e authority che crescono per inerzia

Un task non si chiude. L'agente chiede una capability in più. La concediamo “solo per questa volta”. Il nuovo tentativo incontra un altro boundary e richiede un'altra permission.

Dopo qualche iterazione il workflow possiede molto più potere di quanto il Threat Model iniziale prevedesse.

```text
blocked execution
→ ad-hoc permission
→ new blocked execution
→ broader permission
→ accidental privilege growth
```

Lo stesso failure può avvenire sul piano della policy: l'executor aumenta il proprio livello nell'Autonomy Matrix, modifica il Delegation Contract o allenta una stop condition per poter continuare.

La radice è la stessa: **l'incapacità di completare il task viene trattata come giustificazione sufficiente per allargare l'authority**.

Il modello corretto è opposto:

```text
permission/autonomy change
→ new decision
→ explicit owner
→ threat/cost/evidence review
→ bounded grant or rejection
```

Una capability temporanea deve inoltre avere expiry o review trigger quando applicabile. `Just this once` non è una policy.

## Quarta famiglia — Repair loop e coordination cost che superano il valore

Gli agenti rendono economico iniziare execution, non necessariamente finirla bene.

Un workflow può entrare in un repair loop: il build fallisce, l'agente modifica; fallisce un altro test, modifica ancora; scatta architecture fitness, modifica ancora; il behavior si allontana progressivamente dall'intent originale.

Senza repair budget e stop condition il sistema ottimizza il verde locale invece della property.

All'estremo opposto possiamo costruire uno swarm costoso per un task piccolo:

```text
planner
implementer
test agent
security agent
architecture agent
review agent
synthesis agent
```

Tutto funziona, ma token, latency, handoff e review cost superano il valore del cambiamento.

Questi due failure sembrano diversi, ma condividono una radice economica: **non esiste un budget esplicito per il costo di coordinare e riparare l'execution**.

Il Cost Model del Capitolo 20 vale anche qui. Le metriche interessanti non sono soltanto token o numero di agent call, ma `cost per accepted task`, `cost per verified change`, repair loop e human review minutes per risultato accettato.

> **Un workflow multi-agent deve giustificare il proprio coordination cost come qualunque altra scelta architetturale.**

## Deskilling: il failure più lento

Esiste infine un failure che non appare in una singola run.

Il team può aumentare throughput fino al punto in cui nessuno sa più spiegare perché una policy esista, quale evidence renda valido un gate o quale agente abbia introdotto un boundary. L'essere umano diventa coordinatore di output che non comprende abbastanza da contestarli.

Questo è il contrario della tesi del libro.

Gestire agenti non significa rinunciare alla competenza. Significa usare quella competenza in un punto di leva diverso: formulare il mandato, capire i trade-off, progettare permission ed evidence, riconoscere contradiction e decidere quando il rischio cambia.

> **L'execution può essere delegata. La capacità dell'organizzazione di capire perché accetta un risultato non può essere esternalizzata senza creare un nuovo failure mode.**

## I casi reali non decidono per ESI

GitHub, OpenAI e Microsoft mostrano capability e mitigazioni reali. Non dicono quale livello di autonomia debba usare Order Operations.

La decisione resta funzione di business impact, security boundary, reversibilità, verification maturity, team capability, cost e observed failure history.

È ancora la stessa disciplina che attraversa tutto il libro:

> **fit before fashion, evidence before confidence, trade-off before shortcut.**
