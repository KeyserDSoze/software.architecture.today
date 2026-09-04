## Esercizi, autovalutazione e sintesi

Questo capitolo non chiede di memorizzare un catalogo di pattern.

Chiede di allenare una capacità diversa: riconoscere le forze del problema, valutare strutture possibili e rifiutare complessità che non ha ancora un lavoro reale da svolgere.

### Idee chiave

Portiamoci dietro questi punti:

- un pattern non viene prima del problema;
- la struttura è soltanto una parte del pattern;
- problema, forze e conseguenze contano più del nome;
- SOLID è utile come diagnostica, non come generatore automatico di interfacce;
- il pattern locale e il pattern sistemico hanno pesi decisionali molto diversi;
- ogni pattern significativo introduce complexity debt;
- un pattern distribuito modifica failure mode, operabilità e consistenza;
- CQRS non implica necessariamente due database o microservizi;
- event sourcing non è una persistence “più avanzata”;
- retry senza idempotenza, timeout e budget può peggiorare un incidente;
- una cache è una seconda rappresentazione del dato con una politica di coerenza;
- una saga gestisce progressione e compensazione, non un rollback magico;
- conoscere un pattern significa anche sapere quando non usarlo;
- l'AI rende facilissimo generare strutture canoniche e quindi aumenta il rischio di pattern autocomplete.

### Esercizio 1 — Pattern justification

Prendi un pattern già presente in un progetto che conosci.

Compila:

```text
Pattern:

Problema osservato:

Forze:

Beneficio concreto:

Costo introdotto:

Alternativa più semplice:

Segnale che potremmo rimuoverlo:
```

Se non riesci a compilare problema e beneficio senza usare il nome del pattern stesso, approfondisci.

### Esercizio 2 — Il test della rimozione

Scegli tre pattern o astrazioni del tuo repository.

Per ciascuno chiedi:

> “Se lo rimuovessimo, quale requisito o rischio peggiorerebbe materialmente?”

Classifica il risultato:

```text
necessario
utile ma sostituibile
storico
speculativo
decorativo
```

Non rimuovere automaticamente ciò che appare speculativo.

L'obiettivo è capire perché esiste.

### Esercizio 3 — Strategy senza classi

Prendi un esempio classico di Strategy implementato con interface e classi.

Reimplementalo in TypeScript usando funzioni.

Confronta:

- leggibilità;
- testabilità;
- estendibilità;
- quantità di concetti;
- fit con il linguaggio.

Domanda finale:

> il pattern è scomparso oppure è cambiata soltanto la sua forma?

### Esercizio 4 — Adapter boundary

Scegli un'API esterna usata dal tuo progetto.

Elenca tutte le parti del suo modello che oggi trapelano nel dominio:

- nomi di status;
- error code;
- DTO;
- timeout;
- id;
- enum;
- pagination;
- retry semantics.

Disegna un adapter minimale che protegga soltanto le differenze che producono coupling reale.

Evita di costruire un abstraction layer universale.

### Esercizio 5 — Retry storm

Modella questo scenario:

```text
Frontend
→ API Gateway
→ Service A
→ Service B
```

Ogni layer effettua fino a 3 tentativi.

Calcola quante chiamate a `Service B` possono essere generate da una singola richiesta iniziale nel caso peggiore.

Poi ridisegna la retry ownership.

Obiettivo: capire perché una policy locale apparentemente prudente può amplificare il failure a livello sistemico.

### Esercizio 6 — Cache o no?

Prendi una query lenta.

Prima di introdurre caching, rispondi:

- qual è la latency attuale?
- qual è il target?
- quale parte è lenta?
- quanto può essere stale il dato?
- chi invalida?
- cosa succede su cache miss?
- cosa succede se la cache è down?
- esiste una soluzione più semplice, per esempio indice o query migliore?

Scrivi la decisione finale anche se è “non usare cache”.

### Esercizio 7 — Outbox threshold

Immagina un flusso:

```text
conferma ordine
→ salva ordine
→ pubblica OrderConfirmed
```

Descrivi almeno tre modi in cui database e pubblicazione possono divergere.

Poi confronta:

- publish after commit;
- publish before commit;
- transactional outbox.

Per ogni opzione indica failure mode e costo operativo.

### Esercizio 8 — Saga o transazione locale?

Prendi un workflow di business composto da più passi.

Prima prova a mantenerlo dentro una singola transaction boundary.

Poi immagina che i passi appartengano a sistemi autonomi.

Elenca:

- stati intermedi;
- retry;
- compensazioni possibili;
- azioni non compensabili;
- timeout;
- ownership del workflow.

Domanda finale:

> il beneficio della distribuzione paga davvero la saga che stiamo introducendo?

### Esercizio 9 — Pattern autocomplete review

Chiedi a un agente AI di refactorizzare un modulo “usando design pattern e best practice”.

Salva la proposta.

Poi ripeti con questo prompt:

> “Individua soltanto i cambiamenti che oggi sono difficili o rischiosi. Proponi la soluzione minima che riduce quei costi. Introduci un pattern noto solo se una forza osservabile lo giustifica.”

Confronta i due risultati.

Misura:

- numero di file;
- numero di interface;
- numero di nuovi concetti;
- capacità di spiegare ogni astrazione;
- comportamento effettivamente migliorato.

### Esercizio 10 — Order Operations, sei mesi dopo

Simuliamo un cambio di contesto.

Dopo sei mesi:

- il traffico è cresciuto di 20 volte;
- il provider Shipping ha incidenti frequenti di 5–10 minuti;
- le notifiche ordine devono essere affidabili;
- la pagina storico genera picchi elevati durante campagne promozionali;
- il team vuole evitare che Shipping degradi il resto del journey.

Rivaluta la tabella dei pattern del capitolo.

Per ciascuno decidi:

```text
adottare
non adottare
fare spike
misurare prima
```

Motiva sempre con requisiti e failure mode.

### Autovalutazione

Prova a rispondere senza consultare il testo.

1. Perché un pattern non dovrebbe partire dalla struttura?
2. Che cosa sono le “forze” di un pattern?
3. Quando una Strategy è prematura?
4. Perché LSP riguarda anche semantica operativa e non soltanto tipi?
5. Qual è il rischio di un proxy che rende trasparente una chiamata remota?
6. Perché retry può peggiorare un incidente?
7. Quale problema risolve transactional outbox?
8. Perché una compensazione di saga non è un rollback?
9. CQRS richiede necessariamente più database?
10. Quali costi permanenti introduce un pattern sistemico?
11. Che cosa prova il test della rimozione?
12. Perché l'AI aumenta il rischio di abstraction explosion?

Se una risposta contiene soltanto il nome di un pattern, torna alle forze e alle conseguenze.

### Artefatto operativo del capitolo: Pattern Justification

Il capitolo introduce un piccolo artefatto che può accompagnare ADR, issue o design review quando il pattern ha un peso significativo:

```text
Pattern candidate:

Observed problem:

Evidence:

Forces:

Expected benefit:

Simpler alternatives:

Complexity introduced:

Failure modes:

Operational consequences:

Verification plan:

Review / removal trigger:
```

Non deve diventare un modulo obbligatorio per ogni classe.

Serve quando il pattern modifica materialmente il sistema.

### Che cosa cambia con l'AI

Prima il costo di implementare una struttura complessa rappresentava almeno un piccolo freno naturale.

Oggi quel freno è molto più debole.

Possiamo generare architecture layer, adapter, mediator, handler, event bus e test in pochissimo tempo.

Per questo aumenta l'importanza di una domanda precedente all'implementation:

> **Perché questa struttura merita di esistere?**

L'AI può aiutarci a confrontare pattern, costruire spike, trovare alternative e fare adversarial review.

Non dovrebbe essere premiata per la quantità di pattern che riesce a inserire nel repository.

### Corollario

Un pattern è esperienza compressa.

Ma l'esperienza non ci dice di ripetere sempre la stessa soluzione.

Ci insegna a riconoscere situazioni simili, capire quali differenze contano e decidere consapevolmente.

> **Non collezionare pattern. Colleziona capacità di riconoscere problemi.**

E quando una soluzione semplice risolve bene il problema:

> **abbiamo già trovato un pattern molto potente: non aggiungere complessità inutile.**
