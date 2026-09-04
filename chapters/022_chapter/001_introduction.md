# Capitolo 22 — Issue-driven development

Un repository AI-ready può spiegare molto bene chi è.

Può dire dove sono i confini, quali documenti sono canonical, quali test eseguire e quando fermarsi.

Ma quando arriva il lavoro concreto resta una domanda:

> **Che cosa deve cambiare adesso?**

Questa risposta non dovrebbe vivere soltanto in una chat, in una call o nella testa di chi ha aperto il task.

Deve diventare un artefatto condiviso.

Nel flusso che useremo in questo capitolo, quell'artefatto è la **issue**.

Non perché GitHub Issues sia l'unico strumento possibile.

Il principio vale anche per Azure Boards, Jira, Linear o un sistema interno.

La parola *issue* qui indica una unità di lavoro versionata o almeno tracciabile che collega:

```text
problema
→ outcome
→ scope
→ contesto
→ acceptance criteria
→ verification
→ stop conditions
```

## Una issue non è una descrizione del codice da scrivere

Una issue debole dice:

```text
Aggiungere retry al publisher.
```

Una issue leggermente più dettagliata dice:

```text
Aggiungere retry con exponential backoff al publisher.
```

La seconda sembra migliore.

Ma potrebbe essere ancora sbagliata.

Non sappiamo:

- quale failure stiamo cercando di gestire;
- se il retry è già presente;
- quali errori sono retriable;
- quale duplicate behavior è accettabile;
- qual è il retry budget;
- come verifichiamo che non stiamo creando una retry storm;
- se modificare la policy richiede una nuova decisione architetturale.

Una issue utile non parte necessariamente dalla soluzione.

Parte dalla differenza fra **stato corrente** e **stato desiderato**.

> **La issue descrive il cambiamento che merita di esistere. Il codice è una delle possibili conseguenze.**

## Perché diventa più importante con gli agenti

Quando una persona riceve una issue ambigua può fare molte cose implicite:

- ricordare una conversazione precedente;
- chiedere al collega accanto;
- riconoscere che il requisito è incompleto;
- fermarsi perché conosce il rischio storico;
- intuire che una frase nel ticket non è più aggiornata.

Un agente può fare alcune di queste cose molto bene.

Può cercare nel repository, leggere documenti, confrontare implementazioni e proporre domande.

Ma l'abbondanza di execution crea un rischio nuovo:

```text
ambiguità
+ agente capace
→ interpretazione plausibile
→ molto codice coerente con quell'interpretazione
```

Il problema non è che il codice sia scritto male.

Può essere scritto benissimo.

Il problema è che **abbiamo accelerato una interpretazione che non avevamo ancora deciso**.

GitHub raccomanda per i coding agent task chiari e ben circoscritti, con descrizione del problema, acceptance criteria completi e indicazioni sui file interessati. OpenAI descrive una pratica analoga: strutturare i task come issue o PR, includendo path, componenti e riferimenti utili.[^github-agent-task][^openai-codex-issues]

Non è una coincidenza.

Quando l'executor può muoversi rapidamente, la qualità del work definition diventa parte del sistema di controllo.

## Issue-driven non significa ticket-driven

C'è però un errore opposto.

Trasformare tutto in ticket dettagliatissimi non rende automaticamente migliore l'ingegneria.

Una issue può diventare:

- una mini-specifica burocratica;
- un design congelato troppo presto;
- una lista di implementazione scritta da chi non ha ancora esplorato il codice;
- un contratto finto che nessuno aggiorna quando emerge nuova evidence.

Issue-driven development non significa:

> scriviamo prima ogni dettaglio e poi eseguiamo senza pensare.

Significa:

> **rendiamo esplicito abbastanza contesto da permettere execution autonoma, e rendiamo espliciti anche i punti in cui l'autonomia deve fermarsi.**

## La issue come boundary

Nel Capitolo 21 abbiamo distinto:

```text
repository context
→ ciò che resta vero fra molti task

task context
→ ciò che deve cambiare adesso
```

La issue è il boundary fra questi due mondi.

Non dovrebbe copiare l'intera architettura.

Dovrebbe invece puntare ai documenti canonical rilevanti e aggiungere soltanto ciò che è specifico del lavoro corrente.

Per esempio:

```text
Requirement
RR-007 restore evidence required

Relevant context
reliability-contract.md
failure-mode-map.md

Task outcome
prove PostgreSQL restore in non-production

Out of scope
change RTO/RPO
switch database technology

Verification
record restore evidence
measure elapsed time
validate recovered state

Stop
restore requires destructive action outside isolated environment
```

La issue non contiene tutto il libro.

Contiene abbastanza per sapere **quale parte del sistema stiamo cercando di cambiare e con quale autorizzazione**.

## La issue come unità di orchestrazione

Un work item ben costruito può essere usato da:

- una persona;
- un pair;
- un coding agent;
- più agenti specialisti;
- un reviewer;
- una pipeline;
- un sistema di audit.

Perché tutti possono leggere lo stesso contratto operativo.

```text
Issue
├── intent
├── scope
├── canonical context
├── acceptance evidence
├── constraints
└── stop conditions
```

Da lì possono nascere:

```text
plan
→ change
→ test
→ review
→ evidence
→ closure
```

Questa è una trasformazione importante.

La issue smette di essere soltanto un elemento del backlog.

Diventa un **handoff boundary** fra decisione ed execution.

## Il compromesso ESI

In Example Software Industries il problema emerge quando Commerce & Operations vuole usare coding agent per smaltire più velocemente il backlog di Order Operations.

Engineering vede opportunità evidenti:

- integration test mancanti;
- documentazione da sincronizzare;
- adapter da implementare;
- telemetry pending;
- piccoli refactoring;
- fitness function aggiuntive.

Ma Product, Security e Payments & Risk pongono un limite corretto:

> non tutte le issue hanno lo stesso grado di decidibilità.

Una issue che chiede:

```text
aggiungi test PostgreSQL per verificare atomicità escalation + outbox
```

può essere sufficientemente definita.

Una issue che chiede:

```text
automatizza il rimborso quando il pagamento fallisce
```

non lo è.

La seconda introduce una nuova semantica economica, permission boundary, audit requirement e failure mode.

Non è execution-ready soltanto perché possiamo scriverla in una riga.

Il compromesso del capitolo diventa quindi:

> **più task delegabili vs costo di preparare issue realmente execution-ready.**

ESI accetta di investire più energia nella definizione dei work item ad alto impatto, senza trasformare ogni fix in una specifica di venti pagine.

Il quality floor protegge:

- business semantics;
- ownership;
- security boundary;
- architecture policy;
- acceptance evidence;
- stop conditions.

## Dove andiamo

Costruiremo progressivamente un modello di issue composto da:

```text
Problem
Outcome
Current state
Scope
Out of scope
Canonical context
Acceptance criteria
Verification
Constraints
Stop conditions
Evidence on closure
```

Vedremo anche:

- quando una issue è troppo grande;
- quando una issue è troppo prescrittiva;
- come usare sub-issue e dependency;
- come distinguere discovery ed execution;
- come evitare acceptance criteria tautologici;
- come impedire a un agente di amplificare il task;
- come aggiornare la issue quando l'evidence cambia il piano;
- quando chiudere il task senza fingere che tutto il sistema sia Verified.

E faremo avanzare Order Operations con un work item reale:

> **verificare su PostgreSQL reale che PaymentEscalation e OutboxMessage siano atomici.**

È un gap che esiste già nella Testing Strategy.

Non inventeremo quindi un task per mostrare il metodo.

Useremo il metodo per affrontare un rischio già presente.

> **Una buona issue non dice all'executor come pensare. Gli dice abbastanza da capire quando può eseguire e quando deve tornare a pensare con noi.**

---

[^github-agent-task]: GitHub Docs, *Best practices for using GitHub Copilot to work on tasks*, https://docs.github.com/en/copilot/using-github-copilot/using-copilot-coding-agent-to-work-on-tasks/best-practices-for-using-copilot-to-work-on-tasks
[^openai-codex-issues]: OpenAI, *How OpenAI uses Codex*, https://openai.com/business/guides-and-resources/how-openai-uses-codex/
