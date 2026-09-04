# 19.4 — Governance leggera: feedback vicino al change, eccezioni visibili

Governance può significare molte cose.

Nel modello peggiore è un processo esterno al lavoro:

```text
ticket
→ board
→ template
→ meeting
→ approval
```

Alcune one-way door, decisioni regolamentate o cross-enterprise meritano davvero review forti.

Ma se ogni change paga lo stesso costo organizzativo, la governance diventa un collo di bottiglia.

Quando il costo per rispettarla supera stabilmente il valore percepito, i team iniziano a costruire scorciatoie.

La nostra direzione è diversa:

> **portare il feedback il più vicino possibile al punto in cui il drift viene introdotto e lasciare al judgment umano ciò che non è già riducibile a una regola compresa.**

## Automatizzare il noto

Per molte proprietà la risposta può vivere nel normale workflow:

```text
forbidden dependency
→ architecture test

secret committed
→ scanner

public network accidentally enabled
→ IaC / policy check

contract incompatibility
→ contract test

SLO breach
→ runtime signal
```

Microsoft Well-Architected raccomanda automazione dei task ripetitivi e desired-state/policy mechanism per ridurre configuration drift, mantenendo human judgment dove l'automazione non può rappresentare il trade-off.

Fonte:

- [Microsoft Learn — Architecture strategies for enabling and implementing automation](https://learn.microsoft.com/en-us/azure/well-architected/operational-excellence/enable-automation)

Il beneficio non è soltanto velocità.

Il feedback diventa ripetibile e non dipende dal fatto che il reviewer giusto sia presente in ogni PR.

## Una regola automatica non elimina le eccezioni

Le architetture reali hanno eccezioni.

Il problema non è violare temporaneamente una regola.

È perdere il contesto della violazione.

Una architecture exception ESI deve rendere visibili almeno:

```text
Exception ID
Rule / property affected
Reason
Alternative considered
Risk accepted
Owner
Evidence
Expiry / review date
Removal condition
```

Esempio:

```text
AX-004
Property: application must not call vendor SDK directly
Exception: temporary adapter remains in application
Reason: bounded incident workaround
Owner: Commerce & Operations
Expiry: 14 days
Removal: move adapter behind integration boundary
```

La differenza fra exception e drift è soprattutto questa:

```text
exception
→ visible + owned + temporary + reviewable

drift
→ implicit + accumulating + no deliberate exit
```

> **Un'eccezione senza expiry è spesso una nuova decisione architetturale introdotta senza dichiararlo.**

## Una waiver ha carrying cost

Ogni eccezione aggiunge lavoro futuro:

- qualcuno deve riesaminarla;
- il tooling deve distinguerla da una violation nuova;
- il rischio deve restare comprensibile;
- il path temporaneo deve essere rimosso.

Non vogliamo quindi una scorciatoia universale come:

```text
// architecture-ignore
```

che trasformi il bypass nel percorso più economico.

La waiver deve avere abbastanza attrito da restare consapevole, ma non così tanto da incentivare violazioni nascoste.

## Paved road: ridurre il costo del comportamento corretto

Platform Engineering può aiutare offrendo:

- template;
- baseline security;
- deployment pipeline;
- observability adapter;
- architecture-test utilities;
- metadata e ownership convention;
- policy comuni.

La paved road è utile quando abbassa il costo di rispettare proprietà condivise.

Non deve però diventare una prigione tecnologica.

Se un workload ha un requirement legittimo che la piattaforma non soddisfa, la risposta deve essere:

```text
requirement
→ platform gap
→ local exception or platform evolution
→ evidence
→ decision
```

non:

```text
not allowed because template says so
```

`Fit before fashion` vale anche per le piattaforme interne.

## Intent centrale, execution locale

AWS ha descritto le cloud fitness function come un modo per allineare decisioni decentralizzate con obiettivi architetturali comuni senza centralizzare ogni scelta.

Fonte:

- [AWS Architecture Blog — Using Cloud Fitness Functions to Drive Evolutionary Architecture](https://aws.amazon.com/blogs/architecture/using-cloud-fitness-functions-to-drive-evolutionary-architecture/)

La relazione che vogliamo è:

```text
central/shared intent
+ local execution
+ automated feedback
+ explicit exception path
```

Non dobbiamo scegliere fra autonomia totale e controllo centrale totale.

Dobbiamo decidere **quali proprietà meritano di essere comuni** e quali appartengono al workload.

## Tre livelli ESI

Order Operations adotta una governance proporzionata al blast radius.

### Livello 1 — feedback automatico

```text
architecture tests
static security checks
IaC validation
contract checks
```

Per proprietà già comprese e verificabili.

### Livello 2 — team review

```text
new significant dependency
architecture exception
ADR review trigger hit
new derived data copy
meaningful cost / topology change
```

Qui serve judgment locale.

### Livello 3 — cross-team / enterprise review

Quando la decisione attraversa ownership o one-way door importanti:

```text
Payments semantic change
public ingress
regulated data
regional strategy
shared platform capability
irreversible data ownership migration
```

Una two-way door locale non dovrebbe pagare il costo di una one-way door enterprise.

## Il numero di approvazioni non misura la qualità della governance

Possiamo avere dieci firme e una decisione poco compresa.

Possiamo avere zero riunioni e un'ottima governance se intent, evidence, owner, failure action e exception path sono chiari.

La domanda utile è:

> **Il sistema rende facile rispettare l'intento, evidente deviare dall'intento e possibile cambiare l'intento quando il contesto lo richiede?**

Se sì, la governance sta producendo feedback.

Se produce soltanto attesa, probabilmente stiamo governando il processo invece del rischio.