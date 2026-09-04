## L'artefatto: API Contract

Una specifica OpenAPI può essere parte del contratto.

Non è necessariamente tutto il contratto.

Per questo nel libro useremo un artefatto più ampio:

> **API Contract**

L'obiettivo è catturare ciò che un consumer deve sapere per usare una capability senza conoscere l'implementazione interna.

### Template

```text
API / Capability
Purpose
Consumers
Interaction style
Authentication / authorization
Operations
Request semantics
Response semantics
Error model
Idempotency
Consistency / freshness
Pagination / filtering
Rate limits / quotas
Timeout expectations
Compatibility rules
Versioning / deprecation
Observability / correlation
Security notes
Examples
Open decisions
```

Non ogni API ha bisogno di ogni voce.

Una funzione interna allo stesso processo potrebbe richiedere molto meno.

un'API pubblica o un evento business persistente potrebbe richiedere molto di più.

### Purpose

Prima degli endpoint scriviamo perché esiste il contratto.

Esempio:

```text
Consentire agli operatori di individuare e investigare ordini
che richiedono attenzione operativa.
```

Questa frase impedisce di trasformare l'API in un accesso generico a tutte le tabelle ordini.

### Consumers

Elencare consumer noti ci costringe a capire il blast radius.

```text
Operations Web UI
Operations CLI — futuro possibile, non ancora committed
External partners — no
```

Se non sappiamo chi usa il contratto, anche il versioning diventa difficile da governare.

### Interaction style

Non scriviamo soltanto “REST”.

Scriviamo perché:

```text
HTTP request/response
perché il journey corrente è interattivo e read-oriented,
non richiede push continuo né temporal decoupling.
```

La scelta resta collegata al requisito.

### Operation contract

Per ogni operazione vogliamo almeno:

```text
Intent
Method / channel
Input
Output
Authorization
Side effects
Idempotency
Errors
Timing expectation
```

Questo rende evidente quando un'API ha troppa semantica nascosta.

### Consistency e freshness

Molte API espongono dati senza dichiarare quanto possano essere vecchi.

Per alcuni consumer non importa.

Per altri cambia completamente il comportamento.

Possiamo specificare:

```text
Source: live operational data
Freshness: dipende dalle source systems; nessun read model asincrono in questa fase
```

Oppure in futuro:

```text
Projection lag target: <= 5s p99
```

Ma soltanto quando quel numero ha un motivo e può essere misurato.

### Error model

Dobbiamo elencare almeno le classi di errore che cambiano il comportamento del consumer.

```text
Unauthenticated
Unauthorized
Not found
Validation failure
Dependency unavailable
Rate limited
Conflict
```

Per HTTP possiamo usare Problem Details quando è un fit appropriato.

Fonte:

- [RFC 9457 — Problem Details for HTTP APIs](https://www.rfc-editor.org/rfc/rfc9457.html)

### Idempotency

Non basta scrivere `yes/no`.

Serve capire l'unità di intento.

Per un'operazione di refund:

```text
Idempotency unit: refund request identified by merchant + order + request key
Duplicate behavior: return existing outcome, do not create second refund
Retention: TBD from business retry window
```

Il contratto porta in superficie decisioni che altrimenti finirebbero dentro una libreria.

### Observability

Un consumer dovrebbe poter correlare una richiesta con ciò che accade nel sistema.

Possiamo documentare:

- request/correlation identifier;
- trace context;
- metriche per error class;
- usage/version telemetry.

Azure Architecture Center include distributed tracing e trace context tra le considerazioni di design delle API.

Fonte:

- [Microsoft Learn — RESTful web API design](https://learn.microsoft.com/azure/architecture/best-practices/api-design)

### Contract test

Se il contratto è importante, parte di esso deve diventare verificabile automaticamente.

Possiamo verificare:

- schema;
- required field;
- status code;
- backward compatibility;
- authorization;
- idempotency;
- error format;
- pagination invariants.

Questo tema verrà approfondito nel capitolo sul testing.

### Il documento non deve duplicare la spec

Se OpenAPI descrive perfettamente request e response, l'API Contract non deve copiarle riga per riga.

Può linkare la spec e aggiungere ciò che la spec non esprime bene:

```text
semantica
ownership
trade-off
freshness
failure behavior
compatibility policy
```

La documentazione utile riduce ambiguità.

La documentazione duplicata crea drift.

### Definition of contract-ready

Prima che un'API importante venga implementata o delegata a un agente, dovremmo riuscire a rispondere a queste domande:

1. Quale capability espone?
2. Qual è il consumer?
3. Quale modello di interazione serve?
4. Quali side effect produce?
5. Come gestisce duplicati e retry?
6. Come segnala gli errori?
7. Quali dati sono autorevoli e quanto sono freschi?
8. Come evolve senza rompere consumer esistenti?
9. Come verifichiamo il contratto?

Se molte risposte sono “lo decidiamo nel controller”, non siamo ancora contract-ready.