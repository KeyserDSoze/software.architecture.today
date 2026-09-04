# Failure mode di un repository “AI-ready”

È facile aggiungere qualche file di istruzioni e dichiarare il repository pronto per gli agenti.

È più utile chiedersi come può fallire.

## 1. Instruction overload

Il repository carica sempre troppe istruzioni.

Sintomi:

- file molto lunghi;
- regole poco rilevanti per il task;
- duplicazione di documentazione;
- agenti che ignorano dettagli importanti perché sommersi dal resto.

Conseguenza:

```text
more context
≠
more understanding
```

Mitigazione:

- global context breve;
- documenti canonical;
- scope locale;
- executable rule per constraint meccanici.

## 2. Instruction drift

Le istruzioni dicono qualcosa che il sistema non fa più.

Esempio:

```text
AGENTS.md:
Order Operations has no priority capability.
```

mentre il repository contiene già `src/priority/`.

L'agente seguirà una fonte apparentemente autorevole ma obsoleta.

Questo è peggio di non avere documentazione.

Mitigazione:

- owner;
- review trigger;
- link invece di copie;
- context fitness test dove praticabile.

## 3. Documentation laundering

Abbiamo introdotto questo anti-pattern nel Capitolo 17.

Qui assume una forma agentica:

```text
agent inference
→ added to AGENTS.md
→ future agent reads it as instruction
→ inference becomes policy
```

Per questo una instruction dovrebbe contenere soltanto decisioni confermate o route verso evidence canonical.

Non dovrebbe essere il luogo in cui “salviamo” ipotesi scoperte durante una singola sessione.

## 4. Golden-command illusion

Il file dice:

```text
npm test
```

ma il comando:

- non parte da ambiente pulito;
- richiede setup non documentato;
- salta test importanti;
- produce flaky failure.

Il repository sembra agent-ready perché possiede un comando.

Non lo è perché il comando non produce evidence affidabile.

## 5. Green-by-editing-the-oracle

Il task fallisce.

L'agente modifica:

- test;
- fixture;
- expected output;
- architecture rule;

finché diventa verde.

Il problema non è l'agente.

È che non abbiamo definito quali oracle possono cambiare e con quale authorization.

Mitigazione:

```text
preserved tests
confirmed semantics
protected fitness rules
reviewed expected differences
```

## 6. Repo map as fantasy architecture

Scriviamo una bella repository map che descrive:

```text
application
contracts
integration
```

ma il codice reale contiene import circolari e accessi trasversali.

La map racconta aspirazione, non realtà.

Questo non è necessariamente sbagliato, purché lo diciamo.

Dobbiamo distinguere:

```text
Current
Target
Exception
```

Altrimenti l'agente può assumere che un boundary esista già e produrre una modifica incoerente con la realtà.

## 7. Tool-specific fragmentation

Ogni team aggiunge:

```text
copilot-instructions.md
CLAUDE.md
GEMINI.md
AGENTS.md
custom-agent.md
```

con contenuto simile ma non identico.

Dopo qualche mese nessuno sa quale sia la source of truth.

Mitigazione:

> **canonical project knowledge first, tool adapters second.**

## 8. Agent cargo cult

Il repository aggiunge directory e file perché “gli agenti li usano”.

Esempio:

```text
/prompts
/skills
/agents
/context
/memory
```

senza task che ne abbiano bisogno.

È la stessa fashion-driven architecture del Capitolo 6 applicata al repository.

Prima domanda:

> quale failure o inefficienza stiamo cercando di ridurre?

## 9. Excessive autonomy by convention

Una instruction dice:

```text
You may modify anything required to complete the task.
```

Sembra pragmatica.

In realtà elimina il boundary.

Per task semplici può produrre diff inutilmente ampi.

Per task delicati può attraversare decisioni architetturali, security boundary o migration one-way door.

Mitigazione:

- scope;
- out of scope;
- stop conditions;
- authorization level.

## 10. Tests as context substitute

Un team può dire:

```text
The tests are the documentation.
```

I test spiegano una parte del comportamento.

Non sempre spiegano:

- perché una rule esiste;
- quale owner l'ha decisa;
- se un comportamento legacy è ancora desiderato;
- quale trade-off stiamo pagando;
- quando una decisione va rivista.

La suite non sostituisce decision context.

## 11. Documentation as verification substitute

L'errore opposto:

```text
AGENTS.md says application cannot import integration.
```

ma nessun gate lo verifica.

Se la regola è meccanica e importante, dovrebbe diventare executable.

## 12. Overfitting al modello corrente

Un repository viene ottimizzato per:

- un particolare formato di prompt;
- una specifica feature preview;
- un determinato model behavior.

Se il tool cambia, metà del contesto perde utilità.

Meglio investire in proprietà più durevoli:

- build ripetibile;
- test;
- ownership;
- documentazione canonical;
- API/contract;
- architecture constraints;
- clear tasks.

## 13. Context without freshness

Un agente legge una documentazione perfetta del mese scorso.

Ma oggi una migration, un incident o un cambio di business ha modificato il contesto.

Da qui una regola fondamentale:

> **Persistent context riduce rediscovery. Non elimina la necessità di osservare lo stato corrente.**

Per questo un task può ancora richiedere:

- diff recente;
- log;
- metriche;
- current config;
- current tests;
- current issue state.

## 14. AI-ready repository, AI-unready organization

Il repository può essere eccellente.

Ma se nessuno sa:

- chi approva una decisione;
- chi possiede il sistema;
- chi risponde a una security escalation;
- chi decide una one-way door;
- chi valida una business rule;

l'agente incontrerà comunque un vuoto di governance.

Questa è la ragione per cui ESI non può risolvere tutto con `AGENTS.md`.

Il repository deve collegarsi a owner reali.

## Un nuovo test mentale

Per ogni instruction chiediamo:

```text
Is it true?
Is it authoritative?
Is it stable?
Is it scoped?
Can it be verified?
Who updates it?
What happens when it conflicts with reality?
```

Se non sappiamo rispondere, probabilmente stiamo accumulando context debt.

## La metrica sbagliata

Non misureremo l'AI-readiness dal numero di:

```text
instruction files
prompt templates
agent skills
```

Una metrica più interessante è:

> **quanto rapidamente un nuovo contributor può passare da task a modifica verificata senza dipendere da conoscenza non dichiarata?**

E una seconda:

> **quante volte un agente deve riscoprire una informazione stabile che il repository avrebbe potuto rendere persistente?**

## Corollario

> **Un repository AI-ready non è quello che parla di più agli agenti. È quello che riduce meglio l'ambiguità senza trasformare l'ambiguità in regole inventate.**