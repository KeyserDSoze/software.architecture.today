## Order Operations — la prima decisione architetturale esplicita

Finora abbiamo resistito alla tentazione di scegliere troppo presto.

Nel Capitolo 2 abbiamo definito il problema.

Nel Capitolo 3 abbiamo mappato il sistema.

Ora abbiamo abbastanza contesto per prendere una decisione vera.

Ricordiamo il requisito principale di Order Operations:

- l'operatore deve individuare e investigare ordini problematici;
- access control e data ownership sono non negoziabili;
- un breve ritardo può essere accettabile per alcune informazioni, se dichiarato;
- la feature non deve aumentare in modo sproporzionato il carico dei sistemi operativi;
- il team è ancora piccolo;
- la capability è in fase iniziale.

Abbiamo almeno due alternative credibili.

### Opzione A — lookup live

Order Operations interroga i dati operativi attraverso i boundary di Orders, Payments e Shipping.

Vantaggi:

- semplicità;
- meno componenti;
- stato molto fresco;
- niente pipeline di sincronizzazione;
- operazioni più semplici.

Svantaggi:

- il carico di lettura insiste sui datastore operativi;
- availability e latency dipendono maggiormente dalle fonti live;
- meno isolamento tra workload operativi e console;
- il degrado di una dipendenza può degradare il journey.

### Opzione B — read model asincrono

Gli aggiornamenti dei domini alimentano un modello ottimizzato per la vista operativa.

Vantaggi:

- separazione del workload;
- query più semplici e ottimizzate;
- maggiore isolamento dalle dipendenze live;
- possibilità di controllare diversamente availability della vista.

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
- non abbiamo evidenza che il carico della console danneggi i workload transazionali;
- il team deve ancora validare il prodotto;
- introdurre una pipeline asincrona aumenta materialmente la superficie operativa.

Quindi scegliamo **Opzione A: lookup live**, ma in modo intenzionale e con trigger di revisione.

### Il compromesso ESI

**Esigenza**

Commerce & Operations vuole una capability utilizzabile presto.

**Tensione**

Semplicità e time-to-market contro isolamento dei workload e indipendenza operativa.

**Decisione**

Lookup live, per ora.

**Costo accettato**

Order Operations condivide parte del failure domain e del carico con sistemi operativi esistenti.

**Quality floor**

Non bypassiamo ownership, authorization, timeout e correttezza per ottenere semplicità.

**Guardrail**

Boundary applicativi, metriche, test e trigger espliciti di revisione.

Questa è la differenza fra compromesso e scorciatoia.

La scorciatoia sarebbe:

> “Leggiamo direttamente tutte le tabelle perché è più veloce da implementare.”

Il compromesso è:

> “Manteniamo la soluzione live perché oggi ha il fit migliore, ma proteggiamo i confini e misuriamo le condizioni che potrebbero renderla insufficiente.”

### ADR-001 — Lookup operativo sui dati live

```markdown
# ADR-001 — Preferire lookup live prima di introdurre un read model dedicato

Status: accepted

## Contesto

Order Operations deve mostrare agli operatori informazioni sufficientemente aggiornate per investigare ordini problematici.
Il prodotto è in fase iniziale, il traffico è moderato e il team è piccolo.
Ownership e access control sono non negoziabili.

## Problema

Dobbiamo fornire una vista affidabile senza introdurre complessità operativa non giustificata dal carico attuale.

## Vincoli

- piccolo team;
- semplicità operativa prioritaria;
- nessun bisogno attuale di isolamento completo del workload di lettura;
- freshness ancora da quantificare per capability.

## Alternative considerate

1. lookup live attraverso i boundary applicativi;
2. read model asincrono dedicato.

## Decisione

Usare lookup live sui dati operativi attraverso i confini logici di Orders, Payments e Shipping.

## Motivazione

La soluzione soddisfa i requisiti attuali con minore complessità operativa.
Il carico non giustifica ancora una pipeline asincrona dedicata.

## Conseguenze positive

- meno componenti;
- nessun problema di sincronizzazione;
- recovery più semplice;
- minore costo operativo.

## Conseguenze negative

- la console condivide parte del failure domain delle fonti operative;
- crescita del traffico di lettura può influenzare workload transazionali;
- la latency dipende maggiormente dalle dipendenze live.

## Quality floor

- authorization verificata;
- ownership rispettata;
- niente accesso arbitrario cross-domain alle tabelle;
- dati stale o incompleti non devono essere rappresentati come certamente correnti.

## Trigger di revisione

Rivalutare se:
- il traffico di lettura impatta il workload operativo;
- i target di latency non vengono rispettati a costi ragionevoli;
- emerge un requisito di availability indipendente;
- più consumer richiedono la stessa proiezione;
- una nuova esigenza di storico o aggregazione rende inefficiente il lookup live.
```

### Perché questa è una decisione architetturale

Non perché abbiamo scelto di fare una query.

La decisione significativa riguarda:

- shared failure domain;
- separazione dei workload;
- consistency;
- complessità operativa;
- strategia di evoluzione.

La query concreta è implementazione.

Il compromesso tra **semplicità oggi** e **isolamento domani** è architettura.

### Preparare senza implementare

Possiamo comunque evitare di renderci la vita difficile in futuro.

Per esempio:

- non esporre lo schema del database direttamente nell'API;
- mantenere il lookup dietro boundary applicativi;
- isolare authorization;
- misurare latency e volume;
- evitare query cross-domain diffuse;
- mantenere il contratto esterno indipendente dalla fonte dati.

Queste scelte preservano reversibilità.

Non costruiscono ancora il read model.

> **Preparare una via d'uscita costa molto meno che costruire oggi la strada che forse useremo domani.**

### Quando il trigger scatterà

Supponiamo che più avanti ESI acquisisca nuovi clienti enterprise.

Il volume operativo cresce.

La console genera una parte importante del traffico di lettura.

Il database operativo inizia a mostrare contention.

Operations chiede maggiore availability anche durante maintenance dei sistemi ordini.

A quel punto il contesto è cambiato.

Non significa che ADR-001 fosse sbagliato.

Significa che ha esaurito il proprio periodo di validità.

Potremo creare una nuova ADR che la supersede.

Questa storia è più sana di costruire subito la soluzione finale immaginando una scala che ancora non esiste.

### L'architettura come percorso

Order Operations mostra un principio che accompagnerà tutto il libro:

```text
contesto attuale
→ decisione proporzionata
→ quality floor
→ guardrail
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