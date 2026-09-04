## Identity, authentication e authorization

Nel cloud la rete non è più un perimetro sufficiente. Microsoft raccomanda di considerare l’identità come primary security perimeter e di applicare least privilege sia agli utenti sia ai workload.

Fonte:

- [Microsoft Learn — Design secure applications on Azure](https://learn.microsoft.com/azure/security/develop/secure-design)

Per Order Operations questo significa separare tre domande che spesso vengono confuse: **chi sei?**, **che cosa puoi fare?** e **con quale identità il workload parla agli altri servizi?**. Authentication, authorization e workload identity rispondono a problemi differenti.

## Un token valido non contiene tutta la decisione

Un utente autenticato non diventa automaticamente autorizzato a vedere ogni tenant, creare una Payment Escalation, leggere dati economici o modificare configurazione. Il server deve verificare issuer, audience e validità del token, ma deve anche correlare l’attore con la risorsa e con la capability richiesta.

Un `tenantId` inviato dal browser, per esempio, non crea alcun diritto. La decisione corretta nasce da security context e ownership autorevole della risorsa:

```text
identity verificata
+ case risolto server-side
+ tenant/resource relationship
+ capability richiesta
→ authorization decision
```

Questo è uno dei punti in cui l’analisi funzionale e la security architecture coincidono: per autorizzare correttamente dobbiamo conoscere la semantica del journey.

## Least privilege è containment

Least privilege viene spesso sintetizzato come “non dare più permessi del necessario”. È più utile leggerlo come meccanismo di contenimento: se una identity viene compromessa, i suoi permission definiscono la massima estensione del danno immediato.

Microsoft Well-Architected raccomanda di allineare identity, permission, scope, asset e durata, riducendo standing privilege quando possibile.

Fonte:

- [Microsoft Learn — Architecture strategies for identity and access management](https://learn.microsoft.com/azure/well-architected/security/identity-access)

Il ruolo corretto non è quindi un’etichetta generica `admin/user`. È la combinazione di **chi**, **su quale risorsa**, **quale azione**, **in quale scope** e, per i privilegi elevati, **per quanto tempo**.

## Human identity: capability prima dei ruoli generici

Nel modello iniziale ESI un Operations Operator può leggere i case autorizzati, investigare e richiedere una Payment Escalation quando le precondizioni sono soddisfatte. Non ottiene per questo accesso ai secret, al control plane Azure, al refund o a tenant arbitrari.

Un Supervisor può ricevere capability ulteriori — reassignment, visibility più ampia o override operativi documentati — ma non vogliamo trasformare `Supervisor` in un sinonimo di `admin = true`. Ogni privilegio aggiuntivo deve corrispondere a un comportamento del prodotto.

Questa granularità rende più leggibile anche il threat model: sappiamo quale escalation of privilege avrebbe un impatto reale.

## Workload identity: chiedere prima se la password può sparire

Order Operations deve parlare con Key Vault, Service Bus, PostgreSQL, observability e potenzialmente altre API aziendali. La domanda meno utile è dove conservare la password del service principal. La domanda migliore è se possiamo evitare la password.

Microsoft App Service supporta managed identity per autenticarsi verso servizi Azure senza memorizzare credenziali nel codice o nella configurazione.

Fonte:

- [Microsoft Learn — Secure your Azure App Service deployment](https://learn.microsoft.com/azure/app-service/overview-security)

La runtime identity riceve quindi accesso soltanto alle capability necessarie. Managed identity elimina una classe di secret, non la necessità di least privilege.

## Runtime e deployment identity non devono condividere il potere

Il runtime deve poter leggere o scrivere i dati necessari, recuperare gli eventuali secret, inviare Payment Escalation e produrre telemetry. Non dovrebbe poter assegnare RBAC, cambiare network exposure, creare infrastruttura o sostituire arbitrariamente il package in produzione.

La deployment identity ha il problema opposto: ha bisogno di privilegi sul control plane necessari al rilascio, ma non dovrebbe ereditare automaticamente accesso ai business data.

> **Il processo che esegue il software e il processo che modifica l’infrastruttura non devono avere lo stesso potere.**

Questa separazione protegge sia da runtime compromise sia da supply-chain/pipeline compromise.

## La scelta App Service + WebJob ha un costo di privilege envelope

Microsoft Well-Architected per App Service raccomanda identity distinte quando servono isolation boundary differenti.

Fonte:

- [Microsoft Learn — App Service architecture best practices](https://learn.microsoft.com/azure/well-architected/service-guides/app-service-web-apps)

Nel capstone API e WebJob vivono però nello stesso lifecycle App Service. Le loro esigenze non sono perfettamente identiche: l’API gestisce request utente e operational state; il publisher legge l’outbox e invia a Service Bus. Finché restano nello stesso runtime accettiamo un privilege envelope comune come costo della semplicità scelta nel Capitolo 12.

Questa decisione ha trigger chiari: se il publisher viene estratto, i messaging privilege diventano più sensibili o nuovi worker richiedono capability differenti, dovremo separare anche le identity.

## Administrative access: il privilegio permanente è un rischio proprio

Workload operator, Platform administrator, Security operator, deployment automation e break-glass identity svolgono lavori differenti. Il fatto che qualcuno sia developer non implica accesso permanente alla produzione; poter fare deployment non implica poter leggere Key Vault; amministrare Azure non implica dover leggere dati di tutti i tenant.

Una break-glass identity può essere necessaria per recuperare il sistema, ma deve essere rara, fortemente protetta, monitorata e fuori dal lavoro ordinario. Una porta di emergenza usata ogni settimana è semplicemente una porta principale con controlli peggiori.

## Una sessione valida può comunque essere ostile

Il caso Cloudflare/Okta del 2023 ricorda che una sessione apparentemente valida può essere stata rubata. Cloudflare descrisse un accesso alla propria istanza Okta tramite sessione amministrativa compromessa e la capacità di contenere l’incidente prima dell’accesso alla production network.

Fonte primaria:

- [Cloudflare — How Cloudflare mitigated yet another Okta compromise](https://blog.cloudflare.com/how-cloudflare-mitigated-yet-another-okta-compromise/)

La lezione per ESI è `valid-looking identity ≠ trust illimitata`. Ogni richiesta sensibile continua ad attraversare authorization, tenant boundary e permission scope anche dopo l’autenticazione.

## Authorization deve diventare evidence

Per ogni capability sensibile vogliamo negative test, non soltanto happy path. Un attore corretto sul tenant corretto deve essere ammesso; lo stesso attore sul tenant sbagliato deve essere negato; un ruolo insufficiente deve essere negato; assenza o invalidità dell’identità devono essere negate.

Questi scenari diventeranno executable security requirements nel capitolo sul testing.

La domanda pratica che chiude la sezione è semplice:

> **Se questa identity viene compromessa oggi, qual è la cosa peggiore che può fare?**

Se la risposta è “praticamente tutto”, il least privilege non è ancora un principio applicato: è soltanto una parola nel documento.