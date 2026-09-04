## Esercizi, autovalutazione e sintesi

Questo capitolo non chiede di memorizzare un catalogo di pattern.

Chiede di allenare una capacità diversa: osservare una pressione, distinguerla dal rumore, confrontare strutture possibili e decidere se la complessità introdotta abbia davvero un lavoro da svolgere.

La grammatica che useremo d'ora in avanti è:

```text
problema osservato
→ evidenza
→ forze
→ alternative
→ struttura
→ conseguenze
→ verifica
→ trigger di revisione o rimozione
```

Il nome del pattern viene dentro questo percorso, non prima.

### Idee chiave

Un pattern è esperienza compressa, ma l'esperienza non ci obbliga a ripetere sempre la stessa soluzione. Ci permette di riconoscere situazioni simili e di discutere più velocemente trade-off già noti.

Questo vale per i pattern locali e ancora di più per quelli distribuiti. Una Strategy può costare poco e rimanere confinata a un modulo; outbox, saga, CQRS distribuito o event sourcing modificano invece dati, failure mode, recovery, osservabilità e modello operativo. Il nome “pattern” non deve appiattire questa differenza di peso.

SOLID è utile nello stesso modo: come diagnostica. Le ragioni di cambiamento, la sostituibilità comportamentale, la conoscenza richiesta da un consumer e la direzione delle dipendenze sono domande. Non sono una procedura che genera automaticamente interfacce.

Retry, cache e messaging mostrano bene perché il trade-off debba rimanere visibile. Un retry può aumentare reliability oppure trasformarsi in retry storm. Una cache può ridurre latency ma diventa una seconda rappresentazione del dato con una policy di coerenza. Una queue può disaccoppiare nel tempo oppure inserire asincronia in un journey che richiede una risposta immediata.

La stessa disciplina vale quando decidiamo di **non** usare un pattern. Rifiutare complessità non significa rifiutare robustezza. Significa chiedere che ogni struttura superi una soglia di adozione collegata a evidenza, rischio o requisito.

Con l'AI questa disciplina diventa più importante, perché il costo iniziale di generare astrazioni e infrastruttura è molto più basso del costo permanente di comprenderle e operarle.

---

# Esercizi

## Esercizio 1 — Pattern justification

Prendi un pattern già presente in un progetto che conosci.

Compila:

```text
Pattern:

Problema osservato:

Evidenza:

Forze:

Beneficio concreto:

Costo introdotto:

Alternativa più semplice:

Segnale che potremmo rimuoverlo:
```

Se non riesci a descrivere problema e beneficio senza usare il nome del pattern stesso, approfondisci prima di giudicarlo.

## Esercizio 2 — Il test della rimozione

Scegli tre pattern o astrazioni del tuo repository.

Per ciascuno chiedi:

> “Se lo rimuovessimo, quale requisito, rischio o costo diventerebbe materialmente peggiore?”

Classifica il risultato:

```text
necessario
utile ma sostituibile
storico
speculativo
decorativo
```

Non rimuovere automaticamente ciò che appare speculativo o storico. Prima verifica se il contesto originale esiste ancora e se la rimozione ha conseguenze che il codice non rende evidenti.

## Esercizio 3 — Strategy senza classi

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

## Esercizio 4 — Adapter boundary

Scegli un'API esterna usata dal tuo progetto.

Individua quali parti del suo modello oggi trapelano nel dominio: nomi di status, error code, DTO, identificatori, enum, pagination, timeout e retry semantics sono candidati frequenti.

Poi disegna un adapter minimale che protegga soltanto le differenze che producono coupling reale.

Evita di costruire un abstraction layer universale. Per ogni elemento nascosto spiega quale decisione diventa più locale.

## Esercizio 5 — Retry storm

Modella questo scenario:

```text
Frontend
→ API Gateway
→ Service A
→ Service B
```

Ogni layer effettua fino a 3 tentativi della chiamata successiva.

Calcola quante chiamate a `Service B` possono essere generate da una singola richiesta iniziale nel caso peggiore.

Poi ridisegna la retry ownership specificando:

- quale layer decide;
- quali failure sono retryable;
- backoff;
- limite massimo;
- idempotenza;
- latency budget.

Obiettivo: capire perché una policy locale apparentemente prudente può amplificare un failure sistemico.

## Esercizio 6 — Cache o no?

Prendi una query lenta.

Prima di introdurre caching, rispondi:

- qual è la latency attuale?
- qual è il target?
- quale parte è lenta?
- quanto può essere stale il dato?
- chi invalida?
- cosa succede su cache miss?
- cosa succede se la cache è down?
- esiste una soluzione più semplice, per esempio un indice, una query migliore o una diversa shape del dato?

Scrivi la decisione finale anche se è “non usare cache”.

## Esercizio 7 — Outbox threshold

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

Per ogni opzione indica failure mode, garanzie ottenute, duplicati possibili e costo operativo.

Domanda finale:

> il problema commit-publish è abbastanza importante da pagare la outbox in questo contesto?

## Esercizio 8 — Saga o transazione locale?

Prendi un workflow di business composto da più passi.

Prima prova a mantenerlo dentro una singola transaction boundary.

Poi immagina che i passi appartengano a sistemi autonomi.

Rendi espliciti:

- stati intermedi;
- retry;
- compensazioni possibili;
- azioni non compensabili;
- timeout;
- ownership del workflow;
- osservabilità necessaria.

Domanda finale:

> il beneficio della distribuzione paga davvero la saga che stiamo introducendo?

## Esercizio 9 — Pattern autocomplete review

Chiedi a un agente AI di refactorizzare un modulo con una richiesta deliberatamente vaga:

> “Usa design pattern e best practice.”

Salva la proposta.

Poi ripeti con:

> “Individua soltanto i cambiamenti che oggi sono difficili o rischiosi. Porta evidenza dal repository. Proponi la soluzione minima che riduce quei costi. Introduci un pattern noto solo se una forza osservabile lo giustifica.”

Confronta i due risultati osservando:

- numero di file;
- numero di interface;
- numero di nuovi concetti;
- capacità di spiegare ogni astrazione;
- evidenza usata;
- comportamento effettivamente migliorato.

## Esercizio 10 — Order Operations, sei mesi dopo

Simuliamo un cambio di contesto.

Dopo sei mesi:

- il traffico è cresciuto di 20 volte;
- il provider Shipping ha incidenti frequenti di 5–10 minuti;
- le notifiche ordine devono essere affidabili;
- la pagina storico genera picchi elevati durante campagne promozionali;
- il team vuole evitare che Shipping degradi il resto del journey.

Rivaluta la mappa dei pattern del capitolo.

Per ciascun candidato decidi:

```text
adottare
non adottare
fare spike
misurare prima
```

Considera almeno circuit breaker, bulkhead, queue, caching, outbox e read model dedicato.

Motiva sempre con requisito, evidenza e failure mode. Non adottare un pattern soltanto perché il nuovo scenario è “più grande”.

## Esercizio 11 — Pattern locale o decisione architetturale?

Classifica queste scelte per peso decisionale:

```text
Strategy locale per pricing
Adapter verso un provider
middleware di tracing
cache distribuita
transactional outbox
CQRS con read model separato
event sourcing
saga multi-servizio
```

Per ciascuna valuta:

- blast radius;
- costo di inversione;
- impatto sui dati;
- impatto operativo;
- bisogno di ADR o documentazione condivisa.

L'obiettivo non è trovare una classificazione universale, ma imparare a distinguere pattern con conseguenze molto diverse.

---

# Domande di autovalutazione

Prova a rispondere senza consultare il testo.

1. Perché un pattern non dovrebbe partire dalla struttura?
2. Che cosa sono le forze di un pattern?
3. Quale differenza c'è tra pattern e sua implementazione idiomatica?
4. Quando una Strategy è prematura?
5. Perché LSP riguarda anche semantica operativa e non soltanto tipi?
6. Qual è il rischio di un proxy che rende trasparente una chiamata remota?
7. Perché retry può peggiorare un incidente?
8. Quale problema preciso risolve transactional outbox?
9. Perché una compensazione di saga non è un rollback?
10. CQRS richiede necessariamente più database?
11. Perché una cache è anche un problema di consistency?
12. Quali costi permanenti introduce un pattern sistemico?
13. Che cosa prova il test della rimozione?
14. Che cosa significa pattern threshold?
15. Perché l'AI aumenta il rischio di abstraction explosion?
16. Quando un pattern significativo deve entrare nello shared context del repository?

Se una risposta contiene soltanto il nome di un pattern, torna a problema, evidenza, forze e conseguenze.

---

# Artefatto operativo — Pattern Justification

Quando un pattern modifica materialmente il sistema, possiamo accompagnare ADR, issue o design review con questo blocco:

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

Serve a impedire che una struttura significativa entri nel sistema senza il reasoning che la rende comprensibile e contestabile.

Per Order Operations l'artefatto ci permette di dire perché Adapter, timeout e retry selettivo hanno già superato la soglia, mentre circuit breaker, outbox, saga ed event sourcing no.

---

# Cosa cambia con l'AI

Prima il costo di implementare una struttura complessa rappresentava almeno un piccolo freno naturale.

Oggi quel freno è molto più debole. Possiamo generare architecture layer, adapter, mediator, handler, event bus, configurazione e test in pochissimo tempo.

Questo sposta il collo di bottiglia dal produrre struttura al **giustificarla e possederla**.

L'AI può esplorare alternative, cercare evidenza in repository grandi, costruire spike, confrontare failure mode e fare adversarial review. Può anche verificare che una struttura già adottata venga rispettata.

Non dovrebbe essere premiata per la quantità di pattern che riesce a inserire nel codice.

La domanda precedente all'implementation rimane:

> **Perché questa struttura merita di esistere, e quale evidenza ci farà cambiare idea?**

---

# Corollario

Un pattern è esperienza compressa.

L'esperienza non ci dice di ripetere sempre la stessa soluzione. Ci insegna a riconoscere situazioni simili, capire quali differenze contano e decidere consapevolmente.

> **Non collezionare pattern. Colleziona capacità di riconoscere problemi, forze e conseguenze.**

E quando una soluzione semplice soddisfa bene il contesto:

> **non aggiungere complessità soltanto perché ora è economico generarla.**