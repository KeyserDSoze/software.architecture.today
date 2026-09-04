# Evidence prima della confidence

Uno dei rischi più persistenti del software engineering è confondere una sensazione di sicurezza con una prova. Una demo funziona, la suite è verde, il diagramma è convincente, il deploy è riuscito una volta, il modello ha risposto bene a tre prompt.

Tutto questo può essere utile. Non tutto sostiene lo stesso claim.

Per questo il libro ha costruito due vocabolari intenzionalmente precisi:

```text
Designed → Codified → Verified → Monitored

Found → Inferred → Observed → Confirmed
```

Non sono scale burocratiche. Servono a impedire che il linguaggio dica più di quanto sappiamo.

## Non promuovere il claim oltre la prova

Un restore process può essere progettato bene, i backup configurati e RTO/RPO documentati. Finché nessuno esegue il ripristino nel boundary rilevante non abbiamo restore evidence.

Allo stesso modo, Bicep codificato non è Azure deployment verificato; un private endpoint progettato non dimostra la connectivity; un eval dataset non dimostra model quality; un runbook non prova che la procedura possa essere eseguita da chi sarà on-call.

Questa precisione sembra eccessiva soltanto finché il sistema non fallisce.

> **Designed descrive l'intento. Verified descrive ciò che siamo riusciti a dimostrare.**

## Il numero dei test è una metrica povera

Nel testing abbiamo distinto `code executed` da `fault detected`. Una suite enorme può proteggere poco; una suite più piccola può essere eccellente se rende falsificabili gli invariant importanti.

La domanda utile è:

> **Quale modifica sbagliata dovrebbe far fallire questo test?**

Con test generati dall'AI questa domanda diventa ancora più importante. Se implementation e oracle derivano dalla stessa interpretazione errata, la suite può dimostrare soprattutto che il sistema è coerente con se stesso.

Requirement, contract, invariant, threat e failure mode devono quindi alimentare la testing strategy invece di essere ricostruiti a posteriori dai test che abbiamo già.

## Verification without re-execution

Più execution deleghiamo, meno è sostenibile verificare rifacendo manualmente tutto il lavoro. Il supervisore diventerebbe il nuovo collo di bottiglia.

La risposta è costruire evidence che permetta di verificare senza replicare ogni passaggio: test deterministici, integration su dependency reali, contract test, architecture fitness, security policy, migration evidence, shadow comparison, canary, recovery drill e independent review quando il rischio lo richiede.

La review umana resta preziosa dove compra judgment. Dove una property è meccanicamente verificabile, il guardrail dovrebbe rispondere automaticamente.

Se un dependency rule può essere controllato a ogni commit, non serve che l'architect lo ricordi in ogni PR. Se cambia un RTO da otto ore a quindici minuti, invece, nessun lint può decidere da solo la nuova architettura.

## Proteggere l'oracolo

Con gli agenti abbiamo incontrato un failure mode centrale: **green-by-editing-the-oracle**.

Se lo stesso executor può cambiare implementation, test, fixture, architecture policy e acceptance criterion, può rendere verde il sistema ridefinendo ciò che significa "corretto".

Questo non significa che test e policy siano immutabili. Significa che cambiare il criterio che giudica il proprio lavoro è una decisione diversa dal cambiare il lavoro.

A seconda del rischio può servire un reviewer, un human gate, una permission separation o semplicemente uno scope che impedisca all'executor di modificare l'oracle.

## Provenance prima dell'eloquenza

"PostgreSQL test passed" è un summary. Un evidence package utile collega il claim all'environment, alla versione, al meccanismo di test, al risultato, all'artifact primario e alle limitation.

Questo vale ancora di più nell'era degli agenti, perché un modello può produrre un report impeccabile di un test che non è mai stato eseguito.

> **La provenance dell'evidence vale più dell'eloquenza del summary.**

Il punto non è collezionare log. È poter ricostruire quale prova sosteneva quale affermazione e dove quella prova smetteva di essere valida.

## `Unknown` è una risposta professionale

La Production Readiness Review ha usato stati come `BLOCKER`, `ACCEPTED RISK`, `FOLLOW-UP` e `UNKNOWN`. Quest'ultimo è particolarmente importante.

Le organizzazioni hanno spesso pressione a trasformare rapidamente ogni incertezza in una risposta. L'AI aumenta la pressione perché può quasi sempre proporre una spiegazione plausibile.

Ma `non sappiamo ancora` può essere la risposta tecnicamente corretta. Non è una resa: identifica il punto in cui serve evidence migliore.

Maturity non significa avere sempre una risposta. Significa anche sapere quando la risposta non è ancora giustificata.

## Il NO-GO di Order Operations è parte del metodo

La Production Readiness Review del capstone resta:

```text
PRR-OO-001
NO-GO — evidence closure required
```

Order Operations possiede architecture intent, threat model, reliability e observability contract, IaC, test locali, agent governance e AI Feature Contract. Mancano però prove reali su alcuni boundary launch-critical.

Avremmo potuto chiudere la storia con un lancio riuscito. Sarebbe stato più cinematografico e meno coerente.

La conclusione corretta è più utile:

> **Sappiamo molto meglio che cosa manca per poter dichiarare production-ready il sistema.**

Il `NO-GO` non invalida l'architettura. Dimostra che non stiamo promuovendo `Designed` e `Codified` a `Verified` soltanto per completare la narrazione.

## Confidence come conseguenza

Confidence utile non dovrebbe essere l'input "mi sembra solido, lanciamo". Dovrebbe emergere dalla catena claim, expected property, verification, evidence, limitation e risk acceptance.

Non otterremo certezza assoluta. Il sistema reale contiene dipendenze, workload, operatori e contesti che cambiano.

L'obiettivo è sapere che cosa stiamo promettendo, quali failure abbiamo preparato, quali restano possibili, come li rileveremo e chi reagirà.

Non ottimismo. Non perfezione.

**Evidence proporzionata alla promessa.**
