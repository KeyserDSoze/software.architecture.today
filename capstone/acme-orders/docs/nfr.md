# Acme Orders — Non-Functional Requirements

> Snapshot corrente del capstone simulato/composito.

## Priorità attuali

1. correctness del dato operativo;
2. access control;
3. operability;
4. latency adeguata al lavoro umano interattivo;
5. availability ragionevole per uno strumento interno;
6. semplicità operativa e costo contenuto.

## Performance

La UI deve essere abbastanza reattiva da supportare investigazione operativa interattiva.

Non introduciamo numeri fittizi come se fossero misurazioni reali. Le soglie quantitative verranno definite quando il capstone avrà un workload e un ambiente misurabile.

## Availability

Il sistema deve supportare il lavoro operativo durante le finestre previste, ma non esiste ancora un requisito che giustifichi active-active multi-region.

## Recovery

RTO e RPO devono essere esplicitati prima della produzione reale. Per ora il requisito è riconosciuto come architetturalmente significativo ma non ancora quantificato.

## Consistency

Per l'investigazione operativa preferiamo informazioni sufficientemente aggiornate da non indurre azioni errate.

La freshness richiesta deve essere definita per capability; “real time” non è accettato come requisito senza una soglia e un motivo.

## Security

- accesso autenticato;
- autorizzazione per ruolo/capability;
- niente dati cross-tenant quando il modello multi-tenant verrà introdotto;
- audit delle azioni quando queste inizieranno a modificare lo stato del business.

## Operability

Il team deve poter diagnosticare:

- errori applicativi;
- dipendenze lente o indisponibili;
- query lente;
- fallimenti di integrazione;
- divergenze tra stato mostrato e dati autorevoli.

## Maintainability

I confini tra Orders, Payments e Shipping devono restare leggibili e verificabili nel codice.

## Cost

La complessità infrastrutturale deve essere giustificata da requisiti misurabili.

Decisioni attuali:

- niente Redis soltanto per “essere pronti a scalare”;
- niente active-active multi-region senza requisito;
- niente microservizi per sola moda architetturale.

## Technology fit rule

> Non scegliere la tecnologia più impressionante. Scegli la risposta che ha il fit migliore con il problema reale.

Le scelte verranno rivalutate quando cambieranno requisiti, volume, team, rischio o vincoli.

## Fonti metodologiche

- [Azure Application Architecture Fundamentals](https://learn.microsoft.com/azure/architecture/guide/)
- [Azure Architecture Design Principles](https://learn.microsoft.com/azure/architecture/guide/design-principles/)
- [AWS Well-Architected — Evaluate trade-offs](https://docs.aws.amazon.com/wellarchitected/latest/performance-efficiency-pillar/perf_architecture_evaluate_trade_offs.html)

Queste fonti sostengono il metodo di partire da business/workload requirements e valutare trade-off; i requisiti specifici di Acme Orders restano simulati.