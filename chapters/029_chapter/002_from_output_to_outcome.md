# Dall'output all'outcome

L'AI rende immediatamente visibile una cosa: possiamo produrre più output. Più codice, più test, più documentazione, più alternative, più pull request e più prototipi.

È utile, ma l'output non è il motivo per cui esiste il software.

Il software esiste per modificare una parte della realtà in modo intenzionale. Un ordine deve essere processato, un operatore deve capire un'anomalia, una campagna deve essere pubblicata, un pagamento non deve essere duplicato e l'azienda deve poter sostenere economicamente ciò che ha costruito.

Per questo il primo movimento del libro è stato tornare dal feature request al **problema**.

## Prima del codice c'è una promessa

Quando iniziamo da "costruiamo un'API", "introduciamo una queue", "usiamo Kubernetes" o "integriamo un LLM", stiamo già assumendo una parte della soluzione.

La domanda che viene prima è:

> **Per ottenere quale outcome?**

Un outcome non congela il prodotto per sempre. Rende però la soluzione valutabile. Senza outcome possiamo dire soltanto che un design è elegante o moderno; con un outcome possiamo chiedere se compra davvero qualcosa.

È per questo che il **Problem & Outcome Brief** viene prima dell'architettura. Evita che la tecnologia inizi a ridefinire il problema pur di giustificare se stessa.

## L'analisi funzionale continua dentro l'architettura

Una delle posizioni più importanti del libro è che l'analisi può avere specialisti, ma la comprensione del prodotto non può avere un solo proprietario.

Developer, tech lead e architect devono conoscere abbastanza attori, journey, stati, invariant, permission, eccezioni, side effect e ownership da capire quando una decisione tecnica cambia il significato del sistema.

La storia di Operations Desk Classic lo ha mostrato con chiarezza. Il codice conteneva la regola:

```text
Enterprise + age >= 30m
→ URGENT
```

I characterization test potevano dimostrare che quel comportamento esisteva. Non potevano dirci se dovesse sopravvivere.

Da qui la distinzione:

```text
Observed
≠
Confirmed
```

Una nuova architettura non poteva essere autorizzata dalla sola lettura del codice. Serviva capire quale semantica Product e Operations volevano mantenere.

## Una issue non è automaticamente una specifica

"Aggiungere retry sul pagamento" può sembrare execution-ready e nascondere invece decisioni su idempotency, finestra temporale, stato economico, authorization, user communication e uncertainty del provider.

Se il ticket viene trattato come specifica, qualcuno dovrà inventare ciò che manca. Con un agente questo può avvenire molto velocemente e con un risultato tecnicamente plausibile.

Per questo una issue execution-ready non deve eliminare ogni unknown. Deve eliminare le decisioni che l'executor non è autorizzato a prendere senza rendere visibile un nuovo gate.

> **L'AI è molto brava a riempire i vuoti. Il team deve sapere quali vuoti non sono autorizzati a diventare codice.**

## Il prodotto deve essere conoscibile

Nel capstone la conoscenza utile è uscita progressivamente dalle conversazioni private. Functional Analysis, Requirements, ADR, Data Ownership Map, Threat Model, Reliability Contract, Observability Contract, Testing Strategy, Cost Model e altri artifact sono comparsi quando una decisione importante aveva bisogno di diventare persistente e verificabile.

Non significa che ogni progetto debba produrre gli stessi documenti. Significa che un sistema modificabile soltanto da chi ricorda tutta la storia è fragile anche quando il codice è ordinato.

La documentazione utile riduce dipendenza dalla memoria e rende più sicuro l'ingresso di persone e agenti nuovi.

## L'outcome deve arrivare fino all'evidence

Un outcome ha pieno valore quando guida anche la verifica.

Se la promessa è che Payment Escalation non dipenda sincronicamente dalla disponibilità di Payments, una soluzione con local durable intent, outbox e delivery asincrona ha senso soltanto se possiamo produrre evidence su atomic commit, idempotent behavior, backlog visibility e recovery.

Il requisito non termina quando comincia l'implementazione. Attraversa l'architettura e arriva alla verifica.

Questa continuità impedisce di avere test tecnicamente corretti che non proteggono più la promessa originale.

## Solution gravity

Tecnologie potenti e familiari attirano problemi verso il proprio modello. Se l'azienda possiede Kubernetes, ogni workload sembra candidato a un cluster. Se esiste una event platform, ogni integrazione sembra un evento. Se esiste una vector platform, ogni feature AI sembra RAG. Se abbiamo agenti, ogni backlog sembra parallelizzabile.

La risposta non è vietare questi strumenti. È rendere il problema abbastanza chiaro da poter chiedere:

> **Questa capability compra davvero qualcosa per questo outcome?**

Campaign Launchpad è il controesempio più semplice. ESI possiede queue, microservices, AI e infrastrutture più complesse, ma il prodotto non le eredita perché il suo scope non le richiede.

Questa non è mancanza di maturità. È `fit before fashion`.

## Prima capire, poi costruire

"Prima capire, poi costruire" non significa aspettare la certezza. Significa distinguere ciò che è deciso, ciò che è assunto, ciò che resta unknown, ciò che l'executor può scegliere e ciò che richiede un nuovo gate.

Quando questa distinzione esiste, l'execution può diventare molto veloce senza diventare arbitraria.

Quando non esiste, accelerare significa spesso arrivare prima al posto sbagliato.
