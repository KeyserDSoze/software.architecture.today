# 28.2 — L'analisi funzionale non appartiene solo all'analista

Una delle separazioni organizzative più pericolose è quella che assegna il significato del prodotto a un ruolo e l'implementazione a un altro: il Business Analyst capisce il dominio, il developer traduce ticket in codice, l'architect disegna componenti.

Sulla carta sembra efficiente. Nella pratica può produrre tre versioni parziali dello stesso sistema: ciò che il business intende, ciò che il codice fa e ciò che i diagrammi dicono che dovrebbe accadere.

Quando queste tre conoscenze si sovrappongono troppo poco, la fragilità emerge proprio nei punti in cui il significato cambia.

Per questo l'architect deve saper **leggere, discutere e produrre analisi funzionale**. Non per sostituire Product o Business Analysis, ma perché non si può progettare responsabilmente un sistema che si conosce soltanto attraverso nomi di servizi e ticket.

> **L'analisi funzionale può avere specialisti. La comprensione funzionale non può avere un solo proprietario.**

## Prima del protocollo viene il significato

Prendiamo una richiesta apparentemente semplice:

> Aggiungiamo un pulsante per annullare un ordine.

È facile passare immediatamente a endpoint, event, queue e idempotency. Ma le decisioni architetturali dipendono prima da altre domande: chi può annullare, in quali stati, se l'annullamento è una richiesta o un effetto immediato, cosa accade dopo il capture del pagamento o l'avvio della spedizione, chi possiede la decisione economica, quale compensazione è possibile, quali obblighi di audit esistono.

Queste risposte cambiano ownership, API semantics, transaction boundary, authorization, consistency, recovery, UX e support procedure.

L'analisi funzionale non vive quindi "prima" dell'architettura come una fase separata. È una delle sue sorgenti.

## Visione d'insieme non significa conoscere ogni dettaglio

In un sistema grande nessuno può conoscere tutto. Ma chi prende decisioni significative deve almeno riuscire a ricostruire attori principali, critical journey, stati business importanti, ownership dei fatti, side effect irreversibili o economici, boundary organizzativi e principali eccezioni.

Questo vale per architect, developer, tester, product engineer, SRE, security engineer e per chi governa agent execution.

La profondità cambia per ruolo. La visione d'insieme non dovrebbe scomparire.

> **Un team può distribuire il lavoro. Non può distribuire la comprensione fino al punto in cui nessuno vede più il sistema intero.**

## Leggere una functional specification significa interrogare il significato

Microsoft Well-Architected collega architecture design e functional specification e descrive il design come attività collaborativa fra stakeholder, developer, tester, operations e product owner.

Fonte:

- [Microsoft Learn — Develop an architecture design specification](https://learn.microsoft.com/en-us/azure/well-architected/architect-role/architecture-design-specification)

La lezione utile non è adottare un formato specifico. È riconoscere che una functional specification deve essere letta cercando ambiguità, contraddizioni, one-way door, NFR impliciti, ownership non chiare e decisioni che appartengono a un'autorità diversa.

Una frase grammaticalmente perfetta può essere funzionalmente ambigua. Un acceptance criterion apparentemente preciso può comunque non dire chi possiede il fatto che stiamo verificando.

## Saper fare una prima analisi è diverso dal decidere per il business

Non sempre esiste un analyst disponibile. Una migration può rivelare una regola legacy mai formalizzata. Un incidente può mostrare una semantica implicita. Una feature AI può obbligarci a distinguere se una risposta è un fatto, un suggerimento o una decisione.

In questi casi l'architect non dovrebbe accumulare `TBD by Product` senza struttura. Deve saper trasformare l'incertezza in un oggetto discutibile: problema, attori, outcome, journey, stati, regole, eccezioni, ownership, non-goal, open question e acceptance semantics.

Poi quella bozza va portata a chi possiede l'autorità necessaria.

> **Saper fare analisi funzionale significa saper rendere una decisione discutibile. Non significa arrogarsi il diritto di prenderla.**

## L'analisi è migliore quando diventa un oggetto condiviso

Una buona functional analysis non dovrebbe essere un documento che un ruolo consegna a un altro. Può diventare il punto di convergenza di prospettive differenti.

Product chiarisce outcome e priorità. Il domain expert chiarisce regole ed eccezioni. L'architect espone ownership, irreversibilità e quality implications. Il developer porta feasibility e hidden behavior dell'esistente. Il tester trasforma regole in acceptance falsificabile. Security porta abuse case e authorization. Operations porta failure e recovery consequence.

Questo non è analysis by committee. È costruzione di comprensione condivisa prima che il codice renda costose le interpretazioni divergenti.

## L'AI rende più costosa l'ambiguità nascosta

Un agente è molto bravo a riempire un vuoto con un'interpretazione plausibile. Per scaffolding e mapping meccanici è un vantaggio. Per business rule, ownership, authorization, contract o economic effect può essere pericoloso.

Una issue come:

```text
Implement cancel order
```

può produrre in poco tempo una soluzione tecnicamente coerente. Ma "plausibile" non significa "autorizzata dal prodotto".

Più l'execution costa poco, meno possiamo permetterci che l'ambiguità rimanga invisibile.

> **L'AI riduce il costo di implementare un'interpretazione. Per questo aumenta il valore di sapere se quell'interpretazione è autorizzata.**

## Functional Literacy Baseline ESI

Nella Capability Map ESI, la baseline non richiede che ogni architect sia il miglior analyst dell'azienda. Richiede però che sappia leggere una functional analysis, costruirne una prima bozza quando manca, modellare journey e stati, identificare invariant, separare requirement da implementation suggestion, rendere esplicite ownership e decision authority, trasformare ambiguità in open question e collegare acceptance semantics a evidence.

Un test semplice è chiedere, prima di aprire il diagramma: quale problema risolve la capability, chi la usa, quali stati attraversa, quali invarianti non può violare, chi possiede i fatti, quali side effect sono difficili da invertire e quale evidence dimostrerebbe che la promessa è rispettata.

Non è necessario conoscere tutte le risposte in anticipo. È necessario riconoscere quando mancano.

La frase che ESI non considera accettabile come baseline professionale è:

> "Io mi occupo solo della parte tecnica."

Perché nel software il significato del prodotto è già parte della tecnica nel momento in cui determina boundary, consistency, security, recovery e rischio.
