## Ownership: chi possiede il significato

Una delle frasi più pericolose in un sistema enterprise è: “Quel dato è nel database.” È tecnicamente vera e architetturalmente quasi inutile. Sapere dove un valore è memorizzato non ci dice chi possa cambiarne il significato, quali transizioni siano valide, chi debba correggere una divergenza né quali consumer dipendano da quella semantica.

Per questo la domanda più utile non è dove si trovi il dato, ma **chi abbia il diritto di dire che cosa significa**.

## Storage ownership e semantic ownership

Supponiamo che Order Operations salvi localmente `order_id`, `payment_status`, `shipment_status`, `problem_category` e `last_updated_at`. Dal punto di vista fisico quelle righe possono vivere nel suo schema. Dal punto di vista semantico, però, non hanno tutte lo stesso owner.

Il lifecycle commerciale dell’ordine appartiene a Orders; il lifecycle economico appartiene a Payments & Risk; il lifecycle di fulfillment appartiene a Shipping. `problem_category`, invece, può appartenere davvero a Order Operations perché rappresenta una classificazione costruita per il lavoro operativo.

Questa distinzione è fondamentale. Order Operations può copiare o normalizzare `payment_status`, ma non dovrebbe inventare autonomamente che cosa significhi `Authorized`, né trasformarlo in `Paid` perché rende più semplice la UI. Lo storage locale non trasferisce automaticamente autorità semantica.

## Source of truth non significa un solo database

La frase *single source of truth* viene spesso interpretata come “tutti leggono la stessa tabella live”. È una definizione troppo stretta. In molti sistemi possiamo avere una sola autorità semantica e numerose rappresentazioni fisiche.

```text
Payments authoritative store
        ↓
     API/eventi
        ↓
Order Operations projection
        ↓
Operations UI
```

La projection contiene una copia, ma in caso di divergenza Payments rimane l’autorità sul significato economico. Il consumer deve quindi sapere se sta leggendo un valore autorevole, derivato oppure semplicemente osservato da una fonte esterna.

Questa distinzione diventa inevitabile appena compaiono cache, read model, search index, replica, warehouse, data lake, mobile offline store o dataset destinati all’AI. Senza ownership esplicita ogni copia può lentamente trasformarsi in una seconda verità.

## Il database condiviso non elimina i confini

Nel modular monolith di Order Operations una singola istanza PostgreSQL può essere una scelta perfettamente ragionevole. Il problema nasce quando la possibilità tecnica di fare una `JOIN` viene interpretata come diritto semantico di conoscere e modificare tutto.

Una query che unisce tabelle di Orders, Payments e Shipping può anche essere efficiente. Ma prima dobbiamo capire se espone dettagli interni che cambieranno senza preavviso, se bypassa invarianti o authorization, se trasforma una migration locale in una breaking change per consumer invisibili e soprattutto chi garantisca che il significato del join sia corretto.

La `JOIN` non è il problema. Il problema è l’ownership implicita.

Per ridurla, un modulo può esporre un contratto dati intenzionale come:

```text
PaymentOperationalSnapshot
- paymentId
- orderId
- status
- lastChangedAt
```

senza rendere pubblici `provider_payload`, `provider_status_code`, `retry_counter` o dettagli di locking. È la stessa disciplina vista con le API: il contratto deve esporre significato utile al consumer, non la forma accidentale del datastore.

## Authoritative, derived, observed

Una Data Ownership Map utile deve distinguere almeno tre casi. Un dato **authoritative** può essere creato o modificato dall’owner secondo le regole del dominio. Un dato **derived** nasce invece da una trasformazione o da una copia di fonti autorevoli: può essere un `problem_category`, una materialized view, un search document o un read model. Un dato **observed/external** arriva da una fonte che il nostro sistema non controlla completamente, come uno stato del carrier, una risposta del payment provider o una identity claim.

La distinzione non è accademica. Dice chi può correggere chi, quale failure è recuperabile, quale copia può essere rigenerata e quale cambiamento richiede una decisione di dominio.

## Un dato derivato può essere operativo e critico

“È derivato, quindi possiamo sempre rigenerarlo” è un’altra frase pericolosa. La possibilità teorica di rebuild non garantisce che abbiamo ancora tutti gli input, che il replay rientri nell’RTO, che le regole di derivazione siano versionate o che l’utente possa lavorare durante il rebuild.

Un read model può non essere business-authoritative e tuttavia essere essenziale per il customer support. Perderlo potrebbe non distruggere dati economici, ma bloccare Operations per ore. È un failure mode reale e deve entrare nel design di recovery.

## Ownership è anche responsabilità organizzativa

Se tre team possono cambiare liberamente la stessa semantica, uno schema elegante non risolve il problema. Per ogni dato importante deve esistere una responsabilità riconoscibile: qualcuno deve poter spiegare quali regole lo governino, chi approvi un cambiamento incompatibile, quali consumer ne dipendano, quali requisiti di retention esistano e come funzionino accesso, audit e recovery.

Non significa che una sola persona debba conoscere tutto. Significa che la responsabilità non può essere anonima.

## ESI: una vista, più autorità

Nel capstone la mappa concettuale iniziale è semplice da raccontare anche se il prodotto offre una vista unificata. Orders possiede il lifecycle e lo stato commerciale dell’ordine; Payments & Risk possiede pagamento, refund e idempotenza economica; Shipping possiede fulfillment e tracking; Order Operations possiede invece il caso operativo, la classificazione del problema, l’assegnazione all’operatore e gli altri metadati introdotti specificamente per quel journey.

```text
Orders            → order lifecycle
Payments & Risk   → payment lifecycle
Shipping          → fulfillment lifecycle
Order Operations  → operational case e classificazione
```

Order Operations può aggregare questi dati senza diventare proprietario di tutto ciò che mostra. **Aggregare è una capability; possedere il significato è una responsabilità.**

Quando l’ownership è ambigua possiamo usare un test molto concreto: se due componenti non sono d’accordo sul valore, chi ha il diritto di correggere l’altro? Se la risposta è “vince chi ha scritto per ultimo”, non abbiamo una source of truth; abbiamo due copie in competizione.

La Data Ownership Map serve a impedire proprio questo.