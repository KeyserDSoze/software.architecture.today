## AI e decisioni di topologia

L'AI cambia molto il costo di trasformare una topologia.

Può esplorare un codebase, individuare dipendenze, proporre moduli, generare API, creare client, preparare Dockerfile, aggiornare pipeline e perfino produrre una prima migrazione verso servizi separati.

Questo è utile.

Ma introduce un rischio importante:

> **confondere la facilità di eseguire una migrazione con la bontà della decisione di farla.**

### Estrarre è diventato più economico

Prima, separare un modulo poteva richiedere settimane di lavoro meccanico.

Ora una parte significativa di quel lavoro può essere accelerata.

Per esempio un agente può:

1. costruire la dependency map;
2. individuare accessi cross-boundary;
3. generare un'interfaccia;
4. sostituire chiamate interne con un adapter;
5. creare un endpoint;
6. generare contract test;
7. creare il nuovo deployable;
8. aggiornare la documentazione.

Questo riduce il costo di execution.

Non riduce automaticamente:

- latency;
- distributed failure;
- consistency problem;
- operational ownership;
- observability burden;
- security surface;
- on-call complexity.

Quindi ancora una volta:

> **il codice costa meno. Le conseguenze restano.**

### AI-assisted extraction discovery

Prima di estrarre un servizio possiamo usare agenti per cercare evidenza.

Per esempio:

> “Mappa tutte le dipendenze del modulo `payments`. Classifica accessi in ingresso e in uscita, tabelle lette o modificate, shared library utilizzate, transazioni cross-module e test che attraversano il boundary.”

Poi:

> “Quali dipendenze impedirebbero oggi un deploy indipendente?”

Poi ancora:

> “Se trasformassimo `payments` in un servizio, quali failure mode nuovi introdurremmo?”

Questo è un uso molto più interessante dell'AI rispetto a:

> “Trasforma payments in microservizio.”

### Boundary critique

Possiamo anche chiedere a un agente di contestare la separazione.

Per esempio:

> “Assumi che estrarre questo modulo sia una cattiva idea. Trova tutte le ragioni concrete per cui il boundary non è ancora maturo.”

Oppure:

> “Assumi che mantenere questo modulo nel monolite sia una cattiva idea. Quali requisiti attuali supportano invece l'estrazione?”

Confrontare i due report aiuta a ridurre confirmation bias.

### Architecture-by-generation

Un anti-pattern emergente è generare direttamente una topologia completa.

Prompt:

> “Progetta un ecommerce scalabile a microservizi.”

Output:

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

Potrebbe sembrare plausibile.

Ma non conosciamo ancora:

- volume;
- team;
- transaction boundary;
- availability target;
- consistency requirement;
- failure tolerance;
- security constraints;
- budget;
- deployment model.

È una risposta senza una domanda abbastanza precisa.

L'AI è particolarmente brava a produrre architetture riconoscibili.

Non dobbiamo confondere riconoscibilità con fit.

### Generated infrastructure illusion

C'è poi un effetto psicologico.

Se un agente genera velocemente:

- Kubernetes manifest;
- Helm chart;
- service mesh policy;
- tracing;
- CI/CD;

la soluzione sembra più pronta.

Ma quantità di infrastruttura non significa maturità operativa.

Può significare soltanto che abbiamo automatizzato la produzione di superficie da possedere.

### Usare l'AI per semplificare

Una domanda molto potente è l'opposto:

> “Quali componenti di questa architettura potremmo rimuovere mantenendo i requisiti attuali?”

Oppure:

> “Proponi la topologia più semplice che soddisfa questi NFR e preserva questi boundary.”

L'AI non deve essere soltanto un amplificatore di costruzione.

Può essere un amplificatore di sottrazione.

### Verification bundle per una decisione di estrazione

Prima di approvare un'estrazione potremmo richiedere un piccolo bundle:

```text
Boundary evidence
Dependency map
Expected benefit
New failure modes
Data ownership plan
Contract strategy
Operational owner
Migration plan
Rollback/fallback
Review triggers
```

Questo non elimina il judgment umano.

Lo rende più informato.

### Il principio

> **Usa l'AI per rendere più economico verificare una separazione, non per rendere inevitabile la separazione.**

La capacità di generare microservizi non è un requisito per averli.