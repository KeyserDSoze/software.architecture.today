# Fault isolation, capacity e cascading failure

Un sistema affidabile non è quello in cui nulla si rompe.

È quello in cui un failure ha difficoltà a diventare **tutti i failure contemporaneamente**.

## Cascading failure

Una failure cascade nasce quando una parte degradata produce pressione aggiuntiva su altre parti.

Scenario classico:

```text
dependency latency ↑
→ request duration ↑
→ concurrency ↑
→ connection pool saturation
→ timeout ↑
→ retry ↑
→ effective traffic ↑
→ dependency pressure ↑
```

Il failure si autoalimenta.

AWS Builders' Library e Azure Well-Architected insistono entrambi sulla necessità di limitare retry, evitare overload e proteggere il sistema dalla propagazione di failure.

Fonti:

- [AWS Well-Architected — Control and limit retry calls](https://docs.aws.amazon.com/wellarchitected/latest/framework/rel_mitigate_interaction_failure_limit_retries.html)
- [Microsoft Learn — Reliability design patterns](https://learn.microsoft.com/azure/well-architected/reliability/design-patterns)

## Capacity è parte della reliability

Spesso capacity viene trattata come performance.

Ma quando la capacity finisce, il problema diventa reliability.

Dobbiamo conoscere almeno:

```text
steady-state load
peak load
headroom
saturation point
recovery load
```

Il punto `recovery load` è particolarmente importante.

Dopo un outage possiamo avere:

- backlog da drenare;
- cache fredde;
- client che ritentano;
- job rimasti indietro;
- connessioni che si ristabiliscono insieme;
- operatori che ripetono manualmente azioni.

Un sistema che ha capacità sufficiente nello steady state può collassare durante il recovery.

## Queue ≠ capacity

Dal Capitolo 11 abbiamo una Service Bus Queue.

La queue ci consente di assorbire temporaneamente una differenza fra producer e consumer.

Ma:

> **Una queue trasforma overload immediato in backlog. Non crea capacità downstream.**

Se:

```text
arrival rate > processing rate
```

per abbastanza tempo:

```text
queue depth ↑
queue age ↑
business delivery latency ↑
```

La reliability policy deve decidere quando il backlog è ancora accettabile e quando il flow è `Degraded` o `Unhealthy`.

## Retry budget

Ogni retry usa capacità.

Per questo il retry deve essere bounded.

Domande minime:

```text
quale errore è transient?
chi ritenta?
quante volte?
con quale backoff?
con quale jitter?
quanto tempo totale?
che cosa succede quando il budget finisce?
```

Il Capitolo 11 ha già definito stable identity e retry limitati per il publisher.

Il Capitolo 14 aggiunge una domanda:

> **Quanta capacità siamo disposti a consumare per recuperare un'operazione prima di proteggere il resto del sistema?**

## Circuit breaker

Un circuit breaker interrompe temporaneamente chiamate verso una dipendenza che sta fallendo abbastanza da rendere controproducente continuare a insistere.

Pattern concettuale:

```text
Closed
→ failures threshold
→ Open
→ cool-down
→ Half-Open
→ probe
→ Closed / Open
```

Il beneficio non è "far tornare la dipendenza".

È:

- fallire velocemente;
- evitare consumo inutile di risorse;
- limitare traffic amplification;
- rendere disponibile un degraded path quando esiste.

Microsoft raccomanda circuit breaker quando retry continui rischiano di aumentare pressione su failure più persistenti.

Fonte:

- [Microsoft Learn — Mission-critical application design](https://learn.microsoft.com/azure/well-architected/mission-critical/mission-critical-application-design)

## Non ogni dependency vuole un circuit breaker

Aggiungerlo a ogni chiamata può introdurre:

- stato distribuito aggiuntivo;
- soglie difficili da tarare;
- recovery delay;
- debugging più complesso;
- falsi open circuit.

Per Order Operations può essere candidato sulle dependency live di lettura se misure reali mostrano che failure persistenti creano cascading pressure.

Non lo implementiamo soltanto perché esiste il pattern.

## Bulkhead

Il Bulkhead pattern separa risorse affinché la saturazione di un workload non consumi tutto.

Esempio futuro ESI:

```text
API request pool
≠
outbox publisher concurrency
```

Oggi App Service e WebJob condividono il lifecycle e parte della capacità.

Questa era una scelta consapevole del Capitolo 12.

Il trigger di revisione era proprio:

```text
background workload interferisce con API
```

Se osservassimo:

```text
publisher backlog recovery
→ CPU saturation
→ operator API latency SLO violation
```

avremmo evidence per separare capacity o compute.

Questa sarebbe una estrazione guidata da reliability, non da moda.

## Fault domain

Un fault domain è l'insieme delle parti che possono fallire insieme a causa della stessa dipendenza o causa comune.

Esempi:

- stessa VM;
- stessa availability zone;
- stesso database cluster;
- stessa identity dependency;
- stessa configurazione distribuita globalmente;
- stessa credenziale;
- stessa pipeline;
- stessa regione.

La ridondanza ha valore soltanto se le copie non condividono il failure che vogliamo tollerare.

> **Due copie dello stesso errore non sono alta disponibilità.**

## Common-mode failure

Possiamo avere tre istanze applicative.

Ma se tutte ricevono:

```text
config sbagliata
```

abbiamo tre istanze che falliscono insieme.

Possiamo avere due database node.

Ma se un comando applicativo corrompe logicamente i dati e la replica replica correttamente la corruption:

```text
HA != recovery dalla corruption
```

Questo è il motivo per cui HA e backup risolvono failure diversi.

## Caso reale — GitHub, maggio 2026

Nel maggio 2026 GitHub ha documentato un incidente in cui una online schema migration su una tabella molto usata, combinata con l'aumento del traffico, saturò la capacità di connessione del database e produsse query contention e cascading timeout su servizi dipendenti.

GitHub dichiarò come follow-up:

- migrazioni più allineate alle finestre di minor traffico;
- dynamic throttling in base al load live;
- circuit breaker automatici sulle migration;
- monitoring anticipato di connection saturation, lock e write pressure.

Fonte primaria:

- [GitHub Availability Report — May 2026](https://github.blog/news-insights/company-news/github-availability-report-may-2026/)

Il caso è particolarmente utile perché mostra che:

```text
migration
```

non è soltanto un tema dati.

È un workload concorrente che compete per una capacity condivisa.

## Caso reale — Cloudflare 2020

Cloudflare ha documentato nel 2020 un configuration error nella propria backbone che fece convergere traffico verso Atlanta fino a sovraccaricare quel router e causare outage in più location.

La rete non collassò interamente: alcune location continuarono a funzionare.

Fra le mitigazioni introdotte Cloudflare citò limiti e modifiche di routing per impedire che una singola location attirasse nuovamente traffico in quel modo.

Fonte primaria:

- [Cloudflare — Outage on July 17, 2020](https://blog.cloudflare.com/cloudflare-outage-on-july-17-2020/)

La lezione non è "usate BGP prefix limit" in ogni software architecture.

È:

> **Quando una configurazione errata può concentrare il carico, il sistema deve avere un limite che impedisca alla concentrazione di diventare sistemica.**

## Redundancy

La ridondanza può esistere a diversi livelli:

```text
process
instance
zone
region
data copy
network path
operator skill
```

Ma ogni livello deve essere collegato a un failure mode.

Esempio:

```text
2 App Service instances
```

proteggono meglio da instance failure.

Se zone redundancy è configurata, possono proteggere anche da zone failure secondo le capability del servizio.

Non proteggono da:

- bad deployment distribuito a entrambe;
- auth policy sbagliata;
- bug applicativo;
- database corruption;
- region outage.

## Availability zone

Per App Service, Microsoft documenta che i piani supportati possono essere configurati zone-redundant con almeno due istanze; le istanze vengono distribuite tra availability zone quando la regione/scale unit lo supportano.

Fonte:

- [Microsoft Learn — Configure App Service plans for zone redundancy](https://learn.microsoft.com/azure/app-service/configure-zone-redundancy)

Per Order Operations questa capability diventa candidata concreta nel Capitolo 14.

Perché?

Perché oggi il prodotto è ancora single-region ma vuole ridurre il failure domain da:

```text
region
```

almeno a:

```text
zone
```

senza pagare immediatamente multi-region.

## Headroom

Capacity al 100% non è efficiente reliability.

Se una istanza viene persa e le altre non possono assorbire il traffico, abbiamo ridondanza nominale ma non sufficiente capacità di failover.

Dobbiamo quindi ragionare anche su:

```text
N instances healthy
→ load per instance

N-1 instances
→ load per remaining instance
```

Questo non significa sovradimensionare senza misura.

Significa rendere esplicito il failure scenario usato per capacity planning.

## Load shedding

Quando il sistema si avvicina alla saturazione possiamo preferire:

```text
rifiutare lavoro non critico presto
```

invece di:

```text
accettare tutto
→ diventare lento
→ fallire tutto
```

È una strategia di self-preservation.

Per ESI, eventuali export/report pesanti futuri dovranno avere priority diversa dal core operator journey.

## Retry storm da AI-generated client

Nell'era degli agenti compare anche un nuovo failure amplifier.

Un agente può generare rapidamente più client, worker e automation che condividono una stessa retry policy ingenua.

Esempio:

```text
10 agent-generated workers
× 5 retry immediati
```

Un failure transient diventa un burst artificiale.

La soluzione non è vietare la generazione.

È avere guardrail:

```text
shared retry policy
bounded concurrency
backoff+jitter
capacity budget
load test
architecture review
```

> **Quando l'execution costa poco, anche l'amplificazione di un errore costa poco da produrre.**

## Corollario

La fault isolation non serve a impedire al primo componente di fallire.

Serve a impedire che il primo componente decida quanti altri devono fallire con lui.