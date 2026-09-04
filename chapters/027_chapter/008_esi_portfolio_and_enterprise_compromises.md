# 8. ESI come portfolio: il compromesso oltre il singolo prodotto

Finora abbiamo osservato tre prodotti/capability separatamente.

Ma ESI non è una collezione di repository indipendenti.

È un'azienda.

E quindi alcune decisioni cambiano quando passiamo da:

```text
qual è la scelta migliore per questo team?
```

a:

```text
qual è la scelta sostenibile per l'azienda?
```

Questa è una delle differenze più importanti fra software design locale e architecture enterprise.

## Tre prodotti, tre esigenze

Campaign Launchpad vuole:

```text
speed
low operational burden
simple publishing
public static delivery
```

Order Operations vuole:

```text
private workforce access
reliability
Payments integration
legacy coexistence
strong operational evidence
```

Case Explanation Assistant vuole:

```text
model evaluation
bounded context
provider governance
AI observability
cost per useful outcome
```

Se ogni team ottimizzasse isolatamente, potremmo ritrovarci con:

```text
3 identity models
3 CI/CD approaches
3 observability stacks
3 secret-management patterns
3 ownership models
3 cost-allocation conventions
```

Non perché i team siano incompetenti.

Perché l'ottimo locale non è automaticamente l'ottimo di sistema.

## Dove standardizzare

ESI dovrebbe cercare standardizzazione soprattutto dove il business value della differenziazione è basso e il costo della varietà è alto.

Esempi:

```text
enterprise identity
secret management
baseline CI/CD
security scanning
cost allocation metadata
logging/telemetry conventions
repository ownership
incident escalation interfaces
landing-zone guardrails
```

Queste capability possono essere offerte da Platform/Security come **paved road**.

La standardizzazione compra:

```text
lower cognitive load
shared operation
faster onboarding
reusable controls
more comparable evidence
```

## Dove non standardizzare troppo

Non è invece sano imporre:

```text
same database
same compute model
same messaging technology
same topology
same test pyramid
same AI architecture
```

solo per uniformità.

Campaign Launchpad e Order Operations hanno esigenze troppo diverse.

Una piattaforma enterprise utile standardizza **guardrail e capability comuni**, non necessariamente ogni decisione applicativa.

> **Standardizza ciò che non differenzia il business. Lascia spazio di decisione dove il contesto del workload cambia davvero.**

## Il conflitto Platform vs product team

Platform può dire:

> Noi supportiamo soltanto App Service.

Marketing può rispondere:

> Ma Campaign Launchpad è prevalentemente statico.

La risposta corretta non è automaticamente una delle due.

Serve valutare:

```text
extra operational surface of a new platform path
vs
unnecessary runtime/cost/complexity of forcing the existing path
```

Un nuovo standard deve guadagnarsi il proprio costo.

Ma anche un'eccezione deve farlo.

## Il conflitto Security vs Product

Product può voler ampliare il Case Explanation Assistant con action tool.

Security può voler mantenere read-only.

La discussione utile non è:

```text
innovation vs bureaucracy
```

ma:

```text
which business outcome requires write capability?
which tool?
which permission?
which confirmation?
which failure?
which rollback/compensation?
which audit?
```

Forse la risposta sarà sì.

Ma il sistema deve prima sapere che cosa significa quel sì.

## Il conflitto Finance vs Reliability

Finance vede:

```text
Premium tier
multiple instances
extra telemetry
staging environment
migration coexistence
```

Reliability e Security vedono:

```text
blast-radius reduction
recovery
private boundary
operational evidence
```

Nessuna delle due viste è sufficiente da sola.

Il Cost Model serve proprio a tradurre:

```text
spesa
→ proprietà comprata
→ rischio/valore protetto
```

Così Finance può contestare il prezzo senza dover negare la proprietà.

Engineering può difendere la proprietà senza dichiarare ogni costo intoccabile.

## Il conflitto Sales/Marketing vs architecture

Marketing può chiedere Campaign Launchpad subito.

Sales può promettere una capability personalizzata a un cliente importante.

Quella promessa può cambiare:

```text
scope
availability
security
multi-tenancy
integration
support
```

Quindi una richiesta commerciale non è soltanto backlog.

Può essere un **architecture input**.

Questo è un altro motivo per cui developer e architect devono conoscere il prodotto e l'analisi funzionale.

Se la semantica resta confinata in un ruolo, gli altri partecipanti vedono soltanto ticket tecnici già troppo tardi per capire il vero compromesso.

## Enterprise architecture come negoziazione verificabile

Nel libro non vogliamo rappresentare l'architect come la persona che decide dall'alto.

Una decisione enterprise utile assomiglia più a:

```text
Product
→ outcome

Domain owner
→ semantics

Security
→ risk boundary

Platform
→ supported operating model

Operations
→ run/recovery requirement

Finance
→ cost/value

Engineering
→ implementation/evolution cost

Architecture
→ integrate trade-offs + make decision/evidence explicit
```

L'architect può facilitare, integrare e decidere alcune parti.

Ma non possiede magicamente tutte le authority.

> **L'architecture è spesso il luogo in cui esigenze legittime smettono di essere slogan e diventano trade-off verificabili.**

## Un portfolio crea anche nuove opportunità

Dopo alcuni prodotti, ESI potrebbe scoprire pattern davvero ricorrenti:

```text
private workforce app baseline
public static publishing baseline
agent governance baseline
AI eval harness
telemetry conventions
production-readiness evidence format
```

A quel punto una capability di piattaforma può avere fit.

Ma la sequenza corretta è:

```text
repeated problem
→ repeated evidence
→ shared capability
```

non:

```text
platform team can build it
→ everyone must use it
```

Questo evita **premature platforming**.

## L'AI amplifica anche il portfolio

Con agenti, ESI può produrre più software.

Questo aumenta il rischio di:

```text
more repositories
more small services
more forgotten internal tools
more dependency/version surfaces
more AI providers
more instructions
more unowned artifacts
```

Quindi l'AI non rende meno importante portfolio governance.

Può renderla più importante.

> **Quando creare un nuovo sistema diventa più economico, decidere se merita di esistere diventa più importante.**

## Il compromesso ESI del Capitolo 27

Esigenza:

```text
massimizzare delivery nei diversi domini ESI
```

Tensione:

```text
local fit
vs
enterprise coherence
```

Decisione:

```text
shared enterprise guardrails
+ workload-specific architecture
+ explicit exception/review trigger
```

Costo accettato:

```text
some central platform investment
some team constraints
some justified exceptions
```

Quality floor:

```text
identity
security ownership
evidence provenance
operability
cost attribution
functional authority
```

Trigger:

```text
repeated exceptions
repeated local solutions
platform friction
unowned systems
security divergence
cost fragmentation
```

La soluzione non è uniformare tutto.

È rendere la diversità **intenzionale e governabile**.

## La vera architettura della software house

A questo punto ESI comincia finalmente a sembrare la software company che avevamo immaginato all'inizio.

Non perché possiede molti prodotti.

Ma perché può avere:

```text
un prodotto marketing semplice
un sistema enterprise brownfield
una capability AI-native
```

senza pretendere che debbano avere la stessa forma.

> **Una grande software house non dimostra maturità costruendo tutto nello stesso modo. La dimostra sapendo quali cose devono essere uguali e quali devono restare diverse.**