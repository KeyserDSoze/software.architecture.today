# Recovery, RTO, RPO, backup, restore e disaster recovery

High availability e recovery non sono la stessa cosa.

Un sistema può avere failover automatico e non saper recuperare da:

- corruption logica;
- bad deployment;
- credential compromise;
- cancellazione accidentale;
- configurazione distruttiva;
- region-wide disaster.

## RTO

**Recovery Time Objective** risponde alla domanda:

> **Quanto tempo possiamo restare sotto il livello di servizio accettabile prima che il danno diventi troppo alto?**

Non è necessariamente il tempo tecnico di restart.

Include ciò che serve per:

```text
detect
→ diagnose
→ decide
→ execute recovery
→ validate
→ restore service
```

## RPO

**Recovery Point Objective** risponde invece:

> **Quanta perdita di dati, espressa come intervallo temporale, può essere accettabile nello scenario di recovery considerato?**

RTO e RPO devono essere definiti rispetto al failure scenario.

Esempio:

```text
process crash
RTO = secondi/minuti
RPO = 0
```

può essere diverso da:

```text
region loss
RTO = ore
RPO = minuti
```

per lo stesso prodotto.

Microsoft definisce RTO e RPO come metriche di reliability e recovery del workload, collegate al business impact.

Fonte:

- [Microsoft Learn — Monitoring workload reliability](https://learn.microsoft.com/azure/well-architected/reliability/monitoring)

## Backup ≠ restore

Avere file di backup significa che possediamo un artefatto.

Non significa che sappiamo recuperare.

Una recovery strategy deve rispondere anche a:

```text
chi avvia il restore?
con quali permission?
in quale environment?
come scegliamo il restore point?
quanto tempo impiega?
come validiamo i dati?
come reindirizziamo il traffico?
che cosa succede ai messaggi prodotti nel frattempo?
come riconciliamo gli stati?
```

> **Un backup non testato è una speranza compressa in storage.**

## Failure diversi, meccanismi diversi

### Node failure

Possibile risposta:

```text
standby / automatic failover
```

### Availability-zone failure

Possibile risposta:

```text
zone redundancy
```

### Logical corruption

Possibile risposta:

```text
point-in-time restore
```

### Bad application deployment

Possibile risposta:

```text
rollback / deployment slot / previous artifact
```

### Region loss

Possibile risposta:

```text
cross-region recovery / secondary deployment
```

La parola “DR” non può sostituire questa classificazione.

## PostgreSQL in Azure

Azure Database for PostgreSQL Flexible Server supporta configurazioni HA con primary e standby. Microsoft documenta che la modalità zone-redundant replica sincronicamente verso una standby in un'altra availability zone nella stessa regione e può eseguire failover automatico in caso di failure del primary.

La documentazione corrente indica per la zone-redundant HA un recovery da zone failure tipicamente nell'ordine di 60–120 secondi con zero data loss per il meccanismo HA; questo non sostituisce il restore da errori logici.

Fonti:

- [Microsoft Learn — PostgreSQL High Availability](https://learn.microsoft.com/azure/postgresql/high-availability/concepts-high-availability)
- [Microsoft Learn — Azure Database for PostgreSQL overview](https://learn.microsoft.com/azure/postgresql/overview)

Il punto architetturale è importante:

```text
standby replica
```

può proteggere da un node/zone failure.

Se eseguiamo:

```sql
DELETE FROM important_table;
```

la replica può replicare correttamente la cancellazione.

Per quel failure serve una recovery strategy diversa.

## Point-in-time restore

Azure Database for PostgreSQL offre point-in-time restore entro la retention configurata.

Microsoft documenta backup retention e restore come meccanismi di business continuity separati dalla HA.

Fonte:

- [Microsoft Learn — PostgreSQL Business Continuity](https://learn.microsoft.com/azure/postgresql/backup-restore/concepts-business-continuity)

Per ESI dovremo quindi testare almeno:

```text
create backup/recovery point
→ simulate logical mistake
→ restore to new server
→ validate schema/data
→ decide cutover path
```

Non basta verificare che l'opzione `backup` sia abilitata.

## Service Bus e region failure

Azure Service Bus offre zone redundancy all'interno della regione e, per scenari multi-region, capability distinte come Geo-Replication e Metadata Geo-Disaster Recovery nel tier Premium.

Microsoft sottolinea una differenza molto importante:

```text
metadata replication
≠
message data replication
```

Fonte:

- [Microsoft Learn — Reliability in Azure Service Bus](https://learn.microsoft.com/azure/reliability/reliability-service-bus)

Questa distinzione impedisce un errore comune:

> “Abbiamo configurato geo-DR, quindi i messaggi sono sicuramente al sicuro.”

Dipende dal meccanismo scelto.

## Outbox come recovery source

Order Operations ha già una proprietà interessante.

La source business della Payment Escalation vive nel database locale insieme all'outbox.

Se un messaggio non è stato consegnato ma il database è integro, possiamo ricostruire l'intenzione di delivery.

Questo significa che, in alcuni scenari:

```text
PostgreSQL durable state
```

è più importante della sopravvivenza immediata della singola copia nel broker.

Non significa che possiamo ignorare Service Bus reliability.

Significa che la recovery architecture conosce la propria **source of recovery**.

## Recovery source

Per ogni dato/processo dovremmo poter rispondere:

```text
che cosa ricostruiamo?
da quale fonte?
con quale versione?
con quale ordering?
con quale reconciliation?
```

Esempi ESI:

### OperationalCase

```text
source = PostgreSQL backup/primary state
```

### Payment Escalation publication intent

```text
source = PaymentEscalation + OutboxMessage
```

### Payments downstream workflow

```text
source = Payments & Risk authoritative state
```

### IaC

```text
source = repository + approved parameters + landing-zone baseline
```

### Application binary

```text
source = trusted build artifact / release
```

## DR runbook

Un disaster-recovery plan non deve essere soltanto un diagramma.

Serve almeno una sequenza operativa.

Esempio semplificato:

```text
1. declare incident
2. classify failure domain
3. freeze risky writes/deployments
4. identify recovery point
5. provision/activate recovery target
6. restore data/config
7. validate identity/network/dependencies
8. run synthetic critical journey
9. reopen traffic
10. reconcile backlog/divergence
11. monitor recovery load
12. post-incident review
```

Ogni step deve avere owner e permission.

## RTO/RPO ESI — prima decisione

Fino al Capitolo 13 abbiamo lasciato RTO/RPO aperti per non inventare numeri prematuramente.

Adesso il capitolo Reliability deve trasformarli in una prima decisione di business simulata.

Per la **prima fase production di Order Operations**, ESI stabilisce come target iniziali:

### Failure intra-region ordinario

Per failure coperti dalla HA del workload:

```text
RTO target: <= 15 minuti per il core operator journey
RPO target: 0 per transazioni committed di OperationalCase / PaymentEscalation
```

Il target non significa che ogni componente deve recuperare in 15 minuti.

Significa che il journey deve tornare entro quel limite o passare a una modalità esplicitamente accettata dal business.

### Region-wide disaster

La prima fase resta single-region.

ESI accetta un target più rilassato:

```text
RTO target: <= 8 ore
RPO target: <= 1 ora
```

**Questi numeri sono requisiti simulati del capstone**, non benchmark né raccomandazioni universali.

La conseguenza architetturale è importante:

> **non compriamo ancora active-active multi-region.**

Costruiamo invece una recovery path documentata e testabile.

## Perché questa asimmetria

Product e Operations dichiarano che:

- failure di instance/zone durante il normale lavoro devono essere assorbiti rapidamente;
- un region-wide disaster è molto meno probabile e può tollerare recovery più lunga nella fase corrente;
- il prodotto è interno e non è il payment authorization path;
- Finance non giustifica oggi il costo di una topologia active-active.

È un compromesso.

Non una scorciatoia nascosta.

## Quality floor

Anche con RTO regionale di 8 ore non accettiamo:

- perdita non quantificata;
- restore mai testato;
- assenza di owner;
- credenziali di recovery improvvisate;
- documentazione non versionata;
- escalation accettate e poi dimenticate;
- recovery senza reconciliation.

## Recovery test

Una recovery strategy deve produrre evidence.

Per Order Operations entreranno progressivamente:

```text
restore test PostgreSQL
outbox reconciliation test
service redeploy from IaC
synthetic critical journey after recovery
known-good application rollback
```

Il test deve anche misurare:

```text
actual recovery time
actual recovered point
manual steps
failed assumptions
```

Questi dati ci diranno se RTO/RPO sono realistici.

## Region strategy trigger

Riapriremo la decisione single-region se cambia almeno uno fra:

- customer contract;
- business criticality;
- operator coverage globale;
- RTO regionale;
- RPO regionale;
- revenue impact;
- regulatory constraint;
- restore exercise troppo lento;
- Platform standard;
- cost curve.

## AI e DR

L'AI può generare in pochi minuti un runbook multi-region molto convincente.

Ma un runbook generato non sa:

- se le permission funzionano;
- se il backup è realmente ripristinabile;
- se la secondary region ha capacity;
- se il DNS cutover è corretto;
- se le dipendenze esterne sono presenti;
- se il team sa eseguire la procedura sotto pressione.

> **Il disaster recovery non è il documento che descrive il recovery. È la capacità dimostrata di recuperare.**

## Corollario

High availability riduce alcuni outage.

Backup e restore recuperano da altri.

Disaster recovery governa failure ancora più ampi.

Confonderli produce una falsa sensazione di sicurezza.