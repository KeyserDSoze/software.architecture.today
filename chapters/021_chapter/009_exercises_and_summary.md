# 21.9 — Esercizi, autovalutazione e sintesi

Un repository AI-ready non è un repository pieno di prompt. È un repository nel quale un nuovo esecutore può capire abbastanza rapidamente **che cosa è stabile, che cosa deve cambiare, quale fonte è autorevole e quale evidence serve per chiudere il task**.

Il capitolo ha quindi spostato il problema dall'“istruire meglio il modello” al progettare un ambiente di lavoro più leggibile.

La catena che vogliamo ottenere è:

```text
entry point
→ navigation context
→ relevant decision context
→ scoped task
→ allowed execution
→ golden verification
→ explicit evidence gaps
```

Ogni passaggio riduce un tipo diverso di ambiguità. `AGENTS.md` non sostituisce la Functional Analysis. La Repository Map non sostituisce l'architecture fitness. Il task non deve ricopiare il repository. Il test non deve inventare l'authority che manca. La stop condition non è una failure dell'automazione: è il punto in cui l'execution riconosce che serve una nuova decisione.

> **Il repository contiene ciò che resta vero fra i task. Il task contiene il delta. L'evidence dice che cosa abbiamo realmente dimostrato.**

## Che cosa significa davvero “AI-ready”

La readiness che ci interessa è composta da proprietà già familiari alla software architecture.

La knowledge source deve essere chiara e scopribile. Il setup deve essere riproducibile. I command devono avere un significato stabile. Le constraint meccaniche importanti devono poter produrre feedback eseguibile. Gli oracle devono essere protetti da modifiche opportunistiche. Permission e authority devono restare separate dalla semplice capacità tecnica. Il context layer deve poter invecchiare e quindi avere owner e review trigger.

L'AI aumenta il valore di tutto questo perché riduce il costo dell'execution e aumenta la velocità con cui un errore di contesto può produrre un diff molto ampio.

Allo stesso tempo, aumenta il danno di una documentazione autorevole ma sbagliata. Un umano può chiedere “ma siamo sicuri che sia ancora così?”. Un agente può trasformare rapidamente quell'informazione stale in codice coerente con il passato.

Per questo **persistent context e current evidence devono sempre convivere**.

## L'artefatto operativo non è un nuovo manuale

Per ESI gli artifact introdotti sono volutamente pochi:

```text
AGENTS.md
+ docs/repository-map.md
+ tests/agent-context-fitness.test.mjs
```

Il primo fa routing. Il secondo rende navigabili responsabilità e source canonical. Il terzo verifica che entry point, map, documenti principali e golden command non siano diventati meccanicamente stale.

Il context fitness non certifica la qualità semantica delle istruzioni. Questa limitazione è importante quanto il PASS.

La baseline del capitolo resta infatti:

```text
CTX-001…CTX-004
→ mechanical context properties
→ locally exercisable
```

Non equivale a permission enforcement, agent reliability o production evidence.

## Esercizio 1 — Repository cold start

Scegli un repository che conosci bene e affrontalo come se fosse nuovo.

In quindici minuti prova a scoprire:

```text
product purpose
build path
test path
important boundaries
canonical documents
ownership
forbidden implicit changes
```

Ogni volta che la risposta dipende da qualcosa che “il team sa”, segna una possibile forma di tribal knowledge. Poi decidi se quella conoscenza merita documentazione canonical, routing, automation o ownership metadata.

## Esercizio 2 — Scrivi un entry point corto

Crea una bozza di `AGENTS.md` di circa una pagina con purpose, route verso la Repository Map, golden command, critical boundary, stop condition e Definition of Done.

Quando senti il bisogno di aggiungere API detail, schema, storia degli incidenti o l'intera Functional Analysis, non copiarli. Chiediti quale source canonical dovrebbe contenerli e come l'entry point può indirizzare verso di essa.

L'obiettivo non è vincere una gara di brevità. È distinguere **always-on context** da **discoverable context**.

## Esercizio 3 — Elimina una duplicazione di context

Cerca una stessa regola presente in almeno due fra README, CONTRIBUTING, wiki, tool-specific instruction, `AGENTS.md`, prompt template o runbook.

Identifica:

```text
canonical source
routing layer
copies to remove
consumers to update
review trigger
```

Poi verifica che la rimozione non renda la knowledge source meno scopribile.

## Esercizio 4 — Metti alla prova il golden command

Esegui il comando di test canonico da un environment il più pulito possibile.

Annota dipendenze, runtime, env var, servizi esterni, durata e failure mode. La domanda finale non è soltanto “passa?”. È:

> **un nuovo contributor riuscirebbe a distinguere un bug del codice da un problema di setup o infrastruttura?**

Se la risposta è no, il repository non possiede ancora un verification path sufficientemente deterministico.

## Esercizio 5 — Green-by-editing-the-oracle

Prendi un change con un test failing e immagina che l'esecutore possa modificare implementation, test, fixture ed architecture rule.

Trova almeno tre modi in cui potrebbe ottenere un verde senza soddisfare il requirement originario. Per ciascuno indica quale artifact dovrebbe essere protetto, quale decisione autorizzerebbe davvero il cambio dell'oracle e quale review o gate lo renderebbe visibile.

## Esercizio 6 — Progetta stop condition osservabili

Scegli un task reale e scrivi cinque stop condition che non usino formule vaghe come “se sembra rischioso”.

Usa boundary riconoscibili, per esempio:

```text
new public ingress
new authoritative data owner
destructive migration
breaking external contract
security control weakening
confirmed semantic conflict
```

Poi spiega chi possiede la decisione dopo lo stop. Una stop condition senza escalation path rende visibile il problema ma non lo governa.

## Esercizio 7 — Trasforma un titolo vago in semantic scope

Parti da:

```text
Refactor payment handling.
```

Riscrivilo come task con problem, desired outcome, semantic scope, out of scope, acceptance, relevant canonical context, verification budget e stop condition.

Non usare la file list come sostituto dello scope. I path devono essere hint; il task deve spiegare **quale significato può cambiare**.

## Esercizio 8 — Costruisci una context fitness piccola

Automatizza una proprietà meccanica del context layer: link canonical esistenti, golden command presenti, path non stale o package principali visibili nella map.

Poi scrivi esplicitamente due cose che il test **non** dimostra.

Questo secondo passaggio è obbligatorio: vogliamo fitness function che producano evidence, non una nuova illusione di completezza.

## Esercizio 9 — Tool-neutral first

Immagina che il team usi tre coding agent differenti.

Disegna una struttura in cui business semantics, ownership, architecture rule e verification rimangano canonical una sola volta. Aggiungi adapter specifici per tool soltanto dove una capability concreta lo richiede.

Se devi aggiornare tre file quando cambia una business rule, prova a ridisegnare il routing.

## Esercizio 10 — ESI adversarial task

Un agente riceve:

```text
Make Payment Escalation more reliable.
```

Propone retry infinito, una copia locale di `PaymentStatus`, un tier messaging superiore, la modifica del test che limita i retry e un nuovo public endpoint per un monitor esterno.

Per ciascuna proposta ricostruisci:

```text
canonical artifact to read
property / owner affected
allowed execution or decision boundary
verification needed
stop condition
```

L'esercizio non chiede di bocciare automaticamente tutte le proposte. Chiede di distinguere ciò che è una tecnica implementativa da ciò che riapre architecture, ownership, cost o security.

## Autovalutazione

Dopo questo capitolo dovresti riuscire a spiegare, senza ricorrere a slogan, perché un instruction file non renda da solo un repository AI-ready; come navigation, decision ed execution context si completino; perché repository context e task context debbano restare separati; quando un'informazione meriti always-on context; perché duplicare knowledge per ogni tool introduca drift; in che senso un architecture test sia anche context engineering; che cosa renda affidabile un golden command; perché l'oracle abbia bisogno di governance; come riconoscere task amplification; perché capability e authorization siano diverse; e in che modo una stop condition possa aumentare l'autonomia utile.

Dovresti anche saper distinguere ciò che il context fitness può dimostrare meccanicamente da ciò che richiede ancora judgment. Se `AGENTS.md` contiene una frase, questo non la trasforma in requisito confermato, security control o evidence runtime.

Una buona domanda finale è:

> **Quale informazione stabile il nostro team continua a far riscoprire a ogni nuovo contributor, e perché non l'abbiamo ancora resa persistente o verificabile?**

## Cosa cambia con l'AI

Prima degli agenti, una codebase con onboarding difficile poteva sopravvivere a lungo affidandosi a maintainer esperti e review manuale. Con esecutori capaci di lavorare in parallelo, quel modello scala peggio.

Ogni task può ripagare il costo di discovery. Una inferenza sbagliata può produrre molto più codice prima di essere intercettata. Le convenzioni implicite devono essere ricostruite da ogni nuovo esecutore. Il costo di un context layer stale, nel frattempo, viene amplificato dalla stessa velocità.

Per questo l'AI aumenta il valore relativo di boundary chiari, canonical documentation, repeatable setup, executable verification, ownership e stop condition.

> **L'AI amplifica sia il valore della documentazione buona sia il danno della documentazione sbagliata.**

## Stato ESI dopo il Capitolo 21

Order Operations può ora dichiarare:

```text
AGENTS.md                         Codified
Repository Map                    Codified
npm run typecheck                 Existing / executable
npm test                          Existing / executable
CTX-001…CTX-004                   Codified + locally exercisable
Tool-specific duplicate context   Not introduced
Formal agent permission model     Future
Delegation / autonomy policy      Future
```

Questa è una maturità deliberatamente limitata. Il repository è più navigabile e verificabile. Non abbiamo ancora dimostrato che un agente possa eseguire autonomamente qualunque classe di task, né abbiamo definito un permission model completo.

## Ponte al Capitolo 22 — Issue-driven development

Ora il repository sa spiegare che cosa è, dove trovare il contesto, quali command eseguire e quando un task deve fermarsi.

Resta però una domanda operativa fondamentale:

> **Come trasformiamo il lavoro in unità abbastanza chiare da poter essere affidate, verificate, riprese e composte?**

Nel Capitolo 22 la issue smetterà di essere una frase in chat e diventerà una vera unità di orchestrazione fra persone, agenti, canonical artifact ed evidence.

Il passaggio è naturale:

```text
AI-ready repository
→ stable execution context

Issue-driven development
→ bounded execution unit
```

## Corollario

> **Un repository AI-ready non rende l'agente onnisciente. Rende più economico trovare il contesto giusto, più difficile modificare accidentalmente ciò che non è in scope e più evidente ciò che resta ancora da decidere o verificare.**