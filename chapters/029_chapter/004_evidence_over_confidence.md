# Evidence prima della confidence

Uno dei rischi più persistenti del software engineering è confondere una sensazione di sicurezza con una prova.

La demo funziona.

La suite è verde.

Il diagramma è convincente.

Il deploy è riuscito una volta.

Il modello ha risposto bene a tre prompt.

Il team ha esperienza.

Tutto questo può essere utile.

Ma non tutto ha lo stesso peso.

Per questo nel libro abbiamo costruito un vocabolario semplice:

```text
Designed
→ Codified
→ Verified
→ Monitored
```

E per il legacy:

```text
Found
→ Inferred
→ Observed
→ Confirmed
```

Questi stati non sono una scala burocratica.

Servono a impedire che il linguaggio dica più di quanto sappiamo.

---

## Designed non significa funzionante

Possiamo progettare un restore process corretto sulla carta.

Possiamo documentare RTO e RPO.

Possiamo scegliere backup e PITR.

Finché non ripristiniamo realmente il sistema, non abbiamo restore evidence.

Allo stesso modo:

```text
Bicep Codified
≠ Azure deployment Verified

private endpoint Designed
≠ connectivity Verified

AI eval dataset Codified
≠ model quality Verified

runbook exists
≠ procedure exercised
```

Questa precisione sembra pedante finché non arriva un incidente.

Durante un incidente diventa la differenza fra una capacità reale e una speranza documentata.

---

## Molti test non significano molta confidenza

Nel testing abbiamo separato:

```text
code executed
≠
fault detected
```

Una suite enorme può essere debole.

Una suite più piccola può proteggere molto bene gli invariant che contano.

La domanda importante non è soltanto:

> quanti test abbiamo?

Ma:

> **quale modifica sbagliata dovrebbe far fallire questo test?**

Questa domanda diventa ancora più importante quando i test possono essere generati rapidamente dall'AI.

Se l'implementazione genera implicitamente il proprio oracolo, possiamo ottenere un sistema che dimostra soprattutto di essere coerente con se stesso.

È per questo che requirement, contract, invariant, threat e failure mode devono alimentare la testing strategy.

---

## Verification without re-execution

Se aumentiamo la quantità di execution delegata, non possiamo rispondere ricontrollando manualmente ogni dettaglio.

Il supervisore diventerebbe il nuovo collo di bottiglia assoluto.

Abbiamo quindi cercato meccanismi di **verification without re-execution**:

```text
unit/property test
integration test
contract test
architecture fitness
security policy
static analysis
migration evidence
observability
canary
shadow comparison
recovery drill
independent review
```

L'obiettivo non è eliminare la review umana.

È usare la review umana dove il judgment umano compra realmente qualcosa.

Se una dependency rule può essere verificata deterministicamente a ogni commit, non serve che un architect la ricordi a mano in ogni pull request.

Se invece il business cambia un RTO da otto ore a quindici minuti, nessun import test può decidere da solo che cosa significa per il sistema.

---

## L'oracolo deve essere protetto

Con gli agenti abbiamo incontrato un failure mode particolarmente importante:

> **green-by-editing-the-oracle**

Se lo stesso executor può:

```text
modificare il comportamento
modificare il test
modificare la fixture
modificare la policy architetturale
modificare il criterio di acceptance
```

può far diventare verde il sistema senza avere soddisfatto l'intento originale.

Questo non significa che i test non debbano mai cambiare.

Significa che modificare il criterio che giudica il proprio lavoro è una decisione diversa dal modificare il lavoro.

A volte serve un reviewer indipendente.

A volte serve un human gate.

A volte basta separare scope e permission.

Ma la distinzione deve esistere.

---

## L'evidence ha provenance

Un summary dice:

```text
PostgreSQL test passed.
```

Un Verification Bundle dovrebbe poter dire:

```text
claim
→ PaymentEscalation + OutboxMessage commit atomically

environment
→ PostgreSQL version / schema / isolation

mechanism
→ integration test with forced second-write failure

result
→ PASS / FAIL

artifact
→ logs / test output / commit

limitations
→ what was not verified
```

Questa provenance è fondamentale nell'era degli agenti.

Un modello può produrre un summary molto convincente di un test che non è mai stato eseguito.

Il valore non sta quindi nella qualità retorica del report.

Sta nel collegamento fra claim ed evidence primaria.

> **La provenance dell'evidence vale più dell'eloquenza del summary.**

---

## Unknown è uno stato legittimo

In Production Readiness abbiamo usato:

```text
BLOCKER
ACCEPTED RISK
FOLLOW-UP
UNKNOWN
```

`UNKNOWN` è importante.

Molte culture engineering hanno una pressione implicita a trasformare rapidamente ogni incertezza in una risposta.

L'AI aumenta questa pressione perché può quasi sempre proporre una spiegazione plausibile.

Ma:

> **non sappiamo ancora**

è spesso la risposta tecnicamente più corretta.

Non è una resa.

È un invito a produrre evidence migliore.

La maturity non consiste nell'avere sempre una risposta.

Consiste anche nel sapere quando la risposta non è ancora giustificata.

---

## Il caso Order Operations

La Production Readiness Review di Order Operations è volutamente rimasta:

```text
NO-GO — evidence closure required
```

Nonostante:

- un'architettura estesa;
- un threat model;
- un reliability contract;
- un observability contract;
- IaC codificato;
- test locali;
- agent governance;
- AI Feature Contract.

Perché mancano ancora prove reali su alcuni boundary.

Questo è forse uno dei risultati più importanti del capstone.

Il libro avrebbe potuto chiudere la storia dicendo:

> e finalmente il sistema andò in produzione.

Sarebbe stato narrativamente soddisfacente.

Ma avrebbe contraddetto il metodo.

La storia corretta è:

> **sappiamo molto meglio che cosa manca per poterlo dire.**

---

## Confidence come conseguenza

Confidence non dovrebbe essere un input della decisione:

```text
mi sembra solido
→ lanciamo
```

Dovrebbe emergere da un sistema di evidence:

```text
claim
→ expected property
→ verification
→ evidence
→ known limitation
→ risk acceptance
```

Non otterremo mai certezza assoluta.

Il software reale contiene dipendenze, operatori, workload, reti e contesti che cambiano.

L'obiettivo non è provare che niente andrà storto.

È sapere abbastanza bene:

```text
che cosa stiamo promettendo
quali failure abbiamo preparato
quali failure restano possibili
come li rileveremo
chi reagirà
```

Questa è confidence utile.

Non ottimismo.

Non perfezione.

**Evidence proporzionata alla promessa.**