## Recovery, RTO, RPO, backup e disaster recovery

High availability e recovery non sono sinonimi. Un sistema può avere failover automatico e restare impreparato davanti a corruption logica, cancellazione accidentale, bad deployment, credential compromise o perdita di un’intera regione.

La prima distinzione da fare è quindi tra **continuare** e **tornare indietro da un failure**.

La HA cerca di mantenere il servizio attraverso alcune classi di guasto. La recovery parte invece dal presupposto che il sistema abbia già perso una proprietà importante e debba ricostruirla da una fonte affidabile.

## RTO e RPO sono proprietà del business failure scenario

Il **Recovery Time Objective** risponde a una domanda molto concreta:

> **Quanto tempo possiamo restare sotto il livello di servizio accettabile prima che il danno diventi troppo alto?**

Non coincide necessariamente con il tempo di restart di un processo. Include detection, diagnosi, decisione, esecuzione della recovery, validazione e riapertura del servizio.

Il **Recovery Point Objective** risponde invece a:

> **Quanta perdita di stato possiamo accettare nello scenario di recovery considerato?**

RTO e RPO devono quindi essere associati al failure domain. Per lo stesso prodotto possiamo avere:

```text
process/instance failure
RTO = minuti
RPO = 0
```

ed essere disposti ad accettare, per un region-wide disaster:

```text
RTO = ore
RPO = fino a un intervallo definito
```

Microsoft tratta RTO e RPO come reliability metric collegate al business impact del workload.

Fonte:

- [Microsoft Learn — Monitoring workload reliability](https://learn.microsoft.com/azure/well-architected/reliability/monitoring)

## “Abbiamo il backup” non è ancora una recovery strategy

Un backup dimostra che possediamo una copia. Non dimostra che il team sappia ripristinare un sistema utilizzabile.

La recovery deve sapere chi può avviare il restore, quale restore point scegliere, dove ripristinare, quali permission servono, come verificare i dati, come reindirizzare il traffico e come riconciliare messaggi o operazioni avvenuti nel frattempo.

> **Un backup non testato è una speranza compressa in storage.**

Questa distinzione diventa più chiara guardando failure differenti:

```text
node failure
→ replica / automatic failover

zone failure
→ zone redundancy

logical corruption
→ point-in-time restore

bad deployment
→ rollback / known-good artifact

region loss
→ regional recovery strategy
```

La parola `DR` non risolve questi casi con un solo meccanismo.

## PostgreSQL: la replica protegge da ciò per cui è stata costruita

Azure Database for PostgreSQL Flexible Server supporta configurazioni HA con primary e standby. Nella modalità zone-redundant, Microsoft documenta replica sincrona verso una standby in un’altra availability zone e failover automatico per i failure coperti dal meccanismo.

La documentazione corrente descrive recovery da zone failure tipicamente nell’ordine di 60–120 secondi e zero data loss per la replica sincrona; questa è una proprietà del meccanismo HA, non una promessa del nostro intero workload.

Fonti:

- [Microsoft Learn — PostgreSQL High Availability](https://learn.microsoft.com/azure/postgresql/high-availability/concepts-high-availability)
- [Microsoft Learn — Azure Database for PostgreSQL overview](https://learn.microsoft.com/azure/postgresql/overview)

Se però un’applicazione esegue una `DELETE` distruttiva o una migration corrompe logicamente i dati, la standby può replicare perfettamente l’errore. In quel caso il failover è inutile: serve un recovery point precedente.

Azure PostgreSQL offre point-in-time restore entro la retention configurata e lo tratta come capability di business continuity distinta dalla HA.

Fonte:

- [Microsoft Learn — PostgreSQL Business Continuity](https://learn.microsoft.com/azure/postgresql/backup-restore/concepts-business-continuity)

Per ESI questo significa che un vero drill non controlla soltanto una checkbox `backupEnabled`. Deve simulare un errore logico, ripristinare un server di recovery, validare schema e dati, misurare la durata e definire il percorso di cutover.

## Service Bus ricorda perché “geo” non basta come parola

Azure Service Bus offre resilienza zonale e, nel tier Premium, capability cross-region differenti come Geo-Replication e Metadata Geo-Disaster Recovery. Microsoft distingue esplicitamente la replica dei metadata dalla replica dei message data.

Fonte:

- [Microsoft Learn — Reliability in Azure Service Bus](https://learn.microsoft.com/azure/reliability/reliability-service-bus)

Questa distinzione è architetturalmente importante perché evita una conclusione superficiale:

```text
abbiamo configurato geo-DR
→ i messaggi sono sicuramente preservati
```

La risposta dipende da quale meccanismo abbiamo realmente scelto e da che cosa replica.

Order Operations ha però una proprietà ulteriore: il business fact `PaymentEscalation` e l’intenzione di pubblicarlo vivono durablemente in PostgreSQL tramite outbox. Se il broker perde temporaneamente continuità ma il database resta recuperabile, possiamo ricostruire la delivery a partire dalla source locale.

L’outbox non rende Service Bus irrilevante. Ci dice semplicemente qual è la **recovery source** per la publication intent.

## Ogni stato importante deve avere una recovery source

Un sistema è molto più facile da recuperare quando sappiamo da che cosa deve essere ricostruito.

Per ESI il modello è già leggibile:

| Stato/capability | Recovery source |
|---|---|
| OperationalCase | PostgreSQL authoritative local state / backup |
| PaymentEscalation | PostgreSQL authoritative local state / backup |
| publication intent | `outbox_message` |
| broker delivery | republish dalla durable outbox con `messageId` stabile |
| Payments workflow | Payments & Risk authoritative state |
| application | trusted build artifact |
| infrastructure | repository IaC + landing-zone baseline |
| secret inevitabili | Key Vault / processo di recovery del provider |

Questa mappa impedisce di inventare la recovery durante l’incidente.

## Il runbook deve descrivere una sequenza eseguibile

Un disaster-recovery diagram è utile per vedere la topologia. Il runbook deve invece dirci che cosa fare quando il tempo conta.

Una sequenza minima può essere:

```text
1. declare incident
2. classify failure domain
3. freeze risky writes/deployments quando necessario
4. identify recovery point/source
5. provision or activate recovery target
6. restore data/config/application
7. validate identity, network and dependencies
8. run synthetic critical journey
9. reopen traffic/work
10. reconcile backlog and divergence
11. observe recovery load
12. record evidence and follow-up
```

Ogni step deve avere owner e permission. Se la persona che deve eseguire il restore non possiede il privilege necessario o l’unica credenziale è dentro il sistema che stiamo cercando di recuperare, il runbook è incompleto.

## ESI decide finalmente i primi RTO/RPO

Nei Capitoli 12–13 avevamo lasciato volutamente aperti questi numeri. Ora la reliability architecture deve trasformarli in una decisione simulata di business.

Per i failure ordinari **intra-region** coperti dalla topology di produzione, ESI stabilisce:

```text
RTO core journey <= 15 minuti
RPO = 0 per OperationalCase / PaymentEscalation committed local state
```

Non significa che ogni singolo componente debba tornare perfetto entro quindici minuti. Significa che il journey deve rientrare nel livello accettabile o in una degraded mode esplicitamente concordata.

Per un **region-wide disaster**, la prima fase resta single-region e accetta target più rilassati:

```text
RTO <= 8 ore
RPO <= 1 ora
```

Questi sono **requisiti simulati ESI**, non benchmark né suggerimenti generali.

La loro funzione è far emergere una conseguenza architetturale precisa: con questi target non abbiamo ancora una ragione sufficiente per comprare active-active multi-region.

Product e Operations accettano che un evento regionale raro richieda una recovery più lunga; il prodotto è interno e non coincide con il payment authorization path; Finance non giustifica oggi replica e operational complexity permanenti per ottenere continuità regionale quasi immediata.

Questo è un compromesso dichiarato. Non una omissione mascherata.

## Il quality floor resta anche quando il target è permissivo

Un RTO di otto ore non autorizza perdita non quantificata, restore mai provati, owner assenti o recovery improvvisata. Non autorizza nemmeno a dimenticare Payment Escalation già accettate.

Il quality floor richiede:

```text
recovery source nota
restore procedure versionata
permission definite
reconciliation
trusted artifact/IaC
misura dell’actual RTO/RPO
evidence del drill
```

Solo l’esercizio ci dirà se i target scelti sono realistici.

Per questo Order Operations deve progressivamente eseguire almeno:

```text
PostgreSQL PITR / restore
outbox reconciliation
redeploy da IaC
known-good application rollback
synthetic critical journey dopo recovery
```

Ogni prova deve registrare tempo reale di recovery, punto recuperato, passi manuali e assunzioni risultate false.

## Quando riaprire la single-region decision

La decisione regionale cambia quando cambia il business, non quando compare un nuovo servizio nel catalogo cloud.

Riapriremo la topologia se si modificano materialmente contractual commitment, criticality, copertura geografica, RTO/RPO regionali, revenue impact, vincoli normativi, platform standard o se i restore drill dimostrano che non riusciamo a stare dentro l’envelope dichiarato.

## Cosa cambia con l’AI

Un agente può generare un runbook multi-region completo in pochi minuti. Non può dimostrare che la secondary region abbia capacity, che le permission funzionino, che il backup sia ripristinabile, che il DNS cutover sia corretto o che il team sappia eseguire la procedura sotto pressione.

> **Il disaster recovery non è il documento che descrive il recovery. È la capacità dimostrata di recuperare.**

HA, backup/restore e disaster recovery proteggono failure diversi. Il Reliability Contract deve tenerli separati perché, durante un incidente, scegliere il meccanismo sbagliato può essere peggio del failure iniziale.