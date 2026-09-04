## SLI, SLO ed error budget: affidabilità misurabile

“Il sistema deve essere affidabile” non è un requisito utilizzabile. È un’intenzione. Per trasformarla in architettura dobbiamo sapere quale comportamento osservare, quale livello considerare accettabile e che cosa fare quando ci stiamo allontanando da quel livello.

Il vocabolario della Site Reliability Engineering di Google è particolarmente utile perché separa tre concetti che spesso vengono confusi:

```text
SLI — Service Level Indicator
SLO — Service Level Objective
SLA — Service Level Agreement
```

Un **SLI** misura quantitativamente un aspetto del servizio. Un **SLO** stabilisce il target desiderato per quell’indicatore. Un eventuale **SLA** aggiunge invece una dimensione contrattuale esterna, con conseguenze che possono andare oltre l’engineering.

Fonte:

- [Google SRE — Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)

La distinzione è importante perché un prodotto non diventa affidabile copiando lo SLA del cloud provider. Order Operations usa più servizi, aggiunge codice, configurazione, identity, rete, deploy e processi operativi. La promessa del workload deve quindi essere definita sul comportamento che ESI controlla e che gli operatori percepiscono.

Microsoft Well-Architected mantiene la stessa separazione tra target del workload, misure di health e SLA delle dipendenze esterne.

Fonte:

- [Microsoft Learn — Monitoring workload reliability](https://learn.microsoft.com/azure/well-architected/reliability/monitoring)

## Misurare il journey, non la metrica più comoda

CPU, memoria, numero di istanze e connection count sono segnali utili per diagnosticare un sistema. Non sono però ciò che l’operatore compra.

L’operatore compra la possibilità di autenticarsi, trovare un caso, aprirlo, capire quali dati sono autorevoli e richiedere una Payment Escalation con un outcome comprensibile.

Per questo Google SRE raccomanda di scegliere gli SLI a partire da ciò che conta per l’utente, mentre Microsoft lega il health model ai business scenario del workload.

Fonti:

- [Google SRE — Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)
- [Microsoft Learn — Health modeling for workloads](https://learn.microsoft.com/azure/well-architected/design-guides/health-modeling)

Una formulazione pratica è pensare a **good event** e **valid event**:

```text
SLI = good events / valid events
```

La parte difficile non è la divisione. È definire `good`.

Un `2xx` non è necessariamente buono se arriva troppo tardi, contiene dati che sappiamo essere stale senza dichiararlo o rappresenta un outcome semanticamente incompleto. La metrica deve quindi ereditare il significato del journey.

Questo è anche il motivo per cui un SLO del singolo App Service non basta. Il critical flow attraversa più boundary e può fallire prima ancora che la request raggiunga l’applicazione. Google ha documentato, per esempio, come misure più vicine all’esperienza client potessero raccontare una availability diversa da quella osservata soltanto lato server.

Fonte:

- [Google SRE — Production Services Best Practices](https://sre.google/sre-book/service-best-practices/)

## I primi tre target di Order Operations

Nel capstone introduciamo ora target **simulati ESI**. Non sono benchmark industriali e non sono ancora misure osservate: servono a rendere concreta la relazione tra business decision e architettura. Verranno validati quando esisteranno ambienti e workload production-like.

### SLO-01 — Core operator journey

Finestra iniziale:

```text
rolling 28 days
```

Target:

```text
99.9% good core journey events
```

Nel primo modello, un evento è buono quando l’operatore autenticato e autorizzato può usare la capability richiesta, non incontra un errore server inatteso, riceve la risposta entro il threshold del flow e il prodotto non presenta come affidabile un dato che sa di non poter verificare.

Il threshold di latency sarà raffinato nel Capitolo 15, quando costruiremo la measurement pipeline. Il punto importante è che la semantic correctness entra già nella definizione: reliability non è soltanto “risponde”.

### SLO-02 — Durable Payment Escalation acceptance

Per una escalation valida vogliamo un outcome locale deterministico:

```text
PaymentEscalation + OutboxMessage committed
```

oppure un rifiuto esplicito prima del commit.

Non vogliamo lasciare il client in uno stato applicativo normale del tipo:

```text
forse accettata, forse no
```

La proprietà dominante qui non è la percentuale decorativa, ma l’atomicità tra business state e publication intent. È un quality floor costruito nei Capitoli 10–11 e ora promosso a reliability contract.

### SLO-03 — Payment Escalation publication

Prima proposta business:

```text
99% delle escalation accettate
pubblicate sul broker entro 5 minuti
```

Anche questo valore è simulato. Serve a dare un confine al concetto di “asincrono”. Eventual consistency non significa che il ritardo possa diventare invisibilmente infinito.

Il downstream processing di Payments & Risk avrà i propri target. Order Operations non si attribuisce uno SLO su un processo che non possiede.

## Perché non 100%

Un target del 100% sembra rassicurante, ma può trasformarsi in un requisito tecnicamente ed economicamente sproporzionato. Google SRE sottolinea che perseguire la perfezione assoluta spesso riduce la capacità di cambiare il sistema e può spingere verso costi che gli utenti non percepiscono né valorizzano.

Fonte:

- [Google SRE — Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)

Questo non significa progettare failure intenzionali. Significa rendere esplicito che la reliability è una negoziazione tra rischio, costo e velocità di evoluzione.

## Error budget: trasformare il target in una decisione operativa

Con uno SLO del `99.9%`, il budget teorico di eventi non buoni è `0.1%` nella stessa finestra. Il valore dell’**error budget** non è autorizzare il team a “rompere fino alla soglia”. È fornire un linguaggio condiviso per decidere quanto change risk possiamo sostenere mentre il sistema mantiene ancora il proprio contratto.

Google propone l’error budget proprio come meccanismo di equilibrio fra affidabilità e velocità di sviluppo.

Fonti:

- [Google SRE — Embracing Risk](https://sre.google/sre-book/embracing-risk/)
- [Google SRE Workbook — Error Budget Policy](https://sre.google/workbook/error-budget-policy/)

Per ESI la prima policy resta volutamente semplice:

```text
budget sano
→ release velocity normale

burn accelerato
→ reliability review e riduzione del change risk

budget esaurito
→ priorità al failure mode dominante,
   salvo security/emergency change
```

Non stiamo automatizzando una decisione organizzativa. Stiamo impedendo che la discussione diventi soltanto “Product vuole consegnare” contro “Operations vuole fermare tutto”. Il budget porta nella conversazione evidence su quale parte del contratto stiamo consumando.

## Burn rate: sapere che stiamo perdendo prima di aver perso

Aspettare la fine della finestra per scoprire che lo SLO è fallito serve a poco. Un incidente breve ma intenso può consumare rapidamente gran parte del budget; una degradazione lieve ma continua può farlo più lentamente.

Il **burn rate** descrive proprio la velocità con cui l’error budget viene consumato. Nel Capitolo 15 trasformeremo questo concetto in metriche e alert. Per ora ci interessa la conseguenza architetturale:

> **La reliability deve dirci non soltanto che abbiamo mancato il target, ma che lo stiamo consumando a una velocità non sostenibile.**

## Lo SLO è una decisione con conseguenze economiche

Un numero come `99.99%` non è una decorazione su una slide. Può richiedere più ridondanza, più headroom, deployment più conservativi, failover più rapidi e forse una strategia regionale diversa. In altre parole, il numero può diventare infrastruttura e costo.

Per questo gli SLO devono coinvolgere Product, Engineering, Operations/SRE, Platform e, quando l’effetto economico è materiale, Finance. Google sottolinea esplicitamente che questi target hanno conseguenze su staffing, funding e time-to-market.

Fonte:

- [Google SRE — Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)

Copiare il target di un’altra azienda non risolve il problema. Un checkout pubblico e uno strumento interno di investigation possono vivere nella stessa organizzazione e meritare reliability contract molto diversi.

La domanda corretta rimane:

> **Quanto failure può tollerare questo journey prima che il danno per ESI superi il costo di comprare più resilienza?**

## Cosa cambia con l’AI

Un agente può estrarre metriche candidate, proporre SLI, generare query, calcolare error budget e costruire dashboard. Può anche inventare un `99.99%` perché “suona enterprise”.

Questa seconda possibilità è particolarmente pericolosa perché il numero generato può trasformarsi immediatamente in architecture work reale.

> **Un SLO senza una ragione business è un numero che sta per diventare infrastruttura.**

Per Order Operations il risultato di questa sezione non è ancora una dashboard. È il nucleo del nuovo `docs/reliability-contract.md`, che conserva critical flow, SLI, SLO, measurement window, failure semantics, degraded mode, RTO/RPO, owner ed error-budget direction.

Il Capitolo 15 dirà come osservarlo. Prima, però, dobbiamo capire che cosa significa essere `Healthy`, `Degraded` o `Unhealthy` quando le dipendenze non falliscono tutte nello stesso modo.