## Idee chiave

Pensare per sistemi non significa modellare tutto. Significa allargare lo sguardo abbastanza da vedere le relazioni che possono cambiare la decisione che stiamo prendendo. Una feature smette di essere locale appena usa dati, attraversa un boundary, introduce un side effect o dipende da qualcosa che può degradare il suo comportamento.

Il confine del sistema, perciò, non è una proprietà assoluta. Dipende dalla domanda. Per capire una query lenta può bastare osservare API e database; per capire perché un operatore prende una decisione sbagliata dobbiamo forse includere Identity, fonti autorevoli, proiezioni, freshness e processi operativi. Una dipendenza esterna rimane fuori dal nostro controllo diretto, ma non esce dalla nostra responsabilità architetturale: possiamo sempre decidere **come** dipendere da essa.

Anche il coupling va cercato oltre le chiamate esplicite. Schema condiviso, semantica, timing, configurazione, deployment e release coordinate possono far cambiare due parti insieme senza che esista una freccia evidente nel diagramma. Decoupling non elimina gratuitamente questa complessità: spesso la trasforma, scambiando per esempio dipendenza sincrona con eventual consistency, retry, idempotency e nuovi stati intermedi.

Il critical user journey ci ricorda poi che l'utente non consuma componenti. Consuma un comportamento end-to-end. Availability, latency e correttezza devono quindi essere osservate anche lungo quel percorso. Un sistema può restituire `200 OK` ovunque e fallire comunque dal punto di vista dell'utente perché il dato è vecchio, una permission è sbagliata o una dipendenza degradata produce un risultato ambiguo.

Infine, feedback loop e failure domain mostrano perché il comportamento sistemico non può essere dedotto sommando la bontà dei singoli componenti. Un retry localmente ragionevole può alimentare un retry storm; una ridondanza apparente può condividere la stessa causa di failure; una source of truth può distribuire rapidamente anche un errore. L'architettura deve quindi ragionare su propagazione, correlazione, blast radius e recovery, non soltanto sul happy path.

Con l'AI questo modo di pensare diventa ancora più importante. Gli agenti possono accelerare discovery, dependency mapping e diagram generation, ma una mappa generata resta un'ipotesi finché non viene confrontata con runtime evidence, documentazione e contesto umano. Il costo di produrre una rappresentazione scende; il valore di sapere che cosa è stato osservato, inferito o ancora non verificato cresce.

## Artefatto operativo — Architecture Context Map

La Context Map resta intenzionalmente strutturata perché deve essere usata, non soltanto letta.

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

Non è obbligatoria per ogni modifica e non deve contenere tutto. La sua profondità deve seguire rischio, blast radius e difficoltà di inversione della decisione. Può usare Mermaid, C4 o altre viste quando aiutano; la notazione è secondaria rispetto al reasoning che rende visibile.

---

# Esercizi

Gli esercizi mantengono una forma strutturata perché servono come strumenti di pratica e confronto. L'obiettivo non è produrre diagrammi belli, ma imparare a scegliere il confine giusto, vedere coupling nascosto e distinguere struttura osservata da comportamento inferito.

## 1. Allarga il confine

Prendi una feature che hai implementato o progettato di recente. Descrivila inizialmente nel perimetro più locale possibile, poi allarga progressivamente lo sguardo:

```text
funzione
→ modulo
→ applicazione
→ dipendenze
→ processo business
```

A ogni livello annota quali nuovi failure mode e dipendenze diventano visibili e quale decisione cambieresti grazie al contesto aggiunto.

L'obiettivo non è scegliere il confine più grande. È capire quale confine serve alla decisione.

## 2. Coupling invisibile

Scegli due componenti che nel diagramma architetturale non hanno una freccia diretta tra loro. Cerca almeno tre forme di coupling indiretto tra schema, configurazione, semantica, deployment, eventi, timing, processi manuali o librerie condivise.

Per ciascuna spiega come quel coupling diventerebbe visibile durante un cambiamento o un failure.

## 3. Critical user journey

Disegna un journey critico del tuo sistema senza partire dai nomi dei componenti. Parti invece da:

```text
intent dell'utente
→ informazioni necessarie
→ decisioni
→ side effect
→ outcome osservabile
```

Solo dopo associa i componenti che partecipano al percorso. Individua il punto in cui failure, latency o incoerenza avrebbero l'impatto maggiore sull'outcome.

## 4. Il sistema è up, l'utente no

Costruisci uno scenario in cui i principali componenti risultano tecnicamente `healthy`, ma il critical user journey non produce valore. Puoi usare stale data, ritardo degli eventi, permission errate, inconsistenza, latency cumulativa o configurazione sbagliata.

Definisci poi quale segnale operativo permetterebbe di rilevare il problema senza aspettare una segnalazione dell'utente.

## 5. Retry storm

Hai un servizio A che chiama B. B inizia a rispondere lentamente e A effettua tre retry immediati per ogni failure.

Descrivi il feedback loop che può emergere e poi progetta una strategia migliore considerando timeout, exponential backoff, jitter, idempotency, circuit breaker e load shedding. Non limitarti a scegliere pattern: spiega quale comportamento sistemico vuoi ottenere e quale failure vuoi evitare di amplificare.

## 6. Failure domain

Considera questa architettura:

```text
3 API instances
2 worker instances
1 managed database
1 identity provider
1 shared configuration service
```

Identifica almeno cinque eventi di failure e, per ciascuno, indica quali elementi potrebbero essere coinvolti contemporaneamente. Cerca in particolare i casi in cui la ridondanza fisica non produce indipendenza della causa.

Concludi rispondendo a questa domanda:

> **Dove abbiamo ridondanza apparente ma failure correlato?**

## 7. Architecture Context Map

Costruisci una Context Map per uno tra checkout, password reset, upload di un documento, generazione di una fattura, elaborazione di un webhook o ricerca ordine.

La mappa deve rendere visibili almeno system of interest, actor, external systems, data ownership, critical journey, failure domain e open questions. Mantienila entro due pagine: la capacità da allenare è selezionare ciò che conta, non documentare tutto.

## 8. Adversarial map review con AI

Fornisci a un agente una Architecture Context Map e chiedigli di assumere che sia incompleta. Deve cercare dipendenze nascoste, ownership ambigue, failure correlati, trust boundary mancanti e assunzioni non validate.

Non accettare automaticamente la review. Classifica ogni osservazione come:

```text
verified
plausible but unverified
irrelevant
wrong
```

Alla fine annota quanti punti utili l'agente ha trovato e quanti ha inventato. L'esercizio serve a separare capacità di discovery e autorità epistemica.

## 9. Repository vs runtime

Chiedi a un agente di ricostruire l'architettura di un repository che conosci. Poi confronta il risultato con ciò che sai dal runtime o dall'operatività reale.

Cerca integrazioni mancanti, job esterni, configurazioni, processi manuali, feature flag, dipendenze reali o componenti apparentemente obsoleti che sono ancora attivi. Chiudi l'esercizio con una nota breve:

> **Che cosa non poteva sapere l'agente guardando soltanto il codice?**

## 10. Order Operations

Usa la Context Map di Order Operations e confronta due alternative:

**Alternativa A — lookup live** verso Orders, Payments e Shipping.

**Alternativa B — read model** aggiornato asincronamente.

Non scegliere una tecnologia. Confronta le alternative rispetto a freshness, availability, latency, failure domain, consistency, operabilità, complexity e recovery. Poi identifica quali informazioni mancanti ti impediscono ancora di prendere una decisione responsabile.

L'esercizio è riuscito se la conclusione non è “A è sempre meglio di B”, ma una descrizione delle condizioni che renderebbero ragionevole una delle due.

---

## Domande di autovalutazione

1. Riesco a distinguere il system of interest dal suo ambiente?
2. So spiegare perché il confine dipende dalla domanda che sto cercando di risolvere?
3. So distinguere ownership da storage o rappresentazione?
4. Riesco a trovare coupling che non appare nelle chiamate dirette?
5. So descrivere un critical user journey senza partire dai componenti?
6. Riesco a spiegare come latency e availability emergono end-to-end?
7. So riconoscere un feedback loop destabilizzante?
8. So identificare failure correlati dietro una ridondanza apparente?
9. Riesco a costruire una Context Map che ometta intenzionalmente dettagli irrilevanti?
10. So distinguere una mappa generata dall'AI da una mappa verificata?
11. So dire quali informazioni sul sistema potrebbero non essere presenti nel repository?
12. Riesco a calibrare l'autonomia di un agente in base alle dipendenze e al blast radius attraversati?

Se molte risposte sono “no”, non serve ancora imparare un catalogo più grande di pattern. Serve allenarsi a vedere le relazioni.

## Cosa cambia con l'AI

Prima dei coding agent, ricostruire le dipendenze di un sistema grande poteva richiedere molto lavoro manuale. Oggi possiamo accelerare repository exploration, ricerca dei consumer, dependency discovery, call graph analysis, failure brainstorming e costruzione delle prime mappe.

La nuova difficoltà è mantenere separati tre livelli:

```text
ciò che l'agente ha trovato
```

```text
ciò che l'agente ha inferito
```

```text
ciò che il sistema fa realmente
```

Questa distinzione deve accompagnare qualunque artefatto generato. Una dependency trovata nel codice è evidenza di struttura; la sua criticità può essere un'inferenza; il comportamento effettivo sotto carico richiede spesso runtime evidence.

Il costo della mappa scende. Il valore della validazione sale.

## Corollario

Nel capitolo precedente abbiamo imparato a formulare il problema prima della soluzione. Qui abbiamo allargato quel problema fino a includere le relazioni che possono cambiarne la risposta.

Il passo successivo sarà capire quali decisioni, tra tutte quelle emerse, sono abbastanza importanti, costose o difficili da invertire da meritare attenzione architetturale esplicita. Entreremo quindi nella domanda centrale del libro: che cos'è davvero Software Architecture?

Prima, però, conserviamo il principio di questo capitolo:

> **Non progettare il rettangolo. Progetta il comportamento del sistema.**
