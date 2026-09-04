# 20.2 — Cost model, TCO e cost driver

Una fattura è un risultato. Un cost model è una spiegazione.

La fattura ci dice quanto abbiamo speso in un periodo. Il cost model prova a spiegare **perché** quella cifra esiste, quali decisioni la governano e come cambierebbe se cambiasse il workload.

Questa differenza è fondamentale perché l'architettura non può intervenire bene su un numero che non sa decomporre.

Azure Well-Architected descrive il cost model come strumento per stimare initial cost, run rate e ongoing cost, confrontare scenari e rendere esplicite assunzioni e budget. Il valore non è il reporting in sé: è poter prevedere l'effetto economico di una decisione prima che diventi una voce inevitabile della fattura.

Fonte:

- [Microsoft Learn — Architecture strategies for creating a cost model](https://learn.microsoft.com/en-us/azure/well-architected/cost-optimization/cost-model)

## TCO: il prezzo di possedere una decisione

Confrontare due alternative soltanto attraverso le SKU crea una falsa precisione. Una soluzione da 1.500 euro al mese non è necessariamente più economica di una da 2.000 se richiede patching, on-call specializzato, più incidenti, più ambienti, una migrazione fragile e un exit path costoso.

Per questo il TCO deve guardare almeno quattro superfici differenti.

| Superficie | Che cosa include | Domanda architetturale |
|---|---|---|
| Technology run cost | compute, storage, network, managed service, licenze, supporto, telemetry, backup | quanto costa far girare la capability? |
| Engineering change cost | lead time, test environment, review, migration, release coordination, conoscenza specialistica | quanto costa cambiarla? |
| Operational cost | on-call, incident response, capacity, patching, upgrade, recovery drill, remediation | quanto costa tenerla affidabile e operabile? |
| Risk cost | downtime, data loss, security incident, contract/compliance breach, missed opportunity | quale esposizione economica resta se la proprietà fallisce? |

L'ultima riga non deve per forza diventare una cifra fittizia. Anche quando non sappiamo monetizzare un rischio con precisione, dobbiamo evitare di trattarlo come zero.

> **Il TCO è il costo di possedere una decisione, non soltanto il prezzo della risorsa che la implementa.**

## Prima il driver, poi l'ottimizzazione

Una voce costosa non è necessariamente il vero cost driver.

Immaginiamo che compute rappresenti una parte visibile della fattura. Ridurlo del 20% può sembrare un'ottima iniziativa. Ma se la curva complessiva è dominata da telemetry retention, network egress o da una coesistenza legacy che continua da mesi, abbiamo ottimizzato ciò che era facile vedere, non ciò che muoveva il sistema economico.

Un cost driver collega consumo e causa. In Order Operations possiamo già formulare relazioni come queste:

```text
traffic / concurrency
→ application runtime

data + query load + retention
→ PostgreSQL

message volume + tier
→ Service Bus

telemetry volume × retention × cardinality
→ observability

coexistence duration
→ legacy overlap
```

La formula non deve essere perfetta. Deve essere abbastanza buona da farci capire quale decisione sposta davvero la curva.

## Baseline e scenario: il modello deve poter cambiare domanda

Un cost model statico serve poco. Una decisione architetturale è interessante proprio perché il contesto può cambiare.

Per questo il modello dovrebbe poter confrontare la baseline corrente con almeno uno scenario di crescita, un'alternativa architetturale e la fase di transizione. Per ESI potrebbe significare confrontare la topologia single-region corrente con un eventuale multi-region futuro oppure misurare quanto pesa continuare a tenere in vita Operations Desk Classic mentre il target cresce.

Possiamo rappresentare il modello con variabili invece che con prezzi inventati:

```text
MonthlyCost =
    RuntimeBase
  + DatabaseBase
  + MessagingBase
  + ObservabilityUsage
  + BackupStorage
  + NetworkUsage
  + NonProd
  + SharedAllocation
  + MigrationOverlap
```

La formula non pretende di essere una fattura. Serve a rendere visibili le leve.

## Le assunzioni sono parte del modello

Un cost model non è una previsione certa. È un modello decisionale costruito su assunzioni.

Se Product prevede che gli `OperationalCase` crescano del 40% in dodici mesi, quel numero deve essere riconoscibile come forecast, non trasformato silenziosamente in una costante tecnica. Ci interessa sapere la fonte, il livello di confidenza, quali cost driver tocca e quale variazione ci obbligherebbe a ricalcolare la scelta.

Una forma utile è:

```text
Assumption
OperationalCase +40% / 12 months

Source
ESI simulated Product forecast

Confidence
medium

Affected drivers
runtime, database, telemetry

Review trigger
forecast revision materially changes the curve
```

Questo ci protegge dalla falsa accuratezza. Un foglio con due decimali non è più affidabile delle ipotesi che contiene.

> **La precisione del modello non può superare la qualità delle assunzioni.**

## Build vs buy: confrontare ownership, non soltanto prezzo

Il confronto fra managed service e soluzione self-managed è uno dei luoghi in cui il TCO mostra più chiaramente il proprio valore.

La prima opzione compra dal provider una parte di availability, patching, backup, capacity management o operabilità, ma introduce pricing e vincoli vendor. La seconda riduce eventualmente il prezzo del servizio e trasferisce più ownership al team: upgrade, security, monitoring, recovery e incident handling diventano parte del prodotto che stiamo scegliendo di possedere.

Microsoft Well-Architected raccomanda infatti di includere build-vs-buy, billing model, licensing, training e operational expense nelle valutazioni economiche.

Fonte:

- [Microsoft Learn — Cost Optimization design principles](https://learn.microsoft.com/en-us/azure/well-architected/cost-optimization/principles)

La domanda quindi non è “managed o VM?”. È: **quale capability vogliamo possedere direttamente e quanto costa possederla bene per tutta la vita prevista del workload?**

## Il costo della transizione

La modernizzazione aggiunge un costo che scompare facilmente dai confronti: il periodo in cui paghiamo sia la destinazione sia il viaggio.

Nel Capitolo 18 ESI ha scelto characterization, adapter, shadow comparison e dual path perché riducono il rischio semantico. Queste strutture comprano safety ma aumentano temporaneamente runtime, telemetry, engineering e on-call surface.

La FinOps Foundation include esplicitamente transition state e parallel run nelle considerazioni di architecting e workload placement.

Fonte:

- [FinOps — Architecting & Workload Placement](https://www.finops.org/framework/capabilities/architecting-workload-placement/)

Finché Operations Desk Classic resta necessario, Order Operations non sostituisce completamente il costo precedente. In parte lo somma.

> **Una migrazione costa anche il tempo in cui dobbiamo vivere in due posti.**

Questo rende l'exit condition una proprietà economica oltre che tecnica. La coesistenza è un investimento soltanto finché esiste un percorso credibile verso il momento in cui il premium temporaneo può essere rimosso.

## Il Cost Model minimo di ESI

Il documento che costruiamo nel capstone non sarà un business plan da cento pagine. Deve però permettere a Product, Engineering e Finance di discutere lo stesso sistema con lo stesso linguaggio.

Per ogni superficie importante vogliamo poter riconoscere scope e business outcome, cost owner e Finance counterpart, categorie dirette e condivise, driver, forma del costo, unit metric, assunzioni, premium architetturali, optimization hypothesis, quality risk ed evidence necessaria per una review.

Se un'informazione non esiste ancora, il modello deve mostrarlo. `Azure billing data = Pending` è più utile di una cifra inventata.

Il Cost Model non elimina l'incertezza. La rende negoziabile.

> **Prima di chiedere “dove tagliamo?”, dobbiamo sapere quale decisione stiamo pagando e quale parte della curva quella decisione controlla.**