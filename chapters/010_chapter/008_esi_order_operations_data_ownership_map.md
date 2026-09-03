## ESI — Order Operations: la prima Data Ownership Map

Finora abbiamo parlato di dati in astratto.

Adesso torniamo dentro ESI.

Order Operations deve mostrare una vista unica di ordini problematici, ma i dati necessari appartengono a più capability.

Il rischio è evidente:

> per rendere semplice la UI potremmo costruire un nuovo database che lentamente diventa proprietario accidentale di tutto.

Non lo faremo.

## Il contesto attuale

Il journey principale è:

```text
Operations operator
→ apre la coda
→ vede ordini problematici
→ apre il dettaglio
→ comprende ordine / pagamento / spedizione
→ decide se agire, attendere o escalare
```

Per servirlo ci servono almeno questi concetti:

```text
Order
Payment
Shipment
OperationalCase
ProblemClassification
OperatorAssignment
Audit
Tenant / access scope
```

Ma non appartengono tutti allo stesso owner.

## Data Ownership Map

### Orders

**Authoritative**

```text
Order
OrderId
Order lifecycle
Commercial order status
Tenant ownership of order
Order timestamps
```

**Espone a Order Operations**

```text
orderId
commercialStatus
tenantId
relevant timestamps
```

**Non trasferisce ownership di**

```text
order lifecycle rules
commercial transitions
cancellation policy
```

### Payments & Risk

**Authoritative**

```text
Payment
PaymentStatus
Refund
Payment provider reference
Economic idempotency
```

**Espone a Order Operations**

```text
orderId
operational payment status
last relevant update
```

**Non trasferisce ownership di**

```text
refund semantics
provider reconciliation
payment lifecycle
financial correctness
```

### Shipping

**Authoritative**

```text
Shipment
FulfillmentStatus
Tracking relation
Carrier integration state
```

**Espone a Order Operations**

```text
orderId
operational shipment status
last relevant update
```

### Order Operations

**Authoritative**

```text
OperationalCase
ProblemClassification
OperatorAssignment
Operational note, quando introdotta
Escalation metadata, quando definita
```

Questi concetti esistono per il lavoro Operations.

Non sono semplicemente copie dei domini sorgente.

### Derived in Order Operations

```text
ProblematicOrderView
problem_category
case_age
last_relevant_update
combined operational summary
```

Sono rappresentazioni costruite da dati autorevoli e dati locali.

Devono poter indicare:

- origine;
- freshness;
- regola di derivazione;
- timestamp rilevanti.

## Prima topologia dati

Per ora manteniamo il modello semplice:

```text
PostgreSQL instance

orders schema
  owned by Orders

payments schema
  owned by Payments

shipping schema
  owned by Shipping

operations schema
  owned by Order Operations
```

La singola istanza è una scelta infrastrutturale.

L'ownership rimane logica.

Il fatto che una query possa tecnicamente leggere ogni tabella non significa che ogni modulo sia autorizzato a farlo liberamente.

## Il compromesso ESI del Capitolo 10

### Esigenza

Operations vuole una lista rapida e semplice senza costringere l'operatore a interrogare tre sistemi.

### Tensione

```text
semplicità e performance della vista
vs
ownership dei domini
vs
complessità di sincronizzazione
vs
costo operativo di nuovi datastore
```

Payments & Risk vuole evitare che una copia locale diventi fonte economica.

Commerce & Operations vuole evitare query costose sul percorso transazionale.

Platform vuole evitare pipeline e store prematuri.

### Decisione

Per la prossima iterazione:

1. **PostgreSQL resta il datastore operativo principale**;
2. ogni dominio mantiene ownership logica del proprio schema/dato;
3. Order Operations introduce soltanto dati che possiede realmente (`OperationalCase`, assignment, classificazione);
4. la vista può aggregare dati autorevoli tramite boundary espliciti;
5. non introduciamo ancora Redis, search cluster o read model asincrono;
6. prepariamo però il contratto per una futura projection, distinguendo già dati authoritative e derived.

### Costo accettato

Il journey resta più dipendente dal percorso live di quanto sarebbe con una projection autonoma.

Alcune query aggregate possono richiedere ottimizzazione e index.

Non otteniamo ancora pieno isolamento del workload di lettura.

### Quality floor

Non siamo disposti a sacrificare:

- correctness di Order/Payment/Shipping semantics;
- tenant isolation;
- una sola autorità per ogni business fact;
- atomicità dell'assignment locale;
- capacità di ricondurre ogni dato derivato alla source;
- audit delle future operazioni con side effect;
- migration reversibili per quanto ragionevole.

### Guardrail

Introduciamo:

- Data Ownership Map versionata;
- architecture rule contro accessi cross-owner non autorizzati;
- indici progettati su query misurate;
- timestamp `source_updated_at` quando in futuro persisteremo projection;
- validation query per eventuali backfill;
- trigger espliciti prima di introdurre nuovi store.

### Trigger di revisione

Rivalutiamo la decisione se:

- le query operative impattano materialmente il workload transazionale;
- non raggiungiamo i target di latency con index/query design ragionevoli;
- Order Operations richiede availability indipendente dai domain store;
- emergono più consumer della stessa vista aggregata;
- la ricerca full-text diventa un critical access pattern;
- il volume rende necessario partitioning o data distribution;
- la freshness tollerata rende conveniente una projection asincrona;
- retention o audit impongono un lifecycle separato.

## Schema locale iniziale

Possiamo finalmente introdurre un primo schema che Order Operations possiede davvero.

Esempio concettuale:

```sql
CREATE TABLE operations.operational_case (
    id uuid PRIMARY KEY,
    tenant_id uuid NOT NULL,
    order_id varchar(64) NOT NULL,
    problem_category varchar(64) NOT NULL,
    assigned_to varchar(128),
    detected_at timestamptz NOT NULL,
    assigned_at timestamptz,
    updated_at timestamptz NOT NULL
);
```

Non è ancora uno script production-ready.

Mancano decisioni su:

- identifier strategy;
- foreign key tra boundary;
- enum/value representation;
- retention;
- audit model;
- index definitivi;
- tenancy enforcement;
- migration tooling.

Questo è intenzionale.

Il libro non deve spacciare un frammento SQL per architettura completa.

## Indici candidati

Dagli access pattern già noti possiamo formulare ipotesi.

Per esempio:

```text
tenant + detected_at
```

per la coda ordinata per anzianità.

Oppure:

```text
tenant + problem_category + detected_at
```

se il filtro per categoria è frequente.

Ma la decisione finale verrà presa quando avremo dati e query reali.

L'indice entra come ipotesi da misurare.

## Perché non salviamo tutto nella tabella operations

Potremmo aggiungere:

```text
order_status
payment_status
shipment_status
customer_name
payment_amount
carrier
```

Sarebbe comodo.

Ma ogni campo copiato introduce una domanda di sincronizzazione.

Prima di persisterlo dobbiamo sapere:

- serve davvero per un access pattern?
- quanto può essere stale?
- chi lo aggiorna?
- come viene riconciliato?
- come si comporta durante il rebuild?

Per ora il costo non è giustificato.

Questa è una scelta deliberata di semplicità.

## Il futuro read model

La Data Ownership Map rende però possibile una futura evoluzione pulita.

Potremo introdurre:

```text
operations.problematic_order_projection
```

con una regola chiara:

```text
Orders/Payments/Shipping = authoritative
Order Operations projection = derived
```

Il giorno in cui la projection arriverà, non dovremo discutere da zero chi possiede il significato.

Dovremo discutere soltanto come propagare e verificare le copie.

Questa è una forma concreta di architecture optionality.

> **Prima definiamo chi possiede la verità. Poi decidiamo quante copie ci servono per servirla bene.**