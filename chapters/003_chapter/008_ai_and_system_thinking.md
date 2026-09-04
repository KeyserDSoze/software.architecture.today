## AI e pensiero sistemico

L'AI rende più economico esplorare sistemi complessi.

Possiamo chiederle di:

- cercare dipendenze nel repository;
- ricostruire call graph;
- individuare schema condivisi;
- mappare eventi;
- confrontare configurazioni;
- trovare consumer di un'API;
- riassumere ADR;
- identificare aree modificate insieme;
- proporre failure mode;
- generare una prima Architecture Context Map.

Queste capacità sono molto utili.

Ma contengono un rischio.

Possiamo confondere **mappa generata** con **sistema compreso**.

## Il repository non contiene tutto il sistema

Un agente che esplora il codice vede una parte importante della realtà.

Ma potrebbe non vedere:

- procedure operative manuali;
- dipendenze configurate fuori repository;
- feature flag;
- servizi gestiti da altri team;
- integrazioni legacy;
- workaround del supporto;
- dashboard utilizzate durante incidenti;
- vincoli contrattuali;
- dipendenze organizzative;
- traffico reale;
- assunzioni non documentate.

Il codice è evidenza.

Non è sempre il sistema intero.

Per questo una mappa prodotta automaticamente deve essere trattata come **ipotesi da validare**, non come verità.

## AI-assisted architecture discovery

Un workflow utile su un sistema sconosciuto può essere:

```text
1. Repository scan
2. Dependency hypothesis
3. Data ownership hypothesis
4. Critical journey hypothesis
5. Human / documentation validation
6. Runtime evidence
7. Context Map
```

L'ordine conta.

Se saltiamo direttamente da repository scan a diagramma definitivo, rischiamo di rappresentare soltanto ciò che è facile da inferire staticamente.

### Runtime evidence

Il runtime può raccontare una storia diversa dal codice.

Log, metriche e trace possono mostrare:

- chiamate inattese;
- dependency latency;
- retry;
- fan-out reale;
- percorsi poco usati;
- error propagation;
- feature obsolete ma ancora attive.

Quando possibile, la comprensione architetturale dovrebbe combinare:

```text
static structure
+ runtime behavior
+ human context
```

## Chiedere all'AI di cercare ciò che manca

Un buon uso dell'AI non è soltanto:

> “Descrivi questa architettura.”

Può essere molto più utile chiedere:

> “Quali parti del comportamento di questo sistema non possono essere dedotte dal repository?”

Oppure:

> “Quali assunzioni stai facendo sulla source of truth?”

Oppure:

> “Quali dipendenze potrebbero esistere fuori dal codice analizzato?”

Oppure:

> “Assumi che il diagramma sia incompleto. Quali failure mode suggeriscono componenti o processi mancanti?”

Queste domande trasformano l'agente da narratore sicuro a strumento di discovery.

## Architecture by autocomplete

Nel Capitolo 1 abbiamo introdotto il rischio dell'architecture by autocomplete.

Il pensiero sistemico è uno degli antidoti.

Se chiediamo:

> “Come aggiungo caching qui?”

l'agente tenderà a rispondere localmente.

Se forniamo invece:

- journey;
- freshness requirement;
- source of truth;
- consumer;
- failure domain;
- security constraints;

la domanda cambia.

Forse il caching è corretto.

Forse è inutile.

Forse serve una proiezione.

Forse il dato non deve essere cached affatto.

Il contesto amplia lo spazio di ragionamento.

## Multi-agent e local optimum

Più agenti possono accelerare l'analisi.

Per esempio:

```text
Agent A → dependency map
Agent B → security boundaries
Agent C → data ownership
Agent D → failure modes
Agent E → skeptical review
```

Ma se tutti lavorano senza una domanda comune, producono cinque mappe incompatibili.

Ritorna il principio del Capitolo 0:

> **Prima sincronizzare il pensiero. Poi parallelizzare l'esecuzione.**

Il system of interest e il critical journey possono diventare il shared context che mantiene allineate le analisi.

## Il ruolo dello skeptical reviewer

Dopo aver prodotto una Context Map, possiamo assegnare a un agente un ruolo esplicitamente avversariale:

> “Cerca dipendenze mancanti, ownership ambigue, failure correlati e assunzioni che renderebbero questa mappa fuorviante.”

Non vogliamo un secondo agente che ridisegni la stessa cosa in modo più bello.

Vogliamo un agente che cerchi ciò che il primo non ha visto.

Questa distinzione sarà importante in tutto il libro.

L'abbondanza di agenti è utile quando compra **indipendenza di prospettiva**.

## Generated diagram illusion

Un anti-pattern nuovo merita un nome:

### Generated diagram illusion

Il diagramma è pulito.

Le frecce hanno nomi corretti.

I componenti sono allineati.

La sintassi Mermaid compila.

Quindi abbiamo la sensazione di aver capito il sistema.

Ma potrebbero mancare:

- ownership;
- temporality;
- data freshness;
- fallback;
- failure correlation;
- trust boundary;
- processi manuali.

La qualità visiva è un segnale molto debole di qualità architetturale.

> **Un diagramma può essere corretto sintatticamente e sbagliato semanticamente.**

## Context engineering come system engineering

Nei sistemi AI-native, context engineering non riguarda soltanto come ottenere una risposta migliore dal modello.

Riguarda anche quali parti del sistema rendiamo disponibili alla decisione automatizzata.

Se un coding agent vede soltanto il file da modificare, gli stiamo implicitamente dicendo che il resto non conta.

Se vede:

```text
Problem & Outcome Brief
Architecture Context Map
ADR
contracts
NFR
stop conditions
```

gli stiamo fornendo una rappresentazione più fedele della decisione.

La documentazione diventa così parte del controllo architetturale.

## Ma la responsabilità resta epistemica

Anche con strumenti perfetti dobbiamo sapere che cosa non sappiamo.

Questo è un aspetto centrale del mestiere.

Un architect non vale perché possiede una mappa completa.

Vale anche perché riconosce:

- dove la mappa è incompleta;
- quali assunzioni sono fragili;
- quali domande richiedono evidenza runtime;
- quando serve parlare con un altro team;
- quando un agente non può verificare il proprio output.

Il pensiero sistemico non elimina l'incertezza.

La rende visibile abbastanza presto da poterla governare.

> **L'AI può aiutarci a vedere più parti del sistema. Il judgment serve ancora per capire quali parti mancano.**
