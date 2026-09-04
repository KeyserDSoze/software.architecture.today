# 22.4 — Discovery issue ed execution issue

Non tutto il lavoro che merita di essere tracciato è già pronto per essere implementato.

A volte il risultato più professionale di un task non è un diff. È una riduzione dell'incertezza abbastanza forte da permettere una decisione successiva.

Questa distinzione diventa particolarmente importante quando l'execution è economica. Se possiamo produrre codice molto rapidamente, aumenta la tentazione di usare l'implementazione per scoprire quale fosse il problema. In alcuni prototipi è una strategia sensata. In una migrazione, in un security boundary o in una capability con consumer sconosciuti può diventare un modo costoso di imparare tardi.

Per questo distinguiamo due classi di work item.

Una **discovery issue** prova a cambiare ciò che sappiamo. Una **execution issue** prova a cambiare il sistema sulla base di conoscenza già sufficientemente stabile.

La differenza non è teorica. Cambia che cosa consideriamo un outcome valido.

## Quando il prossimo output deve essere conoscenza

Immaginiamo di voler rimuovere un nightly export da Operations Desk Classic.

La frase “sostituisci il legacy export con la nuova API” sembra execution-ready soltanto finché non iniziamo a guardare il sistema reale. Potremmo scoprire uno script Finance, un consumer non registrato, una retention con valore audit o un processo manuale che nessuno aveva incluso nella Functional Analysis.

A quel punto il problema non è ancora “come implementiamo il nuovo contract?”. È:

> **chi dipende davvero dal comportamento attuale e quale compatibilità dobbiamo preservare?**

Una discovery issue può quindi avere come outcome un consumer inventory con owner, frequenza, criticità e livello di evidence. Il suo out of scope può essere esplicito: non spegnere il job, non cambiare il contract, non migrare ancora nessuno.

Questa non è analisi che rallenta la delivery. È la delivery necessaria prima che il cambiamento possa avere un boundary credibile.

Nel linguaggio del Capitolo 17 continuiamo a usare:

```text
Found
→ Inferred
→ Observed
→ Confirmed
```

Un agente può trovare tre script che leggono un file e formulare l'ipotesi che siano consumer. Non può promuovere automaticamente l'assenza di altri call site a prova che in produzione non esistano altri consumer.

> **Discovery significa rendere più costoso confondere ciò che abbiamo trovato con ciò che abbiamo confermato.**

## Il failure mode: implementation as discovery

Il problema più insidioso nasce quando un task ambiguo viene trattato come implementazione e l'evidence emerge mentre il patch cresce.

L'executor parte con un'interpretazione. Poi trova dati che la indeboliscono, ma invece di fermarsi incorpora workaround, nuove assunzioni e altre modifiche. Alla fine abbiamo imparato molto, ma lo abbiamo imparato dentro un diff che presupponeva già la risposta.

La sequenza diventa:

```text
unknowns
→ implementation
→ discoveries
→ patch expansion
→ late semantic review
```

La sequenza più sicura, quando l'incertezza riguarda ownership, consumer, contract o rischio, è spesso:

```text
unknowns
→ discovery
→ explicit evidence
→ decision
→ bounded execution
```

Questo non impone sempre due issue. Impone però di riconoscere quando **l'output desiderato è conoscenza prima che codice**.

## Spike e prototype non sono automaticamente production work

Discovery può richiedere codice.

Uno spike può misurare latency. Un prototype può verificare se una libreria supporta una capability. Un piccolo importer può permetterci di esplorare uno schema. Un benchmark può confrontare due alternative. Tutto questo è execution tecnica, ma non significa che il risultato debba diventare production implementation.

Il work item deve rendere chiaro il contratto.

```text
Deliverable
throw-away prototype + findings

Acceptance
question answered with evidence

Not acceptance
production-ready component
```

Questa distinzione protegge da un altro shortcut frequente: “funziona nel prototype, quindi lo promuoviamo”.

Il prototype prova una domanda. La production implementation deve soddisfare un insieme più ampio di requirement, security, operability, ownership e lifecycle.

## Anche la discovery ha bisogno di una fine

Se l'execution issue ha acceptance criteria, la discovery ha bisogno di **exit criteria**.

Non servono criteri finti del tipo “analisi completata”. Serve descrivere quale incertezza deve risultare abbastanza ridotta.

Per l'export legacy potremmo decidere che la discovery termina quando i consumer conosciuti sono identificati o marcati esplicitamente come unknown, gli owner sono contattati, la compatibility window è stimata e i blocker possono essere trasformati in decisioni o execution issue.

La discovery non deve eliminare ogni dubbio. Deve arrivare al punto in cui il dubbio residuo è compatibile con la prossima scelta.

> **L'exit criterion della discovery è la decidibilità del passo successivo.**

## L'AI è molto forte proprio nella discovery, ma non cambia la scala dell'evidence

Gli agenti possono accelerare enormemente search, call-site mapping, schema comparison, configuration analysis e sintesi di documentazione. Possono proporre hypothesis e mettere in relazione segnali che un essere umano troverebbe in ore.

Questa velocità non cambia il significato delle fonti.

Se un agente non trova un consumer, abbiamo evidence di ricerca, non prova di assenza. Se deduce un owner da un namespace, abbiamo un'inferenza, non ownership confermata. Se un commento descrive una rule, abbiamo trovato testo, non necessariamente semantica corrente.

Quindi il valore dell'AI nella discovery cresce insieme alla disciplina epistemica:

```text
fast search
+ explicit evidence state
→ faster useful understanding
```

non:

```text
fast search
→ automatic truth
```

## Promuovere una discovery a execution

Una discovery è riuscita quando rende il lavoro successivo più piccolo e più autorizzabile.

Dopo l'inventory dei consumer, per esempio, potremmo ottenere tre execution issue indipendenti, ciascuna con owner, contract e verification differenti. Oppure potremmo scoprire che uno dei consumer non può ancora migrare e che il legacy export deve restare per un periodo definito.

In entrambi i casi abbiamo prodotto progresso, anche se non abbiamo rimosso una riga di legacy.

La sequenza che ci interessa è:

```text
broad uncertainty
        ↓
discovery evidence
        ↓
decision / confirmed boundary
        ↓
smaller execution issue
```

> **Discovery non è il contrario della delivery. È delivery di conoscenza quando la conoscenza è il prerequisito del cambiamento.**
