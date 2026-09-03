## Monolite, modular monolith e microservizi

Le tre etichette vengono spesso trattate come gradini di una scala evolutiva:

```text
monolite
→ modular monolith
→ microservizi
```

Questa rappresentazione è pericolosa perché suggerisce una direzione obbligatoria.

Come se il monolite fosse l'inizio ingenuo, il modular monolith una fase di transizione e i microservizi la destinazione finale.

Non funziona così.

Sono **topologie differenti**, ognuna con proprietà utili e costi specifici.

### Monolite

In un monolite classico l'applicazione viene costruita e distribuita come un singolo deployable.

Può significare:

```text
frontend server-side
+ domain logic
+ persistence
```

oppure una backend API composta da molte aree funzionali.

Il vantaggio principale è che molte interazioni restano locali.

Una chiamata interna può essere una normale function call.

Una transazione può attraversare più tabelle nello stesso database.

Il deploy è coordinato perché, per definizione, esiste un singolo artefatto principale.

Questo riduce alcune categorie di complessità.

Ma se il codice non ha confini interni forti, il sistema può degradare rapidamente.

Il problema non è avere un singolo processo.

Il problema è che tutto sappia troppo di tutto.

### Modular monolith

Il modular monolith mantiene il vantaggio di un deployable condiviso ma prova a rendere i confini interni intenzionali.

Possiamo immaginare:

```text
Application
├── Orders
├── Payments
├── Shipping
└── Identity
```

Ogni modulo dovrebbe avere:

- responsabilità chiare;
- API interne intenzionali;
- ownership del proprio modello;
- dipendenze controllate;
- test che proteggono i confini;
- possibilmente regole automatizzate che impediscano accessi illegittimi.

La separazione fisica è debole.

La separazione semantica può essere molto forte.

Questo rende il modular monolith particolarmente interessante quando:

- il dominio ha già aree distinte;
- il team non ha bisogno di deploy indipendenti;
- l'operational overhead dei microservizi non sarebbe giustificato;
- vogliamo mantenere la possibilità di estrarre componenti in futuro.

### Microservizi

Con i microservizi alcuni boundary diventano deployable indipendenti.

Questo crea una proprietà potente:

> **la separazione logica può essere accompagnata da autonomia operativa.**

Un servizio può potenzialmente:

- essere rilasciato indipendentemente;
- scalare indipendentemente;
- fallire senza abbattere l'intero sistema;
- avere un proprio ciclo di delivery;
- avere ownership dedicata;
- possedere storage e security boundary differenti.

Ma “può” è importante.

Dividere il codice non garantisce che queste proprietà emergano davvero.

Se due servizi devono essere sempre rilasciati insieme, non abbiamo reale deploy independence.

Se condividono lo stesso database e le stesse tabelle, l'ownership dei dati resta ambigua.

Se un servizio non può rispondere senza chiamarne altri cinque sincronicamente, la failure isolation può essere minima.

Se ogni modifica richiede una riunione tra sei team, l'autonomia organizzativa è teorica.

### Il continuum è più utile delle categorie

Nella realtà esistono molte configurazioni intermedie.

Per esempio:

```text
singolo deployable + singolo database
singolo deployable + ownership logica per schema
più deployable + database condiviso
più deployable + database separati
moduli interni + alcuni servizi estratti
```

Trattare la topologia come un continuum è spesso più utile che cercare l'etichetta perfetta.

La domanda diventa:

> Dove abbiamo bisogno di un boundary logico e dove abbiamo anche bisogno di un boundary operativo?

### Separazione logica e separazione operativa

Possiamo descrivere due assi distinti.

Il primo è la separazione logica:

```text
responsabilità
ownership
contratti
modello
```

Il secondo è la separazione operativa:

```text
deploy
processo
runtime
storage
failure domain
scaling
```

Una decisione matura parte dal primo asse e aggiunge il secondo quando produce valore.

Questo ci dà una regola semplice:

> **non distribuire per ottenere modularità se puoi ottenere modularità senza distribuire.**

La distribuzione dovrebbe comprare qualcosa in più.

Se non sappiamo cosa, forse non serve ancora.