# 17.4 — Seam, anti-corruption layer e boundary prima dell'estrazione

Un sistema legacy diventa difficile da cambiare quando non esiste un punto in cui possiamo introdurre comportamento nuovo senza dover modificare tutto insieme.

Quel punto è un **seam**.

Non serve necessariamente una nuova tecnologia.

Serve un posto in cui due comportamenti possano essere separati, osservati e sostituiti con rischio controllato.

## Il seam è una proprietà architetturale

Un seam può essere:

- un'interfaccia;
- una funzione delegata;
- un adapter;
- un proxy;
- una route;
- una view;
- una queue;
- una facade;
- una tabella di transizione;
- una feature flag;
- un boundary di modulo.

La domanda è:

> **possiamo sostituire una parte mantenendo stabile il contratto per il resto del sistema?**

Se la risposta è no, il primo lavoro di modernization potrebbe non essere l'estrazione.

Potrebbe essere creare il seam.

## Branch by abstraction

Quando la capability da cambiare vive in profondità nel monolite e ha molti caller interni, estrarla immediatamente può essere rischioso.

AWS descrive il **Branch by Abstraction** come una tecnica per modernizzare componenti profondi del legacy facendo convivere implementazione vecchia e nuova dietro una stessa astrazione.

Il processo descritto è sostanzialmente:

```text
identify legacy component
→ introduce abstraction
→ migrate existing callers to abstraction
→ add new implementation
→ switch behavior progressively
→ remove legacy implementation
```

Fonte:

- [AWS Prescriptive Guidance — Branch by abstraction pattern](https://docs.aws.amazon.com/prescriptive-guidance/latest/modernization-decomposing-monoliths/branch-by-abstraction.html)

Il valore non è l'interfaccia in sé.

Il valore è creare una **decision point controllabile**.

## Un'interfaccia non basta

Possiamo creare:

```ts
interface PriorityCalculator {
  calculate(input: CaseInput): Priority;
}
```

ma se:

- entrambi i calculator scrivono direttamente nella stessa tabella;
- leggono global state diverso;
- usano clock differenti;
- il caller continua a fare query fuori dal boundary;
- i side effect sono duplicati;

non abbiamo davvero isolato il comportamento.

Abbiamo aggiunto una forma sintattica.

Un seam efficace deve includere le dipendenze che determinano la semantica del comportamento.

## Anti-Corruption Layer

Quando il nuovo sistema deve convivere con un modello legacy, il rischio è importare nel nuovo dominio:

- naming storico;
- enum inconsistenti;
- null semantic;
- protocol quirks;
- data model denormalizzato;
- error code poco leggibili;
- workflow impliciti.

L'**Anti-Corruption Layer** crea un boundary di traduzione.

Microsoft Architecture Center lo descrive come facade/adapter fra subsystem che non condividono la stessa semantica, con l'obiettivo di impedire che il design del nuovo sistema venga limitato dal modello legacy.

Fonte:

- [Microsoft Learn — Anti-Corruption Layer pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/anti-corruption-layer)

Esempio:

```text
legacy status = "P3-HOLD-X"
        ↓
Anti-Corruption Layer
        ↓
Order Operations
EscalationState = AwaitingManualReview
```

Il nuovo sistema non deve sapere che `P3-HOLD-X` esiste.

La traduzione deve essere localizzata.

## Ma la traduzione è una responsabilità

Un ACL non è soltanto mapping di DTO.

Può dover governare:

- semantic mismatch;
- default;
- missing field;
- versioning;
- retry;
- timeout;
- idempotency;
- security boundary;
- data validation;
- observability.

Microsoft raccomanda esplicitamente validation/sanitization e observability al boundary perché i due subsystem possono avere trust level e semantiche differenti.

Un ACL mal progettato può diventare una nuova zona legacy.

## Shared database: il seam più difficile

Un'applicazione può sembrare separabile finché scopriamo che cinque sistemi scrivono nelle stesse tabelle.

In quel caso la vera API è il database.

Il refactoring deve quindi scoprire:

```text
writer
reader
transaction assumption
stored procedure
trigger
reporting consumer
backup/recovery coupling
schema migration ownership
```

Mettere un HTTP endpoint davanti a una tabella condivisa non elimina automaticamente il coupling.

Lo sposta.

## Temporal seam

A volte possiamo creare separazione nel tempo.

Esempio:

```text
legacy writes state
→ change feed / export
→ new system observes
```

oppure:

```text
new system receives request
→ writes transition record
→ legacy job continues processing
```

Questo può permettere coexistence.

Ma introduce:

- eventual consistency;
- reconciliation;
- dual ownership risk;
- ordering;
- recovery complexity.

Il seam deve quindi avere un Failure Mode Map, non soltanto un diagramma.

## Feature flag come migration control

Una feature flag può essere usata per:

```text
route 1% to new implementation
compare
increase
rollback
```

È utile quando il comportamento può essere selezionato per request/tenant/cohort.

Ma la flag non deve diventare permanente.

Ogni migration flag deve avere:

- owner;
- purpose;
- default;
- rollback semantics;
- removal condition.

Altrimenti la modernization lascia dietro di sé nuovi branch legacy.

## Shadow execution

Per behavior deterministico e senza side effect possiamo talvolta eseguire:

```text
legacy = authoritative
new = shadow
```

poi confrontare output.

Esempio:

```text
input case
→ legacy priority
→ new priority
→ compare
→ new output discarded
```

Questo produce evidence preziosa prima del cutover.

Non è applicabile quando la seconda execution produce side effect non isolabili.

## Double write non è un seam gratuito

Durante una migrazione può sembrare facile scrivere in vecchio e nuovo datastore.

Ma introduce subito la domanda:

> **cosa succede se una write riesce e l'altra no?**

Se il dual write non è governato con:

- order;
- retry semantics;
- reconciliation;
- source of truth;
- cutover plan;

non abbiamo ridotto il rischio.

Lo abbiamo distribuito.

## Boundary di rollback

Ogni seam di modernization deve permettere di rispondere:

- come torniamo indietro?
- quale stato è stato scritto nel nuovo sistema?
- è compatibile col vecchio?
- dobbiamo compensare?
- possiamo fare rollback per tenant/cohort?
- qual è il punto di non ritorno?

Una modernization incrementale ha valore proprio perché costruisce **reversibilità durante la transizione**.

## Il seam prima del servizio

È facile pensare:

```text
legacy module
→ extract microservice
```

Ma il servizio non è il seam.

Il seam è il boundary che consente di scegliere quale implementazione governa la capability.

Il deployment boundary può arrivare dopo.

Questa distinzione evita di distribuire coupling ancora non compreso.

> **Prima di estrarre una capability, crea il punto in cui puoi sostituirla senza dover cambiare contemporaneamente tutti quelli che la usano.**