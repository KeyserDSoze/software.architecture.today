# Capitolo 19 — Architecture Evolution

Un sistema non conserva la propria architettura perché un diagramma è stato approvato.

La conserva soltanto se il modo in cui continua a cambiare non distrugge accidentalmente le proprietà che il team aveva deciso di proteggere.

Il drift raramente arriva come una grande scelta evidentemente sbagliata.

Arriva una pull request alla volta.

```text
un import diretto "temporaneo"
una tabella letta dal modulo sbagliato
un retry senza budget
un vendor SDK introdotto nel core
una feature flag mai rimossa
un'eccezione di layering che diventa precedente
```

Ogni change può essere localmente ragionevole.

L'architettura reale è l'accumulo di quelle decisioni.

> **L'architecture drift nasce spesso da una lunga serie di ottimizzazioni locali che nessun feedback loop collega più all'intento globale.**

## Aggiungere il tempo all'architettura

Finora abbiamo costruito functional analysis, requirement, boundary, contract, ownership, security, reliability, observability e testing. Abbiamo poi studiato legacy e refactoring incrementale.

Ora aggiungiamo una dimensione esplicita:

```text
architecture
+
time
```

Una decisione può avere fit oggi e perderlo quando cambiano volume, team, cost curve, requirement normativi, threat model, cloud capability, business model o lifetime attesa.

Questo non rende sbagliata la decisione originaria.

Rende necessario sapere **quale cambiamento di contesto deve riaprirla**.

## Evolution non significa libertà di cambiare in qualunque direzione

Thoughtworks descrive l'evolutionary architecture come capacità di supportare **guided, incremental change across multiple dimensions**.

La parola decisiva è `guided`.

Un sistema che assorbe qualsiasi cambiamento senza proteggere caratteristiche importanti non è evolutivo.

È semplicemente privo di direzione.

Le fitness function servono a trasformare alcune decisioni in feedback ripetibile.

Possono essere:

```text
architecture test
CI policy
runtime SLI/SLO
security verification
cost measure
ownership check
recovery drill
periodic review
```

Il meccanismo dipende dalla proprietà.

Riferimenti:

- [Thoughtworks — Building Evolutionary Architectures, 2nd Edition](https://www.thoughtworks.com/insights/books/building-evolutionaryarchitectures-second-edition)
- [Thoughtworks — Fitness function-driven development](https://www.thoughtworks.com/en-gb/insights/articles/fitness-function-driven-development)
- [AWS Architecture Blog — Using Cloud Fitness Functions to Drive Evolutionary Architecture](https://aws.amazon.com/blogs/architecture/using-cloud-fitness-functions-to-drive-evolutionary-architecture/)

## Il feedback loop che ci interessa

Il capitolo seguirà questa sequenza:

```text
architectural intent
→ measurable / reviewable property
→ repeated evidence
→ drift or changed context
→ fix / exception / reopened decision
```

Questa distinzione è importante perché un gate rosso può significare due cose molto diverse.

### L'implementazione ha driftato

La decisione continua ad avere senso, ma il codice o la configurazione non la rispettano più.

```text
application imports infrastructure
public ingress appears unexpectedly
metric dimension becomes unbounded
```

Qui normalmente correggiamo l'implementazione.

### Il contesto è cambiato

L'implementazione continua a rispettare una decisione che non ha più fit.

```text
single-region is still implemented correctly
but regional RTO changed from 8h to 15m
```

Qui non dobbiamo “aggiustare il test”.

Dobbiamo riaprire la decisione.

> **Una governance utile deve aiutarci a distinguere drift dell'implementazione da scadenza dell'intento.**

## Non congelare l'architettura

Una reazione naturale al drift è aggiungere architecture board, template, review e approval.

Alcuni one-way door o vincoli regolamentati richiedono davvero review forti.

Ma se ogni decisione paga lo stesso costo organizzativo, la governance diventa una coda e i team imparano a bypassarla.

Microsoft Azure Well-Architected tratta il workload come qualcosa che cambia nel tempo e raccomanda assessment e miglioramento continui, non una certificazione architetturale una tantum.

Riferimenti:

- [Microsoft Learn — Azure Well-Architected Framework workloads](https://learn.microsoft.com/en-us/azure/well-architected/workloads)
- [Microsoft Learn — Complete an Azure Well-Architected Review assessment](https://learn.microsoft.com/en-us/azure/well-architected/design-guides/implementing-recommendations)

Il nostro obiettivo sarà quindi:

```text
cheap automatic feedback for understood rules
+ explicit temporary exceptions
+ human judgment for semantic/context change
```

Non più permessi.

Più intenzionalità.

## L'AI rende il problema più urgente

Un agente può modificare decine o centinaia di file più velocemente di quanto un reviewer possa leggere ogni riga.

Se l'architettura vive soltanto nella memoria del team, l'agente vede soprattutto ciò che il repository gli mostra e ottimizza l'obiettivo locale ricevuto.

Una feature può quindi essere funzionalmente corretta e architetturalmente regressiva.

Questo porta a una tesi che useremo anche nei capitoli sugli agenti:

> **quando la velocità di execution supera la velocità di review manuale, una parte dell'intento deve diventare context ed evidence eseguibile.**

Non tutto può essere automatizzato.

Ma ciò che abbiamo già deciso e sappiamo verificare non dovrebbe dipendere ogni volta dalla memoria di una singola persona.

## Il problema ESI

Order Operations possiede ormai una quantità significativa di decisioni e artefatti.

Platform Engineering vuole proteggere alcuni boundary con feedback automatico, per esempio:

```text
no direct legacy implementation dependency
application does not depend on integration
contracts remain independent
priority policy remains isolated
no Azure SDK leakage into core semantics
```

Commerce & Operations accetta il principio ma non vuole trasformare ogni PR in una architecture review.

Security vuole controlli ripetibili.

Product vuole lead time basso.

Finance non vuole un nuovo control plane costoso.

Gli architect non vogliono trasformare metriche e regole in dogmi eterni.

## Il compromesso ESI

**Esigenza:** permettere a Order Operations di evolvere senza perdere accidentalmente boundary e proprietà già deliberate.

**Tensione:** architectural integrity contro autonomia, feedback speed e costo della governance.

**Decisione:** poche fitness function ad alto valore, vicine al change; review umana quando cambia il significato o il contesto; eccezioni visibili e temporanee.

**Costo accettato:** alcune modifiche verranno bloccate automaticamente e alcune eccezioni richiederanno una giustificazione esplicita.

**Quality floor:** nessuna fitness function sostituisce functional analysis, threat modeling, trade-off reasoning o accountability umana.

**Guardrail:** Architecture Fitness Checklist, architecture tests, ADR review trigger, exception expiry, ownership e runtime evidence.

Alla fine del capitolo la domanda non sarà:

> L'architettura è conforme?

Sarà:

> **Quale proprietà stiamo proteggendo, quale evidence ci dice che sta ancora reggendo e che cosa dobbiamo fare quando quella evidence cambia?**