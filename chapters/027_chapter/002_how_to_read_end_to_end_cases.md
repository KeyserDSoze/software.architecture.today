# 2. Come leggere un caso end-to-end

Un caso end-to-end non è un catalogo di componenti.

Se alla fine sappiamo soltanto che un sistema usa App Service, PostgreSQL, Service Bus o un modello LLM, abbiamo imparato poco.

Il punto è ricostruire **la catena causale delle decisioni**.

## Partire dal problema, non dal diagramma finale

Ogni caso del capitolo sarà letto attraverso otto domande.

### 1. Quale problema esiste davvero?

Non:

```text
Dobbiamo costruire una piattaforma serverless.
```

Ma:

```text
Marketing deve pubblicare campagne senza aprire ticket a Engineering.
```

Non:

```text
Dobbiamo migrare a una nuova architecture.
```

Ma:

```text
Operations Desk Classic impedisce di evolvere una capability senza conoscere comportamento e dipendenze storiche.
```

Non:

```text
Dobbiamo aggiungere AI.
```

Ma:

```text
Gli operatori spendono troppo tempo a ricostruire manualmente perché un ordine è problematico.
```

Se saltiamo questa domanda, tutto ciò che viene dopo diventa più facile da giustificare e più difficile da valutare.

## 2. Qual è l'outcome?

Un outcome deve poter sopravvivere a un cambio di tecnologia.

Campaign Launchpad non ha come outcome:

```text
usare Static Web Apps
```

ma qualcosa come:

```text
un marketing operator autorizzato può pubblicare e ritirare una landing page approvata senza dipendere da un deployment manuale di Engineering
```

Il brownfield non ha come outcome:

```text
rimuovere CommonJS
```

ma:

```text
Order Operations assume la decisione di Priority secondo semantica confermata senza perdere rollback e conoscenza del comportamento legacy
```

L'AI Assistant non ha come outcome:

```text
rispondere con un LLM
```

ma:

```text
ridurre il costo cognitivo dell'investigazione senza creare una nuova authority sul dominio
```

## 3. Quali qualità sono non negoziabili?

Questa domanda impedisce al compromesso di trasformarsi in degrado casuale.

Per ogni caso distinguiamo:

```text
quality floor
optimization target
nice-to-have
```

Il quality floor non deve necessariamente essere identico fra i prodotti.

Un sito marketing pubblico e un workflow di Payment Escalation non hanno lo stesso failure cost.

Questo non significa che uno dei due possa essere costruito male.

Significa che **robustezza appropriata** e **robustezza massima** non sono sinonimi.

## 4. Chi possiede cosa?

Ogni architecture diagram tende a rendere i componenti più visibili delle responsabilità.

Noi facciamo il contrario.

Prima chiediamo:

```text
chi possiede la business rule?
chi possiede il dato?
chi possiede il rischio?
chi può autorizzare un cambio?
chi opera il failure?
```

Soltanto dopo chiediamo dove gira il codice.

Nel Case Explanation Assistant, per esempio:

```text
Payments & Risk
→ Payment truth

Orders
→ Order truth

Order Operations
→ operational case context

model
→ advisory interpretation
```

Il modello non diventa owner soltanto perché produce la frase finale mostrata all'operatore.

## 5. Quale trade-off stiamo pagando?

Ogni caso deve rendere esplicito:

```text
benefit purchased
cost accepted
quality floor
trigger
```

Non basta dire:

> Dipende.

Bisogna dire da cosa.

Esempio:

```text
Campaign Launchpad

Benefit
small operating surface

Cost
less custom runtime control

Quality floor
approved publishing + rollback + access control

Trigger
custom dynamic workflows or regulatory/data requirements outgrow current model
```

## 6. Quale failure dobbiamo progettare?

Ogni architecture case viene riletto anche dalla prospettiva del fallimento.

Per un piccolo prodotto:

```text
bad content publish
identity unavailable
failed deploy
wrong public artifact
```

Per il brownfield:

```text
semantic regression
hidden consumer
unexpected difference
one-way migration too early
```

Per il runtime AI:

```text
hallucination
missing evidence
prompt injection
provider outage
latency spike
model drift
unsafe authority claim
```

I failure mode cambiano perché cambia il sistema.

## 7. Quale evidence rende credibile la decisione?

Non tutti i claim richiedono la stessa forma di prova.

```text
business rule
→ Product/domain confirmation + behavioral test

static hosting path
→ deploy/smoke

migration compatibility
→ characterization + shadow evidence

AI groundedness
→ real model eval on versioned cases

continuity
→ secondary-maintainer drill
```

Questo evita il problema che abbiamo incontrato più volte:

> **usare evidence economica per fare claim costosi.**

## 8. Qual è la production decision?

Un caso non è end-to-end se termina con:

```text
implementation complete
```

Deve arrivare almeno a:

```text
ready
conditional
blocked
not authorized
```

oppure spiegare perché la production decision non esiste ancora.

Nel capstone principale Order Operations, per esempio, la Production Readiness Review corrente è ancora:

```text
NO-GO
```

Questo non invalida il lavoro fatto.

È il risultato corretto dell'evidence che abbiamo davvero.

## Evitare il case-study hindsight

I case study raccontati dopo il successo hanno un difetto naturale: comprimono l'incertezza.

Una timeline reale può sembrare:

```text
A → C → B → D → rollback → discovery → E
```

ma dopo qualche anno viene raccontata come:

```text
A → B → C → D → E
```

Nel libro proveremo a conservare almeno:

- alternative scartate;
- decisioni rimandate;
- evidence pending;
- costi di transizione;
- decisioni reversibili;
- trigger di review.

Il caso GitHub dell'upgrade Rails è utile proprio perché il racconto conserva diversi aspetti della transizione: dual boot, CI su più versioni, test manuale mirato, rollout progressivo e correzioni durante il percorso invece di descrivere l'upgrade come un singolo switch:

- https://github.blog/engineering/infrastructure/upgrading-github-from-rails-3-2-to-5-2/

## La metrica del capitolo

Non valuteremo un caso dal numero di pattern riconoscibili.

Lo valuteremo da una domanda più severa:

> **Se una decisione cambiasse, sappiamo indicare quale informazione o quale evidence dovrebbe essere cambiata prima?**

Se sì, stiamo osservando un sistema di decisioni.

Se no, stiamo probabilmente osservando soltanto un'implementazione.