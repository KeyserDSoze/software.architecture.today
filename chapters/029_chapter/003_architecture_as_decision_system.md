# L'architettura come sistema di decisioni

Se dovessimo comprimere la definizione di Software Architecture emersa nel libro, potremmo dire:

> **Architecture è il sistema con cui rendiamo intenzionali le conseguenze importanti.**

Non è il diagramma, il framework, il cloud provider o il numero di servizi. È il modo in cui colleghiamo contesto, requisito, alternative, trade-off, decisione, conseguenze, evidence e review trigger.

Questa definizione diventa più utile proprio quando l'AI può produrre in poco tempo molte alternative tecnicamente plausibili.

## Il diagramma rappresenta. Non decide

Un box chiamato `Payments` non dice chi possiede la semantica economica, quale failure è tollerato, se Order Operations può cambiare lo stato, quale authorization serve o come evolve il contract.

Un diagramma può comprimere bene una parte del sistema e comunque nascondere le decisioni che lo rendono corretto.

> **Non progettare il rettangolo. Progetta il comportamento del sistema.**

L'AI può generare una rappresentazione perfettamente leggibile di un sistema che non dovrebbe esistere. La qualità della sintassi non certifica il judgment che l'ha prodotta.

## Fit before fashion

Uno dei principi più persistenti del libro è che una tecnologia non è buona in assoluto: ha fit oppure non lo ha rispetto al problema, alle quality attribute, ai vincoli, al team, al costo, all'operabilità e all'evoluzione attesa.

Lo abbiamo applicato a monolith e microservices, REST e messaging, datastore, cache, Kubernetes, PaaS, multi-region, RAG e multi-agent orchestration.

La sofisticazione è giustificata quando compra una property che vale il costo. Non quando dimostra che il team conosce la tecnologia del momento.

> **Una tecnologia vecchia può essere la scelta più moderna.**

"Moderna" qui descrive la qualità della decisione nel contesto corrente, non l'anno di nascita del tool.

## Ogni property presenta un conto

Reliability, isolation, performance, observability, autonomy e security non sono gratuite. Nemmeno la semplicità lo è.

Scegliere isolation può introdurre distribuzione e operational cost. Scegliere private connectivity può aumentare tier e networking complexity. Scegliere multi-region può cambiare consistency, deployment e incident response. Scegliere semplicità può rinviare una capability che un giorno servirà.

L'architettura non elimina questi costi. Li rende visibili abbastanza presto da decidere se pagarli.

## Trade-off e scorciatoia

Nel mondo ESI Product, Security, Finance, Operations, Platform e team prodotto hanno portato esigenze legittime e spesso incompatibili fra loro.

Da qui una distinzione che vale più di molti pattern:

> **Un trade-off accetta un costo consapevole per ottenere un beneficio prioritario. Una scorciatoia nasconde un costo e spera che non presenti il conto.**

Un compromesso sano espone almeno esigenza, costo accettato, quality floor e review trigger. Il quality floor impedisce che il pragmatismo diventi un modo elegante per abbassare una property senza dichiararlo.

Possiamo accettare single-region; non possiamo chiamarlo multi-region resilience. Possiamo rinviare una capability; non possiamo far sparire la relativa ownership. Possiamo ridurre il launch boundary; non possiamo rinominare un blocker solo perché la data si avvicina.

## Reversibility vive nel sistema reale

Un `git revert` rapido non rende reversibile un public contract già adottato, uno schema consumato da altri team, un dato migrato distruttivamente, una permission distribuita o un workflow economico già avviato.

> **Reversibile nel codice non significa reversibile nella realtà.**

Per questo abbiamo usato expand/contract, shadow mode, feature flag, dual path, canary, compensation e migration gate. Non per conservare ogni via di fuga per sempre, ma per sapere quando stiamo attraversando un point of no return.

La one-way door richiede una evidence bar più alta proprio perché dopo il passo alcune alternative smettono di esistere.

## Il debito è una decisione che deve conservare memoria

Una scelta temporanea può essere perfettamente sensata. Diventa pericolosa quando perdiamo il motivo per cui era temporanea, l'owner, il carrying cost e il trigger che avrebbe dovuto farci riaprire la decisione.

L'AI rende economico introdurre workaround, adapter e compatibility layer. Questo aumenta il bisogno di ricordare perché esistono e quale evidence ne autorizzerà la rimozione.

Il debito governabile non è "codice brutto". È una constraint scelta con costo, rischio, owner e repayment trigger leggibili.

## Una buona architettura sa scoprire di avere torto

Il codice può violare una decisione: implementation drift. Oppure può rispettarla perfettamente mentre il contesto è cambiato e la decisione è diventata obsoleta: context drift.

Il primo caso può spesso essere rilevato automaticamente. Il secondo richiede ancora judgment.

Possiamo automatizzare l'enforcement di ciò che abbiamo capito. Non possiamo congelare per sempre il significato di ciò che conta.

Per questo una buona architettura non è quella che indovina il futuro. È quella che rende sostenibile scoprire che avevamo torto.

Alla fine le domande cambiano molto più lentamente degli strumenti:

> Quale problema risolve? Quale property compra? Che cosa costa? Come può fallire? Chi possiede il risultato? Come lo verifichiamo? Quando riapriremo la decisione?

Se queste risposte restano leggibili, l'architettura può evolvere anche quando la tecnologia cambia completamente.
