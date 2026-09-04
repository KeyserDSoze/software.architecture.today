# Istruzioni persistenti senza context pollution

L'idea di aggiungere istruzioni al repository è semplice.

La parte difficile è capire **che cosa non mettere nelle istruzioni**.

Un file di istruzioni cresce facilmente così:

```text
Settimana 1
→ build commands

Settimana 2
→ coding style

Settimana 3
→ architecture rules

Settimana 4
→ business glossary

Settimana 6
→ incident workaround

Settimana 8
→ cloud deployment manual

Settimana 12
→ 900 righe che nessuno osa più modificare
```

A quel punto abbiamo ricreato la wiki monolitica dentro il prompt context.

## Always-on context deve meritare di esserlo

Una informazione dovrebbe essere always-on quando:

- si applica alla maggior parte dei task;
- una violazione ha costo elevato;
- non è facilmente deducibile dal codice;
- è stabile abbastanza da giustificare il costo di manutenzione.

Esempi validi:

```text
This repository is Order Operations.
Payments & Risk owns economic effects.
Run npm test before completing a code change.
Core semantic layers must not import Azure SDKs.
Do not change production topology without updating the relevant ADR/threat/reliability/cost docs.
```

Esempi dubbi:

```text
Every detail of every API endpoint
Full database schema
Complete incident history
Entire functional specification
All coding examples
```

Questi contenuti possono essere linkati e letti quando necessari.

## Scope

Le istruzioni devono avere uno scope.

Una regola per `infra/` non dovrebbe inquinare ogni modifica a `src/priority/`.

Una regola per una migration non deve essere sempre caricata per un change puramente UI.

I meccanismi moderni di custom instructions supportano proprio scope repository-wide e path-specific. GitHub documenta sia istruzioni globali al repository sia file specifici per path; `AGENTS.md` supporta inoltre nesting per directory in diversi agenti.

Fonti:

- [GitHub Docs — Add custom instructions for Copilot](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions)
- [GitHub Docs — Support for different types of custom instructions](https://docs.github.com/en/copilot/reference/custom-instructions-support)
- [AGENTS.md](https://agents.md/)

La capability è utile, ma la decisione architetturale resta nostra:

> quale informazione merita uno scope globale e quale deve restare locale?

## Tool-neutral first

ESI usa più strumenti.

Non vogliamo mantenere la stessa architettura riscritta per ogni vendor.

Per questo il contesto stabile dovrebbe essere il più possibile tool-neutral:

```text
AGENTS.md
canonical docs
verification scripts
```

Un file tool-specific può essere aggiunto quando esiste un comportamento realmente specifico del tool.

Non deve diventare una seconda source of truth.

GitHub stessa oggi supporta `AGENTS.md` oltre alle proprie instruction files in diverse superfici Copilot. Questo rende praticabile un nucleo condiviso senza obbligarci a scegliere un solo agente per tutto il repository.

## Instruction hierarchy

Quando esistono più livelli, dobbiamo rendere prevedibile la precedenza.

Esempio concettuale:

```text
organization constraints
↓
repository constraints
↓
component/path constraints
↓
task-specific requirement
```

Più vicino al task significa normalmente più specifico, non più potente.

Una issue non dovrebbe poter dire:

```text
ignore tenant isolation
```

solo perché è più specifica.

Esistono constraint che appartengono a un livello di governance superiore.

Quindi dobbiamo distinguere:

```text
specificity
vs
authority
```

Questo tema tornerà quando parleremo di autonomia degli agenti.

## Negative instructions

Le istruzioni positive dicono cosa fare.

Le negative instructions definiscono spesso il vero blast radius.

Esempio:

```text
Do not:
- add direct writes to Payments state
- change legacy characterization to match target behavior
- introduce public ingress
- add secrets to source or instructions
- weaken architecture tests to make a change pass
```

Sono particolarmente utili quando il repository contiene una soluzione apparentemente più semplice che violerebbe una decisione intenzionale.

## Stop conditions

Una instruction realmente utile deve dire anche quando non procedere.

Per esempio:

```text
Stop and request a decision if:
- business semantics are ambiguous;
- a change requires a new authoritative data owner;
- a public ingress is introduced;
- a one-way migration is required;
- a failing architecture rule appears obsolete rather than violated;
- a test expectation conflicts with confirmed functional analysis.
```

Questa è una forma di progettazione dell'autonomia.

Un agente capace di produrre codice non è automaticamente autorizzato a risolvere una ambiguità di prodotto.

## Secrets e informazioni sensibili

Un repository instruction file non è un secret store.

Non dobbiamo inserire:

```text
API keys
password
private tokens
production credentials
sensitive customer examples
```

Le istruzioni possono spiegare **come ottenere** una credenziale attraverso il meccanismo approvato.

Non devono contenerla.

In altre parole:

```text
context
≠
credential
```

## Instruction debt

Le istruzioni possono diventare debito.

Segnali:

- regole contraddittorie;
- comandi che non funzionano più;
- path rinominati;
- workaround per incidenti risolti anni fa;
- constraint che proteggono una decisione superata;
- pagine copiate in file diversi;
- agenti che spendono più tempo a interpretare istruzioni che a esplorare il codice.

Dobbiamo quindi trattarle come codice operativo:

```text
owner
review
change with system
remove when obsolete
```

## Non usare prose dove basta una regola eseguibile

Se scriviamo:

```text
Never import Azure SDK from application layer.
```

ma abbiamo già AF-005, la instruction può semplicemente dire:

```text
Architecture rules are executable in tests/architecture-fitness.test.mjs.
Do not weaken them to make a task pass; if a rule no longer fits, reopen the architectural decision.
```

Questo riduce duplicazione e rende la regola verificabile.

## Non usare una regola eseguibile dove serve judgment

L'opposto è altrettanto importante.

Non possiamo trasformare facilmente in lint:

```text
questa nuova capability appartiene davvero a Order Operations?
```

oppure:

```text
questo SLO vale ancora il suo costo?
```

Qui serve decision context e review.

La maturità sta nel sapere cosa automatizzare.

## L'istruzione come route, non enciclopedia

La forma che cerchiamo è:

```text
If touching business behavior
→ read functional analysis + requirements

If touching payment escalation
→ read API contract + event contract + data ownership

If touching infra
→ read cloud + threat + reliability + cost model

Run
→ npm run typecheck
→ npm test
```

L'istruzione indirizza.

Il documento canonical spiega.

Il test verifica.

> **Un buon file di istruzioni non prova a contenere il repository. Insegna all'agente come attraversarlo.**