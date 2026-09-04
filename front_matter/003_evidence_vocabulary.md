# Legenda dell'evidence

Questo libro usa parole come *designed*, *verified* ed *observed* in modo intenzionalmente restrittivo.

Non sono sinonimi di “sembra a posto”.

## Artifact e capability

```text
Designed
→ Codified
→ Verified
→ Monitored
```

**Designed** significa che la proprietà o la decisione è stata esplicitata nel design.

**Codified** significa che esiste una rappresentazione concreta: codice, configurazione, policy, test, Infrastructure as Code o altro artifact verificabile.

**Verified** significa che possediamo evidence adeguata alla proprietà dichiarata. Il tipo di evidence dipende dal claim: un test unitario non verifica una proprietà di rete reale; una configurazione di backup non verifica il restore.

**Monitored** significa che la proprietà rilevante produce un segnale runtime osservabile e governato. `Verified` non implica automaticamente `Monitored`.

Quindi:

```text
Designed ≠ Verified
Codified ≠ Verified
Verified ≠ Monitored
```

## Conoscenza del legacy

Quando ricostruiamo un sistema esistente usiamo una scala diversa:

```text
Found
→ Inferred
→ Observed
→ Confirmed
```

**Found**: abbiamo trovato un artifact, una regola, una query, un commento o un comportamento candidato.

**Inferred**: abbiamo formulato un'interpretazione plausibile.

**Observed**: abbiamo evidence che il sistema esistente si comporta realmente in quel modo in un contesto definito.

**Confirmed**: il comportamento è stato riconosciuto come requisito, vincolo o verità target da chi ne possiede l'autorità.

La distinzione più importante è:

> **Observed ≠ Confirmed.**

Il legacy può contenere bug, workaround e comportamenti accidentali. Osservarli non li trasforma automaticamente nel sistema che vogliamo costruire.

## AI e agenti

Per i sistemi agentici separiamo sempre:

```text
capability
≠ permission
≠ authorization
≠ autonomy
```

Un agente che *può* compiere un'azione non è per questo autorizzato a decidere quando compierla.

Un output generato dall'AI non è una fonte autorevole soltanto perché è plausibile. Una seconda review AI non è automaticamente independent evidence.

## Production readiness

Un documento di readiness non rende pronto un sistema.

```text
PRR document
≠ production readiness

backup configured
≠ recovery Verified

IaC Codified
≠ deployment Verified
```

Nel capstone **Order Operations** la Production Readiness Review resta deliberatamente **NO-GO — evidence closure required** finché i blocker dichiarati non vengono chiusi con evidence primaria adeguata.

Questa disciplina non serve a rendere il libro più burocratico.

Serve a evitare che il linguaggio promuova una promessa più in alto dell'evidence che possediamo.