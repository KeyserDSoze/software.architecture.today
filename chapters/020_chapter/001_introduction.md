# Capitolo 20 — Costi e decisioni

Un sistema può essere tecnicamente elegante, affidabile e sicuro e restare comunque una cattiva decisione perché il costo delle sue qualità supera il valore che il prodotto riesce a produrre.

Può accadere anche il contrario: possiamo abbassare una fattura e peggiorare l'architettura perché, nel farlo, abbiamo eliminato proprio la proprietà che rendeva il sistema utilizzabile.

Per questo la domanda economica più utile non è semplicemente:

> **Quanto costa questa architettura?**

È:

> **Quale proprietà stiamo comprando con questo costo, quale valore protegge e per quanto tempo ha ancora senso pagarla?**

Nel corso del libro ESI ha già comprato molte proprietà. Service Bus Premium non è comparso perché “enterprise”: serve alla direzione di private data plane scelta nel Threat Model. Più istanze e zone resilience non sono un simbolo di maturità: comprano una certa tolleranza ai failure intra-region. Telemetry, tracing e retention comprano capacità di misurare SLI e spiegare incidenti. La coesistenza con Operations Desk Classic compra reversibilità e tempo per capire il legacy prima di spegnerlo.

Questi costi non sono incidenti separati dalle decisioni architetturali. **Sono una delle loro conseguenze.**

## Cost optimization non significa lowest cost

Azure Well-Architected formula il principio in modo netto: un workload cost-optimized non è necessariamente un workload a basso costo. La spesa va bilanciata con requisiti funzionali e non funzionali e con il valore che il workload deve produrre.

Fonte:

- [Microsoft Learn — Cost Optimization design principles](https://learn.microsoft.com/en-us/azure/well-architected/cost-optimization/principles)

La distinzione ci impedisce di ragionare per slogan. Ridondanza non significa automaticamente spreco; è spreco quando non sappiamo quale scenario di failure giustifica quella capacità. Un managed service può avere un prezzo unitario superiore e un TCO inferiore se evita ownership operativa che il team non vuole o non può sostenere. Un monolite può essere economico sul piano infrastrutturale e costoso se ogni modifica richiede coordinamento fra troppi domini; un sistema distribuito può scalare il traffico e contemporaneamente moltiplicare deployable, pipeline, dashboard, certificati, failure mode e competenze da mantenere.

> **Il costo architetturale è il prezzo complessivo delle proprietà che scegliamo di possedere.**

## La fattura cloud è evidence, non il modello completo

La cloud bill ci dice una parte importante della verità: quanto abbiamo pagato al provider. Non ci dice, da sola, quanto costa possedere il sistema.

Il Total Cost of Ownership include infatti il run cost tecnologico, ma anche supporto, licenze, ambienti non-production, engineering time, on-call, incident response, security verification, recovery drill, migrazioni, training, platform work e cognitive load. Microsoft raccomanda che il cost model consideri costi diretti e indiretti e venga mantenuto nel tempo invece di essere trattato come un foglio prodotto una volta sola.

Fonte:

- [Microsoft Learn — Architecture strategies for creating a cost model](https://learn.microsoft.com/en-us/azure/well-architected/cost-optimization/cost-model)

Questo cambia la lettura di molte “ottimizzazioni”. Una tecnologia open source con licenza zero può essere costosa se richiede competenze rare, patching continuo e un nuovo on-call surface. Una piattaforma managed può sembrare più cara finché confrontiamo soltanto le SKU, poi diventare conveniente quando includiamo upgrade, recovery, security e capacity management.

Il costo che non compare subito in fattura è spesso quello più facile da ignorare. Un ownership boundary poco chiaro non produce una riga di billing oggi, ma aumenta il costo di ogni change futuro. Una recovery strategy mai provata non costa molto finché non arriva il disaster. Una migrazione senza exit condition può trasformare il dual run da investimento temporaneo a recurring cost permanente.

> **La fattura della complessità arriva spesso quando abbiamo meno possibilità di negoziarla.**

## Il costo ha una forma

Per governare la spesa dobbiamo capire come reagisce al cambiamento del workload.

Un costo **fixed** resta presente anche a basso utilizzo: la baseline minima di un runtime, un tier managed o una capability operativa che richiede comunque ownership. Un costo **variable** cresce con uso, volume o tempo: messaggi, storage, egress, telemetry, request o, più avanti, token e inference. Un costo **step** resta relativamente stabile finché attraversiamo una soglia che impone un nuovo gradino di capacità o complessità: una replica, un tier superiore, una nuova region o un team operativo aggiuntivo.

Queste forme contano perché un'architettura può sembrare economica finché non attraversa il punto in cui la curva cambia. Il nostro compito non è prevedere ogni euro con precisione impossibile. È riconoscere le variabili che rendono una decisione economicamente diversa quando cambiano traffico, retention, topology, ownership o requirement.

## Il costo deve avere un owner e un significato

La FinOps Foundation tratta ownership della technology usage, allocation, architecting, workload placement e unit economics come capability collaborative fra Engineering, Product e Finance/FinOps.

Fonti:

- [FinOps Framework](https://www.finops.org/framework/)
- [FinOps — Architecting & Workload Placement](https://www.finops.org/framework/capabilities/architecting-workload-placement/)

Non significa trasformare Finance nel gatekeeper delle singole risorse. Significa fare in modo che qualcuno sappia rispondere a domande come: quale voce guida davvero la curva? quale premium compra una proprietà importante? quale spesa cresce con il business e quale cresce senza produrre outcome? quanto costa continuare a vivere contemporaneamente nel legacy e nel target?

Un costo senza owner è difficile da governare. Un costo senza proprietà comprata è ancora più sospetto.

## Il problema ESI

Order Operations ha ormai una cost surface reale sul piano architetturale, anche se non abbiamo billing production da fingere. La direzione include runtime applicativo, PostgreSQL gestito, Service Bus Premium, private connectivity, identity, backup, observability, ambienti di test e la coesistenza con Operations Desk Classic.

Finance chiede prevedibilità e riduzione del run rate. Security non vuole che una voce Premium venga eliminata ignorando il threat che la giustificava. Reliability non vuole che la capacità necessaria per failure headroom venga classificata come “idle”. Operations non vuole risparmiare telemetry al punto da perdere la capacità di diagnosticare il sistema. Commerce & Operations, allo stesso tempo, non vuole costruire una piattaforma sovradimensionata per una console interna.

Il compromesso del capitolo non sarà quindi “tagliare il 20%”. Sarà costruire un modello che renda visibile il legame fra **costo, driver, proprietà, owner, unità di valore ed evidence**.

Il quality floor resta quello già deciso: correctness, tenant isolation, security boundary, reliability richiesta, recoverability e minimum operability. Se una proposta di risparmio modifica una di queste proprietà, non è più una semplice ottimizzazione di prezzo: è una decisione architetturale e deve riaprire l'artefatto che aveva giustificato quella qualità.

## Cost per resource e cost per outcome

Il prezzo per risorsa resta utile. Ci serve per capire se consumiamo bene compute, storage, message, telemetry o, in futuro, token. Ma l'economia del prodotto emerge soltanto quando colleghiamo quel consumo a una unità di valore.

La FinOps Foundation distingue infatti metriche di resource efficiency da business unit metric, come costo per transazione, tenant o servizio erogato.

Fonte:

- [FinOps Framework — Unit Economics](https://www.finops.org/framework/capabilities/unit-economics/)

Per Order Operations questo significa che un aumento del costo mensile non è automaticamente negativo: potrebbe accompagnare più `OperationalCase` gestiti o più `Payment Escalation` consegnate. Viceversa, una riduzione della spesa non è automaticamente un successo se contemporaneamente peggiorano delivery SLI, recovery o capacità investigativa.

Questa stessa logica ci servirà nella parte AI-native del libro. `cost per token` sarà una misura tecnica; il confronto economico più interessante potrà diventare `cost per accepted task` o `cost per useful outcome`, sempre letto insieme alla qualità.

## La domanda del capitolo

Il Capitolo 20 non insegna a comprare cloud più economico. Insegna a rendere economica una decisione senza separarla dalle proprietà che la rendono valida.

La domanda guida sarà:

> **Quale proprietà stiamo pagando, quale valore o rischio la giustifica, quale driver ne determina il costo e quale evidence ci autorizza a ottimizzarla senza distruggerla?**

> **Spendere meno non è un outcome architetturale. Ottenere il valore necessario con un costo sostenibile lo è.**