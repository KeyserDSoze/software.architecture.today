# Quando un One-Man Project ha fit

Il One-Man Project non è un obiettivo organizzativo universale.

Non dobbiamo trasformarlo nella nuova versione di:

```text
microservices are mature
Kubernetes is enterprise
multi-agent is advanced
```

La domanda resta la stessa del resto del libro:

> **ha fit con il problema reale?**

## Il project shape conta

Una singola persona con agenti può governare bene un certo tipo di workload e male un altro.

Le dimensioni importanti includono:

```text
business criticality
regulatory exposure
number of domains involved
rate of semantic change
number of external consumers
operational hours
incident severity
one-way-door density
team/platform support
availability of specialists
verification quality
```

Non esiste quindi una formula:

```text
project size in LOC
< X
→ one-man project
```

Le linee di codice sono una metrica troppo povera.

Un servizio di 5.000 righe che muove denaro può richiedere più governance di una codebase interna di 100.000 righe.

## Fit profile favorevole

Un One-Man Project può avere buon fit quando molte di queste condizioni sono vere:

- outcome relativamente ben delimitato;
- pochi business domain coinvolti;
- platform capability già disponibili;
- repository con buoni test e context;
- reversibilità alta;
- blast radius limitato;
- operazioni non 24/7 oppure supportate da piattaforma/on-call condivisi;
- security/compliance boundary conosciuti;
- numero contenuto di consumer esterni;
- fallback chiari;
- secondary maintainer disponibile;
- domain specialist accessibili quando scattano trigger specifici.

Esempi possibili:

```text
internal engineering tool
bounded workflow automation
small product capability
reporting/analysis service
migration utility
read-only AI assistant
platform adapter
```

Non sono categorie automaticamente sicure.

Sono shape in cui il control plane può restare relativamente piccolo.

## Fit profile sfavorevole

Il modello diventa più rischioso quando troviamo:

```text
many independent business owners
regulated/high-impact decisions
24/7 severe incident burden
complex data residency
large public API surface
rapidly changing external contracts
many irreversible migrations
high fraud/financial risk
safety-critical behavior
large on-call rotation requirement
```

Qui “una persona con agenti” può ancora fare molto lavoro.

Ma il progetto nel suo complesso probabilmente richiede una struttura di ownership e controllo più ampia.

> **L'AI può ridurre il numero di mani necessarie. Non riduce necessariamente il numero di interessi legittimi che devono partecipare a una decisione.**

## Il density test

Possiamo ragionare sulla **decision density**.

Un progetto con molte task execution-heavy ma poche decisioni nuove può essere molto adatto.

Per esempio:

```text
known migration
known target architecture
known test oracle
many mechanical changes
```

Un progetto con poco codice ma molte decisioni ambigue può esserlo molto meno:

```text
new pricing semantics
new regulated workflow
new multi-tenant authorization model
new payment lifecycle
```

Possiamo quindi pensare a:

```text
execution volume
/
decision density
```

Più il numeratore cresce rispetto al denominatore, più gli agenti possono comprare leverage.

Non è una formula numerica da ottimizzare.

È un modo per capire dove il modello ha fit.

## One-way-door density

Un'altra dimensione è quante azioni sono difficili da invertire.

### Two-way-door-heavy project

```text
internal UI
reversible feature flag
read model
bounded refactor
replaceable adapter
```

Il lead può delegare molto.

### One-way-door-heavy project

```text
customer data deletion
ledger migration
public contract removal
region exit
identity model rewrite
legal retention change
```

Qui la quantità di human gate deve crescere.

> **Il One-Man Project scala bene quando l'execution è abbondante e le decisioni irreversibili sono relativamente rare e ben visibili.**

## Dependency on enterprise platform

C'è anche un paradosso importante.

Un One-Man Project enterprise funziona spesso **perché non è veramente solo**.

Può appoggiarsi a:

```text
identity platform
landing zone
CI/CD
artifact registry
observability
security scanning
managed database
managed messaging
incident management
cost allocation
```

Queste capability sono il lavoro accumulato di altri team.

Quando diciamo:

> “una persona gestisce questo prodotto”

non dobbiamo cancellare dal racconto la piattaforma che rende possibile quell'autonomia.

> **L'autonomia locale è spesso costruita sopra una grande quantità di collaborazione resa invisibile dalla piattaforma.**

Questo è uno dei motivi per cui Platform Engineering può aumentare enormemente la fattibilità del One-Man Project.

## Project vs company

Dobbiamo anche evitare un'altra confusione.

```text
One-Man Project
≠
One-Man Company
```

Una persona può governare tecnicamente un prodotto e continuare ad avere bisogno di:

- Product;
- Sales;
- Legal;
- Finance;
- Security;
- Customer Support;
- Operations;
- specialisti di dominio.

Il modello riguarda il **software execution/control loop**, non l'intera organizzazione.

## La maturità del repository cambia il fit

Lo stesso progetto può essere inadatto oggi e adatto domani.

Esempio:

### Oggi

```text
tribal knowledge
manual deploy
no test
shared credential
unknown consumer
```

One-Man Project:

```text
high risk
```

### Dopo foundation work

```text
canonical docs
reproducible build
contract tests
fitness functions
managed identity
observability
runbook
work items
```

One-Man Project:

```text
more governable
```

Quindi AI readiness e One-Man Project readiness sono collegate.

Non perché un file `AGENTS.md` faccia sparire il bisogno di un team.

Perché un sistema con buona externalized knowledge e verification riduce il lavoro che richiede memoria e coordinamento umano continuo.

## Fit review

Prima di adottare questo operating model, ESI chiede almeno:

```text
1. Qual è il business outcome?
2. Qual è il blast radius massimo?
3. Quante decision authority esterne sono coinvolte?
4. Quali one-way door esistono?
5. Quali capability enterprise sono già disponibili?
6. Quanto è riproducibile la verification?
7. Chi prende il controllo se il lead è assente?
8. Quali task richiedono specialist gate?
9. Qual è il WIP sostenibile?
10. Quale evidence ci direbbe che il modello non ha più fit?
```

Il punto non è ottenere dieci risposte verdi.

È rendere visibili i costi che altrimenti apparirebbero soltanto dopo il primo incidente.

> **Non usare il One-Man Project per dimostrare quanto poco personale serve. Usalo soltanto quando rende più semplice produrre valore senza rendere più fragile l'organizzazione.**
