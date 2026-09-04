# 17.5 — Modernizzare senza trasformare la riscrittura in una scommessa

Quando il legacy fa male, la frase più seducente è spesso:

> Rifacciamolo bene da zero.

A volte è la scelta corretta.

Molto spesso è una decisione che confonde la complessità del codice con la complessità del sistema.

## Una rewrite elimina codice, non conoscenza necessaria

Riscrivere può eliminare classi, framework e dipendenze obsolete.

Non elimina automaticamente:

```text
business rules
compatibility
historical data
integrations
edge cases
compliance
workload
users
cutover
recovery
operational knowledge
```

Se questi vincoli appartengono al sistema reale, il nuovo codice dovrà comunque affrontarli.

La differenza è che durante una rewrite rischiamo di perdere proprio i segnali che ci ricordavano della loro esistenza.

La domanda corretta non è quindi:

> Possiamo scrivere un sistema migliore?

È:

> **Possiamo descrivere abbastanza bene ciò che il nuovo sistema deve continuare a fare, ciò che può smettere di fare e come trasferire authority senza perdere controllo?**

## Le strategie di modernization non sono una scala di maturità

La guida Microsoft usa la famiglia delle `6R`:

```text
Retain
Retire
Rehost
Replatform
Refactor
Rebuild
```

La scelta dipende da business value, risk, cost, readiness, security/compliance e capacità organizzativa.

Fonte:

- [Microsoft Learn — App Modernization Guidance](https://learn.microsoft.com/en-us/azure/app-modernization-guidance/get-started/)

Queste opzioni non rappresentano una classifica dal “meno moderno” al “più moderno”.

`Retain` può essere la scelta corretta quando il rischio di cambiamento supera il beneficio.

`Retire` può essere la modernization migliore quando una capability non serve più.

`Rehost` può ridurre un rischio infrastrutturale senza toccare la semantica.

`Replatform` può eliminare un vincolo operativo mantenendo gran parte del codice.

`Refactor` modifica struttura preservando behavior e contract.

`Rebuild` ha senso quando il modello corrente non supporta più l'obiettivo e possediamo sufficiente comprensione per specificare il target.

La regola rimane `fit before fashion`.

## Il problema strutturale del big bang

Una big-bang rewrite tende a creare due prodotti contemporaneamente.

```text
legacy
→ continua a ricevere bug fix e feature

new system
→ cerca di raggiungere parity
```

Il target si muove mentre lo inseguiamo.

Intanto crescono:

- quantità di dati da migrare;
- differenze di comportamento;
- numero di consumer da riallineare;
- rischio del cutover;
- distanza fra i due modelli mentali;
- costo del rollback.

La rewrite può essere tecnicamente avanzata e operativamente ferma se nessuna capability reale può ancora essere spostata.

## Strangler Fig: sostituire responsabilità, non aspettare il grande giorno

Il **Strangler Fig pattern** riduce questo rischio permettendo a legacy e nuovo sistema di convivere mentre le capability vengono spostate progressivamente.

Microsoft e AWS descrivono il pattern come una sostituzione incrementale, spesso tramite facade o proxy, fino alla rimozione del path legacy.

Fonti:

- [Microsoft Learn — Strangler Fig pattern](https://learn.microsoft.com/it-it/azure/architecture/patterns/strangler-fig)
- [AWS Prescriptive Guidance — Strangler fig pattern](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/strangler-fig.html)

La sequenza che ci interessa è:

```text
understand
→ intercept / create seam
→ coexist
→ compare
→ move responsibility
→ verify
→ remove legacy path
```

La parola decisiva è `remove`.

Una modernization non è completa quando il nuovo path esiste.

È completa quando il vecchio path non è più necessario.

## Strangler Fig non significa microservizi

Il principio è la sostituzione incrementale.

Il nuovo boundary può essere:

- un modulo nello stesso deployable;
- un nuovo frontend;
- un adapter;
- un batch;
- un servizio;
- una nuova API;
- un datastore differente.

Se il modulo nuovo funziona meglio nello stesso modular monolith, estrarlo in rete soltanto per rispettare il pattern sarebbe un altro caso di fashion-driven architecture.

## Se il dominio è confuso, estrarlo può distribuire la confusione

AWS segnala esplicitamente il rischio della decomposizione prematura quando il dominio non è chiaro.

Il legacy non diventa ben modellato perché lo dividiamo.

Possiamo trasformare:

```text
one confusing monolith
```

in:

```text
seven confusing services
+ network
+ retries
+ distributed transactions
```

Il Capitolo 17 esiste proprio per evitare questo salto.

Prima ricostruiamo abbastanza significato.

Poi scegliamo il boundary.

## Caso reale — GitHub e l'upgrade Rails

GitHub ha documentato il passaggio del proprio grande monolite da Rails 3.2 a Rails 5.2.

Il lavoro richiese circa un anno e mezzo e non poteva bloccare feature delivery e bug fix.

Invece di isolare tutto in un enorme long-running branch, GitHub introdusse il **dual boot** su versioni Rails differenti e attraversò progressivamente le versioni intermedie, portando i nuovi build nei gate ordinari.

Fonte:

- [GitHub Engineering — Upgrading GitHub from Rails 3.2 to 5.2](https://github.blog/engineering/infrastructure/upgrading-github-from-rails-3-2-to-5-2/)

La lezione architetturale non riguarda Rails.

Riguarda il metodo:

```text
coexistence
+ incremental milestones
+ continuous product delivery
+ evidence at each step
```

La modernization rimane dentro la vita del prodotto invece di diventare un progetto parallelo che aspetta il cutover finale.

## Caso reale — GitHub server-side hooks

GitHub ha anche raccontato la sostituzione di server-side Git hook che caricavano dipendenze del monolite Rails e introducevano costo significativo a ogni push.

Prima di riscrivere, il team tentò il cambiamento meno invasivo: ridurre le dipendenze caricate.

Solo dopo avere misurato che il beneficio non sarebbe stato sufficiente scelse di spostare il comportamento nel servizio Go già usato dal Git Systems Team.

Fonte:

- [GitHub Engineering — Improving Git push times through faster server side hooks](https://github.blog/engineering/architecture-optimization/improving-git-push-times-through-faster-server-side-hooks/)

Questo è `fit before rewrite`:

```text
measure
→ try smaller change
→ understand required dependencies
→ rewrite only when benefit justifies it
```

## Caso reale — Strangler Fig su una grande app mobile

Un case study pubblicato sul sito di Martin Fowler nel 2024 descrive la modernization incrementale di una grande applicazione mobile enterprise tramite Strangler Fig e domain-oriented boundaries.

Gli autori sottolineano prerequisiti come outcome chiari, decomposizione del problema, delivery incrementale e cambiamento organizzativo.

Fonte:

- [Martin Fowler — Using the Strangler Fig with Mobile Apps](https://martinfowler.com/articles/strangler-fig-mobile-apps.html)

Anche qui il pattern arriva **dopo** la comprensione del problema.

Non la sostituisce.

## La modernization slice è l'unità di progresso

Invece di pianificare “la migrazione del monolite”, definiamo una slice con boundary e outcome osservabili.

Una slice utile deve poter rispondere almeno a:

```text
Capability
quale responsabilità stiamo spostando?

Users / consumers
chi dipende dal comportamento?

Contract
che cosa deve restare compatibile?

Data authority
chi possiede lo stato prima, durante e dopo?

Coexistence
come convivono legacy e candidate?

Verification
come distinguiamo Match / Difference / Regression?

Rollback
come torniamo indietro?

Removal
quando il vecchio path può essere eliminato?
```

Se `Removal` resta indefinito, il rischio è costruire un nuovo strato che convive per sempre con il precedente.

## Misurare progresso come rischio rimosso

La percentuale di nuovo codice scritto dice poco.

Metriche più utili possono essere:

```text
legacy traffic reduced
capability fully migrated
old dependency removed
consumer migrated
legacy writer retired
rollback exercised
test/evidence added
operational toil reduced
runtime decommissioned
```

Una rewrite “90% completa” che non può ricevere traffico reale può essere meno avanzata di una modernization al 20% che ha già ritirato una capability e il relativo failure domain.

La domanda finale è:

> **Quanto rischio, quanta authority e quanta responsabilità legacy abbiamo davvero rimosso dal sistema operativo?**

> **Modernizzare non significa produrre il nuovo. Significa rendere progressivamente non necessario il vecchio, senza perdere il comportamento che abbiamo deciso di preservare.**