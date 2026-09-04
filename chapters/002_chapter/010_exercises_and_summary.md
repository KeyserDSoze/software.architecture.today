## Idee chiave

Questo capitolo non chiede di documentare tutto prima di programmare. Chiede di rendere esplicite le decisioni che, se lasciate implicite, verrebbero prese accidentalmente durante l’execution.

Una richiesta di soluzione non è ancora un problema e una feature non è un outcome. “Costruiamo una dashboard” descrive già un output; prima dobbiamo capire quale situazione vogliamo cambiare e per chi. Da qui nasce **Foundation Before Execution**: non un ritorno al waterfall, ma il minimo livello di comprensione proporzionato al rischio della prossima decisione.

Lo scope è parte di questa foundation perché stabilisce anche che cosa non stiamo costruendo. È un confine contro scope creep e generalizzazione prematura, particolarmente importante quando aggiungere codice sembra quasi gratuito. I vincoli svolgono una funzione altrettanto importante: budget, skill, compliance, sistemi esistenti, contratti e reversibilità non sono rumore attorno all’architettura, ma parte del contesto che rende una scelta ragionevole oppure no.

I requisiti devono poi mantenere distinta la semantica dalla soluzione. Un requisito descrive ciò che deve essere vero, non il nome della classe o della tabella che lo realizzerà. Gli aggettivi come “scalabile”, “sicuro” o “veloce” sono direzioni finché non diventano condizioni osservabili. Acceptance criteria e stop condition completano il quadro: i primi definiscono come riconosceremo il successo, le seconde proteggono il punto in cui l’execution non è più autorizzata a continuare.

Le assunzioni meritano di essere esplicite perché possono essere verificate; quelle nascoste rischiano invece di diventare architettura senza una decisione consapevole. Lo stesso vale per la distinzione tra **build to learn** e **build to ship**: una spike o un prototipo possono essere eccellenti strumenti di apprendimento senza essere automaticamente una base pronta per la produzione.

Infine, la foundation non appartiene a un solo ruolo. L’analisi funzionale può avere specialisti, ma la comprensione del prodotto deve essere condivisa. Developer, tech lead e architect devono saper leggere un’analisi funzionale e, quando serve, produrne una prima versione: ricostruire attori, flow, business rule, stati, eccezioni e domande aperte è parte della capacità di prendere buone decisioni tecniche.

Il linguaggio condiviso è già design. Se business, documentazione e codice usano parole diverse per la stessa cosa, abbiamo un problema architetturale prima ancora di scegliere una tecnologia.

## Artefatti operativi

Gli artefatti principali del capitolo restano volutamente strutturati perché devono poter essere riutilizzati.

> **Problem & Outcome Brief**

```text
Problem
Outcome
Actors
In scope
Out of scope
Constraints
Behaviors
Significant NFR
Assumptions
Acceptance evidence
Open decisions
Stop conditions
```

E, quando il dominio richiede più dettaglio:

> **Functional Scope Map**

```text
Product goal
Actors
Capabilities
Critical user journeys
Business rules
States and transitions
External systems
Cross-functional dependencies
Known exceptions
Open functional questions
Glossary
```

Non è necessario utilizzare ogni sezione per ogni task. Il livello di dettaglio deve restare proporzionato al rischio.

## Cosa cambia con l’AI

Molti principi di questo capitolo esistevano prima dei coding agent. L’AI cambia però l’economia dell’errore. Quando l’implementazione richiedeva settimane, una certa quantità di analisi emergeva anche dal costo di iniziare; quando possiamo ottenere una prima soluzione in minuti, il costo psicologico di partire senza foundation diventa molto più basso.

Un agente può inoltre trasformare una singola ambiguità in modello dati, API, UI, test e documentazione tutti perfettamente coerenti con la stessa assunzione sbagliata. La consistenza interna non garantisce che il sistema stia implementando la semantica giusta.

Per questo il ruolo umano si sposta verso la definizione del problema, la comprensione del dominio, la visibilità dei vincoli, la scelta di ciò che può essere delegato, la definizione degli invarianti e la decisione di ciò che richiede escalation.

L’AI può aiutare anche nell’analisi funzionale: proporre edge case, cercare stati mancanti, confrontare flow, trasformare interviste in prime bozze o fare review adversarial. Non deve però diventare la fonte della semantica del prodotto.

L’AI rende meno costoso produrre una risposta. Non rende meno importante fare la domanda giusta.

---

# Esercizi

Gli esercizi restano strutturati intenzionalmente: qui il lettore deve eseguire passi, confrontare output e verificare il proprio ragionamento.

## 1. Dalla soluzione al problema

Ricevi questa richiesta:

> “Serve un chatbot AI nel portale clienti.”

Produci:

1. almeno tre problemi diversi che potrebbero nascondersi dietro la stessa richiesta;
2. un outcome diverso per ciascun problema;
3. una situazione in cui il chatbot sarebbe una soluzione sbagliata anche se tecnicamente eccellente;
4. cinque domande che faresti prima di autorizzare implementation.

Non progettare ancora il chatbot.

## 2. Scope under pressure

Un team deve aggiungere download CSV a una schermata amministrativa. Durante il lavoro emergono richieste per export Excel e schedulato, invio email, filtri salvati, export di milioni di record, audit, API pubblica e template personalizzabili.

Definisci `In scope` per una prima iterazione di basso rischio, `Out of scope`, gli elementi che non puoi classificare senza ulteriori informazioni e almeno tre costi del ciclo di vita che non siano “tempo di scrittura del codice”.

## 3. Hard o soft?

Classifica questi vincoli come hard, soft o “serve contesto”:

- “Dobbiamo usare PostgreSQL.”
- “I dati dei clienti europei devono rimanere in UE.”
- “Il team conosce soprattutto C#.”
- “La feature deve uscire venerdì.”
- “Non vogliamo aggiungere nuove dipendenze.”
- “Il contratto con il provider non consente più di 100 richieste al secondo.”
- “Il CTO preferisce Kubernetes.”

Per ogni voce spiega quale informazione potrebbe cambiare la classificazione.

## 4. Requisiti nascosti negli aggettivi

Trasforma queste frasi in requisiti più osservabili:

- il sistema deve essere veloce;
- la piattaforma deve essere sicura;
- il servizio deve scalare;
- la dashboard deve essere aggiornata in tempo reale;
- l’API deve essere affidabile.

Non inventare numeri senza motivazione. Quando manca una baseline o un bisogno concreto, descrivi prima quale informazione raccoglieresti.

## 5. Cancellation semantics

Parti dalla richiesta:

> “Un cliente deve poter annullare un ordine.”

Scrivi attori, condizioni, functional behavior, almeno cinque edge/failure case significativi, invarianti, acceptance criteria e stop condition per un coding agent. Poi identifica almeno tre decisioni che **non** lasceresti inventare all’agente.

## 6. Acceptance evidence

Per ciascuna feature scegli quale evidence useresti per dire che funziona:

1. login con MFA;
2. algoritmo di suggerimento prodotti;
3. migration di una tabella da 500 milioni di righe;
4. pagina di configurazione interna;
5. retry di un pagamento asincrono;
6. nuova cache per un’API ad alto traffico.

Puoi usare test, metriche, benchmark, review, invarianti o osservazione. Spiega perché “la demo funziona” sarebbe insufficiente nei casi che ritieni più rischiosi.

## 7. Problem & Outcome Brief

Scegli una feature reale di un progetto che conosci e scrivi un Problem & Outcome Brief completo. Poi rileggilo chiedendoti quali parti siano in realtà decisioni di soluzione già prese. Spostale fuori dal brief oppure trasformale in constraint soltanto se sono davvero vincoli.

## 8. Adversarial review del brief

Prendi il brief dell’esercizio precedente e chiedi a un agente AI di assumere il ruolo di skeptical reviewer. Chiedigli di cercare outcome non misurabili, scope ambiguo, assunzioni nascoste, requisiti che prescrivono implementazione, edge case ignorati, vincoli trattati come assoluti senza evidence e metriche che potrebbero migliorare senza migliorare l’outcome.

Per ogni critica marca:

```text
Accolta
Respinta
Da verificare
```

E motiva la decisione.

## 9. Build to learn

Hai un dubbio sulla capacità di una tecnologia di sostenere un requisito di performance. Progetta una spike di massimo un giorno dichiarando domanda, ipotesi, dati o workload, criterio di successo/fallimento, ciò che non implementerai, evidence da produrre e condizione che impedisca al prototipo di diventare production code per inerzia.

## 10. Order Operations — cambia il contesto

Parti dal Problem & Outcome Brief del capitolo e introduci uno di questi cambiamenti:

**Scenario A:** gli ordini problematici diventano 5 milioni al giorno.

**Scenario B:** gli operatori devono intervenire entro 10 secondi dall’errore.

**Scenario C:** ogni merchant deve vedere e gestire autonomamente i propri ordini problematici.

**Scenario D:** l’assegnazione operativa diventa parte di un processo regolamentato che richiede audit immutabile per sette anni.

Aggiorna soltanto il brief. Non scegliere ancora la tecnologia. Indica quali sezioni cambiano, quali assunzioni cadono, quali nuovi NFR diventano significativi, quali open decision emergono e quali parti dell’architettura futura saranno probabilmente influenzate.

## 11. Reverse functional analysis

Scegli una funzionalità di un sistema reale che conosci e ricostruiscine il comportamento partendo soltanto da UI, API, log o codice disponibile.

Produci un Functional Scope Map con attori, capability, happy path, almeno tre alternative flow, stati osservabili, business rule inferite, termini ambigui e domande che richiedono un domain expert. Per ogni regola marca:

```text
Fatto osservato
Inferenza
Da verificare
```

Poi confronta la tua analisi con una persona che conosce il dominio. L’obiettivo non è indovinare tutto, ma riconoscere il confine tra ciò che il software mostra e ciò che il business intende.

---

## Domande di autovalutazione

1. Riesco a distinguere una richiesta di soluzione dal problema che dovrebbe risolvere?
2. So spiegare la differenza tra output e outcome?
3. Riesco a definire uno scope che dica esplicitamente anche cosa non stiamo facendo?
4. So distinguere un hard constraint da una preferenza organizzativa?
5. Quando leggo un requisito, so riconoscere le decisioni tecniche già nascoste dentro la frase?
6. Riesco a trasformare un aggettivo come “veloce” in una domanda verificabile senza inventare precisione?
7. So definire acceptance criteria che descrivano comportamento e non classi o tabelle?
8. So identificare gli edge case in cui la semantica non può essere lasciata all’implementazione?
9. Riesco a scrivere le assunzioni su cui una soluzione dipenderebbe?
10. So distinguere una spike costruita per imparare da codice costruito per essere operato in produzione?
11. Riesco a decidere quanta foundation serve in funzione di reversibilità e blast radius?
12. Un agente potrebbe leggere il mio brief e sapere quali decisioni può prendere e quali deve escalare?
13. So leggere un’analisi funzionale e ricostruire attori, flow, business rule, stati ed eccezioni?
14. Saprei produrre una prima analisi funzionale senza trasformarla subito in design tecnico?
15. So spiegare a grandi linee le funzionalità dell’applicativo su cui lavoro, anche al di fuori del mio modulo?

## Corollario

Il codice è una risposta. Prima dobbiamo avere una domanda abbastanza buona da meritarsela e capire abbastanza bene il prodotto da riconoscere se la risposta parla davvero della stessa cosa.

> **Prima capire, poi costruire.**
