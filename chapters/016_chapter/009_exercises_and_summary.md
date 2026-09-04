# 16.9 — Esercizi, autovalutazione e sintesi

Il Capitolo 16 ha cambiato la domanda con cui guardiamo una suite.

Non chiediamo più soltanto:

> quanti test abbiamo?

Chiediamo:

> **quali claim importanti del sistema siamo davvero in grado di falsificare prima che una modifica arrivi troppo lontano?**

Da qui discende tutto il resto.

La code coverage diventa un segnale strutturale, non una prova di qualità. La piramide diventa un'euristica economica, non una costituzione. Integration, contract, E2E, security, reliability e performance test smettono di essere categorie da collezionare e diventano boundary da attraversare quando una proprietà non può essere verificata a un livello più economico.

La Testing Strategy serve proprio a rendere esplicita questa relazione:

```text
risk
→ property / claim
→ cheapest sufficient evidence
→ higher-fidelity evidence when needed
→ gate
→ confidence
```

Il test più prezioso non è quello più grande, né quello più intelligente, né quello scritto con il framework più moderno.

È quello che avrebbe buone probabilità di fermare un errore importante prima che quell'errore diventi un problema reale.

## Cosa dobbiamo portarci via

Una property critica dovrebbe avere una sorgente più forte dell'implementazione che stiamo testando: Functional Analysis, requirement, invariant, contract, threat, failure mode, Reliability Contract o altra decisione esplicita.

Il layer più piccolo adeguato è normalmente il punto di partenza perché offre feedback rapido e diagnostica precisa. Quando però la property dipende da PostgreSQL, broker, identity, network, failover o altro comportamento reale, dobbiamo attraversare quel boundary. Un fake può verificare la nostra logica; non può certificare la semantica di una tecnologia che non sta usando.

Contract test e functional test non sono intercambiabili. Un messaggio può essere wire-compatible e produrre comunque un effetto business sbagliato. Un database migration script può essere sintatticamente valido e distruggere dati esistenti. Un backup può esistere e non essere recuperabile entro l'RTO. Un alert può compilare e non essere azionabile.

Questo capitolo ha quindi allargato il concetto di testing: **security, reliability, recovery, observability e operabilità sono anch'esse proprietà da verificare**.

L'AI rende questa disciplina ancora più importante. Generare cento test è economico. Capire quali cento non servono, quale test è tautologico, quale assertion protegge una vera property e quale fault manca resta un lavoro di judgment.

## Artefatto operativo — Testing Strategy

L'artefatto del capitolo collega i rischi ai layer di evidence.

Una versione compatta deve rendere visibili almeno:

```text
quality goals
critical journeys
risk inventory
risk-to-evidence map
test layers
pipeline gates
contract/data/security/reliability testing
test environment and data policy
flakiness policy
coverage and mutation policy
AI-generated-test policy
ownership
evidence status
review triggers
```

Non deve diventare il catalogo di ogni test file.

Deve permettere a un reviewer di rispondere a domande come:

```text
quale rischio resta senza evidence?
quale test costoso non compra più nuova confidence?
quale property è verificata soltanto con un fake?
quale gate protegge questo change?
chi possiede un flaky test?
```

## Esercizio 1 — Coverage non significa confidence

Prendi una funzione con almeno tre branch e raggiungi il 100% statement coverage.

Poi introduci temporaneamente tre fault:

1. inverti una condition;
2. rimuovi una validation;
3. restituisci un valore semanticamente errato mantenendo lo stesso tipo.

Per ciascuno chiedi:

```text
quale test fallisce?
la coverage cambia?
il fault sopravvive?
quale assertion mancava?
```

L'obiettivo è separare **code executed** da **fault detected**.

## Esercizio 2 — Scegliere il layer dalla property

Requirement:

> una Payment Escalation è consentita soltanto per un `OperationalCase` di categoria `Payment`.

Progetta una evidence chain con application test, HTTP integration ed eventuale E2E.

Poi elimina gli scenari duplicati che non aggiungono nuova evidence.

Spiega quale parte della property può essere verificata senza infrastruttura e quale richiede un boundary più realistico.

## Esercizio 3 — Atomicità reale

Property:

```text
PaymentEscalation + OutboxMessage
commit atomically
```

Spiega che cosa può dimostrare un fake `UnitOfWork` e che cosa non può dimostrare.

Poi progetta un integration test PostgreSQL che introduca un failure nella finestra tra le due write.

Pass criterion:

```text
0 partial commits
```

## Esercizio 4 — Contract non significa comportamento

Per `OperationalCasePaymentEscalatedV1` definisci:

```text
serialization/schema test
consumer-provider contract test
functional consumer test
```

Per ognuno scrivi la claim specifica che può falsificare.

Poi spiega perché un contract test verde non dimostra che Payments & Risk non creerà due workflow per la stessa escalation.

## Esercizio 5 — Unknown outcome e duplicate delivery

Simula:

```text
broker accepts message
acknowledgement is lost
producer retries
same message is delivered twice
```

Definisci:

- stable technical identity;
- business identity;
- retry policy;
- dedup persistence;
- expected technical duplicates;
- expected business effect;
- evidence sufficiente.

## Esercizio 6 — Authorization negativa

Scenario:

```text
operator tenant A
knows caseId tenant B
```

Costruisci una chain a tre livelli:

```text
application
authenticated HTTP integration
staging identity/network
```

Per ogni livello scrivi cosa dimostra e cosa non dimostra.

Il risultato corretto non è soltanto `403`: verifica anche l'assenza di persistence, outbox e data leakage.

## Esercizio 7 — Testare il test

Scegli un test esistente e completa la frase:

> Questo test dovrebbe fallire se...

Introduci temporaneamente proprio quel fault.

Se il test resta verde, decidi se:

- rafforzare l'assertion;
- cambiare layer;
- eliminare un test ridondante;
- correggere la tua comprensione della property.

## Esercizio 8 — AI-generated test, review avversariale

Fornisci a un agente:

```text
requirement
risk
implementation
existing tests
```

Chiedigli cinque test candidate.

A un secondo agente chiedi invece di proporre, per ogni candidato, un fault realistico che dovrebbe farlo fallire e di cercare:

```text
tautological assertion
overmocking
duplication
missing negative path
hidden non-determinism
```

Non chiedere al secondo agente di correggere subito i test. Prima deve criticare la confidence prodotta.

## Esercizio 9 — Flakiness come defect

Crea volutamente un test fragile usando almeno uno fra clock reale, random non seeded, shared mutable state, `sleep()` o ordering implicito.

Poi rendilo deterministico e documenta quale dipendenza nascosta rendeva il risultato instabile.

Infine scrivi una policy per decidere quando quarantinare, correggere o rimuovere un flaky test.

## Esercizio 10 — Recovery evidence

Requirement simulato:

```text
RTO <= 15 min
```

La documentazione dice che il failover PostgreSQL è automatico.

Progetta un drill che produca:

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

Poi spiega perché la documentazione del servizio non è ancora evidence del tuo workload.

## Esercizio 11 — Evidence pipeline

Hai questi costi indicativi:

```text
application suite: 40 sec
PostgreSQL integration: 4 min
contract: 2 min
Azure staging: 15 min
load: 30 min
PITR restore: 45 min
```

Distribuiscili fra:

```text
local feedback
pull request
deployment/staging
scheduled/readiness
production continuous verification
```

Per ogni scelta indica quale rischio accetti rimandando una evidence a un gate successivo.

## Esercizio 12 — Test data e privacy

Un team propone di copiare il database di produzione in staging per avere dati “realistici”.

Valuta:

- beneficio reale;
- privacy e security risk;
- retention;
- determinismo;
- ownership;
- alternative synthetic/anonymized;
- condizioni eccezionali in cui una copia governata potrebbe essere giustificata.

L'obiettivo è trattare il test data set come un asset, non come un dettaglio della suite.

## Esercizio 13 — Mutation testing selettivo

Per `requestPaymentEscalation` scegli almeno cinque fault plausibili, per esempio:

```text
remove tenant check
remove category check
ignore idempotency conflict
skip outbox append
accept different case for same escalationId
```

Per ciascuno identifica il test che dovrebbe intercettarlo.

Se non esiste, non aggiungere subito un test a caso: aggiungi prima il gap al Risk-to-Evidence Map.

## Esercizio 14 — Observability verification

Failure:

```text
outbox publish fails repeatedly
```

Oltre al comportamento applicativo, definisci come verificare:

```text
metric / event
correlation
backlog visibility
alert condition
owner
runbook
recovery signal
```

Un failure gestito ma invisibile resta un rischio.

## Esercizio 15 — Costruisci una Testing Strategy reale

Scegli un progetto che conosci e scrivi almeno:

```text
3 critical journeys
10 risk/property
risk-to-evidence map
pipeline gates
flakiness policy
AI-generated-test policy
3 review triggers
```

Poi cerca due asimmetrie:

```text
molti test + rischio basso
rischio alto + evidence debole
```

Queste asimmetrie sono spesso più interessanti della coverage totale.

## Autovalutazione

Dovresti riuscire a spiegare, senza consultare il capitolo, perché il numero di test non misura la confidence; che cosa misura davvero la code coverage; la differenza fra property e call sequence; quando un integration test diventa necessario; perché contract test ed E2E non rispondono alla stessa domanda; perché una fake persistence non dimostra le semantics PostgreSQL; come testare un unknown publish outcome; perché flakiness sia un defect del quality system; che cosa aggiunga mutation testing; perché il 100% mutation score non sia un obiettivo universale; come revieware un test generato dall'AI; la differenza fra Testing Strategy e test plan; quale evidence dimostri davvero un RTO; perché IaC compilation non dimostri application behavior; e chi possieda la qualità di un sistema cross-team.

Se una risposta resta vaga, prova a riscriverla nella forma:

```text
claim
→ fault
→ evidence
```

Se non riesci, probabilmente non hai ancora identificato il boundary giusto.

## Cosa cambia con l'AI

Prima dell'AI la scarsità era spesso il tempo necessario a scrivere test.

Ora possiamo produrre test, fixture, mock, mutation ed eval candidate molto più velocemente.

La scarsità si sposta verso:

```text
buoni requirement
risk identification
fault models
strong assertions
layer selection
review
suite architecture
maintenance
```

L'AI rende quindi più facile sia migliorare una suite sia riempirla di rumore.

Un test che non aggiunge evidence aumenta execution time, maintenance, cognitive load e false confidence.

Per questo la capacità di **non aggiungere** diventa una competenza di qualità.

## Stato ESI dopo il Capitolo 16

Order Operations possiede ora la direzione per:

```text
Testing Strategy
Risk-to-Evidence Map
first deterministic tests
AI-generated-test policy
flakiness policy
evidence pipeline
```

Restano però gap importanti:

```text
real PostgreSQL integration
consumer contract with Payments & Risk
Azure identity/network verification
performance/capacity evidence
failover and PITR drills
production private synthetic journey
```

Questi gap non vengono nascosti dietro i test locali già verdi.

È proprio questo il valore del modello `Designed → Codified → Verified → Monitored`: sapere quale claim è sostenuta da evidence e quale no.

## Ponte al Capitolo 17 — Legacy e comprensione

Finora ESI ha costruito un prodotto relativamente giovane e con decisioni progressivamente documentate.

La realtà quotidiana spesso è diversa.

Entriamo in repository vecchi, poco documentati, pieni di workaround, test parziali, migration storiche e regole di business incorporate in posti che nessuno ricorda più.

Il problema non è più soltanto progettare correttamente.

Diventa:

> **come ricostruiamo abbastanza verità su un sistema esistente da poterlo cambiare senza distruggere comportamenti che non abbiamo ancora compreso?**

L'AI può accelerare enormemente code archaeology e documentazione.

Ma la stessa velocità può produrre spiegazioni plausibili che il repository, i dati o gli operatori non hanno mai confermato.

Il Capitolo 17 partirà quindi da una regola diversa:

```text
found
≠
inferred
≠
observed
≠
confirmed
```

## Corollario

> **Una suite di test non è una collezione di prove che il software funziona. È un sistema di sensori costruito per rendere difficile che i modi importanti in cui può smettere di funzionare restino invisibili fino alla produzione.**