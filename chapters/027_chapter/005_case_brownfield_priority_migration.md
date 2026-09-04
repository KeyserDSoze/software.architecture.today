# 5. Caso 2 — Operations Desk Classic → Order Operations

Il secondo caso è l'opposto del primo.

Campaign Launchpad parte quasi da zero.

La migrazione da **Operations Desk Classic** parte invece da qualcosa di più difficile: **un sistema che funziona abbastanza da non poter essere ignorato, ma che nessuno conosce abbastanza da poter essere riscritto alla cieca**.

## Il problema

ESI vuole ridurre la dipendenza dal legacy e portare la decisione di Priority dentro Order Operations.

La tentazione iniziale potrebbe essere:

```text
rewrite priority logic
→ compare tests
→ switch
```

Ma il Capitolo 17 ha mostrato perché sarebbe pericoloso.

Il legacy conteneva comportamenti osservati che non erano ancora requisiti confermati.

Quindi il percorso reale è diventato:

```text
inventory
→ characterization
→ behavior classification
→ functional confirmation
→ seam
→ candidate
→ shadow comparison
→ cutover gate
```

## Step 1 — Capire prima di cambiare

Operations Desk Classic aveva una regola osservata:

```text
Enterprise + age >= 30m
→ URGENT
```

I characterization test hanno dimostrato che il comportamento esisteva.

Non hanno dimostrato che dovesse sopravvivere.

Evidence state:

```text
implementation
= Found

behavior
= Observed

business rationale
= Unknown
```

Questa distinzione ha impedito il primo errore possibile:

> copiare il legacy nel nuovo sistema e chiamarlo requisito.

## Step 2 — Analisi funzionale condivisa

Product, Operations ed Engineering ricostruiscono la semantica target.

La policy confermata diventa:

```text
Closed
→ NotActionable

manualHold
→ ManualReview

Payment + failedAttempts >= 3
→ Urgent

otherwise
→ Standard
```

La vecchia regola Enterprise viene esplicitamente ritirata.

Quindi la differenza non è regressione.

È una modifica funzionale autorizzata:

```text
ED-001 — ExpectedDifference
```

Questo è un punto importante.

> **La modernizzazione non deve preservare il passato. Deve preservare ciò che del passato è ancora parte del prodotto.**

## Step 3 — Creare un seam

Invece di sostituire tutto in un unico diff, Order Operations introduce:

```text
PriorityPolicy
```

con due implementazioni:

```text
LegacyPriorityAdapter
ConfirmedPriorityPolicy
```

Il nuovo dominio non parla direttamente il linguaggio del legacy.

L'adapter traduce:

```text
status_code
manual_hold
failed_attempts
```

verso il modello target.

Questo è un Anti-Corruption Layer concreto.

Non rende il legacy migliore.

Impedisce che il legacy continui a definire il linguaggio del nuovo sistema.

## Step 4 — Branch by Abstraction

Il caller dipende dall'astrazione:

```text
PriorityPolicy
```

non dall'implementazione legacy.

La strategia di migrazione può quindi usare:

```text
legacy
shadow
candidate
```

senza cambiare continuamente i consumer.

In `shadow`:

```text
legacy result
→ authoritative response

candidate result
→ comparison only
```

Questo crea evidence senza spostare ancora l'autorità.

## Step 5 — Non chiedere zero mismatch

Se il candidate implementa correttamente la nuova policy, almeno un mismatch è atteso:

```text
legacy
Enterprise + age >= 30m
→ Urgent

candidate
Enterprise alone
→ Standard
```

Quindi una shadow comparison seria deve distinguere:

```text
Match
ExpectedDifference
UnexpectedDifference
```

Se chiedessimo zero mismatch, staremmo chiedendo implicitamente al nuovo sistema di conservare proprio la regola che abbiamo deciso di eliminare.

> **La verification corretta dipende dalla semantica target, non dalla nostalgia per il comportamento precedente.**

## Step 6 — Test ed evidence

La migrazione ha accumulato più livelli di evidence.

Legacy:

```text
6/6 characterization tests
```

Target/refactoring slice alla revisione del Capitolo 18:

```text
19/19 tests
```

Architecture fitness:

```text
AF-001…AF-005
5/5 PASS
```

Ma anche qui non confondiamo test locale e production cutover.

Manca ancora:

```text
production shadow telemetry
consumer evidence
retirement evidence
fallback exercise
```

Per questo il current Production Readiness Review dice:

```text
LB-PRIORITY-CANDIDATE
= NOT AUTHORIZED
```

La migrazione non è incompleta perché il codice manca.

È incompleta perché **l'autorità non è ancora stata spostata con evidence sufficiente**.

## Il compromesso ESI

Finance e Platform vorrebbero eliminare rapidamente Operations Desk Classic.

Operations vuole evitare regressioni.

Product vuole eliminare regole storiche non più valide.

Engineering vuole ridurre il periodo di coexistence.

La decisione è:

```text
coexistence temporanea
+ characterization
+ explicit target semantics
+ shadow comparison
+ delayed cutover
```

Costo accettato:

```text
duplicated path
more tests
temporary adapter
migration telemetry
cleanup work later
```

Quality floor:

```text
no silent semantic regression
no legacy rule promoted without confirmation
no cutover without rollback evidence
```

## Il caso reale GitHub

GitHub ha documentato un problema diverso ma con una dinamica di migrazione molto simile durante l'upgrade del proprio monolite da Rails 3.2 a 5.2.

Invece di una lunga branch separata, GitHub introdusse dual boot fra versioni Rails, CI su più versioni e rollout progressivi verso una percentuale dei server, raccogliendo exception e performance evidence prima di aumentare l'esposizione:

- https://github.blog/engineering/infrastructure/upgrading-github-from-rails-3-2-to-5-2/

Non è la stessa migration di ESI.

Ma sostiene una proprietà importante:

> **le migrazioni grandi possono essere rese più governabili mantenendo vecchio e nuovo percorso abbastanza a lungo da produrre evidence comparabile.**

GitHub non dimostra che `Branch by Abstraction` sia sempre la risposta.

Mostra che un big-bang non è l'unico modo di cambiare un sistema molto grande continuando contemporaneamente a svilupparlo e operarlo.

## Il vero end state

La migrazione finirà soltanto quando potremo rimuovere:

```text
legacy adapter
shadow machinery
legacy-only config
characterization-only scaffolding
Operations Desk Classic dependency
```

senza perdere una capacità necessaria.

> **La parte finale di una modernizzazione è eliminare la modernizzazione dal sistema.**

Finché il nuovo prodotto ha bisogno del ponte, la migrazione è ancora parte dell'architettura.