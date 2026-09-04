# 23.9 — Esercizi, autovalutazione e sintesi

Il Capitolo 23 non ha introdotto un modo più sofisticato di scrivere prompt.

Ha introdotto un modo più rigoroso di separare **mandato, potere, evidence e authority** quando l'execution può essere distribuita fra più agenti.

La domanda centrale è rimasta la stessa dall'inizio:

> **chi può far avanzare il sistema, sulla base di quale evidence e dentro quale permission boundary?**

Il numero di agenti è secondario.

Un singolo executor con deterministic gate e human review può avere un design migliore di uno swarm. Un secondo agente compra valore soltanto se aggiunge independence, context specialization, permission isolation o parallelismo realmente separabile. Un human gate ha senso quando protegge una decisione di rischio, non quando aggiunge un click rituale.

Il workflow che vogliamo saper leggere è:

```text
Work Item
→ Delegation Contract
→ bounded execution
→ primary evidence
→ independent verification
→ Autonomy / approval gate
→ next step or STOP
```

## Le distinzioni che non dobbiamo più confondere

**Role e agent identity** non coincidono. Planner, Implementer e Verifier descrivono responsibility; non obbligano a creare tre processi differenti.

**Capability, authorization e autonomy** sono tre livelli diversi. Il tool definisce ciò che è tecnicamente possibile; la permission policy definisce ciò che è autorizzato; l'autonomy level definisce quanto lontano quella capability può procedere senza un nuovo gate.

**Review e verification** non sono sinonimi. Una review può trovare problemi importanti, ma alcune claim richiedono evidence sul boundary reale.

**Second opinion e independent evidence** non sono la stessa cosa. Due agenti che leggono lo stesso summary possono condividere la stessa misconception.

**Human-in-the-loop e human-everywhere** sono opposti. L'approval manuale ha valore quando protegge una decisione significativa; usata ovunque genera fatigue.

Infine, **Stopped e failure** non coincidono. Fermarsi quando il task richiede nuova authority è uno dei comportamenti più maturi del workflow.

> **Più executor possiamo moltiplicare, più deve restare chiaro chi possiede il diritto di dichiarare il loro risultato abbastanza buono per andare avanti.**

## I tre artefatti operativi

Il capitolo rende persistenti tre artifact distinti:

```text
Agent Delegation Contract
→ mandato, scope, permission, stop condition, repair budget

Agent Verification Bundle
→ claim, primary evidence, finding, limitation, recommendation

AI Autonomy Matrix
→ livello per capability, gate, trigger di aumento/riduzione
```

Non vanno necessariamente usati nella forma completa per ogni typo o piccolo refactoring. Il costo della governance deve essere proporzionato al failure che vogliamo contenere.

Per task ad alto impatto o agent workflow ripetibili, invece, questi artifact rendono esplicite responsabilità che altrimenti resterebbero disperse fra prompt, platform setting e memoria delle persone.

## Esercizio 1 — Quando il secondo agente compra qualcosa?

Prendi un task reale e disegna due workflow:

```text
A
single executor
→ deterministic gates
→ human review
```

```text
B
Implementer
→ independent Verifier
→ human gate
```

Confronta context transfer, permission separation, evidence source, latency, coordination cost e failure mode.

La conclusione deve nominare la proprietà acquistata dal workflow B. Se non riesci a trovarne una convincente, usa A.

## Esercizio 2 — Capability, authorization, autonomy

Scegli almeno dieci azioni del tuo engineering workflow: leggere repository, modificare source, eseguire shell, aggiungere dependency, creare PR, modificare architecture rule, accedere a secret, fare merge, eseguire migration, fare deploy.

Per ognuna separa:

```text
technically possible?
authorized in this workflow?
current autonomy level?
human gate?
```

Poi confronta il risultato con il Threat Model.

## Esercizio 3 — Handoff erosion

Crea un work item che contenga una stop condition, un'Expected Difference, una limitation e un ownership boundary.

Scrivi poi un summary di handoff molto corto e verifica quali informazioni sono scomparse.

Progetta infine un envelope minimo che preservi:

```text
work item
scope
canonical context
current evidence
stop conditions
protected artifacts
```

## Esercizio 4 — Verifier indipendente

Parti da una claim:

```text
this change is backward compatible
```

Non chiedere al Verifier “review this PR”. Definisci invece:

```text
claim
evidence source
contradiction search
permission of verifier
known limitations
final authority
```

Spiega quale dimensione rende la verification realmente più indipendente dall'Implementer.

## Esercizio 5 — Green-by-editing-the-oracle

Identifica tre oracle del tuo progetto: characterization test, snapshot, architecture fitness rule, security policy, migration baseline o benchmark threshold.

Per ciascuno chiedi se l'executor può modificarlo nello stesso task in cui viene giudicato da esso.

Se la risposta è sì, definisci il processo che separa **soddisfare la policy** da **cambiare la policy**.

## Esercizio 6 — Repair budget

Progetta un workflow che prova a risolvere una failing suite.

Definisci un numero massimo di bounded repair loop, che cosa conta come nuova evidence, quando il failure diventa stop condition e quale packet deve ricevere l'owner umano.

Evita:

```text
retry until green
```

Un loop senza nuova informazione non è recovery.

## Esercizio 7 — Autonomy Matrix capability-based

Costruisci una matrice A0–A4 per almeno otto capability del tuo repository.

Per ogni riga indica livello corrente, reason legata a risk/reversibility, evidence necessaria per aumentare autonomia, trigger per ridurla e human gate.

Non assegnare un solo livello globale all'agente.

## Esercizio 8 — Verification Bundle retrospettivo

Prendi una issue già chiusa e prova a ricostruire:

```text
claims
evidence mechanisms
primary evidence references
independent findings
known limitations
Not verified
recommendation
```

Se per farlo devi rieseguire tutto il lavoro o fidarti di “LGTM”, hai trovato un gap nella provenance del quality system.

## Esercizio 9 — Collision domain prima del fan-out

Scegli cinque task apparentemente indipendenti e mappa per ognuno:

```text
files
schema
contracts
business decisions
environment
migration
verification oracle
```

Parallelizza soltanto ciò che non condivide un decision boundary ancora aperto.

Osserva quanti “task tecnicamente separati” sono in realtà semanticamente accoppiati.

## Esercizio 10 — Aumentare autonomia su evidence

Immagina di avere una serie di task simili a OO-001 completati con successo.

Devi decidere se una capability può passare da A2 ad A3.

Usa evidence come accepted scoped task rate, repair loop, stop-condition quality, verifier finding dopo implementer `PASS`, policy violation, human review minutes e cost per verified change.

Non usare come argomento “il modello nuovo è più forte”.

Scrivi anche i trigger che riporterebbero la capability verso A2 o A1.

## Autovalutazione

Dopo il capitolo dovresti riuscire a progettare un workflow senza partire dal numero di agenti; spiegare quando un handoff è un vero context boundary; distinguere manager routing da centralized authority; capire perché un fan-in deve essere risk-aware; definire un permission boundary che non dipenda soltanto dalle instruction; scegliere il livello di autonomy per capability; costruire un Verifier che acceda a evidence primaria; riconoscere self-certification e consensus theatre; e sapere quando un `STOPPED` è il risultato corretto.

Dovresti inoltre saper collegare l'agent workflow a Threat Model, Cost Model, Testing Strategy e Observability Contract. Se permission, evidence e cost dell'orchestration vivono in documenti separati che non si parlano, la governance agentica resta incompleta.

## Che cosa cambia con l'AI

Prima degli agenti, creare un reviewer specialistico o un executor aggiuntivo richiedeva staffing e disponibilità umana. Oggi alcune responsibility possono essere istanziate molto più economicamente.

Questo aumenta le opzioni, non elimina i trade-off.

Possiamo comprare più candidate solution, adversarial review, specialist execution e parallel analysis. In cambio paghiamo context transfer, orchestration, permission design, verification, observability e nuovi failure mode.

La scarsità si sposta ancora una volta: execution diventa abbondante, mentre **decision quality, evidence quality e accountability** restano risorse da progettare.

> **L'abbondanza di executor non elimina il bisogno di organizzazione. Trasforma l'organizzazione in una parte esplicita dell'architettura.**

## Stato ESI dopo il Capitolo 23

ESI ha scelto per OO-001:

```text
A2 bounded execution
+ deterministic PostgreSQL evidence
+ independent verification
+ human/repository merge gate
```

Ha codificato Delegation Contract, Verification Bundle e Autonomy Matrix, e li protegge con `AGOV-001…005`.

Non ha ancora eseguito OO-001. Non possiede primary evidence, verifier result o observed production agent reliability. Non concede A4.

Questo stato incompleto è esattamente ciò che il modello di evidence deve rendere visibile.

## Ponte al Capitolo 24

Finora l'AI ha lavorato **sul software**: repository, issue, execution e verification.

Nel prossimo capitolo entrerà **dentro il software**.

Order Operations dovrà trattare un modello non come un nuovo developer, ma come una runtime dependency probabilistica con context, authority, output contract, security boundary, evaluation e fallback.

La domanda cambia:

> **come usiamo una capability AI nel prodotto senza trasformare probabilità, retrieved text e model output in business authority incontrollata?**

È il tema del **Capitolo 24 — AI dentro l'architettura**.

## Corollario

> **Quando puoi moltiplicare gli executor, il tuo lavoro non è tenerli tutti occupati. È fare in modo che la loro velocità resti subordinata al mandato, all'evidence e alla responsabilità.**
