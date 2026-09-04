# 28.3 — Profondità tecnica senza culto dell'implementazione

C'è una caricatura dell'architect che dobbiamo evitare: la persona che non apre un repository da anni ma continua a prendere decisioni molto dettagliate su framework, runtime, schema, networking, queue o AI SDK basandosi soltanto su diagrammi e slide.

L'estremo opposto non è migliore: l'architect come developer più senior che misura il proprio valore dal numero di commit.

La profondità tecnica utile sta altrove. Serve a scendere abbastanza in profondità da capire se l'astrazione con cui stiamo decidendo coincide ancora con la realtà.

> **Non devi implementare tutto. Devi saper riconoscere quando l'implementazione invalida il modello mentale con cui stai decidendo.**

## Code literacy come accesso alla realtà

Un architect dovrebbe saper seguire un critical flow, trovare dove vive una business rule, leggere un test e capire quale property protegge, riconoscere provider coupling, capire una migration e verificare dove vengono applicati authentication e authorization.

Non deve essere il contributor più veloce. Deve però essere in grado di attraversare il repository quando una decisione importante dipende da ciò che il codice fa davvero.

Nel capstone non basta sapere che Order Operations usa un outbox. Serve poter verificare, direttamente o attraverso evidence adeguata, che `PaymentEscalation` e `OutboxMessage` condividano davvero la transaction boundary che stiamo promettendo, che l'identità del messaggio sia stabile e che retry e republish abbiano un failure model compreso.

La code literacy impedisce che la parola `outbox`, `hexagonal`, `clean architecture` o `AI boundary` venga accettata come prova di una proprietà che nessuno ha verificato.

## Il runtime può smentire un buon diagramma

La realtà tecnica non finisce nel repository. Un architect deve saper interrogare SLI, trace, log strutturati, backlog, connection pool, query plan, retry rate, error-budget burn e costi reali abbastanza da capire se le assunzioni architetturali stanno reggendo.

Se abbiamo deciso che una queue assorbe i burst, la domanda non è se la queue esiste. È quanto cresce il backlog, quanto tempo impiega a drenare e quando il burst diventa overload persistente.

Se una cache dovrebbe ridurre latency, contano hit ratio, staleness, invalidation, stampede e costo, non la presenza della cache nel diagramma.

> **Un'architettura credibile deve poter essere falsificata dal runtime.**

## Intent, mechanism, evidence

L'AI rende molto economico generare IaC. Questo aumenta il valore di saper distinguere tre livelli:

```text
Intent
→ quale proprietà vogliamo ottenere

Mechanism
→ come la piattaforma la esprime oggi

Evidence
→ come verifichiamo che quel mechanism produca davvero l'intent
```

Un template Bicep può dichiarare private access e restare ancora soltanto `Codified`. La property diventa `Verified` quando deployment, DNS, network path e negative test dimostrano il boundary nel sistema reale.

Lo stesso vale per data e distributed systems. Parole come `eventually consistent` o `shared database` sono troppo povere se non sappiamo quale fatto può essere stale, per chi, per quanto tempo e chi mantiene l'authority sul dato.

Un architect non deve diventare DBA, network engineer e cloud specialist contemporaneamente. Deve però sapere quando l'astrazione è troppo generica per decidere.

## AI literacy senza buzzword literacy

Nel runtime AI, la profondità utile riguarda model boundary, context, retrieval, tool permission, prompt injection, structured output, eval, latency, cost, drift e fallback.

Non serve addestrare un foundation model per riconoscere che `valid JSON` non equivale a `correct answer`, che un benchmark migliore non dimostra il workload e che RAG è un meccanismo di retrieval, non un requisito universale.

Nel Case Explanation Assistant questa literacy ci ha permesso di evitare un vector database nel primo slice perché il contesto necessario era già bounded e strutturato. Il criterio non era essere moderni o minimalisti. Era usare abbastanza tecnologia per la property reale.

## Hands-on dove riduce incertezza

Scrivere codice resta uno dei modi migliori per mantenere technical depth, ma l'attività hands-on dovrebbe essere scelta per il suo valore informativo.

Uno spike su una dependency rischiosa, un architecture fitness test, una migration rehearsal, un failure injection, un security negative test o un AI eval harness possono valere più di implementare una decina di feature che non cambiano nessuna decisione architetturale.

Microsoft Well-Architected raccomanda di validare assunzioni critiche con POC e codice funzionante prima di finalizzare design ad alto rischio.

Fonte:

- [Microsoft Learn — Solution Architect's Responsibilities and Guiding Principles](https://learn.microsoft.com/en-us/azure/well-architected/architect-role/fundamentals)

La domanda utile non è quindi:

> Quanto codice deve scrivere l'architect?

È:

> **Dove un esperimento tecnico riduce abbastanza incertezza da migliorare materialmente la decisione?**

## Il deskilling diventa un rischio architetturale

L'AI può produrre SQL, regex, IaC, API client, test e configurazioni in pochi secondi. Se accettiamo continuamente questi output senza comprenderli, la nostra capacità di giudizio può diminuire proprio mentre aumenta la capacità di produrre.

Per un architect è particolarmente pericoloso, perché il valore professionale dipende dal riconoscere coupling, failure mode, assumption nascosta, security boundary, cost implication e semantic mismatch.

Una pratica semplice è mantenere il primo passo umano nelle aree che vogliamo davvero saper governare: prima formulare l'invariant, poi generare i test; prima fare una previsione, poi chiedere all'AI; prima leggere una parte del codice, poi usare l'AI per accelerare la discovery.

> **Se deleghiamo anche la capacità di riconoscere gli errori, perdiamo il diritto di delegare l'esecuzione.**

## Profondità dinamica

La metafora T-shaped resta utile se non diventa una fotografia permanente. L'architect ha bisogno di ampiezza su business, functional, systems, cloud, security, operations, economics e AI; di una o due aree di profondità forte; e della capacità di scendere temporaneamente più in profondità quando una decisione lo richiede.

La depth può spostarsi nel tempo. Un architect con radici backend può approfondire AI evaluation per un periodo, poi security o data platform quando cambia il portfolio.

La baseline ESI non è "sapere tutto". È sapere abbastanza da riconoscere quando non si sa abbastanza e trasformare quel limite in un specialist trigger o in un esperimento.

> **La profondità tecnica dell'architect non serve a vincere una gara di implementazione. Serve a mantenere il judgment ancorato alla realtà.**
