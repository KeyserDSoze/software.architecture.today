# 19.5 — Architecture Fitness Checklist

Le fitness function individuali sono utili.

Ma un sistema complesso ha bisogno anche di una vista che colleghi:

```text
architectural intent
→ evidence mechanism
→ current state
→ owner
→ review trigger
```

Per questo introduciamo un nuovo artefatto operativo:

> **Architecture Fitness Checklist**

Il nome `checklist` può trarre in inganno.

Non è una lista di best practice universali.

È il registro delle proprietà che **questo** workload ha deciso di proteggere durante la propria evoluzione.

## Template

```text
Fitness ID
Property
Why it matters
Mechanism
Evidence source
Failure action
Owner
Current status
Review trigger
```

## Esempio

```text
AF-001
Property:
Target code must not depend directly on Operations Desk Classic implementation.

Why:
Prevent legacy semantic/coupling leakage into Order Operations.

Mechanism:
Static architecture test.

Failure action:
Fail local/PR gate.

Owner:
Commerce & Operations.

Review trigger:
Legacy retired or coexistence boundary redesigned.
```

Questo rende la regola molto diversa da:

> "keep legacy isolated".

La seconda frase è utile come principio.

La prima è governabile.

## Le dimensioni di Order Operations

Per ESI la checklist non guarda soltanto la struttura del codice.

### Functional / domain

- business rule nuove passano dalla functional analysis;
- legacy behavior non diventa requirement senza confirmation;
- Payments conserva ownership della semantica economica.

### Structure

- application non dipende da integration;
- contracts rimane un layer stabile e povero di dipendenze;
- priority target non dipende dal legacy implementation;
- nessun ciclo strutturale significativo.

### Data

- ogni business fact ha un owner;
- derived copy dichiara source/freshness/reconciliation;
- migration preserva ownership.

### Security

- production ingress resta private finché il requirement non cambia;
- runtime identity e deployment identity restano separate;
- least privilege verificabile;
- nessun secret nel repository.

### Reliability

- SLO e RTO/RPO hanno evidence;
- graceful degradation non nasconde stale/unknown data;
- retry resta bounded;
- recovery drill non viene sostituito da configurazione dichiarativa.

### Observability

- metric dimensions restano bounded;
- critical journey ha correlation;
- alert ha owner e action;
- telemetry cost rimane visibile.

### Testing

- critical risk ha un evidence layer appropriato;
- flaky test resta defect;
- test locale non viene usato come evidence di boundary esterno.

### Cost

- una nuova managed capability dichiara il costo che introduce;
- scaling/capacity decision viene riaperta se cambia il workload.

### Evolution

- ADR significativi hanno review trigger;
- exception ha owner ed expiry;
- feature flag temporaneo ha removal condition;
- migration ha cleanup stage.

## Stato: non solo pass/fail

Per la checklist riutilizziamo il vocabolario già introdotto:

```text
Designed
→ Codified
→ Verified
→ Monitored
```

Con alcune proprietà che possono avere anche:

```text
At Risk
Exception Active
Review Required
```

Un architecture test verde non rende automaticamente la property `Verified` in produzione.

Esempio:

```text
AF-SEC-02
private ingress

IaC says disabled public network
→ Codified

non-production connectivity test
→ Verified

production drift monitor
→ Monitored
```

## Fitness function atomiche e olistiche

Thoughtworks distingue fitness function che verificano proprietà locali e altre che richiedono una vista più olistica del sistema.

È una distinzione utile.

Non possiamo verificare `RTO <= 8h` leggendo gli import TypeScript.

Non possiamo verificare dependency direction con un disaster recovery drill.

Ogni proprietà deve usare evidence proporzionata.

Riferimento:

- [Thoughtworks — Building Evolutionary Architectures sample chapter](https://www.thoughtworks.com/content/dam/thoughtworks/documents/books/bk_building_evolutionary_architectures_en.pdf)

## La checklist non deve crescere all'infinito

Ogni nuova regola ha un costo:

- execution;
- maintenance;
- false positive;
- documentation;
- cognitive load;
- exception management.

Quindi la domanda prima di aggiungere una fitness function è:

> **Quale rischio significativo diventerebbe più difficile da rilevare se non avessimo questa regola?**

Se non sappiamo rispondere, forse non serve.

## Fitness portfolio review

Periodicamente il team dovrebbe chiedere:

```text
Which fitness functions caught something useful?
Which never fire because the risk disappeared?
Which are noisy?
Which protect obsolete assumptions?
Which important risks still rely only on memory?
```

Questo impedisce che il sistema di governance diventi esso stesso legacy.

## Collegamento con gli ADR

La checklist non sostituisce gli ADR.

Gli ADR spiegano **perché**.

Le fitness function verificano **se una proprietà scelta continua a essere rispettata**.

```text
ADR
→ intent / trade-off / trigger

Fitness function
→ repeated evidence
```

Se una fitness function fallisce perché il contesto è cambiato, potremmo dover cambiare l'ADR.

Se fallisce perché il codice ha driftato, dobbiamo probabilmente correggere il codice.

> **Una buona Architecture Fitness Checklist non ci dice soltanto se qualcosa è rosso. Ci aiuta a capire se dobbiamo correggere l'implementazione o riaprire la decisione.**
