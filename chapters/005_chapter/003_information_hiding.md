## Information hiding: nascondere decisioni, non soltanto campi

Un modulo non è utile solo perché raggruppa codice.

È utile perché può **nascondere informazioni che il resto del sistema non dovrebbe conoscere**.

Questa idea è più profonda dell'incapsulamento classico dei campi privati.

Possiamo avere classi perfettamente incapsulate e un sistema comunque troppo esposto.

### Che cosa stiamo davvero nascondendo?

Un buon confine può nascondere:

- struttura interna dei dati;
- strategia di persistenza;
- libreria usata;
- algoritmo;
- provider esterno;
- policy di retry;
- meccanismo di caching;
- ordine interno delle operazioni;
- dettagli di serializzazione;
- convenzioni che potrebbero cambiare.

L'obiettivo non è creare mistero.

È impedire che una decisione locale diventi una dipendenza globale.

### Un esempio semplice

Supponiamo che il resto dell'applicazione legga direttamente una tabella:

```ts
const rows = await db.query(`
  select id, status, paid_at, shipped_at
  from orders
  where customer_id = $1
`, [customerId]);
```

Questa query non conosce soltanto dati.

Conosce:

- nomi delle colonne;
- struttura fisica;
- convenzioni sullo stato;
- presenza di timestamp specifici;
- database come meccanismo di accesso.

Se molte parti del sistema fanno lo stesso, la persistenza non è più un dettaglio del modulo Orders.

È diventata un'API implicita globale.

Una variante potrebbe essere:

```ts
const orders = await ordersReader.listForCustomer(customerId);
```

Non è automaticamente migliore.

Dipende da che cosa espone `ordersReader`.

Ma crea almeno un punto in cui possiamo decidere che cosa il consumer ha davvero il diritto di conoscere.

### API piccola non significa buona API

Possiamo nascondere troppa informazione o quella sbagliata.

Per esempio:

```ts
processOrder(orderId)
```

è un'API piccola ma forse semanticamente opaca.

Che cosa significa “processare”?

Pagare?

Validare?

Spedire?

Tutto insieme?

L'information hiding non deve cancellare il significato.

Deve nascondere **dettagli che non appartengono al consumer**, lasciando visibile il contratto necessario.

### Nascondere volatilità

Un criterio molto potente è nascondere ciò che ha maggiore probabilità di cambiare.

Se sappiamo che un provider di pagamento potrebbe essere sostituito, non vogliamo che il suo SDK appaia in tutto il dominio.

Meglio concentrare la conoscenza del provider dietro una responsabilità esplicita.

Per esempio:

```ts
interface PaymentGateway {
  authorize(request: AuthorizationRequest): Promise<AuthorizationResult>;
}
```

Il dominio può dipendere dal concetto di autorizzazione del pagamento senza dipendere direttamente da classi e payload del vendor.

Attenzione però.

Non dobbiamo costruire un'astrazione generica per ogni dipendenza “nel caso un giorno cambi”.

Il costo dell'astrazione è reale.

La domanda torna sempre:

> quale decisione vogliamo rendere locale?

### Leaky abstraction

Un'astrazione perde quando i suoi consumer devono comunque conoscere i dettagli che prometteva di nascondere.

Supponiamo di creare:

```ts
interface Storage {
  save(entity: unknown): Promise<void>;
}
```

Sembra astratto.

Ma se ogni consumer deve sapere:

- quali entity possono essere salvate;
- quale transaction scope viene usato;
- quali errori sono retryable;
- quando i dati diventano visibili;
- come vengono risolti i conflitti;

abbiamo semplicemente nascosto il nome del database, non il suo modello operativo.

Un'astrazione utile deve nascondere davvero una decisione o almeno ridurre la quantità di conoscenza condivisa.

### Database come confine accidentale

Molti sistemi finiscono per usare il database come principale meccanismo di integrazione interna.

Diversi moduli leggono e scrivono le stesse tabelle.

All'inizio è molto efficiente.

Non serve creare API, eventi o mapping.

Poi arrivano conseguenze:

- ownership ambigua;
- migration difficili;
- regole duplicate;
- impossibilità di sapere chi modifica un dato;
- query cross-domain;
- coupling alla struttura fisica.

Questo non significa che ogni modulo debba avere immediatamente un database separato.

Un modular monolith può usare lo stesso database fisico e mantenere ownership logica forte.

Per esempio, possiamo decidere che:

```text
Orders possiede orders.*
Billing possiede billing.*
Shipping possiede shipping.*
```

con regole che vietano l'accesso diretto cross-module anche se tutto vive nella stessa istanza PostgreSQL.

Il confine logico viene prima della topologia fisica.

### Information hiding come protezione dal copy-paste AI

Con agenti generativi, un dettaglio esposto tende a diffondersi molto velocemente.

Se un agente trova tre esempi in cui si interroga direttamente una tabella, probabilmente userà lo stesso pattern nella quarta feature.

Questo rende l'information hiding ancora più importante.

Le API pubbliche di un modulo diventano **sentieri preferenziali** per l'execution automatizzata.

Se il percorso corretto è evidente e quello scorretto è difficile, gli agenti hanno più probabilità di produrre modifiche coerenti.

> **Un buon confine non documenta soltanto come fare la cosa giusta. Rende più difficile fare quella sbagliata.**

### La domanda da usare in review

Quando vediamo una nuova dipendenza, possiamo chiedere:

> **Il consumer sta imparando qualcosa che dovrebbe restare un dettaglio del provider?**

Se sì, forse il contratto espone troppo.

Se invece il consumer non riceve abbastanza informazione per usare correttamente il servizio, forse espone troppo poco.

Il buon information hiding non massimizza il segreto.

Massimizza la **località delle decisioni**.
