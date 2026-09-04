## ESI — Order Operations: la prima Data Ownership Map

Finora abbiamo ragionato sui dati in astratto. Ora torniamo dentro ESI e rendiamo il modello operativo.

Order Operations deve presentare una vista unificata degli ordini problematici, ma la semplicità della UI non deve trasformarsi in un nuovo database che lentamente diventa proprietario accidentale di tutto. Il journey aggrega informazioni; l’ownership continua a rimanere distribuita tra le capability che ne possiedono il significato.

Il journey corrente è:

```text
Operations operator
→ apre la coda
→ vede ordini problematici
→ apre il dettaglio
→ comprende ordine / pagamento / spedizione
→ decide se agire, attendere o escalare
```

Per servirlo incontriamo `Order`, `Payment`, `Shipment`, `OperationalCase`, `ProblemClassification`, `OperatorAssignment`, audit e tenant/access scope. Sono concetti vicini nel journey, ma non appartengono tutti allo stesso owner.

## La mappa di ownership

Questa è la baseline che il Capitolo 10 stabilisce. Il file vivo del capstone continuerà a evolvere nei capitoli successivi; in particolare, dal Capitolo 11 compariranno Payment Escalation e outbox. La mappa qui sotto rappresenta quindi **ciò che sappiamo e decidiamo in questo punto della narrazione**, non un tentativo di riportare indietro lo snapshot cumulativo del repository.

### Orders

Orders rimane autorevole su `Order`, `OrderId`, lifecycle commerciale, status commerciale, tenant ownership e timestamp di business. Order Operations può consumare `orderId`, stato commerciale, tenant e timestamp rilevanti, ma non acquisisce il diritto di ridefinire cancellation policy o transizioni dell’ordine.

### Payments & Risk

Payments & Risk rimane autorevole su `Payment`, `PaymentStatus`, refund, provider reference, lifecycle economico e idempotenza economica. Order Operations può mostrare uno stato operativo normalizzato e l’ultimo aggiornamento rilevante, ma non diventa owner di refund semantics, reconciliation o financial correctness.

### Shipping

Shipping possiede fulfillment lifecycle, shipment state, tracking relation e carrier integration state. Order Operations consuma ciò che serve all’investigazione, senza trasformare il proprio modello operativo in una seconda fonte di verità sul fulfillment.

### Order Operations

Order Operations possiede invece i concetti che esistono per il lavoro Operations: `OperationalCase`, `ProblemClassification`, `OperatorAssignment` e gli altri metadati operativi che verranno introdotti esplicitamente. Questi non sono copie dei domini sorgente: sono responsabilità nuove e locali.

Le viste come `ProblematicOrderView`, `problem_category`, `case_age`, `last_relevant_update` e il combined operational summary sono invece **derived**. Devono poter dichiarare origine, freshness e regola di derivazione.

## La topologia iniziale resta semplice

Per ora manteniamo una singola istanza PostgreSQL con ownership logica distinta:

```text
PostgreSQL instance

orders schema
  owned by Orders

payments schema
  owned by Payments & Risk

shipping schema
  owned by Shipping

operations schema
  owned by Order Operations
```

La condivisione fisica dell’istanza non autorizza ogni modulo a leggere o modificare tutto. Le regole architetturali continuano a proteggere i confini, perché la possibilità tecnica di accedere a una tabella non coincide con il diritto semantico di usarla come contratto.

## Il compromesso ESI del Capitolo 10

Operations vuole una lista rapida e semplice senza interrogare manualmente tre sistemi. Payments & Risk vuole evitare che una copia locale diventi la fonte economica. Commerce & Operations vuole evitare che il workload operativo danneggi il percorso transazionale. Platform Engineering, infine, non vuole introdurre pipeline, cache e datastore aggiuntivi senza un requisito misurabile.

La decisione è quindi proporzionata al contesto: PostgreSQL resta il datastore operativo principale; ogni capability mantiene ownership del proprio significato; Order Operations persiste soltanto concetti che possiede davvero; la vista può aggregare dati autorevoli tramite boundary espliciti. Redis, search cluster e read model asincrono rimangono fuori finché non esiste evidence che ne paghi il costo.

Accettiamo che il journey resti più dipendente dal percorso live di quanto sarebbe con una projection autonoma. In cambio evitiamo di introdurre oggi propagation, reconciliation, rebuild e una seconda infrastruttura operativa.

Il quality floor non cambia: una sola autorità semantica per ogni business fact, tenant isolation, correctness di Orders/Payments/Shipping, atomicità dell’assignment locale, audit quando arriveranno side effect e capacità di ricondurre ogni dato derivato alla propria source.

## Guardrail e trigger

La Data Ownership Map è il guardrail principale. A questa aggiungiamo architecture rule contro accessi cross-owner non autorizzati, index progettati su query misurate e, se un giorno comparirà una projection, timestamp di source/freshness e validation query per backfill e reconciliation.

Riapriremo la decisione se le query operative inizieranno a degradare materialmente il workload transazionale, se i target di latency non saranno raggiungibili con query/index ragionevoli, se Order Operations richiederà availability indipendente, se più consumer inizieranno a dipendere dalla stessa vista aggregata o se full-text search, volume, retention e freshness renderanno una rappresentazione derivata chiaramente più conveniente.

## Primo schema locale realmente posseduto

A questo punto possiamo introdurre concettualmente una tabella che appartiene davvero a Order Operations:

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

Non è uno script production-ready. Restano da decidere identifier strategy, foreign key cross-boundary, rappresentazione degli enum, retention, audit, tenancy enforcement, index definitivi e migration tooling. Il libro non spaccia un frammento SQL per un’architettura completa.

Gli access pattern già noti rendono plausibili index come `tenant + detected_at` oppure `tenant + problem_category + detected_at`. Restano ipotesi da verificare, non regole automatiche.

## Perché non copiamo subito tutto

Potremmo aggiungere nella tabella Operations anche `order_status`, `payment_status`, `shipment_status`, customer name, amount e carrier. Sarebbe comodo nel brevissimo periodo. Ogni campo copiato, però, introduce una domanda su source, staleness, propagation, reconciliation e rebuild.

Per ora quel costo non è giustificato. Se in futuro arriverà una `ProblematicOrderProjection`, la Data Ownership Map avrà già fissato la regola:

```text
Orders / Payments / Shipping = authoritative
Order Operations projection = derived
```

Così l’evoluzione futura riguarderà il modo in cui propagare e verificare le copie, non la ridefinizione dell’autorità nel mezzo di un incidente di performance.

> **Prima definiamo chi possiede la verità. Poi decidiamo quante copie ci servono per servirla bene.**

Lo snapshot cumulativo vivo resta in:

```text
capstone/example-software-industries/products/order-operations/docs/data-ownership.md
```

Quel documento prosegue con il progetto oltre questo capitolo; il manoscritto conserva invece il reasoning e la baseline raggiunta qui.