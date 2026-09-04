## Problema, forze, struttura, conseguenze

Un pattern diventa utile quando smettiamo di guardarlo come una forma e iniziamo a guardarlo come una relazione tra quattro elementi:

```text
problema
→ forze
→ struttura
→ conseguenze
```

Questa sequenza è più importante del nome del pattern.

### Il problema

Il problema descrive una tensione ricorrente.

Per esempio, potremmo voler cambiare un algoritmo senza modificare chi lo usa, oppure integrare una dipendenza esterna senza farne trapelare il modello nel dominio. In altri casi vogliamo isolare un guasto, disaccoppiare produttore e consumatore nel tempo o proteggere una singola fonte di verità dall'accesso diretto indiscriminato. Il pattern ha senso quando quella tensione esiste davvero.

Un buon problema statement evita già metà degli abusi.

Se non riusciamo a dire quale tensione stiamo risolvendo, il pattern probabilmente è prematuro.

### Le forze

Le forze sono ciò che rende il problema non banale.

Sono requisiti che tirano la soluzione in direzioni differenti.

Per esempio:

```text
bassa latency
vs
isolamento

semplicità
vs
estendibilità

consistency immediata
vs
disponibilità

indipendenza dei componenti
vs
visibilità globale

velocità di delivery
vs
reversibilità
```

Il pattern prova a trovare una composizione ragionevole tra queste forze.

Non le elimina.

### La struttura

La struttura è la parte più facile da copiare.

È anche quella meno interessante se viene separata dal resto.

Una Strategy può essere rappresentata con un'interfaccia e diverse implementazioni.

Un Adapter con un wrapper che converte un contratto esterno in uno interno.

Una queue con producer, broker e consumer.

Un circuit breaker con stati closed, open e half-open.

Ma replicare la struttura non garantisce che il problema esista davvero.

### Le conseguenze

Ogni pattern produce conseguenze positive e negative.

Questa è la parte che dovremmo discutere più spesso.

Prendiamo un Adapter.

Può proteggere il modello interno e ridurre il coupling verso un'API esterna, rendere più semplice sostituire la dipendenza e concentrare mapping ed error handling in un punto intenzionale.

Ma può anche duplicare modelli, nascondere capacità importanti della dipendenza e degenerare in un layer di pass-through che aggiunge poco valore. In quel caso debugging e tracing diventano più difficili senza che il confine abbia realmente comprato indipendenza.

Lo stesso pattern può quindi essere eccellente o inutile a seconda del contesto.

### Pattern come ipotesi

Un modo utile di trattare i pattern è considerarli ipotesi progettuali.

Invece di dire:

> “Useremo il pattern X.”

possiamo dire:

> “Crediamo che il pattern X riduca questo rischio pagando questi costi. Lo adotteremo finché queste forze restano vere.”

Il pattern entra così nello stesso sistema di decisioni degli ADR.

Può avere trigger di revisione.

Può essere rimosso.

Può essere semplificato.

### Pattern locali e pattern sistemici

Non tutti i pattern hanno lo stesso peso.

Alcuni sono quasi interamente locali.

Per esempio una Strategy usata dentro un singolo modulo può essere sostituita con costo contenuto.

Altri modificano profondamente il comportamento del sistema.

Event sourcing, saga, CQRS distribuito, active-active multi-region, service mesh ed event-driven architecture sono esempi di pattern o stili il cui costo tende a propagarsi ben oltre il file in cui vengono introdotti.

Questi pattern hanno conseguenze su dati, failure, deployment, observability, team e operation.

Non dovrebbero essere trattati come semplici scelte di implementazione.

### Pattern e reversibilità

Il costo di un pattern cresce quando cresce la quantità di sistema che deve adattarsi alla sua presenza.

Per stimarne il peso possiamo chiederci quanti componenti e quanti dati dipendano dalla sua semantica, quanti processi operativi lo assumano e quanti team debbano coordinarne l'evoluzione. La domanda finale è quanto costi tornare indietro quando il contesto cambia.

Una Factory locale e un'architettura event sourced non hanno lo stesso peso decisionale.

Il nome “pattern” non dovrebbe appiattire questa differenza.

### Il test delle forze

Prima di adottare un pattern significativo, possiamo scrivere:

```text
Pattern candidato:

Problema:

Forze presenti:
- ...
- ...

Beneficio atteso:

Costo introdotto:

Alternative più semplici:

Segnale che il pattern non serve più:
```

Questo piccolo esercizio elimina molte scelte decorative.

Se il campo “forze presenti” contiene soltanto frasi vaghe come “scalabilità futura” o “best practice”, non abbiamo ancora una motivazione sufficiente.

> **Il pattern non è la risposta. È una risposta possibile quando le forze del problema la rendono conveniente.**
