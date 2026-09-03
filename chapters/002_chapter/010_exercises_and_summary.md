## Idee chiave

Questo capitolo non chiede di documentare tutto prima di programmare.

Chiede di rendere esplicite le decisioni che, se lasciate implicite, verrebbero prese accidentalmente durante l'execution.

I punti principali sono:

1. **Una richiesta di soluzione non è ancora un problema.** “Costruiamo una dashboard” descrive già un output; dobbiamo capire quale situazione vogliamo cambiare.
2. **Una feature non è un outcome.** Il completamento del software non dimostra che il problema sia migliorato.
3. **Foundation Before Execution non significa waterfall.** Significa avere abbastanza comprensione per il rischio della prossima decisione.
4. **Lo scope è un confine decisionale.** Dire cosa non stiamo costruendo protegge da scope creep e generalizzazione prematura.
5. **Una feature costa anche dopo che è stata scritta.** Manutenzione, test, security, dati, supporto e compatibilità sopravvivono alla generazione del codice.
6. **I vincoli sono parte dell'architettura.** Budget, skill, compliance, sistemi esistenti e reversibilità cambiano ciò che è ragionevole costruire.
7. **Comportamento e implementazione devono rimanere distinguibili.** Un requisito descrive prima di tutto ciò che deve essere vero, non il nome della classe che lo realizzerà.
8. **Gli aggettivi non sono requisiti.** “Scalabile”, “sicuro” e “veloce” devono diventare condizioni osservabili quando sono significativi.
9. **Acceptance criteria e stop condition sono complementari.** I primi descrivono il successo, le seconde indicano quando l'execution non è più autorizzata a proseguire.
10. **Le assunzioni esplicite sono verificabili.** Quelle implicite possono diventare architettura senza una decisione cosciente.
11. **Build to learn e build to ship sono attività diverse.** Un prototipo riuscito dimostra ciò che è stato progettato per imparare, non automaticamente production readiness.
12. **La foundation deve aumentare decision velocity, non produrre documentazione.** Se un artefatto non migliora una decisione, probabilmente non serve.
13. **L'analisi funzionale può avere specialisti, ma la comprensione del prodotto deve essere condivisa.** Chi progetta, implementa o verifica una parte significativa del sistema deve saper leggere il comportamento funzionale e formulare domande sul dominio.
14. **Saper leggere non basta sempre.** Developer, tech lead e architect devono essere capaci di produrre una prima analisi funzionale, esplicitando attori, flow, business rule, stati, eccezioni e domande aperte.
15. **Il linguaggio condiviso è parte del design.** Se business, documentazione e codice usano parole diverse per la stessa cosa, il problema è già architetturale.

## Artefatti operativi

Gli artefatti principali del capitolo sono:

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

Non è obbligatorio utilizzare ogni sezione per ogni task.

Il livello di dettaglio deve essere proporzionato al rischio.

## Cosa cambia con l'AI

Molti principi di questo capitolo esistevano prima dei coding agent.

L'AI cambia però l'economia dell'errore.

Quando l'implementazione richiedeva settimane, una certa quantità di analisi emergeva naturalmente dal costo di iniziare.

Quando possiamo ottenere una prima soluzione in minuti, il costo psicologico di partire senza foundation diventa molto più basso.

Inoltre un agente può trasformare una singola ambiguità in molti artefatti coerenti con la stessa assunzione sbagliata:

```text
requisito ambiguo
→ modello dati
→ API
→ UI
→ test
→ documentazione
```

Tutto può essere internamente consistente e globalmente sbagliato.

Per questo il ruolo umano si sposta ancora una volta verso:

- definire il problema;
- comprendere il dominio;
- rendere visibili i vincoli;
- scegliere cosa delegare;
- stabilire invarianti;
- decidere cosa richiede escalation.

L'AI può aiutare anche nell'analisi funzionale: proporre edge case, cercare stati mancanti, confrontare flow, trasformare interviste in prime bozze e fare review adversarial.

Non deve diventare la fonte della semantica del prodotto.

L'AI rende meno costoso produrre una risposta.

Non rende meno importante fare la domanda giusta.

---

# Esercizi

Gli esercizi di questo capitolo non richiedono una tecnologia specifica.

L'obiettivo è allenare la capacità di passare da richiesta a problema, da problema a outcome, da outcome a un perimetro delegabile e da specifica parziale a comprensione funzionale condivisa.

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

Un team deve aggiungere download CSV a una schermata amministrativa.

Durante il lavoro emergono queste richieste:

- export Excel;
- export schedulato;
- invio email;
- filtri salvati;
- export di milioni di record;
- audit degli export;
- API pubblica;
- template personalizzabili.

Definisci:

- `In scope` per una prima iterazione di basso rischio;
- `Out of scope`;
- elementi che non puoi classificare senza ulteriori informazioni;
- almeno tre costi del ciclo di vita che non sono “tempo di scrittura del codice”.

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
- l'API deve essere affidabile.

Non inventare numeri senza motivazione.

Quando manca una baseline o un bisogno concreto, descrivi prima quale informazione raccoglieresti.

## 5. Cancellation semantics

Parti dalla richiesta:

> “Un cliente deve poter annullare un ordine.”

Scrivi:

- attori;
- condizioni;
- functional behaviors;
- almeno cinque edge/failure case significativi;
- invarianti;
- acceptance criteria;
- stop condition per un coding agent.

Poi identifica almeno tre decisioni che **non** lasceresti inventare all'agente.

## 6. Acceptance evidence

Per ciascuna feature scegli quale evidenza useresti per dire che funziona:

1. login con MFA;
2. algoritmo di suggerimento prodotti;
3. migration di una tabella da 500 milioni di righe;
4. pagina di configurazione interna;
5. retry di un pagamento asincrono;
6. nuova cache per una API ad alto traffico.

Puoi usare test, metriche, benchmark, review, invarianti o osservazione.

Spiega perché “la demo funziona” sarebbe insufficiente nei casi che ritieni più rischiosi.

## 7. Problem & Outcome Brief

Scegli una feature reale di un progetto che conosci.

Scrivi un Problem & Outcome Brief completo.

Poi esegui una seconda passata con questa domanda:

> “Quali parti del brief sono in realtà decisioni di soluzione già prese?”

Sposta quelle decisioni fuori dal brief oppure trasformale in constraint soltanto se sono davvero vincoli.

## 8. Adversarial review del brief

Prendi il brief dell'esercizio precedente e chiedi a un agente AI di assumere il ruolo di skeptical reviewer.

Chiedigli di cercare:

- outcome non misurabili;
- scope ambiguo;
- assunzioni nascoste;
- requisiti che prescrivono implementazione;
- edge case ignorati;
- vincoli trattati come assoluti senza evidenza;
- metriche che potrebbero essere ottimizzate senza migliorare l'outcome.

Non accettare automaticamente la review.

Per ogni critica marca:

```text
Accolta
Respinta
Da verificare
```

E motiva la decisione.

## 9. Build to learn

Hai un dubbio sulla capacità di una tecnologia di sostenere un requisito di performance.

Progetta una spike di massimo un giorno.

Deve contenere:

- domanda che vuoi risolvere;
- ipotesi;
- dati o workload necessari;
- criterio di successo/fallimento;
- cosa non implementerai;
- quale evidenza produrrai;
- condizione che impedisce al prototipo di diventare production code per inerzia.

## 10. Acme Orders — cambia il contesto

Parti dal Problem & Outcome Brief del capitolo.

Ora introduci uno di questi cambiamenti:

**Scenario A**

Gli ordini problematici diventano 5 milioni al giorno.

**Scenario B**

Gli operatori devono intervenire entro 10 secondi dall'errore.

**Scenario C**

Ogni merchant deve vedere e gestire autonomamente i propri ordini problematici.

**Scenario D**

L'assegnazione operativa diventa parte di un processo regolamentato che richiede audit immutabile per sette anni.

Aggiorna soltanto il brief.

Non scegliere ancora la tecnologia.

Indica:

- quali sezioni cambiano;
- quali assunzioni cadono;
- quali nuovi NFR diventano significativi;
- quali open decision emergono;
- quali parti dell'architettura futura probabilmente saranno influenzate.

## 11. Reverse functional analysis

Scegli una funzionalità di un sistema reale che conosci e ricostruiscine il comportamento partendo soltanto da UI, API, log o codice disponibile.

Produci un Functional Scope Map con:

- attori;
- capability;
- happy path;
- almeno tre alternative flow;
- stati osservabili;
- business rule inferite;
- termini ambigui;
- domande che richiedono un domain expert.

Per ogni regola marca:

```text
Fatto osservato
Inferenza
Da verificare
```

Poi confronta la tua analisi con una persona che conosce il dominio.

L'obiettivo non è indovinare tutto.

È imparare a riconoscere il confine tra ciò che il software mostra e ciò che il business intende.

---

## Domande di autovalutazione

1. Riesco a distinguere una richiesta di soluzione dal problema che dovrebbe risolvere?
2. So spiegare la differenza tra output e outcome?
3. Riesco a definire uno scope che dica esplicitamente anche cosa non stiamo facendo?
4. So distinguere un hard constraint da una preferenza organizzativa?
5. Quando leggo un requisito, so riconoscere le decisioni tecniche già nascoste dentro la frase?
6. Riesco a trasformare un aggettivo come “veloce” in una domanda verificabile senza inventare precisione?
7. So definire acceptance criteria che descrivano comportamento e non classi o tabelle?
8. So identificare gli edge case in cui la semantica non può essere lasciata all'implementazione?
9. Riesco a scrivere le assunzioni su cui una soluzione dipenderebbe?
10. So distinguere una spike costruita per imparare da codice costruito per essere operato in produzione?
11. Riesco a decidere quanta foundation serve in funzione di reversibilità e blast radius?
12. Un agente potrebbe leggere il mio brief e sapere quali decisioni può prendere e quali deve escalare?
13. So leggere un'analisi funzionale e ricostruire attori, flow, business rule, stati ed eccezioni?
14. Saprei produrre una prima analisi funzionale senza trasformarla subito in design tecnico?
15. So spiegare a grandi linee le funzionalità dell'applicativo su cui lavoro, anche al di fuori del mio modulo?

## Corollario

Il codice è una risposta.

Prima dobbiamo avere una domanda abbastanza buona da meritarsela.

E dobbiamo capire abbastanza bene il prodotto da riconoscere se la risposta parla davvero della stessa cosa.

> **Prima capire, poi costruire.**