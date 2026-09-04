## Order Operations: per ora resta un modular monolith

Arriviamo alla prima decisione esplicita sulla topologia di Order Operations.

Nei capitoli precedenti abbiamo già costruito parecchio contesto. Sappiamo che esistono responsabilità distinte:

```text
Order Operations
Orders
Payments
Shipping
Identity
```

Sappiamo chi possiede gli stati autorevoli, quali dipendenze esterne esistono, quali quality attribute contano e quali pattern sono già giustificati.

La tentazione naturale è trasformare questi confini in servizi.

Non lo faremo ancora.

## Il boundary esiste. La necessità di rete no

Order Operations è ancora un prodotto relativamente piccolo dentro ESI. Il team è ristretto, il traffico non richiede scaling indipendente per modulo e non abbiamo osservato release cadence materialmente divergenti.

Orders, Payments e Shipping hanno semantiche distinte, ma questo è un argomento per avere boundary forti, non automaticamente per avere tre deployable.

Oggi non abbiamo neppure un requisito di failure isolation abbastanza forte da richiedere processi separati, né team autonomi dedicati a ciascuna capability nel perimetro del prodotto.

Quindi una decomposizione a microservizi comprerebbe certamente più rete, più pipeline, più configurazione e più observability distribuita.

Non è ancora chiaro che comprerebbe abbastanza autonomia in cambio.

## La scelta topologica

Per questa fase scegliamo:

```text
modular monolith
+ confini interni espliciti
+ ownership dei dati
+ contratti tra moduli
+ dependency rules verificabili
```

Una struttura possibile può essere:

```text
src/
  order-operations/
  orders/
  payments/
  shipping/
  identity/
  shared-kernel/
```

La cartella non è il boundary.

Il boundary esiste perché alcune regole vengono fatte rispettare.

Orders non legge direttamente le tabelle interne di Payments. Payments non modifica `OrderStatus`. Shipping espone capability intenzionali invece di rendere pubblico il proprio modello interno. Order Operations aggrega le informazioni senza diventare source of truth dei domini sottostanti. Il `shared-kernel` rimane piccolo e non diventa il luogo in cui si accumulano business rule condivise per comodità.

Queste proprietà sono la vera architettura.

## Un database fisico, ownership logica distinta

Per ora manteniamo anche una singola istanza PostgreSQL.

Questo non significa adottare la regola:

> “È nello stesso database, quindi tutti possono leggere tutto.”

Possiamo definire ownership come:

```text
orders.*      → Orders
payments.*    → Payments
shipping.*    → Shipping
operations.*  → Order Operations, se introdurrà dati propri
```

La separazione non è forte quanto avere datastore indipendenti, ma il significato è già chiaro: ogni dato ha un owner e gli altri moduli devono passare attraverso un contratto deliberato.

Questa scelta compra optionality. Se un giorno Payments verrà estratto, non dovremo prima scoprire chi possiede le sue tabelle e quante query nascoste le attraversino.

## Payments è il candidato più interessante, ma non ancora abbastanza

Dentro ESI, Payments & Risk potrebbe sostenere che Payments meriti subito un servizio separato per ragioni di security e governance.

L'argomento è serio.

Payments integra provider esterni, possiede semantica economica distinta e potrebbe in futuro avere requisiti di audit o compliance più forti.

Ma la decisione va presa sul contesto attuale.

Oggi il team operativo del prodotto è ancora lo stesso. Il traffico non richiede scaling indipendente. Il deployment coordinato non è un problema materiale. Non abbiamo evidenza che la failure di Payments debba essere isolata tramite processo separato invece che con boundary interni, timeout, resource limit e graceful degradation dove possibile.

L'operational overhead di un nuovo servizio sarebbe invece immediato.

Per questo non estraiamo Payments adesso.

Non ignoriamo la pressione.

La trasformiamo in trigger di revisione.

## ADR-002 — Mantenere Order Operations come modular monolith

```markdown
# ADR-002 — Mantenere Order Operations come modular monolith

Status: accepted

## Contesto

Order Operations contiene boundary distinti per Orders, Payments, Shipping e Identity.
Il team è piccolo, il traffico è moderato e non esistono oggi esigenze forti di deploy o scaling indipendente per modulo.

## Problema

Dobbiamo scegliere se trasformare subito i boundary logici in deployable separati o mantenere un'unica unità di deployment.

## Architecturally Significant Requirements

- ownership semantica e dei dati deve rimanere distinta;
- il sistema deve essere operabile da un team piccolo;
- correctness e authorization restano quality floor;
- la topologia deve preservare possibilità di estrazione futura;
- il costo operativo deve rimanere proporzionato alla fase del prodotto.

## Alternative considerate

1. modular monolith con boundary interni forti;
2. microservizi separati per Orders, Payments e Shipping;
3. estrazione immediata del solo Payments.

## Decisione

Mantenere un singolo deployable con moduli espliciti e ownership dei dati distinta.

## Motivazione

La distribuzione non compra ancora abbastanza deployability, scaling, failure isolation o team autonomy da giustificare il costo operativo aggiuntivo.
I boundary logici possono essere protetti senza introdurre subito network boundary.

## Conseguenze positive

- minore complessità operativa;
- transazioni e debugging più locali;
- delivery semplice per il team attuale;
- possibilità di maturare i boundary prima dell'estrazione.

## Conseguenze negative

- deploy coordinato del deployable;
- alcuni failure domain restano condivisi;
- scaling non completamente indipendente;
- process isolation limitata.

## Guardrail

- dependency rule tra moduli;
- ownership esplicita per dati e repository;
- shared kernel limitato;
- architecture test dove possibile;
- metriche su release cadence, carico e incidenti.

## Trigger di revisione

Rivalutare una estrazione quando convergono più segnali tra:
- team ownership dedicata;
- release cadence significativamente differente;
- security o compliance boundary più forte;
- scaling indipendente economicamente utile;
- failure isolation non raggiungibile bene nel deployable condiviso;
- runtime o technology fit realmente differente;
- crescita del change coupling nonostante i boundary interni.
```

Questa ADR completa la decisione del Capitolo 4. ADR-001 diceva che il lookup rimane live finché i requisiti non giustificano un read model dedicato. ADR-002 dice che anche la topologia rimane semplice finché la distribuzione non compra proprietà sufficienti.

Le due decisioni seguono la stessa filosofia: **non implementare oggi la complessità del futuro; preservare però abbastanza struttura da poterla introdurre quando il trigger sarà reale**.

## Architecture fitness: proteggere il monolite dalla deriva

Scegliere un modular monolith senza proteggere i boundary sarebbe soltanto rinviare il problema.

Possiamo trasformare alcune regole in controlli eseguibili. Per esempio:

```text
nessun import da orders/internal fuori da Orders
nessun accesso diretto alle repository di un altro modulo
dipendenze cicliche vietate
API interne pubbliche in namespace espliciti
shared kernel sottoposto a review più severa
```

Queste regole non garantiscono cohesion o buon domain modeling.

Impediscono però alcune violazioni meccaniche che, lasciate crescere, renderebbero l'estrazione futura molto più costosa.

## Non stiamo scegliendo “monolite per sempre”

La decisione non dice che i microservizi non servano.

Dice qualcosa di più preciso:

> **oggi non abbiamo ancora abbastanza ragioni per pagarli.**

Se Payments otterrà un team dedicato, una release cadence molto più alta, nuovi constraint di compliance e un bisogno reale di failure isolation, ADR-002 potrà essere superseded.

In quel momento l'estrazione non sarà una moda né una promozione del modulo.

Sarà la risposta a un contesto cambiato.

> **Order Operations resta un modular monolith finché la separazione fisica non compra proprietà che valgono il suo costo operativo.**