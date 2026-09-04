## Deployability, failure isolation e costo operativo

Separare un sistema in più deployable ha senso soltanto se la separazione produce proprietà che ci servono davvero.

Le parole che ricorrono più spesso sono deploy indipendente, failure isolation e scaling indipendente. Sono vantaggi reali, ma soltanto quando emergono nel comportamento del sistema e dell'organizzazione.

La separazione fisica, da sola, non li garantisce.

## Deploy indipendente significa cambiare senza sincronizzare tutto

Un servizio è realmente deployabile in autonomia quando possiamo modificarlo e rilasciarlo senza dover coordinare necessariamente il rilascio degli altri componenti.

Questo richiede molto più di un repository separato.

I contratti devono poter evolvere in modo compatibile. Le migration non devono imporre lockstep update. Il consumer deve tollerare versioni differenti per una finestra ragionevole. Rollback o forward-fix devono essere credibili e l'observability deve permetterci di capire che cosa sia cambiato dopo il rilascio.

Se `Orders` e `Payments` sono due servizi ma ogni modifica significativa a uno richiede una release simultanea dell'altro, abbiamo aggiunto un network boundary senza comprare molta deployability.

La domanda quindi non è:

> “Sono due deployable?”

ma:

> **“Possono davvero evolvere con ritmi diversi senza coordinamento continuo?”**

## Failure isolation richiede che il journey sappia degradare

Separare processi può limitare alcuni blast radius.

Ma immaginiamo che `Orders` debba chiamare sincronicamente:

```text
Identity
Payments
Inventory
Shipping
Pricing
```

per completare una sola richiesta.

In questa topologia ogni servizio è fisicamente distinto, ma il journey dell'utente dipende ancora dalla disponibilità simultanea di tutti. Se uno fallisce e nessun comportamento degradato è accettabile, la percezione esterna rimane quella di un sistema che cade come un blocco unico.

La failure isolation nasce quindi dal modo in cui i servizi dipendono fra loro: timeout, fallback, asincronia dove semanticamente possibile, resource isolation e riduzione delle dipendenze obbligatorie sul critical path.

> **Il numero di processi crea possibilità di isolamento. Il design delle dipendenze decide se quella possibilità diventa reale.**

Questo è lo stesso motivo per cui un circuit breaker o una queue possono essere utili in un contesto e irrilevanti in un altro.

## Scaling indipendente deve risolvere un'asimmetria vera

“Con i microservizi possiamo scalare soltanto ciò che serve” è corretto.

Ma il beneficio esiste soltanto se le parti del sistema hanno profili di carico abbastanza diversi da rendere inefficiente lo scaling congiunto.

Se Orders, Payments e Shipping hanno traffico moderato e simile, separarli per scalare indipendentemente può non cambiare quasi nulla dal punto di vista economico.

Se invece Search riceve cento volte il traffico di Billing, usa molte più CPU e ha una curva di crescita differente, il boundary operativo può evitare di duplicare risorse che Billing non userà mai.

Anche qui la proprietà viene prima del servizio.

Prima osserviamo l'asimmetria.

Poi decidiamo se la separazione è il modo migliore per governarla.

## Il diagramma non mostra il prezzo

Un diagramma distribuito può apparire semplice:

```text
Client
  ↓
API Gateway
  ↓
Services
```

Ma ogni nuovo deployable porta con sé una superficie che il diagramma comprime quasi completamente.

Dobbiamo governare identità fra servizi e secret rotation, DNS e service discovery, certificati, network policy e rate limit. Dobbiamo ricostruire trace distribuiti, correlare log, definire alert e health check. Arrivano contract test, timeout e retry policy, schema evolution, pipeline, rollback, backup e restore. Arrivano ownership degli incidenti, capacity planning e cost attribution.

Nessuna di queste cose rende i microservizi sbagliati.

Sono semplicemente parte del prezzo.

Se la separazione compra autonomy, isolation o scaling di grande valore, il prezzo può essere ottimo.

Se non sappiamo quale proprietà stiamo comprando, quella stessa superficie diventa complexity debt.

## Il costo cognitivo attraversa i confini

Esiste poi un costo che difficilmente appare nei preventivi infrastrutturali.

In un singolo processo un engineer può spesso seguire un flusso end-to-end dentro lo stesso codebase e con strumenti locali.

In un sistema distribuito il percorso può diventare:

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

Il confine può migliorare ownership locale, ma rende più costoso costruire il modello mentale del journey completo.

Questo non è necessariamente un difetto. È un trade-off: riduciamo la quantità di codice che un team deve possedere direttamente, ma aumentiamo la quantità di sistema che qualcuno deve capire per diagnosticare un comportamento cross-service.

Per questo l'operabilità deve entrare nella decisione di topologia fin dall'inizio.

## La regola economica

Possiamo sintetizzare il ragionamento così:

```text
valore dell'autonomia ottenuta
+ valore dell'isolamento ottenuto
+ valore dello scaling ottenuto
>
costo operativo
+ costo cognitivo
+ nuova complessità distribuita
```

Non serve trasformare ogni termine in euro o in un punteggio numerico.

Serve poter raccontare il bilancio senza nascondere metà dell'equazione.

Con l'AI diventa molto più facile creare un nuovo deployable.

La domanda importante non è più “possiamo estrarlo?”.

Quasi certamente sì.

La domanda è:

> **Quale proprietà importante compriamo estraendolo, e come dimostreremo che l'abbiamo davvero ottenuta?**