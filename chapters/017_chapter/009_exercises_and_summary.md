# 17.9 — Esercizi, autovalutazione e sintesi

Il legacy non è un problema da risolvere con una singola tecnica.

È un contesto in cui la qualità della prossima modifica dipende dalla qualità della conoscenza che siamo riusciti a ricostruire.

## Idee chiave

1. **Legacy non significa semplicemente vecchio.** Un sistema diventa legacy-like quando non riusciamo più a modificarlo con sufficiente comprensione e confidence.
2. La modernization parte da **assessment e inventory**, non dal target tecnologico.
3. Il repository è una fonte importante, ma non coincide con il sistema operativo reale.
4. Code archaeology deve seguire **journey, state change e side effect**, non soltanto directory e call graph.
5. Una dependency può vivere in shared table, job ordering, file format, config, permission o procedura umana.
6. Usiamo gli stati **Found → Inferred → Observed → Confirmed** per non confondere ipotesi e conoscenza.
7. Un characterization test protegge il comportamento osservato. Non dichiara automaticamente che quel comportamento sia corretto.
8. Ogni comportamento legacy significativo dovrebbe diventare progressivamente `required`, `compatibility` oppure `accidental`.
9. Un golden master è utile quando protegge output semanticamente importante; diventa rumore quando fotografa implementation detail.
10. Un seam permette a vecchio e nuovo comportamento di coesistere e rende il cambiamento più reversibile.
11. Branch by Abstraction è utile quando la capability vive in profondità nel sistema e non può essere intercettata facilmente dal perimetro.
12. Un Anti-Corruption Layer protegge il modello nuovo dalla semantica legacy, ma introduce una responsabilità di traduzione da governare.
13. Shared database e data migration richiedono ownership transition, reconciliation e cutover espliciti.
14. Retain, retire, rehost, replatform, refactor e rebuild sono strategie contestuali, non una scala di maturità.
15. Lo Strangler Fig riduce transformation risk attraverso sostituzione incrementale e coexistence.
16. Una big-bang rewrite rischia di inseguire un target che continua a cambiare mentre il legacy resta vivo.
17. La conoscenza operativa può vivere in runbook, query manuali, incidenti e workaround umani.
18. L'AI può accelerare molto l'archaeology, ma deve conservare provenance e grado di evidence.
19. **Documentation laundering** trasforma un'inferenza in falsa verità quando documenti generati vengono riletti come fonte autorevole.
20. L'autonomia degli agenti può crescere quando crescono characterization, test, quality gate e rollback.
21. Modernization progress si misura anche in dependency eliminate, traffic migrato, legacy responsibility rimossa ed evidence aggiunta.
22. Prima di refactorizzare dobbiamo sapere almeno quali comportamenti non possiamo cambiare accidentalmente.

## Artefatto operativo — Legacy Understanding Map

Il capitolo introduce la **Legacy Understanding Map**.

Template:

```markdown
# Legacy Understanding Map

## System / capability

## Business outcome

## Entry points

## Current behavior

## State and data ownership

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

Non deve diventare un'enciclopedia del legacy.

Deve contenere la conoscenza necessaria per governare la modernization slice corrente.

## Esercizio 1 — Legacy senza età

Prendi un sistema recente su cui hai lavorato.

Cerca segnali legacy-like:

- ownership non chiara;
- business rule non documentate;
- dipendenza fuori repository;
- test poco affidabili;
- configurazione manuale;
- deploy non ripetibile;
- workaround umano.

Domanda:

> quanti anni deve avere davvero il codice per diventare difficile da cambiare?

## Esercizio 2 — Journey archaeology

Scegli una feature di un sistema esistente.

Parti dall'azione utente o dall'evento che la attiva.

Ricostruisci:

```text
entry point
→ decision points
→ persistence
→ side effects
→ consumers
→ recovery
```

Non fermarti alla call graph.

## Esercizio 3 — Evidence state

Scrivi dieci affermazioni sul sistema.

Classificale:

```text
Found
Inferred
Observed
Confirmed
```

Per ogni `Inferred`, indica quale evidence servirebbe per promuoverla a `Observed`.

## Esercizio 4 — Hidden dependency hunt

Cerca dependency che non siano import o package:

- table;
- cron;
- file;
- environment variable;
- DNS;
- certificate;
- feature flag;
- shared cache key;
- manual process.

Quale ha il blast radius maggiore?

## Esercizio 5 — Characterization test

Prendi una funzione legacy poco chiara.

Scrivi almeno cinque characterization test che coprano:

- normal behavior;
- boundary;
- historical special case;
- invalid input;
- time-dependent behavior.

Non refactorizzare ancora.

## Esercizio 6 — Behavior classification

Per ogni behavior caratterizzato chiedi:

```text
Required?
Compatibility?
Accidental?
Unknown?
```

Quale stakeholder può confermarlo?

## Esercizio 7 — Golden master review

Prendi uno snapshot test esistente.

Segna quali campi sono:

- semantic outcome;
- implementation detail;
- nondeterministic noise;
- security/privacy risk.

Riduci lo snapshot alla parte realmente utile.

## Esercizio 8 — Candidate seam

Trova una capability legacy con molti caller.

Disegna un seam che permetta:

```text
legacy implementation
+
new implementation
```

senza migrare tutti i caller contemporaneamente.

Indica:

- contract;
- state;
- side effect;
- rollback.

## Esercizio 9 — Strangler slice

Scegli una capability da modernizzare.

Definisci:

```text
why now
boundary
coexistence
verification
traffic/cutover strategy
rollback
legacy removal condition
```

Se non riesci a definire `removal condition`, il piano rischia di creare un altro layer permanente.

## Esercizio 10 — AI archaeology

Chiedi a un agente di mappare una capability legacy.

Impone questo formato:

```text
Claim
Evidence
State
Alternative explanation
Missing evidence
```

Poi fai revisionare il risultato da un secondo agente con ruolo scettico.

Conta quante affermazioni iniziali erano troppo forti.

## Esercizio 11 — Documentation laundering

Prendi una pagina architetturale del tuo progetto.

Per ogni affermazione chiedi:

- è stata osservata?
- è una decisione?
- è un'ipotesi?
- chi la mantiene?
- quando è stata verificata?

Evidenzia ciò che appare autorevole ma non ha provenance.

## Esercizio 12 — Operations knowledge

Intervista una persona on-call o Operations.

Chiedi:

> “Qual è una cosa che fai durante un incidente e che non è scritta nel codice?”

Trasforma la risposta in:

- failure mode;
- runbook step;
- missing automation;
- oppure requirement di modernization.

## Esercizio 13 — Data ownership transition

Disegna la migrazione di una tabella legacy condivisa.

Rispondi:

```text
old writer?
new writer?
readers?
backfill?
dual-write window?
reconciliation?
cutover point?
rollback?
old writer removal?
```

## Esercizio 14 — Rewrite challenge

Per una rewrite proposta nel tuo contesto, elenca ciò che il nuovo sistema deve ancora conoscere:

- business rule;
- integration;
- history;
- consumer;
- security;
- migration;
- operating procedure.

Poi chiedi:

> la rewrite elimina davvero questa complessità o elimina soltanto il codice che la rendeva visibile?

## Esercizio 15 — ESI Operations Desk Classic

Usa la Legacy Understanding Map del capstone.

Per ogni behavior `LB-*`:

1. indica una fonte di evidence aggiuntiva;
2. assegna un owner che potrebbe confermarlo;
3. proponi una classificazione provvisoria;
4. definisci quale rischio avrebbe eliminarlo per errore.

Non progettare ancora la nuova implementazione.

## Autovalutazione

Sai rispondere senza guardare il capitolo?

1. Perché legacy non è sinonimo di software vecchio?
2. Qual è la differenza fra repository intelligence e system intelligence?
3. Che differenza c'è fra `Inferred` e `Observed`?
4. Perché un characterization test non prova che il comportamento sia corretto?
5. Quando un golden master diventa pericoloso?
6. Che cosa rende un seam utile?
7. Quando Branch by Abstraction è preferibile a un'intercettazione al perimetro?
8. Che cosa protegge un Anti-Corruption Layer?
9. Perché un shared database complica la modernization?
10. Quali rischi introduce una big-bang rewrite?
11. Che cosa misura realmente il progresso di una modernization?
12. Che cos'è il documentation laundering?
13. Quali task di legacy discovery sono adatti agli agenti AI?
14. Quali decisioni non dovrebbero essere delegate autonomamente?
15. Perché Operations è una fonte di architecture knowledge?

Se molte risposte sono vaghe, prova a produrre una Legacy Understanding Map di un sistema che conosci.

## Cosa cambia con l'AI

Prima dell'AI, il costo di esplorare una codebase molto grande limitava quante ipotesi potevamo formulare.

Ora possiamo generare rapidamente:

- mappe;
- spiegazioni;
- characterization test;
- candidate seam;
- modernization plan;
- dependency inventory.

Questo riduce il costo della discovery.

Aumenta però il rischio di confondere **velocità della spiegazione** con **qualità della comprensione**.

La competenza importante diventa saper chiedere:

```text
Da dove lo sappiamo?
È codice o comportamento runtime?
È osservato o inferito?
Chi può confermare la semantica?
Che cosa potrebbe smentirlo?
```

## Ponte verso il Capitolo 18

Alla fine di questo capitolo Operations Desk Classic non è stato modernizzato.

Abbiamo però:

- capability scope;
- legacy inventory;
- characterization suite;
- hidden contract candidate;
- evidence ledger;
- unknown espliciti;
- candidate seam;
- compromise ESI governato.

Adesso possiamo affrontare il **Capitolo 18 — Refactoring nell'era dell'AI**.

Lì la domanda cambia.

Non sarà più:

> “Che cosa fa questo sistema?”

Sarà:

> **“Come cambiamo la struttura mantenendo sotto controllo il comportamento che abbiamo deciso di preservare?”**

Ed entreranno:

- Refactoring Safety Plan;
- small steps;
- semantic diff;
- branch by abstraction applicato;
- adapter/ACL;
- test-first change;
- migration flag;
- shadow comparison;
- AI-generated refactor;
- verification bundle;
- stop condition;
- rollback.

## Corollario

> **Il legacy non diventa sicuro quando lo abbiamo spiegato bene. Diventa più sicuro quando sappiamo distinguere ciò che abbiamo osservato, ciò che abbiamo confermato e ciò che resta ancora sconosciuto.**