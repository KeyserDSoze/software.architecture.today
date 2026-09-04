# Capitolo 10 — I dati sono architettura

Nel capitolo precedente abbiamo trattato l'API come una promessa.

Ma ogni promessa che contiene dati nasconde una domanda ancora più fondamentale:

> **chi è autorizzato a dire che quel dato è vero?**

Finché esistono un solo database, un solo team e pochi consumer, la domanda può sembrare teorica. Quando il sistema cresce smette di esserlo.

Payments conosce il significato economico del pagamento. Shipping conosce il fulfillment. Orders possiede il lifecycle commerciale dell'ordine. Order Operations vuole comporre una vista unica. Finance vuole riconciliare valori, Data & AI costruire dataset derivati, Platform governare backup e retention.

A quel punto “il dato” non è più una riga.

È una rete di ownership, copie, trasformazioni, access pattern, transazioni, failure e regole di evoluzione.

## Lo storage arriva dopo il significato

Quando parliamo di data architecture è facile saltare subito a una tecnologia:

```text
SQL o NoSQL?
PostgreSQL o document database?
Cache?
Replica?
Sharding?
Data lake?
Vector store?
```

Sono domande legittime.

Arrivano però dopo altre domande che cambiano materialmente la risposta: chi possiede la semantica? Quale copia è autorevole? Quali fatti devono diventare veri insieme? Quale staleness è accettabile? Come leggiamo e scriviamo il dato? Quanto cresce? Quanto lo conserviamo? Chi può accedervi? Come migriamo lo schema mentre versioni differenti del sistema continuano a funzionare?

Microsoft Azure Architecture Center propone proprio questo ordine: identificare access pattern e modello, poi valutare consistency, latency, scale, governance, cost e capacità operative prima di scegliere un prodotto concreto. La guida più recente raccomanda inoltre di combinare modelli differenti soltanto quando access pattern o lifecycle divergono davvero: [Microsoft Learn — Prepare to choose a data store](https://learn.microsoft.com/azure/architecture/guide/technology-choices/data-stores-getting-started) e [Microsoft Learn — Understand data models](https://learn.microsoft.com/azure/architecture/data-guide/technology-choices/understand-data-store-models).

È ancora **fit before fashion**.

Questa volta applicato alla parte del sistema che tende a sopravvivere più a lungo del codice che la usa.

## Una response semplice può nascondere molte autorità

Supponiamo che Order Operations restituisca:

```json
{
  "orderId": "ORD-42",
  "orderStatus": "Processing",
  "paymentStatus": "Failed",
  "shipmentStatus": "NotReady"
}
```

Il payload è piccolo.

La semantica dietro di lui non lo è.

`orderStatus` appartiene a Orders oppure Order Operations può cambiarne il significato? `paymentStatus` può essere copiato localmente e, se sì, quanto può essere vecchio? `shipmentStatus` è il valore del carrier o una normalizzazione di Shipping? `orderId` è un identifier globale oppure ha validità soltanto dentro un boundary?

L'API appare semplice perché qualcuno deve aver già risposto a queste domande.

Se le risposte restano implicite, la semplicità è soltanto temporanea.

## Possiamo duplicare la rappresentazione senza duplicare l'autorità

Questa sarà la distinzione centrale del capitolo.

Una cache può contenere una copia dell'ordine. Un read model può contenere lo stato di pagamento. Un indice di ricerca può avere una rappresentazione denormalizzata. Un warehouse può conservare anni di dati storici. Un dataset per AI può derivare feature da più fonti.

Queste copie possono essere utilissime.

Non devono diventare automaticamente nuove fonti di verità.

> **Possiamo duplicare il dato per servire meglio un workload. Non dovremmo duplicare senza intenzione il diritto di definirne il significato.**

Questa distinzione permette di usare replica, denormalizzazione, cache e projection senza perdere ownership.

## La data architecture è una sequenza di promesse

Ogni dato significativo porta con sé almeno quattro promesse.

La prima riguarda il **significato**: chi decide che cosa rappresenta e quali transizioni sono valide.

La seconda riguarda la **visibilità**: chi può leggerlo, modificarlo e con quale freshness.

La terza riguarda il **tempo**: quanto lo conserviamo, come evolve lo schema e come convivono vecchie e nuove rappresentazioni durante una migration.

La quarta riguarda la **failure**: che cosa succede se la copia è stale, il primary non risponde, una replica è indietro, una cache viene persa o una migration resta a metà.

Il datastore è uno strumento con cui implementiamo queste promesse.

Non le decide al posto nostro.

## Il compromesso ESI

In ESI la tensione è concreta.

Operations vuole una vista unica, veloce e disponibile degli ordini problematici. Payments & Risk non vuole che quella vista diventi una seconda autorità economica. Commerce & Operations non vuole che query operative pesanti degradino il workload transazionale. Platform Engineering non vuole introdurre cache, pipeline e nuovi store senza un beneficio misurabile.

Queste esigenze non si risolvono scegliendo il database “più scalabile”.

Dobbiamo decidere quali fatti restino autorevoli nei domini originali, quali dati Order Operations possieda davvero e quali rappresentazioni possa derivare per il proprio journey.

Il quality floor rimane quello costruito finora: correctness economica, tenant isolation, tracciabilità delle future action con side effect, capacità di ricondurre ogni copia derivata alla fonte autorevole, recovery coerente con gli obiettivi e migration che non richiedano downtime indefinito per default.

## Il percorso del capitolo

Seguiremo il dato nell'ordine in cui il reasoning dovrebbe avvenire:

```text
semantic ownership
→ source of truth
→ access pattern
→ modello e datastore
→ transazioni e concorrenza
→ performance e distribuzione
→ copie derivate e cache
→ schema evolution, retention e migration
→ Data Ownership Map di Order Operations
```

Incontreremo modelli relazionali, document, key-value, graph e store specializzati. Parleremo di index, partitioning, replica e cache. Vedremo anche come Stripe ha documentato una grande online migration mantenendo il servizio attivo.

Ma nessuno di questi elementi verrà trattato come una ricetta.

La capacità che cerchiamo è diversa:

> **guardare un dato e chiedersi non soltanto dove sia salvato, ma chi ne possieda il significato, quale workload debba servire e quali promesse dobbiamo continuare a mantenere mentre tutto il resto cambia.**