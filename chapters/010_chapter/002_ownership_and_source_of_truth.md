## Ownership: chi possiede il significato

Una delle frasi più pericolose in un sistema enterprise è:

> “Quel dato è nel database.”

È tecnicamente vera e architetturalmente insufficiente.

Essere memorizzato da qualche parte non significa essere posseduto da quel componente.

Un sistema può leggere, copiare, indicizzare, aggregare o mostrare un dato senza possederne il significato.

La domanda corretta è:

> **chi ha il diritto di decidere che cosa significa questo dato e quali transizioni sono valide?**

## Storage ownership e semantic ownership

Supponiamo che Order Operations salvi localmente:

```text
order_id
payment_status
shipment_status
problem_category
last_updated_at
```

Da un punto di vista fisico, Order Operations possiede quelle righe.

Da un punto di vista semantico, la situazione può essere diversa:

```text
order lifecycle       → Orders
payment lifecycle     → Payments
shipment lifecycle    → Shipping
problem classification → Order Operations
```

Questo significa che Order Operations può possedere la classificazione `problem_category`, perché è una interpretazione operativa costruita per il proprio journey.

Non dovrebbe però inventare una nuova semantica per `payment_status`.

Se Payments dice `Authorized`, Order Operations può tradurre o rappresentare quello stato, ma non dovrebbe decidere autonomamente che un pagamento autorizzato equivale a `Paid`.

Questa è una differenza di ownership, non di schema.

## Source of truth non significa “un solo database”

La frase *single source of truth* viene spesso usata male.

Non significa necessariamente che ogni consumer debba leggere sempre la stessa tabella live.

Può significare invece che per una certa decisione esiste **una sola autorità semantica**.

Possiamo avere:

```text
Payments authoritative store
        ↓
    events/API
        ↓
Order Operations projection
        ↓
Operations UI
```

La projection contiene una copia.

Ma se esiste una divergenza, l'autorità resta Payments.

Il consumer deve sapere che la propria rappresentazione è derivata.

Questa distinzione diventa essenziale quando introduciamo:

- cache;
- read model;
- search index;
- replica;
- data warehouse;
- data lake;
- materialized view;
- mobile offline store;
- dataset per AI.

Senza una ownership esplicita, ogni copia può lentamente diventare un secondo sistema autorevole.

## Il problema del database condiviso

Un database condiviso non è automaticamente un anti-pattern.

Nel nostro modular monolith può essere una scelta perfettamente ragionevole.

Il problema nasce quando l'accesso fisico sostituisce il contratto semantico.

Per esempio:

```sql
SELECT *
FROM payments.payments p
JOIN orders.orders o ON ...
JOIN shipping.shipments s ON ...;
```

può essere tecnicamente efficace.

Ma dobbiamo chiederci:

- Order Operations conosce dettagli interni dei tre domini?
- una migration di Payments rompe consumer invisibili?
- chi garantisce che il join mantenga il significato corretto?
- la query bypassa authorization o invarianti del dominio?
- qualcuno può modificare direttamente una tabella che non possiede?

La query non è sbagliata perché contiene una `JOIN`.

È sbagliata quando crea ownership implicita.

## Data contract interno

Per ridurre questa ambiguità possiamo trattare alcuni confini dati come contratti.

Un modulo può pubblicare:

```text
PaymentOperationalSnapshot
- paymentId
- orderId
- status
- lastChangedAt
```

senza esporre:

```text
provider_payload
retry_counter
provider_status_code
internal_lock_version
```

La prima struttura descrive una promessa semantica.

La seconda espone dettagli che appartengono all'implementazione.

Questo principio è coerente con quanto abbiamo già fatto con le API: il contratto modella significato, non la forma accidentale del datastore.

## Dato autorevole, derivato e osservato

Una Data Ownership Map utile dovrebbe distinguere almeno tre categorie.

### Authoritative

Il componente può:

- creare o modificare il dato secondo le regole del dominio;
- definire la sua semantica;
- dichiarare le transizioni valide.

### Derived

Il dato viene calcolato o copiato da una fonte autorevole.

Esempi:

- `problem_category` derivata da più stati;
- search document;
- reporting aggregate;
- cache entry;
- operational read model.

### Observed / external

Il sistema riceve un'informazione da una fonte che non controlla completamente.

Per esempio:

```text
carrier tracking status
payment provider response
exchange rate
identity claim
```

Il nostro sistema può normalizzare il dato, ma deve riconoscere che una parte della verità nasce fuori dal proprio boundary.

## Dato derivato non significa dato sacrificabile

Un errore comune è pensare:

> “È derivato, quindi se si rompe lo rigeneriamo.”

Forse.

Ma prima dobbiamo sapere:

- abbiamo ancora tutti gli input necessari?
- possiamo ricostruirlo entro il nostro RTO?
- la ricostruzione produce esattamente la stessa semantica?
- le regole di derivazione sono versionate?
- quanto costa il replay?
- che cosa vede l'utente mentre il rebuild è in corso?

Un read model può essere non autorevole ma comunque essenziale per l'operatività.

La sua perdita potrebbe non causare perdita di business data, ma potrebbe bloccare il customer support per ore.

È un failure mode reale.

## Ownership e organizzazione

La data ownership ha anche una dimensione organizzativa.

Se tre team possono modificare liberamente la stessa semantica, il problema non viene risolto da uno schema database più elegante.

Un owner deve essere in grado di rispondere almeno a:

- quali regole governano il dato?
- chi approva una modifica incompatibile?
- quali consumer dipendono dal contratto?
- quali requisiti di retention esistono?
- come vengono gestiti accesso e audit?
- qual è la procedura di recovery?

Questo non significa che una sola persona debba conoscere tutto.

Significa che la responsabilità non può essere anonima.

## ESI: una vista, più autorità

Nel nostro capstone la prima mappa concettuale è:

```text
Orders
  owns → order lifecycle, commercial status

Payments & Risk
  owns → payment lifecycle, refund, economic idempotency

Shipping
  owns → fulfillment/shipment lifecycle

Order Operations
  owns → operational assignment, problem classification,
         investigation metadata
```

Order Operations vuole mostrare una vista unica.

Questo non gli trasferisce la proprietà di tutto ciò che mostra.

La regola sarà:

> **aggregare è una capability; possedere il significato è una responsabilità.**

## La domanda che smaschera il problema

Quando non sappiamo chi possiede un dato, possiamo usare un test semplice:

> Se due componenti non sono d'accordo sul valore, **chi ha il diritto di correggere l'altro?**

Se la risposta è “dipende da chi ha scritto per ultimo”, non abbiamo una source of truth.

Abbiamo soltanto due copie in competizione.

Ed è proprio questo che la Data Ownership Map dovrà impedire.