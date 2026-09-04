## Design pattern: partire dalla pressione, non dal nome

I design pattern classici restano utili perché molte pressioni locali non sono cambiate. Cambiano linguaggi, framework e strumenti, ma continuiamo ad avere comportamenti che variano, dipendenze esterne da tradurre, costruzioni non banali, responsabilità trasversali da comporre e cambiamenti che più parti del sistema devono osservare.

Il valore del pattern sta nella continuità di questi problemi, non nella longevità del nome.

Studiare i pattern partendo dalla forma porta facilmente a chiedersi dove inserire una `Strategy`, una `Factory` o un `Observer`. Partire dalla pressione produce una domanda migliore:

> **Che cosa sta diventando difficile da cambiare, capire o proteggere?**

Se la risposta è concreta, il nome del pattern può aiutarci a riconoscere una struttura già sperimentata. Se la risposta manca, il pattern rischia di essere soltanto decorazione.

## Quando il comportamento inizia a variare

Supponiamo che una regola possa cambiare indipendentemente dal resto del caso d'uso. Finché esiste una sola variante semplice, un `if` ben posizionato può essere la soluzione più leggibile. Quando le varianti diventano reali, hanno ownership o cicli di cambiamento distinti e iniziano a rendere fragile il chiamante, la variazione merita un nome e un confine.

È la pressione che spesso porta a una **Strategy**.

In Order Operations potremmo, per esempio, avere in futuro politiche differenti per stimare una data di consegna in base a mercato o carrier. Se oggi la regola è una sola, una gerarchia di strategy potrebbe comprare soltanto indirezione. Se domani tre politiche cambiano indipendentemente e vengono testate con scenari differenti, rendere quella variabilità esplicita diventa naturale.

In TypeScript la soluzione potrebbe essere anche una semplice funzione:

```ts
export type DeliveryEstimatePolicy = (
  shipment: Shipment,
  context: DeliveryContext
) => EstimatedDelivery;
```

Il pattern non dipende dalla gerarchia di classi. Dipende dal fatto che abbiamo isolato una dimensione di variazione significativa.

## Quando costruire diventa una responsabilità

Lo stesso ragionamento vale per **Factory**, **Builder** e forme più elaborate di creazione.

Se costruire un oggetto significa:

```ts
const order = new Order(id, customerId);
```

spostare quella riga in `OrderFactory` non protegge necessariamente alcuna decisione.

La costruzione diventa invece una responsabilità quando deve garantire invarianti, selezionare una variante concreta, coordinare configurazioni o impedire stati intermedi non validi. In quel momento centralizzarla può ridurre il numero di punti che devono conoscere quelle regole.

La factory non serve quindi a nascondere `new`.

Serve a contenere conoscenza di costruzione che ha acquisito abbastanza peso da non appartenere più al consumer.

## Quando due mondi parlano lingue diverse

Una delle pressioni più frequenti nei sistemi reali nasce ai confini esterni.

Un carrier potrebbe restituire:

```json
{
  "shipment_state": "IN_TRANSIT",
  "eta_epoch": 1788451200
}
```

mentre il nostro dominio vuole lavorare con:

```ts
interface ShipmentStatus {
  status: "preparing" | "shipped" | "delivered";
  estimatedDelivery?: Date;
}
```

Qui un **Adapter** ha un lavoro molto concreto. Non converte soltanto un formato: decide come il linguaggio esterno entra nel nostro modello. Può concentrare mapping degli stati, normalizzazione degli errori, differenze sugli identificatori e parte della semantica operativa che non vogliamo far trapelare.

L'adapter paga il proprio valore con un modello in più e con un ulteriore punto di tracing. Se diventa un pass-through che replica esattamente il provider senza proteggere nessuna decisione, il pattern ha perso il proprio lavoro.

## Quando una responsabilità attraversa il comportamento

Logging, tracing, authorization, caching e altre responsabilità trasversali possono spingere verso **Decorator**, middleware o pipeline compositive.

La composizione è utile quando evita di mescolare la policy principale con meccanismi ortogonali. Ma ogni livello che rende il flusso più implicito aumenta il costo del debugging.

Una pipeline di dodici middleware può essere formalmente elegante e operativamente opaca. Per essere sana deve rimanere possibile capire in quale ordine avvengano le trasformazioni, quali layer possano interrompere il flusso e dove vengano introdotti side effect.

La forza non è “separare tutto”. È separare ciò che cambia e viene governato per ragioni realmente differenti senza rendere invisibile il comportamento complessivo.

## Quando il cambiamento deve propagarsi

Un'altra pressione compare quando un fatto deve essere osservato da più parti senza costringere chi lo produce a conoscerle tutte.

È il territorio di **Observer**, callback, event emitter, reactive stream e domain event.

Un fatto come:

```text
OrderConfirmed
```

può interessare inventory, notifiche, analytics o shipping. Disaccoppiare producer e consumer riduce conoscenza diretta, ma sposta parte del costo sulla discoverability: leggendo il producer non vediamo più necessariamente tutto ciò che accade dopo.

Quindi il vantaggio del pattern cresce insieme al bisogno di observability, naming disciplinato e ownership dei consumer.

Questa conseguenza diventerà ancora più importante quando l'evento attraverserà processi e reti.

## Quando la trasparenza diventa pericolosa

Pattern come **Proxy** possono centralizzare authorization, instrumentation, lazy loading, caching o remote access. Ma la trasparenza è utile soltanto finché non nasconde differenze che il consumer deve comprendere.

Una chiamata locale e una chiamata remota non hanno lo stesso costo e non falliscono allo stesso modo. Se un proxy fa sembrare la rete una normale invocazione in-memory, può cancellare dal modello mentale proprio latency, timeout e partial failure che dovrebbero influenzare il design.

Information hiding non significa nascondere conseguenze essenziali.

## Il nome viene alla fine

Strategy, Factory, Adapter, Decorator, Observer e Proxy non sono caselle da riempire. Sono nomi che ci permettono di discutere rapidamente strutture già note quando riconosciamo la pressione che le rende utili.

Due team possono risolvere la stessa forza con forme idiomatiche diverse. Una Strategy può essere una classe, una funzione o una tabella di policy. Un Adapter può vivere come oggetto dedicato o come translation boundary molto piccolo. Il pattern sopravvive perché descrive una relazione tra responsabilità, non una sintassi obbligatoria.

La domanda finale resta sempre la stessa:

> **Quale cambiamento o rischio diventa più locale grazie a questa struttura, e quale complessità stiamo aggiungendo in cambio?**

Se sappiamo rispondere, il pattern ha un lavoro.

> **Conoscere un pattern significa riconoscere la pressione che lo rende utile, non riprodurne la forma scolastica.**