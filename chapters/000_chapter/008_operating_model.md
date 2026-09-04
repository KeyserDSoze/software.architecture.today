## Un operating model per lavorare con gli agenti

Fin qui abbiamo parlato di principi. Per renderli utilizzabili serve un modello operativo semplice, non un framework da applicare meccanicamente a ogni task, ma un modo per ricordare quali domande diventano importanti quando deleghiamo lavoro tecnico a un sistema capace di agire.

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

La forma sequenziale è intenzionale: non descrive sette documenti da compilare, ma sette momenti di attenzione che possono essere molto leggeri nei task piccoli e diventare più espliciti quando il rischio cresce.

### 1. Intento

Prima di chiedere che cosa costruire, dobbiamo sapere quale risultato vogliamo ottenere. “Aggiungi Redis” è già una soluzione; “Riduci il carico di lettura sul database mantenendo la coerenza richiesta dal dominio” descrive invece un intento. Redis potrebbe diventare una buona risposta, ma separare il problema dalla tecnologia evita di trasformare l'agente in un esecutore di decisioni premature.

### 2. Contesto

L'agente deve conoscere abbastanza del sistema da non dover inventare ciò che conta. Il contesto può includere requisiti, architecture overview, ADR e contratti, insieme alle convenzioni del repository e ai non-functional requirements. Deve rendere visibili anche i vincoli di sicurezza, i comandi di test e build, gli esempi esistenti e i componenti che restano fuori scope.

Context engineering non significa riempire il prompt di testo. Significa rendere disponibile il **contesto giusto al momento giusto**.

### 3. Delega

Una buona delega rende visibili l'obiettivo, il contesto, il comportamento atteso e i vincoli, ma anche acceptance criteria, dipendenze, edge case, test, out of scope, stop condition e definition of done. Qui manteniamo una rappresentazione strutturata perché diventerà più avanti un vero artefatto riutilizzabile:

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

Questa struttura diventerà il nostro **Agent Delegation Contract**. Non tutte le issue avranno bisogno di ogni campo: l'artefatto serve come vocabolario di rischi, non come formulario burocratico.

### 4. Osservazione

Delegare non significa sparire fino alla fine, ma nemmeno interrompere l'agente a ogni passo. Dobbiamo scegliere i checkpoint nei punti in cui una decisione sbagliata diventerebbe costosa.

Per un task piccolo potrebbe bastare il risultato finale. Per un refactoring ampio potremmo invece voler osservare il piano, il primo slice, i test e la migrazione restante prima della review finale:

```text
piano
→ primo slice
→ test
→ migrazione restante
→ review finale
```

Per una modifica rischiosa potremmo richiedere escalation prima ancora dell'execution. L'osservazione non deve seguire ogni gesto: deve presidiare i punti di irreversibilità o di forte propagazione.

### 5. Verifica

La verifica, quando possibile, va progettata prima. Se sappiamo che una proprietà è critica, trasformiamola in un controllo. Per esempio, il requisito “un utente non deve mai leggere ordini di un altro tenant” può diventare un integration test con due tenant e identità differenti. Questo è più forte di chiedere a posteriori “Sei sicuro che il tenant isolation sia corretto?”.

La differenza è importante: nella prima forma abbiamo una proprietà osservabile, nella seconda una rassicurazione.

### 6. Escalation

Quando una stop condition viene raggiunta, l'agente non dovrebbe improvvisare. Dovrebbe rendere la decisione visibile. Una buona escalation descrive il blocco e perché conta, esplicita le informazioni mancanti, porta alternative plausibili e il loro impatto e può includere una raccomandazione, purché resti chiaramente distinta dalla decisione finale.

L'obiettivo è trasformare l'incertezza in una decisione gestibile, non semplicemente spostare il problema su un essere umano senza contesto.

### 7. Decisione

Alla fine serve qualcuno — una persona o una policy esplicita — che autorizzi il passaggio successivo perché l'evidenza disponibile è ritenuta sufficiente, oppure lo blocchi perché il rischio non è ancora sotto controllo. Questa responsabilità non deve essere nascosta dentro una pipeline.

Possiamo automatizzare moltissimo, ma dobbiamo sempre sapere quale policy, quale gate o quale persona abbia autorizzato il passaggio successivo.

### L'Agent Delegation Contract

Da questo capitolo ricaviamo il primo artefatto operativo del libro. Qui la struttura è volutamente esplicita perché deve poter essere copiata e adattata:

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

Non lo compileremo per correggere un typo. Può invece diventare utile per un refactoring repository-wide o una migration, per una nuova integrazione o una modifica cross-service, per un task affidato a più agenti e, in generale, quando entrano security implications o un livello di autonomia elevato.

### L'Agent Verification Bundle

Il secondo artefatto nasce dalla fase di verifica. Anche qui manteniamo la struttura perché descrive il contenuto di una consegna, non una semplice enumerazione narrativa:

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

Non è una checklist universale: serve quando il rischio giustifica il costo.

### Dalla chat al sistema di lavoro

Molte persone iniziano a usare l'AI come una conversazione individuale:

```text
io ↔ modello
```

Poi aggiungono strumenti e il modello diventa un agente che interagisce con il repository:

```text
io ↔ agente ↔ repository
```

Infine possono comparire più agenti coordinati:

```text
          ↗ agent A
io → orchestrazione → agent B
          ↘ agent C
```

A quel punto il problema non è più scrivere il prompt migliore. Il problema è progettare un **sistema di lavoro**. Dobbiamo capire chi possiede il contesto e chi decide il piano, quali strumenti siano disponibili e quali modifiche richiedano review. Dobbiamo sapere come viene verificato il risultato, come impedire che agenti diversi prendano decisioni architetturali incompatibili e come mantenere la memoria del perché una scelta sia stata fatta.

Sono domande di architettura applicate al processo di costruzione del software, ed è per questo che il libro inizia da qui.

### Il principio del capitolo

Tutto il Capitolo 0 può essere ridotto a una frase:

> **Delega la produzione quanto vuoi. Non delegare inconsapevolmente il diritto di capire, verificare e decidere.**

Nei prossimi capitoli sposteremo il focus dal modo in cui costruiamo al modo in cui pensiamo il sistema prima di costruirlo. Un agente molto veloce con un problema definito male non risolve il problema: lo implementa.
