# Capitolo 7 — Pattern senza religione

I pattern sono tra le idee più utili del software engineering proprio perché condensano esperienza. Ci permettono di riconoscere tensioni già incontrate, dare un nome a strutture ricorrenti e discutere con un team senza reinventare ogni volta il vocabolario.

Diventano pericolosi quando il nome arriva prima del problema.

> “Qui ci starebbe bene CQRS.”

> “Questo sembra perfetto per event sourcing.”

> “Usiamo una saga.”

Frasi così non sono necessariamente sbagliate. Sono incomplete se non sappiamo ancora quale tensione debba essere risolta e quale costo siamo disposti a introdurre.

Nel capitolo precedente abbiamo costruito il principio **fit before fashion**. Qui lo applichiamo ai pattern: non sono badge di maturità e non sono ingredienti che rendono automaticamente un'architettura più professionale. Sono possibili risposte a forze ricorrenti.

La domanda quindi non è:

> “Quale pattern possiamo usare?”

ma:

> **Quale problema stiamo cercando di risolvere, quali forze lo rendono difficile e quale struttura gestisce meglio quel trade-off nel nostro contesto?**

## Pattern-first development

Esiste una forma di overengineering particolarmente seducente perché produce codice ordinato. Factory, Strategy, Mediator, Repository, Unit of Work, command handler, event bus, adapter e orchestrator sono tutti concetti riconoscibili e possono far sembrare il design maturo.

Il problema emerge quando una feature semplice attraversa molti livelli e nessuno riesce più a spiegare quale forza concreta giustifichi ciascuno di essi. Il costo non è soltanto il numero di file; è il numero di concetti che una persona deve tenere in testa per trovare il comportamento reale.

Con gli agenti questo rischio cresce perché generare astrazioni costa pochissimo. Un modello può costruire in minuti una struttura coerente, testata e formalmente elegante. Il costo di comprenderla rimane però nel repository e viene pagato da ogni engineer e da ogni agente successivo.

> **L'AI abbassa il costo di creare astrazioni. Non abbassa automaticamente il costo di capirle.**

## Il pattern è esperienza compressa

La parte interessante di un pattern non è il diagramma UML. È la storia che quel diagramma comprime: una tensione compare abbastanza spesso da essere riconoscibile, alcune soluzioni ingenue producono problemi ricorrenti e una certa distribuzione delle responsabilità offre vantaggi prevedibili pagando costi altrettanto prevedibili.

Se perdiamo problema e conseguenze, rimane soltanto la forma. E una forma applicata senza la forza che l'ha resa utile diventa cargo cult.

Per questo non studieremo i pattern come un catalogo da memorizzare. Li useremo come **linguaggio per ragionare**.

Ogni volta chiederemo quale problema risolvano, quali forze debbano essere presenti, quale coupling riducano e quale introducano, quali failure mode cambino, quali conseguenze operative producano e quale alternativa più semplice possa soddisfare gli stessi requisiti.

La parte più importante sarà spesso un'altra: **quando non usarli**.

## Conoscere un pattern significa anche saperlo rifiutare

Una queue può ridurre coupling temporale e introdurre delivery semantics, backlog e retry. Un circuit breaker può contenere una dipendenza degradata e aggiungere stato, soglie e nuove necessità di osservabilità. CQRS può separare letture e scritture quando divergono davvero e può introdurre duplicazione e consistency più complessa. Event sourcing può offrire una storia ricchissima del dominio e cambiare profondamente persistence, debugging, privacy ed evoluzione degli eventi.

Nessuno di questi costi rende il pattern cattivo. Impedisce però di trattarlo come “upgrade” generico dell'architettura.

Un segnale di maturità non è quante soluzioni conosciamo, ma quante riusciamo a **non introdurre** quando non hanno ancora un lavoro reale da svolgere.

## La grammatica del capitolo

Useremo una sequenza semplice:

```text
problema
→ forze
→ struttura possibile
→ conseguenze
→ evidence
→ adozione, rinvio o rimozione
```

Questa sequenza impedisce al nome del pattern di prendere il controllo del reasoning. Ci permette anche di collegare la scelta agli ADR, ai quality target e ai review trigger dei capitoli precedenti.

> **Non applicare un pattern perché lo riconosci. Applicalo quando riconosci il problema che lo rende utile.**
