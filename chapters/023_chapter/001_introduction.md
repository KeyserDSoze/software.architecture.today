# Capitolo 23 — Manager di agenti

Finché un solo agente lavora su un task ben definito, il modello mentale è relativamente semplice: qualcuno assegna il lavoro, l'agente esegue, una serie di gate produce evidence e una persona decide se il risultato può avanzare.

Quando introduciamo più agenti, il problema non diventa semplicemente “coordinare più executor”. Cambia la domanda fondamentale:

> **chi ha il diritto di far avanzare il sistema da un risultato prodotto a un risultato accettato?**

Un Planner può decomporre male una requirement e generare sei task perfettamente coerenti con la stessa interpretazione sbagliata. Un Implementer può produrre codice, test e una spiegazione convincente. Un Verifier può leggere soltanto quella spiegazione e chiamarla review indipendente. Un orchestratore può possedere tutti i tool, tutti i secret, tutti i context e tutti i gate fino a diventare un nuovo god object.

La velocità degli agenti rende queste configurazioni molto produttive. Non le rende automaticamente governabili.

Nel Capitolo 21 abbiamo reso il repository navigabile. Nel Capitolo 22 abbiamo reso il work item abbastanza esplicito da separare ciò che l'executor può decidere da ciò che deve fermarlo. Ora aggiungiamo un terzo livello:

```text
repository context
+ bounded work item
+ delegation / permission / verification governance
```

Il filo del capitolo sarà quindi:

```text
work item
→ mandato
→ permission
→ execution
→ evidence
→ independent verification
→ approval / escalation
```

Non partiremo dal numero di agenti.

Partiremo dal punto in cui una responsibility merita di essere separata.

## Multi-agent non è un livello di maturità

È facile associare più agenti a un sistema più evoluto.

È la stessa trappola già incontrata con microservizi, Kubernetes e altri pattern: confondere complessità visibile con maturità.

Un singolo executor che lavora dentro una issue forte, usa permission ristrette e attraversa gate deterministici può essere più affidabile di uno swarm con planner, implementer, reviewer, security agent e synthesis agent che si passano summary incompleti.

Ogni nuovo agente compra qualcosa, ma costa anche qualcosa.

Compra forse indipendenza di verifica, isolation dei permessi, specializzazione del context o parallelismo reale. In cambio introduce un nuovo handoff, un nuovo context boundary, latenza, costo di inferenza e un'altra possibilità di perdere provenance.

La domanda resta la nostra stella polare:

> **quale proprietà stiamo comprando con questa separazione?**

Se la risposta è soltanto “più agenti lavorano insieme”, non abbiamo ancora una ragione architetturale.

## Ruolo e agente non sono la stessa cosa

Nel resto del capitolo useremo nomi come Planner, Implementer, Verifier e Human Decision Owner.

Questi nomi descrivono **responsabilità**, non processi che devono necessariamente esistere come agenti separati.

Un task a basso rischio può avere lo stesso agente che pianifica e implementa, mentre un deterministic gate verifica la proprietà. Un change più sensibile può separare Implementer e Verifier perché la verification deve usare evidence primaria diversa da quella prodotta dall'executor. Una decisione su business semantics può richiedere una persona perché la final authority non appartiene al workflow agentico.

Il design corretto non è quindi:

```text
one responsibility
→ one agent
```

ma:

```text
responsibility
→ separation only when it buys
   independence, permission isolation or clearer authority
```

Questa distinzione evita di costruire un organigramma artificiale prima di aver capito il rischio.

## Le primitive dei framework rendono visibile un problema più vecchio

Le piattaforme agentiche contemporanee espongono sempre più chiaramente concetti come handoff, guardrail, approval human-in-the-loop, tracing e orchestration.

L'OpenAI Agents SDK tratta agenti, handoff, guardrail, human intervention e tracing come primitive distinte. Microsoft Agent Framework documenta workflow sequenziali, concorrenti, handoff e manager-driven, con approval per operazioni che richiedono intervento umano.

Fonti:

- [OpenAI Agents SDK](https://openai.github.io/openai-agents-python/)
- [OpenAI Agents SDK — Handoffs](https://openai.github.io/openai-agents-python/handoffs/)
- [OpenAI Agents SDK — Human in the loop](https://openai.github.io/openai-agents-python/human_in_the_loop/)
- [OpenAI Agents SDK — Tracing](https://openai.github.io/openai-agents-python/tracing/)
- [Microsoft Learn — Workflow orchestrations in Agent Framework](https://learn.microsoft.com/en-us/agent-framework/workflows/orchestrations/)
- [Microsoft Learn — Human-in-the-loop](https://learn.microsoft.com/en-us/agent-framework/workflows/human-in-the-loop)

La lezione interessante non è che oggi esistano API per queste funzioni.

È che, appena l'execution diventa composta, tornano domande classiche di architettura organizzativa e security:

> chi decide, chi esegue, chi può usare quale capability, chi verifica, quale evidence autorizza il passo successivo e come ricostruiamo ciò che è successo?

Il framework offre meccanismi. Il design del boundary resta nostro.

## L'orchestratore non è il capo onnisciente

Un manager di agenti può diventare il nuovo monolite molto facilmente.

Se legge tutto, decide tutto, possiede tutti i tool, sintetizza ogni output, modifica ogni artifact e approva ogni risultato, abbiamo centralizzato routing, knowledge, permission e authority nello stesso punto.

La soluzione può sembrare comoda perché esiste un solo cervello coordinatore. Ma ogni specialista diventa dipendente dalla sua interpretazione e ogni failure del manager ha blast radius sull'intero workflow.

Un orchestratore utile ha un compito più sobrio: riconoscere il tipo di lavoro, assegnare un mandato, applicare il permission boundary, raccogliere evidence, gestire stop condition e sapere quando il task ha smesso di essere execution ed è diventato decisione.

> **Il manager di agenti non deve essere il miglior esperto di ogni dominio. Deve sapere chi può agire, quale evidence pretende e chi possiede l'autorità quando il significato del sistema cambia.**

## Verification: il punto in cui la delega diventa governance

Il vero problema appare quando un output deve autorizzare un passo successivo.

Se l'Implementer dichiara “atomicity verified”, chi può trasformare quella frase in evidence accettata? Un altro agente che legge lo stesso summary? Un integration test contro PostgreSQL reale? Un human reviewer? Una policy automatica?

La risposta dipende dal claim.

Per proprietà deterministiche vogliamo evidence deterministica. Per decisioni di authority vogliamo l'owner corretto. Per risk acceptance vogliamo chi possiede realmente quel rischio. Per una review qualitativa possiamo usare agenti, rubriche e human sampling, ma senza fingere che il numero di reviewer equivalga alla forza della prova.

Da qui nasce la tesi del capitolo:

> **Più execution possiamo delegare, più dobbiamo progettare chi ha il diritto di dichiarare che quell'execution è abbastanza buona per andare avanti.**

## ESI: perché OO-001 è il primo buon candidato

Order Operations possiede ora un work item concreto:

```text
OO-001
Verify PostgreSQL atomicity
for Payment Escalation + Outbox
```

Il task è sufficientemente definito da non richiedere una nuova business decision. Non cambia ownership, non richiede produzione e non introduce una one-way door. Allo stesso tempo deve produrre evidence reale su un boundary importante.

È quindi un ottimo punto per introdurre **autonomia bounded** senza costruire uno swarm.

ESI non separerà ogni responsabilità. Userà un Implementer dentro un mandato A2, deterministic evidence sul PostgreSQL test boundary, un Verifier indipendente per i claim che autorizzano l'accettazione e un human/repository gate sul merge. Specialist review scatterà soltanto se il test environment attraversa nuovi boundary di permission, security o architecture.

Questa decisione compra independence senza pagare il costo di una mini-organizzazione artificiale.

## I tre artefatti del capitolo

Per rendere persistente il modello introduciamo tre artifact, ognuno con una domanda diversa.

```text
Agent Delegation Contract
→ che cosa può fare questo executor?

Agent Verification Bundle
→ quale evidence sostiene il risultato?

AI Autonomy Matrix
→ fino a dove può procedere questa capability senza un nuovo gate?
```

Non sono tre copie della issue e non sono tre prompt.

Il work item resta la source of truth sul task. Il Delegation Contract aggiunge mandato e permission. Il Verification Bundle conserva la catena claim-to-evidence. L'Autonomy Matrix governa quanto lontano una capability può avanzare prima che serva una nuova decisione.

Il quality floor resta quello già costruito nei capitoli precedenti: nessun semantic drift fuori scope, nessuna permission implicita, nessun green ottenuto indebolendo l'oracle, nessuna one-way door attraversata per inerzia e nessun `Verified` senza evidence proporzionata al claim.

> **Il manager di agenti non gestisce una folla di modelli. Gestisce la distanza fra mandato, potere, evidence e autorità.**
