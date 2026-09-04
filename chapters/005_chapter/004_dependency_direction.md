## Dependency direction: chi deve conoscere chi

Due componenti possono avere responsabilità sensate e rimanere comunque accoppiati nel verso sbagliato. La domanda non è soltanto se esista una dipendenza, ma **in quale direzione punti e quale parte del sistema venga costretta a cambiare quando cambia l'altra**.

Questa è l'idea operativa dietro il dependency inversion principle.

## Proteggere la policy dai dettagli

Supponiamo che il caso d'uso di cancellazione debba notificare il cliente. Un'implementazione diretta potrebbe far dipendere il servizio dal client di uno specifico provider:

```ts
import { SendGridClient } from "@vendor/sendgrid";

class OrderCancellationService {
  constructor(private readonly sendGrid: SendGridClient) {}

  async cancel(orderId: string): Promise<void> {
    // regole di annullamento
    // ...

    await this.sendGrid.send(/* payload vendor-specific */);
  }
}
```

Il problema non è SendGrid. Il problema è che una policy del dominio conosce direttamente classi, payload e convenzioni di un dettaglio infrastrutturale.

Possiamo invertire quella conoscenza:

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

A runtime il caso d'uso continua a invocare una capability esterna. A livello di dipendenze sorgente, però, il dominio dipende dal proprio concetto di notifica e l'adapter del vendor dipende da quel contratto.

Il dettaglio può cambiare senza trascinare la policy.

## Dependency inversion non significa “una interface per classe”

Ridurre il principio a una ricetta produce spesso soltanto file in più. Creare `UserServiceInterface` perché esiste `UserService` non dimostra che abbiamo protetto nessuna decisione.

La domanda da porre prima dell'astrazione è:

> **Quale parte rappresenta la capacità o policy che vogliamo mantenere stabile rispetto a un dettaglio che può cambiare per una ragione diversa?**

Se non sappiamo rispondere, l'interfaccia rischia di essere rituale.

## Direction of execution e direction of dependency

È utile distinguere il flusso di esecuzione dalla direzione della conoscenza:

```text
Use case
  ↓ calls
PaymentGateway
  ↑ implemented by
StripePaymentGateway
```

Il caso d'uso chiama il gateway, ma il dominio non importa il client Stripe. È l'adapter Stripe a conoscere il contratto richiesto dal dominio.

Questa forma permette alla parte che rappresenta il significato del business di non essere trascinata da dettagli che cambiano per motivi infrastrutturali.

## A chi appartiene il contratto?

Non esiste una regola universale, ma un criterio utile è lasciare che il contratto esprima **ciò di cui il consumer ha bisogno**, non automaticamente tutto ciò che il provider sa fare.

Se Orders deve autorizzare un pagamento, potrebbe aver bisogno del concetto `AuthorizePayment`, non dell'intera API interna di Payments. Questa differenza riduce il rischio che il provider esporti il proprio modello completo e costringa i consumer a conoscerlo.

La dependency direction si applica anche tra moduli e sistemi. Un componente di reporting potrebbe leggere direttamente le tabelle Orders oppure dipendere da un contratto stabile che espone soltanto il significato necessario. La seconda soluzione introduce costi e non è sempre preferibile; rende però esplicito che Reporting dipende da **un contratto di Orders**, non dalla sua struttura interna.

## Stabilità non significa immobilità

Una policy è “stabile” nel senso che vogliamo proteggerla da cambiamenti appartenenti a un'altra dimensione, non perché sia eterna.

La regola “un ordine già spedito non può essere annullato” potrebbe cambiare per una nuova policy commerciale. Non dovrebbe però cambiare perché sostituiamo framework HTTP, ORM o provider email.

Questa è la separazione che la dependency direction prova a proteggere.

## Testabilità come conseguenza, non come giustificazione

Quando la logica dipende da capability espresse come contratti, possiamo spesso testare la policy senza avviare tutta l'infrastruttura:

```ts
const notifier = new FakeCustomerNotifier();
const service = new OrderCancellationService(notifier);

await service.cancel(order.id);

expect(notifier.cancelledOrders).toContain(order.id);
```

È un vantaggio, ma non la prova automatica di buon design. Possiamo costruire sistemi perfettamente testabili e pieni di astrazioni inutili. Il criterio resta la direzione della conoscenza e il costo del cambiamento.

## Dependency direction come guardrail per gli agenti

Per un coding agent, regole come:

```text
domain/ non importa infrastructure/
orders/ non accede direttamente alle tabelle shipping
adapters/ implementa contratti definiti dai moduli consumer
```

sono molto più utili di una raccomandazione vaga a “rispettare la clean architecture”. Possono essere comprese e, in molti casi, verificate automaticamente con architecture test o lint rule.

> **Una buona dependency direction trasforma una scelta di design in una proprietà leggibile e, quando possibile, verificabile del repository.**
