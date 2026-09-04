# Capitolo 18 — Refactoring nell'era dell'AI

Nel Capitolo 17 abbiamo resistito alla tentazione di cambiare subito Operations Desk Classic.

Abbiamo prima costruito una baseline: behavior osservati, claim con provenance, unknown espliciti e un candidate seam.

Ora possiamo iniziare a trasformare il sistema.

È qui che l'AI rende il refactoring contemporaneamente più potente e più pericoloso.

Un agente può oggi rinominare migliaia di simboli, migrare call site, creare adapter, aggiornare framework, generare migration e produrre in minuti un diff che un team avrebbe costruito in settimane.

La capacità di execution è aumentata.

Il rischio semantico non è diminuito automaticamente.

> **L'AI può rendere enorme il diff. Il nostro lavoro è rendere piccolo il rischio.**

## Refactoring e modernization non sono la stessa cosa

Nel senso classico, refactoring significa cambiare la struttura interna preservando il comportamento osservabile.

In una modernization enterprise incontriamo però spesso una sequenza più ampia:

```text
internal refactor
+ new boundary
+ adapter
+ intentional behavior change
+ state migration
+ rollout
+ legacy removal
```

Non tutto questo è refactoring puro.

Per questo nel capitolo distingueremo sempre fra:

```text
behavior preserved
behavior changed intentionally
contract changed
state migrated
ownership moved
compatibility removed
```

La disciplina comune è una sola:

> **rendere deliberato ogni cambiamento di significato e verificabile ogni promessa di preservazione.**

## Il rischio non vive nelle linee modificate

Un diff di ventimila righe può essere relativamente sicuro se applica una trasformazione meccanica deterministica con ottima verification.

Tre righe possono essere catastrofiche se cambiano authorization, precedence di una business rule, retry semantics o ownership di un dato.

Non useremo quindi:

```text
lines changed
```

come proxy della pericolosità.

Ragioneremo piuttosto su:

```text
semantic surface
× blast radius
× irreversibility
× uncertainty
÷ evidence quality
```

Non è una formula matematica.

È un modo per ricordare che il rischio nasce dal significato del cambiamento, non dal peso del diff.

## Dal Legacy Understanding Map al Safety Envelope

Prima di toccare una capability dobbiamo poter rispondere almeno a queste domande:

```text
che cosa stiamo cambiando?
quali behavior devono restare uguali?
quali differenze sono intenzionali?
quali consumer possono essere colpiti?
quale stato viene letto o scritto?
come osserviamo il candidate?
quando fermiamo il rollout?
come torniamo indietro?
qual è il primo one-way door?
```

Queste risposte formano la **safety envelope** della trasformazione.

L'artefatto persistente del capitolo sarà il **Refactoring Safety Plan**.

Non serve a rallentare il lavoro.

Serve a permettere di accelerarlo senza rendere impliciti i rischi.

## Più execution disponibile dovrebbe produrre batch più piccoli

Microsoft Azure Well-Architected raccomanda safe deployment practice incrementali e osserva che cambiamenti piccoli e frequenti sono generalmente più semplici da diagnosticare e recuperare rispetto a grandi release infrequenti.

Fonte:

- [Microsoft Learn — Architecture strategies for safe deployment practices](https://learn.microsoft.com/azure/well-architected/operational-excellence/safe-deployments)

Questa raccomandazione diventa ancora più importante quando gli agenti abbassano il costo del cambiamento.

Se possiamo modificare cento file in pochi minuti, non segue che dovremmo modificare cento file nello stesso step.

Segue piuttosto che possiamo permetterci di introdurre:

```text
seam
→ adapter
→ candidate inactive
→ shadow comparison
→ controlled routing
→ legacy cleanup
```

con incrementi molto più piccoli di quanto fosse economicamente conveniente prima.

> **La velocità dell'AI dovrebbe ridurre la dimensione del rischio che dobbiamo accettare per ogni passo, non aumentarla.**

## Rollback è una famiglia di problemi

Una parola crea molta confusione: `rollback`.

Durante una modernization dobbiamo distinguere almeno:

```text
Deployment rollback
→ tornare all'artifact precedente

Behavior fallback
→ mantenere il deploy ma tornare al path legacy

Configuration rollback
→ ripristinare una configurazione precedente

Data rollback
→ ripristinare o compensare stato persistente

Contract rollback
→ tornare a una versione precedente quando consumer/provider lo consentono
```

Una feature flag può rendere facilissimo il behavior fallback e non fare nulla per una migration dati irreversibile.

Un artifact rollback può fallire perché il vecchio codice non comprende più lo schema nuovo.

La regola è:

> **reversibile nel codice non significa reversibile nel sistema.**

## Il punto di non ritorno deve essere esplicito

Le prime fasi di una migrazione possono essere molto reversibili:

```text
candidate inactive
shadow mode
small cohort
```

La reversibilità scende quando:

```text
candidate becomes authoritative writer
legacy consumer is removed
old schema is dropped
historical provenance is destroyed
```

Il Refactoring Safety Plan deve rendere visibile il **point of no return**.

Non per vietarlo.

Per sapere quando una trasformazione passa da two-way door a one-way door e richiede un livello diverso di evidence e approval.

## ESI: finalmente decidiamo quali behavior meritano di sopravvivere

Nel Capitolo 17 abbiamo osservato sei behavior della priority routing legacy.

Ora ESI svolge un workshop simulato con Operations, Product, Payments & Risk, Sales e Order Operations.

Il risultato non sarà “copiamo il codice”.

Sarà una classificazione semantica.

Alcuni behavior vengono confermati come necessari.

Uno — la vecchia regola Enterprise dopo 30 minuti — viene deliberatamente rimosso.

Questo introduce una distinzione fondamentale per tutto il capitolo:

```text
regression
≠
intentional difference
```

La nuova policy non deve raggiungere zero mismatch con il legacy.

Deve preservare i behavior confermati e produrre **esattamente** le differenze deliberate.

## Il compromesso ESI

**Esigenza:** trasferire la priority routing da Operations Desk Classic a Order Operations e ridurre il legacy footprint.

**Tensione:** retirement speed contro semantic safety, coexistence cost e desiderio di semplificare regole storiche.

**Decisione:** classificazione esplicita dei behavior, seam `PriorityPolicy`, `LegacyPriorityAdapter`, nuova `ConfirmedPriorityPolicy`, shadow comparison e cutover separato dalla rimozione del legacy.

**Costo accettato:** per un periodo esistono due implementazioni e una struttura temporanea di routing/comparison.

**Quality floor:** nessuna silent regression sui behavior confermati; differenze intenzionali registrate prima del rollout; tenant/security invarianti preservati; nessuna migration dati nel primo slice; fallback disponibile finché non attraversiamo un one-way door dichiarato.

**Guardrail:** characterization suite, Priority Functional Analysis, Refactoring Safety Plan, small batch, Expected Difference Registry, shadow comparison, stop condition e cleanup obbligatorio della migration architecture.

## La domanda del capitolo

Non è:

> Come facciamo a riscrivere più velocemente?

È:

> **Come usiamo una capacità di trasformazione molto più alta mantenendo ogni passo abbastanza piccolo, osservabile e reversibile da meritare il passo successivo?**