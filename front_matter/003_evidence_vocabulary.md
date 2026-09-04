# Legenda dell'evidence

Questo libro usa parole come *designed*, *verified* ed *observed* in modo intenzionalmente restrittivo. Non sono sinonimi di “sembra a posto”: servono a evitare che il linguaggio prometta più di quanto l'evidence disponibile permetta di sostenere.

## Artifact e capability

Per descrivere la maturità di una proprietà o di una decisione useremo quattro termini distinti:

```text
Designed
→ Codified
→ Verified
→ Monitored
```

**Designed** significa che la proprietà o la decisione è stata esplicitata nel design. **Codified** significa che ne esiste una rappresentazione concreta, per esempio codice, configurazione, policy, test o Infrastructure as Code. **Verified** richiede invece evidence adeguata al claim: un test unitario non verifica una proprietà di rete reale, così come una configurazione di backup non dimostra che il restore funzioni. **Monitored**, infine, significa che la proprietà rilevante produce un segnale runtime osservabile e governato.

Queste parole non sono intercambiabili. Una proprietà può essere Designed senza essere Verified, Codified senza essere Verified e Verified senza essere Monitored. Il passaggio da un livello al successivo richiede quindi un tipo di evidenza diverso, non soltanto più documentazione.

## Conoscenza del legacy

Quando ricostruiamo un sistema esistente useremo una scala diversa:

```text
Found
→ Inferred
→ Observed
→ Confirmed
```

**Found** indica che abbiamo individuato un artifact, una regola, una query, un commento o un comportamento candidato. **Inferred** significa che abbiamo formulato un'interpretazione plausibile. **Observed** richiede evidence del comportamento reale in un contesto definito. **Confirmed** significa invece che quel comportamento è stato riconosciuto come requisito, vincolo o verità target da chi ne possiede l'autorità.

La distinzione più importante è:

> **Observed ≠ Confirmed.**

Il legacy può contenere bug, workaround e comportamenti accidentali. Osservarli non li trasforma automaticamente nel sistema che vogliamo costruire.

## AI e agenti

Per i sistemi agentici separeremo sempre quattro concetti:

```text
capability
≠ permission
≠ authorization
≠ autonomy
```

La **capability** descrive ciò che un agente è tecnicamente in grado di fare. La **permission** descrive l'accesso tecnico che gli è stato concesso. L'**authorization** stabilisce se quell'azione è consentita nel contesto corrente. L'**autonomy** descrive infine quanto l'agente possa procedere senza una decisione umana esplicita.

Un agente che può compiere un'azione non è quindi automaticamente autorizzato a decidere quando compierla. Allo stesso modo, un output generato dall'AI non diventa una fonte autorevole soltanto perché è plausibile, e una seconda review AI non costituisce automaticamente independent evidence.

## Production readiness

Un documento di readiness non rende pronto un sistema. Una configurazione di backup non equivale a un recovery verificato, così come avere Infrastructure as Code non dimostra che il deployment reale sia stato verificato.

```text
PRR document ≠ production readiness
backup configured ≠ recovery Verified
IaC Codified ≠ deployment Verified
```

Nel capstone **Order Operations** la Production Readiness Review resta deliberatamente **NO-GO — evidence closure required** finché i blocker dichiarati non vengono chiusi con evidence primaria adeguata.

Questa disciplina non serve a rendere il libro più burocratico. Serve a impedire che il linguaggio promuova una promessa più in alto dell'evidence che possediamo.