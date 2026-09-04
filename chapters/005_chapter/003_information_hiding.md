## Information hiding: nascondere decisioni, non soltanto campi

Un modulo non è utile soltanto perché raggruppa codice. È utile quando riesce a **nascondere informazioni che il resto del sistema non dovrebbe essere costretto a conoscere**.

Questa idea è più profonda dell'incapsulamento dei campi privati. Possiamo avere classi perfettamente incapsulate e un sistema comunque troppo esposto, perché i consumer conoscono schema, provider, convenzioni temporali e dettagli di persistenza che dovrebbero rimanere locali.

## Che cosa vale la pena nascondere

Un buon boundary può nascondere la struttura interna dei dati, la strategia di persistenza, una libreria, un algoritmo o un provider esterno. Può anche rendere locali policy di retry e caching, dettagli di serializzazione e convenzioni operative che potrebbero cambiare senza obbligare tutti i consumer a seguirle.

L'obiettivo non è creare mistero. È impedire che una decisione locale diventi una dipendenza globale.

Supponiamo che più parti dell'applicazione leggano direttamente:

```ts
const rows = await db.query(`
  select id, status, paid_at, shipped_at
  from orders
  where customer_id = $1
`, [customerId]);
```

Il consumer non sta imparando soltanto come ottenere un dato. Sta conoscendo nomi delle colonne, struttura fisica, convenzioni sugli stati, presenza di timestamp specifici e meccanismo di accesso.

Se questo pattern si diffonde, la persistenza di Orders smette di essere un dettaglio interno. Diventa un'API implicita globale.

Una chiamata come:

```ts
const orders = await ordersReader.listForCustomer(customerId);
```

non è automaticamente migliore, ma crea almeno un punto esplicito in cui possiamo decidere che cosa il consumer abbia davvero il diritto di sapere.

## Nascondere dettagli senza cancellare il significato

Un'API piccola non è necessariamente una buona API. `processOrder(orderId)` espone poco testo e pochissimo significato: non sappiamo se “processare” significhi validare, pagare, spedire o orchestrare tutto.

L'information hiding non deve oscurare il contratto semantico. Deve nascondere **i dettagli che non appartengono al consumer** lasciando invece visibile ciò che serve per usare correttamente la capability.

Questa distinzione evita un errore comune: confondere astrazione con vaghezza.

## Nascondere la volatilità giusta

Un criterio potente consiste nel localizzare ciò che ha una ragione plausibile per cambiare indipendentemente. Se un payment provider può essere sostituito o evolvere, non vogliamo che il suo SDK e i suoi payload diventino il linguaggio del dominio.

Possiamo concentrare quella conoscenza dietro un contratto come:

```ts
interface PaymentGateway {
  authorize(request: AuthorizationRequest): Promise<AuthorizationResult>;
}
```

Il dominio dipende dalla capacità di autorizzare un pagamento, non dalle classi del vendor.

Questo non significa introdurre un'astrazione davanti a ogni dipendenza “nel caso un giorno cambi”. Anche le astrazioni hanno costo. La domanda deve rimanere concreta: **quale decisione vogliamo rendere locale?**

## Quando l'astrazione perde

Una leaky abstraction obbliga i consumer a conoscere proprio i dettagli che prometteva di nascondere.

Un'interfaccia generica come:

```ts
interface Storage {
  save(entity: unknown): Promise<void>;
}
```

può sembrare molto astratta. Ma se ogni consumer deve sapere quali entity possano essere salvate, quale transaction scope venga usato, quali errori siano retryable, quando i dati diventino visibili e come vengano risolti i conflitti, abbiamo nascosto il nome del database e lasciato esposto il suo modello operativo.

L'astrazione utile riduce davvero la quantità di conoscenza condivisa.

## Database condiviso, ownership separata

Molti sistemi usano il database come meccanismo di integrazione interna. All'inizio è efficiente: nessuna API, nessun evento, nessun mapping. Il costo emerge quando diversi moduli leggono e scrivono le stesse tabelle, le migration richiedono coordinamento, la ownership diventa ambigua e le regole vengono duplicate in query diverse.

Questo non implica che ogni modulo debba avere subito un database fisico separato. Un modular monolith può usare la stessa istanza PostgreSQL e mantenere ownership logica forte:

```text
Orders possiede orders.*
Billing possiede billing.*
Shipping possiede shipping.*
```

La regola importante è che un boundary logico resti tale anche se l'infrastruttura è condivisa. Il confine concettuale viene prima della topologia fisica.

## Information hiding e diffusione automatica dei pattern

Con gli agenti, un dettaglio esposto tende a propagarsi velocemente. Se un coding agent trova tre esempi in cui una feature legge direttamente una tabella, quella pratica diventa il sentiero statisticamente più evidente per la quarta modifica.

Le API pubbliche di un modulo diventano quindi **sentieri preferenziali per l'execution automatizzata**. Se il percorso corretto è evidente e quello scorretto richiede di violare un boundary, aumentiamo la probabilità che le modifiche rimangano coerenti.

> **Un buon confine non documenta soltanto come fare la cosa giusta. Rende più difficile fare quella sbagliata.**

In review possiamo usare una domanda semplice:

> **Il consumer sta imparando qualcosa che dovrebbe restare un dettaglio del provider?**

Se sì, il contratto potrebbe esporre troppo. Se invece non comunica abbastanza semantica da essere usato correttamente, potrebbe nascondere la cosa sbagliata.

Il buon information hiding non massimizza il segreto. Massimizza la **località delle decisioni**.
