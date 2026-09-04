# Capitolo 23 — Manager di agenti

Un agente che scrive codice è facile da immaginare.

Un sistema in cui più agenti pianificano, implementano, verificano, ricercano e si passano lavoro è più interessante.

Ed è anche molto più facile da progettare male.

Se un singolo agente può interpretare male una richiesta, più agenti possono moltiplicare la stessa interpretazione sbagliata a velocità maggiore.

Se un agente può modificare codice e test, un altro può leggere quel risultato e considerarlo evidence.

Se l'orchestratore assegna lavoro senza distinguere decisione, execution e verification, la parallelizzazione diventa soltanto una forma più sofisticata di confusione.

Il punto quindi non è:

> quanti agenti possiamo mettere al lavoro?

La domanda utile è:

> **quale lavoro possiamo separare senza separare anche la responsabilità, il contesto e il criterio con cui giudichiamo il risultato?**

Nel Capitolo 21 abbiamo reso il repository leggibile da contributor umani e agenti.

Nel Capitolo 22 abbiamo trasformato la issue in un execution contract.

Ora abbiamo:

```text
repository context
+
work item
+
scope
+
acceptance criteria
+
verification
+
stop conditions
```

Questo è il momento in cui può avere senso introdurre più agenti.

Non prima.

## Da copilota a organizzazione

Quando l'AI viene usata come semplice assistente, il modello mentale è spesso:

```text
human
→ prompt
→ model
→ answer
```

Quando l'execution cresce, il modello diventa più simile a un sistema organizzativo:

```text
Human Decision Owner
        ↓
   Orchestrator
    /   |    \
Planner Implementer Verifier
          |
      Specialist
```

Questo non significa che servano sempre cinque processi distinti.

I nomi indicano **responsabilità**, non prodotti.

Un singolo agente può ricoprire più ruoli in un task a basso rischio.

Due agenti possono essere sufficienti quando vogliamo separare implementazione e review.

Un workflow più critico può richiedere agenti con contesti e permessi differenti.

La domanda non è quanti agenti abbiamo.

La domanda è quali **separation of concerns** meritano di esistere.

## Multi-agent non è un maturity level

Anche qui vale una regola ormai familiare:

> **Fit before fashion.**

Un workflow con un solo agente, una buona issue e una suite forte può essere migliore di un'orchestrazione con sei specialisti che passano fra loro riassunti incompleti.

Aggiungere un agente introduce almeno:

- un nuovo context boundary;
- un nuovo punto di handoff;
- possibile perdita o distorsione di informazione;
- nuova latenza;
- nuovo costo di inferenza/tooling;
- un altro output da verificare;
- possibili conflitti fra conclusioni.

Quindi un agente aggiuntivo deve comprare una proprietà.

Per esempio:

```text
separazione dei permessi
indipendenza della verifica
specializzazione del contesto
parallelismo realmente indipendente
adversarial review
riduzione della context pollution
```

Se non sappiamo quale proprietà stiamo comprando, stiamo probabilmente aggiungendo **organizational complexity artificiale**.

## Le primitive esistono già

Le piattaforme agentiche contemporanee rendono sempre più esplicite le stesse primitive architetturali.

L'OpenAI Agents SDK tratta come concetti distinti agenti, handoff, guardrail, human-in-the-loop e tracing. Gli handoff permettono di trasferire il controllo a specialisti; i guardrail applicano controlli; il tracing rende osservabile il workflow; il meccanismo HITL può sospendere una run in attesa di approvazione umana.

Fonti:

- [OpenAI Agents SDK](https://openai.github.io/openai-agents-python/)
- [OpenAI Agents SDK — Handoffs](https://openai.github.io/openai-agents-python/handoffs/)
- [OpenAI Agents SDK — Human in the loop](https://openai.github.io/openai-agents-python/human_in_the_loop/)
- [OpenAI Agents SDK — Tracing](https://openai.github.io/openai-agents-python/tracing/)

Microsoft Agent Framework documenta orchestration sequenziali, concorrenti, handoff, group chat e manager-driven, con approval human-in-the-loop per tool sensibili.

Fonti:

- [Microsoft Learn — Workflow orchestrations in Agent Framework](https://learn.microsoft.com/en-us/agent-framework/workflows/orchestrations/)
- [Microsoft Learn — Human-in-the-loop](https://learn.microsoft.com/en-us/agent-framework/workflows/human-in-the-loop)

La cosa interessante non è che esistano queste API.

È che il problema che rappresentano è molto più vecchio dell'AI:

```text
chi decide?
chi esegue?
chi può usare quale capability?
chi verifica?
chi autorizza il prossimo passo?
come ricostruiamo che cosa è successo?
```

Queste sono domande di architettura e governance.

## L'orchestratore non deve diventare il nuovo monolite

È facile costruire un orchestratore che:

- legge tutto;
- decide tutto;
- chiama tutti;
- verifica tutto;
- possiede tutti i secret;
- modifica ogni artifact;
- approva ogni risultato.

Abbiamo semplicemente ricreato un **god object organizzativo**, questa volta sotto forma di agente.

Un orchestratore utile dovrebbe conoscere abbastanza da:

1. classificare il lavoro;
2. scegliere il workflow appropriato;
3. assegnare scope e permission;
4. raccogliere evidence;
5. applicare stop/escalation condition;
6. chiedere una decisione umana quando cambia il significato del sistema.

Non deve necessariamente essere il miglior programmatore, il miglior security reviewer e il miglior domain expert contemporaneamente.

> **Il manager di agenti non deve sapere fare meglio tutto il lavoro. Deve sapere quale lavoro può essere delegato, quale evidence pretende e quando fermare la macchina.**

## ESI: il nuovo problema

Order Operations possiede ora un work item reale:

```text
OO-001
Verify PostgreSQL atomicity
for Payment Escalation + Outbox
```

La issue è execution-ready.

Ma ESI vuole iniziare a delegare più execution.

Commerce & Operations vede un'opportunità:

- un agent può preparare l'integration harness;
- un altro può verificare la migration chain;
- un reviewer può controllare che il test dimostri realmente atomicità;
- un security reviewer può controllare che test environment e credential boundary siano appropriati.

Platform vede però un rischio opposto:

> creare una mini-organizzazione AI più costosa da coordinare del task stesso.

Security aggiunge un'altra tensione:

> un agente capace di creare environment e usare tool non deve automaticamente avere permission su risorse condivise o produzione.

Engineering vuole parallelizzare.

Product vuole che nessun agente inventi semantica.

La decisione del capitolo sarà quindi più sobria:

```text
role separation
solo dove compra independence o permission isolation

human decision gate
sulle one-way/high-impact decision

independent verification
per i claim che autorizzano il passo successivo

least privilege
anche fra agenti
```

## Il quality floor

Qualunque autonomia ESI conceda, alcune proprietà non diventano negoziabili:

- un agente non può cambiare business semantics fuori scope;
- capability non equivale ad authorization;
- un implementer non può promuovere da solo il proprio output a `Verified` quando la verification è materialmente indipendente;
- test/fitness/security oracle non vanno indeboliti per ottenere green;
- high-risk/irreversible action richiedono un gate esplicito;
- ogni handoff deve mantenere la provenance del task e dell'evidence;
- fallimento o incertezza devono poter produrre `Stopped`, non execution infinita.

Questo capitolo introduce tre artefatti:

```text
Agent Delegation Contract
Agent Verification Bundle
AI Autonomy Matrix
```

Non come documenti burocratici.

Come tre risposte a tre domande diverse:

```text
Delegation Contract
→ che cosa può fare questo executor?

Verification Bundle
→ perché dovremmo credere al risultato?

Autonomy Matrix
→ fino a dove può procedere senza un nuovo gate?
```

## Cosa costruiremo

Il percorso sarà:

```text
ruoli
→ orchestration pattern
→ handoff
→ permission boundary
→ human-in-the-loop
→ independent verification
→ delegation contract
→ verification bundle
→ autonomy levels
→ ESI operating model
```

La tesi che ci accompagnerà è:

> **Più execution possiamo delegare, più dobbiamo progettare chi ha il diritto di dichiarare che quell'execution è abbastanza buona per andare avanti.**
