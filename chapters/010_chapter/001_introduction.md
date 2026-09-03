# Capitolo 10 — I dati sono architettura

Nel capitolo precedente abbiamo progettato il primo contratto API di Order Operations.

Potremmo essere tentati di considerare il problema quasi risolto.

Abbiamo endpoint, error model, compatibility rule e una prima semantica condivisa.

Ma ogni contratto che espone informazione nasconde una domanda più profonda:

> **da dove arriva quella verità?**

La domanda sembra semplice finché esiste un solo database, una sola applicazione e un solo team.

Poi il sistema cresce.

Payments conosce lo stato economico.

Shipping conosce lo stato di fulfillment.

Orders conosce il lifecycle commerciale dell'ordine.

Order Operations vuole mostrare una vista unica.

Marketing vuole analizzare gli eventi.

Finance vuole riconciliare valori.

Data & AI vuole costruire dataset derivati.

Mobile vuole funzionare anche con connettività intermittente.

Platform vuole standardizzare backup, retention e accesso.

A quel punto “il dato” non è più un record.

È una rete di responsabilità, copie, sincronizzazioni, vincoli e significati.

## Lo schema è soltanto una parte

Quando parliamo di data architecture è facile scivolare immediatamente verso:

- SQL vs NoSQL;
- PostgreSQL vs document database;
- sharding;
- replica;
- cache;
- data lake;
- event store.

Sono tecnologie importanti.

Ma arrivano dopo alcune domande più fondamentali:

- chi possiede il significato di questo dato?
- qual è la source of truth?
- quali copie sono autorevoli e quali derivate?
- quali operazioni devono essere atomiche?
- quanta staleness è accettabile?
- quali access pattern dobbiamo sostenere?
- quale volume e quale crescita dobbiamo gestire?
- chi può leggere e modificare il dato?
- quanto a lungo dobbiamo conservarlo?
- come cambia lo schema senza interrompere il prodotto?
- che cosa succede quando due copie divergono?

La tecnologia viene dopo.

Microsoft Azure Architecture Center raccomanda di scegliere il modello e il data store in funzione di access pattern, consistency, scale, governance, security, cost e capacità operative del team, non partendo dal prodotto preferito.

Fonti:

- [Microsoft Learn — Prepare to choose a data store](https://learn.microsoft.com/azure/architecture/guide/technology-choices/data-stores-getting-started)
- [Microsoft Learn — Understand data models](https://learn.microsoft.com/azure/architecture/data-guide/technology-choices/understand-data-store-models)

È esattamente la stessa regola che abbiamo già incontrato nel Capitolo 6:

> **Fit before fashion.**

Vale anche per i dati.

## Il dato è una promessa

Supponiamo che l'API restituisca:

```json
{
  "orderId": "ORD-42",
  "orderStatus": "Processing",
  "paymentStatus": "Failed",
  "shipmentStatus": "NotReady"
}
```

Quattro campi.

Ma dietro quella risposta esistono almeno quattro domande di ownership.

`orderId` è soltanto un identificatore o ha una semantica globale nell'azienda?

`orderStatus` è calcolato da Order Operations oppure appartiene a Orders?

`paymentStatus` può essere copiato localmente? Se sì, con quale freshness?

`shipmentStatus` è uno stato di business interno o una traduzione dello stato del carrier?

L'API può sembrare semplice proprio perché qualcuno ha già preso molte decisioni sui dati.

Se quelle decisioni restano implicite, la semplicità è fragile.

## Duplicare dati non significa duplicare la verità

Questo capitolo ruota attorno a una distinzione che useremo spesso:

> **possiamo duplicare la rappresentazione di un dato senza duplicarne l'autorità.**

Un read model può contenere una copia dello stato pagamento.

Una cache può contenere una copia dell'ordine.

Un indice di ricerca può contenere una rappresentazione denormalizzata.

Un data warehouse può contenere anni di fatti storici.

Nessuna di queste copie deve diventare automaticamente il posto in cui si decide il significato del pagamento o dell'ordine.

Questa distinzione ci permette di usare denormalizzazione, caching e replica senza perdere ownership.

## Il compromesso ESI del capitolo

In ESI sta emergendo una tensione concreta.

**Operations** vuole una vista degli ordini problematici semplice, rapida e disponibile.

**Payments & Risk** non vuole che Order Operations diventi proprietario accidentale dello stato economico.

**Commerce & Operations** vuole evitare che una query operativa degradi il percorso transazionale degli ordini.

**Platform Engineering** non vuole introdurre un nuovo database, una pipeline eventi e una cache senza una necessità misurabile.

Le esigenze sono tutte legittime.

Il compromesso non sarà scegliere il database più sofisticato.

Dovremo decidere quali dati restano autorevoli nei domini originali e quali rappresentazioni Order Operations può materializzare o indicizzare per il proprio journey.

### Quality floor

Qualunque soluzione scegliamo, non siamo disposti a compromettere:

- correctness del significato economico;
- tenant isolation;
- audit delle future azioni con side effect;
- capacità di ricondurre una vista derivata alla fonte autorevole;
- recovery compatibile con i requisiti dichiarati;
- possibilità di evolvere lo schema senza affidarsi a downtime indefinito.

Il resto è negoziabile.

## Il percorso del capitolo

Costruiremo il ragionamento in questo ordine:

```text
ownership e source of truth
→ access pattern
→ modello e datastore
→ transazioni e consistency
→ index, partitioning e replication
→ cache e dati derivati
→ schema evolution e migration
→ Data Ownership Map di Order Operations
```

Incontreremo PostgreSQL, document database, key-value store, graph database e cache.

Ma non li tratteremo come squadre da tifare.

Sono strumenti con proprietà diverse.

Useremo anche casi reali documentati, tra cui la strategia di Stripe per migrare grandi quantità di dati online senza interrompere il servizio.

L'obiettivo non è diventare database administrator in un capitolo.

È acquisire una capacità più importante:

> **guardare un dato e chiedersi non soltanto dove è salvato, ma chi ne possiede il significato, quali promesse porta con sé e quanto costa mantenerle vere.**