# 20.3 — Unit economics: collegare costo e valore

Dire che un workload costa di più non ci dice ancora se la sua economia sta peggiorando.

Se il numero di casi gestiti raddoppia e il costo cresce del 30%, potremmo stare diventando più efficienti. Se il volume resta stabile e la spesa raddoppia, abbiamo invece una domanda urgente da spiegare.

Per questo il costo assoluto è spesso soltanto il punto di partenza. La FinOps Foundation usa il concetto di **unit economics** proprio per collegare technology spend e valore prodotto.

Fonti:

- [FinOps Framework — Unit Economics](https://www.finops.org/framework/capabilities/unit-economics/)
- [FinOps — Introduction to Cloud Unit Economics](https://www.finops.org/wg/introduction-cloud-unit-economics/)

## Resource unit e business unit rispondono a domande diverse

Una metrica tecnica può misurare `cost per GB`, `cost per million messages`, `cost per build minute` o, più avanti, `cost per token`. Queste unità sono preziose perché ci mostrano quanto efficientemente stiamo consumando una risorsa e spesso sono direttamente influenzabili dagli engineer.

Ma non ci dicono necessariamente se quella risorsa sta producendo valore.

Per questo dobbiamo affiancare unità più vicine al business: `cost per tenant`, `cost per OperationalCase handled`, `cost per Payment Escalation delivered` o `cost per successful critical journey`.

La FinOps Foundation distingue infatti resource-efficiency unit metric e business unit metric.

> **Il costo per risorsa ci dice quanto bene consumiamo tecnologia. Il costo per outcome ci dice se quella tecnologia sta ancora servendo il prodotto.**

Le due viste non competono. Si spiegano a vicenda. Se `cost per OperationalCase` cresce, la metrica tecnica può aiutarci a capire se il problema viene da database, telemetry, message volume o capacity. Se `cost per GB` migliora ma `cost per case` peggiora, forse abbiamo ottimizzato una risorsa che non era il vero driver del valore.

## Una unit metric può mentire senza essere falsa

Le metriche economiche creano incentivi. Per questo vanno progettate con la stessa attenzione con cui progettiamo una fitness function.

`cost per API request` può diminuire mentre il sistema diventa più chatty e usa più request per completare lo stesso journey. `cost per ticket closed` può migliorare mentre la qualità della risoluzione peggiora. `cost per merged PR`, in un workflow agentico futuro, potrebbe premiare una proliferazione di PR minuscole o merge troppo facili.

La metrica non è matematicamente sbagliata. È semanticamente incompleta.

Una buona unit metric deve quindi dichiarare quale outcome rappresenta, quali comportamenti indesiderati potrebbe incentivare e con quale quality metric va letta.

Per Order Operations, per esempio:

```text
UM-02
cost per Payment Escalation delivered

read with
Payment Escalation publication SLI
```

Se il costo scende ma la quota consegnata entro cinque minuti degrada, non possiamo dichiarare automaticamente un miglioramento.

## Allocation: prima di attribuire valore dobbiamo attribuire il costo

La unit economics diventa fragile se non sappiamo a chi appartiene la spesa.

La FinOps Foundation definisce **Allocation** come la pratica di assegnare cost e usage attraverso account, tag, label e metadata per creare accountability fra team, prodotti e business unit.

Fonte:

- [FinOps Framework — Allocation](https://framework.finops.org/framework/capabilities/allocation/)

Azure Cost Management supporta analogamente hierarchy, tag e allocation rule per rendere visibili o distribuire costi di workload e servizi condivisi.

Fonte:

- [Microsoft Learn — Introduction to cost allocation](https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/cost-allocation-introduction)

Per ESI questo significa distinguere almeno il costo dedicato di Order Operations dai costi condivisi di networking, identity, security tooling, platform e observability. Se attribuiamo tutto al team prodotto possiamo far sembrare costoso un workload che usa correttamente una capability enterprise. Se non attribuiamo nulla, invece, il team perde ogni feedback economico sulle proprie decisioni.

L'obiettivo non è trovare una formula moralmente perfetta. È evitare che il costo diventi anonimo.

## Showback e chargeback sono meccanismi, non principi

Con **showback** mostriamo al team il costo attribuito senza necessariamente spostare budget interni. Con **chargeback** la spesa viene invece trasferita formalmente a un cost center o a una business unit.

Il secondo può aumentare accountability, ma può anche creare comportamenti perversi se la regola di allocazione è cattiva. Un team potrebbe evitare una capability centrale più sicura soltanto perché il chargeback la rende apparentemente più cara del workaround locale.

Per questo allocation e architecture governance devono parlarsi. Il meccanismo finanziario non deve incentivare la violazione di una proprietà che l'organizzazione considera importante.

## Shared cost non significa costo senza significato

Landing zone, network enterprise, identity platform, CI foundation, security scanner e logging centralizzato sono esempi di costi che possono restare condivisi per scelta.

Possiamo distribuirli per usage, usare un proxy, dividerli in quote o mantenerli centralizzati. La FinOps Foundation osserva che organizzazioni diverse adottano strategie differenti a seconda del tipo di shared cost.

Il punto è dichiarare la scelta e il suo significato.

> **Un shared cost può restare centralizzato. Non deve restare invisibile.**

## Ownership economica vicino all'IaC

Se l'ownership operativa nasce insieme alla risorsa, ha senso rendere disponibile nello stesso punto anche una parte dell'ownership economica.

Per Order Operations la direzione è mantenere metadata come:

```text
workload = order-operations
environment = <dev|staging|prod>
owner = commerce-operations
businessUnit = commerce-operations
product = order-operations
```

`cost-center` non viene inventato nel libro. Appartiene a un mapping Finance reale o esplicitamente simulato.

Questa scelta è deliberata: preferiamo un'informazione mancante ma onesta a un codice fittizio che, entrando nell'IaC, inizierebbe a sembrare evidence reale.

## Le prime unit metric di ESI

Order Operations non dispone ancora di billing production. Quindi il Capitolo 20 può **progettare** le unità, non dichiarare di averle misurate.

Le prime tre sono sufficienti per collegare le principali superfici di costo al lavoro del prodotto:

| ID | Unit metric | Perché esiste | Quality pair | Stato |
|---|---|---|---|---|
| UM-01 | cost per `OperationalCase` handled | collega run cost e volume operativo | outcome/handling quality | Designed / not measured |
| UM-02 | cost per `Payment Escalation` delivered | rende visibile il costo della capability async | publication SLI | Designed / not measured |
| UM-03 | observability cost per 1.000 critical journeys | intercetta telemetry che cresce più del bisogno | diagnostic coverage / SLI evidence | Designed / not measured |

Questa tabella contiene già una parte importante della disciplina: **la metrica economica non viaggia da sola**.

Quando i dati production arriveranno potremo sostituire assunzioni con evidence, confrontare periodi e aggiornare la baseline. Fino ad allora non useremo numeri simulati come se fossero consuntivi.

## Il costo diventa governabile quando ha tre legami

Una spesa significativa deve poter essere collegata a un owner, a un driver e a una unità di valore. Se manca uno dei tre, il sistema economico diventa più difficile da spiegare.

Un owner senza driver può soltanto ricevere una fattura. Un driver senza unità di valore può ottimizzare consumo senza sapere se sta migliorando il prodotto. Una unit metric senza buona allocation può attribuire il costo al soggetto sbagliato.

> **Unit economics non significa trasformare ogni decisione in denaro. Significa impedire che costo e valore continuino a vivere in conversazioni separate.**