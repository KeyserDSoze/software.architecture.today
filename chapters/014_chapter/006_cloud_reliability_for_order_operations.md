# Cloud reliability per Order Operations

Ora traduciamo i target del capitolo in decisioni cloud.

La domanda non è:

> **Quali feature HA offre Azure?**

È:

> **Quali feature ci servono per coprire i failure mode che ESI ha deciso di pagare?**

## App Service

Microsoft documenta che App Service supporta zone redundancy su piani compatibili, con almeno due istanze e region/scale unit che supportano availability zone.

Quando la zone redundancy è abilitata, le istanze vengono distribuite tra zone differenti.

Fonti:

- [Microsoft Learn — Reliability in Azure App Service](https://learn.microsoft.com/azure/reliability/reliability-app-service)
- [Microsoft Learn — Configure App Service plans for zone redundancy](https://learn.microsoft.com/azure/app-service/configure-zone-redundancy)

### Decisione ESI

Per production Order Operations scegliamo:

```text
App Service Premium v3
capacity >= 2
zoneRedundant = true
```

La ragione non è “Premium è enterprise”.

È:

```text
failure mode da coprire = instance / zone failure
```

senza introdurre oggi una seconda regione.

### Costo

Zone redundancy non ha necessariamente una voce di prezzo separata, ma richiede capacità minima multipla e quindi aumenta il costo effettivo rispetto a una singola istanza.

Questo costo viene accettato perché protegge un failure domain coerente con il nostro RTO intra-region.

## App health check

App Service supporta Health Check per rimuovere istanze unhealthy dal routing.

Ma il path deve essere progettato con attenzione.

Non vogliamo che:

```text
Payments downstream slow
```

renda automaticamente l'istanza web non healthy se il prodotto può ancora accettare escalation localmente.

La health probe dell'istanza deve quindi misurare readiness locale appropriata, non ogni possibile dipendenza del business.

Il **business health model** sarà più ricco e verrà osservato separatamente.

> **Un health check di orchestrazione non deve cercare di contenere tutto il modello di health del prodotto.**

## PostgreSQL

Azure Database for PostgreSQL Flexible Server offre HA con standby e, nella configurazione zone-redundant, primary e standby distribuiti in availability zone differenti.

Microsoft documenta replica sincrona e failover automatico per questo scenario.

Fonte:

- [Microsoft Learn — High Availability in Azure Database for PostgreSQL](https://learn.microsoft.com/azure/postgresql/high-availability/concepts-high-availability)

### Decisione ESI

Per production:

```text
PostgreSQL Flexible Server
+ zone-redundant HA
+ backup / PITR
```

Questa scelta aumenta il costo rispetto a una configurazione single-server.

Ma protegge il dato locale che contiene:

- OperationalCase;
- PaymentEscalation;
- outbox publication intent.

Questi dati sono nel quality floor.

## PostgreSQL non diventa immortale

Con zone-redundant HA restano failure come:

- logical corruption;
- application bug;
- destructive migration;
- bad credentials/authorization;
- region failure;
- capacity saturation;
- client retry storm.

Per questo continuiamo ad avere:

```text
backup
PITR
migration discipline
capacity monitoring
restore drill
```

## Service Bus

Azure Service Bus offre zone redundancy nella regione; la documentazione attuale indica che la capability è abilitata automaticamente nelle region supportate e replica message data/configuration attraverso zone per resilienza al zone failure.

Fonte:

- [Microsoft Learn — Reliability in Azure Service Bus](https://learn.microsoft.com/azure/reliability/reliability-service-bus)

Order Operations usa già Premium per il requisito security Private Link emerso nel Capitolo 13.

Quindi il capitolo Reliability non introduce Premium “per reliability”.

Sfrutta una capability che il tier già scelto offre.

Questo è un punto economico importante:

> **Una decisione può comprare più proprietà contemporaneamente. Dobbiamo evitare di contarne il costo due volte ma anche di attribuire alla tecnologia garanzie che non offre.**

## Service Bus e region failure

Non abilitiamo ancora Geo-Replication.

Perché il nostro target regionale corrente è:

```text
RTO <= 8 h
RPO <= 1 h
```

con recovery orchestrata e non immediate regional continuity.

Inoltre l'outbox locale è la fonte durable dell'intenzione ancora da pubblicare.

Questo riduce il valore marginale di una replica cross-region del broker nella fase corrente.

Se il target diventasse:

```text
near-zero message loss
+ rapid regional failover
```

la decisione andrebbe riaperta.

## Key Vault

Key Vault è una dipendenza di runtime solo per i secret che non possiamo eliminare attraverso workload identity.

Questo suggerisce un principio reliability:

> **Eliminare una dipendenza è spesso più affidabile che renderla ridondante.**

Se runtime può usare Managed Identity direttamente per PostgreSQL/Service Bus/altre capability, riduciamo il numero di secret che devono essere recuperati da vault durante il normal path.

Non sempre sarà possibile.

Ma il dependency graph migliora.

## Entra ID

Per gli operatori, Entra è parte del journey di accesso.

Dobbiamo distinguere:

- utenti già autenticati con token valido;
- nuovo login;
- token refresh;
- application authorization locale.

Un identity provider incident può avere impatto diverso su questi path.

Non inventiamo fallback che bypassino identity per “mantenere availability”.

Il quality floor security resta superiore alla convenience:

```text
identity unavailable
≠
allow anonymous access
```

## Private DNS

Il Capitolo 13 ha scelto private endpoint.

Questo aumenta l'importanza del DNS privato.

Il dependency graph diventa:

```text
App
→ private DNS resolution
→ private endpoint
→ service
```

Se il DNS control plane/configuration è sbagliato, i servizi possono essere healthy ma irraggiungibili dal workload.

Questa è una delle ragioni per cui il health model deve osservare il journey e non soltanto la health del resource provider.

## Caso reale — GitHub, luglio 2026

GitHub ha documentato nel luglio 2026 un incidente in cui un problema di database connectivity colpì un internal DNS control plane. Dati incompleti furono interpretati da un'automazione di reconfiguration e, man mano che le cache DNS scadevano, alcuni servizi non riuscirono più a risolvere indirizzi interni.

Come follow-up GitHub dichiarò safeguard per preservare l'ultima configurazione valida, rifiutare dati incompleti e prevenire large destructive change.

Fonte primaria:

- [GitHub Availability Report — July 2026](https://github.blog/news-insights/company-news/github-availability-report-july-2026/)

La lezione per ESI non è copiare l'implementazione di GitHub.

È riconoscere che:

```text
DNS/configuration plane
```

può diventare un failure domain critico anche quando i workload compute e database sono nominalmente sani.

## Deployment failure

Un bad deployment è uno dei failure più comuni e più sotto il nostro controllo.

Per Order Operations la reliability architecture deve quindi includere progressivamente:

```text
immutable/reproducible artifact
staged deployment
health validation
rollback path
migration compatibility
```

Il cloud provider non può sapere se la nuova versione del nostro codice interpreta correttamente `PaymentEscalation`.

Questa parte resta responsabilità del workload team.

## Redundancy matrix

| Component | Current protection | Failure covered | Not covered |
|---|---|---|---|
| App Service | >=2 + zone redundancy | instance/zone | bad deploy, region |
| PostgreSQL | zone-redundant HA | node/zone | logical corruption, region |
| PostgreSQL backup | PITR | logical/data recovery | immediate continuity |
| Service Bus | zonal service redundancy | broker/zone | regional continuity unless configured |
| Outbox | local durable intent | publish gap | source DB regional loss beyond RPO |
| IaC | versioned Bicep | rebuild intent | wrong IaC deployed everywhere |
| Entra | managed platform dependency | provider responsibility + token semantics | application bypass not allowed |
| Private DNS | platform-managed design | normal private resolution | bad config/control-plane failure |

La tabella rende visibile una cosa:

> **Ogni controllo di reliability copre un insieme finito di failure.**

## Cost increase del Capitolo 14

Le decisioni nuove aumentano il costo production:

```text
App Service capacity >= 2
+ zone-capable Premium plan
+ PostgreSQL zone-redundant HA
```

Finance/FinOps deve vederlo.

La giustificazione è:

```text
SLO core journey
+ RTO intra-region <= 15 min
+ RPO 0 per committed local business state
```

Se i target cambiano, anche il costo deve poter cambiare.

## Che cosa non compriamo

Ancora niente:

```text
active-active multi-region
geo-replicated App Service architecture
multi-region PostgreSQL write topology
Service Bus Geo-Replication
global traffic manager
```

La ragione è il fit con i target attuali.

## Reliability backlog

Restano da chiudere:

- region concreta;
- restore retention finale;
- health check path;
- autoscale/headroom policy;
- deployment slot/canary strategy;
- concrete SLO measurement queries;
- disaster-recovery procedure;
- recovery environment parameters;
- synthetic journeys;
- alert routing.

Il prossimo Capitolo 15 — Observability trasformerà molti di questi elementi in signal e alert verificabili.

## Corollario

Il cloud può offrire redundancy.

L'architettura deve ancora decidere **quale failure quella redundancy sta pagando**.