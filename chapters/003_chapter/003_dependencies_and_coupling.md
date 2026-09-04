## Dipendenze e coupling: ciò che cambia insieme

Ogni sistema contiene dipendenze.

Non possiamo eliminarle tutte, né avrebbe senso provarci.

Un frontend dipende da un contratto.

Un servizio dipende da uno storage.

Un processo di business dipende da dati e side effect.

Il problema non è l'esistenza delle dipendenze.

Il problema è **quanto costano quando il sistema cambia o fallisce**.

## Dipendenza non significa soltanto chiamata

Quando pensiamo a una dipendenza immaginiamo spesso una freccia:

```text
A → B
```

A chiama B.

Ma il coupling può esistere anche senza una chiamata diretta.

Due componenti possono essere accoppiati perché condividono:

- uno schema;
- una tabella;
- una semantica non documentata;
- una convenzione temporale;
- un formato file;
- una sequenza operativa;
- una coda;
- un deployment;
- una configurazione;
- una policy di retry;
- un assumption su ordering;
- un release calendar.

Questo è coupling invisibile.

Non compare necessariamente nel diagramma.

E proprio per questo può essere pericoloso.

## Temporal coupling

Consideriamo due operazioni:

```text
create order
charge payment
```

Se la seconda deve avvenire immediatamente dopo la prima, nello stesso processo e con disponibilità simultanea dei due sistemi, abbiamo temporal coupling.

Questo può essere necessario.

Ma dobbiamo saperlo.

Se invece possiamo accettare:

```text
order created
→ event
→ payment processed later
```

riduciamo un certo tipo di coupling e ne introduciamo altri: eventual consistency, retry e idempotency diventano parte del problema, insieme all'osservabilità del workflow e alla gestione degli stati intermedi. Non esiste eliminazione gratuita del coupling.

Esiste trasformazione.

> **Ogni decoupling sposta complessità da qualche altra parte.**

## Data coupling

Un database condiviso può rendere semplici molte cose.

Una query può attraversare più aree senza API aggiuntive.

Una transazione può rimanere locale.

Un report può leggere direttamente le tabelle.

Ma se molti componenti dipendono direttamente dallo stesso schema, cambiare quel modello diventa costoso.

Il coupling non è “il database condiviso è sempre sbagliato”.

La domanda è:

> quali consumatori dipendono da quale parte del modello e quanto è difficile farlo evolvere?

Un monolite ben modulare può avere un database unico e confini forti.

Un sistema a microservizi può avere database separati ma essere comunque fortemente accoppiato da eventi fragili e release coordinate.

La topologia di deployment non determina da sola il coupling.

## Semantic coupling

Il coupling più insidioso spesso è semantico.

Due componenti usano la parola `status`.

Ma intendono la stessa cosa?

Uno considera `completed` un ordine pagato.

L'altro considera `completed` un ordine consegnato.

Il contratto sintattico può essere valido.

La semantica è incompatibile.

Con agenti AI questo rischio aumenta perché un modello può inferire significati plausibili da nomi, esempi e codice esistente.

Se il repository contiene ambiguità, l'agente può trasformarle in implementazione con grande velocità.

Per questo i contratti importanti devono chiarire non soltanto il tipo dei campi, ma anche il loro significato.

## Change coupling

Un modo pratico per osservare il coupling è guardare la storia dei cambiamenti.

Quali file vengono modificati spesso insieme?

Quali team devono coordinarsi per una singola feature?

Quali deployment devono avvenire nello stesso ordine?

Quali schema migration richiedono aggiornamenti simultanei?

Quali test end-to-end falliscono ogni volta che cambia una parte apparentemente locale?

Questi pattern raccontano il sistema reale meglio di molti diagrammi.

Possiamo definire informalmente **change coupling** come la tendenza di due elementi a richiedere modifiche coordinate.

Se ogni variazione a `Orders` richiede cambiamenti in `Payments`, forse il confine non è quello che pensiamo.

Oppure il dominio richiede davvero quella coordinazione.

In entrambi i casi dobbiamo renderlo esplicito.

## Dependency direction

Non tutte le dipendenze hanno lo stesso peso.

Una decisione fondamentale nel design è la direzione.

Chi conosce chi?

Chi definisce il contratto?

Chi dipende da un dettaglio?

Se il dominio ordini deve conoscere direttamente dettagli del provider di pagamento, un cambio provider può propagarsi profondamente.

Se introduciamo un contratto interno:

```text
Order domain → Payment capability
                    ↑
             Provider adapter
```

abbiamo spostato la dipendenza.

Non abbiamo eliminato il provider.

Abbiamo impedito che il suo modello diventi automaticamente il nostro modello.

Questa idea tornerà quando parleremo di dependency inversion e modularità.

## Fan-in e fan-out mentale

Possiamo usare due domande semplici.

**Fan-out:** da quante cose dipende questo componente per completare il proprio lavoro?

**Fan-in:** quante cose dipendono da questo componente?

Un componente con fan-out elevato può avere molti failure mode.

Un componente con fan-in elevato può avere blast radius elevato.

Non sono metriche da ottimizzare meccanicamente.

Sono segnali.

Un identity provider ha naturalmente fan-in elevato.

Un orchestratore può avere fan-out elevato.

Il punto è sapere dove abbiamo concentrato dipendenze e conseguenze.

## Coupling e autonomia degli agenti

Più un task attraversa dipendenze forti, meno dovremmo trattarlo come modifica locale.

Un agente può modificare una funzione isolata con autonomia relativamente alta.

Ma se una feature tocca:

```text
schema condiviso
+ API pubblica
+ payment provider
+ eventi
+ autorizzazione
```

la delega deve riflettere il blast radius.

Serve più context engineering.

Più acceptance criteria.

Più review indipendente.

Possibilmente un ADR.

La regola non è:

> “Gli agenti non devono fare cambiamenti grandi.”

È:

> **Più grande è la rete di dipendenze coinvolta, più esplicito deve diventare il reasoning che governa il cambiamento.**

## Il coupling che vogliamo

Non tutto il coupling è cattivo.

Un ordine deve essere accoppiato al proprio identificatore.

Una transazione deve rispettare invarianti.

Due concetti che fanno parte della stessa responsabilità possono essere correttamente coesi e quindi cambiare insieme.

Il problema nasce quando il coupling è accidentale o invisibile, non proporzionato al beneficio, non governato oppure contrario ai confini che crediamo di avere. L'obiettivo non è costruire un sistema in cui nulla dipende da nulla.

Sarebbe impossibile e probabilmente inutile.

L'obiettivo è costruire dipendenze **intenzionali e comprensibili**.

> **L'architettura non elimina le dipendenze. Decide quali dipendenze siamo disposti a pagare.**
