# 20.4 — Il costo delle qualità che vogliamo

Le quality attribute non sono gratuite.

La frase sembra ovvia finché non dobbiamo scegliere **quanto** pagare per ciascuna e, soprattutto, quando smettere di pagarne una versione più forte di quella che il business richiede.

Nel Capitolo 6 abbiamo trasformato aggettivi come `reliable`, `secure` e `scalable` in proprietà verificabili. Il Capitolo 20 aggiunge una seconda domanda: **quale premium economico introduce quella proprietà?**

L'obiettivo non è monetizzare tutto. È evitare che il costo delle qualità rimanga implicito e che ogni riduzione di spesa venga trattata come neutrale rispetto all'architettura.

## Reliability compra capacità di assorbire failure

Più resilience significa normalmente più risorse, replica, test, recovery mechanism e operabilità.

Microsoft Well-Architected osserva che massimizzare la reliability introduce costi finanziari e di engineering e raccomanda di evitare over-engineering oltre i requirement di business.

Fonte:

- [Microsoft Learn — Design principles of a mission-critical workload](https://learn.microsoft.com/en-us/azure/well-architected/mission-critical/mission-critical-design-principles)

Possiamo vedere una progressione semplice:

```text
single instance
→ failure locale non assorbito

multiple instances + zone direction
→ failure scope intra-region più contenuto

multi-region active-active
→ ulteriore failure scope coperto
```

Questi non sono tre livelli di maturità. Sono tre pacchetti diversi di proprietà, costo e complessità.

Order Operations ha scelto di pagare una direzione di zone resilience senza pagare active-active multi-region perché l'RTO regionale simulato corrente non richiede quel premium. Se l'RTO cambierà, la discussione economica e la Reliability Contract dovranno riaprirsi insieme.

## Security compra riduzione dell'esposizione

Security genera costi visibili — tier Premium, private connectivity, scanning, key management, SIEM ingestion — e costi di ownership: identity design, permission review, security testing, incident response ed evidence di compliance.

Nel Capitolo 13 abbiamo già incontrato un esempio concreto. La direzione Private Link per Service Bus implica Premium tier. Quella differenza di costo non è “security tax” priva di significato: compra la riduzione della public reachability coerente con il Threat Model corrente.

Questo cambia il modo in cui Finance e Engineering devono discutere una possibile ottimizzazione. Passare a un meccanismo più economico che rimuove private data plane non è semplice rightsizing. Significa cambiare una proprietà di security e richiede di riaprire Threat Model, Security Control Matrix e deployment decision.

> **Se il cost cut cambia il threat che accettiamo, il cost cut è architecture.**

## Observability compra spiegabilità operativa

Telemetry è particolarmente facile da sovrapprovisionare perché raccogliere sembra economico nel momento in cui aggiungiamo una nuova dimensione, un log o una trace. Il costo arriva dopo, attraverso ingestion, retention, cardinality pressure, query e rumore operativo.

Per questo la disciplina introdotta nel Capitolo 15 — bounded dimensions, sampling e retention per signal class — è già anche una disciplina economica.

La domanda non è “quanto logging possiamo permetterci?”. È: **quale evidence serve davvero per misurare SLI, investigare i failure e ricostruire i critical journey?**

La telemetry utile deve essere abbastanza ricca da spiegare il sistema e abbastanza governata da non diventare un secondo workload che cresce più rapidamente del primo.

## Isolation compra indipendenza, ma moltiplica superfici

Separare componenti può comprare failure isolation, security isolation, independent deployment, independent scaling e ownership. Allo stesso tempo può introdurre più runtime, network, certificate, pipeline, dashboard, on-call surface e contratti.

Questo è uno dei motivi per cui Order Operations è rimasto un modular monolith. La scelta non dice che i microservice siano “troppo complessi” in assoluto. Dice che, per il workload corrente, il premium permanente della distribuzione non compra abbastanza proprietà aggiuntiva da giustificare il nuovo cost surface.

Se domani boundary organizzativi o scaling requirement cambieranno, il calcolo potrà cambiare con loro.

## Performance può essere comprata in modi diversi

Possiamo comprare performance aggiungendo compute, memory, cache, replica o datastore specializzati. Oppure possiamo investirvi engineering effort attraverso query migliori, algoritmi migliori o access pattern più coerenti.

La prima famiglia aumenta spesso il recurring run cost. La seconda aumenta il costo iniziale di engineering e può ridurre la curva futura.

La domanda economica diventa quindi temporale: **quanto lavoro vale investire oggi per evitare una spesa ricorrente domani?**

La risposta dipende dalla durata prevista del prodotto, dal volume e dalla stabilità della domanda. Un workload destinato a durare anni con una curva di traffico crescente giustifica ottimizzazioni diverse da un tool interno con vita breve e basso volume.

## Optionality: pagare oggi per un futuro possibile

Una delle forme più invisibili di premium è l'optionality.

Possiamo introdurre multi-cloud abstraction “nel caso un giorno serva”, Kafka “nel caso serva replay”, Kubernetes “nel caso serva portability” o multi-region “nel caso cambi lo SLA”. Nessuna di queste possibilità è assurda. Il problema è trattarle come gratuite.

L'optionality può costare abstraction complexity, lowest-common-denominator design, skill aggiuntive, test matrix più larga, infrastruttura duplicata e delivery più lenta.

Il valore dell'optionality cresce quando il costo di cambiare strada in futuro è davvero alto. Per una two-way door spesso possiamo comprare meno optionality upfront e mantenere un exit path ragionevole. Per una one-way door il premium può invece essere giustificato.

> **Non tutta la flessibilità futura merita un anticipo oggi.**

## Complexity cost: la fattura dell'attenzione

La complessità raramente compare come SKU, ma produce costo ogni volta che qualcuno deve capire, modificare o operare il sistema.

Più componenti richiedono più comprensione. Più boundary richiedono più contratti. Più topology crea più failure mode. Più astrazioni moltiplicano le decisioni da ricostruire durante un change.

È per questo che una tecnologia gratuita può essere molto costosa: la licenza è zero, il cognitive load no.

Questa considerazione non deve diventare conservatorismo tecnologico. `fit before fashion` non significa usare soltanto ciò che conosciamo già. Significa pretendere che una nuova capability compri abbastanza valore da ripagare anche il costo di impararla e possederla.

## Architectural premium: dare un nome al costo intenzionale

Per ESI possiamo chiamare **architectural premium** la quota di costo aggiuntiva che accettiamo deliberatamente perché compra una proprietà necessaria.

| Premium | Meccanismo | Proprietà comprata | Review trigger |
|---|---|---|---|
| CP-01 | Service Bus Premium + private endpoint direction | private data plane + current security boundary | security boundary o alternativa di piattaforma cambia |
| CP-02 | App Service capacity >= 2 + zone direction | intra-region resilience / headroom | SLO, RTO o failure evidence cambia |
| CP-03 | metrics, logs, traces, retention | SLI measurement + investigation | telemetry cresce senza nuova evidence utile |
| CP-04 | legacy + target coexistence | reversibility + semantic comparison | cutover evidence permette retirement |

La tabella non dimostra che il premium sia corretto per sempre. Fa qualcosa di più utile: rende possibile riesaminarlo.

Un premium diventa sospetto quando nessuno sa più nominare la proprietà che compra o quando la proprietà non è più richiesta.

## Waste reduction e architecture change non sono la stessa cosa

Alcune ottimizzazioni possono ridurre la spesa lasciando intatte le proprietà: rate discount, reservation coerente con una domanda stabile, rightsizing dentro headroom già verificato, rimozione di risorse inutilizzate o retention ridondante che non serve a nessuna evidence.

Altre proposte cambiano direttamente il sistema: rimuovere redundancy, ridurre retention sotto l'investigation need, rendere pubblico un data plane privato, eliminare backup o consolidare isolation boundary.

La seconda categoria deve riaprire il relativo artefatto di qualità.

> **Non chiediamo se una qualità “costa troppo” in astratto. Chiediamo se il premium che paghiamo è ancora proporzionato al rischio o al valore che quella qualità protegge.**