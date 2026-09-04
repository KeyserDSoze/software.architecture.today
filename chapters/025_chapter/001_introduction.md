# Capitolo 25 — One-Man Project

Il nome **One-Man Project** è volutamente provocatorio. Non descrive un eroe solitario, né un’organizzazione in cui una persona sostituisce Product, Security, Platform, Operations e dominio. Nel libro indica un’altra cosa: un **one-person operating model** in cui una singola persona può governare una quantità di execution molto maggiore perché non deve produrre personalmente ogni artefatto.

La domanda nasce naturalmente dopo i capitoli precedenti. Order Operations possiede repository context, work item execution-ready, agent governance, fitness function, test, threat model, cost model e una prima capability AI runtime con un boundary esplicito. Molto lavoro può essere esplorato, implementato e verificato da agenti dentro confini già progettati.

A quel punto il limite non è più soltanto quante righe una persona riesce a scrivere in una giornata.

> **Quanto software può governare una singola persona quando l’execution cresce più velocemente della sua capacità di produrla direttamente?**

Questa è la vera domanda del capitolo.

## Il collo di bottiglia si sposta

L’AI può aumentare la capacità individuale di execution. Una ricerca Microsoft pubblicata nel 2025, aggregando tre randomized field experiment su 4.867 developer di Microsoft, Accenture e una Fortune 100, ha riportato un aumento medio del 26,08% dei task completati per chi aveva accesso a un coding assistant. È evidence utile che il throughput individuale possa crescere; non è evidence che un engineer possa sostituire un’intera organizzazione.

Fonte:

- [Microsoft Research — The Effects of Generative AI on High-Skilled Work](https://www.microsoft.com/en-us/research/publication/the-effects-of-generative-ai-on-high-skilled-work-evidence-from-three-field-experiments-with-software-developers/)

OpenAI descrive allo stesso modo l’uso interno di Codex per code understanding, refactoring, migration, test, incident investigation e task asincroni che un engineer può delegare e poi rivedere. La stessa guida insiste però su task circoscritti, environment riproducibile e review dell’output.

Fonte:

- [OpenAI — How OpenAI uses Codex](https://openai.com/business/guides-and-resources/how-openai-uses-codex/)

Il punto quindi non è negare il leverage. È capire che cosa succede **dopo** che il leverage aumenta.

Un agente può produrre cinque candidate change in parallelo. Una persona deve ancora capire quali conseguenze hanno, quali claim sono supportati dall’evidence e quali decisioni sono state accidentalmente aperte. Un agente può preparare una migration; qualcuno deve ancora accettare il rischio del point of no return. Un agente può proporre una nuova business rule; la capacità di scriverla non trasferisce l’authority di approvarla.

Quando l’execution diventa abbondante, diventano relativamente più scarsi attention, judgment, decision throughput, verification bandwidth, domain understanding e risk acceptance.

> **Più capacità individuale non implica automaticamente più capacità organizzativa.**

Se una persona produce tre volte più cambiamenti ma diventa il collo di bottiglia di tutte le decisioni, delle review e della conoscenza, il sistema non ha eliminato il limite. Lo ha spostato.

## One accountable lead non significa one source of truth

La versione sbagliata del One-Man Project è facile da riconoscere. Una persona conosce tutto, approva tutto, risolve ogni incidente, custodisce le eccezioni e diventa l’unico punto attraverso cui il sistema può essere cambiato in sicurezza.

Questa forma può apparire velocissima finché il lead è disponibile. In realtà ha trasformato il leverage in un **single point of failure umano**.

Il modello che ci interessa fa l’opposto. Concentra parte del control plane tecnico, ma distribuisce la verità e i limiti attraverso repository, test, policy e decision owner espliciti.

```text
one accountable lead
+
externalized knowledge
+
executable verification
+
explicit domain/security/platform gates
+
secondary maintainer
+
continuity evidence
```

Il lead può coordinare molto lavoro senza diventare automaticamente proprietario della semantica di Payments, dell’authorization policy, della piattaforma cloud o di ogni scelta irreversibile.

Questa distinzione è il cuore del capitolo:

> **Essere in grado di fare quasi tutto non significa essere autorizzati a decidere tutto.**

## Il control plane umano

La metafora più utile viene dal cloud.

Nel **data plane** del progetto avviene l’execution: code generation, search, refactoring, test creation, environment setup, document synchronization, candidate review.

Nel **control plane** avvengono decisioni di un altro tipo: quale outcome conta, quale rischio è accettabile, chi possiede la truth, quale contract può cambiare, quale evidence è sufficiente, quando il lavoro deve fermarsi e quando un risultato può avanzare.

Gli agenti aumentano soprattutto la capacità del primo piano. Il One-Man Project funziona soltanto se il secondo resta governabile.

Per questo una persona che governa agenti non diventa semplicemente “uno sviluppatore più veloce”. Diventa un **governor of execution**. Il suo lavoro si sposta verso formulazione del problema, decomposizione, selezione dell’evidence, controllo del WIP, riconoscimento dei boundary e decisioni che non devono essere delegate.

## Il problema ESI

ESI vuole sperimentare questo operating model sul **Case Explanation Assistant** del Capitolo 24. È un buon candidato proprio perché il suo blast radius iniziale è volutamente contenuto: feature interna, read-only, advisory, senza write tool, con fallback e source provenance espliciti.

Commerce & Operations vede un’opportunità: un singolo accountable lead potrebbe portare avanti discovery, provider evaluation, adapter implementation, eval e documentazione usando agenti specializzati, senza creare prematuramente un team dedicato.

Product, Security, Platform e Payments & Risk pongono però una condizione più importante del numero di executor:

> **Ridurre gli handoff di execution non può significare ridurre le prospettive e le authority necessarie per prendere decisioni corrette.**

ESI sceglie quindi un modello con un accountable lead, agenti bounded, specialist gate trigger-based, independent verification, un Secondary Maintainer e una continuity story che vive nel repository anziché nella memoria del lead.

Il costo è reale. Non tutto verrà parallelizzato. Alcuni checkpoint resteranno umani. Documentazione, evidence e handoff devono essere mantenuti. Una seconda persona deve poter riprendere il control plane.

Ma proprio questo costo distingue leverage da fragilità organizzativa.

## La promessa del capitolo

Non cercheremo una formula del tipo “un engineer può gestire X linee di codice” o “N agenti equivalgono a M persone”. Sarebbe una precisione falsa.

Studieremo invece le condizioni che rendono sostenibile il modello: attention budget e WIP, elasticità dei ruoli senza competence laundering, specialist authority, knowledge externalization, continuity, project fit ed exit trigger.

Order Operations possiede già un **One-Man Project Operating Model** che rende espliciti accountable lead, non-authorities, agent portfolio, WIP policy, verification model, specialist trigger e continuity plan. Il documento è Codified; il continuity drill e i dati reali di throughput e costo sono ancora Pending.

È la distinzione corretta da mantenere per tutto il capitolo:

```text
Operating Model        Codified
Continuity model       Designed
Continuity evidence    Pending
Real workflow leverage Pending
Production support fit Pending
```

> **Il One-Man Project non è la prova che una persona possa fare tutto. È un esperimento su quanto lavoro una persona possa governare senza diventare il punto fragile da cui tutto dipende.**
