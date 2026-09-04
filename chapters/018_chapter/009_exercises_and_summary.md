# 18.9 — Esercizi, autovalutazione e sintesi

Il refactoring nell'era dell'AI non è diventato meno importante.

È diventato più facile produrre trasformazioni abbastanza ampie da superare la nostra capacità di comprenderle riga per riga.

Per questo la disciplina si sposta da:

```text
scrivere ogni cambiamento
```

verso:

```text
intent
→ bounded change
→ evidence
→ stop / fallback
→ next step
```

La capacità di execution cresce. Il blast radius non deve crescere insieme a lei.

Il principio del capitolo è quindi:

> **ogni passo della trasformazione deve produrre abbastanza evidence da meritare il passo successivo.**

## Che cosa abbiamo imparato

Un diff grande non è automaticamente più rischioso di uno piccolo. Conta la semantic surface, ciò che può rompersi, quanto il cambiamento è reversibile e quale evidence possediamo.

Small batch non significa spezzare artificialmente il lavoro. Significa costruire unità di cambiamento con scopo, proprietà verificabile e fallback comprensibili.

Branch by Abstraction crea il punto di scelta; una feature flag può governarne il routing. Lo shadow comparison permette di osservare un candidate prima di trasferirgli authority, ma soltanto se il path ombra non produce side effect incontrollati.

Zero mismatch non è sempre l'obiettivo. Quando una differenza è stata deliberatamente approvata prima del rollout, quella differenza deve emergere. È per questo che ESI usa `ED-001` e distingue `Match`, `ExpectedDifference` e `UnexpectedDifference`.

Quando entra stato persistente, il problema cambia ancora: artifact rollback, behavior fallback e data rollback sono capability diverse. Una migration può diventare una one-way door molto prima che il codice sembri irreversibile.

Infine, l'AI rende economici refactoring repository-wide, codemod, adapter e test. Questo aumenta il valore di transformation contract, characterization evidence, Safety Plan, stop condition e cleanup. Un build verde non basta a evitare la **Generated Refactoring Illusion**.

## Artefatto operativo — Refactoring Safety Plan

Il nuovo artefatto collega il change alla sua safety envelope.

Deve rendere visibili almeno:

```text
goal
scope
out of scope
behavior classification
invariants
preconditions
phases
evidence per phase
stop conditions
stop authority
fallback / rollback
point of no return
owners
temporary architecture cleanup
```

Per ESI vive in:

```text
capstone/example-software-industries/products/order-operations/docs/refactoring-safety-plan.md
```

Il piano non certifica il change. Dichiara quale evidence deve esistere prima di aumentarne il blast radius.

## Esercizio 1 — Spezzare un big bang

Issue:

```text
Replace the legacy notification subsystem with the new service.
```

Proponi almeno sei batch intermedi.

Per ciascuno indica:

```text
purpose
claim
verification
fallback / rollback
blast radius
```

Elimina ogni batch che non lascia il sistema in uno stato valido o che non produce una nuova evidence utile.

## Esercizio 2 — Rollback non è una parola sola

Per una migration di datastore descrivi separatamente:

```text
deployment rollback
behavior fallback
configuration rollback
data rollback
contract rollback
```

Spiega quali sono realmente disponibili e quale one-way door li rende più difficili o impossibili.

## Esercizio 3 — Disegnare un seam

Prendi una capability legacy che dipende direttamente da database, configuration globale, clock e provider esterno.

Disegna un boundary che permetta di sostituire una sola responsabilità.

Indica:

- quale contratto vedono i caller;
- quali dettagli legacy restano nell'adapter;
- quali side effect rimangono fuori dal candidate;
- come effettueresti il fallback.

## Esercizio 4 — Shadow senza doppio effetto

Hai un nuovo algoritmo di fraud scoring.

Vuoi confrontarlo con il vecchio prima di renderlo authoritative.

Progetta uno shadow mode che non produca doppio blocco, doppio evento, doppia write o doppia chiamata con effetto economico.

Definisci poi un comparison event minimo e una stop condition.

## Esercizio 5 — Expected Difference Registry

Costruisci tre casi:

```text
mismatch inatteso
mismatch intenzionale approvato prima del rollout
mismatch dichiarato "intenzionale" soltanto dopo essere apparso
```

Spiega quale può proseguire, quale deve fermare il rollout e perché l'approvazione temporale è parte dell'evidence.

## Esercizio 6 — Transformation Contract per un agente

Richiesta iniziale:

```text
Upgrade all call sites from ClientV1 to ClientV2.
```

Scrivi un contratto con:

```text
goal
allowed scope
must preserve
intentional changes
forbidden changes
verification
stop condition
expected Verification Bundle
```

Poi confrontalo con il prompt originale e identifica quante decisioni prima erano implicite.

## Esercizio 7 — Meccanico o semantico?

Classifica queste trasformazioni:

- rename di un metodo;
- namespace migration;
- conversione config XML→JSON;
- sostituzione auth library;
- spostamento di una business rule;
- eliminazione di un fallback legacy;
- conversione di una query ORM;
- cambio della retry policy.

Per ciascuna scegli il fit fra:

```text
language tooling
search/replace
AST codemod
recipe engine
agent + deterministic verification
human/domain decision
```

Giustifica la scelta in base alla semantic surface, non alla moda dello strumento.

## Esercizio 8 — Data point of no return

Disegna una migration:

```text
old_customer_id
→
new_global_identity
```

Identifica:

```text
last fully reversible checkpoint
authoritative source per phase
reconciliation evidence
consumers to migrate
irreversible operation
recovery source
```

Poi spiega perché il rollback dell'applicazione potrebbe non essere più sufficiente.

## Esercizio 9 — Characterization e target possono divergere correttamente

Usa Operations Desk Classic.

Spiega perché la legacy suite deve continuare a verificare:

```text
Enterprise + age >= 30m
→ Urgent
```

mentre la target suite deve verificare che la stessa regola **non** esista più.

Quale artefatto rende questa apparente contraddizione una differenza deliberata invece di una regressione?

## Esercizio 10 — Cleanup come Definition of Done

Per una migration flag definisci la chiusura completa:

```text
candidate stable
legacy path unused
fallback window closed intentionally
flag removed
adapter removed
dead code removed
obsolete tests removed
migration-only telemetry removed
docs updated
```

Se una parte non può ancora essere eliminata, indica quale dependency o evidence manca.

## Autovalutazione

Dovresti saper spiegare senza rileggere il capitolo perché il rischio non sia proporzionale alle linee cambiate; che cosa renda un batch davvero piccolo; la differenza fra Branch by Abstraction e feature flag; quando lo shadow mode sia pericoloso; perché zero mismatch non sia sempre corretto; che cosa renda una Expected Difference realmente attesa; la differenza fra deployment rollback e behavior fallback; perché i dati introducano one-way door; quando il dual write richieda reconciliation; quando preferire codemod/recipe a un agente; che cosa sia la Generated Refactoring Illusion; quali elementi abbia un transformation contract; a che cosa serva il Refactoring Safety Plan; perché una stop condition richieda una stop authority; e perché il cleanup faccia parte della migrazione.

Se una risposta resta vaga, riscrivila nella forma:

```text
intent
→ preserved / changed semantics
→ evidence
→ stop / fallback
```

## Cosa cambia con l'AI

Prima dell'AI il costo di modificare centinaia di file rappresentava un freno naturale, anche se accidentale.

Quel freno diminuisce.

Possiamo produrre rapidamente massive rename, framework upgrade, adapter, migration script, test e documentazione.

La nuova scarsità diventa:

```text
semantic specification
scope discipline
strong verification
rollback design
stop authority
cleanup
```

Per questo l'AI non rende meno necessario il refactoring disciplinato.

Rende più conveniente essere rigorosi: possiamo usare la velocità per creare seam, adapter e checkpoint invece di comprare un mega-diff indivisibile.

## Stato ESI dopo il Capitolo 18

Il capstone può affermare localmente:

```text
legacy characterization      Verified locally
PriorityPolicy seam          Codified + Verified locally
LegacyPriorityAdapter        Codified + Verified locally
ConfirmedPriorityPolicy      Codified + Verified locally
shadow comparison            Codified + Verified locally
ED-001                       documented / encoded
production shadow rollout    Designed / Not executed
candidate cutover            Designed / Not authorized
legacy retirement            Not started
```

Non abbiamo migrato persistence, eliminato consumer o simulato rollout production inesistenti.

È una fotografia intenzionalmente incompleta e quindi credibile.

## Casi reali: trasformare senza big bang

AWS documenta Branch by Abstraction come tecnica per far convivere implementazioni durante una modernizzazione, mentre Microsoft descrive lo Strangler Fig come sostituzione incrementale per ridurre il rischio del cutover sistemico.

Fonti:

- [AWS Prescriptive Guidance — Branch by abstraction](https://docs.aws.amazon.com/prescriptive-guidance/latest/modernization-decomposing-monoliths/branch-by-abstraction.html)
- [Microsoft Learn — Strangler Fig pattern](https://learn.microsoft.com/azure/architecture/patterns/strangler-fig)

GitHub ha documentato feature flag, rollout progressivi e migrazioni dati in più fasi, inclusa la rimozione finale dei vecchi path.

Fonti:

- [GitHub Engineering — How we ship code faster and safer with feature flags](https://github.blog/engineering/infrastructure/ship-code-faster-safer-feature-flags/)
- [GitHub Engineering — Moving persistent data out of Redis](https://github.blog/engineering/infrastructure/moving-persistent-data-out-of-redis/)

Il principio comune è:

> **separare la trasformazione dal momento irreversibile in cui il nuovo path diventa l'unica verità rimasta.**

## Ponte al Capitolo 19 — Architecture Evolution

Il Capitolo 18 ci ha mostrato come governare una trasformazione intenzionale.

Ma un'architettura può degradarsi anche senza grandi refactoring o modernization program.

Può farlo una pull request alla volta: un import temporaneo, una dependency introdotta fuori boundary, una feature flag mai rimossa, un'eccezione di layering che diventa precedente.

Il Capitolo 19 cambia quindi prospettiva.

Non chiederà soltanto:

> Come cambiamo in sicurezza?

Chiederà:

> **Come facciamo a sapere, nel tempo, se il modo in cui continuiamo a cambiare sta ancora rispettando l'architettura che abbiamo deciso?**

Entreranno fitness function, architecture test, drift, decision expiry, exception governance e review trigger.

## Corollario

> **La trasformazione è governata quando ogni passo rende più forte l'evidence del passo successivo e non chiude una porta prima di avere deciso consapevolmente che non ci servirà più tornare indietro.**