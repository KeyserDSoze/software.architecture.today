## Identity, authentication e authorization

Nel cloud la rete non è più un perimetro sufficiente.

Microsoft raccomanda esplicitamente di considerare l'identità come primary security perimeter per le applicazioni cloud e di applicare least privilege sia agli utenti sia ai workload.

Fonte:

- [Microsoft Learn — Design secure applications on Azure](https://learn.microsoft.com/azure/security/develop/secure-design)

Per Order Operations questo significa distinguere almeno tre domande:

```text
Chi sei?
→ authentication

Che cosa puoi fare?
→ authorization

Con quale identità il workload parla agli altri servizi?
→ workload identity
```

Confonderle produce sistemi che sembrano protetti ma non lo sono.

## Authentication non è authorization

Un utente autenticato non è automaticamente autorizzato a:

- vedere ogni tenant;
- creare una Payment Escalation;
- vedere dati economici;
- amministrare il sistema;
- modificare configurazione;
- accedere ai log;
- eseguire deployment.

Quindi:

```text
valid token
≠ valid permission
```

L'applicazione deve verificare almeno:

- issuer;
- audience;
- validità temporale;
- identity;
- ruoli/claim necessari;
- relazione dell'attore con la risorsa richiesta.

## Authorization server-side

Il client può dire:

```json
{
  "tenantId": "tenant-b"
}
```

ma questo non rende l'utente membro di `tenant-b`.

La regola deve essere:

```text
security context
+ authoritative resource ownership
→ authorization decision
```

Non:

```text
campo inviato dal browser
→ authorization decision
```

Per il capstone questo significa che `caseId` viene risolto server-side e il tenant effettivo viene verificato rispetto all'identità autorizzata.

## Least privilege come riduzione del blast radius

Least privilege viene spesso presentato come principio morale:

> non dare più permessi del necessario.

È meglio leggerlo come proprietà di containment.

Se una identity viene compromessa, il privilegio che possiede determina il blast radius.

Quindi un ruolo corretto deve essere definito rispetto a:

```text
identity
+ resource
+ action
+ scope
+ duration
```

Microsoft Well-Architected raccomanda privilegi minimi per identità corrette, permission corrette, durata corretta e asset corretti; raccomanda inoltre di ridurre standing privilege dove possibile.

Fonte:

- [Microsoft Learn — Architecture strategies for identity and access management](https://learn.microsoft.com/azure/well-architected/security/identity-access)

## Human identity

Per ESI, gli operatori usano Microsoft Entra ID.

Il modello iniziale distingue:

### Operations Operator

Può:

- leggere i casi autorizzati;
- investigare;
- creare una Payment Escalation quando le precondizioni sono soddisfatte.

Non può:

- modificare infrastruttura;
- leggere secret;
- cambiare RBAC cloud;
- eseguire refund;
- cambiare arbitrariamente tenant.

### Operations Supervisor

Può avere capability aggiuntive di:

- escalation;
- reassignment;
- visibility più ampia;
- override operativi esplicitamente documentati.

Non significa `admin = true`.

Ogni capability privilegiata deve avere un significato.

## Workload identity

Order Operations deve parlare con:

- Key Vault;
- Service Bus;
- PostgreSQL;
- observability services;
- eventuali API interne.

La domanda sbagliata è:

> Dove mettiamo la password del service principal?

La domanda migliore è:

> **Possiamo evitare di avere una password?**

Microsoft App Service supporta managed identity per autenticarsi verso altri servizi Azure senza memorizzare credenziali nel codice o nella configurazione.

Fonte:

- [Microsoft Learn — Secure your Azure App Service deployment](https://learn.microsoft.com/azure/app-service/overview-security)

Quindi la runtime identity di Order Operations deve essere una managed identity con accesso soltanto alle capability necessarie.

## Runtime identity ≠ deployment identity

Questo boundary è fondamentale.

La runtime identity deve poter:

```text
read required secrets
send messages
read/write workload data
emit telemetry
```

Non dovrebbe poter:

```text
create App Service
change network topology
assign RBAC
modify Key Vault policy
replace deployment package arbitrariamente
```

La deployment identity, viceversa, ha bisogno di privilegi sul control plane ma non dovrebbe avere automaticamente accesso ai business data.

Quindi:

> **Il processo che esegue il software e il processo che modifica l'infrastruttura non devono avere lo stesso potere.**

## Identity per componente

Microsoft Well-Architected per App Service raccomanda identity distinte per mantenere isolation boundary ed evitare il riuso indiscriminato della stessa identity fra applicazioni.

Fonte:

- [Microsoft Learn — App Service architecture best practices](https://learn.microsoft.com/azure/well-architected/service-guides/app-service-web-apps)

Per Order Operations questo apre una decisione interessante.

API e WebJob potrebbero condividere la stessa identity perché vivono nello stesso App Service lifecycle.

Ma i privilegi non sono identici:

```text
API
→ read/write operational state
→ receive user requests

Outbox Publisher
→ read outbox
→ publish to Service Bus
```

Finché restano nello stesso runtime, accettiamo un privilege envelope comune.

Questo è un costo esplicito della scelta App Service + WebJob.

Trigger di revisione:

- publisher diventa processo separato;
- messaging privilege diventa più sensibile;
- nuovi worker ricevono privilegi differenti;
- blast radius della identity condivisa diventa inaccettabile.

## Administrative identity

Gli amministratori sono spesso le identity più pericolose perché possiedono capability ad alto impatto.

Dobbiamo quindi distinguere:

```text
workload operator
platform operator
security operator
deployment automation
break-glass identity
```

Il fatto che una persona sia developer non implica che debba avere accesso permanente alla produzione.

Il fatto che una persona possa fare deployment non implica che debba poter leggere Key Vault secret.

Il fatto che una persona amministri Azure non implica che debba vedere i business data di tutti i tenant.

## Break-glass

Least privilege non deve impedirci di recuperare il sistema.

Per questo può servire una break-glass identity.

Ma deve essere:

- rara;
- fortemente protetta;
- monitorata;
- non usata per il lavoro quotidiano;
- soggetta a procedure e alert.

Una porta di emergenza che viene usata ogni martedì è semplicemente la porta principale con meno controlli.

## Sessione compromessa

Il caso Cloudflare/Okta del 2023 mostra perché identity architecture non può fermarsi alla login page.

Cloudflare riferì che un attaccante utilizzò una sessione Okta compromessa con privilegi amministrativi; la società descrisse però la capacità di rilevare e contenere l'incidente e di impedire accesso alla production network.

Fonte primaria:

- [Cloudflare — How Cloudflare mitigated yet another Okta compromise](https://blog.cloudflare.com/how-cloudflare-mitigated-yet-another-okta-compromise/)

Il punto per ESI è:

```text
identity valid-looking
≠ trust illimitata
```

Verify explicitly e assume breach significano che una sessione valida continua ad attraversare boundary e permission check.

## Authorization testable

L'authorization non è completa finché non può essere verificata.

Per ogni capability sensibile dobbiamo avere test almeno per:

```text
allowed actor + allowed tenant → allowed
allowed actor + wrong tenant   → denied
wrong role + allowed tenant    → denied
no identity                    → denied
stale/invalid token            → denied
```

Quando entrerà il Capitolo Testing, questi scenari diventeranno executable security requirements.

## Una regola pratica

Per ogni identity nel sistema chiediamo:

> **Se questa identità viene compromessa oggi, qual è la cosa peggiore che può fare?**

Se la risposta è:

```text
"praticamente tutto"
```

least privilege non è ancora stato progettato.