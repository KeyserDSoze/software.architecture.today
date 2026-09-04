## Quando estrarre un servizio

Se un confine logico funziona bene dentro un modular monolith, quando merita di diventare un servizio indipendente?

Non esiste una soglia universale.

La domanda non è quanto il modulo sia “importante” né quanto sembri separato nel diagramma. Dobbiamo capire se la separazione fisica compra proprietà che il deployable condiviso non riesce più a fornire bene.

Quasi sempre la decisione emerge dalla convergenza di più segnali.

## Il boundary deve avere già una vita propria

Il primo segnale è il **ciclo di cambiamento**.

Se un modulo evolve con una cadence molto diversa dal resto dell'applicazione e il deploy coordinato rallenta sistematicamente il team, l'autonomia di rilascio può diventare economicamente interessante.

Ma attenzione alla causalità.

Se il modulo cambia spesso perché i suoi boundary sono confusi e ogni feature attraversa molte dipendenze, estrarlo non risolve il problema. Potrebbe soltanto spostare il change coupling dietro API remote.

La separazione ha più fit quando il modulo ha già un modello coerente, contratti stabili e una roadmap abbastanza distinta da beneficiare realmente di un ciclo di delivery autonomo.

## L'asimmetria di carico può rendere costoso il deployable condiviso

Un secondo segnale è un profilo di capacity molto diverso.

Immaginiamo:

```text
Search  → traffico elevato, read-heavy, forte elasticità
Billing → traffico basso, consistency più importante del throughput
```

Scalare entrambe le capability come un'unica unità può diventare inefficiente. Un service boundary può permettere a Search di usare capacità, runtime o scaling policy differenti senza replicare inutilmente Billing.

Se invece i profili sono simili e moderati, lo scaling indipendente resta una proprietà teorica e potrebbe non pagare la distribuzione.

## Isolation: separare soltanto se il failure può davvero restare locale

Una capability dipendente da provider instabili, workload pesanti o codice ad alto rischio può meritare un failure boundary più forte.

Un processo separato può permettere resource isolation, deploy e rollback autonomi, rate limit specifici o protezione da memory leak e saturation locali.

Ma il test decisivo è il journey.

Se ogni richiesta dell'utente continua a dipendere sincronicamente da quel servizio e non esiste graceful degradation, il processo separato non elimina il failure percepito. Isola alcune risorse, non necessariamente il risultato.

La separazione diventa più convincente quando possiamo descrivere con precisione quale blast radius riduciamo e quale comportamento sopravvive alla failure.

## Security e compliance possono rendere il confine operativo

Alcune capability trattano dati, privilegi o requisiti normativi che meritano un perimetro più forte.

Un servizio separato può restringere identity, network access e secret exposure, ridurre il numero di componenti che possono accedere a dati sensibili e rendere più chiara l'ownership dei controlli.

Questo può essere un motivo molto più forte di “vorremmo usare un runtime diverso”.

Anche qui il valore deve essere concreto: quale trust boundary diventa più forte? Quale blast radius viene ridotto? Quale audit o controllo diventa più semplice?

## Ownership organizzativa: il servizio deve avere qualcuno che lo possiede davvero

Quando una capability ha un team stabile, una roadmap autonoma e responsabilità operativa end-to-end, il service boundary può rafforzare una separazione già esistente.

Se nessuno è pronto a possedere deploy, alert, incidenti, capacity e lifecycle del nuovo servizio, l'estrazione crea un'unità operativa senza un owner reale.

Questo è particolarmente importante nei team piccoli.

La domanda non è soltanto “chi scrive il codice?”.

È “chi vive con le conseguenze della separazione?”.

## I dati devono avere un owner prima di avere un database separato

Un modulo è molto più facile da estrarre quando possiede già dati e invarianti che gli altri consumano attraverso contratti intenzionali.

Se il codice è modulare ma le transazioni attraversano liberamente tabelle condivise, il network boundary costringerà a risolvere in fretta una domanda che prima era stata evitata: chi è autorevole su quel dato?

La separazione dello storage viene dopo la chiarezza dell'ownership.

Microsoft collega esplicitamente i microservizi alla data ownership autonoma e mette in guardia dal coupling prodotto da datastore condivisi: [Microsoft Learn — Data considerations for microservices](https://learn.microsoft.com/azure/architecture/microservices/design/data-considerations).

## Technology fit diverso: segnale valido, ma non scusa

A volte una capability ha davvero bisogni tecnici differenti: compute intensivo, librerie non compatibili con il runtime principale, hardware specializzato, pattern di storage radicalmente diversi o un isolation requirement che il processo condiviso non può offrire bene.

Questa può essere un'ottima ragione per separare.

Ma il ragionamento deve partire dalla proprietà necessaria, non dalla tecnologia desiderata.

“Vogliamo usare Python” non è ancora un requisito.

“Questa capability usa una libreria di inferenza disponibile soltanto in quell'ecosistema e ha bisogno di scaling GPU indipendente” è un problema più concreto.

## Un solo segnale raramente basta

Questi segnali non formano una checklist che restituisce automaticamente `extract = true`.

Un team dedicato può lavorare bene dentro un modular monolith. Un modulo con carico elevato può essere ottimizzato senza diventare un servizio. Un security boundary può essere ottenuto con process isolation o con controlli di piattaforma differenti. Una cadence diversa può essere gestita migliorando il deployment dell'intera applicazione.

Il caso per l'estrazione diventa forte quando più forze puntano nella stessa direzione e quando le alternative meno costose non soddisfano abbastanza il requisito.

## Extraction readiness

Prima di mettere la rete in mezzo, il boundary dovrebbe essere credibile nel codice.

Possiamo usare un piccolo test:

```text
Responsabilità chiara?
Contratto intenzionale?
Ownership dei dati?
Dipendenze note?
Transazioni cross-boundary comprese?
Test sufficienti?
Comportamento osservabile?
Accessi trasversali illegittimi già ridotti?
Operational owner identificato?
```

Se molte risposte sono no, l'estrazione rischia di cementare un confine sbagliato dietro una rete.

> **Prima rendi il confine credibile nel codice. Poi valuta se vale la pena renderlo fisico.**

Questo criterio è coerente anche con la guida Microsoft sulla modellazione dei microservizi, che insiste sul fatto che i boundary non emergano da un processo meccanico ma da domain analysis, requisiti, architecture characteristics e obiettivi: [Microsoft Learn — Use domain analysis to model microservices](https://learn.microsoft.com/azure/architecture/microservices/model/domain-analysis).

## L'estrazione è una decisione, non una promozione

Un service extraction importante dovrebbe lasciare un ADR.

Dovremmo conservare il problema che vogliamo risolvere, la proprietà che ci aspettiamo di comprare e le alternative considerate. Servono un migration plan, una contract strategy, la data ownership, i nuovi failure mode, l'operational owner e un modo per capire se il beneficio promesso sia stato realmente ottenuto.

Dovremmo anche dichiarare cosa ci farebbe cambiare idea.

Per esempio: se il costo operativo supera il beneficio, se i deploy restano comunque coordinati o se il servizio non riesce a possedere realmente i propri dati, la decisione va rivalutata.

L'estrazione non è un premio dato a un modulo che è cresciuto abbastanza.

È un investimento.

> **Quale problema attuale diventa materialmente più semplice, più sicuro o più economico dopo l'estrazione?**

Se non sappiamo rispondere, il boundary logico potrebbe essere già la soluzione giusta.