# 22.5 — Acceptance, verification e chiusura

Una issue non è finita quando compare un diff e non è finita nemmeno quando una pipeline diventa verde.

È finita quando abbiamo evidence sufficiente per sostenere **l'outcome che avevamo dichiarato**, dentro il boundary che avevamo autorizzato.

Questa distinzione sembra sottile finché tutto va bene. Diventa decisiva quando il test passa ma dimostra meno di quanto raccontiamo, oppure quando un task produce un risultato utile ma il sistema complessivo resta ancora incompleto.

## Acceptance descrive la proprietà

Prendiamo il work item di Order Operations:

> verificare che `PaymentEscalation` e `OutboxMessage` abbiano commit atomico su PostgreSQL reale.

La proprietà desiderata non è “esiste un integration test” e non è “`npm run test:integration` è verde”.

È qualcosa di più stabile:

```text
successful transaction
→ escalation committed
→ corresponding outbox committed

second-write failure before commit
→ escalation not committed
→ outbox not committed
```

Questa è **acceptance**: descrive lo stato che deve risultare vero.

Il meccanismo con cui lo dimostriamo può cambiare. Potremmo usare un PostgreSQL effimero locale, un container o un environment di integrazione. Se il meccanismo produce evidence equivalente e rispetta i constraint, la proprietà rimane la stessa.

> **Prima definiamo ciò che deve essere vero. Poi scegliamo il modo più economico e credibile per provarlo.**

## Verification descrive la evidence

La verification risponde a una domanda differente:

> **quale esperimento, test, osservazione o controllo può falsificare la claim?**

Per l'atomicità, un fake repository non basta perché la proprietà riguarda commit e rollback del motore PostgreSQL reale. Serve quindi un'integration test che attraversi quel boundary e osservi lo stato persistito dopo success e failure injection.

Per un retry budget può bastare un test deterministico. Per un private endpoint Azure serve un environment in cui la rete e l'identity siano reali. Per un recovery target serve un drill. Per production observability serve runtime evidence nel sistema effettivamente operato.

La regola resta quella usata per tutto il libro:

```text
claim
→ evidence layer capace di sostenerla
```

Il problema non è avere “più test”. È evitare che una evidence economica venga usata per sostenere una claim più costosa.

## Il comando non è la proprietà

Questa separazione ci protegge anche dal coupling ai tool.

`npm test`, `k6`, Playwright, una query SQL o una pipeline Azure sono meccanismi. Possono essere ottimi, ma non devono sostituire la frase che spiega **che cosa stiamo cercando di dimostrare**.

Se scriviamo soltanto:

```text
Acceptance: npm test passes
```

l'executor può perfino ottenere verde mantenendo intatta l'ambiguità sulla proprietà. Peggio, potrebbe modificare la suite in modo che il comando continui a passare senza dimostrare più ciò che ci serviva.

Se invece acceptance e verification sono separate, possiamo cambiare il meccanismo senza perdere l'intento e possiamo rivedere il meccanismo chiedendoci se sia ancora adeguato alla claim.

## La Definition of Done è baseline, non prova universale

Un team può avere una Definition of Done sana: code review, test verdi, docs sincronizzate, security scan, deployability. È utile perché evita di riscrivere a ogni issue controlli comuni.

Ma una baseline di team non conosce automaticamente il rischio specifico del task.

Un change che tocca una migration può richiedere forward/backward evidence. Un task su tenant isolation richiede negative authorization cases. Un recovery change richiede un drill. Un update di una business rule può richiedere Functional Analysis e regression behavior specifici.

La forma utile diventa quindi:

```text
team baseline
+
task-specific acceptance evidence
```

La checklist generale riduce il ceremony. La issue rende visibile ciò che non è generale.

## Closure: delimitare ciò che ora sappiamo

La parte più importante della chiusura non è la parola `Done`.

È il confine epistemico del risultato.

Per OO-001 una closure onesta potrebbe dire:

```text
Verified
PostgreSQL migration chain 001 → 002 in the chosen integration environment
atomic success scenario
rollback on second-write failure
fast-suite independence

Not verified
Azure Database for PostgreSQL networking
HA / failover
PITR
production latency
production readiness
```

Questa distinzione impedisce al verde di espandersi semanticamente.

`PostgreSQL atomicity Verified` non significa `database architecture Verified`. `Migration chain executed` non significa `rollback production-ready`. La issue chiude esattamente la claim che aveva aperto.

> **Una buona closure non amplifica il risultato. Lo delimita.**

## Il closure report come evidence bundle minimo

Per task delegati è utile produrre una chiusura leggibile senza chiedere al reviewer di rifare tutta l'execution.

Non serve sempre un formato enorme. Serve però poter ricostruire outcome, change surface, verification eseguita, risultato, gap e follow-up.

Una forma compatta è:

```text
Outcome achieved
Files changed
Commands / checks executed
Evidence result
Known limitations
Not verified
Follow-up
```

Questa struttura prepara l'Agent Verification Bundle del capitolo successivo, ma ha valore anche senza agenti. Riduce la distanza fra “mi sembra corretto” e “ecco perché possiamo affermarlo”.

## Chiudere un task senza fingere che il progetto sia finito

Un work item può essere concluso correttamente anche quando il sistema complessivo resta incompleto.

Se il task era “costruire un PostgreSQL harness riproducibile”, possiamo chiuderlo quando il harness parte, applica le migration, esegue una probe e pulisce lo stato. Gli atomicity scenario possono restare un work item successivo.

Tenere aperta la prima issue fino alla production readiness nasconderebbe il progresso. Chiuderla dicendo “PostgreSQL Verified” nasconderebbe i gap.

La disciplina sta nel mezzo:

```text
bounded outcome achieved
→ close

remaining evidence
→ explicit follow-up
```

## Il lavoro scoperto non deve sparire né invadere il task

Durante execution possiamo trovare una migration fragile, una doc obsoleta, una query lenta o un potenziale security gap.

Se la scoperta è necessaria per soddisfare l'acceptance, entra nel task. Se è indipendente, diventa follow-up. Se cambia semantics, ownership o policy, attiva una stop condition.

Questo preserva due cose insieme: l'evidence appena scoperta e l'atomicità del work item.

> **La closure è il punto in cui trasformiamo execution in una dichiarazione verificabile su ciò che il sistema ora è — e su ciò che non abbiamo ancora dimostrato.**
