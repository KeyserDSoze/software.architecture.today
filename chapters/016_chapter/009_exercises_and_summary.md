# 16.9 — Esercizi, autovalutazione e sintesi

Il Capitolo 16 ha spostato il testing da una domanda quantitativa:

> quanti test abbiamo?

verso una domanda architetturale:

> **quale evidence possediamo rispetto ai rischi che contano?**

Questo cambia il modo in cui progettiamo suite, pipeline e perfino il production code.

## Idee chiave

1. Il numero di test non misura la confidenza.
2. Code coverage misura esecuzione strutturale, non capacità di rilevare fault.
3. I test devono derivare da requirement, invariant, contract, threat e failure mode, non soltanto dall'implementazione.
4. La testability è una proprietà architetturale.
5. Il layer più piccolo adeguato è generalmente il miglior punto di partenza.
6. Integration test servono quando la property dipende da tecnologia o boundary reali.
7. Contract test e functional test rispondono a domande diverse.
8. End-to-end test comprano realismo pagando velocità, isolamento e maintenance.
9. Security, reliability, performance e observability richiedono verification specifica.
10. IaC che compila non dimostra che il workload funzioni.
11. Un backup che esiste non dimostra che il restore funzioni.
12. Un flaky test è un defect della quality system.
13. I test generati dall'AI richiedono una sorgente di verità più forte del codice che stanno testando.
14. Mutation testing può misurare la forza di una suite rispetto a fault concreti, ma non deve diventare un nuovo KPI assoluto.
15. Una Testing Strategy governa risk, layer, environment, gate, ownership e test debt nel tempo.

## Artefatto operativo del capitolo

**Testing Strategy**.

Il minimo utile contiene:

```text
Quality goals
Critical journeys
Risk inventory
Risk-to-Evidence Map
Test layers
Pipeline gates
Contract/data/security/reliability testing
Test environment/data policy
Flakiness policy
Coverage/mutation policy
AI-generated-test policy
Ownership
Evidence status
Review triggers
```

## Esercizio 1 — Coverage non significa confidence

Prendi una funzione con almeno tre branch.

Scrivi o genera test che raggiungano il 100% statement coverage.

Poi introduci manualmente tre fault:

1. inverti una condition;
2. rimuovi una validation;
3. restituisci un valore semanticamente sbagliato mantenendo lo stesso tipo.

Domande:

- quali test falliscono?
- quali mutant sopravvivono?
- la coverage è cambiata?
- quale assertion mancava?

Obiettivo:

separare **code executed** da **fault detected**.

## Esercizio 2 — Dal requirement al test layer

Requirement:

> una Payment Escalation è consentita soltanto per un OperationalCase di categoria Payment.

Progetta:

- un application test;
- un HTTP integration test;
- un E2E test.

Poi rispondi:

- quali scenario metteresti in ciascun layer?
- quali non duplicheresti?
- dove verificheresti tutte le categorie possibili?

Obiettivo:

scegliere il layer per costo/evidence invece che per abitudine.

## Esercizio 3 — Atomicità reale

Property:

```text
PaymentEscalation + OutboxMessage
commit atomically
```

Spiega perché un fake Unit of Work può verificare l'orchestration ma non basta a dimostrare l'atomicità PostgreSQL.

Progetta un integration test che provochi un failure dopo l'inserimento della escalation ma prima del completamento della transaction.

Pass criterion:

```text
0 partial commits
```

## Esercizio 4 — Contract vs functional

Per `OperationalCasePaymentEscalatedV1` scrivi due scenari:

### Contract test

Che cosa deve verificare sul messaggio?

### Functional consumer test

Che cosa deve verificare sul comportamento di Payments & Risk?

Poi spiega perché un contract test verde non dimostra che il consumer non creerà due workflow economici.

## Esercizio 5 — Duplicate delivery

Simula:

```text
same EscalationId
same messageId
message delivered twice
```

Definisci:

- expected technical behavior;
- expected business behavior;
- persistence necessaria;
- evidence che considereresti sufficiente.

## Esercizio 6 — Authorization negativa

Scenario:

```text
operator tenant A
knows caseId tenant B
```

Progetta una evidence chain a tre livelli:

1. application;
2. authenticated HTTP integration;
3. staging.

Per ogni livello scrivi cosa dimostra e cosa **non** dimostra.

## Esercizio 7 — Testare il test

Scegli un test esistente e rispondi:

> quale modifica sbagliata al production code dovrebbe farlo fallire?

Introduci quella modifica temporaneamente.

Se il test non fallisce, decidi se:

- rafforzare assertion;
- cambiare layer;
- eliminare test ridondante;
- correggere la tua comprensione della property.

## Esercizio 8 — AI-generated test adversarial review

Fornisci a un agente:

```text
requirement
implementation
existing tests
```

Chiedigli di generare cinque test.

A un secondo agente fornisci gli stessi dati più i test generati e chiedi:

```text
For each test, propose a realistic bug that should make it fail.
Identify tautological assertions, overmocking, duplication and missing negative cases.
Do not generate replacement tests until the critique is complete.
```

Confronta il risultato.

Obiettivo:

usare agenti con ruoli differenti invece di affidarsi a una sola auto-review.

## Esercizio 9 — Flaky test

Crea volutamente un test fragile usando almeno uno fra:

- clock reale;
- random non seeded;
- shared mutable state;
- `sleep()`;
- ordering implicito.

Poi rendilo deterministico.

Documenta quale dependency nascosta produceva flakiness.

## Esercizio 10 — Recovery evidence

Requirement simulato:

```text
RTO <= 15 min
```

Un documento dice che PostgreSQL failover è automatico.

Domanda:

è sufficiente come evidence?

Progetta un drill con:

```text
starting condition
fault trigger
expected behavior
measurement
stop condition
actual RTO
actual RPO
post-recovery validation
```

## Esercizio 11 — Pipeline budget

Hai questi test:

```text
unit/application: 40 sec
PostgreSQL integration: 4 min
contract: 2 min
Azure staging: 15 min
load: 30 min
PITR restore: 45 min
```

Disegna:

- local feedback;
- PR gate;
- deployment gate;
- nightly/scheduled;
- readiness.

Obiettivo:

non mettere tutto ovunque e non lasciare nulla senza un gate appropriato.

## Esercizio 12 — Test data privacy

Un team propone di copiare il database produzione in staging perché “così i test sono realistici”.

Elenca:

- vantaggi reali;
- privacy/security risk;
- retention risk;
- determinism problem;
- alternative con synthetic/anonymized data;
- casi in cui una copia potrebbe essere giustificata con governance specifica.

## Esercizio 13 — Mutation testing selettivo

Per `requestPaymentEscalation` scegli cinque mutation plausibili.

Esempio:

```text
remove tenant check
remove category check
ignore existing escalation conflict
skip outbox append
accept different case for same escalationId
```

Per ognuna identifica il test che dovrebbe intercettarla.

Se non esiste, aggiungila al Risk-to-Evidence backlog.

## Esercizio 14 — Observability verification

Failure:

```text
outbox publish fails repeatedly
```

Oltre al comportamento applicativo, definisci test per verificare:

- metric;
- structured event;
- correlation;
- alert;
- owner;
- runbook.

Obiettivo:

ricordare che un failure invisibile è un rischio operativo anche quando il codice gestisce correttamente l'exception.

## Esercizio 15 — Scrivi una Testing Strategy

Scegli un tuo progetto reale.

Compila almeno:

```text
3 critical journey
10 risk/property
risk-to-evidence map
pipeline layers
flakiness policy
AI test policy
3 review trigger
```

Poi cerca due aree con molti test ma rischio basso e due aree con rischio alto ma evidence debole.

Questa asimmetria è spesso più interessante della coverage totale.

## Autovalutazione

Dovresti saper rispondere senza consultare il capitolo.

1. Perché il numero di test non misura confidence?
2. Che cosa misura davvero code coverage?
3. Qual è la differenza fra testare una property e una call sequence?
4. Quando un integration test è necessario?
5. Contract test e E2E test rispondono alla stessa domanda?
6. Perché un fake database non dimostra le semantics PostgreSQL?
7. Come testeresti unknown publish outcome?
8. Perché flaky test è un problema architetturale/operativo?
9. Che cosa aggiunge mutation testing alla coverage?
10. Perché non vogliamo il 100% mutation score come obiettivo universale?
11. Come dovrebbe essere reviewato un test generato dall'AI?
12. Che differenza c'è fra Testing Strategy e test plan?
13. Quale evidence dimostra davvero un RTO?
14. Perché IaC compilation non basta come infrastructure evidence?
15. Chi possiede la qualità di un sistema?

Se alcune risposte restano vaghe, quello è il punto da riprendere.

## Cosa cambia con l'AI

Prima dell'AI la scarsità era spesso:

```text
tempo per scrivere test
```

Con l'AI la scarsità si sposta verso:

```text
buoni requirement
risk identification
strong assertions
meaningful fault models
test review
suite architecture
maintenance
```

Possiamo generare più test.

Dobbiamo diventare più bravi a cancellarne molti.

Un test che non aggiunge evidence aumenta:

- execution time;
- maintenance;
- cognitive load;
- false confidence.

Quindi nel testing, come nel software design:

> **la capacità di non aggiungere complessità inutile diventa più preziosa quando aggiungerla costa poco.**

## Stato ESI dopo il capitolo

Order Operations avrà ora:

```text
Testing Strategy
Risk-to-Evidence Map
first executable tests
AI-generated-test policy
flakiness policy
pipeline direction
```

Ma resteranno ancora non verificate:

- PostgreSQL integration suite;
- real consumer contract con Payments & Risk;
- Azure identity/network test;
- load/capacity evidence;
- recovery drill;
- production synthetic journey.

Questi gap non sono un fallimento del capitolo.

Sono la fotografia onesta dello stato del progetto.

## Ponte al Capitolo 17

Finora abbiamo costruito un sistema relativamente giovane.

Nel mondo reale, però, raramente partiamo da zero.

Entriamo in repository:

- vecchi;
- poco documentati;
- pieni di workaround;
- con test parziali;
- con ownership perduta;
- con migration storiche;
- con dependency obsolete;
- con regole di business incorporate in posti inattesi.

Il prossimo capitolo sarà:

# Capitolo 17 — Legacy e comprensione

Lì la domanda cambia.

Non sarà:

> come progettiamo correttamente?

Sarà:

> **come ricostruiamo abbastanza verità su un sistema esistente da poterlo cambiare senza distruggere ciò che ancora non comprendiamo?**

L'AI può diventare un acceleratore enorme di code archaeology.

Ma il rischio sarà altrettanto grande: una spiegazione plausibile del legacy non è ancora una spiegazione vera.

## Corollario del Capitolo 16

> **Una suite di test non è una collezione di prove che il software funziona. È un sistema di sensori costruito per farci scoprire, il prima possibile, i modi importanti in cui potrebbe non funzionare più.**