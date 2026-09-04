# 19.3 — Architecture drift, ADR e decisioni che scadono

Un'architettura non degrada soltanto quando qualcuno viola una regola.

Può degradare anche quando una regola continua a essere rispettata ma **il contesto che la giustificava non esiste più**.

Questo è un problema diverso.

Nel Capitolo 4 abbiamo introdotto gli ADR come record di decisione.

Adesso aggiungiamo il tempo.

Un ADR non dovrebbe dire soltanto:

```text
Decision
Consequences
```

Dovrebbe anche aiutarci a capire:

```text
Under which assumptions?
Until when?
What would make us revisit it?
```

## Decisioni senza trigger

Consideriamo una decisione ESI già presa:

```text
Order Operations remains single-region.
```

Era ragionevole perché il business aveva accettato:

```text
region-wide RTO <= 8h
RPO <= 1h
```

Se domani un contratto enterprise richiede:

```text
RTO <= 15m anche per region failure
```

l'ADR non diventa "sbagliato" retroattivamente.

È semplicemente scaduto il contesto che lo rendeva adatto.

> **Una decisione architetturale può restare ben ragionata e diventare comunque obsoleta.**

## Review trigger

Ogni ADR significativo dovrebbe avere trigger come:

- volume oltre una soglia;
- nuovo team owner;
- nuovo public ingress;
- nuovo requisito compliance;
- SLO non raggiunto;
- costo oltre budget;
- incident class ricorrente;
- capability cloud diventata disponibile;
- technology support lifecycle;
- consumer count significativamente diverso;
- domain boundary cambiato.

Questo ci evita due estremi.

### Architecture amnesia

Nessuno ricorda perché la scelta esiste.

Quindi la si mantiene per inerzia.

### Architecture churn

Ogni nuova tecnologia riapre decisioni già buone senza che sia cambiato il problema.

Il review trigger dice:

> **non rimettere in discussione tutto continuamente; riapri la decisione quando cambia una delle forze che la sostenevano.**

## Drift di implementazione e drift di contesto

Conviene separarli.

### Implementation drift

L'implementazione non rispetta più l'intento.

Esempi:

```text
application imports infrastructure
module reads foreign table
public endpoint appears despite private-ingress decision
new metric contains orderId dimension
```

Può essere intercettato da test, policy e runtime checks.

### Context drift

L'implementazione rispetta ancora l'intento, ma l'intento non soddisfa più il contesto.

Esempi:

```text
single region still implemented correctly
but RTO changed
```

Qui serve review.

Nessun linter può dedurre da solo che il business ha cambiato strategia.

## Technical debt come rischio, non come vergogna

`Technical debt` viene spesso usato come contenitore per tutto ciò che non ci piace.

Questo lo rende poco utile.

Nel libro useremo un modello più operativo.

Una debt item dovrebbe dire:

```text
What constraint does it create?
Which future change becomes harder?
Which failure becomes more likely?
What is the carrying cost?
What triggers repayment?
Who owns the decision?
```

Esempio:

```text
TD-07
PostgreSQL HA is designed but not yet codified in IaC.

Risk:
manual provisioning drift
unverified recovery posture

Carrying cost:
readiness uncertainty

Trigger:
production-readiness gate
```

Questo è molto più utile di:

> "infra needs cleanup".

Microsoft Well-Architected descrive il technical debt come costo futuro associato a scorciatoie o soluzioni subottimali e raccomanda di monitorare l'evoluzione del workload attraverso assessment periodici e milestone.

Riferimento:

- [Microsoft Learn — Complete an Azure Well-Architected Review assessment](https://learn.microsoft.com/en-us/azure/well-architected/design-guides/implementing-recommendations)

## Debt portfolio

Un sistema enterprise avrà sempre debt.

La domanda non è:

> possiamo arrivare a zero?

È:

> stiamo scegliendo quale debito portare oppure lo stiamo soltanto accumulando?

Possiamo classificare:

```text
intentional debt
known accidental debt
unknown debt
```

L'ultima categoria è la più pericolosa.

Fitness function, observability e review periodiche servono anche a trasformare una parte dell'unknown debt in rischio visibile.

## Drift prodotto dall'AI

L'AI rende più facile produrre un tipo particolare di drift.

Un agente riceve:

```text
implement feature X
```

Trova una dipendenza interna comoda.

La usa.

I test funzionali passano.

La feature è corretta.

L'architettura peggiora.

Questo non richiede una "AI cattiva".

Richiede soltanto che l'obiettivo locale sia più specifico dell'intento architetturale globale.

> **Un agente ottimizza ciò che gli rendiamo visibile. I vincoli architetturali che restano soltanto nella testa del team sono contesto perso.**

Per questo il repository deve contenere almeno una parte delle proprie regole in forma interrogabile ed eseguibile.

## Architecture review come feedback loop

Microsoft raccomanda che l'architect continui a verificare dopo il go-live se health model, cost model, scaling assumptions e design hypotheses corrispondono al comportamento reale, e che proponga miglioramenti prima della crisi.

Riferimento:

- [Microsoft Learn — Support the workload in a consultative role](https://learn.microsoft.com/en-us/azure/well-architected/architect-role/ongoing-support)

Questo cambia il ruolo dell'architect.

Non è il custode del diagramma iniziale.

È uno dei responsabili del feedback loop fra:

```text
intent
→ implementation
→ runtime evidence
→ changed context
→ new decision
```

> **L'architettura non è stabile quando non cambia. È stabile quando sa distinguere ciò che deve restare da ciò che deve poter cambiare.**
