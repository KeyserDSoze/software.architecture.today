# 19.3 — Drift, decision expiry e debito come rischio

Una fitness function può dirci che una proprietà non è più rispettata.

Prima di correggere qualcosa dobbiamo però capire **che cosa è cambiato**.

Esistono almeno due failure mode molto diversi:

```text
implementation drift
→ il sistema non rispetta più l'intento

context drift
→ l'intento è ancora rispettato, ma non ha più fit
```

Confonderli produce due reazioni sbagliate: modificare il codice quando dovremmo riaprire una decisione, oppure modificare la governance per nascondere una vera regressione.

## Implementation drift

L'implementazione si allontana da una decisione che continua ad avere senso.

Esempi ESI:

```text
src/application imports src/integration
priority code imports legacy directly
public access appears despite private-ingress decision
metric dimension includes caseId
```

Qui la risposta tipica è:

```text
fitness violation
→ fix implementation
```

oppure, se l'eccezione è realmente necessaria, registrarla esplicitamente.

## Context drift

Il secondo caso è più sottile.

Order Operations è stato progettato single-region con un requisito simulato:

```text
region-wide RTO <= 8h
RPO <= 1h
```

Se un nuovo impegno cambia il requisito in:

```text
RTO <= 15m anche per region failure
```

l'implementazione può essere perfettamente coerente con l'ADR originale e contemporaneamente non essere più adeguata al business.

L'ADR non era necessariamente sbagliato.

È cambiata una delle forze che lo giustificavano.

> **Una decisione può restare ben implementata e diventare comunque obsoleta.**

## Gli ADR hanno bisogno di review trigger

Un Architecture Decision Record è più utile se, oltre a decisione e conseguenze, conserva:

```text
assumptions
review triggers
expected evidence
conditions that invalidate the fit
```

Trigger possibili:

- volume o consumer count significativamente diversi;
- nuovo public ingress;
- nuovo requirement compliance;
- SLO/RTO/RPO cambiati;
- recurring incident class;
- cost oltre il range accettato;
- team/domain ownership cambiata;
- technology support lifecycle;
- nuova capability che modifica il trade-off.

Questo evita due estremi.

### Architecture amnesia

La decisione resta perché nessuno ricorda più perché esiste.

### Architecture churn

Ogni novità di mercato riapre decisioni sane anche quando il problema non è cambiato.

Il review trigger dice:

> **non rimettere tutto in discussione continuamente; riapri ciò che ha perso una delle assunzioni su cui era costruito.**

## Runtime evidence chiude il feedback loop

Microsoft raccomanda che l'architect continui anche dopo il go-live a confrontare design hypothesis con comportamento reale: health model, cost model, scaling assumption, performance e technical debt.

Fonte:

- [Microsoft Learn — Support the workload in a consultative role](https://learn.microsoft.com/en-us/azure/well-architected/architect-role/ongoing-support)

Questo crea un ciclo:

```text
intent
→ implementation
→ runtime evidence
→ changed context
→ review trigger
→ new decision
```

L'architetto non custodisce il diagramma iniziale.

Aiuta a mantenere vivo questo feedback loop.

## Technical debt: descrivere il vincolo, non insultare il codice

`Technical debt` diventa poco utile quando significa semplicemente “cose brutte che vorremmo sistemare”.

Un debt item governabile dovrebbe invece rispondere a:

```text
Which constraint does it create?
Which failure/change becomes more likely?
What is the carrying cost?
Who owns it?
What triggers repayment?
```

Esempio ESI:

```text
TD-07
PostgreSQL HA is designed but not fully codified/verified in IaC.

Constraint
readiness depends on manual/unverified assumptions

Risk
configuration drift + recovery uncertainty

Carrying cost
production-readiness evidence remains open

Trigger
production-readiness gate
```

Questo è molto più utile di:

```text
infra needs cleanup
```

Microsoft Well-Architected tratta il technical debt come costo futuro di shortcut o solution suboptimal e raccomanda assessment periodici per osservare come il workload cambia.

Fonte:

- [Microsoft Learn — Complete an Azure Well-Architected Review assessment](https://learn.microsoft.com/en-us/azure/well-architected/design-guides/implementing-recommendations)

## Un portfolio di debito, non una guerra allo zero

Un sistema reale avrà sempre debito.

Possiamo distinguere:

```text
intentional debt
known accidental debt
unknown debt
```

Il terzo è particolarmente pericoloso perché non può entrare in nessuna priorità consapevole.

Fitness function, incident review, observability e assessment periodici servono anche a trasformare unknown debt in rischio visibile.

La domanda non è:

> Come arriviamo a zero debt?

È:

> **Quale debito stiamo scegliendo di portare e quale stiamo accumulando senza saperlo?**

## L'AI può accelerare il drift senza “sbagliare” la feature

Un agente riceve:

```text
implement feature X
```

Trova una dipendenza interna comoda, la usa e produce test funzionali verdi.

La feature funziona.

L'architettura peggiora.

Non serve attribuire all'AI una mancanza misteriosa di comprensione.

Il problema è che l'obiettivo locale e il contesto fornito erano più specifici dell'intento globale.

> **Un agente ottimizza soprattutto ciò che rendiamo visibile. Una regola architetturale che vive soltanto nella memoria del team è contesto perso.**

Questo è il motivo per cui alcune decisioni devono diventare documentazione, test, contract, metadata o altri feedback eseguibili.

## Il punto finale

L'evoluzione architetturale richiede due capacità contemporanee:

```text
protect decisions that still fit
```

e:

```text
notice when the context has invalidated them
```

Proteggere soltanto il primo produce rigidità.

Fare soltanto il secondo produce churn.

> **Un'architettura resta viva quando sa distinguere ciò che ha driftato da ciò che è semplicemente arrivato al momento di essere deciso di nuovo.**