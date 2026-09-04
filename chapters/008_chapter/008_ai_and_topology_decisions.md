## AI e decisioni di topologia

L'AI cambia molto il costo di trasformare una topologia.

Può esplorare un codebase, costruire dependency map, individuare accessi cross-boundary, generare API e client, creare contract test, preparare Dockerfile, aggiornare pipeline e produrre una prima migrazione verso deployable separati.

Questo è un vantaggio reale.

Ma crea anche un rischio nuovo:

> **confondere la facilità di eseguire una migrazione con la bontà della decisione di farla.**

## Estrarre costa meno. Possedere continua a costare

Prima separare un modulo poteva richiedere settimane di lavoro meccanico.

Ora una parte consistente di quel lavoro può essere automatizzata. Un agente può introdurre adapter, spostare file, creare endpoint, sostituire call in-process con client e aggiornare centinaia di import senza fatica apparente.

Questo riduce il costo di execution.

Non riduce automaticamente latency, failure distribuiti o problemi di consistency. Non elimina security surface, observability burden, operational ownership, on-call e costi di recovery.

Il codice del nuovo servizio può essere generato in un'ora.

Il servizio dovrà essere operato per anni.

Quindi la riduzione del costo di creazione rende ancora più importante distinguere **build cost** da **ownership cost**.

## Prima dell'estrazione, chiedere evidenza

Un uso molto più interessante dell'AI è costruire la superficie di reasoning prima di modificare il sistema.

Per esempio possiamo chiedere:

> “Mappa tutte le dipendenze del modulo `payments`. Classifica accessi in ingresso e in uscita, tabelle lette o modificate, shared library utilizzate, transazioni cross-module e test che attraversano il boundary.”

Poi:

> “Quali dipendenze impedirebbero oggi un deploy indipendente?”

E ancora:

> “Se trasformassimo `payments` in un servizio, quali failure mode, costi operativi e problemi di consistency introdurremmo?”

Questa sequenza produce evidenza utile anche se la decisione finale è **non estrarre**.

La richiesta opposta:

> “Trasforma Payments in microservizio.”

salta direttamente alla soluzione e lascia all'agente il compito di inventare le ragioni che avrebbero dovuto precederla.

## Far attaccare entrambe le opzioni

Una topologia significativa beneficia di review avversariali.

Possiamo chiedere a un agente:

> “Assumi che estrarre questo modulo sia una cattiva idea. Trova evidenze che mostrino boundary immaturo, transazioni troppo strette, ownership ambigua o benefici operativi deboli.”

Poi invertire:

> “Assumi che mantenerlo nel monolite sia una cattiva idea. Quali requisiti attuali indicano che deployable condiviso, scaling o failure domain stanno diventando un limite reale?”

Le due analisi non sostituiscono il judgment.

Ci aiutano a vedere dove il nostro entusiasmo o la nostra familiarità stanno influenzando la scelta.

## Architecture by generation

Un anti-pattern emergente è chiedere direttamente una topologia completa:

> “Progetta un e-commerce scalabile a microservizi.”

L'output tipico può essere:

```text
API Gateway
Auth Service
Order Service
Payment Service
Inventory Service
Shipping Service
Notification Service
Event Bus
Cache
Service Mesh
```

La struttura è riconoscibile.

Ma non conosciamo volume, team, transaction boundary, availability target, consistency requirement, failure tolerance, security constraint, budget o deployment model.

Senza queste informazioni, l'architettura generata è una possibilità, non una decisione.

È il corrispettivo topologico della pattern-shaped architecture: il sistema prende la forma degli esempi noti al modello invece che delle forze del problema.

## Generated infrastructure illusion

L'effetto psicologico aumenta quando l'agente genera anche l'infrastruttura.

Kubernetes manifest, Helm chart, policy di rete, tracing, dashboard e CI/CD fanno apparire la soluzione “production-ready”.

Ma completezza sintattica e maturità operativa non sono la stessa cosa.

Un file di alerting generato non dimostra che qualcuno sappia interpretare l'alert. Una pipeline non dimostra che il deploy sia realmente indipendente. Una policy di retry non dimostra che l'operazione sia idempotente. Una dashboard non dimostra che il failure domain sia compreso.

Possiamo automatizzare la superficie.

Non possiamo automatizzare via la responsabilità.

## L'AI come amplificatore di sottrazione

Gli agenti non devono essere usati soltanto per aggiungere componenti.

Possiamo chiedere:

> “Quali deployable di questa proposta possono essere riuniti senza violare i requisiti?”

Oppure:

> “Proponi la topologia più semplice che soddisfa questi NFR e preserva questi boundary.”

Oppure ancora:

> “Per ogni servizio proposto, indica quale proprietà verrebbe persa se tornasse un modulo in-process.”

Queste domande trasformano l'AI in un amplificatore di sottrazione.

Sono particolarmente importanti perché il costo marginale di generare un nuovo servizio è diventato artificialmente basso.

## Verification bundle per l'estrazione

Per una decisione importante possiamo chiedere all'agente di preparare un bundle prima del codice:

```text
Boundary evidence
Dependency map
Expected property purchased
Current pain / requirement
New failure modes
Data ownership plan
Contract strategy
Operational owner
Migration plan
Rollback or fallback
Verification method
Review triggers
```

Se non sappiamo compilare `Expected property purchased` o `Operational owner`, il servizio probabilmente non è ancora pronto a esistere come unità operativa.

Il bundle può diventare input dell'ADR e della review umana.

## Il principio

L'AI rende più economico provare una separazione, costruire spike e perfino eseguire una migrazione.

Questo è prezioso perché possiamo testare ipotesi che prima sarebbero costate troppo anche solo da esplorare.

Ma la capacità di generare microservizi non è un requisito per averli.

> **Usa l'AI per rendere più economico verificare una separazione, non per rendere inevitabile la separazione.**