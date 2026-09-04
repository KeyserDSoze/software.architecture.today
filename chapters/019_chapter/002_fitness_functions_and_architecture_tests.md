# 19.2 — Fitness function e architecture test

Una fitness function non è un framework.

È un meccanismo di feedback che ci dice se una caratteristica architetturale importante sta migliorando, peggiorando o uscendo dal range accettabile.

La parola chiave è **misurabile**.

`Il sistema deve essere manutenibile` è un obiettivo.

Non è ancora una fitness function.

`Il package application non può dipendere da integration` può diventarlo.

`Il restore deve rispettare RTO <= 8 ore` può diventarlo.

`La cardinalità delle metriche non deve crescere con caseId` può diventarlo.

`Ogni nuovo file deve avere un owner` può diventarlo.

Thoughtworks usa proprio le fitness function per rendere verificabili caratteristiche architetturali durante l'evoluzione. ArchUnit mostra una forma concreta: test che controllano dipendenze fra package, layer, cicli e altre regole strutturali direttamente nella normale test suite.

Riferimenti:

- [Thoughtworks — Fitness function-driven development](https://www.thoughtworks.com/en-gb/insights/articles/fitness-function-driven-development)
- [ArchUnit — Unit test your Java architecture](https://www.archunit.org/)

## Non tutte le fitness function sono test statici

Possiamo dividerle almeno in quattro famiglie.

### Strutturali

Esempi:

```text
no cyclic dependency
application must not import infrastructure
legacy code cannot leak into target domain
module A cannot read module B tables
```

Sono spesso adatte a CI.

### Operative

Esempi:

```text
core journey SLO >= target
queue oldest age < threshold
restore drill <= RTO
alert reaches owner
```

Richiedono runtime o environment realistici.

### Economiche

Esempi:

```text
cost per transaction
idle capacity
telemetry ingestion budget
cost increase after architecture change
```

Non sempre devono bloccare una build, ma devono poter cambiare una decisione.

### Organizzative

Esempi:

```text
service has maintainer
runbook owner exists
critical ADR has review trigger
exception has expiry
```

GitHub ha documentato un caso interessante con `SERVICEOWNERS`: nel proprio grande monolite usa metadata versionati e controlli CI per associare codice e servizi a maintainer, arrivando a impedire l'aggiunta di file senza ownership definita.

Riferimento:

- [GitHub Engineering — How we organize and get things done with SERVICEOWNERS](https://github.blog/engineering/architecture-optimization/how-we-organize-and-get-things-done-with-serviceowners/)

## Binary gate o trend?

Non tutto deve essere rosso o verde.

Una dependency rule può essere binaria:

```text
forbidden import
→ fail
```

La latency invece è spesso una distribuzione.

Il costo è un trend.

La complessità di una migration può richiedere review umana.

Una buona fitness function dichiara anche **che tipo di decisione produce**.

```text
violation
→ fail PR

threshold warning
→ review

trend worsening
→ investigation

runtime breach
→ operational response
```

Se ogni misura blocca la pipeline, il team imparerà a odiare la governance.

Se nessuna misura produce conseguenze, il team imparerà a ignorarla.

## La fitness function deve proteggere una proprietà, non una forma

Un anti-pattern comune è codificare troppo presto l'implementazione corrente.

Per esempio:

```text
must always use App Service
```

è probabilmente una pessima fitness function.

Protegge un prodotto.

Non una caratteristica.

Meglio chiedere:

```text
runtime must satisfy:
- private ingress requirement
- managed workload identity
- zonal availability requirement
- supported deployment automation
```

Se domani Container Apps soddisfa meglio quelle proprietà, l'architettura può evolvere.

> **Una fitness function dovrebbe rendere difficile perdere una proprietà importante, non rendere difficile cambiare tecnologia.**

## Goodhart e metriche architetturali

Quando una metrica diventa obiettivo, le persone ottimizzano per la metrica.

Questo vale anche per l'architettura.

Se imponiamo:

```text
max 10 files per module
```

il team può creare moduli artificiali.

Se imponiamo:

```text
zero dependency
```

possiamo ottenere duplicazione insensata.

Se imponiamo:

```text
100% architecture test coverage
```

abbiamo probabilmente perso il punto.

Le fitness function devono quindi essere poche, spiegabili e collegate a un rischio reale.

## Order Operations

Per Order Operations scegliamo inizialmente cinque invarianti strutturali:

```text
AF-001
src/ non importa direttamente il codice di Operations Desk Classic

AF-002
src/application non dipende da src/integration

AF-003
src/contracts non dipende dagli altri layer applicativi

AF-004
src/priority non dipende da src/integration o src/observability

AF-005
nessun SDK Azure/vendor entra nei moduli application/contracts/priority
```

Notare cosa **non** facciamo.

Non vietiamo ogni futura dipendenza.

Non imponiamo un numero massimo di classi.

Non codifichiamo `modular monolith` come slogan.

Proteggiamo i confini che oggi hanno una motivazione esplicita.

## Quando una fitness function va eliminata

Anche i guardrail possono diventare legacy.

Se cambia il boundary, un architecture test può diventare obsoleto.

Per questo ogni fitness function deve avere almeno:

```text
ID
property protected
risk
owner
mechanism
failure action
review trigger
```

Una regola senza owner e senza possibilità di revisione rischia di diventare una superstizione automatizzata.

> **Automatizzare una decisione non la rende eterna. La rende ripetibile finché continua ad avere senso.**
