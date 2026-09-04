# 20.6 — Complexity cost, people cost e AI cost

Non tutto ciò che costa compare nella cloud bill.

Alcuni dei costi più persistenti vivono nel modo in cui il sistema deve essere capito, modificato e verificato.

## Cognitive load come costo operativo

Ogni tecnologia aggiunta richiede almeno una parte di:

```text
understanding
configuration
security model
failure model
monitoring
upgrade
incident handling
```

Se introduciamo:

```text
Kubernetes
Kafka
Redis
GraphQL
service mesh
workflow engine
```

non stiamo soltanto aggiungendo capability.

Stiamo aggiungendo cose che qualcuno dovrà sapere abbastanza bene da poterle modificare sotto pressione.

Il costo cognitivo non significa che dobbiamo usare sempre tecnologie già note.

Sarebbe l'opposto di **fit before fashion**.

Significa che una nuova tecnologia deve comprare abbastanza valore da giustificare anche il costo di impararla e possederla.

## Team topology e run cost

Alcune architetture hanno un team minimo implicito.

```text
10 deployable indipendenti
+ 1 database per service
+ mesh
+ streaming
+ multi-region
```

possono essere tecnicamente gestibili.

Ma se il team reale è composto da tre persone, il problema non è soltanto organizzativo.

È economico.

Il run cost include il tempo che quelle persone non spendono su altre capability.

> **Ogni capability operativa usa anche budget di attenzione.**

## Coordination cost

Il costo può crescere anche senza aumentare l'infrastruttura.

```text
shared ownership
→ più meeting

unclear API contract
→ più negotiation

coupled deploy
→ più release coordination

unclear data owner
→ più escalation
```

Questi costi sono difficili da misurare, ma possono essere osservati attraverso proxy:

```text
lead time
handoff count
change failure
review latency
incident ownership delay
number of teams required for one change
```

Non dobbiamo monetizzare ogni minuto per riconoscere che esiste una curva.

## Legacy coexistence cost

Operations Desk Classic ci offre un esempio perfetto.

Durante la migrazione ESI paga:

```text
old runtime
+ new runtime
+ old knowledge
+ new knowledge
+ characterization
+ shadow comparison
+ migration review
```

Questo costo è intenzionale.

Compra reversibilità e semantic safety.

Ma se la coexistence non ha una removal condition, può diventare permanente.

A quel punto il premium di migrazione si trasforma in recurring cost.

> **La coesistenza è un investimento soltanto se esiste ancora un percorso credibile verso la rimozione.**

## Cost of verification

Nel software tradizionale possiamo essere tentati di considerare i test un puro costo di engineering.

Nell'era AI la verification diventa ancora più centrale.

Se un agente può produrre rapidamente:

```text
50 file
200 test
3 migration
2 pipeline
```

il costo di generation può essere basso.

Il costo di verification può invece dominare.

Quindi una metrica come:

```text
cost per generated line
```

è praticamente inutile.

Più interessante:

```text
review time per accepted change
verification cost per merged task
rework per AI-generated change
failure rate after acceptance
```

## AI cost: token è un meter, non un outcome

La FinOps Foundation include il **cost per token** fra gli esempi di resource-efficiency unit metric.

Fonte:

- [FinOps Framework — Unit Economics](https://www.finops.org/framework/capabilities/unit-economics/)

È una metrica utile.

Ma resta una metrica di consumo.

Una pipeline agentica può avere:

```text
model A
cost/token basso

but
more retries
more context reload
more failed tasks
more human review
```

mentre:

```text
model B
cost/token più alto

but
fewer retries
higher first-pass acceptance
less human verification
```

Non possiamo concludere quale sia più economico dal solo prezzo per token.

## Cost per useful outcome

Per gli agenti potremmo voler misurare:

```text
cost per accepted issue
cost per verified refactoring
cost per merged PR
cost per incident hypothesis validated
cost per successful support resolution
```

La definizione deve però essere resistente al gaming.

Per esempio:

```text
cost per merged PR
```

può premiare PR minuscole senza valore o spingere a merge rischiosi.

Quindi metriche economiche e quality metric devono essere lette insieme.

## Context cost

Un sistema AI paga anche per il contesto.

```text
repository files
conversation history
retrieved documents
logs
schema
previous agent output
```

Più contesto può migliorare la decisione.

Ma può anche aumentare:

- token;
- latency;
- retrieval complexity;
- privacy exposure;
- stale-context risk.

Quindi **context engineering** ha anche una dimensione economica.

Non vogliamo:

```text
always send everything
```

Vogliamo:

```text
smallest context that preserves decision quality
```

La stessa logica del resto dell'architettura.

## Caching e model routing

Caching può ridurre recurring inference cost, ma introduce domande:

```text
what is cache identity?
what can become stale?
can sensitive output be reused?
how do we invalidate?
```

Model routing può usare modelli differenti per task differenti:

```text
classification
→ smaller model

high-risk architecture decision support
→ stronger model
```

Ma il routing deve essere guidato da quality/risk e outcome, non soltanto dal prezzo.

Questo tema verrà approfondito quando introdurremo AI dentro l'architettura.

Qui ci basta fissare il principio:

> **Ottimizzare inference cost senza misurare task quality può trasformare un costo visibile in rework invisibile.**

## Human cost e deskilling

Esiste anche un costo differito difficile da mettere nel budget: perdere competenza.

Se l'AI esegue sistematicamente:

```text
debugging
migration reasoning
architecture tradeoff
code review
```

senza che il team mantenga capacità di comprenderne il risultato, possiamo ridurre il costo immediato dell'execution e aumentare il costo futuro di recovery e decision making.

È lo stesso rischio discusso nel Capitolo 0.

Il modello economico dell'AI non deve quindi misurare soltanto:

```text
hours saved
```

ma anche:

```text
verification burden
quality
incident impact
knowledge retained
```

## Regola

> **Nell'era AI il costo di produrre può scendere più rapidamente del costo di capire, verificare e possedere ciò che abbiamo prodotto. Il secondo è quello che dobbiamo imparare a modellare.**