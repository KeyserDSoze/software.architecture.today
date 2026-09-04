## Cloud reliability per Order Operations

A questo punto possiamo tradurre il Reliability Contract in topologia cloud. La domanda non è quali feature HA Azure metta a disposizione, ma **quali failure mode ESI ha deciso di pagare e quali capability coprono davvero quei failure**.

Questo capovolge il modo di usare il catalogo cloud. Prima fissiamo il contratto. Solo dopo scegliamo la ridondanza.

## Compute: proteggere instance e zone failure senza anticipare la seconda regione

Microsoft documenta che Azure App Service supporta zone redundancy sui piani compatibili, con almeno due istanze e una region/scale unit che supporta availability zone. Quando la capability è abilitata, le istanze vengono distribuite tra zone differenti.

Fonti:

- [Microsoft Learn — Reliability in Azure App Service](https://learn.microsoft.com/azure/reliability/reliability-app-service)
- [Microsoft Learn — Configure App Service plans for zone redundancy](https://learn.microsoft.com/azure/app-service/configure-zone-redundancy)

Per Order Operations la decisione production diventa:

```text
App Service Premium v3
capacity >= 2
zoneRedundant = true
```

La giustificazione non è che `Premium` suoni più enterprise. È che il failure domain che vogliamo ridurre oggi è quello di instance e availability zone, mentre il workload rimane single-region.

Il costo reale è una capacity minima superiore a una singola istanza e quindi una spesa fissa maggiore anche quando il traffico è basso. ESI accetta quel costo perché il core operator journey ha un RTO intra-region di quindici minuti e perché una singola istanza sarebbe incoerente con il target.

La ridondanza nominale, però, non basta. Dovremo misurare se la capacity residua dopo la perdita di una istanza o di una zone mantiene realmente il journey entro SLO. `capacity >= 2` è un design intent; headroom e saturation sono evidence da produrre.

## Health check: non trasformare ogni dependency in motivo di restart

App Service offre Health Check e può rimuovere istanze unhealthy dal routing. Ma il path deve descrivere la readiness locale dell’istanza, non l’intero business health model.

Se Payments & Risk è lento ma Order Operations può ancora accettare Payment Escalation localmente, non vogliamo dichiarare l’istanza web unhealthy e innescare restart o rimozioni che riducono ulteriormente capacità.

Quindi separiamo:

```text
instance readiness
≠
product health
```

Il primo serve al runtime/platform routing. Il secondo nasce dai critical flow e verrà osservato con segnali end-to-end.

> **Un health check di orchestrazione non deve tentare di comprimere tutto il Reliability Contract.**

## PostgreSQL: spendere sulla source locale che rende durable il prodotto

Azure Database for PostgreSQL Flexible Server offre HA con standby e, nella configurazione zone-redundant, primary e standby in availability zone differenti, con replica sincrona e failover automatico per i failure coperti dal servizio.

Fonte:

- [Microsoft Learn — High Availability in Azure Database for PostgreSQL](https://learn.microsoft.com/azure/postgresql/high-availability/concepts-high-availability)

Per production scegliamo quindi:

```text
PostgreSQL Flexible Server
+ zone-redundant HA
+ backup / PITR
```

Qui il costo aggiuntivo ha una ragione forte: PostgreSQL contiene `OperationalCase`, `PaymentEscalation` e outbox publication intent. Se perdiamo questo stato oltre il boundary accettato, non abbiamo soltanto un problema di performance o disponibilità; perdiamo la fonte che rende deterministica l’acceptance e recuperabile la delivery.

La HA non rende comunque il database immortale. Restano logical corruption, bad migration, authorization error, capacity saturation, region failure e retry storm. Per questo continuiamo ad avere backup, PITR, migration discipline, monitoring e restore drill.

## Service Bus: usare la resilienza del tier già comprato senza raccontare garanzie inesistenti

Order Operations usa già Azure Service Bus Premium per una decisione security del Capitolo 13: la private connectivity del production design. La reliability architecture non introduce quindi Premium una seconda volta per “avere HA”.

Microsoft documenta la resilienza zonale di Service Bus nelle regioni supportate e le capability cross-region separate.

Fonte:

- [Microsoft Learn — Reliability in Azure Service Bus](https://learn.microsoft.com/azure/reliability/reliability-service-bus)

Il punto economico è importante: una decisione può comprare più proprietà contemporaneamente. Dobbiamo riconoscerlo per capire il TCO, ma non dobbiamo attribuire al servizio ciò che non promette.

Non abilitiamo ancora Geo-Replication. I target regionali correnti sono:

```text
RTO <= 8 h
RPO <= 1 h
```

ed ESI accetta recovery orchestrata invece di continuità immediata cross-region.

Inoltre l’outbox locale conserva durablemente l’intenzione di pubblicazione. In alcuni failure regionali questo aumenta il valore della recovery del database rispetto alla replica immediata del singolo messaggio sul broker.

Se il business passasse a near-zero message loss e regional failover rapido, la decisione cambierebbe. Oggi non anticipiamo quel costo.

## Eliminare una dipendenza può essere più affidabile che renderla ridondante

Key Vault è una dipendenza runtime soltanto per i secret che non possiamo sostituire con workload identity. Questo ci ricorda una forma di reliability spesso ignorata: **ridurre il dependency graph**.

Se App Service può autenticarsi con managed identity verso Service Bus o altre capability, eliminiamo una credenziale da recuperare, ruotare e caricare durante startup. Non sempre è possibile, ma ogni secret eliminato riduce un failure mode oltre che un rischio security.

Lo stesso principio si applica ad altri componenti: prima di rendere ridondante una dipendenza chiediamoci se è davvero necessaria nel critical path.

## Identity: availability non autorizza bypass

Entra ID fa parte del journey dell’operatore. Un identity incident può influire in modo diverso su utenti già autenticati, nuovi login e token refresh.

Non dobbiamo però inventare un fallback che permetta accesso anonimo o bypassi application authorization per mantenere availability. Il quality floor di security rimane valido anche in degraded mode.

```text
identity unavailable
≠
allow anonymous access
```

Questa è una delle intersezioni più importanti fra Capitolo 13 e Capitolo 14: una recovery strategy che rompe il trust boundary non è resilienza, è un nuovo incidente.

## Private DNS diventa parte del critical dependency graph

La private connectivity scelta nel Capitolo 13 aggiunge un failure domain che prima non avevamo:

```text
App
→ private DNS resolution
→ private endpoint
→ managed service
```

PostgreSQL, Key Vault o Service Bus possono essere perfettamente healthy nel resource provider e risultare comunque irraggiungibili dal workload per un errore DNS o di network configuration.

Questo spiega perché il health model deve osservare il journey, non soltanto i rettangoli Azure.

GitHub ha documentato nel luglio 2026 un incidente in cui un problema di database connectivity colpì un internal DNS control plane; dati incompleti furono interpretati da un’automazione di reconfiguration e, mentre le cache DNS scadevano, alcuni servizi persero la capacità di risolvere indirizzi interni. Tra i follow-up dichiarati comparivano safeguard per preservare l’ultima configurazione valida, rifiutare input incompleti e impedire large destructive change.

Fonte primaria:

- [GitHub Availability Report — July 2026](https://github.blog/news-insights/company-news/github-availability-report-july-2026/)

Non copiamo l’implementazione GitHub. Conserviamo la categoria di failure: **control plane/configuration failure può rendere inutilizzabili risorse sane**.

## Bad deployment: il failure più vicino a noi

Ridondanza zonale, managed database e broker resilienti non proteggono da una nuova versione applicativa che interpreta male una `PaymentEscalation`, rompe authorization o introduce una migration incompatibile.

Per questo il deployment stesso entra nella reliability architecture:

```text
reproducible artifact
staged deployment
health validation
migration compatibility
rollback path
```

Il provider gestisce la piattaforma. Non può decidere se il nostro nuovo business behavior è corretto.

## Una matrice impedisce di confondere la protezione acquistata

| Component | Protezione corrente | Failure coperto | Non coperto |
|---|---|---|---|
| App Service | >=2 + zone redundancy | instance/zone | bad deploy, region |
| PostgreSQL | zone-redundant HA | node/zone | logical corruption, region |
| PostgreSQL backup/PITR | recovery point | logical/data recovery | immediate continuity |
| Service Bus | regional zone resilience | broker/zone | regional continuity se non configurata |
| Outbox | durable publication intent | commit/publish gap | source DB loss oltre RPO |
| IaC | versioned infrastructure intent | rebuild/config review | wrong IaC propagated everywhere |
| Entra | managed identity dependency | provider-managed platform availability | authorization bypass non consentito |
| Private DNS | platform-managed private resolution | normal private routing | bad config/control-plane failure |

La matrice rende evidente una regola:

> **Ogni controllo di reliability copre un insieme finito di failure.**

## Quanto costa il Capitolo 14

Rispetto al Capitolo 12, production ora costa di più:

```text
App Service capacity >= 2
+ zone-capable Premium plan
+ PostgreSQL zone-redundant HA
```

Finance deve vedere questo aumento e la motivazione deve restare collegata a:

```text
SLO core journey
RTO intra-region <= 15 min
RPO 0 per committed local business state
```

Se i target cambiano, la topologia e il costo devono poter cambiare con loro.

Non compriamo ancora active-active multi-region, global traffic management, write topology PostgreSQL cross-region o Service Bus Geo-Replication. Il motivo non è che siano troppo sofisticati in assoluto, ma che i target correnti non li richiedono.

## Cosa resta da verificare

Dopo questa decisione restano aperti health check path, autoscale/headroom policy, backup retention finale, deployment strategy, recovery environment, SLI query, synthetic journey e alert routing.

Non sono buchi da nascondere. Sono il confine tra **Designed/Codified** e **Verified/Monitored**.

Il Capitolo 15 trasformerà molti di questi elementi in segnali operativi. Prima, però, dobbiamo dimostrare che la recovery che abbiamo disegnato funziona davvero sotto fault controllato.