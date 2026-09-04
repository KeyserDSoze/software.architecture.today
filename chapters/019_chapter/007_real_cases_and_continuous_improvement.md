# 19.7 — Casi reali: proprietà che restano visibili mentre il sistema cambia

Fitness function, ownership metadata e assessment periodici possono sembrare governance astratta finché non vediamo il problema in sistemi reali.

Qui non cerchiamo un'azienda da copiare.

Cerchiamo evidence di un pattern comune:

```text
important property
→ explicit representation
→ repeated feedback
→ change
→ review / correction
```

## GitHub: ownership come metadata vivo

GitHub ha documentato `SERVICEOWNERS`, un sistema con cui porzioni del proprio grande monolite e altri repository vengono associate a servizi e maintainer.

Il dettaglio interessante non è il file YAML.

È la trasformazione di una proprietà organizzativa rilevante — **chi possiede che cosa** — da conoscenza implicita a metadata versionati e interrogabili.

La CI può anche applicare regole, per esempio richiedendo un service owner per i nuovi file.

Quella stessa informazione può sostenere service catalog, on-call routing, SLO e dependency visibility.

Fonti:

- [GitHub Engineering — How we organize and get things done with SERVICEOWNERS](https://github.blog/engineering/architecture-optimization/how-we-organize-and-get-things-done-with-serviceowners/)
- [GitHub Engineering — Building On-Call Culture at GitHub](https://github.blog/engineering/engineering-principles/building-on-call-culture-at-github/)

La lezione non è “usate SERVICEOWNERS”.

È:

> **quando una proprietà organizzativa condiziona affidabilità e cambiamento, renderla versionata riduce la distanza fra organizzazione dichiarata e sistema reale.**

## GitHub: technical debt dentro un prodotto che continua a muoversi

GitHub ha raccontato il lavoro sul technical debt senza immaginare una fase in cui il prodotto smetta di cambiare per essere “ripulito”.

Fonte:

- [GitHub Engineering — Move Fast and Fix Things](https://github.blog/engineering/engineering-principles/move-fast/)

È coerente con i Capitoli 17–18:

```text
understand
→ protect
→ change incrementally
→ verify
→ continue delivery
```

Il debt viene governato dentro l'evoluzione, non rinviato a un futuro in cui tutte le feature saranno finite.

## Microsoft: assessment come ciclo, non certificazione

Azure Well-Architected raccomanda assessment ripetuti e milestone per confrontare il workload nel tempo, soprattutto quando cambiano feature, requirement, technical debt e trade-off.

Fonte:

- [Microsoft Learn — Complete an Azure Well-Architected Review assessment](https://learn.microsoft.com/en-us/azure/well-architected/design-guides/implementing-recommendations)

Il modello mentale è:

```text
baseline
→ change
→ evidence
→ review
→ next baseline
```

non:

```text
architecture review
→ approved forever
```

La guidance Microsoft sul ruolo dell'architect dopo il go-live aggiunge un punto importante: health model, cost model, scaling assumption, performance e design hypothesis devono essere confrontati con il comportamento reale.

Fonte:

- [Microsoft Learn — Support the workload in a consultative role](https://learn.microsoft.com/en-us/azure/well-architected/architect-role/ongoing-support)

La produzione non è la fine dell'architecture work.

È il momento in cui iniziamo a ricevere evidence sulle ipotesi che prima erano soprattutto progettuali.

## Thoughtworks: guided change e automated governance

Thoughtworks collega evolutionary architecture, fitness function e automated governance alla capacità di mantenere caratteristiche architetturali durante cambiamenti incrementali.

Fonti:

- [Thoughtworks — Building Evolutionary Architectures, 2nd Edition](https://www.thoughtworks.com/insights/books/building-evolutionaryarchitectures-second-edition)
- [Thoughtworks — Fitness function-driven development](https://www.thoughtworks.com/en-gb/insights/articles/fitness-function-driven-development)

Il punto utile per noi è che una fitness function non coincide con un unit test.

Può usare:

```text
static structure
runtime metric
security verification
performance threshold
cost evidence
operational drill
```

Il meccanismo segue la proprietà che vogliamo rendere osservabile.

## AWS: autonomia locale, obiettivi condivisi

AWS ha descritto cloud fitness function come strumento per guidare l'evoluzione architetturale e allineare decisioni decentralizzate a obiettivi comuni.

Fonte:

- [AWS Architecture Blog — Using Cloud Fitness Functions to Drive Evolutionary Architecture](https://aws.amazon.com/blogs/architecture/using-cloud-fitness-functions-to-drive-evolutionary-architecture/)

Questo è particolarmente importante per una software house come ESI.

Un architect centrale non può leggere ogni PR di ogni workload.

L'organizzazione deve invece distinguere:

```text
enterprise-wide non-negotiable property
workload-specific property
automatable feedback
team judgment
enterprise escalation
```

L'autonomia diventa più sostenibile quando i confini condivisi non dipendono soltanto dalla memoria.

## I casi non dimostrano un'unica architettura corretta

GitHub ha una propria storia organizzativa.

Azure Well-Architected è guidance di un cloud provider.

Thoughtworks ha formalizzato il concetto di evolutionary architecture.

AWS applica fitness function anche a cloud governance.

Non trasformiamo questa convergenza in una ricetta universale.

Le fonti sostengono però alcuni problemi ricorrenti:

- i sistemi cambiano continuamente;
- ownership e intent possono perdere visibilità;
- proprietà importanti beneficiano di feedback ripetibile;
- automazione e human review hanno ruoli diversi;
- anche la governance deve essere riesaminata.

> **Il caso reale non serve a dire “fate come loro”. Serve a mostrare che mantenere l'intento durante il cambiamento è un costo reale che organizzazioni mature hanno dovuto rendere esplicito.**