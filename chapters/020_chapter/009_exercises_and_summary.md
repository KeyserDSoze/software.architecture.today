# 20.9 — Esercizi, autovalutazione e sintesi

Il Capitolo 20 ha aggiunto una nuova dimensione a quasi tutte le decisioni prese fin qui.

Security, reliability, observability, isolation, migration safety e optionality non sono soltanto qualità da progettare. Sono proprietà che hanno un prezzo di acquisto e un costo di possesso.

Questo non trasforma l'architettura in procurement. Fa il contrario: impedisce che il costo venga discusso quando ormai è separato dalle decisioni che lo hanno prodotto.

Il principio del capitolo è:

> **non chiedere soltanto quanto costa il sistema; chiedi quale proprietà stai pagando, quale valore o rischio la giustifica e quale evidence ti autorizza a cambiare il meccanismo senza perdere quella proprietà.**

## La catena economica che vogliamo saper leggere

Un cost review maturo dovrebbe poter ricostruire una catena come questa:

```text
business outcome / risk
→ required property
→ architectural mechanism
→ cost surface
→ cost driver
→ unit metric
→ quality pair
→ evidence
→ optimize, retain or redesign
```

Quando manca il legame fra costo e proprietà, la discussione tende a ridursi alle SKU. Quando manca il driver, ottimizziamo ciò che è visibile invece di ciò che muove la curva. Quando manca la unit metric, non sappiamo se la spesa sta crescendo insieme al valore. Quando manca la quality pair, possiamo migliorare il numero economico degradando il servizio.

Il Cost Model serve proprio a mantenere visibili questi legami.

## Le distinzioni che non dobbiamo più confondere

`Cost optimization` non significa `lowest cost`. TCO non coincide con la cloud bill. Usage optimization e rate optimization agiscono su leve diverse. Resource unit metric e business unit metric rispondono a domande diverse. Waste e reliability headroom non si distinguono con una singola percentuale di CPU. Un architectural premium può essere corretto oggi e diventare waste domani se la proprietà che comprava non serve più.

Anche il tempo conta. Una migrazione paga un transition cost mentre legacy e target convivono. Una reservation riduce il rate ma compra meno optionality. Engineering effort può essere speso oggi per abbassare un recurring infrastructure cost futuro.

La decisione economica è quindi inseparabile dal contesto temporale.

## Artefatto operativo — Cost Model

Il nuovo artefatto del capitolo è il **Cost Model**.

Non è una previsione finanziaria perfetta e non certifica che la spesa sia corretta. Deve però permettere a Product, Engineering e Finance di discutere lo stesso workload con lo stesso modello.

Per Order Operations collega almeno:

```text
business outcome
cost owner / Finance counterpart
cost surface
cost shape
cost driver
architectural premium
unit metric
allocation direction
assumptions / evidence state
optimization hypothesis
quality risk
review trigger
```

Nel capstone vive in:

```text
capstone/example-software-industries/products/order-operations/docs/cost-model.md
```

Al termine del Capitolo 20 il documento non possiede ancora billing production. Le unit metric sono quindi `Designed / not measured`. È uno stato corretto, non una lacuna da coprire con numeri fittizi.

## Esercizio 1 — Una tecnologia “gratuita”

Scegli una tecnologia open source o apparentemente gratuita usata in un progetto reale.

Costruisci un TCO che includa infrastruttura, engineering, operazioni, security, training, recovery e migration/exit. Per ogni voce indica quale evidence hai e quale stai soltanto stimando.

Poi rispondi a una domanda più precisa di “è gratis?”:

> **Quale capability compriamo possedendo direttamente questa tecnologia e quanto costa possederla bene?**

## Esercizio 2 — Property purchased

Prendi cinque voci importanti della tua architettura e descrivile con questa forma:

```text
Cost / premium
Property purchased
Requirement or risk
Owner
Evidence
Review trigger
```

Se per una voce costosa non riesci a nominare la proprietà comprata, hai trovato un buon candidato per il cost review.

## Esercizio 3 — Lowest-cost trap

Confronta due alternative in cui A ha una fattura infrastrutturale più bassa e B costa di più.

Aggiungi almeno security, reliability e operability e costruisci un caso in cui B abbia un TCO migliore perché riduce ownership, incident exposure o change cost.

Poi costruisci anche il caso opposto: B compra qualità che il workload non richiede e diventa over-engineering.

Lo scopo è mostrare che il prezzo da solo non decide nessuno dei due scenari.

## Esercizio 4 — Unit economics senza gaming

Definisci una resource metric e una business unit metric per un prodotto reale o simulato.

Poi aggiungi una quality metric necessaria a impedire che l'ottimizzazione economica incentivi il comportamento sbagliato.

Esempio:

```text
cost per escalation delivered
+
percentage delivered within target time
```

Spiega anche in quale modo la metrica potrebbe mentire pur restando matematicamente corretta.

## Esercizio 5 — Trova il vero driver

Prendi una fattura o una architettura ipotetica e classifica le principali superfici come `fixed`, `variable`, `step`, `shared` o `transition`.

Per ogni costo variabile indica il driver. Per ogni step cost indica la soglia che può far cambiare la curva. Per ogni transition cost indica la removal condition.

Alla fine scegli la voce più grande e chiediti: **è davvero il driver più importante o soltanto la voce più visibile?**

## Esercizio 6 — Reliability premium

Confronta una topologia single-region con una alternativa active-active multi-region.

Prima di scegliere, scrivi business impact del regional failure, RTO, RPO, compliance constraint, operational complexity, premium economico ed evidence che useresti per giustificarlo.

Se la risposta finale è “multi-region perché è più robusto”, l'esercizio non è concluso.

## Esercizio 7 — Observability come cost/value system

Parti da una policy ingenua:

```text
log everything
trace 100%
retain 365 days
```

Ridisegnala distinguendo almeno metrics, traces, application logs, audit/security evidence e business events.

Per ogni signal class spiega quale decisione o investigation need compra retention e sampling. Elimina ciò che non riesci a collegare a un uso reale, ma non ridurre la evidence necessaria ai critical journey.

## Esercizio 8 — Build vs buy

Confronta una capability managed e una self-managed includendo setup, patching, upgrade, security, backup, observability, capacity, on-call, vendor constraint ed exit cost.

Poi indica quale proprietà organizzativa cambia: chi possiede il failure, chi mantiene la competenza e quale parte del rischio viene trasferita o trattenuta.

## Esercizio 9 — AI unit economics

Hai due modelli. A costa meno per token ma richiede più retry e più human review. B costa di più per token ma produce un first-pass acceptance migliore.

Definisci una metrica di confronto più utile del solo `cost/token`, per esempio:

```text
cost per accepted task
```

Poi aggiungi almeno una quality metric e un costo che rischierebbe di restare fuori dal calcolo, come rework o verification burden.

## Esercizio 10 — Cost review di Order Operations

Finance chiede una riduzione significativa della spesa.

Valuta Service Bus Premium, App Service capacity, PostgreSQL HA/recovery direction, telemetry retention, non-production e Operations Desk Classic coexistence.

Per ciascuna voce separa:

```text
waste-reduction option
architecture-changing option
property at risk
evidence required
artifact to reopen
```

Non devi raggiungere una percentuale prefissata. Devi rendere leggibile quali proposte riducono waste e quali comprano il risparmio sacrificando una qualità.

## Autovalutazione

Dovresti saper spiegare senza rileggere il capitolo perché una cost optimization non coincida con il lowest cost; che cosa aggiunga il TCO alla fattura; come distinguere fixed, variable, step e transition cost; che cosa sia un cost driver; perché il costo assoluto possa crescere mentre la unit economics migliora; come resource metric e business unit metric si completino; che differenza ci sia fra usage e rate optimization; perché headroom richieda uno scenario; quando managed possa avere TCO inferiore; che cosa sia un architectural premium; quanto costi l'optionality; perché legacy coexistence debba avere una removal condition; perché `cost per token` non basti per un workflow agentico; e quando un cost cut debba riaprire Threat Model, Reliability Contract o un altro quality artifact.

Se la risposta a una proposta economica è soltanto “scegli la SKU più economica”, non stiamo ancora facendo cost architecture.

## Cosa cambia con l'AI

L'AI riduce alcuni costi di execution e ne rende più visibili altri.

Inference, context, retrieval, tool execution e retry possono diventare nuovi meter. Ma il punto più importante è che generation e acceptance iniziano a separarsi economicamente.

Un task può essere molto economico da generare e costoso da verificare. Un modello economico per token può diventare caro per outcome se aumenta repair loop e human review. Più contesto può migliorare la decisione oppure aumentare costo, latency e rumore.

Per questo la formula concettuale del capitolo resta valida anche per gli agenti:

```text
TotalTaskCost
= generation
+ context / retrieval
+ tools
+ retries
+ verification
+ human review
+ rework
```

Non tutti i termini saranno subito monetizzabili. Ma la decisione non dovrebbe dimenticarli soltanto perché il provider fattura in token.

> **L'AI rende ancora più importante distinguere il costo di generare dal costo di accettare.**

## Stato ESI dopo il Capitolo 20

ESI ha ora un Cost Model versionato con cost surface, driver, architectural premium, unit metric candidate, allocation direction e review trigger.

Può affermare:

```text
Cost Model structure              Codified
major cost surfaces               Identified
cost drivers                      Identified / to validate with billing
architectural premiums            Documented
unit metrics UM-01..UM-03         Designed / not measured
production billing evidence       Pending
allocation metadata direction     Designed / partially Codified
```

Non può ancora affermare un costo mensile production, un saving percentuale o una unit economics misurata. Questa distinzione mantiene coerente il modello di evidence del libro.

## Ponte al Capitolo 21

Finora abbiamo reso più leggibile il sistema per esseri umani: requirement, decisioni, boundary, threat, failure, test, migration, fitness e costo.

Il capitolo successivo apre la parte più esplicitamente AI-native e pone una domanda nuova:

> **Se un agente deve modificare questo repository, quanto di questa conoscenza riesce realmente a trovare, distinguere e usare senza reinventarla?**

Il tema non sarà aggiungere un file di istruzioni “magico”. Sarà ridurre rediscovery, context cost e instruction drift trasformando il repository in un sistema di contesto navigabile e verificabile.

## Corollario

> **Il costo è governato quando una riduzione di spesa non può cancellare silenziosamente la proprietà che quella spesa comprava.**