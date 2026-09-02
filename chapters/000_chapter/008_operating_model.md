## Un operating model per lavorare con gli agenti

Fin qui abbiamo parlato di principi.

Per renderli utilizzabili serve un modello operativo semplice.

Non un framework da applicare a ogni task.

Un modo per ricordare quali domande diventano importanti quando deleghiamo lavoro tecnico a un sistema capace di agire.

Possiamo condensarlo in sette passaggi:

```text
Intento
→ Contesto
→ Delega
→ Osservazione
→ Verifica
→ Escalation
→ Decisione
```

### 1. Intento

Prima di chiedere cosa costruire, dobbiamo sapere quale risultato vogliamo ottenere.

Non:

> “Aggiungi Redis.”

Ma:

> “Riduci il carico di lettura sul database mantenendo la coerenza richiesta dal dominio.”

Redis potrebbe essere una soluzione.

L'intento è il problema da risolvere.

Separare i due evita di trasformare l'agente in un esecutore di decisioni premature.

### 2. Contesto

L'agente deve conoscere abbastanza del sistema da non dover inventare ciò che conta.

Il contesto può includere:

- requisiti;
- architecture overview;
- ADR;
- contratti;
- convenzioni del repository;
- non-functional requirements;
- vincoli di sicurezza;
- comandi di test e build;
- esempi esistenti;
- componenti fuori scope.

Context engineering non significa riempire il prompt di testo.

Significa rendere disponibile il **contesto giusto al momento giusto**.

### 3. Delega

Una buona delega rende espliciti:

```text
Objective
Context
Expected behavior
Constraints
Acceptance criteria
Dependencies
Edge cases
Tests expected
Out of scope
Stop conditions
Definition of done
```

Questa struttura diventerà più avanti il nostro **Agent Delegation Contract**.

Non tutte le issue avranno bisogno di ogni campo.

L'artefatto serve come vocabolario di rischi, non come formulario burocratico.

### 4. Osservazione

Delegare non significa sparire fino alla fine.

Ma nemmeno interrompere l'agente a ogni passo.

Dobbiamo scegliere i checkpoint.

Per un task piccolo potrebbe bastare il risultato finale.

Per un refactoring ampio potremmo voler vedere:

```text
piano
→ primo slice
→ test
→ migrazione restante
→ review finale
```

Per una modifica rischiosa potremmo richiedere escalation prima ancora dell'execution.

L'osservazione deve concentrarsi sui punti in cui una decisione sbagliata diventa costosa.

### 5. Verifica

La verifica deve essere progettata prima, quando possibile.

Se sappiamo che una proprietà è critica, trasformiamola in un controllo.

Esempio:

```text
Requisito:
un utente non deve mai leggere ordini di un altro tenant.

Verifica:
integration test con due tenant e identità differenti.
```

Questo è più forte di chiedere dopo:

> “Sei sicuro che il tenant isolation sia corretto?”

### 6. Escalation

Quando una stop condition viene raggiunta, l'agente non dovrebbe improvvisare.

Dovrebbe rendere la decisione visibile.

Una buona escalation contiene:

- il blocco;
- perché conta;
- quali informazioni mancano;
- alternative plausibili;
- impatto delle alternative;
- eventuale raccomandazione, chiaramente distinta dalla decisione finale.

L'obiettivo è trasformare l'incertezza in una decisione gestibile.

### 7. Decisione

Alla fine serve qualcuno che dica:

> “Sì, questa evidenza è sufficiente per procedere.”

Oppure:

> “No, il rischio non è ancora sotto controllo.”

Questa responsabilità non deve essere nascosta dentro una pipeline.

Possiamo automatizzare moltissimo.

Ma dobbiamo sempre sapere quale policy, quale gate o quale persona ha autorizzato il passaggio successivo.

### L'Agent Delegation Contract

Da questo capitolo ricaviamo il primo artefatto operativo del libro.

```markdown
# Agent Delegation Contract

## Objective
Quale risultato vogliamo ottenere?

## Context
Quali informazioni del sistema sono necessarie?

## Scope
Che cosa può essere modificato?

## Out of scope
Che cosa non deve essere modificato?

## Constraints
Quali vincoli non possono essere violati?

## Acceptance criteria
Come sapremo che il task è corretto?

## Verification
Quali controlli devono essere eseguiti?

## Stop conditions
Quando l'agente deve fermarsi ed escalare?

## Permissions
Quali strumenti e risorse può usare?

## Definition of done
Quali artefatti devono essere consegnati?
```

Non lo compileremo per correggere un typo.

Potrebbe invece essere molto utile per:

- un refactoring repository-wide;
- una migration;
- una nuova integrazione;
- una modifica cross-service;
- un task affidato a più agenti;
- una modifica con security implications;
- una change che verrà eseguita con autonomia elevata.

### L'Agent Verification Bundle

Il secondo artefatto nasce dalla fase di verifica.

Un possibile bundle è:

```text
Agent Verification Bundle
├── summary
├── diff
├── assumptions
├── tests-and-checks
├── known-risks
├── unresolved-questions
└── rollback-or-recovery
```

Ancora una volta: non è una checklist universale.

Serve quando il rischio giustifica il costo.

### Dalla chat al sistema di lavoro

Questo passaggio è importante.

Molte persone iniziano a usare l'AI come una conversazione individuale:

```text
io ↔ modello
```

Poi aggiungono strumenti:

```text
io ↔ agente ↔ repository
```

Poi più agenti:

```text
          ↗ agent A
io → orchestrazione → agent B
          ↘ agent C
```

A quel punto il problema non è più scrivere il prompt migliore.

Il problema è progettare un **sistema di lavoro**.

Chi possiede il contesto?

Chi decide il piano?

Quali strumenti sono disponibili?

Quali modifiche richiedono review?

Come viene verificato il risultato?

Come si evita che agenti diversi prendano decisioni architetturali incompatibili?

Come viene mantenuta la memoria del perché?

Sono domande di architettura applicate al processo di costruzione del software.

E non è un caso che questo libro inizi da qui.

### Il principio del capitolo

Tutto il Capitolo 0 può essere ridotto a una frase:

> **Delega la produzione quanto vuoi. Non delegare inconsapevolmente il diritto di capire, verificare e decidere.**

Nei prossimi capitoli sposteremo il focus dal modo in cui costruiamo al modo in cui pensiamo il sistema prima di costruirlo.

Perché un agente molto veloce con un problema definito male non risolve il problema.

Lo implementa.