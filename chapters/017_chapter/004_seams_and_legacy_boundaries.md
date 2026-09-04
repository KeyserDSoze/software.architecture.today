# 17.4 — Seam, Anti-Corruption Layer e boundary prima dell'estrazione

Dopo avere osservato il comportamento, la domanda successiva non è ancora:

> Quale servizio estraiamo?

È:

> **Dove possiamo introdurre una scelta fra comportamento vecchio e nuovo senza dover cambiare tutto nello stesso momento?**

Quel punto è un **seam**.

Il seam è ciò che trasforma una modernization da salto irreversibile a transizione governabile.

## Un seam è un punto di scelta

Può essere un'interfaccia, un adapter, una facade, una route, un proxy, una queue, una view, una feature flag o un boundary di modulo.

La forma tecnica è secondaria.

La proprietà che ci interessa è:

```text
same contract
→ legacy implementation
or
→ candidate implementation
```

senza obbligare tutti i caller, i consumer e i dati a migrare nello stesso istante.

Se non esiste un punto di scelta, il primo lavoro non è “estrarre”.

È **creare il punto in cui potremo sostituire**.

## Branch by Abstraction: separare la scelta dal deployment

Quando una capability vive in profondità nel monolite e ha molti caller interni, un proxy al perimetro può non bastare.

AWS descrive **Branch by Abstraction** come una tecnica in cui vecchia e nuova implementazione convivono dietro la stessa astrazione, permettendo una migrazione progressiva dei caller e del comportamento.

Fonte:

- [AWS Prescriptive Guidance — Branch by abstraction pattern](https://docs.aws.amazon.com/prescriptive-guidance/latest/modernization-decomposing-monoliths/branch-by-abstraction.html)

La sequenza concettuale è:

```text
identify capability
→ introduce abstraction
→ route existing callers through it
→ add candidate implementation
→ compare / switch progressively
→ remove legacy implementation
```

L'interfaccia non è il valore principale.

Il valore è avere un **decision point controllabile**.

## Un'interfaccia sintattica non crea automaticamente un boundary

Possiamo scrivere:

```ts
interface PriorityCalculator {
  calculate(input: CaseInput): Priority;
}
```

ma non abbiamo davvero isolato la capability se entrambe le implementazioni continuano a:

- scrivere direttamente la stessa tabella;
- leggere global state differente;
- produrre side effect duplicati;
- dipendere da clock o config nascosti;
- essere circondate da query che bypassano l'interfaccia.

Un seam efficace deve racchiudere le dipendenze che determinano la semantica della decisione.

Altrimenti abbiamo soltanto aggiunto una forma elegante sopra il coupling esistente.

## Anti-Corruption Layer: proteggere il nuovo modello

Quando il nuovo sistema deve convivere con il legacy, c'è un rischio specifico: importare nel nuovo dominio naming storico, enum incoerenti, null semantic, protocol quirks e data model nati per vincoli che non esistono più.

L'**Anti-Corruption Layer** crea una traduzione intenzionale fra modelli differenti.

Microsoft lo descrive come facade o adapter tra subsystem con semantiche diverse, per evitare che il nuovo design venga deformato dal modello legacy.

Fonte:

- [Microsoft Learn — Anti-Corruption Layer pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/anti-corruption-layer)

Esempio:

```text
legacy status = P3-HOLD-X
        ↓
ACL
        ↓
Order Operations
EscalationState = AwaitingManualReview
```

Il nuovo dominio non deve imparare `P3-HOLD-X`.

La conoscenza della compatibilità rimane localizzata nel boundary.

## La traduzione è una responsabilità, non un mapping meccanico

Un ACL può dover decidere:

```text
semantic mismatch
default
missing field
versioning
validation
retry / timeout
idempotency
security context
freshness
observability
```

Se copia dati, deve anche chiarire authority, retention e reconciliation.

Un ACL senza ownership e lifecycle può diventare semplicemente il prossimo layer legacy.

## Il shared database rivela il vero boundary

Una capability può sembrare separabile fino a quando scopriamo che più applicazioni scrivono le stesse tabelle.

A quel punto la vera integration surface non è l'API che vorremmo avere.

È il database esistente.

Dobbiamo quindi capire:

```text
writers
readers
transaction assumptions
stored procedures
triggers
reporting consumers
schema ownership
backup/recovery coupling
```

Mettere un endpoint HTTP davanti alla tabella non elimina automaticamente il coupling.

Può soltanto nasconderlo dietro una nuova URL.

## A volte il seam è temporale

La separazione può avvenire anche nel tempo.

Per esempio:

```text
legacy writes
→ export / change feed
→ new system observes
```

oppure:

```text
new system records intent
→ legacy job continues processing
```

Questo può facilitare coexistence e discovery.

Introduce però eventual consistency, reconciliation, ordering e recovery complexity.

Un seam temporale ha quindi bisogno dello stesso rigore di un'integrazione distribuita: failure mode, source of truth e stop condition.

## Shadow execution: confrontare senza cedere authority

Quando il comportamento è deterministico e privo di side effect non isolabili, possiamo mantenere il legacy autorevole e calcolare in parallelo il risultato candidato.

```text
input
→ legacy result   = authoritative
→ candidate result = shadow
→ compare
→ discard candidate side effect
```

Questo produce evidence preziosa prima del cutover.

Ma funziona soltanto se la seconda execution può essere resa realmente innocua.

Un “shadow” che scrive, invia email o modifica workflow non è più shadow.

È una seconda authority.

## Feature flag come migration control

Una migration flag può permettere rollout progressivo e rollback per cohort o tenant.

Può essere utilissima.

Diventa però un nuovo debito se non possiede:

```text
owner
purpose
default
rollback semantics
removal condition
```

Una flag temporanea senza removal condition è una candidate legacy branch già nel giorno in cui nasce.

## Dual write: il problema della doppia verità

Scrivere contemporaneamente vecchio e nuovo datastore sembra una scorciatoia naturale.

La prima domanda dovrebbe però essere:

> Che cosa succede se una write riesce e l'altra no?

Senza una policy per order, retry, reconciliation, authority e cutover, il dual write non riduce il rischio.

Lo trasforma in divergenza di stato.

Per questo una modernization dovrebbe evitare di creare due owner dello stesso business fact senza una transizione esplicita.

## Il rollback boundary

Ogni seam utile deve permettere di rispondere prima del rollout:

```text
come torniamo indietro?
quale stato nuovo è già stato scritto?
il legacy può ancora leggerlo?
serve compensazione?
possiamo rollbackare per cohort?
qual è il point of no return?
```

La reversibilità non è un dettaglio operativo successivo.

È una proprietà del boundary di modernization.

## Il seam viene prima del microservizio

È facile saltare direttamente a:

```text
legacy module
→ extract microservice
```

Ma un microservizio è un deployment boundary.

Non è automaticamente il seam semantico che ci permette di sostituire il comportamento.

Se il coupling non è ancora compreso, distribuire il modulo può produrre:

```text
same ambiguity
+ network
+ retries
+ distributed failure
```

Prima separiamo la responsabilità.

Poi decidiamo se quella responsabilità merita anche un deployment indipendente.

> **Prima di estrarre una capability, crea il punto in cui puoi sostituirla, confrontarla e rollbackarla senza obbligare tutto il sistema a cambiare insieme.**