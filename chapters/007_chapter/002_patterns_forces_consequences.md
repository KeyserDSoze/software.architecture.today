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

Per esempio:

- vogliamo cambiare un algoritmo senza modificare chi lo usa;
- vogliamo integrare una dipendenza esterna senza farne trapelare il modello nel dominio;
- vogliamo isolare un guasto invece di propagarlo;
- vogliamo disaccoppiare produttore e consumatore nel tempo;
- vogliamo mantenere una singola fonte di verità evitando accesso diretto indiscriminato al dato.

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

Può:

- proteggere il modello interno;
- ridurre coupling verso una API esterna;
- rendere più semplice sostituire una dipendenza;
- centralizzare mapping ed error handling.

Ma può anche:

- duplicare modelli;
- nascondere capacità importanti della dipendenza;
- diventare un layer di pass-through senza valore;
- complicare debugging e tracing.

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

Per esempio:

- event sourcing;
- saga;
- CQRS distribuito;
- active-active multi-region;
- service mesh;
- event-driven architecture.

Questi pattern hanno conseguenze su dati, failure, deployment, observability, team e operation.

Non dovrebbero essere trattati come semplici scelte di implementazione.

### Pattern e reversibilità

Il costo di un pattern cresce quando cresce la quantità di sistema che deve adattarsi alla sua presenza.

Possiamo chiederci:

- quanti componenti conoscono il pattern?
- quanti dati dipendono dalla sua semantica?
- quanti processi operativi lo assumono?
- quanti team devono coordinarne l'evoluzione?
- quanto è difficile tornare indietro?

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
