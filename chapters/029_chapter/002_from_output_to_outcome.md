# Dall'output all'outcome

Una delle trasformazioni più facili da osservare con l'AI è l'aumento dell'output.

Più codice.

Più test.

Più documentazione.

Più alternative.

Più pull request.

Più prototipi.

È utile.

Ma l'output non è il motivo per cui esiste il software.

Il software esiste per modificare qualche parte della realtà in modo intenzionale.

Un ordine deve essere processato.

Un operatore deve capire un'anomalia.

Una campagna deve essere pubblicata.

Un pagamento non deve essere duplicato.

Un cliente deve poter completare un journey.

Un'azienda deve poter sostenere economicamente ciò che ha costruito.

Per questo il primo movimento del libro è stato allontanarsi dalla feature e tornare al **problema**.

---

## Prima del codice c'è una promessa

Quando diciamo:

```text
costruiamo una API
introduciamo una queue
aggiungiamo una cache
usiamo Kubernetes
integriamo un LLM
```

abbiamo già saltato una domanda.

> **Per ottenere quale outcome?**

Quella domanda non è burocrazia.

È ciò che rende una soluzione valutabile.

Senza outcome possiamo discutere soltanto se una soluzione è elegante.

Con un outcome possiamo discutere se è utile.

È per questo che il **Problem & Outcome Brief** viene prima dell'architettura.

Non serve a congelare il problema per sempre.

Serve a evitare che la soluzione inizi a definire da sola ciò che il problema dovrebbe essere.

---

## L'analisi funzionale è architecture input

Nel corso del libro abbiamo insistito su una posizione che vale la pena ripetere alla fine.

> **L'analisi può avere uno specialista. La comprensione del prodotto non può avere un unico proprietario.**

Developer, tech lead e architect non devono conoscere soltanto:

```text
endpoint
classe
servizio
database
cluster
```

Devono sapere almeno abbastanza del prodotto da comprendere:

```text
attori
journey
stati
transizioni
business rule
invariant
permission
eccezioni
side effect
ownership
```

Perché è lì che spesso vive la semantica che rende una decisione architetturale corretta o sbagliata.

Un esempio attraversa tutta la storia di ESI.

Operations Desk Classic conteneva una regola:

```text
Enterprise + age >= 30m
→ URGENT
```

Il codice la eseguiva.

I characterization test potevano dimostrare che esisteva.

Nessuno dei due poteva dirci se quella regola **dovesse sopravvivere**.

Per questo abbiamo distinto:

```text
Observed
≠
Confirmed
```

La nuova architettura non poteva essere decisa leggendo soltanto il codice.

Serviva capire il significato del prodotto.

---

## Il requisito non è il ticket

Una issue può dire:

> aggiungere retry sul pagamento.

Ma questa frase può nascondere problemi molto diversi:

- il payment provider è temporaneamente indisponibile;
- il pagamento può essere ritentato senza duplicare l'addebito;
- il retry deve essere automatico o richiesto da un operatore;
- esiste una finestra temporale;
- l'utente deve essere informato;
- il retry cambia uno stato economico;
- il retry richiede authorization particolare;
- la richiesta è già stata accettata e il risultato è semplicemente incerto.

Se il team tratta il ticket come specifica, il codice è costretto a inventare ciò che manca.

L'AI rende questa situazione ancora più pericolosa perché è molto brava a **riempire i vuoti con una soluzione plausibile**.

Per questo una issue execution-ready deve eliminare le decisioni che l'executor non è autorizzato a inventare.

Non tutte le ambiguità.

Soltanto quelle che possono cambiare il significato del sistema.

---

## Il prodotto deve essere conoscibile

Una delle lezioni trasversali del capstone è che la conoscenza utile deve uscire dalle conversazioni private.

Order Operations ha accumulato:

```text
Functional Analysis
Requirements
Architecture Context
API Contract
Data Ownership Map
Failure Mode Map
Threat Model
Reliability Contract
Observability Contract
Testing Strategy
Cost Model
ADR
Decision Trace
```

Non perché ogni progetto debba produrre gli stessi documenti.

Ma perché ogni volta che una decisione importante rischiava di vivere soltanto nella testa di qualcuno abbiamo cercato una forma più persistente.

Questa è una proprietà architetturale.

Un sistema che può essere modificato soltanto da chi ricorda la storia completa è fragile anche se il codice è ben strutturato.

---

## Dal requisito all'evidence

Un outcome diventa realmente utile quando possiamo collegarlo a ciò che dovrebbe dimostrarne il raggiungimento.

Per esempio:

```text
Outcome
Payment Escalation non deve dipendere
sincronamente dalla disponibilità di Payments
```

porta a decisioni come:

```text
local durable intent
+ outbox
+ asynchronous delivery
```

ma anche a evidence richieste:

```text
atomic local commit
idempotent delivery behavior
backlog visibility
failure recovery
```

In questo modo il requisito non finisce quando l'implementazione inizia.

Continua attraverso l'architettura fino alla verifica.

---

## Il rischio della solution gravity

Quando una tecnologia è potente o familiare, tende ad attirare problemi verso il proprio modello.

Abbiamo un cluster Kubernetes?

Ogni nuovo workload sembra un container da orchestrare.

Abbiamo una piattaforma event-driven?

Ogni integrazione sembra un evento.

Abbiamo una vector platform?

Ogni feature AI sembra un problema RAG.

Abbiamo agenti?

Ogni backlog sembra parallelizzabile.

Questa è **solution gravity**.

Il modo migliore per contrastarla non è vietare le tecnologie.

È rendere il problema abbastanza chiaro da poter chiedere:

> **questa capability compra davvero qualcosa per questo outcome?**

Campaign Launchpad ci ha dato il controesempio più semplice.

ESI conosce queue, microservices, AI e infrastrutture complesse.

Campaign Launchpad non ne ha ereditata nessuna.

Non perché fosse un progetto meno serio.

Perché il suo problema non le richiedeva.

---

## Prima capire, poi costruire

Questa frase ha accompagnato buona parte del libro:

> **Prima capire, poi costruire.**

Non significa aspettare di sapere tutto.

Non sapremo mai tutto.

Significa sapere abbastanza da distinguere:

```text
ciò che è deciso
ciò che è assunto
ciò che è ancora ignoto
ciò che l'executor può scegliere
ciò che richiede un nuovo gate
```

Questa distinzione è ciò che rende possibile accelerare in modo sano.

Quando il problema è chiaro, l'execution può diventare molto veloce.

Quando il problema è ambiguo, accelerare significa spesso soltanto arrivare prima al posto sbagliato.