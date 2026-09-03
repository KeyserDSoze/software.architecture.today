# ADR 0001 — Preferire lookup live prima di introdurre un read model dedicato

## Stato

Accepted — da rivalutare quando scattano i trigger indicati sotto.

## Contesto

Acme Orders deve mostrare agli operatori ordini problematici e informazioni sufficientemente aggiornate per supportare investigazione e decisione.

Una possibile evoluzione sarebbe costruire un read model asincrono dedicato alla console operativa.

Al momento però:

- il volume simulato non dimostra la necessità di infrastruttura aggiuntiva;
- il team è piccolo;
- la semplicità operativa è una priorità;
- non abbiamo un requisito di fan-out o throughput che giustifichi una pipeline eventi dedicata;
- la semantica di freshness non è ancora abbastanza precisa da richiedere consistenza asincrona.

## Decisione

Usare, per la prima versione, un lookup live sui dati operativi attraverso i confini logici di Orders, Payments e Shipping.

La UI non deve accedere arbitrariamente alle tabelle bypassando ownership e contratti interni.

## Conseguenze positive

- meno moving part;
- minore costo operativo;
- modello di consistenza più semplice;
- debug più diretto;
- nessuna pipeline di sincronizzazione da operare prematuramente.

## Conseguenze negative

- la latency dipende maggiormente dal percorso live;
- il carico di lettura insiste sui datastore operativi;
- alcune query aggregate potrebbero diventare costose con la crescita;
- la disponibilità della console può dipendere più direttamente dalle fonti operative.

## Alternative considerate

### Read model asincrono dedicato

Potrebbe ridurre il coupling runtime e ottimizzare query operative, ma introduce:

- pipeline di aggiornamento;
- eventual consistency;
- failure mode di sincronizzazione;
- recovery e replay;
- observability aggiuntiva;
- storage duplicato;
- nuove decisioni su source of truth e freshness.

### Cache dedicata

Non viene introdotta finché non esiste evidenza di un problema di latency/load che la cache risolva meglio di alternative più semplici.

## Trigger di revisione

Rivalutare questa ADR se almeno uno dei seguenti eventi si verifica:

- il carico di lettura operativo impatta materialmente i workload transazionali;
- le query necessarie non possono rispettare i target di latency con costi ragionevoli;
- la console richiede disponibilità significativamente diversa dai sistemi operativi;
- emerge un requisito di storico/aggregazione non adatto al modello live;
- la frequenza di aggiornamento richiesta rende utile una pipeline dedicata;
- più consumer richiedono la stessa proiezione operativa;
- misurazioni reali mostrano che il trade-off è cambiato.

## Principio

> Una decisione semplice non è una decisione provvisoria per definizione. È una decisione corretta finché il contesto che la giustifica rimane vero.