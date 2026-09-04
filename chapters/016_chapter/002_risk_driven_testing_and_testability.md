## Risk-driven testing e testability

Il modo più semplice per progettare male una suite è iniziare dal framework:

```text
Jest?
Vitest?
Playwright?
Pact?
Postman?
JMeter?
Chaos Studio?
```

È la stessa inversione incontrata con database, cloud e pattern. Prima viene il rischio. Poi la property che vogliamo mantenere vera. Solo dopo decidiamo quale boundary debba essere attraversato per produrre una prova credibile e, infine, quale strumento abbia il fit migliore.

## Dal requisito alla evidence chain

Consideriamo una property di Order Operations:

```text
same EscalationId
→ same business intent
```

Il failure che vogliamo impedire non è “un metodo viene chiamato due volte”. È la creazione di un secondo intent business per una richiesta che il sistema dovrebbe riconoscere come replay.

Da qui possiamo derivare la catena:

```text
property
→ same EscalationId = same business intent

failure
→ duplicate/conflicting PaymentEscalation

impact
→ workflow duplicato o semantica incoerente downstream

cheap evidence
→ deterministic application test

real-boundary evidence
→ PostgreSQL/API integration

cross-domain evidence
→ duplicate delivery test lato Payments & Risk
```

Questa è una differenza importante: più layer possono proteggere la stessa area senza duplicare la stessa assertion. Ognuno falsifica una claim diversa.

L’application test può dimostrare la regola. PostgreSQL può dimostrare constraint e transaction semantics. Il consumer test può dimostrare che una redelivery tecnica non crea un secondo workflow business.

## Risk class come spiegazione, non come burocrazia

Non serve costruire un sistema GRC per ogni pull request. Una classificazione leggera basta se rende leggibile perché chiediamo evidence diversa.

| Risk class | Esempio Order Operations | Evidence direction |
|---|---|---|
| low | testo/label interna | test mirato soltanto se utile |
| medium | mapping di status | application + boundary se condiviso |
| high | tenant authorization | negative application + authenticated integration |
| high | escalation idempotency | application + PostgreSQL/API |
| critical | futura operazione economica | multi-layer + audit + failure/retry + domain gate |

La classificazione non è universale. Serve a evitare che due change della stessa dimensione vengano trattati come equivalenti quando reversibilità, detectability e blast radius sono completamente diversi.

Oltre a likelihood e impact, per il software chiediamo almeno:

```text
Quanto è reversibile?
Quanto è rilevabile prima del danno?
Quanto può espandersi il blast radius?
Quale trust/business boundary attraversa?
```

Un `500` è spesso evidente. Un cross-tenant read può sembrare un normale `200`. Un errore locale può essere rollbackabile; un event già trasformato in side effect economico potrebbe richiedere compensazione o human review.

## Testability: poter produrre evidence senza deformare il design

Se una property importante è quasi impossibile da verificare, il problema può essere architetturale.

Clock globale non controllabile, network call dentro domain logic, database statico usato ovunque, business rule nel controller, identity ricostruita da global context implicito e broker SDK mischiato alla semantica dell’evento rendono difficile isolare le cause del comportamento.

Order Operations ha già creato alcune porte utili:

```text
PaymentEscalationUnitOfWork
MessageBroker
OutboxPublisherClock
OutboxPublisherPolicy
Telemetry
```

Non esistono per soddisfare un mocking framework. Rappresentano boundary reali: persistenza atomica, broker, tempo, policy di retry e osservabilità.

Questa distinzione separa un **test seam** da abstraction theater.

Un `Clock` ha senso se retry, expiry o reconciliation dipendono dal tempo. Un’interfaccia attorno a una pura concatenazione di stringhe probabilmente aggiunge design complexity soltanto per permettere un mock.

> **La testability non è quante cose possiamo sostituire con fake. È quanto facilmente possiamo controllare le cause rilevanti e osservare l’outcome che ci interessa.**

Microsoft Well-Architected tratta la testing strategy come una parte del workload design, collegando risk area, critical user flow, environment e ownership già in fase architetturale.

Fonte:

- [Microsoft Learn — Build confidence in Azure workloads with effective testing practices](https://learn.microsoft.com/en-us/azure/well-architected/design-guides/testing)

La conseguenza pratica è che un’architecture review dovrebbe chiedere, per una decisione importante:

```text
come scala?
come fallisce?
come è protetta?
come la osserveremo?
come la falsifichiamo prima del deployment?
```

Se l’ultima risposta richiede “lo vedremo in produzione”, abbiamo trovato un gap di testability o un rischio deliberatamente accettato che deve essere dichiarato.

## Il boundary più piccolo sufficiente

Supponiamo di voler verificare:

> un case `Shipping` non può generare una Payment Escalation.

Possiamo costruire application test, PostgreSQL integration, HTTP test o browser E2E. Tutti potrebbero fallire quando la regola viene violata. Ma il realismo aggiunto da database, network e browser non cambia la causa della property se la decisione vive interamente nel use case.

Il layer più economico è quindi quello piccolo.

La regola generale è:

> **Usa il layer più piccolo che contiene tutte le cause capaci di rendere falsa la property.**

Quando la property attraversa un boundary reale, saliamo.

Se vogliamo dimostrare che una unique constraint protegge davvero una race, serve PostgreSQL. Se vogliamo verificare il wire contract reale, serve serialization/contract evidence. Se vogliamo sapere che la runtime identity non può modificare RBAC, serve Azure. Se vogliamo provare un failover, serve un environment capace di produrlo.

Un fake può dimostrare che il nostro codice reagirebbe a una condizione simulata. Non dimostra che la tecnologia reale abbia esattamente quelle semantics.

## Determinismo: ridurre il numero di cose che il test sta accidentalmente misurando

Più una suite dipende da clock reale, Internet, servizi condivisi, test data globali, execution order, race temporali o state non isolato, più è facile che un failure racconti l’ambiente invece del prodotto.

Google ha promosso a lungo test piccoli e hermetic per ottenere feedback veloce e affidabile e ha pubblicato dati interni che mostrano un aumento della flakiness nei test più grandi.

Fonti:

- [Google Testing Blog — Just Say No to More End-to-End Tests](https://testing.googleblog.com/2015/04/just-say-no-to-more-end-to-end-tests.html)
- [Google Testing Blog — Test Sizes](https://testing.googleblog.com/2017/04/)

Questo non vieta i test grandi. Chiede che il loro costo compri una evidence impossibile da ottenere più economicamente.

## Test debt: anche il sistema di prova può perdere qualità

Una suite può accumulare debt sotto forme molto riconoscibili:

```text
fixture incomprensibili
mock chain lunghe
test duplicati
snapshot approvati meccanicamente
test disabilitati
flaky test ignorati
setup condiviso fragile
coverage-driven test senza property
suite lenta senza ownership
```

Microsoft include esplicitamente flaky, duplicated e obsolete test nel concetto di test debt.

Fonte:

- [Microsoft Learn — Build confidence in Azure workloads with effective testing practices](https://learn.microsoft.com/en-us/azure/well-architected/design-guides/testing)

Il problema è che questo debt degrada la qualità della evidence. Una pipeline lenta viene bypassata; un test che nessuno capisce viene aggiornato finché torna verde; un flake abituale smette di segnalare qualcosa.

## Una review semplice prima di aggiungere un test

Prima di aggiungere nuova suite code vogliamo poter rispondere a queste domande:

```text
Quale rischio/property protegge?
Quale bug realistico dovrebbe farlo fallire?
Perché questo boundary è necessario?
Quale dipendenza deve essere reale?
Quale può essere controllata?
Come evitiamo false failure?
Quanto costa eseguirlo?
Chi lo possiede se diventa flaky?
Quale gate usa questa evidence?
```

Se la risposta è soltanto “aumenta la coverage”, non abbiamo ancora spiegato il valore del test.

## Cosa cambia con l’AI

Gli agenti possono generare test seam, mock e fixture in modo quasi automatico. Questo rende ancora più importante non lasciargli deformare il design per rendere facile la suite.

Una buona richiesta AI non è:

```text
make this code easy to test
```

ma:

```text
Given this property and risk, identify the smallest boundary that can falsify it.
Propose seams only where they represent real responsibilities.
Flag abstractions introduced solely to satisfy mocking.
```

L’obiettivo non è massimizzare la sostituibilità dei componenti. È massimizzare la qualità della evidence con il minimo coupling artificiale.

> **La testability è la facilità con cui possiamo produrre evidence sulle proprietà che contano senza trasformare il production design in una collezione di mock seam.**