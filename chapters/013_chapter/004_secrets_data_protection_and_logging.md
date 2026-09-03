## Secret, dati e log: proteggere ciò che vale davvero

Una delle abitudini peggiori nella security applicativa è trattare tutto come “sensibile” e poi proteggere male tutto allo stesso modo.

Serve invece classificare.

Per Order Operations abbiamo almeno:

```text
public / low sensitivity
→ documentazione tecnica non riservata

internal
→ configurazione operativa non sensibile

confidential
→ operational case data, user identifiers

high impact
→ token, secret, payment-related references, privileged audit data
```

La classificazione non serve a riempire una tabella.

Serve a decidere:

- chi può leggere;
- dove può transitare;
- dove può essere persistito;
- quanto può restare nei log;
- come viene cancellato;
- quale livello di audit richiede.

Microsoft Well-Architected raccomanda di classificare i dati e applicare controlli di accesso ed encryption coerenti con rischio e trust boundary.

Fonte:

- [Microsoft Learn — Security design principles](https://learn.microsoft.com/azure/well-architected/security/principles)

## Il secret migliore è quello che non esiste

Prima di progettare un secret store chiediamo:

> Possiamo sostituire questa credenziale con una workload identity?

Se sì, abbiamo eliminato:

- distribuzione;
- rotazione manuale;
- rischio di commit accidentale;
- copia in environment variable;
- gestione del ciclo di vita del secret.

Per i servizi Azure supportati, managed identity è quindi preferibile alla creazione di password applicative statiche.

Microsoft documenta esplicitamente l'uso di managed identity con App Service per evitare la gestione diretta delle credenziali verso altri servizi Azure.

Fonte:

- [Microsoft Learn — Secure your Azure App Service deployment](https://learn.microsoft.com/azure/app-service/overview-security)

## Quando un secret resta inevitabile

I provider esterni non sempre supportano federation o workload identity.

In quel caso un secret può essere necessario.

Il requisito non è semplicemente:

```text
"mettilo in Key Vault"
```

Dobbiamo definire:

- owner;
- consumer;
- scope;
- rotazione;
- revoca;
- audit;
- fallback;
- behavior durante indisponibilità del vault.

Per Order Operations usiamo Key Vault soltanto per i secret che non possiamo eliminare.

## Secret store ≠ permission model

Mettere un secret in Key Vault non serve se:

```text
tutti i developer possono leggerlo
+ runtime può leggere tutti i secret
+ pipeline può esportarlo
+ log può stamparlo
```

Microsoft mostra un pattern utile in cui App Service usa managed identity per accedere a Key Vault e gli amministratori dell'App Service possono essere separati dall'accesso ai secret del vault.

Fonte:

- [Microsoft Learn — App Service + Key Vault secure connection](https://learn.microsoft.com/azure/app-service/tutorial-connect-overview)

Questo è il punto importante:

> **Il vault protegge il contenitore. L'authorization protegge il contenuto.**

## Encryption at rest e in transit

Encryption è baseline, non strategia completa.

TLS protegge il canale da alcune classi di attacco.

Encryption at rest protegge i dati persistiti rispetto a specifici failure e access path.

Ma nessuna delle due risolve:

- authorization sbagliata;
- token compromesso;
- SQL injection;
- log leakage;
- identity eccessivamente privilegiata;
- export legittimo ma abusato.

Quindi evitare frasi tipo:

> “I dati sono sicuri perché sono encrypted.”

La domanda resta:

> Chi può chiedere al sistema di decrittarli?

## Data minimization

Ogni dato raccolto genera:

- storage;
- access control;
- retention;
- privacy obligation;
- backup;
- breach impact;
- debugging risk.

Se Order Operations ha bisogno di mostrare:

```text
paymentStatus = Failed
```

non significa che debba copiare:

- PAN;
- dettagli completi della transazione;
- credenziali provider;
- dati di pagamento non necessari al journey.

Data minimization è una tecnica di sicurezza architetturale perché riduce direttamente il blast radius.

## Log come data store

I log sono spesso trattati come output tecnico innocuo.

In realtà possono contenere:

- token;
- header Authorization;
- email;
- tenant id;
- payload;
- stack trace;
- connection string;
- correlation tra dati che altrove erano separati.

Quindi il logging deve avere una policy.

Per Order Operations:

### Consentito

- correlation id;
- escalation id;
- case id se classificato appropriamente;
- event type;
- outcome tecnico;
- latency;
- retry count;
- sanitized error code.

### Da evitare

- access token;
- refresh token;
- secret;
- full Authorization header;
- password;
- provider credential;
- payload economico non necessario;
- dati personali completi senza requisito.

Microsoft raccomanda logging e resource log per investigazione e accountability, ma questo non implica registrare indiscriminatamente tutto.

Fonte:

- [Microsoft Learn — App Service architecture best practices](https://learn.microsoft.com/azure/well-architected/service-guides/app-service-web-apps)

## Audit log ≠ application log

Un application log dice:

```text
request completed in 180 ms
```

Un audit log può dover dire:

```text
operator X
requested PaymentEscalation Y
for OperationalCase Z
at time T
with outcome Accepted
```

Le due cose hanno:

- retention diversa;
- consumer diversi;
- integrità diversa;
- sensitivity diversa.

Non dobbiamo assumere che `console.log()` sia un audit trail.

## Redaction

La redaction deve essere progettata prima del log emission.

Pattern pericoloso:

```text
log full object
→ prova a cancellare campi dopo
```

Meglio:

```text
construct explicit telemetry object
→ include only allowed fields
```

L'AI può aiutare a trovare possibili leakage cercando:

- logging di request/response complete;
- serializzazione indiscriminata;
- error objects;
- environment dump;
- connection string;
- secret names.

Ma serve una policy umana su cosa è ammesso.

## Rotation e revocation

Ogni credenziale inevitabile deve poter essere:

- ruotata;
- revocata;
- sostituita senza rebuild dell'applicazione;
- monitorata.

Il valore di Key Vault non è soltanto “nascondere il secret”.

È separare il lifecycle della credenziale dal lifecycle del codice.

## Security failure mode

Consideriamo:

```text
Key Vault non disponibile
```

Che cosa deve fare l'app?

Possibili strategie:

- usare secret già materializzato in memoria fino alla scadenza;
- fallire le sole capability che ne dipendono;
- bloccare startup se il secret è necessario all'avvio;
- degradare evitando chiamate esterne.

La risposta dipende dal secret.

Security e reliability si incontrano qui.

## Una regola pratica

Per ogni campo che persistiamo o logghiamo chiediamo:

> **Se questo dato finisse domani in un incident report pubblico, ci chiederemmo perché lo stavamo raccogliendo?**

Se sì, probabilmente dobbiamo rivalutare la necessità del dato prima di pensare a come cifrarlo.