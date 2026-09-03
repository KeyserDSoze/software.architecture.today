# Capitolo 14 — Reliability e resilienza

> **Scenario ESI.** Example Software Industries S.p.A. è fittizia. I requisiti e i compromessi di Order Operations sono simulati; le proprietà tecniche e i casi reali citati sono supportati da fonti esplicite.

Una parte del sistema prima o poi fallirà.

Può fallire un processo.

Può fallire una query.

Può fallire una dipendenza.

Può fallire una availability zone.

Può fallire un deployment.

Può fallire una configurazione perfettamente valida dal punto di vista sintattico ma devastante nel comportamento.

Può fallire la nostra ipotesi su quanto traffico avremmo ricevuto.

Può fallire la procedura di recovery che nessuno aveva mai provato.

La domanda architetturale non è quindi:

> **Come facciamo a non avere mai failure?**

È:

> **Quali failure dobbiamo assorbire, quali possiamo degradare, quali possono interrompere il servizio e come torniamo in uno stato accettabile?**

Microsoft Azure Well-Architected sintetizza la Reliability come capacità di resistere ai malfunzionamenti e tornare a uno stato pienamente funzionante. La stessa guidance insiste sul fatto che la reliability debba partire dai business requirement, non dall'obiettivo astratto di massimizzare ridondanza.

Fonti:

- [Microsoft Learn — Azure Well-Architected Reliability](https://learn.microsoft.com/azure/well-architected/reliability/)
- [Microsoft Learn — Reliability Maturity Model](https://learn.microsoft.com/azure/well-architected/reliability/maturity-model)

## Availability non è reliability

Un servizio può essere tecnicamente raggiungibile ma non essere affidabile.

Esempio:

```text
HTTP 200
+ response in 20 ms
+ payment status stale di 40 minuti
```

Il processo risponde.

Il journey può comunque essere sbagliato.

Oppure:

```text
API online
+ database disponibile
+ queue attiva
+ operatori non possono autenticarsi
```

La dashboard infrastrutturale può essere verde mentre il prodotto è inutilizzabile.

Per questo distingueremo almeno:

```text
availability
correctness
latency
freshness
durability
recoverability
operability
```

La reliability è una proprietà del comportamento end-to-end osservato rispetto a ciò che il business considera accettabile.

## Resilienza

Nel libro useremo **resilienza** per indicare la capacità del sistema di continuare a fornire valore o di recuperare in modo controllato quando incontra failure.

Non significa necessariamente mantenere tutto disponibile.

Un sistema resiliente può deliberatamente:

- disabilitare una feature non critica;
- passare a una modalità read-only;
- accettare una richiesta e processarla più tardi;
- rifiutare nuovo lavoro per proteggere quello già accettato;
- mostrare uno stato `Degraded` invece di fingere normalità;
- isolare un failure domain;
- effettuare failover;
- ripristinare da backup;
- richiedere intervento umano quando l'automazione non può determinare uno stato sicuro.

> **Continuare a funzionare non significa necessariamente continuare a fare tutto.**

## Failure è inevitabile. Cascading failure no.

Un singolo errore diventa incidente sistemico quando attraversa confini che non riescono a contenerlo.

Un database rallenta.

I client aspettano più a lungo.

Le connection pool si riempiono.

I timeout aumentano.

Partono retry.

Il traffico effettivo cresce proprio mentre la capacità utile scende.

Altri componenti iniziano a saturare.

Abbiamo trasformato:

```text
una dipendenza lenta
```

in:

```text
un sistema indisponibile
```

La reliability architecture serve anche a interrompere questa propagazione.

Microsoft raccomanda pattern di fault isolation, graceful degradation, bounded retry e self-preservation proprio per evitare che problemi locali diventino failure estesi.

Fonte:

- [Microsoft Learn — Architecture design patterns that support reliability](https://learn.microsoft.com/azure/well-architected/reliability/design-patterns)

## Reliability ha un costo

Possiamo aggiungere:

- più istanze;
- più zone;
- più region;
- database standby;
- replica;
- cache;
- queue;
- circuit breaker;
- capacity headroom;
- backup più frequenti;
- retention maggiore;
- observability più ricca;
- deployment più conservativi;
- test di failure;
- on-call più strutturato.

Ognuno può migliorare alcune proprietà.

Ognuno ha un costo.

Il costo può essere:

- cloud;
- complessità;
- operabilità;
- latency;
- consistency;
- velocità di delivery;
- cognitive load;
- tempo di engineering.

Per questo:

> **"Più affidabile" non è ancora una decisione.**

Serve sapere:

```text
per quale journey
contro quale failure
entro quale target
con quale costo
```

## Il caso ESI

Order Operations è ormai diventato un workload reale abbastanza ricco da avere failure interessanti.

Abbiamo:

```text
Operations UI
→ App Service
→ PostgreSQL
→ Outbox
→ WebJob Publisher
→ Service Bus Queue
→ Payments & Risk
```

E abbiamo dipendenze cloud come:

```text
Entra ID
Private DNS
Key Vault
Azure Monitor
landing-zone network
```

Il Capitolo 13 ha progettato trust boundary e security control.

Adesso dobbiamo chiederci cosa succede quando le stesse parti smettono di funzionare correttamente.

### Tensione ESI

**Commerce & Operations** vuole che gli operatori possano lavorare durante le finestre operative senza frequenti interruzioni.

**Payments & Risk** vuole che una Payment Escalation accettata non sparisca e non venga duplicata semanticamente.

**Platform Engineering** vuole usare le capability di resilienza native di Azure senza costruire un sistema custom per ogni workload.

**Finance / FinOps** non vuole pagare multi-region, replica e capacity headroom senza un business target che ne dimostri il valore.

Il compromesso del capitolo sarà quindi:

> **quale livello di reliability vale la pena comprare adesso?**

## Non massimizzeremo tutto

Per Order Operations la prima decisione non sarà active-active multi-region.

Non perché sia una cattiva architettura in assoluto.

Perché oggi non abbiamo ancora un requisito che ne paghi:

- costo;
- replication complexity;
- failover complexity;
- operational testing;
- data-consistency consequences;
- maggiore cognitive load.

Potremmo invece scoprire che vale la pena comprare:

- zone redundancy sul compute;
- HA zonale sul database;
- capacity minima > 1;
- health model;
- graceful degradation;
- restore exercise;
- queue/backlog monitoring;
- rollback più sicuro.

Queste decisioni hanno un costo inferiore e proteggono failure molto più probabili del region-wide disaster.

Microsoft sottolinea esplicitamente di non concentrarsi soltanto sui rari eventi regionali, ma anche sui failure locali e transitori come network loss o database connection failure.

Fonte:

- [Microsoft Learn — Design for Self-Healing](https://learn.microsoft.com/azure/architecture/guide/design-principles/self-healing)

## Reliability come disciplina di prodotto

Il capitolo seguirà questo percorso:

```text
critical journey
→ SLI
→ SLO
→ error budget
→ health model
→ failure mode
→ containment
→ degradation
→ recovery
→ drill
→ evidence
```

La reliability smette così di essere:

```text
"mettiamo due istanze"
```

per diventare:

```text
"questa proprietà del journey deve restare entro questo livello,
anche quando accadono questi failure,
e abbiamo evidenza che sappiamo recuperare"
```

## La reliability cambia il modo di parlare

Non diremo:

> "Il database è altamente disponibile."

Diremo:

> "Il critical flow dipende dal database. Per un node/zone failure scegliamo questa strategia. Per una corruption logica scegliamo quest'altra. Questi sono RTO/RPO, questi i test e questo il residual risk."

Non diremo:

> "Abbiamo il backup."

Diremo:

> "Abbiamo effettuato un restore e sappiamo quanto ci mette."

Non diremo:

> "La queue ci protegge."

Diremo:

> "La queue disaccoppia il downstream, ma backlog, DLQ e consumer capacity sono parte del nostro health model."

## Con AI

L'AI può rendere molto economico generare:

- retry;
- fallback;
- health endpoint;
- circuit breaker;
- IaC con replica e multi-region;
- chaos test;
- dashboard;
- runbook.

Questo non significa che sappia quale reliability target il business è disposto a finanziare.

Anzi, il rischio è produrre **reliability theater**:

```text
molti meccanismi
+ nessun SLO
+ nessun failure model
+ nessun restore test
+ nessun owner
```

> **La resilienza non si misura dal numero di meccanismi di recovery. Si misura da quanto bene il sistema soddisfa il proprio contratto quando qualcosa va storto.**

Nel resto del capitolo costruiremo quel contratto.