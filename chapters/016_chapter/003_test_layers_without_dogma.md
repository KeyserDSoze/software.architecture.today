## Test layer senza dogma

Unit, integration, contract ed end-to-end sono parole utili finché ricordiamo che descrivono **quantità diverse di realtà incluse nella prova**. Non sono livelli di maturità e non sono quote da rispettare.

Ogni volta che saliamo di layer compriamo realismo e paghiamo con più dipendenze, execution time, costo ambientale e possibilità che il test fallisca per una ragione diversa dalla property che volevamo verificare.

La domanda resta una sola:

> **Qual è il boundary più economico che può rendere falsa questa claim con sufficiente fedeltà?**

## Piccolo non significa banale

Un test piccolo può verificare una business property molto importante se tutte le cause del comportamento sono locali.

Per Order Operations sono ottimi candidati:

```text
Payment category eligibility
authorization policy pure
command validation
idempotency conflict rule
retry classification/backoff
telemetry failure classification
```

Il vantaggio è precisione: quando fallisce, poche cose possono essere responsabili. Se resta hermetic può essere veloce, deterministico e adatto al feedback loop di ogni change.

Tra il test di una singola funzione e l’integrazione con infrastruttura esiste anche un livello applicativo molto utile: eseguire una capability reale con porte controllate.

```text
requestPaymentEscalation
+ real business orchestration
+ controlled UnitOfWork/Broker/Clock
```

Qui la property può attraversare più classi o moduli senza coinvolgere PostgreSQL o Azure. Litigare se chiamarlo `unit`, `component` o `application` aggiunge poco. Conta sapere quale parte è reale e quale boundary stiamo sostituendo.

## Integration test: quando la tecnologia è parte della claim

Se vogliamo verificare una property che dipende da semantics reali, il boundary deve entrare nel test.

Per PostgreSQL ci interessano migration, transaction rollback, unique constraint, concurrency/isolation, query behavior e atomicità dell’outbox. Una struttura in-memory non è evidence di queste proprietà.

Per l’HTTP host ci interessano route, serialization, Problem Details, authentication/authorization integration e compatibility del contract esposto.

Per il messaging ci interessano wire payload, broker adapter e comportamenti che dipendono realmente dal servizio o dal client SDK.

Microsoft distingue appunto gli integration test perché includono database, file system, network o altri componenti che l’unit test normalmente evita.

Fonti:

- [Microsoft Learn — Testing in .NET](https://learn.microsoft.com/en-us/dotnet/core/testing/)
- [Microsoft Learn — Testing ASP.NET Core services and web apps](https://learn.microsoft.com/dotnet/architecture/microservices/multi-container-microservice-net-applications/test-aspnet-core-services-web-apps)

Il principio è indipendente dallo stack:

> **Se stai testando il boundary, usa una rappresentazione abbastanza fedele del boundary.**

## Contract test: compatibilità senza distribuire tutto

Quando Order Operations e Payments & Risk evolvono indipendentemente, non vogliamo che ogni incompatibilità venga scoperta soltanto in un ambiente condiviso dopo aver deployato entrambi.

Un contract test restringe la domanda:

> consumer e provider condividono ancora la stessa comprensione dell’interazione?

Pact formalizza proprio questa idea e distingue esplicitamente contract test e functional test.

Fonti:

- [Pact — Introduction](https://docs.pact.io/)
- [Pact — Contract Tests vs Functional Tests](https://docs.pact.io/consumer/contract_tests_not_functional_tests)

Per `OperationalCasePaymentEscalatedV1` un contract verde può dimostrare che il wire shape e le expectation condivise restano compatibili. Non dimostra che Payments & Risk deduplichi correttamente `EscalationId` o produca il side effect business giusto.

La compatibility è una claim. La business correctness del consumer è un’altra.

## End-to-end: comprare il viaggio completo soltanto dove serve

Un E2E può attraversare:

```text
operator
→ private ingress
→ identity
→ Order Operations
→ PostgreSQL
→ outbox
→ Service Bus
→ Payments & Risk
```

Questo test può scoprire problemi che nessun layer isolato vede: DNS, permission, deployment, config, serialization, wiring e interaction fra componenti reali.

Proprio per questo è costoso da eseguire e da diagnosticare. Può fallire per environment, shared data, identity, network, timing, quota o dependency esterna senza che la business rule testata sia sbagliata.

Google ha documentato il costo dei large/end-to-end test in lentezza e flakiness; Microsoft Well-Architected raccomanda di usarli in modo selettivo sui critical user journey.

Fonti:

- [Google Testing Blog — Just Say No to More End-to-End Tests](https://testing.googleblog.com/2015/04/just-say-no-to-more-end-to-end-tests.html)
- [Microsoft Learn — Architecture strategies for testing](https://learn.microsoft.com/en-us/azure/well-architected/operational-excellence/testing)

La conseguenza è semplice: le combinazioni della business rule devono vivere nei layer piccoli; l’E2E dimostra che i boundary che abbiamo scelto di attraversare funzionano davvero insieme.

## Synthetic production verification non è regression testing

Il synthetic journey del Capitolo 15 attraversa un ambiente operativo reale o production-like per rispondere a:

> **Il critical journey continua a funzionare qui e adesso?**

È quindi più vicino al monitoring attivo che alla normale pre-production suite.

Per Order Operations una private synthetic identity con synthetic tenant può verificare il core read journey senza customer data e senza aprire un endpoint pubblico soltanto per il probe.

Quando questa evidence gira continuamente, la property si avvicina a `Monitored`, non soltanto `Verified`.

## Exploratory test: il giudizio umano può essere evidence

Non tutte le qualità utili sono riducibili a una assertion automatica. Un’interfaccia operativa può essere tecnicamente corretta e cognitivamente confusa. Un journey può produrre dati corretti ma renderne impossibile l’interpretazione sotto pressione.

Microsoft include exploratory testing tra gli approcci utili quando l’area è nuova o difficile da scriptare.

Fonte:

- [Microsoft Learn — Build confidence in Azure workloads with effective testing practices](https://learn.microsoft.com/en-us/azure/well-architected/design-guides/testing)

`Manual` non significa improvvisato. Una sessione può avere charter, risk hypothesis, scope, evidence e follow-up.

## Performance, security e reliability non sono “test speciali”: verificano claim diverse

Un load test non vale perché usa molti virtual user. Deve essere collegato a workload model, latency/error SLI, saturation e headroom. Altrimenti produce un grafico interessante, non acceptance evidence.

Un reliability test non vale perché spegne qualcosa. Deve partire da un failure mode e verificare degraded behavior, recovery, stop condition e target.

Un security test non vale perché usa uno scanner. Deve falsificare una claim del Threat Model o della Security Control Matrix: cross-tenant denial, least privilege, no secret leakage, no public access dove vietato.

OWASP ASVS può fornire una base di verification requirement per technical security control, ma la suite deve comunque essere collegata alle minacce specifiche del workload.

Fonte:

- [OWASP — Application Security Verification Standard](https://owasp.org/www-project-application-security-verification-standard/)

## Infrastructure test: un template valido non è ancora un workload funzionante

Per l’IaC distinguiamo almeno:

```text
static template validation
policy validation
actual deployment
network/identity behavior
application critical journey
failure/recovery behavior
```

Microsoft Well-Architected raccomanda cross-layer validation proprio perché una resource può essere provisionata correttamente e risultare inutilizzabile dall’applicazione.

Fonte:

- [Microsoft Learn — Architecture strategies for testing](https://learn.microsoft.com/en-us/azure/well-architected/operational-excellence/testing)

`Bicep build = PASS` dimostra syntax/schema. Non dimostra private connectivity, effective RBAC o App Service recovery.

## La Risk-to-Layer Map di Order Operations

| Property | Cheap evidence | Real boundary necessario | High-fidelity evidence |
|---|---|---|---|
| category eligibility | application | no | selettivo HTTP |
| idempotency intent | application | PostgreSQL/API | critical flow selettivo |
| outbox atomicity | orchestration | **PostgreSQL** | failure path |
| event compatibility | serialization | **consumer/provider contract** | E2E selettivo |
| duplicate business effect | consumer component | **consumer persistence** | redelivery flow |
| tenant isolation | application negative | **authenticated HTTP/Azure identity** | private journey |
| Service Bus least privilege | IaC inspection | **Azure RBAC** | staging negative test |
| restore RTO/RPO | procedure review | **real recovery environment** | drill |

La tabella non assegna prestigio ai layer. Dice quale claim smette di essere dimostrabile se togliamo quel boundary.

## Evitare la duplicazione rituale

Un anti-pattern frequente è copiare lo stesso scenario in:

```text
unit
integration
API
E2E
UI
```

La suite cresce, ma la nuova evidence è quasi nulla.

Preferiamo:

- molte combinazioni business nel layer piccolo;
- integration test mirati alle semantics reali;
- contract test sulle expectation cross-team;
- pochi E2E sui critical journey;
- operational drill sui failure che nessun test locale può simulare credibilmente.

> **La piramide non ci dice quanti test scrivere. Ci ricorda che ogni aumento di realismo deve giustificare il proprio costo con una claim che i layer più economici non possono falsificare.**