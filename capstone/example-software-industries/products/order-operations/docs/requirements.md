# Order Operations — Requirements Snapshot

> Stato corrente dei requisiti del capstone simulato/composito di Example Software Industries S.p.A.

Questo documento non sostituisce l'analisi funzionale. Riassume i requisiti che influenzano concretamente design e architettura.

## Problema

Gli operatori impiegano troppo tempo a individuare ordini che richiedono attenzione e a capire quale parte del processo sta causando il problema.

Quando serve Payments & Risk, la richiesta di escalation deve essere registrabile rapidamente e consegnata in modo affidabile senza rendere la disponibilità runtime del downstream parte del critical acceptance path.

Il prodotto tratta inoltre dati operativi e capability payment-adjacent che richiedono accesso autenticato, tenant isolation, privilegi limitati e un livello di reliability coerente con le finestre operative.

## Outcome

Ridurre il tempo necessario per:

1. individuare un ordine problematico;
2. comprenderne la causa principale;
3. decidere se intervenire, attendere o escalare;
4. rendere visibile quando una escalation è stata richiesta ma non ancora consegnata;
5. continuare a fornire valore durante failure degradabili senza presentare informazioni inaffidabili come certe;
6. recuperare da failure infrastrutturali e dati entro target espliciti;
7. farlo senza ampliare inutilmente blast radius, privilegi e costo.

## Contesto ESI

- Payments & Risk possiede la semantica economica;
- Platform Engineering fornisce landing zone, networking, identity foundation e messaging capability;
- Security governa threat model e baseline condivise;
- Legal/Compliance può aggiungere quality floor;
- Finance/FinOps influenza il costo accettabile delle decisioni di security e reliability.

## In scope

- vista ordini problematici e dettaglio operativo;
- `OperationalCase` locale;
- source authority esplicita;
- accesso controllato per operatori interni;
- Payment Escalation;
- transactional outbox e delivery asincrona;
- delivery state, retry, DLQ e reconciliation;
- threat model, identity/authorization e private production topology;
- Reliability Contract;
- SLI/SLO iniziali;
- health model `Healthy/Degraded/Unhealthy`;
- zone resilience intra-region;
- recovery target e restore drill.

## Out of scope corrente

- merchant public portal;
- automazione completa remediation;
- refund/capture/provider retry da Order Operations;
- active-active multi-region;
- event sourcing;
- microservizi per ogni capability;
- AI decisionale sul trattamento degli ordini;
- saga general-purpose;
- read model asincrono di tutti gli stati;
- Internet-facing public API;
- WAF senza public ingress;
- regional active-active database/messaging topology.

L'out of scope può cambiare quando cambia il contesto.

## Functional requirements

### FR-001 — Lista ordini problematici

Un operatore autorizzato può visualizzare gli ordini che soddisfano una regola funzionale di problematicità.

### FR-002 — Identificazione della causa

Il sistema distingue almeno problema ordine, pagamento e spedizione.

### FR-003 — Dettaglio operativo

L'operatore può consultare informazioni sufficienti all'investigazione.

### FR-004 — Source authority

Il sistema distingue dati autorevoli da dati derivati/aggregati.

### FR-005 — Access control

Le capability operative sono disponibili soltanto ad attori autorizzati.

### FR-006 — Stato leggibile

Gli stati sono espressi con termini del dominio e non con dettagli tecnici interni.

### FR-007 — Payment Escalation

Un operatore autorizzato può richiedere una Payment Escalation per un `OperationalCase` eligibile.

La richiesta non modifica il payment status e non esegue side effect economici.

### FR-008 — Idempotent escalation intent

La stessa intenzione usa la stessa `EscalationId`/Idempotency-Key e non crea una seconda escalation business.

### FR-009 — Asynchronous delivery state

Order Operations distingue:

```text
Pending
Delivered
Delayed
DeadLettered
```

senza confonderli con il workflow economico.

### FR-010 — Durable publication intent

`PaymentEscalation` e relativa `OutboxMessage` vengono persisted nella stessa transazione locale.

### FR-011 — Downstream duplicate tolerance

Payments & Risk tollera redelivery della stessa `EscalationId` senza duplicate business effect.

### FR-012 — Delivery failure visibility

Una escalation oltre il business delivery threshold o in DLQ non resta un failure silenzioso.

## Reliability requirements

I numeri seguenti sono **requisiti simulati ESI**, non benchmark universali.

### RR-001 — Core operator journey SLO

Il core operator journey ha target iniziale:

```text
99.9% good events
rolling 28 days
```

La definizione tecnica del good event deve essere tracciata nell'Observability Contract.

### RR-002 — Escalation publication target

```text
99% delle escalation accepted
published to broker within 5 minutes
```

### RR-003 — Health state

Il workload deve poter essere classificato almeno come:

```text
Healthy
Degraded
Unhealthy
```

in funzione dei critical flow, non soltanto della resource health.

### RR-004 — Graceful degradation

Quando una authoritative read dependency non è disponibile, il prodotto può fornire una vista degradata soltanto se:

- provenance/freshness sono esplicite;
- dati non verificabili non vengono presentati come current truth;
- azioni che richiedono facts mancanti sono bloccate.

### RR-005 — Intra-region recovery

Per failure coperti dalla HA corrente:

```text
RTO core journey <= 15 min
RPO = 0 per committed OperationalCase / PaymentEscalation state
```

### RR-006 — Region disaster recovery

La prima fase single-region accetta:

```text
RTO <= 8 h
RPO <= 1 h
```

Questi target impongono una recovery path documentata ma non richiedono oggi active-active multi-region.

### RR-007 — Compute zone resilience

La production App Service baseline usa almeno due istanze e zone redundancy in una region/plan supportati.

### RR-008 — Database HA

La production direction per PostgreSQL usa zone-redundant HA e backup/PITR.

HA non sostituisce logical restore.

### RR-009 — Recovery evidence

Il workload non può dichiarare un recovery control `Verified` senza drill/evidence.

Drill minimi:

- App instance loss;
- PostgreSQL failover;
- PostgreSQL PITR/restore;
- Payments consumer unavailable;
- private DNS failure;
- bad deployment rollback.

### RR-010 — Backpressure visibility

Backlog e saturation devono diventare osservabili almeno tramite:

- outbox pending/oldest age;
- queue depth/age;
- DLQ depth;
- publisher throughput/failure;
- App Service saturation/headroom;
- PostgreSQL connection pressure.

### RR-011 — No security bypass for availability

Un failure di identity/network/security dependency non autorizza fallback che disabilitino authentication, tenant isolation o least privilege.

### RR-012 — Error-budget governance

Per SLO quantitativi deve esistere una policy che colleghi burn dell'error budget a change/reliability review.

## Security requirements

### SR-001 — Authenticated production access

Accesso umano produzione tramite identity ESI autenticata con Microsoft Entra ID.

### SR-002 — Server-side tenant authorization

Il server ricostruisce accesso da security context e ownership autorevole; non si fida di un `tenantId` scelto dal client.

### SR-003 — Explicit Payment Escalation permission

La creazione di Payment Escalation richiede capability/ruolo esplicito; authorization failure non produce persistence.

### SR-004 — Runtime least privilege

Runtime identity senza broad resource administration/RBAC permission.

### SR-005 — Runtime/deployment identity separation

Runtime e deployment identity sono distinte; pipeline futura preferisce federation a secret statici.

### SR-006 — Secret management

Nessun production secret nel repository; secret inevitabili con owner, scope, rotation e revocation path.

### SR-007 — Private production reachability

Produzione corrente richiede private ingress e private data-plane direction; network reachability non conferisce authorization.

### SR-008 — Sensitive operation auditability

Payment Escalation conserva evidence di actor, identifiers, timestamp, outcome e correlation necessaria.

### SR-009 — Logging data minimization

Telemetry senza token, Authorization header, secret o credential.

### SR-010 — Security control traceability

Control significativi collegati a threat, owner ed evidence.

### SR-011 — Secure deployment baseline

Security-sensitive infrastructure versionata in IaC quando praticabile.

### SR-012 — Revocation and containment

Identity/credential compromesse devono poter essere revocate o contenute senza cambiare il domain model.

## Acceptance evidence corrente

### Functional / distributed

- classificazione problematic order;
- state combination;
- authorization;
- authoritative source traceability;
- `PaymentEscalation + OutboxMessage` atomicità;
- retry con stessa Idempotency-Key;
- duplicate delivery senza duplicate business effect;
- pending/delivered/delayed/dead-lettered path;
- reconciliation.

### Reliability

Da rendere eseguibile:

- synthetic core operator journey;
- SLI calculation su una finestra nota;
- App instance loss con capacity residua;
- PostgreSQL planned/unplanned failover exercise;
- PITR/restore con actual RTO/RPO;
- Payments consumer outage con `CF-02 Healthy / CF-03 Degraded`;
- backlog threshold evidence;
- private DNS failure detection;
- bad deployment rollback.

### Security

Da rendere eseguibile:

- unauthenticated denied;
- wrong-role escalation denied senza persistence;
- cross-tenant access denied;
- runtime cannot assign RBAC/change infra;
- Service Bus publisher send-only;
- public App Service access disabled;
- secret scan;
- telemetry senza token/secret;
- sensitive audit event;
- Bicep build/lint/policy validation.

## Assunzioni correnti

- prodotto interno;
- Azure application landing zone;
- single-region per la fase corrente;
- Platform Engineering fornisce network/private DNS foundation;
- Service Bus Queue è il broker corrente;
- polling publisher adeguato al volume iniziale;
- Payments & Risk implementa idempotency downstream;
- App Service zone redundancy disponibile nella region/scale unit scelta;
- business accetta RTO/RPO regionali più rilassati del failure intra-region.

## Decisioni aperte

- definizione definitiva di problematic order;
- lifecycle completo OperationalCase / Payment Escalation;
- business latency threshold del core journey;
- exact good-event SLI query;
- burn-rate alert policy;
- App Service autoscale/headroom;
- PostgreSQL HA/private networking IaC module;
- backup retention;
- regional recovery environment e runbook;
- acknowledgement Payments;
- DLQ/outbox retention;
- log/audit retention;
- CI/CD federated deployment identity;
- costo reliability/security rispetto al rischio e all'SLO;
- eventuali nuovi contractual SLA.

## Traceability

- Capitolo 2 — problem framing e functional analysis;
- Capitolo 3 — system thinking;
- Capitolo 4 — ADR lookup live;
- Capitolo 5 — responsibility boundary;
- Capitolo 6 — NFR e fit before fashion;
- Capitolo 7 — pattern selection;
- Capitolo 8 — modular monolith;
- Capitolo 9 — API contract;
- Capitolo 10 — data ownership;
- Capitolo 11 — distributed failure/outbox;
- Capitolo 12 — cloud topology;
- Capitolo 13 — Security by Design;
- Capitolo 14 — SLO, health model, reliability topology, RTO/RPO e recovery evidence.

Quando un capitolo cambia un requisito, questo documento deve evolvere insieme a codice e artefatti.