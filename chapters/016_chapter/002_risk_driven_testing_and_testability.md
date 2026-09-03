# 16.2 — Risk-driven testing e testability

Il modo più semplice per sprecare tempo nei test è iniziare dall'elenco degli strumenti.

```text
Jest?
Vitest?
Playwright?
Pact?
Postman?
JMeter?
Chaos Studio?
```

È la stessa inversione che abbiamo già incontrato con database, cloud e pattern.

Prima viene il rischio.

Poi la property da verificare.

Solo dopo viene il tipo di test e infine lo strumento.

## Dal requisito al rischio

Consideriamo un requisito di Order Operations:

```text
la stessa Payment Escalation
non deve creare due intent business
quando il client ripete la stessa richiesta
```

Questa frase contiene già molto più valore di:

```text
serve un unit test
```

Dal requisito possiamo derivare:

```text
property
→ same EscalationId = same business intent

failure
→ duplicate PaymentEscalation

impact
→ duplicate operational workflow / downstream confusion

boundary
→ API + persistence + downstream contract

best cheap evidence
→ deterministic application test

additional evidence
→ persistence/integration constraint test
→ contract/redelivery test downstream
```

Una singola property può quindi richiedere più test a livelli diversi.

Non perché vogliamo duplicare coverage.

Perché livelli diversi rispondono a domande diverse.

## Risk matrix minimale

Non serve trasformare ogni repository in un sistema GRC.

Una classificazione leggera è spesso sufficiente.

Per esempio:

| Risk class | Esempio Order Operations | Evidence direction |
|---|---|---|
| low | rendering di una label | unit/UI mirato se utile |
| medium | mapping di uno status | unit + contract/integration se attraversa boundary |
| high | tenant authorization | negative application/integration + security evidence |
| high | idempotency escalation | unit/application + DB integration + downstream duplicate test |
| critical | futuro refund economico | multi-layer + audit + failure/retry + possibly manual review |

La classificazione non è universale.

Serve a rendere esplicito perché una modifica merita più o meno evidence.

## Likelihood × impact non basta sempre

La classica formula:

```text
Risk = likelihood × impact
```

è utile, ma nei sistemi software conviene aggiungere almeno altre tre domande:

### Quanto è reversibile?

Un errore in un'etichetta è facile da correggere.

Un evento già consegnato a un sistema economico può non esserlo.

### Quanto è rilevabile?

Un `500` può essere molto visibile.

Un cross-tenant data leak può apparire come una normale `200`.

### Quanto è ampio il blast radius?

Un bug locale può colpire una singola schermata.

Un errore in un contratto condiviso può colpire più consumer.

Quindi il nostro ranking operativo considera:

```text
impact
+ likelihood
+ reversibility
+ detectability
+ blast radius
```

Non per produrre un numero scientifico finto, ma per confrontare rischi.

## La testability è una proprietà architetturale

Se una property importante è quasi impossibile da verificare, il problema potrebbe non essere il framework di test.

Potrebbe essere l'architettura.

Esempi:

- clock globale non sostituibile;
- random non controllabile;
- rete chiamata direttamente dal domain code;
- business logic dentro controller;
- database access statico ovunque;
- broker SDK mischiato alla semantica dell'evento;
- environment-dependent singleton state;
- identity ricostruita da global context implicito.

Tutti questi design rendono più difficile produrre evidence deterministica.

Per questo testability e modularità sono collegate.

Order Operations ha già fatto alcune scelte utili:

```text
PaymentEscalationUnitOfWork
MessageBroker port
OutboxPublisherClock
OutboxPublisherPolicy
Telemetry port
```

Queste porte non esistono “per fare mocking”.

Esistono perché rappresentano boundary reali e rendono controllabili tempo, persistence, broker e telemetry.

Se invece introducessimo un'interfaccia per ogni funzione soltanto per poter mockare tutto, staremmo facendo abstraction-driven testing.

Il test non deve deformare il design.

Deve aiutarci a vedere dove il design contiene dipendenze significative.

## Test seam vs abstraction theater

Un **test seam** è un punto in cui possiamo controllare una dipendenza necessaria al comportamento.

Esempio:

```ts
interface Clock {
  now(): Date;
}
```

ha senso se il tempo influenza retry, expiry, SLA o scheduling.

Un'interfaccia come:

```ts
interface StringConcatenator {
  concat(a: string, b: string): string;
}
```

probabilmente non protegge alcun boundary architetturale.

La domanda è:

> **questa abstraction esiste perché rappresenta una responsabilità o soltanto perché il test framework preferisce mockarla?**

Se la risposta è la seconda, stiamo pagando design complexity per un dettaglio della suite.

## Testability prima della produzione

Microsoft Well-Architected tratta la testing strategy come parte della progettazione del workload e raccomanda di collegare test, critical user flow, SLO, risk area, environment e ownership già durante il design.

Fonte:

- [Microsoft Learn — Build confidence in Azure workloads with effective testing practices](https://learn.microsoft.com/en-us/azure/well-architected/design-guides/testing)

Questa posizione ha una conseguenza importante:

```text
architecture review
```

non dovrebbe chiedere soltanto:

```text
come scala?
come fallisce?
come è protetto?
```

ma anche:

```text
come dimostriamo queste proprietà?
```

Se una decisione significativa non ha una risposta plausibile, la decisione non è ancora completamente governata.

## Il test layer è una decisione economica

Supponiamo di voler verificare:

> una Payment Escalation con categoria `Shipping` deve essere rifiutata.

Possiamo farlo con:

1. unit/application test;
2. integration test con PostgreSQL;
3. HTTP test dell'app completa;
4. end-to-end browser test.

Tutti potrebbero rilevare lo stesso difetto.

Ma hanno costi diversi.

Se il comportamento vive interamente nel use case, il primo layer è probabilmente il miglior fit.

Un browser test non aggiunge automaticamente qualità.

Aggiunge realismo in parti del sistema che per quella property forse non sono rilevanti.

La regola è:

> **usa il layer più piccolo che contiene tutte le cause del comportamento che vuoi verificare.**

Quando il rischio attraversa boundary, sali di livello.

## Dove il test piccolo non basta

Alcune proprietà non possono essere provate con un fake.

### SQL constraint

Se vogliamo sapere che una unique constraint impedisce davvero due active escalation incompatibili, dobbiamo coinvolgere PostgreSQL o una semantica sufficientemente equivalente.

### Serialization

Se vogliamo sapere che il messaggio pubblicato soddisfa il contract wire reale, dobbiamo testare la serializzazione.

### Azure RBAC

Se vogliamo sapere che la runtime identity non può modificare RBAC, serve una negative verification sul vero permission boundary.

### Zone failover

Se vogliamo sapere che il workload recupera da un failover reale, serve un environment capace di produrre quell'evidence.

Il fake può verificare che il nostro codice *reagirebbe* a un errore.

Non dimostra che il sistema reale produrrà quell'errore nel modo che immaginiamo.

## Hermeticity e determinismo

Più una suite dipende da:

- clock reale;
- internet;
- servizi esterni;
- shared environment;
- test data non isolati;
- ordine di esecuzione;
- race temporali;

più aumenta il rischio che il test misuri l'ambiente invece del comportamento.

Google ha storicamente promosso test piccoli e hermetic proprio per ottenere feedback più veloce e affidabile; ha anche pubblicato dati interni che mostrano una correlazione crescente fra dimensione del test e probabilità di flakiness.

Fonti:

- [Google Testing Blog — Just Say No to More End-to-End Tests](https://testing.googleblog.com/2015/04/just-say-no-to-more-end-to-end-tests.html)
- [Google Testing Blog — Test Sizes](https://testing.googleblog.com/2017/04/)

Questo non significa evitare test grandi.

Significa farli esistere quando comprano evidence che un test più piccolo non può comprare.

## Test debt

Il test code può accumulare debito quanto il production code.

Segnali:

- suite lenta senza motivo chiaro;
- fixture incomprensibili;
- mock chain lunghissime;
- test duplicati;
- assertion poco informative;
- test disabilitati;
- flaky test ignorati;
- setup condiviso fragile;
- snapshot approvati automaticamente;
- coverage target che produce test senza property.

Microsoft Well-Architected include esplicitamente il concetto di **test debt**: flaky test, coverage duplicata, test obsoleti e poor design possono erodere l'efficacia della suite nel tempo.

Fonte:

- [Microsoft Learn — Build confidence in Azure workloads with effective testing practices](https://learn.microsoft.com/en-us/azure/well-architected/design-guides/testing)

Quindi una test strategy deve includere anche la manutenzione della propria evidence.

## Il test architecture review

Prima di aggiungere una suite chiediamo:

1. quale rischio protegge?
2. quale property verifica?
3. perché questo layer è necessario?
4. quale dipendenza reale deve includere?
5. quale dipendenza può essere controllata?
6. come fallisce quando il prodotto è sbagliato?
7. come evitiamo che fallisca quando il prodotto è giusto?
8. quanto costa eseguirlo?
9. chi lo possiede quando diventa flaky?
10. quale evidence produce per una decisione di release?

Se non sappiamo rispondere, forse non stiamo progettando un test.

Stiamo soltanto aggiungendo codice alla suite.

## Corollario

> **La testability non è la facilità con cui possiamo mockare il sistema. È la facilità con cui possiamo produrre evidence sulle proprietà che contano.**