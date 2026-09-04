## Order Operations — la qualità diventa una scelta esplicita

> **Caso simulato/composito.** Order Operations è un prodotto fittizio di Example Software Industries S.p.A. I numeri di questa sezione, quando presenti, sono **requisiti simulati del caso**, non benchmark industriali né misurazioni di sistemi reali.

Finora abbiamo chiarito il problema, individuato i confini e registrato una prima decisione architetturale.

Adesso possiamo smettere di dire genericamente che Order Operations deve essere “veloce, affidabile e scalabile”.

Dobbiamo decidere che cosa queste parole significhino per il prodotto che stiamo costruendo.

### Critical journeys

Per questa iterazione consideriamo due percorsi principali:

1. l'operatore consulta la lista degli ordini problematici;
2. l'operatore apre il dettaglio operativo di un ordine.

In futuro potranno esistere action workflow, ma non sono ancora parte del critical journey autorizzato.

Un report amministrativo mensile può esistere, ma non ha necessariamente lo stesso livello di criticità.

Questa differenza ci impedisce di applicare gli stessi target a tutto.

### Prima di inventare numeri

Il team vorrebbe scrivere:

> “La pagina deve essere veloce.”

Non basta.

Ma anche sostituirlo immediatamente con:

> “p95 sotto 200 ms”

senza sapere perché, sarebbe falsa precisione.

Per il capstone useremo due tipi di numero.

**Requirement simulato**

Un numero deciso nello scenario ESI per esercitare il metodo.

**Measurement del capstone**

Un numero che arriverà quando Order Operations avrà codice, workload e ambiente eseguibile.

Non confonderemo i due.

### Non-Functional Requirements Card — Order Operations v1

Supponiamo che Product, Operations, Platform e Finance abbiano concordato questi target iniziali simulati:

```markdown
# Non-Functional Requirements Card — Order Operations v1

## Critical journeys
- lista ordini problematici;
- dettaglio operativo dell'ordine.

## Latency — requisito simulato
- lista: p95 < 500 ms nel workload previsto;
- dettaglio: p95 < 400 ms nel workload previsto.

## Capacity — assunzione simulata
- workload iniziale modesto;
- crescita da misurare prima di introdurre caching o partitioning dedicato;
- stress test richiesto prima del rollout esteso.

## Availability — requisito simulato
- obiettivo iniziale coerente con uno strumento operativo interno;
- nessun requisito corrente di active-active multi-region.

## Consistency
- lo stato mostrato deve essere sufficientemente fresco da non indurre decisioni operative errate;
- quando un dato non è live o è potenzialmente stale, la sua freshness deve essere rappresentabile.

## Durability
- Order Operations non deve introdurre perdita di dati autorevoli appartenenti ai domini Orders, Payments o Shipping.

## Recovery
- RTO e RPO devono essere quantificati prima della production readiness;
- per ora sono open requirement, non numeri inventati.

## Security and privacy
- accesso autenticato;
- authorization coerente con il ruolo dell'operatore;
- nessun dato fuori dal perimetro autorizzato;
- nessun dettaglio infrastrutturale sensibile esposto alla UI.

## Operability
- deployment ripetibile;
- rollback documentato;
- metriche e log sufficienti a distinguere errore applicativo da dipendenza lenta;
- failure parziali delle fonti dati devono essere diagnosticabili.

## Maintainability and changeability
- Orders, Payments e Shipping mantengono ownership dei propri stati;
- il provider infrastrutturale non entra nel modello di dominio;
- la classificazione operativa rimane separata dagli stati autorevoli.

## Cost constraints
- nessun requisito attuale giustifica active-active multi-region;
- nessun requisito attuale giustifica una cache distribuita dedicata;
- la soluzione deve essere operabile dal team senza creare una piattaforma parallela.

## Quality priorities
1. correctness;
2. authorization e data isolation;
3. operability;
4. latency del journey operativo;
5. availability coerente con il bisogno;
6. cost.

## Explicit non-goals
- RPO zero dichiarato senza business case;
- active-active multi-region;
- analytics real-time;
- sub-50-ms latency;
- microservizi per ogni boundary.

## Verification method
- integration test di authorization;
- test sulle combinazioni di stato;
- load test del critical journey;
- synthetic check quando esisterà l'ambiente;
- review periodica dei costi;
- restore drill quando il prodotto possiederà dati persistenti propri.

## Review triggers
- crescita del traffico oltre il workload previsto;
- SLA enterprise più severi;
- nuovo requisito geografico;
- incidenti ricorrenti sul percorso live;
- costo del downtime rivalutato dal business.
```

La card non è “la verità”.

È una prima decisione esplicita e revisionabile.

### Il numero perfetto non esiste

I numeri di latency sopra sono requisiti simulati.

Potrebbero rivelarsi troppo severi o troppo permissivi quando avremo un prototipo misurabile e feedback dagli operatori.

La parte importante è non nascondere l'incertezza.

Possiamo scrivere:

```text
latency target iniziale: 500 ms p95
origine: requisito simulato ESI
confidence: media
validazione: usability + load test
review: dopo primo workload rappresentativo
```

Questo è più professionale di presentare un numero come legge universale.

### Cosa cambia rispetto al capitolo precedente

Nel Capitolo 4 abbiamo deciso di non introdurre ancora un read model asincrono.

Ora possiamo verificare se quella scelta continua ad avere fit.

Il lookup live deve sostenere i target del journey:

```text
latency accettabile
+ correctness
+ availability richiesta
+ operability
+ cost
```

Se il percorso live riesce a farlo senza introdurre rischio eccessivo, la scelta rimane sensata.

Se non ci riesce, abbiamo un motivo concreto per rivalutarla.

Non perché “CQRS è più moderno”.

Non perché “una cache è sempre utile”.

Ma perché una proprietà richiesta non viene più soddisfatta bene.

### La prima tecnologia che non scegliamo

Consideriamo una proposta:

> “Mettiamo Redis davanti al lookup.”

Potrebbe essere una buona idea.

Ma la NFR Card ci obbliga a fare domande.

Per quale problema?

Latency?

Database load?

Availability?

Se le misure future mostrassero che il lookup rispetta ampiamente i target e il carico è trascurabile, Redis potrebbe non risolvere alcun problema significativo.

In compenso introdurrebbe invalidazione e stale data, nuova infrastruttura e nuovi failure mode, nuovi costi e la necessità di verificare authorization e isolation anche nel caching layer.

Quindi, per questa iterazione:

> **Nessuna cache distribuita finché un requisito misurato non ne giustifica il costo.**

Questa non è una posizione contro Redis.

È una posizione a favore del fit.

### La seconda tecnologia che non scegliamo

Qualcuno propone active-active multi-region.

La motivazione è:

> “Così siamo enterprise-ready.”

La card non contiene però un requisito che giustifichi quel prezzo.

Un'architettura active-active potrebbe migliorare alcune proprietà.

Ma introduce anche complessità su consistency e data replication, routing e deployment, incident response, test e costo. Non abbiamo ancora un requisito che renda necessario pagarlo.

Quindi non la scegliamo.

### Il contrasto aziendale

Platform Engineering propone standardizzazione e semplicità.

Operations vuole ridurre downtime e dipendenze lente.

Finance vuole evitare infrastruttura costosa senza ritorno misurabile.

Product non vuole che il lavoro architetturale rallenti la capability.

Security pretende che authorization e data isolation non vengano trattate come leve negoziabili.

Non esiste una soluzione che massimizza tutto gratuitamente.

### Il compromesso del capitolo

**Esigenza**

Costruire un prodotto sufficientemente veloce e affidabile per il lavoro operativo.

**Tensione**

Massimizzare performance e availability contro costo, semplicità e capacità operativa del team.

**Decisione**

Partiamo con la soluzione più semplice che può soddisfare i target e rimandiamo Redis, active-active e altra infrastruttura finché esiste un requisito misurabile.

**Costo accettato**

Non massimizziamo availability geografica, isolamento del workload o latency minima teorica.

**Quality floor**

Correctness, authorization, tracciabilità verso i dati autorevoli e operability non vengono sacrificate per risparmiare.

**Guardrail**

NFR Card, load test, metriche, review trigger e production-readiness gate.

> **Fit before fashion non significa cheapest possible. Significa pagare per le proprietà che servono davvero e proteggere quelle che non possiamo perdere.**

### Evidenze metodologiche

Il metodo di partire dai workload/business requirement e valutare trade-off è coerente con:

- [Microsoft Learn — Azure Application Architecture Fundamentals](https://learn.microsoft.com/azure/architecture/guide/)
- [Microsoft Learn — Design Principles for Azure Applications](https://learn.microsoft.com/azure/architecture/guide/design-principles/)
- [AWS Well-Architected Framework](https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html)
- [AWS Well-Architected — Evaluate trade-offs](https://docs.aws.amazon.com/wellarchitected/latest/performance-efficiency-pillar/perf_architecture_evaluate_trade_offs.html)

Queste fonti sostengono il metodo. Non sostengono i numeri simulati di ESI.

### La tecnologia giusta potrebbe cambiare

Tra due anni Order Operations potrebbe avere clienti enterprise con SLA severi e presenza globale, milioni di eventi al giorno e costi di downtime molto più elevati. Potrebbero comparire requisiti di data residency o nuovi consumer mobile e partner. La stessa scelta che oggi sarebbe overengineering potrebbe allora diventare insufficiente.

Non c'è contraddizione.

È esattamente ciò che significa progettare rispetto al contesto.

> **Una buona decisione architetturale non deve essere eterna. Deve essere corretta abbastanza per il contesto in cui viene presa e abbastanza esplicita da sapere quando rivederla.**