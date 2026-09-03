# Acme Orders — Architecture Context

> Snapshot corrente del capstone simulato/composito.

## System of interest

Acme Orders è, in questa fase, una console operativa interna che aggrega informazioni necessarie a individuare e investigare ordini problematici.

Non è il sistema autorevole per ogni dato che mostra.

## Attori

- Operations Operator
- Operations Supervisor
- sistemi interni che espongono dati di Orders, Payments e Shipping
- provider esterni coinvolti indirettamente nei lifecycle di pagamento e spedizione

## Componenti logici

```text
Acme Orders
  ├── Orders module
  ├── Payments module
  └── Shipping module
```

La topologia fisica corrente resta un **modular monolith**.

I moduli sono confini logici, non microservizi.

## Ownership

### Orders

Possiede il significato e le regole relative al lifecycle dell'ordine.

### Payments

Possiede il significato e le regole relative al lifecycle del pagamento.

### Shipping

Possiede il significato e le regole relative al lifecycle della spedizione.

Una UI o una query aggregata non trasferisce automaticamente ownership al componente che legge i dati.

## Critical user journey

```text
Operator
→ Acme Orders UI
→ application layer
→ Orders / Payments / Shipping boundaries
→ authoritative data
→ aggregated operational view
→ investigation
→ Action / Wait / Escalation
```

## Dipendenze significative

- database relazionale operativo;
- dati di pagamento;
- dati di spedizione;
- identity/access control;
- eventuali provider esterni dietro Payments e Shipping.

## Failure considerations attuali

- una dipendenza può essere lenta o indisponibile;
- dati provenienti da domini diversi possono avere timing differenti;
- retry indiscriminati possono aumentare il carico;
- un singolo campo di stato aggregato può nascondere inconsistenze funzionali;
- un problema in Payments non deve essere interpretato automaticamente come un problema di Orders;
- una UI disponibile con dati errati non soddisfa il journey.

## Decisione topologica corrente

Per ora non esiste evidenza sufficiente per pagare il costo di microservizi separati.

La modularità viene costruita prima nel codice, nell'ownership e nei contratti.

Trigger che potrebbero cambiare la decisione:

- scaling indipendente materialmente necessario;
- ownership di team realmente indipendente;
- deployability indipendente con valore misurabile;
- requisiti di failure isolation non ottenibili in modo ragionevole nel monolite;
- vincoli di sicurezza o compliance che richiedono separazione più forte;
- cadence di cambiamento molto diversa tra moduli;
- crescita del coupling operativo che renda il deploy unico un collo di bottiglia.

## Regola

> Prima costruire confini che meritano di esistere. Poi decidere se meritano anche una rete in mezzo.

## Prossimi cambiamenti probabili

Il Capitolo 9 introdurrà contratti API espliciti.

Il Capitolo 10 renderà più precisa la data ownership.

Il Capitolo 11 introdurrà failure mode distribuiti quando e dove compariranno realmente.