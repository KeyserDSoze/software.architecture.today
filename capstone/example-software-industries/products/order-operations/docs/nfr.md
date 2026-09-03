# Order Operations — Non-Functional Requirements

> Snapshot corrente del capstone simulato/composito di Example Software Industries S.p.A.

## Priorità attuali

1. correctness del dato operativo e delle intenzioni persistite;
2. security e access control;
3. operability e recovery;
4. latency adeguata al lavoro umano interattivo;
5. delivery affidabile delle integrazioni significative;
6. availability ragionevole per uno strumento interno;
7. semplicità operativa e costo contenuto.

## Quality floor corrente

Per la fase attuale consideriamo non negoziabili:

- correttezza semantica degli stati mostrati;
- autenticazione della produzione;
- authorization server-side per capability, risorsa e tenant;
- niente dati cross-tenant;
- tracciabilità verso le fonti autorevoli;
- capacità di diagnosticare failure significativi;
- assenza di automazioni economiche senza semantica e autorizzazioni definite;
- nessuna perdita silenziosa di una Payment Escalation dopo local commit;
- nessun side effect downstream duplicato per la stessa `EscalationId`;
- payload di integrazione minimizzati;
- retry bounded;
- dead-letter path con ownership;
- capacità di distinguere business state e integration delivery state;
- runtime identity senza ampi privilegi sul control plane;
- deployment identity distinta dal runtime;
- nessun production secret nel repository;
- revocation/rotation path per credenziali inevitabili;
- audit delle operazioni sensibili;
- controlli di sicurezza collegati a threat ed evidence.

Le soglie quantitative verranno definite quando esisteranno workload e ambiente misurabili.

## Performance

La UI deve essere abbastanza reattiva da supportare investigazione operativa interattiva.

La richiesta di Payment Escalation non deve attendere l'elaborazione completa di Payments & Risk dopo che la transazione locale è stata accettata.

Non introduciamo numeri fittizi come se fossero misurazioni reali. Le soglie quantitative verranno definite quando il capstone avrà un workload e un ambiente misurabile.

## Availability

Il sistema deve supportare il lavoro operativo durante le finestre previste, ma non esiste ancora un requisito che giustifichi active-active multi-region.

La disponibilità runtime di Payments & Risk non deve essere una precondizione per registrare localmente una Payment Escalation quando Order Operations e il proprio datastore sono disponibili.

Private DNS, identity e private network path entrano ora esplicitamente nei dependency/failure domain della produzione.

## Recovery

RTO e RPO del prodotto devono essere esplicitati prima della produzione reale.

Per il flusso asincrono sono già significativi:

- recovery del polling publisher dopo restart;
- redelivery tollerata;
- dead-letter recovery;
- controlled redrive;
- reconciliation delle escalation non consegnate;
- preservazione di `messageId`/`escalationId` durante recovery.

Per la security architecture dobbiamo inoltre poter:

- revocare una identity compromessa;
- ruotare un secret inevitabile;
- sospendere un deployment path compromesso;
- disabilitare temporaneamente una capability write;
- ripristinare un known-good artifact/configuration;
- verificare e ripristinare RBAC/network configuration dopo un incidente.

Security e recovery non sono discipline indipendenti.

## Consistency

Per l'investigazione operativa preferiamo informazioni sufficientemente aggiornate da non indurre azioni errate.

La freshness richiesta deve essere definita per capability; “real time” non è accettato come requisito senza una soglia e un motivo.

### Payment Escalation consistency

Accettiamo eventual consistency tra:

```text
PaymentEscalation Requested in Order Operations
```

e:

```text
escalation observed/processed by Payments & Risk
```

Il sistema deve però convergere secondo una business delivery policy osservabile.

Il numero di retry tecnici non sostituisce il business delay budget.

## Idempotency

La stessa intenzione di Payment Escalation deve mantenere una `EscalationId` stabile.

La stessa outbox entry mantiene un `messageId` stabile durante republish/retry.

Payments & Risk deve rendere innocua la redelivery della stessa escalation.

Riferimenti:

- [Microsoft Learn — Idempotent Consumer pattern](https://learn.microsoft.com/azure/architecture/patterns/idempotent-consumer)
- [Amazon Builders' Library — Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/)

## Retry / backoff

Policy obbligatorie:

```text
bounded attempts
error classification
exponential backoff
jitter
stable operation identity
no blind retry for deterministic validation/business failures
```

Le soglie concrete verranno definite dopo workload measurement.

Riferimenti:

- [Microsoft Learn — Retry pattern](https://learn.microsoft.com/azure/architecture/patterns/retry)
- [AWS — Exponential Backoff And Jitter](https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/)

## Backpressure / backlog

Il sistema asincrono deve poter rendere visibili almeno:

```text
outbox pending count
outbox oldest age
publish throughput
consumer lag / queue age
DLQ depth
business delivery latency
```

La messaging capability non viene trattata come buffer infinito.

Capacity e scaling policy saranno quantificate con workload misurabili.

## Ordering

La v1 non richiede ordering globale.

Se emergono eventi multipli sullo stesso `OperationalCase` con dipendenze semantiche, la requirement verrà definita in termini di ordering minimo necessario, per esempio `caseId` + versione.

## Security

### Authentication

Produzione non supporta accesso anonimo.

Microsoft Entra ID è il provider di human identity corrente per lo scenario ESI.

Un token valido non sostituisce l'authorization applicativa.

### Authorization

Le decisioni sensibili devono derivare da:

```text
authenticated security context
+ authoritative resource ownership
+ capability policy
→ authorization decision
```

Non da `tenantId`, ruolo o altri campi inviati liberamente dal client.

Negative test cross-tenant e wrong-role sono acceptance evidence obbligatorie per le capability sensibili.

### Network exposure

Per produzione:

- App Service private ingress;
- public network access dell'App Service disabilitato;
- private data-plane direction per PostgreSQL, Service Bus e Key Vault;
- VNet integration outbound;
- network location non considerata trusted per default.

La private topology è un controllo di reachability, non un sostituto dell'identità.

### Identity / privilege

- managed identity per accesso runtime ai servizi Azure quando supportato;
- runtime identity separata dalla deployment identity;
- runtime senza permission generiche di resource administration/RBAC;
- producer Service Bus con send-only permission;
- privileged access separato e auditabile;
- break-glass non usato come workflow ordinario.

### Secrets

- preferire identity/federation alla credenziale statica;
- Key Vault soltanto per secret inevitabili;
- nessun production secret nel repository;
- rotation/revocation obbligatorie;
- secret non ammessi nei payload di messaging e nei normali log.

### Data minimization / logging

- payload minimizzati;
- telemetry costruita con field allowlist;
- niente access token, Authorization header, credential o secret nei log;
- audit delle operazioni sensibili distinto dal normale application logging;
- log/DLQ soggetti a data classification, access control e retention.

### Secure SDLC

La pipeline futura deve includere baseline verificabili per:

- secret scanning;
- dependency/SCA review;
- SAST appropriato;
- protected production deployment;
- scoped/federated deployment identity;
- Bicep build/lint/policy validation;
- artifact provenance.

### WAF

Non è un requisito corrente.

Motivo:

- nessun Internet-facing ingress nello scope corrente;
- production ingress privato.

Trigger:

- public API;
- partner/mobile ingress;
- compliance o threat model che ne giustifichino il costo.

## Threat / control traceability

La security architecture è governata da:

```text
docs/threat-model.md
docs/security-control-matrix.md
docs/adr/0003-private-ingress-and-identity-first-security.md
```

Un controllo non viene considerato “completato” soltanto perché è documentato.

Usiamo i livelli:

```text
Designed
→ Codified
→ Verified
→ Monitored
```

## Operability

Il team deve poter diagnosticare:

- errori applicativi;
- dipendenze lente o indisponibili;
- query lente;
- fallimenti di integrazione;
- divergenze tra stato mostrato e dati autorevoli;
- outbox bloccata;
- publish retry;
- backlog/lag;
- duplicate delivery;
- DLQ;
- reconciliation mismatch;
- authentication/authorization failure significativi;
- drift di public network exposure;
- accessi Key Vault anomali/falliti;
- cambi RBAC privilegiati;
- deployment produzione.

Failure Mode Map, Threat Model e Security Control Matrix sono parte del contract operativo.

## Maintainability

I confini tra Orders, Payments e Shipping devono restare leggibili e verificabili nel codice.

La messaging infrastructure non deve trasformare event schema e broker-specific detail in business model.

Il publisher resta broker-agnostico tramite port esplicito; Azure Service Bus è l'adapter cloud corrente, non il dominio.

La security topology deve rimanere leggibile in IaC/documentazione e non essere ricostruibile soltanto dalla console Azure.

## Cost

La complessità infrastrutturale deve essere giustificata da requisiti e rischio misurabili.

Decisioni attuali:

- niente Redis soltanto per “essere pronti a scalare”;
- niente active-active multi-region senza requisito;
- niente microservizi per sola moda architetturale;
- niente Kafka/event-streaming platform soltanto perché abbiamo introdotto un evento;
- polling publisher iniziale invece di CDC finché volume e latency non ne giustificano il costo;
- **Service Bus Premium** accettato per supportare Private Link/private endpoint nella production security topology;
- niente WAF finché il threat model non ha un public ingress che ne giustifichi il costo.

### Security ↔ FinOps

La private endpoint decision di Service Bus ha un costo reale perché Private Link è supportato sul tier Premium.

Questo costo deve essere:

- osservato;
- attribuito al workload;
- confrontato con il rischio mitigato;
- rivalutato se threat model, platform capability o messaging topology cambiano.

Fonte:

- [Microsoft Learn — Service Bus Private Link](https://learn.microsoft.com/azure/service-bus-messaging/private-link-service)

## Compromesso corrente — Capitolo 13

**Esigenza:** ridurre attack surface e blast radius prima della produzione.

**Tensione:** private connectivity, least privilege e identity separation vs semplicità di sviluppo, debugging, networking e costo.

**Decisione:** private production ingress/data-plane direction, identity-first authorization, managed identity, runtime/deployment identity separation e security baseline codificata progressivamente in Bicep.

**Costo accettato:** private DNS/network complexity, maggiore dipendenza dalla landing zone, dev/prod parity più difficile e Service Bus Premium per Private Link.

**Quality floor:** authenticated production access, tenant isolation, least privilege, nessun production secret nel repository, runtime senza broad control-plane privilege, audit delle operazioni sensibili e revocation path.

**Guardrail:** Threat Model, Security Control Matrix, ADR, Bicep, platform policy, secret scanning, negative authorization tests, RBAC review e logging/redaction policy.

## Technology fit rule

> Non scegliere la tecnologia più impressionante. Scegli la risposta che ha il fit migliore con il problema reale.

Vale anche per i controlli di sicurezza.

`Private`, `WAF`, `Premium`, `Zero Trust` e `Key Vault` non sono medaglie: devono rispondere a threat e requisiti reali.

## Fonti metodologiche

- [Azure Application Architecture Fundamentals](https://learn.microsoft.com/azure/architecture/guide/)
- [Microsoft Learn — Security design principles](https://learn.microsoft.com/azure/well-architected/security/principles)
- [Microsoft Learn — Design secure applications](https://learn.microsoft.com/azure/security/develop/secure-design)
- [Microsoft Learn — Threat Modeling Tool](https://learn.microsoft.com/azure/security/develop/threat-modeling-tool)
- [Microsoft Learn — App Service architecture best practices](https://learn.microsoft.com/azure/well-architected/service-guides/app-service-web-apps)
- [Microsoft Learn — Service Bus Private Link](https://learn.microsoft.com/azure/service-bus-messaging/private-link-service)
- [NIST SP 800-218 — Secure Software Development Framework](https://csrc.nist.gov/pubs/sp/800/218/final)
- [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/)
- [Microsoft Learn — Transactional Outbox](https://learn.microsoft.com/azure/architecture/databases/guide/transactional-outbox-cosmos)
- [Microsoft Learn — Idempotent Consumer](https://learn.microsoft.com/azure/architecture/patterns/idempotent-consumer)

Queste fonti sostengono proprietà e metodo; i requisiti specifici di Order Operations restano simulati.