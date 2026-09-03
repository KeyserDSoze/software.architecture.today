# SLI, SLO ed error budget

“Il sistema deve essere affidabile” è un requisito debole quanto “deve essere veloce”.

Per progettare reliability servono indicatori, target e conseguenze operative.

La Site Reliability Engineering di Google usa tre concetti che sono diventati un vocabolario estremamente utile:

```text
SLI — Service Level Indicator
SLO — Service Level Objective
SLA — Service Level Agreement
```

Google definisce un **SLI** come una misura quantitativa di un aspetto del servizio e un **SLO** come il target associato a quell'indicatore.

Fonte:

- [Google SRE — Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)

## Partire dall'utente, non dalla metrica facile

È facile misurare:

```text
CPU
RAM
pod count
connection count
```

Ma un operatore di Order Operations non compra CPU.

Compra la capacità di:

```text
vedere i casi
aprire il dettaglio
richiedere una escalation
sapere se la richiesta è stata presa in carico
```

Google raccomanda esplicitamente di partire da ciò che interessa agli utenti, non semplicemente da ciò che è facile misurare.

Microsoft propone la stessa direzione nel proprio health modeling: SLI e SLO devono contribuire a una definizione di health allineata ai business scenario.

Fonti:

- [Google SRE — Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)
- [Microsoft Learn — Health modeling for workloads](https://learn.microsoft.com/azure/well-architected/design-guides/health-modeling)

## Good event / valid event

Un modo utile per definire un SLI è ragionare su eventi buoni ed eventi validi.

Esempio concettuale:

```text
SLI availability
=
good requests / valid requests
```

Ma la parola `good` deve avere semantica.

Per una API potrebbe significare:

```text
status success
AND latency <= target
AND response semanticamente valida
```

Non basta contare HTTP 2xx se la risposta è inutilizzabile.

## SLO per journey, non per rettangolo

Un SLO di App Service da solo non descrive l'affidabilità del prodotto.

Il critical journey potrebbe essere:

```text
operator authenticated
→ list problematic orders
→ open case
→ request payment escalation
→ durable local acceptance
```

Il journey attraversa più componenti.

Per questo distingueremo:

- **component target** — utile per diagnosi e capacity;
- **flow SLO** — descrive ciò che il prodotto promette internamente;
- **external SLA** — eventuale commitment contrattuale.

### SLA del vendor ≠ SLO del workload

Un cloud provider può offrire uno SLA su un servizio.

Il nostro workload usa più servizi e aggiunge codice, configurazione, deployment e dipendenze.

Non possiamo sommare slogan SLA e chiamarli reliability architecture.

Microsoft distingue esplicitamente gli SLA esterni dagli SLO interni del workload.

Fonte:

- [Microsoft Learn — Monitoring workload reliability](https://learn.microsoft.com/azure/well-architected/reliability/monitoring)

## Proposta iniziale ESI

Per rendere concreto il capitolo introduciamo una **prima proposta di reliability target** per Order Operations.

Questi numeri sono **requisiti simulati ESI**, non benchmark industriali e non misure già osservate.

Devono essere verificati quando il capstone avrà workload e ambienti production-like.

### SLO-01 — Core operator journey availability

Finestra:

```text
rolling 28 days
```

Obiettivo iniziale:

```text
99.9% good core journey requests
```

Nel primo modello, una richiesta è `good` se:

- l'operatore autenticato e autorizzato può usare la capability;
- non riceve un errore server non previsto;
- la risposta arriva entro il latency threshold del journey;
- il sistema non dichiara come affidabile un dato che sa essere non affidabile.

Il latency threshold verrà raffinato con misure reali.

### SLO-02 — Durable Payment Escalation acceptance

Una escalation valida, quando Order Operations e il proprio authoritative datastore sono disponibili, deve essere:

```text
persistita con il relativo outbox intent
oppure
rifiutata esplicitamente
```

Non deve esistere uno stato:

```text
"forse accettata, forse no"
```

visibile al client per un normale failure applicativo.

Questo SLO privilegia **durability e determinismo dell'acceptance**.

### SLO-03 — Payment Escalation delivery

Prima proposta business:

```text
99% delle escalation accettate
consegnate al broker entro 5 minuti
```

con un secondo limite operativo:

```text
nessuna escalation critica deve restare invisibilmente pending oltre il business delay threshold
```

Il target di 5 minuti è una scelta simulata di ESI per il caso didattico. Non viene presentato come valore universale.

## Perché non 100%

Google SRE sottolinea che perseguire SLO del 100% è spesso irrealistico e indesiderabile: può bloccare innovazione e richiedere soluzioni molto più costose di quanto l'utente riesca a percepire o valorizzare.

Fonte:

- [Google SRE — Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)

Questo non significa accettare errori con leggerezza.

Significa riconoscere che reliability ha un costo e che quel costo deve essere discusso insieme al business.

## Error budget

Se abbiamo:

```text
SLO = 99.9%
```

l'error budget corrispondente è:

```text
0.1%
```

L'error budget rende operativo il compromesso fra:

```text
stabilità
↔
velocità di cambiamento
```

Google lo usa proprio come meccanismo condiviso fra product development e reliability engineering.

Fonti:

- [Google SRE — Embracing Risk](https://sre.google/sre-book/embracing-risk/)
- [Google SRE Workbook — Error Budget Policy](https://sre.google/workbook/error-budget-policy/)

## Non è un budget da spendere intenzionalmente male

Un errore comune è interpretare:

```text
abbiamo ancora error budget
```

come:

```text
possiamo rompere qualcosa
```

No.

L'error budget serve a governare decisioni.

Per esempio:

```text
budget sano
→ possiamo mantenere normale release velocity

budget in rapido consumo
→ aumentiamo attenzione su reliability

budget esaurito
→ riduciamo change risk e diamo priorità alla stabilità
```

La policy precisa è una decisione organizzativa.

## Error budget e compromesso ESI

Immaginiamo che Product chieda una nuova capability importante.

Il team Reliability segnala che il core journey ha consumato gran parte dell'error budget a causa di failure ripetuti sul database.

Senza un meccanismo condiviso la conversazione diventa politica:

```text
Product: dobbiamo consegnare

Operations: dobbiamo fermarci
```

Con SLO ed error budget possiamo discutere:

```text
qual è il rischio osservato?
quanto budget resta?
quale feature stiamo proteggendo?
quale reliability work riduce il failure mode dominante?
```

L'obiettivo non è automatizzare la decisione.

È darle evidence.

## Burn rate

Guardare soltanto se l'SLO mensile è già fallito è troppo tardi.

Serve capire **quanto velocemente stiamo consumando il budget**.

Un incidente breve ma molto intenso può bruciare una grande parte del budget.

Una degradazione piccola ma continua può fare lo stesso lentamente.

Il burn rate rende visibile questo comportamento.

Non introdurremo ancora una formula di alert definitiva per ESI: appartiene al prossimo Capitolo 15 sull'Observability.

Ma il principio entra adesso:

> **La reliability deve segnalare non soltanto che abbiamo perso l'obiettivo, ma che lo stiamo perdendo.**

## Misurare nel punto sbagliato

Supponiamo che l'API registri:

```text
99.99% success
```

ma che il reverse proxy, identity layer o private DNS impediscano a parte degli operatori di raggiungerla.

La metrica server-side può essere ottima perché le richieste fallite non arrivano nemmeno al server.

Google racconta un esempio simile con Gmail: misurare più vicino all'esperienza client portò a una valutazione di availability significativamente diversa da quella server-side.

Fonte:

- [Google SRE — Production Services Best Practices](https://sre.google/sre-book/service-best-practices/)

Per ESI serviranno quindi anche synthetic journey e signal esterni al solo processo applicativo.

## SLO e stakeholder

Uno SLO non è una costante matematica scoperta dagli engineer.

È una decisione che coinvolge:

```text
Product
Operations
Engineering
SRE / Platform
Security quando rilevante
Finance quando il costo cambia materialmente
```

Google SRE osserva esplicitamente che i target hanno implicazioni di prodotto e business e devono riflettere trade-off di staffing, time-to-market e funding.

Fonte:

- [Google SRE — Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)

## Non copiare gli SLO degli altri

Leggere:

```text
Netflix usa X
Google usa Y
una banca usa Z
```

non produce il nostro SLO.

La domanda è:

> **Quanto failure può tollerare questo journey prima che il costo per ESI diventi inaccettabile?**

Per Order Operations, un outage di qualche minuto durante una finestra operativa può essere serio ma diverso da un outage sul payment authorization path di un checkout pubblico.

Stessa azienda.

Stesso cloud.

Target diversi.

## AI e SLO

Un agente può:

- estrarre metriche candidate;
- proporre SLI;
- calcolare error budget;
- generare query;
- confrontare historical incident;
- simulare burn rate;
- produrre dashboard.

Ma può anche fare qualcosa di molto pericoloso:

```text
inventare un 99.99%
perché "suona enterprise"
```

Il numero diventa poi architecture driver:

```text
99.99%
→ più replica
→ più zone/region
→ più cost
→ più complexity
```

Per questo:

> **Un SLO senza una ragione business è un numero che sta per diventare infrastruttura.**

## Artefatto che nascerà dal capitolo

Nel capstone introdurremo un **Reliability Contract** che raccoglie:

```text
critical flow
SLI
SLO
measurement window
failure semantics
degraded mode
RTO/RPO
owner
error budget policy
review trigger
```

Non sarà una dashboard.

Sarà il contratto che dirà alla dashboard cosa deve significare.