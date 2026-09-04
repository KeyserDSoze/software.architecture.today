## AI e technology selection

L'AI è molto brava a proporre tecnologie. A volte fin troppo.

Davanti a una richiesta come “progetta un sistema altamente scalabile e resiliente”, un modello può generare Kubernetes, microservizi, Redis, Kafka, database distribuiti, service mesh, multi-region e uno stack di observability completo. La proposta può essere tecnicamente plausibile e, nello stesso tempo, completamente scollegata dal workload reale.

Il problema non è la competenza tecnica del modello. È il vuoto che gli abbiamo chiesto di riempire.

## Quando manca il requisito, l'AI inventa il contesto

Parole come `enterprise`, `scalable`, `modern`, `cloud-native`, `highly available` o `AI-native` suonano informative ma non definiscono un target. Se il prompt non contiene critical journey, scala, failure tolerance, budget e capacità del team, il modello deve ricostruire autonomamente ciò che queste etichette potrebbero significare.

Lo farà usando pattern frequenti, convenzioni note e architetture plausibili. È ottimo materiale per brainstorming. Diventa pericoloso quando l'inferenza viene scambiata per requirement.

> **Più il contesto è vago, più la tecnologia proposta racconta i prior del modello invece del nostro sistema.**

## Dare all'AI il problema di qualità

Un uso migliore consiste nel fornire target, vincoli e priorità e chiedere alternative significativamente differenti:

> “Proponi almeno tre soluzioni che possano soddisfare questi requisiti. Per ciascuna descrivi trade-off, failure mode, costo operativo, competenze richieste e trigger che la renderebbero inadatta.”

In questo modo l'agente non riceve l'autorità di scegliere. Riceve il compito di ampliare il design space e rendere più leggibili le conseguenze.

Possiamo poi chiedere qualcosa di ancora più utile:

> **Qual è la soluzione più semplice che potrebbe soddisfare tutti i requisiti dichiarati?**

La domanda contrasta un bias nuovo dell'era degli agenti: generare quindici componenti costa pochissimo, ma possederli per cinque anni continua a costare molto.

## Costruire una scala evolutiva invece di una soluzione finale immaginaria

Dopo aver individuato la soluzione più semplice possiamo chiedere quale requisito ci obbligherebbe a passare a una variante più complessa. Otteniamo così una sequenza di trigger:

```text
soluzione semplice
→ evidence insufficiente
→ requisito più severo
→ nuova alternativa
```

Questo approccio è più utile di progettare subito per il massimo futuro concepibile. Mantiene visibile il motivo per cui una tecnologia entra nel sistema.

## Attaccare la tecnologia che ci piace

Quando il team desidera già una soluzione specifica, l'AI può essere un buon adversarial reviewer. Possiamo chiederle di costruire il caso tecnico più forte **contro** Kafka, Kubernetes, una cache distribuita o qualunque altra proposta usando esclusivamente i requirement dichiarati; poi chiediamo il caso opposto.

La decisione non esce dal confronto come un voto automatico. Il valore consiste nel far emergere assunzioni, costi e failure mode che il nostro entusiasmo tende a minimizzare.

Un technology-fashion review può inoltre cercare componenti senza requisito esplicito, scelte introdotte come best practice generica, capacità progettate per scale non dichiarate o tecnologie che richiedono competenze e operating model assenti nel team.

## Il modello conosce i prodotti, non automaticamente il nostro costo totale

Un agente può conoscere feature, limiti e pattern di moltissimi servizi. Il fit reale dipende però anche da contratti commerciali, enterprise agreement, procurement, compliance, tooling esistente, incident history, persone disponibili e modello di on-call.

Una comparazione tecnicamente competente può quindi essere economicamente o organizzativamente sbagliata se questi elementi non sono nel contesto.

Per lo stesso motivo, quando una scelta dipende da feature, pricing, licensing, region availability o deprecation, la memoria del modello non basta. Le tecnologie cambiano e la research deve usare documentazione aggiornata.

> **Prima il requisito, poi la ricerca delle opzioni, poi il confronto.**

## Benchmark: precisione non significa rilevanza

Gli agenti possono accelerare benchmark, proof of concept, load test, raccolta di metriche e analisi dei risultati. Ma devono ricevere un esperimento che rappresenti il problema.

Confrontare due database su una query sintetica può produrre numeri molto precisi e dire poco sul nostro workload. Il benchmark utile nasce dal critical journey, dal dataset, dal pattern di lettura e scrittura e dalle quality priority che vogliamo verificare.

L'AI può abbassare il costo dell'esperimento. Non può sostituire il significato della misura.

## Agents make overengineering cheaper

Una nuova tentazione è: “possiamo aggiungerlo, tanto lo fa l'AI”. L'agente può effettivamente ridurre moltissimo il costo iniziale di configurare broker, cluster, cache o pipeline.

Non elimina però runtime cost, upgrade, cognitive load, security surface, debugging, incident response e ownership operativa. Costruire la tecnologia è soltanto una parte del costo. **Convivere con essa è il resto.**

> **L'AI rende più economico aggiungere tecnologia. Non rende automaticamente più economico possederla.**

Il ruolo umano resta quindi quello di stabilire quali qualità contino abbastanza da comprare quella complessità e quali conseguenze siamo disposti ad accettare.

> **Non chiedere all'AI quale tecnologia è migliore. Dalle il contesto e chiedile di rendere visibile quale compromesso stai comprando.**
