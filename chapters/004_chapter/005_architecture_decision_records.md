## Architecture Decision Record

Una decisione importante dimenticata diventa presto un mistero. Il codice rimane, ma dopo qualche mese il contesto che lo ha prodotto comincia a evaporare.

Qualcuno apre il repository e trova una queue che sembra inutile, un adapter apparentemente ridondante, un database separato o un retry disabilitato. Magari nota una limitazione nell'API che oggi sembra arbitraria. La tentazione naturale è semplificare ciò che appare strano.

Il problema è che quella stranezza potrebbe essere la traccia di un vincolo che non vediamo più.

Gli **Architecture Decision Record**, o ADR, servono a conservare abbastanza reasoning da rendere una decisione comprensibile nel tempo. Non sono verbali di riunione, non sono documenti di approvazione e non devono diventare una cronaca infinita. Sono una memoria tecnica selettiva delle scelte che vale la pena non perdere.

## Una struttura pratica

Nel libro useremo una forma come questa:

```markdown
# ADR-xxx — Titolo

Status: proposed | accepted | superseded | deprecated | rejected

## Contesto

## Problema

## Architecturally Significant Requirements

## Vincoli

## Alternative considerate

## Decisione

## Motivazione

## Conseguenze positive

## Conseguenze negative

## Rischi

## Trigger di revisione
```

Un ADR utile può stare in una pagina. La qualità non dipende dal volume, ma dalla capacità di rispondere in futuro a una domanda precisa:

> **Perché abbiamo scelto questa strada invece delle alternative credibili disponibili in quel momento?**

## Il contesto è parte della decisione

Scrivere “abbiamo scelto PostgreSQL” conserva il risultato e perde quasi tutto il valore. Dire invece che abbiamo scelto un database relazionale gestito perché il dominio richiede determinate transazioni, il volume iniziale è moderato, il team ha una certa capacità operativa e non esistono ancora requisiti che giustifichino una piattaforma distribuita più complessa rende la decisione rivalutabile.

Se in futuro cambiano volume, workload o requisiti, sappiamo quali assunzioni controllare. Il contesto non è una premessa decorativa: è ciò che definisce **l'intervallo di validità** della scelta.

## Le alternative devono essere credibili

Un ADR perde valore quando mette a confronto la soluzione scelta con alternative-fantoccio. Se l'opzione A è ragionevole e l'opzione B è chiaramente assurda, non abbiamo documentato un trade-off: abbiamo scritto una giustificazione a posteriori.

Le alternative devono essere plausibili nel contesto reale. A volte saranno due, a volte quattro. Spesso una delle più importanti è semplicemente **non introdurre una nuova soluzione** e continuare con quella esistente.

Questa possibilità merita spazio perché molte decisioni architetturali aggiungono complessità; l'onere della prova non dovrebbe ricadere automaticamente sullo status quo soltanto perché la nuova opzione è più interessante da disegnare.

## Le conseguenze negative sono parte del valore

Una delle sezioni più preziose di un ADR è quella che descrive ciò che paghiamo.

```text
Decisione: introdurre un read model asincrono.

Conseguenze positive:
- lookup isolato dal carico del database operativo;
- schema ottimizzato per lettura;
- maggiore controllo della latency.

Conseguenze negative:
- eventual consistency;
- nuova pipeline da osservare;
- replay e recovery più complessi;
- maggiore superficie operativa.
```

Se anni dopo la superficie operativa supera il beneficio, possiamo riconoscere che quel costo non è una sorpresa: era già parte del trade-off. Questo rende la decisione più facile da contestare con evidenza nuova.

## Conservare l'evoluzione invece di riscrivere il passato

Gli ADR possono cambiare stato. `proposed`, `accepted`, `superseded`, `deprecated` e `rejected` permettono di raccontare l'evoluzione della decisione senza cancellarne la storia.

Quando il contesto cambia, spesso è meglio creare un nuovo ADR che supersede il precedente piuttosto che riscrivere il documento vecchio come se avessimo sempre saputo la risposta corretta. In questo modo rimane leggibile il percorso: che cosa sapevamo allora, perché avevamo scelto quella direzione e quale evidenza ci ha fatto cambiare idea.

Questa memoria è molto più utile di una storia perfettamente coerente ricostruita a posteriori.

## ADR non significa approval board

Gli ADR diventano dannosi quando ogni scelta, anche minima, richiede un documento e una catena di approvazione. A quel punto le persone smettono di usarli oppure le decisioni importanti vengono sommerse da dettagli irrilevanti.

Serve proporzionalità. Un ADR ha senso quando la scelta ha impatto trasversale, alto costo di inversione, rischio significativo, alternative non ovvie o conseguenze operative che qualcuno dovrà comprendere in futuro.

Il test è semplice: **perdere il reasoning renderebbe il sistema più difficile da governare?** Se sì, il record ha valore.

## Il repository come memoria decisionale

Gli ADR funzionano particolarmente bene vicino al codice:

```text
architecture/
adr/
  0001-use-managed-postgresql.md
  0002-order-status-read-model.md
  0003-tenant-isolation-strategy.md
```

In questo modo possono essere versionati, revisionati nelle pull request, collegati a issue e implementazione e cercati insieme alla storia del repository. Diventano anche una fonte di contesto persistente per gli agenti.

Un coding agent vede soprattutto lo stato corrente del sistema. Senza storia può interpretare una decisione deliberata come accidental complexity, oppure replicare una tecnologia senza sapere che era stata scelta per un vincolo temporaneo che non esiste più.

## AI come assistente della memoria decisionale

L'AI può aiutare a preparare un ADR: riassumere alternative discusse, cercare trade-off mancanti, evidenziare contraddizioni con record esistenti, proporre trigger di revisione o trasformare note grezze in una prima bozza leggibile.

Il rischio è scambiare la qualità retorica della bozza per qualità della decisione. Un modello può scrivere una motivazione molto convincente anche per una scelta fragile.

Per questo l'ADR è un **decision record**, non un decision generator. Non rende buona una decisione; la rende esplicita, verificabile e contestabile.

Il record raggiunge davvero il suo scopo quando, anni dopo, qualcuno può dire:

> “Questa scelta aveva senso nel contesto di allora, ma il trigger X è scattato e oggi il bilancio è cambiato.”

> **Documentiamo il reasoning non per difendere il passato, ma per renderci capaci di cambiare idea con cognizione di causa.**
