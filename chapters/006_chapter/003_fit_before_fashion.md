## Fit before fashion

Una tecnologia non è una medaglia. Non dimostra che il team sia moderno e non rende automaticamente il sistema migliore. È uno strumento, e la sua qualità dipende dal problema che deve risolvere.

Questa sembra un'ovvietà. Nella pratica, molte conversazioni architetturali iniziano proprio dalla tecnologia: “perché non usiamo Kubernetes?”, “perché non facciamo event-driven?”, “perché non introduciamo serverless?”, “perché non usiamo un database vettoriale?”.

Sono domande legittime quando la tecnologia è un'alternativa. Diventano pericolose quando diventa l'obiettivo e il ragionamento viene invertito:

```text
tecnologia desiderata
→ architettura compatibile
→ requisito che la giustifica
```

Il percorso che ci interessa è l'opposto:

```text
problema
→ qualità necessarie
→ vincoli
→ alternative
→ trade-off
→ fit
```

## Popolarità e prestigio sono contesto, non prova

La popolarità di una tecnologia ha valore. Un ecosistema grande può significare più documentazione, librerie, persone con esperienza e minore rischio di abbandono. Ma questi vantaggi non dimostrano che lo strumento sia proporzionato al nostro workload.

Una piattaforma progettata per migliaia di engineer o milioni di richieste al secondo può essere una scelta eccellente nel proprio contesto e un costo inutile per un team piccolo con traffico prevedibile. Copiare la soluzione senza copiare il problema significa spesso copiare soltanto la complessità.

Lo stesso vale per le architecture story delle grandi aziende. Sono fonti preziose perché ci mostrano failure reali, scale estreme e trade-off sperimentati. Per trasferire la soluzione dobbiamo però ricostruire ciò che la rese razionale: scala, organizzazione, sistema preesistente, failure precedenti, capacità operativa e momento storico.

Senza quel contesto facciamo **copy-paste architecture**.

## Anche la familiarità può diventare moda al contrario

La reazione opposta è trasformare ciò che conosciamo in dogma: “abbiamo sempre usato SQL Server”, “facciamo tutto in .NET”, “non introduciamo mai broker”, “Kubernetes è sempre inutile”.

La familiarità è un vantaggio concreto. Riduce onboarding, rischio operativo e costo di delivery. Ma rimane una delle forze del contesto, non una legge.

Se una tecnologia conosciuta non soddisfa un requisito significativo, il fit può richiedere apprendimento, un servizio gestito o competenze nuove. In altri casi, ciò che il team conosce è esattamente la scelta migliore perché nessuna quality attribute giustifica il costo della novità.

Il criterio non è essere conservatori o innovatori. È valutare il costo totale rispetto al bisogno.

## La tecnologia “noiosa” può essere la scelta più moderna

Una tecnologia stabile e ben conosciuta può avere failure mode documentati, tooling maturo e un operating model semplice. Può ridurre componenti e cognitive load. Non c'è nulla di antiquato nel non introdurre complessità che il sistema non richiede.

Allo stesso modo, una tecnologia nuova può essere la scelta corretta quando introduce una capability che cambia materialmente il design space. Il punto non è l'età dello strumento, ma il rapporto tra valore e costo.

> **Essere moderni significa prendere decisioni aggiornate sul contesto, non collezionare tecnologie recenti.**

## Confrontare il fit senza trasformarlo in un punteggio magico

Quando la scelta è importante possiamo usare una Technology Fit Matrix:

| Criterio | Soluzione A | Soluzione B | Soluzione C |
| --- | --- | --- | --- |
| latency target | soddisfa | soddisfa | soddisfa |
| consistency richiesta | forte | eventuale | forte |
| capacità attesa | sufficiente | molto elevata | sufficiente |
| operabilità team | alta | bassa | media |
| costo | basso | alto | medio |
| lock-in | basso | medio | alto |
| migration effort | basso | alto | medio |
| reversibilità | alta | bassa | media |

La tabella non elegge automaticamente un vincitore. Alcuni criteri possono eliminare un'opzione indipendentemente dal resto: un requisito normativo, un budget o una proprietà di correctness possono valere più di molti vantaggi secondari.

La matrice serve a rendere visibile **perché** una soluzione ha fit, non a nascondere il judgment dietro un totale numerico.

## La sofisticazione deve pagare l'affitto

Broker, cluster, service mesh, datastore aggiuntivi, cache distribuite, orchestratori e workflow engine possono essere ottimi strumenti. Ognuno però aggiunge failure mode, upgrade, osservabilità, competenze, incident response e costi di recovery.

La domanda è:

> **Quale problema significativo rende ragionevole possedere questa complessità?**

Se non sappiamo rispondere, stiamo probabilmente anticipando la soluzione rispetto al bisogno.

Questo principio non richiede di dimostrare un ROI finanziario al centesimo per ogni componente. Richiede che la complessità abbia una ragione leggibile.

## Il test del fit

Una proposta tecnologica diventa più solida quando sappiamo quale requisito soddisfa, quale alternativa più semplice abbiamo escluso e che cosa ci costerà operarla. Dobbiamo anche capire quali failure mode aggiunge, quali competenze richiede, quanto lock-in introduce e quanto sia reversibile.

Una domanda merita attenzione particolare:

> **Che cosa succede se la crescita prevista non arriva mai?**

Molti sistemi pagano ogni giorno la complessità di una scala futura che non si manifesta. Progettare margine è ragionevole; progettare un'azienda immaginaria non lo è.

## La stella polare

La stella polare non è la tecnologia. È il problema risolto bene, con le qualità necessarie e un costo che il sistema e l'organizzazione possono sostenere.

Microsoft Learn raccomanda di partire dai business requirement e di usare le quality attribute e i trade-off per restringere le technology choice; AWS Well-Architected raccomanda esplicitamente di valutare le alternative rispetto ai workload requirement, ai costi e all'impatto dei trade-off sul cliente. Sono formulazioni diverse dello stesso principio operativo.

Fonti primarie:

- [Microsoft Learn — Azure Application Architecture Fundamentals](https://learn.microsoft.com/en-us/azure/architecture/guide/)
- [Microsoft Learn — Design principles for Azure applications](https://learn.microsoft.com/en-us/azure/architecture/guide/design-principles/)
- [AWS Well-Architected — Evaluate how trade-offs impact customers and architecture efficiency](https://docs.aws.amazon.com/wellarchitected/latest/performance-efficiency-pillar/perf_architecture_evaluate_trade_offs.html)

> **Non scegliere la tecnologia che impressiona di più. Scegli quella che risolve meglio il problema che hai davvero.**
