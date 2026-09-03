# Capitolo 8 — Il monolite non è il nemico

La parola *monolite* viene spesso usata come diagnosi.

Non come descrizione.

Quando un sistema cresce male, quando i deploy diventano rischiosi, quando una modifica apparentemente locale rompe tre aree diverse, quando il database è condiviso senza ownership e il team ha paura di toccare il codice, qualcuno prima o poi dirà:

> “Il problema è che è un monolite.”

A volte è vero.

Molto spesso è incompleto.

Il problema potrebbe essere che il sistema ha confini deboli, coupling elevato, ownership confusa, test insufficienti o processi di rilascio fragili.

Tutte cose che possono esistere dentro un monolite.

Ma possono esistere anche dentro trenta microservizi.

Un sistema distribuito non diventa automaticamente modulare soltanto perché i moduli sono finiti su processi diversi.

Può diventare un **distributed monolith**: molti deployable, molti network hop, molti log da correlare e la stessa incapacità di cambiare una parte senza trascinarsi dietro le altre.

Quindi partiamo da una distinzione fondamentale:

```text
modularità logica
≠
topologia fisica
```

Possiamo avere ottimi confini dentro un singolo deployable.

Possiamo avere pessimi confini dentro una flotta di servizi.

### Che cosa stiamo davvero decidendo

Quando scegliamo tra monolite, modular monolith e microservizi non stiamo scegliendo quanto vogliamo essere moderni.

Stiamo decidendo come distribuire:

- ownership;
- deployability;
- failure isolation;
- dati;
- comunicazione;
- capacità di scalare;
- autonomia dei team;
- responsabilità operativa;
- costo cognitivo;
- costo infrastrutturale.

Ogni opzione sposta il confine della complessità.

Il monolite concentra molta complessità nel codice e nel deployable.

I microservizi spostano parte di quella complessità verso rete, observability, deployment, data consistency, security, incident response e platform engineering.

Non esiste una topologia che faccia sparire la complessità.

Esistono topologie che la **collocano in posti diversi**.

### Il monolite non è un unico tipo di sistema

“Monolite” può descrivere sistemi molto differenti.

Un'applicazione con un singolo deployable ma moduli indipendenti, ownership chiara e contratti interni espliciti è molto diversa da un'applicazione in cui qualunque componente legge e modifica qualunque tabella.

Nel primo caso potremmo avere un **modular monolith**.

Nel secondo abbiamo probabilmente un *big ball of mud* che, incidentalmente, viene distribuito come una sola applicazione.

La differenza non è estetica.

È nella struttura delle dipendenze.

Un modular monolith può avere:

```text
Orders
Payments
Shipping
Identity
```

nello stesso processo, ma con una regola forte:

```text
ogni modulo possiede il proprio comportamento
ogni modulo espone contratti intenzionali
gli altri moduli non attraversano liberamente i suoi internals
```

Questo è già design architetturale serio.

Non è un microservizio incompleto.

### Perché i microservizi esistono

I microservizi non sono nati perché chiamare una funzione in rete fosse migliore che chiamarla nello stesso processo.

La rete è quasi sempre più complicata.

Il valore emerge quando la separazione fisica compra proprietà che ci servono realmente.

Per esempio:

- deploy indipendenti;
- failure isolation;
- scaling indipendente;
- ownership organizzativa più netta;
- security boundaries differenti;
- technology/runtime independence dove ha valore;
- cicli di delivery realmente autonomi.

Se non stiamo comprando nessuna di queste proprietà, dovremmo chiederci che cosa stiamo pagando.

Perché pagheremo comunque:

- service discovery;
- networking;
- timeout;
- retry;
- tracing distribuito;
- versioning dei contratti;
- consistenza distribuita;
- operabilità;
- coordinamento degli incidenti;
- pipeline multiple;
- security tra servizi.

### Un confine non deve diventare immediatamente un servizio

Nel capitolo precedente abbiamo identificato responsabilità distinte in Acme Orders.

Per esempio:

```text
Orders
Payments
Shipping
```

Questo non implica:

```text
Orders Service
Payments Service
Shipping Service
```

almeno non ancora.

Un buon confine logico ci dà la possibilità di distribuire in seguito.

Non ci obbliga a farlo subito.

Questa proprietà è preziosa.

Possiamo costruire modularità prima di comprare distribuzione.

Possiamo osservare quali moduli cambiano insieme, quali hanno profili di carico diversi, quali soffrono failure differenti e quali richiedono ownership indipendente.

Poi decidere.

Questo approccio evita uno dei bias più costosi della progettazione moderna:

> **trasformare ogni boundary concettuale in un boundary di rete.**

### La domanda del capitolo

Non chiederemo:

> “Meglio monolite o microservizi?”

È una domanda troppo povera.

Chiederemo invece:

> **Quale topologia permette ai nostri confini di produrre le proprietà che ci servono, pagando un costo operativo che possiamo sostenere?**

È una domanda meno ideologica.

E molto più utile.

Alla fine del capitolo dovremmo essere capaci di spiegare:

- quando un monolite è una scelta sana;
- quando un modular monolith crea un ottimo equilibrio;
- quali segnali suggeriscono che una separazione fisica sta diventando utile;
- quali segnali indicano invece microservices by default;
- come evitare il distributed monolith;
- perché team boundaries e service boundaries sono collegati ma non identici;
- come l'AI può rendere più facile estrarre servizi senza rendere automaticamente sensato farlo.

La topologia verrà dopo i confini.

Non prima.