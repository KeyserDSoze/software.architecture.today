## Secret, dati e log: ridurre ciò che può essere esposto

Una security architecture debole tratta tutto come “sensibile” e finisce per proteggere male tutto nello stesso modo. Una security architecture utile distingue invece che cosa stiamo custodendo, perché ci serve e quale danno produrrebbe l’esposizione.

Per Order Operations possiamo avere documentazione tecnica a bassa sensibilità, configurazione interna, dati operativi confidenziali e asset ad alto impatto come token, secret, riferimenti payment-adjacent o audit privilegiato. La classificazione non serve a riempire una tabella: deve cambiare chi può leggere il dato, dove può transitare, quanto viene conservato e quale audit richiede.

Microsoft Well-Architected raccomanda di classificare i dati e applicare access control ed encryption coerenti con rischio e trust boundary.

Fonte:

- [Microsoft Learn — Security design principles](https://learn.microsoft.com/azure/well-architected/security/principles)

## La prima protezione è non raccogliere ciò che non ci serve

Se Order Operations ha bisogno di sapere che `paymentStatus = Failed`, non segue che debba possedere PAN, provider credential, payload economici completi o dettagli non necessari all’investigazione. Ogni campo raccolto aggiunge storage, access control, retention, backup, privacy obligation e breach impact.

La data minimization riduce quindi il blast radius **prima** che encryption e authorization debbano proteggerlo.

Questa è una delle forme più forti di Security by Design: eliminare l’asset che non produce valore.

## Il secret migliore è quello che non esiste

Lo stesso principio vale per le credenziali. Prima di progettare un secret store chiediamo se una workload identity o federation possano eliminare la credenziale statica.

Microsoft documenta l’uso delle managed identity con App Service proprio per evitare la gestione diretta di password o client secret verso servizi Azure.

Fonte:

- [Microsoft Learn — Secure your Azure App Service deployment](https://learn.microsoft.com/azure/app-service/overview-security)

Quando il secret rimane inevitabile — per esempio un’API key di un provider esterno — il requisito non è semplicemente “mettilo in Key Vault”. Servono owner, consumer, scope, rotation, revocation, audit e comportamento durante indisponibilità del vault.

## Un vault non corregge un permission model sbagliato

Mettere una credenziale in Key Vault non serve se runtime, pipeline e developer possono leggerla senza distinzione. Microsoft mostra pattern in cui App Service usa managed identity verso Key Vault e accesso all’applicazione e accesso ai secret possono rimanere separati.

Fonte:

- [Microsoft Learn — App Service + Key Vault secure connection](https://learn.microsoft.com/azure/app-service/tutorial-connect-overview)

> **Il vault protegge il contenitore. L’authorization protegge il contenuto.**

Il lifecycle della credenziale deve inoltre essere indipendente dal lifecycle del codice: poter ruotare o revocare senza rebuild dell’applicazione è parte del valore del secret store.

## Encryption è baseline, non una conclusione

TLS e encryption at rest proteggono rispettivamente canali e dati persistiti rispetto a specifiche classi di accesso. Non risolvono authorization errata, token rubati, SQL injection, logging indiscriminato o una identity legittima ma troppo privilegiata.

Dire “i dati sono encrypted” dice quindi poco sulla capability di un attore autorizzato ad ottenerne la decrittazione.

Il vero boundary resta chi può chiedere al sistema di leggere o trasformare quel dato.

## I log sono un datastore con un modello di rischio proprio

Application log e telemetry possono contenere token, header Authorization, email, tenant identifier, payload, stack trace, connection string o correlazioni che altrove non esistono nello stesso posto. Per questo il logging deve avere una policy di minimizzazione, retention e accesso.

Per il flusso Payment Escalation vogliamo poter correlare `caseId`, `escalationId`, outcome tecnico, latency, retry e sanitized error code. Non abbiamo bisogno di access token, password, provider secret o payload economici completi.

Microsoft raccomanda logging e resource log per investigazione e accountability, ma la capacità di osservare non implica registrare indiscriminatamente tutto.

Fonte:

- [Microsoft Learn — App Service architecture best practices](https://learn.microsoft.com/azure/well-architected/service-guides/app-service-web-apps)

## Audit e application log raccontano promesse differenti

Un log che dice “request completed in 180 ms” serve all’operability. Un audit record che dice quale operatore ha richiesto una Payment Escalation, per quale case, quando e con quale esito serve a accountability e non-repudiation.

I due flussi possono avere retention, consumer, sensitivity e integrità differenti. `console.log()` non diventa un audit trail soltanto perché contiene un user id.

Per questo la telemetry dovrebbe essere costruita per allowlist: generiamo esplicitamente l’oggetto che vogliamo osservare invece di serializzare l’intera request e provare a redigere campi dopo. Questa scelta rende più facile anche per test e agenti AI verificare leakage potenziali.

## Security e reliability si incontrano nel lifecycle dei secret

Se Key Vault diventa temporaneamente indisponibile, il comportamento dipende dalla credenziale. Un secret già materializzato in memoria può restare valido fino a scadenza; una capability specifica può degradare; un startup può dover fallire se il secret è indispensabile. Non esiste una risposta unica.

Il punto è che il secret store aggiunge un dependency failure mode, quindi security e reliability devono condividere il modello del sistema.

Una domanda pratica chiude bene la sezione:

> **Se questo dato finisse domani in un incident report pubblico, ci chiederemmo perché lo stavamo raccogliendo?**

Se sì, la prima review dovrebbe riguardare la necessità del dato, non soltanto il modo in cui lo cifriamo.