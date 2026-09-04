# 19.7 — Casi reali: evolvere senza perdere controllo

Le fitness function e la governance leggera possono sembrare concetti astratti finché non vediamo come organizzazioni reali affrontano problemi simili.

Qui non cerchiamo aziende da imitare.

Cerchiamo evidenze su proprietà ricorrenti:

- ownership che deve restare visibile;
- architettura che cambia nel tempo;
- feedback continuo;
- governance automatizzata quando possibile;
- review umana quando cambia il contesto.

## GitHub: SERVICEOWNERS e architettura come metadata vivo

GitHub ha documentato l'uso di `SERVICEOWNERS` per collegare porzioni del proprio grande monolite e altri repository a servizi e maintainer.

Il punto interessante non è il file YAML in sé.

È che l'organizzazione ha trasformato una proprietà architetturale — **chi mantiene che cosa** — in metadata versionati e interrogabili.

La CI applica anche regole, per esempio richiedendo che i nuovi file abbiano un service owner.

Questo permette di usare il service catalog per:

- ownership;
- on-call routing;
- SLO;
- relationship tra servizi;
- onboarding;
- dependency visibility.

Riferimenti:

- [GitHub Engineering — How we organize and get things done with SERVICEOWNERS](https://github.blog/engineering/architecture-optimization/how-we-organize-and-get-things-done-with-serviceowners/)
- [GitHub Engineering — Building On-Call Culture at GitHub](https://github.blog/engineering/engineering-principles/building-on-call-culture-at-github/)

La lezione non è:

> create un SERVICEOWNERS file.

È:

> **quando una proprietà organizzativa è architetturalmente importante, renderla versionata e verificabile riduce la distanza fra diagramma organizzativo e sistema reale.**

## GitHub: technical debt senza fermare il prodotto

GitHub ha anche raccontato nel tempo il proprio lavoro sul technical debt dentro una codebase che continuava a evolvere rapidamente.

Questo è importante perché il debt non viene trattato come una fase separata in cui il prodotto smette di cambiare.

La capacità da costruire è intervenire in sistemi attivi, riducendo rischio e mantenendo delivery.

Riferimento:

- [GitHub Engineering — Move Fast and Fix Things](https://github.blog/engineering/engineering-principles/move-fast/)

È coerente con quanto abbiamo visto nei Capitoli 17 e 18:

```text
understand
→ protect
→ change incrementally
→ verify
→ continue delivery
```

## Microsoft: workload assessment come ciclo

Azure Well-Architected Framework non tratta la review architetturale come evento unico.

Per workload brownfield raccomanda assessment ripetuti e milestone che consentano di confrontare lo stato del workload nel tempo.

Il workload cambia per:

- nuova funzionalità;
- technical debt aggiunto o eliminato;
- trade-off;
- cambiamento dei requirement.

Riferimento:

- [Microsoft Learn — Complete an Azure Well-Architected Review assessment](https://learn.microsoft.com/en-us/azure/well-architected/design-guides/implementing-recommendations)

Il valore per noi è il modello mentale:

```text
baseline
→ change
→ measure
→ review
→ next baseline
```

Non:

```text
architecture review
→ approved forever
```

## Microsoft: architect dopo il go-live

La guidance Microsoft sul ruolo dell'architect dopo il go-live è ancora più interessante.

Suggerisce di verificare se le ipotesi iniziali corrispondono al comportamento reale:

- health model;
- cost model;
- scaling assumptions;
- performance;
- nuove capability tecnologiche;
- technical debt;
- drift dai principi iniziali.

Riferimento:

- [Microsoft Learn — Support the workload in a consultative role](https://learn.microsoft.com/en-us/azure/well-architected/architect-role/ongoing-support)

Questo supporta una tesi fondamentale del libro:

> **l'architettura non termina quando il sistema entra in produzione. In produzione iniziamo finalmente a ricevere evidence sulle ipotesi architetturali.**

## Thoughtworks: fitness function e automated governance

Thoughtworks definisce l'evolutionary architecture attraverso guided incremental change e usa le fitness function per proteggere architectural characteristic nel tempo.

La seconda edizione di *Building Evolutionary Architectures* enfatizza anche l'automated governance.

Riferimenti:

- [Thoughtworks — Building Evolutionary Architectures, 2nd Edition](https://www.thoughtworks.com/insights/books/building-evolutionaryarchitectures-second-edition)
- [Thoughtworks — Fitness function-driven development](https://www.thoughtworks.com/en-gb/insights/articles/fitness-function-driven-development)

La cosa importante è che fitness function non significa soltanto unit test.

Può essere:

```text
static structure
runtime metric
security verification
performance threshold
cost measure
operational drill
```

Il meccanismo segue la proprietà.

## AWS: autonomia e obiettivi comuni

AWS ha descritto le cloud fitness function come strumento per guidare l'evoluzione dell'architettura e allineare decisioni decentralizzate con obiettivi più ampi.

Riferimento:

- [AWS Architecture Blog — Using Cloud Fitness Functions to Drive Evolutionary Architecture](https://aws.amazon.com/blogs/architecture/using-cloud-fitness-functions-to-drive-evolutionary-architecture/)

Questo è particolarmente rilevante per ESI.

Una super software house non può avere un architect centrale che legge ogni PR di ogni prodotto.

Deve invece decidere:

```text
which properties are enterprise-wide
which are workload-specific
which can be automated
which require escalation
```

## Non trasformiamo i casi in prova universale

GitHub ha una storia organizzativa specifica.

Azure Well-Architected è guidance di un cloud provider.

Thoughtworks ha sviluppato il concetto di evolutionary architecture.

AWS applica fitness function al cloud.

Non useremo nessuna di queste fonti per dire:

> questa è l'unica struttura corretta.

Le usiamo perché mostrano convergenza su alcuni principi:

1. il sistema cambia continuamente;
2. ownership e intent devono restare visibili;
3. le proprietà importanti beneficiano di feedback ripetibile;
4. automazione e review umana hanno ruoli diversi;
5. la governance deve evolvere insieme al workload.

> **Un caso reale non serve a trasformare una pratica in dogma. Serve a mostrare che il problema esiste anche fuori dal nostro esempio fittizio e che organizzazioni competenti hanno dovuto pagare per risolverlo.**
