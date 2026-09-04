## Dependency direction: chi deve conoscere chi

Due componenti possono avere responsabilità ragionevoli e restare comunque accoppiati nel verso sbagliato.

La domanda non è soltanto:

> “Esiste una dipendenza?”

Ma:

> **“In quale direzione punta e quale parte del sistema costringe a cambiare?”**

Questa è l'idea operativa dietro il dependency inversion principle.

### Policy e dettagli

Supponiamo che una regola di dominio debba inviare una notifica quando un ordine viene annullato.

Un'implementazione ingenua potrebbe essere:

```ts
import { SendGridClient } from "@vendor/sendgrid";

class OrderCancellationService {
  constructor(private readonly sendGrid: SendGridClient) {}

  async cancel(orderId: string): Promise<void> {
    // aggiorna l'ordine
    // ...

    await this.sendGrid.send(/* payload vendor-specific */);
  }
}
```

Il problema non è che SendGrid sia una cattiva tecnologia.

Il problema è che una policy importante — annullare un ordine e notificare il cliente — conosce direttamente un dettaglio infrastrutturale specifico.

La direzione della conoscenza può essere invertita:

```ts
interface CustomerNotifier {
  orderCancelled(order: CancelledOrder): Promise<void>;
}

class OrderCancellationService {
  constructor(private readonly notifier: CustomerNotifier) {}

  async cancel(orderId: string): Promise<void> {
    // regole di annullamento
    // ...

    await this.notifier.orderCancelled(/* ... */);
  }
}
```

Ora l'infrastruttura può implementare il contratto.

La policy non conosce il vendor.

### Non è “aggiungi sempre un'interfaccia”

Questo principio viene spesso ridotto a una ricetta:

> “Metti una interface davanti a ogni classe.”

Non è questo il punto.

Se creiamo:

```ts
interface UserServiceInterface {
  getUser(id: string): Promise<User>;
}
```

soltanto perché esiste `UserService`, potremmo non aver invertito nulla.

Abbiamo aggiunto un file.

La domanda vera è:

> **Quale parte rappresenta una policy stabile e quale parte è un dettaglio che vogliamo poter sostituire, isolare o testare indipendentemente?**

L'astrazione dovrebbe nascere da quella tensione.

### Direction of dependency vs direction of execution

Il controllo può fluire in una direzione mentre la dipendenza del codice punta nell'altra.

Per esempio:

```text
Use case
  ↓ calls
PaymentGateway
  ↑ implemented by
StripePaymentGateway
```

A runtime il caso d'uso invoca il gateway.

A livello di dipendenze sorgente, il dominio dipende dal proprio contratto e l'adapter Stripe dipende da quel contratto.

Questo permette alla parte più stabile di non essere trascinata dai dettagli più volatili.

### Dove mettere il contratto?

Non esiste una regola universale.

Ma un criterio utile è:

> il contratto dovrebbe appartenere alla parte che ha bisogno della capacità, non automaticamente a quella che la implementa.

Se `Orders` ha bisogno di autorizzare un pagamento, il concetto di cui ha bisogno potrebbe essere:

```text
AuthorizePayment
```

non l'intera API interna del modulo `Payments`.

Questo riduce il rischio di esporre un provider-style interface troppo ampia.

### Dependency inversion tra moduli

Il principio non vale soltanto tra classi.

Può applicarsi tra moduli, servizi o sistemi.

Supponiamo che un componente di reporting abbia bisogno di conoscere gli ordini completati.

Potrebbe leggere direttamente il database Orders.

Oppure Orders potrebbe pubblicare un contratto stabile — API o evento — che espone il significato necessario senza rivelare la persistenza interna.

La seconda soluzione non è automaticamente migliore.

Introduce costi.

Ma rende esplicita la direzione della dipendenza.

Reporting dipende da un contratto di Orders, non dalla sua struttura interna.

### Stabilità non significa immobilità

Una policy non è “stabile” perché non cambia mai.

Significa che vogliamo proteggerla da cambiamenti che appartengono a un'altra dimensione.

La regola:

> “un ordine già spedito non può essere annullato”

potrebbe cambiare in futuro.

Ma non dovrebbe cambiare perché sostituiamo il framework HTTP o il provider di email.

Questa è la separazione che cerchiamo.

### Dependency direction e testabilità

Un effetto collaterale utile è la testabilità.

Se la logica dipende da capability espresse come contratti, possiamo verificare la policy senza avviare ogni dettaglio infrastrutturale.

```ts
const notifier = new FakeCustomerNotifier();
const service = new OrderCancellationService(notifier);

await service.cancel(order.id);

expect(notifier.cancelledOrders).toContain(order.id);
```

Ma attenzione: la testabilità non è prova automatica di buon design.

Possiamo costruire un sistema molto testabile ma pieno di astrazioni inutili.

Il test è un beneficio.

Il criterio resta la direzione della conoscenza.

### Dependency inversion e agenti

Per un coding agent, una dependency direction esplicita è preziosa.

Se il repository contiene regole come:

```text
domain/ non importa infrastructure/
orders/ non accede direttamente alle tabelle shipping
adapters/ implementa contratti definiti dai moduli consumer
```

l'agente ha guardrail strutturali.

Possiamo perfino verificarli con architecture test.

Questo riduce la quantità di supervisione necessaria per ogni diff.

> **Una buona dependency direction trasforma un principio architetturale in una proprietà verificabile del repository.**

Ne parleremo più avanti quando affronteremo architecture fitness functions e testing architecture.
