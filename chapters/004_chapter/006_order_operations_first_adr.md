## Order Operations — la prima decisione architetturale esplicita

Finora abbiamo resistito alla tentazione di scegliere troppo presto. Nel Capitolo 2 abbiamo definito il problema; nel Capitolo 3 abbiamo reso visibili system of interest, ownership, critical journey, freshness e failure topology. Ora abbiamo abbastanza contesto per prendere una decisione architetturale vera.

Order Operations deve permettere agli operatori di individuare e investigare ordini problematici. Authorization e data ownership sono non negoziabili. Per alcune informazioni un breve ritardo può essere accettabile, purché sia comprensibile; la capability è ancora in fase iniziale, il team è piccolo e non abbiamo evidenza che il carico della console richieda già una piattaforma di lettura separata.

La domanda non è quindi “qual è l'architettura più evoluta?”. È **quale trade-off ha il fit migliore oggi senza renderci irresponsabilmente rigidi domani**.

## Due alternative credibili

La prima alternativa è un **lookup live** attraverso i boundary applicativi di Orders, Payments e Shipping. Mantiene pochi componenti, evita una pipeline di sincronizzazione e offre dati potenzialmente molto freschi. In cambio, parte della latency e dell'availability del journey dipende dalle fonti operative e il workload di lettura rimane più vicino a quello transazionale.

La seconda alternativa è un **read model asincrono** alimentato dagli aggiornamenti dei domini. Isola meglio il workload della console e permette uno schema ottimizzato per la lettura, ma introduce eventual consistency, consumer, lag, replay, recovery e una nuova superficie operativa.

Il read model può sembrare più “architetturale” perché contiene più componenti e più concetti interessanti da discutere. Ma questa non è una gara di sofisticazione. Al momento non abbiamo evidenza che la complessità aggiuntiva compri un beneficio necessario.

Scegliamo quindi **lookup live**, ma lo facciamo come decisione esplicita, con quality floor e trigger di revisione.

## Il compromesso ESI

Commerce & Operations vuole una capability utile presto. Platform Engineering vuole evitare che una feature giovane introduca una pipeline operativa non giustificata. Allo stesso tempo non possiamo ottenere semplicità bypassando ownership, authorization o boundary di dominio.

Il compromesso consiste nel mantenere la soluzione live nella prima fase e accettare che Order Operations condivida parte del failure domain e del carico con i sistemi operativi esistenti. Il quality floor rimane però chiaro: niente accesso arbitrario cross-domain alle tabelle, timeout e degrado devono essere governati, i dati incompleti non possono essere presentati come certamente correnti e l'authorization deve attraversare il journey.

Questa distinzione separa compromesso e scorciatoia. La scorciatoia sarebbe “leggiamo direttamente tutto perché è più veloce”. La decisione architetturale è “manteniamo il lookup live perché oggi ha fit migliore, proteggiamo i confini e misuriamo le condizioni che potrebbero renderlo insufficiente”.

## ADR-001 — Lookup operativo sui dati live

Qui la struttura resta intenzionalmente formale perché stiamo costruendo il primo artefatto decisionale del capstone.

```markdown
# ADR-001 — Preferire lookup live prima di introdurre un read model dedicato

Status: accepted

## Contesto

Order Operations deve mostrare agli operatori informazioni sufficientemente aggiornate per investigare ordini problematici.
Il prodotto è in fase iniziale, il traffico è moderato e il team è piccolo.
Ownership e access control sono non negoziabili.

## Problema

Dobbiamo fornire una vista affidabile senza introdurre complessità operativa non giustificata dal carico attuale.

## Architecturally Significant Requirements

- authorization e tenant isolation devono essere preservate;
- Orders, Payments e Shipping mantengono ownership dei propri dati;
- per alcuni dati un breve ritardo è accettabile solo se la freshness è comprensibile;
- il journey non deve introdurre carico sproporzionato sui workload transazionali;
- la soluzione deve rimanere operabile da un team piccolo.

## Vincoli

- piccolo team;
- semplicità operativa prioritaria nella prima fase;
- nessuna evidenza attuale che richieda isolamento completo del workload di lettura;
- target di freshness e volume ancora da consolidare con evidenza runtime.

## Alternative considerate

1. lookup live attraverso i boundary applicativi;
2. read model asincrono dedicato.

## Decisione

Usare lookup live sui dati operativi attraverso i confini logici di Orders, Payments e Shipping.

## Motivazione

La soluzione soddisfa i requisiti attuali con minore complessità operativa.
Il carico osservato non giustifica ancora una pipeline asincrona dedicata.

## Conseguenze positive

- meno componenti;
- nessun lag di proiezione da governare;
- recovery più semplice;
- minore costo operativo iniziale.

## Conseguenze negative

- la console condivide parte del failure domain delle fonti operative;
- crescita del traffico di lettura può influenzare workload transazionali;
- la latency dipende maggiormente dalle dipendenze live.

## Quality floor

- authorization verificata;
- ownership rispettata;
- niente accesso arbitrario cross-domain alle tabelle;
- dati stale o incompleti non devono essere rappresentati come certamente correnti;
- timeout e degrado parziale devono produrre stati osservabili.

## Trigger di revisione

Rivalutare se:
- il traffico di lettura impatta il workload operativo;
- i target di latency non vengono rispettati a costi ragionevoli;
- emerge un requisito di availability indipendente;
- più consumer richiedono la stessa proiezione;
- una nuova esigenza di storico o aggregazione rende inefficiente il lookup live.
```

## Perché questa è architettura

La decisione non è “fare una query”. La query concreta appartiene all'implementazione. La parte architetturale riguarda shared failure domain, separazione dei workload, consistency, costo operativo, ownership e strategia di evoluzione.

Stiamo accettando **semplicità oggi** in cambio di **meno isolamento oggi**, ma soltanto finché l'evidenza continua a giustificarlo.

## Preparare una via d'uscita senza costruirla in anticipo

Possiamo aumentare la reversibilità senza introdurre subito il read model. Manteniamo i lookup dietro boundary applicativi, evitiamo di esporre nell'API lo schema del database, isoliamo l'authorization e misuriamo volume e latency. Evitiamo anche query cross-domain diffuse e manteniamo il contratto esterno indipendente dalla fonte dati concreta.

Queste scelte non implementano la soluzione futura. Impediscono che la soluzione attuale diventi accidentalmente l'unica possibile.

> **Preparare una via d'uscita costa molto meno che costruire oggi la strada che forse useremo domani.**

## Quando il contesto cambierà

Immaginiamo che ESI acquisisca nuovi clienti enterprise, il volume operativo cresca e la console inizi a contribuire significativamente al carico di lettura. Il database mostra contention e Operations chiede che la vista rimanga disponibile anche durante maintenance dei sistemi ordini.

A quel punto il trigger è scattato. Non significa che ADR-001 fosse sbagliato: significa che la decisione aveva un intervallo di validità e il contesto è uscito da quell'intervallo.

Creeremo un nuovo ADR che la supersede, confrontando di nuovo le alternative disponibili allora.

Questo è il percorso che vogliamo allenare:

```text
contesto attuale
→ decisione proporzionata
→ quality floor
→ guardrail
→ osservazione
→ trigger
→ nuova decisione
```

Non immaginiamo una soluzione finale e non la costruiamo per forza oggi. L'architettura è la capacità di prendere **buone decisioni nella sequenza giusta**.
