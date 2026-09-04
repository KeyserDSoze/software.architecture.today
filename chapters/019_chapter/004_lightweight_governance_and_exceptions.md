# 19.4 — Governance leggera, eccezioni ed expiry

La parola governance fa spesso pensare a un processo separato dallo sviluppo.

Ticket.

Review board.

Template obbligatori.

Riunione mensile.

Approvazione.

Questo modello può essere necessario per alcune decisioni regolamentate o ad alto rischio.

Ma se ogni cambiamento architetturale deve attraversare lo stesso processo, la governance diventa un collo di bottiglia.

E quando la governance rallenta troppo, i team imparano a lavorarci attorno.

## Governance vicino al cambiamento

La prima domanda dovrebbe essere:

> possiamo rendere questa regola verificabile automaticamente nel normale workflow del team?

Esempi:

```text
forbidden dependency
→ test

IaC policy
→ static/policy check

secret committed
→ scanner

public network accidentally enabled
→ IaC/policy check

SLO breach
→ runtime alert
```

Solo dopo arrivano le review umane.

Microsoft Well-Architected raccomanda automazione dei task ripetitivi e policy/desired-state mechanisms per intercettare configuration drift, mantenendo il judgment umano dove serve.

Riferimento:

- [Microsoft Learn — Architecture strategies for enabling and implementing automation](https://learn.microsoft.com/en-us/azure/well-architected/operational-excellence/enable-automation)

## Una regola automatica non elimina l'eccezione

Le architetture reali hanno eccezioni.

Il problema non è averle.

Il problema è non sapere più:

```text
why
who approved
what risk is accepted
when it expires
what removes it
```

Per ESI una architecture exception deve avere almeno:

```text
Exception ID
Rule violated
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
Rule: application must not call external SDK directly
Exception: temporary vendor adapter in application module
Reason: incident workaround
Owner: Commerce & Operations
Expiry: 14 days
Removal: move adapter to integration layer
```

La differenza fra un'eccezione e il drift è che l'eccezione è **visibile e temporanea**.

> **Un'eccezione senza expiry è spesso una nuova architettura introdotta senza ammetterlo.**

## Waiver debt

Ogni waiver aggiunge debt.

Non soltanto debt tecnica.

Aggiunge debt di governance:

- qualcuno deve ricordarla;
- qualcuno deve riesaminarla;
- qualcuno deve rimuoverla;
- il tooling deve distinguerla da una violation nuova.

Quindi non vogliamo un sistema in cui basta aggiungere:

```text
// architecture-ignore
```

per far passare la pipeline.

L'eccezione deve costare abbastanza da restare consapevole, ma non così tanto da incentivare workaround nascosti.

## Paved road, non recinto

Platform Engineering ha un ruolo importante.

Può offrire:

- template;
- policy;
- baseline security;
- observability adapter;
- deployment pipeline;
- architecture test utilities;
- service metadata conventions.

Questo riduce il costo di fare la cosa giusta.

Ma non deve trasformare la piattaforma in una prigione tecnologica.

Il principio `fit before fashion` vale anche per le piattaforme interne.

Se un workload ha un requirement legittimo che la paved road non soddisfa, la risposta non può essere:

> "non si può perché il template non lo prevede".

Deve esistere un percorso esplicito per:

```text
requirement
→ gap
→ exception / platform evolution
→ evidence
→ decision
```

## Centralizzazione e autonomia

AWS descrive le cloud fitness function anche come meccanismo per allineare decisioni decentralizzate con obiettivi architetturali comuni, mantenendo l'autonomia dei team.

Riferimento:

- [AWS Architecture Blog — Using Cloud Fitness Functions to Drive Evolutionary Architecture](https://aws.amazon.com/blogs/architecture/using-cloud-fitness-functions-to-drive-evolutionary-architecture/)

Questo è il punto.

Non scegliere fra:

```text
central control
OR
team autonomy
```

Costruire invece:

```text
central intent
+ local execution
+ automated feedback
+ explicit exception
```

## Governance ESI

Per Order Operations adottiamo tre livelli.

### Livello 1 — automatico

```text
architecture tests
security static checks
IaC validation
contract checks
```

### Livello 2 — team review

```text
new dependency
new architecture exception
ADR trigger hit
significant cost change
new data copy
```

### Livello 3 — cross-team / enterprise review

Solo quando la decisione attraversa ownership o vincoli più ampi:

```text
Payments semantic change
public ingress
new regulated data
regional topology change
shared platform capability
one-way data migration
```

La governance diventa quindi proporzionale al blast radius.

> **Non tutte le decisioni meritano lo stesso processo. Una two-way door locale non dovrebbe pagare il costo organizzativo di una one-way door enterprise.**

## La regola finale

Governance efficace significa aumentare la probabilità che le decisioni importanti siano intenzionali.

Non significa aumentare il numero di persone che devono dire sì.

> **La governance migliore è quella che rende facile rispettare l'intento, evidente deviare dall'intento e possibile cambiare l'intento quando il contesto lo richiede.**
