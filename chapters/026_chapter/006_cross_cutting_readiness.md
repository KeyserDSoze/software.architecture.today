# Readiness trasversale: far convergere le promesse

La Production Readiness Review non deve riscrivere Security, Reliability, Data, Observability, Cost e AI Architecture. Deve fare una cosa diversa: verificare che le **promesse del launch boundary** siano sostenute da evidence coerente fra aree che, durante il design, abbiamo studiato separatamente.

Una review piatta del tipo `Security = green`, `Reliability = green`, `Monitoring = green` nasconde decine di claim diversi.

La domanda più utile è:

> **Quale failure renderebbe falsa la promessa corrente, quale evidence ci permette di rilevarlo o prevenirlo e quale limitation resta?**

## La promessa funzionale viene prima della technology readiness

Il prodotto deve prima di tutto comportarsi secondo le semantics confermate. Critical journey, business rule, error state e feature esplicitamente disabilitate devono essere comprensibili anche dall’engineering team, non soltanto da Product.

Qui torna l’analisi funzionale come competenza condivisa. Se il team non sa riconoscere una regressione semantica, una deployment pipeline perfetta non rende il sistema ready.

Per il core ESI la evidence deve quindi includere deterministic test e un critical journey eseguito in uno stage abbastanza rappresentativo del launch boundary.

## Le invarianti dei dati richiedono il datastore reale

“Il database è pronto” non è un claim utile.

Per Order Operations la property più evidente è l’atomicità di `PaymentEscalation + OutboxMessage`. Il local application test dimostra orchestration logic; non dimostra la transaction semantics di PostgreSQL.

Finché `OO-001` non esegue migration chain e failure scenario sul datastore reale, quella property resta Pending e `LB-ESCALATION` resta bloccato.

Lo stesso ragionamento vale per backup e restore: policy configurata non dimostra recovery. Se RTO/RPO fanno parte della promessa, serve almeno un drill rappresentativo con tempi misurati.

## Security readiness significa controlli osservati, non threat model presente

Il Threat Model dice che cosa temiamo. La PRR deve mostrare quali critical control abbiamo realmente esercitato.

Per ESI significa almeno authentication/authorization, tenant isolation, private-access direction, runtime/deployment identity separation e incident access. Negative test come wrong-role, cross-tenant o public-access denied hanno una forza diversa dal semplice fatto che la IaC esprima l’intenzione corretta.

Il launch boundary piccolo può ridurre l’esposizione, ma non rende opzionale la verifica di una boundary che protegge altri tenant o authoritative data.

## Reliability e Observability si incontrano durante il failure

Un Reliability Contract con SLO, degraded mode e RTO/RPO descrive la promessa. La readiness chiede se abbiamo visto il sistema fallire in modo abbastanza rappresentativo da sapere che signal, alert, containment e recovery funzionano.

Per un failure significativo vogliamo poter seguire:

```text
failure injection / real failure
→ expected telemetry
→ SLI classification
→ alert
→ owner
→ first action
→ recovery / resolution signal
```

Se la telemetry pipeline è rotta, dobbiamo poter distinguere “zero traffico” da “non stiamo osservando nulla”. Se la dependency è down, dobbiamo sapere se il workload degrada come progettato o amplifica il failure con retry e backlog incontrollati.

Reliability e observability sono quindi due facce della stessa readiness question: **quando la promessa si rompe, ce ne accorgiamo e sappiamo che cosa fare?**

## Capacity è una property del launch boundary

Google SRE include da tempo volume estimate, spike, load test e dependency impact nelle launch question.

Fonte:

- [Google SRE — Launch Coordination Checklist](https://sre.google/sre-book/launch-checklist/)

Un bounded internal pilot non richiede lo stesso capacity program di un public API globale. Ma deve comunque sapere quale load si aspetta, dove può essere il bottleneck, quale headroom possiede e che cosa accade quando lo supera.

`Expected load unknown` non è automaticamente un blocker universale; è però un `Unknown` che la PRR deve classificare rispetto al boundary corrente.

## Le dipendenze entrano nella readiness attraverso il nostro comportamento

Non serve dimostrare che Service Bus, Payments o PostgreSQL siano “affidabili in assoluto”. Serve sapere che cosa fa Order Operations quando una dependency fallisce.

Per esempio, se Payments consumer non è disponibile, Payment Escalation deve rimanere durable, il backlog deve diventare osservabile e l’operatore non deve ricevere uno stato che suggerisca elaborazione completata.

Questa è una property del nostro sistema, anche quando la causa iniziale vive altrove.

## AI readiness è un launch boundary separato

Il Case Explanation Assistant ha già un AI Feature Contract, un provider-neutral port, validator e eval seed. Questi artifact rendono il boundary chiaro, ma non esistono ancora real provider/model execution, groundedness result, prompt-injection result, latency distribution, cost per explanation, operator usefulness evidence o runtime monitoring.

Quindi il core può progredire mentre `LB-AI` resta disabled.

Questa separazione è una forza dell’architettura: l’AI non è authority e non è nel critical path, quindi il suo failure o la sua evidence incompleta non devono trascinare con sé il journey deterministico.

Se in futuro il modello acquisisse write tool o diventasse critical-path, la readiness bar aumenterebbe insieme al blast radius.

## Cost e continuity chiudono due promesse spesso dimenticate

Il workload non deve conoscere ogni euro prima del launch, ma deve poter attribuire il costo e riconoscere i premium principali. Per l’AI, `cost per token` è diagnostico; il business outcome sarà più vicino a `cost per useful explanation` quando avremo runtime data.

La continuity pone una domanda simmetrica sul lato umano: se l’Accountable Project Lead manca, il sistema può essere operato e cambiato in sicurezza? Il Secondary Maintainer e il continuity drill trasformano questa domanda in evidence.

## La PRR è il punto di convergenza del libro

Le parti precedenti rispondevano a domande diverse:

```text
Functional Analysis
→ che cosa promettiamo?

Architecture / Data / Contracts
→ che cosa deve restare vero?

Security / Failure / Reliability
→ come può rompersi?

Testing / Observability
→ come lo sappiamo?

Cost
→ quanto costa mantenere la promessa?

Agent governance / One-Man Project
→ chi governa execution e continuity?

AI Feature Contract
→ che cosa può sapere, affermare e fare il modello?
```

La Production Readiness Review verifica se queste risposte formano davvero un sistema governabile per **questo** launch boundary.

> **La severità del gate può cambiare con il launch. La trasparenza su ciò che è Verified, Pending o Unknown non deve cambiare.**
