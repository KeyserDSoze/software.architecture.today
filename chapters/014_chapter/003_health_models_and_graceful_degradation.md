# Health model e graceful degradation

Un sistema non è soltanto:

```text
up
oppure
down
```

Tra i due estremi esiste uno spazio molto importante:

```text
Degraded
```

È qui che spesso si vede la qualità della reliability architecture.

Microsoft propone esplicitamente un modello di health con almeno tre stati:

```text
Healthy
Degraded
Unhealthy
```

Lo stato deve derivare da segnali misurabili combinati con il significato business del workload.

Fonte:

- [Microsoft Learn — Health modeling for workloads](https://learn.microsoft.com/azure/well-architected/design-guides/health-modeling)

## Health non è la somma dei componenti verdi

Immaginiamo:

```text
App Service     Healthy
PostgreSQL      Healthy
Service Bus     Healthy
Key Vault       Healthy
```

ma:

```text
Payments & Risk consumer lag = 45 min
```

Dal punto di vista del critical flow Payment Escalation possiamo essere `Degraded`.

Oppure:

```text
App Service     Healthy
PostgreSQL      Healthy
Entra path      Unhealthy
```

Gli operatori non entrano.

Il workload è `Unhealthy` anche se il nostro processo web continua a rispondere internamente.

> **La health del prodotto non è la media della health dei componenti.**

## Health model per flow

Per Order Operations distinguiamo almeno tre flow:

### Flow A — Investigation

```text
operator login
→ list problematic orders
→ open operational view
```

### Flow B — Payment Escalation acceptance

```text
operator
→ authorized request
→ local transaction
→ PaymentEscalation + OutboxMessage
```

### Flow C — Payment Escalation delivery

```text
outbox
→ publisher
→ Service Bus
→ Payments & Risk
```

I tre flow possono avere health diversa nello stesso momento.

Esempio:

```text
Flow A = Healthy
Flow B = Healthy
Flow C = Degraded
```

Se Service Bus è temporaneamente indisponibile:

- l'operatore può ancora investigare;
- può ancora registrare localmente la Payment Escalation;
- la delivery accumula backlog.

Questo è un comportamento intenzionale costruito nel Capitolo 11.

## Degraded non significa failure nascosto

Una modalità degradata deve essere progettata.

Non significa:

```text
qualcosa non funziona
ma speriamo che nessuno se ne accorga
```

Significa:

```text
sappiamo quale capability è ridotta
sappiamo perché
sappiamo cosa resta sicuro
sappiamo come lo comunichiamo
sappiamo quando uscire dalla modalità degradata
```

Microsoft raccomanda che la graceful degradation continui a fornire valore riducendo temporaneamente funzionalità e rendendo visibile all'utente ciò che è cambiato.

Fonte:

- [Microsoft Learn — Self-preservation and graceful degradation](https://learn.microsoft.com/azure/well-architected/reliability/self-preservation)

## Esempio: Payments & Risk down

### Soluzione fragile

```text
POST payment escalation
→ synchronous call Payments
→ timeout
→ 500
```

L'operatore non sa se:

- la richiesta non è partita;
- Payments l'ha ricevuta;
- la richiesta è stata processata ma la risposta è persa.

### Soluzione corrente ESI

```text
POST payment escalation
→ local transaction
→ Requested + Outbox Pending
→ 202 Accepted
```

Se il downstream è indisponibile:

```text
Flow B = Healthy
Flow C = Degraded
```

La capability non finge una delivery già avvenuta.

Il sistema continua a fare ciò che può fare correttamente.

## Esempio: Orders dependency lenta

La read view di Order Operations dipende ancora da fonti live per alcuni dati autorevoli.

Se Orders rallenta, abbiamo diverse opzioni.

### Opzione 1 — aspettare indefinitamente

Non accettabile.

Consuma thread/connection/request budget e favorisce cascading failure.

### Opzione 2 — fallire tutto immediatamente

Può essere corretto, ma perde anche informazioni locali che potrebbero essere ancora utili.

### Opzione 3 — degraded operational view

Possibile direzione:

```text
OperationalCase locale     disponibile
Order authoritative view   unavailable
Payment view               disponibile
Shipment view              disponibile
```

La UI potrebbe mostrare:

```text
Order data temporarily unavailable
Last authoritative refresh: unknown/not available
```

senza trasformare un dato vecchio in verità corrente.

Questa soluzione richiede però una decisione funzionale.

Non possiamo inventarla solo nel codice.

## Stale data vs unavailable data

Un fallback molto comune è:

```text
se source down
usa cache
```

Ma una cache può essere peggiore di un errore se l'utente usa il dato per una decisione sensibile.

Per esempio:

```text
paymentStatus = Failed
```

potrebbe essere diventato:

```text
Captured
```

nel sistema autorevole.

Mostrare il vecchio dato come corrente può spingere a una remediation sbagliata.

Perciò un degraded mode deve definire:

```text
freshness
provenance
label
azioni consentite
azioni bloccate
```

> **La graceful degradation non deve degradare la verità senza dirlo.**

## Health endpoint

Un endpoint `/health` può essere utile.

Ma può diventare pericoloso se confonde liveness e readiness.

### Liveness

Domanda:

```text
questo processo è vivo abbastanza da non dover essere riavviato?
```

### Readiness

Domanda:

```text
questa istanza può ricevere lavoro utile adesso?
```

### Business health

Domanda diversa:

```text
il critical journey sta soddisfacendo il suo contratto?
```

Non sono sinonimi.

Un database temporaneamente lento potrebbe rendere il flow degradato senza richiedere il restart automatico del processo web.

Riavviare processi sani in risposta a una dipendenza malata può peggiorare l'incidente.

## Restart loop

Immaginiamo:

```text
DB slow
→ health check fails
→ instance restart
→ connection storm
→ DB ancora più slow
→ altre restart
```

Un meccanismo nato per self-healing è diventato traffic amplification.

Quindi:

> **Self-healing senza failure model può diventare self-harm.**

## Health tree

Un modello iniziale per ESI potrebbe essere:

```text
Order Operations
├── Investigation flow
│   ├── App runtime
│   ├── Entra access
│   ├── PostgreSQL local state
│   ├── Orders dependency
│   ├── Payments dependency
│   └── Shipping dependency
│
└── Payment Escalation flow
    ├── Acceptance
    │   ├── App runtime
    │   └── PostgreSQL
    └── Delivery
        ├── Outbox Publisher
        ├── Service Bus
        └── Payments consumer
```

La health del root non deve essere calcolata con una semplice media.

Dobbiamo stabilire quali nodi sono critici per quale journey.

## Degradation matrix

Un artefatto utile è una piccola matrice:

| Failure | Investigation | Escalation acceptance | Delivery | User behavior |
|---|---|---|---|---|
| Payments consumer down | normale | normale | degraded | escalation resta pending |
| Service Bus down | normale | normale | degraded | backlog visibile |
| PostgreSQL down | degraded/unhealthy | unhealthy | existing broker messages may continue downstream | nuovi write bloccati |
| Orders read dependency down | degraded | dipende dal case già locale | normale | authoritative order detail indisponibile |
| Entra unavailable | unhealthy per nuovi login/token flow | unhealthy per nuovi operator action | background può continuare | accesso utente degradato |
| telemetry backend down | functional flow può continuare | può continuare | può continuare | observability degraded |

Questa tabella non sostituisce la Failure Mode Map.

La completa con una domanda diversa:

> **Quanto valore possiamo ancora fornire?**

## Feature criticality

Non tutte le feature devono avere lo stesso livello di protezione.

Possiamo classificare:

```text
Tier 1 — critical journey
Tier 2 — important but degradable
Tier 3 — convenience
```

Esempio ESI:

### Tier 1

- autenticazione/autorizzazione operatore;
- visualizzazione del case locale;
- durable Payment Escalation acceptance.

### Tier 2

- dettaglio live completo di tutte le dipendenze;
- aggiornamento quasi immediato dello stato delivery.

### Tier 3

- enrichment non essenziale;
- dashboard secondarie;
- suggerimenti non critici futuri.

La classificazione è simulata e deve essere negoziata con Product/Operations.

## Bulkhead

Il Bulkhead pattern tenta di evitare che il consumo eccessivo di una parte esaurisca la capacità dell'intero sistema.

Possibili esempi:

- connection pool separata per background work;
- concurrency limit del publisher;
- queue o worker separati per workload molto diversi;
- resource limit che impediscono al reporting di saturare il critical path.

Il pattern non deve essere applicato automaticamente.

Ma la domanda è preziosa:

> **Quale workload può consumare la capacità di quale altro workload?**

## Load shedding

Quando la capacità disponibile non può servire tutto, una strategia può essere rifiutare deliberatamente lavoro meno importante.

Questo può essere più affidabile di accettare tutto e fallire lentamente.

Esempio:

```text
critical operator action  → protetta
heavy export/report       → throttled / delayed
```

Non abbiamo ancora export/report in Order Operations.

Quindi non implementiamo load shedding adesso.

Ma quando una feature simile entrerà, la reliability review dovrà valutarla.

## AI e graceful degradation

Un agente può proporre moltissimi fallback.

Questo è uno dei casi in cui la velocità può essere pericolosa.

Esempio generato:

```text
if payments unavailable:
  use last cached payment status
```

Sembra resiliente.

Potrebbe violare correctness economica.

La domanda da porre all'agente è invece:

```text
quali dati possono diventare stale?
per quanto?
con quale label?
quali azioni restano consentite?
quali devono fermarsi?
```

> **Un fallback non è affidabile perché restituisce qualcosa. È affidabile se restituisce qualcosa che possiamo ancora usare in sicurezza.**

## Corollario

La reliability non si vede soltanto quando il sistema è verde.

Si vede quando qualcosa diventa giallo e il resto del sistema sa ancora che cosa significa.