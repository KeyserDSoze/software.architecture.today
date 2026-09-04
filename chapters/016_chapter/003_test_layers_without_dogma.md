# 16.3 — Test layer senza dogma

Parlare di unit, integration ed end-to-end test è utile soltanto se ricordiamo che sono **livelli di evidence**, non identità professionali.

Un team può avere una suite eccellente senza usare esattamente le stesse proporzioni di un altro.

La domanda resta:

> **qual è il layer più economico che riesce a catturare il rischio reale con sufficiente fedeltà?**

## Unit test

Un unit test verifica comportamento in uno scope piccolo e controllabile.

Microsoft definisce gli unit test come test che esercitano componenti o unità di lavoro individuali e non includono normalmente infrastruttura come database, file system o network resource.

Fonte:

- [Microsoft Learn — Testing in.NET](https://learn.microsoft.com/en-us/dotnet/core/testing/)

Per Order Operations sono candidati naturali:

- classificazione di un OperationalCase;
- authorization decision pure;
- validazione di un command;
- idempotency rule a livello use case;
- mapping `failure → result class`;
- retry policy;
- backoff calculation;
- telemetry classification;
- serialization helper puro.

Il vantaggio principale non è che sono “unit”.

È che possono essere:

```text
fast
isolated
deterministic
cheap to run
precise when they fail
```

## Component/application test

Fra unit test e integration test completo esiste spesso un livello molto utile: testare una capability applicativa con porte controllate ma logica reale.

Per esempio:

```text
requestPaymentEscalation
+ fake transaction boundary
+ real validation/idempotency logic
```

Qui non testiamo una singola funzione matematica.

Testiamo una business capability completa senza PostgreSQL o Service Bus.

Questo è un buon fit quando vogliamo verificare:

- business invariant;
- orchestration locale;
- error mapping;
- interaction fra moduli sotto il nostro controllo;
- stato prodotto dal use case.

Non è importante litigare sul nome `unit` o `component`.

È importante sapere quale boundary è reale e quale è controllato.

## Integration test

Un integration test diventa necessario quando la property dipende dall'integrazione con qualcosa che non possiamo simulare fedelmente con il solo codice locale.

Microsoft evidenzia proprio questa differenza: gli integration test includono spesso database, file system, network o altri elementi infrastrutturali perché devono verificare che più componenti funzionino insieme.

Fonti:

- [Microsoft Learn — Testing in.NET](https://learn.microsoft.com/en-us/dotnet/core/testing/)
- [Microsoft Learn — Testing ASP.NET Core services and web apps](https://learn.microsoft.com/dotnet/architecture/microservices/multi-container-microservice-net-applications/test-aspnet-core-services-web-apps)

Per Order Operations:

### PostgreSQL integration

Serve per verificare davvero:

- migration;
- constraint;
- transaction rollback;
- isolation/concurrency;
- query/index behavior rilevante;
- outbox atomicity.

### HTTP integration

Serve per verificare:

- route;
- serialization;
- validation;
- Problem Details;
- authentication/authorization integration;
- API compatibility.

### Messaging integration

Serve per verificare:

- wire payload;
- broker adapter;
- message property;
- retry/dead-letter behavior che dipende dal broker.

Un mock dell'SDK non dimostra che abbiamo configurato correttamente Azure Service Bus.

## Contract test

I contract test sono particolarmente importanti quando due sistemi evolvono indipendentemente.

Pact descrive il contract testing come verifica della comprensione condivisa dei messaggi scambiati fra consumer e provider, con l'obiettivo di rilevare incompatibilità senza dover sempre distribuire l'intero sistema integrato.

Fonte:

- [Pact — Introduction](https://docs.pact.io/)

Questa categoria include almeno due esigenze differenti.

### Provider/schema conformance

Il provider deve rispettare il contratto dichiarato.

Per esempio:

```text
OpenAPI says field X is required
→ real response must obey it
```

### Consumer-provider expectation

Il provider deve continuare a soddisfare ciò che i consumer usano davvero.

Questo è il caso classico del consumer-driven contract.

Pact sottolinea che contract test e functional test non sono equivalenti: il contract test verifica il messaggio e la compatibilità dell'interazione; il test funzionale del provider deve ancora verificare che il side effect business corretto avvenga.

Fonte:

- [Pact — Contract Tests vs Functional Tests](https://docs.pact.io/consumer/contract_tests_not_functional_tests)

Per Order Operations la distinzione è preziosa.

Il contract:

```text
OperationalCasePaymentEscalatedV1
```

può essere valido sul wire e tuttavia il consumer Payments & Risk potrebbe gestirlo semanticamente male.

Servono entrambe le forme di evidence.

## End-to-end test

Un end-to-end test attraversa il sistema come farebbe un attore reale.

Per esempio:

```text
operator
→ private ingress
→ authentication
→ Order Operations
→ PostgreSQL
→ outbox
→ Service Bus
→ Payments consumer
```

Questo tipo di test può produrre evidence che nessun layer isolato può dare.

Ma è costoso.

Può fallire per:

- network;
- environment;
- shared test data;
- identity;
- DNS;
- deployment;
- provider esterno;
- timing;
- race;
- quota.

Ed è proprio per questo che non deve diventare il posto dove verifichiamo ogni combinazione di business rule.

Google ha pubblicato più volte il costo dei large/end-to-end test in termini di lentezza, debugging e flakiness, proponendo un approccio con molti test piccoli e un numero selettivo di test completi.

Fonte:

- [Google Testing Blog — Just Say No to More End-to-End Tests](https://testing.googleblog.com/2015/04/just-say-no-to-more-end-to-end-tests.html)

Microsoft Well-Architected dà una raccomandazione coerente: gli E2E sono utili per critical user journey, ma vanno mantenuti selettivi perché hanno costo e maintenance burden maggiori.

Fonte:

- [Microsoft Learn — Architecture strategies for testing](https://learn.microsoft.com/en-us/azure/well-architected/operational-excellence/testing)

## Synthetic production-like test

Nel Capitolo 15 abbiamo già progettato synthetic journey per misurare health e SLO.

Un synthetic test non sostituisce la pre-production suite.

Risponde a una domanda diversa:

> il journey continua a funzionare **nell'ambiente operativo reale**?

È quindi più vicino al monitoring attivo che al normale regression testing.

Per Order Operations:

```text
private synthetic identity
→ synthetic tenant
→ controlled read journey
```

può verificare periodicamente il critical flow senza usare dati reali di clienti.

Questo tipo di test entra nel modello `Monitored`, non soltanto `Verified`.

## Exploratory test

Non tutto ciò che ha valore è automatizzabile.

Un'interfaccia operativa complessa può avere:

- affordance confuse;
- informazioni tecnicamente corrette ma poco comprensibili;
- journey lenti per ragioni cognitive;
- combinazioni inattese di azioni.

Microsoft include exploratory testing fra gli strumenti utili quando l'area è nuova, ambigua o difficile da scriptare.

Fonte:

- [Microsoft Learn — Build confidence in Azure workloads with effective testing practices](https://learn.microsoft.com/en-us/azure/well-architected/design-guides/testing)

L'errore sarebbe interpretare “manual” come “non ingegneristico”.

Anche un exploratory session può avere:

```text
charter
scope
risk hypothesis
evidence
finding
follow-up
```

## Performance test

La performance non si dimostra con un unit test.

Per Order Operations dobbiamo in futuro verificare:

- latency del critical read journey;
- saturation;
- connection pressure;
- outbox throughput;
- queue backlog recovery;
- behavior sotto burst;
- retry amplification.

Il test deve essere derivato dai workload model e dagli SLO, non da un numero arbitrario di virtual user.

Se non conosciamo il modello di traffico, un load test produce soprattutto un grafico.

## Reliability/failure test

Il Capitolo 14 ha già definito required drill:

1. Payments consumer unavailable;
2. App instance loss;
3. PostgreSQL failover;
4. PostgreSQL PITR/restore;
5. private DNS failure;
6. bad deployment rollback.

Questi sono test architetturali.

Non verificano semplicemente una funzione.

Verificano se la topologia reale soddisfa il Reliability Contract.

## Security test

Anche la security richiede più layer.

### Unit/application

- policy decision;
- input validation;
- log redaction.

### Integration

- authentication setup;
- cross-tenant negative test;
- wrong-role negative test;
- database permission.

### Infrastructure

- public access disabled;
- RBAC scope;
- runtime identity cannot modify infrastructure;
- Key Vault reachability.

### Verification standard

OWASP ASVS offre una base esplicita di requirements per verificare technical security control e può essere usato come riferimento per definire il livello di assurance richiesto.

Fonte:

- [OWASP — Application Security Verification Standard](https://owasp.org/www-project-application-security-verification-standard/)

## Infrastructure test

IaC che compila non significa workload funzionante.

Microsoft Well-Architected raccomanda di separare application e infrastructure test, ma anche di aggiungere cross-layer evidence perché un template può provisionare correttamente risorse che l'applicazione non riesce poi a usare.

Fonte:

- [Microsoft Learn — Architecture strategies for testing](https://learn.microsoft.com/en-us/azure/well-architected/operational-excellence/testing)

Per il nostro Bicep vogliamo almeno distinguere:

```text
static template validation
policy validation
deployment smoke test
network reachability
identity/RBAC negative test
application journey
```

## La matrice layer × risk

Per Order Operations possiamo iniziare così:

| Property | Small/application | Integration | Contract | E2E/operational |
|---|---:|---:|---:|---:|
| category eligibility | forte | opzionale | n/a | minimo |
| idempotency key | forte | forte DB | API contract | critical journey selettivo |
| outbox atomicity | parziale | **forte DB** | event schema | selettivo |
| downstream duplicate tolerance | parziale | consumer integration | **forte** | selettivo |
| tenant isolation | application | **forte** | API | private journey |
| Service Bus RBAC | n/a | **cloud** | n/a | deployment verification |
| restore RTO/RPO | n/a | n/a | n/a | **recovery drill** |

La tabella non assegna prestigio ai layer.

Assegna responsabilità.

## Non testare la stessa cosa ovunque

Un errore comune è duplicare ogni scenario a ogni layer:

```text
unit
integration
API
E2E
UI
```

Questo aumenta costo e maintenance senza necessariamente aumentare confidence.

Meglio avere:

- molte combinazioni business al layer piccolo;
- integration case mirati sui boundary reali;
- contract case sulle aspettative cross-team;
- pochi E2E sui critical journey.

Se un E2E fallisce perché una business rule locale è sbagliata, bene.

Ma non dovrebbe essere **l'unico** posto capace di rilevarla.

## Corollario

> **La piramide non ci dice quanti test scrivere. Ci ricorda che il realismo ha un costo e che dobbiamo comprarlo soltanto dove produce evidence che i layer più economici non possono dare.**