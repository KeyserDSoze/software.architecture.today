## Idee chiave

Pensare per sistemi significa allargare lo sguardo abbastanza da vedere le conseguenze della decisione che stiamo prendendo.

Non significa modellare tutto.

Non significa trasformare ogni feature in un programma di enterprise architecture.

Significa evitare che la comodità del perimetro locale nasconda il comportamento end-to-end.

Le idee principali del capitolo sono:

1. Una feature diventa parte di un sistema appena interagisce con dati, dipendenze, utenti e side effect.
2. Il confine del sistema dipende dalla domanda che stiamo cercando di risolvere.
3. Una dipendenza esterna è fuori dal nostro controllo, non fuori dalla nostra responsabilità architetturale.
4. Un confine utile contiene responsabilità, decisioni e conseguenze, non soltanto file.
5. Il coupling può essere sintattico, semantico, temporale, dati condivisi o change coupling.
6. Decoupling non elimina gratuitamente complessità: spesso la trasforma.
7. Gli utenti attraversano critical user journey, non diagrammi di componenti.
8. Availability e performance devono essere osservate anche end-to-end.
9. I feedback loop possono trasformare una tecnica localmente corretta in un comportamento sistemicamente distruttivo.
10. Un failure domain descrive ciò che può fallire insieme.
11. Ridondanza non implica indipendenza del failure.
12. Una Architecture Context Map deve essere costruita per una decisione, non per documentare l'universo.
13. Il repository non contiene necessariamente tutto il sistema reale.
14. Un diagramma generato dall'AI è una ipotesi da verificare, non comprensione automatica.
15. Il system thinking rende più sicura la delega perché rende visibili dipendenze e blast radius.

## Artefatto operativo — Architecture Context Map

Il template standard del capitolo è:

```markdown
# Architecture Context Map

## System of interest

## Actors

## External systems

## Responsibilities

## Data ownership

## Critical journeys

## Dependencies

## Failure domains

## Trust boundaries

## Constraints

## Open questions
```

Può essere accompagnato da uno o più diagrammi.

Non deve diventare obbligatorio per ogni modifica.

La sua profondità deve essere proporzionata al rischio e alla difficoltà di inversione della decisione.

## Esercizio 1 — Allarga il confine

Prendi una feature che hai implementato o progettato di recente.

Descrivila inizialmente nel perimetro più locale possibile.

Poi allarga progressivamente il confine:

```text
funzione
→ modulo
→ applicazione
→ dipendenze
→ processo business
```

A ogni livello rispondi:

- quali nuovi failure mode diventano visibili?
- quali nuove dipendenze emergono?
- quale decisione cambieresti sapendo ciò che vedi adesso?

L'obiettivo non è scegliere il confine più grande.

È capire quale confine serve alla decisione.

## Esercizio 2 — Coupling invisibile

Scegli due componenti che nel diagramma architetturale non hanno una freccia diretta tra loro.

Cerca almeno tre possibili forme di coupling indiretto:

- schema;
- configurazione;
- semantica;
- deployment;
- eventi;
- timing;
- processi manuali;
- librerie condivise.

Per ciascuna, spiega come si manifesterebbe durante un cambiamento.

## Esercizio 3 — Critical user journey

Disegna un journey critico del tuo sistema.

Non usare nomi di componenti come punto di partenza.

Parti da:

```text
intent dell'utente
→ informazioni necessarie
→ decisioni
→ side effect
→ outcome osservabile
```

Solo dopo associa i componenti.

Individua il punto del journey con il maggiore rischio di failure o incoerenza.

## Esercizio 4 — Il sistema è up, l'utente no

Costruisci uno scenario in cui tutti i principali componenti risultano tecnicamente `healthy`, ma il critical user journey non produce valore.

Puoi usare:

- stale data;
- ritardo eventi;
- permission errate;
- inconsistenza;
- latency cumulativa;
- configurazione sbagliata.

Definisci quale segnale operativo permetterebbe di rilevare il problema.

## Esercizio 5 — Retry storm

Hai un servizio A che chiama B.

B inizia a rispondere lentamente.

A effettua tre retry immediati per ogni failure.

Descrivi il feedback loop che può emergere.

Poi proponi una strategia migliore considerando:

- timeout;
- exponential backoff;
- jitter;
- idempotency;
- circuit breaker;
- load shedding.

Non limitarti a elencare pattern.

Spiega quale comportamento sistemico stai cercando di ottenere.

## Esercizio 6 — Failure domain

Considera questa architettura:

```text
3 API instances
2 worker instances
1 managed database
1 identity provider
1 shared configuration service
```

Elenca almeno cinque failure event.

Per ciascuno indica quali elementi possono essere coinvolti contemporaneamente.

Poi rispondi:

> dove abbiamo ridondanza apparente ma failure correlato?

## Esercizio 7 — Architecture Context Map

Costruisci una Context Map per uno dei seguenti casi:

- checkout;
- password reset;
- upload di un documento;
- generazione di una fattura;
- elaborazione di un webhook;
- ricerca ordine.

La mappa deve includere almeno:

- system of interest;
- actor;
- external systems;
- data ownership;
- critical journey;
- failure domain;
- open questions.

Massimo due pagine.

La capacità da allenare è selezionare ciò che conta.

## Esercizio 8 — Adversarial map review con AI

Fornisci a un agente una Architecture Context Map.

Chiedigli:

> “Assumi che questa mappa sia incompleta. Cerca dipendenze nascoste, ownership ambigue, failure correlati, trust boundary mancanti e assunzioni non validate.”

Non accettare automaticamente il risultato.

Classifica ogni osservazione come:

```text
verified
plausible but unverified
irrelevant
wrong
```

Annota quanti punti utili l'agente ha trovato e quanti ha inventato.

## Esercizio 9 — Repository vs runtime

Chiedi a un agente di ricostruire l'architettura di un repository che conosci.

Poi confrontala con ciò che sai dal runtime o dall'operatività reale.

Cerca differenze come:

- integrazioni mancanti;
- job esterni;
- configurazioni;
- processi manuali;
- feature flag;
- dependency reali;
- componenti obsoleti ma ancora presenti.

Scrivi una breve nota:

> “Che cosa non poteva sapere l'agente guardando soltanto il codice?”

## Esercizio 10 — Acme Orders

Usa la Context Map di Acme Orders.

Confronta due alternative:

### Alternativa A

Lookup live verso Orders, Payments e Fulfillment.

### Alternativa B

Read model aggiornato asincronamente.

Non scegliere ancora una tecnologia.

Confronta:

- freshness;
- availability;
- latency;
- failure domain;
- consistency;
- operabilità;
- complexity;
- recovery.

Concludi specificando **quali informazioni mancanti** ti impediscono di prendere una decisione responsabile.

## Domande di autovalutazione

1. Riesco a distinguere il system of interest dal suo ambiente?
2. So spiegare perché il confine dipende dalla domanda?
3. So distinguere ownership da storage?
4. Riesco a trovare coupling che non appare nelle chiamate dirette?
5. So descrivere un critical user journey senza partire dai componenti?
6. Riesco a spiegare come latency e availability emergono end-to-end?
7. So riconoscere un feedback loop destabilizzante?
8. So identificare failure correlati dietro una ridondanza apparente?
9. Riesco a costruire una Context Map che ometta intenzionalmente dettagli irrilevanti?
10. So distinguere una mappa generata dall'AI da una mappa verificata?
11. So dire quali informazioni sul sistema potrebbero non essere presenti nel repository?
12. Riesco a calibrare l'autonomia di un agente in base alle dipendenze attraversate?

Se molte risposte sono “no”, non serve imparare più pattern.

Serve allenarsi a vedere relazioni.

## Cosa cambia con l'AI

Prima dell'AI ricostruire le dipendenze di un sistema grande poteva richiedere molto lavoro manuale.

Oggi possiamo accelerare enormemente:

- repository exploration;
- dependency discovery;
- diagram generation;
- call graph analysis;
- ricerca di consumer;
- failure brainstorming;
- document summarization.

Questo è un vantaggio reale.

Ma la nuova difficoltà è distinguere:

```text
ciò che l'agente ha trovato
```

da:

```text
ciò che l'agente ha inferito
```

e da:

```text
ciò che il sistema fa realmente
```

Il costo della mappa scende.

Il valore della validazione sale.

## Corollario

Nel capitolo precedente abbiamo imparato a formulare il problema prima della soluzione.

Qui abbiamo imparato ad allargare il problema fino a includere le relazioni che possono cambiarne la risposta.

Il prossimo passo sarà decidere quali di queste relazioni sono abbastanza importanti, costose o difficili da cambiare da meritare attenzione architetturale esplicita.

Entreremo quindi nella domanda centrale del libro:

> che cos'è davvero Software Architecture?

Prima, però, conserviamo il principio di questo capitolo:

> **Non progettare il rettangolo. Progetta il comportamento del sistema.**
