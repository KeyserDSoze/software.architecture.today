## Order Operations: per ora resta un modular monolith

Arriviamo alla decisione topologica per Order Operations.

Nei capitoli precedenti abbiamo già identificato responsabilità distinte:

```text
Order Operations
Orders
Payments
Shipping
Identity
```

Abbiamo anche chiarito ownership, contratti e alcuni requisiti non funzionali.

La tentazione naturale potrebbe essere trasformare subito questi confini in servizi.

Non lo faremo.

### Il contesto attuale

Order Operations è ancora un prodotto relativamente piccolo dentro ESI.

Il team è ristretto.

Il traffico non richiede scaling indipendente per modulo.

Non abbiamo ancora osservato cicli di rilascio realmente divergenti.

Non abbiamo un requisito forte di failure isolation tra `Orders`, `Payments` e `Shipping` che richieda processi separati.

Non esistono team autonomi dedicati a ciascuna capability nel perimetro del prodotto.

Quindi, oggi, un'architettura a microservizi comprerebbe soprattutto:

- più deployable;
- più rete;
- più configurazione;
- più observability distribuita;
- più failure mode;

senza comprare abbastanza autonomia.

### La scelta

Per ora adottiamo:

```text
modular monolith
+ confini interni espliciti
+ ownership dei dati
+ contratti tra moduli
+ regole architetturali verificabili
```

Possiamo immaginare una struttura simile:

```text
src/
  order-operations/
  orders/
  payments/
  shipping/
  identity/
  shared-kernel/
```

Ma il valore non è nella cartella.

Il valore è nelle regole.

Per esempio:

- `Orders` non legge direttamente le tabelle interne di `Payments`;
- `Payments` non modifica lo stato ordine;
- `Shipping` espone soltanto capability necessarie attraverso un contratto;
- `Order Operations` aggrega senza diventare source of truth dei domini sottostanti;
- il `shared-kernel` resta piccolo e non contiene business rule specifiche;
- le dipendenze tra moduli sono controllate.

### Stesso database, ownership distinta

Per ora possiamo anche mantenere una singola istanza PostgreSQL.

Ma non adotteremo la regola:

> “è nello stesso database, quindi tutti possono leggere tutto.”

Possiamo definire ownership logica per schema o per gruppi di tabelle.

Per esempio:

```text
orders.*      → Orders
payments.*    → Payments
shipping.*    → Shipping
operations.*  → Order Operations, se introdurrà dati propri
```

Questo non crea un isolamento forte come database separati.

Ma costruisce una semantica utile.

Se un giorno estrarremo `Payments`, avremo già ridotto l'ambiguità.

### ESI introduce una pressione reale

Payments & Risk potrebbe sostenere che il dominio Payments meriti un servizio separato subito, per motivi di sicurezza e governance.

Commerce & Operations potrebbe preferire un deployable unico per ridurre lead time e coordinamento.

Platform Engineering potrebbe ricordare che ogni nuovo servizio porta con sé runtime, pipeline, alerting, ownership operativa e costi.

Nessuna delle tre posizioni è irragionevole.

La domanda è se **oggi** la separazione fisica compra proprietà abbastanza importanti da giustificare il costo.

### Perché non estraiamo Payments adesso

`Payments` potrebbe sembrare il candidato più naturale.

Ha integrazione esterna, security concern e semantica distinta.

Ma dobbiamo verificare il valore concreto.

Oggi:

- il team operativo del prodotto è ancora lo stesso;
- il traffico non richiede scaling indipendente;
- il deployment coordinato non è ancora un problema materiale;
- l'operational overhead di un nuovo servizio sarebbe significativo;
- non abbiamo evidenza che la failure di Payments debba essere isolata tramite un processo separato invece che tramite boundary interni e resource limits.

Quindi non estraiamo.

Ma registriamo i trigger.

### Il compromesso del capitolo

**Esigenza**

Mantenere velocità di delivery senza perdere confini e possibilità di evoluzione.

**Tensione**

Autonomia, deployability e failure isolation contro costo operativo e coordinamento distribuito.

**Decisione**

Order Operations resta, per ora, un modular monolith.

**Costo accettato**

- un deploy può coinvolgere più moduli;
- alcuni failure domain rimangono condivisi;
- non possiamo scalare ogni capability in modo completamente indipendente.

**Quality floor**

Non accettiamo un monolite senza modularità, ownership, testabilità o dependency rules.

**Guardrail**

- boundary espliciti;
- architecture fitness rule;
- ownership dati;
- trigger di estrazione;
- misure su release cadence, scaling e incidenti.

La scorciatoia sarebbe:

> “Facciamo un monolite perché costa meno.”

Il compromesso è:

> “Restiamo nello stesso deployable finché la distribuzione non compra proprietà che valgono il costo, ma costruiamo già confini che rendono possibile cambiare idea.”

### Trigger di revisione

Rivaluteremo `Payments` come servizio indipendente se emergono più segnali tra:

- team ownership dedicata;
- release cadence molto diversa;
- compliance o security boundary più forte;
- necessità di scaling indipendente;
- failure isolation non raggiungibile bene nel deployable condiviso;
- necessità di runtime differente;
- aumento significativo della complessità del modulo.

Lo stesso vale per `Shipping` e per altre capability.

### Non stiamo scegliendo “monolite per sempre”

Questa distinzione è importante.

Non stiamo dicendo:

> “I microservizi non servono.”

Stiamo dicendo:

> **oggi non abbiamo ancora abbastanza ragioni per pagarli.**

È una decisione molto diversa.

Il modular monolith ci permette di preservare optionality.

Se i confini sono buoni, l'estrazione futura diventa più semplice.

Se i confini sono cattivi, trasformarli subito in network boundary li renderebbe soltanto più costosi da correggere.

### Architecture fitness

Possiamo aggiungere regole automatizzate che controllino almeno alcune proprietà.

Per esempio:

- nessun import da `orders/internal` fuori dal modulo;
- nessun accesso diretto alle repository di un altro modulo;
- API interne pubbliche in cartelle esplicite;
- dipendenze cicliche vietate;
- shared kernel limitato.

Non garantiscono una buona architettura.

Ma rendono visibili alcune violazioni.

### La decisione in una frase

> **Order Operations resta un modular monolith finché la separazione fisica non compra proprietà che valgono il suo costo operativo.**

Non è una scelta conservativa.

È una scelta proporzionata.