## Threat modeling: progettare contro un avversario plausibile

La security architecture inizia quando smettiamo di chiedere soltanto:

> Il sistema funziona?

E iniziamo a chiedere:

> **Come può essere abusato, da chi e con quale impatto?**

Il threat modeling serve a rendere questa domanda ripetibile.

Microsoft lo descrive come processo per identificare minacce potenziali e assicurare che esistano mitigazioni appropriate; distingue inoltre il threat modeling dall'attack surface analysis, che si concentra sulle aree più esposte all'attacco.

Fonte:

- [Microsoft Learn — Design secure applications on Azure](https://learn.microsoft.com/azure/security/develop/secure-design)

## Prima gli asset

Un threat model che parte dalle tecnologie tende a produrre controlli generici.

Per Order Operations partiamo invece dagli asset.

Esempi:

```text
OperationalCase
PaymentEscalation
operator identity
supervisor identity
tenant boundary
outbox messages
audit trail
deployment pipeline
runtime identity
external provider credentials
infrastructure configuration
```

Gli asset non sono tutti dati.

Anche una capability può essere un asset.

Per esempio:

```text
"creare una Payment Escalation"
```

è una capability che non deve essere disponibile a chiunque riesca a chiamare un endpoint.

## Poi gli attori

Dobbiamo distinguere almeno:

- Operations Operator legittimo;
- Operations Supervisor;
- workload identity;
- deployment identity;
- Platform administrator;
- Security administrator;
- Payments & Risk consumer;
- provider esterno;
- attaccante anonimo;
- account interno compromesso;
- pipeline compromessa;
- dipendenza software compromessa.

La distinzione è importante perché una minaccia non richiede sempre un “hacker esterno”.

Un account interno con privilegi eccessivi può avere un blast radius maggiore di una richiesta anonima su Internet.

## Trust boundary

Un trust boundary è un punto in cui cambiano le assunzioni di fiducia.

Esempio semplificato:

```text
Corporate user device
        ↓
Identity provider
        ↓
Application ingress
        ↓
Order Operations runtime
        ↓
PostgreSQL / Service Bus / Key Vault
        ↓
Payments & Risk
```

Ogni freccia merita domande:

- chi autentica chi?
- quale identity viene propagata?
- quale authorization viene applicata?
- quale dato attraversa il boundary?
- il canale è cifrato?
- il chiamante può scegliere liberamente il target?
- quali log vengono prodotti?
- che cosa succede se il token viene rubato?
- che cosa succede se il componente a monte viene compromesso?

La rete è soltanto uno dei boundary.

Esistono anche boundary:

- organizzativi;
- di tenant;
- di privilegi;
- di deployment;
- di dati;
- di supply chain.

## STRIDE come lente, non come checklist rituale

Microsoft Threat Modeling Tool usa STRIDE come metodologia guidata.

Le categorie sono:

```text
S — Spoofing
T — Tampering
R — Repudiation
I — Information Disclosure
D — Denial of Service
E — Elevation of Privilege
```

Fonte:

- [Microsoft Learn — Threat Modeling Tool threats / STRIDE](https://learn.microsoft.com/azure/security/develop/threat-modeling-tool-threats)

Possiamo applicarle a una Payment Escalation.

### Spoofing

Un attaccante impersona un operatore.

Domande:

- come viene autenticato l'utente?
- il token è destinato alla nostra API?
- la sessione può essere riutilizzata da un altro device?

### Tampering

Il payload viene modificato o un attaccante cambia `tenantId`, `caseId` o reason.

Domande:

- il tenant arriva davvero dal client o dal security context?
- il case appartiene al tenant?
- il server ricostruisce le decisioni sensibili da dati autorevoli?

### Repudiation

Un operatore nega di avere creato una escalation.

Domande:

- abbiamo actor id, timestamp e correlation id?
- l'audit è separato dai normali application log?
- l'audit può essere modificato dallo stesso attore?

### Information Disclosure

Un utente vede casi di un altro tenant o i log contengono informazioni economiche non necessarie.

Domande:

- tenant isolation viene testata?
- i payload di log sono minimizzati?
- i secret sono esclusi dalla telemetria?

### Denial of Service

Un attore genera migliaia di escalation o query costose.

Domande:

- rate limiting?
- quota?
- queue backlog?
- database connection exhaustion?

### Elevation of Privilege

Un Operations Operator ottiene capability da Supervisor o privilegi cloud.

Domande:

- i ruoli applicativi sono distinti?
- runtime identity può modificare infrastruttura?
- deployment identity può leggere dati applicativi?

## Abuse case prima del controllo

Una tecnica molto utile è scrivere prima una frase di abuso.

Esempio:

> Un operatore compromesso tenta di creare una Payment Escalation per un `OperationalCase` appartenente a un altro tenant.

Solo dopo scegliamo la mitigazione:

```text
server-side tenant resolution
+ authorization sul case
+ audit
+ test cross-tenant negativi
```

Questo è più forte di una checklist tipo:

```text
[ ] authorization
```

perché conserva il motivo.

## Risk = likelihood × impact?

Le formule semplici possono aiutare, ma non devono dare una falsa precisione.

Per questo libro useremo una classificazione pragmatica:

```text
Impact:
Low / Medium / High / Critical

Likelihood:
Unlikely / Plausible / Likely

Disposition:
Mitigate / Accept / Avoid / Transfer / Investigate
```

Il valore non è il numero.

È rendere visibile che una minaccia con impatto economico o cross-tenant può ricevere priorità maggiore di un finding tecnicamente interessante ma poco rilevante.

## Non tutto va mitigato allo stesso modo

Una minaccia può essere:

- eliminata cambiando il design;
- ridotta con un controllo preventivo;
- rilevata con monitoring;
- contenuta riducendo privilegi;
- recuperata con una procedura;
- accettata consapevolmente.

Esempio:

```text
Minaccia:
furto di password database dall'app

Design alternativo:
preferire workload identity / Entra auth quando supportato
```

Qui non stiamo “proteggendo meglio il secret”.

Stiamo provando a eliminare il secret.

## Threat model vivo

Il threat model cambia quando cambia:

- un actor;
- un endpoint;
- una business capability;
- un provider;
- una identity;
- una rete;
- un datastore;
- un deployment path;
- una dependency;
- una data classification.

Quindi non è un PDF prodotto prima del go-live e poi archiviato.

È una rappresentazione dell'architettura di rischio corrente.

## AI-assisted threat modeling

L'AI può aiutare molto a:

- enumerare threat candidate;
- applicare STRIDE a un diagramma;
- cercare trust boundary dimenticati;
- generare abuse case;
- confrontare IaC con il threat model;
- cercare privilegi eccessivi;
- identificare secret leakage;
- generare negative test candidate.

Ma il rischio è evidente.

Se il contesto è incompleto, l'agente produce una threat list plausibile ma generica.

Quindi:

> **L'AI può accelerare l'enumerazione delle minacce. Il team deve ancora decidere quali conseguenze sono realmente intollerabili.**

## Una regola pratica

Per ogni trust boundary dovremmo riuscire a completare questa frase:

> Se il lato sinistro viene compromesso, il lato destro resta protetto da ________.

Se la risposta è soltanto:

```text
"perché è nella nostra rete"
```

abbiamo probabilmente bisogno di pensare meglio al boundary.