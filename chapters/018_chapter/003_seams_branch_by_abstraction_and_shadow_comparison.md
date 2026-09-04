# 18.3 — Seam, Branch by Abstraction e shadow comparison

Il Capitolo 17 ci ha lasciato un candidate seam.

Ora dobbiamo trasformarlo in un boundary reale, cioè in un punto in cui vecchia e nuova semantica possano convivere senza costringere tutti i caller a cambiare insieme.

Per ESI la domanda da isolare è:

> **Qual è la priorità operativa di questo case?**

Non vogliamo che il nuovo dominio impari come è fatta la tabella legacy o quali stringhe storiche usa Operations Desk Classic.

## Il seam deve separare significato da rappresentazione

Un'interfaccia utile non parla di:

```text
status_code
problem_code
customer_tier
manual_hold
```

Parla di concetti target come:

```text
CasePriorityInput
PriorityDecision
```

Il legacy adapter si occupa della traduzione.

Questo crea due vantaggi contemporaneamente:

1. i caller dipendono da un contratto stabile;
2. il nuovo modello non eredita accidentalmente il vocabolario storico.

Un seam che espone direttamente tutti i dettagli legacy non sta davvero proteggendo il nuovo dominio.

Sta soltanto spostando il coupling.

## Branch by Abstraction: il sistema resta eseguibile durante il cambio

AWS raccomanda Branch by Abstraction quando la capability è profonda nel monolite e non può essere intercettata facilmente al perimetro.

Il pattern permette di introdurre un abstraction layer, spostare progressivamente i caller dietro quel boundary, aggiungere una candidate implementation e cambiare routing solo quando l'evidence lo giustifica.

Fonte:

- [AWS Prescriptive Guidance — Branch by abstraction pattern](https://docs.aws.amazon.com/prescriptive-guidance/latest/modernization-decomposing-monoliths/branch-by-abstraction.html)

Per Order Operations il modello è:

```text
PriorityPolicy
├── LegacyPriorityAdapter
└── ConfirmedPriorityPolicy
```

Il valore non è avere due classi.

È poter dire:

```text
legacy authoritative today
candidate observable tomorrow
authority transferable later
```

senza riscrivere simultaneamente tutti i caller.

## L'Anti-Corruption Layer localizza la compatibilità

Operations Desk Classic usa codici come:

```text
NONE
MANUAL_REVIEW
URGENT
STANDARD
```

Il target usa un proprio vocabolario:

```text
NotActionable
ManualReview
Urgent
Standard
```

L'**Anti-Corruption Layer** rende esplicita la traduzione fra i due modelli.

Microsoft descrive l'ACL proprio come un boundary che impedisce al modello legacy o esterno di deformare il design del nuovo sistema.

Fonte:

- [Microsoft Learn — Anti-Corruption Layer pattern](https://learn.microsoft.com/azure/architecture/patterns/anti-corruption-layer)

La traduzione non è soltanto DTO mapping.

È il posto in cui possiamo governare incompatibilità di naming, default, validation, missing field e altre differenze semantiche durante la coexistence.

## Shadow comparison: osservare il candidate senza dargli authority

Una volta creati legacy e candidate policy possiamo eseguirli insieme:

```text
input
  ├── legacy    → authoritative result
  └── candidate → observed result
                   ↓
                comparison
```

Il caller continua a ricevere il risultato legacy.

Il candidate produce soltanto evidence.

Questo ci permette di porre domande nuove:

```text
quante decisioni coincidono?
quali rule class divergono?
quali differenze erano attese?
quali non hanno spiegazione?
quanto overhead introduce il comparison?
```

La comparison diventa quindi una forma di verification runtime prima del cutover.

## Un mismatch count senza semantica serve poco

Sapere che esistono 34 mismatch non ci dice se il candidate sia sbagliato.

Dobbiamo conservare abbastanza contesto per classificare la differenza.

Un evento concettuale può contenere:

```text
legacyPriority
candidatePriority
comparisonClass
ruleId
candidateReason
correlationId
```

con cardinality e data minimization coerenti con l'Observability Contract.

Il punto non è loggare ogni dettaglio.

È permettere a Product, Operations ed Engineering di distinguere:

```text
Match
ExpectedDifference
UnexpectedDifference
```

## Expected Difference Registry: autorizzare prima, non spiegare dopo

Se il target deve correggere o rimuovere un comportamento legacy, zero mismatch non è l'obiettivo giusto.

Per questo introduciamo un piccolo registro:

```text
Difference ID
Legacy behavior
Target behavior
Reason
Owner
Approval
Cleanup condition
```

Per ESI apparirà `ED-001`, che rimuove la vecchia enterprise timer rule.

Questo registro impedisce due failure mode opposti.

### Zero mismatch theater

Il team modifica il candidate finché replica ogni comportamento storico, compresi quelli che Product voleva eliminare.

### Retroactive justification

Ogni mismatch nuovo viene dichiarato “atteso” soltanto perché il rollout deve continuare.

La regola è molto semplice:

> **Una differenza è attesa soltanto se è stata autorizzata prima di essere osservata come risultato del rollout.**

## Shadow mode è sicuro soltanto se gli effetti sono governati

Con una funzione pura il confronto è relativamente semplice.

Con una capability che scrive dati, invia messaggi o chiama provider, eseguire il candidate in parallelo può creare un secondo effetto reale.

In questi casi possiamo:

- confrontare la decisione prima del side effect;
- rendere il candidate read-only;
- eseguire replay in un environment separato;
- duplicare input sanitizzati;
- confrontare projection o outcome differiti.

Non possiamo chiamare “shadow” una seconda execution che può modificare il mondo con la stessa authority del path principale.

AWS segnala inoltre che Branch by Abstraction richiede particolare cautela quando la transizione coinvolge consistenza dei dati.

## Il cutover non deve essere per forza percentuale

Quando la comparison evidence è sufficiente possiamo rendere il candidate authoritative per una cohort limitata.

Le cohort possono essere:

```text
internal users
selected tenants
specific operator groups
low-risk capabilities
read-only path
percentage of traffic
```

Nel software enterprise il 5% casuale non è sempre il criterio migliore.

Un tenant può valere più di cento altri in termini di criticità o obblighi contrattuali.

Il rollout deve quindi seguire il business boundary, non soltanto la statistica del traffico.

## Il candidate può essere stabile e semanticamente sbagliato

Durante il cutover non basta guardare:

```text
HTTP 500
CPU
latency
```

Dobbiamo osservare anche:

```text
functional mismatch
manual correction rate
support signal
business outcome
unexpected comparison class
```

Una priority policy può avere zero errori tecnici e ancora indirizzare gli operatori verso il lavoro sbagliato.

L'observability deve quindi misurare il significato del change, non soltanto la salute del processo.

## Caso reale — GitHub rate limiter

GitHub ha descritto la migrazione del backend del proprio rate limiter da Memcached a Redis isolando la persistence dietro backend distinti e usando feature flag per spostare gradualmente il traffico e mantenere fallback rapido.

Il rollout iniziale apparve riuscito, ma successivamente emersero bug semantici visibili ad alcuni client.

Fonte:

- [GitHub Engineering — How we scaled the GitHub API with a sharded, replicated rate limiter in Redis](https://github.blog/engineering/how-we-scaled-github-api-sharded-replicated-rate-limiter-redis/)

La lezione che ci interessa è precisa:

> **rollout progressivo e fallback riducono il blast radius; non sostituiscono la comprensione semantica del comportamento.**

## La migration architecture deve sapere quando morire

Seam, adapter, routing switch, comparison telemetry ed Expected Difference Registry aggiungono complessità temporanea.

Questa complessità è giustificata perché compra:

- reversibilità;
- comparison;
- testability;
- coexistence;
- isolamento del legacy model.

Ma deve avere una exit condition.

Una migration architecture senza cleanup plan diventa semplicemente la prossima architettura legacy.

> **La struttura temporanea è sana soltanto quando sappiamo quale evidence ci permetterà di rimuoverla.**