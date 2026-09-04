# 17.9 — Esercizi, autovalutazione e sintesi

Il Capitolo 17 non ha risolto il legacy.

Ha fatto qualcosa di più importante prima di qualsiasi trasformazione: ha ridotto l'incertezza abbastanza da rendere possibile una decisione successiva più sicura.

La tesi può essere riassunta così:

```text
legacy uncertainty
→ evidence collection
→ Found / Inferred / Observed / Confirmed
→ behavior classification
→ candidate seam
→ safe next decision
```

Legacy non significa semplicemente software vecchio. Significa che il sistema non è più comprensibile e verificabile in misura sufficiente rispetto al rischio del change che vogliamo fare.

Per questo la modernization non parte dal target tecnologico. Parte da inventory, journey, data, runtime, Operations e owner.

Il repository è una fonte importante, ma non coincide con il sistema. Una dependency può essere una shared table, un job che deve finire prima di un altro, un file, una feature flag, un certificato o una procedura umana durante gli incidenti.

Una characterization suite può rendere questi behavior osservabili. Non può trasformarli automaticamente in requisiti. Un seam può rendere sostituibile una capability. Non può dirci da solo quale semantica debba sopravvivere.

E l'AI può accelerare enormemente inventory, test e mappe. Non può eliminare la necessità di distinguere evidence, inferenza e decisione.

## Artefatto operativo — Legacy Understanding Map

L'artefatto del capitolo serve a governare la slice corrente, non a descrivere tutto il passato dell'applicazione.

Una versione minima può contenere:

```markdown
# Legacy Understanding Map

## System / capability

## Business outcome

## Entry points

## Current behavior

## State / data ownership

## Dependencies

## Scheduled / temporal coupling

## Consumers

## Operational procedures

## Security / identity

## Evidence ledger

| Claim | Evidence | State | Owner | Missing evidence |
|---|---|---|---|---|

## Characterized behaviors

| Behavior | Evidence | Classification | Status |
|---|---|---|---|

## Unknowns

## Candidate seams

## Migration risks

## Rollback constraints

## Decision blockers
```

Il valore dell'artefatto non è la quantità di righe.

È la possibilità di rispondere a domande come:

```text
che cosa sappiamo davvero?
quale behavior è soltanto Observed?
quale consumer è ancora Inferred?
chi può confermare la semantica?
quale unknown blocca il cutover?
```

## Esercizio 1 — Legacy senza età

Prendi un sistema recente e cerca segnali legacy-like:

```text
ownership non chiara
business rule senza provenance
dipendenza fuori repository
test poco affidabili
configuration manuale
workaround umano
deploy non ripetibile
```

Poi chiedi:

> Il problema è davvero l'età del codice o la perdita di comprensione e verificabilità?

## Esercizio 2 — Journey archaeology

Scegli una capability reale e ricostruiscila partendo dall'azione o evento iniziale:

```text
entry point
→ decision points
→ persistence
→ side effects
→ consumers
→ recovery
```

Per ogni passaggio indica la fonte dell'evidence.

Non fermarti alla call graph.

## Esercizio 3 — Found, Inferred, Observed, Confirmed

Scrivi dieci claim sul sistema e classificane ciascuna.

Per ogni `Inferred`, indica che cosa servirebbe per arrivare a `Observed`.

Per ogni `Observed`, indica chi o quale decisione potrebbe trasformarla in `Confirmed`.

L'obiettivo è rendere visibile quanto della tua “conoscenza” sia in realtà inferenza.

## Esercizio 4 — Hidden dependency hunt

Cerca dependency che il compilatore non vede:

```text
table
cron / scheduler
file format
environment variable
DNS
certificate
feature flag
shared cache key
manual process
```

Per ognuna stima blast radius, owner ed evidence corrente.

## Esercizio 5 — Characterization prima del refactor

Scegli una funzione legacy poco chiara e costruisci almeno cinque casi:

```text
normal behavior
boundary value
legacy special case
invalid input
time-dependent behavior
```

Non correggere ancora ciò che ti sembra strano.

Registra soltanto ciò che osservi.

## Esercizio 6 — Classificare i behavior

Per ogni comportamento caratterizzato prova a scegliere:

```text
Required
Compatibility
Accidental
Unknown
```

Poi scrivi l'evidence che giustifica la classificazione.

Se non esiste, torna a `Unknown`.

## Esercizio 7 — Golden master senza snapshot theater

Prendi un golden master o snapshot esistente.

Classifica ogni campo come:

```text
semantic outcome
compatibility surface
implementation detail
nondeterministic noise
privacy/security risk
```

Riduci il baseline a ciò che un consumer può davvero distinguere.

## Esercizio 8 — Creare un seam

Scegli una capability con molti caller e disegna un punto di scelta fra:

```text
legacy implementation
candidate implementation
```

Specifica:

```text
contract
state dependencies
side effects
routing control
rollback
removal condition
```

Se il seam non racchiude ciò che determina la semantica, probabilmente è soltanto un'interfaccia sintattica.

## Esercizio 9 — Strangler slice

Progetta una modernization slice e scrivi:

```text
why now
capability boundary
users / consumers
data authority
coexistence
verification
cutover
rollback
legacy removal condition
```

Se non sai quando il path vecchio può essere eliminato, il piano non ha ancora definito il proprio completamento.

## Esercizio 10 — AI archaeology con provenance

Chiedi a un agente di mappare una capability legacy imponendo il formato:

```text
Claim
Evidence
State
Alternative explanation
Missing evidence
```

Poi fai revisionare l'output da un secondo agente con ruolo scettico.

Conta quante claim iniziali erano formulate con più certezza di quella sostenuta dall'evidence.

## Esercizio 11 — Documentation laundering

Prendi una pagina architetturale esistente.

Per ogni affermazione chiedi:

```text
è una decisione?
è Found?
è Inferred?
è Observed?
è Confirmed?
chi la mantiene?
quando è stata verificata?
```

Evidenzia le frasi che sembrano autorevoli ma non conservano provenance.

## Esercizio 12 — Operations come architecture source

Intervista una persona on-call o Operations e chiedi:

> Qual è una cosa che fai durante un incidente che non è rappresentata nel codice?

Trasforma la risposta in uno fra:

- failure mode;
- runbook step;
- requirement;
- missing automation;
- modernization blocker.

## Esercizio 13 — Data ownership transition

Disegna la migrazione di una tabella condivisa e rispondi:

```text
old writer?
new writer?
readers?
backfill?
dual-write window?
reconciliation?
cutover point?
rollback?
old writer retirement?
```

Se vecchio e nuovo possono essere authoritative contemporaneamente senza una regola, hai trovato il rischio principale.

## Esercizio 14 — Rewrite challenge

Prendi una proposta di rewrite e separa:

```text
code complexity removed
```

da:

```text
business / integration / data / operational complexity still required
```

Poi chiedi:

> La rewrite elimina davvero la complessità o elimina soltanto il codice che la rendeva visibile?

## Esercizio 15 — ESI Operations Desk Classic

Usa la baseline del Capitolo 17.

Per ogni `LB-*`:

1. proponi una nuova fonte di evidence;
2. identifica un possibile owner della semantica;
3. assegna una classificazione provvisoria;
4. descrivi il rischio di eliminarlo per errore;
5. indica che cosa impedisce ancora di chiamarlo `Confirmed`.

Non progettare la target policy.

L'obiettivo è resistere alla tentazione di trasformare la discovery in design troppo presto.

## Autovalutazione

Dovresti riuscire a spiegare senza consultare il capitolo perché legacy non significhi semplicemente vecchio; la differenza fra repository intelligence e system intelligence; ciò che separa `Inferred`, `Observed` e `Confirmed`; perché un characterization test non dimostri correttezza; quando un golden master diventi rumore; che cosa renda un seam veramente utile; quando Branch by Abstraction abbia senso; quale ruolo abbia un Anti-Corruption Layer; perché un shared database complichi la modernization; come una big-bang rewrite possa perdere conoscenza; che cosa sia il documentation laundering; perché Operations sia una fonte di architecture knowledge; quali task siano adatti agli agenti AI; quali one-way door richiedano human judgment; e come si misuri davvero il progresso di una modernization.

Se una risposta resta vaga, prova a riscriverla così:

```text
claim
→ evidence
→ state
→ missing evidence
```

Questa forma spesso rivela immediatamente dove la comprensione non è ancora sufficiente.

## Cosa cambia con l'AI

Prima dell'AI il costo di esplorare una codebase grande limitava quante ipotesi potevamo formulare e verificare.

Ora possiamo produrre rapidamente inventory, dependency map, characterization candidate, seam hypothesis e modernization plan.

La nuova scarsità è:

```text
provenance
runtime evidence
domain confirmation
risk judgment
safe stop conditions
```

Il rischio non è avere poche spiegazioni.

È avere troppe spiegazioni plausibili e nessun modo chiaro per sapere quali siano vere.

Per questo le domande più importanti diventano:

```text
Da dove lo sappiamo?
Che cosa potrebbe smentirlo?
È repository evidence o runtime behavior?
Chi può confermare il significato?
Quale decisione diventerebbe pericolosa se questa claim fosse falsa?
```

## Stato ESI dopo il Capitolo 17

Operations Desk Classic non è stato ancora refactorizzato o modernizzato.

Abbiamo però:

```text
capability scope
legacy inventory
characterization baseline
Evidence Ledger
hidden-consumer hypotheses
data-ownership unknowns
candidate seam
decision blockers
```

Questo è sufficiente per affrontare il passo successivo senza fingere di conoscere più di quanto sappiamo.

## Ponte al Capitolo 18 — Refactoring nell'era dell'AI

Il Capitolo 18 cambierà domanda.

Non più:

> Che cosa fa il sistema?

Ma:

> **Come cambiamo la struttura mantenendo sotto controllo i behavior che abbiamo deciso di preservare e rendendo deliberate le differenze che vogliamo introdurre?**

Entreranno Refactoring Safety Plan, small batch, semantic diff, Branch by Abstraction applicato, adapter/ACL, shadow comparison, Expected Difference, stop condition e rollback.

La baseline del Capitolo 17 sarà ciò che impedirà al refactoring di riscrivere accidentalmente anche la semantica.

## Corollario

> **Il legacy non diventa sicuro quando abbiamo una spiegazione convincente. Diventa più governabile quando sappiamo quali parti della spiegazione sono osservate, quali sono confermate e quali restano ancora abbastanza incerte da dover bloccare il prossimo one-way door.**