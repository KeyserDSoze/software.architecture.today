# Capitolo 16 — Testing Architecture

> **Scenario fittizio ESI.** Order Operations continua a evolvere come capstone. I riferimenti a Microsoft, Google, Meta, OWASP e Pact descrivono pratiche, strumenti o casi reali documentati; requisiti e compromessi ESI restano simulati.

Nel capitolo precedente abbiamo reso il sistema osservabile.

Adesso dobbiamo affrontare una domanda più scomoda:

> **Come facciamo a sapere, prima di produrre un incidente, che una modifica non ha rotto ciò che conta?**

La risposta più semplice sembra essere:

```text
scriviamo più test
```

Nell'era dell'AI è diventato anche più facile farlo.

Possiamo chiedere a un agente di:

- generare unit test;
- coprire branch mancanti;
- creare mock;
- produrre test parametrizzati;
- aggiungere casi limite;
- generare fixture;
- creare integration test;
- sintetizzare test da una issue o da un diff.

In pochi minuti possiamo trasformare una suite di cento test in una suite di mille.

Questo però non implica che la nostra confidenza sia aumentata di dieci volte.

Potremmo avere semplicemente creato novecento modi nuovi di verificare la stessa assunzione.

Oppure novecento test che confermano il comportamento dell'implementazione corrente senza riuscire a rilevare il tipo di errore che ci interessa davvero.

## Il numero di test non è la misura della qualità

Un test ha valore quando riduce un'incertezza significativa.

Quindi la domanda architetturale non è:

> quanti test abbiamo?

ma:

> **quali errori importanti siamo in grado di rilevare prima che diventino un problema per il sistema?**

Questa distinzione diventa ancora più importante quando la generazione dei test costa poco.

Se il costo marginale di produrre un test diminuisce, possiamo facilmente ottimizzare la metrica sbagliata:

```text
numero di test
coverage
numero di assertion
numero di suite
```

invece di ciò che ci interessa davvero:

```text
confidence
risk reduction
regression detection
contract compatibility
failure recovery
security verification
business correctness
```

Meta descrive un problema simile nel proprio lavoro su mutation-guided LLM test generation: aumentare la structural coverage non garantisce che una suite sappia rilevare fault significativi. Nel loro approccio, la domanda viene invertita: si introducono fault mirati e si verifica se i test riescono a intercettarli. La coverage può aumentare, ma non è il risultato principale.

Fonte:

- [Engineering at Meta — Revolutionizing software testing: Introducing LLM-powered bug catchers](https://engineering.fb.com/2025/02/05/security/revolutionizing-software-testing-llm-powered-bug-catchers-meta-ach/)
- [Engineering at Meta — LLMs Are the Key to Mutation Testing and Better Compliance](https://engineering.fb.com/2025/09/30/security/llms-are-the-key-to-mutation-testing-and-better-compliance/)

Questo non significa che mutation testing debba diventare obbligatorio in ogni repository.

Significa che ci offre un principio molto utile:

> **un test è più interessante per il fault che sa rilevare che per la riga che sa eseguire.**

## Testing come parte dell'architettura

Il testing viene spesso trattato come attività successiva al design:

```text
requirements
→ architecture
→ implementation
→ testing
```

Per sistemi seri il rapporto è più circolare:

```text
requirements
↔ architecture
↔ testability
↔ implementation
↔ evidence
```

Una decisione architetturale cambia infatti ciò che dobbiamo riuscire a verificare.

Se introduciamo:

- una transazione;
- una queue;
- una cache;
- una replica;
- un nuovo boundary di authorization;
- una nuova regione;
- un nuovo protocollo;
- un retry;
- una compensazione;

stiamo introducendo anche nuovi failure mode e nuove esigenze di verification.

Microsoft Azure Well-Architected raccomanda esplicitamente di pianificare e progettare i test insieme all'architettura, di mantenere una test strategy collegata agli obiettivi business e di scegliere copertura e layer in base al rischio del workload invece di applicare la stessa strategia a ogni sistema.

Fonti:

- [Microsoft Learn — Architecture strategies for testing](https://learn.microsoft.com/en-us/azure/well-architected/operational-excellence/testing)
- [Microsoft Learn — Build confidence in Azure workloads with effective testing practices](https://learn.microsoft.com/en-us/azure/well-architected/design-guides/testing)

Questa impostazione è particolarmente importante per Order Operations.

Il progetto oggi contiene già:

```text
Functional Analysis
Requirements
API Contract
Data Ownership Map
Failure Mode Map
Threat Model
Security Control Matrix
Reliability Contract
Observability Contract
```

Questi documenti non devono restare descrizioni scollegate.

Devono progressivamente diventare sorgenti di evidence.

## Il rischio decide la profondità del test

Immaginiamo due modifiche.

### Modifica A

Cambiamo il testo di un'etichetta interna.

### Modifica B

Cambiamo il modo in cui `Idempotency-Key` viene associata a una Payment Escalation.

Entrambe possono modificare dieci righe.

Il rischio però non è comparabile.

Nella seconda modifica potremmo introdurre:

- duplicate escalation;
- associazione della stessa key a intent diversi;
- cross-tenant confusion;
- outbox duplicate;
- side effect downstream duplicati.

Una strategy basata soltanto sulla quantità di codice modificato non lo vede.

Una strategy risk-driven invece parte da:

```text
business impact
+ probability
+ reversibility
+ blast radius
+ detectability
+ security/reliability consequence
```

per decidere quanta evidence chiedere.

## Testare una proprietà, non un'implementazione

Un test fragile spesso verifica *come* abbiamo implementato una cosa invece di *quale proprietà* vogliamo proteggere.

Esempio fragile:

```text
il metodo Repository.save viene chiamato esattamente una volta
```

La property rilevante potrebbe invece essere:

```text
per la stessa EscalationId
non può esistere una seconda escalation business
```

La prima assertion protegge una forma dell'implementazione.

La seconda protegge un invariante.

Questa differenza è fondamentale quando vogliamo refactoring frequenti e AI-assisted changes.

Se i test sono troppo accoppiati alla struttura interna, ogni refactoring produce rumore.

Se sono troppo vaghi, non rilevano regressioni reali.

Il design della suite deve quindi trovare un proprio fit.

## La piramide è una heuristica, non una costituzione

La test pyramid resta un buon modello mentale:

```text
molti test piccoli e veloci
meno test di integrazione
pochi test end-to-end costosi
```

Google ha documentato a lungo il costo dei grandi end-to-end test e la maggiore probabilità di flakiness dei test più ampi. In uno studio interno pubblicato sul Google Testing Blog, i test classificati come large mostravano un'incidenza di flakiness molto superiore ai test small.

Fonti:

- [Google Testing Blog — Just Say No to More End-to-End Tests](https://testing.googleblog.com/2015/04/just-say-no-to-more-end-to-end-tests.html)
- [Google Testing Blog — Test Sizes](https://testing.googleblog.com/2017/04/)

Ma trasformare la piramide in una quota obbligatoria sarebbe un altro dogma.

Un sistema data-intensive, un compiler, una mobile app e un integration gateway hanno profili di rischio diversi.

La domanda corretta resta:

> **qual è il layer più economico che riesce a verificare questa proprietà con sufficiente realismo?**

## Il test deve poter fallire per la ragione giusta

Una suite che passa sempre non è necessariamente affidabile.

Potrebbe essere incapace di vedere il difetto.

Una suite che fallisce spesso non è necessariamente severa.

Potrebbe essere flaky.

Meta descrive i flaky test come un problema di affidabilità della suite stessa: se un test passa e fallisce senza variazioni del prodotto, erode la fiducia degli engineer e riduce il valore del processo di regression testing.

Fonte:

- [Engineering at Meta — Probabilistic flakiness: How do you test your tests?](https://engineering.fb.com/2020/12/10/developer-tools/probabilistic-flakiness/)

Da qui una proprietà che useremo per tutto il capitolo:

> **Anche i test sono software operativo. Devono essere progettati, osservati e mantenuti.**

## Il caso ESI

Nel Capitolo 16 ESI arriva a una nuova tensione.

### Commerce & Operations

Vuole mantenere delivery velocity.

Non vuole che ogni pull request richieda un environment enterprise completo.

### Payments & Risk

Vuole evidence forte sull'idempotenza e sui contract della Payment Escalation.

### Security

Vuole negative test per tenant isolation, authorization e secret/logging policy.

### Platform Engineering

Vuole pipeline veloci e ripetibili, ma anche integration evidence prima del deployment.

### Reliability / on-call

Vuole failure-path test, restore drill e regression test derivati dagli incidenti.

### Finance

Non vuole una test estate che costi come la produzione.

Tutte queste esigenze sono legittime.

Il compromesso non sarà scegliere fra “testiamo tanto” e “testiamo poco”.

Sarà decidere:

> **quale evidence deve arrivare velocemente a ogni change, quale può arrivare più tardi e quale richiede un ambiente più realistico.**

## Il quality floor

Per Order Operations non sono negoziabili almeno:

- business invariant critici;
- tenant isolation;
- authorization delle capability sensibili;
- API/event contract compatibility;
- atomicità `PaymentEscalation + OutboxMessage`;
- idempotenza della stessa intenzione;
- safe duplicate delivery;
- schema migration safety;
- failure path dell'outbox;
- recovery evidence per i target dichiarati;
- nessun test che richieda production secret;
- suite abbastanza affidabile da non essere ignorata.

Il modo in cui verifichiamo queste proprietà può cambiare.

Le proprietà non possono sparire perché un test è costoso.

## Il contratto del capitolo

Alla fine del capitolo Order Operations avrà:

```text
Testing Strategy
+ risk-to-test mapping
+ pipeline test layers
+ first executable tests
+ explicit test debt / flakiness policy
+ AI-generated-test verification rules
```

E soprattutto useremo un principio semplice:

> **Non ottimizziamo per far passare i test. Ottimizziamo per fare in modo che un cambiamento sbagliato abbia buone probabilità di non passare.**

Il resto del capitolo costruisce questa capacità.