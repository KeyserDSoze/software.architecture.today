## La Non-Functional Requirements Card

I requisiti non funzionali diventano utili quando smettono di essere un elenco standard e iniziano a funzionare come **input di decisione**. Per questo introduciamo un artefatto operativo: la **Non-Functional Requirements Card**.

Non è obbligatoria per ogni task. Serve quando latency, availability, recovery, security, cost o altre proprietà possono cambiare materialmente l'architettura, il rischio o il costo di ownership.

La struttura resta intenzionalmente esplicita:

```markdown
# Non-Functional Requirements Card

## Critical journeys

## Latency

## Throughput and capacity

## Availability

## Consistency

## Durability

## Recovery
- RTO:
- RPO:

## Security and privacy

## Operability

## Maintainability and changeability

## Cost constraints

## Growth assumptions

## Quality priorities

## Explicit non-goals

## Verification method

## Review triggers
```

Il valore non sta nel riempire ogni campo. Sta nel capire **quali campi meritano davvero di restringere il design space**.

## Partire dal journey, non dalla metrica

Prima di parlare di percentili o SLA, identifichiamo i percorsi che meritano protezione. Una stessa applicazione può contenere funzioni con qualità dominanti differenti:

| Journey | Criticità | Qualità dominante |
| --- | --- | --- |
| creare ordine | alta | correctness, availability |
| consultare ordine | alta | latency, availability |
| esportare report | bassa | throughput batch |
| aggiornare preferenze | media | consistency |

Questa distinzione evita di imporre al report lo stesso costo del checkout o di ottimizzare la latency di una capability il cui vero rischio è la perdita di dati.

## Target con contesto

Un requisito utile tende a combinare metrica, soglia, condizione e metodo di verifica. Per esempio:

> Il p95 della consultazione ordine deve restare sotto 300 ms fino a 500 richieste al secondo, misurato end-to-end su un dataset rappresentativo.

Oppure:

> In caso di perdita completa della regione primaria, il critical journey di consultazione deve poter essere ripristinato entro 60 minuti con perdita massima di 5 minuti di dati confermati.

Non tutte le proprietà hanno bisogno di un numero. Security, maintainability e operability possono essere espresse con invarianti e scenari:

```text
nessun modulo esterno a Orders può aggiornare direttamente lo stato dell'ordine
una modifica al provider di pagamento non deve richiedere modifiche al modello dominio Orders
```

Il punto è sempre lo stesso: la frase deve aiutarci a riconoscere se una soluzione soddisfa la proprietà oppure no.

## Priorità: decidere prima del conflitto

Non possiamo massimizzare tutto. La card deve quindi rendere visibile una priorità, per esempio:

```text
1. correctness
2. tenant isolation
3. availability del lookup
4. operability
5. latency
6. cost
```

Questo non significa che il costo sia irrilevante. Significa che, se due proprietà entrano in tensione, non iniziamo la discussione tecnologica fingendo che abbiano tutte lo stesso peso.

La priorità è particolarmente utile quando team diversi ottimizzano dimensioni diverse: Platform può vedere soprattutto operability, Security il controllo, Product la user experience e Finance il costo. La card costruisce un ordine condiviso prima che il conflitto venga incorporato nella soluzione.

## Explicit non-goals: progettare anche ciò che non serve

Uno dei campi più importanti dice che cosa **non** stiamo cercando di ottenere:

```text
- non progettiamo oggi per 100.000 richieste al secondo;
- non richiediamo active-active multi-region;
- non richiediamo RPO zero;
- non richiediamo deploy indipendente di ogni modulo;
- non ottimizziamo il sistema per analytics real-time.
```

I non-goal proteggono il progetto dalla paura di un futuro indefinito. Non impediscono al sistema di evolvere; impediscono di pagare oggi capacità che nessun requisito ha ancora reso necessarie.

## Crescita attesa, non crescita immaginabile

La scala futura va formulata come assunzione revisionabile:

```text
carico attuale: 20 req/s
picco attuale: 70 req/s
stima a 12 mesi: 150 req/s
stress target: 500 req/s
```

Questi numeri forniscono margine senza trasformare il massimo concepibile in requirement. Se il business cambia, scatterà un review trigger e rivedremo la card.

## Verification method: la qualità deve incontrare l'evidenza

Ogni proprietà importante dovrebbe avere un modo plausibile per essere verificata. Può essere un load test, un restore drill, un contract test, una security review, un synthetic journey, una architecture review, una cost review o un incident exercise.

Se non sappiamo ancora come verificare una proprietà, lo dichiariamo. È meglio un limite esplicito di una confidence costruita soltanto sul documento.

## Review trigger: anche gli NFR scadono

Traffico, mercati geografici, normative, tenant enterprise, costi di downtime, incidenti ricorrenti e cambiamenti del team possono rendere obsoleta una quality assumption. La card deve quindi indicare quando riaprire la decisione.

Questo rende il profilo di qualità parte di un ciclo:

```text
outcome
→ quality target
→ architecture
→ evidence
→ review trigger
→ nuovo target o nuova decisione
```

## La card non sceglie il prodotto

La NFR Card non dovrebbe contenere scorciatoie del tipo:

```text
availability → Kubernetes
scalability → microservices
performance → Redis
```

Questi sono salti dalla proprietà alla soluzione. La card deve descrivere il problema abbastanza bene da permettere a più alternative di competere.

> **Un buon NFR restringe lo spazio delle soluzioni senza fingere che una sola tecnologia sia già contenuta nella domanda.**
