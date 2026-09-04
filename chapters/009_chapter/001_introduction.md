# Capitolo 9 — API e contratti

> **Nota editoriale.** Le affermazioni su HTTP, REST, gRPC, GraphQL, WebSocket e AsyncAPI in questo capitolo vengono collegate a specifiche o documentazione ufficiale. Order Operations rimane un caso simulato/composito.

## L'API è una promessa

Quando guardiamo un'API dal codice è facile ridurla a un insieme di endpoint.

```text
GET /orders
POST /orders
GET /orders/{id}
```

Ma l'endpoint è soltanto la parte più visibile.

un'API stabilisce una relazione tra chi offre una capability e chi dipende da essa.

Quella relazione contiene promesse sul significato di richieste e risposte, sui dati che possono mancare e sugli errori possibili. Definisce che cosa possa essere ritentato, quali operazioni producano side effect, quali autorizzazioni e limiti esistano e come il contratto possa cambiare nel tempo senza sorprendere i consumer.

Per questo:

> **un'API non è un controller pubblico. È un contratto tra sistemi.**

### Un refactoring non dovrebbe diventare un breaking change

Immaginiamo che un client riceva:

```json
{
  "orderId": "ORD-42",
  "paymentStatus": "Captured"
}
```

Se domani spostiamo `paymentStatus` da una tabella a un'altra, il consumer non dovrebbe essere costretto a cambiare.

Se invece l'API espone direttamente la forma del database:

```json
{
  "orders.payment_state_code": 3
}
```

abbiamo trasformato un dettaglio interno in una dipendenza esterna.

Microsoft Azure Architecture Center raccomanda esplicitamente di evitare API che espongono dettagli di implementazione o rispecchiano lo schema interno del database; l'API dovrebbe modellare il dominio e servire come contratto, in modo che un refactoring interno non richieda automaticamente un cambio di interfaccia.

Fonte:

- [Microsoft Learn — API design](https://learn.microsoft.com/azure/architecture/microservices/design/api-design)

Questa idea è indipendente dai microservizi.

Vale anche tra moduli, tra backend e frontend, tra un prodotto e i suoi partner o tra un'applicazione e un agent tool.

### Il contratto crea coupling intenzionale

Un sistema senza coupling non è un sistema.

Il problema è distinguere coupling necessario da coupling accidentale.

Un contratto buono rende intenzionale ciò che deve essere condiviso e nasconde ciò che non serve condividere.

Il consumer deve conoscere il significato della capability e la forma del messaggio, le regole di compatibilità e le condizioni di errore.

Non dovrebbe invece conoscere il nome della tabella o la struttura delle classi, il framework ORM, la topologia interna, la strategia di caching o la sequenza con cui il provider realizza internamente la capability.

Questa separazione crea evolvibilità.

Microsoft collega esplicitamente API ben definite e versioning alla capacità dei servizi di evolvere in modo indipendente.

Fonte:

- [Microsoft Learn — Design Principles for Azure Applications](https://learn.microsoft.com/azure/architecture/guide/design-principles/)

### Contract-first non significa schema-first

L'espressione *contract-first* può essere fraintesa.

Non significa necessariamente scrivere per prima cosa OpenAPI o `.proto`.

Prima dello schema viene la semantica.

Per Order Operations, prima di decidere l'URI dobbiamo sapere che cosa significhi “ordine problematico”, chi possa vederlo e quanto il dato possa essere stale. Dobbiamo conoscere la source of truth e decidere che cosa debba accadere quando una dipendenza non risponde.

Solo dopo possiamo scegliere una rappresentazione.

Il flusso è:

```text
capability
→ semantica
→ invarianti
→ interaction style
→ contract
→ implementation
```

Non:

```text
framework
→ controller
→ endpoint
→ speriamo che la semantica emerga
```

### Un contratto vive nel tempo

La parte difficile di un'API raramente è la prima versione.

È la seconda.

Poi la terza.

Un consumer può aggiornarsi lentamente.

Un partner può non essere sotto il nostro controllo.

Un'app mobile può restare installata per mesi.

Un evento pubblicato ieri può essere processato dopo un ritardo.

Una breaking change ha quindi una proprietà particolare: **il suo blast radius attraversa ownership e tempo**.

Da questo punto del libro leggeremo ogni API con quattro domande:

1. che cosa promette?
2. a chi lo promette?
3. come può fallire?
4. come può evolvere senza costringere tutti a cambiare insieme?

Sono domande di architettura prima che di sintassi.