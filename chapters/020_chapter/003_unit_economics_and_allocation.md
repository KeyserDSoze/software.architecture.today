# 20.3 — Unit economics: collegare costo e valore

Dire che un workload costa di più non ci dice ancora se sta andando peggio.

Se il traffico raddoppia, i clienti raddoppiano e il costo cresce del 30%, potremmo stare migliorando.

Se il traffico resta fermo e il costo raddoppia, probabilmente abbiamo una domanda da fare.

Per questo il costo assoluto è spesso una metrica insufficiente.

La FinOps Foundation usa il concetto di **unit economics** per collegare la spesa tecnologica al valore prodotto.

Fonti:

- [FinOps Framework — Unit Economics](https://www.finops.org/framework/capabilities/unit-economics/)
- [FinOps — Introduction to Cloud Unit Economics](https://www.finops.org/wg/introduction-cloud-unit-economics/)

## Resource unit vs business unit

Possiamo misurare unità tecniche:

```text
cost per GB
cost per vCPU-hour
cost per million messages
cost per token
cost per build minute
```

Sono utili perché gli engineer possono controllarle direttamente.

Ma non sempre raccontano il valore.

Per questo servono anche unità di business:

```text
cost per tenant
cost per order
cost per operational case resolved
cost per Payment Escalation delivered
cost per active operator
cost per successful business journey
```

La FinOps Foundation distingue proprio resource-efficiency unit metric e business unit metric, e suggerisce di usare le seconde per collegare tecnologia e outcome.

> **Il costo per risorsa ci dice quanto efficientemente consumiamo tecnologia. Il costo per outcome ci dice se quella tecnologia sta ancora servendo il business.**

## Scegliere una unità che non mente

Una unit metric può creare incentivi sbagliati.

Esempio:

```text
cost per API request
```

potrebbe migliorare se introduciamo un'API molto chatty che produce più request per lo stesso journey.

Oppure:

```text
cost per ticket chiuso
```

potrebbe sembrare ottimo se stiamo semplicemente chiudendo ticket più velocemente senza risolvere il problema.

La unità deve quindi essere legata a un outcome sufficientemente stabile.

Per Order Operations possiamo considerare:

```text
cost per active tenant
cost per OperationalCase gestito
cost per Payment Escalation delivered
cost per critical operator journey successful
```

Non tutte devono essere KPI.

Alcune possono essere diagnostiche.

## Unit cost e qualità

Un costo per unità va sempre letto insieme alla qualità.

```text
cost per escalation
↓ 25%
```

non è un miglioramento se contemporaneamente:

```text
delivery <= 5m
scende dal 99% al 92%
```

Lo stesso vale per AI:

```text
cost per token
```

è una misura tecnica.

Ma una decisione di model routing potrebbe dover guardare:

```text
cost per task accepted
cost per verified change
cost per successful support resolution
```

perché un modello economico che produce più rework può peggiorare l'economia complessiva.

## Allocation: costo senza owner è rumore

Prima di misurare unit economics dobbiamo sapere a chi appartiene la spesa.

La FinOps Foundation definisce **Allocation** come la pratica di assegnare cost e usage attraverso account, tag, label e metadata per creare accountability fra team e progetti.

Fonte:

- [FinOps Framework — Allocation](https://framework.finops.org/framework/capabilities/allocation/)

Azure Cost Management supporta analogamente hierarchy, tag e allocation rule per distribuire o rendere visibili i costi di workload e servizi condivisi.

Fonte:

- [Microsoft Learn — Introduction to cost allocation](https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/cost-allocation-introduction)

Per ESI questo significa distinguere almeno:

```text
Order Operations dedicated cost
Platform shared cost
Security shared tooling
Central observability
Enterprise networking
Shared identity
```

Se carichiamo tutto sul team prodotto, possiamo fargli sembrare costoso un workload che usa correttamente capability enterprise condivise.

Se non attribuiamo nulla, invece, il team non vede il costo delle proprie decisioni.

## Showback e chargeback

Due modelli utili:

### Showback

Mostriamo il costo al team responsabile.

Non spostiamo necessariamente budget o fatture interne.

Serve per visibility e decision making.

### Chargeback

Attribuiamo formalmente il costo al cost center o business unit.

Può creare accountability più forte, ma anche incentivi pericolosi se la regola di allocazione è cattiva.

Per esempio, un team potrebbe evitare una capability centralizzata più sicura soltanto perché il chargeback la rende apparentemente più costosa del workaround locale.

Per questo allocation e architecture governance devono parlarsi.

## Shared cost non significa costo invisibile

Alcuni costi sono realmente condivisi:

```text
landing zone
central logging
enterprise network
identity platform
CI foundation
security scanner
```

Possiamo:

- lasciarli centralizzati;
- distribuirli in parti uguali;
- distribuirli per usage;
- usare un proxy metric;
- usare una combinazione.

La FinOps Foundation osserva che non esiste necessariamente una sola strategia: alcune organizzazioni allocano alcuni costi e mantengono altri centralizzati in modo intenzionale.

Il punto importante è che la scelta sia esplicita.

> **Un shared cost può restare centralizzato. Non deve restare senza significato.**

## Cost allocation metadata come parte dell'IaC

Quando possibile, l'ownership economica dovrebbe nascere insieme alla risorsa.

```text
resource
+ workload
+ environment
+ owner
+ cost-center
+ product
```

Non per trasformare ogni tag in governance burocratica.

Per evitare mesi di reverse engineering della fattura.

Azure consente di usare tag e policy per aumentare la coverage dell'allocazione.

Questo suggerisce una buona regola:

> **Se possiamo dichiarare l'ownership operativa nell'IaC, spesso possiamo dichiarare anche l'ownership economica.**

## ESI: unit metric corrente

Per Order Operations non abbiamo ancora real billing data.

Quindi non inventiamo valori.

Definiamo però già le unità che vogliamo poter misurare:

```text
Business unit metric candidate
= monthly cost per OperationalCase handled

Integration unit metric candidate
= cost per Payment Escalation delivered

Resource metric candidate
= telemetry cost per 1,000 critical journeys
```

Stato:

```text
Designed
not measured
not benchmarked
```

Questa è una distinzione importante.

Definire una metrica prima di avere dati non significa fingere di averla misurata.

## Regola

> **Il costo diventa governabile quando possiamo collegarlo a un owner, a un driver e a una unità di valore.**