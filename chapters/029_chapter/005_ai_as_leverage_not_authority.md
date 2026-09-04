# AI come leverage, non come authority

Nel corso del libro l'AI ha ricoperto due ruoli molto diversi.

Prima ha lavorato **sul software**:

```text
ricerca
analisi candidate
coding
refactoring
testing
review
documentazione
orchestrazione
```

Poi è entrata **dentro il software**:

```text
Case Explanation Assistant
→ runtime dependency
→ model boundary
→ authorized context
→ structured output
→ evaluation
```

Questa distinzione è importante perché i failure mode cambiano.

Ma esiste un principio comune a entrambi i casi:

> **capability non significa authority.**

Un agente può essere capace di modificare uno schema.

Non significa che sia autorizzato a cambiare data ownership.

Un modello può essere capace di produrre una spiegazione convincente di un pagamento.

Non significa che possieda la verità sul PaymentStatus.

Un coding agent può essere capace di modificare il test che sta fallendo.

Non significa che sia autorizzato a cambiare l'oracolo per far diventare verde il proprio lavoro.

---

## Delegare execution

Il principio iniziale era:

> **Delegare execution, non responsabilità.**

Dopo tutto il percorso possiamo renderlo più operativo.

Delegare bene significa specificare almeno:

```text
Goal
Scope
Out of scope
Context
Allowed actions
Forbidden actions
Verification
Stop conditions
Escalation path
```

Non serve necessariamente un documento formale per ogni task.

Ma queste dimensioni devono essere comprensibili da chi esegue il lavoro.

Persona o agente.

Il problema non è che un agente faccia troppo.

Il problema è che faccia qualcosa che **richiedeva una decisione nuova senza rendere visibile che quella decisione esisteva**.

---

## L'agente non deve inventare il dominio

Abbiamo incontrato questo rischio più volte.

Una issue dice:

```text
add refund endpoint
```

L'agente può facilmente generare:

- route;
- DTO;
- service;
- repository;
- test;
- UI;
- telemetry.

Ma potrebbe dover inventare:

```text
chi può fare refund
quali stati lo permettono
quale importo è rimborsabile
come evitare doppio refund
quale audit conservare
quale owner decide il side effect economico
```

A quel punto non sta più implementando.

Sta facendo analisi funzionale e prendendo decisioni di dominio senza authorization.

La stop condition corretta è fermarsi.

> **L'agente autonomo migliore non è quello che non si ferma mai. È quello che sa distinguere un ostacolo esecutivo da una nuova decisione.**

---

## Manager di agenti

Quando abbiamo introdotto più agenti, abbiamo evitato il mito dello swarm.

Più agenti non significano automaticamente più throughput utile.

Abbiamo distinto responsabilità:

```text
Planner
Implementer
Verifier
Specialist Reviewer
Human Decision Owner
```

ma abbiamo anche chiarito che non devono necessariamente corrispondere a cinque processi separati.

Separare un ruolo ha valore quando compra almeno una proprietà:

```text
context separation
permission separation
independent evidence
specialist depth
reduced collision domain
```

Se non compra nulla, abbiamo aggiunto orchestration cost.

Questo vale anche per l'architect.

Il suo lavoro non è moltiplicare agenti.

È progettare un workflow in cui l'execution può aumentare **senza moltiplicare decisioni incoerenti**.

---

## Prima sincronizzare il pensiero

Una delle frasi ricorrenti del libro era:

> **Prima sincronizzare il pensiero. Poi parallelizzare l'esecuzione.**

Ora possiamo vederne la ragione.

Supponiamo che cinque agenti debbano lavorare su:

```text
API
schema
event contract
consumer
observability
```

Se tutti dipendono da una decisione ancora aperta su data ownership, non abbiamo cinque task indipendenti.

Abbiamo cinque modi diversi di cristallizzare la stessa ambiguità.

Il parallelismo utile richiede che il collision domain decisionale sia sufficientemente piccolo.

Quando non lo è, il primo task è spesso una decisione o una discovery.

Non una implementazione.

---

## AI dentro il prodotto

Quando l'AI diventa una dependency runtime, la regola capability/authority diventa ancora più importante.

Nel Case Explanation Assistant abbiamo separato:

```text
confirmedFacts
hypotheses
missingEvidence
sourceReferences
```

Il modello poteva aiutare l'operatore a costruire una spiegazione.

Non poteva decidere:

```text
PaymentStatus
Priority
refund
remediation
tenant authorization
```

Questa separazione non nasce da una sfiducia filosofica verso i modelli.

Nasce da architecture.

Se una componente non è l'owner di una decisione, non dovrebbe ricevere quell'authority soltanto perché riesce a produrre una risposta linguisticamente convincente.

---

## Grounding non è autorità

Abbiamo anche distinto:

> **Grounding è un requisito. RAG è una possibile soluzione.**

E possiamo aggiungere:

> **Grounding migliora il contesto. Non trasferisce automaticamente l'autorità della fonte al modello.**

Un modello può ricevere dati corretti e interpretarli male.

Può ricevere una nota malevola e seguirne le istruzioni.

Può produrre structured output valido ma semanticamente sbagliato.

Per questo servono ancora:

```text
authorization before retrieval
source boundary
output validation
tool least privilege
eval
fallback
runtime observability
```

L'AI non elimina architecture.

Aggiunge un nuovo tipo di componente con proprietà probabilistiche e failure mode propri.

---

## Context engineering

Con i coding agent abbiamo imparato che il repository stesso deve diventare parte del sistema di contesto.

`AGENTS.md`, Repository Map, ADR, contract e fitness function non esistono per alimentare un modello con più token.

Esistono per rendere:

```text
knowledge discoverable
policy visible
verification executable
unknown explicit
```

Il contesto migliore non è necessariamente il più grande.

È quello che permette di trovare la fonte giusta senza confondere copie stale, instruction e authority.

Per questo abbiamo scritto:

> **Un buon file di istruzioni non prova a contenere il repository. Insegna all'agente come attraversarlo.**

---

## AI amplifica il sistema che trova

Un repository con confini chiari, test affidabili, decisioni esplicite e documentazione canonical diventa più facile da usare anche per un agente.

Un repository ambiguo insegna invece all'agente la propria ambiguità.

Se il codice contiene una violazione architetturale, l'agente può copiarla.

La seconda copia diventa un precedente.

La terza sembra una convention.

Poi la documentazione generata può descriverla come design intenzionale.

È il motivo per cui abbiamo parlato di:

> **documentation laundering**

L'AI amplifica sia la buona context engineering sia il drift.

La risposta non è aggiungere prompt sempre più lunghi.

È migliorare il sistema che produce contesto ed evidence.

---

## Autonomia come decisione di rischio

Abbiamo introdotto livelli A0–A4 in ESI, ma abbiamo insistito che non sono livelli di intelligenza.

Sono livelli di **rischio governabile**.

Un'azione può essere concessa con maggiore autonomia quando:

```text
scope è chiaro
failure è bounded
rollback è praticabile
evidence è disponibile
permission è limitata
escalation path esiste
```

Non quando il modello “sembra bravo”.

Questa distinzione è destinata a diventare sempre più importante.

I modelli miglioreranno.

Le capability cresceranno.

La domanda organizzativa resterà:

> **quanto potere siamo disposti a concedere, su quale boundary e con quale evidence?**

---

## Il leverage sano

La promessa più interessante dell'AI non è eliminare il professionista.

È permettergli di spostare tempo da execution ripetitiva verso:

```text
problem framing
functional understanding
system discovery
trade-off
review
evidence
learning
```

Questo accade soltanto se il tempo liberato viene usato per queste attività.

Se invece usiamo l'AI soltanto per aumentare il volume di output, possiamo ottenere un'organizzazione che produce più software di quanto riesca a capire.

Il leverage sano è un'altra cosa.

> **Più execution delegata, con responsabilità ancora leggibile.**