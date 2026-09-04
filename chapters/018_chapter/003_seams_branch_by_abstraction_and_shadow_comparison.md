# 18.3 — Seam, Branch by Abstraction e shadow comparison

Un refactoring sicuro ha spesso bisogno di un posto in cui poter cambiare comportamento senza costringere tutto il sistema a cambiare insieme.

Quel posto è un **seam**.

Nel Capitolo 17 abbiamo identificato `PriorityRouting` come seam candidato.

Ora lo rendiamo esplicito.

## Il seam non è un'interfaccia messa a caso

Aggiungere un'interfaccia davanti a ogni classe non crea automaticamente un boundary utile.

Un seam è utile quando separa:

- una responsabilità che vogliamo sostituire;
- i caller dalla sua implementazione;
- il nuovo modello dal vocabolario legacy;
- la decisione di rollout dalla business logic.

Per Operations Desk Classic il boundary è:

```text
qual è la priorità operativa di questo case?
```

Non:

```text
come sono strutturate le colonne del database legacy?
```

Quindi il nuovo contratto dovrebbe parlare di concetti come:

```text
CasePriorityInput
PriorityDecision
```

non di:

```text
status_code
manual_hold
problem_code
customer_tier
```

Quei nomi possono rimanere dentro un adapter legacy.

## Branch by Abstraction

AWS raccomanda Branch by Abstraction quando la funzionalità da sostituire è profonda nel monolite e non è semplice intercettarla al perimetro.

Il percorso descritto da AWS è:

1. identificare la capability;
2. introdurre un abstraction layer;
3. portare i caller a usare quell'astrazione;
4. costruire una nuova implementazione;
5. effettuare lo switch quando è pronta;
6. rimuovere la vecchia implementazione quando non serve più.

Fonte:

- [AWS Prescriptive Guidance — Branch by abstraction pattern](https://docs.aws.amazon.com/prescriptive-guidance/latest/modernization-decomposing-monoliths/branch-by-abstraction.html)

Il vantaggio è che il sistema resta eseguibile durante la trasformazione.

Il costo è che per un periodo esistono più implementazioni e più struttura temporanea.

## Una astrazione temporanea deve avere un piano di uscita

Il codice di migrazione tende ad avere una caratteristica pericolosa:

> funziona abbastanza bene da sopravvivere alla migrazione.

Per questo adapter, feature flag e comparison layer devono avere:

- owner;
- data di review;
- condition di rimozione;
- test che possono essere eliminati insieme al path temporaneo;
- metriche che ci dicono quando non servono più.

Altrimenti la migration architecture diventa permanent architecture per inerzia.

## Anti-Corruption Layer durante la coesistenza

Il legacy può usare valori come:

```text
NONE
MANUAL_REVIEW
URGENT
STANDARD
```

Il nuovo sistema non deve necessariamente adottarli come proprio modello interno.

Un Anti-Corruption Layer può tradurre:

```text
legacy row
→ adapter
→ target domain input
```

oppure:

```text
legacy priority code
→ target priority representation
```

Microsoft descrive l'Anti-Corruption Layer proprio come boundary che impedisce al modello di un sistema esterno o legacy di contaminare il modello del nuovo sistema.

Fonte:

- [Microsoft Learn — Anti-Corruption Layer pattern](https://learn.microsoft.com/azure/architecture/patterns/anti-corruption-layer)

## Lo shadow comparison come evidence

Supponiamo di avere:

```text
LegacyPriorityPolicy
ConfirmedPriorityPolicy
```

In modalità shadow:

```text
input
  ↓
legacy ─────────────→ returned result
  ↓
candidate
  ↓
compare
  ↓
telemetry / evidence
```

Il risultato autorevole rimane quello legacy.

Il candidate non cambia ancora il comportamento utente.

Questo ci consente di misurare:

- match rate;
- differenze per rule class;
- differenze per tenant o journey;
- casi non classificati;
- failure del candidate;
- latency overhead della comparison.

## Il comparison layer non deve nascondere il significato

Un semplice contatore:

```text
mismatch = 34
```

serve poco.

Meglio qualcosa come:

```text
legacyPriority
candidatePriority
comparisonClass
ruleId
candidateReason
correlationId
```

con attenzione alla cardinalità e alla data minimization.

Esempio:

```text
legacy = URGENT
candidate = STANDARD
comparisonClass = ExpectedDifference
ruleId = LEGACY_ENTERPRISE_30M
```

oppure:

```text
legacy = MANUAL_REVIEW
candidate = STANDARD
comparisonClass = UnexpectedDifference
ruleId = MANUAL_HOLD
```

La prima differenza potrebbe essere intenzionale.

La seconda potrebbe bloccare il rollout.

## Expected difference registry

Durante una modernizzazione con cambiamenti intenzionali, abbiamo bisogno di un piccolo registro delle differenze approvate.

```text
Difference ID
Legacy behavior
Target behavior
Reason
Owner
Approval
Expiry / cleanup condition
```

Questo impedisce due errori opposti.

### Errore 1 — zero mismatch come obiettivo assoluto

Se vogliamo correggere un comportamento obsoleto, zero mismatch significa che non abbiamo ancora introdotto il cambiamento.

### Errore 2 — ogni mismatch è “atteso”

Se classifichiamo retroattivamente ogni differenza come accettabile, lo shadow mode perde valore.

> **Una differenza è attesa soltanto se era stata autorizzata prima di vederla.**

## Shadow comparison e side effect

Il comparison è relativamente semplice per funzioni pure.

Diventa più delicato quando la capability:

- scrive dati;
- invia messaggi;
- chiama provider;
- modifica cache;
- acquisisce lock;
- invia notifiche.

In questi casi possiamo usare tecniche differenti:

- compare prima del side effect;
- rendere il candidate read-only;
- duplicare soltanto input sanitizzati in un environment separato;
- confrontare decisioni invece di esecuzioni;
- usare replay controllato.

Non dobbiamo fare:

```text
old write
+ new write
```

senza aver progettato ownership, idempotency e reconciliation.

AWS stessa segnala che Branch by Abstraction richiede particolare cautela quando entra in gioco la consistenza dei dati.

## Cutover per cohort

Quando il candidate ha abbastanza evidence possiamo passare da:

```text
shadow
```

a:

```text
candidate authoritative
```

ma non necessariamente per tutti contemporaneamente.

Possiamo usare cohort come:

```text
internal users
→ selected tenant
→ 5%
→ 25%
→ 100%
```

oppure segmenti business espliciti.

La percentuale non è sempre il criterio migliore.

Per un sistema enterprise potremmo preferire:

- tenant meno critici;
- region specifica;
- capability specifica;
- operator group;
- read-only flow prima dei command.

## Cosa misurare durante il cutover

Almeno:

```text
functional mismatch
error rate
latency
resource saturation
support signal
manual override rate
rollback frequency
business outcome
```

Non basta osservare che:

```text
HTTP 500 = 0
```

Una nuova priority policy potrebbe essere tecnicamente stabile e semanticamente sbagliata.

## Caso reale: GitHub rate limiter

GitHub ha raccontato la migrazione del backend del proprio rate limiter da Memcached a Redis.

Il team isolò la persistence dietro backend distinti e usò una feature flag per aumentare gradualmente il traffico verso il nuovo path e poter tornare rapidamente al precedente.

Il rollout iniziale sembrò riuscire, ma successivamente emersero bug semantici visibili ad alcuni client.

Fonte:

- [GitHub Engineering — How we scaled the GitHub API with a sharded, replicated rate limiter in Redis](https://github.blog/engineering/how-we-scaled-github-api-sharded-replicated-rate-limiter-redis/)

È un caso utile perché mostra una cosa fondamentale:

> **rollout progressivo e fallback riducono il blast radius; non sostituiscono la comprensione semantica.**

## Il seam come investimento temporaneo

Durante una modernizzazione, un buon seam compra:

- parallelismo;
- reversibilità;
- comparison;
- testabilità;
- isolamento del legacy model;
- possibilità di cambiare strategia.

Ma costa:

- più codice;
- più configurazione;
- più path da testare;
- cleanup futuro.

Quindi vale la stessa regola dei pattern:

> **La complessità temporanea deve avere un lavoro, una scadenza e una condizione di rimozione.**
