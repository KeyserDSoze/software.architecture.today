# Capitolo 14 — Reliability e resilienza

> **Scenario ESI.** Example Software Industries S.p.A. è fittizia. I requisiti e i compromessi di Order Operations sono simulati; le proprietà tecniche e i casi reali citati sono supportati da fonti esplicite.

Una parte del sistema prima o poi fallirà. Non è pessimismo: è la condizione normale di qualsiasi software abbastanza reale da dipendere da processi, reti, storage, identity, configurazioni, persone e servizi che cambiano nel tempo.

Può morire un processo. Può rallentare una query. Può sparire una dipendenza. Può esaurirsi una connection pool. Può cadere una availability zone. Può arrivare un deployment sintatticamente valido ma semanticamente devastante. Può fallire una procedura di recovery che tutti davano per scontata perché nessuno l’aveva mai eseguita davvero.

La domanda architetturale non è quindi come evitare ogni failure. È decidere **quali failure il prodotto deve assorbire, quali può trasformare in degradazione, quali possono interrompere il servizio e come deve tornare in uno stato accettabile**.

Microsoft Azure Well-Architected descrive la Reliability come capacità del workload di resistere ai malfunzionamenti e recuperare verso uno stato pienamente funzionante, collegando le decisioni tecniche ai requisiti del business invece che alla ridondanza fine a se stessa.

Fonti:

- [Microsoft Learn — Azure Well-Architected Reliability](https://learn.microsoft.com/azure/well-architected/reliability/)
- [Microsoft Learn — Reliability Maturity Model](https://learn.microsoft.com/azure/well-architected/reliability/maturity-model)

## Essere raggiungibili non basta

Immaginiamo un’API che restituisce `200` in venti millisecondi, ma mostra un payment status vecchio di quaranta minuti senza dichiararlo. L’infrastruttura è disponibile; il comportamento può essere sbagliato.

Oppure immaginiamo App Service, PostgreSQL e Service Bus tutti verdi mentre gli operatori non riescono ad autenticarsi. Il processo web vive, ma il prodotto non è utilizzabile.

Per questo, in questo libro, reliability non sarà sinonimo di uptime di una risorsa. Dovremo tenere insieme availability, correctness, latency, freshness, durability, recoverability e operability rispetto al **critical journey** che il business vuole proteggere.

La stessa distinzione vale per la resilienza. Un sistema resiliente non è necessariamente un sistema che continua a fare tutto. Può entrare deliberatamente in read-only, rinviare un’elaborazione, rifiutare nuovo lavoro per proteggere quello già accettato, mostrare uno stato `Degraded`, isolare una dipendenza o chiedere intervento umano quando l’automazione non può più stabilire uno stato sicuro.

> **Continuare a funzionare non significa continuare a fare tutto. Significa continuare a fare soltanto ciò che possiamo ancora fare correttamente.**

## Il problema non è il primo failure, ma la propagazione

Una dipendenza lenta può sembrare un problema locale. Poi le request restano aperte più a lungo, la concurrency cresce, le pool si saturano, aumentano i timeout, partono retry e il traffico effettivo aumenta proprio mentre la capacità utile diminuisce. In pochi passaggi abbiamo trasformato una dipendenza degradata in un incidente sistemico.

Il lavoro di reliability consiste in buona parte nel progettare **dove questa propagazione deve fermarsi**. Timeout, retry bounded, queue, circuit breaker, bulkhead, headroom, load shedding e degraded mode sono utili soltanto se interrompono un failure path reale. Non sono una lista di pattern da applicare perché “un sistema affidabile li usa”.

Microsoft raccoglie diversi di questi meccanismi tra i reliability design pattern e insiste su fault isolation, self-preservation e graceful degradation proprio per evitare che failure locali allarghino il blast radius.

Fonte:

- [Microsoft Learn — Architecture design patterns that support reliability](https://learn.microsoft.com/azure/well-architected/reliability/design-patterns)

## La reliability si compra, e quindi va scelta

Possiamo aggiungere istanze, zone, replica, standby, backup più frequenti, capacity headroom, deploy più conservativi, monitoring più ricco, circuit breaker, code, runbook, game day e on-call più strutturato. Ognuna di queste decisioni può migliorare alcune proprietà e peggiorarne altre.

Il costo non è soltanto cloud. È anche complessità, cognitive load, latency, consistency, velocità di delivery, tempo di engineering e numero di failure mode che il team deve imparare a riconoscere.

Perciò “rendiamolo più affidabile” non è ancora un requisito. Una decisione utilizzabile deve dire almeno:

```text
per quale journey
contro quale failure
entro quale target
con quale costo
con quale recovery source
con quale evidence
```

Senza questi elementi è facile costruire **reliability theater**: molta ridondanza, molte dashboard e nessuna idea precisa di che cosa il prodotto stia promettendo.

## Order Operations arriva al punto in cui il failure diventa prodotto

Il capstone ESI ora ha abbastanza parti perché le conseguenze dei guasti non siano più teoriche:

```text
Operations UI
→ App Service
→ PostgreSQL
→ transactional outbox
→ WebJob Publisher
→ Service Bus Queue
→ Payments & Risk
```

Intorno a questo percorso esistono Entra ID, private DNS, Key Vault, Azure Monitor e la landing-zone network. Il Capitolo 13 ci ha fatto progettare questi boundary contro comportamento ostile. Adesso dobbiamo capire che cosa accade quando gli stessi boundary smettono semplicemente di funzionare.

Commerce & Operations vuole che gli operatori continuino a lavorare durante le normali finestre operative. Payments & Risk vuole che una Payment Escalation già accettata non scompaia e non produca un secondo effetto business quando viene ritentata. Platform Engineering vuole sfruttare le capability managed di Azure senza costruire una piattaforma custom per un solo workload. Finance non vuole pagare multi-region e replica “nel dubbio”.

La domanda del capitolo diventa quindi molto concreta:

> **Quale livello di reliability vale la pena comprare adesso per Order Operations?**

Non inizieremo da active-active multi-region. Potremmo scoprire che, con i target correnti, ha più valore comprare zone redundancy sul compute, HA zonale sul database, capacity minima superiore a uno, un health model serio, restore drill e una recovery path documentata. Queste decisioni coprono failure frequenti senza anticipare una complessità regionale che il business non ha ancora richiesto.

Microsoft, nel principio di self-healing, ricorda proprio che il design deve considerare anche failure locali e transitori — network loss, connection failure, instance failure — invece di concentrarsi soltanto sugli eventi catastrofici più rari.

Fonte:

- [Microsoft Learn — Design for Self-Healing](https://learn.microsoft.com/azure/architecture/guide/design-principles/self-healing)

## Dal desiderio al contratto

Il percorso del capitolo seguirà una sequenza precisa:

```text
critical journey
→ SLI
→ SLO
→ error budget
→ health model
→ failure propagation
→ degradation
→ recovery
→ drill
→ evidence
```

Questo cambia anche il linguaggio.

Non diremo più semplicemente “il database è altamente disponibile”. Diremo quale critical flow dipende dal database, quali failure copre la HA, quali non copre, quali RTO/RPO stiamo proteggendo e quale prova dimostra che il recovery funziona.

Non diremo “abbiamo i backup”. Diremo che abbiamo eseguito un restore, misurato il tempo reale e verificato il punto recuperato.

Non diremo “la queue ci protegge”. Diremo che disaccoppia il downstream, mentre backlog, oldest-message age, DLQ e recovery load entrano nel nostro health model.

Questa trasformazione produrrà un nuovo artefatto del capstone: il **Reliability Contract**. Non sarà una dashboard e non sostituirà la Failure Mode Map. Servirà a dire che cosa deve significare `Healthy`, `Degraded` e `Unhealthy`, quali target proteggiamo e quale evidence dovrà esistere prima di poter dire che una strategia è realmente verificata.

## Cosa cambia con l’AI

L’AI può generare in pochi minuti retry policy, circuit breaker, health endpoint, dashboard, chaos test, Bicep multi-region e runbook. È un vantaggio enorme, ma elimina anche una friction che prima ci costringeva almeno a pensare prima di costruire.

Un agente può creare dieci meccanismi di recovery senza sapere quale reliability target ESI sia disposta a finanziare. Può proporre `99.99%` perché sembra un numero professionale, e quel numero può trasformarsi immediatamente in replica, regioni e costi reali.

La disciplina quindi diventa ancora più importante:

> **La resilienza non si misura dal numero di meccanismi di recovery. Si misura da quanto bene il sistema mantiene il proprio contratto quando qualcosa va storto.**

Nel resto del capitolo costruiremo quel contratto e, soprattutto, stabiliremo come provarlo.