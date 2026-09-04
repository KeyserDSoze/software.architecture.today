# 28.4 — Judgment: decidere quando l'execution è abbondante

Quando l'AI riduce il costo di produrre alternative, prototipi, documenti e implementazioni, il collo di bottiglia non scompare. Si sposta.

Diventa più importante decidere quale problema vale la pena risolvere, quale alternativa ha fit migliore, quale rischio possiamo accettare, quanta evidence serve e quando una decisione deve essere riaperta.

Possiamo chiamare tutto questo **judgment**, purché non lo trasformiamo in una parola mistica.

Nel contesto del libro, judgment significa prendere decisioni esplicite sotto vincoli incompleti sapendo quali assunzioni stiamo facendo e quale evidence potrebbe farci cambiare idea.

> **Il judgment non è avere sempre ragione. È costruire decisioni che possono essere corrette quando la realtà dimostra che avevano torto.**

## Preferenza e decisione non sono la stessa cosa

"Preferisco PostgreSQL" è una preferenza. "Questo workload richiede transazioni locali forti, access pattern relazionali noti, competence disponibile e managed operation; PostgreSQL ha il fit migliore oggi e la scelta va riaperta se cambiano scala, isolation requirement o access pattern" è una decisione governabile.

La differenza non sta nella lunghezza del documento. Sta nel fatto che context, forces, consequences, assumptions, evidence e review trigger sono abbastanza visibili da permettere a qualcun altro di ricostruire il ragionamento.

È per questo che abbiamo usato gli ADR lungo il libro. Non per accumulare verbali, ma per rendere le preferenze contestabili e aggiornabili.

## Trade-off significa proteggere il floor e scegliere dove ottimizzare

Product può chiedere time-to-market, Security maggiore isolation, Operations recovery semplice, Finance un run rate più basso, Platform standardizzazione e il team minore cognitive load. Sono tutte richieste legittime e non sempre esiste una soluzione che le massimizzi contemporaneamente.

Il lavoro architetturale non consiste nel trovare la "best practice" che chiude la discussione. Consiste nel proteggere il quality floor e rendere esplicito quale costo stiamo pagando per ottimizzare ciò che conta di più nel contesto attuale.

Questo è `fit before fashion` applicato alla decisione professionale.

## Reversibility cambia il livello di evidence necessario

Non tutte le scelte meritano lo stesso processo. Una decisione locale e reversibile può essere delegata rapidamente. Una one-way door richiede più attenzione perché il costo dell'errore non coincide con il costo del diff.

Una migration che trasforma dati, un public contract, una nuova business semantics o l'assegnazione di write authority a un sistema AI possono essere difficili da invertire anche se il codice che le implementa è piccolo.

> **La dimensione del diff non misura la reversibilità della decisione.**

Per questo la governance dovrebbe essere proporzionale al blast radius: autonomia locale per small two-way door, review focalizzata per decisioni architetturalmente significative, authority esplicita ed evidence più forte per one-way door ad alto impatto.

## Evidence proportional to claim

Il Capitolo 26 ha reso esplicita una regola che qui diventa una competenza dell'architect: usare la prova più economica che riesce davvero a sostenere il claim.

Un typecheck può bastare per dire che TypeScript compila. Non basta per dire che una transazione è atomica su PostgreSQL. Una configurazione di backup non dimostra l'RTO. Un eval seed non dimostra model quality finché non viene eseguito contro candidati reali.

Troppa evidence per ogni decisione rallenta inutilmente. Troppo poca trasforma il design in speranza documentata.

> **La qualità del judgment si vede anche da quanto costa dimostrare ciò che stiamo affermando.**

## Il nuovo rischio: decision theatre

Con l'AI possiamo generare rapidamente alternative analysis, risk register, ADR, cost comparison, threat analysis e test. La quantità di artefatti può dare un'impressione di profondità che non esiste.

Se la stessa assunzione sbagliata viene usata dall'agente che propone le alternative, da quello che le valuta, dal test che verifica l'oracle e dalla review che riassume il risultato, possiamo ottenere una catena molto coerente e molto sbagliata.

La risposta non è rinunciare all'AI. È introdurre **evidence diversity**: primary source, runtime evidence, test indipendenti, review adversarial, specialist authority e verifica su boundary reali quando il claim lo richiede.

Un secondo storyteller non è automaticamente un verifier.

## AI come decision support

L'AI è eccellente per ampliare lo spazio delle alternative e per red-teamare una scelta preferita. Può chiedere quali assumptions stiamo ignorando, quale failure mode rompe il design e quale evidence discriminerebbe davvero fra due opzioni.

Questo aumenta la qualità del processo finché decision authority e accountability restano dove vive il rischio.

Un agente può proporre una security exception. Non può accettarla per conto di Security. Può suggerire una nuova business rule. Non diventa Product authority. Può preparare un launch report. Non trasforma un blocker in Accepted Risk.

La distinzione fra **supportare una decisione** e **possedere una decisione** diventa ancora più importante quando l'output è eloquente e veloce.

## Decision velocity senza decision anarchy

Execution veloce richiede anche un sistema di decisioni che non si blocchi. Il rischio è oscillare fra due estremi: tutto passa da una review centrale oppure ogni executor decide localmente.

L'architect deve contribuire a costruire una governance in cui la classe della decisione è riconoscibile prima che il processo cominci. Le scelte reversibili restano locali; quelle che cambiano boundary, authority, contract o one-way door ricevono il livello di review appropriato.

Microsoft Well-Architected insiste sul comprendere business outcomes e constraint, identificare le decisioni importanti e valutarne trade-off, effort, reversibilità e rischio.

Fonte:

- [Microsoft Learn — Solution Architect's Responsibilities and Guiding Principles](https://learn.microsoft.com/en-us/azure/well-architected/architect-role/fundamentals)

La usiamo come riscontro di una proprietà, non come definizione universale del ruolo.

## ESI: Decision Quality Review

Nel modello ESI una decisione architetturale importante deve permettere di rispondere a cinque domande: il problema è abbastanza chiaro; le alternative sono realmente differenti; quale costo o rischio stiamo spostando; quale evidence sostiene la scelta; quale trigger farà riaprire la decisione.

Non serve trasformare ogni scelta in un documento lungo. Serve che il ragionamento sopravviva alla persona che lo ha formulato.

Quando l'execution diventa abbondante, questa capacità vale più della produzione di un'altra alternativa.
