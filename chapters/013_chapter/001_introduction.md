# Capitolo 13 — Security by Design

Nel capitolo precedente abbiamo preso una decisione cloud concreta per Order Operations.

Abbiamo scelto Azure App Service, un WebJob continuo per il publisher dell'outbox, PostgreSQL gestito, Service Bus, managed identity, Key Vault e una prima topologia single-region.

Poi ci siamo fermati.

Non abbiamo ancora deciso:

- come entra il traffico;
- quali componenti possono essere raggiunti dalla rete pubblica;
- quali identity possono leggere secret;
- chi può modificare infrastruttura e runtime;
- come separare runtime identity e deployment identity;
- quali dati possono finire nei log;
- quali percorsi di egress sono ammessi;
- come ridurre il danno se una credenziale, una sessione o un componente viene compromesso.

Fermarsi lì non era incompletezza.

Era una decisione architetturale.

Un template IaC può essere generato in pochi secondi.

Un threat model no.

O meglio: anche un threat model può essere generato velocemente dall'AI, ma non può essere considerato corretto finché non abbiamo capito quali asset stiamo proteggendo, da chi, attraverso quali boundary e con quali conseguenze business.

Questa differenza è il tema del capitolo.

## Security non è una feature

Trattare la security come una feature porta quasi sempre a una sequenza sbagliata:

```text
costruiamo
→ integriamo
→ deployiamo
→ facciamo security review
→ scopriamo che il boundary è sbagliato
```

A quel punto correggere può significare cambiare:

- identity model;
- API contract;
- data ownership;
- network topology;
- pipeline;
- permission model;
- observability;
- deployment process.

Quindi il problema non è soltanto che la security review arriva tardi.

È che alcune decisioni di sicurezza **sono decisioni architetturali**.

Microsoft include il threat modeling nel proprio Security Development Lifecycle e lo presenta come modo per identificare e mitigare problemi quando sono ancora relativamente economici da correggere.

Fonte:

- [Microsoft Learn — Threat Modeling Tool](https://learn.microsoft.com/azure/security/develop/threat-modeling-tool)

NIST SSDF parte dallo stesso principio operativo: le pratiche di secure software development devono essere integrate nel ciclo di sviluppo, non aggiunte come attività isolata alla fine.

Fonte primaria:

- [NIST SP 800-218 — Secure Software Development Framework](https://csrc.nist.gov/pubs/sp/800/218/final)

## Secure by design non significa massimizzare ogni controllo

Anche qui dobbiamo evitare una religione.

Security by Design non significa:

```text
private endpoint ovunque
+ WAF ovunque
+ zero public access ovunque
+ approvazione manuale ovunque
+ segreti centralizzati ovunque
+ quindici scanner per pipeline
```

Significa qualcosa di più difficile:

> **Il sistema deve rendere espliciti asset, trust boundary, privilegi, minacce e mitigazioni prima che le scelte accidentali diventino superficie d'attacco.**

A volte il controllo giusto sarà un private endpoint.

A volte sarà una managed identity.

A volte sarà una policy di authorization applicativa.

A volte sarà semplicemente non raccogliere un dato che non ci serve.

A volte sarà impedire che un account amministrativo abbia privilegi permanenti.

A volte sarà accettare un endpoint pubblico ma autenticato, monitorato, rate-limited e con una superficie stretta.

Il controllo deve rispondere al rischio.

Non alla moda security del momento.

## Il compromesso ESI

Nel nostro scenario, Security chiede che Order Operations riduca il rischio di:

- accesso non autorizzato ai dati operativi;
- escalation di privilegio;
- uso improprio delle Payment Escalation;
- furto di credenziali o secret;
- movimento laterale da un componente compromesso;
- accesso amministrativo eccessivo;
- esfiltrazione attraverso log o egress;
- deployment malevoli o accidentali.

Platform Engineering vuole che i controlli siano:

- riusabili;
- automatizzabili;
- coerenti con la landing zone;
- verificabili tramite policy e IaC.

Commerce & Operations vuole invece preservare:

- velocità di delivery;
- operabilità;
- debugging;
- semplicità del deploy;
- autonomia del team.

Queste esigenze non sono incompatibili.

Ma non coincidono automaticamente.

Il compromesso del capitolo sarà quindi:

```text
ridurre esposizione e privilegio
senza trasformare ogni deploy in un progetto di security engineering separato
```

Il quality floor non è negoziabile:

- autenticazione forte;
- authorization esplicita;
- least privilege;
- nessun secret statico nel repository;
- tenant isolation;
- audit delle operazioni sensibili;
- separazione runtime/deployment identity;
- capacità di revoca;
- logging utile all'incident response senza leakage intenzionale;
- deployment verificabile;
- controlli coerenti con il threat model.

## Verify explicitly, least privilege, assume breach

Il Microsoft Azure Well-Architected Framework usa il modello Zero Trust come bussola e sintetizza tre principi:

1. verify explicitly;
2. use least privilege access;
3. assume breach.

Fonte:

- [Microsoft Learn — Security design principles](https://learn.microsoft.com/azure/well-architected/security/principles)

Il terzo punto è quello che cambia davvero il modo di progettare.

Se assumiamo che una identità, una sessione, un token, un workload o una workstation possano essere compromessi, la domanda non è più soltanto:

> Come impediamo l'accesso?

Diventa anche:

> **Quanto può fare un attaccante dopo il primo accesso?**

Questa è architettura.

## Il caso Cloudflare / Okta del 2023

Un esempio reale è utile proprio qui.

Nell'ottobre 2023 Cloudflare descrisse un incidente originato da un token di sessione compromesso nell'ambiente Okta. Secondo il postmortem pubblico, l'attaccante riuscì ad accedere all'istanza Okta di Cloudflare con una sessione amministrativa compromessa.

Cloudflare dichiarò però che nessun sistema o dato dei clienti fu impattato e attribuì la capacità di contenimento a detection rapida, risposta immediata e alla propria architettura Zero Trust, che contribuì a impedire l'accesso alla production network.

Fonte primaria:

- [Cloudflare — How Cloudflare mitigated yet another Okta compromise](https://blog.cloudflare.com/how-cloudflare-mitigated-yet-another-okta-compromise/)

La lezione non è:

```text
usa il prodotto X
```

È:

> **Una identità compromessa non deve implicare automaticamente il controllo di tutto il sistema.**

Il blast radius dipende dai boundary che abbiamo progettato prima dell'incidente.

## Security come capacità condivisa

Come per l'analisi funzionale, la sicurezza può avere specialisti.

Ma la comprensione del rischio non può essere posseduta da un unico team.

Developer, architect, Platform, Security e Operations devono condividere almeno:

- asset;
- trust boundary;
- identity flow;
- privilege model;
- dati sensibili;
- operazioni pericolose;
- failure mode di sicurezza;
- procedure di revoca e recovery.

Se soltanto Security sa perché un controllo esiste, il controllo sarà fragile.

Se soltanto il team applicativo conosce davvero il journey, il threat model sarà incompleto.

## Cosa costruiremo

In questo capitolo passeremo da:

```text
cloud topology ancora security-neutral
```

a:

```text
threat model
→ identity model
→ authorization boundary
→ data/secrets protection
→ ingress/egress decision
→ secure development controls
→ Security Control Matrix
→ first deployable security baseline in IaC
```

Order Operations riceverà quindi:

- un **Threat Model**;
- una **Security Control Matrix**;
- un ADR sulla security topology;
- una prima baseline Bicep concreta;
- controlli espliciti su identity, secret e access path.

Non proveremo a rendere il sistema “sicuro per sempre”.

Proveremo a renderlo **difendibile, verificabile e migliorabile**.

## Prima frase da ricordare

> **Security by Design non significa aggiungere più controlli. Significa fare in modo che il sistema conosca i propri confini prima che li scopra un attaccante.**