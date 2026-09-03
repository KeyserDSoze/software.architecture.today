# 17.5 — Modernizzare senza trasformare la riscrittura in una scommessa

Quando un sistema legacy è doloroso, la frase più seducente è spesso:

> “Rifacciamolo bene da zero.”

A volte è la scelta giusta.

Molto più spesso è una decisione che sottostima quanta conoscenza sia incorporata nel sistema esistente.

## Rewrite non significa reset della complessità

Una riscrittura elimina codice vecchio.

Non elimina automaticamente:

- business rule;
- compatibilità;
- integrazioni;
- dati storici;
- edge case;
- compliance;
- workload;
- organizzazione;
- utenti;
- migrazione;
- cutover;
- recovery.

Se questi problemi esistono nel sistema reale, il nuovo codice dovrà affrontarli comunque.

La differenza è che durante una rewrite possiamo aver perso i segnali che ci ricordavano che esistevano.

## Le strategie non sono una classifica

La guida Microsoft alla modernization usa una famiglia di strategie derivate dalle cosiddette `6R`:

```text
Retain
Retire
Rehost
Replatform
Refactor
Rebuild
```

La decisione deve considerare business value, cost, risk, readiness, security/compliance e maturity organizzativa.

Fonte:

- [Microsoft Learn — App Modernization Guidance](https://learn.microsoft.com/en-us/azure/app-modernization-guidance/get-started/)

Non esiste una `R` più moderna delle altre.

### Retain

Manteniamo il sistema perché il rapporto valore/rischio non giustifica ancora un cambiamento.

### Retire

Eliminiamo una capability che non produce più valore.

È spesso la modernization più economica.

### Rehost

Cambiamo hosting con poche modifiche applicative.

Può ridurre un rischio infrastrutturale senza risolvere il design.

### Replatform

Cambiamo una parte della piattaforma mantenendo gran parte dell'applicazione.

### Refactor

Cambiamo struttura interna preservando comportamento e contratto.

### Rebuild

Riscriviamo la capability.

Può essere appropriato quando il modello esistente non è più compatibile con l'obiettivo e abbiamo sufficiente conoscenza per specificare il comportamento desiderato.

## Il problema del big bang

Una big-bang rewrite accumula spesso due backlog contemporaneamente:

```text
legacy system
→ continua a ricevere fix e feature

new system
→ cerca di raggiungere feature parity
```

La distanza non resta ferma.

Il nuovo sistema insegue un target che continua a muoversi.

Intanto:

- il cutover diventa sempre più importante;
- la quantità di dati da migrare cresce;
- gli utenti non producono feedback reale sul nuovo flow;
- i team devono mantenere due modelli mentali;
- il rollback diventa più costoso.

## Strangler Fig

Il **Strangler Fig pattern** riduce questo rischio sostituendo progressivamente parti del legacy mentre vecchio e nuovo sistema coesistono.

Microsoft e AWS descrivono entrambi il pattern come approccio incrementale in cui una facade/proxy instrada progressivamente le richieste verso la nuova implementazione finché la capability legacy può essere rimossa.

Fonti:

- [Microsoft Learn — Strangler Fig pattern](https://learn.microsoft.com/it-it/azure/architecture/patterns/strangler-fig)
- [AWS Prescriptive Guidance — Strangler fig pattern](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/strangler-fig.html)

La sequenza concettuale è:

```text
understand
→ intercept
→ coexist
→ compare
→ move traffic/capability
→ verify
→ remove legacy path
```

Non:

```text
build new system
→ hope
→ switch everything
```

## Il pattern non obbliga ai microservizi

Molte descrizioni del pattern parlano di migrazione da monolite a microservizi.

Ma il principio più generale è la **sostituzione incrementale**.

Possiamo strangolare una capability legacy con:

- un nuovo modulo nello stesso deployable;
- un nuovo frontend;
- un servizio;
- un adapter;
- un nuovo batch;
- un nuovo datastore;
- una nuova API.

La topologia deve ancora rispondere al fit.

## Unclear domain: non estrarre troppo presto

AWS segnala esplicitamente fra i rischi del pattern la decomposizione prematura quando il dominio non è chiaro: scegliere boundary sbagliati può rendere la modernizzazione più costosa.

Questo è fondamentale.

Il legacy non diventa improvvisamente ben modellato solo perché lo spacchettiamo.

Possiamo trasformare:

```text
one confusing monolith
```

in:

```text
seven confusing services
+ network
+ distributed transactions
```

La fase di understanding serve proprio a impedirlo.

## Caso reale — GitHub e l'upgrade Rails

GitHub ha documentato il passaggio del proprio grande monolite Rails da Rails 3.2 a 5.2.

La migrazione ha richiesto circa un anno e mezzo e non poteva bloccare feature development e bug fix.

Invece di mantenere un enorme long-running branch, GitHub introdusse la capacità di **dual boot** su versioni Rails differenti e procedette incrementalmente attraverso le versioni intermedie, rendendo progressivamente i nuovi build parte dei gate ordinari.

Fonte:

- [GitHub Engineering — Upgrading GitHub from Rails 3.2 to 5.2](https://github.blog/engineering/infrastructure/upgrading-github-from-rails-3-2-to-5-2/)

Il punto interessante non è Rails.

È il metodo:

```text
coexistence
+ incremental milestones
+ normal delivery continues
+ feedback every step
```

La modernization non viene separata dalla vita del prodotto.

## Caso reale — GitHub server-side hooks

GitHub ha anche documentato la sostituzione dei server-side Git hooks che caricavano dipendenze del monolite Rails e producevano un costo significativo a ogni push.

Prima di riscrivere, il team tentò l'opzione più semplice: ridurre le dipendenze caricate. Solo dopo aver misurato che il miglioramento non sarebbe stato sufficiente scelse di spostare il comportamento nel servizio Go già usato dal Git Systems Team.

Fonte:

- [GitHub Engineering — Improving Git push times through faster server side hooks](https://github.blog/engineering/architecture-optimization/improving-git-push-times-through-faster-server-side-hooks/)

Questo è un ottimo esempio di **fit before rewrite**:

1. misurare;
2. provare il cambiamento meno invasivo;
3. capire le dipendenze necessarie;
4. riscrivere soltanto quando il beneficio giustifica il rischio.

## Caso reale — Thoughtworks e un'app mobile legacy

Un case study pubblicato sul sito di Martin Fowler nel 2024 descrive una modernizzazione incrementale di una grande applicazione mobile enterprise usando Strangler Fig e domain-oriented boundaries.

Gli autori sottolineano che il pattern funziona solo dopo avere affrontato prerequisiti come outcome, decomposizione del problema, delivery incrementale e cambiamento organizzativo.

Fonte:

- [Martin Fowler — Using the Strangler Fig with Mobile Apps](https://martinfowler.com/articles/strangler-fig-mobile-apps.html)

Ancora una volta il pattern non è il primo passo.

La comprensione viene prima.

## La modernization slice

Invece di pianificare “la migrazione del monolite”, definiamo slice con valore e boundary osservabile.

Una slice dovrebbe poter rispondere:

```text
Capability
Quale comportamento stiamo spostando?

Users
Chi lo usa?

Contract
Che promessa deve restare stabile?

Data
Chi possiede stato e history?

Coexistence
Come convivono vecchio e nuovo?

Verification
Come confrontiamo i due comportamenti?

Rollback
Come torniamo indietro?

Removal
Quando il vecchio path può essere eliminato?
```

## Modernization progress non è quantità di nuovo codice

Metriche più utili possono essere:

- legacy traffic ridotto;
- capability completamente migrate;
- dependency eliminata;
- consumer spostati;
- old schema writer rimossi;
- rollback esercitato;
- test/evidence aggiunti;
- operational toil ridotto;
- runtime legacy decommissionato.

Una riscrittura al 90% che non può ricevere traffico reale è forse meno avanzata di una modernization al 20% che ha già eliminato una capability legacy completa.

## Il criterio finale

La domanda non è:

> “Quanto codice abbiamo riscritto?”

È:

> **“Quanto rischio e quanta responsabilità legacy abbiamo realmente rimosso dal sistema operativo?”**

> **Modernizzare non significa produrre il nuovo. Significa rendere progressivamente non necessario il vecchio.**