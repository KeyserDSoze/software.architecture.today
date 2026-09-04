# 22.3 — Atomic task, dependency e parallelizzazione

Una issue può essere chiara e comunque troppo grande.

Questo problema diventa evidente quando iniziamo a delegare lavoro a più executor in parallelo.

## Atomic non significa minuscolo

Un atomic task non è necessariamente una modifica di cinque righe.

È un task che possiede un outcome coerente, un boundary leggibile e una verification relativamente autonoma.

Esempio:

```text
Aggiungere real PostgreSQL integration test
per atomicità PaymentEscalation + OutboxMessage
```

può essere atomico.

Al contrario:

```text
Completare PostgreSQL, osservabilità, deployment e production readiness
```

non lo è.

Contiene troppi failure mode e troppe decisioni indipendenti.

## Segnali che una issue deve essere spezzata

Una issue è probabilmente troppo grande quando:

- ha più outcome indipendenti;
- richiede owner differenti;
- attraversa più one-way door;
- ha acceptance criteria che possono essere verificati in momenti diversi;
- contiene sia discovery sia implementation sostanziale;
- un fallimento in una parte rende difficile capire il resto;
- produce un diff che attraversa troppi boundary senza necessità.

## Spezzare per evidence

Un criterio molto utile è dividere il lavoro in base alla evidence che abilita il passo successivo.

```text
Issue A
prove PostgreSQL test harness is reproducible
        ↓ evidence
Issue B
prove escalation + outbox atomicity
        ↓ evidence
Issue C
wire gate into CI
```

Non sempre servono tre issue.

Ma questo modello aiuta a capire l'ordine corretto.

> **Una buona decomposizione produce evidence incrementale, non soltanto diff più piccoli.**

## Dependency esplicite

Con persone e agenti paralleli diventa pericoloso nascondere dependency nella cronologia delle conversazioni.

Meglio modellarle:

```text
blocked by
blocks
related to
requires decision from
requires evidence from
```

GitHub supporta issue, sub-issue e planning workflow proprio per organizzare lavoro strutturato; inoltre i coding agent possono essere assegnati direttamente a issue e produrre pull request da quel contesto.[^github-agents]

Il punto architetturale, però, è indipendente dal prodotto:

> **Prima sincronizzare il pensiero. Poi parallelizzare l'esecuzione.**

Se due issue dipendono dalla stessa decisione ancora aperta, assegnarle a due agenti non crea parallelismo utile.

Crea due interpretazioni concorrenti.

## Dependency semantica vs dependency tecnica

Due task possono modificare file diversi e dipendere comunque dalla stessa semantica.

Esempio:

```text
Issue A
add Refund endpoint

Issue B
add Refund event
```

Sembrano separabili.

Ma se nessuno ha ancora definito:

- eligibility;
- authorization;
- partial refund;
- duplicate request;
- audit;
- state transition;

le due issue condividono una dependency funzionale più importante del codice.

Prima serve una decisione di prodotto.

## Parallelizzazione sicura

Una buona parallelizzazione richiede:

```text
shared intent synchronized
+ boundaries independent enough
+ verification local enough
+ merge/integration strategy known
```

Per esempio possiamo parallelizzare:

- documentation gap audit;
- PostgreSQL integration harness;
- telemetry adapter exploration;

solo se non richiedono la stessa decisione architetturale aperta.

## Merge conflict non è l'unico conflict

Gli agenti possono produrre branch che mergiano perfettamente e architetture che non mergiano affatto.

Uno introduce:

```text
Azure SDK direttamente in application/
```

l'altro costruisce:

```text
vendor-neutral port
```

Git può non vedere un conflitto testuale.

AF-005 sì.

Questa è un'altra ragione per cui le fitness function sono parte dell'orchestrazione.

## Work in progress e costo

Più issue attive significano:

- più context switch;
- più branch divergenti;
- più integration risk;
- più review simultanee;
- più agent execution cost.

L'abbondanza di agenti non elimina il limite del work in progress.

Può renderlo meno visibile.

> **Se possiamo iniziare cento task contemporaneamente, diventa ancora più importante sapere quali dieci meritano davvero di essere iniziati.**

---

[^github-agents]: GitHub Docs, *Get started with Copilot agents on GitHub*, https://docs.github.com/en/copilot/how-tos/copilot-on-github/use-copilot-agents/overview
