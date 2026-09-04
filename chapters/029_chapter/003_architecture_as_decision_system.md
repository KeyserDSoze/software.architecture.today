# L'architettura come sistema di decisioni

Se dovessimo comprimere la definizione di Software Architecture emersa nel libro, potremmo dire:

> **Architecture è il sistema con cui rendiamo intenzionali le conseguenze importanti.**

Non è il diagramma.

Non è il framework.

Non è la scelta del cloud provider.

Non è il numero di servizi.

Non è neppure una singola decisione molto importante.

È il modo in cui colleghiamo:

```text
contesto
→ requisito
→ alternativa
→ trade-off
→ decisione
→ conseguenza
→ evidence
→ review trigger
```

Questa definizione diventa ancora più utile quando l'AI può produrre velocemente alternative tecnicamente plausibili.

---

## Il diagramma può arrivare dopo

Un diagramma è utile quando comprime una parte importante del sistema.

Ma può diventare pericoloso quando produce una falsa sensazione di comprensione.

Un box chiamato `Payments` non dice:

- chi possiede la semantica economica;
- se Order Operations può modificare lo stato;
- se la chiamata è sincrona;
- quale failure è tollerato;
- quale dato può essere copiato;
- quale authorization serve;
- come evolve il contract.

Per questo abbiamo ripetuto:

> **Non progettare il rettangolo. Progetta il comportamento del sistema.**

L'AI può generare un diagramma perfettamente leggibile di un sistema che non dovrebbe esistere.

La sintassi della rappresentazione non certifica la qualità della decisione.

---

## Fit before fashion

Fra tutti i principi emersi, uno attraversa quasi ogni capitolo:

> **Una tecnologia non è buona in assoluto. È buona quando è adatta al problema che dobbiamo risolvere.**

Lo abbiamo applicato a:

```text
monolith vs microservices
REST vs messaging
PostgreSQL vs altri datastore
cache
Kubernetes
PaaS
multi-region
pattern
RAG
multi-agent
framework di test
```

La maturità non consiste nell'usare la soluzione più sofisticata.

Consiste nel riconoscere quando la sofisticazione compra una proprietà che vale il suo costo.

Per questo abbiamo potuto scrivere:

> **Una tecnologia vecchia può essere la scelta più moderna.**

“Moderna” non descrive l'anno di nascita del tool.

Descrive la qualità della decisione rispetto al contesto corrente.

---

## Ogni proprietà ha un prezzo

Reliability, security, isolation, performance, autonomy e observability non sono gratuite.

Nemmeno simplicity è gratuita.

Scegliere semplicità può significare rinunciare a una forma di isolation o scaling.

Scegliere isolation può significare pagare distribuzione, deployment, network failure e cognitive load.

Scegliere private connectivity può aumentare costo e complessità operativa.

Scegliere una forte auditability può aumentare storage e governance.

Scegliere multi-region può cambiare radicalmente data consistency, deployment e incident response.

L'architettura non elimina questi costi.

Li rende visibili abbastanza presto da poter decidere se pagarli.

---

## Il compromesso non è una scusa

Nel mondo ESI abbiamo usato quasi ogni capitolo per mostrare un conflitto fra esigenze legittime.

Product voleva velocità.

Security voleva ridurre attack surface.

Finance voleva sostenibilità economica.

Operations voleva recovery e diagnosi.

Platform voleva standardizzazione.

I team prodotto volevano autonomia.

Da qui abbiamo definito una regola:

> **Un trade-off accetta un costo consapevole per ottenere un beneficio prioritario. Una scorciatoia nasconde un costo e spera che non presenti il conto.**

Un compromesso architetturale sano deve quindi contenere almeno:

```text
esigenza
trade-off
costo accettato
quality floor
guardrail
review trigger
```

Il **quality floor** è ciò che impedisce alla parola “pragmatismo” di diventare una licenza per fare qualunque cosa.

Possiamo accettare single-region.

Non possiamo fingere che significhi multi-region resilience.

Possiamo rinviare una projection asincrona.

Non possiamo perdere data ownership.

Possiamo scegliere un rollout ristretto.

Non possiamo modificare la definizione di evidence solo per rispettare la data.

---

## Reversibilità

Un'altra distinzione fondamentale è stata quella fra one-way e two-way door.

Ma anche qui abbiamo imparato a essere più precisi.

Una modifica può essere facilmente reversibile nel codice e difficilissima da invertire nel sistema reale.

Per esempio:

```text
API pubblicata
schema consumato da altri team
dato migrato distruttivamente
cliente onboarded
workflow economico avviato
permission distribuita
```

possono rendere costosa una decisione anche se `git revert` richiede pochi secondi.

Quindi:

> **Reversibile nel codice non significa reversibile nella realtà.**

Da qui derivano expand/contract, shadow mode, feature flag, dual path, canary, compensation e migration gate.

Non perché dobbiamo rendere ogni decisione reversibile per sempre.

Ma perché dobbiamo riconoscere quando stiamo attraversando il point of no return.

---

## Architecture debt come decisione differita

Technical debt viene spesso usato come sinonimo di codice che non ci piace.

Nel libro abbiamo preferito una lettura più decisionale:

```text
constraint created
risk
carrying cost
owner
repayment trigger
```

In questo modo il debito diventa governabile.

Una scelta temporanea può essere perfettamente corretta.

Diventa pericolosa quando perdiamo:

- il motivo per cui era temporanea;
- l'owner;
- il costo che produce;
- il trigger che avrebbe dovuto farci riaprire la decisione.

L'AI può rendere molto economico introdurre workaround e compatibility layer.

Proprio per questo dobbiamo diventare migliori nel ricordare **perché esistono e quando devono sparire**.

---

## Architecture evolution

Una buona architettura non è quella che indovina il futuro.

È quella che rende sostenibile scoprire che avevamo torto.

Questa idea ha guidato ADR, fitness function, review trigger e architecture exception.

Abbiamo distinto:

```text
implementation drift
vs
context drift
```

Il codice può violare la decisione.

Oppure può rispettarla perfettamente mentre la decisione è diventata obsoleta.

Il primo caso può spesso essere rilevato da un test.

Il secondo richiede ancora judgment.

Per questo l'architettura non può essere completamente “automatizzata”.

Possiamo automatizzare l'enforcement di ciò che abbiamo capito.

Non possiamo automatizzare una volta per tutte il significato di ciò che conta.

---

## La domanda che rimane

Alla fine, gran parte dell'architecture work può essere condensato in poche domande ricorrenti:

```text
Quale problema risolve?
Quale proprietà compra?
Che cosa costa?
Come può fallire?
Chi possiede il risultato?
Come lo verifichiamo?
Quando dovremo riaprire la decisione?
```

Gli strumenti cambieranno.

Queste domande invecchieranno molto più lentamente.