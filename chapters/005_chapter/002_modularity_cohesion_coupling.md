## Modularità, cohesion e coupling

Parlare di modularità senza parlare di cohesion e coupling produce spesso una frase vuota:

> “Dividiamo il sistema in moduli.”

La domanda utile è un'altra:

> **Che cosa rende buono un modulo?**

Una risposta pratica è questa:

- contiene cose che hanno una ragione forte per stare insieme;
- espone il minimo necessario;
- limita il numero di cose che devono conoscere i suoi dettagli;
- può cambiare senza obbligare il resto del sistema a cambiare con lui.

Questa è la combinazione che cerchiamo.

### Cohesion: stare insieme per una ragione

La cohesion misura, in modo concettuale, quanto le parti interne a un modulo appartengano alla stessa responsabilità.

Un modulo molto coeso non è semplicemente un modulo piccolo.

Può essere anche grande.

La domanda è se le sue parti cambino prevalentemente per motivi correlati.

Immaginiamo un modulo `Orders` che contiene:

- creazione ordine;
- validazione delle transizioni di stato;
- annullamento;
- calcolo dello stato corrente;
- regole di modifica.

C'è una ragione plausibile per cui queste responsabilità vivano insieme: condividono il significato di “ordine” e le sue invarianti.

Se dentro lo stesso modulo troviamo invece:

- rendering PDF delle fatture;
- gestione utenti;
- invio newsletter;
- retry verso un provider logistico;

il nome `Orders` sta probabilmente nascondendo responsabilità differenti.

### Functional cohesion vs convenience cohesion

Molti moduli nascono non da una responsabilità ma dalla comodità.

Un esempio classico è:

```text
utils/
helpers/
common/
shared/
```

All'inizio sembrano innocui.

Poi diventano il luogo in cui finisce tutto ciò che non sappiamo dove mettere.

Il risultato è un modulo con cohesion bassissima ma coupling altissimo: tutti lo usano.

Questo non significa che un modulo shared sia sempre sbagliato.

Significa che deve avere una responsabilità esplicita.

Per esempio:

```text
shared/time
shared/serialization
shared/observability
```

può essere più leggibile di un contenitore generico di funzioni eterogenee.

### Coupling: quanto costa dipendere

Il coupling non è semplicemente il numero di dipendenze.

Una dipendenza può essere economica o costosa.

Dipendere da una funzione pura e stabile non ha lo stesso costo di dipendere da:

- uno schema database condiviso;
- una chiamata sincrona remota;
- un formato evento instabile;
- un ordine temporale implicito;
- una convenzione non documentata;
- una libreria interna che espone dettagli di implementazione.

Per questo conviene chiedere:

> **Che cosa deve sapere A per usare B correttamente?**

Più conoscenza serve, più il coupling è profondo.

### Coupling sintattico e coupling semantico

Due moduli possono avere un'API piccola e rimanere fortemente accoppiati.

Supponiamo che `Shipping` esponga:

```ts
reserve(orderId: string): Promise<void>
```

L'interfaccia è minimale.

Ma se `Orders` deve sapere che:

- la prenotazione è valida per 15 minuti;
- una seconda chiamata genera un errore irreversibile;
- la risposta può arrivare prima che i dati siano replicati;
- alcuni codici di errore richiedono retry e altri no;

allora il contratto reale è molto più grande della firma TypeScript.

Il coupling semantico vive nelle assunzioni necessarie per usare correttamente la dipendenza.

### Change coupling

Un segnale particolarmente utile è il **change coupling**.

Se ogni volta che modifichiamo A dobbiamo modificare B, C e D, esiste un legame strutturale anche se il diagramma non lo mostra.

Possiamo scoprirlo osservando:

- history dei commit;
- file che cambiano insieme;
- PR che attraversano sempre gli stessi confini;
- test che devono essere aggiornati in cascata;
- deploy coordinati.

L'AI può aiutare molto a esplorare questi pattern in un repository grande.

Ma il risultato va interpretato.

File che cambiano insieme possono farlo per ragioni accidentali.

Non ogni correlazione nella history rappresenta un bounded context nascosto.

### Il costo del coupling dipende dal confine

Una chiamata tra due classi nello stesso processo è diversa da una chiamata tra due servizi distribuiti.

Quando attraversiamo un confine di processo o rete compaiono costi nuovi:

- latency;
- failure parziale;
- timeout;
- retry;
- autenticazione;
- versioning;
- observability;
- deployment indipendente;
- compatibility.

Per questo una separazione concettualmente elegante può essere operativamente pessima.

Un confine logico non richiede automaticamente un confine fisico.

Possiamo avere moduli forti dentro lo stesso deployable.

Questo punto sarà centrale quando parleremo di modular monolith e microservices.

### Cohesion alta, coupling controllato

La formula classica “high cohesion, low coupling” è utile, ma rischia di sembrare uno slogan.

La renderei così:

> **Tieni insieme ciò che condivide le stesse ragioni di cambiamento. Riduci la conoscenza necessaria tra ciò che deve poter cambiare indipendentemente.**

Questo è più operativo.

Non ci dice quanti moduli creare.

Ci dice che cosa osservare.

### Un test pratico

Per ogni modulo possiamo provare a completare queste frasi:

```text
Questo modulo esiste per...

È autorevole su...

Nasconde...

Espone...

Dipende da...

Può cambiare senza coinvolgere...
```

Se non riusciamo a completarle senza usare parole vaghe come “gestione”, “common” o “varie utility”, il confine potrebbe non essere ancora abbastanza chiaro.

Un buon modulo non deve essere perfetto.

Deve essere **comprensibile abbastanza da contenere il cambiamento**.
