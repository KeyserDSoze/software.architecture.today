## Confini: decidere che cosa stiamo osservando

Ogni sistema ha un confine, ma quel confine non è sempre ovvio e soprattutto non è unico. Quando diciamo “il sistema ordini”, possiamo intendere soltanto il codice che implementa il dominio, oppure includere database, frontend, identity provider, payment provider e sistema logistico. Se stiamo studiando un incidente potremmo dover includere perfino processi manuali, customer support e un fornitore esterno.

La risposta dipende dalla domanda che stiamo cercando di risolvere.

> **Il confine di un sistema è una scelta di osservazione prima ancora che una scelta tecnica.**

## Confini diversi per domande diverse

Se vogliamo capire perché una query è lenta, un perimetro come `API → query → database` può essere sufficiente. Se vogliamo capire perché un cliente vede uno stato ordine incoerente, dobbiamo probabilmente seguire il journey attraverso frontend, API ordini, persistenza, pagamento, logistica, eventi e read model. Se l’obiettivo è valutare l’impatto economico di un outage, il sistema rilevante può estendersi fino a customer support, SLA, revenue e comunicazione verso i clienti.

La realtà sottostante non cambia; cambia il livello di zoom utile alla decisione.

### System of interest e ambiente

Per rendere questa scelta esplicita useremo il concetto di **system of interest**: la parte che stiamo progettando, modificando o analizzando direttamente. Attorno esiste un ambiente composto da attori e sistemi che interagiscono con esso ma che non controlliamo nello stesso modo.

Per una fase di Order Operations, per esempio, il system of interest potrebbe essere la capability di investigazione operativa. Customer, identity provider, payment provider, warehouse system e support operator appartengono invece all’ambiente rispetto a quella specifica decisione. Questo non li rende “fuori dal problema”. Al contrario: proprio perché non possiamo modificarli liberamente, il modo in cui ci influenzano diventa architetturalmente importante.

### Una dipendenza esterna è una decisione interna

Integrare un servizio esterno significa importare nel nostro sistema proprietà che non controlliamo: availability, latency, rate limit, versioning, pricing, error model, authentication, retention e support policy. Il provider vive fuori dal repository, ma le conseguenze della dipendenza vivono dentro il nostro prodotto.

Se un payment provider impiega trenta secondi a rispondere durante un degrado, dobbiamo decidere che cosa fare in quei trenta secondi. Se invia webhook duplicati, dobbiamo gestire la duplicazione. Se diventa indisponibile, spetta a noi scegliere se bloccare, degradare, mettere in coda, mostrare uno stato intermedio o rimandare l’azione.

> **Non controlliamo la dipendenza, ma controlliamo il modo in cui dipendiamo da essa.**

Questa distinzione è una delle basi del design resiliente.

## Confini di responsabilità

Un confine utile non stabilisce soltanto dove finisce il codice. Chiarisce anche chi è autorizzato a prendere una decisione e quale parte del modello possiede.

Prendiamo lo stato di pagamento di un ordine. La verità potrebbe appartenere a un ledger interno, a una capability Payments che integra il provider o, in un sistema più semplice, a un modello locale aggiornato da webhook. Le alternative non sono equivalenti. Se due componenti si considerano entrambi autorevoli per lo stesso significato, prima o poi divergeranno; se nessuno lo è, ogni lettura diventa una negoziazione.

Per questo la domanda “dove salviamo il dato?” è incompleta. Prima viene:

> **Chi possiede il significato e la decisione associati a questo dato?**

Ownership e storage possono coincidere, ma non sono la stessa cosa.

## Confini tecnici e confini di dominio

Un repository organizzato in `controllers/`, `services/`, `repositories/` e `models/` può essere perfettamente leggibile dal punto di vista tecnico. Quella struttura non ci dice però se Orders, Payments, Fulfillment, Returns e Pricing siano responsabilità indipendenti, quale team o modulo ne possieda il significato e attraverso quali contratti possano influenzarsi.

Il rischio è lasciare che la tassonomia del framework diventi accidentalmente la tassonomia del dominio. In quel caso stiamo facendo **framework-driven architecture**: la struttura tecnica decide i confini concettuali invece di servirli.

Il framework può aiutarci a organizzare il codice. Non dovrebbe decidere da solo quali cambiamenti meritino autonomia, quale dato sia autorevole o dove debba vivere una business rule.

## Un confine si giudica anche dal cambiamento

Un modo utile per osservare la qualità di un confine è chiedersi quali modifiche costringa a coordinare. Se ogni variazione alla logica di pricing richiede interventi su frontend, più servizi, uno schema condiviso, analytics e deployment, potrebbe esserci un confine debole o una responsabilità che abbiamo diviso male.

Non è una legge. Alcuni cambiamenti sono per natura trasversali. Ma la frequenza con cui elementi apparentemente indipendenti devono cambiare insieme è un segnale prezioso.

> **Quali cambiamenti vogliamo poter fare senza coordinare mezzo sistema?**

Questa domanda sposta la discussione dalla bellezza delle scatole alla **changeability**.

## Confini e autonomia degli agenti

I confini diventano anche strumenti di delega. Un agente che lavora dentro una responsabilità chiara, con contratti e acceptance criteria stabili, può ricevere più autonomia di uno che deve attraversare simultaneamente cinque aree con ownership diverse.

Possiamo persino usare il filesystem come permission boundary operativo — per esempio consentire modifiche a `orders/*` e rendere `security/*` review-only — ma non dobbiamo confondere quella scelta con il confine architetturale. Due directory separate possono restare fortemente accoppiate se condividono schema, stato, side effect o una semantica implicita.

La domanda utile non è soltanto “quali file toccherà l’agente?”, ma “quali responsabilità e decisioni attraverserà?”.

## Il test del confine

Quando un confine è importante, dovremmo essere in grado di spiegare che cosa contiene e che cosa esclude, quali dati e decisioni possiede, da chi dipende e chi dipende da lui. Dovremmo sapere come comunica e come fallisce, quali cambiamenti dovrebbe poter assorbire senza propagarsi e quali richiedono invece coordinamento esplicito.

Queste domande non sono una checklist da compilare sempre. Sono modi diversi di verificare che il confine abbia significato oltre il diagramma.

> **Un confine architetturale serve a contenere responsabilità, decisioni e conseguenze. Non soltanto codice.**
