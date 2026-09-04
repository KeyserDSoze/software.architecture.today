# Capitolo 6 — Qualità prima della tecnologia

“Deve essere veloce.” “Deve essere scalabile.” “Deve essere sicuro.” “Deve essere resiliente.” “Deve essere economico.”

Nei progetti software queste frasi compaiono continuamente e sembrano requisiti. In realtà, finché restano così, sono soprattutto direzioni. Non ci dicono quanto sia veloce abbastanza, quale failure sia inaccettabile, fino a quale carico debba scalare il sistema o quale costo siamo disposti a pagare per ottenere una proprietà migliore.

L'architettura diventa concreta quando gli aggettivi smettono di essere aspirazioni e iniziano a discriminare tra alternative.

> Il p95 di `GET /orders/{id}` deve rimanere sotto 300 ms fino a 500 richieste al secondo nel profilo di traffico previsto.

Oppure:

> In uno scenario di disaster, la perdita massima accettabile di dati confermati è cinque minuti e il critical journey deve tornare disponibile entro sessanta minuti.

Oppure:

> Un operatore non può visualizzare ordini appartenenti a tenant per i quali non possiede autorizzazione.

Ora possiamo discutere design, costi e verifiche. Prima avevamo soltanto parole desiderabili.

## La tecnologia è una risposta

Un errore ricorrente consiste nel partire da una tecnologia e cercare successivamente il requisito che la giustifichi:

```text
Kubernetes
→ microservizi
→ broker
→ database distribuito
→ adesso cerchiamo il problema
```

Il metodo che useremo nel libro procede nella direzione opposta:

```text
problema
+ comportamento
+ qualità richiesta
+ vincoli
+ rischio
↓
alternative
↓
trade-off
↓
scelta
```

La differenza non è accademica. Se scegliamo prima il mezzo, tenderemo a interpretare il problema attraverso ciò che quel mezzo sa fare. Se definiamo prima ciò che deve diventare vero, possiamo chiedere a tecnologie diverse di dimostrare il proprio fit.

> **Prima definiamo che cosa deve essere vero. Poi discutiamo con che cosa renderlo vero.**

## “Migliore” non esiste senza contesto

Quando chiediamo quale sia il database, il framework o la piattaforma “migliore”, spesso stiamo ponendo una domanda incompleta. Una soluzione può offrire throughput superiore e costare molto di più; aumentare availability e richiedere una capacità operativa che il team non possiede; ridurre latency e indebolire consistency; comprare flessibilità futura al prezzo di molta complessità presente.

La tecnologia non può essere valutata nel vuoto. Il contesto comprende il comportamento richiesto, i critical journey, il profilo di carico, i failure che non possiamo accettare, budget, team, compliance, capacità di recovery e costo di cambiare idea in futuro.

La domanda utile diventa quindi:

> **Quale soluzione soddisfa meglio le proprietà che contano, dentro i vincoli reali che abbiamo, pagando costi e rischi che siamo disposti ad accettare?**

Questo è il significato operativo di **fit**.

## Fit before fashion

Una tecnologia non diventa adatta perché è nuova, popolare, cloud-native, usata da una big tech o molto presente nelle conferenze. Questi elementi possono fornire segnali utili: maturità dell'ecosistema, disponibilità di competenze, documentazione, esperienza operativa. Non dimostrano però che la tecnologia risolva bene il nostro problema.

Allo stesso modo, una tecnologia non diventa sbagliata perché è semplice o poco affascinante. PostgreSQL può avere un fit migliore di tre datastore specializzati. Una VM può essere più adatta di Kubernetes. Un singolo deployable può essere più ragionevole di una costellazione di servizi. Una queue può essere indispensabile in un workload e puro overhead in un altro.

> **Fit before fashion: il prestigio dello strumento non è una quality attribute del prodotto.**

Chiameremo **fashion-driven architecture** il processo in cui una tecnologia desiderata diventa il punto di partenza e il requisito viene costruito a posteriori per giustificarla.

Questo non è un attacco alla sperimentazione. Provare una tecnologia perché vogliamo imparare è perfettamente legittimo. Dobbiamo soltanto distinguere un **esperimento tecnologico** da una **decisione di produzione**. Nel primo il criterio di successo è l'apprendimento; nel secondo la complessità introdotta deve pagare un requisito o ridurre un rischio reale.

## I requisiti non funzionali restringono il design space

I non-functional requirements non servono a completare una sezione del documento. Servono a rendere visibili le proprietà che cambiano materialmente la soluzione.

Se il target di latency passa da due secondi a cinquanta millisecondi, alcune opzioni perdono plausibilità. Se l'RPO passa da ventiquattro ore a quasi zero, il disegno dei dati cambia. Se una funzione può essere indisponibile per una notte, una strategia multi-region può non restituire mai il proprio costo. Se il comportamento muove denaro o dati sensibili, correctness e controllo possono dominare performance e convenience.

La qualità richiesta orienta quindi l'architettura **prima** della tecnologia specifica.

Microsoft Learn, nell'Azure Architecture Center, collega esplicitamente le decisioni progettuali ai business requirement e ai trade-off tra reliability, security, cost, operational excellence e performance; la stessa guida colloca le technology choice dopo la definizione dell'architettura e dei requisiti del workload. AWS Well-Architected insiste allo stesso modo sulla necessità di valutare i miglioramenti di performance rispetto ai requirement e ai trade-off che introducono.

Fonti primarie:

- [Microsoft Learn — Azure Application Architecture Fundamentals](https://learn.microsoft.com/en-us/azure/architecture/guide/)
- [Microsoft Learn — Design principles for Azure applications](https://learn.microsoft.com/en-us/azure/architecture/guide/design-principles/)
- [AWS Well-Architected — Evaluate how trade-offs impact customers and architecture efficiency](https://docs.aws.amazon.com/wellarchitected/latest/performance-efficiency-pillar/perf_architecture_evaluate_trade_offs.html)

Il principio che useremo nel resto del capitolo è quindi semplice:

> **Non scegliamo prima il mezzo e poi inventiamo il requisito. Definiamo il requisito e valutiamo quale mezzo ha il fit migliore.**
