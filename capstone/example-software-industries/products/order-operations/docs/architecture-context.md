# Order Operations — Architecture Context

> Snapshot corrente del capstone simulato/composito di Example Software Industries S.p.A.

## System of interest

Order Operations è, in questa fase, una console operativa interna della business unit Commerce & Operations che aggrega informazioni necessarie a individuare e investigare ordini problematici.

Non è il sistema autorevole per ogni dato che mostra.

## Contesto organizzativo

Order Operations vive dentro ESI e deve convivere con capability e interessi di altre aree:

- Payments & Risk;
- Platform Engineering & Cloud;
- Security;
- Finance / FinOps;
- Legal / Compliance;
- eventuali consumer Mobile o partner futuri.

Il confine del prodotto non coincide quindi con il confine di tutte le decisioni che lo riguardano.

## Attori

- Operations Operator;
- Operations Supervisor;
- sistemi interni che espongono dati di Orders, Payments e Shipping;
- Payments & Risk quando una decisione modifica semantica economica;
- Platform Engineering per capability condivise;
- provider esterni coinvolti nei lifecycle di pagamento e spedizione.

## Componenti logici

```text
Order Operations
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

Possiede il significato e le regole relative al lifecycle del pagamento nel perimetro applicativo. Le policy economiche condivise possono dipendere anche da Payments & Risk a livello ESI.

### Shipping

Possiede il significato e le regole relative al lifecycle della spedizione.

Una UI o una query aggregata non trasferisce automaticamente ownership al componente che legge i dati.

## Critical user journey

```text
Operator
→ Order Operations UI
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
- eventuali provider esterni dietro Payments e Shipping;
- capability ESI condivise che verranno introdotte nei capitoli successivi.

## Failure considerations attuali

- una dipendenza può essere lenta o indisponibile;
- dati provenienti da domini diversi possono avere timing differenti;
- retry indiscriminati possono aumentare il carico;
- un singolo campo di stato aggregato può nascondere inconsistenze funzionali;
- un problema in Payments non deve essere interpretato automaticamente come un problema di Orders;
- una UI disponibile con dati errati non soddisfa il journey;
- una policy aziendale condivisa può cambiare il comportamento richiesto senza che cambi la UI.

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

## Compromesso corrente

**Esigenza:** delivery rapida e confini comprensibili.

**Tensione:** indipendenza operativa vs semplicità.

**Decisione:** modular monolith.

**Costo accettato:** deploy e failure isolation non sono indipendenti per ogni modulo.

**Quality floor:** ownership, modularità e testabilità devono restare forti.

**Guardrail:** architecture constraints e trigger di estrazione.

## Regola

> Prima costruire confini che meritano di esistere. Poi decidere se meritano anche una rete in mezzo.

## Prossimi cambiamenti probabili

Il Capitolo 10 renderà più precisa la data ownership.

Il Capitolo 11 introdurrà failure mode distribuiti quando e dove compariranno realmente.