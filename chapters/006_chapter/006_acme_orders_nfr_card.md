## Acme Orders — la qualità diventa una scelta esplicita

> **Caso simulato/composito.** Acme Orders è un caso didattico. Numeri, vincoli e circostanze sono inventati per mostrare il metodo.

Finora abbiamo chiarito il problema, individuato i confini e registrato una prima decisione architetturale.

Adesso possiamo smettere di dire genericamente che Acme Orders deve essere “veloce, affidabile e scalabile”.

Dobbiamo decidere che cosa queste parole significhino per il prodotto che stiamo costruendo.

### Critical journeys

Per questa iterazione consideriamo tre percorsi principali:

1. l'operatore consulta un ordine;
2. l'operatore modifica un'informazione consentita;
3. il sistema registra un nuovo ordine.

Il lookup è importante perché viene usato continuamente dal supporto clienti.

La creazione ordine è più critica dal punto di vista della correctness.

Un report amministrativo mensile esiste, ma non è un critical journey.

Questa differenza ci impedisce di applicare gli stessi target a tutto.

### Non-Functional Requirements Card — Acme Orders v1

```markdown
# Non-Functional Requirements Card — Acme Orders v1

## Critical journeys
- consultazione ordine da parte dell'operatore;
- creazione ordine;
- modifica controllata di dati ordine.

## Latency
- GET /orders/{id}: p95 < 300 ms nel carico previsto;
- p99 < 800 ms fino allo stress target.

## Throughput and capacity
- carico medio attuale: 20 req/s;
- picco attuale: 70 req/s;
- stima a 12 mesi: 150 req/s;
- stress target del lookup: 500 req/s.

## Availability
- consultazione ordine: 99,9% mensile come obiettivo iniziale;
- report amministrativi esclusi dal target critico.

## Consistency
- dopo una modifica confermata, il lookup deve riflettere il nuovo stato immediatamente nel percorso corrente;
- eventuali viste derivate future potranno avere freshness separata.

## Durability
- un ordine confermato non deve essere perso a seguito di failure di un singolo nodo.

## Recovery
- RTO critical lookup: 60 minuti;
- RPO dati ordini: 5 minuti come massimo iniziale da validare con il business.

## Security and privacy
- tenant isolation obbligatoria;
- accesso operatore autorizzato e auditabile;
- nessun accesso diretto cross-tenant tramite API o query applicative.

## Operability
- deployment ripetibile;
- rollback documentato;
- metriche e log sufficienti a distinguere errore applicativo da dipendenza lenta;
- restore testabile senza conoscenza tribale di una singola persona.

## Maintainability and changeability
- Orders mantiene ownership del proprio stato;
- cambiamenti a Payments o Shipping non devono richiedere accesso diretto alle tabelle Orders;
- il provider infrastrutturale del lookup non deve diventare parte del modello di dominio.

## Cost constraints
- nessun requisito attuale giustifica infrastruttura multi-region active-active;
- il costo operativo deve rimanere compatibile con un piccolo team.

## Growth assumptions
- non progettiamo per 100.000 req/s;
- rivalutare l'architettura oltre 300 req/s sostenute o 500 req/s di picco ripetuto.

## Quality priorities
1. correctness;
2. tenant isolation;
3. availability del lookup;
4. operability;
5. latency;
6. cost.

## Explicit non-goals
- RPO zero;
- active-active multi-region;
- deploy indipendente di ogni dominio;
- analytics real-time;
- sub-50-ms latency.

## Verification method
- integration test di tenant isolation;
- load test del lookup;
- restore drill;
- synthetic check del critical journey;
- review periodica dei costi.

## Review triggers
- crescita del traffico oltre le soglie;
- SLA enterprise più severi;
- nuovo requisito geografico;
- incidenti ricorrenti sul database operativo;
- costo del downtime rivalutato dal business.
```

La card non è “la verità”.

È una prima decisione esplicita e revisionabile.

### Il numero perfetto non esiste

Alcuni numeri sopra sono necessariamente ipotesi iniziali.

Per esempio, 300 ms potrebbe rivelarsi troppo severo o troppo permissivo.

RPO di cinque minuti potrebbe essere incompatibile con il valore economico degli ordini.

La parte importante è non nascondere l'incertezza.

Possiamo scrivere:

```text
RPO iniziale: 5 minuti
confidence: bassa
owner validazione: product/business
review entro: prossima milestone
```

Questo è più professionale di inventare precisione.

### Cosa cambia rispetto al capitolo precedente

Nel Capitolo 4 abbiamo deciso di non introdurre ancora un read model asincrono.

Ora possiamo verificare se quella scelta continua ad avere fit.

Il lookup live deve sostenere:

```text
p95 < 300 ms
fino al carico previsto
con availability target dichiarato
```

Se il database operativo riesce a farlo senza introdurre rischio eccessivo, la scelta rimane sensata.

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

Se il lookup è già a 90 ms al p95 e il database usa il 15% della capacità, Redis potrebbe non risolvere alcun problema attuale significativo.

In compenso introdurrebbe:

- invalidazione;
- stale data;
- nuova infrastruttura;
- nuovi failure mode;
- nuovi costi;
- tenant isolation da verificare anche nel caching layer.

Quindi, per questa iterazione, potremmo decidere:

> **Nessuna cache distribuita finché un requisito misurato non ne giustifica il costo.**

Questa non è una posizione contro Redis.

È una posizione a favore del fit.

### La seconda tecnologia che non scegliamo

Qualcuno propone active-active multi-region.

La motivazione è:

> “Così siamo enterprise-ready.”

La card dice invece:

```text
availability target iniziale: 99,9%
RTO: 60 minuti
RPO: 5 minuti
team: piccolo
```

Un'architettura active-active potrebbe migliorare alcune proprietà.

Ma introduce anche enorme complessità su:

- consistency;
- data replication;
- routing;
- deployment;
- incident response;
- test;
- costo.

Non abbiamo ancora un requisito che renda necessario quel prezzo.

Quindi non la scegliamo.

### La tecnologia giusta potrebbe cambiare

Tra due anni Acme Orders potrebbe avere:

- centinaia di tenant enterprise;
- SLA contrattuali severi;
- presenza globale;
- milioni di ordini al giorno;
- costi di downtime molto più elevati.

La stessa scelta che oggi sarebbe overengineering potrebbe allora diventare insufficiente.

Non c'è contraddizione.

È esattamente ciò che significa progettare rispetto al contesto.

> **Una buona decisione architetturale non deve essere eterna. Deve essere corretta abbastanza per il contesto in cui viene presa e abbastanza esplicita da sapere quando rivederla.**
