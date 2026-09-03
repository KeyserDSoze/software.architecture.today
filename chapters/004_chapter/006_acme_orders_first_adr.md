## Acme Orders — la prima decisione architetturale esplicita

Finora abbiamo resistito alla tentazione di scegliere troppo presto.

Nel Capitolo 2 abbiamo definito il problema.

Nel Capitolo 3 abbiamo mappato il sistema.

Ora abbiamo abbastanza contesto per prendere una decisione vera.

Ricordiamo il requisito principale del lookup ordini:

- il cliente deve vedere lo stato dei propri ordini;
- tenant isolation è non negoziabile;
- pochi secondi di staleness sono accettabili;
- la feature non deve aumentare in modo sproporzionato il carico del sistema operativo;
- il team è piccolo;
- il prodotto è ancora in fase iniziale.

Abbiamo almeno due alternative credibili.

### Opzione A — lookup live

Il servizio di lettura interroga direttamente il database operativo degli ordini.

Vantaggi:

- semplicità;
- meno componenti;
- stato molto fresco;
- niente pipeline di sincronizzazione;
- operazioni più semplici.

Svantaggi:

- il carico di lettura insiste sul database operativo;
- forte dipendenza dalla sua availability;
- schema di lettura legato al modello transazionale;
- meno isolamento tra workload operativi e customer lookup.

### Opzione B — read model asincrono

Gli aggiornamenti ordine alimentano un modello ottimizzato per lettura.

Vantaggi:

- separazione del workload;
- query più semplici e ottimizzate;
- maggiore controllo della latency;
- possibilità di degradare in modo indipendente.

Svantaggi:

- eventual consistency;
- nuova pipeline da operare;
- replay e recovery;
- failure mode aggiuntivi;
- maggior costo cognitivo e operativo.

### La tentazione

Se guardiamo soltanto al futuro, l'opzione B sembra più “architetturale”.

È anche più interessante da disegnare.

Eventi, proiezioni, consumer, replay, lag.

Ma questa non è una gara di sofisticazione.

Il contesto attuale dice che:

- il traffico è ancora moderato;
- pochi secondi di freshness non sono un problema, ma non abbiamo ancora un problema reale di lettura;
- il team deve validare il prodotto;
- introdurre una pipeline asincrona aumenta molto la superficie operativa.

Quindi scegliamo **Opzione A: lookup live**, ma in modo intenzionale e con trigger di revisione.

### ADR-001 — Order status lookup sul database operativo

```markdown
# ADR-001 — Order status lookup sul database operativo

Status: accepted

## Contesto

Acme Orders deve permettere ai clienti autenticati di consultare lo stato dei propri ordini.
Il prodotto è in fase iniziale, il traffico è moderato e il team è piccolo.
Tenant isolation è non negoziabile.

## Problema

Dobbiamo fornire un lookup affidabile senza introdurre complessità operativa non giustificata dal carico attuale.

## Vincoli

- piccolo team;
- budget operativo limitato;
- staleness minima desiderabile ma non esiste requisito real-time stretto;
- nessun bisogno attuale di isolamento completo del workload di lettura.

## Alternative considerate

1. query live sul database operativo;
2. read model asincrono dedicato.

## Decisione

Usare query live sul database operativo attraverso un boundary applicativo dedicato al lookup.

## Motivazione

La soluzione soddisfa i requisiti attuali con minore complessità operativa.
Il carico non giustifica ancora una pipeline asincrona dedicata.

## Conseguenze positive

- meno componenti;
- nessun problema di sincronizzazione;
- recovery semplice;
- minore costo operativo.

## Conseguenze negative

- il lookup condivide il failure domain del database operativo;
- crescita del traffico di lettura può influenzare workload transazionale;
- lo schema di lettura richiede attenzione per evitare coupling eccessivo.

## Rischi

- query inefficienti;
- aumento non previsto del traffico;
- leakage cross-tenant se i filtri di authorization non sono corretti.

## Trigger di revisione

Rivalutare se:
- p95 del lookup supera 300 ms in modo persistente;
- il traffico di lettura impatta il workload operativo;
- emerge un requisito di availability indipendente;
- il numero di consumer dello stato ordine cresce significativamente.
```

### Perché questa è una decisione architetturale

Non perché abbiamo scelto di fare una query SQL.

La decisione significativa riguarda:

- shared failure domain;
- separazione dei workload;
- consistency;
- complessità operativa;
- strategia di evoluzione.

La query è implementazione.

Il compromesso tra **semplicità oggi** e **isolamento domani** è architettura.

### Preparare senza implementare

Possiamo comunque evitare di renderci la vita difficile in futuro.

Per esempio:

- non esporre lo schema del database direttamente nell'API;
- mantenere il lookup dietro un'interfaccia applicativa;
- isolare authorization e tenant filtering;
- misurare latency e volume;
- evitare query cross-domain diffuse;
- mantenere il contratto esterno indipendente dalla fonte dati.

Queste scelte preservano reversibilità.

Non costruiscono ancora il read model.

> **Preparare una via d'uscita costa molto meno che costruire oggi la strada che forse useremo domani.**

### Quando il trigger scatterà

Supponiamo che sei mesi dopo il prodotto cresca.

Il lookup genera gran parte del traffico.

Il database operativo inizia a mostrare contention.

Il customer support chiede maggiore availability anche durante maintenance del sistema ordini.

A quel punto il contesto è cambiato.

Non significa che ADR-001 fosse sbagliato.

Significa che ha esaurito il proprio periodo di validità.

Potremo creare:

```text
ADR-007 — Introduce asynchronous order status read model
```

che supersede ADR-001.

Questa storia è molto più sana di costruire subito la soluzione finale immaginando una scala che ancora non esiste.

### L'architettura come percorso

Acme Orders mostra un principio che accompagnerà tutto il libro:

```text
contesto attuale
→ decisione proporzionata
→ osservazione
→ trigger
→ nuova decisione
```

Non:

```text
immaginiamo il sistema finale
→ costruiamolo subito
```

L'architettura non è la ricerca di una configurazione perfetta.

È la capacità di prendere **buone decisioni nella sequenza giusta**.