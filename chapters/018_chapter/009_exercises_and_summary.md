# 18.9 — Esercizi, autovalutazione e sintesi

Il refactoring nell'era dell'AI non è diventato meno importante.

È diventato più facile produrre trasformazioni abbastanza grandi da superare la nostra capacità di comprenderle riga per riga.

Per questo la disciplina si sposta sempre di più da:

```text
scrivere ogni cambiamento
```

a:

```text
definire intent
limitare blast radius
costruire evidence
controllare rollout
mantenere accountability
```

## Idee chiave

1. **La velocità di trasformazione non riduce automaticamente il rischio della trasformazione.**
2. Il rischio dipende più da semantic surface, blast radius, reversibility ed evidence che dal numero di righe cambiate.
3. Small batch significa incremento comprensibile e verificabile, non commit minuscolo senza senso.
4. Branch by Abstraction introduce un seam; la feature flag può governare il routing. Non sono lo stesso pattern.
5. Shadow comparison può produrre evidence prima del cutover, ma soltanto se il candidate non genera side effect incontrollati.
6. Una differenza legacy/candidate può essere intenzionale, ma deve essere autorizzata prima del rollout.
7. Deployment rollback, behavior fallback e data rollback sono problemi differenti.
8. Quando entra stato persistente, la migration deve progettare compatibility, reconciliation e point of no return.
9. Dual write senza reconciliation può aumentare il rischio.
10. Automated refactoring, codemod e agenti hanno fit diversi a seconda di quanto la trasformazione è meccanica o semantica.
11. Build verde e test superficiali possono produrre una **Generated Refactoring Illusion**.
12. Gli agenti devono ricevere scope, invarianti, forbidden change, verification e stop condition.
13. Un refactoring significativo beneficia di un **Refactoring Safety Plan**.
14. Characterization test e target test rispondono a domande diverse.
15. Il cleanup di flag, adapter e comparison path è parte della migration, non lavoro facoltativo successivo.

## Esercizio 1 — Spezza il big bang

Hai una issue:

```text
Replace the legacy notification subsystem with the new service.
```

Proponi almeno sei batch intermedi.

Per ciascuno indica:

```text
purpose
evidence
rollback/fallback
blast radius
```

Poi elimina ogni batch che non lascia il sistema in uno stato valido.

## Esercizio 2 — I tre rollback

Per una migration di datastore descrivi separatamente:

- deployment rollback;
- behavior fallback;
- data rollback.

Spiega perché avere il primo non garantisce gli altri due.

## Esercizio 3 — Disegna un seam

Prendi una funzione legacy che dipende direttamente da:

- database;
- configuration globale;
- clock;
- provider esterno.

Disegna un seam che permetta di sostituire una sola responsabilità senza riscrivere il resto del sistema.

Indica quali dipendenze devono restare fuori dal nuovo domain model.

## Esercizio 4 — Shadow senza side effect

Hai un nuovo algoritmo di fraud scoring.

Vuoi confrontarlo con il vecchio.

Progetta uno shadow mode che non produca:

- doppio blocco dell'ordine;
- doppio evento;
- doppio write;
- modifica del decision path corrente.

Definisci anche le dimensioni minime del comparison event.

## Esercizio 5 — Expected Difference Registry

Costruisci tre esempi:

1. mismatch realmente inatteso;
2. mismatch intenzionale approvato;
3. mismatch che sembra intenzionale ma non ha owner/approval.

Spiega quale dei tre deve fermare il rollout.

## Esercizio 6 — AI transformation contract

Scrivi un Agent Delegation Contract per questa richiesta:

```text
Upgrade all call sites from ClientV1 to ClientV2.
```

Deve contenere:

```text
goal
scope
preserved behavior
forbidden changes
verification
stop condition
expected output
```

Poi confrontalo con il prompt originale di una riga.

## Esercizio 7 — Mechanical o semantic?

Classifica queste attività:

- rename di un metodo;
- migrazione di namespace;
- conversione di config XML in JSON;
- sostituzione di una libreria auth;
- spostamento di una business rule dal controller al dominio;
- eliminazione di un fallback legacy;
- conversione di una query ORM;
- cambio di retry policy.

Per ogni attività scegli fra:

```text
language tooling
codemod
recipe engine
agent
automazione + human semantic review
manual/domain decision
```

Non esiste una risposta unica: giustifica il fit.

## Esercizio 8 — Data point of no return

Disegna una migration:

```text
old_customer_id
→
new_global_identity
```

Individua:

- ultimo checkpoint completamente reversibile;
- dati necessari alla reconciliation;
- consumer da migrare;
- operazione irreversibile;
- recovery source.

## Esercizio 9 — Operations Desk Classic

Usa la classificazione ESI del capitolo.

Spiega perché sarebbe sbagliato scrivere un test target che richiede:

```text
Enterprise + age >= 30m → Urgent
```

anche se il characterization test legacy continua correttamente a proteggerlo.

## Esercizio 10 — Cleanup come acceptance criterion

Per una feature flag di migrazione definisci la `Definition of Done` completa.

Deve includere almeno:

- 100% rollout;
- stability window;
- old path unused;
- flag removal;
- dead code removal;
- obsolete test cleanup;
- migration-only telemetry cleanup;
- final documentation update.

## Autovalutazione

Dovresti saper rispondere senza rileggere il capitolo.

1. Perché un grande diff non è automaticamente più rischioso di uno piccolo?
2. Qual è la differenza fra Branch by Abstraction e feature flag?
3. Che cosa rende utile un seam?
4. Quando lo shadow mode può essere pericoloso?
5. Perché zero mismatch non è sempre l'obiettivo corretto?
6. Che cos'è un Expected Difference Registry?
7. Qual è la differenza fra deployment rollback e behavior fallback?
8. Perché una migration dati può trasformare una modifica reversibile in one-way door?
9. Quando è utile il dual write?
10. Perché richiede reconciliation?
11. Quando preferiresti una recipe/codemod deterministica a un agente LLM?
12. Che cos'è la Generated Refactoring Illusion?
13. Quali elementi minimi deve avere un Agent Transformation Contract?
14. Che cosa contiene un Refactoring Safety Plan?
15. Perché il cleanup fa parte del refactoring?

## Artefatto operativo

Il nuovo artefatto è:

> **Refactoring Safety Plan**

Deve rendere leggibili almeno:

```text
goal
scope
out of scope
behavior classification
invariants
preconditions
phases
evidence
stop conditions
fallback / rollback
point of no return
owners
temporary architecture cleanup
```

Per ESI vive in:

```text
capstone/example-software-industries/products/order-operations/docs/refactoring-safety-plan.md
```

## Cosa cambia con l'AI

Prima dell'AI il costo di modificare centinaia di file rappresentava spesso un freno naturale.

Quel freno si sta riducendo.

Questo è positivo, ma rimuove anche una forma involontaria di prudenza.

Ora possiamo produrre molto rapidamente:

- massive rename;
- framework upgrade;
- adapter;
- test;
- migration script;
- infrastructure update;
- documentation rewrite.

Di conseguenza aumenta il valore di:

- transformation specification;
- scope boundary;
- characterization evidence;
- small batch;
- automated verification;
- stop condition;
- rollback;
- cleanup.

> **Quando il costo del diff scende, il costo di capire il blast radius diventa relativamente più importante.**

## Caso reale: trasformare senza big bang

AWS documenta Branch by Abstraction come tecnica per far coesistere implementazioni durante la modernizzazione, mentre Microsoft descrive lo Strangler Fig come approccio di sostituzione incrementale che riduce il rischio rispetto a grandi cambiamenti sistemici.

Fonti:

- [AWS Prescriptive Guidance — Branch by abstraction](https://docs.aws.amazon.com/prescriptive-guidance/latest/modernization-decomposing-monoliths/branch-by-abstraction.html)
- [Microsoft Learn — Strangler Fig pattern](https://learn.microsoft.com/azure/architecture/patterns/strangler-fig)

GitHub documenta in più casi feature flag, rollout progressivi, dual path e rimozione finale del vecchio codice.

Fonti:

- [GitHub Engineering — How we ship code faster and safer with feature flags](https://github.blog/engineering/infrastructure/ship-code-faster-safer-feature-flags/)
- [GitHub Engineering — Moving persistent data out of Redis](https://github.blog/engineering/infrastructure/moving-persistent-data-out-of-redis/)

Il punto comune è più generale delle tecnologie utilizzate:

> **separare la trasformazione dal momento irreversibile del cutover.**

## Corollario

Nel Capitolo 17 abbiamo detto:

> prima capire, poi cambiare.

Ora possiamo aggiungere:

> **quando cambi, fai in modo che ogni passo produca abbastanza evidence da meritare il passo successivo.**

Il refactoring nell'era dell'AI non è l'arte di produrre enormi trasformazioni più velocemente.

È la capacità di usare una execution molto più potente senza concederle un blast radius altrettanto grande.
