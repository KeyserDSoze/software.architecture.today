# Tre casi, un solo metodo

Mettere i tre sistemi uno accanto all’altro rende visibile una proprietà che sarebbe facile perdere studiandoli separatamente: le parole del metodo restano le stesse, ma il contenuto delle decisioni cambia radicalmente.

| Dimensione | Campaign Launchpad | Priority Migration | Case Explanation Assistant |
|---|---|---|---|
| Shape | piccolo greenfield | brownfield enterprise | AI-native capability |
| Primary risk | publish/control failure | semantic regression / cutover | unsupported or unsafe interpretation |
| Architecture bias | managed/static-first | coexistence + seam | bounded model boundary |
| Key evidence | publish/rollback/deploy | characterization + shadow | eval + runtime model evidence |
| Main recovery | previous publication | legacy path / delayed cutover | feature disable + deterministic fallback |
| Current production state | NOT READY | NOT AUTHORIZED | NOT READY / DISABLED |

La tabella non serve a scegliere un pattern. Serve a vedere che **scope, ownership, quality, failure, evidence e readiness** producono risposte diverse quando il problema cambia.

## La stessa parola “boundary” protegge cose diverse

In Campaign Launchpad il boundary importante separa authoring interno e publication pubblica. La modularità protegge template, approval e publication state.

Nel brownfield il boundary separa target semantics dal compatibility mechanism. `PriorityPolicy` impedisce al legacy di definire il linguaggio del nuovo dominio e permette la coexistence.

Nell’AI Assistant il boundary separa deterministic context, model port, provider adapter e output validation; soprattutto separa model interpretation da business authority.

Il principio di modularità è lo stesso. La ragione per cui esiste il modulo è diversa.

## Ownership produce architetture differenti perché la truth è diversa

Campaign Launchpad possiede quasi tutto il proprio workflow state. La Priority migration deve distinguere observed legacy behavior da target policy authoritative. Il Case Explanation Assistant vive sopra facts appartenenti ad altri domini e deve evitare di diventare una nuova source of truth.

Questo è il motivo per cui data ownership non significa semplicemente “quale database contiene il record”.

> **Ownership indica chi ha il diritto di definire il significato del fatto e di autorizzarne il cambiamento.**

## Reliability segue il failure che vogliamo contenere

Campaign Launchpad privilegia versioned publication e rollback. La migration privilegia reversibilità semantica e delayed cutover. L’AI Assistant privilegia graceful degradation: provider unavailable non deve rendere inutilizzabile il core.

Non esiste una tecnica universale chiamata “resilience”. Esistono failure diversi e recovery path appropriati a ciascuno.

Lo stesso vale per observability. Il primo prodotto deve sapere se publish e rollback hanno prodotto l’artifact atteso. Il brownfield deve distinguere Match, ExpectedDifference e UnexpectedDifference. L’AI runtime deve identificare model/config version, latency, fallback, source support e quality drift.

CPU e request count possono essere utili in tutti e tre. Non descrivono però la property che rende ciascun sistema governabile.

## Testing segue il claim, non una piramide fissa

Campaign Launchpad usa state/workflow test e publish/rollback journey. Il brownfield combina characterization, target-policy test e shadow comparison. L’AI Assistant richiede deterministic boundary test, versioned eval e real model execution.

Questa differenza è la prova pratica del principio del Capitolo 16: non partiamo dalla forma del test suite; partiamo dalla property e dal boundary che può smentirla.

## Anche il costo racconta che cosa stiamo comprando

Campaign Launchpad paga managed hosting, public traffic e una piccola execution surface. La Priority migration paga coexistence, telemetry e verification aggiuntiva. L’AI Assistant paga inference, context, retry, evaluation e human review.

La voce di fattura è diversa perché la proprietà comprata è diversa.

> **Il costo architetturale è il prezzo del comportamento che vogliamo sostenere, non soltanto della risorsa cloud che compare nel bill.**

## L’organizzazione non viene uniformata dagli agenti

Campaign Launchpad può avere un accountable lead singolo appoggiato a Marketing, Platform e Security. Il brownfield richiede knowledge distribuita fra Product, Operations, legacy context ed Engineering. L’AI Assistant aggiunge usefulness review, provider/security concern e cost governance.

Un agente capace non elimina queste authority. Può ridurre execution handoff, non il numero di interessi legittimi che una decisione deve integrare.

## I casi reali vanno letti allo stesso modo

Azure Static Web Apps documenta capability che possono essere appropriate a un piccolo public/static workload. GitHub documenta dual boot e rollout incrementale durante una grande migration. Uber documenta golden set ed evaluation in un copilot interno.

Fonti:

- [Microsoft Learn — Azure Static Web Apps](https://learn.microsoft.com/en-us/azure/static-web-apps/overview)
- [GitHub Engineering — Upgrading GitHub from Rails 3.2 to 5.2](https://github.blog/engineering/infrastructure/upgrading-github-from-rails-3-2-to-5-2/)
- [Uber Engineering — Enhanced Agentic-RAG](https://www.uber.com/us/en/blog/enhanced-agentic-rag/)

Nessuna fonte autorizza la regola `small web → Static Web Apps`, `legacy → dual boot` o `AI → RAG`.

Ci insegna invece quali domande il contesto reale ha costretto qualcuno a fare.

## Fit before fashion, finalmente end-to-end

Campaign Launchpad mostra che una soluzione piccola può essere matura. La Priority migration mostra che mantenere temporaneamente il legacy può essere più responsabile che eliminarlo. Il Case Explanation Assistant mostra che limitare l’AI può essere una proprietà architetturale, non una mancanza di ambizione.

> **Non chiedere quale soluzione è più moderna. Chiedi quale problema la rende necessaria, quale costo accetta e quale evidence ci autorizza a mantenerla.**

Se lo stesso metodo conduce a soluzioni differenti ma ciascuna decisione resta spiegabile, il metodo sta facendo il proprio lavoro.