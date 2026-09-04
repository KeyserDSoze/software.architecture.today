# 22.8 — ESI: trasformare un gap reale in un work item execution-ready

Per applicare il metodo non inventiamo una feature.

Usiamo un gap già dichiarato nella Testing Strategy di Order Operations: l'applicazione esprime l'intenzione di salvare `PaymentEscalation` e `OutboxMessage` nella stessa unità transazionale, ma l'evidence disponibile non attraversa ancora un motore PostgreSQL reale.

Il punto di partenza è quindi onesto:

```text
TST-005
PaymentEscalation + Outbox atomicity

fast evidence
application/orchestration behavior

higher-fidelity evidence
real PostgreSQL transaction

state
Pending
```

Questa è una buona candidata per execution, non per discovery. La business semantics è già definita, l'ownership è già definita e il transaction boundary è una decisione già presa. Non dobbiamo decidere **che cosa** deve succedere. Dobbiamo produrre evidence più forte sul fatto che il meccanismo scelto lo faccia davvero.

ESI crea quindi:

```text
work-items/OO-001-postgresql-escalation-outbox-atomicity.md
```

Il work item non è ancora l'esecuzione del test. È il contratto che rende quell'esecuzione delegabile.

## Partire dal gap, non dal tool

Una versione debole del task sarebbe:

```text
Add Testcontainers to the repository.
```

Potrebbe perfino essere una buona soluzione tecnica, ma congela il meccanismo prima di aver formulato la proprietà.

OO-001 parte invece da questo outcome:

> **esercitare la migration chain corrente su un PostgreSQL reale e dimostrare commit e rollback atomici per `PaymentEscalation` e `OutboxMessage`.**

L'executor resta libero di scegliere il più piccolo environment riproducibile che soddisfa questa proprietà e che può essere usato da developer o CI. Container, local service o altra soluzione test-only restano decisioni locali finché non cambiano il boundary del prodotto.

Questa è autonomia utile: lasciare aperto il **come** dopo aver chiuso abbastanza bene il **che cosa deve essere vero**.

## Current evidence: non ripartiamo da zero

OO-001 non tratta il sistema come una scatola nera.

La baseline è già chiara:

```text
application orchestration intent
= Codified + locally Verified

PostgreSQL transaction semantics
= Designed / Pending

migration chain 001 → 002 on real PostgreSQL
= Designed / Pending
```

Il repository contiene inoltre le migration reali:

```text
database/migrations/001_create_operational_case.sql
database/migrations/002_add_payment_escalation_and_outbox.sql
```

Queste non sono fixture che il task può adattare liberamente. Sono parte della baseline che il test deve attraversare.

Se il motore reale dimostra che la migration contiene un problema, il work item deve far emergere il problema. Riscrivere la migration soltanto per ottenere verde distruggerebbe proprio l'evidence che stiamo cercando.

## Lo scope protegge la semantica, non una file list arbitraria

Il task autorizza la creazione del layer di integrazione, di helper test-only, degli script necessari e della configurazione riproducibile dell'environment. Può anche introdurre una dependency di test se ne spiega il valore.

Non autorizza invece un cambio di `PaymentEscalation`, event v1, ownership, production persistence, topology Azure, RTO/RPO o migration storiche.

La distinzione è essenziale.

```text
allowed
→ build the evidence mechanism

not allowed
→ redefine the property being proved
```

Questo è molto più forte di “modifica soltanto `tests/integration/`”. Se serve aggiornare `package.json` per introdurre un golden command di integrazione, il task deve poterlo fare. Se invece il test scopre che servirebbe un nuovo field autoritativo, deve fermarsi anche se tecnicamente quel field starebbe in un file già in scope.

## Canonical context: la issue non ricopia il repository

Prima di lavorare, l'executor viene indirizzato verso le source of truth già costruite:

```text
AGENTS.md
docs/repository-map.md
docs/testing-strategy.md
docs/data-ownership.md
docs/failure-mode-map.md
database/README.md
database/migrations/001_create_operational_case.sql
database/migrations/002_add_payment_escalation_and_outbox.sql
```

La issue non copia queste pagine.

Il Capitolo 21 ha reso il repository navigabile proprio per evitare che ogni work item diventi un prompt autosufficiente di centinaia di righe. Qui aggiungiamo soltanto il delta: perché stiamo lavorando, quale claim manca, quale scope è autorizzato e quale evidence chiude il task.

## Le acceptance property

OO-001 formalizza sei proprietà.

| ID | Proprietà da dimostrare |
|---|---|
| AC-01 | migration `001 → 002` eseguibile da database vuoto su PostgreSQL reale |
| AC-02 | successful transaction committa escalation e outbox insieme |
| AC-03 | failure sulla seconda write prima del commit lascia entrambe non committate |
| AC-04 | suite isolata e rieseguibile senza stato residuo |
| AC-05 | il fast-feedback layer resta eseguibile senza PostgreSQL integration environment già attivo |
| AC-06 | il report non estende l'evidence oltre il boundary realmente verificato |

L'ultima proprietà sembra meno tecnica delle altre, ma è fondamentale. Un test locale PostgreSQL non deve diventare, per linguaggio impreciso, prova di Azure networking, HA, PITR, performance o production readiness.

La qualità della closure fa parte dell'acceptance.

## Verification: ogni property ha il proprio esperimento

Il work item associa l'acceptance all'evidence richiesta:

```text
AC-01
→ apply migration 001 + 002 on real PostgreSQL

AC-02
→ execute success transaction and query both persisted facts

AC-03
→ inject second-write failure and inspect both tables after rollback

AC-04
→ rerun from isolated / clean state

AC-05
→ prove the normal fast test path remains independent

AC-06
→ closure report contains explicit Not verified
```

Il task può introdurre un comando come:

```text
npm run test:integration
```

ma il nome del comando resta un dettaglio locale. La property non è “lo script esiste”. La property è ciò che il motore PostgreSQL dimostra quando lo script viene eseguito.

## Stop condition: i punti in cui OO-001 smette di essere execution

L'executor deve fermarsi se l'evidence nuova richiede una decisione che il work item non possiede.

Succede, per esempio, se `001` o `002` richiedono una modifica semantica, se lo schema contraddice il Data Ownership Map, se serve un nuovo authoritative field, se il failure scenario richiede un cambio di production behavior o se l'unico environment praticabile richiede credential o risorse production non autorizzate.

La stessa cosa vale se per diventare verde fosse necessario cambiare la rule che giudica il task.

In questi casi la closure corretta non è un workaround:

```text
Stopped
Evidence collected
Decision required
Suggested follow-up
```

Il work item ha quindi un modo esplicito di produrre valore anche quando l'assunzione iniziale non regge.

## Il template diventa una convention verificabile

ESI non crea soltanto OO-001. Introduce anche:

```text
work-items/TEMPLATE.md
```

con la struttura minima riusabile per execution e discovery work item.

Per evitare che il template e il primo task diventino documentazione ornamentale, il repository aggiunge `tests/issue-readiness-fitness.test.mjs`.

La baseline del Capitolo 22 contiene quattro check:

| ID | Proprietà meccanica |
|---|---|
| ISSUE-001 | template e OO-001 esistono |
| ISSUE-002 | entrambi conservano le sezioni minime dell'execution contract |
| ISSUE-003 | OO-001 route verso il contesto canonical richiesto |
| ISSUE-004 | OO-001 protegge migration/oracle, richiede PostgreSQL reale e conserva `Not verified` |

Questi test non provano che OO-001 sia una issue perfetta o che l'executor implementerà correttamente il harness. Proteggono però il contratto minimo da drift meccanico.

È la stessa filosofia del Capitolo 21: automatizzare ciò che è abbastanza deterministico da meritare automation, lasciare al judgment ciò che non lo è.

## Stato ESI dopo il Capitolo 22

A questo punto possiamo dire:

```text
Work Item template               Codified
OO-001 execution contract        Codified
Issue-readiness fitness          Codified + locally verifiable
PostgreSQL atomicity execution   Pending
Higher-fidelity TST-005 evidence Pending
```

Questa distinzione è cruciale. **Avere una buona issue non significa aver eseguito il lavoro.**

Il progetto è avanzato perché ora il gap è diventato una unità di execution con boundary, acceptance, verification e stop condition. Il prossimo executor non deve reinventare né il problema né l'autorità necessaria per affrontarlo.

## Il compromesso ESI

Platform avrebbe potuto imporre subito un unico harness standard per tutti i team. Commerce & Operations preferisce invece proteggere la proprietà e lasciare reversibile il meccanismo. Security vieta credential production e scorciatoie su environment condivisi. Finance non vuole mantenere una superficie costosa soltanto per dimostrare una property che potrebbe essere verificata in modo più piccolo.

La decisione è quindi:

> **richiedere PostgreSQL reale e riproducibile, senza prescrivere una piattaforma di test finché non è necessaria.**

Il quality floor resta atomicity, migration fidelity, reproducibility, fast-feedback separation e credential isolation.

> **OO-001 è execution-ready perché lascia all'executor molte scelte locali e gli toglie soltanto le scelte che non è autorizzato a inventare.**
