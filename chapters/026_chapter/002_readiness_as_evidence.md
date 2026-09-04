# Readiness come evidence, non come impressione

Una Production Readiness Review perde valore quando usa frasi come “sembra stabile”, “l’abbiamo già provato” o “il provider gestisce il backup” come se fossero già prove.

Possono descrivere una situazione reale. Ma non dicono ancora **quale property è stata dimostrata, contro quale boundary e con quali limiti**.

Per la readiness useremo quindi lo stesso modello usato per la verification agentica:

```text
Claim
→ Evidence
→ Limitation
```

Se dichiariamo che `PaymentEscalation + OutboxMessage` sono atomici, l’evidence pertinente è un’integrazione su PostgreSQL reale con failure injection nel punto giusto. La limitation deve ricordare che quel test non dimostra Azure networking, broker delivery o Payments consumer behavior.

Se dichiariamo che il workload soddisfa un recovery target, la prova è un restore/failover drill con tempi misurati; la limitation deve chiarire quale scenario non è stato coperto.

> **La readiness non chiede quante prove abbiamo. Chiede se la prova che possediamo è abbastanza forte per il claim che vogliamo fare.**

## Designed e Codified sono stati utili, non production evidence completa

Il capstone contiene già decisioni importanti: private ingress, zone resilience direction, RTO/RPO, OpenTelemetry-compatible instrumentation, AI read-only authority e Secondary Maintainer.

Alcune sono codificate. Questo conta.

Ma la production readiness aggiunge una domanda ulteriore: **la proprietà è stata osservata nel boundary in cui può realmente fallire?**

Un template Bicep con `publicNetworkAccess = Disabled` è evidence statica utile. Non equivale a deployment non-production, private DNS funzionante e negative public-access test.

Una backup policy configurata è una condizione necessaria. Non equivale a un restore completato entro il target.

L’errore da evitare è l’**evidence inflation**:

```text
local property verified
→ whole-system claim promoted
```

## La forza dell’evidence dipende dalla property

Non esiste una scala in cui “production monitoring” sia sempre migliore di un test locale. Serve la prova più economica che attraversa il boundary rilevante.

Una business rule deterministica può essere dimostrata con un test. PostgreSQL transaction semantics richiedono PostgreSQL. Private endpoint reachability richiede un environment Azure appropriato. On-call readiness richiede una procedura realmente esercitata. AI groundedness richiede model execution su un eval set rappresentativo.

Questa è la stessa regola del Testing Architecture:

> **Usa l’evidence più economica che riesce davvero a dimostrare la property.**

## Anche l’evidence ha una freshness

Una prova non resta valida per sempre.

Un restore drill di diciotto mesi fa su una topology diversa può non descrivere più il sistema corrente. Una security review precedente a un nuovo provider, una nuova trust boundary o una nuova classe di dati può essere stata invalidata.

Per le evidence launch-critical dobbiamo quindi sapere almeno che cosa è stato testato, quando, contro quale version/environment, con quale risultato, da chi e quale evento ne invalida la validità.

La readiness è una fotografia con un **invalidating trigger**, non un timbro permanente.

## Evidence debt

Possiamo avere un’architettura plausibile e accumulare comunque evidence debt.

```text
zone resilience Designed
backup configured
runbook written
restore never exercised
```

Il rischio tecnico può anche essere contenuto. Il rischio epistemico resta: crediamo di saper recuperare ma non lo abbiamo dimostrato.

Un evidence gap deve quindi avere property affected, risk if wrong, owner, required environment, closure mechanism e launch impact. È backlog reale, non documentazione accessoria.

## Blocker, Accepted Risk, Follow-up e Unknown descrivono il rapporto col launch

Non ogni evidence gap deve bloccare tutto.

Un **Blocker** è una proprietà senza la quale non siamo disposti a sostenere il launch boundary corrente. Un **Accepted Risk** è un gap compreso, bounded, mitigato, owned e accettato dall’autorità corretta. Un **Follow-up** migliora il sistema ma non mette in discussione la promessa corrente.

`Unknown` è diverso da tutti e tre.

Se non sappiamo ancora abbastanza per capire il rischio, non possiamo trasformarlo in follow-up soltanto perché non abbiamo tempo per studiarlo.

> **Unknown è uno stato di readiness, non un sinonimo di “probabilmente innocuo”.**

## Chi produce evidence e chi accetta rischio possono essere soggetti diversi

Engineering può produrre un restore drill. Operations può giudicarne l’operability. Il business owner può accettare un residual downtime risk.

Un AI Eval Implementer può eseguire un dataset. Un verifier può controllare provenance e critical case. Product può decidere usefulness e Security può bloccare una safety violation.

Questa separazione evita la self-certification: chi ha prodotto il risultato non acquisisce automaticamente il diritto di promuoverlo a launch-ready.

## La Readiness Evidence Matrix è una vista, non una nuova source of truth

Per aggregare la review useremo una matrice con Area, Claim, Required Evidence, Current State, Launch Impact e Owner.

Il suo compito è mostrare in un unico posto dove una property è `Designed`, `Codified`, `Verified` o ancora `Pending`. Non sostituisce Threat Model, Testing Strategy o Reliability Contract; collega i loro claim alla decisione di launch.

Lo stesso vale per l’evidence package. Meglio un record con claim, version, environment, timestamp, result e limitation che una collezione di screenshot impossibile da interpretare tre mesi dopo.

La relation che deve sopravvivere alla memoria delle persone è:

```text
claim
→ evidence
→ limitation
```

## La review può e deve dire “non lo sappiamo”

Se `OO-001` è Pending, i unit test non devono trasformarlo in “probably atomic”. Se `OO-002` non è stato eseguito, le demo manuali non devono diventare model evaluation.

La PRR non esiste per difendere una data. Esiste per difendere la precisione dei nostri claim.

> **Una readiness review credibile non aumenta artificialmente la confidence. Rende più preciso il confine fra ciò che sappiamo, ciò che abbiamo soltanto progettato e ciò che non sappiamo ancora.**
