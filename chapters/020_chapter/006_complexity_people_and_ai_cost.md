# 20.6 — Complexity cost, people cost e AI cost

Non tutto ciò che costa compare nella cloud bill.

Alcuni dei costi più persistenti vivono nel modo in cui il sistema deve essere capito, modificato, verificato e operato.

La parte difficile è che questi costi arrivano in piccole dosi. Non vediamo una riga “cognitive load” in fattura. Vediamo invece change più lenti, review più lunghe, incidenti che richiedono più persone e tecnologie che nessuno osa aggiornare.

## Cognitive load è recurring cost

Ogni tecnologia aggiunta porta con sé almeno configuration, security model, failure behavior, monitoring, upgrade e incident handling.

Kubernetes, Kafka, Redis, service mesh, GraphQL o un workflow engine possono essere il fit migliore per un problema reale. Ma non sono soltanto capability tecniche: diventano conoscenza che qualcuno deve possedere abbastanza bene da usarla durante un change o sotto pressione.

`fit before fashion` non ci dice di evitare tecnologie nuove. Ci chiede di pretendere che una nuova capability compri abbastanza valore da giustificare anche il costo di impararla e mantenerla.

> **La licenza può essere zero. Il costo cognitivo no.**

## Alcune architetture hanno un team minimo implicito

Una topology con molti deployable indipendenti, database separati, streaming, mesh e multi-region può essere tecnicamente valida. Ma se il team reale è composto da poche persone, la domanda diventa economica prima ancora che organizzativa.

Ogni runtime, pipeline, dashboard e failure mode consuma budget di attenzione. Quel budget non viene speso su nuove capability, customer issue o miglioramenti del prodotto.

Per questo team size e ownership devono entrare nel TCO. Un'architettura non è economica se richiede un'organizzazione che l'azienda non intende finanziare.

## Coordination cost nasce dai boundary sbagliati o poco chiari

Non serve aggiungere infrastruttura per aumentare il costo. Shared ownership, contract ambigui, coupled deploy e data owner incerti possono far crescere handoff, meeting, review latency ed escalation.

Possiamo osservare questi effetti attraverso proxy come lead time, numero di team richiesti per un change, tempo perso a trovare l'owner durante un incident o release coordination necessaria per una modifica apparentemente locale.

Non dobbiamo trasformare ogni minuto in euro per riconoscere che la curva esiste.

> **Ogni dependency organizzativa ricorrente è anche una decisione di costo.**

## Legacy coexistence: premium temporaneo o tassa permanente

Operations Desk Classic rende il concetto molto concreto.

Durante la migrazione ESI paga contemporaneamente vecchio runtime e nuovo runtime, conoscenza legacy e target, characterization, comparison, review e cleanup. Questo premium è intenzionale: compra reversibilità e semantic safety.

Il problema nasce quando la struttura temporanea perde una removal condition. A quel punto il dual run non è più un investimento di migrazione. Diventa recurring cost.

Nel Refactoring Safety Plan abbiamo già stabilito che adapter, comparison e legacy path devono avere un exit. Il Cost Model aggiunge un'altra ragione per farlo: ogni periodo di coexistence deve continuare a giustificare il valore del premium che stiamo pagando.

> **La coesistenza è un investimento soltanto finché esiste un percorso credibile verso la rimozione.**

## Quando generation costa poco, verification può diventare il driver

L'AI rende questo capitolo ancora più importante.

Un agente può produrre rapidamente decine di file, test, migration e pipeline. Il costo di generation può scendere molto. Ma il costo di capire se quel cambiamento è corretto, autorizzato e sicuro non scompare insieme al costo di scrittura.

Una metrica come `cost per generated line` diventa quasi priva di significato. Potremmo generare moltissimo codice a poco prezzo e spendere poi il doppio in review, repair loop e incident response.

Metriche più interessanti saranno, quando avremo dati reali:

```text
verification cost per accepted change
review time per accepted task
repair loops per delegated task
post-verification finding rate
failure rate after acceptance
```

Questo non significa che l'AI sia economicamente svantaggiosa. Significa che **il punto di misura deve spostarsi dalla produzione all'accettazione**.

## Token è un meter, non un outcome

La FinOps Foundation cita `cost per token` come esempio di resource-efficiency unit metric.

Fonte:

- [FinOps Framework — Unit Economics](https://www.finops.org/framework/capabilities/unit-economics/)

È una metrica utile per capire il consumo. Ma non basta per scegliere un modello o un workflow.

Un modello con prezzo/token inferiore può richiedere più retry, più context reload e più human review. Un modello più caro può produrre meno rework e un costo complessivo per task più basso.

Quindi una futura decisione di model routing dovrà guardare almeno due assi:

```text
resource efficiency
+ outcome quality
```

Il prezzo unitario è soltanto una delle variabili.

## Cost per useful outcome

Per un sistema agentico potremmo voler misurare `cost per accepted issue`, `cost per verified refactoring` o `cost per successful support resolution`.

La scelta della unità resta delicata. `cost per merged PR`, per esempio, può migliorare semplicemente aumentando il numero di PR o abbassando il livello di verifica. La metrica economica deve quindi viaggiare con una quality metric che renda difficile questo tipo di gaming.

Una forma generale utile è:

```text
TotalTaskCost =
    inference
  + retrieval/context
  + tool execution
  + retries
  + verification
  + human review
  + rework
```

Non tutti i termini saranno immediatamente monetizzabili. Ma il modello ci ricorda quali costi stiamo rischiando di spostare fuori dalla metrica principale.

## Context engineering ha una dimensione economica

Un sistema AI paga anche il contesto: repository file, documenti recuperati, log, schema, conversation history e output precedenti.

Più contesto può migliorare la decisione. Può anche aumentare token, latency, retrieval complexity, privacy exposure e stale-context risk.

La direzione economica è la stessa usata nel resto del libro:

> **usare il contesto minimo che preserva la qualità della decisione richiesta.**

“Mandare tutto sempre” non è una strategia di context engineering. È una rinuncia a modellare il costo e la qualità del contesto.

## Caching e routing non sono ottimizzazioni gratuite

Caching può ridurre inference ricorrente ma introduce identity, invalidation, staleness e security questions. Model routing può assegnare task semplici a modelli più economici e task ad alto rischio a modelli più forti, ma soltanto se esiste evidence che il routing preservi la qualità richiesta.

Questi temi arriveranno più avanti. Nel Capitolo 20 ci basta fissare il criterio economico:

> **Ottimizzare inference cost senza misurare task quality può trasformare un costo visibile in rework invisibile.**

## Il costo differito della competenza

Esiste infine un costo che nessun billing dashboard ci mostrerà subito: perdere la capacità interna di capire e verificare il sistema.

Se l'AI esegue sistematicamente debugging, migration reasoning, architecture trade-off e code review senza che il team mantenga capacità di giudicare il risultato, possiamo abbassare il costo immediato dell'execution e aumentare quello futuro di recovery e decision making.

Questo è lo stesso rischio introdotto nel Capitolo 0: execution più economica non rende automaticamente più economica la responsabilità.

Per questo il modello economico dell'AI non dovrà fermarsi a `hours saved`. Dovrà guardare anche verification burden, rework, incident impact e competenza che resta nel sistema organizzativo.

> **Nell'era AI il costo di produrre può scendere più rapidamente del costo di capire, verificare e possedere ciò che abbiamo prodotto. Il secondo è il costo che l'architettura deve imparare a rendere visibile.**