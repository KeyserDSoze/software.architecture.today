# Capitolo 9 — API e contratti

> **Nota editoriale.** Le affermazioni su HTTP, REST, gRPC, GraphQL, WebSocket e AsyncAPI vengono collegate a specifiche o documentazione ufficiale. Order Operations rimane un caso simulato/composito.

## L'API è una promessa

Quando guardiamo un'API dal codice è facile ridurla alla sua superficie più visibile:

```text
GET /orders
POST /orders
GET /orders/{id}
```

Ma un endpoint è soltanto un punto d'ingresso.

La parte architetturale è la promessa che esiste dietro quel punto d'ingresso.

Chi offre la capability promette al consumer che una richiesta ha un certo significato, che alcuni dati saranno presenti e altri potranno mancare, che determinate operazioni producono side effect e che certi errori indicano condizioni distinguibili. Promette anche qualcosa su authorization, retry, limiti, freshness e compatibilità futura.

Per questo:

> **Un'API non è un controller pubblico. È un contratto fra sistemi che devono poter evolvere senza conoscere reciprocamente tutti i dettagli interni.**

## Nascondere l'implementazione significa preservare il cambiamento

Immaginiamo che un consumer riceva:

```json
{
  "orderId": "ORD-42",
  "paymentStatus": "Captured"
}
```

Domani possiamo spostare `paymentStatus` in un altro datastore, calcolarlo attraverso un adapter o cambiare ORM senza obbligare il consumer a saperlo.

Se invece esponiamo:

```json
{
  "orders.payment_state_code": 3
}
```

abbiamo trasformato una decisione di persistenza in una dipendenza esterna.

Un refactoring interno diventa potenzialmente una breaking change.

È esattamente il tipo di coupling accidentale che abbiamo cercato di contenere nei capitoli precedenti. Cambia soltanto il confine: qui il consumer può vivere in un altro processo, in un altro team o perfino fuori dall'organizzazione.

Microsoft Azure Architecture Center raccomanda di modellare le API sul dominio invece di esporre dettagli d'implementazione o riflettere direttamente lo schema del database, proprio per preservare indipendenza fra interfaccia ed evoluzione interna: [Microsoft Learn — API design](https://learn.microsoft.com/azure/architecture/microservices/design/api-design).

## Il coupling del contratto è intenzionale

Un sistema senza coupling non esiste.

Il consumer deve conoscere qualcosa: la capability che può invocare, la forma del messaggio, il significato dei campi, gli errori osservabili e le regole che governano l'evoluzione.

Il problema è decidere **quale conoscenza meriti di attraversare il boundary**.

Il consumer non dovrebbe sapere quale tabella venga letta, quale framework serializzi la risposta o quale cache venga usata. Non dovrebbe conoscere la topologia interna né l'ordine con cui il provider combina più componenti, a meno che quella sequenza non produca conseguenze osservabili che fanno parte del contratto.

Questa distinzione crea evolvibilità.

Microsoft collega API ben definite, compatibilità e versioning alla possibilità che servizi e consumer evolvano con minore coordinamento: [Microsoft Learn — Design Principles for Azure Applications](https://learn.microsoft.com/azure/architecture/guide/design-principles/).

## Contract-first significa semantic-first

L'espressione *contract-first* viene spesso tradotta in:

```text
prima OpenAPI
poi il codice
```

È meglio che generare una public API accidentalmente dal controller, ma può comunque essere troppo presto.

Prima dello schema viene la semantica.

Per Order Operations dobbiamo sapere che cosa significhi “ordine problematico”, chi possa vederlo, quali stati siano autorevoli e quanto una vista possa essere stale. Dobbiamo capire che cosa accada quando Payments o Shipping non rispondono e quali azioni appartengano davvero alla console.

Solo allora possiamo scegliere una forma di interazione e trasformarla in un contratto machine-readable.

La sequenza che useremo è:

```text
capability
→ consumer
→ semantica e invarianti
→ interaction style
→ contract
→ machine-readable schema
→ implementation
```

Non:

```text
framework
→ controller
→ endpoint
→ semantica ricostruita dopo
```

Il contratto non viene prima del problema.

Viene prima dell'implementazione.

## La vera difficoltà arriva alla seconda versione

La prima versione di un'API è relativamente semplice perché provider e consumer possono nascere insieme.

Il costo emerge quando uno dei due deve cambiare senza l'altro.

Un partner può aggiornarsi dopo settimane. Un'app mobile può restare installata per mesi. Un evento può essere processato molto tempo dopo la pubblicazione. Un consumer interno può avere una release cadence diversa. Alcuni consumer possono perfino essere sconosciuti al team che possiede l'API.

Una breaking change ha quindi una proprietà particolare:

> **il suo blast radius attraversa ownership e tempo.**

Questa è la ragione per cui compatibility, versioning e deprecation non sono manutenzione da aggiungere più avanti. Sono proprietà architetturali del contratto.

Nel resto del capitolo leggeremo ogni API attraverso quattro domande:

1. che cosa promette al consumer?
2. quale semantica operativa e di failure attraversa il boundary?
3. quale implementazione riesce a nascondere?
4. come può cambiare senza costringere tutti a cambiare nello stesso momento?

Sono domande di architettura prima che di sintassi.