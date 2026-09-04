# Esercizi, autovalutazione e sintesi

Il problema dei sistemi agentici non è che possano fare troppo poco.

È che possono fare molto **prima che abbiamo progettato chi decide, chi verifica e dove l'autonomia deve fermarsi**.

Questo capitolo ha quindi trattato gli agenti come un problema di organizzazione e architettura, non come un catalogo di modelli.

## Idee chiave

1. **Ruolo e agente non sono sinonimi.** Planner, Implementer, Verifier e Human Decision Owner descrivono responsabilità. Non servono necessariamente quattro agenti distinti.
2. **Multi-agent non è un maturity level.** Un agente con un execution contract forte può essere migliore di uno swarm costoso e incoerente.
3. **Capability, authorization e autonomy sono tre cose diverse.** Un tool disponibile non è automaticamente un tool autorizzato.
4. **La separazione importante è fra decisione, execution, verification e approval.** Questi ruoli possono convivere soltanto quando il rischio lo consente.
5. **Prima sincronizzare il pensiero, poi parallelizzare l'esecuzione.** Il fan-out su una decisione ambigua moltiplica l'errore.
6. **L'handoff è un context boundary.** Deve preservare work item, scope, evidence e stop condition, non soltanto un riassunto elegante.
7. **L'orchestratore può diventare un god object.** Centralizzare routing non deve significare centralizzare ogni competenza, permission e approval.
8. **La verification deve essere claim-first e provenance-aware.** `All tests passed` non descrive cosa è stato dimostrato.
9. **Un verifier diverso non è automaticamente indipendente.** L'indipendenza cresce quando cambiano evidence source, permission, instruction o final authority.
10. **Human-in-the-loop va applicato al rischio.** Approvare tutto produce approval fatigue; non approvare high-risk action produce blast radius inutile.
11. **Autonomy è capability-based e versionata.** Non è una qualità permanente del modello.
12. **Un executor non dovrebbe aumentare unilateralmente la propria autonomia per completare il task corrente.**
13. **Retry degli agenti richiede un budget.** Ripetere execution senza nuova informazione può soltanto amplificare il failure.
14. **Multi-agent observability conta.** Se non possiamo ricostruire handoff, tool call, approval e evidence, non possiamo governare il workflow.
15. **Il manager di agenti gestisce responsabilità, permessi, evidence e rischio.** Non soltanto prompt.

## Esercizio 1 — Un agente o tre?

Prendi un task reale del tuo progetto.

Progetta due versioni del workflow:

```text
A
single executor
+ deterministic gates
+ human review
```

```text
B
planner
+ implementer
+ verifier
```

Per ogni versione valuta:

- context boundary;
- permission boundary;
- verification independence;
- latency;
- token/tool cost;
- failure mode;
- coordination cost.

Concludi con:

> Quale proprietà compra realmente la versione multi-agent?

Se non trovi una risposta forte, scegli A.

## Esercizio 2 — Disegna il permission boundary

Per un coding agent elenca almeno dieci capability:

```text
read repository
edit source
edit tests
edit architecture rule
run shell
start local dependency
access network
create branch
create PR
merge
access production secret
execute production migration
```

Per ognuna assegna:

```text
Allowed autonomously
Allowed with verification
Human approval required
Forbidden in this workflow
```

Poi confronta la matrice con il threat model del progetto.

## Esercizio 3 — Handoff loss

Scrivi un work item con:

- due constraint;
- una stop condition;
- una expected difference;
- una evidence limitation.

Poi scrivi un summary di handoff di cinque righe.

Controlla se tutte le informazioni necessarie sopravvivono.

Se non sopravvivono, progetta un handoff envelope strutturato.

## Esercizio 4 — Independent verifier

Prendi una pull request.

Fingi che un Implementer Agent dichiari:

```text
change is backward compatible
```

Disegna un verifier che non si limiti a leggere il summary.

Indica:

```text
claim
evidence source
contradiction search
limitations
final authority
```

## Esercizio 5 — Green-by-editing-the-oracle

Trova tre artifact del tuo progetto che potrebbero diventare verification oracle:

- test;
- snapshot;
- architecture rule;
- security policy;
- migration baseline;
- benchmark threshold.

Per ciascuno chiedi:

> l'executor può modificarlo nello stesso task in cui viene giudicato da esso?

Se sì, progetta un gate migliore.

## Esercizio 6 — Retry budget

Progetta un agent workflow che tenta di risolvere una failing test suite.

Definisci:

```text
max repair loops
what counts as new evidence
stop condition
human escalation packet
```

Evita il generico:

```text
retry until green
```

## Esercizio 7 — AI Autonomy Matrix

Costruisci una matrice A0–A4 per almeno otto capability del tuo repository.

Per ogni riga aggiungi:

- current level;
- quality/security reason;
- evidence necessaria per aumentare autonomia;
- trigger per ridurla;
- human gate.

## Esercizio 8 — Verification Bundle

Prendi una issue completata e ricostruisci a posteriori un bundle:

```text
Claims
Evidence
Raw evidence references
Independent findings
Known limitations
Not verified
Recommendation
```

Se non riesci a ricostruirlo senza rifare tutto il lavoro, hai trovato un gap nel quality system.

## Esercizio 9 — Fan-out sicuro

Hai cinque issue apparentemente indipendenti.

Costruisci per ciascuna il collision domain:

```text
files
schema
contracts
business decisions
environment
verification oracle
```

Parallelizza soltanto le coppie che non condividono un decision boundary aperto.

## Esercizio 10 — ESI: aumenta l'autonomia?

Immagina che OO-001 venga completata correttamente dieci volte su task simili.

Devi decidere se passare una capability da A2 ad A3.

Non usare come motivazione:

```text
the model is better now
```

Usa invece evidence come:

```text
accepted task rate
repair loops
stop-condition precision
review findings
permission violations
human review minutes
cost per verified change
```

Scrivi una decisione motivata.

## Autovalutazione

Dovresti riuscire a rispondere senza slogan.

1. Quando aggiungere un secondo agente compra vera indipendenza?
2. Qual è la differenza fra handoff e manager pattern?
3. Perché più agenti possono amplificare una misconception condivisa?
4. Che cos'è il collision domain di un task?
5. Perché capability e authorization non sono sinonimi?
6. Quando il human-in-the-loop diventa approval fatigue?
7. Che cosa rende un verifier realmente più indipendente?
8. Che cos'è un Agent Verification Bundle?
9. Perché `all tests passed` è un claim troppo debole?
10. Che cosa deve contenere un Agent Delegation Contract?
11. Perché l'AI Autonomy Matrix deve essere capability-based?
12. Quando una capability dovrebbe perdere autonomia?
13. Perché un executor non dovrebbe modificare liberamente il proprio verification oracle?
14. Che cosa significa `Stopped` come outcome valido?
15. Come collegheresti l'agent workflow al Threat Model?
16. Come collegheresti il workflow al Cost Model?
17. Qual è la differenza fra AI review e execution evidence?
18. Perché un orchestratore centralizzato può diventare un nuovo monolite?
19. Quali dati di tracing servono per ricostruire una agent run?
20. Quale parte dell'accountability resta umana anche in A3/A4?

## Artefatti operativi

Il capitolo introduce tre artifact distinti.

### Agent Delegation Contract

Risponde a:

> che cosa può fare questo executor, dentro quale scope e con quali stop condition?

### Agent Verification Bundle

Risponde a:

> quale evidence sostiene i claim prodotti dal task e quali limiti restano?

### AI Autonomy Matrix

Risponde a:

> quale capability può procedere fino a quale punto senza un nuovo human gate?

Non usarli sempre tutti nella forma completa.

Usali quando il costo del failure giustifica il costo della governance.

## Che cosa cambia con l'AI

Prima l'organizzazione del lavoro software era fortemente limitata dalla disponibilità di persone.

Creare uno specialist reviewer in più costava agenda, staffing e coordinamento umano.

Con gli agenti alcuni ruoli diventano economicamente più facili da istanziare.

Questo non elimina i trade-off.

Li sposta.

Ora possiamo avere:

```text
more specialist execution
more parallel review
more candidate solutions
more adversarial analysis
```

ma paghiamo:

```text
context transfer
orchestration
permission design
verification
observability
cost
new failure modes
```

Quindi:

> **l'abbondanza di executor non elimina il bisogno di organizzazione. La rende un problema di architettura.**

## Compromesso ESI

ESI avrebbe potuto autorizzare un agent workflow molto più autonomo.

Non lo fa.

Per OO-001 sceglie:

```text
A2 bounded execution
+ independent verification
+ human merge gate
```

Costo:

- più review;
- più artifact;
- più latenza di acceptance.

Beneficio:

- permission contenute;
- evidence più leggibile;
- meno self-certification;
- stop condition governabili;
- possibilità di aumentare autonomia in seguito su evidence reale.

Il quality floor rimane:

> **nessun aumento di throughput autorizza semantic drift, privilege escalation o verification theatre.**

## Corollario

Il developer dell'era agentica non smette di essere engineer.

Cambia la leva attraverso cui produce valore.

Una parte del lavoro diventa:

```text
formulare il problema
separare responsabilità
definire permission
scegliere evidence
progettare stop condition
leggere eccezioni
accettare o rifiutare rischio
```

La frase con cui chiuderei il capitolo è:

> **Quando puoi moltiplicare gli executor, il tuo lavoro non è tenerli tutti occupati. È fare in modo che la loro velocità resti subordinata alla direzione, all'evidence e alla responsabilità.**

## Ponte al Capitolo 24

Finora l'AI ha lavorato **sul software**.

Nel prossimo capitolo entrerà **dentro il software**.

Order Operations dovrà affrontare una nuova domanda:

> possiamo usare un modello AI come componente del prodotto senza trasformare probabilità, prompt e tool call in business authority incontrollata?

Entreremo quindi in:

- AI come capability applicativa;
- model boundary;
- grounding e retrieval;
- structured output;
- tool use;
- prompt injection;
- data/privacy boundary;
- evaluation;
- fallback;
- latency/cost;
- human escalation;
- AI-specific failure mode.

È il **Capitolo 24 — AI dentro l'architettura**.
