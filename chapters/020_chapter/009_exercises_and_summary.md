# 20.9 — Esercizi, autovalutazione e sintesi

## Dieci idee da portare via

1. **Cost optimization non significa lowest cost.** Il costo va letto rispetto al valore e ai requirement.
2. La cloud bill è soltanto una parte del **Total Cost of Ownership**.
3. Ogni decisione architetturale significativa crea costi diretti e indiretti.
4. Prima di ottimizzare serve conoscere il **cost driver**.
5. Il costo assoluto è spesso meno utile del **cost per unit of value**.
6. Reliability, security, isolation, observability e optionality hanno un premium che deve essere giustificato.
7. Usage optimization e rate optimization sono problemi differenti.
8. Cognitive load, coordination, migration overlap e verification sono costi reali anche se non compaiono in fattura.
9. Nell'AI il **cost per token** è una metrica di consumo; il target economico più utile può essere il **cost per useful outcome**.
10. Una ottimizzazione che cambia una proprietà del sistema è una decisione architetturale, anche se nasce da Finance.

## Esercizio 1 — Il costo nascosto

Prendi una tecnologia apparentemente gratuita usata in un tuo progetto.

Può essere:

```text
open-source database
message broker
Kubernetes
cache
search engine
```

Costruisci questa tabella:

| Voce | Costo diretto | Costo indiretto | Evidence |
|---|---:|---:|---|
| infrastructure | | | |
| engineering | | | |
| operations | | | |
| training | | | |
| security | | | |
| recovery | | | |
| migration/exit | | | |

Poi rispondi:

> La tecnologia è ancora economica dopo aver incluso ownership e TCO?

Non è necessario che la risposta sia no.

L'obiettivo è rendere il confronto completo.

## Esercizio 2 — Property purchased

Per cinque voci importanti della tua architettura scrivi:

```text
Cost
Property purchased
Requirement
Owner
Evidence
Review trigger
```

Esempio:

```text
Cost
second availability zone

Property purchased
zonal failure tolerance

Requirement
RTO <= X

Owner
workload team

Evidence
failure drill
```

Se non riesci a descrivere la proprietà comprata, quella voce merita una review.

## Esercizio 3 — Lowest cost trap

Disegna due alternative.

### A

Più economica.

### B

Più costosa.

Poi aggiungi almeno tre quality attribute.

```text
security
reliability
operability
```

Spiega un caso in cui B produce un TCO migliore nonostante la fattura infrastrutturale maggiore.

## Esercizio 4 — Unit economics

Per un prodotto reale o simulato definisci:

### Resource metrics

```text
cost per GB
cost per request
cost per token
cost per build minute
```

### Business metrics

```text
cost per transaction
cost per tenant
cost per case resolved
cost per successful journey
```

Poi scegli una metrica primaria e spiega quale comportamento sbagliato potrebbe incentivare.

## Esercizio 5 — Cost driver

Prendi una fattura o un'architettura ipotetica.

Classifica i costi come:

```text
fixed
variable
step
shared
transition
```

Per ogni costo variabile scrivi il driver.

Per ogni step cost scrivi il threshold che lo può far cambiare.

## Esercizio 6 — Reliability vs cost

Hai due alternative:

```text
single region
```

oppure:

```text
active-active multi-region
```

Non scegliere subito.

Prima definisci:

```text
business impact of regional failure
RTO
RPO
compliance constraints
expected frequency / exposure
operational complexity
cost premium
```

Solo dopo proponi la decisione.

## Esercizio 7 — Observability budget

Parti da:

```text
log everything
trace 100%
retain 365 days
```

Ridisegna l'observability distinguendo:

```text
metrics
trace
application log
audit evidence
security event
business event
```

Per ciascuno definisci retention e sampling coerenti con il rischio.

## Esercizio 8 — Build vs buy

Confronta un managed service con un'opzione self-managed.

Non usare soltanto il prezzo.

Includi:

```text
setup
upgrade
patching
security
backup
observability
on-call
capacity
vendor constraint
exit cost
```

Poi spiega quale fattore domina davvero la decisione.

## Esercizio 9 — AI unit economics

Hai due modelli.

```text
Model A
costo/token inferiore
accuracy task inferiore
più retry

Model B
costo/token superiore
accuracy task superiore
meno retry
```

Definisci una metrica che permetta un confronto migliore di `cost/token`.

Può essere:

```text
cost per accepted task
cost per verified change
cost per resolved case
```

Aggiungi anche una quality metric.

## Esercizio 10 — Order Operations cost review

Immagina che Finance chieda a ESI un taglio rilevante della spesa di Order Operations.

Valuta almeno:

- Service Bus Premium;
- App Service capacity;
- PostgreSQL HA;
- telemetry retention;
- non-production environment;
- Operations Desk Classic coexistence.

Per ogni voce indica:

```text
safe optimization
architecture-changing optimization
quality risk
required evidence
```

Non devi ottenere una percentuale prefissata.

Devi mostrare quali tagli sono waste reduction e quali sono quality trade-off.

---

# Autovalutazione

Sai rispondere senza guardare il capitolo?

1. Perché cost optimization non significa lowest cost?
2. Che cosa manca in un confronto basato soltanto sulle SKU?
3. Che differenza c'è fra fixed, variable e step cost?
4. Che cos'è un cost driver?
5. Perché il costo assoluto può aumentare mentre l'economia del prodotto migliora?
6. Che differenza c'è fra resource unit metric e business unit metric?
7. Che differenza c'è fra usage optimization e rate optimization?
8. Perché unused capacity e reliability headroom non sono la stessa cosa?
9. Perché una managed capability può avere TCO inferiore pur costando di più come servizio?
10. Che cosa intendiamo per value premium?
11. Qual è il costo dell'optionality?
12. Perché legacy coexistence deve avere una removal condition?
13. Perché `cost per token` non basta a valutare un sistema agentico?
14. Quando un cost cut diventa architecture change?
15. Che ruolo hanno Product, Engineering e FinOps nella decisione?

Se una risposta richiede soltanto:

```text
choose the cheaper SKU
```

probabilmente stai ancora trattando FinOps come procurement.

---

# Artefatto operativo — Cost Model

Il nuovo artefatto del capitolo è il **Cost Model**.

Template minimo:

```text
Workload
Business outcome
Cost owner
Budget owner

Direct cost categories
Shared cost categories
Engineering / operations cost
Transition cost

Cost drivers
Fixed / variable / step costs
Architectural premiums

Unit metrics
Allocation strategy

Assumptions
Baseline
Scenarios
Forecast

Optimization hypotheses
Quality risk
Evidence required

Review cadence
Review triggers
```

Non deve diventare una previsione finanziaria perfetta.

Deve permettere di discutere la relazione fra architettura, costo e valore.

---

# Cosa cambia con l'AI

L'AI abbassa alcuni costi di execution.

Può anche creare nuovi cost driver:

```text
token
context
retrieval
inference
agent retries
tool execution
verification
```

Questo sposta nuovamente il problema.

La domanda non è:

> qual è il modello più economico?

È:

> **qual è il costo del percorso completo che produce un outcome abbastanza buono da poter essere accettato?**

Per un task agentico:

```text
TotalTaskCost =
    inference
  + retrieval
  + tool execution
  + retries
  + human review
  + rework
  + failure risk
```

Non tutti i termini saranno immediatamente monetizzabili.

Ma ignorarli produce metriche facili da ottimizzare e difficili da usare.

> **L'AI rende ancora più importante distinguere il costo di generare dal costo di accettare.**

---

# Compromesso ESI del capitolo

```text
Esigenza
Finance vuole cost growth prevedibile e sostenibile.

Tensione
cost efficiency
vs
security
reliability
observability
migration safety
engineering focus

Decisione
Cost Model + unit economics + allocation + review triggers prima dei quality cut.

Costo accettato
ESI continua a pagare alcuni premium architetturali intenzionali.

Quality floor
correctness
security
required reliability
recoverability
minimum operability

Guardrail
property purchased per major cost
unit metric
owner
quality artifact reopening
review trigger
```

---

# Corollario

> **Non chiedere soltanto quanto costa l'architettura. Chiedi quale proprietà stai comprando, quale valore quella proprietà protegge e quanto a lungo sei disposto a pagarla.**

Il capitolo successivo apre la parte AI-native del libro.

A quel punto questa disciplina economica ci servirà immediatamente.

Perché un repository pronto per lavorare con agenti non è soltanto un repository con più file di istruzioni.

È un sistema che rende economico fornire contesto corretto, verificare cambiamenti e limitare il costo degli errori.