# 18.2 — Small batch, reversibilità e feature flag

La modernizzazione diventa pericolosa quando trattiamo il cambiamento come una singola unità indivisibile.

```text
old system
→ giant rewrite
→ production switch
```

Questa rappresentazione nasconde tutto ciò che ci serve per governare il rischio.

Un percorso più utile è:

```text
understand
→ introduce seam
→ preserve old behavior
→ add new implementation
→ compare
→ route a small slice
→ expand
→ remove old path
```

Ogni freccia è una decisione separata.

Ogni decisione può avere evidence, stop condition e fallback differenti.

## Small batch non significa micro-commit senza senso

“Fare cambiamenti piccoli” non significa dividere artificialmente un lavoro in decine di commit che non hanno valore autonomo.

Un batch è abbastanza piccolo quando:

- ha uno scopo comprensibile;
- produce una property verificabile;
- il reviewer può capire il blast radius;
- il rollback/fallback è definibile;
- il sistema resta in uno stato valido dopo il merge.

Esempio:

```text
PR 1
introduce PriorityPolicy seam
nessun comportamento cambia

PR 2
legacy adapter dietro al seam
characterization ancora green

PR 3
new policy non attiva
unit test + shadow instrumentation

PR 4
shadow mode per tenant interni

PR 5
controlled candidate routing

PR 6
legacy removal
```

Questo è diverso da:

```text
PR 1
rewrite priority subsystem
+ schema migration
+ API changes
+ rollout
+ delete legacy
```

## Safe deployment non elimina il rischio

Microsoft Azure Well-Architected ricorda che ogni deploy introduce rischio e raccomanda processi di deployment standardizzati, automatizzati e incrementali.

Sottolinea inoltre che cambiamenti piccoli e frequenti sono più semplici da diagnosticare e recuperare rispetto a grandi rilasci infrequenti.

Fonte:

- [Microsoft Learn — Architecture strategies for safe deployment practices](https://learn.microsoft.com/azure/well-architected/operational-excellence/safe-deployments)

Il punto non è ottenere un deploy “senza rischio”.

Il punto è rendere il rischio:

- limitato;
- rilevabile;
- attribuibile;
- reversibile quando possibile.

## Feature flag: meccanismo, non strategia

Una feature flag può permettere di scegliere a runtime fra due comportamenti.

Questo è molto potente durante un refactoring.

Ma la flag da sola non ci dice:

- chi viene spostato sul nuovo path;
- in quale ordine;
- quali metriche guardiamo;
- quale differenza è tollerabile;
- quando fermiamo il rollout;
- quando eliminiamo la flag;
- quale stato è già stato scritto.

Quindi:

> **Una feature flag è un meccanismo di controllo. La strategia di rollout deve esistere sopra di essa.**

GitHub descrive l'uso delle feature flag per ridurre il rischio di deployment, abilitare cambiamenti a percentuali o gruppi limitati e poter disabilitare rapidamente un comportamento senza effettuare un rollback completo del deploy.

La stessa fonte evidenzia anche il costo delle flag una volta completato il rollout: dead code e test duplicati devono essere rimossi.

Fonte:

- [GitHub Engineering — How we ship code faster and safer with feature flags](https://github.blog/engineering/infrastructure/ship-code-faster-safer-feature-flags/)

Questo ci dà una regola importante:

```text
flag introduced
→ owner
→ purpose
→ rollout plan
→ removal condition
→ removal
```

Una feature flag permanente non è più un meccanismo di migrazione.

È diventata architettura.

E deve essere trattata come tale.

## Branch by Abstraction e feature flag non sono la stessa cosa

AWS distingue esplicitamente i due concetti.

**Branch by Abstraction** introduce un boundary dietro al quale vecchia e nuova implementazione possono coesistere.

Una **feature flag** può poi essere usata per decidere quale implementazione utilizzare.

Fonte:

- [AWS Prescriptive Guidance — Branch by abstraction pattern](https://docs.aws.amazon.com/prescriptive-guidance/latest/modernization-decomposing-monoliths/branch-by-abstraction.html)

Quindi possiamo avere:

```text
caller
→ PriorityPolicy
   ├── LegacyPriorityPolicy
   └── ConfirmedPriorityPolicy
```

La struttura è il branch by abstraction.

La scelta:

```text
legacy
shadow
candidate
```

può essere governata da configurazione o feature flag.

## Shadow mode

Prima di lasciare che la nuova implementazione produca effetti, possiamo eseguirla in parallelo soltanto per confrontarne il risultato.

```text
request
→ legacy policy → authoritative result
       |
       └──────────────→ candidate policy
                         ↓
                      comparison
```

Il candidate path non decide ancora il risultato restituito al caller.

Produce evidence.

Questo approccio è utile quando:

- la funzione è deterministica;
- il candidate non produce side effect;
- possiamo confrontare output significativi;
- le differenze sono classificabili.

È pericoloso quando il “secondo path” produce effetti reali.

Esempio:

```text
call old payment
+ call new payment
```

non è shadowing innocuo se entrambi possono addebitare denaro.

> **Shadow traffic è sicuro soltanto quando abbiamo compreso gli effetti del path ombra.**

## Differenza non significa bug

Nel nostro caso ESI sappiamo già che alcune regole legacy potrebbero essere eliminate intenzionalmente.

Quindi una comparison del tipo:

```text
legacy = URGENT
candidate = STANDARD
```

non è automaticamente una regressione.

Potrebbe essere:

```text
UnexpectedDifference
```

oppure:

```text
ExpectedDifference
reason = removed obsolete enterprise threshold
```

Questo è un passaggio importante.

Se usiamo shadow comparison senza una **difference policy**, produrremo rumore.

E il rumore riduce la fiducia nello strumento di migrazione.

## Rollback non è una parola sola

Durante il rollout dobbiamo distinguere:

### Deployment rollback

Torniamo all'artifact precedente.

### Behavior fallback

Restiamo sullo stesso artifact ma cambiamo routing:

```text
candidate → legacy
```

### Configuration rollback

Ripristiniamo una configurazione precedente.

### Data rollback

Ripristiniamo o compensiamo lo stato.

### Contract rollback

Torniamo a un contratto precedente, se consumer e producer lo consentono.

Questi rollback non hanno la stessa difficoltà.

Per questo ogni migration step deve dire **quale rollback promette realmente**.

## Il punto di non ritorno

Molti refactoring hanno una fase molto reversibile e una fase in cui la reversibilità cala rapidamente.

Esempio:

```text
new code inactive
→ highly reversible

shadow mode
→ highly reversible

5% candidate routing, no new state format
→ reversible

candidate becomes authoritative writer
→ harder

legacy consumer removed
→ harder

old schema dropped
→ one-way door
```

Il **point of no return** deve essere esplicito nel Refactoring Safety Plan.

Non per vietarlo.

Per sapere quando stiamo attraversando una one-way door.

## Caso reale: GitHub e feature flag

GitHub ha raccontato numerosi rollout in cui la feature flag ha permesso di introdurre cambiamenti gradualmente e disattivarli rapidamente.

Nel progetto di riscrittura dei server-side hooks, per esempio, la nuova implementazione venne messa dietro feature flag e inizialmente abilitata soltanto su alcuni repository interni prima di estendere il rollout.

Fonte:

- [GitHub Engineering — Improving Git push times through faster server side hooks](https://github.blog/engineering/architecture-optimization/improving-git-push-times-through-faster-server-side-hooks/)

In un altro caso, GitHub descrive una query problematica introdotta durante un rollout infrastrutturale: la query fu disabilitata tramite feature flag e successivamente refactorizzata.

Fonte:

- [GitHub Availability Report — April 2023](https://github.blog/news-insights/company-news/github-availability-report-april-2023/)

Il pattern che ci interessa non è “GitHub usa le feature flag”.

È:

> **Il rollout è parte della progettazione del cambiamento, non una fase amministrativa dopo che il codice è finito.**

## Con l'AI possiamo ridurre il batch, non soltanto il tempo

Un agente può aiutarci a costruire rapidamente:

- adapter;
- call-site migration;
- comparison event;
- feature flag wiring;
- test;
- cleanup PR.

Questo rende meno costoso un percorso incrementale.

La tentazione opposta è usare quella capacità per comprimere tutto in un unico cambiamento gigantesco.

Il criterio rimane:

> **La velocità di execution dovrebbe ridurre la dimensione del rischio che dobbiamo accettare per ogni passo, non aumentarla.**
