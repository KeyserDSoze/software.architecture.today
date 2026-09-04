## Architecture Decision Record

Una decisione importante dimenticata diventa presto un mistero.

Dopo qualche mese il codice rimane, ma il contesto che lo ha prodotto scompare.

Qualcuno apre il repository e trova una queue che sembra inutile, un adapter apparentemente ridondante o un database separato. Nota una limitazione strana nell'API, un retry disabilitato o una scelta di deployment che oggi appare eccessiva. La tentazione è correggere ciò che sembra strano.

Ma forse quella forma è la conseguenza di un vincolo che non vediamo più.

Gli **Architecture Decision Record**, o ADR, servono a conservare il ragionamento sufficiente per comprendere una decisione nel tempo.

Non sono verbali di riunione.

Non sono documenti di approvazione.

Non sono una cronaca infinita.

Sono una memoria tecnica delle decisioni che vale la pena non perdere.

### Una struttura pratica

Nel libro useremo una forma come questa:

```markdown
# ADR-xxx — Titolo

## Contesto

## Problema

## Vincoli

## Alternative considerate

## Decisione

## Motivazione

## Conseguenze positive

## Conseguenze negative

## Rischi

## Trigger di revisione
```

Non tutte le sezioni devono essere lunghe.

Un ADR utile può essere una pagina.

La qualità non dipende dal volume.

Dipende dalla capacità di rispondere a una domanda futura:

> **Perché abbiamo scelto questa strada invece delle alternative credibili che avevamo in quel momento?**

### Il contesto è parte della decisione

Scrivere soltanto:

> “Abbiamo scelto PostgreSQL.”

ha poco valore.

Meglio:

> “Abbiamo scelto un database relazionale gestito perché il dominio richiede transazioni multi-entità locali, il volume iniziale è moderato, il team ha esperienza operativa limitata e non esistono oggi requisiti che giustifichino una piattaforma distribuita più complessa.”

La seconda frase può essere rivalutata.

Se cambiano volume, pattern di accesso o requisiti, sappiamo quali assunzioni controllare.

### Alternative credibili

Un ADR non deve inventare alternative soltanto per riempire una sezione.

Scrivere:

```text
Alternativa A: soluzione scelta
Alternativa B: soluzione chiaramente assurda
```

non documenta un trade-off.

Le alternative devono essere plausibili nel contesto.

A volte sono due.

A volte quattro.

A volte la vera alternativa è **non introdurre nulla**.

Questa è spesso la più importante da includere.

### Conseguenze negative

Una delle sezioni più preziose è quella delle conseguenze negative.

Per esempio:

```text
Decisione: introdurre un read model asincrono.

Conseguenze positive:
- lookup indipendente dal carico del database operativo;
- schema ottimizzato per lettura;
- maggiore controllo della latency.

Conseguenze negative:
- eventual consistency;
- nuova pipeline da osservare;
- replay e recovery più complessi;
- maggiore superficie operativa.
```

Questa onestà rende l'ADR utile anche anni dopo.

Se in futuro il costo operativo supera il beneficio, sappiamo che quel rischio era già parte della decisione.

### Decision status

Un ADR può evolvere.

Stati come `proposed`, `accepted`, `superseded`, `deprecated` e `rejected` permettono di conservare l'evoluzione della decisione. Quando una decisione cambia, spesso è meglio **non riscrivere la storia**.

Creiamo un nuovo ADR che sostituisce il precedente.

Così rimane visibile l'evoluzione del ragionamento.

### ADR non significa approval board

Gli ADR diventano dannosi quando ogni piccola scelta richiede un documento e una catena di approvazione.

Questo produce due effetti:

1. le persone smettono di usarli;
2. le decisioni importanti vengono sepolte insieme a quelle irrilevanti.

Serve proporzionalità.

Un buon criterio è documentare decisioni con impatto trasversale o alto costo di inversione, con rischio significativo o alternative non ovvie. Vale la pena farlo anche quando le conseguenze operative sono rilevanti o quando è molto probabile che, in futuro, qualcuno debba chiedere perché quella scelta sia stata fatta.

### Il repository come memoria decisionale

Gli ADR funzionano particolarmente bene vicino al codice.

Per esempio:

```text
architecture/
adr/
  0001-use-managed-postgresql.md
  0002-order-status-read-model.md
  0003-tenant-isolation-strategy.md
```

Il vantaggio è che possono essere versionati e revisionati in pull request, collegati a issue e codice, letti dagli agenti e cercati insieme alla storia del repository.

### ADR e agenti AI

Gli ADR diventano ancora più importanti nei repository AI-ready.

Un agente vede soprattutto lo stato corrente del sistema.

Senza storia può interpretare una decisione deliberata come accidental complexity.

Oppure può replicare una tecnologia senza sapere che era stata scelta soltanto per un vincolo temporaneo.

Un ADR fornisce contesto che il codice non può esprimere completamente.

L'AI può anche aiutarci a prepararli.

Per esempio:

1. riassume le alternative discusse;
2. evidenzia trade-off mancanti;
3. cerca contraddizioni con ADR esistenti;
4. propone trigger di revisione;
5. produce una prima bozza.

Ma la decisione non va delegata alla qualità retorica della bozza.

Un modello può scrivere una motivazione convincente anche per una scelta sbagliata.

### Decision record, non decision generator

Questa distinzione è fondamentale.

L'ADR non rende buona una decisione.

La rende **esplicita e contestabile**.

Un'architettura debole documentata perfettamente resta debole.

Un ADR utile deve permettere a qualcuno di dire:

> “Questa decisione aveva senso allora, ma il trigger X è scattato e oggi il bilancio è cambiato.”

È in quel momento che la documentazione diventa parte dell'architettura evolutiva.

> **Documentiamo il ragionamento non per difendere il passato, ma per rendere possibile cambiare idea con cognizione di causa.**