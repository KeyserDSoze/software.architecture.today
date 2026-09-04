## Deployability, failure isolation e costo operativo

Separare un sistema in più deployable ha senso soltanto se la separazione produce proprietà che ci servono davvero.

Tre delle più importanti sono:

- deployability indipendente;
- failure isolation;
- scaling indipendente.

Sembrano vantaggi ovvi.

Ma ciascuno di essi ha condizioni precise.

### Deploy indipendente non significa repository indipendente

Un servizio è realmente deployabile in autonomia quando possiamo modificarlo e rilasciarlo senza dover coordinare necessariamente il rilascio di altri componenti.

La deployability indipendente richiede contratti compatibili ed evoluzione sicura, dipendenze non eccessivamente rigide e migrazioni dati gestibili. Richiede anche rollback o forward-fix credibili e abbastanza osservabilità da capire l'effetto di un rilascio senza dover ricostruire tutto il sistema a posteriori.

Se `Orders` e `Payments` sono due servizi ma ogni modifica a uno richiede una modifica simultanea all'altro, la separazione fisica non ha comprato molta autonomia.

Ha comprato soprattutto rete.

### Failure isolation

La failure isolation è spesso uno dei motivi migliori per separare componenti.

Ma anche qui dobbiamo verificare la realtà.

Supponiamo che `Orders` chiami sincronicamente:

```text
Identity
Payments
Inventory
Shipping
Pricing
```

Se una singola richiesta dipende dalla disponibilità simultanea di tutti questi servizi, abbiamo separato i processi ma non necessariamente il failure domain percepito dall'utente.

Il sistema può essere distribuito e continuare a fallire come un blocco unico.

Una separazione utile richiede timeout e fallback, degradazione controllata e asincronia dove compatibile. Richiede isolamento delle risorse, circuit breaker quando giustificati e dipendenze non critiche che possano diventare opzionali invece di trascinare tutto il journey nel failure.

Quindi:

> **la failure isolation non nasce dal numero di processi. Nasce dal modo in cui quei processi dipendono l'uno dall'altro.**

### Scaling indipendente

Un altro argomento ricorrente è:

> “Con i microservizi possiamo scalare soltanto ciò che serve.”

Vero.

Ma prima dobbiamo avere un problema di scaling differenziato abbastanza importante da giustificare la distribuzione.

Se `Orders`, `Payments` e `Shipping` hanno carichi simili, bassi e stabili, scalare tre servizi separatamente può non produrre alcun vantaggio concreto.

Se invece `Search` riceve cento volte il traffico di `Billing`, il profilo cambia.

Lo scaling indipendente diventa una proprietà economicamente significativa.

### Il costo che non appare nel diagramma

Un diagramma a microservizi spesso mostra questo:

```text
Client
  ↓
API Gateway
  ↓
Services
```

Un diagramma con tre servizi e tre frecce non mostra certificati, secret rotation, DNS o service discovery. Non mostra network policy, rate limiting, tracing, correlazione dei log e alerting; non racconta pipeline, health check, timeout e retry policy, contract test o schema migration. E lascia fuori incident ownership, backup e restore, capacity planning e cost attribution. È lì che gran parte del costo della distribuzione vive davvero.

Questa parte invisibile è spesso il vero prezzo della distribuzione.

### Il costo cognitivo

C'è poi un costo ancora meno visibile.

Per capire una feature in un monolite potremmo seguire un flusso dentro un solo codebase e un singolo processo.

In un sistema distribuito potremmo dover ricostruire:

```text
request
→ gateway
→ service A
→ queue
→ service B
→ database
→ event
→ service C
```

La separazione può migliorare ownership e autonomia.

Ma aumenta il costo di costruire un modello mentale end-to-end.

Quindi il costo operativo e quello cognitivo devono entrare nel technology fit.

### Una regola economica

Possiamo sintetizzare così:

```text
valore della separazione
>
costo della distribuzione
```

Non serve misurarlo con precisione finanziaria millimetrica.

Serve almeno renderlo esplicito.

Se non sappiamo quale valore concreto compra un nuovo service boundary, abbiamo probabilmente saltato un passaggio.

La domanda non è:

> “Possiamo estrarlo?”

Con l'AI, quasi certamente sì.

La domanda è:

> **“Che proprietà importante compriamo estraendolo?”**